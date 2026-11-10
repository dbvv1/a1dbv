# B-STAR-FENCE-SUPPORT-20261110 · 海岸围栏刚体落地候选
id: B-STAR-FENCE-SUPPORT-20261110
owner: dot-B
kind: build
status: ready
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 409868b028a38006658a5202d952a1784ffce3ed
result_branch: relay/b-star-fence-support-20261110

工作线：三个案例。对应内容计划 S2 围栏/灌木标准件，采用者 dot-B；不是新旁置入口。

## 目标
既有六灌木已入原 coast 候选；两根长围栏因斜坡脚端浮空/埋地延期。本单元产能在原完整地形上安全落地的刚体围栏位置，不扩模型或改地形遮掩问题；随后由 dot-B 接同一个 coast 开关并在原拍摄槽恢复后验图。

## Skill 与精确规格
按 domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §3–5（a1dbv 最新 main）及本项目 docs/quality.md 阶段目标。
1. 固定源 assets/coast-verge/verge.glb，SHA-256 0479af55bd3bcc937739aa49648ce4ecc41d739279d548af28ead8df7b433d15；许可证含 FENCE-LICENSE.txt。复用现有 decoder 识别两根 fence；六 bush 不在本单元范围，原源不改、不重传。
2. 新接口 planFenceSupports(parts, model, sampleRoad, samples, rows)；rows 是 {s,side,setback}，有限 s、side 为±1、setback非负；非法/重复行拒收。保原几何比例，仅允许沿道路 yaw 与整体 Y 平移，不能拉伸、翻面、倾倒或修改地形。
3. 对每根真实源 mesh 的水平足印遍历 model 网格覆盖单元的全部顶点；沿用 vergeTerrainRange 的保守整格取值方法。水平刚体底边取最小高度减0.02m；高差超过0.18m或落水直接拒绝。这是一种保守拒绝方案，不宣称任意坡面均可放。
4. 对 samples 每段真实道路检查整个足印最短距离≥12m；距 model.street 所有住宅足印≥1m；两围栏互相及已有灌木距离≥0.5m。不改变原场景装饰，遇未能证明净空的已有物件候选宁拒绝并报原因，不能删除旧物件让它通过。
5. 返回 accepted/rejected（partId、row、矩阵、地形min/max、各类最小间距、拒绝原因），固定输入两次JSON字节相同。固定真实 coast 320–680m、步40m、双侧、setback24m，仅作为候选搜索，不强求非空接受。没有合格位置如实交回，不能放宽阈值。
6. 覆盖平地/斜坡/阶差/水面/越界/道路边界/街屋碰撞/重复行/NaN/源字节不变；另真实源与实际完整 model 跑一次。测试仅CPU，不使用GPU、浏览器、桌面或拍摄槽。

## 写入范围
仅新增 authoring/coast-fence-support/{plan.mjs,test.mjs,report.mjs,README.md} 及报告JSON。coast-verge-runtime.mjs、coastal-space.js、scenery.js、所有源资源、模拟和默认入口只读。不要复制第二套 decoder/terrain。

## 完成与接收
提交可复跑放置产物和真实拒绝原因；根测试/构建与相关作者测试区分通过、失败、未运行。非作者复验边界、源身份与净空；公开扫描后只推结果分支，回 review_ready。dot-B 接收后才接原候选；硬件同机位图、完整 smoke 和盲评未过不计分、不计覆盖、不换默认、不部署。
开工核同题真实调用与写者；同题活跃只读取，原未知任务不清锁、不重放。云端可做即云端做，本机不安装工具。当前仅 ready，不声称执行中。
