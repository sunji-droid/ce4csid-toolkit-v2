# Security Policy

## Supported versions

Only the latest release receives security fixes.

| Version | Supported |
| ------- | --------- |
| v2.x    | Yes       |
| < v2.0  | No        |

## Reporting a vulnerability

Do not open a public issue for a security problem.

Use the **Report a vulnerability** button on the [Security tab](https://github.com/sunji-droid/ce4csid-toolkit-v2/security/advisories) of this repository, or email **wg-ce4csid@csidnet.org** with the subject line `[CE4CSID Toolkit Security]`.

Include:

- steps to reproduce,
- the affected version or commit,
- the impact,
- any suggested fix, if you have one.

You will get a first reply within 7 days. Please allow reasonable time to investigate and fix before any public disclosure.

## Scope

This is a static site with no server-side code and no runtime dependencies. The most relevant areas are:

- client-side JavaScript (search, checklist, contact form),
- downloadable documents,
- GitHub Actions workflows and repository configuration.

The optional Formspree endpoint used by the contact form is a public client-side identifier, not a secret. Never commit personal access tokens, API keys, or `.env` files.
