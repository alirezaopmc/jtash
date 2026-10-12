import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const workspaceBuildScript = resolve(
  process.cwd(),
  "../../../manovaspace/ts/scripts/ensure-build.mjs",
);

if (!existsSync(workspaceBuildScript)) {
  console.log(
    "Skipping local ManovaSpace workspace build; published packages are used.",
  );
} else {
  execFileSync("bun", [workspaceBuildScript], { stdio: "inherit" });
}
