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

<a id="relay-validation"></a>
## 薄中转任务包与回传校验（待启用）

**当前交付是校验器，不是自动执行器。** [validate_relay.py](../../scripts/validate_relay.py) 只读取受审任务包与选定快照，输出 JSON；不会安装、联网、调用模型、运行验收命令或派发任务。它复用上面的记录一致性校验，不把 `passed` 自述变成实际效果证明。[经验：本仓实现／模拟回归，2026-10-20]

任务负责人冻结输入与两组条件，本地 Codex 以后只负责调用指定入口、保存原始产物和回传；真正执行者才是指定 DSH、Claude Code（DS）或 ZCode 下的模型。当前没有连接这些入口；Claude Code 接 DeepSeek 不等于 Claude 模型。启用范围由用户另行确认。[运行约定]

2026-10-20原生Windows／Python 3.13.5回执：通过指定既有Local会话的应用接口，先核固定提交`cfc36599`六文件SHA256，再跑派发／回传正例及输入改动／越界新增／缺runtime／改任务但保旧锚四负例；退出码0、0、1、1、2、2，均符合预期。原始结果仅证明记录与指定快照校验，非整套原生OS测试、模型实验或优化收益。[执行端工具回执，主端核哈希／输出]

**功能通过不等于执行范围通过。** 同轮测试后恢复阶段出现一次约定测试目录外读取，发现后停止，未带回文件内容；不把本轮记为全程合规；读取原因及文件性质未核，不据此认定泄露或平台隔离失效。校验器未变，也没有执行权限隔离能力。真实任务启用前须确定可落实的读写边界及恢复材料范围；不能靠再加一句提示或一次绿色回执当修复。另一个新建任务的启动失败不代表这个既有会话不可用。[执行端回执／边界未通过，未改权限配置]

### 格式与信任锚

完整例子是 [task](relay-task.example.json) 和 [return](relay-return.example.json)，全部为合成数据。任务必填：

| 字段 | 含义与校验 |
|---|---|
| `schema_version`、`task_id`、`spec_revision` | 格式1、任务身份和受审规格版本；未知字段、重复JSON键及错误类型拒绝 |
| `input_revision` | 完整40／64位小写Git SHA，或明确的 `synthetic-` 标签；这里只验格式，准备者另核源码确实对应该提交 |
| `input_manifest`、`input_sha256` | 每个输入文件的规范相对路径与SHA256，以及整份清单摘要；校验器重读允许的实际文件，不只相信回执 |
| `read_scope`、`write_scope` | 精确文件集合，不是glob或目录前缀；前者等于初始输入清单，后者列允许增删改的路径 |
| `runtime` | 模型ID／版本、各工具ID／版本；回执须一致，真实后端与采样设置仍需执行端另核 |
| `comparison` | baseline、optimized与保持相同的条件；文字相同不自动证明事实量或实验控制相同 |
| `acceptance`、`max_steps`、`stop_conditions` | 复用既有验收ID／检查ID，另冻结停止条件；只检查记录，不执行检查或实时限时 |

`input_sha256` 为输入路径到文件哈希的字典，按 `json.dumps(mapping, sort_keys=True, separators=(',', ':'), ensure_ascii=True).encode('utf-8')` 计算SHA256，无尾换行。文件字节、路径、增删都会影响快照。[实现约定]

**独立的任务SHA不可省略。** `--task-sha256` 是负责人从受审任务文件原始字节冻结的SHA256，经可信交接单独传入；回执自带一个新hash不能替换它。若执行者能同时改任务和外部锚，本机制也无法认证授权；这不是签名系统。不要在派发时对未经审查的现文件临时算hash并当作原锚。[实现边界]

回执须绑定同一task／input SHA、input_revision、指定的 `baseline` 或 `optimized` 组及runtime；`verification` 沿用既有report格式。`output_manifest` 是**完整结果快照**：保留未改输入，并列全部结果文件，不只是挑选成功产物。校验器从实际输入／结果树独立计算增删改集合，要求它是 `write_scope` 的子集；遗漏只读输入同样算越界删除。[实现约定]

`verification.checks[].evidence.ref`若提供，必须是输出清单中实际存在、允许读取的文件相对路径，不接受URL或路径附注；检查文件及其hash不等于证明日志真实或检查已执行。失败／未运行项可不附证据，提供时仍核路径。

