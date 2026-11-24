import * as T from 'three';
import { makeHallFinishes } from './hall-finishes.mjs';
import { buildTransitions } from './spaces.mjs';
import { buildStructures, terminalScreen } from './structures.mjs';
import { buildPlant } from './plant.mjs';
import { crates, machines, openings, gatePanel, muzzleLights } from './layout.mjs';
import { batches, boxGeo, coatedPart, canvasMap, cylGeo, decal, grimeMap, place, random, stenciled } from './art.mjs';

const floorAngle = [-Math.PI / 2, 0, 0];
const leftAngle = [0, Math.PI / 2, 0];
const rightAngle = [0, -Math.PI / 2, 0];

function marking(b, material, w, h, x, y, z, angle) {
  b.add(new T.PlaneGeometry(w, h), material, [x, y, z], angle, false);
}
function stencil(text, options) {
  return decal(stenciled(text, options), 1, true);
}
function paintLine() {
  return decal(canvasMap(512, 256, (c, w, h) => {
    const rand = random(115);
    c.fillStyle = '#af8a41';
    c.fillRect(0, h * .33, w, h * .34);
    c.fillStyle = '#d2b86d';
    c.fillRect(0, h * .36, w, h * .03);
    c.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 7000; i++) {
      const r = rand();
      c.fillStyle = 'rgba(0,0,0,' + (rand() * .85 + .13) + ')';
      c.fillRect(rand() * w, rand() * h, 1 + r ** 5 * 31, 1 + r ** 2 * 2);
    }
  }), .91);
}
function trafficPaint() {
  return decal(canvasMap(1024,320,(c,w,h)=>{
    const rng=random(806);
    const edge=h*.317, width=h*.365;
    c.fillStyle='#b29152';
    c.fillRect(0,edge,w,width);
    // Fine aggregate survives under the pigment, while tire wear follows the travel direction.
    for(let i=0;i<18500;i++) {
      const x=rng()*w,y=edge+rng()*width;
      c.fillStyle=i%3===0?'#ddbd7560':'#795e303a';
      c.fillRect(x,y,.52+rng()**3*6.2,.61+rng()*1.9);
    }
    c.globalCompositeOperation='destination-out';
    for(let i=0;i<2350;i++){
      const x=rng()*w,y=edge+rng()*width;
      const cross=(y-edge)/width, fade=.35+.65*Math.sin(Math.PI*cross);
      const length=.6+rng()**6*31;
      c.fillStyle='rgba(0,0,0,'+(fade*(.14+rng()*.84))+')';
      c.beginPath();
      c.moveTo(x,y);c.lineTo(x+length*.66,y-.63-rng()*1.6);
      c.lineTo(x+length,y+rng()*.64);c.lineTo(x+length*.41,y+.71+rng()*1.3);c.fill();
    }
    for(let x=1;x<w;x+=1.15){
      c.fillStyle='rgba(0,0,0,.55)';
      c.fillRect(x,edge,1.16,rng()**2*3.9);
      c.fillRect(x,edge+width-rng()**2*3.9,1.20,4.3);
    }
  }),.93);
}
function warningMap() {
  return stencil('HIGH HEAD', { base: '#97874e', ink: '#2b2520', sub: 'ISOLATE BEFORE ENTRY', border: true, aspect: 2.6, seed: 11 });
}
function panelMeter() {
  return decal(canvasMap(256, 256, (c, w, h) => {
    const mid = w / 2, r = .46 * w;
    c.beginPath();
    c.arc(mid, mid, r, 0, Math.PI * 2);
    c.fillStyle = '#b1b6a6';
    c.fill();
    c.lineWidth = 10;
    c.strokeStyle = '#282d2a';
    c.stroke();
    c.strokeStyle = '#323835';
    c.fillStyle = c.strokeStyle;
    c.font = 'bold 17px Consolas';
    c.textAlign = 'center';
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI * (.73 + 1.54 * i / 24), x = Math.cos(a), y = Math.sin(a);
      const size = i % 4 === 0 ? .15 : .08;
      c.lineWidth = i % 4 === 0 ? 3 : 1.5;
      c.beginPath();
      c.moveTo(mid + x * r * .86, mid + y * r * .86);
      c.lineTo(mid + x * r * (.86 - size), mid + y * r * (.86 - size));
      c.stroke();
      if (i % 4 === 0) c.fillText(i * 5, mid + x * r * .56, mid + y * r * .56 + 5);
    }
    c.fillText('BAR', mid, mid + 45);
    c.strokeStyle = '#943d2d';
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(mid, mid);
    c.lineTo(mid + 62, mid - 54);
    c.stroke();
    c.fillStyle = '#28322e';
    c.beginPath();
    c.arc(mid, mid, 8, 0, Math.PI * 2);
    c.fill();
  }), 1, true);
}

