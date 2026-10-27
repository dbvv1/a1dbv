# 权限、沙箱与 Hooks 怎么配

**🟡 日常开发采用「工作区内自主编辑和测试，越界动作另审」；沙箱限制能碰什么，权限决定何时确认，Hook 只补及时反馈。** 先用工具原生能力和项目已有检查，遇到具体缺口再加一条规则，通常比一开始装满安全插件更好维护。 工作区可写也包含删除：先用可恢复的工作副本，不可替代的数据留在可写根之外。

## 第一步：把任务分成两类

| 可以连续完成的工作 | 需要单独确定的范围 |
|---|---|
| 已授权项目中的编辑、编译、测试、可恢复的工作区改动 | 写到哪些目录、使用哪些依赖源 |
| 研究、读取公开文档、安装任务需要的可信依赖 | 允许联系哪些服务、发送什么数据 |
| 提交或推送到明确获准的仓库和分支 | 生产发布、凭据与账号改动、不可恢复删除及其他尚未授权的动作 |

**常规工作一次说清范围即可，不必逐条追问。** 已有授权与平台确认分别处理：平台或组织要求确认的步骤仍走它的入口；被拒绝时只停该动作，报告具体目标、原因、已完成部分与恢复条件。结果不确定先查状态，避免把重试变成重复提交或重复发布。

**装依赖失败先读原始错误，别直接扩大权限。** 例如 pnpm 的 `ERR_PNPM_NO_MATURE_MATCHING_VERSION` 是发布冷却期约束：核包管理器版本与有效配置，选满足现有策略的版本或等待；确需例外按项目约定批准，并审查配置与锁文件差量。保留既有年龄和锁文件校验，不用删除锁文件或全局关门禁来掩盖原因。

**pnpm 12.15.0 要区分显式策略与内建默认。** 显式设置 `minimumReleaseAge` 时 strict 默认开启，内建 1440 分钟则默认非 strict；有效 `minimumReleaseAgeStrict:false` 下的新解析可能回退到新版本，并将例外写进 `minimumReleaseAgeExclude`。已有锁文件也可重新受策略检查，fresh install 成功后仍核项目的 frozen CI；这套版本契约不能直接套给其他包管理器。

