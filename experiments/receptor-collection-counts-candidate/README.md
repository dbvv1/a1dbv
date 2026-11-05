# pytest-receptor：collection error 计数修补备份

本目录保存尚未投稿的独立候选，供恢复和复审；只存在于备份分支，不表示已进上游或本仓 main。修补让 collection error 保留错误诊断，但不再冒充已执行或失败的测试项。原 pytest exit code 和原 phase 证据保持不变。

## 固定版本与恢复

- 上游：[uibcdf/pytest-receptor](https://github.com/uibcdf/pytest-receptor)，MIT；原许可见 [LICENSE](LICENSE)。
- 问题：[公开 issue #46](https://github.com/uibcdf/pytest-receptor/issues/46)，本次不关闭 issue、不改 resolved 状态。
- 基线：`acd8897f593fd11ec676c2b960fe53b9e699f5e6`；候选原提交：`098c34d34a0b7b13f8f155c5eceb2a6396da6fb7`。
- 候选 tree：`b79b82e528d4b212e208472c38bcafddafaed1c1`。仅四文件，89 行新增、3 行删除；[补丁](candidate.patch) SHA256：`e2598ebf8eb5dee3fe4aa4809491eb551adfc6d36c2ec55a7c55a32ec752d42a`。

在新的隔离克隆恢复，不对在途工作树执行：

```sh
git clone https://github.com/uibcdf/pytest-receptor.git receptor-recovery
cd receptor-recovery
git checkout --detach acd8897f593fd11ec676c2b960fe53b9e699f5e6
# PATCH 指向本目录 candidate.patch 的实际位置。
git apply --unidiff-zero --check "$PATCH"
git apply --unidiff-zero --index "$PATCH"
git write-tree
# 应为 b79b82e528d4b212e208472c38bcafddafaed1c1。
```

补丁是零上下文 unified diff，恢复的是精确源码树；重新提交会有新的提交身份/时间，不保证生成原 commit SHA。安装和复跑先遵守上游 AGENTS.md、MOLSYSSUITE_GUIDE.md 的官方 Conda 开发环境要求。

## 已执行验收

执行者截至 2026-11-05 11:39:08 UTC 的结果见 [机器可读清单](verification.json)。

- 原实现跑新增 33 项针对性回归全部失败；修补后 38 项相关测试通过。集成用例实际运行 human/llm/ci，以 pytest logstart、testscollected 和 exitstatus 为对照，覆盖 SyntaxError、ImportError、部分收集、普通运行、`-x`、`--maxfail=1`、`--continue-on-collection-errors`。
- 官方 Conda Python 3.14.10 editable 开发环境完整 297 项通过，pip check 通过。
- 同一候选构建 wheel `1.2.2+9.g098c34d`，SHA256 `add55f9f678b2a03725a8af9607c647205ed3783faaa5ea13db29f3a78fc26da`。Linux x86_64、Python 3.11.17 / 3.12.14 / 3.13.17 / 3.14.10 × pytest 8.4.2 / 9.2.0，八格各 serial 与 `-n 2` 均 297/297，共 16 轮 4752 通过。各格先核 site-packages 导入、版本及 pytest major；这是安装 wheel 的源测试矩阵，不等同 hosted CI 的 editable 安装流程。
- 3.14 / pytest 9 另跑 branch coverage，297/297 并生成 XML；只测主进程，未合并子进程和 worker coverage。
- Ruff 0.16.5 check/format、固定共享依赖路由 preflight `43b9f94bf5ab0ec3f54a4b2ca5b23b791d6af0bc`、token benchmark、performance `--tests 500 --repeat 2` 均通过；sdist/wheel build、twine strict、干净 wheel 安装及 pytest help 通过。benchmark 数字不是与旧版本受控比较，不据此宣称性能改善。
- 非作者独立跑完整 297 项，并核混合 collection/runtime failure 和 xdist 探针；另一次独审确认 38 项针对性测试与四文件哈希。未修改已审代码。

## 未通过、未执行和下一步

初次使用预装 Python 3.13.5 时，两种 pytest major 各 295 通过 / 2 失败，均为未改动的 `test_benchmarks_expose_cleanup_failure` performance 两例。固定基线原文件复现相同两失败：该环境 tempfile 使用 `_rmtree` 别名，使测试的 `shutil.rmtree` mock 未命中；官方管理的 3.13.17 使用 `_shutil.rmtree`，完整通过。没有删除测试、弱化断言或修改无关文件来掩盖此现象。

macOS、Windows 和 GitHub hosted CI 未运行；不声称全平台认证。上游仍需 PR 后的精确提交检查及维护者审查。备份时用户 fork API 返回 404，云浏览器尚未登录；fork、PR 和上游写入均未发生。恢复条件是完成授权 GitHub 登录、确认/创建用户 fork，再核上游当前 main 和开放 PR，按贡献规范保存候选、开 draft PR；如果授权或门禁不满足，只保留候选。

本目录不保存环境、依赖、凭据或原始日志。公开扫描和人工差量核查通过只覆盖公开候选及本说明，不改变未验证范围。
