# 投稿页真实采用：Datasette 草稿现在该做什么

**结论：保留现有草稿，先等契约决定与 CI 准入，不另堆实现。** 2026-11-04 UTC，按[投稿页](../docs/decisions/upstream-contributions.md)完成本仓已有待跟进任务 [Datasette #3015](https://github.com/simonw/datasette/pull/3015) 的只读核查。它是正在发生的贡献任务，不是为测指南新建的演示 issue。

## 使用条件与任务

- 输入页面固定于 a1dbv [`9dd27fbb`](https://github.com/dbvv1/a1dbv/blob/9dd27fbbe5ad7a927ca398d43471dad348bd6dfd/docs/decisions/upstream-contributions.md)，按 [write-task-guide](../templates/generic/.claude/skills/write-task-guide/SKILL.md) 先自己完成一项真实任务。
- 执行者已参与项目并读过相关材料；这是**有背景执行者的页面采用**，不是新读者盲测，也不是第二轮模型效果实验。
- 目标：确认旧候选是否已被上游覆盖、是否能退出 draft，以及下一步由谁处理；不修改应用、不发评论／PR、不签协议、不重试曾被拒的动作。
- 使用公开 GitHub 只读接口与新的隔离 Git 克隆；未安装应用依赖，未运行 Datasette 测试或真实服务，未读取个人数据。

## 按页面完成的核查

1. **先读当前规则。** 当前 upstream main 为 `d1cc495a966cafaed3e50dad73cd88e790031704`。读取 [contributing.rst](https://github.com/simonw/datasette/blob/d1cc495a966cafaed3e50dad73cd88e790031704/docs/contributing.rst)、README 及 `.github` 现有入口；仓内未找到 AGENTS 或 PR／issue 模板。贡献文档欢迎贡献，要求实现、测试和文档配套，main 应保持可发布；已读文件未明确 AI、CLA／DCO 或 vouch 条件，不能推成豁免或全面许可。测试入口与矩阵读取 [test.yml](https://github.com/simonw/datasette/blob/d1cc495a966cafaed3e50dad73cd88e790031704/.github/workflows/test.yml)，未据此执行安装或测试。
2. **核提案与人的决定。** #3015 仍 open、draft、未合并，head 为 `a6f3ade873fbe91d3c6a58a76a50d359217b5c90`。PR 普通评论、逐行评论和 reviews 列表均为空。[关联 #2946](https://github.com/simonw/datasette/issues/2946) 仍 open，其一条 [语法建议](https://github.com/simonw/datasette/issues/2946#issuecomment-5718668199) 不等于维护者同意本提案的 opt-in、后缀或兼容决定；draft 正文也保留这些前置项。`mergeable=true` 不代表已批准或可发布。
3. **核最新上游，不只看 PR 元数据里的 base。** API 给出的 PR base 为 `a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b`，实际 main 已更新。非作者复核确认相差一个提交；对候选改动的七个路径做旧 base → 当前 main 比较，无差量，当前上游仍无 `datasette/typed_params.py`。这支持“所查路径尚未覆盖本候选”，不证明整个仓库没有别的解决方式，也不替代新基线完整测试。
4. **按精确 head 核 CI。** 六条 Actions 均 `completed/action_required`，不能写成“正在跑”或“通过”；check runs 为 0。[Test run 40224004876](https://github.com/simonw/datasette/actions/runs/40224004876) 的 jobs 列表为 0。单独的 ReadTheDocs status 为 success，只证明该文档状态，不能代替代码／浏览器矩阵。执行者仅读取上述 Test run 的 jobs；非作者另行检查六条 run，确认其 jobs 均为空，两个核查范围分开记录。

## 可复核入口与实际结果

在已有所列对象的隔离克隆中，使用候选七文件作为明确范围：

```sh
git diff --name-only a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b a6f3ade873fbe91d3c6a58a76a50d359217b5c90
git diff --exit-code a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b d1cc495a966cafaed3e50dad73cd88e790031704 -- datasette/templates/_sql_parameter_scripts.html datasette/templates/query.html datasette/typed_params.py datasette/views/database.py docs/sql_queries.rst tests/test_playwright.py tests/test_typed_params.py
```

第一条实际列出上述七文件，第二条 exit 0；新克隆工作树干净。只比较固定提交内容，不证明依赖、环境或应用行为一致。

本次实际读取的公开 API：[PR 评论](https://api.github.com/repos/simonw/datasette/issues/3015/comments?per_page=100)、[逐行评论](https://api.github.com/repos/simonw/datasette/pulls/3015/comments?per_page=100)、[reviews](https://api.github.com/repos/simonw/datasette/pulls/3015/reviews?per_page=100)、[精确 head Actions](https://api.github.com/repos/simonw/datasette/actions/runs?head_sha=a6f3ade873fbe91d3c6a58a76a50d359217b5c90&per_page=100)、[check runs](https://api.github.com/repos/simonw/datasette/commits/a6f3ade873fbe91d3c6a58a76a50d359217b5c90/check-runs?per_page=100)、[Test jobs](https://api.github.com/repos/simonw/datasette/actions/runs/40224004876/jobs?per_page=100)、[commit status](https://api.github.com/repos/simonw/datasette/commits/a6f3ade873fbe91d3c6a58a76a50d359217b5c90/status)。这些是观察入口，未来返回可能变化，本文只记录本次时点。

## 下一步与页面反馈

- 保留 draft。由维护者确认契约并处理 `action_required` 的运行准入，再接收精确 head 的上游 CI；不能靠更多本地测试或改称 ready 替代。没有新的评审要求，本次未再写补丁或重跑旧大套件。
- 页面顺序足以完成这次准入／现状判断，未遇到需要修改页面的方法缺口。GitHub API 和仓库文件是页面要求读取的任务证据，不是另找一套流程；未做新旧流程对照，不量化节省时间或返工。
- **第二项未完成**：预留真实任务 [Memos #6502](https://github.com/usememos/memos/pull/6502) 给未读过页面的本机读者。本轮无可用的已连接本机，未派发、未测试，也未在本轮核其当前状态。后续应附页面全文与该任务，再由读者以外的人验收；不能拿本次有背景自用冒充。
- 非作者另核六条 run 的 jobs 均为空，并复核上游相差一个提交、候选七路径无差量；贡献规则由执行者读取，本记录不声称已由非作者独立复核。这不是独立应用测试、维护者评审或完整投稿闭环。地图与页面继续保持 🟡，不因这次只读任务升级。
