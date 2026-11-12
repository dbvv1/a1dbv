# A-LONG-ROUTE-DRIVE-READER-20261112 · 接续 Hook 盘符兼容修复
id: A-LONG-ROUTE-DRIVE-READER-20261112
owner: dot-A
status: ready
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 3bb383389a100f8fca4e25afe361b493fdfa7a3c
result_branch: relay/a-long-route-drive-reader-20261112
page: docs/decisions/long-tasks.md@3bb383389a100f8fca4e25afe361b493fdfa7a3c

## 真实目标与输入
让复制 protect-paths Hook 的读者不会因 Windows 盘符大小写不同而漏掉已有项目相对规则。负责人已在固定基线实际调用脚本：规则 `deny dist/* generated`、根 `C:/Project`，file_path `C:/Project/dist/a.js` 返回 deny，而 `c:/Project/dist/a.js` 返回 exit 0 且空输出。这是现有盘符兼容入口的真实缺口；不是声称 Hook 构成安全沙箱。
本单元同时实用 long-tasks 当前页的交付与接回路线。新读者不得参与该页或本修复写作；方法指南只有 page 全文，可读项目指引、实现及现有测试。
接收端须把 page 的固定 UTF-8 全文原样附入模型任务正文，不用摘要或链接替代。页面 114 行、14622 字节，SHA256 `748a0cc548efd167027d3fc773ea7804ffec14dbb354dced220129f86c589d42`；记录实际交付哈希与首次阅读，不能确认则 blocked。

## 独立写域与保留行为
只改 `templates/generic/.claude/hooks/protect-paths.sh`，新增 `tests/test_protect_drive_case.py` 和 `reader-tests/A-LONG-ROUTE-DRIVE-READER-20261112-u1.md`；接收端另回写本卡。不要改既有 tests/test_protect_paths.py、答案页、地图、TASKS、其他卡或接收器。
只规范化绝对盘符字母的大小写；目录、文件名、规则 glob 和 POSIX 路径保持原大小写语义。保留其他盘符不属于本项目、相对路径/cwd、反斜杠、根盘符、缺路径、无规则及无效 JSON 行为。不扩展 UNC、符号链接、8.3 名称或原生沙箱能力。
负责人已核相关旧卡 accepted，远端未合分支未见 Hook 实现差量；既有测试文件有历史差量，本次不触碰。若领取时出现同修复或写域冲突，给出具体差量，不覆盖。

## 实施与消费者验收
先用固定旧实现证明不同大小写盘符漏匹配，再修复；新测试分别覆盖 C/c 两方向、file_path 与 cwd、正反斜杠、盘符根、跨盘不匹配、POSIX 与目录大小写不放宽、无效输入及缺路径。测试调用真正 Bash Hook，读 JSON 输出，不用复制实现冒充消费者。
用现有测试机制分别测 Python 和 jq 解析路径；环境缺 Bash/jq 时如实记未运行，不安装用户电脑依赖或换入口求绿。
实际运行 `python3 -m unittest discover -s tests -p 'test_protect*py'`；jq 可用时用 `TEST_PARSER=jq` 再跑。记录旧失败、新通过和直接 CLI JSON 输入/输出/退出码。Windows 完整 POSIX offline 无法运行时保留缺口，云端负责人接回后完成。
运行 check_repo、check_public、空白检查；模型不提交推送，接收端只推结果分支，回 review_ready；不用 accept:auto，不合 main、不修改权限配置、不部署。
读者只在新记录中写卡点、页外帮助、实现结果及未验层；非读者核真实 diff、检查输出及保留行为，不自动再盲读或发通过证书。

## 接回后的剩余目标
负责人通过已有心跳读取固定成果，独立运行完整 POSIX offline 与 CLI 消费者；若失败，同卡返工；通过后按发布流程整合模板并实际采用修复。保留回传、开始读取、独立验收启动与采用版本，不人为制造中断、不新增调度。
只有派发/领取不算执行，只有结果通知不算接收；单次真实接回也不证明长期可靠性。当前地图仍 🟡，按实际四段证据决定范围，不因建卡升绿。
共享最多4并发、最多1 GPU，本卡无需 GPU；由接收端现有容量机制领取，卡标签不证明空槽。普通单元最多2小时，失败保产物，按原合同核进程后续接，不重放未知调用。
