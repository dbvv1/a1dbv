# Git 对象交付备料：先固定最终树，再取对象

**能用原生 `git commit`／`git push` 就沿用；只有必须通过已授权 Git 对象 API 交付时，才用这份离线清单辅助备料。** 它让 Agent 从固定 Git 对象取路径、mode、SHA 与完整目标树，不从截断的工具摘要重建正文。发布、主干前移及不明结果处理仍按[运行细则§1](../../docs/collaboration/operations.md#1-发布与恢复)，本入口不上传、不联网、不改 ref 或凭据。

## 从固定提交生成清单

先完成整合、审查和适用检查；把实际发布基线、最终提交、之前已备料的提交分别固定成完整 SHA。`--known-ref` 可重复或省略；它只是比对旧快照，**不证明其中对象已上传到同一远端仓库**。

```bash
# 在知识库根目录运行；目标仓库另用 --repo 指定。
python3 scripts/prepare_git_delivery.py \
  --base "$BASE_SHA" --head "$TARGET_SHA" \
  --known-ref "$PREPARED_SHA" > delivery.json
# 仅在上一条退出 0 后读取 JSON。需要所有目录／文件记录时另加 --full 并落盘。
```

默认输出最终 commit／tree、目标条目总数、base 是否为 target 祖先、路径差量和变更 blob；`--full` 另给完整目标清单。不要把完整树倒进模型上下文，只读本次差量和待核对象。退出 2 表示输入／Git 读取失败，不会留下半份 JSON；输出文件应使用本次独立文件名，不覆盖上次可用备料。

`base_is_ancestor=false` 时不能把 target 当作该基线的快进交付；先按既有流程整合主干，再重新生成。两个提交 SHA 不同但 `head.tree` 相同，只说明文件树相等，不说明提交身份、父链或远端发布状态相同。

## Agent 怎样使用变更 blob

`changed_blobs[].same_object_in_trees` 只回答“这些字节是否出现在给定旧树中”。按下面的最小分支处理，别把本地对象相等与远端对象存在合成一个绿灯：

```text
目标 blob SHA 与旧快照相同
  同一远端仓库的对象已核实 → 复用 SHA
  远端尚未核实             → 先回读，不能凭 known-ref 继续
目标 blob SHA 不在旧快照
  从最终 SHA 取原始字节 → 核身份／远端状态 → 只补确实缺少的对象
```

需要正文时用 `git cat-file blob "$BLOB_SHA" > "$BLOB_SHA.blob"` 保存原始字节，再用 `git hash-object --no-filters -- "$BLOB_SHA.blob"` 对回清单 SHA；不要让模型从 diff 或摘要拼文件。清单始终标 `remote_presence_checked=false`：远端回读、上传确认与最终 tree／父链核验由已有发布流程完成。不明结果先查状态，不盲重试。

## 支持范围

| 情况 | 清单怎样表示 |
|---|---|
| 删除、重命名 | 删除为 `after: null`；重命名按旧路径删除＋新路径添加，不猜相似度 |
| executable／仅 mode 改变 | 保留 `100644`／`100755`；mode 改变可仍是同一个 blob |
| 符号链接 | `120000` 的 blob 是链接目标文本；不读取目标文件 |
| 二进制或非 UTF-8 **内容** | 只列 blob SHA／字节数，不解码、不把内容塞进 JSON；后续取字节不变 |
| 空目录树、gitlink | 完整清单保留 `040000`／`160000`；gitlink 只记引用，不读取外部仓库 |
| 含换行／制表符的 UTF-8 **路径** | 原生 NUL 分隔读取，JSON 转义保留；非 UTF-8 路径明确失败，不替换成错误路径 |
| 脏工作树／未跟踪文件 | 不纳入；仅读取选定提交的 Git 对象（含 worktree 共用的对象库） |

`changes` 包含目录树节点的变化，是核对材料，**不是可直接转发的 create-tree 请求体**。helper 不替代 GitHub 的删除、嵌套树和对象类型约束，也不验证提交已获审查或内容可公开。只读实现由原生 `rev-parse`／`ls-tree`／`merge-base` 组成，不装新平台。

## 本仓真实边界与回归

2026-10-26 的实际交付：本地最终 `5f405df6eefdb976657d3ec4153e4b8bbc85bf57` 与[远端 `d6e9f162`](https://github.com/dbvv1/a1dbv/commit/d6e9f1625be2ac73e212674346f1155fb1fbc3dd)同为 tree `29945be2b3cb9bf87b173e5787c3e78722a05077`。新正文发生在更早的 `019c889`→`3dbc0b3` 合并：TASKS blob 从 `5bc84341` 变为 `7d3b37a3`；最终 `3dbc0b3`→`5f405df` 没有再次改变这份正文。

用远端父提交 `8876065e` 作 base、最终本地提交作 head、`019c889` 作旧快照，清单列出 10 个变更 blob：8 个与旧快照逐 SHA 相同，TASKS 与清理卡另 2 个不在这些快照中。完整清单 859 条，在新临时仓库用原生 `git mktree --missing -z` 重建的 97 棵树逐一相等，根树也等于远端根树；没有对源仓库写对象。这里复核的是实际 Git 内容与身份，历史 422 的原始工具日志未归档，不称重放了 API 失败或证明远端已上传。

回归入口：`python3 -m unittest discover -s tests -p test_prepare_git_delivery.py -v`。合成临时 Git 仓库覆盖合并后新 blob、复用同 SHA、删除／mode／链接／二进制／路径、空树／gitlink、缺输入与失败；这些是 helper 回归，不冒充生产日志或模型收益。

依据：[Git ls-tree](https://git-scm.com/docs/git-ls-tree)、[Git cat-file](https://git-scm.com/docs/git-cat-file)、[GitHub Git trees](https://docs.github.com/en/rest/git/trees#create-a-tree) 官方契约与上述固定 Git 对象；核实 2026-10-26 UTC。
