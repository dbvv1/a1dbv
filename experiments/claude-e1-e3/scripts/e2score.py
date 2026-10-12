import json,re,os,sys,glob
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
truth={216,227,355,360,391,396,399,411,419,422,439,445,452,454,471,513,539,561,565,567,574,598,611,621,625,684,699,755,776}
for f in sorted(glob.glob(os.path.join(S,'e3','runs','[DS]-*.stream.jsonl'))):
    res=None; usage={}; mu=None; sub_calls=0; sub_ids=set()
    for l in open(f):
        try:e=json.loads(l)
        except: continue
        if e.get('type')=='result': res=e
        if e.get('type')=='assistant':
            if e.get('parent_tool_use_id'): sub_ids.add(e['parent_tool_use_id'])
            for c in e['message'].get('content',[]):
                if c.get('type')=='tool_use' and c['name']=='Agent': sub_calls+=1
    if not res: print(os.path.basename(f),'NO RESULT'); continue
    txt=res.get('result') or ''
    lines=set(int(x) for x in re.findall(r'_parser\.py:(\d+)',txt))
    lines|=set(int(x) for x in re.findall(r"(?:line|L)\s*(\d{2,3})\b",txt)) if not lines else set()
    tp=len(lines&truth); fp=len(lines-truth)
    m=res.get('modelUsage',{})
    print(os.path.basename(f).replace('.stream.jsonl',''),'cost=%.4f'%res['total_cost_usd'],'turns=',res['num_turns'],'secs=%.0f'%(res.get('duration_ms',0)/1000),
          'agent_calls=',sub_calls,'recall=%d/29'%tp,'extra=',sorted(lines-truth),'models=',{k:round(v.get('costUSD',0),4) for k,v in m.items()})
