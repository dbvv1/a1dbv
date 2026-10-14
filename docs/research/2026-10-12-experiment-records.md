主线：二为主，兼三
改变的建议：短指令只留会改变行动的项目约束；独立调查或已定接口的实现可并行，单文件 grep 不默认拆。任务结果、过程遵从、等待与 API 等价估算分别比较；worktree 验证还须识别配置、服务和最终产物；委派先核宿主审批、并发口径与恢复动作。[经验：限定采用]
证据摘要：历史 E1–E3 与补交轨迹算术核对；E3 单一 bug 的 27 次报告均修好，但测试约定与文件长度混杂，E2 拆分成本及等待更高。E4/E6 是确定性回归，E5 是 CSV 复算；后补并行论文有正反例，仍缺完整验收与人审投入，不能外推普遍效率；后补 Git 配置夹具、Playwright 复用源码及 Cargo 维护者反证，区分编辑隔离和运行状态。10-15补Codex发行源码与Claude宿主文档、两作者故障反例；不是客户端实测。[经验／研究／一手]

# 历史实验与确定性检查：方法、原表与证据缺口


> 资料整理：2026-10-12；补交记录复核：2026-10-13（UTC+8）。这里承接 [19 正文](../19-experiments.md) 的实验参数、精确历史表、复现命令与检查范围，采用建议只维护在正文。“本轮”和测试数量仍指各节原运行，不是此次迁移时重跑。E1–E3 是原作者报告；E4/E6 为确定性测试，E5 为公开 CSV 的算术复核，不能合成模型收益结论。

## 产物状态与引用口径

E1–E3 的实验未重跑。[experiments/claude-e1-e3](../../experiments/claude-e1-e3/README.md) 已公开精简轨迹、提示词、埋 bug 补丁和脚本；`c874984` 于 2026-10-13 补交 `logs/` 汇总及 `/context` 分项。本次仅用 Python 标准库读取这些公开记录、复算数字，不调用模型；主要历史汇总吻合，不将算术核对升级为独立模型复现。**[经验：历史记录与独立算术核对]**

**样本与可复算边界**：E1 有 13 行，其中一次 `--bare` 认证失败，不能把零输入当成有效低开销结果；同日 API 补测为 6 行，`/context` 为 7 条，其中禁用斜杠命令条件没有分项。E2 为 D/S 各 3 次；E3 为 Haiku 18 次、Sonnet 9 次，冒烟轨迹 `A-haiku-0` 不计入。E3 的 27 条 `tests_after` 均为 `OK (skipped=1)`，测试文件改动数对应 A/B/C 的 2/9、9/9、8/9；这不等于本侧重新执行测试或确认新增测试能杀死旧 bug。逐轮完整最终补丁及回退源码后的验证输出未作为完整产物保留，E1 的三份指令文本和逐次 stream 也仍缺失。**[经验：公开产物核对]**

