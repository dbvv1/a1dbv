# Hermes SDK 2 候选：Windows 原生读者验收

状态：review_ready（未提交、未推送，不自动接收）。本卡是一次独立读者按页面路线的真实执行，不改页面、不改 Hermes 共享 pin、不向上游提交。

## 1. 本任务实际入口、保留行为与不支持范围

按页面“共享依赖升级：先核是否还能保留原行为”及其链接候选 README 的“在独立源码副本重放”，本任务实际覆盖：

- 主请求：`agent.anthropic_adapter.build_anthropic_client` 构造，`create_anthropic_message` 的非流式与直接 stream 分支。
- 辅助请求：`agent.auxiliary_client._AnthropicCompletionsAdapter.create`。
- 复制客户端：`client.with_options(...)` 后再次请求。
- 认证：API-key 路由与 bearer/token 路由，核真正到达 transport 的认证头。
- 候选新增层：`agent.anthropic_sdk2_request.prepare_sdk2_message` 的 native 与 legacy gateway 分支。

必须保留的行为（由独立测试逐项断言）：

- key 路由只发 `X-Api-Key`，token 路由只发 `Authorization: Bearer`；复制后仍保持同一身份，不出现双认证。
- `timeout.read` / `timeout.connect` 与 `max_retries=0` 保持。
- 主/辅助、流式/非流式都走真实 SDK 构造，只替换外部 transport。
- native 默认 `temperature=1` 可省略；非默认采样在发请求前明确拒绝（ValueError、零请求），不静默丢弃。
- native 用户 text 的 citations 移除；assistant 来源与 `cache_control` 保留；输入消息对象不被修改。
- HTTP 400 抛 `BadRequestError`，恰好一次请求，不误走 stream fallback。

不支持或未验（沿用页面与候选 README 的边界）：

- native 非默认采样没有等价替代，仍是升级阻塞；不能以局部 native 通过升级全产品默认。
- Bedrock 旧模型仍需旧 SDK/API；Bedrock/Foundry 服务、OAuth 刷新、async client、完整 Hermes 应用、真实网关接受、发布矩阵与其他 OS 未验。
- 第三方网关能序列化旧参数只证明序列化，不算服务兼容；本次未调用任何真实模型或网关服务。

## 2. 冻结输入与环境

| 项 | 值 |
|---|---|
| a1dbv HEAD | `e43f4e047932b1c0d7d18c713e095aa621609167` |
| 页面版本 | `docs/decisions/migrations.md@77345c97`（blob `a5e71c809ebd39a0614ce235c084ef9eff011f7b`，与 HEAD 内容一致） |
| Hermes 固定提交 | `c9b20d7bc08dec1e10779a06d7d9073bc6e7e418` |
| 候选补丁 | `experiments/anthropic-sdk-migration/hermes-v2-contract.patch` |
| 补丁 SHA256 | `2a38c55cbb634e034e2deecbce90ef7eb1cc5986bdf8196b887af99bc28aa6ca` |
| 补丁应用 | 固定提交上 `git apply --unidiff-zero --check` 与 `git apply --unidiff-zero` 均干净；7 改 2 增共 9 文件 |
| OS | Windows 11 Enterprise 10.0.26300.9818，AMD64（win32-x64） |
| Python | CPython 3.14.9（MSC v.1944 64 位，2026-10-21 构建）；PM 固定 `3.14.9+20261021-win32-x64` |
| Shell | Git Bash（MSYS）执行 `scripts/run_tests.sh`；Python 为原生 win32，未使用 WSL |
| PM 固定 uv | 0.13.5 |
| 旧环境 | anthropic 0.125.0，httpx 0.28.1，Python 3.14.9，未打补丁的固定原树 |
| 候选环境 | anthropic 2.3.0，httpx2 2.15.1，Python 3.14.9，固定提交加候选补丁 |

两个环境分别由项目 PM 在独立源码副本构建，HOME/HERMES_HOME/HERMES_RUNTIME_DIR 均指向本单元临时目录；未读个人配置，未改全局设置。所有测试使用合成键与合成消息，网络传输换成内存 `MockTransport`，并把 `socket.connect/connect_ex/bind/listen` 替换为直接失败。

## 3. 重放命令（脱敏）

实际执行与候选 README 一致，只有 Windows 适配：

