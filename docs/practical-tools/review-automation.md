# 评审与自动化：官方 Codex Action 也要核对边界

> 核实时间：2026-10-12。👀 评估；具备隔离 runner、预算与最小权限后才转 🧪。
> 未创建 workflow、放入凭据、调用模型或运行 GitHub Actions；无发布操作。

## 原生基线与增量

先手动触发 Codex 评审，配合测试、lint、typecheck 与人工判断。任务每次变化很大时，先稳定输入/输出和失败标准再自动化，质量策略沿用 [09](../09-review-and-quality.md)。**[经验：采用判断]**

[openai/codex-action](https://github.com/openai/codex-action) 将 codex exec 接入 Actions，增量是统一触发与可追踪产物，不保证找到更多 bug。先输出供人审核的报告，不默认批准、合并或改写分支。项目 [LICENSE](https://github.com/openai/codex-action/blob/main/LICENSE) 为 Apache-2.0，OpenAI API 和 runner 费用另算，API-key 接入需独立预算与授权。**[一手：README/LICENSE；经验：设计]**

## 已核验的 tag、commit 与运行依赖

[官方 refs API](https://api.github.com/repos/openai/codex-action/git/matching-refs/tags/) 核实时最高数字版本标签是 **v1.13**；[v1.13 对象](https://api.github.com/repos/openai/codex-action/git/tags/83eeca45b831921e73d1f6a7955efccc568fe4e8) 与[浮动 v1 对象](https://api.github.com/repos/openai/codex-action/git/tags/1d82a3dba7c7988ec71ecae1ed5b8e8db96495c5) 都指向 **`bdf19a4a223ec2549a3e2274a0cf61556bc07675`**，tagger 时间 **2026-10-05 23:23:32 UTC**。[Releases API](https://api.github.com/repos/openai/codex-action/releases) 返回空列表；Git tag 不等于 GitHub Release，不能据空列表推断没有可用版本。浮动 v1 可移动，后续使用绑定完整 commit。**[一手：Git refs/tag、Releases API]**

已直接核对[该提交 action.yml](https://github.com/openai/codex-action/blob/bdf19a4a223ec2549a3e2274a0cf61556bc07675/action.yml)：定义并传递 `permission-profile`；定义并使用 `allow-bot-users`（不接受 `*`）；Windows runner 前置检查仅接受 `safety-strategy: unsafe`。这是固定源码路径确认，不是 workflow 实测，也不表示 main 全部能力都已核到此 tag。**[一手：固定源码，未运行]**

[#171](https://github.com/openai/codex-action/issues/171) 指出固定 Action SHA 不等于固定 Codex CLI；在上述固定源码中 `codex-version` 仍默认空，CLI 与 Responses API proxy 都按它安装。因此还需固定运行依赖，记录实际版本、输入提交与输出；不只写浮动 v1。**[社区：单例；一手：固定源码；经验：采用建议]**

## 凭据、不可信输入与 Windows

[安全文档](https://github.com/openai/codex-action/blob/main/docs/security.md) 把 PR 文本、提交消息、仓库指令和截图视为不可信输入，区分命令文件/网络策略与进程权限，并建议将 Agent 步骤与后续特权操作分离。只读文件系统不自动保护 API key。该处为核实日 main 安全文档，不承诺其全部细节均进入 v1.13。**[一手：安全文档]**

v1.13 固定源码的 Windows 限制仅属 **Action 实现**，不能外推成 Codex 产品没有 Windows 沙箱。Windows 主力读者可先在独立 Linux 托管 runner 评估，不为跑通示例打开 unsafe；自托管机需考虑 drop-sudo 造成持久系统改变。**[一手：固定源码；经验：暂缓条件]**

## 小范围试用的门槛

待执行设计 **[经验：设计]**：
1. 明确谁能触发、仓库读取范围、模型预算和报告接收者，不向任意外部用户开放付费 key。
2. 固定依赖、最小权限；Agent 不持不必要推送/部署凭据，不运行不可信 PR 的任意安装脚本。
3. 设置超时、并发和输出 schema；失败/空报告不能写成“没有问题”。
4. 选窄任务，例如提取变更风险，与人工基线比较有效发现、误报、漏报、时长和费用。
5. 发布报告/改状态用独立校验步骤，不将模型文本直接拼入 shell。

没有独立证据证明额外评审 SaaS 更好，本模块不顺手列一排推荐。任务不稳定、误报费人工或无法控制凭据边界，就保持手动触发。

[返回模块](README.md) · 评审策略见 [09](../09-review-and-quality.md)，安全背景见 [10](../10-security.md)
