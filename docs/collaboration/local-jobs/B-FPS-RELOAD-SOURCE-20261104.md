# B-FPS-RELOAD-SOURCE-20261104 · 找训练赛完整枪械动作源
id: B-FPS-RELOAD-SOURCE-20261104
owner: dot-B
kind: explore
status: running
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 36fde4bb6a2e8f9652528fdea648d0a90190db79
result_branch: relay/b-fps-reload-source-20261104

工作线：FPS-Like。本卡为独立排队单元，尚未认领。

## 目标
为训练赛现有敌人只有 head/spine/leg-l/leg-r/weapon 五个刚性组、没有独立肩臂/弹匣的真实缺口，寻找能承载跑动、蹲行与换弹的成套合法角色动作源，避免伪造“移动整把枪就是换弹”。

## 按哪个 Skill／规格
先读目标仓 AGENTS、brief、quality 内容清单及最新 a1dbv 规则，核同题产物和实际写者，不重做旧源包或 guard 材质。三条 A 缺回执只隔离原调用，不阻止本卡排队；由接收端按已确认可用容量执行。
按 a1dbv `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §3 与 `domains/game-dev/assets/animation.md`。基线为 main 的 relay-guard、content-set 及固定 b198df62a56f4c520716fbc9cb4afac47dd62213 的 buildEnemy/动作合同；旧源不替换、不重导。
只查 2–3 个成套来源：Quaternius 官方带武器角色/动画包、Kenney 官方套件、OpenGameArt 原作者明确许可的完整枪械角色包；其余来源须是作者原页。必须核实际下载成员/动作清单，不把视频中“看似换弹”当可编辑 clip。所需 idle/run/crouch/fire/reload/death、独立手臂/枪/弹匣及骨架合同逐项有/缺/未知；免费、可商用且允许随公开游戏提交派生资源才入候选。需登录、付费、无重分发许可、权重/已有403的入口不尝试。
比较是否可不刷权重、不人工补动画地接入当前 Three 0.186.1 和固定步长模拟。最多保留一件最强候选的必要公开小样与原许可用于真实解析（≤10MB）；不得从网上直接运行脚本或安装依赖。找不到可用成套源也是结果，说明缺的是哪些动作/权利，不用新生成占位补数。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `asset-pipeline/character-action-sources/` 的 sources.md、许可与最多一件必要小样/CPU解析报告；不改旧源包、src、训练适配卡目录、guard候选、游戏入口或拍摄。

## 怎样算做成
每候选给原作者/许可原文/固定文件身份/骨架和逐动作清单，明确原许可覆盖代码、模型与动画的范围；若有小样，用既有 GLTFLoader 验真实节点/skin/clip，不将解析等于姿势合格。给出最少改动的推荐来源或明确“无满足条件来源”，附下一次需 dot 选择的缺口。不得自造 reload clip 或宣称已经游戏采用。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- explore 单元已执行完毕并产出 10 个新文件（无已跟踪文件改动，HEAD 36fde4b）：sources.md（23 个来源族、238 项候选逐项有/缺/未知、许可与 Three 0.186.1+固定步长接入判断）、CPU-PARSE.md、LICENSES.md，以及 KayKit 同一候选的 4 个 GLB 小样（5,088,516 B，SHA-256 与来源记录复核一致）与 2 份许可原文。结论：无免费、可商用、可随公开游戏再分发且同时具备 idle/run/crouch/fire/reload/death+独立手臂/枪/弹匣+零改接入的来源；最强候选 KayKit（CC0，Knight.glb 实测 76 clip/41 骨/15 mesh）无枪/弹匣且需新增 skinned 消费者；Mesh2Motion 动作最全但源为 .blend、导出需浏览器；Quaternius 存在 QAL v1.0 再分发冲突。openIssues：审查 pass=false，(1) sources.md 第 17/77/271 行把 Mannequin_F.fbx 写成 GLB 同目录，实际位于 Female Mannequin/Unity/；(2) 第 78/42 行把骨架节点 Reload_end 当作 clip；(3) 第 89 行称 UAL2 43 clip“全是”近战/跑酷/农活/僵尸。未验证：GLTFLoader 实际加载（node_modules 缺失且任务禁止安装依赖）、KayKit itch 免费档是否含 CombatRanged、Quaternius CC0 与 QAL 冲突的最终解释、姿势/接触/镜头质量。未提交、未推送。
- 产物：[b52037b](https://github.com/dbvv1/FPS-Like/commit/b52037befddfbbaf8962366269fffe521ecef65e)，分支 `relay/b-fps-reload-source-20261104`。
- 检查：check_public（文件与新提交身份） 通过；独立审查未通过或未完成。
- 下一步：负责人先裁定 sources.md §7.2 的 A–F 决策（重点是否批准新增 skinned 第三人称消费者与调整 700 ms 合同），并由人工修正上述 3 处文档错误后再推 review_ready；审查未通过前不应视为验收完成。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
