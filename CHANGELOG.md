# Changelog

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
