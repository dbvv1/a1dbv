# B-UNITY-ADOPTION-001 · Unity 最小工程的真实修改闭环

id: B-UNITY-ADOPTION-001
owner: dot-B
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 010336d7
result_branch: relay/b-unity-adoption-001
accept: auto

读者：有已授权 Unity 的独立开发者，要让 Agent 不只改 C#，还能交付可运行且能继续修改的工程。
增量：复用本仓模板和已有官方工具，做原创“收集物开门”最小工程，走完脚本修改、真实编译／测试、构建及第二次需求修改。
验收：非作者在同一已安装引擎从 README 复现，核两轮测试报告、构建结果和保存重开的序列化值；无引擎结果不算通过。

## 先核能力，再做完整单元

先同步 main，读 AGENTS、CLAUDE、dot-B 提示词、TASKS、game-taskbook、01-engine-integration、unity/README、unreal/README 和 WP9 既有材料；核在制分支与同任务认领，已有产物续接而非新建同项。
仅由既有接收端用已配置 Claude Code＋DeepSeek 原生 Workflow（实施＋非作者独立验证）执行，不新建 Codex／cloud_threads，不读私有工程、会话、密钥。
只在新的隔离公开样例目录核已安装 Unity、版本、现有许可和可用构建模块；不得安装新引擎、登录真实账户、激活／接受新许可、创建凭据或增加权限。
缺少已授权可用引擎／许可则把本任务写 blocked，具体区分“缺安装”“许可不可用”“无法确认”；不要以 dotnet／mock 测试冒充 Unity，也不为了交差另写一般教程。可继续独立公开源码准备，保留恢复条件。

## 已有选择与复用

