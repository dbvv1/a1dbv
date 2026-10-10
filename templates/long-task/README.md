# 长任务验收记录模板 🧪 试用

> 核实时间：2026-10-10。
> **[经验：本仓库实现与合成测试]** 本模板检查记录的一致性，不证明代码正确，也不是模型长时自主能力的实验。示例任务、证据引用、版本与步数全部是**合成数据**，没有实际执行分页迁移或模型任务。

## 适用范围

**[经验：设计建议]** 适合跨会话、有多条验收标准或并行 worker 的任务：把“做完”的判断从一句自述变成可审查的记录。单行修复、改错字、小型只读查询可以直接跑相关检查、附结果，不必建立这套文件。中型任务可以省略 checkpoints、workers 和预算字段，只保留必要验收与证据。

**[经验：实现边界]** 不适合拿来替代实际测试、独立代码审查、需求验收、安全评估或生产放行。它不运行 JSON 中的任何内容，不打开证据路径，不发网络请求，不调用模型，不启动或管理 worker。

## 快速试跑

从仓库根目录执行（只需 Python 3 标准库）：

```bash
python3 scripts/validate_task.py \
  templates/long-task/task.example.json \
  templates/long-task/fixtures/report.passing.json
# exit 0: complete

python3 scripts/validate_task.py \
  templates/long-task/task.example.json \
  templates/long-task/fixtures/report.false-complete.json
# exit 1: incomplete（这是故意失败的合成用例）

python3 -m unittest discover -s tests -p 'test_validate_task.py' -v
```

**[经验：本仓库实测]** 随附 unittest 检查通过与失败的 CLI 返回码、错误 JSON、字段类型、重复 ID、漏验收、旧版本证据、未知状态、子任务阻塞和预算停止。这里测的是校验器行为，不是模型性能。完整用例见 [测试文件](../../tests/test_validate_task.py)。

## 使用步骤

1. **[经验：设计建议]** 开工前复制 task.example.json，写入具体、可观察的验收标准。每个 acceptance ID 对应一个或多个固定 check ID；例如“接口兼容”必须同时有回归测试与空页检查，不能只报其中之一。
2. **[经验：设计建议]** 由任务负责人审阅并保存独立的 spec；结果只能写到另一份 report。保留 spec 的受审版本，例如放在评审过的提交中。需求或 worker 计划有变更时，先审阅变更，再更新 spec_revision，不能为了变绿删除失败的验收项。
3. **[经验：设计建议]** 实际执行检查，保留日志或截图；用报告中的 revision 标识本次被检查的完整工作状态。代码或产物再变更后，旧证据不能沿用为当前证据。Git commit 只能标记已提交内容；有未提交改动时还需能区分完整工作状态的版本标识。
4. **[经验：设计建议]** worker 开始前登记到 spec.workers，并在恢复会话时读回 spec、report 和证据。断点只记关键可恢复阶段，不需要每一步都建 checkpoint。预算停止时记录明确 stop_reason 与未完成项，后续增加预算需由负责人决定。
5. **[经验：实现行为]** 用独立 spec 校验报告，再人工核对证据真实存在、检查确实执行、需求被正确理解。只有 result=complete 表示**这份记录**满足约束。

## 格式约定

**[经验：实现行为]** 所有 ID、description、revision、ref 都必须是非空字符串；数组、对象、整数严格检查，布尔值不作整数。未知字段、未知状态、重复 JSON 键和重复 ID 会报 invalid，避免字段拼错却静默通过。

### Spec：事先评审的约定

- task_id：任务标识
- spec_revision：约定版本；报告必须相同
- acceptance：非空数组，每项为 id、description、checks；checks 是非空 check ID 数组。acceptance ID 在该数组中唯一，check ID 在整个 spec 中唯一
- checkpoints、workers：可选的 ID 数组，各自数组内唯一；省略表示没有登记项目。登记的每项都必须在报告中出现
- max_steps：可选正整数。先约定一步的含义；它是记录约束，不会控制执行或自动计费

### Report：某个工作版本的结果

- task_id、spec_revision：必须与 spec 相同
- revision：本次检查的工作版本字符串
- status：complete / running / blocked / failed；只有 complete 可通过
- stop_reason：completed / in_progress / blocked / failed / budget_exhausted；只有 completed 可通过
- checks：数组，每项为 id、acceptance_id、status，以及可选 evidence
  - status：passed / failed / blocked / not_run；所有规定的 check 都必须 passed
  - evidence：passed 时必须提供，包含 revision 与 ref；revision 必须等于报告 revision，ref 为日志、截图或检查记录的位置字符串
  - 其他状态可以没有 evidence；若提供，也必须格式有效且版本匹配
- checkpoints、workers：可选数组，每项为 id、status；status 为 complete / running / blocked / failed / not_run。每个已登记项目必须 complete；报告新增的未登记项目也会阻止通过
- steps_used：非负整数；spec 有 max_steps 时必填，超过 max_steps 阻止通过。**恰好达到预算且真实完成可通过；因为耗尽预算而停止不是完成**

**[经验：实现行为]** 未登记 check、错配 acceptance ID、缺 check、缺证据、证据版本过期、未完成 checkpoint/worker、未报告已登记项目都会阻止通过。失败记录中仍可写 status=complete，但会因其他条件被拒绝；这正是 false-complete 合成样例演示的情况。

## 输出与退出码

**[经验：实现行为]** 正常调用输出 JSON：result、issues（code / path / message）、scope=record_consistency_only。

- 0：complete，记录满足约束
- 1：incomplete，记录格式有效，但有缺失或未完成条件
- 2：invalid，文件不可读、JSON 错误或格式无效

**[经验：实现行为]** CLI 参数用错时由 argparse 输出帮助到 stderr 并返回 2；--help 返回 0。结构化 JSON 适用于提供了两个路径的校验调用。不会写回输入文件。

## 信任边界与坑

- **[经验：实现边界]** “冻结”是流程约束，不是签名或密码学权限边界。持有 spec 写权限的人仍可同时篡改 spec 与报告；独立传入 spec 防止的是报告单方面遗漏必需 ID，不防恶意改约定
- **[经验：实现边界]** passed、complete、steps_used、revision 和 ref 都是提供者的声明；本工具不能识别伪造日志、只修改版本标签、没有登记的真实 worker、没有更新 revision 的源码变化，也不检查证据文件存在或内容正确
- **[经验：设计建议]** 在可信 CI 或独立评审中从受审 spec、真实运行记录生成报告，抽查 ref 是否对应真实检查；不要让“报告通过”取代实际验证。必须避免把生产密钥、私人日志或公司代码写入公开示例
- **[经验：实现边界]** 不计算 token、费用、耗时或成功率，不限制真实执行预算，也不证明任务规模或“长时间”能力。若要比较模型或工作流，需要另外固定任务、真实运行、成本与失败归因；参见 [19 实测记录](../../docs/19-experiments.md)

关联：[07 工作流](../../docs/07-workflows.md)、[09 评审与质量](../../docs/09-review-and-quality.md)、[校验器源码](../../scripts/validate_task.py)。
