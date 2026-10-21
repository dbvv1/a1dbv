// Independent decoder: no glTF-Transform dependency. Tests serialized GLB directly.
import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
const sha = (x) => crypto.createHash("sha256").update(x).digest("hex");
function load(file) {
  const b = fs.readFileSync(file);
  assert.equal(b.readUInt32LE(0), 0x46546c67);
  assert.equal(b.readUInt32LE(8), b.length);
  const n = b.readUInt32LE(12),
    j = JSON.parse(b.subarray(20, 20 + n));
  return { j, bin: b.subarray(28 + n), b };
}
const widths = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 },
  read = {
    5120: "readInt8",
    5121: "readUInt8",
    5122: "readInt16LE",
    5123: "readUInt16LE",
    5125: "readUInt32LE",
    5126: "readFloatLE",
  },
  count = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
function acc(g, id) {
  const a = g.j.accessors[id];
  assert(!a.sparse, "sparse accessor unsupported by this probe");
  const v = g.j.bufferViews[a.bufferView],
    c = count[a.type],
    w = widths[a.componentType];
  assert(c && w);
  const base = (v.byteOffset || 0) + (a.byteOffset || 0),
    stride = v.byteStride || c * w;
  return Array.from({ length: a.count }, (_, i) =>
    Array.from({ length: c }, (_, k) =>
      g.bin[read[a.componentType]](base + i * stride + k * w),
    ),
  );
}
const memberNode = (g, m) => {
  const nodes = g.j.nodes.filter(
    (n) => n.extras?.experimentMember === m && n.mesh !== undefined,
  );
  assert.equal(nodes.length, 1);
  return nodes[0];
};
function materialState(g, m) {
  return g.j.meshes[memberNode(g, m).mesh].primitives.map((p) => {
    const mat = structuredClone(g.j.materials[p.material]);
    delete mat.name;
    delete mat.pbrMetallicRoughness.baseColorFactor;
    const t = mat.pbrMetallicRoughness.baseColorTexture;
    if (t) {
      const tex = g.j.textures[t.index],
        image = g.j.images[tex.source],
        v = g.j.bufferViews[image.bufferView];
      t.index = {
        mimeType: image.mimeType,
        bytes: sha(
          g.bin.subarray(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength),
        ),
        sampler: g.j.samplers?.[tex.sampler] || null,
      };
    }
    return mat;
  });
}
function clip(g, m, name) {
  const a = g.j.animations.filter((a) => a.name === `${m}/${name}`);
  assert.equal(a.length, 1);
  return a[0].channels
    .map((c) => {
      const s = a[0].samplers[c.sampler];
      return {
        target: g.j.nodes[c.target.node].extras.sourceNode,
        path: c.target.path,
        interpolation: s.interpolation || "LINEAR",
        times: acc(g, s.input).flat(),
        values: acc(g, s.output),
      };
    })
    .sort((a, b) => a.target - b.target || a.path.localeCompare(b.path));
}
function structure(g, m) {
  const n = memberNode(g, m),
    skin = g.j.skins[n.skin];
  const identity = (i) => {
    const v = g.j.nodes[i];
    return [v.extras.experimentMember, v.extras.sourceNode];
  };
  return {
    geometry: g.j.meshes[n.mesh].primitives.map((p) => ({
      mode: p.mode ?? 4,
      indices: p.indices === undefined ? null : acc(g, p.indices),
      attributes: Object.fromEntries(
        Object.entries(p.attributes)
          .sort()
          .map(([k, v]) => [k, acc(g, v)]),
      ),
    })),
    skin: {
      joints: skin.joints.map(identity),
      skeleton: skin.skeleton === undefined ? null : identity(skin.skeleton),
      inverseBindMatrices: acc(g, skin.inverseBindMatrices),
    },
    hierarchy: g.j.nodes
      .filter((n) => n.extras?.experimentMember === m)
      .map((n) => ({
        id: n.extras.sourceNode,
        translation: n.translation ?? [0, 0, 0],
        rotation: n.rotation ?? [0, 0, 0, 1],
        scale: n.scale ?? [1, 1, 1],
        matrix: n.matrix ?? null,
        children: (n.children || []).map(identity),
      }))
      .sort((a, b) => a.id - b.id),
  };
}
function sample(c, t) {
  let i = 0;
  while (i < c.times.length - 2 && c.times[i + 1] < t) i++;
  const a = c.values[i],
    b = c.values[i + 1];
  let f = (t - c.times[i]) / (c.times[i + 1] - c.times[i]);
  f = Math.max(0, Math.min(1, f));
  assert.equal(c.interpolation, "LINEAR");
  if (c.path !== "rotation") return a.map((v, k) => v + (b[k] - v) * f);
  let dot = a.reduce((s, v, k) => s + v * b[k], 0),
    sign = dot < 0 ? -1 : 1;
  dot = Math.min(1, Math.abs(dot));
  const angle = Math.acos(dot);
  let v;
  if (dot > 0.9995) v = a.map((x, k) => x + (sign * b[k] - x) * f);
  else
    v = a.map(
      (x, k) =>
        (Math.sin((1 - f) * angle) * x + Math.sin(f * angle) * sign * b[k]) /
        Math.sin(angle),
    );
  const norm = Math.hypot(...v);
  return v.map((x) => x / norm);
}
const base = load("source-r0.glb"),
  report = {
    decoder: "independent raw GLB decoder, Node builtins only",
    checks: {},
    maxKeyError: 0,
    maxCurveError: 0,
    sampledVectors: 0,
  };
