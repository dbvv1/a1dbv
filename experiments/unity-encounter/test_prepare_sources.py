import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('prepare_sources', Path(__file__).with_name('prepare_sources.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class PrepareTests(unittest.TestCase):
  def setUp(self):
    self.temp = tempfile.TemporaryDirectory()
    self.addCleanup(self.temp.cleanup)
    self.root = Path(self.temp.name)
    self.repo = self.root / 'repo'; self.repo.mkdir()
    def git(*args):
      return subprocess.check_output(['git', '-C', str(self.repo), *args], stderr=subprocess.DEVNULL).decode().strip()
    git('init'); (self.repo / 'source').write_bytes(b'public fixture')
    git('add', 'source')
    git('-c', 'user.name=Test', '-c', 'user.email=test@users.noreply.github.com', 'commit', '-m', 'fixture')
    self.manifest = self.root / 'manifest.json'
    self.data = {'commit': git('rev-parse', 'HEAD'), 'files': [{'path':'source', 'destination':'model.glb',
      'sha256':hashlib.sha256(b'public fixture').hexdigest()}]}
    self.write()
  def write(self): self.manifest.write_text(json.dumps(self.data))
  def run_prepare(self): return module.prepare(self.repo, self.root / 'out', self.manifest)
  def test_exact_export(self):
    self.assertEqual(1, self.run_prepare())
    self.assertEqual(b'public fixture', (self.root / 'out/model.glb').read_bytes())
  def test_existing_output_preserved(self):
    self.run_prepare()
    with self.assertRaises(ValueError): self.run_prepare()
    self.assertEqual(b'public fixture', (self.root / 'out/model.glb').read_bytes())
  def test_bad_hash_no_partial_output(self):
    self.data['files'][0]['sha256'] = '0' * 64; self.write()
    with self.assertRaises(ValueError): self.run_prepare()
    self.assertFalse((self.root / 'out').exists())
  def test_missing_git_input_no_output(self):
    self.data['files'][0]['path'] = 'absent'; self.write()
    with self.assertRaises(subprocess.CalledProcessError): self.run_prepare()
    self.assertFalse((self.root / 'out').exists())
  def test_missing_manifest(self):
    self.manifest.unlink()
    with self.assertRaises(FileNotFoundError): self.run_prepare()
  def test_path_escape(self):
    self.data['files'][0]['destination'] = '../escape'; self.write()
    with self.assertRaises(ValueError): self.run_prepare()

  def test_second_file_failure_no_partial_output(self):
    self.data['files'].append(dict(self.data['files'][0], destination='other.glb', sha256='0' * 64)); self.write()
    with self.assertRaises(ValueError): self.run_prepare()
    self.assertFalse((self.root / 'out').exists())
  def test_duplicate_destination(self):
    self.data['files'].append(dict(self.data['files'][0])); self.write()
    with self.assertRaises(ValueError): self.run_prepare()
    self.assertFalse((self.root / 'out').exists())
  def test_missing_commit(self):
    self.data['commit'] = '0' * 40; self.write()
    with self.assertRaises(subprocess.CalledProcessError): self.run_prepare()
    self.assertFalse((self.root / 'out').exists())
  def test_non_git_checkout(self):
    with self.assertRaises(subprocess.CalledProcessError):
      module.prepare(self.root, self.root / 'out', self.manifest)
    self.assertFalse((self.root / 'out').exists())

if __name__ == '__main__': unittest.main()
