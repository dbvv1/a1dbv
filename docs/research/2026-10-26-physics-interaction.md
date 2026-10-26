# 物理道具与机关：现成方案、源码与未验部分

结论：普通屏幕项目保既有交互入口，用原生动力学／最少关节做可推挡道具；非物理展示与真实接触分开选。
增量：XRI 高级 TransformJoint 的 breakDistance 实际是 warp 阈值，不是断开；“更跟手”并不等于重量或受阻更可信。
状态：官方文档、固定源码与使用者原帖已读；没有运行 Unity／UE、XR 设备、商业资产或物理替身模拟。

正文：[物理交互](../../domains/game-dev/unity/06-physics-interaction.md)。角色、车辆、CCD 仍链接 04 原模块，本页补拿／搬／投／推／堆和二改正常制作链。

## 1. 候选与质量参照

- [R.E.P.O. 官方商店](https://store.steampowered.com/app/3241660/REPO/)：2025-02-26 发布，官方明确物理抓取工具、重钢琴／易碎陶器与运输目标。用于质量参照，不推断底层算法，不复制地图／模型，未亲玩。
- 原生 Rigidbody／HingeJoint／ConfigurableJoint：复用引擎能力，项目只补目标、握点、释放和规则适配；不写通用框架。适合已有普通屏幕玩法，不宣称一组参数跨所有质量、尺度和固定步长稳定。
- [Grab It](https://assetstore.unity.com/packages/tools/physics/grab-it-105735)：官方商店显示版本 2.0.0，2025-04-25，Unity 2022.3.14f1，Standard Unity Asset Store EULA、Extension Asset；作者描述用距离约束、Input System、旋转／投掷与按质量配速度曲线。页面商业资料不等于源码核实；未购买、下载、安装或验证维护成本，保评估档。
- [UE Physics Components](https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-components-in-unreal-engine)：Physics Handle 用于保持物理的抓取移动，Physics Constraint 用于连接刚体。采用现项目入口，不因此换引擎。

## 2. 实读官方开源样例

仓库 [Unity-Technologies/XR-Interaction-Toolkit-Examples](https://github.com/Unity-Technologies/XR-Interaction-Toolkit-Examples/tree/881f7e197c7b0958621ebd1a05f249bbe254d36f)，SHA `881f7e197c7b0958621ebd1a05f249bbe254d36f`，2026-02-13；README 为 Examples 3.4.0／Unity 6000.3，manifest 锁 XRI 3.4.0，LICENSE 为 Unity Companion License。

实读 `Documentation/GrabInteractables.md`、`PhysicsInteractables.md`、`Assets/XRI_Examples/Global/Scripts/TransformJoint.cs` 与 `Assets/XRI_Examples/Physics/Scripts/Door.cs`：

- 普通抓取站点分别展示三种运动模式；物理站点才处理关节门／抽屉。低延迟跟踪与力学接触是不同目标。
- TransformJoint 在 FixedUpdate 清线／角速度，按碰撞缓存决定直接移动或冲量；可改 mass；位置误差超过 breakDistance 时先直接 warp，旋转误差超 breakAngle 时直接对齐。名称不代表断开抓取，不能照字面让 AI 接关卡政策。
- Door 将门限位、把手、锁与钥匙状态分开；借职责而非把 XR 锁／socket 流程搬进普通屏幕项目。

这些是源码阅读，不是运行行为测量；未复制样例代码或资产到本仓，也未安装 SDK。样例的手感和物理稳定性需要目标版本、物体与设备实际比较。

## 3. 官方契约与真实使用反证

- [XR Grab Interactable 3.4](https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@3.4/manual/xr-grab-interactable.html)：运动模式明确区分速度追踪、kinematic 和直接 Transform；本页不把 kinematic 跟随当静态墙阻挡保证。
- [ConfigurableJoint](https://docs.unity3d.com/6000.0/Documentation/Manual/class-ConfigurableJoint.html)：驱动 spring／damper／maximumForce 与约束自由度分开；有限 drive force 不代表所有接触力都被同一阈值约束。
- [关节稳定性](https://docs.unity3d.com/6000.0/Documentation/Manual/RagdollStability.html)、[AddForce](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Rigidbody.AddForce.html)、[材料组合](https://docs.unity.com/en-us/engine/6000.0/manual/physics-section/physics-overview/collision-section/collider-surfaces/combine)：对应尺度／质量／solver、冲量与速度变化、接触双方摩擦规则。未把文档建议数字写成通用最优设置。
- [Reddit，2026-03 持物振荡原帖](https://www.reddit.com/r/Unity3D/comments/1rpax1t/any_advice_on_how_to_get_items_grabbed_in_front/)：读原作者 spring joint 使用描述及评论中的阻尼、Lerp、关节／施力方案。它们控制承诺不同，不能作为同效配方混用；未复现作者场景。
- [中文公开练习](https://github.com/liangbinhi/Unity-Object-Pickup-System/tree/beb757dc1c2f207c8cddaa94ba8eff5fa11c56ad)，SHA `beb757dc1c2f207c8cddaa94ba8eff5fa11c56ad`，2026-03-28：已读 README、ObjectGrabbable.cs 和 PlayerPickUpDrop.cs，输入侧 Raycast、物体侧关重力并在 FixedUpdate 用 Lerp＋MovePosition。Drop 直接重力 true，选层不自动提供完整遮挡策略。未见 LICENSE，因此只做阅读比较，不复用代码；作者将项目定位为练习展示，不把它贬成故障产品。

探索回执（截止 2026-10-26）：覆盖 Unity／Epic 官方、2025 商用游戏官方玩法、2026 官方开源样例、Reddit 实际调校问题与中文作者源码。部分网页缓存缺失后读正常 Git 源码；没有访问拒绝绕行。未找到足以宣称普通屏幕抓取“行业最强”的同题真实评测，选择依据是适用性与接入成本。
