#!/usr/bin/env python3
"""
nmgallery-ts-builder
====================

Reads a target folder containing `projects/`, `artists/`, and `exhibitions/`
subfolders (each holding per-item JSON files, as produced by
nmgallery-folder-maker) and concatenates them into three ready-to-use
TypeScript data files:

    projects/*/project.json       ->  build/projects.ts     (export const PROJECTS)
    artists/*/artist.json         ->  build/artists.ts      (export const ARTISTS)
    exhibitions/*/exhibition.json ->  build/exhibitions.ts  (export const EXHIBITIONS)

Usage:
    nmgallery-ts-builder <target-folder> [-o build]

Schema translation (JSON -> .ts model):
    * title            -> name
    * assets           -> mediaGallery
    * img "x.jpg"      -> "media/<id>/x.jpg"
    * year             -> dropped
    * (project fields are re-ordered to match the reference projects.ts)

Output is a JS/TS object literal (UNQUOTED keys) — not strict JSON.
Items are emitted in alphabetical order by folder name.
"""

import argparse
import json
import os
import shutil
import sys


# --------------------------------------------------------------------------- #
#  ANSI colour helpers
# --------------------------------------------------------------------------- #
class C:
    """ANSI colour codes. Disabled when output isn't a TTY, or NO_COLOR is set."""

    _enabled = sys.stdout.isatty() and os.environ.get("NO_COLOR") is None

    RESET = "\033[0m"    if _enabled else ""
    BOLD = "\033[1m"     if _enabled else ""
    DIM = "\033[2m"      if _enabled else ""
    RED = "\033[31m"     if _enabled else ""
    GREEN = "\033[32m"   if _enabled else ""
    YELLOW = "\033[33m"  if _enabled else ""
    BLUE = "\033[34m"    if _enabled else ""
    MAGENTA = "\033[35m" if _enabled else ""
    CYAN = "\033[36m"    if _enabled else ""
    GREY = "\033[90m"    if _enabled else ""


def banner(text):
    print(f"\n{C.BOLD}{C.MAGENTA}{'═' * 60}{C.RESET}")
    print(f"{C.BOLD}{C.MAGENTA}  {text}{C.RESET}")
    print(f"{C.BOLD}{C.MAGENTA}{'═' * 60}{C.RESET}")


def step(text):
    print(f"{C.CYAN}▶ {C.RESET}{text}")


def ok(text):
    print(f"  {C.GREEN}✔ {C.RESET}{text}")


def info(text):
    print(f"  {C.GREY}{text}{C.RESET}")


def warn(text):
    print(f"{C.YELLOW}⚠ {text}{C.RESET}")


def error(text):
    print(f"{C.RED}✗ {text}{C.RESET}")


def prompt_yes_no(question, default=True):
    hint = f"{C.GREY}[Y/n]{C.RESET}" if default else f"{C.GREY}[y/N]{C.RESET}"
    while True:
        try:
            raw = input(f"{C.BOLD}{C.BLUE}? {C.RESET}{question} {hint}: ").strip().lower()
        except EOFError:
            raw = ""
        if not raw:
            return default
        if raw in ("y", "yes"):
            return True
        if raw in ("n", "no"):
            return False
        warn("  Please answer y or n.")


# --------------------------------------------------------------------------- #
#  Section config: (subfolder, json filename, const name, output file, order)
# --------------------------------------------------------------------------- #
PROJECT_ORDER = ["id", "name", "img", "desc", "artists",
                 "medium", "exhibitions", "mediaGallery", "links"]

SECTIONS = [
    ("projects",    "project.json",    "PROJECTS",    "projects.ts",    PROJECT_ORDER),
    ("artists",     "artist.json",     "ARTISTS",     "artists.ts",     None),
    ("exhibitions", "exhibition.json", "EXHIBITIONS", "exhibitions.ts", None),
]

# JSON -> .ts model translation rules
RENAME = {"title": "name", "assets": "mediaGallery"}
DROP = {"year"}


# --------------------------------------------------------------------------- #
#  Schema translation
# --------------------------------------------------------------------------- #
def transform_record(rec, order=None):
    """Apply the JSON->.ts schema translation to one record."""
    rid = rec.get("id", "")
    out = {}
    for k, v in rec.items():
        if k in DROP:
            continue
        if k == "img" and isinstance(v, str) and v:
            v = f"media/{rid}/{v}"
        out[RENAME.get(k, k)] = v

    if order:
        ordered = {k: out[k] for k in order if k in out}
        for k, v in out.items():          # keep any extra keys not in the template
            ordered.setdefault(k, v)
        return ordered
    return out


