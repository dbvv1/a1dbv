# 新读者记录 · B-CORE-STABLE-SEATS-ADOPTION-20261106 · u1

角色：第一次读 `domains/game-dev/07-networking-and-server.md@bbb068cb` 的读者。只按任务给出的页面全文和本卡要求操作；未参与该页或 MOBA-Like 的编写。按任务要求不看 a1dbv 的其他研究文档、不搜同主题教程；下面列出的页面链接实验、固定 MOBA 源码和既有 MOBA 结果目录除外。未提交、未推送、未切换分支、未改页面、未改任务文件。

## 做到哪一步

1. 读页面全文，锁定 §4“本地命令接缝已进入可玩案例”为本次采用入口：`Simulation.commandFrame` → `sim.step`、稳定 team／roster 席位、封套含目标 tick 与各席 commands、按席位升序、保留席内顺序、空席显式送空数组。
2. 在本机已有的 MOBA-Like 固定源上核对任务指定的真实消费者提交 `7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64`：以该提交为基准，`src/sim` 与 `tests/command-frame.test.ts` 的 diff 为空；实际工作树 `774ba28` 只多一个产物提交。
3. 用两个独立 `Simulation`（各自一份 `lane.navmesh` Detour 实例）跑 seed 901、contentVersion 12、heroesPerTeam 3；六席按 `inputSeats` 映射；每端先用原 `commandFrame` 构造封套，A 端按 seat 升序到达，B 端按 `[5,2,4,0,3,1]` 到达；每 tick 比较 `finalHash()` 和 `CommandResult[]`。
4. 600 tick 内使用 move／stop／cast／buyItem；tick 100–129 六席显式空数组；单独做同席 `[move, stop]` 与 `[stop, move]` 对照。
5. 用原 API 验证同身份合法重送、同身份内容冲突、错 heroId、缺席、旧帧／未来帧、额外字段、越界 seat 的拒收；不写第二套排序器。
6. 继续到第 9,081 tick，在第 9,001 tick 用原经济规则完成一次真实购买，第 9,002 tick 完成一次真实技能消耗；记录原 `CommandResult`。
7. 写产物和本卡点记录。

产物位置：

- `docs/collaboration/local-jobs/artifacts/B-CORE-STABLE-SEATS-ADOPTION-20261106/result.md`
- 同目录 `run.mjs`（可复现脚本）
- 同目录 `run-output.json`（本次运行摘要，含 600 tick 逐 tick hash）

本记录是外层 reader-test 要求的卡点日志，位于任务的 artifacts 写入范围之外。

## 卡点

### 1. “信封包含目标 tick 与各席 commands”没有 schema

- 页面原句：“模拟层按队伍／阵容分配稳定席位，信封包含目标 `tick` 与各席 `commands`，按席位升序消费，保留席内操作次序，空席也显式提交空数组。”
- 缺什么：没有给 `CommandFrame` 的精确结构、`inputs` 数组元素字段名、`inputSeats` 的席位公式、`heroesPerTeam` 如何决定 6 席、`contentVersion` 取多少。读者只凭页面无法构造可运行帧。
- 实际处理：读固定源 `src/sim/simulation.ts` 的 `inputSeats`／`commandFrame`／`frameCommands`，确认 `{tick, inputs:[{seat, commands}]}`、seat = team × heroesPerTeam + roster slot、空席必须显式出现。
- 做错过的：第一版按页面文字自造了一个 `{tick, seats}` 形状，读到源码后改回 `inputs`。
- 归属：页面（阻塞级，但可由源码补齐）。

### 2. “拒绝”没有区分抛异常和返回 CommandResult

- 页面原句：“乱序到达不改变结果；同批同席相同输入只消费一次，冲突／缺席／错席／旧帧／未来帧在推进前拒绝。”
- 缺什么：没有说协议错误是 `throw`，玩法拒绝是 `{accepted:false, reason}` 且 tick 继续推进。统一按“拒绝”处理会把 `directionRequired`／`cooldown`／`notEnoughGold` 误当整帧失败。
- 实际处理：读 `Simulation.step`／`applyCommand`／`commandCast`／`commandBuyItem`，分别验证：协议错误 hash 与 tick 不变；玩法拒绝返回原 `CommandResult` 且本 tick 照常推进。
- 做错过的：最初准备把过早 `buyItem` 写成协议拒收；改为保留 `notEnoughGold`。
- 归属：页面（阻塞级，但可由源码补齐）。

