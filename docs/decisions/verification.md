# 怎样让 Agent 自己验证，尤其是前端与 UI 任务

**✅ 复用项目现有检查，确认运行的是改后的代码，从原入口走完用户任务，失败就修复并重验，再交回版本、结果和证据。** 先打通这条路径；已有反馈足够时，不增加浏览器工具、验证 Agent 或停止 Hook。

前提是获准的隔离测试环境、合成数据，以及项目要求的依赖和工具版本；不接真实账号或个人浏览器。先从项目指令、包配置和 CI 找启动、测试、类型／构建及提交前命令；已有命令缺输入或环境就明确卡点，不猜替代入口。

## 第一步：把目标和保留项填进这段任务

```text
目标：[用户能完成的具体事情]；保留：[原行为、兼容要求、失败后保留的数据]。
先读项目指令、相关实现、测试和 CI，复用真实命令、夹具和依赖。
从启动日志、进程或构建信息确认测试对象包含本次改动；
按提交检出的入口只验该版本，未提交修改用能读取当前工作树的入口。
先复现问题；已有测试能区分错误就复用，否则在原套件补回归，再改实现。
接收已有补丁时，让同一条回归分别运行旧、新实现，确认旧版因目标问题失败、新版通过。
UI：从[原 URL／入口及前置状态]实际输入、点击或键盘操作，
核[成功结果]及相关加载、失败恢复、取消或重复操作；
外观查看[目标视口／主题]的关键状态，保存按契约重开或从测试后端独立读回。
失败先区分实现、测试与环境，修复后重跑受影响检查和直接消费者。
保留首次失败、原触发步骤与验收含义；断言、夹具或视觉基线变更要有需求依据。
完成时交最终版本、实际命令与结果、用户路径和证据位置，以及失败／未验项。
权限或环境受限就记录具体动作、原错误与恢复条件，继续不依赖它的工作。
```

**没有 UI 改动就删去 UI 段，实际运行 CLI、库或 API；涉及原生输入法、系统弹窗和设备行为时回目标环境验。** 临时验收复用现有入口，长期防回归才接入测试套件；不为短修复先造框架。源码或相关配置在检查后又改了，就重验受影响路径。

## 已有补丁：同一条回归，要真正跑到旧、新两份实现

**回归与修复在同一个提交里时，把候选回归放到旧实现上再跑一次。** 只跑旧提交自带的测试，可能根本没有覆盖这次错误。先在两个独立检出核版本；用同一输入与断言，确认旧版因目标行为失败、新版通过。若新测试依赖新 API 或新夹具，改用两版都支持的真实入口复现，避免把导入或启动失败算成检出原问题。

**需要 Git 索引的检查，优先用 detached worktree，不只解压源码。** 在获准的仓库根目录运行以下 Bash 示例；这是本仓公开扫描误报修复的两个固定版本，换项目时替换提交和测试入口。两个目标目录须尚不存在，命令会写入当前仓库的 worktree 管理信息。

```bash
(
set -eu
before=06c5a774f2a45e401e09d9157e9eb9b604b3eedc
after=5f8b0b10e9e3fbf173253e2179afcab5cd06b193
git worktree add --detach ../verify-old "$before"
git worktree add --detach ../verify-new "$after"
git -C ../verify-old rev-parse HEAD
git -C ../verify-new rev-parse HEAD
git show "$after:tests/test_check_public.py" > ../verify-old/tests/test_check_public.py
old_exit=0
(cd ../verify-old && python3 tests/test_check_public.py PublicScanTests.test_clean_and_placeholder_content_passes -v) || old_exit=$?
(cd ../verify-new && python3 tests/test_check_public.py PublicScanTests.test_clean_and_placeholder_content_passes -v)
test "$old_exit" -eq 1
)
```

预期旧版执行 1 项并因把普通任务词误认凭据而失败，新版执行同一项通过；旧版工作树仅更换测试文件。这个对照验证的是该误报回归。若还要验安全覆盖，另给真实 CLI 输入应检出的合成凭据，核命中与脱敏；整仓扫描通过不能替代这些目标样本。

**夹具要走哪条枚举路径，先核清楚。** 本仓扫描器在 Git 内只取索引文件：临时目录若位于另一仓库的未跟踪子目录，即使含文件也可能扫描 0 项。要验非 Git 回退路径，先用 `git -C <夹具目录> rev-parse --show-toplevel` 确认它不属于任何仓库，再运行原命令；要验 Git 路径，就核 `git ls-files` 中确有本次夹具。检查文件数／测试数和目标反例，0 项不是通过证据。临时目录的路径和编码也可能触发被测规则，按实际输出区分夹具问题与实现问题。

