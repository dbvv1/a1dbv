"""Evaluator-only constructive witness, NEVER a replacement for actual R1."""
class Cancel(Exception):
  pass


def run(source, handler):
  values = []
  exhausted = False
  class Stream:
    def __iter__(self):
      return self
    def __next__(self):
      nonlocal exhausted
      if exhausted:
        raise StopIteration
      try:
        value = next(source)
      except StopIteration:
        exhausted = True
        raise
      values.append(value)
      return value
  stream = Stream()
  try:
    try:
      handler(stream)
    except Cancel:
      return values
    for _ in stream:
      pass
    return values
  finally:
    source.close()