默认先复用 `domains/game-dev/unity/templates/` 的编译／测试脚本，复制到样例后按已配置入口填写，不在模板目录直接执行安装或引擎命令；本任务授权在新样例创建所需项目文件，不扩展旧项目权限。
已有官方 CLI／Pipeline 就复用；没有实时桥而 batchmode＋Editor API 足够时不装桥。CLI test 本身直接调用 Editor，不要求 Pipeline；编辑器开着时不要对同工程另起 batchmode。
官方插件固定候选：Unity-Technologies/unity-agent-plugin `3831ddbf8d2f4b7c58d2f53474cfe99b812c77c6`，重点读 `skills/unity-cli/references/build-run-test.md` 和 `playmode-verification-loop.md`；命令以本机版本 help 为准，不盲抄最新版参数。
10-21 官方 beta.14 已细分环境退出码 11／12／13／14；现模板统一归环境错误不误绿，但诊断依实际版本。参考[发布说明](https://discussions.unity.com/t/unity-cli-1-0-0-beta-14-is-rolling-out/1739999)，不得调用 terms accept 或 accept-upgrades 代用户确认。
对照 CoplayDev/unity-mcp 现有工具与测试工作流，不并装第二个桥；来源和默认选择沿 WP9，不重做工具榜。Unreal 仅解释相同验收在其现有入口的差异，不创建第二工程。

## 原创最小可复制工程

写在 `experiments/unity-agent-adoption/`：原生简单形状、一个场景、一个可控角色、若干收集物、一扇门；不借第三方角色、美术或音频，不新造通用框架。
采用当前已安装 Unity 版本和可用内置模板／管线，锁定 ProjectVersion、依赖；让 Editor 生成资源和 meta，不手写场景／Prefab YAML。保留实际需要的源与生成入口，不提交 Library、Temp、构建包或原始机器日志。
第一轮：Agent 修改脚本，收集 3 件后门开启且可进入终点；用真实 EditMode／PlayMode 测试核重复触发不重复计数、门与收集状态、重开／重置，构建当前已安装目标并实际运行基本场景。
第二轮：同一旧场景／Prefab 的阈值从 3 改 5，并保留一个有意的非目标实例覆盖；经 Editor API 改序列化值而不是只改 C# 默认值。保存重开后核值、引用和保留覆盖，相关测试、构建与运行再验。
每轮记录源版本、准确引擎／包版本、实际命令、退出结果与测试非零数量；测试报告、BuildReport 和运行状态各自核，不凭一个退出码宣称全链通过。截图仅是画面证据，帧推进／玩法断言另验。
若真实运行暴露模板问题，只修与本闭环直接相关的模板脚本并补正常／失败／缺失输入回归；不顺手重写模板权限基线。

## 回流和范围

可写：本任务、`experiments/unity-agent-adoption/`、01 引擎接入对应采用段、unity/README 与直接相关模板、既有 WP9 对应段。正文优先给可复制入口、实际推荐和一条关键未验，不堆执行台账。
不改方向锚点、共享 TASKS、07、assets、案例产品、Unreal 文件、CI、部署或账户设置；不强推、不删除分支。
非作者先只读 README 回答“第一步怎么运行、第二改为什么必须改场景状态、何时此结果不适用”，再实际复现相关检查；关键源码／来源对照，发现问题修正一次后复核。
按手册§7跑适用测试、check_repo、公开扫描、提交身份与差异审阅，以命令级 noreply 提交。自动接收仅限以上已定 a1dbv 范围，通过后快进合入 main；阻塞只停依赖实跑并回写本任务，不填假成功。

## 当前结果

2026-10-26：**blocked（许可不可用）**。已安装编辑器无法取得授权许可，本单元停在引擎能力核实；没有创建 Unity 工程，没有测试、构建、运行或序列化结果，`experiments/unity-agent-adoption/` 尚未产出。

**已核实（2026-10-26 UTC+8；许可探测为实际 batchmode 退出码，模块状态为安装目录文件检查，不是静态推断）**

- 引擎与模块：本机已安装 2022.3.64f1、2022.3.60f1 和 2022.3.60f1c1（中国版）。按同一口径检查，三版磁盘上都有相同的 Windows Standalone 支持（`PlaybackEngines/windowsstandalonesupport`，含 IL2CPP 与 `win64_server_*` 变体）和 `Editor/Data/il2cpp`；三版 `modules.json` 的 `windows-il2cpp`、`windows-server` 均未标 `isInstalled`，其中 2022.3.64f1 与 2022.3.60f1 只把 Visual Studio 标为已安装，2022.3.60f1c1 未标任何模块。因此只确认支持文件已在磁盘上，未执行构建验证，不能据此认为构建模块可用。因下述许可问题均未执行构建。
- 许可探测：在隔离公开样例目录用 `-batchmode -nographics -quit -createProject <样例目录>` 分别启动上述三个 2022.3 编辑器。2022.3.64f1 退出码 198，2022.3.60f1 与 2022.3.60f1c1 退出码 1；日志均为 `No valid Unity Editor license found. Please activate your license.`，未生成 `ProjectSettings/ProjectVersion.txt`。
- 许可客户端：报 `No ULF license found` 与 `Token not found in cache`；`com.unity.editor.headless`、`com.unity.editor.ui`、`com.unity.editor.legacy.pro` 等 entitlement 均为 `granted: False`、`group: (null)`。没有可用的本地许可或已登录令牌。
- 另有一处 2020.3.26f1 非 Hub 安装能通过许可阶段启动，但启动日志出现 `EditorHacking > Address and domain whitelist disabled`，随后因包缓存中 `com.unity.timeline@1.4.8` 的 `IPlayableBehaviour` 接口不匹配而中止；不能证明它是已授权可用引擎，也无法建立干净基线，未采用。
- 边界：未登录任何账户、未激活或接受许可、未安装新引擎、未创建凭据、未读取私有工程；探测目录（含 Logs 与临时 Library）已删除，未进入版本库。
- 结论类型：**许可不可用**，不是“缺安装”，也不是“无法确认”。本机已有目标版本编辑器与 Windows 构建支持文件，缺的是可用许可；支持文件能否支撑构建，须待许可恢复后实测。

**恢复条件**

由用户在 Unity Hub 登录并激活可用许可，或放置有效的本地许可文件；执行者不代为登录、激活或接受条款。恢复后以 2022.3.64f1 为目标版本，用同一 `-createProject` 探针复核，要求退出码 0 且生成含该版本的 `ProjectSettings/ProjectVersion.txt`；确认后再从第一轮继续：创建 `experiments/unity-agent-adoption/` 工程、三件收集物开门、真实 EditMode／PlayMode 测试与 Windows 构建运行，再做第二轮阈值 3→5 的 Editor API 序列化修改。许可未恢复前，本任务不产生工程或验证结论。
