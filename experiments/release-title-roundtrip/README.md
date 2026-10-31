# 生成了标题，还要让实际消费者读回来

**Agent 改机器消费的配置或文本时，用下游实际版本读回生成结果，断言关键字段。** release-please 的双标记标题是一个真实例子：旧库能生成标题，随后却解析失败；换成单组标记可读回。
本次运行正式 npm 包的标题／版本模块，并与 Action 内打包的标题实现逐字对照；不执行 Action 或发布流程。
这是一条已有验证方法的具体用法，不新增发布工具，也不改本仓 CI。

## 真实输入与版本选择

Andrew Connell 在 10-30 的复盘中报告：Claude 合写、本人批准的配置使 7-31 至 8-6 的发布停滞；项目指令原本推荐双标记。作者已经采用单组标记和往返测试，本次核验其可复用方法，不是替他修复站点。

原模板为 `chore: release${component} ${version} [skip unit] [skip e2e]`，生成 `chore: release site 7.2.0 [skip unit] [skip e2e]`。验收要求读回 `component=site`、`version=7.2.0`，只检查“不抛错”会漏掉 `undefined`。

截至本次核查，最新 Action **v5.0.0**（`45996ed1`，`v5` 同指此提交）内含 **17.6.0**；库 **17.11.2** 已有全局括号转义修复。更新项目里的 npm 包不会改掉 Action 的 `dist/index.js`；选择版本时看工作流实际执行的产物。

| 同一模板生成后再解析 | 17.6.0 | 17.11.2 |
|---|---|---|
| 不带标记，正常对照 | 字段正确 | 字段正确 |
| 作者采用的 `[skip tests]` | 字段正确 | 字段正确 |
| 原 `[skip unit] [skip e2e]` | 返回 `undefined` | 字段正确 |

**已用旧 Action 且需要保留这类项目标记时，可先采用单组形式，再核工作流的识别条件。** 这些是作者项目自定义标记，不是 GitHub 通用跳过语法；本试验只验标题，不建议跳过项目必需检查。已经合并、尚未发版的 PR 还要检查其实际标题、tag 和 release 状态，改未来模板不会自动修复旧产物。

## 复跑

需 Node.js 24、Git、npm，以及可安装官方依赖的一次性目录。从本仓根目录运行下面的 Bash；安装均放临时目录，禁用安装脚本，不读取账号或执行发布命令。

```bash
set -eu
repo="$PWD"
work=$(mktemp -d)
git clone --depth 1 --branch v5.0.0 \
  https://github.com/googleapis/release-please-action.git "$work/action"
test "$(git -C "$work/action" rev-parse HEAD)" = 45996ed1f6d02564a971a2fa1b5860e934307cf7
npm install --prefix "$work/old" --cache "$work/npm-cache" \
  --ignore-scripts --no-audit --no-fund --save-exact release-please@17.6.0
npm install --prefix "$work/new" --cache "$work/npm-cache" \
  --ignore-scripts --no-audit --no-fund --save-exact release-please@17.11.2
export RELEASE_PLEASE_OLD_ROOT="$work/old/node_modules/release-please"
export RELEASE_PLEASE_NEW_ROOT="$work/new/node_modules/release-please"
export RELEASE_PLEASE_ACTION_ROOT="$work/action"
node --test "$repo/experiments/release-title-roundtrip/test.cjs"
probe_exit=0
node "$repo/experiments/release-title-roundtrip/run.cjs" \
  "$RELEASE_PLEASE_OLD_ROOT" "$RELEASE_PLEASE_NEW_ROOT" \
  "$RELEASE_PLEASE_ACTION_ROOT" || probe_exit=$?
test "$probe_exit" -eq 1
```

**预期诊断输出有 6 项结果、1 个往返失败，probe 退出码为 1；4 项脚本测试通过。** 退出码 2 表示输入／版本或实现匹配失败。原模板没有 `${scope}`，库会输出警告，保留它而不修改原触发输入。临时目录由运行者确认后自行清理。

本仓在 Linux／Node.js 24.22.1 实跑上述模块；Action 的标题常量、生成、解析和类实现与 npm 17.6.0 连续 **5,094 字符**逐字一致。测试没有调用 GitHub、创建 PR／tag／release，也未验证整个 Action、工作流条件或作者站点。新项目把这类断言接到已有配置测试即可，不必复制本对照工具；消费端不会读回自身输出时，按其真实输入契约验证，不强套往返。

**依据与核实：2026-10-31。** [作者原始复盘](https://www.andrewconnell.com/articles/ai-coding-agent-mistakes-lessons-learned/)、[官方标题契约](https://github.com/googleapis/release-please/blob/05c6a4f71022304d4edad24ea90c1c16324503d5/docs/customizing.md#pull-request-title)、[Action 固定入口](https://github.com/googleapis/release-please-action/blob/45996ed1f6d02564a971a2fa1b5860e934307cf7/action.yml)、[实际打包实现](https://github.com/googleapis/release-please-action/blob/45996ed1f6d02564a971a2fa1b5860e934307cf7/dist/index.js#L58819-L58959)、[已合修复 #2806](https://github.com/googleapis/release-please/pull/2806)、[17.11.2 源码](https://github.com/googleapis/release-please/blob/05c6a4f71022304d4edad24ea90c1c16324503d5/src/util/pull-request-title.ts)、[GitHub 原生跳过标记](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs)。上游 Apache-2.0；本次不改上游、不提交贡献或签署 CLA。
