# A-LONG-ROUTE-OFFLINE-READER-20261106 · u1 读者记录

## 输入核对

- 页面：`docs/decisions/long-tasks.md` @ `8b76f7db4940cb5923438ad91275b66c1bd0a6d3`
- 页面字节数 11374 UTF-8 字节、102 行，SHA256 `2b3d207aeca2e41b5351dea365ef16fa79830f03ba582c2d29e707e67f7974bf`；用 `git show HEAD:docs/decisions/long-tasks.md` 复核一致（字节数、行数和哈希均相同）。
- 工作树起始 HEAD 即该固定提交，`git status` 干净。页面全文由任务文件原样附入，未用链接或摘要替代。
- 未读本仓其他任务记录、旧读者记录或同主题教程，保持新读者独立性。

## 做到哪一步

任务完成到“本机可跑范围内全部实现与验收”，产物在工作树内、未提交：

- `scripts/check_offline.py`：新增 `IGNORED_PARTS = {'.git', 'node_modules'}`，Shell 发现改为按精确路径分量排除（`IGNORED_PARTS.isdisjoint(relative.parts)`）。保留原有 `sorted(root.rglob('*.sh'))` 稳定排序、8 个基础阶段、命令参数、`.git` 规则和没有 Shell 文件时的行为。
- `tests/test_check_offline.py`：新增 3 个回归用例，覆盖根／嵌套 `node_modules`、相似名称（`node_modules-guide`、`node_modules.sh`）、仓库自写脚本保留、`.git`（含嵌套）、空集合。
- 本记录文件。
- 未改其他脚本、依赖、页面、TASKS、地图或历史记录；未提交、未推送、未切换分支、未改任务文件。

## 验证记录（命令 → 结果）

1. **旧实现先失败**：改实现前先加回归，用未修改的 `scripts/check_offline.py` 跑
   `python tests/test_check_offline.py` → `FAIL: test_installed_dependency_shell_scripts_are_excluded`：旧实现把 `app/node_modules/pkg/test/ts/transpile.sh` 与 `node_modules/pkg/inc-version.sh` 列进了 Shell 阶段（21 个用例，1 failure + 1 error）。
2. **候选通过**：同一命令 → `Ran 21 tests`，20 个通过，仅剩 1 个 error；error 是既有的 `test_process_output_is_inherited_and_timeout_kills_group` 在 Windows 上 `mock.patch.object(os, 'killpg')` 不存在，发生在断言之前的测试环境搭建阶段，与本次改动无关。
3. **项目严格套件入口**：`python scripts/check_offline.py --suite tests test_check_offline.py` → 同样 `Ran 21 tests ... FAILED (errors=1)`，exit 1，原因同上（Windows 不支持 POSIX 进程组）。
4. **定向合成探针**：用候选 `phases()` 读临时树，只得到 `node_modules-guide/c.sh`、`own.sh` 两个 Shell 阶段，根／嵌套 `node_modules` 均被排除。
5. **真实仓库根**：候选 `phases()` 对当前仓库返回 8 个基础阶段 + 12 个仓库自写 `.sh` 阶段，本仓没有 `node_modules`，未误伤任何自写脚本。
6. `python3 scripts/check_repo.py` → `checked_files: 878, errors: []`，exit 0。
7. `python3 scripts/check_public.py` → `checked_files: 1411, findings: []`，exit 0。
8. 空白检查 `git diff --check` → exit 0。
9. **完整 offline 预检**：`python3 scripts/check_offline.py` → `BLOCKED: POSIX with /bin/bash is required`、`BLOCKED: missing required commands: jq`，exit 2，未运行任何阶段。按页面 §4“Windows 运行不了 POSIX 入口时，记清已跑的定向检查和未跑部分”，此项记未运行，需交给已有权限的 POSIX 执行环境。

## 真实依赖消费者（任务卡指定）

从 npm registry 下载两包，先验整包 SHA512 integrity，再只取指定成员验 SHA256，未执行包内脚本、未整包解压：

