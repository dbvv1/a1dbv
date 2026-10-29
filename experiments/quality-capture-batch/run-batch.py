"""Serial receiver batch; do not execute until root approves actual receiver queue.
Usage: python run-batch.py private-receiver-config.json
No automatic retries, browser alternatives, runtime patches, or scheduling.
"""
import hashlib, json, os, pathlib, subprocess, sys, tempfile, datetime
HERE = pathlib.Path(__file__).resolve().parent
config = {}
parent = HERE / 'failed-preflight'
parent.mkdir(parents=True, exist_ok=True)
out = pathlib.Path(tempfile.mkdtemp(prefix='quality-', dir=parent))
report = {'passed': False, 'started': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'steps': [], 'errors': []}
lease_process = None
lease_acquired = False
lease_released = False

def save():
    (out / 'manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
sha = lambda p: hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()

def run(args, cwd, env=None, label='step'):
    log = out / (str(len(report['steps'])).zfill(2) + '-' + label + '.log')
    step = {'label': label, 'pid': None, 'state': 'spawn-requested', 'exitCode': None, 'signal': None, 'log': log.name}
    report['steps'].append(step)
    save()
    with log.open('wb') as f:
        try:
            p = subprocess.Popen([str(a) for a in args], cwd=cwd, env=env, stdout=f, stderr=subprocess.STDOUT)
            step.update(pid=p.pid, state='active')
            save()
            code = p.wait()
            step.update(state='exited', exitCode=code if code >= 0 else None, signal=-code if code < 0 else None)
            save()
        except BaseException:
            step['state'] = 'unknown' if step['pid'] else 'spawn-unconfirmed'
            save()
            raise
    if code != 0:
        raise RuntimeError(f'{label} failed; no retry or configuration switch')

def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args], text=True).strip()

def pointer(value,path):
    if not isinstance(path,str) or not path.startswith('/'):raise RuntimeError('Receipt field must be JSON pointer')
    for key in path[1:].split('/'):
        key=key.replace('~1','/').replace('~0','~')
        value=value[int(key)] if isinstance(value,list) else value[key]
    return value

def build(root, label):
    args = [os.environ.get('ComSpec', 'cmd.exe'), '/d', '/s', '/c', 'npm.cmd run build'] if os.name == 'nt' else ['npm', 'run', 'build']
    run(args, root, label=label)

def inventory(root):
    return [{'path': str(p.relative_to(root)).replace('\\', '/'), 'sha256': sha(p)} for p in sorted(root.rglob('*')) if p.is_file()]
