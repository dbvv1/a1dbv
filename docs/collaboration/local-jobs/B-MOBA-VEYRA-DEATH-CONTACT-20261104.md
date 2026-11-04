# B-MOBA-VEYRA-DEATH-CONTACT-20261104 · 修 Veyra 死亡动作地面接触
id: B-MOBA-VEYRA-DEATH-CONTACT-20261104
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: b489ed38592dc184fffe2ab9b3b186441c7dc9bb
result_branch: relay/b-moba-veyra-death-contact-20261104

工作线：MOBA-Like。本卡源候选已由负责人接收；实际游戏接线与画面验收仍待完成。

## 目标
针对当前 Veyra README 已确认的旧死亡动作脚底穿地，交可重建的两队源候选，保留五动作与职业身份。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §4–5 与 `domains/game-dev/assets/animation.md`。输入为固定 main 的 `asset-pipeline/heroes/veyra-release/source/veyra-{teal,rust}.blend`、exported GLB、manifest 与 build/retarget 配方；先在副本按原 death 时长逐帧及半帧采样重现脚部穿地，若不能重现就交事实和停止修改，不造修复。
仅调整 death 动作的源姿势／根高度，使实际蒙皮脚部最低点≥−0.01m，首帧原站姿、末帧倒地稳定、武器不新穿地。原时长、其他四动作的解码关键帧数据、骨名／父子／bind、网格accessor、材质字段与队色逐项保持；不要求重新导出的GLB/.blend封装字节相同；每个采样至少一只鞋底或身体支撑面在地面−0.01至+0.02m范围，不可把整段角色悬空来过门；报告全身/脚部最低接触高度与实际改帧，武器只要求不低于同帧原基线最低值减0.01m，不替本卡修旧武器缺陷。脚部顶点归属按源骨骼权重，不以名称猜左右。沿脚本自动处理，不手修。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `asset-pipeline/veyra-death-contact/` 的候选源／GLB、可重跑脚本、测试与 README；原 heroes、battle、表现运行时、quality.md 均只读。Blender 仅用已有版本后台 --disable-autoexec，不安装或打开窗口。

## 怎样算做成
两队实际源→GLB重建、逐帧／半帧蒙皮接触检查、其他四动作与网格／bind不变、源缺失／非法阈值失败路径；再把接触容差从 0.01 调为 0.005 重跑，保可编辑性。独审核不是只动文件名或改断言；CPU 接触通过不代替实际游戏死亡剪影与同框评判。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- **接收范围：source candidate accepted。** 原回交 [cd5369a](https://github.com/dbvv1/MOBA-Like/commit/cd5369af66732b24622b178eb6bd54b6e3485edf) 经负责人独立核查与窄修后，已快进合入 MOBA main [7e1986f](https://github.com/dbvv1/MOBA-Like/commit/7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64)。只接收 `asset-pipeline/veyra-death-contact/` 源候选包；两队 `.blend`／GLB 与原回交逐字节一致，原 `heroes`、`battle`、运行时、`quality.md` 均未改，原结果分支保留 `cd5369a`。
- **窄修**：补齐采纳文档中的 recipe／README pin；网格不变量增加 NORMAL 与按骨名识别的非零蒙皮权重，源 Root 曲线检查原 key 时间、插值和 31 项数目；新增 5 项负例和 1 项正例。保留上游 Quaternius UAL1 CC0 攻击动作来源，不再称无第三方内容。文档明确两种采纳路径均未端到端运行，文档检查不等于已采纳。
- **独立验证**：32 项包内 Python、87 文件／568 项游戏测试、7 项 content-set 测试、`npm run build`、web typecheck／build、公开文件／提交身份扫描和差异检查全部通过，非作者独审通过。原缺陷为两队 frame 13.5 脚底 −0.051905 m；候选在 0.01／0.005 m 容差通过，脚最低 −0.000127 m、身体最低 −0.000182 m、最高支撑最低点 +0.014601 m。Three.js CPU 蒙皮独立对照 baseline／candidate × 两队 × 61 采样，最大顶点 Y 差 1.575e−7 m。该合入提交无 GitHub status／check run，不将本地通过写成远端 CI 通过。
- **原执行核查**：第 2／3 单元 Workflow 均 completed；CLI 分别于 2026-11-04 19:18:59／19:36:09 UTC 以 0 退出，工具 settled、pending 为空；780／757 个登记身份均 exited，PID 加创建时间存活匹配均为 0，收集回执 live 列表为空且无当前写者。第 3 单元对应 `cd5369a`，不是借用第 1 单元回执。外层 worker 的独立退出事件、退出码及准确时刻仍 unknown，不由 PID 消失补推。
- **未验证与路线边界**：未接入真实游戏，未看死亡剪影、未做整层场景同框评判，未部署，画面品质计分不变。原交付沿现成后台 bpy 5.2.3 重建；负责人云端未另跑实际 `.blend` 重建／源差检查，不能拿合成曲线测试代替。后台 Blender 属本卡脚本路线；未安装软件、未操作 GUI／浏览器／GPU。此次不改模拟，不新增对局品质结论。
- **下一步**：在独立采用单元中先固定旧源基线、同步所有 manifest／pin 和真实消费者回归，再于获准的实际游戏环境验整层画面中的死亡剪影与同框品质；通过前不宣称游戏动作已修复或画面改善。本卡不重复派发已收齐的源制作任务。
