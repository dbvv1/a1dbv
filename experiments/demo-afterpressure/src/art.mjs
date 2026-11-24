import * as T from 'three';
import { noise } from './surface-data.mjs';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const clamp = T.MathUtils.clamp;
export const v3 = (x, y, z) => new T.Vector3(x, y, z);
export const Y = v3(0, 1, 0);
export function random(seed = 42513) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function texture(bytes, n, color = false) {
  const map = new T.DataTexture(bytes, n, n);
  map.colorSpace = color ? T.SRGBColorSpace : T.NoColorSpace;
  map.wrapS = map.wrapT = T.RepeatWrapping;
  map.minFilter = T.LinearMipmapLinearFilter;
  map.magFilter = T.LinearFilter;
  map.generateMipmaps = true;
  map.anisotropy = 8;
  map.needsUpdate = true;
  return map;
}

function surface({mode,n,albedo,properties,normal}) {
  const concrete=mode==='stone'||mode==='wall';
  const packed = texture(properties,n);
  const material = new T.MeshStandardMaterial({
    map:texture(albedo,n,true), roughnessMap:packed, aoMap:packed, metalnessMap:packed,
    normalMap:texture(normal,n), normalScale:new T.Vector2(concrete?.84:1.04,concrete?.84:1.04),
    roughness:1, metalness:1, aoMapIntensity:.6
  });
  if (mode === 'wall') ageConcrete(material);
  if(mode==='industrial') {
    for(const map of [material.map,packed,material.normalMap])map.repeat.set(2.55,2.55);

  }
  return material;
}

export function applySiteCoatings(m) {
  for(const material of [m.doorGreen,m.doorBlue,m.cabinetCoat])weatherCoating(material,m.oxide);
}

