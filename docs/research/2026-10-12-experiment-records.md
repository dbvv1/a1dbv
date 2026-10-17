主线：二为主，兼三
改变的建议：短指令只留会改变行动的项目约束；独立调查或已定接口的实现可并行，单文件 grep 不默认拆。任务结果、过程遵从、等待与 API 等价估算分别比较；worktree 验证还须识别配置、服务和最终产物；委派先核宿主审批、并发口径与恢复动作。[经验：限定采用] 三题检索先导未见显式扩展的采用增量，保留基线，按证据缺口扩渠道。
新证据：10-18（UTC+8）补核 Cognition 角色上下文修订，限厂商报告；原研究证据汇总（日期见各节，非本次编辑新增）；历史 E1–E3 与补交轨迹算术核对；10-16 核出 E3 全套失败不能证明新增用例有效，保留新增测试比例、撤回全部有效的断言；E3 单一 bug 的 27 次报告均修好，但测试约定与文件长度混杂，E2 拆分成本及等待更高。E4/E6 是确定性回归，E5 是 CSV 复算；后补并行论文有正反例，仍缺完整验收与人审投入，不能外推普遍效率；后补 Git 配置夹具、Playwright 复用源码及 Cargo 维护者反证，区分编辑隔离和运行状态。10-15补Codex发行源码与Claude宿主文档、两作者故障反例；不是客户端实测。[经验／研究／一手] 2026-10-17完成三题六路公开检索与匿名资料核查；无新增支持路径或首选变化，不作普遍效果结论。

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

**原自动检查的实际范围**：
- 完整测试集是否通过；
- 测试文件改动与未跟踪文件，以及把源码还原成有 bug 的版本后整套测试的末行结果；这不能单独证明新增测试有效；
- 从 stream-json 里提取每一条 Bash 命令：用的测试命令是什么、是否越界改动。

**结果**（Haiku 5.5 每种条件 6 次，Sonnet 5.5 每种 3 次）：

| | A 无 | B 短 | C 长 |
|---|---|---|---|
| 修好 bug、测试全过 | 9/9 | 9/9 | 9/9 |
| 新增测试（行为计数，非有效性通过率） | **2/9**（Haiku 2/6，Sonnet 0/3） | **9/9** | 8/9（Haiku 6/6，Sonnet 2/3） |
| 新增测试放在哪 | `test_misc.py` | `test_misc.py` | **`tests/data/valid/*.toml` + `.json`**（项目自己的数据驱动测试） |
| 用的测试命令 | **pytest**（至少一轮先因缺包失败后安装） | 项目的 unittest 命令 | 项目的 unittest 命令 |
| 平均 API 等价估算 Haiku / Sonnet（美元） | 0.0066 / 0.047 | 0.0070 / 0.050 | **0.0106 / 0.125** |
| 平均输入 token Haiku / Sonnet | 161k / 56k | 163k / 54k | **309k / 162k** |
| 平均轮数 Haiku / Sonnet | 12.3 / 7.7 | 12.5 / 7.3 | 13.5 / 8.0 |
| 耗时中位数 Haiku / Sonnet（秒） | 27.6 / 22.7 | 27.7 / 20.1 | 35.0 / 31.8 |

**新增测试有效性核对（2026-10-16 UTC+8）**：[历史检查脚本](../../experiments/claude-e1-e3/scripts/e3check.py)恢复 `src` 后运行整套 `unittest`，只取最后一行；坏基线原已有 14 个失败，所以整套失败并不能归属到新增用例。原报告给出的“新测试在坏代码上失败”2/2、9/9、8/8，不能由该检查器及现存汇总逐轮确认；撤回全部 19 次新增测试均有效的强断言。上表 2/9、9/9、8/9 仍保留为本批新增测试的行为计数，不把缺验证写成测试无效。**[经验：历史脚本与产物核对]**

**保留可见的正证据，不把缺口当反例。** 逐条核对 27 份精简轨迹，A 的 Haiku 第 1、3 轮、B 全部 9 轮、C 除 Sonnet 1 外的 8 轮新增了针对该缺陷的测试；19 轮新增内容均含至少一种真实 `\u`／`\U`／`\x` 转义与相应正确预期。现存轨迹中：
- [A-haiku-1](../../experiments/claude-e1-e3/transcripts/A-haiku-1.jsonl)第 28–29 行、[B-haiku-5](../../experiments/claude-e1-e3/transcripts/B-haiku-5.jsonl)第 33–34 行仅还原源码后点名新增用例失败；[B-haiku-6](../../experiments/claude-e1-e3/transcripts/B-haiku-6.jsonl)第 28–29 行重新注入原 bug 后同样点名失败；[B-haiku-4](../../experiments/claude-e1-e3/transcripts/B-haiku-4.jsonl)第 17–24 行则先新增测试并观察失败，再修源码。这四轮保留了新增用例的明确红测记录，仍是历史轨迹核对，不是本轮重跑。
- [C-haiku-5](../../experiments/claude-e1-e3/transcripts/C-haiku-5.jsonl)第 41–45 行对最终 fixture 保留了好／坏源码的解析输出差异及与预期 JSON 匹配的结果；这是针对缺陷的语义证据，不是点名 subtest 失败。[C-haiku-6](../../experiments/claude-e1-e3/transcripts/C-haiku-6.jsonl)第 32–33 行、[C-sonnet-2](../../experiments/claude-e1-e3/transcripts/C-sonnet-2.jsonl)与 [C-sonnet-3](../../experiments/claude-e1-e3/transcripts/C-sonnet-3.jsonl)第 15–16 行保留新增 fixture、回退源码后为 15 个失败，相对原有 14 个仅作差分佐证，不替代失败归属。

