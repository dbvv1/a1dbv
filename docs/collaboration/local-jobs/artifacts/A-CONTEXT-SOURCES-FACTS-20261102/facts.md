# A-CONTEXT-SOURCES-FACTS-20261102 · 上下文页文件引用与检索来源核查

**结论：** 页面三段的核心做法不用反转，需要补精度并改一处链接：压缩后 `Referenced file` 的触发线是**超过 5,000 token**，且压缩后最多重读最近修改的 5 个文件；Claude `@` 只在 Read 限额内内联内容（默认 25,000 token，文本超过 256KB 不含），Codex `@` 官方说明是把路径加入提示（是否同时包含内容未说明）；`best-practices#provide-rich-content` 在当前正文中已无该标题，应改指 `#write-a-specific-prompt`。Cursor 两个论坛帖是不同症状，修复版本均无官方交代；Git 命令契约成立，可补 `--end-of-options`。

**输入版本：** 固定页为 `docs/decisions/context-management.md@74be0d09b201cc0aacf925625899cf2d9bd03d3d`，该提交存在，文件 blob 为 `a32f8ffdd9ce5c9389cc5c520cf32cf88cd42471`（13,764 字节、LF）。接收端在任务文件内联附入的正文与这一 blob **字节一致**；本卡没有单独的 `received-page.md`。固定页与 `base_ref 21b5f4ab` 的该文件无差异。页面行号均按固定页计。本次读取日 2026-11-03。

## 影响操作的差量

1. **压缩后只重读有限文件，且“大文件”比直觉小。** 页面说“可能只留下大文件的 `Referenced file` 路径”，官方正文给出具体条件：压缩后最多重读 Claude 读过或改过的 5 个文件，按最近修改优先；**超过 5,000 token** 的文件只留路径引用、不含内容，显示为 `Referenced file` 而不是 `Read`。官方只说明最多重读 5 个，其余文件不在这次重读之列。读者应把关键事实和路径写进检查点，不能等压缩后自动恢复；压缩后要按实际内容核对。
2. **Claude `@文件` 不是内容保证。** 官方说 @ 引用在符合 Read 工具 token 限额（默认 25,000 token）时才把内容放进对话；文本文件超过 256KB 不包含；目录引用只给文件清单，不给内容；Read 拒绝的二进制文件只给路径。设置 `CLAUDE_CODE_DISABLE_FILE_MENTIONS=1`（v2.1.299 起，项目／本地设置里无效）后，@ 只把路径和“请读取”的提示交给 Claude。读者写检查点时不能以为写了 `@大文件` 就等于保存了内容。
3. **Codex `@` 官方只说明把路径加入提示，`/mention` 另算。** 官方交互快捷键原文是 “Type `@` to search for a file in the workspace and add its path to the prompt.”，只说明把路径加入提示，**未说明是否同时包含文件内容**；`/mention` 的说明是 “Attach a file to the chat”“Codex adds the file to the chat”，但**没有说明是否内联内容**。“仍要明确要求读取”是操作建议，不是官方原话；页面的“主要加入路径”保留，不改成排他性的“只加入路径”。
4. **一处依据链接失效。** 检查点段引用的 `https://code.claude.com/docs/en/best-practices#provide-rich-content` 在当前 HTML 中没有 `provide-rich-content` 锚点；@ 文件那句话现在位于 `### Write a specific prompt`，锚点为 `#write-a-specific-prompt`。事实仍成立，但链接应改；限额的更精确来源是 `common-workflows#reference-files-and-directories`。同段的 `#what-survives-compaction` 与 `#interactive-shortcuts` 锚点均存在。
5. **Cursor 两条论坛帖不能并成同一证据。** 160373 是 Cursor 工作人员确认的 Grep/Glob 在 Cursor 管理的 worktree 内静默返回零（Read、shell `grep`／`find`、编辑器搜索正常）；155500 是 Read／StrReplace 在 Linux worktree 内报权限拒绝的另一症状。155500 帖内工作人员（deanrie，2026-03-22）说是已知 Linux sandbox 不处理 worktree `.git` 指针文件的问题、**无 ETA**，当时唯一办法是关 sandbox；同帖用户 #10（2026-03-25）自报把 `worktree/*` 从 `.cursorignore` 移除后解决。页面只引 #10 并标“忽略规则误诊”，会漏掉这条已知缺陷，也不能把“改用 shell”当作权限拒绝的绕过方案。搜索为零可保留 Read／shell grep 对照；权限拒绝仍不换入口绕过。另据 Cursor 忽略规则文档，`.cursorignore` 阻止 Agent／Tab 和 @ mention 访问，但**不阻止终端与 MCP**；被排除的目录不会被遍历——这解释搜索为零，也说明 shell `grep` 只适合做对照，不等于 Agent 搜索应能看到该文件。
6. **Git 命令可用，建议补 `--end-of-options`。** `git rev-parse --verify '<ref>^{commit}'` 的语义正确；官方示例写作 `git rev-parse --verify --end-of-options $REV^{commit}`，并说明来自不可信来源的名字应加 `--end-of-options`，避免被当成选项。任务卡里的 ref 可视为外部输入，建议照官方加固。`git hash-object --no-filters` 的字节口径已用本卡附文实测成立（见“实际运行与检查”）。