// The face frame is written before batching, so each panel keeps its own boundaries.
function weatherCoating(material,maps) {
  material.customProgramCacheKey=()=> 'layered-oxide';
  material.userData.surfaceTextures=Object.values(maps);
  material.onBeforeCompile=shader=>{
    shader.uniforms.oxideColor={value:maps.map};
    shader.uniforms.oxideNormal={value:maps.normal};
    shader.uniforms.oxideARM={value:maps.arm};
    shader.vertexShader=`
      attribute vec4 patinaFrame;
      attribute vec2 patinaSize;
      varying vec4 part;
      varying vec2 span;
    `+shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      part=patinaFrame;
      span=patinaSize;
    `);
    shader.fragmentShader=`
      uniform sampler2D oxideColor, oxideNormal, oxideARM;
      varying vec4 part;
      varying vec2 span;
      float patina(vec2 p) {
        vec2 i=floor(p),f=fract(p);
        f=f*f*(3.-2.*f);
        vec4 x=vec4(i.x,i.x+1.,i.x,i.x+1.),y=vec4(i.y,i.y,i.y+1.,i.y+1.);
        vec4 q=fract(sin(x*127.1+y*311.7)*43758.5453);
        return mix(mix(q.x,q.y,f.x),mix(q.z,q.w,f.x),f.y);
      }
    `+shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      vec2 p=part.xy;
      vec2 lo=max(p+span*.5,0.), hi=max(span*.5-p,0.);
      float gap=min(lo.x,hi.x), lip=min(lo.y,hi.y);
      float width=length(fwidth(p));
      vec2 q=p+vec2(part.z,part.z*.29);
      float grit=mix(patina(q*145.),.5,smoothstep(.003,.012,width));
      float flake=mix(patina(q*66.),.5,smoothstep(.006,.026,width));
      float jag=patina(q*18.)*.59+flake*.41;
      float leak=patina(vec2(q.x*12.,q.y*.42));
      vec2 rustUV=q*vec2(1.03,1.17)+vec2(part.z*.32,.12);
      vec3 photo=texture2D(oxideColor,rustUV).rgb;
      vec3 props=texture2D(oxideARM,rustUV).rgb;
      float edgeMottle=patina(vec2(q.x*3.1,q.y*5.5));
      float edge=max(exp(-gap*mix(5.,25.,edgeMottle))*.83,exp(-lip*mix(9.,38.,edgeMottle))*.82);
      float source=patina(vec2(q.x*1.79,part.z*.81+1.7));
      float streakWidth=mix(4.2,22.,jag);
      float afterSeam=exp(-hi.y*streakWidth)*smoothstep(.43,.81,leak*.58+source*.42)*part.w;
      float nearPost=abs(abs(p.x)-span.x*.342);
      float bleed=exp(-nearPost*mix(10.,33.,leak))*exp(-hi.y*6.)*part.w*smoothstep(.48,1.58,span.x);
      float hanging=patina(vec2(q.x*6.1+q.y*.09,q.y*.62));
      float freckles=smoothstep(.46,.76,patina(q*vec2(2.7,7.1)))*smoothstep(.38,.69,edgeMottle*.54+flake*.46);
      float score=edge*(.38+edgeMottle*.77)+afterSeam*.96+bleed*.54+
        flake*.18+freckles*.44+smoothstep(.12,.38,photo.r-photo.b)*.16;
      float exposed=smoothstep(.43,.69,score);
      float oxide=smoothstep(.61,.89,score)*mix(.70,1.,props.r);
      float wash=afterSeam*(.22+.53*hanging)+exp(-lo.y*12.)*(.17+leak*.30);
      vec3 primer=mix(vec3(.159,.134,.104),vec3(.112,.086,.054),flake);
      vec3 rust=mix(photo*vec3(1.16,.82,.60),vec3(.083,.031,.013),.40);
      diffuseColor.rgb*=1.-wash*.38;
      float nick=smoothstep(.74,.89,patina(vec2(q.x*14.,q.y*89.)))*exp(-gap*8.)*(1.-smoothstep(.003,.019,width));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.21,.205,.182),nick*.34);
      diffuseColor.rgb=mix(diffuseColor.rgb,primer,exposed*(1.-oxide)*.68);
      diffuseColor.rgb=mix(diffuseColor.rgb,rust,oxide*.93);
    `).replace('#include <roughnessmap_fragment>',`
      #include <roughnessmap_fragment>
      roughnessFactor=mix(roughnessFactor,clamp(props.g+.13,.42,.97),exposed*.92);
      roughnessFactor=mix(roughnessFactor,.37,wash*.20);
    `).replace('#include <metalnessmap_fragment>',`
      #include <metalnessmap_fragment>
      metalnessFactor=mix(metalnessFactor,.71,exposed*(1.-oxide)*.37)*(1.-oxide*.85);
    `).replace('#include <normal_fragment_maps>',`
      #include <normal_fragment_maps>
      vec3 N=texture2D(oxideNormal,rustUV).rgb*2.-1.;
      mat3 crustBasis=getTangentFrame(-vViewPosition,normal,rustUV);
      normal=normalize(mix(normal,crustBasis*normalize(vec3(N.xy*.72,N.z)),exposed*.69));
    `);
  };
}

export function coatedPart(batch,material,x,y,z,w,h,d,bevel,seed,runoff=1) {
  const g=boxGeo(w,h,d,bevel);
  const positions=g.attributes.position, normals=g.attributes.normal;
  const frame=new Float32Array(positions.count*4), sizes=new Float32Array(positions.count*2);
  for(let i=0;i<positions.count;i++) {
    const nx=Math.abs(normals.getX(i)),ny=Math.abs(normals.getY(i)),nz=Math.abs(normals.getZ(i));
    const side=nx>nz&&nx>ny, top=ny>=nx&&ny>=nz;
    frame.set([side?positions.getZ(i):positions.getX(i),
      top?positions.getZ(i):positions.getY(i),seed,top?0:runoff],i*4);
    sizes.set([side?d:w,top?d:h],i*2);
  }
  g.setAttribute('patinaFrame',new T.BufferAttribute(frame,4));
  g.setAttribute('patinaSize',new T.BufferAttribute(sizes,2));
  batch.add(g,material,[x,y,z]);
}

