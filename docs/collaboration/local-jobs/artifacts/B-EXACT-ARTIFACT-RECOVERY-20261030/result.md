# B-EXACT-ARTIFACT-RECOVERY-20261030 · 既有代码产物只读核查

核对时间：2026-10-30T11:12Z 至 12:04Z（UTC）。范围：接收端登记的 dbvv1/FPS-Like、dbvv1/MOBA-Like 克隆，及其既有任务产物目录。全程只读：未 checkout、未 fetch、未解包、未运行候选代码。

## 结论

- **FPS-Like guard：not_found。** 目标提交 `4ff5202a4022f691b5f6620e641f0977c7055fd7` 与原 tree `9b104237bd2ab0073307e969afa51d26ab7a0f11` 都不在接收端 FPS-Like 克隆的对象库，也没有 ref 指向该提交。登记范围内未发现 git bundle，因此无法比对已知 bundle SHA256 `05035cd674f13bfe2dfe996eb75df7e29474698c57471dcc7d8f0496e2a800a6`，`git bundle list-heads`／`verify` 也没有可执行对象；不主张 bundle 完整。
- **MOBA-Like feel：not_found。** 目标提交 `d5b5c15188620554c89634ae7ba6475c6b1bd95d` 与原 tree `b29bb33822319220eae42346549009f7284c6599` 同样缺失；仓内、任务工作树和运行目录的 before／after 嵌套副本都没有这两个对象或 git bundle。登记范围内没有 bundle，已知 bundle SHA256 `624697f048acc3fa6af7690f8b364fffbc8cae78c75da68d117cfae8e97805f4` 无法比对（未执行）；`git bundle list-heads`／`verify` 同样没有可执行对象。

两项结论都只覆盖接收端已登记范围，不是整机不存在；原执行环境和云端未查。

## 目标与结果

| 项目 | 原提交 | 原 tree | 结果 |
|---|---|---|---|
| FPS-Like guard | `4ff5202a4022f691b5f6620e641f0977c7055fd7` | `9b104237bd2ab0073307e969afa51d26ab7a0f11` | not_found |
| MOBA-Like feel | `d5b5c15188620554c89634ae7ba6475c6b1bd95d` | `b29bb33822319220eae42346549009f7284c6599` | not_found |

## 实际检查

对象存在性：两个克隆各执行一次 `git cat-file --batch-check`，提交和 tree 均返回 `missing`。随后用 `git cat-file --batch-all-objects --batch-check` 扫描完整对象库（FPS-Like 782 个对象，MOBA-Like 1937 个对象），没有任何对象 ID 以目标提交或 tree 前缀开头。两个克隆都没有 alternates，对象库即全部可读对象。

ref 可达性：`git rev-list --all` 中没有目标提交。FPS-Like 克隆有 7 个本地分支、17 个远端跟踪分支；MOBA-Like 有 8 个本地、47 个远端跟踪分支。远端跟踪状态来自最近一次 fetch，FETCH_HEAD 时间为 2026-10-29T19:31Z；本次未再 fetch。

任务工作树：逐一用 `git rev-parse --git-common-dir` 确认 12 个 FPS/MOBA 任务工作树（`wt/B-FPS-*` 除 B-FPS-PREVIEW-CLEANUP-001，及 `wt/B-MOBA-*`）和 `wt/B-OPENWEIGHT-3D-001` 共用上述两个克隆的对象库；对每个工作树执行同样的 `cat-file --batch-check`，目标对象全部 `missing`。`wt/B-FPS-PREVIEW-CLEANUP-001` 是 a1dbv 工作树（944 个文件），单独查过，目标对象同样 `missing`。

嵌套副本：`runs/B-MOBA-HEADLESS-GPU-001/…/scratch/work/repos/before` 与 `after` 是 MOBA 任务的两份独立克隆（各约 1300 个对象，HEAD 分别为 `baecaf56…`、`069b74bc…`），目标提交与 tree 均缺失。

运行目录内的其他对象库：`runs/B-GPU-JOB-STATUS-001/u1-a0-2026-10-27T141248819Z/scratch/receiver-test-l8d4FH` 下有 `seed-dbvv1__MOBA-Like`、`work/repos/dbvv1__MOBA-Like`、`remote/dbvv1__MOBA-Like.git` 三处 MOBA-Like 对象库，另有同结构的 a1dbv 克隆；逐一 `cat-file --batch-check`，目标提交与 tree 均 `missing`。同级的 `receiver-test-{Hx2vJs,d0GVCG,okHaxa}` 各只有 1 个文件，不含 Git 对象库。

bundle：按文件名与文件头两种方式扫描，登记范围内没有 git bundle。

