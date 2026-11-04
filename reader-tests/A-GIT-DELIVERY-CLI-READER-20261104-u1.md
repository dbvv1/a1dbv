# A-GIT-DELIVERY-CLI-READER-20261104-u1：非 UTF-8 输出下的 Git 交付清单

## 输入与页

- 页面：`docs/decisions/planning-and-tests.md`，固定 base `a5f003360aa8491de9038e54e0f5478f357e3d60`。
- 接收端已在任务正文附入页面全文；任务卡给出的固定全文指纹为 `2ae68c08b10ac743bda3e5273d325e68020cad61c22ae1b570b9f4da7cd2d6c1`。我读到的是附入正文，未拿 main 最新版或摘要替换。
- 页面之外的必要帮助见末节；没有读本仓旧 reader 结果、负责人解题笔记或其他同题修复产物。

## 首遍路线

按页面第一张表的判断：正确行为已经由任务与公开契约确定，缺的是能抓住 CLI 输出编码错误的检查，因此选**最小测试先行**（复现 → 修复 → 同输入重跑），不新建 Plan，也不先写跨会话规格。

理由：影响面只有 `prepare_git_delivery.py` 的 stdout 出口和对应测试，没有会改变实现的产品取舍；`templates/generic/git-object-delivery.md` 已说明只读、NUL 分隔读取、JSON 转义与非 UTF-8 路径拒绝，属于“项目已有实现模式和相关检查”，不需要 Plan 或 Spec。页面“何时不适用”一节的“已有可靠测试、范围和行为都明确：直接实施”，也支持不引入流程。

实际采用页面步骤：

1. “最小测试先行：复现 → 修复 → 同输入重跑”。
2. “在修复前跑同一检查，读具体失败……缺依赖、路径写错、测试没加载应先修环境”。
3. “修实现，保持断言含义”。
4. “沿真实入口看结果”，测试直接调生产 CLI，而不是只调 `module.prepare()`。

页面的 Spec Kit／OpenSpec 一节没有采用：本任务不需要跨角色共享新契约，公开契约与现有测试已够。

## 实跑记录

### 1. 基线（未改动前）

```text
python3 -m unittest discover -s tests -p test_prepare_git_delivery.py -v
Ran 12 tests → 9 ok，3 errors
```

三个错误在本机 Windows 上先于本次修改即存在，均为 fixture 无法创建，属环境限制：

- `test_changes_include_delete_binary_modes_and_unusual_paths`：`symlink` 创建失败。
- `test_mode_only_change_preserves_blob_identity`：`chmod 0o755` 后 `git commit` 返回 1（本机不记录文件 mode 变化）。
- `test_non_utf8_path_fails_explicitly_without_partial_output`：用 bytes 路径写非 UTF-8 文件名时，Python 3.13／Windows 先抛 `UnicodeDecodeError`，fixture 建不出来。

### 2. 手工复现目标缺陷（原脚本）

用临时合成 Git 仓、相邻两提交、新增 `测试-🧪.txt`，直调 `--base/--head/--full`：

```text
PYTHONIOENCODING=utf-8  rc 0  stdout 1981 bytes
PYTHONIOENCODING=gbk    rc 1  stdout 0 bytes  UnicodeEncodeError: 'gbk' codec can't encode '\U0001f9ea'
PYTHONIOENCODING=ascii  rc 1  stdout 0 bytes  UnicodeEncodeError: 'ascii' codec ... ordinal not in range(128)
```

与任务卡给出的复现一致。

### 3. 先加测试，首轮红灯（保留）

在 `tests/test_prepare_git_delivery.py` 新增：

- `cli_bytes()`：子进程只设 `PYTHONIOENCODING`，`capture_output=True` 取原始 bytes，不用 `text=True`，不在 helper 里改成 UTF-8，不 mock stdout。
- `native_entries()`：独立用 `git ls-tree -r -t -l -z` 枚举，不复用被测解析器。
- `test_cli_ascii_manifest_parses_under_non_utf8_output_encoding`：纯 ASCII 清单，三种编码。
- `test_cli_unicode_paths_parse_under_non_utf8_output_encoding`：中文加 emoji 路径，三种编码，比对完整条目、changes、blob SHA、mode。
- `test_unicode_error_diagnostic_is_not_masked_by_output_encoding`：失败诊断含 Unicode 时仍 exit 2、stdout 为空、无 traceback。

