# B-CORE-STABLE-SEATS-ADOPTION-20261106 · 六席真实命令消费结果

**结论：本地同版本 CPU 接缝通过，原任务 `taskDone=false` 保留。** 两个独立 `Simulation` 以 seed 901、contentVersion 12、`heroesPerTeam: 3`、同一份 `lane.navmesh` 和同一初态运行；600 tick 内六席按稳定 team／roster 映射消费 move／stop／cast／buyItem，逐 tick `finalHash()` 与 `CommandResult` 完全一致。继续到第 9,081 tick 时仍是 0 分歧，第 9,001 tick 用原经济规则完成一次真实购买，第 9,002 tick 完成一次真实技能消耗。本输入序列只靠被动金币，600 tick 约 40，买不起最便宜的 600 金币装备；需要继续约 300 秒才购买，不代表有击杀赏金的其他输入序列也必须等到此时。没有改版本、没有直接写金币、没有注入权威状态。

**负责人接收勘误**：本文件在[原始 exact 报告](https://github.com/dbvv1/a1dbv/blob/a5501970d0ad492e42be64f3e70b8521a77178e4/docs/collaboration/local-jobs/artifacts/B-CORE-STABLE-SEATS-ADOPTION-20261106/result.md)基础上修正复现命令、卡点 2 与探针归属；`run.mjs`、`run-output.json` 保留交回内容。原读者未读、未采用 `docs/decisions/instruction-files.md` 的事实不变；负责人补入口不等于原读者采用，也不完成 TASKS“共同”。其余读者过程按历史记录阅读，接收核查另见文末。

本产物只证明本机、同源码、同内容版本、同 Node、同导航数据的 CPU 接缝；不证明浏览器联网、跨平台浮点确定性、公网认证、Unity／Unreal 或真实延迟。

## 运行条件与入口

| 项 | 实际值 |
|---|---|
| 真实消费者 | MOBA-Like `7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64`；以该提交为基准，本机检出点的 `src/sim` 与 `tests/command-frame.test.ts` diff 为空 |
| 本机检出点 | `774ba2827c19aba7675c13f679a3e4db7793a53e`，只比目标提交多一个产物提交，源码未变 |
| 入口 | `Simulation.commandFrame(commands)` → `Simulation.step(frame)`；没有用旧 `server-lockstep/run.mjs`，没有另写排序器 |
| 配置 | `seed: 901`、`contentVersion: 12`、`heroesPerTeam: 3`、默认 `maxMatchSeconds` |
| 导航 | `src/sim/nav/lane.navmesh`，11,180 bytes，sha256 `4b704a2ae42a1216f2bc9b35c88497b713b087a76e261697ae86e6445fe8a1d5`；两个 Simulation 各建一份 Detour 实例，字节相同 |
| 席位 | `inputSeats`：seat 0/1/2 = team 0 slot 0/1/2，heroId 9/10/11；seat 3/4/5 = team 1 slot 0/1/2，heroId 12/13/14 |
| 到达顺序 | A 端 `[0,1,2,3,4,5]`；B 端 `[5,2,4,0,3,1]`。600 tick 中有 31 个 tick 的非空席到达顺序确实不同 |
| 初态 | 两端 `finalHash()` 均为 `5c5deac80803f1ea` |
| 600 tick 末 | 两端 hash 均为 `2a26c90e64796231`；完整 `snapshot()` JSON 也相等 |
| 运行环境 | Node v22.23.2；固定源已有依赖；未安装、未联网、未开端口、未开浏览器／GPU／音频 |

命令入口实际采用的是页面 §4 描述的本地稳定席位封套；没有采用 `default-src` 冻结入口。每端先用原 `Simulation.commandFrame(flatCommands)` 构造封套，再只改 `inputs` 数组的到达顺序；`Simulation.frameCommands` 按 seat 升序重排并保留席内数组顺序，脚本没有实现第二套排序。

## 实际结果

### 600 tick 主窗口

- 逐 tick 比较 `finalHash()`：600/600 相同，0 次不一致。
- 逐 tick 比较 `CommandResult[]`（含 accepted／reason／command）：600/600 相同，0 次不一致。
- tick 100–129 显式发送六席空数组，仍逐 tick 同 hash。
- tick 1 六席全部 `move`；tick 2 同一席按 `[move, stop]` 顺序发送；tick 3 红方同席也做 `[move, stop]`。
- 同席顺序反过来的独立对照：`[move, stop]` 得 `2f19177b755dd380`，`[stop, move]` 得 `438e4c3e88c25c8c`，确实不同。

### 关键回执

| tick | 命令 | 原 `CommandResult` | 规则观察 |
|---:|---|---|---|
| 5 | seat 1 cast W，`direction: null` | `accepted:false, reason:directionRequired` | 协议形状合法，玩法拒绝；本 tick 照常推进 |
| 6 | seat 1 cast W，方向 +x | `accepted:true` | 位置 x −93.356 → −86.356（+7）；法力 330 → 300.2667；W 冷却 239 |
| 7 | seat 1 再按 W | `accepted:false, reason:cooldown` | 法力只回蓝，冷却 239 → 238 |
| 11 | seat 0 / seat 3 各 cast W | 两条均 `accepted:true` | 各沿自己方向位移 7（x 分别 +7／−7）；法力 330 → 300.2667；冷却 239 |
| 12 | seat 0 再按 W | `accepted:false, reason:cooldown` | 不重复消耗 |
| 13 | seat 2 / seat 5 各 cast Q | 两条均 `accepted:true` | 各扣 40 法力，Q 冷却 135 |
| 20 | seat 0 move；A 端把同席同内容封套再送一次；seat 4 cast Q | 两条均 `accepted:true`；A／B 结果数组相同 | 同身份合法重送只消费一次 |
| 30 | seat 0 buyItem `wayfarer_boots` | `accepted:false, reason:notEnoughGold` | 600 tick 内买不起 |
| 9001 | seat 0 buyItem `wayfarer_boots` | `accepted:true` | 金币 600.000000000046 → 0.0667；items 变为 `['wayfarer_boots']`；maxHp 954 → 1054 |
| 9002 | seat 0 / seat 3 cast W | 两条均 `accepted:true` | seat 0 法力 414 → 384.2667，冷却 218（装备的 cooldownRate 0.1 生效），位置 +7 |

### 重送与失败用例

- **合法同身份重送（cast）**：另起 `dedupeA`／`dedupeB` 两个 Simulation，各先空跑五帧，再在其 tick 6 重送 seat 0 的 W；带重复与不带重复两端的 `finalHash()` 相同，`CommandResult[]` 相同且长度均为 1，法力只扣一次（330 → 300.2667），W 冷却 239。**负责人接收勘误**：这不是主跑 tick 6 的 seat 1 正常 W；主跑的重送发生在 tick 20、seat 0 的 move。
- **同身份内容冲突**：同一 seat 0 带两段不同 commands → 抛 `conflicting input retry`；hash 与 tick 不变。
- **错 heroId**：seat 0 的命令带 seat 1 的 heroId → 抛 `input does not own this hero`；hash 与 tick 不变。
- **缺席**：只给 5 个 seat → 抛 `missing input seat (send explicit empty commands)`；hash 与 tick 不变。
- **非下一 tick**：给当前 tick 或 `current + 2` → 均抛 `input tick is not the next simulation tick`；hash 与 tick 不变。
- **额外玩法字段**（`mana: 999`）→ 抛 `malformed frame command`；hash 与 tick 不变。
- **越界 seat**（seat 6）→ 抛 `invalid input seat`；hash 与 tick 不变。
- 全部拒收发生在 `step` 推进之前；探针结束后再送合法帧，tick 正常 +1。

### 长跑与购买边界

- 主窗口 600 tick 后以六席空帧为主继续到 9,081 tick，另在 9001 tick 插入购买、9002 tick 插入两条 W；9,081/9,081 tick 的 hash 与结果数组均一致，0 分歧。
- 第 9,000 tick 结束时 seat 0 金币 600.000000000046；第 9,001 tick 购买成功。被动金币 2/s、30 Hz，600 tick（20 秒）只有约 40，最便宜装备 600。`step` 先应用命令，后 `updateEconomy`，所以本输入序列在积满 600 后的下一帧购买；这是经济和更新顺序边界，不是版本限制。
- 第 9,081 tick 模拟仍在 running，没有终局、没有结算；本结果不宣称完整一局或产品联机。

## 页面卡点

以下记录原读者针对旧页的卡点。负责人已在 07 页补结构、运行入口与范围，尚无修改后新读者实做；卡点 2 的原表述经接收核查修正如下。

### 1. 页面只给入口名，没给可构造的封套 schema

页面原文（§4“本地命令接缝已进入可玩案例”）：

> 把旁置试玩 `candidate.html` 的玩家与机器人输入送入同一个 `Simulation.commandFrame` → `sim.step`：模拟层按队伍／阵容分配稳定席位，信封包含目标 `tick` 与各席 `commands`，按席位升序消费，保留席内操作次序，空席也显式提交空数组。

缺什么：页面没有给 `CommandFrame` 的精确结构（`{tick, inputs:[{seat, commands}]}`）、`inputSeats` 的 team-major 席位公式、`heroesPerTeam` 如何生成 6 席、`contentVersion` 取多少、`commandFrame` 是否复制输入。第一次读页无法只凭这段构造可运行帧。实际只能去读 `src/sim/simulation.ts`、`src/sim/command-frame.ts`、`src/sim/types.ts` 和 `tests/command-frame.test.ts`。

做错过的：第一版脚本误以为 `commandFrame` 只返回命令数组，按页面文字先写了一个自定义 `{tick, seats}` 形状；读到源码后改为 `inputs[{seat, commands}]`。

### 2. 已区分协议与玩法拒绝，缺少具体返回／异常合同

页面原文：

> 乱序到达不改变结果；同批同席相同输入只消费一次，冲突／缺席／错席／旧帧／未来帧在推进前拒绝。

**负责人接收勘误**：原读者漏引同页 §4 已有的“**协议拒绝与玩法拒绝分开。** 错英雄、坏字段、未开放帧或冲突重试先拒绝，不进入本帧。合法形状的请求仍可能被原规则以 `directionRequired`／`cooldown` 拒绝；本例照常推进并向两端提交该帧……”；不能称页面没有区分两类拒绝。

实际缺口是采用段未给本地 API 的具体合同：冲突／缺席／错席／旧帧／未来帧／额外字段在推进前 `throw`；合法形状但 `directionRequired`／`cooldown`／`notEnoughGold` 等返回 `CommandResult[]` 中的 `{command, accepted:false, reason}`，运行中的对局照常推进。原读者从 `Simulation.step`／`applyCommand` 源码确认了这些返回形式；应补这项，不重写成原页缺整套拒绝机制。

做错过的：最初把 `buyItem` 过早购买也准备成“协议拒收”；读到 `commandBuyItem` 后改为保留 `notEnoughGold` 的 `CommandResult`。

### 3. 页面没有六席完整示例，也没有 600 tick 的运行口径

页面原文（§4 第一段）：

> 一个服务端按席位排帧并裁决，两个 Node 客户端只消费服务端提交的下一帧；同机同版本的三份状态哈希互相核对。

这段描述的是旧 TCP 三进程小样；同页后面才说本地封套已采用。页面没有给“两个独立 `Simulation`、六席、600 tick、每端不同到达顺序”的可运行例子，也没有说空席之外的席位数和 tick 预算。任务要求的 600 tick、六席、双 Simulation 是任务正文补的，不是页面给的。读者只能把页面两句拼起来再读源码。

做错过的：第一次跑只做到 4 个 tick 的到达顺序真正不同（其余 tick 只有一个非空席），证据偏弱；后把周期 move 改为每 20 tick 三个席同时发，增加到 31 个 tick。

### 4. 页面没有提 `buyItem` 与购买经济边界

页面原文：

> 新回放标记 `stable-seats-v1`，旧无标记回放仍按原输入顺序重演（2026-10-29 [源码／离线实跑]）。

缺什么：页面 §4 的采用段没有提 `buyItem`，`tests/command-frame.test.ts` 的直接封套命令用例是 move／stop；`validFrameCommand` 允许 `buyItem`，但页面没有说购买需要原经济先给金币。实际跑出来：本输入序列的 600 tick 只有约 40 金币，最便宜装备 600，tick 30 只能得到 `notEnoughGold`；延长到 tick 9001 才真实购买。负责人接收后将 600 tick 协议窗口和长跑购买分开，不改变经济凑绿；该测试文件还含真实 bot 回放测试，不能概括为只验证了 move／stop。

做错过的：第一版脚本在 600 tick 后直接空跑到 9,081 tick，但忘了在 9,001 tick 加购买命令，结果 `items` 为空、金币 605.4；检查输出时发现，补上 `buyItem` 后重跑。

### 5. 页面没有写内容版本支持范围

页面原文：

> 若页面只支持较早 contentVersion，报告首个缺步骤并止于真实边界，不改版本凑绿。

这是任务正文的约束，不是页面原句。页面没有列 `CONTENT_VERSIONS`，也没有说 12 是否可用。实际读 `src/content/catalog.ts` 确认 `[1,2,7,8,9,10,11,12]`，contentVersion 12 可用，因此不需要改版本；但页面读者无法从页面本身判断“12 是否较早”。

### 6. 任务要求的共享指令层入口不在页面里

任务正文要求“另沿 `docs/decisions/instruction-files.md` 的现有入口确定采用的共享指令层”。页面全文没有出现 `instruction-files`、共享指令层或该入口。按“只看这一页”的读者规则，我没有读该文件，也没有声称采用了某个共享指令层；这一项在本结果中标为“未做／页面缺入口”，不以页面之外的材料补写。

## 页面之外翻过的材料

- 页面 §4 链接的 `experiments/server-lockstep/README.md`：核对旧三进程小样和 `cast` 协议的字段／失败政策；没有运行它的 `run.mjs`。
- 页面 §4 链接的 `docs/research/wp10-content.md#server-input-frames` 的文字被页面引用；实际只读了页面里的转述，没有另开研究文档。
- 本机已有 MOBA-Like 固定源工作树：`src/sim/simulation.ts`、`src/sim/command-frame.ts`、`src/sim/types.ts`、`src/content/catalog.ts`、`tests/command-frame.test.ts`、`src/sim/nav/lane.navmesh`；用于确认 `commandFrame`／`step`／`inputSeats` 的真实合同。
- 先跑了固定源的 `tests/command-frame.test.ts`（6/6 通过）确认运行环境和源可用；这只是环境核，不作为本任务的消费者结果。
- 为定位固定源，查看了本机 `work/repos/dbvv1__MOBA-Like` 和 `work/wt/B-MOBA-FIXED-CAPTURE-20261105` 的 git 状态、提交祖先和 `node_modules` 是否存在；没有改固定源。
- 未读：`docs/collaboration/TASKS.md`、`docs/decisions/instruction-files.md`、a1dbv 其他研究文档、同主题其他教程、模型网关材料、浏览器／GPU 材料。

## 做错与修正

1. **漏掉真实购买**：第一次完整跑（9,081 tick）没有在 tick 9001 插 `buyItem`，输出 `items: []`、`gold: 605.4`。看 `run-output.json` 的 `tick9001.results` 为空才发现；补上购买命令后重跑，得到 `accepted:true`、`items:['wayfarer_boots']`、`maxHp 954 → 1054`。
2. **到达顺序差异太少**：第一版只有 4 个 tick 的多席非空；改为每 20 tick 三席同时 move，增加到 31 个 tick。
3. **探针效率**：早期临时 probe 每 tick 调了三次 `commandFrame([])`；正式脚本改为每 tick 构造一次。不影响正确性，只影响耗时。
4. **误判 600 tick 可购买**：先按“600 tick 应该够买一次”写计划，读 `updateEconomy`／`items` 后才确认被动金币 2/s、最便宜 600，必须延长到 tick 9001；这是页面缺的经济边界，不是我改规则。

## 边界与未运行

- **通过**：本文列出的 600 tick 六席逐 tick hash／结果一致、9,081 tick 长跑一致、购买与技能消耗、七项协议拒收、重送去重、席内顺序对照。
- **未运行**：TCP／WebSocket／端口、旧 `server-lockstep/run.mjs`、浏览器（含 headless）、Unity／Unreal、GPU／音频、公网认证、跨设备、丢包／延迟、完整终局与结算。
- **不宣称**：浏览器浮点一致、跨平台确定性、真实网络体验、产品联机验收、公网身份认证、性能或吞吐冠军。
- **原读者待负责人决定**：是否补 `CommandFrame` schema／`inputSeats` 公式／`buyItem` 经济边界及 `instruction-files.md` 入口。负责人本次已修页，修改后新读者采用、共享指令实际加载／行为验收仍未完成。

## 原读者检查记录

- `git diff --cached --check`：退出 0，无空白错误；四个新文件均为 UTF-8、LF、无行尾空白。
- `python scripts/check_public.py --staged`：扫描 1,415 个索引文件，`findings: []`；`status: incomplete` 只因 43 个既有二进制图片被跳过，四个新文件都在扫描范围内且未被跳过，没有命中凭据、私钥、本机路径或非占位邮箱。
- `python scripts/check_repo.py`：扫描 881 个文件，`errors: []`，退出 0；只核行内本地链接和 JSON／TOML 语法，不核外部事实。
- 另用正则扫描四个新文件：无 Windows 盘符绝对路径、用户主目录绝对路径、`/home/`、内网 IP、本机回环地址或邮箱式地址。
- 未提交、未推送；工作树 `git status` 只显示本任务的两个未跟踪路径。若后续提交，提交身份须按运行细则用 noreply 覆盖，本机现有 `user.email` 不是 noreply。

## 复现（负责人接收勘误）

从任意目录开始，先将前两条路径赋值中的占位符换成含本产物的 a1dbv 和固定 MOBA 源工作树目录；后者的 `node_modules` 必须与其 `package-lock.json` 一致。原实跑为 Node 22.23.2，缺运行时或依赖应明确报告，不自动安装或更换源码。旧命令未切工作目录且把 `run.mjs` 当作当前目录文件，按原样无法复跑。

```sh
set -eu
A1_ROOT="$(cd '/path/to/a1dbv' && pwd -P)"
MOBA_SOURCE="$(cd '/path/to/MOBA-Like' && pwd -P)"
ARTIFACT="$A1_ROOT/docs/collaboration/local-jobs/artifacts/B-CORE-STABLE-SEATS-ADOPTION-20261106"
TARGET=7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64
test "$(git -C "$MOBA_SOURCE" rev-parse HEAD)" = "$TARGET"
git -C "$MOBA_SOURCE" diff --quiet HEAD -- src/sim src/content package.json package-lock.json
(
  cd "$MOBA_SOURCE"
  node --version
  MOBA_SOURCE="$MOBA_SOURCE" MOBA_TARGET_COMMIT="$TARGET" \
    node --import tsx "$ARTIFACT/run.mjs" > "$ARTIFACT/run-output.recheck.json"
)
```

工作目录必须是 MOBA 源根，让 `--import tsx` 找到其已有依赖；脚本与输出使用绝对路径，新输出另存以保留原 `run-output.json`。脚本只用指定源码、已有依赖和 `src/sim/nav/lane.navmesh`，不安装、不联网、不开端口。原输出含 600 tick 的逐 tick hash、关键 tick 的 `CommandResult`、失败探针、重送与顺序对照。

脚本遇 hash／结果分歧会停止主循环并输出 JSON，退出码不是完整验收。还须核：`window600.ticks === 600`、`perTickHashEqual === true`；`extension.totalTicksRun` 与 `perTickCompareTicks` 均为 9081、两项 mismatch 为 0、`firstMismatch === null`；600 tick 完整 snapshot 相等；七项拒收、恢复合法帧、去重与席内反序对照通过；9001 tick 的 items／扣款和 9002 tick 的技能消耗真实发生。

产物：`run.mjs`、`run-output.json`、本文件。

## 负责人接收勘误

- **接收范围**：复用原读者及卡面已有非读者复核记录，不重跑本机任务、不把修页称为新读者复测。原 `taskDone=false`、未读共享指令入口及完整终局／网络等未验项保留。负责人确实读取了共享指令页，并只把入口与加载证据边界补入 07；未代替 TASKS 宣布共同要求完成。
- **源与回执核对**：只读固定 MOBA `7e1986f` 的 `CommandFrame`／`inputSeats`／`step`、内容表及经济更新顺序，核原脚本与 JSON 的 600／9081 tick、31 次顺序变化、购买、去重及七项拒收。原脚本与 JSON 未改；两长窗口沿用交回实跑，不冒称本次重新完整执行。
- **最小独立检查**：在固定源的临时归档副本中，复用锁文件一致的已有依赖，Node 24.22.1 以 3 tick 小核确认六席、命令深拷贝、显式空席、一帧乱序同 hash、缺席抛错且 hash／tick 不变，以及 `directionRequired`／`notEnoughGold` 的玩法返回并推进；原脚本 `node --check` 通过。不是 600／9081 tick 的跨运行时复现。
- **入口核查**：从空临时目录填写两条仓库路径，成功解析产物绝对路径并从 MOBA cwd 加载 `tsx`／真实 `Simulation`；原脚本在故意缺 `MOBA_SOURCE` 时按预期退出 2。07 与本报告的复现命令相同。这里只验证入口、缺输入和上述小核，未借此声称完整长跑已重执行。
- **负责人探针失误已纠正**：最初将两次 Detour 初始化改成 `Promise.all`，不同于交回脚本，初始 hash 断言失败；恢复原脚本逐个 `await createDetourNavigation` 后，两端初始 hash 都回到 `5c5deac80803f1ea`，上述小核通过。没有据此归因 Node 版本，也没有修改生产实现、原脚本或原 JSON；此失误不算原读者卡点。
- **文档与公开检查**：`check_repo.py` 904 文件、0 错误；`check_public.py` 1,441 文件、0 命中。另显式扫描 07 与本目录三个文件，覆盖本次产物，4/4 无命中、UTF-8／LF／无行尾空白；工作树 `git diff --check` 通过。未提交、未推送，固定 MOBA 源仍 clean。
- **真实读者增量**：把已有生产封套从旧双席／三进程描述推进到六席真实命令、玩法拒绝、原经济购买和独立重送探针；页面现在给出精确结构、映射及可执行 cwd／脚本路径。修改后是否能仅照本页完成，仍待另一位新读者；本轮不补造该证据。
