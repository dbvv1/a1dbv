"""Real saved baseline is negative; passing cases below are synthetic, not repairs."""
import copy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
BASELINE = HERE / 'results/fallback-preflight-result.json'


class CoreCheckTests(unittest.TestCase):
    def invoke(self, path):
        result = subprocess.run([sys.executable, str(HERE / 'check_core.py'), str(path)],
                                capture_output=True, text=True, timeout=10)
        self.assertEqual(result.stderr, '')
        return result.returncode, json.loads(result.stdout)

    def test_real_saved_baseline_is_negative(self):
        code, result = self.invoke(BASELINE)
        self.assertEqual(code, 1)
        self.assertEqual(result['status'], 'fail')
        for number in (1, 2, 3):
            self.assertIn(f'run {number} event 1 start: IDs not exactly once', result['failures'])

    def test_synthetic_cases(self):
        positive = json.loads(BASELINE.read_text(encoding='utf-8'))
        for run in positive['runs']:
            for stage in ('before', 'duringDrag', 'beforeRelease', 'afterEnd'):
                for event in run[stage]['events']:
                    if event['event'] == 'start':
                        event['array'] = ['alpha', 'bravo', 'charlie']
        cases = [('corrected arrays only', positive, 0)]
        def variant(name, mutate, expected):
            data = copy.deepcopy(positive)
            mutate(data)
            cases.append((name, data, expected))
        variant('wrong final DOM', lambda d: d['runs'][0]['afterEnd'].__setitem__('domOrder', ['alpha', 'bravo', 'charlie']), 1)
        variant('duplicate end ID', lambda d: d['runs'][0]['afterEnd']['events'][-1].__setitem__('array', ['bravo', 'alpha', 'alpha']), 1)
        variant('missing sort', lambda d: d['runs'][0]['afterEnd']['events'].pop(-2), 2)
        variant('inconsistent prefix', lambda d: d['runs'][0]['duringDrag']['events'][0].__setitem__('array', []), 2)
        variant('missing run', lambda d: d['runs'].pop(), 2)
        variant('multiple sorts', lambda d: d['runs'][0]['afterEnd']['events'].insert(2, {'event': 'sort', 'array': ['bravo', 'alpha', 'charlie']}), 0)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'synthetic.json'
            for name, data, expected in cases:
                with self.subTest(name=name):
                    path.write_text(json.dumps(data), encoding='utf-8')
                    self.assertEqual(self.invoke(path)[0], expected)
            for text in ('{', '{"runs":[],"runs":[]}', '[]', 'null'):
                with self.subTest(invalid=text):
                    path.write_text(text, encoding='utf-8')
                    self.assertEqual(self.invoke(path)[0], 2)
            self.assertEqual(self.invoke(Path(directory) / 'missing.json')[0], 2)


if __name__ == '__main__':
    unittest.main()
