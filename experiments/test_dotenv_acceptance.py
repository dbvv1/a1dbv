"""Independent acceptance of upstream python-dotenv PR 717; synthetic data only."""

import errno
import json
import os
import stat
import subprocess
import sys
from pathlib import Path
from unittest import mock

import dotenv
import pytest
from click.testing import CliRunner
from dotenv.cli import cli


def test_real_cli_roundtrip(tmp_path):
    target = tmp_path / "synthetic.env"
    home = tmp_path / "home"
    home.mkdir()
    env = {"PATH": os.defpath, "HOME": str(home), "LANG": "C.UTF-8"}
    if "PYTHONPATH" in os.environ:
        env["PYTHONPATH"] = os.environ["PYTHONPATH"]
    transcript = []

    def run(*args, code=0):
        p = subprocess.run(
            [sys.executable, "-m", "dotenv", "--file", str(target), *args],
            check=False,
            cwd=tmp_path,
            env=env,
            capture_output=True,
            text=True,
            timeout=10,
        )
        assert p.returncode == code, (p.stdout, p.stderr)
        transcript.append(
            {
                "args": list(args),
                "exit": p.returncode,
                "stdout": p.stdout,
                "stderr": p.stderr,
            }
        )
        return p.stdout

    assert run("set", "GREETING", "café") == "GREETING=café\n"
    assert target.read_text() == "GREETING='café'\n"
    target.chmod(0o640)
    assert run("set", "COUNT", "2") == "COUNT=2\n"
    assert stat.S_IMODE(target.stat().st_mode) == 0o640
    assert run("get", "GREETING") == "café\n"
    assert json.loads(run("list", "--format", "json")) == {
        "GREETING": "café",
        "COUNT": "2",
    }
    assert run("unset", "COUNT") == "Successfully removed COUNT\n"
    run("get", "COUNT", code=1)
    assert target.read_text() == "GREETING='café'\n"
    assert stat.S_IMODE(target.stat().st_mode) == 0o640
    assert not list(tmp_path.glob(".tmp_*"))
    print("CLI_TRANSCRIPT=" + json.dumps(transcript, ensure_ascii=False))


def test_cli_missing_parent(tmp_path):
    target = tmp_path / "missing" / "synthetic.env"
    result = CliRunner().invoke(cli, ["--file", str(target), "set", "A", "synthetic"])
    assert result.exit_code == 2
    assert "Error writing env file:" in result.output
    assert str(target) in result.output
    assert "Traceback" not in result.output
    assert not target.parent.exists()


@pytest.mark.parametrize("operation", ["set", "unset"])
def test_cli_fsync_failure(tmp_path, operation):
    target = tmp_path / "synthetic.env"
    target.write_text("A=old\n")
    args = ["--file", str(target), operation, "A"]
    if operation == "set":
        args.append("new")
    with mock.patch(
        "dotenv.main.os.fsync", side_effect=OSError("synthetic sync failure")
    ):
        result = CliRunner().invoke(cli, args)
    assert result.exit_code == 2
    assert "synthetic sync failure" in result.output
    assert "Traceback" not in result.output
    assert target.read_text() == "A=old\n"
    assert not list(tmp_path.glob(".tmp_*"))


def test_original_sync_error_survives_cleanup_failure(tmp_path, caplog):
    target = tmp_path / "synthetic.env"
    target.write_text("A=old\n")
    original = OSError("synthetic sync failure")
    with (
        mock.patch("dotenv.main.os.fsync", side_effect=original),
        mock.patch.object(
            Path, "unlink", side_effect=OSError("synthetic cleanup failure")
        ),
    ):
        with pytest.raises(OSError) as exc:
            dotenv.set_key(target, "A", "new")
    assert exc.value is original
    assert target.read_text() == "A=old\n"
    assert len(list(tmp_path.glob(".tmp_*"))) == 1
    assert "could not remove the temporary file" in caplog.text


def test_same_directory_replace_has_no_cross_filesystem_copy_fallback(tmp_path):
    target = tmp_path / "synthetic.env"
    target.write_text("A=old\n")
    original = OSError(errno.EXDEV, "synthetic cross-device replacement refusal")

    def replace(src, dst):
        assert Path(src).parent == target.parent
        assert Path(dst) == target
        assert Path(src).read_text() == "A='new'\n"
        raise original

    with mock.patch("dotenv.main.os.replace", side_effect=replace):
        with pytest.raises(OSError) as exc:
            dotenv.set_key(target, "A", "new")
    assert exc.value is original
    assert target.read_text() == "A=old\n"
    assert not list(tmp_path.glob(".tmp_*"))


def test_mode_copy_failure_preserves_original(tmp_path):
    target = tmp_path / "synthetic.env"
    target.write_text("A=old\n")
    target.chmod(0o640)
    original = OSError("synthetic chmod failure")
    with mock.patch("dotenv.main.os.chmod", side_effect=original):
        with pytest.raises(OSError) as exc:
            dotenv.set_key(target, "A", "new")
    assert exc.value is original
    assert target.read_text() == "A=old\n"
    assert stat.S_IMODE(target.stat().st_mode) == 0o640
    assert not list(tmp_path.glob(".tmp_*"))