### 3. 页面没有六席示例，也没有 600 tick 口径

- 页面原句：“一个服务端按席位排帧并裁决，两个 Node 客户端只消费服务端提交的下一帧；同机同版本的三份状态哈希互相核对。”
- 缺什么：这段是旧 TCP 三进程小样；同页后面才说本地封套已采用。页面没有“两个独立 Simulation、六席、600 tick、每端不同到达顺序”的可运行例子，也没有说 tick 预算和席位数。任务正文的 600 tick／六席／双 Simulation 是页面外补的。
- 实际处理：按页面采用段和任务正文拼出两个 Simulation；A 端升序、B 端固定乱序；600 tick 逐 tick 比较。
- 做错过的：第一版只有 4 个 tick 的多席非空，到达顺序差异证据偏弱；改为每 20 tick 三席同时 move，增加到 31 个 tick。
- 归属：页面（中，需任务正文补口径）。

### 4. 页面没写 buyItem 的经济边界

- 页面原句：“新回放标记 `stable-seats-v1`，旧无标记回放仍按原输入顺序重演（2026-10-29 [源码／离线实跑]）。”
- 缺什么：页面采用段没有提 `buyItem`，`tests/command-frame.test.ts` 也只覆盖 move／stop；页面没有说购买必须先由原经济给金币。实际 600 tick 只有约 40 金币（被动 2/s），最便宜装备 600；tick 30 的 `buyItem` 只能得到 `notEnoughGold`，真实购买必须继续到 tick 9001（约 300 秒）。
- 实际处理：没有改版本、没有直接写金币；在同一对 Simulation 里用六席空帧继续推进到 tick 9001，再用原 `commandBuyItem` 购买 `wayfarer_boots`，记录金币／items／maxHp／maxMana／冷却率变化。
- 做错过的：第一版长跑忘了在 tick 9001 插购买命令，输出 `items: []`、金币 605.4；看 `tick9001.results` 为空才发现，补命令后重跑。
- 归属：页面（中，经济边界未写）；不是版本边界。

### 5. 页面没有内容版本支持范围

- 页面原句（任务正文，不是页面）：“若页面只支持较早 contentVersion，报告首个缺步骤并止于真实边界，不改版本凑绿。”
- 缺什么：页面没有列 `CONTENT_VERSIONS`，没有说 12 是否可用。实际读 `src/content/catalog.ts` 确认 `[1,2,7,8,9,10,11,12]`，contentVersion 12 可用，因此没有改版本；但页面读者无法从页面判断。
- 实际处理：使用 12，记录来源；没有为了绿而换版本。
- 做错过的：无。
- 归属：页面（轻，源码可补）。

### 6. 任务要求的共享指令层入口不在页面

- 任务正文要求“另沿 `docs/decisions/instruction-files.md` 的现有入口确定采用的共享指令层”。
- 缺什么：页面全文没有出现 `instruction-files`、共享指令层或该入口；按“只看这一页”的读者规则，我没有读该文件，也没有声称采用了某个共享指令层。报告把这一项列为“未做／页面缺入口”，不以页面之外的材料补写。
- 实际处理：只报告页面 §4 的本地命令封套采用效果；不冒充 TASKS“共同”项完成。
- 做错过的：无；这是任务与页面的入口冲突。
- 归属：页面／任务正文（阻塞该子项，但不阻塞六席命令消费）。

## 页面之外还翻了什么