for (const mode of ["cow", "rebuild"]) {
  const g = load(mode + "-r2.glb");
  for (const m of ["Hero", "Companion", "Control"])
    assert.deepEqual(materialState(g, m), materialState(base, m));
  for (const m of ["Hero", "Companion", "Control"])
    for (const name of ["Survey", "Walk", "Run"]) {
      const b = clip(base, m, name),
        a = clip(g, m, name);
      if (m !== "Hero" || name !== "Run") {
        assert.deepEqual(a, b);
        continue;
      }
      assert.equal(a.length, b.length);
      for (let k = 0; k < a.length; k++) {
        assert.deepEqual(a[k].values, b[k].values);
        assert.equal(a[k].target, b[k].target);
        assert.equal(a[k].path, b[k].path);
        assert.equal(a[k].times.length, b[k].times.length);
        for (let i = 0; i < a[k].times.length; i++) {
          const e = Math.abs(a[k].times[i] - b[k].times[i] * 0.8);
          report.maxKeyError = Math.max(report.maxKeyError, e);
          assert(e < 1e-6);
        }
        for (let i = 0; i < b[k].times.length - 1; i++)
          for (const f of [0, 0.25, 0.5, 0.75, 1]) {
            const t = b[k].times[i] + f * (b[k].times[i + 1] - b[k].times[i]);
            const x = sample(a[k], t * 0.8),
              y = sample(b[k], t);
            const e = Math.max(...x.map((v, i) => Math.abs(v - y[i])));
            report.maxCurveError = Math.max(report.maxCurveError, e);
            report.sampledVectors++;
            assert(e < 1e-4);
          }
      }
    }
  report.checks[mode] = {
    everyHeroRunKeyScaled: true,
    normalizedTimeCurvesMatch: true,
    allOtherClipsUnchanged: true,
    materialSlotsAndNonColorPropertiesPreserved: true,
    textureBytesAndSamplerPreserved: true,
  };
}
for (const mode of ["cow", "rebuild"]) {
  for (const revision of [1, 2]) {
    const g = load(`${mode}-r${revision}.glb`);
    for (const m of ["Hero", "Companion", "Control"]) {
      assert.deepEqual(structure(g, m), structure(base, m));
      assert.deepEqual(materialState(g, m), materialState(base, m));
      if (revision === 1)
        for (const c of ["Survey", "Walk", "Run"])
          assert.deepEqual(clip(g, m, c), clip(base, m, c));
    }
    report.checks[mode][`R${revision}_allGeometrySkinHierarchyPreserved`] =
      true;
    report.checks[mode][`R${revision}_allNonColorMaterialTexturePreserved`] =
      true;
    if (revision === 1) report.checks[mode].R1_allAnimationsUnchanged = true;
  }
}
for (const mode of ["naive", "keepUniqueNames"]) {
  const g = load(mode + "-r2.glb");
  assert.notDeepEqual(
    clip(g, "Control", "Run").map((c) => c.times),
    clip(base, "Control", "Run").map((c) => c.times),
  );
  report.checks[mode] = { negativeControlOtherRunChanged: true };
}
fs.writeFileSync("independent-results.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
