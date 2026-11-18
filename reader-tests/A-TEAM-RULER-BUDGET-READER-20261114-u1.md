# A-TEAM-RULER-BUDGET-READER-20261114 · u1 读者记录

## 身份与独立性

- 首次读 `docs/18-team-adoption.md@55937fe5e473121b408697d21358fa1b0edada3c` 这一页，也是首次做 Ruler #791 这道题。
- 未参加本页或本题的先前读者单元，未读作者 Ruler headers/backup 实验、旧读者答案或其他 a1dbv 文档，未修改页面、`TASKS.md`、答案页或其他卡。
- 页面全文按任务文件 JSON 解码；UTF-8 SHA-256 为 `ea701c42c5af3b5e848b5fa8c78866327a1ac71e45be055dba7cc6141f0dcd44`，与要求一致，且与附带明文本相同。

## 做到哪一步

在隔离目录完成到“真实 CLI 补丁后回读”这一步：

1. 固定 Ruler `0.3.46`（`b905f192d84e340d6c9723ff8eadfa6dbc9be8b6`），确认原 issue 未修。
2. 用公开虚构的六份约 8 KB 规则复现：基线生成 `AGENTS.md` 51241 字节，`ruler apply` 无警告。issue 未给出规则原文，按公开描述重建，故字节数与 issue 记录的 50837 略异，但同样超过 32 KiB 且分段可见性一致。
3. 用 Codex CLI 0.166.0 的离线 `codex debug prompt-input` 核对：模型可见指令正好 32768 字节，`# Rules for part 1`–`part 4` 在，`part 5`、`part 6` 不在，截断在 `Rule 4.38` 行中。
4. 在 `CodexCliAgent` 生成 `AGENTS.md` 后补一条超过默认 32 KiB 的警告；不改内容、不建/改 `.codex/config.toml`、不改 `project_doc_max_bytes`、其他 agent 不报警。
5. 重新构建真实 CLI 并回读：警告出现一次，文件仍 51241 字节且与基线逐字节相同；第二次 apply 仍提示一次；消费者仍只读到 32768 字节。
6. 跑通 `build`、`format:check`、`lint`、`check:package-lock` 与新增 7 个定向测试；全量 `npm test -- --maxWorkers=2` 的失败集合与未打补丁基线逐项一致。

产物在 `docs/collaboration/local-jobs/artifacts/A-TEAM-RULER-BUDGET-READER-20261114/`：`result.md`、`patch/`、`scripts/check-codex-project-doc-limit.py`、`generated/`、`repro/`、`consumer/`、`logs/`、`LICENSE-ruler-MIT.txt`。

## 卡点：页面哪一句、缺什么、做错过什么

| 页面上的句子 | 缺什么 | 做错过什么 / 怎么处理 |
|---|---|---|
| §4「已有生成器分发共享规则时，连着验首次写入、下一次更新和恢复。」 | 这句把生成器维护指向写入/更新/恢复闭环，没有把“生成成功”与“宿主实际读到”分开，也没有 32 KiB、`project_doc_max_bytes` 或 `codex debug prompt-input`。 | 先按字面找“恢复入口”，发现与 #791 的宿主读取上限不是同一机制；改按任务边界只补生成端警告，并读原 issue 补齐消费者核对。 |
| §4 依据行只列 Ruler #775、补丁 #808 和作者 headers/backup 实验。 | 没有 #791 的固定提交、构建方式、隔离 HOME/XDG/CODEX_HOME 与宿主核对步骤。 | 读 issue #791、上游 README/`package.json`/CI 和 Codex 官方 AGENTS.md 指南；刻意不读作者实验。 |
| §4「先按组织、仓库、个人三层放配置……」 | 没有说明 32 KiB 警告应落在哪个 agent、写哪条输出路径、如何避免其他 agent 误报。 | 先读上游 `CodexCliAgent.ts`、`AgentsMdAgent.ts`、`apply-engine.ts`、`RuleProcessor.ts`，按实际生成路径实现；再用真实 `--agents claude` 跑一遍确认不误报。 |
| §4「跨客户端共享前先核配置能力。」 | 只有原则，没有 Codex 侧只读验证入口或输出结构。 | 用 `codex debug --help` / `debug prompt-input --help` 和一个最小项目探明 JSON；在隔离 `CODEX_HOME` 下执行，不调用模型。 |
| §4「这里验证配置维护的局部机制，不新增生成器默认推荐……」 | 没说明 32768 属于消费者默认还是生成器默认，读者需自行判断。 | 把 32768 只作为 Codex 文档默认的警告阈值，不改变生成内容或配置。 |

