主线：一，发现值得做的软件
改变的建议：15/24 先让试用者解释核心结果与实际动作，比较明确含义，再决定最小修改与是否继续扩写
新证据：三条产品反馈链与两项创业随机试验；区分呈现理解、需求去留及AI效果的迁移边界，不合并样本或收益统计

# 产品反馈：从看懂核心结果到修改版的再次验证

## Reset Alerts：反馈与作者修改报告
观察日期：2026-10-13（UTC+8）。下列发帖日期按 GitHub 页面所示记录；页面未给出可核对的具体时间，不推定其 UTC+8 发帖时刻。

### Reset Alerts：反馈与作者修改报告 · 事实与来源

[Codex Discussion #53200](https://github.com/openai/codex/discussions/53200)：10 月 11 日，birthdays-app 介绍 Reset Alerts，希望免去反复刷新公告账号，也想增加重置准时率、月度分布等统计。10 月 12 日，挪威访客 TheodorNEngoy 说，相对日期与 PT 时间不易跨时区理解，建议显示绝对日期及访客本地时间，另提可选时区选择器。他明确只查看了网站，未测试提醒送达，并注明评论由 Codex 辅助撰写。作者当天回复称，已把文本预览改为显示用户本地时间。**[社区：第一人称自述]**

### Reset Alerts：反馈与作者修改报告 · 可采用的小建议

请试用者在自己的使用情境中解释核心结果；若存在理解障碍，先做让结果可读懂的最小修改，再决定是否增加统计面板。附带提出的可选功能不自动成为实施清单。这是从反馈内容提炼的试用方法，并非作者已经遵循的完整工作流程。**[研究：条件推断]**

### Reset Alerts：反馈与作者修改报告 · 证据边界

本例只支持“具体试看反馈促成作者报告修改”。没有独立验证修改生效、提醒送达、持续使用收益或生产可靠性；官网静态 PT 文案也不足以验证动态本地时间预览。Codex 辅助的是评论，不能据此断言应用代码由 AI 生成；作者也未说放弃统计或实现了日期与时区选择器的全部建议。

## CodexIsland：方案、补丁与回滚
核验日期：2026-10-13（UTC+8）；案例发生于 2026-05，历史事件按原帖时区标注。只读公开 GitHub；未运行 Swift、未安装应用、未播放维护者附带视频。定位：任务一的产品选择证据，非模型生产力对照，非发布后用户收益证明。

### CodexIsland：方案、补丁与回滚 · 结论与建议

该案例比仅有“已修改”回复更进一步：有独立用户的具体使用需求、方案选择说明、视觉 QA 后再次修改的作者记录、逐提交源码和回滚、已合并产物。最值得进入正文的是：先确定反馈要减少什么负担，再利用既有状态、版面与真实数据做最小替代；为可读性改变图表编码时，要明确牺牲了哪一种比较能力，不能用漂亮原型中的占位指标冒充真实结果。

尚缺：初始代码由哪种 AI 生成的可核实记录；视觉 QA 反馈的独立原文或参与者身份；请求者在发布后再次使用并确认改善的记录。可确认 Claude 参与了该 PR 的代码审阅并促成一处无障碍修正。不能把仓库名称、分支名、CLAUDE.md 或后续 Codex 分支当成本 PR 的生成归属证明。

### CodexIsland：方案、补丁与回滚 · 1. 原需求：只用一个供应商，不希望另一个继续占位

2026-05-07，用户 honeybears 在 [issue #3](https://github.com/ericjypark/codex-island/issues/3) 说明自己只使用 Claude；关闭 Codex 后，图标与 expanded 中的数据只是变暗，仍占据屏幕。他要求 compact、peek、expanded 三种状态都完全隐藏被关闭供应商的元素。这是使用情境，不是单纯“再加一个功能”。

维护者 [首次回复](https://github.com/ericjypark/codex-island/issues/3#issuecomment-4394687502) 表示 idle/hovered 容易隐藏，但 expanded 如何保持整洁还需思考。

### CodexIsland：方案、补丁与回滚 · 2. 作者报告的方案比较：复用空出的区域

[PR #16](https://github.com/ericjypark/codex-island/pull/16) 描述四变体中选择 Repurpose：用腾出的半区展示仍启用供应商的模型用量/费用明细。作者给出的弃选理由为 Bloom 仅装饰、Shrink 丢失面板辨识度、Focus 范围更大且需维护两套布局。

这些取舍理由来自作者公开 PR 描述；原型计划链接指向未公开的 notes 文件，不能声称读过四套完整原型或独立比较过视觉效果。

[首实现 6d54a8d](https://github.com/ericjypark/codex-island/commit/6d54a8da8f5b682838fc2a106a76071c280c7d16) 落实：供应商元素完全隐藏；使用既有本地日志的数据来源建立模型明细；删除原型的手写 `burn 18%/h` 数字；删除原型脚手架。应说“复用既有本地数据来源”，不要夸大为整套新聚合与 UI 已经存在。新增代码仍包括明细聚合与视图。

### CodexIsland：方案、补丁与回滚 · 3. 作者报告视觉 QA 后再次变化；补丁可独立核对

[a999467](https://github.com/ericjypark/codex-island/commit/a99946775df7ad4fc9838ca69f87539eaa198516)，2026-05-10 14:37 UTC，提交说明将修改归因于视觉 QA 后的用户反馈。它将 5h/week 堆叠分区改成每模型一行的双层条形；理由是统一跨模型比例会把小用量模型压缩到近乎不可见。

源码核查位置：
- [ProviderBreakdown.swift 固定版本](https://github.com/ericjypark/codex-island/blob/a99946775df7ad4fc9838ca69f87539eaa198516/Sources/Views/ProviderBreakdown.swift)
- [CostStore.swift 固定版本](https://github.com/ericjypark/codex-island/blob/a99946775df7ad4fc9838ca69f87539eaa198516/Sources/Cost/CostStore.swift)

可以确认的实现：
- `JoinedModelRow` 按模型将 recent 与 week 数组合并，迭代 week 数组；recent 缺失时按零处理
- `OverlapBar` 对每一行计算 `weekAbsolute > 0 ? clamp(recentAbsolute / weekAbsolute, 0, 1) : 0`
- 有周数据时暗条占满该行宽；亮条按上述比例显示，但有最小 2pt 宽度，所以极小非零比例并不是严格按几何比例显示
- 尾列显示该模型周绝对量（token 或美元）；最多显示四行；费用指标按周费用降序
- 逐行归一化意味着条长不能跨行比较模型绝对用量。跨行比较必须读取尾列数值；不是免费提高可读性而保留所有原有含义
- 本地日志 token 与 API 价格估算不等于供应商官方订阅额度；滚动 5h/7d 的本地汇总不证明与供应商限额窗口或精确账期对齐。未检查任何私有日志
- `CostStore.summarize` 在同一次事件遍历中，把 recent 累加放在 week 条件内部，且仅累加正的 token/cost；这支持此实现内部 recent 累计不超过相应 week 累计的设计关系。不要外推为所有供应商 API 的 5h/周限额窗口天然包含，或已经核实全部时区、日志完整性、迟到事件与真实采样边界
- 源码说明包含“5h 是 today 的子集”等概括，不能照抄为普遍数学事实；滚动窗口在午夜附近会跨日。本文只依实际条件分支陈述

[baf27cc](https://github.com/ericjypark/codex-island/commit/baf27cc18cfd19deb77d22bf25067b96b670fd12)，14:38 UTC，作者再次报告根据用户反馈把图例 `wk` 改成 `week`。实际文本修改可见，反馈是否来自原 issue 请求者未知。

因此“第二轮反馈引起可见修改”成立于作者报告 + 补丁层；“独立用户第二次使用成功”尚未成立。

### CodexIsland：方案、补丁与回滚 · 4. 保留与放弃：不是所有尝试都留下

不对称轮廓在 [04abd1e](https://github.com/ericjypark/codex-island/commit/04abd1e548280f5537a7648d8ed6a12a29d9d8cc) 加入，随后由 [d43a637](https://github.com/ericjypark/codex-island/commit/d43a637dcb7cb6735157d2aca00facc1fc10cd04) 撤回。

维护者在 [最终审阅请求](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415630029) 明确说不对称轮廓已经尝试并撤回，要求不再作为遗漏追补。可直接核验提交序列中的一次回滚；“两次尝试”只是维护者说明，不应写成两次均已独立核查。

### CodexIsland：方案、补丁与回滚 · 5. AI 的可见作用与最后交付

[Claude 首轮审阅](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415551546) 发现 pill 视觉隐藏条件同时依赖 `pillsVisible` 与供应商可见性，但 VoiceOver 隐藏只依赖后者。

[Claude 最终审阅](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415630454) 再次要求修正；[db8d80b](https://github.com/ericjypark/codex-island/commit/db8d80bec7b7e82c2f5b86c2f0e4495b360a120f) 将无障碍隐藏条件同步为两者组合。这是可见 AI 审阅→实际修正，不等于证明 AI 生成整套原型，亦不是泛化审阅质量评测。

PR #16 于 2026-05-10 15:24:47 UTC 合并：merge `1a1b4886e9b3fdbc5a38b0a3a2bbb3a0869dfc75`，head `db8d80bec7b7e82c2f5b86c2f0e4495b360a120f`，base `30305197c70ddd52bcd120ef5f06c4095c02d14e`。

PR body 保留了早期说明，例如成本行取消条形、5h footer 汇总；a999467 后成本行已恢复按 dollars 计算的重叠条，最终叙述必须依据对应提交源码。不能把早期 body 的无条形成本行或 footer 当成终态。自动生成摘要还残留后来被撤回的不对称轮廓，亦不能据此宣称已交付。

维护者在 [issue #3 回报 Done 并附视频](https://github.com/ericjypark/codex-island/issues/3#issuecomment-4415686274)，issue 后于 5 月 13 日关闭。视频未播放，不能称为本侧视觉验收；未找到请求者确认。PR 的手工视觉 QA 清单仍未勾完；合并不能替代运行证明。

### CodexIsland：方案、补丁与回滚 · 6. 研究记录旁证与排除

- #23→#26 有频繁 hover→常显状态的真实需求与已合并补丁；无修改后独立使用确认，不另扩正文
- #24→#33 的 Pace Guide 仍开放未合并；issue 上“Thanks a lot”不能算发布后使用效果
- #4 的非刘海屏幕与 glow 请求可支持“无需逐字增加所有请求选项”：维护者复用 Low Power Mode 并选 Compact/Notch-style 预设。仅作旁证，不进入本轮正文，避免堆案例
- CineSplash 仅见简略 PR，未取得反馈过程；image-grids 是作者自述而无外部使用链，均降级
- CodexIsland #54 确有升级后失败反馈，但属于凭证维护问题，不能冒充产品探索

### CodexIsland：方案、补丁与回滚 · 7. 采用边界

支持：反馈改变布局/信息编码；作者明确记录替代方案与回滚；原型占位值被排除；AI 审阅对应可见修正。

不支持：AI 开发速度、成本或收益比例；初始 AI 生成归属；Repurpose 优于所有替代的普遍结论；独立用户发布后再次使用成功；所有图表含义已被真实用户正确理解；当前 main 仍与该历史版本完全相同。

下一可区分问题：寻找不同作者、明确说出安装/使用修改版后结果的原型案例。当前 #16 阶段已足够形成限定建议，不必继续等一条不存在的复测来阻塞正文。

## CodexBar：发布后的理解反馈
> 核实时间：2026-10-13 16:12（UTC+8）。读取公开原帖、PR、固定发布 tag 与补丁；未构建或运行上游，未做模型实验。

### CodexBar：发布后的理解反馈 · 采用判断

**✅ 试用修改版时，仍让使用者解释数值及据此会怎么做；不要用已有同名控件或渲染正确代替理解目标。** 本例的净新证据是不同使用者在已含颜色改善的发布版仍报告符号误读，促成可选符号惯例；不同于 CodexIsland 的作者视觉反馈与信息编码取舍。只更新 [15 §10](../15-task-playbooks.md#10-原型和一次性脚本)，不据此推荐更多设置或某个模型。**[研究：采用判断]**

**关键局限**：该用户未说明是否开启颜色，也未报告实际错误行动；最终符号版没有找到用户复测。因此不是“开启颜色后复测失败”，更不是已证明产品收益。**[社区：报告范围；研究：边界]**

### CodexBar：发布后的理解反馈 · 1. 原需求不是只有一种正确符号

| 原帖 | 直接证据 | 对取舍的意义 |
|---|---|---|
| [#2534](https://github.com/steipete/CodexBar/issues/2534)，WilliamK6，2026-07-31 | 升级后旧的百分比＋pace 组合消失；用户希望知道比可持续使用速度高/低多少，认可正数表示超前，也提出直接写 deficit/reserve | 耗尽时间不是同一个问题；旧符号有真实用户需求依据 |
| [#2842](https://github.com/steipete/CodexBar/issues/2842)，rsheyd，2026-08-10 | 要求正数表示储备、负数表示超用，目的是判断应放慢还是还有余量 | 同样的 pace token 名称可以指相反的语义惯例 |
| [#3428](https://github.com/steipete/CodexBar/issues/3428)，jb510，2026-09-05 | 符号含义容易忘；要求默认关闭的颜色设置，绿 reserve、红 deficit，保留符号和现有 token | 选择补充颜色，而非新增一套 token 或改变所有人的默认值 |

表内为 **[社区：用户原帖]**，取舍解释为 **[研究]**。#2842 的[后续回复](https://github.com/steipete/CodexBar/issues/2842#issuecomment-5240880100)说实际试了 Weekly pace，但显示横杠，不能写成该用户已成功使用符号版本。

### CodexBar：发布后的理解反馈 · 2. 修改、发布和另一用户的再次反馈

1. **颜色补丁合并。** [#3429](https://github.com/steipete/CodexBar/pull/3429)于 2026-09-11 合并为 `fe7a45ffab530e6b850800fd4a01ef1972709b0d`。[维护者接受](https://github.com/steipete/CodexBar/pull/3429#issuecomment-5627798767)的是窄的默认关闭选项。已读 diff 用独立数值 delta 选红绿，并修复模板图像剥离颜色的输出路径。作者报告本机、合成 native 场景及测试通过；本轮未复跑或检查图片像素。**[一手：补丁；社区：采用与运行报告]**
2. **发布版包含颜色逻辑。** `v0.72.0`解析到 [`cfee869f3181379dd074adb9feeb5f19a994356a`](https://github.com/steipete/CodexBar/commit/cfee869f3181379dd074adb9feeb5f19a994356a)。[固定 renderer](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/Sources/CodexBar/MenuBarLayoutRenderer.swift)的 `colorPace` 分支按 delta 正负取绿/红；blob 为 `5c6130c7ab7b600bbe0ee205a307c94f742f5a3c`。[UI 文档](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/docs/ui.md)明确默认关闭；[formatter](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/Sources/CodexBar/MenuBarDisplayText.swift)仍将非负 delta 显示为正数，没有符号设置参数。这是直接读取发布源码，不是按日期推断。**[一手]**
3. **另一个人实际使用后仍觉得含义相反。** LPFchan 在 2026-10-09 的 [#4386](https://github.com/steipete/CodexBar/issues/4386)注明 **0.72.0、macOS 15.7.4 arm64**：菜单栏 `+23%` 一眼像好消息，popover 却显示 deficit。他明确联系 #3429，认为颜色有所帮助但未改变符号，提出保留旧默认的可选反转。用户未说当时开启颜色、高对比或自己具有色觉障碍，也没说实际多用额度；“很多用户”只属其概括。**[社区；研究：范围限定]**
4. **从颜色改为可选显示语义。** [#4394](https://github.com/steipete/CodexBar/pull/4394)于 2026-10-09 合并；[固定补丁 `22372da3bac3bb0c5ea39095c6d73fb4a525f37c`](https://github.com/steipete/CodexBar/commit/22372da3bac3bb0c5ea39095c6d73fb4a525f37c)新增 `reservePositive: Bool = false`，设置缺省 false，旧惯例保留。选项进入 Session/Weekly/Auto 与 live/sample preview；内部 delta、红绿、已保存条件阈值仍保持原语义。[维护者回复](https://github.com/steipete/CodexBar/issues/4386#issuecomment-6086624183)确认合并及下版发布计划，不是 LPFchan 已升级复测。**[一手：diff；社区：维护者回复]**

### CodexBar：发布后的理解反馈 · 3. AI 参与可证范围与反例

[#2842 的 Codex 审查](https://github.com/steipete/CodexBar/issues/2842#issuecomment-5240809239)将请求判为已有 signed pace token 的重复，引用源码与测试建议关闭，但同时要求维护者 **“Close after confirming the reporter can select Weekly pace in the current layout editor”**，并在 next step 要求确认已发布 token 满足请求；没有自动关帖授权。问题在于审查结论未保留两种符号方向的差异，不能写成机器人独自关闭了 issue。**[一手：公开审查产物；研究：原意对照]**

[#3429 的审查历史](https://github.com/steipete/CodexBar/pull/3429#issuecomment-5548428504)保存了 status-item 颜色丢失的 P2 发现，最终补丁与维护者说明对应修复；[#4386 后来的审查](https://github.com/steipete/CodexBar/issues/4386#issuecomment-6074103058)则明确把符号反转视为不同偏好，要求先做产品选择。这能证明 AI 审查参与及具体产物，不能隔离独立贡献或提速。**[一手；研究：归因边界]**

没有找到两次初始实现的具体模型生成披露；审查记录中的 internal/effort 不是公开模型版本。不能从项目作者整体 AI 使用习惯倒推本补丁生成归属，也不能当成当前模型效果对照。**[研究：证据缺口]**

### CodexBar：发布后的理解反馈 · 4. 成本、替代方案与停止条件

- 颜色增加了真实输出、stale/high contrast、预览、持久化、翻译及升级兼容工作；符号选项再增加设置与两种显示惯例。可看到维护面，未取得人的工时或模型费用，不由行数/测试数算净成本。**[一手：diff；研究]**
- #2534 已提出直接显示 deficit/reserve 文字；可选反转不是唯一方案，也没有与文字方案的用户比较。默认关闭意味着还可能有发现/启用成本，不据后来的反馈撤销颜色功能。**[社区；研究]**
- 显示符号可翻、条件阈值不翻，保住既有配置，但留下需要解释的双重语义。源码与文档可证该选择，未查到它已造成用户故障，不能把潜在学习负担写成已发生事故。**[一手；研究]**
- 本轮已完成有限产品反馈链；下一候选优先不同产品的修改后行为结果或删除/采用现成工具的决定。仅在出现符号版用户明确版本、设置、解释或操作结果时回访此链，不重复增加同类源码检查。**[研究：继续条件]**

### CodexBar：发布后的理解反馈 · 5. 验证范围

已读上述 issue/PR 正文、评论、发布 tag 关键文件和合并 diff；GitHub 原帖是社区使用报告，源码是机制证据。没有运行上游、检查图片像素、核验最终 release 使用效果或测模型。#4394 正文保留较早 head 的 queued CI 记录，不能视为合并树的独立验证。知识库本地验收结果见 [TASKS](../collaboration/TASKS.md)。**[一手：所读材料；经验：本轮检查范围]**

## 需求成立与否：试用也可以导向停止

> 主线一；核实时间：2026-10-13。本轮新增的是此前未入仓的研究证据，不是把2024、2025论文称为最新研究。改变 [15 §10](../15-task-playbooks.md#10-原型和一次性脚本)的「继续改目标」为「继续、改目标或停止」，不据此新增自建/购买通则。

### 新证据：取证方法相同，是否用来检验假设不同

[Camuffo等，2024，SMJ，DOI 10.1002/smj.3580](https://sms.onlinelibrary.wiley.com/doi/10.1002/smj.3580)汇总四项RCT、759家企业。两组均学习访谈、调查、A/B等方法；处理组将理论、假设、检验与判断更新连接起来。表2第(1)列终止概率系数为0.098、robust p=.001，即增加9.8个百分点；这是调整后线性概率模型估计，不是原始均值差。终止指观察窗内结束项目，转向指价值主张或客户群重大改变，来自访谈追踪；最长16个月、其中一项9个月。转向次数的线性效应不显著，不能概括成「验证带来更多转向」。**[研究：原文RCT，§5.5–5.7、§6.1表2、§6.2]**

核对入口：[City公开存档](https://openaccess.city.ac.uk/id/eprint/32437/)的30页PDF含封面，处理差异在PDF第10页／正文印页9，定义在第12页／印页11，表2在第16页／印页15；这些是该存档预排版页码，不是最终卷期页码。**[一手：原文定位]**

### 反例：更早停止不必然更好

[Gambardella、Messinese，2025，Organization Science，DOI 10.1287/orsc.2023.18245](https://pubsonline.informs.org/doi/full/10.1287/orsc.2023.18245)将308家早期创业企业分为理论验证、主动设计/塑造条件、对照三组，追踪约一年半。设计组较理论组更少、更晚终止；全样本理论组平均收入更高，专利型想法的收入最高10%子组比较则呈相反收益方向，交互项p=.060，只是弱证据。约17%样本流失、多项指标含自报且观察期有限，不宜据此规定创新项目应坚持或一般项目应早停。**[研究：原文RCT，§3.4–3.7、§4、§5表9、§6]**

### 采用与边界

**✅ 让原型试用能够推翻想法，而不只产生新功能清单。** 两项研究观察的是创业培训组合与后续决策，不是AI编码实验，不能分离某条提示的效果，也没有比较自建、购买与复用。停止不自动代表判断正确；低成本原型仍可用来发现此前说不清的新需求。**[研究：迁移边界；经验：采用判断]**

若价值来自重复节省时间，可看下一次同类任务是否真的再用；一次性转换则可能完成一次就足够，不设统一需求次数门槛。试用、招募与分析也有成本，本轮未取得可用于AI原型的净成本数据。重大去留由负责人决定，不交给Agent自行撤销。**[经验：试用设计与权限边界]**

已读两篇期刊全文的处理、结局定义、结果表和局限，并核对2024存档PDF；没有取得原始数据重估，没有运行模型或软件。下一项仍缺同一使用者比较现成方案后继续自建、回退复用或终止的实际行为证据，不能以这两篇论文补称已完成该比较。**[经验：验证范围与缺口]**
