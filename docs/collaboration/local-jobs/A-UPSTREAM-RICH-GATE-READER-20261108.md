# A-UPSTREAM-RICH-GATE-READER-20261108 · 重复方案出现后如何推进旧候选
id: A-UPSTREAM-RICH-GATE-READER-20261108
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 0c91ee9a1b62fff3c380ee47664222ca1281c88c
result_branch: relay/a-upstream-rich-gate-reader-20261108
page: docs/decisions/upstream-contributions.md@0c91ee9a1b62fff3c380ee47664222ca1281c88c

## 真实任务与输入
为 Textualize/rich 的 [#4246](https://github.com/Textualize/rich/issues/4246)决定已有零裁剪候选现在该怎样推进。已有候选针对 `Text.right_crop(0)`／`remove_suffix("")` 清空文本但保留旧长度的真实问题，已完成固定版本本地验证，未向上游投稿。现在 issue 已有多位贡献者提出同样的 guard，其中新增评论出现于 2026-11-07；需要按当前项目规则和源码决定下一步，不再造第四份同题实现。
接收端将[完整输入](artifacts/A-UPSTREAM-RICH-GATE-READER-20261108/input.txt)的任务与整页原样附入实际模型正文。附页固定为上方 page，UTF-8 16522 字节、SHA256 `11a3ab3e6fc758d006fb35b22f9b2cf9ca1d27de55919d47136d1de97ee4acf1`；缺少全文或独立性不能确认则 blocked，不自行补取后补称已附页。
原始候选仅为 a1dbv@fde4fda1e37c1cf42e5a62b0d8040a64f5c280d6 的 `experiments/rich-zero-crop-candidate/candidate.patch`、`verification.json`、`LICENSE`。沿该提交取原字节，只读，不应用或运行。候选基线 Rich `9d8f9a372cc5916fd4781fec207ced7ddac2f08f`；运行结果只对应记录中的 Linux／Python 3.12.14 与该候选，不自动继承为当前版本。

## 只照页面做
本题读者必须是未参与页面／Rich 候选写作、未看本题处置的新上下文；只给本任务、完整页面及上述原始材料。不要预设投稿、等待、评论、换实现或收起候选为答案，不附负责人分析与旧作者判断。
允许只读 Rich 当前贡献规则及其要求续读的规则、README 导航、issue／PR 模板、#4246 全部公开正文与讨论、相关 PR／提交／当前源码、版本与 CI 元数据；同题去重只查该问题及 `right_crop`／`remove_suffix`，不扩展其他项目或选新 bug。页内其他原始规则只按需核，不复查其旧案例。
不得读取本仓 Rich 实验 README、历史处置、研究记录、其他任务结果或旧读者答案。工作区已有文件不代表获准阅读；原始补丁与验证记录不是允许读取作者投稿判断。
按页面给当前可执行动作、与已有提议及候选的关系、仍缺的证据／决定和负责主体，并列若继续实施会受当前变化影响的检查。区分方案获准、作者准入、已合代码、发布版、旧运行结果与本次静态核对；缺失规则或访问失败保留 unknown。
仅公开只读与文本／差量核对；不安装依赖，不应用补丁，不运行项目／测试／浏览器／额外模型，不修改产品，不创建 issue／PR／fork、不评论、不签协议、不申请 CI、不改账号／权限、不部署。不恢复其他旧调用或被拒动作。遇明确拒绝只停该动作，不换入口绕过。
不读取私人会话、用户配置、凭据、用量、模型／worker 日志或宿主提示。不得把独立核对者追加的信息追记为读者首次自己取得的证据。

## 单写者与回传
领取前由既有接收端核本题无重叠在制、共享空槽与原活动；Git 无 running 不证明空槽、桌面在线不证明接收端健康。未知保留隔离，不修改旧候选／旧卡／worktree／锁，不为本卡停止其他任务。本卡独立目录和结果路径，同 ID 不重放。
模型只新增 `docs/collaboration/local-jobs/artifacts/A-UPSTREAM-RICH-GATE-READER-20261108/result.md`，写决定、原文依据、具体页外帮助／实际卡点及未运行范围，不改答案页、模板、TASKS、输入或其他卡。
接收端只另回写本卡，可按原 reader-test 流程生成 `reader-tests/A-UPSTREAM-RICH-GATE-READER-20261108-u1.md`；不把临时源码或整个工作区收进提交。模型结果仅推 result_branch，回 review_ready，不自动合入 main；本卡 running／review_ready 生命周期状态仍由接收端按 README 先后快进回写 main。不用 accept: auto。
沿既有安全可分离的调用元数据，核新上下文、实际附页字节及材料范围；公开回执只记核验方法和可核结论，不复制私有 ID、路径或日志。没有这类证据写 unknown，不改接收器、不读私人会话补证。

## 非读者验收与节奏
非读者独立核实际输入／隔离证据，再回 Rich 当前规则、讨论与源码验证决定；不以读者自报代替。页面缺信息、执行能力、访问限制及未运行环境分别记录；遗漏沿同卡给明确返工，不自动新盲读。
本卡只验一个真实贡献判断，不宣称投稿成功、已验当前 Rich、完整贡献闭环或页面可标绿。检查按文档范围跑 check_repo、check_public、空白与新增提交身份；保留其他历史。
通常 60–90 分钟、最多两小时，沿共享最多四任务及原恢复合同；不另开调度、不依赖 dot 桌面在线。Git 发布只证明可领取，不证明本次已执行。

## 当前结果
待既有接收端核条件后领取；只有公开任务与完整附页，不代表已运行新读者。旧候选与原结果未改，不新增上游发言或投稿。
