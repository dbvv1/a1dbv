# Knip 把活的测试报为 unused：先补入口，再清理

**🧪 让 Agent 根据 Knip 清理代码前，先把报告与项目真正运行的入口对齐。** 已用 Knip 的 workspace 项目若误报根测试配置纳入的子包文件，在所属 workspace 精确补测试入口；不要先删文件，也不要用 `ignore` 或把所有源码设为入口来清空报告。已有分析准确时保留原配置，不为本例新装工具。

真实使用者 [#2247](https://github.com/webpro-nl/knip/issues/2247) 的 Vitest 根配置显式运行 `packages/lib/src/check.ts`；它导入 `value.ts` 并检查值。**测试确实运行通过，两份活文件却都被 Knip 报为 unused。** 本次在报告者原版 Knip **6.43.0** 和当时最新正式版 **6.44.0** 均复现，Vitest 固定 5.0.3。

另一类 Rsbuild alias 误报已有正式修复，见[6.44.1 补验](#rsbuild-alias-release)；不与下文 workspace 入口问题混用。

## 只补真正缺失的入口

在本例根目录的 Knip 配置中加入：

```json
{
  "workspaces": {
    "packages/lib": {
      "entry": ["src/check.ts"]
    }
  }
}
```

**入口归属和相对路径都要正确。** `packages/lib` 是 workspace，`src/check.ts` 相对该 workspace；不能放顶层 `entry`，因为 workspace 项目忽略该顶层设置。只指定真正执行的 `check.ts`，`value.ts` 随 import 关系进入可达图，无需另设入口。实际项目应合并这一小项进已有配置、保留已有 `entry` 数组项目并替换真实路径，不覆盖整份配置。

同一目标下，这比抑制两条告警更有用：两版本的原误报均消失，另加一个未引用文件仍被报告。把 `project` 缩到活文件、把整个 `src/**` 当入口或隐藏全部 unused，只是改变了检查范围，不能证明清理安全。

给 Agent 的最短任务：

```text
先不删除。对 Knip 报告的这些文件，核框架配置、脚本和实际运行入口。
若是入口遗漏，只补所属 workspace 的真实入口，不用 ignore 或全源码入口压绿。
复跑 Knip 和原消费者测试，交回剩余报告、仍实际运行的测试与配置差量。
确认未使用的项另列删除候选；无法确认的保留待查，不按“测试文件”判安全。
```

**依据**：[官方 workspace 配置与顶层选项限制](https://knip.dev/features/monorepos-and-workspaces)、[入口与检查范围](https://knip.dev/guides/configuring-project-files)、[报告处理顺序](https://knip.dev/guides/handling-issues)。这是本例实试后的窄配置做法，不是全项目清理默认。核实：2026-10-31 UTC。

## 实际对照：不仅看报告是否归零

| 条件 | Knip 6.43.0／6.44.0 | Vitest 5.0.3 |
|---|---|---|
| 报告者原始配置 | exit 1，误报 `check.ts`、`value.ts` | 1／1 测试通过 |
| 精确 workspace 入口 | exit 0，报告为空 | 原 1／1 测试仍通过 |
| 同一入口＋未引用控制文件 | exit 1，只报告该未引用文件 | 原 1／1 仍通过 |
| 临时移走 `value.ts` | 不用于此结论 | exit 1，导入失败，0 测试 |
| 临时移走 `check.ts` | 不用于此结论 | exit 1，0 测试、0 suite |
| 恢复原件 | exit 0，报告为空 | 1／1 通过，源码哈希与初始一致 |

未引用文件和临时移走文件是本仓增加的**合成正反对照**，不代表真实 Agent 发生过误删。负对照通过重命名暂存、随后恢复原件完成；没有执行 `--fix`。非作者在独立副本用已装 6.44.0 复跑全部六行，结果一致。

这里验证了报告者的公开复现，不是其完整业务产品，也没测模型收益、生产模式、Relay 或完整 Knip 套件。执行输出、版本和源码哈希见 [results.json](results.json)。

## 重跑固定正式版 6.44.0

在一次性目录用 Node.js 24、npm 11 重跑；命令从 a1dbv 根目录开始，安装只发生在新目录，`--ignore-scripts` 关闭依赖安装脚本：

```sh
set -eu
a1="$PWD"
work="$(mktemp -d)"
git clone https://github.com/drewbitt/knip-repros.git "$work/repro"
git -C "$work/repro" checkout --detach d4a049103d9c30db13f2c228e14499fe982ccb4f
cd "$work/repro/plugin-entries-in-child-workspaces"
npm install --save-dev --save-exact knip@6.44.0 \
  --ignore-scripts --cache "$work/npm-cache" --no-audit --no-fund
npm test
# 本例此时应恰好报告 check.ts、value.ts 两项，exit 1；先保留原输出。
status=0
node node_modules/knip/bin/knip.js --reporter=json > before.json || status=$?
test "$status" -eq 1
cat before.json
# 仅对这个全新复现副本复制配置；真实项目应合并配置，不覆盖。
cp "$a1/experiments/knip-workspace-entry/knip.json" knip.json
node node_modules/knip/bin/knip.js --reporter=json
npm test
```

最终 Knip 应为 `{"issues":[]}`，Vitest 仍为 1 个测试通过。开始时若不是预期的两份文件，不按退出码继续认定复现成立。本次环境为 Linux、Node 24.22.1、npm 11.9.0；正式工具版本已固定，安装生成的依赖锁哈希保留于结果中。

## 为什么不直接拿未合入补丁

**已有作者在修，不重复实现；目标复现变绿还不够。** [#2260](https://github.com/webpro-nl/knip/pull/2260) 对 #2247 有效，但维护者要求修改：拆分 glob 后丢了否定模式和 ignored workspace 边界，产生新的 unused 漏报，既有 Ava 测试也失败。因此本例先用受支持的精确入口，不把这份未合入 PR 推荐为修复版。

本轮所核主干 `3c84cafb` 和 6.44.0 的相关实现仍整批处理插件 glob；主干这里只读核源码，实际 CLI 对照使用上述两个正式包。升级后再核自动发现，若已覆盖真实入口，就重新评估是否还需要这条显式配置。

**依据**：固定主干 [glob 分组调用](https://github.com/webpro-nl/knip/blob/3c84cafb68b2fa3d419b03a3a5e564d60aaeef30/packages/knip/src/graph/build.ts)、[#2260 维护者审查](https://github.com/webpro-nl/knip/pull/2260#pullrequestreview-5714750121)、[否定模式反例](https://github.com/webpro-nl/knip/pull/2260#discussion_r4425462564)、[ignored workspace 反例](https://github.com/webpro-nl/knip/pull/2260#discussion_r4425462576)、[正式版发布](https://github.com/webpro-nl/knip/releases/tag/knip%406.44.0)。核实：2026-10-31 UTC。

<a id="rsbuild-alias-release"></a>

## 正式版补验：Rsbuild alias 不必先改活代码

**🧪 在 #2248 的静态绝对路径 `resolve.alias` 工程中，6.44.1 已消除两条误报，仍能发现真正未引用的文件。** 遇到同因问题可评估正式修复，不必先删活的 `env.ts`、添加 ignore 或把所有源码设为入口；这不是上文 #2247 已修的证据。

原公开工程固定于 `drewbitt/knip-repros@d4a04910` 的 `rsbuild-alias`。保留原 Rsbuild 2.2.12、配置和源码，只把 Knip 换成 6.44.0／6.44.1；两份实际锁文件的包版本差异也只有 Knip，均解析 Rspack 2.2.9。环境为 Linux、Node 24.22.1、npm 11.9.0。

| 输入／控制 | 6.44.0 | 6.44.1 |
|---|---|---|
| 原应用的真实 Rsbuild build | exit 0 | exit 0，HTML／JS hash 与左侧相同 |
| 原仓完整布局的 Knip 分析 | exit 1：活 `env.ts` 被报 unused，`@env` 被报 unlisted | exit 0，`issues` 为空 |
| 新增合成未引用文件 | 原两条误报加控制文件 | exit 1，仅控制文件 |

首次只复制子工程，漏了原仓根 `.gitignore` 的 `dist/`，额外报了构建产物；这是试验布局遗漏，不是 Knip 新缺陷。恢复完整原仓布局后，只重跑受影响的 Knip 分析，未新增 ignore 压绿。已成功的 build 仍对应相同应用／配置和依赖，产物复制到新布局，**不是在新布局重新构建**。控制文件随后移出并保留，原应用／配置已恢复原字节。

修复在缺少 `tools.rspack` 的提前返回前处理顶层 alias，函数 alias 仍被跳过。本次只验静态绝对路径；报告者 6.43.0、其他 alias 形态、Windows 和整体准确率未验。JS 产物包含 `console.log(1)`，不是浏览器运行结果。不改默认或提升 reader 状态。完整首次／纠正输出、命令、版本与 hash 见 [rsbuild-alias-results.json](rsbuild-alias-results.json)。

**依据**：[真实问题 #2248](https://github.com/webpro-nl/knip/issues/2248)、[固定原工程](https://github.com/drewbitt/knip-repros/tree/d4a049103d9c30db13f2c228e14499fe982ccb4f/rsbuild-alias)、[已合入 #2251](https://github.com/webpro-nl/knip/pull/2251)、[正式 6.44.1](https://github.com/webpro-nl/knip/releases/tag/knip%406.44.1)。核实／实跑：2026-11-01 UTC。

## 来源覆盖

| 来源 | 采用与范围 |
|---|---|
| 官方与开源实现 | 原生 entry／workspace 契约、当前发布及待修实现；形成 1 项可直接复验的窄配置办法 |
| 当前真实使用者 | [#2247 的固定公开复现](https://github.com/drewbitt/knip-repros/tree/d4a049103d9c30db13f2c228e14499fe982ccb4f/plugin-entries-in-child-workspaces)，原消费者测试实际运行，不把作者报告当本仓执行 |
| 做法作者 | [kensaurus 的 plan-dead-code](https://github.com/kensaurus/skills/blob/19f97419177c63c80e055e4515c341e8b6ff3ad4/skills/plan-dead-code/SKILL.md)把入口核对与删除分开，作为当前机制参照；未安装 Skill，不沿用其示例计数或笼统收益 |
| 中文社区 | [二月 LINUX DO 原帖](https://linux.do/t/topic/1616288)传播的清理示例把测试列为 SAFE；这里只作历史反例，不能据此评价该工具包当前版，也不能按文件类别决定删除 |
| 覆盖缺口 | 定向解决已有报告，不是死代码工具广泛比较；未找到另一份近期中文同因原帖，最高水平与模型净收益未知 |
