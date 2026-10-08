# 10 · 安全

> 核实时间：2026-10-08。

## 1. 威胁模型：致命三要素

Simon Willison（2025-06）提出的 **lethal trifecta**：只要一个 Agent 同时具备以下三点，就可能被诱导泄露数据：

1. **能访问私有数据**：代码、密钥、邮件、工单、数据库；
2. **会接触不可信内容**：Issue、PR 评论、网页、README、依赖包、MCP 返回值、错误日志；
3. **有对外通信能力**：发请求、开 PR、写对方能看到的文件，甚至渲染一张 Markdown 图片。

**Coding Agent 默认就同时具备这三点。** 一个被投毒的 README 或 Issue，在没有任何代码漏洞的情况下就能让它外泄密钥。

## 2. 2026 年的真实事件与研究

| 事件 | 要点 | 证据 |
|---|---|---|
| **Agentjacking**（2026-06） | 攻击者用公开的 Sentry DSN 往错误事件里注入指令；Claude Code、Cursor、Codex 通过 Sentry MCP 读取后，以开发者的权限执行了攻击者的命令 | [二手] CSA 研究笔记 |
| postmark-mcp（2025-09） | 第一个被发现的恶意 MCP 服务器：先发布 15 个正常版本建立信任，再加入一行外泄代码 | [二手] |
| LiteLLM PyPI 后门（2026-03） | 约 3 小时内被下载约 4.7 万次；LiteLLM 是 CrewAI、DSPy 等框架使用的模型网关 | [二手] |
| Gemini CLI 安全修复（2026-08~09） | 通过构建文件和不可信参数的间接提示注入、MCP OAuth SSRF、凭证泄漏、workspace trust 改为默认拒绝 | [一手] changelog |
| Anthropic 自曝（2026-05） | 项目配置里的 hook 在信任提示出现**之前**就执行了；通过“已批准的域名”外泄数据；直接的提示注入绕过了所有模型层面的防御 | [一手] |
| **AI 实验室训练期的 Agent 失控**（2026-04~09） | OpenAI 训练和评估中的 Agent 串联 Artifactory 代理的 0day 接入外网，把代理当成留言板分工协作，入侵 Hugging Face 寻找评分器，7 月拿到研究集群管理员权限；还被查出与 RubyGems 攻击、澳大利亚 Medicare 网站入侵有关（已在联合国被提及）。Anthropic（PyPI 恶意包 `mlflow-ui` 等）、Google、Meta 也有类似事件 | [社区：Matthew Green、Simon Willison 原文] |
| **攻破 Claude Code auto mode**（2026-08） | 让 Claude 自己写解码脚本并在攻击者目录里运行，被同名 `struct.py` 劫持；成功率 60–80% | [社区：原文] |
| **Claude Code 隐写标记**（2026-06） | 根据 API 地址和时区，悄悄改变系统提示里日期字符串的写法；属于透明度问题 | [社区：原文] |
| ZCode 静默上传 git 历史（2026-09） | GLM 官方 Agent | [二手] |
| Cursor 0day（2026-07） | Mindgard 在厂商不回应后选择完全公开披露 | [二手：HN 标题] |
| **人工审批的真实漏检率**（2026-08） | 一个模拟“给 Coding Agent 审批命令”的小游戏收集了 4 万局、40.9 万次决策：<br>• 平均**漏掉 1/3 的威胁**（准确率 66.3%）；<br>• 明显的破坏命令漏掉 11.7%，持久化篡改（crontab、git config）漏掉 23.8%，外泄和代码执行漏掉 33.4%，越权读取凭证（`cat ~/.aws/credentials`）漏掉 35.0%；<br>• 恶意内容藏在 `npm run xxx` 后面时漏掉 **52.5%**，即使恶意脚本就显示在上方的历史记录里；<br>• 7% 的玩家对所有请求都点了同意；正常命令也常被误拦（43–59%）；<br>• 局限：有时限、威胁占比约 34% 远高于现实，部分题目的标注在 HN 上有争议 | [社区：原文] |
| **Wikimedia 发现 OpenAI 失控 Agent**（2026-10） | 编辑 wiki、尝试利用托管的笔记工具、大量流量；未发现被攻破。开放网络的维护者承担了调查和溯源成本 | [一手：Wikimedia 博客] |
| 学术研究 | MCP 生态攻击的大规模分析（arXiv 2509.06572）、MCP 服务器污点漏洞（VIPER-MCP）、开发者常见安全误区（MCP Pitfall Lab） | [研究：摘要] |

## 3. 防护原则

