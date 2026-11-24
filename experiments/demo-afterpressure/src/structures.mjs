import * as T from 'three';
import { coatedPart, batches, canvasMap, decal, grimeMap, place, random, stenciled } from './art.mjs';
import { bounds, portal, equipment, relay, cache, machines, openings } from './layout.mjs';

const left = [0,Math.PI/2,0], right = [0,-Math.PI/2,0], flat = [-Math.PI/2,0,0];
const sign = (text,option) => decal(stenciled(text,option),1,true);
function plane(b,m,x,y,z,w,h,rotation) {
  b.add(new T.PlaneGeometry(w,h),m,[x,y,z],rotation,false);
}
function faceBolt(b,m,x,y,z,direction=1,r=.022) {
  b.pipe(m.iron,[x,y,z],[x,y,z+.016*direction],r*1.24,9,r*1.24,false);
  b.pipe(m.gunMetal,[x,y,z+.014*direction],[x,y,z+.031*direction],r,6,r,false);
}
function hazard() {
  return decal(canvasMap(768,256,(c,w,h)=>{
    const rng = random(481);
    c.fillStyle='#c6a256';
    c.fillRect(0,0,w,h);
    c.fillStyle='#333331';
    for(let x=-w/3;x<w+w/3;x+=123) {
      c.beginPath();
      c.moveTo(x,0); c.lineTo(x+61,0); c.lineTo(x+61+h*.59,h); c.lineTo(x+h*.59,h);
      c.fill();
    }
    c.globalCompositeOperation='destination-out';
    for(let i=0;i<4200;i++) c.fillRect(rng()*w,rng()*h,1+rng()**5*23,1+rng()**4*8);
  }),1,true);
}

function portalFrame(scene,b,m,stripe) {
  const z=(portal.z0+portal.z1)/2;
  const d=portal.z1-portal.z0;
  const center=(portal.x0+portal.x1)/2;
  const width=portal.x1-portal.x0;
  for (const [x0,x1] of [[bounds.x0,portal.x0],[portal.x1,bounds.x1]]) {
    b.box(m.wall,(x0+x1)/2,portal.y/2,z,x1-x0,portal.y,d,.027);
    b.box(m.edge,(x0+x1)/2,.46,z+.271,x1-x0,.90,.069,.010);
  }
  b.box(m.wall,0,(8.85+portal.y)/2,z,15.75,8.85-portal.y,d+.06,.049);
  b.box(m.edge,center,portal.y+.17,z,width+.90,.64,1.06,.036);
  b.box(m.iron,center,portal.y-.04,z+.11,width+.29,.18,.68,.023);
  for(const x of [portal.x0-.07,portal.x1+.07]) {
    b.box(m.edge,x,2.08,z,.25,4.19,.79,.035);
    b.box(m.iron,x,2.08,z+.41,.25,4.10,.16,.019);
    b.box(m.rust,x,2.08,z+.51,.237,4.02,.048,.010);
    b.box(m.iron,x,.32,z+.46,.41,.63,.22,.024);
    for(let y=.18;y<4.12;y+=.294) {
      faceBolt(b,m,x-.058,y,z+.546,1,.023);
      faceBolt(b,m,x+.062,y,z+.546,1,.023);
    }
    plane(b,stripe,x,.82,z+.546,.195,1.18);
  }
  b.box(m.black,center,.015,z,width+.04,.034,.55,.01);
  for(let x=portal.x0+.032;x<portal.x1;x+=.073) b.box(m.iron,x,.038,z,.026,.037,.508,.003,undefined,false);
  b.box(m.black,center,4.11,z+.46,2.74,.38,.17,.021);
  plane(b,sign('TURBINE HALL',{ink:'#ded7be',base:'#333e3d',sub:'NORTH CAPE  /  07',border:true,aspect:4.3}),center,4.12,z+.551,2.61,.36);
  b.box(m.black,center,3.877,z+.1,.91,.15,.28,.021);
  b.box(m.hot,center,3.823,z+.206,.67,.051,.098,.013);
  b.box(m.iron,center,3.782,z+.20,.85,.028,.049,.008);
  const light = new T.SpotLight(0xffb775,116,9.4,.88,.62,2);
  light.position.set(center,3.68,z+.39);
  light.target.position.set(center-.81,.16,z+3.49);
  light.castShadow=true;
  light.shadow.mapSize.set(1024,1024);
  light.shadow.camera.near=.18;
  light.shadow.bias=-.0004;
  light.shadow.normalBias=.026;
  scene.add(light,light.target);

  const label=sign('07',{ink:'#dacfad',sub:'AUTHORIZED ACCESS',aspect:1.3});
  plane(b,label,2.43,2.15,z+.277,1.06,.82);
  for (const x of [-5.18,2.78]) {
    b.box(m.black,x,2.55,z+.295,.18,1.93,.11,.017);
    b.box(m.olive,x,2.13,z+.394,.37,.57,.23,.029);
    b.box(m.iron,x,2.13,z+.513,.326,.48,.043,.017);
    for(const off of [-.11,.11]) faceBolt(b,m,x+off,2.31,z+.541);
    b.box(m.signal,x,2.27,z+.544,.113,.031,.017,.007);
    b.tube(m.rubber,[[x,2.98,z+.35],[x+.27,3.18,z+.372],[x+.85,3.26,z+.398],[x+1.20,3.64,z+.331]],.026,26,10);
  }
}

