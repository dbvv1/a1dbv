# Agent-Reach：补平台读取缺口，先验具体动作

**🧪 需要补中文平台、视频内容或站内读取时，把 Agent-Reach 放进候选；已有网页／GitHub工具能取得原文时，继续用原入口。** 它把渠道工具、动作、错误和后端选择统一起来，值得借的是“按动作验可用”，不是“装完就能搜全网”。本仓已运行公开 GitHub 搜索与 issue 读取：前者成功，后者被网络入口拒绝；没有获得超出原工具的决定性原文，因此暂不设为默认检索器。

## 怎么选、怎么试

| 所缺材料 | 当前选择 | 动作、依赖与不适用 |
|---|---|---|
| 网页或 GitHub 原文已经能读 | ✅ 保留现有工具 | 不为统一命令新增安装；确有批处理／结构化输出需要再比较 |
| HN、linux.do 等讨论 | ✅ 原站 API／JSON 与现有搜索 | 1.6.0 没有专用渠道；通用网页搜索／读取依赖 Exa／Jina，不能据此认定评论树完整 |
| V2EX 正文与回复 | ✅ 先用公开 API | Agent-Reach 封装 `hot/node/read/user`，没有关键词搜索动作；热帖／节点只作发现线索，跨时段查找仍用搜索 |
| B站视频内容 | 🧪 按缺口试 `read` 或 `subtitle` | `read` 是元数据；字幕走 bili-cli、只读第一分P，可能复用已有站点登录。没有评论动作；本仓未跑该适配器 |
| YouTube 视频内容 | 🧪 先分字幕与转写 | `read` 只取元数据，字幕走 yt-dlp；转写另需 ffmpeg＋Groq/OpenAI Key，并向服务方发送音频。没有评论动作；本仓未跑该适配器 |
| 小红书站内正文／评论 | 🧪 按缺口试 `read/comments` | OpenCLI、Node、专用浏览器及登录；首次使用可能复用已有站点会话，无账号授权就不走此路径 |
| 想把 Reddit／X 查询设成无人值守默认 | ⛔ 暂缓 | 先验目标动作及登录／限流条件；原生站内路径需 OpenCLI、Node、浏览器，公开搜索结果另按摘要接收 |
| 只是缺候选，不知道有哪些强工具 | ✅ 先做跨渠道广扫 | 访问适配器不会自动补齐采样窗口、查询词和候选选择 |

**评论要单独验收：核原站回复总数、返回条数及所引用的楼层正文。** V2EX适配器只请求回复 `page=1`，不能只凭请求成功判断完整；小红书 `comments` 明标 `loaded_comments`／`exhaustive=false`，只覆盖已加载评论。视频描述、字幕与观众反馈是三种不同材料。