原 E1 缓存读取数不能拆出工具定义；2.1.296 的 `/context` 补测支持下方新分项，只与 2.1.294 作同量级对照。E3 同时改变文件长度和测试约定，原解读中的局部归因未独立消融。以下美元及成本倍数均为历史客户端报告的 API 等价估算，不能作为账单或订阅扣额。早期审计原时点见 [2026-10-10 记录](2026-10-10-audit.md#3-历史实验的证据缺口)。

## 1. 原报告总览

E1 检查固定输入开销，E3 比较指令文件，E2 比较同一只读任务的拆分；精确结果和各自限制见下方原表，不另复制汇总。美元均为历史 API 等价估算；采用建议统一维护在 [19](../19-experiments.md)。

## 2. 环境与方法

| 项 | 设置 |
|---|---|
| Agent | Claude Code 2.1.294，headless 模式：`claude -p --output-format json`（E1）或 `stream-json --verbose`（E2、E3，用来提取每一次工具调用） |
| 模型 | Haiku 5.5 为主；E1 和 E3 各加了一组 Sonnet 5.5，E1 还测了 Opus 5.5 |
| 运行环境 | Claude Code on the web 的云端容器，以 root 运行。**云端会话自带额外工具**，默认开销可能高于本地 |
| 实验仓库 | [hukkin/tomli](https://github.com/hukkin/tomli) @43a86ad（纯 Python 的 TOML 解析器，`src/` 下约 940 行，带完整的 unittest 测试集） |
| 隔离 | 每次运行复制一份干净目录；用新的 `--session-id` 加 `--no-session-persistence`；去掉父会话的会话类环境变量，避免嵌套会话串在一起 |
| 权限 | root 下不能用 `--dangerously-skip-permissions`，改用 `--allowedTools=Read,Edit,Write,Bash,Glob,Grep` 预先放行 |
| 成本 | 历史客户端报告的 `total_cost_usd`，作为 API 等价估算；公开精简轨迹的末个结果事件可核对累计值，字段范围见 E2；不等于账单核验 |

**成本口径补充（2026-10-11 UTC+8）**：E1–E3 的美元与成本倍数均指历史客户端报告的 **API 等价估算**，不是实际账单、订阅扣费或额度百分比。当前 [Claude Code 文档](https://code.claude.com/docs/en/costs)说明会话美元值由 token 与价表估算，订阅用量另计；这不能反向证明历史版本的计价完全正确。2026-10-13 补交记录已支持与 E2/E3 精简轨迹的结果事件交叉核对，但不含完整原始事件、当时价表及子任务去重清单；保留历史数字，不按今日价格重算。

**踩过的坑**（复现时注意）：
- `--tools` 是可变参数，`--tools Read,Edit "prompt"` 会把提示词也当成工具名，报 “Input must be provided”。要写成 `--tools=Read,Edit`；
- `--bare` 在这个环境里报认证错误，没能测到最小开销；
- 不给 stdin 时会多等 3 秒，要把 stdin 指向 `/dev/null`；
- 这个仓库的测试要用 `PYTHONPATH=src python3 -m unittest`，`unittest discover -s tests` 会因相对导入失败。正是这种“猜不到的命令”构成了 E3 中短指令文件的内容。

## 3. E1：固定开销

**方法**：在空目录里发一句“只回复 OK”，记录 `input_tokens + cache_creation_input_tokens + cache_read_input_tokens`。

**此求和只适用于这里的 Anthropic 字段**（[官方字段定义](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)）：其 `input_tokens` 不含缓存读取/写入。OpenAI [Agents usage](https://developers.openai.com/api/docs/guides/agents-api/observability) 的 cached input 已包含在 input，reasoning 已包含在 output；不能再相加，推理按输出计费。例：5,000 input（含 1,500 cached）+ 900 output（含 200 reasoning）= 5,900 total，不是 7,600。

未来记录须保留 provider、schema、精确模型/速度与原字段；归一化后区分总输入、缓存读/写子集、总输出和推理子集。缺项记“未知”而非零。OpenAI Agents usage 未单列 cache-write 数量时，不能据此精算该项费用；也不能假定 Codex 客户端日志与 API schema 相同。本段不指称历史 E1 已发生重复计数。

| 条件 | 每次请求的输入 token | 备注 |
|---|---|---|
| 默认（Haiku 5.5） | **31,558** | 其中 26,709 为缓存读取；分项见 3.1 |
| 默认（Sonnet 5.5 / Opus 5.5） | 30,784 / 30,384 | 和模型基本无关 |
| `--tools=Read,Edit,Bash` | 5,661 | 只留 3 个工具 |
| `--tools=`（不开工具） | 2,939 | `/context` 显示只剩系统提示约 2.2k，另有约 0.7k 未分类 |
| `--disable-slash-commands` | 37,651 | **反而多了约 6k**，可复现（3 次一致），原因不明 |
| + CLAUDE.md 2KB | 32,495（+937） | |
| + CLAUDE.md 20KB | 38,862（+7,304） | |
| + CLAUDE.md 72KB | 57,299（+25,741） | Systima 报告约 +20k，同一数量级 |

**一个词回复的历史 API 等价估算**：Haiku 5.5 约 0.0012 美元（大部分命中缓存）；Opus 5.5 约 0.052 美元。

**解读**：
- 默认请求里最大的一块是工具定义（约 2.3 万，见 3.1）。总输入与 Systima 约 33k 的报告同量级，但不代表组成相同；
- 指令文件每 1KB 约增加 350 token（英文 ASCII 文本）；E3 长文件条件下 Haiku 平均 13.5 轮，每轮输入都包含约 1 万 token（30KB）。其费用须区分缓存读取、写入与普通输入，不能把累计原始输入全部乘普通输入单价；
- 缓存命中不等于从上下文中删除这些输入。读取单价与模型、服务商和时间有关，[当前缓存指南](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)不能统一简化为普通输入价的 1/10，也不用于按今日价格改写历史估算。

### 3.1 补测：用 `/context` 分项（2026-10-12）

**[经验：Claude 历史实测；公开记录算术核对]** 分项与 API 汇总文件已于 2026-10-13 补交，见[产物清单](../../experiments/claude-e1-e3/README.md#内容)；下表数字与公开文件一致，未重跑测量。方法：在同样的空目录和 CLAUDE.md 条件下运行 `claude -p "/context"`。headless 模式下这条命令不调用模型、费用为 0。同时各发一次真实请求，用来对照 API 实际计数。环境为 Claude Code 2.1.296，与原 E1 的 2.1.294 不同，所以只作同量级对照，不当作原数据的精确拆分。

| 条件 | 系统提示 | 工具定义 | Skills 列表 | 指令文件 | `/context` 合计 | API 实际输入 |
|---|---|---|---|---|---|---|
| 默认 | 2.4k | **22.9k** | 2.4k | — | 27.7k | 33,213 |
| `--tools=Read,Edit,Bash` | 2.2k | 2.5k | — | — | 4.7k | 5,761 |
| `--tools=` | 2.2k | — | — | — | 2.2k | 2,940 |
| CLAUDE.md 2KB | 2.4k | 22.9k | 2.4k | 765 | 28.5k | 34,145 |
| CLAUDE.md 20KB | 2.4k | 22.9k | 2.4k | 7.1k | 34.9k | 40,517 |
| CLAUDE.md 72KB | 2.4k | 22.9k | 2.4k | 25.6k | 53.3k | 58,958 |

- 工具定义约占默认请求 API 输入的 **69%**；只留 3 个工具时，工具部分降到 2.5k。另有 19.2k 的“延迟加载工具”没有进入上下文，不计入上表；
- 三个带 CLAUDE.md 的条件，缓存读取都是 28,377，接近“系统提示 + 工具 + Skills”的合计。**2026-10-13 审计修订**：该数值与这三部分构成公共前缀的解释相容，但两个口径的计数与差额尚未对齐，原始请求也未公开，不能据接近关系确认缓存组成或指令文件的排列位置；
- 按公开的舍入显示值相减，`/context` 合计比 API 实际输入少约 0.7k–5.7k（740–5,658 token），这部分的组成**未确认**；
- `--disable-slash-commands` 会让 `/context` 本身不可用，那个条件下多出的约 6k 仍然原因不明。

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
| 平均 API 等价估算 Haiku / Sonnet（美元） | 0.0066 / 0.047 | 0.0070 / 0.050 | **0.0106 / 0.125** |
| 平均输入 token Haiku / Sonnet | 161k / 56k | 163k / 54k | **309k / 162k** |
| 平均轮数 Haiku / Sonnet | 12.3 / 7.7 | 12.5 / 7.3 | 13.5 / 8.0 |
| 耗时中位数 Haiku / Sonnet（秒） | 27.6 / 22.7 | 27.7 / 20.1 | 35.0 / 31.8 |

**过程字段限制（2026-10-13 UTC+8）**：`logs/` 的 Bash 字段只保存主流程命令的前 160 字符，`ran_full_suite` 是对该摘要做字符串匹配的启发式，不是完整测试执行证明；过程核对应结合精简轨迹，不能把 `false` 直接读成没有运行完整测试。**[经验：提取脚本与公开字段核对]**

**过程观察与归因限制**：A 条件全部使用环境里已安装的 pytest；B/C 使用项目 unittest 命令。C 的数据驱动测试路径与其中几行目录约定一致，原报告据此提出“可把相关约定放入短文件”；该段没有单独消融，不能将全部改进归给这几行。历史四舍五入的成本比较是短文件多约 6%，长文件 Haiku 多 60%、Sonnet 多 165%，耗时多 25–40%；以表中原均值为准，不能外推稳定倍数。**[经验：原报告；研究：归因校准]**

**局限**：单一仓库、简单 bug、每格 3–6 次，未测困难任务或更强模型生成的长文件。B/C 同时明确要求回归测试，因而观察不能隔离文件长度或某段约定的因果效果，也不能推断未写要求时一般都不加测试。**[研究：归因范围]**

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
| 平均 API 等价估算（美元） | 0.0055 | **0.0109**（约 2.0 倍） |
| 平均输入 token（含子 Agent） | 61k | 108k（约 1.8 倍） |
| 平均耗时（秒，墙钟） | 17.6 | **47.1**（约 2.7 倍；30.8–70.2） |
| 主 Agent 轮数 | 6 | 1–4 |

**字段口径核对（2026-10-13 UTC+8）**：本批 `logs/e2.jsonl` 的 `total_in` 来自末个结果事件的 `usage`，记录主流程输入；S 组均值为 32,187，不能用它复算上表含子 Agent 的 108k。对每个公开轨迹取末个 `result`，再将其 `modelUsage` 中各模型的 `inputTokens + cacheCreationInputTokens + cacheReadInputTokens` 相加，S1/S2/S3 分别为 102,517、104,762、116,802，均值 **108,027**。S3 有三个结果事件，累计 `modelUsage` 重复，不能跨事件相加。这是本批历史记录的实际口径，不是跨版本字段契约。成本均值为 $0.00553191/$0.01094043，墙钟均值 17.633/47.067 秒；六次末个回答均覆盖评分脚本既有标准的 29 处。**[经验：公开轨迹与汇总独立算术核对]**

**隔离限制**：D 组三次均先尝试读取父仓库路径并失败，轨迹没有成功读取父仓库的记录；这仍是历史对照的混杂，后续应使用不含仓库名的中性路径，不能因数字吻合而忽略。**[经验：公开产物说明]**

**解读**：本例是 grep 即可定位的单文件任务，拆分未增加已计分的覆盖，却增加账面开销和等待；不能从这六次运行推断所有子任务都不值得拆，也不能把等待差单独归因于重读或汇总。直接组曾主动说明两个排除项，只是轨迹观察，不证明单 Agent 普遍更善于全局判断。**[经验：历史观察；研究：边界]**

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

源码与测试：[测试目录](../../tests)、[任务记录校验器](../../scripts/validate_task.py)、[仓库检查器](../../scripts/check_repo.py)。基线对照使用临时目录里的旧脚本加同一套新测试，未替换工作树中的修复版本。测试数量按这一轮记录；以后变更应重跑并保留失败证据。

### 一次 Skill 恢复行为探测（不是运行时兼容测试）

**[经验：单次合成探测]** 给独立云端 agent 两个新 Codex Skill 正文和一份有意不一致的合成任务：当前 spec v3 / 工作版本 c2+dirty:a7；旧报告 spec v2/c1；旧日志 8 passed；worker 仅有“运行中”；外部任务 J17 超时且结果未知；另一任务曾有发布批准，当前只许准备补丁。

观察：输出拒绝验收，逐项指出陈旧证据、缺最终 worker 回执、未知外部结果；不重发 J17，不沿用另一任务的发布授权，给出核对与重验步骤。未运行真实代码，也没有改任何外部任务。

这只是一次直接提供 Skill 正文的行为探测，没有测试自动发现/触发、Codex 客户端、压缩机制、真正中断恢复或成功率分布。下一步应按 [20 的实验表](../20-codex-long-horizon.md#8-下一轮实测不把建议写成实验结论) 做受控对照；未运行的实验保持待验证。

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

**含义**：这是汇总口径的可复核歧义，不是论文结论被推翻或不当行为证据。正确性标签相同不代表成本数据也能随便取一条。本仓库提供 [离线脚本、13 个单测及复核说明](../../experiments/context-results-audit)，不附带第三方 CSV；按固定链接取得后，脚本校验 hash 并同时输出三种口径。

**后续证据（2026-10-13）**：上面保留当时仅凭 CSV 的结论。[后续只读 DB／脚本复核](2026-10-13-context-study-reassessment.md#context-files失败解释与分析参数)找到作者实际使用的 error／评估过滤，复算得到 288 条及相同六条件正确性计数；它补足已实现的分析取舍规则，不证明全部重跑原因、事前政策或成本统计。旧最早／最新敏感性分析不作为作者规则。

## 9. 下一次 Codex 实验：先导，不预报收益

**[经验：历史实验建议，未运行]** 以下保存当时提出的设计规模，当前运行需另有预算与授权，不由本记录自动启动。最小问题：“只加一段项目特有的验证指令，是否减少漏验，而不增加人工返工？”

已有 [workflow-ablation 夹具](../../experiments/workflow-ablation)演示隔离、验收与记录机制；它是单一合成任务，不是下面 6 个真实任务已准备好，更不是已取得模型效果数据。

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

## 外部并行研究：预算与交付口径

> 核实：2026-10-14（UTC）。主线二；修订 08 的并发数量、提速与成本建议；新证据为下列固定论文正文、方法与表格，均为作者历史运行，本轮未运行模型。此节不改变上文 E1–E6 的原始归属。

### 额外计算换质量，不等于更快交付

[P1：Cohere Labs，2026-10-12，v1](https://arxiv.org/html/2610.17471v1)，§2明确未匹配各配置预算；表4是 GPT-5.6 Sol、medium effort、ProgramBench 200任务×3次的每任务均值。单体 PIV 为 reward .58／$0.38／2.5分钟，仅规划异步团队为 .64／$1.24／5.1分钟，全阶段异步团队为 .63／$2.55／7.6分钟。规划优于全阶段委派的成本取舍，不证明它比单体更快。§7的固定人数比较只跑一次；不能把“四个后平台”当通用上限。Commit0-Lite 的既定骨架使实现委派更有利，但仅16任务且接近饱和。没有人的评审分钟。**[研究：作者实验与边界]**

### 有利的生成结果仍需补全验收时间

[P2：Co-Coder，2026-05-31，v1](https://arxiv.org/html/2606.00953v1)，§4/表2：全研究28项目，此处CodeProjectEval为18项目，各3次，统一 gpt-5-mini；Claude Code 2.1.119 经代理调用同一模型，不是原生 Claude 模型比较。CodeProjectEval 的 Sequential→Co-Coder：平均测试通过比例20.1%→34.1%，2756→1315秒，$1.03→$0.67；这是正向结果，但用时排除测试，通过比例不是完整任务成功率。按文件并行则花费$1.65、通过比例23.3%；最快的 Agent Teams 680秒、16.3%，速度与正确性不能互换。**[研究：作者实验]**

P2将依赖内聚的文件留在同组、上游就绪后派发，并由主 Agent 整合测试；支持先定共享接口、再并行独立实现。它同时改变切分和调度，不能把收益单独归给人数或某个依赖图工具。未计人的审查，也不能确认端到端交付节省相同比例。**[研究：归因边界]**

### 固定等待、固定计算、实际完成是三种比较

[P3：AgentRoom，2026-08-24，v1](https://arxiv.org/html/2608.23740v1)，附录B.7：T4 Sonnet单体550秒、累计550 agent-seconds；双AgentRoom为561秒、累计1072。等待近似不变而计算增加；其等计算的正向对照主要是双AgentRoom对双parallel-merge，不能改称等计算胜单体。**[研究：作者实验]**

B.16 的10个Python任务用隐藏pytest：单体7/10、双Agent8/10；geotext从超时603秒变成通过390秒，但 arxiv-digest 同样通过却70→120秒，hybrid-images 100→170秒。单次小样本只支持“部分任务可以提前完成”，不证明平均加速。T4主结果为LLM评分，不能用自写测试通过数量代替独立正确性；B.18另有执行探测，但仍非人的接管/评审测量。**[研究：正反例与边界]**

[P4：Anthropic研究系统，2025-06-13](https://www.anthropic.com/engineering/multi-agent-research-system)报告复杂研究用时最多减少90%，但同时引入并行子Agent与并行工具调用；未公开本轮可重算的逐项计时，不能隔离人数贡献。其内部质量改善与token方差解释也不是等预算对照。**[一手：作者工程报告；研究：边界]**

**采用判断**：任务可分成互不等待的证据调查或已定接口的实现时并行；只在新增工作能补信息或减少关键路径等待、且汇总能消化时增加并发。以相同验收下的最终结果决定保留，额外费用可为质量支付，但要单列；没有完整验收及人的评审数据，就不声称交付更快且负担不变。以上研究不能推出固定2–3或更多Agent普遍最优。**[经验：建议]**

本轮已核对原文/表格；`python3 scripts/check_offline.py` 14阶段通过、无空套件或skip，`git diff --check`通过。不包含新模型、上游项目、真实引擎或人工评审实验。下一次只有拿到同任务完整运行、整合与人工审查记录，才补这项净收益结论。

## 来源

- 实验仓库：[hukkin/tomli](https://github.com/hukkin/tomli)（MIT）
- 对照：[Systima：Claude Code vs OpenCode token 开销](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)
- Claude Code 文档：[Headless / CLI reference](https://code.claude.com/docs/en/cli-reference)、[Subagents](https://code.claude.com/docs/en/sub-agents)


## Worktree隔离到哪里：配置缓存与被测产物

> 核实：2026-10-14（UTC）。主线二、三；改变 08 §4.5／§6.4 的环境与验证建议，不新增编排框架。固定并发数在现版已收敛为按依赖与验收调整，本节不重复撤回。**[研究]**

**采用结论。** 独立分支／worktree 适合隔开源码编辑，不能据此断言配置、构建输出和运行服务也独立。按实际资源拆：独立实现仍可并行，共用可变数据或输出、无法确认服务归属的验证先分离目标或仅串行该步骤；不用为了隔离而重复所有缓存。**[经验：建议]**

### 新证据与会改变的选择

- **Git 配置不是目录私有。** [Git worktree 官方语义](https://git-scm.com/docs/git-worktree#_configuration_file)说明 repository config 默认共享；启用 `extensions.worktreeConfig` 后才可用 `git config --worktree` 配置各树。HEAD／index 分开不代表所有 Git 状态分开。下方离线夹具确认这一点，读者不能把 worker 内的 `git config --local` 当成只改 worker。不是建议自动替用户修改配置。**[一手；研究：夹具]**
- **复制不是重新绑定。** [Claude Code worktrees](https://code.claude.com/docs/en/worktrees#copy-gitignored-files-into-worktrees)的 `.worktreeinclude` 复制同时匹配且被忽略的文件；项目级插件也可在同仓工作树间加载。复制 `.env` 不改变其中的数据库／服务地址，是从文件复制语义推出的边界，非真实账户试验。因此把原来笼统的环境成本建议收窄为文件复制／检出范围；复制完成不保证缓存有效或服务隔离。**[一手；研究：推论]**
- **“测试从 B 启动”不证明“测的是 B”。** [Playwright 官方 webServer](https://playwright.dev/docs/test-webserver)约定复用已有 URL／端口上的服务；[v1.56.1 固定版本源码](https://github.com/microsoft/playwright/blob/v1.56.1/packages/playwright/src/plugins/webServerPlugin.ts#L77-L99)的 `_startProcess` 先检查可用性，允许复用时直接返回，尚未启动指定 command/cwd。这证明机制，不是本轮跑过浏览器。**[一手：源码阅读]**
- **真实维护反例。** [google-meet-clone 的维护记录](https://github.com/videosdk-community/google-meet-clone/blob/main/docs/DECISIONS.md#the-e2e-suite-serves-itself-on-its-own-port-do-not-point-it-back-at-5173)自述 2026-07-16 发现一棵 worktree 的 E2E 使用另一分支服务，部分通过直到新场景失败才察觉；改为专用端口、`--strictPort` 与 `reuseExistingServer: false`。这支持检查被测服务归属，不证明该项目全部测试可靠，也不是独立复现；所读是核实日 main 维护记录，非固定修复 SHA。**[社区：项目维护者报告]**
- **保留缓存反证。** [Cargo Book](https://doc.rust-lang.org/cargo/reference/build-cache.html)区分最终产物 target-dir 与中间产物 build-dir，并给出用 sccache 跨 workspace 共享依赖的路径。[Cargo #16804](https://github.com/rust-lang/cargo/issues/16804)的提交者将多 Agent worktree 资源压力、锁等待与损坏混写；维护者 2026-03-30 指出锁的目的正是防损坏，疑似损坏应单独提供故障证据，另有人指出三个不同的已有问题。因此不采纳“共享 target 必然损坏”或“全部缓存独占”的概括；保护写入的锁也不等于交付时那个固定路径仍是本任务产物。后一句是身份边界的推论，不是本轮复现 Cargo 错误。**[一手：官方文档；社区：原帖及维护回复；研究：限定]**

由此调整任务切分：共享接口尚未稳定时先收敛语义；接口已定但测试共用可变服务时可继续并行写代码，只收窄验证并发。整合时针对合并后的源码与对应构建／服务重新验收，保存已有测试报告能说明的版本与目标，不增设一套自建调度协议。若原生工具已经正确隔离这些状态，无需额外容器或复制全套依赖。**[经验：采用与退出条件]**

### 零成本离线 Git 夹具

在全新临时仓库执行，入口使用 `env -i PATH=/usr/bin:/bin /bin/bash fixture.sh`；空 HOME／XDG、禁用系统和全局 Git config，不读取用户配置、不联网、不改本工作仓 Git 设置。完整脚本如下，临时数据由 trap 清理。**[研究：本轮实测]**

```bash
#!/bin/bash
set -euo pipefail
base=$(mktemp -d)
trap 'rm -rf "$base"' EXIT
mkdir -p "$base/home" "$base/xdg"
export HOME="$base/home" XDG_CONFIG_HOME="$base/xdg" GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_CONFIG_COUNT GIT_CONFIG_PARAMETERS || true
export GIT_AUTHOR_NAME=Fixture GIT_AUTHOR_EMAIL=fixture@example.invalid GIT_COMMITTER_NAME=Fixture GIT_COMMITTER_EMAIL=fixture@example.invalid
git init -q "$base/main"
git -C "$base/main" -c core.hooksPath=/dev/null commit -qm seed --allow-empty
git -C "$base/main" -c core.hooksPath=/dev/null worktree add -qb worker "$base/worker"
git -C "$base/worker" config --local demo.endpoint worker
printf 'default_shared_config=%s\n' "$(git -C "$base/main" config demo.endpoint)"
test "$(git -C "$base/main" config demo.endpoint)" = worker
git -C "$base/main" config extensions.worktreeConfig true
git -C "$base/worker" config --worktree demo.endpoint isolated
printf 'main_after_override=%s\nworker_after_override=%s\n' "$(git -C "$base/main" config demo.endpoint)" "$(git -C "$base/worker" config demo.endpoint)"
test "$(git -C "$base/main" config demo.endpoint)" = worker
test "$(git -C "$base/worker" config demo.endpoint)" = isolated
git --version
```

干净环境实测输出（Git 2.47.3，三项断言通过）：

```text
default_shared_config=worker
main_after_override=worker
worker_after_override=isolated
git version 2.47.3
```

另一次继承进程 PATH 的初跑为 Git 2.52.0，结果同样，但以上干净环境结果才作为可复查基线。夹具只验证 Git 配置作用域，不验证并发编译、缓存命中、端口争抢、数据库隔离、Claude 客户端或模型收益。未安装／启动 Playwright、Cargo、模型或引擎；上游源码和维护者自述不算本轮上游测试通过。**[研究：验证边界]**


## 子Agent宿主契约：并发权限与恢复

> 核实：2026-10-15（UTC+8）。主线二、三；改变 08 §2.1／§5.1／§7 的启动与撤回选择。当前只读公开资料和源码，不运行模型、客户端或上游测试。

**结论。** 独立子任务是否值得拆分之外，还要确认“由谁审批、谁收结果、恢复会重做什么”。优先单层委派；配置人数只调同时占用，不等于限制总调用或费用。需要不同权限的 worker 放在相应权限的父会话里；结果投递异常时由主会话核对并汇总，别增加嵌套来补救。恢复写任务沿 [20](../20-codex-long-horizon.md#9-超时后动作究竟发生了吗)先对账，不另建编排协议。**[经验：采用判断]**

### Codex：文档、发行源码与历史反例

- [现行官方指南](https://learn.chatgpt.com/docs/agent-configuration/subagents#global-settings)用 `agents.max_concurrent_threads_per_session`，保留 `max_threads` 别名；数子线程，不含主线程。权限继承父轮次；无法展示新审批的非交互流程会向父工作流返回失败。ChatGPT Work 使用其宿主工具权限，不暴露本地 CLI 沙箱设置。**[一手：文档]**
- **已发行基线，不只看 main。** 核查 `rust-v0.162.1`，对应固定提交 [`092d3acd6bec3e3a14bdc7e7a2810ab628ab759d`](https://github.com/openai/codex/releases/tag/rust-v0.162.1)。[`AgentsToml`](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/config/src/config_toml.rs#L753-L785)包含新字段／旧别名，`max_depth` 仅用于 V1，V2 忽略；`job_max_runtime_seconds` 已是兼容 no-op，不能用旧键承诺超时。先探查的 main `1ffa95ee8a02ec68f6ccd758998bcb7d4b32bcdb` 不作为已发布依据。**[一手：固定源码阅读]**
- **默认数值有后端分支。** [`config/mod.rs`](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/core/src/config/mod.rs#L1633-L1649)中 V1 未配置回落到6，V2 内部默认4含主线程；`resolve_multi_agent_v2_config` 把公开 `[agents]` 子线程数加1后转为内部会话上限，`effective_agent_max_threads` 再减1。[对应测试定义](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/core/src/config/config_tests.rs#L12166-L12195)与 `multi_agent_v2_uses_agents_max_concurrent_threads_per_session` 固定了口径。不能由常量推断某账户实际选了哪个后端；正文因此不推荐一个默认人数。**[一手：实现／测试阅读，未运行]**
- **角色不是新权限域。** [`AgentRoleOverrides` 和 `apply_role_to_config_inner`](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/core/src/agent/role.rs#L36-L133)只投影允许的模型、指令、能力缩减等字段，不投影角色里的 sandbox／approval 设置；[`apply_role_preserves_parent_sandbox_permissions`](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/core/src/agent/role_tests.rs#L394-L433)与 `apply_role_cannot_expand_parent_authority` 是同路径的测试定义。这支持撤回“给 reviewer TOML 写 read-only 就有独立只读沙箱”的做法；不表示所有工具均由同一种沙箱执行。**[一手：源码和测试阅读]**
- **保留历史反例但不当当前故障。** [adrianto-nanovest 的 #35984](https://github.com/openai/codex/issues/35984)报告 0.144.6 的 schema 注释称未设上限，而实现回落到6。核实日原帖仍 open；此次 0.162.1 的字段注释已改为由后端选择默认，所以不把 issue 状态当新版本仍错的证据。它支持核配置解析与消费路径，而不是只抄说明文字。**[社区：作者报告；一手：新版本反证]**

### Claude：模式与恢复不能互换

[Subagents](https://code.claude.com/docs/en/sub-agents#concurrent-subagent-limit)给出的20是普通 Agent 工具启动门槛；手动 `/subtask`、resume及其他编排入口并非同一硬限。普通后台子Agent应将权限提示送到主会话，但交互／`-p`／SDK 的等待和结果路由不同，forked Skill又有自己的路径。这里只用官方说明界定宿主契约，不声称它能防住所有运行故障。**[一手：文档]**

[Dynamic Workflows](https://code.claude.com/docs/en/workflows#behavior-and-limits)有独立并发控制：默认至多16且受CPU数量影响，不受普通子Agent的20直接统管。更影响选择的是恢复语义：失败Agent之后已完成者也可能重跑；中间人工签字应拆 run。配额暂停并自动续接还有交互订阅等入口条件，不能推广到 `-p`／SDK／后台会话。若操作不能安全重做，先拆出副作用与签字步骤；这不是要求所有只读研究都增加检查点。**[一手：文档；经验：建议]**

[Subagent names](https://code.claude.com/docs/en/sub-agents#subagent-names)另规定：交互会话已启用Teams时，主会话带 `name` 的调用会转为队员，除非本次是fork或调用显式带 `isolation`；frontmatter隔离不防转换，队员在主会话目录运行。命名不是无副作用标签，配置隔离后仍要核实际启动形态。**[一手：文档]**

[Agent Teams 的限制](https://code.claude.com/docs/en/agent-teams#limitations)明确 in-process队员不能随 `/resume`／`/rewind` 恢复，且停止须等当前请求／工具调用结束。因此“先停扩量”不等于已有进程立即消失或写入已撤销；先核实际状态再换单层执行。**[一手；经验：采用]**

**两位不同作者的失败报告，均未独立复现：**

- [balabg94，#101688](https://github.com/anthropics/claude-code/issues/101688)，2026-10-13，2.1.296/macOS：`context: fork` Skill 的交互运行提前返回，两个后台孩子后来向主会话回报，原 fork 的汇总未运行；同项目 `-p` 路径据报完成汇总。核实日 open、无回复。反例针对 forked Skill 路径，不泛化为所有普通子Agent都不会等待；可撤回嵌套，让主会话直接收集所需结果。不能据这个报告把全部工作改为 headless。**[社区：原帖和作者复现]**
- [RubenARNAUD，#99887](https://github.com/anthropics/claude-code/issues/99887)，2026-10-06，2.1.281/Windows Desktop：子Agent等待用户许可，父Agent仅见运行中，过夜任务停滞。核实日 open。它反驳“后台启动就能无人值守”的保证，不推翻官方权限路由契约，也不支持关闭审批；应拆出需要人在场的步骤。**[社区：原帖，未核日志／修复]**

### 验证与剩余缺口

已交叉读取现行官方文档、0.162.1固定配置/角色应用路径及对应测试定义，并保留文档已更新而历史issue仍open的反证。没有运行上游测试、客户端、模型或付费请求；源码证明上述路径，不证明宿主全部部署、审批交互或实际净收益。08其他旧研究数字、第三方维护状态与云端产品项未在本单元全文重核。本仓完整离线入口首轮14阶段通过（非空套件、无skip），`git diff --check`通过；这些检查不验证上游动态事实。
