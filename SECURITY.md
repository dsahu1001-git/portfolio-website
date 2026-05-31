# Security Policy

## Reporting a Vulnerability

Please do not open a public issue for suspected vulnerabilities or leaked secrets.

Email `hello@deepaksahu.dev` with:

- A concise description of the issue.
- Reproduction steps or affected paths.
- Any evidence needed to validate the finding.

## Public Repo Hygiene

- No production secrets should be committed to this repository.
- GitHub Actions workflows should run with read-only repository permissions unless a workflow explicitly requires more.
- Personal access tokens used for maintenance should be fine-grained, scoped to this repository, and expire within 90 days.
