# B-CORE-STABLE-SEATS-ADOPTION-20261106 · 照模块接六席真实命令
id: B-CORE-STABLE-SEATS-ADOPTION-20261106
owner: dot-B
kind: reader-test
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bbb068cbdc97617856763414ace1d9d828b9c9d9
result_branch: relay/b-core-stable-seats-adoption-20261106
page: domains/game-dev/07-networking-and-server.md@bbb068cbdc97617856763414ace1d9d828b9c9d9

工作线：核心模块。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
让读者把当前 MOBA 六席命令封套用于两份真实模拟，核页面是否足够从旧三进程小样走到已采用协议；本卡不新建网络框架。

## 按哪个 Skill／规格
按 write-task-guide；真实消费者 MOBA-Like@7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64 的 Simulation.commandFrame/step、inputSeats 与 tests/command-frame.test.ts。另沿 docs/decisions/instruction-files.md 的现有入口确定采用的共享指令层，在报告列实际采用内容与效果；这属于 TASKS“共同”的自然接入证据，不自行宣布该项已完成。
1. 两个独立 Simulation，seed 901、contentVersion 12、heroesPerTeam 3、同一真实导航与初态。只在进程内送有序封套，不开TCP/WebSocket/端口，不运行旧 server-lockstep/run.mjs。
2. 六席依稳定team/roster映射；600tick中用原合法move/stop/cast/buyItem，给明确空输入席。每端以不同到达顺序整理封套，同席内部顺序保留，逐tick完整hash一致。
3. 合法同身份重送不重复应用；同身份内容冲突、错heroId、缺席和非下一tick保持原拒收政策；这些用原API验证，不写第二个排序器绕过生产实现。
4. 一个真实购买与技能消耗必须通过原规则出现，失败命令也保原CommandResult；单纯两次空输入同hash不算接入。若页面只支持较早contentVersion，报告首个缺步骤并止于真实边界，不改版本凑绿。
5. 读者只写过程/卡点，全部产物明确为本机同版本CPU接缝，不称浏览器联网/跨平台确定性或公网认证。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/B-CORE-STABLE-SEATS-ADOPTION-20261106/ 下 result.md、可复现脚本及小型输入；生产模块、模拟、现有实验与TASKS只读。

## 怎样算做成
600tick实际六席消费与失败用例回执，明确指令入口采用效果、页面卡点与网络未运行；非读者核真实消费者，不能用toy模拟或历史结果替代。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果
- 规格已定，待接收端在确认同单元无活跃调用且有空槽后认领；本次未发起模型、桌面或产品运行。
