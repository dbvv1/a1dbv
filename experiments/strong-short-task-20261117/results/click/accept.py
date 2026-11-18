# Real-subprocess acceptance matrix for click#3914; run with the venv python whose click is under test.
import os, subprocess, sys, tempfile, textwrap, json
PY = sys.executable
TMP = tempfile.mkdtemp(dir=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tmp'))
def run(src, args, env=None):
    with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False, dir=TMP) as f: f.write(textwrap.dedent(src)); p = f.name
    e = {k: v for k, v in os.environ.items() if not k.startswith(('MYAPP', 'PORT'))}; e.update(env or {})
    r = subprocess.run([PY, p] + args, capture_output=True, text=True, env=e); os.unlink(p)
    return r.returncode, r.stdout + r.stderr
BASE = '''import click
@click.command(context_settings={"auto_envvar_prefix": "MYAPP"})
@click.option("--port", type=int, required=True, show_envvar=True%s)
def cli(port): click.echo(f"port={port}")
cli()'''
NESTED = '''import click
@click.group(context_settings={"auto_envvar_prefix": "MYAPP"})
def cli(): pass
@cli.group()
def admin(): pass
@admin.command()
@click.option("--port", type=int, required=True, show_envvar=True)
def serve(port): click.echo(f"port={port}")
cli()'''
cases = []
def case(name, ok, detail): cases.append({'case': name, 'pass': bool(ok), 'detail': detail[-160:].replace('\n', ' | ')})
c, o = run(BASE % '', ['--help']); case('help shows MYAPP_PORT', c == 0 and 'MYAPP_PORT' in o, o)
c, o = run(BASE % '', []); case('missing shows MYAPP_PORT, exit 2', c == 2 and 'MYAPP_PORT' in o, o)
c, o = run(BASE % '', ['--port', 'oops']); case('invalid shows MYAPP_PORT, exit 2', c == 2 and 'MYAPP_PORT' in o, o)
c, o = run(BASE % '', [], {'MYAPP_PORT': '8080'}); case('env value used', c == 0 and 'port=8080' in o, o)
c, o = run(BASE % '', ['--port', '9'], {'MYAPP_PORT': '8080'}); case('argv beats env', c == 0 and 'port=9' in o, o)
c, o = run(BASE % '', [], {'MYAPP_PORT': 'bad'}); case('invalid env value names MYAPP_PORT, exit 2', c == 2 and 'MYAPP_PORT' in o, o)
c, o = run(BASE % ', envvar="PORT"', []); case('explicit envvar shown, not auto', c == 2 and "'PORT'" in o and 'MYAPP_PORT' not in o, o)
c, o = run(BASE.replace('show_envvar=True', 'show_envvar=False') % '', []); case('show_envvar=False hides', c == 2 and 'env var' not in o, o)
c, o = run(BASE % ', allow_from_autoenv=False', []); case('allow_from_autoenv=False hides', c == 2 and 'MYAPP_PORT' not in o, o)
c, o = run(BASE.replace('context_settings={"auto_envvar_prefix": "MYAPP"}', '') % '', []); case('no prefix: no env hint', c == 2 and 'env var' not in o, o)
c, o = run(NESTED, ['admin', 'serve']); case('nested missing shows MYAPP_ADMIN_SERVE_PORT', c == 2 and 'MYAPP_ADMIN_SERVE_PORT' in o, o)
c2, o2 = run(NESTED, ['admin', 'serve', '--help']); case('nested help same name', 'MYAPP_ADMIN_SERVE_PORT' in o2, o2)
c, o = run(NESTED, ['admin', 'serve'], {'MYAPP_ADMIN_SERVE_PORT': '7'}); case('nested env works with shown name', c == 0 and 'port=7' in o, o)
print(json.dumps(cases, ensure_ascii=False, indent=0)); print('PASS', sum(x['pass'] for x in cases), '/', len(cases))
