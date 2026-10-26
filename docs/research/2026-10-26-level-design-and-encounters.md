# 关卡与遭遇制作：默认流程的证据与反例

结论：默认交付一关可快速改的真实玩法布局，不先造地图生成器；空间不稳定用廉价白盒，成熟编辑器可直接摆真组件。
增量：独立白盒不是仪式；路线连通不是节奏质量，换装饰不该改变地形语义，AI 必须沿实际相机／角色／敌人接线。
状态：已读开发者复盘、官方文档和固定源码，并用 Python 解析官方 LDtk 样例；未运行原生编辑器、样例导入器、实际碰撞／导航或真人试玩。

正文：[关卡与遭遇](../../domains/game-dev/08-level-design-and-encounters.md)。现有 [Gameplay](../../domains/game-dev/05-gameplay-architecture.md)保留生命周期与其他架构；本记录只服务完整空间制作问题，不另建关卡框架。

## 1. 先核优秀制作，而非默认工具目录

- [Steve Lee，GDC 2025《The Unusual Level Design of Tactical Breach Wizards》原始 slides](https://media.gdcvault.com/gdc2025/Slides/Lee_Steve_TheUnusualLevel.pdf)：已下载并文本读取；涉及 §3 互补玩法元素、§4 每关概念、§7 制作流程、§8 按关卡收集反馈。成熟编辑器让直接试真实关卡胜过额外草图，且没有独立 blockout 阶段。适用前提是内容与工具已能快速试，不推广成所有游戏省掉空间原型。
- [Level Design Book：Blockout](https://book.leveldesignbook.com/process/blockout)：用于可玩粗模与低成本修改的基本理由；其中游戏案例有较早年份，未包装成近两年新工具效果。本文不借其转述数字作生产效率结论。
- 对照结果：采用“最快可玩的、可删除的内容版本”，而非规定必须画几轮平面图或强制全灰。本文示例布局、阶段和二改是设计建议，不是对上述作品的复刻或亲玩报告。

## 2. 官方与现成开源接入点

| 对象／固定位置 | 实读发现 | 采用决定 |
|---|---|---|
| [ProBuilder `4d190ef`](https://github.com/Unity-Technologies/com.unity.probuilder/tree/4d190ef81b8d0b8db9970b2638450362309f3641)，提交 2026-10-21 | package 6.1.3、Unity 6000.0；LICENSE.md 为 Unity Companion License。Runtime/Misc/CreatePolyShape.cs 用 CreateShapeFromPolygon 定时随机改形；Editor/RenameNewObjects.cs 被编译开关关闭，保留旧 namespace/API | 采用现项目兼容包的菜单作几何起点；不复制随机运行时样例做关卡生成器，不盲粘旧编辑器例子 |
| [官方 ProBuilder 6.0 文档](https://docs.unity3d.com/Packages/com.unity.probuilder@6.0/manual/index.html) | 本次页面显示 6.0.9，不同于源码 HEAD | 锁项目版本，不按搜索页升级 |
| [LDtk `2b7b551`](https://github.com/deepnight/ldtk/tree/2b7b5512f2f88fa281cb6492debbb26ead7838d4)，提交 2026-10-06 | MIT；`src/electron.renderer/data/inst/LayerInstance.hx` 的 toJson 分别导出 intGridCsv、autoLayerTiles、entityInstances；IntGrid 按行列输出，自动图块来自规则缓存 | 采用地形语义／交互／外观分层；先用已有导入器，不为一关手写完整格式实现 |
| [LDtk JSON overview](https://ldtk.io/docs/game-dev/json-overview/) | 定义、实例、可选外部关卡文件分开；格式有演进与弃用规则 | 保源文件和格式兼容；本页原更新 2023，不声称这是 2026 新机制 |
| [UE Level Designer Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/level-designer-quick-start-in-unreal-engine) | 搭房间、放 Actor、运行关卡的官方入口 | UE 用户沿既有项目用，不换引擎；搭出房间不是设计验收 |

代码许可与样例美术许可分别看；本次只读和解析，没有复制第三方样例代码或美术到仓库，也没有安装 Unity 包或切换引擎。

## 3. 真实使用者的正反证

- [Unity3D 原帖，2025-11-06](https://www.reddit.com/r/Unity3D/comments/1oqd2qc/am_i_the_only_one_who_struggles_a_lot_with/)：原作者用 Unity 2021.3，讨论对齐偏移；评论既有中心／枢轴解释，也有操作摩擦、改用 Blender／CSG 和仍保 ProBuilder 场景内调整的使用者。未复现，不把旧环境问题直接判成 6.x 缺陷，也不因此选一个未经核实的替代插件为默认。
- [UE5 白盒作者与反馈讨论，2026](https://www.reddit.com/r/UnrealEngine5/comments/1sfpici/ive_been_learning_level_design_for_3_months/)：读了掩体与肩侧镜头、入口观察、敌我轮廓和攻击时序的具体评论，也读了作者“希望直接投入战斗”的解释。用于建立可验证的体验目标，而不是“所有开局必须慢”。
- [中文作者《阿勒忒亚山》](https://voidcake.site/article/Aletheia)，2026-09-08 发布、09-20 更新：自己总结区域引导有所提升，但宏观节拍、情绪与深度仍不足。用于提醒连通与体验不同，未把个人白盒当商用质量标杆。

## 4. 本次实际离线验证

固定 LDtk 样例 `app/extraFiles/samples/Typical_TopDown_example.ldtk` 的 jsonVersion 为 1.5.3，含三个关卡。用标准库 json 读取首关，Collisions 网格 32×16，512 个值中 200 个墙值、312 个空值；该层自动图块 536 个，Entities 层 8 个实体。图块数与碰撞格数不同，不能逐渲染图块推理占用。

在内存深拷贝中清空每层的 autoLayerTiles／gridTiles，比较每层标识、intGridCsv、实体 iid／类型／位置／字段投影，保持相等，断言通过。这个窄试用只证明样例 JSON 能分离读取，并未证明编辑器重新生成、引擎导入器或游戏碰撞保持正确；原文件未改，未分发样例资产。

探索回执（截止 2026-10-26）：覆盖 Unity／Epic／LDtk 官方、GDC 2025 创作者原稿、固定开源源码、Reddit 两类实际问题及中文作者复盘；GDC 大 PDF 的网页读取因大小失败后正常下载读取，未绕过访问拒绝。工具原生效率、真人节奏与“全行业最强”未知，不用页面检查补齐这些结论。
