# 换成 uv 注入 `.env` 前，验应用实际读到的值

**🧪 迁移时先保留原 `.env` 解释器，逐项确认实际进程收到的值后再换入口。** 2026-11-15 的固定对照中，uv 0.13.6 会在未加引号的空格值处给出警告，却继续启动命令并返回 0；应用得到部分环境，而不是完整配置。只检查退出码会漏掉这类迁移差异。

这是 [uv #23226](https://github.com/astral-sh/uv/issues/23226) 的真实迁移报告验证，不是新产品或自造迁移需求。夹具全部为合成字符串；消费者只读取三个指定变量，不导出真实环境。

| 输入 | python-dotenv 1.2.2 | uv 0.13.6 |
|---|---|---|
| `SAMPLE=hello world` | `hello world` | 未设置，警告，进程仍运行 |
| `SAMPLE="hello world"` | `hello world` | 相同 |
| `SAMPLE=cost$MISSING` | `cost$MISSING` | `cost`，无解析警告 |
| `SAMPLE='cost$MISSING'` | 原样 | 相同 |
| `SAMPLE=$A_PLAIN`，A=short、A_PLAIN=long | `$A_PLAIN` | `short_PLAIN` |
| `SAMPLE=${A_PLAIN}` | `long` | 相同 |
| 合法 BEFORE、错误空格行、合法 AFTER | 全部加载 | 只收到 BEFORE |

所有18次消费者执行均退出0；2次uv执行有解析警告。命令成功不是配置等价。要保留字面值，可试单引号；需要替换变量则显式用 `${NAME}`，但这会改变原先裸 `$NAME` 的字面语义，不能自动批量替换。这里的修正只覆盖表内字符，不是跨 dotenv 实现的通用序列化规则。

## 重跑与接收

需要 `uv 0.13.6`、当前 Python 中的 `python-dotenv 1.2.2`。不自动安装依赖：

```sh
python probe.py > results-new.json
```

探针用临时目录、固定合成环境、离线 uv 与显式 Python 可执行文件，断言正常、解析失败、缺失变量和对应修正；不访问个人 `.env`，不读取私人会话，不运行模型。首试默认缓存位置不可写，改为本任务临时缓存后运行；未改权限或用户配置。

局限：Linux、上述固定版本与字符；没有迁移真实应用、生产凭据或 Windows 路径。不会据此升级地图或默认配置。

## 来源与探索范围

- 官方：[uv `UV_ENV_FILE`](https://docs.astral.sh/uv/reference/environment/#uv_env_file) 与实际 `uv run --help` 说明入口。
- 用户原帖与源码生态：[uv #23226](https://github.com/astral-sh/uv/issues/23226) 及其中 dotenvy 解析差异引用，报告源于从 python-dotenv 迁移。
- 同轮读取 [uv #23239](https://github.com/astral-sh/uv/issues/23239)（Windows free-threaded 依赖锁），因本轮无对应平台与实际任务不扩写；Codex 指令加载候选与现有覆盖重复，未采用。

本轮是围绕迁移风险的定向核验，未完成全领域饱和广扫；没有声称最高水平。核实日期：2026-11-15。
