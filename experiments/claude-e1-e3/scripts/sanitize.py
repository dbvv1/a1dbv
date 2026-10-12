"""Extract a sanitized, compact transcript from a claude -p stream-json file."""
import json,sys,re,os
SCR='<exp>'
def clean(s):
    if not isinstance(s,str): return s
    s=re.sub(re.escape(SCR)+r'/e3/runs/[A-Z]-[a-z]+-\d+','<repo>',s)
    s=s.replace(SCR,'<exp>')
    s=re.sub(r'<tmp>\s"\'`]*','<tmp>',s)
    s=re.sub(r'<home>\s"\'`]*','<home>',s)
    s=re.sub(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}','<uuid>',s)
    return s
def trunc(s,n=1500):
    s=clean(s); return s if len(s)<=n else s[:n]+f'…[+{len(s)-n} chars]'
def walk(o):
    if isinstance(o,dict): return {k:walk(v) for k,v in o.items()}
    if isinstance(o,list): return [walk(v) for v in o]
    return clean(o)
out=[]
for l in open(sys.argv[1]):
    e=json.loads(l); t=e.get('type')
    if t=='system' and e.get('subtype')=='init':
        out.append({'type':'init','claude_code_version':e.get('claude_code_version'),'model':e.get('model'),'tools':e.get('tools'),'permissionMode':e.get('permissionMode'),'mcp_servers':len(e.get('mcp_servers') or [])})
    elif t in ('assistant','user'):
        blocks=[]
        for c in e['message'].get('content',[]) if isinstance(e['message'].get('content'),list) else [{'type':'text','text':e['message'].get('content')}]:
            ct=c.get('type')
            if ct=='text': blocks.append({'text':trunc(c.get('text',''),4000)})
            elif ct=='tool_use': blocks.append({'tool_use':c['name'],'input':walk({k:(trunc(v,3000) if isinstance(v,str) else v) for k,v in c['input'].items()})})
            elif ct=='tool_result':
                cc=c.get('content'); txt=cc if isinstance(cc,str) else ' '.join(x.get('text','') for x in (cc or []) if isinstance(x,dict))
                blocks.append({'tool_result':trunc(txt),'is_error':c.get('is_error',False)})
        if blocks: out.append({'role':t,'subagent':bool(e.get('parent_tool_use_id')),'content':blocks})
    elif t=='result':
        out.append({'type':'result','is_error':e.get('is_error'),'num_turns':e.get('num_turns'),'duration_ms':e.get('duration_ms'),'total_cost_usd':e.get('total_cost_usd'),'usage':{k:e['usage'].get(k) for k in ('input_tokens','cache_creation_input_tokens','cache_read_input_tokens','output_tokens')},'modelUsage':walk(e.get('modelUsage')),'result':clean(e.get('result'))})
with open(sys.argv[2],'w') as f:
    for o in out: f.write(json.dumps(o,ensure_ascii=False)+'\n')
