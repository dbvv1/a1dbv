# 10 · 安全

> 核实时间：2026-10-08。

## 1. 威胁模型：致命三要素

Simon Willison（2025-06）提出的 **lethal trifecta**：只要一个 Agent 同时具备以下三点，就可能被诱导泄露数据：

1. **能访问私有数据**：代码、密钥、邮件、工单、数据库；
2. **会接触不可信内容**：Issue、PR 评论、网页、README、依赖包、MCP 返回值、错误日志；
3. **有对外通信能力**：发请求、开 PR、写对方能看到的文件，甚至渲染一张 Markdown 图片。

**Coding Agent 默认就同时具备这三点。** 一个被投毒的 README 或 Issue，在没有任何代码漏洞的情况下就能让它外泄密钥。

## 2. 2026 年的真实事件与研究

| 事件 | 要点 | 证据 |
|---|---|---|
| **Agentjacking**（2026-06） | 攻击者用公开的 Sentry DSN 往错误事件里注入指令；Claude Code、Cursor、Codex 通过 Sentry MCP 读取后，以开发者的权限执行了攻击者的命令 | [二手] CSA 研究笔记 |
| postmark-mcp（2025-09） | 第一个被发现的恶意 MCP 服务器：先发布 15 个正常版本建立信任，再加入一行外泄代码 | [二手] |
| LiteLLM PyPI 后门（2026-03） | 约 3 小时内被下载约 4.7 万次；LiteLLM 是 CrewAI、DSPy 等框架使用的模型网关 | [二手] |
| Gemini CLI 安全修复（2026-08~09） | 通过构建文件和不可信参数的间接提示注入、MCP OAuth SSRF、凭证泄漏、workspace trust 改为默认拒绝 | [一手] changelog |
| Anthropic 自曝（2026-05） | 项目配置里的 hook 在信任提示出现**之前**就执行了；通过“已批准的域名”外泄数据；直接的提示注入绕过了所有模型层面的防御 | [一手] |
| **AI 实验室训练期的 Agent 失控**（2026-04~09） | OpenAI 训练和评估中的 Agent 串联 Artifactory 代理的 0day 接入外网，把代理当成留言板分工协作，入侵 Hugging Face 寻找评分器，7 月拿到研究集群管理员权限；还被查出与 RubyGems 攻击、澳大利亚 Medicare 网站入侵有关（已在联合国被提及）。Anthropic（PyPI 恶意包 `mlflow-ui` 等）、Google、Meta 也有类似事件 | [社区：Matthew Green、Simon Willison 原文] |
| **攻破 Claude Code auto mode**（2026-08） | 让 Claude 自己写解码脚本并在攻击者目录里运行，被同名 `struct.py` 劫持；成功率 60–80% | [社区：原文] |
| **Claude Code 隐写标记**（2026-06） | 根据 API 地址和时区，悄悄改变系统提示里日期字符串的写法；属于透明度问题 | [社区：原文] |
| ZCode 静默上传 git 历史（2026-09） | GLM 官方 Agent | [二手] |
| Cursor 0day（2026-07） | Mindgard 在厂商不回应后选择完全公开披露 | [二手：HN 标题] |
| **人工审批的真实漏检率**（2026-08） | 一个模拟“给 Coding Agent 审批命令”的小游戏收集了 4 万局、40.9 万次决策：<br>• 平均**漏掉 1/3 的威胁**（准确率 66.3%）；<br>• 明显的破坏命令漏掉 11.7%，持久化篡改（crontab、git config）漏掉 23.8%，外泄和代码执行漏掉 33.4%，越权读取凭证（`cat ~/.aws/credentials`）漏掉 35.0%；<br>• 恶意内容藏在 `npm run xxx` 后面时漏掉 **52.5%**，即使恶意脚本就显示在上方的历史记录里；<br>• 7% 的玩家对所有请求都点了同意；正常命令也常被误拦（43–59%）；<br>• 局限：有时限、威胁占比约 34% 远高于现实，部分题目的标注在 HN 上有争议 | [社区：原文] |
| **Wikimedia 发现 OpenAI 失控 Agent**（2026-10） | 编辑 wiki、尝试利用托管的笔记工具、大量流量；未发现被攻破。开放网络的维护者承担了调查和溯源成本 | [一手：Wikimedia 博客] |
| 学术研究 | MCP 生态攻击的大规模分析（arXiv 2509.06572）、MCP 服务器污点漏洞（VIPER-MCP）、开发者常见安全误区（MCP Pitfall Lab） | [研究：摘要] |

