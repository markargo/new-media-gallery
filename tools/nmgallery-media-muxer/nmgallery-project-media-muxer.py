#!/usr/bin/env python3
"""
nmgallery-project-media-muxer
=============================

Walks the project folders inside a build folder, processes their images
(png / jpg), renames them sequentially, generates a square cover image, and
records the results in each project.json.

Usage:
    nmgallery-project-media-muxer <build-folder> [--max 1920] [--quality 60] [--cover 1000]
    nmgallery-project-media-muxer <build-folder> --clean
        Delete generated PRESET_### files and header.jpg, and reset the affected
        project.json (assets -> [], img -> header.jpg). Does not process media.

Non-destructive: originals are left untouched.  Processed copies are written
alongside them under a filename preset (default "IMG") as PRESET_001, PRESET_002…

Per project folder (build/projects/<id>/):
    * Finds source .png / .jpg / .jpeg images (an existing header.jpg and any
      previously generated PRESET_### files are ignored as source).
    * Any image larger than MAX_W / MAX_H is scaled to fit (aspect preserved).
    * JPGs are saved at QUALITY (default 60).
    * Processed copies are written as PRESET_001.<ext>, PRESET_002.<ext>, ...
      in sorted order; originals remain in place.
    * The cover source (a source filename starting with '+' if present, else the
      FIRST image) is duplicated, centre-cropped and resized to a COVER x COVER
      (default 1000) square saved as header.jpg.  The cover source still appears
      in the gallery.
    * project.json: assets = [processed copies], img = "header.jpg".

Folders already processed in a previous pass (a cover exists, or project.json
assets is set) prompt per folder: skip / redo / redo all.

Flags (surfaced before applying):
    * folders with no media
    * any processed file still larger than 5 MB

Paths written to project.json are BARE filenames; the ts-builder adds the
media/<id>/ prefix.  Nothing is changed until you review and confirm.
"""

import argparse
import json
import os
import re
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.stderr.write("This tool requires Pillow:  pip install --break-system-packages Pillow\n")
    sys.exit(1)

# ---- defaults (overridable via CLI) ----
MAX_W = MAX_H = 1920
JPG_QUALITY = 60
COVER = 1000
SIZE_FLAG_BYTES = 5 * 1024 * 1024
COVER_NAME = "header.jpg"
EXTS = (".png", ".jpg", ".jpeg")


# --------------------------------------------------------------------------- #
#  ANSI colour helpers
# --------------------------------------------------------------------------- #
class C:
    _enabled = sys.stdout.isatty() and os.environ.get("NO_COLOR") is None
    RESET = "\033[0m"    if _enabled else ""
    BOLD = "\033[1m"     if _enabled else ""
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


def step(text):  print(f"{C.CYAN}▶ {C.RESET}{text}")
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


def prompt_choice(question, options):
    """options: list of (key, label). Returns the chosen key."""
    keys = {k for k, _ in options}
    rendered = " / ".join(f"{k}={lab}" for k, lab in options)
    while True:
        try:
            raw = input(f"{C.BOLD}{C.BLUE}? {C.RESET}{question} {C.GREY}{rendered}{C.RESET}: ").strip().lower()
        except EOFError:
            raw = ""
        if raw in keys:
            return raw
        warn(f"  Please choose one of: {', '.join(sorted(keys))}")


