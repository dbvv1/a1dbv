# A-COMMUNITY-PRACTICE-SCAN-20261027 · 中文社区真实采用与撤回
id: A-COMMUNITY-PRACTICE-SCAN-20261027
owner: dot-A
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: e297a7a9b18417c5b7707e26c388d0c9a11e307a
result_branch: relay/a-community-practice-scan-20261027

## 目标
给 dot-A 可回源的中文实践材料：哪些 AI coding 做法真的被用于开发、哪里失效或被撤回，足以改变“下一步值得试什么”的选择。只收材料，推荐、试用和正文发布由 dot-A 做。

## 按哪个 Skill 与规格做
1. 读最新 `AGENTS.md`、`CLAUDE.md`、`docs/collaboration/operations.md` §2.2、本目录 README；按 `templates/generic/.claude/skills/explore-frontier/SKILL.md` 第 1–2 步发现，不执行推荐或默认化。
2. fetch 后核 main、负责人分支和在途任务；查 `docs/collaboration/inbox.md`、`docs/13-frontier-radar.md`、`docs/research/2026-10-15-exploration-evidence.md` 去重。WIDE-SCAN 的中文社区部分由本任务独占；不重做 A-FRONTIER-SOURCE-COLLECTION 的跨包 API／下游契约专题。
3. 主窗是 2026-10-22 至实际读取截止：查 LINUX DO、V2EX 新帖、旧帖的新实用回复，以及过去热点的后续采用／撤回；决定性旧文可追溯并保留原日期。不重复 Taste、context-mode、Superpowers 等旧例，只有新证据改变现有选择才保留。
4. 从 [LINUX DO 最新](https://linux.do/latest)、[V2EX 程序员节点](https://www.v2ex.com/go/programmer) 沿实际问题找原帖，不只搜 Claude Code，也覆盖 Codex、OpenCode、多 Agent、Skill、审查、上下文和交付。点赞、回复数仅作发现线索，不据此排名或认定效果。
5. 已核可读起点：[V2EX 实际怎么跑](https://www.v2ex.com/t/1251873) 的 #32 只作退出框架的个人自报，不推断 OpenSpec 过时；#36 的 timzaak/web-dev-skills 已由 dot-A 追固定源码，本任务只记线索、不重复深挖。[工程化约束](https://www.v2ex.com/t/1251785) 同读 #2 的交接修正及 #5／#12／#15 的测试争议，核作者说法与回复是否相互修正，重点扩展其他新原帖及真实反例。入口不是预定合格候选，本机须核实际读取范围。
6. 后续追踪起点：[LINUX DO T-Tools 持续实践](https://linux.do/t/topic/1988118?page=2)、[V2EX Treefold](https://www.v2ex.com/t/1250974)；仓内已读到的部分只作基线，找新回复、后续公开配置／提交／实际产物，不把原帖构想或作者自推重报为采用。
7. 有公开搜索时用 `site:linux.do/t/topic/` 或 `site:v2ex.com/t/` 加实际问题／项目名、`after:2026-10-21`；日期过滤仅作线索，回原页核日期。没有搜索工具就用现有浏览器／正常 HTTPS 读上述列表及其分页，再进原帖和回复；不要求新装搜索服务或新凭据。
8. 不只读主帖或高赞回复：读有实质内容的正反回复、作者后续更正与退出理由，沿引用追到原始 Skill／配置／项目／PR／产物；固定源码用完整 SHA。只看得到部分评论就标覆盖范围，不能称全帖已读；摘要单列，不用摘要确认采用。
9. 每项写清：来源及原帖／回复定位；真实任务；实际做法；谁采用、可见结果与结果证据；反对反馈或撤回原因；发布／回复／提交日期与核实时间；仓内增量及待 dot-A 验证的未知。作者宣传、作者自用、独立使用者自报、可核代码分别标明；没有对照不写因果收益。
10. 无同题反对原文就写查过哪里和未找到；缺配置、消费者或结果就标缺口。没有强项可交零候选的负结果与排除原因，不凑数量、不交泛泛工具名单，token 消耗和点赞数不当产出效果。
11. 遇明确拒绝停止该入口并记原因，不换身份、代理、登录态或关闭 TLS／访问控制绕过；继续独立可读来源。技术失败与权限拒绝分开写，禁止把没读到说成没有新反馈。

## 写入范围
模型唯一成果：`docs/collaboration/local-jobs/artifacts/A-COMMUNITY-PRACTICE-SCAN-20261027/sources.md`。先给最有增量的发现与证据，再写排除项、实际渠道、读取截止与缺口。
接收端只另更新本任务状态与当前结果，过程和检查写提交说明；不改 inbox、13、TASKS、正文、模板或接收端脚本。不安装／运行候选、不调用新模型、不读私人材料、不注册账号、不发社区帖子／评论。
只推指定 relay 结果分支并回 `review_ready`，不用 `accept: auto`，不合入 main；公开产物不含本机路径、私人会话、账号用量或凭据。

## 怎样算做成
按接收端固定原生 Workflow 实施、非作者独立审查、必要修正与复审；检查原始链接支持具体事实，正反回复、真实结果、时间和去重均可核，不把来源采集写成实测通过。运行适用 `check_repo`、`check_public` 和空白检查。
单次最多两小时；与 B 共用最多四并行，由接收端自行调度，不抢占 B 的运行实例，不要求立即占满四槽。回传固定提交与产物链接，领取不算探索完成。

## 当前结果
待接收端领取；回传有增量的原始材料或有据可查的负结果，由 dot-A 选择后续深挖。
