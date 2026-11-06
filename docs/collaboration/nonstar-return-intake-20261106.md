# 非 Star 回交：先接收能改变做法的部分

2026-11-06 UTC；接收输入 `a1dbv@8fe980246a01398531af97eb6ec7c5bf94e9b570`。本轮不重启原调用，不把 `review_ready`／远端提交当作原 CLI 或登记进程退出证明，不改变案例默认、部署或 Star 出图任务。

## 决定

| 已回交单元 | 接收的具体增量 | 不接收与剩余项 |
|---|---|---|
| [共享材质读者 f0650b0](https://github.com/dbvv1/a1dbv/blob/f0650b00e64423e91fe54415061554750eedfd8f/docs/collaboration/local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/result.md) | 页面确实缺入口／顺序／实例与 world 所有权。已直接修回[材料页](../../domains/game-dev/assets/materials.md#quiet-material-family)，并补生产消费者反例 | 原 helper 重绑已准备模板会重复 shader 声明；原测试分别加载 GLB，没证明两实例共享原图集。四路中没有一直保留真实第一实例，读者任务 `taskDone=false`，卡保留 blocked；不自动重派 |
| [声音所有权 1b2a15f](https://github.com/dbvv1/a1dbv/blob/1b2a15f375c2bea74979aa4cca5c0f7a250e5399/docs/collaboration/local-jobs/artifacts/B-CORE-AUDIO-OWNERSHIP-SOURCES-20261104/sources.md) | 只采用 howler 已排回调、Phaser 完成标志、GF session、Godot stop 和 FMOD release 的固定实现，回入[04](../../domains/game-dev/04-client-modules.md#声音事件播完以后谁解除让位)与[WP10](../research/wp10-motion.md#audio-owner-identity) | 原整稿与五项测试方案未通过，不追加来源数量。FMOD“等 STOPPED 才 release”、Godot／Unreal 混组、GF 浮动行号与 Wwise 排除项仍作依据均不采用。新增断言未执行、未听验 |
| [AI 游戏音频 9d1b5ad](https://github.com/dbvv1/a1dbv/blob/9d1b5ad2f1f3fc69407f2bf10164597f7b413bf5/docs/collaboration/local-jobs/artifacts/B-AI-GAME-AUDIO-MIX-20261104/sources.md) | 只采用 Claude of Tanks 的前置类别／全局淘汰与让位分层、Kart Royale 的持续增益／事件包络分离，回入[音频页](../../domains/game-dev/assets/audio.md)与[WP6](../research/2026-10-14-game-wp6-audio.md#ai-game-mix-ownership) | 不是新推荐榜，也未读完即认可全部候选。World of ClaudeCraft 不重复计新案例；其 24 是 sampled one-shot 上限，不是全局声音上限。NOVA 有 Pool(40/48)、MAX_LOOPS=16；小巫人数只留作者自述、播放规则原文未核。原稿三轮审查未过不改写成通过 |

来源卡仅部分研究证据 accepted，剩余广搜与不可靠结论明确放弃；这不表示原稿整项通过。材料页已改而独立照做未过，恢复需要基于修订页明确写差量、确认原调用终态后续接，不能再冒充首次盲读。本轮没有新增执行卡。

## 共享材质定向验证

固定 `MOBA-Like@b489ed38592dc184fffe2ab9b3b186441c7dc9bb` 的已有源树，隔离目录运行。锁文件 SHA-256 `edefefba9571006039cd9ff4035b180fbb1a11c7bdfa6fa558ed5a98a4556b3a`；Node 24.22.1，Vitest 3.2.4。仅复用匹配锁文件的现成依赖，没有 fetch 全分支、安装或本机重复核查。

命令：`vitest run tests/client/quiet-reader-production-proof.test.ts tests/client/quiet-family.test.ts tests/client/quiet-buildings.test.ts --maxWorkers=1`。3 文件、12 项通过，其中既有 10 项，新增 2 项：

1. 实际 `loadBattleAssets` 解析 GLB，按生产顺序先 `applyQuietBuildings` 再 `createBattlefield.sync`。基于真实快照人工追加第二个同型结构，仅用于生命周期刺激，不声称玩法已新增建筑。两者共享 material、geometry、原图集 map 与 quietWall；移除第二个后第一仍在，四者均未释放；最后按消费者→模板绑定→资源所有者退出，模板几何／材质和原图集各只释放一次。
2. 将原回交 helper 施加到已准备模板的克隆，确实生成两份 `quietStoneMask` attribute、两份 `quietWall` uniform 和两个 cache-key 后缀，证明错误实现不应进入消费者。

可复跑[完整测试](local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/quiet-reader-production-proof.test.ts)：放到固定消费者 `tests/client/`；从原回交末尾 diff 提取 `src/render/quiet-building-instance.ts` 的新增行作为被检验错误输入，不改任何已有生产文件。正确路径直接调用生产函数，错误 helper 只用于反例。

边界：GLB 真实 CPU 解析，但 texture loader 返回内存 `THREE.Texture`；检查 shader 字符串，不编译 GLSL、不跑 WebGL、不解码 WebP、不做同机位图。原报告的全套 571/572 与历史 550 不是本轮新全量成绩，不重跑未知原进程，也不补算品质分。

## 待人工验收与后续

[现有集中批次](b-work-20261106.md#待人工验收)保持；本轮没有产生新的可听包或成对实机录音。两款外部游戏若进入采用候选，先核媒体许可，再人听／人玩其提示辨识、混音与操作；现在只接机制，不要求用户逐项审链接。

MOBA quiet WebGL 与同机位证据仍待具备条件；FPS 模型上传、MOBA 原发布未知动作及既有拒绝不由本次接收解除。CPU、来源和文档检查不能替代 Star 品质闭环。
