# D4 来源记录：VibeTunnel 移植后的所有权维护

> 核实：2026-10-12（北京时间）。只读公开原文、固定源码、PR 历史与 CI；未安装／运行上游、调用模型或接触私人会话。正文与采用判断见 [24](../24-community-workflows.md#不同作者的后续维护vibetunnel-的内存所有权修复)，任务入口见 [15](../15-task-playbooks.md#5-大规模迁移与升级)。

## 固定证据与时间顺序

- **V1 [社区：作者经历]**：[Peter Steinberger，2025-12-28](https://steipete.me/posts/2025/shipping-at-inference-speed)明确将此前搁置的转发器转换归于 Codex，报告两句请求、五小时以上运行和多次压缩。原文链接的是 [6a1693b…a81b29e 比较范围](https://github.com/amantus-ai/vibetunnel/compare/6a1693b482fa4ef0ac021700a9ec05489a3a108f...a81b29ee3de6a2c85fd9fa41423d968dcc000515)，不是逐行 AI 作者证明。未取得原始会话、精确模型、人的主动时间；不从文章周围的 GPT-5.2 讨论补全这些信息。
- **V2 [一手：移植快照]**：固定结束点 [`a81b29ee3de6a2c85fd9fa41423d968dcc000515`](https://github.com/amantus-ai/vibetunnel/commit/a81b29ee3de6a2c85fd9fa41423d968dcc000515)，2025-12-19 UTC。已读 [docs/zig.md](https://github.com/amantus-ai/vibetunnel/blob/a81b29ee3de6a2c85fd9fa41423d968dcc000515/docs/zig.md)、[git.zig](https://github.com/amantus-ai/vibetunnel/blob/a81b29ee3de6a2c85fd9fa41423d968dcc000515/native/vt-fwd/src/git.zig) 全文与 [main.zig](https://github.com/amantus-ai/vibetunnel/blob/a81b29ee3de6a2c85fd9fa41423d968dcc000515/native/vt-fwd/src/main.zig) allocator／调用／首次序列化段。目标是降低每进程延迟与 RSS、Unix/macOS、无 daemon、保持 session 文件／IPC；未读取性能结果。活动检测是明确删除的功能，不把此次称为全功能等价移植。
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
