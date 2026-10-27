# A-COMMUNITY-PRACTICE-SCAN-20261027 · 来源材料

读取截止：2026-10-27 16:05（UTC+8）。核实时间：2026-10-27。范围：LINUX DO、V2EX 主窗 2026-10-22 至读取截止，兼查可读中文渠道；只收材料，推荐、试用和正文发布由 dot-A 做。

## 先给结论

- **指定入口 LINUX DO／V2EX 在本机全部不可达，本轮没有取得这两个站点的任何新帖、旧帖新回复或后续采用／撤回材料，指定入口交零候选。** 这是网络层技术失败，不是站点拒绝、账号权限拒绝，也不能解释为“没有新反馈”。
- **在可读中文渠道找到 1 项带公开代码的增量材料：单人项目把“人-AI 协同控制模型”写进 ADR 并实际用于提交门禁，随后在一次 50 次尝试的评测中撤回了一个基于误判的提示词改动。** 它不在指定入口内，是否接收由 dot-A 判断。

## 增量材料：控制模型试行与一次“前提误判”撤回

### 来源与定位

- 中文原文：[《我不再逐行审查 AI 代码，但我知道该在哪里停下来——AI 编程协作的第二轮复盘》](https://juejin.cn/post/7699759985120067594)，作者显示名“沛东的认知和实践”，页面日期 2026-10-24；页面未显示可读评论区或评论数（仅显示“6 阅读”）。
- 公开代码库：[lipeidonggz/ai-study-helper-v2](https://github.com/lipeidonggz/ai-study-helper-v2)，本轮固定 `325956ced3eaece484eb91a7a0c576e45794100e`（HEAD 时间 2026-10-27 09:18 +08:00）。
- 关键固定文件：[ADR 0007](https://github.com/lipeidonggz/ai-study-helper-v2/blob/325956ced3eaece484eb91a7a0c576e45794100e/docs/decisions/0007-human-ai-collaboration-control-model.md)、[切片 030](https://github.com/lipeidonggz/ai-study-helper-v2/blob/325956ced3eaece484eb91a7a0c576e45794100e/docs/development/slices/030-agent-claim-strength-fidelity.md)、[AGENTS.md](https://github.com/lipeidonggz/ai-study-helper-v2/blob/325956ced3eaece484eb91a7a0c576e45794100e/AGENTS.md)、[pre-commit](https://github.com/lipeidonggz/ai-study-helper-v2/blob/325956ced3eaece484eb91a7a0c576e45794100e/.githooks/pre-commit)、[反向解释门禁脚本](https://github.com/lipeidonggz/ai-study-helper-v2/blob/325956ced3eaece484eb91a7a0c576e45794100e/scripts/check-reverse-explanation.mjs)。
- 账号关系：文章以“代码库”链接直接指向 [lipeidonggz/ai-study-helper-v2](https://github.com/lipeidonggz/ai-study-helper-v2)（经 link.juejin.cn 跳转），正文还直接链接 ADR 0007 与切片 015、018、020、023A、023B；本轮沿这些链接进入仓库，按固定 SHA 核到同名项目、相同技术栈、ADR 编号和切片编号。Juejin 账号与 GitHub 账号的绑定关系未独立核验。
- 证据类型：作者自用（非独立第三方）＋公开可核代码／配置；Juejin 文章为作者自报，仓库文件可核具体机制；未做模型或流程效果的对照。

### 真实任务

单人加 AI 编码代理，从零实现面向普通 Windows 用户的本地文档学习问答 Agent（Tauri 2 + Vue 3 + FastAPI + LangGraph + SQLite/LanceDB，云端模型 API）。仓库公开了 30 多个垂直切片、ADR、评测记录和 trace，不是只有文章构想的空仓库。

### 实际做法（可核配置，不只是文章主张）

- ADR 0007 决定日期 2026-10-22，状态“试行中”：每个实质性切片先写控制契约（用户可观察目标、最多 5 条核心不变量、禁止行为、失败语义、人工检查点、B 级决策上限）；决策按 A（可自动验证，AI 自主）／B（有方向缺算法，完成后集中确认）／C（删除、覆盖、安全边界、不可逆变化，执行前停止）分级；主路径可运行时做中途检查；交付提供证据包；负责人做 3–5 题反向解释；规则必须有生命周期和复核时点。
- AGENTS.md 把 ADR 0007 写成项目约定；`package.json` 有 `review:check`，其 `prepare` 脚本会把 Git hooks 指到 `.githooks`；`.githooks/pre-commit` 提交时跑 `quality:quick` 和 `review:check`。
- `scripts/check-reverse-explanation.mjs` 的实际门禁：只要暂存了 `backend/app/`、`frontend/src/`、`desktop/src-tauri/src/` 下的业务代码，就必须同时暂存一个状态为“已完成”的切片，且切片里有 `<!-- reverse-explanation-gate: passed N/N -->`，N≥3 且 N/N 全通过，否则退出 1。固定 SHA 下按同一判定复核，共有 16 个切片符合：018–022B、023B–029、031、036（即 018、019、020、021、022、022B、023B、024A、024B、025、026、027、028、029、031、036）。切片 037 含该标记但状态为“待人工验收”，`TEMPLATE.md` 含标记但被脚本按文件名排除，二者均不计入可通过集合。
- 文章记录了第二轮复盘后的“保留／调整／淘汰”：保留小步端到端、控制契约、A/B/C 分级、可运行检查点；调整证据包、反向解释、决策账本、完成状态、异步工作；淘汰“最终集中确认＝掌控”“测试全绿＝完成”“为低风险机械修改制造审批”“把一次现象直接变成永久流程”等。

### 谁采用、可见结果与结果证据

- 采用者：仓库所有者本人，在自己的项目里实际使用；不是第三方独立采用，也没有对照实验。
- 结果证据 1：切片 030（2026-10-26 开始，状态“已否决”）对“Agent 把‘好问题’写成‘问题本身正确’”的假设做了 5 轮 × N=10 = 50 次尝试，citation support 为 38 pass / 12 fail。人工复核发现至少 11 个样本保留了“但范围更广”的限制，属于合理近义转述，原假设不成立。
- 结果证据 2：因此 `chat-v6` 提示词撤回为 `chat-v5`；切片明确写“12/50、10/50 数字不能继续作为 Agent 质量结论”“该实验不能证明 Agent 转述失败，也不能证明 chat-v6 有效”；`scan_term` 句界修复转入 031，旧 run 保留可追溯。
- 结果证据 3：同一篇切片还记录 citation support 非通过数表面从 12/50 降到 5/50，但其中同一目标 claim 在不同批次出现 7 pass / 3 fail，不能解释为单纯质量提升；50 次零漂移也不能证明概率为零。
- 反对／撤回原因：评测判据和判官语义没有先被人工核清；后续人工复核推翻了“语义漂移”的归因，作者在切片中记录了提示词撤回，属作者侧主动撤回。Juejin 页面未显示可读评论（仅显示“6 阅读”），本轮未读到同题外部反对原文，不能确认是否存在外部反对；本项的撤回证据在作者后续切片 030，不在评论区。

### 日期与核实

- ADR 0007 决定日期 2026-10-22；Juejin 页面日期 2026-10-24；切片 030 开始日期 2026-10-26、状态“已否决”；固定仓库 HEAD 2026-10-27 09:18 +08:00；本轮核实 2026-10-27 16:05 +08:00。
- 阅读范围：Juejin 正文全文；仓库 README、`docs/README.md`、ADR 0007、切片 030、AGENTS.md 相关段、pre-commit 与反向解释门禁脚本源码。未运行仓库、未装依赖、未调用模型，未逐条重放 50 次评测。

### 仓内增量与待 dot-A 验证的未知

- 增量：一个“先写控制契约＋提交门禁＋反向解释”的真实配置样本；一个“数字变好但前提是错的”撤回样本，可直接用于决定是否采用评测驱动的提示词修改。
- 未知：控制模型是否真的减少返工，作者自报“没有对照实验”，不能把 20 多轮经历写成收益；门禁脚本只检查标记存在与 N/N，不验证问题是否真实、回答是否正确，存在“形式通过”的风险；单人项目、无外部采用；仓库根目录未见 LICENSE 文件，引用其配置前需按作者授权处理；Juejin 与 GitHub 账号绑定未独立核验。

## 指定入口：逐项读取状态

| 入口／定位 | 本轮尝试 | 结果 | 可下的结论 |
|---|---|---|---|
| [LINUX DO 最新](https://linux.do/latest) | 直接 HTTPS、HTTP、headless Chrome、WebFetch | 0 页可读；TLS 握手被断开或 `ERR_CONNECTION_CLOSED` | 无新帖、无回复、无日期可核 |
| [V2EX 程序员节点](https://www.v2ex.com/go/programmer) | 同上 | 0 页可读 | 无新帖、无回复、无日期可核 |
| [V2EX 1251873](https://www.v2ex.com/t/1251873) #32／#36 | 直接打开与列表进入 | 0 页可读 | 退出框架自报、timzaak/web-dev-skills 线索均未读，不推断 OpenSpec 现状 |
| [V2EX 1251785](https://www.v2ex.com/t/1251785) #2／#5／#12／#15 | 直接打开 | 0 页可读 | 交接修正与测试争议未读，不能核作者说法与回复是否相互修正 |
| [LINUX DO 1988118](https://linux.do/t/topic/1988118?page=2) page 2 | 直接打开 | 0 页可读 | 10-22 后是否有新回复未知 |
| [V2EX 1250974](https://www.v2ex.com/t/1250974) | 直接打开 | 0 页可读 | Treefold 后续配置／产物未读 |
| `site:linux.do/t/topic/`、`site:v2ex.com/t/` 加实际问题／项目名、`after:2026-10-21` | Bing、Sogou、Baidu 查询 | 未返回原帖或可用摘要；`site:` 查询被搜索引擎忽略或返回无关结果 | 搜索摘要也不能作为采用证据 |

## 失败证据与分类

**技术失败（网络层）**

- `curl https://linux.do/latest` 与 `curl https://www.v2ex.com/go/programmer`：`schannel: failed to receive handshake, SSL/TLS connection failed`（exit 35）；Python/OpenSSL 直连为 `SSL: UNEXPECTED_EOF_WHILE_READING`。
- 同一域名走 HTTP：TCP 连接建立、HTTP/1.1 请求发出后得到 `Empty reply from server`（exit 52），没有任何 HTTP 状态码。
- `chrome --headless=new --dump-dom`：`net::ERR_CONNECTION_CLOSED`，DOM 为空。
- 换公共 DNS（223.5.5.5、8.8.8.8）仅作诊断，仍返回与企业 DNS 相同的内网出口地址，未改系统 DNS 或网络配置；本文件不记录具体地址。
- 外部归档服务同样不可达；没有用第三方读取服务绕过访问限制。

**工具策略拒绝（不是站点拒绝）**

- WebFetch 对两个域名返回 `Unable to verify if domain ... is safe to fetch`；这是工具侧域名校验，不是站点 401／403。
- 两个站点没有返回任何 HTTP 状态码，因此不能写成“站点拒绝访问”“需要登录”或“账号权限不足”。

**搜索**

- Bing、Sogou、Baidu 可访问，但 `site:`、精确 URL、线程号查询没有返回原帖或可用摘要；没有把搜索摘要升级为原帖已读或采用证据。

## 去重核对

- 已读 `docs/collaboration/inbox.md`、`docs/13-frontier-radar.md`、`docs/research/2026-10-15-exploration-evidence.md`。
- T-Tools 的仓内基线是 10-22 读到 page 2：仍是“需求澄清 Skill＋查询／上报 MCP”的构想，有作者自用反馈、无独立采用；本轮没有取得 10-22 后的新回复，不更新该判断。
- V2EX 1251873 #36 的 timzaak/web-dev-skills 已由 dot-A 追固定源码；本轮未重做，只保留为“未读原帖”。
- context-mode、Superpowers、Taste、show-me、Hippo 等已有条目未重复；没有发现足以改变现有选择的新证据。

## 排除项（读过但不作为材料）

| 来源／日期 | 内容 | 排除原因 |
|---|---|---|
| [Juejin《用 EasyAdminBlazor + OpenCode 开发进销存》](https://juejin.cn/post/7699521390092894235)，2026-10-23 | 作者自报 13,229 行有效代码、171 个测试、约 6 小时、约 3.46 美元；代码在 `feature/inventory` 分支 | 作者账号名为“用户EasyAdminBlazor”，文中以框架方口吻介绍；本轮在 GitHub 搜到的同名公开仓库（`gudufy/EasyAdminBlazor`、`HuaFangYun/EasyAdminBlazor`）未见 `feature/inventory` 分支，前者最后推送为 2026-06；正文留有 `【待填：...】` 占位；关键结果无法公开核对，且属作者自用／宣传 |
| [Juejin《用 Codex 快一个月：额度让我犹豫，Remote 把我留下了》](https://juejin.cn/post/7700857041943986202)，2026-10-27 | Plus 额度紧、Remote 是留存理由 | 个人订阅体验，无项目结果、配置或产物；属产品留存信号，不是可试的 coding 做法 |
| [Juejin《用了 9 款 AI 编程工具后，我踩过的坑和最后的选择》](https://juejin.cn/post/7699671935220252710)，2026-10-23 | Codex 额度与擅自改代码、Claude Code 封号、ZCode 无 Chrome 能力等 | 个人自报，无原帖回复或产物；与仓内已记 Codex 过度设计等条目部分重叠，无新增可核事实 |
| [Juejin《多 Agent 权限事故复盘》](https://juejin.cn/post/7699351034399309860)，2026-10-23 | 两个 Agent 共享执行器导致误删测试数据 | 正文明确“沙箱演练，不是生产事故”，代码为合成场景；不能当真实采用 |
| [Juejin《AI 代码审查遇真实生产场景翻车》](https://juejin.cn/post/7700798335888982031)，2026-10-26 | PHP JIT／内存案例 | 文末注明“部分内容取自网络”，无可核项目或数据；不作为材料 |

## 覆盖范围、读取截止与缺口

- LINUX DO：0 页、0 条回复；最新列表、指定旧帖 page 2 均未读。
- V2EX：0 页；1251873、1251785、1250974 的正文与指定楼层均未读。
- 搜索：多组 `site:`、URL、线程号查询 0 条可用原帖结果；没有摘要可单列。
- 可读替代：Juejin 搜索结果列表（十余组关键词）与 6 篇正文或主要段落；1 项强材料，5 项排除。
- GitHub：4 组线程号 issue 搜索无相关引用；1 个公开仓库固定 SHA 阅读。
- 读取截止 2026-10-27 16:05（UTC+8）。
- 缺口：没有指定入口的任何原文，无法核 10-22 后的新回复、作者更正或退出理由；不能据此更新 T-Tools、Treefold、OpenSpec 等判断。需要可读入口（dot-A 直接读并粘贴原文，或接收端网络放行）后重跑同一组定位。技术失败与权限拒绝已分开；没有把未读写成“没有新反馈”。

## 约束执行

- 未安装或运行候选，未调用新模型，未注册账号，未发帖或评论。
- 未成功使用代理、镜像、登录态或替代身份；代理入口探测均未建立可用连接，curl 的证书校验参数只用于诊断握手失败，均未取得任何内容；没有关闭站点访问控制或改系统网络配置。
- 未读私人材料；本文件只含公开链接与公开仓库事实，不含本机路径、内网地址或凭据。