对未修改脚本运行新增测试：

```text
Ran 3 tests → FAILED (failures=2)
gbk:   0 != 1, traceback 停在 prepare_git_delivery.py:132 print(...)
ascii: 0 != 1, 同上
纯 ASCII 三项与 Unicode 诊断项通过
```

失败来自目标行为（打印 Unicode 路径时的 stdout 编码异常），不是环境或测试加载问题。

### 4. 修复

`scripts/prepare_git_delivery.py` 的 JSON 输出改为 `ensure_ascii=True`：stdout 只含 ASCII，任何 locale 编码都能写出；`json.loads` 从转义恢复原始路径、SHA 与 mode。Git 只读逻辑、退出 2 的失败路径、`remote_presence_checked=false` 均未改。

### 5. 同输入复跑

新增三项全部通过：

```text
Ran 3 tests → OK
```

完整模块：

```text
python3 -m unittest discover -s tests -p test_prepare_git_delivery.py -v
Ran 15 tests → 12 ok，3 errors
```

3 个 error 仍是第 1 步列出的本机 fixture 限制，不是本次改动引入；非 UTF-8 路径行为按任务要求记为“原生平台未验”，没有伪装通过。

### 6. 端到端 CLI 复核

同一合成输入，三种编码均：

```text
rc 0；stdout 全为 ASCII；stderr 无 traceback；
解析后条目 path='测试-🧪.txt'、mode='100644'、size=9、SHA 一致；
changes 含该路径。
```

### 7. 仓库检查

```text
python3 scripts/check_repo.py     exit 0  (772 files, errors [])
python3 scripts/check_public.py   exit 0  (1243 files, findings [])
git diff --check                  exit 0
```

完整 offline：

```text
python3 scripts/check_offline.py  exit 2
BLOCKED: POSIX with /bin/bash is required by existing fixture tests
BLOCKED: missing required commands: jq
```

本机是 Windows（非 POSIX）且没有 `jq`；按任务要求未安装依赖，完整 offline 记为未运行。

提交身份检查（接收更正）：原记录把配置来源误写为仓库本地；接收端审查说明其实际来源为全局配置。此处不保留个人配置值，不重新读取该配置。原读者未 commit／push；最终发布身份由负责人另行核验。

## 页面卡点

- 页面只给方法，没有说明如何验证“CLI 在非 UTF-8 stdout 下仍可解析”。具体做法（子进程按 bytes 捕获、只设 `PYTHONIOENCODING`、按明确编码契约解码）是我按自己的理解补的，页面未提。
- “‘不知道怎么实现’和‘不知道要什么’分开处理”一句要求先查调用链和默认值；但页面没有给出定位本仓测试入口的路径，我从任务卡和 `tests/` 目录找到 `test_prepare_git_delivery.py`。
- 页面“在修复前跑同一检查，读具体失败……缺依赖、路径写错、测试没加载应先修环境”帮助我把 3 个既有 error 判为环境限制，而不是本次目标失败；但页面没有说明平台无法创建 fixture 时怎样记录，我按任务卡“如实记未验”处理。
- 页面主张“沿真实入口看结果”，但没有涉及输出编码契约；选择 `ensure_ascii=True`（而非改写 stdout 字节流）是读者决定，页面未指导。

## 环境限制与读者失误

- 本机 3 个既有测试 error 见上，未修改旧测试，也未用 skip 掩盖。
- `check_offline.py` 需要 POSIX 与 `jq`，本机不满足，未安装。
- 首次端到端验证脚本把 emoji 路径直接 print 到本机 gbk 控制台，导致我自己的验证脚本抛 `UnicodeEncodeError`；CLI 当时已 exit 0，是记录方式出错，改用 ASCII 转义输出后得到正确证据。
- 起初担心 stderr 上的 Unicode 诊断会被编码异常掩盖；实际探测显示 Python 的 stderr 默认使用 backslashreplace，原实现已能 exit 2 且无 traceback，因此没有改 stderr。新增测试保留这一行为。

