# Gemini CLI 与 Antigravity

> 核实：2026-10-22（UTC+8）；整页入口与迁移接收比较，v0.65.0 固定源码静态复核；历史范围见[研究记录](../research/2026-10-12-community-source-records.md#gemini-页历史页头)。
> 评级：🧪 **有条件试用**（已有可用 API／企业合同路径）；个人新接入另评估 Antigravity CLI。

<a id="5-适用场景"></a>

## 30 秒结论

**✅ 已有 Gemini CLI 认证有效、能完成修改和验收，就保留；需要迁移时，以原任务跑通为终点。** 先核认证与合同，再选交互入口。

| 当前需要 | 选择 | 接收时看什么 |
|---|---|---|
| 已有可用 API／企业合同路径 | 保留能覆盖任务的 Gemini CLI | 缺运行证据时补 profile、日志与实际页面；消费者入口变更不要求所有用户迁移 |
| 个人用户新接入 Google 编码工具 | 👀 评估 Antigravity CLI 的资格、费用与配置适配 | 旧个人免费路径及额度不再作为采用或预算依据 |
| 需要人直接调试、逐段改稿 | 试 IDE 交互面 | 必需工具、数据通路与原验收都能保留；换界面本身不是质量升级 |
| 需要脱离本机，或关机后继续执行 | 另核获准远程执行环境 | 执行主机、数据与验收可达性；Remote Control 仍依赖主机 |
| 多模态任务 | 核实际模型、输入支持与额度 | 客户端实际可用性，而不是旧“1M 上下文”规格 |

Agent 据证据定位、改稿和跑检查，人核目标、兼容与真实体验。新入口丢失必要能力或原验收时，回到仍有效的旧路或暂停迁移。以下为 2026-10 代际条件选择；Google 的生产采用提供机制参照，不是换 IDE 的收益证明。

## 当前最高水平

**把运行证据接到修改和接收，比迁完配置更重要。** Google Antigravity 团队 10-13 生产复盘自报用 YouTube profile 定位性能问题；独立项目 claude-mem 的迁移故障及 9–10 月后续修订，则暴露了“配置存在、安装测试通过，真实宿主仍失败”的问题。可以借用前者的证据驱动改稿，并用后者的真实触发、持久化与后续读取检查迁移结果。

**默认保留已工作的 CLI，确有交互或执行环境需求再换入口。** CLI、IDE、多任务桌面是不同交互面，原生契约足够时沿用原生；必要迁移先验证原任务、必需工具与中断续接。整页资料比较差距记为 1，同仓库等投入的完整入口对照仍缺，尚不能据此给出当前模型效果或入口冠军。旧版本故障、当前源码和上游测试定义分别支持各自范围，本页阅读未记作运行。

**依据**：一手团队自报——[Google Antigravity 10-13 生产复盘](https://www.antigravity.google/blog/gemini-4-argon-in-google-antigravity)；独立维护反例——[claude-mem 迁移故障](https://github.com/thedotmack/claude-mem/issues/4057)及后续修订；本仓条件默认与比较范围见[本轮研究](../research/2026-10-12-community-source-records.md#p85gemini入口与迁移接收)。核实 2026-10-22。

## 1. 基本情况

Gemini CLI 开源（Apache-2.0），安装命令为 `npm install -g @google/gemini-cli`。本轮核对稳定版 **v0.65.0（2026-10-20 UTC 发布）**，基本每周一个版本；用法见 [geminicli.com/docs](https://geminicli.com/docs/)。

**先确认自己走哪条认证路径，再决定保留或迁移。**

| 路径 | 已核状态 | 怎么决定 |
|---|---|---|
| Code Assist individuals、Google AI Pro／Ultra 的 Google 账号登录 | 这条 Gemini CLI 消费者服务自 2026-06-18 停止 | 新个人接入评估 Antigravity CLI；停用范围不是全部 Google 登录、CLI 或 API |
| Gemini／Enterprise Agent Platform API key | 迁移公告明确保留付费 API key 接入；免费 API key 不能按旧额度页保证 | 先核实际 key 的资格与费用；Vertex AI 按所用项目核资格、额度和计费 |
| Code Assist Standard／Enterprise | 自 2026-10-09 停止新购，已有订阅按合同继续支持；续订／加席另有截止日期 | 已有用户按合同和企业弃用说明核对，不因消费者路径停止一律迁移 |

**依据**：官方 [v0.65.0 发行页](https://github.com/google-gemini/gemini-cli/releases/tag/v0.65.0)、[消费者弃用说明](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals)、[迁移公告](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)、[企业弃用说明](https://docs.cloud.google.com/gemini/docs/codeassist/sunset)；保留或迁移为本仓采用判断。核实 2026-10-22。

## 2. 功能面（`docs/cli/` 目录）

| 要找哪类能力 | 文档中的入口 |
|---|---|
| 任务与交互 | ACP 模式、无头模式、Plan 模式、语音模式、模型路由（model routing） |
| 项目知识与扩展 | `GEMINI.md`、`.geminiignore`、Skills（含编写指南与最佳实践）、自定义命令、Hooks、Extensions |
| 会话与项目状态 | auto memory（带“收件箱”审阅流程）、checkpointing 与 rewind、git worktrees、token 缓存 |
| 执行边界 | [沙箱](#沙箱启用与隔离范围)、受信任目录 |

### 沙箱启用与隔离范围

**🧪 保护主机资源前，核实际生效的读、写和网络范围，再选沙箱后端。** v0.65.0（`6006c14a`）固定源码显示，完整进程沙箱和工具级沙箱仍默认未启用；自动审批另管动作许可，不提供 OS 隔离。

| 要核的配置 | 会改变使用选择的事实 |
|---|---|
| 完整进程沙箱 | 环境变量能覆盖 `-s`，检查最终生效配置，不只看启动参数 |
| macOS Seatbelt | 默认 `permissive-open` 允许广泛文件读取和网络访问，另有明确拒绝项；启用后仍须核具体范围 |
| 工具级隔离 | 与完整进程沙箱分别核查，其他版本按对应实现确认 |
| 不可信目录设置写入失败 | v0.65.0 阻止 workspace 设置写入，user scope 仍可写，整个工作树并非只读；先核 scope、信任来源及谁有权决定本次配置生效，不默认改全局或提高信任来绕过 |

**保留必要审批，并同时验合法任务与越权路径。** HarnessSecurity-Bench 在固定 GLM-5.2 下比较 harness 设置，限制可能同时阻断正常任务与攻击；全部拒绝也交不了任务。按任务最小授予能力，保住合法任务的验收，而不是为吞吐一律自动批准。

**依据与范围**：一手固定源码／测试定义及[文档冲突、隔离反例](../research/2026-10-12-community-source-records.md#gemini沙箱启用与有效边界)，本仓未运行客户端或验证隔离效果；独立研究 [HarnessSecurity-Bench](https://arxiv.org/html/2610.07639v1) 为模拟环境结果，不认证本版／Argon 的隔离效果。核实 2026-10-22。

### 恢复范围

**🧪 先选要撤回什么，再用对应恢复入口。**

| 目标 | 入口与范围 |
|---|---|
| 只撤回编辑工具产生的改动 | 原生 `/rewind` |
| 回到项目快照 | checkpointing 的 `/restore`（默认未启用）；它修改实际项目工作树，不只撤 Agent 的编辑 |

混有人工作业、shell 改动或忽略文件时，先核恢复范围并保留原有 Git／备份。迁移前核对这些差异，不能只比较是否都有“回滚”功能。

**依据**：一手固定实现与本仓采用判断，见[固定恢复链](../research/2026-10-12-community-source-records.md#gemini编辑记录撤回与项目快照恢复)。核实 2026-10-22。

## 3. 会话续接与版本接收

**✅ 升级后先恢复原会话，核历史和工具结果，再接原验收。** v0.65.0 修复了恢复响应去重、快速退出保留历史、取消工具写入终止记录。这些改变会话记录，`/rewind` 与 `/restore` 的文件恢复范围仍按上一节判断。

**中断后先核业务实际状态，再决定重试。** 取消标记或命令返回空白，都不足以判断外部动作没发生。Gemini MCP 包装器的早期迁移含输出恢复与重调路径，经兼容层遇空输出时尤其要核已有结果；原生输出稳定后退出临时兼容层，避免为旧 bug 永久增加一层。

**依据**：一手 v0.65.0 源码／测试见[版本复核](../research/2026-10-12-community-source-records.md#p85当前发行与接收边界)；旧版实现见 [Gemini MCP 包装器早期迁移](https://github.com/jamubc/gemini-mcp-tool/commit/4657eb9515288d8fb1262b25e9d01bfe76502d6c)，重试与退出条件为经验性维护判断。核实 2026-10-22。

## 4. Antigravity

**👀 个人新接入或必要迁移时，先核资格、费用与必需功能，再试 Antigravity CLI。** 官方提供部分配置与插件兼容路径；接收目标是原工作流继续成立，而不只是成功导入。

### 迁移配置：逐项核实际加载

**导入前先审认证迁移范围。** 确认后再按下表迁移，并核实际加载与功能。

| 要迁的内容 | 按文档处理 | 完成后核什么 |
|---|---|---|
| 扩展与全局配置 | 选择需要导入的内容；活动 token 会迁入系统 keyring | 核实际加载、必要工具和授权 |
| 项目 Skills | `.gemini/skills/` 调整到 `.agents/skills/` | 目标入口实际可用 |
| MCP | 改用独立配置，转换部分远程地址字段 | 必需工具的数据通路与返回内容 |
| API key | 显式设置 `modelProvider`，仅保留原环境变量不够 | 当前认证路径有效 |

本仓未运行迁移。依据为一手[迁移文档](https://antigravity.google/docs/cli/gcli-migration)及 [API key 路径](https://antigravity.google/docs/cli/install/#using-a-gemini-api-key)，采用条件为本仓判断；核实 2026-10-22。

### 接收迁移：让原任务走完整条链

**扩展要验真实触发、解析、持久化和下一会话读取。** Agent 核这条链，人接收原功能。claude-mem 先后修过 hooks 文件位置、schema 与事件假设，10-19 又修会话开始注入；因此分别核源码、分发包和实际配置，不照抄旧事件表。这个维护案例用于核迁移，无额外记忆需求就不安装它。

**MCP 返回成功时，再核模型能否读到内容。** 独立桌面报告 #953 在 2.12.2／Gemini 3.8 Flash High 中复现：structured-only 结果不可见，文本／两者并存可见。issue 关闭是转交桌面团队，修复状态仍未由此证明。可借相同输入检查返回语义；这是桌面报告，不是 CLI 已复现缺陷，不据此改所有服务端。

**关机后要继续执行，另选获准远程环境。** Remote Control 的交互连接随进程结束，daemon 可在主机开机时运行，二者仍依赖那台主机。先核执行位置及数据、验收可达性；浏览器能连接不代表执行迁到了云上。

**依据**：一手维护修订——[claude-mem 10-19 会话开始注入](https://github.com/thedotmack/claude-mem/commit/9e4f313a89236f7fb593a639a77ee02e21e94469)；一手用户复现——[独立桌面报告 #953](https://github.com/google-antigravity/antigravity-cli/issues/953)；官方 [Remote Control 生命周期](https://antigravity.google/docs/remote-control)。接收与撤回为经验性判断；核实 2026-10-22。

## 来源

- [gemini-cli README](https://github.com/google-gemini/gemini-cli)、[docs/changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs)
- [接入变更与迁移证据](../research/2026-10-12-community-source-records.md#gemini接入资格与-antigravity-迁移)（含旧页面冲突与未验证范围）
