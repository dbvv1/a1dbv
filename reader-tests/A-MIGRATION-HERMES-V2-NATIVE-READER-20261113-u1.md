# 读者记录：A-MIGRATION-HERMES-V2-NATIVE-READER-20261113 u1

本页 `docs/decisions/migrations.md@77345c97` 的首次阅读者。未参与该页或 Hermes 候选写作/审查。只按页面及其链接的候选 README 操作；页面未改。

## 做到哪一步

按页面“共享依赖升级：先核是否还能保留原行为”和候选 README 的“在独立源码副本重放”完整执行：

1. 克隆 Hermes 固定提交 `c9b20d7bc08dec1e10779a06d7d9073bc6e7e418`，在独立副本应用候选补丁（SHA256 `2a38c55cbb634e034e2deecbce90ef7eb1cc5986bdf8196b887af99bc28aa6ca`），`git apply --unidiff-zero --check` 与正式应用均干净。
2. 按项目 PM 在独立副本建两个环境：旧 anthropic 0.125.0 / httpx 0.28.1，候选 anthropic 2.3.0 / httpx2 2.15.1，均为 CPython 3.14.9、Windows 11 10.0.26300 x64。
3. 旧/候选分别跑 `independent-native.py` 七项：各 7 passed、0 failed、0 skipped。
4. 候选另跑边界 8 项与网关控制 3 项：11 passed、0 failed、0 skipped；候选 3 文件门禁合计 18 passed。
5. 跑 `check_repo`、`check_public`、`git diff --check`；未提交、未推送，review_ready。

实际产物（均脱敏）：

- `docs/collaboration/local-jobs/artifacts/A-MIGRATION-HERMES-V2-NATIVE-READER-20261113/result.md`
- 同目录 `native-consumers.json`、`raw-test-output.txt`
- 本记录

## 卡点：页面哪一句、缺什么、做错过什么

1. **候选 README 重放块**：`git clone https://github.com/NousResearch/hermes-agent.git "$trial_root/hermes"` 与 `git checkout --detach c9b20d7...`。前台 clone 600 秒未完成被移入后台；随后 `fatal: could not fetch ... from promisor remote`，checkout 失败。HEAD 已正确，核心目录可用；`website/`、`plugins/` 下 32 个文件因 Windows 文件名过长未落地。缺的是完整工作树，但不在本任务门禁范围。做错过：首次用了 `--filter=blob:none` 的部分克隆，放大了 fetch 失败。
2. **候选 README 重放块**：`python -m pm.build_env --source . --out "$trial_root/sdk2-env" ...` 与 `export HERMES_PYTHON="$trial_root/sdk2-env/bin/python"`。页面写的是 Linux 的 `bin/python`，Windows 实际是 `Scripts/python.exe`。首轮两环境都在 PM runtime 校验失败：`ImportError: cannot import name 'YAML' from 'ruamel.yaml' (unknown location)`。缺的是更短的路径：PM 在 `installs/<hash>/pm-runtime/generations/<32位uuid>` 下放 `ruamel/yaml/...`，超过 260 字符，CPython 把包看成 namespace。用较短目标路径直接 `stage_runtime` 可通过，证实是 MAX_PATH。改用 8.3 短路径设置 HOME/HERMES_HOME/HERMES_RUNTIME_DIR 与 `--out` 后两个环境构建成功。
3. **候选环境启动**：页面示例直接用环境解释器。首次用长路径启动 `sdk2-env/Scripts/python.exe`，导入 anthropic 2.3.0 抛 `ModuleNotFoundError`，目标文件却在磁盘上；仍是同一 MAX_PATH。改用 8.3 短路径启动后正常。做错过：先怀疑安装包损坏，实际是路径长度。
4. **页面“旧版对照另建固定原树和 PM 环境，只运行 native 文件；不要在同一环境卸装两个版本”**：按此另建未打补丁原树和旧环境，只跑 native，未在同一环境切换版本。
5. **候选 README 的“本入口已在固定候选上实跑：3 文件、18 项通过”**：本机复现为 18 passed / 0 failed，与页面计数一致；旧/候选各 7 项也与页面“各 7 通过”一致。
6. **页面与候选 README 均未给 Windows 路径长度/`bin` 与 `Scripts` 差异**：这不是本任务要改页面的内容，只在此记录为页面缺口。

另有一个 `du -sh . .git` 探测超过 2 分钟，按任务要求用 TaskStop 停止自有探测，未据此判断结果。

## 页面之外还翻了什么

- 页面链接的候选 README、`independent-original.py`、`independent-native.py`、`independent-gateway.py` 和候选补丁。
- Hermes 项目内源码：`pm/build_env.py`、`pm/runtime.py`、`pm/runtime_stage.py`、`pm/environment.py`、`pm/build_operations.py`、`pm/pyproject.toml`、`scripts/run_tests.sh`、`scripts/_activation.sh`，用于定位 PM runtime 校验失败与 Windows 启动方式。
- 补丁里的 `pyproject.toml` / `uv.lock` 变更，确认 anthropic 由 0.125.0 切到 2.3.0。
- 本机行为：`uv python list`、手工 `uv venv`/`uv sync` 复现 PM staging、用 `GetShortPathNameW` 取 8.3 短路径。
- 未搜索同主题其他教程，未读 a1dbv 其他文档或既有读者结论。