初始输入及结果必须是不同、互不嵌套的专用目录。先枚举路径／类型，再仅读受审允许集合内的内容；额外输入和越界输出不会因回执自行声明而被读取。绝对路径、`..`、Windows盘符／UNC、非规范分隔、选中根本身及树内符号链接、非普通文件均拒绝。生成文件的实际运行读写权限仍须由启用后的执行环境配置，这个校验器不会实施权限。[实现边界]

### 仅模拟试跑

从仓库根执行下面命令，只复制两份公开文本并运行校验器，不调用模型：

```bash
scratch=$(mktemp -d)
mkdir "$scratch/input" "$scratch/output"
cp templates/long-task/fixtures/relay-input.txt "$scratch/input/"
cp templates/long-task/fixtures/relay-input.txt "$scratch/output/"
cp templates/long-task/fixtures/relay-output.txt "$scratch/output/"
python3 scripts/validate_relay.py dispatch-check \
  templates/long-task/relay-task.example.json \
  --task-sha256 d8b7dae2bd22c81e84c86d3bc6f3b19f1949889adc667579113824170da93e2f \
  --input-root "$scratch/input"
python3 scripts/validate_relay.py return-check \
  templates/long-task/relay-task.example.json \
  templates/long-task/relay-return.example.json \
  --task-sha256 d8b7dae2bd22c81e84c86d3bc6f3b19f1949889adc667579113824170da93e2f \
  --input-root "$scratch/input" --output-root "$scratch/output" --arm baseline
python3 -m unittest discover -s tests -p 'test_validate_relay.py' -v
```

两个示例的预期退出码均为0；更改输入文本、任务包字节，或在结果中新增写范围外文件，应被拒。完整回归还覆盖缺字段、错误组／版本、只读文件删除、符号链接／特殊文件、目录嵌套及不执行payload。示例hash只对应本例，实际任务必须独立冻结新锚。[经验：模拟检查，非模型实验]

- 退出0／`complete`：该记录和选定树通过校验，不表示已派发、业务正确或优化有效。
- 退出1／`incomplete`：有完整性、绑定、范围或验收记录问题；失败回执也要保存，不能只收绿色结果。
- 退出2／`invalid`：输入格式、路径、文件类型或资源上限不合要求；CLI用错由argparse报帮助。

资源上限为JSON 1MiB、单文件64MiB、每树256MiB／10,000条目，超限拒绝。要求检查时目录静止且可信；不防并发路径替换，不检查空目录或权限元数据，不证明运行期间没碰根外文件或没改后恢复，也不能认证真实模型身份、Git提交归属及日志真伪。没有把hash检查当作沙箱。[实现边界]

<a id="relay-pilot-plan"></a>
## 首批优化对照预注册 v1（未启用）

2026-10-20；以下均为设计、NOT RUN。只选两条本仓建议，不重跑M6旧三题，也不评模型排名；建议基线为公开bb29268b，任务输入另按各项冻结。

先用具体案例检查建议能否落地、是否漏现实约束；这能纠错，但无对照不归因于优化。要声称改善，再按下述同条件对照看行为、返工和人工介入；少量案例只支持所测任务／版本，未测出差异记未证实，不靠模型自评凑收益。[研究：验证范围]

### 共同锁定与判定

每项3个配对重复，顺序AB、BA、AB；独立会话／目录，同一精确模型、effort、工具与反馈。模型／客户端版本、镜像digest、轮次／时间／调用上限及费用授权启用前填实冻结，目前未就绪，不擅换模型。记录排队、作业、人工主动工时，未知为null。

输入仅含允许源码、当轮公开需求／测试与条件提示，冻结逐文件SHA-256。评估包独立持有留出测试／参考解／调度及SHA，不分发。公开测试类别，不公开隐藏实例；不挂载知识库。轮末冻结产物后独立评估，不回传隐藏失败再修。故障／超时／越界／失败均留存，重试另记。评估器先用正确／错误实现自检，未通过不开模型任务。

主要结果为全部必要行为通过；二改新回归（同一断言通过→失败）与旧债、规格／设施变化分开。B至少2对严格改善、无新增关键失败，且每对人工主动工时不比A多超过10分钟才扩样；否则不扩大，新增关键失败撤回本任务优化默认。两组全过记无质量差异。仅为试点门槛，不证明普遍有效；费用非主指标，预算仍硬停止。

### 1. P27：改稿产物接续在途恢复

