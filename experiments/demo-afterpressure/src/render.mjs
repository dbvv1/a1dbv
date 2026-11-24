import * as T from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { accessWalk,catwalk,openings, muzzleLights } from './layout.mjs';
import { slabFilmGLSL } from './hall-finishes.mjs';
import { noiseSeed, makeExterior } from './outside.mjs';

const glslNoise = `
float hash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise2(vec2 a) {
  vec2 i = floor(a), f = fract(a);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash2(i), hash2(i + vec2(1,0)), f.x), mix(hash2(i + vec2(0,1)), hash2(i + 1.), f.x), f.y);
}
float fbm(vec2 p) {
  return noise2(p) * .52 + noise2(p * 2.04 + 17.8) * .25
    + noise2(p * 4.21 - 8.2) * .14 + noise2(p * 8.36 + 1.8) * .09;
}
`;
const sunDir = new T.Vector3(-.76, .565, -.345).normalize();

function skyGeometry(panorama) {
  return new T.Mesh(
    new T.SphereGeometry(157, 40, 22),
    new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false,
      uniforms: { sun: { value: sunDir }, panorama: {value:panorama} },
      vertexShader: `
        varying vec3 vWorld;
        void main() {
          vWorld = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }`,
      fragmentShader: `
        varying vec3 vWorld;
        uniform vec3 sun;
        uniform sampler2D panorama;
        ${glslNoise}
        void main() {
          vec3 d = normalize(vWorld);
          float up = max(0.0, d.y);
          float shine = max(0., dot(d, sun));
          vec3 distant = mix(vec3(.183,.32,.373), vec3(.58,.51,.40), pow(shine, 6.0));
          vec3 zenith = vec3(.033,.095,.154);
          vec3 sky = mix(distant, zenith, pow(up, .42));
          vec2 plane = d.xz / (.235 + max(d.y, .025));
          vec2 drift = vec2(plane.x * .65 + plane.y * .22, plane.y * .92);
          float cloud = fbm(drift * 3.2 + fbm(drift * 2.0) * .69);
          float detail = fbm(drift * 11. + vec2(12., -8.));
          float body = smoothstep(.36, .73, cloud + (detail - .5) * .15);
          float rim = smoothstep(.29, .48, cloud) * (1. - body);
          vec3 cloudTint = mix(vec3(.024,.045,.067), vec3(.23,.218,.197), pow(shine, 2.2));
          vec3 glow = vec3(1.17,.84,.51) * pow(shine, 23.0);
          sky = mix(sky + glow * (.08 + rim), cloudTint, body * .88);
          sky += glow * pow(shine, 150.) * (1. - body) * .68;
          sky = mix(sky, distant * .63, 1. - smoothstep(-.13,.10,d.y));
          vec2 uv=vec2(atan(d.z,d.x)*.15915494+.204,asin(clamp(d.y,-1.,1.))*.31830989+.52);
          vec3 realSky=texture2D(panorama,uv).rgb;
          float scale=dot(realSky,vec3(.23,.68,.09));
          vec3 cloudColor=realSky/(1.+scale*.20)*vec3(.78,.89,1.06)*.54;
          float shelf=smoothstep(-.015,.22,d.y);
          sky=mix(sky*2.,cloudColor,.40+shelf*.35);
          sky=mix(sky,distant*.77,1.-smoothstep(-.18,.065,d.y));
          gl_FragColor = vec4(sky, 1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`
    })
  );
}

function environment(renderer, sky) {
  const holder = new T.Scene();
  holder.add(sky.clone());
  const pmrem = new T.PMREMGenerator(renderer);
  const map = pmrem.fromScene(holder, .12, .2, 150, { size: 128 }).texture;
  pmrem.dispose();
  return map;
}

