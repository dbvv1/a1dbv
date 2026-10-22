# Whiteboard：把评审说明钉住实际代码版本

2026-10-23（UTC+8）核实。[本仓实测] Whiteboard 0.3.4 的 headless server 不需要 Desktop：两文件、两提交的合成仓中，代码片段和调用链说明可绑定 Git base/head，保存、读取，并在服务重启后保持一致；说明语义仍需人核。

## 实际结果

- `code_peek` 与 `call_stack_diff` 保存和完整读回成功，返回的 base/head 与 Git 一致。
- 两个固定提交的文件全文与 `git show` 相符。
- 原版 diffr 返回 `start → file → complete`，成功 1 文件、失败 0 文件，实际包含新增 guest 条件。
- 不存在的文件引用被拒绝，诊断明确为 `File is unavailable at the pinned commit.`。
- 人为负例把“允许 admin 或 guest”的真实代码标成“只允许 admin、拒绝所有 guest”，仍被保存。引用存在校验不是语义判断；这不是模型幻觉实验，也不据此判产品缺陷。
- 正常停止再启动后完整快照一致，测试结束服务关闭。

适合先试需要保留、复读陌生改动解释的评审场景。这里测的是后端与代码绑定，不是自动生成调用图；图形交互、点击跳转、LSP 和模型/人工评审收益未测。

## 最小回放

前提：已下载并校验官方 v0.3.4 Linux x64 remote 包，运行环境有 Python 3、Git、POSIX 进程组及本地回环连接能力。无需再次安装依赖。

包名：`whiteboard-remote-0.3.4-linux-x64.tar.xz`
大小：57,224,312 字节。
SHA256：`073d56eb443574caf2607a58de012fb0087333a63b8c639e4a1a851509ada87a`，与官方校验文件一致。

运行 `python3 experiments/whiteboard_headless_replay.py <解包后的whiteboard-remote目录>`。脚本创建一次性合成仓和隔离状态，不改现有仓库或全局配置；保存原始证据供本机复核，最终关键检查不符时非零退出。原始状态、日志、服务鉴权文件和本机路径不要公开。

安全边界：全部 Git/CLI 子进程使用最小环境；独立 HOME/XDG/state，关闭遥测，启动前核摘要插件默认关闭；本地 HTTP 忽略代理环境。未调用 Ask、模型、login、trace、connect、share 或 Desktop。服务按自己的进程组清理，启动失败/超时也走清理。

定稿脚本已实跑：注入启动后失败，确认非零退出、服务进程组消失且 discovery 清除；另以污染的 GIT_DIR/GIT_CONFIG 与代理环境运行正常回放，全部关键检查通过。未做网络抓包，不声称已测所有外连路径。

首次跨执行调用连接失败（ECONNREFUSED），同一普通执行调用内启动并访问成功；原因未确定，未提权或修改 sandbox。

来源：[发行](https://github.com/devdotfast/whiteboard/releases/tag/v0.3.4)、[headless说明](https://github.com/devdotfast/whiteboard/blob/v0.3.4/packages/review/README.md)、[调用链结构](https://github.com/devdotfast/whiteboard/blob/v0.3.4/packages/review/src/review-api/blocks/call_stack_diff.ts)、[摘要开关](https://github.com/devdotfast/whiteboard/blob/v0.3.4/diffr/plugins/shape/summarize/plugin.toml)。
