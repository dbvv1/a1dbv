# Spec Kit：撤掉 preset 后，核对真正加载的 Skill

**🧪 已有 Spec Kit 项目叠加 preset 时，撤层后的验收对象是实际 `SKILL.md`，不是 `preset remove` 的成功提示或 resolver 列表。** 最新固定主干的 CLI 虽退出 0，Claude／Codex 仍留下已撤层的指令；接入已有 #5013 原补丁后，本轮相同输入正确重组。
**保全手改看 ownership，而不是“文件被人改过”。** 去掉 `metadata.source` 的文件被完整保留，里面的旧指令也保留；仍带 preset source 的正文修改会被重写，无 base 的受管技能整个目录会删除。
这是一项配置维护任务的实际接收，帮助判断撤层是否完成；Spec Kit 与其他 SDD 框架的整体开发效率未作比较。

## 实际走过的任务

上游 [#5013](https://github.com/github/spec-kit/pull/5013) 报告：移除低层 preset 后，解析链已变，但 surviving preset 拥有的 Skill 没刷新。本轮把其原始 base→head 差量应用到更新的主干，保留基线，在各自独立环境运行真实 CLI；没有另写生产修复。

输入是三个本地 preset：base／middle／top，优先级 10／7／5，策略 replace／append／append。共同提供四个命令：有 core fallback 的 `speckit.specify`、无 fallback 的自定义命令、去 source 的手改文件、保留 source 的正文修改。每层正文含独有标记。

实际流程为 bundled `init --here --ignore-agent-tools --non-interactive --script sh` → 三次 `preset add --dev` → `preset resolve` → 移除 middle → 移除 base → `integration use` 重新生成。每阶段保存文件全文、stderr 和退出码。Claude、Codex 分别完成；另先装 Claude 再切 Codex，检查旧 agent 目录；Gemini TOML 做非 Skill 内容对照。Copilot commands 只取得分派 stub，未拿它冒充完整内容控制。

| 同输入下的实际产物 | 未补丁主干 | 原补丁候选 |
|---|---|---|
| 活跃 Claude／Codex 移除 middle | 仍含 middle 指令 | 只留下 base＋top |
| 随后移除 base | 仍含 base 指令 | `specify` 回落 core＋top |
| 自定义命令失去唯一 base | 旧 Skill 留存，缓存可在重新生成时带回旧内容 | 受管目录删除，重新生成后仍缺席 |
| 去 source 的手改文件 | remove 时保留；活跃目录重新生成可能覆盖 | remove 和重新生成均逐字保留 |
| 保留 source，仅改正文 | 常与陈旧组合一起留下 | 重组覆盖手改；成为孤儿后整目录删除 |
| Gemini TOML | 正确撤层 | 三个阶段与基线逐字相同 |

历史目录有一个重要差别：旧 Claude 的 owner 是 middle，基线移除 middle 本来就会更新它，**随后移除 base 才留下陈旧内容**；候选两步都正确。不能把所有旧路径概括成同一种失败。

## 这次结果怎样进入验收

- **解析链、实际文件、所有曾安装的 agent 目录一起核。** 本例的成功提示和 resolver 都不足以抓到陈旧 Skill；候选还要通过再次生成，避免缓存把已撤内容带回来。
- **把手改与受管资产分开看。** source marker 是本次代码使用的所有权依据。去 marker 的负控证明它被保留，不构成给现有项目批量去 marker 的建议；受管孤儿的附带文件也随目录删除。
- **读 warning，再判具体产物。** 测试中出现预期的 no-base／skip composition warning；现有 remove 路径还可能捕获 reconciliation 异常后继续返回，故本轮结论来自文件回读。

同一回归文件在基线为 **70 过／14 失败**，候选 **84 过**；14 是失败用例数，不是 14 个独立用户故障。Ruff 0.15.0 对 `src tests` 通过。候选完整套件为 **13668 过／10 失败／436 跳过**：4 项目录联网诊断、3 项 bundle 引用断言、3 项 cleanup 路径换行断言。把相同 10 项单独放回原主干和候选，两边均 10 失败；这是失败项对照，未重跑原主干完整套件，整体仍未全绿。

上游 PR 当时仍 open／未合并，精确 head 只有一项 license check 成功，五个 workflow 为 `action_required`，不能据此判完整 CI 绿。实测在 Linux／Python 3.12.14，使用各自 venv 中的 editable CLI；未调用 agent／模型、生成脚本、账户或全局安装。Windows／macOS、文件级 symlink、回滚注入、extension fallback 和并发编辑另验；不升级答案页评级或默认。

**依据与范围（核实 2026-11-02）**：[官方架构](https://github.com/github/spec-kit/blob/7370e592f3cd9c06e5b698983957e227c75b30e2/design/integration.md)、[官方贡献及测试约定](https://github.com/github/spec-kit/blob/7370e592f3cd9c06e5b698983957e227c75b30e2/CONTRIBUTING.md)、[真实开放 PR 与补丁](https://github.com/github/spec-kit/pull/5013)、[本轮结果](results.json)。这是沿公开真实需求的定向接收；未覆盖广泛中文社区或全部热门 SDD 工具。上游 MIT；本仓不发布上游源码补丁，固定版本、实际边界和结果保留于本目录。
