import * as T from 'three';
import { canvasMap, random } from './art.mjs';

function needleMap(seed) {
  const rng=random(seed);
  return canvasMap(1024,256,(c)=>{
    const palette=['#263623','#34442a','#44533a','#506044','#607352','#708264'];
    c.lineCap='round';
    for(let variant=0;variant<4;variant++) {
      c.save();c.translate(variant*256,0);
      const bend=(rng()-.5)*23;
      const stem=x=>132+bend*(x/250)**1.7;
      c.strokeStyle='#534739';c.lineWidth=2.7;
      c.beginPath();c.moveTo(11,stem(11));c.quadraticCurveTo(115,132,244,stem(244));c.stroke();
      for(let k=0;k<26;k++) {
        const x=22+8.12*k+(rng()-.5)*8;
        const a=stem(x);
        const length=9+(58+rng()*26)*Math.sin((.06+k/26)*Math.PI)*(.73+.46*rng());
        for(const side of [-1,1]) {
          const dx=9+18*rng(),dy=side*length;
          c.strokeStyle=palette[2];c.lineWidth=1.25;
          c.beginPath();c.moveTo(x,a);c.quadraticCurveTo(x+dx*.44,a+dy*.52,x+dx,a+dy);c.stroke();
          for(let j=0;j<22;j++) {
            const t=(j+.6)/22, xx=x+t*dx, yy=a+t*dy;
            const span=(5+rng()*15)*(.46+.54*(1-t));
            const color=palette[Math.floor(rng()*palette.length)];
            for(const inv of [-1,1]) {
              c.strokeStyle=color;
              c.lineWidth=.61+rng()*.97;
              c.beginPath();c.moveTo(xx,yy);
              c.lineTo(xx+span*(inv+.27),yy+side*span*(.28+rng()*.44));c.stroke();
            }
          }
        }
      }
      c.restore();
    }
  });
}

export function nearFirs(b,seed,terrain,breeze) {
  const needles=new T.MeshStandardMaterial({
    map:needleMap(seed+840),side:T.DoubleSide,vertexColors:true,alphaTest:.34,roughness:.91,metalness:0
  });
  needles.onBeforeCompile=shader=>{
    shader.uniforms.breeze=breeze;
    shader.vertexShader='uniform float breeze; attribute float sway;\n'+shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      float gust=sin(breeze*1.9+position.x*.48+position.z*.20)*.043
        +sin(breeze*3.81+position.x*1.13)*.024;
      transformed.x+=gust*sway;
      transformed.z+=gust*sway*.37;
      transformed.y+=sin(breeze*3.04+position.x*1.22)*sway*.014;
    `);
  };
  const bark=new T.MeshStandardMaterial({color:0x514139,roughness:.94});
  const rng=random(seed+291),xyz=[],uv=[],colors=[],flex=[];
  const color=new T.Color();
  function frond(a,end,width,tilt,tone,strength) {
    const x=end[0]-a[0], z=end[2]-a[2],l=Math.hypot(x,z);
    const sx=-z/l*width,sz=x/l*width,sy=width*tilt;
    const points=[
      [a[0]-.47*sx,a[1]-.47*sy,a[2]-.47*sz],
      [a[0]+.47*sx,a[1]+.47*sy,a[2]+.47*sz],
      [end[0]+sx,end[1]+sy,end[2]+sz],
      [end[0]-sx,end[1]-sy,end[2]-sz]
    ];
    const tile=Math.floor(rng()*4)*.25;
    const coords=[[tile+.001,.035],[tile+.001,.965],[tile+.249,.965],[tile+.249,.035]];
    for(const i of [0,1,2,0,2,3]) {
      xyz.push(...points[i]);uv.push(...coords[i]);flex.push(strength*(i<2?.26:1));
      color.setRGB(tone*.88,tone,tone*.91).multiplyScalar(i<2?.73:1.15).toArray(colors,colors.length);
    }
  }
  const stands=[
    [9.76,-37.9,3.18],[10.24,-39.2,4.0],[11.84,-41.7,4.95],[13.65,-44.4,4.1],
    [11.7,-48.3,3.55],[-13.4,-55.4,5.6],[15.2,-49.4,5.7],[13.0,-52.1,4.45],
    [12.8,-47.0,2.4],[12.10,-43.5,2.38],[10.97,-47.1,2.59],[12.8,-40.8,1.43]
  ];
  for(const [x,z,height] of stands) {
    const y=terrain(x,z)-.19;
    const lean=(rng()-.65)*height*.081, tilt=(rng()-.5)*height*.093;
    const point=t=>[x+lean*t*t,y+height*t,z+tilt*t*t];
    for(let i=0;i<7;i++) {
      const t=i/7,next=(i+1)/7;
      b.pipe(bark,point(t),point(next),height*(.019*(1-next)+.0028),8,
        height*(.019*(1-t)+.0028),false);
    }
    let spiral=rng()*Math.PI*2;
    const tierCount=8+Math.floor(rng()*3);
    for(let tier=0;tier<tierCount;tier++) {
      const t=.23+.72*(tier+.4*rng())/tierCount;
      const center=point(t),count=4+(tier%3===0);
      spiral+=.68+.89*rng();
      for(let branch=0;branch<count;branch++) {
        const angle=spiral+branch*Math.PI*2/count+(rng()-.5)*.68;
        const span=height*(.14+.25*Math.pow(1-t,1.57))*(1-t*.75)*(.68+.56*rng());
        const dx=Math.cos(angle),dz=Math.sin(angle),droop=span*(t*.59-.31);
        const stem=f=>[center[0]+dx*span*f,center[1]+droop*f-span*.10*Math.sin(Math.PI*f),center[2]+dz*span*f];
        b.pipe(bark,center,stem(.84),Math.max(.008,span*.021),7,.004,false);
        const tone=.77+(.29*rng()+t*.22);
        frond(stem(.26),stem(1.08),span*.20,.79*rng()-.25,tone,.40+.6*t);
        for(let twig=0;twig<4;twig++){
          const q=.30+.145*twig+.08*rng(),sign=twig%2?1:-1;
          const a=stem(q),tip=stem(q+.31);
          tip[0]-=dz*sign*span*(.31-q*.13);
          tip[2]+=dx*sign*span*(.31-q*.13);
          tip[1]+=span*(.06+rng()*.12);
          frond(a,tip,span*(.087+rng()*.038),sign*(.29+rng()*.75),tone*(.85+rng()*.27),.66+t*.34);
        }
      }
    }
    for(let k=0;k<6;k++) {
      const a=.85+k*.022,angle=k*2.21;
      const tip=point(Math.min(1.01,a+.10));
      tip[0]+=Math.sin(angle)*height*.064;tip[2]+=Math.cos(angle)*height*.064;
      frond(point(a),tip,height*.032,.58,1.19,1);
    }
  }
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(xyz,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  g.setAttribute('sway',new T.Float32BufferAttribute(flex,1));
  g.computeVertexNormals();
  b.add(g,needles,null,null,false);
}
