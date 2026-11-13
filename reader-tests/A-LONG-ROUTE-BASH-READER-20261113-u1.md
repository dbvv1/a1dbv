# A-LONG-ROUTE-BASH-READER-20261113 读者记录（u1）

## 收到与首次阅读

- 任务卡与页面全文一起收到。页面为 `docs/decisions/long-tasks.md@b05cb560cd37ba0a248e9a5f624da62ddfced28e`：119 行、15490 字节、SHA256 `cba106f395cb95438b36412653f171b34fa58d8461d3f8f3562da54f1f6c9af8`。开工时按全文首读，并在工作树内对同版本文件重算字节数与哈希，结果一致。
- 只按该页组织工作；页末历史链接未打开，未读其他 reader-tests、旧任务回执或同主题教程。

## 做到哪一步与产物

- 已完成 Windows 原生 unittest 入口的启动修复与定向验证；完整 POSIX 离线门禁未在本机运行，按要求留给云端执行环境，因此本项不能记成整体通过。
- 产物（仓库相对路径）：
  - 新增 `tests/hook_test_support.py`：统一的 Bash 选择、后端选择与隔离 PATH 构造。
  - 新增 `tests/test_hook_test_support.py`：启动选择、错误输入、后端隔离、UTF-8 与含空格目录回归。
  - 修改 `tests/test_protect_paths.py`、`tests/test_protect_drive_case.py`：改用共享入口，保留原有断言、三份模板一致性与解析器追踪。
  - 本记录。
- 入口行为：`BASH_UNDER_TEST` 显式值优先，其次 `PATH` 上的 `bash`；指定值缺失、不可执行或启动探测失败都抛 `HookTestEnvironmentError`，不再 skip 或静默回退。`TEST_PARSER` 只接受 `jq` / `python3`，缺该可执行文件同样明确失败。两套用例共用同一选择逻辑。
- 后端隔离不依赖 symlink：在临时目录写 `cat` 与所选解析器的 Bash 包装脚本，包装脚本 exec 同一个真实可执行文件；`PATH` 只含该目录。解析器追踪仍走同一条真实 CLI。

页面本身不含测试入口的实现配方；具体验收来自任务卡，实现依据是当前测试、Hook 与检查脚本。页面 §3 的三项检查按本项理解为：本轮确有真实子进程与产物（满足）；主线接收与下一步启动属于负责人动作，本记录不据此宣称无人值守已验。

## 页面未写、按自己理解处理的点

- 原生 Windows 的 Bash 选择与后端隔离页面未写：采用“显式值优先、无效即失败”与包装脚本 exec 真实二进制，不依赖 symlink，不用 JSON 模拟。
- UTF-8 locale 页面未写：只在夹具子进程固定 UTF-8 locale，不改用户环境，也不改 Hook 产品。
- 页面 §5 的收口原则用于区分已跑与未跑：Windows 定向检查与 POSIX 门禁、jq 后端分别记录，未把前者替代后者。


## 环境事实与实跑记录

环境：原生 Windows（`os.name=nt`）、Python 3.13.5、Git Bash 5.3.15、`python3` 可用、`jq` 未安装。未安装依赖、未改用户设置、未开权限。

