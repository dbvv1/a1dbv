# 10 · 安全

> 最近核实：2026-10-26（本地只读 MCP 的目录验收）；其余各节保留 2026-10-21 核实日期（UTC+8）。旧事件及平台配置的分项核实范围见[研究记录](research/2026-10-12-development-conditions.md)。

## 30 秒结论

**✅ 默认采用最小权限与操作系统隔离；审批、提示词和“已开启 sandbox”都不能单独证明隔离完成。** 日常可信项目可用本地沙箱；外来仓库、带秘密的 CI 或无人值守任务，先隔离整个执行环境，再按需要开放目录和网络。第一步按客户端核对有效配置：Claude Code 看 [§3.2](#32-claude-code-沙箱操作手册)，Codex 看 [§3 的权限 profile](#codex-文件排除的采用条件)。

**撤回条件**：工具要靠关闭文件隔离、放开全部 socket、排除整个解释器或暴露生产凭证才能跑通时，暂停该步骤，换无秘密的独立环境；不要把“能运行”当作“仍安全”。本页比较接入、执行与核查机制，不作客户端安全认证。

**依据**：[研究] 下列官方机制与攻击案例的采用判断；[经验] 采用边界；核实 2026-10-21。

## 当前最高水平：把能力、授权与事后核查分开

**近期领先实践是分层约束真实执行，而不是让模型多背一段安全提示。** OpenAI 在 2026-05-08 内部部署复盘中组合沙箱、边界审批、受控网络和强制配置，并把动作结果与原请求、审批记录关联后交安全人员判断。这是实际团队做法，不是不同防护方案的安全率排名。

**工具发现不是授权边界。** Ramp 的 Laminar Connectors 把谁能使用凭证、允许什么操作集中在服务层；工具搜索只解决工具暴露与上下文负担。隐藏工具或改变模型可见目录后，仍须在实际调用端限制权限。

**本仓默认先限定可接触的数据与可执行动作，再增加反馈自动化。** MCP 补接口、Hook 补事件检查、原生沙箱限制进程，三者不能互相代替；外部服务的业务鉴权仍由服务端承担。主流部署比例与跨任务最佳组合未知，先采用目标环境能真正执行的最小边界。详见 [04 接口选择](04-mcp.md)、[06 事件边界](06-hooks-and-guardrails.md)。

**调查异常时，区分“获得允许”与“实际发生”。** 在已有授权范围保留必要的请求、决定与结果关联，先核动作是否执行及影响，再判断是否恢复；不要只因审批通过就宣布安全，也不默认记录完整对话或秘密。字段与保存范围由任务和数据要求决定。

### 公网产物：把数据边界留在查询过滤之外

**✅ 接收 Agent 生成的公网应用时，匿名访问核查与数据隔离分开做。** 扫描能发现开放行为，但不能替代应用可接触的数据边界；公开服务若不需要内部数据，优先让它运行在不持有这些数据与权限的环境中。已有隔离满足要求就保留，不为个案重建平台。

METR 的 2026-08-31 复盘披露：3 月生成的面板因失败时放行而失去鉴权；5 月另一个只读查询入口虽默认限制公开数据，仍存在越界缺陷。团队随后隔离公共生产与内部基础设施。这是独立团队的事故反例，不是某套扫描方法的效果复现。

Agent 应核当前部署入口、鉴权失败行为和数据来源；人确定允许公开的内容与例外。不能仅凭一次 403 或“只读 SQL”接收内部数据边界；发现未授权开放就先关闭或收窄受影响路径，授权范围内的修复与隔离验证可继续。原文范围、反例与[工作流接收表](07-workflows.md#公网服务交付验实际开放范围不只验登录配置)见[研究记录](research/2026-10-12-development-conditions.md#公网交付部署事实匿名访问与数据隔离)。

**依据**：[一手：团队自报] [OpenAI 2026-05-08 内部部署复盘](https://openai.com/index/running-codex-safely/)；[一手：10-20 系列团队自报] [Ramp Laminar Connectors](https://builders.ramp.com/post/building-laminar/connectors)、[Ramp 工具搜索](https://builders.ramp.com/post/building-laminar/tools)；[一手：团队复盘] [METR 2026-08-31 复盘](https://metr.org/blog/2026-08-31-security-update/)；[研究] 接入选择、威胁模型与采用判断；核实 2026-10-21。

### 本地只读 MCP：目录验收覆盖可调用的兼容入口

**✅ 按实际可调用入口验目录限制，同时确认允许目录里的任务仍可用。** `tools/list` 是发现接口，不是完整的权限验收清单；升级后保留的旧工具名也可能经 `tools/call` 派发。给本地 MCP 加了只读权限，仍须限制它能读哪些资料。

anymd 的官方公告提供了具体反例：`pdf_compare` 自 7.0.0 起不在工具列表里，却仍可调用；受影响版本漏查目录白名单，会返回越界 PDF 的词差集合、页数与字符数等统计，错误还可能透露路径存在与 PDF 可读性，**不是任意文件全文读取**。`@sylphx/anymd` 7.0.0–8.5.4 受影响，8.5.5 修复；旧包名 `@sylphx/citra` 的起始受影响版本及源码链见[证据记录](research/2026-10-26-mcp-dispatch-boundary.md)。

| 接入时验什么 | 接收条件 |
|---|---|
| 版本与实际入口 | 确认启动的是含修复的二进制，核生效目录配置；用工具列表加 dispatcher／兼容入口清单确定覆盖范围 |
| 目录外访问 | 在无秘密环境使用自建夹具，逐个检查可调用入口的路径参数；比较两个文件时，两侧分别验证拒绝，而不只测一个普通读取工具 |
| 目录内任务 | 用有效夹具完成正常读取／比较并检查结果；“所有调用都失败”不算边界正确，不能靠清空白名单恢复功能 |

anymd 不配置允许目录时，不会额外收窄操作系统允许的文件读取范围；即使版本已修复，也要实际配置 `--allow-dir` 或 `MCP_PDF_ALLOWED_DIRS`。无法覆盖兼容入口或确认有效配置时，先把进程放在只挂载所需资料的隔离环境。固定源码的回归已写入旧入口双路径拒绝和允许路径正常比较的断言；本仓只读核查，未执行这些 Rust 测试。

**依据**：[一手：官方披露] [GHSA-xrc8-gj3q-m8vm](https://github.com/SylphxAI/anymd/security/advisories/GHSA-xrc8-gj3q-m8vm)；[一手：固定源码与回归定义] [派发、修复与测试范围](research/2026-10-26-mcp-dispatch-boundary.md)；[研究] 接入验收建议；核实 2026-10-26。

## 1. 威胁模型：致命三要素

**风险取决于能力组合：同时具备以下三点，就可能被诱导泄露数据。** Simon Willison（2025-06）提出的 **lethal trifecta** 是：

1. **能访问私有数据**：代码、密钥、邮件、工单、数据库；
2. **会接触不可信内容**：Issue、PR 评论、网页、README、依赖包、MCP 返回值、错误日志；
3. **有对外通信能力**：发请求、开 PR、写对方能看到的文件，甚至渲染一张 Markdown 图片。

接入私有仓库、外部资料与可写远端的 Coding Agent 很容易同时具备这三点；是否成立要看实际环境。被投毒的 README 或 Issue 可诱导 Agent 用已有权限外泄，不必先利用代码漏洞。实例见案例一。

**依据**：[研究] Simon Willison lethal trifecta（2025-06）；[二手] [The lethal trifecta（Arcjet 解读）](https://arcjet.com/learn/lethal-trifecta)；核实 2026-10-21。

## 2. 2026 年的真实事件与研究

**用下表核对与自身接入方式相近的攻击面；这些是公开事件与研究摘要，不是工具安全率排名。** 先看事件中的入口、权限和出口，再对照本页防护。

| 事件 | 要点 | 证据 |
|---|---|---|
| **Agentjacking**（2026-06） | 攻击者用公开的 Sentry DSN 往错误事件里注入指令；Claude Code、Cursor、Codex 通过 Sentry MCP 读取后，以开发者的权限执行了攻击者的命令 | 见依据 |
| postmark-mcp（2025-09） | 第一个被发现的恶意 MCP 服务器：先发布 15 个正常版本建立信任，再加入一行外泄代码 | 见依据 |
| LiteLLM PyPI 后门（2026-03） | 约 3 小时内被下载约 4.7 万次；LiteLLM 是 CrewAI、DSPy 等框架使用的模型网关 | 见依据 |
| Gemini CLI 安全修复（2026-08~09） | 通过构建文件和不可信参数的间接提示注入、MCP OAuth SSRF、凭证泄漏、workspace trust 改为默认拒绝 | 见依据 |
| Anthropic 自曝（2026-05） | 历史漏洞：项目配置里的 hook 在信任提示出现**之前**就执行了，官方称已修复；披露月份不代表发生或修复月份，当前脚本入口另见第 3 节；通过“已批准的域名”外泄数据；直接的提示注入绕过了所有模型层面的防御 | 见依据 |
| **OpenAI 内部评估中的越界事件**（2026-07；8 月复盘） | 模型利用共享基础设施漏洞获取网络访问与未授权通信，随后侵入 Hugging Face 等系统。主要涉及未公开的内部研究模型，评估采用比外部部署弱的防护；说明基础设施与出网边界也须审计，**不能据此判定发布版 Codex 的同类行为或失效率** | 见依据 |
| **攻破 Claude Code auto mode**（2026-08） | 让 Claude 自己写解码脚本并在攻击者目录里运行，被同名 `struct.py` 劫持；作者迭代载荷后的三个变体各测 5 次，分别成功 3/5、3/5、4/5，仅证明该攻击链可行，不是通用成功率 | 见依据 |
| **Claude Code 隐写标记**（2026-06） | 根据 API 地址和时区，悄悄改变系统提示里日期字符串的写法；属于透明度问题 | 见依据 |
| **人工审批的真实漏检率**（2026-08） | 一个模拟“给 Coding Agent 审批命令”的小游戏收集了 4 万局、40.9 万次决策：<br>• 平均**漏掉 1/3 的威胁**（准确率 66.3%）；<br>• 明显的破坏命令漏掉 11.7%，持久化篡改（crontab、git config）漏掉 23.8%，外泄和代码执行漏掉 33.4%，越权读取凭证（`cat ~/.aws/credentials`）漏掉 35.0%；<br>• 恶意内容藏在 `npm run xxx` 后面时漏掉 **52.5%**，即使恶意脚本就显示在上方的历史记录里；<br>• 7% 的玩家对所有请求都点了同意；正常命令也常被误拦（43–59%）；<br>• 局限：有时限、威胁占比约 34% 远高于现实，部分题目的标注在 HN 上有争议 | 见依据 |
| **Wikimedia 发现 OpenAI 失控 Agent**（2026-10） | 编辑 wiki、尝试利用托管的笔记工具、大量流量；未发现被攻破。开放网络的维护者承担了调查和溯源成本 | 见依据 |
| 学术研究 | MCP 生态攻击的大规模分析（arXiv 2509.06572）、MCP 服务器污点漏洞（VIPER-MCP）、开发者常见安全误区（MCP Pitfall Lab） | 见依据 |

**依据**：[二手] [CSA Agentjacking 研究笔记](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/)、[Checkmarx：MCP Security Incidents](https://checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/)、postmark-mcp 与 LiteLLM PyPI 后门报道；[一手] [Gemini CLI changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs)、Anthropic 自曝、[OpenAI 官方复盘](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)、[Wikimedia：OpenAI "rogue" agent activities](https://diff.wikimedia.org/2026/10/05/openai-rogue-agent-activities-found-on-wikimedia-projects/)；[社区：原文] [Embrace The Red：Breaking Claude Code Opus 5 Auto Mode](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)、[thereallo.dev：隐写标记](https://thereallo.dev/blog/claude-code-prompt-steganography)、[Scale X：Humans missed 1 in 3 threats](https://scalex.dev/blog/ai-agent-permissions-stats/)（[HN 讨论](https://news.ycombinator.com/item?id=49195468)）；[研究：摘要] arXiv 2509.06572、VIPER-MCP、MCP Pitfall Lab；核实 2026-10-21。

## 2.1 四个案例拆解：攻击链和本可以断开的那一环

**先看每个案例的断点或启示，再看攻击链。** 按“入口 → 放大器 → 出口”拆解，四个案例的断点、启示与攻击链如下。

<a id="案例一github-mcp-有毒流程2025-05invariant-labs社区安全厂商原文"></a>
### 案例一：GitHub MCP “有毒流程”（2025-05，Invariant Labs）

- **本可以断开的一环**：
  - **一个会话只碰一个仓库**（作者给的策略就是“每个会话只能访问一个仓库”），或者让读取外部 issue 的会话只拿只读、单仓库的 token；
  - 这不是 MCP 服务器代码的 bug，而是架构问题：致命三要素在一个会话里同时成立了。
- **攻击链**：
  - **场景**：Claude Desktop 的 GitHub MCP 可访问公开与私有仓库；用户仅要求查看公开仓库的 open issue。
  - **入口**：攻击者在公开仓库提交一个 issue，里面藏了提示注入。
  - **放大器**：注入利用同一 token 读取私有项目名、搬家计划和薪资；用户此前选了工具调用“Always Allow”。
  - **出口**：Agent 在**公开仓库**开 PR，把读到的私有内容写进去，攻击者直接就能看到。

**依据**：[社区：安全厂商原文] [Invariant Labs：GitHub MCP 漏洞](https://invariantlabs.ai/blog/mcp-github-vulnerability)；[经验] 断开环节与采用建议；核实 2026-10-21。

<a id="案例二s1ngularity--nx-供应链攻击2025-08一手nx-安全公告--社区stepsecurity-分析"></a>
### 案例二：s1ngularity / Nx 供应链攻击（2025-08）

- **本可以断开的环节**：
  - **CI**：不在 `pull_request_target` 里拼接不可信输入；发布改用 trusted publishing（Nx 事后的做法）；
  - **本机**：恶意安装脚本直接调用 CLI 并传 bypass 参数，不依赖 shell 别名；应在无秘密的受限环境运行不可信安装脚本；
  - **凭证**：秘密应留在不可信安装环境外；`sandbox.credentials` 只保护被沙箱覆盖的命令，拦不住外层恶意安装进程直接读取主机凭证；
  - **依赖**：陌生依赖先审 `package.json` 与锁文件变更，在无秘密、限制挂载与出网的独立环境中用 `npm ci --ignore-scripts` 安装，后续测试／构建也留在该环境。该选项跳过安装脚本，但显式 `npm test`／`npm run` 仍执行目标脚本；npm 契约与锁文件边界见下段。
- **攻击链**：
  - **入口**：Nx 仓库的 PR 校验工作流用了 `pull_request_target`，并把 `${{ github.event.pull_request.title }}` 直接拼进 `run:` 脚本。一个精心构造的 PR 标题就能执行任意命令，拿到有写权限的 `GITHUB_TOKEN`，再借它触发持有 npm token 的发布流程。漏洞工作流从 master 删掉后，**仍然留在旧分支上可以被触发**。
  - **放大器**：恶意 postinstall `telemetry.js` 用 `which` 找本机 AI CLI，依次调用 `claude --dangerously-skip-permissions -p`、`gemini --yolo -p`、`q chat --trust-all-tools --no-interactive`。提示词令已登录的 Agent 递归搜索 `$HOME`、`$HOME/.config`、`/etc` 的钱包、密钥和凭证，把路径写入 `/tmp/inventory.txt`。
  - **出口**：用受害者自己的 `gh` 凭证，在受害者账号下建公开仓库 `s1ngularity-repository`，上传多重 base64 编码的结果。还往 `.bashrc` 和 `.zshrc` 里追加了 `sudo shutdown -h 0`。
  - **规模**：Wiz 事后统计约 2,180 个账号、7,200 个仓库暴露。恶意版本在线约 5 小时。

**确需恢复已跳过的原生构建时，审过所需包后按包批准，并在原隔离环境重建。** 不必全开脚本或更换包管理器。npm 12.2.0 已默认阻止未准入的依赖安装脚本，但通常只警告。按以下顺序恢复：

1. `npm install-scripts ls` 找出未审项；
2. 审过必要包后，用 `npm install-scripts approve <包>` 记录默认已安装版本的准入（裸包名可匹配多个已安装版本；只批准所需版本时传明确包版本）；
3. 核对实际生效后，在原隔离环境中定向重建并验证功能。

已有明确拒绝项时 approve 不会覆盖，需先调整相冲突的拒绝策略；批准只写策略，不会补跑构建。CI 可加 `--strict-allow-scripts` 让新出现的未审脚本失败，不要与 `--ignore-scripts` 混用来期待此检查。已有 pnpm 项目复用 `allowBuilds`／`strictDepBuilds`，无需为此迁移。**局限：准入不验证脚本安全，也不隔离项目脚本或运行期代码；安装通过仍可能缺少被明确拒绝的必要产物。** 见[版本、实际采用与配置优先级](research/2026-10-12-development-conditions.md#陌生依赖安装后仍须隔离测试)。

**依据**：[一手] [Nx 安全公告 GHSA-cxm3-wv7p-598c](https://github.com/nrwl/nx/security/advisories/GHSA-cxm3-wv7p-598c)；[社区：原文] [StepSecurity：Nx 恶意包分析](https://www.stepsecurity.io/blog/supply-chain-security-alert-popular-nx-build-system-package-compromised-with-data-stealing-malware)；[二手] [BleepingComputer：2,180 个账号受影响](https://www.bleepingcomputer.com/news/security/ai-powered-malware-hit-2-180-github-accounts-in-s1ngularity-attack/)；[经验] 断开环节与采用建议；npm 契约见正文研究记录；核实 2026-10-21。

<a id="案例三amazon-q-vs-code-扩展-18402025-07cve-2025-8217一手aws-安全公告"></a>
### 案例三：Amazon Q VS Code 扩展 1.84.0（2025-07，CVE-2025-8217）

- **启示**：AI 工具自己的供应链就是攻击面。“提示词即载荷”让恶意代码更难被传统扫描器识别。
- **攻击链**：
  - **入口**：CodeBuild 配置里的 GitHub token 权限过大，攻击者借它往扩展的开源仓库提交了恶意代码；
  - **放大器**：恶意代码被自动打进正式版本，发到用户手里；
  - **结果**：AWS 的结论是，这段代码因为**语法错误**没能执行。按媒体报道，注入的是一段让 Agent 清理本机和云资源的提示词，AWS 公告本身没有描述它的内容。

**依据**：[一手] [AWS-2025-015](https://aws.amazon.com/security/security-bulletins/AWS-2025-015/)；[二手] 案例三媒体报道；[经验] 断开环节与采用建议；核实 2026-10-21。

<a id="案例四agent-之间互相授权anthropic-内部2026一手anthropic-安全博客"></a>
### 案例四：Agent 之间互相“授权”（Anthropic 内部，2026）

- **Anthropic 的结论**：“把边界画在访问权限和动作上，而不是画在模型的指令上”；
- **经过**：一次模型升级之后，事件响应 Agent 通过 Slack **请求写代码的 Agent 推送一个修复**，最终被人工闸门拦下；
- **对应的产品机制**：Claude Code 的 Agent Teams 把来自其他 Agent 的消息标记为“来自另一个 Claude 会话”。队友不能代替你批准权限，被拒绝的动作也不能转交给别的队友去执行。auto mode 的分类器把其他 Agent 转述的“已获批准”当作不可信输入。

**依据**：[一手] Anthropic 安全博客与 [Agent Teams 权限文档](https://code.claude.com/docs/en/agent-teams#permissions)；[经验] 断开环节与采用建议；核实 2026-10-21。

### 案例共性

不可信输入借过大的权限抵达外泄或破坏渠道；案例三因语法错误未执行，案例四的生产推送由人工闸门拦下。

## 3. 防护原则

**先落实可验证的环境边界，再叠加审批、最小权限与供应链检查。**

1. **环境边界优先于行为约束**：沙箱、容器、虚拟机、出网白名单这些确定性手段，比模型“自觉”和提示词防御可靠得多。在 Anthropic 的案例中，只有出网拦截挡住了凭证外泄。
   - **审批须看执行内容**：`npm run build` 等命令可能执行已被篡改的脚本。按已授权范围减少重复询问，先落实可验证的环境边界；**上述游戏数据没有证明少审批会让剩余审批更准确**（分析见 [14 规律三、四](14-synthesis.md#3-规律三按实际接收能力安排产出)）。
2. **打破三要素中的至少一个**：
   - 处理不可信内容（外部 Issue、网页、日志）时，隔离无关秘密与敏感数据；必要的资料读取仅开放获准目的地，执行外来代码另用无秘密、低权限环境；
   - 需要认证或敏感数据的任务，凭证按用途隔离，并限制可访问资源、外发目的地和写入动作；无法维持边界时，将不可信内容的分析与高权限执行分开。
3. **最小权限**：只读账号、受限 token、按项目隔离的凭证；不需认证时把真实凭证留在执行环境外，已有拒读／凭证移除足够时不加网关。确需认证才评估代理注入，并核目标、导出能力和本机权限；代理可减少子进程直接持有密钥，不能保证“Agent 永远看不到”，也不替代账号授权与进程隔离。见[Authsome 机制与现成边界](research/2026-10-12-development-conditions.md#凭证代理减少直接持有不等于永远不可读取)。
4. **供应链**：MCP、Skill、插件安装前读内容，固定版本或 SHA（Claude Code 插件支持锁定到 commit），关注更新日志。
5. **成熟工具优先**：用虚拟机管理程序、seccomp、bubblewrap，而不是自研的拦截层。
6. **harness 本身也要评估**：闭源二进制做了什么，要靠逆向才知道（见隐写标记事件）；公司环境要有允许使用哪些 Agent 的清单。
7. **审查 Agent 引入的依赖和服务**：Agent 会替你选数据库、SaaS 和库，已经有公司专门做“影响 Agent 选型”的生意；包仓库里也出现过 AI 实验室 Agent 上传的包。
8. **预算与停用边界**：限制 Agent 开通付费服务的权限；配置适用的 spend limit / spend cap，并核对覆盖范围、计费延迟和停用后果，不能只设告警，也不能假设所有账户和服务都支持硬性封顶（见 [18 第 5 节](18-team-adoption.md#5-成本治理)）。
9. **不在不可信目录里执行代码**：Python 等语言会优先导入当前目录里的同名模块，auto mode 攻击就利用了这一点。

**Python 多索引先固定包来源。** `pip --extra-index-url` 不保证私有源优先；受控单索引或已审离线包集合够用时保留现有工具。已有 uv 项目可按包绑定索引；缺兼容版本先修正确来源的发布／依赖条件，不为解析通过放宽跨源搜索。可信哈希锁继续保护已选工件，更新锁时仍须审来源，后续执行仍须隔离。见[索引选择与哈希边界](research/2026-10-12-development-conditions.md#python-多索引先固定包来源再解析)。

**外来仓库转脚本前，先限制配置来源。** 普通 `claude -p` 不显示工作区信任或逐服务器批准提示，未信任目录中的项目 Hook 与 `.mcp.json` 仍会运行／连接。先用 `--setting-sources user` 排除项目 settings 与 `.mcp.json`；不需要自动发现能力时，再用 `--bare`，仅显式加入审过的输入与工具。`--bare` 单独使用仍会应用项目 `env` 与部分认证 helper，不能替代整个进程的隔离。用官方权限矩阵核对启动前行为，具体边界与认证前提见[研究记录](research/2026-10-12-development-conditions.md#交互试点转脚本bare-不是等价加速)。

**Codex 需单独核对。** `codex exec` 的只读任务需选只读权限：使用旧沙箱配置时可显式选择 `--sandbox read-only`；已有文件排除 profile 时，不再叠加这个旧开关（见下段）。同时核对有效权限与配置、指令、技能来源；项目信任不能替代 sandbox，跳过项目配置也不等于排除所有项目技能。审查 Hook 时还要检查它引用的脚本：当前固定实现记录的是 Hook 定义哈希，不是脚本内容哈希。具体状态、覆盖条件与[源码范围](research/2026-10-12-development-conditions.md#codex-脚本入口信任状态不等于有效权限)另列；未运行发布客户端，不将 Claude 的启动行为外推到 Codex。

### Codex 文件排除的采用条件

**🧪 有条件采用权限 profile，先确认生效配置，再让工作区接触秘密。** 官方已支持 macOS、Linux、WSL 和原生 Windows 的本地命令权限；`deny` 可排除读取，但 profile 仍标为 Beta。不要用 `.gitignore`、提示词或 issue 已关闭代替这一边界。

- **不要混用新旧配置。** 普通配置中，任一已加载 `sandbox_mode`、启动参数 `--sandbox` 或选定配置 profile 中的 `sandbox_mode` 都会让 Codex 使用旧沙箱设置而非 `default_permissions`。托管 `allowed_permission_profiles` 会强制使用权限 profile，是例外；应按部署要求清理冲突，不能把“配置文件里写了 deny”当成已经生效。
- **按实际执行入口验收。** 确认选中的 profile、工作区与后端；Windows 当前有 MXC／legacy elevated，不能沿用旧的“不支持 Windows”结论。换 CLI、App 或执行环境时，后续验收应在无秘密的隔离样例中确认：允许文件仍可读，指定拒绝文件读取失败；MCP、浏览器、连接器与云环境按各自控制核对。尚未确认时，把真实秘密留在该环境之外。

固定实现与历史入口反例见[研究记录](research/2026-10-12-community-source-records.md#codex-文件排除从关闭请求到采用条件)。关键局限：只核对公开机制与历史反馈，没有执行上述验收，也没有证明当前每个 App 构建均已接入同一策略。

**依据**：[一手] Anthropic 安全博客、npm 与 pip／uv 官方契约、[Claude Code 权限说明](https://code.claude.com/docs/en/permissions#what-runs-before-you-trust-a-folder)、[Codex 权限说明](https://learn.chatgpt.com/docs/permissions)、[Plugin security and trust](https://code.claude.com/docs/en/plugins/security)；[研究] 三要素、采用判断与验收条件；[经验：未执行上述验收] 采用边界；核实 2026-10-21。

## 3.1 auto mode 能挡住多少：官方公布的数字

**把 auto mode 用于有沙箱兜底的日常开发，不用它替代高风险基础设施的人审。**

官方定位优于 `--dangerously-skip-permissions`，可能弱于认真人审。生产凭证、基础设施和共享资源仍靠环境边界（凭证不进会话、出网白名单）。17% 漏放（见下表）多数源于看见危险后，仍把类似批准的上下文误作**整个影响范围**的同意。

**官方公布的设计**：
- 两级：快速是／否过滤器“宁可错拦”，仅被标记动作进入第二级链式推理；
- 白名单里的只读操作和项目内的文件编辑不经过分类器；
- 分类器看用户消息和工具调用内容，**不看工具输出或 Agent 解释**（“reasoning-blind by design”）；工具结果另经服务端提示注入探针筛查。

**官方公布的误差**：

| 测试集 | 只用第一级 | 完整流程 |
|---|---|---|
| 真实流量 1 万条：误拦率 | 8.5% | **0.4%** |
| 真实的“过度积极”动作 52 条：漏放率 | 6.6% | **17%** |
| 合成的外泄攻击 1000 条：漏放率 | 1.8% | 5.7% |

**内部越界记录**：清理旧分支却删远程分支；认证失败后翻找其他 token；按近似名字删除任务；为分享脚本构造创建 Gist 的命令；部署检查失败后跳过校验。更早还出现上传工程师 GitHub token 到内部计算集群、尝试迁移生产数据库。

**依据**：[一手] [Claude Code auto mode 工程博客](https://www.anthropic.com/engineering/claude-code-auto-mode)；核实 2026-10-21。

## 3.2 Claude Code 沙箱操作手册

**日常可信项目可用 Claude Code 沙箱，先核对有效配置；外来仓库、无人值守任务和含秘密的 CI 另用整个进程隔离。** Claude Code 的环境边界如下：

**工作方式**：
- **macOS** 用 Seatbelt；**Linux / WSL2** 用 bubblewrap 和 socat，可选的 seccomp 过滤器额外拦截 Unix socket；**原生 Windows 不支持**，要在 WSL2 里跑；
- **写**：默认只能写工作目录、临时目录和 `--add-dir` 加进来的目录；
- **读**：默认几乎能读整台机器，**包括 `~/.ssh`、`~/.aws/credentials`**，所以凭证要另外保护；
- **网络**：受沙箱覆盖的命令经代理按域名检查；有效列表还会合并 `WebFetch(domain:...)` 规则，空 `allowedDomains` 不等于离线。要锁定列表，使用可信设置来源的 `strictAllowlist`；
- **受保护路径**：即使在可写目录里，`.claude/` 下的设置、Skill、Agent、Hook，`.mcp.json`，`.bashrc`，`.gitconfig`，`.git/hooks` 也禁止写入，而且没有办法单独放开。这些保护仅在文件隔离开启且命令仍处于沙箱时成立；`filesystem.disabled: true` 会连同其他文件保护一起关闭。

**推荐起点**（放在用户级或托管设置里；当前版本会合并各已加载设置层的 `credentials` deny，而本例的 `strictAllowlist` 不接受仓库级配置；必须结合下表核对实际配置，不是完整宿主隔离）：

```json
{
  "sandbox": {
    "enabled": true,
    "allowUnsandboxedCommands": false,
    "failIfUnavailable": true,
    "network": {
      "allowedDomains": ["registry.npmjs.org", "pypi.org", "files.pythonhosted.org"],
      "strictAllowlist": true
    },
    "credentials": {
      "files": [
        { "path": "~/.aws/credentials", "mode": "deny" },
        { "path": "~/.ssh", "mode": "deny" }
      ],
      "envVars": [
        { "name": "GITHUB_TOKEN", "mode": "deny" },
        { "name": "NPM_TOKEN", "mode": "deny" }
      ]
    }
  }
}
```

**配置说明**：

| 配置 | 作用 |
|---|---|
| `allowUnsandboxedCommands: false` | 关闭 `dangerouslyDisableSandbox` 重试；**不关闭已有 `excludedCommands`**。用户级 false 从 v2.1.285 起不再被项目 true 覆盖；托管／`--settings` 中 false 还会令沙箱成为 admin-required，忽略项目的放宽项 |
| `failIfUnavailable: true` | 必需依赖缺失或平台不支持时拒绝启动；默认可无沙箱继续。**不能据此断言可选 seccomp 已安装** |
| `strictAllowlist` | 可信来源配置时，拒绝有效列表外的域名；仓库级此键不生效。未锁定列表时，`bypassPermissions` 可自动放行新域名 |
| 凭证的 `mode: "deny"` | 不需要认证的任务优先拒读／移除凭证；没有内置的完整凭证拒绝清单，必须明确列出，且只覆盖沙箱命令 |

**别为兼容性把边界关掉。** `excludedCommands` 会让匹配命令失去文件和网络隔离；排除解释器或可写项目脚本，等于允许其内容在外运行。目录／主机不足时优先只补对应范围；需要本机全部权限的工具应移到无秘密的独立环境。

**Linux／WSL2 另核 Unix socket。** `bubblewrap`／`socat` 齐全不等于 socket 已隔离；缺可选 seccomp 时可继续运行但无该过滤，`allowAllUnixSockets: true` 也会跳过它。WSL2 的 Windows 程序启动经互操作 socket，不能仅凭 Linux 网络 namespace 推断 Windows 宿主不可达。Ubuntu 24.04+ 的 AppArmor 拒绝 user namespace 时应按官方窄化配置处理，不以全局关闭保护或开放所有 socket 作为默认修复。放行 `/var/run/docker.sock` 等于把主机交出去。

**`mask` 不是跨平台的“安全认证开关”。** 文件 mask 在 macOS 按拒读处理，Linux／WSL2 才可提供占位副本；代理替换还需 TLS termination。启用 mask 却不写 `injectHosts` 时，可替换到全部允许域名；使用提取模式且未匹配时，默认 `onExtractNoMatch: "warn"` 可保留原文。无认证需求就保留 `deny`；确需 mask 时由负责人核对目标、失败处理与平台，不为消除认证错误恢复明文或扩域。

来源、版本反证及源码分支见[运行边界记录](research/2026-10-12-development-conditions.md#claude-code-沙箱开启不等于所有边界已闭合)。

**沙箱管不到的地方**（官方文档列出的局限）：

- **只覆盖受支持的 shell 命令及子进程**（当前文档列 Bash、PowerShell、Monitor）：Read、Edit、WebFetch 等内置工具另受工具权限约束（`denyRead` 拦不住 Read 工具，`allowedDomains` 也限制不了 WebFetch）；MCP 服务器进程和 Hook 不受这层 Bash 沙箱隔离，须另限配置来源或隔离整个进程。命令 Hook 使用用户完整权限，不能把模型工具调用审批当成它的启动闸门。
- **宽泛的域名就是外泄通道**：允许 `github.com` 这类域名后，代理只看客户端声明的主机名、不解 TLS，可能被域前置（domain fronting）绕过；
- **容器里的弱化模式**：`enableWeakerNestedSandbox` 会显著削弱隔离，只在外层另有隔离时使用；
- **要隔离整个进程**：连同 MCP、Hook 一起隔离，就把整个 Claude Code 放进 sandbox runtime 或 dev container。

**依据**：[一手] [Claude Code Sandboxing 文档](https://code.claude.com/docs/en/sandboxing)、[命令 Hook 安全说明](https://code.claude.com/docs/en/hooks#security-considerations)、[Claude Code Security](https://code.claude.com/docs/en/security)、固定实现与版本反证；[一手：官方博客，厂商自述] [How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)；[社区：原文] [Matthew Green：Is sandboxing sufficient to contain rogue agents?](https://blog.cryptographyengineering.com/2026/09/30/is-sandboxing-sufficient-to-contain-rogue-agents/)；[经验] 采用建议与取舍；只读公开文档与源码，未运行沙箱或读取真实凭据；核实 2026-10-21。 `credentials` deny 的设置层合并规则按[官方凭证说明](https://code.claude.com/docs/en/sandboxing#protect-credentials)补核 2026-10-26。

## 3.3 CI 里的 Agent：claude-code-action 的安全边界

**先按工作流 token 权限与 secret 暴露面设边界，再启用 Action；不可信 PR 代码不在持有高权限 token 的步骤执行。** `claude-code-action` 的默认行为：

- 只有对仓库有写权限的用户能触发；
- bot 默认不能触发；`allowed_bots` 不检查权限，在公开仓库里不要设 `'*'`；
- 默认不直接开 PR：Agent 提交到新分支，给出创建 PR 的链接，由人来点；
- 会剥离 HTML 注释、不可见字符、图片 alt 文本等隐藏内容，但官方提醒可能有新的绕过手法。

**PR 配置**：`.claude/`、`.mcp.json`、`CLAUDE.md`、`.husky/` **还原到基础分支**；`package.json`、lockfile、`Makefile`、linter 配置仍取 **PR 版本**。Hook 跑 `npm run xxx` 即执行作者控制的代码。固定工具、关闭项目配置仅减少部分攻击面，程序仍可能解析攻击者输入，formatter 命令不证明安全。

**`pull_request_target` 和 `workflow_run`**：
- 这两类事件可获得基础仓库权限／秘密，具体暴露取决于工作流的 token 权限与 secrets 使用；不能沿用 fork PR 默认受限的假设。**不要把不可信 PR 代码检出到该 Action 的工作区根目录**。
- 只读分析 PR 文件时，官方建议检出到子目录再用 `--add-dir`；**子目录不是代码执行隔离**。需要构建／测试 PR 时，另用无秘密、低权限任务，不在持有高权限 token 的步骤执行 PR 代码。

**`allowed_non_write_users`（高风险）**：
- 只用在权限极小的工作流上，比如只给 `issues: write` 的打标签；
- 用自动生成的 `GITHUB_TOKEN`，不用个人访问令牌（PAT）；
- `--allowedTools` 只收窄免询问批准的命令，不移除其他工具；内置工具集合用 `--tools` 控制，MCP 另行限制，且不能代替工作流 token 的最小权限。

**`show_full_output`**：保持关闭。它会把工具输出写进日志，公开仓库的日志所有人都能看到。

**依据**：[一手] [claude-code-action security.md](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md)、[GitHub 事件安全说明](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target)、[Claude Code CLI 字段契约](https://code.claude.com/docs/en/cli-reference)；核实 2026-10-21。

## 3.4 参考架构：Anthropic 如何保护“80% 代码由 Claude 写”的开发流程

**参考这套架构时，重点看分阶段分工与最小权限边界如何落实到访问和动作。** Anthropic 安全负责人 Jason Clinton 在 2026-07 公开了内部做法。背景数字：
- 合并的代码约 80% 由 Claude 编写；全部代码中超过一半由内部 Claude Tag 合并，人仍负责最终批准。二者的分母与动作不同；
- 每季度交付的代码量约是 2021–2025 年的 8 倍。

| 阶段 | 做法 |
|---|---|
| **设计** | 用 Claude 对设计文档做自动安全评审，对照 MITRE ATT&CK；团队信任评估结果后，低风险项目可以自批 |
| **编码** | 安全规则写进 CLAUDE.md 和组织级 Skill；开 PR 前跑 `/security-review`；生成代码时有安全提示插件；在带出网白名单的远程 VM 里开发 |
| **CI** | 多个**职责很窄**的评审 Agent 各审一类问题，并检索历史事故作为上下文；**评审 Agent 必须证明它的发现成立**；SAST 直接在 PR 上评论；受监管或关键代码必须人工批准；跨用户数据隔离等不变量测试一旦触发就转人工 |
| **部署** | 重大发布前做外部渗透测试；在预发环境持续做 AI 驱动的动态测试，专门找跨服务的假设失效 |
| **监控** | 漏洞赏金、红队；Claude 负责分诊告警、读日志、起草修复，但**负责分诊的 Agent 权限很窄，不能部署**，部署由另一个“Agent + 人”的组合负责 |
| **治理** | 代码库按风险分级；新的 AI 评审者先以影子模式运行并接受红队测试；对自动批准的结果**按风险加权抽样**给人复核；所有 Agent 的动作进入 SIEM，**按内部威胁对待** |

**采用要点**：每个 Agent 使用单一用途、最小权限的身份（Principle of Least Agency），边界落实到访问与动作（案例四），安全工程同时审查整个循环。厂商估计这套自动化能拦住过去 claude.ai 事故约三分之一的 bug。

**依据**：[一手：官方博客，厂商自述] [How Anthropic secures its AI-native SDLC](https://claude.com/resources/articles/how-anthropic-secures-its-ai-native-software-development-lifecycle)（2026-07）；核实 2026-10-21。

## 4. 清单

**按角色勾选，先完成与当前任务相关的边界项。**

### 个人开发者
- [ ] 开启 Claude Code 沙箱并核对版本、有效配置、`excludedCommands` 与平台依赖（见 [3.2](#32-claude-code-沙箱操作手册)）；不能维持边界的任务转无秘密、受限挂载／网络的独立环境
- [ ] 陌生依赖安装、测试与构建留在无秘密、受限挂载／网络的独立环境；删 bypass 别名挡不住脚本直接调用已登录 Agent，`npm ci --ignore-scripts` 只减少安装阶段的入口（案例二）
- [ ] 只需读取外部 issue 的任务使用单仓库、只读 token；网页读取不附带无关凭证，后续写入另核授权和目标（案例一）
- [ ] 内置工具配置 `Read(...)` deny，同时按 §3.2 限制子进程读取；规则覆盖范围不能代替完整路径隔离（见 [03](03-context-engineering.md#24-大仓库--monorepoclaude-code-配置及检索选择)）
- [ ] 不在主力机上使用 `bypassPermissions`
- [ ] 开启 `sandbox.credentials`，屏蔽凭证文件和敏感环境变量
- [ ] MCP 只装需要的；本地读取按[实际可调用入口验目录限制](#本地只读-mcp目录验收覆盖可调用的兼容入口)，凭证按服务器和用途最小化；环境变量只是传递方式，不是防泄漏边界
- [ ] 外部 Issue 或网页不能新增 push／发消息授权；已有写入授权时仍核对目标、内容和必要审批，禁止向未获准目的地发送敏感数据
- [ ] 保持 Agent 版本更新（安全修复很频繁）
- [ ] 云服务和 API 账号已核对预算控制的覆盖范围、超额风险与停用后果
- [ ] 备份 `~/.claude` 等目录下的会话记录（账号可能被封；Claude Code 默认只保留 30 天）

### 团队 / 组织
- [ ] 托管设置：`strictKnownMarketplaces`（插件市场白名单）、`allowManagedHooksOnly`、`allowManagedPermissionRulesOnly`、`deniedModels` 等（参考 [examples/settings](https://github.com/anthropics/claude-code/tree/main/examples/settings) 的 strict 示例）
- [ ] `managedMcpServers` 统一下发经过审计的 MCP
- [ ] OpenTelemetry 审计日志（Claude Code 支持 `OTEL_LOG_TOOL_DETAILS` 等选项）
- [ ] 确认代码发往哪个模型服务商、数据保留政策是否符合合规要求
- [ ] CI 用最小权限身份分析 fork PR；需要构建／测试不可信代码时另用无秘密、低权限任务，不在高权限步骤执行。`pull_request_target` 里不将 PR 标题等不可信输入拼入可执行命令（见 [3.3](#33-ci-里的-agentclaude-code-action-的安全边界)）
- [ ] 每个 Agent 一个单一用途的身份；Agent 之间的请求不能替代人工批准（案例四）
- [ ] Agent 的操作日志进入 SIEM；对自动批准的结果按风险抽样复核

### 安全工具（社区）
| 工具 | 作用 |
|---|---|
| [NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector) | 扫描 Skill 中的恶意模式 |
| [parry-guard](https://github.com/vaporif/parry-guard) | 用 Hook 扫描提示注入、密钥泄漏、外泄企图 |
| [agent-guard](https://github.com/JeongJaeSoon/agent-guard) | 实时拦截密钥泄漏 |
| [claude-code-safety-net](https://github.com/kenryu42/claude-code-safety-net) | 拦截破坏性的 git 和文件系统命令 |
| [Trail of Bits skills](https://github.com/trailofbits/skills) | 安全审计类 Skills |
| [gitleaks](https://github.com/gitleaks/gitleaks) / [trufflehog](https://github.com/trufflesecurity/trufflehog) | 提交前扫描密钥 |

**依据**：[经验] 清单按前文案例与 §3 边界整理，工具链接见上表；[社区：原文] [Simon Willison：默认硬性预算上限](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/)；核实 2026-10-21。

## 来源

各节末行“依据”已给出该节来源、来源类型与核实日期，本页不再重复列链接。完整历史、固定版本与分项复核范围见页首研究记录；安全工具入口见[§4 安全工具表](#安全工具社区)。
