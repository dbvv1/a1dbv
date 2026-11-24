import * as T from 'three';
import { exhaustGallery } from './plant.mjs';
import { batches, canvasMap, coatedPart, decal, grimeMap, place, stenciled } from './art.mjs';
import { accessWalk, openings, bulkhead, catwalk, entry, overlook, threshold, walkout } from './layout.mjs';
import { rainTracks, cladWindowBays, roofEdge, foundation, serviceFrame } from './envelope.mjs';
import { doorLift, flowReading } from './sim.mjs';

function plate(b,material,w,h,x,y,z,rotation) {
  b.add(new T.PlaneGeometry(w,h),material,[x,y,z],rotation,false);
}
const sign=(title,sub,aspect,base='#26302d')=>decal(stenciled(title,{sub,base,aspect,border:true}),1,true);

function partition(b,m,door) {
  const {x0,x1,y,z0,z1}=door, z=(z0+z1)/2, w=x1-x0,x=(x0+x1)/2;
  for(const [edge,outer] of [[x0,-7.85],[x1,7.85]]) {
    b.box(m.cast,(edge+outer)/2,4.42,z,Math.abs(outer-edge),8.84,z1-z0,.018);
    b.box(m.edge,edge,3.06,z,.33,6.12,z1-z0+.27,.043);
    b.box(m.black,edge,2.83,z,.12,5.66,z1-z0+.40,.012);
  }
  b.box(m.cast,x,(y+8.84)/2,z,w,8.84-y,z1-z0,.017);
  b.box(m.edge,x,y+.28,z,w+.25,.56,z1-z0+.30,.031);
}

function shutter(scene,b,m,door,paint,label) {
  const {x0,x1,y,z0,z1}=door, x=(x0+x1)/2, w=x1-x0,z=(z0+z1)/2;
  const root=new T.Group();root.position.set(x,0,z);scene.add(root);
  const panel=batches(root);
  panel.box(m.black,0,y*.5,-.019,w-.14,y,.196,.022);
  const rows=Math.round(y/.315),pitch=y/rows;
  for(let row=0;row<rows;row++) {
    const center=(row+.5)*pitch;
    const exposure=door===bulkhead?.48:door===walkout?.82:1.0;
    coatedPart(panel,paint,0,center,.089,w-.16,pitch-.014,.102,.020,row*2.173+w,exposure);
    coatedPart(panel,paint,0,center-pitch*.41,.135,w-.17,.058,.067,.014,row*4.553+1,.28);
    panel.box(m.iron,0,center-pitch*.445,.151,w-.20,.014,.018,.005,undefined,false);
  }
  const boltTracks=rainTracks(71,true);
  for(const dx of [-w*.34,w*.34]) {
    panel.box(m.iron,dx,y*.50,.13,.14,y-.14,.09,.022);
    panel.box(m.iron,dx,y*.50,-.13,.15,y-.14,.08,.016);
    for(let h=.23;h<y-.10;h+=.265) {
      panel.pipe(m.iron,[dx,h,.170],[dx,h,.182],.031,12,.031,false);
      panel.pipe(m.rust,[dx,h,.182],[dx,h,.197],.022,8,.022,false);
      const trace=.066+.059*Math.sin(h*11.2+dx*4)**2;
      plate(panel,boltTracks,.046,trace,dx-.003,h-trace*.5,.1765);
    }
  }
  panel.box(m.rubber,0,.071,0,w-.09,.14,.32,.018);
  panel.box(m.iron,0,.147,.087,w-.13,.068,.16,.012);
  plate(panel,sign(label,'KEEP CLEAR',2.0),w*.39,w*.18,0,y*.59,.208);
  panel.finish();
  for(const dx of [-w*.5,w*.5]) {
    const xx=x+dx;
    b.box(m.iron,xx,y*.5,z,.16,y+.17,.40,.023);
    b.box(m.rust,xx,y+.19,z,.22,.48,.49,.025);
    b.pipe(m.silver,[xx,y+.2,z+.34],[xx,y+.99,z+.34],.048,14);
  }
  const lamp=place(scene,new T.BoxGeometry(.49,.062,.042),m.redLamp,x,y+.10,z1+.234);
  const light=new T.PointLight(0xe85e2d,3.8,3.7,2);
  light.position.set(x,y+.02,z1+.5);scene.add(light);
  return run=>{
    const height=doorLift(run,door), open=height>door.travel*.96;
    const moved=Math.abs(root.position.y-height)>.0005;
    root.position.y=height;
    lamp.material=open?m.greenLamp:m.redLamp;
    light.color.setHex(open?0x47dfa4:0xe85e2d);
    light.intensity=open?3.2:3.6+(height>0?Math.sin(run.time*22):0)*2;
    return moved;
  };
}

