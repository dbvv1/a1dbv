# B-FPS-MATCH-CUES-20261104 · 制作切枪与回合提示源
id: B-FPS-MATCH-CUES-20261104
owner: dot-B
kind: build
status: revision_requested
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 36fde4bb6a2e8f9652528fdea648d0a90190db79
result_branch: relay/b-fps-match-cues-20261104

工作线：FPS-Like。本卡只验四段可编辑声音源；运行接线与听感另验。

## 目标
补现有训练赛切枪、菜单确认、回合胜／负四种可编辑提示候选，保枪声和威胁声优先；在现有 17 个语义槽中，胜／负同属回合结果槽，不按 WAV 数增加通过件数。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §3–5 与 `assets/audio.md`。先读 main 的 render/synth.ts、audio.ts、session/match.ts 与当前17声音槽，不重复已有射击／命中／受伤音。固定四 ID weapon-switch／menu-confirm／round-win／round-loss。原创确定性 Python 合成；48kHz mono PCM16，switch≤0.14s、menu≤0.10s、胜负≤0.5s，5ms包络、峰值≤−12dBFS。胜负以上/下行两音区分，切枪是低能短机械声，菜单单脉冲，不使用商业素材。
仅交供试听的源，不开声卡或改运行声；manifest 绑定实际事件入口和未来优先级意图，不能从回合UI文字猜胜负。全批增益−3dB再生成，保时长／随机seed／事件身份。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `asset-pipeline/match-cues/` 的 generator、recipe、四段 WAV、manifest、测试和 README；不改 src/audio、render/synth、现有声音源、quality.md 或混音默认。

## 怎样算做成
四段实文件可解码、时长／峰值／首尾包络／确定性／非法输入通过；二改全部只改变幅度且不削波。给与枪声重叠的后续试听问题。CPU通过只表示声音源可用，不是听感、CS2对标或游戏采用通过。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 决定：源链返工，保留原四段候选。原 20 项测试虽通过，负责人独立反例检出默认峰值越界及缺少元数据后部分写入，见下方修改要求；未合入 FPS main。
- 产物：[25e6dba](https://github.com/dbvv1/FPS-Like/commit/25e6dbab26fb5a98dc366b942ff84b60234dfb0e)，分支 `relay/b-fps-match-cues-20261104`。9 文件均在 `asset-pipeline/match-cues/`，包含 generator、recipe、manifest、四 WAV、测试与 README；`runtimeWired=false`。
- 独立检查：20 项源测试及合法配方字节重建通过，四 WAV 共 109,616 字节，均 48 kHz mono PCM16，时长 0.130/0.090/0.460/0.460 秒、峰值 −12.0007 dBFS、首尾 0；−3 dB 幅度对照、事件绑定与 CC0 声明核对通过。已补跑 `npm test` 430/430、类型／生产构建；公开文件与候选提交身份扫描、差异检查通过。
- 未验：实际试听、枪声／换弹／命中掩蔽、运行时优先级、浏览器播放与设备。当前四片只补三个语义槽的源候选，不增加游戏品质通过数；现有运行声、模拟、混音默认与 `quality.md` 未变。
- 下一步：先修下列源链缺口，再收源；接线仍延期。未来真实试听须核切枪与 reload/bolt 区分、菜单／胜负和 hit/head/kill 的混淆、−3 dB 后可辨性与重复耐听，不以波形或 CPU 测试代签。
- 原调用：2026-11-04 16:55–16:58 UTC 本机只读核实，原 Workflow completed、CLI 于 16:28:19 UTC 以 0 退出，工具 settled／pending 空，登记进程身份存活匹配 0；三类非作者最终 pass，实际测试日志齐全。外层 worker 独立退出事件／时刻未留证，保持未知，不重放旧调用；本次按变化输入沿原分支返工。

## 修改要求

负责人对 `25e6dbab26fb5a98dc366b942ff84b60234dfb0e` 的独立复核发现两项源链缺口，沿原分支小修，不重新制作四段、不扩大接线范围：

1. 默认配方的峰值约束可绕过。仅把 `levels.firstPassPeakDbfs` 从 `-9` 改成 `-8`，其余不变，CLI 退出 0，四片实际峰值均为 `-11.0009 dBFS`，manifest 却仍标 `peakCeilingDbfs: -12`。在输出前拒绝最终默认增益结果超过上限的配方，并增加该反例；保留明确用于幅度对照的 `--gain-db 0`，不要把对照批次称为最终候选。
2. 配方缺 `license` 或 `batchId` 时，CLI 先写四段 WAV，再以 `KeyError` 退出 1，没有 manifest。补齐必需元数据校验，以清楚的配方错误退出 2，拒绝前不新建或改写产物；用缺失／非法元数据验证已有输出不被改写。只补当前格式实际需要的字段，不扩成通用资产平台。
3. 保留现有合法配方及四 WAV 的字节与事件身份；只更新 generator、必要测试和随脚本哈希重建的 manifest／说明。重跑 20 项原测试与新增反例、公开文件／提交扫描和差异检查，仍只推本卡结果分支。不要改 `src/`、混音默认或 `quality.md`；不合 FPS main、不部署、不为此次返工启动 GUI 或浏览器。
