#!/bin/sh
set -eu
cd "$(dirname "$0")"
if [ -d world ]; then
  echo 'Use a fresh trial directory or preserve and move world/ before replay.' >&2
  exit 2
fi
mkdir -p home cache
for phase in create reopen reopen-rollback boundaries without-checks; do
  env -i PATH=/usr/bin:/bin HOME="$PWD/home" XDG_CACHE_HOME="$PWD/cache" SBCL_HOME="$PWD/runtime/usr/lib/sbcl" timeout 45 ./runtime/usr/bin/sbcl --noinform --script jiti-stateful-trial.lisp "$phase" > "$phase.log" 2>&1
  grep -E '^PHASE|^PASS|^SUCCESS' "$phase.log"
  grep -q "^SUCCESS $phase " "$phase.log"
done
