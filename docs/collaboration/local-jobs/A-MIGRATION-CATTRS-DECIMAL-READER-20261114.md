# A-MIGRATION-CATTRS-DECIMAL-READER-20261114 · Decimal 消费者接收旧 PR
id: A-MIGRATION-CATTRS-DECIMAL-READER-20261114
owner: dot-A
status: ready
kind: reader-test
target_repo: dbvv1/a1dbv
base_ref: 6764ab019c94d63fe02af06596a5c0e1f8d9446f
result_branch: relay/a-migration-cattrs-decimal-reader-20261114
page: docs/decisions/migrations.md@6764ab019c94d63fe02af06596a5c0e1f8d9446f

## 目标与读者
让没读过迁移页的新读者，用真实 Decimal 消费者判断 cattrs #822 能否替换现有依赖；这是运行接收，不是旧 cattrs 投稿准入卡重跑。
接收端把[完整输入](artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/input.txt)原样放进本次读者任务正文；其中包含整页，不以链接代读。若读者参与过该页或本任务、实际输入缺全文，则 blocked，换新上下文前不运行。
读者只照页面完成任务并记卡点，不改页面；不要给作者答案或指定结论。不读本仓其他 cattrs 实验/历史结果和旧读者答案。

## 真实任务与固定输入
需求：[cattrs #761](https://github.com/python-attrs/cattrs/issues/761) 的 attrs Order(amount: Decimal)，原 JSON/PyYAML 转换失败；要保留 Decimal 精度，不经过 float。
基线 python-attrs/cattrs@e9239b7082206f18e3cec873b11451aff35beb9c；候选 [PR #822](https://github.com/python-attrs/cattrs/pull/822) head 2e883761ca61b076c3de45a5d976952226347c2c。执行先重新核引用，固定源码；有变化只记差量，不擅换题。
这是另一个真实消费者，与负责人在 #836/#837 做 BSON 容器消费者不同。只在隔离环境接收现有候选，不新写上游修复、投稿或评论；遵守项目 AI policy。
允许下载公开固定源码、按项目方式在任务隔离环境装必需公开依赖与构建 wheel，不碰全局设置、凭据、公司代码、真实交易数据或生产。Python 3.12 原生可用则用；实际版本与缺项如实记录。
逐项：
1. 依据页内路线核实际源码、环境、候选祖先和主干差量，决定怎样接现有 PR；不把老 head 替换 main 当成保住主干。
2. 原 issue 的同一 Order 消费者前后对照 JSON、PyYAML；正常值 19.99、0.1 与至少30有效数字值，核 dumps 中确为字符串、loads 返回 Decimal 且值/精度保留。用合成输入。
3. 覆盖无效 Decimal 字符串、已有非 Decimal 字段/普通对象行为；数字输入与字符串输入分开报告，不擅自把 float 的已有精度损失归因于候选。
4. 按实际交付形式从隔离环境安装候选 wheel，再跑同一消费者和相关原生检查；保留基线失败，不删除断言。只证明实测环境/路径，不称所有后端或矩阵通过。

## 产物与验收
只新增 artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/ 下 consumer/test、结果 JSON、可复跑命令及 result.md；命令和日志去掉本机绝对路径/私人信息。
result.md 说明实读页面版本、独立性、精确源码/解释器/依赖、基线/候选/整合与 wheel 实际结果、页内卡点和页外帮助、未验项。
接收端可按流程新增 reader-tests/A-MIGRATION-CATTRS-DECIMAL-READER-20261114-u1.md 并回写本卡；只推 result_branch，回 review_ready；不得改页面、TASKS、其他卡或合 main，不用自动接收。
非读者接收者按消费者代码、输入、真实输出、wheel 来源与检查范围复核，不采信 taskDone 标签。做不通记录准确断点，页面问题与环境/能力问题分开。

## 恢复
不占GPU；共享最多4任务。运行前核既有实际活动，不以卡标签当空槽证明，不触碰 Hermes 完整 Windows 隔离卡。
普通单元最多2小时；未知调用/进程按原合同保全隔离，不重新派发，不用 cancelled 当退出证据。

## 当前结果
待领取；已附完整页，尚无实际执行或读者结果。
