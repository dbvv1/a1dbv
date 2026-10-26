import { Room } from '@colyseus/core';
import { schema, t } from '@colyseus/schema';

const Player = schema({ name:t.string(), ready:t.boolean(), connected:t.boolean(), lastSeq:t.number() }, 'RoomPlayer');
const State = schema({ phase:t.string(), outcome:t.string(), capacity:t.number(), score:t.number(), target:t.number(), epoch:t.number(), players:t.map(Player) }, 'CoopState');
export const lifecycle = { created:0, disposed:0, drops:0, reconnected:0 };
const exact = (value, names) => value && typeof value==='object' && !Array.isArray(value) && Object.keys(value).length===names.length && names.every(name=>Object.hasOwn(value,name));

// Application policy only. Matching, seats, state patches, sockets and reconnection belong to Colyseus.
export class DuoRoom extends Room {
  partySize = 2;
  onCreate() {
    this.maxClients = this.partySize;
    this.state = new State({phase:'lobby',outcome:'',capacity:this.partySize,score:0,target:3,epoch:0});
    this.patchRate = 20;
    lifecycle.created++;
    this.onMessage('ready', (client, data) => {
      if (!exact(data,['ready']) || typeof data.ready!=='boolean' || this.state.phase!=='lobby') return this.reject(client,'not-ready-phase');
      this.state.players.get(client.sessionId).ready = data.ready;
      if(this.allConnected() && [...this.state.players.values()].every(p=>p.ready)) {
        this.lock(); this.state.phase='playing'; this.state.epoch++;
      }
    });
    this.onMessage('activate', (client,data) => {
      const p=this.state.players.get(client.sessionId);
      if(!exact(data,['seq','epoch']) || !Number.isSafeInteger(data.seq) || data.seq<1 || !Number.isSafeInteger(data.epoch)) return this.reject(client,'invalid-action');
      if(this.state.phase!=='playing' || !p?.connected || data.epoch!==this.state.epoch) return this.reject(client,'not-current-play');
      if(data.seq<=p.lastSeq) return this.reject(client,'already-seen');
      if(data.seq!==p.lastSeq+1) return this.reject(client,'sequence-gap');
      p.lastSeq=data.seq; this.state.score++;
      if(this.state.score===this.state.target) { this.state.phase='ended'; this.state.outcome='completed'; }
    });
  }
  onAuth(_client,options) {
    // Only synthetic guest labels on loopback. This is NOT an authenticated account identity.
    if(options?.protocol!==1 || typeof options.name!=='string' || !/^[A-Za-z][A-Za-z0-9_-]{0,15}$/.test(options.name)) throw new Error('protocol or guest label rejected');
    return {name:options.name};
  }
  onJoin(client,_options,auth) {
    if(this.state.phase!=='lobby') throw new Error('round already started');
    this.state.players.set(client.sessionId,new Player({name:auth.name,ready:false,connected:true,lastSeq:0}));
  }
  allConnected() { return this.state.players.size===this.partySize && [...this.state.players.values()].every(p=>p.connected); }
  reject(client,reason) { client.send('rejected',{reason}); }
  onDrop(client) {
    lifecycle.drops++;
    const p=this.state.players.get(client.sessionId); if(!p)return;
    p.connected=false; p.ready=false;
    if(this.state.phase==='playing') { this.state.phase='paused'; this.state.epoch++; }
    // A short demo window, not a universal production recommendation.
    if(this.state.phase!=='ended') this.allowReconnection(client,2);
  }
  onReconnect(client) {
    lifecycle.reconnected++;
    const p=this.state.players.get(client.sessionId); p.connected=true;
    if(this.state.phase==='paused' && this.allConnected()) this.state.phase='playing';
    // Lobby guests must explicitly ready again; a resumed transport is not game readiness.
  }
  onLeave(client) {
    this.state.players.delete(client.sessionId);
    if(this.state.phase==='playing' || this.state.phase==='paused') {this.state.phase='ended';this.state.outcome='peer-left';}
  }
  onDispose() { lifecycle.disposed++; }
}
// The only second-requirement change is a server-owned capacity; clients cannot override it.
export class TrioRoom extends DuoRoom { partySize=3; }
