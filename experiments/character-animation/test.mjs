import test, { after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, copyFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AnimationMixer, LoopOnce, Matrix4, Vector3 } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import {
  loadSource,
  prepareSource,
  disposeSource,
  upperBones,
  lowerBones,
  inputDirectory,
} from "./source.mjs";
import { createConsumer, attackPose, profiles } from "./consumer.mjs";

const blue = await loadSource(),
  long = await loadSource("blue-long");
after(() => {
  disposeSource(blue);
  disposeSource(long);
});
const allBones = [...upperBones, ...lowerBones];
function values(root, names = allBones) {
  return names.flatMap((n) => {
    const b = root.getObjectByName(n);
    return [...b.position, ...b.quaternion, ...b.scale];
  });
}
function near(a, b, tolerance = 1e-6) {
  assert.equal(a.length, b.length);
  for (let i = 0; i < a.length; i++)
    assert.ok(Math.abs(a[i] - b[i]) < tolerance, `${i}: ${a[i]} != ${b[i]}`);
}
function consumer(t, source = blue) {
  const v = createConsumer(source);
  t.after(() => v.dispose());
  return v;
}
// Independent whole-clip reference: no split tracks, phase mapper or consumer helper.
function reference(t, name, time) {
  const root = clone(blue.scene),
    m = new AnimationMixer(root);
  const a = m.clipAction(blue.clips[name]);
  a.setLoop(LoopOnce, 1);
  a.clampWhenFinished = true;
  a.play();
  m.setTime(time);
  root.updateMatrixWorld(true);
  t.after(() => {
    m.stopAllAction();
    m.uncacheRoot(root);
    root.traverse((o) => o.skeleton?.dispose());
  });
  return root;
}
function gripLocal(root) {
  root.updateMatrixWorld(true);
  root.traverse((o) => o.skeleton?.update());
  const hand = root.getObjectByName("Hand_R"),
    mesh = root.getObjectByName("WeaponGrip");
  const inv = new Matrix4().copy(hand.matrixWorld).invert();
  const a = [];
  for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
    const p = new Vector3();
    mesh.getVertexPosition(i, p);
    mesh.localToWorld(p);
    p.applyMatrix4(inv);
    a.push(...p);
  }
  return a;
}

