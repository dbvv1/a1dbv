// Reader-test consumer: two independent MOBA Simulations consume the adopted
// stable-seat command envelope in-process. No TCP, WebSocket, port or browser.
//
// The MOBA source is passed in (never hard-coded):
//   MOBA_SOURCE=<path to the fixed MOBA-Like worktree> node --import tsx run.mjs
// Optional: MOBA_TARGET_COMMIT=<sha> to record whether the checked-out source
// matches the task's real-consumer commit for src/sim and tests/command-frame.test.ts.

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.env.MOBA_SOURCE;
if (!root) {
  console.error('MOBA_SOURCE is required');
  process.exit(2);
}

const targetCommit = process.env.MOBA_TARGET_COMMIT ?? null;
const navBytes = await readFile(resolve(root, 'src/sim/nav/lane.navmesh'));
const navSha256 = createHash('sha256').update(navBytes).digest('hex');
const source = await import(pathToFileURL(resolve(root, 'src/sim/index.ts')).href);
const { Simulation, createDetourNavigation } = source;

const config = { seed: 901, contentVersion: 12, heroesPerTeam: 3 };
const TEAM_SIZE = config.heroesPerTeam;
const SEAT_COUNT = TEAM_SIZE * 2;
const WINDOW_TICKS = 600;
const PURCHASE_TICK = 9001;

// ---------------------------------------------------------------------------
// Source identity (no local path in the output).
// ---------------------------------------------------------------------------
function git(args) {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}
const headCommit = git(['rev-parse', 'HEAD']);
let targetIsAncestor = null;
let sourceDiffNames = null;
if (targetCommit) {
  try {
    execFileSync('git', ['-C', root, 'merge-base', '--is-ancestor', targetCommit, 'HEAD'], { stdio: 'ignore' });
    targetIsAncestor = true;
  } catch {
    targetIsAncestor = false;
  }
  sourceDiffNames = git(['diff', '--name-only', targetCommit, 'HEAD', '--', 'src/sim', 'tests/command-frame.test.ts']);
}

