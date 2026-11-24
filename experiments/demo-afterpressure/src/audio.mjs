import { traceWorld } from './sim.mjs';

export function makeAudio() {
  let ctx, master, wet, wetLevel, noise, room, wind, power, rain, steelRain, undertow, volume=.72, isQuiet=false, motors=[];
  let voiceGain=1, foot=1;
  function noiseBuffer(seconds, shape) {
    const b = ctx.createBuffer(1,Math.floor(ctx.sampleRate * seconds),ctx.sampleRate);
    const ch = b.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * shape(i / ch.length);
    return b;
  }
  function filter(type, frequency, q = .7) {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = frequency;
    f.Q.value = q;
    return f;
  }
  function ambience(frequency, gain, type) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    const vol = ctx.createGain();
    vol.gain.value = gain;
    src.connect(filter(type,frequency)).connect(vol).connect(master);
    src.start();
    return vol;
  }
  function prepare() {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = volume*.68;
      const limit = ctx.createDynamicsCompressor();
      limit.threshold.value = -16;
      master.connect(limit).connect(ctx.destination);
      noise = noiseBuffer(3.16, () => 1);
      wet = ctx.createConvolver();
      wet.buffer=noiseBuffer(1.84,t=>{
        const echoes=.36+.15*Math.exp(-Math.abs(t-.017)*130.)+.19*Math.exp(-Math.abs(t-.052)*57.);
        return Math.exp(-t*7.9)*echoes*(.55+.45*Math.cos(t*28)**2);
      });
      wetLevel=ctx.createGain();
      wetLevel.gain.value=.215;
      wet.connect(wetLevel).connect(master);
      rain=ambience(1680,.11,'highpass');
      steelRain=ambience(2840,.034,'bandpass');
      undertow=ambience(126,.002,'lowpass');
      wind=ambience(235,.17,'lowpass');
      room=ambience(490,.034,'lowpass');
      power=ambience(86,.03,'lowpass');
      motors=Array.from({length:3},()=> {
        const source=ctx.createOscillator();
        source.type='triangle';
        const oscillator=ctx.createGain(),stereo=ctx.createStereoPanner();
        oscillator.gain.value=0;
        source.connect(oscillator).connect(stereo).connect(master);
        source.start();
        return {source,oscillator,stereo};
      });
    }
  }

  async function wake() {
    prepare();
    if (ctx.state === 'suspended') await ctx.resume();
  }

  function connect(source, volume, length, pan, echo, delay = 0) {
    const t = ctx.currentTime + delay;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(.0001,t);
    gain.gain.exponentialRampToValueAtTime(Math.max(.00011,volume*voiceGain),t + .008);
    gain.gain.exponentialRampToValueAtTime(.0001,t + length);
    const stereo = ctx.createStereoPanner();
    stereo.pan.value = pan;
    source.connect(gain).connect(stereo).connect(master);
    if (echo) stereo.connect(wet);
    return t;
  }
  function burst(length, volume, frequency, pan = 0, echo = true, q = .63, delay = 0) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = filter('bandpass', frequency, q);
    src.connect(f);
    const t = connect(f,volume,length,pan,echo,delay);
    src.loop = true;
    src.start(t,Math.random() * 1.25);
    src.stop(t + length + .02);
  }
  function tone(from,to,length,volume,kind = 'sine',pan = 0,echo = true,delay = 0) {
    const o = ctx.createOscillator();
    o.type = kind;
    const t = connect(o,volume,length,pan,echo,delay);
    o.frequency.setValueAtTime(from,t);
    o.frequency.exponentialRampToValueAtTime(to,t + length);
    o.start(t);
    o.stop(t + length + .02);
  }
  return {
    prepare,wake,
    quiet(paused) {
      isQuiet=paused;
      if(ctx)master.gain.setTargetAtTime(volume*(paused?.24:.68),ctx.currentTime,.07);
    },
    volume(next) {
      volume=next;
      this.quiet(isQuiet);
    },
    listen(run, release, paused, listener) {
      if(!ctx||ctx.state!=='running')return;
      const now=ctx.currentTime,p=run.player;
      const exposed=listener.z>13.48||listener.z<-27.45;
      const downstream=Math.max(0,1-Math.abs(listener.z+32)/29);
      const canopy=listener.z>13.55&&listener.z<19.55;
      const underHall=listener.z<7.65&&listener.z>-21;
      const gust=.87+.13*Math.sin(run.time*.66+listener.x*.22);
      const wall=listener.z>-27.35&&!run.relief;
      const head=release.discharge*Math.min(1,Math.max(0,(release.travel+35+listener.z)*.16));
      wetLevel.gain.setTargetAtTime(underHall?.27:canopy?.20:exposed?.076:.207,now,.40);
      wind.gain.setTargetAtTime(((exposed?.30:.082)+head*downstream*.31+release.surge*downstream*.17)*gust,now,.23);
      rain.gain.setTargetAtTime(exposed?(canopy?.135:.185):underHall?.035:.054,now,.17);
      steelRain.gain.setTargetAtTime(canopy?.14:exposed?.061:.015,now,.23);
      undertow.gain.setTargetAtTime((head+release.surge*.70)*downstream*(exposed?.52:.215),now,.23);
      room.gain.setTargetAtTime(.031+head*downstream*(exposed?.42:.16)+(wall?0:.12)*release.surge,now,.27);
      power.gain.setTargetAtTime(.031+release.pressure*.125,now,.25);
      for(const [i,d] of run.drones.entries()) {
        const m=motors[i];
        const dx=d.x-p.x,dz=d.z-p.z;
        const dist=Math.hypot(dx,dz);
        const active=d.health&&d.state!=='docked'&&!paused;
        const dy=d.y-p.y,span=Math.hypot(dx,dy,dz);
        const muffled=active&&span>.1&&traceWorld(p,{x:dx/span,y:dy/span,z:dz/span},span,run)<span-.06;
        m.oscillator.gain.setTargetAtTime(active?.091/(1+dist*.23)*(muffled?.24:1):.0001,now,.12);
        m.source.frequency.setTargetAtTime([132,99,62][i]+d.charge*(128-i*17)+Math.sin(run.time*9.5+i)*4,now,.065);
        m.stereo.pan.setTargetAtTime(Math.max(-.92,Math.min(.92,(dx*Math.cos(p.yaw)-dz*Math.sin(p.yaw))/Math.max(dist,1))),now,.10);
      }
    },
    play(kind,pan=0,event={},distance=0) {
      if (ctx?.state !== 'running') return;
      voiceGain=['detect','charge','bolt','impact','kill','hit','crash'].includes(kind)?1/(1+distance*.078):1;
      if(kind==='step')pan=(foot=-foot)*.096;
      switch (kind) {
        case 'arrival':
          tone(64,52,3.05,.12,'sine',-.22,false);
          tone(94,78,2.65,.125,'triangle',.12,false,.82);
          burst(2.3,.19,208,0,false,.73,.12);
          break;
        case 'entry':
          tone(830,706,.14,.11,'sine',-.29);
          tone(1070,940,.17,.11,'triangle',-.24,true,.13);
          burst(1.64,.37,315,-.14,true,1.28,.17);
          tone(121,62,1.36,.24,'sawtooth',-.09,true,.20);
          burst(.12,.43,925,-.10,true,1.6,1.71);
          break;
        case 'overlook':
          burst(.09,.15,2380,0,false,2.5);
          tone(410,436,.40,.21,'sine');
          tone(545,545,.55,.16,'sine',.14,true,.30);
          tone(817,817,1.2,.096,'triangle',-.12,true,.53);
          break;
        case 'shot':
          burst(.039,.62,4730,.03,false,1.6);
          burst(.111,.62,865,-.08,true,.92);
          tone(142,48,.182,.76,'triangle',0,false);
          tone(1190,436,.084,.077,'triangle',.14,true,.015);
          burst(.175,.234,423,-.22,true,1.02,.058);
          burst(.102,.145,1683,.26,true,1.38,.087);
          break;
        case 'step':
          burst(.19,event.quiet?.10:.26,event.surface==='grate'?680:330,pan,false);
          burst(event.surface==='water'?.20:.085,event.surface==='water'?.26:.117,event.surface==='water'?2110:1507,pan,false);
          if(event.surface==='grate') {
            tone(251+11*foot,154,.18,.112,'triangle',pan);
            tone(823+20*foot,544,.076,.029,'sine',pan,true,.017);
          }
          if(event.surface==='water')burst(.085,.106,4341,pan,false,1.2,.015);
          tone(86,43,.081,event.quiet?.08:.196,'sine',pan,false);
          break;
        case 'reload':
          burst(.12,.24,1350,.24,true,1.32);
          tone(260,128,.10,.12,'triangle',.22);
          break;
        case 'cell-out':
          burst(.14,.39,2110,-.22,true,1.93);
          tone(461,158,.13,.13,'triangle',-.11);
          break;
        case 'cell-in':
          tone(193,65,.13,.27,'triangle',-.15);
          burst(.085,.54,893,-.13,true,1.07);
          break;
        case 'latch':
          burst(.064,.35,2910,.15,true,2.3);
          tone(723,270,.11,.091,'triangle');
          break;
        case 'dry':
          burst(.043,.28,2600,.13,true,3.3);
          break;
        case 'loaded':
          burst(.073,.42,2380,.19,true,1.8);
          tone(740,340,.1,.075,'triangle',.24);
          break;
        case 'detect':
          tone(164,360,.61,.19,'triangle',pan);
          burst(.52,.15,795,pan,true,2.6);
          break;
        case 'charge':
          if(event.id===2) {
            tone(97,186,.89,.25,'triangle',pan);
            tone(241,622,.79,.19,'sawtooth',pan,true,.15);
            burst(.12,.27,1670,pan,true,2.0,.78);
          } else {
            tone(event.id===0?430:281,1360,.53,.172,'triangle',pan);
            tone(104,302,.57,.098,'sine',pan);
          }
          break;
        case 'bolt':
          tone(711,84,.30,.21,'sawtooth',pan);
          burst(.17,.27,2250,pan);
          break;
        case 'near-miss':
          tone(event.power>25?390:690,119,.132,.15,'triangle',pan,false);
          burst(.108,.42,3040,pan,false,.91);
          burst(.146,.27,696,pan,false,.81,.015);
          break;
        case 'hit':
          tone(event.part==='optic'?889:event.part==='armor'?403:515,event.part==='optic'?1100:143,.16,.21,'triangle',pan);
          burst(.093,.24,event.part==='armor'?4031:2050,pan);
          break;
        case 'impact':
          burst(.097,.18,event.surface==='metal'?2900:1010,pan);
          break;
        case 'interact':
          if(event.id==='gate')burst(.081,.31,1040,-.10,false,1.58);
          else tone(585,460,.23,.114,'triangle',pan);
          break;
        case 'gate-grip':
          burst(.125,.29,1357,pan,true,1.33);
          tone(105,49,.158,.16,'triangle',pan,true);
          burst(.117,.23,506,pan,true,1.07,.112);
          break;
        case 'relay':
          burst(2.52,.41,275,.10,true,1.49,.16);
          tone(94,49,2.59,.25,'triangle',.13,true,.25);
          burst(.17,.48,827,.13,true,1.42,2.58);
          // Fall through for the console confirmation.
        case 'cache':
          tone(294,488,.62,.155,'sine');
          tone(588,718,.39,.072,'triangle');
          break;
        case 'kill':
          burst(.50,.8,870,pan);
          burst(.36,.29,3120,pan);
          tone(143,35,.45,.46,'triangle',pan);
          break;
        case 'crash':
          tone(142,48,.29,.26,'triangle',pan);
          burst(.14,.30,618,pan,true,1.19);
          burst(.283,.12,2084,pan,true,.85,.045);
          break;
        case 'damage':
          tone(104,43,.38,.39,'sine',0,false);
          burst(.17,.47,387);
          break;
        case 'clear':
          tone(302,515,.43,.13,'sine');
          break;
        case 'gate':
          burst(.09,.56,1460,-.24,true,1.9,.16);
          burst(.14,.67,634,.32,true,2.2,.42);
          tone(76,35,1.42,.56,'triangle',-.14,true,.53);
          tone(192,83,2.3,.16,'sawtooth',.25,true,.48);
          burst(2.30,.89,165,.16,true,.72,.78);
          burst(2.84,.76,838,-.16,false,.78,1.25);
          burst(1.74,.47,1540,.24,false,.83,3.05);
          tone(89,46,1.70,.20,'triangle',.43,true,3.60);
          break;
      }
    },
    reset() {
      if (room) room.gain.setTargetAtTime(.034,ctx.currentTime,.32);
    }
  };
}

