# Unreal 引擎基础：给 AI 协作准备的知识地图

> 核实时间：2026-10-08。
> 这一篇是**基础知识**：Unreal Engine 5 的核心概念和机制。每个小节最后都有“**AI 要点**”，说明 Agent 在这里常犯什么错、应该在 AGENTS.md 里写什么、用什么手段验证。
> 概念以 [Epic 官方文档](https://dev.epicgames.com/documentation/en-us/unreal-engine) 为准（各节附链接）；“AI 要点”来自本仓库的实践总结和社区反馈 **[经验]**。

## 1. 对象模型：UObject、Actor、Component

| 概念 | 说明 |
|---|---|
| **UObject** | 几乎所有引擎对象的基类，提供反射、垃圾回收、序列化、网络同步的基础 |
| **AActor** | 能放进关卡（World）的对象，有生命周期、可以 Tick、可以网络同步 |
| **UActorComponent / USceneComponent** | 挂在 Actor 上的功能；`USceneComponent` 带变换，可以组成层级 |
| **UWorld / ULevel** | 运行中的世界和其中的关卡 |
| **CDO（Class Default Object）** | 每个类的默认对象，构造函数在这里执行；蓝图和配置在它的基础上覆盖默认值 |

**AI 要点**：
- **构造函数不是“开始游戏时”执行的**：它在创建 CDO 和每个实例时都会运行，里面只做 `CreateDefaultSubobject` 和设置默认值，**不要访问 World、不要调用游戏逻辑**。游戏开始时的逻辑放在 `BeginPlay`；
- Agent 常把 Unity 的习惯带进来（比如在构造函数里找其他对象），要在 AGENTS.md 里写清这一条。

## 2. Gameplay Framework：谁负责什么

[Gameplay Framework](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine) 的分工（多人游戏中“存在于哪一端”很关键）：

| 类 | 职责 | 存在于 |
|---|---|---|
| `UGameInstance` | 跨关卡存在的全局对象 | 每个进程 |
| `AGameModeBase` / `AGameMode` | 游戏规则、生成玩家、胜负判定 | **只在服务器** |
| `AGameStateBase` | 所有人都需要知道的游戏状态（比分、阶段） | 服务器 + 同步到所有客户端 |
| `APlayerController` | 玩家的“意志”：处理输入、控制 Pawn | 服务器 + 拥有它的客户端 |
| `APlayerState` | 每个玩家需要被他人知道的状态（名字、分数） | 服务器 + 所有客户端 |
| `APawn` / `ACharacter` | 被控制的实体；`ACharacter` 带胶囊体和移动组件 | 服务器 + 客户端 |
| `AHUD` / UMG Widget | 界面 | 本地客户端 |

**AI 要点**：
- 最常见的错误是**把逻辑放错类**：在客户端读取 GameMode（永远拿不到）、把应该同步的状态放进 GameMode 而不是 GameState；
- 让 Agent 写网络相关代码前，先说明“这段逻辑在服务器还是客户端执行、谁需要知道结果”。

## 3. 反射系统与 UHT

[反射系统](https://dev.epicgames.com/documentation/en-us/unreal-engine/reflection-system-in-unreal-engine)通过宏标记类型，由 **UHT（Unreal Header Tool）** 在编译前生成代码：

```cpp
#include "MyActor.generated.h"   // 必须是最后一个 include

UCLASS(Blueprintable)
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Combat")
    float BaseDamage = 10.f;

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void ApplyDamage(AActor* Target);
};
```

- `UCLASS`、`USTRUCT`、`UENUM`、`UPROPERTY`、`UFUNCTION` 让类型能被编辑器、蓝图、序列化、网络同步和垃圾回收识别；
- 说明符（Specifier）决定可见性和行为：`EditAnywhere` / `EditDefaultsOnly` / `VisibleAnywhere`，`BlueprintReadWrite` / `BlueprintReadOnly`，`Replicated`，`Transient` 等。

**AI 要点**：
- 说明符写错、`.generated.h` 不是最后一个 include、`GENERATED_BODY()` 缺失，都会报 UHT 错误（`): Error:`），模板里的 `ue-build` 脚本会提取这类错误（见 [templates](templates/README.md)）；
- **反射／布局改动采用完整构建与重启作为保守策略**；Live Coding 的 Reinstancing 能更新部分反射对象，但引用／缓存刷新与具体工具注册另有条件，不把该策略解释为引擎完全不支持（见 [02 第 3 节](02-large-project-guide.md#3-编译验证)）。

## 4. 内存与垃圾回收

[对象处理](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-object-handling-in-unreal-engine)要点：

| 写法 | 含义 |
|---|---|
| `UPROPERTY() TObjectPtr<UFoo> Foo;` | **强引用**；持有者可达且该属性被 GC 遍历时保活目标，不能阻止显式销毁 |
| 裸指针 `UFoo* Foo;`（没有 `UPROPERTY`） | GC 不知道，对象可能被回收，留下悬空指针 |
| `TWeakObjectPtr<UFoo>` | 弱引用，不阻止回收，用之前检查 |
| `TSoftObjectPtr` / `TSoftClassPtr` | 软引用（资产路径），需要时再加载；本身不保证加载后驻留，另核持有／释放责任 |
| `NewObject<T>()`、`CreateDefaultSubobject<T>()` | 创建 UObject 的正确方式；**不要 `new`** |
| `IsValid(Obj)` | 判断对象非空且未被标记销毁 |
| `F` 开头的结构体（`USTRUCT`） | 值类型；内部强持有的 UObject 引用需可被 GC 遍历，通常使用 `UPROPERTY`，且结构体自身须处在可追踪的持有链中；弱引用不要求改成强引用 |

**AI 要点**：先区分强持有、弱观察和延迟加载，再检查实际生命周期。需要持有却无法被 GC 追踪的指针，可能编译通过却在回收后悬空；合法的弱观察引用不应为了消除这一警报被改成强持有。把持有链与失效检查写进 AGENTS.md，评审时按具体风险核查（模板 [`ue-code-reviewer`](templates/.claude/agents/ue-code-reviewer.md) 已包含）。

## 5. 模块、插件与构建

| 概念 | 说明 |
|---|---|
| **[模块](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-modules)** | 代码的组织单位，每个模块有一个 `.Build.cs` 声明依赖；跨模块使用的类要加 `<MODULE>_API` 导出 |
| 插件 | 一个或多个模块加内容，用 `.uplugin` 描述 |
| `.uproject` | 项目描述：模块列表、启用的插件、引擎版本 |
| `.Target.cs` | 编译目标：Game、Editor、Client、Server |
| 配置 | Debug、DebugGame、Development、Test、Shipping |
| UBT / UHT | 构建工具和头文件工具；UBT 管理编译，UHT 生成反射代码 |
| IWYU | Include-What-You-Use：头文件只包含自己需要的，多用前向声明 |
| Live Coding | 编辑器运行中重新编译函数体并热补丁 |

**AI 要点**：
- 链接错误（`LNK2019`、`undefined reference`）通常是 `.Build.cs` 缺少模块依赖，或者跨模块的类没有 `_API` 导出；
- Agent 喜欢在头文件里包含一堆头文件，拖慢编译时间，评审时要检查；
- **UE 的 API 在版本之间变化大**，让 Agent 遇到不确定的 API 先 grep 引擎头文件（`Engine/Source/`），这是对付 API 幻觉最有效的手段。

## 6. 蓝图与 C++ 的分工

| 写法 | 用途 |
|---|---|
| `UFUNCTION(BlueprintCallable)` | C++ 函数给蓝图调用 |
| `UFUNCTION(BlueprintImplementableEvent)` | C++ 声明、蓝图实现（C++ 没有默认实现） |
| `UFUNCTION(BlueprintNativeEvent)` | C++ 提供默认实现（`_Implementation`），蓝图可以覆盖 |
| 数据蓝图 / Data Asset / DataTable | 设计师配置数值和内容 |

**AI 要点**：
- **保留现有 C++／蓝图分工**。[Epic 官方 Skill](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/a6aa73ada02a9fb1f5415bec491f9942c519b297/skills/unreal-mcp/SKILL.md)描述蓝图创建／编辑和 live editor 状态检查，二进制格式不能推出蓝图对 Agent 天然不可见；但这不证明所有图和节点都可读改（2026-10-14 核实）。**[一手]**
- 需要修改蓝图时，先核对已有接口；使用 MCP 时发现具体工具并读取 schema，确认目标状态可回读、蓝图可编译，检查实际结果并验证相关行为（见 [01](01-toolchain.md)）。缺少必要入口就收窄自动修改，不默认迁成 C++。**[经验：采用判断]**
- DataTable 可以导入导出 CSV / JSON，**把数据的“真相来源”放在文本文件里**，Agent 就能直接读改和校验。

## 7. 常用的框架和系统

| 系统 | 说明 | AI 要点 |
|---|---|---|
| **[Subsystems](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-subsystems-in-unreal-engine)** | 生命周期由引擎管理的单例（GameInstance、World、LocalPlayer、Engine、Editor 子系统） | 比自己写单例安全；让 Agent 优先用子系统 |
| **[Enhanced Input](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine)** | Input Action + Input Mapping Context，UE5 的标准输入方案 | 模型常写出旧的 `BindAxis` / `BindAction`，要写明用 Enhanced Input |
| **Gameplay Tags** | 层级化的标签，用来描述状态、能力、事件 | 文本化、易检索，适合 Agent 使用 |
| **[GAS](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-ability-system-for-unreal-engine)**（Gameplay Ability System） | 技能、效果、属性的框架：AbilitySystemComponent、GameplayAbility、GameplayEffect、AttributeSet | 学习曲线陡、网络预测复杂；社区有专门的 Skill（如 maystudios 的 `unreal-gas`），需要人重点评审 |
| **Behavior Tree、[StateTree](https://dev.epicgames.com/documentation/en-us/unreal-engine/state-tree-in-unreal-engine)、EQS、Smart Objects** | 游戏 AI（NPC 行为）的标准工具 | StateTree 是 UE5 主推的新方案；注意和“AI coding”不是一回事 |
| **Mass** | 数据导向的大规模实体框架（人群、交通） | 5.8 大幅改进，API 仍在变化 |

## 8. 网络同步

[网络与多人](https://dev.epicgames.com/documentation/en-us/unreal-engine/networking-and-multiplayer-in-unreal-engine)要点：
- **服务器权威**：重要状态只在服务器修改，然后同步给客户端；用 `HasAuthority()` 判断；
- **属性同步**：`UPROPERTY(Replicated)` 或 `ReplicatedUsing=OnRep_X`，并在 `GetLifetimeReplicatedProps` 里注册；
- **RPC**：`UFUNCTION(Server, Reliable)`、`Client`、`NetMulticast`；Server RPC 要校验输入（防作弊）；
- 相关性（Relevancy）、网络频率、Iris（新的同步系统）影响带宽。

**AI 要点**：网络代码是**单机测试测不出问题**的典型。让 Agent 写网络逻辑时：
1. 先说明每段逻辑在哪一端执行；
2. 用 PIE 的多客户端模式或自动化测试验证；
3. 评审必须由懂网络同步的人参与。

## 9. 资产管理与打包

| 概念 | 说明 |
|---|---|
| 硬引用 vs 软引用 | 硬引用会连带加载；软引用（`TSoftObjectPtr`）按需加载，避免内存和加载时间膨胀 |
| **[Asset Manager](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-management-in-unreal-engine)** / Primary Asset | 管理可单独加载的资产（关卡、物品定义），用于打包分块和异步加载 |
| StreamableManager | 异步加载工具（5.8 新增按需“涓流加载”） |
| Cook | 把编辑器资产转换成目标平台格式 |
| DDC（派生数据缓存） | 缓存着色器编译、纹理压缩等结果；团队共享 DDC 能大幅加快打开和打包 |
| Pak / IoStore | 打包后的资产容器 |

**AI 要点**：Agent 常用同步加载（`LoadObject`、硬引用）解决“拿不到资产”的问题，结果造成卡顿和内存膨胀。要在 AGENTS.md 里写明：**哪些资源常驻、哪些按需加载，以及取消后由谁收尾**；小型常驻资源可以直接引用，不为“统一”强迁软引用。见[客户端模块](../04-client-modules.md#资源释放所有权驻留总内存分别看)。**[研究]**

## 10. 世界构建与渲染（UE5 的招牌技术）

| 技术 | 说明 | 5.8 状态 **[一手：5.8 发布说明]** |
|---|---|---|
| **[World Partition](https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-in-unreal-engine)** | 大世界自动按网格流式加载；配合 Data Layers、Level Instance；“一个 Actor 一个文件”（OFPA）减少多人编辑冲突 | 成熟 |
| **Nanite** | 虚拟化几何体，可以直接用高面数模型 | 5.8 改进掌机性能、植被 |
| **Lumen** | 实时全局光照和反射 | 5.8 新增 **Lumen Lite**（约为高质量模式的 2 倍速度） |
| **MegaLights** | 大量动态投影光源 | 5.8 正式可用 |
| Virtual Shadow Maps | 高精度阴影 | — |
| **PCG** | 程序化内容生成框架 | 5.8 增强 |
| Niagara、Sequencer、MetaHuman | 特效、过场、数字人 | 5.8 MetaHuman 支持单摄像头动捕 |
| **Mesh Terrain**、Procedural Vegetation Editor | 基于网格的地形、程序化植被 | 5.8 新增，实验性 |

**AI 要点**：
- 这些系统大多通过编辑器和资产配置，**适合通过 Unreal MCP 的工具集操作**，而不是让 Agent 写代码；
- “一个 Actor 一个文件”让关卡编辑的冲突变小，对**多个 Agent 或多人并行编辑同一关卡**有帮助；
- 性能问题（着色器编译卡顿、PSO）要靠 Unreal Insights 的数据定位，不要让 Agent 凭经验调参。

## 11. 测试、调试与日志

| 工具 | 用途 |
|---|---|
| Automation Spec / Automation Test | C++ 单元和集成测试，命令行运行（见 [02 第 4 节](02-large-project-guide.md#4-测试)） |
| Functional Test | 放在测试关卡里的 Actor，测试需要 World 的流程 |
| Gauntlet | 自动化测试编排，适合 CI 中多进程、多平台 |
| Unreal Insights | 性能和事件追踪 |
| `UE_LOG(LogCategory, …)` | 日志；为每个模块定义自己的日志分类，方便 Agent 过滤 |
| `check` / `ensure` / `verify` | 断言：`check` 失败直接崩溃，`ensure` 只报告一次并继续 |

**AI 要点**：让 Agent 给新模块**定义独立的日志分类**，以后排查问题时它可以只 grep 自己的分类，不用读整个日志。

## 12. 版本与路线（2026-10）

- **UE 5.8**（2026-06-17）是计划中的最后一个 UE5 大版本，重点是稳定和性能；内置实验性的 MCP 插件 **[一手：Epic 发布帖]**；
- 5.8.1 修复了 MCP 的响应分帧等问题 **[一手]**；
- UE6 的抢先体验目标是 2027 年底 **[二手]**；
- 分成：项目终身总收入超过 100 万美元的部分收取 5% **[经验：Epic 公开条款，以官网为准]**。

## 13. 汇总：UE 项目的 AGENTS.md 应该写清的基础信息

| 项 | 例子 | 不写会怎样 |
|---|---|---|
| 引擎版本、启动器版或源码版、引擎源码位置 | UE 5.8.1 启动器版，头文件在 `<引擎目录>/Engine/Source` | 写出旧 API，无从核对 |
| 模块列表和依赖方向 | `MyGameCore ← MyGameCombat ← MyGameUI` | 循环依赖、链接错误 |
| C++ 和蓝图的分工 | 现有职责边界、蓝图读改工具及编译／行为验证入口 | 越过工具覆盖范围修改，或为可读性擅自迁移逻辑 |
| 输入方案 | Enhanced Input | 写出 `BindAxis` |
| 网络模型 | 服务器权威，GAS 做技能 | 逻辑放错端、不校验 RPC |
| 资产加载 | 区分常驻直接引用与按需异步，指定句柄所有者 | 无预算连带加载、取消与完成重入、旧回调写新对象 |
| 日志分类 | 每个模块一个 `LogMyGameXxx` | 只能读整个日志 |
| 编译方式 | 改函数体 → Live Coding；改头文件 → 关编辑器完整编译 | 浪费时间或拿旧代码测试 |

模板见 [templates/AGENTS.md](templates/AGENTS.md)。
