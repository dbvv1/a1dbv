# B-CORE-BINDINGS-ADOPTION-20261106 · 照正文迁移完整改键链
id: B-CORE-BINDINGS-ADOPTION-20261106
owner: dot-B
kind: reader-test
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bbb068cbdc97617856763414ace1d9d828b9c9d9
result_branch: relay/b-core-bindings-adoption-20261106
page: experiments/moba-keybindings/README.md@bbb068cbdc97617856763414ace1d9d828b9c9d9

工作线：核心模块。本卡已接收可复验的行为证据并修正文；不以接收状态证明原进程退出；优先 Star 品质闭环，其他线独立继续。

## 目标
检验模块页能否让非作者把第二组真实改键连到动作、提示和持久化，不重复原 Q→F 首次接入。

## 按哪个 Skill／规格
按 write-task-guide；接收端给读者 page 全文，真实消费者 MOBA-Like@7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64。原卡仅验证绑定/接线，不覆盖本次第二组完整需求。
1. 在独立临时副本把 W 与 R 明确交换，再把停止 S 改为 G；取消一次草稿、保存一次，核 controls 实际产出的 slot/stop 命令、原技能消耗及 HUD/help/英雄提示。
2. 新建同存储实例与新对局，保本次有效绑定；用现成存储失败替身使保存失败，原有效动作与提示不得部分切到草稿。恢复默认仍沿正文操作，不直接改 JSON 或插入内部字段。
3. 实跑现有4文件45项及所需最小新用例；原断言若已覆盖则引用，报告读者照页面还缺哪些完整参数/入口，区分页面卡点与能力/依赖缺项。
4. 只能CPU DOM与真实Simulation，DOM替身不是浏览器实操；不运行页面给出的 dev 命令、不启动浏览器或socket、不重装依赖。
5. 读者不改原页或产品；非读者复核命令/真实路径，不帮读者补隐藏步骤后冒称首次照做通过。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/B-CORE-BINDINGS-ADOPTION-20261106/result.md 与最小复现输入。MOBA副本改动仅为实验，不提交产品。

## 怎样算做成
完整第二次改键的实际命令/状态/提示证据；给 taskDone/pageStuck 与首次卡点、可照做命令。未装依赖只报缺项，不把旧45项或CPU DOM当真人操作通过。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果

- **接收决定（2026-11-06）**：接收第二组 W↔R、S→G 的 CPU DOM／真实 Controls 与 Simulation 行为证据；已补[正文](../../../experiments/moba-keybindings/README.md)的第二组操作、选择器、真实回调与失败替身入口。原读者 taskDone=true 只限该运行范围，独立性自述有冲突，新版正文未再经首次独立照做。
- [原交回 e1ea6f0](https://github.com/dbvv1/a1dbv/commit/e1ea6f0cd925b5e98832601d30cbaa94640c328d)；[接收版与勘误](artifacts/B-CORE-BINDINGS-ADOPTION-20261106/result.md)保留原证据和范围，补 mkdir／复制路径，纠正现成替身、新对局、逻辑键、cast 时序与 title 等表述。原测试 Fixture.store 注记已修，运行时断言不增。
- 接收者在同固定源 7e1986f 的独立副本复跑 5 文件47项与网页类型检查通过；另显式检查外加测试类型通过。新增组合没有 onOpenChange 接线，菜单禁用／清队列沿用真实 client 既有回归，W/R HUD title 未直接断言。
- 未运行：浏览器／dev／socket、实际 localStorage刷新、焦点／设备与完整对局；不改产品、不重新运行本机读者，不作画面或手感结论。原调用退出仍无新回执。
- 剩余入口：新版页面首次独立照做及真实浏览器／设备按既有待验批次处理，不重复派本卡。
