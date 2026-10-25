# A-DATASETTE-TYPED-PARAMS-001 · 真实 SQL 查询的显式整数参数

id: A-DATASETTE-TYPED-PARAMS-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 1c1040a50cc56fdb335f6058b83edd52b9543194
result_branch: relay/a-datasette-typed-params-001

## 判断与目标

值得接续，归 P81（完整能力真实采用）／P90（前沿选择落地）：为 Datasette 现有 #2946 需求交付**设计说明＋可运行 opt-in 原型＋可复制使用入口**。真实消费者是使用 Datasette 自定义／stored SQL 查询的开发者：其表达式比较不能依赖列亲和性自动转换，需要明确绑定整数。用 fixture SQLite 和产品请求入口消费补丁，不以独立转换函数测试替代产品验收。上游仍属 research，交付不声称语法获得维护者批准或项目已经采用。

本任务由现有 local-jobs 接收者认领，沿已配置原生 Workflow 让模型承担设计、实现、测试和初稿主产能；负责人负责范围与接收。不要新建执行调度或重复派发在途调用。复用 A-FRONTIER-SELECTION-001 在 099a98d 的选择、源码定位及有效独立审查；不重做前沿比较、合成探针、模型 A/B 或工具边界矩阵。

## 输入与交付边界

- Datasette 固定基线：`a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b`；先核目标 checkout 的 AGENTS、贡献／测试说明和相关 `.agents/skills`。开工仅补查 #2946 是否新增实现／PR与实际需改源码；若已被覆盖，回报决定性变化，不擅自切换另一小修题。
- 实现留在隔离的公开 Datasette 副本／本地分支；**不推上游、不开 PR、不评论、不发布部署**。知识库结果分支只交当前任务回执、必要的脱敏 patch 与短使用记录（沿现有目录，不新开编号专题）。固定补丁基线、结果提交与复现命令，保证另一执行者可恢复。
- 先提出一种明确、向后兼容的 opt-in 契约，再实现。至少支持 int；float／bytes 不为扩范围而加入。说明启用方式、参数名／类型语法、URL 编码、冲突与重复值规则，以及未知类型、缺失／空值、非整数和 SQLite 整数越界的处理。保留默认字符串语义，包括既有含特殊字符的参数名；若后缀解释会冲突，设计独立显式启用机制，而非静默重解释旧请求。
- 参数继续使用 SQLite 绑定，不拼接 SQL。检查 named parameter 派生、缺省值和显示回填逻辑，特别避免 `0` 被 `or ""` 吞掉。只改必要路径，不顺带重写通用过滤器或整个查询系统。

## 产品完成条件

1. 一份简短设计说明与可直接运行的请求示例：同一 fixture DB 对 `where age + 1 > :age`，默认字符串请求保持原状，显式整数请求得到人工可核对的预期行；用 `typeof(:age)` 等结果证明绑定值而非仅比较输出被改变。
2. 自定义查询和适用的 stored/canned query 入口均走实际 `datasette.client`／`datasette --get` 请求；覆盖 JSON 响应及受影响 HTML 参数回填。文档写清 supported 范围，不暗示表过滤入口自动支持本功能。
3. 正常值、0、负数、整数上下界、非法值／越界、缺失与空值、未知类型、重复／冲突与 URL 编码有契约对应测试；未启用时的旧字符串行为及权限边界有回归。启用后的非法输入返回清晰 400，`DatasetteError` 显式指定 `status=400`，不能泄漏为 500。
4. 新消费者／接收者从固定补丁恢复环境、按短文档执行成功请求和失败请求，复核结果与设计一致；模型自报、只绿 parser 单测或覆盖率百分比均不算接收。

## 实施反馈与完整验证

先在同一隔离 venv 安装项目 dev 依赖、pytest-cov、固定 diff-cover 10.6.0（按源码当前安装说明，所有命令指向同一 Python，使用 `--no-cache-dir`），建立基线；再实现、定向测试、修正、最终全量。相关入口从 queries、stored_queries、numeric_filter_values、filters、API／table API／HTML 测试起，随实际影响调整。

**diff-cover 只是实现反馈。** 针对当前补丁清理旧 coverage 数据并重新生成 XML，用固定 Datasette 基线比较，将 JSON 中未执行行交回模型补测试或解释。核新增源文件纳入测量、改动行分母非零；无数据不算通过。不要保留旧 XML 报绿，不加 ignore／pragma 刷分，不开发通用覆盖包装平台。阈值在开工时说明（90 仅前次示例），真实断言与全量结果才决定接收；不承诺速度或模型质量收益。

**最终全量范围不能缩成三个定向文件：** 对固定源码 `.github/workflows/test.yml` 逐项核实际命令，包含扩展编译（使 load-extension 测试真实执行）、pytest 全套非 serial＋serial（覆盖率追加）、HTTPS server shell 测试、`tests/test-datasette-load-plugins.sh`、Black、Ruff、cog、blacken-docs；文档与代码最后修改后重验受影响部分。保留命令、退出码、失败／skip 数、Python／SQLite／OS 版本和当前源码对应关系。

**可接受平台范围：** 本次以一个受支持 Linux/POSIX＋Python 版本完成以上全量（优先与覆盖率 CI 一致的 3.14；已有可用受支持版本亦可，写明差异）。不要求为了本原型跑遍 3.11–3.15 或 Windows/macOS，不声称未跑的 CI 矩阵通过。若某平台扩展／HTTPS／shell 无法运行，明确列为未运行及恢复条件，交由现有可用云端执行环境补验，不能把该缺项描述为完整通过。既有基线失败先判断与本改动关系；代码新失败必须修复，不删除测试或缩范围隐藏。

不新增视觉 UI 即不强求无关浏览器流程；如实现实际改变交互，核受影响真实浏览器流程。入口不可用或仍需人工判断的，负责人记入 TASKS“待人工验收”，注明版本与步骤，继续不依赖该判断的工作。

## 安全、审查与回流

只用公开源码、可信公开依赖和 fixture 数据；不读真实用户库，不建账号、不改凭据／安全设置，不用特权容器、不付费、不外发私人材料。**禁止 `--ssl-no-revoke`、`-k`、`--insecure`、关闭证书校验或绕过 TLS／证书警告**；历史报告的取数方式不是授权。遇证书问题停止该入口，记录具体错误，使用仅在正常验证通过且无拒绝的官方入口；不得以换入口规避明确拒绝。

对新增设计与产品补丁做一次全新上下文独立审查，重点是默认兼容、绑定、400 与漏测路径；不重审已有效审过的前沿选择。受影响修订复核即可，不叠加例行审查层。知识库交付按手册 §7 跑适用文档检查、公开文件／新增提交身份扫描、空白与人工差量审查；不因纯文档回流运行无关 Hook 实验。仅推指定结果分支，由负责人接收。

回写 `review_ready`：设计／patch／固定 SHA、实际通道与模型响应字段、产品检查已过／失败／未运行、待人工项，以及一句本次反馈是否真帮助发现遗漏。负责人接收后将真实任务路线与可复制入口回流现有正文，P81/P90 简记状态；不新建证明台账，不把研究标签抹成上游已采用。每次真实搭建／运行遵守两小时上限，受阻仅停依赖环节，原任务保留恢复条件。

依据：仓库 AGENTS、CLAUDE、运行手册 §4/7/9、TASKS、local-jobs README；选择固定 099a98d 与 main 1c1040a；2026-10-25 只读复核。#2946 网页再读取仍显示 open／research、无关联开发，页面缓存不等于实时 API，无新增完整 PR 搜索；实施开工补核。固定 CI 网页本次 Cache miss，完整命令以实施端取得同 SHA 源码为准；未运行任何 Datasette 测试。https://github.com/simonw/datasette/issues/2946 。diff-cover 官方仓库链接已打开确认：https://github.com/Bachmann1234/diff_cover 。

认领：dot 本地协作；2026-10-25T12:53Z。来源 main 固定 `98fc453`，复用已接收前沿选择与审查。仅在隔离副本实施 opt-in 原型及真实产品消费者；先核可用受支持平台，不安装特权设施。完整 POSIX 门禁与未运行项逐项报告，保持正常 TLS 校验；仅推指定结果分支。

