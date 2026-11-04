# B-STAR-STREET-PLACEMENT-20261104 · 补同族街屋刚体放置适配
id: B-STAR-STREET-PLACEMENT-20261104
owner: dot-B
kind: build
status: ready
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 0bd62df9be7528cc9da643ebde089063d6166da8
result_branch: relay/b-star-street-placement-20261104

工作线：Star-Rush-Reborn。本卡为独立排队单元，尚未认领。

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