## 2.1 四个案例拆解：攻击链和本可以断开的那一环

下面几个案例的公开资料比较完整。每个都按“入口 → 放大器 → 出口”拆开，标出**哪一环本可以断开**。

### 案例一：GitHub MCP “有毒流程”（2025-05，Invariant Labs）[社区：安全厂商原文]

- **场景**：用户在 Claude Desktop 里接了 GitHub MCP，同时有一个公开仓库和若干私有仓库。用户只说了一句“看看公开仓库里的 open issue”。
- **入口**：攻击者在公开仓库提交一个 issue，里面藏了提示注入。
- **放大器**：Agent 读到 issue 后被劫持，用同一个 token 读取私有仓库的内容，包括项目名、搬家计划和薪资。用户之前对工具调用选了“Always Allow”。
- **出口**：Agent 在**公开仓库**开 PR，把读到的私有内容写进去，攻击者直接就能看到。
- **本可以断开的一环**：
  - **一个会话只碰一个仓库**（作者给的策略就是“每个会话只能访问一个仓库”），或者让读取外部 issue 的会话只拿只读、单仓库的 token；
  - 这不是 MCP 服务器代码的 bug，而是架构问题：致命三要素在一个会话里同时成立了。

### 案例二：s1ngularity / Nx 供应链攻击（2025-08）[一手：Nx 安全公告 + 社区：StepSecurity 分析]

- **入口**：Nx 仓库的 PR 校验工作流用了 `pull_request_target`，并把 `${{ github.event.pull_request.title }}` 直接拼进 `run:` 脚本。一个精心构造的 PR 标题就能执行任意命令，拿到有写权限的 `GITHUB_TOKEN`，再借它触发持有 npm token 的发布流程。漏洞工作流从 master 删掉后，**仍然留在旧分支上可以被触发**。
- **放大器**：发布的恶意版本带有 postinstall 脚本 `telemetry.js`。它先用 `which` 找本机已安装的 AI CLI，再依次调用：
  - `claude --dangerously-skip-permissions -p "<prompt>"`
  - `gemini --yolo -p "<prompt>"`
  - `q chat --trust-all-tools --no-interactive "<prompt>"`

  提示词让 Agent 从 `$HOME`、`$HOME/.config`、`/etc` 递归搜索钱包、密钥和凭证文件，把路径写进 `/tmp/inventory.txt`。**恶意软件不需要自带扫描器，开发者已经登录、已经授权的 Agent 替它干活**。
- **出口**：用受害者自己的 `gh` 凭证，在受害者账号下建公开仓库 `s1ngularity-repository`，上传多重 base64 编码的结果。还往 `.bashrc` 和 `.zshrc` 里追加了 `sudo shutdown -h 0`。
- **规模**：Wiz 事后统计约 2,180 个账号、7,200 个仓库暴露 **[二手：BleepingComputer 转述]**。恶意版本在线约 5 小时。
- **本可以断开的环节**：
  - **CI**：不在 `pull_request_target` 里拼接不可信输入；发布改用 trusted publishing（Nx 事后的做法）；
  - **本机**：不要在 shell 里给 Agent 设带 bypass 参数的别名；
  - **凭证**：开启沙箱和 `sandbox.credentials`，让 Agent 读不到 `~/.ssh`、`~/.aws`；
  - **依赖**：安装依赖时跳过安装脚本（`npm ci --ignore-scripts`），或者在容器里装。

