# Godot 对外贡献政策核对

核实时间：2026-10-13。只读公开官方页面与 GitHub 原帖；未联系维护者、提交上游或运行个案补丁。

## 采用判断

**✅ 对外贡献前按接收渠道选择工作方式；披露、人审和小补丁都不自动产生准入。** 当前[贡献规则](https://contributing.godotengine.org/en/latest/development/contribution_rules.html#ai-assisted-contributions)允许有限代码补全，禁止实质生成、代理代投和 AI 生成人际沟通。作者须能独立完成并承担责任；不得把这些规则扩大为个人游戏开发的统一限制。**[一手；经验：采用判断]**

## 直接证据与日期

- **公告不是“七月突然全面禁用 AI”**：Godot Foundation 于 [2026-06-30 发布政策变更公告](https://godotengine.org/article/contribution-policy-2026/)，当时措辞是将修改规则，已经区分实质代码生成与补全等有限辅助。原文强调评审负担和可持续培养维护者。正文原有“AI 无法承担责任”的归属可从二手升级为这篇一手公告；不要顺带把作者对重度使用者的判断写成普遍研究结论。**[一手]**
- **政策已落地**：[完整政策 PR #116](https://github.com/godotengine/godot-contributing-docs/pull/116)由 clayjohn 提出，2026-08-26 16:28:41（UTC+8） 合并，merge commit 为 `ac1a89ecb23066659eb3bb98df8825d121513518`。当前页面还禁止 AI 生成面向用户的文档、图像、音频；人写原文的机器翻译例外；该政策明确不适用于项目依赖的第三方库。**[一手]**
- **有限辅助不等于只要求披露**：[当前规则](https://contributing.godotengine.org/en/latest/development/contribution_rules.html)要求人决定代码位置、算法与实现；维护者没有义务评审 AI 辅助 PR。它覆盖向项目各领域贡献，沟通条款涉及 GitHub、RocketChat 和官方社区。**[一手]**

## 反例与边界：可见 PR 不支持“人审后一定可投”

- **小改动也会因工作方式违规而关闭**：[Godot #123238](https://github.com/godotengine/godot/pull/123238)和 [#123239](https://github.com/godotengine/godot/pull/123239)均于 2026-09-06 提交、09-07 关闭（此处为 GitHub 的 UTC 日期；关闭对应 UTC+8 的 09-08），截至核实日未合并；元数据显示分别 +6/-2、+4/-1。作者自述用于真实游戏并经人工检查，但 [#123239 的承认与解释](https://github.com/godotengine/godot/pull/123239#issuecomment-5575415421)确认代理替他写说明和提交；[维护者关闭理由](https://github.com/godotengine/godot/pull/123238#issuecomment-5586924607)指向代理编码和提交，而非只要求改写 PR 说明。此处只能证明政策执行，不证明补丁正确或错误。**[一手：原帖与 PR 状态]**
- **不是“少于 15 行即可”**：政策讨论中 [clayjohn（2026-08-18）](https://github.com/godotengine/godot-contributing-docs/pull/116#discussion_r3805212412)解释：该经验阈值是供维护者分配评审精力，刻意不作为贡献者的机械规则；[AThousandShips 同日](https://github.com/godotengine/godot-contributing-docs/pull/116#discussion_r3802894393)也强调小改动不自动允许 AI，仍需披露。不要将文档中的行数或版权措辞扩写为法律安全线。**[一手：政策制定原帖]**
- **执行措辞仍在调整，个案不代表永久封禁**：[akien-mga 在 #118 的回复](https://github.com/godotengine/godot-contributing-docs/pull/118#issuecomment-5588796772)承认上述沟通本可更好，并表示团队仍在改进对违规贡献者的沟通方式；不宜引用某条冲突性回复当成全体维护者的固定态度。**[一手：维护者原帖，2026-09]**
- **新闻不能替代渠道规则**：[Asset Store 官方 FAQ](https://docs.godotengine.org/en/stable/community/asset_store/faq.html#can-i-upload-ai-generated-assets-or-code)明确允许披露后的 AI 资产/代码。反过来，面向官方项目的用户文档生成被禁止；[clayjohn 于 2026-08-24 的确认](https://github.com/godotengine/godot-contributing-docs/pull/116#discussion_r3840042167)记录了经董事会讨论扩大文档限制。这是贡献目的地差异，不是允许绕过引擎仓库规则。**[一手]**

实际验证：官方政策、公告、stable/latest 商店 FAQ 均直接打开；政策合并元数据、制定评论和执行个案由 GitHub 只读连接器取得。未联系维护者、未执行上游代码；未验证这些个案补丁的运行效果。

固定政策源码：[2026-08-26 合并版本](https://github.com/godotengine/godot-contributing-docs/blob/ac1a89ecb23066659eb3bb98df8825d121513518/pull_requests/pull_request_guidelines.rst)（GitHub 连接器已读取并验证，文件 blob SHA `a71052fed752eb6533812a0c98117ba33fe8df68`；当前正文路径后来改为 `development/contribution_rules.rst`）。
