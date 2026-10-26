import {
  AnimationClip,
  AnimationMixer,
  LoopOnce,
  PropertyBinding,
  Matrix4,
  Vector3,
} from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";

export const upperBones = Object.freeze([
  "Torso",
  "Head",
  "UpperArm_L",
  "Forearm_L",
  "Hand_L",
  "UpperArm_R",
  "Forearm_R",
  "Hand_R",
]);
export const lowerBones = Object.freeze([
  "Root",
  "Thigh_L",
  "Shin_L",
  "Foot_L",
  "Thigh_R",
  "Shin_R",
  "Foot_R",
]);

// Exported frame 1 is at 1/30s. Periods start at the first key, not that zero padding.
// Clone tracks so normalizing time cannot alter any original shared source clip.
export function prepareSource(gltf, { reactions = false } = {}) {
  const bones = [];
  gltf.scene.traverse((o) => {
    if (o.isBone) bones.push(o.name);
  });
  const expected = [...upperBones, ...lowerBones].sort();
  if (JSON.stringify(bones.sort()) !== JSON.stringify(expected))
    throw Error("fixed 15-bone source required");
  const clips = {},
    durations = { idle: 1, walk: 32 / 30, attack: 35 / 30 };
  if (reactions)
    for (const name of ["hurt", "death"]) {
      const clip = gltf.animations.find((a) => a.name === name);
      if (!clip?.tracks.length) throw Error(`one ${name} clip required`);
      const duration =
        Math.max(...clip.tracks.map((t) => t.times.at(-1))) -
        Math.min(...clip.tracks.map((t) => t.times[0]));
      if (!(duration >= 0.1 && duration <= 3))
        throw Error("unsupported reaction duration");
      durations[name] = duration;
    }
  for (const [name, duration] of Object.entries(durations)) {
    const candidates = gltf.animations.filter((a) => a.name === name);
    if (candidates.length !== 1) throw Error(`one ${name} clip required`);
    const source = candidates[0],
      start = Math.min(...source.tracks.map((t) => t.times[0])),
      end = Math.max(...source.tracks.map((t) => t.times.at(-1)));
    if (Math.abs(end - start - duration) > 1e-5 || source.tracks.length !== 45)
      throw Error(`unexpected ${name} source range`);
    const keys = new Set();
    for (const track of source.tracks) {
      const b = PropertyBinding.parseTrackName(track.name);
      if (
        !expected.includes(b.nodeName) ||
        !["position", "quaternion", "scale"].includes(b.propertyName) ||
        keys.has(track.name)
      )
        throw Error("unexpected bone track");
      if (
        Math.abs(track.times[0] - start) > 1e-5 ||
        Math.abs(track.times.at(-1) - end) > 1e-5
      )
        throw Error("incomplete bone track");
      keys.add(track.name);
    }
    clips[name] = new AnimationClip(
      name,
      duration,
      source.tracks.map((t) => t.clone().shift(-start)),
    );
  }
  return { scene: gltf.scene, clips, originalClips: gltf.animations };
}

export function disposeSource(source) {
  const geometries = new Set(),
    materials = new Set(),
    skeletons = new Set();
  source.scene.traverse((o) => {
    if (o.geometry) geometries.add(o.geometry);
    if (o.material) for (const m of [].concat(o.material)) materials.add(m);
    if (o.skeleton) skeletons.add(o.skeleton);
  });
  for (const r of [...geometries, ...materials, ...skeletons]) r.dispose();
}

