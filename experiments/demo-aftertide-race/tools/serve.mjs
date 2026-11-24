import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, extname } from 'node:path';
import { spawn } from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.hdr':'application/octet-stream','.json':'application/json'};
const server=createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    const child=relative(root,file);
    if(child.startsWith('..')||child.includes(':')||!(await stat(file)).isFile())throw Error('missing');
    res.writeHead(200,{'content-type':types[extname(file)]??'application/octet-stream','cache-control':'no-store'});
    if(req.method==='HEAD')res.end();else createReadStream(file).pipe(res);
  }catch {res.writeHead(404);res.end('Not found');}
});
const args=process.argv.slice(2), opt=args.indexOf('--port'), port=opt<0?4328:Number(args[opt+1]);
server.on('error',e=>{
  if(e.code==='EADDRINUSE'&&opt<0)server.listen(0,'127.0.0.1');
  else {console.error(e.message);process.exitCode=1;}
});
server.listen(port,'127.0.0.1',()=>{
  const url=`http://127.0.0.1:${server.address().port}/`;
  console.log(`Aftertide — ${url} (Ctrl+C to stop)`);
  if(args.includes('--open')) {
    const command=process.platform==='win32'?'rundll32.exe':process.platform==='darwin'?'open':'xdg-open';
    const params=process.platform==='win32'?['url.dll,FileProtocolHandler',url]:[url];
    const child=spawn(command,params,{stdio:'ignore',windowsHide:true});child.on('error',()=>{});
  }
});
