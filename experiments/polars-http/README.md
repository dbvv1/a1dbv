# Polars 升级后，CSV 为什么突然读不进来？

本例独立重放一个协议边界：Polars 1.44.2 普通 GET 能读取的 CSV，在 2.0.0 遇到错误的 HEAD 长度信息时会被视为空文件。小文件可先显式 GET、检查状态，再交给 Polars 解析；这不是大文件或远程 Parquet 的默认方案。

核实日期：2026-10-23。来源是维护者已经修复的 [QuantEcon #646](https://github.com/QuantEcon/lecture-python-programming/issues/646)，不是新发现，也没有将补丁应用到上游仓库。只运行自写的本机 HTTP 服务与合成 CSV，不访问 FRED，不读取账户或真实金融数据。

## 准备和运行

Python 3.12 可复用本次环境；需能在本机临时端口启动 HTTP 服务。自己执行以下来自官方 PyPI 的安装命令，重放器不会安装任何东西：

```sh
python3 -m venv .venv-polars-old
.venv-polars-old/bin/python -m pip install --index-url https://pypi.org/simple polars==1.44.2 requests==2.32.5
python3 -m venv .venv-polars-new
.venv-polars-new/bin/python -m pip install --index-url https://pypi.org/simple polars==2.0.0 requests==2.32.5
python3 replay_polars_http.py --python-old .venv-polars-old/bin/python --python-new .venv-polars-new/bin/python --report polars-http-result.json
```

Windows 将解释器路径换成相应环境的 `Scripts/python.exe`。脚本检查两个环境的 Polars 和 requests 版本，先决条件失败就退出非零，不启动服务器；JSON 仍记录原因。报告路径的父目录须已存在且可写。

成功时退出 0，报告 `status: passed`；任一版本、正常结果、错误类型或 HTTP 方法断言不符，退出非零并保留报告。故意的错误用例只有得到预期错误才算通过，不能把命令非零一概算失败。

## 回归检查入口

完成一次正常重放后，使用同目录的 [test_replay_polars_http.py](test_replay_polars_http.py) 检查报告及失败保护，不重复运行 24 个 HTTP 用例：

```sh
python3 test_replay_polars_http.py --python-new .venv-polars-new/bin/python --successful-report polars-http-result.json
```

检查包含正常报告的全部预期用例／版本／结果／协议、篡改数值被拒，以及缺失解释器和错误版本退出非零并保存诊断 JSON。失败探针只使用自动清理的临时目录，不安装依赖。需要测试不同位置的主脚本时，可传 `--replay-script 路径`。这是接收入口的回归，不代表再次执行完整案例。

## 读懂结果

- 正确 HEAD／range 对照：两版都得到相同的两行 Date／Float64 数据；旧版普通 GET，新版 HEAD 加范围 GET。
- 错误的零长度 HEAD：旧版仍 GET 成功，新版只发 HEAD 并报 NoDataError。
- HEAD 405 且不支持 range：新版失败。此用例同时包含两个缺陷，不能声称单独证明 HEAD 405 必然失败。
- 显式下载路径：两个版本对三种服务都只发一次普通 GET，内容一致。
- 404、非数字数值、空响应、慢响应、HTTP 200 的 HTML 和缺失 URL 均须拒绝；缺失 URL 不发生请求。解析后还检查预期列名及 Date／Float64 类型，而非把 HTTP 200 当有效数据。

固定 24 个用例，报告包含每次请求和完整接收判断。此处数值列严格类型、列名检查是本例的数据契约，不是传输修复自动提供的能力。

## 适用边界与证据

整个响应会进入内存，只适合大小已知、可承受的小 CSV。150 毫秒 timeout 是夹具演示值，不是生产建议；requests timeout 是连接／读取停顿限制，不是整次下载总时限。各子进程另有 8 秒上限。loopback 服务只支持本例需要的单范围请求，不是通用 HTTP 合规实现。

这里证明本机合成协议现象，不证明今天 FRED 是否可用，也不证明维护者事故的全部原因、线上可靠性、模型收益或上游 PR 正确性。维护者原文说明真实服务故障与既有修复；我们没有取得或重放 #647 补丁。

Polars 官方 [Skill](https://github.com/polars-inc/skills/tree/70bec73cd09722411492dfd3613c73bb6df979b8)要求核对已安装版本的 API，这有用；其主体没有 HEAD／bytes 的故障指导。本例没有为了用 Skill 把代码改成 lazy，也没有安装插件或 MCP。初始夹具误用了 `read_csv(retries=0)`，检查真实签名后已改正，这属于夹具错误，不是库缺陷。

官方版本说明：[Polars 2.0](https://pola.rs/posts/release-polars-2/)；[升级说明](https://docs.pola.rs/releases/upgrade/2/)。Polars 与其官方 Skill 为 MIT；本入口为独立编写的代码和合成数据，不复制 QuantEcon 讲义。若另行分发该讲义的改编，需遵守其 CC BY-SA 4.0，不能据本例推定数据再分发许可。
