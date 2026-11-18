# Reproducible commands

Placeholders:

- `$REPO`: this worktree root (contains `artifacts/`).
- `$SCRATCH`: the task-isolated temp directory.
- `$PY312`: a native CPython 3.12 executable.

No local absolute path, credential, or private address is needed.

## 1. Fixed sources

```bash
git clone --filter=blob:none https://github.com/python-attrs/cattrs.git "$SCRATCH/cattrs-src"
cd "$SCRATCH/cattrs-src"
git fetch origin e9239b7082206f18e3cec873b11451aff35beb9c
git fetch origin pull/822/head:pr822
git rev-parse pr822
# 2e883761ca61b076c3de45a5d976952226347c2c (matches the task's PR head)
git merge-base e9239b7082206f18e3cec873b11451aff35beb9c pr822
# bde101a5a67997c61a3ee0e971386a82fe141d4e (PR is based 6 main commits behind the task base)
```

## 2. Integrate the old PR onto the task base

```bash
cd "$SCRATCH/cattrs-src"
git checkout -b integ e9239b7082206f18e3cec873b11451aff35beb9c
git cherry-pick 2e883761ca61b076c3de45a5d976952226347c2c
# HISTORY.md conflicts in the NEXT section; keep both entries:
#   - the PR's Decimal entry
#   - main's newer msgspec typed-deque entry
git add HISTORY.md
git cherry-pick --continue
git rev-parse HEAD
# 653efccbf73ab5890d7480986e3815e14ae707f4
```

## 3. Build one wheel per tree

```bash
"$PY312" -m venv "$SCRATCH/venv-tools"
"$SCRATCH/venv-tools/Scripts/python.exe" -m pip install build
git -C "$SCRATCH/cattrs-src" worktree add --detach "$SCRATCH/wt-base" e9239b7082206f18e3cec873b11451aff35beb9c
git -C "$SCRATCH/cattrs-src" worktree add --detach "$SCRATCH/wt-pr" pr822
git -C "$SCRATCH/cattrs-src" worktree add --detach "$SCRATCH/wt-integ" integ
for tree in base pr integ; do
  (cd "$SCRATCH/wt-$tree" && \
   "$SCRATCH/venv-tools/Scripts/python.exe" -m build --wheel --outdir "$SCRATCH/wheels")
done
```

Produced wheels and SHA-256 (recorded in `results/metadata.json`):

- `cattrs-26.2.2.dev20-py3-none-any.whl` (base): `d6ff46ed512e2fadd4d69b46168b5ad5401b7705d60aa38c41b47801e62f496e`
- `cattrs-26.2.2.dev15-py3-none-any.whl` (PR head): `cddf4ff40e82f35b64cc72bc6c5293171ed6dbd571cfd5d3cc7fcd97ea3e60d0`
- `cattrs-26.2.2.dev21-py3-none-any.whl` (integrated): `a8a1235a7ec0f71dd73b37d3bf145f4e44287e72574ff4dfef13bb8d24ad6a6b`

## 4. Install each wheel in its own fresh environment

```bash
for tree in base pr integ; do
  "$PY312" -m venv "$SCRATCH/venv-$tree"
  "$SCRATCH/venv-$tree/Scripts/python.exe" -m pip install \
    "attrs>=25.4.0" "typing-extensions>=4.14.0" "PyYAML>=6.0" \
    pytest hypothesis pytest-benchmark msgpack msgspec ujson orjson \
    tomlkit tomli-w cbor2 pymongo
done
"$SCRATCH/venv-base/Scripts/python.exe"  -m pip install --no-deps --force-reinstall "$SCRATCH/wheels/cattrs-26.2.2.dev20-py3-none-any.whl"
"$SCRATCH/venv-pr/Scripts/python.exe"    -m pip install --no-deps --force-reinstall "$SCRATCH/wheels/cattrs-26.2.2.dev15-py3-none-any.whl"
"$SCRATCH/venv-integ/Scripts/python.exe" -m pip install --no-deps --force-reinstall "$SCRATCH/wheels/cattrs-26.2.2.dev21-py3-none-any.whl"
```

## 5. Same consumer against each wheel

```bash
CONSUMER="$REPO/artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/consumer/test_decimal_consumer.py"
run_consumer() {  # $1 = source-tree label, $2 = result label
  "$SCRATCH/venv-$1/Scripts/python.exe" "$CONSUMER" \
    --json "$REPO/artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/results/$2.json" \
    --label "$2"
}
run_consumer base base
run_consumer pr pr-head
run_consumer integ integrated

for tree in base pr integ; do
  (cd "$REPO/artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/consumer" && \
   "$SCRATCH/venv-$tree/Scripts/python.exe" -m pytest test_decimal_consumer.py -q)
done
```

## 6. Native checks of cattrs itself

Run from each source tree so the tree's tests are used, while `cattrs` is
imported from the installed wheel (`src/` layout, no top-level package):

```bash
for tree in base pr integ; do
  (cd "$SCRATCH/wt-$tree" && \
   "$SCRATCH/venv-$tree/Scripts/python.exe" -m pytest tests/test_preconf.py -q -p no:cacheprovider)
done

# Main's typed-deque regression (base_ref test file) against each wheel:
for tree in base pr integ; do
  (cd "$SCRATCH/wt-base" && \
   "$SCRATCH/venv-$tree/Scripts/python.exe" -m pytest tests/preconf/test_msgspec_cpython.py -q -p no:cacheprovider -k deque)
done
```

Observed exit codes: consumer pytest base 1 (22 failed, 2 passed), PR head 0
(24 passed), integrated 0 (24 passed). `test_preconf.py` all 0 (61/65/65
passed, 22 skipped each). Deque check base 0 (11 passed), PR head 1 (6 failed,
5 passed), integrated 0 (11 passed).