function detailShell(b,m) {
  const holes = decal(canvasMap(256,256,(c,w,h)=>{
    const rng=random(1718);
    const g=c.createRadialGradient(w*.49,h*.38,3,w*.50,h*.47,w*.46);
    g.addColorStop(0,'#222520');g.addColorStop(.25,'#2b2e29');g.addColorStop(.34,'#987e67');
    g.addColorStop(.46,'#645e4b6e');g.addColorStop(.77,'#6a52342b');g.addColorStop(1,'#6a541700');
    c.fillStyle=g;c.fillRect(0,0,w,h);
    c.globalCompositeOperation='destination-out';
    for(let i=0;i<5150;i++) c.fillRect(rng()*w,rng()*h,2+rng()**2*4,1+rng()**4*4);
  }),.74);
  const leaks = [decal(grimeMap(41,true),.87),decal(grimeMap(88,true),.78)];
  const rng=random(38);
  for (const x of [-7.652,7.662]) {
    const rotation=x<0 ? left : right;
    const direction=-Math.sign(x);
    for(const y of [.96,2.09,3.12]) {
      b.box(m.edge,x+direction*.004,y,-9.3,.013,.008,35.1,0,undefined,false);
      for(let z=6.78;z>-26;z-=1.20) if(rng()>.11) {
        const size=.070+rng()*.05;
        plane(b,holes,x+direction*.014,y+.42,z+rng()*.075,size,size,rotation);
      }
    }
    for(let z=6.0;z>-26;z-=3.59) {
      b.box(m.edge,x+direction*.006,2.23,z,.016,3.66,.013,0,undefined,false);
      plane(b,leaks[rng()>.5?1:0],x+direction*.023,1.56,z-.1,1.34+rng()*.64,2.82+rng()*.51,rotation);
    }
  }
  for(const opening of openings) {
    const {z,half} = opening;
    const frames = [-half+.042,-.68,0,.68,half-.042].sort((a,b)=>a-b);
    const glass = new T.MeshPhysicalMaterial({
      color:0x748c86,roughness:.21,metalness:.20,transparent:true,opacity:.17,depthWrite:false,side:T.DoubleSide
    });
    for(let c=0;c<frames.length-1;c++) for(let row=0;row<3;row++) {
      const from=frames[c]+.036,to=frames[c+1]-.036;
      const y=4.39+row*.99;
      if(rng()>.54) {
        const vertices=new Float32Array([
          -7.912,y,z+from, -7.912,y,z+to, -7.912,y+.91,z+to,
          -7.912,y,z+from, -7.912,y+.91,z+to, -7.912,y+.91,z+from
        ]);
        const g=new T.BufferGeometry();
        g.setAttribute('position',new T.BufferAttribute(vertices,3));
        g.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1],2));
        g.computeVertexNormals();
        b.add(g,glass,null,null,false);
      } else {
        const g=new T.BufferGeometry();
        g.setAttribute('position',new T.Float32BufferAttribute([
          -7.911,y,z+from, -7.911,y,z+to, -7.911,y+.20+rng()*.28,z+from+(to-from)*.42,
          -7.911,y+.91,z+from, -7.911,y+.57+rng()*.30,z+from+(to-from)*.41, -7.911,y+.91,z+to
        ],3));
        g.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,.5,.3,0,1,.4,.6,1,1],2));
        g.computeVertexNormals();
        b.add(g,glass,null,null,false);
      }
    }
  }
  for(const z of [5.1,-1.56,-8.35,-15.21,-22.3]) {
    b.box(m.iron,6.83,3.46,z,1.37,.20,.27,.018);
    b.pipe(m.iron,[7.38,2.66,z],[6.02,3.59,z],.071,9,.071,true);
    b.box(m.black,7.56,2.71,z,.12,.36,.36,.016);
  }
  const ladderZ=-10.38;
  for(const z of [ladderZ-.27,ladderZ+.27]) b.pipe(m.iron,[7.39,.3,z],[7.39,4.21,z],.035,12);
  for(let y=.34;y<4.16;y+=.278) b.pipe(m.iron,[7.37,y,ladderZ-.274],[7.37,y,ladderZ+.274],.021,10);
}