function floor(b, m) {
  const z0=-27.81,z1=13.55;
  b.box(m.edge, 0, -.29, (z1 + z0) / 2, 17, .5, z1 - z0 + 1);
  const rng = random(666);
  for (let i = 0; i < 10; i++) {
    const z = 10.7 - i * 3.92;
    for (let j = 0; j < 5; j++) {
      const x = (j - 2) * 3.22;
      const g = boxGeo(3.207, .15, 3.905, .008, 2.18);
      const uv = g.attributes.uv;
      const u = rng() * 8, v = rng() * 8;
      for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) + u, uv.getY(k) + v);
      b.add(g,m.hall.slabs,[x,-.075+rng()*.0025,z],null,false);
    }
  }
  const stain = decal(grimeMap(29), .8);
  const faint = decal(grimeMap(53), .6);
  const line=paintLine(),hallLine=trafficPaint();
  for (let i = 0; i < 13; i++) {
    const z = 10.2 - i * 2.87;
    const material=z<7.2&&z>-20.0?hallLine:line;
    marking(b,material,2.46,.92,-2.65,.006,z,[-Math.PI/2,0,Math.PI/2]);
    marking(b,material,2.46,.92,2.96,.006,z,[-Math.PI/2,0,Math.PI/2]);
  }
  for (let i = 0; i < 42; i++) {
    const x = (rng() - .5) * 15;
    const z = 10.7 - rng() * 38;
    marking(b, i % 2 ? stain : faint, 1 + rng() * 4.8, .78 + rng() * 3, x, .010, z, [-Math.PI / 2, 0, rng() * 6.28]);
  }
  for (const {x, z} of machines) {
    marking(b, stain, 6.1, 7.8, x, .011, z, floorAngle);
  }
  for (const x of [-6.90, 6.92]) {
    b.box(m.black, x, .015, -7, .31, .032, 39, .003);
    for (let i = 0; i < 275; i++) {
      const z = 12.1 - .141 * i;
      b.box(m.iron, x, .036, z, .274, .027, .038, .002, null, false);
    }
  }
  const crossing = stencil('07', { ink: '#c8b785', sub: 'SPILLWAY CLEARANCE', aspect: 2.25, seed: 9 });
  marking(b, crossing, 2.80, 1.52, .1, .013, 6.6, floorAngle);
  const bits = [m.edge, m.rust, m.rubber, m.iron];
  for (let i = 0; i < 370; i++) {
    const x = (rng() - .5) * 14.6, z = 12.2 - rng() * 39;
    if (Math.abs(x) < 2.2 && rng() < .70) continue;
    const r = .021 + rng() ** 3.4 * .18, h = .018 + r * rng() * .6;
    if (i % 9 === 0) {
      b.box(m.iron, x, h * .5, z, r * 1.8, h, r * 2.7, .005, [0, rng() * 6.28, rng() * .09], false);
      continue;
    }
    const chip = new T.IcosahedronGeometry(r, 0).scale(1.0, h / r, .53 + rng());
    b.add(chip, bits[i % 4], [x, h * .45, z], [rng(), rng() * 6.28, .2], false);
  }
}

function safetyRail(b, m, x, y, near, far, step = 1.54) {
  for (const h of [.51, .99]) b.pipe(m.orange, [x, y + h, near], [x, y + h, far], .032, 10);
  for (let z = near; z >= far - .03; z -= step) {
    b.pipe(m.orange, [x, y, z], [x, y + 1.0, z], .036, 8);
    b.box(m.iron, x, y + .015, z, .15, .034, .16);
  }
}

function shell(b, m) {
  const leak1 = decal(grimeMap(17, true), .91);
  const leak2 = decal(grimeMap(36, true), .85);
  b.box(m.hall.concrete,7.84,4.37,-7.3,.34,8.76,41.3,.035);
  b.box(m.hall.concrete,-7.83,2.03,-7.23,.34,4.06,41,.025);
  b.box(m.edge, -7.658, .572, -7.3, .016, 1.14, 40.70, .003);
  b.box(m.wall, -7.83, 8.12, -7.23, .34, 1.24, 41.0, .024);
  b.box(m.edge, -7.81, 4.05, -7.25, .58, .18, 41.0, .028);
  b.box(m.edge, -7.82, 7.50, -7.25, .49, .22, 41.1, .026);
  let prev = 13.7;
  const ribs = [];
  for (const {z, half} of openings) {
    const left = z + half;
    const solid = prev - left;
    b.box(m.wall, -7.82, 5.79, (prev + left) / 2, .40, 3.51, solid + .02, .022);
    ribs.push((prev + left) / 2);
    for (const end of [z - half, z + half]) b.box(m.edge, -7.80, 5.78, end, .66, 3.61, .26, .025);
    b.box(m.iron, -7.93, 5.78, z, .12, 3.45, .061, .009);
    for (const height of [4.32, 5.49, 6.68, 7.39]) b.box(m.iron, -7.91, height, z, .13, .059, half * 2, .009);
    for (const offset of [-.68, .68]) b.box(m.iron, -7.96, 5.79, z + offset, .07, 3.45, .044, .006);
    b.box(m.edge, -7.77, 4.08, z, .79, .11, half * 2 + .38, .016);
    marking(b, leak1, 2.42, 3.98, -7.651, 2.03, z - .44, leftAngle);
    prev = z - half;
  }
  b.box(m.wall, -7.83, 5.78, (prev - 27.8) / 2, .34, 3.52, prev + 27.84, .028);
  ribs.push(-25.6);
  for (let i = 0; i < ribs.length; i++) {
    const z = ribs[i];
    b.box(m.edge, -7.39, 4.45, z, .68, 8.9, .66, .04);
    b.box(m.edge, 7.42, 4.45, z, .77, 8.9, .72, .04);
    for (const x of [-7.39, 7.42]) {
      b.box(m.edge, x, .39, z, .86, .77, .91, .04);
      b.box(m.edge, x, 7.6, z, 1.02, .52, 1.02, .03);
    }
    b.box(m.edge, 0, 8.22, z, 15.85, .7, .63, .035);
    b.box(m.black, 0, 7.91, z + .17, 15.81, .11, .17, .016);
    b.box(m.iron, 0, 8.0, z + .17, 15.78, .21, .048);
    marking(b, leak2, 3.65, 6.9, 7.664, 3.79, z - 1.02, rightAngle);
    if (i % 2 !== 0) continue;
    const digit = stencil('0' + (i + 1), { ink: '#d1c9a8', sub: 'BAY', aspect: 1.18, seed: 9 + i });
    marking(b, digit, .49, .73, -7.042, 2.51, z, leftAngle);
  }
  b.box(m.wall, 5.58, 8.85, -7.4, 5.38, .36, 42, .045);
  b.box(m.wall, -6.94, 8.85, -7.4, 2.43, .37, 42, .04);
  for (const z of [11.8, 6.58, -.2, -7, -13.8, -20.6, -26.8]) {
    b.box(m.iron, -.53, 8.59, z, 11.8, .33, .15, .010);
    b.box(m.rust, -.51, 8.72, z, 11.8, .055, .48, .007);
  }
  for (const x of [-5.60, -3.91, -1.18, 1.48, 3.02]) {
    b.box(m.black, x, 8.73, -7.3, .15, .17, 41.4, .009);
    b.box(m.iron, x + .035, 8.64, -7.3, .23, .043, 41.4, .007);
  }
  for (const z of [10.32, 3.13, -3.68, -16.9, -23.95]) {
    for (let i = 0; i < 9; i++) {
      b.box(m.iron, -.43, 8.95 + (i % 3) * .016, z + (i - 4) * .32, 11.1, .12, .344, .012, [0, 0, i % 2 ? .004 : -.004]);
      b.box(m.rust, -.44, 8.88, z + (i - 4) * .32, 11.15, .046, .034, .007);
    }
  }
  b.box(m.edge, 6.8, 3.72, -7.4, 1.96, .23, 41, .018);
  b.box(m.black, 5.83, 3.72, -7.4, .21, .33, 41.0, .015);
  for (let z = 12.8; z > -27.85; z -= .28) {
    b.box(m.iron, 6.54, 3.867, z, 1.69, .033, .060, .004, null, false);
  }
  safetyRail(b, m, 5.77, 3.84, 12.9, -27.14);
  b.box(m.edge, -7.51, .22, -7.2, .46, .48, 41.0, .02);
  b.box(m.edge, 7.56, .21, -7.2, .44, .47, 41.0, .02);
  for (const x of [-7.37, 7.40]) {
    for (const y of [2.18, 2.33]) b.pipe(m.iron, [x, y, 13], [x, y, -26.7], .035, 8);
    for(let z=12;z>-26.4;z-=1.7){
      const hall=z<7.98&&z>-20.96;
      b.box(m.rust,x,2.25,z,.071,.261,.063,.006);
      if(!hall)continue;
      const wallSide=Math.sign(x),plateX=x+wallSide*.235;
      b.box(m.iron,plateX,2.252,z,.090,.32,.115,.013);
      b.box(m.gunMetal,x+wallSide*.128,2.252,z,.25,.055,.088,.014);
      for(const y of [2.134,2.371]) {
        b.pipe(m.gunMetal,[plateX-wallSide*.051,y,z],[plateX-wallSide*.067,y,z],.026,10);
        b.pipe(m.iron,[plateX-wallSide*.066,y,z],[plateX-wallSide*.088,y,z],.017,7);
      }
    }
  }
  b.tube(m.black, [[-7.35, 7.9, 11], [-5, 7.4, 10], [-2, 6.9, 7.9], [1.3, 7.1, 5.7], [4.1, 7.52, 4.2], [7.25, 7.85, 3.45]], .028, 48, 8);
  b.tube(m.black, [[-7.45, 6.8, -1.6], [-4.5, 6.15, -2.3], [0, 5.99, -4.25], [3.5, 6.45, -6.3], [7.14, 7.68, -7.38]], .021, 52, 8);
}

