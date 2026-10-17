主线：一，发现值得做的软件；协作编辑兼三，连续修改的可靠性
改变的建议：先让用户试已有任务入口，再决定扩功能或改善入口；按真实任务选界面、状态与复用边界；同仓新增命令先比较完整命令与底层逻辑的组合成本，分步交付仍验最终结果。连续输出分开追最新状态与按序消费，真实反对不自动要求恢复旧故障。[经验]
新证据：公开需求、固定补丁与再次使用的正反反馈；Clink先采用已有入口、后改默认，并保留后续可发现性反证；2026-10-17新增Restic对完整命令复用的弃选、绑定提交的清理回执与来源映射修订，以及shadcn弹层局部修复／组件替换回执。NVDA／GitHub Desktop等链保留相反反馈与未闭合处；合并不等于采用成功、长期收益或AI效果。[一手／社区／研究]

# 产品反馈：从看懂核心结果到修改版的再次验证

## Reset Alerts：反馈与作者修改报告
观察日期：2026-10-13（UTC+8）。下列发帖日期按 GitHub 页面所示记录；页面未给出可核对的具体时间，不推定其 UTC+8 发帖时刻。

### Reset Alerts：反馈与作者修改报告 · 事实与来源

[Codex Discussion #53200](https://github.com/openai/codex/discussions/53200)：10 月 11 日，birthdays-app 介绍 Reset Alerts，希望免去反复刷新公告账号，也想增加重置准时率、月度分布等统计。10 月 12 日，挪威访客 TheodorNEngoy 说，相对日期与 PT 时间不易跨时区理解，建议显示绝对日期及访客本地时间，另提可选时区选择器。他明确只查看了网站，未测试提醒送达，并注明评论由 Codex 辅助撰写。作者当天回复称，已把文本预览改为显示用户本地时间。**[社区：第一人称自述]**

### Reset Alerts：反馈与作者修改报告 · 可采用的小建议

试用方法统一见 [15 §10](../15-task-playbooks.md#10-原型和一次性脚本)。本例支持先解决核心结果的理解障碍，附带功能请求不自动成为实施清单；这不是作者已遵循完整流程的证据。**[研究：条件推断]**

### Reset Alerts：反馈与作者修改报告 · 证据边界

本例只支持“具体试看反馈促成作者报告修改”。没有独立验证修改生效、提醒送达、持续使用收益或生产可靠性；官网静态 PT 文案也不足以验证动态本地时间预览。Codex 辅助的是评论，不能据此断言应用代码由 AI 生成；作者也未说放弃统计或实现了日期与时区选择器的全部建议。

## CodexIsland：方案、补丁与回滚
核验：2026-10-13（UTC+8）；案例为 2026-05，事件时间沿用原帖。只读公开 GitHub，未运行 Swift、安装应用或播放视频；仅作产品选择证据，不证明模型生产力或发布后收益。

### CodexIsland：方案、补丁与回滚 · 结论与建议

本例有独立需求、作者报告的方案比较与视觉 QA、固定补丁及回滚。建议先确定要减少的负担，再复用状态、版面与真实数据；改变图表编码须交代比较能力的损失，原型占位值须替换为真实结果。

尚缺初始生成模型、独立视觉 QA 原文或参与者身份，以及请求者发布后复测。可确认的 AI 作用仅为 Claude 审阅促成无障碍修正；仓库名、分支名、CLAUDE.md 及后续 Codex 分支均不证明本 PR 的生成归属。

### CodexIsland：方案、补丁与回滚 · 1. 原需求：只用一个供应商，不希望另一个继续占位

2026-05-07，用户 honeybears 在 [issue #3](https://github.com/ericjypark/codex-island/issues/3) 说明自己只使用 Claude；关闭 Codex 后，图标与 expanded 中的数据只是变暗，仍占据屏幕。他要求 compact、peek、expanded 均完全隐藏被关闭供应商的元素。

维护者 [首次回复](https://github.com/ericjypark/codex-island/issues/3#issuecomment-4394687502) 表示 idle/hovered 容易隐藏，但 expanded 如何保持整洁还需思考。

### CodexIsland：方案、补丁与回滚 · 2. 作者报告的方案比较：复用空出的区域

[PR #16](https://github.com/ericjypark/codex-island/pull/16) 描述四变体中选择 Repurpose：用腾出的半区展示仍启用供应商的模型用量/费用明细。作者给出的弃选理由为 Bloom 仅装饰、Shrink 丢失面板辨识度、Focus 范围更大且需维护两套布局。

取舍来自作者 PR 描述；计划链接指向未公开 notes，未读四套完整原型或独立比较视觉效果。

[首实现 6d54a8d](https://github.com/ericjypark/codex-island/commit/6d54a8da8f5b682838fc2a106a76071c280c7d16) 落实：供应商元素完全隐藏；使用既有本地日志的数据来源建立模型明细；删除原型的手写 `burn 18%/h` 数字；删除原型脚手架。复用的是数据来源，明细聚合与视图仍为新增。

### CodexIsland：方案、补丁与回滚 · 3. 作者报告视觉 QA 后再次变化；补丁可独立核对

[a999467](https://github.com/ericjypark/codex-island/commit/a99946775df7ad4fc9838ca69f87539eaa198516)，2026-05-10 14:37 UTC，提交说明将修改归因于视觉 QA 后的用户反馈。它将 5h/week 堆叠分区改成每模型一行的双层条形；理由是统一跨模型比例会把小用量模型压缩到近乎不可见。

源码核查位置：
- [ProviderBreakdown.swift 固定版本](https://github.com/ericjypark/codex-island/blob/a99946775df7ad4fc9838ca69f87539eaa198516/Sources/Views/ProviderBreakdown.swift)
- [CostStore.swift 固定版本](https://github.com/ericjypark/codex-island/blob/a99946775df7ad4fc9838ca69f87539eaa198516/Sources/Cost/CostStore.swift)

可以确认的实现：
- `JoinedModelRow` 按模型将 recent 与 week 数组合并，迭代 week 数组；recent 缺失时按零处理
- `OverlapBar` 对每一行计算 `weekAbsolute > 0 ? clamp(recentAbsolute / weekAbsolute, 0, 1) : 0`
- 有周数据时暗条占满行宽；亮条最小 2pt，故极小非零比例并不严格按几何比例显示
- 尾列显示该模型周绝对量（token 或美元）；最多显示四行；费用指标按周费用降序
- 逐行归一化后，跨模型绝对量须读尾列，不能再比较条长
- 本地日志 token 与 API 价格估算不等于供应商官方订阅额度；滚动 5h/7d 的本地汇总不证明与供应商限额窗口或精确账期对齐。未检查任何私有日志
- `CostStore.summarize` 在同一次事件遍历中，把 recent 累加放在 week 条件内部，且仅累加正的 token/cost；这仅支持本实现中 recent 不超过 week；未核全部时区、日志完整性、迟到事件与采样边界，也不证明供应商 API 的 5h/周窗口天然包含
- 源码所称“5h 是 today 的子集”非普遍事实：滚动窗口可跨午夜；本文依条件分支判断

[baf27cc](https://github.com/ericjypark/codex-island/commit/baf27cc18cfd19deb77d22bf25067b96b670fd12)，14:38 UTC，作者再次报告根据用户反馈把图例 `wk` 改成 `week`。实际文本修改可见，反馈是否来自原 issue 请求者未知。

作者报告与补丁可证反馈后修改，尚无独立用户再次使用成功的证据。

### CodexIsland：方案、补丁与回滚 · 4. 保留与放弃：不是所有尝试都留下

不对称轮廓在 [04abd1e](https://github.com/ericjypark/codex-island/commit/04abd1e548280f5537a7648d8ed6a12a29d9d8cc) 加入，随后由 [d43a637](https://github.com/ericjypark/codex-island/commit/d43a637dcb7cb6735157d2aca00facc1fc10cd04) 撤回。

维护者在 [最终审阅请求](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415630029) 明确说不对称轮廓已经尝试并撤回，要求不再作为遗漏追补。已核一次回滚；“两次尝试”仅为维护者说明。

### CodexIsland：方案、补丁与回滚 · 5. AI 的可见作用与最后交付

[Claude 首轮审阅](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415551546) 发现 pill 视觉隐藏条件同时依赖 `pillsVisible` 与供应商可见性，但 VoiceOver 隐藏只依赖后者。

[Claude 最终审阅](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415630454) 再次要求修正；[db8d80b](https://github.com/ericjypark/codex-island/commit/db8d80bec7b7e82c2f5b86c2f0e4495b360a120f) 将无障碍隐藏条件同步为两者组合。可证 AI 审阅促成修正，不能证明原型生成归属或普遍审阅质量。

PR #16 于 2026-05-10 15:24:47 UTC 合并：merge `1a1b4886e9b3fdbc5a38b0a3a2bbb3a0869dfc75`，head `db8d80bec7b7e82c2f5b86c2f0e4495b360a120f`，base `30305197c70ddd52bcd120ef5f06c4095c02d14e`。

PR body 的无条形成本行、5h footer 是早期说明；a999467 已恢复按 dollars 计算的重叠条。自动摘要还残留已撤回的不对称轮廓；终态须依固定源码。

维护者在 [issue #3 回报 Done 并附视频](https://github.com/ericjypark/codex-island/issues/3#issuecomment-4415686274)，issue 后于 5 月 13 日关闭。未播放视频或取得请求者确认；手工视觉 QA 清单未勾完，合并不证明运行通过。

### CodexIsland：方案、补丁与回滚 · 6. 研究记录旁证与排除

- #23→#26 有频繁 hover→常显状态的真实需求与已合并补丁；无修改后独立使用确认，不另扩正文
- #24→#33 的 Pace Guide 仍开放未合并；issue 上“Thanks a lot”不能算发布后使用效果
- #4 的非刘海屏幕与 glow 请求可支持“无需逐字增加所有请求选项”：维护者复用 Low Power Mode 并选 Compact/Notch-style 预设。仅作旁证，不进入本轮正文，避免堆案例
- CineSplash 仅见简略 PR，未取得反馈过程；image-grids 是作者自述而无外部使用链，均降级
- CodexIsland #54 确有升级后失败反馈，但属于凭证维护问题，不能冒充产品探索

### CodexIsland：方案、补丁与回滚 · 7. 采用边界

本例的支持范围见开头结论；仍不支持效率、普遍优越性或当前版本效果。后文其他项目的成功不能补足本例缺失的请求者复测。**[研究：采用边界]**

## CodexBar：发布后的理解反馈
> 核实时间：2026-10-13 16:12（UTC+8）。读取公开原帖、PR、固定发布 tag 与补丁；未构建或运行上游，未做模型实验。

### CodexBar：发布后的理解反馈 · 采用判断

本例支持 [15 §10](../15-task-playbooks.md#10-原型和一次性脚本) 的理解验收：使用者在含颜色改善的发布版仍报告符号误读，促成可选符号惯例。**[研究：采用判断]**

**关键局限**：用户未说明开启颜色或实际错误行动，最终符号版也缺复测；不能称开启颜色后失败或收益已证。**[社区：报告范围；研究：边界]**

### CodexBar：发布后的理解反馈 · 1. 原需求不是只有一种正确符号

| 原帖 | 直接证据 | 对取舍的意义 |
|---|---|---|
| [#2534](https://github.com/steipete/CodexBar/issues/2534)，WilliamK6，2026-07-31 | 升级后旧的百分比＋pace 组合消失；用户希望知道比可持续使用速度高/低多少，认可正数表示超前，也提出直接写 deficit/reserve | 耗尽时间不是同一个问题；旧符号有真实用户需求依据 |
| [#2842](https://github.com/steipete/CodexBar/issues/2842)，rsheyd，2026-08-10 | 要求正数表示储备、负数表示超用，目的是判断应放慢还是还有余量 | 同样的 pace token 名称可以指相反的语义惯例 |
| [#3428](https://github.com/steipete/CodexBar/issues/3428)，jb510，2026-09-05 | 符号含义容易忘；要求默认关闭的颜色设置，绿 reserve、红 deficit，保留符号和现有 token | 选择补充颜色，而非新增一套 token 或改变所有人的默认值 |

表内为 **[社区：用户原帖]**，取舍解释为 **[研究]**。#2842 的[后续回复](https://github.com/steipete/CodexBar/issues/2842#issuecomment-5240880100)说实际试了 Weekly pace，但显示横杠，不能写成该用户已成功使用符号版本。

### CodexBar：发布后的理解反馈 · 2. 修改、发布和另一用户的再次反馈

1. **颜色补丁合并。** [#3429](https://github.com/steipete/CodexBar/pull/3429)于 2026-09-11 合并为 `fe7a45ffab530e6b850800fd4a01ef1972709b0d`。[维护者接受](https://github.com/steipete/CodexBar/pull/3429#issuecomment-5627798767)的是窄的默认关闭选项。已读 diff 用独立数值 delta 选红绿，并修复模板图像剥离颜色的输出路径。作者报告本机、合成 native 场景及测试通过；本轮未复跑或检查图片像素。**[一手：补丁；社区：采用与运行报告]**
2. **发布版包含颜色逻辑。** `v0.72.0`解析到 [`cfee869f3181379dd074adb9feeb5f19a994356a`](https://github.com/steipete/CodexBar/commit/cfee869f3181379dd074adb9feeb5f19a994356a)。[固定 renderer](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/Sources/CodexBar/MenuBarLayoutRenderer.swift)的 `colorPace` 分支按 delta 正负取绿/红；blob 为 `5c6130c7ab7b600bbe0ee205a307c94f742f5a3c`。[UI 文档](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/docs/ui.md)明确默认关闭；[formatter](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/Sources/CodexBar/MenuBarDisplayText.swift)仍将非负 delta 显示为正数，没有符号设置参数。以上直接依据发布源码。**[一手]**
3. **另一个人实际使用后仍觉得含义相反。** LPFchan 在 2026-10-09 的 [#4386](https://github.com/steipete/CodexBar/issues/4386)注明 **0.72.0、macOS 15.7.4 arm64**：菜单栏 `+23%` 一眼像好消息，popover 却显示 deficit。他明确联系 #3429，认为颜色有所帮助但未改变符号，提出保留旧默认的可选反转。开启颜色/高对比、色觉障碍及实际超用均未报告；“很多用户”仅为其概括。**[社区；研究：范围限定]**
4. **从颜色改为可选显示语义。** [#4394](https://github.com/steipete/CodexBar/pull/4394)于 2026-10-09 合并；[固定补丁 `22372da3bac3bb0c5ea39095c6d73fb4a525f37c`](https://github.com/steipete/CodexBar/commit/22372da3bac3bb0c5ea39095c6d73fb4a525f37c)新增 `reservePositive: Bool = false`，设置缺省 false，旧惯例保留。选项进入 Session/Weekly/Auto 与 live/sample preview；内部 delta、红绿、已保存条件阈值仍保持原语义。[维护者回复](https://github.com/steipete/CodexBar/issues/4386#issuecomment-6086624183)确认合并及下版发布计划，不是 LPFchan 已升级复测。**[一手：diff；社区：维护者回复]**

### CodexBar：发布后的理解反馈 · 3. AI 参与可证范围与反例

[#2842 的 Codex 审查](https://github.com/steipete/CodexBar/issues/2842#issuecomment-5240809239)将请求判为已有 signed pace token 的重复，引用源码与测试建议关闭，但同时要求维护者 **“Close after confirming the reporter can select Weekly pace in the current layout editor”**，并在 next step 要求确认已发布 token 满足请求；没有自动关帖授权。该审查遗漏两种符号方向的差异，不能据此说机器人独自关闭 issue。**[一手：公开审查产物；研究：原意对照]**

[#3429 的审查历史](https://github.com/steipete/CodexBar/pull/3429#issuecomment-5548428504)保存了 status-item 颜色丢失的 P2 发现，最终补丁与维护者说明对应修复；[#4386 后来的审查](https://github.com/steipete/CodexBar/issues/4386#issuecomment-6074103058)则明确把符号反转视为不同偏好，要求先做产品选择。这能证明 AI 审查参与及具体产物，不能隔离独立贡献或提速。**[一手；研究：归因边界]**

两次初始实现均缺具体模型生成披露；internal/effort 不是公开模型版本，作者整体 AI 使用习惯也不能补足归属，故无当前模型效果对照。**[研究：证据缺口]**

### CodexBar：发布后的理解反馈 · 4. 成本、替代方案与停止条件

- 颜色涉及真实输出、stale/high contrast、预览、持久化、翻译及升级兼容；符号选项增加设置与双惯例。缺工时、模型费用，行数/测试数不证明净成本。**[一手：diff；研究]**
- #2534 已提出直接显示 deficit/reserve 文字；可选反转不是唯一方案，也没有与文字方案的用户比较。默认关闭意味着还可能有发现/启用成本，不据后来的反馈撤销颜色功能。**[社区；研究]**
- 显示符号可翻、条件阈值不翻，保住既有配置，但留下需要解释的双重语义。源码与文档可证该选择，尚未查到用户故障；学习负担仅为可能。**[一手；研究]**
- 符号版仍缺明确版本、设置及解释／操作结果的用户复测；取得后才续接此链。**[研究：继续条件]**

### CodexBar：发布后的理解反馈 · 5. 验证范围

已读原帖、评论、发布 tag 关键文件及合并 diff；未运行上游、检查图片像素、核验最终 release 效果或测模型。#4394 正文保留较早 head 的 queued CI 记录，不能视为合并树的独立验证。知识库本地验收结果见 [TASKS](../collaboration/TASKS.md)。**[一手：所读材料；经验：本轮检查范围]**

## 需求成立与否：试用也可以导向停止

> 主线一；核实时间：2026-10-13。本轮补录2024、2025年研究，不称其为最新研究。改变 [15 §10](../15-task-playbooks.md#10-原型和一次性脚本)的「继续改目标」为「继续、改目标或停止」，不据此新增自建/购买通则。

### 新证据：取证方法相同，是否用来检验假设不同

[Camuffo等，2024，SMJ，DOI 10.1002/smj.3580](https://sms.onlinelibrary.wiley.com/doi/10.1002/smj.3580)汇总四项RCT、759家企业。两组均学习访谈、调查、A/B等方法；处理组将理论、假设、检验与判断更新连接起来。表2第(1)列终止概率系数为0.098、robust p=.001，即增加9.8个百分点；这是调整后线性概率模型估计，不是原始均值差。终止指观察窗内结束项目，转向指价值主张或客户群重大改变，来自访谈追踪；最长16个月、其中一项9个月。转向次数的线性效应不显著，不能概括成「验证带来更多转向」。**[研究：原文RCT，§5.5–5.7、§6.1表2、§6.2]**

核对入口：[City公开存档](https://openaccess.city.ac.uk/id/eprint/32437/)的30页PDF含封面，处理差异在PDF第10页／正文印页9，定义在第12页／印页11，表2在第16页／印页15；这些是该存档预排版页码，不是最终卷期页码。**[一手：原文定位]**

### 反例：更早停止不必然更好

[Gambardella、Messinese，2025，Organization Science，DOI 10.1287/orsc.2023.18245](https://pubsonline.informs.org/doi/full/10.1287/orsc.2023.18245)将308家早期创业企业分为理论验证、主动设计/塑造条件、对照三组，追踪约一年半。设计组较理论组更少、更晚终止；全样本理论组平均收入更高，专利型想法的收入最高10%子组比较则呈相反收益方向，交互项p=.060，只是弱证据。约17%样本流失、多项指标含自报且观察期有限，不宜据此规定创新项目应坚持或一般项目应早停。**[研究：原文RCT，§3.4–3.7、§4、§5表9、§6]**

### 采用与边界

**✅ 让原型试用能够推翻想法，而不只产生新功能清单。** 两项研究比较创业培训组合与决策，未测AI编码、单条提示或自建/购买/复用。停止不自动代表判断正确；低成本原型仍可用来发现此前说不清的新需求。**[研究：迁移边界；经验：采用判断]**

若价值来自重复节省时间，可看下一次同类任务是否真的再用；一次性转换则可能完成一次就足够，不设统一需求次数门槛。试用、招募与分析也有成本，本轮未取得可用于AI原型的净成本数据。重大去留由负责人决定，不交给Agent自行撤销。**[经验：试用设计与权限边界]**

已读两篇全文的处理、结局、结果与局限，并核对2024存档PDF；未重估原始数据或运行模型、软件。自建/复用比较仍缺，下节作者替换记录也无独立使用结果。**[经验：验证范围与缺口]**


## Jules：从自建常驻服务到现成运行能力

> 核实：2026-10-13。以下是 2026 年 3 月的历史选择，不是当前云产品配置指南；只读公开材料，未运行上游或模型。

作者在[固定 v4 README](https://github.com/jonathanmalkin/jules/blob/2eadb1c453e80e6b4d034ea27a60c4a1d7a9b21c/README.md)称 Jules 是日常使用的 Claude Code 协作系统，公开仓库是脱敏参考配置；他选择停用 VPS、容器、Slack daemon，改由云计划任务和 Telegram 承接。**[社区：作者使用与选择报告]**

[3 月 30 日补丁](https://github.com/jonathanmalkin/jules/commit/2eadb1c453e80e6b4d034ea27a60c4a1d7a9b21c)确实删除 Dockerfile、compose、crontab、认证刷新、晨间编排和 Slack daemon，并移除共享设置的 `defaultMode: plan`。[次日补丁](https://github.com/jonathanmalkin/jules/commit/ff9454e198915a39d4c8fb14f972ad5b3a084645)加入云任务提示及抓取/邮件脚本：运行入口变了，个性化简报与交付逻辑仍需维护。**[一手：固定产物]**

替代并不等价：同版 README 虽概括能力相同，却明确 Telegram 交互需笔记本打开，原 Slack daemon 为 24/7；笔记本关闭时仍可用云 Web 会话，不能说所有手机访问都消失。[固定迁移指南](https://github.com/jonathanmalkin/jules/blob/27d671f26e56a1ae8e4a834e4aad9eb0cddc6213/docs/overnight-batch.md)还报告计划模式阻塞无人值守任务，耗费五次以上失败运行和一天排查。补丁支持共享设置被移除，未独立取得失败日志或耗时记录。**[社区：历史报告；一手：配置变化]**

维护减少仅为作者概括；同次还合并技能、规则与权限，较窄可用性也可能解释简化，不能按删除组件算收益。新路径仍需连接器、凭据配置、结果持久化和失败处理；公开提示的邮件 `--html` 参数与同版脚本的文件路径接口还不一致，未运行，不能据此推断作者私有部署失败。**[一手：接口对照；研究：替代解释]**

**✅ 按同一任务的必要能力与运行责任决定复用范围。** 有替代的部分减少自建；退休旧路径前，先验下一次结果的时效、可用性和失败可见性。这是迁移建议，非已观察结果；不照搬宽权限配置，代码减少也不证明安全边界改善。**[经验：采用建议]**

仍缺独立复测、成功作业和净成本对照，不能证明模型生产力或长期收益；取得真实作业/接收记录后再回访。**[研究：证据边界]**

## 模拟用户：可以帮助选测试，不能单独否决需求

核实时间：2026-10-14。已读两篇 2026 年预印本的方法、结果与局限；未运行模型。真人偏好问卷不等于产品采用。

### 真实偏好对照：不要把流畅解释当作需求证据

[Kuric 等，2026-05-18，v1，§4–6](https://arxiv.org/html/2605.18311v1)：29 项 UXtweak 实际研究、2073 名参与者、78 个视觉偏好任务；终点是自报选择，非留存或购买。GPT-4.1 基线首选一致率 53%，GPT-5.2 为 65%；差异未显著不证明等效。详细 persona 未可靠消除偏差；解释会出现忽略关键差异、泛泛赞美等问题。原始专有数据不公开；三次基线检查后各设置使用单次模拟，不能把 78 个任务或多人批次当作独立模型复跑。**[研究：原文比较结果与方法限制]**

### 行为结果对照：有预测信号，仍不能作为停做门槛

[SimAB，2026-03-01，v1，§4.3–6.4](https://arxiv.org/html/2603.01024v1)：GPT-5-mini-2025-08-07 生成人设，GPT-5-2025-08-07 对截图投票，回测 47 项已有显著结果的历史 A/B 实验，未重跑真人实验。排除两项模拟无结论后，表 1 为 TP=22、FP=9、FN=6、TN=8；高信心子集更准，但作者承认置信度属启发式、同批 persona 不独立。静态截图不涵盖加载性能、动态交互及用户跨会话重复使用。**[研究：历史行为回测]**

本仓 Python 算术复核：正确 30/45=66.7%，全部选 Challenger 则为 28/45=62.2%；若按模拟判负淘汰，则会丢掉这 45 项中 28 个真实 Challenger 胜者的 6 个（21.4%）；这是筛选政策的反事实，不是已观察的团队淘汰行为。样本预选真人显著案例，不能估计无效改动误报率；模拟显著也不是收益概率。正文未排除历史答案污染或独立校准置信阈值。上述为本仓复算与判断，非作者对照。**[研究：复核与推断]**

### 改变哪项开发决定

**🧪 用 Agent 扩展候选、提出反例和安排真人验证顺序；⛔ 仅凭模拟投票决定无人需要或停止原型。** 将输出改写成可核查问题：目标用户能否理解结果、能否完成那条实际任务、是否愿意再次使用。能够通过确定性检查发现的坏链接、丢失输入等缺陷，可以先修；“用户不喜欢”仍须真实反馈。**[经验：从两种不同终点迁移的建议]**

只有低代价、可撤回的候选排序，可把模拟结果当作暂时线索；删除必要路径、停止产品或面向新群体/交互，仍须真人证据。若希望以后让模拟承担更强筛选，应先在目标领域以未用于调整提示的真人案例校准，包含无差异案例，并检查被否决的真实赢家；这是一项待验证条件，不是已证实的通用流程收益。**[经验：采用边界]**

本轮仅复核公开聚合数字，未运行模型、取得私有问卷或复现全量基准。结论不推广到未来模型，也未比较产品负责人判断。续接应补前瞻、同领域、含无效改动和误淘汰记录的真人对照。

## 原型复访：尚无机会不等于不值得使用

核实：2026-10-14（UTC+8）；主线一，补 15 §10 的复访判据。**[研究：本轮原文阅读，未运行模型或取得私人轨迹]**

[Motif v1，2026-07-12，§5–6.5](https://arxiv.org/html/2607.10531v1)报告 8 人试用浏览器自动化，6 人在 2–4 天后回答问卷，涉及 18 个保留的程序。短期自报区分再次使用、觉得无益与尚无机会；重复已有按钮、干扰原功能或一次捆绑过多动作的程序，被报告为较不愿继续使用。动作复现正确不等于有用。**[研究：作者报告的真人观察与自报，非本仓复现]**

**建议**：按 15 §10 区分尚无机会、无益与故障；本例仅为复访判据提供短期自报依据。**[经验]**

**局限**：自选程序、小样本、短观察，无逐脚本“修改→复用”链；不能据意愿或四舍五入比例推出长期留存、客观省时。两种工具的操作时长和任务不等，不能排名。全文汇总数字也有不一致，本节不据此重算成功率。此建议不要求安装 Motif 或全面采集行为；论文承认隐私和脚本安全风险。**[研究：解释范围]**

## 修改版再使用：可见性改善仍须通过真实任务

核实时间：2026-10-14（UTC+8）。[CodeAid 固定 v2（2024-02-25）](https://arxiv.org/html/2401.11314v2)及[同版 PDF](https://arxiv.org/pdf/2401.11314v2)，重点核对 §4–6、表2和 §9；这是历史 AI 产品演化研究，不是当前模型评测，也未证明实现代码由 AI 生成。**[研究：来源与边界]**

**实际链条。** 学生要求定位出错行；作者据期中访谈与问卷，将 Help Fix Code 改为标出修改、删除和新增行，并提供悬停解释（§5、§5.1.5）。表2记录修改版263次使用，平均有用性2.38，旧版2.88；次数不是人数，表中未另列评分样本数。§6.2.5报告学生认可新标注，同时反映后期长代码及多文件任务仍难用。可确认同产品修改后被实际使用，不能确认原请求者逐人复测或任务成功率。**[研究：作者报告的部署数据及用户反馈，非本仓复现]**

**不能归因于改版。** 模型和提示也变了，课程任务随时间变复杂；这是单校自愿使用，不是随机版本对照。每周问卷有成绩激励，应用内评分是再次使用前的必填项（§4）。慢响应是改版前反馈；未取得更新前后延迟、人工工时或费用测量，不能说新标注导致变慢或评分下降。**[研究：设计限制与因果边界]**

**对15的净增量。** 15 §10 已分开验收“看清修改”与“完成原任务”；这不是最佳方案证明，评分也不足以否定行级标注或推荐另一模型。**[经验：采用建议]**


## OpenWhispr：选项出现后仍须核对实际参数

核实：2026-10-14（UTC+8）；事件时间以下用 UTC。主线一，补 15 §10 的故障诊断分流。这里只研究通用产品迭代，不证明原型或该修复由 AI 生成，也不作模型能力排名。**[研究：范围]**

### 需求、改版与同一用户再次使用

- 原请求者 AmosDinh 在 [2025-09-05 的问题](https://github.com/OpenWhispr/openwhispr/issues/23)中要求同时识别两种语言；[2025-09-10 补充](https://github.com/OpenWhispr/openwhispr/issues/23#issuecomment-3274323323)：德语被当成英语，使应用不能满足需要；当时使用 macOS 自带听写，并提出语言切换作为备选路径。**[社区：使用报告]**
- [另一用户 TGRRRR，2026-02-03](https://github.com/OpenWhispr/openwhispr/issues/23#issuecomment-3840700648)：Parakeet 能在同一段录音中保留两种语言和夹杂词。目标是多语转写，不能用翻译成单一语言替代。**[社区：报告；研究：任务解释]**
- 维护者[请两人在 v1.4.1+ 复测](https://github.com/OpenWhispr/openwhispr/issues/23#issuecomment-3865899295)后，TGRRRR 于 [02-08 回报](https://github.com/OpenWhispr/openwhispr/issues/23#issuecomment-3867048197)：选择器出现了，但 Whisper 自动模式仍输出英语；Parakeet 自动模式保留混合语言，且旧版已如此。用户比较了模型与语言模式，未把“出现控件”当任务完成。**[社区：同一使用者的前后自报]**
- 维护者 [02-12 23:36 称 v1.4.7+ 已解决](https://github.com/OpenWhispr/openwhispr/issues/23#issuecomment-3893977482)；TGRRRR 在 [02-13 00:12 明确确认](https://github.com/OpenWhispr/openwhispr/issues/23#issuecomment-3894084557) Whisper 的自动模式现在也能正确工作。这是报告失败的同一用户复测，不是原请求者 AmosDinh 的复测，也不是长期留存。**[社区：修改后使用报告]**

### 可见补丁及版本冲突

[固定修复 fc1336e，02-12 18:39](https://github.com/OpenWhispr/openwhispr/commit/fc1336ecf4dbc75878f63cef467a478d4eef9bc1)只改 `src/helpers/whisperServer.js`：旧代码遇到 `auto` 会省略语言参数；新代码在启动 whisper-server 的命令参数和 HTTP multipart 请求中都显式传入语言或 `auto`。提交说明将缺省英语识别为原因，关联的是另一个 issue #260；不能说补丁直接引用了 #23。**[一手：固定补丁]**

版本不能照抄回复：[v1.4.7 源码](https://github.com/OpenWhispr/openwhispr/blob/v1.4.7/src/helpers/whisperServer.js)仍有两处排除 `auto` 的条件；[v1.4.8 源码](https://github.com/OpenWhispr/openwhispr/blob/v1.4.8/src/helpers/whisperServer.js)才含上述修改。[v1.4.8 发布记录](https://github.com/OpenWhispr/openwhispr/releases/tag/v1.4.8)的 API published_at 为 02-12 23:28:55 UTC，早于成功回复。用户未给精确安装版本、音频和模型配置，所以只能连接“相符机制＋随后成功自报”，不能把单个提交当已隔离验证的因果解释。补丁说明虽写 CLI/HTTP 两条路径，实际改动是服务器启动参数与请求，不据此宣称另一个独立 CLI 转写实现也被修改。**[一手：tag/API；研究：归因边界]**

### 对建议的净增量与停止条件

本例为 15 §10 的参数／默认值检查提供机制依据：控件可用仍可能未启用所需能力，不能据此判定模型上限。**[经验：条件建议]**

只读原帖、提交、发布 API 和两个 tag；未运行应用或模型，无准确率、投入或长期采用测量，不作产品推荐。后续须有精确版本/输入的独立复测或真实采用取舍才扩展。**[研究：验证边界]**


## Home Assistant：字段保留与原操作路径是两回事

核实时间：2026-10-14（UTC）；以下行为链限定于 2026-01 至 05 月。只读公开 PR、评论和固定提交，未运行 Home Assistant、未检查用户实例，未做模型对照。**[研究：范围]**

### AI 辅助改版，人的设计选择

[初版 #29186](https://github.com/home-assistant/frontend/pull/29186)将 more-info 内联属性折叠面板移到三点菜单中的独立 Attributes 子视图；理由是突出主要信息，其他属性仍可经两次点击访问。PR 披露由 Claude Code 生成；作者在[02-17 回复](https://github.com/home-assistant/frontend/pull/29186#issuecomment-3913593252)明确设计决定由本人负责，并承认低估了同时查看 state 与 attributes、以及移动端触摸目标的需求。不能把人的产品取舍归因为模型错误。**[一手：PR 与作者归属声明]**

[01-27 合并补丁 `08ee742`](https://github.com/home-assistant/frontend/commit/08ee742233657d47aad95d2602256e2d9dd3a967)删除多个 controls 内的 `ha-attributes`，新增属性子视图与菜单接线；`more-info-default` 的渲染变为 `nothing`。这是可核验的界面结构变化，不是运行复现。PR 的测试计划只列属性入口、子视图显示及实体类型，没有列原工作流的并看任务；未勾选只说明记录状态，不能证明作者没有测试。**[一手：固定补丁与计划；研究：验证边界]**

### 独立反馈改变了什么需求

- [Renegade605](https://github.com/home-assistant/frontend/pull/29186#issuecomment-3867230773)报告原折叠面板已能隐藏不想看的内容；改版却使需要它的人不能同时看状态与属性。这里的目标是并看信息，不只是找到字段。**[社区：使用者自报]**
- [Mariusthvdb](https://github.com/home-assistant/frontend/pull/29186#issuecomment-3912896048)报告手机上多次误触、走错路径，并区分普通生日等附加信息与原始开发者数据。将所有信息移至开发工具不是其接受的替代。**[社区：使用者自报]**
- [verjager](https://github.com/home-assistant/frontend/pull/29186#issuecomment-3912862626)说明电话传感器的号码、时长及模板实体列表/字典需要快速查看；同时指出其他跳转实体场景可以接受新方案。不能把这些反馈概括为所有人反对改版。**[社区：场景区分]**

### 恢复承诺、关闭提案与真正合入的替代版

作者[02-18 总结](https://github.com/home-assistant/frontend/pull/29186#issuecomment-3919566144)拟恢复主视图折叠面板、保留新视觉，并只在没有面板时提供菜单入口。[恢复提案 #29705](https://github.com/home-assistant/frontend/pull/29705)确有实现，但 **merged=false**；02-25 [关闭说明](https://github.com/home-assistant/frontend/pull/29705#issuecomment-3958315217)改称将采用另一方案。其 head `bd7c9f9bb5c775a34e31e7cbec2b0bd32aa75708` 是提案快照，不是已交付回滚；关闭或临时 merge SHA 不能当成功恢复。**[一手：PR 元数据；社区：维护者说明]**

真正于 02-25 合入的是 [#29811](https://github.com/home-assistant/frontend/pull/29811)，[固定补丁 `efd51d2`](https://github.com/home-assistant/frontend/commit/efd51d22344485beda9346f2f6d5407e980d625b)把子视图改名 Details，加入翻译后状态、原始状态及全部属性，菜单始终提供入口。**它补回了 Details 内的状态与属性同屏显示，但没有恢复原内联路径。** 不应把第二版继续描述成完全无法同屏对照，也不能把“恢复提案”与该替代版混成同一个产物。**[一手：固定补丁；研究：功能区别]**

### 第二版反应与后续真实行为

- [02-26，verjager](https://github.com/home-assistant/frontend/pull/29811#issuecomment-3967262381)仍提出电话状态与号码需要像原来一样快速弹出，要求直接进入 Details 的动作；评论未给安装版本，不能据日期称为发布版独立复测。**[社区：改版反馈；研究：版本边界]**
- [03-07，Mariusthvdb](https://github.com/home-assistant/frontend/pull/29811#issuecomment-4016031286)说明状态已在新页出现，但换名称与访问路径仍不便，认为新增状态重复了原先已能一起看的信息；同时认可开发工具入口。这支持“补齐字段组合，仍可能没保住操作路径”，不是否定所有新增能力。没有精确安装版本或任务计时。**[社区：第一人称反馈]**
- [05-07，Renegade605](https://github.com/home-assistant/frontend/pull/29186#issuecomment-4397884447)明确报告：此前延迟升级，但其他内容出现问题，已不能继续延迟；更新后又受到这些改动对工作流的干扰。其“三个大版本”是本人说法，未给前后版本号、故障日志或回退方式。这是同一需求后的真实采用约束与负向再次使用自报，不是已经完成的恢复，也不能量化损失。**[社区：行为结果；研究：边界]**

### 对 15 的净增量与停止条件

本例支持 15 §10 的原路径验收：数据仍可得，操作组合却改变。单个绕行、延迟升级报告不能估算整体留存。**[经验：窄建议与边界]**

这条历史链不代表 2026-10 的现状。检索已发现后续 [#53920](https://github.com/home-assistant/frontend/pull/53920)继续调整 Related/Details；当前开发分支 `9ca8f2e98be16f823c7c9e6113cc6c7545db7aee` 的[对话框](https://github.com/home-assistant/frontend/blob/9ca8f2e98be16f823c7c9e6113cc6c7545db7aee/src/dialogs/more-info/ha-more-info-dialog.ts)和[Details](https://github.com/home-assistant/frontend/blob/9ca8f2e98be16f823c7c9e6113cc6c7545db7aee/src/dialogs/more-info/ha-more-info-details.ts)也已演化。未验证当前发布版全部入口或原用户恢复情况；建议限于上述历史行为。未找到复测不等于不存在，取得对应版本的操作或采用结果后再续接。**[一手：当前源码入口；研究：停止边界]**

## Zotero：结果预览与原编辑入口如何取舍

> 核实时间：2026-10-15（UTC+8）。这是 **2024 年的历史产品选择机制**，不是近期创新或 AI 效果案例。读取公开原帖、PR 讨论、固定合并补丁与测试源码；未安装、构建或运行 Zotero。**[研究：核验范围]**

本例支持 15 §10 区分辨认、核对与编辑；派生结果适合检查，未必适合辨认或反写，多模式须有任务差异。**[经验：采用判断]**

### 从具体任务到修改版操作

1. **原任务。** migugg 在 [2 月 1 日](https://forums.zotero.org/discussion/comment/454025/#Comment_454025)要求 Info 折叠后仍显示作者、年份和标题；[2 月 7 日](https://forums.zotero.org/discussion/comment/454666/#Comment_454666)说明要逐项检查某作者的标签、关联，同时保留条目身份信息，并建议把显示与编辑分开。[Greg](https://forums.zotero.org/discussion/comment/456504/#Comment_456504)另提出折叠后仍需作者和年份。**[社区：用户原帖]**
2. **修改与明确归因。** [维护者公告](https://forums.zotero.org/discussion/114422/available-for-beta-testing-customizable-item-pane-header)于 5 月 16 日明确感谢上述反馈，介绍可选标题区并恢复 Info 内的 Title 字段。[PR #3791](https://github.com/zotero/zotero/pull/3791)已于 5 月 10 日合并为 [`59b1d75b98eecd2e910a18a8f77b81b44091dd93`](https://github.com/zotero/zotero/commit/59b1d75b98eecd2e910a18a8f77b81b44091dd93)，父提交 `8278140492f16392eadac3c2062bb372020361cd`；[固定默认值](https://github.com/zotero/zotero/blob/59b1d75b98eecd2e910a18a8f77b81b44091dd93/defaults/preferences/zotero.js#L77-L79)仍为 `title`。**[社区：维护者归因；一手：补丁]**
3. **修改版实际任务。** [migugg 当天报告](https://forums.zotero.org/discussion/comment/463100/#Comment_463100)选择书目模式后，能在 Info 折叠时直接核对书目是否正确、完整。这是原请求者核对书目的修改版自报，缺 beta SHA、计时、样本数及长期留存；不能补成原先逐项检查标签也已复测成功。**[社区；研究：结果边界]**

### 同一呈现的反证与停止扩写

[mjthoraval 的反馈](https://forums.zotero.org/discussion/comment/463196/#Comment_463196)认为紧凑模式易扫读却缺刊物和类型，而书目模式难以快速抽取信息。[维护者](https://forums.zotero.org/discussion/comment/463198/#Comment_463198)提醒它只显示所选样式输出的内容；[另一回复](https://forums.zotero.org/discussion/comment/463102/#Comment_463102)拒绝把书目模式设为所有人的默认。核对输出与辨认对象是不同任务；这些自报不是受控比较或总体偏好。**[社区；研究：选择边界]**

PR 曾考虑让用户编辑格式化书目并反写元数据。[维护者](https://github.com/zotero/zotero/pull/3791#issuecomment-1978795985)指出作者、缺失字段等问题；[实现作者](https://github.com/zotero/zotero/pull/3791#issuecomment-1979040500)补充大小写、破折号和本地化日期的反向映射不清楚，同意仅做预览，不复制 Info 编辑器。[固定实现](https://github.com/zotero/zotero/blob/59b1d75b98eecd2e910a18a8f77b81b44091dd93/chrome/content/zotero/elements/paneHeader.js#L187-L310)中，Title 和 Title/Creator/Year 仍可编辑标题，Bibliography Entry 是派生显示；不能概括成全部标题区只读。**[一手：设计讨论与源码]**

### 维护成本与验证范围

- 预览仍有维护面：[固定实现](https://github.com/zotero/zotero/blob/59b1d75b98eecd2e910a18a8f77b81b44091dd93/chrome/content/zotero/elements/paneHeader.js)处理条目修改／删除的缓存失效、样式／语言切换、缺失样式回退和复制语义。省去第二套编辑器仍有成本，代码量不能换算节省工时。**[一手；研究]**
- [固定测试](https://github.com/zotero/zotero/blob/59b1d75b98eecd2e910a18a8f77b81b44091dd93/test/tests/itemPaneTest.js#L80-L145)覆盖条目、样式、语言变化及缺失样式回退。仅阅读断言，未执行上游测试；知识库离线检查不证明 Zotero 运行或使用收益。**[一手：测试源码；研究：验证边界]**
- [PR 作者](https://github.com/zotero/zotero/pull/3791)报告某些样式曾很慢，缓存改善后仍需低资源设备测试。这是作者观察，缺标准计时与净成本数据，性能提升未独立验证。**[社区：作者自报]**
- 若主要任务是辨认，或预览挤占空间、显示陈旧、妨碍修改，应重新比较紧凑摘要或原路径。续接须有对应版本的连续操作、使用或性能数据；赞美不补长期采用，本例不证明 AI 生产力。**[经验：撤回与续接条件]**


## 替换哪一段工作流：Segment与Tract的范围选择

核实：2026-10-15（UTC+8）。主线一；改变 15 §10 的实施起点：给 Agent 的任务可以是保留现成系统、补一段接口，而非默认实现完整替代品。下列是历史机制与回溯报告，不是当前市场需求或 AI coding 效果实验。

### 已使用的部分，不一定是作者想卖的完整产品

Segment 联合创始人 Peter Reinhardt 的[原文](https://rein.pk/finding-product-market-fit)（2016-03-06）记述：团队为了给自己的分析产品拉用户，把既有多服务数据分发代码整理为 analytics.js；2012 年底撤回原分析服务方向，转向数据路由。原文链接的[早期固定源码](https://github.com/segmentio/analytics.js/blob/f56b2932cd08e7b74e384b4ffc270a759398f91a/analytics.js)可核查产物，不把后来的成熟平台倒算成首版。**[一手：作者原文与源码；社区：回溯行为报告]**

[2018 年 YC 原访谈逐字稿](https://www.ycombinator.com/blog/peter-reinhardt-on-finding-product-market-fit-at-segment)的 09:28 段进一步说明：跟进时客户已使用路由库，却仍不肯加入作者分析服务的 API key；12:58 段区分“要功能却不用”和“已经用起来再要求下一项”。02:50 段也揭示窄库的不足：开通新下游工具还要重新编译、部署，真正想操作的是营销或产品人员，后来转向托管。**[社区：创始人对接收行为及后续需求的报告]** 这是同一团队的补充，不能算两个独立成功样本；没有取得这些早期客户的原始日志或逐一复访，不能据此证明长期留存，也不照搬受访者“开源无法做好”的概括。

### 保留旧工具，不等于接口没有代价

固定版本的 `track`（L157–163）把事件与复制后的属性分发给启用的 provider；但 Google Analytics 适配（L218–220）只发送固定分类 `All` 和事件名，不转发 `properties`，KISSmetrics（L262–264）则会传递属性。**[一手：静态源码]** 统一调用并非无损兼容，仍须逐目的地核语义。

通过 Algolia API 读取 [2012-12-12 首发原帖](https://news.ycombinator.com/item?id=4912076)及回复：Snowplow 的 alexdean [指出这种事件映射不能表达各家完整数据](https://news.ycombinator.com/item?id=4912581)，作者 ianstormtaylor [回应还在设计映射](https://news.ycombinator.com/item?id=4914821)；mguterl [报告自己已在 Rails 后端使用另一包装库 analytical](https://news.ycombinator.com/item?id=4912353)。**[社区：原始技术反馈与实际替代使用自述]** 前者为代码审阅，非部署复测；后者可证已有替代，不证明 analytics.js 更优。点赞、星数与贡献意向不证明价值，评论中的计划不证明合入。

### Tract：缩到一个文档，也未必形成独立采用边界

Jamie Rumbelow 与 Henry Dashwood 的[2025 年 4 月联合复盘](https://buildwithtract.com/)报告：Tract Source 的访谈对象抱怨现成工具，却仍认为够用；后来 Editor 从通用编辑器缩到 pre-app 文档草稿，设计伙伴给予正面反馈，真正谈承诺时仍要求完整 planning statements 等更多功能。团队最终停止，理由还包括收入、销售周期和融资规模约束。**[社区：当事人交付、反馈与停止报告]**

同一复盘报告 Scout 有重复使用者，公司停止不代表所有工具无用；文档草稿范围小也不证明可独立采用。本轮未取得设计伙伴独立回复、编辑器源码或使用日志，不将作者的质量评价、市场判断或关闭决定写成已验证因果，更不把 VC 回报要求套到个人工具和小生意。**[社区；研究：边界判断]**

### 落到 Agent 的任务与撤回条件

范围比较与撤回条件统一见 15 §10。没有迁移仍须区分权限／成本／时机与收益；技术接通不消除原合同、隐私限制，也不证明下一环节实际采用。**[经验]**

实际验证：读两组创始人原文／访谈、首发评论与固定 JS 源码；未运行该库、外部模型或任何用户业务。Segment 的旧《From Show HN to Series D》及维护博文直接访问重定向到 Twilio 分类页，本轮只见检索缓存，不用于证明持续 API 流量或后续修补；GitHub 未认证 issues API 受速率限制，未据此宣称已穷尽早期用户记录。两例机制不同，不证明局部补充一定更成功。

## LocalSend：省掉完成点击后，为何收窄自动结束

核实：2026-10-15（UTC+8）。主线一；改变 15 §10 的一项选择：减少操作不等于无条件自动结束；失败时若仍需恢复，应收窄自动化，而非只补一个重试控件。以下是历史用户反馈与固定实现，不是 AI 效果实验。

### 原需求、发布后禁用与再次修改

1. **省点击也要解除下一次任务的阻塞。** [#923](https://github.com/localsend/localsend/issues/923)转引 mensa84 的请求：成功传输后自动关闭接收对话框，少点一次。arnabs542 [补充实际困扰](https://github.com/localsend/localsend/issues/923#issuecomment-1826376539)：忘记关闭后，再发文件会提示接收器忙。[首版固定接收器](https://github.com/localsend/localsend/blob/2acfc07159b75fb6c0e5c86c2cd77b61543877d2/app/lib/provider/network/server/controller/receive_controller.dart#L185-L188)只要会话仍存在，就拒绝新请求并返回 HTTP 409；因此不只是装饰性精简。**[社区：原使用报告；一手：源码]**
2. **有可核查的交付。** [2acfc07](https://github.com/localsend/localsend/commit/2acfc07159b75fb6c0e5c86c2cd77b61543877d2)新增默认关闭的 Auto Finish；接收完成后，满足该选项或 Quick Save 且不是消息会话时，安排关闭会话并回到接收首页。[v1.13.0](https://github.com/localsend/localsend/releases/tag/v1.13.0)于 2023-12-05 UTC 发布。Auto Finish 与自动接受请求不是同一个操作，不能把省掉完成点击写成取消接收授权。**[一手：补丁与发布记录]**
3. **用户实际禁用了省步功能。** sergd88 在 [#994](https://github.com/localsend/localsend/issues/994)提出发送端也应自动结束。EdwardWilsonJr 的[使用反馈](https://github.com/localsend/localsend/issues/994#issuecomment-1842653145)称立即消失看起来像传输被切断；GarryOneW00d 于 2023-12-06 [明确说试过后关闭了该功能](https://github.com/localsend/localsend/issues/994#issuecomment-1843057315)。后者是采用行为自报，不只是“希望更好看”；两人未给出精确客户端版本或运行日志。**[社区]**
4. **作者保留自动结束，调整交互。** [#1008](https://github.com/localsend/localsend/pull/1008)明确关闭 #994；[b06ea9d](https://github.com/localsend/localsend/commit/b06ea9d04ac3ef181a8d9ae68cd114301f2c921e)把 Auto Finish 从接收控制器移到进度页，使用从 3 开始的周期计数，并让发送／接收共用退出处理。[v1.13.1 的源码](https://github.com/localsend/localsend/blob/v1.13.1/app/lib/pages/progress_page.dart)包含这项修改。不能据此断言精确等待时间总是三秒，或某个倒计时对所有任务最优；Quick Save 的接收关闭分支仍另行保留。**[一手：补丁与发布源码；研究：范围限定]**
5. **后来用户发现省步与恢复冲突。** 2024-08-20，sergd88 在 [#1671](https://github.com/localsend/localsend/issues/1671)报告新版虽增加 Retry，开启 Auto Finish 后却来不及点击，要求失败时忽略自动结束。他也是 #923 的早期反馈者和 #994 的提出者，不能写成三个独立样本；未提供精确运行版本或成功重试日志。维护者的[回执](https://github.com/localsend/localsend/issues/1671#issuecomment-2298474064)直接指向 [caab80f](https://github.com/localsend/localsend/commit/caab80f6634905d07e7c006a170e6c02c9c5a0bb)。**[社区：再次使用反馈；一手：对应修订]**

### 固定产物：失败时撤回自动省步

caab80f 在进度页同时修改接收会话和发送会话的状态集合判断：旧 `isFinishedOrError` 接受每个文件属于 skipped、failed 或 finished；新 `isFinishedOrSkipped` 只接受 skipped 或 finished。只要被检查的文件中仍有 failed，就不再满足自动结束条件。源码仍保留“会话不存在则为 true”的回退，不能概括成所有退出路径都已统一或任何故障都不会关闭页面。**[一手：静态源码]**

[2024-11-03 发布的 v1.16.0](https://github.com/localsend/localsend/releases/tag/v1.16.0)的[进度页](https://github.com/localsend/localsend/blob/v1.16.0/app/lib/pages/progress_page.dart#L70-L74)已包含两条状态路径的新判断。这是缩小已有自动化的适用范围，没有为此再加一个重试控件；不能仅因 issue 关闭就声称用户已恢复。**[一手；研究：机制判断]**

### 采用判断与验证边界

15 §10 据此按成功／失败状态选择结束条件，不统一推荐倒计时或新状态框架。**[经验]**

实际验证：读取原帖、评论、三份固定补丁及发布 tag 源码；固定版本 [LICENSE](https://github.com/localsend/localsend/blob/caab80f6634905d07e7c006a170e6c02c9c5a0bb/LICENSE)为 Apache-2.0，本记录只概述行为并链接来源，未复制实现。未安装或运行客户端，未测试任何设备／模型。未找到最后修订版的重新启用、成功重试或主动工时下降回执，收益仍未证。当前维护性另核到 2026-10-10 的主线提交 [14f3a87](https://github.com/localsend/localsend/commit/14f3a87426eedffaa9d87d011132eca5501abeb8)，不把当前维护活动当作历史功能效果证明。


## Metabase：同屏条件与分步预览的竞争取舍

核实：2026-10-15（UTC+8）。主线一；修订 15 §10 的界面选择：需要持续对照不等于所有任务都保留常驻编辑栏，真正的阶段依赖可用步骤与局部预览表达。以下为 **2019 年历史改版**；只读公开原帖、固定发布源码，未运行客户端，不评价当前 Metabase 或 AI 效果。**[研究：范围]**

### 原任务与设计理由

[5 月原帖](https://discourse.metabase.com/t/joins-in-metabase/6260)询问图形界面如何关联表，回复区分既有 SQL 与即将加入的 notebook 路径。[6 月试用者 MarkRx](https://discourse.metabase.com/t/preview-upcoming-changes-to-the-gui-query-builder-updated/6551/5)认可关联能力，同时提出查询与结果同屏有用、阶段归属应更清楚。[7 月设计者回应](https://discourse.metabase.com/t/how-can-i-give-feedback-on-33-beta/6859/4)说明旧栏难容纳更多过滤、指标和分组，拆成 simple／notebook 可给复杂构建与结果更多空间。这些分别是任务、使用反馈与设计理由，不能把新增 join 能力当成纯布局收益。**[社区：原帖与设计者解释]**

另一个明确取舍是查询条件放在哪里：[设计者 #50](https://discourse.metabase.com/t/preview-upcoming-changes-to-the-gui-query-builder-updated/6551/50)希望标题、图例、坐标与表头承担指标和分组的解释，使默认视图更简洁；同帖 [mangefager #42](https://discourse.metabase.com/t/preview-upcoming-changes-to-the-gui-query-builder-updated/6551/42)在实际试用后认为先进编辑器不错，但简单模式中当前汇总选择更难看见。这支持“控件减少可能转移理解负担”，不支持把简单／高级名称当作实际易用性。**[社区；研究：机制推断]**

### 固定产物：两模式与局部预览，不是恢复旧栏

由 [v0.32.0](https://github.com/metabase/metabase/releases/tag/v0.32.0) 与 [v0.33.0](https://github.com/metabase/metabase/releases/tag/v0.33.0) 发布页取得固定提交，直接读取以下实现：

- 前版 `6970194322f7c92400c383e53c81014ed40524db` 的 [QueryBuilder L261–280](https://github.com/metabase/metabase/blob/6970194322f7c92400c383e53c81014ed40524db/frontend/src/metabase/query_builder/containers/QueryBuilder.jsx#L261-L280)同时渲染结构化编辑栏与结果。**[一手：源码]**
- 新版 `06229af7dc736c3adadc56b74f6645bff984d600` 的 [View L206–240](https://github.com/metabase/metabase/blob/06229af7dc736c3adadc56b74f6645bff984d600/frontend/src/metabase/query_builder/components/view/View.jsx#L206-L240)以白色覆盖层显示 notebook；[切换按钮 L16–36](https://github.com/metabase/metabase/blob/06229af7dc736c3adadc56b74f6645bff984d600/frontend/src/metabase/query_builder/components/view/QuestionNotebookButton.jsx#L16-L36)让可编辑结构化问题在 View 与 Notebook 间切换。这是返回结果视图，不是恢复旧常驻栏。**[一手：源码]**
- [步骤预览 L30–40、61–68](https://github.com/metabase/metabase/blob/06229af7dc736c3adadc56b74f6645bff984d600/frontend/src/metabase/query_builder/components/notebook/NotebookStepPreview.jsx#L30-L68)限定最多十行、使用表格，步骤变化后显示 Refresh；[Visualize L22–40](https://github.com/metabase/metabase/blob/06229af7dc736c3adadc56b74f6645bff984d600/frontend/src/metabase/query_builder/components/notebook/Notebook.jsx#L22-L40)切回 View，结果需要更新时重新查询。因此局部可检查与完整同屏不是等价能力，十行预览不能保证后续行正确。**[一手；研究：验证边界]**

[新版文档 L27–37](https://github.com/metabase/metabase/blob/06229af7dc736c3adadc56b74f6645bff984d600/docs/users-guide/04-asking-questions.md#L27-L37) 仍描述旧四段编辑栏，与上述实现不一致；不采用这段文字证明旧 UI 留存。固定源码证明机制存在，不证明运行、易用性或净收益。**[一手；研究：来源冲突处理]**

### 同一试用者的发布后回执

[AndrewMBaines 的早期试用](https://discourse.metabase.com/t/preview-upcoming-changes-to-the-gui-query-builder-updated/6551/2)已有具体界面意见；[8 月发布后回执](https://discourse.metabase.com/t/experience-of-upgrading-to-0-33/7167/1)明确从 0.31.2 升到 0.33，并在开发环境试过 0.32.x。他认为新位置起初陌生，习惯后好用；[9 月补充](https://discourse.metabase.com/t/experience-of-upgrading-to-0-33/7167/4)仍要求先用表核查数据，而非让国家字段自动变地图，并[确认一直走 Custom 入口](https://discourse.metabase.com/t/experience-of-upgrading-to-0-33/7167/6)。这是既有试用者适应后采用、仍认为默认结果不合任务的自报，不是新用户学习实验。维护者提出记住人工图表选择或另设结果按钮，本轮未验证这些方案实施。**[社区：同一人的前后使用自报；研究：边界]**

### 与同屏反例一起决定，而非排出布局优劣

既有 [Home Assistant 链](#home-assistant字段保留与原操作路径是两回事)显示恢复状态与属性同页，仍可能未保住原访问路径；Metabase 则显示放弃常驻栏、提供步骤预览和返回入口，也有发布后适应的使用者。两例支持按同屏核对、阶段依赖及先查数据/看趋势的任务选择，不能推广为分步设计较差或双模式必需。**[研究：竞争解释；经验：采用条件]**

比较布局只限两条路径共有的过滤、汇总、查看结果任务；多阶段聚合与关联本来就增加能力，不能当等功能对照。复访应区分首次陌生、熟悉后仍反复往返及运行故障；若隐藏条件妨碍核查、局部预览不足或默认结果不适合下一步，就调整呈现与入口。缺任务计时、完整样本和长期留存，不能证明净时间收益；续接须有同任务连续操作或对应版本使用结果。**[研究：局限与续接条件]**

## Mealie：撤掉实现，不等于撤掉需求

核实时间：2026-10-15（UTC）；历史采用链与当前草稿状态分开记录。

**采用判断**：需求、维护责任与替代可达性分别判断。已实现但无人承担的功能可以退出核心产品；若需求仍在，新的现成能力可以支持窄接入重试，不能据此推断原退出决定错误或新方案一定便宜。[经验]

**需求与退出。** [#660](https://github.com/mealie-recipes/mealie/discussions/660) 中，Plevuus 在2022-12-19报告用过原OCR；2024-02-17，维护者 boc-the-git 明确说无人愿意继续支持、整应用开销高。建议的 iOS AI shortcut 对回复者 rtrnms 的 Android 不适用，维护者也承认自己的平台相同。2024-12-22，Plevuus 又报告升级并试用了新的图片导入，评价积极。这是相同用户名的两次实际使用报告，未绑定完全相同输入、设备或模型，不能称严格前后对照。[社区；一手：维护决定]

**固定退出产物。** [#2838](https://github.com/mealie-recipes/mealie/pull/2838) 于2023-12-15合入，固定提交 [ca9f66ee2448f9786efb866d2d5aa8a33c7780a4](https://github.com/mealie-recipes/mealie/commit/ca9f66ee2448f9786efb866d2d5aa8a33c7780a4)。补丁确实删除 Tesseract 系统依赖、pytesseract 包、OCR路由与相关界面/测试。PR作者称其复杂、多故障、拖累构建和资源；所谓接近使用数据的是 Discord 讨论摘要，不能写成客观零使用。原实现作者 [Miroito 的回复](https://github.com/mealie-recipes/mealie/pull/2838#issuecomment-1861239640)承认自己已无意维护，并认可移除。构建时长、镜像大小及总支持工时变化均未独立测量。[一手：补丁与作者说明]

**换实现重新接入。** [#3974](https://github.com/mealie-recipes/mealie/pull/3974) 于2024-08-17合入，固定提交 [8a15f400e12bb5f5135b543372fbd3b917ff8fbd](https://github.com/mealie-recipes/mealie/commit/8a15f400e12bb5f5135b543372fbd3b917ff8fbd)。[固定API源码](https://github.com/mealie-recipes/mealie/blob/8a15f400e12bb5f5135b543372fbd3b917ff8fbd/mealie/routes/recipe/recipe_crud_routes.py) 的 create_recipe_from_image 接收图片列表，依赖启用 OpenAI 与图片服务开关，返回一个 recipe slug；[固定提示词第9行](https://github.com/mealie-recipes/mealie/blob/8a15f400e12bb5f5135b543372fbd3b917ff8fbd/mealie/services/openai/prompts/recipes/parse-recipe-image.txt#L9)明确一组图片属于一道菜谱。实现是既有Web应用/API里的图片上传，不再依赖 iOS Shortcut；这不等于已经取得 Android 实机复测。合入前 [lindell 实际试用](https://github.com/mealie-recipes/mealie/pull/3974#issuecomment-2278566033)总体肯定，但指出份量混入时间、步骤编号残留，说明图片成功导入仍需核对字段。[一手：固定源码；社区：运行报告]

**近期边界仍未消失。** [#1588](https://github.com/mealie-recipes/mealie/discussions/1588)长期请求PDF批量导入，2024-08已有一张PNG成功的用户报告，也有人反问是否适合三百多份；2026-09-24作者转引 [#8536](https://github.com/mealie-recipes/mealie/pull/8536)。截至2026-10-15（UTC）工具读取，该PR仍为 open/draft、未合入，head [23647e8aa17a6b45e7c38b895e1ab342344d77d2](https://github.com/bferd/mealie/tree/23647e8aa17a6b45e7c38b895e1ab342344d77d2)。它声明 Claude Code 参与初始实现，并选择复用现有 AI 接口/图片处理、增加文档提取库，不重新装回本地OCR栈；源码的 [_extract_document_content](https://github.com/bferd/mealie/blob/23647e8aa17a6b45e7c38b895e1ab342344d77d2/mealie/routes/recipe/recipe_crud_routes.py#L420)合并各文件内容，之后共用一次生成入口。作者明确多文件仍是同一道菜谱，不支持每文件各建一道的批量任务；测试通过和手工验证为作者报告，未本次执行。这是近期的范围选择证据，尚不能写成已采用或已经替换用户整批工作。[一手：草稿与固定源码；社区：历史使用报告]

**适用与反例。** 建议适用于有真实任务、但旧实现拖累维护的原型/产品功能。不把无人维护误判为无人需要，不把外部方案存在误判为目标人能用，也不因一个旧用户再次受益就承诺所有输入与批量迁移完成。若现有非模型入口已满足任务，或新接入仍要求使用者承担不能接受的平台、账号、费用与数据条件，就维持旧入口、外部处理或暂缓接入；不推荐默认增设模型。[经验：从证据推导]


## Joplin与Discourse：导航可达之后保留任务位置

核实：2026-10-15 UTC。改变15 §10.3：同样能到达内容时，比较是否保留当前任务位置，而非默认增加布局、快捷键或焦点动作。以下为不同项目的历史使用链；没有AI生成归属或净收益证据。[经验：采用判断；研究：归属边界]

**Joplin：替代快捷键没有覆盖同一任务。** [原请求与讨论](https://discourse.joplinapp.org/t/desktop-accessibility-add-a-shortcut-for-jumping-into-note-content/44129)中，RastislavKish希望从笔记列表进入阅读区域；维护者先给切换布局等替代方法，另一使用者认为已足够。原请求者澄清主要起点是笔记列表，改布局不是同一操作。讨论随后选择按编辑光标定位预览内容，而非总回顶部。2025-03-20，他[试用3.3.3](https://discourse.joplinapp.org/t/desktop-accessibility-add-a-shortcut-for-jumping-into-note-content/44129/17)肯定位置同步，同时指出新选笔记、没有编辑位置时，仅聚焦viewer容器不会使读屏器自动退出focus mode；聚焦具体内容则可行。环境为Ubuntu Mate22.04／Orca44.2，不能外推全部客户端。[社区：原用户需求与复测]

**实现与测试的范围不同。** [PR #11967](https://github.com/laurent22/joplin/pull/11967)于2025-03-15合入。固定提交`ba5ad18093dd7e92db1905b3c6954c114579832b`的[note-viewer实现](https://github.com/laurent22/joplin/blob/ba5ad18093dd7e92db1905b3c6954c114579832b/packages/app-desktop/gui/note-viewer/index.html)按源行映射找到渲染段落，临时设置`tabindex=0`后聚焦；独立命令无默认快捷键，富文本模式禁用。[自动化测试](https://github.com/laurent22/joplin/blob/ba5ad18093dd7e92db1905b3c6954c114579832b/packages/app-desktop/integration-tests/markdownEditor.spec.ts)只断言viewer容器获焦，具体段落的读屏行为另写在手工测试计划，不能当已执行结果。[一手：固定补丁；研究：验证范围]

**后续修订反证一次成功就够。** 2025-04-29的[#12183](https://github.com/laurent22/joplin/pull/12183)报告Windows／NVDA大文档常跳到顶部；[固定补丁a7bfa21](https://github.com/laurent22/joplin/commit/a7bfa21cd0d2711e45ef3e8c29675b9bb7179cdb)移除临时`tabindex=0`后50ms复原的路径，改为先尝试聚焦，必要时设`tabindex=-1`再聚焦，使段落可由脚本定位但不加入Tab顺序。它没有删除[NoteTextViewer的100ms消息延迟](https://github.com/laurent22/joplin/blob/ba5ad18093dd7e92db1905b3c6954c114579832b/packages/app-desktop/gui/NoteTextViewer.tsx)，不能写成全面取消计时。未取得该修订的独立使用回执，也未找到上述“无编辑位置”分支的最终复测。[一手：作者诊断与补丁；研究：未闭环范围]

**Discourse：恢复位置不能变成每次更新都抢焦点。** 原用户Nolan在2021-12[确认进入主题的改进有用后，继续要求Back返回原主题链接](https://meta.discourse.org/t/discourse-with-a-screen-reader/178105/88)；2022-03仍[报告反复找位置使自己停止阅读部分论坛](https://meta.discourse.org/t/discourse-with-a-screen-reader/178105/95)。首版在Chrome／Safari滚动追加数据时给下一批首行焦点，[#15304](https://github.com/discourse/discourse/pull/15304)于2021-12-15撤回；第二版又因边界问题在beta前[撤回](https://github.com/discourse/discourse/commit/97519a3ea58cd27f8ce05631882aa84dc1af315a)。第三版后，原用户03-30[在另一实例短暂使用](https://meta.discourse.org/t/discourse-with-a-screen-reader/178105/103)，确认返回列表与再进入主题的位置符合预期；回执没有精确部署SHA，不把效果全部归因单笔补丁。[社区：用户及维护者报告；一手：撤回产物]

**后续演化：重访恢复，首次进入仍有取舍。** 沿同帖读至末尾，Nolan在[2024-01-03的回执](https://meta.discourse.org/t/discourse-with-a-screen-reader/178105/160)确认Chrome＋NVDA重访旧主题已能恢复阅读位置并播报，主要痛点得到改善；新主题首次进入仍需手动找首帖，而Firefox可定位。维护者[01-09解释](https://meta.discourse.org/t/discourse-with-a-screen-reader/178105/161)实现有意跳过首帖：同样聚焦会在加载主题URL时造成不必要滚动，干扰其他用户；标题导航失败则待查。这是进入主题分支，不能归因#16257的返回列表补丁，也不能把2023年中途失败写成持续未修复。上述均为历史报告，不代表当前版本；本轮没有取得首次进入问题的最终复测。采用时分首次进入、重访、Back返回及实际浏览器／读屏组合，不统一调用focus；换浏览器也不自动满足原工作环境约束。[社区：用户后续回执；一手：维护者取舍；研究：边界]

**收窄触发源，而非取消目标。** 第三版[#16257](https://github.com/discourse/discourse/pull/16257)于2022-03-23合入；[固定实现eb237e6](https://github.com/discourse/discourse/blob/eb237e634a440f4b26e6c097e7afb9a135bb3781/app/assets/javascripts/discourse/app/components/topic-list-item.js)仅在列表显式启用、条目确为lastViewed且非mobileView时聚焦，避免普通追加／更新及推荐列表随高亮抢焦点。随后[97e7bb1](https://github.com/discourse/discourse/commit/97e7bb1ce483498640f512c1bf9bfe704dc1d402)让监听器也遵守同一开关，[8dd6cb1](https://github.com/discourse/discourse/commit/8dd6cb14eec3d3879e18dbf4a2785d09674a3dd1)兼容主题／插件删除目标元素的情况。后者只避免抛错，不保证被覆写的界面仍有同等导航功能。[一手：固定源码；研究：机制边界]

**维护者也需要看懂行为。** #16257的[审查者](https://github.com/discourse/discourse/pull/16257#issuecomment-1075880874)认为代码看似安全，却无法判断预期体验，要求测试或视频；作者补测试后[公开记录取舍](https://github.com/discourse/discourse/pull/16257#issuecomment-1075945631)：测试窗口失焦可能令本地浏览器测试失败，但CI通过且覆盖重要功能，因此保留，必要时再评估。[固定测试](https://github.com/discourse/discourse/blob/eb237e634a440f4b26e6c097e7afb9a135bb3781/app/assets/javascripts/discourse/tests/acceptance/last-visited-topic-focus-test.js)断言`focused`样式，不等于实际读屏结果；上述CI状态只是作者报告，本轮未取日志或重跑。它支持交接解释具体行为及测试前提，不量化接管成本。[一手：审查、决定与测试源码；研究：采用边界]

**采用与停止条件。** 15 §10 据此区分跨视图定位、交互模式及返回/追加触发。本轮只读原帖、PR和固定补丁，未运行软件、读屏器、测试或模型；短时自报不证明长期留存、全平台可靠性或AI收益。[经验：采用判断；研究：验证范围]


## 搜索改进：结果准入、排序与输入次序

核验日期：2026-10-15（UTC）。只读公开讨论、固定提交与版本源码，未安装、运行上游或做模型实验。原有“核参数与默认值”不足以区分结果不应入选、入选却排后、相关性覆盖原顺序；先借用已有的场景策略和查询放宽机制，再决定是否改算法。以下不是参数攻略或新引擎推荐。**[经验：采用判断]**

### fzf：统一评分受损，场景策略后原用户确认

[2022年的#2930](https://github.com/junegunn/fzf/issues/2930)中，pldubouilh对比0.30.0与0.32.1，报告历史检索中常用的git commit --amend被旧路径命令压下。[维护者解释](https://github.com/junegunn/fzf/issues/2930#issuecomment-1220789808)边界加分符合设计，但不同输入有不同需要，不愿堆用户难理解的细粒度调分开关。[固定提交6fb41a2](https://github.com/junegunn/fzf/commit/6fb41a202a97ad3f2437f6e5aee8890268560412)于2022-08-28加入default/path/history，并把三种shell历史入口接入history，列入0.33.0；[原用户随后确认](https://github.com/junegunn/fzf/issues/2930#issuecomment-1232593430)该版解决问题。频繁使用是其情境，不能据此说修复实现了频率学习。**[社区：实际使用与修改后回执；一手：固定补丁]**

**exact不能替代顺序。** 同批讨论中，[james64](https://github.com/junegunn/fzf/issues/2909#issuecomment-1223706339)只记得tcpdump中的dump，却被其他边界匹配压下，试过exact仍不满意；维护者[建议切换排序](https://github.com/junegunn/fzf/issues/2909#issuecomment-1223741655)，[同用户尝试后](https://github.com/junegunn/fzf/issues/2909#issuecomment-1223746580)确认配合查询引号已满足需要。它说明匹配范围和排序应分别选择，不证明所有用户都应关闭排序。**[社区：失败尝试与复试]**

**成熟机制的现行边界。** 核对固定v0.74.5的[评分源码](https://github.com/junegunn/fzf/blob/v0.74.5/src/algo/algo.go#L176-L197)、[手册](https://github.com/junegunn/fzf/blob/v0.74.5/man/man1/fzf.1#L66-L100)与[历史入口](https://github.com/junegunn/fzf/blob/v0.74.5/shell/key-bindings.zsh#L143-L150)：history取消不同边界类别的额外分差，仍保留匹配分，同分依输入次序；它不是纯时间排序。停止排序才保留输入次序，时间含义来自调用方。exact要求连续匹配，不自动取消重排。fzf的fuzzy是有序字符子序列匹配，不等于搜索引擎的拼写纠错。**[一手：版本源码；研究：适用边界]**

也不能把旧拒绝当永久限制：[#3608的2024年回应](https://github.com/junegunn/fzf/issues/3608#issuecomment-1924172099)反对无条件文件名优先，后来[2025年合入的#4192](https://github.com/junegunn/fzf/pull/4192)以path内的pathname同分规则有界支持，进入0.59.0；固定合并为243a76002c93b474cf8401b37670a43803a0a2d2。它既不是无条件basename-first，也没有排除目录匹配；未见原请求者对最终实现的回访，不拿此链代替#2930闭环。**[一手：后续实现；研究：反证]**

### Meilisearch：排前不能解决不应入选，稀有词也不总是意图

[组织讨论#255](https://github.com/orgs/meilisearch/discussions/255)中，LowSociety于2021-12-14报告分类、文章、商户各取三条，某组没有全词匹配仍被弱结果填满，因而无法升级；强匹配排前并不能解决空组的准入问题。后续发布all/last。2025-02的以花束搜索为例的使用者又希望放宽时丢弃稀有的birthday、保留常见bouquet，与frequency偏好相反；维护者解释稀有词可能更能表达意图。未见前者升级成功或后者最终满意的回访，不能写成两例均已解决。**[社区：使用情境；一手：设计回应；研究：反证边界]**

[PR4667](https://github.com/meilisearch/meilisearch/pull/4667)于2024-05-30合并frequency。固定d6bd88ce4f86927017f8f87c97a68cf24f1be49b的[匹配测试](https://github.com/meilisearch/meilisearch/blob/d6bd88ce4f86927017f8f87c97a68cf24f1be49b/meilisearch/tests/search/matching_strategy.rs)分别定义all/last/frequency期望结果，且拼错Capitain Marvel时all仍期望命中：**要求所有词不等于逐字无容错**。这是已读测试定义，未运行，也未查CI。[查询图实现](https://github.com/meilisearch/meilisearch/blob/d6bd88ce4f86927017f8f87c97a68cf24f1be49b/milli/src/search/new/query_graph.rs)按文档频率生成移除顺序，零命中另有处理，不能说成任意OR组合遍历。**[一手：固定源码与测试定义]**

回读[官方搜索API](https://www.meilisearch.com/docs/reference/api/search/search-with-post)：all不放宽，last从末词逐步放宽，frequency按频率丢词；结果是否可因删词入选，不能由排名规则等价代替。可直接借用这些成熟机制，按入口决定宁可少结果还是接受放宽，同时保留所需纠错；不是统一推荐某个策略。**[一手：官方语义；经验：采用判断]**

**证据与停止条件。** fzf有同人版本后确认；Meilisearch尚无同等回执。两链均缺长期测量、检索评估集与AI净收益证据。先按准入、排序、输入顺序定位缺口；现成机制满足时无需改引擎。**[研究：验证边界；经验：采用判断]**


## KeePassXC：连续筛选后确认的是哪个对象

核实：2026-10-16（UTC+8）。改变15 §10.3：本地候选过滤与整库检索分别选择响应延迟，不能仅验静止后的结果正确。只读公开原帖、PR和固定源码；未构建、运行客户端或进行AI实验。**[经验：采用判断与核验范围]**

**原任务是连续动作，不是看见搜索结果就算完成。** pauschuu在2022-03-22的[#7596](https://github.com/keepassxreboot/keepassxc/issues/7596)报告：过去按Auto-Type快捷键、键入一个字母筛选、立即Enter即可选择常用条目；2.7.0出现延迟，过快确认会选择错误条目。环境为Arch Linux／X11、Qt5.15.3、版本revision `d7a9ef4`。他另报等待后有时还需方向键才能选中；维护者未复现此附带现象，不能当所有用户的必现故障。**[社区：原用户报告]**

**选择依据是工作范围，不是统一取消等待。** [维护者回应](https://github.com/keepassxreboot/keepassxc/issues/7596#issuecomment-1075621046)解释300ms延迟对于整库搜索有意义，但已有匹配列表过滤不需要同样等待。[PR #7598](https://github.com/keepassxreboot/keepassxc/pull/7598)的[固定前版](https://github.com/keepassxreboot/keepassxc/blob/7dc2d236dfba345002962c9e6d0f1f0b6a7d0289/src/autotype/AutoTypeSelectDialog.cpp)将文本变化接到300ms单次计时器，Enter直接激活当前选择；[固定后版](https://github.com/keepassxreboot/keepassxc/blob/2fee61a0a1a0cbd8bb0298f9cd2d9bc2bebadfcb/src/autotype/AutoTypeSelectDialog.cpp)以`setDelayedSearch`区分0ms与150ms。未勾选整库搜索时只过滤已有`m_matches`；勾选时遍历已打开数据库检索。这里没有数据库规模或耗时测量，150ms只是该补丁的选择，0ms仍是Qt计时器而非同步执行或无竞争保证。**[一手：固定源码与维护者理由；研究：边界]**

**真实复试成立，但不覆盖后来的全部修订。** 原请求者于03-22 21:08 UTC在[PR审阅](https://github.com/keepassxreboot/keepassxc/pull/7598#pullrequestreview-917887109)明确说亲自构建、测试后可用，并在[原issue](https://github.com/keepassxreboot/keepassxc/issues/7596#issuecomment-1075643503)确认附带未选中问题不再出现。03-23审查随后[发现初始化路径](https://github.com/keepassxreboot/keepassxc/pull/7598#discussion_r832912510)临时阻断checkbox信号，不能只在toggled回调设置延迟；最终代码在`setMatches`也调用`setDelayedSearch(noMatches)`。PR于03-23合入，merge为`4178e72fe04eb97d0787c006b03993c87baa26c3`。因此回执支持用户试用了当时修订，未绑定最终head，不能写成最终发布版已由原人完整验收。**[社区：原人运行报告；一手：审查与后续补丁]**

**采用边界。** 对已有候选的快速选择，先检查输入更新、选择更新与确认动作是否一致，再比较缩短局部延迟、提示尚未就绪或保护提交；不为了共享搜索组件而让轻量路径承担整库检索的等待，也不由此要求所有搜索零延迟。仍需按实际范围验证快速输入后确认及范围切换，不能让测试先等结果稳定再确认、从而漏掉用户原动作；验证顺序沿[23](../23-browser-verification.md#4-一次完整验证的顺序)。后两种处理只是待选方案，本例没有对照其效果；没有长期使用、整库快输复测、全平台结果、投入工时或AI净收益证据。**[经验：产品选择；研究：未验证范围]**


## GIMP：一次性合并与记住工作流选择

核实：2026-10-16（UTC+8）。改变15 §10.3：能用一次性操作恢复任务，不等于原工作流已无重复负担；先核可发现的持久选择及其范围，再决定回滚。以下是历史实现与后来配置复试，不是为该用户新写补丁后的恢复，也无AI实现归属证据。**[经验：采用判断；研究：边界]**

**前后方案各保留什么。** [2.99.18发布说明](https://www.gimp.org/news/2024/02/21/gimp-2-99-18-released/)介绍将滤镜保留为可编辑效果，之后可调整、移除或合并；[3.0 RC1说明](https://www.gimp.org/news/2024/11/06/gimp-3-0-RC1-released/)明确说早期使用者要求原破坏性工作流，因此增加应用时的“Merge Filters”选项。它保留了非破坏性默认，不是整项撤回；当时层组不支持直接合并。**[一手：官方变更与理由]**

**固定产物不是只有一个按钮。** [cdd5174](https://github.com/GNOME/gimp/commit/cdd5174055d6887ddbb215a1e20222de679b7dfd)于2024-08-10提交，新增默认false的`merge-filter`配置，提交新滤镜时据此决定立即合并，并调整滤镜栈位置；作者日期2024-02-02不当作提交日期。用户所报3.2.4的tag解析到`6987b3853c10517eb581deeb20572fb5f99a7086`；[对应源码](https://github.com/GNOME/gimp/blob/6987b3853c10517eb581deeb20572fb5f99a7086/app/tools/gimpfiltertool.c#L414-L480)将复选框绑定工具选项并限制显示对象，[提交分支](https://github.com/GNOME/gimp/blob/6987b3853c10517eb581deeb20572fb5f99a7086/app/tools/gimpfiltertool.c#L574-L580)读取该选择。固定源码说明机制，不替代用户运行或持久化实测。**[一手：固定补丁与版本源码]**

**功能恢复后，重复负担仍在。** [2026-08-26至27日原帖](https://www.gimp-forum.net/Thread-adding-color-after-using-threshold)中，Linux／3.2.4使用者makeitwork101要先阈值化再上色。#3确认“Merge all active filters down”后能继续，但每次多一步；#5／#7的尝试仍混淆一次性合并与持久选项，并出现连续填色异常。其他人进一步指出应在Threshold对话框勾选“Merge filter”，而不是反复执行层上的合并命令。**[社区：原任务、实际尝试与纠正]**

**配置复试成功，默认值争论没有因此结束。** [08-28的原用户#12](https://www.gimp-forum.net/Thread-adding-color-after-using-threshold?pid=47684#pid47684)确认找到正确复选框后恢复所需行为，关闭再打开GIMP仍记住选择。它没有逐项记录成功后的全套连续操作，不能把先前新图失败尝试拼成最终新图验收。用户主张新功能默认关闭；[维护者后续回应](https://www.gimp-forum.net/Thread-adding-color-after-using-threshold?page=2)指出不同人需求相反；[第一页#10的解释](https://www.gimp-forum.net/Thread-adding-color-after-using-threshold)则明确普通Filter菜单与部分Color工具的设置作用域不同。拟议全局设置和界面改版不是已交付产物；回执不证明跨工具统一保存。**[社区：原用户复试；一手：维护者解释；研究：范围]**

**显示故障与取舍分开。** 同帖另报的[#16718](https://gitlab.gnome.org/GNOME/gimp/-/work_items/16718)给出3.2.4 aarch64 AppImage／Raspbian Debian13／X11复现：未合并滤镜下bucket fill的画布与缩略图更新不一致，切换可见性可刷新。该故障不等于非破坏性设计必然禁止后续绘画；本轮只核正文，未核修复状态或运行复现，不能声称配置选择修好了该bug。**[一手：原始故障报告；研究：未验证范围]**

**采用与停止条件。** 15 §10 的持久选择验收包括新对象、连续操作、重开与设置范围；这些是建议范围，不全是该用户已完成的测试。只读公开材料，未运行GIMP、模型或测试，未测操作工时、长期收益或全平台结果；不能由单例要求所有产品记住所有设置。**[经验：采用建议；研究：验证边界]**


## n8n：自动保存、稳定检查点与可放弃的试改

核实：2026-10-16（UTC+8）。改变15 §10.3：防丢失、识别稳定中间状态、运行后放弃试改是不同需求；恢复正确执行不等于恢复原试用方式。只读公开讨论、固定补丁及官方文档，未运行 n8n、测试或模型。**[经验：采用判断；研究：范围]**

**生产版本隔离后，编辑任务仍可能不顺。** [2026-01的官方公告及原用户反馈](https://community.n8n.io/t/announcing-autosave/246161)说明保存与发布已经分开。01-30，Dr_Trann描述协助同事排查工作流，尝试不成立时希望离页放弃；jb8n描述连续修改节点、运行后想回到稳定中间状态，且该状态未必是已发布版本。这些是编辑与恢复负担，不能改写为自动保存必然部署到生产。**[一手：产品语义；社区：实际任务]**

**已有替代只能满足部分目标。** [04-22维护者归纳及后续反馈](https://community.n8n.io/t/disable-autosave-got-created/263825/17)将可放心试改、找回有效版本分别列出；另一使用者提出保留自动恢复、突出手动里程碑。当前[官方文档](https://docs.n8n.io/build/manage-workflows/view-change-history.md)已提供命名版本且不自动清理，限 Cloud Pro／Enterprise、self-hosted Business／Enterprise；不能把02月的规划继续写成尚未交付。命名检查点有助于辨认状态，却不是“不保存即可试运行”的等价实现；未见上述原使用者采用后的回执。**[一手／社区；研究：机制区别与边界]**

**开关恢复后，Execute又改变了保存语义。** [#25144](https://github.com/n8n-io/n8n/pull/25144)于05-04合入关闭自动保存的环境选项；[#30347](https://github.com/n8n-io/n8n/pull/30347)随后指出 Execute 仍会保存，破坏显式控制。[固定补丁10e79d9](https://github.com/n8n-io/n8n/commit/10e79d91bd7d61e6529cc5647cc6545d1ae03fa8)把执行前保存收窄为新工作流，或自动保存开启且有未保存修改；其中测试只断言是否调用保存，不能证明执行的是当前画布。该PR于05-13合入，merge为`ad6c470f8f9667c9455d1c85dbd3e553f6d99f4e`。**[一手：需求、固定补丁与测试定义]**

**实际反例：没有保存，却运行旧定义。** NeoGrAIph于06-03在[#31615](https://github.com/n8n-io/n8n/issues/31615)报告 self-hosted 2.22.x、自动保存关闭时，修改现有工作流后手动运行使用数据库旧定义；要求有编辑权限者能运行未保存草稿。#30347作者06-11也报告遇到并确认回归。这里是当前工作流的手动运行，不是调用子工作流选错版本，更不是所有 Execute 路径都过时。**[社区：版本后负面回执；研究：范围]**

**最终选择保留安全边界，没有满足原任务全部条件。** [#32513的维护者审查](https://github.com/n8n-io/n8n/pull/32513#pullrequestreview-4523382955)要求撤回传入画布定义的方案，改为保存后运行或取消。06-18合并产物`2124c08c050ac0c4adf996c9e7f128debd3dc2e1`的[前端](https://github.com/n8n-io/n8n/blob/2124c08c050ac0c4adf996c9e7f128debd3dc2e1/packages/frontend/editor-ui/src/app/composables/useRunWorkflow.ts)仅在已有工作流、有未保存修改且自动保存关闭时提示；取消或保存失败则不运行，新工作流和自动保存开启另走原分支。[后端](https://github.com/n8n-io/n8n/blob/2124c08c050ac0c4adf996c9e7f128debd3dc2e1/packages/cli/src/workflows/workflows.controller.ts)的`runManually`仍按URL中的工作流ID读取数据库定义交给执行器。不能把已撤回的草稿覆盖方案写成最终能力。**[一手：审查、固定前后产物]**

[固定前端测试](https://github.com/n8n-io/n8n/blob/2124c08c050ac0c4adf996c9e7f128debd3dc2e1/packages/frontend/editor-ui/src/app/composables/useRunWorkflow.test.ts)断言确认会调用保存、取消不保存也不运行；不是一次完整运行后再放弃修改的验收。本轮未运行测试或核CI。原issue最后只有贡献者表示将试用，没有最终版满意回执。由实现可知，该修订避免静默采用旧定义，却仍须先持久化才能试运行；这是有意取舍，不等于原需求消失。**[一手：测试定义；研究：未闭环边界]**

**采用判断。** 先问使用者需要防丢失、找回稳定检查点，还是临时试改后整体放弃，再比较现成恢复／命名机制与单独试改空间；不要把增加保存开关当作完整答案，也不因用户抱怨就取消防丢失。当前[保存与发布文档](https://docs.n8n.io/build/understand-workflows/save-and-publish-workflows.md)区分持久化草稿与生产版本，另注明工作流设置更新可自动重新发布，因此不推广成所有设置均隔离。选择临时试改方案还须核执行权限及外部副作用，未保存不等于运行无副作用。本例没有长期效率、最终用户重新采用或AI净收益证据；提交署名不支持AI因果归属。**[一手：现行边界；经验：采用与停止条件]**


## VS Code：默认采用与退休旧实现分开

核实：2026-10-16（UTC）；历史事件下列日期为UTC。改变15 §10.4：默认选用现成组件，不自动授权退休仍承担必要能力的旧实现；兼容开关与局部成功须核实际路径。只读公开发布说明、固定源码及用户原帖，未运行客户端、测试或模型。这是成熟软件的历史迁移反例，不是AI原型成功案例。**[经验：采用条件；研究：范围]**

**先采用新组件，保留另一条实现。** [1.11发布说明](https://code.visualstudio.com/updates/v1_11)宣布搜索使用ripgrep，理由是更快，并提供`search.useRipgrep=false`回退。[首次接入62ec995](https://github.com/microsoft/vscode/commit/62ec995019e86074c5aa24003d2f960bd9282d90)将原Node搜索引擎／worker调用替换成RipgrepEngine并增加外部进程适配；[随后3ebdc67](https://github.com/microsoft/vscode/commit/3ebdc67d1f27207e5c06d13e307eeb85d1aba3da)恢复原实现、以开关选择。发布说明的速度主张不是本轮测速，也没有维护工时对照。**[一手：发布说明与固定补丁；研究：边界]**

**新组件的能力并不覆盖编辑器支持的全部输入。** [2017年#24229](https://github.com/microsoft/vscode/issues/24229)报告maccenteuro编码可以编辑，却无法多文件搜索；[维护者解释](https://github.com/microsoft/vscode/issues/24229#issuecomment-292573812)编辑器的iconv-lite支持它，搜索组件不支持，建议退回旧搜索。不能推广成所有非UTF-8编码都不支持，也不能把编辑正常当作搜索已覆盖。**[社区：实际使用；一手：维护者解释]**

**同名开关后来不再选择旧实现。** [2018-10-20的b59fd51](https://github.com/microsoft/vscode/commit/b59fd519a0148f20e1ad0b860461a7c40b286df8)将`search.useRipgrep=false`改为选择PCRE2正则能力，并另设`disableRipgrep`控制旧路径；当时旧实现尚未删除，不能把这一步写成已经彻底取消兜底。正则能力与输入解码是不同责任，原先用于恢复编码支持的配置不能因名称保留就当作仍有效。**[一手：固定补丁；研究：机制区别]**

**之后确实删除旧实现，而非只隐藏入口。** [#65337](https://github.com/microsoft/vscode/issues/65337)提出不再保留旧搜索，[维护者说明](https://github.com/microsoft/vscode/issues/65337#issuecomment-449104898)指可由`search.useLegacySearch`开启的Node实现。[2019-01-24的cc4217c](https://github.com/microsoft/vscode/commit/cc4217ccbfc1d99b821fd65bc787c2cea820acb4)删除legacy实现、开关及相关双实现测试，将`rawSearchService`固定接到ripgrep；删掉的配置说明原本明示旧实现支持新组件不支持的部分编码。其父提交`adf0b1966a49306e76ac87083ade69ae1ac9fb55`的[旧worker](https://github.com/microsoft/vscode/blob/adf0b1966a49306e76ac87083ade69ae1ac9fb55/src/vs/workbench/services/search/node/legacy/worker/searchWorker.ts#L174-L179)按文件编码调用解码，再逐行搜索。删除代码和测试只能证明责任变化，不能证明维护净成本下降。**[一手：固定前后产物与开发者原意；研究：边界]**

**接收者仍需要被删路径承担的任务。** [#68237](https://github.com/microsoft/vscode/issues/68237)报告1.31.0下cp437工作区搜索失败，过去关闭ripgrep有效，现在改选PCRE无效；[维护者确认该编码搜索不再支持](https://github.com/microsoft/vscode/issues/68237#issuecomment-462475384)。[Trucoto的实际约束](https://github.com/microsoft/vscode/issues/68237#issuecomment-474838319)是字符串需面向旧串口打印机／显示设备，转换整个项目还需增加适配，不是免费替代。它支持把接收者的外部依赖纳入必要能力判断，不要求项目永久覆盖所有旧格式。**[社区：使用任务与代价自述；一手：维护者回应]**

**一次正面回执不足以证明替代完整。** 同一用户JSchiffmacher于2019-06-19 10:01在[配置后回报可用](https://github.com/microsoft/vscode/issues/68237#issuecomment-503494535)，13:41又[收窄成功范围](https://github.com/microsoft/vscode/issues/68237#issuecomment-503565574)：带重音字符搜索仍漏文件，预期超过1000项而只见4项。这是其自报，未独立核对文件集合。维护者此前[解释](https://github.com/microsoft/vscode/issues/68237#issuecomment-464826826)已打开文件走编辑器缓冲区搜索，不能代表整工作区搜索成立；这里不是全部入口都被新引擎替换。因而应核成功结果来自哪条路径，尤其避免先打开样本后只验交互结果、漏掉新组件实际承担的后台／批量入口。**[社区：同人复试与修正；一手：维护者解释；经验：验收建议]**

**采用与停止条件。** 取舍见 15 §10。本例补路径归属、开关语义变化及成功判断被后续操作推翻的证据；AI效果、支持工时、长期维护成本和净收益仍缺。issue开放不证明2026年发行版故障，原型改用现成方案的维护净收益也仍待核。**[经验：采用判断；研究：验证边界]**


## Karakeep：重复对象不等于重复意图

核实：2026-10-16（UTC）；事件日期以下均为UTC。改变15 §10.3：去重保住对象身份，不等于重复操作应当保留或重置相同状态；按真实目的比较重存与重投，不由调用来源替使用者决定。只读公开讨论和固定补丁，未运行应用、测试或模型。**[经验：采用判断；研究：范围]**

**原使用者要重新入队，不只是保存成功。** Garrett-R在2026-02-22的[#2502](https://github.com/karakeep-app/karakeep/issues/2502)报告：Firefox扩展保存YouTube视频、在Karakeep归档、再保存同一页，界面显示成功但主页未出现；[补充说明](https://github.com/karakeep-app/karakeep/issues/2502#issuecomment-3941927859)称数周来误以为保存不稳定，希望解除归档并移到前面。维护者[最初考虑改善已存在提示](https://github.com/karakeep-app/karakeep/issues/2502#issuecomment-3940548275)，也指出只解除归档仍会因日期较旧而难找；[02-23同意改行为](https://github.com/karakeep-app/karakeep/issues/2502#issuecomment-3943157419)。原用户当天的赞许早于实现，不是修改后验收。**[社区：重复使用任务；一手：开发者选择]**

**固定产物改变了操作语义，未删除原创建时刻。** 07-26合入的[#2962／f2f6431](https://github.com/karakeep-app/karakeep/commit/f2f6431db2da20d45469415574a0b4b6f8086070)，其[父版本a698724](https://github.com/karakeep-app/karakeep/blob/a698724705d44898f01f88fabc516c0dd27be2a1/packages/trpc/routers/bookmarks.ts#L261-L272)命中已有URL直接返回；[修改后router](https://github.com/karakeep-app/karakeep/blob/f2f6431db2da20d45469415574a0b4b6f8086070/packages/trpc/routers/bookmarks.ts)默认解除归档、更新排序日期与modifiedAt，并触发索引和edited webhook，显式提供的部分元数据另可覆盖。[schema](https://github.com/karakeep-app/karakeep/blob/f2f6431db2da20d45469415574a0b4b6f8086070/packages/db/schema.ts#L208-L225)保留数据库createdAt，新增lastSavedAt；旧API字段createdAt却改指lastSavedAt，原创建时刻另以firstCreatedAt暴露。不能照用户报告把API字段变化写成底层原始日期已丢失。**[一手：固定前后产物；研究：语义边界]**

**同一归档状态承担另一人的完成标记。** [07-29的lrnd1回执](https://github.com/karakeep-app/karakeep/issues/2502#issuecomment-5114172612)说明自己收藏链接、整理进笔记应用后再归档；新行为无提示地恢复条目，让他混淆已完成的整理工作，询问能否停止。[07-30补充](https://github.com/karakeep-app/karakeep/issues/2502#issuecomment-5125800099)表示确认、设置或标明从归档返回均可接受。这是既有使用者的实际反对，不是原请求者复测，也不等于要求整项回滚。**[社区：修改后使用及可接受的候选]**

**已豁免RSS来源，不等于外部RSS同步也无副作用。** [08-06的#2986](https://github.com/karakeep-app/karakeep/issues/2986)中，pluusla报告v0.33.1经n8n每20分钟同步FreshRSS收藏，同URL仍为同ID，但两天前条目的API createdAt变为12分钟前，扰乱日期排序。固定router虽豁免source为rss/import，[REST入口](https://github.com/karakeep-app/karakeep/blob/f2f6431db2da20d45469415574a0b4b6f8086070/packages/api/routes/bookmarks.ts#L54-L63)无source时却设为api；来源标签不完整表达“自动重投”意图。[开发者提出API opt-in](https://github.com/karakeep-app/karakeep/issues/2986#issuecomment-5201910207)，[该用户认可并细化提议](https://github.com/karakeep-app/karakeep/issues/2986#issuecomment-5201946303)，但未取得后续交付与运行复测回执。**[社区：实际负面回执；一手：入口和开发者回应；研究：未闭环边界]**

**采用与停止条件。** 重复提交的意图与状态取舍见 15 §10，不由单例要求所有入口加开关或保留更多状态。[补丁测试定义](https://github.com/karakeep-app/karakeep/blob/f2f6431db2da20d45469415574a0b4b6f8086070/packages/trpc/routers/bookmarks.test.ts)检查普通重存、提供的元数据及rss豁免，不能替代外部调用者的重复任务验收；本轮未运行测试或核CI。没有原请求者明确运行成功、长期收益、维护成本或AI效果证据；不以issue状态或当前未固定分支推断后续版本已修好或仍有故障。**[经验：采用判断；研究：验证边界]**


## Excalidraw：撤销自己的操作与恢复整份旧文档

核实：2026-10-16（UTC）；历史事件日期为UTC。改变15 §10.3：协作编辑先定撤销范围，保留不相关的远端贡献，同对象同属性的冲突另定；本地历史不等于完全隔离。只读公开讨论、固定实现与测试定义，未运行应用、测试或模型。**[经验：采用建议；研究：范围]**

**真实任务是撤回自己的操作。** bobbydigitales在2023-11-28的[#7353](https://github.com/excalidraw/excalidraw/issues/7353)报告：团队协作时A写文字、B画图，B连续撤销自己的图形却删掉A的文字，因而考虑停用协作功能。另一讨论[#5375](https://github.com/excalidraw/excalidraw/issues/5375)中，devnoname120[称无法将工具引入团队](https://github.com/excalidraw/excalidraw/issues/5375#issuecomment-1670045268)，在维护者[2024-04-24的上线说明](https://github.com/excalidraw/excalidraw/issues/5375#issuecomment-2075317052)之后，于[05-21回报目前很好用](https://github.com/excalidraw/excalidraw/issues/5375#issuecomment-2123178678)。这是同一反馈者的后续使用自报，不是#7353报告者的复测；未给精确版本、具体操作序列或长期使用数据。同期[另一人仍报告撤销有问题](https://github.com/excalidraw/excalidraw/issues/5375#issuecomment-2104348111)，没有足够环境信息归为同一原因，也不能据此宣布改版全面失败。**[社区：前后使用报告；一手：维护者交付说明；研究：归属与边界]**

**固定实现把本地历史与远端更新分开。** [#7348](https://github.com/excalidraw/excalidraw/pull/7348)于2024-04-17合入`530617be90df8d41f93c7c885d3097565c4c7f6d`。[History](https://github.com/excalidraw/excalidraw/blob/530617be90df8d41f93c7c885d3097565c4c7f6d/packages/excalidraw/history.ts#L37-L59)将本地增量的逆变换放入undo栈；[Store](https://github.com/excalidraw/excalidraw/blob/530617be90df8d41f93c7c885d3097565c4c7f6d/packages/excalidraw/store.ts#L104-L158)允许更新比较基线而不生成可撤销增量。相应[测试定义](https://github.com/excalidraw/excalidraw/blob/530617be90df8d41f93c7c885d3097565c4c7f6d/packages/excalidraw/tests/history.test.tsx#L1646-L1720)分别要求保留远端新增的另一个对象、以及同一对象的另一属性；不是只验undo栈非空。这些是源码契约，不能计作本轮通过的测试或真实多人会话。**[一手：固定实现与测试定义]**

**当前接口仍要求正确标记更新。** 核实日master固定为`4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e`，不代表所有发行包或部署已包含它。[远端接线](https://github.com/excalidraw/excalidraw/blob/4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e/excalidraw-app/collab/Collab.tsx#L810-L819)使用`CaptureUpdateAction.NEVER`；[Store](https://github.com/excalidraw/excalidraw/blob/4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e/packages/element/src/store.ts#L362-L384)为它更新snapshot而不产生durable increment，[App](https://github.com/excalidraw/excalidraw/blob/4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e/packages/excalidraw/components/App.tsx#L3821-L3823)只将durable increment交给History记录。[API契约](https://github.com/excalidraw/excalidraw/blob/4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e/dev-docs/docs/@excalidraw/excalidraw/api/props/excalidraw-api.mdx#L125-L135)区分立即可撤销、稍后合并捕获与永不进入本地历史：`EVENTUALLY`只是暂缓捕获，所观察的变更可与下一次`IMMEDIATELY`一起进入历史，不能用它代替远端更新的`NEVER`；未被Store观察的字段不受该选项支配。这改变集成选择，但不是所有编辑器的通用API规则。**[一手：当前固定源码与文档；研究：接入边界]**

**关键反例：不记录远端操作，不等于撤销时绝不改变远端值。** 当前[同属性测试](https://github.com/excalidraw/excalidraw/blob/4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e/packages/excalidraw/tests/history.test.tsx#L2204-L2266)中，本地先把背景由红改蓝，远端再改黄；undo回红，同时更新redo历史以便恢复黄。若期间又有远端修改，历史还会随之调整。[分组与点序列测试](https://github.com/excalidraw/excalidraw/blob/4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e/packages/excalidraw/tests/history.test.tsx#L2370-L2463)也明确容许撤销覆盖远端新增部分，再由redo恢复。不能把这些语义写成所有贡献相互隔离，也不能用单个保留案例保证全部组合对象。测试直接引用[Figma作者的机制说明](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/#implementing-undo)：撤销、复制再重做到现在，不应意外改变文档，因此undo与redo会更新彼此的历史。它是不同作者的设计参照，因存在直接借鉴关系，不另计一份独立效果样本。**[一手：当前固定测试与作者原文；研究：反例及证据独立性]**

**后续接收者遇到的是另一项已修故障。** Obsidian集成维护者zsviczian在2025-06-13的[#9653](https://github.com/excalidraw/excalidraw/issues/9653)报告升级后连续移动、撤销会删掉原有图形，随后[定位到只传部分appState的调用](https://github.com/excalidraw/excalidraw/issues/9653#issuecomment-2972473334)。[06-14固定修复`60512f1`](https://github.com/excalidraw/excalidraw/commit/60512f13d51a6440809cf6f9d2ce84a76f74038c)不再把省略的elements替成空数组，并补“不相关appState更新不删除场景或历史基线对象”的回归定义；[原报告者随后确认问题解决](https://github.com/excalidraw/excalidraw/issues/9653#issuecomment-2972612450)，没有贴出受测SHA。当前固定版保留[对应接线](https://github.com/excalidraw/excalidraw/blob/4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e/packages/excalidraw/components/App.tsx#L4957-L4974)与[回归定义](https://github.com/excalidraw/excalidraw/blob/4c37956ba5f04ec342a9d9d5891a38f22c5b7b4e/packages/excalidraw/tests/history.test.tsx#L254-L283)，该历史故障已修，但不能替代多人并发验收。**[社区：接收者失败与修订后回执；一手：固定补丁与当前实现]**

**采用与停止条件。** 15 §10 已列撤销范围与协作冲突验收；单人整体回退仍可用快照。本链不证明全部协作场景稳定、普遍体验优势、工时下降或AI效果；有新增使用/冲突证据才续接。**[经验：采用与停止条件；研究：未验证范围]**


## Immich：减少同步层，也改变基础运行的依赖

核实：2026-10-16（UTC）。改变15 §10.4：复用现成能力并减少组件时，同时决定基础运行还应与哪些可选能力隔离。以下是2023–2024年的维护决策证据，不是AI原型效果或当前部署指南；只读公开源码与原帖，未运行应用、迁移、测试或模型。**[经验：采用判断；研究：范围]**

**删除的是自建同步层。** 原方案已用现成Typesense，并非自制搜索引擎。[v1.91.0说明](https://github.com/immich-app/immich/discussions/5723)把Postgres与Typesense的同步复杂度、资源负担列为替换原因；[2023-12-08固定补丁`1e99ba8`](https://github.com/immich-app/immich/commit/1e99ba816752bbafe7bbe0d3a27750ef6ed46058)删除同步队列、定时flush、索引任务及Typesense容器，转用Postgres的pgvecto.rs扩展。旧版`429ad28`的[搜索开关](https://github.com/immich-app/immich/blob/429ad28810efc31aef6814961fdb7bfb59d328ae/server/src/domain/system-config/system-config.core.ts#L202-L214)可关闭搜索；新版[配置](https://github.com/immich-app/immich/blob/1e99ba816752bbafe7bbe0d3a27750ef6ed46058/server/src/infra/database.config.ts#L15-L28)启用启动迁移，[迁移本身](https://github.com/immich-app/immich/blob/1e99ba816752bbafe7bbe0d3a27750ef6ed46058/server/src/infra/migrations/1700713871511-UsePgVectors.ts#L6-L36)不按功能开关跳过扩展创建和向量列转换。删代码支持职责转移，不证明总体维护成本下降。**[一手：固定前后产物、维护者说明；研究：边界]**

**可选原型曾尝试，未保留为完整支持路径。** [#5954维护者回复](https://github.com/immich-app/immich/discussions/5954)称，初期因维护负担暂未兼容pgvector；也试过关闭ML后不依赖向量扩展。[固定原型`af20c9a`](https://github.com/immich-app/immich/blob/af20c9adbb3c40543f3009be292ff04433078b8d/server/src/infra/database.config.ts)确实把向量迁移拆到另一DataSource，只在发现扩展时执行。维护者报告应用启动可行，但E2E、CLI初始化与实体布局未协调好；这解释了收窄范围的原因，不是本轮复跑，也不能把仅启动成功写成方案已验收。**[一手：原型与作者解释；研究：验证范围]**

**计划受阻与实际失败分开。** #5954的既有使用者btajuddin于2023-12-24表示，新要求阻碍其迁到已有RDS Postgres；这是部署计划被阻，未报告该目标上的失败运行。另一个使用者在[#5911](https://github.com/immich-app/immich/issues/5911)报告v1.91.4连接timescaledb-ha附带的0.1.13扩展时启动失败，错误要求0.1.11；[维护者回应](https://github.com/immich-app/immich/issues/5911#issuecomment-1866629131)指出当时后续补丁版本有不兼容，不能仅放松版本限制。两者支持把基础部署纳入替换取舍，不证明所有环境均不可用。**[社区：接收者报告；一手：维护者说明]**

**后来补兼容，仍不等于原有实例能直接切换。** [#6785／固定`56b0643`](https://github.com/immich-app/immich/commit/56b06438906a8eff4113f58fd5922ac22bde38bd)加入pgvector支持；[v1.95.0说明与后续回帖](https://github.com/immich-app/immich/discussions/7252)明确当时只支持新实例或未经历向量迁移的旧实例作此选择。同帖另一使用者SISheogorath于2024-02-29报告升级失败、考虑停用，03-05又报告自行迁到pgvector后可用，称仍需重新索引人脸，并报告数据库故障转移测试通过。维护者认可其流复制需求，同时保留默认扩展的功能取舍理由。该用户未提供受测SHA及完整迁移产物，不能把自报写成官方支持流程、长期稳定，或补记btajuddin成功。**[一手：固定修订与发布边界；社区：同人后续使用；研究：归属与局限]**

**采用与停止条件。** 基础运行约束的取舍见 15 §10；本例不要求所有功能可关闭或重建双实现。当前[官方文档](https://docs.immich.app/administration/postgres-standalone/)已说明3.0移除pgvecto.rs支持、迁向VectorChord，因此上述配置只能作历史证据。本链没有净维护收益或AI效果数据；后续不扩写安装和迁移步骤。**[经验：采用与停止条件；一手：当前文档；研究：未验证范围]**


## Open WebUI：少一个服务之后谁维护协议适配

2026-10-16（UTC+8）补核，归 M3 复用与接管。**改变的建议**：15 §10 分开目录变化与协议语义变化；动态发现不能代替后续请求兼容维护。**[经验：条件判断]**

**同一接收者的窄替代。** [原需求 #3288](https://github.com/open-webui/open-webui/issues/3288)是集中使用 Anthropic 并保留聊天记录。moodler [2024-07-05 报告](https://github.com/open-webui/open-webui/issues/3288#issuecomment-2210919315)独立 Pipelines 曾工作，随后连接及模型读取失败；没有确认根因。[07-10 回执](https://github.com/open-webui/open-webui/issues/3288#issuecomment-2219524566)确认应用内 Function 满足原需求，不再需要额外 Pipelines 容器。它支持选择较窄运行路径，不证明全部输入、长期使用或总成本。**[社区：原请求者前后自报]**

**首次接通以后还有两类更新。** 后续其他用户报告模型目录缺项；[2025-08-27 自修](https://github.com/open-webui/open-webui/issues/3288#issuecomment-3229545761)还需调整请求参数，不能只增加模型名。[接收者要求](https://github.com/open-webui/open-webui/issues/3288#issuecomment-3497710690)是安全更新，不是每次让管理员手改 Function。这些不是 moodler 的长期回访，不能拼成同人成功后失败的轨迹。**[社区]**

**2026 接手产物把两种维护具体分开。** atnjqt 的 [1d1a87d 镜像](https://github.com/atnjqt/anthropic-owui/commit/1d1a87dad9d7ab440dbdd7eb5462418605ca3067)标注来自原 Function、版本 0.2.5，不是上述 2024 运行的确切快照。[83870a5](https://github.com/atnjqt/anthropic-owui/commit/83870a5673310a3bcf53a78adf76dedf970ae804)于 2026-02-18 增加模型目录 API，失败仍回静态表，同时调整采样参数选择；[459dbde](https://github.com/atnjqt/anthropic-owui/commit/459dbde683846bdb820fabab8f3451bf1bbdfcdb)于 05-28 继续按模型分支省略特定参数。可见自动发现条目与构造合法请求是不同责任；后一个补丁只证明实现变化，未核其接收者复测。文件头声明 MIT，本仓只分析机制、不复制部署脚本。**[一手：固定前后代码]**

**取舍与停止。** 单一稳定需求且有人维护时，保留窄适配；只有目录缺项就先改目录来源。协议不断变化、接收者无法持续承担修订时，比较受维护的原生连接、共享适配层或减少支持范围；这里没有证明集中网关必然更省。历史 Pipelines 对照不构成今天新增该服务的安装建议。未测模型、服务、维护工时及总成本，也不确认 AI 生成归属；取得同任务升级后使用回执，才继续评价长期收益。**[经验：采用边界]**


## Zed：查找与编辑共用结果，不等于共用退出语义

**原任务与实际保留。** 2026-10-16（UTC）核实，改变15 §10.3的入口与编辑边界。[原需求 #8279](https://github.com/zed-industries/zed/issues/8279)要边输入边查、键盘看预览且不离开当前tab；[poeck](https://github.com/zed-industries/zed/pull/43790#issuecomment-3751786980)则说明短导航适合modal，数小时全项目替换仍需不会误关的结果tab。[gustavotrott于03-01](https://github.com/zed-industries/zed/pull/46478#issuecomment-3979919817)实际改用ozacod分支替代官方版，并报告路径挤占代码、点击后方向键失效；[05-29仍愿留旧构建](https://github.com/zed-industries/zed/pull/46478#issuecomment-4579098646)以保住功能。该行为证明有使用者承担旧版成本保留工作流，不证明所有人都值得这样做。**[社区：原需求与使用报告；经验：采用范围]**

**竞争原型为何收窄。** [#44530的维护者试用](https://github.com/zed-industries/zed/pull/44530#issuecomment-3657139459)在Chromium发现等待完整结果造成延迟；[再试](https://github.com/zed-industries/zed/pull/44530#issuecomment-3662440161)认可流式显示，但仍遇冻结，并指出原搜索也可能有性能问题。另一原型[#46478的独立复编回执](https://github.com/zed-industries/zed/pull/46478#issuecomment-3884219629)认可修订，却仍报告拖动略卡和输入预填问题。维护者[明确先缩小再整合](https://github.com/zed-industries/zed/issues/56037#issuecomment-4421592045)，最终以[#59604](https://github.com/zed-industries/zed/pull/59604)扩展通用picker，保留两视图。这些不是同人同任务的配对比较，不按PR行数或受欢迎程度排胜负，也不能把未合入解释成需求退出。**[一手：维护者取舍；社区：试用与复编]**

**固定交付保留任务交接。** 06-19合入的[`ccf4058`](https://github.com/zed-industries/zed/commit/ccf4058b7a6b05207d4f1dd25106ec5fc439cc74)，其[text_finder.rs](https://github.com/zed-industries/zed/blob/ccf4058b7a6b05207d4f1dd25106ec5fc439cc74/crates/search/src/text_finder.rs)在转为project search时搬移当前匹配、查询和选项，并接续未完成搜索流；反向也有转换入口，不只是复制查询后重跑。[preview.rs](https://github.com/zed-industries/zed/blob/ccf4058b7a6b05207d4f1dd25106ec5fc439cc74/crates/picker/src/preview.rs)明确只读、禁输入，把编辑留给multibuffer。[1.9.0-preview发布说明](https://zed.dev/releases/preview/1.9.0)列出两视图共享搜索，只证明交付范围。双入口是否值得保留，应看短查找与持续处理是否都真实需要，以及切换是否丢任务状态。**[一手：固定源码与发布；经验：选择条件]**

**同一原使用者又补回小编辑任务。** [07-29的请求](https://github.com/zed-industries/zed/discussions/61867)说明逐结果改一两行仍需反复开tab、保存、关闭、再开查找器；[09-27回报](https://github.com/zed-industries/zed/issues/56037#issuecomment-5857772163)已日常使用自己的可编辑预览fork。固定新增[`4e917b6`](https://github.com/gustavotrott/zed/commit/4e917b61db53f4d5e723070b178d420aa7dcc2bb)相对父`eef824cce5d6cfbac34d9c8af6d84ba7132dcef2`加入默认关闭设置、焦点切换及换结果／关闭自动保存；预览内Escape回查询，不是撤销。补丁的文件查找器测试定义覆盖编辑不误关、换结果保存、Cancel关闭也保存，未运行。作者明确AI辅助编写、因不确信符合贡献要求未提PR，不能写成上游拒绝AI；[10-07同步上游](https://github.com/gustavotrott/zed/commit/cf5df746c655dc6a6eb97f7757891ab79cc2f96f)仅证明代码跟进。**[社区：原使用者后来自用自报；一手：固定前后补丁]**

**成本、撤回与未闭合处。** 先比较现成结果编辑入口与可编辑预览省下的往返，再计焦点、共享缓冲区、保存失败和更新维护责任。该fork保存走异步`save_buffer`并记录错误，不能据此宣称恢复已验证；如果使用者把Escape当放弃修改，或保存失败不能恢复，应退回只读预览与正常编辑器，不能靠省步抵消语义改变。[早期使用者自己不确定构建起点](https://github.com/zed-industries/zed/pull/46478#issuecomment-4809497462)，不把自报绑定到猜测SHA；后期fork尚无第二人复测或上游采用。只读公开原帖、元数据和补丁，未构建、运行应用／测试、读取私人会话或基准轨迹；无量化净成本、长期收益或AI效果结论。取得相同任务的独立复测或保存失败回执后才继续扩写，不把本链变成当前产品推荐。**[经验：采用与撤回条件；研究：证据边界]**

## NVDA：追最新状态还是按序消费输出

2026-10-16（UTC）核实，归 M3 主线一，改变15 §10的连续输出选择。下列日期按公开记录所示；没有据补丁合入日期推定正式版发布日期。**[研究：范围]**

**同一改版承接了两种真实需要。** [#20888](https://github.com/nvaccess/nvda/issues/20888)的mehgcap于2026-09-24报告：在2026.3 beta2、Windows 11 25H2、cmd本地及SSH中，`git pull`有时只读提示符，`git log`只读末尾而非从最近提交开始；2026.2没有该问题。对他而言，查询后自动听到结果就是原工作流。[另一使用者mdlawler](https://github.com/nvaccess/nvda/pull/20898#issuecomment-5885058596)于09-29反对直接撤回：大量输出时不能及时Ctrl+C比需要手动回看更糟；他仍希望逐行读，但由Control明确停止本轮待播内容，而非马上随新输出恢复播报。这些不同人的自报不代表所有用户接受丢行。**[社区：直接使用报告]**

**固定补丁包含三个不同决定。** [#20177](https://github.com/nvaccess/nvda/pull/20177)于05-26合入[`5344d4bdab360be099b45ba2b21565ebf662fe89`](https://github.com/nvaccess/nvda/commit/5344d4bdab360be099b45ba2b21565ebf662fe89)。`source/NVDAObjects/behaviors.py`把每批限到最近100行、用generator每5行让出执行，并在新批次到来时取消上一批尚未完成的报告；语音取消也会取消generator。让出主线程、截断单批与新批替换旧批不是同一选择，不能只用100行上限解释短命令漏读。作者用终端洪流说明动机，不构成所有输出都以末尾最有用的证据。这里是播报路径的省略，不能写成终端存储内容被删除。**[一手：固定源码与作者说明；研究：机制边界]**

**反馈还存在宿主反例。** [nvdaes于09-25](https://github.com/nvaccess/nvda/issues/20888#issuecomment-5826391923)在2026.3beta2（2026.3.0.57857）、Windows 10.0.26200不能复现；[mdlawler于09-29](https://github.com/nvaccess/nvda/issues/20888#issuecomment-5884776542)报告cmd经Windows Terminal／openconsole输出正常，而conhost不正常，跳过提示音也有差异。不能把一份成功回执推广到另一宿主，或据不能复现撤销原使用者的需求；这些自报未独立运行，也未排除全部环境差异。**[社区：反例与适用范围]**

**实际接收决定是回滚，替代尚未验收。** [#20898](https://github.com/nvaccess/nvda/pull/20898)于09-29以[`0e48954c8967f148e36ff2704784078e82fcc012`](https://github.com/nvaccess/nvda/commit/0e48954c8967f148e36ff2704784078e82fcc012)合入beta，撤掉上述generator与截断，并删除后续加入的跳过提示音配置，恢复同步逐行报告。维护者要求下一版同时避免性能问题与漏掉有用内容；[michaelDCurran](https://github.com/nvaccess/nvda/pull/20898#issuecomment-5885643276)还自报原两项改版（#20177／#20649）合入后长期运行变慢与漏读，不能说原修订已全面解决卡顿。[原洪流问题#20902](https://github.com/nvaccess/nvda/issues/20902)仍开放，10-06维护者要求先讨论架构及系统／手工测试计划。回滚恢复旧路径，不证明原洪流需求已解决；截至本轮没有取得回滚后原报告者复测。**[一手：固定回滚与维护者决定；社区：运行报告]**

**选择、代价与撤回。** 如果任务是追当前进度，可以考虑合并已被新状态替代的通知，并保留必要结果和回查入口；代价是用户可能需要主动查历史，跳过提示本身不恢复信息消费。若任务是听取查询或诊断结果，比较保留队列、分批让出执行和用户取消，另验积压、取消的持续范围及后续输出；这只是有需求依据的设计候选，尚未由本链证明可靠实现。不要仅凭文本仍在缓冲区就宣称体验无损，也不要机械保留所有自动播报而牺牲操作控制。短结果后紧跟提示符、大量输出与取消后继续到来的内容应分别验收；普通结果漏读或控制失灵时撤回统一策略，按任务和宿主重选。**[经验：采用与撤回条件，未验证候选]**

本轮只读原帖、PR元数据与固定补丁；未运行NVDA、Windows终端或测试，无具体版本推荐、AI归属或量化收益。取得替代实现及对应使用者的结果/取消复测后再判断效果。**[研究：证据边界]**

## GitHub Desktop：保住工作与保留旧绕路

**核实：2026-10-17（UTC+8）；改变15 §10第4项的回退选择。** [#16442](https://github.com/desktop/desktop/issues/16442)在3.2.0报告分支改名后stash从GUI消失；[#16832](https://github.com/desktop/desktop/issues/16832)又暴露先切到main再改非当前分支时连提醒也没有，维护者[承认漏掉该路径](https://github.com/desktop/desktop/issues/16832#issuecomment-1578915511)，选择使stash随分支改名。此为界面关联/可达问题，未证Git对象永久删除。**[社区：原始使用报告；一手：维护决定]**

[#16512](https://github.com/desktop/desktop/pull/16512)比较先应用再重建、直接改reflog与重建提交消息：先应用可能产生冲突，直接改reflog则要自行处理锁与reflog细节，最终保留tree和parents，按新消息 `commit-tree`→`stash store`→drop旧条目；[固定实现](https://github.com/desktop/desktop/blob/1ba35feea9b78935b51b58a07625cb6593ef01e2/app/src/lib/git/stash.ts#L89-L115)可核此顺序，代价是stash顺序变化，不是原SHA不变。初次合入仍受beta flag控制，[3.3.1发布PR](https://github.com/desktop/desktop/pull/17313)的[固定head开关](https://github.com/desktop/desktop/blob/831a92def4ad94d16189978726c6772902026781/app/src/lib/feature-flag.ts#L96-L98)确认该版本已正式启用，不据此认定首发版本。**[一手：选择理由与固定源码]**

但另一任务依赖旧行为：[#17348](https://github.com/desktop/desktop/issues/17348)的3.3.1用户原来用连续改名选择多份stash，新迁移遮住目标名字已有stash，破坏了这个工作流。用户自报仍能用临时commit取回，并接受多stash、分支迁移或配置等方向；[维护者9月11日决定](https://github.com/desktop/desktop/issues/17348#issuecomment-1714418311)经讨论保留修复，理由是原改名不可达反馈优先，转而指向多stash需求。**关闭不是该用户接受或迁移成功**，维护者优先级也不是总体满意度证据。必要结果是保存、找回多份工作，不能从本例推出旧路径都不值得保留。**[社区：实际负反馈与取回自报；一手：维护者取舍]**

后来的多stash GUI候选也不是现成答案。[#20845](https://github.com/desktop/desktop/pull/20845)于2025-08-26关闭未合并；[作者一周自测](https://github.com/desktop/desktop/pull/20845#issuecomment-3191193566)之后，[非作者仍报第二次创建要覆盖](https://github.com/desktop/desktop/pull/20845#issuecomment-3192268486)。其[固定head创建流程](https://github.com/desktop/desktop/blob/c0d134c9460b36d2607ddb10a26b763e9f37faf7/app/src/lib/stores/app-store.ts#L7016-L7038)保留创建后drop旧stash；源码支持连续路径仍须核对，但报告未绑定此SHA，不能据此宣布唯一根因。维护者[拒收说明](https://github.com/desktop/desktop/pull/20845#issuecomment-3223530152)还要求考虑单文件、外部stash与既有流程，不等于判所有代码不可用。另一用户[继续用CLI的自报](https://github.com/desktop/desktop/pull/20845#issuecomment-3223541615)是替代使用线索，不能补成原用户迁移成功；每份用不同本地分支也只是具体提议，不是已测低负担方案。**[一手：固定候选与接收决定；社区：失败与替代自报]**

**采用与撤回。** 先定义必要结果及哪些旧动作只是其中一条路径，再比较回退、修复加取回入口或明确缩小支持；保存与恢复验收没覆盖，不能以修复主任务为理由忽略旧工作。回退会重引已确认的不可达问题时，不仅凭一次真实反对就整体回退；新路径造成更大风险、必要工作仍无法取回或替代负担不可接受时，也应重新选择，不能一味维护新实现。临时提交、CLI或多分支都增加操作；没有同一使用者完整前后对照、工时／失误率或净收益。本轮未运行GitHub Desktop／候选，也没有AI因果样本，不作为当前工具推荐。**[研究：条件选择与边界]**

## Restic：复用命令还是底层操作

核实：2026-10-17（UTC+8）。改变15 §10的同仓复用选择；历史版本与使用自报，不是当前备份操作指南。**[研究：范围]**

**原任务与有损替代。** [#14](https://github.com/restic/restic/issues/14)要求从旧快照排除误备份文件，保留其余历史。维护者[收窄为移除文件](https://github.com/restic/restic/issues/14#issuecomment-359188505)，重命名等用途另议。后来[使用者的挂载再备份脚本](https://github.com/restic/restic/issues/14#issuecomment-1208281468)自报可用，但明确损失时间精度、标签和原路径；不能因能拼现成命令，就认定它与原任务等价。**[社区：实际替代自报；一手：范围决定]**

**复用哪一层确实改变了实现。** [#2731评审](https://github.com/restic/restic/pull/2731#discussion_r452781709)建议直接调用已有`runForget`，集中删除逻辑并接上`prune`。接手维护者却认为[错误处理与日志协调](https://github.com/restic/restic/pull/2731#discussion_r967624340)更复杂，[中途升级锁](https://github.com/restic/restic/pull/2731#discussion_r967624385)没有成功保证，且[全部prune参数](https://github.com/restic/restic/pull/2731#discussion_r967623957)会挤满新入口。最终[固定实现72196e5](https://github.com/restic/restic/blob/72196e54c0e71d4d2ae26314173f57914b09ba28/cmd/restic/cmd_rewrite.go)复用排除规则收集与仓库操作，默认保留旧快照；指定`--forget`时预先取独占锁，先保存新快照成功再移除旧快照，`prune`另行执行。并非拒绝复用，也不是证明直接删除普遍更安全。**[一手：评审取舍与源码]**

**接收者完成了清理，而非只看到新副本。** 非作者NovacomExperts[首次测试及后续65GB清理](https://github.com/restic/restic/issues/14#issuecomment-624683401)认可保留原件的默认，不赞成默认危险操作；2022-11又[明确绑定72196e54](https://github.com/restic/restic/pull/2731#issuecomment-1312202488)，在三主机、版本1仓库选择特定主机的较旧快照，执行`rewrite --forget`后再`prune`，自报830GB降至319GB、包括read-data的检查和恢复测试通过，仍保留原仓库备份。其筛选用了`--keep-last 30`，不能照其“30天”措辞推成按日筛选。这是特定任务完成的自报，不能归因为复用层级单项收益。**[社区：绑定提交的使用回执]**

**分步处理留下另一条未完成路径。** [#4055](https://github.com/restic/restic/issues/4055)提出推迟移除或漏用`--forget`后，难批量识别对应原件；给旧快照加标签会改变ID，也可能影响按标签分组。[#4079](https://github.com/restic/restic/pull/4079)于2022-12-13（UTC）合入`7bdb985dde115c5779138037b19b853c2fdecf42`，改为每次记录直接来源ID；[v0.15.0源码](https://github.com/restic/restic/blob/v0.15.0/cmd/restic/cmd_rewrite.go)含该修订。但2024年[另一使用者](https://github.com/restic/restic/issues/4055#issuecomment-1919125299)仍因解析`Original`困难，删除新快照后重跑；版本未给，不能说他已用了该补丁或补丁失效。该issue仍开放；字段补齐不证明迟到确认已易用，更不授权默认删原件。**[一手：修订与状态；社区：后续负担]**

**采用边界。** 同仓新命令应比较复用完整命令、已有规则／操作及保留手工步骤的总负担；接口契约合适时成熟CLI仍可用，外部调用者不据此依赖私有API。拆成多步时验候选与原件可对应、最终结果可完成；需要补窄的收尾入口时，也先保留明确的删除选择。仅只读公开源码与报告，未运行Restic／测试或接触备份数据，无AI效果、普遍性能或维护成本结论。**[经验：选择；研究：局限]**


## shadcn：弹层组合先保所需模态行为再选局部修复

核实：2026-10-17（UTC+8）；历史事件日期为UTC。改变23的交互修复选择：组合后的现成组件失效时，比较局部容器适配与兼容组件替换；目标仍需模态隔离时，撤掉模态不是同等修复。以下是历史组件维护与用户回执，不是AI生成效果；只读公开资料与固定源码，未运行应用、浏览器或测试。**[经验：采用判断；研究：范围]**

**原任务是弹窗内完成选择。** [#9712](https://github.com/shadcn-ui/ui/issues/9712)于02-22报告列表可见但点击无效，并提供公开v0复现入口；“键盘可能仍工作”是报告者的保留说法，不是通过记录。另一作者的[#9770](https://github.com/shadcn-ui/ui/issues/9770)在Firefox／Chrome报告同样的Dialog内点击问题，设`modal={false}`后可选。v0地址只证明复现入口，不能据此认定原应用由AI生成。**[社区：原任务与跨作者报告]**

**一个窄补丁保留两种现成组件。** [#9747](https://github.com/shadcn-ui/ui/pull/9747)的提交[`e166942`](https://github.com/shadcn-ui/ui/commit/e166942884a926cfc71709fe79cd5118abeb7c75)真实父为`fbdf6c02c1172662408cb9d70173737ccef6814f`；[父版Combobox](https://github.com/shadcn-ui/ui/blob/fbdf6c02c1172662408cb9d70173737ccef6814f/apps/v4/registry/new-york-v4/ui/combobox.tsx)从`@base-ui/react`导入，Portal未接收容器，[同版Dialog](https://github.com/shadcn-ui/ui/blob/fbdf6c02c1172662408cb9d70173737ccef6814f/apps/v4/registry/new-york-v4/ui/dialog.tsx)从`radix-ui`导入。[修后Combobox](https://github.com/shadcn-ui/ui/blob/e166942884a926cfc71709fe79cd5118abeb7c75/apps/v4/registry/new-york-v4/ui/combobox.tsx)只增加可选`container`并传给Portal，调用方仍须提供正确的挂载目标。[lukas-cc](https://github.com/shadcn-ui/ui/pull/9747#issuecomment-4035229529)说已手动做同样修改；[monkir](https://github.com/shadcn-ui/ui/issues/9712#issuecomment-4363128243)于05-02提供同机制代码并自报可用。两者没有绑定完整复测环境，后者还将问题概括为定位错误，不能拼成该PR的独立端到端验收。PR截至核实仍open，未合并；示例中的ref／ref.current挂载时序也未经本轮验证，不作为可直接复制的配方。**[一手：固定前后源码；社区：独立使用回执；研究：边界]**

**另一条路是换兼容的Dialog，而不是继续补自己的模态实现。** [nshaikhinurov于02-24](https://github.com/shadcn-ui/ui/issues/9712#issuecomment-3950152166)报告把Radix Dialog换成Base UI版本后可用，同时明确不确定是否破坏其他行为。[quocanlikebanana于04-09](https://github.com/shadcn-ui/ui/issues/9712#issuecomment-4215070166)先报告`modal={false}`使背景blur消失，随后[回报替换Dialog解决](https://github.com/shadcn-ui/ui/issues/9712#issuecomment-4215084271)。这支持按现有需求比较局部适配与替换，不支持宣布替换已全面无障碍通过；背景效果变化也不等于已观察到焦点安全失败。**[社区：实际取舍与复试]**

**源码把鼠标隔离与焦点约束分开。** PR把原因统称为focus trap，但[Radix固定提交`22473d1`的Dialog](https://github.com/radix-ui/primitives/blob/22473d16404bfd446305db5b6c9308aece99fdec/packages/react/dialog/src/dialog.tsx#L259-L297)分别设置`trapFocus`和`disableOutsidePointerEvents`，并以`aria-hidden`对辅助技术隐藏其他内容；[DismissableLayer](https://github.com/radix-ui/primitives/blob/22473d16404bfd446305db5b6c9308aece99fdec/packages/react/dismissable-layer/src/dismissable-layer.tsx#L112-L163)另管理body的pointer-events和允许交互的层。非模态分支关闭前两项约束，Overlay也仅在模态分支渲染。这是报告时点之前的机制对照，未确定报告者安装的确切Radix版本，不能据此声称复现了所有根因。[官方Dialog契约](https://www.radix-ui.com/primitives/docs/components/dialog)区分两种模式，并说明模态焦点约束和Esc关闭后的焦点返回。**[一手：固定源码与契约；研究：归因范围]**

**最小采用与停止。** 仍需模态的任务先保留隔离要求，试局部Portal接入或已兼容的组件组合，再按实际页面检查选值、滚动、Tab／Shift+Tab、Esc关闭与焦点返回；已有测试覆盖则复用。若容器适配造成裁切或焦点／恢复路径不成立，撤回该适配并比较组件替换，不堆补丁直到一次点击成功。需求允许背景交互时，可明确选非模态。此处完整路径是工程验收建议，公开回执只支持有限交互成功；没有维护净成本、完整恢复或AI收益结论。**[经验：交付取舍；研究：未覆盖范围]**

## Clink：先试已有入口再决定扩功能

核实：2026-10-17（UTC+8）。改变 15 §3 的选择：用户请求扩容某个界面时，先核真实任务能否由已有专用入口完成；本例由实际使用回执改变了扩功能与改善入口的取舍；能力明显缺失时可以直接补齐，不必等此类回执。下列链证明既有入口被采用，不证明后来修改默认的收益，也无 AI 生成归属。**[经验：建议；研究：证据范围]**

- **原选择与请求。** 2025 年的[固定聚合实现 `fa49bb8`](https://github.com/chrisant996/clink/commit/fa49bb85b88e39590d0935debdbe592ba73d8cf6)让建议列表优先显示历史，其他来源有独有建议时只保留前三条历史，余位分给其他来源。2026-01-14，[用户 dale-roberts 的 #831](https://github.com/chrisant996/clink/issues/831)报告日常使用 Clink 1.9.9：喜欢 F2 建议列表，但想查更多历史时须关闭列表再翻页，提议增大历史数量或让上下方向分别遍历历史与补全。此时短列表和专用历史弹窗均已存在。**[一手：补丁；社区：用户任务]**
- **先试已有路径，回执改变方案。** 维护者引导尝试 Ctrl-Alt-Up 的历史弹窗及 F4 搜索／过滤切换。[用户先确认能完整列历史并过滤](https://github.com/chrisant996/clink/issues/831#issuecomment-3751967277)，[1 月 19 日进一步描述实际操作](https://github.com/chrisant996/clink/issues/831#issuecomment-3770199738)：先输入 `pyth` 再开弹窗筛前缀，在弹窗内输入参数进一步做包含过滤；继续保留 F2 做补全。他此前多次读文档仍没认出两个历史入口的差别。**[社区：同一用户采用回执，非计时实验]**
- **保留短列表，改善通往已有能力的入口。** [维护者解释](https://github.com/chrisant996/clink/issues/831#issuecomment-3752308423)短列表面向每次输入后的建议，更多历史交给按需弹窗；其提到的 25ms 历史收集预算只是实现理由，不是扩大列表必然变慢的实测。[拒绝上下分流](https://github.com/chrisant996/clink/issues/831#issuecomment-3769575333)还因为会破坏顺序遍历、环绕与熟悉的操作方式。1 月 24 日[固定补丁 `b1c3e51`](https://github.com/chrisant996/clink/commit/b1c3e516d5ba17c1941afa3e154bbda4876f7bf8)只把 F7 默认从 `win-history-list` 换成 `clink-popup-history`；[文档补丁 `cdc3617`](https://github.com/chrisant996/clink/commit/cdc36173687beabfbdf12c39909a33835e38a94a)在入门和建议列表处明确 F7／Ctrl-Alt-Up、按已输入内容筛选和弹窗内继续过滤。旧命令保留、默认键解绑；没有把短列表扩成完整历史。**[社区：取舍理由；一手：固定补丁]**
- **反证与验收边界。** 采用回执早于 1 月 24 日默认／文档改动，不能记为改后复测。7 月另一用户 ganego 在 [#888](https://github.com/chrisant996/clink/issues/888)仍报告不知道 F7 弹窗可以直接键入搜索，现有提示只让其看到删除／执行；[维护者回应](https://github.com/chrisant996/clink/issues/888#issuecomment-5025175323)权衡提示可发现性、终端宽度与视觉负担，未据此补齐所有提示。这支持分别验“已有入口能否完成任务”和“用户能否发现入口与动作”，不支持仅改默认或补文档就宣称解决。没有当前版本全面可用性、长期采用或 AI 净收益数据。**[社区：独立后续反馈；研究：边界]**
