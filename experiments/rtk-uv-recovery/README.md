# RTK 过滤了 uv 失败输出，但没有恢复提示

**不要把“没看到 stdout／没给 recall”当成程序没产出结果。** 已用 RTK 的 `uv run` 用户，先读已有日志和落盘状态；确需下一次执行时保留原生输出，或只取消这一类自动改写。操作见[上下文页](../../docs/03-context-engineering.md#rtk-uv-short-failure)。

自然消费者是 [RTK #4860](https://github.com/rtk-ai/rtk/issues/4860)：使用者在 Windows＋Claude Code 中自报频繁使用 uv，失败时部分结果丢失、`tee=always` 仍没有记录，Agent 因而重复执行或据不完整信息判断。本仓按原帖程序，在 Linux 实际运行 Python、uv 和 RTK OSS 1.1.0；不是 Windows／Claude Code 复现，也不是先前 1.0.1 的历史日志回放。

## 读者需要区分的三件事

1. **退出码保留，不代表诊断完整。** 带 `warn` 的失败，普通 `partial result: 17` 被诊断提取器过滤；只有普通 stdout 的失败反而保留它，不能说“一切非零退出都丢 stdout”。
2. **恢复层先检查捕获的合并 raw 是否至少 500 bytes，再看恢复配置。** 小于门槛时，legacy tee always 和 SQLite 都无记录。这把本仓[已有源码门槛说明](../../docs/research/2026-10-22-frontier-trials.md#rtk输出变短与恢复能力分开选)变成当前真实执行对照，不是首次发现该常量。RTK 会处理行末，不能用任意原生两流字节之和直接推门槛；本例边界输入均有完整换行。
3. **够门槛且保存成功时，仍应优先恢复，不重跑。** 本例 500 bytes 的 tee 文件／SQLite recall 都包含原先被滤掉的结果；执行计数没有增加。失败恢复 slug 是 `uv`，只找成功分支的 `uv-run-stdout` 文件会漏判。

正式 OSS **1.1.0**，已安装 uv **0.13.4**、Python **3.12.14**。原帖使用 uv 0.11.21、Python 3.14.4；没有据 Linux 结果宣称 Windows 已验证。

| 实际程序输出与退出 | 过滤后普通结果 | legacy tee always | SQLite |
|---|---|---|---|
| 24 bytes：结果＋warn，exit 3 | 消失，仅留 warn | 无记录 | 无记录 |
| 19 bytes：只有结果，exit 3 | 保留 | 无记录 | 无记录 |
| 24 bytes：结果＋warn，exit 0 | 两者保留 | 无记录 | 无记录 |
| 短 traceback，exit 1 | 结果及源代码行消失，错误类型保留 | 无记录 | 无记录 |
| 换行完整的 499 bytes：结果＋填充＋warn，exit 3 | 消失 | 无记录 | 无记录 |
| 换行完整的 500 bytes：同上，exit 3 | 摘要中消失 | 完整取回 | 完整取回 |

每种恢复模式六项，均与原生 uv 对照；配置先通过 `rtk config` 验证。两个短失败另跑 `rtk bypass`，结果和 traceback 源行保留，且执行计数增加——它确实是重新执行，不是回放。原生 stderr 经当前 RTK 包装后出现在 stdout，不能假定流的归属不变。这里没有测试真实业务副作用；计数文件只是区分执行与读取的夹具。

非作者用自己的脚本与隔离 HOME，复用同一官方二进制，独立运行两种模式的 24／499／500-byte 六条件；500-byte 两路恢复内容与原文逐字节相同，计数仍为原生＋RTK 两次。作者另按本页完整命令重新取包、校验与执行，行为结果一致。独立复跑首次无末尾换行的填充会被捕获层补齐，从而越过门槛，故正文限定为捕获 raw、固定完整换行，不把原生日志长度当普遍等值。

## 自动改写排除只控制外层入口

使用合成 PreToolUse JSON 实际调用官方 `rtk hook claude`，但没有安装 Hook、启动 Claude 或执行改写后的命令：

| 输入 | 默认改写 | `[hooks] exclude_commands = ["uv"]` |
|---|---|---|
| `uv run script.py` | `rtk uv run script.py` | 原命令 |
| `PYTHONUTF8=1 uv run script.py` | `PYTHONUTF8=1 rtk uv run script.py` | 原命令 |
| `uv run pytest tests/test_sample.py` | `uv run rtk pytest tests/test_sample.py` | 仍同左 |

因此排除 `uv` 适用于取消普通脚本的外层过滤，不等于停掉所有 uv 派生工具的专用过滤，也不影响你显式输入的 `rtk uv …`。调整真实配置时合并既有数组；原项目验收与权限仍保留。

## 在新的临时目录复跑

已有 Linux x86_64、Python 3、uv、curl、tar、sha256sum。在本知识库根目录执行。取官方 **OSS** 资产，校验发布哈希；不执行安装器，不装全局 Hook，不运行收费引擎或模型。探针创建自己的 HOME／XDG、关闭遥测，uv 强制 offline 且禁止下载 Python。

```sh
(
set -eu
A1DBV=$(pwd)
TRIAL=$(mktemp -d)
cd "$TRIAL"
curl -fL --connect-timeout 15 --max-time 90 --retry 0 \
  https://github.com/rtk-ai/rtk/releases/download/v1.1.0/rtk-oss-x86_64-unknown-linux-musl.tar.gz \
  -o rtk-oss-x86_64-unknown-linux-musl.tar.gz
printf '%s  %s\n' \
  4dec94a64035e08189ae82fd5408fe4ae9ae27a665fc07e3e3ec3c4c2d8e8a3e \
  rtk-oss-x86_64-unknown-linux-musl.tar.gz | sha256sum --check
mkdir bin
tar -xzf rtk-oss-x86_64-unknown-linux-musl.tar.gz -C bin rtk LICENSE
python3 "$A1DBV/experiments/rtk-uv-recovery/consumer_probe.py" \
  "$TRIAL/bin/rtk" "$TRIAL/evidence" > "$TRIAL/summary.json"
printf 'Evidence directory: %s\n' "$TRIAL"
)
```

探针拒绝已有输出目录、缺参数／二进制或不支持的环境；不覆盖已有证据。成功时断言上述分支，并保留各次原始 stdout／stderr、有效配置和计数；[公开结果](results.json)只保留必要观察及哈希。traceback 总字节数随临时路径长度变化，不要求与表中某一机器固定相等。

## 固定来源与范围

- [用户原报告 #4860](https://github.com/rtk-ai/rtk/issues/4860)、[官方 1.1.0 发行与 checksums](https://github.com/rtk-ai/rtk/releases/tag/v1.1.0)。选 Apache-2.0 的 OSS 包，不是含 BUSL 引擎的默认资产。未找到明确关联本问题的已合入修复；自动 triage 不是作者确认。
- 发行提交 `753a3b0e939f2e4490fc24e3a1984010f40a103c` 的 [uv 过滤](https://github.com/rtk-ai/rtk/blob/753a3b0e939f2e4490fc24e3a1984010f40a103c/src/cmds/python/uv_cmd.rs#L71-L113)、[traceback 选择](https://github.com/rtk-ai/rtk/blob/753a3b0e939f2e4490fc24e3a1984010f40a103c/src/cmds/python/uv_cmd.rs#L221-L270)、[恢复门槛](https://github.com/rtk-ai/rtk/blob/753a3b0e939f2e4490fc24e3a1984010f40a103c/src/core/tee.rs#L60-L66)与 [500-byte 常量](https://github.com/rtk-ai/rtk/blob/753a3b0e939f2e4490fc24e3a1984010f40a103c/src/core/retriever.rs#L20)。develop `6c2313a6616b81408d776b39921a934e39f841ae` 的 uv 文件相同，仅源码核对，未运行该分支。
- [官方排除规则](https://github.com/rtk-ai/rtk/blob/v1.1.0/docs/guide/getting-started/configuration.md#L141-L158)、[bypass 入口](https://github.com/rtk-ai/rtk/blob/v1.1.0/README.md#L222-L226)、[恢复配置实现](https://github.com/rtk-ai/rtk/blob/v1.1.0/src/core/config.rs#L87-L115)。bypass 只指取消输出过滤，不是绕开权限。

核实与 Linux 实跑：**2026-10-31 UTC**。未运行完整上游测试、真实 Claude 会话、Windows、模型或端到端收益对照，不修改本仓默认工具／评级。本轮重点是现有读者排障，不另开重复 issue 或提交未经完整测试的生产补丁。
