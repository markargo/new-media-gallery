#!/usr/bin/env python3
"""
nmgallery-merge-project-data.py
===============================

Merge `desc` and `medium` fields from a descriptions.json (as produced by the
label-parser) into the matching project.json files inside a build folder.

Usage:
    nmgallery-merge-project-data.py <build-folder> <descriptions.json>

Matching:
    A description is matched to a project by slug. The description's `slug`
    (or a slug derived from its title) is compared against the slug derived
    from each project's `title` field, and against the project `id` (with the
    project prefix stripped). Only `desc` and `medium` are ever written; all
    other fields are left untouched. An empty `medium` in the description does
    NOT overwrite an existing project medium.

Nothing is written until you review the plan and confirm.
"""

import argparse
import json
import os
import re
import sys


# --------------------------------------------------------------------------- #
#  ANSI colour helpers
# --------------------------------------------------------------------------- #
class C:
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


def ok(text):    print(f"  {C.GREEN}✔ {C.RESET}{text}")
def info(text):  print(f"  {C.GREY}{text}{C.RESET}")
def warn(text):  print(f"{C.YELLOW}⚠ {text}{C.RESET}")
def error(text): print(f"{C.RED}✗ {text}{C.RESET}")


def prompt_text(question, default=None):
    suffix = f" {C.GREY}[{default}]{C.RESET}" if default is not None else ""
    try:
        raw = input(f"{C.BOLD}{C.BLUE}? {C.RESET}{question}{suffix}: ").strip()
    except EOFError:
        raw = ""
    return raw or (default or "")


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
#  Helpers
# --------------------------------------------------------------------------- #
def slugify(t):
    s = re.sub(r"\s+", " ", (t or "").strip()).lower().replace(" ", "-")
    s = re.sub(r"[^a-z0-9-]", "", s)
    s = re.sub(r"-{2,}", "-", s)
    return s.strip("-")


def load_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        error(f"Could not read {path}: {e}")
        sys.exit(1)


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def short(s, n=46):
    s = re.sub(r"\s+", " ", s or "").strip()
    return (s[:n - 1] + "…") if len(s) > n else s