## 页面之外翻的资料

- `templates/generic/git-object-delivery.md`：任务允许的公开契约，用来确认 JSON 转义、非 UTF-8 路径拒绝和只读边界。
- `scripts/prepare_git_delivery.py` 与 `tests/test_prepare_git_delivery.py`：目标实现与现有测试。
- `docs/collaboration/operations.md` §1：确认检查命令与提交身份规则（页面未写，模板引用了该节）。
- `scripts/check_offline.py`（运行而非修改）与 `docs/collaboration/LONG-TERM-PLAN.md` 中的 offline 入口说明。

## 产物

- `scripts/prepare_git_delivery.py`：`ensure_ascii=True`。
- `tests/test_prepare_git_delivery.py`：新增 1 组 helper 与 3 个 CLI 级回归。
- 本记录。

## 核对

核对日期 2026-11-04。只读工作目录现状，未改页面、任务卡或结果分支；复核读者自报之外的原始命令与输出。

### 结论

**任务做成。** 修复范围最小且正确：stdout 改为 `ensure_ascii=True` 后，UTF-8／gbk／ascii 三种 `PYTHONIOENCODING` 下都只输出 ASCII，`json.loads` 能还原完整路径、SHA 与 mode；Git 只读逻辑、退出 2、`remote_presence_checked=false` 未变。新增回归直调生产 CLI，且经复核确实能在旧脚本上因目标行为失败。

### 实际验收（本轮复跑）

- 页面指纹：`git cat-file -p a5f0033…:docs/decisions/planning-and-tests.md` 的 SHA-256 为 `2ae68c08b10ac743bda3e5273d325e68020cad61c22ae1b570b9f4da7cd2d6c1`（13939 字节），与任务卡一致。
- 基线：HEAD 原脚本＋原测试 `Ran 12 tests → 9 ok，3 errors`。3 个 error 在改动前即存在，均属本机 fixture 限制（symlink、chmod 不产生 mode 变化、非 UTF-8 文件名建不出），与记录一致。
- 旧脚本＋新测试：`Ran 3 tests → FAILED (failures=2)`，失败来自 gbk／ascii 子进程打印 emoji 路径的 `UnicodeEncodeError`，是目标行为而非测试加载问题。
- 当前工作树：`Ran 15 tests → 12 ok，3 errors`（仍为上述 3 个既有 fixture 限制）；3 个新测试全部通过。
- 独立端到端（另建临时仓库，含 `目录/子-🧪.txt`、`新增-🧪.txt`）：三种编码均 `rc 0`、stdout 全 ASCII、stderr 无 traceback。用 `git ls-tree -r -t -z` 加 `git cat-file -s` 独立枚举（不复用读者 helper），entries 的 path／tree-blob SHA／mode／size、changes、base/head SHA、`remote_presence_checked=false` 全部一致。
- 旧脚本同输入：utf-8 `rc 0`；gbk／ascii `rc 1`、stdout 0 字节、`UnicodeEncodeError`，与任务卡给出的复现一致。
- Unicode 诊断：对不存在的中文目录路径，三种编码均 `rc 2`、stdout 为空、无 traceback，原错误未被编码异常掩盖。
- `python scripts/check_repo.py` exit 0（773 files，errors []）；`python scripts/check_public.py` exit 0（1243 files，findings []）；`git diff --check` exit 0；`python scripts/check_offline.py` exit 2（缺 POSIX `/bin/bash` 与 `jq`），与记录一致，未安装依赖。
- 改动范围仅 `scripts/prepare_git_delivery.py`、`tests/test_prepare_git_delivery.py` 与 reader 记录；无越界修改，未 commit／push。

### 页面卡点判定