function collar(b, m, x, y, z, axis, r, h, bolts = 8) {
  const isY = axis === 'y', isX = axis === 'x';
  const start = [x - (isX ? h / 2 : 0), y - (isY ? h / 2 : 0), z - (!isX && !isY ? h / 2 : 0)];
  const end = [x + (isX ? h / 2 : 0), y + (isY ? h / 2 : 0), z + (!isX && !isY ? h / 2 : 0)];
  b.pipe(m.iron, start, end, r, 32);
  for (let i = 0; i < bolts; i++) {
    const a = i * Math.PI * 2 / bolts;
    const u = Math.cos(a) * r * .85, v = Math.sin(a) * r * .85;
    const px = isX ? 0 : u, py = isY ? 0 : isX ? u : v, pz = isY || isX ? v : 0;
    b.pipe(m.rust, [start[0] + px, start[1] + py, start[2] + pz],
      [end[0] + px + (isX ? .035 : 0), end[1] + py + (isY ? .035 : 0), end[2] + pz + (!isX && !isY ? .035 : 0)], r * .077 + .012, 6);
  }
}

function valve(b, m, x, y, z, r, axis = 'z') {
  const rot = axis === 'x' ? [0, Math.PI / 2, 0] : null;
  b.add(new T.TorusGeometry(r, r * .11, 10, 36), m.red, [x, y, z], rot);
  const center = [x, y, z];
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5;
    const u = Math.cos(a) * r * .93, v = Math.sin(a) * r * .93;
    b.pipe(m.red, center, axis === 'x' ? [x, y + v, z + u] : [x + u, y + v, z], r * .055, 10);
  }
  if (axis === 'x') b.pipe(m.iron, [x - .08, y, z], [x + .14, y, z], r * .26, 14);
  else b.pipe(m.iron, [x, y, z - .08], [x, y, z + .14], r * .26, 14);
}