function wetFloor(scene) {
  const planes=[new T.PlaneGeometry(15.27,39.9)];
  for(const deck of [accessWalk,catwalk]) {
    const puddles=new T.PlaneGeometry(deck.x1-deck.x0-.23,deck.z1-deck.z0-.21);
    puddles.translate((deck.x0+deck.x1)*.5,-(deck.z0+deck.z1)*.5-7.03,0);
    planes.push(puddles);
  }
  const wetGeometry=mergeGeometries(planes);
  for(const geometry of planes)geometry.dispose();
  const surface = new Reflector(wetGeometry, {
    textureWidth: 960, textureHeight: 540, multisample: 0, clipBias: .0002,
    shader: {
      name: 'Wet concrete reflections',
      uniforms: {
        color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null },
        time: { value: 0 }
      },
      vertexShader: `
        uniform mat4 textureMatrix;
        varying vec4 vProjected;
        varying vec3 vWorld;
        void main() {
          vProjected = textureMatrix * vec4(position, 1.);
          vWorld = (modelMatrix * vec4(position, 1.)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }`,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        varying vec4 vProjected;
        varying vec3 vWorld;
        ${glslNoise}
        ${slabFilmGLSL}
        vec2 ripples(vec2 p) {
          vec2 id = floor(p), local = fract(p);
          vec2 displacement = vec2(0.);
          for (int j = -1; j <= 1; j++) {
            for (int i = -1; i <= 1; i++) {
              vec2 offset = vec2(float(i),float(j));
              vec2 cell = id + offset;
              float key = hash2(cell);
              float phase = fract(time * (.55 + key * .26) + key * 13.1);
              vec2 diff = local - offset - .08 - .84 * vec2(key, hash2(cell + 8.3));
              float r = length(diff);
              float ring = r - phase * .6;
              float pulse = exp(-abs(ring) * 26.) * sin(ring * 88.);
              displacement += normalize(diff + .00001) * pulse * (1. - phase) * smoothstep(0., .15, phase);
            }
          }
          return displacement;
        }
        void main() {
          vec2 p = vWorld.xz;
          float pooled = fbm(p * vec2(.67,.48) + 16.) + .18 * noise2(p * 2.1);
          float channel = .06 * sin(p.x * 1.25 - p.y * .3) + .028 * cos(p.y * .63);
          float spill=exp(-abs(abs(p.x)-4.16)*1.16-abs(p.y+25.34)*.72);
          float wet=smoothstep(.49,.735,pooled+channel+spill*.31);
          bool catwalk=vWorld.z>13.43||vWorld.z<-27.10;
          if(catwalk) {
            float channels=fbm(p*vec2(1.4,3.5)+18.2);
            wet=smoothstep(.48,.74,pooled*.63+channels*.53)*.51;
          }
          float hall=hallBand(p.y);
          vec2 film=slabFilm(p);
          wet=mix(wet,film.y,hall*.52);
          if (wet < .022) discard;
          vec3 viewer = cameraPosition - vWorld;
          float horizontal = 1. - abs(normalize(viewer).y);
          float fresnel = pow(horizontal, 2.7);
          vec2 ripple = ripples(p * 1.9) * .0019;
          vec2 warp = vec2(noise2(p * 11.8 + time * .3), noise2(p * 12.7 + 12. - time * .23)) - .5;
          vec2 uv = vProjected.xy / vProjected.w;
          uv += ripple * wet + warp * mix(.0035, .00065, wet);
          vec2 center=clamp(uv,.004,.996);
        vec2 blur=vec2(.0019,.0027)*(1.-wet)*(.42+.58*horizontal)*(1.+hall*(1.-film.y)*.54);
        vec3 mirrored=texture2D(tDiffuse,center).rgb*.64;
        mirrored+=(texture2D(tDiffuse,center+blur).rgb+texture2D(tDiffuse,center-blur).rgb)*.18;
          vec3 color = mirrored * vec3(.67,.77,.77) + vec3(.009,.014,.015);
          float gloss = .76 * fresnel + .23;
          gl_FragColor = vec4(color, wet * gloss);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`
    }
  });
  surface.position.set(0, .022, -7.03);
  surface.rotation.x = -Math.PI / 2;
  surface.material.transparent = true;
  surface.material.depthWrite = false;
  surface.renderOrder = 3;
  scene.add(surface);
  return surface;
}

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0., 1.);
}`;
function screenPass(fragmentShader, uniforms) {
  const material = new T.ShaderMaterial({ vertexShader: vert, fragmentShader, uniforms, depthWrite: false, depthTest: false });
  const scene = new T.Scene();
  scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), material));
  return { scene, uniforms };
}
function target(w, h, depth = false) {
  const out = new T.WebGLRenderTarget(w, h, { type: T.HalfFloatType, depthBuffer: depth, stencilBuffer: false });
  if (depth) {
    out.depthTexture = new T.DepthTexture(w, h, T.UnsignedIntType);
    out.samples = 2;
  }
  return out;
}
function uniformsOf(values) {
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, { value: v }]));
}

