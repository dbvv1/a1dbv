import {
  assertExpected,
  assertVersions,
  assertInput,
  expectedVersions,
} from "./acceptance.mjs";
import assert from "node:assert/strict";
import { NodeIO } from "@gltf-transform/core";
import { nodeFor, run } from "./selectors.mjs";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
const io = new NodeIO();
const checks = {};
let d = await io.read("source-r0.glb");
assert.equal(nodeFor(d, "Hero").getExtras().experimentMember, "Hero");
assert.equal(run(d).getName(), "Hero/Run");
checks.validIdentity = true;
assert.throws(() => nodeFor(d, "Missing"), /expected exactly 1, found 0/);
checks.missingMemberRefused = true;
const originalMesh = nodeFor(d, "Hero").getMesh();
d.createNode("duplicate")
  .setExtras({ experimentMember: "Hero" })
  .setMesh(originalMesh);
assert.throws(() => nodeFor(d, "Hero"), /expected exactly 1, found 2/);
checks.ambiguousMemberRefused = true;
d = await io.read("source-r0.glb");
run(d).setName("Missing");
assert.throws(() => run(d), /expected exactly 1, found 0/);
checks.missingClipRefused = true;
d = await io.read("source-r0.glb");
run(d).clone();
assert.throws(() => run(d), /expected exactly 1, found 2/);
checks.ambiguousClipRefused = true;
d = await io.read("source-r0.glb");
run(d)
  .listChannels()[0]
  .setTargetNode(
    d
      .getRoot()
      .listNodes()
      .find((n) => n.getExtras().experimentMember === "Control"),
  );
assert.throws(() => run(d), /targets another member/);
checks.crossMemberClipRefused = true;
d = await io.read("source-r0.glb");
for (const c of run(d).listChannels()) c.dispose();
assert.throws(() => run(d), /empty Hero\/Run/);
checks.emptyClipRefused = true;
d = await io.read("source-r0.glb");
const ns = d
  .getRoot()
  .listNodes()
  .filter((n) => n.getExtras().experimentMember === "Hero");
ns[1].setExtras({
  ...ns[1].getExtras(),
  sourceNode: ns[0].getExtras().sourceNode,
});
assert.throws(() => nodeFor(d, "Hero"), /duplicate sourceNode/);
assert.throws(() => run(d), /duplicate sourceNode/);
checks.duplicateSourceNodeRefused = true;
d = await io.read("source-r0.glb");
const noid = d
  .getRoot()
  .listNodes()
  .find((n) => n.getExtras().experimentMember === "Hero");
noid.setExtras({ experimentMember: "Hero" });
assert.throws(() => nodeFor(d, "Hero"), /missing or duplicate sourceNode/);
checks.missingSourceNodeRefused = true;
const p = spawnSync(process.execPath, ["probe.mjs"], {
  env: { ...process.env, FOX_INPUT: "missing-input.glb" },
  encoding: "utf8",
});
assert.notEqual(p.status, 0);
assert.match(p.stderr, /ENOENT/);
checks.missingInputHardFailure = { exitCode: p.status, error: "ENOENT" };
const baseline = JSON.parse(fs.readFileSync("results.json"));
assertExpected(baseline);
for (const [label, mutate] of Object.entries({
  positiveIsolation: (r) => (r.checks.cow.R2_otherMembersUnchanged = false),
  missingNegativeFailure: (r) =>
    (r.checks.naive.R1_otherMembersUnchanged = true),
  routeEquivalence: (r) => (r.checks.cowMatchesRebuildR2 = false),
  validatorError: (r) => (r.artifacts["cow-r2"].validator.errors = 1),
  validatorWarning: (r) => (r.artifacts["cow-r2"].validator.warnings = 1),
})) {
  const bad = structuredClone(baseline);
  mutate(bad);
  assert.throws(() => assertExpected(bad));
  checks[label + "Rejected"] = true;
}
assert.throws(() => assertVersions({ ...expectedVersions, core: "0.0.0" }));
checks.versionMismatchRejected = true;
assert.throws(() => assertInput("0".repeat(64)));
checks.inputHashMismatchRejected = true;
for (const [label, mutation] of [
  ["unexpectedPositive", "r.checks.cow.R2_otherMembersUnchanged=false"],
  ["unexpectedValidator", 'r.artifacts["cow-r2"].validator.warnings=1'],
]) {
  const code = `import fs from 'node:fs';import {assertExpected} from './acceptance.mjs';const r=JSON.parse(fs.readFileSync('results.json'));${mutation};assertExpected(r);`;
  const child = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", code],
    { encoding: "utf8" },
  );
  assert.equal(child.status, 1);
  assert.match(child.stderr, /AssertionError/);
  checks[label + "ProcessExit"] = child.status;
}
fs.writeFileSync("failure-results.json", JSON.stringify(checks, null, 2));
console.log(JSON.stringify(checks, null, 2));
