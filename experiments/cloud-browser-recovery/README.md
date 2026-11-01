# 云端浏览器启动失败：先分清入口，再恢复目标候选

**先检查失败 shell 的本地通信能力，再使用该动作已获准的浏览器入口。** Chromium 导航前的 `socket() failed: Operation not permitted`／SIGABRT 不能单独证明所有云端浏览器都不可用，也不证明换一个 Chromium 参数就能修复。云端浏览器与代码／shell 网络是不同能力；本条不扩大权限，不启用 Actions，也不把画面任务转回本机。

## 1. 在失败的同一云端 shell 运行探针

从 a1dbv 根目录运行：

```sh
python3 scripts/probe_cloud_sockets.py
```

只用标准库，分别检查 Unix stream socket／临时路径绑定、显式 Unix socketpair、127.0.0.1 TCP 的创建到收发。无外网、不启动浏览器、不安装、不修改权限；资源随运行关闭。JSON 保留失败步骤与 errno，不输出临时路径。exit 0 表示这些基础检查全部通过，exit 1 表示有失败或不支持；两者都不代表浏览器或 WebGL 已验收。

| 结果 | 下一步 |
|---|---|
| Unix 的 socket／socketpair／bind 步骤为 EPERM，TCP 可用 | 本 shell 的 IPC 存在限制；保留结果，停止同条件重复启动 Chromium。检查已有原生云浏览器能力，不用参数关闭外层限制。 |
| create temporary directory 失败 | 按临时目录的文件系统错误处理，不能据此判断 socket 被禁。 |
| loopback bind／listen 为 EPERM | 当前 shell 的预览监听也受限。核已有受支持的云预览入口；不能假设另一个浏览器能访问这里的 localhost。 |
| 基础检查全部通过，Chromium 仍失败 | 核完整错误中的源码位置、实际 executable／版本和 `DEBUG=pw:browser` argv，区分浏览器进程与本 shell；不把基础探针的绿结果升级成启动成功。 |
| 不支持或其他 errno | 保留具体步骤，按实际错误处理，不统一写成权限不足。 |

读取当前会话提供的浏览器／预览工具说明，确认其实际存在、目标页面和动作已有授权、能够访问本次候选构建后，才使用该受支持入口。工具缺失就回报缺哪项能力；同一动作被平台明确拒绝时保持停止，不换入口绕过。完整原件留私有工作区，公开摘要只写阶段、errno、版本与参数，不提交私人路径、登录信息或原始敏感日志。

## 2. FPS 正式入口的已确认问题与补丁

