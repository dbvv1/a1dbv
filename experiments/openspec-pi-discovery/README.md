# OpenSpec 跨客户端安装：消除 Pi 冲突，保留技能和命令

**已同时配置 Pi 与 Codex 时，在 Pi 的项目设置里窄排除 `.agents` 的 OpenSpec 副本，保留两个生成目录。** 不手删会被更新重建的文件，也不把“没有警告”当成加载成功。直接配置见[读者入口](../../docs/decisions/skills-and-plugins.md#openspec-pi-discovery)。

自然消费者是 [OpenSpec #2180](https://github.com/Fission-AI/OpenSpec/issues/2180)：使用者在 1.15.0／macOS 报告每次启动 Pi 都有六条同名警告，手删后 `update` 又生成；原帖没有 fresh-project 复现。以下由本仓在 Linux 用正式包生成新项目重放，不是报告者的原项目或 macOS 实测。维护者只[表示将转向共享目录](https://github.com/Fission-AI/OpenSpec/issues/2180#issuecomment-6535807358)，当前没有已发布闭环证据，不另写迁移补丁。

## 哪种选择保留原入口

Node 24.22.1，Pi **1.4.0**；OpenSpec **1.15.0、1.16.0** 各跑下表八个条件，结果相同。默认 core profile 生成六个工作流；不是所有 profile 的固定数量。

| 条件 | 有效 OpenSpec Skills | 同名冲突 | Pi `/opsx-*` prompts | 自动描述 |
|---|---:|---:|---:|---:|
| `init --tools pi,codex` | 6 | 6 | 6 | 6 |
| 暂移 Pi Skills，再执行普通 `update` | 6 | 6 | 6 | 6 |
| Pi 版全部加 `disable-model-invocation: true` | 6 | 6 | 6 | 0 |
| Pi 设置 `!skills/openspec-*` | 0 | 0 | 6 | 0 |
| Pi 设置 `!**/.agents/skills/openspec-*/SKILL.md` | 6 | 0 | 6 | 6 |
| 上一设置后 `update --force` | 6 | 0 | 6 | 6 |
| 再加入一个无关本地 Skill | 6＋1 控制 | 0 | 6 | 6＋1 控制 |
| 只 `init --tools agents` | 6 | 0 | 0 | 6 |

**冲突时本来就只有六个有效 Skill，不是十二个都进上下文。** 本例 `.pi/skills` 先被发现而胜出；两份生成内容的命令拼法不同，Pi 版用 `/opsx-*`，共享版说明 Codex／其他客户端入口。窄排除保住原生获胜内容，其他客户端仍可读取未改的共享文件。

Pi 对项目 `.pi/skills` 与项目 `.agents/skills` 分别以各自目录为基准匹配资源规则，所以看似局部的 `!skills/openspec-*` 会同时命中两边。带 `.agents` 的完整路径模式只从 Pi 的这次项目资源发现中排除共享副本，不删除文件。已有用户级、祖先目录或其他包的同名资源时，先核实际 winner／loser 路径，不外推本例顺序。

作者两版各实际运行 8 次 `DefaultResourceLoader`，加 4 次 OpenSpec init／update（Git 初始化另计）；保留每次原始输出。窄排除前后有效 Skill／prompt 的名称、路径、SHA-256 相同，强制更新后项目设置和全部原生成 Markdown 字节也相同。非作者另建项目，用自己的探针复跑 1.16.0 的原始、窄排除、更新、宽排除四条件，并从开始保留一个无关 Skill，结果一致；不是零上下文读者验收。

## 在一次性目录复跑

在本知识库根目录，用已有 Node 24、npm、Git、Python 3 和 POSIX shell 运行。安装仅进入新目录，关闭安装脚本；不用真实项目、账号或模型。保留目录以便检查，不自动清理。

```sh
(
set -eu
A1DBV=$(pwd)
TRIAL=$(mktemp -d)
mkdir -p "$TRIAL/home/agent" "$TRIAL/project"
export HOME="$TRIAL/home" XDG_CONFIG_HOME="$TRIAL/home/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export PI_CODING_AGENT_DIR="$TRIAL/home/agent" PI_OFFLINE=1
export OPENSPEC_TELEMETRY=0 DO_NOT_TRACK=1
npm install --prefix "$TRIAL" --cache "$TRIAL/npm-cache" \
  --ignore-scripts --no-audit --no-fund --save-exact \
  @fission-ai/openspec@1.16.0 @earendil-works/pi-coding-agent@1.4.0
cp "$A1DBV/experiments/openspec-pi-discovery/consumer_probe.mjs" "$TRIAL/probe.mjs"
git -C "$TRIAL/project" init -q
OPEN_SPEC="$TRIAL/node_modules/@fission-ai/openspec/bin/openspec.js"
node "$OPEN_SPEC" init "$TRIAL/project" --tools pi,codex --no-animation
node "$TRIAL/probe.mjs" "$TRIAL/project" > "$TRIAL/before.json"
printf '%s\n' '{"skills":["!**/.agents/skills/openspec-*/SKILL.md"]}' \
  > "$TRIAL/project/.pi/settings.json"
node "$TRIAL/probe.mjs" "$TRIAL/project" > "$TRIAL/after.json"
node "$OPEN_SPEC" update "$TRIAL/project" --force
node "$TRIAL/probe.mjs" "$TRIAL/project" > "$TRIAL/updated.json"
python3 - "$TRIAL" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
before, after, updated = [json.loads((root / name).read_text())
                          for name in ('before.json', 'after.json', 'updated.json')]
assert len(before['skillDiagnostics']) == 6
assert after['skillDiagnostics'] == []
assert len(after['skills']) == len(after['prompts']) == len(after['formattedSkillNames']) == 6
assert before['skills'] == after['skills'] and before['prompts'] == after['prompts']
assert after == updated
print('六个原生 Skill 和六个 prompts 均保留；更新后加载结果相同。')
PY
printf 'Evidence directory: %s\n' "$TRIAL"
)
```

上面的覆盖写入只用于新建夹具；真实项目应将条目合并进已有数组。回到真实 Pi 使用时沿其正常项目信任流程，不借探针信任陌生代码。探针只对所给夹具显式传入 `projectTrusted: true`，不保存信任配置；隔离 HOME／agentDir，加项目 `.git` 截断祖先发现。它调用公开 `SettingsManager.create`、`DefaultResourceLoader.reload/getSkills/getPrompts` 和原版 prompt 格式化器，未替换发现实现；不启扩展、主题或上下文文件，也不创建 Agent／session。`disable-model-invocation` 的对照只测自动描述，未执行显式技能命令。

## 来源与验证范围

- [Pi 官方 Skills](https://pi.dev/docs/latest/skills)、[资源设置](https://pi.dev/docs/latest/settings#resources)：发现目录、冲突和资源排除契约。
- 固定 Pi `35dfa757…` 的[真实目录发现](https://github.com/earendil-works/pi/blob/35dfa757378bd7a8570670e99c2687bdd1039a06/packages/coding-agent/src/core/package-manager.ts#L2593-L2657)、[匹配器](https://github.com/earendil-works/pi/blob/35dfa757378bd7a8570670e99c2687bdd1039a06/packages/coding-agent/src/core/package-manager.ts#L715-L790)、[碰撞与描述过滤](https://github.com/earendil-works/pi/blob/35dfa757378bd7a8570670e99c2687bdd1039a06/packages/coding-agent/src/core/skills.ts#L348-L454)。
- 固定 OpenSpec `27c05157…` 的[安装目标](https://github.com/Fission-AI/OpenSpec/blob/27c0515724decc633818c735ee596481eec78a8b/src/core/config.ts)、[更新实现](https://github.com/Fission-AI/OpenSpec/blob/27c0515724decc633818c735ee596481eec78a8b/src/core/update.ts#L288-L435)、[Pi prompt adapter](https://github.com/Fission-AI/OpenSpec/blob/27c0515724decc633818c735ee596481eec78a8b/src/core/command-generation/adapters/pi.ts)。这些主干只读；实际运行的是上述 npm 正式包。
- [实测结果](results.json)保留版本、各条件计数、有效资源／冲突路径与哈希；两项目均为 MIT，未复制生成的 Skill 正文。

核实与实跑：**2026-10-31 UTC**。本轮定向覆盖工具官方文档、双方实现和真实用户报告；HN／中文社区搜索未获得额外近期同题原文，不据此估计普遍性。未运行模型、Pi TUI、技能工作流、Codex 客户端、macOS／Windows，也未测质量、费用或 token 收益。新上游迁移落地后，先重核其安装与更新行为，再决定是否移除此项目排除项。
