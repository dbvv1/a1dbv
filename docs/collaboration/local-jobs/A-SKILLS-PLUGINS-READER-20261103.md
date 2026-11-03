# A-SKILLS-PLUGINS-READER-20261103 · 按能力缺口完成配置小修
id: A-SKILLS-PLUGINS-READER-20261103
owner: dot-A
status: review_ready
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 90de4948d79a4fca8c7238dd2487b599f458c903
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

## 当前结果

- 已按 reader-test 完成一轮：把公开 PR #2110 的补丁应用到 jrnl/config.py（make_yaml_valid_dict 捕获 YAMLError 回退字面字符串），并补 tests/unit/test_parse_args.py 回归（%d、%Y-%m-%d %H:%M、colors.body、结构化 mapping），另写 reader-tests 卡点报告；函数层/静态核对通过（git diff --check、py_compile、补丁与 PR diff 逐字比对、用未安装的 ruamel.yaml wheel 直接加载验证 ScannerError 为 YAMLError 子类且基线与补丁行为差异符合预期）。taskDone=false：真实 CLI 复现、pytest、ruff 均未运行，环境缺 ruamel.yaml、cryptography、keyring、parsedatetime、pyxdg、tzlocal 及 poetry/pytest/pytest-bdd/pytest-xdist/tox/ruff/black/poe，无 .venv，任务禁止安装依赖，故未留下原失败/候选通过的运行证据。pageStuck：1) 页面只写用项目原测试命令，未写运行前置；2) 页面只给 Rust/Cargo、Node 依赖定位配方，缺 Python/pip/poetry 等价入口；3) 输入未附页面解析提交 SHA，@main 无法固定版本（正文指纹 15191 字符/24162 字节/SHA-256 e3cb8f3a… 与参考副本逐字节一致，正文完整）。openIssues：嵌套键用例只测 make_yaml_valid_dict 中间层，未走 apply_overrides 实际 config 树；吞掉全部 YAMLError 的口径变化（坏结构化值由解析期报错变为静默字符串）未评估；恢复条件漏 pytest-bdd 与 pytest-xdist；补丁注释“% starts a YAML directive”表述不准确。
- 产物：[6b57614](https://github.com/dbvv1/jrnl/commit/6b57614aa0cbcb6a52800717d0df22566de7cdf1)，分支 `relay/a-skills-plugins-reader-20261103`。
- 检查：check_public（文件与新提交身份） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人需在可运行 jrnl 环境跑真实 CLI 复现与 pytest/ruff 验收，评估 YAMLError 影响面并补嵌套键端到端用例、修正注释，再决定是否接回并推进 PR #2110；reader-test 不自动重读。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