- 文件名：`repos/`、`wt/`、`runs/` 下 `*.bundle` 为 0 个；命中的 `bundle.ts`、`capture-bundle.json`、`bundle-hashes.json` 是 web 构建产物，不是 Git bundle。
- 文件头：对下列范围读取前 24 字节，均无 `# v2 git bundle`／`# v3 git bundle` 命中（合计 41,178 个文件，全部可读，无读取失败）。超过 Windows 路径长度上限的文件用 `\\?\` 长路径前缀读取。
  - 12 个 FPS/MOBA 任务工作树加 `wt/B-OPENWEIGHT-3D-001`：14,714 个文件（排除 `.git` 与 `node_modules`）。
  - `runs/B-FPS-*`、`runs/B-MOBA-*`：23,327 个文件（同排除）。
  - `runs/B-GPU-JOB-STATUS-001`（含 `…/scratch/receiver-test-l8d4FH` 的对象库）：824 个文件。
  - a1dbv 工作树 `wt/B-FPS-PREVIEW-CLEANUP-001`：944 个文件。
  - a1dbv 两个既有产物目录：7 个文件。
  - 两个目标克隆含 `.git`：1,362 个文件。

因没有 bundle 文件，已知 SHA256、`git bundle list-heads`、`git bundle verify` 三项没有可执行前提，未运行，也未以其他内容替代。

## 已核的产物相对位置

以下路径相对接收端工作根（`work/`）：

- `repos/dbvv1__FPS-Like`、`repos/dbvv1__MOBA-Like`：两个克隆的完整 ref 与对象库。
- `wt/B-FPS-*`、`wt/B-MOBA-*`、`wt/B-OPENWEIGHT-3D-001`：FPS/MOBA 任务工作树（B-FPS-PREVIEW-CLEANUP-001 是 a1dbv 工作树，未计入）。
- `runs/B-FPS-*`、`runs/B-MOBA-*`：对应任务的运行目录；其中仅 `runs/B-MOBA-HEADLESS-GPU-001/…/scratch/work/repos/{before,after}` 含独立 Git 克隆。
- `runs/B-GPU-JOB-STATUS-001/…/scratch/receiver-test-l8d4FH`：含 `seed-dbvv1__MOBA-Like`、`work/repos/dbvv1__MOBA-Like`、`remote/dbvv1__MOBA-Like.git` 三处 MOBA-Like 对象库（及 a1dbv 克隆）。
- `repos/dbvv1__a1dbv/docs/collaboration/local-jobs/artifacts/B-MOBA-SIMULATION-001`、`repos/dbvv1__a1dbv/docs/collaboration/local-jobs/artifacts/B-GPU-JOB-STATUS-001`：a1dbv 检出中与这两个项目相关的既有产物目录（共 7 个文件，只有文档与 JSON，不是 Git bundle；已纳入上面的文件头扫描）。

## 未检查

- 整机、用户目录、私人文件、凭据、配置秘密、模型会话与其他项目仓库（如 Star-Rush-Reborn、jrnl）未遍历。
- 除上面列出的 FPS/MOBA 相关目录外，其他任务的工作树与运行目录（A-*、B-OPENWEIGHT-3D-001 的 TripoSG 克隆等）未做文件头扫描，不属于本卡登记的两个项目范围。
- 原执行环境、云端与模型网关未访问；没有联网取缺失对象，没有 fetch 缺失提交。
- 远端 fetch 只覆盖 heads；若目标提交只存在于已删除分支、tag 或其他 ref，本次不可见。not_found 不含这些情形。
- 接收端报告本单元无在途调用；本次未提供关联进程 PID、退出码或退出时间，实际进程退出及全局停止／空闲槽仍未独立核实。

## 恢复条件

原件恢复须先取得可达的原始 git bundle。现有发布授权有效，不重复申请 origin 授权；不重试已明确拒绝的入口、不换通道绕过，也不重复启动原云调用。取得原始 bundle 后按 SHA256 → `git bundle list-heads` → `git bundle verify` → `git cat-file -t/-p` 核对，随后核 `rev-parse <commit>^{tree}` 与表格一致。没有原字节时保持本报告的有界 not_found，不用重做候选冒充恢复。

## 产物

- 本文件：`docs/collaboration/local-jobs/artifacts/B-EXACT-ARTIFACT-RECOVERY-20261030/result.md`（相对本单元 a1dbv 工作树根；相对接收端工作根为 `wt/B-EXACT-ARTIFACT-RECOVERY-20261030/docs/collaboration/local-jobs/artifacts/B-EXACT-ARTIFACT-RECOVERY-20261030/result.md`）。
