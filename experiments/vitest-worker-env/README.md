# Vitest 升级后串测试：先核复用 worker，不先改业务断言

**🧪 已用 `pool: 'forks'`、`isolate: false`，升级后出现前一测试文件的环境值时，先恢复默认隔离作对照；确需复用 worker，再在每文件 setup 顶层显式恢复所需键。** `test.env` 不是可靠的逐文件复位承诺。只开 `unstubEnvs`、减少 worker 或退回 v4，都不能替直接写 `process.env` 的测试补这条契约。

适合 Agent 接手“单文件过、整套失败／升级后连片失败”的任务。先记录文件、PID 和脱敏后的入口状态，核对失败文件是否读到了同 PID 另一文件留下的值，再决定改测试夹具还是业务代码。敏感环境值不要写日志；本例只用普通字符串。

## 真实需求与实测

Vitest 使用者 #11423 报告约 170 个后端集成测试文件中，有文件在模块顶层切换私有临时数据库，结束时删除数据库；升级后后续文件仍指向它。原报告是 macOS、Node 24.21.0、Vitest 5.0.3。本仓按其公开最小复现改成字符串哨兵，在 Linux、Node **24.22.1**、两版均解析 **Vite 8.3.5** 的官方包上执行；没有连接或删除数据库。

| 实际 Vitest | 条件 | 文件／最多并发 worker | 通过／失败 | 累计不同 PID |
|---|---|---|---|---|
| 4.1.11 | `isolate: false` | 8／2 | 8／0 | 2 |
| 5.0.5 | `isolate: false` | 8／2 | 2／6 | 2 |
| 5.0.5 | 上项＋每文件 setup 顶层复位 | 8／2 | 8／0 | 2 |
| 5.0.5 | 上项仅加 `unstubEnvs: true`，仍直接赋值 | 8／2 | 2／6 | 2 |
| 5.0.5 | 省略 `isolate`，使用默认隔离 | 8／2 | 8／0 | 8 |
| 4.1.11 | `isolate: false` | 2／1 | 1／1 | 1 |
| 5.0.5 | `isolate: false` | 2／1 | 1／1 | 1 |

每个失败文件的入口值均来自同 PID 的另一文件。表中 8 个 PID 是整次运行累计，不是同时开 8 个 worker；具体文件调度和失败数量不作为通用保证。非作者在新目录复用了已安装包，七组结论一致。[可读结果](results.json)按 PID 分组为 `worker-N`；原始 PID、JSON 报告和输出由脚本留在本次运行目录。

## 怎么交给 Agent 修

1. **先定位状态边界。** 对照单文件与多文件、实际 PID、模块入口值和清理位置；不要先改预期、加 retry，或为绿灯删业务断言。
2. **优先保默认隔离。** 只有确认需要复用且清理契约完整时，才保留 `isolate: false`。本次没有测隔离的性能成本。
3. **必须复用时，每文件入口直接复位。** 在 `setupFiles` 指定的文件顶层恢复项目确认过的值，例如本探针的 `process.env.TRIAL_TARGET = 'shared-sentinel'`。不要仅放进 `beforeEach`：测试模块可能早已捕获旧值；也不要以运行一次的 `globalSetup` 代替。
4. **区分 env 与模块／资源状态。** setup 文件会重跑，但它导入的模块在无隔离时仍缓存。已创建的客户端、模块级快照和数据库生命周期，要回真实消费者另外验证，不能凭字符串复位宣告修好。

`unstubEnvs` 调用的是 `vi.unstubAllEnvs()`，适用于经 `vi.stubEnv` 登记的修改。本对照只证明它不恢复直接赋值；没有测试 `vi.stubEnv` 改写方案或并发测试安全。原 #11423 仍 open；相关 #11441 已关闭但未合并，不能把 PR 的 closed 当成新版已修。

**依据**：[社区：实际用户与最小复现](https://github.com/vitest-dev/vitest/issues/11423)；[官方：setupFiles](https://vitest.dev/config/setupfiles)、[默认隔离](https://vitest.dev/config/isolate)、[unstubEnvs](https://vitest.dev/config/unstubenvs)、[env](https://vitest.dev/config/env)；[固定主干逐文件循环](https://github.com/vitest-dev/vitest/blob/42770759fcca4ff82ab4df49e4ee241f4f680e99/packages/vitest/src/runtime/runBaseTests.ts)与[未合并 PR](https://github.com/vitest-dev/vitest/pull/11441)；本仓官方 CLI 实跑。核实 2026-10-31。中文社区定向检索 LINUX DO／V2EX 未找到本题直接原帖，不计独立背书；现有证据支持这一窄排障选择，最高水平和模型收益未知，非原业务迁移验收。

## 复跑

需 POSIX、Python 3.11+、Node 24 与 npm；从本仓根执行。安装仅在新临时目录，使用空 npm 用户／全局配置、不执行包安装脚本；下载官方包需要网络。锁文件留在各安装目录，下面固定顶层版本，非跨时间的全依赖锁定。

```bash
set -eu
work=$(mktemp -d)
mkdir "$work/home"
: > "$work/user.npmrc"
: > "$work/global.npmrc"
for version in 4.1.11 5.0.5; do
  dir="$work/vitest-$version"
  mkdir "$dir"
  printf '{"private":true,"type":"module","devDependencies":{"vitest":"%s","vite":"8.3.5"}}\n' "$version" > "$dir/package.json"
  HOME="$work/home" npm --prefix "$dir" \
    --userconfig "$work/user.npmrc" --globalconfig "$work/global.npmrc" \
    --cache "$work/npm-cache" --registry https://registry.npmjs.org \
    install --ignore-scripts --no-audit --no-fund
done
python3 experiments/vitest-worker-env/consumer_probe.py \
  --vitest4 "$work/vitest-4.1.11" --vitest5 "$work/vitest-5.0.5" \
  --root "$work/run"
printf 'Results: %s/run/results.json\n' "$work"
```

以上入口已新装官方依赖后复跑七组，结果与表中一致。脚本用新 HOME 和白名单环境运行真实 Vitest，不读取业务配置；每组验证文件身份、receipt／测试计数、无 skip、断言与入口值一致、实际 PID 复用及跨文件值来源。报告中的预期失败不是探针失败：七组符合固定版本的对照才 exit 0；缺安装、已有输出目录、收集失败或行为不符均 exit 2，不覆盖旧结果。

本次只验 `forks`、模块顶层直接赋值与上述配置，未跑上游完整套件、原数据库项目、Windows／macOS 或模型；没有向上游发帖／改源码。不要把此探针当通用升级验收或从结果推算提速。
