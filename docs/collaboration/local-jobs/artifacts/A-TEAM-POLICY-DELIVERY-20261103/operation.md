# A-TEAM-POLICY-DELIVERY-20261103 · 托管策略未生效时的交付状态分流

> 核对日：2026-11-03（UTC+8）。只读官方公开文档、公开 issue 与固定仓内文件；未运行客户端、未改任何真实配置。本稿供 `docs/18-team-adoption.md` §4 采用，不改变原页评级（🟡）与已接收的权限／沙箱结论。

## 一、可供 §4 采用的短操作稿

**先确认版本、入口和凭据所属组织；再在能运行它的交互机上看 `claude doctor` 的 `Managed settings (remote)` 行和 `/status` 的 `Setting sources` 行，按“未配置／加载成功／fetch 失败（缓存是否仍生效以 doctor 说明为准）／fetch 被跳过”分流；不要先改个人设置，也不要把配置文件存在、脚本自测通过当成已生效。** 托管行需 Claude Code v2.1.248+，`/status` 的 `Skipped sources` 行需 v2.1.242+；低于门槛先由管理员升级，不能把“看不到该行”当成“没有策略”。`claude doctor` 在 CI 的可用性未知，CI 内改用 `claude --debug-file` 查 `Remote settings`。普通成员只做只读核对并把结果交给管理员；修改托管策略、切换认证方式或部署端点文件都需要有权限的管理员。

看完本节应能回答：CI 没收到组织策略先查什么；首次离线与缓存启动各能证明什么；Hook 脚本自测通过但不触发先查哪一层。

**适用前提**：经 claude.ai 的服务端托管要求能直连 `api.anthropic.com`；网关客户端从网关抓取，第三方模型入口另有交付方式（见第 1 步）。

### 第 1 步：确认版本、入口和凭据所属组织

先确认四个事实。缺任一项，都可能把入口差异误判成策略失效：

| 要确认 | 怎么确认 | 会改变动作的分支 |
|---|---|---|
| 客户端版本 | `claude --version` | 低于 v2.1.248：`claude doctor` 不显示托管行，先升级再判断 |
| 运行入口 | 终端、IDE 扩展、桌面 Code 标签、Agent SDK、云会话、Cowork | Anthropic 托管的云会话不读本机 MDM／配置文件，只能靠服务端托管；Cowork 不抓 claude.ai 管理控制台的服务端策略，但在用户机器上仍读设备 MDM／文件，在完整 VM 或远端 VM 里没有设备策略；自托管环境的 runner 镜像默认只在服务端未交付策略键时读其中的 managed settings 文件 |
| 凭据及其组织 | 看启动方式与 CI 注入的变量名，只确认类型，不读取或输出凭据值 | Team／Enterprise OAuth、`CLAUDE_CODE_OAUTH_TOKEN`、直接配置的 API key 会触发抓取；`user_oauth` profile 也触发抓取，但需 v2.1.257+ 且 `base_url` 指向 Anthropic API；`apiKeyHelper` 返回的 key 与 Workload Identity Federation 凭据不触发 |
| 模型提供方 | 是否导出 `CLAUDE_CODE_USE_BEDROCK`、`CLAUDE_CODE_USE_MANTLE`、`CLAUDE_CODE_USE_VERTEX`、`CLAUDE_CODE_USE_FOUNDRY`、`CLAUDE_CODE_USE_ANTHROPIC_AWS`，或非默认 `ANTHROPIC_BASE_URL` | 命中任一项：服务端抓取被跳过。Bedrock／Vertex／Foundry／AWS 部署可用自托管 Claude apps gateway 提供同等远程交付，或用端点托管文件；自定义 `ANTHROPIC_BASE_URL` 则要移除导出或改用端点托管 |

