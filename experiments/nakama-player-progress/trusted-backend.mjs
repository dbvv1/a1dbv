// Trusted local test backend only. Never include this module or the runtime HTTP key in a player build.
export async function settle(service,request){
 // Fixed SDK2.8.0 rpcHttpKey uses GET, but this server consumes RPC payload from
 // POST. Use the official HTTP endpoint; no private SDK internals or new server.
 const r=await fetch(service.endpoint+'/v2/rpc/settle_demo_result?http_key='+encodeURIComponent(service.httpKey),{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(JSON.stringify(request))});
 const value=await r.json();if(!r.ok)throw Object.assign(Error(value.message),{code:value.code,status:r.status});
 return JSON.parse(value.payload);
}
