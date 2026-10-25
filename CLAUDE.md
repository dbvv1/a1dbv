# CLAUDE.md

本文件为 Claude Code 在此仓库中工作时提供指引。

## 仓库性质

这是一个 **AI Coding 知识库 + 配置模板**仓库：收集、验证、分析 AI 辅助编程的工具、方法和配置。
主干是通用 AI coding（`docs/`）；具体领域（如 Unity 游戏开发）放在 `domains/` 下作为分支。目前没有可构建的程序。

研究方向以 `AGENTS.md` 的“方向锚点”为准（由用户维护）。参与维护时，开工只需读三份文件：`AGENTS.md` 方向锚点、`docs/collaboration/LONG-TERM-PLAN.md`（运行手册）、`docs/collaboration/TASKS.md`。

## 目录

- `docs/`：主干文档，编号就是阅读顺序；`docs/README.md` 定义了评级和证据体系
- `domains/<领域>/`：领域分支，只写相对主干的增量
- `templates/`：可拷贝到**其他项目**的配置。`templates/**/.claude/` 和 `domains/**/templates/.claude/` 是模板，**不是本仓库自身的配置**；Claude Code 在这些目录下工作时可能会发现其中的 Skill，这不代表本仓库要用它们
- `ai-config/`：个人本地 AI 配置的脱敏导出；`scripts/`：辅助脚本

## 编写约定

- 文档用中文；工具名、命令、代码保持原文。
- **先给决定和做法**：按读者的问题组织完整段落，首句给推荐或结论，再解释理由、步骤和取舍。来源链接与原核实日期在对应语义节末集中一次；相同事实合并，代码和操作入口仍在使用处。来源类型影响判断时注明，只有搜索摘要的仍标“摘要”；纯操作节无需另凑依据行。
- **限制只保留会改变决定的事实**：版本、许可、安全、适用条件和实际未验证的关键效果在相关位置写一次。其余重复范围声明、连续否定句和过程叙述删去；重组整节，避免换词或搬标签后正文更长。改写不刷新核实日，不改变原推荐或把未知结果写成通过。
- **示例**。原文：“**中档起点不等于全程中档。** 同一长任务只换推理投入时，另核保缓存的换档入口，不要把它与换模型混为一谈。”改为：“**按角色选推理档：协调和实现用中档起步，跨文件找遗漏的审查直接试 `high`。** 同一任务中途换档，走保缓存的入口。”结论变成可以照做的选择，限制只剩一条会改变做法的。
- 工具和实践要给出**评级**（✅ 采用 / 🧪 试用 / 👀 评估 / ⛔ 暂缓），并说明适合谁、不适合谁、坑在哪。不要只堆链接。
- 文档头部写“核实时间”；内容过时就直接修改或删除。
- 新发现的工具、开源项目和做法写进 `docs/13-frontier-radar.md` 页首的“值得一试”表，标明试用结果或“未试用”；试过并比较后，再进对应的决策页。
- **官方、社区、开源三方对照**：官方文档说明能做什么，社区（真实使用者、技术论坛讨论）说明好不好用、坑在哪，GitHub 开源项目说明高手实际怎么做；只看官方的结论不算前沿。
- **找来源先追上限，核实再选合适的来源**：先找当前最高水平的做法（见 `AGENTS.md` 核心原则 1）；核实时 API、价格、权限回官方文档和源码（GitHub 上的源码、changelog、issue，可以 `git clone --depth 1` 后阅读），体验和效果回作者、使用者原文和同题比较。
- 社区反馈要读原帖，不要只看搜索摘要：HN 用 Algolia API（`hn.algolia.com/api/v1/items/<id>` 可拿到评论），Lobsters 和 V2EX 有 JSON 接口；arXiv 用 `export.arxiv.org/api/query?id_list=` 拿摘要，用 `arxiv.org/html/<id>` 读正文。
- 修改 `templates/` 或 `domains/**/templates/` 下的脚本后，要用模拟输入实际跑一遍（Hook 用伪造的 JSON stdin；Unity 脚本用伪造的 `unity` CLI 或编辑器可执行文件）。
- 文本文件统一 UTF-8、LF 换行、2 空格缩进（见 `.editorconfig`、`.gitattributes`）。

## 安全

- 本仓库是 **public**：禁止提交密钥、token、内部地址、公司项目代码或本机绝对路径。
- 导出个人配置必须经过 `scripts/export-ai-config.sh` 的扫描，再加人工审查。
- 推送前：按运行手册§7完成适用检查及 `python3 scripts/check_public.py` 公开内容扫描、`python3 scripts/check_public.py --commits origin/main..HEAD` 确认提交身份是 GitHub noreply 邮箱或脚本白名单里的 Agent 机器身份，并读一遍 `git diff`。详见 `AGENTS.md` 执行约定“公开仓库安全”。
