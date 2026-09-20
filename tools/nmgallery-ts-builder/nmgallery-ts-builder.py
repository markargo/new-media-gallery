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
    nmgallery-ts-builder <target-folder> [-o build] [--no-media]

Besides the three .ts files, it assembles <out>/media/<project-id>/ by copying
each project's header.jpg and gallery files (the paths referenced in the .ts),
ready to drop into a React app's public/media/.  --no-media skips this.

Schema translation (JSON -> .ts model), per entity:

  PROJECTS:
    title            -> name
    assets ["x.jpg"] -> mediaGallery ["media/<id>/x.jpg"]  (each prefixed)
    img "x.jpg"      -> "media/<id>/x.jpg"
    year             -> dropped
    order: id, name, img, desc, artists, medium, exhibitions, mediaGallery, links

  ARTISTS:
    first_name+last_name -> name ("First Last")
    bio, img, assets     -> dropped
    order: id, name, projects, links

  EXHIBITIONS:
    img "x.jpg"      -> "media/x.jpg"   (flat, no per-id subfolder)
    desc2            -> footer
    desc3            -> dropped
    start_date       -> startDate
    end_date         -> endDate
    assets           -> mediaGallery
    isFeatured       -> added, default true
    organizers, volunteers, venues -> dropped
    order: id, name, img, desc, footer, startDate, endDate,
           projects, mediaGallery, isFeatured, links

Output is a JS/TS object literal (UNQUOTED keys) — not strict JSON.
Empty arrays render as [];  non-empty arrays render one item per line.
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
#  Schema translation — one function per entity (see module docstring)
# --------------------------------------------------------------------------- #
def _media(*parts):
    """Join non-empty path parts under media/."""
    return "media/" + "/".join(p for p in parts if p)


def transform_project(rec):
    rid = rec.get("id", "")
    img = rec.get("img", "")
    return {
        "id": rid,
        "name": rec.get("title", ""),
        "img": _media(rid, img) if img else "",
        "desc": rec.get("desc", ""),
        "artists": rec.get("artists", []),
        "medium": rec.get("medium", ""),
        "exhibitions": rec.get("exhibitions", []),
        # each gallery file lives under media/<id>/ (bare filenames in project.json)
        "mediaGallery": [_media(rid, a) if a else a for a in rec.get("assets", [])],
        "links": rec.get("links", []),
    }


def transform_artist(rec):
    name = " ".join(p for p in (rec.get("first_name", ""),
                                rec.get("last_name", "")) if p).strip()
    return {
        "id": rec.get("id", ""),
        "name": name,
        "projects": rec.get("projects", []),
        "links": rec.get("links", []),
    }


def transform_exhibition(rec):
    img = rec.get("img", "")
    return {
        "id": rec.get("id", ""),
        "name": rec.get("name", ""),
        "img": _media(img) if img else "",     # flat: media/<filename>, no per-id folder
        "desc": rec.get("desc", ""),
        "footer": rec.get("desc2", ""),        # desc2 -> footer  (desc3 dropped)
        "startDate": rec.get("start_date", ""),
        "endDate": rec.get("end_date", ""),
        "projects": rec.get("projects", []),
        "mediaGallery": rec.get("assets", []),
        "isFeatured": rec.get("isFeatured", True),
        "links": rec.get("links", []),
    }


# Section config: (subfolder, json filename, const name, output file, transform)
SECTIONS = [
    ("projects",    "project.json",    "PROJECTS",    "projects.ts",    transform_project),
    ("artists",     "artist.json",     "ARTISTS",     "artists.ts",     transform_artist),
    ("exhibitions", "exhibition.json", "EXHIBITIONS", "exhibitions.ts", transform_exhibition),
]


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
            return "[]"
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
def gather_section(target, subfolder, json_name, transform):
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
        records.append(transform(rec))
    return records, len(folders)


