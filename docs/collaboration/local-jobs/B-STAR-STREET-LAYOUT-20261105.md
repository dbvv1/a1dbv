# B-STAR-STREET-LAYOUT-20261105 · 筛出不重叠海岸街屋布局
id: B-STAR-STREET-LAYOUT-20261105
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: ab2e299aee2e928e7048c138a3428a9975f237a3
result_branch: relay/b-star-street-layout-20261105

类别：游戏细则 §7 的模块编码单元，接口与检查已定；沿既有本机接收器排队。

## 目标
已接收的 placeStreet 只验道路净空，原 20 行中有同排和相邻排房屋相交。制作保守、可复现的 CPU 布局筛选器，为后续接线提供不相交候选；不修改或美化游戏场景。
接续 [原街屋卡](B-STAR-STREET-PLACEMENT-20261104.md)，不重做三栋源模型、原 adapter 或原已完成调用；不处理车辆标准件读者任务。

## 按哪个 Skill／规格
按 a1dbv domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §4 与固定源 authoring/coast-street-placement/{README.md,adapter.mjs,fixed-source-contract.mjs}。只调用已接受 parseStreetStandard、placeStreet、shiftSetback、localXZHull，不复制第二份放置算法。
1. 新目录接口 planStreetRows(parts, sampleRoad, rows, minGap=0.5)，只负责调用 placeStreet，再委托 checkPlacedStreetRows(parts, placedRows, minGap=0.5)。后者接收 placeStreet/shiftSetback 的既有结果，校验并保留原矩阵、ok/violations，共用下述筛选，不得重新 placeStreet。rows 每项 {centerS,side,setback}，side 只能 -1/+1，setback 非负有限，minGap 非负有限；重复 centerS/side 组合拒收。
2. 将 rows 按 centerS 升序、side -1 在前稳定处理，每行用 placeStreet 取得原三栋。道路 ok=false 整行拒收。将每栋真实 localXZHull 按原 4×4 矩阵变为世界 XZ 凸多边形，不能只用轴心或 AABB 判合格。
3. 同排任两栋、当前排与全部已接受排任两栋的凸多边形相交/包含/边界接触均拒收；不相交时以全部边段最短距离比较 minGap，距离不足拒收。整行接收或拒收，不删单件凑三件齐全，不移动、缩放或拉伸房屋。这是保守足印合同，不冒充完整 3D 三角面碰撞。
4. 返回 {accepted,rejected}，接受项保留原 placement 矩阵/道路净空，拒收项给 row、house IDs、road-clearance/footprint-overlap/footprint-gap 原因及数值。同一输入无墙钟/随机数、序列化 LF JSON 两次字节一致。
5. 用原真实 circuitRoad 与固定帧样本交叉核 320–680m、每40m、双侧的20行。分别执行 setback=4 和 setback=6；此外把4m结果逐行 shiftSetback(+2) 后重新检查整批，510/-1不在40m网格，另作独立道路回归；600/-1同排及640/680 side=+1邻排另单独核相交，后者不能只查最终accepted集，因为整行可能已先被同排检查拒收。不能把两轮筛选得到的不同接受集合说成纯R平移全通过。
6. 测试覆盖直线/左右弯、两侧、相交/相离/包含/仅接触、相邻与非相邻行、缺输入/NaN/坏矩阵、重复行、输入未被修改、网格和材质哈希不变。真实固定20行至少存在非空接受集，否则诚实交回，不放松0.5m门槛凑结果。
7. 仅 CPU 与文件处理。开工核同题现有调用、结果分支和实际写者；有已启动任务只核原调用，不重放。复用已有依赖，缺项交回，不安装软件，不开浏览器/GUI、音频或 GPU。

## 写入范围
仅新增 authoring/coast-street-layout/ 的 layout.mjs、test.mjs、report.mjs、README.md 和公开相对路径 JSON 结果。原 coast-street-placement、content-set、circuit/scenery/engine、地图、碰撞、默认入口、capture/smoke 全部只读；不复制或上传 GLB/.blend。

## 怎样算做成
模块测试与真实固定道路报告通过，所有接受行保持原刚体与道路净空且全布局凸足印间距至少0.5m，拒收原因可复算。重跑原25项街屋测试及根 npm test/build，明确通过/失败/未运行，不以 CPU 合同称游戏场景改善。
经既有 Workflow 非作者审查、公开扫描/提交身份与 diff 检查，只推结果分支回 review_ready；不合 master、不部署。

## 当前结果

- 接收：负责人在独立云端修复并接收最终代码快照，[a9e8181](https://github.com/dbvv1/Star-Rush-Reborn/commit/a9e8181c719a85cec72d5ced6fccfdcf7ab1c099) 已快进合入 master。唯一 parent 为 ab2e299；差量仅新增上述五文件，未引入原结果提交的父链；原 relay 分支仍为 84dd5ff，未改写。
- 修复：逐项校验矩阵全部16槽；每排必须完整匹配传入 parts 的 ID 集合；旋转数值接触在 minGap=0 时也拒收，间距比较不再减去容差。原三项独立复审缺陷均关闭。
- 实测：布局34/34、原街屋25/25、根 npm test 177/177及后续客户端/API/入口/来源选择检查、npm run build 均退出0；报告两次重生成均与原 JSON 字节一致。复用既有云端依赖，未安装软件。
- 独立复审：7536组旋转/平移接触无零距离误收，180组不同 yaw 顶点接边全部拒收，36组严格门槛与原12项正常边界通过。
- 公开检查：五个新增文本0发现、0跳过，提交身份与 diff 检查通过；全树238个文本0发现，但40个既有非文本跳过，不称全仓完整扫描通过。2026-11-05 20:20 UTC 精确接收提交的 Actions/check-runs 均为0，没有远端 CI 通过结论。
- 未关闭：原本机 Workflow、CLI、工具和登记进程的退出终态仍未知，未触碰或重派。本卡 accepted 仅指独立代码快照已接收，不证明原调用已退出。旧结果历史已公开且仍未清理，不能把当前文件净化或新主线提交称为已撤回暴露。
- 范围：仅 CPU 保守足印作者工具，未接入游戏场景、未部署；浏览器、画面、GPU、音频及 smoke 未验收。道路净空信任未经篡改的既有 adapter 结果，不重新认证人为改写的值。
- 后续：旧公开历史风险单独处理；本卡接收不授权改写历史、强推或删除分支。原产出由本机既有 Workflow 执行，本次接收、修复和复验均在独立云端。
