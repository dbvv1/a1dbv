# A-LONG-ROUTE-BASH-READER-20261113 · 最终版本原生 Windows 补验

本记录对应任务卡末节「修改要求 · 最终版本原生 Windows 补验」：只补最终修订版的原生 Windows 证据，不重做实现、不重新盲读。完整读者记录见同目录 `A-LONG-ROUTE-BASH-READER-20261113-u1.md`。

## 0. 基线与工作树

- 工作树 HEAD 是上一轮已接收结果 `ccd15c9`，不是任务要求的 base_ref。`4564ed0c..HEAD` 的测试差量为：`tests/hook_test_support.py` 少一行 `resolve()` 调用与注释、`tests/test_hook_test_support.py` 少两条回归（可判别的 Bash 优先级用例、相对选择绝对化用例）。
- 按卡「以 base_ref 的最终测试文件为准，不直接使用旧 relay 分支的 ccd15c9 版本」，执行 `git checkout 4564ed0c -- tests/test_protect_paths.py tests/test_protect_drive_case.py tests/hook_test_support.py tests/test_hook_test_support.py`，把四份文件取到工作树。没有编写或修改任何测试逻辑，没有改 Hook、页面或其他任务卡，没有提交。
- 页面 `docs/decisions/long-tasks.md@b05cb560`：119 行、15490 字节、SHA256 `cba106f395cb95438b36412653f171b34fa58d8461d3f8f3562da54f1f6c9af8`，开工时在工作树重算一致。

## 1. 四份测试／夹具与 base_ref 字节一致

工作树文件与 `git show 4564ed0c:<路径>` 逐一比对：

| 相对路径 | SHA256 | 一致 |
|---|---|---|
| tests/test_protect_paths.py | 3d84e4d8c55872a110a19a8b88970467fdad3864b2675a36fd238bcbff93cbcc | 是 |
| tests/test_protect_drive_case.py | 18613a78ddc3e15ad0158202f686c9f14ceaa94fedd1c24cf6144869396f5181 | 是 |
| tests/hook_test_support.py | be5195182b8a242ce3620a3e2d52a960e2cb3010e299d74631655e087934c079 | 是 |
| tests/test_hook_test_support.py | 4b63bdf78e3f5857ba0b82b887daff4e19c081f0769aa78cfac5a4a1da3e38a1 | 是 |

## 2. 原生 Windows 实跑

环境（未记录个人绝对路径）：原生 Windows（`os.name=nt`）、Python 3.13.5（`python` 为本机原生解释器，`python3` 为 PATH 上的 Microsoft Store 别名，两者版本相同）、Git Bash 5.3.15（PATH 上的既有 `bash`）、`cat` 可用、`jq` 未安装。未安装依赖、未改用户设置、未提权。所有命令在工作树根目录、显式 `TEST_PARSER=python3` 下执行。

| 检查 | 命令 | 退出码 | 实际结果 |
|---|---|---|---|
| Hook 回归 | `TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_protect*py' -v` | 0 | Ran 42，OK，无 skip，219.7 秒 |
| 共享夹具 | `TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_hook_test_support.py' -v` | 0 | Ran 13，OK（skipped=1），5.7 秒 |
| jq 后端 | `TEST_PARSER=jq ...` | 未运行 | `jq` 不在 PATH，未安装、未用混合 PATH 或 JSON 模拟代替 |
| 完整 POSIX 离线门禁 | `python scripts/check_offline.py` | 2 | BLOCKED：`POSIX with /bin/bash is required by existing fixture tests`；`missing required commands: jq`；没有任何阶段运行 |
| 仓库检查 | `python scripts/check_repo.py` | 0 | checked_files=968，errors=[] |
| 公开内容扫描 | `python scripts/check_public.py` | 0 | checked_files=1578，findings=[] |
| 空白检查 | `git diff --check` | 0 | 无输出 |

跳过项只有 `test_jq_is_preferred_when_both_backends_are_visible`，原因 `jq is not installed; the jq backend was not run`。没有失败、没有 error。

## 3. 新增回归是否真实可判别

两条最终新增回归都实际执行并通过：

- `test_explicit_bash_is_selected_over_path`：显式参数与 `BASH_UNDER_TEST` 两条路径分别断言；竞争来源是 `sys.executable`，不是同一份 bash。
- `test_relative_selection_is_resolved_before_cwd_changes`：断言选中的值是绝对路径，且启动探测收到绝对路径。

为确认不是空回归，在任务临时目录复制夹具与用例，做两次变异后单跑对应用例（不改工作树）：

