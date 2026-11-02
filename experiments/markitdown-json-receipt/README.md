# MarkItDown：转换成功，JSON 上下文却可能为空

**🧪 给 Agent 准备结构化上下文时，保留原 JSON，并验转换后的字段；不要把 CLI 的 exit 0 当作内容完整。** 本次普通需求 JSON 只是文字中提到 notebook 标记，基线便成功输出空文件；已有候选恢复了全部字段。修正的是转换器路由，不是源文件丢失，也不是模型效果提升。

## 已有用户问题与候选

[用户报告 #2804](https://github.com/microsoft/markitdown/issues/2804)指出：普通 JSON 的说明文字或嵌套样例含有 `nbformat`、`nbformat_minor`，会触发 notebook 转换器。基线只搜索这些字符串；随后找不到 `cells`，返回空文本，普通文本转换器没有机会接手。

接收的 [既有 PR #2810](https://github.com/microsoft/markitdown/pull/2810)改为解析 JSON 并检查顶层结构：数值版本字段和 `cells` 列表等。它仍是识别启发式，**不是完整 notebook 格式校验器**，显式 `.ipynb` 路由也未改变。本次不另造补丁或对外投稿。

固定基线 `7482c092d9c0074a89803c9fdb63a969e7fe17fc`，候选 `aaf26e76dbb8b98010318a4e523aa8591e4aae96`。项目观察时约 19.35 万 Star，许可 MIT。两版分别构建并安装非 editable wheel；非实现者逐文件核对各 41 个生产 Python 文件与对应固定源码一致，70 项依赖完全一致。

## 真实 CLI 与 API 接收同一组上下文

消费者用自有合成需求、配置、Markdown、正常 notebook 和损坏 notebook，实际运行安装后的 `markitdown input -o output`、`convert_local` 和 `convert_stream`，没有替换类型识别器或直接调用内部 helper。

| 输入与内容验收 | 基线 | 候选 |
|---|---|---|
| 普通需求 JSON，描述含 notebook 标记 | CLI、local、stream 均为空；无法解析 JSON | 均为 313 字符；4 个顶层字段及嵌套值全部相同 |
| 不含标记的配置 JSON | 117 字符，字段全部相同 | 相同 |
| 正常 notebook | 108 字符，标题与指定代码块保留 | 相同 |
| Markdown | 79 字符，非空 | 相同 |
| 损坏 notebook | 66 字符，逐字节返回原文本 | 相同 |

每版 5 次 CLI 均 exit 0，包括基线的空需求输出；8 次 API 调用也都返回。损坏 notebook 是**原文回退**，不是抛错或严格拒绝。随后同实例再读正常 notebook，两版都成功；再读带标记的普通 JSON，仍只有候选保留字段。

正常 notebook 的代码块仅在精确等于本次自编常量时，才执行已知算式并得到 `42`；这不是执行任意转换内容，也没有接模型。另补真正的失败路径：不存在的本地文件产生 `FileNotFoundError`，两版同一实例随后都能读回有效配置的全部字段。原始输入哈希始终不变；未由此推断其他异常或格式也能恢复。

## 检查与接收边界

Linux、Python 3.12.14、MarkItDown 0.1.9。核心包完整 `tests` 目录：基线 **1118 passed / 57 skipped**，候选 **1124 passed / 57 skipped**，均 exit 0、7 条警告；候选两处改动文件的 Black 检查通过。57 个跳过分别为外部 URL 44、原生 Windows 10、缺 exiftool／远程转录／缺 LLM key 各 1。未运行 OCR、MCP 子包完整测试，也未验证真实资料、远程转换或索引／模型质量。

固定候选的 CLA check 成功，但 `tests`、`pre-commit` 工作流均为 `action_required`，提交状态 pending；不能据此说托管功能检查全绿或已合入。插件关闭，无账号、凭据或真实私人输入；现有工具默认与读者状态不变。

封存时有两次**验收脚本错误**，不是产品失败或重跑：首次用去尾空白的输入误判原文回退，已只修后处理并保留旧摘要；补验完成后，整份 manifest 不变断言因两份 ONNX runtime 缓存数据库更新而失败，launcher exit 1，但两个产品子进程此前均 exit 0。输入、输出及调用记录未变；旧缓存只有前后哈希，未保留旧字节，不能称整个旧 manifest 完整可还原。

原始调用、产物、两次后处理问题和两棵完整源码树已在云端保全，恢复对象校验通过；依赖与运行缓存不入归档，未上传原始档案。精确时间、测试范围及哈希见 [results.json](results.json)。这份接收记录支持“检查转换后的结构化内容”，不把一个候选的窄修复推广为所有 JSON／notebook 都正确。

**依据与核实**：[官方用途与 CLI](https://github.com/microsoft/markitdown/blob/7482c092d9c0074a89803c9fdb63a969e7fe17fc/README.md)、[用户原报告 #2804](https://github.com/microsoft/markitdown/issues/2804)、[候选实现](https://github.com/microsoft/markitdown/blob/aaf26e76dbb8b98010318a4e523aa8591e4aae96/packages/markitdown/src/markitdown/converters/_ipynb_converter.py)、[MIT 许可](https://github.com/microsoft/markitdown/blob/7482c092d9c0074a89803c9fdb63a969e7fe17fc/LICENSE)，核实 2026-11-02。
