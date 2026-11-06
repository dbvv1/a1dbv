# B-CORE-BINDINGS-ADOPTION-20261106 · 照正文迁移完整改键链
id: B-CORE-BINDINGS-ADOPTION-20261106
owner: dot-B
kind: reader-test
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bbb068cbdc97617856763414ace1d9d828b9c9d9
result_branch: relay/b-core-bindings-adoption-20261106
page: experiments/moba-keybindings/README.md@bbb068cbdc97617856763414ace1d9d828b9c9d9

工作线：核心模块。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

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

- reader-test 一轮观察结束：读者在独立 MOBA-Like 临时副本（消费者 7e1986f，与页面固定源 a829005 的 6 个源文件/4 个测试文件 diff 为空、锁文件 sha256 相同）按页面完成第二次真实改键——取消一次 Q→F 草稿、经冲突提示交换 W↔R、Stop 由 S 改 G、单次保存；controls 实际产出 cast slot R/W 与 stop，真实 Simulation 接受、蓝量下降、槽位冷却；HUD/controlsHelp/英雄提示同步为 Q/R/E/W 与 G: stop；同一存储新建 owner + 新对局保留绑定；setItem 抛错时 apply 失败且有效值与提示不被草稿部分切换；Restore defaults + Save 恢复默认并删键。4 文件 45 项 + 新增 2 项 = 47 项通过，tsc -p tsconfig.web.json 退出 0；未开浏览器/dev server/socket、未装依赖、未改产品。taskDone=true（仅 CPU DOM + 真实 Controls/Simulation）。pageStuck（页面卡点）：仅有的界面段只教 Q→F 与 Q↔W，缺第二组（Stop 行、W↔R、取消草稿）可照做步骤及 DOM 选择器；最小调用顺序里的 refreshRows/showSettingStatus/refreshHudKeys/closeSettings/canControlCurrentMatch 非产品导出且无真实签名；未给保存后刷新顺序与保存失败替身位置。未运行验收：真实浏览器刷新 localStorage/跨标签/断电、渲染、音频、GPU、原生 dialog 焦点与设备手感、完整套件与构建均未验证，CPU DOM 不能当浏览器实操通过。openIssues（verify 未修正项）：result.md 命令块对空 $WORK 直接 tar -x 到不存在的子目录，缺 mkdir -p，不能原样照做；读者‘没有设置入口’‘未指出断言文件’的表述与页面不符；‘现成存储替身’措辞不准确（实际自加 fail 标志，行为等价）；读者独立性自述前后不一致（声明未读 a1dbv 其他文档但后文列出读过两份）；页面 step 6‘工具条 A/S/Space 提示’与固定源实际控件（页脚 #controls-help）名称不符未被指出；新组合用例 onOpenChange 为空，未复现设置期间 controls.setEnabled(false)/清命令队列；第二组 W/R 的 HUD title 未直接断言；castSlot‘约 7 tick’为近似（实际首次 remainingTicks 8）。
- 产物：[e1ea6f0](https://github.com/dbvv1/a1dbv/commit/e1ea6f0cd925b5e98832601d30cbaa94640c328d)，分支 `relay/b-core-bindings-adoption-20261106`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人需先修正 result.md 命令块（补 mkdir -p）与不准确表述，再决定是否按第二组路径补页面入口/选择器/真实刷新与失败替身说明；浏览器与真实设备验收仍需人工另行安排。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
