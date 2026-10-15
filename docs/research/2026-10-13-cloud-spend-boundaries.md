主线：四
改变的建议：02/10/13/18：预算控制按产品范围；18 另按组织、入口与功能核数据及策略覆盖，不凭套餐或赠额放行
新证据：AWS/GCP 官方预算边界；2026-10-15 补核 Code／API 数据契约、地区控制、策略交付和订阅赠额；无真实账户验证

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


## 补充：团队准入的数据保留边界

> 核实：2026-10-15（UTC+8；UTC 2026-10-14）。本节为新增一手公开文档证据；前文 AWS/GCP 未重新核查。滚动文档没有固定版本号或明确生效日期，不把访问日当政策生效日；Covered Models 页面标注 2026-09-01。未登录账户、读取合同或上传内部数据。

**选择变化**：18 原来仅提醒 Fable 5.1 保留 30 天，仍可能让团队把“不训练”“已买 Enterprise”“已开 ZDR”当整个工具链的准入证明。改为按实际身份和调用范围批准；零保留是硬条件时，先选已覆盖的工作方式，不默认采购升级或接受更长保留。**[研究：采用判断]**

### 已读来源与反证

| 官方来源／位置 | 新证据及采用影响 |
|---|---|
| [Data usage](https://code.claude.com/docs/en/data-usage)，Data training policy／Data retention | 消费者 Free／Pro／Max 的训练取决于设置；Team／Enterprise／API 商业路径默认不训练但允许客户主动提供训练数据。普通商业保留为 30 天；本地会话默认也会缓存。故公司付费或关闭训练不等于零保留。**[一手]** |
| [Privacy Center ZDR](https://privacy.claude.com/en/articles/8956058-i-have-a-zero-data-retention-agreement-with-anthropic-what-products-does-it-apply-to)，适用产品与组织 | 仅覆盖合资格 API、使用商业组织 key 的适用产品及 Enterprise Code；按组织审查启用，仍保留安全分类结果。可在 Claude Platform 的 Privacy Controls 查看保留配置，但本轮没有检查任何组织。**[一手]** |
| [Code ZDR](https://code.claude.com/docs/en/zero-data-retention)，Scope／Route traffic／Disabled features | Enterprise 标准套餐不附带 ZDR；个人登录和别的组织 key 不继承。`forceLoginMethod`／`forceLoginOrgUUID` 可约束 claude.ai 登录组织，Console 登录另按链接说明；不据这两个键宣称封住一切入口。云会话、Remote Control、反馈等在后端禁用；Chat、Cowork、第三方处理与管理元数据不在推理 ZDR 内。**[一手]** |
| [API retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)，Feature eligibility／FAQ | API key 与 Enterprise Code 为两个独立安排；API 的不合资格功能不会因 ZDR 自动拦截。Batch 保留 29 天、Files 到删除或过期、code execution 容器最多 30 天；Managed Agents 也非 ZDR。不要把“API 接受”或“在自己机器执行”当全链零保留证明。**[一手；研究：边界判断]** |
| [Covered Models](https://support.claude.com/en/articles/15425695-covered-models)，Current models／Data retention／EFS | 当前列 Fable 5／5.1、Mythos 5／5.1；5.1 指定日期 2026-08-31。默认至少保留 30 天，适用于所有提供入口。Fable 5／5.1 的合资格内部业务用途存在限时 ZDR 过渡选择，可能修改或撤回；不是申请即可获得。EFS 的客户云存储选项也不等于不存储。**[一手]** |

以上来源来自同一厂商的不同契约页面，交叉核对的是入口与规则是否吻合，不是独立审计。API 文档保留“经明确授权”的模型例外，Covered Models 页说明了限时过渡安排，不能只截前半段得出“所有 ZDR 组织都永远不能用 Fable”，也不能用例外否定默认保留要求。**[研究：反证处理]**

**失效条件与下次复核**：实际准入、切换登录组织／服务商／模型／端点、启用云端或第三方功能、收到例外授权变更时立即重读对应来源；最晚建议 2026-11-15 再查，未建立自动监控。第三方平台另查其合同与留存实现，不能沿用 Anthropic 直连 Enterprise 的功能禁用清单。**[研究：维护判断]**

**该增量未覆盖**：当时未核 OpenAI 数据驻留、地区推理及套餐附带额度，后续补核见下节；完整价格表仍不在范围内，不以该增量宣布整页升级；未接受任何条款、改变保留设置、创建凭据或运行客户端。ZDR 的法律／滥用例外仍适用，不能作为完整法律意见。**[研究：范围]**

**本增量验证**：独立评审重新打开上述五个官方来源，限定范围无事实或决策问题；`python3 scripts/check_offline.py` 14 阶段全部通过（非空、无 skip），`git diff --check` 通过。未验证真实组织配置或服务端行为。**[经验：文档核查与本地离线验证]**


## 补充：地区、策略交付与订阅赠额

> 核实：2026-10-15（UTC+8；UTC 2026-10-14）。只读官方公开文档；本节没有重做上文 ZDR、AWS／GCP 预算或接管案例，也没有访问企业账户、接受协议或运行客户端。滚动文档访问日不等于生效日。

**改变的选择**：18 原来的“指定推理地区”“组织级强制”和套餐赠额数字各有事实基础，但不足以批准数据流、判断 CI 已被组织策略约束，或抵扣特定运行入口的费用。本轮只补会改变这三个选择的边界，不新增价格总表。**[研究：采用判断]**

- **地区**：[Anthropic Data residency](https://platform.claude.com/docs/en/manage-claude/data-residency) 的 Inference geo／Workspace geo／Pricing 分别说明：推理参数仅 `us`／`global`，静态存储及端点处理由 workspace geo 控制（当前仅 US，创建后不能改）；US-only 推理为 1.1 倍 token 费率。该参数适用直连 API 与 Claude Platform on AWS，不适用 Bedrock、Google Cloud 或 Foundry 的地区选择。[OpenAI Data controls](https://developers.openai.com/api/docs/guides/your-data) 的 Data residency／Additional requirements／Endpoint support 确认 GPT-6.1 Sol 支持 US／EU；非 US 需要获批滥用监控控制并签 Modified Retention amendment。存储可在创建项目时选择；Global 项目也可用地区端点选择单次推理，但不免除资格或端点／模型限制。**反证**：不能将 API 支持误改为“Sol 不支持 EU”，也不能由区域存储推导所有处理均在当地；第三方 MCP 另按其政策。**[一手；研究：边界判断]**
- **策略交付**：[Claude server-managed settings](https://code.claude.com/docs/en/server-managed-settings) 的 Platform availability／Security considerations 确认 Team／Enterprise 支持集中分发，但凭据所属组织决定接收的策略。Console 与 claude.ai 为不同组织，前者 key 不继承后者策略；第三方路由可能跳过直连分发，应改核网关或 endpoint-managed 方式。官方明确 server-managed 是客户端控制，未受管设备可绕过；受管端点的 OS 保护更强。**反证**：这不等于托管设置无效，也不否认可用的网关交付；建议只是先核覆盖，不能把“已下发”当整个执行链安全隔离。**[一手；研究：采用判断]**
- **赠额**：[Haiku 5.5 公告](https://www.anthropic.com/claude-haiku-5-5)与其链接的[资格说明](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-and-team-plans)交叉确认既有金额；Team 是 Standard 每席 20 美元、Premium 每席 100 美元合并后封顶 500，并非每团队固定 500。合资格订阅满七天，由相应角色关联一个 Console 组织领取；未用额度到周期末过期。FAQ 区分自行以关联组织 API key 运行的 `claude -p`／SDK，与 GitHub Action、IDE／桌面发起的 Code 运行；后者即使 `-p` 也不覆盖。交互 Code、额外订阅用量和第三方云同样不覆盖；订阅登录的 SDK 用量仍消耗订阅限制。**反证**：赠额确实可用于合资格自动化，不能写成所有 CLI 均不覆盖；耗尽时有余额／自动充值会继续消耗，销售发票账户照常计费，不能当预算封顶。**[一手；研究：采用判断]**

**失效与复核**：换组织、认证方式、地区、供应商、运行入口或计费计划时重新核对对应来源；最晚建议 2026-11-15 再查。这里只提供采用依据，不保证实际部署或合同合规；无企业实测不构成内容 L3 的额外硬条件。**[研究：范围与维护判断]**

**本增量验证**：另一独立评审重新读取五个官方来源并复核计费入口及成熟度范围；`python3 scripts/check_offline.py` 14 阶段通过，`git diff --check` 通过。未运行模型、客户端或企业配置测试。
