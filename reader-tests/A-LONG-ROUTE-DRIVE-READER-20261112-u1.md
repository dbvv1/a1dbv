# A-LONG-ROUTE-DRIVE-READER-20261112 · u1 读者记录

## 输入核对

- 页面：`docs/decisions/long-tasks.md` @ `3bb383389a100f8fca4e25afe361b493fdfa7a3c`（工作树 HEAD，`git status` 起始干净）。
- 页面 114 行、14622 UTF-8 字节，SHA256 `748a0cc548efd167027d3fc773ea7804ffec14dbb354dced220129f86c589d42`。任务正文内嵌的页面全文（任务文件第 35–148 行）导出后与仓库页面 `cmp` 完全相同，行数、字节和哈希均一致，可确认实际交付的就是这版固定全文。
- 首次阅读该页，只把该页当方法指南；项目指引、实现与现有测试另读，清单见“页面之外”。
- 一处越界如实记录：为对齐记录格式读了旧读者记录 `reader-tests/A-LONG-ROUTE-OFFLINE-READER-20261106-u1.md`。它没有影响实现、测试或结论，但按“不看其他文档”的要求本不该读，见“页面卡点”。

## 做到哪一步

在本机 Windows + Git Bash 可跑范围内完成实现、定向回归和消费者 CLI 验证，产物在工作树内、未提交：

- `templates/generic/.claude/hooks/protect-paths.sh`（+13/−2）：在 `normalize_path` 里只把**绝对盘符字母**统一为大写。`[a-zA-Z]:/` 的盘符若为小写，用纯 Bash 子串计算换成大写；目录名、文件名、规则 glob、POSIX 路径以及相对路径/cwd 解析保持原大小写语义。没有新增外部命令依赖。
- `tests/test_protect_drive_case.py`（新增，8 个测试方法、33 个 subTest 实例）：调用真正的 Bash Hook，读 JSON stdout，覆盖 C/c 两方向、`file_path` 与 `cwd`、正反斜杠、盘符根、跨盘不匹配、POSIX 与目录大小写不放宽、无效输入及缺路径。复用现有测试的隔离 PATH 机制来固定解析后端；原生 Windows 不能执行该 POSIX 符号链接时回退到环境 PATH。
- 本记录。
- 未改既有 `tests/test_protect_paths.py`、页面、TASKS、地图、其他卡或接收端；未提交、未推送、未切换分支、未改任务文件。

### 先复现旧缺口，再修复

固定旧实现、规则 `deny dist/* generated`、根 `C:/Project`：

| 输入 `file_path` | 旧实现 | 修复后 |
|---|---|---|
| `C:/Project/dist/a.js` | exit 0，deny | exit 0，deny |
| `c:/Project/dist/a.js` | **exit 0，无输出（漏匹配）** | exit 0，deny |

这就是任务卡描述的真实缺口，未加任何测试包装即可复现。

### 直接 CLI JSON 输入/输出/退出码（修复后）

| 场景 | `CLAUDE_PROJECT_DIR` / 事件 | 退出码与输出 |
|---|---|---|
| 大写根、小写盘符文件 | `C:/Project`；`c:/Project/dist/a.js` | 0；deny，reason `generated` |
| 小写根、大写盘符文件 | `c:/Project`；`C:/Project/dist/a.js` | 0；deny |
| 相对路径 + 小写盘符 cwd | `C:/Project`；`dist/a.js`, `cwd: c:/Project` | 0；deny |
| 反斜杠混合 | `C:\Project`；`c:\Project\dist\a.js` | 0；deny |
| 盘符根 | `C:/`；`c:/dist/a.js` | 0；deny |
| 跨盘 | `C:/Project`；`d:/Project/dist/a.js` | 0；空输出 |
| 目录名大小写不同 | `C:/Project`；`c:/project/dist/a.js` | 0；空输出 |
| POSIX 路径匹配 | `/project`；`/project/dist/a.js` | 0；deny |
| POSIX 大小写不同 | `/project`；`/Project/dist/a.js` | 0；空输出 |
| 无效 JSON | `{` | 1；stderr 含 `protect-paths: 无效 Hook 输入` |
| 缺路径 / 空 `file_path` | `{}`；`{"tool_input":{"file_path":""}}` | 0；空输出 |

### 测试与项目检查（命令 → 结果）

