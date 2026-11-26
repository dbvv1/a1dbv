# 修桌面交互回归：单 Agent，还是两路只读诊断？

状态：2026-11-26 冻结提案文本（停止继续叠加前置夹具微补丁，待本机排期决定是否启动）。仅提案，未启动应用或模型。

**假设。** 滚动和键盘焦点相互影响时，两路独立诊断能减少只修一半的返工；结果没变好，就不值得为并行多付协调时间和模型用量。

| 甲 | 乙 |
|---|---|
| 一位 Agent 独立复现、诊断、修改和验证，不委派。 | 主 Agent 唯一写者，可同时复现；开工并行委派两位只读 Agent，一位查滚动和选择的调用链，一位设计能识别部分修复的行为验收。各限 8 分钟、回六行证据，不改文件。迟到与无用报告照计成本。 |

## 公开任务与启动条件

组织者使用 [Joplin Desktop #13679](https://github.com/laurent22/joplin/issues/13679)、修复前提交 [`02c1c755`](https://github.com/laurent22/joplin/commit/02c1c75587a0e7b2a56353d58d821f5d7add77ac)；上游[修复记录](https://github.com/laurent22/joplin/commit/50a26b63c84b4854afd9a11a264328910b6aee37)不交任何执行者或盲评者。独立 Git 对象库、基线之上的引用和远端均不可见；各起空会话、空 profile，不共享另一臂资料或隐藏验收、不外查答案。固定同台桌面、同一 Codex 构建、可核对的同一模型和 effort、Standard、同等主 Agent 工具与权限。确认乙组子 Agent 用的也是同一模型和档位，且真实只读，否则不跑。两组串行，开跑前随机定顺序。

**先验只读约束。** [Codex 原生子 Agent 继承父回合的沙箱和审批](https://learn.chatgpt.com/docs/agent-configuration/subagents#approvals-and-sandbox-controls)；`explorer`、角色提示以及最终没有 diff 都不能证明只读。用同配置的非计分临时副本确认诊断者读得到源码、写入测试文件被拒、没有能代写的工具，并核实际模型与 effort。原生子 Agent 若继承写权限且无独立只读约束，原方案不启动。方向会话若决定另比两个独立只读 CLI 会话，须在发题前重标乙组并记录隔离方式，启动与交接照计；不在计分中途替换。

按[固定提交的构建说明](https://github.com/laurent22/joplin/blob/02c1c75587a0e7b2a56353d58d821f5d7add77ac/readme/dev/BUILD.md)，固定 Node 24.10.0、Yarn 4.9.2、依赖、窗口尺寸及笔记本树（在仓库根目录核对 `node --version` 和 `yarn --version`）；从仓库根执行 `yarn install --immutable`。Windows 按上游说明用普通命令提示符而非 WSL。

**从同一份源码编译后再验 Electron。** 原版预检和每个待评分补丁都在各自受检工作树根先跑 `yarn tsc`，成功后才跑桌面测试；把源码版本／补丁、编译结果与测试结果记在同一回执。不拿新 profile 当作新构建：`test-ui` 的 `before-start` 会打包，但不负责 TypeScript 编译；打包器可能优先取已有的同名 JS。依据：[一手] [固定构建说明](https://github.com/laurent22/joplin/blob/02c1c75587a0e7b2a56353d58d821f5d7add77ac/readme/dev/BUILD.md#watching-files)、[before-start](https://github.com/laurent22/joplin/blob/02c1c75587a0e7b2a56353d58d821f5d7add77ac/packages/app-desktop/gulpfile.ts#L77-L90) 与[模块解析](https://github.com/laurent22/joplin/blob/02c1c75587a0e7b2a56353d58d821f5d7add77ac/packages/app-desktop/tools/bundleJs.ts#L71-L87)，2026-11-24 核源码，未跑 Electron。

组织者可另备桌面包 `integration-tests/sidebar-scroll.spec.ts`，运行 `yarn workspace @joplin/app-desktop test-ui sidebar-scroll.spec.ts --workers=1 --retries=0`。**原版预检与两臂盲评都在测试进程设置 `PLAYWRIGHT_HTML_OPEN=never`**：在 Windows 命令提示符先运行 `set "PLAYWRIGHT_HTML_OPEN=never"`；在 Bash 可直接加在命令前。HTML 报告照常生成，但失败后不会自动启动报告服务器而卡住；保留报告和实际退出码。依据：[一手] [固定桌面配置](https://github.com/laurent22/joplin/blob/02c1c75587a0e7b2a56353d58d821f5d7add77ac/packages/app-desktop/playwright.config.ts#L23-L27) 与 [Playwright 1.56.1 报告器](https://github.com/microsoft/playwright/blob/v1.56.1/packages/playwright/src/reporters/html.ts#L149-L210)，2026-11-26 核源码，未跑 Electron。

夹具至少三屏，下部目标远离滚动边界；先连续两次得到原缺陷的行为断言失败，并验邻接能力。未重现、桌面不可用、依赖漂移就停止。评分必须操作实际应用，不以 mock 替代。只把下段交执行者。

> 桌面笔记本列表：选中靠顶部的笔记本，滚到下方，点击下方目录的展开或折叠按钮，再往下滚。目前列表会跳回顶部。修复它；保留当前选择和正常的方向键选中、滚动及焦点，不要从编辑器抢走焦点。交局部补丁、可重跑回归和实际检查结果。

## 判法

盲评人只看基线、匿名补丁和固定夹具，逐项重放：

1. 展开与折叠各测一次：渲染稳定后不跳回选中的顶部，选择身份不变，后续向下滚动有效。小幅合理布局位移不算跳顶。
2. 用方向键跨过视口边缘：选中项实际更换，新项目可见，连续方向键仍有效。
3. 编辑器有焦点时，触发不改变选择的列表更新（取已在基线验证的动作）；先观察焦点，不重新点编辑器，再用 `mainWindow.keyboard` 发键并核对输入是否进入原编辑器。上一步的连续方向键也走这一路径：[`locator.press()` 会先聚焦目标](https://playwright.dev/docs/api/class-locator#locator-press)，可能掩盖丢焦点。既有[侧栏方向键与展开折叠测试](https://github.com/laurent22/joplin/blob/02c1c75587a0e7b2a56353d58d821f5d7add77ac/packages/app-desktop/integration-tests/sidebar.spec.ts)也要通过。依据：[一手] Playwright 文档与固定 Joplin 测试，2026-11-25。

三项与可重跑回归均过才算达标。每组从发题到验收最多 60 分钟，记录首次／最终是否过、首交／验收墙钟、人工纠正次数与分钟、主子 Agent 及失败重试的输入／缓存／输出和实扣（拿不到写未知，API 回算另列）。同条件最多发一次只描述失败行为的反馈，连等待、协调和返工一起计时；超时或补丁本身编译失败仍记为未交付，模型漂移、答案泄漏或运行环境失效才判配对无效。单题结果先限定到这类任务，不改默认。
