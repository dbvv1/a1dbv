#!/usr/bin/env bash
# Rebuild a fixed public FactorioLab Angular 21 consumer check in a new directory.
set -euo pipefail
SOURCE=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
[[ $# == 1 && ! -e "$1" && ! -L "$1" ]] || { echo 'Usage: bash run.sh NEW_ABSOLUTE_DIRECTORY (must not exist)' >&2; exit 2; }
[[ "$1" == /* ]] || { echo 'Use an absolute directory.' >&2; exit 2; }
[[ "$1" != *[[:space:]]* ]] || { echo 'Whitespace paths are unsupported by this replay entry.' >&2; exit 2; }
for cmd in git node npm python3 timeout sha256sum; do command -v "$cmd" >/dev/null; done
node -e 'if(+process.versions.node.split(".")[0]!==24)throw Error("Use Node 24; verified with 24.22.1")'
RESOLVED=$(python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$1")
[[ "$RESOLVED" != *[[:space:]]* ]] || { echo 'Resolved path contains whitespace; choose a direct path.' >&2; exit 2; }
mkdir -- "$1"
ROOT=$(cd "$1" && pwd)
export npm_config_cache="$ROOT/npm-cache" NG_CLI_ANALYTICS=false
export npm_config_audit=false npm_config_fund=false
exec > >(tee "$ROOT/run.log") 2>&1
trap 's=$?; echo "RUN_EXIT=$s"' EXIT
SHA=f785e10becb84afd1fe546ac5b4098271207aabd
git init -q "$ROOT/project"
git -C "$ROOT/project" remote add origin https://github.com/factoriolab/factoriolab.git
timeout 120 git -C "$ROOT/project" fetch --depth=1 origin "$SHA"
git -C "$ROOT/project" checkout -q --detach FETCH_HEAD
[[ $(git -C "$ROOT/project" rev-parse HEAD) == "$SHA" ]]
cd "$ROOT/project"
sha256sum package-lock.json > "$ROOT/original-lock.sha256"
timeout 180 npm ci --no-audit --no-fund
mkdir "$ROOT/provider"
cp "$SOURCE/provider/package.json" "$SOURCE/provider/package-lock.json" "$ROOT/provider/"
(cd "$ROOT/provider" && timeout 120 npm ci --ignore-scripts --no-audit --no-fund)
[[ ! -e node_modules/jsdom ]] || { echo 'Unexpected existing jsdom; stopping' >&2; exit 2; }
ln -s "$ROOT/provider/node_modules/jsdom" node_modules/jsdom
cp "$SOURCE/vitest-node.config.mjs" "$SOURCE/no-listen.cjs" .
python3 "$SOURCE/configure.py" "$ROOT/project"
sha256sum -c "$ROOT/original-lock.sha256"
sha256sum -c "$SOURCE/consumers.sha256"
node - <<'JS'
for(const [n,v] of Object.entries({'@angular/core':'21.2.12','@angular/build':'21.2.10','@angular/cli':'21.2.10','typescript':'5.9.3','vitest':'4.1.5','jsdom':'31.0.0'})) {
 const actual=require(n+'/package.json').version; console.log(n,actual);if(actual!==v)throw Error(n+' expected '+v);
}
JS
NODE_OPTIONS="--require=$ROOT/project/no-listen.cjs" timeout 120 node node_modules/@angular/cli/bin/ng.js run factoriolab:test-node
python3 "$SOURCE/verify-results.py" "$ROOT/project/consumer-results.json"
sha256sum -c "$SOURCE/consumers.sha256"
sha256sum -c "$ROOT/original-lock.sha256"
