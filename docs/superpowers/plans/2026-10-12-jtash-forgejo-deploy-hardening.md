# jtash Forgejo Deployment Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure jtash production deployment runs only after the same Forgejo workflow's CI check succeeds.

**Architecture:** Keep Forgejo as the canonical CI and deployment provider. Add the Vercel production job to the existing Forgejo CI workflow, gate it on `check`, and remove the independent deploy workflow so a main push cannot bypass the check. Use the existing Forgejo secret names and the documented Vercel prebuilt deployment pattern. The app resolves its declared `@manovaspace/*` semver dependencies from the registry and has no workspace members outside its checkout; its prebuild skips the optional local sibling build when the ManovaSpace TypeScript checkout is absent.

**Tech Stack:** Forgejo Actions YAML, Bash, Bun 1.4.0, Vercel CLI.

**Spec:** `handbook/docs/orbit/guides/ci-and-runners.md` (Portfolio / Vercel + private packages; Forgejo runner labels and client CI track).

## Global Constraints

- Canonical staff/client CI and deployment provider is Forgejo (`origin`).
- Keep `runs-on: vps` for the existing host CI script.
- Run Vercel build and deploy on `ubuntu-latest`; the app uses published `@manovaspace/*` packages and has no private `@orbit/*` dependency, so no registry token is needed.
- Production deployment must depend on successful `check` and run only for pushes to `main` or explicit manual dispatch from `main`.
- Do not cancel an active production deploy when a newer main push arrives; set workflow concurrency to keep active runs.
- Use existing Forgejo secret names: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`. Disable checkout credential persistence before install/build.
- Do not add GitHub Actions workflows for the client deployment path.

## Review Focus

- Pull-request and non-main events must never deploy; cover with the job's event/ref condition.
- A failed `check` must prevent deployment; cover with `needs: check`.
- Secrets must not be interpolated directly into shell source; pass them through environment variables.
- The standalone deploy workflow must not remain active and race the gated deploy job; remove it.
- Workflow dispatch must retain production deployment capability only when run from the `main` ref.
- A newer main push must not cancel an active deployment; preserve the previous deploy workflow's `cancel-in-progress: false` behavior.
- An isolated deploy checkout has published `@manovaspace/*` packages but no `../../../manovaspace/ts`; its prebuild must finish successfully without attempting to execute a missing file.
- A frozen install from an isolated checkout must not require `../../../manovaspace/design-system` workspace directories.

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

Check out the same workflow ref with checkout pinned to the existing SHA and `persist-credentials: false`. Set up Bun 1.4.0 with the existing pinned action SHA. Install public dependencies with `bun install --frozen-lockfile`, install a fixed Vercel CLI version, pull production settings, build with `vercel build --prod`, then deploy with `vercel deploy --prebuilt --prod`.

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

### Task 2: Allow the published-package build in an isolated checkout

**Files:**
- Modify: `package.json`
- Create: `scripts/ensure-manovaspace-build.mjs`
- Test: `tests/deploy-isolation.test.mjs`

**Interfaces:**
- Consumes: the optional local `../../../manovaspace/ts/scripts/ensure-build.mjs` workspace helper.
- Produces: `bun scripts/ensure-manovaspace-build.mjs`, which invokes the workspace helper when present and succeeds with a clear message when deployment uses published packages without that sibling checkout.

- [x] **Step 1: Add an isolated-checkout regression assertion**

Run the helper from a temporary directory containing only the helper itself. Expected: current configuration fails because the helper does not exist.

- [x] **Step 2: Implement optional local workspace build**

Update `prebuild` to call the checked-in helper. The helper should resolve the existing shared build script from the project root, execute it with Bun when found, and skip only when that sibling script is absent.

- [x] **Step 3: Run the regression and application checks**

Run the scratch isolated-checkout assertion, then Bun 1.4.0 frozen install, typecheck, lint, and production build. Expected: the isolated helper prints its skip message; all application checks pass.

- [x] **Step 4: Commit**

```bash
git add package.json scripts/ensure-manovaspace-build.mjs docs/superpowers/plans/2026-10-12-jtash-forgejo-deploy-hardening.md
git commit -m "fix(build): support isolated jtash deployment"
```

### Task 3: Close isolated-deploy review findings

**Files:**
- Modify: `.forgejo/workflows/ci.yml`
- Modify: `package.json`
- Create: `tests/deploy-isolation.test.mjs`
- Modify: this plan

- [x] Set `persist-credentials: false` on the deployment checkout so its checkout token cannot remain available during install/build.
- [x] Remove Verdaccio token setup: the frontend declares no private `@orbit/*` dependency, and its `@manovaspace/*` dependencies are published packages.
- [x] Commit regression tests for isolated prebuild behavior and deploy workflow assumptions; run them in host CI along with lint, typecheck, and build.
- [x] Restore Bun 1.4.0 dependencies and run regression tests, lint, typecheck, and production build against the isolated deployment assumptions.
- [ ] Request an independent review; do not push or merge until review is clear.

### Task 4: Make frozen install independent of sibling repositories

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`
- Modify: `tests/deploy-isolation.test.mjs`
- Modify: `AGENTS.md`
- Delete: `scripts/ensure-manovaspace-build.mjs`
- Modify: this plan

**Interfaces:**
- Consumes: the app's existing published semver ranges for `@manovaspace/tokens` and `@manovaspace/ui`.
- Produces: a lockfile whose install inputs are all present in the isolated JTash checkout or public registry.

- [x] **Step 1: Add an isolated-manifest regression assertion**

Assert that `package.json` has no workspace entries or prebuild sibling hook and `bun.lock` contains no workspace dependency pointing outside JTash. Run `node --test tests/deploy-isolation.test.mjs` before changing the manifest. Expected: the new test fails because the existing workspace config points at the ManovaSpace Design System checkout.

- [x] **Step 2: Remove cross-repo workspace membership and regenerate the lockfile**

Remove the unused workspace catalog and sibling package paths from `package.json`; retain the existing semver dependency ranges. Remove the prebuild helper that only builds unrelated sibling packages, and correct repo-local package guidance. Regenerate `bun.lock` with Bun 1.4.0. Expected: tokens and UI resolve to their existing published versions and no `workspace:` entries or build hooks refer to sibling repositories.

- [x] **Step 3: Verify install and app checks**

Run Bun 1.4.0 frozen install in the worktree and in a scratch checkout containing only `package.json`, `bun.lock`, and `.npmrc`. Run `bun run test`, `bun run lint`, `bun run typecheck`, and `bun run build`. Expected: both installs pass without access to sibling repositories; all app checks pass.

- [ ] **Step 4: Independent review before merge**
