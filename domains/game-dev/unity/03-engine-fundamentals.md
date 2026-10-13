# Unity 引擎基础：给 AI 协作准备的知识地图

> 核实时间：2026-10-08；WP9 的导入与身份边界于 2026-10-14（UTC+8）复核。
> 这一篇是**基础知识**：Unity 的核心概念和机制。每个小节最后都有“**AI 要点**”，说明 Agent 在这里常犯什么错、应该在 AGENTS.md 里写什么、用什么手段验证。
> 概念以 [Unity 官方手册](https://docs.unity3d.com/Manual/) 为准（各节附链接）；“AI 要点”来自本仓库的实践总结和社区反馈 **[经验]**。版本信息见最后一节。

## 1. 对象模型：Scene、GameObject、Component

| 概念 | 说明 |
|---|---|
| **Scene** | 一个关卡或界面，包含一棵 GameObject 树；可以叠加加载多个场景 |
| **GameObject** | 场景中的实体，本身几乎没有行为，只是组件的容器；必定有一个 `Transform` |
| **Component** | 挂在 GameObject 上的功能单元：渲染器、碰撞体、刚体、你写的脚本等 |
| **MonoBehaviour** | 你写的脚本组件的基类，接收生命周期回调 |
| **[Prefab](https://docs.unity3d.com/Manual/Prefabs.html)** | 可复用的 GameObject 模板；支持嵌套 Prefab 和 Prefab Variant（继承并覆盖部分属性） |
| **[ScriptableObject](https://docs.unity3d.com/Manual/class-ScriptableObject.html)** | 不挂在场景里的数据资产，适合放配置、数值表、共享数据 |

**AI 要点**：
- Agent 习惯“写一个类就完事”，但 Unity 里一个功能往往还需要**把组件挂到 Prefab 上、在 Inspector 里连好引用**。要求它说明“代码之外还需要在编辑器里做什么”，或者用 Unity CLI / MCP 去做；
- 数据和配置优先用 ScriptableObject，而不是硬编码在 MonoBehaviour 里，这样 Agent 改数据不用碰场景。

## 2. 生命周期与执行顺序

[执行顺序](https://docs.unity3d.com/Manual/execution-order.html)的主线：

```
Awake → OnEnable → Start → (每个物理步) FixedUpdate → (每帧) Update → LateUpdate → … → OnDisable → OnDestroy
```

- `Awake` 在对象创建时调用（即使组件未启用），适合初始化自身；`Start` 在第一次 `Update` 前调用，适合访问其他对象；
- 不同对象之间同一回调的先后顺序**默认不确定**，需要时用 Script Execution Order 设置；
- 异步：协程（`IEnumerator` + `yield`）、Unity 6 的 `Awaitable`、第三方 UniTask。统一生命周期、取消和主线程边界；已有方案满足时不为统一语法重写，具体采用条件见[客户端模块](../04-client-modules.md#场景切换取消等待不等于取消工作)。**[研究]**

**AI 要点**：
- 常见错误：在 `Awake` 里访问其他对象还没初始化的数据；在 `OnDestroy` 里访问已经销毁的对象；GameObject 失活／宿主销毁会停止协程，但仅设 `MonoBehaviour.enabled=false` 不会，见[官方协程说明](https://docs.unity3d.com/6000.3/Documentation/Manual/Coroutines.html)；
- `async void` 和不处理取消的任务，会在场景切换后访问已销毁的对象；
- 在 AGENTS.md 里写明：**各类异步工作的所有者、取消与收尾路径**、跨对象初始化的约定。

## 3. 序列化：Unity 里最容易被 AI 搞坏的部分

[序列化规则](https://docs.unity3d.com/Manual/script-serialization.html)要点：
- `public` 字段或带 `[SerializeField]` 的私有字段会被序列化，并显示在 Inspector 里；属性（property）、静态字段、`readonly` 字段不会；
- 多态引用需要 `[SerializeReference]`；
- 场景、Prefab、ScriptableObject 存为 YAML，通过 **fileID + GUID** 引用其他对象；GUID 存在每个资源旁边的 **`.meta`** 文件里。

**AI 要点**（这几条对应模板里的保护 Hook）：
- **字段改名会让已有数据丢失**：必须加 `[FormerlySerializedAs("旧名")]`。Agent 做“重命名重构”时最容易忘；
- **不要手改 `.unity`、`.prefab`、`.asset` 的 YAML**，fileID 和 GUID 一错，引用就断了；
- **不要删除或手写 `.meta`**；移动文件要连 `.meta` 一起 `git mv`；
- 把 Asset Serialization 设为 Force Text，Agent 和 diff 才能看懂改了什么。

## 4. 编译、程序集与 Domain Reload

| 机制 | 说明 |
|---|---|
| **[Assembly Definition（asmdef）](https://docs.unity3d.com/Manual/assembly-definition-files.html)** | 把代码拆成多个程序集：缩短编译时间、明确依赖方向；Editor 代码放单独的程序集 |
| **[Domain Reload](https://docs.unity3d.com/Manual/domain-reloading.html)** | 每次编译或进入 Play 模式时重新加载脚本域，静态变量被重置；可以在“Enter Play Mode Options”里关闭以加快迭代，**但关闭后静态状态不会自动重置** |
| 脚本后端 | Mono（编辑器和部分平台）、IL2CPP（移动端和主机常用，AOT 编译，反射和泛型有限制） |
| `#if UNITY_EDITOR` | 运行时代码引用 `UnityEditor` 必须包起来，否则打包失败 |

**AI 要点**：
- 编译反馈分档：编辑器开着用 `unity recompile`（秒级）；`dotnet build` 生成的 sln 只做快速检查，**新增或删除文件后 csproj 可能过时**，最终以 Unity 编译为准（见 [02 第 3 节](02-large-project-guide.md#3-编译验证最重要的反馈回路)）；
- 关闭 Domain Reload 的项目，要告诉 Agent“**静态字段必须在 `[RuntimeInitializeOnLoadMethod]` 里手动重置**”；
- IL2CPP 平台上避免依赖运行时反射和动态代码生成，Agent 从普通 .NET 经验写出的代码可能在真机上崩。

## 5. Unity 的 null：一个经典陷阱

`UnityEngine.Object`（包括 GameObject、Component、各种资源）重载了 `==`：对象被 `Destroy` 后，C# 引用并不为 null，但 `== null` 返回 true。

**AI 要点**：模型按普通 C# 习惯写 `?.`、`??`、`is null`，会**绕过 Unity 的重载**，对已销毁对象判断错误。启用 [Microsoft.Unity.Analyzers](https://github.com/microsoft/Microsoft.Unity.Analyzers)（UNT0007、UNT0008 会报出来）比写进 AGENTS.md 更可靠：规则放在能确定执行的一层（见 [docs/14 规律二](../../../docs/14-synthesis.md#2-规律二上下文是预算信息应该拉而不是推)）。

## 6. 资源管理

| 方式 | 说明 | 建议 |
|---|---|---|
| 直接引用（Inspector 拖拽） | 随场景或 Prefab 一起加载 | 小项目默认方式 |
| `Resources` 文件夹 | 按路径加载，所有内容都会打进包 | 不建议新项目使用 |
| **[Addressables](https://docs.unity3d.com/Packages/com.unity.addressables@latest)** | 按地址异步加载、按组打包、支持远程内容更新 | 明确需要分组驻留、按需加载或内容分发时采用；不按项目大小强制 |
| Presets / AssetPostprocessor | 复用导入规格，必要时增加持续规则 | 先预设，再按明确字段所有权写小型后处理器 |

**AI 要点**：在 AGENTS.md 写明项目实际采用的加载方式；采用 Addressables 时约定异步加载与释放，不为单纯重生成资产而强迁移小项目。**[经验]**

**✅ 二次导入保留正确的对象与字段。** [官方 Preset 依赖示例](https://docs.unity3d.com/6000.0/Documentation/Manual/DefaultPresetsByFolder.html)可复用；修改压缩等规则时，不顺带重置自定义 pivot、outline 或材料 remap。更新 Prefab 优先局部修改：官方 [SaveAsPrefabAsset](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/PrefabUtility.SaveAsPrefabAsset.html)整体覆盖按子对象名称匹配，同名对象及同类型重复组件有引用歧义。**[一手＋经验]**

Addressables 的 [AssetReference](https://docs.unity3d.com/Packages/com.unity.addressables@2.9/api/UnityEngine.AddressableAssets.AssetReference.html)区分主资产 GUID 与子对象名称／ID；已有远程分发项目还须按[官方更新流程](https://docs.unity3d.com/Packages/com.unity.addressables@2.9/manual/content-update-builds-overview.html)保留每个平台发布基线的 content state 文件。**关键局限**：它解决加载与分发，不会修复切片重排、名称碰撞或 GUID 仍在但换错内容；详见 [WP9 证据与采用边界](../../../docs/research/2026-10-14-game-wp9-engine-handoff.md)。**[一手＋经验]**

## 7. 渲染管线

| 管线 | 说明 |
|---|---|
| Built-in | 旧管线，不再是新项目的推荐选择 |
| **[URP](https://docs.unity3d.com/Manual/urp/urp-introduction.html)** | 通用渲染管线，覆盖移动端到 PC 和主机；Unity 6 引入 Render Graph |
| HDRP | 高清渲染管线，面向高端 PC 和主机 |

Unity 6 的 GPU Resident Drawer、GPU 遮挡剔除用于大量物体的渲染 **[经验：Unity 6 公开资料]**。

**AI 要点**：**着色器和渲染代码在不同管线之间不通用**。模型训练语料里 Built-in 管线的代码最多，经常在 URP 项目里写出 Built-in 的 Shader 或 `OnRenderImage` 后处理。AGENTS.md 里必须写明管线和版本；官方插件里有 `migrate-birp-to-urp`、`validate-urp-render-graph-renderer-feature` 等 Skill 可用（见 [01](01-toolchain.md#12-unity-官方-agent-插件-)）。

## 8. 输入与 UI

| 领域 | 已有可用方案 | 按项目需求评估的另一方案 |
|---|---|---|
| 输入 | Input Manager（`Input.GetKey`） | **[Input System](https://docs.unity3d.com/Packages/com.unity.inputsystem@latest)**（Action、Action Map、多设备） |
| 运行时 UI | uGUI（Canvas） | UI Toolkit（类似 Web 的 UXML + USS） |
| 编辑器 UI | IMGUI | UI Toolkit |

**AI 要点**：写明实际输入与 UI 版本，不因文本布局易编辑就迁移可用 uGUI。新布局密集页面可评估 UI Toolkit；还要比较关键帧动画、焦点与目标设备行为，见[客户端模块的版本选择](../04-client-modules.md#4-借用的授权边界与升级条件)。文本可编辑性不证明 Agent 的正确率更高。**[一手＋研究]**

## 9. 性能

| 主题 | 要点 |
|---|---|
| GC 分配 | 热路径（`Update` 等）里避免分配：LINQ、字符串拼接、装箱、闭包、每帧 `new` |
| 查找 | 避免每帧 `GetComponent`、`Find*`、`Camera.main`（旧版本），在初始化时缓存 |
| 对象池 | 子弹、特效等频繁创建销毁的对象用对象池（Unity 自带 `ObjectPool<T>`） |
| **[Job System](https://docs.unity3d.com/Manual/JobSystem.html) + Burst** | 多线程 + 编译优化的高性能计算 |
| **[DOTS / ECS（Entities）](https://docs.unity3d.com/Packages/com.unity.entities@latest)** | 数据导向架构，适合海量实体；学习成本高 |
| **[Profiler](https://docs.unity3d.com/Manual/Profiler.html)** | 一切优化以数据为准 |

**AI 要点**：
- 性能优化要先给 Agent **Profiler 数据**，再让它改，改完对比数据（见 [docs/15 第 7 节](../../../docs/15-task-playbooks.md#7-性能优化)）；
- 热路径规则可以交给评审子 Agent（模板里的 `unity-perf-auditor`）检查；
- DOTS 的 API 变化较大，模型容易写出旧版本的 Entities 代码，要让它先查当前包版本的文档。

## 10. 测试

[Unity Test Framework](https://docs.unity3d.com/Packages/com.unity.test-framework@latest)：
- **EditMode 测试**：不进入 Play 模式，快，适合纯逻辑；
- **PlayMode 测试**：在运行时环境里跑，能测协程、物理和场景，慢。

**AI 要点**：业务逻辑写在**不继承 MonoBehaviour 的纯 C# 类**里，Agent 就能写大量快速的 EditMode 测试。这是 Unity 项目“AI 友好化”最划算的一步（见 [02 第 4 节](02-large-project-guide.md#4-测试)）。

## 11. 版本与路线（2026-10）

- 当前长期支持版是 Unity 6.3 LTS；6.4 于 2026-03 发布 **[二手]**；
- 脚本运行时正在从 Mono 迁移到 **CoreCLR**：计划 6.7 提供实验性的 CoreCLR 播放器、6.8 提供 CoreCLR 编辑器，配合 .NET 10 和 C# 14；6.6 起 Fast Enter Play Mode 成为默认 **[二手：Unity 论坛转述]**；
- Unity 7 计划 2026-12 开启早期 Beta，2027 年第一季度正式发布 **[二手]**；
- 中国区为团结引擎（Unity 中国），2.0 于 2026-07 发布，带 AI 智能体“团结 Codely” **[二手]**。

**AI 要点**：CoreCLR 迁移期间，C# 语言版本和可用 API 会变化，**AGENTS.md 里写明 Unity 版本和 C# 语言版本**，不确定时让 Agent 查当前版本的手册，而不是凭记忆。

## 12. 汇总：Unity 项目的 AGENTS.md 应该写清的基础信息

| 项 | 例子 | 不写会怎样 |
|---|---|---|
| Unity 版本、C# 版本 | Unity 6.3 LTS，C# 9 | 写出不可用的语法或 API |
| 渲染管线 | URP 17，使用 Render Graph | 写出 Built-in 管线的代码 |
| 输入和 UI 方案 | 实际 Input System／现有输入；uGUI 或 UI Toolkit 版本 | 未经需求更换可用方案、UI 与玩法双触发 |
| 异步边界 | 原生／UniTask 的具体所有权、取消与收尾契约 | 取消等待却遗失句柄、旧回调写新场景 |
| 资源加载 | 常驻直接引用；按需 Addressables 并约定释放者 | 双重释放、未持有结果寿命、无预算缓存 |
| 程序集结构和依赖方向 | `Core ← Gameplay ← UI` | 循环依赖、运行时引用编辑器代码 |
| Domain Reload 设置 | 已关闭，静态字段要手动重置 | 第二次进入 Play 模式时状态错乱 |

模板见 [templates/AGENTS.md](templates/AGENTS.md)。
