import { bounds, spawn, checkpointSpawn, solids, droneSites, gatePanel, relay, cache, entry, overlook, threshold, bulkhead, catwalk, doors } from './layout.mjs';

export const tick = 1 / 120;
export const magazine = 12;
export const reloadDuration = 1.46;
export const sequenceDurations = { arrival:7.05, opening:6.20, confirmation:5.80 };
const easeDoor = (time,start,duration) => {
  if (start === null) return 0;
  const t=clamp((time-start)/duration,0,1);
  return t*t*(3-2*t);
};
export function doorLift(run,door) {
  const start=door===threshold?run.entryAt:door===bulkhead?run.relayAt:run.gateAt?run.gateAt+3.6:null;
  return door.travel*easeDoor(run.time,start,door===bulkhead?2.78:1.82);
}

export function hydraulicState(run) {
  const age=run.gateAt?run.time-run.gateAt:0;
  const priming=run.action==='relay'?clamp(run.actionTime/relay.hold,0,1):
    run.relayOn?easeDoor(run.time,run.relayAt,1.65):0;
  return {
    lift:easeDoor(age,.28,3.66),
    pressure:priming*(1-.74*easeDoor(age,.63,4.45)),
    surge:easeDoor(age,.48,1.17)*(1-easeDoor(age,2.08,3.48)),
    discharge:easeDoor(age,.42,2.65),
    travel:Math.max(0,age-.54)*5.9
  };
}
export function flowReading(state) {
  return Math.round(12+174*state.discharge);
}
function doorBox(run,door) {
  const y0=doorLift(run,door);
  return { x0:door.x0,x1:door.x1,z0:door.z0,z1:door.z1,y0,y1:y0+door.y,surface:'metal' };
}
const standing = 1.66, crouching = 1.18, radius = .27;
const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
const tau = Math.PI * 2;
const blank = { moveX: 0, moveZ: 0, yaw: 0, pitch: 0 };
const boundaryPlanes = [['x', bounds.x0, bounds.x1], ['z', bounds.z0, bounds.z1], ['y', 0, 8.78]];
const reloadCues = [[.28, 'cell-out'], [.84, 'cell-in'], [1.19, 'latch']];

export function createRun(checkpoint = false) {
  const drones = droneSites.map((site, id) => ({
    id, role: site.role, health: checkpoint && id === 0 ? 0 : site.hp, x: site.x, y: site.y, z: site.z,
    yaw: .05, vx: 0, vz: 0, state: checkpoint && id === 0 ? 'dead' : id === 0 ? 'patrol' : 'docked',
    alertAt: 0, nextAt: 0, charge: 0, target: null, startedAt: 0, waypoint: 0, blinkUntil: 0, volleys: 0
  }));
  return {
    player: { ...(checkpoint?checkpointSpawn:spawn), y: standing, vx: 0, vz: 0, armor: 100, stride: 0, moving: false, sprint: false, ads: false, crouch: false, recoil: 0 },
    drones, bolts: [], nextBolt: 0, checkpoint, checkpointReady: checkpoint, entered: checkpoint,
    shotAt: 0, dryAt: 0, reloadStart: -1, reloadAt: 0, reloadCue: 0, ammo: magazine, reserve: 48,
    hits: 0, optics: 0, shots: 0, kills: checkpoint ? 1 : 0, time: 0, outcome: 'active',
    relayOn: false, cacheUsed: false, gateAt: 0, controlEntered:false, action: null, actionTime: 0, events: [],
    entryAt:checkpoint?-3:null, relayAt:null, relief:false, sequence:checkpoint?null:'arrival', sequenceAt:0
  };
}

export function lookVector(yaw, pitch) {
  const flat = Math.cos(pitch);
  return { x: -Math.sin(yaw) * flat, y: Math.sin(pitch), z: -Math.cos(yaw) * flat };
}

export function panelDistance(player, prop = gatePanel) {
  return Math.hypot(player.x - prop.x, player.z - prop.z);
}

export function objectiveFor(run) {
  if (run.sequence === 'opening') return 'opening';
  if (run.relief) return 'overlook';
  if (run.entryAt === null) return 'entry';
  if (!run.entered) return 'approach';
  if (run.kills < run.drones.length) return 'engage';
  return run.relayOn ? run.controlEntered?'gate':'control' : 'relay';
}

