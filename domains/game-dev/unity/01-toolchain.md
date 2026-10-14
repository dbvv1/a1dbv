# Unity AI 工具链

> 核实时间：2026-10-05；WP9 的官方接入、二次导入契约于 2026-10-14（UTC+8）复核；官方 Pipeline 故障回退与异步验证边界于 2026-10-14 UTC 补核。
> 依据：克隆并阅读 [Unity-Technologies/unity-agent-plugin](https://github.com/Unity-Technologies/unity-agent-plugin) 源码（33 个 Skill，约 7400 行 SKILL.md）；读了 [Unity CLI 更新日志](https://docs.unity.com/en-us/unity-cli/release-notes)和 [Unity MCP 官方博客](https://unity.com/blog/unity-ai-mcp-how-to-get-started) **[一手]**。

## 1. 官方方案

### 1.1 Unity CLI ✅（整个工具链的核心）

2026-06-30 发布 1.0.0-beta.1，**本轮核实发布页顶部为 1.0.0-beta.13（2026-10-07）**；Unity Hub 会自动安装 **[一手]**。官方插件中的 `unity-cli` Skill 给出了详细用法 **[一手]**：

**驱动正在运行的编辑器**（需要 Unity 6.0 及以上，项目中安装 Pipeline 包 `com.unity.pipeline`：`unity pipeline install`）：
```bash
unity status                       # 确认已连接编辑器（state 为 ready）
unity command                      # 列出编辑器暴露的命令
unity command editor_play          # 例如进入 Play 模式
unity command eval --caller plugin --skill <skill名> 'new UnityEngine.GameObject("Joe");'   # 执行任意 C#
unity recompile                    # 让运行中的编辑器重新编译并报告编译错误
unity command editor_play --project-path /path/to/Proj   # 打开了多个编辑器时要指定项目
```
- 编辑器常驻时，命令约 **200–600ms** 返回，不需要重新编译或 domain reload。
- **beta.12 新增** **[一手]**：
  - `unity projects create --with-pipeline`：新建项目时就装好 Pipeline 包，编辑器一打开 Agent 就能驱动它；
  - `unity status --format json` 在 Play 模式下返回 **`frameCount` 和 `playerLoopTicking`**，可以据此判断游戏是不是真的在运行；
  - `unity command <name> --result-only` 只输出结果；
  - `unity projects exec -- <命令>` 对所有项目批量执行；`unity projects clean` 清理缓存。
- 可以用 `[CliCommand]` 和 `[CliArg]` 特性**自定义**暴露给 Agent 的命令。

**无头运行、测试、构建**：
```bash
unity run  <proj> -- -executeMethod Builder.Build        # 自动 batchmode，不要自己加 -batchmode/-quit
unity test <proj> --mode EditMode --filter "MyGame.Combat" --output ./results/edit.xml
unity test <proj> --affected --since origin/main         # 只跑受改动影响的测试
unity test <proj> --shard 2/5                            # CI 分片
unity test <proj> --report-format nunit,junit --coverage
unity build --target StandaloneWindows64 --output-path ./Build/Game.exe --format github
```
- 退出码：`unity test` 返回 **8 = 有测试失败**，**6 = 基础设施问题**（编译错误、License、崩溃、超时）。CI 可以只重试 6、不重试 8。
- `unity commands --grep <关键词>` 搜索命令；CI 中用 `UNITY_SERVICE_ACCOUNT_ID` / `UNITY_SERVICE_ACCOUNT_SECRET` 认证。

**MCP 模式** **[一手]**：
- `unity mcp` 以 stdio 方式启动 MCP 服务器，把编辑器命令暴露为工具；`unity mcp configure <客户端>` 一步写入配置。
- 配置 Claude Code 时，如果已经启用的插件里有同样的 `unity mcp` 服务器，它会提示并跳过，避免**重复注册**。
- `unity bug mcp`（等同于 `unity mcp configure --server issue-tracker`）：把 **Unity Issue Tracker** 接给 AI，让它在你报 bug 之前先查是不是已知问题。

**已知的坑（官方 Skill 原文 [一手]）**：
| 坑 | 处理 |
|---|---|
| **Safe Mode**：项目有编译错误时编辑器以 Safe Mode 启动，Pipeline 包不加载，CLI 连不上；`unity recompile` 退出码为 7 | 运行 `unity pipeline list` 确认；从 Editor.log 过滤出 `error CS####`，修正源码后重启 |
| **Play 模式不等于运行正常**：失去焦点的编辑器可能停在第 1 帧，`unity status` 仍显示 playing，截图可能是冻结的画面 | 按官方 `playmode-verification-loop` 流程：确认帧在推进 → 截图 → 读 Console → 用 `eval` 实时调整 |
| 沙箱中的 Agent 可能看不到正在运行的编辑器 | 不要据此判断编辑器没开 |
| CLI 版本旧，会出现像是“文档写错了”的失败 | 查官方 release notes，记录 CLI/Pipeline/Editor 版本并受控升级，不把最新版视为资产兼容保证 |

**✅ CLI／MCP 按客户端能力二选一，不当作故障回退。** 官方 CLI／MCP 的运行中 Editor 操作共用项目 Pipeline；Safe Mode 导致包未加载时，换 `unity mcp` 仍无法驱动它，应由已有文件工具／操作者依据编译日志修复 `.cs` 后恢复连接。已有原生 Editor 脚本满足任务就继续用；这不推断第三方桥也共用同一故障域。[一手／经验]

**测试与截图须读结果。** 官方 beta.13 已声明修正异步 `run_tests` 启动时误显示“0/0 passed”，启动后仍须按 `test_status` 取得终态与实际执行范围；不要把这条异步 Editor 命令和上方 `unity test` 的退出码混为一谈。`unity mcp` 的视图截图在主线程不响应时可回退为整个桌面，必须核返回说明与其他窗口隐私，不能当指定 Game View 已验证。来源与限定见 [WP9 §10](../../../docs/research/2026-10-14-game-wp9-engine-handoff.md#10-入口可调用不等于编辑与验证闭环)。[一手／研究]

### 1.2 Unity 官方 Agent 插件 ✅

```bash
# Claude Code
/plugin marketplace add Unity-Technologies/unity-agent-plugin
/plugin install unity@unity-agent-plugin        # 也已收录进 Claude 官方插件市场
# Codex
codex plugin marketplace add Unity-Technologies/unity-agent-plugin
codex plugin add unity@unity-agent-plugin
```
- 发布于 2026-09-09；**要求 Unity 6 及以上**；项目需要处在版本控制下。
- 33 个 Skill（2026-10-03 仓库快照）：

| 类别 | Skills |
|---|---|
| 工具与项目 | `unity-cli`、`new-unity-project`、`unity-package-management`、`generate-editor-search-query` |
| UI | `ui`、`ui-ugui`、`ui-uitk`、`ui-imgui`、`optimize-text-mesh-pro` |
| 2D | `2d-pixel-perfect`、`sprite-editor`、`sprite-segment-3x3grid`、`manage-sprite-atlas`、`tilemap-palette-create`、`tilemap-ruletile-createempty`、`tilemap-ruletile-createfromsegment` |
| 渲染 | `migrate-birp-to-urp`、`urp-postprocessing`、`validate-urp-render-graph-renderer-feature`、`shader-graph-create-custom-node` |
| 物理与导航 | `physics-3d-collision`、`initialize-ai-navigation` |
| 音频 | `audio-setup-mixers`、`optimize-audio` |
| 多人与服务 | `setup-multiplayer-services`、`setup-vivox-voice-chat`、`build-live-game` |
| 商业化 | `implement-in-app-purchases`、`levelplay-unity-integration` |
| 其他 | `optimize-web`、`localization`、`build-gtk`、`asset-transformer-toolkit` |

- 其他 Agent（Cursor、Copilot、Cline 等）可以用 `npx skills add Unity-Technologies/skills` 安装同一套 Skill。
- Pipeline 包里还带了一个更深入的 `unity-pipeline` Skill，用 `unity skill install <client> --local` 复制出来。

**评价**：这些 Skill 偏重**功能搭建**（UI、2D、URP、服务接入），对**大型项目的代码架构、重构、性能**帮助有限，这部分仍然要靠项目自己的 AGENTS.md、Skill 和评审子 Agent（见本目录 templates）。

### 1.3 编辑器内 Assistant 与已弃用的旧 MCP

**🧪 有编辑器内对话／生成需求时再选 Assistant，外部 Agent 默认用免费 CLI/Pipeline。** 当前[官方 FAQ](https://unity.com/features/ai)区分编辑器内 Assistant（消耗点数，Personal 试用后 $10/月）、不消耗 Unity 点数的第三方 AI gateway，以及免费的 CLI、MCP server 和官方插件。**[一手]**

**⛔ 不再新用 `com.unity.ai.assistant` 包内 MCP server。** [官方迁移说明](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli)已将其弃用，替代者是基于 Pipeline 的 `unity mcp`；该 CLI MCP 模式继续支持。能可靠执行 shell 时也可直接用 CLI；同时保留 Assistant 的项目需留意官方注明的 2.13+ 共存修复。**[一手]**

**关键局限**：付费 Assistant 或官方身份不构成二次资产替换更可靠的证据，生成结果仍须核验规格、权利及真实引擎表现。**[经验]**

### 1.4 其他官方
- [Unity-Technologies/industry-ai-workflows](https://github.com/Unity-Technologies/industry-ai-workflows)：实验性插件市场，面向 Asset Manager、Asset Transformer（CAD/3D 处理）、管线自动化。
- Claude 官方市场里还有 Epic 的 `unreal-engine-skills-for-claude-code`，和 Unity 方案的对比见 [01 引擎工具链对比](../01-engine-integration.md)。

## 2. 社区 MCP

| 项目 | Unity 版本 | 特点 | 评级 |
|---|---|---|---|
| [CoplayDev/unity-mcp](https://github.com/CoplayDev/unity-mcp)（MCP for Unity） | 2021.3 LTS – 6.x | 最流行（约 1.4 万星）；资产、场景、脚本、测试、Profiling、构建；需要 Python 3.10+ 和 uv | 🧪 **旧版 Unity 的候选桥，逐工具核对契约** |
| [IvanMurzak/Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) | — | 70+ 工具；**支持运行时（游戏内）接入 LLM**；一行特性就能定义自定义工具 | 🧪 需要运行时 AI 时用 |
| [CoderGamester/mcp-unity](https://github.com/CoderGamester/mcp-unity) | 6+ | Node.js + WebSocket；30+ 能力 | 👀 |

**社区实测反馈** **[二手]**（classmethod 的两篇实测文章）：
- 3D 场景修改：能摆放几何体，但**接不上已有环境、美术风格不一致**（材质不统一、门洞对不上、室内没灯、比例错误、Static 标记没设）；
- 2D 复杂玩法：**“代码看起来没问题，但游戏实际不可玩”**；不过在性能问题上能做出合理的架构调整（预分配 1500 发子弹的对象池、用手算距离替代物理计算）。
- **结论**：AI 擅长代码和结构性工作，**不擅长美术一致性和手感**。验收必须实际玩一遍。

## 3. 选型建议

| 场景 | 推荐 |
|---|---|
| Unity 6+，用 Claude Code 或 Codex | 官方插件 + Unity CLI（Pipeline 包）。社区 MCP 一般不需要 |
| Unity 2021 / 2022 LTS | 评估固定版本 CoplayDev/unity-mcp + batchmode 脚本；资产替换遵循下节，不直接重跑新增导入 |
| 需要游戏运行时接 LLM（NPC 等） | IvanMurzak/Unity-MCP |
| 在编辑器内对话、做小任务 | Unity AI Assistant，或用 AI Gateway 接入 Claude |
| CI | `unity test` / `unity build`（退出码对 CI 友好） |

> ⚠️ 不要同时装多个 Unity MCP 或桥接工具：工具会重复，Agent 容易选错，上下文也会膨胀。

## 4. 批量导入与二次替换

**✅ 采用已有 importer 和明确的字段所有权；🧪 社区桥只补所缺入口。** Coplay 10.3.0 固定源码的 `import_model_file` 在目标同名文件存在时添加 `_1` 等后缀，适合导入候选新模型，不能当原位替换；`manage_asset` 的 import 是另一条已知路径重导入入口。其 move/rename 处理器还有与 Unity `MoveAsset` 返回契约相反的判定，属于**源码层潜在误报，未实测**；该 move/rename 误报路径应先修正并验证，结果不明确时按原 GUID 回读路径，不盲重试。固定 SHA、外围包装及测试范围见 [WP9 研究](../../../docs/research/2026-10-14-game-wp9-engine-handoff.md)。**[一手＋研究＋经验]**

**✅ 导入规格先用 Presets，持续规则才加 AssetPostprocessor。** Unity [官方目录 Preset 示例](https://docs.unity3d.com/6000.0/Documentation/Manual/DefaultPresetsByFolder.html)已有规则优先级及依赖追踪扩展，可处理 preset 变化后旧资产重导入；只把项目明确归导入器管理的字段交给规则，保留自定义 pivot、材质 remap 与状态机。普通 PNG 沿用 TextureImporter/Data Provider；确实使用 Aseprite 源文件时再评估兼容官方包与层 UUID。**[一手＋经验]**

**关键局限**：官方 Sprite Smart 也按矩形重叠复用旧对象，重排后可能保留 ID 却改变含义；仍须核对源语义、子资产、锚点及旧使用点。**[一手＋经验；本轮未运行引擎]**

## 来源

- [Unity-Technologies/unity-agent-plugin](https://github.com/Unity-Technologies/unity-agent-plugin)（`skills/unity-cli/SKILL.md` 与 `references/`）
- [Unity-Technologies/skills](https://github.com/Unity-Technologies/skills)
- [Unity plugin – Claude 插件目录](https://claude.com/plugins/unity)
- [Unity CLI 更新日志](https://docs.unity.com/en-us/unity-cli/release-notes)、[Unity CLI 参考](https://docs.unity.com/en-us/unity-cli/unity-cli-reference)、[Unity MCP 官方博客](https://unity.com/blog/unity-ai-mcp-how-to-get-started)
- [Simon Willison：2026 in LLMs](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)（关于用 Agent 做游戏的观察）
- 社区实测：[Claude Code 改 TPS 游戏](https://dev.classmethod.jp/en/articles/unity-mcp-tps-game-claude-code-modification/)、[2D 游戏压力测试](https://dev.classmethod.jp/en/articles/unity-mcp-claude-code-2d-game-verification/)（二手）