try:
    config = json.loads(pathlib.Path(sys.argv[1]).read_text())
    target = pathlib.Path(config['outputRoot']).resolve()
    target.mkdir(parents=True, exist_ok=True)
    newout = pathlib.Path(tempfile.mkdtemp(prefix='quality-', dir=target))
    report['destination'] = str(newout)
    save()
    out = newout
    report['serialGateEvidence'] = config['serialGateEvidence']
    save()
    roots = {g: pathlib.Path(config[g]['root']).resolve() for g in ['moba', 'fps', 'star']}
    expected = {'moba': '8ade2d1012370692de31f3883a85338171dbcab3', 'star': 'f1da86c551ee3ff8541912974823dca07a9509ad', 'fps': 'abc139f6e2ba2b95b2fc0bc50c351aa3bd1d4be6'}
    if not expected['fps'] not in ['83e7c0b4e2c026ded1906aa5be71601859482431', '723d910e291b1dfac2ed72086cc4adfc0803cf6f']:
        raise RuntimeError('FPS needs current quality capture commit')
    report['source'] = {}
    report['browserFiles'] = {}
    report['frozenContracts'] = json.loads((HERE / 'batch-draft.json').read_text())
    report['orchestration'] = [{'file': p.name, 'sha256': sha(p)} for p in sorted(HERE.iterdir()) if p.is_file()]
    for g, r in roots.items():
        if not git(r, 'rev-parse', 'HEAD') == expected[g]:
            raise RuntimeError(g + ' wrong source')
        if not git(r, 'status', '--porcelain') == '':
            raise RuntimeError(g + ' source must be clean, not author tree')
        report['source'][g] = {'commit': expected[g], 'tree': git(r, 'rev-parse', 'HEAD^{tree}')}
        frozen = next(x for x in report['frozenContracts']['games'] if x['game'] == g)
        if report['source'][g]['tree'] != frozen['sourceTree']:raise RuntimeError(g + ' frozen tree mismatch')
        for f in frozen['files']:
            if sha(r / f['path']) != f['sha256']:raise RuntimeError(g + ' source file hash mismatch: ' + f['path'])
        b = config[g]['browser']
        p = pathlib.Path(b['path'])
        if not (p.is_absolute() and p.is_file()):
            raise RuntimeError('Acceptance check failed')
        if not sha(p) == b['sha256']:
            raise RuntimeError(g + ' browser differs from earlier successful receipt')
        if not (b['successfulReceipt'] and b['version']):
            raise RuntimeError('Acceptance check failed')
        receipt_path=pathlib.Path(b['successfulReceipt'])
        receipt=json.loads(receipt_path.read_text())
        for key in ['path','sha256','version']:
            if pointer(receipt,b['receiptFields'][key])!=b[key]:raise RuntimeError(g+' original success receipt does not match '+key)
        if pointer(receipt,b['receiptFields']['passed']) is not True:raise RuntimeError(g+' original receipt not passed')
        report['browserFiles'][g] = {**b, 'verifiedSha256': sha(p), 'successfulReceiptSha256':sha(receipt_path)}
    node = config.get('node', 'node')
    loader = roots['moba'] / 'node_modules/tsx/dist/loader.mjs'
    if not loader.is_file():
        raise RuntimeError('Install committed dependencies before approved launch')
    run([node, roots['moba'] / 'node_modules/vite/bin/vite.js', 'build', '--config', 'vite.capture.config.ts'], roots['moba'], label='moba-build')
    build(roots['fps'], 'fps-build')
    build(roots['star'], 'star-build')
    report['build'] = {g: inventory(roots[g] / d) for g, d in [('moba', 'outputs/capture-build'), ('fps', 'web-dist'), ('star', 'dist')]}
    moba_worker = out / 'moba-worker.mjs'
    run([node, HERE / 'moba-adapter.mjs', roots['moba'], moba_worker], HERE, label='moba-adapter-prepare')
    env = os.environ.copy()
    env['MOBA_CAPTURE_CHROMIUM'] = config['moba']['browser']['path']
    run([node, '--import', loader, moba_worker, '--shot', 'all', '--seed', '1', '--t', '10', '--input', 'march', '--lighting', 'baseline', '--frames', '1', '--repeat', '2', '--lease-root', config['leaseRoot'], '--task-id', config['taskId'], '--out', out / 'moba'], roots['moba'], env, 'moba-capture')
    receipts = list((out / 'moba').glob('run-*/report.json'))
    if not len(receipts) == 1:
        raise RuntimeError('Acceptance check failed')
    m = json.loads(receipts[0].read_text())
    if m.get('browserVersion') != config['moba']['browser']['version']:raise RuntimeError('MOBA actual browser version mismatch')
    if not (m['passed'] and m['capturePassed']):
        raise RuntimeError('Acceptance check failed')
    if not len(m['shots']) == 8:
        raise RuntimeError('Acceptance check failed')
    if not all((x['rendererClass'] == 'gpu' and x.get('unmasked') is True for x in m['shots'])):
        raise RuntimeError('Acceptance check failed')
    if not len({x['renderer'] for x in m['shots']}) == 1:
        raise RuntimeError('Acceptance check failed')
    lease_step = {'label': 'fps-star-shared-lease', 'pid': None, 'state': 'spawn-requested', 'exitCode': None, 'signal': None}
    report['steps'].append(lease_step)
    save()
    lease_process = subprocess.Popen([str(x) for x in [node, '--import', loader, HERE / 'lease-holder.mjs', roots['moba'], config['leaseRoot'], config['taskId'], out.name]], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=(out / 'lease-holder.log').open('wb'), text=True)
    lease_step.update(pid=lease_process.pid, state='active')
    save()
    acquired = json.loads(lease_process.stdout.readline())
    report['tailLease'] = acquired
    save()
    if acquired.get('event') != 'acquired':
        raise RuntimeError('Shared lease not acquired; stop before FPS')
    lease_acquired = True
    env = os.environ.copy()
    env['FPS_CAPTURE_CHROMIUM'] = config['fps']['browser']['path']
    run([node, '--import', loader, HERE / 'fps-worker.mjs', roots['fps'], roots['moba'], out / 'fps'], roots['fps'], env, 'fps-capture')
    fps_report=json.loads((out / 'fps/report.json').read_text())
    if fps_report.get('browserVersion') != config['fps']['browser']['version']:raise RuntimeError('FPS actual browser version mismatch')
    if not fps_report['passed']:
        raise RuntimeError('Acceptance check failed')
    worker = out / 'star-worker.mjs'
    run([node, HERE / 'star-adapter.mjs', roots['star'], roots['moba'], worker], HERE, label='star-adapter-prepare')
    env = os.environ.copy()
    env['STAR_RUSH_CAPTURE_CHROMIUM'] = config['star']['browser']['path']
    for shot, seed, t in [('coast-chase', 73121, 28), ('coast-full-bend', 73121, 28), ('academy-depth', 95276, 14)]:
        dest = out / shot
        run([node, '--import', loader, worker, dest, shot, '--seed', seed, '--t', t, '--input', 'road-tour', '--frames', '1', '--repeat', '--hardware-evidence', config['star']['hardwareEvidence']], roots['star'], env, shot)
        star_report=json.loads((dest / 'report.json').read_text())
        if star_report.get('browser') != config['star']['browser']['version']:raise RuntimeError('Star actual browser version mismatch')
        if not star_report['passed']:
            raise RuntimeError('Acceptance check failed')
    for g, r in roots.items():
        if not (git(r, 'rev-parse', 'HEAD') == expected[g] and git(r, 'status', '--porcelain') == ''):
            raise RuntimeError('Acceptance check failed')
    for g, d in [('moba', 'outputs/capture-build'), ('fps', 'web-dist'), ('star', 'dist')]:
        if not inventory(roots[g] / d) == report['build'][g]:
            raise RuntimeError('Acceptance check failed')
    lease_process.stdin.write(json.dumps({'action': 'release', 'evidence': {'browser': 'owned-handles-closed', 'preview': 'closed-port-refused', 'knownUnclosedResources': 0}}) + '\n')
    lease_process.stdin.flush()
    lease_process.stdin.close()
    released = json.loads(lease_process.stdout.readline())
    report['tailLeaseRelease'] = released
    lease_code = lease_process.wait()
    lease_step.update(state='exited', exitCode=lease_code if lease_code >= 0 else None, signal=-lease_code if lease_code < 0 else None)
    if lease_code != 0 or not released.get('released'):
        raise RuntimeError('Shared lease release unverified')
    lease_released = True
    report['passed'] = True
except BaseException as e:
    report['errors'].append(str(e))
finally:
    if lease_process is not None and (not lease_released):
        try:
            lease_process.stdin.close()
            code = lease_process.wait()
            lease_step.update(state='exited', exitCode=code if code >= 0 else None, signal=-code if code < 0 else None)
        except BaseException:
            lease_step['state'] = 'unknown'
        report['tailLeaseDisposition'] = 'retained-or-acquisition-unconfirmed; original receiver must inspect exact owner'
    report['finished'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    (out / 'manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(out)
sys.exit(0 if report['passed'] else 1)