function rail(b,m,x,a,c) {
  for(const y of [.48,1.08]) b.pipe(m.iron,[x,y,a],[x,y,c],y>.9?.042:.025,9);
  b.box(m.rust,x,.123,(a+c)/2,.092,.125,Math.abs(a-c),.012);
  const count=Math.ceil(Math.abs(c-a)/1.3);
  for(let i=0;i<=count;i++) {
    const z=T.MathUtils.lerp(a,c,i/count);
    b.box(m.iron,x,.53,z,.068,1.07,.069,.009);
    b.box(m.iron,x,.039,z,.194,.078,.174,.013);
    for(const dx of [-.064,.064]) b.pipe(m.silver,[x+dx,.076,z],[x+dx,.092,z],.017,7,.017,false);
  }
}

function deck(b,m,x0,x1,a,c) {
  const x=(x0+x1)/2,z=(a+c)/2,w=x1-x0,d=Math.abs(a-c);
  b.box(m.black,x,-.19,z,w,.20,d,.035);
  for(const xx of [x0+.13,x1-.13]) {
    b.box(m.iron,xx,-.19,z,.16,.29,d,.018);
    b.box(m.edge,xx,-.59,z,.27,.35,d,.017);
  }
  const n=Math.ceil(d/1.36),step=d/n;
  for(let i=0;i<n;i++) {
    const zz=Math.min(a,c)+step*(i+.5);
    b.box(m.black,x,-.092,zz,w-.28,.057,step-.038,.009);
    b.box(m.iron,x,-.022,zz-step*.472,w-.30,.050,.042,.007);
    for(let j=0;j<9;j++) {
      const zzj=zz+(j-4)*step*.104;
      const top=(i*3+j)%5===0?m.gunMetal:m.iron;
      b.box(top,x,-.026,zzj,w-.32,.051,step*.086,.009,undefined,false);
      b.box(m.gunMetal,x,.001,zzj-step*.027,w-.38,.005,.009,.001,undefined,false);
    }
    for(const xx of [x0+.20,x1-.20]) {
      b.box(m.iron,xx,-.005,zz,.074,.038,step-.040,.007);
      for(const dz of [-step*.38,step*.38]) b.pipe(m.black,[xx,.013,zz+dz],[xx,.022,zz+dz],.019,8,.019,false);
    }
  }
}

function consoleBox(scene,b,m,prop,title,subtitle) {
  const {x,y,z}=prop;
  b.box(m.edge,x,.095,z,.50,.19,.49,.042);
  b.box(m.iron,x,.63,z,.16,1.01,.18,.022);
  b.box(m.black,x,.281,z+.096,.113,.29,.032,.010);
  for(const xx of [x-.177,x+.177]) for(const zz of [z-.153,z+.153])
    b.pipe(m.gunMetal,[xx,.187,zz],[xx,.224,zz],.029,8,.029,false);
  b.box(m.iron,x,y+.164,z,.365,.046,.28,.012);
  b.box(m.black,x,y+.186,z-.014,.296,.016,.218,.006);
  for(const xx of [x-.181,x+.181]) b.box(m.gunMetal,xx,y-.064,z+.069,.048,.268,.116,.012);
  coatedPart(b,m.cabinetCoat,x,y-.05,z,.42,.41,.25,.042,9.4);
  b.box(m.black,x,y-.04,z+.135,.33,.30,.031,.016);
  const isReport=prop===overlook;
  plate(b,sign(title,subtitle,2.5),.279,isReport?.079:.123,x,y+(isReport?.060:.028),z+.157);
  let updateFlow;
  if(isReport) {
    const map=canvasMap(384,144,()=>{});
    b.box(m.gunMetal,x,y-.047,z+.160,.289,.103,.027,.008);
    plate(b,new T.MeshBasicMaterial({map}),.264,.087,x,y-.047,z+.175);
    const context=map.image.getContext('2d');
    let key;
    updateFlow=(reading,recorded,transmitting)=>{
      const mode=recorded?'LOGGED':transmitting?'SENDING':'SENSOR';
      const next=reading+'/'+mode;
      if(key===next)return;
      key=next;
      context.fillStyle='#121d1d';context.fillRect(0,0,384,144);
      context.strokeStyle='#687c6c';context.lineWidth=3;context.strokeRect(7,7,370,130);
      context.fillStyle='#b6e1c9';context.font='bold 54px Consolas';
      context.fillText(reading,22,76);
      context.font='23px Consolas';context.fillText('m³/s',148,74);
      context.font='bold 22px Consolas';context.fillText(mode,24,117);
      context.fillStyle=recorded?'#b8f5c0':'#e0a574';
      context.fillRect(311,35,44,10);
      context.fillRect(332,55,23,7);
      map.needsUpdate=true;
    };
  }
  b.box(m.iron,x,y-.126,z+.162,.15,.088,.054,.016);
  const button=place(scene,new T.BoxGeometry(.082,.053,.026),m.amber,x,y-.125,z+.201);
  const scanning=isReport?m.cold:new T.MeshBasicMaterial({color:new T.Color(.12,.61,.53)});
  for(const xx of [x-.145,x+.145]) for(const yy of [y-.159,y+.079])
    b.pipe(m.silver,[xx,yy,z+.144],[xx,yy,z+.172],.014,8,.014,false);
  return (used,pressing,reading)=>{
    button.material=used?m.greenLamp:pressing?scanning:m.amber;
    button.position.z=z+.201-(pressing&&isReport?.012:0);
    updateFlow?.(reading,used,pressing);
  };
}

