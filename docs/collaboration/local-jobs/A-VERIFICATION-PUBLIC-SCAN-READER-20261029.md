# A-VERIFICATION-PUBLIC-SCAN-READER-20261029 · 真正运行公开扫描器
id: A-VERIFICATION-PUBLIC-SCAN-READER-20261029
owner: dot-A
status: ready
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
已准备排队，尚无领取或执行证据；页面分支核对为 `2c55a5a54aec7f1410e2e0368468eb26250efe39`。接收端领取时记录实际页面提交；若与上列核对值不同，先回输入卡点、不静默换版。按共享最多四任务、最多一 GPU 调度，本任务不用 GPU；同题旧调用未明先核状态，不重复执行。
