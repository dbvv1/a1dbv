#!/usr/bin/env bash
# Replay the existing SvelteKit consumer evidence; no browser session or model is launched.
set -euo pipefail

case_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
work="$(mktemp -d)"
printf 'Evidence directory: %s\n' "$work"
rev=7dea2077f4851e7709b68db11eb6f3e02c0dfa46
lock=505d7986f1445d4d3eb5cc42244d260b07490daf90debc5822833144ed612a2e
mkdir -p "$work/home" "$work/tools"
: > "$work/user.npmrc"
: > "$work/global.npmrc"
export HOME="$work/home" SVELTE_TEST_TOOLS="$work/tools"
npm_cmd=(npm --userconfig "$work/user.npmrc" --globalconfig "$work/global.npmrc" --cache "$work/npm-cache")
git init -q "$work/source"
git -C "$work/source" remote add origin https://github.com/davidbaranek/sveltekit-demo.git
git -C "$work/source" fetch -q --depth=1 origin "$rev"
test "$(git -C "$work/source" rev-parse FETCH_HEAD)" = "$rev"
"${npm_cmd[@]}" --prefix "$SVELTE_TEST_TOOLS" install --ignore-scripts --no-audit --no-fund jsdom@26.1.0 >"$work/install-tools.log" 2>&1

run() {
  local name="$1" dir="$2" want="$3" marker="$4" code=0
  shift 4
  (cd "$dir" && "$@") > "$work/$name.log" 2>&1 || code=$?
  if [ "$code" != "$want" ] || ! grep -Fq "$marker" "$work/$name.log"; then
    cat "$work/$name.log" >&2
    printf 'Unexpected result: %s, exit %s (expect %s and %s)\n' "$name" "$code" "$want" "$marker" >&2
    return 1
  fi
  printf '%s: exit %s; %s\n' "$name" "$code" "$marker"
}

for side in base patched; do
  app="$work/$side"
  git -C "$work/source" worktree add -q --detach "$app" "$rev"
  (cd "$app" && node -e 'const [fs, crypto]=[require("node:fs"),require("node:crypto")]; if(crypto.createHash("sha256").update(fs.readFileSync("package-lock.json")).digest("hex")!==process.argv[1]) process.exit(1)' "$lock")
  if [ "$side" = patched ]; then
    git -C "$app" apply "$case_dir/refetch-loading.patch"
  fi
  (cd "$app" && "${npm_cmd[@]}" ci --ignore-scripts --no-audit --no-fund) >"$work/install-$side.log" 2>&1
  (cd "$app" && "${npm_cmd[@]}" run build) >"$work/build-$side.log" 2>&1
  printf '%s: production build exit 0\n' "$side"
  cp "$case_dir"/{preflight,preflight-check,trial,server-check}.mjs "$app/"
done

run preflight "$work/base" 0 'PASS prerequisites' node preflight-check.mjs
run base-red "$work/base" 1 'Next must be disabled while the existing rows are pending' node trial.mjs
run base-observe "$work/base" 0 'BASELINE FAILURE CONFIRMED: pending controls remain enabled; old row retained' node trial.mjs --baseline
run patched-green "$work/patched" 0 'PASS rejection enters existing failure boundary' node trial.mjs
run patched-server "$work/patched" 0 'PASS server render preserves existing initial pending markup' node server-check.mjs
