import { levels, newGame, transition, getTide, saveGame, loadGame } from './g1-tide-post-core.mjs';

// Stable IDs map to generated candidate files (v1 plus the preset v2 variants); reused files are not new assets.
// Null remains a supported explicit geometric-placeholder configuration.
export const assetManifest = Object.freeze({
  'terrain.land': '../docs/img/g1-tide-land-v1.png',
  'terrain.shallow.low': '../docs/img/g1-tide-shallow-v1.png',
  'terrain.shallow.high': '../docs/img/g1-tide-water-v1.png',
  'terrain.deep': '../docs/img/g1-tide-water-v1.png',
  'actor.postman': '../docs/img/g1-tide-postman-v1.png',
  'item.mail': '../docs/img/g1-tide-mail-v1.png',
  'goal.lighthouse': '../docs/img/g1-tide-lighthouse-v1.png',
  'ui.mail': '../docs/img/g1-tide-mail-v1.png',
  'ui.tide': '../docs/img/g1-tide-tide-icon-v1.png',
  'actor.postman.raft': '../docs/img/g1-tide-postman-raft-v2.png',
  'ui.raft': '../docs/img/g1-tide-raft-icon-v2.png',
});
const byId = id => document.getElementById(id);
const canvas = byId('board');
const ctx = canvas.getContext('2d');
const images = new Map();
let state = newGame('baseline');
const tideLabel = turn => getTide(turn) === 'low' ? '低潮' : '高潮';

