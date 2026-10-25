# Memos 云环境浏览器验收：入口阻断

核实：2026-10-25 UTC。结果：**真实产品浏览器验收未完成**；普通 Chromium 启动失败，已停止该动作，未尝试改 sandbox、权限、网络或浏览器 flags。

## 已完成

- GitHub 实时核对 [Draft PR #6502](https://github.com/usememos/memos/pull/6502)：open、draft、未合并，head 为 `00d217067504e2b912bfd418199eef69d23a3c6a`，base 为 `0bfa31e89ec550c7cc6a1dea3888af2d0de107c2`。
- 独占克隆 `dbvv1/memos`，detach 固定 head；`git rev-parse HEAD HEAD^{tree}` 退出 0，tree 为 `2aee2961366e603f0ab00166c5609254a5a31cab`；工作树干净。改动为 60 文件、+768/-17。本次没有产品源码修正。
- 已读产品 `AGENTS.md`、MemoEditor README，以及官方 [贡献指南](https://usememos.com/docs/development/contributing) 和 [testing 指南](https://usememos.com/docs/development/testing)。后者要求行为变更用构建后的真实应用 smoke。
- 已读 [原工程报告](memos-reading-adoption.md)，直接复用最终定向 7 文件／72 测试、类型、lint、build 和既有 AI 独审结论；没有重跑整套。独审已确认 raw 列表过滤、受控 worker 参数及最后焦点修复的工程证据；真实浏览器仍在其覆盖范围之外。
- a1dbv 已 fetch 全部远端，交接分支从新 `origin/main` 的 `204a97db24f79954ddf71809fe549b432c824728` 建立；没有合入旧历史、覆盖原工作树或改正文。

## 失败动作与准确状态

| 动作／目标 | 命令或入口 | 结果 |
| --- | --- | --- |
| 版本查询 | `node --version`、`pnpm --version`、`chromium --version` | 退出 0：Node v24.19.0、pnpm 11.25.0、Chromium 154.0.8037.57（Debian 13 trixie） |
| Playwright 版本查询 | `python -c 'import importlib.metadata as m; print(m.version("playwright"))'` | 退出 0：1.62.0 |
| 普通浏览器启动 | 下方 Python 原调用，目标是系统 Chromium 的 sandboxed headless 进程 | Python 退出 1；子进程 SIGABRT；未到 `about:blank`，无产品导航 |
| 前端依赖安装 | 在固定源码 `web/` 执行 `pnpm install --frozen-lockfile` | 退出 254；ENOENT，默认用户目录下的 pnpm store 路径无法创建；没有改用户级配置或另换安装路径重试 |
| Go 版本预检 | `go version` | 退出 1，`Go: Unknown option: version`；环境的系统 `go` 不是可用 Go 编译器。未下载替代工具链 |

浏览器原调用（**仅供保留复现，不是本次重新执行指令**）：

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(
        executable_path="/usr/bin/chromium",
        headless=True,
        chromium_sandbox=True,
    )
    print("Browser version:", b.version)
    page = b.new_page()
    page.goto("about:blank")
    print("Normal sandboxed browser launch: PASS")
    b.close()
```

工具原始输出的决定性摘录：

```text
chrome_crashpad_handler: --database is required
FATAL:sandbox/linux/suid/client/setuid_sandbox_host.cc:172
The SUID sandbox helper binary was found, but is not configured correctly.
Rather than run without sandboxing I'm aborting now.
process did exit: exitCode=null, signal=SIGABRT
playwright._impl._errors.TargetClosedError: BrowserType.launch:
Target page, context or browser has been closed
```

这是实际浏览器自身中止，**不是自动审批拒绝，也不是执行结果不确定**。本次没有发起提权请求或修复 wrapper；没有尝试禁用 sandbox、更换浏览器或连接外部入口。源码、文件整理与交接继续完成。

## 未运行的验收范围

没有本轮 SPA/Go 构建、服务、SQLite 初始化、账号、memo、浏览器 UI、请求捕获或截图。以下均为**未运行**：匿名列表／详情开关可达；block 与 raw 两条过滤路径；嵌套未完子任务保留父项；刷新偏好；Tab／Space 及真实消费者的焦点保持；阅读开关无写请求且原文不变；编辑与分享图片包含完整原文。不能将旧组件测试、父会话 API 检查或此次版本查询算作通过。

没有发现真实产品缺陷，因为没有进入产品。没有新受检行为变化，本轮不新增独审，也不重复旧代码审查；没有新开 PR、改 ready 状态、部署、改权限或签协议。

## 恢复入口

恢复条件是平台提供普通可运行的 sandboxed 浏览器入口，以及可用的官方 Go 1.27.2 和项目依赖安装入口；不是由本任务调整安全设置。只有 materially new 的环境可用证据出现，才重试已失败动作。

下面是固定源码的官方构建／启动入口，**未执行，不是已验证脚本**。正常环境需先按锁文件安装依赖，并通过浏览器预检，再继续。不能在当前阻断状态直接重放。

```bash
git clone https://github.com/dbvv1/memos.git memos-browser-acceptance
cd memos-browser-acceptance
git fetch origin reading-mode-prototype
git checkout --detach 00d217067504e2b912bfd418199eef69d23a3c6a
git rev-parse HEAD HEAD^{tree}
cd web
pnpm install --frozen-lockfile
pnpm release
cd ..
go build -o ./memos-acceptance ./cmd/memos
./memos-acceptance --addr 127.0.0.1 --port 8081 --driver sqlite --data ./acceptance-data
```

seed 入口：首次启动 UI 的合成管理员注册，再用正常新建 memo UI 创建两条 PUBLIC 假 memo；正文逐字取 [固定夹具](memos-cloud-browser-seed.md)。本轮只保存夹具，未创建账号、未实现或运行自动 seed。

浏览器测试入口：在同一正常环境访问 `http://127.0.0.1:8081`。匿名浏览器先从列表进入两条详情，记录开关前后可见条目、原始 memo 响应、全部请求／响应及截图；开关仅写浏览器偏好，刷新后保持，另一个新浏览器上下文默认关闭。登录后在 block memo 开启过滤，用真实 Tab 聚焦未完成父项并 Space 勾选，验证父项因未完子项仍显示、同一任务新复选框保持焦点，并单独记录该合法勾选写入；随后打开编辑和分享图片 UI，核对完整原文。只读开关阶段与主动勾选阶段分开判定请求。此为待执行步骤，未形成自动化产品验收脚本或 HAR。

固定工程补丁仍是 `experiments/memos-reading-adoption.patch`，SHA-256 为 `48f4092ccf36f8337a9ceabc1f8bb2c149702b038b207e1a4e3db8af12fda5d3`。没有新增产品 patch。
