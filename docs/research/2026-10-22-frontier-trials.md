主线：二／三；C5前沿发现，供读者找到可上手的新工具与做法。
改变的建议：Graphicle可试作导航而不作为测试删减真值；Taste先保原instructions再试；未试项只列候选。
新证据：近4周社区原帖／GitHub快照，以及云端Graphicle代码图、Taste安装恢复、HTML参照部分试用的真实产物；不声称模型效果领先。

# C5 首轮：关注度与上手结果分开

核实：2026-10-22 UTC+8。首轮表见[13](../13-frontier-radar.md#值得一试近4周的新项目与做法)。当前最强效果未知；本轮先回答“新在哪里、值得谁试、实际卡在哪”，不把发现阶段改成必须先证明冠军的门。

## 回扫范围与发现时差

HN Algolia按9-24至10-22 19:20 UTC+8检索claude、codex、coding agent、MCP、Show HN agent／code、AI coding、github.com，各取相关性前100条，另核候选名称；读12个候选原帖与评论树。GitHub按claude／codex／coding agent／mcp及9-24至10-22新建、star降序各取前15名，读取14项目metadata／README、近期release和少量issue；不是完整全球热门普查。[一手：公开API]

GitHub星数约19:22–19:23快照，未取得历史star，增长均未知。部分扩大issue读取返回403后停止，已有回复范围保留；搜索接口超时与原帖可读分别记录。仓库创建日期不冒充开始热议日期。[研究]

中文与Reddit线读linux.do原帖及回复、V2EX和掘金页面，以及r/ClaudeAI／r/ChatGPTCoding／r/LocalLLaMA线索。linux.do JSON入口不可读而HTML可读；Reddit索引与直接页面的票数／日期存在冲突，未采信冲突值，回复总数未知。没有把转载、活动日期或已删除帖子当独立热度。[一手／社区]

在本轮基线1b7fca1前未检出入选项目的既有正文收录。按已获原帖日期至10-22计：Whiteboard 28天、Graphicle 8天、Taste 9天；这只是本轮读到的讨论日期，不证明社区首次热议。InstaLanding原帖绝对日期未确认；其余只有新建时间，发现时差未知；用户收件箱0条，命中率分母为0，不填0%或100%。[研究]

## Graphicle：导航有用，影响图需要核对

来源：[项目](https://github.com/graphicle-ai/graphicle)、[v0.1.4发行](https://github.com/graphicle-ai/graphicle/releases/tag/v0.1.4)、[HN原帖](https://news.ycombinator.com/item?id=50088713)。作者在评论中未声称已经证明Agent完成更多任务；正面回复关注代码关联失效，反面追问比rg是否更有用。Apache-2.0。[一手／社区]

**实测19:35:15–19:49:58，14分43秒。** Linux官方发行包SHA256与发布元数据一致，实际版本0.1.4；独立HOME和数据目录，未执行setup／hooks／MCP，不调用模型。四文件retry fixture中，定义、直接调用、测试三处行号正确，别名引用可见；改helper后显式graph update更新定义及下游边。无模型ask需要sync项目库，返回的是证据，不是生成回答。[本仓实测]

**默认漏边不等于工具全线做不到。** `--precise`在此例补回对象方法及callback边，但局部同名遮蔽仍会连错目标；错误边甚至标EXTRACTED。人工语义和运行时sentinel分别验证，不把程序退出0当正确性。[本仓实测]

最小反例为两个文件：[研究／本仓实测]

```python
# helper.py
def retry(operation):
    return operation()

# app.py
from helper import retry
def direct(operation):
    return retry(operation)
def shadow(operation):
    def retry(operation):
        return operation()
    return retry(operation)
```

把app.retry改为一调用就报错的sentinel，shadow仍返回，direct触发错误，确认两条运行路径不同；Graphicle默认及precise却都出现shadow→helper.retry错边。精确模式加no-dedup仍复现。另有不唯一输入时affected退出0而explain报歧义，脚本应核结果对象。[本仓实测]

四文件fixture使用`graphicle graph extract . --code-only`、`graphicle graph explain retry_retry --all`、`graphicle graph affected retry_retry`；修改后`graphicle graph update .`。上面的两文件最小反例节点改为`helper_retry`，使用`graphicle graph explain helper_retry --all`；对照提取为`graphicle graph extract . --code-only --precise --force`。全新隔离目录的18步重放及正反断言通过。完整node ID适合导航；影响范围须与源码、rg和测试交叉核，不据图自动删测试。未测大仓或模型收益。[本仓实测／研究]

## GPT with Taste：安装保文件，不代表保有效指令

[linux.do原帖](https://linux.do/t/topic/3016674)10-13首帖208 Likes，读1–40楼；少量使用者称冗余减少，也有hook上下文负担及实测不足的质疑。它是兴趣信号，不是质量对照。[社区]

官方[固定079fb262](https://github.com/NB-Corp/gpt-with-taste/tree/079fb262b4d7932515ba4e6341fd57b6f2122f4a)，MIT、package0.1.0。19:45:21–19:52约7分钟，在合成HOME／CODEX_HOME运行官方prompt-only安装器，不启hooks或模型；安装、重复安装、check、restore及12项针对性测试通过。[一手／本仓实测]

实际改动是切换`model_instructions_file`；旧instructions和AGENTS文件字节不变，但旧指针不再被该键加载。重复安装不重复注入；restore恢复原文件字节，留下空目录及恢复记录。原本有自己的有效指令时，先保原配置再试，不能把“未删旧文件”理解为自动合并。语言／代码质量增益未测试。[本仓实测／研究]

首次可选ptrace观测因环境能力被拒，安装器当时未执行；停止该诊断后用既有Node文件访问限制正常运行已授权安装，不提升系统权限。目录外全量观测未完成，不把可选审计能力设成安装前置关。[本仓实测]

## InstaLanding：实际做了衍生页，未完成浏览器接收

[Reddit原帖](https://www.reddit.com/r/ClaudeAI/comments/1x22sap/i_built_20_free_opensource_html_pages_you_can_use/)正文提出用单HTML作为视觉参照。搜索索引的日期、票数和评论与直接页面不一致，未采信；当前关注度和绝对发布日期未知。项目[官方仓库](https://github.com/RayVelez27/instalanding.ai)MIT，数量已更新，不沿用发布时“20页”。[社区／一手]

选择Highlighter Markup页面，核其内联JS与Google Fonts，提取纸色／墨色／状态色、字体层级及间距，做成功／失败／空三状态retry-job离线衍生页；系统字体替代远程字体，未调用模型。约5分钟内完成JS语法、静态链接和15项DOM-stub检查。[本仓实测]

云端浏览器file协议导航被安全策略拒绝，未绕过；1280／390宽度渲染与截图均未完成。故只交“参照提取与状态逻辑部分试用”，不称视觉或AI生成质量通过。看中样式的读者仍须在自己的真实页面核移动端和交互。[研究]

## 其余候选与未试范围

- **Coucou**：[官方](https://github.com/Louis-CFM/coucou)，6,163★、9-27新建。Linux0.5.1官方AppImage已下载核hash；执行环境无桌面DISPLAY，桌面下载另遇网络及明确浏览器策略阻断，约4分钟后停。没有启动、通知或session路由结果。代码MIT但名称／Mochi／音效另有版权；不默认安装真实客户端hooks。[一手／本仓部分尝试]
- **Whiteboard**：[官方](https://github.com/devdotfast/whiteboard)，3,286★；[HN](https://news.ycombinator.com/item?id=49833867)9-24有424分／143评。作者澄清它是补充评审画布，不是完整IDE；评论既有看懂Agent修改的体验，也有为何不用Mermaid及大应用扩展性的疑问。MIT，当前安装范围不沿用旧帖平台限制。未试用。[一手／社区]
- **Oil UI**：2,005★、9-30新建的发现快照不变；本轮已补免费比较器部分试用，见下节，未取得窗口内HN同名原帖。[一手／本仓部分实测]
- **VibeWise**：[官方](https://github.com/nykooi1/vibe-wise)，3,853★、9-29新建，MIT。官方支持Claude与Codex插件入口；人先表达方案的学习流程会增加交互，不能外推无人值守效率。未取得窗口内HN同名原帖；现已补安装／恢复脚本小试，见下节。[一手／研究]

未入表的代表：Jevgrep需provider及代码外发，不在本轮无模型小试；SPACE依赖较重；MuscleMemory仅少量关注且会下载搜索模型；RipIDE原帖被删且热度不足；Tervia有真实评审需求但平台仍在完善。掘金Trending转载不重复计独立关注，linux.do Aegis活动日期不误当发布日。候选及试用是发现结果，不以条目数证明效率或M6漏检率下降。[研究]


## Oil UI：先复用比较器，别把免费版当组件库

**已有HTML方向稿时，🧪先借免费比较器保留现状、并排比较独立候选，再由人选方向。** 固定[0.23.9源码](https://github.com/oil-oil/oil-ui/tree/7002e1a3b3e3bc19d4159e2a37917456dafd5ad4)，MIT。10-22（UTC+8）小试约9分钟，含安装、打包和撤回检查。免费版提供比较器，README所列19卡片原型属Pro，未购买或试用。[一手／本仓部分实测]

合成任务运行列表：现状标为baseline，加“行动优先”和“运行账本”两份独立HTML，复用官方生成器打包为自包含单HTML。16项CLI／产物检查确认本地CSS内嵌、原件不变、重复构建确定性、远程或缺失资源／双baseline失败时不覆盖旧产物；53项非浏览器生成器测试通过，明确排除3项浏览器及1项Windows测试。隔离安装后文件与固定源码一致，卸载技能后产物不变。[本仓实测]

准确的验证边界：上游全套测试因浏览器项失败而停止，没有全套通过摘要；Chromium报告socket权限错误，桌面／手机截图未产出，未关闭沙箱或换路绕过。这里只确认打包与静态保护，视觉、剪贴板、实际选择交互及模型设计效果均未验。三个输入稿为合成夹具，不是模型质量对照。[本仓实测]

最小使用方式：在独立试验项目按[官方README](https://github.com/oil-oil/oil-ui/blob/7002e1a3b3e3bc19d4159e2a37917456dafd5ad4/README.md)安装。本轮执行`npx skills add oil-oil/oil-ui --agent codex --skill oil-ui --yes`，CLI解析为1.7.4，安装后才核对上述源码SHA，该入口本身不锁版本。使用Python 3.10+；候选目录放HTML，将下列manifest保存为`<候选目录>/manifest.json`，调用`python3 .agents/skills/oil-ui/scripts/build_explorer.py <候选目录>`；生成后在浏览器打开`<候选目录>/style-explorer.html`；修改源页后加`--force`重建，输出不会自动更新。可只用两项，不必凑三个方向。[一手／本仓实测]

```json
{"round":"01","lang":"zh","candidates":[{"id":"baseline","source":"baseline.html","baseline":true},{"id":"a","source":"a.html"},{"id":"b","source":"b.html"}]}
```

[比较器说明](https://github.com/oil-oil/oil-ui/blob/7002e1a3b3e3bc19d4159e2a37917456dafd5ad4/references/style-explorer.md)中的“选择”只复制带轮次／编号的文字，需贴回Agent，不自动写回项目；这是文档／源码核对，未实际点击。远程字体／CDN需先本地化并核许可，或改用截图。需要验收真实交互、持久化或服务端数据流时，撤出静态比较器，回已有应用做验收；无法看图时只交打包结果，不判视觉合格。[一手／研究]


## Jiti：当前对象可查可改，不只留聊天

**🧪 值得小型Lisp应用试的是“现行函数目录＋源码＋可恢复数据”，而非更长的聊天交接。** [作者10-05原文](https://ghuntley.com/lisp/)及[固定70146a2源码](https://github.com/ghuntley/jiti/tree/70146a2236dcd34696807102028af943cf0be370)提供可运行实现；MIT，本轮只加载image-agent/store，不接模型或终端。10-22（UTC+8）约11分钟小试，真实完成已有函数→组合→二改→重开后继续使用和查看源码。公开维护收益、独立长期采用和最高水平未知。[一手／本仓实测]

| 本轮动作 | 实际结果 |
|---|---|
| uppercase与reverse组合 | Hello → OLLEH |
| 二改：加括号并记录运行次数 | Hello → [OLLEH]，runs=1 |
| 新进程恢复后继续调用 | World → [DLROW]，runs=2；参数、文档及含新逻辑的源码可查 |
| 预览／失败／显式回退 | 预览保原计数；非负检查拒绝-1；半途报错abort后恢复；回退保留历史，再重开仍能执行v1 |

五个独立SBCL进程的38条聚焦断言通过；最终相对路径脚本在另一临时目录重放同样通过。这里的“解释”是取得当前参数、开发者文档和真实源码，没有让LLM生成解释，也没测人理解速度；未运行上游完整测试、JSON工具分发、CLI或模型。[本仓实测]

**关键边界：受管对象回滚不是外部世界的沙箱，也不会自动恢复调用方验收契约。** 本轮preview计数恢复而临时文件写入保留；恢复时漏传非负invariant，先前拒绝的-1会被接受，随后已显式回退。另测源码描述超过4096字符会标截断，消费者须补齐再解释；同一SBCL版本恢复、直接命名函数与可读表数据才在本参考适配器范围。需要一般Web应用热更新或跨外部系统回滚时不直接采用。[一手／本仓实测]

可借到其他Agent应用的交接结构是：先查当前功能和实际实现；恢复代码／数据后真正调用验证；目标、检查和受管资源边界由可信调用方另行加载。相较只存摘要，本轮证明当前可执行对象与可查源码能一起恢复，不证明总维护成本更低。[研究]

### 复现确定性链

只在无重要文件的Linux amd64临时目录运行，需libc6≥2.38、libzstd1≥1.5.5及git、curl、dpkg-deb、timeout；不需要模型凭据。复制[测试脚本](../../experiments/jiti-stateful-trial.lisp)和[运行器](../../experiments/run-jiti-stateful-trial.sh)到该目录，保留文件名，再执行：

```sh
git clone https://github.com/ghuntley/jiti.git source
git -C source checkout --detach 70146a2236dcd34696807102028af943cf0be370
curl -fL https://deb.debian.org/debian/pool/main/s/sbcl/sbcl_2.5.2-1_amd64.deb -o sbcl.deb
printf '%s\n' 'c4153abbe1def77e5e2bd62d2f25295d60df80333ea1a13c44b53209d179ef67  sbcl.deb' | sha256sum -c -
dpkg-deb -x sbcl.deb runtime
sh run-jiti-stateful-trial.sh
```

预期5条SUCCESS和38条PASS，不只看退出0。运行器拒绝覆盖已有world，先保留并移走再重放；每阶段45秒上限。脚本会写一份合成临时文件来验证preview边界。包散列固定本轮字节，不冒充独立签名核验；读source/LICENSE及runtime中的版权说明。本轮源码实际由固定Git blob取回校验，运行时由上述Debian包解压，未做系统安装。[一手／本仓实测]

探索回执：这是核心“按需理解与接管”回扫后的定向新意试验，不是新增全网热榜；前序核心接管问题回扫读过作者、[HN讨论](https://news.ycombinator.com/item?id=50151036)及[中文V2EX](https://www.v2ex.com/t/1248455)可见回复；两帖讨论理解与接管，不是Jiti独立采用证据。核心00／01已有相同选择的材料不重复改写。此次只核固定源码、依赖并跑确定性接口，不声称新增社区共识或当前强Agent净收益。[研究]


## VibeWise：学习项目按需开，reset不是关闭

**🧪 在专门学习的项目启用；赶交付时用pause，而不是reset。** 固定[0.1.44源码](https://github.com/nykooi1/vibe-wise/tree/eefb53df406ab89e31444684ff32c1df205221f8)，MIT；10-22（UTC+8）约5分钟隔离安装与状态小试，没有模型对话。机制是技能说明＋项目学习笔记＋Claude恢复hook，不是独立学习评估器。[一手／本仓部分实测]

| 读者状态／入口 | 本轮确认的结果 |
|---|---|
| 只安装、项目尚未启用 | 未生成项目笔记；真实SessionStart脚本返回空 |
| Claude的已激活项目 | startup／resume／clear／compact／fork都会返回恢复上下文；同仓子目录可发现状态，独立嵌套Git仓不继承 |
| paused项目 | startup和compact均不返回恢复上下文 |
| Codex 0.1.44插件 | [manifest](https://github.com/nykooi1/vibe-wise/blob/eefb53df406ab89e31444684ff32c1df205221f8/.codex-plugin/plugin.json)没有注册恢复hook，[官方说明](https://github.com/nykooi1/vibe-wise/blob/eefb53df406ab89e31444684ff32c1df205221f8/skills/learn/codex.md)要求每会话手动`$vibe-wise:learn`；安装enabled不等于已加载 |
| reset暂停中的合成项目 | 官方helper预览后确认重置，保应用文件、备份旧笔记，但状态变成active＋incomplete，再次触发引导 |

Claude几行是实际Python hook输入输出，不是Claude客户端加载或模型依从性测试。源码约定显式learn后普通开发仍走学习回合，不能把它当一次命令的临时格式；hook按项目状态、不按任务语义决定恢复。Learn/reset声明`disable-model-invocation: true`，这不是学习回合在下一条开发请求自动结束的标记；各客户端实际执行仍待验证。没有测任意闲聊的实际行为。[一手／本仓实测]

可照用的选择是：先在可恢复的学习项目用[官方安装入口](https://github.com/nykooi1/vibe-wise/blob/eefb53df406ab89e31444684ff32c1df205221f8/README.md)，明确learn；赶交付要暂停时确认profile实际为paused，再开新会话核恢复状态。reset是重新入门，真实笔记仍须按helper预览后确认；不要为退出而重置。卸载不会删除项目学习笔记，也不证明当前会话已加载的上下文被清除。[研究／一手]

本轮用独立HOME／CODEX_HOME和Codex CLI0.163.0实跑本地marketplace添加、插件安装、重复安装、移除及marketplace撤回；技能文件与固定源码一致，撤回后注册／缓存清空，项目源文件与合成笔记字节不变。11项真实hook边界检查通过；上游40测38过，2项“无Git目录”前提被环境祖先Git标记破坏，未改环境或产品来凑全绿。源码用路径遍历而非Git命令，Git搜索上界设置不能修这个前提。Claude客户端不在环境中，未安装；学习提升、时间／代码质量收益及真实对话中的pause行为均未验。[本仓实测]

探索回执：本次是已有P90候选的定向上手；读固定README、许可、两端manifest、Learn／reset／恢复源码和开发测试说明。GitHub issues只获索引，未据此声称独立用户效果；不新增社区共识或前沿领先结论。[研究]


## 当红必看的使用面与成熟做法

**核心入口先补Claude Code、Copilot、Codex、Cursor和开源OpenCode，不再只用“近4周新建”筛工具。** 这是使用面支持的阅读优先级，不是全市场五强或净效果排名；OpenCode覆盖开源模型可选路线，不能隐去其他更高使用率工具。成熟做法复用／重读已有Willison、Toub、Cursor及Vinext材料，不计新发现。[研究：2026-10-22]

### 两个调查的题意不能混用

[JetBrains调查](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)及[原图](https://blog.jetbrains.com/wp-content/uploads/2026/08/ai_coding_tools_workusage_dynamics.png)问“在工作中的编码及其他开发任务使用哪些AI工具”，可多选、图只展示工具子集。2026年5–7月，N=15,509；Claude Code39%、Copilot21%、Codex16%、Cursor12%、JetBrains AI/Junie9%、OpenCode7%、Antigravity6%。它不是付费、每日活跃或唯一主力，不能把同文另一题的“最常用”混进来。调查以8种语言招募、地区配额，按地区／就业／语言／JetBrains熟悉度重加权；厂商研究和自报偏差仍在，不代表客户端遥测。[一手：调查发布者]

[Stack Overflow数据](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent)、[方法](https://survey.stackoverflow.co/2026/methodology)及[题目源码](https://github.com/StackExchange/Survey/blob/releases/2026/questions/ai/AICodeAgent.yaml)另问“过去一年用过／未来六个月想用”，可选且多选。本轮只看Used回答者子集n=12,255，不是总样本30,903；Claude Code65.5%、Copilot58.7%、Codex29.5%、Cursor25.5%、Antigravity16.0%、Gemini Code Assist14.6%、OpenCode13.6%。6-23至8-05收集、169国，经SO网站／博客／邮件推广，存在自选及社区可达性偏差，不是十月即时份额，不能和上段求平均。数据出处：Stack Exchange Inc., Stack Overflow Developer Survey 2026，[ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/)；这里只引用选定题项数字。[一手：调查及问卷源码]

GitHub累计星数、近期提交和HN／V2EX讨论只补关注及活动信号，本轮没有统一的4周增长、去重活跃用户、付费／留存或全渠道讨论分母，因此不按它们伪造“口碑最好”总榜。[研究]

### 可借的成熟机制与反例

- **Claude Code整轮交付**：[Willison 10-20作品复盘](https://simonwillison.net/2026/Oct/20/battledrones/)保留可玩产物和反复试玩，支持少逐行阅读仍能推进的个案；不是当前模型普遍赢。[V2EX双持原帖](https://fast.v2ex.com/t/1249293)既有UI与节奏好评，也有偏离需求的反例，不能概括全部前端表现。[一手／社区]
- **Copilot渐进迁移**：[Toub生产复盘](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/)展示Agent实现、跟进评审和失败；也记录删SDK方法后用schema-break-ok豁免让CI通过，再由人要求恢复。借用可合入块与兼容判断，不把同厂自报当独立提效对照。[一手／研究]
- **Codex产物接收**：[八月同题游戏](https://simonwillison.net/2026/Aug/7/moonlight-mayhem/)中Agent读过截图仍漏掉巨大眼球，直到人指出；可借明确目标、可跑环境及真实反馈，不将八月型号比较升级为十月冠军。[一手／研究]
- **Cursor环境先行**：[7-30环境复盘](https://cursor.com/blog/cloud-agent-environment)用统一CLI／supervisor处理运行入口，单写Skills改善有限；[9-23成本复盘](https://cursor.com/blog/improved-token-efficiency)是多项harness改变的组合，不能只抄缩短提示就承诺省钱。[一手：自家生产；研究]
- **OpenCode可选模型执行器**：[Vinext](https://blog.cloudflare.com/vinext/)是较早成熟先例，作者仍用架构判断、测试和浏览器反馈纠错，不作当前最高水平认证。[V2文档](https://opencode.ai/v2/docs/migrate-v1/)说明V1/V2发行轨并行，但安装默认不隔离并存；先核主版本、provider及插件兼容；[V2EX Go讨论](https://s.v2ex.com/t/1250404)中的消耗个案带插件和模型组合，不能归因裸执行器。安装和当前V2连续二改本仓未试。[一手／社区／研究]

探索回执：10-22新核官方调查原图／问卷数据、产品契约、GitHub活动及中文双持／Go原帖；旧做事者复盘和[HN理解代码讨论](https://news.ycombinator.com/item?id=50151036)重读，不冒称新发现。另读[V2EX接管问题](https://www.v2ex.com/t/1248455)可见回复，部分正文缺失；Reddit局部抓取失败，linux.do本轮仅检索、X原帖不可读，不采信其摘要投票或未核事件。没有新客户端或模型运行，不调整核心差距分。[研究]
