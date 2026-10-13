# CodexBar：发布后的理解反馈怎样改变呈现契约

> 核实时间：2026-10-13 16:12（UTC+8）。读取公开原帖、PR、固定发布 tag 与补丁；未构建或运行上游，未做模型实验。

## 采用判断

**✅ 试用修改版时，仍让使用者解释数值及据此会怎么做；不要用已有同名控件或渲染正确代替理解目标。** 本例的净新证据是不同使用者在已含颜色改善的发布版仍报告符号误读，促成可选符号惯例；不同于 CodexIsland 的作者视觉反馈与信息编码取舍。只更新 [15 §10](../15-task-playbooks.md#10-原型和一次性脚本)，不据此推荐更多设置或某个模型。**[研究：采用判断]**

**关键局限**：该用户未说明是否开启颜色，也未报告实际错误行动；最终符号版没有找到用户复测。因此不是“开启颜色后复测失败”，更不是已证明产品收益。**[社区：报告范围；研究：边界]**

## 1. 原需求不是只有一种正确符号

| 原帖 | 直接证据 | 对取舍的意义 |
|---|---|---|
| [#2534](https://github.com/steipete/CodexBar/issues/2534)，WilliamK6，2026-07-31 | 升级后旧的百分比＋pace 组合消失；用户希望知道比可持续使用速度高/低多少，认可正数表示超前，也提出直接写 deficit/reserve | 耗尽时间不是同一个问题；旧符号有真实用户需求依据 |
| [#2842](https://github.com/steipete/CodexBar/issues/2842)，rsheyd，2026-08-10 | 要求正数表示储备、负数表示超用，目的是判断应放慢还是还有余量 | 同样的 pace token 名称可以指相反的语义惯例 |
| [#3428](https://github.com/steipete/CodexBar/issues/3428)，jb510，2026-09-05 | 符号含义容易忘；要求默认关闭的颜色设置，绿 reserve、红 deficit，保留符号和现有 token | 选择补充颜色，而非新增一套 token 或改变所有人的默认值 |

表内为 **[社区：用户原帖]**，取舍解释为 **[研究]**。#2842 的[后续回复](https://github.com/steipete/CodexBar/issues/2842#issuecomment-5240880100)说实际试了 Weekly pace，但显示横杠，不能写成该用户已成功使用符号版本。

## 2. 修改、发布和另一用户的再次反馈

1. **颜色补丁合并。** [#3429](https://github.com/steipete/CodexBar/pull/3429)于 2026-09-11 合并为 `fe7a45ffab530e6b850800fd4a01ef1972709b0d`。[维护者接受](https://github.com/steipete/CodexBar/pull/3429#issuecomment-5627798767)的是窄的默认关闭选项。已读 diff 用独立数值 delta 选红绿，并修复模板图像剥离颜色的输出路径。作者报告本机、合成 native 场景及测试通过；本轮未复跑或检查图片像素。**[一手：补丁；社区：采用与运行报告]**
2. **发布版包含颜色逻辑。** `v0.72.0`解析到 [`cfee869f3181379dd074adb9feeb5f19a994356a`](https://github.com/steipete/CodexBar/commit/cfee869f3181379dd074adb9feeb5f19a994356a)。[固定 renderer](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/Sources/CodexBar/MenuBarLayoutRenderer.swift)的 `colorPace` 分支按 delta 正负取绿/红；blob 为 `5c6130c7ab7b600bbe0ee205a307c94f742f5a3c`。[UI 文档](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/docs/ui.md)明确默认关闭；[formatter](https://github.com/steipete/CodexBar/blob/cfee869f3181379dd074adb9feeb5f19a994356a/Sources/CodexBar/MenuBarDisplayText.swift)仍将非负 delta 显示为正数，没有符号设置参数。这是直接读取发布源码，不是按日期推断。**[一手]**
3. **另一个人实际使用后仍觉得含义相反。** LPFchan 在 2026-10-09 的 [#4386](https://github.com/steipete/CodexBar/issues/4386)注明 **0.72.0、macOS 15.7.4 arm64**：菜单栏 `+23%` 一眼像好消息，popover 却显示 deficit。他明确联系 #3429，认为颜色有所帮助但未改变符号，提出保留旧默认的可选反转。用户未说当时开启颜色、高对比或自己具有色觉障碍，也没说实际多用额度；“很多用户”只属其概括。**[社区；研究：范围限定]**
4. **从颜色改为可选显示语义。** [#4394](https://github.com/steipete/CodexBar/pull/4394)于 2026-10-09 合并；[固定补丁 `22372da3bac3bb0c5ea39095c6d73fb4a525f37c`](https://github.com/steipete/CodexBar/commit/22372da3bac3bb0c5ea39095c6d73fb4a525f37c)新增 `reservePositive: Bool = false`，设置缺省 false，旧惯例保留。选项进入 Session/Weekly/Auto 与 live/sample preview；内部 delta、红绿、已保存条件阈值仍保持原语义。[维护者回复](https://github.com/steipete/CodexBar/issues/4386#issuecomment-6086624183)确认合并及下版发布计划，不是 LPFchan 已升级复测。**[一手：diff；社区：维护者回复]**

## 3. AI 参与可证范围与反例

[#2842 的 Codex 审查](https://github.com/steipete/CodexBar/issues/2842#issuecomment-5240809239)将请求判为已有 signed pace token 的重复，引用源码与测试建议关闭，但同时要求维护者 **“Close after confirming the reporter can select Weekly pace in the current layout editor”**，并在 next step 要求确认已发布 token 满足请求；没有自动关帖授权。问题在于审查结论未保留两种符号方向的差异，不能写成机器人独自关闭了 issue。**[一手：公开审查产物；研究：原意对照]**

[#3429 的审查历史](https://github.com/steipete/CodexBar/pull/3429#issuecomment-5548428504)保存了 status-item 颜色丢失的 P2 发现，最终补丁与维护者说明对应修复；[#4386 后来的审查](https://github.com/steipete/CodexBar/issues/4386#issuecomment-6074103058)则明确把符号反转视为不同偏好，要求先做产品选择。这能证明 AI 审查参与及具体产物，不能隔离独立贡献或提速。**[一手；研究：归因边界]**

没有找到两次初始实现的具体模型生成披露；审查记录中的 internal/effort 不是公开模型版本。不能从项目作者整体 AI 使用习惯倒推本补丁生成归属，也不能当成当前模型效果对照。**[研究：证据缺口]**

## 4. 成本、替代方案与停止条件

- 颜色增加了真实输出、stale/high contrast、预览、持久化、翻译及升级兼容工作；符号选项再增加设置与两种显示惯例。可看到维护面，未取得人的工时或模型费用，不由行数/测试数算净成本。**[一手：diff；研究]**
- #2534 已提出直接显示 deficit/reserve 文字；可选反转不是唯一方案，也没有与文字方案的用户比较。默认关闭意味着还可能有发现/启用成本，不据后来的反馈撤销颜色功能。**[社区；研究]**
- 显示符号可翻、条件阈值不翻，保住既有配置，但留下需要解释的双重语义。源码与文档可证该选择，未查到它已造成用户故障，不能把潜在学习负担写成已发生事故。**[一手；研究]**
- 本轮已完成有限产品反馈链；下一候选优先不同产品的修改后行为结果或删除/采用现成工具的决定。仅在出现符号版用户明确版本、设置、解释或操作结果时回访此链，不重复增加同类源码检查。**[研究：继续条件]**

## 5. 验证范围

已读上述 issue/PR 正文、评论、发布 tag 关键文件和合并 diff；GitHub 原帖是社区使用报告，源码是机制证据。没有运行上游、检查图片像素、核验最终 release 使用效果或测模型。#4394 正文保留较早 head 的 queued CI 记录，不能视为合并树的独立验证。知识库本地验收结果见 [TASKS](../collaboration/TASKS.md)。**[一手：所读材料；经验：本轮检查范围]**
