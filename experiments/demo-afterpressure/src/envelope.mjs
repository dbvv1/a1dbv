import * as T from 'three';
import { canvasMap,decal,random } from './art.mjs';

export function rainTracks(seed,metal=false) {
  const rand=random(seed);
  return decal(canvasMap(256,512,(c,w,h)=>{
    for(let i=0;i<135;i++) {
      const start=w*(.13+rand()*.74), length=h*(.12+rand()*.86);
      const bend=(rand()-.5)*8, width=.35+rand()**2*4.0;
      const shade=rand()<.73?(metal?'82,38,18':'39,35,26'):(metal?'141,67,28':'197,189,157');
      const g=c.createLinearGradient(0,1,0,length);
      g.addColorStop(0,'rgba('+shade+',0)');
      g.addColorStop(.065,'rgba('+shade+','+(.07+rand()*.21)+')');
      g.addColorStop(1,'rgba('+shade+',0)');
      c.strokeStyle=g;c.lineWidth=width;
      c.beginPath();c.moveTo(start,0);
      c.bezierCurveTo(start+bend,length*.28,start-bend,length*.74,start+bend*.17,length);c.stroke();
    }
  }),.72);
}

export function roofEdge(b,m) {
  // Flashing overlaps the coping and projects past the roof drainage trough.
  for(const [x,z,w,d] of [[-.14,13.53,16.53,.84],[-7.96,-7.20,.76,41.40]]) {
    b.box(m.edge,x,8.94,z,w,.43,d,.047);
    b.box(m.iron,x,9.199,z,w+.133,.091,d+.122,.021);
    b.box(m.black,x,9.134,z,w+.13,.057,d+.12,.012);
  }
  b.box(m.black,0,8.60,13.90,16.41,.083,.17,.014);
  b.box(m.iron,0,8.635,13.982,16.43,.130,.044,.011);
  for(let x=-7.78;x<7.86;x+=1.27) b.box(m.iron,x,8.622,13.912,.044,.169,.26,.008);
  // A raised roof monitor sits on its own curb and drains onto the lower standing seams.
  const z=3.95,w=4.68,d=17.3,x=-4.96;
  b.box(m.cast,x,9.121,z,w+.30,.46,d+.31,.048);
  b.box(m.iron,x+2.14,9.86,z,.19,1.33,d,.028);
  b.box(m.black,x-2.10,9.67,z,.18,1.14,d,.026);
  for(const end of [z-d*.5,z+d*.5]) {
    b.box(m.cast,x,9.78,end,w,1.24,.43,.043);
    b.box(m.black,x-.28,9.88,end+.229,w-.58,.56,.040,.011);
    for(let j=0;j<15;j++) {
      const xx=x-.23+(j-7)*.25;
      b.box(m.iron,xx,9.88,end+.252,.160,.50,.078,.007);
    }
  }
  for(let i=0;i<49;i++) {
    const zz=z+(i-24)*.353;
    b.box(m.gunMetal,x,10.566,zz,w+.62,.091,.367,.010,[0,0,.114]);
    b.box(m.iron,x,10.600,zz-.177,w+.64,.040,.027,.006,[0,0,.114]);
  }
  for(let i=0;i<12;i++) {
    const zz=z+(i-5.5)*1.38;
    b.box(m.iron,x-2.21,9.73,zz,.19,.91,.075,.013);
    b.box(m.iron,x-2.29,9.25,zz,.32,.08,.087,.011);
  }
  b.box(m.iron,x-2.27,10.255,z,.12,.133,d+.58,.015);
  b.box(m.black,x-2.51,10.146,z,.228,.085,d+.55,.016);
  b.pipe(m.iron,[x-2.53,10.14,z+d*.49],[x-2.53,8.94,z+d*.49],.058,12);
  b.tube(m.gunMetal,[[x+1.24,10.36,8.87],[x+1.24,11.14,8.87],
    [x+1.26,11.38,8.96],[x+1.28,11.44,9.26],[x+1.29,11.44,9.50]],.176,26,18);

}

