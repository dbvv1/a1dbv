# 自建产品复用 Codex 认证的边界（事实与最小修订稿）

> 读取日期：2026-11-03。范围只限认证复用、部署类别与必要请求契约；未运行客户端、SDK 或模型，未登录、注册、申请资格或读取任何凭据。英文为官方短引文，其余为概述。

## 读者结论

**技术上能调用 app-server 的认证接口，不等于可以把同一 ChatGPT 认证入口用于面向他人的付费或托管服务。** 官方把可继续使用、建议迁移、需合作资格分开写：

- **既有本地／开源应用可以继续**：官方原文是 "you can continue using it"，同时建议迁到 Sign in with ChatGPT；本卡不要求这类应用停用。若该应用同时收费，"commercial" 与 "local/open-source" 的交界官方未说明，应按 ⑤ 的资格入口另核。
- **商业或托管服务不在该认证范围**：同一段写明 app-server authentication "has never been permitted for commercial or hosted services"，并把这类用途指向 SIWC 合作名单。这是官方使用范围说明，不是法律判决，也不判定任何具体项目违规。
- **身份登录不等于模型额度**：SIWC 身份 scope 只完成登录；plan usage 要另授 Responses API scope，并受应用与用户 plan 资格约束。登录成功本身不授予额度。
- **个人自托管 VM 不是多用户托管授权**：官方 VM 指南处理同一用户／workspace 的开源应用迁移，且 host 级用量归属与撤销尚未提供；不能用它推出面向公众托管普遍开放，也不能仅凭"远程"判定所有 VM 被禁。
- **请求面与工具面也不同**：plan usage 的 Responses 路由比普通 API 窄；本地 shell／MCP／子代理与 hosted 工具分开；`model/list` 可能只是目录，不是可用性证明。

**不要扩成整个 harness 或 API 的商用限制**：可核的官方文字只覆盖 app-server authentication。本稿不据此说 Codex SDK、普通 API 或 app-server 协议／代码不能用于商业产品，也不判定任何已知项目违规；这几类用途的条件要回各自条款，而不是这一段。

**两个词先分开**：app-server harness 指协议承载的会话历史、审批、工具执行与事件流；app-server authentication 指账号登录入口（`account/*` 与 ChatGPT 登录）。前者是运行面，后者才是官方范围段约束的授权对象；复用一个不等于复用另一个。

## 最小修订稿（不改 16 正文）

只改一处时，替换 `docs/16-building-agents.md` L117：

> - app-server 是自定义客户端接口，不是现成公网托管服务；当前 WebSocket 仍实验性，非 loopback 默认可能无认证，不能直接暴露。**认证入口与 harness 分开看**：既有本地／开源应用的 app-server 认证可继续使用，官方建议迁到 Sign in with ChatGPT；该认证从未允许用于商业或托管服务，后者走 SIWC 合作名单。普通自动编码保 CLI／SDK，远程产品另核受支持部署与认证。

配套两处最小连接句：

- L9 句末加："复用 harness 不等于复用认证入口；面向他人的付费／托管服务须另核 Sign in with ChatGPT 资格（见 §3）。"
- L113 句末加："app-server 的认证入口适用于既有本地／开源应用；商业或托管服务另走 Sign in with ChatGPT 合作路径。"
- L95 表行可保留；若要防误读，在"迁移到这里"后加"（认证使用范围见 §3）"。

以上只补认证复用边界，不改 16 的复用结论、SDK 选型或整页结构；是否采用由负责人核具体写者与差量。

## 固定原句 → 官方原文位置 → 处置