// ---------------------------------------------------------------------------
// Deterministic logical command schedule. The schedule is indexed by the frame's
// target tick (state.tick + 1). Each seat has its own ordered command list.
// ---------------------------------------------------------------------------
function makeSchedule(seats) {
  const hero = seats.map((s) => s.heroId);
  const sign = (seat) => (seat < TEAM_SIZE ? 1 : -1);
  const basePoint = [
    { x: -90, z: 0 },
    { x: -90, z: -2 },
    { x: -92, z: 3 },
    { x: 90, z: 0 },
    { x: 90, z: 2 },
    { x: 92, z: -3 },
  ];
  const movePoint = (seat, n) => ({
    x: basePoint[seat].x + ((n % 3) - 1) * 1.5,
    z: basePoint[seat].z + ((Math.floor(n / 3) % 3) - 1) * 1.5,
  });
  const stop = (seat) => ({ type: 'stop', heroId: hero[seat] });
  const move = (seat, n) => ({ type: 'move', heroId: hero[seat], point: movePoint(seat, n) });
  const castW = (seat, direction) => ({
    type: 'cast',
    heroId: hero[seat],
    slot: 'W',
    targetId: null,
    direction,
    point: null,
  });
  const castQ = (seat) => ({
    type: 'cast',
    heroId: hero[seat],
    slot: 'Q',
    targetId: null,
    direction: { x: sign(seat), z: 0 },
    point: null,
  });
  const buy = (seat, itemId) => ({ type: 'buyItem', heroId: hero[seat], itemId });

  const schedule = new Map();
  const at = (tick) => {
    let frame = schedule.get(tick);
    if (!frame) {
      frame = Array.from({ length: SEAT_COUNT }, () => []);
      schedule.set(tick, frame);
    }
    return frame;
  };

  for (let tick = 1; tick <= WINDOW_TICKS; tick += 1) {
    const frame = at(tick);
    if (tick === 1) {
      for (let seat = 0; seat < SEAT_COUNT; seat += 1) frame[seat].push(move(seat, tick));
    } else if (tick === 2) {
      // Same-seat order matters: move then stop is not stop then move.
      frame[0].push(move(0, tick), stop(0));
    } else if (tick === 3) {
      frame[0].push(move(0, tick));
      frame[3].push(move(3, tick), stop(3));
    } else if (tick === 4) {
      frame[1].push(stop(1));
      frame[4].push(stop(4));
    } else if (tick === 5) {
      // Legal wire shape, zero direction: original rule returns directionRequired.
      frame[1].push(castW(1, null));
    } else if (tick === 6) {
      frame[1].push(castW(1, { x: sign(1), z: 0 }));
    } else if (tick === 7) {
      // Same slot while still on cooldown: original rule returns cooldown.
      frame[1].push(castW(1, { x: sign(1), z: 0 }));
    } else if (tick === 11) {
      frame[0].push(castW(0, { x: sign(0), z: 0 }));
      frame[3].push(castW(3, { x: sign(3), z: 0 }));
    } else if (tick === 12) {
      frame[0].push(castW(0, { x: sign(0), z: 0 }));
    } else if (tick === 13) {
      frame[2].push(castQ(2));
      frame[5].push(castQ(5));
    } else if (tick === 20) {
      // Seat 0 is sent twice with the same content by side A (dedupe probe).
      frame[0].push(move(0, tick));
      frame[4].push(castQ(4));
    } else if (tick === 30) {
      // A real buyItem early in the match: original rule returns notEnoughGold.
      frame[0].push(buy(0, 'wayfarer_boots'));
    } else if (tick >= 40 && tick <= 99 && tick % 20 === 0) {
      for (let offset = 0; offset < 3; offset += 1) {
        const seat = (tick / 20 + offset) % SEAT_COUNT;
        frame[seat].push(move(seat, tick + offset));
      }
    } else if (tick >= 130 && tick <= WINDOW_TICKS && tick % 20 === 0) {
      for (let offset = 0; offset < 3; offset += 1) {
        const seat = (tick / 20 + offset) % SEAT_COUNT;
        frame[seat].push(move(seat, tick + offset));
      }
    } else if (tick >= 130 && tick <= WINDOW_TICKS && tick % 35 === 0) {
      const seat = (tick / 35) % SEAT_COUNT;
      frame[seat].push(stop(seat));
    } else if (tick >= 130 && tick <= WINDOW_TICKS && tick % 90 === 0) {
      const seat = (tick / 90) % SEAT_COUNT;
      frame[seat].push(castQ(seat));
    }
    // Ticks 100..129 are deliberately all-empty: six explicit empty seat arrays.
  }
  return schedule;
}

function frameFor(sim, perSeat, order, duplicateSeat) {
  // Production frame builder groups commands by simulation-owned seat and emits
  // every seat, including empty ones. We only change the arrival order of the
  // already-built inputs; no second sorter.
  const built = sim.commandFrame(perSeat.flat());
  const inputs = order.map((seat) => {
    const input = built.inputs.find((candidate) => candidate.seat === seat);
    if (!input) throw new Error(`production frame dropped seat ${seat}`);
    return { seat, commands: structuredClone(input.commands) };
  });
  if (duplicateSeat !== undefined) {
    const first = inputs.find((input) => input.seat === duplicateSeat);
    inputs.push({ seat: duplicateSeat, commands: structuredClone(first.commands) });
  }
  return { tick: built.tick, inputs };
}

function seatHero(sim, seat) {
  const entry = sim.inputSeats[seat];
  if (!entry) throw new Error(`no seat ${seat}`);
  const team = seat < TEAM_SIZE ? 0 : 1;
  const slot = seat % TEAM_SIZE;
  const hero = sim.getHero(team, slot);
  if (!hero) throw new Error(`no hero for seat ${seat}`);
  return hero;
}