# --------------------------------------------------------------------------- #
#  Main
# --------------------------------------------------------------------------- #
def main():
    parser = argparse.ArgumentParser(
        prog="nmgallery-merge-project-data.py",
        description="Merge desc/medium from descriptions.json into project.json files.",
    )
    parser.add_argument("build", help="Build folder containing projects/<id>/project.json")
    parser.add_argument("descriptions", help="descriptions.json file")
    args = parser.parse_args()

    projects_dir = os.path.join(args.build, "projects")
    if not os.path.isdir(projects_dir):
        error(f"No projects/ folder found in: {args.build}")
        sys.exit(1)
    if not os.path.isfile(args.descriptions):
        error(f"Descriptions file not found: {args.descriptions}")
        sys.exit(1)

    banner("nmgallery-merge-project-data")
    info(f"Build:        {args.build}")
    info(f"Descriptions: {args.descriptions}")

    # Project prefix is prepended to project IDs (e.g. NM-holding-on-to-colour).
    # Providing it lets us match on the exact PREFIX-slug id rather than guessing.
    print()
    prefix = prompt_text("Project prefix used in project IDs (blank to match by title/slug only)")

    # ----- load projects -----
    projects = {}       # id -> {"path", "data", "title_slug"}
    by_slug = {}        # title_slug -> list of ids
    for folder in sorted(os.listdir(projects_dir)):
        jpath = os.path.join(projects_dir, folder, "project.json")
        if not os.path.isfile(jpath):
            continue
        data = load_json(jpath)
        pid = data.get("id", folder)
        tslug = slugify(data.get("title", "")) or folder
        projects[pid] = {"path": jpath, "data": data, "title_slug": tslug, "folder": folder}
        by_slug.setdefault(tslug, []).append(pid)

    if not projects:
        error("No project.json files found under projects/.")
        sys.exit(1)

    # ----- load descriptions -----
    descs = load_json(args.descriptions)
    if not isinstance(descs, list):
        error("descriptions.json must be a JSON array.")
        sys.exit(1)

    # detect duplicate description slugs
    slug_seen = {}
    for d in descs:
        s = d.get("slug") or slugify(d.get("title", ""))
        slug_seen.setdefault(s, []).append(d)

    def find_project(dslug):
        """Return matching project id, a list (ambiguous), or None.
        Order: exact PREFIX-slug id, then title-slug, then id suffix."""
        # 1) exact id from prefix + slug (most reliable when prefix is known)
        if prefix:
            expected = f"{prefix}-{dslug}"
            if expected in projects:
                return expected
        # 2) match on slug derived from each project's title
        hits = by_slug.get(dslug)
        if hits:
            return hits if len(hits) > 1 else hits[0]
        # 3) fallback: project id ends with '-<slug>' or equals slug
        cand = [pid for pid in projects
                if pid == dslug or pid.endswith("-" + dslug)]
        if cand:
            return cand if len(cand) > 1 else cand[0]
        return None

    # ----- build the change plan -----
    planned = []        # (pid, desc_change, medium_change)
    flags = {"unmatched": [], "conflict_dupes": [], "ambiguous": [],
             "desc_overwrite": [], "medium_overwrite": [], "no_medium": []}
    matched_pids = set()

    for dslug, group in slug_seen.items():
        # resolve duplicate description slugs
        if len(group) > 1:
            uniq = {(g.get("desc", ""), g.get("medium", "")) for g in group}
            if len(uniq) > 1:
                flags["conflict_dupes"].append((dslug, len(group)))
                continue           # ambiguous content -> skip, let user resolve
            d = group[0]           # identical duplicates -> safe to use one
        else:
            d = group[0]

        match = find_project(dslug)
        if match is None:
            flags["unmatched"].append((dslug, d.get("title", "")))
            continue
        if isinstance(match, list):
            flags["ambiguous"].append((dslug, match))
            continue

        pid = match
        matched_pids.add(pid)
        pdata = projects[pid]["data"]

        new_desc = d.get("desc", "") or ""
        new_medium = d.get("medium", "") or ""

        desc_change = None
        if new_desc and new_desc != pdata.get("desc", ""):
            desc_change = (pdata.get("desc", ""), new_desc)
            if pdata.get("desc", "").strip():
                flags["desc_overwrite"].append(pid)

        medium_change = None
        if new_medium:
            if new_medium != pdata.get("medium", ""):
                medium_change = (pdata.get("medium", ""), new_medium)
                if pdata.get("medium", "").strip():
                    flags["medium_overwrite"].append(pid)
        else:
            flags["no_medium"].append(pid)

        if desc_change or medium_change:
            planned.append((pid, desc_change, medium_change))

    projects_without_desc = sorted(set(projects) - matched_pids)

    # ----- plan report -----
    banner("Plan")
    print(f"  {C.BOLD}Projects in build{C.RESET}     : {len(projects)}")
    print(f"  {C.BOLD}Descriptions supplied{C.RESET} : {len(descs)}")
    print(f"  {C.BOLD}Will update{C.RESET}           : {C.GREEN}{len(planned)}{C.RESET} project(s)")
    dcount = sum(1 for _, dc, _ in planned if dc)
    mcount = sum(1 for _, _, mc in planned if mc)
    print(f"    {C.GREY}desc updates{C.RESET}   : {dcount}")
    print(f"    {C.GREY}medium updates{C.RESET} : {mcount}")

    if planned:
        print(f"\n  {C.BOLD}Changes:{C.RESET}")
        for pid, dc, mc in planned:
            bits = []
            if dc:
                bits.append("desc" + (f" {C.YELLOW}(overwrite){C.RESET}" if pid in flags["desc_overwrite"] else ""))
            if mc:
                bits.append("medium" + (f" {C.YELLOW}(overwrite){C.RESET}" if pid in flags["medium_overwrite"] else ""))
            ok(f"{pid}  {C.GREY}→ {', '.join(bits)}{C.RESET}")
            if mc:
                print(f"      {C.GREY}medium: {short(mc[1], 60)}{C.RESET}")

    # ----- flags report -----
    has_flags = any([flags["unmatched"], flags["conflict_dupes"], flags["ambiguous"],
                     projects_without_desc])
    if has_flags:
        banner("Flags — review before applying")
        if flags["conflict_dupes"]:
            warn("Duplicate description slugs with DIFFERING content (skipped — resolve manually):")
            for s, n in flags["conflict_dupes"]:
                print(f"    {C.YELLOW}{s}{C.RESET} ({n} copies)")
        if flags["ambiguous"]:
            warn("Description matched MULTIPLE projects (skipped):")
            for s, ids in flags["ambiguous"]:
                print(f"    {C.YELLOW}{s}{C.RESET} → {', '.join(ids)}")
        if flags["unmatched"]:
            warn("Descriptions with NO matching project (skipped):")
            for s, title in flags["unmatched"]:
                print(f"    {C.YELLOW}{short(title, 40):40}{C.RESET} {C.GREY}(slug: {s}){C.RESET}")
        if projects_without_desc:
            warn(f"Projects with no description supplied ({len(projects_without_desc)}) — left unchanged:")
            print("    " + C.GREY + ", ".join(projects_without_desc) + C.RESET)
    else:
        info("No issues flagged.")

    if not planned:
        banner("Nothing to do")
        info("No project files need changes.")
        sys.exit(0)

    # ----- confirm -----
    print()
    if not prompt_yes_no(f"Apply {len(planned)} update(s)?", default=True):
        error("Aborted — no files were changed.")
        sys.exit(0)

    # ----- apply -----
    banner("Applying")
    for pid, dc, mc in planned:
        pdata = projects[pid]["data"]
        if dc:
            pdata["desc"] = dc[1]
        if mc:
            pdata["medium"] = mc[1]
        write_json(projects[pid]["path"], pdata)
        ok(pid)

    banner("Done")
    print(f"  {C.GREEN}✔{C.RESET} Updated {C.BOLD}{len(planned)}{C.RESET} project file(s).")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        error("Interrupted.")
        sys.exit(130)