- pino 9.14.0：integrity 匹配（248632 字节）；`package/inc-version.sh` SHA256 匹配，821 字节。
- thread-stream 3.2.0：integrity 匹配（20048 字节）；`package/test/ts/transpile.sh` SHA256 匹配，1307 字节。
- 在临时输入树按真实包路径放置为 `node_modules/pino/inc-version.sh` 与 `node_modules/thread-stream/test/ts/transpile.sh`，分别用固定旧实现（从 `git show HEAD:scripts/check_offline.py` 导出）和候选实现的实际 `phases()` 读取：
  - 旧版：10 个阶段 = 8 个基础阶段 + 2 个依赖 Shell 阶段（正是这两个文件）。
  - 候选：8 个阶段 = 8 个基础阶段，Shell 阶段 0 个；基础阶段逐项与旧版一致。
  - 差量：移除上述 2 个依赖 Shell 阶段，未新增。
  - 独立自写脚本控制：在树根加入 `authored-control.sh` 后，候选仍发现 `Shell syntax: authored-control.sh`，确认不是整体禁用 Shell 检查。

## 页面卡点

- **无阻塞性页面卡点。** 页面是长任务组织与接收方法，不含本次修复的具体步骤；具体改法、验收命令和写域来自任务卡。按页面执行的接受纪律（先存旧失败范围、同一入口重试、看真实 diff 与输出、从真实消费者入口验证成功和失败路径）足以指导本轮。
- 固定页面第 30 行（本轮任务正文第 74 行）“任务／写者从项目已有记录、原调用和实际工作区核对。本仓用 TASKS 与 local-jobs”与本次 reader-test 的独立性约束（只给页面、不给其他任务轨迹）冲突。缺的是页面没有为读者测试划出“不读旧任务记录”的例外。处理：以任务卡明示的写域（两个代码文件 + 本记录）为准，未读 TASKS／local-jobs，也没有据此宣称没有其他写者。
- 固定页面第 82 行（本轮任务正文第 126 行）“Windows 运行不了 POSIX 入口时，记清已跑的定向检查和未跑部分”正好覆盖本轮完整 offline 预检被 BLOCKED 的情况；缺的不是页面指导，而是本机没有可用的 POSIX／jq 执行者，属环境未完成，不是页面未指导。

## 页面之外查了什么

- `scripts/check_repo.py` 与 `scripts/check_public.py` 的现有源码：确认 `check_repo.py` 已用 `.git/__pycache__/.cache/.venv/node_modules` 的精确路径分量排除安装依赖，本次 Shell 发现只对齐这一边界，不扩展其他忽略目录。
- `tests/test_check_offline.py` 现有测试与 `scripts/check_offline.py` 的命令行／`--suite` 契约：确认新用例不改动既有断言和阶段参数。
- 测试使用与运行同一解释器（Python 3.13.5），直接从工作树的 `scripts/check_offline.py` 导入实际模块，避免测到别处的副本。
- 任务卡给出的 npm 公共发布包（pino、thread-stream）及其中两个指定普通文件。
- 未访问任何同主题教程、其他仓库、公司内部地址或模型网关。

## 未完成与环境限制

- POSIX 完整 `check_offline.py` 全量阶段未运行（Windows + 缺 jq），已留精确 BLOCKED 输出；需云端或 POSIX 环境重放。
- 既有 POSIX 进程组用例在 Windows 只能报 error，不能算通过；不是本次改动引入。
- 未提交、未推送；按任务卡由接收端扫描后推 `result_branch`。

## 核对

核对角色：独立核对（未参与本轮照做），核对日期 2026-11-06；只读工作树与公开包，未提交、未推送。

