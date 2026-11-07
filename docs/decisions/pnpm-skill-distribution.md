# 用 pnpm 分发 Skill：先审来源，再批准，再验正文

**🧪 项目已经用 pnpm，且确需把同一份包内 Skill 交给多个客户端时，才试 pnpm 12.11 起的原生分发。** 只要读取一次配方，直接读已安装包即可；不为分发 Skill 把现有项目换成 pnpm。本页给出分发步骤，真实项目采用仍待验证。

| 你遇到的问题 | 直接走哪条路 |
|---|---|
| pnpm 11 全局装了 CLI，Intent 却列不出 Skill | 沿[现有单根读取答案](skills-and-plugins.md#intent-pnpm-global)，无需升级或重装包 |
| 应用已有 TanStack Router，要读对应版本的配方 | 沿[从消费包解析的入口](skills-and-plugins.md#领域配方先读安装包不为一项知识装整套流程)，不依赖顶层 hoist |
| 已有 pnpm 项目，需要随依赖维护多客户端 Skill | 用下方项目级分发步骤，分别验批准、链接和客户端加载 |

## 开始前：确定包、目录与权限

在自己的应用项目根目录执行，先确认 `pnpm --version` 与项目固定版本一致。本仓实测为 **pnpm 12.11.0、Linux x64/glibc、Bash**；Windows／macOS、后续版本及原生客户端加载未验。global install、`dlx`、`deploy` 不走本页的分发路线。

准备一个已经进入项目依赖声明与锁文件、来源经过审阅的 Skill 包。本页命令面向**没有构建／安装脚本的纯 Skill 包**；若同一包还请求构建能力，先按项目流程单独审查，不按名称一次全部放行。记录实际取得包的 registry／仓库／tarball 来源、版本和完整性标识，读过 Skill 正文及引用资源后再批准。

pnpm 默认向已有且能识别的客户端 Skill 目录投影。先核项目是否已有 `.claude/skills`、`.agents/skills`，以及其中的手工内容；需要这两个客户端且目录确实缺失时，才创建对应目录。项目已配置 `skills.dirs` 时，沿用或明确调整原策略，不覆盖整个配置文件。

## 安装与批准：一次只处理实际待批来源

**安装命令的两个禁用选项不延续到随后独立运行的 approve。** 本仓分发实测在临时项目的 `pnpm-workspace.yaml` 中持续设置了 `ignoreScripts: true`、`ignorePnpmfile: true`；实际项目若要保持相同边界，需先将两项合并进既有配置并评估对项目原构建的影响。需要 pnpmfile 或构建脚本的项目，先完成对应审查与验证，不把下方分发结果当成其运行许可。禁用选项也不替代 Skill 内容与宿主权限的审查。

先保全项目已有改动，再运行锁定安装；该命令不更新锁文件，也不运行依赖脚本或 pnpmfile：

```sh
git status --short
pnpm install --frozen-lockfile --ignore-scripts --ignore-pnpmfile
```

依赖需要构建才能使用的项目，这次安装不替代原构建流程。若锁文件与声明不一致，先解决项目原依赖变更，不为通过而取消 frozen。离线缓存齐全时可再加 `--offline`。

安装退出 0 仍可能提示 `Agent skills awaiting approval`。从该输出取**完整的待批来源标识**，核对它确实是刚审过的那个包，再替换下面的值：

```sh
SOURCE='替换为安装输出中的完整待批来源标识'
pnpm approve "$SOURCE"
git diff -- pnpm-workspace.yaml pnpm-lock.yaml
```

`pnpm approve` 会写项目批准配置，并按项目配置执行允许的构建与 Skill 链接。不要改成批准所有包，也不要把一个不在待批列表中的名字填进去：按名称批准非待批包会决定其全部能力。

## 验收：三层分别检查

1. **批准记录**：检查 `pnpm-workspace.yaml` 中该来源的 `skills` 决定，以及是否意外改变 `build` 等能力。退出码不是状态快照。
2. **投影正文**：在每个目标目录找到本次生成的 `pnpm-*` 入口，确认链接可读、`SKILL.md` 与已审的包内原文一致，旁边的手工内容未变；再跑同一 frozen 安装，确认锁文件与正文不漂移。只有名字、目录或悬空链接不算成功。
3. **实际任务**：回目标客户端确认发现并实际加载了这份正文，再完成原任务的产物、测试或操作验收。文件读通、菜单列出名称都不能替代这一层。

三层中做到哪里，就报告到哪里。把批准配置、锁文件及需要共享的项目配置纳入正常代码审查；pnpm 创建的投影链接由安装维护，不手工复制成第二份源。

## 失败与撤回：保留手工内容，先查已写入的决定

| 现象 | 做法 |
|---|---|
| 安装成功但没有链接 | 先核是否仍在待批列表，再核目标目录；不要只重复安装 |
| `ERR_PNPM_AGENT_SKILL_PATH_OCCUPIED` | 保留手工同名入口；确认其用途后选择不冲突的目标目录，不能直接覆盖 |
| `ERR_PNPM_NO_AGENT_SKILLS_DIR` | 选择实际客户端的目标目录；可以在现有 YAML 中合并 `skills.dirs`，再重跑 frozen 安装 |
| 批准命令非零退出 | 仍检查批准配置与链接；实测上述两种错误都已写入 `skills: true`，修目录后安装即可继续 |

需要改投影目标时，在 `pnpm-workspace.yaml` 的现有 `skills` 配置中合并下面的 `dirs`，不追加重复键。**该列表会改变项目 Skill 的投影范围，不只影响当前冲突包**；只填 `.agents/skills` 意味着本次只选择这一目标：

```yaml
skills:
  dirs:
    - .agents/skills
```

随后重跑上方 frozen 安装并核正文；本仓两类失败均按此恢复，手工冲突内容保留。明确目录会创建缺失目录，不能据默认模式的报错推断所有模式都不会创建目录。

撤回已批准来源可用 `pnpm approve "!$SOURCE"`，随后核配置与所有目标入口；本仓实测同时写入 `skills: false`、`build: false` 并移除链接，故不能把它当作只撤 Skill 的无副作用操作。换成本地另一 tarball 来源后，旧批准不沿用，旧链接也会撤回；registry 包的批准则覆盖后续版本，升级仍要复核内容。撤回链接不会撤销客户端已读入的正文或已执行的动作。

## 分发安全：锁文件、批准和事故处置是不同事情

**锁定来源和版本可以固定输入，不能证明内容安全。** 安装前与升级时都核来源、实际内容和新增能力；`skills: true` 是允许投影的决定，不是可信认证。

若安全公告命中自己的**分发渠道、平台、版本及时间窗**，按[正式分发事故答案](../10-security.md#extension-distribution-incident)处理，保留安装记录并交安全负责人核主机证据。不要仅凭同名版本把其他渠道也判为受影响，不以“升级／卸载成功”或某个标记不存在宣布整机干净，也不下载或运行事故载荷来验证。

**依据与验证范围**：[pnpm Agent Skills](https://pnpm.io/agent-skills)、[permissions](https://pnpm.io/cli/permissions)、[构建设置与 skills.dirs](https://pnpm.io/settings/build)；原核实与实测 2026-11-03，固定输入、命令和失败回执见[已合入的实验](../../experiments/pnpm-skill-distribution/README.md)。实验确实运行了 13 次 pnpm 命令，包括两个预期失败及恢复；消费者是合成包，不是 13 次真实采用，也未证明客户端加载或模型收益。分发事故的来源及 2026-11-04 核实日期保留在上述安全页。本页不引入新模板、Hook 或测试框架。
