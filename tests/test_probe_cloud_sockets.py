import importlib.util
from pathlib import Path
import errno
import unittest
from unittest.mock import MagicMock, patch


spec = importlib.util.spec_from_file_location('socket_probe', Path(__file__).resolve().parents[1] / 'scripts/probe_cloud_sockets.py')
probe = importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)


class SocketProbeTests(unittest.TestCase):
  def test_success_does_not_claim_browser_support(self):
    result = probe.observe('local', lambda output: output.update(step='create'))
    self.assertEqual(result, {'probe': 'local', 'status': 'ok', 'step': 'create'})

  def test_denied_operation_preserves_errno_and_step_without_private_paths(self):
    def denied(output):
      output['step'] = 'bind(AF_UNIX, temporary path)'
      raise PermissionError(errno.EPERM, 'denied', '/private/example.sock')
    result = probe.observe('unix', denied)
    self.assertEqual(result['status'], 'error')
    self.assertEqual(result['errno_name'], 'EPERM')
    self.assertEqual(result['step'], 'bind(AF_UNIX, temporary path)')
    self.assertNotIn('/private', str(result))

  def test_missing_socket_family_is_not_reported_as_a_policy_denial(self):
    def missing(output):
      raise AttributeError('AF_UNIX absent')
    self.assertEqual(probe.observe('unix', missing)['status'], 'unsupported')

  def test_temporary_directory_denial_is_not_a_socket_denial(self):
    server = MagicMock()
    with patch.object(probe.socket, 'AF_UNIX', 1, create=True), patch.object(probe.socket, 'socket', return_value=server), patch.object(
      probe.tempfile, 'TemporaryDirectory', side_effect=PermissionError(errno.EPERM, 'denied')
    ):
      result = probe.observe('unix_stream', probe.unix_stream)
    self.assertEqual(result['status'], 'error')
    self.assertEqual(result['errno_name'], 'EPERM')
    self.assertEqual(result['step'], 'create temporary directory')
    server.__exit__.assert_called_once()


if __name__ == '__main__':
  unittest.main()