1. `bash -n templates/generic/.claude/hooks/protect-paths.sh` → exit 0。
2. 旧实现跑新测试（从 `git show HEAD:...` 导出固定旧文件，`HOOK_UNDER_TEST` 指向它）：`python3 -m unittest tests.test_protect_drive_case -v` → `Ran 8 tests`，`FAILED (failures=11)`，exit 1；11 个失败全部落在那 11 个“至少一侧盘符为小写”的 subTest，大写对照与无关行为通过。
3. 修复后同一测试文件：`python3 -m unittest tests.test_protect_drive_case -v` → `Ran 8 tests`，`OK`，exit 0。
4. 任务指定入口：`python3 -m unittest discover -s tests -p 'test_protect*py'` → `Ran 42 tests`，`FAILED (failures=2, errors=108)`，exit 1。其中 8 个新测试 0 失败 0 error；108 个 error 全来自既有 `test_protect_paths.py`，原因是该文件硬编码 `['/bin/bash', ...]`，原生 Windows Python 无法启动 `/bin/bash`（改动前基线同样是 34 个测试、108 个 error，没有新增）。2 个 failure 是 `test_template_copies_identical`，见“页面卡点”。
5. `python3 scripts/check_repo.py` → exit 0。
6. `python3 scripts/check_public.py` → exit 0。
7. 空白/换行：`git diff --check` → exit 0；对 Hook、测试和本记录三个文件另做扫描，无 CRLF、无行尾空白、末尾有换行。
8. `python3 scripts/check_offline.py` → `BLOCKED: POSIX with /bin/bash is required by existing fixture tests`、`BLOCKED: missing required commands: jq`，exit 2，零阶段运行。
9. Python 后端固定入口：`TEST_PARSER=python3 python3 -m unittest discover -s tests -p 'test_protect*py'` → `Ran 42 tests`，`FAILED (failures=2, errors=108)`，exit 1，与第 4 条相同，新测试 0 失败 0 error。
10. jq 后端：本机无 jq。`TEST_PARSER=jq python3 -m unittest discover -s tests -p 'test_protect*py'` → `Ran 42 tests`，`OK (skipped=42)`，exit 0；这是全部 skip，不是通过，jq 解析路径记为未运行，未安装依赖求绿。

## 页面卡点

1. **项目规则与写域冲突（真卡点，未擅自越界）。** 页面第 16 行要求“先核最新需求、项目规则、实际版本……”。项目规则 `tests/test_protect_paths.py` 的 `test_template_copies_identical` 要求 `templates/generic` 与 `domains/game-dev/{unity,unreal}` 三份 Hook 字节一致；任务卡写域只允许改 `templates/generic` 这一份。缺的是“同步两份领域副本”的授权。我没有改两份副本，也没有改既有测试；因此该既有测试现在有 2 个 failure。接收端需要的具体差量就是本记录上面的 2 个改动块（注释行和 `normalize_path` 盘符分支），逐字节同步到 `domains/game-dev/unity/templates/.claude/hooks/protect-paths.sh` 与 `domains/game-dev/unreal/templates/.claude/hooks/protect-paths.sh` 即可；本卡未覆盖，留接收端决定。
2. **Windows 跑不了 POSIX 入口（环境未完成，页面已给处理规则）。** 页面第 82 行“Windows 运行不了 POSIX 入口时，记清已跑的定向检查和未跑部分，将固定产物交给已有权限的 POSIX 执行环境继续”。缺口是本机没有 `/bin/bash` 可被原生 Python 启动、也没有 jq；已按该句保留定向检查（新测试、直接 CLI、项目检查）`test_protect*py` 已运行但有 fixture error 和副本失败；jq 全 skip、`check_offline.py` 预检阻塞零阶段，不写成通过。
3. **读者独立性与“本仓用 TASKS 与 local-jobs”（页面第 30 行）。** 页面要求从项目已有记录核对写者，任务卡又要求新读者只照页面与任务文件、不读其他任务轨迹。我按任务卡写域执行，未读 TASKS／local-jobs，也没有宣称“没有其他写者”；这一句与 reader-test 的输入限制有张力，但未阻塞本轮。
4. **做错的一处：读了旧读者记录。** 为对齐本记录格式读了 `reader-tests/A-LONG-ROUTE-OFFLINE-READER-20261106-u1.md`，超出“不看其他文档”的限制。未把其中的修复思路、结论或证据搬进本轮；实现与验证都来自当前源码、任务卡复现和本次实际命令。

## 页面之外查了什么

