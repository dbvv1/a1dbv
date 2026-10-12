# CLAUDE.md

Guidance for AI coding agents working in this repository. Read this before making changes.

## 1. Project overview

**Tomli** (`tomli` on PyPI, current version `2.5.0`) is a small, pure-Python, zero-dependency
parser for [TOML](https://toml.io). It exposes three public names: `loads`, `load`, and
`TOMLDecodeError`. It is the upstream of the standard-library `tomllib` module (added in
Python 3.11 via PEP 680). Tomli is also built as binary wheels with
[mypyc](https://github.com/mypyc/mypyc) for speed.

Key facts:

- **Spec version:** TOML **v1.1.0** since 2.4.0. Versions before 2.4 target TOML v1.0.0.
  Features implemented that are specific to 1.1 include `\e` and `\xHH` string escapes,
  optional seconds in local times / datetimes, and newlines inside inline tables.
- **Supported Python:** `>=3.8` (see `requires-python`). Code must stay 3.8-compatible.
  CI also runs PyPy 3.11 and 3.15-dev (the latter is allowed to fail).
- **Zero runtime dependencies.** Do not add any dependency to `src/tomli`.
- **Read-only by design.** There is no `dumps`/`dump` in this package. Writing lives in the
  separate `tomli-w` project, which the fuzzer and `scripts/use_setuptools.py` use.
- **Output** is plain builtins plus `datetime` types: `dict`, `list`, `str`, `int`, `float`,
  `bool`, `datetime.datetime`, `datetime.date`, `datetime.time`. No comments or formatting
  are preserved.
- Error *messages* are informational only and may change between releases. Error *types* and
  the `msg`/`doc`/`pos`/`lineno`/`colno` attributes are the stable contract.

## 2. Repository layout

```
.
├── src/tomli/              # THE PACKAGE (the only code that ships in wheels)
│   ├── __init__.py         # Public API + __version__ (bumped by bump2version)
│   ├── _parser.py          # Parser, Flags/NestedDict bookkeeping, TOMLDecodeError
│   ├── _re.py              # Regexes + converters for numbers, dates, times
│   ├── _types.py           # Type aliases only (ParseFloat, Key, Pos)
│   └── py.typed            # PEP 561 marker; keep it
├── tests/                  # unittest suite (run with `python -m unittest`)
│   ├── __init__.py         # Aliases `tomli` as `tomllib` for the test package
│   ├── test_data.py        # Runs every tests/data/**/*.toml through the parser
│   ├── test_error.py       # Exact error messages, positions, deprecated args
│   ├── test_misc.py        # load(), parse_float, deepcopy, recursion limits, lazy import
│   ├── burntsushi.py       # Converter between Python values and toml-test "tagged" JSON
│   └── data/
│       ├── valid/          # *.toml + matching *.json (expected, tagged format)
│       └── invalid/        # *.toml that must raise TOMLDecodeError
│           # Both trees contain an _external/toml-test/ subtree (vendored, see §9)
├── benchmark/              # Perf comparison vs rtoml, pytomlpp, toml, tomlkit (data.toml)
├── fuzzer/fuzz.py          # Atheris fuzzer with round-trip check via tomli-w
├── profiler/profiler_script.py  # cProfile workload (1000x parse of benchmark/data.toml)
├── scripts/
│   ├── mypyc_tox           # Wrapper: temporarily switch to setuptools+mypyc, run tox, restore
│   ├── use_setuptools.py   # Rewrites [build-system] in pyproject.toml to setuptools+mypyc
│   └── requirements.txt    # tomli-w (needed by use_setuptools.py)
├── pyproject.toml          # Build metadata, tox envs, isort/mypy/coverage config
├── setup.py                # Adds mypyc ext_modules ONLY when TOMLI_USE_MYPYC=1
├── .flake8                 # flake8 config
├── .pre-commit-config.yaml # All linters/formatters
├── .bumpversion.cfg        # Version bump + commit + tag configuration
├── .github/workflows/tests.yaml  # CI definition
├── tomllib.md              # Runbook for syncing this code into CPython's Lib/tomllib
├── CHANGELOG.md, README.md, LICENSE, LICENSE-HEADER, MANIFEST.in
```

## 3. Architecture of each module

### 3.1 `src/tomli/__init__.py`

- Declares `__all__ = ("loads", "load", "TOMLDecodeError")` and `__version__`.
- Re-exports those three names from `._parser`. Nothing else is public.
- The `__version__` line carries a `DO NOT EDIT THIS LINE MANUALLY` comment. See §8.

### 3.2 `src/tomli/_parser.py` (the core, ~800 lines)

The parser is a hand-written, index-based, recursive-descent parser over a single `str`.
Every parsing function has the shape `f(src, pos, ...) -> (new_pos, value)` (or
`-> new_pos` for rules that only mutate state). There is no tokenizer and no AST.

**Entry points**

- `loads(s, *, parse_float=float) -> dict`: rejects non-`str` with `TypeError`. Normalizes
  `"\r\n"` to `"\n"` (the spec allows it, and it simplifies parsing). Then loops
  statement-by-statement: skip leading whitespace, dispatch on the first char
  (`KEY_INITIAL_CHARS` -> key/value rule, `[[` -> `create_list_rule`, `[` ->
  `create_dict_rule`, `#` -> comment, `\n` -> blank), skip the comment, and require a
  newline or EOF.
- `load(fp, *, parse_float=float)`: reads bytes, decodes UTF-8, and delegates to `loads`.
  A text-mode file raises `TypeError` with a "must be opened in binary mode" message.

**State: `Output`**

`Output` bundles two objects that every rule function receives:

- `NestedDict` (`.data`): holds the document. `get_or_create_nest(key, access_lists=...)`
  walks/creates dicts along a key path and, when `access_lists` is true, descends into the
  last element of an array-of-tables. `append_nest_to_list(key)` implements `[[...]]`.
- `Flags` (`.flags`): a side-table of namespace flags stored as a parallel nested dict.
  - `Flags.EXPLICIT_NEST`: this table was declared with `[table]` or `[[aot]]` (or made so by
    dotted keys). It cannot be re-declared with `[table]` later.
  - `Flags.FROZEN`: the namespace is an inline table or inline array. It is immutable
    afterwards and recursively so.
  - Flags can be `recursive=True` (apply to all descendants) or local.
  - `add_pending` / `finalize_pending` defer flags for the *current header's* relative
    containers until the next header statement. This is what makes
    `[a]` + `b.c = 1` + `[a.b]` correctly an error.

**Rules (statement level)**

- `create_dict_rule` (`[table]`): errors if the key is already `EXPLICIT_NEST` or `FROZEN`,
  then sets `EXPLICIT_NEST` and creates the nest.
- `create_list_rule` (`[[aot]]`): errors on `FROZEN`. Unsets any previous flags under the key
  (new array element), sets `EXPLICIT_NEST` on the key itself, then appends an empty dict.
- `key_value_rule`: parses `key = value` relative to the current `header`. Rejects redefinition
  of any explicit container on the dotted path, marks intermediate containers as pending,
  rejects writes into `FROZEN` namespaces, and marks inline table/array values `FROZEN`
  recursively.

**Values (`parse_value`)**

Dispatches on the first character, with the order chosen for speed:
`"`/`'` (strings, including multiline), `t`/`f` (booleans), `[` (array), `{` (inline table),
then regex-based dates/times (`RE_DATETIME`, `RE_LOCALTIME`), then numbers (`RE_NUMBER`), then
special floats `inf`/`nan` (with optional sign). Anything else is `Invalid value`.

**Strings**

- `parse_basic_str(..., multiline=...)` handles escapes via `parse_basic_str_escape`
  (`BASIC_STR_ESCAPE_REPLACEMENTS`, `\xHH`, `\uXXXX`, `\UXXXXXXXX`, validated by
  `is_unicode_scalar_value`). Multiline basic strings also handle line-ending backslashes.
- Literal strings (`'...'`, `'''...'''`) have no escapes.
- Control characters are rejected via the `ILLEGAL_*` frozensets. Tab is allowed in
  single-line strings; tab and newline are allowed in multiline strings.
- `parse_multiline_str` allows up to two extra quote characters at the end (e.g. `""""x"""""`).

**Containers**

- `parse_array` and `parse_inline_table` are recursive. They call `skip_comments_and_array_ws`
  so comments and newlines are allowed inside brackets.
- Inline tables build their own `NestedDict`/`Flags` and reject duplicate keys.

**Resource limits (important)**

- `MAX_INLINE_NESTING = 400`: nested inline arrays/tables are capped at 400 levels. Pure
  Python would raise `RecursionError` eventually anyway, but a mypyc build can *crash the
  process* on deep recursion, so the limit is enforced explicitly. The comment in
  `_parser.py` explains the reasoning. Tests pin the boundary (401 nested arrays parse, 402
  raise).
- `MAX_KEY_PARTS = sys.getrecursionlimit()` (evaluated at import time): caps the number of
  dotted-key parts. Quadratic behavior in `Flags.is_` motivated it.

**Floats and `parse_float`**

- `parse_float` is user-supplied (e.g. `decimal.Decimal`) and is wrapped by
  `make_safe_parse_float`, which raises `ValueError` if it returns a `dict` or `list`. When
  `parse_float is float`, the wrapper is skipped.
- Numbers with a fractional part or exponent go through `parse_float` with the matched text.
  Integers go through `int(text, 0)`.

**Misc**

- `TOMLDecodeError(ValueError)`: formatted message `"{msg} (at line L, column C)"`, or
  `"(at end of document)"`. Attributes: `msg`, `doc`, `pos`, `lineno`, `colno`. The
  free-form `TOMLDecodeError(str, ...)` constructor is deprecated and emits a
  `DeprecationWarning`. Do not remove this path without a deprecation cycle.
- `__lazy_modules__ = ["tomli._re", "tomllib._re"]` (PEP 810, Python 3.15+) defers loading
  the regex module. `test_lazy_import` checks this on 3.15+.
- `frozendict` is `types.MappingProxyType` on Python < 3.15 and the builtin on 3.15+.
- `TYPE_CHECKING = False` is set explicitly at module top. Type-only imports go under
  `if TYPE_CHECKING:`. This pattern is used identically in `_re.py` and `_parser.py` and is
  intentional for mypyc. Keep it.

### 3.3 `src/tomli/_re.py`

- `RE_NUMBER`: hex (`0x`), octal (`0o`), binary (`0b`), and decimal integers and floats, with
  `_` digit separators. Its named group `floatpart` decides between `parse_float` and `int`.
- `RE_LOCALTIME` / `RE_DATETIME`: built from the shared `_TIME_RE_STR`. Accept `T`, `t`, or a
  space as separator, `Z` or an offset, and optional seconds (TOML 1.1). Fractional seconds
  are truncated to microseconds (extra digits are consumed and discarded).
- `match_to_datetime` returns `datetime.date` when no time part is present. It returns
  `datetime.datetime` with `tzinfo` set to `timezone.utc` (for `Z`), a fixed `timezone`
  (for offsets), or `None` (local).
- `cached_tz` is `@lru_cache(maxsize=None)`. The cache is bounded by the input space. It is
  deliberately unwrapped in `fuzzer/fuzz.py` (`cached_tz.__wrapped__`) so each input runs the
  same code path.
- `match_to_number` / `match_to_localtime` / `match_to_datetime` may raise `ValueError` for
  out-of-range dates (e.g. Feb 30). `_parser.parse_value` converts that into
  `TOMLDecodeError("Invalid date or datetime")`.

### 3.4 `src/tomli/_types.py`

Only type aliases: `ParseFloat = Callable[[str], Any]`, `Key = Tuple[str, ...]`, `Pos = int`.
It uses `typing.Tuple`/`Callable` (not PEP 585 generics) because it is evaluated at runtime
on Python 3.8. `tests/test_misc.py::test_types_import` imports it explicitly for coverage.

### 3.5 `tests/`

- `tests/__init__.py` is the single point that decides which module is under test:
  `import tomli as tomllib`. Test modules do `from . import tomllib`. Do **not** import
  `tomli` directly in test modules, so the `tomllib.md` sync procedure keeps working.
- `test_data.py` discovers `tests/data/valid/**/*.toml` and compares `burntsushi.convert(
  loads(...))` against the `.json` next to each file after `burntsushi.normalize`.
  `tests/data/invalid/**/*.toml` must raise `TOMLDecodeError`. Files that are not valid
  UTF-8 are skipped (the `TestData.test_invalid` loop skips them).
- `burntsushi.py` implements the toml-test "tagged" value format (`{"type": "integer",
  "value": "1"}`), plus float/datetime normalization so results compare equal.
- `test_error.py` asserts **exact** message strings and `(line, column)` positions.
  Changing a message requires updating these tests (and is user-visible).
- `test_misc.py` covers `load`, `parse_float`, deepcopy, the recursion limits, and the
  lazy-import behavior.

### 3.6 `benchmark/`

- `run.py` times `tomli.loads` against `rtoml`, `pytomlpp`, `toml`, `tomlkit` on
  `data.toml` (5000 iterations). Results are published in `README.md` (sections "Mypyc
  generated wheel" and "Pure Python"). Those numbers are pinned to a specific commit; do not
  silently update them.
- Its `requirements.txt` intentionally does **not** include tomli. Tox installs tomli
  separately.

### 3.7 `fuzzer/fuzz.py`

- Atheris (libFuzzer) harness. It generates a Unicode string, parses it with `tomli.loads`,
  dumps the result with `tomli_w.dumps`, re-parses, and asserts equality after NaN
  normalization. `RecursionError` and `TOMLDecodeError` are accepted outcomes.
- It disables warnings and the `cached_tz` lru_cache (see §3.3). It needs `clang` and
  `atheris==2.0.7` (see `fuzzer/requirements.txt`).

### 3.8 `profiler/profiler_script.py`

Runs `tomli.loads` on `benchmark/data.toml` 1000 times. Used by `tox -e profile`, which emits
an SVG via `cProfile` + `gprof2dot` + graphviz `dot`.

### 3.9 `scripts/`

- `mypyc_tox`: copies `pyproject.toml` to `.backup.pyproject.toml`, runs `use_setuptools()`,
  sets `TOMLI_USE_MYPYC=1`, runs `tox` with the passed arguments, and restores
  `pyproject.toml` in a `finally` block. **Always use this wrapper for mypyc tox runs.**
- `use_setuptools.py`: **overwrites** `pyproject.toml` `[build-system]` with
  `setuptools>=77.0.3` + `mypy[mypyc]>=1.15`. It has no backup. Do not commit its output
  to the real build backend.

## 4. Build, test, and lint

There is no Makefile. `tox` (configured in `pyproject.toml` under `[tool.tox]`) is the task
runner that CI mirrors. Install it with `pip install tox` (`tox>=4.21.1`).

### 4.1 Build

| Goal | Command |
|---|---|
| Pure-Python wheel / sdist | `python -m build` (flit_core backend; `setup.py` is ignored) |
| Install locally | `pip install .` |
| mypyc-compiled install | `./scripts/mypyc_tox -e <env>` (or manually: `python scripts/use_setuptools.py` then `TOMLI_USE_MYPYC=1 pip install .`, then restore `pyproject.toml`) |

Important: `pyproject.toml` uses **flit_core** as build backend. `setup.py` only does
anything after the backend is switched to setuptools, which happens only inside
`scripts/use_setuptools.py` and `scripts/mypyc_tox` (and in the CI `binary-wheels` job).

### 4.2 Test

| Goal | Command |
|---|---|
| Full suite, against installed package | `pip install . && python -m unittest` (this is what CI does) |
| Full suite, against source tree | `PYTHONPATH=src python -m unittest` |
| Single module | `PYTHONPATH=src python -m unittest tests.test_error` |
| Single test | `PYTHONPATH=src python -m unittest tests.test_error.TestError.test_line_and_col` |
| All supported interpreters (tox) | `tox` (envs 3.8 to 3.14; CI also covers pypy3.11 and 3.15-dev) |

Gotcha: running `python -m unittest` from the repo root **without** installing the package
or setting `PYTHONPATH=src` fails with `ModuleNotFoundError: No module named 'tomli'`, because
the layout is `src/`-style. Use one of the two forms above.

The `valid/_external` and `invalid/_external` data are part of the default run. The
`coverage` CI job deletes them first (see §9).

### 4.3 Coverage

CI requires **100% line and branch coverage** of `tomli` (with the external data removed):

```
coverage run -m unittest
coverage report --fail-under=100 --show-missing
```

`pyproject.toml` sets `branch = true`, and excludes `# pragma: no cover`, `if TYPE_CHECKING:`,
and `if __name__ == "__main__":`. Any new branch in `src/tomli` needs a test. Use
`# pragma: no cover` only for code that is provably unreachable, and keep the existing
usage in `_parser.py` as the bar.

### 4.4 Lint, format, type-check (pre-commit)

Run all of them with `pre-commit run --all-files` (or `tox -e pre-commit`). The hooks are:

| Hook | What it enforces |
|---|---|
| `insert-license` | Every `.py` under `src/` and `tests/` starts with the three-line header in `LICENSE-HEADER` |
| `mdformat` (+ `mdformat-toc`, `mdformat-gfm`, `mdformat-black`) | Markdown formatting; the README TOC is auto-generated between `mdformat-toc` markers |
| `yesqa` | Removes unnecessary `# noqa` comments |
| `absolufy-imports` | Import-style normalization for `src/` (see `--never --application-directories src`) |
| `isort` | Import order (profile `black`, `force_sort_within_sections`, `known_first_party = tomli, tests`) |
| `black` | Formatting, line length 88 |
| `check-yaml` | YAML validity |
| `python-use-type-annotations`, `python-check-blanket-noqa`, `python-check-blanket-type-ignore` | Bans type comments, bare `# noqa`, and bare `# type: ignore` |
| `flake8` (+ bugbear, builtins, comprehensions) | Lint. Max line length 88; ignores E203 and B042; `_types` is allowed to shadow builtins |
| `mypy` (`--scripts-are-modules`) | `strict = true`, `warn_unreachable`, `strict_bytes`, `enable_error_code = ignore-without-code` |
| `zizmor` | GitHub Actions security linting for `.github/workflows` |

Type-checking config: `[tool.mypy]` in `pyproject.toml`. `tests.*` relaxes
`disallow_untyped_defs`. `run` (benchmark) and `fuzz` (fuzzer) are excluded from errors.
Running `mypy` on only `src/tomli` prints a harmless "unused section(s)" warning for those
overrides.

Useful one-off commands (these tools are on the pre-commit list):

```
mypy --strict src/tomli
flake8 src tests
black --check src tests
isort --check-only src tests
```

### 4.5 Other tox environments

| Env | Purpose |
|---|---|
| `tox -e pre-commit` | Run all linters |
| `tox -e benchmark` | Benchmark local tomli (needs `benchmark/requirements.txt`) |
| `tox -e benchmark-pypi` | Benchmark the latest PyPI tomli |
| `tox -e benchmark-import` | Measure import time (`python -X importtime`) |
| `tox -e profile` | cProfile + SVG at `.tox/prof/output.svg` (needs graphviz `dot`) |
| `tox -e fuzz` | Atheris fuzzing; needs `clang`; corpus at `.tox/fuzzer-corpus` |

## 5. Coding conventions

Match the existing code exactly. The following are observed in the source:

- **License header.** Every `.py` file in `src/` and `tests/` begins with:

  ```python
  # SPDX-License-Identifier: MIT
  # SPDX-FileCopyrightText: 2021 Taneli Hukkinen
  # Licensed to PSF under a Contributor Agreement.
  ```

  `pre-commit`'s `insert-license` hook adds it. Do not change the copyright line on existing
  files.
- **`from __future__ import annotations`** at the top of modules that use modern annotation
  syntax (`_parser.py`, `_re.py`, `test_error.py`). Keep it on those modules.
- **Type-only imports** go under `if TYPE_CHECKING:`, where `TYPE_CHECKING = False` is
  defined at module scope (see §3.2). Use `Final` for module constants
  (`MAX_INLINE_NESTING: Final = 400`).
- **Constants** are `UPPER_SNAKE` and `Final`. Frozensets and `frozendict` are used for
  character classes and lookup tables.
- **Private modules** are prefixed with `_`. Only `__init__.py` is public.
- **Relative imports within the package** (`from ._re import ...`, `from ._types import ...`).
  Tests use `from . import tomllib` / `from . import burntsushi`.
- **Import order** is isort/black. Stdlib first, then `tomli`/`tests`, with a blank line
  between groups.
- **Position-based parsing.** Functions take `src: str, pos: Pos` and return the new position.
  Keep that signature for new grammar rules. Use `src[pos]` inside `try/except IndexError`,
  or the `src.startswith(...)` idiom, to check bounds. Do not rely on negative indices.
- **Errors** are raised as `TOMLDecodeError(msg, src, pos)` with a short lowercase message
  such as `"Invalid value"`. Use `from None` when re-raising inside `except`. Do not leak
  `IndexError`/`KeyError` to users.
- **No new runtime dependencies,** no `dataclasses`, no `typing.Literal`-style runtime
  features that break 3.8 (`typing.Final` is fine under `TYPE_CHECKING`). Use
  `functools.lru_cache`, not `functools.cache` (3.9+).
- **Avoid constructs mypyc cannot compile well**: dynamic attribute injection, monkey-patching
  of module internals in library code, `exec`/`eval`, and reliance on `__dict__` tricks. The
  fuzzer's `cached_tz.__wrapped__` swap is test/tooling code only.
- **Comments explain *why*.** The existing comments give the reasoning for limits and
  non-obvious branches. Follow that style. Tie them to the spec or to a concrete
  failure mode.
- **Line length:** 88 (black). Do not add `# noqa: E501` unless it is unavoidable, and never
  add a bare `# noqa`.

## 6. Important gotchas

1. **Version lives in two places.** `pyproject.toml` (`[project] version`) and
   `src/tomli/__init__.py` (`__version__`) must both change together. Each line carries a
   `DO NOT EDIT THIS LINE MANUALLY` comment. Bump with `bump2version` (configured in
   `.bumpversion.cfg`), which also **creates a commit and a tag** (`commit = True`, `tag =
   True`). Run it only from a clean tree and only when a release is intended.
2. **`setup.py` is inert by default.** The build backend is flit. `setup.py` only compiles
   with mypyc when the backend is switched to setuptools *and* `TOMLI_USE_MYPYC=1` is set.
3. **`scripts/use_setuptools.py` rewrites `pyproject.toml` with no backup.** Use
   `scripts/mypyc_tox` instead when possible, or restore the file with `git checkout
   pyproject.toml` afterwards.
4. **Tests import `tomli` by name, but the source is under `src/`.** Use `PYTHONPATH=src` or
   install the package first. See §4.2.
5. **Coverage gate is 100%.** Coverage is measured with the external toml-test data deleted.
   Adding code without tests fails CI.
6. **Exact error strings are asserted** in `tests/test_error.py`. The mypyc build produces
   different `TypeError` messages than pure Python; the tests accept both variants. Keep that
   pattern when adding `TypeError` checks.
7. **Recursion limits matter for mypyc.** `MAX_INLINE_NESTING = 400` exists because
   deep recursion in a mypyc binary can crash the interpreter. Do not raise it casually;
   the constant's comment explains the trade-off. `MAX_KEY_PARTS` is computed from
   `sys.getrecursionlimit()` at import time, so changing the recursion limit later does not
   change it.
8. **`parse_float` must return a scalar.** Returning `dict` or `list` raises `ValueError`
   via `make_safe_parse_float`. Keep that guard.
9. **Flags logic is subtle.** `EXPLICIT_NEST` and `FROZEN`, plus the pending-flag mechanism,
   are what reject invalid TOML such as `[a]` followed by `b.c = 1` then `[a.b]`, or
   redefining an inline table. A change to `_parser.py` flag handling should be checked
   against the full toml-test data, not only the local cases.
10. **Datetimes lose precision.** Fractional seconds are truncated to microseconds. Extra
    digits are accepted and discarded, not rejected.
11. **Date validity is checked by `datetime` constructors.** For example `1979-02-30` raises
    `ValueError` internally and becomes `TOMLDecodeError`.
12. **Input must be decoded text.** `loads` rejects `bytes` with `TypeError`. `load` requires
    a binary file object, and a text-mode file raises `TypeError`. Do not add implicit
    decoding to `loads`.
13. **`\r\n` is normalized, lone `\r` is not** (it is rejected like any other control
    character in strings and comments).
14. **`TOMLDecodeError` free-form arguments are deprecated.** Only `(msg: str, doc: str,
    pos: int)` is supported without a warning. Existing deprecated behavior is tested in
    `test_deprecated_tomldecodeerror`.
15. **Benchmark numbers are historical.** `README.md` pins results to a specific commit. Do
    not regenerate and overwrite them unless you are updating the performance section on
    purpose.
16. **Python 3.15 changes.** `frozendict` comes from the builtin on 3.15+. The lazy-import
    test runs only on 3.15+ and only for the pure-Python build (it checks `_parser.__file__`
    ends in `.py`). CI treats 3.15-dev as non-blocking.
17. **Python 3.8 is still supported.** The `_types.py` module deliberately uses
    `typing.Tuple`/`Callable`. Do not use `list[...]` at runtime or `match` statements in `src/`.
18. **`tests/data` is largely vendored.** Do not hand-edit `_external/` subtrees (see §9).
    Add your own cases to the non-`_external` directories.
19. **Changelog is maintained by hand** in `CHANGELOG.md`. There is no `Unreleased` heading;
    add new entries under a new version heading. Ordering is not strictly newest-first (2.3.2
    appears above 2.5.0), so check before inserting.
20. **`mypy` on `src/tomli` alone warns about unused overrides.** This is expected.
21. **`.gitignore` excludes `.tox/`, `build/`, `dist/`, `__pycache__/`, and `.mypy_cache/`.**
    Do not commit build artifacts or `.backup.pyproject.toml`.

## 7. Making changes: checklist

When changing parser behavior:

1. Decide whether the change is a spec-conformance fix, a new TOML 1.1 feature, or a
   user-facing behavior change. Spec changes belong in the TOML version the README
   documents (currently 1.1.0).
2. Add a **valid** test case: `tests/data/valid/<area>/<name>.toml` with a matching
   `<name>.json` in tagged format (`{"type": "integer", "value": "1"}`). Copy the style of
   a neighbor file.
3. Add an **invalid** test case: `tests/data/invalid/<area>/<name>.toml` for any input that
   must be rejected. Each file should exercise one error.
4. If you change a message or position, update `tests/test_error.py`.
5. If you add a branch, make sure a test reaches both sides (`branch = true`).
6. If you add a numeric limit or a recursion path, add a boundary test in `test_misc.py`
   in the same style as the existing ones (`401` ok / `402` error).
7. Run `pre-commit run --all-files`, the unittest suite, and the coverage command in §4.3.
8. Update `CHANGELOG.md` under a new version heading (or ask a maintainer which version
   it goes under). Use the existing `Added` / `Changed` / `Fixed` / `Removed` /
   `Deprecated` / `Performance` sub-sections.

When changing packaging, CI, or tooling:

- Keep `tox` envs, `pyproject.toml`, and `.github/workflows/tests.yaml` consistent. CI
  runs `python -m unittest` after `pip install .`, and `tox` runs the same thing with
  `{posargs}` appended.
- GitHub Actions are pinned by commit SHA with a version comment. Keep that style, and keep
  `zizmor` clean. `persist-credentials: false` is set on all checkouts.

## 8. Versioning and releases

- Semantic-ish versions: `MAJOR.MINOR.PATCH`. Recent minors have added TOML spec features
  (2.4.0: TOML 1.1 support), and patch releases have included backports (e.g. `2.3.1`,
  `2.3.2`).
- Bump the version in one step with `bump2version {patch|minor|major}` from a clean working
  tree. It updates both version lines, commits, and tags with the bare version number
  (e.g. `2.5.1`).
- Pushing a tag matching `[0-9]+.[0-9]+.[0-9]+*` triggers CI's `pypi-publish` job via PyPI
  trusted publishing, but only after `allgood` passes. `allgood` needs `tests`, `coverage`,
  `linters`, `binary-wheels`, and `pure-python-wheel-and-sdist`.
- Binary wheels are built with `cibuildwheel`. Python 3.8, 3.9, and 3.10 wheels are skipped
  for the mypyc build (`CIBW_SKIP: cp39-* cp310-*`). The `binary-wheels` job switches the
  build backend to setuptools and uses `TOMLI_USE_MYPYC=1`. macOS builds are universal2
  (`x86_64 arm64`).

## 9. Vendored test data (`_external`)

- `tests/data/valid/_external/` and `tests/data/invalid/_external/` contain
  `toml-test` (MIT, copyright TOML authors) fixtures, including `LICENSE` files. These are
  upstream conformance tests. Do not edit them. Fix bugs in the parser, not the fixtures.
- The `coverage` CI job runs `rm -rf tests/data/valid/_external/ tests/data/invalid/_external/`
  before measuring coverage. The external suite is excluded from the 100% gate because
  it is not needed to exercise every branch. If you do this locally, restore the directories
  afterwards with `git checkout -- tests/data`. Do not commit the deletion.
- The `tomllib.md` sync procedure also excludes these directories when copying the tests into
  CPython.

## 10. Contribution workflow

There is no `CONTRIBUTING.md`. The following is inferred from the CI and config:

1. **Branch from `master`.** CI runs on pushes to `master` and on PRs targeting `master`.
2. **Make the change with tests** (§7). Cover both the valid and invalid sides.
3. **Run locally:**
   - `pre-commit run --all-files` (or `tox -e pre-commit`)
   - `PYTHONPATH=src python -m unittest` (or `pip install . && python -m unittest`)
   - the coverage commands from §4.3 (with `_external` removed)
   - if you touched `src/tomli`, consider `tox -e benchmark` and `tox -e fuzz` for
     performance- or robustness-sensitive changes
4. **Add a CHANGELOG entry** for user-visible changes.
5. **Open a PR against `master`.** CI runs the linters, unit tests on the full Python and
   OS matrix (Ubuntu, macOS, Windows; Python 3.8 to 3.14, PyPy 3.11, 3.15-dev as non-blocking),
   the coverage gate, binary wheel builds, and a pure-Python build plus sdist.
6. **Do not change the version number in a feature PR.** Maintainers bump the version
   when releasing.
7. **Keep public API stable.** The public surface is `loads`, `load`, `TOMLDecodeError`,
   and the `msg`/`doc`/`pos`/`lineno`/`colno` attributes. Changes to these need
   maintainer discussion and a CHANGELOG entry.
8. **Keep tomllib sync in mind.** The code is periodically synced to CPython's
   `Lib/tomllib` (see `tomllib.md`). Keep the package self-contained (standard-library imports only)
   and keep the module layout as it is.

## 11. Things an agent should *not* do without asking

- Change `requires-python`, the minimum Python version, or the TOML spec version targeted.
- Add runtime dependencies to `src/tomli`.
- Edit `.github/workflows/*.yaml` in a way that changes which jobs gate a release.
- Edit `_external/` fixtures, or the pinned benchmark numbers in the top-level `README.md`.
- Run `bump2version`, create tags, or push to `master`.
- Run `scripts/use_setuptools.py` and leave `pyproject.toml` modified.
