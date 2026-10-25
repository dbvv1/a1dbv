# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 4520ff9d74191d3710d38ac947de9e72af51a485
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

验证上述固定候选，不重新实现客户端。原 B-MOBA-SIMULATION-001 的无画面首版已 accepted，宿主已结束并移交；本项是首次客户端真实浏览器验收，不重派模拟。先读目标仓 AGENTS、docs/brief.md 和现有 smoke 说明，核本任务是否已有领取／运行，沿同一调用接续。候选分支为 `b/moba-browser-smoke-candidate`，tree `9e95ce02d666571626ba8e8bcb614bcc46882771`。固定候选已有 72 项 Node 测试、构建及有效非作者独审；云端浏览器首启与 Restart 实见 WebGL2 Disabled，不能当 3D 通过。

在既有获授权接收环境取得精确提交，使用 Node >=22.12.0，执行 `npm ci`、`npm run smoke`。后者自行 build:web 并启动临时 loopback 服务；如现有授权环境缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码和具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器，不能扩到本机。

## 范围与交回

只运行现有 harness，不修改实现、素材、依赖版本、断言或跳过门禁，不重做素材与模拟。核实际 Three WebGL2 上下文、模拟 tick、真实输入／停止与镜头交互、非背景像素及浏览器错误；以固定源码现有全部断言为准。软件渲染通过也如实注明，不冒称真实硬件 GPU 或玩家手感通过。

在原任务回写精确 SHA、Node／浏览器环境、命令及退出码、实际断言结果／阻塞阶段。`tests/client/browser-smoke/reports/` 的截图与 report.json 保持接收端本地 ignored，不上传图片、私人路径或原始敏感日志；公开只给脱敏摘要。未到截图阶段写未到，不编造图像／效果。

既有独立源码审查可复用，不全文重审；由非实施作者的宿主核真实命令与报告，不能让模型自报通过代替运行。产品 main 不由本任务修改，结果交 dot-B 当前串行发布者；仅 a1 本任务认领／回执按既有流程协调快进。发现实现缺陷交回固定失败证据，由现有客户端 owner 修，不争写。

仅由既有本地协作会话使用已配置模型执行普通原生 Workflow；本任务不授权 dot 直接操作用户电脑，不新开 Codex／cloud_threads，不下载模型权重、新建凭据、付费、部署或上传成绩。保留既有明确拒绝，只暂停对应动作；loopback 测试不访问生产服务或账号。