export function cladWindowBays(b,m,openings) {
  const damp=rainTracks(921);
  const rot=[0,-Math.PI/2,0];
  const glass=new T.MeshPhysicalMaterial({
    color:0x47504d,roughness:.29,metalness:.28,transparent:true,opacity:.36,
    side:T.DoubleSide,depthWrite:false
  });
  for(const [i,{z,half}] of openings.entries()) {
    const span=half*2;
    for(const edge of [z-half,z+half]) {
      b.box(m.cast,-8.068,5.78,edge,.67,3.48,.245,.044);
      b.box(m.iron,-7.992,5.78,edge,.118,3.37,.095,.010);
    }
    b.box(m.cast,-8.112,7.45,z,.77,.213,span+.28,.033);
    b.box(m.cast,-8.135,4.14,z,.91,.205,span+.36,.026,[0,0,.080]);
    b.box(m.iron,-8.545,4.099,z,.047,.088,span+.29,.009);
    for(const y of [4.43,5.58,6.72,7.31])
      b.box(m.black,-7.986,y,z,.081,.062,span-.13,.007);
    for(const dz of [-.49,0,.49]) b.box(m.black,-7.993,5.84,z+dz,.086,2.95,.045,.007);
    for(const y of [4.99,6.15,7.02]) for(let j=0;j<4;j++) {
      if((i+j*2+Math.round(y*4))%7===1)continue;
      b.add(new T.PlaneGeometry(span*.237,y>6.8?.49:1.09),glass,[-7.989,y,z+(j-1.5)*span*.241],rot,false);
    }
    for(const edge of [z-half*.80,z+half*.78]) {
      b.add(new T.PlaneGeometry(.46,1.67),damp,[-8.012,3.24,edge],rot,false);
      b.box(m.black,-8.085,4.04,edge,.10,.043,.087,.007);
    }
  }
}

export function foundation(b,m) {
  // The old wall meets a battered concrete plinth, with the bridge carried on bearing plates.
  const shape=new T.Shape();
  for(const [i,[x,y]] of [[-10.35,-3.35],[-7.73,-3.35],[-7.73,.40],[-8.36,.40],[-9.13,-1.19]].entries())
    i?shape.lineTo(x,y):shape.moveTo(x,y);
  shape.closePath();
  for(const [z,d] of [[8.2,6.02],[2.1,6.06],[-4.0,6.06],[-10.1,6.06],[-16.2,6.06],[-22.3,6.06]]) {
    const g=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false});
    const uv=g.attributes.uv;
    for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/2.1,uv.getY(i)/2.1);
    b.add(g,m.cast,[0,0,z-d*.5]);
  }
  for(const z of [11.2,5.1,-1.0,-7.1,-13.2,-19.3,-25.4]) {
    b.box(m.edge,-8.43,-.08,z,.56,.88,.25,.058,[0,0,-.38]);
    b.box(m.cast,-8.73,-1.20,z,.76,2.51,.63,.068,[0,0,-.38]);
    b.box(m.edge,-9.34,-2.14,z,.76,1.18,.87,.088,[0,0,-.31]);
    b.box(m.black,-8.88,-.466,z-.37,.038,.27,.15,.012,[0,0,-.38]);
  }
  b.box(m.iron,-8.41,.444,-7.12,.11,.084,37.4,.014);
  for(const x of [-2.50,2.70]) for(const z of [15.56,21.15]) {
    b.box(m.cast,x,-1.12,z,1.19,1.67,1.54,.105);
    b.box(m.iron,x,-.448,z,1.18,.107,1.05,.032);
    b.box(m.black,x,-.491,z,1.04,.066,.86,.019);
    for(const dx of [-.38,.38]) for(const dz of [-.34,.34])
      b.pipe(m.bronze,[x+dx,-.425,z+dz],[x+dx,-.362,z+dz],.036,9);
  }
  for(const x of [-4.31,3.04])
    b.box(m.black,x,-.233,18.65,.255,.395,10.13,.022);
  for(let z=14.65;z<23.6;z+=.96) {
    b.box(m.iron,-.60,-.319,z,7.78,.16,.13,.020);
    for(const x of [-4.31,3.04])b.box(m.gunMetal,x,-.218,z,.33,.345,.055,.014);
  }
}


export function serviceFrame(b,m) {
  const z=13.75, left=-7.53, right=-4.17;
  b.box(m.cast,(left+right)*.5,7.05,z+.144,right-left+.64,.30,.84,.038);
  b.box(m.iron,(left+right)*.5,7.229,z+.422,right-left+.67,.065,.248,.016);
  for(const x of [left,right]) {
    b.box(m.cast,x,4.35,z+.192,.39,5.31,.71,.048);
    b.box(m.iron,x,6.93,z+.39,.48,.166,.43,.015);
    b.box(m.edge,x,1.66,z+.38,.56,.25,.69,.024);
    b.pipe(m.gunMetal,[x,6.61,z+.421],[x,6.61,z+.596],.043,9);
  }
  b.box(m.cast,(left+right)*.5,1.35,z+.166,right-left+.63,.28,.74,.047);
  b.tube(m.iron,[[right-.18,7.05,z+.58],[right-.19,6.80,z+.58],[right-.12,6.46,z+.62],
    [right-.07,4.01,z+.65],[right-.09,2.14,z+.65],[right-.29,1.54,z+.57]],.063,29,12);
  for(const y of [6.63,5.20,3.94,2.43]) b.box(m.iron,right-.10,y,z+.50,.294,.092,.30,.013);
}
