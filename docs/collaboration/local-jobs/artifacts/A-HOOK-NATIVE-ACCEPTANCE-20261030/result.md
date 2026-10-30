# A-HOOK-NATIVE-ACCEPTANCE-20261030 · 结果

## 接收结论：保留准确部分结果，不记 Hook deny 全通过

以下事件细节来自[执行端原结果](https://github.com/dbvv1/a1dbv/blob/c562746c8468c6c64455af2ba6dd55e4b934e0b1/docs/collaboration/local-jobs/artifacts/A-HOOK-NATIVE-ACCEPTANCE-20261030/result.md)及其原生 Workflow 审查；本次负责人接收未读取原始事件流，不声称已独立复核事件或落盘文件。

| 路径 | 执行端报告 | 报告中的证据 |
|---|---|---|
| ① 正常编辑 `src/allowed.txt` | 通过 | 原生 `Edit` 返回成功；同一调用内 `PreToolUse:Edit` Hook 触发，exit 0、无输出（放行） |
| ② 原生 `Write` 创建 `dist/generated.txt` | **未确认（Hook 未执行）** | 写入被拒、目标运行后仍不存在；拒绝文案指向模板自带的原生 `Read(dist/**)` 拒绝规则，该 Write 没有 PreToolUse Hook 事件，客户端 `permission_denials` 记录 `Write` |
| ③ 拒绝后编辑 `src/after-denial.txt` | 通过 | 同一调用继续；Hook 再次触发并 exit 0，`Edit` 成功 |

按任务的口径，②要求“dist 目标工具调用确被 Hook deny”。本次目标调用确实被拒且目标不存在，但**拒绝者是原生权限规则，不是路径 Hook**；因此三条路径不能记为全通过，②的 Hook 归因记为未确认。执行端报告的文件保护结果与 Hook 机制验收项不同。负责人接收这一部分结果，不把原生权限拒绝记成 Hook 通过。

适用边界：本结论只代表 **Claude Code 2.1.281**（客户端对配置模型报告 `unrecognized_model`，调用仍正常完成）在 **Windows 原生环境**、**`base_ref 9dcbd583`** 的三份模板文件上的这一次调用；不外推到其他客户端版本、操作系统、模板副本，也不据此宣称整个权限页或“全部隔离有效”。

## 固定输入与基线

| 文件 | Git blob | 模式 |
|---|---|---|
| `.claude/settings.json` | `bfddccf0a69d2fe131b9b06d63e2eabac3d72920` | 100644 |
| `.claude/protected-paths.txt` | `f810051087e80380eea7b481e3805c2eff39813e` | 100644 |
| `.claude/hooks/protect-paths.sh` | `4e92acc72a0e3eb27323b2dd9a2d08d00cf7bd75` | 100755 |

在任务临时区（仓外）新建一次性项目，原样复制上述三文件并保留脚本可执行位；复制后 `git hash-object` 与三个 blob 一致。合成内容与初始状态：

- `src/allowed.txt`、`src/after-denial.txt`：`status: initial`，SHA-256 均为 `23c6a613ad90309e30ebdfe3cba401e2ad20d1613bfc5c322a6c23455b1ca844`。
- `dist/` 目录初始不存在，未预读该目标。

## 调用方式

- 只新开一次真实 Claude Code 调用：`claude -p … --output-format stream-json --verbose --include-hook-events --permission-mode acceptEdits --permission-prompts none --no-session-persistence`，退出码 0，6 轮、约 18.9 秒。
- 提示词按顺序要求三次原生操作（`Edit` → 一次 `Write` → `Edit`），禁止 Bash／PowerShell／MCP 绕行，禁止重试或读取被拒目标。
- 实际工具序列：`Read src/allowed.txt` → `Read src/after-denial.txt` → `Edit src/allowed.txt` → `Write dist/generated.txt` → `Edit src/after-denial.txt`。没有 Bash／MCP 调用。

## 三项观察

1. **正常编辑**：`Edit` 请求前出现 `hook_started`／`hook_response`（`PreToolUse:Edit`），`exit_code 0`、`outcome success`、输出为空；随后 `Edit` 返回“updated successfully”。`src/allowed.txt` 最终为 `status: edited`，SHA-256 `2690606dcc826193db6dec3808e1bc8c17250730913e8a6caba6367dcc5db6ee`。
2. **被拒写入**：`Write dist/generated.txt` 与错误结果之间**没有** `hook_started` 事件；返回 `<tool_use_error>File is covered by a Read deny rule in your permission settings and cannot be written.</tool_use_error>`。最终结果记录 `permission_denials` 含 `tool_name: Write`、目标 `dist/generated.txt`。运行后 `dist/` 仍不存在，模型没有重试、读取或绕行。
3. **拒绝后继续**：`Edit src/after-denial.txt` 前再次出现 `PreToolUse:Edit` Hook（exit 0、输出为空），编辑成功；最终为 `status: continued`，SHA-256 `527680fb988c2d5c58fab6e1ce0a41dbf97d00a6263b99e58f1de1a5d9e036b7`。

## 机制判断与未验范围

- 执行端报告：两次 `PreToolUse:Edit` 的输出为空且 exit 0；Write 的错误指向原生 Read deny，`permission_denials` 记录 Write，未取得任何 `permissionDecision: deny`。因此本报告只支持“原生权限先拒绝 dist 写入”，不支持“路径 Hook 拒绝了该 Write”。
- 原报告称事件流没有 Hook 命令或 `tool_use_id`，以事件顺序关联；负责人未另读原事件流，不能把此关联升级成独立工具 ID 核验。
- 本次只对 `dist/generated.txt` 做了拒绝路径观察。`build`、`.env`、`.env.*` 在固定 `settings.json` 中也有 Read deny，但未单独调用；其触发顺序、实际效果仍未实测，不能写成“这些路径均已核实”或断言它们的 Hook 永远没有执行机会。`node_modules`、`.git/*` 同样未测；`**/secrets/**` 仅列在原生 Read deny，不是本模板 Hook deny 目标。
- 其他未验项：脚本缺失／超时／`ask`、符号链接、Bash 写入、Codex、非 Windows 平台、其他客户端版本与模板副本。本次不证明沙箱隔离，也不产生安全有效性排名。

## 原卡后续边界

本次固定输入下没有取得②的 Hook deny 证据。保留原生 `Read(dist/**)` 拒绝及既有权限、会话守卫和沙箱；不因缺证据重开调用、换客户端、改模板规则或换工具写被拒目标，也不把别的合成路径试验冒充本次 dist 验收。

原单元已结束，不再派发。若原任务明确输出仍可在既有授权内读取，窄续接只复核那一次调用的工具事件、Hook 事件顺序与落盘证据；不枚举 session 目录、不读私人历史、不重新启动模型。材料不可读或关联不足就保留未确认，独立的新诊断范围须另行确认，不能沿本卡自动补跑。

## 负责人接收复核（2026-10-30）

- 公开固定 base 的三份 Git blob 与模式均匹配上表；三种合成文本的 SHA-256 可独立复算且与报告一致。复算文本 hash 不等于独立读取过测试落盘文件。
- 既有本机只读入口核到原单元 `success`、退出码 0，完成于 18:46:08.072 UTC；登记进程已 settled，无原 worker／Claude 存活。该退出核查不等于独立复核原始事件流。
- 接收范围是准确的部分执行记录和上述复核；②仍为 Hook 归因未确认。权限页、模板及地图评级均不因此升级。

## 检查与产物

- 本文件是入仓唯一产物；原始事件流、提示词与临时项目留在任务临时区，不入仓。公开内容不含本机绝对路径、环境变量或原始客户端日志。
- 为让检查覆盖本文件，先执行 `git add -N docs/collaboration/local-jobs/artifacts/A-HOOK-NATIVE-ACCEPTANCE-20261030/result.md`，再跑下列检查（`check_public` 枚举 `git ls-files`，未跟踪时不计入本文件）。
- `python3 scripts/check_repo.py`：exit 0（571 个文件，无错误；`rglob` 已包含本文件）。
- `python3 scripts/check_public.py`：exit 0（999 个文件，无命中）。
- `git diff --check`：exit 0（intent-to-add 后覆盖本文件）。
- 以上三项命令是执行端原阶段的检查记录；接收端随后已以公开 noreply 身份提交并推送原结果 `c562746`，任务在 `8681aba` 回到 `review_ready`。负责人本次收窄说明与接收检查写在接收提交中，不再沿用“尚未提交／推送”的阶段旧结论。
