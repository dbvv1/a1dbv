# 只有 shell 的 Agent：临时调用公开 MCP，再按章读结果

> 核实：2026-10-24（UTC+8）。🧪 适合没有原生MCP入口、需要一次已授权公开读取的编码Agent；已有有效原生工具就沿用，不为统一接口加一层。[经验]

**本次把 TanStack/router 的 DeepWiki 导航与正文取回，再只交出 Search Parameters 章节。** MCPorter解决的是调用入口与结果消费，不使生成的wiki成为精确版本的权威依据。后续实现仍回项目依赖和固定源码，本例没有新增Router语义结论。[本仓实试／经验]

## 最短路线

前提：Linux／Bash、sha256sum、Node24+、npm、Python3，能够访问npm与DeepWiki官方公开端点。使用新的独立试用目录；不要把下面的临时配置替换进已有客户端。先取得官方固定包：[MCPorter0.16.0](https://github.com/openclaw/mcporter/releases/tag/v0.16.0)，本轮Node24.19.0。包SHA256为`0b2c46a0a6d4c80b5cab232abd2b627591e21e8ccb03f73c2f2b008414eced4c`。[一手／本仓实试]

```bash
npm pack mcporter@0.16.0 --ignore-scripts
printf '%s  %s\n' 0b2c46a0a6d4c80b5cab232abd2b627591e21e8ccb03f73c2f2b008414eced4c mcporter-0.16.0.tgz | sha256sum -c -
npm install --ignore-scripts --no-audit --no-fund ./mcporter-0.16.0.tgz
printf '%s\n' '{"mcpServers":{},"imports":[]}' > empty.json
```

在同一试用目录保存并运行以下Python片段。它保留平台已有网络代理和CA，但不给调用进程日常HOME或客户端目录；只调用两个公开只读工具。[本仓实试：同参数、同环境白名单；代码合并展示]

```python
import json
import os
from pathlib import Path
import subprocess

root = Path.cwd()
home = root / "trial-home"
home.mkdir(exist_ok=True)
keep = {"PATH", "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "NO_PROXY",
        "http_proxy", "https_proxy", "all_proxy", "no_proxy",
        "NODE_EXTRA_CA_CERTS", "SSL_CERT_FILE"}
env = {k: v for k, v in os.environ.items() if k in keep}
env.update(HOME=str(home), NODE_USE_ENV_PROXY="1",
           MCPORTER_DAEMON_DIR=str(root / "trial-daemon"))
for key, name in [("XDG_CONFIG_HOME", "config"), ("XDG_DATA_HOME", "data"),
                  ("XDG_CACHE_HOME", "cache"), ("XDG_STATE_HOME", "state")]:
    env[key] = str(home / name)
for tool, stem in [("read_wiki_structure", "structure"),
                   ("read_wiki_contents", "contents")]:
    command = ["node", "node_modules/mcporter/dist/cli.js", "--config", "empty.json",
               "call", "https://mcp.deepwiki.com/mcp." + tool,
               "--args", json.dumps({"repoName": "TanStack/router"}),
               "--no-oauth", "--timeout", "25000", "--output", "json"]
    with open(stem + ".json", "w") as out, open(stem + ".stderr", "w") as err:
        result = subprocess.run(command, env=env, stdout=out, stderr=err, timeout=35)
    if result.returncode:
        raise SystemExit(f"{tool} failed: inspect {stem}.stderr and {stem}.json")
```

网络失败时保留现有平台CA／代理，不关闭TLS校验或自行改网络设置；超时或非零输出先诊断，不将错误正文当wiki继续消费。[经验]

此处 `imports:[]` 关闭默认编辑器配置导入；显式 `--config` 选本次配置，`--no-oauth` 禁止启动OAuth，但可能使用已有缓存，因此仍需临时HOME／XDG。实试创建了空凭据存储，entries=0，不能称零落盘。没有使用`--persist`、注册服务或配置永久MCP；也没有运行会调用问答模型的`ask_question`。[固定配置源码／本仓实试]

## 把结果变成可读输入

本轮结构结果找到 `3.4 Search Parameters`；正文JSON的`result`是带`# Page:`标题的长字符串。完整内容先留文件，再提取唯一目标章，不直接`cat`全部正文给Agent。以下解析实际响应；服务改变返回结构或出现同名章时应停止核对，不能截取第一条冒充准确定位。[本仓实试／可复制操作]

```python
import json
from pathlib import Path

payload = json.loads(Path("contents.json").read_text())
body = payload.get("result")
if not isinstance(body, str):
    raise SystemExit("Expected a text result; inspect the saved response")
parts = body.split("# Page: ")
matches = [p for p in parts[1:] if p.splitlines()[0].strip() == "Search Parameters"]
if len(matches) != 1:
    raise SystemExit("Expected exactly one Search Parameters chapter")
Path("search-parameters.md").write_text("# Page: " + matches[0])
```

实际目录调用退出0、JSON1,441字节；正文调用退出0、JSON893,042字节、52页；目标章文件18,710字节，两次成功调用stderr均为空。字节是产物识别，不是成本或质量收益；全文保存在磁盘，模型只接收摘章或所需字段。[本仓实试]

## 什么时候值得用

- **只有shell、没有合适原生MCP入口**：按已批准服务和具体工具临时调用，读取真实结果；不要先生成所有服务的Skill或CLI。[经验]
- **已有原生连接器能做同一操作**：直接沿用，MCPorter不是必要前置。[经验]
- **服务要登录或涉及写入**：本例不覆盖；停止匿名路线，回该动作所需授权，不用自动登录或其他凭据“让测试通过”。[经验]
- **内容要支持代码修改**：wiki先指路，Agent再核当前代码与版本；不要将工具调用成功等同于答案正确。[经验]

## 来源与验证范围

[MCPorter临时连接](https://mcporter.sh/adhoc.html)、[配置](https://mcporter.sh/config.html)、[0.16.0配置实现](https://github.com/openclaw/mcporter/blob/v0.16.0/src/config.ts)与[窄Skill模式](https://mcporter.sh/agent-skills.html)说明入口；[DeepWiki官方接口](https://docs.devin.ai/work-with-devin/deepwiki-mcp)说明公开仓库的免认证访问。[一手]

[实践者日用复盘](https://metasora.com/blog/mcp-server-setup-daily-use/)报告用MCPorter从CLI测试多个服务，涉及代码搜索／依赖探索；仅单人自述，不支持效率比较。[社区] 本仓选择其中“一次窄调用”的用途，未复制其多服务配置。[经验] [中文讨论第18楼](https://linux.do/t/topic/2781281/18)也将MCPorter作为CLI入口线索；本文不采纳其中“普遍替换MCP”的倾向，只在原生入口缺失时补它。[社区／经验]

本轮仅官方发布包、有限源码核对、两个真实只读工具调用与本地摘章；未连接用户浏览器、导入用户凭据、运行OAuth、调用写工具或比较模型。隔离进程初次漏继承平台CA导致fetch失败，恢复既有CA后同端点成功，没有关闭证书校验。配置隔离不是安全沙箱，有限源码关键词检查不等于完整安全审计。[本仓实试]

探索回执：截至10-24核官方发行／源码／接口文档、实践者原文与linux.do讨论；没有取得同任务CLI／原生MCP的成本比较，不据此排高低。[研究]
