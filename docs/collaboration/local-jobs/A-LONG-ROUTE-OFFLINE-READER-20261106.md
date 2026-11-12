# A-LONG-ROUTE-OFFLINE-READER-20261106 · 照长任务路线修门禁范围
id: A-LONG-ROUTE-OFFLINE-READER-20261106
owner: dot-A
status: accepted
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 8b76f7db4940cb5923438ad91275b66c1bd0a6d3
result_branch: relay/a-long-route-offline-reader-20261106
page: docs/decisions/long-tasks.md@8b76f7db4940cb5923438ad91275b66c1bd0a6d3

## 当前接收决定（2026-11-12 UTC）

**限定接收（`accepted`）**：fcc32b8代码／真实npm消费者已由39032d41接回，POSIX 21/21及20阶段551例通过，原Windows失败保留。4cd9cc21仅为旧页8b76f7db一次定时接回，不是当前页无人值守或自然离开后恢复，旧记录升绿判断不适用现页。

本节按[既定逐项去向](../archive/completed-through-2026-11-12.txt)回写，取代下文旧状态与续派安排；历史产物和验证记录保留。本卡已收口，不再等待接收端回写或自动重派。原结果分支不变，既有未验范围及隔离另行保留。

## 目标与真实输入
本轮第一优先：让本仓完整离线检查只把仓库自写 Shell 脚本列为语法阶段，不把已安装 node_modules 中的第三方脚本算成本仓门禁。由未读过本页、未参与页面或此补丁写作的新读者，照 page 完成真实修复、检查和可接回交付；不得复用旧 Foremerge／context 读者上下文。
固定 base_ref 的 `scripts/check_offline.py` SHA256 为 `b5113b9dec140556ac3fc200f94007e0621241c74dc65fb7e9ed119ce7fa0872`。当前 `phases()` 只排除 .git；本仓真实依赖 pino 9.14.0 的 `inc-version.sh`、thread-stream 3.2.0 的 `test/ts/transpile.sh` 被列为 Shell syntax 阶段。二者实际 bash -n 都通过，缺口是检查归属，不是已证语法失败。
本仓 `scripts/check_repo.py` 已将 node_modules 作为安装依赖范围排除；这次只对齐 Shell 发现的该边界，不扩展其他忽略目录或重写检查架构。

## 接收端输入与运行约定
按 reader-test 原生 Workflow，新任务目录只用本卡公开输入。接收端须从 page 的固定提交读取 UTF-8 全文，原样附到实际模型任务正文，不能用链接、摘要或旧页代替；记录固定提交、页面字节数与 SHA256；本次全文为 11374 UTF-8 字节、102 行，SHA256 `2b3d207aeca2e41b5351dea365ef16fa79830f03ba582c2d29e707e67f7974bf`。全文未交付或新读者独立性不能确认就 blocked，不先运行后补认。
方法指南仅为附入的 page；可读项目指引、当前源码／相关测试及下列公开依赖文件。不给读者旧验收结论、其他任务轨迹或预写补丁；不让读者改答案页。
先同步 main 与负责人分支核同题卡、已交结果及本卡写域；本卡两代码文件由负责人预留给本机，云端不另做实现。若已有同修复或写者归属不清，交确切差量／缺口，不覆盖、不重复派发。
沿原接收端共享最多 4 并发、最多 1 GPU；本卡不用 GPU，优先于本轮来源核对卡。当前 Git 的 0 running 不是空槽证明，只按接收端已有领取与单写者机制执行，不读任务正文外的宿主元数据或私人会话，不新建调度器。
使用本任务已有 Python 与项目工具；不在用户电脑安装／更新软件或依赖，不修改环境、账号、权限、接收器或配置。需要项目之外的新能力时保留环境卡点，不偷换测试入口或绕过拒绝。

## 允许的改动与保留行为
只修改 `scripts/check_offline.py`、`tests/test_check_offline.py`，并新增 `reader-tests/A-LONG-ROUTE-OFFLINE-READER-20261106-u1.md`；接收端只另回写本卡。
根目录与嵌套目录中的精确 node_modules 分量均须排除；`node_modules-guide` 等相似名称和其他仓库自写脚本仍应发现。保留 .git 规则、其他阶段、命令参数、稳定排序和没有 Shell 文件时的行为。
新增回归先在固定旧实现失败，再在候选通过；涵盖根／嵌套依赖、相似名称与真实自写脚本保留、.git、空集合。正常、失败及缺输入行为仍按原项目契约，不靠删断言、skip、缩小有效检查或换受测源码求绿。
不改其他脚本、依赖声明、锁文件、模板、页面、地图、TASKS、旧卡或历史 reader 记录；不恢复 Memos QA、旧广扫或其他取消任务，不联系上游、不部署。