function machinery(b, m) {
  const gauge = panelMeter(), notice = warningMap();
  for (let i = 0; i < machines.length; i++) {
    const { x, z } = machines[i];
    b.box(m.edge, x + .28, .155, z, 3.40, .31, 4.89, .061);
    b.box(m.iron, x + .26, .34, z, 2.92, .14, 3.96, .037);
    for (const side of [-1, 1]) {
      b.box(m.green, x, .53, z + side * 1.04, 2.75, .4, .37, .065);
      b.box(m.iron, x, .73, z + side * 1.04, 2.66, .05, .37, .021);
    }
    const y = 1.51;
    const casing = i === 1 ? m.blue : m.green;
    b.pipe(casing, [x - 1.27, y, z], [x + 1.58, y, z], 1.02, 56);
    b.pipe(m.hall.flange,[x-1.52,y,z],[x-1.32,y,z],.93,72,1.03);
    b.pipe(m.gunMetal,[x-1.535,y,z],[x-1.519,y,z],.927,72);
    b.pipe(m.hall.flange,[x-1.554,y,z],[x-1.534,y,z],.900,72);
    b.pipe(m.black,[x-1.569,y,z],[x-1.552,y,z],.717,56);
    b.pipe(m.iron,[x-1.583,y,z],[x-1.568,y,z],.655,56);
    b.pipe(m.black, [x - 1.57, y, z], [x - 1.50, y, z], .72, 44);
    b.pipe(m.iron, [x - 1.62, y, z], [x - 1.54, y, z], .57, 44);
    b.pipe(m.hall.caps,[x-1.70,y,z],[x-1.61,y,z],.42,64,.53);
    for(const [rx,rr] of [[-1.698,.420],[-1.613,.530],[-1.575,.652],[-1.544,.913]])
      b.add(new T.TorusGeometry(rr,.005,6,68),m.gunMetal,[x+rx,y,z],[0,Math.PI/2,0]);
    collar(b, m, x - 1.3, y, z, 'x', 1.045, .095, 12);
    collar(b, m, x + .98, y, z, 'x', 1.018, .076, 12);
    for (let j = 0; j < 20; j++) {
      const a = j * Math.PI / 10;
      const yy = y + Math.sin(a) * 1.035;
      const zz = z + Math.cos(a) * 1.035;
      b.box(j % 5 === 0 ? m.iron : casing, x - .16, yy, zz, 2.27, .089, .14, .018, [-a, 0, 0]);
    }
    coatedPart(b,m.hall.paint,x-.10,2.64,z,1.42,.40,1.35,.061,i*2.41+.72,.42);
    for(const dz of [-.53,.53]) {
      const at=z+dz;
      b.box(m.gunMetal,x-.647,2.572,at,.301,.064,.156,.019);
      b.pipe(m.iron,[x-.712,2.59,at],[x-.712,2.638,at],.042,11);
    }
    const junction=x-.72;
    b.box(m.black,junction,2.723,z+.45,.131,.168,.191,.012);
    for(const zz of [-.050,.050]) {
      b.pipe(m.gunMetal,[junction-.067,2.726,z+.45+zz],[junction-.087,2.726,z+.45+zz],.025,10);
      const mount=z+.57+zz;
      b.tube(m.rubber,[[junction-.086,2.726,z+.45+zz],[junction-.141,2.680,z+.526+zz],
        [junction-.105,2.563,mount],[junction-.001,2.437,mount]],.010,22,8);
      b.pipe(m.gunMetal,[junction,2.413,mount],[junction,2.457,mount],.025,10);
    }
    b.box(m.iron, x - .1, 2.85, z, 1.49, .075, 1.42, .024);
    b.box(m.black, x - .54, 2.9, z - .43, .22, .057, .22, .014);
    b.box(m.cold, x - .54, 2.934, z - .43, .13, .018, .105, .005);
    marking(b, notice, .92, .35, x - .812, 2.64, z, rightAngle);
    const id = stencil('P-' + (i + 4), { ink: '#c8bc96', sub: 'DRIVE UNIT', aspect: 2.55, seed: 33 + i });
    marking(b, id, .94, .39, x - 1.704, y + .018, z, rightAngle);
    b.tube(m.rust, [[x + .64, .44, z + 1.16], [x - .66, .42, z + 1.22], [x - 1.10, .63, z + 1.42], [x - 1.19, 1.28, z + 1.43], [x -.91, 1.66, z + 1.44], [x + .16, 1.86, z + 1.50]], .102, 32, 14);
    b.pipe(m.black, [x - 1.21, .36, z + 1.43], [x - 1.21, .94, z + 1.43], .155, 18);
    collar(b, m, x - 1.21, .72, z + 1.43, 'y', .18, .064, 6);
    b.pipe(m.iron, [x - 1.18, 1.34, z + 1.43], [x - 1.42, 1.34, z + 1.43], .096, 16);
    valve(b, m, x - 1.47, 1.34, z + 1.43, .26, 'x');
    for (let j = 0; j < 2; j++) {
      const zz = z + 1.38 + j * .37, yy = 1.91 + j * .19;
      b.pipe(m.iron, [x + .45, yy, zz], [x + .08, yy, zz], .15, 22);
      marking(b, gauge, .276, .276, x + .076, yy, zz, rightAngle);
    }
    b.tube(m.iron, [[x + 1.24, 1.7, z - .12], [x + 1.55, 2.12, z - .12], [x + 1.57, 3.09, z - .2], [x + 1.57, 4.78, z - .14], [x + 1.28, 5.58, z - .21], [x + .8, 6.04, z - .56], [x + .41, 6.12, z - 1.3]], .38, 42, 24);
    collar(b, m, x + 1.55, 2.97, z - .19, 'y', .48, .15);
    collar(b, m, x + 1.57, 4.68, z - .155, 'y', .47, .15);
    b.tube(m.black, [[x -.44, 2.84, z + .63], [x -.27, 3.13, z + 1.16], [x + .33, 2.84, z + 1.72], [x + 1.15, 1.54, z + 2.04], [x + 1.44, .43, z + 2.11]], .037, 33, 9);
  }
  for (const [i, r] of [.56, .25, .18].entries()) {
    const x = 6.37 + i * .46, y = 6.10 + i * .62;
    b.pipe(i === 0 ? m.green : m.iron, [x, y, 13], [x, y, -26.3], r, 34);
    for (let z = 11.4; z > -27; z -= 4.68) {
      collar(b, m, x, y, z, 'z', r * 1.19 + .036, .14);
      b.box(m.iron, x, y + (8.59 - y) / 2, z + .46, .095, 8.65 - y, .14, .008);
    }
  }
  for (const [i, z] of [9.4, 1, -7.5, -16, -23.2].entries()) {
    const y = i === 0 ? 1.40 : 2.89;
    b.box(m.green, -7.48, y, z, .39, .89, .71, .031);
    b.box(m.cream, -7.255, y, z, .095, .82, .63, .018);
    b.box(m.black, -7.201, y + .13, z, .034, .28, .40, .010);
    b.box(m.greenLamp, -7.177, y + .19, z - .09, .014, .037, .065);
    b.box(m.redLamp, -7.177, y + .19, z + .09, .014, .037, .065);
    b.pipe(m.iron, [-7.44, Math.min(.4, y - .9), z - .17], [-7.44, y - .39, z - .17], .026, 9);
    if (i === 0) marking(b, notice, .88, .34, -7.172, y - .14, z, leftAngle);
  }
}

