# a1dbv Audit Workspace

本目录是长期审计入口。所有审计聊天先读取最新 main、本 README、AUDIT-PROTOCOL.md、对应 brief 和 WAVE-REGISTER.md，避免反复粘贴背景。

## 权责
- 用户：目标、授权红线和重大方向。
- Claude 核心：方向、原则、规则和 Dot-A/B 指导的唯一权威。
- Dot-A/B：各自领域任务的日常决策、接受/拒绝意见及执行。
- Codex：明确工程任务实施和工程审计。
- 五个 GPT 专业聊天：独立领域内容审计，不形成第二套方向规则。

## 工作流
最新 main → protocol + brief → 只读审计 → reports 独立报告 → 现有 docs/collaboration/inbox.md → 责任人决策 → 接受的意见进入现有 TASKS/local-jobs。

不新建第二个收件箱或平行任务系统。报告是证据和建议，不等于已接受的执行任务。

## 目录
- AUDIT-PROTOCOL.md：通用审计协议。
- WAVE-REGISTER.md：波次、负责人、状态、报告链接。
- briefs/：固定审计范围。
- reports/：不可覆盖的历史报告。
- synthesis/：跨报告整合和任务筛选。

## 长期规则
- 按里程碑、重大变化、质量差距或用户要求触发；不要求五个会话常驻。
- 每轮报告使用独立文件，保留历史，不覆盖旧报告。
- 新一轮先检查上一轮未关闭事项，验证改进是否生效。
- 只在有新证据或状态变化时重复审计。
- 有写权限时独立分支提交报告，不直接写 main；无写权限时交回完整 Markdown 和建议路径。
