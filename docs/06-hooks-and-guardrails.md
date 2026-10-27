# 06 · Hooks、权限与护栏

> 核实时间：2026-10-21（UTC+8）；依据与分项核实范围见各节末行，其余未重验。

<a id="30-秒结论"></a>

## 先做什么

**先复用现有检查与 CI，确定性质量检查交给项目入口；只有编辑期反馈有明确价值，或现有入口漏掉必要检查时，再加窄 Hook。授权与安全条件交给实际执行边界，不靠 Hook 提醒兜底。**

| 你的情况 | 做法 | 第一步与保留条件 |
|---|---|---|
| 已有格式化、提交检查或 CI | ✅ 先复用，不重复加 Hook | 撤掉重复检查前，在实际工作副本用目标入口验证替代已启用、覆盖所需文件、失败会被处理；目录和配置存在不算生效 |
| 编辑期需要及时反馈，或现有入口漏掉必要检查 | 🧪 加窄 Hook，只挂特定事件 | 先确认事件会触发、matcher 覆盖目标工具、处理器能运行、返回值被运行时执行；失败路径单独测。若只增加重复调用而无新证据，缩减或撤回 |
| 需要立即拦截，不能等事后 | ✅ 用经验证的同步路径；异步只作后续反馈 | 失败语义未确认就撤回“已经受保护”的判断 |
| 资源审批、生产写权限、安全限制 | ✅ 交给独立受控入口（权限／服务端鉴权／沙箱） | ⛔ 提示失败、次数用尽或 Agent 想结束，都不能转成授权；拿不到批准就停对应动作，报告已完成的调查与阻塞（[10](10-security.md)） |
| 要同时约束文件工具、Hook 和 MCP 进程 | ✅ 在容器／虚拟机等外层边界运行整个 Agent | 只打开 `/sandbox` 不算受保护 |

**跨宿主先记住：本仓路径 Hook 只是 Claude Code 编辑事件的辅助拦截，不原样搬到 Codex；同名事件／matcher 不代表输入与决定协议相同，证据见第 2 节。**

**依据**：[一手／经验] 本仓路径 Hook 与跨宿主契约；[研究] 分阶段撤回与激活修订；[经验] 本页采用判断；核实 2026-10-21。

## 当前最高水平：让纠偏收敛，让授权独立

**领先实践的关键是会撤回不合适的检查。** Richard Marmorstein／Austin Ray 的 9-09 OCA 复盘撤回了报告前的严格服从证明，改用有限纠偏，同时保留受限写入与人工合入；失败链见研究页。这说明“多加检查”不是默认答案：提示若不能带来新证据，就该缩窄或撤回。

**比较后的默认：项目检查／CI 管可判定的产物要求，有限 Hook 补特定事件的认知反馈，原生权限／服务端鉴权管能做什么。** 可行起点仍是现有检查与有效权限；没有明确反馈收益就不加 Hook，质量或时效目标也可支持试用。与只加 Stop 检查或只写提示相比，这保留及时反馈，也不把安全寄托在模型服从上。授权主建议见 [10](10-security.md)。