export function interactionFor(run) {
  const p = run.player;
  const look = lookVector(p.yaw,0);
  for (const prop of [entry,relay,gatePanel,cache,overlook]) {
    if (prop === entry && run.entryAt !== null || prop === overlook && !run.relief) continue;
    if (prop === cache && (run.cacheUsed || p.armor === 100 && run.reserve >= 48)) continue;
    const distance = panelDistance(p, prop);
    if (distance >= prop.range) continue;
    const facing = look.x * (prop.x - p.x) + look.z * (prop.z - p.z);
    if (facing < distance * .38) continue;
    const restricted=prop===relay||prop===gatePanel;
    const reason=restricted&&run.kills<run.drones.length?'combat':prop===gatePanel&&!run.relayOn?'pressure':null;
    if (prop === relay && run.relayOn || prop === gatePanel && run.gateAt) continue;
    return { id: prop.id, seconds: prop.hold, reason };
  }
  return null;
}

function boxHit(origin, ray, box, closest) {
  let near = 0, far = closest;
  let normal = null;
  for (const axis of ['x','y','z']) {
    const component = ray[axis], position = origin[axis];
    const min = box[axis + '0'], max = box[axis + '1'];
    if (Math.abs(component) < 1e-7) {
      if (position < min || position > max) return null;
      continue;
    }
    const a = (min - position) / component, b = (max - position) / component;
    const first = Math.min(a,b);
    if (first > near) {
      near = first;
      normal = { x:0, y:0, z:0, [axis]: -Math.sign(component) };
    }
    far = Math.min(far,Math.max(a,b));
    if (far < near) return null;
  }
  return { depth:near, normal };
}

export function traceSurface(origin, ray, limit = 65, run) {
  let result = { depth: limit, material: 'air', normal: { x:0, y:1, z:0 } };
  for (const box of solids) {
    const hit = boxHit(origin,ray,box,result.depth);
    if (hit && hit.depth < result.depth) result = { depth:hit.depth, material:box.surface || 'metal', normal:hit.normal || result.normal };
  }
  if (run) for (const door of doors) {
    const hit=boxHit(origin,ray,doorBox(run,door),result.depth);
    if (hit&&hit.depth<result.depth) result={depth:hit.depth,material:'metal',normal:hit.normal||result.normal};
  }
  for (const [axis, low, high] of boundaryPlanes) {
    if (Math.abs(ray[axis]) < 1e-7) continue;
    const d = ((ray[axis] > 0 ? high : low) - origin[axis]) / ray[axis];
    if (d >= 0 && d < result.depth) {
      const at = point(origin,ray,d);
      result = {
        depth:d, material:axis === 'y' && ray.y < 0 ? floorType(at.x,at.z) : 'concrete',
        normal:{x:0,y:0,z:0,[axis]:-Math.sign(ray[axis])}
      };
    }
  }
  return result;
}

export function traceWorld(origin, ray, limit, run) {
  return traceSurface(origin,ray,limit,run).depth;
}

function point(origin, ray, d) {
  return {x:origin.x+ray.x*d,y:origin.y+ray.y*d,z:origin.z+ray.z*d};
}

function heading(from, to) {
  const x = to.x-from.x, y = to.y-from.y, z = to.z-from.z;
  const length = Math.hypot(x,y,z) || 1e-7;
  return {x:x/length,y:y/length,z:z/length,length};
}

function floorType(x,z) {
  if (z > 13.8 || z < catwalk.z1 || Math.abs(x) > 6.70 || z > 7.85 && z < 8.86) return 'grate';
  return z < 7.65 && Math.sin(x * 1.7 + z * .36) + Math.cos(z * .71 - x * .55) > -.31 ? 'water' : 'concrete';
}

function fit(run, body, x, z, r, low, high) {
  for (const axis of ['x','z']) {
    const previous = body[axis];
    body[axis] = axis === 'x' ? clamp(x,bounds.x0+r,bounds.x1-r) : clamp(z,bounds.z0+r,bounds.z1-r);
    const overlaps = b => b.y0 < high && b.y1 > low &&
      body.x > b.x0-r && body.x < b.x1+r && body.z > b.z0-r && body.z < b.z1+r;
    const blocked = solids.some(overlaps)||doors.some(door=>overlaps(doorBox(run,door)));
    if (blocked) body[axis] = previous;
  }
}

