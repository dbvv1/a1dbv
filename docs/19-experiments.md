# 19 · 实测记录

> 核实时间：2026-10-11（UTC+8；E5 于 2026-10-10 UTC 执行）。
> 本篇区分历史模型实验（E1–E3）、确定性回归（E4、E6）和公开数据离线复核（E5）。它们回答不同问题，不能把脚本通过或算术复核写成模型能力提升。

> **2026-10-11 审计补充**：下列 E1–E3 为此前作者的实验记录，本轮未重跑。当前仓库没有提交当时的逐次原始结果、完整 prompts 与注入补丁，因此不能仅凭本文精确复现原表；不补造缺失工件。E3 同时改变了文件长度与测试指令内容，不能把差异全归因于长度。新一轮确定性回归测试见文末，与这些模型实验分开报告。

## 1. 先看结论

| 实验 | 问题 | 观察到的结果 |
|---|---|---|
| **E1 固定开销** | 一个“回复一个词”的请求，在你开口前已经发了多少 token？ | 默认约 **31.6k**，其中约 26k 是工具定义（云端会话的工具较多）。只开 3 个工具降到 5.7k，不开工具降到 2.9k。CLAUDE.md 每 1KB 约多 350 token，输入与缓存计费须分别核对。复现了 Systima 的数量级 |
| **E3 指令文件** | 没有 / 短（2 条）/ 长（LLM 生成、526 行）的 CLAUDE.md，修同一个 bug 有什么差别？ | **27 次全部修好**，测试全过。差别不在成败，而在过程：短文件让回归测试从 2/9 提高到 9/9，并让 Agent 用项目自己的测试命令；长文件的成本是无文件时的 **1.6 倍（Haiku）/ 2.7 倍（Sonnet）**，过程差异与“测试怎么加”的约定一致，但未独立消融该段 |
| **E2 子 Agent** | 同一个只读调查任务，直接做与拆给 2 个子 Agent 做相比如何？ | 同一任务各 3 次均找全 29 处（不是 29 个独立任务），拆分后成本约 **2 倍**、耗时约 **2.7 倍** |

