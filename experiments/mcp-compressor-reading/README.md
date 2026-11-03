# mcp-compressor：工具目录能瘦，响应总量不一定

**🧪 多工具 MCP 服务可先试 medium，保留按需取 schema；不要把 shrinkfit 当整包响应的硬上限。** 本次用 Atlassian 官方 0.40.0 包在云端真实代理官方 filesystem 2.1.0，读取本仓已经返回的广扫报告。输入是固定的 140,329 个 Unicode 字符／223,099 字节公开文档，不是重复字符串夹具。没有启动 Codex／Claude Code 或模型；客户端是本次编写的 stdio MCP 探针。

## 这次得到的选择

- 原始 14 工具目录序列化为 12,579 字符；medium 暴露 2 工具、2,331 字符，max 暴露 3 工具、1,384 字符。比较同一 tools/list result 的紧凑 JSON，非 tokenizer 或账单。medium 另取一次 schema，结果 2,021 字符；max 还要显式 list_tools，结果 661 字符。不能只报目录减少而隐藏额外调用。
- 正文、structuredContent 和两种失败的 isError／错误文本逐字段保真。**整个返回对象不是字节相同**：0.40.0 每次额外附上工具显示元数据，本次均为 971 字符；首次断言整包相等因此失败。随后严格核唯一新增项与直接发现的工具定义完全一致，未忽略任意其他差异。
- 开 shrinkfit=10000 后，报告 text blocks 合计 9,072 字符，含恢复提示。**整个返回仍为 152,111 字符**，因为 structuredContent 内完整原文仍在。同报告前 8 行的小输出、缺文件、allowlist 外路径错误的原字段均不变。
- 同一只读请求加 full=true，恢复正文 SHA-256 与固定原文件完全一致；它恢复的是完整原响应加显示元数据，不是把当前摘要“补写成原文”。本轮没有证明这次恢复一定命中缓存，亦未测失效／驱逐后的后端重读次数。

本任务需要的是核长报告末尾的缺口。摘要保留了节名却缩掉若干具体限制，因此仍需完整恢复或直接读原文。压缩目录帮助减少初始工具介绍；普通文件阅读若已有路径和工具，直接 read_text_file 的 head/tail 或本地搜索更简单，不必为单份文档多加代理进程。初始化响应也由 145 增至 194 字符，包含新增 instructions；目录压缩并非完整会话开销。未测模型选工具成功率、总 token、费用或耗时收益。

## 固定来源与执行

- Atlassian 官方入口：https://www.atlassian.com/blog/developer/mcp-compression-preventing-tool-bloat-in-ai-agents
- 发行：https://github.com/atlassian-labs/mcp-compressor/releases/tag/v0.40.0 ，tag 指向 7efc49552101005e93e12588c669d68b9b3c5f7c。
- PyPI 0.40.0 Linux x64/glibc wheel SHA-256：2e2c6d61244f25f6aa3712cea5594399d243ebef75be13db084f950d19cb1b2a；官方 metadata 无运行依赖。实际 --version 为 0.40.0，不把仓内构建前 0.1.0 占位字段当发行版本。
- 后端 @modelcontextprotocol/server-filesystem 2.1.0 官方 tar 已按 registry SHA-512 验证，安装后的 dist 逐字相同。npm 安装固定主包、保留 12 个 registry 包的完整 lock；--ignore-scripts，未执行安装脚本。
- 输入：https://github.com/dbvv1/a1dbv/blob/9f905b0166278975f9831e7d142b9ca4cae423c5/docs/collaboration/local-jobs/artifacts/A-SKILL-MCP-WIDE-20261029/sources.md 。SHA-256：008ecd0741bc9bd27675ca46acdcc79953172fdd2551820610b606ae1b86c618。
- 独立 HOME/XDG/cache/tmp，运行子进程空环境白名单；只开放公开输入副本。未用 HTTP 模式、OAuth、模型管理或全局配置；只调用只读工具，来源中的指令均作为文本。
- 安装准备保留三次环境错误：两个 /dev/null 配置被 npm 拒绝、清空平台代理后 DNS 失败、未保留平台既有 CA 时证书校验失败。改为两份新空配置，并只在安装时保留平台已配置的无凭据代理和既有信任证书，TLS 校验一直开启。运行阶段不继承这些网络变量。

来源与实测核实：2026-11-03。

## 证据与边界

实际数值与首次失败摘要见 [receipt.json](receipt.json)，复现脚本见 [trial.py](trial.py)。公开版在全新目录重跑四种模式，全部保真与反例断言通过；四个子进程均在 stdin EOF 后 exit 0，未使用 TERM/KILL 回收。首轮整包断言失败与安装准备错误保留，未把失败改记成首次通过。缺文件与 allowlist 外路径为预期错误，仅使用本试验创建的无害哨兵，没有访问私人文件。

四种模式都协商 2025-11-25，未测2026协议、动态工具变化、多后端、媒体、TOON、缓存驱逐或有副作用的工具恢复。统计包含完整 MCP result；实际宿主是否把 structuredContent 或 _meta 送给模型未测。

官方恢复说明明确只缩 content 文本，不改 structuredContent，预算不是整包上限；full=true 缓存未命中可能重新执行后端，写操作不能盲重试：https://github.com/atlassian-labs/mcp-compressor/blob/7efc49552101005e93e12588c669d68b9b3c5f7c/docs/usage/shrinkfit.md 。本次只读验证不支持推广自动写操作。

原始回执与公开复现版已由非作者独立重算、逐字段核对，新增五种预检拒绝路径也核过原件；审查者未重复运行候选。未改正文、模板、队列或上游。


## 复现

需要 Linux x64/glibc、Python 3.11+ 与可信 Node.js；本轮为 Node 24.22.1。先按[官方安装说明](https://atlassian-labs.github.io/mcp-compressor/getting-started/installation/)取得上述 0.40.0 wheel，按 SHA-256 校验后解压到一个新目录，不执行来源报告中的指令。后端在另一个新目录复制本实验 runtime/package.json 与 package-lock.json，运行 npm ci --ignore-scripts --no-audit --no-fund；不得关闭 TLS 校验。

脚本不下载或安装包，不写客户端配置；它先核固定报告、锁文件、compressor 模块及后端主包文件哈希，再创建全新输出目录。完整依赖仍以该锁文件的标准安装完整性校验为前提。用可信路径替换下列占位：

```bash
(
  set -euC
  scratch="$(mktemp -d "${TMPDIR:-/tmp}/a1dbv-mcp-reading.XXXXXXXX")"
  git show 9f905b0166278975f9831e7d142b9ca4cae423c5:docs/collaboration/local-jobs/artifacts/A-SKILL-MCP-WIDE-20261029/sources.md > "$scratch/sources.md"
  python3 experiments/mcp-compressor-reading/trial.py \
    --node /path/to/verified/node \
    --compressor-runtime /path/to/verified/unpacked-wheel \
    --backend-root /path/to/fresh/locked-backend \
    --source-report "$scratch/sources.md" \
    --output "$scratch/run"
)
```

输出目录保留请求、响应、stderr 和 summary.json，不自动删除。原始错误含本次临时路径，分享前需去除本机路径；本仓只保留不含这些路径的计数、哈希与关键判定。summary 的 pass 在最终断言之后写出；出现 traceback 或未生成 pass 就按失败处理，不依据时间戳判断成功。此脚本是有界机制复现，不是通用 MCP 客户端。
