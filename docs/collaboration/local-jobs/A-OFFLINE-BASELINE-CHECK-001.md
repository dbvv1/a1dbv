# 固定 main 的完整离线基线检查

id: A-OFFLINE-BASELINE-CHECK-001
owner: dot-A
status: blocked
accept: auto
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 7b775bbdac27af662f9291d1cba989196d4f75f6
result_branch: relay/a-offline-baseline-check-001

为维护者核对新公开 main 的原完整门禁能否在既有接收端环境完成，返回实际结果或具体阻塞，供 dot-A 决定恢复动作。

## 输入与写域

- 先读当前 AGENTS、operations §2.2／§3 与本目录 README；同 ID 或同范围已有活跃执行就接续或报告，不重复派发。
- 只用固定接收端按既有流程分配的隔离 worktree 和现有工具；不新开 Codex／电脑会话，不改接收端、权限、账号或设置。
- 受检快照 HEAD／tree 为 `base_ref`／`2022361efb9bf43fa7e9908ade8d860905676557`，检查前干净；领取分支已有任务卡或新提交时，在获配工作区建该 SHA 的临时 detached worktree 检查，不重置领取分支，结果回写原卡。不取回 held 候选，不随 main 前进换基线。
- 模型只回写本卡“当前结果”，状态字段按接收契约更新；不改源码、测试、文档正文或检查器，不部署、对外评论或新增报告。

## 执行与回传

- 仅运行一次原命令 `python3 scripts/check_offline.py`，由原入口先执行原 preflight。`python3` 入口不存在，或 POSIX、Python 3.11+、jq 等 `REQUIRED` 缺失时，准确记 missing／未运行；不安装依赖、创建 WSL／VM 或更换入口绕过。
- 原 19 阶段、现有 10 秒子测试与 120 秒阶段限时保持不变；不 skip、挑选阶段、增加限时、改阶段或运行模型 benchmark。原入口遇失败停止时，后续阶段如实记未运行。
- 完整 stdout／stderr 留在任务临时目录供本次独审核对，不提交或外发原始日志／环境。只访问公开仓库输入及本次输出，不读私人路径、会话、凭据或用量。
- “当前结果”只回公开摘要：固定 HEAD／tree、工作树状态、解释器版本及 OS 类型、开始／结束 UTC、逐阶段结果与测试 count／skip／exit；非测试阶段记不适用，未产出的数值记未知，不输出私人绝对路径。
- 失败或 missing 写具体阶段／缺项与恢复条件；全阶段通过才称该固定基线通过。此前旧主干与候选的云端完整门禁多次超时；本次核已删除计分脚本／测试的新公开基线，不修代码或放宽门槛。
- 沿用接收端既有原生 Workflow，核原日志、固定输入、摘要和未运行项；只可修正本卡结果表达，复审不重跑基线或修改受检代码。
- 接收脚本按现有契约暂存本卡，跑 `python3 scripts/check_repo.py`、`python3 scripts/check_public.py` 与 `git diff --cached --check`，读实际 diff；用 noreply 身份提交后扫描实际新增提交身份。检查和独审通过才自动接收结果文档，不能将文档接收写成基线或 held 候选通过。

## 当前结果

- 结论：固定基线 `7b775bbd`（tree `2022361efb9bf43fa7e9908ade8d860905676557`）在既有接收端环境未通过原入口 preflight，19 阶段全部未运行，不能称该基线通过；这是环境缺项，不是阶段超时。
- 执行：2026-10-26T14:53:55Z 至 14:53:56Z（UTC），在 `base_ref` 的临时 detached worktree 中运行一次 `python3 scripts/check_offline.py`；受检 worktree 运行前后均为干净（`git status --porcelain` 为空），领取分支未重置。解释器 Python 3.13.5（Windows 原生，`os.name=nt`）；OS 类型 Windows（MINGW64/MSYS）。
- 阶段：preflight 退出 2，标准输出为空；标准错误为 `BLOCKED: POSIX with /bin/bash is required by existing fixture tests`、`BLOCKED: missing required commands: jq` 和 `No phases ran; install nothing automatically.`。逐阶段结果：第 1–19 阶段全部未运行，测试 count／skip／exit 未知，非测试阶段不适用。
- 缺项与恢复条件：需 Python 报告 `os.name=posix`、`/bin/bash` 可执行，并且 PATH 中有 `jq`。不在本机安装依赖、建 WSL／VM 或更换入口绕过；满足后由 dot-A 决定在具备 POSIX 与 jq 的环境用同一固定 SHA 重跑同一条命令，并从第 1 阶段重新记录。
