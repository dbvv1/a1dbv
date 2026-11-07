// Probe the built sequentialthinking binary with pinned SDK protocol eras.
// The same consumer runs before and after the historical #5131 migration;
// auto negotiation would hide a missing modern implementation by falling back.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [rootArgument, expected] = process.argv.slice(2);
if (!rootArgument || !["baseline", "candidate"].includes(expected)) {
  console.error("Usage: node probe-built-eras.mjs <servers-checkout> baseline|candidate");
  process.exit(2);
}
const root = path.resolve(rootArgument);
const binary = path.join(root, "src/sequentialthinking/dist/index.js");
if (!existsSync(binary) || !existsSync(path.join(root, "package.json"))) {
  console.error("The checkout or built sequentialthinking binary is missing.");
  process.exit(2);
}
const require = createRequire(path.join(root, "package.json"));
const { Client } = await import(pathToFileURL(require.resolve("@modelcontextprotocol/client")));
const { StdioClientTransport } = await import(pathToFileURL(require.resolve("@modelcontextprotocol/client/stdio")));

async function probe(mode) {
  const client = new Client(
    { name: "migration-consumer", version: "1.0.0" },
    { versionNegotiation: { mode: mode === "modern" ? { pin: "2026-07-28" } : "legacy" } },
  );
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [binary],
    cwd: root,
    env: { DISABLE_THOUGHT_LOGGING: "true" },
    stderr: "pipe",
  });
  let phase = "connect";
  try {
    await client.connect(transport);
    phase = "consume";
    assert.equal(client.getProtocolEra(), mode);
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((tool) => tool.name), ["sequentialthinking"]);
    const history = [];
    for (const thoughtNumber of [1, 2]) {
      const result = await client.callTool({
        name: "sequentialthinking",
        arguments: {
          thought: `Public synthetic thought ${thoughtNumber}`,
          thoughtNumber,
          totalThoughts: 2,
          nextThoughtNeeded: thoughtNumber < 2,
        },
      });
      assert.equal(Boolean(result.isError), false);
      assert.equal(result.structuredContent.thoughtHistoryLength, thoughtNumber);
      assert.deepEqual(JSON.parse(result.content[0].text), result.structuredContent);
      history.push(result.structuredContent.thoughtHistoryLength);
    }
    const invalid = await client.callTool({ name: "sequentialthinking", arguments: {} });
    assert.equal(invalid.isError, true);
    return { mode, era: client.getProtocolEra(), history, missingInputRejected: true };
  } catch (error) {
    // Explicit refusal to negotiate the pinned era is the expected failure.
    // Installation, assertion and consumer failures are never accepted as it.
    if (expected === "baseline" && mode === "modern" && phase === "connect" && error.code === "ERA_NEGOTIATION_FAILED" && error.message.includes("did not offer pinned protocol version 2026-07-28")) {
      return { mode, rejectedAt: phase, code: error.code, message: error.message };
    }
    throw error;
  } finally {
    await client.close();
  }
}

const results = [];
for (const mode of ["legacy", "modern"]) {
  results.push(await probe(mode));
  // A fresh connection must start at one again, not inherit the previous two.
  if (expected === "candidate" || mode === "legacy") results.push(await probe(mode));
}
if (expected === "baseline") assert.equal(results.at(-1).code, "ERA_NEGOTIATION_FAILED");
console.log(JSON.stringify({ expected, node: process.version, results }, null, 2));
