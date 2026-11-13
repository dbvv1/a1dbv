# A-LONG-ROUTE-BASH-READER-20261113 · 接续原生 Windows Hook 测试入口
id: A-LONG-ROUTE-BASH-READER-20261113
owner: dot-A
status: review_ready
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 4564ed0c5d446159aaebe0d3ffd43bb24f97c3e8
result_branch: relay/a-long-route-bash-reader-20261113
page: docs/decisions/long-tasks.md@b05cb560cd37ba0a248e9a5f624da62ddfced28e

## 真实目标与新读者
让已有 Git Bash 的原生 Windows 开发者能从 Python unittest 入口运行 Hook 回归，准确知道指定的解析器是否真的被测试。上一项盘符修复已接收；其实际 Windows 检查暴露旧夹具固定 /bin/bash 的启动错误，本项解决剩余测试入口，不重做盘符修复、不复活 .git 规则任务。
负责人刚完成另一项同类真实接续：从 Windows 固定成果补三份 Hook 一致性、POSIX 双解析器及消费者检查并采用到 main；本项留给未读过当前 long-tasks 页、未参与该页或盘符任务的新读者独立完成。
接收端须将 page 的 UTF-8 全文原样附入模型任务正文，不能只给链接或摘要：119 行、15490 字节、SHA256 cba106f395cb95438b36412653f171b34fa58d8461d3f8f3562da54f1f6c9af8。读者记录收到的全文哈希与首次阅读；不能确认新上下文或全文则 blocked，不冒称盲读。
只照该页组织工作；可读本项目约定、当前实现与测试，不读旧 reader-tests、旧任务回执或从它们抄流程。任务所需已知事实均在本卡；页末历史链接无需打开。

## 写域与保留行为
只修改 tests/test_protect_paths.py、tests/test_protect_drive_case.py；允许新增 tests/hook_test_support.py、tests/test_hook_test_support.py，以及 reader-tests/A-LONG-ROUTE-BASH-READER-20261113-u1.md。接收端另回写本卡。不要改 Hook 产品、规则副本、答案页、README、TASKS、其他任务或接收器。
共享夹具可在这两套用例间抽取；保留现有所有行为断言、三份模板一致性、真实 subprocess 与解析器追踪。不要为了通过删测试、捕获所有错误或用 JSON 模拟替代真实 Hook。
负责人 fetch 全部远端后核未合分支：四条 11-04/05 老分支的同文件差量是历史 .git-file 规则测试，不是本次启动修复，不 cherry-pick、不覆盖。当前仅 B FPS 卡标 running，进程活动无法从 Git 判断；本项与其写域、浏览器和 GPU 无关。领取时仍要核最新差量，冲突交回，勿接管旧树。

## 验收及步骤
1. 先跑当前真实 unittest 入口，保留实际错误与环境事实，不使用旧回执代替复现。记录 Python、Bash、解析器可用性（不记录本机绝对路径），不安装依赖或修改用户电脑设置。
2. 为两套 Hook 测试提供一致的 Bash 选择：显式 BASH_UNDER_TEST 优先，其次已有 bash；指定无效路径、缺 Bash、启动失败必须给清楚失败，不能当测试通过。POSIX 原入口保持适用。不要改变 scripts/check_offline.py 的 POSIX 依赖要求或零测试/skip失败门禁。
3. 保持 TEST_PARSER=python3/jq 的后端隔离；不能用混合 PATH 宣称指定解析器通过。使用已有可执行文件，处理原生 Windows 无 symlink 权限与 Git Bash 路径转换；做不到则明确记录具体阻塞，不能开权限、装工具或改用户接收器。未安装 jq 如实未运行，不能当双后端已验。
4. 对启动选择、错误/缺失输入、后端隔离（含同时可见两后端时仍选对）、UTF-8 JSON 和含空格的测试目录补回归；测试真实 Bash 与 JSON 输出。解析器失败后有输出也应 fail-closed，现有测试不能退化。
5. 先显式设置 TEST_PARSER=python3，再实跑 python -m unittest discover -s tests -p 'test_protect*py'，记录所选后端；已有 jq 时显式设置 TEST_PARSER=jq 重跑；新增夹具测试单跑。直接 Hook CLI 测正常 deny、无匹配及无效 JSON，写退出码与输出。Windows 完整 POSIX 门禁交云端补，不把本机 error/skip记成通过。
6. 运行 check_repo、check_public、git diff --check。读者只记录卡点、页外帮助、真实改动与检查，不改页面、不先写通过证书。非读者核 diff 与原始输出后回 review_ready；不用 accept:auto，不合 main。

