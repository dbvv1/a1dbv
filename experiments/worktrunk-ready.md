# 新工作树创建完，就能开始测试：Worktrunk 的同步依赖准备

> 核实时间：2026-10-24；固定 Worktrunk v0.81.0 的工具夹具实试，独立净环境重放通过。

🧪 **多个 Agent 各用一棵工作树时，可试 Worktrunk 把依赖副本准备接到创建动作上。** 增量不是另造分支隔离，而是让“创建 → 准备依赖 → 跑现有测试”成为一个可重复入口；只需要一两棵树、已有准备脚本或所用 Agent 客户端的原生工作树准备已足够时，不必换工具。[本仓实试／经验：2026-10-24]

先从[官方安装入口](https://worktrunk.dev/install/)安装并核对版本；本次固定使用官方 v0.81.0 发布包及其 SHA-256。以下在已有初始提交的一次性 Git 项目中操作，先安装好主工作树依赖，只允许复制依赖目录：

`.worktreeinclude`：
```text
node_modules/
```

`.config/wt.toml`：
```toml
[pre-start]
copy = "wt step copy-ignored --require-include"
```

把这两个配置文件提交到将用于创建的基线分支后再建树；未提交的配置不会随 Git 检出进入新树。本例在 `main` 上准备并提交：
```bash
git add .worktreeinclude .config/wt.toml
git commit -m "Configure worktree dependency preparation"
wt switch --create task-a --base main --no-cd --execute npm -- test
```

`--require-include` 在缺少清单时跳过复制并返回成功，不会替你证明依赖就绪；仍要由后面的真实测试验收。[本仓独立复核]

`pre-start` 同步完成后才启动 `npm test`；后面准备启动 Agent 的命令也可放在 `--execute`。这里不采用后台 `post-start`，避免依赖尚未复制完就开始验证。`--no-cd` 不影响执行命令的目录，也不要求先修改 shell 配置。审查项目 hooks 后再批准；不要对陌生项目照抄自动批准参数。[一手：[创建与执行](https://worktrunk.dev/switch/)、[hooks](https://worktrunk.dev/hook/)]

**本仓实试：v0.81.0、真实 npm semver 7.7.3 依赖、自己编写的两条消费断言。** A 树创建后直接通过；B 树先验证准备失败会阻断执行，重做准备后通过。修改 A 中实际被测试读取的依赖函数后，A 测试失败，B 与主树仍通过，原依赖文件哈希保持不变。被忽略的合成 `.env` 没有被复制。此次在 Linux tmpfs 上复制 54 个文件、96 KiB，工具明确报告 **full copy**，不是 reflink。[本仓实试：小型工具夹具，不是生产项目或 Agent 效果评测]

普通 `git worktree add` 后显式复制所选目录也能做到文件独立；本次未做性能对照，Worktrunk 的收益是把选择规则和准备顺序放入创建生命周期，不是宣称 Git 做不到。gh-stack 处理未合入父层变化的接续，与依赖准备是不同问题。[经验：工具选择]

一个恢复细节：准备失败后工作树可能已经存在，直接重新 `wt switch` 不会再触发只在创建时执行的 `pre-start`。修好准备命令后，在该树运行 `wt hook pre-start`，成功后再启动测试；不要因报错提示而直接跳过 hooks。[本仓实试：注入 `exit 23`，创建命令返回 23，后续执行标记未产生]

边界：复制不会适配不同 lockfile、平台或路径敏感的环境，也不会分开数据库、端口和外部输出；已有目标文件默认不被覆盖。实际准备方案仍需适合项目，尤其不要把 `.venv` 当作必然可搬迁的目录。官方支持的文件系统可使用 reflink，否则完整复制；本次不证明空间或速度收益。[一手：[复制语义](https://worktrunk.dev/step/#wt-step-copy-ignored)；经验：采用边界]

社区依据不是泛泛口碑：[使用者 #1865](https://github.com/max-sixty/worktrunk/issues/1865) 曾遇到大目录复制不完整，已由 [#1864](https://github.com/max-sixty/worktrunk/pull/1864) 修复，因此此次以依赖实际能跑测试为验收，不只看建树成功；[使用者 #3384](https://github.com/max-sixty/worktrunk/issues/3384) 反馈复制可能很慢，因此不把副本机制写成“瞬间/零成本”。这些是各自案例，不代表当前普遍缺陷。

## 重放与完整性

[重放脚本](worktrunk-ready.sh)要求 Linux x86_64、Git、curl、tar、sha256sum、Python 3、Node 和 npm；不安装系统依赖，不修改 shell 配置。脚本置于运行目录外，从空的一次性目录执行：

```bash
# 在本仓根目录执行；保留脚本的绝对定位，再切到空目录。
REPLAY="$PWD/experiments/worktrunk-ready.sh"
TRIAL="$(mktemp -d)"
(cd "$TRIAL" && bash "$REPLAY")
```

脚本拒绝非空运行目录；使用独立 HOME、配置和 npm 缓存，并以仅保留 PATH 及指定代理／CA 设置的环境重启。只下载官方公开包，不继承宿主账号环境变量，使用独立用户配置目录且不运行依赖安装脚本；这不表示禁用了系统级 Git／npm 配置。自动批准仅针对脚本自己写出的准备 hook。结束后保留夹具供检查，其中 A 的依赖故意损坏，属于成功验收的一部分。未清理其他目录。[本仓实试：独立审查再次完整重放通过；非空目录拒绝返回 64]

- [官方发布 v0.81.0](https://github.com/max-sixty/worktrunk/releases/tag/v0.81.0)的 Linux x86_64 musl 包 SHA-256：`0c253f216985ce9cd7b202a11606b5ce6aa934b1019fd1fbb9b7ce2b47b1c74a`。下载文件与[官方发布 API](https://api.github.com/repos/max-sixty/worktrunk/releases/tags/v0.81.0)的 digest 一致，CLI 回报 `wt v0.81.0`；这是发布源一致性核对，不是独立签名审计。
- [npm 官方 semver 7.7.3 包](https://registry.npmjs.org/semver/-/semver-7.7.3.tgz)由 npm 校验；固定版本的包 SRI 为 `sha512-SdsKMrI9TdgjdweUSR9MweHA4EJ8YxHn8DFaDisvhVlUOe4BF1tLD7GAj0lIqWVl+dPb/rExr0Btby5loQm20Q==`。安装关闭 lifecycle scripts、audit 和 fund。
- 实试运行时为 Node v24.22.1、npm 11.9.0。没有模型调用、生产应用修复、速度对照、reflink 空间测量或远端操作。

探索回执：截至 2026-10-24，定向续查 Worktrunk 官方文档、固定 release/CLI、GitHub 使用者 issue 及合入修复；这次为已有候选的操作缺口补实试，未做新的全渠道排名，不声称当前统一最佳。
