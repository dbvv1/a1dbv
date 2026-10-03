# Gemini CLI 与 Antigravity

> 核实时间：2026-10-03。依据 [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) 仓库的 README、`docs/` 与 `docs/changelogs/`（v0.38–v0.61）**[一手]**。
> 评级：🧪 **试用**（预算敏感、多模态、Google 生态）

## 1. 基本情况

- 开源（Apache-2.0），`npm install -g @google/gemini-cli`；最新稳定版 **v0.61.0（2026-09-23）**，基本每周一个版本。
- **免费额度**：个人 Google 账号每分钟 60 次、每天 1000 次请求；Gemini 3 系列模型，1M 上下文。
- 文档站：[geminicli.com/docs](https://geminicli.com/docs/)。

## 2. 功能面（`docs/cli/` 目录）

ACP 模式、auto memory（带“收件箱”审阅流程）、checkpointing 与 rewind、Skills（含编写指南与最佳实践）、自定义命令、`GEMINI.md`、`.geminiignore`、git worktrees、无头模式、模型路由（model routing）、Plan 模式、沙箱（macOS Seatbelt / Docker）、受信任目录、token 缓存、Hooks、Extensions、语音模式。

和 Claude Code、Codex 的能力面**基本对齐**。

## 3. 2026 年值得注意的更新

| 版本 | 日期 | 要点 |
|---|---|---|
| v0.38 | 04-14 | “Chapters”叙事分组、上下文压缩服务 |
| v0.39 | 04-23 | `/memory` 收件箱；Plan 模式下启用 Skill 需确认 |
| v0.41–0.42 | 05 | 实时语音模式；auto memory 收件箱；默认启用 Gemma 4 |
| v0.44 | 05-27 | Unified Auto Mode；Sublime Text / Emacs 集成 |
| v0.54 | 08-06 | 集成 **Antigravity agent runner** 做 PR 自动化 |
| v0.58–0.61 | 09 | **几乎全是安全加固**：symlink 与容器 socket 隔离、MCP OAuth SSRF、workspace trust 改为默认拒绝、扩展环境变量需授权、通过构建文件与不可信参数的**间接提示注入** |

> **解读**：8–9 月密集的安全修复说明 Coding Agent 已成为真实的攻击目标（另见 [10-security](../10-security.md)）。无论用哪家，都要保持更新。

## 4. Antigravity

Google 的“Agent 优先”开发环境，与 Gemini 3 深度绑定，能异步编排多个 Agent，也提供托管 Agent（`antigravity-preview-05-2026`，公开预览）**[二手]**。Superpowers 等插件已支持用 `agy plugin install` 安装 **[一手]**。

评级：👀 **评估**。可以关注，但本仓库未能直接核实其文档。

## 5. 适用场景

- 需要**截图、图片等多模态输入**的任务。
- 预算有限，或想用免费额度做批量、低风险的任务。
- 已在 Google Cloud 生态中。

## 来源

- [gemini-cli README](https://github.com/google-gemini/gemini-cli)、[docs/changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs)
- [Google Antigravity（Wikipedia）](https://en.wikipedia.org/wiki/Google_Antigravity)（二手）