function scarring(b,m) {
  const rand=random(816);
  const crack=decal(canvasMap(512,512,(c,w,h)=>{
    const r=random(120);
    const walk=(x,y,len,angle,depth)=>{
      c.beginPath();c.moveTo(x,y);
      for(let k=0;k<len;k++) {
        x+=Math.cos(angle)*(4+r()*15); y+=Math.sin(angle)*(4+r()*15); angle+=(r()-.5)*.74;
        c.lineTo(x,y);
        if(!depth&&k%6===4) walk(x,y,5,angle+(r()>.5?1:-1)*.93,1);
      }
      c.strokeStyle=depth?'#272724af':'#292c288d';
      c.lineWidth=depth?1.2:2.3;c.stroke();
    };
    for(let i=0;i<8;i++) walk(w*.14+r()*140,h*.28+r()*210,8+r()*15,r()*6.28,0);
  }),.74);
  for(let i=0;i<21;i++) {
    const x=(rand()-.5)*13.2,z=11.95-rand()*38.45;
    plane(b,crack,x,.007,z,1.4+rand()*2.3,1.2+rand()*1.4,[-Math.PI/2,0,rand()*6.28]);
  }
  for(const z of [5.34,-2.41,-12.42,-21.36]) {
    for(const x of [-2.63,2.95]) {
      b.box(m.iron,x,.011,z,.19,.018,.58,.006,undefined,false);
      for(const end of [-.23,.23]) b.pipe(m.gunMetal,[x,.017,z+end],[x,.023,z+end],.022,7,.022,false);
    }
  }
  for(const [i,c] of machines.entries()) {
    const x=c.x-1.68,z=c.z;
    for(let j=0;j<12;j++) {
      const a=j*Math.PI/6;
      const y=1.51+Math.sin(a)*.82, az=z+Math.cos(a)*.82;
      b.pipe(m.rust,[x+.19,y,az],[x+.105,y,az],.053,10);
      b.pipe(m.silver,[x+.109,y,az],[x+.075,y,az],.039,6);
    }
    const name=['PRESSURE','RETURN','DRAIN'][i];
    plane(b,sign(name,{ink:'#ddd2ae',base:'#393d35',sub:'SERVICE LOOP / 07',aspect:3.2}),x+.89,2.64,z+1.16,.92,.26);
    for(const k of [-1,1]) {
      const zz=z+k*1.73;
      b.box(m.rust,c.x-.53,.305,zz,.65,.079,.27,.016);
      for(const dx of [-.21,.21]) b.pipe(m.gunMetal,[c.x-.53+dx,.34,zz],[c.x-.53+dx,.392,zz],.047,8);
    }
  }
}

