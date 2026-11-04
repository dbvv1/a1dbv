# B-MOBA-VEYRA-DEATH-CONTACT-20261104 · 修 Veyra 死亡动作地面接触
id: B-MOBA-VEYRA-DEATH-CONTACT-20261104
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: b489ed38592dc184fffe2ab9b3b186441c7dc9bb
result_branch: relay/b-moba-veyra-death-contact-20261104

工作线：MOBA-Like。本卡为独立排队单元，尚未认领。

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

- 本单元修正 Veyra death-contact README 的测试计数（24→26）并补充 AdoptionDocTests 说明，同时把 pin 检查测试改为从 default-source-manifest.json 读取 sharedAssets sha256 并校验步骤 3 的 64 位 pin（缺失/格式错误/过期均失败）。实测 26 tests OK；审查者复跑 check_contact reproduce 两队 reproduced=true、0.01/0.005 容差 passed=true、build_candidates --check-only exit 0、content-set 7 tests OK；git status 仅 README.md 与 tests/test_checks.py 两处修改。未验证：npm test/build/sim（无 node_modules 且不允许安装）、游戏内死亡剪影与同框品质（禁浏览器/GPU，需人工）、check_source_bpy（本单元未改 source/GLB，默认 python 无 bpy）。openIssues 为空。
- 产物：[cd5369a](https://github.com/dbvv1/MOBA-Like/commit/cd5369af66732b24622b178eb6bd54b6e3485edf)，分支 `relay/b-moba-veyra-death-contact-20261104`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：负责人：1) 按 brief 与公开参照人工并排验收游戏内死亡剪影/同框品质；2) 在有 node_modules 的环境跑 npm test、npm run build 与 npm run sim 对照目标区间；3) 判定源重建使用本机 bpy 5.2.3 与接收边界（3D 资产只用 gen3d/glbprep）的差异是否可接受。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
