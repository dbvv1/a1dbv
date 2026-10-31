# MCP 有参数，为什么 Agent 看不到

**🧪 工具调用缺字段时，先对照服务端 schema 与客户端实际生成的声明，再改提示词或服务端。** Codex 固定源码 `67f0994b` 的原库测试 43 项通过，但真实声明入口仍会丢掉根级 `oneOf` 旁的属性；新增诊断为 1 通过、2 失败。服务端已有合法参数定义，删除约束并不是这个故障的修复。

## 实际看到了什么

使用 [#42283](https://github.com/openai/codex/issues/42283) 已公开的结构：根对象声明 `field_a`、`field_n`，`oneOf` 的两个分支分别要求其中一个。复现保留对象类型与 `additionalProperties: false`，去掉描述文字并使用中性工具名；不复制报告者的 doctor 数据。

| 相同原实现中的输入／入口 | 实际输出／结果 |
|---|---|
| 普通对象，两项属性都在 `properties` | `{ field_a?: {}; field_n?: {}; }`，正对照通过 |
| 加入 `oneOf`，经过实际 `augment_tool_definition` | 参数变成两个 `{ [key: string]: unknown; }` 的 union；两个字段名都消失 |
| 单独渲染 `{"required":["field_a"]}` | `{ [key: string]: unknown; }`，必填名未表达 |

根因有两层：`render_map` 在组合分支后直接返回，尚未处理同层属性；`render_object` 又只遍历当前 `properties`，不会为只出现在 `required` 中的名字生成字段。因此，**沿用当前分支输出、只在外面与父对象做 intersection，仍不能恢复必填约束**。后续设计需要同时保留同层属性与分支必填条件，并说明 JSON Schema 到 TypeScript 的近似范围。

内存中的 JSON Schema 正对照（`jsonschema` 4.26.0、Draft 2020-12）确认：`{}` 和同时提供两个字段均不合法，只提供任一空对象合法。服务端继续负责 `oneOf` 的排他校验；TypeScript union 本身不能完整表达它。

## 在自己的接入中怎样定位

1. 取同一个工具的原始 `inputSchema`、客户端给 Agent 的完整参数声明和实际参数，核对字段名、类型与必填条件。缺哪个观测就先补哪个，不从服务端 schema 正确推断客户端也正确。
2. 字段在声明转换时消失，就在该转换入口做离线复现；保留普通对象正对照，避免把模型选参错误与声明错误混在一起。
3. 修复或升级后，再验证真实目标调用与服务端契约。本例只验证声明转换；模型选参、MCP 服务与完整 CLI 仍待各自验证。

## 重放原包诊断

需要 Git、项目指定的 Rust 1.95.0、C/C++ 构建工具、网络及足够构建空间；初次 Cargo 解析还会获取工作区锁定的 Git／V8 子模块，即使只测试这个包。下面从一个空工作目录开始，将 `/path/to/a1dbv` 换成本仓位置：

```sh
git clone https://github.com/openai/codex.git codex-schema-repro
cd codex-schema-repro
git checkout --detach 67f0994b532b8740f14b5b738af7b7b2a915b1d6
cd codex-rs
cargo test --locked -p codex-code-mode-protocol --lib
mkdir -p code-mode-protocol/tests
cp /path/to/a1dbv/experiments/codex-mcp-schema/schema_sibling_repro.rs code-mode-protocol/tests/
cargo test --locked -p codex-code-mode-protocol --test schema_sibling_repro -- --nocapture
```

第一条测试预期 43 通过；诊断预期 **1 通过／2 失败、exit 101**，失败正是待解释的行为，不是全绿门禁。夹具调用原包公开入口，没有摘录函数替代实现；计数、输出和输入见 [results.json](results.json)。本轮只添加诊断文件，原实现与锁文件未改。

**贡献路线：补诊断，不准备外部 PR。** 当前 Codex 只接受 issue 中的复现、根因与设计讨论，不接受外部代码贡献或 PR；已有 #42283 时先判断有无值得补充的新证据。本轮未对外发帖，按此准入停止修复投稿准备。其他项目按[上游贡献指南](../../docs/decisions/upstream-contributions.md)各自判断。

**依据**：[公开问题与最小 schema](https://github.com/openai/codex/issues/42283)、[固定转换实现](https://github.com/openai/codex/blob/67f0994b532b8740f14b5b738af7b7b2a915b1d6/codex-rs/code-mode-protocol/src/json_schema_types.rs)、[实际声明入口](https://github.com/openai/codex/blob/67f0994b532b8740f14b5b738af7b7b2a915b1d6/codex-rs/code-mode-protocol/src/description.rs#L400)、[当前贡献规则](https://github.com/openai/codex/blob/67f0994b532b8740f14b5b738af7b7b2a915b1d6/docs/contributing.md)。核实与云端 Linux 原包实跑：2026-10-31；没有重测报告中的历史版本／模型分界，也不据此判断所有客户端。
