# FPS 成对验收回执审计与匿名选图

**决定：证据保留，不按原卡合格接收，不用超次结果换默认。拍摄槽尚未释放。** 原卡只授权一次现场测试脚本修复及一次失败命令重跑；原三跑之后还有额外复核；11-13 补交回执合计两处修复、六次聚合 smoke、三次成对拍摄和两次 probe。匿名静态选图通过不抵消执行越界和退出清理欠项。

## 固定证据与真实次数

审计基准为 a1 卡 `5e6b624921b14c29c8ad7f1170a5966ec0fb56fe`、FPS 结果 `c7936ff9231bd2755bedcd062f83cfe41e841d70`，源 base `658b2e592c612fa0801e2cc7fecdce32bb57eadb`。结果目录 `docs/quality/capture/B-FPS-DEFAULT-FULL-PAIR-20261112/658b2e592c61-r2/` 的 SHA256SUMS 58 条逐项复算，0 失配。此审计不运行游戏、不重跑命令。

| 调用 | 2026-11-12 UTC 起止 | 已核结果 |
|---|---|---|
| smoke attempt-1 | 21:19:34–21:20:14 | wrapper 1；位移断言失败 |
| smoke attempt-2 | 21:23:07–21:28:51 | wrapper 1；默认子进程 status=null、signal=SIGTERM；默认 report passed；没有候选入口完成证据 |
| smoke attempt-3 | 21:33:21–21:47:37 | wrapper 0；两入口各六自然回合；超出原卡重跑次数，不计合格 |
| 独立成对拍摄 | 21:49:19–21:50:27 | exit 0；原始 base，三机位各前后双重复共12图 |

### 补交汇总揭示的额外调用

结果分支 `8afe767e1a68257f635a03946f616895808d999b` 于 **2026-11-13 00:03:06 UTC** 交回原调用清理汇总，原卡于 **00:03:23** 写为 blocked。以下来自该汇总，不冒充本轮运行或全部原始日志已回仓；日期均为11-12 UTC。两次 review smoke 的时间只是日志创建／最后写入窗口，命令由产物结构重建。

| 额外调用 | UTC 时间／窗口 | 汇总中的结果与缺项 |
|---|---|---|
| smoke-review | 21:56:38–22:09:28 | wrapper 1；默认六回合，候选失败内部报告、浏览器退出和清理丢失 |
| capture-review | 22:12:59–22:14:05 | 内层报告及浏览器 exit 0，wrapper exit 未记；12图与交付图逐一同哈希 |
| smoke-review-rerun | 22:14:20–22:26:03 | wrapper 0；新版/默认帧耗 mean、p95 比 **1.0418／1.0966** |
| reviewer-capture | 22:46:34–22:47:48 | 内层报告及浏览器 exit 0，wrapper exit 未记；12图与交付图逐一同哈希 |
| reviewer-smoke | 22:48:06–23:02:10 | wrapper 0；新版/默认帧耗 mean、p95 比 **1.0906／1.0591** |

首次拍摄已通过，复核同图不增加独立场景证据；静态盲选沿用下文已完成结果，不重做。新增两次成功 smoke 的均值与p95均慢于默认，不能挑第三跑的 0.9569／0.9395 宣称帧耗稳定无退化；不同自然输入对局也不能直接推出固定百分比的材质因果成本。所有超额执行继续隔离，不据此换默认。

第一次补丁 `b45345f` 只将真实按住 s 的固定230ms等待改成至少20 tick，保留原位移断言；第二次补丁 `c3546ec` 给 spawnSync 设置64MiB maxBuffer。补丁文本只改测试工具，第三跑实际源为 `c3546ec`，不能写成干净 base。第二跑 SIGTERM 是原 manifest 事实；公开材料没有 spawnSync.error.code=ENOBUFS 原始回执，不能把 maxBuffer 根因解释冒充完全核实。按2探针记录当前版本能切手枪，不能反推旧 `402dd68` 超时根因。

environment 另记两 worktree 执行 npm ci，与本卡“不安装／升级软件”范围不一致；锁文件未变不等于这一步已获本卡授权。

## 退出证据的边界

公开脱敏 browser-events.log 核得真实 `process did exit: exitCode=0, signal=null`：66372（21:20:14.299Z）、64884（21:28:50.597Z）、79460（21:40:47.704Z）、106672（21:47:36.937Z）、52864（21:50:27.139Z）。这五份关联 report 均为 browserDisconnected=true、previewPortClosed=true。

补交汇总记 unit-1 外层 **22:31:23**、unit-2 **23:06:11** exit 0，注册子树 settled；23:39:04 静态核查14个已知PID均不存活、9个已知预览端口无监听。它补上原两单元退出摘要，不等于所有调用原始记录已回仓，也不能替代未知PID／端口的归属证据。

仍缺两 probe 的命令、PID、exit/signal、源码绑定和清理；失败 smoke-review 的候选浏览器退出及清理；两 review smoke 的完整端口清单；两次 capture rerun 的 wrapper exit。补交单元 unit-3 在23:51:52生成汇总时仍 running，最终外层退出未随结果交回。原始接收端 execution／collection 记录仅被引用，未全部公开回仓。原卡的 blocked／taskDone 是工作状态，不当作进程退出证明。

