import * as T from 'three';
import { batches, boxGeo, canvasMap, decal, place, random, v3 } from './art.mjs';
import { loft, tendon } from './shape.mjs';

function maker(b) {
  return (mat,x,y,z,w,h,d,r=.006,rotation) => b.add(boxGeo(w,h,d,r,.178),mat,[x,y,z],rotation,false);
}
function cap(b,m,center,size=.008) {
  const [x,y,z]=center;
  b.pipe(m.gunMetal,[x,y,z],[x,y,z+.0028],size,12,size,false);
  b.pipe(m.black,[x,y,z+.0025],[x,y,z+.0032],size*.46,6,size*.46,false);
}
function vent(b,m,side) {
  const rect=maker(b);
  for(let i=0;i<11;i++) {
    const z=-.453+i*.0224;
    rect(m.gunMetal,side*.073,-.001,z,.012,.058,.011,.002,[.30,0,0]);
    rect(m.black,side*.080,-.018,z+.004,.003,.033,.006,.001,[.24,0,0]);
    if(i%4===0) rect(m.bronze,side*.077,.023,z-.006,.006,.009,.009,.001);
  }
}

function makeGrip(root,b,m) {
  const rect=maker(b);
  const grip=loft([
    [-.060,.026,.028,-.042],[-.044,.033,.048,-.078],
    [.015,.039,.074,-.127],[.039,.041,.076,-.125],[.085,.034,.063,-.115],[.106,.028,.042,-.084]
  ],24,.64);
  b.add(grip,m.rubber,null,null,false);
  for(let j=0;j<11;j++) {
    const y=-.176+j*.009;
    for(const x of [-.035,.035]) rect(m.graphite,x,y,.037,.006,.0039,.082,.001,[-.15,0,0]);
  }
  rect(m.graphite,0,-.078,-.053,.044,.111,.039,.011,[.34,0,0]);
  b.tube(m.gunMetal,[[0,-.063,-.086],[0,-.14,-.08],[0,-.165,-.047],[0,-.161,.026],[0,-.114,.05]],.009,26,9,false);
  const trigger = place(root,new T.TorusGeometry(.026,.004,8,20,Math.PI*.68),m.gunMetal,0,-.095,-.019);
  trigger.rotation.y=Math.PI/2;
}

function opticalUnit(root,b,m) {
  const rect=maker(b);
  rect(m.graphite,0,.075,-.049,.100,.034,.121,.012);
  const sightY=.124;
  const frame=new T.Shape();
  const outer=.043, inner=.030;
  frame.absarc(0,0,outer,0,Math.PI*2,false);
  const hole=new T.Path();
  hole.absarc(0,0,inner,0,Math.PI*2,true);
  frame.holes.push(hole);
  const housing=new T.ExtrudeGeometry(frame,{depth:.108,curveSegments:24,bevelEnabled:true,bevelThickness:.003,bevelSize:.002,bevelSegments:2});
  b.add(housing,m.graphite,[0,sightY,-.112],null,false);
  b.add(new T.TorusGeometry(.039,.004,10,38),m.gunMetal,[0,sightY,-.110],null,false);
  b.add(new T.TorusGeometry(.039,.0035,10,38),m.gunMetal,[0,sightY,-.002],null,false);
  b.add(new T.TorusGeometry(.0316,.0017,6,38),m.black,[0,sightY,-.089],null,false);
  b.add(new T.TorusGeometry(.0321,.0014,7,38),m.bronze,[0,sightY,-.013],null,false);
  for(let j=0;j<24;j++) {
    const angle=j*Math.PI/12;
    rect(m.gunMetal,Math.cos(angle)*.042,sightY+Math.sin(angle)*.042,-.012,.0041,.0039,.017,.001,[0,0,angle]);
  }
  for(const x of [-.034,.034]) rect(m.gunMetal,x,sightY+.009,-.051,.014,.032,.083,.004);
  rect(m.graphite,0,sightY+.037,-.052,.047,.012,.044,.005);
  const glass = new T.MeshPhysicalMaterial({
    color:0x677a79,metalness:.28,roughness:.12,transparent:true,opacity:.16,depthWrite:false,
    side:T.DoubleSide,clearcoat:1,clearcoatRoughness:.13
  });
  const lens=place(root,new T.CircleGeometry(.0295,36),glass,0,sightY,-.076);
  lens.rotation.x=-.145;
  const coat=glass.clone();
  coat.color.setHex(0x468d9e);coat.opacity=.10;
  place(root,new T.CircleGeometry(.029,38),coat,0,sightY,-.017).rotation.x=.11;
  rect(m.black,-.041,sightY,-.038,.016,.036,.038,.006);
  b.pipe(m.gunMetal,[.040,sightY+.002,-.055],[.063,sightY+.002,-.055],.015,22,.016,false);
  b.pipe(m.black,[.062,sightY+.002,-.055],[.066,sightY+.002,-.055],.011,19,.011,false);
  for(const y of [sightY-.005,sightY+.001,sightY+.008])
    rect(m.silver,.066,y,-.054,.0014,.0013,.015,.00025);
  for(let i=0;i<9;i++) rect(m.gunMetal,-.050,sightY-.015+i*.004,-.038,.004,.0015,.027,.001);
  const dot=place(root,new T.SphereGeometry(.00165,10,8),m.amber,0,sightY,-.065);
  dot.visible=false;
  return {dot,sightY};
}