function atmosphere(depth, camera) {
  const windows = openings.map(w => new T.Vector2(w.z, w.half));
  const lights = muzzleLights.map(p => new T.Vector3(...p));
  return screenPass(`
    varying vec2 vUv;
    uniform sampler2D depth;
    uniform mat4 invProjection, viewToWorld;
    uniform vec3 origin, sun, practicals[5];
    uniform vec2 windows[5];
    uniform float time, vent, surge;
    ${glslNoise}
    vec3 unproject(float d) {
      vec4 clip = invProjection * vec4(vUv * 2. - 1., d * 2. - 1., 1.);
      return (viewToWorld * vec4(clip.xyz / clip.w, 1.)).xyz;
    }
    float windowBeam(vec3 p) {
      vec3 left = p + sun * ((-7.7 - p.x) / sun.x);
      float y = smoothstep(3.9, 4.33, left.y) * (1. - smoothstep(7.27, 7.71, left.y));
      float side = 0.;
      for (int i = 0; i < 5; i++) {
        float z = abs(left.z - windows[i].x);
        float window = 1. - smoothstep(windows[i].y - .24, windows[i].y + .15, z);
        float dividers = .68 + .32 * smoothstep(.027,.095, abs(mod(left.z - windows[i].x + .34,.68) - .34));
        side = max(side, window * dividers * y);
      }
      vec3 top = p + sun * ((8.86 - p.y) / sun.y);
      float ceiling = smoothstep(-5.93, -5.67, top.x) * (1. - smoothstep(2.76, 2.99, top.x));
      float cover = min(min(abs(top.z - 10.32),abs(top.z - 3.13)),min(abs(top.z + 3.68),min(abs(top.z + 16.9),abs(top.z + 23.95))));
      ceiling *= smoothstep(1.30,1.66,cover) * smoothstep(-.11,.12,abs(mod(top.x + 1.35,2.6)-1.3));
      return max(side * .95, ceiling * .87);
    }
    void main() {
      vec3 end = unproject(texture2D(depth, vUv).r);
      vec3 delta = end - origin;
      float shaft = min(length(delta), 79.);
      vec3 ray = normalize(delta);
      float spacing = shaft / 34.;
      float jitter = .35 + hash2(gl_FragCoord.xy) * .3;
      vec3 lightSum = vec3(0.);
      float transmission = 1.;
      for (int i = 0; i < 34; i++) {
        vec3 p = origin + ray * (float(i) + .22 + jitter * .56) * spacing;
        float inside = step(-7.95,p.x) * step(p.x,7.95) * step(-27.6,p.z) * step(p.z,13.28) * step(p.y,8.92);
        float coil = sin(p.x * .55 + p.z * .44 - time * .44) * sin(p.z * .32 - p.y * .69 + time * .22);
        float curl = noise2(p.xz * .48 + vec2(time * .17,-p.y * .33)) - .5;
        float depthFog = .27 + .73 * exp(-max(0.,p.y) * .33);
        float density = (.0055 + .020 * depthFog * (.81 + coil * .36 + curl * .62)) * mix(.75,1.0,inside);
        vec3 lighting = mix(vec3(.066,.15,.225),vec3(.035,.064,.085),inside);
        float angle = .5 + pow(max(0.,dot(ray,sun)), 3.) * 1.65;
        float beam = windowBeam(p) * inside * (.93 + coil * .16 + curl * .48);
        lighting += vec3(.40,.82,1.18) * beam * angle * 1.74;
        for (int j = 0; j < 5; j++) {
          vec3 rel = p - practicals[j];
          float d2 = dot(rel,rel);
          float local = 1. / (1. + d2 * .37);
          float down = 1. - .52 * smoothstep(-.83,.5,rel.y);
          lighting += vec3(1.48,.47,.129) * local * local * down * 2.09 * inside;
        }
        float spill = exp(-abs(p.z + 28.1) * .39 - abs(p.x) * .25 - max(0.,p.y) * .32);
        float ravine=step(p.z,-28.)*exp(-abs(p.x)*.058)*exp(-abs(p.y+1.1)*.38);
        float dune=fbm(p.xz*.17+vec2(-time*.088,time*.180));
        float rolling=exp(-abs(p.z+30.5-1.72*coil)*.41-abs(p.x+.68*dune)*.19-abs(p.y-.46)*.71);
        density += spill * vent * (.041 + .054 * max(0.,coil)) + ravine*(.010+vent*.015)*(.52+dune*.91);
        density += surge*rolling*(.072+.265*dune);
        lighting += (spill*vent+rolling*surge*.64)*vec3(.42,.74,.86)+ravine*vec3(.14,.24,.25)*(.8+vent*.76);
        float alpha = 1. - exp(-spacing * density);
        lightSum += transmission * lighting * alpha;
        transmission *= 1. - alpha;
      }
      gl_FragColor = vec4(lightSum, transmission);
    }`, uniformsOf({
      depth, invProjection: camera.projectionMatrixInverse, viewToWorld: camera.matrixWorld,
      origin: camera.position, sun: sunDir, windows, practicals: lights, time: 0, vent: 0, surge: 0
    }));
}

