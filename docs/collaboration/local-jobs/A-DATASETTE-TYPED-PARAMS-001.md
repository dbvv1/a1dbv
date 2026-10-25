# A-DATASETTE-TYPED-PARAMS-001 · 显式整数参数上游交付

id: A-DATASETTE-TYPED-PARAMS-001
owner: dot-A
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b
result_branch: relay/a-datasette-typed-params-001

## 当前结果

原型及编辑器续改已接收，按用户10-26指示收口，不再扩展。已提交 [Datasette Draft PR #3015](https://github.com/simonw/datasette/pull/3015)，head `cae9014efb7e6a8d076df3e88e557976b02e87e7`，六文件 +1233/-29；每项目仅此一个开放 PR。

显式 `_typed_params=1`＋`age::int` 使用整数绑定，保留普通参数语义；编辑 SQL 保留 typed 名与当前 DOM 值。完整 patch SHA256：`f2adf787966185eec3ca453653a3e32651bcc5e386505914f40b1faf5b01fb58`。原四文件未变，服务端／POSIX有效检查复用；编辑器六项真实浏览器回归由旧2败4过变为6过，已有非作者独审。

## 可直接运行的入口

[固定完整补丁、契约、请求及历史证据](https://github.com/dbvv1/a1dbv/blob/86f5fd2f2714043684054a9d59f392bd0baa2309/docs/collaboration/local-jobs/A-DATASETTE-TYPED-PARAMS-001.md#可直接运行的入口)；使用其中末段新完整 patch，或直接取 PR head。采用结论在 [15 任务路线](../../15-task-playbooks.md#测试全绿后让-agent-看见改动行再核消费者)。

<a id="dot-a-接收与-posix-补验2026-10-25-1551-utc"></a>
## 验证与下一步

Linux最终非serial为2856过／1败（基线同败），serial39过；AF_UNIX被平台拒绝后未重试，原insecure HTTPS脚本未跑，仅显式CA变体验过。完整门禁未绿，版本／浏览器矩阵不作通过声明。具体命令、原始失败与树映射见固定历史及接收提交说明。

按[上游贡献规范](https://github.com/simonw/datasette/blob/main/docs/contributing.rst)提交研究草稿：如实披露AI实施／AI独审，未称人审或语法获准；用户文档仍缺。2026-10-26 02:09核PR开放、draft且可合并，六项PR工作流为`action_required`，未记作CI通过。

下一步跟进维护者对设计、文档与测试的评审，在此PR内回应；合并或被拒后收口，不另开同项目PR，不扩原型。历史过程保留在Git，不再累积到本任务。
