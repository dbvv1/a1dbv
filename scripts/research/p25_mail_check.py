import os,sys
from pathlib import Path
from email import policy
from email.parser import BytesParser
from email.utils import getaddresses
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json,re,hashlib,copy
ROLES=['SIGNER','ASSISTANT','APPROVER','SIGNER','APPROVER','APPROVER','SIGNER']
TYPES={'SIGNER':('sign','SIGNING_REQUEST'),'ASSISTANT':('assist','ASSISTING_REQUEST'),'APPROVER':('approve','APPROVE_REQUEST')}
BASE='http://127.0.0.1:3250'
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.active=None
 def handle_starttag(self,tag,attrs):
  if tag=='a':self.active=[dict(attrs).get('href',''),'']
 def handle_data(self,data):
  if self.active is not None:self.active[1]+=data
 def handle_endtag(self,tag):
  if tag=='a' and self.active is not None:self.links.append(self.active);self.active=None

def bound(url,token):
 try:
  u=urlsplit(url);b=urlsplit(BASE)
  return (u.scheme,u.netloc,u.path,u.query,u.fragment)==(b.scheme,b.netloc,'/sign/'+token,'','') and not u.username and not u.password
 except ValueError:return False

def validate(recipients,messages,audits,expected):
 errors=[];checks=[]
 if len(expected)!=7 or len(set(expected.values()))!=7:return {'passed':False,'errors':['invalid reference identity set'],'checks':[]}
 if len(recipients)!=7 or {r['id'] for r in recipients}!=set(expected.values()):errors.append('recipient identity set')
 for i,role in enumerate(ROLES):
  label=101+i;email=f'p25-r{label}@example.com';rr=[r for r in recipients if r['id']==expected[label]]
  if len(rr)!=1:errors.append(f'{label}: missing or duplicate identity');continue
  r=rr[0];action,typ=TYPES[role];recipient_ok=r['role']==role and r['email']==email
  # Recognize all invitation-like subjects, even incorrect verbs; mismatch is not silently dropped.
  received=[m for m in messages if email in m['to']]
  invites=[m for m in received if 'invited you to' in m['subject'].lower() or re.search(r'View\s+Document\s+to\b',m['plain']+' '+m['html'],re.I)]
  aa=[a for a in audits if a['data'].get('recipientId')==r['id'] and a['data'].get('emailType')!='DOCUMENT_COMPLETED']
  audit_ok=len(aa)==1 and aa[0]['data'].get('emailType')==typ and aa[0]['data'].get('recipientRole')==role and aa[0]['data'].get('recipientEmail')==email
  item={'recipientLabel':label,'role':role,'expectedEmailType':typ,'identityRoleMatch':recipient_ok,'invitationCount':len(invites),'auditMatch':audit_ok,'links':[]}
  for m in invites:
   plain=m['plain'];html=m['html'];parser=Links();parser.feed(html)
   hl=[(u,t) for u,t in parser.links if re.search(r'View\s+Document\s+to\b',t,re.I)]
   pl=re.findall(r'View\s+Document\s+to\s+(\w+)\s+(?:\[)?(https?://[^\s<>\]]+)',plain,re.I)
   subject_ok=bool(re.search(r'invited you to '+action+r' a document$',m['subject']))
   html_ok=len(hl)==1 and ' '.join(hl[0][1].split()).lower()==f'view document to {action}' and bound(hl[0][0],r['token'])
   plain_ok=len(pl)==1 and pl[0][0].lower()==action and bound(pl[0][1],r['token'])
   item['links'].append({'captureFile':m.get('file','synthetic'),'rawSha256':m.get('sha256','synthetic'),'subjectActionMatch':subject_ok,'htmlActionHrefExact':html_ok,'plainActionURLExact':plain_ok,'nonemptyParts':bool(plain.strip() and html.strip())})
  item['passed']=recipient_ok and audit_ok and len(invites)==1 and all(all(v for k,v in x.items() if k not in ['captureFile','rawSha256']) for x in item['links'])
  if not item['passed']:errors.append(f'{label}: invitation validation')
  checks.append(item)
 return {'passed':not errors and len(checks)==7,'errors':errors,'checks':checks}

