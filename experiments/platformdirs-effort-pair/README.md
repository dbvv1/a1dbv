# GPT-6.2 Sol：窄修复要不要升推理档？

仅提案，未跑模型、未重放基线。由本机方向会话决定启动与验收，不替换 Sortable／uv。

**假设。** 对有明确 API 验收的窄修复，`medium` 足以保住边界；`high` 只有减少关键遗漏或返工才值得加。

| 甲 | 乙 | 两组固定 |
|---|---|---|
| GPT-6.2 Sol，`medium` | 同一 GPT-6.2 Sol，`high` | 同机器、Codex CLI 构建、Standard、tox、打包与测试解释器、依赖、权限、工具、起始提交及提示，各 45 分钟。 |

## 公开任务与启动条件

组织者用 [platformdirs #677](https://github.com/tox-dev/platformdirs/pull/677) 的修复前提交 [`17c6932e`](https://github.com/tox-dev/platformdirs/tree/17c6932e884d4e7836b37eac1637a649f15a779b)，不把 PR 链接或后续历史交给执行者。在 Linux 用同一版本的 tox（上游要求 ≥4.64.7）和依赖。[固定 tox 配置](https://github.com/tox-dev/platformdirs/blob/17c6932e884d4e7836b37eac1637a649f15a779b/tox.toml#L16-L63)用 Python 3.15 在 `.pkg` 构建 wheel，Python 3.13 在 `3.13` 跑 pytest；`-e 3.13` 不会更改打包解释器。先在原版验两者的实际版本，缺解释器或环境被跳过就不启动：

```sh
tox run -e 3.13 --skip-missing-interpreters=false --notest
tox exec -e 3.13 --skip-missing-interpreters=false -- python -m pytest -q tests
```

第一条只准备环境并打包；第二条跑原 pytest 套件、核实际执行数和结果，不跑依赖 `origin/main` 的差异覆盖检查。退出 0 或仅看到收集列表都不能替代 pytest 结果。不要给 `tox run` 追加 `-- -q`：在 tox 4.67.6 对固定配置的静态展开中，参数同时进入命令列表的两个位置，后一个位置加载失败（只解析配置，未构建或跑测试）。测试直接实例化 Unix 与 MacOS 类，不算原生 macOS 验证。再核独立对照正常、原版可触发重复、CLI 两档均可选，缺一项不启动。依据：[一手] [tox CLI](https://tox.wiki/en/stable/reference/cli.html#tox-exec)与固定配置，2026-11-24。

两组分别用不共享 Git 对象的固定检出，无远端、参考补丁、另组结果或组织者验收文件；给相同项目指令、依赖、工具和真实测试反馈，不许外查答案。新进程、空会话，串行随机顺序。只把下段交执行者。

> 修复 platformdirs 的 XDG 用户与站点路径重复。Linux／macOS 后端的 config、data API 中，只因尾部分隔符或 `/.` 造成的同一目录拼写只能返回一次；字符串结果保留首次用户拼写。覆盖目录、路径和文件查找，保持用户优先、其他目录可见，以及 `ensure_exists=True` 时消费到该目录才创建的原行为。交补丁、回归测试和本机检查结果，不改依赖或发布。

## 判法

- 组织者在两种后端 × config／data 中设置 XDG 用户路径为带 `/` 或 `/.` 的临时路径，站点路径为其等价拼写加另一个独立目录；两个目录各放同名小文件。验 `iter_*_dirs()` 去重、保首次拼写与顺序，`iter_*_paths()` 和 `find_*_files()` 保相同两项及顺序，`find_*_file()` 命中用户文件。
- 用两个起初不存在且不等价的目录做惰性对照：`ensure_exists=True`，第一次 `next()` 后只建第一个目录，继续消费才建第二个。务必重跑原套件，不能靠修改依赖或放松检查过关。
- 盲评人拿随机编号补丁，记首次／最终通过、遗漏、整单墙钟（含失败与重试）、人工复核或补救时间、输入／缓存／输出量与实扣来源。无实扣写未知，API 回算与实扣分列。超时不记完工；环境不一致或答案泄漏就标配对无效。单题不能决定默认档位；只记录它支持的任务条件。
