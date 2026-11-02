# planning-with-files：固定任务恢复，仍按真实产物接收

**已有交接记录够用时继续用它；需要原生选择具名任务目录时，可试 planning-with-files 的 `PLAN_ID`＋三文件恢复。** 本次新上下文沿选定记录接完真实 PR 验收：**#353 候选漏验坏 ClawHub staging，不能按原完整条件直接采纳**，即使 Python 套件 exit 0。没有比较两种方法的效率，也不更换[长程路线](../../docs/decisions/long-tasks.md)的默认与 🟡 状态。

## 这次确实用来完成了什么

公开 [#352](https://github.com/OthmanAdi/planning-with-files/issues/352) 报告：项目忽略的 `.planning/` 内放入旧 helper 或坏 `SKILL.md`，源码未变，两项 shipped-file 校验却失败。已有 [#353](https://github.com/OthmanAdi/planning-with-files/pull/353) 改为优先读取 Git tracked inventory。本次接收原补丁，没有另写同题实现或向上游投稿。

负责人先固定当前源码与原补丁、复现失败，把版本、真实剩余验收和证据入口写入原生三文件。新上下文只拿固定 Skill、项目根与任务 ID，从 resolver 返回的目录读 `task_plan.md`、`findings.md`、`progress.md`，识别出未完的 tracked 负控、ClawHub staging 和无 Git 归档检查，实际完成后交回；负责人再核原始输出、恢复后的文件和整套检查。

这支持一次**手动恢复与接收**：三文件保存决定和未完成项，Git／日志保存可核证据。没有安装 Skill 或 Hook，没有使用私有会话记录，也没验证宿主自动压缩恢复、跨模型优势或长期可靠性。准备源码与补丁发生在初始化前，不能算从任务发现开始完整遵循 Skill。

## 最小使用方式与实际卡点

本仓[交接模板](../../templates/generic/.claude/skills/handoff/SKILL.md)已经保存目标、版本、写者、验证和下一步；本次新增的是上游原生目录选择与格式检查，不是更强的验收判断。

- **创建位置先核对。** 在独立项目根运行 named initializer；它按当前目录创建 `.planning/<id>/`，不是按 `PWF_PLAN_ROOT` 创建。默认命名模式也会继承根 `.mode`，因此本次先确认新根没有该文件；没有启用 autonomous／gated。
- **交接根目录和精确 ID。** 后续 helper 每次明确带 `PWF_PLAN_ROOT`、`PLAN_ID`，核返回路径恰好是目标，再读三文件。不能只给 `.active_plan`，它是共享指针。
- **空输出要停。** 实测错误 ID 返回 exit 0、空 stdout；正确 ID 即使从另一个 cwd 调用也返回目标。`check-complete.sh --validate` 只检查 phase/status 格式；未完计划的 advisory 同样 exit 0，不能当任务通过。
- **一位 owner 写共享计划，消费者回自己的证据。** 本次消费者不改三文件，实际缺陷负控结束后恢复原字节；原始失败与可选 staging 的遗漏都保留。源码、依赖、账户权限和项目检查仍需单独交代。

需要复用时，先读固定版本的 Skill 及 helper 依赖；named init 还依赖同目录 `set-active-plan.sh`。这次只显式调用审过的脚本，没有执行 Skill frontmatter 的安装／Hook 入口。普通单任务没有目录选择需求时，不必把现有记录拆成三份。

## 真实消费者改变了接收结论

两版输入一致：当前 master，以及其上应用原 PR 的两测试文件差量；合成 ignored scratch 仅含旧 helper 和坏 Skill，未使用私人数据。

| 消费者检查 | 当前 master | 原 PR 候选 | 接收意义 |
|---|---|---|---|
| ignored scratch＋相关 validators | 2 失败、5 通过 | 8 通过 | 原问题复现并修正；两版 ignored 原文件 hash 不变 |
| 已跟踪 helper 去掉 guard；隐藏 adapter 改坏 YAML | — | 各 1 失败，恢复 hash 相同 | 没有靠放宽这两个源码断言过关 |
| 真正无 Git 归档，保留相同 scratch | — | 7 通过、1 跳过 | filesystem fallback 可用；跳过的是 Git inventory 检查，YAML 实际运行 |
| 无 Git 归档中的相同两项源码负控 | — | 各 1 失败 | 归档路径仍检出受管源码缺陷 |
| ClawHub 暂存区坏 helper＋坏 Skill | 原 validators 对同归档 2 失败 | Git 检出 8 通过；归档 7 通过、1 跳过 | 候选排除了 staging，覆盖确实收窄 |

**接收选择：只把 #353 视为 tracked-source 误扫修复，不能以它宣称保留了 ClawHub 暂存区校验。** 上游另有 staging build／`--verify` 发布要求，但本次没有运行，不能替代这两个坏文件负控。若接收条件包含 staging，就仍需明确独立检查或作者调整，不能因相关测试变绿就全部采用。

归档测试实际确认 `git rev-parse` 返回“非 Git 仓库”，并设置搜索上界。静态审查发现候选 discovery 没有核 Git 顶层是否就是源码根；归档位于别的 Git 仓库内时可能读父索引，这个嵌套场景未实跑，不扩大 fallback 结论。

## 整套检查与保留范围

同一环境运行完整 `python -m pytest tests/ -q`：baseline **2 失败、1085 通过、356 跳过**；candidate **1089 通过、356 跳过**，两版另有 **1073 subtests 通过**。baseline 的两处失败都指向本次 ignored scratch；候选 exit 0 仍须保留 356 个跳过及上述 staging 负控结论。

Linux／Python 3.12.14、pytest 9.2.0、PyYAML 6.0.3；依赖仅装进独立云 venv。完整 Python tests 在白名单环境下使用各自 HOME、USERPROFILE、XDG 与临时目录，测试夹具会调用合成 catchup／gate 等 helpers，没有注册真实宿主 Hook；本次方法使用路径没有调用它们。没有运行原生 Pi／OpenCode／DSH 插件套件。

上游原 PR head 的托管快照是 5 个 check 成功、1 个 Pi check 取消，所属 workflow 为 cancelled；这是上游 PR 版本，不能替代当前 master 应用补丁后的本地结果。未做上游合并或发布。

固定输入、消费者时间、结果与保留包摘要见 [results.json](results.json)。原 stdout／stderr、失败夹具、两文件原补丁、三文件检查点和独立消费者脚本在保留包内；公开页只投影任务相关事实。

**依据与核实日：2026-11-02。** 官方 [Skill v3.27.0](https://github.com/OthmanAdi/planning-with-files/blob/b6580cd24af1d8a95ab268794456e05608a1afd3/skills/planning-with-files/SKILL.md)、[贡献与测试要求](https://github.com/OthmanAdi/planning-with-files/blob/b6580cd24af1d8a95ab268794456e05608a1afd3/CONTRIBUTING.md)、[原补丁](https://github.com/OthmanAdi/planning-with-files/pull/353/files)；真实使用者输入为 #352。项目 MIT；观察到 约 2.8 万 stars 仅用于发现排序，不是方法效果证据。
