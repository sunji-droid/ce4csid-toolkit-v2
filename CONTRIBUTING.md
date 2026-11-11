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

Use the [contact form](contact.html) or email **contactus@bshdngo.org** with:

- the page and what you expected,
- what actually happened,
- your browser and device (a screenshot helps).

## Code style

- No build step and no runtime dependencies — keep it that way.
- Vanilla JavaScript, semantic HTML, and the existing CSS design tokens.
- Test at mobile and desktop widths, and with keyboard only, before submitting.