test("real source clocks normalize first key without mutating shared original tracks", () => {
  assert.equal(blue.clips.idle.duration, 1);
  assert.equal(blue.clips.walk.duration, 32 / 30);
  assert.equal(blue.clips.attack.duration, 35 / 30);
  for (const name of ["idle", "walk", "attack"]) {
    const raw = blue.originalClips.find((c) => c.name === name);
    assert.ok(raw.tracks[0].times[0] > 0.03);
    assert.equal(blue.clips[name].tracks[0].times[0], 0);
    assert.notEqual(raw.tracks[0].times, blue.clips[name].tracks[0].times);
    near(
      Array.from(blue.clips[name].tracks[0].times),
      Array.from(long.clips[name].tracks[0].times),
    );
  }
});
test("idle and walk consume actual clip poses including normalized loop boundary", (t) => {
  const v = consumer(t);
  for (const [name, walk] of [
    ["idle", 0],
    ["walk", 1],
  ])
    for (const time of [0, 0.27, 0.7]) {
      v.sample({ time, walk });
      near(values(v.root), values(reference(t, name, time)));
    }
  v.sample({ time: 32 / 30, walk: 1 });
  near(values(v.root), values(reference(t, "walk", 0)));
});
test("moving strike overrides only upper bones and preserves root/feet plus rigid grip", (t) => {
  const v = consumer(t);
  v.root.position.set(7, 0, -4);
  const baseline = gripLocal(v.root);
  const result = v.sample({
    time: 0.35,
    walk: 1,
    attack: { startedAt: 0, profile: profiles.faster },
  });
  assert.equal(result.weight, 1);
  near(
    values(v.root, upperBones),
    values(reference(t, "attack", 0.6), upperBones),
  );
  near(
    values(v.root, lowerBones),
    values(reference(t, "walk", 0.35), lowerBones),
  );
  near(v.root.position.toArray(), [7, 0, -4]);
  near(gripLocal(v.root), baseline, 2e-6);
});
test("retiming advances chosen contact while preserving recovery duration and source poses", (t) => {
  const a = consumer(t),
    b = consumer(t);
  for (const recoveryOffset of [0, 0.2, 0.4]) {
    a.sample({ time: 0.6 + recoveryOffset, walk: 1, attack: { startedAt: 0 } });
    b.sample({
      time: 0.35 + recoveryOffset,
      walk: 1,
      attack: { startedAt: 0, profile: profiles.faster },
    });
    near(values(a.root, upperBones), values(b.root, upperBones));
  }
  assert.equal(profiles.original.recovery, profiles.faster.recovery);
  assert.equal(
    attackPose(0.35, { startedAt: 0, profile: profiles.faster }).sourceTime,
    0.6,
  );
});
test("cancel freezes outgoing attack pose then returns to locomotion, reentry has no residue", (t) => {
  const v = consumer(t),
    attack = { startedAt: 0, cancelledAt: 0.2 };
  const atCancel = attackPose(0.2, attack);
  const faded = attackPose(0.24, attack);
  assert.equal(faded.sourceTime, atCancel.sourceTime);
  assert.ok(Math.abs(faded.weight - 0.5) < 1e-12);
  for (const time of [0.2, 0.24, 0.28, 0.4])
    v.sample({ time, walk: 1, attack });
  near(values(v.root), values(reference(t, "walk", 0.4)));
  v.sample({ time: 0.6, walk: 0, attack: { startedAt: 0.4 } });
  const fresh = consumer(t);
  fresh.sample({ time: 0.6, walk: 0, attack: { startedAt: 0.4 } });
  near(values(v.root), values(fresh.root));
});
test("absolute sampling is independent of frame partition, pause, backwards inspection and reset", (t) => {
  const a = consumer(t),
    b = consumer(t),
    attack = { startedAt: 0.2, profile: profiles.faster };
  for (let i = 0; i < 91; i++) a.sample({ time: i / 100, walk: 0.6, attack });
  a.sample({ time: 0.63, walk: 0.6, attack });
  b.sample({ time: 0.63, walk: 0.6, attack });
  near(values(a.root), values(b.root));
  const before = values(a.root);
  a.sample({ time: 0.63, walk: 0.6, attack });
  near(values(a.root), before);
  a.reset();
  near(values(a.root), values(reference(t, "idle", 0)));
});
test("short/long variants and instances isolate animation/material state and disposal", (t) => {
  const a = consumer(t),
    b = consumer(t),
    c = consumer(t, long);
  const before = values(b.root);
  const geometry = blue.scene.getObjectByName("WeaponBlade").geometry;
  let disposedGeometry = 0;
  geometry.addEventListener("dispose", () => disposedGeometry++);
  const material = a.root.getObjectByName("WeaponBlade").material;
  let disposedMaterial = 0;
  material.addEventListener("dispose", () => disposedMaterial++);
  a.sample({ time: 0.4, walk: 1, attack: { startedAt: 0 } });
  c.sample({ time: 0.4, walk: 1, attack: { startedAt: 0 } });
  near(values(a.root), values(c.root));
  near(values(b.root), before);
  assert.notEqual(
    a.root.getObjectByName("Root"),
    b.root.getObjectByName("Root"),
  );
  assert.equal(a.root.getObjectByName("WeaponBlade").geometry, geometry);
  assert.notEqual(material, b.root.getObjectByName("WeaponBlade").material);
  material.color.setRGB(0.2, 0.3, 0.4);
  assert.notDeepEqual(
    material.color.toArray(),
    b.root.getObjectByName("WeaponBlade").material.color.toArray(),
  );
  a.dispose();
  a.dispose();
  assert.equal(disposedMaterial, 1);
  assert.equal(disposedGeometry, 0);
  assert.throws(() => a.sample(), /disposed/);
  b.sample({ time: 0.5, walk: 1 });
});
test("bad input fails before pose mutation and missing actions are not silently substituted", (t) => {
  const v = consumer(t);
  v.sample({ time: 0.2, walk: 1 });
  const before = values(v.root);
  for (const data of [
    { time: NaN },
    { time: -1 },
    { walk: 2 },
    { attack: { startedAt: -1 } },
    { attack: { startedAt: 2, cancelledAt: 1 } },
    { attack: { startedAt: 0, profile: { ...profiles.original, strike: 0 } } },
  ]) {
    assert.throws(() => v.sample(data));
    near(values(v.root), before);
  }
  assert.throws(
    () =>
      prepareSource({
        scene: blue.scene,
        animations: blue.originalClips.filter((c) => c.name !== "attack"),
      }),
    /attack clip/,
  );
});
test("actual missing and changed input files fail before loading any replacement asset", async () => {
  const dir = await mkdtemp(join(tmpdir(), "character-animation-"));
  try {
    await assert.rejects(loadSource("blue", dir), /ENOENT/);
    await copyFile(join(inputDirectory, "blue.glb"), join(dir, "blue.glb"));
    await writeFile(join(dir, "blue.glb"), "bad");
    await assert.rejects(loadSource("blue", dir), /hash mismatch/);
    await assert.rejects(loadSource("unknown", dir), /unknown/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("animated skinned bounds update after a previously cached idle sphere", (t) => {
  const view = consumer(t);
  const blade = view.root.getObjectByName("WeaponBlade");
  blade.computeBoundingSphere();
  const oldSphere = blade.boundingSphere.clone();
  view.sample({
    time: 0.35,
    walk: 1,
    attack: { startedAt: 0, profile: profiles.faster },
  });
  let escapedOld = false;
  view.root.traverse((mesh) => {
    if (!mesh.isSkinnedMesh) return;
    for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
      const p = new Vector3();
      mesh.getVertexPosition(i, p);
      assert.ok(mesh.boundingSphere.distanceToPoint(p) < 1e-6, mesh.name);
      assert.ok(
        mesh.boundingBox.clone().expandByScalar(1e-6).containsPoint(p),
        mesh.name,
      );
      if (mesh === blade && oldSphere.distanceToPoint(p) > 1e-3)
        escapedOld = true;
    }
  });
  assert.ok(
    escapedOld,
    "fixture must exercise vertices outside the old idle sphere",
  );
});
