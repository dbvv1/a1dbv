# A-API-CREDIT-ROUTING-20261103 · 按运行入口核对月度赠额与计费

> 核实 2026-11-03（UTC）。只读公开官方页面；未登录、未领取、未关联 Console 组织、未运行客户端或模型，也未读取任何账户、账单、额度或凭据。核读日不是政策生效日。主来源页面元数据自报最后更新 `2026-10-30T17:08:22Z`；Claude Code 文档为滚动页面，引用处只记页面与核读日，不把核读日写成版本号；`claude-code-action` 为 `v1`。

## 1. 先给结论

**月度赠额按“运行入口＋认证所属组织”核算，不按 `-p` 标志判断。** 四个会改变读者动作的判断：

1. **买了 Max／Ultra／Team，不能把赠额用到交互 Claude Code。** 赠额明确覆盖的是 Claude Platform 上的 Claude API（Messages／Batches）、Console Playground、Claude Managed Agents 和 Claude Agent SDK；其中 Messages／Batches、自跑的 `claude -p` 和 Agent SDK 需用关联 Console 组织的 API key。交互 Code 的终端、IDE、桌面、网页都不在覆盖清单。Free／Pro／Enterprise 不合资格；清单外的入口不因此自动覆盖；这与“能不能用 API key 登录 Code”是两件事。
2. **同一 CI 脚本换认证或换入口，余额会变。** `claude -p` 由你自己用关联组织 API key 运行，按 Agent SDK 用量抵扣赠额；换成订阅登录（含 `CLAUDE_CODE_OAUTH_TOKEN`）就消耗套餐额度；加 `--bare` 后不读订阅登录，只能走 API key、`apiKeyHelper` 或云凭据。把同一脚本搬进 `claude-code-action`，即使仍带 `-p`，也按 Claude Code 用量计，赠额不覆盖。
3. **赠额耗尽不必然停机。** 组织有已购余额或自动充值就继续从那里扣；两者都没有才停 API 请求。走 Anthropic 销售发票的组织，超出赠额的部分照常计费。赠额不结转，也不是账单上限。
4. **“GitHub Action”要限定为 Claude Code 的那个 Action。** FAQ 排除的对象是 `the Claude Code GitHub Action`；自定义 workflow 直接调 Messages／Batches，或自己跑 `claude -p`（不经过该 Action），仍分别属 Claude API／Agent SDK 用量。把两者混成一个词会让自定义 CI 误判。

| 读者问题 | 当前答案 | 直接依据 |
|---|---|---|
| 买了 Max，能否把赠额用到交互 Code？ | 不能。赠额清单覆盖 Claude Platform 的 API、Playground、Managed Agents、Agent SDK；交互 Code 不在清单。 | 覆盖／不覆盖清单；FAQ“Why can't I use the credits for Claude Code?” |
| 同一 CI 脚本换认证，是否仍走同一余额？ | 不一定。关联组织 API key 的 `claude -p` 走赠额；订阅登录走套餐；Claude Code GitHub Action 即使 `-p` 也不走赠额。 | `claude -p` FAQ；认证优先级；GitHub Actions 文档 |
| 赠额耗尽是否一定停机？ | 不一定。有已购余额或自动充值则继续；按销售发票的组织照常计费；两者都没有才停 API 请求。 | “What happens when your credits run out” |

**给读者的最小操作判断**：要让赠额抵扣，入口应是“自己运行的 `claude -p`／Agent SDK，或直接调 Messages／Batches／Managed Agents”＋关联 Console 组织的 API key，且不要用 `--bare` 配订阅令牌；走 `claude -p`／Agent SDK 时先用 `/status` 或配置确认 `ANTHROPIC_API_KEY` 是实际生效凭据——云 provider 凭据、`ANTHROPIC_AUTH_TOKEN` 或已登录的 Claude apps gateway 会话会覆盖它（见 §3 第 2 行、§5.4、§7.2）；要让订阅承担，需确认没有高于订阅 `/login` 的凭据：云 provider 凭据、`ANTHROPIC_AUTH_TOKEN`、`ANTHROPIC_API_KEY`、`apiKeyHelper`、高于 `/login` 的 Anthropic profile／federation 凭据（命名 profile、已设置的 federation 变量或 `oidc_federation` active profile），且没有已登录的 Claude apps gateway 会话（完整顺序与条件见 §5.4）。实际是否抵扣，最终看 Console Billing 的该次用量与额度条目；成功认证本身不证明赠额可用。

## 2. 必要最小替换稿

本节只给候选稿，不改正文。原页采用的另由负责人核写者与实际差量。

### 2.1 `docs/18-team-adoption.md` §5

**原句**

> **订阅赠额按运行入口核算**：Max／Ultra 每月 100／200 美元；Team 标准／高级席位各 20／100 美元，团队共享最多 500 美元。须合资格订阅满七天、领取并关联单个 Console 组织；该组织 API key 自行运行的 `claude -p`／Agent SDK 可覆盖，订阅登录仍消耗套餐额度。交互 Code、GitHub Action、IDE／桌面 Code 及第三方云不覆盖。**赠额不结转，也不是账单上限；耗尽后仍可能消耗已购余额、自动充值或按发票计费。**

