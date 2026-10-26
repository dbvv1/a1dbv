import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadSource } from './source.mjs';
import { wire, send, validateInput, canonicalInput, frameCommands } from './protocol.mjs';
const [sourceArg, framesArg = '300', mode = 'normal'] = process.argv.slice(2);
if (!sourceArg || !Number.isSafeInteger(Number(framesArg)) || Number(framesArg) < 30 || Number(framesArg) > 900 || !['normal', 'jitter', 'disconnect', 'desync'].includes(mode))
  throw new Error('usage: node --import tsx run.mjs SOURCE 30..900 normal|jitter|disconnect|desync');
const source = resolve(sourceArg), frames = Number(framesArg);
const { simulation, navigation, manifest } = await loadSource(source);
const heroIds = [0, 1].map(team => simulation.snapshot().entities.find(e => e.kind === 'hero' && e.team === team).id);
const seats = [null, null], sockets = new Set(), children = [];
let pending = [null, null], expectedTick = 1, started = false, completed = false, terminal = false;
let lastProgress = performance.now(), retries = 0, acceptedCommands = 0;
const hashes = new Map();
const ledger = new Map();
const arrivalOrder = [];
let interval;
const server = createServer(socket => {
  sockets.add(socket);
  let seat = -1;
  wire(socket, message => {
    if (terminal) return;
    if (seat < 0) {
      if (message?.kind !== 'join' || ![0, 1].includes(message.seat) || seats[message.seat]) throw new Error('invalid or occupied seat');
      seat = message.seat; seats[seat] = { socket, ready: false, lastAck: 0 };
      send(socket, { kind: 'welcome', seat, heroId: heroIds[seat], manifest });
    } else if (message.kind === 'ready') {
      if (started || seats[seat].ready || message.hash !== manifest.initialHash) throw new Error('initial state disagreement');
      seats[seat].ready = true;
      if (seats.every(s => s?.ready)) {
        started = true; lastProgress = performance.now();
        for (const s of seats) send(s.socket, { kind: 'begin' });
      }
    } else if (message.kind === 'input' && started) {
      validateInput(message, heroIds[seat]);
      const key = `${message.tick}:${seat}`, canonical = canonicalInput(message);
      if (ledger.has(key)) {
        if (ledger.get(key) !== canonical) throw new Error('conflicting retry for committed input');
        retries++; return;
      }
      if (message.tick !== expectedTick) throw new Error('input is not for the open frame');
      if (pending[seat]) throw new Error('duplicate frame input');
      ledger.set(key, canonical); pending[seat] = message;
      if (arrivalOrder.length < 24) arrivalOrder.push(seat);
    } else if (message.kind === 'hash' && started) {
      if (message.tick !== seats[seat].lastAck + 1 || message.tick > simulation.state.tick || hashes.get(message.tick) !== message.hash)
        throw new Error(`state disagreement at tick ${message.tick}`);
      seats[seat].lastAck = message.tick;
      if (message.tick === frames && seats.every(s => s.lastAck === frames)) succeed();
    } else throw new Error('unexpected client message');
  }, fail);
  socket.once('close', () => { sockets.delete(socket); if (!terminal) fail(new Error('peer disconnected; no silent replacement input')); });
});
function fail(error) {
  if (terminal) return;
  terminal = true; clearInterval(interval); process.exitCode = 1;
  console.error(`LOCKSTEP_ABORT: ${error.message}`);
  for (const socket of sockets) socket.end(JSON.stringify({kind:'abort',reason:error.message}) + '\n');
  close();
}
function succeed() {
  if (terminal) return;
  completed = terminal = true; clearInterval(interval);
  for (const s of seats) send(s.socket, { kind: 'done', tick: frames, hash: simulation.finalHash() });
  console.log(JSON.stringify({ manifest, serverPid: process.pid, clientPids: children.map(c => c.pid),
    tick: frames, hash: simulation.finalHash(), acceptedCommands, heroes: simulation.snapshot().entities.filter(e => e.kind === 'hero').map(e => ({id:e.id,position:e.position})), verifiedClientAcks: seats.map(s => s.lastAck), retries, arrivalOrder }));
  close();
}
function close() {
  server.close();
  navigation.destroy();
  // Do not leave client processes behind after failure or an unresponsive peer.
  const cleanup = setTimeout(() => {
    for (const socket of sockets) socket.destroy();
    for (const child of children) if (child.exitCode === null) child.kill('SIGTERM');
  }, 500);
  cleanup.unref();
}
server.listen(0, '127.0.0.1'); await once(server, 'listening');
interval = setInterval(() => {
  if (terminal) return;
  if (performance.now() - lastProgress > 5000) { fail(new Error('waiting for peer input/ack timed out')); return; }
  if (!started || expectedTick > frames || !pending.every(Boolean) ||
      !seats.every(s => s.lastAck === expectedTick - 1)) return;
  const tick = expectedTick, commands = frameCommands(pending);
  acceptedCommands += simulation.step(commands).filter(result => result.accepted).length;
  if (simulation.state.tick !== tick) { fail(new Error('simulation ended before the sample frame budget')); return; }
  hashes.set(tick, simulation.finalHash());
  for (const s of seats) send(s.socket, { kind: 'frame', tick, commands });
  pending = [null, null]; expectedTick++; lastProgress = performance.now();
  // Input retry history is only needed for this short bounded exercise.
}, 1000 / manifest.tickRate);
const client = fileURLToPath(new URL('./client.mjs', import.meta.url));
for (const seat of mode === 'jitter' ? [1, 0] : [0, 1]) {
  const child = spawn(process.execPath, ['--import', 'tsx', client, source, String(server.address().port), String(seat), String(frames), mode], { cwd: source, stdio: ['ignore', 'pipe', 'pipe'] });
  children.push(child);
  child.stdout.on('data', data => process.stdout.write(`CLIENT ${data}`));
  child.stderr.on('data', data => process.stderr.write(`CLIENT ${data}`));
  child.once('error', fail);
  child.once('exit', code => { if (!terminal && code !== 0) fail(new Error(`client exited ${code}`)); });
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => fail(new Error('interrupted')));
await Promise.all(children.map(child => once(child, 'exit')));
if (!completed && !terminal) fail(new Error('clients ended without verified completion'));
