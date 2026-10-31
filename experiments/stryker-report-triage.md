# Stryker 100 分还有 17 errors：先分编译错误与零测试

**🧪 已有 mutation 流水线时，让 Agent 先读逐项状态和诊断，再决定修 runner 还是补测试。** 本次在真实 openclaw-atif 项目跑出 **11 Killed＋17 CompileError**：17 项确实无法通过原 TypeScript 编译，不是测试漏跑；100 分只代表 11 个有效变异均被测试检出。保留原 checker 和阈值，不为消掉 errors 而放宽类型检查，也不用为这 17 项硬补断言。

## 从报告决定下一步

| 看到什么 | 该做什么 |
|---|---|
| `Survived`、有 `coveredBy`，但 `testsCompleted: 0` | 先排查 runner 的测试选择。旧 Stryker 10.0.0 与 Vitest 5 的名称分隔符不兼容就是实际案例；不能先认定断言不足 |
| `CompileError`、有编译诊断，`testsCompleted` 字段缺失 | 核变异是否真的不能编译；本例逐个用原 `tsconfig` 直接编译，17 项全部重现。不将缺失字段补成 0 再套上一行 |
| `RuntimeError` | 看具体运行／runner 错误；它同样不进分数分母，不能凭总分接受，也不能按本例归为类型错误 |
| 测试确实执行后仍 `Survived`，或状态为 `NoCoverage` | 回业务契约判断：补缺失的行为测试，或说明等价变异；不要直接降低阈值 |

**`coveredBy` 也不能单独作判定。** 本次顶层常量的静态变异 `id: 0` 是 `coveredBy: []`，但 `static: true`、`testsCompleted: 93`、状态 `Killed`；测试在新环境里执行了，不能把空数组直接改判为漏覆盖。

## 真实消费者结果

固定 openclaw-atif `1d31cb8efb6db04704aa34807b22ff3bd5db592c`，Node 24.22.1、npm 11.9.0；从原锁文件安装 Stryker 三包 10.1.1、Vitest／coverage-v8 5.0.5、TypeScript 6.0.3。应用、测试、锁文件和配置未改，只有本次 CLI 加 JSON reporter、将 worker 并发设为 2。

| 原项目范围 | Killed | CompileError | 其他状态 |
|---|---:|---:|---:|
| `src/atif/identity.ts` | 8 | 2 | 0 |
| `src/stable-json.ts` | 3 | 15 | 0 |
| 合计 | **11** | **17** | **0** |

- `npm test`：33 文件、358 测试通过。原 mutation 命令的 dry run 报告 172 测试通过；这是 mutation runner 自己的选择范围，不冒充完整普通测试数。
- `coverageAnalysis: "perTest"`、TypeScript checker、两文件 mutate 范围和 break 阈值 **85** 均保留。命令 exit 0，分数为 `11 / 11 × 100 = 100`，不是 28 次测试杀死变异。
- 11 个 `Killed` 都有 `testsCompleted > 0`，表示变异激活后发生测试失败；不声称每项都走到了显式断言。
- 17 个 `CompileError` 都缺少 `testsCompleted`，诊断包括删掉返回值（TS2355）、破坏 `unknown` 类型收窄（TS18046／TS2769）、非法摘要编码（TS2345）等。另在隔离副本按报告坐标逐个替换全部 28 个变异，原 `tsc --noEmit -p tsconfig.json` 对 17 项退出 2、诊断码逐项一致；另 11 项编译通过，恢复原源码后再编译通过。

这次补齐的是 **errors 的实跑分类**。此前 #35 的作者记录旧组合出现十个零测试 survivor，并已升级修复；本轮没有重跑那个旧组合。相同总数也不能反推过去 CI 中每个 error 的原因相同。

## 照原项目重放，不另造评分工具

在一次性目录运行，使用符合该项目政策的 Node 24.11+ **24.x**。只处理仓库自带合成夹具，不接个人 OpenClaw 会话。

```bash
git clone https://github.com/openclaw/openclaw-atif.git
cd openclaw-atif
git checkout --detach 1d31cb8efb6db04704aa34807b22ff3bd5db592c
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run mutate -- --concurrency 2 --reporters clear-text,json
```

`--ignore-scripts` 只跳过安装生命周期；随后 `npm test` 的原 pretest 和 Stryker 的原 buildCommand 都实际构建。JSON 位于 `reports/mutation/mutation.json`，先用现有 Node 查看，不必开 DEBUG 或加新的报告服务：

```bash
node --input-type=module <<'JS'
import fs from 'node:fs';
const report = JSON.parse(fs.readFileSync('reports/mutation/mutation.json', 'utf8'));
const counts = {};
for (const [file, entry] of Object.entries(report.files)) {
  for (const m of entry.mutants) {
    counts[m.status] = (counts[m.status] ?? 0) + 1;
    console.log({ file, id: m.id, status: m.status, static: m.static,
      testsCompleted: m.testsCompleted ?? 'absent',
      covered: m.coveredBy?.length,
      compileReason: m.status === 'CompileError' ? m.statusReason : undefined });
  }
}
console.log(counts);
JS
```

预期计数为 `{ Killed: 11, CompileError: 17 }`（键顺序不限）。其他版本／项目的数量可能不同，应按自己的状态与诊断判断。原始 JSON 含源码、项目路径和失败输出；只在本地检查，分享前提取必要字段并人工脱敏。

## 来源、比较与边界

| 覆盖 | 这次决定的依据／取舍 |
|---|---|
| 官方实现与度量 | [状态与分母](https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/)、[静态变异](https://stryker-mutator.io/docs/mutation-testing-elements/static-mutants/)、[测试选择修复 #6214](https://github.com/stryker-mutator/stryker-js/pull/6214)：区分未执行、不可编译和实际测试失败 |
| 实际采用与源码 | [openclaw-atif #35](https://github.com/openclaw/openclaw-atif/pull/35)、[固定配置](https://github.com/openclaw/openclaw-atif/blob/1d31cb8efb6db04704aa34807b22ff3bd5db592c/stryker.config.mjs)：保留真实范围，新增 1 个 errors 分类实测，不再复述发布说明 |
| 同题候选与英文反馈 | 既有 mutmut 3.8.0 候选适合 Python，不替换本项目 runner；云端 curl 读 [Flawd 作者帖与评论](https://news.ycombinator.com/item?id=49536607)，多语言／Agent 报告是作者自报，未给出本例兼容性证据，不为此引入新工具 |
| 中文读者反馈 | 云端 curl 读 [LINUX DO 代码评审复盘及评论](https://linux.do/t/topic/3004044)，有批量改码后验收需求，但没有本题 mutation 证据，新增直接证据 0 项；未解析帖内截图 |

这是既有收件箱问题的定向复核，不是全生态排名；已用原生报告即可完成判断，最高水平的跨工具净收益未知。核实与云端 Linux 实测：2026-10-30。未运行真实模型、个人会话、原生 Windows 或本项目完整发布门禁；不是 hosted CI 复验或应用发布验收。