| 变异 | 用例 | 退出码 | 结果 |
|---|---|---|---|
| `configured = explicit ... else os.environ['BASH_UNDER_TEST']` 改为 `configured = None` | test_explicit_bash_is_selected_over_path | 1 | FAILED (errors=2)，两条子用例都把 `sys.executable` 当 bash，启动探测 exit 1 |
| 删掉 `bash = str(Path(bash).resolve())` | test_relative_selection_is_resolved_before_cwd_changes | 1 | FAILED (failures=2)，`'relative-test-bash' != '<scratch>/mutB/relative-test-bash'` |

另用去掉 `resolve()` 的整份支撑套件配真实相对 `BASH_UNDER_TEST` 重跑：13 例中 12 例通过、1 skip，失败仍只来自上面那条单元用例；真实启动 Hook 的用例没有因相对路径失败。

## 4. 真实相对路径集成

在任务临时目录（不在工作树）引用 PATH 上已有 Bash，用相对 `BASH_UNDER_TEST` 启动整套支撑测试：

```text
cd <scratch>
TEST_PARSER=python3 BASH_UNDER_TEST="..\..\..\..\..\..\..\..\Program Files\Git\usr\bin\bash.EXE" \
  python -m unittest discover -s <repo>/tests -p 'test_hook_test_support.py' -v
```

退出码 0，Ran 13，OK（skipped=1）。夹具在名为 `dir with spaces` 与 `项目 目录` 的临时项目里真实启动 Hook，说明相对值被解析成可用路径，含空格/中文目录与 UTF-8 JSON 用例都通过。

边界如实记录：单独探测「相对 exe + 子进程 cwd 指向含空格目录」在本机仍返回 0，因此这次真实集成证明相对值是可用的、夹具在含空格目录能跑，但不能单独证明 `resolve()` 是修复所必需；`resolve()` 的必要性由 §3 的单元变异证明。没有复制或修改安装目录，也没有提权。

## 5. 直接 Hook CLI

隔离 PATH 只含 `cat` 与 `python3`（包装脚本 exec 同一真实可执行文件），项目目录 `dir with spaces/项目 目录`，规则 `deny dist/* 中文原因`。

| 输入 | 退出码 | stdout | stderr |
|---|---|---|---|
| `{"tool_input":{"file_path":"dist/文件 with spaces.txt"}}` | 0 | deny JSON，`permissionDecision=deny`，原因 `中文原因` | 空 |
| `{"tool_input":{"file_path":"src/x.txt"}}`（无匹配） | 0 | 空 | 空 |
| `{`（无效 JSON） | 1 | 空 | 解析器 traceback 后接 `protect-paths: 无效 Hook 输入` |

无效 JSON 仍是 fail-closed（退出 1、无 stdout），没有把解析器失败当通过。

## 6. 未运行与缺口

- jq 后端与「两后端同时可见仍选 jq」用例未运行：本机没有 jq，未安装、未用模拟替代。
- 完整 POSIX 离线门禁未运行：本机非 POSIX 且缺 `/bin/bash`、jq，`check_offline.py` 退出 2 BLOCKED，交已有权限的 POSIX 环境补跑。
- 本轮只核四份测试/夹具与 base_ref 一致；工作树其余文件仍是旧 HEAD（未合并最新 main），由接收端按分支流程处理。

## 附：脱敏终端原始输出

以下输出原样来自本机临时日志，已确认不含个人绝对路径或用户名（只有通用 Python 安装路径与测试名）。工作树、临时目录在正文中用 `<repo>`、`<scratch>` 表示。

### A. `TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_protect*py' -v`

