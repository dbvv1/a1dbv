import { Server, matchMaker } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { DuoRoom, TrioRoom, lifecycle } from './room.mjs';
const transport=new WebSocketTransport({pingInterval:500,pingMaxRetries:2,maxPayload:4096});
const server=new Server({transport,greet:false,gracefullyShutdown:false});
server.define('duo',DuoRoom);
server.define('trio',TrioRoom);
await server.listen(0,'127.0.0.1');
const endpoint=`http://127.0.0.1:${transport.server.address().port}`;
process.send?.({kind:'ready',endpoint,pid:process.pid});
if(!process.send)console.log(`Local Colyseus: ${endpoint}`);
let closing=false;
async function close(){if(closing)return;closing=true;await server.gracefullyShutdown(false);process.disconnect?.();}
process.on('message',async message=>{
  if(message.op==='stats')process.send({id:message.id,value:{...lifecycle,listed:(await matchMaker.query({})).length,pid:process.pid}});
  if(message.op==='shutdown'){process.send?.({id:message.id,value:true});await close();}
});
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>void close());
process.once('disconnect',()=>void close());
