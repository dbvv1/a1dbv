import { createServer } from 'node:http';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { extname, resolve, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const project=fileURLToPath(new URL('.',import.meta.url));
const content={
  '.html':'text/html; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.webp':'image/webp',
  '.gltf':'model/gltf+json',
  '.glb':'model/gltf-binary',
  '.hdr':'image/vnd.radiance',
  '.bin':'application/octet-stream'
};

export async function serve(root=project,port=0) {
  const directory=resolve(root);
  const server=createServer(async(request,response)=>{
    try {
      const url=new URL(request.url,'http://localhost');
      const decoded=decodeURIComponent(url.pathname);
      const name=decoded.endsWith('/')?decoded+'index.html':decoded;
      const file=resolve(directory,'.'+name);
      const mime=content[extname(file)];
      if(relative(directory,file).split(sep)[0]==='..'||!mime) {
        response.writeHead(404).end();
        return;
      }
      const bytes=await readFile(file);
      response.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-cache'}).end(bytes);
    } catch {
      response.writeHead(404).end();
    }
  });
  server.listen(port,'127.0.0.1');
  await once(server,'listening');
  return { server, url:'http://127.0.0.1:'+server.address().port+'/' };
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
  const arg=process.argv.indexOf('--port');
  const {url}=await serve(project,arg===-1?0:Number(process.argv[arg+1]));
  console.log('AFTERPRESSURE  '+url);
}

