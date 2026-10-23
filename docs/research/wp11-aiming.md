# 瞄准与命中：把输入意图、射程定位和接触范围分开
**结论：先保合格输入／武器模块；误吸、精调困难和近远距定位不是同一个“辅助强度”问题。** 已发行作品的修改支持分层处理，陀螺则提供直接精调的另一条路。
> 2026-10-23（UTC+8）；公开官方／开源／玩家原帖对照。作品体验依据为作者报告；本端仅运行下述固定库的合成数值检查，未试用实体手柄、模型或引擎。回[正文](../../domains/game-dev/05-gameplay-architecture.md#瞄准与命中按失误类型改不只提高辅助强度)。

## 作品参照：为什么不是只把辅助调强或调弱

| 原文与版本 | 决定性事实 | 本仓采用的取舍〔研究推导〕 |
|---|---|---|
| Destiny 2 [2025-01-23 TWID](https://www.bungie.net/7/en/News/Article/twid-01-23-25)，Weapons / Global / Aim Assistance；[8.2.0发布](https://www.bungie.net/7/en/News/Article/destiny_update_8_2_0)，2025-02-04，Temporal AA | 手柄已瞄目标被横穿者抢走，加入短时瞄准历史权重；正式补丁有对应条目。预告仅称内部试玩满意，未公开阈值或上线统计 | 比较短时保持，而非永久锁定；玩家主动改选仍须能退出 |
| THE FINALS [1.4.1](https://www.reachthefinals.com/patchnotes/141)，正文2024-01-11（页面顶另显Feb 2）；[9.0](https://www.reachthefinals.com/patchnotes/900)，2025-12-10，Controller | 旧版限制吸附角速度，并禁用部分武器吸附；9.0又为含狙击／霰弹等加回吸附，改按距离缩放。普通冷却0.5→0.7秒，狙击1.5秒，霰弹／左轮／榴弹1秒；理由是旧机制难同时满足近距与远距爆头要求 | 旧禁用不是永久默认。分别调距离响应、重触发和武器；数值只属该补丁，未公开曲线公式 |
| THE FINALS [10.0](https://www.reachthefinals.com/patchnotes/10-00)，2026-03-26，Gamepad / Input | 增加减敏、跟随和满杆禁用辅助选项；修复从武器切换搬运物后辅助残留 | 辅助的各效果与退出政策分开，状态变更清理旧辅助；鼠标不自动照搬手柄配置 |
| THE FINALS [7.6.0](https://www.reachthefinals.com/patchnotes/760)，2025-07-24，Weapons | KS-23改近25米即时命中、外侧投射物，弹速300→280m/s，为近距可靠、远距不作狙击。近战多武器扩大外缘却缩小近镜头内缘，避免意外屏外接触；Dagger扫掠0.07→0.1秒 | 弹道按体验定位而非只按真实性选；接触容错也不等于统一放大体积。混合实现未公开，不能假定在25米处生成弹体 |
| THE FINALS [11.6.0](https://www.reachthefinals.com/patchnotes/11-60)，2026-08-20，KS-23 | 仍因侵占BFR中远距定位，衰减起点18→12米、终点23→22米、最低倍率0.675→0.58 | 混合机制上架不等于射程平衡完成；仍验伤害、提前量和角色定位 |

这些记录证明公开采用与调参目标，不提供跨游戏对照胜率或“当前全球最好”的结论。近墙枪口／视点分离沿正文既有机制，本轮未取得同等深度的新作品制作参照，不靠重复API说明抬高覆盖。

## 直接精调替代：陀螺不等于更强自动瞄准

[Fortnite v19.30官方说明](https://www.fortnite.com/news/gyro-aiming-and-flick-stick-come-to-fortnite-in-v19-30-more-controller-options)（2022-02-15，与Jibb Smart合作）建议新手先用摇杆粗转、仅瞄准时陀螺精调，先不开flick stick；持续启用时需要禁用入口以重新摆正手柄。Flick stick失去摇杆上下瞄准，必须由陀螺承担。该作陀螺活跃时关闭辅助，只是其规则；历史设备名单不当作当前全平台兼容表。

先沿游戏已有传感器输入／融合。缺能力时可比较MIT的[GamepadMotionHelpers固定版本](https://github.com/JibbSmart/GamepadMotionHelpers/tree/f1a76007ec058122a4bb6f19c816c6c0c7b7f12a)：它接外部输入，单位为°/s、g和秒，Y-up；[ProcessMotion](https://github.com/JibbSmart/GamepadMotionHelpers/blob/f1a76007ec058122a4bb6f19c816c6c0c7b7f12a/GamepadMotion.hpp#L1080-L1132)处理校准／融合，调用者另接游戏视角。仅陀螺＋加速度不能消除绕重力轴的绝对朝向漂移；作者也提醒静止检测可能吞慢跟踪。它是C++组件，Unity绑定、设备读取、平台构建和生命周期仍有成本；JoyShockMapper外部映射程序不是引擎插件。已有上游处理不重复叠加，丢失的信息也不能靠后级恢复。[源码／研究]

反例与维护边界：
- [THE FINALS 2.6.0](https://www.reachthefinals.com/patchnotes/260)（2024-05-02，Controller Gyro Aiming）承认新设置序列化导致初始默认值错误；因此升级旧配置与全新配置须分别验。这是历史已知问题公告，不据此确认修复或当前仍坏。
- [玩家慢跟踪原帖](https://www.reddit.com/r/thefinals/comments/1us0ha8/native_gyro_input_is_still_broken_in_s11/)报告S11低速跟踪阻滞，并归因自动校准。公开体验与其转述回复不是本仓复现或根因确认；精确发布日期未核，不据搜索索引定日。[社区]
- 同一[11.6.0](https://www.reachthefinals.com/patchnotes/11-60)的Anti-Cheat通知承认规则误标陀螺玩家、调整规则并自动撤销封禁。未公开具体输入路径／映射器；仅已有反作弊的项目须纳入兼容回归，不给普通单机新加反作弊。

**中文实际采用与维护反例。** LINUX DO同一作者在[2025-08-10跟帖](https://linux.do/t/topic/827948/8)自述让AI写陀螺观测小程序以逐轴定位，后来用既有Dolphin输入视图对照；这是先补观察而非猜融合参数的例子。[2026-02-21后续](https://linux.do/t/topic/1633659)又报告模拟器更新使原硬编码失效，合并上游后出现回归，最终自述二分定位并修复。只采这段个人适配经验，不照搬驱动方案；模型版本、原始对话、驱动正确性与收益未核。对游戏Agent的启示是先核采样轴／方向与已有输入链，再接融合；平台维护不可由“AI写出了代码”免除。[社区／研究推导]

## 库级离线检查：同一输入不告诉你真相

固定源码 `f1a76007ec058122a4bb6f19c816c6c0c7b7f12a`；header SHA256 `f070bb1327cf5b1fbc336d570382d4c088e5ffae9f031dd0af8f81153581e690`。[MIT许可](https://github.com/JibbSmart/GamepadMotionHelpers/blob/f1a76007ec058122a4bb6f19c816c6c0c7b7f12a/LICENSE)已读，未修改库。已有g++14.2.0、C++17实际编译；上游存在注释和未使用参数警告，不称零警告。源码取备后，编译与驱动不联网，不接设备。

[原创驱动](../../experiments/game_gyro_calibration_probe.cpp)给每模式新实例／默认配置：100Hz，dt=0.01秒；Y轴输入0.2°/s持续1000步，再归零100步；加速度计比力恒为(0,+1,0)g，库重力估计趋向-Y。下面是合成时间，不是运行耗时。

![相同合成输入在两时刻的校准后Y轴角速度](../img/2026-10-23-game-gyro-calibration.svg)

[原始CSV](../../experiments/game_gyro_calibration_observations.csv)保留全部记录点。10秒时Manual输出0.2，Stillness及其与SensorFusion组合输出0、估计偏置0.2；10.01秒输入归零后二者输出-0.2，记录至11秒仍如此。首个1秒记录的player-space yaw为0.122163，重力估计尚在收敛；图画校准后Y轴角速度，不是玩家相机转速。

**这既可解释成真实恒速绕重力轴转动，也可解释成静止偏置；试验没有真值，不能判某模式普遍更准。** Manual这段未先测偏置，也会保留真实偏置。另一案例给定“静止偏置0.1”的外部前提，手动校准后0.1输入约归零、0.3输入输出0.2。由此采用的是同时验慢跟踪／静止漂移并保显式校准选择，不是默认永远关自动校准；更不是THE FINALS故障复现、实体手柄／引擎质量或AI收益验证。

重跑（先自行取备固定header到临时目录并核上面SHA256；本仓不复制第三方全源或二进制）：

```sh
# /tmp/gyro-source/GamepadMotion.hpp 为已经取备、核hash的固定上游header
g++ -std=c++17 -O2 -Wall -Wextra -pedantic -I/tmp/gyro-source \
  experiments/game_gyro_calibration_probe.cpp -o /tmp/game_gyro_probe
/tmp/game_gyro_probe > /tmp/game_gyro_observations.csv
# 同编译器／平台可比较字节；跨平台浮点末位允许差异，须解释而非默默忽略
cmp experiments/game_gyro_calibration_observations.csv /tmp/game_gyro_observations.csv
```

## 交给Agent的二改与接收

〔研究推导，未做模型或引擎对照〕沿现有控制／武器模块，把“加辅助”拆成候选资格、短时保持、减敏／跟随／吸附、退出与距离响应；必要时记原始输入、辅助增量及失效原因。第二次要求加入横穿目标、不同射程武器、满杆脱离、携带物切换；分别验主动改选和误吸，不只统计总命中率。

新增混合弹道时，分界两侧核提前量、视觉反馈和结算身份；接触体积／时段变化仍保旧多段、取消及唯一结算规则。有意允许的屏外攻击不能被通用过滤删掉。陀螺路线核单位／坐标／采样时间、慢跟踪、漂移、复位不带镜头和旧配置升级；不能读取原始传感器或不能承担平台绑定维护时保原路线。真人评追踪、脱离、反馈与舒适度，参数矩阵和二改主动工时也计成本。

探索回执：截至2026-10-23，已读上述官方全文、固定公开库代码／许可、Reddit与中文LINUX DO原帖；另回扫V2EX旧经验及工具候选，未据其扩大结论；没有运行实体手柄、Unity／Unreal或模型。Orcs Must Die的GDC2017公开《Predictable Projectiles》PDF读取返回维护页500，仅核讲座简介，未纳入结论；Unity OnlineFPS样例文档仅作候选入口、未锁版深核，不用它抬等级。
