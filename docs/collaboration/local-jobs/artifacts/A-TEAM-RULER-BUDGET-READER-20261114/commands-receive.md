# 生成端与消费者复跑入口

占位符均替换为绝对路径：`ARTIFACTS` 为本目录，`RULER` 为固定源码检出，`WORK` 为全新一次性目录。先核 Ruler 提交为 `b905f192d84e340d6c9723ff8eadfa6dbc9be8b6`。不在真实项目或个人配置上运行。

```sh
mkdir -p "$WORK/project" "$WORK/home" "$WORK/xdg" "$WORK/codex"
cp -R "$ARTIFACTS/repro/.ruler" "$WORK/project/"
cd "$RULER"
npm ci --ignore-scripts --no-audit --no-fund --cache "$WORK/npm-cache"
npm run build
cd "$WORK/project"
HOME="$WORK/home" XDG_CONFIG_HOME="$WORK/xdg" CODEX_HOME="$WORK/codex" node "$RULER/dist/cli/index.js" apply --agents codex --local-only
cp AGENTS.md "$WORK/base-AGENTS.md"
cd "$RULER"
git apply --check "$ARTIFACTS/patch/0001-warn-codex-project-doc-limit.patch"
git apply "$ARTIFACTS/patch/0001-warn-codex-project-doc-limit.patch"
npm run build
npx --no-install jest tests/unit/agents/CodexCliAgent.project-doc-limit.test.ts --coverage=false --maxWorkers=2
cd "$WORK/project"
HOME="$WORK/home" XDG_CONFIG_HOME="$WORK/xdg" CODEX_HOME="$WORK/codex" node "$RULER/dist/cli/index.js" apply --agents codex --local-only
cmp AGENTS.md "$WORK/base-AGENTS.md"
cmp AGENTS.md "$ARTIFACTS/generated/AGENTS.md"
```

生成件 SHA-256 及源输入见 input-manifest.json。上述云端基线/补丁生成与比较已过；Windows 报告中的全套测试未在本次重跑。

消费者另跑，不能用生成端通过替代：

```sh
codex --version
codex debug prompt-input --help
HOME="$WORK/home" XDG_CONFIG_HOME="$WORK/xdg" python3 "$ARTIFACTS/scripts/check-codex-project-doc-limit.py" --project-root "$WORK/project"
```

脚本自建临时 CODEX_HOME，摘要不含完整输入。要求项目没有其他祖先指导，不读取真实配置。云端 0.167.0-alpha.4 本次在 sandbox helper 处失败，未取得输入；不得以失败输出冒充 Windows 0.166.0 的成功复现，也不为测试改变安全设置。脚本是这份单根合成输入的探针，不能充当任意多层项目的完整读取审计。
