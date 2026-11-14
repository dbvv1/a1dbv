import json
from collections import Counter, defaultdict
from datetime import date
from typing import TypedDict
import attrs
from cattrs.preconf.bson import make_converter
from cattrs.errors import ClassValidationError

@attrs.define
class User:
    name: str
class Event(TypedDict):
    day: date
    count: int
    owner: User

c = make_converter()
results = []
def check(name, fn):
    try:
        fn()
    except Exception as e:
        results.append({'name':name,'passed':False,'error':type(e).__name__})
    else:
        results.append({'name':name,'passed':True})
def eq(a,b):
    assert a == b, (a,b)
def roundtrip():
    doc = {'day':date(2026,11,10),'count':3,'owner':User('ann')}
    got = c.loads(c.dumps(doc, unstructure_as=Event),Event)
    eq(got,doc)
def invalid(data):
    try:
        c.structure(data,Event)
    except ClassValidationError:
        return
    raise AssertionError('invalid input accepted')
def counter():
    got=c.structure({'a':'2'},Counter[str])
    assert isinstance(got,Counter)
    eq(got,Counter({'a':2}))
def default():
    got=c.structure({'a':'2'},defaultdict[str,int])
    assert isinstance(got,defaultdict)
    eq(got['missing'],0)
    eq(got['a'],2)
def byteskey():
    doc={b'hello':2}
    eq(c.loads(c.dumps(doc,unstructure_as=dict[bytes,int]),dict[bytes,int]),doc)
check('typed-dict-roundtrip',roundtrip)
check('missing-required-keys',lambda:invalid({'count':3}))
check('invalid-field-types',lambda:invalid({'day':'x','count':'three','owner':1}))
check('counter-type-and-values',counter)
check('defaultdict-type-and-default',default)
check('existing-bytes-key-roundtrip',byteskey)
print(json.dumps(results,indent=2))
raise SystemExit(0 if all(x['passed'] for x in results) else 1)
