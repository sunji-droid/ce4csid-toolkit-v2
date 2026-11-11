# Contributing to the CE4CSID Toolkit

Thank you for helping improve the Community Engagement Toolkit. This guide is for
Working Group members and collaborators adding content or reporting issues.

## Adding or updating a resource

1. Put the final file in `downloads/`. Use a clear, lowercase, hyphenated filename,
   e.g. `framework-stakeholder-mapping.pdf`. To replace a placeholder, keep the
   **same filename** so existing links keep working.
2. Add or edit its entry in `assets/js/resources-data.js` (title, description,
   category, type, size, file path). It will appear on both the Resources and
   Downloads pages automatically.
3. Rebuild the download-all bundle:
   ```bash
   python3 tools/build_downloads_zip.py
   ```
4. Open a pull request describing what changed and why.

## Content guidelines

- Write in plain language; the audience includes community-facing practitioners,
  not only researchers.
- Keep the CSID brand: headings in Inter Tight, body in Inter, text in darkest
  teal (`#044953`) on light backgrounds or white on dark. Do not recolour the
  official logo.
- Mark draft or placeholder material clearly inside the document itself.

## Reporting a problem

Use the [contact form](contact.html) or email **mkonamile@gmail.com** with:

- the page and what you expected,
- what actually happened,
- your browser and device (a screenshot helps).

## Development workflow

The visitor-facing site has **no runtime dependencies** — keep it that way. All
tooling (lint, tests, types) is dev-only.

```bash
npm ci          # install dev tooling from the lockfile
npm run check   # lint + format + typecheck + tests (coverage >= 80%) + audit
```

Before opening a pull request, make sure `npm run check` passes locally. The HTML
pages are generated: edit `tools/build_pages.py` and run `npm run build:pages`
rather than hand-editing `.html` files.

### Commit messages (Conventional Commits)

Use [Conventional Commits](https://www.conventionalcommits.org) so the history
and changelog stay readable:

```
<type>(<optional scope>): <short summary>
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`,
`chore`. Examples:

```
feat(checklist): add per-stage completion badges
fix(resources): validate unknown category query params
ci: pin actions to major versions
docs: expand README configuration section
```

### Pull requests & branch protection

`main` is protected: changes go through a pull request, the CI checks (quality
gates on Node 20/22, secret scan, CodeQL) must pass, and history stays linear.
As a solo maintainer you can merge your own PR (0 approvals required); use
**squash merge**. Fill in the PR template and link any related issue.

## Code style

- No build step and no runtime dependencies for the visitor-facing site.
- Vanilla JavaScript (ES modules), semantic HTML, and the existing CSS design tokens.
- Run `npm run format` before committing; lint and type checks must pass with zero
  errors and no rule disabling.
- Test at mobile and desktop widths, and with keyboard only, before submitting.
