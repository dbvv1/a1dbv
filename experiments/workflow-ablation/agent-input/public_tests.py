"""Common public examples; fixed evaluator copy is authoritative."""
import argparse
import unittest
import stream_driver as driver


class Source:
  def __init__(self, values):
    self.values = iter(values)
    self.closed = 0
    self.calls = 0

  def __iter__(self):
    return self

  def __next__(self):
    self.calls += 1
    return next(self.values)

  def close(self):
    self.closed += 1


class R1(unittest.TestCase):
  def test_full(self):
    s = Source([1, 2, 3])
    self.assertEqual(driver.run(s, list), [1, 2, 3])
    self.assertEqual(s.closed, 1)

  def test_early_return(self):
    s = Source([1, 2, 3])
    self.assertEqual(driver.run(s, lambda stream: next(stream)), [1, 2, 3])
    self.assertEqual(s.closed, 1)

  def test_empty(self):
    s = Source([])
    self.assertEqual(driver.run(s, list), [])
    self.assertEqual(s.closed, 1)

  def test_exception(self):
    s = Source([1, 2, 3])
    error = RuntimeError("public failure")
    def handler(stream):
      next(stream)
      raise error
    with self.assertRaises(RuntimeError) as caught:
      driver.run(s, handler)
    self.assertIs(caught.exception, error)
    self.assertEqual(s.calls, 1)
    self.assertEqual(s.closed, 1)


class R2(unittest.TestCase):
  def test_cancel(self):
    s = Source([1, 2, 3])
    def handler(stream):
      next(stream)
      raise driver.Cancel()
    self.assertEqual(driver.run(s, handler), [1])
    self.assertEqual(s.calls, 1)
    self.assertEqual(s.closed, 1)


if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument("--round", choices=["r1", "r2"], required=True)
  args = parser.parse_args()
  suite = unittest.defaultTestLoader.loadTestsFromTestCase(R1)
  if args.round == "r2":
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(R2))
  result = unittest.TextTestRunner(verbosity=2).run(suite)
  raise SystemExit(not result.wasSuccessful())
