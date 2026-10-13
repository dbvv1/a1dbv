# CodexIsland：真实需求、原型取舍与视觉反馈后的补丁

核验日期：2026-10-13（UTC+8）；案例发生于 2026-05，历史事件按原帖时区标注。只读公开 GitHub；未运行 Swift、未安装应用、未播放维护者附带视频。定位：任务一的产品选择证据，非模型生产力对照，非发布后用户收益证明。

## 结论与建议

该案例比仅有“已修改”回复更进一步：有独立用户的具体使用需求、方案选择说明、视觉 QA 后再次修改的作者记录、逐提交源码和回滚、已合并产物。最值得进入正文的是：先确定反馈要减少什么负担，再利用既有状态、版面与真实数据做最小替代；为可读性改变图表编码时，要明确牺牲了哪一种比较能力，不能用漂亮原型中的占位指标冒充真实结果。

尚缺：初始代码由哪种 AI 生成的可核实记录；视觉 QA 反馈的独立原文或参与者身份；请求者在发布后再次使用并确认改善的记录。可确认 Claude 参与了该 PR 的代码审阅并促成一处无障碍修正。不能把仓库名称、分支名、CLAUDE.md 或后续 Codex 分支当成本 PR 的生成归属证明。

## 1. 原需求：只用一个供应商，不希望另一个继续占位

2026-05-07，用户 honeybears 在 [issue #3](https://github.com/ericjypark/codex-island/issues/3) 说明自己只使用 Claude；关闭 Codex 后，图标与 expanded 中的数据只是变暗，仍占据屏幕。他要求 compact、peek、expanded 三种状态都完全隐藏被关闭供应商的元素。这是使用情境，不是单纯“再加一个功能”。

维护者 [首次回复](https://github.com/ericjypark/codex-island/issues/3#issuecomment-4394687502) 表示 idle/hovered 容易隐藏，但 expanded 如何保持整洁还需思考。

## 2. 作者报告的方案比较：复用空出的区域

[PR #16](https://github.com/ericjypark/codex-island/pull/16) 描述四变体中选择 Repurpose：用腾出的半区展示仍启用供应商的模型用量/费用明细。作者给出的弃选理由为 Bloom 仅装饰、Shrink 丢失面板辨识度、Focus 范围更大且需维护两套布局。

这些取舍理由来自作者公开 PR 描述；原型计划链接指向未公开的 notes 文件，不能声称读过四套完整原型或独立比较过视觉效果。

[首实现 6d54a8d](https://github.com/ericjypark/codex-island/commit/6d54a8da8f5b682838fc2a106a76071c280c7d16) 落实：供应商元素完全隐藏；使用既有本地日志的数据来源建立模型明细；删除原型的手写 `burn 18%/h` 数字；删除原型脚手架。应说“复用既有本地数据来源”，不要夸大为整套新聚合与 UI 已经存在。新增代码仍包括明细聚合与视图。

## 3. 作者报告视觉 QA 后再次变化；补丁可独立核对

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

## 4. 保留与放弃：不是所有尝试都留下

不对称轮廓在 [04abd1e](https://github.com/ericjypark/codex-island/commit/04abd1e548280f5537a7648d8ed6a12a29d9d8cc) 加入，随后由 [d43a637](https://github.com/ericjypark/codex-island/commit/d43a637dcb7cb6735157d2aca00facc1fc10cd04) 撤回。

维护者在 [最终审阅请求](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415630029) 明确说不对称轮廓已经尝试并撤回，要求不再作为遗漏追补。可直接核验提交序列中的一次回滚；“两次尝试”只是维护者说明，不应写成两次均已独立核查。

## 5. AI 的可见作用与最后交付

[Claude 首轮审阅](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415551546) 发现 pill 视觉隐藏条件同时依赖 `pillsVisible` 与供应商可见性，但 VoiceOver 隐藏只依赖后者。

[Claude 最终审阅](https://github.com/ericjypark/codex-island/pull/16#issuecomment-4415630454) 再次要求修正；[db8d80b](https://github.com/ericjypark/codex-island/commit/db8d80bec7b7e82c2f5b86c2f0e4495b360a120f) 将无障碍隐藏条件同步为两者组合。这是可见 AI 审阅→实际修正，不等于证明 AI 生成整套原型，亦不是泛化审阅质量评测。

PR #16 于 2026-05-10 15:24:47 UTC 合并：merge `1a1b4886e9b3fdbc5a38b0a3a2bbb3a0869dfc75`，head `db8d80bec7b7e82c2f5b86c2f0e4495b360a120f`，base `30305197c70ddd52bcd120ef5f06c4095c02d14e`。

PR body 保留了早期说明，例如成本行取消条形、5h footer 汇总；a999467 后成本行已恢复按 dollars 计算的重叠条，最终叙述必须依据对应提交源码。不能把早期 body 的无条形成本行或 footer 当成终态。自动生成摘要还残留后来被撤回的不对称轮廓，亦不能据此宣称已交付。

维护者在 [issue #3 回报 Done 并附视频](https://github.com/ericjypark/codex-island/issues/3#issuecomment-4415686274)，issue 后于 5 月 13 日关闭。视频未播放，不能称为本侧视觉验收；未找到请求者确认。PR 的手工视觉 QA 清单仍未勾完；合并不能替代运行证明。

## 6. 研究记录旁证与排除

- #23→#26 有频繁 hover→常显状态的真实需求与已合并补丁；无修改后独立使用确认，不另扩正文
- #24→#33 的 Pace Guide 仍开放未合并；issue 上“Thanks a lot”不能算发布后使用效果
- #4 的非刘海屏幕与 glow 请求可支持“无需逐字增加所有请求选项”：维护者复用 Low Power Mode 并选 Compact/Notch-style 预设。仅作旁证，不进入本轮正文，避免堆案例
- CineSplash 仅见简略 PR，未取得反馈过程；image-grids 是作者自述而无外部使用链，均降级
- CodexIsland #54 确有升级后失败反馈，但属于凭证维护问题，不能冒充产品探索

## 7. 采用边界

支持：反馈改变布局/信息编码；作者明确记录替代方案与回滚；原型占位值被排除；AI 审阅对应可见修正。

不支持：AI 开发速度、成本或收益比例；初始 AI 生成归属；Repurpose 优于所有替代的普遍结论；独立用户发布后再次使用成功；所有图表含义已被真实用户正确理解；当前 main 仍与该历史版本完全相同。

下一可区分问题：寻找不同作者、明确说出安装/使用修改版后结果的原型案例。当前 #16 阶段已足够形成限定建议，不必继续等一条不存在的复测来阻塞正文。
