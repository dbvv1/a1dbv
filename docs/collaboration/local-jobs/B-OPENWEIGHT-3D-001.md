# B-OPENWEIGHT-3D-001 · 开放权重生成进入 MOBA 的一个路外岩簇

id: B-OPENWEIGHT-3D-001
owner: dot-B
status: ready
target_repo: dbvv1/MOBA-Like
base_ref: main@69d1588e62d4530a1eb5e3606b99e764fa9c7db5
result_branch: relay/b-openweight-3d-001

## 立项

读者是没有专职美术、要把开放权重生成用于实际游戏的程序员。
做成一个与现有暖石建筑／冷绿地面一致的低矮风化岩簇，替换基本战斗已有 `rock` 装饰；不把现成 KayKit 塔误称灰盒，也不为试模型重做已采用建筑。
结果须由现有 Three 消费者实际加载，在塔前交战镜头中比旧岩石有更好的不规则轮廓和接地感，且不遮单位；仅权重下载、导出成功或任务 ready 不算用上。

## 执行入口与选择

- 仅由既有本机接收端领取；先核本任务／结果分支有无已执行产物，接续而非重复生成。领取成功才改 `running`；不得新建 Codex 会话，不操作无关用户文件或改全局环境。
- 先读最新 a1 prompt／TASKS、产品 AGENTS／brief、`asset-pipeline/battle/README.md`，在独立环境核 RTX 5070 的实际可用显存及 PyTorch/CUDA 兼容；与音频生成串行占 GPU，不停其他进程腾显存。
- 首试 [TripoSG 官方代码](https://github.com/VAST-AI-Research/TripoSG)与[官方权重](https://huggingface.co/VAST-AI/TripoSG)：两者 MIT，官方要求至少 8GB（模型卡写 >8GB）；12GB 只是可尝试条件，尚无本机成功／质量结论。固定源码 SHA、权重 revision/hash、依赖版本再运行。
- 用自制有真实 alpha 的单物体输入，保原图及制作源／许可。目标为宽矮、三处不等高的大切面、少量自然裂隙，暖灰石＋极少暗绿苔斑；无文字、发光、旗帜、烘焙硬阴影或游戏截图。可用已有合法源辅助定风格，不能直接交回旧网格冒称模型生成。
- TripoSG 默认脚本还自动下载 RMBG-1.4；该模型不是同一 MIT 许可，本任务不用它。沿 `TripoSGPipeline` 做薄调用，输入已处理好的 alpha／白底合成图，不下载或初始化 RMBG；空／无效 alpha 明确失败，不能静默改走该权重。原始生成 mesh 保留，后处理另存。
- TripoSG 若实际显存／依赖失败，保准确异常后只比较独立低成本 [TripoSR](https://github.com/VAST-AI-Research/TripoSR)：官方源码与权重 MIT，默认单图约 6GB；用已构造灰底 RGB 与 `--no-remove-bg`，不另引背景模型。不要为跑通换成未核许可的 fork 或下载站。
- 更高规格对照只用于取舍：[TRELLIS.2](https://github.com/microsoft/TRELLIS.2)官方要求 24GB／Linux，不作为本次 12GB 默认；[Hunyuan3D-2.1](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1) shape 10GB、paint 21GB，且[许可](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/main/LICENSE)有地域范围，不默认采用。均未在本机运行；本项不做多模型排行榜。
- 单次真实制作最多两小时；合理降低分辨率／分块须记录效果，不靠无限重试。账号、付费、许可确认或明确访问拒绝即停该动作，写目标／原因／恢复条件；不换镜像、代理或凭据绕过，也不重试历史被拒 KayKit Adventurers 等资产。

## 独占范围与资产合同

- 只写产品 `asset-pipeline/battle/source/openweight-rock/`、`tools/openweight-rock/`、`exported/rock.glb`、manifest 的 `rock` 条目、相关 tests／README；如现有 `tools/build.py` 会覆盖此件，只改 rock 的源读取入口，其他生成函数不动。
- a1 仅回写本任务“当前结果”；不碰 TASKS、正文或锚点。产品 `src/`、sim／nav、灯光、角色与骨架／动作不动，不增碰撞，不改变摆放；其余 14 个 GLB 字节保持。
- 保现有 `id: rock`、URL、`kind: decoration`、`forward: +Z`、`groundY: 0`，名义高 1.1m、footprintRadius ≤1.2m；最大半径按所有顶点核，不用包围盒单轴冒充。装饰仍在路外，不能暗示可走区域里新增障碍。
- 单件 ≤2,000 三角形、≤2 材质、GLB ≤500KB；优先无贴图或一张 ≤512² 图集，粗糙非金属，无透明大面／特效。保持可重打光，不把模型细节噪声或面数增加当品质提升。
- 交输入图与可修改制作源、原始生成 mesh、实际采用 Blender 源、转换脚本、manifest 正确 hash／bounds／bytes／来源许可；不把模型权重、大缓存、私人日志或本机路径提交 Git。代码／权重／输入／输出权利分开说明，不自动把生成输出标为 KayKit CC0。

## 实际接入与接收

1. 在结果分支替换已有 `rock.glb` 并更新准确 manifest；沿现有加载与摆放运行，不新写展示台消费者。原始生成到简化／材质处理的步骤可复现，再做一次小改（如降低最高石尖）确认能局部重导，保其余 14 件。
2. 跑资产真实 GLB 检查、相关消费者测试与 web build；核正常／坏输入、尺寸／绕序／背面／地面接触、无外链纹理和资产加载／释放，记录实际失败，不删断言让候选过关。
3. 用产品实际相机、灯光、正常基本战斗取得旧／新同视角图，列最大的 1–2 处差距并针对同一件二改；LoL 是战斗可读参照，Thronefall 只辅助低多边形形色光。官方参考图只本地查看，不入公共仓库。
4. 回传实际 GPU 型号、峰值显存、推理／处理耗时、源码／权重版本及采用文件；没跑成功就写未完成。若本机无法取得实际游戏图，保资产工程候选并明确由云端产品 owner 补真图，不把离线 Blender 图当运行品质。
5. 只快进推 `result_branch`，不推产品 main、不部署；回写本任务为 `review_ready` 或带恢复条件的 `blocked`。产品 owner 实际接入评估后才决定采用／发布；未胜过旧件就保旧件，不强行为开放权重试验降低品质。

## 当前结果

`ready`：已核现有 CC0／脚本制作与场景正文任务，未发现同单元开放权重 3D 结果；尚未由本机领取，真实 GPU 执行、产物与运行品质均未知。下一步由接收端按同一 id 领取并执行，Git 文件本身不唤醒任务。
