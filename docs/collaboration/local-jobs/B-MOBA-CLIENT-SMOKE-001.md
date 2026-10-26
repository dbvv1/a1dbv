# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: revision_requested
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: d32f5d9014200c0e2d686c5d28e7a37114429f51
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

接收端已完成的 [4520ff9 实测回执](https://github.com/dbvv1/a1dbv/blob/345d8d64e063756043284f00f85b8139cdf29665/docs/collaboration/local-jobs/B-MOBA-CLIENT-SMOKE-001.md)由 B 接受，旧通过事实保留，不当成新树通过。本次仅续验最终整合候选 `b/moba-playable-integrated-v8`，固定上述 SHA、tree `1be247214b1cbd394400f907b3e8cfdb478d038a`，父 `4822f31317b3416758b0507e03a2c460991257f4`；已有96项测试、双构建与有效差量独审。原调用已结束，不重做模拟／实现、不新建任务号。先核是否已有本次领取／调用，未结束则接续。

在既有获授权接收环境取得精确提交，使用 Node >=22.12.0，执行 `npm ci`、`npm run smoke`。后者自行 build:web 并启动临时 loopback 服务；如现有授权环境缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码和具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器，不能扩到本机。

## 范围与交回

只运行现有 harness，不修改实现、素材、依赖版本、断言或跳过门禁，不重做素材与模拟。核实际 Three WebGL2 上下文、模拟 tick、真实输入／停止与镜头交互、非背景像素及浏览器错误；以固定源码现有全部断言为准。软件渲染通过也如实注明，不冒称真实硬件 GPU 或玩家手感通过。

在原任务回写精确 SHA、Node／浏览器环境、命令及退出码、实际断言结果／阻塞阶段。`tests/client/browser-smoke/reports/` 的截图与 report.json 保持接收端本地 ignored，不上传图片、私人路径或原始敏感日志；公开只给脱敏摘要。未到截图阶段写未到，不编造图像／效果。

既有独立源码审查可复用，不全文重审；由非实施作者的宿主核真实命令与报告，不能让模型自报通过代替运行。产品 main 不由本任务修改，结果交 dot-B 当前串行发布者；仅 a1 本任务认领／回执按既有流程协调快进。发现实现缺陷交回固定失败证据，由现有客户端 owner 修，不争写。

仅由既有本地协作会话使用已配置模型执行普通原生 Workflow；本任务不授权 dot 直接操作用户电脑，不新开 Codex／cloud_threads，不下载模型权重、新建凭据、付费、部署或上传成绩。保留既有明确拒绝，只暂停对应动作；loopback 测试不访问生产服务或账号。

## 当前结果与续验

- 旧 `4520ff9`：宿主真实 `npm ci`／`npm run smoke` 退出0，原全部断言及软件 WebGL2 通过；B 已核固定树／断言并接收。完整环境、时间与3项依赖漏洞提示保留在上述固定回执；不是硬件或人工品质通过。
- 新 `d32f5d9`：接收端已回实跑通过摘要，具体证据字段待补；不重跑、不将旧报告改标新 SHA。
- 运行前后核固定树和跟踪文件不变；宿主独核实际命令时间／退出／报告，原源码独审复用。若失败，交精确 failure.stage/category、notice 及脱敏字段，由现有客户端 owner 修，不自行改实现／依赖／断言。通过后交 B 唯一产品发布者；本任务不合产品 main。

## 当前结果

- 固定候选 d32f5d9 的 npm ci 与 npm run smoke 实跑退出 0，新源码要求的 contentVersion 8、真实 E 键鼠施放、snapshot zone 与 Three 效果对象、非背景像素及浏览器错误断言全部通过，软件 WebGL2 已如实注明，独立审查通过且跟踪文件未变。
- 本单元没有文件改动。
- 检查：check_public（文件） 通过；独立审查通过。
- 下一步：将固定 SHA 的脱敏通过事实交 dot-B 唯一串行发布者；本任务不合产品 main。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow。

## 修改要求

只读取本次已跑的日志／report补交付事实，不重跑 `npm ci`／smoke、不改代码、不新增审查。补实际 Node／Chromium、两命令起止时间与退出码、运行前后 SHA／tree／跟踪状态；从现存 report摘 contentVersion、initial/finalTick、effect名称／mesh数／zone对应、pixels及错误数组。报告没有commit字段就用原git记录独核，不添加或伪造字段。非实施宿主说明实际核过哪些命令输出／报告及与固定源码的对应，不能只复述模型总结；缺记录如实标未知。整合成一处当前结果，保旧4520已接受事实；不交私人路径、截图或完整日志。补齐后交B串行发布者立即接收，不另建任务或新门禁。
