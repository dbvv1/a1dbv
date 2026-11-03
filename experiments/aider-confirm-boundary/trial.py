import argparse
import contextlib
import datetime
import hashlib
import io
import json
import os
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

parser = argparse.ArgumentParser(description="Characterize a pinned Aider confirmation function; no shell or model.")
parser.add_argument("--source", type=Path, required=True, help="Pinned Aider checkout")
parser.add_argument("--output", type=Path, required=True, help="New output directory")
args = parser.parse_args()
SOURCE = args.source.resolve()
ROOT = args.output.resolve()
if ROOT.exists():
    parser.error("Output directory must not exist; preserve prior receipts.")
EXPECTED_HASHES = {
    "aider/io.py": "7f62a79c8202f2a3793410bac4c983e417fb886513b90faf0e0579d5bb7d047b",
    "tests/basic/test_io.py": "f5c41cb4b8df04ec6d575a1fdfe1f433ae04ef6501ac08f967dc6004e23d848a",
}
for name, expected in EXPECTED_HASHES.items():
    if hashlib.sha256((SOURCE / name).read_bytes()).hexdigest() != expected:
        parser.error("Pinned source hash mismatch: " + name)
ROOT.mkdir(parents=True)
# This Python audit hook is a guard for this probe, not an OS sandbox.
sys.dont_write_bytecode = True
REVISION = '5dc9490bb35f9729ef2c95d00a19ccd30c26339c'
START = datetime.datetime.now(datetime.timezone.utc).isoformat()
BLOCKED = []

def audit(event, args):
    if event.startswith('socket.') or event in {
        'subprocess.Popen', 'os.system', 'os.exec', 'os.posix_spawn',
        'os.fork', 'os.forkpty', 'pty.spawn', 'webbrowser.open',
    }:
        BLOCKED.append(event)
        raise RuntimeError('Forbidden external side effect: ' + event)
    if event == 'open':
        path, mode, flags = args
        write = bool(flags & (os.O_WRONLY | os.O_RDWR | os.O_CREAT | os.O_TRUNC | os.O_APPEND))
        if write and isinstance(path, (str, bytes, os.PathLike)):
            target = Path(os.fsdecode(path)).resolve()
            if not target.is_relative_to(ROOT):
                BLOCKED.append('write outside runner')
                raise RuntimeError('Write outside independent runner directory')

sys.addaudithook(audit)
sys.path.insert(0, str(SOURCE))
capture = io.StringIO()
cases = []

with contextlib.redirect_stdout(capture), contextlib.redirect_stderr(capture):
    import aider.io as product_io
    from tests.basic.test_io import TestInputOutput
    assert Path(product_io.__file__).resolve() == SOURCE / 'aider/io.py'
    original_hashes = {
        name: hashlib.sha256((SOURCE / name).read_bytes()).hexdigest()
        for name in ('aider/io.py', 'tests/basic/test_io.py')
    }

    class BoundaryCharacterization(unittest.TestCase):
        def test_missing_inputs_and_negative_controls(self):
            matrix = [
                ('empty_default_yes', '', None, True),
                ('eof_default_yes', EOFError(), None, True),
                ('empty_explicit_default_no', '', 'n', False),
                ('eof_explicit_default_no', EOFError(), 'n', False),
                ('explicit_no', 'n', None, False),
            ]
            for label, response, default, expected in matrix:
                with self.subTest(label=label):
                    output = io.StringIO()
                    product = product_io.InputOutput(
                        pretty=False, fancy_input=False, yes=None,
                        input_history_file=None, chat_history_file=None,
                        llm_history_file=None, notifications=False, output=output,
                    )
                    kwargs = dict(
                        subject='synthetic non-executable subject',
                        explicit_yes_required=True,
                        group=product_io.ConfirmGroup(['synthetic non-executable subject']),
                        allow_never=True,
                    )
                    if default is not None:
                        kwargs['default'] = default
                    mock_args = {'side_effect': response} if isinstance(response, BaseException) else {'return_value': response}
                    with patch('builtins.input', **mock_args) as mocked_input:
                        observed = product.confirm_ask('Run shell command?', **kwargs)
                        row = dict(case=label, observed=observed, expected=expected,
                                   input_calls=mocked_input.call_count,
                                   prompt=mocked_input.call_args.args[0])
                        cases.append(row)
                        self.assertIs(observed, expected)
                        self.assertEqual(mocked_input.call_count, 1)
                    self.assertIsNone(product.chat_history_file)
                    self.assertIsNone(product.input_history_file)
                    self.assertIsNone(product.llm_history_file)
                    self.assertFalse(product.notifications)

    suite = unittest.TestSuite([
        TestInputOutput('test_confirm_ask_explicit_yes_required'),
        BoundaryCharacterization('test_missing_inputs_and_negative_controls'),
    ])
    result = unittest.TextTestRunner(stream=capture, verbosity=2).run(suite)
    self_check = all(hashlib.sha256((SOURCE / name).read_bytes()).hexdigest() == value
                     for name, value in original_hashes.items())

report = dict(
    revision=REVISION,
    observed_started_at_utc=START,
    observed_finished_at_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
    source_hashes=original_hashes,
    original_test='tests.basic.test_io.TestInputOutput.test_confirm_ask_explicit_yes_required',
    original_test_four_assertion_paths=['yes=True,explicit=True -> False',
        'yes=False,explicit=True -> False', 'yes=None,input=y,explicit=True -> True',
        'yes=True,explicit=False -> True'],
    additional_cases=cases, unittest_methods_run=result.testsRun,
    failures=len(result.failures), errors=len(result.errors),
    success=result.wasSuccessful(), source_unchanged=self_check,
    blocked_side_effect_attempts=BLOCKED,
    scope='Direct native IO confirmation function with injected input only; no shell execution, CLI, model or compaction execution; does not establish whole-product safety.',
)
(ROOT / 'unittest-output.txt').write_text(capture.getvalue())
(ROOT / 'results.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
sys.exit(0 if result.wasSuccessful() and self_check and not BLOCKED else 1)
