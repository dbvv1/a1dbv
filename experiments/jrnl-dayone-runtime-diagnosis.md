# jrnl：用落盘值与原生 trace 定位 DayOne 时间偏移

**采用结果：真实 CLI 已从“写入 23:59、读成次日 00:59”修回原时间。**
**改变判断的是落盘 UTC 正确、读回转换错误；不是多装一个诊断工具。**
**新回归与原 DST 场景共 22 项通过；全套仍有原基线同样的 4 个排版失败，上游尚未接收。**

## 真实需求与固定版本

[jrnl #1422](https://github.com/jrnl-org/jrnl/issues/1422) 报告 DayOne 日记在夏令时切换附近偏移一小时。不是为试工具制造的缺陷；原报告来自项目维护者，已有 [#1423](https://github.com/jrnl-org/jrnl/pull/1423) 加入回归并暂时跳过问题场景，未修复 #1422。2026-10-26 检查 issue 仍开放，同题没有开放 PR。

- 产品基线：`jrnl-org/jrnl` main `90de4948d79a4fca8c7238dd2487b599f458c903`。
- 本地补丁：`07b19a3e8d242a85fa7afa42b32cc6526b4afa3f`；可应用的[三文件差量](jrnl-dayone-runtime-diagnosis.patch)。已推到 [dbvv1/jrnl fork](https://github.com/dbvv1/jrnl/tree/dot-a/dayone-dst-1422)：远端 `bae4e971a7377f126d889082a7254b1e215edb84` 与本地补丁树相同；创建上游 PR 被集成接口403拒绝，回读未创建，未换路重试。
- 环境：Linux、Python 3.12.14；复核时已安装依赖逐项对齐 `poetry.lock`，包括 tzlocal 5.4.4、pytest 9.1.1、pytest-bdd 8.1.0。CLI 子进程用 `TZ=America/Los_Angeles`。
- 数据：一次性 DayOne 目录、合成日记与显式 `--config-file`。`HOME` 和两个 XDG 目录也指向测试目录，因为配置加载会补默认路径；不使用真实配置、日志或账号。

## 先分三种原因，不先修时间算法

原输入：`2022-03-12 at 11:59pm: DST regression entry`。写入与查询都从 `python -m jrnl --config-file ...` 进入，查询用 `--short`。

| 假设 | 实际观察 | 下一步 |
|---|---|---|
| 日期解析把输入变成第二天 | plist 的 `Creation Date` 是 `2022-03-13 07:59:00` UTC，`Time Zone` 是 `America/Los_Angeles` | UTC 与原来的 23:59 PST 对应，继续查读取 |
| 写盘时选错夏令时偏移 | 同一落盘值在独立 UTC→当地转换中为 `2022-03-12 23:59:00-08:00` | 不改写入代码，不迁移数据 |
| 读取把 UTC 当成本地时间求 offset | `sys.settrace` 只观察 `DayOne.open`：原第 66 行 `date=07:59`，第 69 行变成 `00:59`；代码对 naive UTC 调 `timezone.utcoffset(date)` 得到 -07 | 修读取时区转换，保留原 CLI 验收 |

原 CLI 输出 `2022-03-13 00:59 DST regression entry`；修后同一输入输出 `2022-03-12 23:59 DST regression entry`，落盘仍为同一个 UTC 值。秋季输入 `2022-11-05 at 11:59pm` 的旧输出是当日 `22:59`，修后也为 `23:59`。

**人的验收语义是“绝对时刻不变，按记录的时区显示”；Agent 负责把输入、持久化与读取局部变量串起来。** 这里直接使用原生 trace 足够：它观察到了能区分三种假设的值。只读报错或逐个升级日期库均不能提供这个区分；堆分析、诊断平台和额外诊断 Agent 没有新增必要观察量，因此未引入。没有做方法效率胜负测试。

## 修复与反例

`DayOne.open` 把 plist 日期标记为 UTC，再 `astimezone(timezone)`，最后仅为 jrnl 既有 naive 本地日期模型移除 `tzinfo`。没有改日期解析、写入格式或配置路径。

新 16 例包括：美国、欧洲春秋切换前后，秋季重复时间的两个 `fold`，UTC 与印度固定偏移控制，缺失 `Time Zone` 的本地回退，以及两个完整 CLI 写入→plist→读回。相同测试在未修基线 **10 失败、6 通过**，修后 **16 通过**。

完整回归发现一条旧期望本身有误：现有 Stockholm 夹具存 `2013-10-27T02:27:27Z`，应显示回拨后的 `03:27`，旧断言却要求 `04:27`。用独立系统命令 `TZ=Europe/Stockholm date -d '2013-10-27 02:27:27 UTC'` 核到 `03:27:27 +0100` 后才改期望，并恢复 #1422 原先跳过的 5 个场景。没有为绿灯改动其余排版断言。

## 复跑与验收范围

在隔离环境按上游方式安装锁定依赖，把补丁应用到固定基线。以下从项目根目录执行，`TEST_HOME` 必须是一次性测试目录：

```bash
git apply --check /path/to/jrnl-dayone-runtime-diagnosis.patch
git apply /path/to/jrnl-dayone-runtime-diagnosis.patch
export HOME="$TEST_HOME"
export XDG_CONFIG_HOME="$TEST_HOME/config"
export XDG_DATA_HOME="$TEST_HOME/data"
TZ=America/Los_Angeles poetry run pytest -n0 -q \
  tests/unit/test_journals_dayone_journal.py tests/bdd/test_features.py \
  -k 'open_converts_utc_creation_date or open_without_timezone or cli_dayone_round_trip or ambiguous_time_stamp or using_tomorrow_near_daylight_savings'
```

| 检查 | 结果 |
|---|---|
| 上述新回归、旧 Stockholm 与恢复的 5 个 DST 场景 | 22 通过 |
| 锁定依赖的完整 pytest，原基线 | 691 通过、4 失败、40 跳过 |
| 锁定依赖的完整 pytest，最终补丁 | 712 通过、4 失败、35 跳过 |
| 失败差量 | 仍是同 4 个 `test_printing_a_journal_that_has_multiline_entries_with_tags`，分别针对单文件、加密、目录、DayOne 格式；非本补丁新增 |
| 更广 DayOne 选择集 | 102 通过、1 个上述既有排版失败、2 跳过 |
| 修改文件 Ruff、Black、补丁空白 | 通过 |

跨平台 CI、真实 Day One 客户端与用户原始日记未运行；这次接收的是 jrnl CLI 的同题修复，不是第三方产品全量 QA。读入秋季两个重复时刻已覆盖，重新编辑这些歧义时刻的完整写回策略未改动。上游贡献由非作者复核补丁与[贡献规范](https://github.com/jrnl-org/jrnl/blob/90de4948d79a4fca8c7238dd2487b599f458c903/docs/contributing.md)后接续；没有发现 AI 禁止或 CLA 条款，正式提交仍需遵守平台确认边界。

**来源与探索回执（2026-10-26）**：[一手／用户] 上游 #1422 与 #1423；[一手／实现] 固定源码、贡献规范、现有跳过测试；[官方] Python 3.12 [datetime 转换](https://docs.python.org/3.12/library/datetime.html#datetime.datetime.astimezone)、[zoneinfo 的 UTC 转换与 fold](https://docs.python.org/3.12/library/zoneinfo.html#using-zoneinfo)、[plistlib](https://docs.python.org/3.12/library/plistlib.html)；[实测] 原生 trace、落盘检查、CLI 与 pytest。这是既有 17 诊断选择的真实采用，不是新一轮全行业方法评比。
