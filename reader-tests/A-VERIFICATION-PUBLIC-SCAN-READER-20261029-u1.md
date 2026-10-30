# 新读者记录 · A-VERIFICATION-PUBLIC-SCAN-READER-20261029 · u1

角色：第一次读该页的读者。只按任务给出的页面全文和真实任务操作，查了项目指令、实现、既有测试与 CI；另读了一份其它任务的 `reader-tests` 记录用来对齐本记录格式，已在“页面之外”披露。

## 做到哪一步

做完，结论：候选提交 `5f8b0b10e9e3fbf173253e2179afcab5cd06b193` 的这条 CLI 路线可以接收。父提交 `06c5a774f2a45e401e09d9157e9eb9b604b3eedc` 会把正常任务词判成凭据（exit 1），修后放行（exit 0）；两版都仍检出并脱敏合成凭据；正常输入兼容。整仓扫描两边都通过，但那不构成本次目标行为的证据，只作补充。

### 被测身份

- 候选／修后：`5f8b0b10e9e3fbf173253e2179afcab5cd06b193`（“Stop the sk- credential pattern from matching inside hyphenated words”）。
- 对照父提交：`06c5a774f2a45e401e09d9157e9eb9b604b3eedc`。
- `scripts/check_public.py` 的 git blob：父 `6a2ccc7e9e584c882c8fa38eeb8ca6d438dfe141`，修后 `af1b1ac712e862cb9e428c0fd41f924f68de9a40`；与 `git rev-parse <sha>:scripts/check_public.py` 一致。SHA-256 分别为 `d9035fe03fefa93651d1b2e29ad2782381e9207193c08133cf71a5a8ad6747b6`、`6f6bd2e3347c4a1e7090101393e39a86f60af0fd2ff828f8034ee6a5afea7b48`。
- `tests/test_check_public.py` 的 blob：父 `c963d6c08cfa90b856c1ebb48aaf934262778b7c`，修后 `6a3871b580ade2ac34a8d6bb7148e39fa016b363`。
- 两个检出各 `998` 个 tracked 文件。

### 真实 CLI 结果

命令（在两份仓外检出各自目录内执行）：

```text
python3 scripts/check_public.py --root .
```

合成输入与结果（stdout 为 JSON，stderr 均为空）：

| 输入 | 父提交 | 修后提交 |
|---|---|---|
| 正常任务词：一行含 `task-gpu-exclusive-capture-window`、`desk-gpu-exclusive-render-lock` | exit 1，2 条 `credential`，match `sk-gpu-exclu…` | exit 0，`findings: []` |
| 合成 sk 凭据：`"sk-" + "A1b2C3d4"*4`，写成 `SYNTHETIC_TOKEN=<key>` | exit 1，1 条 `credential`，match `sk-A1b2C3d4A…` | 同左 |
| 合成 sk 凭据前有空格：`token: <key>` | exit 1，脱敏同上 | 同左 |
| 合成 sk 凭据在行首 | exit 1，脱敏同上 | 同左 |
| 合成 GitHub 凭据：`"ghp_" + "Aa1"*12` | exit 1，1 条 `credential`，match `ghp_Aa1Aa1Aa…` | 同左 |
| 干净内容：占位邮箱、`/Users/Shared/…`、`/home/user/…`、短连字符词 | exit 0，`findings: []` | 同左 |
| 干净内容加正常任务词（同第一行） | exit 1，2 条 `credential` | exit 0 |

脱敏断言：`match` 只保留命中的前 12 个字符加一个 `…`（长度 13），完整合成串不出现在 stdout／stderr 中。三个 sk 场景和 gh 场景在两版都满足。

补充观察：提交说明里的短词 `task-gpu-exclusive window` 单独看只有 13 个字符在 `sk-` 之后，旧模式也不会命中；实际能复现的是提交自带回归里的更长连字符词（`task-gpu-exclusive-capture-window`、`desk-gpu-exclusive-render-lock`，均 ≥20 字符）。

### 相关回归

