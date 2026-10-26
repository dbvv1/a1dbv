import { Vector3 } from "three";
export function captureMeshes(root) {
  const meshes = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    if (Array.isArray(o.material))
      throw Error("this fixed source expects one material per mesh");
    const positions = [];
    for (let i = 0; i < o.geometry.attributes.position.count; i++) {
      const p = new Vector3();
      o.getVertexPosition(i, p);
      o.localToWorld(p);
      if (!p.toArray().every(Number.isFinite))
        throw Error("non-finite skinned vertex");
      positions.push(p.toArray());
    }
    const indices = o.geometry.index
      ? Array.from(o.geometry.index.array)
      : Array.from({ length: positions.length }, (_, i) => i);
    meshes.push({
      name: o.name,
      positions,
      indices,
      color: o.material.color.toArray(),
      roughness: o.material.roughness,
      metalness: o.material.metalness,
    });
  });

  return meshes;
}