对应20§4“恢复包六项信息”及22§5连续需求段。假设：只重组交接事实，减少二改丢失逐人版本／未知状态。

公开应用：listmonk固定树`88031f3e082648bc3f95f285df74b7b38710b54d`（开发树，非正式版）；入口github.com/knadh/listmonk。冻结源码字节与许可，不混Vue路径。

R1共同前置任务：在隔离副本新增逐人发送审计记录，保存原活动身份、payload版本（正文／模板／headers／附件）、attempt及观察结果；不改变现有发送策略。用本地假供应商和合成收件人经历V1开始→pause/drain→编辑V2→resume。明确accepted／rejected／unknown／pending／suppressed，旧消息仍属于V1，暂停不宣称撤回。交实际代码、迁移、测试与账本。

R2新需求：从R1真实产物加入进程重启后的恢复预览，逐人列待处理、已确认、需对账和抑制集合；unknown不得自动归未发或触发补发，已确认不因改稿自动补V2，退订优先。保管理／发送权限；只输出计划，禁外发；非R1修错重试。

每对共同生成R1，复制同一指纹做R2；R1失败标旧债，两组均继承，不换参考实现。A拿原时间顺序交接；B按20§4六栏重排相同事实句，不补诊断／方案；冻结句子清单核相等。两组均有R1代码、全部公开测试结果、同样业务契约及同样P27必要事实。均无上轮聊天。

留出：新收件人编号／调度下检查低ID未完、高ID确认、供应商接受后丢回包、接受未落盘、DB写结果未知、渲染失败、取消终止分叉及退订。按活动／人／版本／attempt逐项比较，拒绝只报sent总数；验证实际恢复入口消费R1迁移和记录。隐藏具体事件及oracle，不把C1八人表当未见题。篡改旧身份、丢V1证据、unknown自动重发或把cancel接resume为关键失败。

产物：两轮源码／diff／迁移及父指纹，逐人事件／预览JSON，检查命令／数量／退出码与公开轨迹。人工准备共同事实、澄清与盲评单列；补代码或缺失事实不能归功B。

启用缺口：迁移、假供应商、故障屏障、留出检查和环境均未备齐。另取隔离应用运行／安装授权：按固定树声明核Go、Bun、Playwright与PostgreSQL／假SMTP，冻结版本／镜像并预检构建，不偷换源码。禁外发、真实名单／账号／生产库；AGPL许可随副本保留。合成题就绪不代表此题可执行。

### 2. 窄提示：改变退出契约时保相邻行为

对应22§5“改变一条契约时给相邻保留行为配验收”。假设：窄提示减少取消实现误伤正常提前返回，不重复旧测试指令／padding比较。

冻结入口：待制作标准库Python 3.11合成`stream_driver.py`、public_tests.py与两轮需求，原始空项目由独立准备者冻结SHA后才能派发；接口`run(source, handler)`，source为有限迭代器，handler消费其传入流；返回完整已消费序列并关闭源。Cancel表示取消，其他异常原样传播。

R1需求：实现正常处理；handler提前正常返回时，driver继续消费剩余源，结果含全部值；完整消费、空源、异常均关闭一次，不吞异常。R2需求：新增Cancel路径，取消之后不再请求下一值，保已消费前缀；正常提前返回仍须排空、既有返回格式与异常行为保留。每对共用同一R1实际产物，复制两份进入R2；失败保旧债，不换参考实现。两组获得逐字相同的所有行为规范与公开例子。

A普通提示，B仅追加：“修改前列出本轮改变的退出路径与相邻必须保留的路径，为后者补回归，并报告未覆盖处。”只改此提示，不加修法／工具，不宣称纯长度或一般Skill效果。

留出检查源调用次数／顺序、首值前／若干值后取消、正常提前返回、异常传播与恰好一次close；具体序列和异常实例仅评估端持有。R2对R1原检查重评；取消后多读或正常返回丢尾部为关键失败。产物为两轮代码／测试／diff、父指纹、检查与人工记录。启用前补夹具、oracle、自检与输入SHA；无需第三方包不代表模型运行已授权。仅检验合成机制，不外推真实异步框架或生产维护。

### 接收回执最低内容

逐attempt记录指纹、模型／入口、状态、A/B差异、首次／重试、检查及人工介入内容／时间／阶段。dot补做不记模型成功。输入不等、答案泄漏、越界或隔离失效即停并保记录；改协议升版本，不追结果换判据。
