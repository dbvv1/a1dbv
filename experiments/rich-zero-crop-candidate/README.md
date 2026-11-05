# Rich 空裁剪候选补丁（未投稿）

对固定 Rich 15.0.0 源码，`Text("abc").right_crop(0)` 会清空 plain，却保留长度 3；`remove_suffix("")` 走同一路径。本候选让零裁剪直接返回，保留文本、样式和后续 append/join/Console 行为。只改 `rich/text.py` 两行，另增 9 项回归参数用例；不改变负数、超长裁剪语义。

## 来源与投稿边界

源码固定于 [9d8f9a3](https://github.com/Textualize/rich/tree/9d8f9a372cc5916fd4781fec207ced7ddac2f08f)，问题见 [#4246](https://github.com/Textualize/rich/issues/4246)。[sunxiuguo 的提议](https://github.com/Textualize/rich/issues/4246#issuecomment-6556746316)及 [Sudhakar7J 的提议](https://github.com/Textualize/rich/issues/4246#issuecomment-6623148054)已提出相同 guard；这里是独立实现与验证，不主张首创。

[AI_POLICY](https://github.com/Textualize/rich/blob/9d8f9a372cc5916fd4781fec207ced7ddac2f08f/AI_POLICY.md)允许 AI PR，但须维护者先批准方案、填写模板并披露 AI 来源。本次未见维护者批准，不投稿、不重复评论；仅按源码 MIT 许可保存公开补丁和验证记录。不是上游接受或已修复声明，也不进入本仓 main。补丁由 dotA 制作并经非作者独立复跑。

## 恢复与复跑

在该固定源码的干净克隆中执行（先复制本目录到克隆之外）：

```sh
git checkout 9d8f9a372cc5916fd4781fec207ced7ddac2f08f
git apply --unidiff-zero --index ../rich-zero-crop-candidate/candidate.patch
git write-tree
poetry install --no-interaction
TERM=unknown poetry run python -m pytest --cov-report term-missing --cov=rich tests/ -q -rs
poetry run mypy -p rich --no-incremental
poetry run black --check .
```

使用官方 CI 所固定的 Poetry 1.3.1 和原锁文件。Poetry 2.2.1 安装预检因锁文件一致性检查失败；没有重写锁文件来绕过。恢复树及文件 SHA-256 见 [verification.json](verification.json)。补丁使用零上下文，必须匹配固定 base；不要直接套到未知版本。

## 实际验证（2026-11-05 UTC）

Linux / Python 3.12.14，原版 956 通过、25 跳过；修复版完整覆盖率入口 965 通过、25 跳过、2 条旧 pytest-cov 插件弃用警告。文本套件 122 通过。将全部新增用例放回旧实现，恰好 4 失败、5 通过，证明非空文本的两种零裁剪路径被检测；正数裁剪和不匹配后缀对照仍通过。mypy 100 文件通过，Black 213 文件不需改动。

25 项跳过分别为 19 项 Windows 专属、5 项 Python 3.12 渲染差异、1 项 Python 3.11 之后不适用的 traceback 测试。未运行 Windows/macOS 或其他 Python 版本，不称全平台验收。非作者独立审阅冻结两文件，独立完整复跑得到相同 965/25，并额外验证边界探针。原始运行日志未纳入，以免把机器路径与环境产物公开；这里保存精确命令、统计、补丁及校验值。
