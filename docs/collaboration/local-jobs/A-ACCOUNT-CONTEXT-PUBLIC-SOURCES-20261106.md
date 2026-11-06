# A-ACCOUNT-CONTEXT-PUBLIC-SOURCES-20261106 · 核公开账号上下文报告
id: A-ACCOUNT-CONTEXT-PUBLIC-SOURCES-20261106
owner: dot-A
status: blocked
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bc45e8d4a3eac99e38508a9a2327068c562bd38e
result_branch: relay/a-account-context-public-sources-20261106

## 目标与输入
只靠公开官方材料核 Claude Code #81138 的版本、实现证据与显示设置含义，判断是否给现有公开提交／录屏建议补充一条有依据的限制。不能靠读取本机账号或问模型系统提示来核验，不预设报告已被独立复现。
原线索在固定 `536b86d44f5649af78bc3cc37b65e799fc330112` 的 `docs/collaboration/local-jobs/artifacts/A-M6-WEEKLY-CALIBRATION-20261103/calibration.md` §本周未记录线索。其复制账号配置、询问模型字段的建议不属于本卡方法，也不得执行。
公开入口：[原 issue #81138](https://github.com/anthropics/claude-code/issues/81138)、[官方设置入口](https://code.claude.com/docs/en/settings)、[官方数据使用说明](https://code.claude.com/docs/en/data-usage)、[原讨论](https://hn.algolia.com/api/v1/items/50286306)。准备时核 issue 仍 open，正文指 v2.1.220；这只是用户报告，不证明当前版本。
对照 base_ref 的 docs/10-security.md 与 AGENTS 公开仓库身份要求；保留既有提交身份与扫描原则，不改账户、安全设置或长期规则。

## 规格与边界
读 AGENTS、CLAUDE、operations §2.2、local-jobs README；先同步 main 与负责人分支，核同题现有结果与写域。本轮长任务冷读优先；原接收端按共享最多 4 并发、最多 1 GPU 调度，本卡不用 GPU，不另开调用抢槽。
只读原 issue、相关官方回复与文档；确有官方公开发布包或公开源码时，可取其公开字节作静态检查，不安装、不导入、不执行。记录包版本、官方来源和内容哈希；公开材料不可取得就交确切缺口。
把三件事分开：界面是否显示、公开实现是否构造上下文字段、模型实际输出或提交是否发生。后两者不能由第一件推得；原作者的复现、后续维护者确认和本卡静态所见分列。
对 v2.1.220 历史主张逐项核源，若取得当前公开版本再独立比较；同名变量／文本存在不足证明调用可达。没有完整调用链或公开实现时保持未知，不从 issue open／closed 推定当前修复与否。
文档若只承诺界面隐藏，就准确写该范围；不把它扩大为上下文清除或全部输出脱敏。查到官方新增选项时只陈述文档化用途与版本，不试改用户配置或猜环境变量绕过法。
判断是否会改变读者动作：现有公开提交身份与内容检查已覆盖的就保留原法；有额外录屏／分享边界才给短候选说明。不得建议修改认证文件、设置传输变量、截获请求或依赖模型自述来“验隐私”。
禁止读取用户电脑或云环境中的账号配置、凭据、私人会话、系统提示、真实邮件／身份、宿主会话元数据及无关状态；不登录、不发模型请求、不复制真实配置到所谓脱敏副本、不对外发布任何用户数据。
不运行客户端、Hook、源码片段或第三方绕过方案，不安装／更新软件、变更接收器或权限。公开引用中出现个人信息时只保留技术主张所需的字段名与中性占位，不复制账号值。
只用已允许的公开读取入口；HN 用 Algolia。明确拒绝只停该来源，不换身份、代理或被拒入口补取。

## 唯一写入范围
模型只新增 `docs/collaboration/local-jobs/artifacts/A-ACCOUNT-CONTEXT-PUBLIC-SOURCES-20261106/findings.md`；接收端只另更新本卡状态及当前结果。
先写结论和实际能核到的范围，再给版本／来源／字段链路与未核缺口；有增量才附最小候选段，没有独立证据则说明为什么不转为确定建议。
不改 docs 正文、模板、README 地图、TASKS、inbox、旧卡、原稿、接收器或配置，不发上游评论／PR。不得把静态来源核对升级为产品复现、隐私保证或地图进展。

## 验收与交回
非作者逐项回原公开来源，核历史与当前、作者报告与本卡观察、界面与模型上下文的区别；确认未执行原稿的本机／账号核验步骤。
产物必须回答“现有读者下一步需要改什么，或为什么不改”，不把缺证写成未发生。记录读取 UTC 与固定版本；官方未公开实现不能填补为肯定结论。
按文档范围运行 `python3 scripts/check_repo.py`、`python3 scripts/check_public.py` 与 `git diff --check`，另检公开提交身份；既有 build Workflow 做独立审查，最多两小时。
模型不提交／推送；接收端仅推 result_branch，回 review_ready；关键来源不足则 blocked 并保全可核部分。不用 accept: auto，不合 main，由 dot-A 当轮判断采用、返工或放弃。

## 当前结果

- 原调用、工具或已登记进程尚未确认结束，保留产物与原调用身份，由维护者核清并解除本地隔离后接续；不自动重派。
