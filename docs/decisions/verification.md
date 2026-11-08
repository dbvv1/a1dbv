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

**CLI 的失败路径也要验输出契约，不只验非零退出。** 本仓链接检查器原先遇到畸形 URL 或编码 NUL 路径时 exit 1，却只给 traceback、没有 JSON；修后仍 exit 1，返回带文件／行号的错误并继续收集后续链接问题。原实现上的新增回归失败，修后 [14 项检查器测试](../../tests/test_check_repo.py)与直接消费者的 [4 项模板复制测试](../../tests/test_template_portability.py)通过（2026-11-04，云端 POSIX）；UTF-8／GBK／ASCII 重定向输出均核过，未测原生 Windows。这只是诊断稳定性，不把本地链接检查升级成外链可达性或内容真实性验证。

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

### npm 包交付：安装实际 tarball，再验调用方

**修改 `exports`、`types`、`files`、构建或 CLI 入口时，验真正交给使用者的包。** 工作区引用可能读到发布包没有的文件；`npm link`、打包清单或 `--help` 成功，都不能代替承诺的 import、类型或 CLI 行为。普通内部逻辑改动继续原测试，不要求每次重新打包。

1. **先选对对象。** 调查已发布版本，就取报告中的明确版本，不用 main 重新构建来代答；验未发布改动，先读项目的 build、prepack 和打包约定。prepack 已负责构建就让 pack 触发一次，否则先执行项目要求的 build。
2. **在仓库外建独立消费者。** 用 `npm pack --pack-destination <绝对临时目录> --json` 取得本地包，或用 `npm pack <包名>@<明确版本> --pack-destination <绝对临时目录> --json` 取发布包。按返回的实际文件名定位 tgz，在新的消费者目录初始化 package.json，再 `npm install <tgz绝对路径> --no-audit --no-fund`。替换占位并给含空格的路径加引号；不从工作区直接导入。
3. **运行原承诺，再核失败来源。** 按真实消费者配置执行 CLI、import 或类型检查；声明问题保留 `skipLibCheck:false`，核是否因目标诊断失败，而不是缺编译器或启动错误。需要定位缺文件时，对照 tgz 内的声明／清单、实际安装文件及 lock 中的包身份，保留完整诊断，不把其他错误都归为同一原因。

依赖与生命周期脚本沿任务已批准策略。只检查已发布包的声明时可用 `--ignore-scripts`；本地包依赖 prepack 生成产物时，跳过脚本会改变受测对象。实际运行需要生命周期脚本而当前不能执行，就保留该项未验，不以只安装成功交付。

可以直接补进任务：

```text
按实际发布产物验这项包变更或版本报告，先核构建与打包入口。
在独立消费者安装返回的 tgz，运行承诺的 CLI／import／类型使用。
交回明确包版本、tarball 与安装身份、实际命令及完整结果；
分别报告目标问题、其他诊断和未运行行为，不用 workspace 链接或跳过库检查掩盖失败。
```

**真实包说明为什么不能只验 main。** Miniflare 的固定 beta 包能安装，但新读者的严格 TypeScript 消费者仍在已安装声明中报 `./shared` TS2307；tarball 中确实没有相应文件。读者没有关闭库检查来消除报错，保留其他诊断另列，因而能回答“这个发布包是否满足我的声明消费要求”。包验收失败，仍然完成了核查任务；不据此判断其运行时好坏。

