#!/usr/bin/env bash
set -euo pipefail
SOURCE_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
RUN_DIR=$(mktemp -d "${TMPDIR:-/tmp}/browserless-heap.XXXXXXXX")
mkdir -p "$RUN_DIR/home" "$RUN_DIR/npm-cache"
cp "$SOURCE_DIR/browserless-heap-capture.mjs" "$RUN_DIR/capture.mjs"
cp "$SOURCE_DIR/browserless-heap-plugin.mjs" "$RUN_DIR/plugin.mjs"
cp "$SOURCE_DIR/browserless-heap-client.py" "$RUN_DIR/trial.py"
cd "$RUN_DIR"
# Keep only transport proxy/CA settings needed by this environment, not credentials.
NPM_ENV=("PATH=$PATH" "HOME=$RUN_DIR/home" "npm_config_cache=$RUN_DIR/npm-cache")
for key in HTTP_PROXY HTTPS_PROXY ALL_PROXY NO_PROXY http_proxy https_proxy all_proxy no_proxy NODE_EXTRA_CA_CERTS SSL_CERT_FILE SSL_CERT_DIR npm_config_cafile; do
  if [[ -v "$key" ]]; then NPM_ENV+=("$key=${!key}"); fi
done
env -i "${NPM_ENV[@]}" npm pack chrome-devtools-mcp@1.12.0 --ignore-scripts --json > package-metadata.json
python3 - <<'PY'
from pathlib import Path
import base64,hashlib,json
expected='sha512-lAGpH0zXT1ZdaPefP1KK/MvxwihOlu7VGQ7p4wbhD9OhN17vUC4KWk/ImUYR9DE4s+7r4r0ySV4xr2OkTa7ZMA=='
actual='sha512-'+base64.b64encode(hashlib.sha512(Path('chrome-devtools-mcp-1.12.0.tgz').read_bytes()).digest()).decode()
if actual != expected: raise SystemExit('Package integrity mismatch; stopping before execution')
Path('integrity.json').write_text(json.dumps({'integrity':actual,'matches':True},indent=2))
PY
tar -xzf chrome-devtools-mcp-1.12.0.tgz
env -i PATH="$PATH" HOME="$RUN_DIR/home" timeout 30 node --max-old-space-size=256 --expose-gc capture.mjs > capture.jsonl
env -i PATH="$PATH" HOME="$RUN_DIR/home" timeout 90 python3 trial.py > trial-output.txt
printf 'Completed. Local artifacts: %s\n' "$RUN_DIR"
printf 'Raw heaps remain local. Share only reviewed, sanitized summaries.\n'