这些记录支持保留新增测试行为与部分有效性证据，不能合成为全部 19 轮均已执行有效红测。**[经验：精简轨迹静态核对，未重跑]**

**过程字段限制（2026-10-13 UTC+8）**：`logs/` 的 Bash 字段只保存主流程命令的前 160 字符，`ran_full_suite` 是对该摘要做字符串匹配的启发式，不是完整测试执行证明；过程核对应结合精简轨迹，不能把 `false` 直接读成没有运行完整测试。**[经验：提取脚本与公开字段核对]**

**过程观察与归因限制**：A 条件使用 pytest；[A-haiku-1 轨迹](../../experiments/claude-e1-e3/transcripts/A-haiku-1.jsonl)第 12–15 行显示先报 `No module named pytest`，随后安装，不能概括为全部环境已预装；B/C 使用项目 unittest 命令。C 的数据驱动测试路径与其中几行目录约定一致，原报告据此提出“可把相关约定放入短文件”；该段没有单独消融，不能将全部改进归给这几行。历史四舍五入的成本比较是短文件多约 6%，长文件 Haiku 多 60%、Sonnet 多 165%，耗时多 25–40%；以表中原均值为准，不能外推稳定倍数。**[经验：原报告；研究：归因校准]**

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
   - `git stash push -- src` 把源码还原成有 bug 的版本，定向运行新增用例／fixture，或保留能归属到新增用例的失败名称／断言差异；不能只看整套测试失败，再 `git stash pop` 恢复并确认测试通过；
5. **提取过程**：从 `run.jsonl` 中 `type == "assistant"` 的消息里取出 `tool_use`，统计 Bash 命令；`type == "result"` 的事件里有 `total_cost_usd`、`num_turns` 和 `usage`；
6. **重复运行并保留每次记录**：三次只是先导，不保证统计把握；同一配置的成本在不同运行之间可以相差 2 倍（E3 中 Haiku 的 B 条件最低 0.0055、最高 0.0120 美元）。

## 7. E4：模板的确定性回归（2026-10-11 UTC+8）

**[经验：实测]** 本轮在 Linux、Python 3.12.14、Bash 环境验证仓库改动，基线为 `73905442b2da0a473573d1e98b65752613ad29f6`。所有引擎、配置与路径均用临时合成夹具；没有读取真实个人配置或执行 Unity / Unreal。

| 检查 | 实際结果 | 不能由此推导 |
|---|---|---|
| 引擎报告验证 | 6 个测试方法、66 个合成夹具检查组合通过；同一扩展测试集对基线脚本出现 43 条失败记录（42 个子用例、1 个方法级失败；计数澄清见下） | 真实引擎所有版本 schema 都兼容 |
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

### 2026-10-16 UTC+8：固定历史组合的独立复演

**[经验：确定性复演]** 本次在 Linux、Python 3.12.14、Bash 5.2.37 下，仅运行已有 `tests/test_engine_test_runners.py`。测试固定为 `8578b0776a75d3f290487feac6dfbe9fed9d1e48`；分别搭配旧基线 `73905442b2da0a473573d1e98b65752613ad29f6` 与修复提交 `8578b0776a75d3f290487feac6dfbe9fed9d1e48` 的两份引擎报告脚本。旧侧 `Ran 6 tests / FAILED (failures=43)`、exit 1；修复侧 `Ran 6 tests / OK`、exit 0。测试与修复脚本也与核对快照 `eb79d8ad904a7190ead436804a237f459c54c665` 字节一致。

43 是 **42 个 subTest 失败加 1 个方法级失败**，不是 43 个测试方法；66 是修复侧 `run_mock` 合成夹具检查组合：Unity 报告 26、Unity 进程 6、Unreal 报告 28、Unreal 进程 2、陈旧报告 2、缺 Python 2。缺 Python 两例提前拒绝，不能把 66 称为引擎启动次数。旧侧 Unreal 异常进程方法在首条断言失败后跳过第二次调用，因此可静态推导为 65 次夹具调用；该数字未做运行时插桩测量。

[复演证据文件](../../experiments/e4-engine-runner-replay-20261016.txt)保存固定来源及 SHA256、可复查命令、完整失败索引、退出码和路径脱敏后的完整 unittest stdout/stderr。测试内部只把失败断言相关的子进程输出带入 unittest 日志，通过用例的子进程输出未另行记录。这是 **2026-10-16 UTC+8 独立 mock 复演，不是历史原始日志**；未重跑全部 53 方法，未安装依赖、执行真实引擎、接入 Hook 或运行模型，不能扩展为真实引擎兼容性或模型任务完成的证据。

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


### 架构阈值与完整候选组：不能按45%或87%硬路由

主线二；改变08／09的选择：先比较可观察的任务独立性、协调成本与单体基线，不用论文百分比直接决定新任务的架构。
新证据：作者v2.2.3的完整候选组评估、修订说明与公开CSV，本轮用Python标准库独立重算计数、选择及均值。
核实：2026-10-15（UTC+8）；仅静态数据检查，未重拟合回归、运行模型／benchmark，不能代表当前模型或编码现场效果。

