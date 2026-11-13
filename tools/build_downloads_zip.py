#!/usr/bin/env python3
"""Rebuild downloads/ce4csid-toolkit-all-resources.zip from the PDF/DOCX files.

Run from anywhere:  python3 tools/build_downloads_zip.py
Only requires the Python standard library.
"""
import os
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
DOWNLOADS = os.path.normpath(os.path.join(HERE, "..", "downloads"))
OUT = os.path.join(DOWNLOADS, "ce4csid-toolkit-all-resources.zip")

# Fixed timestamp so rebuilding the zip on a fresh clone does not create a diff.
ZIP_DATE_TIME = (2026, 11, 13, 0, 0, 0)


def main():
    files = sorted(
        f for f in os.listdir(DOWNLOADS)
        if f.lower().endswith((".pdf", ".docx"))
    )
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        for f in files:
            info = zipfile.ZipInfo(f, date_time=ZIP_DATE_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            with open(os.path.join(DOWNLOADS, f), "rb") as src:
                z.writestr(info, src.read())
    print(f"Wrote {OUT} with {len(files)} files.")


if __name__ == "__main__":
    main()
