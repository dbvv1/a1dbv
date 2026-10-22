# Gemini CLI 与 Antigravity

> 核实：2026-10-22（UTC+8）；整页入口与迁移接收比较，v0.65.0固定源码静态复核；历史范围见[研究记录](../research/2026-10-12-community-source-records.md#gemini-页历史页头)。
> 评级：🧪 **有条件试用**（已有可用 API／企业合同路径）；个人新接入另评估 Antigravity CLI

## 30 秒结论

**✅ 已有 Gemini CLI 的认证路径有效、且能完成修改和验收，就保留。** 缺运行证据时先补 profile、日志与实际页面；需要人直接调试／逐段改稿才试 IDE，需要脱离本机执行则另核远程环境。消费者路径失效后的必要迁移，按下文资格与配置处理。[研究：2026-10代际条件默认]

**⛔ 不把 Google 的生产采用当成换 IDE 的收益证明。** Agent 负责据证据定位、改稿和跑检查，人核目标、兼容与真实体验；新入口若丢必要工具、数据通路或原验收，就保留旧路或暂停迁移。[研究]

## 当前最高水平

迁移后跑通原任务，而非只迁配置。

<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-22 -->

**近期领先机制是把运行证据接到修改和接收。** Google Antigravity 团队[10-13生产复盘](https://www.antigravity.google/blog/gemini-4-argon-in-google-antigravity)自报用YouTube profile定位性能问题；独立claude-mem的[迁移故障](https://github.com/thedotmack/claude-mem/issues/4057)及9–10月后续修订反证“配置存在、安装测试通过”不足以接收真实宿主。采用前者的证据驱动改稿，并加后者的真实触发、持久化与后续读取门槛。[一手／研究]

**比较后仍保留已工作的CLI，不把换界面当质量升级。** CLI、IDE和多任务桌面是不同交互面；需要人逐段调试才换IDE，需要跨设备操作另核执行主机。原生契约足够就不用兼容层；必要迁移时，先验证原任务、必需工具和中断续接，失败则回到仍有效的旧路或暂停迁移。[经验：默认与撤回]

**整页资料比较差距1，不是当前模型效果或入口冠军。** 主要选择、独立维护反例和权限评测见[本轮研究](../research/2026-10-12-community-source-records.md#p85gemini入口与迁移接收)。同仓库等投入的完整入口对照仍缺；旧版本故障、当前源码与上游测试定义分开，不把阅读记成运行。[研究]

## 1. 基本情况

- 开源（Apache-2.0），`npm install -g @google/gemini-cli`；本轮所核稳定版 **[v0.65.0](https://github.com/google-gemini/gemini-cli/releases/tag/v0.65.0)（2026-10-20 UTC发布）**，基本每周一个版本。
**先核认证与合同，再选客户端；不再为旧个人免费额度新采用 Gemini CLI。** **[研究：采用判断]**

- **消费者路径已停**：Code Assist individuals、Google AI Pro／Ultra 经 Google 账号登录 Gemini CLI 的服务自 2026-06-18 停止；这不是全部 Google 登录、CLI 或 API 路径停用。[官方弃用说明](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals) **[一手]**
- **API 与企业分别核**：[迁移公告](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)明确保留付费 Gemini／Enterprise Agent Platform API key 接入；免费 API key 不据旧额度页保证，Vertex AI 按所用项目的资格、额度与计费核对。Standard／Enterprise 自 2026-10-09 停止新购，已有订阅按合同继续支持，续订／加席另有截止日期，见[企业弃用说明](https://docs.cloud.google.com/gemini/docs/codeassist/sunset)。**[一手；研究：边界]**
- 文档站：[geminicli.com/docs](https://geminicli.com/docs/)。

## 2. 功能面（`docs/cli/` 目录）

ACP 模式、auto memory（带“收件箱”审阅流程）、checkpointing 与 rewind、Skills（含编写指南与最佳实践）、自定义命令、`GEMINI.md`、`.geminiignore`、git worktrees、无头模式、模型路由（model routing）、Plan 模式、[沙箱](#沙箱启用与隔离范围)、受信任目录、token 缓存、Hooks、Extensions、语音模式。

### 沙箱启用与隔离范围

**🧪 需要保护主机资源时，先核实际生效的沙箱配置及读、写、网络范围，再选择后端。** 固定发行版 v0.65.0（`6006c14a`）静态复核后，仍默认未启用完整进程沙箱或工具级沙箱；前者的环境变量还能覆盖 `-s`，不能只看启动参数。启用 macOS Seatbelt 后，默认 `permissive-open` 仍允许广泛文件读取和网络访问，另有明确拒绝项；自动审批也不等于 OS 隔离。完整进程与工具级隔离须分开核查，其他版本以对应实现和实际边界为准。见[固定版本、文档冲突与反例](../research/2026-10-12-community-source-records.md#gemini沙箱启用与有效边界)；本仓库未运行客户端或验证隔离效果。**[一手；研究：采用边界]**

**审批与隔离各守一层，同时保留合法任务的验收。** 独立[HarnessSecurity-Bench](https://arxiv.org/html/2610.07639v1)比较固定GLM-5.2下的harness设置，显示限制可能同时阻断正常任务与攻击；不能用“全部拒绝”当可交付安全。默认保留必要审批，按任务最小授予能力；评估越权路径时也核合法任务，不为吞吐一律自动批准。该模拟环境结果不认证本版／Argon的隔离效果。[研究；经验：选择]

**不可信目录设置写入失败时，先核scope和信任来源。** v0.65.0阻止workspace设置写入，但user scope仍可写；这不表示整个工作树只读。不要以改到全局或提高信任作为默认绕过，先由有权的人判断本次配置是否需要生效。[一手：固定源码／测试定义]

### 恢复范围

**🧪 只撤回编辑工具产生的改动，可先用原生 `/rewind`；需回到项目快照，则另核 checkpointing 的 `/restore`（默认未启用）。** 后者会修改实际项目工作树，并非只撤 Agent 的编辑。混有人工作业、shell 改动或忽略文件时，先核恢复范围并保留原有 Git／备份；不能仅因都有“回滚”功能就迁移。依据与局限见[固定恢复链](../research/2026-10-12-community-source-records.md#gemini编辑记录撤回与项目快照恢复)。**[一手；研究：采用边界]**

## 3. 会话续接与版本接收

**✅ 升级后先恢复原会话，核历史和工具结果，再接原验收。** v0.65.0包含恢复响应去重、快速退出保留历史、取消工具写入终止记录的修复；固定源码及测试见[版本复核](../research/2026-10-12-community-source-records.md#p85当前发行与接收边界)。这修的是会话记录，不扩大`/rewind`或`/restore`的文件恢复范围。[一手／研究]

**取消标记不证明外部动作未执行。** 中断中的调用先核业务实际状态再重试，尤其经兼容层遇空输出时。Gemini MCP包装器的[早期迁移](https://github.com/jamubc/gemini-mcp-tool/commit/4657eb9515288d8fb1262b25e9d01bfe76502d6c)含输出恢复与重调路径，不能把命令返回空白当作无副作用；原生输出已稳定时退出临时兼容，避免为旧bug永久叠一层。[一手：旧版实现；经验：维护判断]

## 4. Antigravity

👀 **评估 Antigravity CLI 作为个人入口或必要迁移候选，先核当前资格、费用与必需功能。** 官方已给出从 Gemini CLI 转换配置与插件的路径，但只承诺部分兼容；旧免费额度不作为新入口预算，导入成功也不代表原工作流已接续。**[一手；研究：采用判断]**

[迁移文档](https://antigravity.google/docs/cli/gcli-migration)支持选择导入扩展及全局配置，并会把活动token迁入系统keyring；先审认证迁移范围。项目 Skills 需从 `.gemini/skills/` 调整到 `.agents/skills/`，MCP 改用独立配置，部分远程地址字段需转换。认证也须单独核：[API key 路径](https://antigravity.google/docs/cli/install/#using-a-gemini-api-key)要求显式设置 `modelProvider`，仅保留原环境变量不够。先检查实际加载、必要工具与授权，再决定是否替换旧入口；本仓库未运行迁移。**[一手；研究：采用边界]**

**接收扩展迁移，要验真实宿主的完整链。** 让Agent核事件实际触发、适配器解析、产物持久化和下一会话读取，人看功能是否仍成立。claude-mem先后修hooks文件位置、schema与事件假设；[10-19又修会话开始注入](https://github.com/thedotmack/claude-mem/commit/9e4f313a89236f7fb593a639a77ee02e21e94469)。应分别核源码、分发包和实际配置，不照抄旧事件表；不需要额外记忆时也不因案例而安装它。[一手／经验]

**MCP显示成功还要核模型能否读到返回内容。** [独立桌面报告953](https://github.com/google-antigravity/antigravity-cli/issues/953)在2.12.2／Gemini3.8 Flash High中，结构化-only结果不可见而文本／两者并存可见；关闭是转交桌面团队，不是修复证据。可借同输入检查返回语义，但这不是CLI已复现的缺陷，不据此改所有服务端。[一手：用户复现；研究：范围]

**Remote Control不是关机云端运行。** 官方[生命周期](https://antigravity.google/docs/remote-control)区分随交互进程结束的连接和主机开机时运行的daemon；后者仍依赖那台主机。需要关机继续时另选获准远程执行环境，先核数据与验收可达性；浏览器可连接不等于执行已迁到云上。[一手／经验]

## 5. 适用场景

- 已有可用 Gemini CLI API／企业合同路径，且覆盖任务需要时可保留，不因消费者入口变更一律迁移。
- 个人用户需要 Google 编码入口时，先评估 Antigravity CLI 的资格和配置适配；只因预算有限，不直接选用旧免费路径。
- 多模态任务先核实际模型、输入支持与额度，不以旧“1M 上下文”代替客户端可用性。**[研究：条件选择]**

## 来源

- [gemini-cli README](https://github.com/google-gemini/gemini-cli)、[docs/changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs)
- [接入变更与迁移证据](../research/2026-10-12-community-source-records.md#gemini接入资格与-antigravity-迁移)（含旧页面冲突与未验证范围）