function substation(b,m) {
  roofEdge(b,m);
  cladWindowBays(b,m,openings);
  serviceFrame(b,m);
  b.box(m.edge,0,8.78,13.57,15.88,.26,.67,.045);
  b.box(m.iron,0,8.91,13.66,16.0,.10,.67,.027);
  for(const [outer,inner] of [[-7.88,threshold.x0],[7.88,threshold.x1]])
    b.box(m.edge,(outer+inner)*.5,.205,13.58,Math.abs(outer-inner),.41,.58,.051);
  for(const x of [-7.54,-4.06,4.09,7.54]) {
    b.box(m.edge,x,4.40,13.60,.32,8.15,.43,.026);
    b.box(m.edge,x,.44,13.69,.45,.88,.60,.039);
    for(const y of [2.21,4.20,6.20]) b.box(m.black,x,y,13.829,.31,.021,.013,.003,undefined,false);
  }
  for(const y of [2.18,4.18,6.19]) for(const [x,w] of [[-5.75,3.20],[2.22,3.35],[5.87,3.15]])
    b.box(m.edge,x,y,13.548,w,.023,.019,.004,undefined,false);
  const sillTracks=rainTracks(406);
  const front=[[-7.21,-4.21],[-3.92,threshold.x0-.15],[threshold.x1+.17,4.0],[4.26,7.33]];
  // Individual pours meet at recessed joints under the projecting lintel.
  for(const [a,c] of front) {
    const x=(a+c)*.5, width=c-a;
    for(const [y,h] of [[1.21,1.80],[3.15,1.91],[5.12,1.98],[7.14,2.03]]) {
      b.box(m.cast,x,y,13.625,width,h,.17,.036);
      b.box(m.edge,x,y-h*.5+.027,13.708,width-.044,.041,.029,.009,undefined,false);
      for(const xx of [a+.16,c-.16]) for(const yy of [y-h*.38,y+h*.38])
        b.pipe(m.black,[xx,yy,13.720],[xx,yy,13.732],.019,9,.019,false);
    }
    for(const pos of [a+.28,c-.37]) {
      plate(b,sillTracks,.55,1.83,pos,6.12,13.719);
      plate(b,sillTracks,.43,1.51,pos+.11,2.50,13.722);
    }
  }
  b.box(m.edge,-1.08,4.17,13.81,3.35,.39,.65,.061);
  b.box(m.iron,-1.08,4.355,14.077,3.49,.063,.19,.014);
  for(const x of [-2.75,.57]) {
    b.box(m.cast,x,1.88,13.79,.43,3.73,.54,.049);
    b.box(m.edge,x,.21,13.86,.57,.42,.64,.040);
  }
  // Buttresses and drip edges make the same structure legible from the oblique opening.
  for(const z of [12.77,9.8,3.75,-3.05,-9.85,-16.65,-23.64]) {
    b.box(m.edge,-7.94,4.40,z,.51,8.77,.43,.071);
    b.box(m.edge,-8.10,.26,z,.86,.55,.76,.062);
    b.box(m.edge,-8.10,4.00,z,.79,.32,.66,.050);
    b.box(m.iron,-8.10,7.63,z,.75,.13,.55,.022);
  }
  b.box(m.edge,-7.985,4.00,-7.08,.54,.19,40.6,.035);
  b.box(m.edge,-7.975,7.53,-7.08,.60,.25,40.6,.036);
  b.box(m.iron,-7.985,8.85,-7.08,.63,.145,40.72,.034);
  b.box(m.edge,-7.98,.30,-7.07,.70,.62,40.72,.052);
  b.pipe(m.iron,[-8.28,7.78,13.64],[-8.28,7.78,-21.86],.050,10);
  for(const z of [9.07,2.26,-4.54,-11.34,-18.14]) {
    b.pipe(m.rust,[-8.26,7.76,z],[-8.26,.39,z],.046,10);
    b.box(m.iron,-8.21,4.13,z,.17,.081,.19,.012);
  }
  for(const x of [-6.88,7.17]) {
    b.tube(m.rust,[[x,8.91,13.699],[x,8.64,13.906],[x,7.80,13.906],[x,5.36,13.906],[x,2.89,13.906],[x,.38,13.906],[x-.31,.08,14.20]],.088,25,14);
    for(const y of [.82,2.54,4.26,6.01,7.73]) {
      b.box(m.iron,x,y,13.77,.28,.095,.36,.014);
      b.pipe(m.iron,[x,y-.045,13.906],[x,y+.045,13.906],.102,16);
    }
  }
  // Vent bank: precast surround, shadowed reveal, recessed louvres and a sloped sill.
  const ventY=5.19, ventX=5.59;
  b.box(m.edge,ventX,ventY+.89,13.99,3.71,.237,.77,.036);
  b.box(m.iron,ventX,ventY+.978,14.338,3.73,.061,.074,.008);
  b.box(m.edge,ventX,ventY-.87,14.02,3.61,.161,.68,.023,[.073,0,0]);
  for(const x of [3.87,7.29]) b.box(m.edge,x,ventY,13.96,.24,1.67,.66,.025);
  for(const x of [4.51,5.59,6.67]) {
    b.box(m.iron,x,ventY,13.84,.996,1.47,.21,.036);
    b.box(m.black,x,ventY,13.961,.88,1.335,.045,.008);
    for(let row=0;row<14;row++)
      b.box(m.gunMetal,x,ventY-.597+row*.092,14.011,.879,.047,.096,.007,[.59,0,0],false);
    for(const dx of [-.45,.45]) for(const y of [ventY-.669,ventY+.669])
      b.pipe(m.silver,[x+dx,y,13.959],[x+dx,y,13.991],.018,8,.018,false);
  }
  const ventSeep=rainTracks(819);
  for(const x of [4.16,5.56,6.91]) plate(b,ventSeep,.66,1.69,x,3.48,13.728);
  b.box(m.edge,-5.48,6.52,13.88,2.64,.24,.61,.030);
  b.box(m.iron,-5.48,6.65,14.106,2.71,.053,.193,.011);
  b.box(m.edge,-5.48,5.54,13.88,2.60,1.75,.35,.048);
  const hatchZ=14.116;
  coatedPart(b,m.doorBlue,-5.48,5.54,hatchZ,2.31,1.48,.14,.034,16.19);
  b.box(m.iron,-5.48,5.54,hatchZ+.067,.039,1.44,.049,.008);
  for(const x of [-6.25,-4.71])for(const y of [5.13,5.93])
    b.box(m.gunMetal,x,y,hatchZ+.089,.16,.09,.054,.012);
  b.tube(m.iron,[[-6.65,5.88,14.088],[-6.71,5.67,14.110],[-6.71,4.70,14.110],[-6.58,4.54,14.08],
    [-4.27,4.54,14.08],[-4.11,4.41,14.07],[-4.11,2.25,14.07]],.044,35,12);
  for(const x of [-6.43,-5.65,-4.85]) b.box(m.black,x,4.54,13.939,.135,.102,.28,.018);
  b.box(m.iron,-4.11,2.16,13.972,.289,.32,.28,.028);
  b.box(m.black,-4.11,2.16,14.122,.227,.257,.025,.015);
  plate(b,ventSeep,.36,1.12,-4.11,1.59,13.731);
  b.box(m.edge,-6.08,9.17,9.84,2.51,.61,3.06,.054);
  b.box(m.iron,-6.08,9.52,9.84,2.65,.12,3.20,.029);
  b.tube(m.black,[[-6.37,9.50,9.31],[-6.37,10.38,9.31],[-6.11,10.62,9.43],[-5.56,10.62,9.47]],.189,22,20);
  b.box(m.rust,-4.89,9.60,10.75,.17,1.45,.18,.019);
  b.pipe(m.iron,[-4.88,10.21,10.75],[-4.88,11.65,10.75],.039,10);
  b.pipe(m.iron,[-4.88,11.58,10.05],[-4.88,11.58,11.45],.025,9);
  b.tube(m.rubber,[[-4.85,10.92,10.74],[-4.59,10.21,11.18],[-4.57,9.27,11.84],[-4.40,8.89,12.52]],.013,22,7,false);
}

