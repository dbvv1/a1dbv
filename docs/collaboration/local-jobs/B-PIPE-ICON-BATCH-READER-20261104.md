# B-PIPE-ICON-BATCH-READER-20261104 · 双主题图标二改照做
id: B-PIPE-ICON-BATCH-READER-20261104
owner: dot-B
kind: reader-test
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-pipe-icon-batch-reader-20261104
page: domains/game-dev/assets/2d.md@463b4b9a95a8e6eadb98b730d8aa373a05dcbec0

工作线：制作链。本卡为独立排队单元，尚未认领。

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