## 接回与终点
负责人在既有心跳接回固定成果，复查 Windows 命令与输出，实跑 POSIX 双解析器/夹具回归及完整 offline，核真实消费者，必要时同卡返工；通过才采用并按发现修页。地图仍🟡，不以派发、领取或单次脚本通过代替新读者采用/长期可靠性。
本卡无需 GPU；接收端共享最多4并发、最多1 GPU，按现有容量机制领取，不假称已知空槽。普通单元最多2小时，退出不明不重派、不造中断、不新建调度。保留固定结果和失败证据；返回→开始接收的时间仅有两端事件才计算。

## 修改要求 · 最终版本原生 Windows 补验
本轮沿原卡续接，不重做实现、不重新盲读。此前 accepted 适用于已采用成果；本次只补最终云端修订的原生 Windows 证据。以 base_ref 的最终测试文件为准，不直接使用旧 relay 分支的 ccd15c9 版本；在原分支合并最新 main，保留旧结果历史。
只允许新增 reader-tests/A-LONG-ROUTE-BASH-READER-20261113-windows-final.md；不改上述测试源码、Hook、页面或其他卡。真实复跑发现失败就保留输出交回，勿擅自修补或安装工具。
1. 核四份测试／夹具与 base_ref 字节一致，记录相对文件名及 SHA256。只用已有原生 Windows Python、Git Bash 和解析器，不以 WSL／POSIX 代替原生 Windows。
2. 原生 Windows 显式 TEST_PARSER=python3，运行原卡步骤5的 test_protect*py（预期42项）和 test_hook_test_support.py（预期13项），分别保留退出码、实际数目、skip及失败原因；不可仅写“通过”。已有 jq 才按 TEST_PARSER=jq 重跑，没有则明确未运行，禁止安装或假装双后端。
3. 核最终新增回归真实执行：显式参数／环境变量优先级、相对 Bash 选择在后续 cwd 改变前绝对化。补一次真实相对路径集成：在任务临时目录引用已有 Bash，用相对 BASH_UNDER_TEST 启动测试，再由夹具切到含空格临时项目；必须保留命令形状、退出码及输出。不要求复制／修改安装目录或提权，无法构造就记具体缺项。
4. 单独附脱敏终端原始输出，替换个人绝对路径与用户名，保留测试名、计数、skip、错误类型和退出码；非读者核该输出与文件哈希。check_repo、check_public、diff检查后交回 review_ready，不合 main。
这次补验只闭合实际采用后的跨系统缺口，不新增“首次读者”通过，不凭一次运行提升长期稳定性。负责人接回后核输出与固定文件，再更新本卡接收范围。

## 接收决定
2026-11-13 dot-A 接收 ccd15c9：保留原生 Windows 双人复跑记录，云端补双后端与完整 POSIX 门禁；补显式 Bash 优先级可判别回归、修正 symlink 注释，并修复独审发现的相对 Bash 路径跨 cwd 失效。共享夹具实际进入本仓测试入口，不修改 Hook 产品。地图记录新读者接续采用，长期稳定性仍待验；原始输出仅记录中所列，未提供单独完整日志附件，不冒称云端复跑 Windows。

## 原始交回结果

