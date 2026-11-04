# B-CORE-MOTOR-PRESENTATION-SOURCES-20261104 · 固定步长移动与显示位置权威：来源与移植依据

> 采集与核实日期：2026-11-04。读取截止同日。范围：FPS-Like、Celeste64、JLPM22 三份固定实现，Unity／Godot／Unreal／Bevy／Box2D 的官方契约，公开讨论与中文社区。本单元只做命令行读取、源码阅读与公开页面核对，**未运行 Unity／Unreal／Godot，未创建 Unity 工程，未重跑 ground-v1，未采集任何新性能数字**。网页侧只有 FPS-Like 既有的 CPU／WebGL2 软件 smoke 证明，下文单独标注。

**给移植者的决定：默认把固定 tick 的 motor 当作模拟位姿的唯一写者，渲染层只持 previous／current 做只读插值；暂停、重生、传送、换回合先让插值历史失效，再用直接置位入口提交新位置。** Celeste64 给出另一条同样成立的路线：固定 60 Hz、完全不插值、每渲染帧只画最新状态；JLPM22 则是反例，控制器在 LateUpdate 用 `Time.deltaTime` 跑弹簧，动画骨骼另有一套位置，两者靠阻尼与最大距离夹紧共存。FPS-Like 与 Celeste64 由一个系统最终落位；JLPM22 的控制器虽写角色 Transform，但动画骨骼另有位置（`SetPosAdjustment` 改动画空间原点），两套位置共存，不能算作单一写者。具体写者不同，移植时照引擎契约选一条，不要混用。

**第一步怎么做。** 先按 S0 读 FPS-Like 的 `interpolation.ts`、`client.ts`、`game.ts`、`physics.ts` 与 `feel.md`，抄出三张表：时钟／追帧、位置写者、清历史守卫；再按目标引擎选落位入口（Unity：kinematic Rigidbody 且开插值时，传送前临时把 `Rigidbody.interpolation` 设为 `None`，用 `Rigidbody.position` 置位后再恢复，恢复时机按目标版本核；dynamic 刚体通常可直接置位，连续位移用 `MovePosition`；CharacterController 用 disable→set→enable 或 `Move`；Godot 先设 `position`／`global_position`，再 `reset_physics_interpolation`）；最后按下面五项断言各写一个最小输入。**什么时候不该照搬：** 状态可廉价复制、能接受低 TPS 精度时，Jakub 的“复制状态前推剩余时间再画”可以完全不要插值；项目不能接受额外一个 tick 呈现滞后时，不要用插值硬扛，先决定是 Celeste64 式“只画最新”还是带碰撞风险的外推；JLPM22 的 LateUpdate 弹簧不能原样搬进固定 tick，否则就是把渲染帧当模拟时钟。

## 渠道覆盖表

“得到”按本产物实际收录的已核链接与主题条目计；同一官方页的不同版本文档合在一个条目里，但每个链接都保留。读不到的项目只说明该渠道未取得正文，不据此推断“那里没有内容”。

| 渠道 | 实际看了什么、怎么取 | 得到（链接／条目） | 读不到及原因 |
|---|---|---|---|
| 固定来源与三份实现 | 按任务固定 SHA 读 GitHub raw：FPS-Like `bd476556` 的 `sim/{movement,physics,game}.ts`、`render/interpolation.ts`、`client.ts`、`AGENTS.md`、`docs/feel.md`；Celeste64 `6edfe1eb` 的 `Player.cs`；JLPM22 `35fc8ee9` 的 `SpringCharacterController.cs`、`MotionMatchingController.cs`，并顺读其基类 `MotionMatchingCharacterController.cs`；Foster `main` 的 `App.cs` | 26／26 | GitHub REST API 未认证限额耗尽（共享出口 IP 403），改用 `raw.githubusercontent.com`、网页 blob 与 `compare` 页；固定文件均直读成功（HTTP 200） |
| 引擎与网络框架官方文档 | Unity 6.0／6.3／6.6 手册与 ScriptReference（时间、执行顺序、Rigidbody、CharacterController、Animator、Input System、Netcode）；Godot 4 stable／3.6 的 physics interpolation 全节与类参考；Unreal 5.x 的 Root Motion、CMC 网络移动、Physics Sub-Stepping、Mover、Motion Matching、Networked Physics；Bevy 官方示例与 `Time<Fixed>`；Box2D、Jolt、Photon Quantum、Mirror、FishNet、Rukhanka、Animancer、Cinemachine | 159／109 | `dev.epicgames.com` 部分页面由 JS 渲染，目录壳不能当正文；CMC、Root Motion、Physics Sub-Stepping、Mover 已取得正文并在 S1 逐条列出，Network Prediction 等少数页仍只有目录壳；旧 `docs.unity3d.com` 大量 301 到 `docs.unity.com`，已按重定向取新址；部分 Photon 文档 URL 404，未找到正确路径 |
| 同类实现与开源代码 | GitHub 网页搜索（按 star、`pushed:>2026-08-01`）与 topic 页；逐一读 README／源码：Unity 角色控制器、Quake／Source 移动移植、Motion Matching、rollback netcode、固定步长库、网络插值与快照 demo、确定性物理 | 156／156 | GitHub REST API 限流，改用 HTML／raw／`codeload`；`gitlab.com/snopek-games/godot-rollback-netcode` 429；`bevy_ahoy` README 在 main／master 404，只确认仓库页；`Excellent` 类仓库的 issue 评论只能读 HTML 首屏 |
| 真实使用反馈 | Unity Discussions 单帖（`.json`／`.md` 端点与页面内 JSON）、Epic 开发者论坛、Opsive 论坛、GameDev.tv、A* Pathfinding 论坛、StackExchange API、Blizzard 论坛、HN Algolia API 的整棵评论树 | 72／72 | `discussions.unity.com` 对普通 crawler UA 返回 403，已改用浏览器 UA／`.md`／`?print` 与页面 JSON；`gamedev.stackexchange.com` 直连 403，改走 `api.stackexchange.com`；`news.ycombinator.com` 直连证书不匹配，只读 `hn.algolia.com/api/v1`；部分 GitHub issue 评论只读到首屏 |
| 设计原文、演讲与系列文章 | Gaffer On Games 全文、Gabriel Gambetta 系列、Robert Nystrom、Daniel Holden（theorangeduck）、Riot 确定性／VALORANT／2XKO、GDC Vault 场次页、SnapNet 系列、Infil、pkh、Jakub Tomsu、Marcos Pereira、John Austin、KinematicSoup、zubspace、Halo Infinite、Arma Reforger | 74／73 | GDC Vault 只有标题、讲者、年份与公开摘要，无 transcript／slides，未逐字转写；YouTube 全部 TLS 握手失败或被拦，只经 `noembed.com` 核过标题与作者，未看视频；Medium 域名被网络策略拦截；`gamedev.net` 403；`lspiroengine.com` 503；deWiTTERS 已 302 到 lander；Riot Part IV 两个 URL 均 404；Teardown 博文曾报 HTTP 466；Wayback／archive.org TLS 失败 |
| 中文社区 | 掘金 SSR 页与 API、B 站 opus 图文（移动 UA）、SegmentFault、个人博客（moyuta、jackylvm、那点事）、GameRes（curl 带 UA 读 UTF-8 正文）、indienova、腾讯游戏开发精粹、Unity 中文社区专题页、贴吧、微信公众号（经 Sogou 索引） | 35／35 | 知乎文章／回答与 `api/v4` 均 403；微信公众号返回“环境异常，完成验证后即可继续访问”；掘金搜索 API 返回空、正文页有 JS 挑战；B 站 `/video/` 412（`/opus/` 可读）；CSDN 反爬页无正文；贴吧“百度安全验证”；GameRes 站内搜索 JS 渲染，按相邻 ID 探测未找到目标文；腾讯游戏云社区连接被重置 |
| 头部列表、插件市场与相邻新东西 | GitHub topic／search、Trending（本周 global 与 C# 无游戏开发相关仓库）、awesome 列表（Calinou、RyanNielson、michidk、MFatihMAR、stevinz、ellisonleao）、Claude 插件市场、Unity Asset Store 抽查、2026-08 之后的新仓库与厂商公告 | 17／17 | Claude marketplace 的 Unity 页为 JS 渲染，只拿到摘要，未核版本与安装命令；Asset Store 只抽查 ECM2／KCC／Animancer 页面可访问，未按销量翻页；GitHub Trending 本期没有固定步长／角色运动相关仓库 |
| 读不到或只拿到标题的边缘项 | Valve Developer Community（Source Multiplayer Networking、Lag Compensation、Prediction、Interpolation、Tickrate）、Lobsters 搜索、Reddit、Oculus／Meta 博客、知乎／CSDN／Steam 若干原帖、GDC PDF、mauve.mizuumi.net、et1337、forrestthewoods、lspiro、gamedev.net | —（Valve Source Multiplayer Networking 仅保留链接、正文被 Anubis 挡住，已计入 S4 的 74／73；其余未进入候选） | 见文末“读不到与证据缺口”。共同原因：Anubis 反爬挑战、Cloudflare 403、域名连接 000、登录／会员墙、站点已 404 且存档不可达。原文未读的条目只保留链接，不把搜索摘要写成断言 |

### 读不到汇总（按原因归并）

- **反爬／人机校验**：`developer.valvesoftware.com` 的 Source Multiplayer Networking、Prediction、Lag Compensation、Interpolation、Tickrate 均被 Anubis proof-of-work 挡住（`action=raw`、`api.php`、`Special:Export`、Wayback 都失败）；`lobste.rs` 的 search／tag 返回 “Making sure you're not a bot!”；`gamedev.stackexchange.com` 与 `gamedev.net` 返回 403；`zhihu.com`、`zhuanlan.zhihu.com` 与 `api/v4` 返回 403；`mp.weixin.qq.com` 返回验证页；`juejin.cn` 正文有 JS 挑战；`csdn.net` 博客页只有反爬壳；`tieba.baidu.com` 返回安全验证。
- **域名／网络不可达**：`developer.oculus.com`、`developers.meta.com`、`medium.com`、`maddythorson.medium.com`、`www.reddit.com`、`old.reddit.com`、`www.v2ex.com`、`linux.do`、`r.jina.ai`、`web.archive.org`、`archive.org` 在不同时段返回 000／TLS 握手失败；YouTube watch 页同样不可读，标题与作者仅用 oEmbed 核对。
- **登录／会员／付费墙**：GDC Vault 的 Overwatch 2017、Rocket League 2018、Motion Matching 2016、TLOU2 2021 等只有公开摘要；`ubm-twvideo01.s3.amazonaws.com` 的 GDC PDF 返回 403。
- **页面已迁移或删除**：旧 `docs.unity3d.com` 301 到 `docs.unity.com`（已取新址）；`docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/...CharacterInterpolation.html` 404；`docs-multiplayer.unity3d.com` 的 NetworkTransform 手册 301／404；`doc.photonengine.com` 的 Fusion interpolation 页 404；`O3DE` 的 blog-motionmatching 404；`et1337.com` 的 Poor Man's Character Controller 原 URL 301 到 404；`forrestthewoods.com` 的 RTS desync 文只剩站点首页；`lspiroengine.com` 的 Fixed Time Stepping 503；`deWiTTERS` 已 302 到 lander；Riot 确定性 Part IV 两个 URL 均 404；`blog.voxagon.se` 的 Teardown Multiplayer 曾返回 466；Unity IssueTracker 924684 原链接 302 后 404、迁移域名 502；`cs2subtick.netlify.app` 301 到 Google Drive PDF 未读；`steamcommunity.com` 的 Unsung Warriors 帖 TLS 握手失败；`mauve.mizuumi.net` 的 Understanding Fighting Game Networking 空回复／TLS 失败。
- **只读标题或摘要**：`slippi.gg` 是 React SPA，站内只有回放／观战协议，没有 rollback 实现细节；`claude.com/marketplace/plugins/unity` 为 JS 渲染，只拿到摘要；Unity Asset Store 只抽查了 ECM2／KCC／Animancer 页面可访问，未按销量翻页；GDC Vault 各场次只有公开摘要（已在上面单列）。
- **搜索额度**：本会话 WebSearch 在开工前已 200／200 用尽，Google／DuckDuckGo／Bing／Mojeek／Startpage／Brave 在本环境被代理拦截或只返回缓存／词典结果；后续全部改用直接 URL、GitHub raw／HTML、HN Algolia、StackExchange API、RSS 与站内导航。因此“没有搜到”不等于“不存在”，只表示本轮没有可用的关键词搜索通道。

下面先拆三份固定来源的时序与位置写者，作为排序和筛选的标准；完整排序清单在“五项断言”之后。

## 三个实现的时序与位置写者清单

三份固定源码都按任务给的 SHA 读；行号链接指向该 SHA 的 blob。`physics.ts` 与 JLPM 的基类文件不在候选清单里，但属于任务点名的固定树／被点名类的直接依赖，本轮直读 HTTP 200，仅用于核时序。

### 1. FPS-Like `bd47655676d79061ff4be54cbedad111053c5af3`（网页，已有 CPU 证明）