---

## 宿主接续回应与当前交付（2026-10-25）

负责人反馈原文来源 `5a10b907dc2152f491017a17054f2054870f3e90`，由原任务正常 Git 接续回应：

## 负责人接续核对（2026-10-25 15:03 UTC）

认领记录为 12:53 UTC；当前 main 尚无本题后续执行／产物回执。这只证明交接缺少新状态，不证明离线、权限阻塞或连续运行超时。请接收端在原任务下一次正常接续时补充：实际模型／搭建执行起止与当前阶段、已完成补丁或检查、等待的具体原因、可恢复位置；如单次搭建／运行已到两小时，按既有上限保存结果并交回，不继续扩试。不要重发在途模型调用或从头重做，不因这条核对中断正常的未超时运行；已有产物优先交固定 SHA 与尚缺检查。

实际通道 Claude Code＋DeepSeek 原生 Workflow，父／子原始 assistant message.model 为 deepseek-flash，请求 alias 单独保留。首次实际调用 13:00:36–14:29:34 UTC（约89分钟）；独审后同会话定向修订 14:38:29–14:56:52 UTC（约18分钟），两次均已结束，未重发初始调用，单次没有超过两小时。首次消费者查出 POST 普通重复键默认兼容性偏差，随后独立审查又复现 POST JSON 重复字段绕过与 query 元数据重放失败；均修正并保留原始失败与旧补丁。当前补丁、设计、复现请求和原流已保存，恢复入口为本文件固定基线及完整内嵌 patch。

当前阶段为 review_ready：60 项类型参数测试、185 项定向测试和最终恢复副本的受影响消费者6/6通过；原独审定向复核F1/F2关闭，宿主真实浏览器加载／重提／Edit SQL 导航已核，SQL编辑参数重建限制实际保留。未等待新的模型调用、授权或联通；余项是一个受支持 Linux/POSIX 平台上的完整 test.yml（含扩展编译／真实load-extension、精确HTTPS与plugins shell入口）及负责人接收。本机没有可用Linux/POSIX，已交已有云端／支持平台补验，不能把Windows失败或替代脚本当全量通过；不要求额外版本矩阵。

内嵌统一diff的五个空白上下文行包含必要的单个空格标记，Git whitespace检查会报告；它们是补丁数据而非新增源码尾空白，最终patch实际可应用／逆应用，源码格式检查通过。原始五处提示保留，不删标记破坏补丁，不修改全局配置或通用检查器来隐藏。

## 结果回执（review_ready，2026-10-25）

### 范围与固定基线

- Datasette 基线 `a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b`（与当前默认分支 HEAD 相同），只改隔离副本；未推上游、未开 PR、未评论、未部署。
- 开工复核 #2946：`open`、`research` 标签、1 条评论（`asg017` 提到 `::integer` 后缀思路）、无关联 PR；2026-10-25 的 GitHub API 搜索结果 `total_count=0`。没有“已被完整实现”的决定性变化。
- 本轮为原任务同一会话的修订：只处理独立审查提出的 F1（POST JSON 重复字段绕过）与 F2（`_extra=query` 重放失败），未重跑首次完整 Workflow、全量 CI 或联通。修订前的源码、旧 patch、旧 coverage 与原始失败日志已另存 `revision-1/pre-edit`，未覆写。
- 补丁 4 文件，`+808 / -15`（`git apply --numstat` 口径），SHA256 `8598177d98f5832b8e932a0f51b380fa0c4bee3b1b9627532cbacc89b8692a00`；正文见文末。
- 自动审查待负责人执行；本回执不声称上游接受语法或项目已采用。

### 契约（opt-in，仅 int，默认完全兼容）

启用：请求串加 `_typed_params=1`，仅精确值 `1` 生效；缺省、空、`0` 或其它值保持旧行为。启用后，键 `name::int` 表示 SQL 命名参数 `:name` 以 SQLite INTEGER 绑定。

| 情况 | 行为 |
| --- | --- |
| 未启用 + `age::int=30` | 旧语义：`age::int` 是普通参数名，`:age` 缺失按原逻辑绑定空串，不重解释、不报错 |
| 启用 + `age::int=30` | 绑定 Python int `30`；`typeof(:age)` 为 `integer` |
| 启用 + `age=30`（无后缀） | 仍按旧字符串绑定；只有带 `::int` 的键被转换 |
| 值 `0` | 绑定 int `0`；HTML 回填 `value="0"`，不使用 `or ""` |
| 负数、`007` | 接受；`007` 规范化为 `7` |
| 上下界 | 接受 `-9223372036854775808` 与 `9223372036854775807`；越界 400 |
| 空值、空白、`+1`、小数、指数、下划线、十六进制、Unicode 数字、超长数字 | 400，`DatasetteError(status=400)` |
| `age::int` 重复（含同值） | 400 |
| `age=1&age::int=2` | 400（类型/非类型冲突） |
| `age::float`、`age::`、`::int` | 400（未知/缺失类型、空 base） |
| `other::int` 无对应命名参数 | 400 |
| `_foo::int` 指向下划线参数 | 400 |
| 重复 `_typed_params`（任意值或顺序） | 400（保留名，先于启用判断） |
| POST JSON 中重复 `age::int`（同值或异值） | 400，且不写库 |
| POST JSON 中重复 `_typed_params`（`0,1`、`1,0`、`0,0`） | 400，且不写库 |
| 未启用时重复普通键 | GET 保持旧的首值优先；POST form 保持旧的后值优先；POST JSON 保持旧的后值优先；不收紧 |

- URL：标准 form-urlencoded；`age::int` 与 `age%3A%3Aint` 等价，`-5` 与 `%2D5` 等价。值仍由 SQLite 绑定，不拼接 SQL。
- 入口：GET 自定义查询 `/db/-/query`、GET 只读 stored/canned query `/db/query-name`；POST 写 stored query 的 form/JSON body 也走同一解析。表过滤入口不支持本功能，未改动通用 filter 框架。
- POST JSON 重复检测：解析时保留顶层对象的原始字段对供 `MultiParams` 判断重复，普通字段仍按 JSON 旧语义后值优先；嵌套对象仍解码为普通 dict，因此既有的 `str(value)` 字符串化不变。
- `_extra=query` 与 HTML 的两套映射：SQL 执行和 `_extra=query` 报告使用 SQL base name → 已解析值（`{"age": 0}`），可直接用返回的 SQL/params 重放；HTML 回填和编辑 SQL URL 使用请求串拼写（`{"age::int": 0}`）并带 `_typed_params=1`。两者分开，避免修好重放时破坏 typed 回填。
- 权限：`execute-sql`／`view-query`／写查询权限检查在类型解析前执行，拒绝时为 403，不会先暴露参数错误。
- HTML：参数表单回显 `name="age::int"` 与隐藏 `_typed_params=1`，重提仍保持类型；编辑 SQL 链接也带 `_typed_params=1`。已知限制：浏览器内改 SQL 后，现有 JS 参数刷新只按 SQL 重建字段，会丢掉 `::int` 后缀和原值；重新打开保留 typed key／开关的原 URL 可恢复原查询。本轮不为此改通用表单/JS。

### 可直接运行的入口

在固定源码上应用补丁后，用自有 fixture（不要用真实用户库）：

```bash
python - <<'PY'
import sqlite3
conn = sqlite3.connect("typed_params.db")
conn.executescript("""
create table people (id integer primary key, name text, age integer);
insert into people (name, age) values ('Alice',30),('Bob',41),('Carol',0),('Dave',-5);
""")
conn.commit()
PY
```

stored query 配置 `typed_params.yaml`：

```yaml
databases:
  typed_params:
    queries:
      ages_above:
        sql: select name, age from people where age + 1 > :age order by age
        params:
        - age
        is_trusted: true
```

在 fixture 所在目录执行（`typed_params.db` 的文件名决定 database 名 `/typed_params/`；假设 `datasette` 已在 PATH）：

