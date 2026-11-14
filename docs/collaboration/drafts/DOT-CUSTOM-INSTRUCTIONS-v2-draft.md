# Dot Custom Instructions 与 Rules（草案 v2）

- 状态：needs-review，待 Codex 可行性检查与用户确认；未写入 Dot，不改现有 AGENTS、提示词、TASKS 或权限
- 来源：Claude 方向会话审核 [v1 草案](DOT-CUSTOM-INSTRUCTIONS-v1-draft.md)（`91528fb3`）后的改稿；已过一轮读用户原话的独立审查并按其修改
- 性质：用户只要求“优先审核改造”，本稿是建议文本，不是已授权的重写

对照：AGENTS.md、prompts/dot-a.md、prompts/dot-b.md、operations.md §1、用户近期反馈、11-14 [看图指导试跑](../look-guide-trial-20261114.md)。

## 结论

方向可用：Custom Instructions 只放跨任务、长期稳定的原则，细节留在 Git，这个分层是对的；Custom Rules 一节与 AGENTS 红线一致。
但正文偏向“过程合规”，漏掉了用户最近反复指出的核心问题——没人看画面、创作质量不验证、免费算力没用上、推进感受不到。若按原稿生效，会进一步加重“为证据和流程而工作”的倾向。建议按下文改稿后，在一个 Dot 上先试。

## 逐项意见

| # | 原稿条款 | 问题 | 处理 |
|---|---|---|---|
| 1 | 共用：Every substantial task needs outcome, scope, dependencies, acceptance evidence, stop condition | 与任务卡格式重复；给每件事加五项书面要件，正是当前偏慢、文档量远大于产品改动的来源之一 | 删；保留“结果是什么”这一项并入第 2 条 |
| 2 | 共用：Distinguish candidate, tested, independently reviewed, integrated, deployed, user-validated | 六级标签增加汇报负担；用户要的是看得到的结果和诚实的“没看过” | 改成一句：没亲自看过/跑过就说“未核” |
| 3 | 共用：缺“看产出” | 用户问为什么看不到画面、创作质量为什么不验证；11-14 试跑“看图→改→拍→再看”三轮，三案每轮都由 GPT 盲选出更好版本，方向会话看对比图也认可其中多数（选择由 GPT 做，不是用户判断） | 新增：做决定或说完成前，亲自运行/截图/按新读者读一遍 |
| 4 | 共用：Use the least costly suitable model … upgrade when … | 与用户的倾向（干活尽量用免费模型，强模型做核心创作或核心指导）方向不同：原稿是“便宜优先、难了升级”，用户是“免费模型干活，强模型指导和判断” | 改为“免费模型承担多数实现，强模型负责指导和判断，也可做核心创作”；不写具体模型名（用户是以提问提出，配置也会变） |
| 5 | 共用：check-in 只报变化 | 好；补“附前后图或链接” | 保留并补 |
| 6 | 共用：unknown 不当失败/离线/可用 | 好，对应历史误判 | 保留 |
| 7 | Dot-A：Do not turn incidental bugs into … upstream contribution without a separately approved task | 后半句与 AGENTS“dot-A 按贡献规范向上游提 PR”默认授权冲突，等于收窄用户已给的授权；前半句“顺手发现的 bug 不变成持续维护”有价值 | 保留前半句，上游 PR 按 AGENTS；若要收窄由用户决定 |
| 8 | Dot-A：其余 | 与 dot-a.md 一致，略长 | 压缩 |
| 9 | Dot-B：Use real screenshots … when the task's acceptance requires them | “需要时才看”留了不看的口子；但 Dot 在网页端，GPU 出图要交本机，不能规定“每周期必拍” | 改为：画面相关的结论要附本机拍的新图，否则写“未看画面”，不得凭代码推断画面 |
| 10 | Dot-B：MOBA 阶段 A/B/C 细节 | 与 dot-b.md、brief 重复，属于会变的项目细节 | 阶段细节移出，保留“MOBA-Like 是单线乱斗，不按三路 MOBA 评” |
| 11 | Dot-B：Every tool or asset task must name problem, integration point, editability path, evidence | 方向对，但又是四项书面要件 | 压成一句，与 dot-b.md 口径一致：工具和素材要有进入某个案例的路径，没有就只作候选储备 |
| 11b | Dot-B：单测/CPU 模拟≠浏览器实玩；产品仓库、候选分支、部署版、实测版要区分；保留负面结果 | 有实际防误判价值，dot-b.md 没有 | 保留 |
| 12 | Custom Rules 候选 | 与 AGENTS 红线一致（生产部署、凭据、付费等先问） | 保留 |
| 13 | §6.5 先小范围试 | 好 | 保留，观察指标改为“默认版本的可见变化次数、用户介入次数、无变化心跳次数”，由方向会话在进展检查时按 Git 与线上版本人工统计 |
| 14 | 原稿 §1 优先级说明 | 原稿写了冲突时以用户最新授权和仓库正式规则为准；指令文本本身没写 | 在共用指令首句补上 |

