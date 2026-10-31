id: A-CONTEXT-PAGE-CONTRACT-READER-20261029
owner: dot-A
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5847ea532dbf7437ca8c4865af031ce0d862a153
result_branch: relay/a-context-page-contract-reader-20261029
kind: reader-test
page: docs/decisions/context-management.md@dot-a/context-concise-reader-20261029

# 新 page 输入合同的真实仓库验收

## 目标与做法
本仓刚以 5561e38e 更新 reader-test 的 page 引用协议；四页读者任务需要据此派发。请完成仓库侧验收：现行写法怎样提交一个合法任务，哪些保证仍须接收端验证。
先确认接收端实际附入本卡 page 固定版本的全文。没有全文则记录入口卡点，不把自行取回页面说成已成功附入；执行读者须此前未读本页、未参与该页写作或旧诊断，使用独立新上下文。
只照所附页面的方法完成本任务；项目必读指令、目标源码和测试是工作材料，不另找上下文管理教程或旧读者答案。
从 docs/collaboration/local-jobs/README.md、scripts/check_repo.py 与 tests/test_check_repo.py 开始，缺信息再扩大到相关实现；记下实际使用的入口与缺口。

## 写域
只在结果分支新增 docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result.md，记录结果、必要复现输入、卡点和短检查点；临时测试输入放本任务独占的仓外目录或内存。
不修改页面、检查器、任务协议、长期规则、接收端及用户电脑设置，不创建或发布 ready 任务，不重跑旧调用。
不访问凭据或私人会话，不操作桌面，不请求其他模型；不为试验压低阈值、填满上下文或制造中断。

## 原任务验收
- 固定实际受检 commit 与 page ref，给出实现位置、实际命令和退出结果；失败、未运行、未知分开。
- 以现行协议给出一份可公开的最小 reader-test 卡示例，保持未入队；实际调用当前检查器相关入口验证它，说明输入和验证范围。
- 核对 page 的默认 ref、固定 ref 及缺失目标的处理边界；生成的测试输入明确标为合成，不冒充接收端故障。
- 按需运行相关仓库测试；区分文档规定、检查器实际检查和本次真实执行证据，不以静态通过宣称接收端已附全文或任务已启动。
- 留下最新约束、已验结果、证据入口、尚缺条件与具体下一步组成的检查点；说明页面让你卡住、做错或需补查的位置。
- 非读者验证者核对实际测试输入与输出，复跑关键检查，并核读者实际收到的固定页面全文；无法观察的接收端行为记未知，不采纳模型自报作通过。

没有自然跨压缩或新会话时，只记按需取回与检查点准备的结果，原生接续效果仍待验。单元最多两小时；接收端公开扫描与适用检查后推指定结果分支、回 review_ready，不用 accept: auto，不合默认分支。

## 当前结果

- 处置（2026-10-31）：保留仓库侧可复跑检查，拒收 u5 为独立新读者证据；原卡暂停，不自动重跑或重派，地图保持原评级。恢复须有自然真实任务、未读旧产物的新上下文与符合当前协议的页面输入，并先核实际共享容量。
- [固定记录与非读者复核](https://github.com/dbvv1/a1dbv/blob/fe4774ba7c800b17ec095c24a964ec1f57d5ed9d/reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u5.md)：附入文本与当时 d0b9651b 文件一致；原 9 项单测、文档／公开扫描及独立边界探针可复跑。接收端如何解析 ref、处理缺页仍未知，未验证原生压缩／续接。
- u5 开工读过旧 result／u4／u5 产物，独立性不合格；`taskDone=true` 只支持所核仓库结果，不能抵消此缺口。分支名会移动，d0b9651b 是当时解析结果；行号曾误用 job.md，检查器概述漏 TASKS 大小限制，最小卡所在目录也未触发行数检查；这些不得原样当作正确说明引用。
- 原页“跳过锚点”的精度反馈仍保留：带 fragment 的本地文件路径仍检查是否存在，不是整条链接跳过；不以结构化 `pageStuck` 为空覆盖这条文字反馈。