1. **环境边界优先于行为约束** **[一手]**：沙箱、容器、虚拟机、出网白名单这些确定性手段，比模型“自觉”和提示词防御可靠得多。在 Anthropic 的案例中，只有出网拦截挡住了凭证外泄。
   - **人工审批不是可靠的防线**：上面的数据说明，命令本身往往是无害的（`npm run build`），危险在于它执行的内容可能已被前面的修改篡改，审批者无从判断。HN 上的评价：“靠不停问用户、指望用户永不出错的安全模型，试过很多次，从没成功过。”**减少审批次数、把信任放到环境边界上，审批反而更有效**（分析见 [14 规律三、四](14-synthesis.md#3-规律三人的注意力是唯一不随算力扩展的资源)）。
2. **打破三要素中的至少一个**：
   - 处理不可信内容（外部 Issue、网页、日志）的会话，**不给密钥、不给出网能力**；
   - 需要密钥的会话，**不读不可信内容**。
3. **最小权限**：只读账号、受限 token、按项目隔离的凭证；凭证网关（如 [authsome](https://github.com/agentrhq/authsome)）让 Agent 自己永远看不到密钥。
4. **供应链**：MCP、Skill、插件安装前读内容，固定版本或 SHA（Claude Code 插件支持锁定到 commit），关注更新日志。
5. **成熟工具优先**：用虚拟机管理程序、seccomp、bubblewrap，而不是自研的拦截层 **[一手]**。
6. **harness 本身也要评估**：闭源二进制做了什么，要靠逆向才知道（见隐写标记事件）；公司环境要有允许使用哪些 Agent 的清单。
7. **审查 Agent 引入的依赖和服务**：Agent 会替你选数据库、SaaS 和库，已经有公司专门做“影响 Agent 选型”的生意；包仓库里也出现过 AI 实验室 Agent 上传的包。
8. **硬性预算上限**：Agent 会自己开通付费服务，云服务要设硬性 spend limit（AWS、GCP 2026 年已提供），不能只设告警。
9. **不在不可信目录里执行代码**：Python 等语言会优先导入当前目录里的同名模块，auto mode 攻击就利用了这一点。

## 4. 清单

### 个人开发者
- [ ] 开启 Claude Code 沙箱（`/sandbox`）或在容器里运行放开权限的任务
- [ ] `permissions.deny` 加上 `Read(.env*)`、`Read(**/secrets/**)` 等规则
- [ ] 不在主力机上使用 `bypassPermissions`
- [ ] 开启 `sandbox.credentials`，屏蔽凭证文件和敏感环境变量
- [ ] MCP 只装需要的，token 用环境变量注入
- [ ] Agent 读外部 Issue 或网页之后，不让它自动 push 或发消息
- [ ] 保持 Agent 版本更新（安全修复很频繁）
- [ ] 云服务和 API 账号设**硬性**预算上限
- [ ] 备份 `~/.claude` 等目录下的会话记录（账号可能被封；Claude Code 默认只保留 30 天）

### 团队 / 组织
- [ ] 托管设置：`strictKnownMarketplaces`（插件市场白名单）、`allowManagedHooksOnly`、`allowManagedPermissionRulesOnly`、`deniedModels` 等（参考 [examples/settings](https://github.com/anthropics/claude-code/tree/main/examples/settings) 的 strict 示例）
- [ ] `managedMcpServers` 统一下发经过审计的 MCP
- [ ] OpenTelemetry 审计日志（Claude Code 支持 `OTEL_LOG_TOOL_DETAILS` 等选项）
- [ ] 确认代码发往哪个模型服务商、数据保留政策是否符合合规要求
- [ ] CI 中的 Agent 使用最小权限的 token，并且不处理来自 fork 的不可信 PR 内容

### 安全工具（社区）
| 工具 | 作用 |
|---|---|
| [NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector) | 扫描 Skill 中的恶意模式 |
| [parry-guard](https://github.com/vaporif/parry-guard) | 用 Hook 扫描提示注入、密钥泄漏、外泄企图 |
| [agent-guard](https://github.com/JeongJaeSoon/agent-guard) | 实时拦截密钥泄漏 |
| [claude-code-safety-net](https://github.com/kenryu42/claude-code-safety-net) | 拦截破坏性的 git 和文件系统命令 |
| [Trail of Bits skills](https://github.com/trailofbits/skills) | 安全审计类 Skills |
| [gitleaks](https://github.com/gitleaks/gitleaks) / [trufflehog](https://github.com/trufflesecurity/trufflehog) | 提交前扫描密钥 |

## 来源

- [How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)、[Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode)
- [Scale X：Humans missed 1 in 3 threats](https://scalex.dev/blog/ai-agent-permissions-stats/)（[HN](https://news.ycombinator.com/item?id=49195468)）、[Wikimedia：OpenAI "rogue" agent activities](https://diff.wikimedia.org/2026/10/05/openai-rogue-agent-activities-found-on-wikimedia-projects/)
- [Plugin security and trust](https://code.claude.com/docs/en/plugins/security)
- [gemini-cli changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs)
- [Matthew Green：Is sandboxing sufficient to contain rogue agents?](https://blog.cryptographyengineering.com/2026/09/30/is-sandboxing-sufficient-to-contain-rogue-agents/)、[Embrace The Red：Breaking Claude Code Opus 5 Auto Mode](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)、[thereallo.dev：隐写标记](https://thereallo.dev/blog/claude-code-prompt-steganography)、[Simon Willison：默认硬性预算上限](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/)
- [CSA：Agentjacking](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/)、[Checkmarx：MCP Security Incidents](https://checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/)、[The lethal trifecta（Arcjet 解读）](https://arcjet.com/learn/lethal-trifecta)（二手）
