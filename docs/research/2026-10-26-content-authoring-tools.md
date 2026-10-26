# 内容作者工具：现成底座与接入证据

默认保原数据和 Inspector，先接“编辑→预览→原玩法试跑”，只为具体作者动作补工具。
新发现：Tri 默认分支已切 2.0 预览；官方样例 HEAD 与 Unity 6.0 手册使用不同资产检索 API；属性按钮不替业务提供资产事务。
[正文](../../domains/game-dev/unity/05-content-authoring-tools.md)是研究第一版：已下载并读源码，未安装到 Unity、未原生编译／运行，未测作者效率或作品品质。

## 1. 为什么选这个模块

01 引擎接入主要解决 Agent 接口、导入／再生成与资产引用；unity/02 只有编辑器扩展可交给 AI 的概括。这里补 G2 编辑器工具完整开发问题：作者怎么找到内容、改参数、在原空间看效果，并通过原执行器决定下一次修改。不是继续扩大自动化接口目录。

## 2. 已读的真实代码

| 固定来源 | 读到的入口 | 影响正文的事实 |
|---|---|---|
| [Unity 官方 UI Toolkit 示例 c1d7216](https://github.com/Unity-Technologies/ui-toolkit-manual-code-examples/tree/c1d7216dbb4fcf4fa3fe4fed482fd5dc1f951858)，2026-10-21 | `create-a-custom-inspector/Editor/Car_Inspector.cs`、`bind-to-list/Editor/GameSwitchListEditor.cs`、`create-a-custom-editor-window-with-CSharp/MyCustomEditor.cs` | Inspector 视觉树、SerializedObject 列表绑定、双栏选择／预览已有小例，无需先自建框架。HEAD 窗口用 SourceSearchQuery／SearchAsync；[6.0 版手册](https://docs.unity3d.com/6000.0/Documentation/Manual/UIE-HowTo-CreateEditorWindow.html)仍用 FindAssets；不能把 HEAD 标成全部版本适用 |
| [Tri 2.0 8003822](https://github.com/codewriter-packages/Tri-Inspector/tree/80038223a6c09651e9ab49d9964498a71c0ef3ca)，2026-10-24 | `package.json`、README、`Editor/Editors/TriEditor.cs` | 包号 2.0.0，README 标 preview；最低 Unity 6000.0，UI Toolkit；IMGUI 路径显示迁移／降级提示。无版本 URL 会选择这条路线 |
| [Tri 1.x d75c4da](https://github.com/codewriter-packages/Tri-Inspector/tree/d75c4dac2e449bc19b5313ce741bd496fca7c123)，2026-08-03 | `package.json`、`Editor/Editors/TriEditor.cs` | 包号 1.15.1、最低声明 2020.3，仍有 IMGUI 编辑器路径；两支均声明 `com.unity.localization:1.0.0`。这不是本仓已经测过这些 Unity 版本 |
| [Alchemy 164f9d4](https://github.com/annulusgames/Alchemy/tree/164f9d485d34efc99cda3e99cbf557b1baa810bf)，2026-10-15 | `Alchemy/Assets/Alchemy/Editor/AlchemyEditor.cs`、`Editor/Internal/InspectorHelper.cs`、`Editor/Elements/MethodButton.cs`、runtime Inspector attributes、EditMode InspectorCallbackCacheTest | 2.1.1，UI Toolkit，普通序列化字段走 PropertyField；可禁默认 editor。Button 直接反射 Invoke，不能假设创建操作自动有 Undo。扩展序列化字段多选有明确警告；`ShowInInspector` 的可编辑非序列化值不因显示出来而持久化 |

官方样例的 `LICENSE.md` 把代码列为 Unity Companion License，其他资料为 CC BY-NC-ND。Tri 与 Alchemy 根许可为 MIT。没有把第三方源码拷入交付，也没有启动原生编辑器；源码中的测试仅阅读，不报告它们通过。核实：2026-10-26。

## 3. 官方、作者与社区交叉核查

- **新能力及适用版本**：Unity [2026-08 Editor Tools 指南](https://discussions.unity.com/t/technical-guide-building-custom-tools-for-the-unity-editor/1733712)明确按 6.6 写，自定义窗口可承载工具工作流。取其原生工具／上下文组织机制，不复制示范中没有完整 Undo 的代码充当生产实现。
- **绑定**：[自定义 Inspector 手册](https://docs.unity3d.com/6000.0/Documentation/Manual/UIE-HowTo-CreateCustomInspector.html)说明返回视觉树后的隐式绑定；独立窗口样例则显式绑定 SerializedObject。这是 Agent 容易混用的两个入口。
- **制作体验**：[It's All Over 作者原帖](https://www.reddit.com/r/Unity3D/comments/1wgxhmr/custom_editortools_from_my_game_its_all_over/)说明自己既做开发也做关卡，希望内容制作更方便。正文把它作为实际作者关注的目标，不推断工具源码、许可或量化效率，也不称已评完作品质量。
- **反证用例**：[Tri #231](https://github.com/codewriter-packages/Tri-Inspector/issues/231)报告 Unity 6.3／Tri 1.15.1 在 Project 窗口看 Prefab 与打开 Prefab 的 SceneObjectsOnly 结果不同。状态为用户报告，本仓未复现，不归因到所有版本；用于要求按实际上下文验证。
- **付费选择**：[Odin 当前官方价格／许可说明](https://odininspector.com/pricing)按 Personal／Enterprise 与席位区分，并说明永久回退许可；[原始讨论](https://www.reddit.com/r/unity/comments/1w3hq46/is_odin_inspector_worth_it/)有依赖、序列化、定价争议及反驳。正文不采用“所有人必须订阅”或“自动替换全部序列化”等断言；不购买、不新建账号。
- **中文原帖**：[2026-01-02 开发者选型记录](https://www.cnblogs.com/wildmelon/p/19432812)强调已有插件与引擎分支的兼容问题；保留为使用者决策背景，不把其个人引擎推荐或支持期限当本页技术结论。对应 API 和产品版本仍回上面的官方／源码。
- **UE 对照**：[Scripted Actions](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripted-actions-in-unreal-engine)适合选中对象后操作，[Editor Utility Widgets](https://dev.epicgames.com/documentation/en-us/unreal-engine/editor-utility-widgets-in-unreal-engine)提供持续面板；官方页仍标 Beta，未运行。只对照作者入口，不宣称和 Unity 工具互换。

探索回执：截止 2026-10-26，覆盖 Unity／Epic／Odin 官方、Unity Discussions、Reddit 作者与用户原帖、中文博客园原帖，以及固定 Unity 示例／Tri／Alchemy 真实源码。最初猜测的 Odin 页面与 EditorTool 短 URL 不可读，改用已找到的官方实际页面；未通过登录／付费／原生执行补证。最高水平与目标项目效率收益未知。

## 4. 实际交付与接收边界

给读者的第一版包括默认、何时选择属性库／空间工具／独立窗口、遭遇内容模型、正常作者路径、实际接线、三档预览、难度档位＋远程敌人二改和验收表。使用项目已存在的运行时，不造假遭遇模拟以证明编辑器效果。

原生接收需要：实际作者完成一次修改；保存重开／Undo／多选／Prefab 上下文；原执行器消费改后数据；目标 Player 构建排除 UnityEditor；典型内容规模下交互响应。当前没有可恢复的原生消费者，继续保研究版本，不解除已暂停的引擎实跑，也不要求 Web 案例迁移。
