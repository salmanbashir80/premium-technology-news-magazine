import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const compiler = require.resolve("typescript/bin/tsc");

for (const project of ["tsconfig.json", "tsconfig.qa.json"]) {
  console.log(`Typecheck: ${project}`);
  const result = spawnSync(
    process.execPath,
    [compiler, "--project", project, "--noEmit", "--pretty", "false"],
    { cwd: root, stdio: "inherit" },
  );
  if (result.error) console.error(result.error.message);
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}

console.log("Typecheck passed: application, Vite config, and browser tests. No files emitted.");