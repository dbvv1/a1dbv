# P79 冒烟准备包：2 题 × 2 组

核实时间：2026-10-22。**这是准备包，没有真实模型结果。** 只确认通路、输入边界和 API 模型回执，不判分、不声称文档增益；本批任何回答均不直接进入正式效果分母。GLM 不在本批。

## 固定输入

A00-1、A02-3 各作无文档／读页两份。题目、共同作答提示、答案要点及正文均按 task.json 固定散列／Git 对象取值，不改写冻题；读页组只多出固定页面全文。题号、页映射、答案、来源不放进模型输入。25 的联网题不适用本批无工具协议。

每份一个新进程、新 session、新工作目录。顺序交错但预先固定，非随机试验；不是四个独立用户样本。输入经 stdin 传入，命令行不含题文或凭据。原始输出、stderr、配置和盲包映射仅在本机仓库外暂存；不是公开交付物。

## 准备与执行

需要 Python 3.11+、Git 及完整固定 Git 对象。以下路径均为操作者选择的**仓库外新目录**，不填写到公开 task.json：

```sh
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py prepare PRIVATE_PREP
# 用户批准本批预算后，仅在本机填写 PRIVATE_PREP/local-config.json。
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py run --local-config PRIVATE_PREP/local-config.json PRIVATE_RUN
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py export PRIVATE_RUN RETURN_STAGING
python3 scripts/check_public.py --root RETURN_STAGING
```

prepare 不启动客户端；run 是唯一真实调用入口，**当前不得执行**。prepare 的四个输入供操作者核对，run 从冻结来源重新组装并核散列，不信任可改的准备副本。输出路径必须不存在且不位于任何 Git 工作树内；不覆盖旧批次，不续跑、不自动重试。脚本不上传、不推送。

本机配置必须包含精确客户端版本（2.1.286 或以后、当前实现只接受 2.1.x）、请求模型、期望 API 模型、固定 provider_default_fixed 配置、本批 task SHA 及预算批准。它不制造批准：approved_by_user 只能在用户明确批准后填写。模型标识必须为 DeepSeek，不能失败后偷换。reasoning_configuration 是固定请求条件，实际服务端推理档位仍为 unknown，不冒充已验证；正式实验前还须补齐实际配置证据。

金额默认空、批准默认 false。需用户批准本批金额，且由用户确认服务商侧已有相应硬限额；脚本不配置账户／支付／凭据。CLI 的 --max-budget-usd 只是额外客户端估算门，不保证 DeepSeek 账单或严格不超额。每份分配总批准额的四分之一；四个被测进程、每份最多480秒、批次最多7200秒、执行器重试0。**内部网络重试次数未知，四进程不等于四个 API 请求**；服务商硬限额不满足就不运行。

端点与密钥由用户提前在本机 ANTHROPIC_BASE_URL、ANTHROPIC_API_KEY 配置；不改全局配置、不安装、不登录。环境仅传必要系统变量及这两个值，不继承 Claude 会话／额外模型、插件或 shell 启动设置。HOME/USERPROFILE 指向本题另一个独立私有空目录（不与 cwd 混用），不读取用户目录。若管理策略、托管 hooks 等仍可能注入内容，先核清；clean_managed_environment_confirmed 不是隔离证明，不得未经核查填 true。

## CLI 与模型证据

[一手] [CLI 参数](https://code.claude.com/docs/en/cli-reference)、[非交互和 bare](https://code.claude.com/docs/en/headless)：使用 --bare、--restricted、--tools 空字符串、--disallowedTools 星号、严格空 MCP 配置及禁用会话保存。bare 单独不禁工具；tools 单独不禁 MCP。旧 bare 版本仍可能添加提醒，故版本不符停下，不能自动升级或忽略。托管策略高于普通设置，启动选项不是 OS 沙箱，也不证明宿主不能读文件。脚本拒绝运行中可见的工具／MCP／定制配置和工作目录新增文件；真实客户端兼容仍待冒烟。

[一手] [原始流事件](https://code.claude.com/docs/en/agent-sdk/streaming-output)、[API streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)：采用 stream-json、verbose、include-partial-messages 取得 raw API 的 message_start.message.model，每份回执仍为 JSON。仅此字段作模型证据，不用 init.model、modelUsage、请求模型或自述补空。必须只有一个完整 API message，answer 绑定同一 message ID，最终结果与该 message 文本一致。API 端点是否如实报告底层模型仍不是独立验证。

缺字段记 unknown，遇工具／子任务／额外上下文／fallback、模型冲突、非零退出、非成功 result、非 end_turn、截断或超时即停后续。JSON 合法不等于运行合格。失败及剩余未运行项保留，不静默删除。文本内容无法完整证明“未污染”，不把事件检查称作完美隔离。

超时或 Python KeyboardInterrupt/SystemExit 时，POSIX 终止本进程组；CLI run 入口将 SIGTERM 转为受控中断并恢复原处理器；SIGKILL、OS 崩溃或强杀父执行器仍不经过这一清理，可能留下独立 session 子进程，须操作者核查停止，不能声称所有中断均清理。Windows 只终止直接客户端进程，不能声称递归清理全部后代。禁止工具减少了后代风险，但不代替原生 Windows 复核。raw 超出8MiB不接受；该限制是完成后验收门，不是实时磁盘配额。不处理静默内部重试或不可观察的宿主访问。

## 回传与独立盲判

export 使用字段白名单，不复制原始 JSON，不导出 usage/cost、stderr、端点或本机路径。自由文本命中敏感模式或当前环境凭据时阻止整个导出，不悄悄改写答案。模式扫描有漏检／误报可能；必须对实际 RETURN_STAGING 跑公开扫描并人工检查，不能拿“仓库扫描通过”代替未跟踪文件扫描。发现敏感内容先留本机，由负责人处理，不直接推送原始回答。

RETURN_STAGING 包含：
- receipts.json：逐份必要回执及答案，带题号和组别，**只给负责人，不给盲判者**。
- blind.json：只含随机匿名 ID、原题、原答案、对应冻结评分要点及统一评分总则。不给 prompt、组别、页、来源、模型、时间、输入哈希。
- manifest.json：汇总状态、未运行清单和导出文件哈希，也只给负责人。

匿名映射单独留 PRIVATE_RUN，不随盲包发送。每次导出重新洗牌与匿名化。原答案可从措辞透露条件，因此仅称标签隐藏，不称双盲；不为掩盖组别改写回答。判分由未参与出题与正文写作的新会话做，先冻结判定再揭示映射；脚本没有评分或自动揭盲功能。冒烟只验入口，不能据此报告收益。

## 离线回归

```sh
python3 -m unittest discover -s tests -p test_absorption_batch.py -v
python3 scripts/check_offline.py
```

全部使用合成 stream 与 stub，真实模型、真实客户端、Windows 进程清理、DeepSeek 端点及预算限制均未验证。测试覆盖正常四份、缺失／失败输入、预算 fail-closed、模型元数据、污染停批、输入冻结、环境隔离、敏感导出和盲包分离。