| 固定原句（`docs/16-building-agents.md`） | 官方原文位置 | 保留／补条件／未知 |
|---|---|---|
| L9 "产品化也可以复用，不必重写 harness" | app-server 页首 "Embed Codex into your product with the app-server protocol"、"Use it when you want a deep integration inside your own product"；#auth-endpoints 的范围段 | 保留"复用 harness"；补"复用认证入口另有范围"；未知：官方未定义 commercial 的边界；远程托管已按原文另列，免费与否不改变这一分流 |
| L95 "Codex 给 VS Code 扩展等富客户端用的接口（认证、会话历史、审批、事件流），开源" | 同一页首段列 "authentication, conversation history, approvals, and streamed agent events"，并说明实现在开源仓库 | 保留技术描述与开源事实；补"认证使用范围见 §3"；不把"含认证"读成"认证可用于任意产品"；未知：原文未按认证模式细分 |
| L113 "需要自定义客户端的认证、审批和事件交互时选 app-server" | app-server #auth-endpoints；SIWC quickstart 的客户端与资格段 | 保留技术选型；补"本地／开源可继续、建议迁移；商业／托管另走 SIWC 合作路径"；未知：未标明引入版本 |
| L117 "app-server 是自定义客户端接口……远程产品另核受支持部署与认证" | app-server 的 WebSocket 段与 #auth-endpoints；SIWC overview 的 OSS／本地与付费／远程托管分流 | 保留 WebSocket 与非 loopback 提醒；补具体认证范围与官方入口；未知：未来是否收紧、合作审批标准与时间未公布 |

## 五类入口选择表

先按**实际运行位置和服务对象**选，不按"开源／商业"标签选：已用 app-server 认证的本地／开源项目看①；要新接 plan usage 的开源或个人本地项目看③；只要登录身份看②；自己的远程 VM 看④；收费或替他人托管看⑤。开源应用托管给他人，也进入⑤。

| 入口 | 对象 | 官方支持范围 | 仍需核的资格／条件 | 可保留的 harness | 未知 |
|---|---|---|---|---|---|
| ① 既有本地／开源 app-server 认证 | 已用 Codex app-server 认证的本地或开源应用 | "you can continue using it"；建议迁 SIWC；"never been permitted for commercial or hosted services" | 是否确属 local／open-source；账号或 workspace 的模型访问；迁移后的 plan usage 资格 | 可保留 app-server 运行面（本地 shell、MCP、子代理、审批、事件）；限制在认证入口，不是 harness 代码 | "local" 未定义（局域网、远程终端、他人机器）；未按 `apikey`／`chatgpt`／`chatgptAuthTokens` 等模式细分；未标明引入版本 |
| ② Sign in with ChatGPT 身份登录 | 网站、ChatGPT plugin、开源客户端的登录步骤 | 身份 scope 为 `openid profile email`，返回 ID token；"Identity-only integration is currently offered to a select group of commercial partners" | 客户端类型是否受邀；身份登录只证明身份，不含 API 或 plan 访问 | 应用自有会话、账号体系与业务 harness 不变 | 选定商业伙伴的标准未公布；身份-only 受邀名单与开源 plan usage 流程的适用边界未逐项说明 |
| ③ 明确获准的 plan usage | 开源项目、个人本地项目、selected private apps／clients；合格 ChatGPT Plus／Pro 用户 | 可选能力；需单独 Responses API scope；"available to all open-source partners and selected private clients"；受 preview 限制 | 应用是否属于当前开放范围；selected private／商业合作路径是否获得相应资格；用户 plan 与 workspace 政策；`chatgpt.tokens.use.direct` scope；所选模型的实际访问 | app-server harness 可留；推理走 Responses API；hosted 工具受限（见下节） | "selected private" 的标准、per-app 配额与审批时点未公布；quickstart 写 "open-source partners"，cookbook 写 "open-source projects, personal projects that run locally"，是否需先登记为 partner 未说明 |
| ④ 个人自托管 VM | 同一用户／workspace 的开源应用运行在远程 VM | 官方 VM 指南：先建 host ID、在本地以 `127.0.0.1` 完成 OAuth、经安全通道转移凭据、由 VM 刷新 token | 仍按②／③的客户端与 plan 资格；必须本机完成 OAuth；保护 `client_id`、`access_token`、`refresh_token` 等凭据文件 | 本地 shell／MCP／子代理在 VM 上运行；hosted 工具同样受限 | 原文写明 "Host-specific usage attribution and revocation of ChatGPT plan access for transferred sessions are not yet available"；多用户、代人托管未覆盖；非开源个人应用是否同样适用未说明 |
| ⑤ 付费或面向他人的托管服务 | 收费应用、远程托管给他人使用的服务 | 不在上述 OSS／本地文档范围；app-server auth 从未允许；走 SIWC partner waitlist／interest form；商业伙伴目前为 limited trial | 是否获 partner 资格；条款与计费另定 | 技术代码可复用，但不产生认证资格；认证与计费须另行安排 | 审批标准、时间、plan usage 是否可用、commercial 与 hosted 的完整边界均未公布 |

