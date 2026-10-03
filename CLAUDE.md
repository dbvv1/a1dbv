# CLAUDE.md

本文件为 Claude Code 在此仓库中工作时提供指引。

## 仓库性质

这是一个 **AI Coding 知识库 + 配置模板**仓库：收集、验证、分析 AI 辅助编程的工具、方法和配置。
主干是通用 AI coding（`docs/`）；具体领域（如 Unity 游戏开发）放在 `domains/` 下作为分支。目前没有可构建的程序。

## 目录

- `docs/`：主干文档，编号就是阅读顺序；`docs/README.md` 定义了评级和证据体系
- `domains/<领域>/`：领域分支，只写相对主干的增量
- `templates/`：可拷贝到**其他项目**的配置。`templates/**/.claude/` 和 `domains/**/templates/.claude/` 是模板，**不是本仓库自身的配置**；Claude Code 在这些目录下工作时可能会发现其中的 Skill，这不代表本仓库要用它们
- `ai-config/`：个人本地 AI 配置的脱敏导出；`scripts/`：辅助脚本

## 编写约定

- 文档用中文；工具名、命令、代码保持原文。
- **每条事实都要有证据等级标记**：[一手] / [社区] / [研究] / [二手] / [经验]（定义见 `docs/README.md`）。只有搜索摘要的必须标为二手或“摘要”。
- 工具和实践要给出**评级**（✅ 采用 / 🧪 试用 / 👀 评估 / ⛔ 暂缓），并说明适合谁、不适合谁、坑在哪。不要只堆链接。
- 文档头部写“核实时间”；内容过时就直接修改或删除。
- 新发现的东西先放进 `docs/12-resources.md` 的“待验证”列表，验证后再写进正文。
- 优先找一手来源：GitHub 上的源码、changelog、issue（可以 `git clone --depth 1` 后阅读），以及官方文档和工程博客。
- 修改 `templates/` 或 `domains/**/templates/` 下的脚本后，要用模拟输入实际跑一遍（Hook 用伪造的 JSON stdin；Unity 脚本用伪造的 `unity` CLI 或编辑器可执行文件）。
- 文本文件统一 UTF-8、LF 换行、2 空格缩进（见 `.editorconfig`、`.gitattributes`）。

## 安全

- 本仓库是 **public**：禁止提交密钥、token、内部地址、公司项目代码或本机绝对路径。
- 导出个人配置必须经过 `scripts/export-ai-config.sh` 的扫描，再加人工审查。
