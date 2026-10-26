import { connect } from 'node:net';
import { loadSource } from './source.mjs';
import { wire, send, plannedInput } from './protocol.mjs';
const [source, portString, seatString, framesString, mode = 'normal'] = process.argv.slice(2);
const seat = Number(seatString), frames = Number(framesString);
const { simulation, navigation, manifest } = await loadSource(source);
const socket = connect({ host: '127.0.0.1', port: Number(portString) });
let started = false, done = false, heroId, lastHash = simulation.finalHash();
const timers = new Set();
function finish(code) {
  if (done) return;
  done = true;
  for (const timer of timers) clearTimeout(timer);
  socket.destroy(); navigation.destroy(); process.exitCode = code;
}
function issue(tick) {
  if (mode === 'disconnect' && seat === 1 && tick === 20) { finish(3); return; }
  const delay = mode === 'jitter' ? ((tick + seat) % 3) * 7 : 0;
  const timer = setTimeout(() => {
    timers.delete(timer);
    if (done) return;
    const message = plannedInput(seat, heroId, tick);
    send(socket, message);
    if (mode === 'jitter' && tick % 11 === 0) send(socket, message); // identical application retry
  }, delay);
  timers.add(timer);
}
wire(socket, message => {
  if (done) return;
  if (message.kind === 'welcome') {
    if (started || message.seat !== seat || JSON.stringify(message.manifest) !== JSON.stringify(manifest))
      throw new Error('version/nav/runtime/seed disagreement');
    started = true; heroId = message.heroId;
    send(socket, { kind: 'ready', hash: lastHash });
  } else if (message.kind === 'begin') {
    if (!started || simulation.state.tick !== 0) throw new Error('unexpected begin');
    issue(1);
  } else if (message.kind === 'frame') {
    if (!started || message.tick !== simulation.state.tick + 1) throw new Error('nonsequential committed frame');
    simulation.step(message.commands);
    lastHash = simulation.finalHash();
    send(socket, { kind: 'hash', tick: message.tick,
      hash: mode === 'desync' && seat === 1 && message.tick === 20 ? 'intentional-test-mismatch' : lastHash });
    if (message.tick < frames) issue(message.tick + 1);
  } else if (message.kind === 'done') {
    if (message.tick !== frames || simulation.state.tick !== frames || message.hash !== lastHash) throw new Error('wrong terminal state');
    console.log(JSON.stringify({ seat, pid: process.pid, tick: simulation.state.tick, hash: lastHash }));
    finish(0);
  } else if (message.kind === 'abort') {
    console.error(message.reason); finish(2);
  } else throw new Error('unexpected server message');
}, error => { console.error(error.message); finish(2); });
socket.once('connect', () => send(socket, { kind: 'join', seat }));
socket.once('close', () => { if (!done) { console.error('connection ended before verified completion'); finish(2); } });