# --------------------------------------------------------------------------- #
#  Media assembly
# --------------------------------------------------------------------------- #
def collect_media(sections, target, out):
    """Plan copies of files referenced by img / mediaGallery (paths under media/).
    Source is <target>/<subfolder>/<id>/<basename>; dest is <out>/<ref>.
    Returns (copies[(src,dst)], missing[(id,ref)])."""
    copies, missing, seen = [], [], set()
    empty = 0                         # projects with no gallery media yet (skipped)
    for subfolder, const_name, out_file, records, folder_count, present in sections:
        if not present or subfolder != "projects":
            continue
        for rec in records:
            rid = rec.get("id", "")
            gallery = [m for m in rec.get("mediaGallery", []) if isinstance(m, str)]
            if not gallery:           # not processed by the muxer yet — skip entirely
                empty += 1
                continue
            refs = ([rec["img"]] if isinstance(rec.get("img"), str) else []) + gallery
            for ref in refs:
                if not ref.startswith("media/") or ref in seen:
                    continue
                seen.add(ref)
                src = os.path.join(target, subfolder, rid, os.path.basename(ref))
                dst = os.path.join(out, ref)
                if os.path.isfile(src):
                    copies.append((src, dst))
                else:
                    missing.append((rid, ref))
    return copies, missing, empty


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
    parser.add_argument("--no-media", action="store_true",
                        help="Only write the .ts files; do not copy the media/ tree")
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
    sections = []   # (subfolder, const_name, out_file, records, folder_count, present)
    for subfolder, json_name, const_name, out_file, transform in SECTIONS:
        records, folder_count = gather_section(args.target, subfolder, json_name, transform)
        present = records is not None
        sections.append((subfolder, const_name, out_file, records or [], folder_count, present))

    if not any(present for *_, present in sections):
        error("None of projects/ artists/ exhibitions/ were found in the target folder.")
        sys.exit(1)

    # ----- plan media copies (files referenced by img / mediaGallery under media/) -----
    media_copies, media_missing, media_empty = ([], [], 0)
    if not args.no_media:
        media_copies, media_missing, media_empty = collect_media(sections, args.target, args.out)

    # ----- plan -----
    banner("Plan")
    print(f"  {C.BOLD}Output folder{C.RESET} : {args.out}/")
    for subfolder, const_name, out_file, records, folder_count, present in sections:
        if present:
            print(f"  {C.BOLD}{out_file}{C.RESET}  {C.GREY}—{C.RESET} "
                  f"export const {C.CYAN}{const_name}{C.RESET} "
                  f"({C.GREEN}{len(records)}{C.RESET} item(s))")
        else:
            print(f"  {C.GREY}{out_file}  — skipped (no matching folder){C.RESET}")
    if args.no_media:
        print(f"  {C.BOLD}media/{C.RESET}          : {C.GREY}skipped (--no-media){C.RESET}")
    else:
        folders_touched = len({os.path.dirname(dst) for _, dst in media_copies})
        print(f"  {C.BOLD}media/{C.RESET}          : {C.GREEN}{len(media_copies)}{C.RESET} "
              f"file(s) → {args.out}/media/ ({folders_touched} folder(s))")
        if media_empty:
            print(f"    {C.GREY}{media_empty} project(s) have no media yet — skipped{C.RESET}")
        if media_missing:
            print(f"    {C.YELLOW}{len(media_missing)} referenced file(s) missing on disk{C.RESET}")

    # ----- preview one transformed record per section -----
    banner("Example output")
    for subfolder, const_name, out_file, records, folder_count, present in sections:
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
    for subfolder, const_name, out_file, records, folder_count, present in sections:
        if not present:
            continue
        path = os.path.join(args.out, out_file)
        with open(path, "w", encoding="utf-8") as f:
            f.write(render_ts(const_name, records))
        ok(f"{out_file}  {C.GREY}({len(records)} item(s)){C.RESET}")

    # ----- copy media tree -----
    if not args.no_media and media_copies:
        step(f"media/  {C.GREY}({len(media_copies)} file(s)){C.RESET}")
        copied = 0
        for src, dst in media_copies:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)
            copied += 1
        ok(f"copied {copied} file(s) into {args.out}/media/")
    if media_missing:
        banner("Flags — referenced media missing on disk")
        for rid, ref in media_missing:
            warn(f"{rid}: {ref}")

    banner("Done")
    print(f"  {C.GREEN}✔{C.RESET} TypeScript data written to {C.BOLD}{args.out}/{C.RESET}")
    if not args.no_media:
        print(f"  {C.GREY}Move {args.out}/media/ into your React app's public/media/{C.RESET}")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        error("Interrupted.")
        sys.exit(130)