- 在两份检出各跑 `python3 tests/test_check_public.py -v`：均 `Ran 22 tests`，父提交 `FAILED (failures=3, errors=2)`，修后提交同样 `FAILED (failures=3, errors=2)`，失败集合完全相同：
  - FAIL `test_dangling_and_directory_symlinks_scan_link_text`
  - FAIL `test_symlink_allowlist_is_scanned_not_loaded`
  - FAIL `test_tracked_symlink_scans_link_text_not_target_content`
  - ERROR `test_core_symlinks_false_allowlist_text_is_scanned_not_loaded`
  - ERROR `test_tracked_path_and_allowlist_beneath_symlink_fail_without_reading`
  这 5 个都是符号链接用例，修前修后同样失败，判为 Windows 环境限制，不是本次改动引入；未 skip、未删、未改断言。其中 `test_core_symlinks_false_allowlist_text_is_scanned_not_loaded` 是含制表符的路径在 Windows 上写文件失败，`test_tracked_path_and_allowlist_beneath_symlink_fail_without_reading` 还把扫描输出里的 `…` 按 GBK 解码失败导致 stdout 为 `None`。
- 新增回归能否区分：把修后提交的测试文件原样放到父提交的 `tests/` 下只跑 `test_clean_and_placeholder_content_passes`，父实现 `FAILED (failures=1)`，失败内容正是 `sk-gpu-exclu…`；同一用例在修后实现 `ok`。说明该回归能检出原问题。
- 项目文档里的完整入口 `python3 scripts/check_offline.py` 在本机被前置检查拒绝：`rc=2`，stderr 为 `BLOCKED: POSIX with /bin/bash is required by existing fixture tests` 与 `BLOCKED: missing required commands: jq`，无任何 phase 运行。未安装依赖。

### 整仓扫描（补充，不作为验收依据）

两版各跑 `python3 scripts/check_public.py --root .`：`checked_files` 957，`findings` 0，exit 0，stderr 空。它只能说明现有仓库内容干净，不能区分本次误报修复。

### 产物位置

- 本记录：`reader-tests/A-VERIFICATION-PUBLIC-SCAN-READER-20261029-u1.md`。
- 仓外系统临时目录保留了：两份提交的检出、驱动脚本、各场景结果 JSON、两份测试日志、整仓扫描结果。未提交、未推送；夹具只用运行时拼接的合成串，没有真实凭据。
- 工作目录除本记录外无改动；未改页面、源码、TASKS 或既有产物。

## 卡点

### 1. “先从项目指令、包配置和 CI 找启动、测试、类型／构建及提交前命令；已有命令缺输入或环境就明确卡点，不猜替代入口。”（§前提）

- 缺什么：项目文档给的完整入口 `python3 scripts/check_offline.py` 在本机 Windows 直接拒跑（要求 POSIX／`/bin/bash` 和 `jq`），页面没给 Windows／Git Bash 的走法，也没说只想验一个测试文件时该用哪个入口。
- 实际处理：改用仓库已有的 unittest 入口 `python3 tests/test_check_public.py`；`scripts/check_offline.py` 的 `phases` 本身也是用 `--suite tests test*.py general` 调这批测试，所以不是另造入口。
- 做错过的：无。先跑完整入口确认卡点，再降级到目标测试。

### 2. “确认运行的是改后的代码…按提交检出的入口只验该版本。”（§第一步）

- 缺什么：页面没说如何在仓外拿到指定两个提交的可扫描检出；扫描器按 `git ls-files` 认受检文件，只解压目录不建索引会走 `rglob` 分支，行为不同。
- 实际处理：`git archive <sha> | tar -x -C <temp>/<name>`，再在临时目录 `git init -q` 与 `git add -A -f`，用 `git hash-object` 核对脚本 blob。没用 `git worktree add`，避免往共享仓库元数据写入。
- 做错过的：第一次只 `git add -A` 得到 992 个文件（`.gitignore` 挡了 6 个已被跟踪的文件），加 `-f` 后才对齐 998。

### 3. “前提是获准的隔离测试环境、合成数据。”（§前提）＋运行环境

- 缺什么：本机 TMP／TEMP 默认指向接收器自己的 git 仓内 scratch；Python `TemporaryDirectory()` 生成的“非 git 夹具”实际落在某个 git 仓子目录，`git -C <fixture> ls-files` 返回成功但为空，扫描计数变成 0。
- 实际处理：把 TMP／TEMP／TMPDIR 指到仓外独立目录后重跑。
- 做错过的：第一次跑出 27 failures + 2 errors，误以为 Windows 兼容问题更多；查 `git -C <temp> rev-parse --show-toplevel` 才发现夹具落在接收器仓内。属环境卡点，不是被测代码。

### 4. “先复现问题；已有测试能区分错误就复用，否则在原套件补回归，再改实现。”（§第一步）

