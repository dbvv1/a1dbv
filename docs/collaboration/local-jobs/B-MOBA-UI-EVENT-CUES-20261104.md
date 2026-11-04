# B-MOBA-UI-EVENT-CUES-20261104 · 制作局内交易与升级提示源
id: B-MOBA-UI-EVENT-CUES-20261104
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: b489ed38592dc184fffe2ab9b3b186441c7dc9bb
result_branch: relay/b-moba-ui-event-cues-20261104

工作线：MOBA-Like。本卡为独立排队单元，尚未认领。

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

- 已新增 asset-pipeline/ui-event-audio/ 下确定性纯 Python 发生器与配方，生成四段 48kHz mono PCM16 WAV（0.220/0.220/0.550/0.500 s，峰值 −9.1003 dBFS，首末采样 0，SHA-256 互异），配套 manifest（事件映射、r1→r2 主频比例 0.9 重建结果）、13 项单元测试与 README；实测 generate.py --check 通过、unittest 13 项全过、git status 仅此 9 个新文件。openIssues：level-up/respawn 尚未以 PresentationEvent 暴露，接线前需先在模拟层补正式提交事件；真实试听、四声可辨、重叠遮挡与采用决定未验；npm test 未运行（无 node_modules 且本批不改 TS）。
- 产物：[08d9627](https://github.com/dbvv1/MOBA-Like/commit/08d9627c4a7f7fa935c9fbefe710b1d61c064043)，分支 `relay/b-moba-ui-event-cues-20261104`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：交负责人接收：进行真实试听与采用决定；如后续接线，先在模拟层为升级/复活补正式 PresentationEvent（本卡按范围未接线）。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