注：app-server 页 Initialize／`clientInfo` 段另要求企业用途的 Codex 集成把 `clientInfo.name` 报给 OpenAI 加入 known clients list，用于 Compliance Logs Platform 识别客户端；这不是 SIWC 或 app-server authentication 的商用资格条件。

## 只补会改变选择的接口限制

- **身份 scope 不含额度**：quickstart 写 "Identity scopes don't grant access to ChatGPT conversations or OpenAI API resources"，并说 "Using a ChatGPT plan requires separate Responses API scopes that the user must authorize"；cookbook 也写 "a successful identity sign-in alone does not grant permission to use the user's ChatGPT plan"。用其中本地 SDK 时应看 `sharing` 标志；无论哪条路径，都要核 `chatgpt.tokens.use.direct` scope，不能以登录成功判断可发推理请求。
- **普通 API 支持不等于该 OAuth 路由支持**：preview limitations 明确这些限制 "apply to ChatGPT plan usage through Sign in with ChatGPT and https://api.openai.com/v1, both directly and through Codex app-server"。例如要求 `store: false`、`stream: true`；`previous_response_id` 在 HTTP 上不可用，`background`、`max_output_tokens`、`temperature` 等字段要省略；image generation、file search、Code Interpreter、native computer use、hosted MCP／connectors 与 Responses `tool_search` 不支持。普通 API 能用的能力不能直接搬。
- **本地工具与 hosted 工具分开**：原文写 "Codex can run shell and MCP tools and coordinate child agents through supported function/custom tool calls. These are separate from hosted Responses tools." 本地 shell／MCP／子代理可用，不代表 hosted 文件搜索、代码解释器、托管 MCP 或 `tool_search` 可用；`programmatic_tool_calling` 也不能放在该路由的顶层 `tools`。
- **`model/list` 是目录**：SIWC 页写它 "can return a bundled client catalog. Treat it as a catalog, not an entitlement check; a successfully completed inference turn verifies access to the selected model for that request." 列出模型不等于账号有权使用；只有完成的推理轮次能证明该次模型访问。
- **账号认证是 JSON-RPC，不是公开 HTTP 认证端点**：`account/read`、`account/login/start`（`apiKey`、`chatgpt`、`chatgptDeviceCode`、实验性 `chatgptAuthTokens`）、`account/logout`、`account/rateLimits/read` 等走 app-server 协议；同页的 HTTP `GET /readyz`、`GET /healthz` 只是健康探针，带 `Origin` 的请求返回 403。产品要接认证，得驱动 app-server 的 JSON-RPC 通道，不能假设有一个公有 REST 登录端点可调。原文也没有把实验性 `chatgptAuthTokens` 写成绕过上述范围说明的例外；本稿不据此给它增加资格。
- **传输认证与账号认证是两层**：WebSocket 的 capability-token／signed-bearer-token 只控制谁可连上监听器，不是 ChatGPT 账号授权；原文仍写 "WebSocket transport is experimental and unsupported"，非 loopback 监听器在 rollout 期默认允许未认证连接。16 的暴露提醒保留。
- **迁移不是换一个 endpoint**：app-server 的 `chatgpt` 模式由 Codex 自己完成 OAuth、持久化并刷新 token；SIWC 开源流程在登录时动态注册 client，由 OpenAI 签发 `client_id`；应用负责生成并持久化 `ext_agent_host_id`、保存 `client_id` 与 token（`access_token`／`refresh_token`），再把 `ACCESS_TOKEN` 交给 app-server 子进程。两者 token 生命周期与责任方不同，不能只改 `base_url`。

