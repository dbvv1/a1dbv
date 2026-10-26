import { loadSource } from './source.mjs';
const source = process.argv[2];
const results = [];
for (const mode of ['move-stop', 'stop-move', 'one-frame-late']) {
  const {simulation, navigation} = await loadSource(source);
  try {
    const hero = simulation.snapshot().entities.find(e => e.kind === 'hero' && e.team === 0);
    const commands = [{type:'move',heroId:hero.id,point:{x:0,z:0}}, {type:'stop',heroId:hero.id}];
    if (mode === 'stop-move') commands.reverse();
    for (let tick = 1; tick <= 30; tick++) simulation.step(tick === (mode === 'one-frame-late' ? 2 : 1) ? commands : []);
    results.push({mode, hash:simulation.finalHash(), position:simulation.snapshot().entities.find(e => e.id === hero.id).position});
  } finally { navigation.destroy(); }
}
console.log(JSON.stringify(results));
