"""Normalize inclusive integer intervals without changing the input."""


def compact_ranges(ranges):
  """Return sorted, disjoint inclusive intervals, merging adjacent ones too.

  Input is a finite iterable of (start, end) integer pairs. Reversed pairs
  raise ValueError. Empty input returns []. The input must not be mutated.
  """
  ordered = sorted((start, end) for start, end in ranges)
  if any(start > end for start, end in ordered):
    raise ValueError("start exceeds end")
  result = []
  for start, end in ordered:
    if result and start <= result[-1][1] + 1:
      result[-1] = (result[-1][0], end)
    else:
      result.append((start, end))
  return result
