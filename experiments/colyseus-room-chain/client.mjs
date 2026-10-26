import { Client } from '@colyseus/sdk';
const sdk=new Client(process.argv[2]);
let room, snapshot=null, initialized=false, acceptedInput=false, issuedEpoch=null, issuedSeq=0;
const trace=[];
function attach(next){
  room=next;initialized=false;acceptedInput=false;issuedEpoch=null;issuedSeq=0;
  room.reconnection.minUptime=0;room.reconnection.minDelay=100;room.reconnection.delay=100;room.reconnection.maxDelay=200;
  room.onStateChange(state=>{
    snapshot=state.toJSON();initialized=true;
    const confirmed=snapshot.players[room.sessionId]?.lastSeq??0;
    if(issuedEpoch!==snapshot.epoch){issuedEpoch=snapshot.epoch;issuedSeq=confirmed;}
    else issuedSeq=Math.max(issuedSeq,confirmed); // A delayed patch must not reuse a locally issued operation number.
    // Full state is received after JOIN/onReconnect; do not resume from a stale snapshot/token.
    acceptedInput=snapshot.phase==='playing' && snapshot.players[room.sessionId]?.connected===true;
    trace.push({kind:'state',phase:snapshot.phase,score:snapshot.score,epoch:snapshot.epoch});
  });
  room.onDrop(()=>{acceptedInput=false;initialized=false;issuedEpoch=null;trace.push({kind:'drop'});});
  room.onReconnect(()=>{acceptedInput=false;initialized=false;issuedEpoch=null;trace.push({kind:'reconnected-before-state'});});
  room.onLeave(code=>{acceptedInput=false;trace.push({kind:'leave',code});});
  room.onError((code,message)=>trace.push({kind:'error',code,message}));
  room.onMessage('rejected',message=>trace.push({kind:'rejected',...message}));
}
process.on('message',async message=>{
  const {id,op}=message;
  try{
    let value;
    if(op==='create')attach(await sdk.create(message.type??'duo',{name:message.name,protocol:message.protocol??1}));
    else if(op==='join')attach(await sdk.joinById(message.roomId,{name:message.name,protocol:message.protocol??1}));
    else if(op==='match')attach(await sdk.joinOrCreate(message.type??'duo',{name:message.name,protocol:1}));
    else if(op==='reconnect')attach(await sdk.reconnect(message.token));
    else if(op==='ready')room.send('ready',{ready:message.ready??true});
    else if(op==='activate'){
      if(!acceptedInput && !message.raw)throw new Error('wait for current playing state before input');
      if(message.data)room.send('activate',message.data); // Deliberately malformed/retried test inputs, not normal UI input.
      else {const seq=issuedSeq+1;room.send('activate',{seq,epoch:snapshot.epoch});issuedSeq=seq;}
    }else if(op==='drop')room.connection.close(4010,'controlled loopback interruption');
    else if(op==='token')value=room.reconnectionToken; // IPC only; never print or persist session capabilities.
    else if(op==='leave')await room.leave();
    else if(op==='inspect')value={pid:process.pid,roomId:room?.roomId,sessionId:room?.sessionId,initialized,acceptedInput,snapshot,trace:[...trace]};
    else if(op==='shutdown'){if(room?.connection?.isOpen)await room.leave();process.send?.({id,value:true});process.disconnect();return;}
    else throw new Error('unknown operation');
    process.send?.({id,value});
  }catch(error){process.send?.({id,error:error.message});}
});
process.once('disconnect',()=>{room?.connection?.close();process.exit(0);});