（节选；原段末句“套餐更名与交互额度见 02”保留不动。）

**建议替换**

> **订阅赠额按运行入口核算**：Max／Ultra 每月 100／200 美元；Team 标准／高级席位各 20／100 美元，按席位合并、团队封顶 500 美元；Free／Pro／Enterprise 不合资格。订阅须 active and in good standing，新订阅另须满七天，由对应角色领取并关联单个 Console 组织。赠额归该 Console 组织：Messages／Batches、Playground、Managed Agents，以及用该 Console 组织 API key 自行运行的 `claude -p`／Agent SDK 可抵扣；换订阅登录仍消耗套餐额度，`--bare` 不读订阅登录。交互 Code、额外用量、Claude Code GitHub Action（即使 `-p`）、IDE／桌面 Code 及 Bedrock／Vertex／Foundry 不覆盖。**赠额不结转，也不是账单上限；耗尽后仍可能消耗已购余额、自动充值或按发票计费。**

**变化点**

- “合资格订阅满七天”改为“订阅须 active and in good standing，新订阅另须满七天”：七天规则原文只针对新订阅；现有订阅只需保持 active and in good standing。
- 补 Free／Pro／Enterprise 不合资格，避免这些计划的读者按金额表误判。
- 补“额外用量”不覆盖：原文把 Claude、Claude Code、Claude Cowork 的超限额外用量与交互 Code 并列排除。
- 把覆盖面从“`claude -p`／Agent SDK”补到原文清单：Messages／Batches、Playground、Managed Agents、Agent SDK；并保留 `claude -p` 的 API key 路径。
- 补 `--bare` 不读订阅登录：CI 里要抵赠额应使用该组织 API key；bare 下还可选 `apiKeyHelper` 认证，但它是否计入赠额未核（见 §7.1），不确认按未覆盖处理。
- Claude Code GitHub Action 后补“即使 `-p`”，直接对应当前 FAQ 原文；第三方云用官方现名 Bedrock／Vertex／Foundry。**不要把自定义 workflow 一并排除**：排除对象写成“Claude Code GitHub Action”，直接用 API key 调 Messages／Batches 或自己跑 `claude -p` 的 workflow 仍属覆盖路径。
- 金额、七天新订阅门槛、单个 Console 组织、不结转、非账单上限、耗尽后的三种续费方式均保留。

### 2.2 `docs/02-models-and-cost.md` §3

**原句**

