# B-MOBA-GOLD-EVENT-20261103 · 权威赏金反馈事件
id: B-MOBA-GOLD-EVENT-20261103
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 0811894da59740bdc10e0a2318174f3dbb0530d1
result_branch: relay/b-moba-gold-event-20261103

## 目标
为 quality 清单中尚缺的金币反馈提供可消费的真实奖励事件，区分击杀／补刀／建筑奖励与被动收入、购物扣款。只交 CPU 派生接口，不新增玩法候选、不把接口完成当作玩家已看见反馈。现有 PresentationEvent 无金币事件；既有 quiet、Q/W 和 v12 成果不重复实施。

## Skill 与固定规格
按 a1dbv `domains/game-dev/templates/.claude/skills/game-module-from-case/SKILL.md` 的既有模块接续方法，读目标 AGENTS、brief「表现事件接口」、quality「金币专用反馈缺」及 `awardDeathRewards`、`emit`、`snapshot`、`finalHash` 原实现。本题复用现有事件机制，不造经济或通用事件总线。

增加 `PresentationEvent` 的 `type: 'goldAwarded'` 分支：`recipientId: number`、`targetId: number`（死亡对象）、`amount: number`、`position: Readonly<Vec2>`（死亡对象位置副本）、`reason: 'heroKill' | 'heroTeamReward' | 'minionLastHit' | 'structureLastHit' | 'structureTeamReward'`；`tick/ordinal` 仍由原 `emit` 分配。

只在 `awardDeathRewards` 各实际金币加法之后发出一次事件，沿用原金额、奖励对象和遍历顺序：英雄击杀给实际 sourceHero；无英雄击杀者时现有全队 150 是 heroTeamReward，不称助攻；小兵仅英雄补刀有金币；建筑击杀者获原 bounty，其余队友原 60 为 structureTeamReward。被动收入、经验、购物、无奖励或重复尸体攻击不发本事件。不得增加或重新解释奖励条件。

事件留在原逐 tick `stepEvents`，不进入 `SimState`、存档、输入或状态 hash，不消费 RNG。快照对新 position 深复制；重读不消费，下一有效 step 替换，终局保留最后一批。已有事件的相对顺序与原 payload 不变；新增事件可使后续 ordinal 按原规则递增，不强求旧 ordinal 数值不变。

## 写入范围
仅目标独立 worktree 的 `src/sim/types.ts`、`src/sim/simulation.ts`、`tests/gold-awarded.test.ts`、`tests/presentation-events.test.ts`、`docs/brief.md` 的表现接口段，以及 `tools/check-gold-event-compatibility.ts`。后者仅作同输入基线比较，接收端保其实际输出，不另建报告页。确需修改其他原测试才能接新事件时先报告精确文件／原因，不整批放宽断言。

只用已有 Node/CPU 依赖；缺依赖则报告，不安装、不跑浏览器／GPU／模型部署、不触系统或凭据。模型只改文件，由既有接收端执行公开扫描、提交、推结果分支并回 review_ready；不合产品 main、不部署。不得恢复取消任务或另开并行模型调用；由原接收端在确认空槽后领取。

## 怎样算做成
- 真实 Simulation 步进覆盖英雄击杀、非英雄击杀后的全队奖励、小兵补刀与非英雄击杀无金币、建筑击杀者／队友奖励；验证金额、对象、位置、tick 和单批唯一 ordinal。
- v9 同阶段互杀／多人已承诺攻击不会重复奖励尸体；阵亡领取者仍按原规则处理。没有奖励的正常 tick、被动收入／购物不产出本事件。快照嵌套 position 修改不回写内部事件；重读／下一步／终局行为符合原约定。
- 固定基线 0811894 与修改版分别创建真实 Simulation，按现有支持版本逐项运行同 seed、同正常 bot 输入至少 600 tick；比较每 tick 状态 hash 和序列化 state 相同。将新事件过滤后，旧事件 payload／顺序相同（比较时仅去掉 ordinal）；不以两次新版互比替代基线。
- 新用例必须能在基线暴露缺失接口；原 presentation-events 测试保留既有事件断言，只为有新增事件的场景补精确预期。全量 CPU 测试、sim／web／capture 类型及构建、公开内容／提交身份和空白检查通过，不能用 skip 或降低门槛消除失败。
- 交固定 commit、实际测试命令与结果及基线比较输出；明确尚未接可见金币提示、浏览器或主观可读性验收。只交一份接收结论，不另写退出或历史更正提交。

## 当前结果

- taskDone=true。新增 goldAwarded 表现事件（recipientId/targetId/amount/position/reason 五类原因），在 awardDeathRewards 四类实际金币加法后逐次发事件，快照深复制 position，不进入 SimState/finalHash/RNG；新增 7 个行为用例并给 3 个既有事件场景补精确预期。openIssues：(1) 超范围接缝 src/audio/battle.ts 含音频加载行为改写，建议接收端复核；(2) 超范围接缝 tools/save-compatibility.ts 新增指纹映射，已有 3600 tick 基线等价证据；(3) 零额记账不发事件，已披露；(4) 未接可见金币提示，未跑浏览器/smoke/GPU/主观验收。实测：npm test 86 files/557 tests 全过；基线 0811894 对比工具 --ticks 3600 --seed 1 passed=true，8 版本状态 hash/序列化 state/旧事件全匹配；build/web/capture 类型检查均通过；git diff --check 干净。
- 产物：[a295da7](https://github.com/dbvv1/MOBA-Like/commit/a295da7e491c644ce2f42389740132d01d238534)，分支 `relay/b-moba-gold-event-20261103`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：接收端按清单提交并决定是否保留两处范围外接缝；后续需接可见金币反馈并做浏览器/主观可读性验收。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