- reader-test 一轮观察完成。taskDone=true：实跑 TEST_PARSER=python3 python -m unittest discover -s tests -p 'test_protect*py' 退出 0，42 例 OK 无 skip（修复前同命令退出 1、errors=108、skipped=8，均为固定 /bin/bash 启动的 FileNotFoundError）；新夹具 12 例 OK（1 skip），显式 BASH_UNDER_TEST 下盘符 8/8 OK；check_repo、check_public（0 发现）、git diff --check 均退出 0。pageStuck：页面 §4 未说明原生 Windows 下 Hook unittest 入口可在 Git Bash 跑、只有完整 offline 门禁需 POSIX；页面未写原生 Windows 的 Bash 选择与隔离前提。未运行验收：完整 POSIX 离线门禁未跑（check_offline 退出 2 BLOCKED，本机非 POSIX 且缺 /bin/bash）；jq 后端未验证（jq 未安装，TEST_PARSER=jq 无法运行），既未安装也未用混合 PATH 或 JSON 模拟冒充。openIssues：1) test_explicit_bash_is_selected_over_path 传的显式值与 PATH 同一二进制，改为忽略 BASH_UNDER_TEST 后 12 例仍 OK，优先级无可判别回归；2) tests/hook_test_support.py 模块注释称原生 Windows 通常无法创建 symlink，与实测（可创建、Git Bash 执行报 127）不符；3) jq 双后端与完整 POSIX 门禁仍待补跑；4) 页面可补一句原生 Windows 入口前提。
- 产物：[ccd15c9](https://github.com/dbvv1/a1dbv/commit/ccd15c9d7462b55591c337cae1c4448d7c368630)，分支 `relay/a-long-route-bash-reader-20261113`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人处置 openIssues：补一条能判别 BASH_UNDER_TEST 优先级的回归（显式值与 PATH 用不同二进制），修正 hook_test_support.py 关于 symlink 的注释；在有 /bin/bash 且装有 jq 的 POSIX 环境补跑完整离线门禁与 jq 后端；读者记录与两份原测试保持现状，不自动重读。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 当前结果

- taskDone=true：按卡末节以 base_ref 4564ed0c 的四份测试文件为准，SHA256 4/4 一致；原生 Windows（Python 3.13.5、Git Bash 5.3.15，未用 WSL）显式 TEST_PARSER=python3 实跑 test_protect*py 退出0/Ran42/OK无skip，test_hook_test_support.py 退出0/Ran13/OK(skip=1，jq未装)，相对 BASH_UNDER_TEST 集成退出0/Ran13/OK(1 skip)，直接 Hook CLI deny/无匹配/无效JSON 退出0/0/1，变异验证两条新增回归可判别(errors=2、failures=2)，check_repo 969/errors=[]、check_public 1578/findings=[]、git diff --check 均0。未运行验收：jq 后端未跑(未安装、未用模拟)、完整 POSIX 离线门禁未跑(check_offline 退出2 BLOCKED)。openIssues：1) u1.md 被整份重写超出「只允许新增 windows-final.md」写域并删掉上一轮非读者核对节(可从 ccd15c9 恢复)；2) windows-final.md §3 变异计数写成12通过1skip，实为11通过1失败1skip；3) 记录 check_repo=968 未覆盖最终树(复核969)；4) §0 差量方向 4564ed0c..HEAD 写反；5) 未执行卡末合并最新 main，工作树为 tests 取 base_ref 的混合状态。pageStuck：页面未写基线晚于 HEAD 时如何取受检文件、如何证明新增回归可判别、相对 Bash+cwd 集成配方，以及补验轮不适用 §3 三项交接检查。
- 产物：[f2d71ad](https://github.com/dbvv1/a1dbv/commit/f2d71ad14005fd907eab6ea5d259ac69677adf4a)，分支 `relay/a-long-route-bash-reader-20261113`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人处置：决定恢复 u1.md 至 ccd15c9 或仅追加本轮段落；修正 windows-final.md 的计数与差量方向；按分支流程合并最新 main 后在最终树重跑 check_repo/check_public；在 POSIX 环境补跑 jq 双后端与完整 offline 门禁。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
