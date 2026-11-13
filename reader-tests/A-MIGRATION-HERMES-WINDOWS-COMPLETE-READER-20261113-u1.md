# A-MIGRATION-HERMES-WINDOWS-COMPLETE-READER-20261113 读者记录

读者第一次读 `docs/decisions/migrations.md@a5324e32` 与候选 `experiments/anthropic-sdk-migration/README.md#sdk2-current-candidate`；未读过旧读者报告正文，未参与前次实测。固定 Hermes `c9b20d7bc08dec1e10779a06d7d9073bc6e7e418`，页面 `a5324e32`。

## 做到哪一步

完成页面验收第 2 条要求的完整 Windows 原生源码前提，并在其上重放候选：

- 两棵独立树（原树／候选树）各有 25167 个 Git 跟踪 blob；逐个核工作区文件存在，并用 clean filter 核 blob 内容，缺失 0、不符 0。
- 补丁 SHA256 与候选 README 一致；`git apply --unidiff-zero` 应用成功，9 个文件。
- 原树 native 7 项、候选边界／native／网关 3 文件 18 项，均 0 失败／skip，退出码 0。
- 产物在 `docs/collaboration/local-jobs/artifacts/A-MIGRATION-HERMES-WINDOWS-COMPLETE-READER-20261113/`：`result.md`、`acceptance.json` 与脱敏原始日志。
- 未提交、未推送、未改页面；工作区只新增本记录与上述产物。

## 卡点（按页面原句）

1. **页面「Windows 原生先处理工作目录与解释器」第 1 条**：“将源码、PM 输出、缓存和临时 HOME 放在短路径下……若系统未提供短路径名，选择更短的工作根目录，不自动修改系统长路径设置。”
   - 卡点：短工作根目录仍不够。Git 把仓库解析到长物理路径，`website/i18n/...`、`plugins/...` 等 32+ 文件在 checkout 时报 `Filename too long`；这正是该节第 3 条所说“原副本缺 32 个 website／plugins 文件”的来源。
   - 做错与返工：先在长路径直接 checkout（失败并留下半 checkout）；再用 cmd `%~sI` 取 8.3 短路径，`git rev-parse --show-toplevel` 仍返回长路径；再用 `subst H:` 得到 `H:\work\...`，Git 仍解析到 subst 目标的长真实路径，仍失败。
   - 解决：只在临时 clone 内设 repo-local `core.longpaths=true`（不是 Windows 系统长路径设置）后 checkout 完整。页面给的“8.3 短路径”不足以绕过 Git 的真实路径解析，建议补这一条。

2. **页面「在独立源码副本重放」的 `git clone ...`**（Linux 形态命令）。
   - 卡点：完整历史 clone 在约 259 MB 时被 HTTP/2 `RPC failed; curl 92 ... CANCEL` 中断；第二次 shallow fetch 又因我加的 `lowSpeedLimit=1000` 在网络慢时被中止。
   - 做错：第一次直接重试完整 clone；实际只需要固定提交的完整工作树。改为 HTTP/1.1 的 `git fetch --depth 1 origin <sha>` 后成功。
   - 说明：浅取缺的是 Git 历史，不是跟踪源码；25167 个 blob 已逐个核对。

3. **页面「Windows 原生先处理工作目录与解释器」第 3 条**：“clone／checkout 报错先核实际缺失文件……要声称完整仓库兼容，须先恢复完整源码再跑原产品门禁。”
   - 卡点：用原始字节 SHA1 核 blob 时 3117 个文本文件“不符”。
   - 做错：一度以为源码被改。实际是系统 `core.autocrlf=true` 让 checkout 写出 CRLF；改用 `git hash-object --stdin-paths`（clean filter）后为 0 不符。下一位读者应在步骤里直接写 clean-filter 核法，避免重复误判。

4. **页面「Windows 原生先处理工作目录与解释器」第 2 条**：“将 `HERMES_PYTHON` 指向对应环境的 `Scripts/python.exe`，不是 `bin/python`。”
   - 未卡住：按此设置两套 PM 环境均正常；候选 anthropic 2.3.0／httpx2 2.15.1，原树 anthropic 0.125.0，均为原生 win32 Python 3.14.9。

## 页面之外还翻了什么