| 检查 | 命令要点 | 结果 |
|---|---|---|
| 修复前基线 | `TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_protect*py'` | 退出 1；Ran 42，errors=108，skipped=8。108 个 error 全是 `FileNotFoundError`：原生 Python 启动固定 `/bin/bash` 失败；8 个 skip 来自盘符用例的隔离探针失败。 |
| 修复后同一入口 | 同上 | 退出 0；Ran 42，OK，无 skip（约 198 秒）。所选后端 `python3`。 |
| 新夹具单跑 | `TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_hook_test_support.py'` | 退出 0；Ran 12，OK，skipped=1（jq 未安装，双后端优先级用例未运行）。 |
| 显式 Bash | `BASH_UNDER_TEST=<Git Bash 的 Windows 路径>`，分别跑盘符套件与路径套件的 UTF-8 用例 | 盘符 8 例 OK；路径 1 例 OK，证明两套入口都优先采用显式 Bash。 |
| 无效 Bash | `BASH_UNDER_TEST=<不存在的路径>` | 退出 1，明确报 `BASH_UNDER_TEST is not an executable file`，未当成跳过或通过。 |
| jq 后端 | `TEST_PARSER=jq` | 未运行：`jq` 不在 `PATH`，Git Bash 目录下也没有；如实记为未验证，未安装。 |
| 直接 CLI | 隔离 `python3`、含空格测试目录 | deny：退出 0，stdout 为 PreToolUse deny 的 JSON（原因 `中文原因`）；无匹配：退出 0，stdout/stderr 均空；无效 JSON：退出 1，stdout 空，stderr 含 `无效 Hook 输入`（解析器自身的 Python traceback 也先出现在 stderr）。 |
| 仓库检查 | `python scripts/check_repo.py` / `python scripts/check_public.py` / `git diff --check` | 退出均为 0；check_public 0 条发现；diff 无空白错误。 |
| POSIX 离线门禁 | `python scripts/check_offline.py` | 未运行：预检要求 POSIX 与 `/bin/bash`，原生 Windows 不满足，留给云端。 |

## 卡点

1. **固定 `/bin/bash` 让原生 Windows 入口整体失败。**
   - 页面位置：§4「所谓通过测了什么」要求看“真实命令、退出码、原输出、受检版本和相关环境”；但页面没有给出原生 Windows 选择 Bash 的做法。
   - 缺什么：两套测试没有共同的 Bash 选择入口，路径套件把 `/bin/bash` 写死；盘符套件虽读 `BASH_UNDER_TEST`，缺失时只 skip。
   - 做错过什么：最初只把基线当成“测试写法问题”，没有先分离“Bash 启动失败”和“Hook 逻辑失败”；补做启动探测后才确认 108 个 error 都是同一原因。

2. **Windows symlink 能建但不能被 Git Bash 执行。**
   - 页面位置：§4 的“真实命令、退出码、原输出”；任务卡要求处理原生 Windows 无 symlink 权限。
   - 缺什么：旧的隔离 PATH 用 `symlink_to`。实测该机允许创建符号链接（`is_symlink()` 为真），但 Git Bash 执行时 `cat` 退出 127、`python3` 报 Permission denied，盘符套件因此 8/8 skip。缺的是“不依赖 symlink 的可执行隔离”做法。
   - 做错过什么：先按“没有符号链接权限”假设排查，实际是 MSYS 不能执行 Windows symlink；改用 Bash 包装脚本后才稳定。

3. **Git Bash 在未设 locale 时把 UTF-8 路径当控制字符。**
   - 页面位置：§4 要求区分“失败与未运行”，任务卡要求补 UTF-8 JSON 与含空格目录回归。
   - 缺什么：原生 Windows 启动的 Git Bash 没有 `LANG`/`LC_ALL`；直接实测 `[[ "C:/a/dist/文件.txt" =~ [[:cntrl:]] ]]` 在 C locale 下会匹配，Hook 的 `normalize_path` 因而报“无效文件路径”。Hook 不在本卡写域内，不能改产品。
   - 做错过什么：第一次探针看到“无效文件路径”时先怀疑路径规范化；用最小 Bash 正则探针才定位到 locale。最终只在夹具子进程环境里固定 UTF-8 locale，并在记录中保留这是入口差异而非产品修复。

4. **完整 POSIX 门禁在本机不可执行。**
   - 页面位置：§4「Windows 运行不了 POSIX 入口时，记清已跑的定向检查和未跑部分，将固定产物交给已有权限的 POSIX 执行环境继续；若必需验收没有可用执行者，整项保持未通过。」
   - 缺什么：`scripts/check_offline.py` 预检要求 `os.name == posix` 且 `/bin/bash`；本机两者都不满足。
   - 做错过什么：没有把 Windows 定向通过写成 POSIX 门禁通过；该门禁与 jq 后端均保持“未运行”。

