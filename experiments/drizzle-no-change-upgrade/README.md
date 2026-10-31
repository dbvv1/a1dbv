# 升级迁移器：先用不变 schema 检查第一次产物

**🧪 让 Agent 升级 ORM／迁移器时，先只升级工具和快照，不混入业务 schema 改动；立即检查第一次生成的 SQL。** `up` 成功只说明格式转换完成，第二次 `generate` 无变化也可能是第一次已把漂移写进新快照。已有迁移器能正确处理的项目沿用原工具，不为这一步另造迁移框架。

## 真实消费者与本次结果

Drizzle #6020 的使用者升级既有 PostgreSQL 项目后，遇到未改 schema 却生成额外 DDL；他用 Claude 整理了公开三提交复现。这里复用其原始旧快照与 schema，不把 Claude 参与复现说成缺陷由 AI 引起。10-24 的 #6589 又报告 rc.5 的同类升级问题，因而选正式 npm **ORM／Kit 均为 1.0.0-rc.4、1.0.0-rc.5** 对照，而非只重放旧版本。

两臂均从复现仓库 `f82ce220` 开始：原 ORM 0.45.2／Kit 0.31.10、快照 v7。只换工具版本，实际执行 `up → generate → generate`：

| 检查 | rc.4 | rc.5 |
|---|---|---|
| `up` 退出码／快照格式 | 0／v8 | 0／v9 |
| 第一次 `generate` | 退出 0，新建 1 个迁移、4 条 SQL | 同左 |
| 额外 SQL | timestamp 类型变更、索引删除＋重建、check 替换 | 同左 |
| 复现中的 view | 无变更 DDL | 无变更 DDL |
| 第二次 `generate` | 退出 0，文件完全不变 | 同左 |
| schema／配置、历史 SQL 内容 | 保持不变 | 保持不变 |

**两版都未通过“不改 schema 不产生新迁移”的验收；rc.5 不能视作此复现的修复。** 其源码确有 timestamp 空格规范化，但位于旧 format 4→5 路径；本次 v7→v8→v9 不经过它。部分索引和 check 的列限定名也保留在转换快照中，随后生成器改成无限定名，造成差异。四条 SQL 中 check 的删加合在一条语句内。

给 Agent 的接手要求可以直接写成：

> 在隔离副本中保留当前 schema 和历史迁移，按项目原包管理器升级目标版本；只运行快照转换及 SQL 生成，交回第一次 SQL、前后 schema／配置校验和、历史 SQL 是否保留、再次生成是否稳定。出现非预期 DDL 就停在审稿，不应用到数据库；先分清工具漂移和真实 schema 变更。

修复或升级候选应从同一旧快照重做验收；不要用第一次漂移产生的新快照作“已修复”起点。**不要仅为求零 diff 删除 SQL、改旧历史或把迁移替换为空操作。** 若确实要校正快照，必须另证语义等价及已有数据库的迁移历史；本试验不提供这种修复。

## 复跑

需要 Python 3.11+、Node.js 24、Git、npm 和可安装可信公开依赖的一次性 POSIX 目录。**从 a1dbv 仓库根目录运行**以下 Bash；本仓实跑为 Linux／Node 24.22.1。安装只为对照，不是替真实项目更换包管理器；原复现未提供许可证，因此源码由读者直接取回，本仓不再分发。

```bash
set -eu
repo="$PWD"
work=$(mktemp -d)
git clone https://github.com/janvorwerk/drizzle-issue-6020.git "$work/source"
npm install --prefix "$work/rc4" --cache "$work/npm-cache" \
  --ignore-scripts --no-audit --no-fund --save-exact \
  drizzle-orm@1.0.0-rc.4 drizzle-kit@1.0.0-rc.4
npm install --prefix "$work/rc5" --cache "$work/npm-cache" \
  --ignore-scripts --no-audit --no-fund --save-exact \
  drizzle-orm@1.0.0-rc.5 drizzle-kit@1.0.0-rc.5
export DRIZZLE_REPRO="$work/source" DRIZZLE_RC4="$work/rc4" DRIZZLE_RC5="$work/rc5"
python3 "$repo/experiments/drizzle-no-change-upgrade/test.py" -v
probe_exit=0
python3 "$repo/experiments/drizzle-no-change-upgrade/run.py" \
  "$DRIZZLE_REPRO" "$DRIZZLE_RC4" "$DRIZZLE_RC5" "$work/result" || probe_exit=$?
test "$probe_exit" -eq 1
python3 -c 'import json,sys; r=json.load(open(sys.argv[1])); assert r["acceptance"] == {"noChangeUpgradeFailures":2,"passed":False}' "$work/result/result.json"
```

预期 **7 项脚本测试通过，实际探针退出 1**，报告 `noChangeUpgradeFailures=2`；同时核结果文件，不只看非零退出码。退出 2 是输入／环境或执行失败，不能当成检出了迁移漂移。探针从固定提交取六个已审文件并核 hash，分别在新副本运行已安装 CLI；保留三个阶段的快照／SQL及原始日志。`result.json` 仅含汇总与 hash，可对照本目录[实跑结果](result.json)。原始日志含本地路径、阶段产物含上游源码，留在本地；临时目录由运行者确认后清理。

本次没有连接数据库、应用 SQL、调用模型或测试原生产项目；没有独立验证表重写、锁时长、性能影响。复现中的简单 view 不漂移，不能外推作者复杂 view；#6589 的 custom type 未纳入本夹具。这里验证的是升级验收方法，不是 Drizzle 全面选型或通用 SQL 等价判断。

**依据与核实：2026-10-31。** [原始问题 #6020](https://github.com/drizzle-team/drizzle-orm/issues/6020)、[作者的 Claude 复现说明](https://github.com/drizzle-team/drizzle-orm/issues/6020#issuecomment-4995801368)、[固定旧基线](https://github.com/janvorwerk/drizzle-issue-6020/tree/f82ce2201728d56b34cbf43cd21c88b6b001da02)、[近期 rc.5 反馈 #6589](https://github.com/drizzle-team/drizzle-orm/issues/6589)、[官方 up](https://orm.drizzle.team/docs/drizzle-kit-up)与[generate](https://orm.drizzle.team/docs/drizzle-kit-generate)、[rc.5 转换源码](https://github.com/drizzle-team/drizzle-orm/blob/5d71fc408add08bd207f4753f4554578ec9e0640/drizzle-kit/src/dialects/postgres/versions.ts)。#6443 已关闭未合并，不作为修复依据；未向上游提交贡献。
