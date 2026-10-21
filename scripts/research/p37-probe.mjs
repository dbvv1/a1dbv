import { assertExpected, assertVersions, assertInput } from "./acceptance.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { nodeFor, run } from "./selectors.mjs";
import { Document, NodeIO } from "@gltf-transform/core";
import { mergeDocuments, dedup, unpartition } from "@gltf-transform/functions";
import validator from "gltf-validator";
import fs from "node:fs/promises";
import crypto from "node:crypto";
const io = new NodeIO(),
  members = ["Hero", "Companion", "Control"],
  color = [0.2, 0.6, 0.9, 1];
const hash = (x) => crypto.createHash("sha256").update(x).digest("hex");
const ah = (a) =>
  a
    ? hash(
        new Uint8Array(
          a.getArray().buffer,
          a.getArray().byteOffset,
          a.getArray().byteLength,
        ),
      )
    : null;
async function family() {
  const doc = new Document(),
    scene = doc.createScene("ExperimentFamily");
  doc.getRoot().setDefaultScene(scene);
  for (const member of members) {
    const src = await io.read(process.env.FOX_INPUT || "Fox.glb");
    const r = src.getRoot();
    for (const method of [
      "listNodes",
      "listMeshes",
      "listMaterials",
      "listAnimations",
      "listAccessors",
      "listSkins",
      "listTextures",
    ])
      r[method]().forEach((p, i) =>
        p.setName(member + "/" + (p.getName() || method + "-" + i)),
      );
    r.listNodes().forEach((n, i) =>
      n.setExtras({
        ...n.getExtras(),
        experimentMember: member,
        sourceNode: i,
      }),
    );
    const map = mergeDocuments(doc, src);
    for (const s of r.listScenes()) {
      const mapped = map.get(s);
      for (const n of mapped.listChildren()) scene.addChild(n);
      mapped.dispose();
    }
  }
  await doc.transform(unpartition());
  return doc;
}
function r1(d, cow = false) {
  const n = nodeFor(d, "Hero");
  let mesh = n.getMesh();
  if (cow) {
    const cloned = mesh.clone();
    for (const p of cloned.listPrimitives()) {
      cloned.removePrimitive(p);
      cloned.addPrimitive(p.clone());
    }
    n.setMesh(cloned);
    mesh = cloned;
  }
  for (const p of mesh.listPrimitives()) {
    if (cow) p.setMaterial(p.getMaterial().clone());
    p.getMaterial().setBaseColorFactor(color);
  }
}
function r2(d, cow = false) {
  const map = new Map();
  for (const s of run(d).listSamplers()) {
    const old = s.getInput();
    if (!map.has(old)) {
      const a = cow ? old.clone() : old;
      a.setArray(a.getArray().map((t) => t * 0.8));
      map.set(old, a);
    }
    s.setInput(map.get(old));
  }
}
function snapshot(d) {
  const root = d.getRoot(),
    out = {};
  for (const member of members) {
    const n = nodeFor(d, member),
      mesh = n.getMesh();
    out[member] = {
      colors: mesh
        .listPrimitives()
        .map((p) => p.getMaterial().getBaseColorFactor()),
      geometry: mesh.listPrimitives().map((p) => ({
        indices: ah(p.getIndices()),
        attrs: Object.fromEntries(
          p.listSemantics().map((s) => [s, ah(p.getAttribute(s))]),
        ),
      })),
      skin: {
        joints: n
          .getSkin()
          .listJoints()
          .map((j) => j.getName()),
        ibm: ah(n.getSkin().getInverseBindMatrices()),
      },
      hierarchy: root
        .listNodes()
        .filter((n) => n.getExtras().experimentMember === member)
        .map((n) => [
          n.getName(),
          n.getTranslation(),
          n.getRotation(),
          n.getScale(),
          n.listChildren().map((c) => c.getName()),
        ]),
      animations: Object.fromEntries(
        root
          .listAnimations()
          .filter((a) => a.getName().startsWith(member + "/"))
          .map((a) => [
            a.getName().split("/")[1],
            a.listChannels().map((c) => ({
              target: c.getTargetNode().getName(),
              path: c.getTargetPath(),
              interpolation: c.getSampler().getInterpolation(),
              input: ah(c.getSampler().getInput()),
              output: ah(c.getSampler().getOutput()),
              duration: Math.max(...c.getSampler().getInput().getArray()),
            })),
          ]),
      ),
    };
  }
  return out;
}
function counts(d) {
  const r = d.getRoot();
  return {
    materials: r.listMaterials().length,
    meshes: r.listMeshes().length,
    accessors: r.listAccessors().length,
    runInputShared: members
      .map((m) =>
        r
          .listAnimations()
          .find((a) => a.getName() === m + "/Run")
          .listSamplers()[0]
          .getInput(),
      )
      .map((a, i, arr) => arr.indexOf(a)),
  };
}
const packageVersion = async (name) =>
  JSON.parse(
    await fs.readFile(
      path.join(
        path.dirname(fileURLToPath(import.meta.resolve(name))),
        "../package.json",
      ),
      "utf8",
    ),
  ).version;
