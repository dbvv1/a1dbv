# FPS 训练赛角色 adapter：离线模块已接收，运行接线待做

**当前决定：接收离线 adapter，不接受训练赛已接线或画面已改善的结论。** 返工源 [411f155](https://github.com/dbvv1/FPS-Like/commit/411f155cf014fa10023f870e68a1c28eab02da8e) 已于 2026-11-04 UTC 整合至 FPS main [fa8740d](https://github.com/dbvv1/FPS-Like/commit/fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8)，保留源提交为合入父节点；原卡标 accepted。下面保留首次反例，说明接收的是完整、诚实的 CPU 模块，不是回切状态缺口已经修好。

## 返工复核与接收

- 差量为 README、4 个新增真实 `Game` / `Feedback` 测试及 adapter 的 5 行注释，运行逻辑未改变。文档明确旧 fire 可以在回切后重新被选中，并分别说明缺 reload/switch 源片段与缺只读切枪历史，撤回了原强保证。
- 新增测试覆盖步枪回切、手枪回切与无切枪对照、同 tick 多次切枪、切枪取消换弹。手枪最终快照完全相等及旧 fire 50 ms 的反例都被保留，不用 `nextShot` 或逐帧观察伪造解决。
- 独立合并当前 main `ecb53c7` 后，在 Node 24.22.1 重跑 **21/21** adapter、独立 tsc、根类型检查、**430/430** 与构建，全部通过且无跳过。21 项须另跑，不属于根测试数。相较首次候选构建，**34 个 web-dist 文件逐一哈希相同**；`src/`、运行资产、根测试与依赖未变。
- 本轮原执行另核：Workflow completed；CLI 于 **18:39:09 UTC** 退出 0，工具 settled 且 pending 空；**557** 个登记进程身份均 exited，当前存活匹配 0、无本卡活跃写者。外层 worker 独立退出事件、退出码和时刻仍未知。此处没有复用首次 `f5eacd9` 的旧退出回执。
- 源 reload/switch 动作、训练赛 `scene.ts` 接线、准确清除切枪前旧 fire 的只读事实仍待补齐；浏览器与同机位、脚接触、死亡轮廓未验。没有改默认渲染、没有部署，不提升品质通过数。公开文件／提交扫描及差异检查通过；发布时该 SHA 未观察到 hosted CI run，不称 CI 已通过。

## 首次复核：返工依据（f5eacd9）

**首次决定：保全 `f5eacd9`，返工文档和真实切枪命令测试；训练赛接线、切枪历史保证及视觉验收延期。** 本次没有合入 FPS main，也没有新增重复本机任务。接收端只读核查已确认原 Workflow completed、CLI 于 17:12:45 UTC 以 exit 0 关闭、工具 settled 且 pending 为空，1,240 个登记进程身份均为 exited、当前存活匹配为 0；三类非作者复核均通过。外层 worker 独立退出事件仍未知，不用 PID 消失推断退出码。当时据此沿原卡返工。

评审对象是 [B-FPS-TRAINING-CHARACTER-ADAPTER-20261104](../local-jobs/B-FPS-TRAINING-CHARACTER-ADAPTER-20261104.md) 的 [固定提交 `f5eacd9`](https://github.com/dbvv1/FPS-Like/commit/f5eacd9d9cc251e20c28529be430ae29db1a20ec)。2026-11-04 UTC 核最新 a1dbv main `94f8a978` 及[手册 §7](../LONG-TERM-PLAN.md#7-交付流程)，FPS main 仍是 `36fde4bb6a2e8f9652528fdea648d0a90190db79`。独立复核只用云端 CPU 和既有依赖，没有占用本机 GUI、浏览器或 GPU。

## 已核实的产物和检查

- 差量只有 `asset-pipeline/training-character-adapter/` 下的 adapter、测试、tsconfig 和 README，共 4 文件。`src/`、根测试入口和运行资产没有变化；现有训练赛 `scene.ts` 仍使用程序化角色，没有导入这个 adapter。
- Three 实际解析原 `enemy-relay-guard.glb`：40,388 字节，SHA-256 `5b316a139cf48b21a6d6b7328ac1c8b58a73c4f41ce1a0de24f2a8ca74afbd74`，与固定源 `b198df62a56f4c520716fbc9cb4afac47dd62213` 的导出字节完全一致。五段 clip 为 idle 4 s、walk 0.9 s、fire 0.12 s、hit 0.18 s、death 0.6 s。
- 本 adapter 不消费第一人称 GLB，也未修改其原字节，哈希仍为 `e672d06e30262f2575076f759645aa3d82d6734f0c26ef280a2a36870549b9e1`。角色模板资源共享、rest TRS 重置、队友程序化队色、单次世界 Z 映射和原模拟只读边界均保留。
- 在 Node 24.22.1 重跑：adapter **17/17**、adapter 独立 TypeScript 检查、根类型检查、根测试 **430/430**、生产构建均通过，无失败或跳过。根 `npm test` 不收集 adapter 目录，17 项不是 430 项的一部分。
- 另用真实 `Game` / `Feedback` 补验终局死亡尾段：30 / 60 / 144 Hz 呈现序列在同一既有 Feedback 年龄产生逐节点相同 TRS，GameState 字节表示未改变。原测试覆盖真实终局停 tick、700 ms 后隐藏和下一回合重置；这次补验不替代真实相机。
- 17 项中的 reload/switch 用例只证明「reload 进行中、当前武器已切成另一把」时不选 fire。没有真实 reload / switch clip，也没有测试快速回切、同 tick 多次切枪或切枪取消换弹。

可重复入口：

```sh
node --import tsx --test asset-pipeline/training-character-adapter/adapter.test.ts
npx tsc -p asset-pipeline/training-character-adapter
npm run typecheck
npm test
npm run build
```

## 返工依据：回切会重新选中旧 fire

`selectMotion` 以当前 `actor.weapon` 匹配历史 `state.shots`。它能排除另一把枪的事件，不能证明这把枪在事件之后没有被切走再切回。README 的“切枪后不会重现旧 fire”因此超出了实现和测试证据。

用真实 `Game.create(1, specs)`，两名角色分别位于 `(0,0,0)` 和 `(0,0,5)`，相邻三次 `step` 依次给进攻方 `shoot(yaw=0,pitch=0)`、`switch(pistol)`、`switch(rifle)`，每帧读取真实快照和 Feedback：

| 帧末模拟时间 | 当前枪 | shots 数 | nextShot | 选中动作 |
|---|---|---:|---:|---|
| 1,000 subticks | rifle | 1 | 6,000 | fire，16.67 ms |
| 2,000 subticks | pistol | 1 | 13,000 | idle |
| 3,000 subticks | rifle | 1 | 14,000 | fire，50 ms |

第三帧没有新开枪，adapter 却再次显示同一旧事件的 fire 尾段。它没有把年龄归零，因此不是 clip 从头重播，但仍不满足“切回后保持普通姿态、不重新出现旧开火表现”的强保证。

**不能只加一个 `nextShot` 判断就宣称问题解决。** 另用两份真实 `Game.create(1)`：都先切手枪、推进 12 tick、向上开一枪；一份接着切步枪再切回手枪，对照只推进两 tick。两份最终 GameState 经 `deepEqual` 完全相同：`time=16000`、唯一 shot 的 `time=13000`、`nextShot=28000`，adapter 都选 fire 50 ms。手枪原冷却比这次切枪间隔长，现有快照不保留这段切枪历史。

## 沿原成果怎样继续

1. 原 CLI 与登记进程已确认退出，沿原卡、原结果分支返工，不重新制作角色。README 改为实际保证：当前武器匹配、换弹期间抑制、事件年龄过期，不承诺任意快速回切均清除旧 fire。补真实 `Game` 的步枪／手枪回切和同 tick 切枪测试，明确当前缺口，不能只改假 Actor 字段当事件验收。
2. 如果接线要求切枪后不再出现旧 fire，须由真实命令／模拟提供只读切枪事件或代际事实，再让表现消费；这是现有合同缺项，另定接线范围。不能在本卡偷偷加模拟状态、墙钟或依赖观察到中间帧的历史，否则会破坏同快照、同呈现年龄的一致性。
3. 后续训练赛接线仍在 `src/candidates/offline-training-v1/render/scene.ts` 的敌方循环，接 owner 的启动／reset／dispose、异步加载失败回退和旧程序化模型隐藏。保持队友队色、第一人称既有消费者与 CPU 回退，不把旧 1v1 已采用写成训练赛已采用。
4. 源只含五段 rigid clip：reload 缺弹匣／枪机节点和片段，switch 缺片段；固定 walk 不匹配实际速度，没有蒙皮、脚部 IK 或接触保证。缺源动作与这次回切状态缺口分开处理。
5. 浏览器、同机位前后图、步态／脚接触、死亡轮廓及第一人称视觉均未验证。接线后再按仓库规则验收；本评审不宣称画面已改善，不提升品质通过数。

依据：本次读取固定提交源码、真实 GLB 和实际执行的 CPU 结果；源合同见 [enemy 动作合同](https://github.com/dbvv1/FPS-Like/blob/b198df62a56f4c520716fbc9cb4afac47dd62213/asset-pipeline/content-set/contracts/enemy-relay-guard.actions.json)，消费代码见 [adapter](https://github.com/dbvv1/FPS-Like/blob/f5eacd9d9cc251e20c28529be430ae29db1a20ec/asset-pipeline/training-character-adapter/adapter.ts)、[真实 Game](https://github.com/dbvv1/FPS-Like/blob/36fde4bb6a2e8f9652528fdea648d0a90190db79/src/candidates/offline-training-v1/sim/game.ts)。核实日期：2026-11-04 UTC。