- 输入与版本：HEAD 为 `8b76f7db`，与 base_ref 一致；`git show HEAD:scripts/check_offline.py` 的 SHA256 为 `b5113b9d…`，与任务卡一致。页面 `docs/decisions/long-tasks.md` 为 11374 字节、102 行、SHA256 `2b3d207a…`，与记录一致。
- 实际 diff：仅 `scripts/check_offline.py`（+5/−1）和 `tests/test_check_offline.py`（+34）；新增本记录；页面、其他脚本、依赖和 TASKS 均未动。文件 UTF-8／LF、无 BOM。
- 旧实现先失败：把固定旧文件放入临时树，运行同一测试文件 → `FAIL: test_installed_dependency_shell_scripts_are_excluded`，另有既有 Windows `os.killpg` error；`Ran 21 tests`、`failures=1, errors=1`，与记录一致。
- 候选：`python tests/test_check_offline.py` → 21 个用例，20 通过，1 个既有 Windows error（`os.killpg` 不存在，发生在断言前）；`python scripts/check_offline.py --suite tests test_check_offline.py` → exit 1，原因同上。这不是零失败的整套通过，记录已把失败与未运行分开。
- 项目检查：`python3 scripts/check_repo.py` → 879 个文件、`errors: []`、exit 0（记录中的 878 是加入本记录前的计数，差额即本文件）；`python3 scripts/check_public.py` → 1411 个文件、`findings: []`、exit 0；`git diff --check` exit 0。
- 完整 offline 预检：`python3 scripts/check_offline.py` → `BLOCKED: POSIX with /bin/bash is required`、`BLOCKED: missing required commands: jq`、exit 2、零阶段；与记录一致，属环境未完成。
- 真实依赖消费者重放：重新下载 pino 9.14.0 与 thread-stream 3.2.0，整包 SHA512 integrity 匹配（248632、20048 字节）；只取指定成员，SHA256 分别匹配 `1973f56c…`（821 字节）、`5115d49c…`（1307 字节）。按实际包路径放入临时树后，旧 `phases()` 得 10 个阶段（8 基础 + 2 依赖 Shell），候选得 8 个（仅基础）；加入自写控制脚本后为 11／9，确认不是整体禁用 Shell 检查。与记录一致。
- 仓库根：候选 `phases()` 为 20 个阶段（8 基础 + 12 个仓库自写 `.sh`），仓库内无 `node_modules`，模板和 `scripts/*.sh` 未被误伤。
- 结论：修复、定向测试、项目检查和真实消费者重放均与记录相符，本地可跑验收成立；完整 POSIX offline 与云端重放按任务卡留给后续阶段，不能在本机记为整套通过。

- 卡点判定：
  - 任务／写者核对与 reader-test 独立性约束：page（轻，非阻塞）。页面面向普通长任务，未给“只读页面与限定输入”的例外；读者按任务卡写域处理且未宣称无其他写者，处理正确。
  - Windows 无法运行完整 offline：环境未完成，不是页面缺信息（页面 §4 已给出记录与移交规则），也不是读者能力问题；需 POSIX 执行者重放。
  - Git Bash 临时路径交给 Windows 原生 Python 的 `FileNotFoundError`：model 自误（路径未转 Windows 形式），读者自行用 `cygpath` 修正，未影响最终证据。
  - 页面不含本次修复的具体文件、命令和边界：page（说明性，非阻塞）；页面定位为方法指南，具体改法由任务卡给出，符合 reader-test 设计。
- 读者未意识到的错误：记录把任务文件嵌入页面的行号当成页面行号——写“页面第 74 行”“页面第 126 行”，而页面全文只有 102 行；对应句子实际在页面第 30 行和第 82 行。引用文字和结论不变，但行号应按页面计或同时注明来源文件。


## 云端独立接收（2026-11-06）

接收固定产物 `fcc32b8e72096c9b7d88a132f3181f40c8472340`，在 `f1ca61afb5c084aef68662e7399d56828536296f` 上集成重放。两个代码文件与回传字节一致；本节补接收结果，不把前述 Windows 失败改写成当时通过。

