export const bounds = { x0: -7.65, x1: 7.65, z0: -35.18, z1: 23.92 };
export const spawn = { x: -1.42, z: 22.45, yaw: -.081, pitch: .018 };
export const checkpointSpawn = { x: -1.20, z: 11.72, yaw: -.052, pitch: .009 };
export const entry = { id:'entry', x:-3.02, y:1.34, z:14.31, range:1.68, hold:.70 };
export const overlook = { id:'overlook', x:6.20, y:1.32, z:-34.38, range:1.85, hold:.52 };
export const threshold = { x0:-2.49, x1:.29, y:3.16, z0:12.97, z1:13.54, travel:3.32 };
export const bulkhead = { x0:-3.58, x1:.64, y:3.68, z0:-21.52, z1:-21.04, travel:3.85 };
export const catwalk = { x0:5.07, x1:7.48, z0:-35.22, z1:-26.87 };
export const accessWalk = { x0:-4.62, x1:3.50, z0:13.57, z1:24.08 };
export const walkout = { x0:catwalk.x0, x1:catwalk.x1, y:3.10, z0:-27.72, z1:-27.08, travel:3.15 };
export const doors = [threshold,bulkhead,walkout];
export const gatePanel = { id: 'gate', x: 2.72, y: 1.52, z: -23.4, range: 1.86, hold: .72 };
export const relay = { id: 'relay', x: -5.02, y: 1.72, z: -17.40, range: 1.86, hold: 1.24 };
export const cache = { id: 'cache', x: -5.13, y: 1.01, z: -.30, range: 1.71, hold: .32 };
export const portal = { x0: -3.18, x1: .82, y: 4.10, z0: 7.98, z1: 8.48 };
export const equipment = { x0: .44, x1: 2.76, y0: 0, y1: 2.25, z0: -6.83, z1: -5.43, surface: 'metal' };
export const openings = [
  { z: 6.3, half: 1.30 }, { z: -0.5, half: 1.45 }, { z: -7.3, half: 1.45 },
  { z: -14.1, half: 1.45 }, { z: -20.9, half: 1.45 }
];
export const machines = [
  { x: 5.45, z: 3.20 }, { x: 5.45, z: -5.65 }, { x: 5.45, z: -14.50 }
];
export const crates = [
  { x: -5.78, z: 5.8, w: 2.15, h: 1.24, d: 1.55, type: 'cargo', yaw: 0 },
  { x: -5.81, z: 5.79, y: 1.24, w: 1.94, h: .82, d: 1.40, type: 'cargo', yaw: .075 },
  { x: -4.95, z: -3.86, w: 2.52, h: 1.48, d: 1.37, type: 'cargo', yaw: -.05 },
  { x: -4.40, z: -10.78, w: 1.65, h: 1.13, d: 2.0, type: 'case', yaw: .06 },
  { x: -5.96, z: -15.75, w: 1.75, h: 1.23, d: 1.33, type: 'case', yaw: 0 },
  { x: -4.95, z: -21.7, w: 2.13, h: 1.27, d: 1.65, type: 'cargo', yaw: -.04 },
  { x: 2.75, z: 3.2, w: 1.20, h: .88, d: 1.31, type: 'case', yaw: .02 },
  { x: 2.50, z: -8.64, w: 1.38, h: .96, d: 1.42, type: 'case', yaw: 0 },
  { x: 2.8, z: -17.3, w: 1.3, h: 1.08, d: 1.5, type: 'case', yaw: 0 }
];
export const droneSites = [
  { role: 'scout', x: -2.18, y: 1.81, z: 1.24, hp: 3, band: 5.8, speed: 2.05, lead: .09, windup: .73, wait: 1.60, damage: 17, patrol: [[-2.3,1.4],[-3.05,-1.60],[-.48,.13],[.22,2.07]] },
  { role: 'skirmisher', x: 1.59, y: 1.47, z: -7.42, hp: 4, band: 7.6, speed: 2.75, lead: .16, windup: .63, wait: 1.84, damage: 21, patrol: [[1.62,-7.54],[-.58,-8.19],[-2.85,-8.26],[-2.87,-5.32],[-.63,-3.53]] },
  { role: 'warden', x: 3.34, y: 1.65, z: -19.61, hp: 7, band: 10.2, speed: 1.48, lead: .10, windup: .98, wait: 2.1, damage: 33, patrol: [[3.25,-20.16],[.78,-20.26],[-1.70,-19.75],[-2.3,-17.45],[-.43,-15.86]] }
];
function partition({ x0,x1,y,z0,z1 }) {
  return [
    { x0:bounds.x0,x1:x0,z0,z1,y0:0,y1:8.85,surface:'concrete' },
    { x0:x1,x1:bounds.x1,z0,z1,y0:0,y1:8.85,surface:'concrete' },
    { x0,x1,z0,z1,y0:y,y1:8.85,surface:'concrete' }
  ];
}

