import * as T from 'three';
import { batches, canvasMap, decal, grimeMap, place, stenciled, v3 } from './art.mjs';
import { loft } from './shape.mjs';
import { droneSites } from './layout.mjs';
import { droneOptic, traceSurface, traceWorld } from './sim.mjs';

const clamp=T.MathUtils.clamp;
const sense=new T.Vector3();
const axis=v3(0,1,0);

function shroud(b,m,side,armored) {
  const x=side*.52;
  const center=[x,.024,-.043];
  const tilt=[Math.PI/2,0,side*.115];
  const radius=armored?.214:.201;
  for(const [r,d,h,mat] of [[radius,.038,-.003,m.gunMetal],[radius+.003,.012,.031,m.silver],[radius-.027,.016,.041,m.black]]) {
    b.add(new T.TorusGeometry(r,d,10,36),mat,[x,h,center[2]],tilt,false);
  }
  b.pipe(m.black,[x,-.073,center[2]],[x,.047,center[2]],.065,20,.074,false);
  b.pipe(m.gunMetal,[x,.030,center[2]],[x,.072,center[2]],.078,24,.078,false);
  for(let i=0;i<6;i++) {
    const a=i*Math.PI/3,xx=x+Math.cos(a)*.144,zz=center[2]+Math.sin(a)*.144;
    b.pipe(m.gunMetal,[xx,.045,zz],[xx,.057,zz],.014,8,.014,false);
    b.pipe(m.black,[xx,.056,zz],[xx,.061,zz],.008,6,.008,false);
  }
  b.box(m.black,side*.354,-.058,-.066,.214,.095,.232,.021,undefined,false);
  b.box(armored?m.burgundy:m.ceramic,side*.346,.065,-.066,.245,.122,.218,.028,[0,side*.26,-side*.105],false);
  for(const shift of [-.037,.040]) {
    b.tube(m.rubber,[[side*.21,.039,-.151+shift],[side*.32,-.013,-.201+shift],[side*.42,-.082,-.148+shift],[x,-.083,-.132+shift]],.014,22,8,false);
  }
  for(const d of [-.087,.092]) {
    const strut=x+side*.129;
    b.box(m.gunMetal,strut,-.013,center[2]+d,.159,.038,.056,.011,[0,side*d*4,side*.06],false);
    b.box(m.black,strut+side*.041,-.009,center[2]+d,.035,.024,.054,.008,undefined,false);
  }
  b.box(m.gunMetal,x,.025,.149,.104,.044,.026,.009,undefined,false);
  b.box(m.signal,x,.026,.164,.062,.019,.012,.004,undefined,false);
}

function rotor(root,m,x) {
  const blade=new T.Group();
  blade.position.set(x,.012,-.043);
  root.add(blade);
  const b=batches(blade);
  for(let i=0;i<4;i++) {
    const a=i*Math.PI/2;
    b.box(m.graphite,Math.cos(a)*.105,0,Math.sin(a)*.105,.14,.012,.041,.005,[.23,Math.PI*2-a,0],false);
    b.box(m.silver,Math.cos(a)*.169,0,Math.sin(a)*.169,.024,.012,.032,.004,[.23,Math.PI*2-a,0],false);
  }
  b.finish();
  const rotation=place(blade,new T.RingGeometry(.066,.178,32),new T.MeshBasicMaterial({
    color:0x555b53, transparent:true, opacity:.15, side:T.DoubleSide,depthWrite:false
  }),0,.004,0);
  rotation.rotation.x=Math.PI/2;
  return blade;
}

