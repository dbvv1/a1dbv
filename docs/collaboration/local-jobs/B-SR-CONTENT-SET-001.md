# B-SR-CONTENT-SET-001 · 完整一局的成套内容标准件
id: B-SR-CONTENT-SET-001
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 1dd89d3931196cb08f7b9a00541a54a6715dfe1d
result_branch: relay/b-sr-content-set-001

执行归属（2026-10-27 16:02 UTC）：dot 云端完成原单元候选，接收端不再认领。沿用原任务与原结果分支；尚未接入游戏，不标 accepted。

执行边界（2026-10-27）：本机仅后台模型、命令行与文件处理；不打开交互浏览器／GUI，不控制桌面、键鼠或抢占前台。需要实际游戏操作或画面验收的部分交 dot 云端；不因此重启已有后台调用。

## 目标
让案例从占位原型走向能完整玩一局、角色与环境统一的作品。本单元交可接入的 3–5 件标准件和一页风格说明，不以素材清单或数量当采用。参照：地平线公路比赛的内容与质感，保留本作跑圈。

## 按哪个 Skill
读当前 a1dbv 的 game-content-production、game-quality-pass（domains/game-dev/templates/.claude/skills/），再读案例 AGENTS、brief、quality 与既有资产来源。玩法和公开数值量级按游戏细则§6，名字、地图、素材原创；先复用已取得的同族许可清楚套件，缺件再按 Skill 取得，不重做已完成供给。
从完整一局列角色、场景、材质、动作、特效、声音、UI 的类别和实际缺口；缩数量，不省类别。先用已有车辆／Suburban／道路资产做标准件：一辆完整车、一段公路与路肩、一组同族沿街建筑、一组沿线围合／植被。驾驶和 Rapier 候选由原单元处理，本项不调车控；音效清单区分引擎、轮胎、碰撞、环境与比赛提示。
锁定调色板、比例、材质族、机位下大小与加载预算；附可重跑归一脚本、逐件来源／许可和处理前后身份。现成资源优先，已有明确拒绝或权重阻断沿原任务恢复，不在本项重复。

## 写入范围
仅案例独立 worktree 的 docs/content-production.md、asset-pipeline/content-set/ 及该目录内产物／测试；不改 src、主循环、相机、现有资产、quality.md 或其他任务。回原 result_branch；不合默认分支、不部署。拍摄模式由云端另一单元实现，本项不重复实现，不与既有 GPU 任务同时占用图形会话。

## 怎样算做成
标准件能从实际来源重建、解析并满足预算，动作与材质契约可接进案例；做一次调色或比例二改验证整批可重跑。交固定 SHA、3–5 件实际产物、接线入口和缺口。按当前 build Workflow 独审与适用检查、公扫后回 review_ready。阵容图需接入本作光照后用真 GPU 拍，与标杆比；尚未取得该图就保留待接入状态，不把离线解析称品质定稿。接线、实际整局验收及发布由案例线接续。

## 交回候选

- 固定提交：[ab2655930996b9d81f5fb35469669c72b7be28e1](https://github.com/dbvv1/Star-Rush-Reborn/commit/ab2655930996b9d81f5fb35469669c72b7be28e1)，原 result_branch 已回读；仅 docs/content-production.md 与 asset-pipeline/content-set/，不含驾驶／拍摄文件。
- 四件实际标准：完整车、道路与分级坡岸、同族三屋、围合植被；每版 1,094,256B／8,786 三角。逐件原源／输出哈希、CC0 许可、动作与 stride-10 消费合同、整批调色二改均在该目录。
- 读者／来源／实际运行三路独审通过；Node 16/16、Python 6/6，八个 GLB 官方 glTF-Validator 全部 0 errors／warnings／infos。真实三轨 CPU 探针 167 段无翻面／非有限值，17 段按岸坡折叠门拒绝；153 对道路接缝位置一致，护栏仍有小接头缝。
- 公扫、提交身份与41文件差量核对通过；全仓文档检查保留 base 旧音频 SOURCE-README.md 缺 browser-decode-check.json 的既存错误，本批正文／JSON 无新增错误。该提交暂无 hosted CI run，不写 CI 通过。
- 待案例线接线：近邻岸坡裁切与海面接缝、候选车视觉轴距匹配、取消／迟到加载与回退，然后取得本作光照下的真实阵容／普通追尾画面并验完整一局。CPU 目录图不是实机；画面、声音、手感与硬件性能未验，未推 master 或 Site。