```sh
# 固定源码与候选补丁
git clone https://github.com/NousResearch/hermes-agent.git <unit-temp>/hermes
git -C <unit-temp>/hermes checkout --detach c9b20d7bc08dec1e10779a06d7d9073bc6e7e418
git -C <unit-temp>/hermes apply --unidiff-zero --check <worktree>/experiments/anthropic-sdk-migration/hermes-v2-contract.patch
git -C <unit-temp>/hermes apply --unidiff-zero <worktree>/experiments/anthropic-sdk-migration/hermes-v2-contract.patch
cp <worktree>/experiments/anthropic-sdk-migration/independent-original.py <unit-temp>/hermes/tests/agent/test_sdk_migration_independent.py
cp <worktree>/experiments/anthropic-sdk-migration/independent-native.py   <unit-temp>/hermes/tests/agent/test_sdk_migration_native_review.py
cp <worktree>/experiments/anthropic-sdk-migration/independent-gateway.py  <unit-temp>/hermes/tests/agent/test_sdk_migration_gateway_review.py
cp <worktree>/experiments/anthropic-sdk-migration/independent-native.py   <unit-temp>/hermes-old/tests/agent/test_sdk_migration_native_review.py

# 项目 PM 建两个隔离环境（Windows 用 Scripts/python.exe 与 8.3 短路径）
python -m pm.build_env --source . --out <short-temp>/sdk-old-env --cache <short-temp>/uv-cache-old --group dev --group test --extra bedrock
python -m pm.build_env --source . --out <short-temp>/sdk2-env   --cache <short-temp>/uv-cache-cand --group dev --group test --extra bedrock

# 候选门禁（README 的 3 文件 18 项）
HERMES_PYTHON=<short-temp>/sdk2-env/Scripts/python.exe HERMES_TEST_FILE_RETRIES=0 \
  bash scripts/run_tests.sh tests/agent/test_anthropic_sdk2_boundary.py \
  tests/agent/test_sdk_migration_native_review.py tests/agent/test_sdk_migration_gateway_review.py -q

# 旧版对照：只跑 native 文件
HERMES_PYTHON=<short-temp>/sdk-old-env/Scripts/python.exe HERMES_TEST_FILE_RETRIES=0 \
  bash scripts/run_tests.sh tests/agent/test_sdk_migration_native_review.py -q
```

逐项名称另用同一环境的 `python -m pytest <file> -v -p no:cacheprovider` 取得，未改变断言或选择。

## 4. 逐项结果

独立 native 消费者（`independent-native.py` 的七项）：

| 检查 | 旧 0.125.0 | 候选 2.3.0 |
|---|---|---|
| auth + copy + constructor[key] | passed | passed |
| auth + copy + constructor[token] | passed | passed |
| 主请求默认 sampling | passed | passed |
| 辅助请求默认 sampling | passed | passed |
| 辅助请求 temperature=0.3 | passed（发出 0.3） | passed（断言 ValueError、零请求；升级阻塞，非功能保留） |
| citations / assistant 来源 / 输入不变 | passed | passed |
| HTTP 400 不误回退 stream | passed | passed |

合计：旧 7 passed / 0 failed / 0 skipped；候选 7 passed / 0 failed / 0 skipped。

候选边界与网关控制：

- 边界 8 项：3 条路由的单一认证头、native 手动 thinking 载荷与用户 citations、legacy 网关采样保留且 native 非默认拒绝、callable token refresh 经 copy 保留、native `extra_body` 采样不能藏匿（0.3 与 1）。全部 passed。
- 网关控制 3 项：采样 body 保留（None 与 0.3）、citations 不被修改。全部 passed；只证明序列化，不证明任何网关接受。
- 候选 3 文件门禁：18 passed / 0 failed / 0 skipped（边界 8 + native 7 + gateway 3）。

原始逐项输出见同目录 `raw-test-output.txt`，结构化结果见 `native-consumers.json`。

## 5. 失败后修复的轮次（保留）

