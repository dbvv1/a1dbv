# A-RESUME-CONTRACT-SOURCES-20261028 · 中断恢复先核哪一层
id: A-RESUME-CONTRACT-SOURCES-20261028
owner: dot-A
status: cancelled
kind: explore
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5505b220259534b7fff39477fa9eeeea5a4821a3
result_branch: relay/a-resume-contract-sources-20261028

## 处置（2026-10-30）
取消独立任务，不重领或重发首轮。用户确认 2026-10-29 20:23 UTC 断电重启前本机调用均已终止，接收端没有本卡在途；原先“停止未确认”的阻点已解除。此事实不用于推断重启后其他任务的运行状态。
通用持久状态、上下文接续与中断恢复已在 [MULTIAGENT-LONG 广扫](A-MULTIAGENT-LONG-WIDE-20261029.md)的任务范围内，取消重复安排。以下窄来源调查此前被广扫明确排除，未覆盖内容待写者边界确认后精准并入；本次未修改广扫卡，不声称已纳入或执行。

## 保留的具体来源与未决问题
范围是 [OpenCode 官方仓库](https://github.com/anomalyco/opencode)在 2026-10-01～27 的工具中断／恢复缺陷，沿公开 issue、PR、回归测试和发布记录追到使用者回执，再与 Claude Code／Codex 的相应公开修复对照。
要回答读者应继续原会话、升级已修版本，还是先读回副作用再重试；分清工具执行状态、对话显示状态和实际文件／外部副作用。逐项核发生条件、版本、修复提交、保留的回归、是否发布及用户是否证实恢复；没有回执就保留未知。
不重做 dot #52374／#49883、AOCI 全量回读、Claude 2.1.311 旧规则压缩或 pi-optchat；不涉及模型 effort／Skill 安装清单，其他已取消的宽采集不重启。仅核剩余公开来源，不安装 Agent、不创建会话、不模拟事故，不读私人材料或绕过拒绝。

## 已有产物与历史结果
第 1 单元历史上连续 2 次未返回有效结果，接收端记录 `timeout`，实际使用 Claude Code＋DeepSeek 原生 Workflow（build）。当时 timeout 不能证明退出；现以本节上述用户确认更新终止判断，不把失败当来源负结果。
截至本次 Git 核对，未发现指定 `relay/a-resume-contract-sources-20261028` 分支或公开 sources.md；本机未交材料是否存在仍未知。若接收端已有公开可交材料，保留供后续去重，不为取回材料重跑模型或探查私人会话。
后续拟写 MULTIAGENT-LONG 自己的 sources.md，须先更新其规格；不恢复本 id，也不把本卡记作研究完成。
