#!/usr/bin/env python3
"""Check this shell's local socket primitives; no browser, external network or permission changes."""
import errno
import json
import socket
import tempfile
from pathlib import Path


def unix_stream(result):
  result['step'] = 'socket(AF_UNIX, SOCK_STREAM)'
  with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as server:
    result['step'] = 'create temporary directory'
    with tempfile.TemporaryDirectory(prefix='browser-socket-') as directory:
      result['step'] = 'bind(AF_UNIX, temporary path)'
      server.bind(str(Path(directory) / 'probe.sock'))


def unix_pair(result):
  result['step'] = 'socketpair(AF_UNIX, SOCK_STREAM)'
  left, right = socket.socketpair(socket.AF_UNIX, socket.SOCK_STREAM)
  with left, right:
    left.settimeout(2)
    right.settimeout(2)
    result['step'] = 'send/recv(AF_UNIX)'
    left.sendall(b'x')
    if right.recv(1) != b'x':
      raise RuntimeError('local socketpair data mismatch')


def tcp_loopback(result):
  result['step'] = 'socket(AF_INET, SOCK_STREAM)'
  with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.settimeout(2)
    result['step'] = 'bind(127.0.0.1, ephemeral port)'
    server.bind(('127.0.0.1', 0))
    result['step'] = 'listen(loopback)'
    server.listen(1)
    result['step'] = 'connect(loopback)'
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client:
      client.settimeout(2)
      client.connect(server.getsockname())
      result['step'] = 'accept(loopback)'
      peer, _ = server.accept()
      with peer:
        peer.settimeout(2)
        result['step'] = 'send/recv(loopback)'
        client.sendall(b'x')
        if peer.recv(1) != b'x':
          raise RuntimeError('local TCP data mismatch')


def observe(name, operation):
  result = {'probe': name, 'status': 'ok'}
  try:
    operation(result)
  except AttributeError:
    result['status'] = 'unsupported'
  except OSError as error:
    result.update(status='error', errno=error.errno, errno_name=errno.errorcode.get(error.errno, 'unknown'))
  return result


def run():
  return {
    'scope': 'current shell process; local IPC and loopback only',
    'browser_tested': False,
    'probes': [observe('unix_stream', unix_stream), observe('unix_pair', unix_pair), observe('tcp_loopback', tcp_loopback)],
  }


if __name__ == '__main__':
  result = run()
  print(json.dumps(result, ensure_ascii=False, indent=2))
  raise SystemExit(0 if all(item['status'] == 'ok' for item in result['probes']) else 1)
