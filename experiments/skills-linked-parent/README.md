# Skill 安装成功却读不到：核父目录链接，再选 copy

**🧪 用 dotfiles 软链接管理 `~/.claude/skills`，且一次给 Claude Code、Codex 安装同一 Skill 时，先验安装后的实际路径；断链时可改用 `--copy`，不要只重复安装。** 复制会产生独立副本，后续须从同一来源重新分发更新。普通目录、只装 Claude 和直指共享根的链接在本次均正常，不建议因此全面禁用软链接。

## 真实需求与结果

使用者 #481 报告 dotfiles 父目录本身是链接时，子 Skill 的相对链接从错误目录解析。本次运行 npm 官方 **skills 1.7.4**（MIT），Linux、Node **24.22.1**；源是同版本仓库的 `find-skills/SKILL.md`。所有 HOME 都是新夹具，消费者是实际 `skills use <安装路径>`，不带启动 Agent 的 `--agent`，只读取并输出完整 Skill 正文。

| 布局与动作 | 实际安装模式 | 安装 exit | 安装路径可读 | 实际 use exit | list 的 Claude 关联 |
|---|---|---|---|---|---|
| 普通目录，Claude＋Codex | symlink | 0 | 是 | 0 | 有 |
| Claude 父目录指向更深 dotfiles，Claude＋Codex | symlink | 0 | 否，子链接悬空 | 1 | 无 |
| 上项原命令重装 | symlink | 0 | 仍不可读 | 1 | 无 |
| 同一失败现场，加 `--copy` 重装 | copy | 0 | 是，正文完整 | 0 | 有 |
| 同样 dotfiles 父链接，仅装 Claude | copy（自动选择） | 0 | 是 | 0 | 有 |
| 父链接直接指向 `.agents/skills`，Claude＋Codex | symlink | 0 | 是 | 0 | 有 |

**`list` 中有名字仍不足以验收。** 六步列表都含 `find-skills`，失败两步却是 `agents: []`；须核客户端关联、具体安装路径和完整正文。每步同时验证父链接原值、无关文件、源文件和已有 canonical 内容没有改变。非作者在新目录复跑六步一致；[结果](results.json)不含本机路径，原输出保留在各次运行目录。

单客户端会自动走 copy；两个不同安装目录在 `--yes` 下默认走 symlink。比较时必须记录实际模式，否则会把“单客户端正常”误解成同一链接路径已经修复。

## 给已有安装的读者

1. **先看实际位置。** 检查目标 Skill 的 `SKILL.md` 是否可读、父目录与子项各自是否链接；只观察，不整目录替换。保留原内容、来源版本及自行修改的副本。
2. **确认是同一断链场景，再对该 Skill 用 copy。** 在已有可信 `skills` CLI 上，以已审阅的本地来源执行 `skills add <该Skill目录> --global --agent claude-code codex --copy`，保留交互确认；不要对整个个人 Skill 集合批量覆盖。
3. **核结果而非安装宣言。** 用 `skills use <实际Claude安装路径>` 读取并对照源正文，`skills list --global --agent claude-code --json` 核关联；再回所用客户端验证发现与实际任务。这里未运行 Claude／Codex 模型，文件可读不代表客户端采用成功。
4. **保一个编辑源，明确分发更新。** copy 不是同步；改源文件后不会自动更新所有副本。若现有链接健康，继续沿用，无需迁移。

固定主干的 `createSymlink` 在计算相对路径时解析父级，却未解析 `linkDir` 自身；既有断链的判断又可能提前返回，解释了重装不修复。上游已有修复 PR #2283，本次未重复提补丁，也未执行其候选代码。原报告来自三月，九月有修复活动；本次十月正式包复现，不把旧报告称为本周新故障。