function intake(scene,b,m) {
  const {x0,x1,z0,z1}=accessWalk;
  substation(b,m);
  foundation(b,m);
  exhaustGallery(b,m);
  deck(b,m,x0,x1,z0,z1);
  for(const x of [x0,x1]) rail(b,m,x,z0+.05,z1);
  for(const y of [.48,1.08]) b.pipe(m.iron,[x0,y,z1],[x1,y,z1],y>.9?.042:.025,10);
  for(const x of [-2.56,-.52,1.49]) b.box(m.iron,x,.55,z1,.071,1.10,.073,.010);
  for(const x of [-2.5,2.70]) {
    for(const z of [15.56,21.15]) {
      b.box(m.cast,x,-1.83,z,1.02,3.33,1.29,.081);
      b.box(m.iron,x,-.43,z,1.99,.28,.43,.028);
      b.pipe(m.black,[x,-2.8,z+.2],[x*.67,-.39,z-1.1],.097,10);
    }
  }
  for(const z of [14.13,16.82,19.52,22.22]) {
    for(const x of [-3.94,2.91]) {
      b.box(m.iron,x,2.27,z,.19,4.60,.24,.021);
      b.box(m.rust,x,.29,z,.27,.55,.37,.029);
    }
    b.box(m.iron,-.515,4.56,z,7.2,.24,.26,.035);
    b.pipe(m.rust,[-2.65,4.55,z],[-3.92,3.17,z],.069,10);
    b.pipe(m.rust,[1.62,4.55,z],[2.90,3.17,z],.069,10);
  }
  // Standing seams fall into the gutter on the low side of the open-sided canopy.
  for(const x of [-3.68,-2.36,-1.04,.28,1.60,2.87])
    b.box(m.black,x,4.69+(x+.52)*.049,16.62,.087,.135,5.91,.012);
  for(let j=0;j<18;j++) {
    const x=-3.96+j*.392;
    const y=4.801+(x+.52)*.049;
    b.box(j%6===0?m.gunMetal:m.iron,x,y,16.62,.402,.036,5.99,.007,[0,0,.049]);
    b.box(m.gunMetal,x-.197,y+.017,16.62,.022,.045,5.96,.006);
  }
  b.box(m.iron,-.50,4.84,19.62,7.12,.145,.11,.013,[0,0,.049]);
  b.box(m.black,-4.18,4.621,16.61,.195,.093,6.22,.018);
  b.box(m.iron,-4.26,4.67,16.61,.042,.145,6.25,.014);
  b.tube(m.iron,[[-4.19,4.58,19.58],[-4.09,4.35,19.58],[-3.99,4.01,19.53],[-3.99,1.12,19.53],[-4.16,.57,19.55]],.052,31,12);
  for(const z of [14.13,16.82,19.52,22.22]) for(const x of [-3.94,2.91]) {
    b.box(m.iron,x,.049,z,.43,.098,.43,.020);
    b.box(m.gunMetal,x,4.395,z,.34,.116,.42,.014);
    for(const dx of [-.155,.155])for(const dz of [-.143,.143])
      b.pipe(m.bronze,[x+dx,.09,z+dz],[x+dx,.129,z+dz],.023,7,.023,false);
  }
  b.pipe(m.black,[-3.60,4.40,14.04],[-3.60,4.40,18.94],.031,10);
  for(const z of [15.5,18.63]) {
    b.box(m.iron,-3.44,4.39,z,.43,.11,.24,.022);
    b.box(m.cream,-3.44,4.318,z,.33,.042,.156,.009,undefined,false);
  }
  for(const x of [-4.35,3.28]) {
    b.pipe(m.rust,[x,.68,14],[x,.68,22.9],.078,14);
    b.pipe(m.black,[x,.40,14],[x,.40,22.9],.030,10);
  }
  for(const [xx,zz] of [[-3.94,16.82],[2.91,19.52]]) {
    b.box(m.iron,xx,2.06,zz,.215,.265,.117,.016);
    b.box(m.black,xx,2.06,zz+.062,.15,.191,.030,.009);
    b.pipe(m.iron,[xx-.094,2.19,zz],[xx-.094,4.39,zz],.021,9);
  }
  b.box(m.orange,-1.10,3.65,13.662,3.10,.55,.127,.042);
  plate(b,sign('NORTH CAPE','SERVICE INTAKE / UNIT 07',5.1),2.94,.49,-1.10,3.65,13.736);
  plate(b,sign('07','AUTHORIZED ACCESS',1.7),1.60,.94,2.34,6.95,13.744);
  const damp=rainTracks(190);
  for(const x of [-6.88,7.17]) plate(b,damp,.47,2.0,x+.10,1.38,13.717);
  for(const x of [-2.42,.25]) {
    b.box(m.black,x,2.88,13.73,.31,.22,.31,.034);
    b.box(m.hot,x,2.824,13.87,.248,.062,.117,.013,undefined,false);
    const light=new T.PointLight(0xffc18b,9.8,6.2,2);
    light.position.set(x,2.67,14.11);scene.add(light);
  }
}

