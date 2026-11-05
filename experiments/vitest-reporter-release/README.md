# Vitest agent reporter：真实发布脚本回归的诊断回放

🧪 **已有 Vitest 5 的项目可沿用原生 agent/minimal reporter；需要的失败差异、堆栈与计数都在时，先修具体错误，不惯性改 verbose 或叠第二份 reporter。** 本次在 GenomeSpy 的真实发布脚本改动上采用，成功输出仍带子进程日志；不把原生简报器描述成完全静默，也未证明模型成本或效率优于其他 reporter。

## 真实任务与四次运行

GenomeSpy 的固定修改 `d8547c2a9f8920239fabcd1c50a727e61a169104` 要求 Markdown 源与生成 changelog 保持折行，而 GitHub release 正文去掉段内软换行，保留列表、代码块与贡献者内容。使用上游原有 `scripts/release.test.mjs`，没有新增合成断言。对照基线为该提交的父 `ca29c3a6922b65832b90c3220e86d02fababe6ce`；当前读取 `5a2b42d33fd007c918a98d7e486b777b9d421a1b` 的这两个脚本与该修复提交完全相同。

| 阶段 | 实际结果 | 根据 agent 输出采取的下一步 |
| --- | --- | --- |
| 当前完整发布脚本回归 | exit 0，14 passed | 原生简报器可用于这项回归 |
| 旧源码＋同一新版上游回归 | exit 1，12 passed／2 failed | 行342：总 changelog 缺折行；行455：GitHub 正文仍含软换行；期待／实际差异完整可读 |
| 只重放上游 release.mjs 修复，筛选上述两项 | exit 1，1 passed／1 failed／12 skipped | GitHub 项转绿；行352暴露包级 CHANGELOG 仍不折行，继续核共享格式配置 |
| 再补上游同提交的 proseWrap 配置，重跑完整文件 | exit 0，14 passed | 该脚本回归闭合；不以筛选组的 skip 冒充通过 |

这不是新发现的上游缺陷或原创修复。一次只补脚本、漏带真实配置的中间失败，展示的是如何用原有失败报告接着完成补丁验收；没有改弱断言，没有切 reporter，也没有执行真实 GitHub 发布。原测试自行构造临时工作区／Git 历史，对 GitHub fetch 使用替身；其纯本地发布准备与 changesets 命令实际运行，生成物和临时仓库由原测试清理。未验证真实服务、其他项目或完整产品测试。

## 复跑

Node 24.22.1、npm 11.9.0、锁定 Vitest 5.0.5，项目为 MIT。npm 官方依赖安装使用 `npm ci --ignore-scripts --no-audit --no-fund`，未装项目 hooks；发布脚本回归不依赖被跳过的生命周期脚本。原 `package-lock.json` SHA256：`b4914c46d27069de6403a2a7997571f749e03fa1d39a4ee2912dd3f76cc058d0`。在独立临时 clone 内运行，不在生产发布目录覆盖文件。

```sh
git clone https://github.com/genome-spy/genome-spy.git genomespy
cd genomespy
git checkout 5a2b42d33fd007c918a98d7e486b777b9d421a1b
npm ci --ignore-scripts --no-audit --no-fund
CI=true node node_modules/vitest/vitest.mjs run scripts/release.test.mjs --project release-tools --reporter=agent
# 新增第二个独立临时 worktree；复用同一锁文件依赖。
git worktree add --detach ../genomespy-before ca29c3a6922b65832b90c3220e86d02fababe6ce
ln -s ../genomespy/node_modules ../genomespy-before/node_modules
cp scripts/release.test.mjs ../genomespy-before/scripts/release.test.mjs
cd ../genomespy-before
CI=true node node_modules/vitest/vitest.mjs run scripts/release.test.mjs --project release-tools --reporter=agent
# 预期失败，保留原诊断，再重放上游脚本修复。
git show d8547c2a9f8920239fabcd1c50a727e61a169104:scripts/release.mjs > scripts/release.mjs
CI=true node node_modules/vitest/vitest.mjs run scripts/release.test.mjs --project release-tools --reporter=agent -t 'groups categories independently|GitHub output unwraps'
# 此时仍有一项真实配置遗漏，不改测试；补齐同提交配置。
git show d8547c2a9f8920239fabcd1c50a727e61a169104:.prettierrc.json > .prettierrc.json
CI=true node node_modules/vitest/vitest.mjs run scripts/release.test.mjs --project release-tools --reporter=agent
```

每步记录实际退出码；上述命令没有用 `set -e`，预期失败后仍需读取诊断。四份输出替换本机工作区绝对路径，并去掉文件末尾多余空行。原始终端时间受环境时区影响，不作跨运行效率比较。依赖共享与已知修复重放不构成盲测或 reporter 对照实验。

## 来源

- [真实修复与原回归](https://github.com/genome-spy/genome-spy/commit/d8547c2a9f8920239fabcd1c50a727e61a169104)、[固定项目 Agent 测试指引](https://github.com/genome-spy/genome-spy/blob/5a2b42d33fd007c918a98d7e486b777b9d421a1b/AGENTS.md)：要求窄范围运行与 agent reporter，达到相关验收后停止，不无故叠检查。
- [Vitest 官方 reporter 选择](https://vitest.dev/guide/reporters)、[5.0.5 minimal 实现](https://github.com/vitest-dev/vitest/blob/7a825db43e2beca0b219d2eadaec334cb81af0c7/packages/vitest/src/node/reporters/minimal.ts)。沿用已有候选的官方与社区取舍，不据本次成功推广为所有测试框架的默认。

实跑：2026-11-05。对噪声来自子进程、需要 JUnit／JSON 等消费者的项目，简报器不替代专用产物或日志处理；本次完整失败信息已足够，不需要换 reporter 才继续。
