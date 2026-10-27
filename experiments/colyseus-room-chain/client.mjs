import { Client } from '@colyseus/sdk';
import { SessionOwner } from './session-owner.mjs';
const sdk = new Client(process.argv[2]);
const owner = new SessionOwner();
async function connect(join) {
  return owner.connect(async () => {
    const room = await join();
    room.reconnection.minUptime = 0;
    room.reconnection.minDelay = 100;
    room.reconnection.delay = 100;
    room.reconnection.maxDelay = 200;
    return room;
  });
}
process.on('message', async message => {
  const {id,op} = message;
  try {
    let value;
    if (op === 'create') value = await connect(() => sdk.create(message.type ?? 'duo', {name:message.name,protocol:message.protocol ?? 1}));
    else if (op === 'join') value = await connect(() => sdk.joinById(message.roomId, {name:message.name,protocol:message.protocol ?? 1}));
    else if (op === 'match') value = await connect(() => sdk.joinOrCreate(message.type ?? 'duo', {name:message.name,protocol:1}));
    else if (op === 'reconnect') value = await connect(() => sdk.reconnect(message.token));
    else if (op === 'ready') owner.ready(message.ready ?? true);
    else if (op === 'activate') owner.activate(message);
    else if (op === 'drop') {
      const room = owner.requireRoom().room;
      // Only the local harness varies retry timing; gameplay does not tune it per request.
      if (message.retryDelay !== undefined) {
        if (![500,2500].includes(message.retryDelay)) throw new Error('unsupported test retry delay');
        room.reconnection.minDelay = room.reconnection.maxDelay = message.retryDelay;
      }
      room.connection.close(4010, 'controlled loopback interruption');
    }
    else if (op === 'token') value = owner.token(); // IPC only; never print or persist session capabilities.
    else if (op === 'leave') await owner.leave();
    else if (op === 'inspect') value = {pid:process.pid,...owner.inspect()};
    else if (op === 'shutdown') { await owner.leave(); process.send?.({id,value:true}); process.disconnect(); return; }
    else throw new Error('unknown operation');
    process.send?.({id,value});
  } catch (error) { process.send?.({id,error:error.message}); }
});
process.once('disconnect', () => { owner.current?.room.connection.close(); process.exit(0); });