- 同一候选测试置于固定旧实现 `8b76f7db`：21 例中只有新增依赖排除回归失败（exit 1，1 failure）；候选 `python3 tests/test_check_offline.py` 为 21/21、exit 0。既有 POSIX 进程组、失败后停后续阶段、缺依赖、空套件、skip 和错误参数等路径均保留并通过。
- 重新从卡内 npm 地址读取两发布包，分别核对整包 SHA512 和指定普通文件 SHA256；字节数为 248632/821 与 20048/1307，均与固定输入一致。未执行依赖 Shell。真正旧／新 `phases()` 得 10/8 阶段，8 个基础阶段逐项相同；加入自写控制得 11/9，加入 `node_modules-guide/own.sh` 后候选保留两个自写阶段。
- 完整 `python3 scripts/check_offline.py`：POSIX 预检通过，20/20 阶段、exit 0。六套严格测试分别为 449、11、34、10、26、21 例，共 551 例，无失败、无 skip、非空；文档/config 900 文件、公开扫描 1439 文件及 12 个自写 Shell 语法阶段通过。这补齐本机未运行部分，不代表模型、原生引擎或 hosted CI 验证。
- 页侧接回纠正：本卡允许项目指引，并明确要求核当前同题任务、回传与写域；禁止的是旧读者答案和旧任务轨迹，不是当前调度事实。首轮将这两者混为一谈，不能据此认定页面缺少独立性例外。本机读者没有自行核 TASKS，不能写成做过；派发前的主线协调由负责人完成，补核见下节。
- Windows 缺 POSIX/jq 属环境；页面不写本题具体补丁符合方法指南范围；Git Bash 路径转换是读者自误。以上不构成新增答案页缺陷，本轮不改答案页。前文两处引用已分别按固定页面第 30、82 行纠正，并保留任务正文行号。
- 实现和云端必需验收已完成，发布仍由负责人串行处理。本记录不证明本机执行者已退出，也不证明自然唤醒或无人值守连续接续；这些不得从 `review_ready` 或本次代码验收推出。

## 本轮定时接续观察（2026-11-06）

本节补核初始分工、读者输入与接续来源。原本机失败和读者未自行核 TASKS 的事实保留；负责人承担的协调与读者承担的实施分别记载。

- 派发前由负责人核当前 main `0908d5ac`、同题任务、已有结果与写域，协商后将 `scripts/check_offline.py` 和对应测试预留给本机读者独占，云端不重复实现；答案页由另一写者单独维护，主目标卡排在本轮队列首位。该核对来自负责人本轮运行观察，不归功于实施读者。
- 首次输入与新读者独立性依据原生 reader-test Workflow／读者回执：固定页面全文原样附入，未读旧任务或读者轨迹；非读者已核页面 11374 字节、102 行与 SHA256，并独立核实际 diff、测试和真实消费者。输入与独立性按回执记载，未独立直接查看原始模型输入或启动遥测。
- 本机结果 `fcc32b8e` 于 **03:33:12 UTC** 经[回传提交](https://github.com/dbvv1/a1dbv/commit/f7ba71fca8d8461f889bca6cf685f8e2e17a38b5)写回任务。固定提交及时间可从公开 Git 记录核对。
- 负责人本轮运行观察：既有定时检查于 **03:43 UTC** 发现该结果，随即启动独立 POSIX 接收验收，期间没有用户催续；回传到续接约十分钟。实际检查与验证产物见上节，后续修复和接收结果已在 [39032d41](https://github.com/dbvv1/a1dbv/commit/39032d410abda40deeb8b162e9b01e28af54b9d0)进入 main。定时检查的触发来源和无人催续来自负责人的运行观察，不能只由 Git 时间戳推定。
- 这次实际完成“执行 → 主线接收 → 启动剩余验收 → 采用”，支持答案页 §3 所要求的一次接续。入口是既有定时检查，不是结果主动推送唤醒；没有另造中断、重复派发或靠用户发“继续”推动。
- 本次新读者实做、非读者核产物与核心推荐真实采用已满足答案页和 write-task-guide 的要求，支持地图升为 ✅；适用范围是已配置宿主上的这次委派、定时接回、独立验收与 main 采用。单次接续不证明长期可靠性、任意宿主恢复或本机执行者已经退出。
