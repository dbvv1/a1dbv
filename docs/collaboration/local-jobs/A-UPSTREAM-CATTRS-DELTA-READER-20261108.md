# A-UPSTREAM-CATTRS-DELTA-READER-20261108 · 新提案出现后的贡献判断
id: A-UPSTREAM-CATTRS-DELTA-READER-20261108
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 7f54b4c5deb57b08f9cd0fb56af6967116ff023d
result_branch: relay/a-upstream-cattrs-delta-reader-20261108
page: docs/decisions/upstream-contributions.md@3f445adee874b68045fe718576ef2678782c2828

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

## 当前结果
首次 ready；全远端与 main 未见同题卡／结果分支，新结果路径未占用，不重派旧卡。实际活动与空槽仍由接收端核，未称已退出或开始执行。修订页与地图保留 🟡。
