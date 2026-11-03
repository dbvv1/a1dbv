# Skill 格式通过，不代表手动触发约束还在

**🧪 要将 generic Skill 交给只接受标准字段的工具链，先分清格式与宿主行为；保留原 Claude Code 版本，不为通过校验删除手动触发限制。** 本次用 Agent Skills 官方演示库，对本仓五份真实 generic Skill 做格式检查、属性读取和目录生成。它适合解释移植差异，不适合作为 Claude Code 包的通用生产门禁。

## 实测改变了什么判断

| 同一批五份模板 | validate | read-properties | to-prompt |
|---|---|---|---|
| 保留原件 | 5 个均退出 1，只报 Claude 扩展字段 | 5 个均成功，但不携带两个扩展字段 | 成功列出全部 5 个 Skill |
| 仅在临时副本删除扩展字段 | 5 个均通过 | 与原件读出的属性相等 | 名称、描述相同，location 指向副本 |

五份原件都有 `disable-model-invocation: true`，四份另有 `argument-hint`。reference 的 validate 只接受六个标准字段；read-properties 明确不做完整校验，to-prompt 又沿用属性读取，因此**生成目录成功不会补做校验，也不会落实 Claude 的手动调用规则**。这里没有测模型是否调用，不能将目录出现称为越权执行。

副本正文哈希完全不变，但手动触发元数据已经丢失；`explore-frontier`、`spec-interview`、`write-task-guide` 的正文还各保留一个 `$ARGUMENTS`。**属性相等来自有损读取，正文相同不等于工作流等价。** 删除字段是本次反例，不是迁移修复。继续在 Claude Code 使用时保留原件；迁到其他宿主，先确认等效的显式入口与参数处理，没有证据就只迁知识内容或由用户明确指定读取，不默认开启自动发现。

本仓此前已经说明“宿主扩展不可移植”。本次增量是用现成五份模板量出三个官方入口的不同结果，帮助避免把目录生成当校验、再把校验通过当约束保留；没有证明新增工具比已有人工核对更省时，也没有新增模型采用结论。

## 来源、检查与边界

- 官方认可链：[Claude Code 的标准字段与宿主扩展](https://code.claude.com/docs/en/skills#using-skill-frontmatter-outside-claude-code) → [Agent Skills 标准的校验入口](https://agentskills.io/specification#validation) → [skills-ref 固定源码](https://github.com/agentskills/agentskills/tree/69ef37e9424c0a7ea9dd2293b559e43ec8176379/skills-ref)。库版本 0.1.0，README 明示仅演示用途；不是所有标准实现都会这样处理扩展。
- 输入：[a1dbv 固定 generic Skills](https://github.com/dbvv1/a1dbv/tree/7425f72dd791c49c82758e69dbbd812130d1f84e/templates/generic/.claude/skills)。五份 Git blob、正文哈希及实际派生差量见 [runtime-lock.json](runtime-lock.json) 与 [receipt.json](receipt.json)。原文件未改。
- 四个 Linux 运行依赖来自 PyPI，版本及 wheel 哈希同时核对官方 uv.lock 和各版本 metadata；只解包，不运行 build/install 脚本。实际执行的是官方 CLI，Skill 正文始终是数据。
- 共 28 条 CLI 命令：20 条逐份校验/属性读取、2 条目录生成、6 条坏输入。缺 name、缺 description、名称与目录不符、坏 YAML、缺 SKILL.md 均退出 1；不存在路径在 Click 参数检查退出 2，没有进入 validator。公开脚本另核六种预检拒绝，原输出目录哨兵保留。
- 完整原输出、输入差量、源和依赖哈希已获非作者只读复核；公开版另以新目录重跑。仅覆盖所列文件及前后哈希，不是整个系统无变化的取证。独立 HOME/XDG/TMP 与环境白名单不是 OS 沙箱或网络审计；未测宿主加载、自动触发、参数替换、跨客户端行为或模型收益。

来源与实测核实：2026-11-03；Python 3.12.14／Linux。没有修改模板、三优先页或其他任务。

## 复现

准备 Python 3.11+、固定官方源码的 skills-ref 目录，以及全新依赖目录。按 runtime-lock.json 中四个官方 wheel URL 取包，逐个核 SHA-256，再解压到依赖目录；不运行 pip editable、uv sync 或包内脚本。脚本先核 11 个 reference 文件、99 个依赖文件与五份输入哈希，再创建新输出目录；已有输出或错误输入会拒绝。

在本仓根目录取得固定模板，再用可信路径替换占位：

```bash
(
  set -euC
  scratch="$(mktemp -d "${TMPDIR:-/tmp}/a1dbv-skill-reference.XXXXXXXX")"
  git fetch origin 7425f72dd791c49c82758e69dbbd812130d1f84e
  for name in explore-frontier handoff spec-interview task-decisions write-task-guide; do
    mkdir -p "$scratch/skills/$name"
    git show "7425f72dd791c49c82758e69dbbd812130d1f84e:templates/generic/.claude/skills/$name/SKILL.md" > "$scratch/skills/$name/SKILL.md"
  done
  python3 experiments/skill-reference-portability/trial.py \
    --reference-root /path/to/verified/skills-ref \
    --dependencies /path/to/verified/unpacked-wheels \
    --skills-root "$scratch/skills" \
    --output "$scratch/run"
)
```

脚本不下载、不安装、不配置客户端。输出保留完整 stdout/stderr、退出码、输入副本、投影 diff 与 summary；所有断言后才写 pass。原始路径属于运行环境，分享前需脱敏，本仓不保存本次运行的绝对环境路径，保留脱敏结果、计数、哈希与判定。失败保留原件，不覆盖重跑。
