# B-FPS-CONTENT-SET-001 · 完整一局的成套内容标准件
id: B-FPS-CONTENT-SET-001
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: a97d57281dd6c6d941c6a6bef732dadf2953f2f4
result_branch: relay/b-fps-content-set-001

执行边界（2026-10-27）：本机仅后台模型、命令行与文件处理；不打开交互浏览器／GUI，不控制桌面、键鼠或抢占前台。接线与画面验收由案例线按当前游戏细则§7安排；不因此重启已有后台调用。

## 目标
让案例从占位原型走向能完整玩一局、角色与环境统一的作品。本单元交可接入的 3–5 件标准件和一页风格说明，不以素材清单或数量当采用。参照：CS2 的完整战术射击回合。

## 按哪个 Skill
读当前 a1dbv 的 game-content-production、game-quality-pass（domains/game-dev/templates/.claude/skills/），再读案例 AGENTS、brief、quality 与既有资产来源。玩法和公开数值量级按游戏细则§6，名字、地图、素材原创；先复用已取得的同族许可清楚套件，缺件再按 Skill 取得，不重做已完成供给。
从完整一局列角色、场景、材质、动作、特效、声音、UI 的类别和实际缺口；缩数量，不省类别。角色与场景先补：一个第一人称手臂＋武器组合、一个敌方全身角色、一段可读的通路／掩体建筑、一个命中反馈标准件。武器和角色动作清单必须包含待机、移动、射击／受击、换弹和死亡中各自适用的项；不要把无手臂的几何枪认作角色完成。
锁定调色板、比例、材质族、机位下大小与加载预算；附可重跑归一脚本、逐件来源／许可和处理前后身份。现成资源优先，已有明确拒绝或权重阻断沿原任务恢复，不在本项重复。

## 写入范围
仅案例独立 worktree 的 docs/content-production.md、asset-pipeline/content-set/ 及该目录内产物／测试；不改 src、主循环、相机、现有资产、quality.md 或其他任务。回原 result_branch；不合默认分支、不部署。拍摄模式由云端另一单元实现，本项不重复实现，不与既有 GPU 任务同时占用图形会话。

## 怎样算做成
标准件能从实际来源重建、解析并满足预算，动作与材质契约可接进案例；做一次调色或比例二改验证整批可重跑。交固定 SHA、3–5 件实际产物、接线入口和缺口。按当前 build Workflow 独审与适用检查、公扫后回 review_ready。阵容图需接入本作光照后用真 GPU 拍，与标杆比；尚未取得该图就保留待接入状态，不把离线解析称品质定稿。接线、实际整局验收及发布由案例线接续。

## 当前结果

- **已接收标准件源包**：[b198df6](https://github.com/dbvv1/FPS-Like/commit/b198df62a56f4c520716fbc9cb4afac47dd62213)，分支 `relay/b-fps-content-set-001`。四件 GLB 合计 296,144 B；来源、许可与确定性配方已复核。尚未进入可玩客户端，未取得真 GPU 阵容图或整局品质验收，不计作案例采用／品质定稿。
- **格式修复复核通过**：NORMAL 已声明 `KHR_mesh_quantization` 为 used／required，NORMAL／COLOR_0 使用 4 字节 stride。云端对四件实际字节重跑 Khronos validator 2.0.0-dev.3.10，均 0 errors／0 warnings；唯一 info 是通路预留纹理槽的 `TEXCOORD_0`。来源文件及许可未变，四个来源 SHA 与 spec 相符。
- **可重建与加载通过**：云端 15/15 内容测试（含确定性重建和调色／0.95 缩放二改）、3/3 官方 validator 回归通过；另以 16 个仅内存的扩展缺失／stride 复发负例确认拒收。Three 0.186.1 实际加载四件并采样 13 段动作，无加载警告。制作端原报根测试 93/93 与 build 通过，本轮未重跑根套件。
- **接线要点**：静止挂点取 `gltf.scene.userData.restMount`，`weaponPose` 仍由运行时计算；通路的 13 个碰撞盒、modules、dimensions 只在 scene userData，加载后网格组名为 `passage-cover_1`。命中件加载后根名为 `hit-feedback_1`。敌方仍是五个刚性组、无蒙皮／独立弹匣；手臂袖子、反馈时钟、通路坐标转换与离线寻路烘焙由消费者接续，不能据解析通过认定接线完成。
- **检查与下一步**：独立源包复核、公开内容与提交身份扫描、补丁空白检查通过。案例线接入后按游戏细则§7安排单个 GPU 任务，再做同机位阵容与整局验收；本卡不新开制作或拍摄任务。
- 执行：本机接收端 Claude Code＋DeepSeek 原生 build Workflow 制作；dot 云端独立接收。
