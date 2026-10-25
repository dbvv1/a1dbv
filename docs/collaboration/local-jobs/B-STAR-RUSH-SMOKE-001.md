# B-STAR-RUSH-SMOKE-001 · 接收既有浏览器 smoke 的真实运行结果

id: B-STAR-RUSH-SMOKE-001
owner: dot-B
status: running
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 8de570ab2822c673ec7bb3a190ae18c85a57a417
result_branch: relay/b-star-rush-smoke-001

## 现有产物与要补的缺口

使用固定提交 `8de570ab2822c673ec7bb3a190ae18c85a57a417`，tree `3a69e97e6c9a7b648b3f6b50f4bbfa33c8f243da`，父提交 `8b2af1de1a7a2353a2fa46c86a3ad235ce382b58`。现有smoke实现、28项Node单测及清理独审已完成，可复用；缺的是真实浏览器启动、WebGL2渲染与赛中行为，不重新搭同一smoke。派单a1dbv基线 `e6b38dda83f4ea3196212f3f4488465c22afd415`，本任务首次派发；接收前重核两仓已有任务／分支／调用，同项已执行则续接结果，不重复启动。

dot云端对官方Chromium完整包及同版本headless-shell的下载均收到HTML Site Unavailable，已停止该下载源；不要求换代理／镜像或重复云端探针。用户已明确允许把此验证派给既有本地模型协作通道。宿主在自身已授权可用环境执行，若仍无浏览器就交具体依赖缺口和停止条件，不能把安装失败换成通过。

## 运行合同

先读该固定版本的AGENTS.md、docs/brief.md和docs/browser-smoke.md。环境Node24＋、Python3；按锁文件`npm ci`。优先复用宿主已有匹配浏览器，确需安装时沿官方 `npx playwright install chromium --only-shell`；不改变栈／浏览器版本绕过问题。运行 `npm run smoke`，保存命令退出与实际输出，失败保留首个原因及已到阶段。

仅loopback随机端口、内存SQLite和合成数据；不连接生产D1、真实账号／云库，不上传成绩、不部署、不外发截图。默认 `chromiumSandbox: true`，保项目既定SwiftShader参数；用户准许的 `--no-sandbox` 仅限dot自有容器，不延伸到用户电脑／本地宿主。没有适用条件就保默认，不能为通过关掉安全边界。

应核实际断言：默认赛道倒计时结束、按W后速度>5、计时推进、真实WebGL2而非Canvas降级、画布非背景像素、console／page／request／HTTP错误为0。交实际smoke输出中的 `report.json`、`race.png`、`canvas.png` 路径／证据；没有截图就写未到截图阶段，不凭Node测试冒称渲染通过。截图仅本次验证材料，按仓库既定产物规则留存，不擅自推公开图或外发。

## 必要修复与交接

本项只验证现有实现；发现真实脚本或清理缺陷可在指定独立结果分支做必要定向修复，保原失败并重跑对应断言。不改驾驶手感、素材或游戏玩法，不降断言、不跳过阶段、不以Canvas替WebGL2。脚本未变则复用原28项单测与独审，不再全文审查；有代码修改则补对应回归并由非作者作差量审查。实现者不能自写宿主独审回执。

仅使用既有local-jobs协作会话与已配置模型的普通原生Workflow，不创建cloud_threads、不直接操作用户电脑、不新建凭据／付费／权限／模型权重、不运行Unity／Unreal。其他具体旧拒绝独立保留，不换路绕过。产品只发布指定独立结果分支，未改代码时引用上述固定SHA和真实验证结果即可，不制造空提交；不写master，不部署。任务认领／回执按a1dbv既有串行流程与负责人协调。

回写 `review_ready` 或具体 `blocked`：完整产品SHA、依赖环境、实际命令及退出码、报告与两图是否产生、各断言实际结果、已复用单测／审查、必要修改和剩余待验。交dot-B接收；浏览器自动通过仍不证明驾驶手感、画面或听感已由人验。不修改其他任务或共享TASKS。

## 当前产品基线补充（2026-10-26，同一任务续接）

Star-Rush 已按用户要求从源重建 Kenney 并合入 master `af569f88309a31c9000965eb879b079ff9955631`，默认已启用 Kenney。原smoke固定 `8de570ab` 基于旧 `8b2af1de`，仅验证旧树不能作为当前产品通过。接收端先在**独立结果／集成分支**保留新master的源资产、许可、默认及其他改动，再合入原smoke七个文件；核差异不回退Kenney，`npm run build` 后对该真实最终树执行原运行合同，回报完整集成SHA／tree及实际浏览器结果。不写master、不重传旧 `10f5f90`，旧壁画不在范围。

本补充核a1dbv main `bb7a475b3e4ccfc958745fc7cdcc2a2692b774be` 尚无此任务认领／回执，仅见初始任务分支。接收时再核原调用；如果旧固定smoke验证已经在执行，继续读取原结果并保留，随后仅对最终差量合树重建／再验，不重启动同一单元、不另开002。旧Node测试和独审可按未变范围复用；最终浏览器通过必须指向保留Kenney的新集成树，听感仍属人工待验。初始任务来源 `805136912b93a2523cc6969b2086dac7dbbd36c1` 与其他限制不变。


## 宿主认领（2026-10-26）

来源 `dot-b/tmp/20261026-star-smoke-integration-feedback` 固定 `4bec0b683f2d8a78ee13a1ccb816f8a19d4ae6f4`，只导入本任务。已核现有队列／分支／原调用，未见同任务执行或结果；保所有其他在途原调用。成功快进发布认领后才启动配置好的 Claude Code＋DeepSeek 普通原生 Workflow，实施者只写独占产物与本任务，宿主串行回执与必要独审，不代负责人接收。产品只指定结果分支，不默认分支合入或部署。
本项固定基线按补充走保留 Kenney 的 af569f8 集成树，再接入原 smoke；不重建另一套测试，不重传旧产物，不读取真实用户profile／账号／云库，不关闭本机sandbox，不外发截图。

**执行事实询问（dot-B，2026-10-26）：** 当前只见认领，尚无实际调用／结果回执；请沿原任务补实际启动时间、当前阶段与可交付产物，或具体未执行原因／恢复条件。若原调用在途直接续接，不重派；真实浏览器结果仍须指向保Kenney的最终集成树。
