# B-PIPE-MATERIAL-REUSE-READER-20261104 · 共享材质失败清理照做
id: B-PIPE-MATERIAL-REUSE-READER-20261104
owner: dot-B
kind: reader-test
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-pipe-material-reuse-reader-20261104
page: domains/game-dev/assets/materials.md@463b4b9a95a8e6eadb98b730d8aa373a05dcbec0

工作线：制作链。本卡为独立排队单元，尚未认领。

## 目标
核已落地制作链能否让新读者用真实资产做一次修改，并把卡点交回原页负责人。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `templates/generic/.claude/skills/write-task-guide/SKILL.md`；接收端附 page 全文。实际消费者固定 `MOBA-Like@b489ed38592dc184fffe2ab9b3b186441c7dc9bb`，先核源码与既有产物，不用模型编造运行。
只读 quiet-material-family 节，真实任务是在隔离副本依据页面定位 MOBA `src/render/quiet-family.ts` 与现有测试，完成一次实际消费者二改：在隔离副本把一个新的第二建筑实例接到已有 quiet 共享纹理，复用原加载/释放入口，不复制纹理、不覆盖旧实例。在这一改动后运行正常加载、第二张失败、注册中途异常、销毁后迟到完成四路；新增实例被移除时仍存活的第一实例不得失去纹理，最后退出时每资源只释放一次。临时副本的最小变更片段随报告交回，不改原生产逻辑，不复跑同机位图。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只提交 `docs/collaboration/local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/result.md` 与确有必要的最小复现输入；测试只在本卡临时副本。原页、原案例仓库、资源与其他任务只读，接收端另回本卡。

## 怎样算做成
每路记录实际被调用的加载次数、释放所有者和回退结果，明确模拟依赖与真实 CPU 消费边界；按页面回答“为何不是每楼一纹理、何时可释放、失败后玩家保留什么”。返回第一处照做卡点或无卡点，不靠阅读者经验补文后称成功。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。
