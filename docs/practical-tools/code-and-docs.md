# 找代码与找文档：Serena 和 Context7 分开选

> 核实时间：2026-10-12；2026-10-13 补 Context7 版本与生成内容边界。两者 🧪 试用；文档和原帖已读，未安装运行。

## Serena：符号关系是增量

原生基线是 Codex 文本搜索和现有 IDE 的跳转/引用；Claude Code 用户还应先检查现有 LSP 插件。小仓库找字符串不必再维护语义服务。[Serena README](https://github.com/oraios/serena/blob/main/README.md) 描述符号检索与编辑，经 MCP 连接 Codex/Claude Code；当前主分支还介绍 IDE 级重构与调试，并在 coding harness 中关闭部分重叠的普通文件/搜索/shell 工具。**[一手：文档；经验：采用判断]**

**版本与许可必须绑定**：[release 页](https://github.com/oraios/serena/releases) 最新可见稳定发布为 **v1.7.0，2026-08-09**；9 月 [#2069](https://github.com/oraios/serena/issues/2069) 用的是 **2.0.0.dev0**。[LICENSE](https://github.com/oraios/serena/blob/main/LICENSE) 明确 v1.7.0 是最后的 MIT release；v2 起应用部分为 GPL-3.0-or-later，SolidLSP 仍 MIT，组合发行的 serena-agent 按 GPL。不能用旧许可介绍 main 新能力，也不能将全部 main 功能承诺给稳定包。依赖后端和模型授权/费用另查；此处只记录项目许可，不作法律适用判断。**[一手]**

README 中模型对自身使用体验的赞扬属于作者展示，不是独立性能测试。更值得关注的运行反例：
- [#1597](https://github.com/oraios/serena/issues/1597)：1.5.3 衍生构建下 C# OmniSharp 启动挂住、Roslyn 深路径解包失败；已关闭关联 #1617。
- [#2069](https://github.com/oraios/serena/issues/2069)：Windows AL 扩展目录变化导致初始化失败；已关闭关联 #2087。
以上均为 **[社区：单例原帖，未复现]**，不能泛化为不支持 Windows；首次含修复的 release 本轮未逐一核定。

**待执行试用** **[经验：设计]**：用真实跨文件引用/重命名任务与 IDE 已知结果对照。先只读查符号，确认语言服务初始化和引用覆盖，再允许限定范围编辑；独立编译测试。记录冷启动、失败、漏报、误编辑及维护耗时。若维护超过收益，退回 IDE/原生搜索，不关闭防护或无限等待。

本地语言服务会读项目，返回代码仍进入模型上下文，本地索引不等于不外传。核对缓存和依赖下载；不默认跨机器搬私有索引。当前 README 提醒市场安装命令可能过时，核对项目 Quick Start，本文不附未验证的一键安装脚本。**[一手；经验：风险边界]**

## Context7：文档查找便利不代替版本判断

原生基线是 lockfile 实际版本、该版本官方文档与已安装类型定义。若现有搜索可靠，就不必加服务。[README](https://github.com/upstash/context7/blob/master/README.md) 提供 MCP 与 CLI + Skills 两种入口；[MCP 4.3.0](https://github.com/upstash/context7/releases/tag/@upstash%2Fcontext7-mcp@4.3.0) 于 **2026-10-09** 增加 query-docs 的 language 参数，优先目标语言示例。MCP、ctx7 CLI、SDK 各自发版本，不能混写成同一“4.3”。**[一手；经验：采用判断]**

[LICENSE](https://github.com/upstash/context7/blob/master/LICENSE) 为 MIT；README 明确 API 后端、解析器与爬虫不在公开仓库。本地 MCP 不等于离线完整索引，远端服务可能有配额/费用，当前价格本轮未核验。**[一手：项目说明]**

具体边界：
- [#236](https://github.com/upstash/context7/issues/236) 是 2025 年特定版本 library ID 未命中文档的历史单例，已关闭；提示要验版本覆盖，不证明当前仍坏。**[社区：历史单例]**
- [#2235](https://github.com/upstash/context7/pull/2235) 于 2026-03-19 合并 CLI Skill 安装路径越界写入修复；范围是安装器，不能夸成普通 MCP 查询必然窃取私钥。首次修复 release 本轮未确认。**[一手：合并 PR，未复现]**
- [官方 find-docs Skill](https://github.com/upstash/context7/blob/master/skills/find-docs/SKILL.md) 要求先解析 ID 再查文档，并禁止查询含秘密、个人数据或专有代码；README 的 ctx7 setup 还涉及 OAuth、生成 API key 与安装配置，不是普通只读查询。**[一手]**

**待执行试用** **[经验：设计]**：选一个容易混淆版本的公开 API，只传通用问题与库/版本，保存返回 ID、来源和版本；对照官方资料与实际编译。精确版本未覆盖时回该版本官方文档／源码，不能把 Skill 的 closest match 或无版本 ID 当成兼容性已核实；返回片段还须区分项目原文与生成摘要。[固定查询链与反例](../research/2026-10-13-context7-version-boundary.md)表明版本 ID 是选择参数，不是依赖兼容性证明。**[一手：客户端／Skill；经验：采用判断]** 若省下的查找时间不足抵偿配置、配额和隐私维护，停用。退出时清理不用的连接/Skill；如创建过凭据，在授权后撤销，不只删本地配置。

[返回模块](README.md) · 接入机制见 [04](../04-mcp.md)，Skill 边界见 [05](../05-skills-and-plugins.md)