function pressureGauge(scene,b,m) {
  const x=4.07,y=2.03,z=-24.04;
  b.box(m.iron,x,y-.20,z,.74,1.03,.31,.053);
  b.box(m.edge,x,.78,z,.38,1.52,.28,.031);
  b.box(m.black,x,y,z+.171,.602,.579,.049,.031);
  for(const xx of [x-.271,x+.271])for(const yy of [y-.254,y+.254])
    b.pipe(m.silver,[xx,yy,z+.198],[xx,yy,z+.213],.019,8,.019,false);
  const dialSeal=new T.MeshPhysicalMaterial({color:0xb5c6ba,transparent:true,opacity:.11,
    depthWrite:false,metalness:.31,roughness:.32,clearcoat:.53});
  plate(b,dialSeal,.529,.51,x,y,z+.244);
  const art=canvasMap(512,512,(c,w,h)=>{
    c.fillStyle='#121c1c';c.fillRect(0,0,w,h);
    c.lineWidth=4;c.strokeStyle='#6d7a6d';c.strokeRect(11,11,w-22,h-22);
    for(let i=0;i<=24;i++) {
      const a=Math.PI*(.80+i*1.40/24),s=Math.sin(a),k=Math.cos(a),large=i%4===0;
      c.strokeStyle=i>=19?'#ed9a61':i<7?'#81d3b8':'#d2cbb1';
      c.lineWidth=large?5:2;c.beginPath();c.moveTo(256+180*k,263+180*s);
      c.lineTo(256+(large?150:165)*k,263+(large?150:165)*s);c.stroke();
    }
    c.fillStyle='#d4ccb4';c.textAlign='center';c.font='700 36px Consolas';c.fillText('PILOT',256,127);
    for(const [a,t] of [[.80,'0'],[1.15,'2'],[1.50,'4'],[1.85,'6'],[2.20,'8']]) {
      const theta=Math.PI*a;
      c.font='700 19px Consolas';
      c.fillText(t,256+129*Math.cos(theta),270+129*Math.sin(theta));
    }
    c.font='21px Consolas';c.fillText('MPa  /  B–07',256,427);
  });
  plate(b,new T.MeshBasicMaterial({map:art}),.534,.520,x,y,z+.20);
  const dial=new T.Group();dial.position.set(x,y-.007,z+.218);scene.add(dial);
  const a=batches(dial);
  a.box(m.orange,.078,0,0,.162,.011,.018,.004,undefined,false);
  a.pipe(m.iron,[0,0,.016],[0,0,.039],.027,18,.027,false);a.finish();
  const lamp=place(scene,new T.BoxGeometry(.044,.044,.035),m.redLamp,x+.21,y-.371,z+.18);
  for(const xx of [x-.12,x+.11]) {
    b.pipe(m.gunMetal,[xx,1.160,z],[xx,1.264,z],.046,8);
    b.pipe(m.bronze,[xx,1.204,z],[xx,1.244,z],.054,9);
  }
  b.pipe(m.rust,[x-.118,y-.71,z],[x-.118,.345,z],.030,11);
  b.pipe(m.rubber,[x+.112,y-.71,z],[x+.112,.345,z],.023,10);
  return (run,state)=>{
    const reading=.08+.84*state.pressure;
    dial.rotation.z=-Math.PI*(.80+1.4*reading)+Math.sin(run.time*17)*.034*state.surge;
    lamp.material=run.relief?m.greenLamp:run.relayOn?m.amber:m.redLamp;
  };
}

