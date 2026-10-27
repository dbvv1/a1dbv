// A local synthetic-seat job bridge, not a multiplayer gameplay implementation.
import {Room} from '@colyseus/core';
import {schema,t} from '@colyseus/schema';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {rm} from 'node:fs/promises';
import {produce,deliver} from '../nakama-player-progress/match-process.mjs';
import {readResult} from '../nakama-player-progress/match-result.mjs';

const Seat=schema({team:t.number(),userId:t.string(),ready:t.boolean(),connected:t.boolean()},'MatchJobSeat');
const State=schema({phase:t.string(),reason:t.string(),matchId:t.string(),winner:t.number(),tick:t.number(),hash:t.string(),
  confirmed:t.number(),duplicates:t.number(),players:t.map(Seat)},'MatchJobState');
const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&
  Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
const uuid=value=>typeof value==='string'&&/^[a-f0-9-]{36}$/.test(value);

export function matchRoom(config,stats){
  if(new URL(config.service.endpoint).hostname!=='127.0.0.1'||!Array.isArray(config.demoSeats)||
    config.demoSeats.length!==2||config.demoSeats.some((seat,i)=>seat.team!==i||!uuid(seat.userId))||
    config.demoSeats[0].userId===config.demoSeats[1].userId) throw Error('two trusted synthetic seats and loopback service required');
  return class MatchJobRoom extends Room {
    onCreate(){
      this.maxClients=2;this.patchRate=20;
      this.state=new State({phase:'lobby',reason:'',matchId:randomUUID(),winner:-1,tick:0,hash:'',confirmed:0,duplicates:0});
      this.resultPath=join(config.resultDir,this.state.matchId+'.json');
      this.work=Promise.resolve();this.attempts=0;
      stats.created++;stats.rooms.set(this.roomId,this);
      this.onMessage('ready',(client,data)=>{
        if(!exact(data,['ready'])||typeof data.ready!=='boolean'||this.state.phase!=='lobby')return this.reject(client,'not-ready-phase');
        this.state.players.get(client.sessionId).ready=data.ready;
        if(this.state.players.size===2&&[...this.state.players.values()].every(p=>p.ready&&p.connected)){
          this.lock();this.state.phase='running';
          this.startWork(()=>this.runJob());
        }
      });
      this.onMessage('retry-settlement',(client,data)=>{
        if(!exact(data,[])||this.state.phase!=='settlement-pending')return this.reject(client,'no-pending-result');
        // State changes synchronously before the await, so two requests cannot start two senders.
        this.state.phase='settling';this.startWork(()=>this.settleExisting());
      });
    }
    static async onAuth(token,options){
      if(!exact(options,['protocol'])||options.protocol!==1||typeof token!=='string'||!token||token.length>8192)
        throw Error('synthetic session required');
      const response=await fetch(config.service.endpoint+'/v2/account',{
        method:'GET',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},signal:AbortSignal.timeout(3000)});
      if(!response.ok)throw Error('session authentication failed');
      const account=await response.json();
      const seat=config.demoSeats.find(p=>p.userId===account.user?.id);
      if(!seat)throw Error('account is not a configured synthetic seat');
      return seat; // Client-provided user IDs, teams, scores and result paths are never consumed.
    }
    onJoin(client,_options,seat){
      if(this.state.phase!=='lobby'||[...this.state.players.values()].some(p=>p.userId===seat.userId))
        throw Error('seat already joined or job started');
      this.state.players.set(client.sessionId,new Seat({...seat,ready:false,connected:true}));
    }
    reject(client,reason){client.send('rejected',{reason});}
    startWork(action){
      stats.activeWork++;
      this.work=action().finally(()=>{stats.activeWork--;});
    }
    async runJob(){
      stats.jobsStarted++;
      try{
        try{
          await produce({source:config.source,path:this.resultPath,matchId:this.state.matchId,
            players:config.demoSeats,...(config.maxMatchSeconds===undefined?{}:{maxMatchSeconds:config.maxMatchSeconds})});
        }finally{stats.jobsFinished++;}
        const {record}=await readResult(this.resultPath);
        if(this.state.phase==='aborted')return; // Check after the last asynchronous read, before adoption.
        this.state.winner=record.result.winner;this.state.tick=record.result.tick;this.state.hash=record.result.hash;
        await this.settleExisting();
      }catch{
        if(this.state.phase!=='aborted'){this.state.phase='failed';this.state.reason='simulation-failed';}
      }finally{
        // The finite CPU worker is allowed to finish; an unadopted result is not an outbox entry.
        if(this.state.phase==='aborted')await rm(this.resultPath,{force:true});
      }
    }
    async settleExisting(){
      this.state.phase='settling';stats.deliveries++;
      try{
        const sent=await deliver(config.service,this.resultPath,{crashAfterFirst:config.crashAfterFirst&&++this.attempts===1});
        if(sent.code!==0||sent.response?.result?.length!==2)throw Error('delivery not confirmed');
        this.state.confirmed=sent.response.result.length;
        this.state.duplicates=sent.response.result.filter(result=>result.duplicate).length;
        this.state.phase='completed';this.state.reason='';
      }catch{
        this.state.phase='settlement-pending';this.state.reason='awaiting-confirmation';
      }
    }
    depart(client){
      const p=this.state.players.get(client.sessionId);if(!p)return;
      p.connected=false;p.ready=false;
      if(this.state.phase==='lobby'){
        this.state.players.delete(client.sessionId);
        for(const other of this.state.players.values())other.ready=false;
      }else if(this.state.phase==='running'){
        this.state.phase='aborted';this.state.reason='seat-left-before-result';
      }
      // After a terminal result is adopted, leaving does not revoke an already committed receipt.
    }
    onDrop(client){this.depart(client);} // This job-room policy deliberately has no reconnection window.
    onLeave(client){this.depart(client);}
    async onDispose(){
      await this.work; // Drain finite owned work before disposing this room or shutting down its service.
      stats.disposed++;stats.finished.push({roomId:this.roomId,...this.state.toJSON()});stats.rooms.delete(this.roomId);
    }
  };
}
