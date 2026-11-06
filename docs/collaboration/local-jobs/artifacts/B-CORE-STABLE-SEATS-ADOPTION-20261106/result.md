# B-CORE-STABLE-SEATS-ADOPTION-20261106 · 六席真实命令消费结果

**结论：通过（本地同版本 CPU 接缝）。** 两个独立 `Simulation` 以 seed 901、contentVersion 12、`heroesPerTeam: 3`、同一份 `lane.navmesh` 和同一初态运行；600 tick 内六席按稳定 team／roster 映射消费 move／stop／cast／buyItem，逐 tick `finalHash()` 与 `CommandResult` 完全一致。继续到第 9,081 tick 时仍是 0 分歧，第 9,001 tick 用原经济规则完成一次真实购买，第 9,002 tick 完成一次真实技能消耗。经页面未写明的边界：600 tick 内被动金币只有约 40，买不起最便宜的 600 金币装备；真实购买只能在约 300 秒后出现。没有改版本、没有直接写金币、没有注入权威状态。

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
| 11 | seat 0 / seat 3 各 cast W | 两条均 `accepted:true` | 两端各 +7 位移；法力 330 → 300.2667；冷却 239 |
| 12 | seat 0 再按 W | `accepted:false, reason:cooldown` | 不重复消耗 |
| 13 | seat 2 / seat 5 各 cast Q | 两条均 `accepted:true` | 各扣 40 法力，Q 冷却 135 |
| 20 | seat 0 move；A 端把同席同内容封套再送一次；seat 4 cast Q | 两条均 `accepted:true`；A／B 结果数组相同 | 同身份合法重送只消费一次 |
| 30 | seat 0 buyItem `wayfarer_boots` | `accepted:false, reason:notEnoughGold` | 600 tick 内买不起 |
| 9001 | seat 0 buyItem `wayfarer_boots` | `accepted:true` | 金币 600.000000000046 → 0.0667；items 变为 `['wayfarer_boots']`；maxHp 954 → 1054 |
| 9002 | seat 0 / seat 3 cast W | 两条均 `accepted:true` | seat 0 法力 414 → 384.2667，冷却 218（装备的 cooldownRate 0.1 生效），位置 +7 |

### 重送与失败用例

- **合法同身份重送（cast）**：tick 6 的同席 cast W 封套发两次；带重复与不带重复两端的 `finalHash()` 相同，`CommandResult[]` 相同且长度均为 1，法力只扣一次（330 → 300.2667），W 冷却 239。
- **同身份内容冲突**：同一 seat 0 带两段不同 commands → 抛 `conflicting input retry`；hash 与 tick 不变。
- **错 heroId**：seat 0 的命令带 seat 1 的 heroId → 抛 `input does not own this hero`；hash 与 tick 不变。
- **缺席**：只给 5 个 seat → 抛 `missing input seat (send explicit empty commands)`；hash 与 tick 不变。
- **非下一 tick**：给当前 tick 或 `current + 2` → 均抛 `input tick is not the next simulation tick`；hash 与 tick 不变。
- **额外玩法字段**（`mana: 999`）→ 抛 `malformed frame command`；hash 与 tick 不变。
- **越界 seat**（seat 6）→ 抛 `invalid input seat`；hash 与 tick 不变。
- 全部拒收发生在 `step` 推进之前；探针结束后再送合法帧，tick 正常 +1。

### 长跑与购买边界

- 主窗口 600 tick 后继续用六席空帧推进到 9,081 tick；9,081/9,081 tick 的 hash 与结果数组均一致，0 分歧。
- 第 9,000 tick 时 seat 0 金币 600.000000000046；第 9,001 tick 购买成功。被动金币 2/s，600 tick（20 秒）只有约 40，最便宜装备 600；这是页面没有写的真实经济边界，不是版本限制。
- 第 9,081 tick 模拟仍在 running，没有终局、没有结算；本结果不宣称完整一局或产品联机。

## 页面卡点

以下均按页面原文定位。

### 1. 页面只给入口名，没给可构造的封套 schema

页面原文（§4“本地命令接缝已进入可玩案例”）：

> 把旁置试玩 `candidate.html` 的玩家与机器人输入送入同一个 `Simulation.commandFrame` → `sim.step`：模拟层按队伍／阵容分配稳定席位，信封包含目标 `tick` 与各席 `commands`，按席位升序消费，保留席内操作次序，空席也显式提交空数组。

缺什么：页面没有给 `CommandFrame` 的精确结构（`{tick, inputs:[{seat, commands}]}`）、`inputSeats` 的 team-major 席位公式、`heroesPerTeam` 如何生成 6 席、`contentVersion` 取多少、`commandFrame` 是否复制输入。第一次读页无法只凭这段构造可运行帧。实际只能去读 `src/sim/simulation.ts`、`src/sim/command-frame.ts`、`src/sim/types.ts` 和 `tests/command-frame.test.ts`。