function hydraulicServices(b,m) {
  // The station's rigid lines rise into a common manifold and turn into the actuator bay.
  for(const side of [-1,1]) {
    const x=side*4.15,z=-25.69;
    b.box(m.cast,x,.269,z,.724,.54,.575,.059);
    b.box(m.gunMetal,x,.591,z,.663,.12,.53,.024);
    for(const dx of [-.235,.235]) for(const dz of [-.183,.183])
      b.pipe(m.bronze,[x+dx,.650,z+dz],[x+dx,.687,z+dz],.031,9);
    b.box(m.iron,x,1.73,z,.187,2.11,.165,.020);
    for(const level of [1.06,1.82,2.55]) {
      b.box(m.black,x,level,z,.26,.064,.237,.009);
      for(const dx of [-.07,.07])
        b.pipe(m.silver,[x+dx,level,z+.124],[x+dx,level,z+.144],.018,8);
    }
    for(const d of [-.083,.083]) {
      b.tube(d<0?m.bronze:m.iron,[[x+d,.65,z+.036],[x+d,1.45,z+.036],[x+d,2.68,z+.036],
        [x+d*1.15,3.39,z+.014],[x-side*.36,3.89+d,z-.32],[x-side*.46,4.18+d,z-.79]],.035,34,10);
    }
    if(side>0) {
      b.box(m.iron,x,1.34,z+.143,.29,.343,.172,.021);
      for(const dx of [-.071,.073])
        b.pipe(m.gunMetal,[x+dx,1.351,z+.224],[x+dx,1.351,z+.265],.047,14);
      b.pipe(m.bronze,[x-.073,1.356,z+.267],[x-.073,1.356,z+.294],.029,13);
      b.tube(m.black,[[x,1.55,z+.12],[x+.16,1.70,z+.18],[x+.44,1.71,z+.22],
        [5.08,1.76,z+.24],[5.28,1.98,z+.27],[5.28,2.03,z+.29]],.028,22,10);
      b.box(m.iron,5.32,2.12,z+.30,.30,.22,.17,.016);
      b.box(m.black,5.32,2.12,z+.396,.252,.166,.037,.01);
      b.box(m.iron,5.22,1.87,z+.25,.17,.055,.15,.009);
    }
  }
}

