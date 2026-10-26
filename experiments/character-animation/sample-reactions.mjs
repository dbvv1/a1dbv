import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadReactionSource, disposeSource } from "./source.mjs";
import { createConsumer } from "./consumer.mjs";
import { captureMeshes } from "./sample-geometry.mjs";
if (process.argv.length !== 5)
  throw Error(
    "usage: node sample-reactions.mjs ORIGINAL_GLB SLOW_FALL_GLB OUTPUT_DIRECTORY",
  );
const sources = await Promise.all(
  process.argv.slice(2, 4).map(loadReactionSource),
);
const views = sources.map(createConsumer);
const poses = [];
try {
  for (const [row, time] of [0.15, 0.4, 0.8, 1.4].entries())
    for (const [column, c] of [
      { label: "walk", view: 0, reaction: null },
      { label: "hurt", view: 0, reaction: { name: "hurt", startedAt: 0 } },
      { label: "death", view: 0, reaction: { name: "death", startedAt: 0 } },
      {
        label: "slower fall",
        view: 1,
        reaction: { name: "death", startedAt: 0 },
      },
    ].entries()) {
      const view = views[c.view];
      view.sample({ time, walk: 1, reaction: c.reaction });
      poses.push({
        row,
        column,
        label: `${c.label} / ${time.toFixed(2)}s`,
        meshes: captureMeshes(view.root),
      });
    }
  const out = resolve(process.argv[4]);
  await mkdir(out);
  await writeFile(
    resolve(out, "poses.json"),
    JSON.stringify({ version: 1, columns: 4, rows: 4, poses }),
  );
  console.log(`REACTIONS_SAMPLED ${poses.length}`);
} finally {
  for (const v of views) v.dispose();
  for (const s of sources) disposeSource(s);
}