function cargo(b, m) {
  const marks = [
    stencil('C-17', { ink: '#d6ceab', sub: 'NORTH CAPE / PUMP COMPONENTS', aspect: 2.85 }),
    stencil('07', { ink: '#d8c68e', sub: 'EMERGENCY KIT', aspect: 2.15, seed: 18 }),
    stencil('KEEP DRY', { ink: '#372e25', base: '#bdad80', aspect: 3.9, seed: 40 })
  ];
  for (const [i, c] of crates.entries()) {
    const {x, z, w, h, d, yaw} = c;
    const py = c.y || 0;
    const y = py + h * .5;
    const isCrate = c.type === 'cargo';
    const body = isCrate ? (i % 4 ? m.olive : m.orange) : (i % 3 ? m.green : m.blue);
    const rim = isCrate ? m.iron : m.black;
    const at = (u, v, s) => [x + Math.cos(yaw) * u + Math.sin(yaw) * s, y + v, z - Math.sin(yaw) * u + Math.cos(yaw) * s];
    const box = (mat, u, v, s, a, j, k, round = .024) => b.box(mat, ...at(u, v, s), a, j, k, round, [0, yaw, 0]);
    box(body, 0, 0, 0, w - .06, h - .072, d - .06, .045);
    for (const v of [-h * .46, h * .46]) {
      box(rim, 0, v, 0, w + .018, .075, d + .024);
      box(body, 0, v * .89, 0, w - .03, .035, d + .033, .012);
    }
    for (const u of [-w * .48, w * .48]) {
      for (const s of [-d * .459, d * .459]) box(rim, u, 0, s, .075, h * .86, .086, .012);
    }
    for (const s of [-1, 1]) {
      for (let j = 1; j <= 5; j++) {
        const u = -w * .5 + w * j / 6;
        box(body, u, -h * .08, s * d * .475, .07, h * .64, .067, .012);
      }
      for (const u of [-w * .29, w * .29]) {
        box(m.black, u, h * .355, s * d * .505, .135, .151, .05, .014);
        box(m.silver, u, h * .341, s * d * .534, .085, .102, .023, .008);
        box(m.iron, u, h * .289, s * d * .54, .136, .027, .046, .006);
      }
    }
    const front = at(0, 0, d * .512);
    const side = at(w * .513, 0, 0);
    marking(b, marks[isCrate ? 0 : 1], w * .56, h * .34, ...front, [0, yaw, 0]);
    marking(b, marks[2], d * .40, h * .18, ...side, [0, yaw + Math.PI / 2, 0]);
  }
  const rng = random(214);
  for (const [x, z] of [[-6.4, 9.0], [-6.24, 8.23], [-5.45, -5.58], [-6.32, -5.37], [-6.43, -19.0], [6.70, -23.0]]) {
    const r = .25 + rng() * .08, h = .78 + rng() * .16;
    const color = rng() < .6 ? m.red : m.blue;
    b.pipe(color, [x, .035, z], [x, h, z], r, 32);
    for (const y of [.062, h * .267, h * .738, h - .044]) b.pipe(y > h * .9 ? m.iron : color, [x, y - .025, z], [x, y + .025, z], r + .019, 32);
    b.pipe(m.iron, [x - r * .4, h, z], [x - r * .4, h + .034, z], .044, 10);
  }
  b.tube(m.rubber, [[-7.23,.07,8.23],[-6.8,.058,7.9],[-5.3,.052,7.42],[-4.36,.051,8.08],[-4.62,.06,8.73],[-5.48,.058,8.55],[-6.08,.056,8.09],[-5.62,.055,7.28],[-4.37,.052,6.96],[-3.32,.052,6.81]], .021, 62, 8, false);
  b.tube(m.rubber, [[6.62,.09,-21.08],[5.4,.06,-20.7],[4.41,.045,-21.24],[3.82,.056,-22.03],[3.21,.06,-22.77],[2.65,.12,-23.39]], .025, 38, 8, false);
}

