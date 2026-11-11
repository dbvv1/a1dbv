# B-PIPE-ICON-BATCH-READER-20261104 · 双主题图标二改照做
id: B-PIPE-ICON-BATCH-READER-20261104
owner: dot-B
kind: reader-test
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-pipe-icon-batch-reader-20261104
page: domains/game-dev/assets/2d.md@463b4b9a95a8e6eadb98b730d8aa373a05dcbec0

工作线：制作链。本卡固定读者结果已按下方窄范围接收，不再排队。

## 目标
核已落地制作链能否让新读者用真实资产做一次修改，并把卡点交回原页负责人。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `templates/generic/.claude/skills/write-task-guide/SKILL.md`；接收端附 page 全文。实际消费者固定 `MOBA-Like@b489ed38592dc184fffe2ab9b3b186441c7dc9bb`，先核源码与既有产物，不用模型编造运行。
只读页面的 icon-family-rebuild 节，在独立临时副本执行 MOBA `asset-pipeline/icons/` 的现有 export.py/test_export.py。实际任务：把 recipe 中深色主题重点色改为现有浅色主题的重点色，完整重出六类图标，再模拟最后一个源 self-shield.svg 缺失；记录旧整批是否保持。源许可与非目标文件保留，不覆盖真实 exported。不得修改页面或原导出器。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只提交 `docs/collaboration/local-jobs/artifacts/B-PIPE-ICON-BATCH-READER-20261104/result.md` 与确有必要的最小复现输入；测试只在本卡临时副本。原页、原案例仓库、资源与其他任务只读，接收端另回本卡。

## 怎样算做成
既有 36 个运行文件与预览的完整产物清单；正常二改、缺源失败、首次无旧批失败三个真实结果；旧批哈希和 exit code。记录页面是否提供足够操作及遇到的第一处卡点。依赖不可用写具体缺项，不声称照做成功。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- reader-test 一轮观察完成。已按 icon-family-rebuild 节取固定消费者 MOBA-Like@b489ed38 的 asset-pipeline/icons，核到六类图标、36 个运行文件（12 SVG+24 PNG）及 SHA-256 清单，聚合 8efcb6680f0ad1a65fb99d325020fc76653124e39773a9b26df45f39fb792a47；dark.accent 由 #70E6E1 改 #086E85 后 validate 通过，原配方复现 12/12 已入库 SVG，改后 bright 6/6 不变、dark 6/6 变化且 MIT 通知保留；test_export.py 15 项 3 过 12 错 exit 1。真实 CLI 三个场景均被缺 CairoSVG 阻塞（正常二改、缺源、首次无旧批皆 exit 1），另用显式标注 stub 复核控制流：缺 self-shield.svg exit 2、旧批 36 文件哈希不变、首次失败无最终目录。taskDone=false：PNG 与 preview 未生成，36 运行图逐字节一致未验。pageStuck 共 6 条：页面未写 Python/Cairo/CairoSVG 运行前提且本机缺依赖无法安装；固定 commit 无 preview.png 且被 gitignore；PNG/预览逐字节一致无法核；真实缺源分支被 render() 首行 import cairosvg 提前挡住；节内未给六类图标名、配方键、颜色值与最后一个源；安装运行命令只在被链 MOBA README。openIssues：Windows 下 Path.write_text 将 SVG 写为 CRLF，用同一 stub 完整成功导出 0/12 与入库字节相同，故页面逐字节一致在 Windows 不成立，且在装好 CairoSVG 后 test_export.py 的 read_bytes 断言仍会失败；读者把本地 main 落后误述为固定 commit 不在默认分支，实际上游 main 即 b489ed38；result.md 只给 16 位哈希前缀，完整 64 位留在未提交 scratch，交付物自身无法复核完整清单。本轮不自动重读，交负责人接收，不代表目标验收通过。
- 产物：[dcba386](https://github.com/dbvv1/a1dbv/commit/dcba386ed2005b8da84d798851863850be286922)，分支 `relay/b-pipe-icon-batch-reader-20261104`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；非读者核对有未解决项或未完成，交负责人接收。
- 原交回建议（已由下方裁决取代，不再排原卡补验）：负责人处理：(1) 提供或预装 CairoSVG 2.8.2 与系统 Cairo 后按同两只场景重跑 export.py，先核 36 文件哈希与 preview 960x400，再核缺源失败时旧批原字节保持；(2) 在 icon-family-rebuild 节补运行前提、六类图标名/配方键/色值/最后一个源、安装运行命令及 Windows CRLF 对逐字节一致的影响；(3) 修正读者记录中固定 commit 与上游 main 关系的误述。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 11-11 产物去向结清

只接固定 `dcba386` 读者记录中的 Windows SVG 换行反例；它已促成产品 [5267080](https://github.com/dbvv1/MOBA-Like/commit/526708097b1c2c72ad826789e277797b1f49d785) 的 LF 修复，并进入[图标制作正文](../../../domains/game-dev/assets/2d.md#icon-family-rebuild)。后继真实 Cairo 重建与实际消费者证据属于修复验收，不倒写首次读者通过。原缺 Cairo、PNG／预览未重出、16位哈希及 stub 仅验控制流均保留；读者把本地落后误述为上游状态的说法不采用。其余未证结论本轮不收，不再要求原卡重读或补验。

本卡 `accepted` 仅指上述固定产物的窄用途，不证明原 Workflow／CLI／外层执行退出。原终态 unknown 与执行隔离保留，不清锁、不释放槽位、不重派或重试受拒入口。
