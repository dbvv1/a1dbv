import json
import copy
import platform
from importlib.metadata import version
from typing_extensions import TypedDict
from pydantic import ConfigDict, TypeAdapter, ValidationError
import pydantic

class Item(TypedDict):
  name: str
class Permissive(TypedDict):
  __pydantic_config__ = ConfigDict(extra='allow')
  item: Item
class Restrictive(TypedDict):
  __pydantic_config__ = ConfigDict(extra='ignore')
  item: Item
class Strict(TypedDict):
  __pydantic_config__ = ConfigDict(extra='forbid')
  item: Item
class AllowFirst(TypedDict):
  permissive: Permissive
  restrictive: Restrictive
class IgnoreFirst(TypedDict):
  restrictive: Restrictive
  permissive: Permissive
class AllowForbid(TypedDict):
  permissive: Permissive
  strict: Strict
class ForbidAllow(TypedDict):
  strict: Strict
  permissive: Permissive
# Preserve the desired distinction with distinct, explicitly configured child types.
class AllowedItem(TypedDict):
  __pydantic_config__ = ConfigDict(extra='allow')
  name: str
class IgnoredItem(TypedDict):
  __pydantic_config__ = ConfigDict(extra='ignore')
  name: str
class ForbiddenItem(TypedDict):
  __pydantic_config__ = ConfigDict(extra='forbid')
  name: str
class ConfiguredPermissive(TypedDict):
  item: AllowedItem
class ConfiguredRestrictive(TypedDict):
  item: IgnoredItem
class ConfiguredStrict(TypedDict):
  item: ForbiddenItem
class ConfiguredAllowFirst(TypedDict):
  permissive: ConfiguredPermissive
  restrictive: ConfiguredRestrictive
class ConfiguredIgnoreFirst(TypedDict):
  restrictive: ConfiguredRestrictive
  permissive: ConfiguredPermissive
class ConfiguredAllowForbid(TypedDict):
  permissive: ConfiguredPermissive
  strict: ConfiguredStrict
class ConfiguredForbidAllow(TypedDict):
  strict: ConfiguredStrict
  permissive: ConfiguredPermissive

def validate(cls, data, mode):
  adapter=TypeAdapter(cls)
  try:
    output=adapter.validate_python(data) if mode=='python' else adapter.validate_json(json.dumps(data))
    return {'status':'accepted','output':output}
  except ValidationError as exc:
    return {'status':'rejected','errors':[{'type':e['type'],'loc':list(e['loc'])} for e in exc.errors(include_url=False)]}

def main():
  data = {'item': {'name': 'abcd', 'extra': 1}}
  clean = {'item': {'name': 'abcd'}}
  results = []
  # These expectations describe the observed bug, not the desired contract.
  models = [AllowFirst, IgnoreFirst, AllowForbid, ForbidAllow,
            ConfiguredAllowFirst, ConfiguredIgnoreFirst,
            ConfiguredAllowForbid, ConfiguredForbidAllow]
  for cls in models:
    value = {key: copy.deepcopy(data) for key in cls.__annotations__}
    for mode in ['python', 'json']:
      before = copy.deepcopy(value)
      actual = validate(cls, value, mode)
      assert value == before, 'validation mutated the caller input'
      if cls is AllowFirst:
        expected = {'status': 'accepted', 'output': {'permissive': data, 'restrictive': data}}
      elif cls is IgnoreFirst:
        expected = {'status': 'accepted', 'output': {'permissive': clean, 'restrictive': clean}}
      elif cls is AllowForbid:
        expected = {'status': 'accepted', 'output': {'permissive': data, 'strict': data}}
      elif cls is ForbidAllow:
        expected = {'status': 'rejected', 'errors': [
          {'type': 'extra_forbidden', 'loc': [key, 'item', 'extra']}
          for key in ('strict', 'permissive')]}
      elif cls in (ConfiguredAllowFirst, ConfiguredIgnoreFirst):
        expected = {'status': 'accepted', 'output': {'permissive': data, 'restrictive': clean}}
      else:
        expected = {'status': 'rejected', 'errors': [
          {'type': 'extra_forbidden', 'loc': ['strict', 'item', 'extra']}]}
      assert actual == expected, (cls.__name__, mode, actual, expected)
      results.append({'model': cls.__name__, 'mode': mode, **actual})
  for cls in [Permissive, Restrictive, Strict]:
    for mode in ['python', 'json']:
      actual = validate(cls, data, mode)
      if cls is Strict:
        expected = {'status': 'rejected', 'errors': [
          {'type': 'extra_forbidden', 'loc': ['item', 'extra']}]}
      else:
        expected = {'status': 'accepted', 'output': data if cls is Permissive else clean}
      assert actual == expected
      results.append({'model': cls.__name__, 'mode': mode, **actual})
  # The configured consumer must still accept normal data and reject unrelated
  # invalid input. Removing unknown fields is not a substitute for validation.
  for cls in models[4:]:
    for mode in ['python', 'json']:
      value = {key: copy.deepcopy(clean) for key in cls.__annotations__}
      assert validate(cls, value, mode) == {'status': 'accepted', 'output': value}
      broken = copy.deepcopy(value)
      broken['permissive']['item']['name'] = ['not a string']
      assert validate(cls, broken, mode) == {'status': 'rejected', 'errors': [
        {'type': 'string_type', 'loc': ['permissive', 'item', 'name']}]}
  print(json.dumps({
    'python': platform.python_version(), 'pydantic': version('pydantic'),
    'pydantic_core': version('pydantic-core'), 'cases': len(results),
    'normal_and_wrong_type_controls': 16, 'results': results,
  }, indent=2))

if __name__ == '__main__':
  main()
