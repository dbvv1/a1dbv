# B-STAR-CAR-STANDARD-READER-20261104 · 核既有车辆标准件当前接线
id: B-STAR-CAR-STANDARD-READER-20261104
owner: dot-B
kind: reader-test
status: running
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 0bd62df9be7528cc9da643ebde089063d6166da8
result_branch: relay/b-star-car-standard-reader-20261104
page: domains/game-dev/assets/3d.md@463b4b9a95a8e6eadb98b730d8aa373a05dcbec0

工作线：Star-Rush-Reborn。本卡为独立排队单元，尚未认领。

## 目标
用已有车辆标准件和当前车辆状态做一次真实 CPU 接线照做，明确外观轴距差异在哪里需要调整，避免直接替换后轮不贴地。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `templates/generic/.claude/skills/write-task-guide/SKILL.md` 与所附 3D 页的 source/consumer 做法。源固定 ab2655930996b9d81f5fb35469669c72b7be28e1 的 `docs/content-production.md`、car.glb、manifest、adapter.mjs；当前 master 的 racer、road-vehicle-core、engine 只读。任务是仅依据页面与源README，把原 poseCar 接到当前实际 player.roadSteer／wheelSpin／roll／bob，并从固定公开测试夹具取得直行、左弯、右弯、复位四种状态。
在独立临时副本调用既有 adapter 与原 engine CPU Mesh 路径，不实现第二套适配器。检查作者声明轴位±0.858m与当前物理轴位的差异、四轮半径/触地点、+X朝向与Y-up、前轮转向/后轮不转向、复位后的rest TRS。读者只记录卡点和准确不兼容处，不调物理、碰撞或镜头迁就外观。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只提交 `authoring/car-standard-reader/result.md` 与必要的最小复现输入；原生产文件与既有 content-set、拍摄、街屋／岸坡适配卡目录均只读，不修改模型或消费者。

## 怎样算做成
四状态的实际节点矩阵／轮触地点、源码合同与真实结果对应、是否可按文接线及第一卡点。必须区分渲染轴距与物理轴距，不能因 CPU 矩阵有限称外观合格；相机遮挡、驾驶手感和新车采用留 dot 判断。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。
