const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>(1-t)*a+t*b;

export function hash(x, y) {
  let n = Math.imul(x ^ 1987, 1597334677) ^ Math.imul(y ^ 3011, 3812015801);
  n = Math.imul(n ^ (n >>> 16), 2246822519);
  return ((n ^ (n >>> 13)) >>> 0) / 4294967296;
}
export function noise(u, v, count) {
  const x = u * count, y = v * count;
  const i = Math.floor(x), j = Math.floor(y);
  const f = x - i, g = y - j;
  const a = f * f * (3 - 2 * f), b = g * g * (3 - 2 * g);
  const top = lerp(hash(i % count, j % count), hash((i + 1) % count, j % count), a);
  const bottom = lerp(hash(i % count, (j + 1) % count), hash((i + 1) % count, (j + 1) % count), a);
  return lerp(top, bottom, b);
}

function lattice(n,count,sx=1,sy=1,shift=0) {
  const x0=new Uint16Array(n), x1=new Uint16Array(n), xf=new Float32Array(n);
  const y0=new Uint16Array(n), y1=new Uint16Array(n), yf=new Float32Array(n);
  const grid=new Float32Array(count*count);
  for(let y=0;y<count;y++)for(let x=0;x<count;x++)grid[y*count+x]=hash(x,y);
  for(let k=0;k<n;k++) {
    const x=((k/n*sx+shift)%1)*count, y=k/n*sy*count;
    const a=Math.floor(x), b=Math.floor(y), u=x-a, v=y-b;
    x0[k]=a; x1[k]=(a+1)%count; xf[k]=u*u*(3-2*u);
    y0[k]=b*count; y1[k]=((b+1)%count)*count; yf[k]=v*v*(3-2*v);
  }
  return (i,j)=>lerp(
    lerp(grid[y0[j]+x0[i]],grid[y0[j]+x1[i]],xf[i]),
    lerp(grid[y1[j]+x0[i]],grid[y1[j]+x1[i]],xf[i]),
    yf[j]
  );
}


