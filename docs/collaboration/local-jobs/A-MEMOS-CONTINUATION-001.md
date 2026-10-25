# A-MEMOS-CONTINUATION-001 · 接手既有功能并处理真实键盘反馈

id: A-MEMOS-CONTINUATION-001
owner: dot-A
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 08672c65540ce65fc45edec51ccb856e67d78a28
result_branch: relay/a-memos-continuation-001

## 目标与实际消费者

继续已交付 Memos 阅读模式，不换仓库延长通用修复系列。现有报告记录：键盘勾选仍然可见的已完成父项后，block 视图重绘丢失复选框焦点。目标是让实际编码 Agent 接手固定产物、读取需要的编辑器窄知识、据真实组件反馈选择实现并完成二改；读者获得已有项目连续修改的可复制起点。

输入为固定上游 usememos/memos `0bfa31e89ec550c7cc6a1dea3888af2d0de107c2`、现有 `experiments/memos-reading-adoption.patch`／`.md`、A-MEMOS-READING-001 的公开回执与有效审查。先核最新 main 和其他在制，复用既有 Node24、锁文件、真实编辑器组件及测试，不从私人日志取证。

## 实施与取舍

先用同一真实组件和键盘输入核对固定上游与已交补丁，判断焦点问题是既有行为还是新增刷新退化。这是普通回归定位，不是正式方法对照。新增 handleTaskToggle 后的 refreshViews 是待核线索，不预设根因。

实际目标：切换后仍存在且可见的任务保持合理焦点；不改变原 Markdown、勾选权限、父子过滤、分享图片或编辑模式。按需要读取编辑器 API／状态生命周期源码，比较最小刷新与可靠身份定位等实现，说明哪条证据改变选择，不先建通用焦点框架。只有本补丁新增或加重问题才修；若上游已存在且未加重，记录具体归因，不擅自扩成编辑器修复。任务消失后的焦点规则只在本次真实需求必须时处理，不扩边界矩阵。

可写范围：现有 `experiments/memos-reading-adoption.patch`、`experiments/memos-reading-adoption.md`、`docs/07-workflows.md` 与本任务。补丁仍须完整可应用于同一固定上游。07 在现有功能路线处补一个短小的“接手固定产物→定位新反馈→加载窄知识→二改→接收”起点；结果不足则保留明确未完成，不包装为成功。详细调试留实验记录，不重复长篇限制，不新建专题、目录、台账或流程。

## 验证、权限与交回

正常已配置 Claude Code＋DeepSeek／DSH／ZCode 原生 Workflow；可以把独立源码调查与回归定位并行，实施单一写者，随后一次全新上下文有效独审。记录实际客户端／响应型号、关键人工选择、实际起止和真实产物。

在允许的 Node24／Vitest／Testing Library 真实组件入口取得失败→通过证据；按手册§7重验受影响组件、类型／构建与补丁应用，复用未受影响结果。不为纯正文重跑实验。若无法复现，保存具体输入、结果与自然恢复条件，不制造故障。公开文件、提交身份和空白检查必做。

真实浏览器、视觉、Tab 顺序及跨页刷新依然未验；不启动浏览器、服务、demo、账户或数据库，不重试已拒动作，不把 jsdom 叫浏览器通过。不外发 PR／issue、不部署、不新建会话或调度。只推指定结果分支，回写本任务 review_ready，由 dot-A 接收。发布前 fetch；07 或补丁有并发变化先协调，不覆盖。