**依据与复跑**：[npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/)与[生命周期](https://docs.npmjs.com/cli/v11/using-npm/scripts/)，原核实 2026-11-05；[Miniflare 固定发布物、独立消费者与新读者结果](../../experiments/miniflare-release-consumer/README.md#新读者的真实包消费)，2026-11-08 云端读者实际照做，非读者重跑并核包身份。仅验固定 beta 的声明路线；本地 prepack、运行时和 Windows 未验，不新增全仓门禁或改地图评级。

## 失败后修实现，不把契约修没

元素改名就对照需求修定位；缺服务先核启动对象和可达性；数据串用或时序竞争用隔离夹具与原 trace 查顺序。新增 skip／fixme、删触发步骤、降低断言或不断加重试不能算修好；跳过及重试才过单列。旧预期确实过时，先写需求依据，再验新结果。缺的是产品判断，就给可比样品让使用者判断。

**🟡 检查器或预期可疑时，用应通过与应失败的最小样本走同一真实入口。** 正例通过，反例须因目标断言失败，而非启动错误；再按契约、版本核预期来源。SpiceScript 曾把不满足“结果应为空”的 `SELECT 1` 判为通过，Turso 回归曾沿用 SQLite 3.50.4 的错误答案；只对受影响用例排除有缺陷的对照，保留产品回归与复核条件。这是条件候选，两项目未运行，SQLite 上游未独立复验；已有检查够用就不加环节。

### 自动清理导入／导出：报告归零后再跑原消费者

**已经在用自动修复时，先保留运行行为和公开接口，再清 lint；修复命令与复扫都成功，仍须运行原来的调用方。** `unused import`／`unused export` 是分析结论，不代表相同名字的局部绑定、别名或公共 API 都能删除。公开包的外部调用方可能不在当前分析图里，先确认允许收窄的范围；普通内部清理沿用现有测试，不另加一套门禁。

把下面几句加进实际清理任务：

```text
先跑受影响模块的原消费者，保留输出与允许移除的导出范围。
运行项目已有的自动修复，读实际 diff，分别核导入、局部绑定和公开导出。
再跑同一消费者及相关检查；报告归零但行为失败时，只修错误修改，保留仍成立的清理目标。
交回修前／自动修复后／最终修正后的结果；不要用 ignore、跳过或删调用方掩盖失败。
```

**生成 SDK 的例子说明为什么要分开验。** Ruff 0.17.3 在 OpenAI SDK 3.46.0 的一个模块副本中，因预先移除了 `__all__` 中的兼容别名，自动清理把仍用于类型联合的原名也删掉；修复退出 0，实际导入失败。把别名改成独立 import 后，本例消费者恢复；F821 也能发现这处未定义名字。原发布文件没有故障，预先删除导出本身已改变公共 API，不能把该局部修正推广成任意 SDK 的清理方案。

**未使用的导出也可能仍是必需的局部变量。** Knip 6.44.1 的公开复现中，`localOnly` 不被外部导入，却仍被本模块函数使用；自动修复删掉局部绑定后，复扫为空，原程序却抛 `ReferenceError`。保留解构绑定、仅单独导出仍需公开的名称，才能同时保住消费者输出与清理目标；只有确认外部不再需要该导出时才这样改。

**依据与复跑**：[Ruff 固定 SDK 与三组消费者](../../experiments/ruff-import-consumer/README.md)、[Knip 用户公开复现与局部修正](../../experiments/knip-workspace-entry/export-fix/README.md)，原实测均为 2026-11-05。2026-11-08 新读者照本节步骤在独立副本完成 Knip 修复，非读者复验三阶段消费者、复扫和最终导出契约通过；原调用方输出仍为 `44`。只覆盖这两个输入，未验完整 SDK、真实 API 或其他清理形状，也未比较模型收益。

## 怎样确认交付

报告写清：**最终提交／工作树差量；实际被测构建；命令、数量和结果；走过的路径与报告／截图；失败、跳过、未运行及恢复条件。** 构建、组件、真实后端、部署分别报告；部署成功盖不过同版本尚未解释的失败。现有浏览器入口有具体能力缺口时，再试 CLI、MCP 或诊断工具，保留原验收路径。

**摘要完整，不等于测试已经执行。** pytest-receptor 1.2.2 及固定 main 的实测中，收集期的 SyntaxError／ImportError 没有执行测试，compact 终端和完整、哈希有效的 JSONL 却都计为 `executed=1, failed=1`；已有一项被收集时，还会显示貌似合理的 `1 of 1 executed`。pytest 仍返回 exit 2、保留 collect 阶段，不是假绿。核交付数量时沿用原生输出与实际运行阶段，不把“已收集”写成“已执行”；[实测字段与原复现入口](../research/2026-11-01-pytest-receptor-counts.md)（2026-11-01；Linux／Python 3.12.14／pytest 9.1.1，未测模型收益）。

## 依据与实试

- [项目方法与实际入口](../07-workflows.md#2-标准节奏探索--计划--实现--提交-)、[Willison 的实际运行实践](https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/)；沿用 2026-10-25 选择，原文重核 10-26。任务片段是机制整理，未做提示词收益对照。
- [Playwright 用户可见行为](https://playwright.dev/docs/best-practices)、[Storybook 交互测试](https://storybook.js.org/docs/writing-tests/interaction-testing)、[healer](https://playwright.dev/docs/test-agents#-healer)与[Trace Viewer](https://playwright.dev/docs/trace-viewer)，核实 2026-10-26。[GitButler 按需 UI 修订](https://github.com/gitbutlerapp/gitbutler/commit/d44d5f6382a9c8719c0873ab3d9250c2c2661adf)说明可先查当前组件再开 story；仅源码与作者反馈已核，未运行该项目。
- [VS Code 固定 Skill](https://github.com/microsoft/vscode/blob/6ba33e0ca0954b1ca03607d016f4b90768b32732/.github/skills/validate-ui-scenario/SKILL.md)、[Next.js 构建前提](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/AGENTS.md#L73-L107)，核实 2026-10-28；两项目未运行。本仓[并行检查候选](https://github.com/dbvv1/a1dbv/commit/144409dcd3e507520157d9e3a939c6ccd50f4218)同日核过被测提交、Linux 离线结果与发布内容。
- [Maka 组件续改](../23-browser-verification.md#先让真实组件接住续改再验完整应用)：旧候选同组 5 项失败，修后 82 项及 4 个 Chrome play 通过；假服务＋真实组件，真实后端／Electron 未验，MCP 未调用。[Memos 匿名页](../collaboration/local-jobs/A-MEMOS-BUILT-SMOKE-001.md#已完成范围)验浏览器路径、网络／SQLite 和实际导出 PNG，owner 写入未验。均为 2026-10-25 既有实试，不是本页重跑。
- [SpiceScript 正反探针](https://github.com/spiceai/spiceai/pull/15674)、[Turso 原问题](https://github.com/tursodatabase/turso/issues/10906)及[定向修正](https://github.com/tursodatabase/turso/pull/10942)，核实 2026-10-28；[V2EX 使用反馈](https://www.v2ex.com/t/1248370)，重核 10-26，个人自述不能给工具／模型排胜负。当前比较的是原生反馈、按需 Storybook 与自动修测试路线，跨任务最优仍未知。