export function surfaceBytes({ color, roughness, metalness, mode, n = 512 }) {
  const rgb = [color >>> 16, (color >>> 8)&255, color&255];
  const albedo = new Uint8Array(n * n * 4);
  const properties = new Uint8Array(n * n * 4);
  const normal = new Uint8Array(n * n * 4);
  const heights = new Float32Array(n * n);
  const concrete = mode === 'stone' || mode === 'wall';
  const industrial = mode === 'industrial';
  const painted = mode === 'enamel';
  const woven = mode === 'cloth';
  const turned = mode === 'satin';
  const seed = (color % 119) / 119;
  const broadField=lattice(n,5,1,1,seed), mediumField=lattice(n,13);
  const grainField=lattice(n,61), microField=lattice(n,177), contourField=painted&&lattice(n,7);
  const lowWick=mode==='wall'&&lattice(n,55,1,.10), highWick=mode==='wall'&&lattice(n,112,1,.19);
  const craterField=industrial&&lattice(n,346), crustField=industrial&&lattice(n,255);
  const dragA=lattice(n,211,.083), dragB=lattice(n,121,.18);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const broad = broadField(i,j), medium = mediumField(i,j);
      const grain = grainField(i,j), micro = microField(i,j);
      const grit = hash(i, j) - .5;
      const capillary = lowWick?lowWick(i,j)*.72+highWick(i,j)*.28:0;
      const drag = dragA(i,j)*.7+dragB(i,j)*.3;
      const fleck = Math.max(0,(micro+grain*.54-1.01)*2.26);
      const pore = Math.max(0,(.48-micro-grain*.31)*3.04)**2;
      const contour = painted?contourField(i,j)*.62+medium*.17+grain*.11+micro*.10:0;
      const pits = industrial ? craterField(i,j) : 0;
      const crust = industrial ? crustField(i,j) : 0;
      const primer = painted ? clamp((contour-.584)*19,0,1) : 0;
      const exposed = painted ? clamp((contour-.617)*28,0,1) : 0;
      const oxidized = exposed*(.45+.55*grain);
      const water = mode === 'wall' ? Math.max(0,capillary-.44)*broad*.71 : 0;
      const wire = woven?Math.sin((i + j % 3)*2.16) * Math.sin((j - i % 4)*1.85):0;
      const textile = woven ? wire * .18 : 0;
      const scoring = Math.max(0, (drag-.72)*3.4) * (.27+.73*medium);
      const striation = (broad-.5)*.14 + (medium-.5)*.15 + (grain-.5)*.11 + grit*.072 + textile;
      const lam = (industrial ? (pits-.5)*.10+.046*(crust-.5) : 0) + (concrete ? striation + fleck*.13-pore*.32-water : striation*.48-pore*.09) + textile*.48;
      const idx = (j*n+i)*4;
      for (let c=0; c<3; c++) {
        const base = rgb[c]*(1+lam*1.9);
        const undercoat = (c===0 ? 108 : c===1 ? 88 : 61)*(1+lam+medium*.45);
        const bare = (c===0 ? 103 : c===1 ? 102 : 93)*(1+lam);
        const oxide = (c===0 ? 101 : c===1 ? 55 : 30)*(1+(grain-.5)*.96);
        const layered = lerp(lerp(base,undercoat,primer*.91),lerp(bare,oxide,oxidized),exposed);
        albedo[idx+c] = clamp(layered + scoring*(turned ? 54 : concrete ? 9 : 21) + (concrete ? fleck * 9 : 0),0,255);
      }
      properties[idx] = 255*clamp(1-pore*.34-primer*.085,0,1);
      properties[idx+1] = 255*clamp(roughness+(grain-.5)*.18+pore*.18+primer*.19-scoring*(turned?.34:.12)-water*.54,.105,.99);
      properties[idx+2] = 255*clamp(lerp(metalness,.88,exposed*(1-oxidized))+(turned ? scoring*.12 : 0),0,1);
      properties[idx+3] = albedo[idx+3] = normal[idx+3] = 255;
      heights[j*n+i] = concrete
        ? medium*.37 + grain*.46 + micro*.11 - pore*.49 + fleck*.112
        : grain*.098 + micro*.034 + (industrial?(crust*.067-pits*.094)*(primer+.55):0) - primer*.119 - exposed*.07 + scoring*.11 + textile*.67;
    }
  }
  for (let j=0; j<n; j++) for (let i=0; i<n; i++) {
    const dx = heights[j*n+(i+1)%n]-heights[j*n+(i+n-1)%n];
    const dy = heights[((j+1)%n)*n+i]-heights[((j+n-1)%n)*n+i];
    const length = Math.hypot(dx,dy,1);
    const k = (j*n+i)*4;
    normal[k] = 127.5-dx*127.5/length;
    normal[k+1] = 127.5-dy*127.5/length;
    normal[k+2] = 127.5+127.5/length;
  }
  return {mode,n,albedo,properties,normal};
}
export function surfaceSpecs() {
  const paint = (color, roughness = .55) => ({ color, roughness, metalness: .31, mode: 'enamel' });
  const coated=(color,roughness)=>({color,roughness,metalness:.34,mode:'industrial',n:1024});
  const bare = (color, roughness, metalness = .57) => ({ color, roughness, metalness, mode: 'scratched', n: 384 });
  return {
    wall: ({ color: 0x82817a, roughness: .86, metalness: .06, mode: 'wall', n: 768 }),
    edge: ({ color: 0x666760, roughness: .79, metalness: .04, mode: 'wall' }),
    floor: ({ color: 0x666963, roughness: .82, metalness: .09, mode: 'stone', n: 1024 }),
    green: paint(0x53655b), olive: paint(0x656753), cream: paint(0xafa991),
    orange: paint(0xc59454), red: paint(0x92442f), blue: paint(0x4a6468),
    doorBlue:coated(0x566c70,.57), doorGreen:coated(0x58655a,.61), cabinetCoat:coated(0xaa844f,.58),
    iron: bare(0x666660, .47, .65), black: bare(0x323a3a, .62, .44), silver: bare(0xbabbb3, .29, .75),
    rubber: bare(0x252927, .8, .03), rust: paint(0x774d36, .72),
    graphite: ({color:0x353c3c,roughness:.46,metalness:.42,mode:'satin',n:512}), bronze: bare(0xa0714b, .43, .68),
    gunMetal: ({color:0x6b757b,roughness:.37,metalness:.74,mode:'satin',n:512}),
    glove: ({color:0x505346,roughness:.81,metalness:.035,mode:'cloth',n:512}),
    ceramic: paint(0xb1ab96,.39), burgundy: paint(0x684238,.57),
    cloth: ({ color: 0x464c49, roughness: .92, metalness: 0, mode: 'cloth', n: 384 }),
  };
}
