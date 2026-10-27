// A trusted server-produced file, never a client-uploaded replay or score endpoint.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {SOURCE_SHA} from '../server-lockstep/source.mjs';
const id = value => typeof value === 'string' && /^[a-f0-9-]{36}$/.test(value);
export function requestsFromBytes(bytes) {
  if (bytes.byteLength > 16384) throw new Error('result file too large');
  const record = JSON.parse(bytes.toString('utf8'));
  const result = record?.result;
  if (record?.schema !== 1 || !id(record.matchId) || record.source?.source !== SOURCE_SHA ||
      !result || !['blueWin','redWin'].includes(result.status) ||
      result.winner !== (result.status === 'blueWin' ? 0 : 1) ||
      !Number.isSafeInteger(result.tick) || result.tick < 1 ||
      !/^[a-f0-9]{16}$/.test(result.hash) || result.replayHash !== result.hash ||
      !Array.isArray(record.players) || record.players.length !== 2 ||
      record.players.some((p,i) => p.team !== i || !id(p.userId)) ||
      record.players[0].userId === record.players[1].userId) throw new Error('invalid completed match result');
  // Byte identity deliberately makes a changed file conflict with the original receipt.
  // This is not a signature or proof that an untrusted file came from an authority.
  const resultFingerprint = createHash('sha256').update(bytes).digest('hex');
  const requests = record.players.map(p => ({userId:p.userId,matchId:record.matchId,
    score:p.team === result.winner ? 100 : 0,rule:1,resultFingerprint}));
  return {record,requests};
}
export async function readResult(path) { return requestsFromBytes(await readFile(path)); }
