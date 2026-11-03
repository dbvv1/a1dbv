# A-DEPENDENCY-LOCATOR-FACTS-20261102 · 实际依赖定位的 Cargo 官方边界
id: A-DEPENDENCY-LOCATOR-FACTS-20261102
owner: dot-A
status: blocked
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

- 原调用、工具或已登记进程尚未确认结束，保留产物与原调用身份，由维护者核清并解除本地隔离后接续；不自动重派。
