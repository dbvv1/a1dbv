import * as T from 'three';
const {clamp,damp,lerp}=T.MathUtils;
const V=(x,y,z)=>new T.Vector3(x,y,z);
const up=V(0,1,0);
const axes=[
  ['x','minX','maxX',V(-1,0,0),V(1,0,0)],
  ['y','minY','maxY',V(0,-1,0),V(0,1,0)],
  ['z','minZ','maxZ',V(0,0,-1),V(0,0,1)],
];
export function blocked(world,x,z,y,radius,height){
  return world.colliders.some(c=>c.active && x>c.minX-radius && x<c.maxX+radius &&
    z>c.minZ-radius && z<c.maxZ+radius && y+height>c.minY+.045 && y+.055<c.maxY);
}
export function moveOnFloor(world,p,dx,dz,radius,height){
  if(!blocked(world,p.x+dx,p.z,p.y,radius,height))p.x+=dx;
  if(!blocked(world,p.x,p.z+dz,p.y,radius,height))p.z+=dz;
}
export function floorAt(world,x,z,above){
  let y=world.groundAt(x,z);
  for(const c of world.colliders){
    if(c.active&&c.kind==='cover'&&c.maxY<=above+.071&&c.maxY>y&&
      x>c.minX-.08&&x<c.maxX+.08&&z>c.minZ-.08&&z<c.maxZ+.08)y=c.maxY;
  }
  return y;
}
function slice(origin,dir,c,max){
  let near=0,far=max,normal=null;
  for(const [key,lo,hi,negative,positive] of axes){
    const slope=dir[key];
    if(Math.abs(slope)<.000001){
      if(origin[key]<c[lo]||origin[key]>c[hi])return null;
      continue;
    }
    let a=(c[lo]-origin[key])/slope,b=(c[hi]-origin[key])/slope,n=negative;
    if(a>b){[a,b]=[b,a];n=positive;}
    if(a>near){near=a;normal=n;}
    far=Math.min(far,b);
    if(near>far)return null;
  }
  return normal&&near>.005?{t:near,normal}:null;
}
export function rayWorld(world,origin,dir,max=120,includeFloor=true){
  let hit=null, limit=max;
  for(const c of world.colliders){
    if(!c.active||c.kind==='bounds')continue;
    const k=slice(origin,dir,c,limit);
    if(k){limit=k.t;hit={...k,soft:c.kind==='rock'};}
  }
  if(includeFloor&&dir.y<-.01){
    let guess=-origin.y/dir.y;
    if(guess>0&&guess<limit+15){
      for(let i=0;i<4;i++)guess=(world.groundAt(origin.x+dir.x*guess,origin.z+dir.z*guess)-origin.y)/dir.y;
      if(guess>.012&&guess<limit){
        const z=origin.z+dir.z*guess,x=origin.x+dir.x*guess;
        hit={t:guess,normal:up,soft:!(z<-11.5&&z>-31.7||z<-64.6||z<-33&&Math.abs(x)<1.66)};
      }
    }
  }
  return hit;
}
function sphere(origin,dir,center,radius){
  const off=center.clone().sub(origin), far=off.dot(dir);
  const delta=radius*radius+far*far-off.lengthSq();
  if(delta<0)return Infinity;
  const impact=far-Math.sqrt(delta);
  return impact>.005?impact:Infinity;
}
function makeNavigator(world,zone,fly){
  const minX=-14.1,maxX=14.1, minZ=zone==='yard'?-62.55:-9.38,maxZ=zone==='yard'?-33.18:15.1;
  const spacing=.91,width=Math.floor((maxX-minX)/spacing)+1,height=Math.floor((maxZ-minZ)/spacing)+1;
  const radius=fly?.43:.63, body=fly?.45:.98;
  const canStand=(x,z)=>!blocked(world,x,z,world.groundAt(x,z)+(fly?1.77:.109),radius,body);
  const walkable=new Uint8Array(width*height);
  const point=i=>[minX+(i%width)*spacing,minZ+Math.floor(i/width)*spacing];
  for(let i=0;i<walkable.length;i++)walkable[i]=canStand(...point(i))?1:0;
  function nearest(x,z){
    const cx=clamp(Math.round((x-minX)/spacing),0,width-1), cz=clamp(Math.round((z-minZ)/spacing),0,height-1);
    let choice=-1,best=Infinity;
    for(let j=Math.max(0,cz-3);j<=Math.min(height-1,cz+3);j++)for(let i=Math.max(0,cx-3);i<=Math.min(width-1,cx+3);i++){
      const n=j*width+i;
      if(!walkable[n])continue;
      const cost=(minX+i*spacing-x)**2+(minZ+j*spacing-z)**2;
      if(cost<best){choice=n;best=cost;}
    }
    return choice;
  }
  const directions=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  return function route(x,z,gx,gz){
    const start=nearest(x,z),end=nearest(gx,gz);
    if(start===-1||end===-1||start===end)return [];
    const goal=point(end), costs=new Float32Array(walkable.length), from=new Int32Array(walkable.length);
    const pending=[start], closed=new Uint8Array(walkable.length);
    costs.fill(Infinity);from.fill(-1);costs[start]=0;
    const heuristic=i=>{
      const [x,z]=point(i);return Math.hypot(x-goal[0],z-goal[1]);
    };
    while(pending.length){
      let k=0;
      for(let i=1;i<pending.length;i++)if(costs[pending[i]]+heuristic(pending[i])<costs[pending[k]]+heuristic(pending[k]))k=i;
      const [current]=pending.splice(k,1);
      if(current===end){
        const result=[];
        let next=end;
        while(next!==-1&&next!==start){result.push(point(next));next=from[next];}
        return result.reverse();
      }
      if(closed[current])continue;
      closed[current]=1;
      const col=current%width,row=Math.floor(current/width);
      for(const [dx,dz] of directions){
        if(col+dx<0||col+dx>=width||row+dz<0||row+dz>=height)continue;
        const n=current+dz*width+dx;
        if(!walkable[n]||closed[n]||(dx&&dz&&(!walkable[current+dx]||!walkable[current+dz*width])))continue;
        const cost=costs[current]+spacing*(dx&&dz?Math.SQRT2:1);
        if(cost<costs[n]){from[n]=current;costs[n]=cost;pending.push(n);}
      }
    }
    return [];
  };
}