// Frame 14 ends anticipation; frame 19 is this fixture's chosen visual contact pose.
// This explicit example mapping does not generate gameplay hit events.
const SOURCE = Object.freeze({
  windup: 13 / 30,
  strike: 5 / 30,
  recovery: 17 / 30,
});
export const profiles = Object.freeze({
  original: Object.freeze({ ...SOURCE, fade: 0.08 }),
  faster: Object.freeze({
    windup: 0.2,
    strike: 0.15,
    recovery: 17 / 30,
    fade: 0.08,
  }),
});
const upper = new Set(upperBones);
const clamp = (v) => Math.max(0, Math.min(1, v));
function nonnegative(v, name) {
  if (!Number.isFinite(v) || v < 0)
    throw Error(`${name} must be finite and nonnegative`);
}
export function validateProfile(p) {
  for (const key of ["windup", "strike", "recovery", "fade"])
    if (!Number.isFinite(p?.[key]) || p[key] <= 0)
      throw Error("positive phase durations required");
  if (p.fade > Math.min(p.windup, p.recovery))
    throw Error("fade must fit windup and recovery");
}
export function attackPose(time, attack) {
  nonnegative(time, "time");
  if (attack === null || attack === undefined)
    return { weight: 0, sourceTime: 0 };
  nonnegative(attack.startedAt, "startedAt");
  const p = attack.profile ?? profiles.original;
  validateProfile(p);
  if (attack.cancelledAt !== undefined) {
    nonnegative(attack.cancelledAt, "cancelledAt");
    if (attack.cancelledAt < attack.startedAt)
      throw Error("cancel precedes attack");
  }
  const elapsed = time - attack.startedAt,
    total = p.windup + p.strike + p.recovery;
  const cancelled =
    attack.cancelledAt !== undefined && time >= attack.cancelledAt;
  const sampled = Math.max(
    0,
    Math.min(
      total,
      cancelled ? attack.cancelledAt - attack.startedAt : elapsed,
    ),
  );
  const natural = (e) => clamp(e / p.fade) * clamp((total - e) / p.fade);
  const weight =
    elapsed < 0
      ? 0
      : cancelled
        ? natural(attack.cancelledAt - attack.startedAt) *
          clamp(1 - (time - attack.cancelledAt) / p.fade)
        : natural(elapsed);
  let sourceTime;
  if (sampled <= p.windup) sourceTime = (sampled / p.windup) * SOURCE.windup;
  else if (sampled <= p.windup + p.strike)
    sourceTime =
      SOURCE.windup + ((sampled - p.windup) / p.strike) * SOURCE.strike;
  else
    sourceTime =
      SOURCE.windup +
      SOURCE.strike +
      ((sampled - p.windup - p.strike) / p.recovery) * SOURCE.recovery;
  return { weight, sourceTime };
}

// Gameplay passes the chosen full-body state; death is held until that state clears.
export function reactionPose(time, reaction, clips) {
  if (reaction == null) return { name: null, weight: 0, sourceTime: 0 };
  if (!["hurt", "death"].includes(reaction.name) || !clips[reaction.name])
    throw Error("prepared reaction clip required");
  nonnegative(reaction.startedAt, "reaction startedAt");
  const duration = clips[reaction.name].duration,
    fade = 0.06;
  const elapsed = time - reaction.startedAt;
  return {
    name: reaction.name,
    weight:
      clamp(elapsed / fade) *
      (reaction.name === "hurt" ? clamp((duration - elapsed) / fade) : 1),
    sourceTime: Math.min(duration, Math.max(0, elapsed)),
  };
}

