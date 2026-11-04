# B-PIPE-MODEL-BATCH-READER-20261104 · 环境标准件二改照做
id: B-PIPE-MODEL-BATCH-READER-20261104
owner: dot-B
kind: reader-test
status: review_ready
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

- reader-test 一轮完成：读者在固定提交 36fde4bb 的独立临时副本用 bpy 5.2.3 实跑，改 style.json 的 palette.plaster 为同文件 trim 色后墙/掩体 GLB 更新、灯逐字节不变，三角面/包围盒/材质/非目标参数保持；第一、第二、末件导出失败均 exit 1 且 models 整目录逐字节不变、无 .models.build-* 残留，fresh 首次失败不创建输出，恢复后重跑 GLB 一致；test_asset_batch 12/12 通过，test_build_integration 因本机无 blender CLI 在 assertIsNotNone 阻塞。非作者核对独立复现上述结果，taskDone=true；但 6 项 page 卡点未关闭（Blender 4.3.2 逐字节复现不可得、README 的 blender 入口不可执行且未写 bpy 模块与 -- 分隔、页面写『已采用』与 contract.json/manifest adopted:false 及页面自身候选表述冲突、页面只写第二件失败而非任一件/末件、.blend 与 manifest 非逐字节确定且 Windows 产出 CRLF、已提交 manifest inputs 记旧 build.py 哈希且未列 asset_batch.py），另有 3 项读者遗漏（未引用页面自相矛盾与 art-standards-validation/environment-candidate 证据、把缺 style.json 的平凡成立当保旧批证据、复跑命令未写明 bpyenv 解释器），故 reviewed=false。未验：Blender 4.3.2 下与既有产物逐字节相同、真实 SIGKILL/断电、游戏画面/GPU/视觉采用。
- 产物：[140bbae](https://github.com/dbvv1/a1dbv/commit/140bbae1a241ed0deebc0a187fd1010568e6a4a8)，分支 `relay/b-pipe-model-batch-reader-20261104`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人决定 result.md 缺失的处理（固定脚本未产出，按外层要求未额外写文件），并将 6 项 page 卡点与 3 项遗漏交回 3d.md 原页负责人；4.3.2 逐字节复现、真实断电与画面验收需另行安排环境。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