**CI 没收到组织策略时，先查凭据，不先查策略内容。** claude.ai 管理控制台配置的策略只发给持有该 claude.ai 组织凭据的会话；换了登录组织就换一份策略。Claude Console 创建的 API key 属于另一个 Console 组织，不会继承这些策略。CI 的可行分支只有两条：把 `claude setup-token` 生成的 token 授权给 Team／Enterprise 组织并设为 `CLAUDE_CODE_OAUTH_TOKEN`（同时移除优先级更高的 `ANTHROPIC_API_KEY` 等，且 `--bare` 不读该 token），或给运行作业的机器部署端点托管文件。`apiKeyHelper` 返回的 key 同样不触发抓取。

**shell 导出的第三方变量或自定义地址无法用服务端 `env` 块清除**：服务端块要靠被它跳过的抓取才能到达。端点托管的 `env` 块也不会恢复抓取，因为资格检查在应用托管 `env` 之前。恢复办法是移除 shell 导出，或在用户设置 `env` 里把变量设为 `""`（在资格检查前生效），或改用端点托管策略。这一步需要管理员决定，普通成员不要自行改地址来“试试看”。

**需要管理员**：确认组织归属，决定用 OAuth token 还是端点托管。普通成员不靠改个人 `settings.json`、`env` 或 `ANTHROPIC_BASE_URL` 绕过托管策略。

### 第 2 步：用官方诊断看交付／加载状态

在有问题的机器上运行 `claude doctor`，读 `Managed settings (remote)` 行。它只报四种结果：

| `claude doctor` 结果 | 说明 | 下一步 |
|---|---|---|
| 交付的设置已加载 | 策略已抓取并加载 | 进入第 3 步查来源、优先级和 Hook 注册 |
| 组织没有配置服务端托管设置 | 服务端没有可交付内容 | 查 `/status` 的 `Setting sources`：端点托管文件或 MDM 仍可能生效 |
| fetch 失败，附原因，并说明缓存策略是否仍生效 | 网络、认证、证书或代理问题；缓存可能仍在执行 | 先看 `/status` 当前来源。缓存仍生效只能说明上次策略还在，不能说明新策略已送达；无缓存时本次不带服务端策略继续（交互会话警告），端点托管仍生效，设置了 `forceRemoteSettingsRefresh` 则退出 |
| 跳过 fetch，附原因 | 第三方提供方变量或自定义 `ANTHROPIC_BASE_URL` 等 | 回到第 1 步的提供方分支；本次会话未抓取服务端策略，是否仍有上次缓存按第 3 步另行确认（该结果不说明机器此前是否成功抓取过） |

抓取仍在进行时该行会显示进行中，不要在这个窗口下结论。

在交互会话里再看 `/status`：

- `Setting sources` 行出现 `Enterprise managed settings` 时，括号里是实际选中的来源：`remote`（claude.ai 或 gateway）、`plist`／`HKLM`、`file`／`drop-ins`／`file + drop-ins`、以 `, merged` 结尾的组合、`HKCU`、`parent process`、`helper`。
- 该行缺失：没有任何托管来源交付策略键。部署了文件时，先查路径、格式和是否只剩控制键。
- 该行点名了别的来源：你部署的来源被更高优先级来源覆盖。
- `Skipped sources` 行（v2.1.242+）列出“机器上存在但未被选中”的来源；这一行是区分“策略没到机器”和“策略到了但被更高优先级来源覆盖”的关键。
- `/status` 在抓取失败和部分跳过原因下也显示 `Managed settings (remote)` 行，例如 shell 导出的第三方提供方变量或自定义 `ANTHROPIC_BASE_URL`。

需要交付失败细节时，用 `claude --debug-file <本地路径>`，在日志里搜 `Remote settings`。需要 Hook 细节时，用 `/hooks` 看注册与来源，用 `claude --debug` 或 `--debug-file` 看注册与跳过原因。日志可能含组织、路径或命令，只在本地核看，按最小必要脱敏后再分享；不要索要或收集他人的原始输出。

