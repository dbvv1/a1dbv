# 清理 unused export，不等于删除局部绑定

**Knip 6.44.1 的解构导出自动修复可能让报告归零，却破坏仍运行的函数。** 对 #2298 的公开复现，保留局部解构，只单独导出仍需公开的名称，既能清空报告，也能保持消费者结果。不要用 `ignore` 掩盖此项，也不要把“unused export”改读成“变量从未使用”。

本例的替换仅适用于已确认没有外部消费者需要 `localOnly` 的内部模块；公开包的外部消费者不一定在本地分析图中，不凭这一份报告收窄公开 API。

```js
const values = { localOnly: 40, publicValue: 2 };
const { localOnly, publicValue } = values;
export { publicValue };
export function read() {
  return localOnly + publicValue;
}
```

保留同一解构求值及局部绑定，只移除不需要的导出。给 Agent 的验收是：核导入消费者 → 审实际修改 → 重跑原程序／测试；再跑 Knip 只是补充，不能替代程序验收。本例未改工具源码或新增默认门禁。

## 实跑结果

固定 npm 官方 `knip@6.44.1`、Node 24.22.1、Python 3.12.14，在 Linux 临时目录实际执行：

- 原程序退出 0，输出 `44`；只读 Knip 退出 1，报告 `localOnly` 的未使用导出。这一报告本身成立。
- `--include exports --fix --fix-type exports` 退出 0，却把 `localOnly` 从解构绑定删除。
- 再次只读 Knip 退出 0、空报告；原程序退出 1，`ReferenceError: localOnly is not defined`。
- 上面的手动修复不运行自动删除：消费者退出 0、输出仍为 `44`，Knip 退出 0、空报告。

这与[旧 workspace 入口误报](../README.md)不同：旧任务修正分析入口，本例修正自动修改的范围。材料来自用户的公开最小复现，不是其完整应用或生产事故；手动修复为本仓新增对照，未测模型收益、Bun、其他解构形式或完整上游测试。npm 当次 latest 查询为 6.44.1，源码主干 package 版本为 6.44.2，不能把主干版本号当成已发布修复。

## 复跑

把本目录复制到临时目录，在副本执行：

```sh
npm ci --ignore-scripts --no-audit --no-fund
python3 replay.py node_modules/knip/bin/knip.js
```

package／lock 固定官方包及依赖，Knip 为 ISC。安装需要联网；runner 不安装、不改原项目，以临时文件调用真实 CLI 与 Node 消费者。输出应与 [result.json](result.json) 一致；stderr 给出逐命令输出、退出码及保留源码的位置。无参数、CLI 不存在与 Python `-O` 均拒绝运行。runner 退出 0 表示已复现预期错误及手动对照，不表示自动修复安全。

## 来源与状态

- [用户 #2298](https://github.com/webpro-nl/knip/issues/2298)及[固定复现](https://gist.github.com/CaliLuke/31fe36f4bf9f11a60fb41747e8bb3052/53ac689c42dd07685cb53c61915bbaab3eccd029)提供原输入；[另一使用者的 agent-run 回执](https://github.com/webpro-nl/knip/issues/2298#issuecomment-6628036139)与之相符，不能替代本次复跑。
- [官方固定 visitor](https://github.com/webpro-nl/knip/blob/e868a869e92d2c0324c689d5b284076da9899f32/packages/knip/src/typescript/visitors/exports.ts)为解构成员生成 OBJECT_BINDING 删除范围；[删除实现](https://github.com/webpro-nl/knip/blob/e868a869e92d2c0324c689d5b284076da9899f32/packages/knip/src/util/remove-export.ts)据此裁剪源码。实际 npm 包中也核过对应实现，不宣称整个包等同主干快照。
- [官方 auto-fix 指南](https://github.com/webpro-nl/knip/blob/e868a869e92d2c0324c689d5b284076da9899f32/packages/docs/src/content/docs/features/auto-fix.mdx)说明选择修复类型和后处理；本例说明选择 `exports` 仍不保证只移除导出语义。
- 上游已有 [PR #2306](https://github.com/webpro-nl/knip/pull/2306)，本次查询 **open、未合并**，head `fd50b184c54e5b6c1e6b3b04bb132d902eafd2ca`，提议保留仍被局部使用的绑定。未运行该 PR，不声称其已修复或拒绝其他修复可能；不重复投稿。

来源核实与实跑：2026-11-05。