function lensBloom(world, fog) {
  return screenPass(`
    varying vec2 vUv;
    uniform sampler2D world, fog;
    uniform vec2 pixel;
    vec3 glow(vec2 p) {
      vec4 a = texture2D(fog,p);
      vec3 c = texture2D(world,p).rgb * a.a + a.rgb;
      float peak = max(c.r,max(c.g,c.b));
      return c * max(0., (peak - .67) / (peak + .68));
    }
    void main() {
      vec3 c = glow(vUv) * .24;
      c += (glow(vUv + pixel * vec2(1.5,1.5)) + glow(vUv + pixel * vec2(-1.5,1.5)) +
            glow(vUv + pixel * vec2(1.5,-1.5)) + glow(vUv - pixel * 1.5)) * .15;
      c += (glow(vUv + pixel * vec2(4.,0.)) + glow(vUv - pixel * vec2(4.,0.)) +
            glow(vUv + pixel * vec2(0.,4.)) + glow(vUv - pixel * vec2(0.,4.))) * .04;
      gl_FragColor = vec4(c,1.);
    }`, uniformsOf({ world, fog, pixel: new T.Vector2() }));
}
function blurPass(image, pixel) {
  return screenPass(`
    varying vec2 vUv;
    uniform sampler2D image;
    uniform vec2 offset;
    void main() {
      vec3 color = texture2D(image,vUv).rgb * .208;
      color += (texture2D(image,vUv + offset * 1.6).rgb + texture2D(image,vUv - offset * 1.6).rgb) * .28;
      color += (texture2D(image,vUv + offset * 4.2).rgb + texture2D(image,vUv - offset * 4.2).rgb) * .116;
      gl_FragColor = vec4(color,1.);
    }`, uniformsOf({ image, offset: pixel }));
}
function contactShadows(depth,camera) {
  return screenPass(`
    varying vec2 vUv;
    uniform sampler2D depth;
    uniform mat4 projection, inverseProjection;
    uniform vec2 pixel;
    ${glslNoise}
    vec3 positionAt(vec2 uv) {
      float d=texture2D(depth,clamp(uv,.001,.999)).r;
      vec4 p=inverseProjection*vec4(uv*2.-1., d*2.-1.,1.);
      return p.xyz/p.w;
    }
    void main() {
      vec3 p=positionAt(vUv);
      if(p.z> -1.24 || p.z< -63.) {gl_FragColor=vec4(1.);return;}
      vec3 dx1=positionAt(vUv+vec2(pixel.x,0.))-p;
      vec3 dx0=p-positionAt(vUv-vec2(pixel.x,0.));
      vec3 dy1=positionAt(vUv+vec2(0.,pixel.y))-p;
      vec3 dy0=p-positionAt(vUv-vec2(0.,pixel.y));
      vec3 dx=abs(dx0.z)<abs(dx1.z)?dx0:dx1;
      vec3 dy=abs(dy0.z)<abs(dy1.z)?dy0:dy1;
      vec3 n=normalize(cross(dx,dy)+vec3(0.,0.,.0000001));
      float radius=mix(.42,.79,smoothstep(3.,29.,-p.z));
      vec2 screenRadius=vec2(projection[0][0],projection[1][1])*radius/(2.*-p.z);
      float jitter=hash2(floor(gl_FragCoord.xy)*.71)*6.283;
      float shadow=0.;
      for(int i=0;i<14;i++) {
        float f=(float(i)+.60)/14.;
        float angle=float(i)*2.399963+jitter;
        vec2 off=vec2(cos(angle),sin(angle))*sqrt(f);
        vec3 delta=positionAt(vUv+off*screenRadius)-p;
        float dist=length(delta);
        float angleFacing=max(0.,dot(n,delta)/max(.018,dist)-.093);
        shadow+=angleFacing*max(0.,1.-dist/radius)*smoothstep(.019,.065,dist);
      }
      float value=1.-clamp(shadow*.123,0.,.52);
      gl_FragColor=vec4(vec3(value),1.);
    }`,uniformsOf({
      depth, projection:camera.projectionMatrix, inverseProjection:camera.projectionMatrixInverse, pixel:new T.Vector2()
    }));
}

