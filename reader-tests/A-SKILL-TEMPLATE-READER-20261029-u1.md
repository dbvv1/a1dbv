# reader test：A-SKILL-TEMPLATE-READER-20261029 u1

读者：未参与写作的新会话。只按任务文件所附页面全文 `docs/decisions/skills-and-plugins.md` 选择路径。

## 做到哪一步 / 产物

- 按页面“第一轮怎么做”选路径：没有项目已启用的匹配 Skill，走“没有匹配项”分支，用现有工具完成文档同步。
- 产物（相对仓库根）：
  - `templates/generic/AGENTS.md`：“推进与撤回”新增按任务查已有 Skill／MCP 的入口。
  - `templates/README.md`：使用步骤第 2 步补入口说明；组件依据表新增一行。
  - `docs/collaboration/local-jobs/artifacts/A-SKILL-TEMPLATE-READER-20261029/result.md`：任务结果。
  - 本记录。
- 未提交、未推送、未切换分支；未改页面、Skill、配置、脚本、TASKS、任务文件。

## 卡点（页面哪一句 → 缺什么 / 做错什么）

1. “第一轮怎么做”里的“先按项目指令和当前启用能力，选择覆盖本任务的 Skill”与同节“模板目录中的示例不自动成为当前项目指令。”
   - 缺什么：仓库根没有 `.claude/`，没有覆盖“文档同步”的项目级 Skill；`templates/generic/.claude/skills` 与领域模板里的 Skill 只是示例，页面也明说不能当当前项目指令。
   - 怎么处理：按同节“没有匹配项，先用现有资料和工具”直接做，不调用无关 Skill、不安装。

2. “第一轮怎么做”里的“用 [原测试命令或实际操作] 验收。”——任务卡指定 `python3 -m unittest discover -s tests -p test_template_overlay.py -v`。
   - 缺什么：本机是 win32 + Git Bash。Python 的临时目录给出 `C:\...` 目标，空项目配方按 POSIX 把它当相对路径，在仓库内生成一个名为 `C<U+F03A>` 的目录，断言读不到目标文件；结果是 25 failures／4 errors。
   - 做错什么：先直接跑测试，留下该目录；随后跑 `check_repo.py` 报 “missing link target”，我一度把它当成本次改动的问题，实际是测试残留。删除该目录后 `check_repo.py` 恢复 554/0。
   - 补救证据：用 POSIX 目标目录手动执行 unity／unreal 两份空项目配方，均 rc=0、通用 AGENTS.md 无缺失行、新入口出现在生成文件。本次只改两份 Markdown，失败点在内容检查之前。

3. “分开检查调用和任务结果。”里的“手动读文件按手动加载记录。”
   - 手动读了 `templates/generic/.claude/skills/task-decisions/SKILL.md` §3 核对现状，只记为“手动读取”，不记为客户端加载成功，也没有走完整决策流程。

4. 环境小坑：`check_repo.py` 在输出重定向到文件时按 GBK 报 `UnicodeEncodeError`；直接输出到终端正常。属于本机 stdout 编码，与本次改动无关；最终用直接输出复核。

## 页面没写、按自己理解做的决定

- 页面没有给出“怎样算当前已启用”的检查清单。我以仓库根有无 `.claude/`、项目指令是否引用 Skill 为准，并把模板目录里的 Skill 判为示例，不当作已加载。
- 页面没有规定入口写在哪一节。我把 AGENTS 的入口放进“推进与撤回”，把 README 的说明放进“使用步骤”第 2 步与组件依据表。
- 页面没有要求 AGENTS 同时写“插件按实际组件选择”。为与首屏路线一致，我把这句一并写入，但保留“不新增安装”的限制。

## 页面之外还翻了什么