function gate(scene, b, m) {
  const z = -27.43;
  for (const x of [-6.18, 6.18]) {
    if(x<0) b.box(m.cast, x, 4.38, z, 3.38, 8.80, .78, .044);
    else {
      b.box(m.cast, 4.78, 4.38, z, .58, 8.80, .78, .044);
      b.box(m.cast, 7.70, 4.38, z, .44, 8.80, .78, .044);
      b.box(m.cast, 6.27, 5.94, z, 2.43, 5.68, .78, .044);
    }
    b.box(m.edge, x > 0 ? 4.42 : -4.42, 3.7, z + .27, .67, 7.41, 1.12, .047);
    b.box(m.iron, x > 0 ? 4.11 : -4.11, 3.23, z + .4, .19, 6.47, .81, .047);
  }
  b.box(m.cast, 0, 7.87, z, 9.0, 2.03, .84, .04);
  b.box(m.edge, 0, 6.78, z + .27, 9.70, .72, 1.19, .042);
  b.box(m.rust, 0, 6.38, z + .46, 8.61, .20, .59, .018);
  b.box(m.iron, 0, 6.27, z + .48, 8.43, .084, .67, .012);
  for (const x of [-3.64, 3.64]) {
    b.pipe(m.iron, [x, 5.7, z + .74], [x, 8.4, z + .74], .18, 24);
    b.pipe(m.rust, [x, 5.86, z + .74], [x, 7.12, z + .74], .27, 22);
    collar(b, m, x, 6.65, z + .74, 'y', .33, .155);
  }

  // Gland, rigid lines and bolted guides terminate at the existing actuator housings.
  for(const x of [-3.64,3.64]) {
    const side=Math.sign(x);
    for(const [y,r,h] of [[5.89,.229,.104],[6.08,.275,.16],[6.52,.315,.11],[7.33,.233,.105]]) {
      collar(b,m,x,y,z+.748,'y',r,h,10);
      b.pipe(m.black,[x,y+h*.47,z+.748],[x,y+h*.58,z+.748],r*.90,22);
    }
    for(const shift of [-.085,.090]) {
      b.tube(shift<0?m.bronze:m.iron,[
        [x+side*.21,6.33+shift,z+.75],[x+side*.51,6.36+shift,z+.85],
        [x+side*.79,6.50+shift,z+1.09],[x+side*.82,6.74+shift,z+1.23],
        [x+side*.82,6.75+shift,z+2.04]
      ],.029,24,9);
    }
    for(const y of [.54,1.84,3.17,4.49,5.81]) {
      const xx=side*4.17;
      b.box(m.black,xx,y,z+.842,.238,.316,.19,.023);
      b.box(m.iron,xx,y,z+.951,.262,.302,.108,.016);
      for(const dx of [-.078,.078])for(const dy of [-.093,.093])
        b.pipe(m.gunMetal,[xx+dx,y+dy,z+.996],[xx+dx,y+dy,z+1.026],.022,8);
    }
  }

  const slab = new T.Group();
  slab.position.z = z + .18;
  scene.add(slab);
  const s = batches(slab);
  s.box(m.black,0,3.1,-.044,8.03,6.2,.31,.041);
  const courses=[.33,.48,1.59,2.62,3.68,4.90,5.88,6.17];
  for(let i=1;i<courses.length;i++) {
    const low=courses[i-1],high=courses[i];
    for(let j=0;j<6;j++) {
      const x=(j-2.5)*1.335;
      coatedPart(s,m.doorGreen,x,(low+high)*.5,.139,1.328,high-low-.012,.151,.012,i*9.23+j*2.39);
    }
  }
  s.box(m.iron,0,.13,.24,8.07,.25,.15,.018);
  s.box(m.black,0,.056,.230,8.005,.089,.178,.014);
  s.box(m.rubber,0,.030,.177,7.98,.059,.067,.011);
  for(let x=-3.85;x<3.93;x+=.322)
    s.pipe(m.gunMetal,[x,.142,.316],[x,.142,.341],.022,8,.022,false);
  for (let x = -3.73; x <= 3.75; x += .677) {
    s.box(m.black, x, 3.08, .21, .034, 6.09, .031, .005);
    s.box(m.iron, x + .055, 3.1, .267, .073, 6.11, .12, .012);
  }
  for (const y of [.48, 1.59, 2.62, 3.68, 4.90, 5.88]) {
    coatedPart(s,m.doorGreen,0,y,.302,8.01,.145,.19,.024,y*2.49,.22);
    s.box(m.iron,0,y-.064,.336,7.99,.025,.13,.007);
    for(const xx of [-3.60,-2.0,-.66,.66,2.0,3.60])
      s.box(m.gunMetal,xx,y+.072,.273,.129,.022,.09,.008,undefined,false);
    for (let x = -3.89; x <= 3.93; x += .298) {
      s.pipe(m.iron, [x, y, .386], [x, y, .423], .027, 7);
    }
  }
  for (const x of [-3.53, 3.53]) {
    s.box(m.rust, x, 3.072, .43, .22, 5.84, .26, .023);
    s.box(m.iron, x, 3.072, .585, .30, 5.85, .09, .017);
  }
  coatedPart(s,m.doorGreen,0,4.20,.354,2.75,1.86,.122,.038,34.72,.6);
  const id = stencil('07', { ink: '#d7c6a0', sub: 'NORTH CAPE / SPILLWAY', aspect: 2.07, seed: 47 });
  marking(s, id, 2.42, 1.40, 0, 4.23, .426);
  const rams=[];
  for(const x of [-3.64,3.64]) {
    s.box(m.iron,x,4.96,.55,.49,.55,.33,.041);
    s.pipe(m.iron,[x-.261,4.97,.68],[x+.261,4.97,.68],.109,20);
    s.pipe(m.gunMetal,[x-.273,4.97,.68],[x+.273,4.97,.68],.077,16);
    const rod=place(scene,new T.CylinderGeometry(.084,.084,1,26),m.silver,x,5.72,z+.85);
    rod.castShadow=true;
    rams.push(rod);
  }
  s.finish();
  function liftGate(amount) {
    slab.position.y=amount;
    for(const rod of rams) {
      const end=amount+4.97, gland=6.08;
      rod.visible=end<gland;
      rod.position.y=(end+gland)*.5;
      rod.scale.y=Math.max(.001,gland-end);
    }
  }

  const { x, z: pz } = gatePanel;
  b.box(m.edge, x, .13, pz, 1.13, .27, 1.03, .054);
  b.box(m.iron, x, .72, pz, .37, 1.24, .44, .034);
  coatedPart(b,m.cabinetCoat,x,1.29,pz,.77,.57,.47,.054,13.57);
  b.box(m.iron,x,1.37,pz+.227,.683,.395,.065,.021);
  b.box(m.black, x, 1.37, pz + .264, .593, .329, .044, .015);
  b.box(m.gunMetal,x+.267,1.377,pz+.289,.040,.294,.031,.009);
  for(const side of [-1,1])for(let v=0;v<7;v++) {
    const zz=pz+(v-3)*.042;
    b.box(m.black,x+side*.384,1.235,zz,.013,.109,.015,.004,undefined,false);
  }
  const screen=terminalScreen('SPILLWAY 07',{locked:'INTERLOCK',ready:'ARMED',running:'RELEASING',flow:'AUTO / FLOW'});
  b.box(m.iron,x-.142,1.413,pz+.290,.263,.199,.035,.009);
  b.box(m.black,x-.142,1.413,pz+.311,.244,.182,.015,.008);
  marking(b,screen.material,.219,.153,x-.142,1.415,pz+.320);
  for(const dx of [-.238,-.050]) for(const yy of [1.331,1.497])
    b.pipe(m.gunMetal,[x+dx,yy,pz+.320],[x+dx,yy,pz+.330],.009,8,.009,false);
  const leverX=x+.119,leverY=1.310,leverZ=pz+.362;
  b.box(m.cream,leverX,1.397,pz+.294,.218,.184,.032,.009);
  b.box(m.black,leverX,1.381,pz+.313,.096,.123,.024,.009);
  marking(b,stencil('GATE',{ink:'#24261f',aspect:3.9}),.183,.045,leverX,1.510,pz+.305);
  for(const side of [-1,1]) {
    const sx=leverX+side*.081;
    b.box(m.rust,sx,1.361,pz+.346,.038,.132,.077,.007);
    b.pipe(m.iron,[sx,1.424,pz+.349],[sx,1.292,pz+.349],.021,10);
    b.pipe(m.silver,[sx,1.431,pz+.318],[sx,1.431,pz+.334],.008,8,.008,false);
    b.pipe(m.silver,[sx,1.298,pz+.318],[sx,1.298,pz+.334],.008,8,.008,false);
  }
  b.pipe(m.iron,[leverX-.072,leverY,leverZ],[leverX+.072,leverY,leverZ],.027,18);
  const lever=new T.Group();
  lever.position.set(leverX,leverY,leverZ);
  scene.add(lever);
  const lb=batches(lever);
  lb.pipe(m.gunMetal,[0,.008,0],[0,.106,.083],.019,14);
  lb.pipe(m.iron,[-.071,.106,.086],[.071,.106,.086],.018,16);
  lb.pipe(m.orange,[-.061,.106,.086],[.061,.106,.086],.028,22);
  for(let i=-4;i<=4;i++)
    lb.pipe(m.rubber,[i*.012-.0014,.106,.086],[i*.012+.0014,.106,.086],.0285,18,.0285,false);
  lb.finish();
  const gateGrip=new T.Object3D();
  gateGrip.position.set(-.013,.107,.100);
  lever.add(gateGrip);
  for(const xx of [x-.288,x+.287]) for(const yy of [1.22,1.513])
    b.pipe(m.silver,[xx,yy,pz+.265],[xx,yy,pz+.285],.017,8,.017,false);
  b.box(m.iron,x,1.104,pz+.177,.77,.030,.104,.010);
  b.box(m.black,x+.215,1.282,pz+.272,.031,.115,.043,.008);
  b.pipe(m.iron,[x+.227,1.228,pz+.303],[x+.227,1.336,pz+.303],.013,9);
  b.tube(m.rubber,[[x+.24,1.061,pz-.03],[x+.24,.67,pz-.10],[x+.30,.195,pz-.16],[x+.41,.09,pz-.29]],.024,22,10);
  b.tube(m.iron,[[x-.22,1.06,pz-.07],[x-.21,.29,pz-.08],[x-.20,.14,pz-.14],[x-.32,.134,pz-.19]],.021,18,10);
  b.pipe(m.iron, [x, 1.59, pz], [x, 1.65, pz], .079, 16);
  b.pipe(m.gunMetal,[x,1.632,pz],[x,1.676,pz],.072,20);
  b.pipe(m.iron,[x,1.676,pz],[x,1.698,pz],.065,20);
  const lamp = place(scene,cylGeo(.028,.039,24),m.redLamp,x,1.717,pz);
  const lens=new T.MeshPhysicalMaterial({color:0xbacabb,roughness:.31,metalness:.12,
    transparent:true,opacity:.27,depthWrite:false,clearcoat:.44});
  b.pipe(lens,[x,1.685,pz],[x,1.756,pz],.052,28,.061);
  b.pipe(m.gunMetal,[x,1.753,pz],[x,1.769,pz],.054,24,.056);
  for(let i=0;i<6;i++) {
    const angle=i*Math.PI/3,dx=Math.cos(angle)*.054,dz=Math.sin(angle)*.054;
    b.pipe(m.iron,[x+dx*1.15,1.689,pz+dz*1.15],[x+dx*.94,1.760,pz+dz*.94],.0035,7);
  }
  const lampLight = new T.PointLight(0xff6730, 6, 2.7, 2);
  lampLight.position.set(x, 1.79, pz + .20);
  scene.add(lampLight);
  function updateGate(run,state) {
    liftGate(state.lift*6.25);
    const pull=run.gateAt?1:run.action==='gate'?T.MathUtils.smoothstep(run.actionTime/gatePanel.hold,.28,.98):0;
    lever.rotation.x=T.MathUtils.lerp(-.56,1.00,pull);
    const releasing=run.gateAt&&!run.relief;
    const available=run.relayOn&&!releasing;
    lamp.material=releasing?m.amber:available?m.greenLamp:m.redLamp;
    lampLight.color.setHex(releasing?0xffab55:available?0x67e5b2:0xff6730);
    lampLight.intensity=releasing?3.35:available?1.92:2.26;
    screen.update(run.relief?'flow':releasing?'running':available?'ready':'locked');
  }
  return { slab, updateGate, gateGrip };
}

