# 默认 feature 升级可用，显式关闭默认值仍可能坏

**保持旧消费者的依赖声明与调用方式，再分别核默认策略和实际支持的显式 feature 选择。** librouting 增加默认 `keyed-auth` 后，原 Simple Password 消费者的编译与行为都保留；原来可用的 `std`-only 构建却失败。默认开启的功能集合已经改变，不能用默认路径通过覆盖关闭默认值的调用方。

## 固定输入与已验结果

本例接续[公开 API 迁移路线](../../../docs/decisions/migrations.md#公开-api库能构建旧调用方仍可能坏)，对象与原 `lr-bgp::AttrType` 实试不同，目标是同仓的 `lr-bfd`。

- 基线：[v1.2.0 `64bfbf74`](https://github.com/TES286-org/librouting/tree/64bfbf74da03d8c1c2c0084f238efc41557f33f1)。
- 新版：[`1e17c5bd`](https://github.com/TES286-org/librouting/tree/1e17c5bdd6f5a065faa974e1e4156aae52b1b500)，两版包版本均为 1.2.0。
- Linux x86_64，Rust／Cargo 1.99.0。各消费者保留自己的锁文件；两份默认配置 manifest 沿用依赖默认值，基线为 `std`，新版为 `std + keyed-auth`；另外两份显式配置只启用原来的 `std`。

| 检查 | 基线 | 新版 |
|---|---|---|
| 同一消费者 `cargo check --locked --all-targets` | exit 0 | exit 0 |
| 同一消费者 `cargo test --locked` | 26 passed，零 ignored | 26 passed，零 ignored |
| 固定逻辑时钟的双会话轨迹 | SHA256 `a5ab85fc497f564761190345d13cd6045443f633410d3138aa406dd92e09ebf3` | 与基线逐字节相同 |
| 原生 `cargo test -p lr-bfd --locked` | 41 passed | 59 passed |
| `cargo check -p lr-bfd --locked --no-default-features --features std` | exit 0 | exit 101，两个 E0599 |
| 同一消费者声明 `default-features=false, features=["std"]` | check 与 26 项测试通过 | check／test 均 exit 101，未运行测试 |

cargo-semver-checks 0.51.0 的裸命令、显式 `--default-features`、显式 `--only-explicit-features --features std` 三种比较均退出 0，原输出为 `229 checks: 229 pass, 31 skip`。本例启发式所选集合恰好与各版默认值相同；31 项仍跳过。即使选择正确的显式集合，API 扫描也没暴露下方编译失败，仍须编译和运行原消费者。

**默认消费者的行为保持。** 两个 Simple Password 会话按固定输入建立连接，测试涵盖状态、输出报文字节、事件、计时、合法认证、错误口令／key ID／缺认证、非法报文与超时。新观察测试输出的 301 步轨迹一致。上述消费者由非读者在独立源码副本再次编译、运行，26 项与轨迹哈希一致；原生 41／59 项由首轮和修页后两位读者分别运行通过。两版均无 doctest。

**`std`-only 是独立接收时发现的额外失败，修页后的新读者在真实消费者中再次复现。** 关闭默认值后，新版 `BfdSession` 仍调用只在 `keyed-auth` 下编译的方法 `verify_inbound` 与 `sign_packet`，因此库自身编译失败。基线同一命令成功；新读者用同一消费者源码、只保留原来有效的显式 feature 声明，确认基线 26 项通过、新版无法编译，测试未运行。这里只比较固定历史，不说明当前最新版仍有此缺陷；没有修改库、开启默认功能代替原配置，或发起上游投稿。

## 消费者从哪里来

`historical.rs` 从基线 [`session_tests.rs`](https://github.com/TES286-org/librouting/blob/64bfbf74da03d8c1c2c0084f238efc41557f33f1/crates/lr-bfd/src/session_tests.rs)提取 25 个测试及辅助函数：将内部 `super::*` 换成公开 `lr_bfd`／`lr_core` 导入，`crate::auth::AuthKey` 改为公开路径。原 `remote_demand_ceases_periodic_tx` 使用私有 `tx_allowed`，不纳入公开消费者；它仍由原生测试覆盖。

第 26 项 `deterministic_simple_password_trace` 是新写的观察探针，使用旧公开 API 与原测试输入，记录两版输出；不是历史应用代码。两消费者共用同一文件，SHA256 为 `b6b19be9aa2fa1ee36f81113d563f092e04eaeb00cc9ac6fd2e5816cc620556b`。这是从真实项目提取的最小下游探针，不是已部署的第三方应用；测试口令来自公开夹具，不使用真实凭据、网络或路由服务。保留上游 MIT OR Apache-2.0 两份许可。

## 当前版本的修复候选：保留消费者配置，不强开默认功能

**当前上游仍有同一编译故障；[候选补丁](current-std-fix.patch)恢复了原 `std`-only 消费者。** 固定上游 [`f7c39906`](https://github.com/TES286-org/librouting/tree/f7c39906f430f9099c5db5a4b529cbc43a11963f) 的包版本为 1.8.0，原样编译仍报上述两个 E0599。补丁不改公开签名或报文格式，默认认证保持；未编入 crypto 却配置了 keyed auth 时，拒绝新报文收发，不降级认证。已有输出队列保留，重试计时与事件反映实际行为，清除不支持的配置后恢复。

| 本次检查（Linux x86_64，Rust／Cargo 1.99.1） | 结果 |
|---|---|
| 原样 default／修复后 default／修复后 `std`-only：未改动的原消费者 | 各 26 项通过，轨迹与上文历史哈希相同；原样 `std`-only 编译失败、测试未运行 |
| 修复后原生 default／仅 `keyed-auth` | 各 59 项通过 |
| 修复后原生 `std`-only／无默认 feature | 各 44 项通过，包含拒绝、空／截断输入、计时、队列、超时与恢复回归 |
| 四组 package Clippy、fmt、文档检查、workspace build | 通过 |
| workspace Clippy | 失败于未改动的 `crates/lr-cli/src/daemon_ospf3_tests.rs:637`：`useless_format` |

**补丁已独立审查，仍是本地候选。** 非作者复跑原生与原消费者，另核新回归；所有执行的测试零失败、零 ignored。未运行整工作区测试、MSRV、其他目标、真实网络互通、ABI／发行门禁；关闭默认 feature 的宿主构建不证明 `no_std`。上游[贡献规则](https://github.com/TES286-org/librouting/blob/f7c39906f430f9099c5db5a4b529cbc43a11963f/CONTRIBUTING.md#how-to-land-a-change)要求非平凡改动先讨论，本次没有 issue／PR 或上游采用，不据此改变读者地图评级。核实与运行：2026-11-09。

### 复跑当前候选

在本目录的新副本中准备下文的 `source` 克隆及官方 Rust 1.99.1，再执行。两份 `consumer-current*` 保留原消费者与 feature 声明，只更新目标依赖版本及相应锁文件；不要把它们的锁文件换回历史 1.2.0。

```sh
export RUSTUP_TOOLCHAIN=1.99.1
mkdir current
git -C source archive f7c39906f430f9099c5db5a4b529cbc43a11963f | tar -x -C current
(cd current && git apply --check ../current-std-fix.patch && git apply ../current-std-fix.patch)
for consumer in consumer-current consumer-current-std; do
  (cd "$consumer" && cargo check --locked --all-targets)
  (cd "$consumer" && BFD_TRACE="../$consumer.trace" cargo test --locked)
done
cmp consumer-current.trace consumer-current-std.trace
(cd current && cargo test -p lr-bfd --locked --no-default-features --features std)
```

补丁 SHA256：`42ef4978cb542eb47e44b6bbf80972f251ee796ae4b019024abe40be2fb8627f`。先核补丁和固定源码；已有工作目录不要覆盖。

## 复跑

先准备官方 Rust 1.99.0；固定工具另用 crates.io 的 cargo-semver-checks 0.51.0。依赖装在任务隔离目录，不改全局配置。在本目录执行：

```sh
git clone --no-checkout https://github.com/TES286-org/librouting.git source
mkdir -p baseline new evidence
git -C source archive 64bfbf74da03d8c1c2c0084f238efc41557f33f1 | tar -x -C baseline
git -C source archive 1e17c5bdd6f5a065faa974e1e4156aae52b1b500 | tar -x -C new
export RUSTUP_TOOLCHAIN=1.99.0
for version in baseline new; do
  (cd "consumer-$version" && cargo check --locked --all-targets)
  (cd "consumer-$version" && BFD_TRACE="../evidence/$version.trace" cargo test --locked)
  (cd "consumer-$version" && cargo tree --locked -e features > "../evidence/$version.features.txt")
done
cmp evidence/baseline.trace evidence/new.trace
sha256sum evidence/baseline.trace evidence/new.trace

(cd baseline && cargo check -p lr-bfd --locked --no-default-features --features std); echo "baseline-std=$?"
(cd new && cargo check -p lr-bfd --locked --no-default-features --features std); echo "new-std=$?"
# 上面分别预期 0、101；核两个 E0599 的实际位置与原因。
for version in baseline new; do
  (cd "consumer-$version-std" && cargo check --locked --all-targets); echo "$version-std-consumer=$?"
  (cd "consumer-$version-std" && BFD_TRACE="../evidence/$version-std.trace" cargo test --locked)
done
# 新版 std 消费者在编译阶段失败；其测试没有运行。
(cd new && cargo semver-checks -p lr-bfd --baseline-root ../baseline --default-features --color never)
(cd new && cargo semver-checks -p lr-bfd --baseline-root ../baseline --only-explicit-features --features std --color never)
# 两个 API 扫描都预期 exit 0；不能据此忽略上面的编译失败。
```

使用干净目录解包两版，保留源码不改；已有结果目录先按自己的恢复需要处理，不以重跑覆盖未确认的工作。`cargo check` 默认 target 可能不含消费者：本例代码全部位于集成测试，因此明确用 `--all-targets`，并实际运行测试。两版默认策略与显式 `std`-only 命令分别判断，不把新版独有的 feature 名传给旧版。

## 读者与接收范围

首轮独立云端读者先读完整冻结页面（a1dbv `62046b6b`，SHA256 `6b7e4fbde6c442bdd18a1128244e31c387b4e8f15981dc6da2fbb19a7f69630a`），未参与页面写作，也未读旧实验或读者答案。页面提供两版本、真实消费者和失败分层路线；安装工具、从内部测试提取公开调用、选择报文输入与输出记录仍需读者已有知识。其反馈指出测试型消费者需要显式 target，默认 feature 集合也应和原声明分开记录，已回流路线。

修订后另一新上下文只读完整候选页（SHA256 `82199fbccce910c89c222b334068ab244b8e9a9bb91835d7d4d1101e099b904b`）、目标项目及原消费者文件，先完成独立照做，再看本记录审结论。其 default 与显式 `std` 两组运行复现上述通过／失败，正确判断不能批准两种配置整体升级；页面路线在已准备工具与给定消费者的条件下可执行，没有新页面卡点。它也另跑了原生 41／59 项默认测试，均通过；原生显式 `std` 的基线通过、新版仍编译失败。

首轮查询 GitHub release 元数据返回 403，未重试该入口；工具安装使用独立发布于 crates.io 的官方 0.51.0 包。没有把工具准备问题记成迁移失败。

这是云端 reader 与独立接收，不替代本机 reader 门槛。未验 MSRV、其他 target、完整工作区、C ABI、网络互通或新 keyed-auth API 的行为；没有净提效或工具排名结论。核实与运行：2026-11-08。