```text
test_backslash_variants (test_protect_drive_case.DriveCaseTests.test_backslash_variants) ... ok
test_cross_drive_does_not_match (test_protect_drive_case.DriveCaseTests.test_cross_drive_does_not_match) ... ok
test_directory_case_is_not_relaxed (test_protect_drive_case.DriveCaseTests.test_directory_case_is_not_relaxed) ... ok
test_drive_letter_case_both_directions (test_protect_drive_case.DriveCaseTests.test_drive_letter_case_both_directions) ... ok
test_drive_letter_case_in_cwd (test_protect_drive_case.DriveCaseTests.test_drive_letter_case_in_cwd) ... ok
test_drive_root (test_protect_drive_case.DriveCaseTests.test_drive_root) ... ok
test_invalid_and_missing_paths_preserved (test_protect_drive_case.DriveCaseTests.test_invalid_and_missing_paths_preserved) ... ok
test_posix_paths_remain_case_sensitive (test_protect_drive_case.DriveCaseTests.test_posix_paths_remain_case_sensitive) ... ok
test_ask (test_protect_paths.HookTests.test_ask) ... ok
test_canonical_absolute (test_protect_paths.HookTests.test_canonical_absolute) ... ok
test_control_in_path_is_explicit_error (test_protect_paths.HookTests.test_control_in_path_is_explicit_error) ... ok
test_drive_absolute_compatibility (test_protect_paths.HookTests.test_drive_absolute_compatibility) ... ok
test_drive_relative_and_aliases (test_protect_paths.HookTests.test_drive_relative_and_aliases) ... ok
test_drive_root (test_protect_paths.HookTests.test_drive_root) ... ok
test_empty_cwd_falls_back_to_root (test_protect_paths.HookTests.test_empty_cwd_falls_back_to_root) ... ok
test_final_rule_without_newline (test_protect_paths.HookTests.test_final_rule_without_newline) ... ok
test_first_match_and_final_line (test_protect_paths.HookTests.test_first_match_and_final_line) ... ok
test_input_parser_called_once (test_protect_paths.HookTests.test_input_parser_called_once) ... ok
test_invalid_field_types (test_protect_paths.HookTests.test_invalid_field_types) ... ok
test_invalid_json (test_protect_paths.HookTests.test_invalid_json) ... ok
test_lexical_aliases (test_protect_paths.HookTests.test_lexical_aliases) ... ok
test_missing_bash_is_an_error_not_a_skip (test_protect_paths.HookTests.test_missing_bash_is_an_error_not_a_skip) ... ok
test_missing_path (test_protect_paths.HookTests.test_missing_path) ... ok
test_missing_rules (test_protect_paths.HookTests.test_missing_rules) ... ok
test_no_parser_is_explicit_error (test_protect_paths.HookTests.test_no_parser_is_explicit_error) ... ok
test_notebook_fallback (test_protect_paths.HookTests.test_notebook_fallback) ... ok
test_output_json_escaping (test_protect_paths.HookTests.test_output_json_escaping) ... ok
test_parser_failure_after_output_is_not_swallowed (test_protect_paths.HookTests.test_parser_failure_after_output_is_not_swallowed) ... ok
test_path_and_cwd_fields_are_lossless (test_protect_paths.HookTests.test_path_and_cwd_fields_are_lossless) ... ok
test_project_root_slash (test_protect_paths.HookTests.test_project_root_slash) ... ok
test_relative (test_protect_paths.HookTests.test_relative) ... ok
test_relative_event_cwd (test_protect_paths.HookTests.test_relative_event_cwd) ... ok
test_repeated_parent_components (test_protect_paths.HookTests.test_repeated_parent_components) ... ok
test_root_sibling_unmatched (test_protect_paths.HookTests.test_root_sibling_unmatched) ... ok
test_separator_and_controls_in_all_fields_are_errors (test_protect_paths.HookTests.test_separator_and_controls_in_all_fields_are_errors) ... ok
test_template_copies_identical (test_protect_paths.HookTests.test_template_copies_identical) ... ok
test_template_rules_protect_gitfile_without_blocking_git_neighbors (test_protect_paths.HookTests.test_template_rules_protect_gitfile_without_blocking_git_neighbors) ... ok
test_trailing_root_slash (test_protect_paths.HookTests.test_trailing_root_slash) ... ok
test_unc_absolute_compatibility (test_protect_paths.HookTests.test_unc_absolute_compatibility) ... ok
test_unicode_and_spaces (test_protect_paths.HookTests.test_unicode_and_spaces) ... ok
test_unmatched (test_protect_paths.HookTests.test_unmatched) ... ok
test_utf8_subprocess_protocol_ignores_locale_default (test_protect_paths.HookTests.test_utf8_subprocess_protocol_ignores_locale_default) ... ok

----------------------------------------------------------------------
Ran 42 tests in 219.727s

OK
```

### B. `TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_hook_test_support.py' -v`

```text
test_bash_startup_failure_is_a_clear_error (test_hook_test_support.BashSelectionTests.test_bash_startup_failure_is_a_clear_error) ... ok
test_directory_as_explicit_bash_is_a_clear_error (test_hook_test_support.BashSelectionTests.test_directory_as_explicit_bash_is_a_clear_error) ... ok
test_explicit_bash_is_selected_over_path (test_hook_test_support.BashSelectionTests.test_explicit_bash_is_selected_over_path) ... ok
test_missing_bash_on_path_is_a_clear_error (test_hook_test_support.BashSelectionTests.test_missing_bash_on_path_is_a_clear_error) ... ok
test_missing_explicit_bash_is_a_clear_error (test_hook_test_support.BashSelectionTests.test_missing_explicit_bash_is_a_clear_error) ... ok
test_relative_selection_is_resolved_before_cwd_changes (test_hook_test_support.BashSelectionTests.test_relative_selection_is_resolved_before_cwd_changes) ... ok
test_jq_is_preferred_when_both_backends_are_visible (test_hook_test_support.HookBackendIntegrationTests.test_jq_is_preferred_when_both_backends_are_visible) ... skipped 'jq is not installed; the jq backend was not run'
test_requested_python3_backend_is_the_one_called (test_hook_test_support.HookBackendIntegrationTests.test_requested_python3_backend_is_the_one_called) ... ok
test_utf8_json_in_directory_with_spaces (test_hook_test_support.HookBackendIntegrationTests.test_utf8_json_in_directory_with_spaces) ... ok
test_isolated_path_hides_the_other_backend (test_hook_test_support.IsolationTests.test_isolated_path_hides_the_other_backend) ... ok
test_wrappers_run_real_cat_and_parser (test_hook_test_support.IsolationTests.test_wrappers_run_real_cat_and_parser) ... ok
test_missing_requested_parser_is_a_clear_error (test_hook_test_support.ParserSelectionTests.test_missing_requested_parser_is_a_clear_error) ... ok
test_unknown_parser_is_rejected (test_hook_test_support.ParserSelectionTests.test_unknown_parser_is_rejected) ... ok

----------------------------------------------------------------------
Ran 13 tests in 5.677s

OK (skipped=1)
```

