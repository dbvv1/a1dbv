"""Evaluator-owned trace oracle; never copy to the model project."""
import json
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parent))
from checks import load


class TraceSource:
  def __init__(self, values, events, failure=None, fail_at=None):
    self.values = values
    self.events = events
    self.index = 0
    self.failure = failure
    self.fail_at = fail_at
  def __iter__(self):
    return self
  def __next__(self):
    self.events.append(("next", self.index))
    if self.index == self.fail_at:
      raise self.failure
    if self.index == len(self.values):
      raise StopIteration
    value = self.values[self.index]
    self.index += 1
    return value
  def close(self):
    self.events.append(("close",))


class Inherited(unittest.TestCase):
  def test_normal_paths(self):
    for values in [[], [8], [5, -7, 5, 0, 91]]:
      for count in range(len(values) + 1):
        with self.subTest(values=values, count=count):
          events = []
          source = TraceSource(values, events)
          def handler(stream):
            events.append(("handler",))
            self.assertIs(iter(stream), stream)
            for _ in range(count):
              next(stream)
            events.append(("return",))
            return ["ignored"]
          self.assertEqual(driver.run(source, handler), values)
          expected = ([("handler",)] + [("next", i) for i in range(count)]
            + [("return",)] + [("next", i) for i in range(count, len(values) + 1)]
            + [("close",)])
          # Normal exhaustion may be probed repeatedly; only collapse adjacent
          # EOF requests, never successful reads or any event after close.
          normalized = []
          for event in events:
            if event == ("next", len(values)) and normalized and normalized[-1] == event:
              continue
            normalized.append(event)
          self.assertEqual(normalized, expected)

  def test_full_consumption(self):
    events = []
    values = [19, 0, 19, -61]
    source = TraceSource(values, events)
    self.assertEqual(driver.run(source, lambda stream: list(stream)), values)
    # Extra exhaustion probes are not value requests after cancellation; R1 only
    # constrains successful order and final close, not redundant EOF probes.
    self.assertEqual(events[-1], ("close",))
    self.assertEqual(events.count(("close",)), 1)
    self.assertEqual([e for e in events if e[0] == "next" and e[1] < len(values)],
      [("next", i) for i in range(len(values))])

  def test_handler_errors(self):
    for kind in [RuntimeError, ValueError, KeyboardInterrupt, StopIteration]:
      for count in [0, 2]:
        with self.subTest(kind=kind, count=count):
          error = kind("held out handler")
          events = []
          def handler(stream):
            for _ in range(count):
              next(stream)
            events.append(("raise",))
            raise error
          try:
            driver.run(TraceSource([11, 22, 33], events), handler)
          except BaseException as caught:
            self.assertIs(caught, error)
          else:
            self.fail("exception swallowed")
          self.assertEqual(events, [("next", i) for i in range(count)]
            + [("raise",), ("close",)])

  def test_source_errors(self):
    for count in [0, 2]:
      for consume in [False, True]:
        with self.subTest(count=count, consume=consume):
          error = LookupError("held out source")
          events = []
          source = TraceSource([11, 22, 33], events, error, count)
          try:
            driver.run(source, list if consume else lambda stream: None)
          except BaseException as caught:
            self.assertIs(caught, error)
          else:
            self.fail("source exception swallowed")
          self.assertEqual(events, [("next", i) for i in range(count + 1)] + [("close",)])


class Cancellation(unittest.TestCase):
  def test_cancel_prefixes(self):
    class ChildCancel(driver.Cancel):
      pass
    for values in [[], [17], [-2, 17, -2, 81, 0]]:
      for count in range(len(values) + 1):
        for kind in [driver.Cancel, ChildCancel]:
          with self.subTest(values=values, count=count, kind=kind):
            events = []
            def handler(stream):
              events.append(("handler",))
              for _ in range(count):
                next(stream)
              events.append(("cancel",))
              raise kind("held out cancel")
            actual = driver.run(TraceSource(values, events), handler)
            self.assertIsInstance(actual, list)
            self.assertEqual(actual, values[:count])
            self.assertEqual(events, [("handler",)] + [("next", i) for i in range(count)]
              + [("cancel",), ("close",)])


class R1Cancel(unittest.TestCase):
  def test_cancel_is_ordinary_r1_error(self):
    error = driver.Cancel("R1")
    events = []
    def handler(stream):
      raise error
    try:
      driver.run(TraceSource([41], events), handler)
    except BaseException as caught:
      self.assertIs(caught, error)
    else:
      self.fail("R1 must propagate Cancel")
    self.assertEqual(events, [("close",)])


class RecordedResult(unittest.TextTestResult):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.checks = {}
  def addSuccess(self, test):
    super().addSuccess(test)
    self.checks[test.id()] = True
  def addFailure(self, test, err):
    super().addFailure(test, err)
    self.checks[test.id()] = False
  def addError(self, test, err):
    super().addError(test, err)
    self.checks[test.id()] = False
  def addSubTest(self, test, subtest, err):
    super().addSubTest(test, subtest, err)
    self.checks[str(subtest)] = err is None


if __name__ == "__main__":
  candidate, suite_name = Path(sys.argv[1]), sys.argv[2]
  driver = load(candidate / "stream_driver.py", "stream_driver")
  if suite_name.startswith("public"):
    public = load(Path(__file__).resolve().parents[1] / "agent-input/public_tests.py", "fixed_public")
    case = public.R1 if suite_name == "public_r1" else public.R2
  else:
    case = {"inherited_r1": Inherited, "cancel_r2": Cancellation, "r1_cancel": R1Cancel}[suite_name]
  suite = unittest.defaultTestLoader.loadTestsFromTestCase(case)
  result = unittest.TextTestRunner(verbosity=0, resultclass=RecordedResult).run(suite)
  print(json.dumps({"checks": result.checks, "tests_run": result.testsRun, "skipped": len(result.skipped),
    "failures": len(result.failures), "errors": len(result.errors),
    "passed": result.wasSuccessful() and not result.skipped and result.testsRun > 0}))
  sys.exit(0 if result.wasSuccessful() else 1)
