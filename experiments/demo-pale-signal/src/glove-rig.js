import * as T from 'three';

const {clamp,smoothstep}=T.MathUtils;
const axisX=new T.Vector3(1,0,0),axisY=new T.Vector3(0,1,0),axisZ=new T.Vector3(0,0,1);

export async function loadGloves(){
  const asset=await fetch(new URL('../assets/gloves.json',import.meta.url));
  if(!asset.ok)throw new Error('Insulated glove mesh unavailable');
  return asset.json();
}

export function gloveMaterial(art){
  const material=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.83,metalness:.02,
    sheen:.31,sheenColor:0x889386,sheenRoughness:.88,normalMap:art.fabric[1]});
  material.normalScale.setScalar(.58);
  material.vertexColors=true;
  material.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 gloveRest,gloveNormal;\n'+shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      gloveRest=position;gloveNormal=normal;
    `);
    shader.fragmentShader='varying vec3 gloveRest,gloveNormal;\n'+shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      float wrist=smoothstep(.073,.086,gloveRest.z);
      float rib=abs(fract((gloveRest.x-gloveRest.y*.33)*223.)-.5);
      float welt=1.-smoothstep(.0008,.0027,abs(gloveRest.z-.086));
      float stitch=1.-smoothstep(.17,.34,abs(fract(gloveRest.x*920.)-.5));
      float weave=abs(sin(gloveRest.x*5190.+gloveRest.z*820.)*sin(gloveRest.z*4390.));
      float weaveAA=1.-smoothstep(.4,2.0,length(fwidth(gloveRest.xz))*900.);
      float dorsal=smoothstep(.18,.65,gloveNormal.y);
      float panel=smoothstep(.008,.018,gloveRest.z)*(1.-smoothstep(.052,.067,gloveRest.z));
      panel*=1.-smoothstep(.029,.037,abs(gloveRest.x+.13*(gloveRest.z-.035)));
      float binding=1.-smoothstep(.003,.009,abs(gloveRest.z-.011));
      diffuseColor.rgb*=mix(1.,.66+.12*smoothstep(.11,.36,rib),wrist)*(1.-weave*weaveAA*.12);
      diffuseColor.rgb=mix(diffuseColor.rgb*.70,vec3(.086,.101,.088),dorsal*panel*.80);
      diffuseColor.rgb*=1.-dorsal*binding*.24;
      diffuseColor.rgb+=welt*stitch*vec3(.044,.034,.018);
    `);
  };
  return material;
}

export function makeGlove(parent,side,material,asset){
  const geometry=new T.BufferGeometry();
  const positions=new T.Float32BufferAttribute(asset.position,3);
  geometry.setAttribute('position',positions);
  geometry.setAttribute('skinIndex',new T.Uint16BufferAttribute(asset.joint,4));
  geometry.setAttribute('skinWeight',new T.Float32BufferAttribute(asset.weight,4));
  geometry.setIndex(asset.index);
  geometry.computeVertexNormals();
  const normal=geometry.attributes.normal;
  const colors=[],uv=[];
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
    const dorsal=smoothstep(normal.getY(i),-.24,.43);
    const centre=Math.abs(x+.007*side);
    const pan=(1-smoothstep(centre,.035,.053))*smoothstep(z,-.033,.014)*(1-smoothstep(z,.043,.066));
    const edge=1-smoothstep(Math.abs(centre-(.038-.074*(z-.019)**2)),.0008,.0019);
    const palmGrain=1-dorsal;
    const brace=dorsal*pan;
    const fingertip=(1-smoothstep(z,-.043,-.028))*smoothstep(centre,0,.042);
    const light=(.54+.37*dorsal)*(1-palmGrain*.29-brace*.16-edge*.21-fingertip*.30);
    colors.push(light*(.095+.079*brace),light*(.111+.063*brace),light*(.101+.021*brace));
    uv.push(x*15.9+normal.getY(i)*.097,y*3.05-z*17.4);
  }
  geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  const mesh=new T.SkinnedMesh(geometry,material);
  mesh.frustumCulled=false;
  parent.add(mesh);
  const wrist=new T.Bone();wrist.name='wrist';mesh.add(wrist);
  const all=[wrist];
  const digits=asset.chains.map((rows,i)=>{
    const rest=rows.map(row=>new T.Vector3().fromArray(row));
    const solved=rest.map(v=>v.clone());
    const bones=rest.slice(0,3).map((v,j)=>{
      const bone=new T.Bone();bone.name=`digit-${i+1}.${j+1}`;
      bone.position.copy(v);mesh.add(bone);all.push(bone);
      return bone;
    });
    const lengths=rest.slice(0,3).map((p,j)=>p.distanceTo(rest[j+1]));
    const restDir=rest.slice(0,3).map((p,j)=>rest[j+1].clone().sub(p).normalize());
    return {bones,rest,solved,lengths,restDir};
  });
  mesh.bind(new T.Skeleton(all));mesh.normalizeSkinWeights();

  const flex=new T.Quaternion(),spreadQuat=new T.Quaternion(),opposition=new T.Quaternion();
  const delta=new T.Vector3(),goal=new T.Vector3(),tip=new T.Vector3();
  const lengthsBend=[.65,1.72,2.45];
  function place(digit,bend,splay,contact,amount,thumb){
    const {rest,solved,lengths,bones,restDir}=digit;
    const root=rest[0];
    solved[0].copy(root);
    spreadQuat.setFromAxisAngle(axisY,splay);
    opposition.setFromAxisAngle(axisZ,thumb?side*bend*.91:0);
    for(let j=0;j<3;j++){
      flex.setFromAxisAngle(axisX,-bend*(thumb?lengthsBend[j]*.46:lengthsBend[j]));
      delta.copy(restDir[j]).applyQuaternion(flex).applyQuaternion(spreadQuat).applyQuaternion(opposition);
      solved[j+1].copy(solved[j]).addScaledVector(delta,lengths[j]);
    }
    if(contact&&amount>.001){
      goal.copy(solved[3]).lerp(contact,amount);
      delta.copy(goal).sub(root).clampLength(lengths[0]*.53,(lengths[0]+lengths[1]+lengths[2])*.94);
      goal.copy(root).add(delta);
      // Keep the natural knuckle bend as the seed, then solve the chain to its contact.
      for(let pass=0;pass<5;pass++){
        solved[3].copy(goal);
        for(let j=2;j>=0;j--){
          delta.copy(solved[j]).sub(solved[j+1]).normalize();
          solved[j].copy(solved[j+1]).addScaledVector(delta,lengths[j]);
        }
        solved[0].copy(root);
        for(let j=0;j<3;j++){
          delta.copy(solved[j+1]).sub(solved[j]).normalize();
          solved[j+1].copy(solved[j]).addScaledVector(delta,lengths[j]);
        }
      }
    }
    for(let j=0;j<3;j++){
      bones[j].position.copy(solved[j]);
      delta.copy(solved[j+1]).sub(solved[j]).normalize();
      bones[j].quaternion.setFromUnitVectors(restDir[j],delta);
    }
  }
  return {pose(grip,spread,indexBend=0,points=null,weight=0){
    for(let i=0;i<4;i++){
      const bend=clamp(grip+(i===0?indexBend:0),-.25,1.17);
      place(digits[i],bend,side*(i-1.42)*spread,points?.[i],weight,false);
    }
    place(digits[4],grip,side*(spread*.57+grip*.34),points?.[4],weight,true);
    tip.copy(digits[0].solved[3]);
  },index:tip};
}