- 项目指引：`docs/collaboration/operations.md`（发布、检查与写者约定）、根 `CLAUDE.md`、`templates/generic/CLAUDE.md` 与 `AGENTS.md`（模板项目的验证与写域约定）。
- 检查入口：`.github/workflows/repository-checks.yml`、`scripts/check_offline.py`（为什么本机预检会被 BLOCKED、严格套件要求非空且无 skip）、`scripts/check_repo.py` 与 `scripts/check_public.py` 的用途和限制。
- 实现与测试：`tests/test_protect_paths.py`（现有隔离 PATH/TEST_PARSER 机制、`/bin/bash` 依赖、三份模板一致性断言）、`templates/generic/.claude/hooks/protect-paths.sh` 全文、`domains/game-dev/{unity,unreal}` 两份副本。
- 版本史：`git log`／`git show` 查看该 Hook 的最近两次改动（`e3e70a05`、`715e8cbf`），确认此前每次改 generic 都在同一提交同步两份领域副本，因此本轮写域限制才会与既有测试冲突。
- 格式约定：`.editorconfig`、`.gitattributes`。
- 旧读者记录 `reader-tests/A-LONG-ROUTE-OFFLINE-READER-20261106-u1.md`（仅格式参考，见上条越界）。
- 未访问网页、同主题教程、其他仓库、公司内网或模型网关。

## 未完成与环境限制

- 完整 POSIX 入口 `python3 -m unittest discover -s tests -p 'test_protect*py'` 未在本机成立：既有 fixture 硬编码 `/bin/bash`，原生 Windows Python 无法启动；108 个 error 与本次改动无关，改动前后相同。
- jq 后端未运行（本机无 jq）；`TEST_PARSER=jq` 下 42 个测试全部 skip，不是通过。Python 后端已实际运行，新测试全过。
- `test_template_copies_identical` 的 2 个 failure 需接收端同步两份领域副本后才会消失；本卡写域不允许我改它们。
- `scripts/check_offline.py` 零阶段运行（POSIX + jq 预检失败），只能交已有权限的 POSIX 执行环境补齐。
- 未提交、未推送；结果分支与接收由接收端处理。

## 核对

核对者按任务卡验收独立复跑；未改读者产物，均在同一 worktree（HEAD `3bb38338`）用真实 Bash Hook 实测。

**页面与缺口复现。** `docs/decisions/long-tasks.md` 为 114 行、14622 字节，SHA256 `748a0cc548efd167027d3fc773ea7804ffec14dbb354dced220129f86c589d42`，与任务卡一致；任务文件内嵌的页面全文（第 35–148 行）与该页逐字节相同。用 `git show HEAD:templates/generic/.claude/hooks/protect-paths.sh` 导出旧实现，规则 `deny dist/* generated`、根 `C:/Project`：`c:/Project/dist/a.js` 返回 exit 0 空输出，`C:/Project/dist/a.js` 返回 deny；修复后两者均 deny。任务卡描述的缺口属实，修复生效。

**消费者与保留行为。** 直接 CLI 复跑读者表中的场景，结果与记录一致：C/c 两方向、小写盘符 cwd 的相对路径、反斜杠、盘符根、POSIX 路径均 deny；跨盘、目录名或 POSIX 大小写不同均空输出；无效 JSON exit 1 且 stderr 含 `protect-paths: 无效 Hook 输入`；缺路径/空路径 exit 0 空输出。按既有盘符与 UNC 用例的输入直接复跑（绝对、相对、事件 cwd、盘符根、跨盘、`//server/share`），修复后行为未变。

**测试与检查。** `bash -n` exit 0。`python3 -m unittest tests.test_protect_drive_case -v` → 8 tests `OK`，exit 0；同一测试指向旧实现 → `FAILED (failures=11)`，exit 1，11 条全部至少一侧盘符为小写。`python3 -m unittest discover -s tests -p 'test_protect*py'` → 42 tests，`FAILED (failures=2, errors=108)`，exit 1：108 个 error 全是既有 `test_protect_paths.py` 硬编码 `/bin/bash` 在原生 Windows Python 下的 `FileNotFoundError`，2 个 failure 全是 `test_template_copies_identical`，新测试 0 失败 0 error；`TEST_PARSER=python3` 结果相同，单跑既有套件为 34 tests、2 failures、108 errors，与读者所述基线相符。`TEST_PARSER=jq` → 42 tests `OK (skipped=42)`，exit 0（本机无 jq，全 skip，不是通过）；`scripts/check_offline.py` 两条 BLOCKED、零阶段、exit 2。`check_repo.py`、`check_public.py` exit 0；`git diff --check` exit 0；Hook、测试与记录均 LF、UTF-8/ASCII、无 BOM、末尾有换行。读者记录中的命令、数字和输出可复核一致。

