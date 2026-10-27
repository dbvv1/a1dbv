// Run the existing, unmodified fixed MOBA authority in a separate CPU process.
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {loadSource} from '../server-lockstep/source.mjs';
import {requestsFromBytes} from './match-result.mjs';
export async function produceResult({source,path,matchId,players,maxMatchSeconds}) {
  const {navigation,manifest} = await loadSource(source);
  try {
    const {runBotMatch,replayMatch} = await import(pathToFileURL(resolve(source,'src/sim/index.ts')).href);
    const {simulation,replay} = runBotMatch({seed:manifest.seed,contentVersion:manifest.contentVersion,
      navigation,heroesPerTeam:manifest.heroesPerTeam,blueDifficulty:'normal',redDifficulty:'normal',
      ...(maxMatchSeconds === undefined ? {} : {maxMatchSeconds})});
    // isComplete() also includes timeout. Only a real winning terminal state earns a result here.
    if (!['blueWin','redWin'].includes(simulation.status) ||
        simulation.state.winner !== (simulation.status === 'blueWin' ? 0 : 1)) {
      throw new Error(`no winning terminal result: ${simulation.status}`);
    }
    const verified = replayMatch(replay,navigation);
    if (!verified.hashMatches || verified.actualStatus !== simulation.status ||
        verified.actualWinner !== simulation.state.winner) throw new Error('authority replay disagrees');
    const record = {schema:1,matchId,source:manifest,players,result:{status:simulation.status,
      winner:simulation.state.winner,tick:simulation.state.tick,seconds:simulation.timeSeconds,
      endReason:simulation.state.endReason,hash:simulation.finalHash(),replayHash:verified.actualHash}};
    const bytes = Buffer.from(JSON.stringify(record)+'\n');
    requestsFromBytes(bytes); // Validate before a file can be submitted.
    // Complete this write before starting delivery. Never replace an existing result identity.
    await writeFile(path,bytes,{flag:'wx',mode:0o600});
    return {source:manifest.source,...record.result,bytes:bytes.length};
  } finally { navigation.destroy(); }
}
if (process.send) process.once('message', async options => {
  try { process.send({result:await produceResult(options)}); process.disconnect(); }
  catch (error) { process.send({error:error.message}); process.exitCode=1; process.disconnect(); }
});
