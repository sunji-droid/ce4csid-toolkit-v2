# CE4CSID Community Engagement Toolkit — v2

Practical resources and guidelines for integrating community engagement into **Climate Sensitive Infectious Disease (CSID)** research, developed by the CE4CSID Working Group with the Botswana Society for Human Development (BSHD).

This is a ground-up redesign of the toolkit, built on the **CSID Network Identity Guidelines** (teal / lime / blue / purple / red / yellow palette, Inter Tight + Inter typography). It is a zero-dependency static site: plain HTML, CSS, and vanilla JavaScript, ready for GitHub Pages.

> **Status:** the downloadable documents are clearly-marked placeholders pending the Working Group's final content. The site structure, links, and search will not need to change when final files are dropped in.

---

## What's new in v2

- **Full CSID brand system** — exact palette and accessible colour pairings from the style guide; self-hosted Inter Tight (headings) and Inter (body), so the site renders correctly even offline.
- **Live resource search + category filters** on the Resources page (an "Option C" capability), with deep-linkable URLs (`?category=templates`, `?q=consent`).
- **Single source of truth** — `assets/js/resources-data.js` drives both the Resources and Downloads pages. Add a resource once, it appears everywhere.
- **Download-all zip** of every toolkit file.
- **Upgraded checklist** — project name on the printed record, expand/collapse all, JSON backup export & import (move progress between devices), per-stage completion states, and a completion celebration. Progress still auto-saves to the device.
- **Contact form that works with no backend** — composes a pre-filled email by default; optional Formspree endpoint for silent collection.
- **Accessibility & SEO** — skip links, semantic landmarks, `aria-current`, focus-visible rings, reduced-motion support, Open Graph + Twitter cards, canonical URLs, `sitemap.xml`, `robots.txt`, and a branded share image.
- **Polish** — sticky blurred header, scroll-reveal animations, responsive down to small phones, print stylesheet for the checklist, custom 404.

## Project structure

```
├── index.html / about.html / resources.html / downloads.html
├── checklist.html / contact.html / 404.html
├── assets/
│   ├── css/style.css            # design system + all component styles
│   ├── js/
│   │   ├── main.js              # nav, header, reveal, toast, year
│   │   ├── resources-data.js    # ← edit this to add/change resources
│   │   ├── resources.js         # search + filter rendering
│   │   ├── downloads.js         # downloads table rendering
│   │   ├── checklist.js         # interactive checklist + backup
│   │   └── contact.js           # mailto / Formspree handling
│   ├── fonts/                   # self-hosted Inter + Inter Tight (woff2)
│   └── images/                  # logo.svg, favicon.svg, og-image.png
├── downloads/                   # toolkit PDFs, DOCX, and the all-in-one zip
└── tools/build_downloads_zip.py # rebuild the download-all zip
```

## Run locally

No build step and no dependencies:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages (new repository)

This v2 lives in its **own** repository, separate from the original toolkit.

```bash
# 1. Create an empty repo on GitHub named ce4csid-toolkit-v2 (no README/license).
# 2. From this folder:
git remote add origin https://github.com/sunji-droid/ce4csid-toolkit-v2.git
git push -u origin main
# 3. In the repo: Settings → Pages → Source: "Deploy from a branch" → main / (root).
```

The site will be live at `https://sunji-droid.github.io/ce4csid-toolkit-v2/`.
If you choose a different repo name, update `BASE`/`REPO` in the page `<head>` canonical/OG URLs, `sitemap.xml`, `robots.txt`, and the footer GitHub link.

## Swap in the official CSID Network logo

The current mark is a clean placeholder (a globe motif in brand teal). When the official logo arrives:

1. Replace `assets/images/logo.svg` (header/footer lockup) and `assets/images/favicon.svg`.
2. The inline SVG in each page's header/footer is the same mark — search for `Placeholder mark` and replace, or switch the brand to `<img src="assets/images/logo.svg">`.
3. Regenerate `assets/images/og-image.png` if desired.

Per the style guide, do not recolour the official globe icon; use it in full colour, brand teal, black, or white only.

## Replace placeholder content

Drop the Working Group's final files into `downloads/` using the **same filenames**, and the links, search, and zip keep working. To rebuild the zip after changing files:

```bash
python3 tools/build_downloads_zip.py
```

To add a new resource, add one entry to `assets/js/resources-data.js` (and the file in `downloads/`). It appears on both Resources and Downloads automatically.

## Optional: connect the contact form to Formspree

By default the form opens the visitor's email app pre-filled (works with zero setup). To collect submissions silently instead, create a free form at [formspree.io](https://formspree.io) and set `FORM_ENDPOINT` in `assets/js/contact.js`.

## Brand compliance (CSID Identity Guidelines)

| Role | Colour |
|---|---|
| Primary / text on light | Teal `#044953` |
| Neutral page background | `#EFF4E3` |
| Accents (cards) | Lime `#D3F781`, Blue `#46CBDE`, Purple `#BBBDF3`, Red `#FC8170`, Yellow `#FFB605` |
| Text on dark | Neutral white `#FFFFFF` |
| Headings / logo | Inter Tight |
| Body | Inter |

Text uses only the darkest teal (on light) or neutral white (on dark), per the guide's accessible pairings.

## Credits & licence

- Content: CE4CSID Working Group & Botswana Society for Human Development (BSHD).
- Design & development: **Kabo Merapelo Onamile**, Digital Health Developer.
- Code: MIT Licence (see `LICENSE`). Toolkit content remains the property of the CE4CSID Working Group / BSHD.