## 核实表

| # | 页面位置与原句（固定页行号） | 来源、版本与日期 | 结论 | 读者该改什么／未知 |
|---|---|---|---|---|
| 1 | 第 42 行“搜索为零，却知道源码存在”行：“核客户端版本、工作树／HEAD 和忽略规则；搜索已知文件里的符号，与直接读取对照。确认获准读取且没有有意排除后，才对该文件用 shell `grep` 复核；权限拒绝不换入口绕过” | [Cursor 论坛 160373](https://forum.cursor.com/t/agents-grep-glob-tools-silently-return-zero-results-inside-any-cursor-managed-worktree/160373)，工作人员 mohitjain 2026-05-13 回复、用户 2026-07-21 追问；[Cursor 忽略规则](https://cursor.com/docs/reference/ignore-file)，未标版本／日期；读取 2026-11-03 | **确认**：160373 是 Grep/Glob 在工作树内静默零结果，Read、shell grep/find、编辑器搜索正常；工作人员称“confirmed bug”，计划两项修复（每个 worktree 独立搜索索引缓存目录；索引未就绪时回退直接搜索），并建议工作树内改用 shell grep。忽略规则文档确认 `.cursorignore` 阻止 Agent／Tab 与 @ mention，终端／MCP 不受其阻止，排除目录不遍历 | 保留 Read／shell grep 对照；核对客户端版本不能单独排除该 bug，因为官方未给版本。修复版本未知 |
| 2 | 第 56 行“检索依据”：“[Cursor 历史漏检及官方确认]…、[忽略规则误诊]…与[忽略规则]…，核实 2026-10-28；…历史故障修复版本未知” | [160373](https://forum.cursor.com/t/agents-grep-glob-tools-silently-return-zero-results-inside-any-cursor-managed-worktree/160373) #7／#10；[155500](https://forum.cursor.com/t/agent-editing-files-with-shell-python-permission-denied-from-read-and-strreplace-tools-when-using-git-worktrees/155500/10) #6（deanrie，staff，2026-03-22）／#10（mikej96，2026-03-25）；[忽略规则](https://cursor.com/docs/reference/ignore-file)；读取 2026-11-03 | **部分更正来源标签**：只有 160373 是工作人员确认；155500/10 是使用者自报，同帖 #6 还有工作人员的已知 Linux sandbox／worktree `.git` 指针文件问题（无 ETA）。两帖症状不同（搜索零结果 vs 文件工具权限拒绝），不能互作同一结论。两帖均无修复版本或发布回执，“修复版本未知”成立 | 引用时分开标注“官方确认／使用者自报”；不要把 155500 的“关 sandbox”写成推荐做法。`.cursorindexingignore` 在该官方页未提，边界未知 |
| 3 | 第 24 行：“先用 `git rev-parse --verify '<ref>^{commit}'` 得到提交” | [git-rev-parse](https://git-scm.com/docs/git-rev-parse)，Git 2.56.0，文档日期 2026-09-28；读取 2026-11-03 | **确认**：`--verify` 要求恰好一个参数、能转成对象库里的原始 SHA-1，否则报错；`^{commit}` 递归解引用到 commit。官方示例带 `--end-of-options`，用于不可信名字 | 可补 `--end-of-options`；不加也不影响普通分支名，但外部输入按官方加固 |
| 4 | 第 24 行：“克隆后若没有同名本地分支…改查 `refs/remotes/origin/<分支>`…随后用 `git show '<提交>:<文件路径>'` 读该版” | [git-rev-parse](https://git-scm.com/docs/git-rev-parse)、[gitrevisions](https://git-scm.com/docs/gitrevisions)、[git-show](https://git-scm.com/docs/git-show)，均 Git 2.56.0／2026-09-28；读取 2026-11-03 | **确认**：`refs/remotes/<refname>` 在 ref 消歧规则中列出；`<rev>:<path>` 指向该 tree-ish 下的 blob 或 tree；`git show` 对 blob 显示原始内容，对 tree 只显示名字。远端不叫 origin 时替换名称是操作约定 | 远端跟踪 ref 只代表上次 fetch 的状态；要当前远端版本先 fetch，再固定提交 |
| 5 | 第 29-30 行示例命令；第 33 行“两值相同表示文件字节一致；不同则对照固定原文，分清换行／消息包装变化与正文版本变化” | [git-rev-parse](https://git-scm.com/docs/git-rev-parse) 2.56.0／2026-09-28；[git-hash-object](https://git-scm.com/docs/git-hash-object)，文档最后更新于 2.43.0／2023-11-20；本机实跑 2026-11-03 | **确认**：`git rev-parse '<commit>:<path>'` 给出 blob；`git hash-object --no-filters` “Hash the contents as is, ignoring any input filter…including the end-of-line conversion”，正是字节口径。本卡把内联附文原样保存到仓外临时文件后哈希，得到 `a32f8ff…`，与 `git rev-parse 74be0d09:docs/decisions/context-management.md` 相同；页面示例的 `d0b9651` 仍解析为 `8a9cbae…`（9,971 字节） | 保留原命令；`received-page.md` 必须保存实际收到的正文，不能拿工作树同名文件代替。不同还可能来自 BOM 或尾部换行，不只看换行／包装 |
| 6 | 第 97 行：“Claude `@文件` 可引入内容” | [best-practices](https://code.claude.com/docs/en/best-practices)（锚点见第 4 条差量）、[common-workflows#reference-files-and-directories](https://code.claude.com/docs/en/common-workflows#reference-files-and-directories)、[tools-reference#read-tool-behavior](https://code.claude.com/docs/en/tools-reference#read-tool-behavior)、环境变量页 `CLAUDE_CODE_DISABLE_FILE_MENTIONS`；读取 2026-11-03 | **确认但需加条件**：@ 文件在符合 Read 工具 token 限额（默认 25,000 token）时含内容，文本超过 256KB 不含；目录只给清单；Read 拒绝的二进制文件只给路径；@ 还会把文件目录及父目录的 `CLAUDE.md` 加入上下文；关闭文件 mention 内容（v2.1.299+）后只给路径并要求读取 | 不要把 `@文件` 当作内容保证；检查点写路径并明确要求读取，恢复时核实际内容。25,000 token 到 256KB 之间的 @ 行为、只 @ 未 Read 的文件是否进入压缩后重读集合，官方未说明，记未知 |
| 7 | 第 97 行：“Codex `@` 文件选择主要加入路径，仍要明确要求读取” | [developer-commands#interactive-shortcuts](https://learn.chatgpt.com/docs/developer-commands#interactive-shortcuts) 与同页 `#highlight-files-with-mention`；页面未标版本／日期；读取 2026-11-03（HTML 与 `.md?surface=cli` 均核） | **精确化**：`@` 官方原文是 “add its path to the prompt”，即官方说明把路径加入提示，未说明是否同时包含内容；`/mention` 是 “Attach a file to the chat”“Codex adds the file to the chat”，但未说是否内联内容。“仍要明确要求读取”是操作建议，不是文档原话 | 保留页面的“主要加入路径”（官方说明是加入路径，未说明是否包含内容）；`/mention` 是否给内容未知，按需明确要求读取 |
| 8 | 第 97 行：“Claude 压缩后也可能只留下大文件的 `Referenced file` 路径，应核实际内容。检查点并不保证摘要无损。” | [context-window#what-survives-compaction](https://code.claude.com/docs/en/context-window#what-survives-compaction)，页面未标本条行为的版本／日期；同页另提 v2.1.198 只用于压缩摘要的 extended thinking；读取 2026-11-03 | **确认并补精度**：压缩后最多重读 5 个 Claude 读过或改过的文件，按最近修改优先；**超过 5,000 token** 的文件以路径引用返回、不含内容，显示 `Referenced file`。超过 5 个的文件不在重读集合；“大文件”容易让读者以为是超大文件 | 写明 5,000 token 与最多 5 个；检查点保存关键事实、文件和结果入口。该重读行为的起始版本未标，未知 |
| 9 | 第 101 行：“[Claude 引用](https://code.claude.com/docs/en/best-practices#provide-rich-content) 与 [压缩重载](https://code.claude.com/docs/en/context-window#what-survives-compaction)…[Codex 文件入口](https://learn.chatgpt.com/docs/developer-commands#interactive-shortcuts)” | 2026-11-03 直接检查三个文档的 HTML：`provide-rich-content` 无匹配；`write-a-specific-prompt`、`what-survives-compaction`、`interactive-shortcuts` 均有对应 id | **一处更正**：`#provide-rich-content` 已失效；@ 文件事实仍在 `#write-a-specific-prompt`。其余两个锚点有效 | 把 Claude 引用改到 `#write-a-specific-prompt`，或直接引 `common-workflows#reference-files-and-directories`；事实本身不改 |

## 已核无变化

- 本次实际核过的范围：固定页第 42 行“搜索为零”行、第 56 行“检索依据”、第 24／29-33 行“指定页面版本”段、第 97 行检查点段、第 101 行依据行；未核其他页面、模型／effort、真实会话与账号用量，未重复 AGENTS／CLAUDE 启动发现与导入批准。
- 页面示例的 `d0b9651b…:docs/decisions/context-management.md` 对象存在，blob 为 `8a9cbae46f165b9f723f8cec960d1a20742ec9ce`（9,971 字节）；与固定页 `74be0d09` 的差异是 24 行新增、3 行删除，属于示例版本与当前页不同，不是错误。
- Cursor 155500 的 #10 确为用户自报，帖内无工作人员回复该条；帖子 2026-04-16 由系统自动关闭。`worktree/*` 忽略条目导致文件工具失败这一事实保留为用户自报。
- Cursor 忽略规则页未提 worktree；worktree 相关只有论坛帖，不能写成官方文档结论。
- Git 2.56.0 的 `git-rev-parse`／`gitrevisions`／`git-show` 文档与 `git-hash-object` 的 `--no-filters` 契约均与页面用法一致；`git-hash-object` 页最后更新停在 2.43.0，但契约文字仍为当前页面内容。
- Claude `context-window#what-survives-compaction` 与 Codex `developer-commands#interactive-shortcuts` 的锚点均有效，内容分别支持“重读 5 个／超过 5,000 token 只留路径”和“@ 加路径”。

## 未知与所缺证据

- **Cursor 修复版本／ETA**：160373 工作人员只说 “The fix should land in an upcoming release”，2026-07-21 的追问无回复；155500 工作人员说 “no ETA”。两处都无版本号或发布回执，不能按发布时间或搜索摘要推断已修。
- **Codex `/mention` 是否内联内容**：官方只说把文件加入聊天，未说明内容是否进入上下文。
- **Claude `@` 的中间区间**：25,000 token 到 256KB 之间的文件用 @ 是给部分内容、路径还是报错，官方未说明；只 @、未发生 Read 的文件是否进入压缩后重读集合，也未说明。
- **GitHub 固定页面链接**：本次直接取 `github.com/dbvv1/a1dbv/blob/d0b9651…` 被网络域校验拦下，未取得远端页面；只核了本地对象存在与 blob 哈希，不能据此说远端链接已实际打开。
- **客户端实测**：Claude、Codex、Cursor 均只核官方文档／论坛原文，未启动客户端验证 @ 注入、压缩后重读或 Cursor 搜索；文档存在不等于实际行为通过。
- **本仓 `rg`／`grep` 阳性对照**：页面第 56 行提到本仓已做，本单元未复跑，不把它写成本次结果。

## 实际运行与检查

- 输入版本：提取任务文件内联附文，字节数 13,764、LF、CRLF 0；与 `git cat-file blob 74be0d09:docs/decisions/context-management.md` 字节相等。
- 页面方法：把附文原样写入仓外临时文件，`git hash-object --no-filters` 得 `a32f8ffdd9ce5c9389cc5c520cf32cf88cd42471`，与 `git rev-parse '74be0d09…:docs/decisions/context-management.md'` 相同；`git rev-parse --verify 'd0b9651…^{commit}'` 成功，示例 blob 为 `8a9cbae…`。
- 锚点：`curl` 取三个文档 HTML 后检查 `id`；`provide-rich-content` 0 处，`write-a-specific-prompt`、`what-survives-compaction`、`interactive-shortcuts` 均存在。
- 论坛：用 Discourse JSON 读 160373（4 帖）与 155500（7 帖），核到 `staff=true` 的 mohitjain（2026-05-13）与 deanrie（2026-03-22）；引用日期取自 `created_at`。
- 仓库检查：`python3 scripts/check_repo.py` exit 0（709 files，0 errors）；`python3 scripts/check_public.py` exit 0（1171 files，0 findings）；`git diff --check` exit 0（已对本文件执行 `git add -N`，空白检查覆盖）。
- 提交身份：本单元未提交。当前 `git config user.email` 是公司邮箱，不是公开安全的提交身份，未用于任何提交；接收端须沿用既有 noreply 身份发布结果分支。本单元不提交、不推送。
