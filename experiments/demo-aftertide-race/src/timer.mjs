import { course, length } from './track.mjs';

export const formatTime=t=>{
  if(!Number.isFinite(t))return '—';
  const ms=Math.floor(t*1000+1e-6);
  return String(Math.floor(ms/60000)).padStart(2,'0')+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+'.'+String(ms%1000).padStart(3,'0');
};
export class LapTimer {
  constructor(position,best=Infinity) {this.best=best;this.reset(position);}
  reset(position) {
    this.prev=position;this.elapsed=0;this.simTime=0;this.startedAt=0;this.checkpoint=0;this.running=false;this.complete=false;this.record=false;
  }
  update(position,dt) {
    if(this.complete)return;
    const previous=this.prev;
    let advance=position-previous;
    if(advance<-length/2)advance+=length;
    if(advance>length/2)advance-=length;
    this.prev=position;
    const event=at=>this.simTime+dt*((at+(at<previous?length:0))-previous)/advance;
    const crossed=at=>advance>0 && (previous<at?at:at+length)<=previous+advance;
    if(!this.running&&crossed(course.start)) {
      this.running=true;this.startedAt=event(course.start);
    } else if(this.running) {
      const next=course.sectors[this.checkpoint];
      if(next!=null&&crossed(next))this.checkpoint++;
      if(this.checkpoint===course.sectors.length&&crossed(course.start)) {
        this.elapsed=event(course.start)-this.startedAt;
        this.complete=true;this.running=false;
        if(this.elapsed<this.best){this.record=true;this.best=this.elapsed;}
        return;
      }
    }
    this.simTime+=dt;
    if(this.running)this.elapsed=this.simTime-this.startedAt;
  }
}
