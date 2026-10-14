主线：三，兼四
改变的建议：15迁移／24：移植后的所有权义务需单独验证；15补验新版本写入的状态能否被旧版本消费，恢复后也不能自动再生不兼容状态
新证据：历史移植、原始修复、arena binding再修订、固定源码与 CI skip；10-14追加Git MIDX原始故障、默认格式回退与发布标签源码；无本次上游执行或人力计时

# D4 来源记录：VibeTunnel 移植后的所有权维护

> 核实：2026-10-12（北京时间）。只读公开原文、固定源码、PR 历史与 CI；未安装／运行上游、调用模型或接触私人会话。正文与采用判断见 [24](../24-community-workflows.md#不同作者的后续维护vibetunnel-的内存所有权修复)，任务入口见 [15](../15-task-playbooks.md#5-大规模迁移与升级)。

## 固定证据与时间顺序

- **V1 [社区：作者经历]**：[Peter Steinberger，2025-12-28](https://steipete.me/posts/2025/shipping-at-inference-speed)明确将此前搁置的转发器转换归于 Codex，报告两句请求、五小时以上运行和多次压缩。原文链接的是 [6a1693b…a81b29e 比较范围](https://github.com/amantus-ai/vibetunnel/compare/6a1693b482fa4ef0ac021700a9ec05489a3a108f...a81b29ee3de6a2c85fd9fa41423d968dcc000515)，不是逐行 AI 作者证明。未取得原始会话、精确模型、人的主动时间；不从文章周围的 GPT-5.2 讨论补全这些信息。
- **V2 [一手：移植快照]**：固定结束点 [`a81b29ee3de6a2c85fd9fa41423d968dcc000515`](https://github.com/amantus-ai/vibetunnel/commit/a81b29ee3de6a2c85fd9fa41423d968dcc000515)，2025-12-19 UTC；[组件目录](https://github.com/amantus-ai/vibetunnel/tree/a81b29ee3de6a2c85fd9fa41423d968dcc000515/native/vt-fwd)。已读 [docs/zig.md](https://github.com/amantus-ai/vibetunnel/blob/a81b29ee3de6a2c85fd9fa41423d968dcc000515/docs/zig.md)、[git.zig](https://github.com/amantus-ai/vibetunnel/blob/a81b29ee3de6a2c85fd9fa41423d968dcc000515/native/vt-fwd/src/git.zig) 全文与 [main.zig](https://github.com/amantus-ai/vibetunnel/blob/a81b29ee3de6a2c85fd9fa41423d968dcc000515/native/vt-fwd/src/main.zig) allocator／调用／首次序列化段。目标是降低每进程延迟与 RSS、Unix/macOS、无 daemon、保持 session 文件／IPC；未读取性能结果。活动检测是明确删除的功能，不把此次称为全功能等价移植。
- **V3 [一手：原始贡献；社区：故障描述]**：[PR #566](https://github.com/amantus-ai/vibetunnel/pull/566)由 ndraiman 于 2025-12-27 开启。通过 [timeline](https://api.github.com/repos/amantus-ai/vibetunnel/issues/566/timeline) 的历史 review commit 追到仍可读的 [`475767cbc24a6724353b7a664cc0bc1349c7e448`](https://github.com/amantus-ai/vibetunnel/commit/475767cbc24a6724353b7a664cc0bc1349c7e448)，再沿 parent 读取 [`02adf5678ed119301aa79a78a030840ba943d124`](https://github.com/amantus-ai/vibetunnel/commit/02adf5678ed119301aa79a78a030840ba943d124)。原提交先删除过早 free，再引入 arena；提交说明将崩溃关联到没有 upstream 的仓库。两笔均是十二月原始历史，不是将六月重写后的时间冒充首次修复时间。
- **V4 [一手：整理与修复的修复]**：2026-06-11 的三笔 [PR commits](https://api.github.com/repos/amantus-ai/vibetunnel/pulls/566/commits)：[`11badeac6468041ebca8396bb1055614aa038c1a`](https://github.com/amantus-ai/vibetunnel/commit/11badeac6468041ebca8396bb1055614aa038c1a)保留贡献者署名；[`734f9fdab1311740337df4de176d68964df94117`](https://github.com/amantus-ai/vibetunnel/commit/734f9fdab1311740337df4de176d68964df94117)加无 upstream 回归；[`a48f1114e667a8bedd28d96e3d02f5ac482b9d5f`](https://github.com/amantus-ai/vibetunnel/commit/a48f1114e667a8bedd28d96e3d02f5ac482b9d5f)纠正 arena binding。timeline 显示维护者账号 force-push 后合并为 [`586a728d4138a96338b05943f05576a25f0679d7`](https://github.com/amantus-ai/vibetunnel/commit/586a728d4138a96338b05943f05576a25f0679d7)，仅改 git.zig、main.zig、CHANGELOG。已读全部三笔补丁和合并 PR diff。
- **V5 [一手：CI；社区：运行记录]**：精确 head `a48f1114` 的 [CI run 27350878910](https://github.com/amantus-ai/vibetunnel/actions/runs/27350878910)及 [jobs](https://api.github.com/repos/amantus-ai/vibetunnel/actions/runs/27350878910/jobs)显示 Detect changes 成功；Node.js／Mac／iOS CI 全部 skipped。PR 当前 body 报告旧 main 五次退出 139、Zig 0.15.2 allocator 检查和原生 Linux E2E 通过；未独立重跑，也未取得对应远端运行的完整原始日志。不能把这两组材料拼成 hosted CI 已运行原生测试。

## 机制、归属与结论边界

- **[一手／研究]** 初始快照的 repo_path 在函数结束释放，branch 在 if 块结束释放，返回对象和后续 SessionInfo 仍持有切片。这是可读的生命周期不匹配；不声称 `a81b29e` 这一笔 diff 引入了它，该笔 git.zig 补丁主要改变 child I/O。没有从该快照向更早父提交定位首次引入点。
- **[一手／研究]** 原 arena 修复从 local arena 取得 allocator，再把 arena 值复制进 info；后续修订直接从 info.arena 取得 allocator。另读 [Zig 0.15.2 arena_allocator.zig](https://github.com/ziglang/zig/blob/0.15.2/lib/std/heap/arena_allocator.zig) 的 allocator／deinit：前者保存 `.ptr = self`，后者遍历该对象的 `state.buffer_list`。分配必须记入最终负责清理的同一对象，而非只让返回的字符串暂时可读。主张是源码层机制，崩溃次数和运行通过仍归 V3/V5 的项目报告。
- **[一手]** 新测试创建有空提交、无 upstream 的真实临时 Git 仓库，使用 std.testing.allocator，函数返回后检查 repo／branch／main repo 路径和空 ahead/behind，再调用 info.deinit。它不直接反复写 session.json，也不证明整个 forwarder 的生命周期都正确。
- **[研究]** 人的可见介入是外部贡献者提交故障诊断与修法、维护者账号整合和进一步纠正；公开账号与 commit author 不证明其内容没有 AI 协助。当前 PR body 经更新，不能当成十二月原始人类对话或逐条指令。未取得首次修复所有讨论、人工审查时长、用户复测确认或持续使用统计。
- **[研究]** 从十二月到六月的日历间隔不等于投入工时、持续故障时长或某个模型的维护成本。一个缺陷也不否定作者报告的初次转换能力；本例支持“迁移改变内部所有权义务、局部修复可保留外部契约”，不支持普遍效率排名。

## 后续与未选线索

- **[一手／研究]** 后来 [PR #709](https://github.com/amantus-ai/vibetunnel/pull/709)于 2026-07-11 合并为 [`f5c9b388c58f48d44d0f6431ea25228452688f57`](https://github.com/amantus-ai/vibetunnel/commit/f5c9b388c58f48d44d0f6431ea25228452688f57)，改成 Rust 1.97.0、保留 Darwin universal 与 Linux glibc 2.28 约束；固定 [forwarder.md](https://github.com/amantus-ai/vibetunnel/blob/f5c9b388c58f48d44d0f6431ea25228452688f57/docs/forwarder.md)仍说明 session 文件和 IPC 边界。已读 PR body／comments、提交清单及该文档，未全审大补丁。本轮已读材料未说明选择动机，不将 #566 或 Zig 0.16 升级自动当成换语言原因，也不宣布后续无 bug。
- **[研究：候选取舍]** [CodexBar #708](https://github.com/steipete/CodexBar/pull/708)有电池反馈和 Codex review，但未补齐初次实现的 AI 归属链；[VibeTunnel #574](https://github.com/amantus-ai/vibetunnel/pull/574)披露 Claude 协助的 Zig 0.13／Raspberry Pi 适配，但已关闭未合并，Node fallback 自述未核实；[#575](https://github.com/amantus-ai/vibetunnel/issues/575)报告的 beta.15 早于十二月移植，不能接成此次转换的后果；[#611](https://github.com/amantus-ai/vibetunnel/pull/611)补编译前提，单独不足以解释维护转折。因此只采用上述所有权链为第二例。

两例已足以形成限定任务建议，不以继续堆案例为完成条件。下一候选是 D6：把证据转成 Codex 的最小任务起点与改变工作流的具体条件；尚未认领。长期用户负担和人的主动时间仍未知。**[经验：本侧下一步判断]**


## 持久状态回退：Git MIDX 的旧读取者边界

> 核实：2026-10-14。主线四，兼三；补充 15 §5 的迁移验收。以下是 2026 年 4 月的非 AI 项目证据，只迁移其验收机制，不证明 Agent 的效率或维护能力。

**真实失败先于默认值收窄。** Johannes Schindelin 在 [4 月 15 日原始邮件](https://www.spinics.net/lists/git/msg523938.html)报告：以 `v2.54.0-rc2` fetch 后，同一仓库被 `v2.53.0` 读取时因不识别 MIDX v2 而退出。原帖提及混用 Git 版本、降级及第三方实现的风险；实际报告只确认上述两个 Git 版本，不能把 libgit2/JGit 也写成已失败。**[社区：维护者实际运行报告]**

此前 [`b2ec8e90c201d2395b67f89f3bf38bb472e43460`](https://github.com/git/git/commit/b2ec8e90c201d2395b67f89f3bf38bb472e43460)为支持 MIDX 层压实，放宽 pack 名排序约束并默认写 v2；提交说明认为旧 Git 会忽略不可用索引。Jeff King 的[原始诊断与候选补丁](https://www.spinics.net/lists/git/msg523949.html)指出旧读取路径仍有 `die()`，并报告在 2.53 上局部改为报错后放弃加载可继续工作；这不是最终合入的修法，也不是原报告者复测。**[一手：固定源码；社区：补丁作者运行报告]**

**清掉产物不等于持续恢复。** Stolee 的[后续澄清](https://www.spinics.net/lists/git/msg524130.html)说明，混用版本时普通维护会再次生成 v2，仅删除索引不能长久解决；Hamano [确认](https://www.spinics.net/lists/git/msg524140.html)还需限制写入版本，或采用已进入 master 的修订。这是维护者的机制判断与恢复建议，未取得用户执行该恢复路径后的记录。**[一手：原始维护讨论]**

最终 [`a12382f99488b8cea82f59a310084e43ff84e99b`](https://github.com/git/git/commit/a12382f99488b8cea82f59a310084e43ff84e99b)没有撤掉新能力：普通写入默认 v1，明确调用 compact 才选 v2，随后仍允许 `midx.version` 配置覆盖；文档同时注明 compact 产物不能供 2.54 之前的 Git 读取。补丁调整 `t5319` 的头部版本预期，既有 [`t5335`](https://github.com/git/git/blob/a12382f99488b8cea82f59a310084e43ff84e99b/t/t5335-compact-multi-pack-index.sh) 继续覆盖 compact 自动选 v2 及强制 v1 的拒绝路径。已读补丁与 [v2.54.0 标签提交的写入分支](https://github.com/git/git/blob/94f057755b7941b321fd11fec1b2e3ca5313a4e0/midx-write.c#L1277-L1289)，并通过 [提交到标签的祖先比较](https://github.com/git/git/compare/a12382f99488b8cea82f59a310084e43ff84e99b...v2.54.0)确认收录；不能把 rc2 的默认行为概括为正式 2.54.0 的默认故障。**[一手：合入产物与发布标签]**

**✅ 有混用或降级要求时，用新版本写过的状态验旧读取者，并检查恢复后谁还会自动写入。** 新格式只服务可选能力时，可以保留能力、收窄默认启用范围；若业务状态不可逆，应另定迁移/恢复方式，不能把这里可重建的索引推广为“删缓存即可回滚”。这是对 Agent 编写升级方案的验收要求，不要求所有纯代码修改增加版本矩阵。**[经验：采用判断]**

本轮只读原始邮件、固定补丁与标签源码；Git Rev News 仅作发现入口。没有安装或执行 Git 上游版本、运行其测试、取得原报告者在最终修订上的成功重试或实际接管工时。当前证据支持纠正默认策略和持久状态边界，不支持已经完成用户恢复闭环。**[研究：验证范围]**
