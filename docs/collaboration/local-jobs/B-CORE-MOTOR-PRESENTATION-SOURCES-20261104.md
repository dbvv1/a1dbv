# B-CORE-MOTOR-PRESENTATION-SOURCES-20261104 · 固定步长移动与显示位置权威
id: B-CORE-MOTOR-PRESENTATION-SOURCES-20261104
owner: dot-B
kind: explore
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-core-motor-presentation-sources-20261104

工作线：核心模块。本卡为独立排队单元，尚未认领。

## 目标
让程序员把 FPS motor 和插值迁移到引擎时，只有一个系统拥有位移，暂停／重生不插回旧位置。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-module-from-case/SKILL.md` §2。固定来源：FPS-Like@bd47655676d79061ff4be54cbedad111053c5af3 的 offline-training-v1/sim/{movement,physics,game}.ts、render/interpolation.ts、client 与 docs/feel.md；ExOK/Celeste64@6edfe1ebd2a21a6134d7675a28e357891025407e 的 Player.cs；JLPM22/MotionMatching@35fc8ee9a0fd97f12de458ea81eaef7c8219d87a 的 com.jlpm.motionmatching/Runtime/CharacterController/SpringCharacterController.cs。路径以固定树核准，引用正文现有 OnAnimatorMove 契约。
问题固定为输入采样／消费频率、Root Motion 位移所有权、呈现对象与物理对象分离、暂停／重生／传送清历史、同输入 30／60／120 Hz 呈现的不变量。不改 FPS 摩擦加速度，不重复 ground-v1 实测，不创建 Unity 工程。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/B-CORE-MOTOR-PRESENTATION-SOURCES-20261104/sources.md`；所有模块页、案例代码、其他任务与指导文件只读。接收端另回本卡。

## 怎样算做成
交三个实现的时序与位置写者清单、五项保持原规则的移植断言和固定源码行链接。分清网页既有 CPU 证明、当前代码阅读与引擎未实跑，不填新性能数。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。