function heroView(sim, seat) {
  const hero = seatHero(sim, seat);
  const snap = sim.snapshot().heroes.find((h) => h.id === hero.id);
  return {
    seat,
    heroId: hero.id,
    position: snap.position,
    mana: snap.mana,
    gold: snap.gold,
    hp: snap.hp,
    maxHp: snap.maxHp,
    items: snap.items,
    cooldowns: snap.cooldowns,
    moveGoal: snap.moveGoal,
    castSlot: snap.castSlot,
  };
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ---------------------------------------------------------------------------
// Two independent simulations, same real navigation bytes and initial state.
// ---------------------------------------------------------------------------
const navA = await createDetourNavigation(navBytes);
const navB = await createDetourNavigation(navBytes);
const simA = new Simulation({ ...config, navigation: navA });
const simB = new Simulation({ ...config, navigation: navB });

const seats = simA.inputSeats.map((s) => ({ seat: s.seat, heroId: s.heroId }));
if (!sameJson(seats, simB.inputSeats.map((s) => ({ seat: s.seat, heroId: s.heroId })))) {
  throw new Error('seat mapping differs between simulations');
}
const initialHashA = simA.finalHash();
const initialHashB = simB.finalHash();
if (initialHashA !== initialHashB) throw new Error(`initial hash mismatch: ${initialHashA} != ${initialHashB}`);

const schedule = makeSchedule(seats);
const orderA = Array.from({ length: SEAT_COUNT }, (_, i) => i);
const orderB = [5, 2, 4, 0, 3, 1];

const receipts = {};
let mismatches = 0;
let firstMismatch = null;
let resultsMismatches = 0;
let arrivalOrderDifferTicks = 0;
const windowHashes = [];
const checkpoints = [];
let snapshot600A = null;
let snapshot600B = null;
const totalTicks = PURCHASE_TICK + 80;

function captureKey(tick, beforeA, resultsA, afterA) {
  receipts[`tick${tick}`] = { before: beforeA, results: resultsA, after: afterA };
}

for (let tick = 1; tick <= totalTicks; tick += 1) {
  let perSeat;
  if (tick <= WINDOW_TICKS) {
    perSeat = schedule.get(tick) ?? Array.from({ length: SEAT_COUNT }, () => []);
  } else {
    perSeat = Array.from({ length: SEAT_COUNT }, () => []);
    if (tick === PURCHASE_TICK) {
      // First affordable purchase from the original economy (600 gold).
      perSeat[0].push({ type: 'buyItem', heroId: seats[0].heroId, itemId: 'wayfarer_boots' });
    } else if (tick === PURCHASE_TICK + 1) {
      // Exercise a skill after the purchased item changed stats.
      perSeat[0].push({
        type: 'cast',
        heroId: seats[0].heroId,
        slot: 'W',
        targetId: null,
        direction: { x: 1, z: 0 },
        point: null,
      });
      perSeat[3].push({
        type: 'cast',
        heroId: seats[3].heroId,
        slot: 'W',
        targetId: null,
        direction: { x: -1, z: 0 },
        point: null,
      });
    }
  }
  const duplicateSeat = tick === 20 ? 0 : undefined;

  const wantBefore = new Set([5, 6, 7, 11, 12, 13, 20, 30, PURCHASE_TICK, PURCHASE_TICK + 1]);
  const beforeA = wantBefore.has(tick) ? seats.map((s) => heroView(simA, s.seat)) : null;

  const frameA = frameFor(simA, perSeat, orderA, duplicateSeat);
  const frameB = frameFor(simB, perSeat, orderB);
  if (tick <= WINDOW_TICKS) {
    const nonEmptyA = frameA.inputs.filter((input) => input.commands.length > 0).map((input) => input.seat);
    const nonEmptyB = frameB.inputs.filter((input) => input.commands.length > 0).map((input) => input.seat);
    if (!sameJson(nonEmptyA, nonEmptyB)) arrivalOrderDifferTicks += 1;
  }

  const resultsA = simA.step(frameA);
  const resultsB = simB.step(frameB);
  const hashA = simA.finalHash();
  const hashB = simB.finalHash();

  if (hashA !== hashB) {
    mismatches += 1;
    if (firstMismatch === null) firstMismatch = { tick, hashA, hashB };
    break;
  }
  if (!sameJson(resultsA, resultsB)) {
    resultsMismatches += 1;
    if (firstMismatch === null) firstMismatch = { tick, results: true };
    break;
  }
  if (tick <= WINDOW_TICKS) windowHashes.push(hashA);
  if (tick === WINDOW_TICKS) {
    snapshot600A = JSON.stringify(simA.snapshot());
    snapshot600B = JSON.stringify(simB.snapshot());
  }
  if (wantBefore.has(tick)) {
    captureKey(tick, beforeA, resultsA, seats.map((s) => heroView(simA, s.seat)));
  }
  if (tick % 600 === 0 || tick === totalTicks) {
    checkpoints.push({ tick, hash: hashA, status: simA.status, gold: seatHero(simA, 0).gold });
  }
  if (tick % 1200 === 0) console.error(`tick ${tick}/${totalTicks} status=${simA.status}`);
}

// ---------------------------------------------------------------------------
// Protocol / failure probes against the original API (no second sorter).
// ---------------------------------------------------------------------------
function newSim(nav) {
  return new Simulation({ ...config, navigation: nav });
}
const probeNav = await createDetourNavigation(navBytes);
const probeSim = newSim(probeNav);
for (let i = 0; i < 5; i += 1) probeSim.step(probeSim.commandFrame([]));
const probeHeroes = probeSim.inputSeats.map((s) => s.heroId);
const probeTick = probeSim.state.tick;
const probeValidInputs = probeSim.inputSeats.map(({ seat }) => ({ seat, commands: [] }));

function expectThrow(name, frame, expectedFragment) {
  const beforeHash = probeSim.finalHash();
  const beforeTick = probeSim.state.tick;
  let message = null;
  try {
    probeSim.step(frame);
  } catch (error) {
    message = error instanceof Error ? error.message : String(error);
  }
  const hashUnchanged = probeSim.finalHash() === beforeHash;
  const tickUnchanged = probeSim.state.tick === beforeTick;
  return {
    name,
    expectedFragment,
    actualMessage: message,
    hashUnchanged,
    tickUnchanged,
    pass: message !== null && message.includes(expectedFragment) && hashUnchanged && tickUnchanged,
  };
}

const probeResults = [];
probeResults.push(
  expectThrow(
    'conflicting same-seat retry',
    {
      tick: probeTick + 1,
      inputs: [
        { seat: 0, commands: [{ type: 'stop', heroId: probeHeroes[0] }] },
        { seat: 0, commands: [{ type: 'move', heroId: probeHeroes[0], point: { x: -90, z: 0 } }] },
        ...probeValidInputs.slice(1),
      ],
    },
    'conflicting input retry',
  ),
);
probeResults.push(
  expectThrow(
    'wrong heroId for seat',
    {
      tick: probeTick + 1,
      inputs: probeValidInputs.map((input) =>
        input.seat === 0 ? { seat: 0, commands: [{ type: 'stop', heroId: probeHeroes[1] }] } : input,
      ),
    },
    'input does not own this hero',
  ),
);
probeResults.push(
  expectThrow('missing seat', { tick: probeTick + 1, inputs: probeValidInputs.slice(0, SEAT_COUNT - 1) }, 'missing input seat'),
);
probeResults.push(
  expectThrow('current tick (old frame)', { tick: probeTick, inputs: probeValidInputs }, 'input tick is not the next simulation tick'),
);
probeResults.push(
  expectThrow('future tick', { tick: probeTick + 2, inputs: probeValidInputs }, 'input tick is not the next simulation tick'),
);
probeResults.push(
  expectThrow(
    'extra gameplay field (mana override)',
    {
      tick: probeTick + 1,
      inputs: probeValidInputs.map((input) =>
        input.seat === 0
          ? { seat: 0, commands: [{ type: 'stop', heroId: probeHeroes[0], mana: 999 }] }
          : input,
      ),
    },
    'malformed frame command',
  ),
);
probeResults.push(
  expectThrow(
    'out-of-range seat',
    {
      tick: probeTick + 1,
      inputs: [...probeValidInputs, { seat: SEAT_COUNT, commands: [] }],
    },
    'invalid input seat',
  ),
);
const probeHashBeforeValid = probeSim.finalHash();
const probeValidResults = probeSim.step({ tick: probeTick + 1, inputs: probeValidInputs });
const probeValidAdvanced = probeSim.state.tick === probeTick + 1 && probeSim.finalHash() !== probeHashBeforeValid;

// Dedupe probe: identical same-seat envelope twice must apply once, including a cast.
const dedupeNavA = await createDetourNavigation(navBytes);
const dedupeNavB = await createDetourNavigation(navBytes);
const dedupeA = newSim(dedupeNavA);
const dedupeB = newSim(dedupeNavB);
for (let i = 0; i < 5; i += 1) {
  dedupeA.step(dedupeA.commandFrame([]));
  dedupeB.step(dedupeB.commandFrame([]));
}
const dedupeHeroes = dedupeA.inputSeats.map((s) => s.heroId);
const dedupeW = { type: 'cast', heroId: dedupeHeroes[0], slot: 'W', targetId: null, direction: { x: 1, z: 0 }, point: null };
const dedupeInputs = dedupeA.inputSeats.map(({ seat }) => ({
  seat,
  commands: seat === 0 ? [structuredClone(dedupeW)] : [],
}));
const dedupeBeforeMana = heroView(dedupeA, 0).mana;
const dedupeResultsA = dedupeA.step({
  tick: dedupeA.state.tick + 1,
  inputs: [...dedupeInputs, { seat: 0, commands: [structuredClone(dedupeW)] }],
});
const dedupeResultsB = dedupeB.step({ tick: dedupeB.state.tick + 1, inputs: dedupeInputs });
const dedupeAfterMana = heroView(dedupeA, 0).mana;
const dedupe = {
  duplicateSeat: 0,
  duplicateWasIdentical: true,
  resultCountWithDuplicate: dedupeResultsA.length,
  resultCountControl: dedupeResultsB.length,
  hashEqual: dedupeA.finalHash() === dedupeB.finalHash(),
  resultsEqual: sameJson(dedupeResultsA, dedupeResultsB),
  manaBefore: dedupeBeforeMana,
  manaAfter: dedupeAfterMana,
  cooldownW: heroView(dedupeA, 0).cooldowns.W,
  pass:
    dedupeA.finalHash() === dedupeB.finalHash() &&
    sameJson(dedupeResultsA, dedupeResultsB) &&
    dedupeResultsA.length === 1,
};

// Same-seat order control: move then stop vs stop then move must differ.
const orderNavA = await createDetourNavigation(navBytes);
const orderNavB = await createDetourNavigation(navBytes);
const orderSimA = newSim(orderNavA);
const orderSimB = newSim(orderNavB);
const tick1 = makeSchedule(orderSimA.inputSeats).get(1);
for (const sim of [orderSimA, orderSimB]) sim.step(frameFor(sim, tick1, Array.from({ length: SEAT_COUNT }, (_, i) => i)));
const orderHeroes = orderSimA.inputSeats.map((s) => s.heroId);
const moveCmd = { type: 'move', heroId: orderHeroes[0], point: { x: -86, z: 0 } };
const stopCmd = { type: 'stop', heroId: orderHeroes[0] };
const orderFrame = (sim, commands) => ({
  tick: sim.state.tick + 1,
  inputs: sim.inputSeats.map(({ seat }) => ({ seat, commands: seat === 0 ? commands : [] })),
});
orderSimA.step(orderFrame(orderSimA, [structuredClone(moveCmd), structuredClone(stopCmd)]));
orderSimB.step(orderFrame(orderSimB, [structuredClone(stopCmd), structuredClone(moveCmd)]));
const orderControl = {
  moveThenStopHash: orderSimA.finalHash(),
  stopThenMoveHash: orderSimB.finalHash(),
  differ: orderSimA.finalHash() !== orderSimB.finalHash(),
};

// ---------------------------------------------------------------------------
// Output summary. No local paths.
// ---------------------------------------------------------------------------
const finalHero0 = heroView(simA, 0);
const output = {
  schema: 1,
  scope:
    'Local same-version CPU seam: two in-process Simulations consume the adopted stable-seat command envelope. No TCP/WebSocket/port/browser/Unity/UE/public-network claim.',
  source: {
    rootName: basename(root),
    headCommit,
    targetCommit,
    targetIsAncestorOfHead: targetIsAncestor,
    sourceEquivalentAtTarget: targetCommit !== null ? sourceDiffNames === '' : null,
  },
  config,
  navigation: { bytes: navBytes.length, sha256: navSha256, instances: 2 },
  initial: {
    hashA: initialHashA,
    hashB: initialHashB,
    equal: initialHashA === initialHashB,
    seats,
    heroIdsByTeam: simA.config.heroIdsByTeam,
    maxMatchSeconds: simA.config.maxMatchSeconds,
  },
  arrivalOrders: { sideA: orderA, sideB: orderB, differingTicksInWindow: arrivalOrderDifferTicks },
  window600: {
    ticks: windowHashes.length,
    perTickHashEqual: mismatches === 0 && windowHashes.length === WINDOW_TICKS,
    hashes: windowHashes,
    emptySeatTicks: [100, 129],
  },
  extension: {
    totalTicksRun: simA.state.tick,
    perTickCompareTicks: simA.state.tick,
    hashMismatches: mismatches,
    resultsMismatches,
    firstMismatch,
    checkpoints,
    purchaseTick: PURCHASE_TICK,
  },
  snapshotEquality: {
    tick600FullSnapshotJsonEqual: snapshot600A !== null && snapshot600A === snapshot600B,
    tick600HashA: windowHashes.length === WINDOW_TICKS ? windowHashes[WINDOW_TICKS - 1] : null,
  },
  receipts,
  failureProbes: {
    probes: probeResults,
    allPass: probeResults.every((p) => p.pass),
    validFrameAfterProbesAdvanced: probeValidAdvanced,
    validFrameResultCount: probeValidResults.length,
  },
  dedupe,
  orderControl,
  final: {
    tick: simA.state.tick,
    status: simA.status,
    winner: simA.state.winner,
    endReason: simA.state.endReason,
    hashA: simA.finalHash(),
    hashB: simB.finalHash(),
    equal: simA.finalHash() === simB.finalHash(),
    hero0: finalHero0,
  },
  notes: [
    'Each side owns a separate DetourNavigation instance built from the same lane.navmesh bytes.',
    'Seat order differs between sides; production Simulation.frameCommands sorts by seat and preserves per-seat command order.',
    'The main run is 600 framed ticks, then empty frames continue in the same two simulations only until the original economy makes wayfarer_boots (600 gold) affordable.',
    'Ticks 100-129 are all-empty frames with six explicit empty seat arrays.',
  ],
};

console.log(JSON.stringify(output, null, 2));

navA.destroy();
navB.destroy();
probeNav.destroy();
dedupeNavA.destroy();
dedupeNavB.destroy();
orderNavA.destroy();
orderNavB.destroy();