5. **jq 后端无法验证。**
   - 页面位置：§4 要求把“零测试、skip、失败与未运行分开”。
   - 缺什么：`jq` 未安装，`TEST_PARSER=jq` 与“同时可见两后端仍选 jq”的用例无法真跑。
   - 做错过什么：没有用 JSON 模拟或混合 `PATH` 冒充双后端；该用例以明确 skip 原因保留。

## 页面之外还查阅了什么

- 当前实现与测试：`templates/generic/.claude/hooks/protect-paths.sh`、`tests/test_protect_paths.py`、`tests/test_protect_drive_case.py`，以及 `tests/test_check_offline.py` 了解严格套件行为。
- 检查入口：`scripts/check_offline.py`、`scripts/check_repo.py`、`scripts/check_public.py`。
- 环境探针（只用真实命令）：Python/Bash 版本、`shutil.which` 结果、symlink 创建与执行、Bash 在 C locale 下的字符类行为、包装脚本在隔离 `PATH` 下的执行。
- 未查阅其他文档、旧读者记录或历史链接；未修改页面。

## 核对（非读者）

**核对环境**：同一工作树，HEAD `a4643790`；原生 Windows（`os.name=nt`）、Python 3.13.5、Git Bash 5.3.15；`python3` 在 `PATH`，`jq` 不在；未安装依赖、未改用户设置。页面 `docs/decisions/long-tasks.md` 实测 119 行、15490 字节、SHA256 `cba106f3…c9af8`，与任务卡和读者记录一致。

**复跑与原始结果**

| 检查 | 运行方式 | 实测 |
|---|---|---|
| 修复前基线 | 从 HEAD 取出两份原测试到单元临时目录，补齐 `templates/` 与 `domains/` 副本，`TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_protect*py'` | 退出 1；Ran 42，errors=108，skipped=8；108 个 error 全为 `FileNotFoundError`，8 个 skip 全在盘符套件。与读者记录逐项一致（首次临时目录漏 `domains/` 时多出 2 个模板副本 error，补齐后为 108）。 |
| 修复后同一入口 | 工作树内 `TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_protect*py'` | 退出 0；Ran 42，OK，无 skip（221 秒）；所选后端 `python3`。 |
| 新夹具单跑 | `TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_hook_test_support.py'` | 退出 0；Ran 12，OK，skipped=1（jq 未安装，双后端优先级用例未运行）。 |
| 显式 Bash | `BASH_UNDER_TEST=<Git Bash 的 Windows 路径>` 跑盘符套件 | 退出 0；Ran 8，OK。 |
| 无效 Bash | `BASH_UNDER_TEST=<不存在路径>` 跑新夹具套件 | 退出 1；5 errors；报错含 `BASH_UNDER_TEST is not an executable file`，无 skip、无通过。 |
| 直接 CLI | 隔离 `PATH`（仅 `cat` 与 `python3`），目录名含空格与中文 | deny 退出 0，stdout 为 deny JSON（原因 `中文原因`）；无匹配退出 0，stdout/stderr 均空；无效 JSON 退出 1，stdout 空，stderr 先出现解析器 traceback、末尾为 `无效 Hook 输入`。 |
| 仓库检查 | `python scripts/check_repo.py`、`python scripts/check_public.py`、`git diff --check` | 退出均 0；`check_public` findings 为空。 |
| 离线门禁 | `python scripts/check_offline.py` | 退出 2，BLOCKED：`POSIX with /bin/bash is required`；`missing required commands: jq`。未跑任何阶段。 |

**环境事实复核**：symlink 能创建，但 Git Bash 执行目录内 `cat` 报 127（`command not found`）；未设 `LANG`/`LC_ALL` 时 `[[ "C:/a/dist/文件.txt" =~ [[:cntrl:]] ]]` 匹配，`LC_ALL=C.UTF-8` 时不匹配。均与读者卡点一致。`C.UTF-8` 与 `en_US.UTF-8` 下均为不匹配，夹具的子进程 locale 固定可用。