function updatePlayer(run, input) {
  const p = run.player;
  p.crouch = Boolean(input.crouch);
  p.ads = Boolean(input.ads);
  p.sprint = Boolean(input.sprint && !p.crouch && !p.ads && !input.fire && !run.reloadAt && input.moveZ > .35);
  p.yaw = (p.yaw + input.yaw) % tau;
  p.pitch = clamp(p.pitch + input.pitch,-1.30,1.30);
  p.y += ((p.crouch ? crouching : standing)-p.y) * 13 * tick;
  p.recoil *= 1 - (p.ads ? 11.8 : 9.5) * tick;
  const speed = p.crouch ? 1.84 : p.ads ? 2.39 : p.sprint ? 6.0 : 3.86;
  const size = Math.max(1,Math.hypot(input.moveX,input.moveZ));
  const sin = Math.sin(p.yaw), cos = Math.cos(p.yaw);
  const targetX = (input.moveX*cos-input.moveZ*sin)*speed/size;
  const targetZ = (-input.moveX*sin-input.moveZ*cos)*speed/size;
  const acceleration = (input.moveX || input.moveZ ? 14 : 19)*tick;
  p.vx += (targetX-p.vx)*acceleration;
  p.vz += (targetZ-p.vz)*acceleration;
  const x = p.x, z = p.z;
  fit(run,p,x+p.vx*tick,z+p.vz*tick,radius,0,p.y+.14);
  const travel = Math.hypot(p.x-x,p.z-z);
  p.moving = travel > .002;
  p.stride += travel;
  const step = p.crouch ? 1.34 : p.sprint ? 1.96 : 1.67;
  if (p.stride >= step) {
    p.stride -= step;
    run.events.push({kind:'step',x:p.x,z:p.z,surface:floorType(p.x,p.z),quiet:p.crouch});
  }
  if (run.relayOn && !run.controlEntered && p.z < bulkhead.z0-.42) {
    run.controlEntered=true;
    run.events.push({kind:'control-enter'});
  }
  if (!run.entered && p.z < 7.58) {
    run.entered = true;
    run.events.push({kind:'enter'});
  }
}

function tryReload(run) {
  if (run.ammo < magazine && run.reserve && !run.reloadAt) {
    run.reloadStart = run.time;
    run.reloadAt = run.time+reloadDuration;
    run.reloadCue = 0;
    run.events.push({kind:'reload'});
  }
}

function updateReload(run) {
  if (!run.reloadAt) return;
  const cue = reloadCues[run.reloadCue];
  if (cue && run.time >= run.reloadStart+cue[0]) {
    run.reloadCue++;
    run.events.push({kind:cue[1]});
  }
  if (run.time < run.reloadAt) return;
  const take = Math.min(magazine-run.ammo,run.reserve);
  run.ammo += take;
  run.reserve -= take;
  run.reloadAt = 0;
  run.events.push({kind:'loaded'});
}

function hitSphere(origin, ray, x, y, z, r) {
  const dx = x-origin.x, dy = y-origin.y, dz = z-origin.z;
  const along = dx*ray.x + dy*ray.y + dz*ray.z;
  const discriminant = r*r-(dx*dx+dy*dy+dz*dz-along*along);
  if (discriminant <= 0 || along < 0) return Infinity;
  return Math.max(.005,along-Math.sqrt(discriminant));
}

export function droneOptic(d) {
  const size = d.role === 'warden' ? 1.16 : 1;
  return { x:d.x+Math.sin(d.yaw)*.37*size, y:d.y+.03, z:d.z+Math.cos(d.yaw)*.37*size };
}