## 真实依赖消费者
无需安装：可从下列官方 npm 发布包只读取指定普通文件，先验包的 SHA512 integrity，再验文件 SHA256；不执行生命周期或依赖脚本，不整包解压、覆盖项目或从用户其他任务环境取文件。
- pino 9.14.0：`https://registry.npmjs.org/pino/-/pino-9.14.0.tgz`，integrity `sha512-8OEwKp5juEvb/MjpIc4hjqfgCNysrS94RIOMXYvpYCdm/jglrKEiAYmiumbmGhCvs+IcInsphYDFwqrjr7398w==`；只取 `package/inc-version.sh`，SHA256 `1973f56cf0d4ae52e152629888e771e583f70e6d03812b952fb11c14cccbb23f`。
- thread-stream 3.2.0：`https://registry.npmjs.org/thread-stream/-/thread-stream-3.2.0.tgz`，integrity `sha512-zLBvqpwr4Esa0kRjcrzGU6zL25lePWaCLMx0RQFrmteozIfeNdaMLpG5U7PeHzvlFkAWaRKA9/KVW4F60iB+qw==`；只取 `package/test/ts/transpile.sh`，SHA256 `5115d49cbc73a9ef3a64b1854d25f878cf5eebc9367f1a7876f5a49d69fbb35b`。
在本任务临时输入树按实际 node_modules 包路径放这两份原字节，用真正的旧／新 `phases()` 读取，不执行其中 Shell 内容；列出两版阶段及差量。只有这两文件的输入树，旧版为 8 个基础阶段＋2 个依赖 Shell 阶段；候选应保留 8 个基础阶段。补独立自写脚本控制，确认不是全部禁用 Shell 检查。
下载或完整性核验失败只停该消费者；保留本地代码／回归结果和精确缺口，真实依赖消费者交云端原负责人接收后完成，不伪造文件或绕被拒入口。合成回归与真实包字节消费者分报。

## 验收、接回与终点
本机实际跑可用的受影响测试、`python3 scripts/check_repo.py`、`python3 scripts/check_public.py` 与空白检查，留命令、结果、代码版本和输出摘要。Windows 不支持的 POSIX 进程组测试或完整 offline 预检分别记失败／未运行，不把函数探针、选定子集或云端旧结果称为整套通过。
非读者核实际 diff、输入来源、旧失败／新通过与保留行为；遗漏退回同卡，不自动再派一个“新读者”。结果记录本轮首次页面卡点、页外帮助、环境限制与实现遗漏，区分“页面能指导”与“环境未完成”。无页面卡点写无，不给页面发通过证书。
模型不提交／推送；接收端扫描文件及提交身份后只推 result_branch，回 review_ready；不用 accept: auto、不合 main。普通单元通常 60–90 分钟、最多两小时，沿原恢复合同保全，不重复起始调用。
负责人取得固定结果后在云端独立接收，重放真实依赖消费者、完整 POSIX offline 及受影响失败路径，再串行合入 main、回读精确提交与内容；这属于同一目标的后续阶段，不能在本机回合结束时宣布全部完成。
本卡支持实做和跨环境接回证据；无自然唤醒与无人值守连续接续的真实证据，仍保持该部分待验，不以派发、接收、提交或本卡完成直接将地图标绿。

## 历史结果（接收决定见页首）

- reader-test 本轮观察结束并交负责人接收：在固定提交 8b76f7db 上完成实现与本地可跑验收。scripts/check_offline.py 的 Shell 发现改为按精确路径分量排除 .git/node_modules，保留排序、8 个基础阶段、命令参数与空集合行为；tests/test_check_offline.py 新增 3 个回归。本地复跑 21 用例 20 通过、1 个既有 Windows os.killpg error（非本次引入）；check_repo 879 文件 errors=[]、check_public 1411 文件 findings=[]、git diff --check 均 exit 0；真实消费者 pino 9.14.0 与 thread-stream 3.2.0 旧实现 10 阶段、候选 8 阶段且基础阶段逐项一致。taskDone=true；pageStuck 4 项：reader-test 独立性未获页面例外、Windows 无法跑完整 POSIX offline（缺 /bin/bash 与 jq）、页面不含本次具体改法与边界、Git Bash 临时路径交给原生 Python 的自误已用 cygpath 恢复。未运行验收：完整 POSIX offline 预检被 BLOCKED、exit 2、零阶段，需 POSIX 环境重放。openIssues：记录把任务文件嵌入副本的行号当成页面行号（写成第 74/126 行，页面实际为第 30/82 行），引用文字与结论不受影响。未提交、未推送。
- 产物：[fcc32b8](https://github.com/dbvv1/a1dbv/commit/fcc32b8e72096c9b7d88a132f3181f40c8472340)，分支 `relay/a-long-route-offline-reader-20261106`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人需在 POSIX/云环境重放完整 scripts/check_offline.py 全量阶段（含 jq），并决定是否修正读者记录的行号引用；本单元三份产物已在工作树，待接收端扫描后提交。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