**改动与保留行为**：`git status` 仅含写域内文件，页面未改，无本机绝对路径；两份原测试的 `def test_*` 方法与 HEAD 逐一相同，断言调用数保持 52/12；三份模板一致性、真实 subprocess、解析器追踪和解析器失败后 fail-closed 用例都在 42 例内通过；新增文件为 UTF-8、LF、2 空格。`python -m unittest tests.test_protect_paths...` 的模块式入口也可导入（`tests` 为命名空间包）。

**核对发现**

1. **“显式 Bash 优先于 PATH”没有可判别的回归。** `test_explicit_bash_is_selected_over_path` 传入的显式参数就是 PATH 上的同一份 bash，无法区分优先级。实测把 `select_bash` 改为忽略 `BASH_UNDER_TEST` 后，新夹具套件仍 12 例 OK（1 skip）。读者记录中“显式 Bash 运行两套入口 OK”用的也是与 PATH 相同的二进制，同样不能证明这一点。建议补一份显式值指向另一份可执行 bash 副本（或临时伪造 PATH 上的 bash）并断言实际采用它的用例；产品行为本身经独立探测是正确的。
2. **新模块注释与实际约束不符。** `hook_test_support.py` 模块注释称原生 Windows“usually cannot create symlinks”，而读者自己的卡点和本机复核都是“能创建、不能执行”（127）。真实约束是 MSYS 不能执行 Windows symlink，包装脚本绕开的是执行问题，不是创建权限。
3. 其余读者记录与实测一致。`check_offline.py` 的阻塞除 `POSIX`/`/bin/bash` 外还包括缺 `jq`（读者已在 jq 一节单独记录，不影响结论）。

**结论**：本地单元目标已达成且可复跑——原生 Windows Python unittest 入口 42/42 通过，显式/缺失 Bash 均明确失败，python3 后端隔离、UTF-8 与含空格目录、直接 CLI 的 deny/无匹配/无效 JSON 均实测符合。完整 POSIX 离线门禁与 jq 后端仍未验证，不能记为整体通过；按页面 §4 交云端补跑。页面无需因本项改；若要补，只需在 §4 区分“Hook unittest 入口可在 Git Bash 运行，完整 offline 门禁需要 POSIX”。


## 云端接回与采用（2026-11-13 UTC）

主线读取固定成果 ccd15c9，保留上方 Windows 读者与同机非读者复跑记录；未取得单独完整日志附件，也未在云端运行原生 Windows。全文固定哈希可对仓库重算一致；首次阅读及未看旧回执是读者声明，不能由代码或哈希独立证明其上下文隔离。

补验先修两项回传欠项：显式参数与环境变量的 Bash 选择均与 PATH 上的另一真实可执行文件竞争，忽略显式值的变异产生两处错误，不再让同一二进制伪装优先级验证；symlink 注释改成实测的“可创建但 Git Bash 无法执行”。独立审查还真实复现相对 Bash 路径通过探针、切 cwd 后失败；选定后转绝对路径，新增显式/PATH相对路径回归，并复测真实跨 cwd 启动。

实际采用链为：上一盘符任务采用后，把已暴露的测试入口缺口下发新读者 → 本机实施和复跑 → 固定结果接回 → 云端运行并处理独审缺陷 → 共享夹具进入两套真实 Hook 测试。页面核心步骤未改，只更新采用证据；未把具体实现知识缺失判为通用页流程卡点。未新建调度或人为中断。回传提交 211526c 时间为 2026-11-12 23:39:52 UTC；通知实际到达与开始接收的成对事件时间未完整留存，延迟记未知。

最终 POSIX 受检代码：两套 Hook 定向 Python / jq 各 42 项通过，新夹具 13 项通过；完整 offline 21 阶段通过，套件计数 470 / 11 / 42 / 10 / 26 / 21，无零测试、skip 或失败。真实 CLI 在隔离 python3 与 jq 两路分别重验 deny、无匹配、无效 JSON，退出码依次为 0 / 0 / 1，后两路 stdout 为空。独审复核显式相对与 PATH 相对选择在切 cwd 后均实际启动成功，优先级变异两子例均捕获。文档变更后另跑 check_repo、check_public 与空白检查。hosted CI 与原生 Windows 的最终云端补丁未重跑，不以 POSIX 通过替代。
