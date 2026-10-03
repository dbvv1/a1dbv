# 安全

## 1. 密钥与敏感信息

- **永远不要**把 API Key、MCP token、`.env`、`~/.claude.json`（含登录凭证与项目历史）提交到仓库——本仓库是 public。
- 权限规则里拒绝读取敏感文件：`"deny": ["Read(.env*)", "Read(**/secrets/**)"]`。
- MCP 的 token 用环境变量注入（`.mcp.json` 支持 `${ENV_VAR}` 展开），不要写死。
- 提交前可用 [gitleaks](https://github.com/gitleaks/gitleaks) / [trufflehog](https://github.com/trufflesecurity/trufflehog) 扫描；GitHub 也有 Secret Scanning。

## 2. 提示词注入（Prompt Injection）

Agent 读取的任何外部内容（网页、Issue、PR 评论、第三方文档、MCP 返回值、Asset Store 包里的注释）都可能夹带“指令”。

- 对不可信输入启用更严格的权限模式。
- 不要让 Agent 在读了不可信内容后，自动执行推送、发消息、删除类操作。
- 高风险操作（push、发布、删除）放进 `ask` 或 `deny`。

## 3. MCP / Skill / 插件供应链

- 第三方 MCP Server 是**在你机器上运行的代码**，Skill 是**给 Agent 的指令 + 脚本**——安装前读源码/内容。
- 关注“工具投毒”（tool poisoning）：恶意 MCP 在工具描述里塞隐藏指令。
- 优先选择：官方 / 高 star / 活跃维护 / 可固定版本的项目；**固定版本号**而非总是 `@latest`。
- 只装需要的：每多一个 MCP 就多一份攻击面和上下文消耗。

## 4. 执行边界

- 不在主力机上用 `bypassPermissions`；需要全自动时用容器/云端沙箱。
- Codex 默认沙箱、Claude Code 的 auto 模式 + 权限规则，都是“纵深防御”的一层，不是全部。
- 在 Unity 项目里额外保护：`ProjectSettings/`、`Packages/manifest.json`、打包签名文件、平台 SDK 配置。

## 5. 代码与 IP

- 公司项目代码是否允许发送到云端模型？先确认合规要求；必要时用本地模型或企业版（零数据保留）。
- AI 生成的美术/音频资源注意**商用许可**（见 [`unity/03-asset-generation.md`](../unity/03-asset-generation.md)）。
