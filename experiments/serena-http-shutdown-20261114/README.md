# Serena HTTP 服务的退出路径

真实需求来自 [Serena #2261](https://github.com/oraios/serena/issues/2261)：共享 HTTP 服务退出后符号缓存未保存。已有 [PR #2221](https://github.com/oraios/serena/pull/2221)，本次不重复投稿。

## 实际结论

候选 `9c1cb3f5d79e20d23739642bbc283036a1f7249e` 在 Linux、Python 3.13.5 的真实 HTTP 进程中，SSE / streamable-http 各用 SIGINT / SIGTERM 停止，四路均调用一次真实 SerenaAgent 退出路径。上游基线 `ede329aaf0c824bea75455a2926f01420d7aa620` 四路均未调用。SIGTERM 两端均为 -15；SIGINT 基线为 1，候选为 -2（Popen returncode 口径）。

三份上游测试文件 `test_cli_server_shutdown.py`、`test_cli_server_logging.py`、`test_mcp.py` 运行 77 passed；其中服务循环有 mock，不称全部是真实 HTTP 测试。

本次新增脚本启动真实 CLI、真实 uvicorn 服务，见 `process_check.py`。**未激活项目、未启动语言服务器、未验证缓存文件或真实客户端会话**。结果只支持“候选补上进程退出调用路径”，不支持“已验长程缓存可靠性”。读者依赖 HTTP 缓存接续时，应在自己的项目上追加缓存文件读回；没有因此替换当前生产版本或升级地图。

## 复跑

先在候选 checkout 依贡献规则安装锁定开发依赖。脚本参数依次为需测试的 checkout、候选虚拟环境 Python（不要解析 Python 符号链接，否则会丢失 venv）。基线与候选共用相同依赖，`PYTHONPATH` 指定实际源代码。每次使用独立 HOME / SERENA_HOME、禁用 usage reporting、dashboard、GUI，绑定 localhost 随机端口；启动超时40秒、退出超时15秒，异常清理子进程。

```sh
python process_check.py <checkout> <venv-python>
```

原始机器可读结果见 baseline.json / candidate.json。初次误将 PR 的直接父提交（已含修复的 merge）当基线，发现结果相同后纠正为上游 `ede329aa`，上表和文件仅为纠正后的对照。没有修改上游源码。2026-11-14。
