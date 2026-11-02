# Matt diagnosing-bugs：已知根因时，完整消费者比流程更关键

**🧪 已有复现、根因和候选补丁，继续项目原有调试路线即可；本例未观察到这份高热度 Skill 带来额外的采用结论。** 两个新上下文分别手读固定 `diagnosing-bugs` 和本仓既有路线，都完成真实 pytest 缓存任务，得到相同选择。
**本轮限定接收已有 #15299，而不是改动更少的 #15321。** 两者都修复启动和 `--lf`，后者却让 `--cache-show` 退出 0 而漏显示已有缓存；补验这一入口来自独立源码审查，不能归因于 Skill。
没有安装插件或新建第三份修复。自动触发、跨模型效果、难故障的额外收益仍未验证；默认与读者评级不变。

## 真实任务及结果

[pytest #15295](https://github.com/pytest-dev/pytest/issues/15295) 报告 `cache_dir` 含 `..` 时启动 INTERNALERROR，并关联实际 CI 失败。报告已给根因，另有两份未合并修复。本轮固定更新的主干，分别应用两 PR 的 merge-base→head 原差量；所有项目、缓存和环境都在独立云工作区。

两种原输入都实际走了 CLI：项目子目录中的 `cache_dir = ../.pytest_cache`，以及没有 ini 时含 `..` 的 `TOX_ENV_DIR`。再让一个测试真实失败，核落盘 `lastfailed`；修好它后用 `--lf`，并把不应选中的另一测试改成必失败，确认确实只运行上一失败项。

| 两路一致的消费者观察 | 主干基线 | #15321：只规范化 join 的 base | #15299：也规范化缓存根 |
|---|---|---|---|
| 两种输入正常启动 | exit 3，原 INTERNALERROR | 通过 | 通过 |
| 合法 key、实际 `lastfailed`／`--lf` | 启动阻断 | 通过 | 通过 |
| 词法越界 key 拒绝、外部合成哨兵不变 | 本轮未越过启动阻断 | 通过 | 通过 |
| `--cache-show` 显示已写值／文件 | 未接收 | **exit 0，但内容缺失** | 正确显示 |
| `--cache-clear` 清旧值、正常重建 | 未接收 | Skill 路线通过 | 两路均通过 |

窄补丁保留含 `..` 的 `_cachedir`；`--cache-show` 又独立把规范化后的文件路径与未规范化的根比较，于是过滤掉真实存在的记录。较宽补丁覆盖了这个消费者，额外改动面才有采用依据。**负控只支持普通目录下的词法 key 边界**：两者都不是基于真实文件系统目标的 symlink 隔离；`link/..` 等路径语义与跨平台另验。

## Skill 实际提供了什么

手读的是 MIT 的完整固定 Skill 和唯一随附 HITL 脚本；脚本没有执行。Skill 路线先建立真实红灯命令，再用同输入接收现有修复，保留原错误和返工。已知根因时明确跳过凑 3–5 个假设及额外插桩；进一步把测试正文删空的最小化发生在初次候选比较之后，**未严格逐阶段完成**。

既有路线同样做到复现、回归、实际入口和失败保护。两路都曾把诊断流或 `--lf` 摘要的断言写窄，后来按保留的 stderr、实际选中节点和缓存内容修正测试脚本；没有改产品预期求绿。Skill 路线另有辅助文件名遮蔽 stdlib 的中断修正。工具调用数和这些单次返工不能换算成效率排名。

选择时应同时读当前 Skill 和真实反馈：[使用者 #578](https://github.com/mattpocock/skills/issues/578) 报告轻问题也被拉进重流程，维护者仍待设计轻重切换。另一个容易误读的点是：同一固定提交的[人用说明](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/docs/engineering/diagnosing-bugs.md)仍称缺脱敏要求，但 **实际 `SKILL.md` 已有 Redact**，[#674](https://github.com/mattpocock/skills/issues/674) 已按 1.2.3 发出关闭。不能拿旧说明给当前源码定性。

## 检查与接收边界

两候选的上游缓存测试分别 **69 过／70 过**，仍没有替代 `--cache-show` 的真实文件验收。#15299 的两处 Python 改动通过 Ruff 0.17.2 check／format-check；`python -m pytest testing` 已 exit 0：**4714 过／50 跳过／13 xfail／7 xpass**，另有 2 个 warning；这不覆盖整个 tox／Python 版本／插件／文档矩阵。

精确上游 head 的 check-runs 快照为：#15321 **32 成功／2 失败**，#15299 **34 成功**。这是上游旧 head，不是本地应用到更新主干后的树。实测使用 Linux／Python 3.12.14、各树独立 dev venv；版本为 `10.0.0.dev12` 系列，复现了报告症状，没有另外安装 9.2.0。`TOX_ENV_DIR` 是直接传给真实 pytest 的输入，未运行完整 tox。

首次准备 #15321 时曾把 API 当前 base 当分叉点，带入无关依赖降级；**消费者启动前已撤回并改用真实 merge-base**，最终没有依赖降级。上游贡献政策拒绝缺少实质人工审查的无人值守投稿，本轮只接收已有候选，不向上游发评论或 PR。

**依据（实跑／核实 2026-11-02）**：[固定 Skill](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/diagnosing-bugs/SKILL.md)、[原有调试路线](../../docs/15-task-playbooks.md#2-调试)、[真实问题](https://github.com/pytest-dev/pytest/issues/15295)、[窄修复](https://github.com/pytest-dev/pytest/pull/15321)、[缓存根修复](https://github.com/pytest-dev/pytest/pull/15299)、[pytest 贡献政策](https://github.com/pytest-dev/pytest/blob/afac7979e3d0d30914aa986192dcbbc48379cb86/CONTRIBUTING.rst#ai-llm-assisted-contributions-policy)、[结构化结果](results.json)。Star 只用于发现候选；这是一个已知根因任务的对照，不是热门 Skill 全覆盖或框架总排名。源码与补丁、两路输入／原始日志／产物另行保全；本目录只公开可采用结论与脱敏结果。
