"""Calibrate native HasMatchingSpan on the public issue and four trace shapes.

The fixture preserves the original inputs and checks, with an in-memory exporter.
No model, database, network exporter, or replacement evaluator is used.
"""
from collections import Counter
from pathlib import Path
import sys
import runpy

import logfire
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
from pydantic_evals import Case, Dataset

from upstream_evaluators import EVALUATORS


def require(condition, message):
  if not condition:
    raise RuntimeError(message)


def recorded_shapes(exporter, root_name):
  """Check this fixture's known application trees, not a general trace validator."""
  spans = [s for s in exporter.get_finished_spans()
           if s.attributes.get('logfire.span_type') == 'span']
  require(spans, 'NO_SPANS: no recorded spans; check sampling and instrumentation before scoring')
  roots = [s for s in spans if s.name == root_name]
  require(roots, 'MISSING_ROOT: expected application anchor not recorded')
  # The issue fixture has one application root per execute span, not per trace ID:
  # the SDK puts several cases in one trace. Assert the fixture's entire task tree.
  executes = [s for s in spans if s.name == 'execute {task}']
  require(len(executes) == len(roots), 'COVERAGE: one application root required per task execution')
  shapes = []
  for execute in executes:
    children = [s for s in spans if s.parent and s.parent.span_id == execute.context.span_id]
    require(len(children) == 1 and children[0] in roots,
            'COVERAGE: duplicate roots or task spans outside the application root')
    root = children[0]
    descendants = []
    pending = [root.context.span_id]
    while pending:
      parent_id = pending.pop()
      found = [s for s in spans if s.parent and s.parent.span_id == parent_id]
      descendants.extend(found)
      pending.extend(s.context.span_id for s in found)
    shapes.append(Counter(s.name for s in descendants))
  return shapes


def values(report):
  require(not report.failures, 'EVALUATION_ERROR: a case failed to execute')
  require(all(c.output == 'done' for c in report.cases), 'unexpected task output')
  return {c.name: {k: v.value for k, v in c.assertions.items()} for c in report.cases}


def main():
  exporter = InMemorySpanExporter()
  path = Path(__file__).with_name('tool_fixture.py')
  require(path.is_file(), 'MISSING_INPUT: tool_fixture.py is required')
  logfire.configure(send_to_logfire=False, console=False,
                    additional_span_processors=[SimpleSpanProcessor(exporter)])
  report = runpy.run_path(str(path))['run']()
  shapes = recorded_shapes(exporter, 'agent run')
  require(len(shapes) == 2 and Counter(search_tool=1) in shapes
          and Counter(search_tool=1, delete_database=1) in shapes,
          'COVERAGE: expected safe and mixed application trees not fully recorded')
  original = values(report)
  require(original == {
    'safe': {'safe_execution': True, 'anchored': True},
    'calls delete': {'safe_execution': True, 'anchored': False},
  }, 'ORIGINAL: native evaluator results differ from the calibration target')
  for case, scores in original.items():
    print(case, scores)
  print('PASS issue reproduction: 2 cases, 4 score checks; both complete application trees recorded')

  exporter.clear()
  def task(scenario):
    with logfire.span('missing_root' if scenario == 'missing root' else 'task_execution'):
      if scenario == 'six sibling tools':
        for i in range(6):
          with logfire.span(f'search_tool_{i}'):
            pass
      else:
        with logfire.span('tool_execute'):
          for i in range(6 if scenario == 'six direct children' else 5):
            with logfire.span(f'child_operation_{i}'):
              pass
    return 'done'

  cases = ['five direct children', 'six direct children', 'six sibling tools', 'missing root']
  report = Dataset(
    name='focused span shape boundaries',
    cases=[Case(name=c, inputs=c) for c in cases],
    evaluators=EVALUATORS,
  ).evaluate_sync(task, progress=False)
  result = values(report)
  expected = [(True, True), (True, False), (True, True), (False, False)]
  for case, (safe, count) in zip(cases, expected):
    require(result[case] == {'safe_execution': safe, 'reasonable_tool_usage': count},
            f'BOUNDARY: unexpected result for {case}')
    print(case, result[case])
  # Verify the exact known fixture topology, including the deliberately renamed root.
  spans = [s for s in exporter.get_finished_spans()
           if s.attributes.get('logfire.span_type') == 'span']
  names = Counter(s.name for s in spans)
  require(names['task_execution'] == 3 and names['missing_root'] == 1,
          'COVERAGE: expected three anchors and one deliberately renamed root')
  tools = [s for s in spans if s.name == 'tool_execute']
  child_counts = sorted(sum(bool(s.parent and s.parent.span_id == t.context.span_id)
                            for s in spans) for t in tools)
  require(child_counts == [5, 5, 6], 'COVERAGE: direct-child boundaries not recorded')
  siblings = [s for s in spans if s.name == 'search_tool_{i}']
  parents = {s.parent.span_id for s in siblings if s.parent}
  roots = {s.context.span_id for s in spans if s.name == 'task_execution'}
  sibling_ids = {s.context.span_id for s in siblings}
  require(len(siblings) == 6 and len(parents) == 1 and parents <= roots
          and not any(s.parent and s.parent.span_id in sibling_ids for s in spans),
          'COVERAGE: expected six childless sibling tools under one application root')
  print('PASS boundaries: 4 cases, 8 score checks; missing root is missing evidence, not a violation')
  print('PASS total: 6 cases, 12 score checks, 0 skipped; trace-shape checks passed')


if __name__ == '__main__':
  try:
    main()
  except (RuntimeError, FileNotFoundError) as exc:
    print(f'CALIBRATION FAILED: {exc}', file=sys.stderr)
    sys.exit(1)
