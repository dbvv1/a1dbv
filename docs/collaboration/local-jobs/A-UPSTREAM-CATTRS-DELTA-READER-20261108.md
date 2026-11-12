# A-UPSTREAM-CATTRS-DELTA-READER-20261108 · 新提案出现后的贡献判断
id: A-UPSTREAM-CATTRS-DELTA-READER-20261108
owner: dot-A
status: accepted
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 7f54b4c5deb57b08f9cd0fb56af6967116ff023d
result_branch: relay/a-upstream-cattrs-delta-reader-20261108
page: docs/decisions/upstream-contributions.md@3f445adee874b68045fe718576ef2678782c2828

## 当前接收决定（2026-11-12 UTC）

**限定接收（`accepted`）**：接收37b1ba8历史只读准入及接收方11-12对main e9239b7、#761／#764／#822、政策和五后端差量的只读补核，不追记为旧读者首次证据；当前性来源见接收日档。旧页3f445ade及候选bde101a5结果不代表新版／当前main通过，apply、测试和投稿闭环未验，放弃本轮可投稿断言，不新增实现／投稿，不挂72小时。

本节按[既定逐项去向](../archive/completed-through-2026-11-12.txt)回写，取代下文旧状态与续派安排；历史产物和验证记录保留。本卡已收口，不再等待接收端回写或自动重派。原结果分支不变，既有未验范围及隔离另行保留。

