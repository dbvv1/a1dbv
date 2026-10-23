"""Four fail-closed regressions for the narrow pwasm replay entry.

Run with the same fixed dependencies as the replay, and --inputs-dir pointing
at the two verified original inputs retained by a successful normal replay.
No downloads, installations, full-suite retry, or upstream changes.
"""

import argparse
import ast
import hashlib
import pathlib
import subprocess
import sys
import tempfile
import unittest

SCRIPT = pathlib.Path(__file__).with_name("replay_pwasm_consumer.py")
INPUTS = None


class ReplayPrerequisites(unittest.TestCase):
    def run_entry(self, inputs, *, optimized=False, wrong_version=False):
        with tempfile.TemporaryDirectory(prefix="pwasm-reject-output-") as output:
            command = [sys.executable]
            if optimized:
                command.append("-O")
            if wrong_version:
                # Isolate the prerequisite, using real installed modules and
                # unchanged, hash-verified inputs. No real package is modified.
                command.extend(
                    [
                        "-c",
                        "import importlib.metadata,runpy,sys; "
                        "original=importlib.metadata.version; "
                        "importlib.metadata.version=lambda name: "
                        "'0.0.invalid' if name=='pwasm' else original(name); "
                        "sys.argv=sys.argv[1:]; "
                        "runpy.run_path(sys.argv[0],run_name='__main__')",
                    ]
                )
            command.extend(
                [str(SCRIPT), "--inputs-dir", str(inputs), "--output-dir", output]
            )
            result = subprocess.run(command, capture_output=True, text=True, timeout=15)
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            self.assertFalse((pathlib.Path(output) / "consumer-results.json").exists())
            return result.stderr

    def test_missing_input_rejected(self):
        with tempfile.TemporaryDirectory(prefix="pwasm-missing-") as directory:
            self.assertIn("FileNotFoundError", self.run_entry(directory))

    def test_corrupt_pinned_input_rejected(self):
        with tempfile.TemporaryDirectory(prefix="pwasm-corrupt-") as directory:
            (pathlib.Path(directory) / "untrusted_js.py").write_text("# changed\n")
            error = self.run_entry(directory)
            self.assertIn("AssertionError", error)
            self.assertIn("differs from pinned source", error)

    def test_wrong_version_rejected(self):
        error = self.run_entry(INPUTS, wrong_version=True)
        self.assertIn("AssertionError", error)
        self.assertIn("Requires pwasm==0.2a0", error)

    def test_optimized_python_rejected(self):
        error = self.run_entry(INPUTS, optimized=True)
        self.assertIn("RuntimeError", error)
        self.assertIn("assertions are required", error)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inputs-dir", type=pathlib.Path, required=True)
    args = parser.parse_args()
    INPUTS = args.inputs_dir
    # Do not execute/import the replay just to read its pinned fixture metadata.
    tree = ast.parse(SCRIPT.read_text())
    hashes = next(
        ast.literal_eval(node.value)
        for node in tree.body
        if isinstance(node, ast.Assign)
        and any(
            isinstance(target, ast.Name) and target.id == "INPUT_HASHES"
            for target in node.targets
        )
    )
    for filename, expected in hashes.items():
        actual = hashlib.sha256((INPUTS / filename).read_bytes()).hexdigest()
        if actual != expected:
            parser.error(
                "Regression setup requires unchanged pinned input: " + filename
            )
    unittest.main(argv=[sys.argv[0]], verbosity=2)
