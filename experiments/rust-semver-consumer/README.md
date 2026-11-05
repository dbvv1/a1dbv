# Rust 公开 API：用下游编译确认破坏，警告另验行为

🧪 **Agent 修改 Rust 库的公开 API 时，先用 cargo-semver-checks 定位，再用同一最小消费者对照固定旧版和新版。** 当前工作区能编译不代表旧消费者能升级；工具的 warning 也不等于已证实的破坏。内部应用、纯实现改动不必统一增加此门禁。此处接续已有探索条目，直接复核真实项目历史，不新增合成变异系列。

## 实际结果

固定 librouting 的 `lr-bgp`：基线 v1.2.0 对应 `64bfbf74da03d8c1c2c0084f238efc41557f33f1`，当前 `1e17c5bdd6f5a065faa974e1e4156aae52b1b500`，两者 package version 均为 1.2.0。Rust 1.99.0、cargo-semver-checks 0.51.0、Linux x86_64。

- 工具真实退出 **100**：原文为 `229 checks: 227 pass, 1 fail, 1 warn, 31 skip`。`enum_variant_added` 指向新增的 `AttrType::BgpLsAttribute`。没有运行全部工作区或全部 feature 组合。
- 相同的 23 分支穷尽匹配消费者，旧版 `cargo check` 退出 **0**，新版退出 **101**，唯一编译错误是 E0004，缺少新增分支。这是根据真实 API 写的最小下游证据，不是已有第三方应用，也不是工具自动生成的 witness。
- `partial_ord_enum_variants_reordered` 只报 warning。该枚举显式设定 discriminant；原有 22 个无字段变体加 `Other(0..=255)` 共 **278 个旧值**，全部 **77,284 个有序对**的 `partial_cmp` 输出逐字节相同，两组运行均退出 **0**。这确认该固定历史对、该类型的旧值比较未变，不能把源码位置移动直接当行为破坏；不代表新增值与旧值的关系或整个库行为不变。

因此，接受“新增枚举分支破坏旧的穷尽匹配”的发现；不接受“这次 PartialOrd 警告已经证明旧值排序破坏”的推断。上游换到 v1.3.0 基线再启用阻断，只说明改了检查基线，不证明 v1.2.0 消费者已恢复兼容。固定版本的运行时间不是性能基准，也未测 Agent 效率收益或最新库版本。

## 复跑

先安装官方 Rust 1.99.0 与 cargo-semver-checks 0.51.0；本次使用隔离的 `CARGO_HOME`、`RUSTUP_HOME` 和 `rustup-init.sh --no-modify-path --profile minimal --default-toolchain 1.99.0`，未改全局 profile。工具来自官方 release 的 `cargo-semver-checks-x86_64-unknown-linux-gnu.tar.gz`，SHA256 `cacadafaa5cd27ae6d05a74a103266917ebab4c5e43c898360e177d4fbf06a65` 与 GitHub asset digest 一致。librouting 为 MIT OR Apache-2.0；依赖按各自许可。需要联网下载公开源码和依赖，不启动路由服务、不访问生产或付费服务。

在此目录执行（源码目录为临时本地内容，不提交）：

```sh
git clone https://github.com/TES286-org/librouting.git changed-source
git -C changed-source checkout 1e17c5bdd6f5a065faa974e1e4156aae52b1b500
git -C changed-source worktree add ../baseline-source 64bfbf74da03d8c1c2c0084f238efc41557f33f1
(cd changed-source && RUSTUP_TOOLCHAIN=1.99.0 cargo semver-checks -p lr-bgp --all-features --baseline-root ../baseline-source --color never)
# 预期 100，检查 semver-output.txt 中具体 fail / warn，不能只看退出码。
(cd baseline && cargo +1.99.0 check --locked); echo "baseline=$?"
(cd changed && cargo +1.99.0 check --locked); echo "changed=$?"
(cd baseline-ordering && cargo +1.99.0 run --locked --quiet > output.txt); echo "baseline-ordering=$?"
(cd changed-ordering && cargo +1.99.0 run --locked --quiet > output.txt); echo "changed-ordering=$?"
cmp baseline-ordering/output.txt changed-ordering/output.txt
wc -l baseline-ordering/output.txt changed-ordering/output.txt
sha256sum baseline-ordering/output.txt changed-ordering/output.txt
```

消费者源码、Cargo.lock、真实诊断与退出码保留在对应目录；输出只替换本机绝对路径。`ordering-results.json` 保存两份完整输出的行数与哈希，重复的 77,284 行不入库。第一次在 partial clone 中使用 `--baseline-rev v1.2.0` 因缺 Git 对象退出 101，原错误另存；成功结果来自同一基线的显式 `--baseline-root`，没有把第一次失败计作 lint 结论。

## 依据与采用边界

- 官方：[v0.51.0 发布与安装](https://github.com/obi1kenobi/cargo-semver-checks/releases/tag/v0.51.0)、[固定 README 的覆盖与误报边界](https://github.com/obi1kenobi/cargo-semver-checks/blob/v0.51.0/README.md)。它不能替代运行时测试，也不覆盖所有类型、泛型、生命周期与 feature 组合的破坏。
- 真实项目：[原报告及配置提交](https://github.com/TES286-org/librouting/commit/1e17c5bdd6f5a065faa974e1e4156aae52b1b500)、[改变基线后恢复阻断的提交](https://github.com/TES286-org/librouting/commit/6ed3f954ef469542374f36c14c64786024211e37)。本次只运行一个受影响 crate，不把原作者对其他 crate 的描述当复跑结果。
- 语义：[Cargo 新增枚举变体规则](https://doc.rust-lang.org/cargo/reference/semver.html#enum-variant-new)、[PartialOrd 派生先按 discriminant、再按字段排序](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html#derivable)。
- 社区：[HN 原讨论](https://news.ycombinator.com/item?id=36642989)强调 API 形状检查不等于行为兼容。讨论来自 2023 年，只作长期限制，不作当前效果认证。

核实与真实运行：2026-11-05。适合发布 Rust 库的公开 API 改动；独立版本工作区应逐 crate 选基线。对于具体 warning，复核语言语义和真实行为后再决定，不统一忽略警告，也不让 Agent 为消除警告擅自改版本策略。当前最佳工具的全面比较未完成，不升全仓默认。
