# A-SKILL-TEMPLATE-READER-20261029 结果

状态：已完成剩余同步；验证分项记录如下。

## 选择路径

- 页面首选是“先按当前任务调用项目已有 Skill，使用其中的项目配方与检查”（`docs/decisions/skills-and-plugins.md` 首屏与“第一轮怎么做”）。
- 本任务是文档同步。仓库根目录没有 `.claude/`；`templates/generic/.claude/skills/` 与领域模板中的 Skill 都是供其他项目复制的示例，页面明确“模板目录中的示例不自动成为当前项目指令”。因此没有覆盖本任务的已启用项目 Skill，走“没有匹配项”分支：沿用现有资料和工具，不额外调用 Skill、不安装。
- 手动读取 `templates/generic/.claude/skills/task-decisions/SKILL.md` §3，确认其已按任务卡所述更新；只作为正文证据，不按完整决策流程执行。task-decisions 仍仅用户显式调用或指定读取。

## 改动（相对仓库根）

- `templates/generic/AGENTS.md`：在“推进与撤回”新增入口。开工先按项目指令与当前启用能力查覆盖任务的已有 Skill／MCP；有匹配配方就按允许方式读取正文及必要引用，复用入口、命令与检查；没有匹配项照常完成，只在具体缺口处建议一项补充并说明来源、版本与作用域；缺领域知识取作者 Skill，缺操作能力补 MCP，插件按实际组件选择；不加载任务决策 Skill 完整流程，不新增安装、联网、外部写入或发布权限。
- `templates/README.md`：使用步骤第 2 步补同样的按任务复用 Skill 入口；组件依据表新增一行，链到 `../docs/decisions/skills-and-plugins.md`。
- 未改页面、Skill、配置、脚本、TASKS、任务文件；未提交、未推送、未切换分支。

## 验证

- `python3 scripts/check_repo.py`：554 个文件，0 errors，退出 0。
- `python3 scripts/check_public.py`：975 个文件，0 findings，退出 0。
- `git diff --check`：退出 0。
- `python3 -m unittest discover -s tests -p test_template_overlay.py -v`：本机 win32 下 10 个测试出现 25 failures／4 errors。失败集中在临时目录与符号链接处理，早于对 AGENTS／CLAUDE 内容的检查；本次只改两份 Markdown，未触及这些路径。用 POSIX 目标目录手动执行 unity／unreal 两份空项目配方，均 rc=0，通用 AGENTS.md 无缺失行，新入口出现在生成文件。
- 原命令、权限、拒绝规则和配置未动；未新增安装、网络服务或发布权限。

## 卡点与新增步骤

- 无项目级 Skill 可直接调用：按页面“没有匹配项”分支处理，没有新增安装或网络步骤。
- 指定测试命令在 win32 下不能直接通过；新增本地验证步骤为“用 POSIX 目标手动执行空项目配方”，只作本次证据，不改变仓库验收口径。
- 未走到：页面中的插件安装、Context7／Serena／Superpowers、各客户端加载与失败恢复；均未验证。