function gloveRig(root,m,side,pointing=false,lever=false) {
  const hand=new T.Group();
  root.add(hand);
  const b=batches(hand),rect=maker(b);
  const palm=loft([
    [-.067,.028,.015,.009],[-.047,.047,.027,.004],[-.025,.049,.030,.002],
    [.020,.043,.028,0],[.052,.038,.021,-.003],[.070,.033,.016,-.002]
  ],24,.67);
  b.add(palm,m.glove,null,null,false);
  const fingerSizes=[.90,1.0,.96,.79];
  for(let i=0;i<4;i++) {
    const x=(i-1.5)*.0225;
    const depth=.055*fingerSizes[i];
    const start=-.042+i*.0026;
    const points=pointing&&i===1
      ?[[x,.001,start],[x,-.004,start-.027],[x+.001,-.008,start-.050],[x+.002,-.012,start-.066],[x+.002,-.013,-.119]]
      :[[x,-.002,start],[x+.002,-.011,start-depth*.55],[x+.005,-.034,start-depth],[x-.001,-.059,start-depth*.71],[x-.009,-.064,start-depth*.34]];
    b.add(tendon(points,[.0127,.013,.0118,.0105,.0025],.94),m.glove,null,null,false);
    const pad=points[1];
    rect(m.rubber,pad[0],pad[1]+.009,pad[2],.018,.009,.019,.004,[.57,0,0]);
    for(let j=0;j<2;j++) rect(m.gunMetal,x,pad[1]+.011,pad[2]+j*.005,.013,.002,.0016,.0005);
  }
  b.add(tendon([
    [side*.030,.002,.019],[side*.057,-.003,.002],[side*.063,-.020,-.024],
    [side*.045,-.045,-.047],[side*.031,-.047,-.052]
  ],[.019,.017,.014,.012,.003]),m.glove,null,null,false);
  for(const x of [-.026,.020]) {
    rect(m.rubber,x,.027,-.021,.031,.012,.035,.007,[.21,0,-x*1.49]);
    rect(m.graphite,x,.035,-.026,.026,.004,.022,.002,[.19,0,-x*1.49]);
    for(let j=0;j<6;j++) rect(m.bronze,x-.012+j*.005,.034,-.036,.0014,.002,.006,.0005,[.26,0,.36]);
  }
  b.tube(m.cloth,[[-.025,.027,.058],[-.026,.033,.035],[-.027,.034,.013],[-.029,.025,-.011]],.0062,18,8,false);
  b.tube(m.cloth,[[.020,.029,.062],[.021,.032,.039],[.026,.032,.017],[.032,.021,-.013]],.0060,17,8,false);
  for(let j=0;j<8;j++) {
    const z=.061-j*.0068;
    rect(m.bronze,-.032,.022,z,.004,.0011,.0031,.00027,[.05,.33,.13]);
    rect(m.bronze,.033,.023,z,.004,.0011,.0031,.00027,[.05,-.33,-.10]);
  }
  b.tube(m.rubber,[[-.039,.015,.032],[-.041,.021,.009],[-.041,.023,-.015],[-.034,.017,-.042]],.0024,16,8,false);
  b.tube(m.bronze,[[.037,.019,.029],[.042,.021,.007],[.038,.022,-.019],[.032,.012,-.046]],.00105,16,8,false);
  rect(m.rubber,0,.019,.040,.083,.014,.034,.005,[.10,0,0]);
  rect(m.gunMetal,.021,.027,.044,.019,.004,.026,.002);
  b.finish();

  const forearm = new T.Group();
  root.add(forearm);
  const sleeve=batches(forearm);
  const sleeveSections=[
    [-.052,.046,.041],[-.029,.051,.045],[0,.058,.053],
    [.032,.061,.052],[.051,.057,.051],[.077,.062,.055],[.101,.060,.058],
    [.13,.067,.061],[.163,.063,.058],[.206,.072,.068],[.24,.071,.073],
    [.33,.082,.083],[.40,.084,.081],[.50,.093,.090]
  ];
  sleeve.add(loft(sleeveSections,28,.78),m.cloth,null,null,false);
  const seam=maker(sleeve);
  const welt=[];
  for(let i=0;i<22;i++) {
    const z=.012+i*.017;
    const upper=sleeveSections.findIndex(p=>p[0]>z);
    const a=sleeveSections[upper-1],b=sleeveSections[upper],t=(z-a[0])/(b[0]-a[0]);
    const x=T.MathUtils.lerp(a[1],b[1],t)*.873;
    const y=T.MathUtils.lerp(a[2],b[2],t)*.622;
    welt.push([x-.001,y-.001,z]);
    seam(m.glove,x+.0006,y+.0006,z,.0037,.0017,.0087,.00055,[0,0,-.58]);
  }
  sleeve.tube(m.rubber,welt,.0016,34,7,false);
  sleeve.add(loft([[.169,.068,.063],[.175,.070,.065],[.194,.073,.069],[.200,.073,.070]],28,.78),
    m.rubber,null,null,false);
  seam(m.gunMetal,-.024,.068,.185,.022,.008,.024,.003,[0,0,.19]);
  seam(m.cloth,.008,.067,.184,.038,.0035,.022,.002,[0,0,-.15]);
  const cuffs=[
    [-.050,.048,.044],[-.048,.051,.048],[-.027,.056,.050],[-.018,.055,.049]
  ];
  sleeve.add(loft(cuffs,24,.62),m.rubber,null,null,false);
  seam(m.iron,-.023,.044,-.033,.019,.006,.026,.003);
  sleeve.finish();
  const sleeveBack=lever?v3(-.51,-.53,.24):v3(side*.32,-.426,.46);
  const pivot=new T.Vector3(),axis=v3(0,0,1),align=new T.Vector3();
  function pose(x,y,z,rx,ry,rz) {
    hand.position.set(x,y,z);
    hand.rotation.set(rx,ry,rz);
    pivot.set(0,-.009,.077).applyQuaternion(hand.quaternion).add(hand.position);
    forearm.position.copy(pivot);
    forearm.quaternion.setFromUnitVectors(axis,align.copy(sleeveBack).sub(pivot).normalize());
  }
  return {hand,forearm,pose};
}