def synthetic():
 rs=[];ms=[];aa=[];expected={}
 for i,role in enumerate(ROLES):
  n=101+i;token=f'synthetic-only-{n}';email=f'p25-r{n}@example.com';action,typ=TYPES[role];expected[n]=n
  rs.append({'id':n,'email':email,'role':role,'token':token});ms.append({'to':[email],'subject':f'Test invited you to {action} a document','plain':f'View Document to {action} {BASE}/sign/{token}','html':f'<a href="{BASE}/sign/{token}">View Document to {action}</a>'});aa.append({'data':{'recipientId':n,'recipientEmail':email,'recipientRole':role,'emailType':typ}})
 return rs,ms,aa,expected

def regressions():
 cases={}
 def run(name,mutate,should_pass=False):
  args=copy.deepcopy(synthetic());mutate(*args);actual=validate(*args)['passed'];cases[name]={'expectedPass':should_pass,'actualPass':actual};assert actual==should_pass,name
 run('positive',lambda *a:None,True)
 run('empty_recipients',lambda r,m,a,e:r.clear())
 run('missing_recipient',lambda r,m,a,e:r.pop())
 run('duplicate_recipient',lambda r,m,a,e:r.__setitem__(6,copy.deepcopy(r[0])))
 run('extra_recipient',lambda r,m,a,e:r.append(copy.deepcopy(r[0])))
 run('wrong_role',lambda r,m,a,e:r[0].update(role='APPROVER'))
 run('wrong_email_type',lambda r,m,a,e:a[0]['data'].update(emailType='APPROVE_REQUEST'))
 run('empty_plain',lambda r,m,a,e:m[0].update(plain=''))
 run('empty_html',lambda r,m,a,e:m[0].update(html=''))
 for part in ['plain','html']:
  for key,old,new in [('report_path','/sign/','/report/'),('wrong_token','synthetic-only-101','wrong-token'),('untrusted_origin',BASE,'http://untrusted.invalid'),('token_suffix','synthetic-only-101','synthetic-only-101-extra'),('wrong_action','to sign','to approve')]:
   run(part+'_'+key,lambda r,m,a,e,part=part,old=old,new=new:m[0].update({part:m[0][part].replace(old,new)}))
 run('token_only_in_body',lambda r,m,a,e:m[0].update(html='<p>synthetic-only-101</p><a href="http://untrusted.invalid">View Document to sign</a>'))
 run('missing_invitation',lambda r,m,a,e:m.pop())
 run('duplicate_invitation',lambda r,m,a,e:m.append(copy.deepcopy(m[0])))
 run('wrong_subject_role',lambda r,m,a,e:m[0].update(subject='Test invited you to approve a document'))
 run('extra_unrecognized_invitation',lambda r,m,a,e:m.append({**copy.deepcopy(m[0]),'subject':'Unrecognized'}))
 run('unrecognized_subject',lambda r,m,a,e:m[0].update(subject='Unrecognized'))
 return cases
if __name__=='__main__':
 if '--synthetic-only' in sys.argv:
  print(json.dumps(regressions(),indent=2));sys.exit(0)
 root=Path(os.environ.get('P25_ARTIFACT_DIR', Path(__file__).resolve().parent))
 s=json.loads((root/'stateverify-S1.private.json').read_text(encoding='utf-8'));old=json.loads((root/'S1.json').read_text(encoding='utf-8'));expected={101+i:r['id'] for i,r in enumerate(old['recipients'])}
 audits=json.loads((root/'stateverify-original-mail-audit.private.json').read_text(encoding='utf-8'));messages=[]
 for p in sorted((root/'mail-capture').glob('*.eml')):
  raw=p.read_bytes();m=BytesParser(policy=policy.default).parsebytes(raw)
  parts={typ:'\n'.join(str(x.get_content()) for x in m.walk() if x.get_content_type()==typ) for typ in ['text/plain','text/html']}
  messages.append({'to':[a for _,a in getaddresses(m.get_all('to',[]))],'subject':str(m['Subject']),'plain':parts['text/plain'],'html':parts['text/html'],'file':p.name,'sha256':hashlib.sha256(raw).hexdigest()})
 result=validate(s['Recipient'],messages,audits,expected);result['syntheticRegressions']=regressions();result['totalCaptured']=len(messages);result['method']='Exact trusted-origin /sign/<original-token> binding on role-specific action CTA in decoded plain text and HTML href; original S1 identity reference; seven fixed roles.'
 (root/'stateverify-mail-comparison-v3.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print({'passed':result['passed'],'regressions':len(result['syntheticRegressions']),'errors':result['errors']});assert result['passed']
