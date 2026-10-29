# A-SKILL-TEMPLATE-READER-20261029 · 将已定路线同步到通用模板入口
id: A-SKILL-TEMPLATE-READER-20261029
owner: dot-A
status: ready
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 017a3363db3294f11e6f4965869bfac426569c44
page: docs/decisions/skills-and-plugins.md@dot-a/skills-round-20261029
result_branch: relay/a-skill-template-reader-20261029

## 目标与验收
用户已要求将 Skill／插件主推荐同步 templates；当前 task-decisions §3 已更新，但通用 AGENTS 与模板 README 仍缺按真实任务采用项目已有相关 Skill 的入口说明。完成这项剩余同步，保留既有工作流和配置，不重复实现 §3。
按 write-task-guide 与 reader-test 原生 Workflow，把规格和 page 指定页面全文交未参与写作的新读者，只照此页选择路径；项目指令、所选 Skill 正文及页内直接引用可读，不给作者解题过程。
独占写域仅 templates/generic/AGENTS.md、templates/README.md，以及 docs/collaboration/local-jobs/artifacts/A-SKILL-TEMPLATE-READER-20261029/result.md；接收端只另回写本卡状态与当前结果。不要改答案页、Skill、配置、脚本、TASKS 或其他任务。
验收：入口与指定页路线一致，已有匹配配方按任务采用、没有匹配项照常完成；task-decisions 仍仅用户显式调用或指定读取，普通任务不走完整决策流程。保留原命令、权限、拒绝规则与配置，不新增安装、网络服务或发布权限。
运行 python3 scripts/check_repo.py、python3 scripts/check_public.py、python3 -m unittest discover -s tests -p test_template_overlay.py -v 和 git diff --check；读者以外的验证者核实际 diff、命令结果、旧链接和原调用/权限边界，不只接收自报。
结果写实际选了什么 Skill／已有工具、调用正文证据与任务结果、卡点及新增步骤；手动读文件据实记，名称可见不记加载成功。未走到的能力分支保留未验，不推全套净收益。
不改本机接收脚本、不读私人会话或账号用量、不新开收费入口；单元最多两小时、无 GPU，由接收端按共享四并行领取，不超过共享一 GPU；本任务不用 GPU。结果交指定 relay，回 review_ready，不用 accept: auto，不合主分支。
接收端按 page 字段附固定页面全文；相对链接按 docs/decisions/ 目录解析。若页面未附或版本不符，记输入阻塞，不自行补历史稿。

## 当前结果
已准备排队，尚无领取或执行证据；页面分支核对为 `017a3363db3294f11e6f4965869bfac426569c44`。接收端领取时记录实际页面提交；若与上列核对值不同，先回输入卡点、不静默换版。按共享最多四任务、最多一 GPU 调度，本任务不用 GPU；同题旧调用未明先核状态，不重复执行。
