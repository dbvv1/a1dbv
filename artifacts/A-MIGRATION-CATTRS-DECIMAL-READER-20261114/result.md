# cattrs #822 Decimal 消费者接收结果

## 结论

**可以接，但只能把 PR 的单个提交接到 `6764ab01` 的主干基线上再交付；不能直接用 PR head 的整棵树替换主干。** 在同一消费者（attrs `Order(amount: Decimal)`）上，基线 `e9239b7` 的 JSON/PyYAML 前后转换均失败；把 PR 提交 cherry-pick 到 `e9239b7` 后，字符串路径的 dumps 为字符串、loads 返回 Decimal 且指数/尾零保留，基线失败被保留为对照证据。PR head 原树比任务基线落后 6 个主干提交，原样打包的 wheel 在主干已有的 msgspec typed-deque 回归上失败（6/11），整合后的 wheel 通过（11/11）。

本次只实测 CPython 3.12.15 / Windows 11 上的 stdlib json 与 PyYAML 两个 preconf，不覆盖其他 Python 版本、其他后端或完整测试矩阵。

## 实读页面版本与独立性

- 页面：`docs/decisions/migrations.md@6764ab019c94d63fe02af06596a5c0e1f8d9446f`；工作区 HEAD 即该提交，页面文件哈希 `8219bc30341114851294d827845204fe4f24cc93`，与随任务附上的全文一致。
- 只按该页执行；未读本仓其他 cattrs 实验、历史结果或旧读者答案。未修改页面、TASKS 或其他卡。
- 独立性说明：本任务由新上下文执行，未参与该页或本任务的先前运行。

## 精确源码、解释器与依赖

| 项 | 值 |
|---|---|
| 任务基线 | `e9239b7082206f18e3cec873b11451aff35beb9c`（`v26.2.1-20-ge9239b7`） |
| PR #822 head | `2e883761ca61b076c3de45a5d976952226347c2c`，经 `refs/pull/822/head` 重新核对 |
| PR head 父提交 / 两者 merge-base | `bde101a5a67997c61a3ee0e971386a82fe141d4e` |
| 整合提交 | `653efccbf73ab5890d7480986e3815e14ae707f4`（cherry-pick 到基线上） |
| PR 与基线关系 | merge-base 为 PR 父提交；PR 只有 1 个独有提交，基线有 6 个提交不在 PR 中 |
| 解释器 | CPython 3.12.15（64 位，MSC v.1944），win-amd64 |
| 依赖 | attrs 26.1.0、PyYAML 6.0.3、typing-extensions 4.16.0、pytest 9.2.0、hypothesis 6.170.15、pytest-benchmark 5.3.1；原生检查另装 msgspec 0.22.0、msgpack 1.2.4、ujson 6.1.0、orjson 3.13.0、tomlkit 0.15.2、tomli_w 1.2.0、cbor2 6.3.0、pymongo 4.20.0 |
| 隔离 | 三个独立 venv，每个只安装一个由对应源码树构建的 wheel（`--no-deps`）；依赖从 PyPI 安装；消费者与原生测试均从 `site-packages/cattrs` 导入 |

wheel（`hatchling`/`hatch-vcs` 构建）：

| 树 | 包版本 | wheel SHA-256 |
|---|---|---|
| 基线 `e9239b7` | 26.2.2.dev20 | `d6ff46ed512e2fadd4d69b46168b5ad5401b7705d60aa38c41b47801e62f496e` |
| PR head `2e88376` | 26.2.2.dev15 | `cddf4ff40e82f35b64cc72bc6c5293171ed6dbd571cfd5d3cc7fcd97ea3e60d0` |
| 整合 `653efccb` | 26.2.2.dev21 | `a8a1235a7ec0f71dd73b37d3bf145f4e44287e72574ff4dfef13bb8d24ad6a6b` |

注意：PR head 的 wheel 版本号（dev15）低于基线 wheel（dev20），因为版本由 `git describe` 的提交距离生成。判断候选必须按 git 提交或 wheel 哈希，不能按版本号大小。

## 接旧 PR 的路线与主干差量

PR head 的父提交就是与任务基线的 merge-base，说明 PR 分支是在 10 月 20 日的主干上切出的。任务基线此后有 6 个提交：

```
e9239b7 docs: link deque fix to its issue and pull request
354a141 Fix typed deque serialization in the msgspec converter
8a23a31 Bump msgpack from 1.2.1 to 1.2.3
c4c73b1 Bump pymongo from 4.18.2 to 4.18.3
d043dbd Fix the cache_result parameter name in get_*_hook docstrings
7a24f77 Bump certifi from 2025.6.15 to 2026.10.19
```

