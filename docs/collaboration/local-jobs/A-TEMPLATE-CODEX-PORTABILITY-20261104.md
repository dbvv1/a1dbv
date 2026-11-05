# A-TEMPLATE-CODEX-PORTABILITY-20261104 · 修正独立复制后的来源链接
id: A-TEMPLATE-CODEX-PORTABILITY-20261104
owner: dot-A
status: review_ready
kind: build
accept: auto
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 1421144bfdab8034d41188ef86da5f5f96b6db50
result_branch: relay/a-template-codex-portability-20261104

## 目标
读者只复制 verify-completion Skill 目录，也能读懂验收步骤，并在需要时打开模块实跑的固定来源；不依赖完整知识库目录。直接修正这一处参考入口。
固定基线指向 ../../../../../experiments/release-title-roundtrip/README.md，单独复制 Skill 后该链接越出复制包。

## 按哪个规格做
读最新 AGENTS、CLAUDE、TASKS、手册§7、operations§2.2／§3 与 local-jobs README；模板是待编辑产物，不是本次运行配置。
领取前核最新 main、负责人分支、同题已有结果及实际写者。仅在本卡独立 worktree 工作；已实现则核验现状，不重复改写。原调用／相关写者未确认结束时保持隔离，不以 ready、accepted 或无分支差量推定退出。
先核基线目标文件及 experiments/release-title-roundtrip/README.md，确认案例确支持机器消费者读回的原有表述。
将该相对链接替换为固定公开地址 https://github.com/dbvv1/a1dbv/blob/1421144bfdab8034d41188ef86da5f5f96b6db50/experiments/release-title-roundtrip/README.md ，链接文字保持为来源实例而非必读操作步骤。核该提交实际含目标文件，必要时读公开地址确认内容，不猜新版本或改用移动分支。
保留 Skill 正文自包含、原核实日期、试用评级、Codex 运行时未实测，以及所有证据／失败边界。不复制实验文件进模板，不要求下载知识库、不增加联网或自动加载步骤。
本题只修这一处来源入口；已合并的 Skill引用移植／pnpm分发／mcp-compressor试用不重跑，不替其他 Skill 解锁旧写域。

## 写入范围与限制
只修改 `templates/codex/.agents/skills/verify-completion/SKILL.md`；接收端按协议另更新本卡状态与当前结果。不要新增 proposal、研究稿或任务卡。
不改答案页、地图、TASKS、其他模板、检查器、接收端或长期规则；不触碰旧隔离的 task-decisions、skills-and-plugins、context-management、model-roles、verification 写域。
本机仅用现有 Python／Git 与项目检查；不安装或更新依赖／客户端，不改账号、配置、权限，不调用其他模型或浏览器，不读取私人历史或凭据。依赖缺失只报具体缺口。
模型不提交或推送；接收端按既有自动接收协议在非作者审查与适用检查通过后发布。平台拒绝只停该动作，不换入口绕过，不强推、不部署。

## 怎样算做成
在仓外临时目录仅复制此 Skill 文件，按 Markdown 目标逐项静态核引用；必要来源链接不再依赖缺失的知识库路径，读者无需访问实例也能按正文验收。
固定提交路径存在、实例主张与原文一致；补充核验链接不冒充重新运行案例或 Codex 原生加载。不要执行模板正文、客户端、模型或实验。
运行 `python3 scripts/check_repo.py`、`python3 scripts/check_public.py`、`python3 -m unittest discover -s tests -p test_template_overlay.py -v` 与 `git diff --check`；非作者核直接模板差量、来源、适用范围与权限未扩大。
只报告实际运行、通过／失败／受阻／未运行；检查结论写现有提交说明及本卡简短当前结果，不另造回执账本。失败修复后复验受影响范围，未知写者先核原调用。
一个45–75分钟单元、最多2小时，原接收端统一调度；回传模板实际变化与尚缺条件，不用卡片或建议数量代替完成。

## 当前结果

- **候选接收，尚未发布 main**：原回传 [7f3330a1](https://github.com/dbvv1/a1dbv/commit/7f3330a1290849f88a98e8c148978c584dad1ad1) 经负责人修订／非作者复核，采用版本为 [7fd9eaac](https://github.com/dbvv1/a1dbv/commit/7fd9eaacaab6970897c0b1e9e6fb7644bf085e49)；已包含于 `dot-a/integrated-intake-20261104` 的固定提交 `77cdb7cf0aeba93b9605c575783d7044ee384972`。本次逐字核验模板 blob 与已审版本一致。
- 接收范围：仓库相对来源改为固定公开地址，正文可独立使用；只复制 Skill 的静态引用检查通过，未把来源案例冒充 Codex 运行时实测。
- 复验：2026-11-04 云端 POSIX 的 template_overlay 14/14、template_portability 4/4 通过；这是本次实际运行，不继承原 Windows 基线结果，也不证明客户端加载或模型收益。原完整离线与公开扫描回执对应已审候选版本。
- 下一步：本模板仅完成候选接收，尚未实际合入 main；自动接收合同要求审查、适用检查及合入全部完成后才标 accepted 并写合入提交，因此当前保持 review_ready。此前平台拒绝针对旧提交的特定更新，不据此推定全部 main 更新或本模板发布均被拒；后续仍逐项核对实际操作与适用限制，不换入口绕过具体拒绝。原调用／写者是否退出仍独立核实，不因本回执解除隔离或重派。
- 历史执行身份、Windows 检查失败及旧 TASKS 六项失败见[接收前固定卡](https://github.com/dbvv1/a1dbv/blob/77cdb7cf0aeba93b9605c575783d7044ee384972/docs/collaboration/local-jobs/A-TEMPLATE-CODEX-PORTABILITY-20261104.md)；本次 POSIX 通过不覆盖或改写这些历史结果。