源码依据：[Web后端](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/channels/web.py#L153-L230)、[转写外发](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/transcribe.py#L355-L443)、[渠道注册](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/channels/__init__.py)、[V2EX](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/channels/v2ex.py#L168-L238)、[B站](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/channels/bilibili.py#L157-L238)、[YouTube](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/channels/youtube.py#L92-L221)、[小红书评论](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/channels/xiaohongshu.py#L116-L129)、[会话复用](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/skill/references/sessions.md)；[一手：1.6.0固定源码，未新增适配器运行]，核实2026-10-30。

**先用真实资料验证缺口。** 例如要核[这篇V2EX讨论](https://www.v2ex.com/t/1227194)的小任务成本、大任务边界及归因质疑，在新的临时目录执行下列命令，再让Agent核 `topic.json` 首项的 `replies` 与 `replies.json` 数组长度，定位第7／18／22／28楼原句：

```sh
curl -q --silent --show-error --max-time 30 'https://www.v2ex.com/api/topics/show.json?id=1227194' -o topic.json -w 'HTTP %{http_code}\n'
curl -q --silent --show-error --max-time 30 'https://www.v2ex.com/api/replies/show.json?topic_id=1227194&page=1' -o replies.json -w 'HTTP %{http_code}\n'
```

本次两次HTTP200，正文声明40回复，实际返回40条且ID唯一，四个关键楼层正文均在；本帖未观察到分页漏取。这里运行的是原站curl，没有运行Agent-Reach或比较性能。读者换成自己的目标帖后，先核HTTP与正文，再核数量／楼层；失败、空正文或缺回复就保留缺口，明确访问拒绝则停止该入口。来源：[原站正文API](https://www.v2ex.com/api/topics/show.json?id=1227194)、[回复API](https://www.v2ex.com/api/replies/show.json?topic_id=1227194&page=1)；[本仓实测]，2026-10-30。

确需试Agent-Reach时，固定官方版本、独立环境，先核动作依赖，不导入已有账号。检查 `ok`、`items`、`meta.attempts`、`error` 及返回的覆盖标记；需要登录、Key或付费时先确认该路径的授权。

**从官方 GitHub 安装，不安装 PyPI 的同名 `agent-reach` 包。** 项目本体是 MIT；配套浏览器二进制另有许可证。公开读取成功也不授权访问私人内容或绕过平台限制。来源：[官方说明](https://github.com/Panniantong/Agent-Reach)、[固定浏览器说明](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/docs/cloakbrowser.md)；[一手／经验：采用条件]，核实2026-10-29。

## 10-29 Agent-Reach实际运行：1项成功、1项失败，新增决定性原文为0

目标是核对这个新候选及其 Reddit 失败反馈。先前普通网页工具已找到官方仓库、读到 #868；连接器已取得实现文件。随后从官方 archive 取得固定 `14c213405669414492bda0f8d52cc6531d062c45`（包版本1.6.0），在临时 Python 3.12.14 venv 中安装清单依赖，以 `python -m agent_reach.cli` 调用未修改的项目源码，未运行项目 setup／update 或自动安装脚本。两动作均指定 `--backend github-api`，不走 `gh` 或浏览器；该参数仍会读取 `GH_TOKEN`／`GITHUB_TOKEN` 和配置中的 `github_token`，本次靠清空凭据环境与独立 HOME 保证没有提供账号凭据。

| 同题动作 | 实际结果 | 进程退出码 | 本次墙钟耗时 |
|---|---|---:|---:|
| 搜索 `Agent-Reach`，最多5条 | 返回5条仓库元数据，官方仓第一；当时105,756 stars | 0 | 4.583秒 |
| 读取官方 issue #868 | `UPSTREAM_BROKEN`；`Tunnel connection failed: 403 Forbidden`；无 items | 1 | 1.698秒 |

**新增决定性原文0篇。** 成功项给出了更精确的当时 star 数，不是新的功能或效果证据；失败项未取得正文。已知名称查询不是盲发现测试，未做同预算、同时间的速度比较，也未测试 Reddit、X、中文平台或模型收益，不能据此宣布工具整体无用或优于原工具。

运行只传网络代理／证书设置与解释器配置，不传账号凭据；bubblewrap 将宿主根目录只读，遮蔽用户目录、工作区与临时树，只挂入独立试验目录，另设 HOME／XDG。没有启动浏览器、导入会话、调用 `gh` 或访问私人数据。这是窄路径预审加进程／文件系统隔离，不是完整安全审计或专用虚拟机。

准备阶段遇到默认缓存只读和首次沙箱挂载位置不可建，均在授权临时目录内修正；这些不是产品失败。实际查询时外层工具另报网络批准被取消；事后读取结果文件并检查进程，确认两命令都已结束，拒绝项没有重试。无法由代理403推断 GitHub平台本身封禁、限流或产品实现失效。

完整命令、stdout／stderr、退出码、耗时、依赖版本及 archive SHA256 见[机器可读结果](../../experiments/agent-reach-public-trial/results.json)。这是2026-10-29保留的原始运行输出，不是后来补跑；公开副本未包含环境变量值或本机路径。[本仓实测]

## 有价值的机制：逐动作路由、逐动作验收

**拿到一个统一CLI后，仍要核当前动作究竟经过哪条路径。** 固定源码的 `cli.py` 进入 `runtime/cli.py`，由 `dispatch.py` 验参数、管理超时、尝试后端并生成统一 JSON；渠道声明动作，再调用 OpenCLI、bili-cli、yt-dlp、公开 API 等上游。`doctor` 是无网络诊断，`check` 才实时检查；安装存在不代表现场可用。

Reddit 是具体反例：其 `search`／`read` 声明公开网页路线和 OpenCLI 路线，但调度器在渠道已添加时默认跳过公开网页预尝试；该渠道原生后端列表只有 OpenCLI。因此不能从“支持备选”推成“OpenCLI失败必定自动回退Exa”。公开网页未必要求登录，站内路径与整个网站的访问条件要分开。

来源：[固定CLI](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/runtime/cli.py)、[调度器](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/runtime/dispatch.py)、[Reddit渠道](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/channels/reddit.py)；[一手：源码已读，Reddit未运行]，核实2026-10-29。

## 社区反馈改变哪些选择

| 原始反馈 | 能支持的取舍 |
|---|---|
| [#858，10-26](https://github.com/Panniantong/Agent-Reach/issues/858)：1.6.0用户报告B站search/read/hot通过，扫码显示成功但凭据为空、subtitle失败 | 用原字幕动作验收，不把登录提示当成功，也不废弃已通的其他动作；用户根因推测未复现，本条核实2026-10-30 |
| [#868，10-28](https://github.com/Panniantong/Agent-Reach/issues/868)：1.6.0用户的 subreddit 通过，search 返回HTML，未尝试public-web | 验具体动作，不只看渠道总体状态；上节源码可支持此路由风险，本仓未复现其登录环境 |
| [HN，8-07](https://news.ycombinator.com/item?id=49207806)：有人疑问为何默认Exa，另有人称不适用自己的场景 | 保留原搜索基线，核实际后端；没有任务分母，不推普遍成功率 |
| [LINUX DO，6-16第11楼](https://linux.do/t/topic/2415670?tl=en)：用户自报封装成Skill做多平台检索，需配置 | 有真实使用入口，适合把访问缺口列入候选；未提供受控提效结果 |
| [#802，10-12](https://github.com/Panniantong/Agent-Reach/issues/802)：用户贴严重安全扫描告警 | 逐项人工审计，不直接宣称恶意软件或无风险；当前URL辅助代码确实包含阻止metadata／私网字面地址的检查，字符串命中不能独自证明攻击路径 |

官方1.6.0发布说明自报40项动作仅28项发布前实测通过，其余部分未登录、缺Key、限流或测试网络受阻。这个边界比“全网可用”的宣传更适合作为试用起点。来源：[发布说明](https://github.com/Panniantong/Agent-Reach/releases/tag/v1.6.0)、[URL防护源码](https://github.com/Panniantong/Agent-Reach/blob/14c213405669414492bda0f8d52cc6531d062c45/agent_reach/utils/url.py)；[社区单例／一手自报及静态核查]，核实2026-10-29。

## 漏项归因：窗口漏掉旧项目，目录也不保证收录

**本次是外部带入后补核，不能倒填成自主发现。** 在本次之前固定树 `a0191795567fddf93e3f9829aee9e02a9b9b5098` 的默认分支代码索引查询 Agent-Reach、AgentReach、Panniantong 未命中，M6研究记录也未收录。它证明受查记录缺口，不证明执行者从未看到。

| 原始传播记录 | 与10-26采样的关系 | 可下的判断 |
|---|---|---|
| [作者推荐PR #841](https://github.com/hesreallyhim/awesome-claude-code/pull/841)，2026-02-25 03:49:36 UTC；十秒后因未用issue模板自动关闭 | 当时扫描的[固定README](https://github.com/hesreallyhim/awesome-claude-code/blob/0d0c623a/README.md)无该项目 | 该目录入口没有候选；不是目录中出现却漏读，也不是项目质量被否定 |
| [HN 49146136](https://news.ycombinator.com/item?id=49146136)，8-02 16:51:17 UTC；[49207806](https://news.ycombinator.com/item?id=49207806)，8-07 09:13:41 UTC | 早于回执“9月以来”查询，也不在上海10-19至25周样本 | 明确被时间窗排除，不能当“查到未读” |
| [LINUX DO周刊](https://linux.do/t/topic/1676265)，3-02；上述6-16实践帖；[9-29检索问题第10楼](https://linux.do/t/topic/2964590?tl=en) | 回执仅记录其他定点帖子，无这些帖子 | 传播早已存在，受查记录未覆盖；是否出现在当时搜索结果未知 |
| v1.6.0，10-23发布 | 在周窗口内，但所扫发行源是Codex，不含此仓 | 发行源选择未覆盖，不是当周没有变化 |

仓库元数据给出创建时间2026-02-24 02:10:24 UTC；最早精确可核的公开推广记录是上述2-25 PR，不称全网首次公开。当前CHANGELOG把1.0／1.1写成2025年，与仓库创建及公开PR时间线不一致，首次发布年份不能仅抄该文件。

GitHub topics 当时只看更新时间第一页，weekly拿到过期缓存；没有保存完整历史成员，不能还原本项目是否出现。也没有原始日志证明“已读未转化”。因此修正是补头部存量与不同术语的覆盖，不把未经证实的个人操作写成原因。旧6/25、HN十项和目录十三项分母均不变。

来源：[固定M6回执](https://github.com/dbvv1/a1dbv/blob/a0191795567fddf93e3f9829aee9e02a9b9b5098/docs/research/2026-10-15-exploration-evidence.md#2026-10-26固定来源覆盖)、[HN时间API](https://hn.algolia.com/api/v1/items/49207806)、[PR关闭理由](https://github.com/hesreallyhim/awesome-claude-code/pull/841#issuecomment-3956557182)；[研究：记录与时间窗对照]，核实2026-10-29。

## 10-29覆盖与未完成范围

本条是对已带入漏项的定向深挖和最小运行，不宣称完成ce391d探索Skill要求的全领域广扫或达到饱和。

| 来源类 | 实际读取与产出 | 未覆盖／受阻 |
|---|---|---|
| 做事者自身材料 | 官方说明、发布、固定CLI／调度／渠道／配置／HTTP源码；形成动作验收选择 | 未完整审计所有依赖与浏览器实现 |
| 头部与目录 | 官方仓热度；awesome固定README及推荐PR；定位目录缺口 | 未重建历史topic／trending成员，未作热门项目全集比较 |
| 技术社区 | HN两条传播记录、可见评论；LINUX DO周刊与实践／问题帖 | 未覆盖全部社区；搜索结果摘要不冒充原帖 |
| 真实用户问题 | #868原文、#802告警原文及空评论结果 | 其余issue标题只作线索，不计独立实测 |
| 未点名新品 | 沿传播链取得候选背景 | 本条没有交付另一新品；广扫仍属后续独立工作，不能把本项目重记自主发现 |

GitHub releases API本次返回403后停止；发行事实来自此前成功读取的官方网页。浏览器会话、私人内容、付费服务均未触及。下一次只有自然出现且当前工具无法取得的公开平台材料，才值得比较目标动作的新增原文；访问拒绝未解除时不重跑同一入口。[研究／本仓实测，截止2026-10-29]
