# ECC search-first：先找复用对象，还要验它的契约

**🧪 ECC 的 `search-first` 把“先查仓内、再找外部、决定复用或小改”压成了一份窄 Skill；本次事后对照没有得到比本仓原方法更好的实现选择。** 两路都找到 Inspector 现有字符串解析器，也都发现它拒绝空值，不能直接用于 prompt。只想借这个提醒，不需要安装 ECC 整套。

## 比了什么

真实输入是 [Inspector #2859](https://github.com/modelcontextprotocol/inspector/issues/2859)：CLI 把 `price=1.50` 先转成 JSON 数字，再变成 `"1.5"`；大整数还会失真。该问题已在本仓完成[局部实施和真实 CLI 接收](../inspector-prompt-strings/README.md)。这里重新考察**实施前的复用决定**，不是新的实施任务，也不是前瞻效率实验。

两路新上下文分别读完整方法正文，再只读相同的公开源码基线；不读工作树候选或旧结果，不写文件、不安装、不访问账号配置。任务是：找出能否复用的解析器及调用者，给出最小改动选择，保住 metadata／tool 的 JSON 行为和程序化 prompt 接口。

| 方法输入 | 已有内容 | 本次观察 |
|---|---|---|
| ECC `search-first` | 仓内搜索优先；工具可用性预检；按功能、维护、许可等判断 adopt／extend／compose／build；非简单题建议研究代理 | 找到现有 env parser，定位空值冲突；选择仓内共享 prompt 薄函数，不加外部包或 MCP |
| 本仓 `explore-frontier`＋专题 25＋Skills 页起点 | 先查已有材料和能力；明确约束及当前基线；只查能改变决定的事实；保留不改方案 | 找到同一 parser 和空值冲突；同样选择仓内小改、保留其他调用契约 |

这一次，两路决策相同，ECC 没有带来额外被采用的候选。其可借之处是**紧凑的编码前触发词和可用性清单**，而非已证实的提速或质量提升。一个事后案例不足以判断整套 ECC 的优劣；未比较耗时、调用数、成本或模型成功率。

## 决定性差异：同样叫 key=value，不是同一个契约

两路均回读了下面的声明、调用与已有测试，而非仅按函数名判断：

| 现有能力 | 为什么不能直接代替 prompt parser |
|---|---|
| `core/mcp/node/config.ts` 的 `parseKeyValuePair`（两入口别名 `parseEnvPair`） | 保留字符串和后续 `=`，但拒绝 `key=`；现有 env 测试明确保护此行为 |
| 单次 CLI 的 `parseKeyValuePair`、mcpdo 的 `parseKeyValue` | 有 `JSON.parse`；metadata／tool 也用，整体改成字符串会改变其他入口 |
| `parseHeaderPair` | 冒号分隔、trim 且拒绝空值，不是同一语法 |
| `convertPromptArguments` | 已有字符串原样保留，兼容程序化 JSON 值；无法恢复之前已经丢失的精度／词形 |

因此不是“发现已有 helper 就直接复用”，也不是“有小差异就装新包”：本题需要 prompt 专用的薄解析边界，保留 env 的原测试与其他 JSON 调用者。这与此前已实施的选择一致；**不能倒推 ECC 促成了此前修复。**

## 离线复核：16 个匹配，1 个反例

附带 [parser-probe.mjs](parser-probe.mjs) 从固定 Git 对象取出并校验原文件哈希，只执行其中的纯函数声明，不加载 Inspector 模块图。14 种字符串值，加重复键／后续等号、缺分隔符、空键，共 17 项目标 prompt 契约；[实际输出](parser-results.json)中 **16 项匹配，空值 1 项不匹配**。这是对“不能直接复用”的可运行反例，不是 env parser 自身有 bug。

已有 **Node 24、支持 `--no-lazy-fetch` 的 Git，以及包含下述公开提交对象的 Inspector clone** 时，从本仓根目录执行；不需要 `node_modules`：

```sh
node experiments/ecc-search-first/parser-probe.mjs <已有Inspector仓库>
node experiments/ecc-search-first/test-parser-probe.mjs <已有Inspector仓库>
```

第一条 exit 0 表示重现了记录中的单项不兼容，**不是 17 项全部通过**；结果变化 exit 1，缺输入／缺对象 exit 2。第二条验缺输入、错误仓库路径和固定源码反例，三项回归均通过。实跑 Node 24.22.1／Git 2.52.0；内置类型擦除会给 experimental warning。Git 禁止 lazy fetch 和 replace 对象，脚本不取网络、不安装、不改工作树／index；执行前后原工作树差量与 index diff 哈希一致。

这份探针不验证真实 CLI、stdio、daemon 或模型。此前真实 CLI 普通 prompt 的消费结果仍以原实验为准；mcpdo 的 socket 拒绝与完整门禁欠项保持，不借本探针补成通过。

## 何时有用，何时不加

- **Agent 经常先造新子系统**：这份窄 Skill 的“先查仓内”提醒有针对性。只声明原则还不够，要能指出看了哪个现有能力、差哪条契约。
- **已有项目方法已做到这一点**：本例没有新增采用收益，继续原流程；不为高 Star 另装整套，也不把研究代理变成每个小修的必经步骤。
- **注册表、MCP 或其他渠道不可用**：记录该渠道未知；命令存在／版本可读，不证明查询成功。Skill 的 `gh auth status`、个人 Skill／MCP 配置预检也不自动获得访问权限，本次未执行。

真实使用者在 ECC [#3680](https://github.com/affaan-m/ECC/issues/3680)报告过先提独立监控、后读连接器诊断才缩小方案，建议补既有能力复用案例。报告明确未独立确认原轮 ECC 激活／版本及因果关系，并承认原 Skill 已有该规则；这是采用风险的线索，不是确认的 ECC 运行时缺陷。该 issue 本轮核为 closed。

## 来源与复核范围

- **一手 Skill／许可**：[affaan-m/ECC 固定版](https://github.com/affaan-m/ECC/tree/b38be6a7f6350964d59328b52f0624e1d1d552d1)，原 `everything-claude-code` 地址重定向至此；[search-first 全文](https://github.com/affaan-m/ECC/blob/b38be6a7f6350964d59328b52f0624e1d1d552d1/skills/search-first/SKILL.md)、[MIT 许可](https://github.com/affaan-m/ECC/blob/b38be6a7f6350964d59328b52f0624e1d1d552d1/LICENSE)。本轮核官方仓库、单 Skill、相关变更及用户原帖，未安装 ECC 插件／hooks，未审全部 Skills。294,952 Star 是当时关注快照，不是效果排名。
- **既有方法**：[explore-frontier](https://github.com/dbvv1/a1dbv/blob/39d883da5f49ec5b80402d84a6c2c2f103ee570d/templates/generic/.claude/skills/explore-frontier/SKILL.md)、[专题 25](https://github.com/dbvv1/a1dbv/blob/39d883da5f49ec5b80402d84a6c2c2f103ee570d/docs/25-ai-exploration.md)、[Skills 页](https://github.com/dbvv1/a1dbv/blob/39d883da5f49ec5b80402d84a6c2c2f103ee570d/docs/decisions/skills-and-plugins.md)。该固定树的 Markdown 精确名称检索未见 ECC／search-first 来源入口；本次补来源覆盖，不将其算作新增运行能力。
- **真实任务及源码**：[问题 #2859](https://github.com/modelcontextprotocol/inspector/issues/2859)、[固定 env parser](https://github.com/modelcontextprotocol/inspector/blob/4fe3d9cc5db17367e9e645ee05f707daf154267e/core/mcp/node/config.ts#L43-L62)、[env 空值测试](https://github.com/modelcontextprotocol/inspector/blob/4fe3d9cc5db17367e9e645ee05f707daf154267e/clients/web/src/test/core/mcp/node/config.test.ts#L41-L46)、[转换边界](https://github.com/modelcontextprotocol/inspector/blob/4fe3d9cc5db17367e9e645ee05f707daf154267e/core/json/jsonUtils.ts#L423-L437)。探针用公开上游对象，不依赖未发布的本地候选树。
- **用户反馈**：上文 #3680 为本人场景回报，限制随原文保留；未取得独立、前瞻的同题生产收益比较，当前最高收益未知。

来源核实与本次只读对照、函数探针：2026-11-02 UTC。答案页原生新读者验收未由此完成，原评级保持。