function makeSurveyor(scene,m,site,id,shadowMaterial) {
  const root=new T.Group();
  const b=batches(root);
  const armored=site.role==='warden';
  const accent=armored?m.burgundy:id===0?m.ceramic:m.orange;
  b.add(loft([
    [-.302,.123,.079,-.014],[-.256,.170,.111,-.004],[-.177,.212,.139],
    [-.044,.229,.153,.001],[.104,.215,.141,.002],[.201,.163,.109,-.005],
    [.264,.129,.078,-.008],[.292,.097,.064,-.009]
  ]),m.graphite,null,null,false);
  b.add(loft([
    [-.216,.176,.029,.094],[-.166,.196,.040,.117],[-.036,.204,.042,.129],
    [.104,.175,.047,.118],[.207,.122,.038,.092],[.246,.092,.020,.067]
  ],28,.57),accent,null,null,false);
  for(const side of [-1,1]) {
    shroud(b,m,side,armored);
    b.box(m.gunMetal,side*.142,-.075,.168,.145,.107,.20,.029,[0,side*.43,side*.19],false);
    if(armored) {
      b.box(m.burgundy,side*.190,.007,.198,.126,.228,.18,.036,[.12,side*.4,side*.31],false);
      b.box(m.gunMetal,side*.204,.005,.27,.068,.191,.044,.016,[.12,side*.4,side*.31],false);
    }
    for(let j=0;j<7;j++) b.box(m.black,side*.135+(j-3)*.012,.122,.086+j*.010,.005,.014,.040,.002,[.1,side*.3,side*.37],false);
    b.tube(m.bronze,[[side*.093,-.101,-.154],[side*.18,-.12,-.083],[side*.233,-.103,.028],[side*.241,-.055,.085]],.016,18,10,false);
    b.box(m.gunMetal,side*.180,-.113,.033,.107,.054,.188,.019,undefined,false);
    b.pipe(m.iron,[side*.144,-.026,.228],[side*.144,-.026,.284],.033,16,.033,false);
    b.pipe(m.amber,[side*.144,-.026,.285],[side*.144,-.026,.290],.016,14,.016,false);
  }
  for(const x of [-.109,.109]) {
    b.tube(m.gunMetal,[[x,-.119,-.197],[x,-.168,-.136],[x,-.174,.023],[x,-.153,.132]],
      .012,23,8,false);
    b.box(m.black,x,-.175,-.039,.061,.028,.158,.010,undefined,false);
    for(let j=0;j<6;j++) b.box(m.iron,x,-.165,-.102+j*.021,.071,.009,.008,.002,undefined,false);
  }
  const vane=armored?.178:id===1?.147:.116;
  for(const x of [-vane,vane]) {
    b.box(accent,x,.061,-.223,.035,.073,.145,.009,[.17,0,x*.66],false);
    b.box(m.gunMetal,x,.075,-.289,.043,.037,.030,.009,undefined,false);
    b.pipe(m.iron,[x,.106,-.239],[x,.151,-.269],.028,12,.019,false);
  }
  if(id===0) {
    b.tube(m.black,[[-.059,.143,-.184],[-.078,.174,-.204],[-.095,.203,-.244],[-.118,.209,-.287]],.006,19,8,false);
    b.pipe(m.bronze,[-.116,.209,-.286],[-.130,.211,-.301],.0072,12,.0072,false);
  }
  const shutters=[];
  for(const side of [-1,1]) {
    if(id===1) {
      b.box(m.orange,side*.631,-.105,.005,.117,.315,.295,.048,[0,side*.16,-side*.38],false);
      b.box(m.gunMetal,side*.665,-.146,.039,.052,.212,.241,.025,[0,side*.16,-side*.38],false);
      b.pipe(m.black,[side*.651,-.057,.167],[side*.668,-.060,.216],.043,16,.044,false);
    }
    if(!armored)continue;
    b.pipe(m.gunMetal,[side*.32,-.115,.104],[side*.32,-.115,.292],.105,23,.101,false);
    const insert=new T.MeshBasicMaterial({color:new T.Color(.22,.054,.017)});
    place(root,new T.CylinderGeometry(.066,.066,.014,20),insert,side*.32,-.115,.296).rotation.x=Math.PI/2;
    const shield=new T.Group();
    shield.position.set(side*.384,-.105,.245);
    root.add(shield);
    place(shield,new T.BoxGeometry(.132,.224,.058),m.burgundy,-side*.061,0,.044);
    place(shield,new T.BoxGeometry(.019,.203,.066),m.gunMetal,-side*.119,0,.038);
    for(const y of [-.080,.080]) {
      const bolt=place(shield,new T.CylinderGeometry(.015,.015,.013,10),m.silver,-side*.045,y,.079);
      bolt.rotation.x=Math.PI/2;
    }
    shutters.push({shield,side,insert});
  }
  const faceY=.029;
  for(const [z,r,h,mat] of [[.266,.113,.05,m.gunMetal],[.305,.104,.043,m.black],[.342,.083,.039,m.iron],[.365,.068,.021,m.graphite]]) {
    b.pipe(mat,[0,faceY,z-h/2],[0,faceY,z+h/2],r,36,r,false);
  }
  b.add(new T.TorusGeometry(.064,.006,10,36),m.bronze,[0,faceY,.378],null,false);
  for(let i=0;i<8;i++) {
    const a=i*Math.PI*.25;
    b.pipe(m.silver,[Math.cos(a)*.091,faceY+Math.sin(a)*.091,.332],[Math.cos(a)*.091,faceY+Math.sin(a)*.091,.34],.010,8,.010,false);
  }
  b.box(m.iron,0,-.124,-.057,.17,.068,.156,.024,undefined,false);
  b.box(m.black,0,-.148,-.034,.082,.022,.062,.009,undefined,false);
  const serial = decal(stenciled('0'+(id+1),{ink:'#263430',sub:site.role.toUpperCase(),aspect:1.38,seed:73+id}),1,true);
  b.add(new T.PlaneGeometry(.133,.082),serial,[0,.174,.044],[-Math.PI/2,0,0],false);
  b.finish();
  const coreMat=new T.MeshBasicMaterial({color:new T.Color(.94,.17,.065)});
  const lens=place(root,new T.SphereGeometry(.056,26,14),coreMat,0,faceY,.382);
  lens.scale.z=.44;
  const iris=place(root,new T.TorusGeometry(.046,.0036,10,30),m.amber,0,faceY,.395);
  const glass = new T.MeshPhysicalMaterial({
    color:0xa87650,roughness:.15,metalness:.10,clearcoat:1,clearcoatRoughness:.066,transparent:true,opacity:.33,depthWrite:false
  });
  place(root,new T.SphereGeometry(.060,26,16),glass,0,faceY,.395).scale.z=.42;
  const glow=place(root,new T.SphereGeometry(.027,20,12),m.hot,0,faceY,.409);
  const rotors=[rotor(root,m,-.52),rotor(root,m,.52)];
  const sensor=place(root,new T.SphereGeometry(.0145,18,12),
    new T.MeshBasicMaterial({color:new T.Color(.20,1.5,1.1)}),-.087,.014,.322);
  sensor.scale.set(1,.72,.50);
  const shadow=place(scene,new T.PlaneGeometry(2.30,1.5),shadowMaterial,0,.014,0);
  shadow.rotation.x=-Math.PI/2;
  root.scale.setScalar(armored?1.16:1);
  scene.add(root);
  return {root,lens,iris,glow,sensor,rotors,shadow,shutters,death:-Infinity,spin:id*.51,grounded:false,
    struck:-Infinity,push:v3(),stagger:0,landing:.276};
}