### C. 相对 `BASH_UNDER_TEST` 集成（在任务临时目录执行）

```text
REL_BASH=..\..\..\..\..\..\..\..\Program Files\Git\usr\bin\bash.EXE
EXIT=0
test_bash_startup_failure_is_a_clear_error (test_hook_test_support.BashSelectionTests.test_bash_startup_failure_is_a_clear_error) ... ok
test_directory_as_explicit_bash_is_a_clear_error (test_hook_test_support.BashSelectionTests.test_directory_as_explicit_bash_is_a_clear_error) ... ok
test_explicit_bash_is_selected_over_path (test_hook_test_support.BashSelectionTests.test_explicit_bash_is_selected_over_path) ... ok
test_missing_bash_on_path_is_a_clear_error (test_hook_test_support.BashSelectionTests.test_missing_bash_on_path_is_a_clear_error) ... ok
test_missing_explicit_bash_is_a_clear_error (test_hook_test_support.BashSelectionTests.test_missing_explicit_bash_is_a_clear_error) ... ok
test_relative_selection_is_resolved_before_cwd_changes (test_hook_test_support.BashSelectionTests.test_relative_selection_is_resolved_before_cwd_changes) ... ok
test_jq_is_preferred_when_both_backends_are_visible (test_hook_test_support.HookBackendIntegrationTests.test_jq_is_preferred_when_both_backends_are_visible) ... skipped 'jq is not installed; the jq backend was not run'
test_requested_python3_backend_is_the_one_called (test_hook_test_support.HookBackendIntegrationTests.test_requested_python3_backend_is_the_one_called) ... ok
test_utf8_json_in_directory_with_spaces (test_hook_test_support.HookBackendIntegrationTests.test_utf8_json_in_directory_with_spaces) ... ok
test_isolated_path_hides_the_other_backend (test_hook_test_support.IsolationTests.test_isolated_path_hides_the_other_backend) ... ok
test_wrappers_run_real_cat_and_parser (test_hook_test_support.IsolationTests.test_wrappers_run_real_cat_and_parser) ... ok
test_missing_requested_parser_is_a_clear_error (test_hook_test_support.ParserSelectionTests.test_missing_requested_parser_is_a_clear_error) ... ok
test_unknown_parser_is_rejected (test_hook_test_support.ParserSelectionTests.test_unknown_parser_is_rejected) ... ok

----------------------------------------------------------------------
Ran 13 tests in 6.771s

OK (skipped=1)
```

### D. 直接 Hook CLI

```text
parser= python3 isolated_bin_entries= ['cat', 'python3']
deny: exit=0 stdout='{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "\\u4e2d\\u6587\\u539f\\u56e0"}}\n' stderr=''
no-match: exit=0 stdout='' stderr=''
invalid-json: exit=1 stdout='' stderr='Traceback (most recent call last): ... protect-paths: 无效 Hook 输入\n'
```

### E. 变异验证

```text
=== mutation A: ignore explicit/env bash, run priority test ===
A_EXIT=1
hook_test_support.HookTestEnvironmentError: bash from PATH failed its startup probe with exit 1: File "<string>", line 1
    exit 0
         ^
SyntaxError: invalid syntax

Ran 1 test in 0.501s

FAILED (errors=2)
=== mutation B: drop resolve(), run relative test ===
B_EXIT=1
AssertionError: 'relative-test-bash' != '<scratch>/mutB/relative-test-bash'
- relative-test-bash
+ <scratch>/mutB/relative-test-bash

Ran 1 test in 0.005s

FAILED (failures=2)
```

### F. 仓库检查

```text
check_repo EXIT=0
{"checked_files": 968, "errors": []}

check_public EXIT=0
{"checked_files": 1578, "findings": []}

git diff --check EXIT=0
(无输出)

check_offline EXIT=2
BLOCKED: POSIX with /bin/bash is required by existing fixture tests
BLOCKED: missing required commands: jq
No phases ran; install nothing automatically.
```