- 页面 §4 链接的 `experiments/server-lockstep/README.md`：核对旧三进程小样的 `cast` 协议、字段和失败政策；没有运行 `run.mjs`。
- 本机已有 MOBA-Like 固定源工作树（`work/repos/dbvv1__MOBA-Like` 和 `work/wt/B-MOBA-FIXED-CAPTURE-20261105`）：核 git 状态、提交祖先、`node_modules` 是否存在；读 `src/sim/simulation.ts`、`src/sim/command-frame.ts`、`src/sim/types.ts`、`src/content/catalog.ts`、`tests/command-frame.test.ts`、`src/sim/nav/lane.navmesh`。
- 先跑固定源 `tests/command-frame.test.ts`（6/6 通过）确认环境和源可用；只作环境核，不作为本任务的消费者结果。
- 看了 `docs/collaboration/local-jobs/artifacts/B-MOBA-SIMULATION-001/README.md`：只为确认已有 MOBA 模拟结果的存放方式，没有复用其历史结果，也没有把它当作本任务证据。
- 未看：`docs/collaboration/TASKS.md`、`docs/decisions/instruction-files.md`、a1dbv 其他研究文档、同主题其他教程、模型网关、浏览器／GPU 材料。

## 自误（环境／模型）

1. **漏掉真实购买**：第一次 9,081 tick 跑完 `items: []`、金币 605.4；原因是长跑段只送空帧，没有在 tick 9001 加 `buyItem`。补上后重跑，购买成功。
2. **到达顺序差异太少**：第一版只有 4 个 tick 的多席非空；改为每 20 tick 三席同时 move 后为 31 个。
3. **临时探针低效**：早期 probe 每 tick 调三次 `commandFrame([])`；正式脚本改为一次。不是正确性错误。
4. **误判 600 tick 能购买**：先按“600 tick 内应能买一次”写计划；读 `updateEconomy`／`items` 后确认被动金币 2/s、最便宜 600，必须延长。属页面信息缺口导致的计划错误，不是改规则。

## 核对

- 初态两端 hash `5c5deac80803f1ea`；600 tick 末均为 `2a26c90e64796231`，完整 `snapshot()` JSON 相等。
- 600/600 tick 的 `finalHash()` 与 `CommandResult[]` 一致；继续到 9,081 tick 仍 0 分歧。
- 31 个 tick 的非空席到达顺序不同，结果仍一致。
- 同身份合法重送（cast）：结果数组长度 1，法力只扣一次（330 → 300.2667），两端 hash 相同。
- 协议拒收七项全部 `throw` 且 hash／tick 不变：`conflicting input retry`、`input does not own this hero`、`missing input seat (send explicit empty commands)`、`input tick is not the next simulation tick`（旧帧与未来帧各一次）、`malformed frame command`、`invalid input seat`。
- 玩法拒绝保留原 `CommandResult`：tick 5 `directionRequired`、tick 7／12 `cooldown`、tick 30 `notEnoughGold`。
- 真实购买：tick 9001 `accepted:true`，金币 600.000000000046 → 0.0667，items `['wayfarer_boots']`，maxHp 954 → 1054。
- 真实技能：tick 11 两端 W 均 `accepted:true`；tick 9002 购买后 W 仍 `accepted:true`，法力 414 → 384.2667，冷却 218（装备冷却率生效）。
- 席内顺序对照：`[move, stop]` 与 `[stop, move]` hash 不同（`2f19177b755dd380` vs `438e4c3e88c25c8c`）。
- 页面边界：本产物只证明本机同版本 CPU 接缝；未运行 TCP／WebSocket／端口、浏览器、Unity／Unreal、GPU／音频、公网认证或真实延迟。

### 核对者复核（2026-11-06）

**结论：六席命令采用与失败回执部分经独立复跑成立；按卡面“怎样算做成”仍未全做，卡内点名的共享指令层（`docs/decisions/instruction-files.md` 入口）没有交付采用内容与效果，读者自己标为“未做”。**

本轮只读工作目录和固定 MOBA 源，未改页面、任务卡或结果分支；复核读者自报之外的源码、重跑输出和检查结果。

