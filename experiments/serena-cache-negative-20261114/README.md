# Serena HTTP：真实符号读取后的缓存落盘

2026-11-14，补验已有 Serena #2261 / PR #2221 的退出路径。不重复投稿，不改变默认或地图状态。

## 本次能确认什么

使用公开 a1dbv main `4ac4f0f958f0644c6245aad907b57fbba0caace1` 的 scripts 副本作为真实 Python 项目。通过真实 MCP streamable HTTP 客户端调用 `initial_instructions` 和 `get_symbols_overview`，Jedi Language Server 0.47.0 返回 `scripts/check_repo.py` 的 check、main 等符号。文件 Git blob 为 `e87450043e213b8822163a874adef81054aa6bfd`。

| 对照 | 信号 | 退出前缓存 | 退出后读回 | 退出日志 |
| --- | --- | --- | --- | --- |
| 基线 ede329aaf0c824bea75455a2926f01420d7aa620 | SIGTERM / SIGINT | 两份 | 两份均含 scripts/check_repo.py | 两路均 0 |
| 候选 9c1cb3f5d79e20d23739642bbc283036a1f7249e | SIGTERM / SIGINT | 两份 | 两份均含 scripts/check_repo.py | 两路均 1 |

每路退出前后的文件大小和 SHA256 完全一致。两份缓存为 document_symbols.pkl（10178 字节）及 raw_document_symbols.pkl（2182 字节）；使用上游受限 SafePickleLoader 解码本次进程生成的文件，没有模拟缓存或手写 pickle。

**这是负对照结果：不能把退出日志 0→1 写成缓存保存 0→1。** 两个版本的正常工具返回路径都会在返回结果之前调用 `save_all_caches`（src/serena/tools/tools_base.py），所以本任务的缓存在信号发出前已保存。读者可据此区分“退出钩子被调用”和“本次符号工作已落盘”，不能据此判断进行中的请求、未完成工具调用、多客户端并发或长期缓存可靠性。此次未验证重启后命中缓存，也没有关闭自动保存来制造差异。

## 复跑

在前次候选锁定 Python 3.13.5 环境安装公开 PyPI 的 `jedi-language-server==0.47.0`（本次新增 docstring-to-markdown 0.17）。基线与候选共用依赖，用 PYTHONPATH 指向各自实际源码。

```sh
<venv-python> cache_check.py <serena-checkout> <venv-python> <public-a1dbv-checkout>
```

脚本为两路分别创建全新临时项目和 HOME / XDG_CACHE_HOME / SERENA_HOME，绑定 localhost、禁用 usage reporting / dashboard / GUI，显式 tools 接口。HTTP 客户端仅对 localhost 设置 trust_env=False，避免环境 SOCKS 代理依赖影响本地测试。真实服务结束后清理该测试进程组，最终进程核对未见本轮残留 Serena/Jedi。

原始 JSON 包含实际符号结果、退出码、前后文件 hash 和解码后的 key。初次尝试依次修正 SDK 的 is_error 命名、默认 REPL 接口、Jedi 缓存路径；失败尝试不计通过次数。最终四路均完成。

## 非作者复核

独立读者重跑候选两种信号，核两份缓存均含 17 个顶层符号（包括 reject_json_constant、record_limits、check、main），缓存所记源文件内容 hash 与输入 MD5 一致；每路前后 SHA256 / 大小一致，退出码为 -15 / -2。进程无残留仅指脚本强制兜底清理之后，不证明语言服务器自然退出。基线由作者实际跑，独立复核范围为候选。
