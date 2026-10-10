"""Evaluator-owned checks. Not an agent input or a security sandbox."""
import importlib.util
import itertools
import json
from pathlib import Path
import sys
import unittest


def load(path, name):
  spec = importlib.util.spec_from_file_location(name, path)
  module = importlib.util.module_from_spec(spec)
  # Match normal import semantics (dataclasses resolve annotations via sys.modules).
  sys.modules[name] = module
  try:
    spec.loader.exec_module(module)
  except SystemExit as exc:
    raise RuntimeError("candidate exited during import") from exc
  return module


class HeldOutTests(unittest.TestCase):
  def test_nested(self):
    self.assertEqual(compact([(1, 9), (3, 4)]), [(1, 9)])

  def test_nested_then_bridge(self):
    self.assertEqual(compact([(1, 9), (3, 4), (10, 12)]), [(1, 12)])

  def test_same_start_duplicates_negative(self):
    self.assertEqual(compact([(-4, 2), (-4, -2), (-4, 2)]), [(-4, 2)])

  def test_no_mutation_and_generator(self):
    source = [[8, 9], [1, 7], [3, 4]]
    before = [r[:] for r in source]
    self.assertEqual(compact(source), [(1, 9)])
    self.assertEqual(source, before)
    self.assertEqual(compact(iter([(0, 7), (1, 2)])), [(0, 7)])

  def test_invalid(self):
    for source in [[(2, 1)], [(0, 9), (4, 3)]]:
      with self.subTest(source=source):
        with self.assertRaises(ValueError):
          compact(source)

  def test_large_endpoints(self):
    n = 10**30
    self.assertEqual(compact([(n, n + 9), (n + 2, n + 3)]), [(n, n + 9)])

  def test_exhaustive_small_domain(self):
    # Independent finite-set oracle, not the reference repair algorithm.
    intervals = [(a, b) for a in range(-2, 3) for b in range(a, 3)]
    for size in range(4):
      for source in itertools.product(intervals, repeat=size):
        points = sorted({x for a, b in source for x in range(a, b + 1)})
        expected = []
        for _, group in itertools.groupby(enumerate(points), lambda pair: pair[1] - pair[0]):
          members = [pair[1] for pair in group]
          expected.append((members[0], members[-1]))
        with self.subTest(source=source):
          self.assertEqual(compact(source), expected)


if __name__ == "__main__":
  candidate = Path(sys.argv[1]).resolve()
  implementation = load(candidate / "intervals.py", "intervals")
  compact = implementation.compact_ranges
  sys.modules["intervals"] = implementation
  if sys.argv[2] == "public":
    original = Path(__file__).resolve().parents[1] / "agent-input/baseline/tests/test_intervals.py"
    suite = unittest.defaultTestLoader.loadTestsFromModule(load(original, "original_public_tests"))
  else:
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(HeldOutTests)
  result = unittest.TextTestRunner(verbosity=0).run(suite)
  print(json.dumps({"tests_run": result.testsRun, "failures": len(result.failures),
    "errors": len(result.errors), "skipped": len(result.skipped),
    "passed": result.wasSuccessful() and not result.skipped and result.testsRun > 0}))
  sys.exit(0 if result.wasSuccessful() else 1)
