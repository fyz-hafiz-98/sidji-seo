import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const rules = JSON.parse(
  readFileSync("docs/maintainers/sidji/brand-allowlist.json", "utf8"),
);
const allowlist = rules.map((rule) => ({
  ...rule,
  path: new RegExp(rule.path),
  pattern: new RegExp(rule.pattern),
}));
const files = [
  ...new Set(
    execFileSync(
      "git",
      ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
      { encoding: "utf8" },
    )
      .split("\0")
      .filter(Boolean),
  ),
];
const failures = [];
const counts = new Map();
for (const path of files) {
  if (
    !/\.(?:[cm]?[jt]sx?|md|mdx|jsonc?|webmanifest|ya?ml|sh|example|css)$/.test(
      path,
    ) &&
    !["LICENSE", ".npmrc"].includes(path)
  )
    continue;
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    if (!/OpenSEO|Open SEO|openseo|open-seo/i.test(line)) continue;
    const rule = allowlist.find(
      (entry) => entry.path.test(path) && entry.pattern.test(line),
    );
    if (rule) counts.set(rule.reason, (counts.get(rule.reason) ?? 0) + 1);
    else failures.push(`${path}:${index + 1}: ${line.trim()}`);
  }
}
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
assert.equal(
  readJson("plugins/openseo/.mcp.json").mcpServers.openseo.url,
  "http://127.0.0.1:3001/mcp",
);
for (const provider of ["codex", "claude", "cursor"]) {
  const plugin = readJson(`plugins/openseo/.${provider}-plugin/plugin.json`);
  assert.equal(plugin.name, "openseo");
  assert.equal(plugin.repository, "https://github.com/fyz-hafiz-98/sidji-seo");
  if (provider === "codex")
    assert.equal(plugin.interface.displayName, "SiDJI SEO");
  if (provider === "claude") assert.equal(plugin.displayName, "SiDJI SEO");
}
for (const path of [
  "src/public/site.webmanifest",
  "web/public/site.webmanifest",
])
  assert.equal(readJson(path).name, "SiDJI SEO");
const pkg = readJson("package.json");
for (const name of [
  "deploy",
  "deploy:selfhost",
  "deploy:postgres",
  "deploy:preview",
  "preview:access",
  "destroy:preview",
  "db:migrate:prod",
  "db:migrate:pg",
  "sourcemaps:upload",
  "release:publish",
])
  assert.ok(
    pkg.scripts[name].startsWith("node scripts/remote-operation-guard.mjs && "),
    `${name} must be guarded`,
  );
const compose = readFileSync("compose.yaml", "utf8");
assert.ok(
  compose.includes("sidji-seo:local") &&
    compose.includes("dockerfile: deploy/docker/Dockerfile") &&
    compose.includes("127.0.0.1:${PORT:-3001}:${PORT:-3001}"),
);
assert.ok(
  readFileSync(".github/workflows/sourcemaps.yml", "utf8").includes(
    "if: github.repository == 'bensenescu/open-seo'",
  ),
);
assert.ok(
  readFileSync("LICENSE", "utf8").includes("Copyright (c) 2026 Ben Senescu"),
);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
console.log(
  `${files.length} files inventoried; ${[...counts.values()].reduce((a, b) => a + b, 0)} residual lines classified; ${failures.length} unclassified.`,
);