**结论。** 修复在真实消费者入口可用，读者完成了本单元验收。`test_template_copies_identical` 的 2 个 failure 是任务写域与仓库一致性测试的已知冲突，读者给出了逐字节差量并交接收端决定，未越界；两份领域副本的同步留给接收端。POSIX 完整套件与 jq 后端在本机无法成立，按页面规则保留为未验。

**卡点判定**

1. **`test_template_copies_identical` 与写域冲突 — page。** 页面第 16 行要求先核项目规则，但没有写“仓库一致性测试所需的写域外文件不得擅改、应交回负责人”。读者按任务卡“给出差量、不覆盖”处理正确；剩余 2 个 failure 是交接项，不是读者失误。
2. **Windows 跑不了 POSIX 入口 — page。** 页面第 82 行已给出该边界与处理方式，读者照做并保留未验项；这是宿主能力缺口，不是读者能力不足，页面本身无需因此改。
3. **页面第 30 行 TASKS 与读者输入限制 — model。** 同段首句已明确“派发前的任务与写者核对由主 Agent 负责，实施者按交接中的写域工作”，读者作为实施者本无冲突；其按写域执行正确，但对页面分工的理解不准确，未影响结果。
4. **读旧读者记录 — model。** 读者确实超出“不看 a1dbv 其他文档”的输入限制；已如实披露，实现与验证可由当前源码和本次独立复跑成立，未发现其结论搬自该记录。

**读者未意识到的错误**

- 记录称内嵌页面为“任务文件第 35–148 行”；任务文件实际 148 行，内嵌页为第 35–148 行，多算一行。
- 卡点 2 把已实际执行的 `test_protect*py` 写成“记为未运行”；记录正文已给出该命令 42 tests、2 failures、108 errors 的实跑结果，按页面要求应与“未运行”区分，准确说法应是“运行但既有 fixture 全部 error，完整 POSIX 未成立”。
- 卡点 3 的“页面与 reader-test 输入限制有张力”判断不准确：页面同段首句已把写者核对划给主 Agent，读者层面不存在该冲突。

## 云端接回与实际采用（2026-11-12 UTC）

负责人通过既有后台结果通知接到固定成果，在最新 main `d679dbf` 的独立树读取原 diff、读者及核对记录；22:02 UTC 已实际启动 POSIX 验收。原成果回传提交 `7a970d3` 的时间为 20:56:20 UTC，但提交时间不等于通知到达时间；结果到达→开始接收的精确延迟未知，不由两个提交推算。

接回后继续原目标，而不是只登记结果：同步 Unity、Unreal 的同源 Hook，消除原两项副本一致性失败；Python 与 jq 各 42 项均通过。旧实现用新增 8 方法复跑仍有 11 个 subTest 失败；直接 CLI 输入小写盘符从 exit 0 空输出变为 exit 0 deny。无效 JSON、缺路径、跨盘、目录及 POSIX 大小写保持原行为。完整 offline 21 阶段通过，非空且无 skip；为避免后续只覆盖旧 jq 测试文件，jq 阶段改为 `test_protect*.py` 并加入口断言。

非作者另复跑双后端各 42 项、遍历 26 个盘符 CLI，三份副本字节一致。其发现测试隔离失败时回退 ambient PATH 不能证明所选 parser，已改为明确 skip；本次 POSIX 隔离成功，无 skip。原 Windows 实跑保留为历史证据，不升级为可靠强制 parser 覆盖。

读者记录上方行号与“未运行”误述已校正；同段的 TASKS 责任原文已明确在主 Agent，故不按该误读扩写页面。真实的同步副本漏列则已转成起手检查与接回分支：实施者返回差量，主线核归属后同步或同卡返工。

本次有真实本机执行、固定成果接回及主线继续补验/整合；没有人为制造中断或新建调度。读者曾看旧记录，且页面核心步骤现已据卡点修改，所以地图仍 🟡，不能声称新读者独立照新版通过或长期无人值守可靠。hosted CI 与本地结果分开，本仓工作流仅 workflow_dispatch。
