// Server-to-server only; runtime HTTP key arrives over local IPC, never in the result file.
import {readResult} from './match-result.mjs';
import {settle} from './trusted-backend.mjs';
export async function deliverResult(service,path,afterConfirmed=()=>{}) {
  const {requests} = await readResult(path); // Malformed/missing file fails before any write.
  const outcomes=[];
  for (const [team,request] of requests.entries()) {
    const result=await settle(service,request);
    outcomes.push({team,duplicate:result.duplicate});
    await afterConfirmed(outcomes.length);
  }
  return outcomes;
}
if (process.send) process.once('message',async ({service,path,crashAfterFirst=false}) => {
  try {
    const outcomes=await deliverResult(service,path,count=>{
      // A real sender exit after the first database commit, before notifying its parent.
      if (crashAfterFirst && count===1) process.exit(17);
    });
    process.send({result:outcomes});process.disconnect();
  } catch(error) { process.send({error:error.message});process.exitCode=1;process.disconnect(); }
});
