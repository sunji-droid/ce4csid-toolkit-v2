# Changelog

## v2.0.0 — 2026-11-11

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

## v1.0.0 — 2026-07-17

- Initial Option B build: branded GitHub Pages site, resources, downloads, interactive checklist, contact.
- 2026-07-19: accessibility, SEO, and social-sharing improvements on the resources page.