**需要管理员**：只有结果指向服务端配置或端点策略本身时才进入第 4 步；普通成员不修改。

### 第 3 步：按状态和设置源定位

**先选交付方式**：没有 MDM、设备未受管的组织用服务端托管；已有 MDM／端点管理的用端点托管。端点托管到不了 Anthropic 托管的云会话，所以同时跑云会话的组织还要配服务端托管。

**来源选择（默认 first-wins）**：远端服务端设置优先，其次 MDM／HKLM，再次 `managed-settings.json` 与 `managed-settings.d/`，最后是用户可写的 HKCU（仅在没有更高层管理员文档、且宿主父设置没有提供限制性键时使用）。默认只采用“交付了至少一个策略键”的最高来源，其余来源整份忽略；`/status` 的 `Skipped sources` 会点名被忽略者。少数跨来源键（沙箱锁、`forceRemoteSettingsRefresh`、`env` 的逐变量合并等）例外。

需要合并多个管理员来源时，在最高来源设 `managedSourcesBehavior: "merge"`（v2.1.242+）；只有确认其下每一层都由管理员控制才开启，否则低层列表会被并入策略。该键只从最高来源读取，从未收到服务端设置的机器要在 MDM／文件里也设它。登录键（`forceLoginOrgUUID`、`forceLoginMethod` 的 `claudeai`／`console`）与远端不同：有 MDM 或文件时从那里取，MDM 设了策略键时优先于文件（MDM 没设策略键时用文件）。

**不能把文件存在当成生效**：

- 文件只含 `wslInheritsWindowsSettings`、`managedSourcesBehavior` 等控制键，不算交付策略键，来源会继续往下找。
- 只要设置了任一非 `null` 策略键（即使值不可读），或管理员文件存在但不可读，就算“文档存在”，用户可写的 HKCU 不会顶上来。
- 路径必须是当前 OS 的系统目录；Windows 旧路径 `C:\ProgramData\ClaudeCode\managed-settings.json` 不读。
- 文件不是合法 JSON 或顶层不是对象时，Claude Code 拒绝启动并报来源，不会静默忽略。
- 文件存在但不可读时，OS 拒绝读取与 I/O 错误的处理不同：前者会话可无该策略启动并记录失败，后者可能启动即退出。
- 配置了 `policyHelper` 且它输出 `managedSettings` 时，该输出替换所选来源，成为本次运行的唯一托管配置（`forceRemoteSettingsRefresh` 另有启动规则）。
- 服务端设置即使已写入本地缓存，也只代表“上一次成功抓取的策略”，不代表当前服务端版本已生效。

**缓存与刷新各保证什么**：

- 首次启动、无缓存：在启动时登录（首次运行或 `/logout` 后）最多等 5 秒；按时到达则从首屏起执行并显示 `companyAnnouncements`，但负载需要安全批准时会结束等待、批准后才应用。其他启动或 5 秒超时则在抓取继续时先开会话，存在短暂未生效窗口。抓取失败则不带服务端策略继续（交互会话会警告），端点托管仍生效；设置了 `forceRemoteSettingsRefresh` 则退出。
- 后续启动、有缓存：缓存立即生效，但 `modelPricing`、`managedMcpServers`、缓存 `env` 中被扣留的变量，以及插件守卫相关项要等本次抓取确认。抓取失败时缓存继续生效并警告；缓存跨网络故障保留。服务端配置被清除后，缓存仍可能留到下一次成功抓取，`model` 等下次启动键留到重启。手工改动缓存也会在启动时生效，下一次成功抓取会覆盖（`model` 等下次启动键除外），所以缓存内容不能当作当前策略的证明。
- 会话中：启动抓取后按小时轮询；MDM 策略每 30 分钟检查一次，文件在变更时重载。多数更新无需重启；OpenTelemetry exporter 配置、`model` 键、从 `env` 删除变量等要下次启动才生效；`forceRemoteSettingsRefresh`、`requiredMinimumVersion` 也在下次会话启动生效。需要安全批准的设置要等交互会话里的批准对话框。网关客户端启动时一律等待抓取，抓取失败通常直接退出（`claude auth` 子命令等例外）；小时后台刷新在两个通道都是 fail-open。
- 因此“首次离线启动能用”只能证明无缓存时的降级路径或端点策略仍在，不能证明服务端策略已送达；“缓存启动仍有限制”只能证明上次成功抓取的策略还在，不能证明当前策略已更新。

