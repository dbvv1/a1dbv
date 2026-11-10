import json
import pathlib
import sys
p = pathlib.Path(sys.argv[1]) / 'angular.json'
data = json.loads(p.read_text())
targets = data['projects']['factoriolab']['architect']
if 'test-node' in targets:
    raise SystemExit('Refusing to replace existing test-node target')
targets['test-node'] = {
    'builder': '@angular/build:unit-test',
    'options': {
        'buildTarget': 'factoriolab:build:development',
        'tsConfig': 'tsconfig.spec.json', 'runner': 'vitest',
        'runnerConfig': 'vitest-node.config.mjs',
        'include': ['components/button/button.spec.ts', 'state/router/migration.spec.ts'],
        'watch': False, 'ui': False, 'debug': False,
        'reporters': ['default', ['json', {'outputFile': 'consumer-results.json'}]],
    },
}
p.write_text(json.dumps(data, indent=2) + '\n')