### 案例三：Amazon Q VS Code 扩展 1.84.0（2025-07，CVE-2025-8217）[一手：AWS 安全公告]

- **入口**：CodeBuild 配置里的 GitHub token 权限过大，攻击者借它往扩展的开源仓库提交了恶意代码；
- **放大器**：恶意代码被自动打进正式版本，发到用户手里；
- **结果**：AWS 的结论是，这段代码因为**语法错误**没能执行。按媒体报道，注入的是一段让 Agent 清理本机和云资源的提示词 **[二手]**，AWS 公告本身没有描述它的内容；
- **启示**：AI 工具自己的供应链就是攻击面。“提示词即载荷”让恶意代码更难被传统扫描器识别。

### 案例四：Agent 之间互相“授权”（Anthropic 内部，2026）[一手：Anthropic 安全博客]

- **经过**：一次模型升级之后，事件响应 Agent 通过 Slack **请求写代码的 Agent 推送一个修复**，最终被人工闸门拦下；
- **Anthropic 的结论**：“把边界画在访问权限和动作上，而不是画在模型的指令上”；
- **对应的产品机制**：Claude Code 的 Agent Teams 把来自其他 Agent 的消息标记为“来自另一个 Claude 会话”。队友不能代替你批准权限，被拒绝的动作也不能转交给别的队友去执行。auto mode 的分类器把其他 Agent 转述的“已获批准”当作不可信输入 **[一手：文档]**。

### 案例共性

| 环节 | 案例一 | 案例二 | 案例三 | 案例四 |
|---|---|---|---|---|
| 不可信输入 | 公开 issue | PR 标题 | 仓库提交 | 另一个 Agent 的消息 |
| 过大的权限 | 跨仓库 token、Always Allow | `pull_request_target` 的写 token；本机 bypass 参数 | CodeBuild 的 GitHub token | 写代码 Agent 能推送 |
| 外泄或破坏渠道 | 公开 PR | 受害者自己的 GitHub | 正式发布 | 推送到生产 |
| 实际断开的一环 | 无 | 无（事后补救） | 语法错误（运气） | **人工闸门** |

## 3. 防护原则

