#!/usr/bin/env bash
# Replay the accepted cattrs wheel-consumer comparison in a fresh POSIX workspace.
set -euo pipefail

case_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
python="${PYTHON312:-python3.12}"
"$python" -c 'import sys; assert sys.version_info[:2] == (3, 12)'
command -v uv >/dev/null
work="$(mktemp -d)"
printf 'Evidence: %s\n' "$work"
export PYTHONNOUSERSITE=1 UV_CACHE_DIR="$work/uv-cache"
unset PYTHONPATH
base=e9239b7082206f18e3cec873b11451aff35beb9c
candidate=2e883761ca61b076c3de45a5d976952226347c2c
common=bde101a5a67997c61a3ee0e971386a82fe141d4e
src="$work/source"
git init -q "$src"
git -C "$src" remote add origin https://github.com/python-attrs/cattrs.git
git -C "$src" fetch -q --depth=10 origin "$base" "$candidate"
test "$(git -C "$src" merge-base "$base" "$candidate")" = "$common"
test "$(git -C "$src" rev-list --count "$candidate..$base")" = 6
test "$(git -C "$src" rev-list --count "$base..$candidate")" = 1
git -C "$src" worktree add -q --detach "$work/base" "$base"
git -C "$src" worktree add -q --detach "$work/candidate" "$candidate"
git -C "$src" worktree add -q --detach "$work/integrated" "$base"
# Fixed replay only: the original replay had one changelog conflict.
# Keep main's changelog, add just the original PR's Decimal entry.
git -C "$src" diff --binary "$common" "$candidate" -- . ':!HISTORY.md' |
  git -C "$work/integrated" apply --index
"$python" - "$work/integrated/HISTORY.md" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
s = p.read_text()
marker = "## NEXT\n\n"
assert s.count(marker) == 1 and "typed deque" in s
addition = ("- The json and pyyaml preconfigured converters now support `Decimal`, "
            "serializing it as a string so precision is preserved.\n"
            "  ([#761](https://github.com/python-attrs/cattrs/issues/761))\n")
assert addition not in s
p.write_text(s.replace(marker, marker + addition))
PY
git -C "$work/integrated" add HISTORY.md
git -C "$work/integrated" diff --cached --check
printf 'variant\tsource_commit\tsource_tree\twheel_sha256\n' > "$work/builds.tsv"
# Use the Windows receipt's exact top-level dependencies on all three wheels.
mapfile -t deps < <("$python" - "$case_dir/results/metadata.json" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as f:
    deps = json.load(f)["environment"]["installed_dependencies"]
for k, v in deps.items():
    print(f"{k}=={v}")
PY
)
test "${#deps[@]}" -gt 10
for tree in base candidate integrated; do
  wt="$work/$tree"
  mkdir "$work/wheel-$tree"
  (cd "$wt" && uv build --wheel --out-dir "$work/wheel-$tree") > "$work/build-$tree.log" 2>&1
  wheels=("$work/wheel-$tree/"*.whl)
  test "${#wheels[@]}" = 1 && test -f "${wheels[0]}"
  uv venv --python "$(command -v "$python")" "$work/venv-$tree"
  py="$work/venv-$tree/bin/python"
  uv pip install --python "$py" "${deps[@]}"
  uv pip install --python "$py" --no-deps "${wheels[0]}"
  "$py" -c 'import cattrs, pathlib, sys; origin = pathlib.Path(cattrs.__file__).resolve(); assert origin.is_relative_to(pathlib.Path(sys.prefix).resolve()); print(origin)' > "$work/import-$tree.log"
  hash="$("$python" -c 'import hashlib, pathlib, sys; print(hashlib.sha256(pathlib.Path(sys.argv[1]).read_bytes()).hexdigest())' "${wheels[0]}")"
  printf '%s\t%s\t%s\t%s\n' "$tree" "$(git -C "$wt" rev-parse HEAD)" "$(git -C "$wt" write-tree)" "$hash" >> "$work/builds.tsv"
done

run_check() {
  local label="$1" dir="$2" expected="$3" summary="$4"
  shift 4
  local code=0
  (cd "$dir" && "$@") > "$work/$label.log" 2>&1 || code=$?
  if [ "$code" != "$expected" ] || ! grep -Fq "$summary" "$work/$label.log"; then
    cat "$work/$label.log" >&2
    echo "Unexpected result: $label (exit $code; expected $expected and $summary)" >&2
    return 1
  fi
  printf '%s: exit %s; %s\n' "$label" "$code" "$summary"
}
for tree in base candidate integrated; do
  py="$work/venv-$tree/bin/python"
  if [ "$tree" = base ]; then
    run_check "$tree-decimal" "$work" 1 '22 failed, 2 passed' "$py" -m pytest "$case_dir/consumer/test_decimal_consumer.py" -q -p no:cacheprovider
    grep -Eq 'Object of type Decimal is not JSON serializable|cannot represent an object.*Decimal' "$work/$tree-decimal.log"
  else
    run_check "$tree-decimal" "$work" 0 '24 passed' "$py" -m pytest "$case_dir/consumer/test_decimal_consumer.py" -q -p no:cacheprovider
  fi
  if [ "$tree" = candidate ]; then
    run_check "$tree-deque" "$work/base" 1 '6 failed, 5 passed' "$py" -m pytest tests/preconf/test_msgspec_cpython.py -q -p no:cacheprovider -k deque
    grep -Fq 'Encoding objects of type collections.deque is unsupported' "$work/$tree-deque.log"
  else
    run_check "$tree-deque" "$work/base" 0 '11 passed' "$py" -m pytest tests/preconf/test_msgspec_cpython.py -q -p no:cacheprovider -k deque
  fi
done