## 读者三问与官方核查入口

| 读者问题 | 结论 | 该查哪个官方入口 |
|---|---|---|
| 自制收费服务能否直接照搬既有 app-server 登录 | 不能按 app-server 认证直接照搬；官方把 commercial／hosted 排除在外，指向 SIWC 合作名单 | app-server #auth-endpoints 的范围段；SIWC quickstart 的资格段；[interest form](https://openai.com/form/sign-in-with-chatgpt-interest/)（本卡未打开或提交） |
| 身份登录成功是否就获模型额度权限 | 不；身份登录不够；plan usage 要另授相应 scope，并满足应用开放范围及用户资格，不能仅凭身份登录成功判断 | quickstart 的 "Understand scopes"；cookbook 的 `sharing` 标志与 plan usage 段；preview limitations |
| `model/list` 有模型、或本地 MCP 可用，是否证明托管工具也可用 | 不；`model/list` 只是目录，本地工具与 hosted 工具分开，preview 明确列出不支持的 hosted 能力 | SIWC codex-app-server 的 `model/list` 段；preview limitations 的 tools 段 |

## 日期、版本与事实层级

- app-server 页面**未见发布日期，也未标明引入版本**；文中只说明输出随 Codex 版本变化、部分方法需 `experimentalApi`。本稿不猜最低 CLI 版本，也不把 2026-11-03 的读取日写成生效日。
- cookbook 页标注 **Sep 28, 2026**；其余 SIWC 页未见发布日期或版本。
- `docs/16-building-agents.md` 的核实日期 2026-10-22 保持不变；S6a 的历史日期 2026-10-15 与结论不因本稿重写。本稿是新增范围核对，不刷新旧页日期、不追改旧事实。
- 固定输入已对照：`docs/16-building-agents.md` §1–3 的四处原句见上表；[S6a 选型补核](../../../../research/2026-10-10-audit.md#s6a--2026-10-15-sdk托管选型补核)（2026-10-15）与[长程研究"凭证与远程入口"行](../../../../research/2026-10-12-long-task-evidence.md)保留原日期与结论，不重写。
- 证据层级：官方文档一手静态读取（app-server、quickstart、OSS overview、codex-app-server、self-hosted-vms、preview-limitations、cookbook）；本稿的表格与修订稿是研究整理。未运行任何接口，未达 L4；不证明任何读者或第三方具备资格、实际运行成功、法律合规或模型收益。

## 去重与执行范围

- `origin/main` 上此前无同名产物；`docs/collaboration/local-jobs` 下 138 个任务 Markdown，与任务记录一致，未发现同原子题。仅 `A-REVIEW-RUBRIC-FACTS-20261103` 提到 app-server，属于同名接口的评审路由；`A-API-CREDIT-ROUTING-20261103` 是 Claude 赠额／计费，`A-TEAM-POLICY-DELIVERY-20261103` 是策略送达，均不重做。
- 只对公开文档做匿名静态 GET；未安装或执行 Codex、SDK、DevKit、示例，未登录、注册 client、申请资格、转移或保存凭据，未访问账单或发模型／付费请求，未开放监听、未改权限。未点击 interest form。

## 来源

- [Codex App Server — ChatGPT Learn](https://learn.chatgpt.com/docs/app-server#auth-endpoints)（读取 2026-11-03；页面未标发布日期与版本号）
- [Sign in with ChatGPT — Quickstart](https://developers.openai.com/siwc/quickstart)（读取 2026-11-03；页面未标发布日期）
- [ChatGPT plan usage — Overview](https://developers.openai.com/siwc/token-sharing-open-source)（读取 2026-11-03；页面未标发布日期）
- [Codex app-server — SIWC](https://developers.openai.com/siwc/token-sharing-open-source/codex-app-server)（读取 2026-11-03）
- [Self-hosted VMs — SIWC](https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms)（读取 2026-11-03）
- [Preview limitations — SIWC](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)（读取 2026-11-03）
- [Integrating Sign in with ChatGPT in your Opensource App — Cookbook](https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt)（页面日期 2026-09-28；读取 2026-11-03）