function switchgear(b,m,stripe) {
  const {x0,x1,z0,z1,y1}=equipment;
  const x=(x0+x1)/2,z=(z0+z1)/2,width=x1-x0;
  b.box(m.edge,x,.087,z,width+.01,.174,z1-z0+.012,.036);
  coatedPart(b,m.hall.paint,x,1.14,z,width-.075,2.12,z1-z0-.066,.044,6.27,.49);
  for(let i=0;i<3;i++) {
    const xx=x0+(i+.5)*width/3;
    for(const side of [-1,1]) {
      const zz=z+side*.68;
      b.box(m.iron,xx,1.16,zz,.725,1.98,.048,.021);
      coatedPart(b,i===1?m.hall.paint:m.hall.panel,xx,1.16,zz+side*.030,
        .671,1.89,.059,.018,.27+i*6.31+(side<0?8.0:0.),.42+i*.16);
      b.box(m.black,xx,1.343,zz+side*.047,.291,.131,.022,.009);
      b.box(m.gunMetal,xx,1.344,zz+side*.060,.269,.091,.027,.008);
      b.box(m.black,xx,1.346,zz+side*.076,.196,.049,.010,.004);
      b.box(m.silver,xx,1.318,zz+side*.089,.172,.017,.019,.005,undefined,false);
      for(const y of [.53,1.77]) {
        const hinge=xx-.291;
        b.box(m.iron,hinge,y,zz+side*.066,.078,.154,.032,.012);
        b.pipe(m.gunMetal,[hinge-.016,y-.076,zz+side*.093],[hinge-.016,y+.079,zz+side*.093],.014,10);
      }
      b.pipe(m.bronze,[xx+.207,1.35,zz+side*.06],[xx+.207,1.35,zz+side*.084],.016,10);
      b.box(m.black,xx,.61,zz+side*.064,.530,.492,.009,.008);
      for(let y=.402;y<.822;y+=.047)
        b.box(m.iron,xx,y,zz+side*.076,.507,.025,.036,.004,[side*.47,0,0],false);
      const id=sign('Q'+(i+1),{ink:'#d5c9ac',sub:'FEEDER 07',base:'#3e443f',aspect:2.2,seed:162+i});
      if(side>0)plane(b,id,xx,1.751,zz+.065,.271,.127);
      faceBolt(b,m,xx-.277,1.97,zz+side*.064,side);
      faceBolt(b,m,xx+.276,1.97,zz+side*.064,side);
    }
  }
  b.box(m.iron,x,y1-.05,z,width,.089,z1-z0,.016);
  plane(b,stripe,x,.194,z1+.012,width*.89,.096);
  plane(b,sign('480 V',{base:'#a78950',ink:'#272b2a',sub:'BAY B / FEEDER',aspect:2.1}),x,1.55,z1+.048,.29,.137);
  for (const dx of [-.62,0,.62]) {
    b.tube(m.black,[[x+dx,y1,z],[x+dx,y1+.39,z-.14],[x+dx*.96,2.92,z-.65],[x+.81,3.46,z-.98],[x+2.22,3.64,z-1.24],[5.62,3.72,z-1.78]],.033,36,10);
  }
  b.box(m.iron,x+.49,3.51,z-1.02,1.94,.077,.33,.012);
}