```bash
datasette typed_params.db -c typed_params.yaml --get '/typed_params/-/query.json?sql=select+name%2C+age%2C+typeof%28%3Aage%29+as+bound_type%2C+%3Aage+as+bound_value%2C+age+%2B+1+%3E+%3Aage+as+matches+from+people+order+by+id&age=30'
datasette typed_params.db -c typed_params.yaml --get '/typed_params/-/query.json?sql=select+name%2C+age%2C+typeof%28%3Aage%29+as+bound_type%2C+%3Aage+as+bound_value%2C+age+%2B+1+%3E+%3Aage+as+matches+from+people+order+by+id&_typed_params=1&age%3A%3Aint=30'
datasette typed_params.db -c typed_params.yaml --get '/typed_params/ages_above.json?_typed_params=1&age%3A%3Aint=30'
datasette typed_params.db -c typed_params.yaml --get '/typed_params/ages_above.json?_typed_params=1&age%3A%3Aint=abc'  # exit 1
datasette typed_params.db -c typed_params.yaml --get '/typed_params/-/query.json?sql=select+name%2C+age%2C+typeof%28%3Aage%29+as+bound_type%2C+%3Aage+as+bound_value%2C+age+%2B+1+%3E+%3Aage+as+matches+from+people+order+by+id&_typed_params=1&age%3A%3Aint=0&_extra=query'
datasette typed_params.db -c typed_params.yaml --get '/typed_params/ages_above.json?_typed_params=1&age%3A%3Aint=0&_extra=query'
```

实际 `datasette --get` 输出（字段与值原样，仅为可读性拆行；SQL 为 `select name, age, typeof(:age) as bound_type, :age as bound_value, age + 1 > :age as matches from people order by id`）：

```text
默认字符串 ?age=30
{"ok":true,"rows":[
  {"name":"Alice","age":30,"bound_type":"text","bound_value":"30","matches":0},
  {"name":"Bob","age":41,"bound_type":"text","bound_value":"30","matches":0},
  {"name":"Carol","age":0,"bound_type":"text","bound_value":"30","matches":0},
  {"name":"Dave","age":-5,"bound_type":"text","bound_value":"30","matches":0}
],"truncated":false}

显式整数 ?_typed_params=1&age::int=30
{"ok":true,"rows":[
  {"name":"Alice","age":30,"bound_type":"integer","bound_value":30,"matches":1},
  {"name":"Bob","age":41,"bound_type":"integer","bound_value":30,"matches":1},
  {"name":"Carol","age":0,"bound_type":"integer","bound_value":30,"matches":0},
  {"name":"Dave","age":-5,"bound_type":"integer","bound_value":30,"matches":0}
],"truncated":false}

0 值 ?_typed_params=1&age::int=0
{"ok":true,"rows":[{"v":0,"t":"integer"}],"truncated":false}

stored query /typed_params/ages_above.json?_typed_params=1&age::int=30
{"ok":true,"rows":[{"name":"Alice","age":30},{"name":"Bob","age":41}],"truncated":false}

custom + _extra=query，age::int=0
{"ok":true,"rows":[...bound_value=0...],"query":{"sql":"select name, age, typeof(:age) as bound_type, :age as bound_value, age + 1 > :age as matches from people order by id","params":{"age":0}},"truncated":false}
用返回 SQL/params 在独立 SQLite 连接重放：rows 与响应一致。

stored + _extra=query，age::int=0
{"ok":true,"rows":[{"name":"Carol","age":0},{"name":"Alice","age":30},{"name":"Bob","age":41}],"query":{"sql":"select name, age from people where age + 1 > :age order by age","params":{"age":0}},"truncated":false}
用返回 SQL/params 重放：rows_match=true。

HTML（仅服务器响应，不是浏览器验证）：<input type="hidden" name="_typed_params" value="1">
      <input type="text" id="qp1" name="age::int" value="0" ...>
      <td class="col-v">0</td><td class="col-t">integer</td>

非法值 age::int=abc -> 400（CLI exit 1）
{"ok":false,"error":"Parameter 'age::int' requires a base-10 integer; got 'abc'","errors":["Parameter 'age::int' requires a base-10 integer; got 'abc'"],"status":400}

越界 9223372036854775808 -> 400
{"ok":false,"error":"Parameter 'age::int' is outside SQLite's signed 64-bit integer range (-9223372036854775808 to 9223372036854775807)","errors":[...],"status":400}

冲突 age=1&age::int=2 -> 400
{"ok":false,"error":"Parameter 'age' was supplied both with and without a type suffix","errors":[...],"status":400}
```

手工核对：默认字符串下 `age + 1 > '30'` 对四行全为假；整数绑定下只有 Alice（31）和 Bob（42）为真，且 `typeof(:age)=integer` 证明改变的是绑定值而非仅展示。

### 验证与覆盖

环境：Windows 11 10.0.26200、Git Bash（**不是 Linux**）、本机无 WSL 发行版；Python 3.13.5、SQLite 3.49.1；独立 venv，`pip install --no-cache-dir -e . --group dev` + `pytest-cov 7.1.0` + `diff-cover 10.6.0`；pytest 9.1.1、black 26.5.1、ruff 0.17.2、coverage 7.17.0。CI 覆盖率版本为 3.14，本次为 3.13.5。

- 修订前证据：把本轮新增回归测试放到 `revision-1/pre-edit` 的旧实现上运行，**7 failed / 2 passed**（失败为 F1 的 JSON 重复 typed 同值/异值、重复 flag `0,1`/`1,0`/`0,0`，以及 F2 的 custom/stored `_extra=query` base binding；两个“嵌套对象字符串化不变”“JSON 普通重复键后值优先”守卫通过）。日志 `raw/revision1-prefix-regressions.log`。
- `pytest tests/test_typed_params.py -q`：**60 passed**（原 51 项 + 本轮 9 项回归；覆盖默认字符串、0、负数、上下界、非法/越界/空/缺失、未知类型、GET/POST form/POST JSON 重复与冲突、URL 编码、stored read/write 权限先于类型校验、HTML 回填与编辑链接、`_extra=query` base binding 与 SQL 重放）。
- 定向回归与覆盖率：`tests/test_typed_params.py tests/test_queries.py tests/test_numeric_filter_values.py tests/test_filters.py`：**185 passed**。清空旧 `.coverage`/XML 后按最新 source 重新生成；diff-cover 10.6.0 对固定基线 `a8e13cc` 的 diff（`--include-untracked`，分母含新增文件）：**100%（90 条改动源码行，0 缺失）**，`typed_params.py` 100%（54 stmts）、`database.py` 100%（36 条改动源码行）；未使用 exclude/pragma 省略覆盖，阈值开工定为 90（仅反馈，不代替断言）。产物 `raw/coverage-revision1.xml`、`raw/diff-cover-revision1.json`。
- `black --check`（3 个 Python 改动文件）通过；`ruff check datasette tests` 通过。Black 在 3.13 上提示 target 3.15 的 AST 安全校验警告，但退出码 0。
- 空白：`git diff --check` 对公开回执内联 patch 的 5 个 unified-diff 上下文空行（单个空格前缀）报 trailing whitespace；这些空格是 `git apply` 解析空上下文行的语法所需，改成空行会报 `corrupt patch`。源码文件与 patch 新增行本身无行尾空白；内嵌 patch 与私有 patch SHA256 相同，且 `git apply --check` 通过。
- 补丁恢复：在原有干净基线副本 `validation/base`（`a8e13cc`）上 `git apply --check` 通过；应用后 `pytest tests/test_typed_params.py` **60 passed**、定向四文件 **185 passed**；`git apply -R` 后 `git status --short` 为空。原始失败/旧 patch/旧 coverage/旧稿另存 `revision-1/pre-edit`，未覆写。
- 本轮受影响消费者（独立于旧 37/37）：在恢复后的最终 patch 上跑 `raw/revision1-requests/consumer_check.py`，**6/6 PASS**：JSON 重复 typed -> 400 且无写入、JSON 重复 flag `1,0` -> 400 且无写入、正常 JSON typed 写入 integer、JSON 普通重复键后值优先、custom/stored `_extra=query` 报告 `{"age": 0}` 且用返回 SQL/params 重放与响应 rows 一致。真实 CLI 请求及重放见 `raw/revision1-requests/revision1-cli-requests.log`。
- 旧独立消费者数据只适用于上一版补丁：上一版为 `pytest tests/test_typed_params.py` **44 passed**、独立请求 **37/37 PASS**、定向四文件 **169 passed**；不把 37/37 说成覆盖本修订，也不以它替代本轮 6/6 与 60/185。
- 独立消费者按 `test.yml` 在 Windows 上的历史全量结果（保留原始失败计数，不等同 POSIX 门禁）：非 serial `pytest -n auto -m "not serial" ...` = **94 failed / 2743 passed / 85 skipped / 6 xfailed / 15 xpassed / 23 errors**（exit 1，623.14s）；serial `pytest -m serial ... --cov-append` = **24 failed / 15 passed / 1 skipped**（exit 1，16.21s）。修订：先前“失败均为 Windows 环境基线”的表述过宽；实际只对 **8 个代表用例**在 pristine `a8e13cc` 复核为平台基线（tempdir teardown `PermissionError [WinError 32/5]`、文件锁/CRLF/反斜杠路径/SIGTERM/SIGINT、publish mock 差异），其余失败未逐项对照，不能概括为全部基线。本轮不重跑全量 Windows。
- 扩展编译、HTTPS、load-plugins：沿用首次验证证据，本轮未重跑。精确 `tests/test_datasette_https_server.sh` 仍未运行（其就绪循环使用 `curl --insecure`，本任务禁止）；首次的正常证书 HTTPS 变体（trustme + `urllib(cafile=...)` 请求 `/_memory.json` 得 200）与 plugins 的 Python 等价断言仅作替代证据，精确脚本未验仍未验。本轮无 TLS 绕过。
- 失败/未运行边界：`test_docs.py` 与 `test_cli_serve_get.py` 的平台说明沿用首次结果；受支持 Linux/POSIX + Python 3.14 的 `test.yml` 全量、3.11/3.12/3.15 矩阵、prettier **未运行/未声称通过**。Windows 全量的 failure/error 不计为通过，也不把缺项写成完整通过。