**依据**：[真实使用者 #481](https://github.com/vercel-labs/skills/issues/481)、[官方 1.7.4 用法](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/README.md)、[同版安装模式](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/src/add.ts)、[固定主干链接实现](https://github.com/vercel-labs/skills/blob/92a9a34ac3bf88e695e468b90c7bf32f163d32c8/src/installer.ts)、[未合并 PR #2283](https://github.com/vercel-labs/skills/pull/2283)。源码、PR 状态及实际 CLI 核实 2026-10-31；未跑上游完整套件、Windows／macOS 或模型，最高水平与模型收益未知。

## 复跑

需 POSIX、Python 3.11+、Node 24、npm、curl；从本仓根执行。只在新目录安装官方包，空 npm 用户／全局配置，禁用安装脚本；下载需要网络。固定顶层版本，完整依赖锁留在本次目录，不声称跨时间全依赖一致。

```bash
set -eu
work=$(mktemp -d)
mkdir "$work/home" "$work/install" "$work/source"
: > "$work/user.npmrc"
: > "$work/global.npmrc"
printf '{"private":true,"dependencies":{"skills":"1.7.4"}}\n' > "$work/install/package.json"
HOME="$work/home" npm --prefix "$work/install" \
  --userconfig "$work/user.npmrc" --globalconfig "$work/global.npmrc" \
  --cache "$work/npm-cache" --registry https://registry.npmjs.org \
  install --ignore-scripts --no-audit --no-fund
curl --fail --location \
  https://raw.githubusercontent.com/vercel-labs/skills/a80e4c9d12d607631249d4d7d059f835d4b2f13a/skills/find-skills/SKILL.md \
  --output "$work/source/SKILL.md"
python3 experiments/skills-linked-parent/consumer_probe.py \
  --package-root "$work/install/node_modules/skills" \
  --skill-dir "$work/source" --root "$work/run"
printf 'Results: %s/run/results.json\n' "$work"
```

以上入口已在新目录重新安装官方包、下载固定源并复跑六步，与表中一致。脚本先验源文件 SHA-256 `c00eeea0e13e74fe4a9d84ba0a8542205a1b736d65f13134fe1a6647eb14976f`，再以新 HOME、白名单环境、`DISABLE_TELEMETRY=1` 与 `DO_NOT_TRACK=1` 调用实际 CLI；安装来源全部为本地路径。官方代码也以该开关跳过审计查询，本次不执行 Skill 正文中的命令、不启动模型。四布局六步都符合对照才 exit 0；缺输入、既有输出根、错误源或行为变化均 exit 2，保留失败输出供核查。

## 这轮来源发现为什么选它

本轮围绕当前 AI coding 使用者的实际缺口，先看高使用客户端与候选，再与现有覆盖去重。下面为 **2026-10-31 定向一轮**的实际覆盖；不是全网排名或穷尽扫描。同类多条反馈只算一个需求，不以链接数量当产出。

| 来源类别 | 实际查看／得到的需求 | 取舍 |
|---|---|---|
| 做事团队的实现 | Cursor 官方 Skills 文档及员工纠正；Vercel skills 的 AGENTS、发布版、安装源码与 PR；Git AI 的 AGENTS、命令实现和 PR，3 组 | 选本 CLI 路径实试；Cursor 存储／运行入口形成[未试用提醒](../../docs/decisions/skills-and-plugins.md#cursor-synced-skill-owner)；Git AI 不执行 |
| 头部覆盖与市场 | GitHub [agent-skills topic](https://github.com/topics/agent-skills)、[awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)、[skills.sh trending](https://skills.sh/trending)；回核 Superpowers、GSD、skills、awesome 的仓库状态，4 个代表 | 前两类已有覆盖；所查 [GSD 仓库](https://github.com/gsd-build/get-shit-done)已归档，不新装。市场热门生成类 Skill 不匹配本题；本轮不替换 Top 5 |
| 中英文技术社区 | [LINUX DO 跨客户端分工](https://linux.do/t/topic/3088238)、[V2EX UnitPlayer](https://v2ex.com/t/1246756)、[Reddit Cowork Skill 重复](https://www.reddit.com/r/ClaudeAI/comments/1x7bmbb/skills_list_constantly_repeating_throughout/)，3 条不同需求 | 分工帖缺可接收项目；UnitPlayer 需封测／设备；Cowork 不能当 Claude Code 证据，均不造替代实验 |
| 真实使用者 | Cursor [174945](https://forum.cursor.com/t/sync-skills-for-cloud-agents-overwrote-local-cursor-skills-with-an-old-snapshot-then-hung-at-50-of-50/174945)／[174578](https://forum.cursor.com/t/cursor-automations-dont-see-custom-user-skills/174578)、skills #481／#456、Git AI #2433，归并为 4 类需求 | 两个 Cursor 问题对应有效副本与 Automation 入口；skills 选正式 CLI 对照；Git AI 留作未试用线索 |
| 新发现而非既定题单 | [Git AI #2433](https://github.com/git-ai-project/git-ai/issues/2433) 的 `/ask` 引用不存在命令；已有 [PR #1552](https://github.com/git-ai-project/git-ai/pull/1552)，1 项 | 开发试用规则要求替换安装、装 hooks 并重启 daemon；没有为造轻量试验绕开。纯命令存在性不足以证明溯源流程，未试用 |

GitHub 仓库排序搜索两次超时，改用已能读取的 topic／awesome／市场及指定仓库核对，未取得完整星标或增长排名；LINUX DO 另一原帖超时、V2EX 另一页与 Cursor 发布说明未取到，不当作没有内容。Windows 长路径需求与托管缓存需求不能用 Linux 本地用例代替。已覆盖的 Qwen 读者、规则 linter、Codex MCP、Intent、OpenSpec、RTK 与 Vitest 不重做；本题新增的是**真实安装输出与目标路径消费的反例，以及本次正常的对照边界**。
