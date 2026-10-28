import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repoRoot = new URL("../", import.meta.url);

test("Forgejo deploy checkout does not persist credentials or configure unused npm auth", async () => {
  const workflow = await readFile(
    new URL(".forgejo/workflows/ci.yml", repoRoot),
    "utf8",
  );
  const deployJob = workflow.split("  deploy-production:")[1];

  assert.ok(deployJob, "expected deploy-production job");
  assert.match(
    deployJob,
    /uses: actions\/checkout@[\da-f]+[^\n]*\n\s+with:\n\s+persist-credentials: false/,
  );
  assert.doesNotMatch(deployJob, /NPM_TOKEN|Configure Verdaccio auth|\.npmrc/);
  assert.match(
    workflow,
    /HOST_TS_COMMANDS: bun run test && bun run lint && bun run typecheck && bun run build/,
  );
});

test("published ManovaSpace dependencies do not require sibling workspaces", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("package.json", repoRoot), "utf8"),
  );
  const lockfile = await readFile(new URL("bun.lock", repoRoot), "utf8");

  assert.equal(packageJson.workspaces, undefined);
  assert.equal(packageJson.scripts.prebuild, undefined);
  assert.doesNotMatch(lockfile, /workspace:\.\.\/\.\.\/\.\.\/manovaspace\//);
});
