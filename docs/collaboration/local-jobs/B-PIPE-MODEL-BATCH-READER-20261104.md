# B-PIPE-MODEL-BATCH-READER-20261104 · 环境标准件二改照做
id: B-PIPE-MODEL-BATCH-READER-20261104
owner: dot-B
kind: reader-test
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-pipe-model-batch-reader-20261104
page: domains/game-dev/assets/3d.md@463b4b9a95a8e6eadb98b730d8aa373a05dcbec0

工作线：制作链。本卡为独立排队单元，尚未认领。

## 目标
核已落地制作链能否让新读者用真实资产做一次修改，并把卡点交回原页负责人。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `templates/generic/.claude/skills/write-task-guide/SKILL.md`；接收端附 page 全文。实际消费者固定 `FPS-Like@36fde4bb6a2e8f9652528fdea648d0a90190db79`，先核源码与既有产物，不用模型编造运行。
只读 asset-family-rebuild 节，在独立临时副本执行 FPS `assets/environment/standards-v1/tools/{build.py,asset_batch.py}` 与配套测试。实际任务：沿现有参数把 `style.json.palette.plaster` 改为同文件的 `trim` 色，重出完整三件批次（墙／掩体灰泥改变，灯仍原样）；再注入末件构建失败，核原采用批是否保持。只使用原配方和原几何规格，不加材质或新物件。允许使用已安装 Blender 以 --background --disable-autoexec 重建，不渲染、不安装；缺Blender只报该动作阻塞。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只提交 `docs/collaboration/local-jobs/artifacts/B-PIPE-MODEL-BATCH-READER-20261104/result.md` 与确有必要的最小复现输入；测试只在本卡临时副本。原页、原案例仓库、资源与其他任务只读，接收端另回本卡。

## 怎样算做成
正常二改墙／掩体与不变灯件的实际来源／输出对应、失败保旧批与首次失败不发布结果、第二次重跑一致性；三件原尺寸／拓扑／非目标参数保持。区分文档卡点与真实脚本缺陷，说明已有依赖范围；不把 CPU 成功写成游戏画面采用。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 原调用、工具或已登记进程尚未确认结束，保留产物与原调用身份，由维护者核清并解除本地隔离后接续；不自动重派。
