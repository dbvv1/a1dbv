# CLAUDE.md

- Tests: `PYTHONPATH=src python3 -m unittest` from the repo root (`unittest discover -s tests` fails with a relative import error).
- Fixing a bug: add a regression test in `tests/`, never weaken or delete existing tests.