其中 `converters.py`、`preconf/msgspec.py` 与对应测试是行为修复；`uv.lock` 是依赖锁更新。因此采用页面“已有 PR 只接必要差量，保留主干新增功能”的做法：在 `e9239b7` 上 cherry-pick PR 的唯一提交。PR 原提交只改 4 个文件：

- `src/cattrs/preconf/json.py`：`Decimal` 反序列化为 `str`、结构化用 `Decimal(v)`
- `src/cattrs/preconf/pyyaml.py`：同上
- `tests/test_preconf.py`：新增 4 个 Decimal 用例
- `HISTORY.md`：新增一条 NEXT 记录

`HISTORY.md` 的 NEXT 段冲突；解决时保留 PR 的 Decimal 条目和主干较新的 typed-deque 条目，其余 3 个文件自动合并。整合后相对基线的差异正好是这 4 个文件，未回退主干的 6 个提交。

## 同一消费者的前后对照

消费者见 `consumer/test_decimal_consumer.py`，结构来自 issue #761 的 attrs `Order(amount: Decimal)`；仅用合成值：

- `19.99`
- `0.1`
- `1234567890.123456789012345678901234567890`（40 位有效数字）
- `1.10`（额外固定指数/尾零）

原始观察数据在 `results/base.json`、`results/pr-head.json`、`results/integrated.json`。

### 基线（`e9239b7` wheel）

26/28 个用例报错，只有不含 Decimal 的普通对象用例通过：

- JSON `dumps(Order(...))`：`builtins.TypeError: Object of type Decimal is not JSON serializable`
- PyYAML `dumps(Order(...))`：`yaml.representer.RepresenterError: ('cannot represent an object', Decimal('19.99'))`
- 两种后端的 `loads`：`cattrs.errors.StructureHandlerNotFoundError: Unsupported type: <class 'decimal.Decimal'>`
- 非 Decimal 的 attrs 类、普通 dict、datetime 用例通过，说明基线失败只来自 Decimal。

### PR head 与整合后（两者行为相同）

- 字符串路径：JSON 输出 `{"amount": "19.99"}`，PyYAML 输出 `amount: '19.99'`；解析后的 `amount` 类型为 `str`，等于 `str(value)`。`loads` 返回 `Decimal`，且 `as_tuple()` 与源值一致，`1.10` 的指数 `-2` 与尾零保留，40 位有效数字逐位保留。
- 直接 API：`converter.unstructure(value)` 为 `str`；`converter.structure(str(value), Decimal)` 返回 `Decimal` 且 `as_tuple()` 一致。
- 数字输入（单独报告，不归因于候选）：JSON `{"amount": 19.99}` / YAML `amount: 19.99` 在进入 cattrs 前已被后端解码为 float，loads 得到 `Decimal('19.989999999999998436805981327779591083526611328125')`，不等于 `Decimal("19.99")`；整数 `42` 则精确得到 `Decimal('42')`。这是 JSON/PyYAML 后端先产生 float 的既有路径，候选的 hook 只是把这个 float 原样转成 Decimal，不能据此说候选破坏了精度。
- 无效字符串：`"not-a-decimal"` 与空串在结构化 attrs 类时抛 `cattrs.errors.ClassValidationError`，其子异常为 `decimal.InvalidOperation`；直接 `structure("not-a-decimal", Decimal)` 直接抛 `InvalidOperation`。没有静默接受或回退。
- 非 Decimal 行为：不含 Decimal 的 attrs 类、普通 dict、datetime 在基线和两个候选构建上结果一致；含 Decimal 与非 Decimal 字段的混合类在候选上完整往返，Decimal 字段保持 `as_tuple()`。

### wheel 安装后的验收

| 检查 | 基线 wheel | PR head wheel | 整合 wheel |
|---|---|---|---|
| 消费者 pytest | 退出 1，22 failed / 2 passed | 退出 0，24 passed | 退出 0，24 passed |
| `tests/test_preconf.py` | 退出 0，61 passed / 22 skipped | 退出 0，65 passed / 22 skipped | 退出 0，65 passed / 22 skipped |
| 基线测试文件的 typed-deque 回归（`-k deque`） | 退出 0，11 passed | **退出 1，6 failed / 5 passed** | 退出 0，11 passed |

