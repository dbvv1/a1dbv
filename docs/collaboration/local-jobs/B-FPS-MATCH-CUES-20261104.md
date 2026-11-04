# B-FPS-MATCH-CUES-20261104 · 制作切枪与回合提示源
id: B-FPS-MATCH-CUES-20261104
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 36fde4bb6a2e8f9652528fdea648d0a90190db79
result_branch: relay/b-fps-match-cues-20261104

工作线：FPS-Like。本卡为独立排队单元，尚未认领。

## 目标
补现有训练赛切枪、菜单确认、回合胜／负四个声音槽的可编辑候选，保枪声和威胁声优先。

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
