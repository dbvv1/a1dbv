# Review instructions

**复制前先选入口。** [Claude 托管 GitHub 评审](https://code.claude.com/docs/en/code-review#who-controls-a-review)从 PR 基线或仓库默认分支读取 `REVIEW.md`；只在被审 PR 里新增或修改它，本轮不会采用该版本。[终端内置 `/code-review`](https://code.claude.com/docs/en/code-review-local#what-the-review-reads-and-edits)读 `CLAUDE.md`，不自动读本文件；只做终端评审时，把必要规则放进 `CLAUDE.md`，不另维护一份。

<!-- 只保留改变评审行为的规则；项目背景留在 CLAUDE.md / AGENTS.md。复制后删掉这段使用说明。 -->

## What Important means here

Reserve Important for findings that would break behavior, leak data, or
block a rollback: incorrect logic, missing authorization checks, secrets or
PII in logs, data migrations that are not backward compatible. Style,
naming, and refactoring suggestions are Nit at most.

## Evidence bar

- Every behavior claim cites `file:line` in the source. Do not infer
  behavior from names.
- Read the requested snapshot. For a staged review, inspect index contents
  rather than substituting later working-tree edits; for a working-tree review,
  include relevant untracked files. Do not stage files just to review them.
- Check unresolved, decision-changing factual claims against the cited source
  for predicate strength, time, subject, and conditions, report support or the
  precise gap rather than an aggregate score, and skip claims outside that
  scope or already supported by a still-valid source check.
- When document caveats obscure the next action, identify the reader scenario
  that would lead to a wrong action, then suggest the smallest action-first
  rewrite, merging repeated explanations while preserving behavior, facts,
  decision-changing conditions, versions, and cited sources. Leave already-clear
  text unchanged; never remove a condition just to shorten it.
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
- Mechanical churn in generated files or vendored code when source review
  and relevant consumer checks cover it. Keep changes to dependency resolution,
  lockfile format, runtime behavior, and shipped interfaces in scope; do not exclude
  them by filename.
- Missing tests for code that is not behavior (docs, config comments)

## Always check

- Duplicated logic that already exists elsewhere in the repo (name the
  existing function)
- Errors swallowed outside the existing input, error, or supported-version contract.
  Preserve legitimate tolerance and compatibility; verify that the handler covers
  the recoverable case and that unrelated failures remain visible.
- Tests that would pass even without the change
- TODO: repo-specific invariants, e.g. "queries are scoped to the tenant",
  "new endpoints have an integration test"