**无效条目**：部分负载校验失败时，Claude Code 丢弃无效条目并保留其余有效设置；部分键按更严格值兜底与逐字段修复均需 v2.1.282+（条目级丢弃仍为 v2.1.169+）。全部条目都无效、没有任何键能兜底、且负载还含 `cleanupPeriodDays`／`desktopSessionCleanupPeriodDays` 以外的键时，什么都不应用，错误写作 `no setting in the server response could be applied as written`；启用 fail-closed 的客户端会直接退出。用 `claude doctor`、`-p` 的 stderr 或启动对话框看被丢弃的条目。

**Hook 层单独查**：Hook 脚本自测通过只证明脚本逻辑。先运行 `/hooks` 确认目标事件下确实注册、来源正确；菜单若显示 `Only hooks from managed settings run here`，说明组织设置了 `allowManagedHooksOnly`，用户／项目／本地 Hook 不会运行也不会列出（托管 `enabledPlugins` 强制启用的插件 Hook 例外）。再核对 matcher 大小写与事件类型（`PreToolUse` 在工具执行前，`PostToolUse` 在执行后且不能撤销动作），最后在获准测试环境用一次真实工具调用看效果。托管 Hook 还可能卡在安全批准对话框：交互会话拒绝则退出；无法显示对话框的交互会话不应用新策略而保留上次批准；非交互运行只在本次运行应用且不写入缓存。

把 `Setting sources` 的选中来源、`Skipped sources` 名单、缓存或抓取结果记下来；来源不对或策略内容不对，交管理员在第 4 步修正。普通成员不通过改个人文件改变这些结果。

### 第 4 步：管理员修正后，在获准环境验证目标行为

- 只有 Owner／Primary Owner 能在 claude.ai 管理控制台改服务端托管设置；MDM／文件改动由端点管理员做。
- 按第 3 步定位的原因选择修正：补策略键、改到正确来源、改用 OAuth token 或端点托管、修无效条目。只有确认网络能到 `api.anthropic.com` 时才启用 `forceRemoteSettingsRefresh`，否则会让所有客户端启动失败。
- 验证顺序：重启客户端让新策略抓取（或等一小时轮询）→ `claude doctor` 的托管行 → `/status` 的 `Setting sources`／`Skipped sources` → 用 `/permissions` 看生效的托管权限规则 → 对 Hook 用 `/hooks` 加一次真实工具调用（在一次性测试项目，不使用真实数据）。
- `forceRemoteSettingsRefresh` 开启后，确认启动会等待新抓取并在失败时退出，同时确认 `claude auth login` 等认证子命令仍可用。该键可由服务端或端点来源设置，且一旦从服务端送达会被缓存，在下次成功抓取前继续生效；它只在会抓取服务端设置的会话里阻塞，跳过了抓取的会话不会等待。只写在服务端时，它要等一次成功抓取才到达；无缓存且首次抓取失败时，首次启动不会因为该键退出，需要在端点来源也设置。
- 验证目标行为时使用验收标准（限制是否按预期拒绝／允许），不要以“命令能运行”“脚本自测返回 2”代替真实调用。

**六问速查**