- 缺什么：父提交的测试文件还没有新增词，直接在父提交跑既有套件不会复现误报；页面没说回归和修复在同一提交时，怎么做“修复前应失败”的对照。
- 实际处理：用真实 CLI 在两版跑同一合成输入复现；再把修后的回归测试文件放到父提交 `tests/` 下只跑该用例，得到 FAILED，证明回归能区分。
- 做错过的：无。

### 5. “失败先区分实现、测试与环境。”（§失败后修实现）

- 缺什么：页面没给 Windows 符号链接测试的预期结果。
- 实际处理：两版同 5 个符号链接用例失败／报错，逐条记名并判为环境；未 skip、未删、未改断言。
- 做错过的：自写驱动第一次用 `subprocess.run(text=True)` 未指定编码，被扫描输出里的 `…` 触发 `UnicodeDecodeError`；加 `encoding="utf-8"` 与 `PYTHONIOENCODING=utf-8` 后正常。

## 页面之外还去翻了什么

- `AGENTS.md` 执行约定、`scripts/check_offline.py` 的 `REQUIRED` 与 `phases`、`.github/workflows/repository-checks.yml`：找真实命令、平台前提和 CI 入口。属任务允许的项目指令与 CI。
- `scripts/check_public.py` 全文、`tests/test_check_public.py` 全文：理解误报模式、脱敏规则和 CLI 参数。属实现与既有测试。
- `git show`／`git diff 06c5a77 5f8b0b10` 与提交说明：确认改动只有一条 lookbehind 和一个回归词。
- `reader-tests/A-TESTMON-PATCH-READER-20261028-u1.md`：只读了记录格式。它是另一任务的读者记录，不在任务允许的“项目指令、实现、既有测试及页内引用”清单内，主动披露；未用于任何技术结论。
- 未读本题旧答案、作者自测回执、a1dbv 其它文档或同主题教程。

## 页面没写、按自己理解做的决定

- “真实 CLI”按独立进程跑 `scripts/check_public.py --root`，不 import 模块：既有测试多用 import，不能证明进程入口和退出码。
- 扫描器按 git 索引认文件，所以临时检出必须 `git init` 并 `git add -f`；夹具放 `reader-fixtures/`，每次跑完 `git rm --cached` 并删目录，避免场景互相污染。
- 合成密钥运行时拼接，不写进仓库或本记录；记录只保留脱敏后的前缀和省略号。
- 脱敏按“`match` 以 `…` 结尾、长度 13、完整合成串不出现在 stdout／stderr”断言。
- Windows 的 5 个符号链接失败判为环境问题：同一集合在修前修后结果相同，且都涉及符号链接或控制台编码。

## 未验范围

- 未在 Linux／CI 跑完整 `check_offline.py`；符号链接相关用例在本机未通过，不能声称全绿。
- 只验 `check_public.py` 的文件扫描 CLI 路线；未验 commit-identity 模式、其它检查器、UI／浏览器和模型。
- 凭据只抽样了 sk- 与 ghp_ 两类；其余模式未逐一构造样本，但既有 `test_flags_credential_key_path_and_email` 在两版都通过。

## 核对

复核者未参与写作，按任务验收在仓外独占临时目录独立重跑。结论：读者做成，候选提交 `5f8b0b10…` 的 `check_public.py` 文件扫描路线可接收；身份、真实 CLI 对照、回归区分、脱敏和整仓补充结论均能复现。以下为复跑一致项、纠正项和卡点归类。

### 复跑一致的部分

- 身份：候选 `5f8b0b10e9e3fbf173253e2179afcab5cd06b193`，父提交是其父 `06c5a774f2a45e401e09d9157e9eb9b604b3eedc`；diff 只有 `scripts/check_public.py` 一处 lookbehind 和 `tests/test_check_public.py` 一行回归词。两个脚本 blob／SHA-256、两个测试文件 blob 与读者所列一致。`git archive` 后 `git init && git add -A -f` 各 998 个 tracked 文件；只 `git add -A` 为 992（6 个被 `.gitignore` 挡住的已跟踪文件），与读者一致。
- 真实 CLI（独立进程、合成输入、stderr 空）：正常任务词父版 rc=1、两条 `credential`（`sk-gpu-exclu…`），候选 rc=0、`findings: []`；`sk-` 合成串在 `=` 后、空格后、行首三处两版都 rc=1，`match` 为前 12 字符加 `…`（长度 13），完整串未出现在 stdout／stderr；`ghp_` 合成串两版都 rc=1；干净占位内容两版 rc=0。脱敏断言成立。
- 回归区分：候选测试文件放到父实现只跑 `test_clean_and_placeholder_content_passes` 为 FAILED（`sk-gpu-exclu…`），同一用例在候选实现 ok。
- 套件：两版各 `Ran 22 tests`、`FAILED (failures=3, errors=2)`，失败集合与读者所列 5 项逐字一致。
- 整仓扫描：两版 `checked_files 957`、`findings 0`、exit 0；读者只作补充、不当作目标证据，处理正确。
- `python3 scripts/check_offline.py`：rc=2，两条 `BLOCKED`（POSIX／`/bin/bash`、缺 `jq`），无 phase 运行。

