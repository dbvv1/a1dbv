import readline from 'node:readline';
const mode=process.argv[2] ?? 'failure';
if (!['failure','empty','healthy'].includes(mode)) {
 console.error('Expected mode: failure, empty, healthy');
 process.exit(2);
}
for await (const line of readline.createInterface({input:process.stdin})) {
 let request;try {request=JSON.parse(line)}catch {continue}
 if(request.id===undefined)continue;
 const response={jsonrpc:'2.0',id:request.id};
 if(request.method==='initialize')response.result={protocolVersion:'2025-06-18',capabilities:{tools:{}},serverInfo:{name:'diagnostic-fixture',version:'1'}};
 else if(request.method==='ping')response.result={};
 else if(request.method==='tools/list') {
  if(mode==='failure')response.error={code:-32603,message:'DIAGNOSTIC_FIXTURE: tool catalog unavailable'};
  else response.result={tools:mode==='empty'?[]:[{name:'healthy_tool',description:'safe fixture',inputSchema:{type:'object',properties:{}}}]};
 } else response.error={code:-32601,message:'Method not found'};
 process.stdout.write(JSON.stringify(response)+'\n');
}
