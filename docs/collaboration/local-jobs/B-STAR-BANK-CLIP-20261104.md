# B-STAR-BANK-CLIP-20261104 · 补标准路段外岸裁切
id: B-STAR-BANK-CLIP-20261104
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 0bd62df9be7528cc9da643ebde089063d6166da8
result_branch: relay/b-star-bank-clip-20261104

工作线：Star-Rush-Reborn。本卡为独立排队单元，尚未认领。

## 目标
把已接收公路标准件的已知近邻岸坡重叠缺口做成独立 CPU 适配，供后续场景接入；不改当前空间候选或截图基线。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §4。固定源 ab2655930996b9d81f5fb35469669c72b7be28e1 的 `asset-pipeline/content-set/adapter.mjs`、recipe 与 road.glb；当前 master 的 circuit/coastal-space 只读。原 road 长24m、沥青宽16m、连岸44m，bendRoadParts 已有曲线映射；本卡只补源说明明确未做的近邻路段保护裁切，不重做原映射/标准件。
先从固定 `build.py::make_road` 的 levels 循环生成精确侧带：仅包装该循环调用 Producer.quad 产生的192个外岸三角，按原 Producer.output 的 sorted family 顺序映射到原 GLB/adapter 三角索引。原导入道路直接走 triangle，标线另为 marking，不纳入外岸。重放原生成器到本卡临时输出并核 road.glb 字节完全一致，侧带记录源/输出哈希与索引，不修改原生成器。
接口 `clipOuterBank(parts, bankTriangleIds, protectedCorridors)`：parts 为原 adapter 输出，bankTriangleIds 为上述哈希绑定侧带；protectedCorridors 是 `{id, points:[[x,z],...], halfWidth:8}` 数组，在世界XZ平面；调用者明确排除当前24m标准段与前后紧邻标准段，只传其他近邻段。每条折线相邻点构成无端帽延伸的宽16m矩形带，按稳定id/段号依次对外岸三角做差；重叠带允许，零长段/非有限输入拒绝，不能只测采样点距离。侧带先绑定bend前原GLB，原bendRoadParts保持三角顺序，bend后再裁切。仅这些外岸三角允许裁切，沥青、标线、护栏和所有非岸顶点不动。三角边界按原平面插值位置/法线/色，拒非有限/零长保护段；返回新数组与裁切统计，不修改输入。不能按颜色猜材质区，也不通过扩赛道或挪模型掩盖重叠。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `authoring/coast-bank-clip/` 的 helper、固定源导入脚本、测试、最小CPU样本与 README；不改 engine/render/scenery/circuit/coastal-space、原content-set、road-materials、capture、smoke、build 或默认场景。

## 怎样算做成
真实原 road.glb 经原 adapter 后跑无相交、回头弯近邻、边界切线、坏帧/缺分区四类；无相交逐字节保持、受保护沥青不变、结果有限无退化/反向面。二改保护半宽8→8.5m只影响外岸，邻段接缝和海面相接仍逐项说明。侧带索引错配／源哈希漂移必须拒收；不声明实机岸坡质量通过。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。
