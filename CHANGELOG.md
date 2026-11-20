# Changelog

## v2.1.8 - 2026-11-20

### Changed

- Checklist actions now use the Working Group's own question wording, unchanged, rather than a
  shortened version of it. All forty questions are as written in the source document, each with a
  short practical note underneath.

## v2.1.7 - 2026-11-20

### Changed

- Checklist content replaced with the Working Group's eight-stage checklist: forty actions across
  community identification, consultation, participatory design, approvals, resource planning,
  implementation, participatory monitoring, and results dissemination. Wording follows the source
  document, with a short practical note under each action.
- Saved progress key moved to `ce4csid_checklist_v3`, so a checklist started under the old five
  stage structure cannot be mismatched against the new action IDs.
- Checklist page lede updated to describe eight stages.

## v2.1.5 - 2026-11-20

### Changed

- Toolkit icon: the question mark is now drawn as a pen stroke rather than set from the typeface.
  The hook, stem and dot come from a single tapered outline with a slightly irregular dot, tilted
  16 degrees, so it reads as something sketched onto the wordmark rather than a glyph placed beside
  it. Chosen by the Working Group from four drawn options.
- Toolkit icon artwork is centred on its own ink box, so the tile no longer reads top heavy with an
  empty lower half.
- Footer support line reads "The CE4CSID Toolkit is supported by the CSIDNet." at the Working
  Group's request. Applied to all seven pages and the share images.

## v2.1.4 - 2026-11-19

### Changed

- Toolkit icon enlarged: 56 px in the header, 64 px in the footer brand block, and 40 px on small
  screens, so the CE4 monogram reads clearly at a glance.
- Added the tilted question mark from the Working Group's review, in brand lime, after the 4. It is
  drawn from Inter Tight like the rest of the mark, and shares the tile with no extra elements so it
  survives the browser tab size.

## v2.1.3 - 2026-11-18

### Changed

- Toolkit icon is now a CE4 monogram, drawn from Inter Tight in the site fonts and shipped as
  vector paths, so no font is needed when it renders. Applied to the header, footer brand block,
  favicon, apple touch icon, and share images.
- Added `tools/build_share_images.py` so the share images can be regenerated from the icon.

### Notes

- The monogram deliberately has no enclosing ring, because a circled CE is the EU conformity
  marking. The 4 in brand lime makes the mark specific to this toolkit.

## v2.1.2 - 2026-11-17

### Added

- Separate CE4CSID Toolkit product icon for the site header, footer brand block, favicon,
  apple touch icon, and share image.
- Footer support line with the official CSID Network logo: "The CE4CSID Toolkit, supported by
  the CSID Network".

## v2.1.1 - 2026-11-13

### Fixed

- Made the all-resources zip deterministic so rebuilding it on a fresh clone does not create a
  timestamp-only diff.
- Added a CI step to verify that generated pages and the download zip match the committed files.

## v2.1.0 - 2026-11-13

### Added

- Six-part, sixteen-chapter toolkit structure on the Resources page, with stable chapter content
  spaces and links to the current placeholder resources.
- Regression tests for the layout guide, public contact email, copy polish, and paragraph
  justification.

### Changed

- Replaced the placeholder mark with the official CSID Network logo pack across the site, favicon,
  and share images.
- Corrected attribution to CSID Network / CE4CSID Working Group, built by Kabo Merapelo Onamile.
- Public contact now uses the CE4CSID Working Group address (wg-ce4csid@csidnet.org).
- Edited site copy to remove em dashes and formulaic phrasing. Body paragraphs are justified with
  hyphenation and clean wrapping; headings, buttons, navigation, and form controls stay left-aligned.
- Updated home and about pages to describe the six-part toolkit structure.

### Fixed

- Removed unrelated third-party organisation references from the site, documents, and repository
  metadata.

## v2.0.0 - 2026-11-11

Ground-up redesign on the CSID Network Identity Guidelines, in a new repository.

### Added

- CSID brand system: exact palette, accessible pairings, self-hosted Inter Tight + Inter.
- Resources page: live search, category filters, deep-linkable URLs, result counts, empty state.
- Downloads page: live filter and a "Download all (.zip)" bundle.
- Single resource data source (`resources-data.js`) shared by Resources and Downloads.
- Checklist: project name, expand/collapse all, JSON backup export & import, per-stage completion, completion toast.
- Contact form mailto fallback (works without a backend); optional Formspree endpoint.
- Open Graph / Twitter cards, canonical URLs, branded share image, sitemap.xml, robots.txt.
- Sticky header, scroll-reveal animations, custom 404, print stylesheet for the checklist.

### Changed

- Rebuilt all pages (Home, About, Resources, Downloads, Checklist, Contact) on the new design system.
- Checklist storage key bumped to `ce4csid_checklist_v2`; multiple stages can stay open at once.
- Placeholder logo mark pending the official CSID Network logo.
- Refactored all client code into ES modules with a shared `util.js`; checklist content split into `checklist-data.js`. Counts are derived from data, not hardcoded.

### Fixed (hardening audit F1 to F15)

- Checklist accordion now wraps the button in an `h3` (valid HTML), not the reverse.
- Category query params are validated against known categories.
- Removed hardcoded action/resource counts from the generated pages.
- `FileReader` errors surface a toast instead of failing silently; imported backups are shape-validated.
- De-duplicated `esc`/`getCategory` into `util.js`; split the large checklist render into `buildStage`/`buildItem`/`renderChecklist`.
- Tamed hero-blur cost on small screens and removed it for reduced motion.

### Security & quality

- Dev-only tooling: ESLint (zero errors), Prettier, TypeScript strict `checkJs`, `node:test` + jsdom with c8 coverage enforced at ≥80% (53 tests, ~98% statements).
- One regression test per fixed audit bug; no real network or clock in unit tests.
- CI on push/PR (read-only permissions, pinned action majors, Node 20/22 matrix), CodeQL, gitleaks (code + full history), Dependabot, secret scanning + push protection, private vulnerability reporting, and branch protection on `main`.
- Governance: SECURITY.md, CODE_OF_CONDUCT.md, .editorconfig, .env.example, issue/PR templates, CODEOWNERS, Conventional Commits.

## v1.0.0 - 2026-07-17

- Initial Option B build: branded GitHub Pages site, resources, downloads, interactive checklist, contact.
- 2026-07-19: accessibility, SEO, and social-sharing improvements on the resources page.
