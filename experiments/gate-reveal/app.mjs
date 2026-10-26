import { GateReveal, PROFILES } from './controller.mjs';
const $ = id => document.getElementById(id);
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const keys = new Set();
let decoded = 0;
let lastMediaTime = 0;
let mediaError = null;
let engine;
function createMedia() {
  const video = document.createElement('video');
  video.src = './generated/gate.mp4';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('aria-label', 'Pre-rendered gate reveal shot B');
  const observe = () => {
    if (!video.isConnected) return;
    lastMediaTime = video.currentTime;
    decoded = video.getVideoPlaybackQuality?.().totalVideoFrames ?? 0;
    mediaError = video.error?.code ?? null;
  };
  for (const event of ['timeupdate', 'ended', 'error', 'pause']) video.addEventListener(event, observe);
  $('stage').insertBefore(video, $('shot'));
  return video;
}
engine = new GateReveal(createMedia);
$('start').onclick = () => { engine.start(); canvas.focus(); };
$('skip').onclick = () => { keys.clear(); engine.skip(); canvas.focus(); };
$('pause').onclick = () => { keys.clear(); engine.setPaused(!engine.paused); canvas.focus(); };
function reset() {
  keys.clear();
  engine.reset($('profile').value);
  decoded = 0; lastMediaTime = 0; mediaError = null; canvas.focus();
}
$('reset').onclick = reset;
$('profile').onchange = reset;
window.addEventListener('keydown', event => {
  if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(event.target.tagName)) return;
  const key = event.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'e'].includes(key)) event.preventDefault();
  if (key === 'e' && !event.repeat) engine.start();
  keys.add(key);
});
window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => { keys.clear(); engine.setPaused(true); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { keys.clear(); engine.setPaused(true); } });
window.addEventListener('pagehide', () => { keys.clear(); engine.dispose(); });

function draw() {
  const { world, stage, elapsed } = engine;
  const zoom = stage === 'A' ? 1 + .15 * Math.min(1, elapsed / 4)
    : stage === 'C' ? 1.15 - .15 * Math.min(1, elapsed / PROFILES[engine.profile].returnSeconds) : 1;
  ctx.fillStyle = '#132b2c'; ctx.fillRect(0, 0, 960, 540);
  ctx.save(); ctx.translate(480, 310); ctx.scale(zoom, zoom);
  const point = (x, z) => [x * 28, -z * 22];
  const rect = (x, z, w, h, color) => {
    ctx.fillStyle = color; const [px, py] = point(x, z); ctx.fillRect(px - w * 14, py - h * 11, w * 28, h * 22);
  };
  rect(0, 2.5, 3.2, 24, '#657365');
  for (let n = 0; n < 6; n++) for (const x of [-2, 2]) rect(x, n * 2 + 1.5, .35, .45, '#b59458');
  rect(-5, 0, 6.8, 1, '#3d5663'); rect(5, 0, 6.8, 1, '#3d5663');
  for (const x of [-2.1, 2.1]) { rect(x, 0, 1, 1.6, '#c49e59'); rect(x, 0, .7, 1.1, '#44616c'); }
  const open = world.unlocked && stage !== 'A';
  for (const side of [-1, 1]) rect(side * (open ? 2.45 : .8), 0, 1.6, .38, '#4aa5a6');
  rect(-2, -2.5, .6, .6, world.unlocked ? '#eed690' : '#be8b46');
  const beacon = point(0, 11);
  ctx.fillStyle = '#f4bb60'; ctx.beginPath(); ctx.moveTo(beacon[0], beacon[1] - 15);ctx.lineTo(beacon[0] + 10, beacon[1]);ctx.lineTo(beacon[0], beacon[1] + 15);ctx.lineTo(beacon[0] - 10, beacon[1]);ctx.closePath();ctx.fill();
  const [x, y] = point(world.player.x, world.player.z);
  ctx.fillStyle = '#8fcad4';ctx.beginPath();ctx.arc(x, y, 9, 0, Math.PI * 2);ctx.fill();
  ctx.strokeStyle = '#f3e4b7';ctx.lineWidth = 3;ctx.beginPath();ctx.moveTo(x + 7, y);ctx.lineTo(x + 7 + PROFILES[engine.profile].weapon * 26, y - PROFILES[engine.profile].weapon * 12);ctx.stroke();
  ctx.font = '13px system-ui';ctx.fillStyle = '#e8e7dc';ctx.fillText('PEDESTAL', -136, 90);ctx.fillText('AMBER BEACON', 17, -236);
  ctx.restore();
  $('shot').textContent = stage === 'game' ? (world.crossed ? 'PASSAGE CROSSED · CONTROL RESTORED' : 'GAMEPLAY · YOUR CHARACTER') : `${stage} · ${engine.paused ? 'PAUSED' : stage === 'B' ? 'PRE-RENDERED REVEAL' : 'REAL-TIME CHARACTER'}`;
  $('caption').textContent = stage === 'A' ? 'The mechanism answers. A new route opens.'
    : stage === 'B' ? (engine.shotTime < 4 ? 'The stone doors withdraw.' : 'Beyond the arch: follow the amber beacon.')
    : stage === 'C' ? PROFILES[engine.profile].caption
    : world.crossed ? 'You crossed the gate using restored movement control.'
    : world.unlocked ? 'Use ↑ / W to cross the open gate.' : 'Move near the pedestal and activate the gate.';
  $('start').disabled = !engine.controlsEnabled || world.unlocked;
  $('pause').disabled = !engine.active;
  $('skip').disabled = !engine.active;
  $('status').textContent = JSON.stringify({stage, paused: engine.paused, controlsEnabled: engine.controlsEnabled,
    gateUnlocked: world.unlocked, player: {x: +world.player.x.toFixed(2), z: +world.player.z.toFixed(2)},
    crossed: world.crossed, profile: engine.profile, shotTime: +engine.shotTime.toFixed(3),
    mediaTime: +lastMediaTime.toFixed(3), decodedFrames: decoded, mediaError,
    reason: engine.reason, transitions: engine.transitions}, null, 2);
}
let before = performance.now();
function frame(now) {
  const delta = Math.min(.1, (now - before) / 1000); before = now;
  engine.tick(delta);
  engine.move((keys.has('arrowright') || keys.has('d') ? 1 : 0) - (keys.has('arrowleft') || keys.has('a') ? 1 : 0),
    (keys.has('arrowup') || keys.has('w') ? 1 : 0) - (keys.has('arrowdown') || keys.has('s') ? 1 : 0), delta);
  draw();
  if (engine.stage !== 'disposed') requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