## 未验范围

真实模型/网关/云服务、Bedrock/Foundry、OAuth 刷新、async client、完整 Hermes 应用、发布 wheel/安装矩阵、其他 OS、上游 PR 与默认 pin。第三方网关只证明序列化。候选对 native 非默认采样明确抛 ValueError、零请求，这是升级阻塞；本次局部通过不能升级全产品默认，也不能把整页改为 ✅。

## 核对

核对者未采信读者自报，按同一基线重新核对源码、依赖、测试文件、原始输出与仓库检查（2026-11-13），只在本单元临时目录操作。

**实际重跑与核对**

- 候选 3 文件门禁按原入口 `scripts/run_tests.sh`（`HERMES_TEST_FILE_RETRIES=0`，`-j 24`）重跑：18 passed / 0 failed，退出码 0，与 `raw-test-output.txt` 的 18 项一致。
- 旧版 native 7 passed / 0 failed（退出码 0），候选 native 7 passed / 0 failed；逐项 node id 与 `native-consumers.json`、raw 日志一致。
- 两个环境均为 CPython 3.14.9，`hermes-pm-built=true`，uv 0.13.5；候选 anthropic 2.3.0 / httpx2 2.15.1，旧 anthropic 0.125.0 / httpx 0.28.1；editable 映射分别指向 `hermes` 与 `hermes-old`。三个独立测试文件与 `experiments/anthropic-sdk-migration/independent-*.py` 逐字节一致，未删断言。
- 页面 blob `a5e71c809ebd39a0614ce235c084ef9eff011f7b` 与 `77345c97`、HEAD 一致；补丁 SHA256 与声明一致；在 `c9b20d7` 上 `git apply --unidiff-zero --check -R` 通过，确认工作树等于固定提交加候选补丁；9 文件（7 改 2 增）。
- `git diff --check`、`scripts/check_repo.py`、`scripts/check_public.py` 均退出 0；产物未发现本机绝对路径或凭据。
- 卡点复现：PM 的 `Lib/site-packages/ruamel/yaml/__init__.py` 路径为 271 字符，`ImportError` 与读者记录一致；长路径解释器导入 269 字符的 anthropic 文件复现 `ModuleNotFoundError`，8.3 短路径导入 2.3.0 正常；缺失的 32 个文件加基址后为 260–290 字符（3 个 `plugins/config_backends`、29 个 `website/i18n`）。

**卡点判断**

- clone/checkout：README 写的是普通 `git clone`，读者自行使用 `--filter=blob:none` 并沿用，最终仓库仍是部分克隆（`remote.origin.promisor=true`、`partialclonefilter=blob:none`）。promisor fetch 失败主要是模型侧偏差；32 个文件未落地是下一行的页面缺口。
- 32 个文件未落地、PM 的 `bin/python` 与 `Scripts/python.exe` 差异、PM runtime 与解释器的 MAX_PATH：属页面/候选 README 未写的 Windows 前提（README 只声明受测 Linux），为页面缺口。读者改用 8.3 短路径是正确适配；这些文件不在 3 文件门禁内，不影响计数。
- `du -sh . .git` 超时：非页面步骤，读者按任务要求停止自有探测，未据此判断结果，无影响。

**未意识到的错误**

- 最终 `hermes` 仍是部分克隆且工作树缺 32 个文件，读者记录却写“完整执行”，result §3 也写“实际执行与候选 README 一致”；该状态未在重放命令中体现。缺的是非门禁文件，故验收仍成立。
- `hermes-old` 无 `.git`，产物未记录原树的复制/导出方式，单看结果无法证明它是 `c9b20d7`；核对者另行按关键文件哈希确认未打补丁。
- `native-consumers.json` 的边界 8 项使用了 `native-key`/`gateway-key`/`minimax-token` 等自定标签，不是 pytest 实际 node id（raw 日志为 URL 参数）；计数一致，但逐项追溯不能直接 grep。
- result §1 把“主请求 … 非流式与直接 stream 分支”列为覆盖，但 3 文件门禁只走 `create_anthropic_message`/`_AnthropicCompletionsAdapter`；补丁新增的主线程入口 `open_sdk2_stream`（`chat_completion_helpers._StreamingCall._open_anthropic_stream`）在门禁测试中无引用，也未列入未验范围。本次结果只能确认 helper 的 `messages.stream`，不能确认该直接入口。

**结论**：读者确实按页面路线完成了 Windows 原生消费者实测，任务验收成立；上述证据链限制与部分克隆必须保留，不能据此升级全产品默认或把整页改为 ✅。
