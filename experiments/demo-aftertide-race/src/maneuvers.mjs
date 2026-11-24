import { Car, spec, STEP, emptyInput } from './vehicle.mjs';
import { angle, clamp, course, curvature, frame, nearest, surface } from './track.mjs';

export function onTrack(car,s,speed=0,offset=0) {
  const f=frame(s);
  car.reset(f.x+f.nx*offset,f.z+f.nz*offset,Math.atan2(f.tx,f.tz),speed);
  for(const wheel of car.wheels) wheel.height=car.height;
}
export function speedCommand(actual,goal) {
  const delta=goal-actual;
  return {gas:clamp(delta*.31+.08,0,1),brake:clamp(-delta*.155,0,.85)};
}
export function follow(car,goalOffset=0) {
  const f=nearest(car.x,car.z);
  const look=frame(f.s+Math.max(1.2,car.speed*.16));
  const heading=angle(Math.atan2(look.tx,look.tz)-car.yaw);
  const lead=curvature(look.s+car.speed*.2,6);
  const rack=clamp(Math.atan((spec.front+spec.rear)*lead)*.72+heading*.55
    -Math.atan2(.55*(f.d-goalOffset),Math.max(car.speed,7))+.78*car.beta,-.41,.41);
  return {f,rack};
}
export function lapInput(car) {
  const {f,rack}=follow(car);
  let goal=30;
  for(let d=0;d<90;d+=3){
    const bend=Math.abs(curvature(f.s+d,7));
    const turn=Math.sqrt(6.5/Math.max(.001,bend));
    goal=Math.min(goal,Math.sqrt(turn**2+2*4.2*d));
  }
  const delta=goal-car.speed;
  return {gas:clamp(.18+delta*.15,0,.82),brake:clamp(-delta*.112,0,.58),rack,hand:0};
}
export function hairpinInput(car,t,drift=false) {
  const {f,rack}=follow(car,drift?-.28:0);
  const into=f.s;
  const goal=into<350?16.1:into<370?15.0:into<428?12.8:into<447?15:20;
  if(!drift) {
    const pedals=into<328 ? {gas:0,brake:.55} : {...speedCommand(car.speed,goal),brake:clamp((car.speed-goal)*.10,0,.54)};
    return {...pedals,rack,hand:0};
  }
  if(into<375) return {rack,gas:clamp((15.9-car.speed)*.2,0,.7),brake:clamp((car.speed-15.9)*.10,0,.55),hand:0};
  if(into<381) return {rack:rack-.083,gas:0,brake:0,hand:.85};
  const release=clamp((into-381)/20,0,1);
  const slideCorrection=clamp(car.beta*.86,-.39,.39);
  return {rack:clamp(rack+slideCorrection,-.42,.42),...speedCommand(car.speed,12.9+release*1.4),hand:0};
}
export const testCases=[
  {id:'launch',label:'Full-throttle launch',duration:7, setup:c=>c.reset(), input:()=>({...emptyInput(),gas:1})},
  {id:'circle',label:'34 m skidpad / hold and accelerate past grip',duration:21, setup:c=>c.reset(0,0,0,12),
    input:(c,t)=>{
      const radius=34,d=Math.hypot(c.x-radius,c.z);
      const v=Math.min(18.3,12+t*.89)+Math.min(3.1,Math.max(0,t-14)*.63);
      const tangent=Math.atan2(c.z,radius-c.x);
      const rack=.085+angle(tangent-c.yaw)*.55+(d-radius)*.02+c.beta*.81;
      return {...speedCommand(c.speed,v),rack:clamp(rack,.015,.33),hand:0};
    }},
  {id:'lane-change',label:'Single lane change / 85 km/h',duration:4,setup:c=>c.reset(0,0,0,85/3.6),
    input:(c,t)=>{
      const n=t-.55;
      const rack=n<=0?0:n<.68?.06*Math.sin(n/.68*Math.PI):
        n<1.60?-.0442*Math.sin((n-.68)/.92*Math.PI):0;
      return {...speedCommand(c.speed,85/3.6),rack,hand:0};
    }},
  {id:'hairpin',label:'Hairpin / brake, rotate, exit',duration:10,track:true,setup:c=>onTrack(c,course.hairpin-86,108/3.6),input:(c,t)=>hairpinInput(c,t)},
  {id:'drift-recovery',label:'Hairpin / handbrake and countersteer',duration:10,track:true,setup:c=>onTrack(c,course.hairpin-86,108/3.6),input:(c,t)=>hairpinInput(c,t,true)},
  {id:'wall-contact',label:'Guardrail / oblique 68 km/h contact',duration:3,track:true,
    setup:c=>{onTrack(c,23,68/3.6,1.6);c.yaw+=.24;},input:()=>emptyInput()}
];
export function runCase(test) {
  const c=new Car(test.track?surface:undefined);test.setup(c);
  const rows=[];
  for(let i=0;i<=Math.floor(test.duration/STEP);i++){
    const t=i*STEP, input=test.input(c,t);
    if(i%3===0){
      const p=test.track?nearest(c.x,c.z):null;
      rows.push({...c.telemetry(),command:input.rack==null?input.steer:input.rack*180/Math.PI,
        s:p?.s??0,offset:p?.d??0});
    }
    c.step(input);
  }
  return rows;
}
