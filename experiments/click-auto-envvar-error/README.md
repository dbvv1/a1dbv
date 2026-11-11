# Click 自动环境变量的错误提示

**遇到 [Click #3914](https://github.com/pallets/click/issues/3914)，应用可先在该选项显式设置 `envvar="MYAPP_PORT"`。** 自动前缀的帮助文字能显示变量名，但遗漏必填值或输入非法值时，原版错误提示会漏掉它；显式设置的现有路径已通过对照。

**🧪 [补丁](change.patch)供隔离试验，不是上游发布版。** 它只让错误提示采用与帮助文字相同的自动变量名称，不改解析或值来源优先级；包含回归测试与变更说明。固定基线为 Click stable `1077444068ebd88628128f7b4c0803296668ab79`，许可证见 [BSD-3-Clause](LICENSE.upstream)。

## 在干净副本试用

从 a1dbv 仓库根运行，使用 Git、uv 与 Python 3.12；不覆盖现有 Click 安装：

```sh
PATCH="$(pwd)/experiments/click-auto-envvar-error/change.patch"
WORK="$(mktemp -d)"
git clone https://github.com/pallets/click.git "$WORK/click"
cd "$WORK/click"
git checkout --detach 1077444068ebd88628128f7b4c0803296668ab79
git apply --check "$PATCH"
git apply "$PATCH"
UV_CACHE_DIR="$WORK/uv-cache" uv sync --python 3.12 --locked --no-default-groups --group tests
.venv/bin/python -m pytest -q
```

成功判据：原 issue 的缺失值和非法值错误显示 `MYAPP_PORT`；正常输入、显式变量、命令行优先级、禁用开关与嵌套命令保持原行为。当前补丁的独立审查、真实 CLI 对照、Linux/Python 3.12 默认测试、类型、样式与文档构建通过；默认套件不含 stress，条件跳过与预期失败不算已验。其他平台、Python 版本、随机并行、Flask 下游及 hosted CI 未运行。

补丁 SHA256：`c9a3ba5430e05303449df69928b826d5625df89ab465244a57b1dd94a26704a3`。应用到固定原版后，三个文件与独审版本逐字节一致。

**不向 Pallets 提交此 AI 生成补丁。** 其[投稿规则](https://palletsprojects.com/contributing/pr/#llm-generated-contributions)和[AI 说明](https://palletsprojects.com/contributing/llm-ai/)明确拒绝这类 PR；换署名或由他人代投不改变这一点。这里仅保留本地试用，没有 issue、PR 或评论外发。来源与实际核验：2026-11-11 UTC。
