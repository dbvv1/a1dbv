"""Offline, synthetic import-origin checks. Requires Python with venv/ensurepip."""
import base64
import csv
import hashlib
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import venv
import zipfile


class ProvenanceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory(prefix="import-provenance-")
        cls.addClassCleanup(cls.tmp.cleanup)
        cls.root = Path(cls.tmp.name).resolve()
        cls.env = cls.root / "env"
        venv.EnvBuilder(with_pip=True).create(cls.env)
        cls.python = cls.env / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
        cls.clean = cls.root / "clean"
        cls.clean.mkdir()
        cls.wheel = cls.root / "provenance_demo-1.0-py3-none-any.whl"
        files = {
            "provenance_demo/__init__.py": b"VALUE = 'wheel-1.0'\n",
            "provenance_demo-1.0.dist-info/METADATA": b"Metadata-Version: 2.1\nName: provenance-demo\nVersion: 1.0\n",
            "provenance_demo-1.0.dist-info/WHEEL": b"Wheel-Version: 1.0\nGenerator: synthetic-fixture\nRoot-Is-Purelib: true\nTag: py3-none-any\n",
        }
        record = io.StringIO(newline="")
        writer = csv.writer(record)
        for name, data in files.items():
            digest = base64.urlsafe_b64encode(hashlib.sha256(data).digest()).rstrip(b"=").decode()
            writer.writerow([name, "sha256=" + digest, len(data)])
        writer.writerow(["provenance_demo-1.0.dist-info/RECORD", "", ""])
        files["provenance_demo-1.0.dist-info/RECORD"] = record.getvalue().encode()
        with zipfile.ZipFile(cls.wheel, "w") as z:
            for name, data in files.items():
                z.writestr(name, data)
        subprocess.run([str(cls.python), "-I", "-m", "pip", "--isolated", "install",
                        "--no-index", "--no-deps", "--no-cache-dir", str(cls.wheel)],
                       cwd=cls.clean, check=True, capture_output=True)

    def run_python(self, code, cwd=None, isolated=True):
        command = [str(self.python)] + (["-I"] if isolated else []) + ["-c", code]
        env = {k: v for k, v in os.environ.items() if not k.startswith("PYTHON")}
        return subprocess.run(command, cwd=cwd or self.clean, env=env,
                              text=True, capture_output=True, timeout=30)

    def test_wheel_origin_and_distribution_bytes(self):
        result = self.run_python("""
import hashlib, importlib.metadata as m, json
from pathlib import Path
import provenance_demo as p
d = m.distribution('provenance-demo')
expected = Path(d.locate_file('provenance_demo/__init__.py')).resolve()
actual = Path(p.__file__).resolve()
assert actual == expected
assert p.VALUE == 'wheel-1.0'
assert d.version == '1.0'
print(json.dumps({'hash': hashlib.sha256(actual.read_bytes()).hexdigest(), 'origin': str(actual)}))
""")
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads(result.stdout)
        self.assertTrue(Path(data['origin']).is_relative_to(self.env))
        with zipfile.ZipFile(self.wheel) as z:
            self.assertEqual(data['hash'], hashlib.sha256(z.read('provenance_demo/__init__.py')).hexdigest())
        self.assertFalse(Path(data['origin']).is_relative_to(self.root / 'source'))

    def test_source_shadow_rejected_even_with_installed_metadata(self):
        source = self.root / 'source'
        package = source / 'provenance_demo'
        package.mkdir(parents=True)
        (package / '__init__.py').write_text("VALUE = 'source-shadow'\n")
        result = self.run_python("""
import importlib.metadata as m
from pathlib import Path
import provenance_demo as p
d = m.distribution('provenance-demo')
assert d.version == '1.0'
assert p.VALUE == 'source-shadow'
assert Path(p.__file__).resolve() == Path(d.locate_file('provenance_demo/__init__.py')).resolve(), 'WRONG_ARTIFACT'
""", cwd=source, isolated=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('WRONG_ARTIFACT', result.stderr)

    def namespace_roots(self, name):
        left, right = self.root / (name + '-left'), self.root / (name + '-right')
        for root in (left, right):
            (root / 'demo_ns').mkdir(parents=True)
        (left / 'demo_ns' / 'alpha.py').write_text("VALUE = 'left'\n")
        (right / 'demo_ns' / 'beta.py').write_text("VALUE = 'right'\n")
        return left, right

    def test_namespace_checks_concrete_modules_and_all_locations(self):
        left, right = self.namespace_roots('positive')
        code = f"""
import sys
from pathlib import Path
sys.path[:0] = {[str(left), str(right)]!r}
import demo_ns, demo_ns.alpha, demo_ns.beta
assert demo_ns.__file__ is None
expected = {{Path(p).resolve() / 'demo_ns' for p in {[str(left), str(right)]!r}}}
assert {{Path(p).resolve() for p in demo_ns.__path__}} == expected
assert {{Path(p).resolve() for p in demo_ns.__spec__.submodule_search_locations}} == expected
assert Path(demo_ns.alpha.__file__).resolve().is_relative_to(Path({str(left)!r}).resolve())
assert Path(demo_ns.beta.__file__).resolve().is_relative_to(Path({str(right)!r}).resolve())
assert (demo_ns.alpha.VALUE, demo_ns.beta.VALUE) == ('left', 'right')
"""
        result = self.run_python(code)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_namespace_wrong_submodule_fails_ownership(self):
        left, right = self.namespace_roots('negative')
        (right / 'demo_ns' / 'alpha.py').write_text("VALUE = 'wrong-tree'\n")
        code = f"""
import sys
from pathlib import Path
sys.path[:0] = {[str(right), str(left)]!r}
import demo_ns.alpha
assert demo_ns.alpha.VALUE == 'wrong-tree'
assert Path(demo_ns.alpha.__file__).resolve().is_relative_to(Path({str(left)!r}).resolve()), 'WRONG_NAMESPACE_OWNER'
"""
        result = self.run_python(code)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('WRONG_NAMESPACE_OWNER', result.stderr)


if __name__ == '__main__':
    unittest.main(verbosity=2)