- 读 Hermes 仓库自身的 `pm/build_env.py`、`scripts/run_tests.sh`、`scripts/_activation.sh`，确认 Windows 使用 `Scripts/python.exe`、`HERMES_PYTHON` 带 pytest 时可跳过激活同步；这是执行入口所需，不是同主题教程。
- 为确认产物目录与 `review_ready`／公开扫描约定，读了本仓 `docs/collaboration/local-jobs/README.md`、`scripts/check_repo.py`、`scripts/check_public.py`；未用它们推断迁移步骤。
- 查本机 Git 系统配置 `core.autocrlf=true` 与 Hermes `.gitattributes`（`* text=auto`、源码 `eol=lf`），用于解释 blob 核对差异。
- 未读 `A-MIGRATION-HERMES-V2-*` 旧读者报告正文，未把页面链接的历史证据当操作教程；只在目录列表中见到文件名。
- 未搜索同主题的其他教程；联网只访问固定 Hermes 仓库本身（获取固定提交源码）。

## 核对

非读者独立核对（未参与照做，不采信自报）。结论：**任务自身验收确实做成**，核心数字与门禁均可复现；未发现删断言、改页面／候选、改系统长路径设置或把未验项写成通过。

### 复跑与核对

- 两树 HEAD 均为 `c9b20d7b…`，各 25167 个 Git 跟踪 blob。以 `git ls-tree -r -z HEAD` 的全量路径喂 `git hash-object --stdin-paths`：两树均 exit 0（无缺失文件）；原树 0 个不符，候选树当前仅补丁涉及的 7 个修改文件不符，其余 25160 个一致。用 `--no-filters` 复核原树恰为 3117 个不符，与 `core.autocrlf=true` 的解释一致。
- 补丁 SHA256 `2a38c55c…` 与候选 README 一致；`git apply --unidiff-zero --check` 在未打补丁原树 exit 0，候选树反向 check exit 0。把原树 9 个文件在临时目录用补丁重建后与候选树逐字节相同，说明候选没有补丁外的手工修改；因此“补丁前 0 缺失／0 不符”成立。
- 两套原生 win32 环境（Python 3.14.9）版本：候选 anthropic 2.3.0、原树 0.125.0，httpx2 均 2.15.1。按原入口 `scripts/run_tests.sh` 独立复跑：候选 3 文件 18 passed／0 failed／0 skip、exit 0；原树 native 1 文件 7 passed、exit 0；与读者记录一致。
- 三个独立测试文件与 a1dbv 的 `independent-*.py` sha1 相同；测试只用合成键和内存 transport，socket connect 被断言禁用。
- `python scripts/check_repo.py --root .`：982 文件、0 errors、exit 0；`python scripts/check_public.py --root .`：1604 文件、0 findings、exit 0；`git diff --check` exit 0。工作区只新增产物与本记录；页面、候选 README、补丁未改。

### 卡点判定

1. **Windows 第 1 条（短路径）— cause=page。** 我从 8.3 短路径运行 `git rev-parse --show-toplevel`，返回的仍是长物理路径，读者的判断成立；页面应补“repo-local `core.longpaths=true` 或物理短根”，仅给 8.3／subst 别名不够。读者未改系统长路径设置。
2. **`git clone` 全历史 — cause=page。** 任务只需固定提交的完整工作树；页面宜给 `git fetch --depth 1 origin <sha>` 和 HTTP/1.1 退路。读者的 `lowSpeedLimit=1000` 是自加的中断条件，已自行纠正，不算页面缺陷。
3. **blob 核法 — cause=page。** 系统 `core.autocrlf=true` 下原始字节 SHA1 会误报 3117 个文件；页面应直接写 `git hash-object --stdin-paths`（clean filter）。读者已自行发现并改正。
4. **公开扫描的合成串 — cause=page（任务／扫描约定缺提示）。** `check_public` 把 pytest 参数化 id 里 20+ 字符的 `sk-…` 合成串报成 credential；读者用占位符换掉后 0 findings 是正确的。但占位符也把该 node id 改成了不存在的 id，需在产物里标注或改用 `-k`，见下。

### 漏项

- `acceptance.json`／`candidate-node-ids.txt` 的 `[https://api.anthropic.com-synthetic-api-key-param]` 不是实际 node id（实际参数值比占位符长，含 `sk-ant-api-synthetic` 前缀和额外后缀）；按该 id 逐项复跑会 no tests ran。
- PM 环境与 SDK 导入同样受 260 字符路径限制：实际测试用的是短 subst 盘路径，而 artifacts 只写 `<TRIAL_ROOT>`，长路径段又只讲 Git。按深临时根目录复跑 `import anthropic` 会 ModuleNotFoundError（我已复现；短路径／8.3 下 2.3.0 与 0.125.0 均可导入）。
- 原树 native 门禁依赖把 a1dbv 的 `independent-native.py` 复制为 `tests/agent/test_sdk_migration_native_review.py`；artifacts 的命令与步骤没有记录这次复制及其 hash（我核过与原文件 sha1 相同），从干净固定树按 artifacts 直接复跑会缺文件。
