# A-HOOK-NATIVE-ACCEPTANCE-20261030 · 结果

## 结论：两条通过，一条拒绝成立但 Hook 归属未确认

| 路径 | 结果 | 证据 |
|---|---|---|
| ① 正常编辑 `src/allowed.txt` | 通过 | 原生 `Edit` 返回成功；同一调用内 `PreToolUse:Edit` Hook 触发，exit 0、无输出（放行） |
| ② 原生 `Write` 创建 `dist/generated.txt` | **未确认（Hook 未执行）** | 写入被拒、目标运行后仍不存在；拒绝文案指向模板自带的原生 `Read(dist/**)` 拒绝规则，该调用没有任何 PreToolUse Hook 事件，客户端 `permission_denials` 记录 `Write` |
| ③ 拒绝后编辑 `src/after-denial.txt` | 通过 | 同一调用继续；Hook 再次触发并 exit 0，`Edit` 成功 |

按任务的口径，②要求“dist 目标工具调用确被 Hook deny”。本次目标调用确实被拒且目标不存在，但**拒绝者是原生权限规则，不是路径 Hook**；因此三条路径不能记为全通过，②的 Hook 归因记为未确认。文件保护结果成立，机制归属与任务验收项不同。

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

## Hook 归属判断

- 用户级设置没有注册 PreToolUse Hook；已启用插件中也没有发现 PreToolUse Hook（另有已安装但未启用的插件带有该事件，未加载）。项目 `.claude/settings.json` 中 `Edit|Write|MultiEdit|NotebookEdit` 匹配器的注册是流中两次 `PreToolUse:Edit` 事件的直接来源，因此归到 `protect-paths.sh`。
- 事件流不携带 Hook 命令或 `tool_use_id`，逐次关联依据事件顺序；Write 调用前完全没有 Hook 事件，这是“该调用未进入 Hook”的直接证据，不是“模型自行跳过”。
- 拒绝文案明确写 “Read deny rule in your permission settings”，且客户端把该调用记入 `permission_denials`；归因为模板 `settings.json` 中 `Read(dist/**)` 的原生权限先拒绝。本次没有得到任何 Hook 的 `permissionDecision: deny`。

## 未验范围与恢复条件

- 未验：脚本缺失／超时／`ask` 规则、符号链接、Bash 写入、Codex、非 Windows 平台、其他 Claude Code 版本、模板其他副本；没有故障矩阵，也不做安全有效性排名。
- 本单元只跑了一次调用，未为补测另开调用。模板 Hook 的 deny 目标与原生规则的覆盖并不一致：`dist`、`build`、`.env`/`.env.*` 有对应的 `Read(...)` 原生拒绝（本次已观察 `dist` 的 Read deny 在 PreToolUse 之前生效）；`node_modules` 有 `Edit(node_modules/**)` 原生拒绝，官方权限文档说明 Edit 规则同样作用于写文件的工具，但本次未单独调用 `node_modules`，它与 Hook 的先后未实测。`**/secrets/**` 只出现在 `settings.json` 的原生 Read deny，不是 Hook 的 deny 目标。`.git/*` 是 Hook 的 deny 目标；`docs/10-security.md` 提到的受保护路径是 `.git/hooks` 等，且限定在“文件隔离开启且命令仍处于沙箱时成立”，范围不是整个 `.git/*`，本次调用没有证明沙箱隔离生效，也没有核到 2.1.281 对 `.git` 先于 PreToolUse 的原生特判。因此 `.git/*` 可能仍只由 Hook 覆盖，写 `.git` 本身有风险，且不能替代 ② 对 `dist` 的固定输入证据。可确定的结论收窄为：`dist`、`build`、`.env`/`.env.*` 这些目标上，原生 `Read(...)` 会在 PreToolUse 前拒绝，靠原模板拿不到 Hook 的 `permissionDecision: deny`；不能推广为“任何一条 Hook deny 都没有执行机会”。
- 固定模板下 ② 的 Hook 归因补不上：`Read(dist/**)` 会在 PreToolUse 之前拒绝，`dist/generated.txt` 的 Write 到不了 Hook。要拿到 ② 的 Hook 证据，只能在 `dist` 写入能进入 PreToolUse 的客户端版本上重测，或明确接受改动固定输入并重新标注为非固定 blob。
- `scratch/*` 诊断副本只能证明 Hook 能返回 `permissionDecision: deny`，不涉及 `dist`，不改变 ② 的归因，也不证明 `dist/*` 规则会执行。若确要做这份诊断，需在同样不降低权限的前提下另建一次性项目：`settings.json` 与 `hooks/protect-paths.sh` 保持 base_ref blob，`protected-paths.txt` 追加 `deny scratch/*` 并标注偏离 `f810051087e80380eea7b481e3805c2eff39813e`（非固定模板输入），再对 `scratch/` 下目标发起单次 Write，确认 `PreToolUse:Write` 事件与 `permissionDecision: deny`。也可先用固定模板已有的 Hook `ask` 目标（如 `package-lock.json`、`.github/workflows/*`）确认 `PreToolUse:Write` 会执行，但那只能证明 Hook 触发，不能补 deny 证据。改固定模板规则或用放宽权限换证据不在本任务范围。

## 附带发现（供负责人判断，未改文档）

模板自带的 `Read(dist/**)`、`Read(build/**)`、`Read(.env)`/`Read(.env.*)` 拒绝会在 PreToolUse 之前拦截对应写入（本次对 `dist` 观察到），路径 Hook 的 `dist/*`、`build/*`、`.env`/`.env.*` 规则在这些路径上没有执行机会。`node_modules` 有 `Edit(node_modules/**)` 原生拒绝，但本次未单独调用 `node_modules`，它与 Hook 的先后未实测，不能据此断言路径 Hook 的 `node_modules/*` 规则没有执行机会。`**/secrets/**` 只在原生 Read deny 中，不是 Hook 的 deny 目标。单靠原模板，在 `dist`、`build`、`.env`/`.env.*` 这些已核实路径上拿不到 Hook 的 `permissionDecision: deny` 证据，但不能推广到全部 Hook deny 目标（如 `.git/*`）。读者若依赖“路径 Hook 拦截生成物写入”，需要知道实际生效的是原生规则；是否调整模板或文档由负责人决定。

## 检查与产物

- 本文件是入仓唯一产物；原始事件流、提示词与临时项目留在任务临时区，不入仓。公开内容不含本机绝对路径、环境变量或原始客户端日志。
- 为让检查覆盖本文件，先执行 `git add -N docs/collaboration/local-jobs/artifacts/A-HOOK-NATIVE-ACCEPTANCE-20261030/result.md`，再跑下列检查（`check_public` 枚举 `git ls-files`，未跟踪时不计入本文件）。
- `python3 scripts/check_repo.py`：exit 0（571 个文件，无错误；`rglob` 已包含本文件）。
- `python3 scripts/check_public.py`：exit 0（999 个文件，无命中）。
- `git diff --check`：exit 0（intent-to-add 后覆盖本文件）。
- 提交身份：本机当前 `git config user.email` 是公司邮箱，不符合公开仓库要求；发布端提交前需按运行细则§1 换成白名单内的固定机器身份。本单元未提交、未推送、未改任务文件。
