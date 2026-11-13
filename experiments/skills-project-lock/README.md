# skills 1.8.1：同项目并行安装会丢锁项

2026-11-13，Linux／Node v24.22.1，官方 npm `skills@1.8.1`（忽略安装脚本，临时 HOME，关闭遥测）。未读取个人配置、启动模型、启用当前宿主 Skill 或向上游发消息。

## 真实问题与本次动作

上游真实使用者报告：[vercel-labs/skills #2745](https://github.com/vercel-labs/skills/issues/2745)，2026-11-12 建立，核读时 open、0 评论。其 macOS 四 Skill／多进程回执不当作本轮结果。

本次将 a1dbv 已有 `explore-frontier` 与 `write-task-guide` 的公开 SKILL.md 安装到独立项目目录，验证项目准备时可否并行安装这两个不同 Skill。只安装两个 Markdown 文件，不宣称其相对引用依赖或模型采用已经通过。

输入基于 a1dbv main，但写入本地时各多加了一个末尾 LF，不能称为远端 blob 的原字节。原始文件 blob：explore-frontier `c8f414329d4ea09e2f17072713265d0da7ed2645`、write-task-guide `f7f266759e2d859ee1b8087de2b9490d714bdee6`。`sources/` 保留实际安装输入，不修写样本；下文“逐字节一致”仅指安装结果与这些本地输入一致。

独审后重新计算身份：

| 本地输入 | 字节数 | Git blob SHA-1 | SHA-256 |
|---|---:|---|---|
| explore-frontier/SKILL.md | 3052 | `6ef7435fa50a8b8c73163b4654b9be7eaf4ea4cd` | `b64ffe6e65bb0fc3903f9479ac1fb11bdca19448abd7d175de0e8c719e5b0097` |
| write-task-guide/SKILL.md | 2043 | `71257d60cfbf315bf9992a835f7b53ddb9fd1013` | `59b7854a4246a145b108aaef1f3a4b09fb9d69be53d599fcc7d7a390394de1ad` |

两份本地输入均以两个 LF 结尾；仅在内存去掉最后一个 LF 后，分别得到上表正文列出的远端原始 blob（3051／2042 字节）。未修改来源输入、安装产物、锁文件或原始 result.json。身份更正不扩大实跑范围，也不把本地副本冒充远端原字节。

## 可核结果

| 路线 | 实际结果 |
|---|---|
| 两个独立 installSkills 并行，3 个新项目 | 每轮两调用都 fulfilled 且 failed=[]，两目录均存在、SKILL.md 与安装输入逐字节一致；第 3 轮锁文件只有 explore-frontier，丢失 write-task-guide；前两轮锁有两项 |
| 两个 installSkills 串行，3 个新项目 | 每轮两调用成功、两目录及两锁项齐全，文件逐字节一致 |
| 同一来源一次 installSkills 指定两名称，1 个新项目 | 两目录、两锁项及两个文件一致，failed=[] |

这是有限次数的可重放文件安装结果，不是竞态发生概率、跨平台保证或模型读者采用。没有复现原报告的损坏 JSON／四进程情形。

公开证据 `evidence/result.json` 保留全部 6 轮，`evidence/batch-result.json` 保留单调用。原运行现场的 `parallel-3/skills-lock.json` 和两个安装目录已由独审直接复核；失锁文件在本目录保存为 `evidence/parallel-3-lock.json`，安装目录不入库，可按下方步骤重建。没有修改上游依赖或加锁补丁。

## 实现与取舍

安装包 `dist/_chunks/remove.mjs`：addSkillToLocalLock 先 readLocalLock、合并一项、writeLocalLock；writeLocalLock 直接 writeFile。recordProjectLock 的一次调用内循环 await 每一项，但两个独立调用没有同一读改写事务。与复现一致，不能用不同 Skill 目录推定没有共享写者。

官方 [public API](https://github.com/vercel-labs/skills/blob/b716f9dc2ba36b6aa8f0080615e5a3a6caeac63b/docs/api.md) 的 skills 数组与项目 lock 行为支持同一来源单次批量安装；此固定 main 的文档不等于 npm 1.8.1 的源码版本，实跑对象以 package-lock.json 为准。

建议：同一项目需要多项安装时，一个调用按名称选择；不同来源按项目串行调用并核 result.failed、目标文件和完整锁项，别只看调用成功。多进程也应由已有项目调度统一串行，不新造全局调度器。健康已有安装不重装；不同项目未测试，不据本例要求全局串行。

## 独立复核

非作者只读确认原第 3 轮现场确有两份文件而锁仅一项，并指出本文最初把本地副本称远端原字节的错误。来源身份已按上表修正，原始样本没有改写。独立的新目录重跑 3 轮并行、3 轮串行、1 轮批量均保留两锁项；完整输出保存在 `evidence/review-result.json` 和 `evidence/review-batch-result.json`。未再次触发不否定已保全的竞态，也不支持发生率估计。

公开保全布局：`inputs/*.txt` 以 base64 保存原输入字节，解码后得到上表的精确内容，不作为自动发现的 Skill；编码只为保留末尾空行并通过 diff 空白检查，不是脱敏。解码内容也经公开扫描。`evidence/result.json` 与 `evidence/batch-result.json` 是原运行输出，`evidence/parallel-3-lock.json` 保存失锁文件。安装目录可由脚本重新产生；不包含本机依赖或个人配置。

## 复跑

需 Node.js 22.20+ 和 Python 3。将本实验目录复制到一个新的临时工作目录，进入该副本，运行以下命令；脚本拒绝复用已有运行目录，不覆盖保留证据。`npm ci` 会按公开注册表下载依赖，不启用安装脚本；后续只操作本地目录。

```sh
npm ci --cache .npm-cache --ignore-scripts --no-audit --no-fund
mkdir -p home sources/explore-frontier sources/write-task-guide
python3 - <<'PY'
import base64
from pathlib import Path
for name in ('explore-frontier', 'write-task-guide'):
  data = base64.b64decode(Path('inputs', name + '.txt').read_bytes())
  Path('sources', name, 'SKILL.md').write_bytes(data)
PY
HOME="$PWD/home" XDG_CONFIG_HOME="$PWD/home/.config" DISABLE_TELEMETRY=1 node run.mjs
HOME="$PWD/home" XDG_CONFIG_HOME="$PWD/home/.config" DISABLE_TELEMETRY=1 node batch.mjs
```

并行竞态不保证每轮出现；串行／批量结果不能单独证明上游已经修复。

缺口：本机新读者照当前答案页的第二项真实任务，以及完整 Skill 被模型采用。已有 Skills 隔离卡不重派；当前未找到独立且确实需要此安装路线的第二项本机任务，暂不为复现再造读者任务。答案页与地图尚未修改。
