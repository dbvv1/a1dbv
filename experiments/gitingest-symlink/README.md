# Gitingest 的 include 仍带入无关目录链接

**🧪 Gitingest 固定主干只选择 `packages/golang/` 时，实际得到 16 份所需源码和 14 个无关目录符号链接；已有 PR #593 的补丁保留同样 16 份源码，将无关链接降为 0。** 这是报告者指定的完整公开仓库上的独立云端验证，不是新造小仓库或重新开发补丁。

这一反例补充了已有的[旧分片回流](../repomix-split-input/README.md)和[编码漏文件](../repomix-encoding/README.md)：这里没有旧输出或编码问题，而是目录链接被当作“仍需遍历的目录”，提前绕过 include 匹配。**混入的只是链接路径与目标 basename，不是目标源码内容。** 对已经使用该工具的开发者，结果区分了“过滤条件已传入”和“实际包内范围符合条件”；不据此新增打包器默认。

## 原问题与本轮输入

使用者在 WebUI 中选取 `termux/termux-packages` 全仓、include `packages/golang/`，却得到其他包的链接。本轮固定完整 Termux 源 `03964fb52853ed4acc37637e27e74aca76cfa789`，共 10,766 个 tracked 路径；报告列出的 7 个链接仍存在且指向目录，本轮实际混入 14 个。

Gitingest 主干为 `4e259a02fe72115bee538271622f1234a81c8e1a`（包版本字段 0.3.1），候选为原 PR head `4859bc41e30833349ab1d3f0decf0003a4c982bc`。补丁仅在目录捷径加 `not path.is_symlink()`，附原作者的一条回归。**#593 被 stale bot 关闭，未合入；closed 不代表已发布修复。** 本轮不另开同题 PR。

## 实际结果

| 调用路径 | 原主干 | 原候选 |
|---|---:|---:|
| Web 同款 `process_patterns`＋`ingest_query` 核心 | 16 FILE＋14 SYMLINK | 16 FILE＋0 SYMLINK |
| 公共 Python `ingest`，明确对齐 Web 的 ignore 行为 | 16 FILE＋14 SYMLINK | 16 FILE＋0 SYMLINK |
| ingestion／pattern／gitignore 原生相关测试 | 13 通过 | 14 通过 |

四次真实调用均成功；同版本的两条路径输出正文逐字一致。每份目标源码全文与磁盘输入匹配，全部 tracked 输入前后 hash 不变；另将候选新增回归放在基线上运行，因无关链接仍出现而失败。完整路径、内容 hash、实际参数与测试输出见 [results.json](results.json)。原始输入中另有 3 个失效链接，两版均未收录，不计为补丁新增修复。

公共 Python 入口默认额外加载 `.gitignore`，Web 核心不加载；本次以 `include_gitignored=True` 对齐，而非把两个入口默认行为当成相同。四轮固定上限为 **243 KiB**，不是 UI 默认：当前 UI 滑块位置 243 换算为 50 KiB；16 个目标文件合计 18,554 bytes，均低于两种上限。原报告没有版本、SHA 或文件大小设置，因此不是精确重放当时环境。

**验到的是云端 Linux 的范围过滤与源码保留。** 未运行 WebUI／HTTP 路由、服务端缓存与上传、Windows、完整套件或 hosted CI；也未调用模型、完成新读者实做或证明总体 token 收益。运行环境不继承凭据，公开 tokenizer 在准备阶段下载后使用本地缓存。独立审查复算了输出、源码与输入 hash，没有独立重跑。

**依据与核实**：[使用者原报告 #585](https://github.com/coderamp-labs/gitingest/issues/585)、[现有候选及关闭原因 #593](https://github.com/coderamp-labs/gitingest/pull/593)、[固定原过滤实现](https://github.com/coderamp-labs/gitingest/blob/4e259a02fe72115bee538271622f1234a81c8e1a/src/gitingest/utils/ingestion_utils.py#L32-L41)、[Web 核心入口](https://github.com/coderamp-labs/gitingest/blob/4e259a02fe72115bee538271622f1234a81c8e1a/src/server/query_processor.py#L275-L301)、[完整固定输入](https://github.com/termux/termux-packages/tree/03964fb52853ed4acc37637e27e74aca76cfa789)。2026-11-01 UTC 核源、运行与只读独审；不新增安装或候选补丁操作指南。
