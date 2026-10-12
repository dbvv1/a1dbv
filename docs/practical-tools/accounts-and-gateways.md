# 账号、供应商与本地网关：Magpie / CC Switch

> 核验日期：2026-10-12。证据来自公开仓库、维护者文档、部分源码及用户 issue。未安装或运行软件，未访问私人账号或日志。文档功能不等于实测结论。

## 先给判断 [经验：采用判断]

对于多个已获授权的个人账号或订阅（例如个人 Pro + Plus），如果痛点是自动分配、额度利用和跨工具共用模型，Magpie 更值得优先评估。如果主要是 Windows 上使用 Codex，在官方账号与公司网关之间明确切换，CC Switch 仍是有竞争力的基线，尚无证据证明迁移一定更好。

- Magpie：👀 评估，自动多账号路由候选，未实测、未采用
- CC Switch：👀 评估，显式账号与供应商管理基线，未实测、未采用

[一手] 本文的项目分别是 [yetone/magpie](https://github.com/yetone/magpie) 与 [farion1231/cc-switch](https://github.com/farion1231/cc-switch)。Magpie 官方仓库指向 usemagpie.ai；本文不采用同名项目或未经验证域名的产品归属。

## 软件、费用与平台 [一手]

| 项目 | 许可、收费边界 | Windows 支持 | 研究时的发布快照 |
| --- | --- | --- | --- |
| Magpie | [MIT](https://github.com/yetone/magpie/blob/main/LICENSE)；[官方首页](https://usemagpie.ai/)明确免费、开源 | Windows x64 / ARM 可执行文件；仓库说明可管理 WSL 内 agent | [v0.1.1203](https://github.com/yetone/magpie/releases/tag/v0.1.1203)，2026-10-12 |
| CC Switch | [MIT](https://github.com/farion1231/cc-switch/blob/main/LICENSE)；[维护者发布说明](https://github.com/farion1231/cc-switch/blob/main/docs/release-notes/v3.20.0-en.md)明确软件免费、不收费 | Windows 10+，x64 / ARM，MSI 与便携包 | [v4.0.9](https://github.com/farion1231/cc-switch/releases/tag/v4.0.9)，2026-10-11 |

本轮未发现本文涉及本地功能的付费档。上游模型/API/订阅费用另算，不能把工具免费写成模型免费。发布页小时没有显式时区，故只记录日期；这些是研究时快照，不承诺一直为最新版本。

## 不要用旧版印象比较 [一手]

把 CC Switch 仅描述为直连配置切换器，不能代表当前版本。[CC Switch 4.0 发布说明](https://github.com/farion1231/cc-switch/blob/main/docs/release-notes/v4.0.0-en.md)已列出三种模式：

- Direct：客户端直连供应商
- Routing：经过本地路由，支持协议转换与故障转移
- Aggregation：把多家模型放入同一选择器，按选中的模型分发，但不提供 failover

聚合支持 Codex 与 Claude Code；Codex 的官方 OpenAI 账号只能作聚合默认供应商。切模型会重建 prompt cache，第一轮成本可能增加。因此，“只有 Magpie 有网关、协议转换或统一模型列表”不是成立的选型依据。

## 多账号：真正的区别 [一手]

### Magpie：按配额调度与会话黏性

[路由参考](https://github.com/yetone/magpie/blob/main/docs/reference.md#how-magpie-picks-an-account)描述了按配额、重置时间、低使用率、轮换等方式调度，并有 stays=auto/session/turn/off 会话黏性。X-Magpie-Account 请求头可以固定账号。原生直连时的登录切换与经过网关的请求调度是不同机制。

[经验：采用判断] 这使它更贴近“多个个人订阅怎样自动分担工作”。会话黏性不等于硬隔离，文档也不构成跨账号共享缓存、任意会话无缝迁移或永不中断的保证。

### CC Switch：显式绑定与切换

[v3.20 文档](https://github.com/farion1231/cc-switch/blob/main/docs/release-notes/v3.20.0-en.md)支持多个 ChatGPT 登录，并将每张官方供应商卡绑定到独立账号。切卡写入完整登录包，接纳 CLI 刷新的 token；旧会话身份与绑定账号不符时提示重启。

官方 ChatGPT 卡明确排除自动 failover，避免一次重试误用另一个账号计费。这是有意的边界，不能简化为“不支持多账号”。

## 官方登录、凭据与公司线路

[一手：源码] Magpie 的 [Codex 接入代码](https://github.com/yetone/magpie/blob/main/internal/agent/codex.go)可确认通过 openai_base_url 接入本地网关，同时支持保留 Codex 内置 OpenAI provider/sign-in 路径。保留登录不表示请求绕过 Magpie，也不是 OpenAI 官方背书。

[社区：单例；一手：发布记录] Magpie [#1674](https://github.com/yetone/magpie/issues/1674)报告只读 CLI 与常驻网关并发写登录文件，可能覆盖刚刷新的 token；[v0.1.1201](https://github.com/yetone/magpie/releases/tag/v0.1.1201)列出修复。报告者确认 Linux arm64 / Debian 13 下该版本的只读命令不再改写文件。这不是 Windows 实测，也不是穷尽并发竞争证明。

[一手：维护者风险披露] CC Switch 的 [Codex OAuth 反向代理说明](https://github.com/farion1231/cc-switch/blob/main/docs/user-manual/en/2-providers/2.1-add.md)明确提醒账户限制、服务条款及上游机制变化风险。不能把这写成必然封号，也不能认定其已被证明安全。

[经验：采用判断] 公司网关与个人账号池默认分开，不让公司任务自动 fallback 到个人订阅。是否允许跨线路处理代码，取决于公司政策与明确授权。这是安全建议，不是已验证的产品隔离保证。本轮没有验证实际公司网关的请求头、协议、代理链或账号隔离。

## 社区证据与验证边界

- [社区：单例] **修复获得用户确认：**Magpie [#1237](https://github.com/yetone/magpie/issues/1237)中的 Codex 自定义 Responses provider 子代理路由问题，维护者发修复后，原报告者确认成功；同线程仍有跨后端 sealed-task 边界，不能外推所有跨模型子代理都兼容
- [社区：单例；一手：维护者回复] **额度上限不保证精确保留：**[#1295](https://github.com/yetone/magpie/issues/1295)报告设 99% 上限仍耗尽。维护者承认缓存读数问题并发布修复，验证是模拟后端测试，未捕获真实账号请求；本轮所读线程尚无用户实账确认。已发请求仍可能越过阈值
- [社区：单例] **正面体验不等于共识：**[#1336](https://github.com/yetone/magpie/issues/1336)有非维护者的高度好评，也提出 UI 不一致，只能作为个体体验
- [一手] **Windows 重启提示的现实约束：**CC Switch [4.0.7 说明](https://github.com/farion1231/cc-switch/blob/main/docs/release-notes/v4.0.7-en.md)明确无法探知 Windows 上已打开的 Codex 桌面/编辑器扩展，因此切换后的重启提示采用保守处理

[经验：证据判断] 本轮没有找到足以证明“普遍认为 Magpie 全面胜出”的独立对照测试。不用 stars 代替可用性、性能或满意度评分。

## 后续测试清单 [经验：采用判断]

未来仅在获得相应安装、配置与账号操作授权后，再开展以下测试：

1. 固定单个个人账号，验证 Windows Codex 普通请求、长会话、工具调用与子代理的实际路径
2. 查明请求由哪个账号回答，检查切换后的旧进程行为，不只观察 UI 卡片
3. 对比缓存命中、首 token 延迟、错误与实际额度；不把估算成本当账单
4. 单独验证公司网关，关闭跨线路自动 fallback，检查凭据、请求头与数据没有串线
5. 验证退出、恢复配置与回滚路径，避免两个管理器同时改写同一配置

当前结论保持为 👀 评估，不是已采用推荐。Magpie 优先解决自动调度问题，CC Switch 优先作为显式切换与综合管理基线。

[返回模块](README.md)
