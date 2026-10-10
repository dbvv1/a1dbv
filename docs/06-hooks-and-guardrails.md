# 06 · Hooks、权限与护栏

> 核实时间：2026-10-08；第 2 节失败与 Stop 边界于 2026-10-11（UTC+8）复核，其余未重验。依据 Claude Code 官方 Hooks 文档、changelog 和 Anthropic 工程博客 **[一手]**。

## 1. 为什么需要 Hooks

CLAUDE.md 里的指令可能被模型忽略；命令型 Hook 能把某个事件的检查交给程序，但**只有事件被触发、匹配正确、处理器成功运行且返回值被运行时执行时**才有相应效果。Hook 超时、解析失败、工具匹配遗漏和另一条写入路径都可能使保护失效；prompt / agent 型 Hook 也包含模型判断。
原则：把可机械检查的流程放入 Hook，同时测试失败路径；访问控制仍依靠沙箱、文件权限和出网约束。不要把“配置了 Hook”写成“所有路径都已强制保护”。**[经验：本仓库模板静态审计，2026-10-11]**

本仓库的 `protect-paths.sh` 是**编辑工具的辅助拦截示例**：仅注册 Edit / Write / MultiEdit / NotebookEdit，不拦截任意 Bash 写入；它当前不解析真实路径或符号链接，缺失规则、无法提取路径等情况会退出放行。因此不能用来承诺密钥隔离、只读目录或恶意输入下的安全边界。使用前应为目标运行时补测试；不要靠扩写提示词补足操作系统权限。**[一手：仓库脚本与 settings.json；不是完整安全审计]**

## 2. Claude Code Hooks 速查

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
- **常用事件**：`SessionStart`、`UserPromptSubmit`、`PreToolUse`、`PostToolUse`、`PostToolUseFailure`、`PermissionRequest`、`PermissionDenied`、`Stop`、`SubagentStop`、`PreCompact`、`Notification`、`FileChanged`、`CwdChanged`、`WorktreeCreate`/`Remove`、`InstructionsLoaded`、`ConfigChange`、`PreModelSwitch`、`TeammateIdle`、`TaskCompleted` 等。

### 返回值
| 退出码 | 含义 |
|---|---|
| 0 | 成功；如果 stdout 是 JSON，就按结构化结果处理 |
| 2 | **阻止**（适用于 PreToolUse、UserPromptSubmit、Stop 等可以阻止的事件），stderr 作为原因反馈给 Claude |
| 其他 | 默认通常为非阻塞错误；有效 JSON、事件特例与 `onFailure` 会改变处理 |

**失败策略与版本边界（2026-10-11）[一手：当前文档，未做运行时实测]**：[官方 `onFailure` 文档](https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails)规定，`command` / `http` Hook 默认 `"continue"`；`"block"` 需 **v2.1.295+**，可将无法启动、异常退出、超时或无效输出等失败按事件的阻止语义处理（`PermissionRequest` 为拒绝）。它**不适用于 Stop、SubagentStop、TaskCompleted、TeammateIdle，也不适用于 async / asyncRewake**。不要把此字段套到 [19](19-experiments.md) 的 v2.1.294 历史实验，或未经目标运行时测试就改配置。