当前模型的最佳提醒配置、单个 Hook 净收益与跨团队采用率仍未知；升级后重验反馈是否值得保留，不照抄案例次数或宣称效果提升。详见[P55证据](research/2026-10-13-context-tool-choice.md#p55能力接入纠偏与授权边界)。

**依据**：[一手] [Ramp 9-09 OCA 复盘](https://builders.ramp.com/post/how-we-built-oca-our-ai-on-call-assistant)（团队自述，10-21 直读）；[研究] 同题比较与 P55 证据；核实 2026-10-21。

## 1. 为什么需要 Hooks

先复用已有格式化、提交检查和 CI；只有编辑期反馈有明确价值，或现有入口漏掉必要检查时，再加窄 Hook。CLAUDE.md 里的指令可能被模型忽略；命令型 Hook 能把某个事件的检查交给程序，但**只有事件被触发、匹配正确、处理器成功运行且返回值被运行时执行时**才有相应效果。Hook 超时、解析失败、工具匹配遗漏和另一条写入路径都可能使保护失效；prompt / agent 型 Hook 也包含模型判断。

**撤掉重复检查前，用实际工作副本的目标入口验证替代已启用、覆盖所需文件且失败会被处理；目录和配置存在不算生效。** 详见[分阶段撤回与激活修订](research/2026-10-12-development-conditions.md#质量检查先验替代入口再撤重复-hook)。

**认知纠偏按实际反馈验收，不按服从次数。** 提醒应服务于补证据、反查假设、及时汇报等明确目标；若连续提醒只让 Agent 反复证明服从、增加重复调用，却没有新证据，就删减该提醒，检查产物是否仍保住所需信息与不确定性披露。

**这不适用于授权条件。** 必需的资源审批、生产写权限和安全限制仍由独立受控入口执行；提示失败、次数用尽或 Agent 想结束，都不能转成授权。拿不到批准时停对应动作，报告已完成的调查与阻塞，而不是用更多 Hook 催它绕过。执行边界详见 [10](10-security.md)。

访问控制仍依靠沙箱、文件权限和出网约束。Hook 必须测试失败路径；不要把“配置了 Hook”写成“所有路径都已强制保护”。

**本仓模板的 `protect-paths.sh` 只作编辑工具的辅助拦截示例。** 它仅注册 Edit / Write / MultiEdit / NotebookEdit，不拦截任意 Bash 写入；只做路径的词法规范化，不解析符号链接；缺失规则、缺失路径或路径在项目范围外时不返回决定。无效 JSON、字段类型或缺失解析器现在返回状态 1 和诊断，**不等于运行时必定阻止操作**。因此不能用来承诺密钥隔离、只读目录或恶意输入下的安全边界。使用前应为目标运行时补测试；不要靠扩写提示词补足操作系统权限。

**2026-10-11 回归的结果与边界**：修正了路径别名漏匹配、解析失败伪装成功及决定 JSON 转义；通用、Unity、Unreal 三份脚本同步。26 个测试方法分别在 jq-only 和 python3-only 路径下通过，覆盖合成盘符 / UNC 输入。保留的边界与复测命令详见 [E6](19-experiments.md#10-e6路径-hook-的确定性回归)。

**依据**：[一手] 本仓模板 `protect-paths.sh` 与 `.claude/settings.json`（仓库脚本，非完整安全审计）；[一手／社区] 官方 Hooks 文档与同题讨论；[经验] 采用判断、模板静态审计（2026-10-11）、离线脚本回归（2026-10-11，UTC+8，26 个测试方法；未执行真实 Windows / macOS 或 Claude Code）；[研究] OCA 失败链提炼的采用与撤回、分阶段撤回与激活修订、质量检查复用与撤回补核（2026-10-18，UTC+8）；核实 2026-10-21。

## 2. Claude Code Hooks 速查

先按目的选事件，再确认返回值与失败策略，并单独测试失败路径；同名事件在 Codex 下不能直接照搬。

### 配置结构
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\"${CLAUDE_PROJECT_DIR}\"/.claude/hooks/protect-paths.sh" }
        ]
      }
    ]
  }
}
```

- **处理器类型**：`command`、`http`、`mcp_tool`、`prompt`（让模型判断）、`agent`（让子 Agent 检查）。
- **`if` 过滤**：用权限规则的语法再加一层筛选，比如 `"if": "Bash(git push*)"`。
- **按目的选事件**：执行前检查用 `PreToolUse`；执行后反馈用 `PostToolUse`；只有进入权限请求流程才用 `PermissionRequest`；完成前检查见下文 `Stop`。`FileChanged` 可观察包括外部写入在内的文件变化，但事后触发，不能阻止写入；不把事件名大全当作覆盖保证。完整事件以官方当前参考为准。

**依据**：[一手] [Claude Code Hooks 参考](https://code.claude.com/docs/en/hooks)（机制核实 2026-10-08，2026-10-15 补核）；核实 2026-10-15（UTC+8）。

### 返回值
| 退出码 | 含义 |
|---|---|
| 0 | 成功；如果 stdout 是 JSON，就按结构化结果处理 |
| 2 | **阻止**（适用于 PreToolUse、UserPromptSubmit、Stop 等可以阻止的事件），stderr 作为原因反馈给 Claude |
| 其他 | 默认通常为非阻塞错误；有效 JSON、事件特例与 `onFailure` 会改变处理 |

**失败策略与版本边界**：官方 `onFailure` 文档规定，`command` / `http` Hook 默认 `"continue"`；`"block"` 需 **v2.1.295+**，可将无法启动、异常退出、超时或无效输出等失败按事件的阻止语义处理（`PermissionRequest` 为拒绝）。它**不适用于 Stop、SubagentStop、TaskCompleted、TeammateIdle，也不适用于 async / asyncRewake**。不要把此字段套到 [19](19-experiments.md) 的 v2.1.294 历史实验，或未经目标运行时测试就改配置。2.1.295 新增 `onFailure: "block"` 后，2.1.296 继续修复部分 managed hooks 行为，见[官方变更来源 S1](research/2026-10-10-audit.md)。

**Stop 的限制**：用户中断不触发它；API 错误触发 `StopFailure`；默认连续继续 8 次后会覆盖下一次阻止而结束，工具调用会重置计数。此外，退出码文档指出，Stop / SubagentStop / TaskCompleted（以及插件 UserPromptSubmit）若退出 2、stdout 为空且 stderr 表示缺文件，会按非阻塞错误处理。必须分别测试正常失败、缺文件、超时与事件覆盖，不能由“装了 Hook”推断必定完成。

**选择边界**：要程序化检查，用命令型 Stop Hook；`/goal` 是会话级 prompt 型 Stop Hook。API 错误应由 `StopFailure` 记录／通知，其输出和退出码不控制继续执行（`terminalSequence` 是显示例外），不要把它当作自动重试开关；本次未确认这些机制的最低支持版本。

PreToolUse 的结构化决定：
```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"..."}}
```
`permissionDecision` 可以取 `allow` / `deny` / `ask` / `defer`。PostToolUse 可以返回 `additionalContext`，用来提醒 Claude（例如“这是生成文件，请改源文件”）。

**本仓模板中的路径保护脚本只匹配编辑类工具，不覆盖 Bash 或其他工具写入，不能当作完整沙箱。** 如何验收故障路径详见 [20](20-codex-long-horizon.md)。

**依据**：[一手] [Hooks 参考](https://code.claude.com/docs/en/hooks)、[`onFailure` 文档](https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails)、[Stop 限制](https://code.claude.com/docs/en/hooks#stop)、[退出码文档](https://code.claude.com/docs/en/hooks#exit-code-output)、[`StopFailure`](https://code.claude.com/docs/en/hooks#stopfailure)（当前文档）、官方变更记录 S1（2026-10-10 补核）；[经验] 边界分析；失败策略与 Stop 边界复核（2026-10-11，UTC+8），未做运行时实测；核实 2026-10-15（UTC+8）。

<a id="otari-architecture-feedback"></a>
### 🧪 Otari：检查结果，而不只检查跑过命令

**遗留项目反复新增越层依赖时，可借 Otari 的窄架构检查，不必安装整套 Agent Guardrails。** 先选一条已确定的边界，沿现有 lint／CI 运行检查；需要结束前反馈时，再接已有宿主入口。Otari 的原 gate 只确认 Agent 跑过命令，后来改成 verifier 实际执行脚本。其旧包白名单也收窄到具体模块：脚本报告新违规和已消失的旧条目；**拒绝新增豁免仍靠评审，它不自动比较历史来保证名单只减不增。** 已有依赖检查够用，或架构边界尚未决定时，不加新检查器。

可从上游 `scripts/check_architecture.py` 与对应测试看这一条规则怎样报错。本次原生 verifier 检查当前树通过，独立检查器测试 302 项通过；未接 a1 的真实改动、宿主 Hook 或模型 judge。上游还修过把 SQLAlchemy `cast` 当成类型标注而漏报的情况，别把自写 AST 检查当成完整语义分析。

**依据**：[一手：采用与修订] [执行 verifier 的 #1786](https://github.com/mozilla-ai/otari/pull/1786)、[真实漏检后收窄规则的 #2041](https://github.com/mozilla-ai/otari/pull/2041)；[本次组件实跑] 固定 `875c8980` 的[检查器](https://github.com/mozilla-ai/otari/blob/875c89803bb23619b51cf4e1558a081fd6bbd6fd/scripts/check_architecture.py)与[302 项测试](https://github.com/mozilla-ai/otari/blob/875c89803bb23619b51cf4e1558a081fd6bbd6fd/tests/unit/test_check_architecture.py)，非模型收益比较；核实 2026-10-27。

### 高价值的 Hook 场景
| 场景 | 事件 | 说明 |
|---|---|---|
| 保护目录或文件（生成物、密钥、第三方代码） | PreToolUse（Edit/Write） | 本仓库模板：[`protect-paths.sh`](../templates/generic/.claude/hooks/protect-paths.sh) |
| 编辑后自动格式化或 lint | PostToolUse | 需要及时反馈时使用；已有项目检查够用则不重复，诊断可经 `additionalContext` 回传 |
| **完成前程序化检查** | Stop | 正常触发且按协议返回时可要求继续；失败策略、事件覆盖与连续阻止上限见上文 |
| 命令风险辅助检查 | PreToolUse（Bash） | 有明确漏检需求才评估第三方解析器；见下方采用边界 |
| 提示注入扫描 | PostToolUse | 扫描结果只是一层信号，不能据此放宽执行或出网权限 |
| 桌面通知 | Notification | Agent 需要输入时提醒你 |
| 非 git 版本控制（Perforce 等） | WorktreeCreate / PreToolUse | 例如编辑前自动 `p4 edit` |

**第三方工具先分清方向**：

| 工具 | 评级与方向 | 采用边界 |
|---|---|---|
| CC Safety Net | 👀 执行前拦截 | 作者明确它不是沙箱，损坏配置不会阻止操作 |
| Dippy | 🧪 自动批准判为安全的命令 | 会减少审批，不能当成单向加固 |
| parry-guard | 👀 命令风险辅助检查 | 仍标早期开发，依赖扫描模型，误报和接入契约需单独评估 |

**原 TDD Guard 已建议新项目转向其后继项目，不在这里保留无条件“强制 TDD”的推荐。** 默认先用原生权限；只有具体缺口值得引入相应依赖时再试用，失败行为未确认就撤回保护声明。

**把纠错变成 Hook**：官方插件 `hookify` 可分析对话并生成 Hook；生成后仍按上述三类区分目的，验证触发与失败路径，不把一次纠错自动升级为永久规则。

**依据**：[一手] [CC Safety Net](https://github.com/kenryu42/cc-safety-net)、[Dippy](https://github.com/ldayton/Dippy)、[parry-guard](https://github.com/vaporif/parry-guard)、[TDD Guard](https://github.com/nizos/tdd-guard) 项目 README，官方插件 `hookify` 能力；[经验] 采用判断与边界，未安装或实测；核实 2026-10-15（UTC+8）。

### 同名事件不等于可直接迁移（Claude Code → Codex）

**Codex 发布标签 `rust-v0.162.1` 的迁移边界：** 本仓模板明确位于 `.claude/`，并非 Codex 适配器；迁移时先改配置发现路径、复核定义信任，再核对输入和输出，不能只换目录或 matcher。

- **匹配了也可能没有检查到文件**：Codex 的 `Edit` / `Write` 是 `apply_patch` 别名；事件仍传 `tool_name: "apply_patch"` 和 `tool_input.command` 补丁文本。本仓脚本只取 `file_path` / `notebook_path`，此输入会正常退出但不返回决定；不要据“Hook 运行成功”宣称迁移成功
- **`ask` 不能照搬**：Claude 的 `PreToolUse` 可请求询问；该 Codex 版本会把 `permissionDecision: "ask"` 记为失败，并继续工具调用。需要人的确认应使用目标宿主支持的审批入口，不以这个返回值代替审批
- **异步只作反馈**：两者的后台 Hook 都不能阻止触发它的动作；Claude 当前文档还说明普通 `async` 启动后不再执行 Hook 的 `timeout`，Codex 则仍执行超时。迁移长测试或日志时也要重验结束／取消条件，不能只复制 `async: true`

以上对照的证据与边界见[跨宿主迁移核对](research/2026-10-12-development-conditions.md#hook-跨宿主迁移匹配成功不等于协议适配)。

**依据**：[一手] Codex 官方契约与固定发布源码 `rust-v0.162.1`、本仓合成 stdin 对照；[经验] 采用判断，未运行真实客户端、未新增路径保护实现；补核并核实 2026-10-15（UTC+8）。

## 3. 权限模式

需要逐项审查时用 Manual / default；日常修改可用 acceptEdits，只有隔离容器或虚拟机等环境才考虑 bypassPermissions。

| 模式 | 说明 | 适用 |
|---|---|---|
| Manual / default | 通常询问写入、命令等；内建只读操作及有效 allow 规则可免询问 | 需要逐项审查时 |
| acceptEdits | 工作目录／附加目录内编辑及常见文件操作命令可自动通过 | 审阅中的日常修改 |
| plan | 规划工作流，不是 OS 只读隔离；命令行为取决于 auto 可用性和设置 | 先探索，再批准实施 |
| **auto** | 规则及免审批路径先处理，其余适用动作交分类器；并非每个动作都经模型审核 | 接受分类器误差、且有隔离兜底的任务 |
| dontAsk | 拒绝原本需要询问的调用；免审批／预批准动作仍可执行 | 预先收紧规则的 CI／脚本 |
| bypassPermissions | 跳过多数审批，仍有例外 | **仅隔离容器／虚拟机等环境** |

**先按实际审批方向选模式，再核配置。** 权限规则与模式说明共同决定实际行为。`plan` 在 auto 可用且 `useAutoModeDuringPlan` 开启（默认）时可运行分类器批准的命令；交互终端若提供 bypass 切换，还存在更宽的规划权限例外。要求真正只读时另设执行边界，不能只看模式名。

- **auto 的入口边界**：v2.1.283+ 的内建 auto 默认指**交互终端与 VS Code**，仍受入口、配置和可用性影响；不要推到所有客户端／非交互任务。
- **规则求值**：权限规则可在 `.claude/settings.json` 等设置层配置，按 deny → ask → allow 求值；`Agent(model:opus)` 这类参数规则用于 deny／ask，不是任意参数 allow。具体设置先查官方当前文档。
- **⚠️ v2.1.246 提醒**：`Bash(git * main)` 这类**通配符写在子命令前面**的 allow 规则，会把插在子命令前的选项也匹配进去，存在被绕过的风险。

**依据**：[一手] [权限规则](https://code.claude.com/docs/en/permissions#permission-modes)、[模式说明](https://code.claude.com/docs/en/permission-modes)、[按输入参数匹配](https://code.claude.com/docs/en/permissions#match-by-input-parameter)；核实 2026-10-15（UTC+8）。

## 4. Auto mode：实测数据

先限制凭证、写入和出网范围，再决定把哪些审批交给分类器或 Hook。以下数据来自 Anthropic《Claude Code auto mode》（2026-03-25）公布的历史评估；不是本仓实测，也不是当前所有版本的安全率。

**架构**
- 输入层：一个提示注入探测器先检查工具输出；
- 输出层：历史设计剥离 Agent 解释和工具输出，减少直接操纵分类器的入口；**不保证抵抗所有注入**，被劫持的主 Agent 仍可能发出漏过检查的动作。当前客户端请求还包含 CLAUDE.md，并可接收 Hook 的 `classifierContext`（v2.1.236+），不能把历史简图当成完整现行输入契约；
- 分两级：先用快速的单 token 判断，只有可疑时才启用思维链推理。

**默认拦截约 20 条规则**：不可逆的破坏（强推、大量删除）、降低安全性（关日志、装持久化后门）、越过信任边界（运行不可信代码、扫描凭证）、绕过共享基础设施（直接部署生产）。

| 数据集 | 第一级误拦率 | 最终误拦率 | 漏放率 |
|---|---|---|---|
| 真实流量（1 万个动作） | 8.5% | **0.4%** | — |
| 真实的“过度执行”动作（52 个） | — | — | **17%** |
| 合成的数据外泄（1000 个） | — | — | 5.7% |

- 被拦后可尝试安全替代路径；可交互时，连续 3 次或累计 20 次分类器拒绝会回退询问；无提示宿主的 `-p` 不会因此转交人工。计数与回退见官方说明。需要人审的动作另设 ask 规则，不能等阈值触发才算边界。
- **定位**：用来替代 `--dangerously-skip-permissions`，**不适合高风险基础设施**，也不能代替环境隔离。17% 的漏放率意味着它只是一层防护，不是全部。

**第三方实测：auto mode 可以被绕过**
- Embrace The Red（2026-08-31）构造了一条攻击链：让 Claude 在“总结网页”时从 WebFetch 改用 curl，下载一个 ZIP，Claude 拒绝执行里面的二进制文件，却**自己写了 Python 解码脚本，并在攻击者解压的目录里运行**，结果被同名的 `struct.py` 劫持。
- 作者迭代载荷后的三个变体各测 5 次，分别为 3/5、3/5、4/5；只支持该攻击链可行，不能与不同条件的受托测评直接比较。原始来源和边界见 [10 安全](10-security.md#2-2026-年的真实事件与研究)。

**人工审批也可能漏检**：一个限时模拟审批游戏的 4 万局数据中，玩家平均漏掉约 1/3 的威胁，藏在 `npm run` 后面的恶意脚本漏掉一半以上；题目威胁占比和参与方式与生产不同，**不能外推为实际团队漏检率，也不能据此比较人与 auto mode 谁更安全**（[原文与局限](10-security.md#2-2026-年的真实事件与研究)）。这支持保留环境防线：无论采用哪种审批，仍限制凭证、写入和出网范围。防范上，不让 Agent 在下载来的目录里执行代码（Python 会优先导入当前目录里的同名模块）；处理不可信内容的会话不给执行权限。

本节的现行契约与第三方采用取舍详见[核查记录](research/2026-10-12-development-conditions.md#权限模式与第三方-hook按实际审批方向选择)。

**Codex 的对应机制：Auto-review**：reviewer 选择与 CLI `--approve-for-me` 的完整组合配置不同；不自动扩大长期配置，不表示单次获批提权不能越过原沙箱。审批策略不等于交互界面，Computer Use App 级审批仍直接交给用户。当前默认策略在 `codex-rs/prompts/templates/guardian/policy.md`；本地 `policy`、`extra_policy` 与托管优先级须分别核对，统一详见 [Codex 专题](01-agents/codex.md#审批沙箱与-auto-review)。

**依据**：[一手] Anthropic《Claude Code auto mode》（2026-03-25；2026-10-15 重读原文）、[auto mode 回退说明](https://code.claude.com/docs/en/permission-modes#when-auto-mode-falls-back)、Codex Auto-review 官方文档与固定源码（2026-10-11 补核；未运行真实审批服务）；[社区：原文] Embrace The Red 攻击链（2026-08-31）；[社区：模拟游戏] 限时审批模拟游戏（4 万局，非生产）；[经验] 采用判断；核实 2026-10-15（UTC+8）。

## 5. 沙箱

| 层级 | 做法 | 适用 |
|---|---|---|
| Shell 沙箱 | Claude Code：macOS Seatbelt / Linux、WSL2 bubblewrap；只覆盖沙箱内命令，原生 Windows 不支持 | 本机命令；有效设置见下文 |
| OS 级沙箱（Copilot） | GitHub Copilot 本地沙箱 2026-10-07 正式可用：基于微软 MXC，在三大系统上限制文件、网络、Git 和 GitHub CLI 凭证；**企业托管设置可以强制开启且开发者无法放宽** | 用 Copilot 的团队 |
| 容器 | devcontainer、container-use（每个 Agent 一个容器）、aicontainer | 放开权限的自动任务 |
| 微虚拟机 / 虚拟机 | brood-box、Lima、Incus | 不可信代码、高风险任务 |
| 云端临时环境 | Claude Code on the web、Codex Cloud | 无需本地环境的任务 |

**先核覆盖，再选隔离层**：官方文档明确文件工具、Hook 和 MCP 进程在 shell 沙箱外；缺必需依赖时默认还可无沙箱继续。要同时约束这些进程，需在容器／虚拟机等外层边界运行整个 Agent；要保护 shell 路径，先按 [10 的有效配置](10-security.md#32-claude-code-沙箱操作手册)核退出／排除项、凭证和出网范围，不能只打开 `/sandbox` 就宣布受保护。

Anthropic《How we contain Claude》（2026-05）的结论：
1. **环境边界胜过行为约束**：一次诱导外泄 AWS 凭证的攻击，最后只有出网拦截挡住了；
2. 按用户专业程度选择隔离方式（开发者能看懂 bash 命令，普通知识工作者看不懂）；
3. **成熟工具胜过自研组件**：虚拟机管理程序和系统调用过滤很可靠，Anthropic 自研的代理反而出过漏洞；
4. 历史漏洞：项目配置里的 hook 曾在信任提示出现**之前**执行，官方称已修复；不能据此推断当前入口行为，非交互脚本仍须按 [10 的配置来源边界](10-security.md#3-防护原则)处理。另有通过“已批准的域名”外泄数据的事件（上传到攻击者在合法服务上的账号）。

**依据**：[一手] [Claude Code 沙箱文档](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)、[GitHub Copilot 本地沙箱公告](https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/)（2026-10-07）、[container-use](https://github.com/dagger/container-use)、[aicontainer](https://github.com/stefanoginella/aicontainer)、[brood-box](https://github.com/stacklok/brood-box)、Anthropic《How we contain Claude》（2026-05）；[经验] 选择判断；核实 2026-10-15（UTC+8）。

## 来源

- [Ramp OCA 取舍与P55统一证据](research/2026-10-13-context-tool-choice.md#p55能力接入纠偏与授权边界)
- [Hooks 参考](https://code.claude.com/docs/en/hooks)、[Hooks 指南](https://code.claude.com/docs/en/hooks-guide)
- [Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode)、[How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)、[Claude Code sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [anthropics/claude-code examples/settings](https://github.com/anthropics/claude-code/tree/main/examples/settings)（lax / strict / bash-sandbox 三套示例）
