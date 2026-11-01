# A-MIGRATION-EXTRUCT-READER-20261101 · 接收真实 pytest 测试迁移
id: A-MIGRATION-EXTRUCT-READER-20261101
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 949374f4f5ec40deb189a1bc1545ebd039324df7
result_branch: relay/a-migration-extruct-reader-20261101
page: docs/collaboration/local-jobs/artifacts/A-LEGACY-MIGRATION-GUIDE-20261030/candidate.md@949374f4f5ec40deb189a1bc1545ebd039324df7

## 目标与真实任务
你是未参与迁移候选写作或本任务预检的新读者，按附入页面完成 scrapinghub/extruct 的真实测试风格迁移接收：将现有 PR #253 的测试改动适配到当前固定 master，保留新主干的测试、输入与运行语义，交一个可审的局部补丁。不是再次运行本文 Actual、Memoh、SQLite 或 Hermes 已完成任务，也不是给工具造示例。
需求来自公开 issue https://github.com/scrapinghub/extruct/issues/252；现有开放 PR https://github.com/scrapinghub/extruct/pull/253 已提供实现，不重复从零写。真实任务仓库为 https://github.com/scrapinghub/extruct，固定 master 为 d24f5414fd32c874989492ebd04cb1deb6d7d04e；PR 的测试提交为 36aee6951bf5a548186197a761bfdc553ed2abc5（父 c5988b500af5c81d56399573134efd3b31714dd0）。原 PR 捆绑的 #248 打包、依赖、CI 和 Python 支持变更不在本任务范围，不能整条覆盖。
本题接收这项十文件测试风格差量，不要求为消除全部 unittest 而扩大范围；PR 中 TestTool 的 TestCase/setUp 可以保留并明确说明，unittest.mock 也可继续使用。新 master 在旧 PR 后增加的 JSON-LD／OpenGraph 测试与行为必须保留，不能覆盖成旧文件或只把断言放宽到绿。

## 按什么做
按 write-task-guide 的新读者要求，接收端把 page 固定版本全文原样附入实际模型任务正文；只有路径、链接或摘要时先报告输入阻塞。只照这页安排迁移步骤，可读任务自身的源码、README、原生配置、issue／PR 和必要依赖文档；记录页面没交代而必须补读的步骤，不替作者修改页面。
先核当前任务、同题结果和写者；仅使用新建的独立工作目录，不占用其他任务环境或修改现有 clone。共享容量由原接收器判定，不另起调度；已取消四广扫、MODEL 旧环境和禁安装 Skill 任务均不接管。
已核本接收端 PATH 的 python3.12 为 3.12.15、Git 为 2.56.0；优先用该受支持解释器，不依赖未测的 launcher。可以在本任务独立 Python 环境按项目现有声明准备普通公开依赖，沿原生测试／静态检查入口工作，记录实际 Python 与解析版本；不装 Skill／插件／全局工具，不改用户配置、凭据、TLS、系统权限或接收端，不重试 MODEL 的被拒安装动作。任何安装或执行明确受拒就停对应动作，保全现状，不换通道。
只用仓库公开样本与合成值，隔离 HOME／缓存和测试凭据，不执行 README 的真实网站抓取示例、模型或账号操作；测试若意外访问真实网站应停止并说明，依赖准备所需公开包仓网络与测试业务外联分开记录。保留样本原字节，不用全局换行设置或批量重写 fixtures 掩盖 Windows 差异。

## 写入范围
实际源码操作只在任务新建的 extruct 副本里，对上述测试提交涉及的十个 tests/test_*.py 文件做必要适配；不改生产源码、样本、packaging、依赖声明、CI 或支持的 Python 范围。局部测试迁移不足以保持原行为时报告具体阻塞，不自行扩大产品范围。
本仓只写 docs/collaboration/local-jobs/artifacts/A-MIGRATION-EXTRUCT-READER-20261101/ 下的 result.md、migration.patch、test-manifest.json、verification.json、EXTRUCT-LICENSE.txt（原 LICENSE 全文）；结果要能从固定 master 重建候选，保留原 PR 来源和许可。接收端另按 reader-test 原流程记卡点和回写本卡状态。
原始命令、输出和可恢复 Git 版本在任务私有目录保全；公开产物只保留脱敏命令／状态、原始记录 hash，不含本机绝对路径、身份邮箱、凭据、私人历史或抓取来的用户数据。
不改答案页、候选页、模板、地图、TASKS、inbox 或其他任务。仅推指定结果分支并回 review_ready；不用 accept:auto，不合 main、不向 extruct 提交／评论或部署。

## 怎样算做成
先给这项迁移的接收结论和可用补丁，再列实际证据。基线与候选使用同一个受项目支持的 Python、同一解析依赖集合；从当前 master 建立测试及子场景映射，参数化可改变 node ID 和数量，不以总数相等替代语义保留。
通过任务自身的原生测试入口比较完整测试的失败、skip、xfail、收集错误与新增／消失项；保留日志、异常类型／对象身份、循环输入和 fixture 重置语义，新 master 用例和样本不减少。实际做不通要保留失败及原因，不删用例、不造红例，不用旧 PR 历史 CI 或本仓 check_repo 代替产品验收。
运行适用原生静态检查并核格式化后的最终 diff；全仓 formatter 在独立检查副本运行，或发现十文件以外的变化就停止并报告，不为全绿保留范围外格式化；纯 tests 变更不因工具建议而顺带升级打包。如基线已有平台问题，分别记录基线与候选同输入结果，不能把未知根因说成已修好。未安装的解释器、未运行 OS 或全矩阵写未验。
读者只在结果中简记页面全文是否进入、实际使用步骤、卡点／补读／错误及原因属于页面还是环境或模型，不改页面、不编卡点。按 reader-test 原流程由非读者核实际任务结果；有遗漏就保留未通过，不自动重派盲读。
跑本仓适用 check_repo、check_public、空白和身份检查，交固定提交供负责人当轮接收；任务单次最多两小时，受阻保留具体动作、目标、原因、已做部分和恢复条件。

## 当前结果
任务与环境前提已独审，待原接收器按周期领取。未执行迁移；只接收本卡新任务，不重用旧卡，历史脱链后代未知继续单列。
