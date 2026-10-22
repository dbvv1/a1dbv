#!/usr/bin/env python3
"""POSIX-only synthetic contract/behavior boundary check; requires an existing jar."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.request import ProxyHandler, build_opener

SHA256 = '2026a53459794d01e0f11843f24ad55588098d2dfbfd3e9a27b7705e29b5734d'
EXPECTED = {'id': 1, 'name': 'Scooby', 'type': 'Golden Retriever', 'status': 'Adopted'}
SPEC = '''
openapi: 3.0.1
info:
  title: Synthetic pet contract
  version: '1'
paths:
  /pets/{petid}:
    get:
      summary: Get synthetic pet
      parameters:
        - name: petid
          in: path
          required: true
          schema:
            type: integer
          examples:
            SCOOBY_200_OK:
              value: 1
      responses:
        '200':
          description: Pet response
          content:
            application/json:
              schema:
                type: object
                required: [id, name, status, type]
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  type:
                    type: string
                  status:
                    type: string
              examples:
                SCOOBY_200_OK:
                  value:
                    id: 1
                    name: Scooby
                    type: Golden Retriever
                    status: Adopted
'''


class Fixture(BaseHTTPRequestHandler):
    mode = 'normal'

    def do_GET(self):
        body = {'id': 1, 'name': 'Scooby', 'type': 'Golden Retriever', 'status': 'Adopted'}
        status = 200
        if self.path != '/pets/1':
            status, body = 404, {'error': 'not found'}
        elif self.mode == 'wrong_type':
            body['id'] = 'one'
        elif self.mode == 'wrong_value':
            body.update(id=999, name='Not Scooby', status='Available')
        elif self.mode == 'wrong_status':
            status = 500
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *_):
        pass


def stop(process):
    # Every Java invocation owns a fresh session; never target a shared process group.
    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        pass
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        pass
    # Reap any surviving descendants too, even if the leader has already exited.
    try:
        os.killpg(process.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    process.wait()


def interrupted(signum, _frame):
    raise SystemExit(128 + signum)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('jar', type=Path, help='Existing official Specmatic 2.55.3 jar; never downloaded')
    args = parser.parse_args()
    jar = args.jar.resolve(strict=True)
    if hashlib.sha256(jar.read_bytes()).hexdigest() != SHA256:
        parser.error('Jar SHA-256 mismatch; nothing executed')
    java = shutil.which('java')
    if not java:
        parser.error('Java is required; nothing installed')
    for sig in (signal.SIGTERM, signal.SIGHUP):
        signal.signal(sig, interrupted)
    work = Path(tempfile.mkdtemp(prefix='specmatic-local-feedback-', dir='/tmp'))
    print(f'ARTIFACTS={work}', flush=True)
    (work / 'home').mkdir()
    (work / 'service.yaml').write_text(SPEC)
    env = {'PATH': '/usr/bin:/bin', 'HOME': str(work / 'home'), 'SPECMATIC_DISABLE_TELEMETRY': 'true'}
    command = [java, f'-Duser.home={work / "home"}', '-Dspecmatic.disable.telemetry=true', '-jar', str(jar)]
    opener = build_opener(ProxyHandler({}))

    def launch(arguments, log):
        process = subprocess.Popen(command + arguments, cwd=work, env=env,
                                   stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        try:
            with (work / 'owned-pids.txt').open('a') as pids:
                pids.write(f'{process.pid}\n')
        except BaseException:
            stop(process)
            raise
        return process

    def fetch(port):
        with opener.open(f'http://127.0.0.1:{port}/pets/1', timeout=2) as response:
            return response.status, dict(response.headers), json.load(response)

    server = HTTPServer(('127.0.0.1', 0), Fixture)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        port = server.server_port
        for mode, expected_code in [('normal', 0), ('wrong_type', 1), ('wrong_value', 0), ('wrong_status', 1)]:
            Fixture.mode = mode
            with (work / f'{mode}.log').open('w') as log:
                process = launch(['test', 'service.yaml', f'--testBaseURL=http://127.0.0.1:{port}', '--debug'], log)
                try:
                    code = process.wait(timeout=90)
                finally:
                    stop(process)
            print(f'CONTRACT {mode}: exit={code} expected={expected_code}', flush=True)
            if code != expected_code:
                raise RuntimeError(f'{mode}: unexpected CLI exit {code}; see {work}')
            required = {'wrong_type': ('RESPONSE.BODY.id', 'R1001: Type mismatch'),
                        'wrong_status': ('RESPONSE.STATUS', 'R0002: HTTP status mismatch')}.get(mode, ())
            diagnostic = (work / f'{mode}.log').read_text()
            if not all(token in diagnostic for token in required):
                raise RuntimeError(f'{mode}: expected diagnostic missing')
        # A separate ordinary Python assertion with a manually chosen business expectation.
        business = """import json, sys
from urllib.request import build_opener, ProxyHandler
with build_opener(ProxyHandler({})).open(sys.argv[1], timeout=2) as response:
    actual = json.load(response)
expected = {'id': 1, 'name': 'Scooby', 'type': 'Golden Retriever', 'status': 'Adopted'}
assert actual == expected, f'Business expectation: {expected!r}; actual: {actual!r}'
print('BUSINESS_EXPECTATION_PASS')
"""
        (work / 'business_assert.py').write_text(business)
        for mode, expected_code in [('normal', 0), ('wrong_value', 1)]:
            Fixture.mode = mode
            with (work / f'business-{mode}.log').open('w') as log:
                result = subprocess.run([sys.executable, '-E', str(work / 'business_assert.py'),
                                         f'http://127.0.0.1:{port}/pets/1'],
                                        stdout=log, stderr=subprocess.STDOUT, timeout=5)
            print(f'BUSINESS {mode}: exit={result.returncode} expected={expected_code}', flush=True)
            if result.returncode != expected_code:
                raise RuntimeError('Unexpected business assertion exit')
            diagnostic = (work / f'business-{mode}.log').read_text()
            wrong = dict(EXPECTED, id=999, name='Not Scooby', status='Available')
            required = ('BUSINESS_EXPECTATION_PASS' if mode == 'normal' else
                        f'AssertionError: Business expectation: {EXPECTED!r}; actual: {wrong!r}')
            if required not in diagnostic:
                raise RuntimeError('Expected business assertion diagnostic missing')
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)

    # Discover a free loopback port. If another process claims it, fail rather than kill it.
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    with (work / 'mock.log').open('w') as log:
        process = launch(['mock', 'service.yaml', '--host=127.0.0.1', f'--port={port}', '--hot-reload=disabled', '--debug'], log)
        try:
            deadline = time.monotonic() + 30
            while True:
                if process.poll() is not None:
                    raise RuntimeError(f'Mock exited early; see {work}')
                try:
                    status, headers, actual = fetch(port)
                    break
                except OSError:
                    if time.monotonic() >= deadline:
                        raise RuntimeError(f'Mock not ready; see {work}')
                    time.sleep(0.2)
            (work / 'mock-response.json').write_text(json.dumps({'status': status, 'headers': headers, 'body': actual}, indent=2))
            if status != 200 or actual != EXPECTED:
                raise RuntimeError(f'Mock example mismatch: {actual!r}')
            print('MOCK_EXACT_EXAMPLE_PASS', flush=True)
        finally:
            stop(process)
    print('PASS: four contract cases, two business cases, same-spec mock; owned services stopped.', flush=True)


if __name__ == '__main__':
    main()