// Rail and wall footprints are also used by projectile line-of-sight tests.
export const solids = [
  ...doors.slice(0,2).flatMap(partition),
  { x0:bounds.x0,x1:accessWalk.x0,z0:threshold.z1,z1:bounds.z1,y0:0,y1:1.08,surface:'metal' },
  { x0:accessWalk.x1,x1:bounds.x1,z0:threshold.z1,z1:bounds.z1,y0:0,y1:1.08,surface:'metal' },
  { x0:bounds.x0,x1:catwalk.x0,z0:bounds.z0,z1:-27.03,y0:0,y1:2.45,surface:'concrete' },
  { x0:catwalk.x1,x1:bounds.x1,z0:bounds.z0,z1:-27.03,y0:0,y1:2.45,surface:'concrete' },
  { x0:catwalk.x0,x1:catwalk.x1,z0:-27.73,z1:-27.03,y0:3.10,y1:8.85,surface:'concrete' },
  { x0: bounds.x0, x1: portal.x0, z0: portal.z0, z1: portal.z1, y0: 0, y1: portal.y, surface: 'concrete' },
  { x0: portal.x1, x1: bounds.x1, z0: portal.z0, z1: portal.z1, y0: 0, y1: portal.y, surface: 'concrete' },
  { x0: bounds.x0, x1: bounds.x1, z0: portal.z0, z1: portal.z1, y0: portal.y, y1: 8.85, surface: 'concrete' },
  { x0:3.75,x1:4.43,z0:-24.23,z1:-23.85,y0:0,y1:2.30,surface:'metal' },
  { x0:entry.x-.18,x1:entry.x+.17,z0:entry.z-.10,z1:entry.z+.22,y0:0,y1:1.58,surface:'metal' },
  equipment,
  ...[relay, cache].map(c => ({ x0:c.x-.61, x1:c.x+.61, z0:c.z-.45, z1:c.z+.37, y0:0, y1:c.y+.22, surface:'metal' })),
  ...crates.map(c => ({ x0: c.x - c.w / 2, x1: c.x + c.w / 2, z0: c.z - c.d / 2, z1: c.z + c.d / 2, y0: c.y || 0, y1: (c.y || 0) + c.h })),
  ...machines.map(c => ({ x0: 3.76, x1: 7.60, z0: c.z - 2.48, z1: c.z + 2.48, y0: 0, y1: 3.10 })),
  { x0: gatePanel.x - .43, x1: gatePanel.x + .43, z0: gatePanel.z - .41, z1: gatePanel.z + .41, y0: 0, y1: 1.65 },
  { x0: -7.72, x1: -6.36, z0: 8.64, z1: 9.20, y0: .25, y1: 2.81 }
];
export const muzzleLights = [
  [-7.02, 2.66, 8.0], [-7.02, 2.66, -4.4], [-7.02, 2.66, -17.5],
  [3.6, 4.25, -26.5], [-3.6, 4.25, -26.5]
];

