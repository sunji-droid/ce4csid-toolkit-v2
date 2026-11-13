# CE4CSID Community Engagement Toolkit — v2

[![CI](https://github.com/sunji-droid/ce4csid-toolkit-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/sunji-droid/ce4csid-toolkit-v2/actions/workflows/ci.yml)
[![CodeQL](https://github.com/sunji-droid/ce4csid-toolkit-v2/actions/workflows/codeql.yml/badge.svg)](https://github.com/sunji-droid/ce4csid-toolkit-v2/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

Practical resources and guidelines for integrating community engagement into **Climate Sensitive Infectious Disease (CSID)** research, developed by the CE4CSID Working Group / CSID Network.

**Live site:** <https://sunji-droid.github.io/ce4csid-toolkit-v2/>

This is a ground-up redesign built on the **CSID Network Identity Guidelines** (teal / lime / blue / purple / red / yellow palette, Inter Tight + Inter typography). The visitor-facing site is **zero-runtime-dependency**: plain HTML, CSS, and vanilla ES modules, served straight from GitHub Pages. All tooling in this repo (lint, tests, types) is **dev-only** and never shipped to visitors.

> **Status:** the downloadable documents are clearly-marked placeholders pending the Working Group's final content. The site structure, links, and search will not need to change when final files are dropped in.

---

## What's new in v2

- **Full CSID brand system** — exact palette and accessible colour pairings; self-hosted Inter Tight (headings) and Inter (body), so the site renders correctly even offline.
- **Live resource search + category filters** with deep-linkable URLs (`?category=templates`, `?q=consent`).
- **Single source of truth** — `assets/js/resources-data.js` drives both Resources and Downloads. Add a resource once, it appears everywhere.
- **Download-all zip** of every toolkit file.
- **Upgraded checklist** — project name on the printed record, expand/collapse all, JSON backup export & import, per-stage completion states, and a completion celebration. Progress auto-saves to the device.
- **Contact form that works with no backend** — composes a pre-filled email by default; optional Formspree endpoint for silent collection.
- **Accessibility & SEO** — skip links, semantic landmarks, `aria-current`, focus-visible rings, reduced-motion support, Open Graph + Twitter cards, canonical URLs, `sitemap.xml`, `robots.txt`, branded share image.
- **Quality & security** — ES-module refactor, strict type checking, 53 automated tests (≥80% coverage enforced), CI on every push/PR, CodeQL, gitleaks, Dependabot, secret scanning + push protection, and branch protection. See [Security](#security).

## Requirements

**To use the site:** any modern browser. No install, no build, no runtime dependencies.

**To develop or run the checks:**

- [Node.js](https://nodejs.org) **>= 20.19.0** and npm (CI runs on Node 20 and 22).
- [Python 3](https://www.python.org) — only for the static-page and zip generators (standard library only).

## Quick start (run the site locally)

No build step and no dependencies:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Development

Install the dev-only tooling once (uses the committed lockfile):

```bash
npm ci
```

Run the full quality gate — lint, format check, type check, tests with coverage, and a dependency audit:

```bash
npm run check
```

Individual commands (all run verbatim on a fresh clone):

```bash
npm run lint          # ESLint (zero errors, no rule disabling)
npm run format        # Prettier — write
npm run format:check  # Prettier — check only
npm run typecheck     # TypeScript strict checkJs over assets/js
npm test              # node:test unit + regression suite
npm run test:coverage # tests + c8 coverage gate (>= 80% lines/branches/functions/statements)
npm run audit         # npm audit (moderate and above)
npm run build:pages   # regenerate the HTML pages from tools/build_pages.py
npm run build:zip     # rebuild downloads/ce4csid-toolkit-all-resources.zip
```

> The HTML pages are **generated**. Edit `tools/build_pages.py` (shared head/header/footer + page bodies) and run `npm run build:pages` — do not hand-edit the `.html` files.

## Running tests

The suite uses the built-in [`node:test`](https://nodejs.org/api/test.html) runner with [jsdom](https://github.com/jsdom/jsdom) to load the real generated pages. Unit tests use **mocked timers and a stubbed `fetch`/`FileReader` — no real network or clock**.

```bash
npm test              # run all tests
npm run test:coverage # run with the 80% coverage floor
```

There is one **regression test per fixed bug** from the hardening audit (`tests/regression.test.js`, named F1–F15), so a change that reintroduces a bug fails loudly with its finding id.

## Configuration

- **Add / update a resource:** put the file in `downloads/`, add one entry to `assets/js/resources-data.js`, then `npm run build:zip`. It appears on Resources and Downloads automatically.
- **Contact form:** by default it opens the visitor's email app pre-filled (zero setup). To collect submissions silently, create a free form at [formspree.io](https://formspree.io) and set `FORM_ENDPOINT` in `assets/js/contact.js`.
- **Checklist content:** stages and actions live in `assets/js/checklist-data.js`; counts are derived from the data, never hardcoded.
- **Official logo:** see [Swap in the official CSID Network logo](#swap-in-the-official-csid-network-logo).
- **Environment:** copy `.env.example` to `.env` for any local secrets. `.env` is git-ignored; never commit real credentials.

## Project structure

```
├── index.html / about.html / resources.html / downloads.html
├── checklist.html / contact.html / 404.html        # generated — edit tools/build_pages.py
├── assets/
│   ├── css/style.css            # design system + all component styles
│   ├── js/
│   │   ├── util.js              # shared helpers (esc, getCategory, toast, isRecord)
│   │   ├── main.js              # nav, header, reveal, year
│   │   ├── resources-data.js    # ← edit this to add/change resources
│   │   ├── resources.js         # search + filter rendering
│   │   ├── downloads.js         # downloads table rendering
│   │   ├── checklist-data.js    # ← checklist stages/actions (single source of counts)
│   │   ├── checklist.js         # interactive checklist + backup
│   │   └── contact.js           # mailto / Formspree handling
│   ├── fonts/                   # self-hosted Inter + Inter Tight (woff2)
│   └── images/                  # official CSID logo, favicon, share image, LOGO-SOURCE.md
├── downloads/                   # toolkit PDFs, DOCX, and the all-in-one zip
├── tests/                       # node:test unit + regression suite (jsdom)
├── tools/
│   ├── build_pages.py           # regenerate the HTML pages
│   └── build_downloads_zip.py   # rebuild the download-all zip
├── .github/                     # CI, CodeQL, Dependabot, issue/PR templates, CODEOWNERS
├── package.json                 # dev-only tooling + scripts
├── eslint.config.js / tsconfig.json / .prettierrc.json
└── SECURITY.md / CODE_OF_CONDUCT.md / CONTRIBUTING.md / CHANGELOG.md
```

## Deploy to GitHub Pages

This v2 lives in its **own** repository, separate from the original toolkit. Pages is already enabled (Deploy from a branch → `main` / root, with `.nojekyll`). On a fresh fork:

```bash
git remote add origin https://github.com/<you>/ce4csid-toolkit-v2.git
git push -u origin main
# Settings → Pages → Source: "Deploy from a branch" → main / (root)
```

The site will be live at `https://<you>.github.io/ce4csid-toolkit-v2/`. If you choose a different repo name, update `BASE`/`REPO` in `tools/build_pages.py`, then `npm run build:pages`, and update `sitemap.xml`, `robots.txt`, and the footer GitHub link.

## Official CSID Network logo

The site uses the **official CSID Network artwork** from the Identity Guidelines logo pack:
the full teal lockup in the header, the neutral-white lockup in the footer, the globe logomark
as the favicon, and the official social avatar for the apple-touch icon. Provenance and brand
rules are recorded in `assets/images/LOGO-SOURCE.md`.

Per the style guide, do not recolour the globe icon with other brand colours; use the logo in
full colour, brand teal, black, or white only, and keep clear space around the mark.

## Toolkit structure (layout guide)

The Resources page follows the CE4CSID Toolkit Structure Guide: **six parts and sixteen numbered
chapters**. Each chapter is a stable content space (`#chapter-1` … `#chapter-16`) so final Working
Group content can be pasted into the matching chapter without changing the layout. Current
placeholder resources are linked from the chapters where they fit, and the searchable resource
library remains below the outline.

## Replace placeholder content

Drop the Working Group's final files into `downloads/` using the **same filenames**, and the links, search, and zip keep working. Then:

```bash
npm run build:zip
```

## Brand compliance (CSID Identity Guidelines)

| Role                    | Colour                                                                            |
| ----------------------- | --------------------------------------------------------------------------------- |
| Primary / text on light | Teal `#044953`                                                                    |
| Neutral page background | `#EFF4E3`                                                                         |
| Accents (cards)         | Lime `#D3F781`, Blue `#46CBDE`, Purple `#BBBDF3`, Red `#FC8170`, Yellow `#FFB605` |
| Text on dark            | Neutral white `#FFFFFF`                                                           |
| Headings / logo         | Inter Tight                                                                       |
| Body                    | Inter                                                                             |

Text uses only the darkest teal (on light) or neutral white (on dark), per the guide's accessible pairings.

## Roadmap

- [ ] Replace placeholder downloads with the Working Group's final content.
- [ ] Optional: connect the contact form to a live Formspree endpoint.
- [ ] Raise the Node floor to 22 and re-enable jsdom / TypeScript major updates.
- [ ] Gather practitioner feedback and iterate on the checklist actions.

## Security

The repo is hardened with: CI quality gates (Node 20/22), CodeQL (`security-extended`), gitleaks (code + full history), Dependabot alerts + security + version updates, secret scanning + push protection, private vulnerability reporting, and branch protection on `main` (passing checks required, 0 approvals for the solo maintainer, no force-push/deletion, linear history).

To report a vulnerability, **do not open a public issue** — see [SECURITY.md](SECURITY.md) for private reporting.

## Credits & licence

- Content: CE4CSID Working Group / CSID Network.
- Design & development: **Kabo Merapelo Onamile**, Digital Health Developer.
- Code: MIT Licence (see `LICENSE`). Toolkit content remains the property of the CE4CSID Working Group / CSID Network.
