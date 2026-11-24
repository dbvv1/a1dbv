import { clamp, smooth } from './track.mjs';

export class DriveAudio {
  muted=false;
  start() {
    if(this.ctx) {this.ctx.resume();return;}
    const a=this.ctx=new AudioContext();
    const amp=(value=0)=>{const n=a.createGain();n.gain.value=value;return n;};
    this.master=amp(.76);
    this.mix=a.createDynamicsCompressor();
    this.mix.threshold.value=-8;this.mix.ratio.value=3;this.mix.release.value=.15;
    this.master.connect(this.mix);this.mix.connect(a.destination);
    const noise=a.createBuffer(1,a.sampleRate*3,a.sampleRate);
    const data=noise.getChannelData(0);
    let seed=72,last=0;
    for(let i=0;i<data.length;i++){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const white=seed/2147483648-1; last=last*.67+.33*white;data[i]=white*.62+last*.82;
    }
    const source=a.createBufferSource();source.buffer=noise;source.loop=true;source.start();
    const filter=(type,f,q=.7)=>{const n=a.createBiquadFilter();n.type=type;n.frequency.value=f;n.Q.value=q;return n;};
    this.noiseBands=[
      ['wind','lowpass',480,.42],['road','bandpass',500,.59],['tire','bandpass',1250,1.7],
      ['brake','bandpass',370,1.15],['gravel','bandpass',780,2.1],['scrape','bandpass',265,1.38]
    ].map(([name,type,f,q])=>{
      const band=filter(type,f,q),g=amp();source.connect(band);band.connect(g);g.connect(this.master);
      return {name,band,g};
    });
    this.power=amp(.08);this.engineTone=filter('lowpass',500,1.0);
    this.power.connect(this.engineTone);this.engineTone.connect(this.master);
    const real=new Float32Array(18),imag=new Float32Array(18);
    for(const [k,v] of [[1,.31],[2,.43],[3,.82],[4,.30],[5,.20],[6,.29],[7,.17],[8,.08],[9,.13],[11,.08],[12,.053]]) imag[k]=v;
    this.engine=a.createOscillator();this.engine.setPeriodicWave(a.createPeriodicWave(real,imag));this.engine.frequency.value=16;
    this.engine.connect(this.power);this.engine.start();
    this.intake=a.createOscillator();this.intake.type='triangle';this.intake.frequency.value=56;
    this.intakeGain=amp(.026);this.intake.connect(this.intakeGain);this.intakeGain.connect(this.engineTone);this.intake.start();
    this.hitGain=amp();const hit=filter('bandpass',105,1.1);source.connect(hit);hit.connect(this.hitGain);this.hitGain.connect(this.master);
    this.shiftGain=amp();const shift=filter('bandpass',210,.77);
    source.connect(shift);shift.connect(this.shiftGain);this.shiftGain.connect(this.master);
    a.resume();
  }
  enableMeter() {
    if(this.meters)return;
    const nodes={engineRms:this.engineTone,brakeRms:this.noiseBands.find(b=>b.name==='brake').g,
      shiftRms:this.shiftGain,tireRms:this.noiseBands.find(b=>b.name==='tire').g,mixRms:this.mix};
    this.meters=Object.entries(nodes).map(([name,node])=>{
      const analyser=this.ctx.createAnalyser();analyser.fftSize=512;node.connect(analyser);
      return {name,analyser,data:new Float32Array(512)};
    });
  }
  measure() {
    const levels={};
    for(const {name,analyser,data} of this.meters??[]){
      analyser.getFloatTimeDomainData(data);
      let square=0;
      for(const value of data)square+=value*value;
      levels[name]=Math.sqrt(square/data.length);
    }
    return levels;
  }
  setMuted(value) {this.muted=value;}
  update(c,playing) {
    if(!this.ctx)return;
    const t=this.ctx.currentTime;
    const set=(param,value,tau=.055)=>param.setTargetAtTime(value,t,tau);
    const v=c.speed;
    let slip=0,off=0;
    for(const w of c.wheels) {
      slip+=smooth(.021,.137,Math.abs(w.slip))*smooth(.39,.93,w.utilization)*clamp(w.load/4000,.2,1.28)/4;
      off+=(1-w.grip)*.76;
    }
    slip=Math.max(slip,c.hand*.76);
    set(this.master.gain,this.muted?0:playing?.73:.025,.10);
    const gas=Math.abs(c.throttle);
    set(this.engine.frequency,c.rpm/60,.030);
    set(this.intake.frequency,c.rpm/52,.036);
    set(this.intakeGain.gain,.010+gas*.044*(1-c.shiftCue*.55));
    set(this.power.gain,.061+gas*.141*(1-c.shiftCue*.83),.023);
    set(this.engineTone.frequency,236+c.rpm*.098+gas*405);
    const braking=c.brake*smooth(2,18,v);
    const bands={wind:[200+v*17,.23*smooth(6,45,v)],road:[105+v*17,.17*smooth(0,34,v)],
      tire:[670+v*15+slip*677,.50*slip*smooth(3,13,v)],
      brake:[312+v*12,.26*braking*(.92+.08*Math.sin(t*77))],
      gravel:[450+v*15,off*.24*smooth(2,24,v)],
      scrape:[186+v*21,c.scrape*.27]};
    for(const {name,band,g} of this.noiseBands) {
      set(band.frequency,bands[name][0]);
      set(g.gain,bands[name][1]);
    }
    if(c.impact>(this.lastHit??0)+.11) {
      this.hitGain.gain.cancelScheduledValues(t);
      this.hitGain.gain.setValueAtTime(c.impact*.83,t);
      this.hitGain.gain.exponentialRampToValueAtTime(.001,t+.27);
    }
    if(c.shiftCue>.38&&this.lastGear!==undefined&&c.gear!==this.lastGear){
      const upshift=c.gear>this.lastGear;
      this.shiftGain.gain.cancelScheduledValues(t);
      this.shiftGain.gain.setValueAtTime(.015,t);
      this.shiftGain.gain.linearRampToValueAtTime(upshift?.49:.24,t+.019);
      this.shiftGain.gain.exponentialRampToValueAtTime(.001,t+(upshift?.143:.113));
    }
    this.lastGear=c.gear;
    this.lastHit=c.impact;
  }
}
