# 06 · Hooks、权限与护栏

> 核实时间：2026-10-05。依据 Claude Code 官方 Hooks 文档、changelog 和 Anthropic 工程博客 **[一手]**。

## 1. 为什么需要 Hooks

CLAUDE.md 里的指令是**建议**，模型可能忽略；Hook 是**确定性**的，每次都执行。
原则：**“必须每次都发生”的事写成 Hook**，比如编辑后格式化、禁止改某个目录、提交前跑检查。

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
| 其他 | 非阻塞错误，照常执行 |

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
| **完成前强制验证** | Stop | 测试没过就阻止结束（官方推荐的确定性做法；注意连续阻止有上限） |
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
- 防范：不让 Agent 在下载来的目录里执行代码（Python 会优先导入当前目录里的同名模块）；处理不可信内容的会话不给执行权限。

**Codex 的对应机制：Auto-review** **[一手]**：`approvals_reviewer = "auto_review"`（CLI 用 `--approve-for-me`）。只有需要越过沙箱边界时，才由独立的审查 Agent 代替人做决定，**它不会扩大权限**。审查策略开源在 `codex-rs/core/src/guardian/policy.md`，可以定制。

## 5. 沙箱

| 层级 | 做法 | 适用 |
|---|---|---|
| OS 级沙箱 | Claude Code：macOS Seatbelt / Linux bubblewrap，`/sandbox` 开启；可设网络严格白名单、屏蔽凭证文件 | 本机日常 |
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