function cellModel(root,m) {
  const cell=new T.Group();
  root.add(cell);
  const b=batches(cell), box=maker(b);
  b.add(loft([
    [-.066,.034,.046],[-.058,.039,.052],[-.035,.039,.055],
    [.037,.036,.047],[.065,.030,.042]
  ],24,.57),m.graphite,null,null,false);
  box(m.bronze,0,-.030,0,.081,.013,.098,.005);
  box(m.rubber,0,-.048,0,.084,.026,.112,.008);
  for(const x of [-.039,.039]) {
    box(m.rust,x,0,0,.008,.058,.073,.003);
    box(m.signal,x*1.12,.008,-.009,.003,.012,.046,.002);
    for(let j=0;j<5;j++) box(m.black,x*1.16,-.022,.034-j*.014,.003,.016,.005,.001);
  }
  for(const x of [-.024,.002,.029])
    box(m.bronze,x,-.016,-.065,.010,.025,.005,.001);
  box(m.black,0,.037,.004,.067,.015,.111,.004);
  box(m.gunMetal,0,.047,.004,.055,.009,.092,.002);
  for(let j=0;j<7;j++)
    box(m.iron,0,.053,-.034+j*.013,.044,.006,.0036,.001);
  b.finish();
  return cell;
}

export function weapon(camera,m) {
  const root=new T.Group();
  camera.add(root);
  const b=batches(root),rect=maker(b);
  b.add(loft([
    [-.529,.047,.041,.005],[-.499,.062,.046,.005],[-.473,.071,.053,.003],
    [-.408,.074,.059,-.002],[-.277,.076,.064,.001],[-.265,.082,.068,.001],
    [-.167,.084,.074,.005],[-.057,.088,.071,.008],[.014,.081,.071,.008],
    [.101,.073,.068,.007],[.144,.067,.057,.003],[.157,.056,.050]
  ],32,.37),m.graphite,null,null,false);
  b.add(loft([
    [-.555,.033,.029,.003],[-.551,.043,.036,.003],[-.529,.047,.041,.003],
    [-.496,.044,.040,.003],[-.486,.034,.033,.003]
  ],32,.81),m.gunMetal,null,null,false);
  b.add(new T.TorusGeometry(.025,.003,10,28),m.bronze,[0,.003,-.555],null,false);
  b.pipe(m.black,[0,.003,-.555],[0,.003,-.552],.021,30,.021,false);
  b.pipe(m.cold,[0,.003,-.552],[0,.003,-.55],.013,18,.013,false);
  rect(m.gunMetal,0,-.053,-.323,.112,.038,.335,.014);
  rect(m.rubber,0,-.071,-.332,.092,.032,.233,.010);
  rect(m.gunMetal,0,.069,-.297,.119,.024,.325,.008);
  rect(m.rust,0,.072,-.416,.106,.026,.074,.009);
  b.add(loft([
    [.134,.064,.052,.002],[.147,.060,.050,.002],[.165,.054,.046,-.004],
    [.193,.053,.041,-.012],[.217,.049,.036,-.017]
  ],32,.40),m.gunMetal,null,null,false);
  rect(m.black,0,-.020,.223,.100,.081,.017,.009,[-.074,0,0]);
  rect(m.rubber,0,-.020,.233,.098,.079,.013,.009,[-.074,0,0]);
  for(let j=0;j<10;j++) {
    const y=-.054+j*.0072;
    const width=.088-.024*Math.abs(j-4)/5;
    rect(m.graphite,0,y,.240+y*.076,width,.0018,.0018,.0006);
  }
  for(const side of [-1,1]) {
    rect(m.gunMetal,side*.051,.005,.165,.018,.029,.111,.006,[.18,side*.119,0]);
    rect(m.black,side*.062,.008,.171,.005,.015,.077,.002,[.10,side*.12,0]);
    for(const z of [.143,.198])
      b.pipe(m.iron,[side*.056,.012,z],[side*.065,.012,z],.004,10,.004,false);
  }
  rect(m.graphite,0,.046,.133,.089,.023,.192,.008,[.146,0,0]);
  rect(m.rubber,0,.057,.145,.083,.016,.151,.006,[.151,0,0]);
  for(const x of [-.026,.026]) {
    b.tube(m.cloth,[[x,.072,.069],[x,.067,.113],[x,.058,.182],[x,.053,.215]],.0015,16,8,false);
    for(let j=0;j<13;j++) {
      const z=.074+j*.0102;
      rect(m.glove,x,.073-(z-.069)*.136,z,.0027,.0017,.0055,.0004,[.15,0,0]);
    }
  }
  rect(m.gunMetal,0,-.055,-.118,.095,.046,.157,.012);
  for(const side of [-1,1]) {
    vent(b,m,side);
    const x=side*.080;
    const flange=side*.087;
    rect(m.black,flange,.010,-.112,.007,.047,.192,.005);
    rect(m.gunMetal,flange*1.039,.017,-.111,.007,.034,.163,.005);
    for(let i=0;i<6;i++)rect(m.black,flange*1.080,.017,-.175+i*.0185,.002,.018,.010,.001,[.12,0,.05]);
    for(const z of [-.201,-.027]) b.pipe(m.silver,[flange,.013,z],[flange*1.094,.013,z],.0064,11,.0064,false);
    rect(m.gunMetal,x,.028,-.125,.010,.036,.217,.009,[.045,0,0]);
    rect(m.bronze,x*1.05,-.026,-.199,.007,.016,.138,.003);
    rect(m.black,x*1.09,.026,-.043,.006,.014,.074,.003);
    for(const [y,off,span] of [[.040,-.339,.24],[.054,-.264,.105]]) {
      rect(m.iron,side*.058,y,off,.021,.008,span,.002,[.03,side*.047,side*.41]);
      rect(m.gunMetal,side*.067,y-.006,off,.017,.007,span*.96,.002,[.03,side*.047,side*.41]);
    }
    for(const z of [-.199,-.053,.036,.122]) {
      b.pipe(m.gunMetal,[x,.036,z],[x+side*.010,.036,z],.008,12,.008,false);
      b.pipe(m.black,[x+side*.010,.036,z],[x+side*.011,.036,z],.004,6,.004,false);
    }
    for(let j=0;j<5;j++) rect(m.iron,x*.87,-.012,.109+j*.016,.008,.025,.006,.003,[.34,0,0]);
  }
  for(const x of [-.053,.053]) {
    b.tube(m.bronze,[[x,.035,-.505],[x*.99,.051,-.437],[x*1.38,.052,-.328],[x*1.41,.05,-.268]],
      .0028,24,8,false);
    rect(m.iron,x,.026,-.504,.010,.031,.031,.003, [0,.10,0]);
  }
  for(let j=0;j<11;j++) rect(j%5===0?m.gunMetal:m.graphite,0,.083,-.157-j*.028,.120,.013,.016,.003);
  const sight=opticalUnit(root,b,m);
  makeGrip(root,b,m);
  rect(m.graphite,-.075,.097,.114,.072,.054,.061,.010,[0,-.13,0]);
  for(const x of [-.103,-.047]) cap(b,m,[x,.117,.146],.0038);
  b.finish();

  const display=canvasMap(384,192,()=>{});
  const plate=place(root,new T.PlaneGeometry(.060,.0335),new T.MeshBasicMaterial({map:display}),-.076,.098,.149);
  plate.rotation.set(-.26,-.13,.03);
  const glass=place(root,new T.PlaneGeometry(.062,.0351),new T.MeshPhysicalMaterial({
    color:0x87c3af,metalness:.26,roughness:.24,transparent:true,opacity:.13,depthWrite:false
  }),-.076,.099,.150);
  glass.rotation.copy(plate.rotation);
  const sideMark=canvasMap(512,144,(c,w,h)=>{
    const rng=random(413);
    c.fillStyle='#c6c6b4';
    c.font='bold 51px Consolas';c.fillText('AP–07',22,59);
    c.font='700 23px Consolas';c.fillText('ION DRIVE · FIELD UNIT',24,103);
    for(let i=0;i<10;i++) c.fillRect(285+i*12,20,2+i%2,h*.59);
    c.globalCompositeOperation='destination-out';
    for(let i=0;i<1300;i++) c.fillRect(rng()*w,rng()*h,1+rng()*3,1+rng()*3);
  });
  const tag=place(root,new T.PlaneGeometry(.117,.033),decal(sideMark,.93),-.091,.005,-.033);
  tag.rotation.y=-Math.PI/2;
  const cell=cellModel(root,m);
  const collar=new T.Group();
  root.add(collar);
  place(collar,new T.TorusGeometry(.036,.003,8,30),m.bronze,0,.003,-.532);
  place(collar,new T.TorusGeometry(.039,.0011,8,30),m.amber,0,.003,-.538);
  const right=gloveRig(root,m,1),left=gloveRig(root,m,-1);
  const muzzle=new T.Object3D();
  muzzle.position.set(0,.003,-.576);
  root.add(muzzle);
  root.traverse(o=>{o.layers.set(1);o.castShadow=false;o.receiveShadow=false;});
  const interactionArm=new T.Group();
  camera.add(interactionArm);
  const reaching=gloveRig(interactionArm,m,-1,true);
  const holding=gloveRig(interactionArm,m,-1,false,true);
  holding.hand.scale.setScalar(.91);
  holding.forearm.scale.set(.83,.83,1.09);
  const credential=new T.Group();
  credential.position.set(.020,.007,-.089);
  credential.rotation.set(-.28,-.05,.56);
  holding.hand.add(credential);
  const card=batches(credential);
  card.box(m.orange,0,0,0,.063,.006,.041,.0035,undefined,false);
  card.box(m.iron,.022,.003,.001,.009,.0016,.037,.001,undefined,false);
  for(let n=0;n<4;n++)
    card.box(m.bronze,.023,.004,-.011+n*.006,.006,.0009,.0037,.0003,undefined,false);
  card.finish();
  const idLabel=canvasMap(256,160,(c,w,h)=>{
    c.fillStyle='#dbc49a';c.fillRect(0,0,w,h);
    c.fillStyle='#29352d';c.fillRect(5,5,w-10,31);
    c.fillStyle='#dfceab';c.font='bold 22px Consolas';c.fillText('NORTH CAPE',17,28);
    c.fillStyle='#303633';c.font='bold 26px Consolas';c.fillText('FIELD CREW',17,76);
    c.font='bold 41px Consolas';c.fillText('07',17,133);
    for(let i=0;i<10;i++)c.fillRect(95+i*12,99,2+i%3,33);
  });
  const credentialFace=place(credential,new T.PlaneGeometry(.056,.034),decal(idLabel,.92,true),0,.0038,0);
  credentialFace.rotation.x=-Math.PI/2;
  const finger=new T.Vector3(),grip=new T.Euler();
  interactionArm.traverse(o=>{o.layers.set(1);o.castShadow=false;o.receiveShadow=false;});
  camera.layers.enable(1);
  let key;
  const smooth=T.MathUtils.smoothstep;
  return {
    root,muzzle,
    reach(weight,x=0,y=0,progress=0,device) {
      interactionArm.visible=weight>.045;
      if(!interactionArm.visible)return;
      const lever=device==='gate',scan=device==='entry';
      reaching.hand.visible=reaching.forearm.visible=!(lever||scan);
      holding.hand.visible=holding.forearm.visible=lever||scan;
      credential.visible=scan;
      if(scan) {
        const present=smooth(progress,.03,.35);
        const contact=smooth(progress,.28,.86);
        grip.set(-.16+contact*.43,-.66+contact*.17,.58-contact*.26);
        finger.set(.019,-.009,-.084).multiplyScalar(.91).applyEuler(grip);
        const amount=weight*(.51+.27*present+.22*contact);
        holding.pose(
          T.MathUtils.lerp(-.36,x-finger.x,amount),
          T.MathUtils.lerp(-.44,y-finger.y,amount),
          T.MathUtils.lerp(-.45,-.71-finger.z,amount),
          grip.x,grip.y,grip.z
        );
        return;
      }
      if(lever) {
        const latch=smooth(progress,.07,.31);
        const pull=smooth(progress,.28,.98);
        grip.set(-.54+latch*.12+pull*.58,-.79+.20*latch,.71+.16*pull);
        // The index/knuckle pocket leads the wrist as it settles onto the handle.
        finger.set(-.008,-.027,-.077).multiplyScalar(.91).applyEuler(grip);
        const amount=weight*(.60+.40*latch);
        holding.pose(
          T.MathUtils.lerp(-.33,x-finger.x,amount),
          T.MathUtils.lerp(-.43,y-finger.y,amount),
          T.MathUtils.lerp(-.43,-.72-finger.z,amount),
          grip.x,grip.y,grip.z
        );
        return;
      }
      const press=T.MathUtils.smoothstep(progress,.02,.24);
      grip.set(-.35+weight*.49,-.17+weight*.30,.31+weight*.17);
      finger.set(-.009,-.013,-.119).applyEuler(grip);
      const reach=weight*(.84+.16*press);
      reaching.pose(
        T.MathUtils.lerp(-.33,x*.99-finger.x,reach),
        T.MathUtils.lerp(-.43,y*.99-finger.y,reach),
        T.MathUtils.lerp(-.43,-.72-finger.z+(1-press)*.036,reach),
        grip.x,grip.y,grip.z
      );
    },
    pose(progress,aim,kick=0) {
      collar.position.z=kick*.022;
      const switchPress=smooth(progress,.10,.25)-smooth(progress,.29,.34);
      right.pose(.055,-.154+switchPress*.016,.079-switchPress*.018+kick*.006,-.43-kick*.075,-.41,-1.44+kick*.038);
      const reach=smooth(progress,.03,.20)-smooth(progress,.79,1.0);
      const extract=smooth(progress,.19,.455)-smooth(progress,.56,.775);
      const exchange=smooth(progress,.39,.51)-smooth(progress,.55,.66);
      const lx=-extract*.128,ly=-.097-extract*.171,lz=-.133-extract*.005;
      cell.position.set(lx,ly,lz);
      cell.rotation.set(-.065-extract*.29,extract*.36,-extract*.51);
      cell.visible=progress<.458||progress>.565;
      const lerp=T.MathUtils.lerp;
      left.pose(
        lerp(-.120,lx-.055,reach),
        lerp(-.071,ly-.034-exchange*.139,reach),
        lerp(-.325,lz+.039,reach),
        -.26+reach*.50+kick*.056,.20-reach*.78,1.23-reach*.53
      );
      sight.dot.visible=aim>.86;
    },
    display(ammo,reload) {
      const next=ammo+':'+reload;
      if(next===key)return;
      key=next;
      const c=display.image.getContext('2d');
      const ink=ammo<3||reload?'#f7ae73':'#a7e6cf';
      c.fillStyle='#07110f';c.fillRect(0,0,384,192);
      const illumination=c.createLinearGradient(0,0,365,190);
      illumination.addColorStop(0,'#27605a66');illumination.addColorStop(.55,'#1741382c');
      illumination.addColorStop(1,'#14362a1e');
      c.fillStyle=illumination;c.fillRect(0,0,384,192);
      c.strokeStyle='#426c62';c.lineWidth=2;c.strokeRect(6,7,372,177);
      c.fillStyle=ink;c.font='bold 101px Consolas';c.fillText(reload?'––':String(ammo).padStart(2,'0'),38,113);
      c.font='bold 22px Consolas';c.fillText('CELL',252,57);c.fillText('07A',252,95);
      c.fillStyle='#79bd9e52';
      c.fillRect(213,31,2,83);c.fillRect(28,128,326,2);
      for(let i=0;i<12;i++) {
        c.fillStyle=i<ammo&&!reload?ink:'#29473d';c.fillRect(28+i*28,141,19,18);
      }
      c.fillStyle='#0d211a3a';
      for(let y=15;y<178;y+=4)c.fillRect(15,y,353,1);
      display.needsUpdate=true;
    }
  };
}

