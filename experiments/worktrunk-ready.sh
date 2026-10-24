#!/usr/bin/env bash
# Run from an EMPTY disposable directory. Requires Linux x86_64, curl, tar,
# sha256sum, Python 3, Git, Node and npm. No shell profile or global config edits.
set -euo pipefail
# Enforce the disposable-directory contract before ANY writes.
if [ -n "$(find . -mindepth 1 -maxdepth 1 -print -quit)" ]; then
  printf 'Refusing: run from an empty disposable directory, with this script outside it.\n' >&2
  exit 64
fi
# Re-exec without account/npm/Git credential configuration inherited from the host.
# Retain only executable lookup and transport proxy/CA settings, without printing them.
if [ "${1-}" != --clean-env ]; then
  clean_env=("PATH=$PATH")
  for name in HTTP_PROXY HTTPS_PROXY ALL_PROXY NO_PROXY http_proxy https_proxy all_proxy no_proxy SSL_CERT_FILE SSL_CERT_DIR NODE_EXTRA_CA_CERTS; do
    if [ "${!name+x}" ]; then clean_env+=("$name=${!name}"); fi
  done
  exec env -i "${clean_env[@]}" bash "$0" --clean-env
fi
shift
ROOT="$PWD"
export HOME="$ROOT/home" XDG_CONFIG_HOME="$ROOT/home/.config"
export npm_config_cache="$ROOT/npm-cache" npm_config_userconfig=/dev/null
mkdir -p "$HOME" fixture/.config
curl -fsSL https://github.com/max-sixty/worktrunk/releases/download/v0.81.0/worktrunk-x86_64-unknown-linux-musl.tar.xz -o worktrunk.tar.xz
echo '0c253f216985ce9cd7b202a11606b5ce6aa934b1019fd1fbb9b7ce2b47b1c74a  worktrunk.tar.xz' | sha256sum -c -
tar -xf worktrunk.tar.xz
export PATH="$ROOT/worktrunk-x86_64-unknown-linux-musl:$PATH"
wt --version
cd fixture
git init -q -b main
git config user.name Trial
git config user.email trial@example.invalid
printf 'node_modules/\n.env\n.ready\n' > .gitignore
printf 'node_modules/\n' > .worktreeinclude
printf '[pre-start]\ncopy = "wt step copy-ignored --require-include"\n' > .config/wt.toml
printf '{"name":"worktree-dependency-fixture","private":true,"scripts":{"test":"node test.cjs"},"dependencies":{"semver":"7.7.3"}}\n' > package.json
cat > test.cjs <<'JS'
const assert = require('node:assert/strict');
const semver = require('semver');
assert.equal(semver.satisfies('2.3.4', '^2.0.0'), true);
assert.equal(semver.satisfies('3.0.0', '^2.0.0'), false);
console.log('PASS: semver consumer');
JS
npm install --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org
npm test
git add .; git commit -qm fixture
printf 'SYNTHETIC_ENV_DO_NOT_COPY=1\n' > .env
# -y is justified only because every hook in this isolated fixture is ours.
wt switch --create trial-a --path ../tree-a --no-cd --yes --execute npm -- test
set +e
wt --config-set 'pre-start.fail = "exit 23"' switch --create trial-b --path ../tree-b --no-cd --yes --execute node -- -e 'require("fs").writeFileSync(".ready", "executed")'
rc=$?
set -e
[ "$rc" -eq 23 ]; [ ! -e ../tree-b/.ready ]
# Creation failed AFTER creating the worktree. Switching to it does not rerun
# pre-start automatically. Repair/re-run the preparation, then start testing.
wt -C ../tree-b hook pre-start --yes
wt switch trial-b --no-cd --yes --execute npm -- test
[ ! -e ../tree-a/.env ]; [ ! -e ../tree-b/.env ]
cd "$ROOT"
python3 - <<'PY'
import hashlib, pathlib
paths=[pathlib.Path(p)/'node_modules/semver/functions/satisfies.js' for p in ['fixture','tree-a','tree-b']]
before=[hashlib.sha256(p.read_bytes()).hexdigest() for p in paths]
assert len(set(before))==1
assert len({p.stat().st_ino for p in paths})==3
paths[1].write_text('module.exports = () => false;\n')
assert hashlib.sha256(paths[0].read_bytes()).hexdigest()==before[0]
assert hashlib.sha256(paths[2].read_bytes()).hexdigest()==before[2]
PY
set +e
(cd tree-a && npm test)
rc=$?
set -e
[ "$rc" -ne 0 ]
(cd tree-b && npm test)
(cd fixture && npm test)
wt -C tree-a step copy-ignored --require-include
python3 - <<'PY'
from pathlib import Path
assert Path('tree-a/node_modules/semver/functions/satisfies.js').read_text()=='module.exports = () => false;\n'
PY
printf 'PASS: prepared tests, failed-start gate, manual recovery, isolated dependency mutation, existing-file preservation\n'