function shoot(run) {
  run.ammo--;
  run.shots++;
  run.shotAt = run.time + .163;
  const p = run.player;
  const spread = (p.ads ? .0007 : p.crouch ? .0021 : p.moving ? .0060 : .0030) * (1 + p.recoil * .15);
  const shotYaw = p.yaw + Math.sin(run.shots*8.18)*spread;
  const shotPitch = p.pitch + p.recoil*(p.ads ? .0054 : .009) + Math.cos(run.shots*3.44)*spread;
  const ray = lookVector(shotYaw,shotPitch);
  p.recoil = Math.min(3.9,p.recoil+1);
  const surface = traceSurface(p,ray,65,run);
  let distance = surface.depth;
  let victim, part;
  for (const d of run.drones) {
    if (!d.health) continue;
    const heavy = d.role === 'warden', size = heavy ? 1.16 : 1;
    const optic = droneOptic(d);
    const opticDist = hitSphere(p,ray,optic.x,optic.y,optic.z,.125*size);
    const main = hitSphere(p,ray,d.x,d.y,d.z,.315*size);
    const a = Math.cos(d.yaw)*.52*size, b = -Math.sin(d.yaw)*.52*size;
    const pods = Math.min(hitSphere(p,ray,d.x+a,d.y+.013,d.z+b,.227*size),hitSphere(p,ray,d.x-a,d.y+.013,d.z-b,.227*size));
    const depth = Math.min(opticDist,main,pods);
    if (depth < distance) {
      distance = depth;
      victim = d;
      const front = (Math.sin(d.yaw)*(p.x-d.x)+Math.cos(d.yaw)*(p.z-d.z)) > Math.hypot(p.x-d.x,p.z-d.z)*.57;
      part = opticDist === depth && (!heavy || d.charge > 0 || d.state === 'recover') ? 'optic' : heavy && front && d.state !== 'charge' && d.state !== 'recover' ? 'armor' : 'body';
    }
  }
  const end = point(p,ray,distance);
  run.events.push({kind:'shot',end,hit:Boolean(victim),surface:surface.material,normal:surface.normal,ray});
  if (!victim) return;
  run.hits++;
  if (part === 'optic') run.optics++;
  victim.health = Math.max(0,victim.health-(part === 'optic' ? 2 : part === 'armor' ? .47 : 1));
  victim.blinkUntil = run.time+.12;
  if (victim.health) {
    if (victim.state === 'docked' || victim.state === 'patrol') activate(run,victim);
    if (part === 'optic' && victim.state === 'charge') {
      victim.state = 'recover';
      victim.nextAt = run.time+.85;
      victim.charge = 0;
      victim.target = null;
    }
    run.events.push({kind:'hit',id:victim.id,end,part,ray});
    return;
  }
  victim.state = 'dead';
  victim.charge = 0;
  victim.target = null;
  run.kills++;
  run.events.push({kind:'kill',id:victim.id,end,part,ray});
  if (victim.id === 0 && !run.checkpointReady) {
    run.checkpointReady = true;
    run.events.push({kind:'checkpoint'});
  }
  if (run.kills === run.drones.length) run.events.push({kind:'clear'});
}

function activate(run,d) {
  d.state = 'alert';
  d.startedAt = run.time;
  d.alertAt = run.time+(d.id === 0 ? .84 : d.id === 1 ? 1.0 : 1.18);
  run.events.push({kind:'detect',id:d.id});
}

