# 角色动作二改：先接可核机制，不接整包推荐

部分接收 World of ClaudeCraft 的固定体型补库、覆盖优先级与接触时序差异，已回流[动画制作页](../../../../../domains/game-dev/assets/animation.md#character-clip-library-revision)。
原清单不是可复用资产包，也未完成 2–3 款新游戏的可玩性与作者身份独立核验；完整实例研究仍未通过。
[原回交 addc54f](https://github.com/dbvv1/a1dbv/blob/addc54f31e18ae938fd41e83073ab94d7e9d5a30/docs/collaboration/local-jobs/artifacts/B-AI-GAME-CHARACTER-REVISION-20261104/sources.md)保留其他候选与覆盖缺口，本页只保存实际核过的结论。

## 固定源码能证明什么

World of ClaudeCraft [PR #4460](https://github.com/levy-street/world-of-claudecraft/pull/4460) 的固定 head 为 `293e0fdc084caaf7ae6e53128315b2807c4ebe1d`。以下是源码／作者记录的结果，不是本仓实跑。

| 问题 | 核到的机制 | 本案例怎样使用 |
|---|---|---|
| 补动作要不要重做角色 | 两体型各 23 段动作分别作用于自己的 bind rig；meshless GLB 在原动作库之后加载 | 保已有角色，比较按体型分库；不把无 mesh 当跨体型重定向 |
| 新库会不会覆盖专用动作 | 新库覆盖普通移动与普攻；施法、侧移等保原库；武器皮肤自己的动作优先，特定射击仍走原 rig 的动作 | 先列旧动作的保留条件与优先级，再判断是否值得补库；不直接复制整套选择器 |
| 换动作能否只换文件 | 接触时刻表随动作重测；PR 记双持接触从旧 0.125 秒移到男／女体型 0.408／0.458 秒，伤害数字与冲击音效随之变晚 | 先分清表现时序与玩法时序。MOBA 保既有权威 tick，不沿用这组秒数或把动作结束变成伤害条件 |
| 自动检查说明什么 | 作者的构建／测试检查确定性重建、socket 不动画、接触点、压缩后每帧有限值等 | 可借检查对象；本轮未重建资产，不能转述为本仓检查通过或画面自然 |

依据：[作者源 README](https://github.com/levy-street/world-of-claudecraft/blob/293e0fdc084caaf7ae6e53128315b2807c4ebe1d/scripts/assets/woc_keyed_anims/README.md)、上述 PR。静态核实：2026-11-04。

## 这次纠正的两处判断

**制作方式不等于人工工时。** 作者源是按体型编写关键姿态，由样条、IK 与求解器生成中间运动；其中 beat keys 取每段 6–14 个关键时刻再调整。`hand-keyed` 不足以证明每帧由人手摆，也没有给出人和 Agent 各自工作量，原稿“动画关键姿态由人按规格手 K”不作为已核事实。

**看源码与拿资产是两件事。** README 明确说明以重定向后的 WoW 人形移动／普攻作为姿态与时序参照，且重新打关键帧本身不建立法律独立。固定 [CREDITS](https://github.com/levy-street/world-of-claudecraft/blob/293e0fdc084caaf7ae6e53128315b2807c4ebe1d/CREDITS.md) 写明 MIT 只覆盖代码，WOC 人物媒体保留权利，未列媒体不自动获授权。因此本轮不下载、复制或推荐复用其模型／动作，保留机制参考即可。

Grandma GTA 的固定 [LICENSE](https://github.com/andyhuo520/grandma-gta/blob/dbf0dc568b7d332d444694a899d8986e693fc8d8/LICENSE) 与 [README 素材与授权](https://github.com/andyhuo520/grandma-gta/blob/dbf0dc568b7d332d444694a899d8986e693fc8d8/README.md#素材与授权) 同样仅把 MIT 用于源码；Tripo GLB 随库供学习／演示，商用另核服务条款，MiMo 配音也不能由代码许可推导。原稿 A2 不应只标一个 MIT。其 [actor.js](https://github.com/andyhuo520/grandma-gta/blob/dbf0dc568b7d332d444694a899d8986e693fc8d8/src/actor.js) 是两套骨名的语义适配，不能改写成全角色共用同一骨架；最大伸展采样也不是碰撞真值。本轮只把这些记作筛选纠正，未采用其实现或资产。

## 其余候选与后续

Grandma GTA、刀光剑影、Zhaoye、Graveyard Waves 等仍在原回交中。原稿“可玩”“三道门全中”和排序不足以代替独立验收；作者／厂商身份、固定版本、连续实机可达性、成本及素材许可尚须逐项补核。未启动这些游戏、未看完整连续实机，也没有取得其画面／手感／听感或零人工美术品质结论。

恢复时沿原实例线挑 2–3 项补齐实际可玩或连续实机及作者原文，不重复广搜；补回后再决定哪些进入作品推荐。对现有 MOBA，下一次合法动作源二改可同时核骨架合同、覆盖优先级和权威命中 tick 的视觉对齐，未实际采用前不提高记分卡分数。