## 真实任务与输入
为 cattrs 的 [Decimal 需求 #761](https://github.com/python-attrs/cattrs/issues/761)决定本仓已有候选现在应怎样推进。本仓 10 月 23 日已完成五后端候选，未投稿；此后 11 月 3 日出现新的 [PR #822](https://github.com/python-attrs/cattrs/pull/822)，另有原 [PR #764](https://github.com/python-attrs/cattrs/pull/764)。这是新提案出现后的贡献决定，不重做旧实现或重复页面的 Memos／Datasette／Qwen 案例。
新读者只照所附修订页面，自行核当前贡献入口、相关规则、两条提案、当前源码与已有候选，给负责人一个有据的下一步。不要预设提交、等待、撤回或沿用其中某条 PR 为答案。
接收端将[完整输入](artifacts/A-UPSTREAM-CATTRS-DELTA-READER-20261108/input.txt)中的任务和完整页面原样附入实际读者任务。该页不是链接代读；缺少全文则回 blocked，不自行补取后声称已经附入。相对链接以 page 固定路径为基准。
观察起点为 2026-11-08 UTC：#761 open；#764 [head 8c04cdb5](https://github.com/python-attrs/cattrs/commit/8c04cdb5b7c2eeeb10f231f1f574ed02b185dbd9)，#822 [head 2e883761](https://github.com/python-attrs/cattrs/commit/2e883761ca61b076c3de45a5d976952226347c2c)，均 open／unmerged、mergeable=false。元数据不是行为结论；执行时重新核实际目标分支及变化。
候选输入固定为 a1dbv@7f54b4c5deb57b08f9cd0fb56af6967116ff023d 的 experiments/cattrs-decimal/decimal-preconf.patch、test_decimal_preconf.py、patched-sha256.json、requirements.lock、pytest.ini、LICENSE 及 evidence/replay-report.json、evidence/baseline-encoding.txt、evidence/baseline-roundtrips.txt。它们可作为材料读取，不执行。
旧验证对应 cattrs bde101a5a67997c61a3ee0e971386a82fe141d4e、Python 3.12.14；原始汇总留在上述 replay-report.json。没有本次新版测试，读者须按页面判定哪些旧证据仍能支持决定。

## 只照页面做
本题读者必须是未参与页面／cattrs 候选写作、未看本题处置的新上下文。只给任务、完整页面与上述原始候选材料；不附负责人分析，不续用旧读者上下文。
允许读取目标项目当前贡献规则及其引用规则、README 导航、issue／PR 模板、#761／#764／#822 的公开正文讨论和差量、相关源码、版本与 CI 元数据；可作直接相关的提案去重查询。页内其他原始项目规则仅按需读。
不得读取 cattrs 实验 README、a1dbv 历史处置、研究记录、其他任务结果或旧读者答案。原始补丁是本题已有输入，不是允许读取作者投稿判断。工作区已有其他文件不代表获准阅读。
按页面给当前可执行动作、它与旧候选／在途提案的关系、还缺哪些证据或由谁决定，以及需要补验的变动范围。区分提案、已合代码、发布版及实际执行结果；旧测试和 bot 状态不能自动证明当前候选可交付。
仅公开只读与文本／差量核对；不安装依赖，不运行项目、测试、浏览器或额外模型，不修改产品或应用补丁，不创建 issue／PR／fork、不评论、不签协议、不申请 CI、不改账号／权限或部署。投稿是后续单独动作，不由本卡发出。
遇明确拒绝只停该动作，不换入口绕过；不恢复 Datasette／Qwen socket、Memos QA、extruct 停止任务或任何旧调用。不读取私人会话、用户配置、凭据、用量、模型／worker 日志或宿主提示。

## 单写者与回传
领取前由既有接收端核本题无重叠在制、共享空槽和原活动；未知不能当已退出。不修改旧候选、旧 worktree 或其锁，也不为本卡停止其他任务。新卡独立 worktree 与结果路径，同 ID 不重放；输入变化沿本卡恢复合同。
模型只新增 docs/collaboration/local-jobs/artifacts/A-UPSTREAM-CATTRS-DELTA-READER-20261108/result.md，给决定、证据、页外帮助与实际卡点、未运行范围；不改页面、模板、TASKS、输入或其他卡。
接收端只另回写本卡，并可按既有 reader-test 流程生成 reader-tests/A-UPSTREAM-CATTRS-DELTA-READER-20261108-u1.md；不得把整个工作区或临时源码收进提交。只推 result_branch，回 review_ready；不用 accept: auto，不合 main。
只用既有安全可分离的调用元数据，核本次确为新上下文、实际附页字节与下方固定版本一致、实际材料范围；在公开回执记核验方法与可核结论，不复制私有 ID、路径或日志。没有这类证据就写 unknown，不改接收器、不读私人会话来补证。

## 非读者验收与节奏
非读者核实际输入及隔离证据，再回当前上游规则、差量和源码验证结论；不以读者自报代替。页面缺信息、执行能力和未运行环境分别记录；本卡只验真实贡献判断，不声称投稿成功、运行新版或页面已可标绿。
接收端按文档范围跑 check_repo、check_public、空白与新增提交身份检查；保留其他历史。通常 60–90 分钟、最多两小时，沿共享最多四任务合同；不另开调度，不依赖 dot 桌面在线。Git 发布只证明可被领取，不证明已经执行。

## 历史结果（接收决定见页首）

- 读者照页完成只读核查：cattrs 无 AGENTS.md/PR 模板，等价入口为 CONTRIBUTING.md、.github/AI_POLICY.md、.github/ISSUE_TEMPLATE.md；main=e9239b7 与最新发布 v26.2.1 均无 Decimal；#761 open 无 label，#764(head 8c04cdb5)/#822(head 2e883761) 均 open/unmerged/mergeable=false 且只覆盖 json+pyyaml，故不能收起五后端候选；结论为先重放 current main、补 HISTORY.md 并把测试并入 tests/test_preconf.py，由本人协调 #822/#764 后再投稿，不新开第三条 PR。taskDone=true；pageStuck 2 处：页面未写禁止 apply/运行时“是否覆盖/能否干净应用”只能是静态或 unknown，也未写协调评论受项目 AI 政策与本卡禁评论限制及由谁执行。未运行验收：just lint/test/cov/docs、候选补丁 apply 及候选在 current main 的实际通过情况均 unknown（本卡禁跑），不以核对者返回代替通过。openIssues：候选测试顶部无条件 from msgspec import to_builtins，PyPy 直接并入 tests/test_preconf.py 会 collection 失败，需加 skip 或拆分后端；读者写 #822 base=e9239b7 但 head 父提交是 bde101a（落后 6 提交），rebase 依据应写后者；CONTRIBUTING 第 3 条指向仓库中不存在的 README.rst，读者只写“更新文档”；pyyaml 行为候选测试已用 Decimal(str(v)) 固化，真正待决定是保留该特例还是采用 #822 的统一 Decimal(v)；读者下一步先重放后协调与页面字面顺序相反；读者多读 evidence/input-guards.json 超出固定候选输入并已自报，未影响判断。
- 产物：[37b1ba8](https://github.com/dbvv1/a1dbv/commit/37b1ba8e2a9e9fd01e1eeec72c5abdc685b6f1b3)，分支 `relay/a-upstream-cattrs-delta-reader-20261108`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人修正 result.md/过程记录中的上述遗漏（PyPy skip、#822 父提交、README.rst、pyyaml 取舍、协调顺序），决定是否回灌页面口径，并安排本人重放与 #822/#764 协调；不自动重读。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