**对实践的含义**：
1. **指令文件只写“Agent 猜不到、又会改变它行为”的东西**：测试命令、测试放在哪、什么不能改。E3 的过程差异与这几行约定一致，但内容与长度一起改变，不能单独证明其余文字只有成本。这与 [03 第 2.2 节](03-context-engineering.md#22-指令文件到底有没有用研究证据)引用的研究一致。
2. **“成功率”这个指标太粗**：对简单任务，有没有指令文件都能修好 bug。要评估配置，就要看过程指标：用了什么命令、是否加了回归测试、测试放在哪里、花了多少钱（见 [09 第 3 节](09-review-and-quality.md#3-给自己的-ai-配置做评估)）。
3. **小的只读任务先用单 Agent 基线**：子 Agent 要从零读上下文，还有协调开销。“上下文容量”与“不同视角”是值得另测的使用情境，不是本实验已验证的收益（见 [08](08-multi-agent.md)）。
4. **headless 和 CI 场景收窄工具**：本次环境中 `--tools=` 大幅减少输入开销，不能外推为其他客户端/缓存策略的固定折扣。

## 2. 环境与方法

| 项 | 设置 |
|---|---|
| Agent | Claude Code 2.1.294，headless 模式：`claude -p --output-format json`（E1）或 `stream-json --verbose`（E2、E3，用来提取每一次工具调用） |
| 模型 | Haiku 5.5 为主；E1 和 E3 各加了一组 Sonnet 5.5，E1 还测了 Opus 5.5 |
| 运行环境 | Claude Code on the web 的云端容器，以 root 运行。**云端会话自带额外工具**，默认开销可能高于本地 |
| 实验仓库 | [hukkin/tomli](https://github.com/hukkin/tomli) @43a86ad（纯 Python 的 TOML 解析器，`src/` 下约 940 行，带完整的 unittest 测试集） |
| 隔离 | 每次运行复制一份干净目录；用新的 `--session-id` 加 `--no-session-persistence`；去掉父会话的会话类环境变量，避免嵌套会话串在一起 |
| 权限 | root 下不能用 `--dangerously-skip-permissions`，改用 `--allowedTools=Read,Edit,Write,Bash,Glob,Grep` 预先放行 |
| 成本 | 取结果里的 `total_cost_usd`（包含子 Agent） |

**踩过的坑**（复现时注意）：
- `--tools` 是可变参数，`--tools Read,Edit "prompt"` 会把提示词也当成工具名，报 “Input must be provided”。要写成 `--tools=Read,Edit`；
- `--bare` 在这个环境里报认证错误，没能测到最小开销；
- 不给 stdin 时会多等 3 秒，要把 stdin 指向 `/dev/null`；
- 这个仓库的测试要用 `PYTHONPATH=src python3 -m unittest`，`unittest discover -s tests` 会因相对导入失败。正是这种“猜不到的命令”构成了 E3 中短指令文件的内容。

## 3. E1：固定开销

**方法**：在空目录里发一句“只回复 OK”，记录 `input_tokens + cache_creation_input_tokens + cache_read_input_tokens`。

| 条件 | 每次请求的输入 token | 备注 |
|---|---|---|
| 默认（Haiku 5.5） | **31,558** | 其中 26,709 命中了**跨会话的**提示缓存 |
| 默认（Sonnet 5.5 / Opus 5.5） | 30,784 / 30,384 | 和模型基本无关 |
| `--tools=Read,Edit,Bash` | 5,661 | 只留 3 个工具 |
| `--tools=`（不开工具） | 2,939 | ≈ 系统提示本身 |
| `--disable-slash-commands` | 37,651 | **反而多了约 6k**，可复现（3 次一致），原因不明 |
| + CLAUDE.md 2KB | 32,495（+937） | |
| + CLAUDE.md 20KB | 38,862（+7,304） | |
| + CLAUDE.md 72KB | 57,299（+25,741） | Systima 报告约 +20k，同一数量级 |

**一个词的回复要多少钱**：Haiku 5.5 约 0.0012 美元（大部分命中缓存）；Opus 5.5 约 0.052 美元。

**解读**：
- 约 31.6k 中，约 26k 来自工具定义，这和 Systima 抓包得到的“开口前约 33k”是同一量级。云端会话自带的远程工具可能让这个数偏大；
- 指令文件每 1KB 约增加 350 token（英文 ASCII 文本），而且**每一轮**都要付：在 E3 的长文件条件下，Haiku 平均 13.5 轮，每轮都带着这约 1 万 token（30KB）；
- 提示缓存能跨会话命中，所以“开口前的 token”在价格上打了折（缓存读取约为正常价格的 1/10），但**上下文窗口的占用一点不少**。

## 4. E3：指令文件长短

**任务**：在 tomli 里埋一个真实感的 off-by-one bug（`parse_hex_char` 中 `pos += hex_len` 改成 `pos += hex_len - 1`），让 `s = "café"` 解析成 `café9`，导致 14 个测试失败。提示词只描述用户看到的症状：“用户报告解析 `s = "café"` 得到 `café9` 而不是 `café`，请修复。”

**三种条件**：

| 条件 | CLAUDE.md 内容 |
|---|---|
| **A 无** | 没有 CLAUDE.md |
| **B 短** | 2 条、约 250 字节：测试命令（并说明 `discover -s tests` 不能用）；修 bug 要加回归测试，不能改弱或删除已有测试 |
| **C 长** | 让 Haiku 5.5 “全面分析仓库，写一份详尽的 CLAUDE.md”，得到 526 行、约 30KB：项目概览、每个模块的架构、构建测试命令、约定、坑、贡献流程。**这就是 `/init` 式自动生成的典型产物** |

**每次运行后自动检查**：
- 完整测试集是否通过；
- 是否新增了测试，以及**把源码还原成有 bug 的版本后，新测试是否失败**（证明它真的是回归测试）；
- 从 stream-json 里提取每一条 Bash 命令：用的测试命令是什么、是否越界改动。

**结果**（Haiku 5.5 每种条件 6 次，Sonnet 5.5 每种 3 次）：

| | A 无 | B 短 | C 长 |
|---|---|---|---|
| 修好 bug、测试全过 | 9/9 | 9/9 | 9/9 |
| 加了回归测试 | **2/9**（Haiku 2/6，Sonnet 0/3） | **9/9** | 8/9（Haiku 6/6，Sonnet 2/3） |
| 新测试在有 bug 的代码上会失败 | 2/2 | 9/9 | 8/8 |
| 回归测试放在哪 | `test_misc.py` | `test_misc.py` | **`tests/data/valid/*.toml` + `.json`**（项目自己的数据驱动测试） |
| 用的测试命令 | **pytest**（环境里碰巧装了） | 项目的 unittest 命令 | 项目的 unittest 命令 |
| 平均成本 Haiku / Sonnet（美元） | 0.0066 / 0.047 | 0.0070 / 0.050 | **0.0106 / 0.125** |
| 平均输入 token Haiku / Sonnet | 161k / 56k | 163k / 54k | **309k / 162k** |
| 平均轮数 Haiku / Sonnet | 12.3 / 7.7 | 12.5 / 7.3 | 13.5 / 8.0 |
| 耗时中位数 Haiku / Sonnet（秒） | 27.6 / 22.7 | 27.7 / 20.1 | 35.0 / 31.8 |

**解读**：
1. **简单任务上，指令文件不决定成败**。症状清楚、测试完备时，没有任何指令 Agent 也能修好；
2. **短文件以几乎为零的成本改变了行为**：回归测试从 2/9 变成 9/9，测试命令变成项目约定的那一个。成本只多 6% 左右；
3. **长文件的行为改进来自其中一小段**：C 把测试加在 `tests/data/valid/` 下，是因为长文件里有一段“改解析器行为时，在 `tests/data/valid/<area>/` 加 `.toml` 和对应的 `.json`”。这条约定确实更贴合项目习惯，但它只有几行，完全可以放进短文件里；
4. **长文件的代价是实打实的**：Haiku 贵 60%、Sonnet 贵 165%，耗时多 25–40%。模型越贵，固定开销的绝对值越大；
5. **没有指令时，Agent 会用自己的默认工具**：A 条件全部用 pytest。这次环境里恰好装了 pytest，所以没出问题；如果没装，Agent 可能去装依赖或者绕路。“项目用什么命令”正是 Agent 猜不到的信息。

**局限**：
- 只有一个任务、一个仓库，n 很小（每格 3–6 次）；
- bug 比较简单，没测到“难任务上指令文件是否帮忙”；
- C 文件由 Haiku 生成，换更强的模型生成，质量可能不同；
- 回归测试的差异有一部分是因为 B 和 C **明确要求**了加测试。这本身就是结论：把要求写下来，Agent 就照做；不写，它多半不做。

## 5. E2：子 Agent 的成本

**任务**（只读）：列出 `src/tomli/` 中所有抛出 `TOMLDecodeError` 的位置，给出 `file:line` 和触发条件，输出一张表和总数。标准答案用 grep 得到：29 处，全部在 `_parser.py`。

| 条件 | 提示词差异 |
|---|---|
| **D 直接做** | “自己做，不要用子 Agent” |
| **S 子 Agent** | “用 Agent 工具并行启动两个子 Agent：一个看 `_parser.py` 第 1–450 行，另一个看其余部分，然后合并结果” |

两组都用 Haiku 5.5，工具为 `Read,Glob,Grep,Bash,Agent`，各 3 次。

**结果**：

| | D 直接做 | S 两个子 Agent |
|---|---|---|
| 找全 29 处 | 3/3 | 3/3 |
| 平均成本（美元） | 0.0055 | **0.0109**（约 2.0 倍） |
| 平均输入 token（含子 Agent） | 61k | 108k（约 1.8 倍） |
| 平均耗时（秒，墙钟） | 17.6 | **47.1**（约 2.7 倍；30.8–70.2） |
| 主 Agent 轮数 | 6 | 1–4 |

**解读**：
- 对这种“一个文件、grep 就能定位”的任务，拆分只增加了开销，结果没有变好。与 Systima 的观察方向一致（同一小任务 12.1 万 → 51.3 万 token），但本次的倍数更小，因为工具集只有 5 个，每个子 Agent 的固定开销较小；
- 耗时变长，是因为子 Agent 要从零读文件，主 Agent 还要等两个子 Agent 都返回后再合并；
- 直接做的那组在一次运行中还**主动说明了排除项**（第 118 行只是警告字符串里提到了异常名，第 709 行抛的是 `RecursionError`），说明单个 Agent 掌握全局时更容易做出这类判断。

**什么时候拆分才划算**（结合 [08](08-multi-agent.md) 的研究）：
- 输出量大到会挤占主上下文（几十个文件的审计、长日志分析）；
- 需要不同视角（安全、性能、测试分别评审）；
- 子任务真正独立，并且每个子任务本身就足够大，能摊薄固定开销。

## 6. 如何在自己的仓库复现

1. **准备**：选一个有测试的仓库，埋一个会让测试失败的小 bug，提交成基线；
2. **每次运行复制一份目录**，放进不同的指令文件；
3. **运行**：

   ```bash
   claude -p --no-session-persistence --session-id "$(uuidgen)" \
     --output-format stream-json --verbose \
     --model claude-haiku-5-5 \
     --tools=Read,Edit,Write,Bash,Glob,Grep \
     --allowedTools=Read,Edit,Write,Bash,Glob,Grep \
     "<只描述症状的提示词>" < /dev/null > run.jsonl
   ```

4. **检查**：
   - 跑完整测试；
   - `git diff --numstat` 和 `git ls-files --others` 看改了什么；
   - `git stash push -- src` 把源码还原成有 bug 的版本，看新测试是否失败，再 `git stash pop`；
5. **提取过程**：从 `run.jsonl` 中 `type == "assistant"` 的消息里取出 `tool_use`，统计 Bash 命令；`type == "result"` 的事件里有 `total_cost_usd`、`num_turns` 和 `usage`；
6. **重复运行并保留每次记录**：三次只是先导，不保证统计把握；同一配置的成本在不同运行之间可以相差 2 倍（E3 中 Haiku 的 B 条件最低 0.0055、最高 0.0120 美元）。

## 7. E4：模板的确定性回归（2026-10-11 UTC+8）

**[经验：实测]** 本轮在 Linux、Python 3.12.14、Bash 环境验证仓库改动，基线为 `73905442b2da0a473573d1e98b65752613ad29f6`。所有引擎、配置与路径均用临时合成夹具；没有读取真实个人配置或执行 Unity / Unreal。

| 检查 | 实際结果 | 不能由此推导 |
|---|---|---|
| 引擎报告验证 | 6 个测试方法、66 次模拟引擎执行通过；同一扩展测试集对基线脚本出现 43 个失败子用例 | 真实引擎所有版本 schema 都兼容 |
| 长任务验收记录 | 16 个用例通过；旧版本证据、缺项、未完成 worker、预算停止、坏 JSON 均有反例 | 模型真的做完了任务或日志真实 |
| 配置导出 | 18 个用例通过；扫描失败不落地、README 检测、符号链接、旧目录、暂存篡改等 | 自动脱敏完整或可安全无人发布 |
| 模板叠加 | 7 个用例通过；保护规则、REVIEW、空目录保护、重复操作、末尾斜线及父级符号链接 | 实际 Claude 权限和引擎环境已测试 |
| 文档/配置检查器 | 6 个用例通过；本地链接与 JSON/TOML/example 语法 | 外链、锚点和全部内容事实已验证 |

合计 **53 个 unittest 方法通过**。模型调用数、token 和订阅消耗没有测量；不能把此表与 E1–E3 的模型实验混为一组。

可复现命令（Python 3.11+；Bash）：

```bash
python3 -m unittest discover -s tests -v
python3 scripts/check_repo.py
find . -name '*.sh' -not -path './.git/*' -print0 | xargs -0 -n1 bash -n
git diff --check
```

源码与测试：[测试目录](../tests/)、[任务记录校验器](../scripts/validate_task.py)、[仓库检查器](../scripts/check_repo.py)。基线对照使用临时目录里的旧脚本加同一套新测试，未替换工作树中的修复版本。测试数量按这一轮记录；以后变更应重跑并保留失败证据。

### 一次 Skill 恢复行为探测（不是运行时兼容测试）

**[经验：单次合成探测]** 给独立云端 agent 两个新 Codex Skill 正文和一份有意不一致的合成任务：当前 spec v3 / 工作版本 c2+dirty:a7；旧报告 spec v2/c1；旧日志 8 passed；worker 仅有“运行中”；外部任务 J17 超时且结果未知；另一任务曾有发布批准，当前只许准备补丁。

观察：输出拒绝验收，逐项指出陈旧证据、缺最终 worker 回执、未知外部结果；不重发 J17，不沿用另一任务的发布授权，给出核对与重验步骤。未运行真实代码，也没有改任何外部任务。

这只是一次直接提供 Skill 正文的行为探测，没有测试自动发现/触发、Codex 客户端、压缩机制、真正中断恢复或成功率分布。下一步应按 [20 的实验表](20-codex-long-horizon.md#8-下一轮实测不把建议写成实验结论) 做受控对照；未运行的实验保持待验证。

## 8. E5：公开结果表的离线复核

**[经验：实测，2026-10-10 UTC]** 对 Khatri 的 [上下文文件实验结果表](https://github.com/codeprakhar25/context-files-coding-agents/blob/084c40708e7211b0e6a0fe8d74337b2e048a832c/data/results_summary.csv)做 Python 标准库算术复核；没有运行模型、付费 API、原测试或重算论文显著性。

- 固定 commit：`084c40708e7211b0e6a0fe8d74337b2e048a832c`
- CSV SHA256：`96809726f635925bfe7cc0f91cbfea85d2b5ff7fc116a5934e168e2e280505f9`
- 291 行、288 个 `(agent, strategy, task_id, repeat_index)` 单元；**没有完全相同的重复行**，而是 3 个单元各有两条不同运行记录

| 条件 | 原始全行通过数/行数 | 每单元取最新记录通过数/单元数 |
|---|---|---|
| Claude / none | 25/47 | 24/45 |
| Claude / always_on | 25/46 | 25/45 |
| Claude / selective | 25/45 | 25/45 |
| Codex / none | 30/51 | 30/51 |
| Codex / always_on | 29/51 | 29/51 |
| Codex / selective | 27/51 | 27/51 |

取最新或最早都得到同一组正确性计数，与作者的 [计数溯源](https://github.com/codeprakhar25/context-files-coding-agents/blob/084c40708e7211b0e6a0fe8d74337b2e048a832c/paper/data/key_numbers.md)一致；README 的直接全行 groupby 则不同。重复单元的 run ID、时间和执行指标不同，可能是重跑，但**CSV 不能证明重试原因或作者原定取舍政策**。54 条 Codex 记录的 run ID 为空，因此不能拿 run ID 去重。

**含义**：这是汇总口径的可复核歧义，不是论文结论被推翻或不当行为证据。正确性标签相同不代表成本数据也能随便取一条。本仓库提供 [离线脚本、13 个单测及复核说明](../experiments/context-results-audit/)，不附带第三方 CSV；按固定链接取得后，脚本校验 hash 并同时输出三种口径。

## 9. 下一次 Codex 实验：先导，不预报收益

**[经验：实验建议，未运行]** 最小问题：“只加一段项目特有的验证指令，是否减少漏验，而不增加人工返工？”

已有 [workflow-ablation 夹具](../experiments/workflow-ablation/)演示隔离、验收与记录机制；它是单一合成任务，不是下面 6 个真实任务已准备好，更不是已取得模型效果数据。

1. 先准备 2 个校准任务、另留 6 个真实评估任务，覆盖 bug、功能、测试、跨文件改动与无需改生产代码的反例；验证器在已知好/坏补丁上先过自测
2. 基线和处理组保留相同安全约束，只增加一项 Skill/指令；6 任务 × 2 条件 × 2 次新会话 = 24 次先导，随机交错 A/B，固定模型、effort、权限和预算
3. 分别记严格验收、有效回归测试、错误完成声明、耗时、可用用量和盲评人工分钟；是否加载 Skill 只是操纵检查；隐藏答案和测试不放进 agent 工作区
4. 明显回归、未加载或环境不等价就停止诊断；全过只能比较过程，不能宣称正确率提高；有稳定机制后再用新任务扩大评估，按方差决定重复数

只有已获授权的订阅环境才运行；不为本实验开 API 计费、买额度或启动额外付费服务。订阅内也消耗配额与时间。现在可免费完成验证器、日志 schema 和已公开数据的复核；这些准备工作本身不证明模型效果。

## 10. E6：路径 Hook 的确定性回归

**[经验：离线实测，2026-10-11 UTC+8]** 对基线提交 `445b8168fa1fc7124bed4d89d1b4f0f74265b72d` 的 `protect-paths.sh` 构造临时规则与 JSON 事件，复现三类问题：`./` / `..` 别名漏匹配、JSON 解析错误被返回 0 掩盖，以及原因中的控制字符生成非法输出 JSON。没有读写真实受保护文件或调用 Claude Code。

修正保留 jq 或 python3 二选一；使用完整 JSON 序列化，验证字段类型并传播错误，按事件 cwd 做词法路径归一。盘符兼容性回归在发布前被发现并修正；通用 / Unity / Unreal 三份脚本必须逐字相同。

```sh
python3 -m unittest discover -s tests -p test_protect_paths.py -v
TEST_PARSER=jq python3 -m unittest discover -s tests -p test_protect_paths.py -v
```

每种后端各 26 个测试方法通过，第二次是同一组测试换解析器，不是额外 26 个独立任务。缺少某后端时对应测试可能跳过；完整双后端验证必须确认 jq 与 python3 均存在且输出没有 skip。测试会隔离 PATH，只提供被测解析器和必要工具，子进程有 10 秒超时。

明确限制：状态 1 不是 deny 决定，不保证运行时阻止；缺规则 / 缺路径 / 项目外路径仍无决定。词法 `..` 不等于符号链接解析；继承反斜杠替换约定，不覆盖所有合法 POSIX 文件名。盘符与 UNC 仅为 Linux 上的合成输入，未测 Windows 原生路径语义、大小写、macOS、Bash 3.2、真实 Hook 触发、并发修改或所有规则语法。不会因此把辅助 Hook 描述为文件系统安全边界；没有修改 settings 或权限。

## 来源

- 实验仓库：[hukkin/tomli](https://github.com/hukkin/tomli)（MIT）
- 对照：[Systima：Claude Code vs OpenCode token 开销](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)
- Claude Code 文档：[Headless / CLI reference](https://code.claude.com/docs/en/cli-reference)、[Subagents](https://code.claude.com/docs/en/sub-agents)
