import readline from 'node:readline';
const mode = process.argv[2] ?? 'duplicate';
const tools = mode === 'empty' ? [] : (mode === 'unique' ? ['create', 'inspect'] : ['create', 'create', 'inspect']).map(name => ({ name, description: name, inputSchema: { type: 'object', properties: {} } }));
readline.createInterface({input: process.stdin}).on('line', line => {
  const request = JSON.parse(line);
  if (request.id === undefined) return;
  let result;
  switch (request.method) {
    case 'initialize': result = { protocolVersion: '2024-11-05', capabilities: {tools: {}}, serverInfo: {name: 'duplicate-fixture', version: '1.0.0'} }; break;
    case 'tools/list': result = {tools}; break;
    case 'prompts/list': result = {prompts: []}; break;
    case 'resources/list': result = {resources: []}; break;
    default: process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:request.id,error:{code:-32601,message:'Method not found'}})+'\n'); return;
  }
  process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:request.id,result})+'\n');
});