### 待人工／下一阶段

1. 与实施上下文分离的原 code-reviewer 已完成定向修订复核：F1 JSON 重复字段拒绝且无写入，F2 custom/stored `_extra=query` 返回 base binding 并可重放，均关闭；当前差量未发现新的必须修复项。宿主另完成下述真实浏览器检查。
2. 在受支持 Linux/POSIX + Python 3.14 上按 `test.yml` 逐项跑全量，补扩展编译、HTTPS server、load-plugins、格式与 cog/blacken-docs；保留失败/skip 数与版本对应。本机无 Linux/POSIX 运行时，这是当前最大的未运行项。
3. 新消费者从文末最终 patch（SHA256 `8598177…`）与上述 fixture 重新执行成功/失败请求；本轮已在恢复后的 patch 上完成受影响消费者 **6/6** 与定向 **60/185**，与旧补丁的 37/37 分开记录。最终 SHA 仍由宿主复核。
4. 宿主已用真实浏览器验证最终补丁：custom 查询的 `age::int=0` 加载／Run SQL 重提仍显示 `0/integer`；stored 查询同样保留零值并返回 Carol/0、Alice/30、Bob/41，Edit SQL 导航保留类型开关与参数。实际新增 SQL 参数时，现有 JS 会将 typed 字段重建为普通字段并清空值，已确认这是本原型的已声明限制；应重新打开含类型 key 与开关的原 URL，而不是把该编辑流程称为通过。仅使用自有 fixture 与本机临时服务，页签及服务已关闭，截图和交互记录留本机。
5. Windows 全量的 failure/error 中，仅 8 个代表用例在 pristine `a8e13cc` 复核为平台基线；其余未逐项对照，不能概括为“失败均为 Windows 基线”，也不当作本改动的代码失败或 POSIX 门禁通过。

```text
review_ready:
  status: review_ready_pending_posix_and_owner
  revision: 1 (F1 POST JSON duplicate detection; F2 _extra=query base binding/replay; receipt facts corrected)
  base_sha: a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b
  patch_sha256: 8598177d98f5832b8e932a0f51b380fa0c4bee3b1b9627532cbacc89b8692a00
  design: 本文件“契约”节；私有设计稿在任务私有目录，不随公开文件发布
  channels: datasette.client（测试）; datasette --get（手工请求）; 恢复后 patch 的 datasette.client 消费者脚本
  model_response_fields: raw parent/child assistant message.model=deepseek-flash；requestedModel/workflow_progress/modelUsage 显示 deepseek-v4.1-flash[1m]，后者是请求 alias，不据此反推后端
  product_checks:
    new_product_tests: passed (60; 原 51 + 本轮 9 回归)
    focused_regression: passed (185)
    revision_consumer_requests: passed (6/6, 最终 patch 恢复副本; 与旧补丁 37/37 分开)
    diff_cover: 100% (90 changed source lines, 0 missing; typed_params.py 100%, database.py 100%; include-untracked)
    restore_reapply: passed (60 typed + 185 focused on pristine a8e13cc; reverse apply clean)
    related_suites: Windows temp-teardown/env failures; only 8 representative cases rechecked on pristine, others not individually compared
    full_ci: not_run (Linux/POSIX+3.14 gate pending; Windows full run had environment failures, not rerun)
  manual_items: 一个受支持 Linux/POSIX+Python 版本的完整 CI（优先3.14）；扩展/HTTPS/load-plugins 精确入口；负责人接收。独审修订复核与上述浏览器检查已完成，SQL编辑限制保留。
  feedback_value: 独立审查的两个产品缺陷均真实可复现：旧实现下新增回归 7 failed / 2 passed。F1 现保留 POST JSON 顶层原始字段对，重复 typed/flag 均 400 且不写库，普通字段仍后值优先；F2 现把执行/`_extra=query` 的 base name 映射与 HTML typed 回填映射分开，返回 SQL/params 可直接重放。回执同时收窄 Windows 基线结论、纠正 HTML 浏览器证据边界，并从 raw 区分实际 message.model 与请求 alias。
```

### 完整 patch

将下面内容保存为 `typed-params.patch`，在固定基线 `a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b` 上 `git apply`；反向为 `git apply -R`。

