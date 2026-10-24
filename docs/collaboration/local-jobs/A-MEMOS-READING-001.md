# A-MEMOS-READING-001 · 未完成任务阅读模式

id: A-MEMOS-READING-001
owner: dot-A
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: c1faa7d346e49fcc15043ee7e096ff9ae19866d0
result_branch: relay/a-memos-reading-001
upstream_repo: usememos/memos
upstream_commit: 0bfa31e89ec550c7cc6a1dea3888af2d0de107c2

## 目标与固定来源

用已配置的 DSH＋DeepSeek、Claude Code＋DeepSeek 或 ZCode 实际完成一个真实产品功能：阅读 memo 时可以隐藏已完成事项，恢复显示时内容完整，原始 Markdown 不变。这是普通生产采用，不是 P79 实验；不重跑通道探针，不施加 P79 的隔离、轮次或 token 限制。遵守本目录 README 和 operations§2.2 的认领与结果交接规则；本文件不新增账号、环境、安装或费用授权。

- 真实需求：[Memos #6476](https://github.com/usememos/memos/issues/6476)，2026-10-15 提出，2026-10-24 核为 open、无人认领。用户希望自己及分享后的读者能看清剩余事项。精确关联 PR 搜索未命中；旧 #6028 是删除完成项、已关闭未合并，不作为隐藏实现。
- 固定源码：[0bfa31e89ec550c7cc6a1dea3888af2d0de107c2](https://github.com/usememos/memos/commit/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2)，提交时间 2026-10-24 11:48:46 UTC；对应 Git tree 为 `080b9458635ec846b156fbdb079c9a33badf50aa`。上述 upstream_commit 是 commit SHA，不是 tree SHA。
- 许可：[该提交 MIT LICENSE](https://github.com/usememos/memos/blob/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2/LICENSE)。保留必要版权和许可归属，不复制完整仓库进知识库。

## 产品决定与实现边界

1. 最小方案定为**当前浏览器全局阅读偏好**，默认显示全部任务；不是每条 memo 的服务器字段，也不是仅 Timeline 生效的视图设置。沿现有 `useDevicePreferences` 模式保存布尔偏好，切换影响列表及详情中的只读内容。访客可使用同一阅读开关，不把控件藏在登录后的设置页。
2. 给真实阅读界面提供有明确文字、键盘可操作的显示／隐藏开关；按项目现有组件与翻译惯例实现，不另造设置框架。检查实际布局后选择最小入口，使匿名详情读者也能找到。不要伪称分享链接携带设置：本功能不改变 URL、分享权限、接收者偏好或账户设置。
3. 只改变展示，不删除或重写源 Markdown，不发送 memo 更新请求，不改变权限。编辑模式始终显示全部原文；保留原有任务勾选权限及更新语义，不因过滤后位置变化而勾错原文中的任务。代码块、普通列表、链接、附件和其他内容保持原行为。
4. 检查真实渲染器再选实现，不假定旧 ReactMarkdown 架构。固定版本的 `MemoContentView` 经 `MemoMarkdown` 使用 `@usememos/editor`；`ViewContext` 的偏好只在特定时间线启用，不能仅在那里接线就声称详情支持。对嵌套任务保留未完成子项及必要上下文，不因完成父项而静默吞掉未完成内容；全完成列表能恢复显示。说明实际选择，不扩成通用 Markdown 库修复。
5. 在独立临时公开源码检出中实现，只改相关前端、必要样式／翻译和测试。保留他人修改，不改后端、身份、凭据、数据库、部署、CI 或无关功能。

## 依赖、验证与浏览器边界

- 依赖以固定提交的 [web/package.json](https://github.com/usememos/memos/blob/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2/web/package.json)、`web/pnpm-lock.yaml`、`web/pnpm-workspace.yaml` 和其中引用的 protobuf patch 为准。已核声明 Node >=24、pnpm 11.0.1、`@usememos/editor` 26.10.26；先检查实际工具，不换锁、不升级依赖。已有安装权限内使用官方来源和 `pnpm install --frozen-lockfile`；缺权限或环境不符时报告具体缺口，不以本文件扩权。
- 使用项目真实 Vitest／Testing Library 入口做定向单元和组件集成，覆盖默认／切换／恢复、列表与详情接线、访客可达控件、原文不变、编辑保留、任务勾选映射、嵌套和全完成内容、无写请求。必须包含真实渲染组件的相关集成验证；不能只用自制替身渲染器或字符串测试声称消费者通过。若 jsdom 不支持所需编辑器行为，如实列未验项，不用 mock 成功冒充实现已验。
- 执行相关测试、`pnpm lint`（含类型检查）与 `pnpm build`；记录实际命令、退出状态和关键结果。完整前端测试能在当前资源内运行时复用项目入口；发现无关既有失败须与固定基线对照后说明，不偷偷削弱测试或大修其他模块。
- 由新上下文独立 Agent 审查实际补丁、原文保持与权限／消费链接线；指出问题就修受影响部分并复验。不强制制造第二轮需求或改动，后续只接负责人真实反馈。
- **本次不启动或重试任何浏览器，不安装浏览器、不进行用户桌面或浏览器操作，不启动 Memos 服务或 demo，不初始化示例账户／数据库，不登录。** 既有 Playwright socket 权限失败和已拒浏览器入口保持原状，不换路绕过。本任务只交工程结果，不能用终端 DOM、jsdom 或截图替身称为真实浏览器验收。

## 结果文件与接收

只将必要交付物平铺到本仓已有 `experiments/`，不新增目录或编号专题：

- `experiments/memos-reading-adoption.patch`：相对固定上游 commit 的完整可应用补丁，包含相关源码与测试；不含 node_modules、构建包、缓存或账号材料。
- `experiments/memos-reading-adoption.md`：简短说明产品决定、应用补丁／安装／运行相关检查的步骤、实际模型执行与独审结果、已通过／失败／未运行、许可归属及待接收项。确有必要的附属素材放同目录并用本任务前缀命名，勿为展示另做图片。
- 本任务文件：回写认领、实际进度和最终 `review_ready`，给结果分支／提交链接。模型元数据只写实际客户端、可核型号、执行时间、实施与审查职责及必要人工介入；型号不明写未知，不提交私人会话标识、机器路径、凭据或原始敏感日志。公开检查按仓库 §7 执行，不向上游开 PR、留言或部署。

负责人后续的真实消费者目标是：在获准且可用的浏览器入口中，匿名打开上游公开示例 `samramen000001`（完成食材与未完成 scallions）和 `rendertest0001`，经真实列表／详情切换、刷新及恢复，核对可见内容与无写请求。当前**缺少获准且可用的真实浏览器验收入口**；接收端不负责解决这个权限问题，也不承诺负责人会自动完成。上游 demo seed 仅作为公开输入参考，本次不执行它。

方法判断保持候选：本次可以证明已配置编码 Agent 的工程实施和检查，不证明“消费者目标驱动浏览器闭环”的质量或周转收益。工程可接收与真实界面／浏览器待验分别记录，只有负责人确认后才 accepted。
