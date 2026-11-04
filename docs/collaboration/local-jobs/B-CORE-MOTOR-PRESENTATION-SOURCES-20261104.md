# B-CORE-MOTOR-PRESENTATION-SOURCES-20261104 · 固定步长移动与显示位置权威
id: B-CORE-MOTOR-PRESENTATION-SOURCES-20261104
owner: dot-B
kind: explore
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-core-motor-presentation-sources-20261104

工作线：核心模块。来源单元已回传，负责人窄接收已核时序与移植断言；引擎移植待验。

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

## 当前结果

- **接收范围**：原产物 [0815770](https://github.com/dbvv1/a1dbv/commit/0815770928049e027b4727d6d67107f032280af8) 保留在 `relay/b-core-motor-presentation-sources-20261104`；负责人独立读三份实际源码及直接依赖后，把修订后的时序／位移所有权和五项断言合入[既有角色模块](../../../domains/game-dev/04-client-modules.md#motor-presentation-ownership)。广泛链接清单未整体采用，不以链接数量或原审查自报作为事实通过。
- **已纠正**：FPS 是 DOM 事件入队、tick 消费，相机位置随显示角色而朝向读 controls；Celeste 在同一模拟 tick 内多次修正 Position，补核显式 60 Hz 与 Foster 0.4.2 固定依赖；JLPM 控制器与动画根为不同对象，改固定步还涉及骨骼速度差分和惯性化。Unity 关闭插值／CC disable 配方不提升为通用默认。
- **边界**：五项为目标工程待执行断言，新增短距离／纯竖直传送须显式清历史，30／60／120 Hz 按同一 tick 比较。未运行 Unity／Unreal／Godot，未重跑 ground-v1、未填新性能数，模块成熟度不提升。FPS 当前 `36fde4b` 的前台时钟与恢复变更已对照，保留原采用入口。
- **原执行核查**：Workflow completed、CLI 于 2026-11-04 16:58:05 UTC 以 0 退出，工具已结清、无 pending，登记进程已退出且存活匹配为 0；外层 worker 独立退出事件仍未知。仅接收已确认产物，不重启／重派同题。
- **下一步**：有获准目标引擎工程时，按模块五项断言实测落位、清历史与根运动时序；本卡不新建工程或排队重采来源。发布检查与非作者读者结论写合入提交说明。
