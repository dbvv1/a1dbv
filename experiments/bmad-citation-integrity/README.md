# BMAD：重复编号也不能吞掉来源

**🧪 本地候选只修 BMAD #3167 的重复来源部分：同一编号重复出现时明确失败，并保留所有来源行。** 行内代码仍可能被当成引用，不能仅凭 `citations` 绿灯认定报告引用完整；本补丁不代表整条 issue 已解决。

## 先确认报告真的引用了来源

真实使用者发现：报告只有正文引用 `[1]`，但代码里的 `argv[2]` 会让未引用的来源 `[2]` 也通过；两行来源同用 `[1]` 时，检查会通过，生成 briefing 又只剩后一行。原 CLI 的三个调用均已复现这些行为。

[两文件补丁](change.patch)只改确定性检查与现有测试，不给研究提示词追加防错说明。`citations` 新增 `duplicate_rows`，重复编号退出 1。`escape-sources` 同样退出 1，但诊断中的 HTML 保留全部来源，同一编号只生成一个锚点。**调用方须先检查退出码，修正编号后再采用 HTML，不能把失败输出当成有效 briefing。** 普通来源仍按编号排序，既有 HTML 转义与 URL 校验保留。

行内代码部分曾试过手写反引号匹配与分块；独立 CLI 对照发现，它会跨标题或水平线吞掉真实引用，又会漏掉引用块中的多行代码。原生套件通过没有覆盖这些反例，因此撤回这一部分，保留原行为与未修风险。后续应评估真正的 Markdown 解析入口及其独立脚本依赖，不继续按例堆正则。

## 在独立副本使用

以下为 Bash 命令，需要 Git、uv、Python 3.11+；完整质量检查另需项目支持的 Node/npm。本次使用 Linux、Python 3.11.18、Node 24.22.1、uv 0.13.6 与 npm 11.9.0。把本目录的补丁放在当前目录，从新的源码副本开始，不应用到已有脏树：

```sh
PATCH="$PWD/change.patch"
git clone --branch dev https://github.com/bmad-code-org/BMAD-METHOD.git source
git -C source checkout e9cbe2b2962eb7ee544b1512b0e3fada7ed0144e
git -C source apply --check "$PATCH"
git -C source apply "$PATCH"
cd source
export UV_CACHE_DIR="$PWD/.uv-cache" UV_PYTHON_INSTALL_DIR="$PWD/.uv-python"
export PRE_COMMIT_HOME="$PWD/.pre-commit-cache"
export XDG_CONFIG_HOME="$PWD/.config" ASTRO_TELEMETRY_DISABLED=1
export npm_config_cache="$PWD/.npm-cache"
uv sync --frozen
uv run --frozen python -B -m pytest -n 0 skills/bmad-deep-recon/scripts/tests/test_recon_kit.py
```

用现有报告检查时，传入它的实际路径：

```sh
uv run --frozen python -B skills/bmad-deep-recon/scripts/recon_kit.py citations report.md
uv run --frozen python -B skills/bmad-deep-recon/scripts/recon_kit.py escape-sources report.md
```

`citations` 在检测到悬空引用、未被引用的来源或重复编号时退出 1，但仍有上面的代码误识别缺口；`escape-sources` 在重复编号或无效 URL 时退出 1，不能代替前一项检查。各自检查通过退出 0；缺输入等用法错误退出 2。命令不改报告文件。项目完整检查沿原入口执行；下面额外补齐原项目可选 token 计数测试的依赖，避免把缺依赖的跳过记成通过，不改项目锁文件：

```sh
(cd docs-site && npm ci)
export TIKTOKEN_CACHE_DIR="$PWD/.tiktoken-cache"
uv pip install --python .venv/bin/python --index-url https://pypi.org/simple 'tiktoken==0.14.0'
uv run --frozen tools/quality.py
```

最终两文件候选的五个新增回归配原脚本全部失败；修后相关测试 36 项、完整 Python 测试 1250 项通过，无跳过，项目 `quality.py` 的代码检查与文档站各阶段通过。非作者另跑相关测试与 47 次真实 CLI，核重复编号、来源保全、HTML 转义、退出码及输入字节未变；也确认行内代码误识别仍存在。公开补丁在固定原版应用后，两文件与被审版本逐字节一致。未运行 hosted CI、Windows 或完整 LLM 研究流程。

## 这次实际采用了哪条项目规则

新读者只以[共享指令页](../../docs/decisions/instruction-files.md)为方法指南，接着读取目标项目原生 `AGENTS.md`、贡献规范与实现。已有指令给出了 Python／Skill 检查入口，并要求测试确定性代码的结果，不用测试去断言提示词文本。因此保留原指令与 Skill 正文，直接修工具、先跑失败回归，再按原项目入口验收；没有为这一例新增 `CLAUDE.md` 或同步器。

这是任务中读取规则后的行为采用；宿主启动加载没有独立回执，也未做第二款客户端任务，不能据此认定双工具共享方案通过。机械引用完整度仍不能证明来源支持结论，原研究流程的独立来源审查继续保留。

**依据**：真实需求 [#3167](https://github.com/bmad-code-org/BMAD-METHOD/issues/3167)、固定 [AGENTS.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/e9cbe2b2962eb7ee544b1512b0e3fada7ed0144e/AGENTS.md)、[原检查脚本](https://github.com/bmad-code-org/BMAD-METHOD/blob/e9cbe2b2962eb7ee544b1512b0e3fada7ed0144e/skills/bmad-deep-recon/scripts/recon_kit.py)、[研究收尾的实际调用](https://github.com/bmad-code-org/BMAD-METHOD/blob/e9cbe2b2962eb7ee544b1512b0e3fada7ed0144e/skills/bmad-deep-recon/references/finalize.md)与本次隔离 CLI 实做。核实 2026-11-11；未提交上游。派生补丁沿[上游 MIT 许可](LICENSE)提供，保留其[贡献者](https://github.com/bmad-code-org/BMAD-METHOD/blob/e9cbe2b2962eb7ee544b1512b0e3fada7ed0144e/CONTRIBUTORS.md)及[商标说明](https://github.com/bmad-code-org/BMAD-METHOD/blob/e9cbe2b2962eb7ee544b1512b0e3fada7ed0144e/TRADEMARK.md)入口。
