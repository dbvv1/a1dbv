# B-STAR-STREET-PLACEMENT-20261104 · 补同族街屋刚体放置适配
id: B-STAR-STREET-PLACEMENT-20261104
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 0bd62df9be7528cc9da643ebde089063d6166da8
result_branch: relay/b-star-street-placement-20261104

工作线：Star-Rush-Reborn。已接收 CPU 作者工具；场景接线与品质验收另行处理。

## 目标
把已接收三栋海岸住宅标准件接到可复用的道路站位合同，准备改善重复建筑与道路关系，不新造房屋或改现行场景。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §4。固定源 ab2655930996b9d81f5fb35469669c72b7be28e1 的 street.glb／manifest／adapter，三屋 A/G/M 已归一、脚底Y=0、门朝−Z；当前 master 的 circuitRoad 曲线帧只读。
接口 `placeStreet(parts, sampleRoad, centerS, side, setback)`，sampleRoad(s) 是当前 circuitRoad，返回 `{p:[x,y,z],h,T,R,curv,slope}`，T/R是水平基，p[1]才是高度；side仅−1/1，setback为非负米。每栋按原本地沿街X偏移查询道路帧，只作一次刚体平移/旋转，门朝道路；横向放置用共享基准偏移＋各房原pivot.z（A/M为0，G为+2m），side同时反映方向，保持原三栋纵深差；保持网格/材质和尺寸，不沿弯道拉伸墙檐。建筑世界XZ包围盒与该样段每1m道路折线各线段的最短距离须≥8m+setback，交叉记0；不能只按轴心或采样点算净空，违规返回具体房屋与原因。底部pivot落在对应station的p[1]，不要求坡地上整栋每个底点贴地，不新增地基或倾斜房屋。场景只读，输出显式房屋ID/矩阵用于后续接线。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `authoring/coast-street-placement/` 的 adapter、测试、固定源样本合同与 README；不改 scenery/circuit/engine/render、原content-set、capture/smoke、road-materials、地图、碰撞、默认入口。

## 怎样算做成
三原件实际解析；直线、左右弯、反向side、坏帧与负setback测试；全部矩阵有限、底部pivot高度一致、门朝路、原mesh哈希不变。做setback 4→6m的二改，只按同一站位R轴平移、旋转/尺寸保持；当前海岸320–680m样段只输出CPU放置与净空结果，不生成游戏截图、不声称场景已采用。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- **接收范围**：仅 `authoring/coast-street-placement/` 的 14 个固定源、适配器、测试和 CPU 报告文件。原结果 [c4813e9](https://github.com/dbvv1/Star-Rush-Reborn/commit/c4813e958fe65cc95b02bbe474ebf8ecb30d5d78) 经负责人独立核查，与最新 master 合入 [ab2e299](https://github.com/dbvv1/Star-Rush-Reborn/commit/ab2e299aee2e928e7048c138a3428a9975f237a3)。未改变游戏默认、场景或部署。
- **独立验证**：Node 24.22.1 下模块 25/25、`npm run build`、`npm test`（177/177 加后续客户端／API／入口检查）通过，零 skip；文件与提交公开扫描、差异检查通过。三份固定源文件与 ab265593 原 Git blob 哈希一致；三屋刚体、底部高度、门向、网格不变和 4→6 m 纯 R 平移合同通过。当前真实 `circuitRoad` 参与 CPU 核对；真实消费者为本目录报告与测试，游戏无该接口消费者。
- **净空边界**：报告每 40 m 独立取样共 20 行，4 m／6 m 最小道路净空为 12.010／14.005 m。另在 320–680 m 每 1 m、双侧共 722 行独立扫完整 280–720 m 道路折线：4 m 全过；6 m 纯 R 平移有 29 行如实返回违规，未发现误报成功，510/-1 为 13.967 m。20 行通过不能推广为整段连续布局。
- **布局未通过**：同排三屋在 4 m／6 m 各有 12/20 行世界 XZ 包围盒相交，实际顶点凸包相交为 8/20、9/20 行；600/-1 的 G/M 有 217／263 对三角面相交。相邻 640／680、side=+1 在 6 m 也有 19 对三角面相交。原卡只验道路净空，接收不表示房屋避碰合格。
- **剩余与下一步**：未接入场景，未跑浏览器／GPU／实机画面，也不宣称画面改善。下游接线前先增加同排及相邻行避碰、调整站位／间距，并检查每次 `shiftSetback` 的 `ok`／违规；接线后另做固定机位视觉与手感验收。
- **执行核对**：原实现调用正常退出，工具已完成且无活跃写者；本次只接收已确认的固定版本，未重开调用。云端复核复用现有同锁文件依赖，仅 CPU 命令行；不操作 FPS 拍摄、GUI 或 GPU。