typed-deque 一项使用基线 `e9239b7` 的测试文件跑三个已安装 wheel，用来直接验证“PR 原树是否保住主干新增功能”：PR head 原树缺少 `354a141` 的修复，故失败；cherry-pick 后的整合树保留该修复，故通过。原生 `test_preconf.py` 按各树自己的测试文件运行，PR 与整合树各自多出的 4 个用例即该 PR 新增的 Decimal 用例。

## 页面卡点

1. **“依赖大版本升级／接收旧 PR | 先核所有仍支持入口的版本契约，再读跨版本指南、用当前包管理器更新声明和锁文件”**：这一行把“依赖大版本升级”和“接收旧 PR”合并成一格。本 PR 没有改依赖声明，也没有跨版本指南可读；我据此判断不需要动 `uv.lock` 或依赖声明，只接代码差量。缺的是把两种情况拆开的一句：只接代码差量时以提交为粒度，不升级依赖、不改锁文件。
2. **“已有 PR 只接必要差量，保留主干新增功能。”**：给了目标，没有给核对方法。我自行用 `git merge-base` 与 `git rev-list --count` 确认 PR 落后 6 个提交，再 cherry-pick 并手工解决 `HISTORY.md` 的 NEXT 段冲突。缺的是明确的祖先检查与冲突处理规则（例如“PR head 不是基线祖先时，在基线上 cherry-pick 唯一提交，按主干保留冲突两侧的变更”）。
3. **“发布 wheel／库时从独立环境安装产物，不拿源码目录的成功代替发行包。”**：执行上没有卡住，但 `hatch-vcs` 生成的 PR wheel 版本号反而低于基线 wheel。页面没有提醒“候选可能因分支落后而版本号更小”，只能用提交 SHA 和 wheel 哈希识别构建来源。
4. **“先确认原生环境和源码完整，再按实际交付形式检查。……Windows 使用原生解释器和短工作路径”**：本任务指定的临时目录较长，但未触发路径长度问题；我用了原生 CPython 3.12.15，没有改用 WSL。短路径要求在此环境没有造成卡点，记录为已满足而非阻塞。
5. **“先选一个真实受影响的消费者，记录原结果；试改后用同一输入核正常与失败路径。”**：页面没有规定“精度保留”的判定粒度。我用了比数值相等更严格的 `Decimal.as_tuple()` 相等来覆盖指数与尾零；这是页面未写、由我补充的判定。

## 页面之外查了什么

- 在固定提交上读 cattrs 源码：`src/cattrs/preconf/json.py`、`src/cattrs/preconf/pyyaml.py`、`tests/test_preconf.py`、`tests/preconf/test_msgspec_cpython.py`、`pyproject.toml`、`HISTORY.md`。
- 用 `git show` 读 PR #822 的完整 diff，用 `git ls-remote` / `git fetch refs/pull/822/head` 复核 head 仍为任务给定 SHA；读 `git log`/`git diff` 核对 PR 与基线的祖先关系和 6 个主干提交。
- 用仓库自带的 PyPI 依赖和 `python -m build` 构建 wheel；用 Python 标准库行为（json 先把数字解为 float、PyYAML safe_load 同理）解释数字输入路径。
- 未读 a1dbv 其他文档、其他 cattrs 实验/历史结果或旧读者答案；未搜索同主题的外部教程。

## 未验项

- 仅 CPython 3.12.15 / Windows 11 x64；未测 3.10、3.11、3.13、3.14、3.15、PyPy 或其他操作系统。
- 仅 stdlib json 与 PyYAML preconf；未测 orjson、ujson、msgpack、msgspec、bson、tomlkit、tomllib 后端上 Decimal 的表现（msgspec 只用于无关的 deque 回归）。
- 未跑完整 cattrs 测试套件；只跑 `tests/test_preconf.py` 和 `tests/preconf/test_msgspec_cpython.py -k deque`。
- 未验证任何真实业务数据、生产环境或网络服务；输入全部为合成数据。
- 未向上游提交、评论或修改 PR；未做打包后在其他机器上的复装。
- 未测 `uv.lock` 重建或依赖解析变化；本 PR 不涉及依赖声明。

## 产物

- `consumer/test_decimal_consumer.py`：消费者与 pytest 断言；`python test_decimal_consumer.py --json ... --label ...` 生成观察记录。
- `results/base.json`、`results/pr.json`、`results/integ.json`：三套 wheel 的逐用例观察。
- `results/metadata.json`：提交关系、wheel 哈希、依赖版本、检查退出码汇总。
- `commands.md`：可复跑命令（使用占位符，无本机绝对路径）。