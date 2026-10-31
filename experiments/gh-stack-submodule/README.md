# gh-stack：子模块 pin 更新后，失败与恢复都可能只完成一半

**🧪 已用 gh-stack 的 Agent 分支栈遇到子模块 dirty 时，先核实际 refs、index 与子模块 HEAD，不要用 `ignore=all` 压掉检查。** 0.3.0 的双层栈实试中，rebase 失败后第一层已经改写；abort 也可能返回失败却已恢复部分 refs。只有确认是本轮遗留的纯 checkout 偏差，才按当前 index 对齐该子模块，再单次 abort 并重新检查。

自然需求来自使用者 [4wrxb 的 #556](https://github.com/github/gh-stack/issues/556)，不是为测试新造的功能：trunk 更新子模块 pin 后，第二层被 dirty 检查阻断，恢复也被同一检查阻断。后续 [lionel- 的评论](https://github.com/github/gh-stack/issues/556#issuecomment-6462454991)报告 0.3.0 仍可复现，并警告 `ignore=all`。本次把该公开报告做成最小真实 CLI/Git 重现，未获得原业务仓库或生产恢复验收；不替代已有 [0.2.1 普通文本冲突／跨工作树试用](../../docs/research/2026-10-22-frontier-trials.md#gh-stack依赖分支与跨目录恢复)。

## 已经卡住时怎么判断

1. **先暂停受影响工作树的写入者，保留现场。** 保存恢复 journal、各层 refs、当前分支及操作前的子模块 pin／HEAD／工作状态。没有可信的操作前状态，就不能把干净的子模块 HEAD 当作可丢弃；它可能含尚未记录到父仓的本地提交。
2. **逐个区分内容改动和纯 pin 偏差。** 以 `vendor/lib` 为例，读取父仓 `git ls-files --stage -- vendor/lib`、子模块 `git -C vendor/lib rev-parse HEAD` 和 `git -C vendor/lib status --porcelain --untracked-files=all`；另查 `git -C vendor/lib ls-files --others --ignored --exclude-standard`，不要漏掉 ignored 文件。未合并 gitlink、真实改动、未知 HEAD、缺失对象或未知所有者均先停止恢复动作、保护工作。
3. **仅在操作前干净且 HEAD 等于原 pin、现在仍为那个已知 HEAD、偏差确由本轮造成时，才对齐当前 index 指向的本地对象。** 确认目标 commit 可由该子模块的 `git cat-file -e '<当前 pin>^{commit}'` 找到，然后只处理确认过的路径：
   ```sh
   git submodule update --checkout --no-fetch -- vendor/lib
   gh stack rebase --abort
   ```
   不加 `--force`、`--remote` 或递归更新，不手删 journal。这里使用已安装扩展的 `gh stack`；重放脚本直接调用同一官方 `gh-stack` 二进制。
4. **每次 abort 后都重读状态，不按退出码猜。** refs/index 已恢复时，对齐目标也随之改变；若再次需要对齐，须能证明当前 HEAD 正是自己上一步的已记录操作。结束条件是原层 refs、原分支、子模块 HEAD 与 index 一致、双方 clean、journal 清除，不是“重试两次”。

这是静止、已知单子模块场景的诊断步骤。未知本地提交先另行保护；不能将下面的合成 fixture guard 提取成通用自动修复器，它未验证并发写者、完整 journal 身份、多／递归子模块或真正的 gitlink merge conflict。

## 本次实际状态变化

Linux、**gh-stack 0.3.0 官方 linux-amd64 二进制、隔离执行环境内 Git 2.47.3**。`main` 将子模块从 A 提到 B；两个普通文件分支仍从 A 出发，运行正常 `rebase --remote origin`，origin 是本地 bare 仓库。

| 操作完成后 | 退出码 | 第一层 ref | index pin／子模块 HEAD | 当前分支与 journal |
|---|---:|---|---|---|
| rebase 失败 | 1 | 已重写 | B／A | branch1，`restoring` |
| 未对齐就 abort | 1 | 不变 | B／A | 整份快照不变 |
| 对齐 B，再 abort | 1 | **已恢复原 SHA** | A／B | 仍 branch1，保留 journal |
| 按新 index 对齐 A，再 abort | 0 | 原 SHA | A／A | 回 branch2，clean，journal 清除 |

第二层 ref 全程不变；最终两层恢复原 SHA。**main 仍保持已经推进的 B**，不是撤回主干或远端更新。源码中的逐层恢复与原目录恢复可分别成功／受阻，解释了中途非零退出仍有状态变化。

另外四个独立故障 fixture 分别加入 tracked edit、untracked file、未写入父仓的本地 commit、ignored file。**本重放脚本自己的保守 guard** 均拒绝对齐，文件内容、子模块 HEAD、各层 refs、journal 字节保持；后两种子模块 status 仍干净。这不是 gh-stack 已具备自动修复／完整保护的证明。

## 为什么不设 `ignore=all`

独立纯 Git 对照让 submodule S0→S1→S2，main 的提交 M 只把 pin 改为 S1，topic 的提交 T 只把 pin 改为 S2，再加一个普通文件控制提交。对照只改变单命令配置 `-c submodule.dependency.ignore=all`，不修改全局配置。

| 对照 | `git show` → `patch-id`／cherry-mark | rebase 结果 | 最终 pin／普通文件 |
|---|---|---|---|
| 正常 | M、T 不同／非等价 | exit 0 | **S2 保留**／保留 |
| `ignore=all` | 两份 patch-id 输出为空／等价 | exit 0，**有 skipped 警告** | **退成 S1**／仍保留 |

所以“命令成功、普通文件也在”仍不够，要检查实际 gitlink。这里不是完全静默丢失；也未把这项纯 Git 机制验证冒充 gh-stack 整栈的 `ignore=all` 端到端测试。同入口 Git 2.47.3 重现，独立的 Git 2.52.0 初试结论一致。

## 重放

仅在自己的 Linux amd64 一次性空间运行。需要 Python 3、Git ≥2.36、`gh` 可执行文件、curl；不安装全局扩展，不读取已有仓库或凭据。从 a1dbv 仓库根目录执行；子 shell 出错即停，下载固定官方资产并校验：

```sh
(
set -eu
trial=$(mktemp -d)
curl -fL https://github.com/github/gh-stack/releases/download/v0.3.0/linux-amd64 -o "$trial/gh-stack"
printf '%s  %s\n' 957e822cfa7e435cd84a297cd96c419b58e51e3ac58be249762c24bd9e45099b "$trial/gh-stack" | sha256sum -c -
chmod +x "$trial/gh-stack"
python3 experiments/gh-stack-submodule/consumer_probe.py --gh-stack "$trial/gh-stack" --root "$trial/run"
python3 experiments/gh-stack-submodule/pin_probe.py > "$trial/pin-results.json"
)
```

- `consumer_probe.py` 要求 root **尚不存在**且二进制 hash 匹配；只在自己新建的合成仓库运行。结果见 root 下的 `results.json`，各 fixture 留完整 `transcript.json`，不自动删除。
- `pin_probe.py` 每次另建临时目录；stdout 为归一化 JSON，stderr 给原始证据位置。[已验恢复结果](results.json)、[pin 对照结果](pin-results.json)不含机器绝对路径。
- 两个脚本固定 `PATH=/usr/bin:/bin`，输出的是实际调用的 Git 版本；不要拿交互 shell 的版本替代。主探针无凭据 HOME／GH 配置、关闭更新通知、只使用本地 remotes／file 协议和拒绝式代理配置。动态网络跟踪受环境限制未完成，预防配置不等于网络沙箱证明。
- 运行的是未修改的官方发行二进制，不是源码补丁；未运行上游 Go 全套测试、远端 PR、`sync`、模型任务、其他 OS 或用户 PC。

非作者已独立新建 fixture 重放恢复与保护组，并验证已有 root／错误 binary hash 均拒绝启动；pin 对照由独立执行者实现并实际运行。仍标 🧪，不据此升级工具默认或宣称上游已修复。

**依据与覆盖**：[官方] [Git 2.47 submodule update](https://git-scm.com/docs/git-submodule/2.47.0)、[Git 配置](https://git-scm.com/docs/git-config/2.47.0)、[gh-stack 0.3.0](https://github.com/github/gh-stack/releases/tag/v0.3.0)；[开源源码] [固定 rebase 实现](https://github.com/github/gh-stack/blob/2a49e6751238633db504655d8a8eba3e433e827d/cmd/rebase.go)、[worktree 恢复](https://github.com/github/gh-stack/blob/2a49e6751238633db504655d8a8eba3e433e827d/internal/worktree/context.go)；[使用者] #556 原帖及评论；[本仓实试] 本目录脚本与结果。定向中英文检索未获得独立中文同题恢复回执；没有把介绍文章算采用证据。核实与运行：2026-10-31。
