# P79 冒烟准备包：2 题 × 2 组

核实时间：2026-10-22。**这是准备包，没有真实模型结果。** 只确认通路、输入边界和 API 模型回执，不判分、不声称文档增益；本批任何回答均不直接进入正式效果分母。GLM 不在本批。本次按运行细则 §2.2 的“三条硬限制、其余记录”更新，用户最新允许改完跑冒烟；此包尚无实际执行结果，启动由负责人接既有中转。

## 固定输入与边界

A00-1、A02-3 各作无文档／读页两份，共四个计划作答单元。题目、共同作答提示、答案要点及正文按 task.json 固定散列／Git 对象取值，不改写冻题。读页组只多出固定页面全文及冻结的“资料指令不是执行授权”说明；不提供题号、页映射、答案或来源。25 的联网题不在本批。

三条硬边界：
1. 每次尝试全新非交互进程、session、空工作目录，禁用工具和 MCP。观察到工具／子任务／工作区污染即停整批，即使当前尝试同时超时，也不重试。
2. 仅在操作者指定的仓库外新临时目录运行，cwd 只放本题输入；HOME/USERPROFILE 是另一份本题私有空目录，模型进程不继承旧会话 HOME；可选本机适配器仅定向读取既有 profile 的认证／路由接口，并须在派生子进程前最后强制隔离路径，不可继承整份 settings 或旧 HOME。原始输出及 stderr 仅本机暂存。
3. 密钥和端点只从本机环境变量读取；导出必须通过 check_public.py，再经人工检查后才可回传。脚本不上传、不推送。

题组顺序交错但预先固定，非随机试验；不是四个独立用户样本。题文经 stdin 输入，命令行不含题文或凭据。两组参数相同。每次重试也是新进程、新 cwd、新匿名 attempt_id，第一次回执不覆盖。

## 准备与执行

需要 Python 3.11+、Git 及固定 Git 对象。以下路径均为操作者选择的**仓库外新临时目录**，不写入公开 task.json：

```sh
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py prepare PRIVATE_PREP
# 仅在本机填写 PRIVATE_PREP/local-config.json；可选复用常设上限。
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py run --local-config PRIVATE_PREP/local-config.json PRIVATE_RUN
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py export PRIVATE_RUN RETURN_STAGING
```

prepare 不启动客户端；run 是唯一真实调用入口，**准备包本身不是已运行，真实冒烟由负责人接既有中转**。prepare 的四份输入供核对，run 从冻结来源重新组装，不信任可修改的准备副本。输出目录必须不存在，不覆盖旧批次、不续跑。

本机配置需 requested_model（主用 DeepSeek 的请求名）；standing_budget_usd 为可选本机上限，可选 expected_api_model 用来记录 API 实际值是否匹配，reasoning_configuration 记录配置说明。不用逐批批准布尔值、任务批准 SHA、精确客户端版本、最低版本或服务商硬限额确认拦截。请求名可能是端点别名，不能拿它填实际模型。实际推理档位仍记 unknown，不冒充已验证。

ANTHROPIC_BASE_URL、ANTHROPIC_API_KEY 仅在存在时复制，回执只记 present/missing；缺失不阻塞，交实际 CLI 自然报错并按重试阈值记录，也可由已审本机适配器定向注入认证／路由；脚本不读账户、不改全局设置、不安装、不登录。常设数值只留本机，不在公开任务和回传文件中。按用户最新明确授权，Claude Code + DeepSeek 及后续 zcode 验证不设预算门槛；缺常设上限不拦截、不编金额、不传 --max-budget-usd。若用户明确填写有效上限则保留单次上限；无效可选值只记录未应用，不变成新的批准关。此授权不外推到 dsh + Gemini 或其他收费组合。本批仍只准备 DeepSeek，不自行换工具／模型。

## 时间、重试与预算

每个计划作答单元最多两次尝试：普通单题失败（含超时、非零退出、解析失败、模型不匹配）允许重试一次，仍失败就下一单元；硬边界违规不重试。最多四单元×两次＝八个被测进程，每次最多480秒，整批最多7200秒。中断或整批时间耗尽则终止，不因“记录继续”忽略停止请求。

