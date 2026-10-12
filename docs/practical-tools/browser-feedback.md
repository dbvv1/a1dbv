# 浏览器反馈：Chrome DevTools MCP 补什么

> 核实时间：2026-10-12。🧪 试用；未安装、未连接浏览器或验证产品。
> 发布快照：**v1.10.1，2026-09-23**。**[一手：release]**

## 原生基线与诊断增量

先复用项目 Playwright 测试、trace 与人工 DevTools，验收设计直接用 [23](../23-browser-verification.md)。已有工具能点击、截图和断言时，不因新名字再开浏览器控制入口。**[经验：采用判断]**

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) 把实时控制台、网络、性能 trace 等诊断交给 Agent，当前也有 CLI。适合页面可开却请求失败、交互卡顿、Agent 看不到实际状态的情形。稳定流程仍要形成回归测试，不以聊天记录代替。[1.10.0/1.10.1](https://github.com/ChromeDevTools/chrome-devtools-mcp/releases) 新增 CSS/配置及 trace 相关改进，但没有本仓库实测收益。**[一手：文档/changelog；经验：判断]**

## 许可、依赖和真实数据出口

[LICENSE](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/LICENSE) 为 Apache-2.0；浏览器、Node、模型客户端是额外依赖，模型费用不因 MCP 开源而消失。**[一手；经验：费用边界]**

README 明确浏览器内容对 MCP 客户端可见且可修改。工具统计默认开启，可用 `--no-usage-statistics` 关闭；性能工具可能将 trace URL 发给 CrUX，可用 `--no-performance-crux` 关闭；Chrome 自己的统计开关不替代工具开关。**[一手：README]**

[当前配置文档](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md) 中 `--redact-network-headers` 默认 false；可显式启用，但只遮盖部分敏感请求头，不保护所有正文、URL、截图。该描述取自 main，拟装 tag 仍须核对选项存在；本轮未测开关的实际网络行为。**[一手；验证缺口]**

试用用隔离测试 profile，不直接连着个人邮箱或公司管理后台的日常 profile。网络响应、截图、trace 都按可能敏感的产物处理，localhost 不等于零数据外发。**[经验：设计]**

## Windows 具体失败不能混淆层次

[#3021](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/3021) 在 **2026-10-07** 报告 Claude Code marketplace 递归克隆子模块遇 Windows 长路径/超时，核实时开放；环境为 Windows 11、Claude Code 2.1.292。不能外推所有 Codex MCP 接入失败，延长超时也不能修路径长度。**[社区：单例原帖]**

分别验证服务启动、客户端连接、市场安装三层；碰到安全防护/权限错误不默认关闭保护，先回现有测试路径。**[经验：排障判断]**

## 最小试用与退出

待执行设计 **[经验：设计]**：在公开本地示例中选择一次失败请求或慢交互，两条路径分别产出复现步骤、控制台/网络或性能原因、前后对照及回归断言。记录浏览器、profile、URL。保留条件是拿到原先难获得的有效诊断或减少人工抄日志；漂亮截图与 Agent 自称检查过不算。结束检查浏览器/服务进程退出，只清理获准测试数据；静态截图已足够时不加。

[返回模块](README.md) · 完整验收见 [23](../23-browser-verification.md)