- 源身份：`774ba2827c19aba7675c13f679a3e4db7793a53e` 相对 `7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64` 只有 1 个产物提交（34 文件）；`src/sim` 与 `tests/command-frame.test.ts` 的 diff 为空，祖先关系成立。
- 独立复跑：cwd 设固定 MOBA 源工作树、脚本用绝对路径执行 `MOBA_SOURCE=<固定源> MOBA_TARGET_COMMIT=7e1986f… node --import tsx <run.mjs>`；两次输出均为 87,637 字节，SHA-256 `a35af7841278464d83afa40de843c90d35b6fd1c9691ba7a85f434a77f16a6ae`，与 `run-output.json` 逐字节相同。
- 输出复核：初态 `5c5deac80803f1ea`；600 tick 末 `2a26c90e64796231`，600 个逐 tick hash 与 `CommandResult[]` 全一致，`snapshot()` 全等；9,081 tick 0 分歧；tick 9001 购买 accepted、金币 600.000000000046 → 0.0667、maxHp 954 → 1054；tick 9002 W accepted、法力 414 → 384.2667、冷却 218；七项协议拒收均 throw 且 hash／tick 不变；同席同内容重送只消费一次；席内顺序对照 hash 不同。
- 独立重算调度：600 tick 中 31 个 tick 的 A／B 非空席顺序不同，与输出一致。
- 检查：`python scripts/check_repo.py` exit 0（881 文件）；空索引下 `check_public.py --staged` 为 1,411 checked + 43 个二进制 skipped，读者报 1,415 与“临时把 4 个新文件加入索引后扫描”一致；产物无本机绝对路径，UTF-8／LF。

**卡点判定**（页面问题记 page，读者能力／判断记 model）：

| # | 卡点 | 判定 | 说明 |
|---|---|---|---|
| 1 | 信封 schema | page | 页面只有散文，没有 `{tick, inputs:[{seat, commands}]}`、`inputSeats` 公式、contentVersion 与复制语义；固定源可补。 |
| 2 | 协议拒收 vs 玩法拒收 | page（但读者记录夸大） | 页面 §4“第二次接入”已写“协议拒绝与玩法拒绝分开”“合法形状…`directionRequired`／`cooldown`…照常推进”；真正缺的是 `throw` 与 `{accepted:false,reason}` 的返回机制。 |
| 3 | 无六席／600 tick 例子 | page | §4 先写旧 TCP 三进程，后写本地采用；双 Simulation、六席、600 tick 口径由任务正文补。 |
| 4 | buyItem 经济边界 | page | 采用段与显式帧测试都不含购买；600 tick 约 40 金币、最便宜 600，真实购买在 tick 9001。 |
| 5 | contentVersion 范围 | page（轻） | 页面无 `CONTENT_VERSIONS`；实际 `[1,2,7,8,9,10,11,12]`，12 可用。 |
| 6 | 共享指令层入口 | page／卡面冲突 | 页面无该入口；卡面点名 `docs/decisions/instruction-files.md`，读者规则又要求不看其他 a1dbv 文档。读者标“未做”诚实，但按卡面验收该项未交付。 |

**读者没意识到的错误**：

1. **复现命令按原样不可执行。** `result.md` §复现写 `MOBA_SOURCE=<…> node --import tsx run.mjs`：在工件目录执行时报 `ERR_MODULE_NOT_FOUND: Cannot find package 'tsx'`（a1dbv worktree 无 `node_modules`）；改到固定 MOBA worktree 执行又找不到 `run.mjs`。实际可用形式是 cwd 设固定 MOBA 源工作树、脚本传绝对路径（本轮已按此复跑得到同一输出），文档没有写。
2. **卡点 2 夸大了页面缺口。** 页面 §4“第二次接入”第 282 行已经区分协议拒绝与玩法拒绝，并写明玩法拒绝照常推进；读者按“页面没有区分”记录，漏引该段。真正缺的只有 API 返回机制。
3. **去重探针与主跑 tick 6 混写。** “同身份合法重送（cast）：tick 6 的同席 cast W 封套发两次”实际是另建的 dedupe `Simulation`（先 5 个空帧，第 6 tick 施法），不是主跑 tick 6（主跑 tick 6 是 seat 1 单次施法）；两者数值相同只因同英雄同初态，记录没有点明是两个实例，容易误读。
