import json,pathlib,re,hashlib,sys
R=pathlib.Path(sys.argv[1]).resolve()
out=[]
for scenario,tid,value,variant in [('normal','1'*32,0,'off'),('injected','2'*32,1,'100%')]:
 d=R/scenario;text=(d/'payment.log').read_text();lines=text.splitlines()
 flags=[json.loads(l[9:]) for l in lines if l.startswith('P49_FLAG ')]
 logs=[json.loads(l) for l in lines if l.startswith('{"level"')]
 blocks=re.findall(r'^\{\n.*?^\}$',text,re.M|re.S)
 def span(name):
  hits=[b for b in blocks if f"\n  name: '{name}'," in b];assert len(hits)==1;return hits[0]
 rpc=span('grpc.oteldemo.PaymentService/Charge');charge=span('charge')
 rpcid=re.search(r"^  id: '([^']+)'",rpc,re.M)[1]
 chargeid=re.search(r"^  id: '([^']+)'",charge,re.M)[1]
 assert f"traceId: '{tid}'" in rpc and f"traceId: '{tid}'" in charge
 assert f"spanId: '{rpcid}'" in charge
 assert len(flags)==2
 bykey={f['flagKey']:f for f in flags}
 assert bykey['paymentFailure']['value']==value and bykey['paymentFailure']['variant']==variant
 assert bykey['emitRawPii']['value'] is False
 assert all(f['traceId']==tid and f['spanId']==rpcid and f['reason']=='STATIC' and 'errorCode' not in f for f in flags)
 assert "'user_agent.synthetic.type': 'test'" in charge
 assert 'demo.payment.card_number' not in text and 'demo.payment.card_cvv' not in text
 flagspans=[]
 for l in (d/'flagd.log').read_text().splitlines():
  try:j=json.loads(l)
  except json.JSONDecodeError:continue
  if j.get('Name')=='resolveFloat' and j.get('Attributes'):
   attrs={a['Key']:a['Value']['Value'] for a in j['Attributes']}
   if attrs.get('feature_flag.key')=='paymentFailure':
    assert j['SpanContext']['TraceID']==tid and attrs['feature_flag.result.variant']==variant
    resource={a['Key']:a['Value']['Value'] for a in j['Resource']}
    assert resource['service.name']=='flagd'
    flagspans.append({'trace_id':j['SpanContext']['TraceID'],'span_id':j['SpanContext']['SpanID'],'flag':attrs['feature_flag.key'],'variant':attrs['feature_flag.result.variant']})
 assert len(flagspans)==1
 client=json.loads((d/'client.stdout').read_text())
 same=[l for l in logs if l.get('trace_id')==tid]
 assert all(l['span_id']==rpcid for l in same)
 if scenario=='normal':
  assert client['error'] is None and client['response']['transactionId']
  assert "'demo.payment.charged': false" in charge and "'rpc.grpc.status_code': 0" in rpc
  assert any(l.get('msg')=='Transaction complete.' for l in same)
 else:
  assert client['error']['code']==2 and client['response'] is None
  assert "'rpc.grpc.status_code'" not in rpc and "'exception.type': 'Error'" in charge
  assert "status: {\n    code: 2," in rpc
  assert 'charge.js:48:15' in charge and 'index.js:22:22' in charge
  assert any(l.get('level')=='warn' and l.get('err',{}).get('message')==client['error']['details'] for l in same)
  assert not any(l.get('msg')=='Transaction complete.' for l in same)
 cleanup=json.loads((d/'cleanup.json').read_text());assert all(x['group_gone'] for x in cleanup)
 out.append({'scenario':scenario,'trace_id':tid,'rpc_span_id':rpcid,'charge_span_id':chargeid,'actual_flags':flags,'flagd_span':flagspans[0],'rpc_code':0 if scenario=='normal' else client['error']['code'],'source_exception':None if scenario=='normal' else {'type':'Error','message':client['error']['details'],'location':'src/payment/charge.js:48:15'},'synthetic_span':True,'transaction_returned':client['response'] is not None,'cleanup':{'payment_sigkill_after_8s':cleanup[0]['forced'],'owned_groups_gone':True}})
(R/'verified-sanitized.json').write_text(json.dumps(out,indent=2))
print(json.dumps(out,indent=2))
