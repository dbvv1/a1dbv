// One bounded JSON line per message, reliable ordered loopback TCP. Not a public hosting service.
export const MAX_LINE = 16384;
export function wire(socket, receive, fail) {
  let buffer = '';
  socket.setEncoding('utf8');
  socket.setNoDelay(true);
  socket.on('data', chunk => {
    try {
      buffer += chunk;
      let end;
      while ((end = buffer.indexOf('\n')) >= 0) {
        if (Buffer.byteLength(buffer.slice(0, end)) > MAX_LINE) throw new Error('message too large');
        const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
        receive(JSON.parse(line));
      }
      if (Buffer.byteLength(buffer) > MAX_LINE) throw new Error('message too large');
    } catch (error) { fail(error); }
  });
  socket.on('error', fail);
}
export function send(socket, message) { socket.write(JSON.stringify(message) + '\n'); }
function keys(value, allowed) {
  return value && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).length === allowed.length && allowed.every(key => Object.hasOwn(value, key));
}
export function validateInput(message, heroId) {
  if (!keys(message, ['kind', 'tick', 'commands']) || message.kind !== 'input' ||
      !Number.isSafeInteger(message.tick) || message.tick < 1 || !Array.isArray(message.commands) || message.commands.length > 8)
    throw new Error('invalid input envelope');
  for (const command of message.commands) {
    if (command?.heroId !== heroId) throw new Error('input does not own this hero');
    if (command.type === 'stop' && keys(command, ['type', 'heroId'])) continue;
    if (command.type === 'move' && keys(command, ['type', 'heroId', 'point']) &&
        keys(command.point, ['x', 'z']) && Object.values(command.point).every(n => Number.isFinite(n) && Math.abs(n) <= 200)) continue;
    throw new Error('unsupported or malformed command');
  }
  return message;
}
export function canonicalInput(message) {
  return JSON.stringify({ tick: message.tick, commands: message.commands.map(command => command.type === 'stop'
    ? { type: 'stop', heroId: command.heroId }
    : { type: 'move', heroId: command.heroId, point: { x: command.point.x, z: command.point.z } }) });
}
export function frameCommands(inputs) {
  // Stable player slot, then the player's original command sequence; never packet-arrival order.
  return inputs.flatMap(input => input.commands);
}
export function plannedInput(seat, heroId, tick) {
  const commands = [];
  if (tick === 1) commands.push({ type: 'move', heroId, point: { x: seat ? 12 : -12, z: 0 } });
  if (tick === 90) commands.push({ type: 'stop', heroId });
  if (tick === 120) commands.push({ type: 'move', heroId, point: { x: seat ? -8 : 8, z: seat ? -2 : 2 } });
  if (tick === 210) commands.push({ type: 'move', heroId, point: {x: 0, z: 0} }, { type: 'stop', heroId });
  return { kind: 'input', tick, commands };
}
