import {Client} from '@colyseus/sdk';
import {SessionOwner} from './session-owner.mjs';
const sdk=new Client(process.argv[2]),owner=new SessionOwner();
async function connect(join){return owner.connect(async()=>{const room=await join();room.reconnection.enabled=false;return room;});}
process.on('message',async message=>{
  try{
    let value;
    const options={protocol:1,...message.extra};
    if(message.op==='create'||message.op==='join')sdk.auth.token=message.token;
    if(message.op==='create')value=await connect(()=>sdk.create('bot_job',options));
    else if(message.op==='join')value=await connect(()=>sdk.joinById(message.roomId,options));
    else if(message.op==='ready')owner.ready(message.ready??true);
    else if(message.op==='retry')owner.requireRoom().room.send('retry-settlement',{});
    else if(message.op==='raw')owner.requireRoom().room.send(message.type,message.data);
    else if(message.op==='leave')await owner.leave();
    else if(message.op==='inspect')value={pid:process.pid,...owner.inspect()};
    else if(message.op==='shutdown'){await owner.leave();process.send?.({id:message.id,value:true});process.disconnect();return;}
    else throw Error('unknown client operation');
    process.send?.({id:message.id,value});
  }catch(error){process.send?.({id:message.id,error:error.message});}
});
process.once('disconnect',()=>{owner.current?.room.connection.close();process.exit(0);});
