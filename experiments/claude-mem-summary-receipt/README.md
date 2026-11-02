# Claude-mem：重复摘要修复，要验到索引和启动上下文

**重复 Stop 不应占满历史摘要窗口；接收“按回合合并”补丁时，同时看原 ID、检索结果、重开后的数据和实际注入文本。** claude-mem 现有 #5228 在本次离线消费者中改善了这条链，但非空短内容仍覆盖长内容、旧重复行仍保留；不能把它当无损记忆或历史数据清理，也不据此安装整套插件。

## 真实输入与接收选择

[使用者 #5225](https://github.com/thedotmack/claude-mem/issues/5225) 报告：后台任务通知再次唤醒 Agent，但没有新的 UserPromptSubmit，后续 Stop 仍属同一 `prompt_number`。原实现不断插入摘要，相近内容占满 newest-N 窗口；末次空摘要还可能遮住此前的完成信息。

已有 [#5228](https://github.com/thedotmack/claude-mem/pull/5228) 尝试在 `storeObservations()` 中更新同 session／回合的最新本地摘要，维持 ID，合并部分空字段与文件列表，再通知下游。本次接收原补丁，不另写重复实现或向上游投稿。**限定接收新写入的同回合摘要合并；历史清理、无损语义、Chroma／云端全链仍不能按这组结果通过。**

适用于正核同类补丁或已经遇到重复摘要的维护者；只是希望跨会话接续任务时，先用[现有交接记录](../../templates/generic/.claude/skills/handoff/SKILL.md)，不为这项组件结果增加捕获工具。长程路线默认与 🟡 状态不变。

## 从真实数据库走到消费者

固定当前 master `b50ee1ee`（15.8.3）与原 PR `7cd15287`，其实际 merge-base 就是该 master。两版接收完全相同的合成输入：旧 session、旧回合、当前回合连续三次摘要、另一个项目、后续新回合。

独立消费者用真实 file-backed SQLite `SessionStore`、`SessionSearch`／FTS triggers、`querySummariesMulti()` 和 `renderContextFromRows()`，关闭重开后再查询、渲染；不是用测试替身返回预设摘要。四摘要窗口下：

| 实际观察 | 基线 | 原 PR 候选 |
|---|---|---|
| 同一回合三次写入的 ID | 3／4／5 | 3／3／3 |
| 主项目摘要行／全部项目行 | 6／7 | 4／5 |
| 最后上下文中的两条旧历史标题／ID | 都被挤出 | 都保留 |
| 重复 Stop 后的 learned／completed 正文 | 空末次摘要遮住旧内容 | 保留旧非空字段 |
| FTS 旧 next_steps 关键词 | 仍匹配旧行 3 | 不再命中 |
| FTS 新 next_steps 关键词 | 行 4、5 | 原行 3 |
| 关闭重开后的全部行字段和最终渲染 | 一致 | 一致 |
| 另一项目混入主项目查询／文本 | 没有 | 没有 |

**历史进入窗口不表示旧正文全部注入。** 最终文本保留的是历史标题／ID，正常 renderer 只展开最新摘要；空字段保护的正文对照取自重复 Stop 后、下一回合写入前。重开后核了全部行和文本，没有另做一次 FTS 关键词查询。

候选本地元数据还观察到 `sync_rev` 从 1 到 3、合成 `synced_at` 清空、文件列表并集；这只是待同步状态，没有连接云端。

## 缓存补验

独立追加真实 `ContextCacheService`，render 回调仍走生产 query／render；只在新数据目录运行进程内缓存类，没有启动 worker。两版同样观察到：**更新返回后立即读仍是旧缓存，direct render 已是新内容；显式 flush 后缓存与 direct 文本逐字一致。**这是共有的异步刷新窗口，不能归因于新 PR。保留默认 debounce 配置，但没有等待宿主定时刷新，不能把配置的 2 秒写成测得延迟。

## 需要保留的边界

- **非空不等于信息完整。** 实测把长 learned 改成 `Brief` 后，候选仍覆盖旧内容，旧词不再命中；这不是语义级合并。`next_steps` 采用最新值，包括空值清除；文件列表并集也不会删掉旧路径。
- **已有重复不会自动消失。** 合成旧库先存两条同回合摘要，候选只更新最新一条，仍是两条；基线继续插第三条。没有运行任何历史清理或删除用户数据。
- **入口范围要对齐。** 补丁改的是 worker 实际使用的 `storeObservations()`，独立 `storeSummary()` 没改。静态条件还限定非零 promptNumber、本地 origin；零／未知回合没有实做消费者，remote-origin 只有上游定向测试。
- **向量和云端仍需各自验收。** 静态追踪确认 worker 将合并后的对象与 `summaryUpdated` 传入 Chroma 的 replaceExisting 分支；本次没启动 Chroma、云同步或真实 provider。合并还会改调用者传入的对象，比较时先保存输入副本。

## 执行范围、检查与安装争议

独立云端使用官方 Bun 1.4.4，运行带 `--no-install`，业务路径不自动装依赖。进程首次 import 前固定合成 HOME、配置／数据、XDG 与临时目录；禁 prior-message 读取和 health/account 路径，mode 来自固定源码的公开 `code.json`。仓库 preload 隔离遥测和账户就绪检查，SQLite／query／render 没有 mock；fetch tripwire 为 0 次，只是额外检测，不是 OS 网络沙箱。

定向检查：原 transaction 文件基线 **9 通过**、候选 **15 通过**；另三份已审的摘要／compiler／renderer 测试两版各 **31 通过**；候选 notes-only context 另 **4 通过**。消费者两版与独立断言均 exit 0。首次消费者漏初始化 ModeManager，两版都在渲染时失败；原 DB／日志保留，补齐固定 mode 后换新目录完成，没有把准备错误算成产品缺陷。

没有运行完整 fast／integration、全目录 context、typecheck 或 `build-and-sync`：其中存在 HTTP／worker、真实安装和重启路径，不属于本轮消费者范围。不是整个项目检查全通过。

2026-11-02 08:43 UTC 原 PR 精确 head 的托管快照：**13 checks 成功、1 个 macOS decoder 仍在运行**；3 个 workflow 中 2 成功、1 在运行。PR 仍 open／未合并，不能写成全部 CI 已绿。

**安装风险按版本核，不能照搬旧帖。** [#5176](https://github.com/thedotmack/claude-mem/issues/5176) 针对 15.5.0 等历史安装流程提出会话上传争议；当前固定 15.8.3 源码已包含 `awaiting-consent` 与 `confirmUpload` 分支。这里只静读，未验证安装 UI／实际上传，也没有读取真实会话、执行安装器、注册 Hook 或连接账户。组件通过不支持整包隐私或安装推荐。

输入、时间与保留范围见 [results.json](results.json)。原始 stdout／stderr、首次失败、实际 DB、渲染文本、消费者和缓存脚本、固定源码与原补丁保留；公开页仅投影合成任务的结论。

**来源与核实：2026-11-02。** 官方 [固定源码](https://github.com/thedotmack/claude-mem/tree/b50ee1ee8edae3544655356e7511dc8230133ff2)、[原补丁](https://github.com/thedotmack/claude-mem/pull/5228/files)、[当前上传选择分支](https://github.com/thedotmack/claude-mem/blob/b50ee1ee8edae3544655356e7511dc8230133ff2/src/services/prompt-import/setup-scan.ts#L215-L244)；真实用户输入为 #5225，历史争议为 #5176。项目 Apache-2.0，约 11 万 stars 只作为发现信号。
