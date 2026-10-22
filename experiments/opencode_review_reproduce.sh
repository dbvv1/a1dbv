#!/bin/sh
# Usage: sh experiments/opencode_review_reproduce.sh /absolute/path/to/verified-v1.13.3-binary
# Keeps a tiny synthetic repo + raw evidence in the printed temporary directory.
exec /usr/bin/env -i PATH=/usr/bin:/bin /bin/sh -s -- "$@" <<'CLEAN_ENV'
set -eu
OCR=$1
case "$OCR" in /*) ;; *) echo 'Provide an absolute binary path' >&2; exit 2;; esac
printf '%s  %s\n' '843be0e56fdff0a5ca6f86c5866f942d6a372dff1c0ca19e7893d72495abf45c' "$OCR" | sha256sum -c - >&2
ROOT=$(mktemp -d /tmp/ocr-negation.XXXXXX)
mkdir -p "$ROOT/home" "$ROOT/repo/src"
export HOME="$ROOT/home" PATH=/usr/bin:/bin LANG=C.UTF-8 GIT_CONFIG_NOSYSTEM=1
cd "$ROOT/repo"
git init -q
git config user.name 'Synthetic Trial'
git config user.email 'trial@example.invalid'
printf 'package example\nfunc Value() int { return 1 }\n' > src/a.go
git add . && git commit -qm base
BASE=$(git rev-parse HEAD)
printf 'package example\nfunc Value() int { return 2 }\n' > src/a.go
printf '/*/\n!/src/\n' > .gitignore
git add . && git commit -qm head
HEAD=$(git rev-parse HEAD)
MB=$(git merge-base "$BASE" "$HEAD")
git --no-pager diff --no-ext-diff --no-textconv --no-color --name-status -z "$MB..$HEAD" -- > "$ROOT/git-name-status.z"
env -i HOME="$HOME" PATH="$PATH" LANG="$LANG" GIT_CONFIG_NOSYSTEM=1 "$OCR" delegate preview --format json --from "$BASE" --to "$HEAD" > "$ROOT/preview.json"
printf 'BASE=%s\nHEAD=%s\nROOT=%s\n' "$BASE" "$HEAD" "$ROOT"
cat "$ROOT/preview.json"
CLEAN_ENV
