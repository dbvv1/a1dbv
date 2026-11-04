# B-MOBA-UI-EVENT-CUES-20261104 · 制作局内交易与升级提示源
id: B-MOBA-UI-EVENT-CUES-20261104
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: b489ed38592dc184fffe2ab9b3b186441c7dc9bb
result_branch: relay/b-moba-ui-event-cues-20261104

工作线：MOBA-Like。沿原任务与结果分支窄返工，只修已复现的配方校验缺口。

## 目标
给现有购买成功／失败、升级、复活四种已存在事件准备可编辑短音源，补内容清单的局内提示缺口，不替换战斗混音。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §3–5 与 `domains/game-dev/assets/audio.md`。四 ID 固定 purchase-ok／purchase-denied／level-up／respawn-ready；使用原创确定性 Python 波形配方，不取商业声、不生成模型、不使用旧 Q/W 或结构坍塌候选。48kHz mono PCM16 WAV，前两段≤0.25s、后两段≤0.6s，5ms 起落包络，峰值≤−9dBFS；成功与拒绝用相反的上／下行两音形，升级三音，复活单次柔和上扬。数值只是本批候选预算，不声称听感最佳。
元数据明确未来由实际已提交事件触发，不从 HUD 数字变化猜事件；本卡不接线、不开声音设备。二改把全批主频比例统一 0.9，重建且保持时长／事件身份。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `asset-pipeline/ui-event-audio/` 的 generator、recipe、四段 WAV、manifest、测试与 README；不改 assets/audio/battle、src/audio、HUD、既有结构/赏金/音频重试产物。

## 怎样算做成
实际四段 WAV 可解码，时长／峰值／首尾边界/重复字节、缺参数／非法频率拒收测试与二改结果；给事件映射和待听问题。非作者核源和数字，不以波形证明四声可辨；真实试听、重叠遮挡与采用由 dot 另验。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 修复 ui-event-audio 两处校验缺口：滑音段按两端最高基频对每个泛音及每版 fundamentalRatio 检查 Nyquist，固定音同样检查；peakCeilingDbfs/peakTargetDbfs 不得高于 -9 dBFS，保留 target<=ceiling 并允许更保守值。新增回归先在 HEAD 版复现失败，再于修复版跑通；--check 与 15 项单元测试通过，四段 WAV、manifest.json、recipe.json 与 HEAD 逐字节一致，公开文件/路径扫描无命中，diff 仅限三个文件。openIssues 为空；真实试听、四声可辨、混音遮挡、设备解码与采用未验证，升级/复活 PresentationEvent 接入前置项未改动。
- 产物：[0b3d85d](https://github.com/dbvv1/MOBA-Like/commit/0b3d85d47b184ac48450e0a9d039fd3e0143c273)，分支 `relay/b-moba-ui-event-cues-20261104`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：由负责人进行真实试听、重叠遮挡与采用决定，并处理升级/复活尚无 PresentationEvent 的后续接入；本单元无需继续返工。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 修改要求

1. **滑音全程泛音拒收。** `validate_cue()` 当前仅核起频乘泛音倍数；将复活段 `glideToHz` 改为 15000 后，二次泛音在 r1 达 30000 Hz、r2 达 27000 Hz，超过 48kHz 采样的 24000 Hz Nyquist，仍通过并生成。对每个版本比例、每个泛音，检查滑音两端的最高频率乘倍数，达到或超过 Nyquist 即拒收；固定音同样保留检查。加合法邻界、恰达边界、越界和比例导致越界的回归，先证明原实现失败。
2. **保持本批峰值硬预算。** 同时改 `peakCeilingDbfs=-1.0`、`peakTargetDbfs=-1.1`，当前可生成 −1.1004 dBFS。校验必须拒绝放宽到高于 −9 dBFS 的 ceiling／target，允许更保守值并保留 target 不高于 ceiling 的关系；补默认通过、放宽拒收、边界与保守值测试。
3. **只修校验与直接回归。** 不重设计音色，不接线；保留当前 recipe、四 WAV 与 manifest 的逐字节结果，确需改变时先说明与这两处缺陷的直接关系。复跑原 13 项及新增测试、`--check`、字节比对、公开文件／提交扫描和差异检查；报告实际结果。真实试听与采用仍由负责人另验。