不推定仍运行，也不推定全部退出。槽继续隔离；只接收可恢复的原调用证据，无法恢复项交维护者说明，不启动模型补造记录、不新 smoke/capture/probe、不追加修复或重跑额度。汇总中的“缺两非作者盲选”已过时，下文12图双AI静态评审保留；硬件GPU与试听仍非换默认前置。

## 匿名图片映射

两位独立非作者评审未继承项目上下文，只收到12张原始PNG的匿名副本，不接触源码、元数据或新旧映射；各自逐张看完后提交意见，之后才解码。均为 AI 静态评审，不冒充人工看、听、玩或完整游戏验收。原图未经裁剪、缩放或其他加工，同组双重复字节相同。

| 匿名文件（r=1、2） | 固定结果目录 capture/ 下原文件 | 每张 PNG SHA256 |
|---|---|---|
| view1-A-r | gameplay-materials-r.png | 1951f479a12bd1880b792c1a5c5c95400010424044b1e5f313a4f634e8f97e7b |
| view1-B-r | gameplay-default-r.png | 54e3ee3adb5ffadc93f884ecadb05753ca1e0a47073a2406cf99e4f39181427b |
| view2-A-r | courtyard-gap-materials-r.png | 9f767c70a52e4aa444a3d1ee4f7ba329e4b10e61bdcbeec11aacd592bbd40f93 |
| view2-B-r | courtyard-gap-default-r.png | 1eed1336d78cd11b751ebd9ab200f0b46935f1d0f6936081a3ac4d218fc029c2 |
| view3-A-r | cross-lane-materials-r.png | 9f85c13c960416b6b0f92cbd603877acc3fcef96b533fbe46a9de30f5960a1b0 |
| view3-B-r | cross-lane-default-r.png | b1c5d2e81073d2cf97459a61021f7c7795f57422d2ff4bd3ce61bce505035713 |

### 评审一原始意见

> 已逐张查看12张PNG；各组双重复未见影响判断的差异，仅评静态视觉。
>
> - view1：偏A。墙地有适度细节，完成感更强；人物、路线仍清楚。B更干净、与低多边形人物更统一，地砖线也更利于判断距离。A的不足是地面尺度提示变弱。
> - view2：偏A。大面积空地不再像纯色测试场，黄色圈与人物仍突出。B地砖提供空间参照，但远处细线呈断续点状，增加干扰。A纹理略显云斑，尚未压过玩法信息。
> - view3：偏A。近墙和掩体的表面细节明显改善完成感，人物轮廓保持清晰。相较B，A环境偏写实、角色仍是硬折面，风格统一性稍弱；墙地的类似斑驳也使材质区分不足。
>
> 整体：偏A，主要赢在完成感，不是玩法可读性的大幅提升。B赢在风格简洁和地面尺度参照。A需注意纹理噪声与低模角色的协调；两版近墙通风口、边框都有偏糊的观感。没有观察到明显遮蔽角色或目标标记的退步。

### 评审二原始意见

> 已逐张查看12张PNG；同一机位各版本的两次重复，肉眼未见明显差异。
>
> - view1：略偏A。墙地细微纹理提升实体感，人物、路线和掩体仍清楚。B更干净、与低多边形人物更统一，但地面网格偏测试场观感。
> - view2：偏A。大面积地面与围墙不再空白，完成感更好；黄色目标圈依旧醒目。B地砖线提供距离尺度，但远处细线出现零碎点状视觉噪声。
> - view3：略偏A。近墙有更明确的表面质感，纹理尺度没有夸张到抢主体。B的纯色墙更简洁，但显得平、空。
>
> 明显代价：A比B增加了墙地纹理噪声，环境材质与纯色、硬切面的角色风格存在轻微不统一；A去掉地砖网格后，地面距离尺度参照弱一些。未见明显损害人物识别或通路判断。
>
> 整体：偏A，小幅胜出，主要赢在材质与完成感；不是玩法可读性的显著提升。仅静态视觉结论，不涉及声音、性能或smoke验证。

解码 A=全场材质、B=当前默认。两位均未判新版整体更差且偏好新版，仅这组同机位静态选图条件满足。SwiftShader rAF mean 289.99/277.49ms、p95 550/516.7ms 来自不同自然输入对局；不称流畅，不是GPU帧耗、输入延迟或声音验证。默认、网站、品质覆盖均不据此上调。

证据：[固定卡](https://github.com/dbvv1/a1dbv/blob/5e6b624921b14c29c8ad7f1170a5966ec0fb56fe/docs/collaboration/local-jobs/B-FPS-DEFAULT-FULL-PAIR-20261112.md)、[固定产物](https://github.com/dbvv1/FPS-Like/tree/c7936ff9231bd2755bedcd062f83cfe41e841d70/docs/quality/capture/B-FPS-DEFAULT-FULL-PAIR-20261112/658b2e592c61-r2)。原图与五浏览器日志核实于2026-11-12；[原调用清理汇总](https://github.com/dbvv1/FPS-Like/blob/8afe767e1a68257f635a03946f616895808d999b/docs/quality/capture/B-FPS-DEFAULT-FULL-PAIR-20261112/receipts/658b2e592c61-r2-original-call-cleanup.json)补核于2026-11-13。
