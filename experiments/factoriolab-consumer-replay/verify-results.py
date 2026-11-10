import json
import pathlib
import sys
def require(condition, message):
    if not condition:
        raise SystemExit(message)

report = json.loads(pathlib.Path(sys.argv[1]).read_text())
results = report.get('testResults', [])
names = {pathlib.Path(x['name']).as_posix().split('/src/')[-1] for x in results}
expected = {'components/button/button.spec.ts', 'state/router/migration.spec.ts'}
require(names == expected and len(results) == 2, 'Wrong consumer file set')
require(report.get('success') is True, 'Runner reported failure')
require(report.get('numTotalTests') == report.get('numPassedTests') == 29, 'Expected 29 passed tests')
require(all(report.get(k, 0) == 0 for k in ['numFailedTests', 'numPendingTests', 'numTodoTests']), 'Failed/skipped/todo tests')
require(all(x.get('status') == 'passed' for x in results), 'Failed file')
require(sum(len(x['assertionResults']) for x in results) == 29, 'Missing assertions')
require(all(a.get('status') == 'passed' for x in results for a in x['assertionResults']), 'Nonpassing assertion')
print('CONSUMER_JSON_OK: 2 files, 29 passed, 0 failed/skipped/todo')