**依据**：[Git worktree](https://git-scm.com/docs/git-worktree)、[Git 索引枚举](https://git-scm.com/docs/git-ls-files)；[本仓误报修复与回归](https://github.com/dbvv1/a1dbv/commit/5f8b0b10e9e3fbf173253e2179afcab5cd06b193)。2026-10-30 在 POSIX 实跑上述同一回归，旧版因目标问题失败、新版通过，并复现未跟踪子目录的 0 项问题；修订页的本机新读者验收仍待补。

## 按产品承诺选证据

| 承诺 | 实际检查 | 接收范围 |
|---|---|---|
| 代码／公共接口行为 | 相关测试、类型／构建与直接调用方；保留能检出原问题的回归 | 所测行为 |
| 机器消费的配置／生成文本 | 用实际下游版本读回生成结果，核关键字段与行为含义 | 所测格式与消费契约；远端流程另验 |
| 组件状态 | 已有 story／组件测试触发正常、进行中、失败恢复，等交互断言完成 | 真实组件交互；假服务注明模拟 |
| 页面用户任务 | 当前构建从原入口输入、点击、导航；核业务结果及 console／请求失败，时序问题查 trace | 实际走过的路径 |
| 布局／裁切／主题 | 查看目标视口与关键状态截图，必要时核 computed style、焦点和键盘可达性 | 所见外观与操作；完整无障碍另验 |
| 保存 | 本地保存按契约重开；服务端保存从测试后端独立读回本次记录，核缓存与响应来源 | 所验持久化或集成 |

**先保用户失败的时刻。** “加载中输入丢了”从可输入但数据未返回时开始；“关闭后不能重开”要走关闭→重开。用角色、可访问名称或稳定 test ID 定位，等待业务状态；内部函数仅辅助诊断，用户路径仍用实际输入。已有 Storybook 就复用目标 story，静态构建不算交互通过；跨页、真实后端和桌面宿主继续回应用。详细顺序见 [23](../23-browser-verification.md#4-一次完整验证的顺序)。

**确认实际构建，再分一次验收与持续回归。** VS Code 验未合入修改须选含改动的 `--dev` 检出，准备匹配 Electron／开发构建；默认已安装 Insiders（缺失才 Stable）不是该修改的证据。Next.js 仅改测试也以前置构建最新为条件，源码改动或切分支使产物过时就先重建。借的是入口核对方法，不照搬其他项目命令。

**生成结果能显示出来，还要核消费者读到了什么。** release-please 的真实双标记配置能生成标题，17.6.0 却读不回；单组标记和已修库 17.11.2 对照通过，但当前 Action v5.0.0 仍打包旧库。复用[离线往返示例](../../experiments/release-title-roundtrip/README.md)，断言版本号与组件名，而非只验没有异常。依据为作者 10-30 复盘、官方固定产物及本仓 10-31 模块实跑；未执行远端发布。

## 失败后修实现，不把契约修没

元素改名就对照需求修定位；缺服务先核启动对象和可达性；数据串用或时序竞争用隔离夹具与原 trace 查顺序。新增 skip／fixme、删触发步骤、降低断言或不断加重试不能算修好；跳过及重试才过单列。旧预期确实过时，先写需求依据，再验新结果。缺的是产品判断，就给可比样品让使用者判断。

**🟡 检查器或预期可疑时，用应通过与应失败的最小样本走同一真实入口。** 正例通过，反例须因目标断言失败，而非启动错误；再按契约、版本核预期来源。SpiceScript 曾把不满足“结果应为空”的 `SELECT 1` 判为通过，Turso 回归曾沿用 SQLite 3.50.4 的错误答案；只对受影响用例排除有缺陷的对照，保留产品回归与复核条件。这是条件候选，两项目未运行，SQLite 上游未独立复验；已有检查够用就不加环节。

## 怎样确认交付

报告写清：**最终提交／工作树差量；实际被测构建；命令、数量和结果；走过的路径与报告／截图；失败、跳过、未运行及恢复条件。** 构建、组件、真实后端、部署分别报告；部署成功盖不过同版本尚未解释的失败。现有浏览器入口有具体能力缺口时，再试 CLI、MCP 或诊断工具，保留原验收路径。

## 依据与实试

- [项目方法与实际入口](../07-workflows.md#2-标准节奏探索--计划--实现--提交-)、[Willison 的实际运行实践](https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/)；沿用 2026-10-25 选择，原文重核 10-26。任务片段是机制整理，未做提示词收益对照。
- [Playwright 用户可见行为](https://playwright.dev/docs/best-practices)、[Storybook 交互测试](https://storybook.js.org/docs/writing-tests/interaction-testing)、[healer](https://playwright.dev/docs/test-agents#-healer)与[Trace Viewer](https://playwright.dev/docs/trace-viewer)，核实 2026-10-26。[GitButler 按需 UI 修订](https://github.com/gitbutlerapp/gitbutler/commit/d44d5f6382a9c8719c0873ab3d9250c2c2661adf)说明可先查当前组件再开 story；仅源码与作者反馈已核，未运行该项目。
- [VS Code 固定 Skill](https://github.com/microsoft/vscode/blob/6ba33e0ca0954b1ca03607d016f4b90768b32732/.github/skills/validate-ui-scenario/SKILL.md)、[Next.js 构建前提](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/AGENTS.md#L73-L107)，核实 2026-10-28；两项目未运行。本仓[并行检查候选](https://github.com/dbvv1/a1dbv/commit/144409dcd3e507520157d9e3a939c6ccd50f4218)同日核过被测提交、Linux 离线结果与发布内容。
- [Maka 组件续改](../23-browser-verification.md#先让真实组件接住续改再验完整应用)：旧候选同组 5 项失败，修后 82 项及 4 个 Chrome play 通过；假服务＋真实组件，真实后端／Electron 未验，MCP 未调用。[Memos 匿名页](../collaboration/local-jobs/A-MEMOS-BUILT-SMOKE-001.md#已完成范围)验浏览器路径、网络／SQLite 和实际导出 PNG，owner 写入未验。均为 2026-10-25 既有实试，不是本页重跑。
- [SpiceScript 正反探针](https://github.com/spiceai/spiceai/pull/15674)、[Turso 原问题](https://github.com/tursodatabase/turso/issues/10906)及[定向修正](https://github.com/tursodatabase/turso/pull/10942)，核实 2026-10-28；[V2EX 使用反馈](https://www.v2ex.com/t/1248370)，重核 10-26，个人自述不能给工具／模型排胜负。当前比较的是原生反馈、按需 Storybook 与自动修测试路线，跨任务最优仍未知。
