# Review instructions

<!--
给 AI 评审者（Claude Code Review 等）的仓库级评审规则。
- 只写会改变评审行为的规则；项目背景留在 CLAUDE.md / AGENTS.md。
- 写得越长，关键规则越被稀释。填完 TODO 后删掉这段注释。
- 依据：docs/09-review-and-quality.md「用 REVIEW.md 调教评审」。
-->

## What Important means here

Reserve Important for findings that would break behavior, leak data, or
block a rollback: incorrect logic, missing authorization checks, secrets or
PII in logs, data migrations that are not backward compatible. Style,
naming, and refactoring suggestions are Nit at most.

## Evidence bar

- Every behavior claim cites `file:line` in the source. Do not infer
  behavior from names.
- For each Important finding, say how to show it fails: an input, a
  command, or a test that would fail.

## Cap the nits

Report at most five Nits per review. Mention the rest as "plus N similar
items" in the summary. If everything is a Nit, start the summary with
"No blocking issues."

## Re-reviews

After the first review of a PR, do not raise new Nits. Report Important
findings only.

## Do not report

- Anything CI already enforces: formatting, lint, type errors
- Generated files: TODO (e.g. `src/gen/**`), lockfiles, vendored code
- Missing tests for code that is not behavior (docs, config comments)

## Always check

- Duplicated logic that already exists elsewhere in the repo (name the
  existing function)
- Errors that are caught and silently dropped
- Tests that would pass even without the change
- TODO: repo-specific invariants, e.g. "queries are scoped to the tenant",
  "new endpoints have an integration test"
