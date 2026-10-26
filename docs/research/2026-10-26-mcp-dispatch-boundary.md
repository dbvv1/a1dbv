结论：本地只读 MCP 的目录验收应覆盖实际 dispatcher 与兼容入口，不能只枚举 `tools/list`。
改变的做法：多路径工具逐项验拒绝，并保留允许目录内的有效任务作为正向对照；建议已落入 [10 安全](../10-security.md#本地只读-mcp目录验收覆盖可调用的兼容入口)。
证据范围：2026-10-26 只读官方已披露公告、固定源码与既有回归定义；未执行漏洞演示、Rust 测试或真实宿主接入。

# anymd：工具发现与目录限制的验收范围

## 官方披露的影响与修复版本

2026-10-19 发布的公告记录如下：

| npm 包 | 受影响版本 | 修复版本 |
|---|---|---|
| `@sylphx/anymd` | `>= 7.0.0, <= 8.5.4` | `8.5.5` |
| `@sylphx/citra` | `>= 5.0.4, <= 8.5.4` | `8.5.5` |

受影响的是已配置 `--allow-dir`／`MCP_PDF_ALLOWED_DIRS` 后，旧 `pdf_compare` 入口没有做同一目录检查。调用者仍须能调用工具，目标 PDF 须是服务器进程本来能打开的文件。公告称 stdio 场景可由被诱导的 Agent 触发；这不是突破操作系统文件权限的结论。

披露的输出是 `added_terms`、`removed_terms` 各至多 200 个排序后的唯一词项，以及 `before_pages`、`after_pages`、`changed_pages`、`before_chars`、`after_chars`；错误可泄露路径是否存在及是否为可读 PDF。它是部分信息泄露，不能写成任意文件全文读取。官方确认的是 8.5.4；本记录没有复现旧版。

**依据**：[一手：官方公告] [GHSA-xrc8-gj3q-m8vm](https://github.com/SylphxAI/anymd/security/advisories/GHSA-xrc8-gj3q-m8vm)；核实 2026-10-26。

## 固定源码：发现列表之外仍有派发路径

核查版本为 `71fb95b521588241af5a23fa2de701207ac93430`，workspace 版本 8.5.5；这是修复后的观察快照，不是声称该提交就是首次修复。

| 环节 | 固定实现中的事实 |
|---|---|
| 列表 | `list_tools` 返回 router 的 `sanitized_tools`；列表测试只列 `read`、`search`、`outline`、`inspect`，并断言四个 legacy 名称不在列表中 |
| 派发 | `call_tool` 先尝试 `call_legacy`，无匹配才进入 router；旧名包含 `read_pdf`、`search_pdf`、`pdf_evidence`、`pdf_compare` |
| 兼容比较入口 | `pdf_compare` 验参数后，对 `before`、`after` 分别调用 `source_access.admit_path`，再进入比较模块；当前 `inspect` 的 compare 分支也检查两条路径 |
| 目录策略 | `SourceAccessPolicy` 合并 CLI 与环境变量中的根目录，按启动目录解析相对路径，规范化后做目录包含检查；无根目录配置时保留不受此策略限制的默认行为 |
| 返回结果 | 核心比较模块读取两份 PDF 的页面文本，产生词差集合及页／字符统计；结构化响应不含完整原文 |

因此，列表缩减不意味着兼容入口被移除；修复必须落到仍可调用的读取链上。这里不把源码检查当成所有客户端、传输和路径行为的安全认证。

**依据**：[一手：固定源码] [`lib.rs` 列表与派发](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/lib.rs#L542-L619)、[比较入口](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/lib.rs#L307-L323)、[目录策略](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/source_access.rs)、[比较输出](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd-core/src/compare_pdf.rs)、[8.5.5 changelog](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/CHANGELOG.md#855)；核实 2026-10-26。

## 回归定义：看实际断言，不只看测试名称

- 旧 `all_tool_entrypoints_reject_paths_outside_the_native_allowlist` 只直接调用 `read_pdf`、`search_pdf`、`pdf_evidence`；名字里的“all”没有覆盖 `pdf_compare`。
- 新 `every_dispatched_tool_refuses_a_path_outside_the_allowlist` 经 `call_legacy` 检查旧比较入口：`before` 在外、`after` 在内，以及相反组合都须拒绝；同时检查其他三个旧入口和当前 `inspect` compare 的拒绝。
- 同一测试把公开 PDF 夹具复制到允许目录，在旧比较入口验证一对允许文件可返回且无 `error` 字段，避免把“一律拒绝”误当修好。
- 这些是进程内回归定义：legacy 走 `call_legacy`，当前比较直接调 `inspect`，没有在该测试中走完整 MCP 传输。接入方仍应使用自己的有效启动配置，核实际入口与允许目录内的正常结果。

**依据**：[一手：固定测试定义] [原三入口测试](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/lib.rs#L1240-L1288)、[扩展派发与正向回归](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/lib.rs#L1308-L1408)；核实 2026-10-26。

本次环境无 `cargo`／`rustc`，未运行上游测试，不采用公告中的测试通过数字作为本仓回执。探索回执：本项是已有 MCP 接入研究的安全缺口续核，只读官方公告、固定实现、变更记录和回归定义；未扫描第三方服务、私人文件或真实账号。
