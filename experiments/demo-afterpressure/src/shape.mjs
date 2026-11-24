import * as T from 'three';

export function loft(sections, corners=28, exponent=.49) {
  const p=[], uv=[], indices=[];
  for (let k=0;k<sections.length;k++) {
    const [z,x,y,cy=0]=sections[k];
    for(let i=0;i<corners;i++) {
      const a=i*Math.PI*2/corners;
      const c=Math.cos(a),s=Math.sin(a);
      p.push(Math.sign(c)*Math.abs(c)**exponent*x,cy+Math.sign(s)*Math.abs(s)**exponent*y,z);
      uv.push((c*.65+s*.35)*.68,z*3.2+.28);
      if(k) {
        const prev=(k-1)*corners+i,next=(k-1)*corners+(i+1)%corners;
        indices.push(prev,next,prev+corners,next,next+corners,prev+corners);
      }
    }
  }
  for(const k of [0,sections.length-1]) {
    const start=p.length/3;
    const [z,x,y,cy=0]=sections[k];
    for(let i=0;i<corners;i++) {
      const input=(k*corners+i)*3;
      p.push(...p.slice(input,input+3));uv.push(p[input]/x*.5+.5,(p[input+1]-cy)/y*.5+.5);
    }
    const center=p.length/3;
    p.push(0,cy,z);uv.push(.5,.5);
    for(let i=0;i<corners;i++) {
      const a=start+i,b=start+(i+1)%corners;
      indices.push(center,k?a:b,k?b:a);
    }
  }
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(p,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

export function tendon(points,radii,xFlatten=1) {
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
  const segments=14,sides=12,frames=curve.computeFrenetFrames(segments,false);
  const geometry=new T.TubeGeometry(curve,segments,1,sides);
  const pos=geometry.attributes.position;
  const frame=new T.Vector3();
  for(let i=0;i<=segments;i++) {
    const t=i/segments,center=curve.getPointAt(t);
    const a=t*(radii.length-1),k=Math.min(Math.floor(a),radii.length-2);
    const radius=T.MathUtils.lerp(radii[k],radii[k+1],a-k);
    for(let j=0;j<=sides;j++) {
      const angle=j/sides*2*Math.PI;
      frame.copy(center).addScaledVector(frames.normals[i],Math.cos(angle)*radius*xFlatten)
        .addScaledVector(frames.binormals[i],Math.sin(angle)*radius);
      pos.setXYZ(i*(sides+1)+j,frame.x,frame.y,frame.z);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

