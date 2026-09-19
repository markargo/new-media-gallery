#!/usr/bin/env python3
"""
nmgallery-folder-maker
======================

Reads a CSV of exhibition entries and generates a placeholder folder/file
scaffold for assembling an exhibition web gallery.

Usage:
    nmgallery-folder-maker <file.csv>

Expected CSV columns (header row required):
    First Names, Last Names, Project Title

Behaviour:
    * Prompts for a project prefix (used in project IDs / folder names).
    * Optionally generates an exhibition folder (prompts for title + prefix).
    * Optionally generates artist folders.
    * Always generates project folders.

Rows that share the same Project Title are treated as ONE group project with
multiple artists. Artists are de-duplicated by full name.
"""

import argparse
import csv
import json
import os
import re
import shutil
import sys
from datetime import date


# --------------------------------------------------------------------------- #
#  ANSI colour helpers
# --------------------------------------------------------------------------- #
class C:
    """ANSI colour codes. Disabled automatically when output isn't a TTY,
    or when NO_COLOR is set."""

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


# --------------------------------------------------------------------------- #
#  Prompt helpers
# --------------------------------------------------------------------------- #
def prompt_text(question, required=True, default=None):
    suffix = f" {C.GREY}[{default}]{C.RESET}" if default is not None else ""
    while True:
        try:
            raw = input(f"{C.BOLD}{C.BLUE}? {C.RESET}{question}{suffix}: ").strip()
        except EOFError:
            raw = ""
        if not raw and default is not None:
            return default
        if raw or not required:
            return raw
        warn("  A value is required.")


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
#  Text / slug utilities
# --------------------------------------------------------------------------- #
def norm_ws(text):
    """Trim and collapse internal whitespace."""
    return re.sub(r"\s+", " ", (text or "").strip())


def slugify(text):
    """lowercase, trim, spaces -> dashes, strip everything but [a-z0-9-]."""
    s = norm_ws(text).lower()
    s = s.replace(" ", "-")
    s = re.sub(r"[^a-z0-9-]", "", s)   # drop special characters
    s = re.sub(r"-{2,}", "-", s)       # collapse repeated dashes
    return s.strip("-")


def unique_slug(base, used):
    """Ensure a slug is unique within `used` (a set); append -2, -3, ... if not."""
    if not base:
        base = "item"
    slug = base
    n = 2
    while slug in used:
        slug = f"{base}-{n}"
        n += 1
    used.add(slug)
    return slug


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def build_exhibition_record(exhibition_id, exhibition_title, project_ids):
    """The exhibition.json shape — one place, shared by preview and generation."""
    return {
        "id": exhibition_id,
        "name": exhibition_title,
        "img": "header.jpg",
        "desc": "",
        "desc2": "",
        "desc3": "",
        "start_date": "",
        "end_date": "",
        "projects": list(project_ids),
        "assets": [],
        "links": [],
        "organizers": [],
        "volunteers": [],
        "venues": [],
    }


def preview_json(label, path, data):
    """Print a single example JSON file, dimmed, under a labelled path."""
    print(f"\n  {C.BOLD}{label}{C.RESET} {C.GREY}— example: {path}{C.RESET}")
    for line in json.dumps(data, indent=2, ensure_ascii=False).splitlines():
        print(f"    {C.GREY}{line}{C.RESET}")


# --------------------------------------------------------------------------- #
#  CSV parsing -> in-memory model
# --------------------------------------------------------------------------- #
COL_FIRST = "First Names"
COL_LAST = "Last Names"
COL_TITLE = "Project Title"