function enemyMotion(run,d,site,visible,dist) {
  const p = run.player;
  const t = run.time;
  const [wx,wz] = site.patrol[d.waypoint];
  let x = wx, z = wz;
  const charged = d.state === 'charge';
  const attacking = ['track','charge','recover'].includes(d.state);

  if (attacking && visible && !charged) {
    const towardsX = (p.x-d.x)/Math.max(.01,dist), towardsZ = (p.z-d.z)/Math.max(.01,dist);
    if(site.role==='scout') {
      const sweep=Math.sin((t-d.alertAt)*1.62);
      const range=clamp((dist-site.band)*.48,-1,1);
      x=d.x+towardsX*range*1.38-towardsZ*sweep*2.18;
      z=d.z+towardsZ*range*1.38+towardsX*sweep*1.40;
    } else if(site.role==='skirmisher') {
      // Retreat toward the cabinet between shots, then leave from its opposite edge.
      const side=d.volleys%2===0?-1:1;
      if(d.state==='recover') {
        x=1.56;z=-7.55;
      } else {
        const range=clamp((dist-site.band)*.26,-.65,.86);
        x=d.x+towardsX*range*1.55-towardsZ*side*2.76;
        z=d.z+towardsZ*range*1.55+towardsX*side*1.96;
      }
    } else {
      const push=clamp((dist-5.3)*.57,-.18,1);
      x=d.x+towardsX*push*2.65;
      z=d.z+towardsZ*push*2.65;
      if(d.state==='recover') {x=d.x;z=d.z;}
    }
    x = clamp(x,-5.05,3.22);
    z = clamp(z,site.z-4.6,site.z+3.2);
  } else if(charged) {
    x=d.x;z=d.z;
  } else if (Math.hypot(wx-d.x,wz-d.z) < .52) {
    d.waypoint = (d.waypoint+1)%site.patrol.length;
  }

  const length = Math.max(.28,Math.hypot(x-d.x,z-d.z));
  const velocity = site.speed * (d.state === 'patrol' ? .42 : charged ? .25 : 1);
  const prevX = d.x, prevZ = d.z;
  d.vx += ((x-d.x)/length * velocity-d.vx)*tick*5.8;
  d.vz += ((z-d.z)/length * velocity-d.vz)*tick*5.8;
  const offset = Math.sin(t*(1.5+d.id*.26)+d.id*3.1)*(charged ? .05 : .19);
  const lift = d.state === 'alert' ? clamp((t-d.startedAt)*1.8,0,1)*.43 :
    site.role==='warden'&&d.state==='recover'?.18 : .43;
  d.y += (site.y+offset+lift-(d.id === 0 ? .40 : 0)-d.y)*tick*4.2;
  fit(run,d,d.x+d.vx*tick,d.z+d.vz*tick,.39,d.y-.22,d.y+.24);
  if (Math.hypot(d.x-prevX,d.z-prevZ)<.0008) {
    d.vx *= .89;
    d.vz *= .89;
  }
  const facing = visible || d.state === 'charge' ? p : {x:wx,z:wz};
  const yaw = Math.atan2(facing.x-d.x,facing.z-d.z);
  const delta = Math.atan2(Math.sin(yaw-d.yaw),Math.cos(yaw-d.yaw));
  d.yaw += delta * tick * (charged ? 6 : 3.5);
}

function spawnBolt(run,d,site) {
  const start = droneOptic(d);
  const direction = heading(start,d.target);
  const speed = d.id === 2 ? 22 : d.id === 1 ? 26 : 21;
  run.bolts.push({ ...start, id:++run.nextBolt, source:d.id, dx:direction.x, dy:direction.y, dz:direction.z, speed, age:0, power:site.damage });
  run.events.push({kind:'bolt',id:d.id,from:start});
}

function updateDrone(run,d) {
  if (!d.health) return;
  const p = run.player, site = droneSites[d.id], t = run.time;
  const raised = {x:p.x,y:p.y-.16,z:p.z};
  const sight = heading(droneOptic(d),raised);
  const visible = sight.length < (d.id === 2 ? 21 : 17.5) && traceWorld(droneOptic(d),sight,sight.length,run) >= sight.length-.018;
  if (d.state === 'docked') {
    const deploy = d.id === 1 ? p.z < -1.25 || run.kills > 0 : p.z < -12.3 || run.kills >= 2;
    if (run.entered && deploy) activate(run,d);
    else return;
  }
  if (d.state === 'patrol' && run.entered && visible) activate(run,d);
  enemyMotion(run,d,site,visible,sight.length);
  if (d.state === 'alert' && t >= d.alertAt || d.state === 'recover' && t >= d.nextAt) {
    d.state = 'track';
    d.nextAt = t+.25+d.id*.23;
  }
  if (d.state === 'track' && visible && t > d.nextAt) {
    d.state = 'charge';
    d.startedAt = t;
    d.target = raised;
    run.events.push({kind:'charge',id:d.id});
  }
  if (d.state !== 'charge') return;
  const progress = (t-d.startedAt)/site.windup;
  if (progress < .52 && visible) {
    d.target = {x:raised.x+p.vx*site.lead,y:raised.y,z:raised.z+p.vz*site.lead};
  }
  d.charge = clamp(progress,.01,1);
  if (progress < 1) return;
  spawnBolt(run,d,site);
  d.state = 'recover';
  d.target = null;
  d.charge = 0;
  d.nextAt = t+site.wait;
  d.volleys++;
}