| 问题 | 先看 | 结论 |
|---|---|---|
| ① loaded／未配置／fetch failed／fetch skipped／缓存 | `claude doctor` 托管行 + `/status` 来源行 | 四种结果分别走第 2 步四行；缓存仍生效只证明上次策略 |
| ② 首次启动／缓存／会话中刷新 | 第 3 步“缓存与刷新” | 首次有 5 秒等待或异步窗口；缓存可离线；会话中按小时，部分键下次启动 |
| ③ `forceRemoteSettingsRefresh` 入口／首次送达／认证例外 | 第 4 步 | 服务端或端点管理员来源都可设；无服务端负载的首次启动要靠端点来源；`claude auth` 子命令豁免 |
| ④ Console key／Team 登录／第三方入口 | 第 1 步 | 按凭据所属组织送达；Console key 不继承 claude.ai 策略；第三方提供方跳过抓取 |
| ⑤ 远端 vs 端点／文件存在≠生效 | 第 3 步 | first-wins 排序；控制键文件不算；路径错会换来源；格式错（非法 JSON／顶层非对象）会拒绝启动并报来源；`policyHelper` 输出会替换所选来源 |
| ⑥ 脚本自测通过但 Hook 不触发 | 第 3 步 Hook 段 | 先 `/hooks` 看注册与 `allowManagedHooksOnly`，再 matcher／事件／批准，最后真实调用 |

