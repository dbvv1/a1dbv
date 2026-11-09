// Narrow adapter for the fixed KayKit sample, not a general retargeter.
import assert from 'node:assert/strict';
export function remapParent(THREE, source, target, clip) {
  assert.ok(source?.isObject3D && target?.isObject3D && clip instanceof THREE.AnimationClip, 'source, target and clip required');
  function unique(scene, name) {
    const matches = []; scene.traverse(node => { if (node.name === name) matches.push(node); });
    assert.equal(matches.length, 1, `unique node required: ${name}`); return matches[0];
  }
  const sourceRig = unique(source, 'Rig_Medium'), targetRig = unique(target, 'Rig');
  assert.ok(sourceRig.parent === source, 'source rig must be a scene child');
  assert.ok(targetRig.parent === target, 'target rig must be a scene child');
  source.updateMatrix(); target.updateMatrix();
  assert.ok(source.matrix.equals(new THREE.Matrix4()) && target.matrix.equals(new THREE.Matrix4()), 'scene transforms must be identity');
  assert.ok(unique(source, 'root').parent === sourceRig, 'source root parent');
  assert.ok(unique(target, 'root').parent === targetRig, 'target root parent');
  const names = new Set();
  for (const track of clip.tracks) {
    const parsed = THREE.PropertyBinding.parseTrackName(track.name);
    assert.equal(track.name, `${parsed.nodeName}.${parsed.propertyName}`, 'only direct transform tracks');
    assert.ok(['position', 'quaternion', 'scale'].includes(parsed.propertyName), 'transform track required');
    assert.ok(!names.has(track.name), 'duplicate track'); names.add(track.name);
    const a = unique(source, parsed.nodeName), b = unique(target, parsed.nodeName === 'Rig_Medium' ? 'Rig' : parsed.nodeName);
    assert.equal(Boolean(a.isBone), Boolean(b.isBone), 'node kind mismatch');
    if (a !== sourceRig) {
      assert.equal(b.parent?.name, a.parent === sourceRig ? 'Rig' : a.parent?.name, 'bone hierarchy mismatch');
    }
    assert.ok(track.validate(), 'invalid track');
  }
  for (const name of new Set(clip.tracks.map(t => THREE.PropertyBinding.parseTrackName(t.name).nodeName))) {
    for (const property of ['position', 'quaternion', 'scale']) assert.ok(names.has(`${name}.${property}`), 'complete transform channels required');
  }
  for (const property of ['position', 'quaternion', 'scale']) assert.ok(names.has(`Rig_Medium.${property}`), 'parent track required');
  const result = clip.clone();
  for (const track of result.tracks) if (track.name.startsWith('Rig_Medium.')) track.name = 'Rig.' + track.name.slice('Rig_Medium.'.length);
  return result;
}
