"""Drive public Click formatting and a real command's help at fixed source versions."""
import json
import sys
from pathlib import Path
import click
from click.testing import CliRunner

OPTIONS = ['--enable-verbose-logging', '--output-file-path', '--max-retry-count', '--disable-cache-mode', '--config-file-location', '--auto-update-interval', '--force-overwrite-existing', '--network-timeout-seconds', '--debug-trace-enabled']
METAVAR = 'INPUT-ARTIFACT-WITH-LONG-NAME'
@click.command()
@click.argument('artifact', metavar=METAVAR)
@click.option('--output-file-path', default='result.json', help='Write to the output-file-path without losing the hyphenated-name.')
def cli(artifact, output_file_path):
    click.echo(json.dumps({'artifact': artifact, 'output': output_file_path}))

results=[]
for width in [35,65]:
    f=click.HelpFormatter(width=width)
    f.write_usage('program', ' '.join(OPTIONS))
    output=f.getvalue()
    results.append({'case':f'usage-{width}', 'tokens_intact':all(token in output for token in OPTIONS), 'text':output})
    r=CliRunner().invoke(cli,['--help'],terminal_width=width)
    results.append({'case':f'cli-help-{width}', 'exit':r.exit_code,'tokens_intact':METAVAR in r.output and 'hyphenated-name' in r.output, 'text':r.output})
    token='a-very-long-artifact-name-that-is-wider-than-the-available-line-budget'
    text=click.wrap_text('Read '+token+' next',width=width)
    results.append({'case':f'long-word-{width}', 'tokens_intact':token in text, 'text':text, 'max_line':max(map(len,text.splitlines()))})
r=CliRunner().invoke(cli,['input.json','--output-file-path','chosen.json'])
assert r.exit_code==0 and json.loads(r.output)=={'artifact':'input.json','output':'chosen.json'}
results.append({'case':'real-command','exit':r.exit_code,'result':json.loads(r.output)})
print(json.dumps({'source':str(Path(click.__file__).resolve()),'python':sys.version.split()[0],'results':results},indent=2))
