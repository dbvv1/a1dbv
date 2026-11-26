# 按需操作参考

> [运行细则](operations.md)是发布和运行入口；本页保留执行资源、社区检索通道及 GitHub 集成设置参考，仅在对应操作时按需读取。

## 执行资源

11-24 起，云端探索/知识协作者（`dot-a` / `dot-b`）收窄为纯粹的知识岗，只负责调研、核源、复核与规则/文档沉淀；所有构建、测试、浏览器 smoke、出图、产品改默认与部署等运行期执行均在本机方向会话或本机 `local-jobs` 完成，不重开云端代码流水线。

| 资源 | 适合承担 | 边界 |
|---|---|---|
| 云端知识协作者（`dot-a` / `dot-b`） | 外部资料核源、交叉审计、试验选题与方法沉淀 | 只写知识与记录文档；不改代码、不跑构建/出图 |
| 本机执行环境 / 方向会话 | 代码与资产实现、本地构建与测试、真实 GPU 渲染与 smoke、发布决策 | 游戏与浏览器运行均在本机，同实例单写者 |
| 本机固定接收脚本（[细则§2.2](operations.md#22-本地模型协作)） | 规格与命令已写死的机械校验或对比单元 | 由方向会话派发并验收；接收端不自主扩改范围 |

## 社区渠道

**探索分工**：大批量候选检索或结构化初筛可按清晰范围交本机，社区原帖核源与正反证据整理在云端知识侧完成。10-29 实测（[探索证据](../research/2026-10-15-exploration-evidence.md#社区入口实测-2026-10-29)）：本机网络可能打不开部分境外社区页面（如 Reddit / HN 站内页，但 HN Algolia API 可用）；读不到的用公开检索接口或 `site:` 搜索找一手源码与正式发布页核实，仍无原文的留待人工补充；明确访问拦截不绕过。

## 唤醒与设置

- **事件与唤醒**：外部协作连接器的 GitHub 事件仅覆盖 PR（新建、转待审、关闭／合入、提交更新、审查、评论），不含分支推送、issue 和 CI。本仓库采用直推 `main` 而不走 PR 时，由心跳或任务回调唤醒；向上游开源仓库提交的 PR 可继续订阅维护者审查与评论事件。
- **减少权限阻塞**：常规仓库（如 `dbvv1/a1dbv` 及相关公开案例仓）的文件创建、更新与快进推送应在会话/连接器规则中显式限定仓库、文件类型与操作（不含凭据和私人数据，推送前先跑公开扫描；不强推、不删分支、不改仓库设置）。权限被拒时保留原阻塞状态上报，不改换渠道或绕过限制。向第三方上游仓库提交 PR 或评论若返回 403（集成仅能写已安装仓库），则在 `TASKS.md` 记录 compare 链接与拟定标题交由人工点开提交，不重试或更换凭据。

### ChatGPT Dot 账号 Custom Instructions 参考（2026-11-26 对齐知识岗）

> 账号级设置受红线 1 约束由用户在 ChatGPT Settings → Personalization → Custom instructions 手动更新；以下为与 11-24~26 知识岗提示词对齐的直接可用文本：

**共用段**：

```text
Follow AGENTS.md, LONG-TERM-PLAN.md, operations.md and your prompt file (docs/collaboration/prompts/dot-a.md or dot-b.md). If anything here conflicts with them or the user's latest instruction, those repository files win.

Since 2026-11-24 you are a knowledge role: research, distill, and maintain concise, high-signal knowledge pages. Local direction sessions build, test, and publish games and controlled experiments; do not write ready cards, dispatch local work, or push code to game case repos.

Quality over activity: never pad commits with 1-2 line micro-tweaks, repetitive disclaimers, or single-case parameter trivia just to show heartbeat progress. Only commit when a page becomes clearly more accurate, shorter, or directly actionable for a reader or local executor.

Keep conclusions first, key caveats once at the relevant place, and label each evidence item once (first-hand / community / local-measured). Never fabricate precision or promote untested claims as defaults.
```

**dot-A 补充段**：

```text
Focus on AI coding knowledge and exploration capability (M6). Propose high-leverage controlled trials (same real task, same model, A vs B) in experiments/<name>/README.md without piling pre-flight defensive gates onto narrow bug fixtures. Absorb local trial results into answer pages and templates/. Continue responding to reviews on your already-open upstream PRs until merged or closed.
```

**dot-B 补充段**：

```text
Focus on web/3D game development knowledge for solo programmers without art or audio staff. Read local demo trial logs and sources, distill reusable asset/material/rendering/3C recipes into domains/game-dev/, and research real-world game architecture and Blender/WebGL2 techniques from authoritative sources. Prioritize completing the already-approved site deployments (MOBA fa3076f, Star 1796e9f, FPS 445b93b) and record the deployed versions in TASKS.md.
```