**固定来源。** [论文v3](https://arxiv.org/html/2512.08296v3)发表于2026-04-08；本轮读§4.1设置、§4.3选择方法、§5局限与相关附录，未宣称通读全部。作者仓库固定提交[`8673d6a8`](https://github.com/ybkim95/agent-scaling/tree/8673d6a8d5a764a07b08e4283492380d80257223)，对应v2.2.3，提交时间2026-10-12 19:34:34 UTC。[CHANGELOG](https://github.com/ybkim95/agent-scaling/blob/8673d6a8d5a764a07b08e4283492380d80257223/CHANGELOG.md)说明：v2.1.3回归分析误纳10个样本外`gemini-3-flash-preview`配置，v2.2.0改为260行；v2.2.1另修错误放大脚本，v2.2.2仅修改评估措辞，v2.2.3仅更新复现指南。不能将脚本修复解释成重跑模型后的性能改善。**[一手：版本与作者修订]**

**87%不是完整候选组的已验证可靠度。** 论文报告配置级五折交叉验证、87%最佳架构选择，但已读方法没有给出该百分比的成功数、明确分母及逐次选择表。[发布回归源码](https://github.com/ybkim95/agent-scaling/blob/8673d6a8d5a764a07b08e4283492380d80257223/scripts/reproduce_published_regression.py#L44-L68)把同组5种架构散入不同折，断言52组分布于2–5折、无整组留出；这是源码定义／断言，本轮未执行该回归。新增[选择协议](https://github.com/ybkim95/agent-scaling/blob/8673d6a8d5a764a07b08e4283492380d80257223/scripts/architecture_selection_eval.py#L18-L60)则每次留出一个完整“基准×模型”组，用其余255行拟合。这是不同的评价问题，不能写成“同一指标从87%复现下降到44%”。**[研究：原文与协议边界]**

从公开候选预测分数重新取最大值，并按原始表现计命中；所有选择与作者decision表一致。原始数据为260行、52组，每组5架构（4基准各9组，2编码基准各8组）：

| 规则／条件 | 命中观测最优（并列算成功） | 平均regret，百分点 |
|---|---:|---:|
| Eq1，Intelligence Index，单体选项使用已测表现 | 23/52（44.2%） | 5.35 |
| Eq1，Intelligence Index，5选项均预测 | 22/52（42.3%） | 7.17 |
| Eq1，单体baseline特征改为训练集基准均值、5选项均预测 | 22/52（42.3%） | 5.62 |
| 同基准其余模型的架构均值规则 | 27/52（51.9%） | 4.89 |
| 恒选单体 | 22/52（42.3%） | 9.60 |

regret是该组观测最佳表现减所选架构表现，不是金额。后两规则也由260行直接独立计算。41组唯一最佳、8组两者并列、3组三者并列；允许并列命中时随机五选一期望为25.38%，不能拿20%直接比较。首行不计并列时为19/52。**[研究：本仓库静态复算；预测分数仍由作者提供，未独立拟合]**

**保留反证与条件。** 作者[脚本断言](https://github.com/ybkim95/agent-scaling/blob/8673d6a8d5a764a07b08e4283492380d80257223/scripts/architecture_selection_eval.py#L564-L600)的ACI替代规格、已测单体条件为31/52（59.6%），优于其Intelligence Index版本；本轮未重拟合，不能只挑44.2%称整个方法无效。新协议逐折计算标准化、ACI及单体行的基准均值；四多体选项仍使用目标组已测单体表现，这是明示的决策前提，不能直接称违规泄漏。架构级协调汇总仍固定使用发表的轨迹统计，未逐折重估；作者明确称条件式评估，不能改写成完全独立于留出测量。均值规则不使用目标组结果来选架构，但需要同一基准其他模型的完整观测，51.9%不是可直接部署到未知任务的策略，也未证明显著优于Eq1。**[一手：源码；研究：解释]**

**45%只是一条受端点影响的描述。** [阈值脚本](https://github.com/ybkim95/agent-scaling/blob/8673d6a8d5a764a07b08e4283492380d80257223/scripts/threshold_sign_match.py#L9-L19)比较单体与四种多体中事后最佳，单体≥45%时预测多体收益为负。独立复算：编码16组为15/16（93.75%）；改用四多体均值则13/16（81.25%）。41%、43%、45%的结果完全相同，无法确认45%是唯一边界；全部52组在45%仅39/52（75%），20%–80%的1个百分点网格中41%最高、40/52，也只是同数据描述。反例是SWE-bench的GPT-5：单体65%，最佳多体70%。16组来自原260配置，不是独立外部验证；每编码基准仅20任务，跨模型重用，不能等同16次独立任务试验。最佳多体收益的符号也不告诉读者该选哪种多体。**[研究：静态复算与外推边界]**

**样本与预算不可混写。** v3正文SWE单体均值0.522、Terminal单体0.344，与公开逐实例数据包含第9模型`gemini-3-flash-preview`的均值一致；260行SourceData排除它后分别为0.4875、0.3125。Terminal Independent相对单体从9模型的约+1.6%变成8模型的+6.0%（0.33125对0.3125），所以不能概括成“编码子集平均不增益”。归一化Sonnet 4.5名称后，80个编码配置均与1600条逐实例结果平均值吻合；这支持数据内部对应，不证明小差异可泛化。§4.1明确匹配最大总迭代数，不能等同token、金额或端到端交付预算；正文其他位置的预算措辞不补足同成本证据。**[研究：原文核对与独立复算]**

**复算输入。** 以下文件均取自上述固定提交；SHA-256：

| 文件 | SHA-256 |
|---|---|
| `data/Source_Data_Fig1_Fig2.csv` | `402a9fea7430bf4dbf1645c8bafd7850811ffb5bb331568e8088d85c4dc9ffd9` |
| `data/architecture_selection_decisions.csv` | `3582b51e81cb2a993452050bacb3db169340aa6fe54d10cc9b43c5658bd52fb0` |
| `data/architecture_selection_decisions_option_scores.csv` | `fc9d7be99eb59fd73196f162c5176152173c0e472f2899e370e8d598869ed231` |
| `scripts/per_instance_results_swe_tb.csv` | `c7bde9eac1f28a29397c10ab10e29f0962595e9dd45f17aedc2d309289b12007` |

在下载的固定源码根目录运行下列程序，只读CSV；不执行上游代码，不安装依赖：

```python
import csv
from collections import defaultdict, Counter
from statistics import mean


def read(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


source = read("data/Source_Data_Fig1_Fig2.csv")
options = read("data/architecture_selection_decisions_option_scores.csv")
instances = read("scripts/per_instance_results_swe_tb.csv")
sets, scores = defaultdict(dict), defaultdict(list)
for r in source:
    sets[r["dataset"], r["model"]][r["architecture"]] = float(r["performance"])
for r in options:
    scores[r["choice_set"]].append(r)
assert len(source) == 260 and len(sets) == len(scores) == 52
assert all(len(v) == 5 for v in sets.values())
sa = "single-agent"
ties = Counter(sum(abs(x - max(v.values())) < 1e-12 for x in v.values())
               for v in sets.values())
print("ties", ties, "random", sum(k * n for k, n in ties.items()) / 260)
for rule in ("eq1_measured_sa", "eq1_all_predicted", "eq1_benchmark_mean_baseline"):
    regrets = []
    for rows in scores.values():
        pick = max(rows, key=lambda r: float(r["score_" + rule]))
        regrets.append(max(float(r["performance"]) for r in rows)
                       - float(pick["performance"]))
    print(rule, sum(abs(x) < 1e-9 for x in regrets), mean(regrets))
for rule in ("benchmark", "single"):
    regrets = []
    for (d, m), v in sets.items():
        pick = sa
        if rule == "benchmark":
            means = {a: mean(w[a] for (dd, mm), w in sets.items()
                             if dd == d and mm != m) for a in v}
            top = sorted(a for a, x in means.items() if abs(x - max(means.values())) < 1e-12)
            pick = ([a for a in top if a != sa] or top)[0]
        regrets.append(max(v.values()) - v[pick])
    print(rule, sum(abs(x) < 1e-12 for x in regrets), mean(regrets))
coding = {k: v for k, v in sets.items()
          if k[0] in ("swe-bench-verified", "terminal-bench")}
for t in (.40, .41, .43, .45):
    for label, groups in (("coding", coding), ("all", sets)):
        for endpoint in (max, mean):
            n = sum(((endpoint([x for a, x in v.items() if a != sa]) - v[sa]) < -1e-12)
                    == (v[sa] >= t) for v in groups.values())
            print(t, label, endpoint.__name__, n, len(groups))
grid = {t / 100: sum(((max(x for a, x in v.items() if a != sa) - v[sa]) < -1e-12)
                    == (v[sa] >= t / 100) for v in sets.values()) for t in range(20, 81)}
print("grid best", max(grid.values()), [t for t, n in grid.items() if n == max(grid.values())])
aliases = {"swe-bench-verified": "swebench-verified", "terminal-bench": "terminalbench"}
for (d, m), v in coding.items():
    model = "claude-sonnet-4-5-20250929" if m == "claude-sonnet-4-5" else m
    for a, expected in v.items():
        rows = [r for r in instances if r["dataset"] == aliases[d]
                and r["model"] == model and r["agent_type"] == a]
        assert len(rows) == 20 and abs(mean(int(r["resolved"]) for r in rows) - expected) < 1e-12
for d in ("swebench-verified", "terminalbench"):
    for a in (sa, "multi-agent-independent"):
        rows = [r for r in instances if r["dataset"] == d and r["agent_type"] == a]
        print(d, a, "nine", mean(int(r["resolved"]) for r in rows),
              "eight", mean(int(r["resolved"]) for r in rows
                            if r["model"] != "gemini-3-flash-preview"))
```

**采用与撤回。** 先用可独立验收的工作、共享状态和协调成本决定是否值得比较，再以自己的任务与同一验收判据检验单体和候选架构；未知任务的硬路由保持暂缓。若将来有候选组完整留出、输入在决策时可得、预算可比且覆盖目标任务的外部验证，再重估是否采用预测路由。**[经验：建议]**

### 人数配额与角色示例的适用范围

核实：2026-10-15（UTC+8）。主线二；撤回08 §8的通用人数套餐、§9的固定角色照搬。新证据是原作者用例与配额的任务范围核对，不是新增模型实验。

- [Anthropic Research 原文](https://www.anthropic.com/engineering/multi-agent-research-system)“Scale effort to query complexity”把人数／调用数作为搜索系统提示启发式；同文指出共享上下文、依赖多的任务不适合，编码通常比研究更少真正可并行的部分。故保留明确预算与停止条件，不把历史搜索配额推广为编码推荐。**[一手：作者范围；研究：外推边界]**
- [Teams 用例](https://code.claude.com/docs/en/agent-teams#use-case-examples)分别举三人分视角评审、五人竞争假设的提示；[人数建议](https://code.claude.com/docs/en/agent-teams#choose-an-appropriate-team-size)同时要求有实际同时工作收益才扩量。页面未给这两种角色配置的同任务同预算对照；上述P1也未证明固定人数普遍最优。保留按风险分视角、主动找反证的机制，撤掉固定人数与“值得照搬”的推荐强度。**[一手：文档；研究：证据边界]**

范围：仅原文静读；未重验其他第三方工具状态、云端产品或历史效果数字。未运行模型、客户端或上游实验。

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

### 并行测试：换了夹具数据库，应用连接也要一起换

核实：2026-10-16（UTC+8）。主线二、三；只细化08 §6.4的隔离配置生效时机与实际目标核查，不重复增加“worktree不隔离服务”的一般提醒。**[研究]**

- **真实Agent并行故障。** [Agenticos #189](https://github.com/vstorm-co/agenticos/issues/189)明确报告多个Agent在各自worktree及虚拟环境中，共用一个Postgres容器；两组集成测试对固定数据库反复`drop_all`／`create_all`，互相删表并出现不同的失败集合。单跑通过，不能排除这种并行串扰。**[社区：原作者故障报告]**
- **修复覆盖应用与夹具两条连接路径。** [#216](https://github.com/vstorm-co/agenticos/pull/216)已合并为`408327b3ecaa70e430cc2253bc2b2fefe30de9b8`。[固定conftest](https://github.com/vstorm-co/agenticos/blob/408327b3ecaa70e430cc2253bc2b2fefe30de9b8/backend/tests/conftest.py)在导入应用配置之前，把测试数据库名派生为每pytest进程独有；集成夹具负责创建和清理。原因是[应用engine在导入时创建](https://github.com/vstorm-co/agenticos/blob/408327b3ecaa70e430cc2253bc2b2fefe30de9b8/backend/app/db/session.py#L14-L20)，若只在后来的夹具中换库，未覆盖的应用连接仍可能指向旧目标。固定[单元回归](https://github.com/vstorm-co/agenticos/blob/408327b3ecaa70e430cc2253bc2b2fefe30de9b8/backend/tests/test_integration_database_isolation.py#L31-L40)比较应用settings与夹具环境目标，[集成回归](https://github.com/vstorm-co/agenticos/blob/408327b3ecaa70e430cc2253bc2b2fefe30de9b8/backend/tests/integration/test_database_isolation.py#L19-L23)用`SELECT current_database()`核实际连接。这是测试定义与源码阅读，不是本轮测试通过。**[一手：固定补丁与回归定义]**
- **反馈与后续边界。** #216作者自报同机并行两跑由修复前`1 failed / 4 errors`、`1 failed / 9 errors`变为各`216 passed`；[#189另一分支的反馈](https://github.com/vstorm-co/agenticos/issues/189#issuecomment-5189659254)也称手动换私库后`216 passed`，但两处都是同一账号，不是独立使用者复测。后续[#535](https://github.com/vstorm-co/agenticos/pull/535)保留每进程数据库，将每测试重建schema改为一次建schema、测试间`TRUNCATE`，自报重叠子集并行各154通过；不能继续把旧DDL死锁描述为现行实现。该作者另更正最初所谓随机顺序运行未安装`pytest-randomly`，因此不借此扩张为独立或完整随机验证。**[社区：同项目作者自报与更正；一手：后续合并补丁]**

**采用范围。** 只读调查、无共享可变外部状态的测试，不因此增加运行环境。确需隔离的数据库测试，可先在现有实例内按运行分库，并确保应用、夹具和子进程都使用正确目标；这不是所有项目的唯一方案，也不要求每Agent另开完整容器。上述固定实现按同机进程ID命名，不能直接推广为跨主机／PID命名空间的唯一标识；异常强杀也可能留下数据库。无法可靠分离时，沿既有建议只串行相关验证。本轮未运行客户端、模型、数据库、容器或上游测试。**[研究：采用判断与验证范围]**

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


### 并行旧研究与编排入口：全文就绪补核

2026-10-15（UTC+8），主线二／三：补齐会改变任务拆分和工具保留选择的剩余边界，不重做前述扩展研究公开数据复算，也不运行模型／客户端。

- [PR 冲突论文 v2 §4.2／§5.3／§7](https://arxiv.org/html/2607.04697v2)：747 为抽样对数，716 可评估；119/601 与 48/115 来自 2024-12—2025-07 同时开放的历史 PR。并发代理、文本合并结果与非受控任务不支持推断同厂／异厂组合的因果优劣。正文保分母与选择限制，不再用醒目百分比暗示搭配原则。[研究]
- [CodeCRDT v1 §4.3／§5.2／§5.4](https://arxiv.org/html/2510.18893v1)：600 次来自六项 TypeScript／React 任务、两模式各 50 次；语义冲突只抽查 60 次，5–10% 是初步估计，作者保留全面测量缺口。时间从提示提交到模型评估结束，质量主要由模型评分；正文删掉易误读为 600 次完整语义验收的比例，不以该计时替代交付成本。[研究]
- [Vibe Kanban 2026-04-10 公告](https://www.vibekanban.com/blog/shutdown)：公司关闭，原远程服务安排 30 天后撤下，本地工作区继续可用，项目转开源社区维护。撤回“整个项目停止维护”的表述；公告意图不证明社区现在活跃或能持续维护，已有本地使用者仍应按实际风险决定，而非被迫迁移。[一手／研究]
- [Conductor 官网](https://www.conductor.build/)与[Cloud FAQ](https://www.conductor.build/docs/cloud/faq)：本地 worktree 与 Cloud microVM 属不同运行路径，当前列桌面、iOS、API 入口。选择前分别核权限、环境及套餐；本轮只读厂商契约，不作实际隔离验证，不自动推荐把代码移到云端。[一手／研究]

独立全页审阅此前已确认任务依赖、完整成本、角色／权限、恢复及相关入口条件；本段只收口上述剩余事实。全文就绪不等于所有产品试用、模型净收益或 hosted CI 已通过。

## M6 选型先导：三项新需求的预注册草案 v1

状态：等待运行授权；仅任务设计。三题为合成但现实的工程需求，不称真实用户业务、训练未见题或生产效果试验。它们没有使用本仓已讲解案例作为答案，不屏蔽公开可搜索资料。

### 固定输入

1. **离线 CSV 差异工具。** 在 Linux 上比较两份带表头的 UTF-8 CSV；逗号分隔、双引号引用及双写引号转义，字段按解码后的字符串精确比较，不做数值推断；空字段是空字符串，不另设 null。列名须唯一且两份列集合相同，集合不同先报告 schema 变化。按指定的一列或多列键匹配记录，区分新增、删除、字段变化；列顺序改变不应被当成数据改变，重复键须显式报告而不是静默任选。需要可脚本消费的输出。允许成熟 CLI、库加薄脚本或现有标准库方案；不能需要上传数据、付费服务或部署数据库。第三方代码需公开许可证与可定位的实现入口。规模目标为百万行，纸面阶段只核处理机制和测量缺口，不宣称内存／时延达标。输出最多三条采用路径，可明确没有现成全满足者，说明要补的最小部分。
2. **Unity 运行时重绑定。** 固定 Unity 6.3、Windows standalone、单人键鼠与手柄。在运行时让玩家改绑定，支持取消、恢复默认、保存并下次加载；组合移动绑定须说明如何处理。同一动作多绑定、重复键冲突和设备断开分别说明由谁负责，不得把有 UI 或能改一个键当整条任务成立。原生 Input System 作为允许的候选，不要求第三方胜出；第三方须公开源码与许可证，不能引入订阅或服务器。每条路径须给 Input System／依赖版本及 Unity 6.3 的资料依据，核不到保留未知。只调查版本、文档及实现，不安装／运行 Unity；真实输入设备和构建兼容性待验。
3. **无框架命令菜单。** 给纯 HTML/JavaScript 静态工具增加本地命令菜单，不引入 React/Vue 等完整框架，不依赖远程服务。能键盘打开、筛选命令、上下移动、执行与 Escape 关闭，并说明打开／关闭后的焦点处理；命令数据在本地，可随功能增删。中文最低要求为连续中文子串匹配，不要求拼音或模糊匹配；行为须有依据，不能把英文 demo 推作中文质量。允许 Web Component、窄库或现有平台能力加少量代码；只核代码和公开演示，读屏组合与实际可访问性效果不作通过声明。

三题共通：优先成熟可维护方案，但不按 star、广告榜单或维护者自称先进决定。固定出处／版本与访问日期；报告硬条件证据、失败和维护代价。外部新候选允许超出参考集合。不能把公开许可证名字等同完成全部发行清权。

### 两路与资源

A：现行普通检索，收到完整任务、输出格式、质量要求和资源边界，可自行选择检索方法。
B：相同输入，只多一项显式策略：在官方和项目自身材料之外，沿实际采用／问题反馈的原始讨论反向发现其他候选，并回候选原始文档／源码核对。它检验显式渠道扩展策略的增量，不代表整个 M6 包的因果效果。A 自然使用相同渠道不禁止，记录实际执行是否重合，不据此剔除样本。

相同模型与推理设置、工具、权限、总时间窗；每题两路隔离上下文，不共享候选。每路最多10分钟，所有子任务时间合计不能因并行绕过上限；本先导各路不再派子任务。共6路，不购买额外API、安装或执行候选软件。每题成对启动，记录开始／结束和失败工具；共享网站访问应使用独立只读页面且不得互读结果。无法匹配浏览器访问条件的题按访问不平衡单列，不纳入策略效果比较。统一原始来源核查合计最多30分钟，每题10分钟，两路对称分配、先核决定性断言；共同来源只查一次并分摊工时。超限项留未判，不补成成功。

### 判定与停止

运行前由独立准备者冻结逐项条件表（硬条件、允许的薄层补齐、不能纸面验证的项）及少量参考锚点；不可核的性能／设备效果不能混作已满足。探索者只收完整需求，不收参考候选、排除例及出处，也不读取本仓旧案例或本次准备材料；正常公开搜索发现同一来源允许。参考只是少量可行或排除例，不是唯一答案，参考缺失不使新候选不合格。准备材料应在开跑前固定版本与校验值；丢失或条件改变则重新冻结，不使用事后构造的答案锚点。

两路各提交最多3个候选和最终决定；固定3槽位，空位保留。按独立采用路径去重，不把同一实现的包装变体算多项。核查者只收随机顺序的匿名结构化结果，不收策略名或执行日志；原始来源可能暴露渠道，故仅称隐藏方法标签，不称完全盲评。核原始材料：资料支持可试用数／3、决定性误推荐数／3、未知数、遗漏的预设关键项及改推荐的理由。可试用不等于接入通过。无访问证据为未知，不能算候选失败；有反证的错误、无依据却肯定推荐、明确硬条件不满足、未知和空位分别列出，空位不算未知或误推荐。并报可决定／合理暂缓／关键问题未回答，不能让零推荐凭零误推荐获胜。逐题列 B 有 A 无且资料支持的路径及反向差集，说明是否改变决定；共同候选的判断纠正另列。使用者是否此前知道及愿意试用另判，未反馈则不报“陌生且有用”得分。任务为统计单位；三题只测方案是否可判，不宣称显著性、全网召回或跨领域普适提效。

模型、token和实际费用不可观测时写未知；仅报告匹配的时间／工具边界与复核投入，不声称完全等算力或零资源成本。保留全部尝试和失败。没有错误减少／有用选择增量而核查负担更大时，不推广策略；结果混合只保留题级描述，不能凭每类一题确定题型适用范围，不合成任意加权总分。

运行前提交预注册，执行后再公布候选与判定证据。当前没有执行任何一路。

以下为 `d5ccf09` 的 v1 历史冻结校验，不代表当时已完成Git交接。参考候选不是唯一答案，未知不自动判失败，补齐示例不是额外硬门槛。v1原约定结果交付时再公开参照；本轮A1改为下述v2公开可交接存档、仅向准备者与核查者分发参考，探索者上下文仍不接收答案。试验产物与判定过程在运行后公布。

- m6-controlled-selection-pilot.md：`d35535a928283e6cec996786ef6106e429a2c0fef62341bfbd21bd190a6ab353`
- m6-pilot-criteria-v1.md：`0299a005035237ae06b233b2760fbd390b232b86b3ac695f8a3f64237273a4d3`
- m6-pilot-anchors-v1.md：`1b4f984c01728514e56158ddd1a38933ac511d0ad6da850c18f8234345813748`


### A1修复：从Git取得公开交接版v2

2026-10-17（UTC+8）。三份原材料已恢复，逐字节核对上述v1 SHA-256全部一致；条件表有一处私有绝对引用，不能原字节公开。故发布[准备材料v2存档](../../experiments/m6-selection-preparation-v2.json)：仅把该引用改为所指文件名，内容条件不变，但条件表哈希必须改变。任务与锚点原字节不变；这不是用新答案冒充旧冻结件。原hash只作历史识别，不能还原已脱敏的v1条件表；仅凭Git的复核以公开v2作为当前冻结集，不声称能取得全部v1原字节。JSON是传输容器，不是加密或访问控制。

| 可提取材料 | UTF-8字节数 | v2内容SHA-256 | 与v1关系 |
|---|---:|---|---|
| m6-controlled-selection-pilot.md | 6363 | `d35535a928283e6cec996786ef6106e429a2c0fef62341bfbd21bd190a6ab353` | 原字节未变 |
| m6-pilot-criteria-public-v2.md | 8718 | `90e03d762f76a763ddabf555f1b8dffffb04b06dcd05c53ad14d41b542ab5228` | 仅私有引用脱敏；旧hash见上表 |
| m6-pilot-anchors-v1.md | 10150 | `1b4f984c01728514e56158ddd1a38933ac511d0ad6da850c18f8234345813748` | 原字节未变 |

**准备者／核查者的取得方法。** 在此仓库Git克隆中执行下面命令，固定并输出材料提交SHA，从该Git对象提取而非信任工作树；解析后在新临时目录还原三件UTF-8/LF材料并验长度与哈希。未来运行须记录这个提交SHA及v2版本；若更新内容，先记录新原因和新哈希，不能沿用本表。无须读取其他会话、原执行机器或私人文件。

```bash
python3 - <<'PY'
import hashlib, json, pathlib, subprocess, tempfile
path = 'experiments/m6-selection-preparation-v2.json'
ref = subprocess.check_output(['git', 'log', '-1', '--format=%H', '--', path], text=True).strip()
def require(condition, message):
  if not condition:
    raise SystemExit(message)
require(bool(ref), '材料尚未提交，不能作为Git交接验收')
bundle = json.loads(subprocess.check_output(['git', 'show', ref + ':' + path]))
require(bundle['version'] == 'v2-public-handoff', '版本不匹配')
expected = {
  'm6-controlled-selection-pilot.md': (6363, 'd35535a928283e6cec996786ef6106e429a2c0fef62341bfbd21bd190a6ab353'),
  'm6-pilot-criteria-public-v2.md': (8718, '90e03d762f76a763ddabf555f1b8dffffb04b06dcd05c53ad14d41b542ab5228'),
  'm6-pilot-anchors-v1.md': (10150, '1b4f984c01728514e56158ddd1a38933ac511d0ad6da850c18f8234345813748'),
}
require(set(bundle['materials']) == set(expected), '材料集合不匹配')
decoded = {}
for name, (length, digest) in expected.items():
  item = bundle['materials'][name]
  raw = item['text'].encode('utf-8')
  require(len(raw) == item['bytes'] == length, name + ': 长度不匹配')
  require(hashlib.sha256(raw).hexdigest() == item['sha256'] == digest, name + ': 哈希不匹配')
  decoded[name] = raw
out = pathlib.Path(tempfile.mkdtemp(prefix='m6-preparation-'))
for name, raw in decoded.items():
  (out / name).write_bytes(raw)
  print(name, len(raw), hashlib.sha256(raw).hexdigest())
print('材料提交:', ref, '提取目录:', out)
PY
```

**角色分发边界。** 准备者先完成上述校验，再从任务件抽取本题完整需求、共同要求、统一输出形式、资源边界及本路策略。探索者使用全新上下文，不接收整份存档、条件表、参考候选、排除例或出处，不读取本仓旧案例或准备材料；普通公开搜索自然命中相同原始来源仍允许。已经读过锚点的准备者和本次审查者不担任隔离探索者。核查者取得条件与锚点，以及匿名随机排列的结果，不取得策略标签或执行日志。

**公开性与执行边界。** v2在Git可公开取得，不能声称答案保密、权限隔离或完全盲评；这里只控制实际送入各角色的上下文。发现探索者读到本存档／参考时，应保留泄漏记录并停止将该题计入方法比较，不能换标签掩盖污染。此次交接修复不是实验运行记录；按已确认范围，也必须先发布并核验材料，之后才开跑，不把准备完整记成效果验证。

### 三题检索先导：实际结果与采用决定

**2026-10-17（UTC+8），本仓真实检索先导。** 改变25的采用选择：不把“沿采用／问题原帖反向找候选”设为每题强制步骤，先沿用普通检索，存在具体候选或维护证据缺口时再扩展。此次不是候选软件、Unity或浏览器交互实测。冻结准备先经A1修复发布于 `7e4a4925f27519045ecc8270057e9b972a23be96`，三件已从远端Git提取验哈希；运行随后才开始，任务/条件/锚点没有事后改写。

**完整交接。** [六路结果、公开执行记录、三份匿名核查与揭盲映射](../../experiments/m6-search-pilot-20261017.json)保留全部已交付候选、排除项、检索式和访问失败，不只挑最好结果。结果文本逐件有SHA-256；执行记录仅替换本轮临时路径及内部工具调用名，查询、时间、来源和失败保留。三题完整需求及条件仍见上方准备材料v2。没有安装、运行候选、调用付费API或操作用户电脑。

**比较对象。** A收到完整需求后自行检索；B仅多“沿实际采用／问题反馈原帖反向发现，再回原始文档／源码核对”。六路均为全新上下文，继承同一请求模型/推理配置与可用工具，不再派任务；每题两路成对启动，实际起点相差9／7／14秒。探索者只收本题需求与共同要求，未分发参考；均报告未读冻结包、旧案例或另一结果。独立核查者只收随机顺序结果、条件与锚点，不收方法名和执行日志；判完才揭盲。公开Git可访问，且来源可能暴露渠道，因此是上下文分发隔离和标签隐藏，不是保密或完全盲评。

| 题目 | A／B资料支持可试用（各3槽） | A／B决定性误推荐 | A／B未知候选 | A／B空位 | B独有支持路径／首选变化 |
|---|---|---|---|---|---|
| Linux CSV差异 | 2／2 | 0／0 | 0／0 | 1／1 | 0／无；均先用标准库加薄脚本 |
| Unity 6.3重绑定 | 1／1 | 0／0 | 1／0 | 1／2 | 0／无；均先用Input System 1.20.1加应用编排 |
| 无框架命令菜单 | 2／2 | 0／0 | 0／0 | 1／1 | 0／无；均先用原生dialog加局部逻辑 |

A独有支持路径也均为0。计数是独立采用路径，不把多个功能、版本或包装重复加分。CSV第二路径和菜单Ninja Keys第二路径都包含明确的拟补齐部分，不是原件开箱通过；薄层尚未实现。Unity两路都看过AGX，A将其列为未知备选，B放在槽外暂缓，不能用空位／未知差异宣称B质量更高。两路均能决定下一步实现入口，生产效果和使用者是否愿用仍未知。

**保留不利发现。** B的Unity报告沿README TODO把AGX冲突能力说得过弱；匿名核查固定源码发现已有局部重复键检测，应收窄为实现不完整、仍需修订。该负面误判不属于肯定推荐不合格路径，不能藏进“误推荐0”；纠正后6.3/依赖缺口仍在，未改变原生首选。CSV核查也纠正两路对schema变化“必须停止”的过强理解，冻结需求允许先报告再另报数据。不能把原实现缺陷搬到已经明确补齐的包装路径，也不能为了验收通过事后替探索者设计新路径。

**时间与费用边界。** 每路上限10分钟、每题核查上限10分钟均未超。以探索者时钟开始至主执行收到最终回传计（含报告整理和传输等待）：CSV A/B约3分18秒／4分11秒，Unity约7分22秒／5分21秒，菜单约5分55秒／6分07秒。各路不是耗满同样算力；日志另记资料检索结束。三题核查记录约4分01秒、3分45秒、3分49秒，合计11分35秒，均含核查报告整理，公共来源一次查验对称使用。没有精确逐候选主动工时、完整模型标识或费用，不能从这些单次时长推出效率提升；并行墙钟时间不等于累计投入。

**访问与外推。** 多个web正文抓取失败，允许的同源raw、官方API、GitHub只读连接器或云端公开HTTP读取补足，失败与仍未知均保留。未发现需要不同权限或浏览器访问条件的题，不能据此宣称所有潜在来源同等可达。普通检索不禁止自然查社区；本次只比较显式指令的增量，不测整个M6包。任务是三项合成需求、每题每路一次，不是训练未见题、真实用户业务或随机总体样本；不算显著性、全网召回、跨题型胜率，也不宣称策略无效。结果支持当前不扩大默认步骤；下一次需由真实未决需求和明确基线触发，不能拿这三题重考制造提升。

## Cognition：上下文按角色选择

核实2026-10-18（UTC+8）。[2025原文](https://cognition.com/blog/dont-build-multi-agents)的完整轨迹共享主张须与[2026-04-22作者修订](https://cognition.com/blog/multi-agents-working)合读。新文区分独立评审的干净上下文与咨询的任务上下文，并由编码者结合原需求筛查反馈；保留对并行写入冲突的警告。[一手：厂商实践报告]

08据此撤回统一共享完整轨迹的读法。本文建议评审保留必要验收依据，沿用09；这是本仓综合判断，并非把作者“不预共享上下文”照抄成一律不给需求。咨询中的全上下文fork是作者采用办法，不是每次传全历史的必要条件。[研究／经验]

文章另报告弱主模型配强咨询者的质量瓶颈及跨强模型生产使用，但没有具名任务、固定产物、验收与总投入对照。不能由此证明额外规划胜过直接强Agent；本次只修订角色上下文选择，不补算模型收益，也不改当前模型推荐。[一手：报告；研究：范围]
