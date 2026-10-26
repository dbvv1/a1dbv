# opensrc：仓库 ref 完整性补丁（🧪 试用）

**版本敏感的判断，默认用原生 Git 固定完整 commit SHA，并核对 `git rev-parse HEAD`。** `opensrc` 的缓存标签不等于源码版本证明；本补丁供想继续试用其源码检索流程的人使用。

补丁让仓库 ref 缺失时失败，而不是把默认分支放进请求 ref 的缓存；支持完整 commit SHA。它合并两次本地修复，尚未进入上游，fork 入口未就绪。

## 复用

需要 Git、Rust/Cargo；在本仓库根目录执行。使用新目录，首次 Cargo 运行会下载锁定依赖：

```bash
artifact="$PWD/experiments/opensrc-ref-integrity"
git clone https://github.com/vercel-labs/opensrc.git opensrc-ref-trial
cd opensrc-ref-trial
git checkout --detach b51de60867e806da1839b33dd29c29424f12521b
git apply --check "$artifact/source-ref-integrity.patch"
git apply "$artifact/source-ref-integrity.patch"
cargo test --locked --manifest-path packages/opensrc/cli/Cargo.toml core::git::tests
cargo test --locked --manifest-path packages/opensrc/cli/Cargo.toml --test repo_refs
```

第一条测试命令覆盖 10 个 Git 单元测试；第二条运行 `invalid_repo_refs_are_rejected_before_metadata_cache_hits`，通过真实 CLI 检查 7 种非法 ref。

## 实测与适用范围

- 真实 parser 接本地 Git 夹具：不存在的 ref 不再回退默认分支，完整 SHA 取到指定旧提交；正常分支、tag 与合法 `+main` 保持可用。
- `test_clone_at_ref_leading_plus_is_a_literal_branch_name` 确保 `+main` 是字面分支名；`test_fetch_repo_source_rejects_empty_ref_before_cache_hit` 与 CLI 集成测试确保空值、refspec、选项和模式语法不能借缓存命中绕过校验。
- 复现探针使用合成的已解析仓库／包元数据、真实 Git 与真实 CLI 缓存读取；没有覆盖冷启动 registry HTTP，也没有衡量模型编码效果。
- 包版本缺 tag 时的默认分支回退仍属上游 [PR #57](https://github.com/vercel-labs/opensrc/pull/57)，本补丁不改它。既有错标缓存不重验、不迁移；试用请设置独立的 `OPENSRC_HOME`。
- 最终源码已通过 123 个 Rust 单元测试、1 个 CLI 集成测试、fmt、all-targets clippy（`-D warnings`）与版本同步检查；本次只打包并复核补丁，不重跑完整套件。

## 来源与许可

基线是 [vercel-labs/opensrc](https://github.com/vercel-labs/opensrc/tree/b51de60867e806da1839b33dd29c29424f12521b)；补丁精确对应本地 `5ad1c327fbb34d0a8e4f8e18459fc4550dd0e2ad`、`01df67802424580a93a04aa37d0bc3c058ff2013` 两次提交的合并差量。

修改通知：本补丁修改 `packages/opensrc/cli/src/core/git.rs`、`packages/opensrc/cli/src/core/fetcher.rs`，新增 `packages/opensrc/cli/tests/repo_refs.rs`，用于 ref 获取、校验及回归测试。

上游代码版权：Copyright 2025 Vercel Inc.；上游与本补丁代码按 Apache-2.0 分发，完整原始许可见 [LICENSE.upstream](LICENSE.upstream)。

源码与本地实测核实：2026-10-26。