function controlServices(b,m) {
  const x=7.635;
  const wallFilm=rainTracks(74);
  for(const z of [-22.6,-24.8,-26.40]) {
    b.box(m.cast,x-.015,2.54,z,.15,4.92,1.94,.026);
    b.box(m.iron,x-.098,1.44,z,.038,.066,1.94,.011);
    for(const side of [-.93,.93])b.box(m.iron,x-.081,2.65,z+side,.059,4.64,.045,.006);
    b.box(m.iron,x-.099,.27,z,.054,.43,1.98,.014);
    plate(b,wallFilm,.68,2.20,x-.093,1.64,z+.19,[0,-Math.PI/2,0]);
    for(const zz of [z-.84,z+.84]) for(const yy of [.86,2.91])
      b.pipe(m.black,[x-.101,yy,zz],[x-.076,yy,zz],.022,8,.022,false);
  }
  // Trunking stays above head height and drops alongside the instrument conduit.
  for(const side of [-.084,.084]) b.box(m.gunMetal,7.17+side,3.23,-24.20,.045,.064,4.44,.009);
  for(let z=-22.15;z>-26.37;z-=.20)
    b.box(m.iron,7.17,3.203,z,.205,.027,.039,.004,undefined,false);
  for(const z of [-22.25,-23.58,-25.04,-26.23]) {
    b.box(m.iron,7.37,3.19,z,.475,.055,.105,.014);
    b.box(m.black,7.518,3.26,z,.113,.246,.142,.015);
    b.pipe(m.bronze,[7.447,3.31,z],[7.473,3.31,z],.023,8);
  }
  for(const [j,material] of [m.rubber,m.gunMetal,m.rubber].entries()) {
    const at=7.12+j*.052;
    b.tube(material,[[at,3.251,-22.04],[at,3.25,-23.63],[at,3.247,-24.36],
      [7.49,3.13,-25.49+j*.073],[7.472,2.89,-25.59+j*.073],[7.472,2.46,-25.60+j*.073]],.017,31,8);
  }
  b.box(m.iron,7.461,2.30,-25.54,.22,.39,.46,.029);
  for(const z of [-25.63,-25.46]) {
    b.tube(m.bronze,[[7.427,2.10,z],[7.41,1.59,z],[7.28,1.23,z],[7.04,1.19,z],[6.67,1.19,z]],.026,28,9);
    for(const y of [1.51,1.85]) b.box(m.iron,7.49,y,z,.18,.04,.092,.006);
  }
  b.box(m.black,7.345,2.30,-25.54,.023,.31,.39,.014);
  for(const z of [-25.69,-25.39])for(const y of [2.207,2.408])
    b.pipe(m.silver,[7.337,y,z],[7.321,y,z],.014,8,.014,false);
  for(const [x,z] of [[-3.74,-22.72],[4.05,-23.81],[4.33,-25.15]]) {
    b.box(m.black,x,.008,z,.553,.022,.20,.006);
    b.box(m.iron,x,.025,z,.581,.018,.213,.006);
    for(let j=0;j<11;j++) b.box(m.black,x+(j-5)*.044,.035,z,.019,.005,.141,.001,undefined,false);
  }
}

