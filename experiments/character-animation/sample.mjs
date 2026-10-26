import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Vector3 } from "three";
import { loadSource, disposeSource } from "./source.mjs";
import { createConsumer, profiles } from "./consumer.mjs";

if (process.argv.length !== 3)
  throw Error("usage: node sample.mjs OUTPUT_DIRECTORY");
const out = resolve(process.argv[2]);
const sources = {
  blue: await loadSource(),
  "blue-long": await loadSource("blue-long"),
};
const views = {
  blue: createConsumer(sources.blue),
  "blue-long": createConsumer(sources["blue-long"]),
};
const columns = [
  { label: "walk only", variant: "blue", attack: null },
  { label: "original", variant: "blue", attack: { startedAt: 0 } },
  {
    label: "retimed",
    variant: "blue",
    attack: { startedAt: 0, profile: profiles.faster },
  },
  {
    label: "long blade",
    variant: "blue-long",
    attack: { startedAt: 0, profile: profiles.faster },
  },
];
const poses = [];
try {
  for (const [row, time] of [0.2, 0.35, 0.6, 0.94].entries())
    for (const [column, scenario] of columns.entries()) {
      const view = views[scenario.variant];
      view.sample({ time, walk: 1, attack: scenario.attack });
      const meshes = [];
      view.root.traverse((o) => {
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
      poses.push({
        row,
        column,
        label: `${scenario.label} / ${time.toFixed(2)}s`,
        meshes,
      });
    }
  await mkdir(out); // Never overwrite an old sampled delivery.
  await writeFile(
    resolve(out, "poses.json"),
    JSON.stringify({ version: 1, columns: 4, rows: 4, poses }),
  );
  console.log(`SAMPLED ${poses.length} real Three skinned poses`);
} finally {
  for (const v of Object.values(views)) v.dispose();
  for (const s of Object.values(sources)) disposeSource(s);
}