def read_rows(csv_path):
    with open(csv_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        headers = {(h or "").strip(): h for h in (reader.fieldnames or [])}
        for col in (COL_FIRST, COL_LAST, COL_TITLE):
            if col not in headers:
                error(f"CSV is missing required column: '{col}'")
                info(f"Found columns: {', '.join(headers) or '(none)'}")
                sys.exit(1)
        rows = []
        for r in reader:
            first = norm_ws(r.get(headers[COL_FIRST], ""))
            last = norm_ws(r.get(headers[COL_LAST], ""))
            title = norm_ws(r.get(headers[COL_TITLE], ""))
            if not (first or last or title):
                continue  # skip blank lines
            rows.append((first, last, title))
        return rows


def build_model(rows, project_prefix, exhibition_id):
    """
    Returns (projects, artists) as ordered dicts keyed by their id.

    projects[id] = {id, title, artists[], year, medium, desc, assets[],
                    img, exhibitions[], links[]}
    artists[id]  = {id, first_name, last_name, projects[], bio, img,
                    assets[], links[]}
    """
    projects = {}          # project_id -> record
    project_by_title = {}   # normalized title -> project_id
    project_slugs = set()

    artists = {}           # artist_id -> record
    artist_by_name = {}     # (first.lower, last.lower) -> artist_id
    artist_slugs = set()

    exhibitions_field = [exhibition_id] if exhibition_id else []

    for first, last, title in rows:
        # --- project (deduped by title) ---
        tkey = title.lower()
        if tkey not in project_by_title:
            pslug = unique_slug(slugify(title), project_slugs)
            pid = f"{project_prefix}-{pslug}"
            projects[pid] = {
                "id": pid,
                "title": title,
                "artists": [],
                "year": "2026",
                "medium": "",
                "desc": "",
                "assets": [],
                "img": "header.jpg",
                "exhibitions": list(exhibitions_field),
                "links": [],
            }
            project_by_title[tkey] = pid
        pid = project_by_title[tkey]

        # --- artist (deduped by full name) ---
        nkey = (first.lower(), last.lower())
        if nkey not in artist_by_name:
            aslug = unique_slug(slugify(f"{first} {last}"), artist_slugs)
            artists[aslug] = {
                "id": aslug,
                "first_name": first,
                "last_name": last,
                "projects": [],
                "bio": "",
                "img": "portrait.jpg",
                "assets": [],
                "links": [],
            }
            artist_by_name[nkey] = aslug
        aid = artist_by_name[nkey]

        # --- cross-link (no duplicates) ---
        if aid not in projects[pid]["artists"]:
            projects[pid]["artists"].append(aid)
        if pid not in artists[aid]["projects"]:
            artists[aid]["projects"].append(pid)

    return projects, artists


# --------------------------------------------------------------------------- #
#  Main
# --------------------------------------------------------------------------- #
def main():
    parser = argparse.ArgumentParser(
        prog="nmgallery-folder-maker",
        description="Generate a placeholder folder scaffold for an exhibition web gallery.",
    )
    parser.add_argument("csv", help="Path to the source .csv file")
    parser.add_argument("-o", "--out", default="build",
                        help="Working output folder (default: build)")
    args = parser.parse_args()

    if not os.path.isfile(args.csv):
        error(f"File not found: {args.csv}")
        sys.exit(1)

    banner("nmgallery-folder-maker")

    rows = read_rows(args.csv)
    if not rows:
        error("No data rows found in the CSV.")
        sys.exit(1)
    info(f"Loaded {len(rows)} row(s) from {os.path.basename(args.csv)}")

    # ----- gather input -----
    print()
    project_prefix = prompt_text("Project prefix (used in project IDs)")

    make_exhibition = prompt_yes_no("Generate a blank exhibition folder?", default=True)
    exhibition_title = exhibition_prefix = None
    exhibition_id = None
    if make_exhibition:
        exhibition_title = prompt_text("  Exhibition title")
        exhibition_prefix = prompt_text("  Exhibition prefix")
        ex_slug = slugify(exhibition_title)
        exhibition_id = f"{exhibition_prefix}-{ex_slug}" if ex_slug else exhibition_prefix

    make_artists = prompt_yes_no("Generate blank artist folders?", default=True)

    # ----- build model -----
    projects, artists = build_model(rows, project_prefix, exhibition_id)

    # ----- summary of planned work -----
    banner("Plan")
    print(f"  {C.BOLD}Output folder{C.RESET} : {args.out}/")
    print(f"  {C.BOLD}Projects{C.RESET}      : {C.GREEN}{len(projects)}{C.RESET} folder(s), each with a project.json")
    print(f"  {C.BOLD}Artists{C.RESET}       : "
          + (f"{C.GREEN}{len(artists)}{C.RESET} folder(s), each with an artist.json"
             if make_artists else f"{C.GREY}skipped{C.RESET}"))
    print(f"  {C.BOLD}Exhibition{C.RESET}    : "
          + (f"{C.GREEN}{exhibition_id}{C.RESET}, with an exhibition.json"
             if make_exhibition else f"{C.GREY}skipped{C.RESET}"))

    # folders & files that will be generated
    print(f"\n  {C.BOLD}Folders & files to generate:{C.RESET}")
    print(f"  {C.CYAN}{args.out}/{C.RESET}")
    print(f"    {C.CYAN}projects/{C.RESET}")
    for pid in projects:
        print(f"      {pid}/project.json")
    if make_artists:
        print(f"    {C.CYAN}artists/{C.RESET}")
        for aid in artists:
            print(f"      {aid}/artist.json")
    if make_exhibition:
        print(f"    {C.CYAN}exhibitions/{C.RESET}")
        print(f"      {exhibition_id}/exhibition.json")

    # one example JSON per major folder
    banner("Example files")
    first_project_id, first_project = next(iter(projects.items()))
    preview_json("project.json",
                 f"projects/{first_project_id}/project.json",
                 first_project)
    if make_artists:
        first_artist_id, first_artist = next(iter(artists.items()))
        preview_json("artist.json",
                     f"artists/{first_artist_id}/artist.json",
                     first_artist)
    if make_exhibition:
        preview_json("exhibition.json",
                     f"exhibitions/{exhibition_id}/exhibition.json",
                     build_exhibition_record(exhibition_id, exhibition_title,
                                             projects.keys()))

    # ----- confirm before doing anything on disk -----
    print()
    if not prompt_yes_no("Proceed and generate the above?", default=True):
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

    # ----- generate -----
    banner("Generating")
    os.makedirs(args.out, exist_ok=True)

    # projects/
    step("projects/")
    projects_dir = os.path.join(args.out, "projects")
    os.makedirs(projects_dir, exist_ok=True)
    for pid, rec in projects.items():
        pdir = os.path.join(projects_dir, pid)
        os.makedirs(pdir, exist_ok=True)
        write_json(os.path.join(pdir, "project.json"), rec)
        n = len(rec["artists"])
        tag = f"{C.GREY}({n} artist{'s' if n != 1 else ''}){C.RESET}"
        ok(f"{pid}/  {tag}")

    # artists/
    if make_artists:
        step("artists/")
        artists_dir = os.path.join(args.out, "artists")
        os.makedirs(artists_dir, exist_ok=True)
        for aid, rec in artists.items():
            adir = os.path.join(artists_dir, aid)
            os.makedirs(adir, exist_ok=True)
            write_json(os.path.join(adir, "artist.json"), rec)
            ok(f"{aid}/")

    # exhibitions/
    if make_exhibition:
        step("exhibitions/")
        exhibitions_dir = os.path.join(args.out, "exhibitions")
        os.makedirs(exhibitions_dir, exist_ok=True)
        edir = os.path.join(exhibitions_dir, exhibition_id)
        os.makedirs(edir, exist_ok=True)
        exhibition_rec = build_exhibition_record(exhibition_id, exhibition_title,
                                                 projects.keys())
        write_json(os.path.join(edir, "exhibition.json"), exhibition_rec)
        ok(f"{exhibition_id}/  {C.GREY}({len(projects)} projects){C.RESET}")

    # ----- summary -----
    banner("Done")
    print(f"  {C.GREEN}✔{C.RESET} Scaffold written to {C.BOLD}{args.out}/{C.RESET}")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        error("Interrupted.")
        sys.exit(130)
