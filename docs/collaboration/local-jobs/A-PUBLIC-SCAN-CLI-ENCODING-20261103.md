# A-PUBLIC-SCAN-CLI-ENCODING-20261103 · 非 UTF-8 输出环境仍交完整扫描 JSON
id: A-PUBLIC-SCAN-CLI-ENCODING-20261103
owner: dot-A
status: review_ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 76011c6b861b2d3f2a54c1171bb98d8057b40dbc
result_branch: relay/a-public-scan-cli-encoding-20261103

## 目标
本仓发布流程真实使用 `python3 scripts/check_public.py`；有 Unicode 文件名或命中内容时，扫描器应交回可解析 JSON 与原退出码，而不是因输出编码崩溃丢掉整份诊断。修正这个直接 CLI 缺陷，保持现有检测、脱敏、文件覆盖与发布门槛。
负责人 2026-11-03 08:05 UTC 在固定 base 的隔离云副本，用临时 Git 仓里的 `测试-🧪.txt` 与运行时拼接的合成 key 实际直调 CLI：UTF-8 得 exit 1／完整 JSON／1 项 finding；GBK 和 ASCII 均 exit 1／stdout 空／UnicodeEncodeError。只是云 Python 3.12.14 的编码环境复现，尚非原生 Windows 结果；输入和日志未公开真实路径或凭据。
这是新独立输出缺陷，不接管旧 PUBLIC-SCAN reader。旧 476ad4db 修测试夹具的子进程编码／父解码，现 `run_cli` 强制 UTF-8；已有“父 GBK”测试不能证明生产脚本默认输出耐受 GBK。不要抹掉旧修复及其准确验收范围。

## 按哪个 Skill 与规格做
读最新 AGENTS、CLAUDE、TASKS、手册§7、operations§1／§2.2 与 local-jobs README，沿现有验证路线先复现再修，在同一消费者接收；不新增方法或检查框架。
领取前 fetch main／负责人分支，核本卡、同两文件任务与结果、工作树差量及原调用／工具／登记进程是否有未停写者。已有重叠实施只报归属；状态未知保持隔离，不开续接、不改旧树。29 个云检出无差量及旧卡 accepted 不是所有进程退出证据。
使用新的独立任务工作副本并保原记录；不复用旧 reader 分支或 dirty 工作树。既有 main 若已修同一问题，报告实际版本与结果，不重复实现。
本机先只读核现有 Git 与 Python 3.11+ 可用入口／实际版本，使用当前真实解释器 `sys.executable`。本题只需标准库与 Git；没有则停报依赖缺口，不安装、不改 PATH／系统编码／权限，不把云端 venv 或旧本机版本当现成依赖证据。
固定源码 blob 为 scripts/check_public.py `5ad013c1f82288af865b9b9955d72c299b61636e`，测试 blob `ee52a4ce37302d43cfa6a1a57e0f352583a91a14`。读输出序列化、`scan_files`／`scan_commits` 返回契约和现有 `run_cli`；参考 check_repo 的可移植 JSON 处理，但不改它。
先加直接运行生产 CLI 的回归：测试不得通过现有强制 UTF-8 的 `run_cli` 消掉被测条件；对子进程分别设置 UTF-8／GBK／ASCII 的 PYTHONIOENCODING，父侧以原始 bytes 取 stdout／stderr，再解析 JSON，禁止 errors=ignore／replace 吞损坏。
使用独占临时 Git 仓、Unicode 文件名、运行时拼接的假凭据与普通文档；不读取个人配置。旧源码先出现目标失败，最小修正后同一回归通过。可用 JSON 转义保持对象内容和可移植性，不能删 Unicode 字符、丢 finding 或吞异常后报成功。
只修序列化与相应测试；不变 PATTERNS、safe／allowlist、tracked/symlink 扫描、身份规则、脱敏内容、退出码语义，不新增依赖、CLI 开关或全局输出设置。

## 写入范围
仅 scripts/check_public.py 与 tests/test_check_public.py；接收端只另更新本任务卡状态与当前结果。无页面、模板、allowlist、其他脚本、接收器、宿主、旧任务或长期规则改动；不新增实验目录或日志台账。
原始命令、stdout／stderr、输入、版本与脚本哈希留本任务私有临时证据。提交说明写实际旧失败／新通过及未验，不公开临时路径、合成 key 全文、账号或原始用户环境；不运行真实凭据扫描探测或联网服务。

## 怎样算做成
同一直接 CLI 在三种编码下：干净 Unicode 文件得 exit 0／有效 JSON／空 findings；含合成凭据得 exit 1／有效 JSON／完整 Unicode 文件名和原脱敏 finding，stderr 无 traceback，stdout／stderr 不含完整合成 key；缺失 root 仍按既有用法错误 exit 2，不新规定参数错误的 JSON 格式。
新回归在固定旧实现失败、候选通过，且验证的是实际 stdout bytes；不能只给函数调用或测试 helper 通过。UTF-8 下解析后的对象与旧实现一致，不减少 checked_files 或改变命中数来求绿。
跑 tests/test_check_public.py 的完整现有回归；本机 symlink／Git 能力或平台检查失败如实保留，禁止安装、调权限、删断言、skip 或降门槛。按手册§7运行本机可用检查与真实 CLI；POSIX 完整 offline 门槛可后由负责人在云端接收，不能称未运行的 native／hosted CI 通过。
非作者独立审两文件最小 diff、旧新直调回执及检测／脱敏保持；check_repo、check_public、git diff --check 和新增提交身份通过后，仅原接收端推 result_branch，回 review_ready，不用 accept:auto、不合 main。
一个 60–90 分钟单元，最多两小时；仅原接收端按共享最多4并行调度，不另起调用。遇明确拒绝停该动作、不换入口；没有原写者／工具条件就报具体阻塞。不得把新 build 当旧页 reader 或升级地图。

## 当前结果

- 已修正 check_public.py 的 stdout 序列化：整份 JSON 报告先 dump 再以 UTF-8 字节写 sys.stdout.buffer，GBK/ASCII 宿主编码不再抛 UnicodeEncodeError 丢诊断；检测、脱敏、文件覆盖与退出码语义不变。新增 3 个直接调用生产 CLI 的回归（run_cli_bytes 按 PYTHONIOENCODING=utf-8/gbk/ascii 设子进程编码、父侧原始 bytes 严格 UTF-8 解码），覆盖干净 Unicode 文件 exit 0/空 findings、含运行时拼接合成 key 的 测试-🧪.txt exit 1/原脱敏 finding/无 traceback/不泄漏 key、缺失 root 仍 exit 2。旧实现下 gbk/ascii 两子用例确认失败，修复后通过。本机实跑：tests/test_check_public.py 34 项全过；真实 CLI 在 utf-8/gbk/ascii 均 exit 0、有效 JSON、stderr 空；check_repo.py exit 0；git diff --check 通过；UTF-8 下新旧对象一致（checked_files、finding 数、文件名、脱敏内容均不变）。未关闭问题：无（openIssues 为空）。未运行验收：scripts/check_offline.py 因本机缺 POSIX /bin/bash 与 jq 被预检阻断，POSIX 完整 offline 门槛需负责人在云端接收；不能视为 native/hosted CI 通过。
- 产物：[7deb5bc](https://github.com/dbvv1/a1dbv/commit/7deb5bc8f206e1a28e7e6dde0a6432fcffe2044a)，分支 `relay/a-public-scan-cli-encoding-20261103`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：负责人在云端跑 POSIX 完整 offline 门槛，通过后仅由原接收端提交并推送 result_branch，回 review_ready（不改 main、不用 accept:auto）。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
