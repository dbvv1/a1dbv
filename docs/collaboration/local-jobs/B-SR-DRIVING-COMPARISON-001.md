# B-SR-DRIVING-COMPARISON-001 · 正式公路与 Rapier 候选的同弯实操

id: B-SR-DRIVING-COMPARISON-001
owner: dot-B
status: ready
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 0817aa057624c4d1370d625c08454a831b3ab58d
result_branch: relay/b-sr-driving-comparison-001

## 目标

正常键盘实际完成汐见海岸原公路 170–740 m 的入弯制动→转向→回正出弯→擦墙／倒车恢复，比较正式 road-v2 与未采用 Rapier 候选的可预判性、可恢复性和错误原因；以地平线铺装公路操控为参照，交可复核的真实观察，不调参、不凭库名判优。

## 固定输入、去重与调度

- 先读 a1dbv 最新 AGENTS、operations§2.2、local-jobs README 与全队列，以及目标仓 AGENTS、README、docs/brief.md 和 `experiments/rapier-road-comparison/README.md`；沿既有原生 Workflow 实施、非作者独审、必要修正一次并复审。
- 先核 main、dot-a／dot-b、relay 与本机同 id 调用；同题在途接续、不重派。只有本卡为 ready／revision_requested 且成功认领后才启动；ready 或 Git claim 不能当实际运行证明。
- B 固定分支 `dot-b/candidate/20261027-rapier-road-comparison`，上述完整 SHA；GET 核 tree `9dfa060ac68a2d2c7f44e59fb510537549c7d418`，唯一 parent 为 A `1dd89d3931196cb08f7b9a00541a54a6715dfe1d`。不符先停并报告，不自动追新版本。
- A 为该 parent 的正式默认 road-v2；本卡建立时 Star 的默认分支 master 仍为 A。B 相对 A 只增加 `experiments/rapier-road-comparison/`，未采用、未上线；不能把 B 当正式游戏新版。
- 共享接收端最多四并行，按现队列排队。GPU／实际图形任务互斥：排在 B-FPS-SHOT-QUALITY-001、B-MOBA-CLIENT-SMOKE-001 之后，开始前核实际 GPU 占用与释放，若其他作业在用继续等待，不抢设备／实例；不凭卡片状态推断 GPU 空闲。
- 本卡发布前队列四卡标 running：上述 FPS、MOBA、B-GENRE-REFERENCE-20261027、A-CONTEXT-COMMUNITY-FOLLOWTHROUGH-20261027；这只是已认领记录，实际进程未知，领取时重核。

## 按什么做