四条都判为读者侧（model），不是页面缺信息：

1. 编码验证的具体 harness（bytes 捕获、只设 `PYTHONIOENCODING`、不 mock stdout）属实现层工程；页面负责选“最小测试先行”，并已写“沿真实入口看结果”，读者实际也做对了。
2. 平台限制的记录方式：页面同页已有“1 个 Windows 测试未运行”的先例，任务卡也明确“如实记未验”；读者处理正确，只是未引用页面已有先例。页面补一句“环境限制可记未验”会更完整，但不改变本轮路线。
3. 测试入口：页面原文就是“不知道时先从项目配置查”，读者照做后从 `tests/` 定位，卡点不成立。
4. 输出编码契约与 `ensure_ascii` 取舍：页面是方法选型页，任务卡明确不给修法；这属于读者实现决策，所选方案经独立复核语义无损。读者自己把 emoji 打到 gbk 控制台导致验证脚本报错，是记录失误，不是页面缺陷。

### 读者未意识到的错误（missed）

1. 身份来源表述错误：`git config --local user.name` 为空，用户名与邮箱来自全局配置，不是“仓库本地”。结论（未提交、无泄漏）不受影响，但证据表述不准。
2. Unicode 诊断测试只断言 `b'error:'`、exit 2、无 traceback，未断言原错误原因（如 `cannot change to`／`No such file`）仍在；换成通用错误文案也会通过，未真正锁住“原错误不被编码异常掩盖”的语义。
3. `native_entries` 与生产实现使用同一条 `git ls-tree -r -t -l -z` 并同样按 tab 切分、按 UTF-8 解码，只在“不调用被测解析器”层面独立；对 `ls-tree -l` 字段理解的共同偏差不会被这组期望值发现（SHA／mode 仍来自 Git，风险低）。
4. Unicode 用例用 `by_path` 字典汇合 entries，未断言条目数或重复路径，`--full` 的重复条目在该用例里抓不到（纯 ASCII 用例比较完整列表，可覆盖此点）。

## 负责人固定成果接收（2026-11-04）

在最新 main 的独立候选树接收固定 `9a5ba4bca22220171bb6b48b6efc3bd6870ddad6`，未接管原读者工作树、重派调用或解除旧隔离。上文 Windows 首轮结果及四条未关闭项保留为历史；以下为后续云端 POSIX、Python 3.12.14 验证。

- 保留最小生产修复 `ensure_ascii=True`，没有改 Git 读取、权限或发布行为。
- Unicode 用例额外核 entries 总数与唯一键数量、完整 head commit／tree SHA。期望文件是显式夹具清单，用 `rev-parse` 和 `cat-file` 逐对象核 type／SHA／size；不再复制生产 `ls-tree` 解析器。夹具文件 mode 已知为 `100644`，其他 mode、tree、gitlink、二进制与异常路径由原测试保留覆盖。
- 失败诊断明确要求 `git rev-parse failed`、`cannot change to` 与 `No such file or directory`，不能只凭通用 `error:` 前缀通过。Git 诊断 locale 固定为 C，三个 `PYTHONIOENCODING` 仍分别传入；未通过强制 UTF-8 绕开目标。
- 更正提交身份配置的来源误述，不读取或复述个人配置；本候选提交采用 GitHub noreply 身份，发布另核实际提交。
- 三项原 CLI 回归（加固语义断言）运行旧生产脚本：UTF-8 通过，gbk／ascii 两个子例因目标 `UnicodeEncodeError` 失败，无测试加载错误。候选完整模块 **16/16 通过，无 skip**；原 Windows 三项夹具限制在本 POSIX 环境实际通过，不改写为 Windows 已通过。

独审建议另加一项输出契约回归：Unicode 路径在三种编码下均要求 stdout.isascii()，并按 ASCII 解码后解析；这是候选选择的表示契约，与前述旧实现的语义回归失败分开记录。

四项遗留问题已在此次接收修正。页面方法指导与编码实现细节分层的判断不变，不因这次单项修复扩写答案页或升级整套方法评级。
