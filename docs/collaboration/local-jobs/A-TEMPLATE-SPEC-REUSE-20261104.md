# A-TEMPLATE-SPEC-REUSE-20261104 · 复用已有需求与规格入口
id: A-TEMPLATE-SPEC-REUSE-20261104
owner: dot-A
status: blocked
kind: build
accept: auto
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 1421144bfdab8034d41188ef86da5f5f96b6db50
result_branch: relay/a-template-spec-reuse-20261104

## 目标
读者调用需求访谈时，只补会改变实现的决定，在已有需求或规格中留下当前契约；不再为已有充分规格另建同义 SPEC.md。直接修改模板。
固定基线第4步无条件写出 SPEC.md，与现行 planning-and-tests 的按缺口选择、沿用已有规格路线有具体差距。

## 按哪个规格做
读最新 AGENTS、CLAUDE、TASKS、手册§7、operations§2.2／§3 与 local-jobs README；模板是待编辑产物，不是本次运行配置。
领取前核最新 main、负责人分支、同题已有结果及实际写者。仅在本卡独立 worktree 工作；已实现则核验现状，不重复改写。原调用／相关写者未确认结束时保持隔离，不以 ready、accepted 或无分支差量推定退出。
只读 docs/decisions/planning-and-tests.md 的起步与短规格段，以及当前模板；沿已定路线作最小调整，不重新研究或设计工作流。
先查现有需求、源码可回答的事实与有效规格；只问无法从已有材料取得、且会改变行为或实现的决定。信息够用时，优先在已有合适契约中更新；没有适当入口才建 SPEC.md。
保留显式调用、采访阶段不实施代码、稳定验收 ID、正常与失败路径、未决问题与验收变更理由。模板结构可用于新建，也可帮助检查既有文档的必要缺口，不强制重排完整旧文档。
保持 frontmatter、AskUserQuestion 入口和原有权限边界；访谈完成不自动授权后续实现或发布。不要扩展到其他 Skill、项目规则或模型配置。

## 写入范围与限制
只修改 `templates/generic/.claude/skills/spec-interview/SKILL.md`；接收端按协议另更新本卡状态与当前结果。不要新增 proposal、研究稿或任务卡。
不改答案页、地图、TASKS、其他模板、检查器、接收端或长期规则；不触碰旧隔离的 task-decisions、skills-and-plugins、context-management、model-roles、verification 写域。
本机仅用现有 Python／Git 与项目检查；不安装或更新依赖／客户端，不改账号、配置、权限，不调用其他模型或浏览器，不读取私人历史或凭据。依赖缺失只报具体缺口。
模型不提交或推送；接收端按既有自动接收协议在非作者审查与适用检查通过后发布。平台拒绝只停该动作，不换入口绕过，不强推、不部署。

## 怎样算做成
非作者只读新模板回答：已有规格充分时如何避免重问与重复文件；代码可查的事实怎样处理；尚有关键产品取舍时问什么；真正新需求应留下什么契约。
核稳定验收及变更理由未丢，已有指令要求专用规格路径时仍遵守，不擅自替换权威需求；语义验收不能宣称客户端已加载或模型收益已测。
运行 `python3 scripts/check_repo.py`、`python3 scripts/check_public.py`、`python3 -m unittest discover -s tests -p test_template_overlay.py -v` 与 `git diff --check`；非作者核直接模板差量、来源、适用范围与权限未扩大。
只报告实际运行、通过／失败／受阻／未运行；检查结论写现有提交说明及本卡简短当前结果，不另造回执账本。失败修复后复验受影响范围，未知写者先核原调用。
一个45–75分钟单元、最多2小时，原接收端统一调度；回传模板实际变化与尚缺条件，不用卡片或建议数量代替完成。

## 当前结果

- check_repo 未通过，未推送
