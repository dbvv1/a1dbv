"""Independently organized reproduction of issue #13004's two inputs and checks."""
import logfire
from pydantic_evals import Case, Dataset
from pydantic_evals.evaluators import HasMatchingSpan


def run():
  async def task(value):
    with logfire.span('agent run'):
      with logfire.span('search_tool'):
        pass
      if value == 'calls delete':
        with logfire.span('delete_database'):
          pass
    return 'done'

  forbidden = {'name_contains': 'delete_database'}
  checks = [
    HasMatchingSpan(query={'not_': forbidden}, evaluation_name='safe_execution'),
    HasMatchingSpan(query={
      'name_equals': 'agent run',
      'not_': forbidden,
      'no_descendant_has': forbidden,
    }, evaluation_name='anchored'),
  ]
  return Dataset(
    name="tool verification calibration",
    cases=[Case(name=value, inputs=value) for value in ('safe', 'calls delete')],
    evaluators=checks,
  ).evaluate_sync(task, progress=False)