const versions = {
  node: process.version,
  core: await packageVersion("@gltf-transform/core"),
  functions: await packageVersion("@gltf-transform/functions"),
  validator: validator.version(),
};
assertVersions(versions);
const inputSHA256 = hash(await fs.readFile(process.env.FOX_INPUT || "Fox.glb"));
assertInput(inputSHA256);
const results = { versions, inputSHA256, artifacts: {}, checks: {} };
async function save(name, d) {
  const bytes = await io.writeBinary(d);
  await fs.writeFile(name + ".glb", bytes);
  const v = await validator.validateBytes(bytes, { uri: name + ".glb" });
  await fs.writeFile(name + "-validator.json", JSON.stringify(v, null, 2));
  const read = await io.read(name + ".glb");
  const snap = snapshot(read);
  results.artifacts[name] = {
    bytes: bytes.length,
    sha256: hash(bytes),
    counts: counts(read),
    validator: { errors: v.issues.numErrors, warnings: v.issues.numWarnings },
    snapshot: snap,
  };
  return read;
}
const src = await save("source-r0", await family());
for (const mode of ["naive", "keepUniqueNames", "cow", "rebuild"]) {
  let d = await io.read("source-r0.glb");
  await d.transform(dedup({ keepUniqueNames: mode === "keepUniqueNames" }));
  d = await save(mode + "-r0", d);
  if (mode === "rebuild") d = await io.read("source-r0.glb");
  r1(d, mode === "cow");
  if (mode === "rebuild") await d.transform(dedup());
  d = await save(mode + "-r1", d);
  if (mode === "rebuild") {
    d = await io.read("source-r0.glb");
    r1(d);
  }
  r2(d, mode === "cow");
  if (mode === "rebuild") await d.transform(dedup());
  d = await save(mode + "-r2", d);
}
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
for (const mode of ["naive", "keepUniqueNames", "cow", "rebuild"]) {
  const b = results.artifacts["source-r0"].snapshot,
    r1s = results.artifacts[mode + "-r1"].snapshot,
    r2s = results.artifacts[mode + "-r2"].snapshot;
  results.checks[mode] = {
    R1_HeroColor: equal(r1s.Hero.colors, [color]),
    R1_otherMembersUnchanged: members
      .slice(1)
      .every((m) => equal(b[m], r1s[m])),
    R2_R1Retained: equal(r2s.Hero.colors, [color]),
    R2_otherMembersUnchanged: members
      .slice(1)
      .every((m) => equal(b[m], r2s[m])),
    R2_HeroOtherClipsUnchanged: ["Survey", "Walk"].every((c) =>
      equal(b.Hero.animations[c], r2s.Hero.animations[c]),
    ),
    R2_HeroGeometrySkinHierarchyUnchanged: [
      "geometry",
      "skin",
      "hierarchy",
    ].every((k) => equal(b.Hero[k], r2s.Hero[k])),
    R2_HeroRunOutputsUnchanged: equal(
      b.Hero.animations.Run.map(({ input, duration, ...x }) => x),
      r2s.Hero.animations.Run.map(({ input, duration, ...x }) => x),
    ),
    R2_HeroRunDuration08: r2s.Hero.animations.Run.every(
      (c, i) =>
        Math.abs(c.duration - b.Hero.animations.Run[i].duration * 0.8) < 1e-6,
    ),
  };
}
results.checks.cowMatchesRebuildR2 = equal(
  results.artifacts["cow-r2"].snapshot,
  results.artifacts["rebuild-r2"].snapshot,
);
await fs.writeFile("results.json", JSON.stringify(results, null, 2));
console.log(
  JSON.stringify(
    {
      checks: results.checks,
      artifacts: Object.fromEntries(
        Object.entries(results.artifacts).map(([k, { snapshot, ...v }]) => [
          k,
          v,
        ]),
      ),
    },
    null,
    2,
  ),
);

// Keep diagnostic outputs, but never report successful process status on an unexpected result.
assertExpected(results);
