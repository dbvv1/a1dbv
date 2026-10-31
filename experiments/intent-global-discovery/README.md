# Intent 全局列表为空：先找 pnpm 11 的真实包根

**已用 pnpm 11 全局安装 CLI，Intent 却列出零个 Skill 时，先从 `pnpm ls -g` 确认实际安装根，再按包单独加载。** 不据空列表重新安装、重写 Skill 或放宽来源策略。直接操作见[读者入口](../../docs/decisions/skills-and-plugins.md#intent-pnpm-global)。

自然消费者是 [Intent #206](https://github.com/TanStack/intent/issues/206)：使用者已装 TanStack CLI 0.70.0，项目内发现正常，但全局五个 Skill 不见了；后来补充 Playwright CLI 同样漏掉。原环境是 macOS、pnpm 11.17.0、Intent 0.3.6。本仓用正式 npm 包在 Linux 实际重装这两个 CLI 的全局布局，不是手造目录或报告者的原机器。

## 实际发现与加载

Node 24.22.1、pnpm **11.17.0**；消费者 **@tanstack/cli 0.70.0** 和 **@playwright/cli 0.1.22**。原帖未给 Playwright 版本，本次使用核查时的正式版；TanStack CLI 保持原报告版本，未测当前 0.72.0 的工作流。两版 Intent 对照如下：

| 条件 | Intent 0.3.6 | Intent 0.5.6 |
|---|---:|---:|
| 默认 `list --global-only` | 0 包／0 Skill | 0 包／0 Skill |
| 单独指定 Playwright 的 node_modules 根 | 1 包／1 Skill | 1 包／1 Skill |
| 单独指定 TanStack 的 node_modules 根 | 1 包／5 Skills | 1 包／5 Skills |
| 将两根用 POSIX 冒号拼接为 override | 0 包／0 Skill | 0 包／0 Skill |
| override 指向不存在目录 | 0 包／0 Skill | 0 包／0 Skill |
| 各单根逐个 `load --json` | 六份正文全部取回 | 六份正文全部取回 |
| `load` 不带前一次的 override | exit 1 | exit 1 |
| 不存在 Skill／缺少 Skill 参数 | 各 exit 1 | 各 exit 1 |

**空列表也会 exit 0，不能把命令成功当成已找到技能。** `pnpm root -g` 返回隔离安装的父目录，两个消费者在不同的 `node_modules` 下。Intent 当前只读一个根；它拿到非空的父目录就停止探测，没有继续枚举这两个安装。`INTENT_GLOBAL_NODE_MODULES` 非空时替代自动发现，仍是一个路径；不是追加项，也不在路径错误时回退。

每份 load 都核包名、版本、`source=global`、包根与 Skill 路径；读取前后原文 SHA-256 不变。Intent 会重写 Markdown 链接目标，所以正文输出不必与磁盘原文同 hash；[结果 JSON](results.json)分别保留原文与替换包根及其 realpath 后的加载正文 hash，没有复制整份技能内容。非作者另建项目、清洁环境变量，复用同一真实安装，以自己的探针独立重跑两版的默认／两单根／拼根及每包一个 load，结果一致；不是第二次独立安装或模型采用验收。作者另按本页完整命令重建隔离安装，最终探针在两份安装上的全部规范化结果一致。

已有[上游 PR #207](https://github.com/TanStack/intent/pull/207)试图增加多根发现，但核查时仍 open、未合并；其作者测试使用临时目录布局。这里不重复写修复，也不把 PR 的 delimiter 支持当成已发布功能。

## 在一次性目录复跑

需要已有 Node 24、npm 和 POSIX shell。在本知识库根目录执行；所有新安装进入临时目录，关闭安装脚本，不调用 TanStack／Playwright CLI、不下载浏览器、不创建账号或模型会话。此脚本是上述固定版本的回归探针，未来修复后预期零列表的断言应失败，届时重新核实而不是压绿。

```sh
(
set -eu
A1DBV=$(pwd)
TRIAL=$(mktemp -d)
mkdir -p "$TRIAL/home" "$TRIAL/pnpm-home/bin" "$TRIAL/project"
export HOME="$TRIAL/home" PNPM_HOME="$TRIAL/pnpm-home"
export XDG_CONFIG_HOME="$HOME/.config" XDG_DATA_HOME="$HOME/.local/share"
export XDG_CACHE_HOME="$HOME/.cache" DO_NOT_TRACK=1 CI=true
npm install --prefix "$TRIAL/tools" --cache "$TRIAL/npm-cache" \
  --ignore-scripts --no-audit --no-fund --save-exact \
  pnpm@11.17.0 @tanstack/intent@0.5.6
npm install --prefix "$TRIAL/original" --cache "$TRIAL/npm-cache" \
  --ignore-scripts --no-audit --no-fund --save-exact @tanstack/intent@0.3.6
export PATH="$TRIAL/tools/node_modules/.bin:$PNPM_HOME/bin:$PNPM_HOME:$PATH"
printf '%s\n' '{"name":"intent-global-reader-trial","private":true,"packageManager":"pnpm@11.17.0"}' \
  > "$TRIAL/project/package.json"
cd "$TRIAL/project"
pnpm add -g --ignore-scripts --store-dir "$TRIAL/store" \
  @tanstack/cli@0.70.0 @playwright/cli@0.1.22
for VERSION in tools original; do
  node "$A1DBV/experiments/intent-global-discovery/consumer_probe.mjs" \
    "$TRIAL/project" "$TRIAL/$VERSION/node_modules/@tanstack/intent/dist/cli.mjs" \
    > "$TRIAL/$VERSION-results.json"
done
printf 'Evidence directory: %s\n' "$TRIAL"
)
```

探针只查询当前 pnpm 的实际全局包路径及 Intent list/load；不安装、不修改用户配置，缺参数或输入不存在时 exit 2。安装阶段另列在上面的显式命令中。pnpm 11 的全局 bin 是 `$PNPM_HOME/bin`，只临时加入 PATH，不需要运行 `pnpm setup` 修改 shell 配置。项目明确声明 pnpm，避免因包管理器识别成 npm 而测错根。

## 来源与边界

- [Intent 官方概览](https://tanstack.com/intent/latest/docs/overview)：Skill 随包版本分发；全局扫描须显式开启，项目与全局同时扫描时本地优先。
- [真实问题 #206](https://github.com/TanStack/intent/issues/206)提供已安装消费者、原始命令与手工逐根恢复；[PR #207](https://github.com/TanStack/intent/pull/207) head `238fcf7359d43e7055d8809e2a6b5817102b7777` 仍未合并，不据自动摘要断言正式版已修。
- main `248c6f02605b12f9a31be069fabd945361f701bf` 的[单根检测](https://github.com/TanStack/intent/blob/248c6f02605b12f9a31be069fabd945361f701bf/packages/intent/src/shared/utils.ts#L294-L342)、[包管理器识别](https://github.com/TanStack/intent/blob/248c6f02605b12f9a31be069fabd945361f701bf/packages/intent/src/discovery/package-manager.ts)、[load 实现](https://github.com/TanStack/intent/blob/248c6f02605b12f9a31be069fabd945361f701bf/packages/intent/src/commands/load.ts)。源码只读，实际运行上述正式包。

核查与实跑：**2026-10-31 UTC**；覆盖官方契约、同题使用者原帖、现有修复与真实包安装。此次仅针对全局发现／内容加载；未运行上游补丁、macOS／Windows、pnpm 10、消费者工作流、Agent 或模型效果。已有 `intent.skills` allowlist／exclude 的项目先查其来源策略，不因空列表删除策略。本例没有这些策略。Intent global-only list/load 不执行发现包的程序或 Skill，但自动发现会运行包管理器根查询，不能称为零子进程。
