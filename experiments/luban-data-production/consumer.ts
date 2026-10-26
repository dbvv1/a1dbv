import { Tables } from "./gen/schema";

declare const require: (name: string) => any;
declare const process: { argv: string[] };
const fs = require("node:fs");
const path = require("node:path");
const tables = new Tables((name: string) =>
  JSON.parse(fs.readFileSync(path.join(process.argv[2], name + ".json"), "utf8")));
const definition = tables.TbEnemy.get("scout");
if (!definition || !definition.skillId_ref) throw new Error("Missing scout or resolved skill");
// Runtime state belongs to an instance, not to the shared generated definition.
const instance = { definitionId: definition.id, hp: definition.maxHp };
instance.hp -= 10;
console.log(JSON.stringify({
  id: definition.id,
  displayName: definition.displayName,
  maxHp: definition.maxHp,
  hpAfterHit: instance.hp,
  skillId: definition.skillId_ref.id,
  skillDamage: definition.skillId_ref.damage,
  count: tables.TbEnemy.getDataList().length
}));
