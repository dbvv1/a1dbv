# Codex 辅助补丁怎样被接收：Immich Android 删除同步

调查：2026-10-13（UTC+8）；历史事件日期按原帖记录。历史案例发生于 2026-02 至 2026-04；不作为当前模型能力或生产力排名。只读 GitHub 原帖、审查、提交 diff、固定源码与 CI 元数据，未运行 Flutter、未接触真实照片或设备。

## 可以改变的建议

交接不仅要解释“改了什么”，还要把接收方的意见、实际采用的补丁和最终行为对齐。优先更新已有 PR 的最终说明，而非增加一套长模板。尤其是审查回复后来被代码推翻时，应写清最后采用的接口和支持边界。

## 证据链

1. **用户症状与环境（2026-02-06）**：[原报告](https://github.com/immich-app/immich/pull/16732#issuecomment-3860567899)称服务器和 Android 客户端均为 2.5.3：Web 删除并清空回收站后，下次客户端同步又上传照片，即使开启 Sync remote deletions。它是报告者的环境陈述，不是我们复现。
2. **复现与 PR（2026-02-09）**：[Issue #26069](https://github.com/immich-app/immich/issues/26069)列出备份开启、相册被选入备份、远端删除同步开启等条件；该 issue 当天被机器人按 duplicate 关闭，不是合并修复的证明。[PR #26070](https://github.com/immich-app/immich/pull/26070)解释原路径依赖远端回收站状态，立即清空会错过本地入回收站，因此加入永久删除事件处理。
3. **第一轮接收意见（2026-02-12）**：接收方 shenlong-tanwen 要求移除仓库查询通用 helper、暂将循环留在具体方法内，同时对不读取结果的 join 设置 useColumns: false。[审查](https://github.com/immich-app/immich/pull/26070#discussion_r2798278350)。GitHub API 的 author_association 为 MEMBER，后来也是合并者。
4. **可对照的落实（2026-02-13）**：[c552e0fad450110306bfd3e499f1fa481a44d610](https://github.com/immich-app/immich/commit/c552e0fad450110306bfd3e499f1fa481a44d610)确实移除 _getAssetsFromBackupAlbumsByStringKeys，把分批循环放回两个查询方法，并在相应 join 上设 useColumns: false。作者随后[回复 done](https://github.com/immich-app/immich/pull/26070#discussion_r2804060117)。因此不是只有口头承诺。
5. **第二轮与旧解释过期（2026-02-15 至 02-23）**：接收方[询问](https://github.com/immich-app/immich/pull/26070#discussion_r2809697733)普通 trash 事件能否也使用 assetId 和新方法。作者 02-16 [回复](https://github.com/immich-app/immich/pull/26070#discussion_r2812046469)倾向保留两方法，理由是仍按 checksum 匹配且额外 join 更重。但 02-23 的 [ef83e58112a0361a34b5055111d433388e44215c](https://github.com/immich-app/immich/commit/ef83e58112a0361a34b5055111d433388e44215c)最终统一为 remoteIds，将双方法收敛为单一方法并删去旧处理入口，测试期望也从 checksum 改成 remote ID。公开记录没有说明为什么改变取舍；不能把 02-16 的回复当最终设计，也不能编造内部说服过程。
6. **批准、合并与最终产物**：02-27 [批准](https://github.com/immich-app/immich/pull/26070#pullrequestreview-3868344479)针对最终 head fe5c431f7e84b3faca4d8f1c77ec73fb3a74fda1。04-27 21:16:49（UTC+8） 由 shenlong-tanwen 合并为 [5a457d72c97ee25704f5af460ca9d91f90b91e0c](https://github.com/immich-app/immich/commit/5a457d72c97ee25704f5af460ca9d91f90b91e0c)。合并 diff 保留两轮实际改动。批准到合并的日历间隔不是审查工时，原因未知。

## 接管者需要知道的最终行为

[固定实现](https://github.com/immich-app/immich/blob/5a457d72c97ee25704f5af460ca9d91f90b91e0c/mobile/lib/domain/services/sync_stream.service.dart)：普通 trash 事件与永久删除事件共用 _handleRemoteDeleted，输入 remote ID；永久删除先查询并处理本地候选，再删除本地远端资产记录。操作受 Android、manageLocalMediaAndroid 开关和 MANAGE_MEDIA 权限限制，作用是将匹配的本地资产移入设备回收站，并非无条件永久删除所有本地照片。

[固定查询](https://github.com/immich-app/immich/blob/5a457d72c97ee25704f5af460ca9d91f90b91e0c/mobile/lib/infrastructure/repositories/local_asset.repository.dart)：remote ID 是查找输入，但 local/remote 关联仍经 checksum join；只取 backupSelection.selected 的相册。这两个概念不能在交接时混成“匹配方式已改为本地 remoteId 字段”。

## 验证与归因边界

- AI 使用的直接证据是 PR 作者自述：GPT-5.3 Codex 帮助核对 SQL 并辅助写测试。没有公开完整会话，不能称整份 PR 或两轮审查修订均由 Codex 独立完成。
- 最终 head 的 [Mobile unit](https://github.com/immich-app/immich/actions/runs/22313397484/job/64551443967) 和 [Dart analysis](https://github.com/immich-app/immich/actions/runs/22313397514/job/64551440195) 成功；合并 SHA 的 [Mobile unit](https://github.com/immich-app/immich/actions/runs/24997301940/job/73197580831) 和 [Dart analysis](https://github.com/immich-app/immich/actions/runs/24997301922/job/73197573200) 亦成功。这是 GitHub 检查结果，不是本次独立运行。
- 合并 SHA 共返回 55 个 check runs，其中 [Build and sign iOS](https://github.com/immich-app/immich/actions/runs/24997301890/job/73197570610) 和 [prebuild](https://github.com/immich-app/immich/actions/runs/24997306329/job/73197549741) 为 failure。未取得失败步骤，不能写“合并全绿”，也不能把它们归因为本补丁。若只需要说明接收闭环，不必进一步挖尚未确定相关性的构建日志。
- [固定测试](https://github.com/immich-app/immich/blob/5a457d72c97ee25704f5af460ca9d91f90b91e0c/mobile/test/domain/services/sync_stream_service_test.dart#L395-L502)证明接口参数和调用变化，但新增永久删除用例将仓库返回值 mock 为空，只验证 remote ID 查询发生、数据库删除继续进行、不调用设备移入回收站。它本身不证明真实 Android 上“不再重传”的完整路径，也不证明真实 SQL join 成功。
- PR 有人工复测步骤说明，但缺指定设备复测记录、真实用户修复后反馈和支持工时。已完成的是公开的 issue→人工审查→对应补丁→批准→合并/检查链，尚不能宣称长期接管成本已降低。

## 候选筛除记录

- Immich #23819：有明确 GPT-5 Codex High 辅助披露且已合并，但读取评论只有赞许/批准，未见接收方要求导致的具体修订；不满足本题主链。
- Immich #24914：有 GPT-5.2 Codex 初稿披露和维护者 let→const 建议，但过于局部，难改变交付或接管建议；不选作主例。
- Immich #27774：网页显示 Codex 使用声明，但仍等待 code owner 审查，未取得接收修订闭环；不选。
- Mermaid #7795：读取到 Claude Sonnet 4.6 co-author 和 lexer/build 修复，但这些提交本身不能证明由接收维护者意见驱动；本轮不继续作为主例。
- voidmatcha/e2e-skills：读取 README 所列上游 PR 仅作线索，未据其成功清单推断模型归属或审查成本。

下一条更有价值的证据是：不同项目中接管者完成第二次变更/恢复，或出现修复后的真实用户复测。继续挖本例同一条历史 CI 不会自动补上这项缺口。
