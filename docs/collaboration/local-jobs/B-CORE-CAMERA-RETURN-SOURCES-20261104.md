# B-CORE-CAMERA-RETURN-SOURCES-20261104 · 镜头借出归还的引擎接线
id: B-CORE-CAMERA-RETURN-SOURCES-20261104
owner: dot-B
kind: explore
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-core-camera-return-sources-20261104

工作线：核心模块。本卡为独立排队单元，尚未认领。

## 目标
把已定镜头归还契约对应到真实 API，让移植者分清 Cinemachine blend 与游戏会话的状态所有权。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-module-from-case/SKILL.md` §2。只做既有 04 相机完整模块／wp10-motion camera-control-return 的源码对照，不新设默认参数。固定来源：Unity-Technologies/com.unity.cinemachine@45728f3030787076f32930101d11d9ca96fe3a0f；ExOK/Celeste64@6edfe1ebd2a21a6134d7675a28e357891025407e；MOBA-Like@cb818773da66e6a8ee77a4576339f33457fba32d 的 camera-follow、controls、world。开工核各 ref 与实际路径，源码不存在不能用最新版替代。
回答五项：cut／blend 完成区别；死亡／换角色后的迟到通知；嵌套菜单只撤自己持有；临时跟随结束保位置与永久偏好；主震关闭后的次级尾震。网页候选仅作既定消费者，不做浏览器验收。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/B-CORE-CAMERA-RETURN-SOURCES-20261104/sources.md`；所有模块页、案例代码、其他任务与指导文件只读。接收端另回本卡。

## 怎样算做成
五个场景逐项交输入、状态所有者、原生回调入口、项目必须保留的条件及固定源码行链接；给出一张时序图与五个后续接线断言。明确代码阅读和引擎未实跑。不得只重复已知相机职责。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 单元达到时限，收集超时前已写出的部分成稿：docs/collaboration/local-jobs/artifacts/B-CORE-CAMERA-RETURN-SOURCES-20261104/sources.md。最终审查未完成，未关闭意见及未核范围由负责人接收；不表示整项验收通过。
- 产物：[cba4c59](https://github.com/dbvv1/a1dbv/commit/cba4c5953dc31f77ad51693162f8ffd75cdfeff4)，分支 `relay/b-core-camera-return-sources-20261104`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：负责人接收已有成稿和审查缺口；本次不重派、不重跑。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
