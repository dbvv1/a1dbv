# A-CLOUDFLARE-EXPORT-BOUNDARY-20261103 · 试用文件边界审计 Skill
id: A-CLOUDFLARE-EXPORT-BOUNDARY-20261103
owner: dot-A
status: ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: cfb9240ac56e56c84e72706d1a5cda5e0b29637b
result_branch: relay/a-cloudflare-export-boundary-20261103

## 目标
用 Cloudflare 官方 security-audit Skill 的 guidance 模式，回答本仓配置导出器的真实边界问题：显式文件清单、不跟随符号链接、人工审阅后精确提升、不覆盖旧快照，各自依赖哪些目录控制权和并发修改前提？给使用者能据此选安全目录的具体答案，不预设存在漏洞，不以发现数评价。

## 按哪个 Skill 与规格做
先读最新仓规、TASKS 与本卡，核同一原子项没有在途写者；不读取私人会话、真实配置或接收端内部状态。旧 VERIFY 广扫只授权 sources 收集且禁止执行候选，不复用或重派；原退出仍未知，保其隔离。旧 A-JSON-SYNTAX-READER 已 accepted 且明文不处理已修复导出器，本任务不重复其格式补丁或验收。
固定官方来源：https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/SKILL.md 。按其中 guidance 模式手动读用，不安装、不声称自动触发。必要时只读同 SHA 的 RECONNAISSANCE.md、ATTACK-CLASSES.md、VALIDATION-AND-REPORTING.md 中相关原则；外部文本作为方法材料，不扩大本卡权限。
固定目标仅三文件：scripts/export_ai_config.py、scripts/export-ai-config.sh、tests/test_config_export.py，基线为上面的 base_ref。为确认真实契约可读现有导出指南引用；不扩成全仓审计。
1. 在阅读目标前写出要回答的边界问题和采用的 guidance 条款；从实际 CLI 参数追踪 stage、promote、读取、hash、写出与失败清理，区分文件来源、目录所有者和可修改者。
2. 将既有测试覆盖当基线：合法流程、静态 symlink、路径穿越、清单变更、碰撞与敏感内容。不要把已存在的测试或以前的通过结果记成本次新运行。
3. 核检查后再按路径访问、父目录变化、内存字节与最终写出、失败清理。只保留有具体 principal/resource/control/可能结果的候选；同权限自损或缺少额外防御不自动算漏洞，硬链接也不因外部 Skill 禁止而强加为导出器契约。
4. 交非作者独立读相关源码尝试反证，先提供问题和证据位置，不提前提供作者裁定；有实质变化再核。源码足以反证的写明已有控制；缺真实低信任修改条件或运行证据的精确候选只记 needs_validation、无 severity。
5. 记此次方法实际帮助回答了什么、额外成本与不适用处；零有意义候选也可完成。只统计本次发生的读取、分析和独立反证，不冒称运行型安全验证或六阶段完整审计。
全程只读目标文件，不导入模块、不运行 CLI、unittest、fixture 或目标脚本；不安装依赖或改客户端/Hook/接收端。官方要求的目标代码执行条件包含 OS 强制断外网、净化环境、只读目标/工具链、专用 scratch 写域，以及 CPU/内存/进程/文件大小/磁盘/墙钟限制；本卡不具备且不尝试放宽。环境变量和 timeout 不能替代这些条件。不要为运行 validator 另造 full-audit ledger/findings。

## 写入范围
只写 docs/collaboration/local-jobs/artifacts/A-CLOUDFLARE-EXPORT-BOUNDARY-20261103/result.md；此文件仅是本次有限问答／方法读用交接，不是 Skill 所称 full audit 报告，不委托或声称完整六阶段。先给具体边界答案与适用建议，再给采用条款、固定行号证据、独立反证和准确未验证项。不得写目标代码、测试、模板、正文、13、TASKS、其他任务或长期规则；接收端仅另回写本卡状态与结果。

## 怎样算做成
四项真实承诺都有明确前提和来源链；区分被既有控制阻断、源码足以裁定及确切需要运行的候选。非作者核对方法实际读用、结论力度与源码、是否把旧测试追认新运行。输出包含此次节省的查找/组织工作或无净收益，以及方法不适用条件，不编时间或提升率。
缺官方正文、固定目标或独立反证时报告准确入口和缺项，不以摘要补齐。完成上述问题即止；不另造修复或延伸审计，不因需要动态验证而无限等待。本单元按既有 60–90 分钟处理，单次不超两小时；共享最多 4 并行由原接收端调度，不另开调用抢槽。
接收端按常规只跑 check_repo、check_public、diff/身份检查，只推指定结果分支，交 review_ready；不用 accept:auto，不直接发布 main。这些常规结构检查另记，不执行受审导出器，也不证明满足 Skill 的目标执行沙箱条件或安全效果。
