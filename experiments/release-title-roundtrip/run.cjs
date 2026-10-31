const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const titlePath = 'build/src/util/pull-request-title.js';

function titleImplementation(source) {
  const startMarker = "const DEFAULT_PR_TITLE_PATTERN = 'chore${scope}: release${component} ${version}';";
  const endMarker = 'exports.PullRequestTitle = PullRequestTitle;';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < start || source.indexOf(startMarker, start + 1) !== -1) {
    throw new Error('Expected exactly one known title implementation');
  }
  return source.slice(start, end + endMarker.length);
}

function inspectPackage(root, expectedVersion) {
  const absolute = path.resolve(root);
  const metadata = JSON.parse(fs.readFileSync(path.join(absolute, 'package.json'), 'utf8'));
  if (metadata.name !== 'release-please' || metadata.version !== expectedVersion) {
    throw new Error(`Expected release-please ${expectedVersion}`);
  }
  const source = fs.readFileSync(path.join(absolute, titlePath), 'utf8');
  return {absolute, version: metadata.version, source};
}

function probe(oldRoot, newRoot, actionRoot) {
  if (!oldRoot || !newRoot || !actionRoot) {
    throw new Error('Usage: node run.cjs OLD_PACKAGE_ROOT NEW_PACKAGE_ROOT ACTION_V5_ROOT');
  }
  const old = inspectPackage(oldRoot, '17.6.0');
  const updated = inspectPackage(newRoot, '17.11.2');
  const action = path.resolve(actionRoot);
  const metadata = JSON.parse(fs.readFileSync(path.join(action, 'package.json'), 'utf8'));
  const lock = JSON.parse(fs.readFileSync(path.join(action, 'package-lock.json'), 'utf8'));
  if (metadata.name !== 'release-please-action' || metadata.version !== '5.0.0' ||
      lock.packages['node_modules/release-please'].version !== old.version) {
    throw new Error('Expected release-please-action 5.0.0 with release-please 17.6.0');
  }
  const bundle = fs.readFileSync(path.join(action, 'dist/index.js'), 'utf8');
  if (titleImplementation(bundle) !== titleImplementation(old.source)) {
    throw new Error('Action bundle and installed title implementation differ');
  }
  const cases = [
    {name: 'plain-control', suffix: ''},
    {name: 'author-single-marker', suffix: ' [skip tests]'},
    {name: 'author-original-two-markers', suffix: ' [skip unit] [skip e2e]'},
  ];
  const rows = [];
  for (const pkg of [old, updated]) {
    // Load only the published pure title/version modules, never the CLI or Action entry.
    const {PullRequestTitle} = require(path.join(pkg.absolute, titlePath));
    const {Version} = require(path.join(pkg.absolute, 'build/src/version.js'));
    for (const fixture of cases) {
      const pattern = 'chore: release${component} ${version}' + fixture.suffix;
      const generated = PullRequestTitle.ofComponentVersion('site', Version.parse('7.2.0'), pattern).toString();
      const parsed = PullRequestTitle.parse(generated, pattern);
      const decoded = parsed ? {
        component: parsed.getComponent(),
        version: parsed.getVersion()?.toString(),
      } : null;
      rows.push({version: pkg.version, case: fixture.name, pattern, generated, decoded,
        roundTrip: decoded?.component === 'site' && decoded?.version === '7.2.0'});
    }
  }
  return {
    node: process.version,
    scope: 'Published npm title/version modules; Action title implementation compared byte-for-byte, not executed',
    actionBundleSha256: hash(bundle),
    matchingTitleImplementationSha256: hash(titleImplementation(bundle)),
    modules: [old, updated].map(pkg => ({version: pkg.version, titleModuleSha256: hash(pkg.source)})),
    rows,
    roundTripFailures: rows.filter(row => !row.roundTrip).length,
  };
}

module.exports = {probe, titleImplementation};
if (require.main === module) {
  try {
    if (process.argv.length !== 5) throw new Error('Usage: node run.cjs OLD_PACKAGE_ROOT NEW_PACKAGE_ROOT ACTION_V5_ROOT');
    const result = probe(...process.argv.slice(2));
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exitCode = result.roundTripFailures ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