其他返工（不在页面上）：

- 先试完整 `git clone` 和提交 tarball，仓库含 72 MB `img/ruler-short.gif`，两方式 20 分钟未完成，停止自有下载；改用 `git fetch --filter=blob:none` + sparse checkout（排除 `img`）。
- 第一次稀疏检出只取 `src tests .github`，漏了 `.ruler/`、`test-qa/`，`cli-version` 打包用例报缺 `.ruler/AGENTS.md`；补齐后失败集合与基线一致。剩余 `ENOENT` 定位到被排除的 72 MB GIF。
- Windows `core.autocrlf=true` 使检出为 CRLF，`prettier`/`eslint` 把整文件报成 `Delete ␍`；统一 LF 并把该克隆 `core.autocrlf` 设为 `false`。
- 多字节测试最初按字符数预期 `33000 bytes`，实际按文件字节（含 28 字节生成标记）为 `33028 bytes`；改为按 `Buffer.byteLength + 标记字节` 计算。
- 第一次全量测试在缺根目录时运行，出现 17 套件失败；补齐后与基线失败集合一致，未把环境失败当作补丁通过。

## 页面之外还去翻了什么

- GitHub 原 issue #791 正文与评论（抓取时 0 条评论、状态 open）。
- Codex 官方 AGENTS.md 指南（`project_doc_max_bytes` 默认 32 KiB、静默丢弃、嵌套拆分/调高）。
- Ruler 上游 `README.md`、`package.json`、`.github/workflows/ci.yml`。
- `codex debug --help`、`codex debug prompt-input --help`。
- 上游源码与测试：`src/agents/CodexCliAgent.ts`、`AgentsMdAgent.ts`、`src/core/apply-engine.ts`、`RuleProcessor.ts`、`src/constants.ts`、`tests/unit/agents/CodexCliAgent.test.ts`。

## 未做与限制

- 未调用模型、未启动服务、未调大文档预算、未改宿主信任/权限设置；`project_doc_max_bytes` 被显式调大的消费者行为未实测。
- 只测 Codex CLI 0.166.0 + Windows 11 原生环境；其他版本/平台未验。
- 未接入真实个人配置、真实仓库或团队工作流；规则为公开虚构内容。
- 未提交、未推送、未切换分支、未改任务文件；未安装全局软件、未使用凭据、未开付费服务。

## 核对

**核对结论：读者做成。** 在独立 sparse checkout 的 Ruler `b905f192d84e340d6c9723ff8eadfa6dbc9be8b6` 上重新应用补丁、构建、运行真实 CLI 和消费者只读入口，读者记录的关键数字与行为均可复现；未发现补丁功能错误。页面 hash 也独立解码核对：`page_text` 46639 字节 / SHA-256 `ea701c42c5af3b5e848b5fa8c78866327a1ac71e45be055dba7cc6141f0dcd44`，与仓库 `HEAD` 的 `docs/18-team-adoption.md` 相同。

### 独立实测（不复用读者结论）

- `patch/0001-warn-codex-project-doc-limit.patch` 在固定提交副本上 `git apply --check` 通过；补丁后 `npm run build`、`npm run format:check`、`npm run lint`、`npm run check:package-lock` 均通过。
- 基线（未打补丁）`ruler apply --agents codex --local-only`：退出 0、stderr 空、`AGENTS.md` 51241 字节；补丁后同字节、stderr 一条 502 字节警告；第二次 apply 仍一条警告；补丁前后文件 hash 相同。
- `generated/AGENTS.md` 与由 `repro/.ruler/` 七份输入按上游 `concatenateRules` 规则重建的内容逐字节相同（51241 字节），生成结果可复现。
- `--agents codex,codex`、`--agents codex,agentsmd` 各一条警告；`--agents claude` 生成 51213 字节 `CLAUDE.md` 且 stderr 空；`--agents agentsmd` 生成 51241 字节 `AGENTS.md` 且 stderr 空；两者六段齐全。
- 消费者：`codex debug prompt-input` 的 `<INSTRUCTIONS>` 内容恰为 `AGENTS.md` 前 32768 字节；part1–4 在、part5–6 不在，截断在 `Rule 4.38` 行中；补丁前后不变。`scripts/check-codex-project-doc-limit.py` 独立运行得到与 `consumer/*.json` 相同的 JSON。
- 定向测试 7 passed。全量 `npm test -- --maxWorkers=2`：补丁后 17 failed / 147 passed / 164 suites，34 failed / 1 skipped / 1313 passed；基线 17 / 146 / 163，34 / 1 / 1306；两者失败用例名集合 diff 为空，退出码 1 保留；覆盖率 `94.2/85.38/97.21/94.32` 与 `94.19/85.35/97.21/94.31` 均与读者记录一致。
- 额外核对：带 `.ruler/mcp.json` 时既有 MCP 合并会重写并格式化 `.codex/config.toml`（`65536` 变成 `65_536`），值保留；这是上游既有行为，不是本补丁引入。

