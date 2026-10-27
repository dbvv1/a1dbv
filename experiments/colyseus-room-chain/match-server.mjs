import {Server,matchMaker} from '@colyseus/core';
import {WebSocketTransport} from '@colyseus/ws-transport';
import {matchRoom} from './match-room.mjs';
let server,closing=false;
const stats={created:0,disposed:0,jobsStarted:0,jobsFinished:0,deliveries:0,activeWork:0,rooms:new Map(),finished:[]};
async function close(){if(closing)return;closing=true;await server?.gracefullyShutdown(false);process.disconnect?.();}
process.on('message',async message=>{
  try{
    let value;
    if(message.op==='init'&&!server){
      const transport=new WebSocketTransport({pingInterval:500,pingMaxRetries:2,maxPayload:12288});
      server=new Server({transport,greet:false,gracefullyShutdown:false});
      server.define('bot_job',matchRoom(message.config,stats));
      await server.listen(0,'127.0.0.1');
      value={endpoint:`http://127.0.0.1:${transport.server.address().port}`,pid:process.pid};
    }else if(message.op==='stats'){
      value={...stats,rooms:[...stats.rooms].map(([roomId,room])=>({roomId,...room.state.toJSON()})),listed:(await matchMaker.query({})).length};
    }else if(message.op==='shutdown'){
      process.send?.({id:message.id,value:true});await close();return;
    }else throw Error('unknown server operation');
    process.send?.({id:message.id,value});
  }catch(error){process.send?.({id:message.id,error:error.message});}
});
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>void close());
process.once('disconnect',()=>void close());