# --------------------------------------------------------------------------- #
#  JS/TS literal emitter (unquoted keys, NOT strict JSON)
# --------------------------------------------------------------------------- #
def js_string(s):
    """Double-quoted JS string with the minimal necessary escaping."""
    out = (s.replace("\\", "\\\\")
            .replace('"', '\\"')
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t"))
    return f'"{out}"'


def emit(value, indent):
    """Render a Python value as a JS literal. `indent` is the column of this
    value's own closing bracket/brace; children sit at indent + 2."""
    pad = " " * indent
    child = " " * (indent + 2)

    if isinstance(value, dict):
        if not value:
            return "{}"
        lines = [f"{child}{k}: {emit(v, indent + 2)}" for k, v in value.items()]
        return "{\n" + ",\n".join(lines) + "\n" + pad + "}"

    if isinstance(value, (list, tuple)):
        if not value:
            return "[\n\n" + pad + "]"   # matches the reference file's empty-array style
        items = [f"{child}{emit(v, indent + 2)}" for v in value]
        return "[\n" + ",\n".join(items) + "\n" + pad + "]"

    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "null"
    if isinstance(value, (int, float)):
        return str(value)
    return js_string(str(value))


def render_ts(const_name, records):
    """Render a full `export const NAME = [ ... ];` file."""
    if not records:
        return f"export const {const_name} = [];\n"
    body = ",\n".join("  " + emit(r, 2) for r in records)
    return f"export const {const_name} = [\n{body}\n];\n"


# --------------------------------------------------------------------------- #
#  Reading
# --------------------------------------------------------------------------- #
def gather_section(target, subfolder, json_name, order):
    """Return (records, folder_count) for one section, or (None, 0) if the
    subfolder doesn't exist. Aborts on malformed JSON."""
    section_dir = os.path.join(target, subfolder)
    if not os.path.isdir(section_dir):
        return None, 0

    folders = sorted(d for d in os.listdir(section_dir)
                     if os.path.isdir(os.path.join(section_dir, d)))
    records = []
    for folder in folders:
        jpath = os.path.join(section_dir, folder, json_name)
        if not os.path.isfile(jpath):
            warn(f"  {subfolder}/{folder}/ has no {json_name} — skipped.")
            continue
        try:
            with open(jpath, encoding="utf-8") as f:
                rec = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            error(f"Could not read {jpath}: {e}")
            sys.exit(1)
        records.append(transform_record(rec, order))
    return records, len(folders)


# --------------------------------------------------------------------------- #
#  Main
# --------------------------------------------------------------------------- #
def main():
    parser = argparse.ArgumentParser(
        prog="nmgallery-ts-builder",
        description="Concatenate generated JSON into projects.ts / artists.ts / exhibitions.ts.",
    )
    parser.add_argument("target", help="Folder containing projects/ artists/ exhibitions/")
    parser.add_argument("-o", "--out", default="build",
                        help="Output folder for the .ts files (default: build)")
    args = parser.parse_args()

    if not os.path.isdir(args.target):
        error(f"Target folder not found: {args.target}")
        sys.exit(1)

    # Safety: never let an overwrite of --out destroy the source folder.
    abs_target = os.path.abspath(args.target)
    abs_out = os.path.abspath(args.out)
    if abs_out == abs_target or abs_target.startswith(abs_out + os.sep):
        error("Refusing to run: the output folder is the target folder (or contains it).")
        info(f"target = {abs_target}")
        info(f"out    = {abs_out}")
        info("Overwriting the output would delete your source JSON. "
             "Choose a different -o, e.g. -o ts-build")
        sys.exit(1)

    banner("nmgallery-ts-builder")
    info(f"Target: {args.target}")

    # ----- read & transform -----
    sections = []   # (const_name, out_file, records, folder_count, present)
    for subfolder, json_name, const_name, out_file, order in SECTIONS:
        records, folder_count = gather_section(args.target, subfolder, json_name, order)
        present = records is not None
        sections.append((const_name, out_file, records or [], folder_count, present))

    if not any(present for *_, present in sections):
        error("None of projects/ artists/ exhibitions/ were found in the target folder.")
        sys.exit(1)

    # ----- plan -----
    banner("Plan")
    print(f"  {C.BOLD}Output folder{C.RESET} : {args.out}/")
    for const_name, out_file, records, folder_count, present in sections:
        if present:
            print(f"  {C.BOLD}{out_file}{C.RESET}  {C.GREY}—{C.RESET} "
                  f"export const {C.CYAN}{const_name}{C.RESET} "
                  f"({C.GREEN}{len(records)}{C.RESET} item(s))")
        else:
            print(f"  {C.GREY}{out_file}  — skipped (no matching folder){C.RESET}")

    # ----- preview one transformed record per section -----
    banner("Example output")
    for const_name, out_file, records, folder_count, present in sections:
        if not present or not records:
            continue
        print(f"\n  {C.BOLD}{out_file}{C.RESET} {C.GREY}(first of {len(records)}){C.RESET}")
        snippet = f"export const {const_name} = [\n  " + emit(records[0], 2) + ",\n  ...\n];"
        for line in snippet.splitlines():
            print(f"    {C.GREY}{line}{C.RESET}")

    # ----- confirm -----
    print()
    if not prompt_yes_no("Proceed and write the above?", default=True):
        error("Aborted — nothing was changed.")
        sys.exit(0)

    # ----- handle existing output folder -----
    if os.path.exists(args.out):
        print()
        warn(f"Output folder '{args.out}/' already exists.")
        if not prompt_yes_no(f"Overwrite '{args.out}/' and create a fresh one?", default=False):
            error("Aborted — nothing was changed.")
            sys.exit(1)
        shutil.rmtree(args.out)
        info(f"Removed existing '{args.out}/'")

    # ----- write -----
    banner("Writing")
    os.makedirs(args.out, exist_ok=True)
    for const_name, out_file, records, folder_count, present in sections:
        if not present:
            continue
        path = os.path.join(args.out, out_file)
        with open(path, "w", encoding="utf-8") as f:
            f.write(render_ts(const_name, records))
        ok(f"{out_file}  {C.GREY}({len(records)} item(s)){C.RESET}")

    banner("Done")
    print(f"  {C.GREEN}✔{C.RESET} TypeScript data written to {C.BOLD}{args.out}/{C.RESET}")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        error("Interrupted.")
        sys.exit(130)