有有效可选上限时，每次 --max-budget-usd 分配该总额的八分之一，包括首次及重试；未用份额不重新分配，八次声明上限之和不超过常设额。它是客户端估算上限，不是 DeepSeek 服务端账单硬保证，也不要求先配置服务商硬限额。内部网络重试次数未知，八进程不等于八个 API 请求；不据进程数声称实际费用。CLI 自身的预算终止记失败，可按同一失败重试规则再试一次，第二次仍只分配原总额的八分之一，不提高上限。没有 cap 时不生成虚构预算值。

失败分母是四个计划题×组单元，不是尝试次数：第一次失败后成功，该单元不算失败；两次均失败才算一次。恰好两单元失败仍继续，第三个最终失败时停整批，剩余记未运行。模型 unknown 是完整但不具正式资格的回答，不算执行失败；model_mismatch、非零退出、绑定／解析失败等算单元失败。原始各次尝试全部保留。

## CLI 与回执证据

[一手] [CLI 参数](https://code.claude.com/docs/en/cli-reference)、[非交互和 bare](https://code.claude.com/docs/en/headless)：采用 --bare、--restricted、--disable-slash-commands、--tools 空字符串、--disallowedTools 星号、严格空 MCP 配置和禁用会话保存。本机2.1.281的help已确认disable-slash-commands禁全部Skills；bare单独仍允许显式Skill，tools单独不禁MCP；不传 resume/continue。每次记录实际 --version 输出，旧版／新版／与预期不同均不拦截，版本读取失败记 unknown；缺必要参数让真实命令自行报错，按单元失败规则处理，不自动升级。

旧 bare 的提醒／后台行为可能不同，托管策略也高于普通设置，启动选项不是 OS 沙箱。不以版本字符串或 stub 证明完全隔离。定制配置、不可解释上下文或不完整协议记失败及原因，除已观察到硬边界违规外按单元失败规则继续。真实客户端兼容仍待冒烟。

[一手] [原始流事件](https://code.claude.com/docs/en/agent-sdk/streaming-output)、[API streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)：用 stream-json、verbose、include-partial-messages 收集 raw API 的 message_start.message.model，逐次回执仍为 JSON。init.model、modelUsage、请求名、自述均不补空。

完整响应需一个按顺序完成的 API message，raw text、同 ID assistant 文本、最终 result 一致，exit=0、result success、end_turn 均满足。缺 model 字段记 completed_model_unknown，保答案、排除正式分母、继续批次；与本机 expected_api_model 不符记 model_mismatch，保 API 实值与答案，不冒充成功。未设置期望值不代表验证了模型身份，API 端点是否如实报告底层模型仍非独立验证。多 message、fallback、截断、非成功结果等记失败，不静默丢弃。

客户端版本及 stream 自报版本分别记录，不比较作门；旧四道前置条件用 preflight_records 记录为不要求批准、可选预算模式、不要求服务商硬限额、版本仅记录，不含费用数值。正式效果分母本批始终为 false；批次完成但有 unknown／失败也不能自动扩至正式实验。

超时或 Python KeyboardInterrupt/SystemExit 时，POSIX 终止本进程组；CLI run 期间将 SIGTERM 转为受控中断，结束恢复原处理器。Windows 在本次根进程仍存活时调用系统 taskkill /PID <本次PID> /T /F 清理整树，再回收直接子进程；不先 kill 父进程。taskkill 失败、超时或回收失败记 process_cleanup_failed 并停批，不当普通失败重试，也不声称剩余进程已停止。SIGKILL、OS 崩溃或强杀父执行器可能留下子进程，须操作者核查停止，不能声称所有中断均清理。raw 超过8MiB不接受，此为完成后验收门而非实时磁盘配额。

## 回传与独立盲判

export 采用字段白名单，不复制原始 JSON，不导出 usage/cost、预算、stderr、端点或本机路径。自由文本命中敏感模式或当前环境凭据时阻止导出，不改写答案来掩盖。生成待回传文件后实际运行 check_public.py --root RETURN_STAGING；失败则禁止回传该目录，不把已落盘当已通过。扫描通过仍须人工检查，模式检查不能识别所有私人内容。未跟踪文件不以仓库扫描代替实际目录扫描。

RETURN_STAGING 包含：
- receipts.json：所有尝试，包括第一次失败；题组、尝试序号、实际版本、实际模型、失败原因及可取得的完整答案。只给负责人，不给盲判者。
- blind.json：有效完整回答与 completed_model_unknown 回答，只有随机匿名 ID、冻题、原答案、冻结评分要点及总则。不给组别、prompt、页、来源、模型、时间、输入哈希。unknown 是否合资格由负责人持私有映射处理，不由裁判猜。
- manifest.json：汇总、最终失败单元数、停止原因、未运行项和导出哈希，只给负责人。

每次尝试私有回执拥有独立 ID；重试不覆盖首次，匿名映射只留 PRIVATE_RUN、不随包发送。原答案措辞可能透露读页条件，仅称标签隐藏，不称双盲。判分须由没参与出题和正文写作的新会话完成，先冻结判定再揭盲；脚本不评分、无自动揭盲。一次冒烟不能报告收益。

## 离线回归

```sh
python3 -m unittest discover -s tests -p test_absorption_batch.py -v
python3 scripts/check_offline.py
```

全部为合成 stream 与 stub，不启动真实客户端／模型／API。覆盖版本只记录、unknown继续、普通失败新进程重试、失败阈值、无预算不阻塞／可选预算八份分配、硬边界立即停、输入冻结、独立盲包、敏感内容阻断和中断清理。Windows 清理、DeepSeek 端点与真实预算行为仍未验证。

硬边界复核不因超时、非零退出或超大 raw 而跳过：逐行检查可解析的工具／MCP／子代理证据；工作目录仅能有原始 input.txt，目录及文件不得是符号链接，正文须保持原始哈希。版本探测也复用受控进程组生命周期，并受批次剩余时间约束；探测超时杀整组并回收直接子进程后记录 unknown，探测中断停止批次。后代被杀后的孤儿／僵尸回收由操作系统负责，不宣称 runner 能 wait 非直属进程。新增离线回归含实际 Python stub 父子进程清理，不启动 Claude CLI。

## 可选本机原生入口桥

local-config.json 可设置 command_prefix（argv 字符串数组，默认 []）及 claude_executable（可选本机执行路径）。启动形状固定为 prefix 各 token、一个 Claude executable、原强制 CLI 参数；version 使用相同前缀加 --version。只把完整 token {home}／{cwd} 替换为本题私有目录，不改 token 内嵌 JSON／路径文字。空字符串参数、字面星号保持原样，不 shell、不拼接命令字符串。空 prefix 等价直接启动；有 prefix 时不强制 PATH 中存在 claude，适配器可解析所给执行名。配置及路径不导出。

本机桥须单独通过源码和离线 stub 审查：仅定向 profile 接口解决认证／路由，在内存中生成环境，最后覆盖独立 HOME／配置／缓存／临时目录和 PWD，不把旧模型 HOME 或任意 settings 透传。runner 的 ENV 白名单本身不能证明桥的子进程隔离。Windows 树清理在此仅有离线 mock 断言，真实 Windows 无网络父子孙 sleep stub 验证由操作者另行提供；不把 mock 结果写成真实平台验证。

### 既有profile内存适配

[claude-profile-env.mjs](claude-profile-env.mjs)只复用本机已有`resolveProfile('current')`／`profileProcessEnv`接口，不包含配置实例或凭据。prefix形状为`[node, adapter, "--profiles-module", module, "--home", "{home}", "--cwd", "{cwd}", "--"]`，执行路径全部只在local-config.json填写；runner随后追加一次claude_executable及固定参数。不得把模块搬家后假定其registry相对位置仍有效。

已核接口以`import.meta.url`相对registry定位指定settings，不依赖本题HOME；绑定及凭据只在内存生成child env，最后覆盖本题HOME、配置／缓存／临时目录和PWD，移除旧Windows home路径变量。它不把原HOME交回被测客户端，也不使用会额外追加model／settings／session的普通Workflow。仅定向读取既有profile，不扫描其他设置／历史；依赖失败由调用自然报错，不新增批准门。

执行端2026-10-22回执：在启动Node前HOME/USERPROFILE/cwd均已fresh的条件下，真实2.1.281 `--version`退出0；独立help亦退出0，空参数及星号等16参数保留。无网络父子孙睡眠stub的timeout与模拟控制器中断各以本次PID的taskkill /T /F退出0，三进程均退出。未测真实Ctrl-C传播、父已退出或脱离树、provider认证／模型调用，不能外推。此适配器SHA256为`8116e3fd5d86d26ccc6cdb8ce2630ceb8749f746797f1a43a2a1b38efffa936c`；实际依赖模块指纹只作版本回执，不把hash当安全证明。