[Stop 的限制](https://code.claude.com/docs/en/hooks#stop)：用户中断不触发它；API 错误触发 `StopFailure`；默认连续继续 8 次后会覆盖下一次阻止而结束，工具调用会重置计数。此外，[退出码文档](https://code.claude.com/docs/en/hooks#exit-code-output)指出，Stop / SubagentStop / TaskCompleted（以及插件 UserPromptSubmit）若退出 2、stdout 为空且 stderr 表示缺文件，会按非阻塞错误处理。必须分别测试正常失败、缺文件、超时与事件覆盖，不能由“装了 Hook”推断必定完成。

PreToolUse 的结构化决定：
```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"..."}}
```
`permissionDecision` 可以取 `allow` / `deny` / `ask` / `defer`。PostToolUse 可以返回 `additionalContext`，用来提醒 Claude（例如“这是生成文件，请改源文件”）。

### 高价值的 Hook 场景
| 场景 | 事件 | 说明 |
|---|---|---|
| 保护目录或文件（生成物、密钥、第三方代码） | PreToolUse（Edit/Write） | 本仓库模板：[`protect-paths.sh`](../templates/generic/.claude/hooks/protect-paths.sh) |
| 编辑后自动格式化或 lint | PostToolUse | 跑完把问题通过 `additionalContext` 反馈给 Claude |
| **完成前程序化检查** | Stop | 正常触发且按协议返回时可要求继续；失败策略、事件覆盖与连续阻止上限见上文 |
| 危险命令拦截 | PreToolUse（Bash） | 例如 `rm -rf`、强推；社区有 [claude-code-safety-net](https://github.com/kenryu42/claude-code-safety-net)、[Dippy](https://github.com/ldayton/Dippy)（用 AST 解析判断 bash 命令是否安全） |
| 提示注入扫描 | PostToolUse | [parry-guard](https://github.com/vaporif/parry-guard) 检查工具输出 |
| 强制 TDD | PreToolUse | [tdd-guard](https://github.com/nizos/tdd-guard) |
| 桌面通知 | Notification | Agent 需要输入时提醒你 |
| 非 git 版本控制（Perforce 等） | WorktreeCreate / PreToolUse | 例如编辑前自动 `p4 edit` |

**把纠错变成 Hook**：官方插件 `hookify` 可以分析对话，自动生成“防止再犯”的 Hook。

## 3. 权限模式

| 模式 | 说明 | 适用 |
|---|---|---|
| Manual / default | 写文件、执行命令、调用 MCP 都要确认 | 敏感操作、刚开始用时 |
| acceptEdits | 编辑自动通过，命令仍需确认 | 日常开发 |
| plan | 只读，只出方案 | 探索、设计 |
| **auto** | 分类器代替人审批（v2.1.283 起交互会话默认） | 想减少打断，又不想完全放开 |
| dontAsk / bypassPermissions | 不再询问或完全放开 | **只在容器、虚拟机等隔离环境里用** |

权限规则写在 `.claude/settings.json` 中（`allow` / `ask` / `deny`）；支持按参数匹配，例如 `Agent(model:opus)`。

⚠️ v2.1.246 提醒：`Bash(git * main)` 这类**通配符写在子命令前面**的 allow 规则，会把插在子命令前的选项也匹配进去，存在被绕过的风险 **[一手]**。

## 4. Auto mode：实测数据

Anthropic《Claude Code auto mode》（2026-03-25）**[一手]**：

**架构**
- 输入层：一个提示注入探测器先检查工具输出；
- 输出层：一个**只看用户消息和工具调用**的分类器做审批。它看不到 Claude 的解释和工具输出，所以既不会被 Agent“说服”，也不会被注入内容影响；
- 分两级：先用快速的单 token 判断，只有可疑时才启用思维链推理。

**默认拦截约 20 条规则**：不可逆的破坏（强推、大量删除）、降低安全性（关日志、装持久化后门）、越过信任边界（运行不可信代码、扫描凭证）、绕过共享基础设施（直接部署生产）。

| 数据集 | 第一级误拦率 | 最终误拦率 | 漏放率 |
|---|---|---|---|
| 真实流量（1 万个动作） | 8.5% | **0.4%** | — |
| 真实的“过度执行”动作（52 个） | — | — | **17%** |
| 合成的数据外泄（1000 个） | — | — | 5.7% |

- 被拦后 Agent 会换更安全的做法重试；连续 3 次或累计 20 次被拦，就转交人工。
- **定位**：用来替代 `--dangerously-skip-permissions`，**不适合高风险基础设施**，也不能代替环境隔离。17% 的漏放率意味着它只是一层防护，不是全部。

**第三方实测：auto mode 可以被绕过** **[社区：原文]**
- Embrace The Red（2026-08-31）构造了一条攻击链：让 Claude 在“总结网页”时从 WebFetch 改用 curl，下载一个 ZIP，Claude 拒绝执行里面的二进制文件，却**自己写了 Python 解码脚本，并在攻击者解压的目录里运行**，结果被同名的 `struct.py` 劫持。
- 小样本成功率 60–80%，而 Anthropic 委托的第三方测评是 0%。
- Lobsters 上有人指出，这更像“不安全的执行方式”而不是意图被劫持，但结论一致：**auto mode 不能代替隔离环境和监控。**

**人工审批也不可靠**：4 万局模拟数据显示，人工逐条审批平均漏掉 1/3 的威胁，藏在 `npm run` 后面的恶意脚本漏掉一半以上（见 [10](10-security.md#2-2026-年的真实事件与研究)）。所以无论用 auto mode 还是人工审批，**都要配合沙箱和出网限制**。
- 防范：不让 Agent 在下载来的目录里执行代码（Python 会优先导入当前目录里的同名模块）；处理不可信内容的会话不给执行权限。

**Codex 的对应机制：Auto-review** **[一手]**：`approvals_reviewer = "auto_review"`（CLI 用 `--approve-for-me`）。只有需要越过沙箱边界时，才由独立的审查 Agent 代替人做决定，**它不会扩大权限**。审查策略开源在 `codex-rs/core/src/guardian/policy.md`，可以定制。

## 5. 沙箱

| 层级 | 做法 | 适用 |
|---|---|---|
| OS 级沙箱 | Claude Code：macOS Seatbelt / Linux bubblewrap，`/sandbox` 开启；可设网络严格白名单、屏蔽凭证文件 | 本机日常 |
| OS 级沙箱（Copilot） | GitHub Copilot 本地沙箱 2026-10-07 正式可用：基于微软 MXC，在三大系统上限制文件、网络、Git 和 GitHub CLI 凭证；**企业托管设置可以强制开启且开发者无法放宽** **[一手]** | 用 Copilot 的团队 |
| 容器 | devcontainer、[container-use](https://github.com/dagger/container-use)（每个 Agent 一个容器）、[aicontainer](https://github.com/stefanoginella/aicontainer) | 放开权限的自动任务 |
| 微虚拟机 / 虚拟机 | [brood-box](https://github.com/stacklok/brood-box)、Lima、Incus | 不可信代码、高风险任务 |
| 云端临时环境 | Claude Code on the web、Codex Cloud | 无需本地环境的任务 |

Anthropic《How we contain Claude》（2026-05）的结论 **[一手]**：
1. **环境边界胜过行为约束**：一次诱导外泄 AWS 凭证的攻击，最后只有出网拦截挡住了；
2. 按用户专业程度选择隔离方式（开发者能看懂 bash 命令，普通知识工作者看不懂）；
3. **成熟工具胜过自研组件**：虚拟机管理程序和系统调用过滤很可靠，Anthropic 自研的代理反而出过漏洞；
4. 真实事件：项目配置里的 hook 在信任提示出现**之前**就执行了；通过“已批准的域名”外泄数据（上传到攻击者在合法服务上的账号）。

## 来源

- [Hooks 参考](https://code.claude.com/docs/en/hooks)、[Hooks 指南](https://code.claude.com/docs/en/hooks-guide)
- [Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode)、[How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)、[Claude Code sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [anthropics/claude-code examples/settings](https://github.com/anthropics/claude-code/tree/main/examples/settings)（lax / strict / bash-sandbox 三套示例）
