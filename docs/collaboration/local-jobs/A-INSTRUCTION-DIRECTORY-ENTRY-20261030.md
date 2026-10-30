# A-INSTRUCTION-DIRECTORY-ENTRY-20261030 · 把共享指令的跨目录入口讲清
id: A-INSTRUCTION-DIRECTORY-ENTRY-20261030
owner: dot-A
status: ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 8f01eeee1f931cfd48390658906a42cc5148e084
result_branch: relay/a-instruction-directory-entry-20261030

## 目标
让正在选任务目录的读者知道单包新任务、根会话跨兄弟包、Claude 附加仓库三种情况怎样开始和核对指令；把已核的加载契约转成操作入口，不重复广扫或编造采用实验。
当前决策页提醒 Codex 根会话跨包不能假定加载，却没有目标目录启动的具体选择；也未把 Claude 额外目录可访问与 AGENTS 被发现的区别落实到入口。

## 按哪个 Skill 与规格做
先读最新 AGENTS、CLAUDE、手册 §7、operations §2.2／§3、local-jobs README 与 TASKS；按 write-task-guide 的既有页面改写部分做，不把静态核稿说成新读者真实采用。
固定输入为 base_ref 的 docs/decisions/instruction-files.md、docs/03-context-engineering.md §2.1、docs/research/2026-10-13-context-tool-choice.md“共享指令：发现、导入与加载证据”、docs/collaboration/local-jobs/A-CODING-ADOPTION-001.md 及它引用的已接收固定产物；沿既有官方契约和 fixture 结论，不另开客户端或模型实验。
先核 main、负责人分支和本机在途，确认没有同页活跃写者；若已有更近改动则保留并报告差异，不覆盖他人成果。旧四 reader／四 wide 保留原状态，不重排；本卡不是它们的重试，也不触碰 Hook 原规则或拒绝目标。
集中修第二步，必要时合并邻近重复句：短分流表给单包任务在目标目录启动／Codex --cd、根会话跨兄弟包不能把 shell cd 当原生重载、Claude --add-dir 可访问不等于原生 AGENTS 加载。不要让正文只新增一长串免责。
给真实可复制的最小启动示例，注明命令在哪个目录运行、占位路径如何替换；既有根任务不自动终止或重开。跨仓库选择现成 CLAUDE／显式导入入口并核外部导入批准状态，不建议修改用户设置或绕过批准。
保留版本差异、Codex fixture 只核上下文组装、当前内容可见／工具加载信息／真实行为三层证据，以及 🟡 和真实多工具采用待验；不把源文日期刷新成本次成稿日期，不新增跨工具优劣结论。
只读这些公开仓内输入；不安装软件、不执行示例中的客户端命令、不另起模型调用或加载实验，原生 build 非作者审查照常。不读私人会话、凭据、用户配置，不调用 ListAgents，不改接收端、权限或沙箱。

## 写入范围
模型仅改 docs/decisions/instruction-files.md，并写 docs/collaboration/local-jobs/artifacts/A-INSTRUCTION-DIRECTORY-ENTRY-20261030/result.md 的简短差量和实际检查结果。
不改模板、03、来源页、地图评级、其他卡或产物、TASKS／inbox；不包含 Supabase 待批上传内容。接收端只另回写本卡状态与当前结果。
适用检查通过后仅推指定 result_branch，回 review_ready；不用 accept: auto、不合 main、不部署，dot 最终验收。

## 怎样算做成
非作者先只读修订页，回答三种任务怎样选入口、用什么确认加载缺口，再对照固定源核事实／链接／命令；尤其核 --cd、--add-dir 与导入批准没有被混写。读者应无需跳长篇来源才能选起点；实际模型遵守仍待真实任务。
运行 check_repo.py、check_public.py、git diff --check 和提交身份检查；只改文档，不跑无关实验或客户端。
单元 60–90 分钟，含成稿、非作者审查和修正；最多 2 小时。到时交实际产物及具体缺口，停止无新信息重复调用，不改超时配置；退出未知沿原协议先核原调用，不另建重试卡。
负责人入队前核 A 自身实际活跃少于 2 且共享有空余；原接收端按共享最多 4 并行调度，ready／running 标签与真正派发分开报告，不另起调度器抢槽。

## 当前结果
待原接收端领取；交回跨目录入口修订和简短检查结果，真实多工具采用仍待验。
