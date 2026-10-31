# A-VERIFICATION-PUBLIC-SCAN-READER-20261029 · 真正运行公开扫描器
id: A-VERIFICATION-PUBLIC-SCAN-READER-20261029
owner: dot-A
status: accepted
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5847ea532dbf7437ca8c4865af031ce0d862a153
result_branch: relay/a-verification-public-scan-reader-20261029
page: docs/decisions/verification.md@dot-a/verification-page-candidate-20261029

## 目标
让未参与写作的新读者照页面，判断真实扫描器修复能否接收：正常任务词误报曾使本机结果无法交回；修后应放行正常词，同时仍检出并脱敏合成凭据。只验这个 CLI 行为，不改扫描规则，不把整仓扫描恰好通过当作目标行为通过。

## 按哪个规格
按 write-task-guide 第4步及原生 reader-test。接收端把 page 指定固定版本的全文原样附给独立新读者；若 page 解析／全文附入能力不可用，回具体卡点，不自行换旧文或节选。读者只收任务与此页，可查项目指令、实现、既有测试及页内引用，不读本题旧答案或作者自测回执。独立复核者核实际产物，原生读者／复核能力缺失如实记，不假扮角色。
代码候选固定 `5f8b0b10e9e3fbf173253e2179afcab5cd06b193`，对照其父 `06c5a774f2a45e401e09d9157e9eb9b604b3eedc`；误报文本与修复来自该真实提交。读者自己从项目找到命令，用既有 Python 3.11+／Git 和合成输入，在仓外独占临时目录／检出复核；不安装依赖，不改源码或创建真实凭据。
本卡只排队，由既有接收端按共享最多四任务、最多一 GPU 调度，本任务不需 GPU／浏览器。领取前核同题与同一结果写入面没有活跃调用；旧调用结果未知先核原状态，不打断、清锁或重开。
不读私人会话、账号用量、用户配置或真实凭据，不调用 ListAgents、不向既有会话发任务；不接被拒网站、代理或镜像。不能通过新建模型进程、账号或调度绕开接收端。

## 写入范围
仅本结果分支新增 `docs/collaboration/local-jobs/artifacts/A-VERIFICATION-PUBLIC-SCAN-READER-20261029/result.md`；写实际结果、卡点与未验范围，不改页面、源码、TASKS、其他任务或既有产物。
原始命令／stdout／stderr／样本和私人路径留仓外至接收；公开只保脱敏证据及被测脚本身份，不提交合成密钥字面量。接收端负责适用检查、公开扫描、noreply 提交和结果分支快进发布，不用 accept: auto。

## 怎样算做成
- 读者核实际被测提交／脚本身份；正常输入和应被拦截的合成输入都走真实 CLI，区分对照的原失败与修后行为；保持脱敏、安全边界和正常输入兼容。
- 回报实际命令、目标断言、相关回归、stdout／stderr与退出码，页面／环境／模型卡点分列；Windows 不支持的既有符号链接测试等如实记，不删、skip 或修环境来掩盖失败。
- 复核者依据原命令与结果独立判断做通、卡点及未运行；只证明此 CLI 路线，不冒充 UI 实测或所有检查器可靠。读者产物回来后由 dot-A 接收，不给旧来源任务重跑或重新计进度。
- 一个 60–90 分钟单元，达到原时限就交已有结果和缺口，不再扩题；完成回 review_ready。

## 当前结果

- 接收（2026-10-31）：接收固定候选的正常词误报、带分隔符合成凭据检出／脱敏与同回归旧失败新通过的 CLI 证据，以及三处页面卡点；不等于原 Windows 全套通过或修订页完成新读者验收，不重排旧任务。
- [固定记录与非作者复核](https://github.com/dbvv1/a1dbv/blob/c6f6ffcb7b1d4a2eec987f61b128f0cd12de60cb/reader-tests/A-VERIFICATION-PUBLIC-SCAN-READER-20261029-u1.md)支持上述范围。读者另读了其他任务的 reader-test 格式，超出允许材料，不能称完全合规的干净读者；它不是本题旧答案，真实 CLI 对照另经非读者复跑。
- 原两版各 22 项均为 3 failures／2 errors：三失败来自临时用户目录触发扫描规则，移出后通过；两错误为 Windows 非法文件名与默认 GBK 解码，不是五项都不支持符号链接。完整 offline 入口预检 rc=2、未运行阶段。紧邻字母／数字的弱 sk 形状不再检出，是原候选词边界取舍，安全结论只覆盖实测输入。
- 三项页面缺口已在[当前补丁验收入口](../../decisions/verification.md#已有补丁同一条回归要真正跑到旧新两份实现)落实：有索引的固定检出、候选回归放到旧实现、核夹具是否处于其他 Git 仓。后续脚本修订及 2026-10-31 云端 POSIX 的 31 项回归通过不替代原生 Windows／完整离线入口或修订页本机新读者补验。
