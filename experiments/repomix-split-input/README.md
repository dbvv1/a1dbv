# Repomix 越打包越大：先查旧分片是否又成了输入

**🧪 已用 Repomix 的项目遇到分块包持续变大，先看包内文件清单；出现自己的旧分片，就把已确认的产物排除，并把新输出放到输入目录之外。** 不必先调模型压缩阈值，也不为此给原本按需读文件的 Agent 新装打包器。

## 当前怎么处理

1. 核实际版本和来源。2026-10-31 最新正式版仍为 **v1.18.1**，不含 [#1921](https://github.com/yamadashy/repomix/pull/1921) 的修复；固定主干 `7d7b28bf` 已含，但其 `--version` 也显示 `1.18.1`。源码构建要核提交，不能只看版本字符串或 issue 是否关闭。
2. 查看第二次打包的 `files` 清单，寻找第一次生成的 `mycustom.1.json` 等编号产物。token 只是辅助观察，不能替代文件来源核对。
3. 暂时保留正式版时，使用**不含旧产物的干净输入副本**，输出到输入树外；已有输入树里的旧分片仍会被收进去，单改新输出位置不够。不要删除不明来源文件。

以下 Bash 命令假定已有 `repomix`，当前目录下有 `source/` 和新建的 `packed/` 两个兄弟目录；`source/` 仅含要提供给 Agent 的已授权文件，未放旧分片：

```sh
repomix --version
cd source
repomix . --split-output 200kb --style json -o ../packed/context.json
```

从 `source/` 再运行同一条打包命令。检查 `../packed/context.1.json` 等所有生成分片的 `files` 清单：原输入仍在、旧生成文件没有进来。分块大小不能小于单个输入文件所需的大小；本轮小输入只生成一片，多个分片的容量分配不是本轮验收目标。

如果必须保留旧分片在输入树里，先核它们确为生成物，再使用**精确的文件路径**排除。例如，已确认只有 `mycustom.1.json` 时，在原打包命令后加 `--ignore 'mycustom.1.json'`。不要泛排 `mycustom.*.json`：`.0`、`.01`、`.notes` 可能是读者文件。含 glob 特殊字符的输出名仍有[独立已知缺口](https://github.com/yamadashy/repomix/pull/1921#discussion_r4371305067)；这里使用普通文件名，不把这一修复推广为全部忽略规则可靠。

## 本轮实际跑到了什么

问题来自真实使用者的 [#1920](https://github.com/yamadashy/repomix/issues/1920)，不是为了测试模型编出的开发任务。以本仓固定 `30dadb4b` 的 `scripts/check_repo.py` 和 `tests/test_check_repo.py` 两份公开源码作为受控输入，跑原版 CLI；没有改 Repomix 实现、调用模型或上传源码。

| 路线 | 连续运行的包内文件数 | CLI 报告 token | 观察 |
|---|---|---|---|
| 正式版，树内 `mycustom.json`，开启 split | 2 → 3 → 3 | 3,149 → 6,781 → 10,814 | 从第二次起，`mycustom.1.json` 成为新输入，内含上一轮包 |
| 正式版，同名树内输出，不开 split | 2 → 2 → 2 | 每次 3,149 | 单文件输出能自排除 |
| 固定修复主干，同样树内 split | 2 → 2 → 2 | 每次 3,149 | 已生成分片不再进入输入 |
| 正式版，干净输入，输出到树外 | 2 → 2 → 2 | 每次 3,149 | 无需换工具即可避免这条回流路径 |
| 正式版，已有旧分片时只移动新输出 | 3 | 15,783 | 旧分片仍被打包；随后精确排除它，恢复为 2 文件 |
| 修复主干，加入 `.0`／`.01`／`.notes` 合成文件 | 5 → 5 | 每次 3,222 | 保留这三份非产物控制，只排实际编号生成物 |

共 **16 次 CLI 调用，全部 exit 0**；完整清单和输入 hash 在 [results.json](results.json)。每次核了两份输入文件未被修改、包内源码除正常移除末尾换行外与原文一致。表中 token 是 Repomix 的本地计数，不是服务端用量、费用或模型效果；文件数稳定也不单独证明内容正确。

两份固定上游源码均按原 lockfile 安装并构建成功，相关原生 `fileSearch.test.ts` 分别 **54／57 项通过**。未跑完整上游套件、Windows、MCP 客户端、watch 模式或生产项目。原报告使用 plain 输出，本轮通过 JSON `files` 对象直接核输入；没有把不同格式的 token 数互相比较。

## 复跑固定版本

本轮为 Linux、Node **24.22.1**、npm **11.9.0**。需要 Git、Node 和 npm 公共仓库访问；在新测试父目录准备两份固定 checkout，不改全局配置：

```sh
set -eu
git clone https://github.com/yamadashy/repomix.git repomix-release
git -C repomix-release checkout --detach 80b4280a9196feace092fc672dfe2b5fac62ef08
git clone https://github.com/yamadashy/repomix.git repomix-fixed
git -C repomix-fixed checkout --detach 7d7b28bf3e651e2f34a284ca9c91074edfe1b88d
for checkout in repomix-release repomix-fixed; do
  (
    cd "$checkout"
    git rev-parse HEAD
    npm ci --ignore-scripts --no-fund --no-audit
    npm run build
    npm test -- --run tests/core/file/fileSearch.test.ts
  )
done
```

`--ignore-scripts` 只跳过安装生命周期脚本；构建已显式执行。给每种路线各建一个与上述 checkout 同层的干净输入目录，复制上述两份固定源码，不把日志、依赖或前一场的产物放进去。从输入目录运行正式版：

```sh
node ../repomix-release/bin/repomix.cjs . --style json --split-output 200kb \
  -o mycustom.json --no-git-sort-by-changes
```

连续三次读取结果；另一个干净输入目录改用 `../repomix-fixed/bin/repomix.cjs` 验修复。把 `-o` 改为输入树外路径验证处理方法，去掉 `--split-output 200kb` 验单文件对照。不要在同一副本中混跑后把旧产物带入另一条件。默认安全扫描保留；本轮没有发现可疑文件，也没有据此宣称任意仓库都可直接外发。

**依据与范围**：[使用者复现 #1920](https://github.com/yamadashy/repomix/issues/1920)、[v1.18.1 发布](https://github.com/yamadashy/repomix/releases/tag/v1.18.1)、[正式版输入排除](https://github.com/yamadashy/repomix/blob/80b4280a9196feace092fc672dfe2b5fac62ef08/src/core/file/fileSearch.ts#L460-L481)、[固定主干修复](https://github.com/yamadashy/repomix/blob/7d7b28bf3e651e2f34a284ca9c91074edfe1b88d/src/core/file/fileSearch.ts#L493-L512)、[维护者保留非编号文件的说明](https://github.com/yamadashy/repomix/pull/1921#issuecomment-6399383357)。官方源码、使用者原帖和本轮 CLI 对照均于 **2026-10-31 UTC** 核实；这是输入打包的窄诊断，不改变本仓按需取回原文的默认，也不补齐上下文页的原生压缩／新读者接续验收。