function tracers(scene,count) {
  const items=[];
  const aura=new T.MeshBasicMaterial({color:new T.Color(5.5,1.4,.27),transparent:true,opacity:.38,depthWrite:false,blending:T.AdditiveBlending});
  const core=new T.MeshBasicMaterial({color:new T.Color(7.3,2.83,.61)});
  const handle=new T.MeshBasicMaterial({color:new T.Color(1.4,.085,.025),transparent:true,opacity:.32,blending:T.AdditiveBlending,depthWrite:false});
  const tracerBody=new T.CylinderGeometry(.012,.024,1,9);
  const tracerAura=new T.CylinderGeometry(.036,.062,1,10);
  const laser=new T.CylinderGeometry(.010,.002,1,8);
  for(let i=0;i<count;i++) {
    const group=new T.Group();
    const light=place(group,tracerBody,core);
    place(group,tracerAura,aura);
    group.visible=false;
    light.renderOrder=6;
    scene.add(group);
    items.push(group);
  }
  const beams=droneSites.map(()=>{
    const beam=place(scene,laser,handle.clone());
    beam.visible=false;
    return beam;
  });
  return {items,beams};
}

export function surveyors(scene,m) {
  const ghost=new T.MeshBasicMaterial({map:grimeMap(376),transparent:true,depthWrite:false,opacity:.72});
  const models=droneSites.map((site,i)=>makeSurveyor(scene,m,site,i,ghost));
  const {items,beams}=tracers(scene,14);
  return {
    contact(event,run) {
      const o=models[event.id],d=run.drones[event.id];
      o.struck=run.time;
      o.push.set(event.ray.x,event.ray.y,event.ray.z);
      o.stagger=event.part==='optic'?1:event.part==='armor'?.26:.63;
      if(event.kind==='kill') {
        o.death=run.time;
        const support=traceSurface(d,{x:0,y:-1,z:0},d.y+.02,run);
        o.landing=Math.min(d.y,d.y-support.depth+.255);
      }
    },
    reset() {
      for(const model of models) {
        model.death=model.struck=-Infinity;
        model.grounded=false;
      }
    },
    update(run,dt,onCrash) {
      for(const d of run.drones) {
        const o=models[d.id], t=run.time, broken=!d.health;
        const age=t-o.death;
        o.root.visible = o.shadow.visible = !broken || age!==Infinity;
        const moving=d.state!=='docked' && (!broken||age<.52);
        const tilt=(o.root.visible&&moving)?clamp(d.vx*.085,-.25,.25):0;
        const fall=broken?Math.min(.9,age):0;
        const settled=broken&&age!==Infinity&&d.y-fall*fall*6.9<o.landing;
        const collisionTime=Math.sqrt(Math.max(0,d.y-o.landing)/6.9);
        const tail=settled?Math.max(0,age-collisionTime):0;
        const bounce=settled?Math.max(0,Math.sin(tail*19.5))*.073*Math.exp(-11*tail):0;
        const drift=Math.min(fall,collisionTime)*.40;
        const hitAge=t-o.struck;
        const recoil=(1-Math.exp(-hitAge*52))*Math.exp(-hitAge*9.4)*o.stagger;
        o.root.position.set(d.x+drift*d.vx+o.push.x*recoil*.089,
          broken?Math.max(o.landing,d.y-fall*fall*6.9)+bounce:d.y+o.push.y*recoil*.089,
          d.z+drift*d.vz+o.push.z*recoil*.089);
        if(settled&&!o.grounded) {
          o.grounded=true;
          onCrash?.(o.root.position);
        }
        const shiver=moving&&d.state==='charge'?Math.sin(33*t)*d.charge*.008:0;
        const side=o.push.x*Math.cos(d.yaw)-o.push.z*Math.sin(d.yaw);
        o.root.rotation.set((moving?Math.sin(t*4.7+d.id)*.063+d.vz*.039+shiver:0)+recoil*.30,
          d.yaw-side*recoil*.17,tilt+fall*.92-shiver*.53+side*recoil*.37);
        o.shadow.position.set(d.x,.014,d.z);
        o.shadow.scale.set(1+Math.max(0,d.y-1.0)*.24,1+Math.max(0,d.y-1.0)*.14,1);
        const charge=d.state==='charge'?d.charge:0;
        const blink=t<d.blinkUntil;
        const hot=broken?Math.max(0,1-age*3.4):d.state==='docked'?.09:1;
        o.lens.material.color.setRGB(hot*(.56+charge*4.8+Number(blink)*2.7),hot*(.13+charge*1.3+Number(blink)*1.4),hot*(.055+charge*.32));
        o.iris.visible=Boolean(hot>.16);
        const nav=hot*(.19+.81*(.5+.5*Math.sin(t*7.1+d.id*1.4))**4);
        o.sensor.material.color.setRGB(nav*.24,nav*1.64,nav*1.23);
        o.glow.visible=charge>.26;
        o.glow.scale.setScalar(.47+charge*.91);
        for(const {shield,side,insert} of o.shutters) {
          const load=broken?Math.max(0,1-fall*2)*.6:charge;
          shield.rotation.y=side*T.MathUtils.smoothstep(load,0,.39)*1.22;
          insert.color.setRGB(.18+load*3.3,.041+load*.48,.013+load*.052);
        }
        o.spin+=dt*(broken?28*Math.exp(-10*fall):moving?36+charge*39:0);
        o.rotors[0].rotation.y=o.spin;
        o.rotors[1].rotation.y=-o.spin;
        const beam=beams[d.id];
        beam.visible=Boolean(d.target&&charge>.37);
        if(beam.visible) {
          const start=droneOptic(d);
          sense.set(d.target.x-start.x,d.target.y-start.y,d.target.z-start.z);
          const distance=sense.length();
          sense.normalize();
          const length=traceWorld(start,sense,distance,run);
          beam.position.set(start.x,start.y,start.z).addScaledVector(sense,length/2);
          beam.scale.set(1,length,1);
          beam.quaternion.setFromUnitVectors(axis,sense);
          beam.material.opacity=.12+charge*.28;
        }
      }
      items.forEach((mesh,i)=>{
        const b=run.bolts[i];
        mesh.visible=Boolean(b);
        if(!b)return;
        sense.set(b.dx,b.dy,b.dz);
        const length=Math.max(.13,Math.min(b.age*b.speed, b.power>25?.87:.59));
        mesh.position.set(b.x,b.y,b.z).addScaledVector(sense,-length*.31);
        mesh.scale.set(b.power>25?1.18:1,length,1);
        mesh.quaternion.setFromUnitVectors(axis,sense);
      });
    }
  };
}