1. 使用独立 worktree、正常锁文件依赖和已配置浏览器／GPU／输入服务；Node 24，根目录 `npm ci`。A 按根 README build／dev，从正常默认菜单进入汐见海岸；B 子目录 `npm ci`、`npm run build`、`npm run dev`，使用各自独立的本机服务，不测公开旧站。
2. 起步先核操作者与独审是否能直接读图、看连续录像、听声音及进行真实键盘输入；缺能力逐项写 unknown／blocked，只回可审原始结果，不由作者源码或文字报告代评。原生 Three／WebGL2 必须实际确认，Canvas／软件 renderer 分列，不伪称硬件通过。
3. 记录固定 SHA、实际浏览器版本、renderer／GPU、视口与缩放、帧率与采样方式、输入设备／服务、辅助设置、镜头与涂装、时间。A/B 同车模、标准追尾镜头、可比视口；不能为了好看改镜头／车体／物理参数。读不到的条件写未知。
4. A 从默认起点正常驶到同一 170–740 m 路段，B 用原 170 m 起点；起点和进入速度差异如实记。只用正常输入，不改 position／speed／seed／clock，不用隐藏 state、路径吸附或自动曲率 driver 对齐，不开自动试驾代手动。
5. 各做连贯正常驾驶段：起步→松油／制动→约 320 m 入弯→持续修正→回正出弯，抵达 740 m；再在可控低速轻擦护栏、制动／倒车脱困并恢复前进。保完整输入时序和对应连续录像，不把暂停后的分段拼成成功全程。失败、翻覆、未到终点照实记。
6. 按两版真实操作区别输入：B 的 W 油门、S／空格制动、A/D 转向、X 倒车、Esc 暂停、R 回 170 m；A 的 S 低速倒车、R 重开、Backspace 回正。允许正常重开重试，任何重置／回正都记为恢复辅助，不当自然脱困；禁止改断言或源码补成功。
7. B 无 AI、成绩、幽灵及完整场景，比较限于同路段驾驶、镜头和反馈；不比较场景丰富度／比赛胜负，不因功能少或环境简化判正式产品退步。无法公平控制的条件单列。
8. 既有作者 native Firefox 已粗测 W/S/A/D＋暂停：800 ms A 曾撞内墙，120／180 ms 短脉冲能前进；README 记到约 339 m。这不是完整弯道或品质通过，不重复该粗输入作为成功证据、不据此调参。CPU／DOM 16 例已过，无须再刷当品质。
9. 根聚合 `npm test` 先前 SIGKILL／137 未通过；可在本机完整跑一次区分环境问题，保命令、退出码和首错，不循环刷数值／降低断言。工程检查与实操结论分开，测试不代替驾驶。

## 参照与非作者判断

- 优先复用 B-GENRE-REFERENCE-20261027 已有产物及其固定原文／真实连续片段；尚未回传则查看可正常播放的 Forza 官方铺装路片段，不重新大范围探索工具或物理库。
- 记录原始 URL、作者／官方来源、访问日期、游戏版本可知范围、起止时间码、车辆／设备／辅助设置；未公开的写未知。只读字幕／原文就写明，未看到／听到不称视听已验；只观看商业参照，输入手感仍是未实玩。
- 未参与实现和采集者直接看可比片段／同视角截图，评最大的三个有证据差距：制动／转向是否可预判，松键回正／出弯是否可控，擦墙／倒车能否恢复；区分操作者输入错误、帧率／工具限制和车辆响应，不由一次失败强归因物理。
- 每项写实际动作、可见／可听结果、证据时段、影响哪个玩家判断、建议下一步与如何再验；证据不足的维度写 unknown，不凭地平线标签或作者代码宣布达标，建议不自动执行。

## 独占写域与交付

目标仓仅写 `docs/qa/B-SR-DRIVING-COMPARISON-001/observations.md`，必要的本作纯游戏 viewport 截图可放同目录；a1dbv 仅回写本卡。源文件只读，不碰 docs/quality.md、其他任务／文件、默认分支或 Site。
原始自有录像／音频、商业参照图／片及派生并排图留本机 ignored，不上传；可公开报告只含可核 URL／时间段／差异及脱敏输入记录，不含本机绝对路径、桌面、账号或敏感日志。截图逐张审隐私，只上传必要自有纯游戏画面。
不创建本机或云端 Codex 任务，不直接委派 dot 操作用户电脑；只走既有接收端和输入服务。不装系统驱动，不改 sandbox／网络／权限，不建凭据／账号，不付费、不购装商业游戏；明确拒绝只停对应动作，不换路绕过。
接收端运行适用文档检查、check_public 和空白检查，noreply 提交并人工读差量；仅快进推指定 result_branch，回 `review_ready` 由 dot-B 审阅，不设 accept: auto，不合入／部署。单次单元最多两小时；基础能力或必要输入缺失回 `blocked`，写动作、对象、原因、已完成内容、当前状态与恢复条件，不伪造完成。

## 当前结果

候选 SHA／tree／parent 与仅实验目录差量已远端核实；本卡 ready 排队，尚未认领或实际运行。完整同弯、恢复、参照与独审均未完成，正式 master／网站和驾驶参数不变。