function lamps(scene, b, m) {
  for (const [i, [x, y, z]] of muzzleLights.entries()) {
    const side = i < 3;
    b.box(m.black, x, y + .10, z, .32, .31, .56, .033);
    if (side) {
      b.box(m.green, x - .22, y + .06, z, .57, .12, .47, .018);
      b.box(m.hot, x + .044, y - .08, z, .119, .045, .38, .015);
      for (let j = -1; j <= 1; j++) b.box(m.iron, x + .04, y - .108, z + j * .148, .158, .053, .022, .007);
    } else {
      b.box(m.iron, x, y, z + .1, .27, .46, .24, .029);
      b.box(m.hot, x, y, z + .232, .125, .32, .023, .013);
      for (let j = -1; j <= 1; j++) b.box(m.iron, x, y + j * .126, z + .247, .23, .020, .022, .004);
    }
    const l = new T.PointLight(i === 1 ? 0xff9a56 : 0xffa36b, i < 3 ? 77 : 137, 14, 2);
    l.position.set(x + (side ? .27 : 0), y - .13, z + (side ? 0 : .31));
    scene.add(l);
  }
  for (const [x, y, z] of [[-.15, 5.7, 10.48], [.6, 6.3, -4.02], [-.2, 6.65, -18.12]]) {
    b.pipe(m.black, [x, y, z], [x, 8.3, z], .024, 8);
    b.pipe(m.black, [x, y, z - .17], [x, y + .25, z - .17], .13, 16, .21);
    b.pipe(m.green, [x, y - .042, z - .17], [x, y + .11, z - .17], .22, 20, .31);
    b.pipe(m.hot, [x, y - .057, z - .17], [x, y - .045, z - .17], .172, 20);
    const l = new T.PointLight(0xffc692, 48, 10, 2);
    l.position.set(x, y - .22, z - .17);
    scene.add(l);
  }
  const cold = new T.PointLight(0x93c9ef, 21, 11, 2);
  cold.position.set(.3, 2.58, 10.99);
  scene.add(cold);
}

