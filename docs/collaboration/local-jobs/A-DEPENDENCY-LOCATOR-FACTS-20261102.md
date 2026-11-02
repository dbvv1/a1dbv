# A-DEPENDENCY-LOCATOR-FACTS-20261102 · 实际依赖定位的 Cargo 官方边界
id: A-DEPENDENCY-LOCATOR-FACTS-20261102
owner: dot-A
status: running
kind: build
page: docs/decisions/skills-and-plugins.md@2bddaaf7b5ed7f9bd151315cab6b67e2a9e97709
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 995376da8ce002ef7c9c2a0683d5877742271a16
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

## 当前结果

- facts.md 已生成并通过仓库检查（check_repo 714 文件 0 error、check_public 0 finding、git diff --check 通过，未提交/未推送；taskDone 仅限文档产物，pageStuck 否，未运行验收：本机无 cargo/rustc，Cargo 命令边界来自官方文档、固定 SHA 源码与官方测试，未实跑）。三路独立审查未全通过，残留 3 个 openIssues：1) 修正 jq 仅保留 target=null 或字面量 triple 的普通边，会静默丢掉真实激活的 cfg(...) 边，与第 39/47 行“逐条核 dep_kinds[].target”的指引矛盾；2) 第 71/100 行写 dep_kinds 自 Cargo 1.41 起，但所引 Cargo Book 页面写 1.40，未说明该官方注释与 1.40/1.41 tag 源码的冲突；3) “无结果”排查与 realpath 说明未覆盖原生 Windows 的 C:\ 与 /c/ 路径格式差异，按文照跑会零结果。
- 产物：[e58228a](https://github.com/dbvv1/a1dbv/commit/e58228a0b80f7d9ccb0b87149172fb4a0e092141)，分支 `relay/a-dependency-locator-facts-20261102`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：负责人决定是否追加一轮修正上述 3 项：jq 保留 cfg 边供人工判定、补 dep_kinds 1.40/1.41 来源冲突说明、补 Windows 路径规范化（cygpath -w / Resolve-Path）后再复核 reviewed。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