**时钟与顺序。** 渲染帧用 `performance.now()` 推进一个 60 Hz 累加器：`tickMs = 1000 / 60`，每帧最多补 15 步；墙钟停滞超过 250 ms 直接暂停，不跳输入时间戳。每个固定步调用一次 `game.step(commands)`，`simStart += tickMs`。渲染只在该候选（`movement=ground-v1`）读取 `previousState` 与当前 `state`，用 `(now - simStart) / tickMs` 作 alpha 插值；相机 yaw／pitch、HUD、声音、射击与命中仍读当前权威状态。来源：[client.ts L71–L113](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/client.ts#L71-L113)、[L75–L87](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/client.ts#L75-L87)、[L104–L109](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/client.ts#L104-L109)。

**命令消费。** `Game.step` 先校验命令，再按 `at`（sub-tick，0–999）稳定排序；每条命令前 `advance(start + at)`，执行命令后 `settle()`，最后 `advance(start + SUBTICKS)` 并 `tick++`。同一条输入只在该 sub-tick 消费一次。来源：[game.ts L84–L101](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/game.ts#L84-L101)。

**位移写者。** `advance` 对每个 actor 调 `groundMovement(velocity, input, elapsed)` 得到 `{ velocity, translation }`，然后把 `translation` 交给 `Physics.move`；`Physics.move` 内 `sync(actor)` → `world.step()` → `computeColliderMovement` → `apply`，其中 `apply` 是 `actor.position` 的唯一写点。移动后 `game.advance` 用实际位移除以 elapsed 回写 `actor.velocity`，避免在墙内积累隐藏速度。来源：[game.ts L168–L199](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/game.ts#L168-L199)、[L185–L190](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/game.ts#L185-L190)、[physics.ts L47–L73](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/physics.ts#L47-L73)、[L55–L58](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/physics.ts#L55-L58)。

**呈现写者。** `interpolateState(previous, current, alpha)` 的注释写明 “Presentation only … Never write into authoritative snapshots”；它是纯函数，返回新的 `GameState` 副本。守卫：`previous` 为空、`round`／`phase` 不同、`tick + 1 !== current.tick` 时直接返回 current；`alpha` 夹到 `[0,1]`；任一 actor 已死或水平位移超过 1 世界单位时返回 current；朝向用最短角差。来源：[interpolation.ts L2–L15](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/render/interpolation.ts#L2-L15)。

**暂停／重开／换回合。** `previousState` 在恢复指针锁（L143）、`next()`（L57）、`restart()`（L66）、smoke resume（L47）时清空；`nextRound()` 重建 actors、bomb 与 Physics，并清 shots／sounds／interaction；正常游玩超过 250 ms 长帧直接 `controls.pause()` 并停止 running（L78）。来源：[client.ts L44–L70](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/client.ts#L44-L70)、[L71–L103](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/client.ts#L71-L103)、[game.ts L72–L82](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/game.ts#L72-L82)。

**既有证明与边界。** `docs/feel.md` 记录：训练赛固定 60 Hz；渲染只在候选里用 previous／current 位置与对手 yaw 按剩余 tick 比例插值；重开／换回合／暂停恢复清历史；死亡／跨回合／大位移不跨状态混合；插值增加最多 1 个模拟 tick 的呈现滞后。CPU 测试只证明采样连续和模拟不受 render 频率影响，真实 144 Hz 屏幕与音画同步仍待测。来源：[feel.md L67](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/docs/feel.md#L67)、[AGENTS.md L27–L28](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/AGENTS.md#L27-L28)。

| 阶段 | 时钟／触发 | 写者 | 固定源码行 |
|---|---|---|---|
| 输入采样 | 每渲染帧 | `Controls` 写 `controls.commands`、yaw／pitch；不写模拟位姿 | client L87、L106–L107 |
| 模拟 tick | 60 Hz 累加器；单帧最多 15 步；>250 ms 暂停 | `game.step` 唯一推进 tick | client L75–L87；game L84–L101 |
| 命令消费 | 每 tick 内按 sub-tick 排序 | `game.step` → `command` → `settle` | game L84–L101 |
| 位移积分 | 每个 sub-tick | `groundMovement` 出 `translation`；`Physics.move` 唯一写 `actor.position` | game L168–L199；physics L47–L73 |
| 速度回写 | 每步移动后 | `game.advance` 用实际位移回写 velocity | game L185–L190 |
| 呈现位置 | 每渲染帧 | `interpolateState` 返回副本，不写权威 | interpolation L2–L15；client L106 |
| 相机／HUD／声音／射击 | 每渲染帧 | 读当前权威 state 或 Controls | client L107–L109；feel L67 |
| 暂停／重开／换回合 | 事件时 | `previousState = null`；`nextRound` 重建 actors／physics | client L47、L57、L66、L143；game L72–L82 |

### 2. Celeste64 `6edfe1ebd2a21a6134d7675a28e357891025407e`（固定 60 Hz 的已发行游戏，无插值）

**框架时钟。** Celeste64 用 Foster；Foster 的 `App` 默认 `UpdateMode.FixedStep(60)`，每帧把墙钟增量累加到 `fixedAccumulator`，超过 `FixedMaxTime` 时截断，然后 `while (fixedAccumulator >= FixedTargetTime)` 逐步 `Step`，最后 `Render()` 画最新状态。**没有 previous／current，也没有插值 alpha**。来源：[Foster App.cs L248](https://github.com/FosterFramework/Foster/blob/main/Framework/App.cs#L248)、[L474–L518](https://github.com/FosterFramework/Foster/blob/main/Framework/App.cs#L474-L518)、[L523–L526](https://github.com/FosterFramework/Foster/blob/main/Framework/App.cs#L523-L526)（`main` 分支，未固定 SHA）。

**Update 顺序。** `Player.Update()`：先按 `Controls.Camera` 改相机朝向／距离（L269–L286）；死亡／重生／过场状态只推进状态机并提前返回（L296–L300）；死亡平面与尖刺检测 `Kill()`（L303–L311）；跑 coyote／hold jump／dash 冷却计时（L318–L337）；`previousVelocity = velocity` 后 `stateMachine.Update(Time.Delta)`（L339–L341）；处理 NPC pushout（L344–L365）；最后 `SweepTestMove(velocity * Time.Delta)` 一次性提交位移（L367–L371）。来源：[Player.cs L263–L342](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L263-L342)、[L339–L341](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L339-L341)、[L344–L371](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L344-L371)。

**LateUpdate 顺序。** 先做地面检测与 pushout、地面吸附（L395–L406）；再平滑 `cameraOriginPos` 的 Z（L443–L461，公式 L459–L460）；相机位置用 `1 - pow(0.01, Time.Delta)` 逼近目标、LookAt 直接设（L463–L483，公式 L477）；最后更新模型缩放／朝向（L485–L510）。来源：[Player.cs L391–L510](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L391-L510)。

**重生。** `Added()` 在 `World.Entry.Reason == Respawned` 时恢复存下的相机朝向／距离并把状态设为 `Respawn`；随后 `cameraOriginPos = Position`，`GetCameraTarget` 后**直接**赋 `World.Camera.LookAt`／`Position`，不走 LateUpdate 的平滑。`StRespawnEnter` 只改可见性与播放 revive 音效，`StRespawnUpdate` 只等 orbs 淡出；位置由世界重载决定，没有插值历史可清。`Kill()` 把状态设为 Dead 并保存相机朝向／距离。来源：[Player.cs L236–L262](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L236-L262)、[L1881–L1895](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1881-L1895)、[L836–L843](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L836-L843)。

| 阶段 | 时钟／触发 | 写者 | 固定源码行 |
|---|---|---|---|
| 输入 | 每个固定步（Foster Step） | `Controls` 直接读；状态机消费 | Player L269–L286、L341 |
| 速度／状态 | Update 内 | `stateMachine.Update` 与各状态函数写 `velocity` | Player L339–L341、L968 起 |
| 位移 | Update 末 | `Player.SweepTestMove(velocity * Time.Delta)` 单入口 | Player L367–L371 |
| 碰撞／贴地修正 | LateUpdate | `Position += pushout`、地面吸附 `Position = hit.Point` | Player L395–L406 |
| 相机 | LateUpdate；重生时 Added | LateUpdate 平滑；Added 直接置位 | Player L443–L483、L257–L260 |
| 呈现 | 每渲染帧 | Foster 直接画最新状态，无插值 | Foster L523–L526 |
| 重生 | Added／状态机 | 世界重载 + 状态 `Respawn`；只改视觉与相机 | Player L238–L242、L1881–L1895 |

**边界。** 这是已发行游戏的源码阅读，不是引擎实跑；Foster 取 `main`，未固定 SHA；Celeste64 取固定 SHA。它证明了“固定 60 Hz + 不插值”可以成立，但不证明高刷屏上比插值更平滑，也不提供任何新帧率数据。

### 3. JLPM22 MotionMatching `35fc8ee9a0fd97f12de458ea81eaef7c8219d87a`（Unity，渲染帧弹簧 + 两套位置）

**调度。** 基类 `MotionMatchingCharacterController` 在 `LateUpdate()` 里把 `DatabaseDeltaTime = MotionMatching.DatabaseFrameTime`，调用子类 `OnUpdate()`，再以 `Time.deltaTime` 触发 `OnUpdated`。所以控制器与动画都在**渲染帧**更新，不是 FixedUpdate。来源：[MotionMatchingCharacterController.cs L24–L31](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/CharacterController/MotionMatchingCharacterController.cs#L24-L31)。

**控制器位移。** `SpringCharacterController.OnUpdate()` 先用 `DatabaseDeltaTime` 预测轨迹，再用 `ComputeNewPos(..., Time.deltaTime)` 跑弹簧得到 `newPos`；仅当速度超过 `MinimumVelocityClamp` 时把 `newPos` 写进 `transform.position` 与 `newRot` 写进 `transform.rotation`；随后 `AdjustMotionMatching()` 与 `ClampMotionMatching()`。来源：[SpringCharacterController.cs L120–L147](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/CharacterController/SpringCharacterController.cs#L120-L147)、[L194–L199](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/CharacterController/SpringCharacterController.cs#L194-L199)。

**两套位置的耦合。** `ClampMotionMatching()` 计算控制器与 MotionMatching 骨骼的距离，超过 `MaxDistanceMMAndCharacterController` 就把骨骼夹到最大距离；`AdjustCharacterPosition()` 把差值用半衰期阻尼成 adjustment，再按 `PosMaximumAdjustmentRatio × |MotionMatching.Velocity| × dt` 限幅，最后 `MotionMatching.SetPosAdjustment(adjustment)`。`SetPosAdjustment` 改的是动画空间原点，不是 Transform。来源：[SpringCharacterController.cs L207–L235](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/CharacterController/SpringCharacterController.cs#L207-L235)、[MotionMatchingController.cs L518–L525](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/Core/MotionMatchingController.cs#L518-L525)。

**帧率与动画。** `MotionMatchingController` 的 `LockFPS` 默认把 `Application.targetFrameRate` 锁到动画数据库帧率，并在关闭时警告：应用帧率高于数据库会 malfunction。控制器更新后，`OnCharacterControllerUpdated` 用 `CurrentFrameTime += DatabaseFrameRate * deltaTime` 推进数据库帧，再 `UpdateTransformAndSkeleton`。来源：[MotionMatchingController.cs L103–L112](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/Core/MotionMatchingController.cs#L103-L112)、[L183–L223](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/Core/MotionMatchingController.cs#L183-L223)。

| 阶段 | 时钟／触发 | 写者 | 固定源码行 |
|---|---|---|---|
| 输入 | 外部调用 | `SetMovementDirection` 只改 `InputMovement`／`DesiredRotation`，输入突变触发重搜 | Spring L98–L113 |
| 控制器位姿 | LateUpdate | `SpringCharacterController` 写 `transform.position`／`rotation`；弹簧用 `Time.deltaTime` | Spring L120–L147、L194–L199 |
| 动画骨骼 | 同一 LateUpdate，`OnUpdated` 后 | `MotionMatchingController` 按数据库帧率推进并写骨骼 | Core L183–L223 |
| 两套位置耦合 | 控制器更新后 | 阻尼 adjustment + `MaxDistance` clamp + `SetPosAdjustment` | Spring L207–L235 |
| 传送 | 调用 `SetPosAdjustment` | 改动画空间原点，不直接改 Transform | Core L518–L525 |

**边界。** 这是 Unity 代码阅读，未在编辑器运行。它刻意让控制器与动画骨骼两套位置共存，并用软校正限幅；移植到固定 step 时，`LateUpdate` 与 `Time.deltaTime` 两处必须改，否则就是把渲染帧当模拟时钟。它也不是物理刚体方案，不回答 Rigidbody 插值问题。

## 五项保持原规则的移植断言

每条都对应任务固定的一个问题；“保持的原规则”是 a1dbv 现有页已经写下的决定，移植时只换时间源与写者，不重新定义玩法规则。网页层能验的只有输入采样、tick 序列与只读插值副本；引擎落位、Rigidbody 插值与 reset 行为仍需目标引擎小工程。

1. **输入采样／消费频率。** 断言：同一 `seed` 加同一串带 sub-tick 时间戳的命令，在 30／60／120 Hz 渲染下得到相同 tick 状态序列；渲染帧只增加采样次数，不改变每个 tick 消费的命令集合。做法是输入按帧采样进带 `at` 的命令缓冲，`game.step` 按 `at` 排序后每条只消费一次；不要把渲染帧 delta 当固定步速度，也不要让按住移动在多个 tick 里重复叠加。保持的原规则：FPS-Like `AGENTS.md` 的“固定步长、同种子同命令序列同结果、sim 不读系统时间／DOM”，以及 04-animation-runtime 的“动画增量不能直接当固定步速度”。依据：[FPS-Like game.ts L84–L101](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/game.ts#L84-L101)、[client.ts L84–L87](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/client.ts#L84-L87)、[AGENTS.md L27–L28](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/AGENTS.md#L27-L28)、[Unity Input System Update Mode](https://docs.unity3d.com/Packages/com.unity.inputsystem@6.7/manual/update-mode.html)、[Blizzard 1000 Hz 鼠标输入](https://us.forums.blizzard.com/en/overwatch/t/new-feature-high-precision-mouse-input-gameplay-option/422094)、[JLPM SetMovementDirection](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/CharacterController/SpringCharacterController.cs#L98-L113)。

2. **Root Motion 位移所有权。** 断言：每个动作只有一个位移提交者。启用 `OnAnimatorMove` 时 Animator 不再应用 root motion（`applyRootMotion` 显示为 Handled by Script）；脚本只把 `deltaPosition`／`deltaRotation` 作为提案交给唯一 motor，碰撞后再落位。普通行走由代码 motor；翻滚、攀爬等需要精确接触的动作才逐动作把位移权交给根运动，切换的是动作政策，不是多个组件同时写 Transform。保持的原规则：04-animation-runtime “动画可以提议位移，但只留一个裁决者”。依据：[Unity OnAnimatorMove 6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/monobehaviour/onanimatormove)、[Unity Scripting Root Motion 6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/animation-section/animation-mecanim/avatar-creationand-setup/scripting-root-motion)、[Unity applyRootMotion](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/animator/applyrootmotion)、[Celeste64 Player.cs L367–L371](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L367-L371)、[JLPM Spring L207–L235](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/CharacterController/SpringCharacterController.cs#L207-L235)。

3. **呈现对象与物理对象分离。** 断言：渲染层拿到的位姿是只读副本；相机、HUD、声音、射击与命中判定读当前权威状态；任何 Update／LateUpdate／render 回调都不得写回权威状态或物理 Transform。物理刚体开启插值后由物理系统接管 Transform，直接改 Transform 是第二个写者，必须走 `Rigidbody.position`／`MovePosition` 或 `Physics.SyncTransforms` 的明确入口。保持的原规则：`domains/game-dev/04-client-modules.md` 的“3D 角色运动：先选想要的控制，再选碰撞求解方式”下“候选实证”节（第 458 行）“仅给 View 插值副本；射击、交互、声音和 HUD 读当前权威模拟状态”（不是 `04-animation-runtime`）。依据：[FPS-Like interpolation.ts L2–L15](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/render/interpolation.ts#L2-L15)、[client.ts L104–L109](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/client.ts#L104-L109)、[feel.md L67](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/docs/feel.md#L67)、[Unity Rigidbody.interpolation](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/rigidbody/interpolation)、[Unity Physics.SyncTransforms](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/physics/synctransforms)、[Godot 2D/3D 插值自动范围](https://docs.godotengine.org/en/stable/tutorials/physics/interpolation/2d_and_3d_physics_interpolation.html)、[Lightyear Avian](https://cbournhonesque.github.io/lightyear/book/concepts/advanced_replication/avian.html)。

4. **暂停／重生／传送清历史。** 断言：暂停恢复、重开、换回合、重生、传送、tick 不相邻、位移超过阈值时，`previous`／`current` 或引擎插值历史必须失效；传送用直接置位入口，置位后必须确认插值历史已失效：Unity 的 kinematic Rigidbody 开插值时，先临时把 `Rigidbody.interpolation` 设为 `None`，用 `Rigidbody.position` 置位后再恢复（恢复时机按目标 Unity 版本核，参见第 475 行的帖子；dynamic 刚体通常可直接置位）；CharacterController 用 disable→set→enable；Godot 先设 `position`／`global_position`，再 `reset_physics_interpolation`。不让插值跨过不连续段。保持的原规则：FPS-Like “重开／换回合／暂停恢复清历史；死亡／跨回合／大位移不跨状态混合”。依据：[feel.md L67](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/docs/feel.md#L67)、[interpolation.ts L5–L7](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/render/interpolation.ts#L5-L7)、[Godot reset_physics_interpolation](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-method-reset-physics-interpolation)、[Godot #110979 1 帧拖影](https://github.com/godotengine/godot/issues/110979)、[Godot #96663 重挂父节点 ghosting](https://github.com/godotengine/godot/issues/96663)、[Unity Netcode #3204 复活先在死亡点显示一帧](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/issues/3204)、[Unity Netcode #2765 Teleport 回弹](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/issues/2765)、[Lightyear SkipFrameInterpolation](https://github.com/cbournhonesque/lightyear/blob/ee50df6664338ff1eb4b3885c8525fa3c9030691/book/src/concepts/advanced_replication/visual_interpolation.md)。

5. **同输入 30／60／120 Hz 呈现不变量。** 断言：固定模拟步长下，30／60／120 Hz 渲染产生相同 tick 序列、相同状态哈希、相同碰撞结果与位移总量；渲染只改变插值 alpha 与采样次数。验收用固定 seed 与命令带跑三种渲染节拍，比较 tick 数／哈希／末位置，不看画面平滑与否。保持的原规则：网页既有 CPU 证明只证明采样连续与模拟不受 render 频率影响，不证明 144 Hz 屏幕或音画同步；不填新性能数。依据：[feel.md L45／L67](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/docs/feel.md#L67)、[Unity Fixed updates](https://docs.unity.com/en-us/engine/6000.0/manual/scripting/managing-time-and-frame-rate/fixed-updates)、[Godot physics ticks 设置](https://docs.godotengine.org/en/stable/classes/class_projectsettings.html#class-projectsettings-property-physics-common-physics-ticks-per-second)、[ECM2 30/60/120 复现帖](https://discussions.unity.com/t/released-easy-character-movement-2/839721/1475)、[Character Controller Pro 30 fps 帖](https://discussions.unity.com/t/character-controller-pro/772610/243)、[Jolt 变步长角色弹飞](https://github.com/jrouwe/JoltPhysics/discussions/2129)、[Gaffer Fix Your Timestep](https://gafferongames.com/post/fix_your_timestep/)。

## 排序后的来源清单

排序标准：先固定来源与能直接回答五个问题的源码／官方契约，再同类实现，再真实失败反馈，再设计原文与演讲，最后中文社区、头部列表与相邻新东西。每条保留原始链接与一句“为什么值得读”；同一页的多版本合并为一个条目，但每个链接都保留。**没有新增本清单外的链接**；`physics.ts`、JLPM 基类与 Foster `App.cs` 属于任务点名固定树／被点名类的直接依赖或清单内已有条目，已直读核对。

### S0 固定来源与三份实现（先读这一组）

- **FPS-Like `AGENTS.md`（固定 SHA）** — 仓库自己的契约：`src/sim/` 固定步长，随机只用种子，不读系统时间，不引用 DOM／Three.js／网络；外部只通过输入命令影响对局；`render/`／`ui/`／`input/` 只读模拟、只发命令。[链接](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/AGENTS.md)
- **FPS-Like `docs/feel.md` L67（固定 SHA）** — 同输入规格与实测记录：60 Hz 模拟、previous／current 插值、暂停／重开清历史、死亡／跨回合／大位移不混合、最多 1 tick 呈现滞后、CPU 只证明采样连续且模拟不受 render 频率影响。[链接](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/docs/feel.md#L67)
- **FPS-Like `render/interpolation.ts`（固定 SHA）** — 只读呈现副本的插值函数：round／phase／tick 不相邻、死亡、位移 > 1 单位时回当前状态；重生／传送不拖影的具体守卫。[链接](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/render/interpolation.ts)
- **FPS-Like `client.ts`（固定 SHA）** — 60 Hz 累加循环、`alpha=(now-simStart)/tick`、卡顿 > 250 ms 暂停、重开／暂停清 `previousState`；输入采样与呈现解耦的完整小实现。[链接](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/client.ts)
- **FPS-Like `sim/game.ts`（固定 SHA）** — `Game.step` 是唯一推进 tick 的入口，命令按 sub-tick 排序消费，`nextRound` 重置 actor 与 physics。[链接](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/game.ts)
- **FPS-Like `sim/movement.ts`（固定 SHA）** — 纯函数 motor：输入 + 速度 + dt → 速度与位移，不碰渲染／系统时间；引擎移植时可直接对照其边界。[链接](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/movement.ts)
- **FPS-Like `sim/physics.ts`（固定 SHA，任务点名的固定树文件）** — `Physics.move` 是 `actor.position` 的唯一写点；先 sync，再 world.step，再 computeColliderMovement，最后 apply。[链接](https://github.com/dbvv1/FPS-Like/blob/bd47655676d79061ff4be54cbedad111053c5af3/src/candidates/offline-training-v1/sim/physics.ts)
- **FPS-Like `bd4765...main` 漂移核对** — main 已有 2026-11-02／03 的提交（指针锁生命周期、环境资源批次、截图）；固定 SHA 之后的差异需在移植前核。[链接](https://github.com/dbvv1/FPS-Like/compare/bd47655676d79061ff4be54cbedad111053c5af3...main)
- **FPS-Like 提交 `b86964c`** — 固定 SHA 之后的上游提交：保留 60 Hz 模拟并给慢帧 15 步追赶预算，是“慢帧不能无限补步”的现成策略。[链接](https://github.com/dbvv1/FPS-Like/commit/b86964c)
- **FPS-Like 提交 `667f1b1`** — 暂停／恢复后不补旧帧、把时钟初始化到下一个 rAF 时间戳，直接对应“暂停恢复不插回旧位置”。[链接](https://github.com/dbvv1/FPS-Like/commit/667f1b1)
- **FPS-Like 提交 `297bc04`** — 把指针锁的拆卸收归本地生命周期管理，属于暂停／恢复时输入与呈现状态由谁清理的边界案例。[链接](https://github.com/dbvv1/FPS-Like/commit/297bc04)
- **ExOK/Celeste64 仓库** — 原作者团队公开源码与 README（自述两周内完成、非优化），可核对真实项目对固定步长／呈现的取舍。[链接](https://github.com/ExOK/Celeste64)
- **Celeste64 `Player.cs`（固定 SHA）** — 单一大类同时管输入、速度、碰撞、动画、相机与 Respawn 状态；重生时相机直接置位，正常时 LateUpdate 平滑。[链接](https://github.com/ExOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs)
- **Foster `App.cs`（Celeste64 的固定步长循环，main）** — 默认 `FixedStep(60)`；固定步内 Update，每渲染帧只画最新状态且不提供插值 alpha，是“固定步长但高刷重复帧”的对照。[链接](https://github.com/FosterFramework/Foster/blob/main/Framework/App.cs)
- **Celeste64 #103** — SDL3 迁移后 dash／skid jump 取消窗口不一致，根因是丢输入缓冲；说明输入采样／消费频率变化会直接改玩法时序。[链接](https://github.com/EXOK/Celeste64/issues/103)
- **Celeste64 提交 `5f39b4f`** — 对应 #103 的实际改动只有 `Controls.cs` 两行：给 Jump／Dash 加 0.1 s 输入缓冲，证明问题在输入层解决而非改物理步长。[链接](https://github.com/EXOK/Celeste64/commit/5f39b4fcffd4039d451040baac73e989a07e2c67)
- **JLPM22 `SpringCharacterController.cs`（固定 SHA）** — 控制器在 LateUpdate 用 `Time.deltaTime` 跑弹簧并写 Transform；Motion Matching 只做有限距离拉回／夹紧，是“动画呈现 vs 控制器位移”双系统的真实实现。[链接](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/CharacterController/SpringCharacterController.cs)
- **JLPM22 `MotionMatchingController.cs`（固定 SHA）** — `LockFPS` 把 `Application.targetFrameRate` 锁到动画数据库帧率，并警告帧率高于数据库会失效；是“呈现频率跟随 tick”的极端方案。[链接](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/Core/MotionMatchingController.cs)
- **JLPM22 基类 `MotionMatchingCharacterController.cs`（固定 SHA，被点名类的直接依赖）** — `LateUpdate` 里先 `OnUpdate`，再以 `Time.deltaTime` 触发 `OnUpdated`；这是上面两份源码的实际调度点。[链接](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/CharacterController/MotionMatchingCharacterController.cs)
- **JLPM22 文档（作者站）** — 作者文档说明 Character Controller 生成轨迹并限制模拟／动画位置最大距离，补充代码里的设计意图。[链接](https://joseluisponton.com/motionmatching-docs/)
- **JLPM22 仓库首页** — README 明确控制器“限制模拟角色与动画角色最大距离”，是源码之外的作者口径。[链接](https://github.com/JLPM22/MotionMatching)
- **JLPM22 #9** — 用户用物理胶囊 + 隐形动画骨架分离呈现，MotionMatching 在 LateUpdate 写骨骼覆盖 Unity IK；维护者承认 LateUpdate 不理想但只能共享骨架。[链接](https://github.com/JLPM22/MotionMatching/issues/9)
- **JLPM22 #7** — 轨迹预测点进入碰撞体、下坡弹回；维护者建议射线裁剪轨迹并给 `CollisionsSpringCharacterController` 示例，说明该控制器只在理想地形可用。[链接](https://github.com/JLPM22/MotionMatching/issues/7)
- **JLPM22 文档镜像（GitHub Pages）** — 同作者文档的另一入口，含 Character Controller 与 Unity Animator Integration 两节，便于按固定页追链接。[链接](https://jlpm22.github.io/motionmatching-docs/)
- **JLPM22 文档：Unity Animator Integration** — 官方文档给出用 Avatar Mask 在 Animator 与 Motion Matching 间分配骨骼，替代 LateUpdate 覆盖骨骼的做法。[链接](https://jlpm22.github.io/motionmatching-docs/advanced/unity_animator/)
- **JLPM22 文档：Character Controller** — 说明角色控制器负责轨迹与位置约束、MM 只产动画，是把 motor 与动画分离的官方结构。[链接](https://jlpm22.github.io/motionmatching-docs/basics/character_controller/)

### S1 引擎与网络框架官方文档（移植契约）

**Unity：时间、固定步与追帧**

- **Fixed updates（6000.0／6000.6）** — 官方定义固定步长、每帧 0／1／多次执行和追赶上限；是“呈现帧率 ≠ 模拟频率”的第一手依据。[6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/scripting/managing-time-and-frame-rate/fixed-updates)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/manual/scripting/managing-time-and-frame-rate/fixed-updates)
- **Time handling variations（6000.0／6000.6）** — `maximumDeltaTime` 如何限制单帧追赶、卡顿后物理“当作没过去”、`timeScale=0` 时 FixedUpdate 停止。[6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/scripting/managing-time-and-frame-rate/time-handling-variations)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/manual/scripting/managing-time-and-frame-rate/time-handling-variations)
- **Per-frame updates（6000.0）** — 官方对照按帧位移会随帧率改变速度，给出“呈现层不能承担位移”的最小论据。[链接](https://docs.unity.com/en-us/engine/6000.0/manual/scripting/managing-time-and-frame-rate/time-per-frame-updates)
- **Time scale（6000.0／6000.6）** — `timeScale=0` 停住 FixedUpdate 与物理但 Update 仍运行，是暂停语义和暂停后清历史的基线。[6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/scripting/managing-time-and-frame-rate/time-scale)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/manual/scripting/managing-time-and-frame-rate/time-scale)
- **Manage time and frame rate（旧手册）** — 两个 Unity 论坛帖都引它说明 FixedUpdate 调度；官方描述固定步与渲染帧的关系。[链接](https://docs.unity3d.com/Manual/managing-time-and-frame-rate.html)
- **Time and frame rate management（旧手册另一路径）** — 同一主题的旧入口，含 `fixedDeltaTime`、`maximumDeltaTime`、`targetFrameRate` 的语义。[链接](https://docs.unity3d.com/Manual/TimeFrameManagement.html)
- **Time Manager（6000.0／6000.3）** — 定义 Fixed Timestep 与 Maximum Allowed Timestep，决定低帧率时模拟是追帧还是拖慢。[6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/unity-editor/editor-settings-reference/comp-manager-group/class-time-manager)／[6000.3](https://docs.unity.com/en-us/engine/6000.3/manual/unity-editor/editor-settings-reference/comp-manager-group/class-time-manager)
- **Simulate hitches for testing（6000.0）** — 官方注入卡顿来验证固定步长追赶与呈现的测试方法，直接服务 30／60／120 Hz 不变量验证。[链接](https://docs.unity.com/en-us/engine/6000.0/manual/scripting/managing-time-and-frame-rate/time-simulate-hitches)
- **Time.fixedDeltaTime（6000.0／6000.6）** — 物理与 FixedUpdate 的步长定义；motor 移植后应以它为唯一时间基，而不是渲染帧 delta。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/time/fixeddeltatime)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/script-reference/unityengine/time/fixeddeltatime)
- **Time.maximumDeltaTime（6000.0／6000.3／6000.6／旧 ScriptReference）** — 单帧最多推进多少模拟时间，直接对应长帧后“不要一次补太多步”的 spiral of death 防护。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/time/maximumdeltatime)／[6000.3 手册](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-maximumDeltaTime.html)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/script-reference/unityengine/time/maximumdeltatime)／[旧](https://docs.unity3d.com/ScriptReference/Time-maximumDeltaTime.html)
- **Time.timeScale（6000.6）** — 暂停／慢动作的官方语义；`timeScale=0` 时 Update 仍执行。[链接](https://docs.unity.com/en-us/engine/6000.6/script-reference/unityengine/time/timescale)
- **Application.targetFrameRate** — 把渲染帧率锁到固定步长的官方开关，KCC 维护者曾用它缓解抖动。[链接](https://docs.unity3d.com/ScriptReference/Application-targetFrameRate.html)
- **Physics.Simulate（6000.3 手册／6000.3 API／旧 API）** — 手动以固定步推进物理且 FixedUpdate 仍按 `fixedDeltaTime` 运行；附 accumulator 写法与 0.03 步长上限。[6000.3](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/physics/simulate)／[旧](https://docs.unity3d.com/ScriptReference/Physics.Simulate.html)／[6000.3 另一路径](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.Simulate.html)
- **Physics.simulationMode（6000.0／current／6000.3／旧）** — 可把物理步进改为 Script 手动驱动，便于暂停、逐帧调试和固定步长校验。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/physics/simulationmode)／[current](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/physics/simulationmode)／[6000.3](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/physics/simulationmode)／[6000.3 旧路径](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics-simulationMode.html)／[旧](https://docs.unity3d.com/ScriptReference/Physics-simulationMode.html)
- **SimulationMode.FixedUpdate（6000.0）** — 官方称 FixedUpdate 模拟最稳定但两物理步之间可能渲染多帧，并要求用 Rigidbody interpolation 补呈现。[链接](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/simulationmode/fixedupdate)
- **Physics.SyncTransforms（6000.0／6000.6／6000.3／旧）** — 直接改 Transform 后手动同步给物理引擎的官方入口；传送／重生时必须考虑，否则插值或物理仍用旧位姿。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/physics/synctransforms)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/script-reference/unityengine/physics/synctransforms)／[6000.3](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/physics/synctransforms)／[旧](https://docs.unity3d.com/ScriptReference/Physics.SyncTransforms.html)
- **Physics.autoSyncTransforms（6000.0）** — 规定 Transform 写入何时进入物理世界（立即或 FixedUpdate 前），暴露“呈现层顺手改 Transform”变成第二个位移写者的风险。[链接](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/physics/autosynctransforms)

**Unity：执行顺序与 Transform／Rigidbody**

- **Event function execution order（6000.0／current／2022.3／旧）** — 官方顺序图明确物理步发生在 FixedUpdate 之后、OnAnimatorMove 位于动画循环；决定 motor、动画和呈现谁先读谁。[6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/scripting/managing-update-order/execution-order)／[current](https://docs.unity.com/en-us/engine/current/manual/scripting/managing-update-order/execution-order)／[2022.3](https://docs.unity3d.com/2022.3/Documentation/Manual/ExecutionOrder.html)／[旧](https://docs.unity3d.com/Manual/ExecutionOrder.html)
- **MonoBehaviour.FixedUpdate（current）** — 官方定义 FixedUpdate 以固定间隔调用且物理在其后推进，是输入采样／消费频率与谁推进位移的基线契约。[链接](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/monobehaviour/fixedupdate)
- **Rigidbody.interpolation（6000.0／6000.3 手册／旧 API）** — 官方说开启后物理系统接管刚体 Transform，直接改 Transform 需 SyncTransforms；Interpolate 用前两次物理姿态并延迟一个物理步，Extrapolate 可能越过碰撞边界。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/rigidbody/interpolation)／[6000.3](https://docs.unity3d.com/6000.3/Documentation/Manual/rigidbody-interpolation.html)／[旧](https://docs.unity3d.com/ScriptReference/Rigidbody-interpolation.html)
- **Rigidbody.position（6000.0／current／旧）** — 通过物理引擎瞬移、Transform 在下一物理步后才更新，并与考虑插值的 MovePosition 明确区分，适合重生／传送提交。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/rigidbody/position)／[current](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/rigidbody/position)／[旧](https://docs.unity3d.com/ScriptReference/Rigidbody-position.html)
- **Rigidbody.MovePosition（6000.0／current／6000.3／旧）** — 在 FixedUpdate 内按固定步移动且遵守插值；明确传送不能用它，补足连续位移与瞬移的分界。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/rigidbody/moveposition)／[current](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/rigidbody/moveposition)／[6000.3](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html)／[旧](https://docs.unity3d.com/ScriptReference/Rigidbody.MovePosition.html)
- **Rigidbody2D.interpolation（旧 API）** — 2D 版本的内置插值，对应当前候选里的 Rigidbody2D 讨论。[链接](https://docs.unity3d.com/ScriptReference/Rigidbody2D-interpolation.html)
- **CharacterController.Move（6000.0／current／6000.3／旧）** — CC 不受力、只有调用 Move 才移动，接收绝对位移增量、返回 CollisionFlags、不自动施加重力；是“唯一 motor 调用点”的官方约束。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/charactercontroller/move)／[current](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/charactercontroller/move)／[6000.3](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController.Move.html)／[旧](https://docs.unity3d.com/ScriptReference/CharacterController.Move.html)

**Unity：Root Motion 与 Animator**

- **Root Motion 手册（6000.0／6000.3）** — 解释 Body／Root Transform、Bake Into Pose 与位移如何写回 GameObject；用来判断动画位移是烘焙进姿势还是交给 motor。[6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/animation-section/animation-mecanim/avatar-creationand-setup/root-motion)／[6000.3](https://docs.unity3d.com/6000.3/Documentation/Manual/RootMotion.html)
- **Scripting Root Motion（6000.0／6000.6）** — 官方给出用 OnAnimatorMove 接管根运动的流程，并说明 Animator 会把 Apply Root Motion 显示为 Handled by Script。[6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/animation-section/animation-mecanim/avatar-creationand-setup/scripting-root-motion)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/manual/animation-section/animation-mecanim/avatar-creationand-setup/scripting-root-motion)
- **MonoBehaviour.OnAnimatorMove（6000.0／current／6000.3／6000.6／旧）** — 明确回调发生在状态机／动画求值后、OnAnimatorIK 前，示例用 deltaPosition／deltaRotation 写刚体或 Transform；是根运动所有权的接口点。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/monobehaviour/onanimatormove)／[current](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/monobehaviour/onanimatormove)／[6000.3](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnAnimatorMove.html)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/script-reference/unityengine/monobehaviour/onanimatormove)／[旧](https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnAnimatorMove.html)
- **Animator component（6000.0／旧手册）** — Apply Root Motion 与 Update Mode（Normal／Animate Physics／Unscaled）的官方说明；Animate Physics 才让动画与 FixedUpdate 同步。[6000.0](https://docs.unity.com/en-us/engine/6000.0/manual/animation-section/animation-mecanim/class-animator)／[旧](https://docs.unity3d.com/Manual/class-Animator.html)
- **Animator.updateMode（6000.0／current／6000.3／6000.6／旧）** — Normal／AnimatePhysics／UnscaledTime 决定动画在哪个更新阶段推进，是 root motion 与 FixedUpdate 对齐、暂停时动画是否继续的关键开关。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/animator/updatemode)／[current](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/animator/updatemode)／[6000.3](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator-updateMode.html)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/script-reference/unityengine/animator/updatemode)／[旧](https://docs.unity3d.com/ScriptReference/Animator-updateMode.html)
- **AnimatorUpdateMode（6000.0）** — Fixed 模式让 Animator 在 FixedUpdate 循环中求值，决定 root motion 是每个物理步产生一次还是每渲染帧一次。[链接](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/animatorupdatemode)
- **Animator.applyRootMotion（6000.0／current／6000.3／旧）** — 控制 clip 是否驱动角色位移；存在 OnAnimatorMove 时它无效，且运行时修改它会重建 Animator，说明动画与脚本不能同时拥有位移提交权。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/animator/applyrootmotion)／[current](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/animator/applyrootmotion)／[6000.3](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator-applyRootMotion.html)／[旧](https://docs.unity3d.com/ScriptReference/Animator-applyRootMotion.html)
- **Animator.animatePhysics（current）** — 开启后动画变换会驱动 kinematic Rigidbody 并供物理使用，是动画时序与物理提交耦合的开关。[链接](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/animator/animatephysics)
- **Animator.deltaPosition（6000.0／6000.3／6000.6／旧）** — OnAnimatorMove 中可消费的根位移增量，明确“动画给出增量、谁负责应用”的契约；只在 applyRootMotion 开启时有值。[6000.0](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/animator/deltaposition)／[6000.3](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/animator/deltaposition)／[6000.6](https://docs.unity.com/en-us/engine/6000.6/script-reference/unityengine/animator/deltaposition)／[旧](https://docs.unity3d.com/ScriptReference/Animator-deltaPosition.html)
- **Animator.rootPosition（6000.3）** — 绝对 root 位置且只应在 OnAnimatorIK 设置，区分绝对位置与逐帧增量两种写者语义。[链接](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/animator/rootposition)
- **Animator.velocity（6000.3）** — root motion 的逐帧速度，可直接喂给 Rigidbody／CharacterController，避免再次积分 deltaPosition。[链接](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/animator/velocity)
- **Cinemachine Brain（2.10／3.1）** — Fixed Update／Late Update／Smart Update 决定相机跟随哪个 tick；ManualUpdate 应在目标移动后调用，是“调插值／更新类型无效”类抖动的配置面。[2.10](https://docs.unity3d.com/Packages/com.unity.cinemachine@2.10/manual/CinemachineBrainProperties.html)／[3.1](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineBrain.html)

**Unity：Input System、Netcode 与官方样例**

- **Input System Update Mode（6.7）** — 官方对比 Dynamic／Fixed／Manual 三种输入处理；Fixed Update 模式按 `Time.fixedDeltaTime` 处理事件，是输入采样／消费频率的直接选项。[链接](https://docs.unity3d.com/Packages/com.unity.inputsystem@6.7/manual/update-mode.html)
- **InputSettings.UpdateMode（1.11）** — `ProcessEventsInFixedUpdate` 把输入采样对齐物理 tick；是输入采样／消费频率的官方枚举定义。[链接](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.11/api/UnityEngine.InputSystem.InputSettings.UpdateMode.html)
- **Character Controller 包：Standard characters implementation overview（1.1）** — 官方样例把输入每帧采集、速度／碰撞放固定步、朝向放可变步，并用 CharacterInterpolation 做呈现；是官方团队自己怎么分层的实例。[链接](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.1/manual/get-started-implementation-overview.html)
- **Character Controller package（ECS，6.7）** — 官方 ECS 角色控制器包，给出行走／跳跃／碰撞的固定步长实现参照，也是 CharacterControllerSamples 的上游文档。[链接](https://docs.unity3d.com/Packages/com.unity.charactercontroller@6.7/manual/index.html)
- **Unity Netcode：NetworkTransform（2.4）** — 官方远程实体插值实现，明确只有非权威端插值、改插值参数会触发状态重置，可作为“呈现层不得反写模拟”的对照。[链接](https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@2.4/manual/components/networktransform.html)
- **Unity Netcode：Introduction to prediction（6.6）** — 官方模型区分 predicted／interpolated ghost，并用 full／partial ticks 与选择性回滚重放，直接对应网络角色“呈现对象 ≠ 权威对象”。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/intro-to-prediction.html)
- **Unity Netcode：Prediction switching（6.6）** — 运行时在 predicted 与 interpolated 间切换并做时间线平滑，对应重生／传送后更换位置权威而不插回旧位置。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/prediction-switching.html)
- **Unity Netcode：Interpolation（6.6）** — 快照时间线与插值缓冲的官方实现说明，支撑客户端在 30／60／120 呈现频率下平滑显示离散 tick。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/interpolation.html)
- **Unity Netcode：Prediction smoothing（6.6）** — 校正时只平滑可见误差而不改权威状态，是“预测失败也不把角色拉回旧位置”的官方做法。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/prediction-smoothing.html)
- **Unity Netcode for Entities：Interpolation and extrapolation（1.8）** — 插值 ghost 在权威时间线之后回放、预测 ghost 在其之前运行，明确权威状态与呈现状态两条时间线及各自写者。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@1.8/manual/interpolation.html)
- **Unity Netcode：Ghost snapshots（6.6）** — 解释部分快照与选择性回滚，是预测修正的数据面。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/ghost-snapshots.html)
- **Unity Netcode：Time synchronization（6.6）** — NetworkTimeSystem 的 tick／时间线对齐机制，决定插值延迟与确认边界。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/time-synchronization.html)
- **Unity Netcode：Command stream（6.6）** — 部分 tick 下保留离散输入事件，直接对应输入采样／消费频率问题。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/command-stream.html)
- **Unity Netcode：Managing latency with prediction（6.6）** — 官方“用预测管理延迟”指南，补足 intro 页没有展开的实践。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/prediction-n4e.html)
- **Unity Netcode：Reduce prediction overhead（6.6）** — forced input latency ticks 等降载手段，影响预测与呈现的错位。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/optimization/reduce-prediction-overhead.html)
- **Unity Netcode：Physics（interpolated ghosts，6.6）** — 物理 ghost 的插值行为，涉及物理对象与呈现对象分离。[链接](https://docs.unity3d.com/Packages/com.unity.netcode@6.6/manual/physics.html#interpolated-ghosts)
- **Unity Netcode：Distributed authority topologies（2.4）** — 对比 client-server 与 distributed authority，后者明确没有单一物理模拟，是“单一系统拥有位移”的反面拓扑。[链接](https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@2.4/manual/terms-concepts/distributed-authority.html)

**Unreal Engine**

- **Root Motion in Unreal Engine** — 官方根运动提取流程（Enable Root Motion、Root Motion Mode、Montage Only）与“动画驱动 Movement Component”的边界。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine)
- **Animation Montage in Unreal Engine** — Montage 根运动在联网中的复制与校正说明；需要动画驱动特殊位移时，官方建议走 Montage／根运动源而非直接 SetLocation。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-montage-in-unreal-engine)
- **Understanding Networked Movement in CMC** — 明确根运动总是优先于常规移动、SmoothClientPosition 插值、`bTeleport` 让客户端直接跳位不过渡；是单一移动组件与传送清历史的官方答案。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine)
- **Physics Sub-Stepping** — 全局物理子步的 Max Substep Delta Time／Max Physics Delta Time 设置；注意它与 CMC 自身的 MaxSimulationTimeStep／Iterations 不是同一个开关。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-sub-stepping-in-unreal-engine)
- **Mover Features and Concepts（两处路径）** — 官方新 Mover（5.6 标注 Experimental）规定同时只有一个 movement mode，分层 move（含 root motion）只提议、由当前 mode 执行；是“一个系统拥有位移”的官方架构样例。[路径一](https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-features-and-concepts-in-unreal-engine)／[路径二](https://dev.epicgames.com/documentation/unreal-engine/mover-features-and-concepts-in-unreal-engine)
- **Mover Examples** — 新 Mover 框架的 layered moves 与物理后端示例，是 CMC 之外的另一套位移所有权方案。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-examples-in-unreal-engine)
- **Motion Warping** — 展示系统如何动态改写 root motion 去对齐目标点，说明“根运动位移”也可以被上层系统接管，移植时必须明确最终写者。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-warping-in-unreal-engine)
- **Motion Matching（两处路径）** — UE5 官方 motion matching（轨迹／姿态查询选帧），要求动画包含 root motion，并说明 trajectory 通道由 Character Trajectory 组件采样。[路径一](https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-matching-in-unreal-engine)／[路径二](https://dev.epicgames.com/documentation/unreal-engine/motion-matching-in-unreal-engine)
- **Game Animation Sample** — 官方示例用 Offset Root Bone 让网格动画暂时偏离胶囊再插值回位，是“动画位移与胶囊运动所有权分离”的现成做法。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/game-animation-sample-project-in-unreal-engine)
- **Networked Physics Overview** — 官方对比 Default／Predictive Interpolation／Resimulation 三种校正，明确缓存每个物理 tick、回滚重模拟并用渲染插值消除 snap。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/networked-physics-overview)
- **Mover（主文档）** — 群内 UE Game Animation Sample／Mover 文的官方对应文档，代表“角色移动由专门组件统一拥有”的另一引擎方案。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-in-unreal-engine)
- **Comparing Mover and Character Movement Component** — 对比 CMC 客户端 RPC 驱动的隔离修正与 Mover／Network Prediction 的共享时间线回滚，是选择迁移目标的关键页。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/comparing-mover-and-character-movement-component-in-unreal-engine)
- **FNetworkPredictionData_Client_Character** — 客户端保存 pending／saved moves、修正数据与平滑参数的结构，对应“重放哪些输入、清哪些历史”。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/GameFramework/FNetworkPredictionData_Client_Ch-?application_version=5.5)
- **FNetworkPredictionData_Server_Character** — 服务端待发送修正（PendingAdjustment）状态，解释服务器如何决定 ClientAdjustPosition 的发送时机。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/GameFramework/FNetworkPredictionData_Server_Ch-?application_version=5.5)
- **FRepMovement** — 模拟代理收到的复制移动数据，是远端平滑与位置修正的输入载荷。[链接](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/Engine/FRepMovement?application_version=5.5)

**Godot**

- **Physics interpolation 索引** — 第一方文档把物理 tick 与渲染帧不同步、选择物理 tick 频率、把逻辑移进 `_physics_process` 写成明确规则；3D 插值 4.4 引入、4.5 移到 SceneTree。[链接](https://docs.godotengine.org/en/stable/tutorials/physics/interpolation/index.html)
- **Physics interpolation Introduction** — 官方解释固定 physics tick 与可变渲染帧的错位、插值分数，以及插值带来 1–2 tick 呈现滞后和 extrapolation 风险。[链接](https://docs.godotengine.org/en/stable/tutorials/physics/interpolation/physics_interpolation_introduction.html)
- **Using physics interpolation** — 官方操作要求：逻辑移到 `_physics_process`、间接运动也在 tick 内、传送后 `reset_physics_interpolation`、按 10–30／30–60／60+ 选 tick。[链接](https://docs.godotengine.org/en/stable/tutorials/physics/interpolation/using_physics_interpolation.html)
- **Advanced physics interpolation** — 官方进阶说明：可逐节点关插值，相机最好手动插值或直接每帧读输入；对应 FPS 相机不插值、身体插值的分层。[链接](https://docs.godotengine.org/en/stable/tutorials/physics/interpolation/advanced_physics_interpolation.html)
- **Physics interpolation quick start** — 最短启用路径，适合先跑通最小插值场景再讨论位移权威。[链接](https://docs.godotengine.org/en/stable/tutorials/physics/interpolation/physics_interpolation_quick_start_guide.html)
- **2D／3D 物理插值的自动范围与例外** — 官方列出哪些节点／属性会被自动插值、哪些例外，帮助划清“哪些呈现由引擎插值、哪些必须自己清历史”。[链接](https://docs.godotengine.org/en/stable/tutorials/physics/interpolation/2d_and_3d_physics_interpolation.html)
- **Godot 3.6 quick start（历史版本）** — 明确要求移动写在 `_physics_process`，传送或初始放置后调用 `reset_physics_interpolation`，否则出现拖影。[链接](https://docs.godotengine.org/en/3.6/tutorials/physics/interpolation/physics_interpolation_quick_start_guide.html)
- **Godot 4.4 release notes** — 官方发布说明 3D physics interpolation 在 4.4 落地（4.3 只有 2D），可作为引擎版本与能力边界。[链接](https://godotengine.org/releases/4.4/)
- **Node.reset_physics_interpolation** — 传送／初始放置时把 previous transform 设为 current 的精确 API 语义；暂停／重生不拖影的直接实现点。[链接](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-method-reset-physics-interpolation)
- **Node3D.get_global_transform_interpolated** — 取插值后的世界变换给相机／挂点使用，避免直接读未插值 transform 造成抖动。[链接](https://docs.godotengine.org/en/stable/classes/class_node3d.html#class-node3d-method-get-global-transform-interpolated)
- **Engine.get_physics_interpolation_fraction** — 暴露物理 tick 间的 alpha，供相机等非节点对象做自定义呈现。[链接](https://docs.godotengine.org/en/stable/classes/class_engine.html#class-engine-method-get-physics-interpolation-fraction)
- **MultiMesh.reset_instance_physics_interpolation** — 批量实例传送／重生时逐实例清历史，是“暂停／重生不插回旧位置”在批量呈现上的对应 API。[链接](https://docs.godotengine.org/en/stable/classes/class_multimesh.html#class-multimesh-method-reset-instance-physics-interpolation)
- **ProjectSettings：physics_ticks_per_second** — 物理 tick 与渲染帧解耦的配置入口，文档同时给出 10–30／30–60／60+ 的适用区间。[链接](https://docs.godotengine.org/en/stable/classes/class_projectsettings.html#class-projectsettings-property-physics-common-physics-ticks-per-second)
- **Input.use_accumulated_input** — 决定输入事件是否按帧合并，直接影响输入采样频率与物理 tick 消费的粒度。[链接](https://docs.godotengine.org/en/stable/classes/class_input.html#class-input-property-use-accumulated-input)
- **Idle and Physics Processing** — `_physics_process` 固定 60 Hz 且在每次物理 tick 前执行，是把移动写在唯一位置的官方入口；`_process` 明确与物理不同步。[链接](https://docs.godotengine.org/en/stable/tutorials/scripting/idle_and_physics_processing.html)
- **CharacterBody3D.move_and_slide()** — 明确位移必须用物理步的 delta 且在 `_physics_process` 内推进，`velocity` 不应再乘 delta，划清 motor 的写入时机。[链接](https://docs.godotengine.org/en/stable/classes/class_characterbody3d.html#class-characterbody3d-method-move-and-slide)
- **Jitter and stutter** — 区分 jitter 与 stutter 并给出配置排查项，可用于验收 30／60／120 Hz 下的呈现不变量。[链接](https://docs.godotengine.org/en/stable/tutorials/rendering/jitter_stutter.html)
- **AnimationTree root motion** — 根运动作为数据取出后交给 `move_and_slide`，明确动画不直接写物理体的契约。[链接](https://docs.godotengine.org/en/stable/tutorials/animation/animation_tree.html#root-motion)

**Bevy、Box2D、Jolt 与网络框架文档**

- **Bevy 官方示例：Run physics in a fixed timestep** — 官方示例把 PhysicalTranslation 与 Transform 分开，FixedUpdate 只推进物理位置，渲染用 overstep_fraction 插值 Transform；是“模拟对象／呈现对象分离”的最干净代码。[链接](https://bevy.org/examples/movement/physics-in-fixed-timestep/)
- **Bevy Time<Fixed>** — 官方说明 Fixed 时钟默认 64 Hz、在 FixedUpdate 中替代 Time，并提供 overstep_fraction；用于确定固定步长与插值 alpha 的来源。[链接](https://docs.rs/bevy/latest/bevy/time/struct.Fixed.html)
- **Bevy FixedUpdate** — 固定频率运行 gameplay 的调度标签，官方把固定步长逻辑与每帧 Update 呈现逻辑分开。[链接](https://docs.rs/bevy/latest/bevy/prelude/struct.FixedUpdate.html)
- **Bevy Time<Virtual>** — `pause()` 使 delta 归零、elapsed 冻结，`set_max_delta` 限制单帧追赶量，给出暂停与防死亡螺旋的时钟原语。[链接](https://docs.rs/bevy/latest/bevy/time/struct.Virtual.html)
- **Bevy RunFixedMainLoop 调度** — 固定循环与主循环的调度边界，决定呈现系统放 FixedPostUpdate 还是 Update。[链接](https://docs.rs/bevy/latest/bevy/app/struct.RunFixedMainLoop.html)
- **Box2D 文档：Hello World** — 官方明确“不要把时间步绑到帧率”并直接推荐 Fix Your Timestep，是引擎侧固定步长的权威依据。[链接](https://github.com/erincatto/box2d/blob/main/docs/hello.md)
- **Box2D 文档：Simulation（time step 与 sub-steps）** — 给出 timeStep + subSteps 的固定步进方式与 1/60 建议，补子步数、迭代次数与低帧率取舍。[链接](https://github.com/erincatto/box2d/blob/main/docs/simulation.md)
- **Jolt Physics：CharacterVirtual.h** — 工业级 kinematic 角色实现：速度／位置由角色自身每步推进、可选内嵌刚体只为提供物理存在，是“单一系统拥有位移、渲染不参与”的参考实现。[链接](https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Character/CharacterVirtual.h)
- **Jolt Physics：CharacterVirtual 类文档** — 虚拟角色不被 PhysicsSystem 跟踪，调用方自己 Update／保存状态，传送后还要 RefreshContacts。[链接](https://jrouwe.github.io/JoltPhysics/class_character_virtual.html)
- **Photon Quantum 简介** — 商业确定性 ECS 引擎（定点数 + rollback），提供与 Unity 原生物理不同的权威模型，作为是否值得确定性的对照。[链接](https://doc.photonengine.com/quantum/current/quantum-intro)
- **Photon Quantum：KCC Input** — 确定性 KCC 的输入采集方式，可作为帧同步／固定步长下角色控制器的对照实现。[链接](https://doc.photonengine.com/quantum/current/addons/kcc/input)
- **Photon Quantum：KCC movement** — Quantum 确定性 KCC 的移动处理，含固定 tick 下的碰撞与速度。[链接](https://doc.photonengine.com/quantum/v3/addons/kcc/movement)
- **Photon Quantum：Prediction culling** — 预测剔除，说明如何隐藏远处／未确认预测的呈现。[链接](https://doc.photonengine.com/quantum/v3/manual/prediction-culling)
- **Photon Quantum：Entity view** — 模拟实体与 Unity 视图分离的官方模型，直接对应“呈现对象与物理对象分离”。[链接](https://doc.photonengine.com/quantum/v3/manual/entityview)
- **Photon Quantum：Fixed-point math** — 定点数学页，是确定性固定步长的数值前提。[链接](https://doc.photonengine.com/quantum/v3/manual/quantum-ecs/fixed-point)
- **Mirror：Snapshot Interpolation（.md 端点）** — 快照按时间排序进缓冲、按当前时间 Compute 出插值状态并处理缓冲过大时的追赶，可与 Unity／UE 的平滑策略对照。[链接](https://mirror-networking.gitbook.io/docs/manual/components/network-transform/snapshot-interpolation.md)
- **Mirror：Snapshot Interpolation（页面）** — 同一文档的页面入口，说明本地／远端两条时间线之间如何插值、处理延迟与追赶。[链接](https://mirror-networking.gitbook.io/docs/manual/components/network-transform/snapshot-interpolation)
- **Mirror：Client Side Prediction** — Mirror 的客户端预测实验文档，说明输入先行、状态回滚与重放的实现边界。[链接](https://mirror-networking.gitbook.io/docs/manual/general/client-side-prediction)
- **FishNet：NetworkTickSmoother** — 官方组件在网络 tick 之间插值位置／旋转／缩放，是 FishNet 修复非拥有对象丢插值的直接入口。[链接](https://fish-networking.gitbook.io/docs/fishnet-building-blocks/components/tick-smoothers/networkticksmoother)
- **FishNet：TimeManager** — TimeManager 管网络 tick 与 tick delta，用于区分 tick delta 与渲染 frame delta 的消费边界。[链接](https://fish-networking.gitbook.io/docs/fishnet-building-blocks/components/managers/time-manager)
- **Rukhanka：Root Motion 文档** — 商业动画系统文档直接警告用角色控制器时要关内置位移“避免把骨架移动两次”，是文档层面的双写风险确认。[链接](https://docs.rukhanka.com/root_motion)
- **Rukhanka：Working with Netcode** — 说明 predicted／interpolated ghost 两种 Netcode 模式下动画如何同步，是把动画与网络 tick 对齐的参考。[链接](https://docs.rukhanka.com/netcode)
- **Animancer：Root Motion 文档** — 说明 root motion 的重定向与应用方式，补足 OnAnimatorMove 之外的动画资产侧契约。[链接](https://kybernetik.com.au/animancer/docs/manual/other/root-motion)

### S2 同类实现与开源代码（可直接对照写者与调度）

**固定步长与呈现插值的现成实现**

- **Jondolf/bevy_transform_interpolation** — 高质量第三方插件：插值状态独立于 gameplay Transform，非固定调度内的改动按传送处理；同时列出重复位置数据等代价。[链接](https://github.com/Jondolf/bevy_transform_interpolation)
- **Avian PR #566：Physics Interpolation and Extrapolation** — 物理引擎把插值／外推内建的 PR：固定调度外的改动等价传送、外推不积分速度／重力；是物理与呈现分离的边界清单。[链接](https://github.com/avianphysics/avian/pull/566)
- **Lightyear：Frame interpolation（固定 SHA）** — 高质量联网框架渲染落后一个固定 tick，用 overstep_fraction 插值，并用 SkipFrameInterpolation 跳过传送帧；直接对应重生／传送清历史。[链接](https://github.com/cbournhonesque/lightyear/blob/ee50df6664338ff1eb4b3885c8525fa3c9030691/book/src/concepts/advanced_replication/visual_interpolation.md)
- **lawnjelly/smoothing-addon** — 500+ star 的 Godot 固定步长插值插件，含传送／重置处理，可作为跨引擎“呈现位置插值器”实现对照。[链接](https://github.com/lawnjelly/smoothing-addon)
- **janhohenheim/avian_interpolation** — Avian 物理的固定步长插值插件，处理刚体呈现，可作为物理对象与显示对象分离的对照。[链接](https://github.com/janhohenheim/avian_interpolation)
- **bjornbytes/tick** — LÖVE 的固定步长小库，把 accumulator 与插值封装成 API，适合对照自写固定步循环的边界。[链接](https://github.com/bjornbytes/tick)
- **SuperTux `screen_manager.cpp` 固定步长循环（固定 SHA）** — HN 讨论中给出的真实游戏循环：固定步、最大步数钳制、关卡切换时清空超大 elapsed、可选 frame prediction 偏移，覆盖暂停／切换与追帧边界。[链接](https://github.com/SuperTux/supertux/blob/8d79ac7ce4db5e42258c6fbd7e93bfb5a11f2f82/src/supertux/screen_manager.cpp#L564-L653)
- **IceCreamYou/MainLoop.js** — 500+ star 的 JS 主循环库，明确固定步长与渲染分离，与网页 FPS-Like 同栈。[链接](https://github.com/IceCreamYou/MainLoop.js)
- **huwb/jitternator** — 作者复盘 jitter 来源与“物理步与渲染不同步”的排查方法，直接对应呈现位置抖动的诊断。[链接](https://github.com/huwb/jitternator)
- **BoundingBoxSoftware/CharacterController（Pretty Good Character Controller）** — 自建 Physics Manager 在帧首用 `Time.deltaTime` 推进物理并让角色修正与显示同步，是“多个系统抢写位置”的直接对照，2026-07 仍活跃。[链接](https://github.com/BoundingBoxSoftware/CharacterController)
- **ZuBsPaCe/unity-smooth-movement-test** — 对比固定步 + 插值、手动 `Physics.Simulate` 和不同 tick 率的可运行源码与测试结论，可直接复现文章中的抖动。[链接](https://github.com/ZuBsPaCe/unity-smooth-movement-test)
- **jakubtomsu/fixed-timestep-demo** — 可运行的固定步长 demo，并排实现无平滑、插值、render tick、累加 render tick 四种呈现方案。[链接](https://github.com/jakubtomsu/fixed-timestep-demo)
- **Isaac Sukin 的 JS 主循环示例（文章配套）** — 累加器循环、螺旋死亡上限与用剩余比例渲染插值的完整推导，与 MainLoop.js 候选配套。[链接](http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing)
- **KinematicSoup Reactor** — 商用网络引擎，内置插值／预测／和解，可作为自研方案的对照。[链接](https://www.kinematicsoup.com/reactor)

**Unity 角色控制器与 FPS motor**

- **dbrizov/Unity-CharacterController** — 按 star 排最前的 Unity 第三人称控制器（1.1k），可对照其 Update／FixedUpdate 分工与相机跟随。[链接](https://github.com/dbrizov/Unity-CharacterController)
- **mishanyaqq/Erbium** — 499 star 的第三人称控制器，作为头部控制器实现对照。[链接](https://github.com/mishanyaqq/Erbium)
- **Unity-Technologies/CharacterControllerSamples** — 官方样例；样例里能看到运动与平台写法，适合核对 ECS 路线的位移所有权。[链接](https://github.com/Unity-Technologies/CharacterControllerSamples)
- **Unity OnlineFPS 样例：客户端预测角色移动与 CharacterInterpolation** — 官方说明该 FPS 样例用 DOTS Netcode 做客户端预测，并在 ghost 上挂 CharacterInterpolation、在 rollback／resimulate 时重建朝向。[链接](https://github.com/Unity-Technologies/CharacterControllerSamples/blob/master/_Documentation/Samples/onlinefps.md)
- **Unity 官方教程：Networking the Standard Characters** — 完整演示 owner 预测 + 远端插值，并明确 CharacterInterpolation 只挂在 PredictedClient（远端插值交给 netcode、服务器不需要）。[链接](https://github.com/Unity-Technologies/CharacterControllerSamples/blob/master/_Documentation/Tutorial/tutorial-netcodecharacters.md)
- **Unity OnlineFPS：Character and Camera 文档** — 样例只同步角色 Y 角与相机 pitch，并在每次预测更新开头按同步字段重建旋转，展示“权威状态到呈现对象”的字段级重建而非整变换复制。[链接](https://github.com/Unity-Technologies/CharacterControllerSamples/blob/master/_Documentation/Samples/OnlineFPSSample/character-and-camera.md)
- **CharacterControllerSamples：Prediction tutorial（第一人称）** — 官方 Netcode 角色预测／回滚的逐步教程，补足总览页缺的实现顺序。[链接](https://github.com/Unity-Technologies/CharacterControllerSamples/blob/master/_Documentation/Tutorial/tutorial-netcodecharacters-prediction-firstperson.md)
- **CharacterControllerSamples：InputUtil tutorial** — 按帧时间累积输入增量的辅助实现，正对输入采样频率问题。[链接](https://github.com/Unity-Technologies/CharacterControllerSamples/blob/master/_Documentation/Tutorial/tutorial-netcodecharacters-inpututil.md)
- **VeryHotShark/First-Person-Controller-VeryHotShark** — 368 star 的通用 FPS 控制器，可对照输入采样与显示更新。[链接](https://github.com/VeryHotShark/First-Person-Controller-VeryHotShark)
- **IronWarrior/SuperCharacterController** — 765 star 的老牌自定义控制器（最后推送 2018），作为历史实现与迁移风险对照。[链接](https://github.com/IronWarrior/SuperCharacterController)
- **Olezen/UnitySourceMovement** — 387 star 的 Source 引擎移动移植（strafe jump／surf／bhop），自带碰撞层，可对照 FPS motor 的速度与位移所有权。[链接](https://github.com/Olezen/UnitySourceMovement)
- **WiggleWizard/quake3-movement-unity3d** — 302 star 的 Quake III strafe 移动移植，是 FPS-Like 之外可逐行对照的 C# 实现。[链接](https://github.com/WiggleWizard/quake3-movement-unity3d)
- **atil/fpscontroller** — Q3 风格、刻意不用 CharacterController 的透明运动实现，可对照移植时碰撞与位移写者的分离。[链接](https://github.com/atil/fpscontroller)
- **MaciejSzybiak/q2unity** — 把 Quake II 移动物理移植到 Unity，作为固定步长 FPS motor 的第二个独立实现。[链接](https://github.com/MaciejSzybiak/q2unity)
- **rogerli2020/SourceEngineMovementUnity** — 2026 年仍更新的极简 Source／Quake 移动扩展，直接扩展现有 CharacterController，对应“只补一层”的迁移路径。[链接](https://github.com/rogerli2020/SourceEngineMovementUnity)
- **ashleve/ActiveRagdoll** — 用 PID 让物理 ragdoll 追随动画目标，直接展示“物理身体 vs 动画呈现”两个位置源如何分工。[链接](https://github.com/ashleve/ActiveRagdoll)
- **joebinns/stylised-character-controller** — 基于 floating capsule 的物理控制器（Very Very Valet 方案复刻），可作为接触与呈现分离的参考。[链接](https://github.com/joebinns/stylised-character-controller)
- **Toyful Games — Very Very Valet 浮空胶囊角色控制器（视频）** — 物理驱动浮空胶囊方案，是 stylised-character-controller 的直接来源；本轮只核了页面链接，未看视频。[链接](https://www.youtube.com/watch?v=qdskE8PJy6Q)
- **Toyful Games — Deep Dive: Game Feel with Springs** — 把弹簧作为游戏手感工具的实装讨论，对应 SpringCharacterController 与阻尼插值的取舍。[链接](https://www.toyfulgames.com/blog/deep-dive-game-feel-with-springs)
- **SUCC – SurfsUp Character Controller** — 2026-10 开源的商业 FPS 控制器，一套资源切换 Quake／Half-Life／Source 手感，含 bunnyhop、surf、air strafe，楼梯位移对第一／第三人称分别做 render-smoothed。[链接](https://github.com/bearlikelion/SUCC)
- **SUCC 文档：Add multiplayer** — 把跑输入／物理／相机的权威 SUCC 和只做插值的只读 SUCCPawn 拆成两个节点，并给出专用服务器与 owner 预测／校正做法。[链接](https://bearlikelion.github.io/SUCC/how-to/add-multiplayer/)
- **Improved-KCC** — 2026-09 更新，按 Jolt CharacterVirtual 思路重写速度／位置求解，强调位移用的速度就是实际速度、消除角点抖动并正确处理移动平台约束速度。[链接](https://github.com/DinkeyKing/Improved-KCC)
- **Kinematic Character Controller（Philippe St-Amand，Asset Store）** — SuperCharacterController 作者点名推荐的替代品，kinematic 控制器处理移动平台和根位移；是物理对象／呈现对象分离的工业实现，但源码不开源。[链接](https://assetstore.unity.com/packages/tools/physics/kinematic-character-controller-99131)
- **Bevy Ahoy** — 2026-08 仍活跃的 3D 运动学控制器，明说控制器有意不服从物理引擎力、自己定义一套运动模型，含 surf 关卡；仓库页可读，README 在 main／master 均 404。[链接](https://github.com/janhohenheim/bevy_ahoy)
- **nicholas-maltbie/OpenKCC** — 开源运动学角色控制器，包含移动平台、台阶等边界，可对照 motor 与呈现分离。[链接](https://github.com/nicholas-maltbie/OpenKCC)
- **idanarye/bevy-tnua** — 482 star 的 Bevy floating character controller，跨引擎对照运动与物理接触。[链接](https://github.com/idanarye/bevy-tnua)
- **gdquest-demos/godot-3d-mannequin** — 1.1k star 的 Godot 3D 角色控制器，头部结果，可对照固定步长下的移动与动画。[链接](https://github.com/gdquest-demos/godot-3d-mannequin)
- **hh-hang/three-player-controller** — 312 star 的 three.js 玩家控制器，与网页 FPS-Like 同栈。[链接](https://github.com/hh-hang/three-player-controller)

**Motion Matching 与动画驱动位移**

- **Daniel Holden — orangeduck/Motion-Matching** — Motion Matching／Learned Motion Matching 参考实现（`controller.cpp`、`database.h`），可直接对照 JLPM22 的搜索与控制分层。[链接](https://github.com/orangeduck/Motion-Matching)
- **orangeduck/Spring-It-On** — 上述弹簧控制器的源码实现，可直接对照 `spring_character_update`／`predict`。[链接](https://github.com/orangeduck/Spring-It-On)
- **orangeduck/Animation-Velocities** — 文章配套参考实现（kineform 数据结构），可核对断点后位置／速度如何一起重建。[链接](https://github.com/orangeduck/Animation-Velocities)
- **dreaw131313/MotionMatchingByDreaw** — 352 star 的第二个可对照实现；可直接比对轨迹／姿态搜索与控制器关系。[链接](https://github.com/dreaw131313/MotionMatchingByDreaw)
- **GuilhermeGSousa/godot-motion-matching** — 255 star 的 Godot Motion Matching，跨引擎对照动画选择与位移所有权。[链接](https://github.com/GuilhermeGSousa/godot-motion-matching)
- **UmutFarukDilli/motionmatchingreplicated** — 205 star 的 Motion Matching 联网复制样例，作者明确说主分支缺 smooth sync，正好对应远端角色呈现位置问题。[链接](https://github.com/UmutFarukDilli/motionmatchingreplicated)
- **voxell-tech/bevy_motion_matching** — Bevy 的 Motion Matching 实现，作为 ECS 引擎对照。[链接](https://github.com/voxell-tech/bevy_motion_matching)
- **needle-mirror/com.unity.kinematica** — Unity 已停止的 Motion Matching 包镜像，可作历史基线，避免把旧方案当新默认。[链接](https://github.com/needle-mirror/com.unity.kinematica)
- **Remi123/MotionMatching** — Godot 4 的 motion matching 实现，暴露 inertialized root motion velocity／angular，直接用动画根位移驱动控制器。[链接](https://github.com/Remi123/MotionMatching)
- **O3DE MotionMatching Gem** — O3DE 官方开源 motion matching，特征含 root／trajectory，展示引擎内如何把匹配结果写回角色。[链接](https://github.com/o3de/o3de/tree/development/Gems/MotionMatching)
- **Environment-aware Motion Matching（SIGGRAPH Asia 2025）** — JLPM22 README 列为同包最新成果并附 code；追当前上限时可核环境约束下的轨迹／姿态查询如何改写位移。[链接](https://upc-virvig.github.io/Environment-aware-Motion-Matching/)
- **Environment-aware Motion Matching：代码仓库** — 开源实现把 trajectory 与 pose 联合搜索，产出绕障的 root motion，可作为“动画即位移”的对照。[链接](https://github.com/UPC-ViRVIG/Environment-aware-Motion-Matching)
- **tomcatmew/simple_motion_matching** — 2026-10 仍活跃的小型 motion matching 实现，README 给出 Claude Code 改进前后的操作／路径编辑对比，可作为 JLPM22 之外更小体量的阅读入口。[链接](https://github.com/tomcatmew/simple_motion_matching)
- **Animation-Uprising/Motion-Matching-for-Unity（MxM）** — JLPM22 #9 中提到的另一套 MM（MxM）现已免费开源，可对照其 root motion 与控制器耦合方式（仓库仍标为受限访问）。[链接](https://github.com/Animation-Uprising/Motion-Matching-for-Unity)

**Quake／Source 的 motor 与预测源码**

- **Quake III `bg_pmove.c`（固定 SHA）** — id 把玩家位移写成 usercmd→playerstate 的纯函数，客户端与服务端共用；是 motor 纯函数与输入消费边界的经典源码。[链接](https://github.com/id-Software/Quake-III-Arena/blob/dbe4ddb10315479fc00086f08e25d968b4b43c49/code/game/bg_pmove.c)
- **Quake III `bg_pmove.c`（master）** — 同一文件的 master 入口，便于对照后续改动；内容与固定 SHA 版本一致。[链接](https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/bg_pmove.c)
- **Quake III `bg_slidemove.c`** — 多次迭代滑动移动，位移由 pmove 单点写入，可对照自研 motor 的权威边界。[链接](https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/bg_slidemove.c)
- **Quake III `cg_ents.c`** — 客户端用 `cg.frameInterpolation` 在前后快照间算 lerpOrigin，权威快照不因呈现被改写；老牌 FPS 的呈现／模拟分离实例。[链接](https://github.com/id-Software/Quake-III-Arena/blob/master/code/cgame/cg_ents.c)
- **Quake III `cg_predict.c`** — 客户端预测、服务端命令重放与误差衰减，展示“呈现读预测状态”的实现。[链接](https://github.com/id-Software/Quake-III-Arena/blob/master/code/cgame/cg_predict.c)
- **Quake III `cl_input.c`** — usercmd 采样与发送节奏（`cl_cmdrate`），是输入采样频率如何与模拟 tick 解耦的原始实现。[链接](https://github.com/id-Software/Quake-III-Arena/blob/master/code/client/cl_input.c)
- **Quake III `cl_parse.c`** — `CL_ParseSnapshot` 读取 serverTime 和快照，是插值时间基准与延迟计算的来源。[链接](https://github.com/id-Software/Quake-III-Arena/blob/master/code/client/cl_parse.c)
- **Quake III `cg_view.c`** — `CG_CalcViewValues` 用 `cg_errorDecay` 把预测误差单独衰减到视角，展示“玩家位置”与“相机呈现”两套写者的分离。[链接](https://github.com/id-Software/Quake-III-Arena/blob/master/code/cgame/cg_view.c)
- **Valve SDK 2013 `gamemovement.cpp`** — Source 的 friction／accelerate 一手实现；`feel.md` 引用它作为 Source 摩擦／加速模型的一手实现，但 `feel.md` 明确参数为本作原创调参，不是 Valve 参数或 CS2 当前实现。只读参考，不改摩擦。[链接](https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/shared/gamemovement.cpp)
- **Valve SDK 2013 `prediction.cpp`** — `CPrediction::RunCommand／RunSimulation／PerformPrediction` 保存并重放 usercmd，是 Source 预测-修正循环的核心实现。[链接](https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/client/prediction.cpp)
- **Valve SDK 2013 `player.cpp`** — `CBasePlayer::PhysicsSimulate` 与 `PlayerRunCommand` 决定服务器如何消费 usercmd，且含“暂停时是否处理 usercmd”的 TODO 注释。[链接](https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/server/player.cpp)
- **Valve SDK 2013 `usercmd.cpp`** — `CUserCmd` 的 `tick_count`／`random_seed` 与增量读写契约，定义客户端每个 tick 提交的输入格式。[链接](https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/shared/usercmd.cpp)

**Godot 引擎实现与提案**

- **Godot PR #92391：Physics interpolation（3D）** — 3D 插值实现 PR 的评审记录：评论指出旋转每 tick 超过 180° 时插值会走错方向、tick 计数与 reset 的边界，以及默认是否开启的争论。[链接](https://github.com/godotengine/godot/pull/92391)
- **Godot PR #30226：暴露 interpolation fraction** — 先暴露插值 alpha 的最小改动，是插件／模块方案和后续内置实现的接口基础。[链接](https://github.com/godotengine/godot/pull/30226)
- **Godot PR #52846：Fixed Timestep Interpolation (3D) 3.x** — 3.x 的 3D 固定步长插值实现，讨论里明确相机等对象需要手动处理。[链接](https://github.com/godotengine/godot/pull/52846)
- **Godot PR #104269：2D／3D 插值设计说明** — 官方文档链接的设计 rationale，解释服务器侧与场景侧插值为何不同。[链接](https://github.com/godotengine/godot/pull/104269)
- **Godot PR #30798：semi-fixed timestep 实现草案** — 反方案的完整实现草案，含 `time_scale` 不改物理 tick 的设计与作者对 fixed+interpolation 更适合生产游戏的说明。[链接](https://github.com/godotengine/godot/pull/30798)
- **Godot PR #88424：2D physics interpolation** — 2D 插值落地实现，默认关闭，`_draw`／Parallax／低层服务器创建的对象需手动退出或自行插值。[链接](https://github.com/godotengine/godot/pull/88424)
- **Godot PR #111057：修复 `sync_to_physics` 下物理体 reset** — 修复 AnimatableBody2D 在 `sync_to_physics` 下 `reset_physics_interpolation` 不生效，正是重生／传送后又插回旧位置的当前上游缺陷与修法。[链接](https://github.com/godotengine/godot/pull/111057)
- **Godot PR #110987：SkeletonModifier 改用插值后全局变换** — 把修饰器取全局变换从 `get_global_transform()` 改为 `get_global_transform_interpolated()` 以修 #110975 的抖动。[链接](https://github.com/godotengine/godot/pull/110987)
- **Godot PR #103639：SkeletonModifier3D 手动 `advance()`** — 给骨骼修改器加手动推进入口，可把弹簧骨骼模拟降到独立频率。[链接](https://github.com/godotengine/godot/pull/103639)
- **Godot PR #125137：SpringBoneCollision 用插值后全局变换** — 延续 #110987 的同类修复，处理弹簧骨骼碰撞体的插值变换。[链接](https://github.com/godotengine/godot/pull/125137)
- **Godot PR #63773：Camera2D smoothing clamp 修复候选** — #49747 关联的开放 PR，内容是给 Camera2D 平滑系数加 clamp，可作为插值下相机平滑的最小修复参照。[链接](https://github.com/godotengine/godot/pull/63773)
- **godot-demo-projects PR #1223：Add 3D physics interpolation demo** — Godot 官方 3D 物理插值 demo（含 FPS 场景），可用于复现 tick 与渲染错位、传送清历史的行为。[链接](https://github.com/godotengine/godot-demo-projects/pull/1223)
- **Godot proposal #671：内置物理插值** — 社区推动内置物理插值的提案，记录了核心团队对“该不该进引擎”的反对意见。[链接](https://github.com/godotengine/godot-proposals/issues/671)
- **Godot proposal #236：semi-fixed timestep／manual stepping** — 引擎社区对“固定步长 + 插值”与“半固定步长（Unreal 默认）”的正面比较，讨论输入响应、抖动和初学者成本，是本卡方法选型的重要反方。[链接](https://github.com/godotengine/godot-proposals/issues/236)
- **Godot proposal #1828：0-frame delay 同步物理到渲染 transform** — 标题即主张把物理到渲染的同步从 1 帧延迟改成 0 帧，正好对应插值带来的呈现滞后争议；本轮仅核了标题与状态。[链接](https://github.com/godotengine/godot-proposals/issues/1828)
- **Godot proposal #2753：3D 物理步插值** — 说明 2D 自 4.3 已插值、3D 到 4.4 才补齐的版本差异和缺失原因。[链接](https://github.com/godotengine/godot-proposals/issues/2753)
- **Godot proposal #10015：每帧执行一次物理阶段逻辑** — 围绕 `_physics_process` 每帧 0／1／N 次造成的更新不均展开，是输入消费频率与固定步长折中的直接争论。[链接](https://github.com/godotengine/godot-proposals/issues/10015)
- **Godot proposal #7280：网络属性预测／插值接管** — 指出 MultiplayerSynchronizer 直接覆写位置导致无法自定义插值与预测，讨论用 `set_interpolate_method` 或快照缓冲接管。[链接](https://github.com/godotengine/godot-proposals/issues/7280)
- **Godot proposal #10770：是否给骨骼动画再加一层插值** — 反方论据：lawnjelly 认为每帧跑动画比叠加第二层插值更简单准确，并称 root motion 依赖物理 tick 很可能是 bug。[链接](https://github.com/godotengine/godot-proposals/issues/10770)
- **Godot proposal #11904：Skeleton3D／Modifier 手动 `advance()`** — 要求动画与骨架修饰器可按自己的累计时间手动推进，是“动画帧率、物理 tick、渲染帧率三速率分离”的官方接口诉求，已在 4.5 落地。[链接](https://github.com/godotengine/godot-proposals/issues/11904)
- **Godot proposal #2821：manual physics stepping** — 现行手动物理步进提案，列出查询刷新、碰撞信号不可回滚等阻塞，说明想自行做回滚／重放时引擎侧缺什么。[链接](https://github.com/godotengine/godot-proposals/issues/2821)
- **Godot issue #24769：manual stepping vs frame-locked physics** — 手动步进与锁帧两种输入采样频率的讨论，覆盖高刷屏平滑、同帧碰撞检测与插值的取舍。[链接](https://github.com/godotengine/godot/issues/24769)
- **lawnjelly/godot-smooth** — 官方合入前的 C++ 插值模块，保留 reset、相机与物理同步的原始实现与说明。[链接](https://github.com/lawnjelly/godot-smooth)
- **Calinou/godot-physics-interpolation-demo** — issue #30068 中链接的复现 demo，可对照 jitter 和传送表现。[链接](https://github.com/Calinou/godot-physics-interpolation-demo)
- **godot-jolt determinism 说明** — 物理引擎确定性说明，决定固定步长重放能否一致。[链接](https://github.com/godot-jolt/godot-jolt#what-about-determinism)
- **jrimclean/godot-state-sync-demo** — 给定快照插值 demo 作者的新作，明确改推 state synchronization 而非 snapshot interpolation，是同一作者对旧方案的反对／替代。[链接](https://github.com/jrimclean/godot-state-sync-demo)

**Bevy 实现与调度**

- **Bevy 官方 `physics_in_fixed_timestep.rs`（v0.16）** — 官方代码完整演示输入累积、PhysicalTranslation 与呈现用 Transform 分离、按 overstep 插值。[链接](https://github.com/bevyengine/bevy/blob/v0.16.0/examples/movement/physics_in_fixed_timestep.rs)
- **Bevy 官方 `physics_in_fixed_timestep.rs`（latest）** — 同一示例的 latest 入口，便于对照当前 API。[链接](https://github.com/bevyengine/bevy/blob/latest/examples/movement/physics_in_fixed_timestep.rs)
- **Bevy PR #14223：frame-rate independent movement 示例** — 把输入累积、FixedUpdate 推进和可视 Transform 插值写成官方示例，并对比朴素 delta-time 写法。[链接](https://github.com/bevyengine/bevy/pull/14223)
- **Bevy issue #13773：通用 gameplay transform 插值计划** — 记录 Bevy 上游对插值 trait／插件的规划以及被否掉的专用 transform 类型方案，解释为何最终没有内建统一解。[链接](https://github.com/bevyengine/bevy/issues/13773)
- **bevy_rapier：固定步长配置（固定 SHA）** — 第三方物理插件如何把模拟挂到固定步长，迁移时要确认驱动方式。[链接](https://github.com/dimforge/bevy_rapier/blob/577ecb15923a3d954885ff9d0ed8e5c3ecbe46ef/src/plugin/configuration.rs#L58-L66)
- **aevryrie/big_space** — 大世界坐标插件，插值与网格切换／传送冲突的实际案例。[链接](https://github.com/aevyrie/big_space)
- **Avian issue #444：Transform 插值需求** — Avian 加插值前的需求 issue，含 opt-in、性能和默认值的争论。[链接](https://github.com/avianphysics/avian/issues/444)

**Rollback／锁步／确定性实现**

- **0xFA11/MultiplayerNetworkingResources** — 8.7k star 的网络编程总表，覆盖 prediction／rollback／interpolation，是头部 awesome 资源。[链接](https://github.com/0xFA11/MultiplayerNetworkingResources)
- **ThusSpokeNomad/GameNetworkingResources** — 另一份持续维护的网络编程资源列表，含预测、插值与时钟分类。[链接](https://github.com/ThusSpokeNomad/GameNetworkingResources)
- **pond3r/ggpo** — GGPO 原始 rollback SDK；它是输入重演与呈现分离的基线实现。[链接](https://github.com/pond3r/ggpo)
- **gschup/ggrs** — GGPO 的 Rust 重实现，GekkoNet 与 backroll-rs 均以它为参照，提供 input delay／rollback／spectator 的完整实现。[链接](https://github.com/gschup/ggrs)
- **rameshvarun/netplayjs** — 576 star 的浏览器 P2P rollback，可对照网页 FPS 的输入重演与呈现。[链接](https://github.com/rameshvarun/netplayjs)
- **HouraiTeahouse/backroll-rs** — 369 star 的 Rust GGPO 风格 rollback 实现。[链接](https://github.com/HouraiTeahouse/backroll-rs)
- **Delta3-Studio/Backdash** — C# rollback SDK，2026-11 仍活跃，与 Unity／C# 栈直接相关。[链接](https://github.com/Delta3-Studio/Backdash)
- **lucasteles/Backdash** — C# rollback SDK，明确以 GGPO 为蓝本，可对照输入预测与状态回滚接口。[链接](https://github.com/lucasteles/Backdash)
- **HeatXD/GekkoNet** — P2P rollback SDK，2026-11 仍活跃。[链接](https://github.com/HeatXD/GekkoNet)
- **genxium/DelayNoMore** — delayed-input rollback 演示，把输入采样与回滚时序分开，对应输入采样／消费频率。[链接](https://github.com/genxium/DelayNoMore)
- **ErnWong/crystalorb** — 234 star 的 rollback netcode 库。[链接](https://github.com/ErnWong/crystalorb)
- **foxssake/netfox** — 1.1k star 的 Godot rollback 插件，跨引擎对照固定 tick 与呈现。[链接](https://github.com/foxssake/netfox)
- **Snopek's Godot Rollback Netcode（GitLab）** — Godot 的 rollback+prediction addon，被 Game-Networking-Resources 收录；本轮 429，README 未读。[链接](https://gitlab.com/snopek-games/godot-rollback-netcode)
- **Godot Asset Library 2450（dsnopek rollback）** — Godot 社区路线上的另一个 rollback 实现，用于对照引擎外挂方案。[链接](https://godotengine.org/asset-library/asset/2450)
- **BestoNet** — 《Idol Showdown》的 Unity／C# 回滚实现，可对照 Unity 物理与呈现的耦合点。[链接](https://github.com/BestoGames/BestoNet)
- **proepkes/UnityLockstep** — Unity 确定性 lockstep 加客户端预测／回滚的完整示例。[链接](https://github.com/proepkes/UnityLockstep)
- **thatjoaoguy/unity-fastpacedmultiplayer** — Unity 上的权威服务器加预测／校正／实体插值框架，接近本卡的端到端链路。[链接](https://github.com/thatjoaoguy/unity-fastpacedmultiplayer)
- **Kimbatt/unity-deterministic-physics** — 556 star，用 soft float 在 Unity DOTS 做跨平台确定性物理，对应同输入 30／60／120 Hz 的确定性前提。[链接](https://github.com/Kimbatt/unity-deterministic-physics)
- **Kimbatt/soft-float-starter-pack** — unity-deterministic-physics 使用的软浮点实现，是跨平台确定性的底层依赖。[链接](https://github.com/Kimbatt/soft-float-starter-pack)
- **xpTURN/Klotho** — Unity+Godot 的确定性 CSP／rollback 框架，2026-10 仍活跃，含 verified／predicted 两条时间线。[链接](https://github.com/xpTURN/Klotho)
- **Klotho — View Interpolation Guide** — 把固定 tick 仿真、60／120／144 Hz 显示、InterpolationDelayTicks、TeleportTick 清历史与错误修正写成可执行规则。[链接](https://github.com/xpTURN/Klotho/blob/main/Docs/ViewInterpolation.md)
- **trecs/trecs** — Unity ECS 框架，内置确定性模拟与输入录制／回放，可对照暂停／重生清历史。[链接](https://github.com/trecs/trecs)
- **devlinzhou/deterministic_physics** — 3D 帧同步确定性物理引擎，直接服务同输入一致性。[链接](https://github.com/devlinzhou/deterministic_physics)
- **JiepengTan/Lockstep.Math** — 帧同步定点数学库，补足浮点轨迹不可逐位复现时的替代路径。[链接](https://github.com/JiepengTan/Lockstep.Math)
- **JiepengTan/LockstepEngine** — Lockstep.Math 所属的完整 lockstep 框架（确定性碰撞／寻路／行为树），补足单看数学库看不到的 tick 与回滚编排。[链接](https://github.com/JiepengTan/LockstepEngine)
- **JiepengTan/Lockstep-Tutorial** — LockstepEngine 的配套教程工程，展示确定性帧循环的组织方式。[链接](https://github.com/JiepengTan/Lockstep-Tutorial)
- **JiepengTan/LockstepMath** — 确定性数学库，是固定步长位置计算的可移植参考。[链接](https://github.com/JiepengTan/LockstepMath)
- **JiepengTan/LockstepCollision** — 确定性碰撞库，补充 LockstepEngine 的物理侧实现。[链接](https://github.com/JiepengTan/LockstepCollision)
- **ForgottenHistory/Archon-Engine** — Unity 上的确定性大战略模拟引擎，可作为固定步长／确定性的工程化对照。[链接](https://github.com/ForgottenHistory/Archon-Engine)
- **Archon Engine — Architecture Overview** — 明确写出确定性 CPU 仿真 + GPU 呈现双层、定点数与分层 tick，是呈现／仿真分离的工程化表述。[链接](https://github.com/ForgottenHistory/Archon-Engine/blob/master/Docs/Engine/ARCHITECTURE_OVERVIEW.md)
- **gregorik/Rollback-Core** — 2026-09 的新 UE5 插件，固定步长模拟 + `UPROPERTY(SaveGame)` 状态快照，从 tick 调 `AdvanceFrame()`、迟到输入时 `RollbackToFrame(N)` 重演。[链接](https://github.com/gregorik/Rollback-Core)
- **mas-bandwidth/netcode** — Glenn Fiedler 的安全 UDP 连接库，常与固定 tick 客户端-服务器配合。[链接](https://github.com/mas-bandwidth/netcode)
- **Unity Netcode for GameObjects 仓库** — 官方 GameObject 网络栈，提供 NetworkTransform 插值／权威位置的基线行为。[链接](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects)

**网络平滑、快照与官方样例**

- **SnapNet：Netcode Architectures Part 3 — Snapshot Interpolation** — 快照插值把远端呈现位置与权威模拟分开，直接对应本卡“呈现对象与物理对象分离”。[链接](https://www.snapnet.dev/blog/netcode-architectures-part-3-snapshot-interpolation/)
- **SnapNet：Netcode Architectures Part 1 — Lockstep** — 同系列前一篇，定义 lockstep 的输入采样／消费与固定 tick。[链接](https://www.snapnet.dev/blog/netcode-architectures-part-1-lockstep/)
- **SnapNet：Netcode Architectures Part 2 — Rollback** — 同系列讲 rollback 的预测与重仿真，补足 Part 3 快照插值之外的替代架构。[链接](https://www.snapnet.dev/blog/netcode-architectures-part-2-rollback/)
- **SnapNet：Performing Lag Compensation in Unreal Engine 5** — 同作者的 UE5 延迟补偿实操，展示服务器回退与呈现位置分离的工程落地。[链接](https://www.snapnet.dev/blog/performing-lag-compensation-in-unreal-engine-5/)
- **SnapNet：Netcode Architectures Part 4 — Tribes** — 另一种以输入重放为中心的架构，作为快照插值之外的对照。[链接](https://www.snapnet.dev/blog/netcode-architectures-part-4-tribes/)
- **Lightyear Book：Interpolation** — 只插值显式注册的组件、采样落后于权威时间线，拥有者客户端改走 Predicted，明确谁插值与谁预测。[链接](https://cbournhonesque.github.io/lightyear/book/concepts/advanced_replication/interpolation.html)
- **Lightyear Book：Prediction** — 不匹配时恢复到已确认状态并重放 tick，是暂停／重生／纠偏时清历史再重放的完整回滚协议。[链接](https://cbournhonesque.github.io/lightyear/book/concepts/advanced_replication/prediction.html)
- **Lightyear Book：Client time sync** — Local／Remote timeline 的整 tick 校正与系统门控，说明呈现采样点如何跟随权威时钟而不改模拟。[链接](https://cbournhonesque.github.io/lightyear/book/concepts/bevy_integration/client/time_sync.html)
- **Lightyear Book：Avian Physics** — 明确“为渲染写入的 pose 不能作为下一个固定物理步的种子”，并给出 Restore→固定 tick→PostUpdate 插值→再写 Transform 的顺序。[链接](https://cbournhonesque.github.io/lightyear/book/concepts/advanced_replication/avian.html)
- **OculusVR/oculus-networked-physics-sample** — 上述 Networked Physics in VR 文章的官方 Unity 示例源码，可核对权威转移、状态压缩和插值的实际实现。[链接](https://github.com/OculusVR/oculus-networked-physics-sample)
- **empyreanx/godot-snapshot-interpolation-demo** — Godot 快照插值 + UDP 的最小 demo，可直接对照呈现位置缓冲。[链接](https://github.com/empyreanx/godot-snapshot-interpolation-demo)
- **Rybiscom/multiplayer_transform_synchronizer** — 替代 MultiplayerSynchronizer 的变换插值脚本，直接处理位置／旋转／缩放平滑。[链接](https://github.com/Rybiscom/multiplayer_transform_synchronizer)
- **mpeterson2/CMCTest** — Epic 论坛串作者给出的复现仓库，含 MoveAutonomous 调用顺序与把 Launch 移进 OnMovementUpdated 的两次修复 commit。[链接](https://github.com/mpeterson2/CMCTest)
- **gportelli/UEPhysicsExample** — 可运行的弹簧例子，展示不 substepping 时低帧率下数值爆炸，支撑固定步长与最大步长的移植断言。[链接](https://github.com/gportelli/UEPhysicsExample)
- **Unity FPS Sample** — Unity 官方完整 FPS 示例源码（ECS + 新传输层），含预测玩家状态分层（2018.3 已停更）。[链接](https://github.com/Unity-Technologies/FPSSample)
- **Unity FPS Sample 的 Animation.md** — 说明 replication／rollback／prediction 约束迫使项目自建 Playable Graph，是多人 FPS 中动画位移所有权的一手实现说明。[链接](https://github.com/Unity-Technologies/FPSSample/blob/master/Documentation/Animation.md)
- **Jolt Physics PR #2136：clamp warm start ratio** — 针对变步长的 warm-start 比值 clamp，说明即使必须变步长也要限制相邻步长比。[链接](https://github.com/jrouwe/JoltPhysics/pull/2136)
- **Mirror PR #2791：Snapshot Interpolation 测试进展** — 演示该实现如何处理延迟、丢包与乱序，补足文档页的测试证据。[链接](https://github.com/vis2k/Mirror/pull/2791)
- **CodersBlock：Unity Physics and Client-Side Prediction** — Unity PhysX 上的客户端预测与和解 demo + 文章，展示物理对象与呈现对象分离的具体代码结构。[链接](http://www.codersblock.org/blog/client-side-prediction-in-unity-2018)
- **Joe Best-Rotheray：Client-Side Prediction With Physics In Unity** — Unity 物理角色客户端预测的实操 demo，包含重放与位置校正。[链接](https://codersblock.org/posts/unity-client-side-prediction/)
- **ClientSmoothingDemo** — 2026-10 的 Unity 小 demo，同一场景对比插值、dead reckoning、Kalman、reconciliation 等客户端平滑方式；规模小，非生产验证。[链接](https://github.com/CellPot/ClientSmoothingDemo)
- **unity-server-authoritative-netcode** — 2026-11 新建的 Unity 原型，自述覆盖预测、校正与插值；star 很少，只能当结构示例。[链接](https://github.com/PLandaA/unity-server-authoritative-netcode)

### S3 真实使用中的问题与反馈（症状、根因、修法）

**Unity Discussions：Rigidbody／Transform 权威**

- **Different approaches for MovePosition in 3D and 2D physics engines** — Unity 物理开发者 MelvMay 明确：Rigidbody 的 pose 才是权威，Transform 只是插值／外推的呈现副本；把 `transform.position` 再喂给 `MovePosition` 是错的。[链接](https://discussions.unity.com/t/different-approaches-for-moveposition-in-3d-and-2d-physics-engines/1711066)
- **How expensive is Physics.SyncTransforms()** — MelvMay 原话：永远不要改 Transform 来改物理姿态，物理步结束时是 Rigidbody 写 Transform。[链接](https://discussions.unity.com/t/how-expensive-is-physics-synctransforms/901264)
- **Move dynamic Rigidbody by setting transform.position** — 解释直接改 Transform 等于瞬移、绕过碰撞／摩擦／求解器且不更新速度。[链接](https://discussions.unity.com/t/move-dynamic-non-kinematic-rigidbody-by-setting-transform-position/900132)
- **Player Teleport not working (It flashes back)** — 重生／传送后闪回旧位置的实战帖；结论是 Rigidbody 要改 `rb.position`，CharacterController 要 disable→改位置→enable。[链接](https://discussions.unity.com/t/player-teleport-not-working-it-flashes-back/1730037)
- **Interpolation still occurs when directly setting position/rotation of a kinematic Rigidbody** — 直接设 kinematic Rigidbody 后视觉仍从旧位置插值；Unity 员工解释插值只作用于渲染 Transform，临时关插值再设位置可行，2022.1.15 修过又在 6.0.23 复现。[链接](https://discussions.unity.com/t/interpolation-still-occurs-when-directly-setting-position-rotation-of-a-kinematic-rigidbody/893467)
- **Confused about Rigidbody2D and Transform Operation Limitations** — SetActive／改父级与设置 `Rigidbody2D.position` 同帧会把位置打回，是“清历史顺序错误”的真实边界案例。[链接](https://discussions.unity.com/t/confused-about-rigidbody2d-and-transform-operation-limitations/1542590)
- **Really confused about how to set the position of a Rigidbody2D instantly** — 回复明确瞬移应在 FixedUpdate 设 `Rigidbody2D.position`，且不能同帧改父级。[链接](https://discussions.unity.com/t/really-confused-about-how-to-set-the-position-of-a-rigidbody2d-instantly/1539541)

**Unity Discussions：Root Motion 与 CharacterController**

- **Issues using RootMotion and OnAnimatorMove** — 用 OnAnimatorMove 把 root motion 交给 CharacterController 后角色在动画结束回到初始位置；回帖指出 NavMeshAgent 要同步 `nextPosition`，属于两套位移系统冲突。[链接](https://discussions.unity.com/t/issues-using-rootmotion-and-onanimatormove/1705741)
- **Root Motion animation finishes then slides character back to origin** — bake XZ 与 root motion 开关的取舍导致“滚完滑回原点”。[链接](https://discussions.unity.com/t/root-motion-animation-finishes-then-slides-character-back-to-origin-of-movement/884406)
- **Is it possible to use root motion on concrete animations only?** — 展示如何在部分动作临时把位移权交给 OnAnimatorMove、其余时间保留代码 motor；这种切换最容易写出第二个写者。[链接](https://discussions.unity.com/t/is-it-possible-to-use-root-motion-on-concrete-animations-only/855594)
- **root motion + CharacterController blocked by a wall** — root motion 继续播放前进动画但 CharacterController 被墙挡住，说明动画位移与碰撞权威必须明确谁最终落位。[链接](https://discussions.unity.com/t/how-can-i-stop-player-movement-animation-in-a-specific-direction-when-blocked-by-a-wall-using-root-motion-charactercontroller/1657966)
- **Character Controller object stutters/jitters in place when applying animation in Animator** — 动画与 CharacterController 同时写一个对象导致原地抖；CodeSmile 指出 CC 按 50 Hz 物理步走、直接控制的角色不建议用 root motion。[链接](https://discussions.unity.com/t/character-controller-object-stutters-jitters-in-place-when-applying-animation-in-animator/1709831/2)

**Unity Discussions：相机与抖动**

- **Camera Jitter on its own but worse with movement** — FPS 相机跟随 Rigidbody 移动时的抖动排查，涉及插值、相机更新顺序和物理／渲染不同频。[链接](https://discussions.unity.com/t/camera-jitter-on-its-own-but-worse-with-movement/1721309)
- **Jittery movement, using interpolate only adds more problems** — 开 Interpolate 反而更抖，提醒插值不是无条件修复，背景滚动或多写者会放大问题。[链接](https://discussions.unity.com/t/jittery-movement-game-objects-and-using-interpolate-only-adds-more-problems/943548)
- **联机飞机游戏 jitter** — 远端对象必须开插值、物理更新与渲染频率不同会抖，是“模拟与呈现分离”在联网场景的社区经验。[链接](https://discussions.unity.com/t/i-am-trying-to-develop-online-aircraft-fight-game-with-unity-and-photon-fusion-there-ise-jitter-problem-on-my-game-and-i-couldnt-fix-it-thank-you/1723950)

**ECM2／Standard Assets／Animancer 支持帖**

- **ECM2：30／60／120 FPS 根运动抖动（维护者逐帧解释）** — 维护者根据用户 KBapua 报告的 30 与 60／120 FPS 观察解释：Animator Normal 模式下 root motion 每渲染帧采样、物理按 50 Hz 消费，某些物理步拿到 1 帧、某些步拿到 2 帧；随后给出 AnimatePhysics、平滑速率、半固定步三种修法。[链接](https://discussions.unity.com/t/released-easy-character-movement-2/839721/1475)
- **ECM2：把 Simulate 切片放进 LateUpdate 消除抖动** — 用户实测把 Simulate 按 `fixedDeltaTime` 切片放进 LateUpdate 后抖动全部消失；维护者确认这使动画与模拟 1:1 同步，但代价是模拟跟渲染帧绑定。[链接](https://discussions.unity.com/t/released-easy-character-movement-2/839721/1476)
- **ECM2：暂停时 AddForce 累积、恢复瞬间角色弹出** — 维护者确认暂停时 `Move()` 不再调用，AddForce 的 pending 力会持续累积；建议暂停时 `ClearAccumulatedForces`。[链接](https://discussions.unity.com/t/released-easy-character-movement-2/839721/1470)
- **Standard Assets 第三人称：固定步长 0.2 的插值验收法** — PhilSA 给出可操作验收法：把 Fixed Timestep 调到 0.2，角色仍应平滑移动；并指出仅开 Rigidbody 插值救不了非 MovePosition 驱动的角色。[链接](https://discussions.unity.com/t/new-standard-asset-characters-third-person/698155/241)
- **Standard Assets：改 Animator 更新模式后角色平滑、移动平台却不平滑** — 用户实测把 Animator 改 Normal／Unscaled 后角色平滑了，但移动平台变得不平滑；停在“能否同时要固定更新动画和平滑视觉”。[链接](https://discussions.unity.com/t/new-standard-asset-characters-third-person/698155/247)
- **Root Motion + Rigidbody 抖动（Unity 5.5 可复现工程）** — 用户提供有／无 Rigidbody 两个角色并排的可复现工程，开 Animate Physics 仍抖；回帖只重复“改 AnimatePhysics”，说明常见修法不总成立。[链接](https://discussions.unity.com/t/root-motion-with-rigidbody-jitter-unity-5-5/180471)
- **AnimatePhysics 下动画平滑：固定 tick 必须与渲染帧完全一致** — fixed tick 与渲染帧稍有偏差就抖动／卡顿、掉帧极不耐受；最终把 root motion 转成速度交给 Rigidbody 才平滑。[链接](https://discussions.unity.com/t/smooth-character-animation-when-using-root-motion-and-animatephysics/606034)
- **Animancer：固定步应用 root motion 的迁移成本** — 开发者自建 FixedUpdate 运动控制器，在 OnAnimatorMove 累积 root motion 后于固定步应用，帧率波动时位移对不上；改 AnimatePhysics 修好位移却让动画抖，随后自写插值又遇 Evaluate 多次触发事件。[链接](https://discussions.unity.com/t/animancer-less-animator-controller-more-animator-control/717489/2576)
- **Motion Interpolation Solution：插值器只适用于 FixedUpdate 移动的 Transform，且带一帧延迟** — 帖中使用者（#36）指出该插值器按最近两次位置插值而非外推，天生带一固定帧延迟（默认物理率下约 1/50 s）；另一使用者（#37）报告 root motion 走 OnAnimatorMove 时它不适用。作者（#38）确认它只适用于在 FixedUpdate 中移动的 Transform，其他用法语义不对。[链接](https://discussions.unity.com/t/motion-interpolation-solution-to-eliminate-fixedupdate-stutter/891926/37)
- **Motion Interpolation Solution（主帖）** — 社区自建固定步加插值的完整讨论，是 Stable FixedUpdate Scheduler 帖的前作。[链接](https://discussions.unity.com/t/motion-interpolation-solution-to-eliminate-fixedupdate-stutter/891926)
- **Stable FixedUpdate Scheduler with Motion Interpolation** — 分析不稳定 FixedUpdate 序列、输入响应方差与稳定调度做法。[链接](https://discussions.unity.com/t/stable-fixedupdate-scheduler-with-motion-interpolation/940117)

**KCC／CCP／Motion Matching 商业资产支持帖**

- **KCC：插值走直线，跟不上旋转平台** — 作者用俯视视频展示插值角色在两个固定步之间走直线，站在大旋转平台边缘会偏离；关插值又退化成阶梯运动。[链接](https://discussions.unity.com/t/released-kinematic-character-controller/678434/951)
- **KCC 用户：root motion + Cinemachine Freelook 抖动，调插值／更新类型无效** — 付费资产用户在官方 root motion 示例中加 Cinemachine Freelook 后严重抖动，试过插值和不同更新类型都无效。[链接](https://discussions.unity.com/t/released-kinematic-character-controller/678434/1657)
- **Character Controller Pro：30 fps 下 Interpolator 造成大幅抖动，根因是刚体／Transform 位置冲突** — 1.3 在 30 fps 移动端出现大幅抖动而 1.2 正常，定位到新增 Interpolator；作者确认是固定步与渲染步比例、Rigidbody 与 Transform 位置冲突。[链接](https://discussions.unity.com/t/character-controller-pro/772610/243)
- **Character Controller Pro：直接设置位置被拖回，需禁用再启用组件** — 换关直接设置角色位置会被拖回，必须禁用 CharacterActor／PhysicsActor 再启用。[链接](https://discussions.unity.com/t/character-controller-pro/772610/256)
- **Motion Matching for Unity 插件：root motion 可选，控制器驱动要自己处理滑步** — 插件作者明确支持不用 root motion 的胶囊控制、动画只做表现，但脚滑要项目自己解决。[链接](https://discussions.unity.com/t/released-motion-matching-for-unity-advanced-character-animation/744955/51)

**Unity Netcode 与网络框架问题**

- **Unity Netcode 开发日志：Prediction in GameObject Netcode（2026-05-14）** — 服务端固定 tick，客户端一帧内从最新快照 tick 重放到预测 tick，并讨论 rollback 历史缓冲。[链接](https://discussions.unity.com/t/prediction-in-gameobject-netcode-devlog-entry-4/1719927)
- **Unity Netcode #3204：复活后远端客户端先在死亡点显示一帧** — 复活流程禁用角色、改出生点、再启用，带 NetworkTransform 插值时非 owner 客户端先在死亡点显示一帧再插到出生点；官方建议 despawn／respawn 或 SetState 传送。[链接](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/issues/3204)
- **Unity Netcode #2765：kinematic Rigidbody 插值 + Teleport 回弹** — 远端 RPC 中销毁 Rigidbody、改父级并 Teleport 后位置回弹；官方解释 Rigidbody 插值与 NetworkTransform 插值不应同开、RPC 在 EarlyUpdate 处理早于 FixedUpdate。[链接](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/issues/2765)
- **Unity Netcode #3198：ServerTime 驱动的运动先平滑后回跳** — 按 ServerTime 驱动的物体在编辑器客户端周期性回跳，最终归因于编辑器／独占全屏性能抖动，提醒 tick 时间源本身会污染呈现。[链接](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/issues/3198)
- **Unity Netcode #2842：服务器重挂父级把旧位置写回 owner** — 重挂父级时 ParentSyncMessage 把服务器侧旧 transform 写回 owner 客户端，造成“回到过去”的一帧。[链接](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/issues/2842)
- **FishNet #734：非拥有 NPC 在客户端失去插值、按 tick 跳动** — 4.3.5→4.3.8 升级后服务器控制 NPC 在客户端失去平滑、按 tick 跳动而主机正常；维护者确认 bug 并在 4.4.0 修。[链接](https://github.com/FirstGearGames/FishNet/issues/734)
- **FishNet Discussion #503：tick delta 算速率、frame delta 应用导致 owner 抖动** — 用户逐帧分析发现 PredictedObjectOwnerSmoother 用 TickDelta 算移动率却乘 `Time.deltaTime` 应用，匀速移动看起来一顿一顿。[链接](https://github.com/FirstGearGames/FishNet/discussions/503)

**Godot 插值缺陷与边界**

- **Godot #30068：Add built-in fixed timestep interpolation** — 引擎团队与贡献者讨论内建固定步长插值的三种方案、传送重置负担和“直接设 transform 容易漏 reset”的坑。[链接](https://github.com/godotengine/godot/issues/30068)
- **Godot #111040：reset_physics_interpolation 对 AnimatableBody2D 不生效** — 重置插值 API 在部分节点类型上并不可靠，说明“传送时清历史”不能只靠一句 reset 调用。[链接](https://github.com/godotengine/godot/issues/111040)
- **Godot #110979：Resetting physics interpolation causes 1-frame streaking（Godot 3，手写插值子节点）** — 重置后出现 1 帧拖影的真实 bug；报告对象是 Godot 3 中手动插值的子节点，不是 4.x 引擎内置插值，移植时按版本判断适用性。[链接](https://github.com/godotengine/godot/issues/110979)
- **Godot #96663：Reparenting RigidBody2D with interpolation causes ghosting** — 对象生命周期变化（重挂父节点）会把旧插值历史带出来产生 ghosting。[链接](https://github.com/godotengine/godot/issues/96663)
- **Godot #95869：Physics interpolation affects Camera2D smoothing at higher framerates** — 高刷新率下相机平滑表现改变，是“同输入 30／60／120 Hz 呈现不变量”未成立的社区证据。[链接](https://github.com/godotengine/godot/issues/95869)
- **Godot #72207：物理插值导致 VehicleWheel 子网格缩小（Godot 3.5.1）** — 车轮子网格随车速与物理 FPS 视觉缩小，物理 FPS 与刷新率不成整数比时抖动；说明插值不只改位置，也会改挂在物理体下的可视尺寸。[链接](https://github.com/godotengine/godot/issues/72207)
- **Godot #102142：FPS 低于物理 tick 时插值取值错误** — `get_global_transform_interpolated` 在渲染帧率低于物理 tick 时返回错误值，直接对应 30 Hz 呈现边界。[链接](https://github.com/godotengine/godot/issues/102142)
- **Godot #101665：暂停时反复触发 RESET 警告** — 暂停时隐藏节点被反复重置插值，是暂停／恢复清历史的实际坑。[链接](https://github.com/godotengine/godot/issues/101665)
- **Godot #110975：SpringBone 随 CharacterBody3D 物理插值严重抖动** — 4.5 用户报告角色移动开启物理插值时 SpringBone 严重抖动；改用插值全局变换后抖动消失但骨骼行为变成帧率相关，维护者称属规格而非 bug。[链接](https://github.com/godotengine/godot/issues/110975)
- **Godot #103229：SpringBone 行为随帧率变化** — 骨骼弹簧随 FPS 变化，切到 Physics 回调后不抖却失去插值，说明“统一 tick + 插值”无法自动覆盖所有子系统。[链接](https://github.com/godotengine/godot/issues/103229)
- **Godot #103025：骨架延迟更新应排在物理插值之后** — 要求 Skeleton 的 deferred update 发生在物理插值之后，属于“更新顺序决定呈现是否一致”的直接案例（仅由 PR 页确认标题与关联关系）。[链接](https://github.com/godotengine/godot/issues/103025)
- **Godot #94060：首次 `get_global_transform_interpolated` 残影** — 首次调用可能拉出残影，暴露插值历史首帧未初始化的问题。[链接](https://github.com/godotengine/godot/issues/94060)
- **Godot #116353：`_input` 转视角与物理插值抖动** — 开启物理插值后，在 `_input` 里转视角比在 `_physics_process` 里更抖。[链接](https://github.com/godotengine/godot/issues/116353)
- **Godot #71226：Camera2D 与 physics process 回调同步** — 相机呈现与物理回调的更新时序问题，属于呈现对象跟随物理对象的边界。[链接](https://github.com/godotengine/godot/issues/71226)
- **Godot #49747：Camera2D smoothing calculation appears incorrect** — Camera2D 平滑 getter 带副作用、平滑系数可超过 1 导致振荡，说明相机平滑与物理插值叠加时同一位置会被多次推进。[链接](https://github.com/godotengine/godot/issues/49747)
- **Phantom Camera issue #241：相机抖动** — 物理 tick 与 FPS 不匹配导致相机抖动，说明相机必须单独决定插值策略。[链接](https://github.com/ramokz/phantom-camera/issues/241)
- **Phantom Camera FAQ：抖动处理** — 官方 FAQ 直接给出物理体抖动时跟随视觉节点、DIY 插值和更新顺序的处置，与 issue #241 的结论互补。[链接](https://phantom-camera.dev/support/faq)
- **TranquilMarmot/phantom-camera-jitter-repro** — 最小复现工程，用来隔离相机抖动究竟来自引擎插值缺失还是控制器更新顺序。[链接](https://github.com/TranquilMarmot/phantom-camera-jitter-repro)

**其他引擎／框架的 issue 与讨论**

- **Bevy issue #1259：固定步长系统插值** — 社区要求为固定步长系统提供插值的原始 issue，含多轮方案与反对意见。[链接](https://github.com/bevyengine/bevy/issues/1259)
- **Jolt Discussion #2129：variable timestep 导致角色爆炸** — 维护者复现说明变步长会因 warm starting 冲量缩放让角色弹飞，明确“能固定步长就固定”。[链接](https://github.com/jrouwe/JoltPhysics/discussions/2129)
- **Godot #30068 评论区的替代实现线索** — lawnjelly 插件、Calinou demo、gamedev.net 文章都从这条 issue 的评论区出现，是“自建插值 vs 引擎内建”讨论的入口。[链接](https://github.com/godotengine/godot/issues/30068)
- **smoothing-addon #36：与 Godot 3.5 内置插值的差异** — 社区直接问 addon 与 Godot 3.5 内置物理插值的差异和是否共用，是判断“自建插值 vs 引擎内建”边界的现场讨论。[链接](https://github.com/lawnjelly/smoothing-addon/issues/36)

**论坛、问答与普通用户社区**

- **Epic 论坛：CMC 连续网络修正导致抖动和状态卡死** — 开发者用 `p.NetShowCorrections` 观察连续修正导致抖动和状态卡死，最终靠调整 MoveAutonomous 变量更新顺序与 Launch 调用位置缓解。[链接](https://forums.unrealengine.com/t/character-movement-component-networking-issues/2112209)
- **Epic 论坛：移动平台上的模拟代理抖动，关服务器侧网络平滑后解决** — 模拟代理在移动平台上抖动，开发者实测只在服务器侧对 simulated proxy 关网络平滑后解决。[链接](https://forums.unrealengine.com/t/players-jitters-on-moving-platform/551011)
- **Opsive UCC：暂停期间输入被缓存，恢复瞬间角色跳起、相机甩位** — `Time.timeScale=0` 暂停后恢复，暂停期间按下的输入立即执行导致角色跳起、相机甩位；官方建议禁用 locomotion handler 和输入组件。[链接](https://www.opsive.com/forum/index.php?threads/character-is-jumping-when-i-resume-game-from-pause-menu.7491/)
- **Opsive UCC：暂停中重生导致无限循环、NaN 位置或角色悬空** — 暂停时重生触发 AnimatorMonitor 无限循环、位置变 NaN；根因是角色时间尺度为 0 且 Scheduler 仍在跑。[链接](https://www.opsive.com/forum/index.php?threads/issue-with-pausing-game-and-respawning-characters-unity-hangs-freezes.3264/)
- **GameDev.tv：CharacterController 传送后先到新点一帧又弹回** — 换区加载后约 60% 概率角色先到出生点一帧再弹回默认位置；解决办法是禁用 CharacterController→设位置→再启用。[链接](https://community.gamedev.tv/t/player-snaps-back-after-loading-into-correct-place/200639)
- **A* Pathfinding 论坛：Teleport 与 CharacterController 冲突** — AIPath + CharacterController 时 Teleport 偶尔只在目标显示一瞬又回去；Unity 2021／2023 都有人遇到，说明不是单一资产 bug。[链接](https://forum.arongranberg.com/t/teleport-not-working-all-the-time/11039)
- **GameDev.SE：插值循环的传送残影与一帧延迟** — 提问者指出静止后传送会被插值成中间态残影；高票答说明通用做法是传送帧禁用插值，并量化最坏一逻辑帧延迟（50 Hz 下 20 ms）。[链接](https://gamedev.stackexchange.com/questions/147908/using-an-interpolated-game-loop-such-as-gaffers-final-game-loop-will-the-frame-be-rendered-out-of-sync)
- **StackOverflow：把 CharacterController 移动从 FixedUpdate 改回 Update 才“修好”** — 新手把移动和重力放在 FixedUpdate 导致相机平滑时角色抖，最后把移动改回 Update 才“修好”，是渲染帧取代固定步的反面案例。[链接](https://stackoverflow.com/questions/58008939)
- **Blizzard 论坛：Overwatch 高精度鼠标输入** — 输入以 1000 Hz 采样、但按模拟 tick 消费，并记录开火瞬间的瞄准位置。[链接](https://us.forums.blizzard.com/en/overwatch/t/new-feature-high-precision-mouse-input-gameplay-option/422094)
- **Blizzard 论坛：How Overwatch servers handle client mouse inputs** — 解释 62.5 Hz tick 下如何回退到上一 tick 之间的插值状态处理离散射击。[链接](https://us.forums.blizzard.com/en/overwatch/t/how-overwatch-servers-handle-client-mouse-inputs-and-why-you-should-enable-high-precision-mouse-input/436505)

**HN 讨论**

- **HN 讨论 — Fixed Timestep Without Interpolation** — 34 条评论比较插值、外推、提前模拟一 tick 和 rollback 的失败场景（碰撞、死亡误报、延迟），比原文更适合看取舍。[链接](https://news.ycombinator.com/item?id=41878220)
- **HN 讨论 — Fix Your Timestep** — 从业者指出 Unity／UE 默认 tick 并非固定步长，Update／FixedUpdate 混用会带来输入、相机和物理对象抖动，并给出 GTA／Halo 帧率物理的实例。[链接](https://news.ycombinator.com/item?id=23649406)

### S4 设计原文、演讲与系列文章（为什么这样分层）

**固定步长与游戏循环**

- **Gaffer On Games：Fix Your Timestep!** — 固定步长 + 累加器 + 插值的经典原文，解释可变 dt 的帧率依赖、spiral of death 和 alpha 的来源。[链接](https://gafferongames.com/post/fix_your_timestep/)
- **Gaffer On Games：Integration Basics** — 讲 dt 与积分顺序的前作，是固定步长里“位移由谁积出来”的基础契约。[链接](https://gafferongames.com/post/integration_basics/)
- **Gaffer On Games：Physics in 3D** — 三维积分／力章节，补足把 FPS motor 迁到固定步长时的速度、力与步进模型。[链接](https://gafferongames.com/post/physics_in_3d/)
- **Gaffer On Games：Spring Physics** — 弹簧／阻尼的参数化与稳定性基础，可作为呈现层平滑和不硬切校正的参照，但不要拿它替代模拟步。[链接](https://gafferongames.com/post/spring_physics/)
- **Robert Nystrom：Game Loop（Game Programming Patterns）** — 游戏循环模式章给出 lag 累加器与 `render(alpha)` 的代码级解释，和 Gaffer 互为对照。[链接](https://gameprogrammingpatterns.com/game-loop.html)
- **Robert Nystrom：Update Method** — 解释每对象 update 的顺序性与固定／可变步长契约，补足“谁先写位置”的更新顺序维度。[链接](https://gameprogrammingpatterns.com/update-method.html)
- **DeWiTTERS — Game Loop** — 五种游戏循环（含固定更新 + 渲染插值）的原始分类，被 gamedev SE 与 Game Programming Patterns 同时引用。[链接](https://dewitters.com/dewitters-gameloop/)
- **Isaac Sukin：A Detailed Explanation of JavaScript Game Loops and Timing** — Web 侧累加器循环、螺旋死亡上限与用剩余比例渲染插值的完整推导。[链接](http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing)
- **Jakub Tomsu — Fixed Timestep Without Interpolation** — 直接反对“固定步长必须插值”：把状态复制一份前推剩余时间再画，无额外一 tick 延迟，但要求状态可廉价复制且低 TPS 精度差，是本卡最重要的替代方案与反例。[链接](https://jakubtomsu.github.io/posts/fixed_timestep_without_interpolation/)
- **Jakub Tomsu — Input in fixed timestep** — 专门讨论固定 tick 下输入采样与消费频率，补上给定文章缺的输入侧约束。[链接](https://jakubtomsu.github.io/posts/input_in_fixed_timestep/)
- **pkh / ubitux — Fixing the iterative damping interpolation in video games** — 证明常见 `lerp(a,b,dt*rate)` 帧率相关且长帧会过冲，给出指数衰减公式；HN 127 分、53 条评论还补了 expm1、半衰期与固定步长的反驳。[链接](https://blog.pkh.me/p/41-fixing-the-iterative-damping-interpolation-in-video-games.html)
- **Marcos Pereira — On Frame Rate Independence** — 从微分方程推导帧率无关 lerp 的指数／半衰期形式，并承认运行时参数变化时仍不完美、建议固定步长。[链接](https://marcospereira.me/2023/11/15/frame-rate-independent-lerp/)
- **Freya Holmér — Lerp smoothing is broken（视频）** — 用可视化讲清 lerp 平滑对帧率的依赖，是给程序和美术解释“为什么不能每帧 lerp 固定比例”的 practitioner 材料；本轮只核了标题与作者，未看视频。[链接](https://www.youtube.com/watch?v=LSNQuFEDOyQ)
- **Jonathan Blow — Q&A: frame-rate-independence（视频）** — Braid 作者谈帧率无关的实际坑，属于早期一线经验；本轮只核了标题与作者，未看视频。[链接](https://www.youtube.com/watch?v=fdAOPHgW7qM)

**Unity 固定步长实操**

- **John Austin — Fix your (Unity) Timestep!** — 实测 Unity 双段时间步、重负载下 game time 变慢、FixedUpdate／Update 次序与插值边界，比手册更细的移植陷阱清单。[链接](https://johnaustin.io/articles/2019/fix-your-unity-timestep)
- **Víctor Ávila — Framerate independent physics in UE4** — Godot #236 评论引用的 Unreal 对照：半固定步长／子步进如何处理大帧，以及为何 `pos += velocity` 在变步长下失效。[链接](https://avilapa.github.io/post/framerate-independent-physics-in-ue4/)
- **AClockworkBerry — Unreal Engine Substepping** — 解释 Fixed／Smooth frame rate、Max Physics Delta、substepping 与 post-physics tick 的取舍，补足 UE 固定步长的实现细节。[链接](http://www.aclockworkberry.com/unreal-engine-substepping/)
- **KinematicSoup — Timesteps and Achieving Smooth Motion in Unity（两处路径）** — 系统讲 Unity 半固定步长的卡顿成因、插值修复与输入缓冲；2026 编者注补充 Rigidbody 插值、LateUpdate 等现成替代。[路径一](http://www.kinematicsoup.com/news/2016/8/9/rrypp5tkubynjwxhxjzd42s3o034o8)／[路径二](https://kinematicsoup.com/news/2016/8/9/rrypp5tkubynjwxhxjzd42s3o034o8)
- **KinematicSoup — Achieving Smooth Motion in Unity（博客）** — 明确 InterpolatedTransform 保存最近两次固定步快照、在 FixedUpdate 前恢复权威姿态、传送时调用 `ForgetPreviousTransforms()`，与“暂停／重生不插回旧位置”逐条对应。[链接](https://www.kinematicsoup.com/blog/timesteps-smooth-motion-unity)
- **zubspace — Smooth movement in Unity** — 对比 Update／FixedUpdate／Rigidbody 插值与手动 `Physics2D.Simulate`，并指出 Down 事件在 FixedUpdate 之间可能丢失或重复。[链接](https://www.zubspace.com/blog/smooth-movement-in-unity)
- **Bevy Cheatbook：Fixed Timestep** — 用 accumulator + 固定 tick + 插值参数演示同一输入在不同渲染帧率下推进相同模拟步，可对照 30／60／120 Hz 不变量。[链接](https://bevy-cheatbook.github.io/fundamentals/fixed-timestep.html)
- **Bevy Cheatbook：Smooth movement（插值／外推）** — 引擎无关的插值／外推做法与取舍，补充官方 fixed-timestep 示例。[链接](https://bevy-cheatbook.github.io/cookbook/smooth-movement.html)

**位移所有权与动画**

- **Daniel Holden — Code vs Data Driven Displacement** — 直接回答位移所有权：模拟对象是控制与碰撞的权威，动画角色允许临时偏离再用阻尼校正并限幅；是本卡“只有一个系统拥有位移”最强的设计原文。[链接](https://theorangeduck.com/page/code-vs-data-driven-displacement)
- **Daniel Holden — Spring-It-On: The Game Developer's Spring-Roll-Call** — 用半衰期参数化阻尼弹簧，给“呈现平滑”和“受限软校正”提供稳定公式；JLPM22 的 SpringCharacterController 正是这条路线。[链接](https://theorangeduck.com/page/spring-roll-call)
- **Daniel Holden — Learned Motion Matching** — 作者原文与论文入口，用 stepper／projector 压缩数据库，是 motion matching 当前主流替代路线。[链接](https://theorangeduck.com/page/learned-motion-matching)
- **Daniel Holden — Perfect Tracking Springs** — 完美跟踪弹簧在断点处跳过不可信目标，适合相机跟随和输入平滑，而不会在传送后拉出插值残影。[链接](https://theorangeduck.com/page/perfect-tracking-springs)
- **Daniel Holden — Propagating Velocities Through Animation Systems** — 指出传送、重置会让有限差分速度失真，主张把速度随动画管线传播，补 Root Motion 断点与重置后的速度契约。[链接](https://theorangeduck.com/page/propagating-velocities-through-animation-systems)
- **Daniel Holden — Inertial Easing** — 无固定时长的惯性化过渡，可用于重生／切换时避免把旧速度补回。[链接](https://theorangeduck.com/page/inertial-easing)
- **Daniel Holden — Dead Blending** — 用外推加混合消除动画跳变，和重生／传送时“不插回旧姿态”直接相关。[链接](https://theorangeduck.com/page/dead-blending)
- **Daniel Holden — Inertialization Transition Cost** — 讨论 inertialization 的过渡成本与替代做法，补充 Perfect Tracking Springs 的取舍。[链接](https://theorangeduck.com/page/inertialization-transition-cost)
- **Daniel Holden — Fitting Code-Driven Displacement** — 讨论把程序化位移拟合进动画数据，减少两套位置写者的长期偏差。[链接](https://theorangeduck.com/page/fitting-code-driven-displacement)
- **GDC 2016 — Motion Matching and The Road to Next-Gen Animation（Simon Clavet）** — 数据驱动动画选择的源头演讲，解释为什么角色位移越来越依赖动画轨迹匹配；本轮只核了场次页标题，未看视频。[链接](https://www.gdcvault.com/play/1023280/Motion-Matching-and-The-Road)
- **GDC 2021 — Motion Matching in The Last of Us Part II** — Code vs Data Driven Displacement 直接引用它说明 simulation bone 的生成与编辑，是根位移与动画贴合的一手制作经验；本轮只核场次页。[链接](https://www.gdcvault.com/play/1027378/Motion-Matching-in-The-Last)

**网络权威、预测与回滚**

- **Gabriel Gambetta：Client-Server Game Architecture** — 权威服务器 + 客户端输入的经典架构，界定“谁拥有状态、谁只发命令”的边界。[链接](https://www.gabrielgambetta.com/client-server-game-architecture.html)
- **Gabriel Gambetta：Client-Side Prediction and Server Reconciliation** — 预测-校正的原始讲解，对应暂停／传送后如何丢弃旧预测、回到权威状态。[链接](https://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html)
- **Gabriel Gambetta：Client-Side Prediction and Server Reconciliation（另一路径）** — 同一篇的短路径入口。[链接](https://gabrielgambetta.com/client-side-prediction-server-reconciliation.html)
- **Gabriel Gambetta：Entity Interpolation** — 远端实体用快照缓冲插值呈现的原始讲解，直接对应“呈现副本滞后、不写权威状态”。[链接](https://www.gabrielgambetta.com/entity-interpolation.html)
- **Gabriel Gambetta：Entity Interpolation（另一路径）** — 同一篇的短路径入口。[链接](https://gabrielgambetta.com/entity-interpolation.html)
- **Gabriel Gambetta：Lag Compensation** — 系列第四部分，服务器回看历史位置，与暂停／传送清历史同属“重放窗口”问题。[链接](https://www.gabrielgambetta.com/lag-compensation.html)
- **Gaffer On Games：Networked Physics（2004）** — 把固定步长用于权威服务器／回滚网络物理的原文，说明离散 tick 如何简化预测与回滚。[链接](https://gafferongames.com/post/networked_physics_2004/)
- **Gaffer On Games：Introduction to Networked Physics** — 网络物理三种模型总览，用于给“预测／平滑／权威”分层定位。[链接](https://gafferongames.com/post/introduction_to_networked_physics/)
- **Gaffer On Games：Networked Physics in Virtual Reality（Oculus／Meta 文章原文）** — 含 Unity+PhysX、按立方体转移权威、量化与 100 ms avatar 抖动缓冲，原文可读且可核对作者本意。[链接](https://gafferongames.com/post/networked_physics_in_virtual_reality/)
- **Gaffer On Games：Snapshot Interpolation** — 讲清快照之间插值、呈现滞后和缓冲窗口的语义，对“暂停／重生清历史”和“传送不插回旧位置”直接相关。[链接](https://gafferongames.com/post/snapshot_interpolation/)
- **Gaffer On Games：Deterministic Lockstep** — 锁步／确定性模拟的工程说明；HN 讨论里也有对其中 UDP／TCP 主张的尖锐批评，可正反两用。[链接](https://gafferongames.com/post/deterministic_lockstep/)
- **Gaffer On Games：Floating Point Determinism** — 列出浮点确定性成立的条件（同代码、同编译器／指令、同顺序），用于判断回放、重演和同输入不变量能承诺到什么程度。[链接](https://gafferongames.com/post/floating_point_determinism/)
- **Gaffer On Games：State Synchronization** — 明确区分把状态直接写进物理与只平滑渲染误差，并给出误差衰减做法，是物理对象／呈现对象分离的直接依据。[链接](https://gafferongames.com/post/state_synchronization/)
- **Valve Developer Community：Source Multiplayer Networking** — Source 的 prediction／interpolation／lag compensation 官方 wiki；本次被 Anubis 反爬拦截，正文未读，只保留原链接，不把其具体说法写成断言。[链接](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking)
- **Riot：Determinism in League of Legends — Implementation** — 反例：LoL 服务器刻意用可变帧 dt + 记录时钟做确定性重放，并讨论固定步长的取舍；避免把“固定步长”当唯一正确。[链接](https://www.riotgames.com/en/news/determinism-league-legends-implementation)
- **Riot：Determinism in League of Legends — Unified Clock** — 统一时钟如何让服务器／客户端／回放对齐，补充暂停、重连和时间源的所有权问题。[链接](https://www.riotgames.com/en/news/determinism-league-legends-unified-clock)
- **Riot：Determinism in League of Legends — Part I Introduction（engineering 域）** — 确定性系列开篇，交代固定 tick、统一时钟要解决的问题。[链接](https://engineering.riotgames.com/news/determinism-league-legends-introduction)
- **Riot：Determinism in League of Legends — Introduction（riotgames 域）** — 同一篇的官方域名入口；Chronobreak 用记录输入加确定性服务器重放恢复比赛，展示“模拟只认输入、呈现可重建”。[链接](https://www.riotgames.com/en/news/determinism-league-legends-introduction)
- **Riot：Determinism in League of Legends — Part II Implementation** — 补 Part I 只讲目标的缺口，给出确定性改造的实现细节和回放约束。[链接](https://engineering.riotgames.com/news/determinism-league-legends-implementation)
- **Riot：Valorant / 128-Tick Servers** — 解释服务器 tick 与运行时优化，补足 tick 架构的厂商原文。[链接](https://technology.riotgames.com/news/valorants-128-tick-servers)
- **Riot：Peeking into VALORANT's Netcode** — VALORANT 的 tick、回滚与 peeker's advantage 概览，补足 128-tick 文章缺少的客户端呈现与服务器校正视角。[链接](https://technology.riotgames.com/news/peeking-valorants-netcode)
- **Riot：How 2XKO Handles Online Play** — 说明 2XKO 为何选 client-server 而非 P2P rollback，给出权威模型与输入延迟的现代取舍。[链接](https://2xko.riotgames.com/en-us/news/dev/how-2xko-handles-online-play/)
- **Overwatch GDC 2017：Gameplay Architecture and Netcode** — Blizzard 官方讲座（公开摘要）：ECS、固定 command frame、MovementState 环缓冲与两状态插值、服务器回滚；本轮只核场次页。[链接](https://gdcvault.com/play/1024001/-Overwatch-Gameplay-Architecture-and)
- **Overwatch GDC（gdcvault.com 另一路径）** — 同一场次的另一入口，便于核对标题与讲者。[链接](https://www.gdcvault.com/play/1024001/Overwatch-Gameplay-Architecture-and-Netcode)
- **Rocket League GDC 2018：It IS Rocket Science!** — Psyonix 讲确定性物理与联网重放／回滚，说明固定步长物理对同输入可重演的价值与代价；本轮只核场次页。[链接](https://gdcvault.com/play/1024972/It-IS-Rocket-Science-The)
- **GDC：I Shot You First — Networking the Gameplay of Halo: Reach** — 主机权威 FPS 的预测／插值网络模型，补足早期 FPS motor 的权威分配经验；本轮只核场次页。[链接](https://www.gdcvault.com/play/1014345/I-Shot-You-First-Networking)
- **GDC 2023：Predicted Physics-Based Multiplayer in Space Engineers** — 商业沙盒对预测物理多人的复盘，直接讨论物理对象与呈现对象的误差修正。[链接](https://gdcvault.com/play/1029260/Online-Game-Technology-Summit-Predicted)
- **Infil — How fighting games use delay-based and rollback netcode** — 系统解释 rollback 的保存、回滚、重模拟与错误预测视觉伪影；HN 297 分、106 条评论，正反经验都多。[链接](https://words.infil.net/w02-netcode.html)
- **dev.to — Ten Years of Rollback Netcode in a Cross-Platform RTS, Without Fixed-Point（2026-10-31）** — 社区生产案例：逻辑固定 30 tick、渲染按设备帧率解耦、每 10–20 tick 快照、视觉跳变靠插值平滑。[链接](https://dev.to/chromealex/ten-years-of-rollback-netcode-in-a-cross-platform-rts-without-fixed-point-2c71)
- **Slippi — Super Smash Bros. Melee rollback netcode** — HN 讨论中作为真实回滚改造案例出现，证明固定逻辑帧加回滚可以保留离线手感；站点是 SPA，未从站内得到实现细节。[链接](https://slippi.gg/)
- **Don't use Lockstep in RTS games** — 对 lockstep 的明确反对意见，比较 lockstep 与 client-server 在带宽、作弊、延迟和确定性上的代价。[链接](https://blog.istrolid.com/blog/dont-use-lockstep-in-rts-games.html)
- **Paul Bettner — 1500 Archers on a 28.8（Age of Empires）** — 锁步网络的一手复盘：固定 turn、只传命令、确定性模拟、渲染与通信回合解耦。[链接](https://www.gamedeveloper.com/programming/1500-archers-on-a-28-8-network-programming-in-age-of-empires-and-beyond)
- **Halo Infinite — Closer Look at Online Experience** — 实装 FPS 的 30／60 Hz tick、服务器权威与客户端预测校正，可对照 30／60／120 Hz 呈现不变量。[链接](https://www.halowaypoint.com/news/closer-look-halo-infinite-online-experience)
- **Arma Reforger：Server Authoritative Vehicles** — 确定性车辆物理 + 预测 + 输入重演的 2026 一手说明，对应位移所有权与回放。[链接](https://reforger.armaplatform.com/news/server-authoritative-vehicles)
- **Nition — The origin of client-side prediction in games** — 追溯 QuakeWorld／Duke3D 的客户端预测起源，补充预测／校正的历史与动机。[链接](https://nition.momentstudio.co.nz/p/the-origin-of-client-side-prediction)
- **Fabien Sanglard — Quake 3 Networking** — 逐段解读快照、增量实体与命令交换，补齐 `cg_ents.c` 的上下文。[链接](https://fabiensanglard.net/quake3/network.php)
- **Neil Toronto — Unlagged 网络模型** — 延迟补偿的经典实现说明，补足 Valve lag compensation 的独立来源。[链接](http://www.ra.is/unlagged/network.html)
- **Adrian Biagioli — Bunnyhopping from the Programmer's Perspective** — 用 Quake／Source 代码说明加速与摩擦按 `fixedDeltaTime` 缩放、落地有一 tick 输入窗口，展示 tick 粒度的输入消费。[链接](https://adrianb.io/2015/02/14/bunnyhop.html)
- **Teardown Multiplayer — Voxagon Blog** — 半确定性物理网络的一手复盘：确定性命令流 + 客户端预测；本轮原站曾返回 HTTP 466，正文未读，只保留链接与主题。[链接](https://blog.voxagon.se/2026/03/13/teardown-multiplayer.html)
- **Unity FPS Sample 网络架构深潜（GDC 视频）** — 讲 FPS Sample 的移动复制、预测与修正分层，可与仓库 `Animation.md` 的 Playable Graph 说明对照；本轮未看视频。[链接](https://www.youtube.com/watch?v=k6JTaFE7SYI)

### S5 中文社区实战与评论区

**moyuta 个人博客（正文可读，作者自测）**

- **《Root Motion 撞墙后谁决定位置：动画只提交期望位移》** — 正文实测：把 Root Motion 降为“期望位移提案”，由碰撞 Sweep 后的提交层原子写入最终位置，残差不回写 Transform，直接回答位移所有权；带 C# 探针、构建命令与 11 个测试（pass=11）。[链接](https://blog.moyuta.com/posts/root-motion-character-motor-collision-commit)
- **《网络角色传送后出现半程残影，是插值跨过了不连续边界》** — 正文实测：用 Tick／Segment／Position 快照在传送、复活换点、跨场景时推进段号并返回 SegmentCut，禁止插值器跨不连续边界。[链接](https://blog.moyuta.com/posts/snapshot-interpolation-teleport-segment-cut)
- **《固定步长追帧达到上限后，剩余时间该怎么处理》** — 正文实测：把追帧后的时间拆成 steps／remainder／dropped，要求 `alpha=remainder/h` 落在 `[0,1]` 并显式记录丢弃量。[链接](https://blog.moyuta.com/posts/fixed-timestep-catchup-budget-remainder)
- **《游戏中的数学 10：固定时间步与数值积分》** — 正文实测：给出 30／60／120 Hz 下同一抛体误差与 200 ms 卡顿的 tick 执行示例，可作为“同输入不同呈现频率”的量化参照（作者自测，非引擎实跑）。[链接](https://blog.moyuta.com/posts/game-math-10-fixed-step-integration)
- **《动画根位移混合：坐标原点不应变成角色运动》** — 正文实测：先混合根位移增量而非绝对位置，否则资产原点差会被当成运动。[链接](https://blog.moyuta.com/posts/root-motion-blend-deltas-before-positions)
- **《帧同步不是同步状态：4 字节输入如何驱动唯一的逻辑帧》** — 4 字节输入帧只驱动唯一 Step 入口，配合状态哈希验证，覆盖“每个逻辑 tick 消费哪份输入”。[链接](https://blog.moyuta.com/posts/lockstep-input-frame-drives-deterministic-tick)
- **《相同输入仍会失步：帧上下文必须隔离容器顺序与系统时间》** — 把固定步长、随机种子、稳定实体顺序与系统时间隔离收进帧上下文，解释同输入仍失步的非步长原因。[链接](https://blog.moyuta.com/posts/lockstep-frame-context-stable-order-determinism)
- **《循环动画的根位移：相位归零时，角色不该倒退》** — 循环根位移要按未回绕累计量提交、保留周期差与局部采样差，避免相位归零时角色倒退。[链接](https://blog.moyuta.com/posts/root-motion-loop-unwrapped-displacement)
- **《确定性逻辑为什么必须与表现层分离》** — 给出逻辑／表现单向边界及“插值 ≠ 预测”的区分，并规定表现层不得写回权威状态。[链接](https://blog.moyuta.com/posts/deterministic-logic-presentation-boundary)
- **《客户端预测的确认边界：只重放未确认输入》** — 要求从权威快照只重放未确认输入、越界确认在提交前原子失败，补预测校正的所有权与幂等边界。[链接](https://blog.moyuta.com/posts/client-prediction-reconcile-unacknowledged-inputs)
- **《动画过渡中断：完成回调必须服从代际所有权》** — 处理动画过渡被更高优先级状态中断后旧完成回调不得提交，补 Root Motion 状态切换的 generation 契约。[链接](https://blog.moyuta.com/posts/animation-transition-interruption-generation-ownership)
- **《镜头弹簧跟随随帧率变形：位置和速度必须一起精确推进》** — 证明临界阻尼弹簧需位置与速度闭式一起推进，否则相机跟随会随帧率变形。[链接](https://blog.moyuta.com/posts/camera-critical-damping-exact-state-step)
- **《相机临界阻尼必须精确推进位置与速度》（另一 slug）** — 同一主题的入口，给出临界阻尼弹簧的精确状态步进。[链接](https://blog.moyuta.com/posts/camera-critical-damping-exact-step-state)

**掘金**

- **《帧同步坦克大战移动系统》** — 据检索摘要：逻辑帧默认 15 Hz、表现层按渲染帧向目标位置插值，展示低逻辑帧率下的显示平滑方案。[链接](https://juejin.cn/post/6844904012995624973)
- **《Unity 手游实战：从 0 开始 SLG——ECS 战斗（三）逻辑与表现分离》** — 据检索摘要：Unity SLG 项目把战斗逻辑与表现拆成两套对象／更新循环，可作为模块分层与所有权划分参考。[链接](https://juejin.cn/post/6950947953942986782)
- **《帧同步之从零开始》** — 据检索摘要：帧同步入门长文，覆盖固定逻辑帧、输入收集和表现插值，适合补齐术语与流程。[链接](https://juejin.cn/post/6844903683516284941)
- **《帧同步游戏开发备忘》** — 据检索摘要：工程备忘列出逻辑 15／30 Hz、表现层插值、确定性与浮点等坑，偏实践清单。[链接](https://juejin.cn/post/6998879447566778405)
- **《Unity 中，游戏的刷新帧率不同意外地出现了运动速度不同是怎么回事？》** — 据检索摘要：以问答形式解释同一移动代码在 30／60／144 Hz 下速度不同的原因和乘 `deltaTime` 的修法。[链接](https://juejin.cn/post/7274887531287822390)

**B 站图文与视频**

- **《FixedUpdate 并没有以固定时间间隔运行》** — 正文可读：解释 FixedUpdate 并非真实等间隔，而是在每帧按 deltaTime 补 0／1／多次（含伪代码），建议逻辑用 tick 计数而非累加 deltaTime。[链接](https://www.bilibili.com/opus/1010064780646416388)
- **《空洞骑士杂谈（3）——帧率是怎么影响游戏的？》** — 正文可读：以《空洞骑士》拆出计时在 Update、碰撞在 FixedUpdate 造成的 30／60／100／144 Hz 差异与浮点误差，属玩家侧实测分析。[链接](https://www.bilibili.com/opus/1057215580135751689)
- **《【Unity】RootMotion 的实际应用大整理》** — 正文可读：整理 RootMotion 父级／碰撞体跟随、OnAnimatorMove、灵魂出窍与 localPosition 重置，并提醒 Rigidbody 要用 MovePosition。[链接](https://www.bilibili.com/opus/958751367520845829)
- **《高刷之殇：CGSS 物理演算的玄学参数与十年死局》** — 正文可读：逆向分析高刷下布料物理 30／60／120 Hz 参数补偿与两帧交替振荡，是“呈现频率变了但模拟步长没变”的反面案例。[链接](https://www.bilibili.com/opus/1147300826993131525)
- **B 站《永劫无间》动作与运动系统演讲录像（Unity 官方页内嵌）** — 从 Unity 官方专题页内嵌链接找到的原始演讲录像，是群内文字整理稿的一手来源；命令行访问返回 412，未核正文。[链接](https://www.bilibili.com/video/BV1QN411f7WJ)

**SegmentFault、个人博客与 GameRes**

- **SegmentFault《Unity 中构建稳定的物体运动系统：从时间步进到可中断动画》** — 采集时正文可读：明确“一个时刻只有一个系统拥有位置写入权”，并给出暂停／取消／目标切换下的时间步进与插值封装；本轮复检无 UA 返回 410、带浏览器 UA 返回 000，可能已下线或按出口拦截，引用前需再开。[链接](https://segmentfault.com/a/1190000048197373)
- **jackylvm《Unity 逻辑帧与渲染帧分离》** — 正文可读：自定义 LogicFrameManager 累加固定步长、手动 `Physics.Simulate`，渲染层只用 alpha 插值读取 logicPos。[链接](https://jackylvm.github.io/post/unity-luo-ji-zheng-yu-xuan-ran-zheng-fen-chi/)
- **那点事《FixedUpdate 真的是固定的时间间隔执行吗？聊聊游戏定时器》** — 正文可读：实测一次 Update 前可能连续执行多次 FixedUpdate（启动时 11 次），证伪“每 0.02 s 定时调用”。[链接](http://www.nadianshi.com/2017/11/188512)
- **GameRes《射击类 MOBA 游戏帧同步：浮点精度测试》** — 正文可读：用 FixedUpdate 限逻辑、逻辑／表现分离，并记录 float 跨平台不一致，补上确定性与固定步长的关系。[链接](https://www.gameres.com/779642.html)
- **GameRes《永劫无间》动作与运动系统：按动作类型划分 root motion / 程序位移** — 24 Entertainment 客户端工程师说明绝大多数位移交给 RootMotion、跳跃／飞索／受击等参数化位移交给程序，按动作类型划分位移所有权。[链接](https://www.gameres.com/884120.html)
- **GameRes《UE4 角色移动原理（下）：胶囊体与 Mesh 分开平滑》** — 按 UE 源码说明 SimulatedProxy 的胶囊体按物理／网络状态移动、Mesh 用 MeshTranslationOffset 单独插值以避免代理角色突变。[链接](https://www.gameres.com/853270.html)
- **GameRes《帧同步网络差时如何平滑位移（问答）》** — 提问者描述 20 Hz 逻辑帧下取不到帧导致角色一卡一卡、预走几帧再校准会突然回头；回答给出逻辑／表现分离、容差内渐进修正、jitter buffer。[链接](https://www.gameres.com/808751.html)
- **GameRes《影子跟随算法：FPS 游戏中处理不连续状态》** — 作者用“实体追影子”把跳变的状态包变成连续运动，并强调起跳／落地等关键状态必须缓存。[链接](https://www.gameres.com/454350.html)

**中文出版、独立游戏与官方专题页**

- **indienova《沙盒空间》v1.4 更新公告** — 正文可读：独立游戏自述采用“逻辑／渲染双缓冲：固定逻辑步长 1/60 秒、渲染帧率独立、插值平滑”，属小团队落地自报（无实测数据）。[链接](https://ld0.indienova.com/u/bugforge/blogread/38813)
- **《腾讯游戏开发精粹Ⅲ》1.2.2 逻辑与表现分离** — 正文可读：明确逻辑位置随服务器帧命令立即更新、渲染位置按渲染间隔插值且只用于本地平滑，是“两套位置”的权威工程表述。[链接](https://book.qq.com/book-read/52521420/12)
- **Unity 官方专题页《从搭建到优化，《永劫无间》如何做游戏动作与运动系统》** — 官方专题页：生产团队分享 RootMotion 为主、程序位移处理重力／跳跃／受击／飞索的分工；正文由 JS 渲染，需人工打开核对。[链接](https://developer.unity.cn/projects/609c9229edbc2a001fd796df)
- **百度贴吧《HQ x2 琪拉莉的气球为何如此鬼畜？》** — B 站 CGSS 文引用的高刷物理振荡原帖，是“物理步进与渲染帧率脱钩会出现可见异常”的玩家侧实证；本轮返回安全验证，未读原帖。[链接](https://tieba.baidu.com/p/5846410244)

### S6 头部列表、插件市场与相邻新东西（不是 motor 实现，按“值得知道”列）

- **stevinz/awesome-game-engine-dev** — 1.5k 行的引擎／物理／学习资源总表（含 Fix Your Timestep），是头部 awesome 列表。[链接](https://github.com/stevinz/awesome-game-engine-dev)
- **Calinou/awesome-gamedev** — free-software 游戏开发总表，覆盖引擎、物理与学习资源。[链接](https://github.com/Calinou/awesome-gamedev)
- **RyanNielson/awesome-unity** — Unity 资源列表，含 Character Controllers 小节，可补头部资产／实现索引。[链接](https://github.com/RyanNielson/awesome-unity)
- **michidk/Unity-Script-Collection** — Unity 脚本大合集，含 Movement 与 Character Controller 分类。[链接](https://github.com/michidk/Unity-Script-Collection)
- **ellisonleao/magictools** — 游戏开发工具总表，覆盖物理、动画与角色生成工具。[链接](https://github.com/ellisonleao/magictools)
- **tjboudreaux/cc-plugin-unity-gamedev** — 社区 Claude Code 插件，提供 21 个 Unity skills（Addressables／GAS／Cinemachine／动画等），走插件市场安装。[链接](https://github.com/tjboudreaux/cc-plugin-unity-gamedev)
- **AnkleBreaker-Studio/unity-mcp-server** — 宣称 347 操作／80 暴露工具，支持多编辑器与多人场景的 Unity MCP server。[链接](https://github.com/AnkleBreaker-Studio/unity-mcp-server)
- **pirate-608/codex-plugins：unity-gameplay-development skill** — 以 C# MonoBehaviour、输入、角色／载具控制器为对象，并含编译后挂载与 PlayMode 验收流程。[链接](https://github.com/pirate-608/codex-plugins/tree/main/plugins/unity-mcp/skills/unity-gameplay-development)
- **Unity CLI Usage Data: What 200 Million Events Reveal（2026-10-22）** — 官方数据：2 亿条 CLI 事件中 98% 来自 AI coding agent／自动化，Claude Code 使用最多，并列出官方插件；与 motor 无关，属主线值得知道。[链接](https://unity.com/blog/unity-cli-usage-data-ai-coding-agents)
- **Epic：AI 代码工具消除了 UE 十年历史的 non-deterministic cooking bugs（2026-10-28 报道）** — Epic 确认 AI-first 转向，并称 AI 代码工具清掉了长期非确定性 cook 问题；厂商公开表态，非实测。[链接](https://www.gamedeveloper.com/programming/unreal-engine-will-be-developed-with-ai-code-confirms-epic)
- **BRUTAL C# 框架（RocketWerkz 开源）** — 2026-10 起对全部开发者开放的新 C# 游戏框架；对“换引擎／自建引擎时谁来拥有主循环与位移”是新的现实样本。[链接](https://github.com/ahwootech/BRUTAL)
- **RimWorld 1.7 迁到自研 Waylith 引擎** — 2026-10-12 官方公告：RimWorld 从 Unity 迁到自研引擎，称后期殖民地 ticks-per-second 约 2.2 倍；性能为厂商自报。[链接](https://ludeon.com/blog/2026/10/announcing-the-waylith-engine-and-update-1-7/)
- **renew engine（AI-first、bit-deterministic 固定步长，Rust）** — 2026-09 出现的新引擎，把“bit-deterministic fixed-timestep simulation”和“可被 agent 操作”写进定位，属同方向的新做法。[链接](https://github.com/renew-engine/renew)
- **Balaur（完全确定性的 2D／3D 节点引擎）** — 2026-11 新建、约百星的节点式引擎，主打完全确定性与毫秒级脚本热重载；未验证其运动／插值实现。[链接](https://github.com/balaurengine/balaur)
- **Natrix（浏览器固定步长 + 确定性回放运行时）** — 2026-09 的 vanilla JS 游戏运行时，自述 fixed-timestep simulation 与 deterministic replay；与 FPS-Like 的网页固定步长路线同域。[链接](https://github.com/HsienW/natrix)
- **CraftBench-UE：Unreal Engine 中编码 Agent 的确定性评测（arXiv 2609.23142）** — 2026-09-19 arXiv，讨论在 UE 里对 coding agent 做确定性评测；与 agent 评测主线相关，不涉及 motor／插值。[链接](https://arxiv.org/abs/2609.23142)
- **把 1993 年 Amiga 游戏移植到 Godot，让 LLM 读 68000 汇编** — 2026-09 作者原文，HN 381 分；展示 LLM 读旧平台汇编并驱动引擎移植的过程，与固定步长无关。[链接](https://babyloniantwins.com/blog/porting-a-1993-amiga-game-to-godot/)

## 前几项为什么最值得深挖

1. **FPS-Like 固定源码（`interpolation.ts` + `client.ts` + `game.ts` + `movement.ts` + `physics.ts` + `feel.md`）——唯一同时具备“可运行网页 + CPU 证明 + 明确写者”的一组。** 它把本卡五个问题都落到代码：每帧采样、sub-tick 命令排序、固定 60 Hz、`Physics.move` 唯一写 `actor.position`、`interpolateState` 纯只读、暂停／重开清 `previousState`。先读它，能把“哪些是模拟事实、哪些只是呈现副本”分清；`feel.md` 还明确说 CPU 只证明采样连续与模拟不受 render 频率影响，不证明 144 Hz 屏幕或音画同步，正好防止把网页证明升级成引擎结论。移植时只换时间源与落位入口，不重调摩擦／加速度。
2. **Celeste64 `Player.cs` + Foster `App.cs`——已发行游戏的“固定 60 Hz、不插值”对照。** 它证明另一条路线成立：Foster 默认 `FixedStep(60)`，`Player.Update` 里状态机算速度、`SweepTestMove(velocity * Time.Delta)` 单入口提交位移，`LateUpdate` 做地面修正与相机平滑，渲染永远画最新状态。重生时 `Added` 直接把相机置到新位置、状态机 `Respawn` 只改视觉。读它可以判断“我们真的需要插值吗”，以及相机与身体是否要分开更新；边界是 `Foster` 取 main 未固定 SHA，且没有高刷屏数据。
3. **JLPM22 `SpringCharacterController.cs` + 基类 `LateUpdate` + `MotionMatchingController.LockFPS`——反例，专门用来识别“渲染帧当模拟时钟”。** 控制器在 LateUpdate 用 `Time.deltaTime` 跑弹簧写 Transform，动画骨骼另有位置，两者靠阻尼 adjustment、`MaxDistance` clamp 和 `SetPosAdjustment` 共存；`LockFPS` 默认把渲染帧率锁到动画数据库帧率。读它可以看出两套位置如何互相拉扯、以及为什么这套代码不能原样搬到固定 tick；同时它也是“动画提议、控制器裁决”的一个真实变体。
4. **Godot physics interpolation 文档 + `reset_physics_interpolation` + #110979／#96663／#111040——引擎层“清历史”最明确的契约与反例。** 文档规定逻辑进 `_physics_process`、传送后 reset、按 10–30／30–60／60+ 选 tick；issue 给出 1 帧拖影（#110979，Godot 3 的手写插值子节点）、重挂父节点 ghosting（#96663）、AnimatableBody2D reset 不生效（#111040）三个可复现失败。它比任何博客都更适合作为“暂停／重生／传送不插回旧位置”的实现清单与验收负例。
5. **Unity Rigidbody.interpolation／OnAnimatorMove／执行顺序文档 + ECM2 30/60/120 支持帖——引擎层“谁写 Transform、谁拥有 root motion”的基准。** 官方明确开启插值后物理系统接管 Transform、直接改 Transform 需要 `SyncTransforms`；`OnAnimatorMove` 一旦实现，`applyRootMotion` 显示为 Handled by Script；ECM2 维护者根据用户报告的 30 与 60/120 FPS 观察解释了 root motion 每渲染帧采样、物理按 50 Hz 消费造成的不均匀角速度，并给出三种修法。先读官方契约，再读这条支持帖，能避免把“加插值”当成万能修法。
6. **Jakub Tomsu《Fixed Timestep Without Interpolation》+ Gaffer《Fix Your Timestep!》——决定“要不要插值”的两端。** Jakub 给出不插值的替代：复制状态、前推剩余时间再画，无额外 tick 延迟但要求状态可廉价复制；Gaffer 给出累加器＋插值＋spiral of death 的经典边界。两者对照后再选路线，比默认“固定步长必须插值”更稳。

## 读不到与证据缺口

- **证据等级。** 本产物把材料分成四类并逐项标注：① **网页既有 CPU 证明**：只有 FPS-Like（60 Hz、368 项测试、四路 WebGL2 软件 smoke 等既有记录，来自 `feel.md` 与仓库页，本轮未重跑）；② **当前源码阅读**：FPS-Like／Celeste64／JLPM22／Quake／Valve SDK 的实际代码，按固定 SHA 或固定文件读；③ **官方文档阅读**：Unity／Godot／Unreal／Bevy／Box2D 的契约，未在引擎里执行；④ **社区自报**：论坛、issue、博客里的症状与修法，未独立复现。没有任何一项是“本轮引擎实跑”或“本轮新性能测量”。
- **引擎未实跑。** 本轮没有安装或启动 Unity／Unreal／Godot，没有创建 Unity 工程，也没有用 headless 浏览器跑 FPS-Like 页面；所有引擎行为结论都来自官方文档与源码阅读。把本产物接进案例前，仍需在目标引擎做小工程验证（固定 tick、插值、传送、暂停四条路径各一个最小场景）。
- **网页证明的边界。** FPS-Like 的 CPU 测试只证明输入采样连续、模拟不受 render 频率影响；`feel.md` 明确说真实 144 Hz 屏幕、音画同步、输入到屏幕延迟仍待测。本产物没有把 `368`、`60 Hz`、`15 步`、`250 ms` 等既有数字升级成引擎性能结论，也没有新增数字。
- **GDC／视频／付费墙。** GDC Vault 的 Overwatch 2017、Rocket League 2018、Motion Matching 2016、TLOU2 2021 等只有公开摘要，没有 transcript／slides；YouTube 全部被 TLS 或网络拦截，只经 oEmbed 核过标题与作者，未看内容；`ubm-twvideo01.s3.amazonaws.com` 的 GDC PDF 403。本产物没有根据这些材料补写讲者未公开的细节。
- **反爬与登录墙。** Valve Developer Community 的 Source Multiplayer Networking／Prediction／Lag Compensation／Interpolation／Tickrate 都被 Anubis 挡住；知乎、微信公众号、CSDN、掘金正文、B 站视频页、贴吧、Lobsters、Reddit、Oculus／Meta、Medium、`gamedev.net`、`lspiroengine.com`、`deWiTTERS` 等也只拿到标题、摘要或没有正文。原文未读的条目只保留链接与主题，不把搜索摘要写成断言；这不表示这些渠道没有相关内容。
- **GitHub 元数据。** GitHub REST API 在共享出口 IP 上未认证限流（core／code_search 均 0 remaining），`gh` CLI 未安装；star、pushed 时间来自网页搜索／topic 页，可能随日期漂移。`gitlab.com/snopek-games/godot-rollback-netcode` 429、`bevy_ahoy` README 404、`MxM` 仓库受限访问，均已在条目里注明。
- **未验项与下一步。** ① 在 Unity 6.x 小工程里复现 ECM2 帖的 30／60／120 root motion 采样差异，确认 `Animator.updateMode` 与 `Rigidbody.interpolation` 的组合；② 在 Godot 4.4+ 小工程里验证 `reset_physics_interpolation` 对 `CharacterBody3D`／`AnimatableBody2D` 的行为，并核 #111057 是否已进入目标版本；③ 在目标引擎里按五项断言各写一个最小输入，比较 tick 序列／哈希／末位置；④ 若要从 FPS-Like 迁移，先核 `bd4765..main` 的漂移（`b86964c`、`667f1b1`、`297bc04`）再复制规则；⑤ GDC／Valve／知乎等未读材料如需引用，另开只读采集，不把本轮摘要当已核事实。

## 数量与核对

- 排序清单收录 **539** 个链接条目、归入 **488** 个主题条目（同一官方页的不同版本合并在一个条目内，但每个链接都保留）；渠道分布见上表。
- 链接来自本轮收集与链接检查后的候选清单；写稿时没有新增清单外的来源。`physics.ts`、JLPM 基类与 Foster `App.cs` 是清单内条目直接指出的固定树／依赖文件，已直读 HTTP 200 核对。
- 核实日期：2026-11-04（UTC+8）。所有“官方说／作者说／维护者说”均按原文语境转述；社区自报与厂商自报没有被写成独立验证结果。

