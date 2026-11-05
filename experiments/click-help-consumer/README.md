# CLI 窄屏帮助：保住可复制的参数，不只检查行宽

🧪 **CLI 帮助验收同时检查完整参数、metavar 和真实调用；长词保持完整时，允许它超过行宽。** 本次用 Click 的公开问题和现有作者补丁做消费者对照，不另写同题修复，也不把待合并 PR 当已发布。

## 实际任务与结果

对一个接收输入路径参数、带 `--output-file-path` 的最小 Click 消费者命令，运行 35／65 列帮助和正常调用；另用公开 `HelpFormatter.write_usage` API 输出一组长参数，检查原始参数是否仍连续出现。在两列宽下分别检查一个超长连字符词。

- 基线 `6d34602f4b0668a61873af1c547bfd40cb7deffc`：六个文本检查中五个断词，只有 65 列命令帮助保留完整词。
- 现有 PR 候选 `708edcb4844c02d38dba02deab3a78e919abb9f0`：六个文本检查均保持完整。超长词有意独占一行并超过列宽；强制每行不超过预算的测试反而会拒绝这个修复。
- 两版的消费者调用均退出 0，正确解析并回显输入参数 `input.json` 与输出参数 `chosen.json`。没有读取或写入这两个文件；这是基于真实 Click API 的最小命令，不是既有业务 CLI，也不代表业务功能验收。

直接 `write_usage` 的长参数与自定义 metavar 是问题的实际入口。普通 Click usage 常只显示 `[OPTIONS]`，不能将本结果说成所有选项帮助都会断词。记录的是字符串完整性，不是原生终端字形宽度、屏幕阅读器或用户复制动作。

## 复跑

取官方仓库的两个独立克隆，分别 checkout 上述完整提交。候选提交来自 `refs/pull/3902/head`；分支会移动，先 fetch 后核 SHA，不用未来版本代替。将本目录放在克隆之外：

```sh
PYTHONPATH="$BASE/src" python probe.py > base.json
PYTHONPATH="$HEAD/src" python probe.py > head.json
```

`BASE` 和 `HEAD` 指向上述两个干净源码树；本脚本只调用公开 Click API。输出 `source` 是实际导入路径，须核它属于对应克隆；本次 Linux Python 3.12.14。比较每个 `tokens_intact` 与参数解析回显结果，预期如 [results.json](results.json)；该文件以固定源码提交替换本机路径。脚本不把已知旧版断词当运行失败，应读回每项判断。

候选原生验证使用固定锁文件：

```sh
uv sync --locked --no-default-groups --group tests
.venv/bin/python -m pytest tests/test_formatting.py tests/test_compat.py -q
.venv/bin/python -m pytest -q
```

针对性原生套件 214 项通过。首次仅 `uv sync --only-group tests` 不安装项目本身，完整套件在 collection 因缺 Click 分发元数据失败；这不是候选代码失败，也不以 `PYTHONPATH` 冒充 editable 安装。随后用上面的项目安装命令补齐，完整默认套件 2435 通过、24 跳过、1 项预期失败，31000 项 stress 按项目默认选择器排除；24 项跳过均为 Windows 专属（21 项 msvcrt、2 项编辑器路径、1 项测试器）；预期失败是既有 `test_group_chaining`。这不是完整 stress／跨平台验证。

未运行 hosted CI、Windows/macOS、其他 Python 版本、打包发行门禁或模型客户端；没有投稿或请求维护者重复处理。此为既有候选的独立消费者验证，不升级知识库页面评级。

**来源与归属**：[公开问题 #3362](https://github.com/pallets/click/issues/3362)、[现有作者 PR #3902](https://github.com/pallets/click/pull/3902)、[固定候选差量](https://github.com/pallets/click/commit/708edcb4844c02d38dba02deab3a78e919abb9f0)、[官方开发步骤](https://palletsprojects.com/contributing/quick/)。核实及实跑：2026-11-05 UTC；PR 当时 open，未合并。
