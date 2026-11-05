# 回放历史任务：先检出 head，不只传 `--head`

**使用 Turbo 2.11.10／2.11.11-canary.1 回放历史提交时，让独立工作树停在目标 head，再查询 affected。** 同样的 base/head，在较新检出中可能因当前锁文件多选包；`--head` 不等于把整个项目切换成那个提交。若当前 CI 本已检出目标 head，本例不要求新加工作树或改构建范围。

以 [#14916](https://github.com/vercel/turborepo/issues/14916) 的公开复现为例，A 只给 `pkg-a` 加依赖，后续 B 才给 `pkg-b` 加依赖。两版官方 npm CLI 实跑结果相同：

| 干净工作树 | 查询固定 base→A | build dry-run 图 |
|---|---|---|
| B | 根、app-a、pkg-a、**pkg-b** | 8 个 task ID，包含 pkg-b 的 build／prebuild |
| A | 根、app-a、pkg-a | 6 个 task ID，不含 pkg-b |

两种查询均退出 0。多选不是命令报错；本例没有证明漏选。8／6 是图中 task ID 数，含没有实际脚本的节点，不是实际执行或通过的构建数。

## 在实际回放中怎么做

先固定并核对完整 base/head SHA，原工作目录有修改时不覆盖它。在已有仓库中创建新的隔离检出：

```sh
git worktree add --detach ../verify-at-head "$HEAD_SHA"
cd ../verify-at-head
git rev-parse HEAD
git status --porcelain
# 在此检出按项目约定安装锁定依赖，再用该项目的 Turbo 入口：
turbo query affected --packages --base "$BASE_SHA" --head "$HEAD_SHA"
TURBO_SCM_BASE="$BASE_SHA" TURBO_SCM_HEAD="$HEAD_SHA" \
  turbo run build --affected --dry=json
```

确认清单后才跑原任务所需的真实构建或测试。不要把较新工作树的 `node_modules` 和缓存直接当成旧提交匹配的环境。本次只为固定 CLI 的只读图查询，将 CLI 安装在独立目录；没有安装示例的业务依赖。CLI 会提示项目未本地安装 Turbo，使用的实际版本由 runner 先验明，不把它描述为完整项目安装成功。

## 复跑本次证据

固定用户仓库 B 为 `5436b2d652edbd0827cfd92b22462c69b370669e`、A 为 `cf6fceaab02b590bbe02643a458e0add356b37d4`、base 为 `fa9e9c1b923a08d5eaa1391fee2ee5708113d16d`。Node 24.22.1、Python 3.12.14、Linux；npm 官方 `turbo` 包及平台二进制，包内声明许可 MIT。本目录两份 lock 固定完整安装树，安装禁用 lifecycle scripts。

复制本目录到临时目录，然后：

```sh
git clone https://github.com/hamidelgendy/turbo-affected-head-lockfile.git source
(cd stable && npm ci --ignore-scripts --no-audit --no-fund)
(cd canary && npm ci --ignore-scripts --no-audit --no-fund)
python3 replay.py source stable/node_modules/turbo/bin/turbo canary/node_modules/turbo/bin/turbo
```

runner 在新临时副本检出完整 SHA，查询前后检查工作树干净；关闭遥测，输出应与 [result.json](result.json) 一致。stderr 给出每条命令、退出码及原始输出的保留目录。缺参数、路径无效或 `-O` 拒绝运行。源码下载与 npm 安装需要网络；runner 本身不安装依赖、不执行项目 build 脚本、不接远端缓存。

这是用户公开复现的真实提交与真实 CLI 任务选择，不是其私有 89 包仓库。示例构建脚本主要是 echo，不把它们跑绿当业务验收；未测实际 CI、模型收益、未提交改动、其他工作区图形或 Windows。

## 上游修复与采用边界

[PR #14918](https://github.com/vercel/turborepo/pull/14918) **已于 2026-11-04 合并**，merge `4f9a2e07a65396a8b5eb52e00b84b7ab0233259c`。[合入源码](https://github.com/vercel/turborepo/blob/4f9a2e07a65396a8b5eb52e00b84b7ab0233259c/crates/turborepo-scope/src/change_detector.rs)在检出不匹配 to_ref 时转为读取历史锁文件变化；解析失败保守回退。PR 自报测试不是本仓验证，**本轮没有构建或运行修复源码**，也不保证完整历史工作区图重建。

当次 npm 查询 latest=`2.11.10`、canary=`2.11.11-canary.1`，两份实跑包仍复现。合并不等于已包含在这些发布包；不要为了修这个问题盲升同一个 canary 标签。未来安装包含修复的明确版本后，按同样固定消费者复验，再判断是否可以取消本例的额外隔离步骤。

**来源**：[原用户问题与命令](https://github.com/vercel/turborepo/issues/14916)、[固定公开仓库](https://github.com/hamidelgendy/turbo-affected-head-lockfile/tree/5436b2d652edbd0827cfd92b22462c69b370669e)、上述官方合入代码／PR与 npm 实际发布包。核实与实跑：2026-11-05。
