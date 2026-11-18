# Ruler Codex 32 KiB 上限警告补丁

## 适用版本

- 上游仓库：`intellectronica/ruler`
- 固定提交：`b905f192d84e340d6c9723ff8eadfa6dbc9be8b6`（`main`，`package.json` 0.3.46）
- 上游许可：MIT，见 `../LICENSE-ruler-MIT.txt`
- 补丁文件：`0001-warn-codex-project-doc-limit.patch`

## 行为

`CodexCliAgent.applyRulerConfig` 写完 Codex 的 `AGENTS.md` 后，按实际文件 UTF-8 字节数检查：

- 超过 Codex 文档默认的 `project_doc_max_bytes`（32768 字节 / 32 KiB）时，向 stderr 打一条 `[ruler]` 警告；
- 警告说明这是 Codex 的默认值、实际生效值可能因配置而不同，并说明 Codex 会静默丢弃超出部分；
- 不改写或截断生成内容；新增警告逻辑不改配置，原有 MCP 同步仍可能写 `.codex/config.toml`，本次不验证 MCP；
- 只对 `codex` agent 生效；`agentsmd`、Claude 等其他 agent 不报警；
- 每次 apply 对同一输出最多一条警告；下一次 apply 仍会提示。

阈值来自 Codex 官方文档的默认消费上限，不是 Ruler 的生成默认值。

## 应用

在固定提交的干净副本中：

```sh
ARTIFACTS="<a1dbv-checkout>/docs/collaboration/local-jobs/artifacts/A-TEAM-RULER-BUDGET-READER-20261114"
# ARTIFACTS 替换为该产物目录的绝对路径；当前目录是固定 Ruler checkout
git apply --check "$ARTIFACTS/patch/0001-warn-codex-project-doc-limit.patch"
git apply "$ARTIFACTS/patch/0001-warn-codex-project-doc-limit.patch"
npm ci
npm run build
```

补丁新增 `tests/unit/agents/CodexCliAgent.project-doc-limit.test.ts`，可用：

```sh
npx jest tests/unit/agents/CodexCliAgent.project-doc-limit.test.ts --coverage=false --maxWorkers=2
```

## 回归覆盖

| 场景 | 预期 |
|---|---|
| 生成文件 32769 字节 | 警告一次，含 `project_doc_max_bytes`、`32768`、`32 KiB` |
| 恰好 32768 字节 | 不警告 |
| 低于 32768 字节 | 不警告 |
| 多字节 UTF-8（11000 个汉字，33028 字节） | 按字节判断并警告 |
| 生成文件与既有 `.codex/config.toml`（MCP 输入 null） | 此单测内容与配置均不变，不覆盖 MCP 同步 |
| 连续两次 apply | 每次都提示一次 |
| 其他 agent 写超长 `AGENTS.md` | 不警告 |

## 已知限制

警告只帮助发现“生成成功但宿主只读到一部分”，并不修复 Codex 客户端上限。本轮用 Codex CLI 0.166.0 的 `codex debug prompt-input` 复核，生成文件 51241 字节、模型可见指令仍只有 32768 字节，part 5/6 依旧不可见。

接收状态：保留原补丁作候选，未上游发布或默认采用。警告中的嵌套拆分不能扩充同一加载链的合并预算；静默与否也须核客户端版本，详见 result.md 接收边界。
