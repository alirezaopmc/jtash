import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = new URL("../", import.meta.url);

test("prebuild succeeds when deployment checkout has no ManovaSpace sibling", async () => {
  const root = await mkdtemp(
    join(fileURLToPath(repoRoot), ".deploy-isolation-test-"),
  );
  const appRoot = join(root, "clients", "jtash", "frontend");

  try {
    await mkdir(join(appRoot, "scripts"), { recursive: true });
    await writeFile(
      join(appRoot, "scripts", "ensure-manovaspace-build.mjs"),
      await readFile(
        new URL("scripts/ensure-manovaspace-build.mjs", repoRoot),
        "utf8",
      ),
    );

    const result = spawnSync(
      process.execPath,
      [join(appRoot, "scripts", "ensure-manovaspace-build.mjs")],
      { cwd: appRoot, encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Skipping local ManovaSpace workspace build/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

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