### 卡点判断

| 卡点 | 判断 | 说明 |
|---|---|---|
| §4「已有生成器分发共享规则时，连着验首次写入、下一次更新和恢复。」 | page | 页面把维护闭环与宿主读取上限混在一起，缺 32 KiB、`project_doc_max_bytes`、`codex debug prompt-input`；读者改按生成端警告并在消费者侧核对，处理正确。 |
| §4 依据行只列 Ruler #775、补丁 #808 与作者 headers/backup 实验 | page | 页面依据没有 #791 的固定提交、隔离 HOME/XDG/CODEX_HOME、构建与宿主核对入口；读者另读 issue 和上游材料补齐。 |
| §4「先按组织、仓库、个人三层放配置……」 | page | 治理分层不含实现层的 agent 选择、输出路径和去重；属页面范围外的源码细节，读者查上游 `CodexCliAgent`/`apply-engine` 解决，未出错。 |
| §4「跨客户端共享前先核配置能力。」 | page | 只有原则，没有 Codex 侧只读验证入口与输出结构；读者用 `codex debug --help` 和最小项目探明。 |
| §4「这里验证配置维护的局部机制，不新增生成器默认推荐……」 | page | 页面没有说明 32768 是消费者默认还是生成器默认；读者按 Codex 官方文档把它作为消费者默认的警告阈值，判断正确。 |
| 复现准备（页面未写构建/下载方式） | model | 页面不是上游仓库的构建/下载指南；完整 clone 与 tarball 因 72 MB `img/ruler-short.gif` 超时属取源策略与仓库体积问题，改用 blobless + sparse checkout 解决，读者也归入“其他返工”。 |
| 首次稀疏检出、换行符与多字节断言 | model | 稀疏范围漏 `.ruler`/`test-qa`、Windows `core.autocrlf=true` 造成 CRLF、多字节断言漏算 28 字节标记，均为读者执行或环境配置错误，已修正并复跑；不是页面问题。 |

### 读者未意识到的问题

1. `result.md` 写“输入文件 SHA-256 见 `repro/.ruler/` 产物”，但该目录只有七份规则文件，没有 hash 清单；应补一份 `sha256sum` 输出，或删掉这句。
2. `result.md` 回归表“生成文件与既有 `.codex/config.toml`：内容不变”只在无 MCP 负载时成立；带 `.ruler/mcp.json` 时上游 MCP 合并会重写该文件（示例 `65536` → `65_536`，值保留）。补丁本身不改 MCP，MCP 也在范围外，但该断言缺少限定。
3. `patch/README.md` 的应用命令只写裸文件名 `0001-...patch`；在干净副本根目录照抄时找不到该文件，应写成从补丁所在目录应用或先复制补丁的路径。

### 本次核对的限制

- 只在本机 Windows 11、Node `v22.23.2`、Codex CLI `0.166.0` 上复核；Linux/macOS、其他 Codex 版本、其他宿主未验。
- 未验证读者“未读作者实验/旧读者答案”的负向声明；产物中没有发现相关复用痕迹。
- 未运行 `npm audit`、`npm pack --dry-run`；未调大 `project_doc_max_bytes` 或测试多字节内容的消费者截断，这些仍在读者列出的未验项内。
- 全量测试的 17 个失败套件在基线与补丁后完全相同；已抽样确认其为 Windows 路径断言与缺失 `img/ruler-short.gif` 的 `ENOENT`，未逐条诊断全部 34 个失败用例。