function updateBolts(run) {
  const p = run.player;
  run.bolts = run.bolts.filter(b => {
    const ray = {x:b.dx,y:b.dy,z:b.dz};
    const distance = b.speed*tick;
    const wall = traceSurface(b,ray,distance,run);
    const upper = hitSphere(b,ray,p.x,p.y-.12,p.z,.29);
    const lower = hitSphere(b,ray,p.x,p.y-.46,p.z,.34);
    const depth = Math.min(upper,lower);
    if (depth <= wall.depth) {
      p.armor = Math.max(0,p.armor-b.power);
      run.events.push({kind:'damage',id:b.source,from:{x:b.x,y:b.y,z:b.z},power:b.power});
      if (!p.armor) run.outcome = 'lost';
      return false;
    }
    if (wall.material !== 'air') {
      run.events.push({kind:'impact',end:point(b,ray,wall.depth),surface:wall.material,normal:wall.normal,ray,power:b.power});
      return false;
    }
    const passage=(p.x-b.x)*b.dx+(p.y-.18-b.y)*b.dy+(p.z-b.z)*b.dz;
    if(passage>=0&&passage<distance) {
      const closest=point(b,ray,passage);
      if(Math.hypot(closest.x-p.x,closest.y-p.y+.18,closest.z-p.z)<1.26)
        run.events.push({kind:'near-miss',from:closest,power:b.power});
    }
    Object.assign(b,point(b,ray,distance));
    b.age += tick;
    return b.age < 2.9;
  });
}

function useEquipment(run,input) {
  const item = input.use && !input.fire && !run.reloadAt && interactionFor(run);
  if (!item || item.reason) {
    run.action = null;
    run.actionTime = 0;
    return;
  }
  if (run.action !== item.id) {
    run.action = item.id;
    run.actionTime = 0;
    run.events.push({kind:'interact',id:item.id});
  }
  const previous=run.actionTime;
  run.actionTime += tick;
  if(item.id==='gate'&&previous<.28*item.seconds&&run.actionTime>=.28*item.seconds)
    run.events.push({kind:'gate-grip',from:gatePanel});
  if (run.actionTime < item.seconds) return;
  if (item.id === 'entry') {
    run.entryAt=run.time;
  } else if (item.id === 'cache') {
    run.cacheUsed = true;
    run.player.armor = Math.min(100,run.player.armor+40);
    run.reserve = Math.min(60,run.reserve+24);
  } else if (item.id === 'relay') {
    run.relayOn = true;
    run.relayAt=run.time;
  } else {
    run.sequence=item.id==='gate'?'opening':'confirmation';
    run.sequenceAt=run.time;
    if (item.id==='gate') run.gateAt=run.time;
    run.reloadAt = 0;
    run.bolts = [];
    run.player.moving = run.player.sprint = run.player.ads = false;
  }
  run.events.push({kind:item.id});
  run.action = null;
  run.actionTime = 0;
}

export function advance(run, input = blank) {
  run.events.length = 0;
  if (run.outcome === 'lost' || run.outcome === 'won') return;
  run.time += tick;
  if (run.sequence) {
    if (run.time-run.sequenceAt>=sequenceDurations[run.sequence] || run.sequence==='arrival'&&input.skip) {
      const completed=run.sequence;
      run.sequence=null;
      if (completed==='opening') run.relief=true;
      if (completed==='confirmation') run.outcome='won';
      run.events.push({kind:'sequence-end',id:completed});
    }
    return;
  }
  updatePlayer(run,input);
  updateReload(run);
  if (input.reload) tryReload(run);
  if (input.fire && run.time >= run.shotAt && !run.reloadAt && !run.player.sprint) {
    if (run.ammo) shoot(run);
    else if (run.reserve) tryReload(run);
    else if (run.time >= run.dryAt) {
      run.dryAt = run.time+.43;
      run.events.push({kind:'dry'});
    }
  }
  useEquipment(run,input);
  if (run.sequence||run.relief) return;
  for (const d of run.drones) updateDrone(run,d);
  updateBolts(run);
}