export async function loadLocalAssets(manifest) {
  images.clear();
  const failures = [];
  const fileLoads = new Map();
  const loadedFiles = new Set();
  let configured = 0;
  await Promise.all(Object.entries(manifest).map(async ([id, path]) => {
    if (path === null) return;
    configured += 1;
    try {
      const moduleLocal = typeof path === 'string' && /^\.\/[a-zA-Z0-9_./-]+\.(png|webp|jpg|jpeg)$/.test(path) && !path.split('/').includes('..');
      const repositoryAsset = typeof path === 'string' && /^\.\.\/docs\/img\/g1-tide-[a-zA-Z0-9_-]+\.(png|webp|jpg|jpeg)$/.test(path);
      if (!Object.hasOwn(assetManifest, id) || (!moduleLocal && !repositoryAsset)) throw new Error('仅允许本地目录或 docs/img/g1-tide-* 图片');
      const url = new URL(path, import.meta.url);
      const assetDirectory = new URL('../docs/img/', import.meta.url);
      if (url.origin !== location.origin || (repositoryAsset && !url.pathname.startsWith(assetDirectory.pathname))) throw new Error('禁止远端图片或越界路径');
      if (!fileLoads.has(url.href)) fileLoads.set(url.href, new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => img.naturalWidth > 0 && img.naturalHeight > 0 ? resolve(img) : reject(new Error('图片无有效尺寸'));
        img.onerror = () => reject(new Error('本地图片加载失败'));
        img.src = url.href;
      }));
      const img = await fileLoads.get(url.href);
      images.set(id, img);
      loadedFiles.add(url.href);
    } catch (error) { failures.push(`${id}：${error.message}`); }
  }));
  byId('asset-status').dataset.error = String(failures.length > 0);
  byId('asset-status').textContent = failures.length
    ? `资产加载错误：${images.size}/${configured} 个映射、${loadedFiles.size} 个唯一文件已加载；失败位置仍显示几何占位：${failures.join('；')}`
    : configured ? `资产状态：已加载 ${images.size} 个映射，来自 ${loadedFiles.size} 个唯一文件；生成资产候选，原图未优化，浏览器验收未完成。` : '资产状态：未配置，使用几何占位。';
  render();
  return { configured, loaded: images.size, uniqueFiles: loadedFiles.size, failures };
}
function imageOr(id, x, y, size, fallback) {
  const img = images.get(id);
  if (img) {
    if (id.startsWith('terrain.')) ctx.drawImage(img, x, y, size, size);
    else {
      const scale = Math.min((size - 10) / img.naturalWidth, (size - 10) / img.naturalHeight);
      const width = img.naturalWidth * scale, height = img.naturalHeight * scale;
      // Preserve aspect ratio; actor and lighthouse bases sit near the tile foot.
      const top = id === 'item.mail' ? y + (size - height) / 2 : y + size - 5 - height;
      ctx.drawImage(img, x + (size - width) / 2, top, width, height);
    }
  }
  else fallback();
}
function draw() {
  const level = levels[state.levelId];
  const size = canvas.width / level.width;
  const high = getTide(state.turn) === 'high';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < level.height; y += 1) for (let x = 0; x < level.width; x += 1) {
    const tile = level.tiles[y][x], px = x * size, py = y * size;
    const id = tile === 'L' ? 'terrain.land' : tile === 'D' ? 'terrain.deep' : `terrain.shallow.${high ? 'high' : 'low'}`;
    imageOr(id, px, py, size, () => {
      ctx.fillStyle = tile === 'L' ? '#71958a' : tile === 'D' ? '#204a62' : high ? '#508e9c' : '#d6bc80';
      ctx.fillRect(px + 2, py + 2, size - 4, size - 4);
      if (tile !== 'L') {
        ctx.strokeStyle = tile === 'S' ? '#f4dba7' : '#487a90'; ctx.lineWidth = 2;
        for (let i = 0; i < 3; i += 1) {
          ctx.beginPath(); ctx.moveTo(px + 20, py + 30 + i * 17); ctx.quadraticCurveTo(px + 50, py + 42 + i * 17, px + 80, py + 30 + i * 17); ctx.stroke();
        }
        if (tile === 'S') { ctx.setLineDash([5,5]); ctx.strokeRect(px + 8, py + 8, size - 16, size - 16); ctx.setLineDash([]); }
      }
    });
    if (tile === 'S') {
      // High shallows reuse the water image, but never lose their navigable-cell marker.
      ctx.strokeStyle = '#ffe49a'; ctx.lineWidth = 4; ctx.setLineDash([8, 5]);
      ctx.strokeRect(px + 5, py + 5, size - 10, size - 10); ctx.setLineDash([]);
      ctx.fillStyle = '#ffe49a'; ctx.beginPath();
      ctx.moveTo(px + 12, py + 12); ctx.lineTo(px + 28, py + 12); ctx.lineTo(px + 12, py + 28); ctx.fill();
    }
  }
  const { lighthouse, mail } = level;
  imageOr('goal.lighthouse', lighthouse.x * size, lighthouse.y * size, size, () => {
    const x = lighthouse.x * size, y = lighthouse.y * size;
    ctx.fillStyle = '#f3eee0'; ctx.beginPath(); ctx.moveTo(x+32,y+82); ctx.lineTo(x+39,y+33); ctx.lineTo(x+61,y+33); ctx.lineTo(x+68,y+82); ctx.fill();
    ctx.fillStyle = '#b55143'; ctx.fillRect(x+36,y+48,28,12); ctx.beginPath(); ctx.moveTo(x+30,y+30); ctx.lineTo(x+50,y+12); ctx.lineTo(x+70,y+30); ctx.fill();
    ctx.fillStyle = '#ffe19a'; ctx.fillRect(x+40,y+30,20,13);
  });
  if (!state.hasMail) imageOr('item.mail', mail.x * size, mail.y * size, size, () => {
    const x = mail.x * size + 24, y = mail.y * size + 31;
    ctx.fillStyle = '#fff3cf'; ctx.fillRect(x,y,52,36); ctx.strokeStyle = '#795c37'; ctx.lineWidth = 3;
    ctx.strokeRect(x,y,52,36); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+26,y+20); ctx.lineTo(x+52,y); ctx.stroke();
  });
  if (state.raftActive && !images.has('actor.postman.raft')) {
    ctx.fillStyle = '#c6a56d'; ctx.strokeStyle = '#654d2d'; ctx.lineWidth = 3;
    const x = state.x * size, y = state.y * size;
    ctx.fillRect(x + 8, y + 75, size - 16, 18); ctx.strokeRect(x + 8, y + 75, size - 16, 18);
    // This simple deployment marker is UI geometry, not an additional generated asset.
  }
  const actorId = state.raftActive ? 'actor.postman.raft' : 'actor.postman';
  imageOr(actorId, state.x * size, state.y * size, size, () => {
    const x = (state.x+.5)*size, y = (state.y+.5)*size;
    ctx.fillStyle = '#122c39'; ctx.beginPath(); ctx.ellipse(x,y+26,29,10,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = state.status === 'lost' ? '#e98e7c' : '#ffcf64'; ctx.beginPath(); ctx.arc(x,y,24,0,Math.PI*2); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#473e30'; ctx.stroke();
    ctx.fillStyle = '#283c48'; ctx.fillRect(x-15,y-12,30,7); ctx.fillRect(x-4,y+1,8,6);
    if (state.hasMail) { ctx.fillStyle = '#fff3cf'; ctx.fillRect(x+13,y+11,20,14); ctx.strokeRect(x+13,y+11,20,14); }
  });
}
function renderDomIcon(elementId, assetId) {
  const element = byId(elementId), img = images.get(assetId);
  element.hidden = !img;
  if (img) element.src = img.src;
  else element.removeAttribute('src');
}
function render(note = '') {
  draw();
  renderDomIcon('mail-icon', 'ui.mail');
  renderDomIcon('tide-icon', 'ui.tide');
  renderDomIcon('next-tide-icon', 'ui.tide');
  renderDomIcon('raft-icon', 'ui.raft');
  byId('level').value = state.levelId;
  byId('raft').textContent = state.levelId === 'baseline' ? '未配备' : state.raftActive ? '已展开 · 上岸消耗' : state.raftAvailable ? '可用 · 1 次穿行' : '已消耗';
  byId('tide').textContent = tideLabel(state.turn);
  byId('next-tide').textContent = state.turn === Number.MAX_SAFE_INTEGER ? '回合上限' : tideLabel(state.turn + 1);
  byId('turn').textContent = state.turn;
  byId('mail').textContent = state.hasMail ? '已拾取' : '尚未拾取';
  byId('position').textContent = `${state.x + 1}，${state.y + 1}`;
  byId('status').textContent = state.status === 'won' ? '投递成功！灯塔收到来信。可重新开始。' : state.status === 'lost' ? '投递失败：涨潮淹没了浅滩。重新开始，再选时机。' : note || (state.hasMail ? '信已装好，前往灯塔。注意下一步潮汐。' : '先找到信封，再把它送往灯塔。');
  canvas.setAttribute('aria-label', `8列6行地图。邮差在第${state.x+1}列第${state.y+1}行，${tideLabel(state.turn)}，${state.hasMail ? '持有邮件' : '尚未拾信'}。折叠筏：${byId('raft').textContent}。${byId('status').textContent}`);
  document.querySelectorAll('[data-action]').forEach(button => { button.disabled = state.status !== 'playing' && button.dataset.action !== 'restart'; });
}
function act(action) {
  try {
    const before = state;
    state = transition(state, action);
    render(action !== 'restart' && before.status === 'playing' && before.turn === state.turn ? '前方不可通行；没有消耗回合。' : '');
  } catch (error) { byId('status').textContent = `操作失败：${error.message}`; }
}
byId('level').addEventListener('change', () => {
  try {
    state = newGame(byId('level').value);
    render('已切换关卡并重新开始。');
    byId('save-feedback').textContent = '关卡已切换；文本框中的旧存档保持不变。';
  } catch (error) { byId('level').value = state.levelId; byId('status').textContent = `切换失败：${error.message}`; }
});
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => act(button.dataset.action)));
const keys = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', w:'up', s:'down', a:'left', d:'right', ' ':'wait', r:'restart' };
document.addEventListener('keydown', event => {
  if (event.target.closest('textarea,input,select,[contenteditable]:not([contenteditable=false])') || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  // Let Space activate a focused native button, rather than also taking a turn.
  if (event.key === ' ' && event.target.closest('button,summary')) return;
  const action = keys[event.key] || keys[event.key.toLowerCase()];
  if (action) { event.preventDefault(); act(action); }
});
byId('save').addEventListener('click', () => {
  byId('save-state').value = saveGame(state);
  byId('save-feedback').textContent = '当前状态已写入文本框；未写入浏览器存储。';
});
byId('load').addEventListener('click', () => {
  try {
    const source = JSON.parse(byId('save-state').value);
    const restored = loadGame(source);
    state = restored; render();
    byId('save-feedback').textContent = source.schemaVersion === 1
      ? 'v1 旧档已迁移到 v2：保留原进度，仍为无筏基线关卡，不赠送折叠筏。文本原稿未改写；可重新保存为 v2。'
      : 'v2 状态已恢复。';
  } catch (error) { byId('save-feedback').textContent = `恢复失败，当前游戏未改变：${error.message}`; }
});
render();
await loadLocalAssets(assetManifest);
