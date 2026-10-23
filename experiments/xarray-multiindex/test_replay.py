"""Portable prerequisite and failure-path regression tests for replay.py."""
from __future__ import annotations

import contextlib
import io
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import replay


class ReplayChecks(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix='replay-check-')
        self.addCleanup(self.temporary.cleanup)
        self.directory = Path(self.temporary.name)
        for name in ('fix.patch', 'test_collision.py', 'requirements.txt'):
            shutil.copyfile(replay.HERE / name, self.directory / name)

    def preflight(self) -> None:
        with patch.object(replay, 'HERE', self.directory), patch('sys.argv', ['replay.py', '--check-only']):
            replay.main()

    def test_normal(self) -> None:
        with contextlib.redirect_stdout(io.StringIO()):
            self.preflight()

    def test_missing_input(self) -> None:
        (self.directory / 'test_collision.py').unlink()
        with self.assertRaisesRegex(RuntimeError, 'missing sibling input'):
            self.preflight()

    def test_wrong_dependency(self) -> None:
        (self.directory / 'requirements.txt').write_text('numpy==0.0.0\n')
        with self.assertRaisesRegex(RuntimeError, 'need 0.0.0'):
            self.preflight()

    def test_changed_patch(self) -> None:
        (self.directory / 'fix.patch').write_text('not the reviewed patch')
        with self.assertRaisesRegex(RuntimeError, 'patch SHA-256 mismatch'):
            self.preflight()

    def test_timeout_log(self) -> None:
        error = subprocess.TimeoutExpired(['fake'], 180, output=b'partial output')
        log = self.directory / 'timeout.txt'
        with patch.object(replay.subprocess, 'run', side_effect=error):
            with self.assertRaises(subprocess.TimeoutExpired):
                replay.run(['fake'], self.directory, log)
        self.assertIn('partial output', log.read_text())
        self.assertIn('timed out', log.read_text())

    def test_subprocess_failure_preserved(self) -> None:
        result = subprocess.CompletedProcess(['fake'], 2, stdout='failed check')
        log = self.directory / 'failure.txt'
        with patch.object(replay.subprocess, 'run', return_value=result):
            with self.assertRaisesRegex(RuntimeError, 'exit 2, expected 0'):
                replay.run(['fake'], self.directory, log)
        self.assertEqual(log.read_text(), 'failed check')


if __name__ == '__main__':
    unittest.main()