> **API 赠额是另一笔额度**：当前 Max 每月 $100、Ultra $200、Team 共享最多 $500；不能充值交互 Code 的订阅额度。价格卡的“比 Max 多 $100”是在比较当前档位，不能据此推出同一套餐的赠额翻倍；领取、运行入口和超额计费见 [18 成本治理](../../../../18-team-adoption.md#5-成本治理)。

**建议替换**

> **API 赠额是另一笔额度**：当前 Max 每月 $100、Ultra $200、Team 按席位合并、封顶 $500；明确可抵关联 Console 组织 API key 下的 Messages／Batches、自行运行的 `claude -p`（API key）／Agent SDK，以及 Managed Agents；交互 Code、额外用量、Claude Code GitHub Action 不抵，改用订阅登录则消耗套餐额度。价格卡的“比 Max 多 $100”是在比较当前档位，不能据此推出同一套餐的赠额翻倍；领取条件、认证入口和超额计费见 [18 成本治理](../../../../18-team-adoption.md#5-成本治理)。

（引用与替换稿中的 18 链接按产物目录写成相对路径；粘贴回 02 页面时改为 `18-team-adoption.md#5-成本治理`。）

**变化点**

- “Team 共享最多 $500”改为“按席位合并、封顶 $500”，保留金额，避免读成每团队固定 500。
- “不能充值交互 Code 的订阅额度”改为“交互 Code、额外用量、Claude Code GitHub Action 不抵，订阅登录消耗套餐额度”：把“覆盖范围”与“订阅额度充值”分开，并补上同页读者最常混的两个入口。
- 补 Messages／Batches、Managed Agents 与 `claude -p` 的 API key 前提；保留原价格卡提醒和 18 的链接。

### 2.3 `docs/research/2026-10-13-cloud-spend-boundaries.md`“地区、策略交付与订阅赠额”

**结论：保留原文，不改核实日。** 该段“FAQ 区分自行以关联组织 API key 运行的 `claude -p`／SDK，与 GitHub Action、IDE／桌面发起的 Code 运行；后者即使 `-p` 也不覆盖”在当前 FAQ 中仍有依据，但 FAQ 点名的对象是 `Claude Code GitHub Action`，不是所有 GitHub Action；自定义 Action 直接调 API 不在排除范围。未用额度到周期末过期、Team 逐席金额与 500 上限、订阅登录的 SDK 用量仍消耗订阅限制，也都被当前页面支持。

**但该段是不完整的历史快照**：只写 `claude -p`／SDK，未列 Messages／Batches、Playground、Managed Agents，也未提 `--bare` 的认证区别；其“资格说明”旧 slug 已 301 到改名后的新文（最后更新 2026-10-30）。因此不据今日内容倒改 2026-10-15 的核实日，也不把旧段当完整覆盖清单。若负责人未来更新该页，按 §2.1／§2.2 的表述补差量并记新的核读日，不改写原日期。

## 3. 五组真实入口对照

| 组 | 运行入口 | 认证与所属组织／提供方 | 计费渠道 | 赠额有直接依据覆盖？ | 仍受订阅限额？ | 未知与最小下一步 |
|---|---|---|---|---|---|---|
| 1 | 自建应用直接调 Messages／Batches | 关联 Console 组织的 API key | 该组织 API 用量，月度赠额先扣 | 是：覆盖清单明列 | 否；赠额与套餐额度分开 | Anthropic 运营的 Claude Platform on AWS 未列；查该次 Console 账单条目或问支持 |
| 1 | Console Playground | 关联 Console 组织登录 | 同上 | 是：覆盖清单明列 | 否 | 无 |
| 1 | Managed Agents | API key／Console 组织 | 同上 | 是：覆盖清单明列 | 否 | 托管与自托管 sandbox 是否同账期未核；只按 API 用量处理 |
| 2 | `claude -p`（非 bare）＋关联组织 API key | `ANTHROPIC_API_KEY`；`-p` 下直接采用（云凭据、`ANTHROPIC_AUTH_TOKEN` 与已登录 gateway 会话均高于它，完整顺序见 §5.4） | 按 Agent SDK 用量计入该组织 | 是：FAQ 逐字 | 否 | `apiKeyHelper`、`ANTHROPIC_AUTH_TOKEN`／网关、无 key 的 Console OAuth 概况未明；查账单或问支持 |
| 2 | `claude -p`（非 bare）＋订阅登录或 `CLAUDE_CODE_OAUTH_TOKEN` | claude.ai 订阅 | 套餐额度 | 否：FAQ 逐字 | 是 | 具体 5 小时／周窗口见 02 §3，本卡不展开 |
| 2 | `claude --bare -p` | 不读 OAuth、系统钥匙串和 `CLAUDE_CODE_OAUTH_TOKEN`；文档列出的路径是 API key、`apiKeyHelper` 或云凭据 | 由所用凭据决定 | 用关联组织 API key 时同第 2 行；订阅令牌不可用 | 不适用（无法用订阅登录） | 云凭据走云账单，不抵赠额；`apiKeyHelper` 是否抵赠额未明（见 §7.1） |
| 3 | Agent SDK（Python／TypeScript）＋关联组织 API key | API key | 该组织 API | 是：覆盖清单与 FAQ | 否 | 第三方厂商代跑是否算原文的 “run them yourself” 未明 |
| 3 | Agent SDK＋订阅登录 | claude.ai 订阅 | 套餐额度 | 否：FAQ 逐字 | 是 | SDK 采用哪种订阅凭据未在 overview 明写；第三方产品不得提供 claude.ai 登录 |
| 4 | `claude-code-action`：`anthropic_api_key` | 该 key 所属 Console 组织 | 按 Claude Code 用量计 | 否：FAQ 明写 “even with `-p`” | 否（API 计费） | 无 |
| 4 | `claude-code-action`：`claude_code_oauth_token` | 生成令牌的订阅 | 订阅 | 否 | 是；文档写明用订阅代替 API 计费 | 令牌绑定个人订阅，跨仓库共享有账号归属问题 |
| 4 | `claude-code-action`：`use_bedrock`／`use_vertex`／`use_foundry` | 云账号 OIDC | 云账单 | 否：第三方云不在覆盖清单 | 否 | 云侧预算与限额另核 |
| 4 | `claude-code-action`：WIF（`anthropic_federation_rule_id` 等） | Console service account | Claude API | 否，按同一 Action 归类；原文未单列 federation | 否 | 若组织账单显示不同再核；不以能认证推定抵扣 |
| 5 | 交互 Code：terminal／IDE／desktop／web | terminal／IDE 用订阅登录或 Console；desktop 默认用 Claude 订阅账号（OAuth，不读 API key／环境变量）；web／cloud 固定用订阅凭据 | 套餐（desktop、web／cloud）／套餐或 API（terminal、IDE） | 否：覆盖清单明列 Interactive Claude Code | 订阅登录时是 | IDE 集成终端里手跑 `claude -p` 是否算 “IDE extension 发起”未明 |
| 5 | Bedrock／Vertex／Foundry 上直接运行 Code | 云账号 | 云账单 | 否：覆盖清单明列 | 否 | Claude Platform on AWS 未列，未知 |

**读表要点**

- **决定分类的是入口和发起产品，不只是一个标志。** 同一个 `-p`，自跑是 Agent SDK 用量，经 Claude Code GitHub Action／IDE 扩展／桌面应用发起则是 Claude Code 用量。
- **决定记账组织的是凭据。** 赠额属于被关联的那个 Console 组织；别的组织的 key、个人订阅登录都不会扣到这笔余额。
- **Claude Code Action 是“基于 SDK”不等于“按 Agent SDK 计”。** Action 文档明确说它 built on the SDK，但赠额 FAQ 仍把它归为 Claude Code 用量。
- **排除的是“Claude Code GitHub Action”，不是所有 GitHub Action。** 自定义 workflow 若直接用关联组织 API key 调 Messages／Batches，或自己跑 `claude -p`（不经过该 Action），分别属 Claude API／Agent SDK 用量，仍在覆盖路径；只有 `anthropics/claude-code-action` 启动的 Claude Code 运行按 Code 用量排除。
- **`--bare` 把订阅路径排除在外的原因是认证，不是计费政策。** 它从不读取 OAuth 凭据，所以订阅令牌在 bare 下根本不会生效；它不改变 `claude -p` 的入口分类，是否抵赠额仍看 key 是否来自关联组织。

## 4. 原句 → 当前依据 → 判断

| 位置与原句 | 当前依据 | 判断与最小改法 |
|---|---|---|
| 18 §5：“须合资格订阅满七天” | Eligibility：`Your Max, Ultra, or Team subscription must be active and in good standing.`；`New subscribers can claim once they've been on an eligible plan for seven days.`；`Free, Pro, and Enterprise plans aren't eligible.` | **修正**为“订阅须 active and in good standing，新订阅另须满七天”，并补 Free／Pro／Enterprise 不合资格。七天只约束新订阅；现有订阅保持 active and in good standing 即可。 |
| 18 §5：“该组织 API key 自行运行的 `claude -p`／Agent SDK 可覆盖” | 覆盖清单；`claude -p` FAQ | **保留并补全**：Messages／Batches、Playground、Managed Agents 同列覆盖；补 `--bare` 不读订阅登录。 |
| 18 §5：“交互 Code、GitHub Action、IDE／桌面 Code 及第三方云不覆盖” | 不覆盖清单；FAQ：`Runs started by the Claude Code GitHub Action, an IDE extension or the Claude desktop app count as Claude Code usage … even with -p` | **保留，收紧措辞**：把“GitHub Action”写成“Claude Code GitHub Action”。直接依据只点名这个 Action；自定义 Action 直接调 Messages／Batches 属于 API 用量，可覆盖。IDE／桌面 Code 的排除保留。 |
| 18 §5：“订阅登录仍消耗套餐额度” | FAQ：订阅登录时 `claude -p` 与 Agent SDK 用量 “draw from your plan's usage limits and don't use your API credits” | **保留**。 |
| 18 §5：“赠额不结转，也不是账单上限；耗尽后仍可能消耗已购余额、自动充值或按发票计费” | How the credits work；What happens when your credits run out | **保留**。三条续费路径分别有原文。 |
| 02 §3：“当前 Max 每月 $100、Ultra $200、Team 共享最多 $500” | 金额表；Team pool 说明 | **保留金额**；“共享最多 $500”建议改“按席位合并、封顶 $500”，避免读成固定 500。 |
| 02 §3：“不能充值交互 Code 的订阅额度” | FAQ：不覆盖 interactive Claude Code sessions 或超限后的 extra usage | **保留**，可精确为“不抵扣交互 Code 或额外用量”。原文是覆盖范围，不是“充值”功能。 |
| 研究页：“FAQ 区分自行以关联组织 API key 运行的 `claude -p`／SDK，与 GitHub Action、IDE／桌面发起的 Code 运行；后者即使 `-p` 也不覆盖” | FAQ 原文点名 `Claude Code GitHub Action` | **保留但按原文收窄**：直接依据只覆盖 Claude Code GitHub Action；自定义 workflow 直接调 API 或自己跑 `claude -p` 不在排除范围。该段未列 Messages／Batches、Playground、Managed Agents 与 bare，属历史不完整，不是错误。 |
| 研究页：“未用额度到周期末过期” | `Doesn't roll over. Unused credits expire at the end of each billing cycle.` | **保留**。 |
| 研究页：“合资格订阅满七天，由相应角色关联一个 Console 组织领取” | Eligibility；How to claim your credit | **保留**；“满七天”按原文理解成新订阅条件。 |
| 研究页：“订阅登录的 SDK 用量仍消耗订阅限制” | FAQ | **保留**。 |
| 研究页：“Haiku 5.5 公告与其链接的资格说明交叉确认既有金额” | 旧链接 `…for-max-and-team-plans` 现 301 到 `…for-max-ultra-and-team-plans`，页面最后更新 2026-10-30 | **保留历史记录，不刷新日期**。链接可达但内容已滚动更新；不据此断言 2026-10-15 当时的原文或金额来源。 |

## 5. 官方原文与出处

### 5.1 金额、资格与领取

金额（原文表格）：

| 计划 | 月度赠额 |
|---|---|
| Max | $100 |
| Ultra | $200 |
| Team（Standard seats） | $20 per seat |
| Team（Premium seats） | $100 per seat |
| Discounted Team plans（Nonprofit、Scientists） | $20 per Standard seat；$100 per Premium seat |

Team 说明原文：`credits for all seats are pooled into one monthly balance, capped at $500`；示例为三席 Standard 加两席 Premium 得 $260／月，池按**发放时**的席位数计算。Team 段另写明：由一位 Owner 或 Primary Owner 代表团队领取合并后的额度，最高每月 $500。

资格原文要点：

- `Active plan.` Max／Ultra／Team 订阅须 active and in good standing。
- `Free, Pro, and Enterprise plans aren't eligible.` Free／Pro／Enterprise 不合资格。
- `Seven days on the plan.` 新订阅在合资格计划上满七天后可领取。
- `Mobile subscriptions.` 可在 web、iOS、Android 订阅；领取须在 claude.ai 网页端。
- `No payment method needed.` 领取或使用不要求在 Claude Platform 绑卡。

领取角色原文：Max／Ultra 须为订阅者本人；Team 须为 Primary Owner 或 Owner；Console 组织须有 Owner、Admin 或 Billing 角色。限制原文：只能关联一个 Console 组织；每个 Console 组织只能接收一个计划的赠额；不能自行更换关联组织，需联系支持；Console 登录建议使用与 claude.ai 相同的邮箱。Team 段另说明：组织内每位持有 API key 的人都能使用余额，可用 Console 的 workspace spend limits 按项目或成员限制花费。

**依据**：[一手：帮助中心](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans)，页面可见“Updated this week”，精确时间取自元数据 `lastUpdatedDate`＝2026-10-30T17:08:22Z；核读 2026-11-03。

### 5.2 覆盖与不覆盖

覆盖原文清单：

> The credits work with any available Claude model on the Claude Platform, including:
> - The Claude API (Messages API and Message Batches API)
> - The Playground in the Claude Console
> - Claude Managed Agents
> - The Claude Agent SDK

不覆盖原文清单：

> The credits don't apply to:
> - Interactive Claude Code in the terminal, IDE, desktop, or web
> - Extra usage in Claude, Claude Code, or Claude Cowork
> - Claude on Amazon Bedrock, Google Cloud Vertex AI, or Microsoft Foundry

同一问题的 FAQ 原文：

> The credits are for building your own apps and agents on the Claude Platform. They don't cover interactive Claude Code sessions or extra usage after you hit your plan's limits.

**判断**：分界线是“Claude Platform 上的构建面”对“Claude Code 产品用量”，不是“是否有界面”。因此 Console Playground 被覆盖，而交互 Claude Code 不被覆盖；同一份 API key 也不能把交互 Code 的用量变成 API 用量。

**依据**：[一手：帮助中心](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans)，“What the credits cover”；核读 2026-11-03。

### 5.3 `claude -p` 的 FAQ（逐字）

> API credits cover `claude -p` and the Claude Agent SDK when you run them yourself with an API key from your linked Claude Console organization, because that usage is billed as Agent SDK usage. When you're signed in with your Claude plan instead, `claude -p` and Agent SDK usage still draw from your plan's usage limits and don't use your API credits. Runs started by the Claude Code GitHub Action, an IDE extension or the Claude desktop app count as Claude Code usage, so API credits don't cover them, even with `-p`.

拆开就是三条规则：

1. **自跑＋关联组织 API key**：`claude -p` 与 Agent SDK 都按 Agent SDK 用量计，赠额覆盖。
2. **订阅登录**：同一命令改吃套餐额度，不使用赠额。
3. **Action／IDE 扩展／桌面应用发起**：按 Claude Code 用量计，赠额不覆盖，带 `-p` 也不改变。

**依据**：[一手：帮助中心](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans)，“Frequently asked questions → Does this cover `claude -p`?”；核读 2026-11-03。

### 5.4 认证优先级与 bare

认证文档的优先级从高到低包括：云凭据、`ANTHROPIC_AUTH_TOKEN`、`ANTHROPIC_API_KEY`、`apiKeyHelper`、`CLAUDE_CODE_OAUTH_TOKEN`、Anthropic profile／federation 凭据、订阅 `/login`。其中命名 profile（`ANTHROPIC_PROFILE`）无论认证模式都高于 `/login`；同时设置 federation 变量（`ANTHROPIC_FEDERATION_RULE_ID` 与 `ANTHROPIC_ORGANIZATION_ID`）也高于 `/login`；未命名的 active profile 仅在 `oidc_federation` 模式时高于 `/login`，`user_oauth` 模式低于可用的 `/login`。另有已登录的 Claude apps gateway 会话位于该列表之外：它按 provider selection 处理且高于云 provider，存在时 CLI 只用 gateway token，bearer token、API key、`apiKeyHelper` 与 profiles 均不使用。与本卡直接相关的原文：

> In non-interactive mode (`-p`), the key is always used when present.

> `apiKeyHelper`, `ANTHROPIC_API_KEY`, and `ANTHROPIC_AUTH_TOKEN` apply to the CLI and the surfaces that wrap it, including the VS Code extension, the Agent SDK, and GitHub Actions.

> Bare mode does not read `CLAUDE_CODE_OAUTH_TOKEN`. If your script passes `--bare`, authenticate with `ANTHROPIC_API_KEY` or an `apiKeyHelper` instead.

> Cloud sessions always use your subscription credentials. If you set `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN` in the cloud environment, it doesn't override your subscription credentials.

> A signed-in Claude apps gateway session sits outside this list: it is a provider selection like Amazon Bedrock or Google Cloud's Agent Platform, and it outranks them. When a gateway session exists, the CLI authenticates with the gateway token even if `CLAUDE_CODE_USE_BEDROCK`, `CLAUDE_CODE_USE_VERTEX`, or `CLAUDE_CODE_USE_FOUNDRY` is set, and credential sources above such as the bearer token, API key, `apiKeyHelper`, and profiles are not used.

Headless 文档补充：

> Set `ANTHROPIC_API_KEY` before running it, because bare mode doesn't use your subscription login.

> In bare mode, Claude Code never reads OAuth credentials or the system keychain.

**判断**：在 `-p` 下，若没有更高优先级的云凭据、`ANTHROPIC_AUTH_TOKEN` 或已登录的 Claude apps gateway 会话，`ANTHROPIC_API_KEY` 会被直接采用且不询问；它优先于订阅登录、`CLAUDE_CODE_OAUTH_TOKEN` 与 profile／federation 凭据。CI 里同时存在 API key 和 OAuth token 时，key 优先；若已有 gateway 会话，则 bearer token、API key、`apiKeyHelper` 与 profiles 均不使用。`--bare` 下订阅令牌不生效，这不是赠额政策，而是 bare 的认证设计。

**依据**：[一手：Authentication](https://code.claude.com/docs/en/authentication)（Authentication precedence［含 Cloud sessions、Claude apps gateway］、Anthropic profiles and federation credentials、Credential management、Generate a long-lived token）；[一手：Headless](https://code.claude.com/docs/en/headless)（Start faster with bare mode）；核读 2026-11-03。

### 5.5 Claude Code GitHub Action 的实际认证选项

文档列出的输入与路径：

| 输入／路径 | 认证对象 | 计费渠道（文档表述） |
|---|---|---|
| `anthropic_api_key` | Claude API key（Console） | 默认路径，调用 Claude API |
| `claude_code_oauth_token` | 订阅 OAuth token（`claude setup-token` 生成） | `runs use your Claude subscription instead of API billing` |
| `use_bedrock`／`use_vertex`／`use_foundry` | 云账号 OIDC | 云账单 |
| `anthropic_federation_rule_id` 等 WIF 输入 | Console service account | Claude API（文档列为组织级免长期密钥方案） |

原文：`By default, the Claude Code GitHub Action calls the Claude API directly with your API key or OAuth token.` 产品关系原文：`The Claude Code GitHub Action is built on the SDK`。

**判断**：Action 的认证选项比“有没有 API key”多：订阅令牌、三种云、WIF 都能起步。认证能成功不等于赠额覆盖；赠额 FAQ 按“Action 发起＝Claude Code 用量”整体排除，Action 不走“Agent SDK 用量”这条路径；自跑的 `claude -p`／Agent SDK 才按它计。

**依据**：[一手：GitHub Actions](https://code.claude.com/docs/en/github-actions)（Setup、Manage costs、Advanced configuration）；核读 2026-11-03。

### 5.6 Agent SDK 的订阅路径与第三方限制

Agent SDK overview 原文：

> Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Use the API key authentication methods described in the Quickstart instead.

赠额 FAQ 则明确：订阅登录时 Agent SDK 用量仍消耗套餐限额。两者范围不同：前者限制**第三方把 claude.ai 登录做进对外产品**，后者说明**你自己运行时**订阅登录的计费归属；不能用前一句否掉后一句。

SDK 的 cost-tracking 文档另提醒：`total_cost_usd` 与 `costUSD` 是客户端按内置价格表算出的估算，不是权威账单，遇到客户端无法建模的计费规则会与实扣不同。因此不能拿 `total_cost_usd` 证明某次运行走了赠额。

**依据**：[一手：Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)；[一手：Agent SDK quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart)（API key from Claude Console）；[一手：Agent SDK cost tracking](https://code.claude.com/docs/en/agent-sdk/cost-tracking)（estimates not billing）；[一手：帮助中心](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans)（`claude -p` FAQ）；核读 2026-11-03。

### 5.7 余额行为

原文要点：

- `Refreshes each billing cycle.` 新赠额在计划付款后不久到账；年付计划按月到账。
- `Doesn't roll over.` 未用赠额在**每个计费周期末**过期。
- `Used first.` 月度赠额先于已购赠额消耗。
- `Shared across the organization.` 关联组织内所有持有 API key 的人共用同一余额。
- `Separate from your plan limits.` 赠额不改变 Claude、Claude Code、Claude Cowork 的套餐限额。
- `Visible in the Console.` 金额与到期日显示在 Console Billing 页。

耗尽原文：

> If the organization has purchased credits or auto-reload, usage continues and draws from those.

> If the organization has no other credits, API requests stop until your next monthly credits arrive. Usage is never charged to your Claude plan. To keep going, buy credits or turn on auto-reload in the Console.

> If your organization is invoiced through Anthropic sales, usage beyond the credits is billed as usual.

计划变更原文：取消、降级到不合资格计划或退款后，新赠额停止，已有赠额可用到过期；Max 升 Ultra 立即按比例补发，之后每周期 $200；Max／Ultra 转 Team 后原关联结束，Team Owner 或 Primary Owner 可在 Team 计划满七天后领取团队赠额。

**判断**：“耗尽”不是单一停机：已购余额／自动充值／销售发票是三条不同后续。赠额金额只是抵扣额度，不是账单上限；周期按计费周期，不是自然月。

**依据**：[一手：帮助中心](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans)（How the credits work、What happens when your credits run out、If your plan changes）；核读 2026-11-03。

### 5.8 六月的 Agent SDK 赠额

FAQ 原文：

> No. That credit isn't available. API credits cover the Claude API, Claude Managed Agents, and the Claude Agent SDK, and you claim it into a Console organization.

**判断**：当前月度赠额覆盖 Agent SDK，但**不是**六月那次已停的 SDK 赠额；两者不能相加，也不能把旧公告当现行资格。当前文章把“覆盖 Agent SDK”写进新赠额清单，同时明确旧赠额不可用。

**依据**：[一手：帮助中心](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans)（`Is this the same as the Agent SDK credits announced in June?`）；核读 2026-11-03。

### 5.9 直接链接的适用条款

领取流程第 4 步要求查看 `Supplemental Credit Terms`。该页：

- 标题为 Supplemental Credit Terms，生效日 2024-03-04，未另示最后更新日。
- 定义 `Credits` 为 `Usage Credits, Promotional Credits and any other credits Anthropic offers`；未定义“monthly API credits”，也未点名 Claude Code、Agent SDK、Managed Agents 或第三方云。
- Usage Credits 自 Confirmation Notice 或发行日起一个日历年到期；Promotional Credits 按发行时说明到期，未说明则一年；账户关闭时自动过期。
- 不得转让或出售，只能由赠额所属 Anthropic 账户的持有人使用；未写 Console 组织关联规则。

**判断**：月度赠额的**产品覆盖、组织关联、周期末过期**以帮助中心文章为准；条款页只补通用赠额的法律定义与转让／到期框架。不能拿条款页推出“覆盖 Agent SDK”或“可用于 Code”，也不能拿文章推出与条款页相同的有效期规则。

**依据**：[一手：Supplemental Credit Terms](https://www.anthropic.com/legal/credit-terms)，生效 2024-03-04；核读 2026-11-03。

## 6. 来源冲突、命名与账期

- **旧链接已改名。** 研究页引用的 `…for-max-and-team-plans` 现在 301 到 `…for-max-ultra-and-team-plans`；标题改为 Max、Ultra、Team。链接仍可达，但页面内容会随官方更新，旧核实日不能当成内容快照。
- **主清单与 FAQ 的分工不同。** “What the credits cover” 只列不覆盖的交互 Code、额外用量、第三方云，没有逐项列 Claude Code GitHub Action；FAQ 另用一句把该 Action／IDE 扩展／桌面应用按 Claude Code 用量整体排除。主清单不列不等于覆盖，二者不矛盾。
- **“GitHub Action”必须限定为 Claude Code 的那个 Action。** FAQ 点名的对象是 `the Claude Code GitHub Action`；自定义 workflow 直接调 Messages／Batches 或自己跑 `claude -p`（不经过该 Action），分别属 Claude API／Agent SDK 用量，落在覆盖清单。把两者写成同一个“GitHub Action”会误伤自定义 CI。
- **Google Cloud 产品名有两版。** 帮助中心写 `Google Cloud Vertex AI`，Claude Code 文档写 `Google Cloud's Agent Platform`。按同一第三方云供应线处理，不据此推断覆盖差异；未找到一页同时解释更名。
- **“Agent SDK 不得提供 claude.ai 登录”与“订阅登录的 SDK 用量”范围不同。** 前者约束第三方对外产品，后者说明你自己运行时的套餐计费；两句可以同时成立。
- **Claude Code Action 直连 Claude API，但赠额仍不覆盖。** GitHub Actions 文档描述默认用 API key 调用 Claude API；赠额 FAQ 仍按“该 Action 发起＝Claude Code 用量”排除。两者不矛盾：前者说请求路径，后者说产品分类与资金来源；不能由“直连 API”推出可用赠额，也不能把这个排除扩到自定义 Action。
- **Claude Code Action 的 OAuth 路径与赠额 FAQ 不冲突。** 前者说 OAuth 令牌让 Action 用订阅代替 API 计费；后者说该 Action 用量不抵 API 赠额。订阅计费与 API 赠额是两笔资金来源。
- **`usage credits` 与 `monthly API credits` 同名不同物。** 前者是订阅超限后的额外用量额度，后者是计划每月发放到 Console 组织的 API 赠额；文章明确“Extra usage in Claude, Claude Code, or Claude Cowork”不被月度赠额覆盖。
- **条款页与帮助中心不是同一层。** Supplemental Credit Terms 生效 2024-03-04，未提月度赠额的产品范围与组织关联；不要用条款页的“一年到期”覆盖文章写的“计费周期末过期”。
- **账期不是自然月。** 赠额随计费周期刷新；年付计划按月到账。Team 池按每次发放时的席位数重算。不要把“每月”写成“每月 1 日”，也不要把周期金额当账单上限。

## 7. 未知与最小下一步

以下组合的覆盖或记账归属官方没有直接说明，保持未知；不以“认证成功”“SDK 支持某种登录”或“同一个 key”推断赠额可用。

1. **`apiKeyHelper` 提供的关联组织 key**：文章只说 “with an API key”，未点名 helper。最小下一步：在已经发生的一次运行后查 Console Billing 条目，确认是否按 Agent SDK 用量扣赠额；不要为核验专门付费试跑，不确认就按未覆盖处理。
2. **`ANTHROPIC_AUTH_TOKEN`／LLM 网关**：认证文档把它列为独立凭据来源，赠额 FAQ 未提。最小下一步：查该组织的 Console 账单分类或问支持；不要假定与 `ANTHROPIC_API_KEY` 同判。
3. **无 API key 的 Console OAuth 登录（v2.1.242+ 的 keyless sign-in）**：它不是文章所说的 “API key”。最小下一步：若目标是赠额，改用关联组织 API key；若已用 keyless，查账单条目确认归类。
4. **Claude Code GitHub Action 的 WIF 路径在 Console 的记账归属**：覆盖按 FAQ 的 Action 产品归类为不抵；未明的是 federation 走 Console service account 时账单记到哪个组织或工作区。最小下一步：查该次 Console 账单或问支持；不以 service account 属于该组织推定赠额。
5. **Anthropic 运营的 Claude Platform on AWS**：帮助中心的排除清单只写 Bedrock、Vertex AI、Foundry，未写 Claude Platform on AWS。最小下一步：查该入口的账单归属或问支持；不要与 Bedrock 混为一谈。
6. **IDE 集成终端里手跑 `claude -p`**：FAQ 排除的是 “runs started by … an IDE extension or the Claude desktop app”；用户在终端手敲的命令是否算“扩展发起”未写。最小下一步：看 Console Billing 的该次分类；不确定就按未覆盖处理。
7. **第三方厂商用你的关联组织 key 代跑 Agent SDK**：FAQ 的条件是 “when you run them yourself”。最小下一步：向厂商与 Anthropic 支持确认账单位置；不把厂商代跑当自跑。
8. **Managed Agents 的托管 sandbox 与自托管 sandbox 是否同一账期**：文章只写产品被覆盖，未分部署形态。最小下一步：按实际 API 用量与 Console 账单核；本卡不扩产品选型。
9. **Team 席位中途增减的补差细节**：文章只给“按发放时席位计算”和一个加席示例，未写周期中降席、退款、按比例重算的完整规则。最小下一步：以 Console Billing 实际发放额为准或问支持。

**读者可自行做的核验**：在 Console Billing 看该次请求／该工作区归属哪条计费，以及赠额余额是否变化；需要账户权限的动作由读者本人执行。本卡未登录、未读取任何账单，也不提供试跑。

## 8. 边界与验证

- **只核公开官方页面**：帮助中心赠额文章、Authentication、Headless、GitHub Actions、Agent SDK overview／quickstart／cost-tracking、Manage costs、Supplemental Credit Terms。未读用户／公司代码、账户、账单、额度、凭据或私人日志；未登录、未领取、未关联组织、未调用模型。
- **不证明任何用户资格或真实扣费**：金额、角色、七天门槛是政策原文；某位读者是否合资格、是否已领取、某次请求实际扣了哪笔额度，均未验证。
- **不重做模型价格表、effort 比较、云预算全题、数据驻留或 ZDR**：这些不在本卡范围；02／18 的既有金额和推荐保持不变。
- **不改正文**：本卡只交 `facts.md`；18、02、研究页、13、地图、模板、TASKS、其他卡、接收器均未改。页面采用由负责人核写者与实际差量决定。
- **历史日期不刷新**：研究页仍保留 2026-10-15（UTC+8；UTC 2026-10-14）的核实记录；本文 2026-11-03 的核读只用于新增事实与替换候选。
- **检查（本单元实际运行）**：`python3 scripts/check_repo.py` 735 文件 0 errors；`python3 scripts/check_public.py` 对已跟踪文件 0 findings，新增 `facts.md` 另用同组模式扫描 0 findings；`git diff --check` 通过。公开扫描通过不等于无泄露，提交前仍需读一遍 diff；提交后的 `--commits origin/main..HEAD` 与身份检查由接收端执行。
