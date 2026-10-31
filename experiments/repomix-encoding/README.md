# Repomix 成功打包，三份旧编码文本却没有进入上下文

**🧪 Repomix 1.18.1 对报告者的五文件复现成功退出，但只打包两份 UTF-8 文件；三份已知 Shift-JIS、EUC-KR、GBK 文本被列为 binary 并跳过。** 相同内容的独立 UTF-8 副本打包得到五份，原文件字节保持不变。这是已执行的文件接收对照，不是未知编码自动识别或整项目迁移的验收。

这与[旧分片重新成为输入](../repomix-split-input/README.md)是两个不同问题：前者丢掉需要的文本，后者加入不需要的旧产物。两者的 CLI 都能成功退出；本次增量是公开报告中实际漏掉的路径、字节和文本核对，而不是用 token 总数猜测完整性。

## 实际输入与结果

输入逐字采用 [#1878](https://github.com/yamadashy/repomix/issues/1878) 的公开复现生成脚本，包含日文 Java 文件、韩文与中文文本及 `package.json`；不是报告者完整仓库。原报告使用 XML，本轮使用 JSON，以便直接读取 `files` 对象；没有跨格式比较 token。

| 输入条件 | CLI 退出码 | 包内文件 | binary 跳过 |
|---|---|---|---|
| 原始编码 | 0 | `package.json`、`src/Utf8.java`，共 2 份 | `src/Big.java`、`notes/euckr.txt`、`notes/gbk.txt` |
| 相同内容的 UTF-8 副本 | 0 | 原五份文件全部进入 | 没有报告 binary 跳过 |

副本仅转换三个明确路径，编码分别来自报告者的 `shift_jis`、`euc_kr`、`gbk`。执行时先严格解码并重新编码回原字节核对，再写入独立副本；没有猜编码、就地改项目或删除文件。两份 UTF-8 输入保持原字节。全部五份的副本解码文本与原文件一致，原树运行前后的 SHA-256 相同。

两次都运行官方 npm `repomix@1.18.1` 的真实 CLI，使用 JSON、树外输出、`--no-git-sort-by-changes` 和隔离配置目录，默认安全检查未关闭。每份实际入包文本均与预期解码内容一致，只归一化末尾换行；替换字符 `U+FFFD` 计数全部为 0。安全检查未报警只是此次输入的输出，不代表任意仓库可向外部模型发送。

## 可核验记录

[results.json](results.json) 保留两次调用的参数、UTC 开始时间、完整 stdout／stderr、退出码、包内路径、文本核对及运行前后文件哈希；另有包产物哈希、逐文件编码往返结果、Node／npm／Python 版本和 npm 包的 integrity。公开版本仅将执行环境绝对路径换为占位符，并附原结果文件的 SHA-256；没有把个人环境信息或整个源码包重新分发。

实际环境为 Linux、Node **24.22.1**、npm **11.9.0**、Python **3.12.14**。首次安装因默认缓存路径不可用而未完成，改用 npm 支持的工作区缓存后成功；这是安装准备错误，不是本表的产品结果。读者不应把它理解为所有尝试都一次成功。

截至核实日，最新正式发布仍为 **v1.18.1**；现有 [PR #1879](https://github.com/yamadashy/repomix/pull/1879) 仍 open、未合入，head 为 `1961bc4e9c1cf0dfb87f180cb6580a2304573a20`。新主干 `2050e90141b01a1fa40bb278f170057ff67eb157` 的源码仍在编码检测前先按 `isBinaryFile` 返回；这只是源码复核，本轮没有运行主干或候选修复，也没有重复开发该补丁。

**边界**：这份已知编码复现的 UTF-8 副本五份入包且文本一致；未知编码、真实二进制识别、整项目构建、Windows、模型效果与上下文页新读者接续均未验。本记录不新增通用转码指南或默认配置，也不补齐答案页的本机 reader 验收。

**依据与核实**：[使用者原报告及五文件生成脚本](https://github.com/yamadashy/repomix/issues/1878)、[正式版发布](https://github.com/yamadashy/repomix/releases/tag/v1.18.1)、[固定新主干读取路径](https://github.com/yamadashy/repomix/blob/2050e90141b01a1fa40bb278f170057ff67eb157/src/core/file/fileRead.ts#L112-L145)、[候选 PR](https://github.com/yamadashy/repomix/pull/1879)。2026-10-31 UTC 对照使用者原文、官方源码与正式包实跑；独立只读审查核过输入身份、结果和公开投影，不称为独立重跑。