1. **首次 clone 超时与部分克隆。** 前台 clone 600 秒未完成被移入后台；随后出现 `fatal: could not fetch ... from promisor remote` 与 checkout 失败。HEAD 已是固定提交，核心目录可用；`website/`、`plugins/` 下 32 个文件因 Windows 文件名过长无法落地。这些文件不在本任务门禁范围，故继续，但记录该不完整点。对应页面句：候选 README 重放块中的 `git clone ...` 与 `git checkout --detach c9b20d7...`。
2. **PM 建环境失败：`ImportError: cannot import name 'YAML' from 'ruamel.yaml' (unknown location)`。** 候选与旧环境首轮都停在 PM 自身 runtime 校验。用较短目标路径直接调用 `pm.runtime_stage.stage_runtime` 可通过，定位为路径长度：PM 在 `installs/<hash>/pm-runtime/generations/<32位uuid>` 下再放 `Lib/site-packages/ruamel/yaml/__init__.py`，超过 Windows 260 字符，CPython 把 `ruamel.yaml` 看成无 `__init__.py` 的 namespace。改用 8.3 短路径设置 HOME/HERMES_HOME/HERMES_RUNTIME_DIR 与 `--out` 后，两环境均构建成功。对应页面句：`python -m pm.build_env --source . --out "$trial_root/sdk2-env" ...` 与 `export HERMES_PYTHON="$trial_root/sdk2-env/bin/python"`（页面按 Linux 写 `bin/python`，Windows 实际是 `Scripts/python.exe`）。
3. **候选包导入失败：`ModuleNotFoundError: No module named 'anthropic.types.beta.beta_managed_agents_self_hosted_resources_unsupported_deployment_paused_reason_error'`。** 文件实际存在；仍是用长路径启动 `sdk2-env/Scripts/python.exe` 触发同一 MAX_PATH 问题。改用 8.3 短路径启动该解释器后 `anthropic 2.3.0` / `httpx2 2.15.1` 正常导入。做错过：一开始用长路径 import，把环境误判为坏包。
4. **一个 `du -sh . .git` 探测超过 2 分钟。** 按任务要求核对后台任务并以 TaskStop 停止该自有探测，未等待、未据此判断任何结果。

首次两环境并发构建与后续顺序重试都失败/成功过；短路径修复后候选与旧环境分别独立构建成功，测试在各自环境重复得到相同计数。

## 6. 是否采用页面路线

是。按页面“先核目标版本支持的平台与行为、先试真实消费者、共享依赖先画调用路径、保留真实 SDK 只换内存 transport、不删断言/不换模型掩盖缺口”的路线执行；候选重放取自页面链接的候选 README。

与页面字面命令的偏离（均记录为 Windows 适配，不是降低目标）：

- `bin/python` 改为 `Scripts/python.exe`。
- 目标路径改用 8.3 短路径规避 Windows MAX_PATH；未启用系统级长路径开关，未改全局设置。
- 项目测试 runner 仍用原入口 `scripts/run_tests.sh`，保留原文件列表、`HERMES_TEST_FILE_RETRIES=0` 与退出码；它默认 `-j 24`（项目自有并发），未缩成 smoke、未删用例。
- 逐项名称的 `-v` 直接 pytest 运行仅用于读取测试 ID，门禁结论取自 `run_tests.sh` 的 18 项汇总。

## 7. 结论与未验范围

本任务确实按页面路线完成了一次 Windows 原生消费者实测：固定补丁哈希、旧/候选两套 SDK、七项 native 消费者各 7 通过，候选边界 8 与网关控制 3 通过。它补上了候选 README 所缺的 Windows 原生消费者一层，但**不能据此把整页改为 ✅，也不能据此升级全产品默认**：native 非默认采样仍是明确拒绝的阻塞，Bedrock/Foundry、OAuth、async、完整应用、真实网关与发布产物均未验；第三方网关测试只证明序列化。页面来源与共享 pin 均未改动。

## 8. 仓库检查

- `git diff --check`：通过（无输出）。
- `python scripts/check_repo.py`：通过。
- `python scripts/check_public.py`（对新增文件做 intent-to-add 后）：通过。
- 未提交、未推送；状态 review_ready。

## 9. 页面之外查了什么

- 页面链接的候选 README、三个独立测试文件与候选补丁本身。
- Hermes 项目内 PM 与 runner 源码：`pm/build_env.py`、`pm/runtime.py`、`pm/runtime_stage.py`、`pm/environment.py`、`pm/build_operations.py`、`pm/pyproject.toml`、`scripts/run_tests.sh`、`scripts/_activation.sh`，用于定位 PM runtime 校验失败和 Windows 启动方式。
- 补丁中的 `pyproject.toml` / `uv.lock` 变更，确认候选确实把 anthropic 从 0.125.0 切到 2.3.0。
- 本机 uv/Windows 行为：`uv python list`、手工 `uv venv`/`uv sync` 复现 PM staging、`GetShortPathNameW` 取 8.3 短路径。
- 未搜索同主题其他教程，未读 a1dbv 其他文档或既有读者结论。
