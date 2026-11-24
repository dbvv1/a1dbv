import { mkdir, writeFile } from 'node:fs/promises';
import { Car, spec, STEP, tireCurve, emptyInput } from '../src/vehicle.mjs';
import { testCases, runCase } from '../src/maneuvers.mjs';
import { course } from '../src/track.mjs';

const output=new URL('../telemetry/',import.meta.url);
await mkdir(output,{recursive:true});
const absMax=(r,k)=>Math.max(...r.map(x=>Math.abs(x[k])));
const round=v=>typeof v==='number'?Number(v.toFixed(3)):v;
const info={};
for(const test of testCases) {
  const r=runCase(test), last=r.at(-1), maxLoad=Math.max(...r.flatMap(x=>x.wheels.map(w=>w.load))),
    minLoad=Math.min(...r.flatMap(x=>x.wheels.map(w=>w.load)));
  const stats={maxLatG:absMax(r,'latG'),maxBrakeG:-Math.min(...r.map(x=>x.longG)),maxDriveG:Math.max(...r.map(x=>x.longG)),
    maxBeta:absMax(r,'beta'),maxYawRate:absMax(r,'yawRate'),minLoad,maxLoad,
    maxSlip:Math.max(...r.flatMap(x=>x.wheels.map(w=>Math.abs(w.slip)))),
    endSpeed:last.speed,endX:last.x,endS:last.s,maxOffset:absMax(r,'offset'),maxImpact:absMax(r,'impact')};
  if(test.id==='launch'){
    const ix=r.findIndex(x=>x.speed>=100);
    const a=r[ix-1],b=r[ix];
    stats.zeroTo100=a&&b?a.time+(100-a.speed)/(b.speed-a.speed)*(b.time-a.time):null;
  }
  if(test.id==='circle'){
    const window=r.filter(v=>v.time>=10&&v.time<=14);
    stats.steadyLatG=window.reduce((a,x)=>a+Math.abs(x.latG),0)/window.length;
    stats.steadyRadius=window.reduce((a,x)=>a+Math.hypot(x.x-34,x.z),0)/window.length;
    stats.steadyKmh=window.reduce((a,x)=>a+x.speed,0)/window.length;
    const peak=r.reduce((a,b)=>Math.abs(a.latG)>Math.abs(b.latG)?a:b);
    Object.assign(stats,{peakSpeed:peak.speed,peakTime:peak.time,peakRadius:Math.hypot(peak.x-34,peak.z),
      peakSlip:peak.wheels.map(w=>round(w.slip)),peakLoads:peak.wheels.map(w=>round(w.load))});
  }
  if(test.id==='lane-change'){
    stats.endYaw=last.yaw;
  }
  if(test.id==='hairpin'||test.id==='drift-recovery'){
    const apex=r.reduce((a,b)=>Math.abs(a.s-course.hairpin)<Math.abs(b.s-course.hairpin)?a:b);
    stats.apexSpeed=apex.speed;
    stats.apexOffset=apex.offset;
    stats.apexLatG=apex.latG;
    stats.wheelOuterPeak=Math.max(...r.map(x=>x.wheels[0].load));
  }
  if(test.id==='drift-recovery'){
    const peak=r.reduce((a,b)=>Math.abs(a.beta)>Math.abs(b.beta)?a:b);
    stats.peakTime=peak.time;
    stats.peakCountersteer=peak.steer;
    stats.endBeta=last.beta;
    stats.secondsToRecover=r.find(x=>x.time>peak.time&&Math.abs(x.beta)<3).time-peak.time;
  }
  if(test.id==='wall-contact'){
    const first=r.findIndex(x=>x.impact>.01);
    stats.firstContact=r[first].time;stats.firstContactKmh=r[first-1].speed;
    stats.speedAfterHalfSecond=r[first+20].speed;
  }
  const base=['time','speed','latG','longG','yawRate','beta','steer','steerTarget','x','z','yaw','throttle','brake','hand','impact','command','s','offset'];
  const wheelFields=['slip','load','fx','fy','utilization'];
  const header=[...base,...r[0].wheels.flatMap(w=>wheelFields.map(k=>w.id+'_'+k))];
  await writeFile(new URL(test.id+'.csv',output),[header,...r.map(x=>[...base.map(k=>x[k]),...x.wheels.flatMap(w=>wheelFields.map(k=>w[k]))].map(round))].map(r=>r.join(',')).join('\n')+'\n');
  info[test.id]=Object.fromEntries(Object.entries(stats).map(([k,v])=>[k,round(v)]));
}

const rackTest=new Car(), stepRack=.023, response=[];
rackTest.reset(0,0,0,85/3.6);
for(let i=0;i<=240;i++){
  response.push(rackTest.telemetry());
  rackTest.step({...emptyInput(),rack:stepRack,gas:.035});
}
const steady=response.filter(x=>x.time>=1);
const steadyYaw=steady.reduce((a,b)=>a+b.yawRate,0)/steady.length;
const steadyLat=steady.reduce((a,b)=>a+b.latG,0)/steady.length;
const timing=(field,at)=>response.find(x=>x[field]>=at)?.time;
const rackDegrees=stepRack*180/Math.PI;
const t10=timing('steer',rackDegrees*.1), t50=timing('steer',rackDegrees*.5),t90=timing('steer',rackDegrees*.9);
const yaw10=timing('yawRate',steadyYaw*.1),yaw90=timing('yawRate',steadyYaw*.9);
const fields=['time','latG','yawRate','steer','steerTarget'];
await writeFile(new URL('step-steer.csv',output),fields.join(',')+'\n'+response.map(x=>fields.map(k=>round(x[k])).join(',')).join('\n')+'\n');
const peak=[];const curve=['slip_deg,front,rear'];
for(let i=0;i<=360;i++){
  const d=i/10,f=tireCurve(d*Math.PI/180,spec.peakFront),r=tireCurve(d*Math.PI/180,spec.peakRear);
  peak.push([d,f,r]);curve.push([d,round(f),round(r)].join(','));
}
await writeFile(new URL('tire-curve.csv',output),curve.join('\n')+'\n');
info.response={rack10to90:round(t90-t10),rack90FromInput:round(t90),yaw10to90:round(yaw90-yaw10),
  yaw90AfterRack50:round(yaw90-t50),steadyLatG:round(steadyLat),stepRackDegrees:round(rackDegrees),
  frontPeak:peak.reduce((a,b)=>b[1]>a[1]?b:a)[0],rearPeak:peak.reduce((a,b)=>b[2]>a[2]?b:a)[0],
  front30:round(peak[300][1]),rear30:round(peak[300][2])};
await writeFile(new URL('summary.json',output),JSON.stringify(info,null,2)+'\n');
console.log(JSON.stringify(info,null,2));
