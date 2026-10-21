# Gemini CLI 与 Antigravity

> 编辑更新：2026-10-21（UTC+8）；本次补入口比较，认证、迁移与隔离保留 10-16 的[核查范围](../research/2026-10-12-community-source-records.md#gemini-页历史页头)。
> 评级：🧪 **有条件试用**（已有可用 API／企业合同路径）；个人新接入另评估 Antigravity CLI

## 30 秒结论

**✅ 已有 Gemini CLI 的认证路径有效、且能完成修改和验收，就保留。** 缺运行证据时先补 profile、日志与实际页面；需要人直接调试／逐段改稿才试 IDE，需要脱离本机执行则另核远程环境。消费者路径失效后的必要迁移，按下文资格与配置处理。[研究：2026-10代际条件默认]

**⛔ 不把 Google 的生产采用当成换 IDE 的收益证明。** Agent 负责据证据定位、改稿和跑检查，人核目标、兼容与真实体验；新入口若丢必要工具、数据通路或原验收，就保留旧路或暂停迁移。[研究]

## 当前最高水平

<!-- frontier: status=未知 gap=2 gen=2026-10 checked=2026-10-21 -->

**当前最佳 Google 编码入口未知。** Antigravity 团队[10-13 的生产复盘](https://www.antigravity.google/blog/gemini-4-argon-in-google-antigravity)称，内部 Argon 根据 YouTube 生产 profile 定位冗余 emoji 渲染并改进性能；可借的是运行证据驱动改稿，内部产品结果不能归因于 IDE 相对 CLI 的优势。[一手：厂商自报；研究]

**对照生产实践与入口职责后，仍保留可验收的 CLI。** Google Cloud 的 [6-10 入口指南](https://cloud.google.com/blog/topics/developers-practitioners/choosing-your-surface-antigravity-20-antigravity-cli-antigravity-ide-or-antigravity-sdk)把 CLI、IDE 与多任务桌面应用区分为不同交互面，共享的是 Antigravity harness；这个结论不包括原 Gemini CLI。选择应随缺少的反馈改变，不能仅凭“后台”推定关机后续跑。[一手：产品设计指南；研究：条件选择]

本页默认属于**可行**层，主流采用率未知；尚缺相同仓库任务、有效配置与后续修改的入口对照，故保持差距2。比较与撤回方法见[总览](README.md#当前最高水平先分层再决定迁移)，团队条件和读取范围见[研究记录](../research/2026-10-12-community-source-records.md#p54入口选择先分界面harness与执行环境)。[研究]

## 1. 基本情况

- 开源（Apache-2.0），`npm install -g @google/gemini-cli`；最新稳定版 **v0.63.0（2026-10-06）**，基本每周一个版本。
**先核认证与合同，再选客户端；不再为旧个人免费额度新采用 Gemini CLI。** **[研究：采用判断]**

- **消费者路径已停**：Code Assist individuals、Google AI Pro／Ultra 经 Google 账号登录 Gemini CLI 的服务自 2026-06-18 停止；这不是全部 Google 登录、CLI 或 API 路径停用。[官方弃用说明](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals) **[一手]**
- **API 与企业分别核**：[迁移公告](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)明确保留付费 Gemini／Enterprise Agent Platform API key 接入；免费 API key 不据旧额度页保证，Vertex AI 按所用项目的资格、额度与计费核对。Standard／Enterprise 自 2026-10-09 停止新购，已有订阅按合同继续支持，续订／加席另有截止日期，见[企业弃用说明](https://docs.cloud.google.com/gemini/docs/codeassist/sunset)。**[一手；研究：边界]**
- 文档站：[geminicli.com/docs](https://geminicli.com/docs/)。

## 2. 功能面（`docs/cli/` 目录）

ACP 模式、auto memory（带“收件箱”审阅流程）、checkpointing 与 rewind、Skills（含编写指南与最佳实践）、自定义命令、`GEMINI.md`、`.geminiignore`、git worktrees、无头模式、模型路由（model routing）、Plan 模式、[沙箱](#沙箱启用与隔离范围)、受信任目录、token 缓存、Hooks、Extensions、语音模式。

### 沙箱启用与隔离范围

**🧪 需要保护主机资源时，先核实际生效的沙箱配置及读、写、网络范围，再选择后端。** 固定发行版 v0.63.0 默认未启用完整进程沙箱或工具级沙箱；前者的环境变量还能覆盖 `-s`，不能只看启动参数。启用 macOS Seatbelt 后，默认 `permissive-open` 仍允许广泛文件读取和网络访问，另有明确拒绝项；自动审批也不等于 OS 隔离。完整进程与工具级隔离须分开核查，其他版本以对应实现和实际边界为准。见[固定版本、文档冲突与反例](../research/2026-10-12-community-source-records.md#gemini沙箱启用与有效边界)；本仓库未运行客户端或验证隔离效果。**[一手；研究：采用边界]**

### 恢复范围

**🧪 只撤回编辑工具产生的改动，可先用原生 `/rewind`；需回到项目快照，则另核 checkpointing 的 `/restore`（默认未启用）。** 后者会修改实际项目工作树，并非只撤 Agent 的编辑。混有人工作业、shell 改动或忽略文件时，先核恢复范围并保留原有 Git／备份；不能仅因都有“回滚”功能就迁移。依据与局限见[固定恢复链](../research/2026-10-12-community-source-records.md#gemini编辑记录撤回与项目快照恢复)。**[一手；研究：采用边界]**

## 3. 2026 年值得注意的更新

| 版本 | 日期 | 要点 |
|---|---|---|
| v0.38 | 04-14 | “Chapters”叙事分组、上下文压缩服务 |
| v0.39 | 04-23 | `/memory` 收件箱；Plan 模式下启用 Skill 需确认 |
| v0.41–0.42 | 05 | 实时语音模式；auto memory 收件箱；默认启用 Gemma 4 |
| v0.44 | 05-27 | Unified Auto Mode；Sublime Text / Emacs 集成 |
| v0.54 | 08-06 | 集成 **Antigravity agent runner** 做 PR 自动化 |
| v0.58–0.61 | 09 | **几乎全是安全加固**：symlink 与容器 socket 隔离、MCP OAuth SSRF、workspace trust 改为默认拒绝、扩展环境变量需授权、通过构建文件与不可信参数的**间接提示注入** |
| v0.63 | 10-06 | **非交互模式下可以自主执行计划**（无人值守的多步工作流不再需要逐步确认）；限制工具输出大小、优化长时间 Agent 循环的内存；修复无头环境下的认证死循环 |

> **解读**：8–9 月密集的安全修复说明 Coding Agent 已成为真实的攻击目标（另见 [10-security](../10-security.md)）。无论用哪家，都要保持更新。

## 4. Antigravity

👀 **评估 Antigravity CLI 作为个人入口或必要迁移候选，先核当前资格、费用与必需功能。** 官方已给出从 Gemini CLI 转换配置与插件的路径，但只承诺部分兼容；旧免费额度不作为新入口预算，导入成功也不代表原工作流已接续。**[一手；研究：采用判断]**

[迁移文档](https://antigravity.google/docs/cli/gcli-migration)支持选择导入扩展及全局配置；项目 Skills 需从 `.gemini/skills/` 调整到 `.agents/skills/`，MCP 改用独立配置，部分远程地址字段需转换。认证也须单独核：[API key 路径](https://antigravity.google/docs/cli/install/#using-a-gemini-api-key)要求显式设置 `modelProvider`，仅保留原环境变量不够。先检查实际加载、必要工具与授权，再决定是否替换旧入口；本仓库未运行迁移。**[一手；研究：采用边界]**

## 5. 适用场景

- 已有可用 Gemini CLI API／企业合同路径，且覆盖任务需要时可保留，不因消费者入口变更一律迁移。
- 个人用户需要 Google 编码入口时，先评估 Antigravity CLI 的资格和配置适配；只因预算有限，不直接选用旧免费路径。
- 多模态任务先核实际模型、输入支持与额度，不以旧“1M 上下文”代替客户端可用性。**[研究：条件选择]**

## 来源

- [gemini-cli README](https://github.com/google-gemini/gemini-cli)、[docs/changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs)
- [接入变更与迁移证据](../research/2026-10-12-community-source-records.md#gemini接入资格与-antigravity-迁移)（含旧页面冲突与未验证范围）
