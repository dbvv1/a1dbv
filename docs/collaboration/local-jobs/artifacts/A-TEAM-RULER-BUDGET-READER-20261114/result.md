# A-TEAM-RULER-BUDGET-READER-20261114 · 结果

## 接收结论：警告已可复现，宿主截断仍未修复

在固定上游 Ruler `0.3.46`（`b905f192d84e340d6c9723ff8eadfa6dbc9be8b6`）上，原 [issue #791](https://github.com/intellectronica/ruler/issues/791) 仍成立：生成端不提示 Codex 的 32 KiB 项目指令上限，且 `codex debug prompt-input` 显示模型实际只收到前 32768 字节。本单元补一条生成端警告并完成真实 CLI 回读；生成文件字节不变、Codex 仍截断，警告不修复客户端上限。

| 项目 | 结果 |
|---|---|
| 页面全文 SHA-256 | `ea701c42c5af3b5e848b5fa8c78866327a1ac71e45be055dba7cc6141f0dcd44`（与任务要求一致；JSON 解码文本与附带全文副本一致） |
| 原 issue 是否已修 | 未修。`src/`、`tests/`、`README.md` 中无 `project_doc_max_bytes` / `32768` / `32 KiB` 处理 |
| 基线生成文件 | `51241` 字节，六个分段标记齐全 |
| 基线宿主可见指令 | `32768` 字节；`part1`–`part4` 在，`part5`、`part6` 不在，截断发生在 `Rule 4.38` 行中 |
| 补丁效果 | 打补丁后的真实 CLI 对 `51241` 字节输出打印一条明确警告；文件字节与基线逐字节相同 |
| 宿主行为 | 打补丁后仍只收到 `32768` 字节，`part5`、`part6` 仍不可见 |
| 定向测试 | 新增 7 个用例全部通过 |
| 全量测试 | 基线与补丁后失败集合完全一致（17 套件 / 34 用例），补丁新增 7 个通过用例；失败退出码 1 原样保留 |

## 页面与独立性

- 页面：`docs/18-team-adoption.md@55937fe5e473121b408697d21358fa1b0edada3c`，本卡对应 §4「配置治理」的局部机制，不评价团队推广、组织策略或生产放量，也不改整页评级。
- 本单元是首次接触该页与该 issue 的读者：未参加本页或本题的先前读者任务，未读作者 Ruler headers/backup 实验，未读旧读者答案，未修改页面，也未改 `TASKS.md`、答案页或其他卡。
- 页面全文以任务文件内 JSON 的 `page_text` 为准；解码后 UTF-8 字节数 46639，SHA-256 与要求一致，且与任务文件附带的明文本副本相同。仓库 `HEAD`（`55937fe5`）的 `docs/18-team-adoption.md` 也恰为 46639 字节、同一 SHA-256。

## 固定输入与版本

| 项 | 值 |
|---|---|
| 上游仓库 | `intellectronica/ruler` |
| 固定提交 | `b905f192d84e340d6c9723ff8eadfa6dbc9be8b6`（`main`，提交时间 2026-11-14T12:25:03Z） |
| `package.json` 版本 | `0.3.46` |
| 构建环境 | Node `v22.23.2`；`npm ci` 安装 535 个包 |
| Codex CLI | `0.166.0`（`codex debug prompt-input` 离线入口） |
| 平台 | Windows 11 原生环境（失败项含该平台的路径断言差异，见测试摘要） |
| 隔离 | 新建 `HOME`、`XDG_CONFIG_HOME`、`CODEX_HOME` 与一次性复现项目；未接入真实个人配置、会话、账号、用量或凭据 |

复现规则使用公开虚构内容，按 issue 描述构造：`.ruler/AGENTS.md` 230 字节，`.ruler/part1.md`–`part6.md` 各 8454 字节，每个分段以 `# Rules for part N` 开头。输入文件的字节数与 SHA-256 见 [input-manifest.json](input-manifest.json)；生成结果 `51241` 字节。

issue 正文没有给出六份规则原文，本次按“每份约 8 KB、`# Rules for part N` 开头”的公开描述重建，因此生成字节数 `51241` 与 issue 记录的 `50837` 略有差异；两者都超过 32 KiB，且可见分段结果一致（`part1`–`part4` 可见，`part5`、`part6` 被丢弃），不影响该复现的结论边界。

## 页面要求与实际步骤

1. **按全文确认能力、目标与消费者。** 页面 §4 给出组织/仓库/个人三层与“已有生成器分发共享规则时，连着验首次写入、下一次更新和恢复”。本卡据此把 Ruler 视为仓库级共享规则生成器，把 Codex 视为读取 `AGENTS.md` 的消费者。
2. **复现原 issue。** 在隔离目录运行真实 `ruler apply --agents codex --local-only`：基线生成 `51241` 字节，stdout 只有应用成功信息，stderr 为空，无任何上限警告；随后用 `codex debug prompt-input` 读取模型可见输入。
3. **确认原 issue 仍成立。** 固定提交源码与文档没有 32 KiB 处理；按上游 `CodexCliAgent` / `AgentsMdAgent` / `apply-engine` 的实际写入路径补警告。
4. **只补警告。** 超过默认 32768 字节时输出一条 `[ruler]` 警告，说明 `project_doc_max_bytes` 默认值、实际配置可能不同、Codex 会静默丢弃超出部分；不截断、不改写指令内容；新增警告逻辑不修改 `.codex/config.toml`，但原 agent 的 MCP 配置路径仍可写配置，不改变生成器默认。
5. **从构建后的真实 CLI 回读。** 打补丁后重新 `npm run build`，用同一隔离环境重新生成：警告出现一次，`AGENTS.md` 仍为 `51241` 字节且与基线逐字节相同；第二次 apply 仍提示一次，文件不变。
6. **消费者复核。** 打补丁后的输出仍只进入 `32768` 字节，`part5`、`part6` 不可见；警告如实反映“客户端上限未修复”。
7. **其他 agent 不误报。** 用同一超限规则运行 `ruler apply --agents claude --local-only`：退出码 0，stderr 为空，`CLAUDE.md` 生成 `51213` 字节且六个分段齐全。

## 卡点：页面哪一句、缺什么

| 页面位置 | 卡点 | 缺失内容 | 处理 |
|---|---|---|---|
| §4「已有生成器分发共享规则时，连着验首次写入、下一次更新和恢复。」 | 这句话把生成器维护指向“写入—更新—恢复”闭环，但本卡要验的是 Codex 的**读取上限**；页面没有把“生成成功”与“宿主实际读到”分开。 | 没有 32 KiB 默认上限、`project_doc_max_bytes`、`codex debug prompt-input` 或“生成端只报警告、不改客户端预算”的说明。 | 读原 issue #791 与 Codex 官方 AGENTS.md 指南补齐；按卡片限定只做生成端警告。 |
| §4 依据行只列 [Ruler #775](https://github.com/intellectronica/ruler/issues/775)、[补丁 #808](https://github.com/intellectronica/ruler/pull/808) 与作者 headers/backup 实验。 | 与本卡 issue #791 不是同一条问题；页面没有给 #791 的复现、版本或验收入口。 | 没有固定提交、构建方式、隔离 HOME/XDG/CODEX_HOME 的做法、离线宿主核对命令。 | 读 issue #791、上游 README/`package.json`/CI、Codex 官方文档；不读作者实验。 |
| §4「先按组织、仓库、个人三层放配置……」 | 这是治理分层，不足以决定 32 KiB 警告应放在哪个 agent、写哪条路径、如何避免其他 agent 误报。 | 没有 Codex agent 的实际写入入口与 `AGENTS.md` 拼接格式。 | 读上游 `CodexCliAgent.ts`、`AgentsMdAgent.ts`、`apply-engine.ts`、`RuleProcessor.ts` 后按实际路径实现。 |
| §4「跨客户端共享前先核配置能力。」 | 只给原则，没有 Codex 侧的只读验证入口。 | 没有 `codex debug prompt-input` 的用法与输出结构。 | 用本机 Codex CLI 的 `--help` 与一次小样本探明 JSON 结构，再在隔离 `CODEX_HOME` 下执行。 |
| §4「这里验证配置维护的局部机制，不新增生成器默认推荐……」 | 页面的“不新增默认”与 issue 要求的“补警告”边界需要读者自行判断。 | 没有说明警告阈值属于消费者默认还是生成器默认。 | 把 32768 实现为 Codex 文档默认的**警告阈值**，不改变生成内容或配置，符合“不新增生成器默认”。 |

## 做错过什么（返工记录）

1. **下载方式**：先尝试完整 `git clone`，随后改用提交 tarball；仓库含 72 MB `img/ruler-short.gif`，两种方式都超过 20 分钟未完成，已停止自有下载。改为 `git fetch --filter=blob:none` + sparse checkout（排除 `img`）后成功。该 GIF 也是全量测试中 `cli-version` 打包用例 `ENOENT` 的原因。
2. **稀疏检出范围**：第一次只取 `src tests .github`，漏了根目录 `.ruler/` 与 `test-qa/`，`cli-version` 用例报缺 `.ruler/AGENTS.md`。加入后再跑，失败集合未变，剩余 `ENOENT` 已定位到被排除的 `img/ruler-short.gif`。
3. **换行符**：Windows `core.autocrlf=true` 使检出为 CRLF，首次 `prettier --check`/`eslint` 把整文件报成 `Delete ␍`。将工作副本统一为 LF 并把该克隆的 `core.autocrlf` 设为 `false` 后，格式检查只针对真实改动。
4. **测试断言**：多字节用例最初按字符数预期 `33000 bytes`，实际警告按文件字节数（含 28 字节生成标记）报 `33028 bytes`。改为按 `Buffer.byteLength(rules) + 标记字节` 计算预期，避免把标记漏算。
5. **第一次全量测试**：在稀疏检出缺少根目录时运行，17 套件失败；补齐后失败集合与基线一致，未把环境失败当成补丁通过。

## 实际验收

### 生成端

| 运行 | 命令 | 退出码 | stderr | `AGENTS.md` 字节 | 分段标记 |
|---|---|---|---|---|---|
| 基线（未打补丁） | `ruler apply --agents codex --local-only` | 0 | 空 | 51241 | 六段齐全 |
| 补丁后首次 | 同上 | 0 | 1 条 `project_doc_max_bytes` 警告 | 51241，与基线逐字节相同 | 六段齐全 |
| 补丁后第二次 | 同上 | 0 | 仍 1 条警告 | 51241，内容未变 | 六段齐全 |
| 其他 agent | `ruler apply --agents claude --local-only` | 0 | 空 | `CLAUDE.md` 51213 | 六段齐全 |

补丁后的警告原文（stderr）：

```text
[ruler] Generated AGENTS.md is 51241 bytes, which exceeds Codex's default project_doc_max_bytes limit of 32768 bytes (32 KiB). Codex silently drops project instructions past that limit, so rules later in the concatenation may not reach the model. This is Codex's default only; the effective limit may differ if project_doc_max_bytes is configured. Split the rules across nested AGENTS.md files or raise project_doc_max_bytes in Codex if the full content is needed. Ruler leaves that setting unchanged.
```

### 消费者端（离线，不调用模型）

| 输出 | 生成文件字节 | 模型可见指令字节 | part1 | part2 | part3 | part4 | part5 | part6 |
|---|---|---|---|---|---|---|---|---|
| 基线 | 51241 | 32768 | 有 | 有 | 有 | 有 | 无 | 无 |
| 补丁后 | 51241 | 32768 | 有 | 有 | 有 | 有 | 无 | 无 |

截断尾部均为 `- Rule 4.38: When touching module demo_module_4_38`，说明客户端按字节硬截断，未识别分段边界。

### 回归

- 32769 字节：警告一次，含 `project_doc_max_bytes`、`32768`、`32 KiB`。
- 恰好 32768 字节：不警告。
- 32767 字节：不警告。
- 多字节 UTF-8：11000 个汉字（33028 字节，字符数小于阈值）仍按字节警告。
- 生成文件与既有 `.codex/config.toml`：在本次 MCP 输入为 null 的单测中内容不变，`project_doc_max_bytes = 65536` 未被改写；不保证启用 MCP 同步时整份配置不变。
- 连续两次 apply：每次各一条警告。
- 同一次 apply 里重复或叠加选择 `--agents codex,codex`、`--agents codex,agentsmd`：同一 `AGENTS.md` 仍只一条警告。
- 其他 agent（`agentsmd`）写超长 `AGENTS.md`：不警告。

### 工程检查

| 命令 | 结果 |
|---|---|
| `npm run build` | 通过 |
| `npm run format:check` | 通过 |
| `npm run lint` | 通过 |
| `npm run check:package-lock` | 通过 |
| `npx jest tests/unit/agents/CodexCliAgent.project-doc-limit.test.ts --coverage=false --maxWorkers=2` | 7 passed |
| `npm test -- --maxWorkers=2`（保留 `jest --coverage` 与阈值） | 补丁后 17 套件 / 34 用例失败，1313 通过；基线 17 套件 / 34 用例失败，1306 通过；失败集合逐项一致，补丁仅新增 7 个通过用例；退出码 1 原样保留 |

覆盖率（`All files`）：基线 statements 94.19 / branches 85.35 / functions 97.21 / lines 94.31；补丁后 94.2 / 85.38 / 97.21 / 94.32，均满足仓库阈值。

失败项均为 Windows 路径分隔符与 POSIX 断言差异（如 `"/tmp/test/AGENTS.md"` vs `"\\tmp\\test\\AGENTS.md"`），以及稀疏检出排除 72 MB `img/ruler-short.gif` 造成的打包用例 `ENOENT`；与 Codex 警告改动无关。未缩断言、未添加 skip，也未把失败运行写成通过。

## 未验项

- 未调用任何模型、未启动服务、未调大文档预算、未修改宿主信任/权限设置；`project_doc_max_bytes` 被显式调大的消费者行为未实测，警告只按官方文档说明“可能不同”。
- 只测 Codex CLI `0.166.0` 与 Windows 11 原生环境；其他 Codex 版本、macOS/Linux、其他宿主未验。
- 未接入真实个人配置、真实仓库或真实团队工作流；复现规则为公开虚构内容。
- 嵌套 `AGENTS.md` 拆分、MCP、技能、恢复、其他 agent 的生成行为不在本次改动范围；仅验证其他 agent 不误报。
- 未运行 `npm audit` 与 `npm pack --dry-run`（需要额外网络/打包条件，卡片未要求）。
- 未提交、未推送、未改任务文件、未改页面或 `TASKS.md`；结果分支与 review 状态由接收端处理。

## 页外帮助

- 原 issue #791 正文（标题、复现、实际输出、建议）；抓取时 0 条评论、状态 open。
- Codex 官方 AGENTS.md 指南：`project_doc_max_bytes` 默认 32 KiB、按合并预算读取；按目录分作用域不等于给同一加载链增加预算。
- Ruler 上游 `README.md`（agent 输出表、`--local-only`、规则拼接顺序）、`package.json`、CI workflow。
- `codex debug --help`、`codex debug prompt-input --help` 与一次最小项目探测（确认 `AGENTS.md` 以 `<INSTRUCTIONS>` 块进入输入）。
- 上游源码：`src/agents/CodexCliAgent.ts`、`AgentsMdAgent.ts`、`src/core/apply-engine.ts`、`RuleProcessor.ts`、`src/constants.ts` 及相关测试。
- 未读：作者 Ruler headers/backup 实验、旧读者答案、其他 a1dbv 文档。

## 产物

目录：`docs/collaboration/local-jobs/artifacts/A-TEAM-RULER-BUDGET-READER-20261114/`

| 路径 | 内容 |
|---|---|
| `patch/0001-warn-codex-project-doc-limit.patch` | 可复用补丁（3 个文件：实现、常量、7 个回归用例） |
| `patch/README.md` | 适用版本、行为、应用与回归说明 |
| `scripts/check-codex-project-doc-limit.py` | 离线消费者核对脚本（临时 `CODEX_HOME`，不调用模型） |
| `generated/AGENTS.md` | 补丁后真实 CLI 生成的 51241 字节输出（公开虚构规则） |
| `repro/.ruler/` | 六份复现规则与 `AGENTS.md` 源文件 |
| `consumer/codex-visible-instructions.baseline.json` | 基线宿主可见字节与分段 |
| `consumer/codex-visible-instructions.patched.json` | 补丁后宿主可见字节与分段 |
| `consumer/codex-visible-instructions.final.json` | 最终构建后的复算结果 |
| `logs/` | 执行端提及但未提交（被忽略），不计已交付证据 |
| `LICENSE-ruler-MIT.txt` | 上游 MIT 许可原文 |

补丁 `0001-warn-codex-project-doc-limit.patch` SHA-256：`8a1ef8f1b0acdaca39b1c531eb05080bf83d364def17381fe0645a0497669b99`。

## 许可与边界

补丁与复制片段来自 MIT 许可的上游 `intellectronica/ruler`，许可原文随产物附上。公开产物不含本机绝对路径、内网地址、凭据或真实个人材料；生成文件只含虚构规则。本结果只说明该固定提交上的生成端警告与一次隔离宿主复核，不外推到其他版本、平台或团队推广结论。

## dot-A 接收边界（2026-11-18）

Windows 0.166.0 的运行、7 项测试及基线失败集合是执行端报告；缺少未提交的日志，不能独立核其全量失败集合。接收端核输入哈希、51241 字节生成件及前 32768 字节中的六段标记、截断尾文与三份摘要相符；这是文件一致性检查，不是宿主运行证明。

云端 Codex 0.167.0-alpha.4 的隔离离线入口被 sandbox helper 的 socket 目录条件阻断，未取得项目指令输出，未改信任或安全设置；不能把 Windows 结论外推到该版本。此调用未调用模型。输入脚本只隔离 CODEX_HOME，复跑还应隔离 HOME/XDG_CONFIG_HOME，确认无父级项目指令、使用合成内容，原始 prompt JSON 不外发。

原补丁保留为候选，不默认采用：警告中的“拆成嵌套 AGENTS.md”不保证解决同一加载链的总预算；“静默截断”只描述所报版本，不承诺其他版本无警告。按[官方说明](https://learn.chatgpt.com/docs/agent-configuration/agents-md)（本日核），预算是合并指导的上限。应先精简常驻规则、按任务范围放置指导并核实际加载，再按需调整有效预算，不能只把同一长文切成多份。


### 云端生成端独立复跑

Linux、Node 24.22.1、npm 11.9.0；固定同一 Ruler SHA，稀疏检出排除 img，不接真实配置。`npm ci --ignore-scripts --no-audit --no-fund` 后 build 成功。基线真实 CLI 生成 51241 字节、stderr 为空；原补丁 apply/build 成功，7 个定向 Jest 用例通过；补丁后真实 CLI 输出一条警告，生成件与基线以及交回 generated/AGENTS.md 逐字节一致。只证明生成端，未重跑全量测试、MCP、其他客户端或模型行为。可复跑入口见 [commands-receive.md](commands-receive.md)。
