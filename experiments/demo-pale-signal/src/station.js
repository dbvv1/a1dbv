import * as T from 'three';
import { noise, randomGen } from './visual.js';

const V=(x,y,z)=>new T.Vector3(x,y,z);
const cyl=new T.CylinderGeometry(1,1,1,24);
const drum=new T.CylinderGeometry(1,1,1,32);
const ringGeo=new T.TorusGeometry(1,.075,8,32);

export function buildStation({box,wall,block,bar,cable,batch,point,sign,mat,groundAt,attachProp,coldTubes}) {
  const rand=randomGen(44109);
  const forward=new T.Euler(0,0,0);
  const left=new T.Euler(0,-Math.PI/2,0);
  const radial=new T.Euler(Math.PI/2,0,0);
  function gusset(x,y,z,s,material){
    bar(V(x,y,z),V(x+s,y+s*.8,z),.071,material);
    box(x+s,y+s*.8,z,.20,.20,.13,material);
  }
  function floods(x,y,z,turn,tint,energy) {
    box(x,y,z,.69,.43,.34,mat.edge,turn,.057);
    for(let i=0;i<2;i++){
      const center=(i-.5)*.28, x1=x+Math.cos(turn)*center, z1=z-Math.sin(turn)*center;
      box(x1+Math.sin(turn)*.183,y-.01,z1+Math.cos(turn)*.183,.233,.252,.036,tint,turn,.019);
      for(let n=-1;n<=1;n++) box(x1+Math.sin(turn)*.208,y-.01+n*.082,z1+Math.cos(turn)*.208,.247,.014,.016,mat.graphite,turn);
    }
    point(x+Math.sin(turn)*.48,y-.56,z+Math.cos(turn)*.48,tint===mat.orangeLight?0xffaf6d:0xb4d8ff,energy,12.5);
  }
  function ladder(x,y,z,height){
    for(const a of [-1,1]) bar(V(x+a*.26,y,z),V(x+a*.26,y+height,z),.030,mat.zinc);
    for(let j=0;j<height/.26;j++)bar(V(x-.26,y+j*.26,z),V(x+.26,y+j*.26,z),.021,mat.plate);
    for(let j=1;j<height;j++)for(const a of [-1,1])bar(V(x+a*.26,y+j,z-.26),V(x+a*.26,y+j,z),.026,mat.edge);
  }
  function drain(x,z,length){
    box(x,.083,z,.24,.026,length,mat.edge);
    for(let i=0;i<length*8;i++)box(x,.100,z-length/2+i*.125,.21,.019,.041,mat.zinc);
  }
  function radiator(x,y,z,rows){
    box(x,y,z,1.3,1.65,.53,mat.graphite,0,.057);
    box(x,y,z+.283,1.17,1.51,.042,mat.edge);
    for(let i=0;i<rows;i++){
      box(x,y+(i/(rows-1)-.5)*1.37,z+.315,1.12,.072,.108,mat.zinc);
    }
    for(const q of [-1,1])box(x+q*.61,y,z+.349,.079,1.57,.07,mat.steel);
  }
  function panel(x,y,z,w,h,n){
    box(x,y,z,w,h,.07,mat.edge,0,.008);
    box(x,y,z+.053,w-.032,h-.032,.042,n%3?mat.steel:mat.pale,0,.007);
    box(x+w*.35,y,z+.084,w*.10,h*.56,.022,mat.zinc,0,.005);
    for(const q of [-1,1])for(const u of [-1,1])batch(cyl,mat.graphite,V(x+q*(w*.5-.043),y+u*(h*.5-.041),z+.080),V(.012,.012,.012),radial);
  }

  // The snow line runs under a deep, steel-framed loading canopy.
  for(const x of [-5.09,5.09]){
    wall(x,2.20,-8.52,.57,4.48,.63,mat.concrete,.035);
    box(x,3.44,-8.18,.37,1.37,.088,mat.steel,0,.019);
    box(x,.34,-8.52,1.08,.68,1.19,mat.concrete,0,.07);
    box(x,4.28,-9.85,.32,.49,3.30,mat.edge,0,.016);
    gusset(x,3.03,-8.31,x<0?.85:-.85,mat.plate);
    ladder(x+Math.sign(x)*.54,1.04,-11.20,3.55);
  }
  box(0,4.78,-9.68,11.15,.43,3.41,mat.edge,0,.069);
  box(0,5.03,-9.56,11.03,.102,3.40,mat.snow,0,.025);
  for(let i=0;i<26;i++)box(-5.24+i*.418,4.55,-9.66,.22,.082,3.19,mat.plate);
  box(0,4.68,-7.94,10.9,.27,.16,mat.oxide);
  box(0,4.48,-9.43,9.80,.12,.13,mat.graphite);
  sign('07 / RELAY','BOREAL  •  SERVICE ACCESS',0,4.72,-7.837,3.55,.24,forward,{bg:'#3d3934',fg:'#f2d1a1',stripe:'#a67051'});
  floods(0,4.54,-10.84,.16,mat.orangeLight,113);
  floods(5.11,3.62,-8.05,-.36,mat.orangeLight,60);
  for(let i=0;i<11;i++){
    panel(3.27+i*.56,2.08,-11.445,.51,2.64,i);
    panel(-3.26-i*.56,2.01,-11.45,.52,2.34,2*i);
  }
  for(const x of [6.52,8.11])radiator(x,1.37,-10.50,11);
  const inlet=[V(3.17,.46,-11.01),V(3.17,3.51,-11.01),V(3.34,3.77,-11.01),V(8.56,3.77,-11.01),V(8.71,3.53,-11.01),V(8.71,.39,-11.01)];
  for(let i=0;i<inlet.length-1;i++)bar(inlet[i],inlet[i+1],.11,mat.zinc);

  // Utility services attach to the weather skin and turn around each side of the loading apron.
  for(const side of [-1,1]){
    const x=side*5.45;
    const z=-10.78;
    box(x,.59,z+.07,.67,1.19,.31,mat.graphite,0,.038);
    box(x,.89,z+.27,.42,.31,.096,mat.zinc,0,.023);
    for(const q of [-1,1])box(x+q*.25,.84,z+.279,.058,.45,.060,mat.edge,0,.014);
    for(let i=0;i<5;i++)box(x-.19+i*.094,.65,z+.303,.045,.107,.036,mat.oxide,0,.009);
    bar(V(x,.27,z+.17),V(x+side*.08,-.16,z+.52),.042,mat.rubber);
    const pipe=[V(x,1.11,z+.25),V(x,3.73,z+.25),V(x+side*.11,3.93,z+.23),
      V(x+side*1.55,3.93,z+.19),V(x+side*1.77,4.13,z-.22),V(x+side*1.77,4.48,z-.58)];
    for(let i=1;i<pipe.length;i++)bar(pipe[i-1],pipe[i],.043,side>0?mat.plate:mat.oxide,cyl);
    for(const y of [1.51,2.43,3.37]){
      box(x,y,z+.16,.20,.071,.085,mat.edge,0,.011);
      bar(V(x,y-.036,z+.24),V(x,y+.036,z+.24),.062,mat.zinc,cyl);
    }
    sign(side>0?'P-3':'L-2','APRON SERVICES',x,1.32,z+.271,.46,.144,forward,
      {bg:'#3b403e',fg:'#d5c5a4',stripe:'#d2915a'});
  }

  // The transmission annex is visible down the access road before the player sees the dish.
  const mastX=6.98,mastZ=-14.18;
  box(mastX,5.46,mastZ,5.18,.35,4.76,mat.concrete,0,.061);
  box(mastX,6.84,mastZ,4.77,2.61,4.20,mat.edge,0,.082);
  for(let i=0;i<6;i++){
    const x=mastX-1.86+i*.741;
    box(x,6.73,mastZ+2.145,.698,2.38,.13,i===0?mat.plate:mat.oxide,0,.029);
    box(x,6.97,mastZ+2.226,.568,1.35,.081,mat.graphite,0,.030);
    for(let j=0;j<6;j++)box(x,6.47+j*.17,mastZ+2.28,.565,.039,.104,mat.zinc,0,.008);
  }
  box(mastX,8.21,mastZ,5.03,.31,4.53,mat.edge,0,.045);
  box(mastX,8.39,mastZ,5.01,.099,4.48,mat.snow,0,.025);
  ladder(mastX-2.64,4.50,mastZ+.87,3.9);
  const ventX=mastX+1.10,ventZ=mastZ-.35;
  bar(V(ventX,8.22,ventZ),V(ventX,10.24,ventZ),.43,mat.zinc,cyl);
  bar(V(ventX,10.11,ventZ),V(ventX,10.37,ventZ),.58,mat.graphite,cyl);
  bar(V(ventX,10.36,ventZ),V(ventX,10.43,ventZ),.61,mat.snow,cyl);
  for(const q of [-1,1])bar(V(ventX+q*.81,8.46,ventZ-.72),V(ventX+q*.34,9.96,ventZ),.037,mat.steel);
  bar(V(mastX-1.48,8.44,mastZ-.78),V(mastX-1.48,11.94,mastZ-.78),.052,mat.zinc);
  bar(V(mastX-1.91,11.40,mastZ-.78),V(mastX-1.05,11.40,mastZ-.78),.039,mat.plate);
  bar(V(mastX-1.48,11.91,mastZ-.78),V(mastX-1.48,12.11,mastZ-.78),.047,mat.redLight);
  floods(mastX-2.56,6.08,mastZ+1.32,.80,mat.orangeLight,72);

  // A damaged snow fence and a wind-loaded drift break up the entry apron.
  for(const [x,z,a] of [[-5.48,23.6,.23],[5.54,15.8,-.19],[-6.39,11.9,.41],[9.10,-1.53,-.37]]){
    const y=groundAt(x,z);
    for(let i=0;i<7;i++){
      const step=(i-3)*.30;
      box(x+Math.cos(a)*step,y+.39,z-Math.sin(a)*step,.079,.76,.076,mat.zinc,a,.009);
    }
    for(const y1 of [.18,.49,.70])box(x,y+y1,z,2.06,.051,.087,mat.edge,a,.012);
    box(x,y+.56,z+.059,1.27,.12,.024,mat.stripe,a,.005);
  }

  // An overhead service gallery crosses the old switchyard and joins the cable side.
  const galleryMin=-23.97,galleryMax=-19.20;
  for(const z of [galleryMin,galleryMax]){
    box(0,3.46,z,19.46,.36,.24,mat.graphite,0,.036);
    box(0,3.28,z,19.47,.079,.341,mat.zinc,0,.011);
    box(0,3.63,z,19.55,.091,.30,mat.steel,0,.013);
    for(const side of [-1,1]){
      const x=side*8.79;
      box(x,1.74,z,.44,3.52,.43,mat.oxide,0,.034);
      box(x,.21,z,.76,.42,.70,mat.plaster,0,.028);
      box(x,3.35,z,.72,.40,.51,mat.zinc,0,.029);
      bar(V(x-side*1.67,3.34,z),V(x,2.34,z),.092,mat.steel);
      for(const y of [.60,2.74,3.17])box(x,y,z+.225,.32,.13,.039,y===.60?mat.stripe:mat.plate,0,.011);
    }
  }
  for(let row=0;row<6;row++){
    const z=galleryMin+.32+row*.79;
    box(0,3.55,z,18.63,.101,.672,row%3===0?mat.graphite:mat.deck);
    box(0,3.49,z+.28,18.70,.085,.059,mat.zinc);
  }
  for(const z of [-24.09,-19.05]){
    bar(V(-9.55,4.65,z),V(9.55,4.65,z),.046,mat.zinc);
    bar(V(-9.55,4.13,z),V(9.55,4.13,z),.035,mat.graphite);
    for(let i=0;i<9;i++){
      const x=-9.50+i*2.37;
      box(x,4.12,z,.100,1.03,.109,mat.steel,0,.01);
      box(x,3.78,z,.188,.19,.16,mat.zinc,0,.014);
      if(i<8)bar(V(x,3.78,z),V(x+2.37,4.14,z),.024,mat.oxide);
    }
    const span=V(5.08,4.50,z);
    bar(span,V(5.08,5.02,z),.057,mat.plate);
    box(5.08,4.52,z,.152,.143,.17,mat.zinc,0,.018);
  }
  sign('SERVICE GALLERY','MAINTENANCE ABOVE',3.17,3.47,-19.049,1.75,.28,forward,
    {bg:'#323634',fg:'#cac4a9',stripe:'#ba694a'});
  for(const x of [-6.67,6.67]){
    const z=-18.65;
    for(const side of [-1,1])bar(V(x+side*.38,3.40,z),V(x+side*.38,4.83,z),.053,mat.edge);
    box(x,4.36,z-3.45,.88,.42,13.53,mat.graphite,0,.035);
    box(x,4.16,z-3.46,.98,.077,13.51,mat.zinc);
    for(let i=0;i<9;i++){
      const a=z+2.61-i*1.52;
      box(x,4.35,a,.96,.49,.097,mat.plate,0,.009);
    }
  }
  for(let step=0;step<13;step++){
    const y=.29+step*.242,z=-25.68+step*.115;
    box(8.71,y,z,1.06,.067,.43,mat.deck);
    box(8.71,y+.033,z-.209,1.08,.027,.047,mat.oxide);
  }
  const stairA=V(8.08,.41,-25.74),stairB=V(8.08,3.39,-24.08);
  bar(stairA,stairB,.061,mat.graphite);
  bar(stairA.clone().add(V(1.23,0,0)),stairB.clone().add(V(1.23,0,0)),.061,mat.graphite);
  bar(stairA.clone().add(V(0,.81,0)),stairB.clone().add(V(0,.81,0)),.046,mat.zinc);
  for(let i=0;i<4;i++){
    const base=stairA.clone().lerp(stairB,i/3);
    bar(base,base.clone().add(V(0,.81,0)),.034,mat.oxide);
  }
  block(8.71,1.64,-24.93,1.29,3.27,2.09,'cover');

  // The power converters fill the right-hand bay beneath the viewing gallery.
  function converter(x,z,width,front,label){
    const leftFace=x-width*.5;
    block(x,1.29,z,width,2.56,front,'cover');
    box(x,.17,z,width+.10,.33,front+.15,mat.plaster,0,.047);
    box(x,1.42,z,width,2.31,front,mat.blue,0,.069);
    box(x,2.59,z,width+.13,.143,front+.13,mat.graphite,0,.039);
    box(leftFace-.034,1.43,z,.088,1.95,front*.86,mat.plate,0,.025);
    box(leftFace-.089,1.71,z+.11,.048,1.27,front*.73,mat.graphite,0,.032);
    for(let i=0;i<8;i++){
      box(leftFace-.129,1.22+i*.12,z+.11,.065,.062,front*.67,mat.zinc,0,.008);
    }
    box(leftFace-.128,.657,z,.054,.35,front*.67,mat.oxide,0,.024);
    box(leftFace-.163,.657,z+.39,.039,.19,.08,mat.edge,0,.012);
    sign(label,'FIELD DISTRIBUTION',leftFace-.16,.676,z-.05,.69,.146,left,
      {bg:'#46382c',fg:'#f0dcb9',stripe:'#e2a45e'});
    for(const j of [-1,1]){
      box(x+j*width*.28,2.73,z,.30,.25,front*.52,mat.edge,0,.039);
      for(const off of [-.10,0,.10])bar(V(x+j*width*.28,2.86,z+off),V(x+j*width*.28,3.39,z+off),.048,mat.rubber,cyl);
    }
    const frontZ=z+front*.50;
    box(x,1.59,frontZ+.033,width*.87,1.79,.075,mat.graphite,0,.027);
    box(x,1.95,frontZ+.076,width*.71,.72,.027,mat.zinc,0,.017);
    sign('LINE / 07','THERMAL BUS',x,1.97,frontZ+.096,width*.64,.38,forward,
      {bg:'#232f2f',fg:'#a9bca3',stripe:'#a5b8a9'});
    for(let i=0;i<4;i++)box(x+(i-1.5)*.105,1.66,frontZ+.102,.052,.023,.021,i===0?mat.orangeLight:mat.lowLight,0,.005);
    for(const xq of [-1,1])for(const y of [.73,2.34]){
      const offset=x+xq*width*.39;
      batch(cyl,mat.plate,V(offset,y,frontZ+.081),V(.031,.030,.031),radial);
    }
  }
  converter(6.53,-16.61,2.63,2.17,'A-01');
  converter(7.31,-27.84,2.83,2.07,'B-02');
  box(3.60,.95,-16.87,.19,1.89,.19,mat.zinc,0,.033);
  box(3.64,.45,-18.99,.19,.90,.19,mat.zinc,0,.024);
  for(const y of [.43,.83])bar(V(3.62,y,-17.01),V(3.62,y,-18.89),.040,y<.6?mat.graphite:mat.oxide);
  block(3.61,.81,-17.92,.23,1.61,2.30,'rail');

  // Timber shelves and fabric partitions mark a work area on the other side.
  for(const z of [-14.6,-19.65]){
    const x=-8.91;
    box(x,1.94,z,1.25,3.71,3.48,mat.steel,0,.049);
    for(const q of [-1,1]){
      box(x+.64,1.95,z+q*1.70,.13,3.80,.17,mat.zinc,0,.015);
      box(x-.63,1.95,z+q*1.70,.13,3.80,.17,mat.edge,0,.015);
    }
    for(let row=0;row<4;row++){
      const y=.45+row*.82;
      box(x,y,z,1.34,.116,3.47,mat.zinc,0,.025);
      for(let k=0;k<4;k++){
        if((k+row)%4===3)continue;
        const u=z+(k-1.5)*.71+(rand()-.5)*.09;
        const size=.43+rand()*.24,height=.25+rand()*.34;
        box(x+.06,y+height*.5+.056,u,.86,height,size,row%3===0?mat.oxide:row%3===1?mat.blue:mat.plaster,0,.045);
        box(x+.515,y+.064+height*.66,u,.057,.061,size*.56,mat.edge,0,.013);
      }
    }
    block(x,1.89,z,1.43,3.78,3.51,'cover');
  }
  box(-8.88,3.93,-17.08,.92,.23,.57,mat.graphite,0,.028);
  sign('PARTS','CHECKOUT',-8.328,3.93,-17.10,.58,.25,new T.Euler(0,Math.PI/2,0),
    {bg:'#26342f',fg:'#acb7a4',stripe:'#c8874f'});
  const tx=6.44,tz=-21.22;
  wall(tx,.48,tz,3.11,.68,5.1,mat.concrete,.045);
  for(const z of [tz-1.52,tz+1.48]){
    batch(drum,mat.steel,V(tx,1.81,z),V(1.30,2.67,1.30),null);
    batch(new T.SphereGeometry(1.29,32,13,0,Math.PI*2,0,Math.PI*.5),mat.zinc,V(tx,3.10,z),V(1,.35,1),null);
    for(const y of [1.02,2.24,2.96])batch(ringGeo,mat.graphite,V(tx,y,z),V(1.31,1.31,1.06),radial);
    for(const y of [1.52,1.66])batch(ringGeo,mat.oxide,V(tx,y,z),V(1.30,1.30,.53),radial);
    bar(V(tx,3.54,z),V(tx,4.14,z),.17,mat.plate,cyl);
    for(let i=0;i<5;i++){
      const angle=1.6+i*.43;
      const x=tx+Math.cos(angle)*1.27,zz=z+Math.sin(angle)*1.27;
      bar(V(x,.54,zz),V(x,2.94,zz),.035,mat.zinc,cyl);
    }
    box(tx-1.30,1.79,z,.185,.91,.70,mat.oxide,0,.026);
    box(tx-1.413,1.91,z,.065,.24,.51,mat.edge,0,.022);
    box(tx-1.454,1.91,z,.026,.11,.40,mat.aquaLight,0,.012);
    sign('HX','COOLANT',tx-1.416,1.62,z,.48,.19,left,{bg:'#4b4538',fg:'#f0d4a1'});
  }
  floods(-4.25,4.11,-18.75,.26,mat.orangeLight,52);
  floods(-5.55,4.13,-29.35,.17,mat.whiteLight,29);
  floods(-3.55,3.49,-24.18,.6,mat.orangeLight,37);
  floods(5.44,3.88,-20.63,-1.18,mat.whiteLight,28);
  for(const z of [-15.91,-24.52,-29.15])drain(3.13,z,2.80);
  for(let i=0;i<coldTubes.length;i++){
    const z=-24.85-i*2.28;
    box(1.04,4.14,z,1.39,.17,.23,mat.zinc,0,.038);
    box(1.04,4.031,z,1.29,.064,.105,coldTubes[i],0,.019);
    for(const side of [-1,1])box(1.04+side*.68,4.02,z,.147,.127,.22,mat.edge,0,.023);
    point(1.04,3.71,z,0x9bd1ff,65,8,i);
  }

  // Consoles are built around an occupied workbench and a visible cable termination.
  const deskX=-5.08,deskZ=-26.79;
  const deskFloor=groundAt(deskX,deskZ);
  attachProp('metal_office_desk',deskX,deskFloor,deskZ,3.10,1.082-deskFloor,.94);
  block(deskX,.54,deskZ,3.10,1.08,.91);

  const genX=-5.84, genZ=-24.42, genY=groundAt(genX,genZ);
  attachProp('portable_generator',genX,genY+.035,genZ,1.23,.87,.86,.22);
  box(genX,genY+.016,genZ,1.46,.036,.98,mat.rubber,.22,.015);
  block(genX,genY+.42,genZ,1.11,.85,.80);
  cable([V(genX-.23,genY+.51,genZ+.42),V(genX-.45,genY+.17,genZ+.56),
    V(genX-.86,genY+.04,genZ+.43),V(genX-1.35,genY+.052,genZ-.46),V(-7.66,.20,-25.98)],.019,mat.oxide);
  sign('AUXILIARY','DISCONNECT AT PANEL',genX+.04,genY+.013,genZ+.97,1.36,.25,
    new T.Euler(-Math.PI/2,0,0),{bg:'#3c3423',fg:'#e0c994',stripe:'#eba34f'});
  for(let i=0;i<9;i++){
    const x=deskX-1.07+i*.125;
    box(x,1.10,deskZ+.297,.083,.034,.175,mat.graphite,0,.004);
  }
  box(deskX-1.07,1.292,deskZ-.16,.71,.37,.22,mat.edge,0,.040);
  box(deskX-1.07,1.30,deskZ-.033,.602,.286,.019,mat.lowLight,0,.016);
  sign('12:41','LAST RECEIVED BURST',deskX-1.07,1.30,deskZ-.021,.56,.259,forward,{bg:'#14272a',fg:'#cdebdc',stripe:'#87c6be'});
  box(deskX+.36,1.355,deskZ-.21,1.32,.49,.24,mat.graphite,0,.042);
  sign('NO CARRIER','07  /  ANTENNA ARRAY',deskX+.36,1.355,deskZ-.081,1.18,.394,forward,{bg:'#192b2c',fg:'#c6e0d5',stripe:'#e68d64',layout:'terminal'});
  for(let j=0;j<5;j++)box(deskX+.84-j*.122,1.155,deskZ+.011,.037,.018,.038,j===0?mat.redLight:mat.lowLight,0,.006);
  for(const q of [-1,1]){
    cable([V(deskX+q,1.18,deskZ-.21),V(deskX+q,.66,deskZ-.46),V(deskX+q,.15,deskZ-.32),V(deskX+q*.84,.10,deskZ+.84),V(-3.13,.098,deskZ+.89)],.021+.006*q,mat.rubber);
  }
  point(deskX,1.62,deskZ+.21,0x97eadb,3.7,3.8);
  for(const [x,z] of [[-7.66,-17.3],[8.16,-27.95]]){
    box(x,.28,z,1.74,.55,2.24,mat.concrete,0,.049);
    box(x,1.11,z,1.65,1.55,2.13,mat.steel,0,.075);
    box(x,1.15,z+1.076,1.44,1.39,.086,mat.graphite,0,.040);
    for(let i=0;i<9;i++)box(x,1.54-i*.10,z+1.135,1.35,.045,.13,mat.zinc,0,.007);
    sign('HV','ISOLATE BEFORE SERVICE',x,.57,z+1.142,.89,.19,forward,{bg:'#3c3226',fg:'#ffd1a1'});
    for(const side of [-1,1])bar(V(x+side*.54,1.87,z+.54),V(x+side*.54,4.22,z+.54),.073,mat.rubber,cyl);
  }

  // Outside, a pair of service structures frame the feed assembly and shelter the east edge.
  for(const x of [-10.18,11.64]){
    const z=x<0?-42.2:-53.38;
    box(x,.26,z,.92,.46,1.08,mat.concrete,0,.043);
    for(const q of [-1,1]){
      box(x+q*.25,2.72,z,.103,5.37,.125,mat.zinc);
      for(let j=0;j<7;j++){
        box(x,1.0+j*.63,z,.56,.056,.073,mat.edge);
        bar(V(x-.26,1.02+j*.62,z),V(x+.26,1.59+j*.62,z),.027,mat.plate);
      }
    }
    box(x,5.66,z,1.51,.30,.94,mat.edge,0,.057);
    floods(x,5.48,z,x>0?-1.03:1.44,x>0?mat.orangeLight:mat.whiteLight,x>0?90:77);
  }
  box(-9.66,2.46,-48.77,6.72,.27,3.62,mat.edge,0,.055);
  box(-9.52,2.61,-48.78,6.49,.12,3.45,mat.snow,0,.04);
  wall(-12.65,1.19,-48.72,.31,2.36,3.38,mat.concrete,.026);
  for(const x of [-12.41,-6.45]){
    box(x,1.15,-47.12,.21,2.23,.24,mat.steel);
    gusset(x,1.70,-47.0,.44,mat.zinc);
  }
  for(let i=0;i<17;i++)box(-12.36+i*.35,2.27,-48.72,.12,.091,3.43,mat.zinc);
  sign('N–2','PUMP ROOM',-9.70,2.40,-46.86,1.40,.20,forward,{bg:'#313635',fg:'#e5c99e'});
  radiator(-11.45,1.18,-48.77,10);
  radiator(-9.91,1.18,-48.81,11);
  radiator(-8.39,1.18,-48.86,10);
  const cartX=-8.04,cartZ=-47.36,cartY=groundAt(cartX,cartZ);
  attachProp('tool_cart',cartX,cartY,cartZ,1.28,.97,.77,-.18);
  block(cartX,cartY+.46,cartZ,1.13,.92,.64);
  point(-9.75,2.0,-47.1,0xf49f64,37,7.2);
  cable([V(-11.69,1.79,-47.3),V(-11.41,.44,-46.7),V(-10.64,.12,-45.79),V(-8.95,.09,-45.12),V(-6.21,.09,-44.79)],.042,mat.oxide);
  for(let i=0;i<13;i++){
    const x=-11.23+rand()*4.29,z=-46.72-rand()*2.6;
    const height=.14+rand()*.16, width=.16+rand()*.39, thickness=.17+rand()*.25, depth=.22+rand()*.28;
    const material=rand()>.5?mat.zinc:mat.oxide, rotation=rand()*Math.PI;
    if(Math.abs(x-cartX)>.81||Math.abs(z-cartZ)>.57)box(x,height,z,width,thickness,depth,material,rotation,.018);
  }
  for(const x of [-3.77,3.22]){
    let z=-64.09;
    box(x,1.95,z,.68,3.90,.91,mat.edge,0,.056);
    box(x,3.85,z,.86,.23,1.08,mat.zinc,0,.039);
    box(x,4.15,z,.83,.75,.86,mat.oxide,0,.053);
  }
  box(0,4.35,-63.99,8.40,.29,.72,mat.edge,0,.046);
  box(0,4.55,-64.02,8.38,.135,.78,mat.snow,0,.032);
  floods(-2.12,4.37,-63.68,.31,mat.orangeLight,97);
  floods(1.91,3.85,-77.37,-.50,mat.orangeLight,52);
  sign('03','CABLE PLATFORM',1.59,3.21,-76.96,1.35,.46,forward,{bg:'#372a20',fg:'#fcdbaf'});
}
