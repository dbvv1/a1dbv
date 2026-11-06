# B-PIPE-MODEL-GUIDE-CORRECTION-20261106 · 纠正标准件二改操作页
id: B-PIPE-MODEL-GUIDE-CORRECTION-20261106
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bbb068cbdc97617856763414ace1d9d828b9c9d9
result_branch: relay/b-pipe-model-guide-correction-20261106

工作线：制作链。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
把已有模型批次读者回交转成读者能直接执行的准确页面，关闭“已采用”与候选状态、Blender入口及可复现范围的冲突；不再采集同题来源。

## 按哪个 Skill／规格
按 write-task-guide；先读 B-PIPE-MODEL-BATCH-READER-20261104 当前结果、FPS-Like@36fde4bb6a2e8f9652528fdea648d0a90190db79 的 standards-v1/{README.md,contract.json,style.json,models/manifest.json,tools/build.py,tools/asset_batch.py}，以及当前fa8740de消费者与docs/art-standards-validation.md。
1. 只整体重写 domains/game-dev/assets/3d.md 的 asset-family-rebuild 节：先给当前可执行入口、固定依赖与二改步骤，纠正源候选/可玩采用/视觉验收三种状态，不因历史adopted:false就推翻已核真实入口，也不将源存在当默认采用。
2. Blender 4.3.2 与 bpy5.2.3分开：前者历史云端实际重建证据保留原日期，后者只能引用卡上已交回观察。原relay 140bbae缺result.md，明确完整读者报告未落盘，不能引用不存在文件或补造命令/完整日志。
3. 写清改palette.plaster为palette.trim后墙/掩体变、灯不变；任一/末件失败保旧批与首次失败不发布。说明源码缺CLI、参数分隔与解释器入口须按作者README核，不凭猜测补bpyenv绝对路径。
4. GLB字节稳定、.blend/manifest非稳定及旧输入清单过时分别说明；只读provenance的2a789cc仍未接收，不把其工具写成main已存在，不改旧manifest让它看似当前。
5. 不执行Blender、重建/上传模型、改评分、扩正文其他部分。新增事实逐条回固定源码。

## 写入范围
仅 domains/game-dev/assets/3d.md 的 asset-family-rebuild 节（保锚点）；原读者卡、其他段落、TASKS与产物只读，原卡接收状态由 dot 另核后更新。

## 怎样算做成
非作者只读新节能指出确切入口/参数/产物边界与失败处理；固定来源有效，check_repo/check_public通过。原读者未解决观察与缺result保留，不标首次读者验收通过。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果

- 按 build 单元补齐 asset-family-rebuild 节三条审阅缺口：--output 以 standards-v1/ 为基准并列出被拒路径；二改判据改为同版本未改配方 GLB 基线，说明 bpy 5.2.3 与仓库 4.3.2 件字节数相同但 sha256 不同；新增 ART_PIECES 写死 76776/36492/10336 字节、loadArt 严格校验、替换 models 不同步消费侧会整批 fallback 的说明。锚点与三状态表、4.3.2/5.2.3 证据分离等既有内容保留。实测 git diff --check 通过；check_repo 878 文件 errors=[]；check_public 1411 文件 findings=[]；UTF-8/CR=0/LF=666。openIssues 为空。未运行 Blender/bpy 重建、模型上传、浏览器/GPU 或视觉验收，画面验收仍未完成。
- 产物：[0c13e02](https://github.com/dbvv1/a1dbv/commit/0c13e0215b8be53437ec403c42b42ce06a085c9a)，分支 `relay/b-pipe-model-guide-correction-20261106`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；独立审查通过。
- 下一步：负责人接收本清单并更新任务状态；非作者按新节复查后可安排视觉验收（本轮未做）。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
