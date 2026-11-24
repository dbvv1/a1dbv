import { CatmullRomCurve3, Vector3 } from 'three';

export const roadHalf = 4.45;
export const railOffset = 5.75;
export const wrap = (n, period) => ((n % period) + period) % period;
export const clamp = (n, low, high) => Math.min(high, Math.max(low, n));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, n) => { const x = clamp((n - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
export const angle = n => wrap(n + Math.PI, Math.PI * 2) - Math.PI;

const control = [
  [0,114,21], [-5,70,21], [-23,28,19], [-28,-8,16], [-12,-41,11],
  [-16,-73,7], [-41,-104,6], [-59,-139,7], [-58,-163,8], [-40,-174,9],
  [-23,-161,10], [-19,-137,12], [-8,-112,16], [24,-99,21], [57,-81,27],
  [77,-49,30], [80,-4,32], [75,43,33], [82,91,31], [66,135,27],
  [35,158,24], [11,149,22]
];
const build = scale => new CatmullRomCurve3(control.map(([x,z,y]) => new Vector3(x * scale, y, z * scale)), true, 'centripetal');
const curve = build(1010 / build(1).getLength());
curve.arcLengthDivisions = 4200;
curve.updateArcLengths();
export const length = curve.getLength();
const N = Math.ceil(length);
const samples = Array.from({length:N}, (_,i) => curve.getPointAt(i/N));
const iter = length/N;
const cell = 16;
const grid = new Map();
for (let i=0;i<N;i++) {
  const p = samples[i];
  const key = `${Math.floor(p.x/cell)},${Math.floor(p.z/cell)}`;
  if (!grid.has(key)) grid.set(key, []);
  grid.get(key).push(i);
}

export function frame(s) {
  const at = wrap(s, length) / iter;
  const index = Math.floor(at);
  const a = samples[index];
  const b = samples[(index+1)%N];
  const t = at-index;
  const tx = b.x-a.x, tz = b.z-a.z;
  const m = Math.hypot(tx,tz);
  return { x:lerp(a.x,b.x,t), y:lerp(a.y,b.y,t), z:lerp(a.z,b.z,t), tx:tx/m, tz:tz/m,
    nx:tz/m, nz:-tx/m, grade:(b.y-a.y)/m, s:wrap(s,length) };
}

export function roadHeight(y,d) {
  return y - Math.min(Math.abs(d), roadHalf) * .024 - Math.max(0, Math.abs(d)-roadHalf)*.065;
}

export function roadPoint(s,d=0,h=0) {
  const p = frame(s);
  return new Vector3(p.x+p.nx*d,roadHeight(p.y,d)+h,p.z+p.nz*d);
}

export function nearest(x,z,wide=false) {
  let best = Infinity, sample = 0, fraction = 0;
  function examine(i) {
    const a=samples[i], b=samples[(i+1)%N];
    const dx=b.x-a.x, dz=b.z-a.z;
    const t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1);
    const dist=(x-a.x-dx*t)**2+(z-a.z-dz*t)**2;
    if (dist < best) { best=dist; sample=i; fraction=t; }
  }
  const cx=Math.floor(x/cell), cz=Math.floor(z/cell);
  for(let dz=-1;dz<=1;dz++) for(let dx=-1;dx<=1;dx++) {
    const list=grid.get(`${cx+dx},${cz+dz}`);
    if(list) for(const i of list) examine(i);
  }
  if (wide && best>15**2) for(let i=0;i<N;i+=5) examine(i);
  if (wide && best>15**2) {
    const around=sample;
    for(let i=-5;i<=5;i++) examine(wrap(around+i,N));
  }
  if (!Number.isFinite(best)) return null;
  const p=frame((sample+fraction)*iter);
  p.d=(x-p.x)*p.nx+(z-p.z)*p.nz;
  p.distance=Math.sqrt(best);
  p.height=roadHeight(p.y,p.d);
  return p;
}

export function curvature(s, spacing=4) {
  const a=frame(s-spacing), b=frame(s+spacing);
  return angle(Math.atan2(b.tx,b.tz)-Math.atan2(a.tx,a.tz))/(2*spacing);
}

export const course = {
  start: 6, sectors: [.25,.50,.75].map(f=>f*length),
  hairpin: control.slice(0,10).reduce((s,p,i,a)=>i?s+Math.hypot(p[0]-a[i-1][0],p[1]-a[i-1][1]):0,0) * length / build(1).getLength()
};

export const surface = {
  sample: (x,z) => {
    const p=nearest(x,z);
    if(!p) return {height:0, grip:.6, grade:0};
    return {height:p.height, grip:lerp(1,.67,smooth(roadHalf-.1,roadHalf+.55,Math.abs(p.d))), grade:p.grade,
      tx:p.tx,tz:p.tz};
  },
  nearest
};
