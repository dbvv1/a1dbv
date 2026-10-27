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

**可借用的是窄反馈，不是更多关卡。** Ramp 的 OCA 团队撤回了「先证明遵守指定 Skill 才能报告」的严格检查，改成有限纠偏，生产写入与人工合入继续独立控制。本仓路径 Hook 已有合成输入回归；具体覆盖、失败语义与 Claude → Codex 迁移差异见 [06](../06-hooks-and-guardrails.md)，不能只改目录便搬到 Codex。

**依据**：[一手：团队复盘] [Ramp OCA](https://builders.ramp.com/post/how-we-built-oca-our-ai-on-call-assistant)，原核实 2026-10-21；[本仓实测] [E6 路径 Hook 回归](../19-experiments.md#10-e6路径-hook-的确定性回归)，原核实 2026-10-11，非真实客户端验收；[一手] [Hooks 参考](https://code.claude.com/docs/en/hooks)，`onFailure: "block"` 需 v2.1.295+，不适用于 Stop 或后台 Hook，核实 2026-10-26。

## 何时换一种做法

- **陌生仓库、无人值守任务、带真实数据的 CI**：先选不含无关秘密、受限挂载与网络的独立环境；审过配置来源后再运行代码。上面的本机起点适合可信工作副本。
- **原生 Windows 上用 Claude Code**：改用 WSL2 或合适的隔离环境；该 Bash 沙箱不支持原生 Windows。Codex 则按自己的 Windows 后端配置。
- **仍然频繁询问**：先区分“Agent 在聊天里问能否继续”和“平台工具审批”，再查有效配置与具体失败原因。中文社区已有开启“帮我审批”仍频繁停顿的反馈，不能仅凭开关名判断原因。
- **考虑审批插件**：Dippy 的用途是自动批准其判为安全的命令，方向是减少询问；CC-Monitor 作者则明确当前主要是拦截和告警。两者都不能替代环境隔离，现阶段不作为本页默认安装项。

**依据**：[一手／社区原文] [V2EX 审批反馈与回复](https://v2ex.com/t/1249304)、[Dippy 作者说明](https://github.com/ldayton/Dippy)、[CC-Monitor 作者说明](https://v2ex.com/t/1241604)；插件未试用，作者自报效果不作为提速结论。核实 2026-10-26。完整边界与案例见 [10 安全](../10-security.md)。
