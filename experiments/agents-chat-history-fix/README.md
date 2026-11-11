# Chat Completions 历史修复候选

**局部修复已获双独审通过，SDK 完整门禁仍受阻，不建议应用到正式项目。** 候选处理 [Agents SDK #5454](https://github.com/openai/openai-agents-python/issues/5454)：使用不受 Chat Completions 支持的服务端状态设置后，工具往返丢失本地历史。普通应用先按[上下文页](../../docs/decisions/context-management.md#agents-chat-history)去掉这些设置。

- 固定上游基线：`d68961657843c7d81dfc25834484f8aac2957eb3`。
- [补丁](change.patch)包含三个运行时文件和完整请求边界回归测试；SHA256：`c4537a7d705c6c853159b7669d89ca66ee914cd0dffcc5a52270abd1e9619c6c`。
- 当前修订由同一输入准备入口生成完整历史及 occurrence 映射，保留 Responses 默认增量模式；此前分开生成映射与历史的方案未通过审查，不在此保留为可用方案。
- 当前冻结版双独审未发现阻断缺陷，格式、lint 与完整类型检查通过；SDK 最终测试受本环境的 Unix socket 权限及原基线快照失败阻挡，后续串行阶段未运行。不能据此称完整门禁通过，也不证明真实模型、原生 CLI 压缩或新版长任务路线已经完整采用。

上游源码采用 [MIT](LICENSE.upstream)。未向上游提交代码、PR 或评论。
