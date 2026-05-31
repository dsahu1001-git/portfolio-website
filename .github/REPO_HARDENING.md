# Public Repo Hardening Checklist

Use this before making the repository public.

## Local Checks

- Run `make scan-secrets`.
- Run `gitleaks detect --source . -v` when `gitleaks` is installed.
- Run `git log --all -p -- . ':(exclude)node_modules' | grep -iE "(api[_-]?key|secret|token|password|aws_)"`.
- Confirm only dummy values are present in `.env.local.example`.
- Confirm there are no `.env`, `.envrc`, `*.pem`, `*.key`, `terraform.tfstate`, `.aws/`, or `.kube/config` files.
- Generate and commit `package-lock.json` with `npm install --package-lock-only`.
- Run `make ci`.
- Clone to `/tmp` and follow the README from scratch.

## GitHub Settings

- Enable secret scanning and push protection.
- Actions workflow permissions: read repository contents and packages.
- Require approval for all outside collaborators.
- Disable Wiki, Projects, and Discussions unless actively used.
- Fill in description, topics, and social preview image.
- Keep default branch set to `main`.

## Branch Protection: `main`

- Require a pull request before merging.
- Do not require approvals for a solo repository.
- Require status checks to pass: `lint-test`.
- Require branches to be up to date before merging.
- Require conversation resolution.
- Do not allow bypassing branch protection.
- Do not allow force pushes.
- Do not allow deletions.