做错过的：第一版脚本误以为 `commandFrame` 只返回命令数组，按页面文字先写了一个自定义 `{tick, seats}` 形状；读到源码后改为 `inputs[{seat, commands}]`。

### 2. 页面说“拒绝”，没说协议拒收与玩法拒收的返回方式不同

页面原文：

> 乱序到达不改变结果；同批同席相同输入只消费一次，冲突／缺席／错席／旧帧／未来帧在推进前拒绝。

缺什么：页面没有区分“协议错误抛异常”和“玩法拒绝返回 `CommandResult`”。实际是：冲突／缺席／错席／旧帧／未来帧／额外字段全部 `throw`；合法形状但 `directionRequired`／`cooldown`／`notEnoughGold` 等返回 `{accepted:false, reason}` 并照常推进。若读者按统一“拒绝”处理，会把玩法拒绝误当整帧失败。实际从 `Simulation.step`／`applyCommand` 源码确认。

做错过的：最初把 `buyItem` 过早购买也准备成“协议拒收”；读到 `commandBuyItem` 后改为保留 `notEnoughGold` 的 `CommandResult`。

### 3. 页面没有六席完整示例，也没有 600 tick 的运行口径

页面原文（§4 第一段）：

> 一个服务端按席位排帧并裁决，两个 Node 客户端只消费服务端提交的下一帧；同机同版本的三份状态哈希互相核对。

这段描述的是旧 TCP 三进程小样；同页后面才说本地封套已采用。页面没有给“两个独立 `Simulation`、六席、600 tick、每端不同到达顺序”的可运行例子，也没有说空席之外的席位数和 tick 预算。任务要求的 600 tick、六席、双 Simulation 是任务正文补的，不是页面给的。读者只能把页面两句拼起来再读源码。

做错过的：第一次跑只做到 4 个 tick 的到达顺序真正不同（其余 tick 只有一个非空席），证据偏弱；后把周期 move 改为每 20 tick 三个席同时发，增加到 31 个 tick。

### 4. 页面没有提 `buyItem` 与购买经济边界

页面原文：

> 新回放标记 `stable-seats-v1`，旧无标记回放仍按原输入顺序重演（2026-10-29 [源码／离线实跑]）。

缺什么：页面 §4 的采用段没有提 `buyItem`，`tests/command-frame.test.ts` 也只覆盖 move／stop；`validFrameCommand` 允许 `buyItem`，但页面没有说购买需要原经济先给金币。实际跑出来：600 tick 只有约 40 金币，最便宜装备 600，`buyItem` 在 tick 30 只能得到 `notEnoughGold`；真实购买必须继续到 tick 9001。页面没有写这个边界，也没有写“若 600 tick 内必须出现真实购买，需要先改变经济或延长运行”的取舍。

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
- **待人工判断**：页面是否应补 `CommandFrame` schema／`inputSeats` 公式／`buyItem` 经济边界；任务要求的 `instruction-files.md` 共享指令层入口是否应写进页面。这两项不是本读者能替页面决定的。

## 检查

- `git diff --cached --check`：退出 0，无空白错误；四个新文件均为 UTF-8、LF、无行尾空白。
- `python scripts/check_public.py --staged`：扫描 1,415 个索引文件，`findings: []`；`status: incomplete` 只因 43 个既有二进制图片被跳过，四个新文件都在扫描范围内且未被跳过，没有命中凭据、私钥、本机路径或非占位邮箱。
- `python scripts/check_repo.py`：扫描 881 个文件，`errors: []`，退出 0；只核行内本地链接和 JSON／TOML 语法，不核外部事实。
- 另用正则扫描四个新文件：无 Windows 盘符绝对路径、用户主目录绝对路径、`/home/`、内网 IP、本机回环地址或邮箱式地址。
- 未提交、未推送；工作树 `git status` 只显示本任务的两个未跟踪路径。若后续提交，提交身份须按运行细则用 noreply 覆盖，本机现有 `user.email` 不是 noreply。

## 复现

在固定 MOBA 源工作树的父环境里：

```sh
MOBA_SOURCE=<MOBA-Like 固定源工作树> \
MOBA_TARGET_COMMIT=7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64 \
node --import tsx run.mjs > run-output.json
```

脚本只用 `MOBA_SOURCE` 指向的源码、其已有 `node_modules` 和 `src/sim/nav/lane.navmesh`；不安装依赖、不联网、不开端口。`run-output.json` 含 600 tick 的逐 tick hash、关键 tick 的 `CommandResult`、失败探针、重送与顺序对照。

产物：`run.mjs`、`run-output.json`、本文件。
