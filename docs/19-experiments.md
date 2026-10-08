# 19 · 实测记录

> 核实时间：2026-10-08。
> 本篇的数据都是本仓库在一个云端会话里**亲手跑出来的** **[经验：实测]**。样本小、只用了一个开源项目，所以结论只说明“在这个条件下观察到了什么”，不要外推成普遍规律。方法和脚本思路都写在文中，便于在你自己的仓库里复现。

## 1. 先看结论

| 实验 | 问题 | 观察到的结果 |
|---|---|---|
| **E1 固定开销** | 一个“回复一个词”的请求，在你开口前已经发了多少 token？ | 默认约 **31.6k**，其中约 26k 是工具定义（云端会话的工具较多）。只开 3 个工具降到 5.7k，不开工具降到 2.9k。CLAUDE.md 每 1KB 约多 350 token，**每次请求都要付**。复现了 Systima 的数量级 |
| **E3 指令文件** | 没有 / 短（2 条）/ 长（LLM 生成、526 行）的 CLAUDE.md，修同一个 bug 有什么差别？ | **27 次全部修好**，测试全过。差别不在成败，而在过程：短文件让回归测试从 2/9 提高到 9/9，并让 Agent 用项目自己的测试命令；长文件的成本是无文件时的 **1.6 倍（Haiku）/ 2.7 倍（Sonnet）**，它真正起作用的只是其中一段“测试怎么加”的约定 |
| **E2 子 Agent** | 同一个只读调查任务，直接做与拆给 2 个子 Agent 做相比如何？ | 结果质量相同（29/29 全部找到），拆分后成本约 **2 倍**、耗时约 **2.7 倍** |

**对实践的含义**：
1. **指令文件只写“Agent 猜不到、又会改变它行为”的东西**：测试命令、测试放在哪、什么不能改。E3 里决定行为差异的就是这几行，其余几百行只增加成本。这与 [03 第 2.2 节](03-context-engineering.md#22-指令文件到底有没有用研究证据)引用的研究一致。
2. **“成功率”这个指标太粗**：对简单任务，有没有指令文件都能修好 bug。要评估配置，就要看过程指标：用了什么命令、是否加了回归测试、测试放在哪里、花了多少钱（见 [09 第 3 节](09-review-and-quality.md#3-给自己的-ai-配置做评估)）。
3. **小的只读任务不要拆子 Agent**：子 Agent 要从零读上下文，还有协调开销。拆分的价值在“任务大到会撑爆主上下文”或者“需要不同视角”时才体现（见 [08](08-multi-agent.md)）。
4. **headless 和 CI 场景收窄工具**：`--tools=` 能把固定开销砍掉八成以上。

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
6. **每种条件至少跑 3 次**：同一配置的成本在不同运行之间可以相差 2 倍（E3 中 Haiku 的 B 条件最低 0.0055、最高 0.0120 美元）。

## 来源

- 实验仓库：[hukkin/tomli](https://github.com/hukkin/tomli)（MIT）
- 对照：[Systima：Claude Code vs OpenCode token 开销](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)
- Claude Code 文档：[Headless / CLI reference](https://code.claude.com/docs/en/cli-reference)、[Subagents](https://code.claude.com/docs/en/sub-agents)
