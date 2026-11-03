# A-DEPENDENCY-LOCATOR-FACTS-20261102 · 实际依赖定位的 Cargo 官方边界
id: A-DEPENDENCY-LOCATOR-FACTS-20261102
owner: dot-A
status: revision_requested
kind: build
page: docs/decisions/skills-and-plugins.md@2bddaaf7b5ed7f9bd151315cab6b67e2a9e97709
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 378f9667af8110be1838170e1faf44c076bf2496
result_branch: relay/a-dependency-locator-facts-20261102

## 目标
核“先定位实际依赖，再选文档或源码”中 Cargo 命令的适用边界，给采用该路线的读者明确何时能据结果选对源码、何时仍缺构建条件。只补现有推荐的事实输入，不开新补丁实验、不增加工具推荐。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 与 local-jobs README。fetch main 与负责人分支，核同题任务和独占写域；原调用或同题写者退出未知时不另起重复工作。
输入仅固定页“先定位实际依赖，再选文档或源码”及其官方原始链接。核 Cargo metadata 的 resolve.nodes/deps/dep_kinds、重命名依赖与 package ID、--filter-platform、feature 合并、--locked --offline 和 source/manifest_path/lib_src 的含义；依官方 Cargo Book、metadata 命令文档和必要的公开源码／维护者说明核每项。
解释这些字段与当前 target/feature 的实际构建之间还差什么；尤其区分找到已解析包、目标筛选与验证真实调用兼容。官方未保证的条件写未知，不从某个项目曾通过推成通用保证。
不扩 Node/TanStack、Context7、Skill 安装或新生态，避免与 A-SKILL-PAGE-FACTS 和旧 A-SKILL-PACKAGE-ENTRY 重复；不重做 opensrc 修复、不读取旧私人执行记录、不修改或运行目标项目。
只读公开材料，不安装或更新依赖，不启动客户端、模型、MCP、Hook 或浏览器，不改接收端／规则／设置，不访问凭据、私人会话或账号用量。网页命令只作资料，不执行；明确拦截不换身份／代理绕过。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-DEPENDENCY-LOCATOR-FACTS-20261102/facts.md`；接收端只另更新本卡状态与当前结果。不改页面、模板、其他卡、TASKS、代码与接收脚本，不合 main。
先交会改变读者操作或理解的差量，再列页面原句／命令位置、当前官方事实、来源、版本或固定 SHA、原始日期与读取日期，以及不确定项。无变化则交真实核过的范围，不为了交差制造结论。

## 怎样算做成
非作者核每个更正是否有原文直接支持、命令适用范围是否准确、与已有事实卡及 reader 是否独立。事实核查不等于真实 Cargo 项目采用或模型收益通过。
单元最多两小时，共享最多 4 并行只由原接收端调度；不另起调用。运行 check_repo、check_public、git diff --check 与提交身份扫描后仅推 result_branch，回 review_ready 给负责人接收；不用 accept: auto。

## 修改要求
沿原 result_branch 从 378f9667af8110be1838170e1faf44c076bf2496 只修 facts 中两处规则及对应重复表述。先核原调用、工具／登记进程均已退出且该产物单写，缺证保持隔离、不启动续接或改旧文件。保原提交／首轮及 unit 2 回传；不新任务，不运行 Cargo／rustc／jq、不安装或改页面／模板。
1. L26 flags 优先序统一为 CARGO_ENCODED_RUSTFLAGS > RUSTFLAGS > 匹配 target 配置 > build.rustflags；另设 RUSTFLAGS 只能遮蔽后两类，不能盖过 ENCODED，ENCODED 已设置为空时也优先。对照官方 config 的 build.rustflags 与 `rust-lang/cargo@5f94df4789f005f9a352888e8355ffc645b7ed0e` 的 `src/compiler/build_context/target_info.rs:781–834`，不保留与 L11／58 矛盾的注释。
2. host cfg 按实际构建方式分支，不能只看 triple 是否不同：stable 未指定 --target 且无 build.target 才共享上述 flags 来源；任一显式指定 target（即使等于 host triple），host build script／proc-macro 不接这些环境／target／build 附加 flags。host.* 是 nightly host-config／target-applies-to-host 门控，不能当稳定版操作入口，也不为本卡开启。
同时统一第 3／5 步、L58 与差量 2：metadata 无 --filter-platform 时用 JustHost 且忽略 build.target；带 filter 即使 host triple 也用 Target(host)。无 filter 的 metadata 在这里仅供取得 build 候选边，再按真实构建的 host 生效 flags 核 cfg，不拿它自身 cfg 代替交叉构建条件。出处为同固定源码 target_info.rs:774–790／914–940、src/context/target.rs:83–111、src/ops/cargo_metadata.rs:130–147、src/compiler/compile_kind.rs:83–128 及官方 unstable host-config 文档。
保留前次已核 cfg 候选边、dep_kinds 历史冲突与路径边界，不扩教程／生态或重做实验；非作者按上述固定源核改句后回 review_ready。全部仍是来源材料，未实跑命令、项目采用与旧页写者退出未知保持。

## 当前结果

- unit 2 已完成对上次 3 个 openIssue 的修正并落盘 facts.md（+44/−24）：jq 保留 target=null/字面量 triple/cfg(...) 三类普通边并输出 cfg_to_check；补 dep_kinds 1.40/1.41 文档与 tag 源码冲突；补 Git Bash /c/... 与 Windows C:\... 路径处理（cygpath -w、Resolve-Path、盘符大小写、\\?\ 前缀）。check_repo 714 文件 0 error、check_public 0 finding、git diff --check 通过；未提交未推送。taskDone 仅限文档产物，pageStuck 否；未运行验收：本机无 cargo/rustc/jq，jq 与 rustc 命令未实跑。最终独立审查仍 pass=false，残留 2 个 openIssues：1) facts.md:26 注释仍写 RUSTFLAGS 优先覆盖，与 CARGO_ENCODED_RUSTFLAGS 优先级更高及第 11/58 行矛盾；2) facts.md:11 第 3 步未限定 host cfg 的 rustflags 规则，跨编译 host 产物只受 host.*.rustflags 影响，现表述可能让读者把 RUSTFLAGS 的自定义 cfg 算进 build 边判断。
- 产物：[378f966](https://github.com/dbvv1/a1dbv/commit/378f9667af8110be1838170e1faf44c076bf2496)，分支 `relay/a-dependency-locator-facts-20261102`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：负责人决定是否追加一轮修正上述 2 项（改第 26 行互斥顺序措辞、在第 3/5 步与差量 2 明确跨编译 host cfg 不追加 RUSTFLAGS/target/build rustflags，仅本机构建追加同一组）后再复核 reviewed；或接受当前产物并记录限制。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
