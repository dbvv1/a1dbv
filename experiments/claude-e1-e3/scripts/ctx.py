import json,subprocess,sys,os,re
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUNC=os.path.join(S,'bin','runc')
conds=[('empty',[] ,'默认'),('empty',['--tools=Read,Edit,Bash'],'3 工具'),('empty',['--tools='],'无工具'),
       ('empty',['--disable-slash-commands'],'禁用斜杠命令'),
       ('md2k',[],'CLAUDE.md 2KB'),('md20k',[],'CLAUDE.md 20KB'),('md72k',[],'CLAUDE.md 72KB')]
out=[]
for d,args,label in conds:
    p=subprocess.run([RUNC,'--model','claude-haiku-5-5',*args,'/context'],cwd=os.path.join(S,'e1',d),stdin=subprocess.DEVNULL,capture_output=True,text=True,timeout=120)
    r=json.loads(p.stdout).get('result','')
    cats={m.group(1).strip():m.group(2) for m in re.finditer(r'^\|\s*([^|]+?)\s*\|\s*([\d.]+k?)\s*\|',r,re.M) if m.group(1).strip() not in ('Category','Skill','Tool','Server','Type')}
    tot=re.search(r'\*\*Tokens:\*\*\s*([\d.]+k?)',r)
    out.append(dict(label=label,args=' '.join(args),dir=d,total=tot.group(1) if tot else None,cats=cats,cost=json.loads(p.stdout).get('total_cost_usd')))
    print(json.dumps(out[-1],ensure_ascii=False))
json.dump(out,open(os.path.join(S,'ctx','context-breakdown.json'),'w'),ensure_ascii=False,indent=1)
