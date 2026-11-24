const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

const footstepBeds={
  snow:new URL('../assets/audio/snow-dry.wav',import.meta.url),
  metal:new URL('../assets/audio/metal-floor.wav',import.meta.url),
  solid:new URL('../assets/audio/solid-floor.wav',import.meta.url),
};

export async function loadFootsteps(){
  return Object.fromEntries(await Promise.all(Object.entries(footstepBeds).map(async ([surface,url])=>{
    const response=await fetch(url);
    if(!response.ok)throw new Error('Missing footsteps for '+surface);
    return [surface,await response.arrayBuffer()];
  })));
}

export function createAudio(footsteps){
  let ctx, master, fx, music, atmosphere, outdoor, indoor, windTone, noiseBuffer, analyser;
  let volume=.75, state='title', lastNote=0, phrase=0, previousT=0;
  let levelSamples,rotorPan,rotorGain,rotorTone,rotorPulse;
  const samples={},lastSample={snow:-1,metal:-1,solid:-1};
  const playedFootsteps={snow:0,metal:0,solid:0};
  // Prepare PCM while assets are loading. Pointer lock only assembles and resumes the graph.
  const pcmRate=48000,noisePCM=new Float32Array(pcmRate*4);
  let pink=0,bass=0;
  for(let i=0;i<noisePCM.length;i++){
    const n=Math.random()*2-1;pink=.82*pink+.18*n;bass=.988*bass+.012*n;
    noisePCM[i]=n*.51+pink*.36+bass*.13;
  }
  function impulse(seconds,falloff,early){
    return [0,1].map(channel=>{
      const samples=new Float32Array(Math.ceil(pcmRate*seconds));
      for(let i=0;i<samples.length;i++){
        const t=i/samples.length;
        samples[i]=(Math.random()*2-1)*Math.pow(1-t,falloff)*(i<pcmRate*.014?.01:.27);
      }
      for(const [delay,gain] of early){
        const i=Math.floor((delay+channel*.0048)*pcmRate);
        if(i<samples.length)samples[i]+=gain;
      }
      return samples;
    });
  }
  const openAir=impulse(.77,5.4,[[.114,.69],[.222,.35],[.36,.12]]);
  const stationHall=impulse(.45,3.6,[[.023,.62],[.042,.46],[.061,.35],[.086,.19]]);
  function prepare(){
    if(ctx)return;
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)return;
    ctx=new Audio();
    for(const [surface,bytes] of Object.entries(footsteps)){
      ctx.decodeAudioData(bytes).then(buffer=>{samples[surface]=buffer;}).catch(error=>console.warn(error));
    }
    master=ctx.createGain();
    const limiter=ctx.createDynamicsCompressor();
    limiter.threshold.value=-14;limiter.knee.value=16;limiter.ratio.value=5;limiter.attack.value=.006;limiter.release.value=.16;
    analyser=ctx.createAnalyser();analyser.fftSize=1024;levelSamples=new Float32Array(1024);
    master.gain.value=volume;
    master.connect(limiter).connect(analyser).connect(ctx.destination);
    fx=ctx.createGain();fx.connect(master);
    music=ctx.createGain();music.gain.value=.83;music.connect(master);
    atmosphere=ctx.createGain();atmosphere.gain.value=.29;atmosphere.connect(master);

    noiseBuffer=ctx.createBuffer(1,noisePCM.length,pcmRate);
    noiseBuffer.copyToChannel(noisePCM,0);
    function reverb(pcm){
      const conv=ctx.createConvolver(),ir=ctx.createBuffer(2,pcm[0].length,pcmRate);
      pcm.forEach((data,channel)=>ir.copyToChannel(data,channel));
      conv.buffer=ir;
      conv.connect(fx);
      const send=ctx.createGain();send.gain.value=.11;send.connect(conv);
      return send;
    }
    outdoor=reverb(openAir);
    indoor=reverb(stationHall);
    const wind=ctx.createBufferSource();wind.buffer=noiseBuffer;wind.loop=true;
    const filter=ctx.createBiquadFilter(),deep=ctx.createBiquadFilter(),crisp=ctx.createBiquadFilter();
    filter.type='bandpass';filter.frequency.value=440;filter.Q.value=.44;
    deep.type='lowpass';deep.frequency.value=140;deep.Q.value=.7;
    crisp.type='lowpass';crisp.frequency.value=760;crisp.Q.value=.68;
    const slight=ctx.createGain();slight.gain.value=.28;
    wind.connect(filter).connect(crisp).connect(atmosphere);
    wind.connect(deep).connect(slight).connect(atmosphere);
    wind.start();windTone=filter;
    const engine=ctx.createOscillator();
    const engineHarmonic=ctx.createBiquadFilter();
    engineHarmonic.type='lowpass';engineHarmonic.frequency.value=244;engineHarmonic.Q.value=.58;
    engine.type='sawtooth';engine.frequency.value=103;
    const pulse=ctx.createOscillator(), tremolo=ctx.createGain(), amount=ctx.createGain();
    pulse.frequency.value=28.4;amount.gain.value=.31;tremolo.gain.value=.6;
    pulse.connect(amount).connect(tremolo.gain);
    const hiss=ctx.createBiquadFilter();hiss.type='bandpass';hiss.frequency.value=487;hiss.Q.value=2.3;
    const hissGain=ctx.createGain();hissGain.gain.value=.34;
    wind.connect(hiss).connect(hissGain).connect(tremolo);
    engine.connect(engineHarmonic).connect(tremolo);
    rotorPan=ctx.createStereoPanner();rotorGain=ctx.createGain();rotorGain.gain.value=0;
    tremolo.connect(rotorPan).connect(rotorGain).connect(fx);
    rotorTone=engine;rotorPulse=pulse;engine.start();pulse.start();
  }
  function init(){
    prepare();
    if(ctx?.state==='suspended')void ctx.resume();
  }
  function route(gain,pan,send,destination=fx){
    const p=ctx.createStereoPanner();p.pan.value=pan;
    gain.connect(p).connect(destination);
    if(send==='out')p.connect(outdoor);
    if(send==='in')p.connect(indoor);
  }
  function tone(wave,start,end,dur,amp,opts={}){
    const time=ctx.currentTime+(opts.delay||0);
    const osc=ctx.createOscillator(),g=ctx.createGain();
    osc.type=wave;osc.frequency.setValueAtTime(start,time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1,end),time+dur*.84);
    g.gain.setValueAtTime(.0001,time);
    g.gain.exponentialRampToValueAtTime(Math.max(.0002,amp),time+(opts.attack||.007));
    g.gain.exponentialRampToValueAtTime(.00015,time+dur);
    osc.connect(g);route(g,opts.pan||0,opts.send,opts.music?music:fx);
    osc.start(time);osc.stop(time+dur+.013);
  }
  function noise(dur,amp,type,freq,q=.7,opts={}){
    const time=ctx.currentTime+(opts.delay||0);
    const source=ctx.createBufferSource(), filter=ctx.createBiquadFilter(),g=ctx.createGain();
    source.buffer=noiseBuffer;source.playbackRate.value=opts.rate||1;
    filter.type=type;filter.frequency.setValueAtTime(freq,time);filter.Q.value=q;
    if(opts.end)filter.frequency.exponentialRampToValueAtTime(opts.end,time+dur*.82);
    g.gain.setValueAtTime(.0001,time);
    g.gain.exponentialRampToValueAtTime(Math.max(.0002,amp),time+(opts.attack||.005));
    g.gain.exponentialRampToValueAtTime(.00015,time+dur);
    source.connect(filter).connect(g);route(g,opts.pan||0,opts.send);
    source.start(time,Math.random()*2.3,dur*source.playbackRate.value+.03);
  }
  function footstep(surface,pan,gain,send){
    const buffer=samples[surface];
    if(!buffer)return false;
    const takeCount=Math.floor(buffer.duration*2);
    const pick=lastSample[surface]<0?Math.floor(Math.random()*takeCount):
      (lastSample[surface]+1+Math.floor(Math.random()*(takeCount-1)))%takeCount;
    lastSample[surface]=pick;
    const player=ctx.createBufferSource();
    const strength=ctx.createGain();
    player.buffer=buffer;
    player.playbackRate.value=.93+Math.random()*.17;
    strength.gain.value=gain*(surface==='metal'?.75:surface==='solid'?.84:.93);
    player.connect(strength);
    route(strength,pan,send);
    player.start(ctx.currentTime,pick*.5,.49);
    playedFootsteps[surface]++;
    return true;
  }
  function play(kind,opts={}){
    if(!ctx||ctx.state!=='running')return;
    const pan=clamp(opts.pan||0,-.9,.9), attenuation=clamp(opts.gain??1,.03,1), send=opts.inside?'in':'out';
    const n=(d,a,type,f,q,o={})=>noise(d,a*attenuation,type,f,q,{pan,send,...o});
    const t=(wave,a,b,d,amp,o={})=>tone(wave,a,b,d,amp*attenuation,{pan,send,...o});
    if(kind==='shot'){
      const heat=opts.heat??0;
      n(.082,.77,'lowpass',2980+heat*450,.83,{attack:.0018,end:640});
      n(.026,.55,'bandpass',3520+heat*490,1.08,{attack:.001,end:1620});
      t('sine',178-heat*31,39,.177,.43,{attack:.0024});
      t('triangle',523+heat*103,180,.055,.103,{attack:.003});
      n(.046,.18+heat*.16,'bandpass',4480,.85,{delay:.029,end:1635});
      t('triangle',654,343,.042,.079,{delay:.043});
      n(.22,.133,'bandpass',235,.69,{delay:.091,end:105});
    }else if(kind==='empty'){
      n(.074,.21,'bandpass',2110,1.98);t('triangle',258,101,.055,.07);
    }else if(kind==='release'){
      n(.144,.31,'bandpass',890,1.2);n(.078,.24,'highpass',1900,.75,{delay:.078});t('triangle',193,92,.095,.15);
    }else if(kind==='insert'){
      n(.132,.37,'bandpass',1300,1.06);t('sine',139,65,.123,.24);n(.06,.28,'highpass',1820,.67,{delay:.077});
    }else if(kind==='rack'){
      n(.148,.27,'bandpass',2250,.88,{end:610});t('triangle',220,122,.09,.10,{delay:.045});
    }else if(kind==='step'){
      const metal=opts.surface==='metal';
      if(footstep(opts.surface,pan,attenuation,send)){
        t('sine',metal?119:68,37,.087,metal?.065:.050);
        n(.086,.048,'lowpass',1020,.71,{delay:.018});
      }else if(metal){
        n(.115,.115,'lowpass',1800,.7,{rate:.8+Math.random()*.42});
        t('triangle',180+Math.random()*27,78,.088,.070);n(.08,.068,'bandpass',2250,1.4,{delay:.01});
      }else{
        n(.25,.22,'bandpass',448+Math.random()*370,.86,{end:225,rate:.8+Math.random()*.44});
        n(.11,.11,'highpass',950,.7,{delay:.034});t('sine',61,37,.051,.06);
      }
    }else if(kind==='land'){
      n(.29,.31,'lowpass',1070,.65,{end:420});t('sine',100,38,.13,.24);
    }else if(kind==='ricochet'){
      n(.12,.16,'bandpass',2180,1.5);t('triangle',731+Math.random()*800,280,.23,.103);
    }else if(kind==='stone-hit'){
      n(.23,.40,'bandpass',1280,.81,{end:525});n(.084,.26,'highpass',2320,.71);
      t('sine',114,43,.144,.15);
    }else if(kind==='armor'){
      n(.13,.26,'bandpass',3060,1.2,{end:1290});t('triangle',570,160,.17,.13);
    }else if(kind==='frost'){
      n(.18,.15,'bandpass',830,.75,{end:490});
    }else if(kind==='hit'){
      t('triangle',579,362,.11,.093);n(.071,.128,'bandpass',1820,1.26);
    }else if(kind==='destroy'){
      n(.50,.42,'lowpass',3300,.85,{end:389});t('sine',110,33,.45,.30);
      n(.22,.24,'bandpass',2500,.8,{delay:.10,end:690});t('triangle',711,105,.30,.10);
    }else if(kind==='crash'){
      n(.37,.34,'lowpass',1450,.81,{end:290});
      t('sine',108,38,.186,.319);
      n(.22,.20,'bandpass',1900,1.64,{delay:.03,end:510});
      t('triangle',386,121,.135,.072,{delay:.078});
    }else if(kind==='servo'){
      n(.16,.162,'bandpass',675,.98,{end:213});t('triangle',203,116,.16,.09);
      t('sine',82,54,.12,.11,{delay:.032});
    }else if(kind==='windup'){
      t('sine',240,552,.52,.13,{attack:.17});t('triangle',118,296,.39,.069,{attack:.19});
    }else if(kind==='bolt'){
      t('triangle',491,113,.31,.23);n(.29,.36,'bandpass',978,.87,{end:255});t('sine',92,35,.22,.23);
    }else if(kind==='hurt'){
      t('sine',85,40,.32,.45);n(.19,.37,'lowpass',740,.75);t('triangle',253,74,.18,.11);
    }else if(kind==='radio'){
      n(.17,.13,'bandpass',1800,.9,{attack:.012});t('sine',432,427,.085,.084);t('sine',611,597,.111,.068,{delay:.10});
    }else if(kind==='record'){
      n(.25,.075,'bandpass',1390,.7);for(const [i,p] of [298,447,668,598].entries())t('sine',p,p*.985,.36,.105,{delay:.10+i*.12,attack:.034});
    }else if(kind==='switch'){
      n(.060,.28,'bandpass',1720,1.22,{end:582});
      t('triangle',184,115,.074,.20);
      n(.061,.116,'highpass',2160,1.18,{delay:.079});
    }else if(kind==='power'){
      t('triangle',62,115,1.23,.20,{attack:.23});n(1.27,.28,'lowpass',350,.71,{attack:.18,end:125});
      t('sine',330,330,.53,.141,{delay:.20});t('sine',495,495,.63,.102,{delay:.41});
    }else if(kind==='supply'){
      t('sine',525,525,.17,.11);t('triangle',700,696,.28,.09,{delay:.068});
    }else if(kind==='wave'){
      t('triangle',105,77,.70,.179,{attack:.07});t('triangle',153,121,.89,.15,{delay:.24,attack:.09});
    }else if(kind==='depart'){
      n(3.25,.29,'bandpass',344,.9,{attack:.60,end:108});t('sine',77,40,4.8,.20,{attack:.87});
      n(2.20,.135,'highpass',780,.78,{attack:.24,end:500});
    }else if(kind==='complete'){
      for(const [i,hz] of [146.83,220,293.66,369.99,587.33].entries()){
        t('sine',hz,hz,4.15,.135,{delay:i*.34,attack:.3,music:true});
        t('triangle',hz*2,hz*1.998,2.25,.041,{delay:i*.34+.13,attack:.28,music:true});
      }
    }
  }
  const motif=[146.83,220,174.61,261.63,130.81,196,164.81,220];
  function update(time,mode,{inside=false,combat=false,pace=0,wind=0}={}){
    if(!ctx||ctx.state!=='running')return;
    if(mode!==state){state=mode;lastNote=time-.3;}
    const paused=mode==='pause',c=ctx.currentTime;
    windTone.frequency.setTargetAtTime(inside?195:370+wind*210+Math.sin(time*.84)*122+Math.sin(time*.31)*63,c,.31);
    atmosphere.gain.setTargetAtTime(paused?.045:inside?.049:.14+wind*.14+pace*.055,c,.22);
    music.gain.setTargetAtTime(paused?.35:.8,c,.25);
    if(mode!=='play')rotorGain.gain.setTargetAtTime(0,c,.18);
    const interval=combat?1.05:mode==='title'?3.6:4.2;
    if(time<previousT)lastNote=time;
    previousT=time;
    if(time-lastNote<interval||paused||mode==='cinema'||mode==='won'||mode==='dead')return;
    lastNote=time;
    const f=motif[phrase++%motif.length], hz=combat?f*.5:f;
    tone('sine',hz,hz*.996,combat?1.58:4.3,combat?.068:.056,{attack:.30,pan:phrase%2?.24:-.24,music:true});
    tone('triangle',hz*2,hz*1.997,combat?1.28:3.9,combat?.029:.022,{attack:combat?.085:.48,pan:phrase%2?-.24:.24,music:true,delay:.14});
    if(!combat&&phrase%3===0)tone('sine',hz*2.997,hz*3,4.9,.028,{attack:.45,music:true});
  }
  function rotor(gain,pan,throttle){
    if(!ctx||ctx.state!=='running')return;
    const time=ctx.currentTime;
    rotorGain.gain.setTargetAtTime(gain*.155,time,.145);
    rotorPan.pan.setTargetAtTime(clamp(pan,-.92,.92),time,.10);
    rotorTone.frequency.setTargetAtTime(95+throttle*48,time,.19);
    rotorPulse.frequency.setTargetAtTime(24+throttle*20,time,.21);
  }
  return { footstepCount:()=>({...playedFootsteps}),prepare,init,play,update,rotor,volume(value){
    volume=clamp(+value,0,1);
    if(ctx)master.gain.setTargetAtTime(volume,ctx.currentTime,.07);
  },level(){
    if(!analyser)return 0;
    analyser.getFloatTimeDomainData(levelSamples);
    let sq=0;for(const v of levelSamples)sq+=v*v;
    return Math.sqrt(sq/levelSamples.length);
  }};
}


