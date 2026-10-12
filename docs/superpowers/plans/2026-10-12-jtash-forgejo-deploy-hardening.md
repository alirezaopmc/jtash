# jtash Forgejo Deployment Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure jtash production deployment runs only after the same Forgejo workflow's CI check succeeds.

**Architecture:** Keep Forgejo as the canonical CI and deployment provider. Add the Vercel production job to the existing Forgejo CI workflow, gate it on `check`, and remove the independent deploy workflow so a main push cannot bypass the check. Use the existing Forgejo secret names and the documented Vercel prebuilt deployment pattern.

**Tech Stack:** Forgejo Actions YAML, Bash, Bun 1.4.0, Vercel CLI.

**Spec:** `handbook/docs/orbit/guides/ci-and-runners.md` (Portfolio / Vercel + private packages; Forgejo runner labels and client CI track).

## Global Constraints

- Canonical staff/client CI and deployment provider is Forgejo (`origin`).
- Keep `runs-on: vps` for the existing host CI script.
- Run Vercel build and deploy on `ubuntu-latest`, with package-registry auth via `NPM_TOKEN`.
- Production deployment must depend on successful `check` and run only for pushes to `main` or explicit manual dispatch from `main`.
- Do not cancel an active production deploy when a newer main push arrives; set workflow concurrency to keep active runs.
- Use existing Forgejo secret names: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.
- Do not add GitHub Actions workflows for the client deployment path.

## Review Focus

- Pull-request and non-main events must never deploy; cover with the job's event/ref condition.
- A failed `check` must prevent deployment; cover with `needs: check`.
- Secrets must not be interpolated directly into shell source; pass them through environment variables.
- The standalone deploy workflow must not remain active and race the gated deploy job; remove it.
- Workflow dispatch must retain production deployment capability only when run from the `main` ref.
- A newer main push must not cancel an active deployment; preserve the previous deploy workflow's `cancel-in-progress: false` behavior.

---

### Task 1: Gate Forgejo production deployment on CI

**Files:**
- Modify: `.forgejo/workflows/ci.yml`
- Delete: `.forgejo/workflows/deploy.yml`
- Delete: `.github/workflows/ci.yml` (the branch's competing GitHub workflow)

**Interfaces:**
- Consumes: existing `check` job, which runs `orbit-infra/scripts/ci-host-ts.sh` on `vps`.
- Produces: one `deploy-production` job that runs only after `check` succeeds and only for a main push or manual dispatch on main.

- [x] **Step 1: Add workflow dispatch and deployment condition**

Add `workflow_dispatch` to the existing triggers. Add `deploy-production` with `needs: check`, `runs-on: ubuntu-latest`, and a condition equivalent to: push on `refs/heads/main`, or manual dispatch on `refs/heads/main`.

Set workflow `cancel-in-progress` to `false` so a newer run cannot interrupt an active Vercel deployment.

- [x] **Step 2: Add the documented Vercel prebuilt deployment steps**

Check out the same workflow ref with checkout pinned to the existing SHA. Set up Bun 1.4.0 with the existing pinned action SHA. Configure Verdaccio auth from `NPM_TOKEN`, install with `bun install --frozen-lockfile`, install a fixed Vercel CLI version, pull production settings, build with `vercel build --prod`, then deploy with `vercel deploy --prebuilt --prod`.

- [x] **Step 3: Pass credentials through environment variables**

For each Vercel command, pass `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` through the step environment; reference `$VERCEL_TOKEN` in the shell command. Keep secrets out of inline expression interpolation.

- [x] **Step 4: Remove the duplicate standalone deploy workflow**

Delete `.forgejo/workflows/deploy.yml` so the repository has a single main-push production deploy path, gated by `check`. Delete the GitHub Actions workflow introduced by this branch so production CI and deployment remain Forgejo-owned.

- [x] **Step 5: Validate workflow structure and repository diff**

Run the available workflow linter/parser and inspect the resulting YAML and diff. Expected: the Forgejo CI workflow still runs on push and pull request, deploy is gated by `needs: check` and the main-only condition, and no standalone Forgejo deploy workflow or GitHub Actions workflow remains.

- [x] **Step 6: Commit**

```bash
git add .forgejo/workflows/ci.yml .forgejo/workflows/deploy.yml .github/workflows/ci.yml docs/superpowers/plans/2026-10-12-jtash-forgejo-deploy-hardening.md
git commit -m "fix(ci): gate jtash production deploy on checks"
```