**依据**：官方 [server-managed settings](https://code.claude.com/docs/en/server-managed-settings)、[managed settings](https://code.claude.com/docs/en/managed-settings)、[hooks 参考](https://code.claude.com/docs/en/hooks)、[hooks 指南](https://code.claude.com/docs/en/hooks-guide)；反例 [issue #88896 的更正评论](https://github.com/anthropics/claude-code/issues/88896#issuecomment-5559553796)。均于 2026-11-03 读取；逐条对应见第三节。

## 二、原页缺口

`docs/18-team-adoption.md` §4 当前的“托管下发不等于安全边界（2026-10-15，UTC+8 核对）”只说明：按实际认证的 Team／Enterprise 组织分发、Console API key 的 CI 不继承、强制约束要落实到受管端点与沙箱、服务端分发是客户端控制且第三方入口另核。它没有回答读者落到具体机器时怎么判断，缺口是：

1. 没有交付状态分流：`claude doctor` 的 `Managed settings (remote)` 四种结果、`/status` 的 `Setting sources`／`Skipped sources` 行及缺失含义。
2. 没有首次启动／缓存启动／会话中刷新各自能证明什么，容易把“缓存策略仍生效”当成“新策略已送达”。
3. 没有 `forceRemoteSettingsRefresh` 的来源、首次送达前提、`claude auth` 子命令例外和网络前提。
4. 没有 Console key、Team／Enterprise 登录、`apiKeyHelper`／Workload Identity Federation、第三方／自定义入口的凭据归属分流；CI 场景只有一句“不继承”。
5. 没有远端与端点来源的优先级、控制键文件不算来源、文件路径／解析失败／`policyHelper` 替换等“文件存在≠生效”的边界。
6. 没有 Hook 的注册层与批准层：脚本自测通过、`allowManagedHooksOnly` 只定义 `PostToolUse`、批准对话框未通过时都可能导致“脚本正确但不触发”。

**建议落点**：在上述托管段落之后补一节“策略没生效时怎么分流”，采用本稿四步；只加入会改变动作的命令与键，不复制官方整页。**不改原页评级**：18 页仍是 🟡；本稿通过审查只表示有界来源和操作说明可接收，不表示团队推广通过。

## 三、关键主张与来源（核实表）

| # | 本稿主张 | 直接来源（页面／节） | 类型 | 读取日 | 版本／范围 |
|---|---|---|---|---|---|
| 1 | `claude doctor` 的 `Managed settings (remote)` 行报四种结果；`/status` 在抓取失败和部分跳过原因下显示同一行 | [server-managed settings · Verify settings delivery](https://code.claude.com/docs/en/server-managed-settings#verify-settings-delivery) | 一手：官方文档 | 2026-11-03 | 托管行 v2.1.248+ |
| 2 | `/status` 的 `Setting sources` 标签、`Skipped sources` 行、缺失或点名他源的含义 | [managed settings · Read the source in /status](https://code.claude.com/docs/en/managed-settings) | 一手：官方文档 | 2026-11-03 | `Skipped sources` v2.1.242+ |
| 3 | 首次启动最多等 5 秒；需要批准时结束等待、批准后应用；其他启动或超时先开会话；抓取失败不带服务端策略继续并警告；fail-closed 则退出 | [server-managed settings · Fetch and caching behavior](https://code.claude.com/docs/en/server-managed-settings#fetch-and-caching-behavior) | 一手：官方文档 | 2026-11-03 | 服务端托管、直连 api.anthropic.com |
| 4 | 缓存启动立即生效的例外、缓存路径与跨故障保留、`env` 变量扣留类别；服务端配置清除后缓存仍留到下次成功抓取；手工改缓存会在启动时生效、下次成功抓取覆盖（下次启动键除外） | 同上；[server-managed settings · Invalid entries in delivered settings](https://code.claude.com/docs/en/server-managed-settings#invalid-entries-in-delivered-settings)；[server-managed settings · Security considerations](https://code.claude.com/docs/en/server-managed-settings#security-considerations)；[server-managed settings · Settings precedence](https://code.claude.com/docs/en/server-managed-settings#settings-precedence) | 一手：官方文档 | 2026-11-03 | 缓存路径 `~/.claude/remote-settings.json` |
| 5 | 会话中按小时轮询；部分键下次启动生效；需批准的设置等对话框 | 同上；[managed settings · Where and when a policy applies](https://code.claude.com/docs/en/managed-settings) | 一手：官方文档 | 2026-11-03 | 多数更新无需重启 |
| 6 | `forceRemoteSettingsRefresh` 可在服务端或端点来源设置、对优先级是例外、会自我缓存、失败退出、`claude auth` 子命令豁免、需网络可达；网关客户端启动时一律等待 | [server-managed settings · Enforce fail-closed startup](https://code.claude.com/docs/en/server-managed-settings#enforce-fail-closed-startup)；[server-managed settings · Platform availability](https://code.claude.com/docs/en/server-managed-settings#platform-availability) | 一手：官方文档 | 2026-11-03 | 网关启动一律等待与失败退出见 Enforce fail-closed startup；小时后台刷新在两个通道均 fail-open 见 Platform availability |
| 7 | 合格凭据四类；Console org 与 claude.ai org 分离；`user_oauth` profile 触发抓取且 `base_url` 须指向 Anthropic API；`apiKeyHelper`／WIF 不触发；第三方提供方跳过抓取；shell 导出无法用服务端 env 清除、端点 env 也不恢复抓取，需移除导出或用户设置置空；网关替代 | [server-managed settings · Platform availability](https://code.claude.com/docs/en/server-managed-settings#platform-availability) | 一手：官方文档 | 2026-11-03 | `user_oauth` 抓取 v2.1.257+；`--bare` 不读 `CLAUDE_CODE_OAUTH_TOKEN` |
| 8 | 来源排序、默认 first-wins、管理员文档的“存在”定义、跨来源键、`merge` 的前提；`merge` 键只从最高来源读，未收到服务端设置的机器要在 MDM／文件里也设 | [managed settings · How Claude Code combines managed sources](https://code.claude.com/docs/en/managed-settings#how-claude-code-combines-managed-sources) | 一手：官方文档 | 2026-11-03 | `merge` v2.1.242+；`env` 逐变量合并 v2.1.223+ |
| 9 | 登录键从 MDM／文件取，优先于远端 | [managed settings · Which managed source supplies login keys](https://code.claude.com/docs/en/managed-settings) | 一手：官方文档 | 2026-11-03 | 双处设置建议 v2.1.299+ 前 |
| 10 | 控制键文件不算来源、系统路径与旧 Windows 路径、JSON 解析失败拒绝启动、不可读的两种处理、`policyHelper` 替换来源；文档存在定义与 HKCU 不顶替 | [managed settings · Deploy a managed settings file / Find entries Claude Code dropped / Compute the policy with a helper program](https://code.claude.com/docs/en/managed-settings) | 一手：官方文档 | 2026-11-03 | Windows 旧路径不读 |
| 11 | 无效条目逐条丢弃并保留有效设置；满足官方三项条件（全无效、无可兜底、含保留键以外的键）时错误为 `no setting in the server response could be applied as written`；fail-closed 键按严格值兜底 | [server-managed settings · Invalid entries in delivered settings](https://code.claude.com/docs/en/server-managed-settings#invalid-entries-in-delivered-settings)；[managed settings · Keys that fail closed](https://code.claude.com/docs/en/managed-settings) | 一手：官方文档 | 2026-11-03 | 条目级处理 v2.1.169+；fail-closed 严格值兜底与逐字段修复 v2.1.282+ |
| 12 | Hook 跨设置层合并；`disableAllHooks` 不能在托管层外关掉托管 Hook；`allowManagedHooksOnly` 阻断用户／项目／本地／插件 Hook，菜单显示 `Only hooks from managed settings run here` | [hooks · Configure hook location / Managed policy restrictions](https://code.claude.com/docs/en/hooks)；[hooks 指南 · `/hooks` shows no hooks configured](https://code.claude.com/docs/en/hooks-guide) | 一手：官方文档 | 2026-11-03 | 托管强制启用的插件 Hook 例外 |
| 13 | `/hooks` 列出注册与来源；matcher 需精确且区分大小写；`PreToolUse` 在工具前、`PostToolUse` 在工具后且不能撤销；调试日志可查 `Hook output does not start with {` 等 | [hooks 指南 · Hook not firing / Check what a hook did](https://code.claude.com/docs/en/hooks-guide) | 一手：官方文档 | 2026-11-03 | `claude --debug-file` 或会话内 `/debug` |
| 14 | 托管 Hook 的批准对话框：拒绝则退出；无法显示对话框时保留上次批准；非交互运行仅本次应用且不写缓存 | [server-managed settings · Security approval dialogs](https://code.claude.com/docs/en/server-managed-settings#security-approval-dialogs) | 一手：官方文档 | 2026-11-03 | 交互与非交互行为不同 |
| 15 | 作者撤回 Windows `PreToolUse` 缺陷判断及两项测量；原因为组织策略 `allowManagedHooksOnly` 加仅 `PostToolUse` 定义；决定性新 debug 对照未做 | [issue #88896 · comment 5559553796](https://github.com/anthropics/claude-code/issues/88896#issuecomment-5559553796) | 社区：作者自述／更正 | 2026-11-03 | 作者单机报告；非本仓复现 |

**来源类型说明**：第 1–14 项是官方滚动文档的契约，说明能力与默认行为，不等于某台机器当前的实际配置；第 15 项是公开 issue 里的作者自述与更正，不是受控实验或本仓实测。读取时抓取到的官方页面未显示最后更新日期，本表只记实际读取日，不把读取日当政策生效日。文档中的版本门槛随发布变化，具体以运行时 `claude --version` 为准。

## 四、真实反例：撤回与未知

**撤回**：作者 hnoerenberg 于 2026-09-06 在 issue #88896 的更正评论中撤回“Windows `PreToolUse` 是缺陷”的判断，并撤回两项支撑测量：一是“86 次其他类型 Hook 平均 12.3 ms、这些确实执行”的读数；二是“`SessionStart`／`Stop`／`SessionEnd`／`SubagentStop` 未受影响”的说法，作者承认这一条从未测量。复测显示两类计时计数相同（作者自报），不能据此区分 Hook 类型。

**作者给出的原因**：该机器的企业策略缓存设置了 `allowManagedHooksOnly = True`，托管策略只定义了一个 `PostToolUse` Hook（对 Bash 的 npm audit），没有托管 `PreToolUse` Hook；因此其项目配置的 Hook 从未注册。作者说既有 debug 日志里已有“注册 0 个 Hook”和“`allowManagedHooksOnly` 跳过插件 Hook”的提示，但当时没有查看。

**仍未证明**：

- 决定性的新一轮 `claude --debug` 对照——用新会话 grep 自己的 Hook 脚本——作者明确说尚未做；因此“该标志也压制 `.claude/settings.json` 中的 Hook”主要是从“registry 为 0”和计时推断，不是受控因果证明。
- 作者说 debug 行点名的是插件 Hook，不能直接外推到所有设置来源。
- 另一个 issue（项目级 Hook 未注册）可能是独立缺陷，作者明确要求不要用自己的证据合并。
- 观测性缺口（会话启动无提示、`PreToolUse` 计数仍增长、只有 debug 可见）是作者事后判断；官方当前 `/hooks` 菜单在命中该策略时会显示 `Only hooks from managed settings run here`，但作者当时是否看到、其版本是否支持，未记录。
- 本仓没有复现该反例，没有读取其日志或私人路径，也没有运行其删分支探针；不能把作者自报当成客户端实测或受控实验。

**对操作的直接影响**：策略定义（托管策略里有什么）、Hook 注册（是否进入 registry）、实际执行（工具调用时是否真的运行）必须分开核查；脚本自测只能证明脚本逻辑，不能证明注册或调用。

## 五、未部署范围与检查

**只读范围**：官方 server-managed settings、managed settings、hooks 参考与 hooks 指南；公开 issue #88896 及其更正评论；固定仓内 README 读者地图、`docs/18-team-adoption.md` §4、`docs/research/2026-10-13-cloud-spend-boundaries.md` 的策略交付段、`docs/decisions/permissions-and-hooks.md`、已接收的 `A-PERMISSION-BOUNDARY-FACTS-20261102` 卡。没有复制整页官方文档或原始 issue 日志。

**仍未回答的边界**：`claude doctor` 在纯 CI／非交互环境中的可用性，官方页面没有单独说明，不能推断 CI 一定有交互式诊断（CI 内的替代做法见第 1 节）。Console 组织能否自行配置服务端托管设置，官方页未说明；本稿只确认它不继承 claude.ai 组织的策略。某个具体组织是否部署了 Claude apps gateway，也未知，只能由管理员核实。

**未做**：没有启动客户端，没有运行 `claude --version`／`claude doctor`／`/status`／`/hooks`／`--debug`，没有读取或修改任何本机权限文件、配置、凭据或私人日志，没有登录或切换组织，没有调用模型，没有执行 Hook，没有调整网络／权限／组织设置，没有联系第三方，也没有做任何部署或团队实测。

**检查**：`python3 scripts/check_repo.py` 通过（734 个文件，0 错误）；`python3 scripts/check_public.py` 通过（1199 个已跟踪文件，0 命中）；`python3 scripts/check_public.py --commits origin/main..HEAD` 无提交身份命中；`git diff --check` 通过，新增文件另用 `git diff --no-index --check` 核对无空白错误；新增文件单独按公开扫描规则复扫 0 命中，UTF-8、LF、168 行。本次未创建提交；当前 HEAD 是仓库允许的 noreply 身份，本机 `git config` 的 `user.email` 不是该身份，接收端提交时必须覆盖，不能用本机配置直接提交。

**边界**：官方契约不等于当前环境配置或授权；本稿通过审查只表示有界来源与操作说明可接收，不表示团队推广通过、README 地图的 🟡 可以升级，也不改变已接收的权限／沙箱结论。来源不可读或官方未承诺的分支保持未知，不补成结论。
