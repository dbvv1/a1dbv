import { clamp, lerp, angle, smooth, railOffset } from './track.mjs';

export const STEP = 1/120;
export const gravity = 9.80665;
export const spec = {
  mass:1395, inertia:2020, front:1.27, rear:1.39, track:1.65, cg:.46,
  tireRadius:.347, steerMax:.52, steerTime:.068, peakFront:8.2, peakRear:7.4,
  frontMu:1.095, rearMu:1.148, power:267000
};
const wheelbase=spec.front+spec.rear;
const wheelLayout=[[-1,spec.front],[1,spec.front],[-1,-spec.rear],[1,-spec.rear]];
const rad=Math.PI/180;
const paceShape=1.54;
const response=(x,target,t,dt)=>lerp(x,target,1-Math.exp(-dt/t));
const gearChange=[0,16.2,25.4,35.3,47.8,59.7,76];
const flat = {sample:()=>({height:0,grip:1,grade:0})};
export const emptyInput=()=>({gas:0,brake:0,steer:0,hand:0});

export function tireCurve(slip, peakDegrees) {
  const stiffness=Math.tan(Math.PI/(2*paceShape))/(peakDegrees*rad);
  return Math.sin(paceShape*Math.atan(stiffness*slip));
}

export class Car {
  constructor(ground=flat) {
    this.ground=ground;
    this.wheels=wheelLayout.map(([side,z],i)=>({id:['FR','FL','RR','RL'][i],side,x:side*spec.track/2,z,front:i<2}));
    this.reset();
  }
  reset(x=0,z=0,yaw=0,speed=0) {
    Object.assign(this,{x,z,yaw,u:speed,v:0,yawRate:0,ax:0,ay:0,transferX:0,transferY:0,throttle:0,brake:0,hand:0,
      steer:0,steerTarget:0,driverSteer:0,powerCommit:0,lastGas:0,driftIntent:0,counterAssist:0,yawAssist:0,
      reverseHold:0,gear:1,shift:0,shiftCue:0,rpm:1000,roll:0,pitch:0,heave:0,impact:0,scrape:0,time:0});
    for(const w of this.wheels) Object.assign(w,{load:spec.mass*gravity*(w.front?spec.rear:spec.front)/wheelbase/2,
      slip:0,rawSlip:0,fx:0,fy:0,spin:0,omega:speed/spec.tireRadius,compression:0,damper:0,utilization:0,grip:1,height:0});
    this.height=this.ground.sample(x,z).height;
    this.speed=Math.abs(speed);
  }
  get beta() { return Math.atan2(this.v,Math.max(1,Math.abs(this.u))); }
  get worldV() {
    const c=Math.cos(this.yaw), s=Math.sin(this.yaw);
    return {x:this.v*c+this.u*s,z:-this.v*s+this.u*c};
  }
  keyboardRack(input,speed,dt) {
    const raw=input.steer;
    const high=smooth(11,37,speed);
    const returning=raw===0||raw*this.driverSteer<0;
    const rate=returning?lerp(3.8,5.2,high):lerp(3.6,2.42,high);
    this.driverSteer+=clamp(raw-this.driverSteer,-dt*rate,dt*rate);
    const demand=Math.sign(this.driverSteer)*Math.abs(this.driverSteer)**1.33;
    const powerReserve=input.assist?.055*input.gas*smooth(23,39,speed):0;
    const roadG=lerp(1.02,.77,smooth(18,45,speed))-powerReserve;
    const rackLimit=Math.min(spec.steerMax,Math.atan2(wheelbase*gravity*roadG,speed**2)+.010*roadG);
    const powerWindow=smooth(7,11,speed)*(1-smooth(17,24,speed));
    const powerOn=input.gas>.9&&Math.abs(this.driverSteer)>.43&&!input.brake&&powerWindow>.05;
    if(powerOn&&this.lastGas<.2)this.powerCommit=1;
    else this.powerCommit=Math.max(0,this.powerCommit-(powerOn?.88:5)*dt);
    this.lastGas=input.gas;
    const powerSlide=smooth(.1,.42,this.powerCommit)*powerWindow;
    const handSlide=input.hand*smooth(4,11,speed)*smooth(.05,.48,Math.abs(this.driverSteer));
    const drift=Math.max(handSlide,powerSlide*.83);
    this.driftIntent=response(this.driftIntent,drift,drift>this.driftIntent?.075:.37,dt);

    const beta=this.beta;
    const isCounter=raw*beta>0&&Math.abs(beta)>.035&&!input.hand;
    const catchWindow=smooth(.04,.27,this.driftIntent)*(1-input.hand);
    const counterWeight=input.assist&&isCounter?catchWindow*smooth(.035,.18,Math.abs(beta)):0;
    this.counterAssist=clamp((beta*.76-this.yawRate*.11)*counterWeight,-.155,.155);
    const ordinary=demand*rackLimit*(1+.32*this.driftIntent);
    const fastCounter=isCounter&&input.assist?raw*rackLimit*.52*catchWindow:0;
    const yawCap=gravity*(roadG*Math.abs(demand)+.065)/Math.max(8,speed);
    const excess=Math.sign(this.yawRate)*Math.max(0,Math.abs(this.yawRate)-yawCap);
    const slipError=beta*smooth(.027,.105,Math.abs(beta));
    const normal=-7.6*excess+7.2*slipError;
    // Align toward the velocity during the catch. With the lever held, allow spin-up
    // from the tires and trim only angular speed beyond the drift envelope.
    const velocityYaw=(this.u*this.ax-this.v*this.ay)/Math.max(30,this.u**2+this.v**2);
    const turnCap=lerp(.68,.92,1-smooth(11,22,speed));
    const driftExcess=Math.sign(this.yawRate)*Math.max(0,Math.abs(this.yawRate)-turnCap);
    const capture=clamp(velocityYaw+3.4*beta,-1.15,1.15)-this.yawRate;
    const catching=catchWindow*smooth(.045,.19,Math.abs(beta))*(isCounter?5.8:2.1)*capture;
    this.yawAssist=input.assist?clamp((lerp(normal,-8.5*driftExcess,this.driftIntent)+catching)*smooth(3,10,speed),-3.25,3.25):0;
    return clamp(ordinary+fastCounter+this.counterAssist,-spec.steerMax,spec.steerMax);
  }
  step(input, dt=STEP) {
    const {mass,inertia,track,cg}=spec;
    this.time+=dt;
    const speed=Math.abs(this.u), c=Math.cos(this.yaw), s=Math.sin(this.yaw);
    const ground=this.ground.sample(this.x,this.z);
    const reverse = input.brake > .2 && input.gas < .05;
    this.reverseHold=reverse && this.u<.65 ? this.reverseHold+dt : 0;
    const backing=this.reverseHold>.33 || (reverse && this.u<-.22);
    this.throttle=response(this.throttle,backing?-input.brake:input.gas,input.gas>.02?.105:.065,dt);
    this.brake=response(this.brake,backing?0:Math.max(input.brake,this.u<-.6?input.gas:0),.052,dt);
    this.hand=response(this.hand,input.hand,.047,dt);

    this.steerTarget=input.keyboard?this.keyboardRack(input,speed,dt):input.rack??0;
    this.steer=response(this.steer,this.steerTarget,spec.steerTime,dt);

    this.shiftCue*=Math.exp(-dt*13.5);
    if (this.gear<6 && speed>gearChange[this.gear] && this.throttle>.28 && this.shift<=0) {
      this.gear++; this.shift=.17; this.shiftCue=1;
    } else if(this.gear>1 && speed<gearChange[this.gear-1]*.82 && this.shift<=0) {
      this.gear--; this.shift=.11; this.shiftCue=.58;
    }
    this.shift=Math.max(0,this.shift-dt);
    const gearFloor=this.gear===1?0:gearChange[this.gear-1]*.68;
    this.rpm=response(this.rpm,980+6500*clamp((speed-gearFloor)/(gearChange[this.gear]-gearFloor),0,1)+250*Math.max(0,this.throttle),.085,dt);
    const torqueForce=this.throttle<0?2850:Math.min(10400, spec.power/Math.max(8,speed));
    const drive=torqueForce*this.throttle*(this.shift>0?.54:1)*(this.throttle<0 ? 1-smooth(6,10,speed):1);
    const engineDrag=720*(1-Math.max(0,this.throttle))*smooth(1,12,speed)*Math.sign(this.u);
    const latTransfer=mass*this.transferX*cg/track;
    const lonTransfer=mass*this.transferY*cg/wheelbase;
    const fLoad=(mass*gravity*spec.rear/wheelbase-lonTransfer)/2;
    const rLoad=(mass*gravity*spec.front/wheelbase+lonTransfer)/2;
    let forceX=0, forceZ=0, torque=0;
    let roadFront=0, roadRear=0, roadLeft=0, roadRight=0;
    for(const w of this.wheels) {
      const terrain=this.ground.sample(this.x+w.x*c+w.z*s,this.z-w.x*s+w.z*c);
      w.height=terrain.height;
      w.grip=terrain.grip;
      const targetLoad=(w.front?fLoad:rLoad)-w.side*latTransfer*(w.front?.53:.47);
      w.load=response(w.load,Math.max(220,targetLoad),.044,dt);
      const springDeflection=(w.load-3450)/(w.front?40800:42600);
      w.damper+=(295*(springDeflection-w.compression)-24.2*w.damper)*dt;
      w.compression+=w.damper*dt;
      if(w.front) roadFront+=w.height/2; else roadRear+=w.height/2;
      if(w.side<0) roadLeft+=w.height/2; else roadRight+=w.height/2;
      const steer=w.front?this.steer*(1+w.side*this.steer*.19):0;
      const ct=Math.cos(steer), st=Math.sin(steer);
      const vx=this.v+this.yawRate*w.z, vz=this.u-this.yawRate*w.x;
      const lateral=vx*ct-vz*st, longitudinal=vx*st+vz*ct;
      w.rawSlip=Math.atan2(-lateral,Math.abs(longitudinal)+1.15);
      w.slip=response(w.slip,w.rawSlip,clamp(.29/(Math.abs(longitudinal)+.01),.013,.075),dt);

      const mu=(w.front?spec.frontMu:spec.rearMu)*terrain.grip*Math.pow(w.load/3450,-.09);
      const peak=mu*w.load;
      const brake=(w.front?.351:.149)*mass*gravity*1.36*this.brake;
      const direction=Math.tanh(longitudinal*2.6);
      const hand=w.front?0:this.hand;
      // Regular brakes retain a slip-dependent lateral reserve, while the lever
      // acts on the rear axle independently of the foot-brake control.
      const absLimit=peak*((w.front?.985:.80)-.22*smooth(.026,.125,Math.abs(w.slip)));
      let traction=drive/2;
      if(!w.front&&input.keyboard&&input.assist&&traction>0){
        const corner=Math.abs(this.driverSteer)*smooth(8,25,speed);
        const reserve=.98-.22*corner*(1-this.driftIntent);
        traction=Math.min(traction,peak*reserve);
      }
      const requested=(w.front?0:traction-engineDrag/2)-direction*(Math.min(brake,absLimit)+peak*.93*hand);
      const lock=(w.front?.99:lerp(.99,.85,smooth(.023,.113,Math.abs(w.slip))))-.21*hand;
      w.fx=clamp(requested,-peak*lock,peak*lock);
      const circle=Math.sqrt(Math.max(.035,1-(w.fx/(peak*1.025))**2));
      const alphaPeak=w.front?spec.peakFront:spec.peakRear;
      const powerOversteer=!w.front&&input.keyboard?this.driftIntent*this.throttle*.21:0;
      w.fy=peak*tireCurve(w.slip,alphaPeak)*circle*(1-.56*hand-powerOversteer);
      w.utilization=Math.hypot(w.fx,w.fy)/peak;
      w.omega=response(w.omega,(longitudinal/spec.tireRadius)*(1-.96*hand)+(w.front?0:Math.max(0,requested-peak)*.0014),.052,dt);
      w.spin+=w.omega*dt;

      const fx=w.fy*ct+w.fx*st, fz=w.fx*ct-w.fy*st;
      forceX+=fx; forceZ+=fz;
      torque+=fx*w.z-fz*w.x;
    }

    const gravityXZ=ground.grade*gravity;
    forceZ-=mass*gravityXZ*((ground.tx??0)*s+(ground.tz??0)*c);
    forceX-=mass*gravityXZ*((ground.tx??0)*c-(ground.tz??0)*s);
    forceZ-=Math.sign(this.u)*(.415*this.u**2+145*smooth(0,2,speed));
    this.ax=forceX/mass;
    this.ay=forceZ/mass;
    this.transferX=response(this.transferX,this.ax,.086,dt);
    this.transferY=response(this.transferY,this.ay,.105,dt);
    this.yawRate+=(torque/inertia+(input.keyboard?this.yawAssist:0)-this.yawRate*.65*(1-smooth(.1,3,speed)))*dt;
    this.v+=(this.ax-this.yawRate*this.u)*dt;
    this.u+=(this.ay+this.yawRate*this.v)*dt;
    if(Math.abs(this.u)<.095 && Math.abs(this.v)<.08 && Math.abs(this.throttle)<.055 && (this.brake>.12 || Math.abs(ground.grade)<.023)) {
      this.u=0; this.v=0;
    }
    this.yaw=angle(this.yaw+this.yawRate*dt);
    const velocity=this.worldV;
    this.x+=velocity.x*dt;
    this.z+=velocity.z*dt;

    this.impact*=Math.exp(-dt*7);
    this.scrape*=Math.exp(-dt*9);
    if(this.ground.nearest) this.collide();
    this.speed=Math.hypot(this.u,this.v);
    const rollTarget=Math.atan2(roadRight-roadLeft,track)+this.transferX/gravity*.052;
    const pitchTarget=-Math.atan2(roadFront-roadRear,wheelbase)-this.transferY/gravity*.048;
    this.roll=response(this.roll,rollTarget,.105,dt);
    this.pitch=response(this.pitch,pitchTarget,.12,dt);
    this.height=response(this.height,(roadFront+roadRear)/2,.055,dt);
    this.heave=response(this.heave,-this.wheels.reduce((a,w)=>a+w.compression,0)*.08,.14,dt);
  }
  collide() {
    const road=this.ground.nearest(this.x,this.z);
    if(!road) return;
    const c=Math.cos(this.yaw),s=Math.sin(this.yaw);
    const side=Math.sign(road.d);
    const nx=road.nx*side,nz=road.nz*side;
    const forward=nx*s+nz*c, across=nx*c-nz*s;
    const reach=1.01*Math.abs(across)+2.18*Math.abs(forward);
    const overlap=Math.abs(road.d)+reach-railOffset;
    if(overlap<=0) return;
    this.x-=nx*(overlap+.004);
    this.z-=nz*(overlap+.004);
    const armZ=clamp(forward*4.2,-1.75,1.75), armX=Math.sign(across)*.94;
    const arm=across*armZ-forward*armX;
    const closing=this.v*across+this.u*forward+this.yawRate*arm;
    if(closing<=0) return;
    const impulse=-(1+(closing>2?.16:.025))*closing/(1/spec.mass+arm*arm/spec.inertia);
    this.v+=across*impulse/spec.mass;
    this.u+=forward*impulse/spec.mass;
    this.yawRate+=arm*impulse/spec.inertia;
    const rub=clamp(Math.abs(impulse)/spec.mass*.12,0,.9);
    this.u-=Math.sign(this.u)*Math.min(Math.abs(this.u),rub*Math.abs(across));
    this.scrape=Math.max(this.scrape,clamp(this.speed/26+closing/18,0,1));
    this.impact=Math.max(this.impact,clamp(closing/8,0,1));
  }
  telemetry() {
    return {time:this.time,speed:this.speed*3.6,latG:this.ax/gravity,longG:this.ay/gravity,
      yawRate:this.yawRate/rad, beta:this.beta/rad,steer:this.steer/rad,steerTarget:this.steerTarget/rad,
      x:this.x,z:this.z,yaw:this.yaw/rad,throttle:this.throttle,brake:this.brake,hand:this.hand,impact:this.impact,
      driverSteer:this.driverSteer,driftIntent:this.driftIntent,counterAssist:this.counterAssist/rad,yawAssist:this.yawAssist/rad,
      wheels:[1,0,3,2].map(i=>{
        const w=this.wheels[i];
        return {id:w.id,slip:w.slip/rad,load:w.load,fx:w.fx,fy:w.fy,utilization:w.utilization};
      })};
  }
}
