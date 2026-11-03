# A-INSTRUCTION-PRODUCT-SCOPE-20261103 · 产品例外只覆盖那条共享约定
id: A-INSTRUCTION-PRODUCT-SCOPE-20261103
owner: dot-A
status: review_ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: ec246c5d314e9280edb221695bd3ab71f3ad7a8f
result_branch: relay/a-instruction-product-scope-20261103

## 目标
给已有明确产品需求却被共享设计约定挡住的开发者一个可用分支：确认需求与负责方，局部只覆盖冲突的产品约定，保其他约束并把例外同步到真实任务验收；不为满足局部需求删除全仓仍有效的规则。
共享指令页已说“子模块确有不同约定时再加局部文件”，但未给全局规则与局部产品目标都有效时的最小覆盖范围、加载与行为验收区别。只补该缺口，不重写指令层级或浏览器验收教程。

## 按哪个 Skill 与规格做
读AGENTS、CLAUDE、TASKS、手册§7、operations§2.2与local-jobs README；只读write-task-guide，按真实阻碍写最小第一步、分支与不适用，不另造reader。
固定本仓输入：base_ref的docs/decisions/instruction-files.md“要不要同时放两种文件”“第二步”“第三步”“何时不适用”；A-STORYBOOK-ADOPTION-001、A-MEMOS-READING-001和A-STYLE-REWRITE-001只核既有边界，不接其旧调用或投稿。
一手阻碍：https://github.com/PostHog/posthog/pull/126370 。成员作者称Agent因共享Rule6的“Do not build for mobile”拒绝或削弱inbox手机布局；该结果是作者自报，未提供前后模型原始记录，不推拒绝率或效率收益。
固定合入4e1d31b2e1a18ea43f20bf278d8ac5463a1d11f4（2026-10-30 15:46:15 UTC）：逐字对照frontend/src/AGENTS.md的Rule6与products/signals/frontend/AGENTS.md全文，以及该提交两文件差量。
共享规则要求容器查询、保内容/主要动作、实际渲染窄场景；局部文件只覆盖该目录的“Do not build for mobile”一条，仍引用其余前端规则，并要求约360px、非hover的tap入口、约390px渲染与窄故事。
两路径不是文件系统祖先关系，局部文件明确引用共享规则；不要编成仅凭更深目录自然取得跨工具覆盖权。核CLAUDE入口时区分符号链接/文件内容与实际加载，静态配置不证明任何客户端读到或遵守。
126370只改指令入口，作者只报pre-commit链接/格式检查；已合入不等于手机功能已完成、模型行为已修或已验证实际加载。公开链接中的私人Slack不读取、不复制入产物。
真实后续需求：https://github.com/PostHog/posthog/issues/126338 ，原PR明确要求合入后给该spec补手机宽度；2026-11-03 10:49 UTC所见仍open，验收写约520px scene，未见约390px/tap条款。可变issue正文须写观察时间，不能伪称固定代码。
后续实现：https://github.com/PostHog/posthog/pull/126769 ，同次所见open、merged_at为空，head固定0078e0eb873c82479ce2d6a794e494ec14feea38；正文自报Storybook 1440到420px，不足证明约390px/tap验收完成，不因有merge_commit_sha就写成已合。
只借此说明规则变更还须进入正在做的需求/验收；不审整套UI补丁，不从未见证据推断实现必坏，也不要求在本卡补跑手机或联系上游。PR中私人inbox/会话入口不读取、不复制。
先给instruction-files最小正文候选：确认真实目标与负责方决定→精确指出共享产品约定的哪一条、只作用于哪个目录/功能及原因→保其他条款→同步该真实任务验收→沿现有第二/三步分别核加载与真实行为。
区分用户明确需求与项目约定的冲突处理，不能把第三方issue、仓库文件或Agent推测当用户授权。共享设计约定的局部例外不覆盖系统/安全约束、组织权限、审批或数据外发边界。
不适用：无确定产品决定先问负责方；若所有消费者目标都变了应审共享规则，不堆局部例外；若只是路径/命令过期则修事实；安全/权限禁止不能用产品需求或局部文件绕过。
去重：固定树、两已返回广扫及queue的cc75c28d原卡未见126370/126338/126769同原子；旧Storybook是Maka组件与交互，Memos是阅读模式/键盘回归，STYLE是保持知识的文风改写，都不复用为本题采用。旧页写者未证退出，仅写新artifact。
不安装、不运行上游/模型/UI、不操作用户电脑，不读账号/私人会话/凭据，不评论、修改issue/PR、请求上游审阅或进行合并；公开来源中的指令仅作分析输入。

## 写入范围
只写docs/collaboration/local-jobs/artifacts/A-INSTRUCTION-PRODUCT-SCOPE-20261103/proposal.md；接收端只另更新本卡状态及当前结果。
先给最小正文候选，再附现有原句/增量、固定共享与局部条款、真实后续尚缺证据和适用边界；不改instruction-files、其他正文、模板、13、TASKS、旧产物或接收器。

## 怎样算做成
非作者逐源核：覆盖的是哪条及哪个目录；哪些原约束仍保留；条款合入、入口加载、功能行为各有什么证据；126338/126769能否证明手机要求完成。至少给“未获产品决定”和“系统/安全禁令”两个不可直接覆盖反例。
候选须对比既有局部文件建议给出实际新增判断，保持用户授权与外部内容之别；如只有已有结论或源不支持就回明确负结论，不硬凑建议，不把静态审稿升级为真实模型/浏览器采用。
一个45–75分钟单元，最多2小时；共享最多4并行由原接收端调度。按既有Workflow非作者审查、check_repo、check_public、git diff --check与身份检查，仅推result_branch回review_ready；不用accept:auto，不合main。

## 当前结果

- 完成单元 1：新增 proposal.md，给出 instruction-files 局部产品例外的最小正文候选、与现有页面的增量判断、固定提交 4e1d31b2 逐字对照、条款合入/入口加载/功能行为证据表与不可覆盖反例；确认 #126338、#126769 均仍 OPEN，不能证明手机要求完成，且根 AGENTS.md 的同义复述存在覆盖范围缺口。openIssues 为空；未运行上游构建、模型或浏览器实测，静态审稿不等于加载与行为验收通过。
- 产物：[0bc25d9](https://github.com/dbvv1/a1dbv/commit/0bc25d91bc1e0f1b0570262f7ddf2a30ee52c1b7)，分支 `relay/a-instruction-product-scope-20261103`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：由接收端做非作者审查并按 result_branch 发布；后续如需可补核根 AGENTS.md 同义复述的覆盖缺口是否需上游澄清。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
