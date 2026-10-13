# 云预算：真实封顶承诺与适用边界

> 核实时间：2026-10-13（UTC+8）。直接阅读 AWS、Google Cloud 官方文档；证据等级为一手文档，采用判断另标研究。未读取或改动云账户，没有付费或停用实验。

## 结论与采用判断

**✅ 采用：按具体产品配置预算控制，并先确认停用与恢复后果。** 原文“AWS、GCP 已提供硬性预算”有事实基础，但省略账户类型、覆盖范围和超额规则后容易误导。不能反向改成“两家都只有告警”：AWS 新体验确有项目税前上限承诺，GCP 原生 spend cap 确会阻止覆盖范围内的新增用量。**[研究：基于下列官方文档]**

生产环境不能只以“预算已设置”判定风险受控；需要核对自己使用的究竟是告警、预算自动动作还是原生限额，并为服务暂停准备恢复安排。**[研究：采用建议]**

## AWS：项目 spend limit 不等于普通预算告警

- [Create a spend limit in AWS Settings](https://docs.aws.amazon.com/accounts/latest/reference/create-spend-limit.html) 的 “What is a spend limit?”、“Set your spend limit” 明确：新体验仍向部分客户开放；Paid Plan 项目可设月度税前费用上限，不含 credits 的抵扣。达到上限后暂停项目资源，官方明确承诺费用保持在该上限内。不能把普通 Budgets 的通知延迟套到这个承诺上。**[一手：AWS]**
- 同页 “What happens if you reach your limit” 说明：暂停时保留数据；提高限额后可恢复项目，部分资源可能需手动重启；暂停后 90 天不处理会永久删除项目数据。官方主要面向实验、学习、沙箱，生产使用须能接受暂停。**[一手：AWS]**
- [Activate advanced AWS features](https://docs.aws.amazon.com/accounts/latest/reference/activate-advanced-features.html) 的 “What happens when you activate advanced features” 明确：启用高级功能会移除已有 spend limits、重新激活暂停项目，并且不能再创建这类上限。因此不能推广成所有 AWS 账户通用的能力。**[一手：AWS；研究：范围判断]**
- [Managing your costs with AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) 说明普通预算信息每日最多更新三次，使用到入账、通知之间存在延迟，通知前后均可能超过阈值。[Configuring budget actions](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html) 支持应用 IAM/SCP 或针对指定 EC2/RDS 实例执行动作，自动或经人工批准触发；这些动作不能作为覆盖所有资源的即时账单封顶保证。**[一手：AWS；研究：范围判断]**

## GCP：原生 spend cap 与关闭项目计费是两种机制

[Manage spend cap budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps) 的适用服务、限制和 FAQ 明确：

- 月度 spend cap 限单个项目内单个合资格服务；核对时列出 Gemini API、Agent Platform（原 Vertex AI）、Cloud Run、Cloud Run functions。不能扩展成全组织、多项目或多服务预算上限。**[一手：Google Cloud]**
- 执行后阻止该服务新增用量，执行中请求仍完成；上报与执行并非瞬时，延迟超额照常计费，持续资源的固定费用也仍可能产生。**[一手：Google Cloud]**
- 原生 spend cap 不删除资源或数据；未纳入范围的服务和项目不受此控制影响。**[一手：Google Cloud]**

另一个官方方案 [Disable billing usage with notifications](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications) 的开头 Warning 与 Limitations 说明：预算通知触发关闭项目计费会停止项目服务（包括 Free Tier），资源可能不可恢复删除，重新启用计费也不保证恢复；通知延迟意味着该方案同样不保证不超预算。不能把这个方案的删除风险写成原生 spend cap 的行为。**[一手：Google Cloud]**

## 修订范围与剩余问题

02/10/13/18 同步去掉普遍封顶暗示，保留已有能力和社区对默认硬上限的倡议；会话预算、API 厂商额度与整个价格表不在本轮复核范围内。产品可用范围以后可能扩大，接入具体服务时应重读上述官方页面。**[研究：范围与后续]**

## 仓库验证

`python3 scripts/check_offline.py` 的 14 个阶段全部通过（测试套件非空、无 skip）；`git diff --check` 通过。文档核对和离线检查不等于真实账户配置、停机恢复、模型效果或 hosted CI 验证。