### 纠正项

1. **项目指令已给 Windows 走法，读者漏读。** `docs/collaboration/operations.md` §2.2 写明“接收端在 Windows 原生环境跑 `check_repo`＋`check_public`，完整离线门禁只在 POSIX 环境要求”，两个被测提交都含这句；`check_repo.py` 在本机 exit 0。把 `check_offline.py` 被 preflight 拒绝说成“项目／页面没给 Windows 入口”不准确：按项目指令本机本就不要求完整门禁，读者直接跑 `check_public.py` 的做法对，但应引这条，而不是记成项目缺信息。
2. **5 个符号链接失败的原因分错了。** 3 个 FAIL 不是“Windows 不支持符号链接”：夹具的链接文本是绝对目标路径，位于用户目录下的 `%TEMP%`（`C:\Users\<用户名>\...`），被扫描器自己的 `local-path` 规则命中，断言里多出 `('local-path', …)`。把 TMP／TEMP 指到用户目录之外的临时根后，这 3 个用例通过；候选全量只剩 2 个 ERROR（文件名含制表符在 Windows 非法；`text=True` 用 GBK 解码含 `…` 的输出导致 stdout 为 `None`）。后两个是 Windows 平台／默认区域设置暴露的可移植性问题（制表符文件名；GBK 默认解码），不是符号链接支持问题，“5 个均为环境限制／Windows 不支持”会误导 owner。
3. **“仍检出合成凭据”只对带分隔符的 key 成立。** 修复的 lookbehind 只排除紧邻 ASCII 字母／数字的 `sk-`；运行时拼接的合成 key 若紧贴在字母或数字之后（`x<key>`、`1<key>`、URL 路径末尾），父版 rc=1，候选版 rc=0 不再检出。这是“要求词边界”的既定取舍，不是缺陷，但读者没探这个边界就说“保持安全边界”，结论不全。
4. **卡点未按任务的“页面／环境／模型分列”。** 第 3 条（TMP 落在 git 仓内）本质是环境前提，不是页面缺信息；读者把它和页面缺信息混在同一列表。复跑确认：把 TMP 指到仓内 git 子目录，套件正好 `27 failures + 2 errors`，与读者所述一致。

### 卡点归类

| # | 读者卡点 | 归类 | 说明 |
|---|---|---|---|
| 1 | 完整入口在 Windows 拒跑、缺窄入口说明（§前提） | model | 页面确未写，但 `operations.md` §2.2 已给 Windows 政策，读者未读到；其实际做法（直接跑 `check_public.py`）符合该政策，未造成错误结论。 |
| 2 | 仓外指定提交的可扫描检出（§第一步） | page | 页面未给“扫描器按 git 索引取文件”时如何做提交级检出；读者用 `git archive`＋`git init`＋`git add -f` 解决，方法正确，初始 992→998 的偏差已自查。 |
| 3 | TMP 落在 git 仓内导致夹具计数为 0（§前提） | page | 页面的“隔离测试环境”没提醒临时目录必须在任何 git 仓之外；读者用 `git rev-parse --show-toplevel` 定位后恢复，属环境前提缺失。 |
| 4 | 回归与修复同一提交时如何做“修复前应失败”对照（§第一步） | page | 页面按“先补回归再改实现”写，未覆盖同一提交的情况；读者把候选测试文件放到父实现上跑，方案有效。 |
| 5 | Windows 符号链接用例的预期结果（§失败后修实现） | model | 页面未给预期，但失败输出已显示多出的 `local-path` 命中，读者没有据此区分实现／夹具与环境，把 3 项误判为 Windows 不支持符号链接（见纠正项 2）；5 项失败本身记录如实，未 skip／删／改断言。 |

核对未改页面、源码、TASKS 或既有产物；复核只证明这条 `check_public.py` 文件扫描 CLI 路线，未代替 Linux／CI 完整门禁、commit-identity 模式、其它检查器或 UI 实测。