function grade(world, depth, fog, bloom, contact, camera) {
  return screenPass(`
    varying vec2 vUv;
    uniform sampler2D world, depth, fog, bloom, contact;
    uniform vec2 aoPixel, lensPixel, lens;
    uniform float clipNear, clipFar;
    uniform float time, flash;
    ${glslNoise}
    void main() {
      vec4 a = texture2D(fog,vUv);
      float ao = texture2D(contact,vUv).r * .60;
      ao += (texture2D(contact,vUv + aoPixel).r+texture2D(contact,vUv-aoPixel).r)*.20;
      vec3 source=texture2D(world,vUv).rgb;
      if(lens.y>.001) {
        float d=texture2D(depth,vUv).r;
        float distance=clipNear*clipFar/(clipFar-(clipFar-clipNear)*d);
        float blur=clamp(abs(1.-lens.x/max(distance,.05))*2.25,0.,2.10)*lens.y;
        vec2 dx=vec2(lensPixel.x*blur,0.), dy=vec2(0.,lensPixel.y*blur);
        source=source*.56+(texture2D(world,vUv+dx+dy).rgb+texture2D(world,vUv-dx-dy).rgb+
          texture2D(world,vUv+dx-dy).rgb+texture2D(world,vUv-dx+dy).rgb)*.11;
      }
      source*=mix(.39,1.,ao);
      vec3 bloomLight = texture2D(bloom,vUv).rgb;
      vec3 color = source * a.a + a.rgb + bloomLight * .23;
      color *= vec3(1.036,.998,.967);
      float y = dot(color,vec3(.22,.70,.08));
      color = mix(vec3(y),color, .97);
      color *= .79 + .205 * smoothstep(.022,.26,y);
      vec2 p = vUv * 2. - 1.;
      color *= 1. - .217 * pow(min(length(p * vec2(.81,.72)), 1.4),2.8);
      color += bloomLight * flash * .08;
      gl_FragColor = vec4(color,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      float grit = hash2(gl_FragCoord.xy + floor(time * 22.) * vec2(12.5,19.3)) - .5;
      gl_FragColor.rgb += grit * .007 * (.59 + .41 * (1. - sqrt(clamp(y,0.,1.))));
    }`, uniformsOf({ world,depth,fog,bloom,contact,aoPixel:new T.Vector2(),lensPixel:new T.Vector2(),
      lens:new T.Vector2(),clipNear:camera.near,clipFar:camera.far,time:0,flash:0 }));
}