function pressureRoom(scene,b,m) {
  controlServices(b,m);
  hydraulicServices(b,m);
  const z=bulkhead.z1+.041;
  plate(b,sign('CONTROL','HYDRAULIC ISOLATION',3.9),2.72,.64,-1.48,4.46,z);
  const grime=decal(grimeMap(31,true),.86);
  for(const x of [-5.59,2.78,5.29]) plate(b,grime,2.3,5.35,x,4.06,z);
  for(const x of [1.18,6.92]) {
    b.box(m.black,x,.28,z+.42,.28,.11,.17,.011);
    b.box(m.black,x,3.42,z+.10,.24,.18,.23,.027);
    b.box(m.cold,x,3.35,z+.21,.18,.052,.081,.009,undefined,false);
    for(const dx of [-.08,.081]) b.pipe(m.iron,[x+dx,.35,z+.055],[x+dx,3.31,z+.055],.026,9);
  }
  for(const x of [-3.96,4.15]) {
    b.tube(m.black,[[x,4.55,-21.67],[x,4.38,-23.4],[x+.17,4.04,-24.82],[x+.70,3.94,-26.22]],.092,26,12);
    b.pipe(m.rust,[x,3.71,-21.70],[x,3.71,-26.12],.056,13);
    for(const zz of [-22.04,-23.45,-24.89,-26.12]) b.box(m.iron,x,3.71,zz,.31,.18,.073,.023);
  }
  for(const [x,z] of [[-2.8,-22.44],[3.63,-23.09],[5.87,-26.48]]) {
    const light=new T.PointLight(x>5?0x9bcfde:0xf6ba73,x>5?8.1:9.0,5.8,2);
    light.position.set(x,2.87,z);scene.add(light);
    b.box(m.black,x,3.14,z,.43,.16,.21,.023);
    b.box(x>5?m.cold:m.hot,x,3.036,z,.36,.069,.119,.006);
  }
  plate(b,sign('WALKOUT','INSPECTION DECK',3.0),1.23,.385,6.23,3.49,-26.983);
}

function inspection(b,m) {
  const {x0,x1,z0,z1}=catwalk;
  deck(b,m,x0,x1,z0,z1);
  rail(b,m,x0,z0,z1-.79);rail(b,m,x1,z0,z1-.65);
  for(const z of [-28.67,-30.94,-33.19]) {
    b.box(m.iron,7.30,.151,z,.234,.251,.092,.013);
    b.box(m.rubber,7.19,.153,z,.082,.118,.071,.013);
    b.pipe(m.bronze,[7.266,.244,z+.015],[7.206,.244,z+.015],.021,8);
    b.pipe(m.bronze,[7.266,.064,z+.015],[7.206,.064,z+.015],.021,8);
  }
  for(const y of [.52,1.08]) b.pipe(m.iron,[x0,y,z0],[x1,y,z0],.043,10);
  for(const z of [-28.31,-31.05,-33.80]) {
    b.box(m.iron,6.06,-.29,z,2.86,.26,.16,.031);
    b.pipe(m.rust,[7.25,-.31,z],[5.06,-2.18,z+.53],.12,10);
    b.pipe(m.iron,[5.10,-.31,z],[5.06,-2.18,z+.53],.095,10);
    b.box(m.black,7.36,.22,z,.14,.32,.25,.017);
    b.box(m.amber,7.32,.251,z,.163,.068,.158,.009,undefined,false);
  }
  for(const x of [5.33,7.18]) for(const z of [-29.0,-30.88,-32.76,-34.45]) {
    b.box(m.gunMetal,x,.004,z,.23,.018,.15,.003);
    for(const dx of [-.078,.078])b.pipe(m.iron,[x+dx,.014,z],[x+dx,.029,z],.018,8,.018,false);
  }
  b.tube(m.rubber,[[overlook.x,.62,overlook.z-.13],[overlook.x,.16,overlook.z-.15],[6.44,.024,-34.60],
      [6.87,.021,-34.60],[7.27,.105,-34.39],[7.29,.135,-32.46],[7.29,.119,-29.28]],.027,43,10);
  b.box(m.edge,6.2,-1.32,-34.64,2.40,1.83,.64,.061);
  b.box(m.orange,6.22,.16,-34.98,2.10,.075,.12,.011);
  plate(b,sign('07 / OUT','KEEP WITHIN RAIL',4.2),.85,.213,5.82,.865,-35.09);
}

export function buildTransitions(scene,b,m) {
  partition(b,m,threshold);partition(b,m,bulkhead);
  intake(scene,b,m);pressureRoom(scene,b,m);inspection(b,m);
  const shutters=[
    shutter(scene,b,m,threshold,m.doorBlue,'INTAKE'),shutter(scene,b,m,bulkhead,m.doorGreen,'B–07'),
    shutter(scene,b,m,walkout,m.doorBlue,'OUT')
  ];
  const gauge=pressureGauge(scene,b,m);
  const reader=consoleBox(scene,b,m,entry,'ACCESS','AUTHORIZED');
  const post=consoleBox(scene,b,m,overlook,'REPORT','FLOW SENSOR');
  return (run,state)=>{
    reader(run.entryAt!==null,run.action==='entry');
    gauge(run,state);
    post(run.sequence==='confirmation'||run.outcome==='won',run.action==='overlook',run.relief?flowReading(state):12);
    let moved=false;
    for(const update of shutters) if(update(run))moved=true;
    return moved;
  };
}