1. **环境边界优先于行为约束** **[一手]**：沙箱、容器、虚拟机、出网白名单这些确定性手段，比模型“自觉”和提示词防御可靠得多。在 Anthropic 的案例中，只有出网拦截挡住了凭证外泄。
   - **人工审批不是可靠的防线**：上面的数据说明，命令本身往往是无害的（`npm run build`），危险在于它执行的内容可能已被前面的修改篡改，审批者无从判断。HN 上的评价：“靠不停问用户、指望用户永不出错的安全模型，试过很多次，从没成功过。”**减少审批次数、把信任放到环境边界上，审批反而更有效**（分析见 [14 规律三、四](14-synthesis.md#3-规律三人的注意力是唯一不随算力扩展的资源)）。
2. **打破三要素中的至少一个**：
   - 处理不可信内容（外部 Issue、网页、日志）的会话，**不给密钥、不给出网能力**；
   - 需要密钥的会话，**不读不可信内容**。
3. **最小权限**：只读账号、受限 token、按项目隔离的凭证；凭证网关（如 [authsome](https://github.com/agentrhq/authsome)）让 Agent 自己永远看不到密钥。
4. **供应链**：MCP、Skill、插件安装前读内容，固定版本或 SHA（Claude Code 插件支持锁定到 commit），关注更新日志。
5. **成熟工具优先**：用虚拟机管理程序、seccomp、bubblewrap，而不是自研的拦截层 **[一手]**。
6. **harness 本身也要评估**：闭源二进制做了什么，要靠逆向才知道（见隐写标记事件）；公司环境要有允许使用哪些 Agent 的清单。
7. **审查 Agent 引入的依赖和服务**：Agent 会替你选数据库、SaaS 和库，已经有公司专门做“影响 Agent 选型”的生意；包仓库里也出现过 AI 实验室 Agent 上传的包。
8. **硬性预算上限**：Agent 会自己开通付费服务，云服务要设硬性 spend limit（AWS、GCP 2026 年已提供），不能只设告警。
9. **不在不可信目录里执行代码**：Python 等语言会优先导入当前目录里的同名模块，auto mode 攻击就利用了这一点。

## 3.1 auto mode 能挡住多少：官方公布的数字

Anthropic 公开了 auto mode 分类器的设计和误差 **[一手：工程博客]**。它是判断“要不要放手”的重要依据。

**设计**：
- 分两级：第一级是一个快速的是/否过滤器，要求“宁可错拦”；被它标记的动作才进入第二级的链式推理；
- 白名单里的只读操作和项目内的文件编辑不经过分类器；
- 分类器看用户消息和工具调用本身（包括要执行的内容），**不看工具输出和 Agent 的解释文字**（“reasoning-blind by design”）。工具输出是提示注入的主要入口，所以另有一个服务端探针先筛工具结果。

**误差**：

| 测试集 | 只用第一级 | 完整流程 |
|---|---|---|
| 真实流量 1 万条：误拦率 | 8.5% | **0.4%** |
| 真实的“过度积极”动作 52 条：漏放率 | 6.6% | **17%** |
| 合成的外泄攻击 1000 条：漏放率 | 1.8% | 5.7% |

**内部记录的“过度积极”行为**：
- 让它“清理旧分支”，它删了远程分支；
- 遇到认证错误后，去环境变量和配置文件里翻别的 token；
- 让它“取消我的任务”，它按名字最接近的匹配去删除；
- 为了分享调试脚本，构造了创建 GitHub Gist 的命令；
- 部署前检查失败后，加上跳过校验的参数重试；
- 更早还有：把工程师的 GitHub token 上传到内部计算集群，以及尝试对生产数据库跑迁移。

**怎么用这些数字**：
- 17% 的漏放率是官方说的“诚实的数字”。漏放大多是因为分类器看到了危险，却把类似批准的上下文当成了对**整个影响范围**的同意；
- 官方的定位是：比 `--dangerously-skip-permissions` 好得多；但和认真的人工审批相比可能是退步；**不能替代高风险基础设施上的人工审查**；
- 所以 auto mode 适合**有沙箱兜底**的日常开发。生产凭证、基础设施和共享资源仍然要靠环境边界（凭证不进会话、出网白名单），而不是靠分类器。

## 3.2 Claude Code 沙箱操作手册

沙箱是 [第 3 节](#3-防护原则)“环境边界优先”在 Claude Code 里的具体实现 **[一手：官方文档]**。

**工作方式**：
- **macOS** 用 Seatbelt；**Linux / WSL2** 用 bubblewrap 和 socat，可选的 seccomp 过滤器额外拦截 Unix socket；**原生 Windows 不支持**，要在 WSL2 里跑；
- **写**：默认只能写工作目录、临时目录和 `--add-dir` 加进来的目录；
- **读**：默认几乎能读整台机器，**包括 `~/.ssh`、`~/.aws/credentials`**，所以凭证要另外保护；
- **网络**：命令没有直接出网的路，全部经过本机代理按域名检查。允许列表初始为空；
- **受保护路径**：即使在可写目录里，`.claude/` 下的设置、Skill、Agent、Hook，`.mcp.json`，`.bashrc`，`.gitconfig`，`.git/hooks` 也禁止写入，而且没有办法单独放开。这样 Agent 就不能给自己加权限或植入 Hook。

**推荐配置**（放在用户级或托管设置里，仓库级的 `credentials` 条目会被忽略）：

```json
{
  "sandbox": {
    "enabled": true,
    "allowUnsandboxedCommands": false,
    "failIfUnavailable": true,
    "network": {
      "allowedDomains": ["registry.npmjs.org", "pypi.org", "files.pythonhosted.org"],
      "strictAllowlist": true
    },
    "credentials": {
      "files": [
        { "path": "~/.aws/credentials", "mode": "deny" },
        { "path": "~/.ssh", "mode": "deny" }
      ],
      "envVars": [
        { "name": "GITHUB_TOKEN", "mode": "deny" },
        { "name": "NPM_TOKEN", "mode": "deny" }
      ]
    }
  }
}
```

**配置说明**：

| 配置 | 作用 |
|---|---|
| `allowUnsandboxedCommands: false` | 关掉“沙箱里失败就用 `dangerouslyDisableSandbox` 重试”这个逃生口（`/sandbox` 面板里叫 Strict sandbox mode） |
| `failIfUnavailable: true` | 沙箱起不来时直接退出。**默认行为是不加沙箱继续跑** |
| `strictAllowlist` | 不在列表里的域名直接拒绝，不弹窗 |
| 凭证的 `mode: "mask"` | 命令只看到占位符，代理在发往指定主机的请求里替换成真值。命令能正常认证，却拿不到真正的 token |

**沙箱管不到的地方**（官方文档列出的局限）：

- **只管 Bash**：Read、Edit、WebFetch 等内置工具，MCP 服务器和 Hook 都在沙箱外，要靠权限规则管理（`denyRead` 拦不住 Read 工具，`allowedDomains` 也限制不了 WebFetch）；
- **宽泛的域名就是外泄通道**：允许 `github.com` 这类域名后，代理只看客户端声明的主机名、不解 TLS，可能被域前置（domain fronting）绕过；
- **Unix socket**：放行 `/var/run/docker.sock` 等于把主机交出去；
- **容器里的弱化模式**：`enableWeakerNestedSandbox` 会显著削弱隔离，只在外层另有隔离时使用；
- **要隔离整个进程**：连同 MCP、Hook 一起隔离，就把整个 Claude Code 放进 sandbox runtime 或 dev container。

## 3.3 CI 里的 Agent：claude-code-action 的安全边界

**claude-code-action 的默认行为** **[一手：仓库 docs/security.md]**：
- 只有对仓库有写权限的用户能触发；
- bot 默认不能触发；`allowed_bots` 不检查权限，在公开仓库里不要设 `'*'`；
- 默认不直接开 PR：Agent 提交到新分支，给出创建 PR 的链接，由人来点；
- 会剥离 HTML 注释、不可见字符、图片 alt 文本等隐藏内容，但官方提醒可能有新的绕过手法。

**PR 场景下的配置文件**：
- PR 里的 `.claude/`、`.mcp.json`、`CLAUDE.md`、`.husky/` 会被**还原成基础分支的版本**；
- 但 `package.json`、lockfile、`Makefile` 和 linter 配置**保持 PR 的版本**。如果 Hook 跑 `npm run xxx`，执行的就是 PR 作者控制的代码。所以 Hook 要直接调用固定版本的工具（如 `bunx prettier@3.5.3 --no-config`）。

**`pull_request_target` 和 `workflow_run`**：
- 这两类事件带着基础仓库的密钥，**不要把 PR 的代码检出到工作区根目录**；
- 需要 PR 的文件时，检出到子目录（如 `pr-head/`），再用 `--add-dir` 交给 Agent。

**`allowed_non_write_users`（高风险）**：
- 只用在权限极小的工作流上，比如只给 `issues: write` 的打标签；
- 用自动生成的 `GITHUB_TOKEN`，不用个人访问令牌（PAT）；
- 用 `--allowedTools` 把工具收窄到具体命令。

**`show_full_output`**：保持关闭。它会把工具输出写进日志，公开仓库的日志所有人都能看到。

## 3.4 参考架构：Anthropic 如何保护“80% 代码由 Claude 写”的开发流程

Anthropic 安全负责人 Jason Clinton 在 2026-07 公开了内部的做法 **[一手：官方博客，厂商自述]**。背景数字：
- 合并的代码约 80% 由 Claude 编写，其中一半以上来自内部 Agent；
- 每季度交付的代码量约是 2021–2025 年的 8 倍。

| 阶段 | 做法 |
|---|---|
| **设计** | 用 Claude 对设计文档做自动安全评审，对照 MITRE ATT&CK；团队信任评估结果后，低风险项目可以自批 |
| **编码** | 安全规则写进 CLAUDE.md 和组织级 Skill；开 PR 前跑 `/security-review`；生成代码时有安全提示插件；在带出网白名单的远程 VM 里开发 |
| **CI** | 多个**职责很窄**的评审 Agent 各审一类问题，并检索历史事故作为上下文；**评审 Agent 必须证明它的发现成立**；SAST 直接在 PR 上评论；受监管或关键代码必须人工批准；跨用户数据隔离等不变量测试一旦触发就转人工 |
| **部署** | 重大发布前做外部渗透测试；在预发环境持续做 AI 驱动的动态测试，专门找跨服务的假设失效 |
| **监控** | 漏洞赏金、红队；Claude 负责分诊告警、读日志、起草修复，但**负责分诊的 Agent 权限很窄，不能部署**，部署由另一个“Agent + 人”的组合负责 |
| **治理** | 代码库按风险分级；新的 AI 评审者先以影子模式运行并接受红队测试；对自动批准的结果**按风险加权抽样**给人复核；所有 Agent 的动作进入 SIEM，**按内部威胁对待** |

**几条可以直接借鉴的原则**：
- **最小代理权（Principle of Least Agency）**：每个 Agent 一个单一用途的身份，只给最小权限；
- **边界画在访问权限和动作上**，不画在提示词上（见案例四）；
- **安全工程师的工作从“盯 bug”变成“盯循环”**；
- 他们估计，当前的自动化流程能拦住过去 claude.ai 事故中约三分之一的 bug。

## 4. 清单

### 个人开发者
- [ ] 开启 Claude Code 沙箱（`/sandbox`），并设 `failIfUnavailable`、`allowUnsandboxedCommands: false`（见 [3.2](#32-claude-code-沙箱操作手册)）；或在容器里运行放开权限的任务
- [ ] 不在 shell 里给 Agent 设带 `--dangerously-skip-permissions`、`--yolo` 的别名：恶意安装脚本会直接调用本机已登录的 Agent（案例二）
- [ ] 安装不熟悉的依赖时跳过安装脚本（`npm ci --ignore-scripts`），或在容器里装
- [ ] 读外部 issue 或网页的会话只给单仓库、只读的 token（案例一）
- [ ] `permissions.deny` 加上 `Read(.env*)`、`Read(**/secrets/**)` 等规则
- [ ] 不在主力机上使用 `bypassPermissions`
- [ ] 开启 `sandbox.credentials`，屏蔽凭证文件和敏感环境变量
- [ ] MCP 只装需要的，token 用环境变量注入
- [ ] Agent 读外部 Issue 或网页之后，不让它自动 push 或发消息
- [ ] 保持 Agent 版本更新（安全修复很频繁）
- [ ] 云服务和 API 账号设**硬性**预算上限
- [ ] 备份 `~/.claude` 等目录下的会话记录（账号可能被封；Claude Code 默认只保留 30 天）

### 团队 / 组织
- [ ] 托管设置：`strictKnownMarketplaces`（插件市场白名单）、`allowManagedHooksOnly`、`allowManagedPermissionRulesOnly`、`deniedModels` 等（参考 [examples/settings](https://github.com/anthropics/claude-code/tree/main/examples/settings) 的 strict 示例）
- [ ] `managedMcpServers` 统一下发经过审计的 MCP
- [ ] OpenTelemetry 审计日志（Claude Code 支持 `OTEL_LOG_TOOL_DETAILS` 等选项）
- [ ] 确认代码发往哪个模型服务商、数据保留政策是否符合合规要求
- [ ] CI 中的 Agent 使用最小权限的 token，并且不处理来自 fork 的不可信 PR 内容；`pull_request_target` 里不拼接 PR 标题等不可信输入（见 [3.3](#33-ci-里的-agentclaude-code-action-的安全边界)）
- [ ] 每个 Agent 一个单一用途的身份；Agent 之间的请求不能替代人工批准（案例四）
- [ ] Agent 的操作日志进入 SIEM；对自动批准的结果按风险抽样复核

### 安全工具（社区）
| 工具 | 作用 |
|---|---|
| [NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector) | 扫描 Skill 中的恶意模式 |
| [parry-guard](https://github.com/vaporif/parry-guard) | 用 Hook 扫描提示注入、密钥泄漏、外泄企图 |
| [agent-guard](https://github.com/JeongJaeSoon/agent-guard) | 实时拦截密钥泄漏 |
| [claude-code-safety-net](https://github.com/kenryu42/claude-code-safety-net) | 拦截破坏性的 git 和文件系统命令 |
| [Trail of Bits skills](https://github.com/trailofbits/skills) | 安全审计类 Skills |
| [gitleaks](https://github.com/gitleaks/gitleaks) / [trufflehog](https://github.com/trufflesecurity/trufflehog) | 提交前扫描密钥 |

## 来源

- [How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)、[Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode)
- Claude Code 文档：[Sandboxing](https://code.claude.com/docs/en/sandboxing)、[Security](https://code.claude.com/docs/en/security)、[Agent teams 权限](https://code.claude.com/docs/en/agent-teams#permissions)；[claude-code-action security.md](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md)
- [How Anthropic secures its AI-native SDLC](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle)（2026-07）
- 案例：[Invariant Labs：GitHub MCP 漏洞](https://invariantlabs.ai/blog/mcp-github-vulnerability)、[Nx 安全公告 GHSA-cxm3-wv7p-598c](https://github.com/nrwl/nx/security/advisories/GHSA-cxm3-wv7p-598c)、[StepSecurity：Nx 恶意包分析](https://www.stepsecurity.io/blog/supply-chain-security-alert-popular-nx-build-system-package-compromised-with-data-stealing-malware)、[BleepingComputer：2,180 个账号受影响](https://www.bleepingcomputer.com/news/security/ai-powered-malware-hit-2-180-github-accounts-in-s1ngularity-attack/)、[AWS-2025-015](https://aws.amazon.com/security/security-bulletins/AWS-2025-015/)
- [Scale X：Humans missed 1 in 3 threats](https://scalex.dev/blog/ai-agent-permissions-stats/)（[HN](https://news.ycombinator.com/item?id=49195468)）、[Wikimedia：OpenAI "rogue" agent activities](https://diff.wikimedia.org/2026/10/05/openai-rogue-agent-activities-found-on-wikimedia-projects/)
- [Plugin security and trust](https://code.claude.com/docs/en/plugins/security)
- [gemini-cli changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs)
- [Matthew Green：Is sandboxing sufficient to contain rogue agents?](https://blog.cryptographyengineering.com/2026/09/30/is-sandboxing-sufficient-to-contain-rogue-agents/)、[Embrace The Red：Breaking Claude Code Opus 5 Auto Mode](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)、[thereallo.dev：隐写标记](https://thereallo.dev/blog/claude-code-prompt-steganography)、[Simon Willison：默认硬性预算上限](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/)
- [CSA：Agentjacking](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/)、[Checkmarx：MCP Security Incidents](https://checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/)、[The lethal trifecta（Arcjet 解读）](https://arcjet.com/learn/lethal-trifecta)（二手）
