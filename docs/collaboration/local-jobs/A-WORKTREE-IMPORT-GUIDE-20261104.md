# A-WORKTREE-IMPORT-GUIDE-20261104 · 核对 Python worktree 的实际导入来源
id: A-WORKTREE-IMPORT-GUIDE-20261104
owner: dot-A
status: ready
kind: build
page: docs/decisions/long-tasks.md@4502d0471e073f8fddb065b0dd4ed6e2a14f144f
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 4502d0471e073f8fddb065b0dd4ed6e2a14f144f
result_branch: relay/a-worktree-import-guide-20261104

## 目标
直接改善 docs/decisions/long-tasks.md“按依赖决定怎么拆”的依赖准备说明，让并行开发 Python 项目的读者在认可测试前确认导入的是目标 worktree。现页只有通用隔离提醒；本轮补共享 editable 环境会让测试假绿的具体做法，不再建研究稿或罗列编排工具。

## 领取与独占写域
读 AGENTS、CLAUDE、TASKS、手册§7、operations§2.2／§3、local-jobs README 和 write-task-guide。领取前 fetch 最新 main 与负责人分支，核本页既有成果和实际写者；已有同项结果先接收，具体写者未核清就停，不另起重叠调用。
A-LONG-ROUTE-FOREMERGE-READER 原卡末段的负责人接收记录写明原 run 正常退出，结果与页面接收已在 main；该记录不证明其他工具、后代或正文写者均已退出。A-WORKTREE-ISOLATION-FACTS、A-MULTIAGENT-LONG-WIDE 旧调用退出未知，但只准写各自 artifact，不准写本页。本卡不接续、重做或解除它们的隔离，也不据此宣称所有历史写者已退出。
按现行协议先登记 running，再在本任务独立 worktree 写作；原接收端统一调度，不另开模型或调度器。

## 固定证据与写法
1. 已完成的窄机制复现（2026-11-04，Python 3.12.14）：真实 Git main／feature worktree、src 布局、setuptools PEP 660 editable 安装；main 的 VALUE=1，feature 改成 VALUE=0。借现有系统构建工具，无联网、凭据或服务。行为断言是 Python 子进程运行，不是 pytest／uv 或生产应用实测。
2. 从 feature cwd 用装有 main editable 的共享环境执行 VALUE==1 断言：exit 0，却由 main/src 导入；同解释器的 module.__file__ 解析路径断言 exit 1（WRONG_CHECKOUT）。独立环境 editable 安装 feature 后，来源断言 exit 0，行为断言 exit 1，暴露 feature 缺陷。独立环境仍借系统构建工具，不能写成完整依赖隔离证明；原始运行由负责人持有，正文仅保机制与必要范围，不复制私有路径／日志。
3. [y-agent 固定修订](https://github.com/luohy15/y-agent/commit/12d893faa7a9b1c6f3558a5a302fbf9bcc5d2827)记录共享 .venv／editable 路径问题并给根 uv 项目准备本地环境。只引用相关改动，不执行其 hook、删除命令或复制凭据共享做法；源码与模拟测试不等于本仓已运行该产品。
4. [uv 官方环境路径](https://docs.astral.sh/uv/concepts/projects/config/#project-environment-path)：默认 .venv；相对路径按 workspace root 解析，共用绝对 UV_PROJECT_ENVIRONMENT 会互相覆盖。给出项目适用的独立环境准备方向及实际解释器／目标包来源核对，不将切 cwd 或 uv sync --locked 单独当隔离证明。
5. [gflow-cli #760](https://github.com/ffroliva/gflow-cli/issues/760)是维护者报告的真实同类失败与临时 PYTHONPATH 修法；该 issue 已关闭，不能写仍开放或本仓已复现其全部发布流程。以上公开来源本轮核读日为 2026-11-04；保留来源原日期，不把读取日当发生日。

## 页面交付要求
整合既有段落，先给“每个开发 worktree 使用自己的环境，并用运行测试的同一解释器核目标模块来源”的可执行做法，再解释假绿原因；短示例用读者自己的模块与预期源码根替换占位。来源比较用解析后的路径归属，不以字符串前缀、cwd 或命令成功推定。确认来源只证明测对对象，之后仍运行项目行为验收。
限定这是 editable 源码开发／测试：验证发布 wheel 时应在干净环境安装指定构建产物并核其身份，导入 site-packages 正常，不能强制落在源码树，也不靠 PYTHONPATH 把 wheel 验收改成源码验收。
namespace package 的顶层 __file__ 可能为空且有多个位置，改核实际受测的具体子模块及必要的 __path__／spec 搜索位置；明确多来源是项目契约问题，不套单文件断言。现有窄复现未覆盖 wheel 或 namespace，不标实测通过。
保留本页整体 🟡 与完整路线未验项，不宣称模型优劣、并行速度收益或真实产品采用。避免扩大成 Python 教程、默认安装新工具、统一所有语言依赖规则或新增账本。

## 写入范围与执行限制
模型只修改 docs/decisions/long-tasks.md 的上述相关段落及其来源；接收端仅按协议回写本卡状态和当前结果。不改其他页面、模板、TASKS、旧卡、artifact、检查器、接收端或长期规则。
本机只用现有工具核文档与来源，不安装／更新依赖，不运行上游项目、hook、服务或旧调用，不改账号、权限、配置，不读私人历史。窄复现已有，不为本卡重新建实验；必要证据不可得则报告缺口，不能把自拟示例写成已运行。

## 怎样算做成
非作者只读修改后的整页，回答并指出页面依据：为什么正确 cwd 加绿测仍可能测错树；如何核当前测试解释器的目标模块；wheel 验收为何不能要求源码路径；namespace 顶层无 __file__ 时怎么办；哪些已有结果仍未验证。答不出即返工。
这是内容与操作语义审查，不冒充 write-task-guide 的第二个真实任务盲读或新生产采用；完整真实读者实做仍待具备任务时补验。按 build Workflow 并行核读者可用、事实链接和已有运行证据，不能由作者自评替代。
运行 python3 scripts/check_repo.py、python3 scripts/check_public.py 与 git diff --check；核实际 diff、原始来源和声称范围。只写实际通过／失败／未运行，检查结论留提交说明和本卡简短当前结果。
一个 45–75 分钟单元，最多两小时。模型不提交推送；接收端完成公开扫描与身份检查，仅推 result_branch、回 review_ready，由负责人接收。不用 accept: auto，不合 main，不发上游或部署。
