# cattrs Decimal：精确往返，保留已正确的原生路径

核实：2026-10-23。[一手源码＋本地实测] 这是一条真实公开需求的本地实现示范，不是上游已合入功能，也不是工具或模型优越性实验。

## 先选最小够用方案

**只服务自己的应用：用 `local_hooks.py`，不必维护库补丁。** 四个后端注册字符串编码与 Decimal 解码；msgspec 已会原生编码精确字符串，只补解码。希望库默认支持这五个后端时，再采用 `decimal-preconf.patch` 与独立回归文件。

源码固定 [cattrs bde101a5](https://github.com/python-attrs/cattrs/commit/bde101a5a67997c61a3ee0e971386a82fe141d4e)（committer 时间为 2026-10-21 22:02:29 UTC 的 NEXT 开发树，不是 26.2.1 发布版）。需求来自 [issue #761](https://github.com/python-attrs/cattrs/issues/761)。原作者 Binilkks 的 [PR #764](https://github.com/python-attrs/cattrs/pull/764)、固定 head `8c04cdb5b7c2eeeb10f231f1f574ed02b185dbd9` 已实现 JSON/PyYAML hooks；本例明确沿用这部分思路与行为，不将它重新包装成原创修复。新增价值是补齐维护者[明确要求的其余 JSON 后端及原生路径](https://github.com/python-attrs/cattrs/pull/764#issuecomment-4826035821)，并提供可重放的精确表示与 hook 覆盖测试。上游 PR 在本次查看时仍开放，未向上游提交或留言。

## 实际基线，不把五个后端一概而论

以 `Decimal('12345678901234567890.1234500')` 为例：

| 后端 | 原始编码 | 原始解码 | 本例改变 |
|---|---|---|---|
| json | TypeError | 缺 Decimal structure hook | 编为字符串，补解码 |
| PyYAML | RepresenterError | 缺 hook | 编为字符串，补解码 |
| orjson | TypeError | 缺 hook | 编为字符串，补解码 |
| ujson | 静默变为 `1.2345678901234567e+19`，精度已丢 | 缺 hook | 编为字符串，补解码 |
| msgspec | 已是精确的带引号字符串 | 缺 hook | **只补解码** |

原始输出见 `evidence/baseline-encoding.txt` 与 `baseline-roundtrips.txt`。msgspec 的 scalar/list 仍使用 `identity`，attrs/mapping 仍使用 `to_builtins`；`get_dumps_hook` 仍直接返回 encoder。本例测试的 scalar/attrs/list/dict 场景中，后注册的自定义 Decimal hook 必须接管，这也有实际运行回归，不只是阅读源码推断。

## 复制运行

前提：Git、uv（本次 0.13.4）、CPython 3.12（本次 3.12.14）；网络用于从官方 GitHub 与 PyPI 下载源码、固定依赖。运行后所有缓存留在当前工作目录。`requirements.lock` 固定全部本次依赖，包括 optional backend imports 所需的依赖。

```sh
mkdir -p tmp cache
export TMPDIR="$PWD/tmp" UV_CACHE_DIR="$PWD/cache"
uv venv --python 3.12 .venv
uv pip install --python .venv/bin/python -r requirements.lock
git clone https://github.com/python-attrs/cattrs.git source
git -C source checkout bde101a5a67997c61a3ee0e971386a82fe141d4e
# 最小应用方案：对未改的源树即可运行。其他后端换最后一个参数。
PYTHONPATH=source/src .venv/bin/python local_hooks.py msgspec
PYTHONPATH=source/src .venv/bin/python local_hooks.py ujson
# 完整重放：从固定 commit 导出新工作树，绝不修改 --source 目录。
.venv/bin/python replay.py --source source --workdir replay-result
# 可选：独立重放本例用到的 Python 语义导航。
.venv/bin/python navigate.py --source source --output navigation/result.json
```

重放先在原始源码运行新增回归，要求 **104 失败、12 通过、零 skip/error**；应用补丁并逐文件比对 SHA-256 后要求 **116 通过**；再运行相关上游测试 **73 通过、零 skip/error**。故意失败的基线不算通过。输出在指定新工作目录，包含各阶段日志、JUnit 与 `report.json`。

相关范围为 `tests/test_preconf.py` **63 通过、20 deselected**，以及 `tests/preconf/test_msgspec_cpython.py` **10 通过**。入口的 selector 是 `-k "not test_sentinels"`：上游 `test_sentinels` 明确标记 `sys.version_info < (3, 15)` 时 skip，这 20 项检查 PEP 661 sentinel 而非 Decimal；在 CPython 3.12 上事先排除，未将 skip 算通过。Python 3.14 专项和完整仓库测试未运行。这是明确范围的 189 项修复后测试，不是全项目通过。独立重放采用专用最小 pytest 配置，保留 conftest 与默认 Hypothesis profile；未声称覆盖 typing 检查。

补丁只含五后端实现和文档，回归单独在 `test_decimal_preconf.py`，重放会放入 `tests/`。应用到其他版本需重新审查，不保证补丁通用。每次重放必须指定一个尚不存在的 `--workdir`，不会覆盖已有产物。

## 用了哪个机制，改变了哪个选择

本例实际调用 **Jedi 0.19.2 的 `goto(..., follow_imports=True)` 与 `get_references(..., scope='file')`**，将 `tests/test_preconf.py` 的五个导入别名定位到各后端的同名 `make_converter`，再定位各文件中的 `configure_converter`；保存的记录针对本例补丁后源树，未改树的行号会略有不同；请求位置、声明位置和文件内引用保存在 `evidence/semantic-navigation.json`。没有将文本搜索称为语义导航，也未安装或声称试用了 LSP / Serena。

随后按源代码跟进 msgspec 的 `configure_passthroughs`、attrs/sequence/mapping factories 与 `get_dumps_hook`：它们根据 hook 是否为 `identity` / `to_builtins` 选择原生路径。这个发现让修改从“五后端都加 str hook”收缩为“四个改编码，一个只补解码”。语义导航只说明静态声明和引用；最终原生路径及用户自定义覆盖由运行测试确认，没有测速度收益，也不能据此声称比 rg 或其他导航工具更好。

## 返工和适用边界

- 声明查询限制在模块导入区，避免函数内部重复 import 混入；引用查询仍保留整个文件的调用点。
- 精确性用 `Decimal.as_tuple()`，避免普通数值相等掩盖尾零、负零和 exponent 的变化；覆盖高精度、`1.2300`、`-0.00`、大正/负 exponent 以及嵌套 attrs/list/dict。
- **精确保证是字符串往返，不是浮点数恢复。** 由 Decimal structure hook 接收数字时，PyYAML 沿用 PR 的 `Decimal(str(value))`；其余采用 `Decimal(value)`。原生 msgspec.Struct 仍整体交给 msgspec，可能使用不同数字转换规则，也不保证其内部字段会使用 cattrs 自定义 hook。二者都无法还原 float 解析前已经丢失的位数。数字接收另有独立测试，不能冒充精确性保证。
- 本次只保证已测试的有限 Decimal 场景、五后端与固定版本；默认 `cattrs.Converter` 未改。自定义 msgspec encoder（例如主动选 Decimal 数字格式）会改变序列化约定，不在本次默认配置保证内。

## 文件与授权

- `decimal-preconf.patch`：可读实现/文档补丁；空白上下文行只移除孤立单空格，未剥离代码缩进；重放确认应用后的文件与目标 SHA-256 完全一致。
- `test_decimal_preconf.py`：116 项具体回归。
- `local_hooks.py`：应用内可直接借用的入口。
- `replay.py` / `navigate.py`：重放与可选语义导航；缺参数、缺/错源目录、优化模式都不得假通过。
- `requirements.lock`：本次完整固定依赖；主要版本 attrs 25.4.0、msgspec 0.21.1、orjson 3.12.0、ujson 5.12.1、PyYAML 6.0.2、pytest 9.0.3、Hypothesis 6.135.26。
- `LICENSE`：保留 cattrs MIT 原文。该派生补丁、示例、回归与重放脚本按 MIT 提供；原 JSON/PyYAML 改动按上述 PR 署名与来源保留。