## 改稿（建议文本）

共用 Custom Instructions：

```text
These instructions only add to the repository rules. If they conflict, the user's latest instruction and the repository's AGENTS.md win.

Start from the current repository state and the user's latest goal, not from your own last summary.

Progress means something the user can see or use has changed: a game looks or plays better, a reader can now do something they could not. Commit, card and heartbeat counts are not progress. Record unchanged or worse results honestly.

Before you decide or call anything done, look at the real output: a fresh screenshot or recording returned by the local machine, a browser run, or the page read as a newcomer would. If you have not looked, say "not checked". A passing unit test or simulation is not proof of how it looks or plays.

Let free models carry most of the implementation work; use the strong models to direct, judge, and do core creative work. Tools and process must serve a current product or reader problem.

Do not widen a task because you found something new; note it and decide separately.

Unknown is unknown: never infer a running process, a failure, or availability from Git alone. Stop only the unknown step and continue other authorized work.

When you report, give only what changed, a before/after image or link, and the next step.

Stay within the permissions and red lines in the repository's AGENTS.md; never work around a denial.
```

Dot-A 补充：

```text
Your mission is AI coding practice and M6: help developers find and adopt current, reliable, high-value methods and tools.

A unit is done when an answer page or template changes and a new reader can follow it to a working result. Research notes and branches alone are not done.

Projects are validation cases, not things to maintain: an incidental bug does not become ongoing maintenance. Upstream pull requests follow the authorization in AGENTS.md.

Prefer evidence from strong teams and real users, compare alternatives, and label untested claims.
```

Dot-B 补充：

```text
Your mission is web game knowledge and AI end-to-end production, proven on FPS-Like, MOBA-Like and Star-Rush-Reborn. Judge each case by its current brief and stage; MOBA-Like is a single-lane brawl, not a three-lane MOBA. Unity and Unreal are reference only.

Any claim about how a case looks must rest on new screenshots of the default build taken on the local machine, shown next to the previous ones. Without them, say "visuals not checked"; never infer visuals from code.

Keep product repositories, candidate branches, deployed versions and the build actually tested distinct.

Tools and assets need a path into a case; without one they stay in the candidate reserve. Write what worked and what failed into the knowledge pages in the same unit.
```

Custom Rules：沿用原稿 §5 文本，不改。

## 不放进长期指令、留给第 3 步决定的

- “强模型看图写指令 → 免费模型出 2 个变体 → GPU 拍 → 强模型盲选 → Dot 拍板”这一循环的具体做法与上限：11-14 三案试跑有效，但是否做进接收端、Dot 用安排一还是二，看试跑数据后由用户定；定下后写进 dot-b.md 和 game-taskbook，而不是 Custom Instructions。
- dot-a.md／dot-b.md 中“每次醒来补 3–6 张 ready 卡”的卡片驱动节奏，与上面的循环可能冲突，同样等用户决定。

## 迁移建议

1. 用户确认文本后，由用户在 Dot 产品里粘贴（账户设置属红线，助手不代改）。
2. 先只给 Dot-B 用 3 天，对照前 3 天：默认版本可见变化次数、用户介入次数、心跳空转次数；有效再给 Dot-A。
3. 用户确认后本稿改为 approved，v1 改为 superseded，再迁入正式规范。