```diff
diff --git a/datasette/templates/query.html b/datasette/templates/query.html
index 8dd1037..88dede4 100644
--- a/datasette/templates/query.html
+++ b/datasette/templates/query.html
@@ -38,6 +38,7 @@
 {% block description_source_license %}{% include "_description_source_license.html" %}{% endblock %}
 
 <form class="sql core" action="{{ urls.database(database) }}{% if stored_query %}/{{ stored_query }}{% endif %}" method="{% if stored_query_write %}post{% else %}get{% endif %}" data-parameters-url="{{ urls.database(database) }}/-/query/parameters">
+    {% if query and query.typed_params_enabled %}<input type="hidden" name="_typed_params" value="1">{% endif %}
     <h3>Custom SQL query{% if display_rows %} returning {% if truncated %}more than {% endif %}{{ "{:,}".format(display_rows|length) }} row{% if display_rows|length == 1 %}{% else %}s{% endif %}{% endif %}{% if not query_error %}
         <span class="show-hide-sql">(<a href="{{ show_hide_link }}">{{ show_hide_text }}</a>)</span>
     {% endif %}</h3>
diff --git a/datasette/typed_params.py b/datasette/typed_params.py
new file mode 100644
index 0000000..829f502
--- /dev/null
+++ b/datasette/typed_params.py
@@ -0,0 +1,104 @@
+from __future__ import annotations
+
+import re
+from dataclasses import dataclass
+
+TYPED_PARAMS_FLAG = "_typed_params"
+TYPE_SEPARATOR = "::"
+SUPPORTED_TYPES = ("int",)
+INT64_MIN = -(2**63)
+INT64_MAX = 2**63 - 1
+_INTEGER_RE = re.compile(r"-?[0-9]+\Z")
+
+
+class TypedParameterError(ValueError):
+    "A query string violated the opt-in typed parameter contract."
+
+
+@dataclass
+class ResolvedTypedParameters:
+    params: dict
+    # base parameter name -> key used in the query string, e.g. "age" -> "age::int"
+    typed_names: dict[str, str]
+    enabled: bool
+
+
+def resolve_typed_parameters(params, named_parameters, args=None):
+    """Resolve opt-in ``name::int`` values into Python integers.
+
+    ``params`` carries the legacy-resolved values (first value wins for GET
+    query strings, last value wins for POST form bodies), ``named_parameters``
+    the names derived from the SQL (or a stored query's declared parameters),
+    and ``args`` the original MultiParams used to detect repeated keys. With the
+    feature off this returns ``params`` unchanged, preserving legacy string
+    semantics.
+
+    A repeated ``_typed_params`` flag is rejected before the enabled check so
+    the outcome does not depend on which value happens to be first or last.
+    """
+    if args is not None and len(args.getlist(TYPED_PARAMS_FLAG)) > 1:
+        raise TypedParameterError(f"{TYPED_PARAMS_FLAG} may only be supplied once")
+
+    if params.get(TYPED_PARAMS_FLAG) != "1":
+        return ResolvedTypedParameters(params=params, typed_names={}, enabled=False)
+
+    named = set(named_parameters)
+    typed_names = {}
+    resolved = dict(params)
+
+    for key in params:
+        if TYPE_SEPARATOR not in key:
+            continue
+        base, _, type_name = key.partition(TYPE_SEPARATOR)
+        if not base:
+            raise TypedParameterError(f"Invalid typed parameter name {key!r}")
+        if type_name not in SUPPORTED_TYPES:
+            raise TypedParameterError(
+                "Unsupported parameter type {!r} in {!r}; supported types: {}".format(
+                    type_name, key, ", ".join(SUPPORTED_TYPES)
+                )
+            )
+        if base.startswith("_"):
+            raise TypedParameterError(
+                f"Typed parameter {key!r} cannot target an underscore parameter"
+            )
+        if base not in named:
+            raise TypedParameterError(
+                f"Typed parameter {key!r} does not match a named parameter in this query"
+            )
+        if base in params:
+            raise TypedParameterError(
+                f"Parameter {base!r} was supplied both with and without a type suffix"
+            )
+        if args is not None and len(args.getlist(key)) > 1:
+            raise TypedParameterError(f"Parameter {key!r} was supplied more than once")
+
+        value = params[key]
+        if value == "":
+            raise TypedParameterError(
+                f"Parameter {key!r} requires an integer value; it was empty"
+            )
+        if not _INTEGER_RE.match(value):
+            raise TypedParameterError(
+                f"Parameter {key!r} requires a base-10 integer; got {value!r}"
+            )
+        try:
+            integer = int(value)
+        except ValueError:
+            # Python limits how many digits int() will parse
+            raise TypedParameterError(
+                f"Parameter {key!r} requires a base-10 integer; got {value!r}"
+            )
+        if not INT64_MIN <= integer <= INT64_MAX:
+            raise TypedParameterError(
+                f"Parameter {key!r} is outside SQLite's signed 64-bit integer range "
+                f"({INT64_MIN} to {INT64_MAX})"
+            )
+
+        del resolved[key]
+        resolved[base] = integer
+        typed_names[base] = key
+
+    return ResolvedTypedParameters(
+        params=resolved, typed_names=typed_names, enabled=True
+    )
diff --git a/datasette/views/database.py b/datasette/views/database.py
index da20760..a995f82 100644
--- a/datasette/views/database.py
+++ b/datasette/views/database.py
@@ -14,8 +14,10 @@ from datasette.extras import ExtraScope, extra_names_from_request
 from datasette.plugins import pm
 from datasette.resources import DatabaseResource, QueryResource
 from datasette.stored_queries import StoredQuery, stored_query_to_dict
+from datasette.typed_params import TypedParameterError, resolve_typed_parameters
 from datasette.utils import (
     InvalidSql,
+    MultiParams,
     add_cors_headers,
     await_me_maybe,
     call_with_supported_arguments,
@@ -626,17 +628,45 @@ class QueryView(View):
         # Process the POST
         body = await request.post_body()
         body = body.decode("utf-8").strip()
+        args = None
         if body.startswith("{") and body.endswith("}"):
-            params = json.loads(body)
+            # json.loads() collapses repeated object keys, which would hide a
+            # repeated typed parameter or _typed_params flag. Keep the root
+            # object's original pairs for MultiParams duplicate detection while
+            # returning ordinary dicts (nested objects included) so the
+            # existing str(value) conversion below is unchanged.
+            root_pairs = []
+
+            def _collect_root_pairs(pairs):
+                # The hook runs for nested objects first; the top-level object
+                # completes last, leaving its pairs in root_pairs.
+                root_pairs[:] = pairs
+                return dict(pairs)
+
+            params = json.loads(body, object_pairs_hook=_collect_root_pairs)
+            args = MultiParams(root_pairs)
             # But we want key=value strings
             for key, value in params.items():
                 params[key] = str(value)
         else:
-            params = dict(parse_qsl(body, keep_blank_values=True))
+            pairs = parse_qsl(body, keep_blank_values=True)
+            args = MultiParams(pairs)
+            # dict(pairs) keeps the legacy last-value-wins POST semantics;
+            # args is only used below to detect repeated typed keys.
+            params = dict(pairs)
 
         # Don't ever send csrftoken as a SQL parameter
         params.pop("csrftoken", None)
 
+        named_parameters = stored_query.parameters or derive_named_parameters(
+            stored_query.sql
+        )
+        try:
+            typed_params = resolve_typed_parameters(params, named_parameters, args)
+        except TypedParameterError as ex:
+            raise DatasetteError(str(ex), title="Invalid typed parameter", status=400)
+        params = typed_params.params
+
         # Should we return JSON?
         should_return_json = (
             request.headers.get("accept") == "application/json"
@@ -767,7 +797,8 @@ class QueryView(View):
                 raise Forbidden("execute-sql")
 
         # Flattened because of ?sql=&name1=value1&name2=value2 feature
-        params = {key: request.args.get(key) for key in request.args}
+        args = request.args
+        params = {key: args.get(key) for key in args}
         sql = None
 
         if stored_query:
@@ -781,11 +812,24 @@ class QueryView(View):
             named_parameters = stored_query.parameters
         if not named_parameters and sql:
             named_parameters = derive_named_parameters(sql)
-        named_parameter_values = {
-            named_parameter: params.get(named_parameter) or ""
-            for named_parameter in named_parameters
-            if not named_parameter.startswith("_")
-        }
+        try:
+            typed_params = resolve_typed_parameters(params, named_parameters, args)
+        except TypedParameterError as ex:
+            raise DatasetteError(str(ex), title="Invalid typed parameter", status=400)
+        params = typed_params.params
+        # Extras and any consumer replaying the reported SQL bind the SQL base
+        # names, so report base name -> resolved value ("age" -> 0). HTML form
+        # refill and the edit-SQL link keep the query-string spelling with the
+        # type suffix ("age::int" -> 0) so resubmission stays typed.
+        named_parameter_values = {}
+        typed_parameter_values = {}
+        for named_parameter in named_parameters:
+            if named_parameter.startswith("_"):
+                continue
+            value = params.get(named_parameter, "")
+            named_parameter_values[named_parameter] = value
+            refill_name = typed_params.typed_names.get(named_parameter, named_parameter)
+            typed_parameter_values[refill_name] = value
         # Set to blank string if missing from params
         for named_parameter in named_parameters:
             if named_parameter not in params and not named_parameter.startswith("_"):
@@ -1034,16 +1078,14 @@ class QueryView(View):
                 except InvalidSql:
                     pass
                 if allow_execute_sql and is_validated_sql and ":_" not in sql:
+                    edit_sql_values = {"sql": sql, **typed_parameter_values}
+                    if typed_params.enabled:
+                        edit_sql_values["_typed_params"] = "1"
                     edit_sql_url = (
                         datasette.urls.database(database)
                         + "/-/query"
                         + "?"
-                        + urlencode(
-                            {
-                                "sql": sql,
-                                **named_parameter_values,
-                            }
-                        )
+                        + urlencode(edit_sql_values)
                     )
             save_query_url = None
             if (
@@ -1084,6 +1126,7 @@ class QueryView(View):
                         query={
                             "sql": sql,
                             "params": params,
+                            "typed_params_enabled": typed_params.enabled,
                         },
                         stored_query=stored_query.name if stored_query else None,
                         private=private,
@@ -1097,7 +1140,7 @@ class QueryView(View):
                         allow_execute_sql=allow_execute_sql,
                         save_query_url=save_query_url,
                         tables=await get_tables(datasette, request, db, allowed_dict),
-                        named_parameter_values=named_parameter_values,
+                        named_parameter_values=typed_parameter_values,
                         edit_sql_url=edit_sql_url,
                         display_rows=await display_rows(
                             datasette, database, request, rows, columns
diff --git a/tests/test_typed_params.py b/tests/test_typed_params.py
new file mode 100644
index 0000000..49968d6
--- /dev/null
+++ b/tests/test_typed_params.py
@@ -0,0 +1,645 @@
+import sqlite3
+from urllib.parse import urlencode
+
+import pytest
+import pytest_asyncio
+from bs4 import BeautifulSoup as Soup
+
+from datasette.app import Datasette
+
+PEOPLE_SQL = """
+create table people (
+  id integer primary key,
+  name text,
+  age integer
+);
+insert into people (name, age) values
+  ('Alice', 30),
+  ('Bob', 41),
+  ('Carol', 0),
+  ('Dave', -5);
+"""
+
+AGE_SQL = (
+    "select name, age, typeof(:age) as bound_type, :age as bound_value, "
+    "age + 1 > :age as matches from people order by id"
+)
+
+
+@pytest_asyncio.fixture
+async def ds():
+    ds = Datasette(memory=True)
+    db = ds.add_memory_database("typed")
+    await ds.invoke_startup()
+    await db.execute_write_script(PEOPLE_SQL)
+    await ds.add_query(
+        "typed",
+        "ages_above",
+        "select name, age from people where age + 1 > :age order by age",
+        parameters=["age"],
+        is_trusted=True,
+        source="user",
+        owner_id="root",
+    )
+    await ds.add_query(
+        "typed",
+        "underscore_declared",
+        "select 1 as one",
+        parameters=["_foo"],
+        is_trusted=True,
+        source="user",
+        owner_id="root",
+    )
+    await ds.add_query(
+        "typed",
+        "add_probe",
+        "insert into probes (note) values (typeof(:age))",
+        parameters=["age"],
+        is_write=True,
+        is_trusted=True,
+        source="user",
+        owner_id="root",
+    )
+    await db.execute_write("create table probes (note text)")
+    await ds.add_query(
+        "typed",
+        "add_note",
+        "insert into notes (value) values (:value)",
+        parameters=["value"],
+        is_write=True,
+        is_trusted=True,
+        source="user",
+        owner_id="root",
+    )
+    await db.execute_write("create table notes (value text)")
+    try:
+        yield ds
+    finally:
+        ds.close()
+
+
+POST_FORM_HEADERS = {"content-type": "application/x-www-form-urlencoded"}
+POST_JSON_HEADERS = {"content-type": "application/json"}
+
+
+def replay_in_memory(sql, params):
+    """Replay reported SQL/params in an independent SQLite connection."""
+    conn = sqlite3.connect(":memory:")
+    try:
+        conn.executescript(PEOPLE_SQL)
+        cursor = conn.execute(sql, params)
+        names = [column[0] for column in cursor.description]
+        return [dict(zip(names, row)) for row in cursor.fetchall()]
+    finally:
+        conn.close()
+
+
+def typed_path(sql, pairs):
+    return "/typed/-/query.json?" + urlencode([("sql", sql)] + list(pairs))
+
+
+@pytest.mark.asyncio
+async def test_default_string_semantics_unchanged(ds):
+    response = await ds.client.get(typed_path(AGE_SQL, [("age", "30")]))
+    assert response.status_code == 200
+    data = response.json()
+    assert [
+        (row["name"], row["bound_type"], row["bound_value"]) for row in data["rows"]
+    ] == [
+        ("Alice", "text", "30"),
+        ("Bob", "text", "30"),
+        ("Carol", "text", "30"),
+        ("Dave", "text", "30"),
+    ]
+    # age + 1 > '30' is false for every row: expression comparison is not coerced
+    assert [row["matches"] for row in data["rows"]] == [0, 0, 0, 0]
+
+
+@pytest.mark.asyncio
+async def test_explicit_int_binds_integer_and_changes_expression_comparison(ds):
+    response = await ds.client.get(
+        typed_path(AGE_SQL, [("_typed_params", "1"), ("age::int", "30")])
+    )
+    assert response.status_code == 200
+    rows = response.json()["rows"]
+    assert [(row["name"], row["bound_type"], row["bound_value"]) for row in rows] == [
+        ("Alice", "integer", 30),
+        ("Bob", "integer", 30),
+        ("Carol", "integer", 30),
+        ("Dave", "integer", 30),
+    ]
+    # Manually checkable: age + 1 > 30 is true only for Alice (31) and Bob (42)
+    assert [row["name"] for row in rows if row["matches"]] == ["Alice", "Bob"]
+
+
+@pytest.mark.asyncio
+async def test_typed_suffix_ignored_without_explicit_enable(ds):
+    response = await ds.client.get(typed_path(AGE_SQL, [("age::int", "30")]))
+    assert response.status_code == 200
+    rows = response.json()["rows"]
+    # :age was missing, so Datasette's legacy blank-string fallback applied
+    assert {row["bound_type"] for row in rows} == {"text"}
+    assert {row["bound_value"] for row in rows} == {""}
+    assert [row["matches"] for row in rows] == [0, 0, 0, 0]
+
+
+@pytest.mark.asyncio
+async def test_disabled_toggle_keeps_colon_colon_as_literal_argument(ds):
+    response = await ds.client.get(
+        typed_path(
+            "select :name as value, typeof(:name) as t",
+            [("_typed_params", "0"), ("name::int", "7")],
+        )
+    )
+    assert response.status_code == 200
+    assert response.json()["rows"] == [{"value": "", "t": "text"}]
+
+
+@pytest.mark.asyncio
+async def test_zero_is_bound_and_rendered_in_html(ds):
+    response = await ds.client.get(
+        typed_path(
+            "select :age as v, typeof(:age) as t",
+            [("_typed_params", "1"), ("age::int", "0")],
+        )
+    )
+    assert response.status_code == 200
+    assert response.json()["rows"] == [{"v": 0, "t": "integer"}]
+
+    html = await ds.client.get(
+        "/typed/-/query?"
+        + urlencode(
+            {
+                "sql": "select :age as v, typeof(:age) as t",
+                "_typed_params": "1",
+                "age::int": "0",
+            }
+        )
+    )
+    assert html.status_code == 200
+    assert (
+        'name="age::int" value="0" data-parameter-control '
+        'data-parameter-name="age::int"' in html.text
+    )
+    assert '<input type="hidden" name="_typed_params" value="1">' in html.text
+
+
+@pytest.mark.asyncio
+@pytest.mark.parametrize(
+    "value,expected",
+    [
+        ("-9223372036854775808", -9223372036854775808),
+        ("9223372036854775807", 9223372036854775807),
+        ("-1", -1),
+        ("007", 7),
+    ],
+)
+async def test_int_bounds_and_canonical_form(ds, value, expected):
+    response = await ds.client.get(
+        typed_path(
+            "select :age as v, typeof(:age) as t",
+            [("_typed_params", "1"), ("age::int", value)],
+        )
+    )
+    assert response.status_code == 200
+    assert response.json()["rows"] == [{"v": expected, "t": "integer"}]
+
+
+@pytest.mark.asyncio
+@pytest.mark.parametrize(
+    "value",
+    [
+        "-9223372036854775809",
+        "9223372036854775808",
+        "99999999999999999999999999999999",
+    ],
+)
+async def test_int_out_of_sqlite_range_is_400(ds, value):
+    response = await ds.client.get(
+        typed_path("select :age as v", [("_typed_params", "1"), ("age::int", value)])
+    )
+    assert response.status_code == 400
+    data = response.json()
+    assert data["ok"] is False
+    assert data["status"] == 400
+    assert "age::int" in data["error"]
+    assert "64-bit" in data["error"]
+
+
+@pytest.mark.asyncio
+@pytest.mark.parametrize(
+    "value",
+    [
+        "",
+        "12.5",
+        "abc",
+        " 1",
+        "1 ",
+        "1_0",
+        "+1",
+        "0x10",
+        "1e3",
+        "-",
+        "--1",
+        "١٢",
+        "9" * 5000,
+    ],
+)
+async def test_invalid_integer_values_are_400(ds, value):
+    response = await ds.client.get(
+        typed_path("select :age as v", [("_typed_params", "1"), ("age::int", value)])
+    )
+    assert response.status_code == 400
+    data = response.json()
+    assert data["ok"] is False
+    assert data["status"] == 400
+    assert "age::int" in data["error"]
+
+
+@pytest.mark.asyncio
+async def test_missing_parameter_keeps_legacy_blank_string(ds):
+    response = await ds.client.get(
+        typed_path("select :age as v, typeof(:age) as t", [("_typed_params", "1")])
+    )
+    assert response.status_code == 200
+    assert response.json()["rows"] == [{"v": "", "t": "text"}]
+
+
+@pytest.mark.asyncio
+@pytest.mark.parametrize(
+    "pairs,fragment",
+    [
+        ([("age::int", "1"), ("age::int", "2")], "more than once"),
+        ([("age::int", "1"), ("age::int", "1")], "more than once"),
+        ([("age", "1"), ("age::int", "2")], "both with and without"),
+        ([("age::float", "1")], "Unsupported parameter type"),
+        ([("age::", "1")], "Unsupported parameter type"),
+        ([("::int", "1")], "Invalid typed parameter name"),
+        ([("other::int", "1")], "does not match a named parameter"),
+        (
+            [("_typed_params", "1"), ("_typed_params", "1"), ("age::int", "1")],
+            "only be supplied once",
+        ),
+    ],
+)
+async def test_duplicate_conflict_unknown_and_repeated_toggle_are_400(
+    ds, pairs, fragment
+):
+    response = await ds.client.get(
+        typed_path("select :age as v", [("_typed_params", "1")] + pairs)
+    )
+    assert response.status_code == 400
+    data = response.json()
+    assert data["status"] == 400
+    assert fragment in data["error"]
+
+
+@pytest.mark.asyncio
+async def test_unicode_named_parameter_keeps_default_then_opts_in(ds):
+    sql = "select :naïve as v, typeof(:naïve) as t"
+    default = await ds.client.get(
+        "/typed/-/query.json?" + urlencode({"sql": sql, "naïve": "café"})
+    )
+    assert default.status_code == 200
+    assert default.json()["rows"] == [{"v": "café", "t": "text"}]
+
+    typed = await ds.client.get(
+        "/typed/-/query.json?"
+        + urlencode({"sql": sql, "_typed_params": "1", "naïve::int": "5"})
+    )
+    assert typed.status_code == 200
+    assert typed.json()["rows"] == [{"v": 5, "t": "integer"}]
+
+
+@pytest.mark.asyncio
+async def test_typed_underscore_target_is_rejected(ds):
+    response = await ds.client.get(
+        typed_path("select :_foo as v", [("_typed_params", "1"), ("_foo::int", "1")])
+    )
+    assert response.status_code == 400
+    assert "cannot target an underscore parameter" in response.json()["error"]
+
+
+@pytest.mark.asyncio
+async def test_url_encoded_key_and_value(ds):
+    path = (
+        "/typed/-/query.json?"
+        + urlencode({"sql": "select :age as v, typeof(:age) as t"})
+        + "&_typed_params=1&age%3A%3Aint=%2D5"
+    )
+    response = await ds.client.get(path)
+    assert response.status_code == 200
+    assert response.json()["rows"] == [{"v": -5, "t": "integer"}]
+
+
+@pytest.mark.asyncio
+async def test_stored_query_json_and_html_refill(ds):
+    response = await ds.client.get(
+        "/typed/ages_above.json?" + urlencode({"_typed_params": "1", "age::int": "30"})
+    )
+    assert response.status_code == 200
+    assert response.json()["rows"] == [
+        {"name": "Alice", "age": 30},
+        {"name": "Bob", "age": 41},
+    ]
+
+    default_response = await ds.client.get(
+        "/typed/ages_above.json?" + urlencode({"age": "30"})
+    )
+    assert default_response.status_code == 200
+    assert default_response.json()["rows"] == []
+
+    html = await ds.client.get(
+        "/typed/ages_above?" + urlencode({"_typed_params": "1", "age::int": "30"})
+    )
+    assert html.status_code == 200
+    assert (
+        'name="age::int" value="30" data-parameter-control '
+        'data-parameter-name="age::int"' in html.text
+    )
+    assert '<input type="hidden" name="_typed_params" value="1">' in html.text
+    table = Soup(html.text, "html.parser").find("table")
+    rows = [
+        [td.get_text() for td in tr.select("td")] for tr in table.select("tbody tr")
+    ]
+    assert rows == [["Alice", "30"], ["Bob", "41"]]
+    edit_link = Soup(html.text, "html.parser").select_one("a.stored-query-edit-sql")
+    assert edit_link is not None
+    assert "_typed_params=1" in edit_link["href"]
+    assert "age%3A%3Aint=30" in edit_link["href"]
+
+
+@pytest.mark.asyncio
+async def test_stored_write_post_uses_integer_binding(ds):
+    response = await ds.client.post(
+        "/typed/add_probe",
+        data={"_typed_params": "1", "age::int": "0"},
+    )
+    assert response.status_code == 302
+    note = (await ds.get_database("typed").execute("select note from probes")).first()[
+        0
+    ]
+    assert note == "integer"
+
+
+@pytest.mark.asyncio
+async def test_underscore_declared_parameters_are_not_refilled(ds):
+    response = await ds.client.get(
+        "/typed/underscore_declared.json?" + urlencode({"_typed_params": "1"})
+    )
+    assert response.status_code == 200
+    assert response.json()["rows"] == [{"one": 1}]
+
+
+@pytest.mark.asyncio
+async def test_stored_write_post_json_uses_integer_binding(ds):
+    response = await ds.client.post(
+        "/typed/add_probe",
+        json={"_typed_params": "1", "age::int": "-7"},
+    )
+    assert response.status_code == 302
+    note = (await ds.get_database("typed").execute("select note from probes")).first()[
+        0
+    ]
+    assert note == "integer"
+
+
+@pytest.mark.asyncio
+async def test_stored_write_post_typed_error_is_400(ds):
+    response = await ds.client.post(
+        "/typed/add_probe",
+        data={"_typed_params": "1", "age::int": "bad"},
+    )
+    assert response.status_code == 400
+    assert "age::int" in response.text
+    note_rows = (await ds.get_database("typed").execute("select note from probes")).rows
+    assert note_rows == []
+
+
+@pytest.mark.asyncio
+async def test_typed_errors_do_not_leak_as_500_for_html(ds):
+    response = await ds.client.get(
+        "/typed/-/query?"
+        + urlencode({"sql": "select :age", "_typed_params": "1", "age::int": "nope"})
+    )
+    assert response.status_code == 400
+    assert "age::int" in response.text
+
+
+@pytest.mark.asyncio
+async def test_permission_denial_precedes_typed_validation():
+    ds = Datasette(memory=True, config={"allow_sql": {"id": "root"}})
+    db = ds.add_memory_database("typed")
+    await ds.invoke_startup()
+    await db.execute_write_script(PEOPLE_SQL)
+    try:
+        response = await ds.client.get(
+            typed_path("select :age", [("_typed_params", "1"), ("age::int", "nope")])
+        )
+        assert response.status_code == 403
+        assert "age::int" not in response.text
+    finally:
+        ds.close()
+
+
+@pytest.mark.asyncio
+async def test_untrusted_stored_permissions_precede_typed_validation():
+    ds = Datasette(memory=True, config={"allow_sql": {"id": "root"}})
+    db = ds.add_memory_database("p")
+    await ds.invoke_startup()
+    await db.execute_write_script(
+        "create table notes (id integer primary key, note text)"
+    )
+    await ds.add_query(
+        "p",
+        "read_untrusted",
+        "select :age as v",
+        parameters=["age"],
+        is_trusted=False,
+        source="user",
+        owner_id="root",
+    )
+    await ds.add_query(
+        "p",
+        "write_untrusted",
+        "insert into notes (note) values (:note)",
+        parameters=["note"],
+        is_write=True,
+        is_trusted=False,
+        source="user",
+        owner_id="root",
+    )
+    try:
+        read = await ds.client.get(
+            "/p/read_untrusted.json?"
+            + urlencode({"_typed_params": "1", "age::int": "bad"})
+        )
+        assert read.status_code == 403
+        assert "age::int" not in read.text
+
+        write = await ds.client.post(
+            "/p/write_untrusted", data={"_typed_params": "1", "note::int": "bad"}
+        )
+        assert write.status_code == 403
+        assert "note::int" not in write.text
+        assert (await db.execute("select * from notes")).rows == []
+    finally:
+        ds.close()
+
+
+@pytest.mark.asyncio
+async def test_unenabled_post_duplicate_plain_keys_keep_last_value(ds):
+    # Legacy a8e13cc POST semantics: dict(parse_qsl(...)) -> last value wins.
+    response = await ds.client.post(
+        "/typed/add_note",
+        content="value=1&value=2",
+        headers=POST_FORM_HEADERS,
+    )
+    assert response.status_code == 302
+    row = (await ds.get_database("typed").execute("select value from notes")).first()
+    assert row[0] == "2"
+
+
+@pytest.mark.asyncio
+async def test_enabled_mode_leaves_untyped_parameter_as_text(ds):
+    response = await ds.client.get(
+        typed_path(AGE_SQL, [("_typed_params", "1"), ("age", "30")])
+    )
+    assert response.status_code == 200
+    rows = response.json()["rows"]
+    assert {(row["bound_type"], row["bound_value"]) for row in rows} == {("text", "30")}
+    assert [row["matches"] for row in rows] == [0, 0, 0, 0]
+
+
+@pytest.mark.asyncio
+@pytest.mark.parametrize(
+    "flags",
+    [
+        [("_typed_params", "0"), ("_typed_params", "1")],
+        [("_typed_params", "1"), ("_typed_params", "0")],
+        [("_typed_params", "0"), ("_typed_params", "0")],
+    ],
+)
+async def test_repeated_toggle_is_400_regardless_of_order(ds, flags):
+    response = await ds.client.get(
+        typed_path("select :age as v", flags + [("age::int", "1")])
+    )
+    assert response.status_code == 400
+    assert "only be supplied once" in response.json()["error"]
+
+
+@pytest.mark.asyncio
+async def test_post_duplicate_typed_values_are_400(ds):
+    response = await ds.client.post(
+        "/typed/add_probe",
+        content="_typed_params=1&age::int=1&age::int=2",
+        headers=POST_FORM_HEADERS,
+    )
+    assert response.status_code == 400
+    assert "more than once" in response.text
+    assert (
+        await ds.get_database("typed").execute("select note from probes")
+    ).rows == []
+
+
+@pytest.mark.asyncio
+@pytest.mark.parametrize(
+    "body",
+    [
+        '{"_typed_params":"1","age::int":"1","age::int":"2"}',
+        '{"_typed_params":"1","age::int":"1","age::int":"1"}',
+    ],
+)
+async def test_post_json_duplicate_typed_values_are_400(ds, body):
+    response = await ds.client.post(
+        "/typed/add_probe", content=body, headers=POST_JSON_HEADERS
+    )
+    assert response.status_code == 400
+    assert "more than once" in response.text
+    assert (
+        await ds.get_database("typed").execute("select note from probes")
+    ).rows == []
+
+
+@pytest.mark.asyncio
+@pytest.mark.parametrize(
+    "body",
+    [
+        '{"_typed_params":0,"_typed_params":1,"age::int":"1"}',
+        '{"_typed_params":1,"_typed_params":0,"age::int":"1"}',
+        '{"_typed_params":0,"_typed_params":0,"age::int":"1"}',
+    ],
+)
+async def test_post_json_repeated_toggle_is_400_and_does_not_write(ds, body):
+    response = await ds.client.post(
+        "/typed/add_probe", content=body, headers=POST_JSON_HEADERS
+    )
+    assert response.status_code == 400
+    assert "only be supplied once" in response.text
+    assert (
+        await ds.get_database("typed").execute("select note from probes")
+    ).rows == []
+
+
+@pytest.mark.asyncio
+async def test_post_json_duplicate_plain_keys_keep_last_value(ds):
+    response = await ds.client.post(
+        "/typed/add_note",
+        content='{"value":"1","value":"2"}',
+        headers=POST_JSON_HEADERS,
+    )
+    assert response.status_code == 302
+    row = (await ds.get_database("typed").execute("select value from notes")).first()
+    assert row[0] == "2"
+
+
+@pytest.mark.asyncio
+async def test_post_json_nested_object_keeps_legacy_stringification(ds):
+    response = await ds.client.post("/typed/add_note", json={"value": {"a": 1}})
+    assert response.status_code == 302
+    row = (await ds.get_database("typed").execute("select value from notes")).first()
+    assert row[0] == "{'a': 1}"
+
+
+@pytest.mark.asyncio
+async def test_custom_query_extra_reports_base_binding_and_replays(ds):
+    response = await ds.client.get(
+        typed_path(
+            AGE_SQL,
+            [("_typed_params", "1"), ("age::int", "0"), ("_extra", "query")],
+        )
+    )
+    assert response.status_code == 200
+    data = response.json()
+    assert data["query"]["sql"] == AGE_SQL
+    # Extras must expose the SQL binding name and resolved integer, not the
+    # query-string spelling, or the reported SQL/params cannot be replayed.
+    assert data["query"]["params"] == {"age": 0}
+    replayed = replay_in_memory(data["query"]["sql"], data["query"]["params"])
+    assert replayed == data["rows"]
+    assert {row["bound_type"] for row in replayed} == {"integer"}
+    assert {row["bound_value"] for row in replayed} == {0}
+
+
+@pytest.mark.asyncio
+async def test_stored_query_extra_reports_base_binding_and_replays(ds):
+    response = await ds.client.get(
+        "/typed/ages_above.json?"
+        + urlencode({"_typed_params": "1", "age::int": "0", "_extra": "query"})
+    )
+    assert response.status_code == 200
+    data = response.json()
+    assert data["query"]["sql"] == (
+        "select name, age from people where age + 1 > :age order by age"
+    )
+    assert data["query"]["params"] == {"age": 0}
+    replayed = replay_in_memory(data["query"]["sql"], data["query"]["params"])
+    assert (
+        replayed
+        == data["rows"]
+        == [
+            {"name": "Carol", "age": 0},
+            {"name": "Alice", "age": 30},
+            {"name": "Bob", "age": 41},
+        ]
+    )
```

## 固定交付

结果提交 `75a103a35b56191043dc9c72d0f8bca4d4304f73`，结果分支 `relay/a-datasette-typed-params-001`，公开仅原任务（含完整 patch、设计和复现入口）；Datasette 产品基线仍为 `a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b`。状态 review_ready，交 dot-A 接收并在现有支持平台补齐尚未运行的 POSIX 全量；没有上游提交、PR、部署或额外模型重派。宿主独立修订复核与真实浏览器证据已完成，Windows 原始失败、首次旧补丁及七项新回归失败保留。知识库文档检查382文件零错误、实际新增提交公开扫描643文件零命中；五个必要patch上下文空白提示按上文保留。