function ageConcrete(material) {
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 buildingPoint;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\nbuildingPoint=(modelMatrix*vec4(position,1.)).xyz;'
    );
    shader.fragmentShader = `
      varying vec3 buildingPoint;
      float blockNoise(vec2 p) {
        vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
        vec4 v=fract(sin(vec4(dot(i,vec2(32.41,82.32)))+vec4(0.,32.41,82.32,114.73))*41753.86);
        return mix(mix(v.x,v.y,f.x),mix(v.z,v.w,f.x),f.y);
      }
    ` + shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec2 xz=buildingPoint.xz;
      float y=buildingPoint.y;
      float waterline=(1.-smoothstep(.18,1.26,y))*(.32+.68*blockNoise(xz*.91));
      float efflorescence=blockNoise(vec2(xz.x*.3+xz.y*.4,y*.25))*blockNoise(xz*2.6+y*.61);
      float board=blockNoise(vec2(floor(y*2.+.38),floor((xz.x+xz.y)*.39)));
      float streak=blockNoise(xz*vec2(1.8,3.1)+y*.16)*blockNoise(vec2(xz.x+xz.y,y*.31));
      diffuseColor.rgb *= .87+board*.21+efflorescence*.14-waterline*.31-streak*.21;
      diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.245,.24,.213),smoothstep(.43,.71,efflorescence)*.27);
    `);
  };
}

export async function materials(report) {
  const worker=new Worker(new URL('./surface-worker.mjs',import.meta.url),{type:'module'});
  const maps=await new Promise((resolve,reject)=>{
    const maps={};
    worker.onmessage=({data:{key,material,progress}})=>{
      maps[key]=surface(material);
      report(progress);
      if(progress===1)resolve(maps);
    };
    worker.onerror=event=>reject(event.error||new Error(event.message));
  }).finally(()=>worker.terminate());
  return {
    ...maps,
    signal: new T.MeshBasicMaterial({color:new T.Color(.73,2.8,2.27)}),
    amber: new T.MeshBasicMaterial({ color: new T.Color(4.8, 1.65, .34) }),
    hot: new T.MeshBasicMaterial({ color: new T.Color(8.0, 4.6, 2.4) }),
    cold: new T.MeshBasicMaterial({ color: new T.Color(2.15, 5.6, 6.55) }),
    greenLamp: new T.MeshBasicMaterial({ color: new T.Color(.22, 1.8, .84) }),
    redLamp: new T.MeshBasicMaterial({ color: new T.Color(5.1, .44, .11) })
  };
}

function boxUV(geom, w, h, d, scale) {
  const uv = geom.attributes.uv;
  const n = geom.attributes.normal;
  for (let i = 0; i < uv.count; i++) {
    const x = Math.abs(n.getX(i)), y = Math.abs(n.getY(i)), z = Math.abs(n.getZ(i));
    const uSize = x > z && x > y ? d : w;
    const vSize = y >= x && y >= z ? d : h;
    uv.setXY(i, uv.getX(i) * uSize / scale, uv.getY(i) * vSize / scale);
  }
}
export function boxGeo(w, h, d, bevel = 0, scale = 2.1) {
  const g = bevel ? new RoundedBoxGeometry(w, h, d, 2, bevel) : new T.BoxGeometry(w, h, d);
  boxUV(g, w, h, d, scale);
  return g;
}
export function cylGeo(r, h, sides = 32, r2 = r, scale = 2.1) {
  const g = new T.CylinderGeometry(r, r2, h, sides, 1);
  const uv = g.attributes.uv;
  for (let i = 0; i < 2 * (sides + 1); i++) uv.setXY(i, uv.getX(i) * r * 6.283 / scale, uv.getY(i) * h / scale);
  return g;
}
export function place(parent, geom, mat, x = 0, y = 0, z = 0) {
  const object = new T.Mesh(geom, mat);
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}

export function canvasMap(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  map.anisotropy = 8;
  return map;
}

export function decal(map, opacity = 1, solid = false) {
  return new T.MeshStandardMaterial({
    map, roughness: .87, transparent: !solid, alphaTest: solid ? .31 : .018, opacity,
    depthWrite: solid, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
  });
}

export function stenciled(text, { base = null, ink = '#d7d4bc', sub = '', border = false, seed = 27, aspect = 2 } = {}) {
  return canvasMap(768, Math.round(768 / aspect), (ctx, w, h) => {
    const rng = random(seed);
    if (base) {
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    if (border) {
      ctx.lineWidth = h * .015;
      ctx.strokeRect(h * .052, h * .052, w - h * .104, h * .896);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const height = h * (sub ? .55 : .78);
    ctx.font = '900 ' + height + 'px "Arial Narrow", Arial, sans-serif';
    ctx.fillText(text, w / 2, h * (sub ? .43 : .53), w * .89);
    if (sub) {
      ctx.font = 'bold ' + h * .125 + 'px Consolas, monospace';
      ctx.fillText(sub, w / 2, h * .82, w * .89);
    }
    for (let i = 0; i < 6100; i++) {
      ctx.globalCompositeOperation = i % 6 === 0 ? 'source-atop' : 'destination-out';
      ctx.fillStyle = i % 6 === 0 ? 'rgba(45,33,29,.34)' : 'rgba(0,0,0,' + (.1 + rng() * .78) + ')';
      const r = rng();
      ctx.fillRect(rng() * w, rng() * h, .5 + r ** 4 * 12, 1 + r ** 3 * 3.5);
    }
  });
}

export function grimeMap(seed, streak = false) {
  return canvasMap(256, 256, (ctx, w, h) => {
    const image = ctx.createImageData(w, h);
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
      const x = (i + .5) / w, y = (j + .5) / h;
      const o = (j * w + i) * 4;
      const mottling = noise((x + seed * .019) % 1, y, 8) * .62 + noise(x, y, 33) * .23 + noise(x, y, 99) * .15;
      const edge = Math.max(0, 1 - Math.hypot((x - .5) * 2.0, (y - (streak ? .23 : .5)) * (streak ? 1.18 : 2.0)));
      const drip = streak ? .35 + .85 * noise(x, y * .16, 33) : 1;
      const fade = Math.sin(y * Math.PI) ** (streak ? .48 : 1);
      image.data[o] = streak ? 44 + mottling * 33 : 21;
      image.data[o + 1] = streak ? 26 + mottling * 19 : 24;
      image.data[o + 2] = streak ? 16 + mottling * 16 : 23;
      image.data[o + 3] = clamp(edge * fade * drip * Math.max(0, mottling * 1.6 - .35), 0, .81) * 255;
    }
    ctx.putImageData(image, 0, 0);
  });
}

export function batches(parent) {
  const queues = new Map();
  function add(geometry, material, position, rotation, shadows = true) {
    if (!queues.has(material)) queues.set(material, new Map());
    const queue = queues.get(material);
    if (!queue.has(shadows)) queue.set(shadows, []);
    const buffer = geometry.index ? geometry.toNonIndexed() : geometry;
    if (buffer !== geometry) geometry.dispose();
    if (rotation?.isQuaternion) buffer.applyQuaternion(rotation);
    else if (rotation) buffer.applyMatrix4(new T.Matrix4().makeRotationFromEuler(new T.Euler(...rotation)));
    if (position) buffer.translate(...position);
    queue.get(shadows).push(buffer);
  }
  function merge(material,shadows,geometries) {
    const mesh=place(parent,mergeGeometries(geometries),material);
    mesh.castShadow=shadows;
    mesh.receiveShadow=true;
    geometries.forEach(geometry=>geometry.dispose());
  }
  return {
    add,
    box(mat, x, y, z, w, h, d, bevel = 0, rotation, shadows = true) {
      add(boxGeo(w, h, d, bevel), mat, [x, y, z], rotation, shadows);
    },
    pipe(mat, from, to, r, sides = 20, r2 = r, shadows = true) {
      const direction = new T.Vector3().fromArray(to).sub(new T.Vector3().fromArray(from));
      const center = from.map((v, i) => (v + to[i]) / 2);
      add(cylGeo(r, direction.length(), sides, r2), mat, center, new T.Quaternion().setFromUnitVectors(Y, direction.normalize()), shadows);
    },
    tube(mat, points, radius, sections = 32, sides = 10, shadows = true) {
      const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)));
      const g = new T.TubeGeometry(curve, sections, radius, sides);
      const uv = g.attributes.uv;
      const length = curve.getLength() / 2.1;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * length, uv.getY(i) * radius * 3);
      add(g, mat, null, null, shadows);
    },
    finish() {
      for (const [material, types] of queues) {
        for (const [shadows, geometries] of types) {
          merge(material,shadows,geometries);
        }
      }
      queues.clear();
    },
    async finishAsync(nextPaint) {
      let deadline=performance.now()+10;
      for(const [material,types] of queues) for(const [shadows,geometries] of types) {
        merge(material,shadows,geometries);
        if(performance.now()>deadline) {
          await nextPaint();
          deadline=performance.now()+10;
        }
      }
      queues.clear();
    }
  };
}

