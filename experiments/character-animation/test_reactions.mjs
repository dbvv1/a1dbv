import test, { after } from "node:test";
import assert from "node:assert/strict";
import { AnimationMixer, LoopOnce, Vector3, Matrix4 } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import {
  loadSource,
  loadReactionSource,
  disposeSource,
  prepareSource,
  upperBones,
  lowerBones,
} from "./source.mjs";
import { createConsumer } from "./consumer.mjs";
const file =
  process.env.CHARACTER_REACTION_FILE ??
  "generated-reactions/blue-reactions.glb";
const slowFile =
  process.env.CHARACTER_REACTION_SLOW_FILE ??
  "generated-reactions-slow/blue-reactions.glb";
const original = await loadSource(),
  source = await loadReactionSource(file),
  slow = await loadReactionSource(slowFile);
after(() => [original, source, slow].forEach(disposeSource));
const names = [...upperBones, ...lowerBones];
const values = (r) =>
  names.flatMap((n) => {
    const b = r.getObjectByName(n);
    return [...b.position, ...b.quaternion, ...b.scale];
  });
function near(a, b, e = 2e-6) {
  assert.equal(a.length, b.length);
  a.forEach((v, i) =>
    assert.ok(Math.abs(v - b[i]) < e, `${i}: ${v} != ${b[i]}`),
  );
}
function view(t, s = source) {
  const v = createConsumer(s);
  t.after(() => v.dispose());
  return v;
}
function reference(t, s, name, time) {
  const root = clone(s.scene),
    m = new AnimationMixer(root),
    a = m.clipAction(s.clips[name]);
  a.setLoop(LoopOnce, 1);
  a.clampWhenFinished = true;
  a.play();
  m.setTime(time);
  root.updateMatrixWorld(true);
  t.after(() => {
    m.stopAllAction();
    m.uncacheRoot(root);
    const skeletons = new Set();
    root.traverse((o) => {
      if (o.skeleton) skeletons.add(o.skeleton);
    });
    for (const s of skeletons) s.dispose();
  });
  return root;
}
function clipEqual(a, b) {
  assert.equal(a.name, b.name);
  near([a.duration], [b.duration]);
  assert.equal(a.tracks.length, b.tracks.length);
  a.tracks.forEach((t, i) => {
    const r = b.tracks[i];
    assert.equal(t.name, r.name);
    near([...t.times], [...r.times]);
    near([...t.values], [...r.values]);
  });
}
test("author export preserves every key of the original three actual GLB clips", () => {
  for (const name of ["idle", "walk", "attack"]) {
    clipEqual(original.clips[name], source.clips[name]);
    clipEqual(source.clips[name], slow.clips[name]);
  }
  clipEqual(source.clips.hurt, slow.clips.hurt);
  near(
    [
      source.clips.hurt.duration,
      source.clips.death.duration,
      slow.clips.death.duration,
    ],
    [0.6, 1, 1.4],
  );
});
test("hurt is a full-body override, suppresses attack, then returns to current walk", (t) => {
  const v = view(t);
  const applied = v.sample({
    time: 0.2,
    walk: 1,
    attack: { startedAt: 0 },
    reaction: { name: "hurt", startedAt: 0 },
  });
  assert.equal(applied.weight, 0);
  near(values(v.root), values(reference(t, source, "hurt", 0.2)));
  v.sample({ time: 0.7, walk: 1, reaction: { name: "hurt", startedAt: 0 } });
  near(values(v.root), values(reference(t, source, "walk", 0.7)));
  const before = values(v.root);
  v.sample({ time: 0.7, walk: 1, reaction: { name: "hurt", startedAt: 0 } });
  near(values(v.root), before);
});
test("death owns all bones, clamps final pose until explicit reset and never moves outer root", (t) => {
  const v = view(t),
    other = view(t);
  v.root.position.set(4, 0, -3);
  v.sample({
    time: 0.4,
    walk: 1,
    attack: { startedAt: 0 },
    reaction: { name: "death", startedAt: 0 },
  });
  near(values(v.root), values(reference(t, source, "death", 0.4)));
  const unchanged = values(other.root);
  for (const time of [1, 3, 20]) {
    v.sample({ time, walk: 1, reaction: { name: "death", startedAt: 0 } });
    near(
      values(v.root),
      values(reference(t, source, "death", source.clips.death.duration)),
    );
  }
  near(values(other.root), unchanged);
  near(v.root.position.toArray(), [4, 0, -3]);
  v.reset();
  near(values(v.root), values(reference(t, source, "idle", 0)));
  near(v.root.position.toArray(), [4, 0, -3]);
});
test("second edit changes only fall duration; both exported versions retain final corpse pose", (t) => {
  const a = view(t),
    b = view(t, slow);
  a.sample({ time: 0.4, reaction: { name: "death", startedAt: 0 } });
  b.sample({ time: 0.6, reaction: { name: "death", startedAt: 0 } });
  near(values(a.root), values(b.root));
  a.sample({ time: 1.5, reaction: { name: "death", startedAt: 0 } });
  b.sample({ time: 1.5, reaction: { name: "death", startedAt: 0 } });
  near(values(a.root), values(b.root));
  assert.ok(Math.abs(a.root.getObjectByName("Root").quaternion.x) > 0.6);
});
test("actual skinned positions stay within 1mm floor tolerance including fade and keep rigid grip", (t) => {
  for (const variant of [source, slow]) {
    const v = view(t, variant),
      hand = v.root.getObjectByName("Hand_R"),
      grip = v.root.getObjectByName("WeaponGrip"),
      p = new Vector3(),
      inv = new Matrix4();
    function gripPoints() {
      inv.copy(hand.matrixWorld).invert();
      return Array.from(
        { length: grip.geometry.attributes.position.count },
        (_, i) =>
          grip
            .localToWorld(grip.getVertexPosition(i, new Vector3()))
            .applyMatrix4(inv)
            .toArray(),
      ).flat();
    }
    const fixed = gripPoints();
    let min = Infinity;
    for (const startedAt of [0, 0.17, 0.43, 0.81])
      for (const name of ["hurt", "death"])
        for (let frame = 0; frame <= 90; frame++) {
          v.sample({
            time: startedAt + frame / 60,
            walk: 1,
            reaction: { name, startedAt },
          });
          near(gripPoints(), fixed, 3e-6);
          v.root.traverse((o) => {
            if (o.isSkinnedMesh)
              for (let i = 0; i < o.geometry.attributes.position.count; i++) {
                o.localToWorld(o.getVertexPosition(i, p));
                assert.ok(p.toArray().every(Number.isFinite));
                min = Math.min(min, p.y);
              }
          });
        }
    assert.ok(min >= -0.001, `floor minimum ${min}`);
    const state = {
      time: 0.17 + 34 / 60,
      walk: 1,
      reaction: { name: "hurt", startedAt: 0.17 },
    };
    v.sample(state);
    const once = values(v.root);
    for (let i = 0; i < 4; i++) v.sample(state);
    near(values(v.root), once);
    const fresh = view(t, variant);
    fresh.sample(state);
    near(values(v.root), values(fresh.root));
    v.sample({
      time: 0.8,
      walk: 1,
      attack: { startedAt: 0.4 },
      reaction: { name: "hurt", startedAt: 0.17 },
    });
    fresh.sample({ time: 0.8, walk: 1, attack: { startedAt: 0.4 } });
    near(values(v.root), values(fresh.root));
  }
});
test("missing reaction or bad event fails before mutation; future reaction does not suppress locomotion", async (t) => {
  const v = view(t),
    old = view(t, original);
  const before = values(v.root);
  for (const reaction of [
    { name: "unknown", startedAt: 0 },
    { name: "death", startedAt: NaN },
    { name: "hurt", startedAt: -1 },
  ])
    assert.throws(() => v.sample({ time: 0.4, reaction }));
  near(values(v.root), before);
  assert.throws(
    () => old.sample({ reaction: { name: "hurt", startedAt: 0 } }),
    /prepared reaction/,
  );
  v.sample({ time: 0.2, walk: 1, reaction: { name: "death", startedAt: 2 } });
  near(values(v.root), values(reference(t, source, "walk", 0.2)));
  await assert.rejects(
    loadReactionSource("missing-reaction-input.glb"),
    /ENOENT/,
  );
  assert.throws(
    () =>
      prepareSource(
        {
          scene: source.scene,
          animations: source.originalClips.filter((a) => a.name !== "death"),
        },
        { reactions: true },
      ),
    /death/,
  );
});
