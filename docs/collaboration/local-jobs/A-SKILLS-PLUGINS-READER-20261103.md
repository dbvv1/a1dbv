# A-SKILLS-PLUGINS-READER-20261103 · 按能力缺口完成配置小修
id: A-SKILLS-PLUGINS-READER-20261103
owner: dot-A
status: revision_requested
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 6b57614aa0cbcb6a52800717d0df22566de7cdf1
result_branch: relay/a-skills-plugins-reader-20261103
page: docs/decisions/skills-and-plugins.md@main

## 目标
读者的问题是：“修一个依赖库相关的 CLI 错误时，我需要装 Skill／插件，还是已有资料与工具就够？”
由此前未读过 a1dbv 的新读者，只照附入页面选择必要能力，实际处理 [jrnl #2011](https://github.com/jrnl-org/jrnl/issues/2011)：timeformat 的 %d 等字符串覆盖值不再因 YAML 解析崩溃，同时保留已有布尔、数值、结构化值及嵌套键行为。
上游已有 [候选 #2110](https://github.com/jrnl-org/jrnl/pull/2110)；先核当前状态，可接回已有候选验证，不另造投稿，不重复旧模型页或 DayOne 任务。

## 按什么做
按 kind: reader-test 原生 Workflow；接收端附入 page 在 main 实际解析版的全文，记录解析提交与内容指纹，正文缺失记输入卡点。
该页是唯一方法指南；可读原 issue、目标仓指令／贡献规范、源码与测试、所选项目配方和页面直接引用原始资料，不读 a1dbv 其他教程或旧实测结果。
让读者自行判断缺哪种能力、从哪里取得，以及是否需要扩展；不预选 Skill，不以安装数量判通过。选择现有工具也可以，但须说明依据并实际用于任务。
沿用已配置工具、已有依赖和可读项目资料；本机不安装或更新软件／依赖／插件，不改账号、全局配置、权限、接收端或收费入口。必要能力缺失记环境卡点，不换通道绕过。
若使用配方，分别记录发现、正文取得、在真实改动中的采用；手动读取按手动读取记，不冒充客户端自动加载。只用合成配置和临时 journal，不接触真实用户数据。

## 写入范围
只在本任务 worktree 修改 jrnl/config.py、jrnl/override.py、相关 tests/，以及 reader-tests/A-SKILLS-PLUGINS-READER-20261103-u1.md。
不改依赖声明／锁文件、项目全局规则、其他功能、a1dbv 页面／地图／TASKS、其他任务和历史结果；不复用别的读者工作树。
模型不提交／推送；接收端按原流程扫描并只推 result_branch，回 review_ready 或 blocked，交 dot-A 接收；不用 accept: auto，不合默认分支，不对外投稿或评论。

## 怎样算做成
从真实 CLI 用同样输入复现并验证字符串覆盖，另核原有非字符串覆盖行为；留下原行为失败、候选通过的回归，确认临时 journal 和无关配置按原契约保留。
跑项目相关测试与检查，记录准确输出和未运行原因；不能用 AST、依赖桩或读源码替代缺失的真实 CLI。非读者核实际 diff、运行结果与遗漏。
结果分别写开发任务做到哪步、页面怎样支持能力选择、所选资料／能力是否真正用上，以及具体卡点和页外帮助；页面缺口、环境限制、读者误解分开，无卡点写无。
本卡不要求试装整包，也不声称产品间优劣；真实安装／自动加载未走到就保留待验。首轮结果不覆盖、不自动再派新读者。
通常一个 60–90 分钟单元，最多两小时；受阻保全成果和恢复条件，由 dot-A 后续接收。

## 修改要求
沿原 result_branch 从 6b57614aa0cbcb6a52800717d0df22566de7cdf1 定点修订，不新建任务或 reader。先确认本次原调用、工具及登记进程已退出，且原 worktree 为单写者；未核清就保持隔离，不启动续接、不改旧文件。原 no-install、写域、合成数据、禁止全局／权限变更及不发上游约束保持。
1. 补合法嵌套穿透回归：用 journals.default 为字典的合成配置，将 `journals.default.timeformat` 覆盖为 `%d`，经过 `apply_overrides`，必要时接 `scope_config`，断言实际嵌套叶值和其他键保留。现有 `colors.body=%d` 的平面中间结果不是这项穿透验收，且 `%d` 不是合法颜色；不删除既有正确覆盖用例。
2. 修注释／docstring：当前上下文的 `%` 不能开头组成未引用的 YAML plain scalar，不能把 `timeformat: %d` 说成 directive 行；说明 YAML 解析失败后保留字面字符串的回退语义。保留原修法，不扩成全面配置类型系统。
3. 明确坏输入边界：未闭合 mapping `colors={body: red` 在原基线为 ParserError、候选为 AttributeError，两版均 exit 1；错误类型的合法 YAML `colors=red` 两版本来都会 AttributeError。记作坏输入失败位置／诊断变化，不能声称破坏合法结构化覆盖，也不把宽泛回退无条件称为全面正确。
4. 仅在原已授权、已具备的环境跑相关 pytest、ruff／black 及真实 CLI；恢复前提包括项目运行时、pytest-bdd 与默认 `-n=auto` 所需 pytest-xdist，不是有 pytest 就齐备。缺前提保留未运行，不安装、不以 AST／替身替代，不跨用户／其他读者工作树搜索或复用环境。
保留首轮与原提交，在同一 u1 追加修订、准确测试数量、依赖缺口及负责人下述云端补验；原首轮 taskDone=false／未提交推送自述不覆盖。原新增测试实际为 3 个参数化案例加 1 个 mapping 案例，共 4 个，非 5 个。非读者定点复核后回 review_ready；未实跑、输入回执与 wheel 来源未知各自保留，不把返工当新盲读。

## 当前结果

- 已按 reader-test 完成一轮：把公开 PR #2110 的补丁应用到 jrnl/config.py（make_yaml_valid_dict 捕获 YAMLError 回退字面字符串），并补 tests/unit/test_parse_args.py 回归（%d、%Y-%m-%d %H:%M、colors.body、结构化 mapping），另写 reader-tests 卡点报告；函数层/静态核对通过（git diff --check、py_compile、补丁与 PR diff 逐字比对、用未安装的 ruamel.yaml wheel 直接加载验证 ScannerError 为 YAMLError 子类且基线与补丁行为差异符合预期）。taskDone=false：真实 CLI 复现、pytest、ruff 均未运行，环境缺 ruamel.yaml、cryptography、keyring、parsedatetime、pyxdg、tzlocal 及 poetry/pytest/pytest-bdd/pytest-xdist/tox/ruff/black/poe，无 .venv，任务禁止安装依赖，故未留下原失败/候选通过的运行证据。pageStuck：1) 页面只写用项目原测试命令，未写运行前置；2) 页面只给 Rust/Cargo、Node 依赖定位配方，缺 Python/pip/poetry 等价入口；3) 输入未附页面解析提交 SHA，@main 无法固定版本（正文指纹 15191 字符/24162 字节/SHA-256 e3cb8f3a… 与参考副本逐字节一致，正文完整）。openIssues：嵌套键用例只测 make_yaml_valid_dict 中间层，未走 apply_overrides 实际 config 树；吞掉全部 YAMLError 的口径变化（坏结构化值由解析期报错变为静默字符串）未评估；恢复条件漏 pytest-bdd 与 pytest-xdist；补丁注释“% starts a YAML directive”表述不准确。
- 产物：[6b57614](https://github.com/dbvv1/jrnl/commit/6b57614aa0cbcb6a52800717d0df22566de7cdf1)，分支 `relay/a-skills-plugins-reader-20261103`。
- 检查：check_public（文件与新提交身份） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人需在可运行 jrnl 环境跑真实 CLI 复现与 pytest/ruff 验收，评估 YAMLError 影响面并补嵌套键端到端用例、修正注释，再决定是否接回并推进 PR #2110；reader-test 不自动重读。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 负责人独立接收补充（2026-11-03）
- 02:23:35–38 UTC，在隔离云端用既有 Python 3.12.14／jrnl 运行时对 90de4948 与 6b57614a 各跑同一 10 个真实 CLI 输入。三种 strftime（含合法嵌套 timeformat）从基线 exit 1 变候选 exit 0、输出两条预期记录；布尔、数值、mapping、嵌套颜色与基线相同，20 次配置／journal 均逐字保留。坏 mapping 的差异如上，不夸大为受支持输入回归。两次此前探针错误保留、不计通过；未安装依赖，pytest／ruff／black 和完整项目门槛仍未跑。这是负责人消费者补验，不是原读者成功或本机实跑。
- 缺依赖属于环境／任务前置，项目指令已有相关要求；Python 配方只是非阻断可用性建议，不新增页面必修或任务。缺实际解析 SHA 属输入回执；公开页面现有 24162 字节、SHA256 `e3cb8f3a7d81e54a49614d7713ab084ce2a2cfeab31d200301d1ffac2139c353` 与回传报告相符，只能锚定同内容，不能回填派发时提交。wheel 是否原有缓存缺公开原始证据，不以未用 pip 判合规，也不据摘要判越界；不为补证探查私人材料。
- 非作者核源码与原输出后认为上述定点测试／说明仍需修；合法配置的功能已得到有限补验，不 accepted 整卡。旧 Skills 页写者退出未知，本轮不改页或升级 🟡，不重复已完成实验／广扫，不新增投稿。