- 任务文件 `job.md`：取任务与页面全文（页面本身由它提供）。
- 项目指令：根 `AGENTS.md`、`CLAUDE.md`。
- 待改文件：`templates/generic/AGENTS.md`、`templates/README.md`（必须读原文再改）。
- 页面这一版所在文件 `docs/decisions/skills-and-plugins.md`：核对工作区副本与任务文件所附全文一致；未修改。
- `templates/generic/.claude/skills/task-decisions/SKILL.md`：页面与任务卡都指向 §3，读它确认已更新；属“所选 Skill 正文”，手动读取。
- `git log/show 017a3363`：确认这次基线只同步了 task-decisions §3，剩余是通用 AGENTS 与模板 README；未据此改页面或另找解法。
- `tests/test_template_overlay.py`、`domains/game-dev/unity|unreal/templates/README.md`：理解验收命令与空项目配方如何拼接 AGENTS.md。
- 没有读其他 a1dbv 文档，没有搜同主题教程，没有访问外部网站、MCP 或插件市场。
- 能力分支未走到：页面中的插件安装、Context7、Serena、Superpowers、各客户端加载与失败恢复，均未验证。

## 结果

- 入口与页面路线一致：先查已有 Skill／MCP；有匹配就复用配方和检查，无匹配照常完成；缺领域知识再取作者 Skill，缺操作能力再补 MCP，插件按实际组件选择。
- task-decisions 仍仅用户显式调用或指定读取，普通任务不加载完整流程。
- `check_repo` 554/0、`check_public` 975/0、`git diff --check` 通过；单元测试受 win32 环境限制，如实记录为未通过。

## 核对（验证者，未参与照做）

**结论：任务做成。** 实际 diff 只有 `templates/generic/AGENTS.md`、`templates/README.md` 两处，加上 `result.md` 与本记录；页面、Skill、配置、脚本、TASKS、任务文件未动。新入口与页面首屏、“第一轮怎么做”的路线一致：先查已有 Skill／MCP，有匹配配方复用入口、命令与检查，没有匹配项照常完成；缺领域知识取作者 Skill、缺操作能力补 MCP、插件按实际组件选择；task-decisions 仍只在用户显式调用或指定读取时读，普通任务不加载完整流程。

**验收复跑**

- `python3 scripts/check_repo.py`：556 files，0 errors，rc=0（比读者记录的 554 多出的两个即本记录与 `result.md`；清理测试残留后复跑）。
- `python3 scripts/check_public.py`：975 files，0 findings，rc=0。
- `git diff --check`：rc=0。
- `python3 -m unittest discover -s tests -p test_template_overlay.py -v`：10 tests，25 failures／4 errors，rc=1，与读者记录一致。失败集中在空项目目标目录、已有文件／符号链接和 locale 子用例，错误发生在读取生成产物之前，与本次两份 Markdown 无关。
- 用 POSIX 目标手动执行 unity、unreal 空项目配方：均 rc=0；生成的 `AGENTS.md` 含新增入口行，且源 `AGENTS.md` 的非空行缺失数为 0；`templates/README.md` 新链接目标 `docs/decisions/skills-and-plugins.md` 存在。
- 四个新增／修改文件均为 UTF-8、LF、无 BOM；我运行测试留下的仓库内残留已清理，`git status` 只有预期的两项修改与两项未跟踪。

**卡点判定**

1. 没有项目级 Skill → page（次要）。页面没给“当前启用”的检查清单，但同节已写明模板示例不算当前指令，并给出“没有匹配项”分支；读者按页面处理正确，不阻塞。
2. win32 下测试失败 → model（另有环境因素）。配方把不以 `/` 开头的目标当相对路径，Windows 临时目录因此写错位置；页面方括号本就允许用“实际操作”验收。读者先直接跑测试留下残留，并把 `check_repo` 的报错当作自己改动的问题，属自身处理失误；随后清理并用 POSIX 目标复核，结果可接受。
3. 手动读取只记手动加载 → model（非阻塞）。页面已明确“手动读文件按手动加载记录”，读者按此执行无误，不必列为卡点。
4. GBK 输出报错 → model。见下条。

**读者没意识到的错误**

- GBK 报错的实际触发字符是测试残留目录名里的 `U+F03A`，不是单纯的重定向噪音。我保留残留时用管道运行 `check_repo.py` 复现了同一 `UnicodeEncodeError`，清理后重定向输出恢复正常；它和 `check_repo` 报的链接错误是同一个残留根因。读者把两类现象分开归因，容易掩盖脏工作树。
- 对照页面“第一轮怎么做”的提示块，新入口少了“说明路径与选择理由”（README 第 4 步只部分覆盖“所选 Skill/角色”），也没写“不额外复制外部配方的审批流程”。不影响本次主线验收，但不是逐句对齐。
