"""Entry-point regression tests; synthetic subprocess output, not Click validation."""
import contextlib
import io
from pathlib import Path
import runpy
import subprocess
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).with_name('accept.py')
SUCCESS = [
    (0, 'MYAPP_PORT'), (2, 'MYAPP_PORT'), (2, 'MYAPP_PORT'),
    (0, 'port=8080'), (0, 'port=9'), (2, 'MYAPP_PORT'),
    (2, "'PORT'"), (2, 'missing'), (2, 'missing'), (2, 'missing'),
    (2, 'MYAPP_ADMIN_SERVE_PORT'), (0, 'MYAPP_ADMIN_SERVE_PORT'), (0, 'port=7'),
]

class EntryTests(unittest.TestCase):
    def exercise(self, replies, expected):
        created = []
        callbacks = []
        def fake_run(args, **kwargs):
            self.assertEqual(kwargs["timeout"], 30)
            created.append(Path(args[1]).parent)
            self.assertTrue(Path(args[1]).is_file())
            code, output = next(replies)
            return subprocess.CompletedProcess(args, code, output, '')
        try:
            with patch('subprocess.run', side_effect=fake_run), patch('atexit.register', side_effect=callbacks.append), contextlib.redirect_stdout(io.StringIO()):
                with self.assertRaises(SystemExit) as caught:
                    runpy.run_path(str(SCRIPT), run_name='__main__')
            self.assertEqual(caught.exception.code, expected)
            self.assertEqual(len(created), 13)
        finally:
            for cleanup in callbacks:
                cleanup()
        self.assertTrue(all(not path.exists() for path in created))

    def test_success_without_local_tmp_directory(self):
        self.exercise(iter(SUCCESS), 0)

    def test_failed_assertion_returns_nonzero(self):
        replies = list(SUCCESS)
        replies[0] = (1, 'wrong result')
        self.exercise(iter(replies), 1)

    def test_nested_help_failure_returns_nonzero(self):
        replies = list(SUCCESS)
        replies[11] = (2, "MYAPP_ADMIN_SERVE_PORT")
        self.exercise(iter(replies), 1)

    def test_timeout_does_not_silently_pass(self):
        with patch("subprocess.run", side_effect=subprocess.TimeoutExpired("fixture", 30)):
            with self.assertRaises(subprocess.TimeoutExpired):
                runpy.run_path(str(SCRIPT), run_name="__main__")

    def test_missing_dependency_returns_nonzero(self):
        self.exercise(iter([(1, "ModuleNotFoundError: No module named 'click'")] * 13), 1)

if __name__ == '__main__':
    unittest.main()
