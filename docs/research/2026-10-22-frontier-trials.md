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
- **VibeWise**：[官方](https://github.com/nykooi1/vibe-wise)，3,853★、9-29新建，MIT。官方支持Claude与Codex插件入口；人先表达方案的学习流程会增加交互，不能外推无人值守效率。未取得窗口内HN同名原帖，未试用。[一手／研究]

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
