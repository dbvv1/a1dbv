import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { spec } from './vehicle.mjs';
import { clamp, lerp } from './track.mjs';
import { rng, textureCanvas } from './world.mjs';

const TAU=Math.PI*2;
const v=(x,y,z)=>new T.Vector3(x,y,z);
const profile=[
  [-2.24,.715,.605,.59,.223],[-2.20,.854,.705,.68,.194],[-2.08,.934,.773,.733,.175],[-1.87,.970,.799,.785,.168],
  [-1.54,1.005,.813,.817,.171],[-1.28,1.003,.822,.821,.176],[-1.03,.964,.815,.806,.184],[-.71,.930,.817,.771,.194],
  [-.31,.917,.829,.755,.19],[.10,.926,.836,.765,.188],[.52,.949,.832,.785,.179],[.89,.981,.829,.81,.171],
  [1.20,1.005,.810,.845,.167],[1.47,1.001,.791,.853,.169],[1.70,.979,.756,.827,.173],
  [1.93,.945,.703,.772,.177],[2.12,.897,.649,.684,.185],[2.24,.813,.556,.588,.199],[2.28,.744,.514,.531,.218]
];
function section(data,z) {
  const i=clamp(data.findIndex(p=>p[0]>=z)-1,0,data.length-2);
  const a=data[i],b=data[i+1],p=data[Math.max(0,i-1)],q=data[Math.min(data.length-1,i+2)];
  const t=clamp((z-a[0])/(b[0]-a[0]),0,1), t2=t*t,t3=t2*t;
  const span=b[0]-a[0];
  return a.slice(1).map((y,j)=>{
    const k=j+1,m=(b[k]-p[k])/(b[0]-p[0])*span,n=(q[k]-y)/(q[0]-a[0])*span;
    return (2*t3-3*t2+1)*y+(t3-2*t2+t)*m+(-2*t3+3*t2)*b[k]+(t3-t2)*n;
  });
}
function topAt(z,x,lift=0) {
  const [w,h,edge]=section(profile,z);
  const t=clamp(Math.abs(x)/(w*.968),0,1);
  const fender=Math.sin(Math.PI*t)**1.7*(.016+.030*Math.exp(-((Math.abs(z)-1.33)**2)/.18));
  return v(x,lerp(h,edge,t**3.4)+fender+lift,z);
}
function sideWidth(w,t) {
  return w*(.885+.125*Math.sin(Math.PI*t*.78))-(1-t)**4*.009;
}
function sideAt(z,t,sign,offset=0) {
  const [w,,edge,lowest]=section(profile,z);
  const archCenter=z>0?spec.front:-spec.rear;
  const archR=z>0?.391:.400;
  const inner=archR**2-(z-archCenter)**2;
  const bottom=inner>0?Math.max(lowest,.341+Math.sqrt(inner)):lowest;
  const y=lerp(bottom,edge,t);
  const full=(y-lowest)/(edge-lowest);
  return v(sign*(sideWidth(w,full)+offset),y,z);
}
function endAt(front,x,y,offset=0) {
  const z0=front?2.28:-2.24,[w,,edge,bottom]=section(profile,z0);
  const t=clamp((y-bottom)/(edge-bottom),0,1), upper=topAt(z0,x).y;
  const h=clamp((y-bottom)/(upper-bottom),0,1);
  const norm=clamp(Math.abs(x)/sideWidth(w,t),0,1);
  const bow=Math.sin(Math.PI*h)*.096*(1-norm*norm)**.80;
  return v(x,y,z0+(front?1:-1)*(bow+offset));
}
function patch(a,b,point,c,d) {
  const pos=[],uv=[],idx=[];
  for(let i=0;i<=a;i++) for(let j=0;j<=b;j++){
    const x=i/a,y=j/b,p=point(x,y);
    pos.push(p.x,p.y,p.z);uv.push(x*(c??1),y*(d??1));
    if(i<a&&j<b){const n=i*(b+1)+j;idx.push(n,n+1,n+b+1,n+1,n+b+2,n+b+1);}
  }
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  return g;
}
function put(parent,geo,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0) {
  const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);
  o.castShadow=true;
  if(parent) parent.add(o);
  return o;
}
function line(g,ps,r,m,res=32,f=6) {
  return put(g,new T.TubeGeometry(new T.CatmullRomCurve3(ps),res,r,f),m);
}
function box(g,m,x,y,z,w,h,l,rz=0) {return put(g,new T.BoxGeometry(w,h,l),m,x,y,z,0,0,rz);}
function capsule(g,m,p1,p2,r,tip=r) {
  const d=p2.clone().sub(p1), center=p1.clone().lerp(p2,.5);
  const o=put(g,new T.CylinderGeometry(tip,r,d.length(),9),m,center.x,center.y,center.z);
  o.quaternion.setFromUnitVectors(v(0,1,0),d.normalize());return o;
}
function mergeParts(group) {
  const mats=new Map();
  for(const item of [...group.children]) {
    if(!item.isMesh || item.material.transparent) continue;
    item.updateMatrix();
    const g=item.geometry.index?item.geometry.toNonIndexed():item.geometry.clone();
    g.applyMatrix4(item.matrix);
    if(!mats.has(item.material)) mats.set(item.material,[]);
    mats.get(item.material).push(g);group.remove(item);item.geometry.dispose();
  }
  for(const [mat,gs] of mats) {
    const g=mergeGeometries(gs);
    put(group,g,mat);
    for(const small of gs) small.dispose();
  }
}
function components(root,m) {
  const paint=patch(190,42,(u,t)=>{
    const z=lerp(-2.24,2.28,u),[w]=section(profile,z);
    return topAt(z,lerp(-w*.968,w*.968,t));
  });
  put(root,paint,m.paint);
  for(const sign of [-1,1]){
    const side=patch(220,18,(u,t)=>sideAt(sign<0?lerp(2.28,-2.24,u):lerp(-2.24,2.28,u),1-t,sign));
    put(root,side,m.paint);
    const sill=patch(40,5,(u,t)=>{
      const z=lerp(-.943,.85,u), p=sideAt(z,.025+t*.15,sign,.008+.018*Math.sin(u*Math.PI));
      p.y-=.053*(1-t);
      return p;
    });
    put(root,sill,m.carbon);
    for(const axle of [spec.front,-spec.rear]){
      const r=axle>0?.391:.400, qs=[];
      for(let i=0;i<=36;i++){
        const a=lerp(.048,Math.PI-.048,i/36),z=axle+Math.cos(a)*r;
        const p=sideAt(z,0,sign,-.007); p.y=.341+Math.sin(a)*r-.004;
        qs.push(p);
      }
      line(root,qs,.008,m.rubber,44,6);
      const liner=patch(52,8,(u,t)=>{
        const a=lerp(.0001,Math.PI-.0001,u), z=axle+Math.cos(a)*r*.99999;
        const edge=sideAt(z,0,sign,.001);
        return v(lerp(sign*.61,edge.x,t),edge.y+Math.sin(Math.PI*t)*.023,z);
      });
      put(root,liner,m.well);
      const tub=patch(28,8,(u,t)=>{
        const z=axle+lerp(-r-.235,r+.235,u), x=sign*.668;
        return v(x,lerp(.141,topAt(z,x).y-.028,t),z);
      });
      put(root,tub,m.well);
      for(const direction of [-1,1]) {
        const z=axle+direction*(r+.005), lower=sideAt(z,0,sign,0);
        put(root,patch(4,8,(u,t)=>v(lerp(sign*.607,lower.x+.028*sign*u,t),
          lerp(lower.y-.008,.383,u),z+direction*.065*(1-t))),m.well);
      }
    }

    // Door shut follows the crown and dips around the sill.
    const sidePath=[
      [.65,.99],[.57,.68],[.59,.34],[.47,.218],[.17,.19],[-.30,.19],[-.69,.23],[-.75,.39],[-.64,.71],[-.48,.99]
    ].map(([z,y])=>sideAt(z,y,sign,.005));
    line(root,sidePath,.0031,m.seam,55,5);
    const handle=[-.29,-.35,-.43,-.47].map((z,i)=>sideAt(z,.783+(i===0?.012:0),sign,.011));
    line(root,handle,.015,m.gunmetal,16,7);
    line(root,handle.map(p=>p.clone().add(v(sign*.012,.004,0))),.006,m.edge,16,6);

    const intake=patch(37,10,(u,t)=>{
      const z=lerp(-.955,-.52,u);
      const w=Math.sin(Math.PI*u)**.62;
      return sideAt(z,.58+w*(t-.50)*lerp(.4,.13,u),sign,.008);
    });
    put(root,intake,m.seam);
    for(let i=0;i<3;i++){
      line(root,[-.895,-.837,-.72,-.59].map((z,j)=>sideAt(z,.516+i*.055+j*.011,sign,.016)),.008,m.carbon,18,5);
    }
    const pts=[[-.95,.57],[-.88,.36],[-.74,.34],[-.50,.56]].map(([z,t])=>sideAt(z,t,sign,.017));
    line(root,pts,.008,m.paint,26,6);

    const hoodPts=[1.01,1.17,1.51,1.80,2.055,2.153].map((z,i)=>topAt(z,sign*[.64,.66,.67,.636,.594,.53][i],.002));
    line(root,hoodPts,.0027,m.seam,46,5);
    const crease=[.93,1.25,1.47,1.69,1.94].map((z,i)=>topAt(z,sign*[.29,.33,.35,.36,.36][i],.003));
    line(root,crease,.0027,m.clearEdge,28,5);

    const housing=patch(42,12,(u,t)=>{
      const z=lerp(1.55,2.245,u);
      const wid=Math.sin(Math.PI*u)**.72*.185;
      const mid=lerp(.854,.668,u)+.031*Math.sin(Math.PI*u);
      return topAt(z,sign*(mid+(t-.5)*wid*1.73),.009+.009*Math.sin(Math.PI*t)*Math.sin(Math.PI*u));
    });
    put(root,housing,m.lightBlack);
    const lamp=(u,t,h=0)=> {
      const z=lerp(1.55,2.245,u), wid=Math.sin(Math.PI*u)**.72*.185;
      return topAt(z,sign*(lerp(.854,.668,u)+.031*Math.sin(Math.PI*u)+(t-.5)*wid*1.73),.016+h);
    };
    const fiber=[.09,.21,.38,.59,.78,.88,.94].map((u,i)=>lamp(u,[.62,.77,.84,.85,.82,.72,.58][i],.005));
    line(root,fiber,.010,m.drl,39,8);
    line(root,[lamp(.33,.20,.007),lamp(.54,.21,.008),lamp(.71,.23,.008),lamp(.83,.32,.007)],.006,m.drl,25,6);
    for(let i=0;i<3;i++){
      const a=lamp(.38+i*.15,.48,.025);a.y-=.003;
      const h=put(root,new T.SphereGeometry(.037,14,8),m.projector,a.x,a.y,a.z);
      h.scale.set(1,.37,1.19);
      const lens=put(root,new T.SphereGeometry(.024,12,8),m.lens,a.x,a.y+.009,a.z+.009);
      lens.scale.set(1,.43,1);
    }
    const glass=put(root,patch(35,9,(u,t)=>{
      const p=lamp(u,t,.009+Math.sin(Math.PI*t)*Math.sin(Math.PI*u)*.027);
      return p;
    }),m.headGlass);glass.castShadow=false;
  }
  line(root,[-.53,-.32,0,.32,.53].map(x=>topAt(2.153+Math.abs(x)*.012,x,.0023)),.0028,m.seam,36,5);
  line(root,[-.64,-.42,0,.42,.64].map(x=>topAt(-1.06-Math.abs(x)*.16,x,.004)),.0042,m.seam,34,5);

  for(const front of [true,false]) {
    const z0=front?2.28:-2.24,[w,,edge,bottom]=section(profile,z0);
    const cap=patch(60,22,(u,t)=>{
      const signed=(front?1:-1)*(u*2-1);
      const roof=topAt(z0,signed*w*.968).y;
      const y=lerp(bottom,lerp(roof,edge,Math.abs(signed)**9),t);
      return endAt(front,signed*sideWidth(w,(y-bottom)/(edge-bottom)),y);
    });
    put(root,cap,m.paint);
  }
  const chin=patch(70,9,(u,t)=>{
    const x=lerp(-.724,.724,u), k=Math.abs(x/.724);
    return v(x,.173+t*.053+.026*k**2,2.295-k**4*.028+.013*Math.sin(Math.PI*t));
  });
  put(root,chin,m.carbon);

  const frontPanel=(x,y,raise=0)=>endAt(true,x,y,raise);
  function intakePoint(u,t,raise=0) {
    const x=lerp(-.597,.597,u);
    const span=Math.sin(Math.PI*u)**.38;
    const y=.328+.019*(x/.60)**2+(t-.48)*.183*span;
    return frontPanel(x,y,raise);
  }
  const grille=patch(42,9,(u,t)=>{
    return intakePoint(u,t,.0055);
  });
  put(root,grille,m.seam);
  function honey(g,x0,x1,y0,y1,zAt,w,h,mat) {
    for(let row=0;row<Math.floor((y1-y0)/h);row++) for(let col=0;col<Math.floor((x1-x0)/w);col++){
      const x=x0+(col+.5+(row%2)*.5)*w, y=y0+(row+.5)*h;
      const ps=[];
      for(let j=0;j<=6;j++){const a=j*TAU/6;const px=x+Math.cos(a)*w*.52,py=y+Math.sin(a)*h*.62;ps.push(v(px,py,zAt(px,py)));}
      line(g,ps,.0028,mat,7,4);
    }
  }
  honey(root,-.486,.486,.269,.390,(x,y)=>frontPanel(x,y,.009).z,.049,.036,m.meshMetal);
  for(const t of [.02,.99]) {
    const contour=Array.from({length:24},(_,i)=>intakePoint(lerp(.003,.997,i/23),t,.012));
    line(root,contour,.0068,m.carbon,56,6);
  }
  const blade=Array.from({length:22},(_,i)=>intakePoint(lerp(.032,.968,i/21),.43,.014));
  line(root,blade,.006,m.gunmetal,52,6);
  for(const side of [-1,1]){
    const louver=(u,t,raised=.007)=>{
      const z=lerp(1.91,2.256,u), h=.19+.046*u+(t-.5)*Math.sin(Math.PI*u)**.5*.26;
      return sideAt(z,h,side,raised);
    };
    const corner=patch(30,11,(u,t)=>louver(u,t));
    put(root,corner,m.lightBlack);
    for(let i=0;i<3;i++){
      line(root,[.12,.30,.50,.72,.92].map(u=>louver(u,.23+i*.25,.013)),.0045,m.carbon,18,5);
    }
  }

  const rearAt=(x,y,off=0)=>endAt(false,clamp(x,-.689,.689),y,off);
  put(root,patch(58,12,(u,t)=>{
    const x=lerp(-.678,.678,u), edge=Math.sin(Math.PI*u)**.36;
    return rearAt(x,.368+(t-.45)*edge*.126,.012);
  }),m.lightBlack);
  const tail=patch(70,12,(u,t)=>{
    const x=lerp(-.664,.664,u), c=Math.abs(x);
    return rearAt(x,.481+Math.sin(Math.PI*u)**.4*t*.079+.013*c,.010);
  });
  put(root,tail,m.tailBlack);
  const rearPos=(x,y)=>rearAt(x,y+.013*Math.abs(x),.015);
  for(const side of [-1,1]) {
    const ps=[.027,.17,.31,.45,.54,.624].map((x,i)=>rearPos(side*x,[.530,.531,.531,.531,.529,.514][i]));
    line(root,ps,.0095,m.tail,52,7);
    for(let i=0;i<16;i++){
      const x=side*(.085+i*.032);
      const p=rearPos(x,.503);
      box(root,m.tailLens,p.x,p.y,p.z,.020,.0065,.005);
    }
    const wrapLight=[-2.22,-2.18,-2.13,-2.08].map((z,i)=>sideAt(z,.79+i*.035,side,.008));
    line(root,wrapLight,.010,m.tail,26,6);
  }
  const diffuser=patch(37,7,(u,t)=>{
    const x=lerp(-.676,.676,u);
    return rearAt(x,.156+t*.137+.033*Math.abs(x),.026-(t-.5)**2*.047);
  });
  put(root,diffuser,m.carbon);
  for(const x of [-.55,-.37,-.20,.20,.37,.55]) {
    put(root,patch(2,3,(u,t)=>v(x+u*.013,.123+t*.17,-2.323+t*.07+Math.abs(x)*.045)),m.carbon);
  }
  for(const x of [-.552,.552]) {
    const z=rearAt(x,.35,.026).z;
    const p=put(root,new T.CylinderGeometry(.066,.061,.09,28),m.gunmetal,x,.350,z+.046,Math.PI/2);p.scale.x=1.31;p.scale.z=.85;
    const fill=put(root,new T.CircleGeometry(.053,28),m.seam,x,.35,z-.002,0,Math.PI);fill.scale.set(1.31,.82,1);
    const p2=put(root,new T.TorusGeometry(.060,.0058,8,36),m.exhaust,x,.35,z-.003);p2.scale.set(1.31,.83,1);
  }
  const badge=textureCanvas(512,96,(ctx,w,h)=>{
    ctx.clearRect(0,0,w,h);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 55px Arial';
    ctx.fillStyle='#dfd6c1';ctx.fillText('A E R E N',w/2,h/2);
  });
  const mark=new T.MeshStandardMaterial({map:badge,transparent:true,alphaTest:.06,depthWrite:false,metalness:.48,roughness:.33,side:T.DoubleSide});
  const name=put(root,new T.PlaneGeometry(.29,.051),mark,0,.454,rearAt(0,.454,.009).z,0,Math.PI);name.castShadow=false;
  const crest=textureCanvas(128,128,(ctx,w,h)=>{
    ctx.fillStyle='#171915';ctx.beginPath();ctx.moveTo(15,18);ctx.lineTo(113,18);ctx.lineTo(100,82);ctx.lineTo(64,116);ctx.lineTo(27,82);ctx.fill();
    ctx.strokeStyle='#d8b483';ctx.lineWidth=6;ctx.stroke();
    ctx.fillStyle='#e5c29a';ctx.textAlign='center';ctx.font='bold 57px Arial';ctx.fillText('A',64,82);
  });
  const badgeFace=put(root,new T.PlaneGeometry(.087,.09),new T.MeshStandardMaterial({map:crest,transparent:true,alphaTest:.1,side:T.DoubleSide,roughness:.44}),0,topAt(1.981,0).y+.006,1.981,-1.31);
  badgeFace.castShadow=false;
}
const greenhouse=[
  [-1.425,.676,.816],[-1.298,.68,.845],[-1.09,.652,.953],[-.82,.616,1.119],[-.61,.588,1.225],[-.39,.579,1.268],
  [-.13,.581,1.276],[.109,.589,1.259],[.287,.602,1.231],[.42,.628,1.167],[.596,.68,1.041],[.812,.738,.904],[.93,.745,.843]
];
function cabin(root,m) {
  const glassAt=(z,u,dh=0)=> {
    const [w,h]=section(greenhouse,z);
    const foot=topAt(z,Math.sign(u)*Math.min(.824,w+.105)).y+.006;
    const fade=Math.sin(Math.PI*clamp((z+1.425)/2.355,0,1))**.54;
    return v(u*(w+Math.abs(u)**3*.108*fade),lerp(h,Math.min(h,foot),Math.abs(u)**5.5)+dh,z);
  };
  const roof=patch(31,26,(u,t)=>glassAt(lerp(-.657,.299,u),(t*2-1)*.88,.006));
  put(root,roof,m.roof);
  const wind=patch(32,30,(u,t)=>glassAt(lerp(.278,.93,u),t*2-1,.008));
  const back=patch(34,30,(u,t)=>glassAt(lerp(-1.425,-.641,u),t*2-1,.007));
  const frontGlass=put(root,wind,m.glass),rearGlass=put(root,back,m.glass);
  frontGlass.castShadow=false;rearGlass.castShadow=false;
  for(const side of [-1,1]){
    const trim=patch(32,7,(u,t)=>glassAt(lerp(-.65,.294,u),lerp(.86,1,t)*side,.010));
    put(root,trim,m.glass).castShadow=false;
  }
  for(const z of [-1.396,-.662,.293,.919]){
    line(root,[-1,-.86,-.65,-.35,0,.35,.65,.86,1].map(u=>glassAt(z,u,.011)),z===.293?.018:.012,m.trim,52,7);
  }
  for(const side of [-1,1]){
    for(const [u,r,mat] of [[1,.018,m.trim],[.846,.011,m.paint]]) {
      const pts=Array.from({length:22},(_,i)=>glassAt(lerp(u===1?-1.411:-.66,u===1?.924:.31,i/21),u*side,.011));
      line(root,pts,r,mat,68,7);
    }
    const pillar=[.83,.89,.985].map(u=>glassAt(-.378+(.99-u)*.34,side*u,.014));
    line(root,pillar,.022,m.trim,16,6);
    const pod=put(root,new T.SphereGeometry(1,24,13),m.paint,side*.994,.924,.515,0,-side*.28,side*.081);
    pod.scale.set(.152,.062,.093);
    capsule(root,m.carbon,v(side*.79,.852,.467),v(side*.96,.914,.515),.030,.024);
    const mirror=put(root,new T.SphereGeometry(1,22,12),m.mirror,side*1.005,.926,.453,0,-side*.25);
    mirror.scale.set(.109,.036,.020);
  }
  const cockpit=put(root,new T.BoxGeometry(1.45,.21,1.77),m.trim,0,.691,-.16);
  cockpit.castShadow=false;
  const dash=put(root,new T.SphereGeometry(1,26,12),m.leather,0,.776,.58);
  dash.scale.set(.742,.121,.439);
  for(const x of [-.355,.355]){
    const upholstered=put(root,new T.SphereGeometry(1,20,14),m.leather,x,.832,-.384,.16);
    upholstered.scale.set(.213,.350,.123);
    const insert=put(root,new T.SphereGeometry(1,18,12),m.seat,x,.872,-.281,.16);
    insert.scale.set(.145,.269,.069);
    const head=put(root,new T.SphereGeometry(1,20,12),m.leather,x,1.083,-.435);
    head.scale.set(.117,.091,.071);
  }
  put(root,new T.TorusGeometry(.116,.015,9,32),m.trim,-.352,.904,.482,-.31);
  capsule(root,m.gunmetal,v(-.435,.886,.483),v(-.269,.886,.483),.012);
  line(root,[glassAt(.84,-.68,.020),glassAt(.826,-.42,.021),glassAt(.803,-.16,.021),glassAt(.775,.14,.021)],.010,m.trim,24,5);
  for(let i=0;i<5;i++){
    const z=lerp(-1.32,-.86,i/4);
    line(root,[-.8,-.55,-.26,0,.26,.55,.8].map(x=>glassAt(z,x,.009)),.0017,m.clearEdge,29,4);
  }
}
function wheel(m,side,rear) {
  const carrier=new T.Group(), rot=new T.Group(), fixed=new T.Group();
  carrier.add(rot,fixed);
  if(side<0){rot.rotation.y=Math.PI;fixed.rotation.y=Math.PI;}
  const spinning=new T.Group();rot.add(spinning);
  const R=spec.tireRadius, W=rear?.146:.127;
  const lathe=(points,mat,n=96,group=spinning)=> {
    const g=new T.LatheGeometry(points.map(([r,w])=>new T.Vector2(r,w)),n);
    g.rotateZ(-Math.PI/2);
    return put(group,g,mat);
  };
  lathe([[.252,W-.028],[.264,W-.015],[.283,W-.006],[.304,W],[.324,W-.007],[.338,W-.025],
    [R,W-.052],[R+.001,W-.078],[R+.001,-W+.078],[R,-W+.052],[.338,-W+.025],[.324,-W+.008],[.303,-W],[.271,-W+.011],[.252,-W+.028]],m.tire,128);
  lathe([[.257,W-.012],[.258,W-.013],[.277,W-.009],[.288,W-.008],[.298,W-.005],[.310,W-.006],[.323,W-.014]],m.sidewall,128);
  for(const r of [.274,.289,.315,.324]) {
    put(spinning,new T.TorusGeometry(r,.0019,5,128),m.tireEdge,W-(r>.32?.014:r<.29?.008:.004),0,0,0,Math.PI/2);
  }
  lathe([[.224,-W+.025],[.239,-W+.018],[.255,-W+.010],[.260,-W+.018],[.263,W-.012],[.269,W-.009],[.268,W+.001],
    [.254,W+.005],[.247,W+.002],[.244,W-.009],[.238,W-.023],[.229,W-.046],[.227,-W+.025]],m.barrel,96);
  lathe([[.259,W+.001],[.267,W+.000],[.268,W-.003],[.262,W-.007]],m.edge,96);
  lathe([[.075,W-.087],[.105,W-.086],[.114,W-.091],[.116,W-.099],[.103,W-.104],[.077,W-.103]],m.gunmetal);
  lathe([[.108,W-.088],[.111,W-.091],[.198,W-.091],[.213,W-.094],[.216,W-.101],[.212,W-.109],[.109,W-.109]],m.disc);
  const holeGeo=new T.CircleGeometry(.0047,9);
  for(let slot=0;slot<12;slot++) for(let i=0;i<5;i++){
    const a=slot*TAU/12+i*.055,r=.157+i*.0102;
    const o=put(spinning,holeGeo.clone(),m.seam,W-.0905,r*Math.sin(a),r*Math.cos(a),0,Math.PI/2);
    o.scale.y=1.05;
  }
  for(const r of [.131,.15,.178,.204]) {
    put(spinning,new T.TorusGeometry(r,.0011,5,96),m.discDark,W-.09,0,0,0,Math.PI/2);
  }
  function polar(x,r,a) { return v(x,r*Math.sin(a),r*Math.cos(a)); }
  const letterRim=put(spinning,patch(162,5,(u,t)=>{
    const r=lerp(.292,.316,t);
    return polar(W+.003-Math.max(0,(r-.308)*.41),r,u*TAU);
  }),m.tireLetters);
  letterRim.castShadow=false;
  for(let i=0;i<7;i++) for(const wing of [-1,1]){
    const base=TAU*i/7;
    const spoke=patch(22,8,(u,t)=>{
      const r=lerp(.060,.245,u), split=wing*(.033+.107*u**1.25);
      const thick=lerp(.22,.030,u);
      const x=W-.012-.046*(1-u)**2+.010*Math.sin(Math.PI*t)+.015*u*Math.pow(Math.abs(t-.5)*2,1.8);
      return polar(x,r,base+split+(t-.5)*thick);
    });
    put(spinning,spoke,m.spoke);
    const lip=Array.from({length:12},(_,j)=>{
      const u=j/11,r=lerp(.070,.247,u);
      return polar(W-.001-.046*(1-u)**2,r,base+wing*(.033+.107*u**1.25)+wing*lerp(.090,.017,u));
    });
    line(spinning,lip,.0033,m.edge,20,5);
  }
  lathe([[0,W-.042],[.043,W-.041],[.064,W-.046],[.077,W-.053],[.08,W-.065],[0,W-.067]],m.gunmetal,64);
  lathe([[.023,W-.033],[.035,W-.034],[.042,W-.042],[.04,W-.046]],m.edge,64);
  put(spinning,new T.CircleGeometry(.028,32),m.carbon,W-.032,0,0,0,Math.PI/2);
  for(let i=0;i<5;i++){
    const a=TAU*i/5,x=Math.sin(a)*.052,z=Math.cos(a)*.052;
    put(spinning,new T.CylinderGeometry(.008,.010,.016,6),m.edge,W-.040,x,z,0,0,-Math.PI/2);
  }
  const valveAngle=.57;
  capsule(spinning,m.rubber,polar(W-.019,.235,valveAngle),polar(W+.013,.235,valveAngle),.005);
  const ca=.84;
  const caliper=patch(26,13,(u,t)=>{
    const a=lerp(ca-.38,ca+.36,u),r=lerp(.172,.236,t);
    return polar(W-.068+Math.sin(Math.PI*t)*.013+.009*Math.sin(Math.PI*u),r,a);
  });
  put(fixed,caliper,m.caliper);
  const piston=polar(W-.061,.194,ca);
  put(fixed,new T.SphereGeometry(.034,16,10),m.caliper,piston.x,piston.y,piston.z).scale.set(.56,1.15,.87);
  const edge=Array.from({length:15},(_,i)=>polar(W-.067,.236,lerp(ca-.38,ca+.36,i/14)));
  line(fixed,edge,.011,m.caliper,27,8);
  const tag=put(fixed,new T.PlaneGeometry(.071,.024),m.caliperText,W-.038,piston.y+.026,piston.z+.005,-.71,Math.PI/2);
  tag.rotation.order='ZYX';tag.rotation.set(-ca,Math.PI/2,0,'XYZ');
  tag.castShadow=false;
  mergeParts(spinning);mergeParts(fixed);
  return {carrier,spinning,side};
}
export function createCar(scene,environment) {
  const meshMat=(color,metalness,roughness,options={})=>new T.MeshStandardMaterial({color,metalness,roughness,side:T.DoubleSide,...options});
  const random=rng(62);
  const flake=textureCanvas(256,256,(ctx,w,h)=>{
    const im=ctx.createImageData(w,h);
    for(let i=0;i<im.data.length;i+=4){const x=128+(random()-.5)*42;
      im.data[i]=x; im.data[i+1]=x; im.data[i+2]=x; im.data[i+3]=255;}
    ctx.putImageData(im,0,0);
  });
  flake.colorSpace=T.NoColorSpace;flake.wrapS=flake.wrapT=T.RepeatWrapping;flake.repeat.set(10,7);
  const carbonTex=textureCanvas(64,64,(c,w,h)=>{
    c.fillStyle='#211f20';c.fillRect(0,0,w,h);
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){
      c.fillStyle=(x+y)%2?'#292a2a':'#242526'; c.fillRect(x*8,y*8,8,8);
      c.fillStyle='#111318';for(let j=0;j<4;j++) if((x+y)%2) c.fillRect(x*8+j*2,y*8,.45,8);else c.fillRect(x*8,y*8+j*2,8,.45);
    }
  });
  carbonTex.wrapS=carbonTex.wrapT=T.RepeatWrapping;carbonTex.repeat.set(10,5);
  const rubberMap=textureCanvas(1024,256,(ctx,w,h)=>{
    ctx.fillStyle='#282a28';ctx.fillRect(0,0,w,h);
    for(let i=0;i<8700;i++) { ctx.fillStyle=i%3?'#0c0e0e44':'#7b777238';ctx.fillRect(random()*w,random()*h,random()*2+.3,random()*2+.3); }
    ctx.strokeStyle='#121416';ctx.lineWidth=4;
    for(const y of [109,121,133,146]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let x=-32;x<w+32;x+=16){
      ctx.beginPath();ctx.moveTo(x,89);ctx.lineTo(x+7,99);ctx.lineTo(x+18,114);
      ctx.moveTo(x,163);ctx.lineTo(x+7,154);ctx.lineTo(x+17,139);ctx.stroke();
    }
  });
  rubberMap.wrapS=T.RepeatWrapping;
  const sidewallMap=textureCanvas(2048,192,(c,w,h)=>{
    c.fillStyle='#2b2a2a';c.fillRect(0,0,w,h);
    for(let i=0;i<9800;i++){c.fillStyle=i%3?'#16161644':'#87837916';c.fillRect(random()*w,random()*h,random()*3,random()*1.5);}
    c.font='bold 29px Arial';c.fillStyle='#54514b';
    for(let i=0;i<4;i++) c.fillText(i%2?'265 / 35 ZR 20   •   R3':'C O V E   S P O R T   /   S',65+i*512,116);
    c.font='14px Arial';c.fillStyle='#353631';c.fillText('RADIAL     TUBELESS     OUTSIDE',70,151);
    c.fillText('RADIAL     TUBELESS     OUTSIDE',1100,151);
  });
  sidewallMap.wrapS=T.RepeatWrapping;
  const caliperImage=textureCanvas(256,72,(c,w,h)=>{
    c.clearRect(0,0,w,h);c.font='italic bold 45px Arial';c.textAlign='center';c.fillStyle='#fff3dd';c.fillText('AEREN',w/2,50);
  });
  const tireLetters=textureCanvas(2048,96,(c,w,h)=>{
    c.clearRect(0,0,w,h);c.textAlign='center';c.textBaseline='middle';c.font='700 48px Arial';
    for(const [x,label] of [[.15,'C O V E   S P O R T'],[.61,'265 / 35 ZR 20'],[.88,'OUTSIDE  ▸']]){
      c.fillStyle='#171717c1';c.fillText(label,w*x,h*.515);
      c.fillStyle='#646159dc';c.fillText(label,w*x,h*.48);
    }
  });
  const discBrushed=textureCanvas(256,512,(c,w,h)=>{
    c.fillStyle='#bebebe';c.fillRect(0,0,w,h);
    for(let y=0;y<h;y++){
      c.fillStyle=y%3?'#17171724':'#fff6dc20';
      c.fillRect(0,y,w,.25+random()*.67);
    }
  });
  discBrushed.colorSpace=T.NoColorSpace;
  const m={
    paint:new T.MeshPhysicalMaterial({color:0xa52616,roughness:.245,metalness:.45,clearcoat:.86,clearcoatRoughness:.132,
      bumpMap:flake,bumpScale:.0027,envMap:environment,envMapIntensity:.74,side:T.DoubleSide}),
    roof:new T.MeshPhysicalMaterial({color:0x872016,metalness:.43,roughness:.265,clearcoat:.75,clearcoatRoughness:.14,
      envMap:environment,envMapIntensity:.76,side:T.DoubleSide}),
    seam:meshMat(0x261a18,.19,.76), trim:meshMat(0x171a20,.04,.68), well:meshMat(0x191819,.03,1),
    clearEdge:meshMat(0x683024,.62,.37), rubber:meshMat(0x222322,.01,.94),
    carbon:new T.MeshPhysicalMaterial({color:0xa09e9b,map:carbonTex,metalness:.24,roughness:.43,clearcoat:.49,side:T.DoubleSide}),
    gunmetal:meshMat(0x474847,.75,.34), edge:meshMat(0xaaa6a1,.81,.275),
    lightBlack:meshMat(0x161918,.42,.43), meshMetal:meshMat(0x373c3a,.78,.62),
    projector:meshMat(0x8a9ba8,.84,.24), lens:meshMat(0x6e8f9b,.53,.17,{emissive:0x6e808c,emissiveIntensity:.18}),
    drl:meshMat(0xd4e5ef,.14,.23,{emissive:0xceefff,emissiveIntensity:1.4}),
    headGlass:new T.MeshPhysicalMaterial({color:0xcbd3de,metalness:.32,roughness:.135,opacity:.21,transparent:true,depthWrite:false,side:T.DoubleSide}),
    glass:new T.MeshPhysicalMaterial({color:0x2f3c44,metalness:.41,roughness:.15,opacity:.77,transparent:true,depthWrite:false,
      clearcoat:.88,clearcoatRoughness:.09,envMap:environment,envMapIntensity:.68,side:T.DoubleSide}),
    mirror:meshMat(0xb4c3c8,1,.14),
    tailBlack:meshMat(0x280d10,.47,.28), tail:meshMat(0xd34b32,.14,.28,{emissive:0xd01807,emissiveIntensity:1.6}),
    tailLens:meshMat(0x59140b,.46,.25), exhaust:meshMat(0x848581,.90,.30),
    tire:meshMat(0xa0a1a3,0,.86,{map:rubberMap}), sidewall:meshMat(0xc5c5c5,0,.81,{map:sidewallMap}), tireEdge:meshMat(0x2f2e2c,0,.81),
    tireLetters:meshMat(0xcdcac1,0,.88,{map:tireLetters,transparent:true,alphaTest:.03,depthWrite:false}),
    barrel:meshMat(0x505358,.79,.31,{envMap:environment,envMapIntensity:.77}), spoke:meshMat(0x74797e,.78,.30,{envMap:environment,envMapIntensity:.71}),
    disc:meshMat(0x888582,.75,.52,{roughnessMap:discBrushed}),discDark:meshMat(0x5c5552,.70,.54),
    caliper:meshMat(0xc7863e,.42,.28),caliperText:meshMat(0xf4e7d7,.13,.39,{map:caliperImage,transparent:true,alphaTest:.07}),
    leather:meshMat(0x242223,0,.91),seat:meshMat(0x52423b,0,.85)
  };
  const root=new T.Group(), sprung=new T.Group(), shell=new T.Group(), rollGroup=new T.Group();
  root.add(sprung);sprung.add(rollGroup);rollGroup.add(shell);scene.add(root);
  components(shell,m);cabin(shell,m);
  box(shell,m.carbon,0,.196,0,1.59,.14,3.89);
  mergeParts(shell);
  const wheels=[];
  for(const z of [spec.front,-spec.rear])for(const side of [-1,1]){
    const w=wheel(m,side,z<0);
    w.carrier.position.set(side*spec.track/2,spec.tireRadius,z);
    root.add(w.carrier);wheels.push(w);
  }
  const shadow=textureCanvas(128,128,(c,w,h)=>{
    const g=c.createRadialGradient(w/2,h/2,10,w/2,h/2,w/2);
    g.addColorStop(0,'#110d0be3');g.addColorStop(.53,'#100c0bad');g.addColorStop(1,'#180f0800');
    c.fillStyle=g;c.fillRect(0,0,w,h);
  });
  const pad=put(root,new T.PlaneGeometry(2.95,5.75),new T.MeshBasicMaterial({map:shadow,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3}),0,.022,0,-Math.PI/2);
  pad.castShadow=false;
  const update=car=>{
    root.position.set(car.x,car.height,car.z);root.rotation.y=car.yaw;
    sprung.position.y=car.heave+.025;
    rollGroup.rotation.set(car.pitch,0,car.roll,'ZXY');pad.rotation.x=-Math.PI/2+car.pitch*.72;
    for(let i=0;i<wheels.length;i++){
      const w=wheels[i],v=car.wheels[i];
      w.carrier.rotation.y=i<2?car.steer*(1+v.side*car.steer*.19):0;
      w.carrier.position.y=spec.tireRadius+v.height-car.height+.008;
      w.spinning.rotation.x=v.spin*w.side;
    }
    m.tail.emissiveIntensity=1.46+car.brake*3.7+car.hand*2.3;
  };
  return {root,update};
}