export async function createRenderer(parent, scene, camera, materials, small, nextPaint) {
  const renderer = new T.WebGLRenderer({ powerPreference: 'high-performance', antialias: false });
  renderer.setClearColor(0x122022);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.20;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.domElement.setAttribute('aria-label', '三维闸站场景');
  parent.append(renderer.domElement);

  const sky = skyGeometry(materials.sky);
  scene.environment = environment(renderer, sky);
  scene.environmentIntensity = .43;
  scene.add(sky);
  const ambient = new T.HemisphereLight(0xbad5e0, 0x706651, .39);
  scene.add(ambient);
  const sun = new T.DirectionalLight(0xc4e7ff, 3.3);
  const subject = new T.Vector3(0, 0, -11);
  sun.position.copy(subject).addScaledVector(sunDir, 36);
  sun.target.position.copy(subject);
  sun.castShadow = true;
  sun.shadow.mapSize.set(small?2048:3072,small?2048:3072);
  Object.assign(sun.shadow.camera, { near: 4, far: 72, left: -24, right: 24, top: 19, bottom: -19 });
  sun.shadow.bias = -.00016;
  sun.shadow.normalBias = .031;
  scene.add(sun, sun.target);
  const entrance = new T.DirectionalLight(0xe7d9c4, .60);
  entrance.position.set(-.3, 4, 15);
  entrance.target.position.set(.2, 0, -14);
  scene.add(entrance, entrance.target);
  const back = new T.PointLight(0x90cade, 67, 31, 2);
  back.position.set(-1.3, 3.78, -31);
  scene.add(back);
  await nextPaint();
  const outside = await makeExterior(scene, noiseSeed, materials,nextPaint);
  const wet = wetFloor(scene);

  const main = target(1, 1, true);
  const fog = target(1, 1);
  const ao = target(1, 1);
  const blooms = [target(1, 1), target(1, 1), target(1, 1)];
  const volume = atmosphere(main.depthTexture, camera);
  const contact = contactShadows(main.depthTexture,camera);
  const gather = lensBloom(main.texture, fog.texture);
  const blurX = blurPass(blooms[0].texture, new T.Vector2());
  const blurY = blurPass(blooms[1].texture, new T.Vector2());
  const final = grade(main.texture,main.depthTexture,fog.texture,blooms[2].texture,ao.texture,camera);
  const screenCamera = new T.Camera();
  function pass(p, buffer) {
    renderer.setRenderTarget(buffer);
    renderer.render(p.scene, screenCamera);
  }

  function resize() {
    const width = innerWidth, height = innerHeight;
    const ratio = Math.min(devicePixelRatio, 1.5, 1920 / width) * (small ? .76 : 1);
    const w = Math.max(1, Math.round(width * ratio)), h = Math.max(1, Math.round(height * ratio));
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    main.setSize(w, h);
    fog.setSize(Math.ceil(w * .53), Math.ceil(h * .53));
    ao.setSize(Math.ceil(w*.53),Math.ceil(h*.53));
    contact.uniforms.pixel.value.set(1/w,1/h);
    final.uniforms.aoPixel.value.set(.54/ao.width,.54/ao.height);
    final.uniforms.lensPixel.value.set(1/w,1/h);
    const bw = Math.max(1, w >> 2), bh = Math.max(1, h >> 2);
    for (const f of blooms) f.setSize(bw, bh);
    gather.uniforms.pixel.value.set(1 / w, 1 / h);
    blurX.uniforms.offset.value.set(.96 / bw, 0);
    blurY.uniforms.offset.value.set(0, .96 / bh);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function draw(time, release, flash,shot) {
      wet.material.uniforms.time.value = time;
      outside.update(time, release);
      volume.uniforms.time.value = time;
      volume.uniforms.vent.value = release.discharge;
      volume.uniforms.surge.value = release.surge;
      back.intensity=57+release.discharge*18+release.surge*27;
      final.uniforms.time.value = time;
      final.uniforms.flash.value = flash;
      final.uniforms.lens.value.set(shot?.focus??0,shot?.aperture??0);
      renderer.setRenderTarget(main);
      renderer.render(scene, camera);
      pass(volume, fog);
      pass(contact,ao);
      pass(gather, blooms[0]);
      pass(blurX, blooms[1]);
      pass(blurY, blooms[2]);
      pass(final, null);
  }

  return {
    renderer,draw,
    async prepare() {
      // Traverse even the hidden viewmodel and pooled effects while linking world variants.
      renderer.setRenderTarget(main);
      await renderer.compileAsync(scene,camera);
      renderer.setRenderTarget(wet.getRenderTarget());
      const layers=camera.layers.mask;
      camera.layers.disable(1);
      await renderer.compileAsync(scene,camera);
      camera.layers.mask=layers;
      const passes=[[volume,fog],[contact,ao],[gather,blooms[0]],[blurX,blooms[1]],[blurY,blooms[2]],[final,null]];
      for(const [renderPass,buffer] of passes) {
        renderer.setRenderTarget(buffer);
        await renderer.compileAsync(renderPass.scene,screenCamera);
      }
      renderer.setRenderTarget(null);
      const textures=new Set();
      scene.traverse(object=>{
        if(object.material) for(const value of Object.values(object.material)) {
          if(value?.isTexture&&value!==wet.getRenderTarget().texture)textures.add(value);
        }
        for(const map of object.material?.userData.surfaceTextures??[])textures.add(map);
      });
      let deadline=performance.now()+9;
      for(const texture of textures) {
        renderer.initTexture(texture);
        if(performance.now()>deadline) {
          await nextPaint();
          deadline=performance.now()+9;
        }
      }
    },
    async prime(time,release,yieldFrame,shot) {
      draw(time,release,0,shot);
      const gl=renderer.getContext();
      const fence=gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE,0);
      if(!fence)return;
      gl.flush();
      try {
        while(gl.clientWaitSync(fence,0,0)===gl.TIMEOUT_EXPIRED)await yieldFrame();
      } finally { gl.deleteSync(fence); }
    }
  };
}