const waveLocations=[
  [['drone',-5.1,-57.5],['drone',4.2,-61]],
  [['stalker',-10.9,-59.5],['drone',11.2,-45.5],['stalker',-9.5,-42.2]],
  [['stalker',8.35,-60.53],['drone',-12.2,-50.7],['stalker',11.67,-43.51]],
];

export function createCombat(scene,world,models,fx,audio,callbacks){
  const bots=[], wrecks=[], bolts=[], retiredBolts=[], navigators=new Map();
  let id=0, wave=0, shotAlternator=0;
  const attackOrigin=V(), attackDir=V(), body=V(), direction=V(), target=V(), sensor=V(), actorCenter=V();
  const orbit=V(), goal=V(), visualVelocity=V();

  function add(type,x,z,index=0,zone='yard'){
    const model=models[type](), fly=type==='drone';
    const p=V(x,world.groundAt(x,z)+(fly?2.26:.89),z);
    model.root.position.copy(p);
    model.root.rotation.y=0;
    scene.add(model.root);
    bots.push({id:++id,model,p,fly,zone,type,x,z,life:fly?76:132,spawn:.1+index*.23,age:0,
      cooldown:.8+index*.36,charge:0,salvo:0,followup:0,phase:id*1.87,flank:id%2?1:-1,
      speed:0,yaw:0,impact:0,lastMove:V(),moveX:0,moveZ:0,path:[],planTimer:0,servoTime:0});
  }
  function reset(checkpoint=false){
    for(const bot of bots)scene.remove(bot.model.root);
    for(const wreck of wrecks)scene.remove(wreck.model.root);
    for(const bolt of bolts)retire(bolt);
    bots.length=0;wrecks.length=0;bolts.length=0;id=0;wave=0;shotAlternator=0;
    if(!checkpoint){
      add('drone',-4.8,2.65,0,'approach');
      add('drone',5.7,-3.8,1,'approach');
    }
  }
  function activateWave(value){
    wave=value;
    for(const [i,[type,x,z]] of waveLocations[value-1].entries())add(type,x,z,i);
  }
  function retire(bolt){
    scene.remove(bolt.mesh);
    retiredBolts.push(bolt.mesh);
  }
  function fire(bot,player,secondary=false){
    const strikeHeight=player.p.y+(player.grounded?1.11:1.26);
    const from=attackOrigin.copy(bot.p);
    from.y+=bot.fly?-.14:.07;
    from.x+=Math.sin(bot.yaw)*.52;
    from.z+=Math.cos(bot.yaw)*.52;
    const dist=from.distanceTo(player.p);
    const lead=dist/(bot.fly?18:22)*(.22+(wave===3?.08:0));
    const wiggle=secondary?.37:.13;
    const to=target.set(player.p.x+player.vx*lead+(Math.random()-.5)*wiggle,
      strikeHeight+(Math.random()-.5)*.23,player.p.z+player.vz*lead+(Math.random()-.5)*wiggle);
    attackDir.copy(to).sub(from).normalize();
    if(rayWorld(world,from,attackDir,Math.min(1,dist),false))return;
    const mesh=retiredBolts.pop()||fx.bolt();
    scene.add(mesh);
    mesh.position.copy(from);
    mesh.quaternion.setFromUnitVectors(up,attackDir);
    const speed=bot.fly?17.2:21.5;
    bolts.push({p:from.clone(),dir:attackDir.clone(),speed,life:2.35,mesh,damage:bot.fly?9:14});
    callbacks.soundAt('bolt',from,.70);
  }
  function obstruction(from,to){
    direction.copy(to).sub(from);
    const dist=direction.length();
    if(dist<.05)return false;
    direction.multiplyScalar(1/dist);
    return !!rayWorld(world,from,direction,dist,false);
  }
  function steer(bot,gx,gz,dt,pace,player){
    const p=bot.p, height=bot.fly?.44:.9, radius=bot.fly?.38:.61;
    const dx=gx-p.x,dz=gz-p.z;
    if(Math.hypot(dx,dz)<.085)return;
    const angle=Math.atan2(dx,dz);
    const angles=[0,.46,-.46,.96,-.96,1.54,-1.54,2.20,-2.20];
    let best=-100,bx=0,bz=0;
    sensor.set(p.x,p.y-(bot.fly?.18:.76),p.z);
    for(const off of angles){
      const turn=angle+off*bot.flank,x=Math.sin(turn),z=Math.cos(turn);
      if(blocked(world,p.x+x*1.05,p.z+z*1.05,sensor.y,radius,height))continue;
      let score=1.6*Math.cos(off)+.33*(x*bot.moveX+z*bot.moveZ);
      for(const other of bots){
        if(other===bot||Math.abs(other.p.y-p.y)>.79)continue;
        if((p.x+x-other.p.x)**2+(p.z+z-other.p.z)**2<1.34)score-=.75;
      }
      if(score>best){best=score;bx=x;bz=z;}
    }
    bot.moveX=damp(bot.moveX,bx,10,dt);bot.moveZ=damp(bot.moveZ,bz,10,dt);
    if(p.distanceToSquared(player.p)<1.52&&bot.moveX*dx+bot.moveZ*dz>0)pace*=.6;
    moveOnFloor(world,sensor,bot.moveX*dt*pace,bot.moveZ*dt*pace,radius,height);
    p.x=clamp(sensor.x,bot.zone==='yard'?-13.9:-11.7,bot.zone==='yard'?13.9:11.7);
    p.z=clamp(sensor.z,bot.zone==='yard'?-62.45:-9.46,bot.zone==='yard'?-33.15:15.2);
  }
  function abandon(bot,impulse){
    bot.model.eye.emissiveIntensity=.054;
    bot.wreckAge=0;
    bot.spin=(.58+Math.random()*.37)*bot.flank;
    bot.velocity=V(bot.moveX*.71+impulse.x*1.4,bot.fly?.23:.13,bot.moveZ*.71+impulse.z*1.4);
    bot.crashed=false;
    wrecks.push(bot);
  }
  function updateWrecks(dt){
    for(let i=wrecks.length-1;i>=0;i--){
      const wreck=wrecks[i],{model,p,fly,velocity}=wreck;
      wreck.wreckAge+=dt;
      if(wreck.wreckAge>32){
        scene.remove(model.root);wrecks.splice(i,1);continue;
      }
      if(wreck.crashed)continue;
      const ground=world.groundAt(p.x,p.z)+(fly?.27:.34);
      velocity.y-=dt*(fly?8.28:5.7);
      const nextX=p.x+velocity.x*dt,nextZ=p.z+velocity.z*dt;
      if(!blocked(world,nextX,nextZ,Math.max(.09,p.y-.24),.33,.50)){
        p.x=nextX;p.z=nextZ;
      }else velocity.x=velocity.z=0;
      p.y=Math.max(ground,p.y+velocity.y*dt);
      model.root.position.copy(p);
      model.root.rotation.y+=wreck.spin*dt;
      model.tilt.rotation.z=damp(model.tilt.rotation.z,wreck.spin*(fly?1.37:.76),6.9,dt);
      model.tilt.rotation.x=damp(model.tilt.rotation.x,.21+Math.abs(wreck.spin)*.22,5.8,dt);
      if(p.y>ground+.002)continue;
      wreck.crashed=true;
      target.copy(p);target.y=ground-(fly?.27:.34)+.044;
      fx.crash(target);
      callbacks.soundAt('crash',target,.78);
    }
  }
  function update(dt,time,player,stage){
    updateWrecks(dt);
    const inApproach=player.p.z<17&&player.p.z>-12.0;
    let threats=0,airGain=0,airPan=0,airThrottle=0;
    for(const bot of bots){
      const {model,p,fly}=bot;
      bot.age+=dt;
      const active=bot.zone==='approach'?inApproach:stage===3;
      model.root.visible=bot.age>bot.spawn;
      if(bot.age<bot.spawn)continue;
      const dx=player.p.x-p.x,dz=player.p.z-p.z,dist=Math.hypot(dx,dz);
      let visible=false;
      if(active){
        body.set(player.p.x,player.p.y+1.24,player.p.z);
        actorCenter.copy(p);actorCenter.y+=bot.fly?-.10:.12;
        visible=dist<30&&!obstruction(actorCenter,body);
        threats++;
      }
      const yaw=active?Math.atan2(dx,dz):Math.sin(time*.46+bot.phase)*.7;
      bot.yaw+=Math.atan2(Math.sin(yaw-bot.yaw),Math.cos(yaw-bot.yaw))*(1-Math.exp(-9*dt));
      model.root.rotation.y=bot.yaw;
      bot.cooldown=Math.max(0,bot.cooldown-dt);
      if(active&&bot.followup>0){
        bot.followup-=dt;
        if(bot.followup<=0&&visible)fire(bot,player,true);
      }
      if(active&&bot.charge>0){
        bot.charge-=dt;
        if(bot.charge<=0){
          if(visible){
            fire(bot,player);
            if(!fly||wave===3)bot.followup=.18;
          }
          bot.cooldown=(fly?1.57:1.44)+Math.random()*.58+(!visible?.22:0);
        }
      }else if(active&&visible&&dist<(fly?24:20)&&!bot.cooldown){
        bot.charge=fly?.59:.69;
        callbacks.soundAt('windup',p,fly?.75:.92);
      }
      bot.lastMove.copy(p);
      if(active){
        const desirable=fly?8.6:5.8;
        const span=Math.max(dist,.1);
        const ux=dx/span,uz=dz/span;
        const orbitBias=Math.sin(time*(fly?.84:1.08)+bot.phase)*.27+.73;
        if(!visible||dist>desirable+2.8){
          goal.set(player.p.x-ux*3.2+uz*bot.flank*(visible?1.7:2.6),0,
            player.p.z-uz*3.2-ux*bot.flank*(visible?1.7:2.6));
        }else{
          const radial=clamp((dist-desirable)*.45,-1.5,1.1);
          orbit.set(ux*radial+uz*bot.flank*orbitBias,0,uz*radial-ux*bot.flank*orbitBias);
          goal.set(p.x+orbit.x*4,0,p.z+orbit.z*4);
        }
        bot.planTimer-=dt;
        if(visible)bot.path.length=0;
        else if(bot.planTimer<=0){
          const key=bot.zone+':'+fly;
          if(!navigators.has(key))navigators.set(key,makeNavigator(world,bot.zone,fly));
          bot.path=navigators.get(key)(p.x,p.z,goal.x,goal.z);
          bot.planTimer=.66+(bot.id%5)*.07;
        }
        while(bot.path.length&&Math.hypot(bot.path[0][0]-p.x,bot.path[0][1]-p.z)<.63)bot.path.shift();
        const pace=(fly?3.32:3.81)*(bot.charge>0?.35:1)*(1-clamp(Math.abs(bot.impact)*.41,0,.52));
        if(bot.path.length)steer(bot,...bot.path[0],dt,pace,player);
        else steer(bot,goal.x,goal.z,dt,pace,player);
      }else{
        bot.moveX=bot.moveZ=0;
        p.x=damp(p.x,bot.x+Math.sin(time*.56+bot.phase)*.47,1.4,dt);
        p.z=damp(p.z,bot.z+Math.sin(time*.41+bot.phase)*.38,1.3,dt);
        bot.charge=bot.followup=0;
      }
      bot.speed=damp(bot.speed,Math.hypot(bot.lastMove.x-p.x,bot.lastMove.z-p.z)/Math.max(dt,.001),7,dt);
      const altitude=fly?2.00+Math.sin(time*2.24+bot.phase)*.24+Math.sin(time*.97+bot.phase)*.16:.862;
      const arrival=fly?Math.exp(-4.4*Math.max(0,bot.age-bot.spawn))*1.63:0;
      p.y=damp(p.y,world.groundAt(p.x,p.z)+altitude+arrival,7,dt);
      bot.impact=damp(bot.impact,0,10,dt);
      model.root.position.copy(p);
      model.tilt.rotation.y=bot.impact*.20;
      model.tilt.position.x=bot.impact*.066;
      model.tilt.position.z=-Math.abs(bot.impact)*.071;
      visualVelocity.set(p.x-bot.lastMove.x,0,p.z-bot.lastMove.z).divideScalar(Math.max(dt,.001));
      model.animate(time+bot.phase,dt,bot.speed*.23,bot.charge>0?1-bot.charge/.70:0,visualVelocity,world.groundAt);
      if(bot.fly&&dist<26){
        const value=Math.exp(-dist*.12)*(visible?1:.31);
        if(value>airGain){
          airGain=value;
          airPan=(-dx*Math.cos(player.yaw)+dz*Math.sin(player.yaw))/Math.max(3,dist);
          airThrottle=clamp(bot.speed*.21+(bot.charge>0?.27:0),0,1);
        }
      }
      bot.servoTime-=dt;
      if(!bot.fly&&active&&bot.speed>1.37&&dist<19&&bot.servoTime<=0){
        callbacks.soundAt('servo',p,.77);
        bot.servoTime=.38+(bot.id%3)*.036;
      }
    }
    audio.rotor(airGain,airPan,airThrottle);
    for(let i=bolts.length-1;i>=0;i--){
      const bolt=bolts[i],stride=bolt.speed*dt;
      bolt.life-=dt;
      body.set(player.p.x,player.p.y+1.10,player.p.z);
      const radius=.49;
      const isPlayer=sphere(bolt.p,bolt.dir,body,radius);
      body.y=player.p.y+.68;
      const low=sphere(bolt.p,bolt.dir,body,.40);
      const playerHit=Math.min(isPlayer,low);
      const hit=rayWorld(world,bolt.p,bolt.dir,stride+.01);
      const lethal=playerHit<=stride+.005&&(!hit||hit.t>playerHit);
      if(lethal)callbacks.damage(bolt.damage,bolt.p);
      if(hit&&!lethal){
        target.copy(bolt.p).addScaledVector(bolt.dir,hit.t);
        fx.impact(target,hit.normal,hit.soft?'snow':'metal',null,false);
        callbacks.soundAt(hit.soft?'frost':'ricochet',target,.41);
      }
      if(hit||bolt.life<=0||lethal){retire(bolt);bolts.splice(i,1);continue;}
      bolt.p.addScaledVector(bolt.dir,stride);
      bolt.mesh.position.copy(bolt.p);
    }
    return threats;
  }
  function shoot(origin,dir,ads){
    const coarse=rayWorld(world,origin,dir,100);
    const actual=world.traceVisible(origin,dir,Math.min(100,(coarse?.t??100)+1.6));
    const staticHit=actual??coarse;
    let t=staticHit?.t??100, selected=null, crit=false;
    for(const bot of bots){
      if(bot.age<bot.spawn)continue;
      const h=actorCenter.copy(bot.p);h.y+=bot.fly?.03:.07;
      h.x+=Math.sin(bot.yaw)*.38;h.z+=Math.cos(bot.yaw)*.38;
      const center=sphere(origin,dir,h,bot.fly?.179:.245);
      let housing=sphere(origin,dir,bot.p,bot.fly?.43:.52);
      if(bot.fly)for(const side of [-1,1]){
        h.set(bot.p.x+side*Math.cos(bot.yaw)*.76,bot.p.y-.04,bot.p.z-side*Math.sin(bot.yaw)*.76);
        housing=Math.min(housing,sphere(origin,dir,h,.292));
      }
      else{
        h.copy(bot.p);h.y-=.40;
        housing=Math.min(housing,sphere(origin,dir,h,.56));
      }
      const best=Math.min(center,housing);
      if(best<t){t=best;selected=bot;crit=center<=housing+.27;}
    }
    const at=origin.clone().addScaledVector(dir,t);
    if(selected){
      selected.life-=crit?52:ads?32:29;
      const side=Math.cos(selected.yaw)*dir.x-Math.sin(selected.yaw)*dir.z;
      selected.impact=Math.sign(side||((shotAlternator++%2)*2-1))*(crit?1.30:.81);
      const killed=selected.life<=0;
      if(killed){
        fx.destroy(selected.p);
        callbacks.soundAt('destroy',selected.p,.90);
        abandon(selected,dir);
        bots.splice(bots.indexOf(selected),1);
      }else{
        if(crit&&selected.charge>0){
          selected.charge=0;selected.followup=0;selected.cooldown=Math.max(selected.cooldown,.65);
        }
        fx.hit(at,crit);
        callbacks.soundAt('armor',at,crit?.64:.47);
      }
      callbacks.hit(crit,killed,selected.zone);
    }else if(staticHit){
      const type=actual?.type??(coarse.soft?'snow':'metal');
      fx.impact(at,staticHit.normal,type,actual?.parent,Boolean(actual));
      callbacks.soundAt(type==='snow'?'frost':type==='metal'?'ricochet':'stone-hit',at,.63);
    }
    return at;
  }
  return {reset,activateWave,update,shoot,
    remaining:zone=>bots.filter(bot=>bot.zone===zone).length,
    clearBolts(){for(const bolt of bolts)retire(bolt);bolts.length=0;},
    wreckSnapshot:()=>wrecks.map(w=>({x:w.p.x,y:w.p.y,z:w.p.z,landed:w.crashed})),
    snapshot:()=>bots.map(b=>({id:b.id,type:b.type,x:b.p.x,y:b.p.y,z:b.p.z,health:b.life,active:b.age>=b.spawn,charge:b.charge})),
  };
}