export function terminalScreen(name, draw) {
  const map = canvasMap(384,256,()=>{});
  const ctx=map.image.getContext('2d');
  let key;
  return {
    material:new T.MeshBasicMaterial({map}),
    update(status) {
      if (key===status) return;
      key=status;
      const color=status==='ready'||status==='flow'?'#91e0ba':status==='running'?'#acece0':'#eeb47f';
      ctx.fillStyle='#101a1a';ctx.fillRect(0,0,384,256);
      ctx.strokeStyle='#678579';ctx.lineWidth=2;ctx.strokeRect(9,9,366,238);
      ctx.fillStyle=color;ctx.font='700 24px Consolas';
      ctx.fillText(name,27,43);
      ctx.font='700 42px Consolas';
      ctx.fillText(draw[status],27,111);
      ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
      for(let i=0;i<=38;i++) {
        const x=28+i*8.3;
        const y=184+Math.sin(i*.56)*8+Math.sin(i*1.72)*5-(i%13===5?21:0);
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();
      ctx.fillStyle='#b1c1af';ctx.font='20px Consolas';ctx.fillText('N. CAPE   •   UNIT 07',27,225);
      map.needsUpdate=true;
    }
  };
}

function instruments(scene,b,m) {
  const {x,z}=relay;
  b.box(m.edge,x,.115,z,1.19,.23,.75,.046);
  b.box(m.olive,x,.874,z,1.06,1.54,.61,.037);
  b.box(m.iron,x,1.635,z,1.25,.53,.67,.051);
  b.box(m.black,x,1.68,z+.343,1.08,.35,.042,.014);
  b.box(m.iron,x-.167,1.684,z+.363,.613,.310,.036,.015);
  b.box(m.black,x-.170,1.685,z+.385,.580,.279,.030,.010);
  b.box(m.rust,x,1.283,z+.326,1.11,.089,.13,.013);
  const screen = terminalScreen('HYDRAULIC BYPASS',{locked:'ISOLATED',ready:'ONLINE',running:'PRIMING'});
  plane(b,screen.material,x-.173,1.686,z+.402,.550,.253);
  b.pipe(m.iron,[x+.429,1.782,z+.362],[x+.429,1.782,z+.412],.047,16,.046,false);
  const lamp=place(scene,new T.SphereGeometry(.031,20,14),m.redLamp,x+.429,1.782,z+.416);
  b.box(m.orange,x+.312,1.623,z+.369,.279,.161,.060,.012);
  b.box(m.black,x+.312,1.625,z+.405,.235,.126,.029,.011);
  const selector=new T.Group();
  selector.position.set(x+.310,1.625,z+.430);
  scene.add(selector);
  const turn=batches(selector);
  turn.pipe(m.iron,[0,0,-.012],[0,0,.014],.038,24,.038,false);
  turn.box(m.gunMetal,0,0,.019,.094,.028,.033,.008,undefined,false);
  turn.box(m.orange,.035,0,.035,.016,.011,.005,.003,undefined,false);
  turn.finish();
  const selectorText=sign('ARM',{ink:'#d8c6a3',sub:'PRIME',aspect:1.65});
  plane(b,selectorText,x+.220,1.628,z+.422,.073,.044);
  plane(b,sign('B–07',{ink:'#c1b9a1',aspect:2.7}),x+.268,1.773,z+.375,.102,.045);
  for(const xx of [x-.49,x+.49]) for(const yy of [1.51,1.85]) faceBolt(b,m,xx,yy,z+.369);
  for(const yy of [.38,.44,.50,.56,.62]) b.box(m.black,x,yy,z+.316,.73,.014,.022,.003,undefined,false);
  for(const off of [-.23,.19,.36]) {
    b.tube(m.rubber,[[x+off,.75,z-.3],[x+off,.36,z-.53],[x+off-.9,.09,z-.67],[x+off-1.54,.07,z-.81],[-7.52,.34,z-.91]],.026,28,9);
  }
  const panelTag=sign('BYPASS',{ink:'#ddd6b1',base:'#4f5344',sub:'ACTUATOR PRESSURE',border:true,aspect:2.8});
  b.box(m.black,-7.59,2.9,z+.11,.13,.43,1.37,.018);
  plane(b,panelTag,-7.514,2.9,z+.11,1.30,.39,left);

  b.box(m.edge,cache.x,.126,cache.z,1.20,.25,.82,.045);
  b.box(m.olive,cache.x,.60,cache.z,1.19,.96,.78,.047);
  b.box(m.orange,cache.x,.99,cache.z,1.23,.148,.81,.039);
  b.box(m.black,cache.x,.62,cache.z+.406,1.02,.53,.034,.022);
  for (const dx of [-.457,.457]) b.box(m.gunMetal,cache.x+dx,.58,cache.z+.426,.062,.37,.054,.010);
  plane(b,sign('SERVICE KIT',{ink:'#d6cfad',sub:'CELLS / SEALS',aspect:2.75}),cache.x,.65,cache.z+.428,.78,.30);
  const cacheLamp=place(scene,new T.SphereGeometry(.038,12,10),m.signal,cache.x+.40,1.081,cache.z+.267);
  return { update(run) {
    screen.update(run.relayOn?'ready':run.action==='relay'?'running':'locked');
    lamp.material=run.relayOn?m.greenLamp:run.action==='relay'?m.amber:m.redLamp;
    selector.rotation.z=run.relayOn?-.94:.94-1.88*T.MathUtils.smoothstep(run.action==='relay'?run.actionTime:0,0,relay.hold);
    cacheLamp.visible=!run.cacheUsed;
  } };
}

export function buildStructures(scene,b,m) {
  const stripe=hazard();
  portalFrame(scene,b,m,stripe);
  detailShell(b,m);
  scarring(b,m);
  switchgear(b,m,stripe);
  const controls=instruments(scene,b,m);
  // Repair lines climb from the bypass unit into the actuator overhead.
  for (const [i,x] of [-4.45,-4.24].entries()) {
    b.tube(i?m.iron:m.bronze,[[x,.29,-17.74],[x,.29,-18.78],[x,.38,-20.71],[x,1.64,-21.21],[x,3.55,-22.54],[x,5.54,-24.04],[x*.82,6.33,-26.43]],.058,52,14);
  }
  return controls;
}

