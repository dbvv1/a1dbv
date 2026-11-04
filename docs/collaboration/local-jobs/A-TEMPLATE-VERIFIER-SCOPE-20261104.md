# A-TEMPLATE-VERIFIER-SCOPE-20261104 · 按影响范围接收验证证据
id: A-TEMPLATE-VERIFIER-SCOPE-20261104
owner: dot-A
status: blocked
kind: build
accept: auto
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 1421144bfdab8034d41188ef86da5f5f96b6db50
result_branch: relay/a-template-verifier-scope-20261104

## 目标
读者复制 verifier 后，能核实当前任务真正完成了什么，复用仍有效的检查，并把缺证据与失败分开。直接修改模板，不另交提案文件。
固定基线的步骤2要求运行全部项目检查，输出只列二元判定；本轮对齐已采用的按影响范围验证与证据复用，不新增验收层。

## 按哪个规格做
读最新 AGENTS、CLAUDE、TASKS、手册§7、operations§2.2／§3 与 local-jobs README；模板是待编辑产物，不是本次运行配置。
领取前核最新 main、负责人分支、同题已有结果及实际写者。仅在本卡独立 worktree 工作；已实现则核验现状，不重复改写。原调用／相关写者未确认结束时保持隔离，不以 ready、accepted 或无分支差量推定退出。
只读基线 docs/decisions/long-tasks.md 的“接回之后”、docs/decisions/verification.md 与 templates/generic/.claude/skills/handoff/SKILL.md 的证据复用条件；以当前有效原文核对差量。
将步骤2改为先核当前目标、改动与已有证据，运行缺失、受影响或影响不明的适用检查；相关代码、输入、消费者、依赖、环境、命令及验收要求均纳入判断。已核无影响的原证据可复用，保留其原版本与范围，不写成本次重跑。
保留独立反例核验和完成判定；每项证据区分通过、失败、受阻、未运行及有理由的不适用。必需条件未满足不能判完成，不强制普通文案跑全仓测试。
保留 frontmatter、工具权限和原有只读评审边界；不把临时验证写成生产修改，不新增 schema、账本或框架。

## 写入范围与限制
只修改 `templates/generic/.claude/agents/verifier.md`；接收端按协议另更新本卡状态与当前结果。不要新增 proposal、研究稿或任务卡。
不改答案页、地图、TASKS、其他模板、检查器、接收端或长期规则；不触碰旧隔离的 task-decisions、skills-and-plugins、context-management、model-roles、verification 写域。
本机仅用现有 Python／Git 与项目检查；不安装或更新依赖／客户端，不改账号、配置、权限，不调用其他模型或浏览器，不读取私人历史或凭据。依赖缺失只报具体缺口。
模型不提交或推送；接收端按既有自动接收协议在非作者审查与适用检查通过后发布。平台拒绝只停该动作，不换入口绕过，不强推、不部署。

## 怎样算做成
非作者只读修改后的模板，分别回答四个真实使用问题：纯文案应验什么；仅无关文档／提交号变化能否复用旧检查；消费者改变需补什么；只有旧成功自报能否完成。答案必须保留原证据身份、影响判断与未验范围。
这些是模板语义验收，不是新读者模型实验或收益对照。模板不能授权重跑未知外部写入，不能以复用掩盖已有失败。
运行 `python3 scripts/check_repo.py`、`python3 scripts/check_public.py`、`python3 -m unittest discover -s tests -p test_template_overlay.py -v` 与 `git diff --check`；非作者核直接模板差量、来源、适用范围与权限未扩大。
只报告实际运行、通过／失败／受阻／未运行；检查结论写现有提交说明及本卡简短当前结果，不另造回执账本。失败修复后复验受影响范围，未知写者先核原调用。
一个45–75分钟单元、最多2小时，原接收端统一调度；回传模板实际变化与尚缺条件，不用卡片或建议数量代替完成。

## 当前结果

- check_repo 未通过，未推送