# --------------------------------------------------------------------------- #
#  Helpers
# --------------------------------------------------------------------------- #
def natural_key(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


def norm_ext(ext):
    ext = ext.lower()
    return ".jpg" if ext == ".jpeg" else ext


def list_media(folder, preset):
    """Source images: png/jpg, excluding the cover and any prior PRESET_### output."""
    gen = re.compile(rf"^{re.escape(preset)}_\d+\.(?:png|jpe?g)$", re.I)
    files = [f for f in os.listdir(folder)
             if os.path.splitext(f)[1].lower() in EXTS
             and f.lower() != COVER_NAME and not gen.match(f)]
    return sorted(files, key=natural_key)


def folder_processed(pdir):
    """Heuristic: a folder is 'already processed' if a cover exists or assets is set."""
    if os.path.exists(os.path.join(pdir, COVER_NAME)):
        return True
    jp = os.path.join(pdir, "project.json")
    if os.path.isfile(jp):
        try:
            with open(jp, encoding="utf-8") as f:
                if json.load(f).get("assets"):
                    return True
        except Exception:                            # noqa: BLE001
            pass
    return False


def save_image(img, path, ext):
    """Save with the right encoder; JPGs at JPG_QUALITY."""
    if ext == ".png":
        img.save(path, "PNG", optimize=True)
    else:
        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")
        img.save(path, "JPEG", quality=JPG_QUALITY, optimize=True)


def process_folder(pdir, preset, apply):
    """Return dict describing planned/applied work for one project folder.
    Non-destructive: originals are kept; processed copies are new PRESET_### files."""
    media = list_media(pdir, preset)
    result = {"folder": os.path.basename(pdir), "count": len(media),
              "outputs": [], "resized": [], "oversize": [], "cover": COVER_NAME,
              "cover_src": None, "designated": False, "multi_designated": False,
              "processed": folder_processed(pdir), "error": None}
    if not media:
        return result

    # cover source: a filename starting with '+' wins, else the first image
    designated = [m for m in media if os.path.basename(m).startswith("+")]
    cover_src = designated[0] if designated else media[0]
    result["cover_src"] = cover_src
    result["designated"] = bool(designated)
    result["multi_designated"] = len(designated) > 1

    pad = max(3, len(str(len(media))))
    plan = []
    for i, src in enumerate(media, 1):
        ext = norm_ext(os.path.splitext(src)[1])
        plan.append((src, f"{preset}_{i:0{pad}d}{ext}", ext))
    result["outputs"] = [d for _, d, _ in plan]
    result["cover"] = COVER_NAME

    # Inspect sizes for the plan (open once)
    for src, dst, ext in plan:
        try:
            with Image.open(os.path.join(pdir, src)) as im:
                if im.width > MAX_W or im.height > MAX_H:
                    result["resized"].append(dst)
        except Exception as e:                       # noqa: BLE001
            result["error"] = f"{src}: {e}"
            return result

    if not apply:
        return result

    # ---- APPLY (write new files; never delete originals) ----
    for src, dst, ext in plan:
        with Image.open(os.path.join(pdir, src)) as im:
            im = ImageOps.exif_transpose(im)
            if im.width > MAX_W or im.height > MAX_H:
                im.thumbnail((MAX_W, MAX_H), Image.LANCZOS)
            save_image(im, os.path.join(pdir, dst), ext)

    # cover from the designated ('+') source, else the first source.
    # ImageOps.fit scales to COVER x COVER (cover fit) then crops from the CENTRE.
    with Image.open(os.path.join(pdir, cover_src)) as im:
        im = ImageOps.exif_transpose(im)
        cov = ImageOps.fit(im, (COVER, COVER), Image.LANCZOS, centering=(0.5, 0.5))
        if cov.mode in ("RGBA", "P", "LA"):
            cov = cov.convert("RGB")
        cov.save(os.path.join(pdir, COVER_NAME), "JPEG", quality=JPG_QUALITY, optimize=True)

    # size flags (processed copies + cover)
    for _, dst, _ in plan:
        sz = os.path.getsize(os.path.join(pdir, dst))
        if sz > SIZE_FLAG_BYTES:
            result["oversize"].append((dst, sz))
    csz = os.path.getsize(os.path.join(pdir, COVER_NAME))
    if csz > SIZE_FLAG_BYTES:
        result["oversize"].append((COVER_NAME, csz))

    # update project.json
    jpath = os.path.join(pdir, "project.json")
    if os.path.isfile(jpath):
        with open(jpath, encoding="utf-8") as f:
            data = json.load(f)
        data["assets"] = [d for _, d, _ in plan]
        data["img"] = COVER_NAME
        with open(jpath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
    else:
        result["error"] = "no project.json"

    return result


# --------------------------------------------------------------------------- #
#  Clean mode
# --------------------------------------------------------------------------- #
def clean(projects_dir):
    """Delete generated PRESET_### files and header.jpg, and reset the affected
    project.json (assets -> [], img -> header.jpg placeholder)."""
    banner("nmgallery-project-media-muxer  —  CLEAN")
    print()
    preset = prompt_text("Filename preset to clean", default="IMG")
    gen = re.compile(rf"^{re.escape(preset)}_\d+\.(?:png|jpe?g)$", re.I)

    folders = sorted((d for d in os.listdir(projects_dir)
                      if os.path.isdir(os.path.join(projects_dir, d))), key=natural_key)
    to_delete = []          # (folder, filename)
    for d in folders:
        pdir = os.path.join(projects_dir, d)
        for f in sorted(os.listdir(pdir), key=natural_key):
            if f.lower() == COVER_NAME or gen.match(f):
                to_delete.append((d, f))

    banner("Plan")
    print(f"  {C.BOLD}Preset{C.RESET}        : {preset}_###  +  {COVER_NAME}")
    print(f"  {C.BOLD}Files to delete{C.RESET} : {C.RED}{len(to_delete)}{C.RESET}")
    affected = sorted({d for d, _ in to_delete}, key=natural_key)
    print(f"  {C.BOLD}Folders affected{C.RESET}: {len(affected)}  "
          f"{C.GREY}(their project.json assets/img will be reset){C.RESET}")

    if not to_delete:
        banner("Nothing to do")
        info("No generated files found.")
        return

    for d in affected:
        files = [f for fd, f in to_delete if fd == d]
        info(f"{d}: {', '.join(files)}")

    print()
    if not prompt_yes_no(f"Delete {len(to_delete)} file(s) and reset {len(affected)} project.json?",
                         default=False):
        error("Aborted — nothing was changed.")
        return

    banner("Cleaning")
    removed = 0
    for d, f in to_delete:
        try:
            os.remove(os.path.join(projects_dir, d, f))
            removed += 1
        except OSError as e:
            error(f"{d}/{f}: {e}")
    # reset project.json in affected folders
    reset = 0
    for d in affected:
        jp = os.path.join(projects_dir, d, "project.json")
        if not os.path.isfile(jp):
            continue
        try:
            with open(jp, encoding="utf-8") as fh:
                data = json.load(fh)
            data["assets"] = []
            data["img"] = COVER_NAME          # back to the folder-maker placeholder
            with open(jp, "w", encoding="utf-8") as fh:
                json.dump(data, fh, indent=2, ensure_ascii=False)
                fh.write("\n")
            reset += 1
        except (json.JSONDecodeError, OSError) as e:
            error(f"{d}/project.json: {e}")
        ok(d)

    banner("Done")
    print(f"  {C.GREEN}✔{C.RESET} Deleted {removed} file(s); reset {reset} project.json.")
    print()


# --------------------------------------------------------------------------- #
#  Main
# --------------------------------------------------------------------------- #
def main():
    global MAX_W, MAX_H, JPG_QUALITY, COVER
    parser = argparse.ArgumentParser(
        prog="nmgallery-project-media-muxer",
        description="Process project media, build cover images, and record them in project.json.",
    )
    parser.add_argument("build", help="Build folder containing projects/<id>/")
    parser.add_argument("--max", type=int, default=MAX_W, help=f"Max width/height (default {MAX_W})")
    parser.add_argument("--quality", type=int, default=JPG_QUALITY, help=f"JPEG quality (default {JPG_QUALITY})")
    parser.add_argument("--cover", type=int, default=COVER, help=f"Square cover size (default {COVER})")
    parser.add_argument("--clean", action="store_true",
                        help="Delete generated PRESET_### files and header.jpg (does not process media)")
    args = parser.parse_args()
    MAX_W = MAX_H = args.max
    JPG_QUALITY = args.quality
    COVER = args.cover

    projects_dir = os.path.join(args.build, "projects")
    if not os.path.isdir(projects_dir):
        error(f"No projects/ folder found in: {args.build}")
        sys.exit(1)

    if args.clean:
        clean(projects_dir)
        return

    banner("nmgallery-project-media-muxer")
    info(f"Build: {args.build}")
    info(f"max={MAX_W}px  jpeg_quality={JPG_QUALITY}  cover={COVER}x{COVER}")

    print()
    preset = prompt_text("Filename preset for processed copies", default="IMG")

    folders = sorted((d for d in os.listdir(projects_dir)
                      if os.path.isdir(os.path.join(projects_dir, d))), key=natural_key)
    if not folders:
        error("No project folders found.")
        sys.exit(1)

    # ---- scan (plan) ----
    plans = [process_folder(os.path.join(projects_dir, d), preset, apply=False) for d in folders]
    with_media = [p for p in plans if p["count"] > 0 and not p["error"]]
    no_media = [p for p in plans if p["count"] == 0]
    errored = [p for p in plans if p["error"]]

    banner("Plan")
    print(f"  {C.BOLD}Project folders{C.RESET}   : {len(folders)}")
    print(f"  {C.BOLD}With media{C.RESET}        : {C.GREEN}{len(with_media)}{C.RESET}")
    total_imgs = sum(p["count"] for p in with_media)
    total_resize = sum(len(p["resized"]) for p in with_media)
    print(f"  {C.BOLD}Images to process{C.RESET} : {total_imgs}  {C.GREY}({total_resize} need resizing){C.RESET}")
    print(f"  {C.BOLD}Covers to create{C.RESET}  : {len(with_media)}")

    processed = [p for p in with_media if p["processed"]]
    if processed:
        print(f"  {C.BOLD}Already processed{C.RESET} : {C.YELLOW}{len(processed)}{C.RESET} "
              f"{C.GREY}(you'll be asked to skip/redo per folder){C.RESET}")

    if with_media:
        print(f"\n  {C.BOLD}Per folder:{C.RESET}")
        for p in with_media:
            rz = f"  {C.GREY}{len(p['resized'])} resize{C.RESET}" if p["resized"] else ""
            first, last = p["outputs"][0], p["outputs"][-1]
            span = first if p["count"] == 1 else f"{first}..{last}"
            tags = ""
            if p["designated"]:
                tags += f"  {C.CYAN}cover:{os.path.basename(p['cover_src'])}{C.RESET}"
            if p["multi_designated"]:
                tags += f"  {C.YELLOW}(multiple '+' — using first){C.RESET}"
            if p["processed"]:
                tags += f"  {C.YELLOW}(already processed){C.RESET}"
            ok(f"{p['folder']}  {C.GREY}{p['count']} img → {span} + {COVER_NAME}{C.RESET}{rz}{tags}")

    # ---- flags ----
    if no_media or errored:
        banner("Flags")
        if no_media:
            warn(f"Folders with NO media ({len(no_media)}) — skipped:")
            print("    " + C.GREY + ", ".join(p["folder"] for p in no_media) + C.RESET)
        if errored:
            warn("Folders with unreadable images (skipped):")
            for p in errored:
                print(f"    {C.YELLOW}{p['folder']}{C.RESET}: {p['error']}")

    if not with_media:
        banner("Nothing to do")
        info("No processable media found.")
        sys.exit(0)

    print(f"\n  {C.GREY}Non-destructive: originals are kept; copies written as "
          f"{preset}_001, {preset}_002, …{C.RESET}")
    print()
    if not prompt_yes_no("Process media and update project.json?", default=True):
        error("Aborted — nothing was changed.")
        sys.exit(0)

    # ---- apply ----
    banner("Processing")
    applied = []
    skipped = []
    redo_all = False
    for d in folders:
        pdir = os.path.join(projects_dir, d)
        if not list_media(pdir, preset):
            continue
        # already-processed folders: ask per folder unless 'redo all' was chosen
        if folder_processed(pdir) and not redo_all:
            choice = prompt_choice(f"'{d}' is already processed —",
                                   [("s", "skip"), ("r", "redo"), ("a", "redo all")])
            if choice == "s":
                skipped.append(d)
                info(f"skipped {d}")
                continue
            if choice == "a":
                redo_all = True
        r = process_folder(pdir, preset, apply=True)
        applied.append(r)
        note = ""
        if r["oversize"]:
            note = f"  {C.YELLOW}(>5MB: {', '.join(n for n, _ in r['oversize'])}){C.RESET}"
        if r["error"]:
            error(f"{r['folder']}: {r['error']}")
        else:
            cov = f"  {C.CYAN}cover:{os.path.basename(r['cover_src'])}{C.RESET}" if r["designated"] else ""
            ok(f"{r['folder']}  {C.GREY}{r['count']} img + {COVER_NAME}{C.RESET}{cov}{note}")

    # ---- oversize summary ----
    oversize = [(r["folder"], n, sz) for r in applied for n, sz in r["oversize"]]
    if oversize:
        banner("Flags — files over 5 MB")
        for folder, n, sz in oversize:
            warn(f"{folder}/{n}  ({sz/1024/1024:.1f} MB)")

    banner("Done")
    print(f"  {C.GREEN}✔{C.RESET} Processed {len([r for r in applied if not r['error']])} folder(s).")
    if skipped:
        print(f"  {C.GREY}Skipped {len(skipped)} already-processed folder(s).{C.RESET}")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        error("Interrupted.")
        sys.exit(130)
