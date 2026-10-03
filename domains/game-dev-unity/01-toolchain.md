# Unity AI 工具链

> 核实时间：2026-10-03。
> 依据：克隆并阅读 [Unity-Technologies/unity-agent-plugin](https://github.com/Unity-Technologies/unity-agent-plugin) 源码（33 个 Skill，约 7400 行 SKILL.md）**[一手]**；Unity 官网和文档站在整理环境中无法访问，相关内容来自搜索摘要 **[二手]**。

## 1. 官方方案

### 1.1 Unity CLI ✅（整个工具链的核心）

Unite 2026 发布，2026-06-30 进入 1.0 beta；Unity Hub 会自动安装 **[二手]**。官方插件中的 `unity-cli` Skill 给出了详细用法 **[一手]**：

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

**MCP 模式**：`unity mcp` 以 stdio 方式启动 MCP 服务器，把编辑器命令暴露为工具；`unity mcp configure` 一步写入 16 种客户端的配置；免费，没有并发限制 **[二手]**。

**已知的坑（官方 Skill 原文 [一手]）**：
| 坑 | 处理 |
|---|---|
| **Safe Mode**：项目有编译错误时编辑器以 Safe Mode 启动，Pipeline 包不加载，CLI 连不上；`unity recompile` 退出码为 7 | 运行 `unity pipeline list` 确认；从 Editor.log 过滤出 `error CS####`，修正源码后重启 |
| **Play 模式不等于运行正常**：失去焦点的编辑器可能停在第 1 帧，`unity status` 仍显示 playing，截图可能是冻结的画面 | 按官方 `playmode-verification-loop` 流程：确认帧在推进 → 截图 → 读 Console → 用 `eval` 实时调整 |
| 沙箱中的 Agent 可能看不到正在运行的编辑器 | 不要据此判断编辑器没开 |
| CLI 版本旧，会出现像是“文档写错了”的失败 | 运行 `unity self-update --check`，始终用最新版 |

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

### 1.3 Unity AI（编辑器内）🧪
2026-05-04 开放 Beta（Unity 6）**[二手]**：
- **AI Assistant**：编辑器内的 Agent，有 Ask / Agent / Plan 三种模式；
- **AI Gateway**：在编辑器里接入你自己的 Claude、GPT 等，**不消耗 Unity 点数**；
- **MCP Server**。
- 计费：Personal 版试用 14 天（1000 点数），之后每月 10 美元 1000 点；Pro、Enterprise、Industry 席位自带点数。

**定位**：适合编辑器内的小任务和资源生成；大型项目的代码工作仍以外部 Coding Agent 为主。

### 1.4 其他官方
- [Unity-Technologies/industry-ai-workflows](https://github.com/Unity-Technologies/industry-ai-workflows)：实验性插件市场，面向 Asset Manager、Asset Transformer（CAD/3D 处理）、管线自动化。
- Claude 官方市场里还有 `unreal-engine-skills-for-claude-code`（Unreal 用户参考）。

## 2. 社区 MCP

| 项目 | Unity 版本 | 特点 | 评级 |
|---|---|---|---|
| [CoplayDev/unity-mcp](https://github.com/CoplayDev/unity-mcp)（MCP for Unity） | 2021.3 LTS – 6.x | 最流行（约 1.4 万星）；资产、场景、脚本、测试、Profiling、构建；需要 Python 3.10+ 和 uv | ✅ **Unity 6 以下首选** |
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
| Unity 2021 / 2022 LTS | CoplayDev/unity-mcp + batchmode 脚本（见 templates） |
| 需要游戏运行时接 LLM（NPC 等） | IvanMurzak/Unity-MCP |
| 在编辑器内对话、做小任务 | Unity AI Assistant，或用 AI Gateway 接入 Claude |
| CI | `unity test` / `unity build`（退出码对 CI 友好） |

> ⚠️ 不要同时装多个 Unity MCP 或桥接工具：工具会重复，Agent 容易选错，上下文也会膨胀。

## 来源

- [Unity-Technologies/unity-agent-plugin](https://github.com/Unity-Technologies/unity-agent-plugin)（`skills/unity-cli/SKILL.md` 与 `references/`）
- [Unity-Technologies/skills](https://github.com/Unity-Technologies/skills)
- [Unity plugin – Claude 插件目录](https://claude.com/plugins/unity)
- [Unity CLI 参考](https://docs.unity.com/en-us/unity-cli/unity-cli-reference)、[Unity AI 开放 Beta](https://discussions.unity.com/t/unity-ai-s-open-beta-now-live-for-unity-6/1718560)（二手）
- 社区实测：[Claude Code 改 TPS 游戏](https://dev.classmethod.jp/en/articles/unity-mcp-tps-game-claude-code-modification/)、[2D 游戏压力测试](https://dev.classmethod.jp/en/articles/unity-mcp-claude-code-2d-game-verification/)（二手）
