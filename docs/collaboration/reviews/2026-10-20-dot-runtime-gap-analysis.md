# M4：执行空档与统计口径回溯

结论：实际在线比例未知，Git提交活跃代理不能替代执行遥测。

来源：原样迁移自 main `b6484a002b25939194ba68ab14e0e38b1518c6c1` 的 TASKS 周信号；历史完成数只表示当时快照，不代表当前项目状态。原表UTC+8，保留A／B证据等级和未知覆盖。


- **在线比例：未知**。缺少A／B连续运行段与未知时段覆盖，不能把无提交等同停工。仅复算审计的Git代理：固定 [`e15651a`](https://github.com/dbvv1/a1dbv/commit/e15651a7617601660b106802d3fc386a7176211e)，窗口10-17 13:21至10-20 10:46（UTC+8，69小时25分）；纳入截至10:46分钟末的全部可达祖先257提交，不按作者过滤，按committer时间升序、SHA去重，相邻差严格大于1小时的14段共45.904小时，`1－空档／窗口`＝33.87%。author时间相同；第一父链为32.32%。审计约35%只能称代理，不是实际在线率。审计最后一段05:45–10:46与本图不符，精确边界如下；合入旧分支可带入较早时间，提交时间也不等于发布时刻。
- **完成项：按当时项目板快照（`84d83bf`，另于Git空档窗口），K1–K7＝P1–P7，完整验收完成0／7**；P1的01、14已完成，整个P1未完成；其余按项目板逐项验收，不能把页数、提交或单元数计为项目完成。P8起新增项目另列，避免改变旧系列分母。
- **协作／内容净增量比：177.12%**。仅比较固定树 [`1a8a299`](https://github.com/dbvv1/a1dbv/commit/1a8a299820be023b7383e0599630c76b38ab81b7)→[`af7912b`](https://github.com/dbvv1/a1dbv/commit/af7912b47b3a53516573e5374f131ffb27d17193)，不是由作者时间还原的发布窗口：协作（docs/collaboration含归档＋AGENTS／CLAUDE）+1,230／−39行，净+188,126B；正文（README＋docs／domains扣除协作和research目录）+1,202／−1,171行，净−89,433B；研究+2,732／−1,186行，净+195,644B；内容合计净+106,211B，188,126÷106,211＝177.12%。其余脚本／测试／templates／配置等路径不计入，合计+122／−34行、净+5,106B。行数按不识别重命名的diff计，字节按blob计；未来周报固定首尾main回执，内容净增≤0时比值不适用，另列增删行／净字节，不能把压缩当负效率。

下表均为UTC+8，边界为可定位提交；Git／PR事件可复核（高），A自报只证明所述时刻／时段（非独立遥测），未覆盖部分和B无证据部分均为未知。待接收不等于会话结束，局部授权阻塞不等于整段停工。

| #／空档 | 小时／边界SHA | dot-A原因／证据 | dot-B原因／证据 | 对策 |
|---|---|---|---|---|
| 1：10-17 16:39–10-17 21:45 | 5.108／[1916f8c](https://github.com/dbvv1/a1dbv/commit/1916f8cf499e9c63c432298ec101362f278a10ed)→[b391c08](https://github.com/dbvv1/a1dbv/commit/b391c0842ae6ef185acd600c377b5f0314559e60) | A自报16:45收束至21:37无内容执行，过早结束选题，非权限或已核实平台故障；其余未知 | 共同署名不能分辨，未知 | 续接 |
| 2：10-18 00:57–10-18 02:45 | 1.811／[4877119](https://github.com/dbvv1/a1dbv/commit/4877119f3a16855b564bb36981fc66a114ad8768)→[152bd77](https://github.com/dbvv1/a1dbv/commit/152bd779bcd78a52d28a298306be94a511d445a4) | A于02:40–02:41自报两项负面调查后结束内容任务并等待，下一项选择不足；整段起止未知 | 未知 | 续接 |
| 3：10-18 11:08–10-18 14:11 | 3.053／[d051506](https://github.com/dbvv1/a1dbv/commit/d051506c22d7391096a448caefd361ac18aca3d2)→[330a739](https://github.com/dbvv1/a1dbv/commit/330a73901e84b01db8ae40c062506023c497e10a) | [PR31](https://github.com/dbvv1/a1dbv/pull/31)在11:10合入，14:10认领缓存研究；其余未知 | 未知 | 观测 |
| 4：10-18 14:24–10-18 16:27 | 2.049／[b20bb98](https://github.com/dbvv1/a1dbv/commit/b20bb98226384d46c409c377d02a2e32c5bee8af)→[44bf241](https://github.com/dbvv1/a1dbv/commit/44bf241d4e4997d7edba577f4f839205b0b1ea3c) | [PR32](https://github.com/dbvv1/a1dbv/pull/32)在14:25合入；其余未知，末端为另一个执行者的审计认领 | 未知 | 观测 |
| 5：10-18 16:52–10-18 18:04 | 1.209／[7003b33](https://github.com/dbvv1/a1dbv/commit/7003b338b5f39bea24b9175a11de33eac9c6c014)→[1ccfe2d](https://github.com/dbvv1/a1dbv/commit/1ccfe2d82a48cc9cf0c7973c9721588092407a7b) | [PR33](https://github.com/dbvv1/a1dbv/pull/33)在16:53合入，18:04认领整理；其余未知 | 未知 | 观测 |
| 6：10-18 18:14–10-18 19:30 | 1.272／[37609f8](https://github.com/dbvv1/a1dbv/commit/37609f8c2877e72d7322fd0320b59a51ceaa2807)→[4950aac](https://github.com/dbvv1/a1dbv/commit/4950aac9ac66ad02dd0308f6b627709eb721ecf6) | [PR34](https://github.com/dbvv1/a1dbv/pull/34)在18:15合入；其余未知，末端为另一个执行者的复盘认领 | 未知 | 观测 |
| 7：10-18 23:07–10-19 02:50 | 3.718／[fb247cb](https://github.com/dbvv1/a1dbv/commit/fb247cb60c74d50d7d1c81908e22fbcf97b93f14)→[88af666](https://github.com/dbvv1/a1dbv/commit/88af666ef356afb3e49227b6ce071fcd8564b27f) | [PR42](https://github.com/dbvv1/a1dbv/pull/42)在23:08合入；A自报01:46当时无后台内容任务，不能扩展为整段 | 未知 | 续接 |
| 8：10-19 03:13–10-19 11:24 | 8.177／[5de67b6](https://github.com/dbvv1/a1dbv/commit/5de67b601e346e82c8700ac0f90fdb31974a14b9)→[6b44e5e](https://github.com/dbvv1/a1dbv/commit/6b44e5e5d327b9cd384658a9cdfbbf30f07ec364) | A自报03:12–11:17续接不符合：局部等待未隔离，多次重复核查同一发布阻塞后等待；并非零工作；[PR44](https://github.com/dbvv1/a1dbv/pull/44)在11:21合入 | 03:14交[PR45](https://github.com/dbvv1/a1dbv/pull/45)待接收；其余未知 | 隔离／续接 |
| 9：10-19 12:00–10-19 13:03 | 1.046／[af5448c](https://github.com/dbvv1/a1dbv/commit/af5448c7af0fdc9bc5418c1abc3bcb77917eb190)→[a4a4e93](https://github.com/dbvv1/a1dbv/commit/a4a4e939235dcb61b2f24ce9f2763a8d25974a9d) | 已有[PR49](https://github.com/dbvv1/a1dbv/pull/49)待接收；本段执行状态未知 | 12:01交[PR50](https://github.com/dbvv1/a1dbv/pull/50)，13:03新认领；期间未知 | 观测 |
| 10：10-19 13:07–10-19 17:04 | 3.965／[3b7effc](https://github.com/dbvv1/a1dbv/commit/3b7effc10dbb12b6bdc14e83dc15b8a5f09fe7cf)→[dbed3d8](https://github.com/dbvv1/a1dbv/commit/dbed3d8a0ff85467d2a4f520be181b7c65f2e7fe) | A自报14:18–14:48无内容执行；其余有本地研究／整合，连续覆盖未知 | 13:07交[PR51](https://github.com/dbvv1/a1dbv/pull/51)，17:05新认领；期间未知 | 续接／隔离 |
| 11：10-19 17:10–10-19 20:08 | 2.968／[676e24c](https://github.com/dbvv1/a1dbv/commit/676e24cd720117588ab07d7a2589c5958529860b)→[2f3b62e](https://github.com/dbvv1/a1dbv/commit/2f3b62e361d3ec1cc67e69c252ad443501af9571) | A自报17:13前项完成、17:38当时未启动新内容；另有本地分支17:11–19:58多项研究交付（不等于主干发布），连续覆盖未知 | 17:11交[PR52](https://github.com/dbvv1/a1dbv/pull/52)，20:08新认领；期间未知 | 续接 |
| 12：10-19 20:13–10-20 01:09 | 4.932／[21e5767](https://github.com/dbvv1/a1dbv/commit/21e57677258706269fa77645d1f6869fbbc5e355)→[2b06a65](https://github.com/dbvv1/a1dbv/commit/2b06a650ee8a31caa0c26853171932f6e0a03142) | A自报20:15–21:00无内容执行，未穷尽独立项；A次日01:10自报此后主要反复核查／负面发现／等待，不能全归审批；连续覆盖未知 | 20:14交[PR53](https://github.com/dbvv1/a1dbv/pull/53)，次日01:09新认领；期间未知 | 续接／隔离 |
| 13：10-20 03:57–10-20 05:17 | 1.340／[0564a41](https://github.com/dbvv1/a1dbv/commit/0564a415e48e4610b0005829cf60cf6adc9e84ab)→[7a28924](https://github.com/dbvv1/a1dbv/commit/7a28924557c8dfc457d3769aab6b8fb0299d9417) | 公开分支04:08[重试诊断17571c81](https://github.com/dbvv1/a1dbv/commit/17571c8136f5597491bb16f2511c3c8d4a177349)、04:29[Loom825a1165](https://github.com/dbvv1/a1dbv/commit/825a11650308d68e9fc5176e5d112816a8073d58)已交付；TASKS记main更新被拒；发布受阻与继续工作并存，余段未知 | [PR58](https://github.com/dbvv1/a1dbv/pull/58)/59有结果待整合；本段执行未知 | 隔离 |
| 14：10-20 05:18–10-20 10:33 | 5.256／[6646d7a](https://github.com/dbvv1/a1dbv/commit/6646d7ac3cbf005963678dd9449fc1e4a0261ad8)→[af7912b](https://github.com/dbvv1/a1dbv/commit/af7912b47b3a53516573e5374f131ffb27d17193) | A自报05:46云存档、07:08调试、09:21停止／空间音频、10:04 akgentic已有本地成果；09:22–09:54及10:04–10:30无内容任务（等待／其他用户工作）；其余未知，非整段停工 | [PR58](https://github.com/dbvv1/a1dbv/pull/58)/59待整合；本段执行未知 | 隔离／续接 |

- **续接**：项目局部完成／负面调查后直接选同项目下一验收项，项目结束再选已授权项目；没有任务运行不能记“进行中”。只有确无可推进项才结束，并记原因／恢复条件。
- **隔离**：发布者保断点与单项队列，拒绝只停该动作；研究者继续不冲突的已授权工作。未有新授权、输入或状态变化，不重复轮询同一阻塞，也不用新分支掩盖待整合积压。
- **观测**：只记A／B运行状态变更、时间、项目、断点与下一步；汇总时附未知覆盖，不为提高代理比例补空提交。既有小时维护、两小时检查与周一晨间周报沿用原节奏，周报改报上述三项，不另建唤醒任务；改进效果须后续同口径观察，当前未证明。