**依据**：[固定默认值实现](https://github.com/pnpm/pnpm/blob/91774e72a04d52ce61db06339696a433d383c764/pnpm/crates/config/src/registry_options.rs#L194-L223)、[例外处理](https://github.com/pnpm/pnpm/blob/91774e72a04d52ce61db06339696a433d383c764/pnpm/crates/package-manager/src/minimum_release_age.rs)、[锁文件策略](https://pnpm.io/settings/dependency-resolution#trustlockfile)、[Sanity 的实际 Agent 约定](https://github.com/sanity-io/sanity/blob/a19012b7e77ee33888c3b5072e8486dc5997f367/AGENTS.md#L1286)、[用户报告及历史修复 #14409](https://github.com/pnpm/pnpm/issues/14409)；核实 2026-10-27，本仓尚无对应升级任务，未实跑此策略。

## Codex：先用工作区写入，按需申请越界

**可信仓库的起点是 `workspace-write` + `on-request`。** 合并到个人 `~/.codex/config.toml`；工作区内允许的命令可直接运行，越界申请仍有审核入口。

```toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = false
```

这是官方常用组合的显式写法；也可单次用 `codex --sandbox workspace-write --ask-for-approval on-request`。需要联网装依赖时，为所需动作申请访问，或在环境准备阶段先安装。读代码而不改文件时将沙箱改为 `read-only`。

**默认仍可读取工作区外的许多文件；有秘密拒读或域名白名单需求，再选 Beta permission profiles。** 它与上面的旧式沙箱配置二选一；已加载的 `sandbox_mode` 或 `--sandbox` 会使普通配置转用旧机制。域名策略还要启用 `features.network_proxy`，仅填写 domains 不会过滤直连。具体配置见官方 [Permissions](https://learn.chatgpt.com/docs/permissions)。

**想减少越界审批，先看 Auto-review 是否适用。** `approvals_reviewer = "auto_review"` 把适用的请求交给独立审核者；`approval_policy = "never"` 则是不再提问，超出边界的动作可能失败。日常开发优先保留沙箱，不用 Full Access 来修复反复询问。

**依据**：[一手] [Codex 审批与安全](https://learn.chatgpt.com/docs/agent-approvals-security)、[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)；[本地] Codex CLI 0.163.0 的 `--help` 已核对上述启动参数；配置未部署。核实 2026-10-26。

## Claude Code：编辑自动通过，命令留在沙箱

**可信项目可从 `acceptEdits` 加沙箱 auto-allow 开始。** 以下是按官方沙箱示例改编的个人起点：合并到 `~/.claude/settings.json`；团队强制边界由管理员放到 managed settings。

```json
{
  "permissions": {
    "defaultMode": "acceptEdits"
  },
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "allowUnsandboxedCommands": false,
    "failIfUnavailable": true
  }
}
```

编辑与被沙箱容纳的常规命令可连续执行；缺必需沙箱依赖时退出，命令也不能通过 unsandboxed retry 离开边界。**先检查已有 `excludedCommands`**：它们另行决定哪些命令直接在沙箱外运行，新增上面四项不会清空它们。

- **开始前**：用 `/status` 看加载来源、`claude doctor` 看被拒绝的配置，再到 `/sandbox` 的 Config 页核有效设置；`/status` 只列来源，不逐键显示生效值。
- **需要访问新服务**：按实际用途批准目标域名。要锁定列表，在用户级或托管配置设 `sandbox.network.strictAllowlist`；文件工具与 WebFetch 另受工具权限约束。
- **环境里有秘密**：默认命令可读取多数宿主文件，也继承环境变量；同时限制文件工具读取与命令子进程的凭证。`sandbox.credentials` 的 deny 当前可由各设置层收窄；默认没有完整凭证清单。需要把 Hook、MCP 一并限制时，改用整个 Agent 的容器／虚拟机边界。

**依据**：[一手] [权限模式](https://code.claude.com/docs/en/permission-modes)、[沙箱与凭证](https://code.claude.com/docs/en/sandboxing)、[设置来源](https://code.claude.com/docs/en/settings)；[开源示例] [Anthropic 仓库 settings](https://github.com/anthropics/claude-code/tree/main/examples/settings)（仓库注明为社区维护示例）；本段配置未部署、未试用。核实 2026-10-26。

## Hooks：先补一种反复出现的漏项

**✅ 已有测试、格式化和 CI 能覆盖，就继续用原入口；🧪 只有编辑期反馈确实有用时才加窄 Hook。**

| 你要解决的问题 | 选择与直接入口 |
|---|---|
| 编辑后立即获得格式化／lint 反馈 | `PostToolUse` 调用项目已有入口；先试一项，观察是否减少返工 |
| 经常误改生成文件 | 参考本仓 [Claude 配置](../../templates/generic/.claude/settings.json)与[路径 Hook](../../templates/generic/.claude/hooks/protect-paths.sh)，只复制需要的部分；它覆盖编辑工具，不覆盖 Bash 写入或符号链接 |
| 执行前必须阻止某一动作 | 优先原生权限；必要的同步 `PreToolUse` Hook 分别验正常输入、拒绝、缺脚本与超时，需故障阻止时核 `onFailure: "block"` 的版本要求 |
| 完成前总忘记测试 | 先把真实验证入口写进项目约定；确有漏检再试 `Stop`，不要每轮重跑整套检查 |

**只拒绝当前工具调用时，命令型 `PreToolUse` Hook 返回 `hookSpecificOutput.permissionDecision: "deny"`，并把 `hookEventName` 设为 `PreToolUse`；顶层 `continue: false` 会停止整个会话。** 本仓路径 Hook 已采用前者。自定义 Hook 拦下一次编辑后整轮停住时，先核这两个字段；接收时既看目标调用被拒，也看独立的后续任务能否继续。`PostToolUse` 用于已执行后的反馈，阻止写入应放在执行前。

**依据**：[官方输出契约](https://code.claude.com/docs/en/hooks#json-output)、[PreToolUse 决策](https://code.claude.com/docs/en/hooks#pretooluse-decision-control)；[真实撤换 agent-flow #10](https://github.com/josix/agent-flow/pull/10)与[固定修改](https://github.com/josix/agent-flow/commit/7f8b23ee0a1b2c248a4ab91ae1fd5dc27d9715c6)。维护者因整轮停顿改成单次拒绝，并移除执行后的重复路径拦截；本次核源码与官方契约，未复跑客户端，核实 2026-10-27。

**PostHog 把确定性检查留给仓库工具，Claude Hook 只做环境引导。** 它的实际 `AGENTS.md` 按 linters＋CI → lint-staged／husky → Skills → 指令的顺序选择自动化，因延迟和脆弱性不添加逐工具 Hook。下面摘取其 `SessionStart` 中的一项：

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/setup-flox.sh",
        "timeout": 60
      }]
    }]
  }
}
```

这个脚本把已有 Flox 环境写入后续 Bash 的环境文件；缺少 Flox、`CLAUDE_ENV_FILE` 或运行在 Claude Web 时跳过。**会话反复缺运行环境时，才借这个形状接本项目已有的环境脚本；检查命令已经能跑就保持原配置。** 在项目 `.claude/settings.json` 合并已有 `hooks` 并替换脚本路径，保留权限与安全 Hook；新开该项目会话后，运行原先缺环境的命令验收。这里展示上游的环境准备，不要求安装 Flox。

环境脚本需把后续 Bash 所需的 `export` 语句追加到 `$CLAUDE_ENV_FILE`；只在 Hook 子进程里激活环境，退出后不会传给后续命令。

**依据**：[一手／实际配置] PostHog 固定 [AGENTS 优先次序 L282–293](https://github.com/PostHog/posthog/blob/d141be2ccf9b2c49251570db47022e0230204064/AGENTS.md#L282-L293)、[SessionStart 配置 L3–21](https://github.com/PostHog/posthog/blob/d141be2ccf9b2c49251570db47022e0230204064/.claude/settings.json#L3-L21)、[环境脚本 L1–16、L51–66](https://github.com/PostHog/posthog/blob/d141be2ccf9b2c49251570db47022e0230204064/.claude/hooks/setup-flox.sh#L1-L66)；核实 2026-10-27，未运行上游脚本或客户端。

本仓路径 Hook 已有[合成输入回归](../19-experiments.md#10-e6路径-hook-的确定性回归)（原核实 2026-10-11，非真实客户端验收）；覆盖、失败语义与 Claude → Codex 迁移差异见 [06](../06-hooks-and-guardrails.md)，不能只改目录便搬到 Codex。官方 [`onFailure: "block"`](https://code.claude.com/docs/en/hooks) 需 v2.1.295+，不适用于 Stop 或后台 Hook，核实 2026-10-26。

## 何时换一种做法

- **陌生仓库、无人值守任务、带真实数据的 CI**：先选不含无关秘密、受限挂载与网络的独立环境；审过配置来源后再运行代码。上面的本机起点适合可信工作副本。
- **原生 Windows 上用 Claude Code**：改用 WSL2 或合适的隔离环境；该 Bash 沙箱不支持原生 Windows。Codex 则按自己的 Windows 后端配置。
- **仍然频繁询问**：先区分“Agent 在聊天里问能否继续”和“平台工具审批”，再查有效配置与具体失败原因。中文社区已有开启“帮我审批”仍频繁停顿的反馈，不能仅凭开关名判断原因。
- **考虑审批插件**：Dippy 的用途是自动批准其判为安全的命令，方向是减少询问；CC-Monitor 作者则明确当前主要是拦截和告警。两者都不能替代环境隔离，现阶段不作为本页默认安装项。

**依据**：[一手／社区原文] [V2EX 审批反馈与回复](https://v2ex.com/t/1249304)、[Dippy 作者说明](https://github.com/ldayton/Dippy)、[CC-Monitor 作者说明](https://v2ex.com/t/1241604)；插件未试用，作者自报效果不作为提速结论。核实 2026-10-26。完整边界与案例见 [10 安全](../10-security.md)。