基线为 [FPS `67ae83a7`](https://github.com/dbvv1/FPS-Like/commit/67ae83a7bd3e5c909723ba5ddda2c173bb82bd26)：

- `tools/smoke.mjs` 和 `tools/capture.mjs` 固定 `chromiumSandbox: true`，案例 AGENTS 也仍写旧限制；smoke 在启动成功后才记录 requested 配置，启动失败会丢这份证据。
- smoke 只接受旧完整入口及标准件入口，追加全场材质参数会在启动前报错。旧 capture 使用 `shot`，目标离线场景使用 `qualityCapture`，二者不能互代。
- [已发生的复验](https://github.com/dbvv1/a1dbv/commit/20b095d76fd62586bc942af0258cceede4a54c5a)报告手动使用获准 `--no-sandbox` 仍失败，所以修入口不等于修好该次宿主故障。

[fps-launch-config.patch](fps-launch-config.patch) 给 dot-B 接收：默认保留 sandbox，仅精确 `FPS_CLOUD_NO_SANDBOX=1` 启用自起 headless 案例 preview 的既有例外；capture 拒绝该开关与 `--headed`／外部 `--base` 组合。不启用 unsafe 参数，不改外层沙箱。smoke 启动前记录请求配置，并精确支持本次全场材质入口，断言材质 ready、十堵墙及两个真实替换件均接入。

在原候选的独占工作区，先保留当前改动，将 `A1DBV` 设为已有 a1dbv 检出目录，再执行：

```sh
git apply --check "$A1DBV/experiments/cloud-browser-recovery/fps-launch-config.patch"
git apply "$A1DBV/experiments/cloud-browser-recovery/fps-launch-config.patch"
node --check tools/smoke.mjs
node --check tools/capture.mjs
```

补丁冲突时按当前源码整合，不覆盖其他候选。仅在第 1 步支持当前启动方式且原动作仍获准时继续：

```sh
npm run build
FPS_CLOUD_NO_SANDBOX=1 DEBUG=pw:browser \
FPS_SMOKE_QUERY='?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1&materials=ai-courtyard-full-v1' \
node tools/smoke.mjs
```

这是已有 smoke 的精确候选接线修复。它仍只覆盖原脚本声明的功能范围，尚未覆盖完整六回合、半场换边和终局重开；最终交付须完成案例要求的完整范围，不据一次启动或这个命令的绿结果判全部通过。若改用已有原生云浏览器，也须访问同一构建并执行这些实际行为，旧网站 v21 不能替代未发布候选。

## 3. 同机位图走目标已有的 qualityCapture

目标 URL 在同一构建、同一基线参数上添加 `qualityCapture=gameplay`、`courtyard-gap` 或 `cross-lane`；before／after 只切换 `materials=ai-courtyard-full-v1`，光照和画质档保持一致。必需参数是完整 offline 入口与 `art=standards-v1`。不要混入旧 `shot/seed/t/frames/input`。

按既有接口读取 `window.__shot`，要求 ready、`mode=offline-quality-capture`、1280×720／DPR 1、同机位与同状态；目标开启时还要核 `renderInfo.materials` 的 id／state／wallIds／authoredIds。以真实非空 WebGL2 帧和 renderer 为准。固定回放截图不能替代普通操作或声音验收；画面判优、完整 smoke 与换默认规则见 [game-quality-pass §4](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md#4-同机位对比非作者判定)。

## 已检查的范围

**dot 云接收（2026-11-01）：** 实际探针为 Unix stream 创建 EPERM，socketpair／TCP 通过，未在同条件重复启动浏览器。四文件修复及 lighting 精确组合已快进原 FPS 候选分支 [`8e66087e`](https://github.com/dbvv1/FPS-Like/commit/8e66087e45393c5dc9d00bb3a7a72d9c5e697b6e)（基线 `67ae83a7`）；非 main、未部署，完整 smoke／同机位图仍未验。

补丁在上述固定源码的隔离副本通过 apply／反向检查和两脚本语法检查。受控启动失败检查覆盖默认 sandbox、显式例外、无效开关、全场材质路由及失败配置留存；原版丢配置并拒绝目标路由，补丁版通过对应检查。材质断言检出了 fallback、缺墙和缺替换件；capture 的 headed／外部 base 组合被拒。没有在本机启动浏览器，也没有在 dot 的云端运行这份补丁，云端恢复与作品效果尚待 dot-B 验证。

探针的成功、EPERM、缺失能力分支已检查；本机仅用于标准库与输出检查，不作为云端结果。核实：2026-11-02。

依据：[OpenAI 云电脑与浏览器](https://learn.chatgpt.com/docs/dots/computers-and-apps)、[云浏览器与 shell 网络的独立边界](https://learn.chatgpt.com/docs/enterprise/chatgpt-work-cloud-security)；[FPS smoke 源码](https://github.com/dbvv1/FPS-Like/blob/67ae83a7bd3e5c909723ba5ddda2c173bb82bd26/tools/smoke.mjs)、[目标拍摄路由](https://github.com/dbvv1/FPS-Like/blob/67ae83a7bd3e5c909723ba5ddda2c173bb82bd26/src/candidates/offline-training-v1/capture/quality-route.ts)、[目标消费者与可读状态](https://github.com/dbvv1/FPS-Like/blob/67ae83a7bd3e5c909723ba5ddda2c173bb82bd26/src/candidates/offline-training-v1/capture/quality-client.ts)。
