# 10 · 安全

> 核实时间：2026-10-03。

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
| 学术研究 | MCP 生态攻击的大规模分析（arXiv 2509.06572）、MCP 服务器污点漏洞（VIPER-MCP）、开发者常见安全误区（MCP Pitfall Lab） | [研究：摘要] |

## 3. 防护原则

1. **环境边界优先于行为约束** **[一手]**：沙箱、容器、虚拟机、出网白名单这些确定性手段，比模型“自觉”和提示词防御可靠得多。在 Anthropic 的案例中，只有出网拦截挡住了凭证外泄。
2. **打破三要素中的至少一个**：
   - 处理不可信内容（外部 Issue、网页、日志）的会话，**不给密钥、不给出网能力**；
   - 需要密钥的会话，**不读不可信内容**。
3. **最小权限**：只读账号、受限 token、按项目隔离的凭证；凭证网关（如 [authsome](https://github.com/agentrhq/authsome)）让 Agent 自己永远看不到密钥。
4. **供应链**：MCP、Skill、插件安装前读内容，固定版本或 SHA（Claude Code 插件支持锁定到 commit），关注更新日志。
5. **成熟工具优先**：用虚拟机管理程序、seccomp、bubblewrap，而不是自研的拦截层 **[一手]**。

## 4. 清单

### 个人开发者
- [ ] 开启 Claude Code 沙箱（`/sandbox`）或在容器里运行放开权限的任务
- [ ] `permissions.deny` 加上 `Read(.env*)`、`Read(**/secrets/**)` 等规则
- [ ] 不在主力机上使用 `bypassPermissions`
- [ ] 开启 `sandbox.credentials`，屏蔽凭证文件和敏感环境变量
- [ ] MCP 只装需要的，token 用环境变量注入
- [ ] Agent 读外部 Issue 或网页之后，不让它自动 push 或发消息
- [ ] 保持 Agent 版本更新（安全修复很频繁）

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
- [Plugin security and trust](https://code.claude.com/docs/en/plugins/security)
- [gemini-cli changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs)
- [CSA：Agentjacking](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/)、[Checkmarx：MCP Security Incidents](https://checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/)、[The lethal trifecta（Arcjet 解读）](https://arcjet.com/learn/lethal-trifecta)（二手）
