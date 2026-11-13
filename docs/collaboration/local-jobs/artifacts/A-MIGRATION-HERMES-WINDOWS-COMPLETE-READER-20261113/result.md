# A-MIGRATION-HERMES-WINDOWS-COMPLETE-READER-20261113 验收结果

**结论：在完整 Windows 原生源码副本上，Hermes SDK 2 候选的限定消费者接收通过；不升全产品默认。** 固定源码 `c9b20d7bc08dec1e10779a06d7d9073bc6e7e418` 的两棵独立树（原树／候选树）各 25167 个 Git 跟踪 blob，逐项存在且内容一致，未打补丁前缺失 0、变更 0。候选补丁 SHA256 `2a38c55cbb634e034e2deecbce90ef7eb1cc5986bdf8196b887af99bc28aa6ca` 与候选 README 记录一致。原树 native 7 项、候选 3 文件 18 项均通过，0 失败／skip，退出码 0。非默认采样在 native 路由仍被明确拒绝，第三方控制仍只证明序列化；真实网关、Bedrock／Foundry、完整应用与全量测试未验。

## 做了什么

1. 在独立临时根目录按固定提交取完整源码：`git init` 后用 `git fetch --depth 1 origin c9b20d7...` 取该提交并 checkout，再复制一份未打补丁的原树；两树互不覆盖。
2. 列 `git ls-tree -r HEAD` 全部条目，逐个核工作区文件存在，并用 `git hash-object --stdin-paths`（应用 clean filter）核对 blob 内容。候选树与原树分别记录在 `complete-source-candidate.json`、`complete-source-original.json`。
3. 只对候选树应用 `experiments/anthropic-sdk-migration/hermes-v2-contract.patch`，核补丁 hash、正向／反向 `git apply --unidiff-zero --check` 与恰好 9 个文件；记录见 `patch-verification.json`。
4. 用项目 PM 为两树各建独立环境（`python -m pm.build_env --source . --out <env> --group dev --group test --extra bedrock`），均为原生 win32 Python 3.14.9；候选环境 anthropic 2.3.0／httpx2 2.15.1，原树环境 anthropic 0.125.0；记录见 `env-versions.json`。
5. 按原项目入口 `bash scripts/run_tests.sh` 运行门禁：原树只跑 native 文件，候选跑边界／native／第三方控制三文件；原始输出见 `original-native-gate.txt`、`candidate-gate.txt`。

## 源码完整性

| 树 | HEAD | Git 跟踪 blob | 缺失 | 内容不符 |
|---|---|---|---|---|
| 候选树（未打补丁前） | c9b20d7bc08dec1e10779a06d7d9073bc6e7e418 | 25167 | 0 | 0 |
| 原树 | c9b20d7bc08dec1e10779a06d7d9073bc6e7e418 | 25167 | 0 | 0 |

- 第一次用原始字节 SHA1 核对时有 3117 个文本文件“不符”，原因是系统 `core.autocrlf=true` 让 checkout 写出 CRLF；改用 Git clean filter 计算后为 0，不是源码缺失。
- 两树都是固定提交的完整工作树；本次使用 `--depth 1` 浅取，Git 历史不完整，但该提交的全部跟踪源码 blob 已逐个核对。Windows 长路径处理见读者记录，未改任何系统长路径设置。

## 候选重放结果

| 门禁 | 文件 | 通过 | 失败 | skip | 退出码 |
|---|---|---|---|---|---|
| 原树 native（旧 SDK 0.125.0） | 1 | 7 | 0 | 0 | 0 |
| 候选边界／native／网关（SDK 2.3.0） | 3 | 18 | 0 | 0 | 0 |

候选 18 项分布：`test_anthropic_sdk2_boundary.py` 8 项、`test_sdk_migration_native_review.py` 7 项、`test_sdk_migration_gateway_review.py` 3 项；逐项 node id 见 `acceptance.json` 与 `candidate-node-ids.txt`。

补丁检查：SHA256 与候选 README 一致；`git apply --unidiff-zero --check` 退出 0，应用退出 0，反向 check 退出 0；7 个修改文件、2 个新增文件，与补丁清单一致。

## 边界与未验

- **非默认采样仍是升级阻塞。** native 路由的 `temperature=0.3/1` 在发请求前抛 `ValueError`，transport 调用 0 次；这不是“功能保留成功”。legacy 第三方 base_url 仍保留采样与 citations，但只证明序列化。
- **第三方网关只做控制。** 测试断言 `anthropic-version`、采样字段与 citations 同时发出，不证明任何网关接受新版 API header。
- **未验：** 真实模型／网关、Bedrock／Foundry／Azure／AWS 服务、完整 Hermes 应用、全量测试／CI、真实日志链、本 win32 局部消费者之外的跨 OS 结果。
- 因此只接收本任务实际消费者的局部候选结果；不更新全产品默认，不改上游 PR。

## 产物

- `acceptance.json`：机器可读验收（源码完整性、补丁、环境、门禁、逐项 node id、边界与未验）。
- `complete-source-candidate.json`、`complete-source-original.json`：两树完整性原始数据。
- `patch-verification.json`、`env-versions.json`：补丁与环境证据。
- `candidate-gate.txt`、`candidate-gate-verbose.txt`、`candidate-node-ids.txt`、`original-native-gate.txt`、`pm-build-candidate.txt`、`pm-build-original.txt`：脱敏原始输出。

## 仓库检查

| 检查 | 结果 |
|---|---|
| `python scripts/check_repo.py --root .` | 982 个文件，0 errors，退出 0 |
| `python scripts/check_public.py --root .` | 1604 个文件，0 findings，退出 0 |
| `git diff --check` | 无输出，退出 0 |

首次 `check_public` 因 pytest 参数化 node id 回显了合成凭据串而报 2 处 credential；已把该合成串替换为 `synthetic-api-key-param` 占位符（无真实凭据），复跑通过。`review_ready` 按仓库合同回交，未提交、未推送、未合 main。
