# A-SKILLS-PLUGINS-READER-20261103 · 按能力缺口完成配置小修
id: A-SKILLS-PLUGINS-READER-20261103
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 90de4948d79a4fca8c7238dd2487b599f458c903
result_branch: relay/a-skills-plugins-reader-20261103
page: docs/decisions/skills-and-plugins.md@main

## 目标
读者的问题是：“修一个依赖库相关的 CLI 错误时，我需要装 Skill／插件，还是已有资料与工具就够？”
由此前未读过 a1dbv 的新读者，只照附入页面选择必要能力，实际处理 [jrnl #2011](https://github.com/jrnl-org/jrnl/issues/2011)：timeformat 的 %d 等字符串覆盖值不再因 YAML 解析崩溃，同时保留已有布尔、数值、结构化值及嵌套键行为。
上游已有 [候选 #2110](https://github.com/jrnl-org/jrnl/pull/2110)；先核当前状态，可接回已有候选验证，不另造投稿，不重复旧模型页或 DayOne 任务。

## 按什么做
按 kind: reader-test 原生 Workflow；接收端附入 page 在 main 实际解析版的全文，记录解析提交与内容指纹，正文缺失记输入卡点。
该页是唯一方法指南；可读原 issue、目标仓指令／贡献规范、源码与测试、所选项目配方和页面直接引用原始资料，不读 a1dbv 其他教程或旧实测结果。
让读者自行判断缺哪种能力、从哪里取得，以及是否需要扩展；不预选 Skill，不以安装数量判通过。选择现有工具也可以，但须说明依据并实际用于任务。
沿用已配置工具、已有依赖和可读项目资料；本机不安装或更新软件／依赖／插件，不改账号、全局配置、权限、接收端或收费入口。必要能力缺失记环境卡点，不换通道绕过。
若使用配方，分别记录发现、正文取得、在真实改动中的采用；手动读取按手动读取记，不冒充客户端自动加载。只用合成配置和临时 journal，不接触真实用户数据。

## 写入范围
只在本任务 worktree 修改 jrnl/config.py、jrnl/override.py、相关 tests/，以及 reader-tests/A-SKILLS-PLUGINS-READER-20261103-u1.md。
不改依赖声明／锁文件、项目全局规则、其他功能、a1dbv 页面／地图／TASKS、其他任务和历史结果；不复用别的读者工作树。
模型不提交／推送；接收端按原流程扫描并只推 result_branch，回 review_ready 或 blocked，交 dot-A 接收；不用 accept: auto，不合默认分支，不对外投稿或评论。

## 怎样算做成
从真实 CLI 用同样输入复现并验证字符串覆盖，另核原有非字符串覆盖行为；留下原行为失败、候选通过的回归，确认临时 journal 和无关配置按原契约保留。
跑项目相关测试与检查，记录准确输出和未运行原因；不能用 AST、依赖桩或读源码替代缺失的真实 CLI。非读者核实际 diff、运行结果与遗漏。
结果分别写开发任务做到哪步、页面怎样支持能力选择、所选资料／能力是否真正用上，以及具体卡点和页外帮助；页面缺口、环境限制、读者误解分开，无卡点写无。
本卡不要求试装整包，也不声称产品间优劣；真实安装／自动加载未走到就保留待验。首轮结果不覆盖、不自动再派新读者。
通常一个 60–90 分钟单元，最多两小时；受阻保全成果和恢复条件，由 dot-A 后续接收。