function canvasCover(b, m) {
  const c = crates[2];
  const rows = 25, columns = 49, vertices = [], indices = [], uv = [];
  for (let i = 0; i <= columns; i++) {
    const u = i / columns;
    for (let j = 0; j <= rows; j++) {
      const w = j / rows;
      const wave = Math.sin(w * 41 + u * 6.2) * .025 + Math.sin(w * 19 - u * 3) * .052;
      const sag = Math.max(0,(u-.57)/.43);
      const over = Math.min(1,u/.57);
      const x = c.x + (over-.49) * c.w + sag * .084 + wave * sag;
      const z = c.z + (w-.49) * (c.d * .88 + sag*.28) + .031 * Math.sin(w*26+u*2.9);
      const trim = 1 + .085 * Math.sin(w * 49) + .070 * Math.sin(w * 71) + .12 * Math.cos(w*9.1);
      const y = c.h + .024 + (1-sag) * (.024 + wave*.38) - sag * .71 * trim;
      vertices.push(x,y,z);
      uv.push(u * 2.5,w * 1.7);
      if (i && j) {
        const a = (i - 1) * (rows + 1) + j - 1;
        const k = a + rows + 1;
        indices.push(a,a+1,k,k,a+1,k+1);
      }
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const tarp = m.cloth.clone();
  tarp.color.setHex(0x8e9f94);
  tarp.side = T.DoubleSide;
  b.add(geometry,tarp);
  for (const zz of [-.39,.47]) {
    b.tube(m.rubber,[[c.x+c.w*.52,c.h-.19,c.z+zz],[c.x+c.w*.52,c.h-.43,c.z+zz-.045],
      [c.x+c.w*.479,c.h-.77,c.z+zz+.13],[c.x+c.w*.50,c.h-.98,c.z+zz+.1]],.008,18,7);
  }
}

function pressureHeader(b, m) {
  const x = -6.87;
  const z = 8.93;
  b.tube(m.olive, [[-7.79,.63,z],[-7.24,.64,z],[x,.79,z],[x,1.22,z],[x,2.18,z],[x,2.64,z-.10],[x,2.91,z-.55],[x,2.93,z-1.2]], .242, 41, 30);
  b.pipe(m.olive,[x,2.93,z-1.2],[x,2.93,-19.3],.242,30);
  for (const yy of [1.04,1.58,2.20]) collar(b,m,x,yy,z,'y',.315,.124,8);
  for (let t = 6.6; t >= -18.6; t -= 3.65) {
    collar(b,m,x,2.93,t,'z',.311,.104,8);
    b.box(m.iron,x-.32,2.909,t+.33,.85,.082,.175,.014);
    b.box(m.iron,-7.574,2.903,t+.33,.09,.38,.28,.015);
  }
  b.pipe(m.bronze,[x,1.60,z],[x+.44,1.60,z],.081,18);
  b.pipe(m.rust,[x+.13,1.60,z],[x+.28,1.60,z],.114,12);
  valve(b,m,x+.49,1.60,z,.29,'x');
  b.pipe(m.rust,[x-.012,2.19,z],[x+.17,2.18,z+.004],.093,16);
  b.pipe(m.iron,[x+.165,2.18,z],[x+.235,2.18,z],.137,26);
  marking(b,panelMeter(),.249,.249,x+.238,2.18,z,leftAngle);
  const label = stencil('17.5 MPa', { ink:'#c6bb8e', sub:'PRESSURE HEADER', border:true, aspect:2.53, seed:108 });
  b.box(m.iron,-7.601,1.89,8.62,.062,.412,1.03,.021);
  marking(b,label,.98,.389,-7.567,1.89,8.62,leftAngle);

  for (const x of [-2.85,3.68]) {
    b.box(m.orange,x,6.92,-8.75,.221,.42,36.15,.021);
    b.box(m.iron,x,6.683,-8.75,.316,.090,36.18,.014);
    for (const z of [7.51,.31,-6.82,-13.75,-20.72,-26.25]) {
      b.box(m.iron,x,7.83,z,.127,1.81,.123,.01);
      b.box(m.black,x,7.05,z,.292,.24,.36,.017);
    }
  }
  const gz = -12.80;
  b.box(m.orange,.39,6.52,gz,7.05,.421,.74,.032);
  b.box(m.iron,.39,6.28,gz,.63,.099,.79,.019);
  b.box(m.green,.51,6.23,gz+.27,1.27,.421,.47,.037);
  b.box(m.rust,.51,6.02,gz+.30,.68,.14,.46,.018);
  b.pipe(m.iron,[.53,6.04,gz+.31],[.53,5.14,gz+.3],.020,8);
  b.pipe(m.black,[.53,5.26,gz+.30],[.53,5.12,gz+.3],.071,12);
  b.add(new T.TorusGeometry(.11,.028,9,22),m.orange,[.53,5.01,gz+.3],[0,.1,0]);
  marking(b,stencil('SWL 5T',{base:'#ad9456',ink:'#342e23',aspect:3.2,seed:19}),1.42,.36,2.19,6.53,gz+.372);
}

export async function buildStation(scene, m, nextPaint) {
  const b=batches(scene);
  m={...m,hall:makeHallFinishes(m)};
  floor(b,m);
  shell(b, m);
  await nextPaint();
  machinery(b, m);
  cargo(b, m);
  canvasCover(b, m);
  lamps(scene, b, m);
  pressureHeader(b, m);
  await nextPaint();
  const exit = gate(scene, b, m);
  const controls = buildStructures(scene,b,m);
  const transitions = buildTransitions(scene,b,m);
  const plant = buildPlant(scene,b,m);
  await b.finishAsync(nextPaint);
  return { ...exit, controls, transitions, plant };
}

