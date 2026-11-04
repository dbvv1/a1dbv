# B-CORE-AUDIO-OWNERSHIP-SOURCES-20261104 · 声音实例的停止与回调所有权
id: B-CORE-AUDIO-OWNERSHIP-SOURCES-20261104
owner: dot-B
kind: explore
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-core-audio-ownership-sources-20261104

工作线：核心模块。本卡为独立排队单元，尚未认领。

## 目标
让现有关键事件保留链在暂停、替换与退出时不重播旧事件，也不让旧结束回调释放新声音。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-module-from-case/SKILL.md` §2，接 04 音频与 game-audio-lifecycle 已定契约。固定来源：MOBA-Like@dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c 的 docs/audio-critical.md 及调用链；goldfire/howler.js@003b917c40cb41cf382ba47ae0ed7a35ca2abe76 的 src/howler.core.js；Anuken/Mindustry@d1e0307d3906bb350e80d8969a2464ed0b771ffb 的 core/src/mindustry/audio/SoundPriority.java；Anuken/Arc@46c0956944af81db1145625e07108c196d94e260 的 arc-core/src/arc/audio/Sound.java。
只对照同渲染帧多 tick、同源不同实例、pause／stop／loop-end／fade-cancel、替换后旧回调、退出再进入。云端已有 MOBA 取样失败重试 c16d653 是另一单元；不研究或重做它的加载重试，不改音频源或默认混音。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/B-CORE-AUDIO-OWNERSHIP-SOURCES-20261104/sources.md`；所有模块页、案例代码、其他任务与指导文件只读。接收端另回本卡。

## 怎样算做成
沿 MOBA 真实事件→调度→实例→清理标出责任，逐项说明其他实现在哪一层解决和未解决；五项可直接执行的测试输入与预期断言、每条固定源码链接。未运行音频设备，不将读码写成试听或新默认。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- check_repo 有本单元新增错误或检查结果未知，未推送