// Absolute-time visual consumer: caller owns movement, attack legality and hits.
// Separate lower/upper track sets avoid averaging a full-body walk with attack.
export function createConsumer(source) {
  if (
    !source?.scene ||
    !source.clips?.idle ||
    !source.clips?.walk ||
    !source.clips?.attack
  )
    throw Error("prepared source required");
  const root = clone(source.scene),
    materials = new Set(),
    skeletons = new Set();
  root.traverse((o) => {
    if (o.material) {
      const copies = [].concat(o.material).map((m) => m.clone());
      copies.forEach((m) => materials.add(m));
      o.material = Array.isArray(o.material) ? copies : copies[0];
    }
    if (o.skeleton) skeletons.add(o.skeleton);
  });
  const mixer = new AnimationMixer(root),
    actions = {};
  for (const [name, clip] of Object.entries(source.clips))
    for (const region of ["hurt", "death"].includes(name)
      ? ["full"]
      : name === "attack"
        ? ["upper"]
        : ["lower", "upper"]) {
      const tracks = clip.tracks.filter(
        (t) =>
          region === "full" ||
          upper.has(PropertyBinding.parseTrackName(t.name).nodeName) ===
            (region === "upper"),
      );
      if (!tracks.length) throw Error("empty animation region");
      const a = mixer.clipAction(
        new AnimationClip(`${name}.${region}`, clip.duration, tracks),
      );
      a.setLoop(LoopOnce, 1);
      a.clampWhenFinished = true;
      a.play();
      a.paused = true;
      actions[`${name}.${region}`] = a;
    }
  const poseRoot = root.getObjectByName("Root");
  const groundOffset = new Vector3(),
    point = new Vector3(),
    inverse = new Matrix4();
  let disposed = false;
  function sample({ time = 0, walk = 0, attack = null, reaction = null } = {}) {
    if (disposed) throw Error("consumer disposed");
    nonnegative(time, "time");
    if (!Number.isFinite(walk) || walk < 0 || walk > 1)
      throw Error("walk weight must be in [0,1]");
    const pose = attackPose(time, attack); // Validate before changing any pose.
    const full = reactionPose(time, reaction, source.clips);
    for (const [key, a] of Object.entries(actions)) {
      const [name, region] = key.split(".");
      const weight =
        name === "attack"
          ? pose.weight
          : (name === "walk" ? walk : 1 - walk) *
            (region === "upper" ? 1 - pose.weight : 1);
      a.enabled = true;
      a.paused = true;
      a.setEffectiveWeight(
        region === "full"
          ? name === full.name
            ? full.weight
            : 0
          : weight * (1 - full.weight),
      );
      a.time =
        region === "full"
          ? name === full.name
            ? full.sourceTime
            : 0
          : name === "attack"
            ? pose.sourceTime
            : time % source.clips[name].duration;
    }
    // Undo the previous visual offset before the mixer can reuse an unchanged binding.
    poseRoot.position.sub(groundOffset);
    groundOffset.set(0, 0, 0);
    mixer.update(0);
    root.updateMatrixWorld(true);
    for (const s of skeletons) s.update();
    if (full.weight > 0) {
      // Author contact alone does not survive an arbitrary locomotion-phase blend.
      // Fixed flat-floor fixture: lift the internal rig, never the motor-owned outer root.
      inverse.copy(root.matrixWorld).invert();
      let lowest = Infinity;
      root.traverse((object) => {
        if (!object.isSkinnedMesh) return;
        for (let i = 0; i < object.geometry.attributes.position.count; i++) {
          object
            .getVertexPosition(i, point)
            .applyMatrix4(object.matrixWorld)
            .applyMatrix4(inverse);
          lowest = Math.min(lowest, point.y);
        }
      });
      if (lowest < 0) {
        inverse
          .copy(poseRoot.parent.matrixWorld)
          .invert()
          .multiply(root.matrixWorld);
        groundOffset
          .set(0, -lowest, 0)
          .applyMatrix4(inverse)
          .sub(point.set(0, 0, 0).applyMatrix4(inverse));
        poseRoot.position.add(groundOffset);
        root.updateMatrixWorld(true);
        for (const s of skeletons) s.update();
      }
    }
    // Three caches skinned bounds: old idle bounds can cull a later extended blade.
    // This small fixture pays the CPU vertex scan; production budgets need measurement.
    root.traverse((object) => {
      if (object.isSkinnedMesh) {
        object.computeBoundingBox();
        object.computeBoundingSphere();
      }
    });
    return { ...pose, weight: pose.weight * (1 - full.weight) };
  }
  function dispose() {
    if (disposed) return;
    mixer.stopAllAction();
    mixer.uncacheRoot(root);
    for (const r of [...materials, ...skeletons]) r.dispose();
    disposed = true;
  }
  sample();
  return { root, sample, reset: () => sample(), dispose };
}
