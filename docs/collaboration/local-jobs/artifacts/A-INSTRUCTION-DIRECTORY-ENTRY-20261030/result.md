# A-INSTRUCTION-DIRECTORY-ENTRY-20261030 · 单元 1 结果

## 改了什么

只改 `docs/decisions/instruction-files.md` 的第二步，把跨目录选择转成一张三行分流表和两条最小启动示例：

- 单包新任务在目标包目录启动；Codex 用 `codex --cd <仓库>/<包>` 带入根到该包的指令链。
- Codex 根会话跨兄弟包不能把 shell `cd` 当原生重载；在目标包目录另开新任务，既有根任务不自动终止或重开。
- Claude 的 `--add-dir` 只增加可访问目录，默认不加载该目录的指令；需要其 `CLAUDE.md`／`.claude/rules` 时另开额外目录加载开关或走显式导入，并先核外部导入批准状态。

同时保留版本差异、Codex fixture 只核上下文组装、内容可见／工具加载信息／真实行为三层证据、🟡 状态与真实多工具采用待验。未更新源文核实日期，未新增跨工具优劣结论，未运行客户端或模型实验。

## 审查修正

按独立审查修正第二步两处混写；官方 memory 文档「Import additional files」「Load from additional directories」及「Where AGENTS.md differs from CLAUDE.md」已核：

- 拆分两种外部导入批准行为：项目 `CLAUDE.md` 中 `@` 外部文件首次弹出批准框，拒绝后保持禁用且不再弹；只有原生读取的 `AGENTS.md` 内部再导入外部文件，才须此前获准且运行时不再弹框。保留“不改用户设置、不绕过批准”。
- `--add-dir` 改为“默认不加载指令”并给出内联、不改用户设置的额外目录加载开关 `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir <外部仓库>`，注明仍不覆盖原生 `AGENTS.md`；分流表同步补上“需要 `CLAUDE.md`／`.claude/rules` 时先开开关”，不再把 CLAUDE 入口写成默认自动加载。

## 输入与写者核对

- `docs/decisions/instruction-files.md` 修订前在本工作树与 `origin/main` 的 blob 相同（`e77e6b3`）；`git log --all --not origin/main` 未发现其他分支上未合入的该文件改动，未覆盖他人成果。
- 固定输入只读：03 §2.1、共享指令研究、A-CODING-ADOPTION-001、操作手册§7、operations§2.2／§3、local-jobs README 与 TASKS；未另开客户端、模型或加载实验。

## 检查

| 检查 | 结果 |
|---|---|
| `python3 scripts/check_repo.py` | exit 0，576 files，0 errors |
| `python3 scripts/check_public.py` | exit 0，1004 files，0 findings |
| `python3 scripts/check_public.py --commits origin/main..HEAD` | exit 0，0 findings；本单元未创建提交，交付区间为空 |
| `git diff --check` | exit 0（修正后重跑；已对本文件执行 `git add -N`，空白检查覆盖它） |
| 提交身份 | 本单元未提交；本机全局身份不是公开安全的 noreply 邮箱，未被本单元使用，交付提交须由接收端沿用既有 noreply 身份 |

## 未完成／边界

- 非作者只读修订页的复核由接收端 Workflow 的审查阶段完成；本单元不把静态改写写成真实读者采用。
- 共享方案的真实多工具加载与行为验收仍待真实任务；本单元只把已核契约转成操作入口，不把文档契约写成已采用。
- 未提交、未推送；由接收端按任务要求发布结果分支。
