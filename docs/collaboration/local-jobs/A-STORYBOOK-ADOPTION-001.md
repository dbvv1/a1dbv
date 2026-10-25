# A-STORYBOOK-ADOPTION-001 · 用真实组件与可执行故事交付 UI 功能

id: A-STORYBOOK-ADOPTION-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 32e2f2cbb9e457c11c9b30373bb970d68527f753
result_branch: relay/a-storybook-adoption-001

## 目标与选择

恢复前沿发现，同时把候选放回真实开发：为已有 Storybook 的公开产品交付一个自然未决的 UI 功能，判断「当前组件源码＋按需组件资料＋可执行 stories／交互测试」是否补足原生 Agent 的信息或反馈缺口。不是工具接通演示、正式方法对照，也不为试工具新装整套设施或制造需求。

已发现的三方线索（只读，未试用）：
- [官方能力与框架差异](https://storybook.js.org/docs/ai/mcp/overview)：开发／测试 toolset 与读取组件 manifest 的 docs toolset 支持范围不同，当前仍 preview。
- GitButler 的[真实接入 #16053](https://github.com/gitbutlerapp/gitbutler/pull/16053)及[次日撤掉每任务强制资料／MCP 的改动](https://github.com/gitbutlerapp/gitbutler/commit/d44d5f6382a9c8719c0873ab3d9250c2c2661adf)：优先核源码与原话，比较按需窄 Skill 和全任务固定清单；不要把作者体验当受控收益。
- [实践者原文](https://uiverify.ai/blog/storybook-mcp)：合法组件定制需要可执行用例，不只 props。作者经营相邻产品，小样本不作独立生产证明，不采用其付费服务。
- [中文作者讨论](https://linux.do/t/topic/2771937)及[公开实现](https://github.com/gamecrafters-io/base-ui/blob/ed701de4b0d35ce686c2b265b329efae517969d7/README.md)：自有组件资料 MCP 是邻近机制，不冒称官方 Storybook MCP 的实用记录。
- 实试前核[官方安全修复](https://github.com/storybookjs/storybook/security/advisories/GHSA-f2ph-cmg5-wxc8)与选定包；不要使用已知受影响版本。10.6.2 是本次读到的稳定修补版本，执行时仍核实际版本和兼容性。

## 调查后在同一任务采用

1. 优先从已有 Storybook、可复用组件及真实需求的公开项目选择消费者；GitButler 是线索而非指定载体。核需求是否仍未解决、是否已有在制实现、许可证与可执行消费者。先比较直接读源码＋项目原生测试是否已足够；没有自然需求或明确增量就交具体负结论，不扩大成随机修库。
2. 条件成立后，沿既有已配置正常原生 Workflow，让真实模型读取选定知识，在授权工作区实施完整功能与应用接入，并为相关状态、合法定制及交互补 stories。先复用已有工具能力；需要新增持续访问、凭据、付费或超出接收端授权时只停依赖动作，不自行配置。
3. 验收回真实功能主路径：正确复用组件、相关交互／可访问性检查及应用已有测试／构建；记录反馈实际改变了哪个判断或实现。仅 stories 生成或 tools/list 不算完成。浏览器或服务入口不具备现有授权时不换路，工程结果与未完成实际体验分开。
4. 不重跑已完成 MDX／Memos／Sphinx，不触碰原有浏览器拒绝、账号、数据库或其他特定待批准动作。单次搭建／运行最多两小时；收益不足即收口，未解决的真实交付缺口保留恢复条件。

## 独占写入与交付

- 只写本任务及 `docs/13-frontier-radar.md` 的该候选入口；未实试就明确未试用，不把调研升级为采用。暂不改 04／09／15／23 或 TASKS，以免与在途任务重叠；有实际结果后由负责人决定正文路线入口。
- 应用修改留独占临时工作区；不推第三方仓库、PR／评论或部署。可接手的固定 base、完整补丁、命令、回滚和消费者结果放本任务；补丁过大先说明交付形式，不传整仓或省略关键代码。不新增目录、编号专题或证明台账。
- 给出默认／可信替代／不用条件、具体消费者与实际模型响应元数据；区分来源已读、实际调用、工程通过与真实体验。按一次有效独审接收，修订只复验受影响范围，未变证据直接复用。
- 发布前核最新 main，跑文档、公开文件、实际新增提交身份与空白检查；仅推指定结果分支，回固定 SHA、执行起止及未完成项，状态 `review_ready`。dot-A 串行接收，不批量改写其他页。

认领：dot 本地协作；2026-10-25T07:37:54.920550+00:00。来源 main 固定 `fd186dc`；与 A／B 试点无文件重叠，先发布认领后沿正常原生 Workflow 聚焦调查与条件采用。只写13候选入口与本任务，不解除既有浏览器／服务拒绝，不为试工具造需求。


## 执行与结果（2026-10-25）

**状态：`review_ready`（hook／Panel 与四个 fixture play 已验，真实后端／Electron 未验；不升级为 MCP 采用）。** 只写本任务与 `docs/13-frontier-radar.md` 的 Storybook 候选入口；未向 apache/maka 推送、开 PR／评论或部署。应用改动留在独占私有临时工作区，未写入公开仓库。

### 消费者核实（固定只读基线）

- 仓库 [apache/maka](https://github.com/apache/maka)，Apache-2.0；固定 SHA `222a06fe316f12df3129eff1c16ab3bfaf85c479`，2026-10-25 核对远端 `main` 仍指向该 SHA。
- 需求 [issue #4495](https://github.com/apache/maka/issues/4495) 仍 open：无 assignee、无 milestone，标签 `enhancement`／`stale`，2 条评论；stale bot 提示约 2026-11-01 关闭。正文的验收条目与当前代码一致：`QuoteCompanionPanel` 未传 `activeSession`／`onModelChange`，模型为只读。
- **已有在制实现**：[PR #4499](https://github.com/apache/maka/pull/4499)（+296/−27，12 文件）于 2026-09-01 提交、2026-10-09 因 stale 关闭且未合并；维护者 Astro-Han 给出 CHANGES_REQUESTED，原话要求先讨论“是否会实现这个功能”并补 before/after 对比；没有针对 #4495 的后续 open PR。维护者在 #4495 下另提出缓存命中疑虑；相邻 [#4540](https://github.com/apache/maka/issues/4540)（open，assigned）把该问题单列为 fork 前缀缓存 bug，[#4543](https://github.com/apache/maka/pull/4543)（open，+1493/−36）修复它，正文明确“不改 #4495”，故独立模型选择仍开放。需求真实但上游是否接收未定，本轮不替上游决定。
- 现有 Storybook 与安全：`storybook` 实际解析 **10.6.2**、`@storybook/react-vite` **10.6.0**；未安装 `@storybook/addon-mcp`、`@storybook/core`、`addon-a11y`、`addon-vitest`。10.6.2 是 GHSA-f2ph-cmg5-wxc8 的修补下限，安装树不在已知受影响范围。
- 没有调用 Storybook MCP，也没有新增持久 MCP、凭据、付费服务或浏览器权限。

### 实现（固定 base，私有工作区）

初始实现：在固定 SHA 的独占检出中接线 Side Conversation 独立模型选择，7 个文件、+174/−24；独立审查指出缺陷后的最终 9 文件补丁见修订 1。复用现有能力，不新增依赖或设施。

- `SideChatSessionPort.setModel(sessionId, target)` 接入既有 `bridge.sessions.setModelConfiguration`，写入时把 `thinkingLevel` 清空，与主对话换模型的语义一致。
- `useQuoteCompanion` 新增 `modelConfiguration` 设置通道，沿用 `useSessionSettingIntent` 的乐观 overlay、失败回退与重试；`setModel` 在 Turn 运行中或 fork 未提交时直接拒绝，写前不做部分更新。
- `QuoteCompanionPanel` 只在 companion fork 提交后传入 `activeSession`／`modelChoices`／`onModelChange`；fork 前仍是继承模型的只读标签，避免出现“写不到任何 Session”的假 picker。
- 写入只使用 companion `sessionId`，源 Session 从不参与；刷新失败时 overlay 回退到已提交模型并显示可重试错误，不关闭或重建 fork。
- 与旧 PR 的差异：未带无关的 model-metadata workflow／scripts；未线程 provider brand mark（入口与可选模型相同，仅装饰差异）；未新增整套工具链。

验收目标（初始阶段未执行，不当作当时已验收；修订 1 与实施席自查的执行结果见下节）：① fork 提交后出现主对话同款 picker；② 只改 companion 且显示随之更新；③ 消息／引用／附件／草稿不与写入耦合；④ 运行中拒绝且无部分更新；⑤ 失败回退后可重试；⑥ 关闭与清理路径未改。独立审阅随后指出 ④⑤ 的实现不成立：picker 被 `modelReady` 一并禁用而无法恢复，写入 Promise 被丢弃且 send 未等待设置写入结算；修订 1 按此修正并补直接测试。

### 实际执行与验证

已在消费者自身命令下实际运行：

- `npm ci --ignore-scripts` 与 `node scripts/apply-dependency-patches.mjs`：安装并使用项目锁定的免费依赖，补丁全部应用。
- `npm --workspace @maka/ui run build`：通过。
- `npx tsc -p apps/desktop/tsconfig.renderer.json --noEmit`：通过。
- `npx tsc -p apps/desktop/tsconfig.storybook.json --noEmit`：通过。
- `node --test packages/ui/dist/__tests__/composer-model-picker-recovery.test.js`：21/21 通过（既有 picker 回归）。
- `node apps/desktop/scripts/check-renderer-architecture.mjs`：通过。
- `npm --workspace @maka/desktop run build-storybook`：静态构建通过（证明故事图可编译打包，不是可执行反馈）。
- 已知基线失败：`npm --workspace @maka/desktop run check:architecture` 的 fixture “attests the canonical main source in the final Vite entry graph” 在干净固定 base 上同样失败（同一 fixture 断言 `src/renderer/index.html` 只导入 `src/renderer/main.tsx`；不是本改动引入）；直接运行 checker 通过，与本改动无关。

初始阶段未运行（**未尝试**，不是已证实无授权）：Storybook dev server、play 函数、Electron／桌面应用、真实浏览器、a11y 与 e2e。没有发现该消费者特定的浏览器／服务拒绝；不能把“本阶段没有尝试”写成“Maka 拒绝授权”。修订 1 与实施席自查随后实际运行了直接测试、静态 Storybook 与 4 个目标 play（见下节）；仍未运行 Electron、真实桌面应用、a11y、e2e，也未调用 Storybook MCP。没有 Storybook MCP 工具响应；实际执行模型字段见交付边界。

### 故事／组件资料层的判断

直接读 `Composer` 的 props 契约、`setSessionExecutor`／`setModelConfiguration` 端口和既有 21 项模型选择测试，当时判断“源码＋原生测试已足够”，随后独立审阅发现 F1/F2 两个正确性缺陷（只读组合的 model readiness 让恢复 picker 一并失效；`void setModel` 与 send 未等待设置写入），证明该判断过早。组件 manifest／docs-show 没有参与；修订 1 新增的直接 hook/Panel 测试与 4 个目标 play 已实际执行通过，但 Storybook MCP／组件资料层仍未调用，**不能据此推断组件资料增量**。

**结论（决定门槛，修订 1 与实施席自查更正）**：该消费者上是**实现候选**，不是已证明的最终正确补丁：独立审阅发现并修正两处真实正确性缺陷，修订 1 补直接 hook／Panel 测试与可执行 stories/play；实施席自查修正测试/故事的可执行缺陷后，**82/82 受影响测试与 4/4 目标 play 实际通过**（静态 Storybook + 已装 Chrome，未安装新浏览器）。仍未调用 Storybook MCP，故事／组件资料层是否带来增量**仍未知**；也不能从“补了 story”推断收益。仍不升级为采用，不给 04／09／15／23 或 TASKS 增加路线入口。保留 issue #4495、固定 SHA 与完整补丁，待接收端复核与上游决定。

### 还原

在固定 SHA 的检出中执行 `git checkout -- .`，或保存下方补丁后 `git apply -R`。补丁为公开仓库相对路径，不含私有路径、会话标识或日志。

```diff
diff --git a/apps/desktop/src/renderer/application/contracts/conversation-copy.ts b/apps/desktop/src/renderer/application/contracts/conversation-copy.ts
index c587268..a7dde7b 100644
--- a/apps/desktop/src/renderer/application/contracts/conversation-copy.ts
+++ b/apps/desktop/src/renderer/application/contracts/conversation-copy.ts
@@ -231,6 +231,8 @@ export interface DesktopConversationCopy {
       settlementFailed: string;
       /** Responding to a permission / question prompt failed. */
       respondFailed: string;
+      /** The Side Conversation's own model write failed and was reverted. */
+      modelSwitchFailed: string;
     };
   };
   health: {
@@ -575,6 +577,7 @@ const COPY = resolveUiMessageCatalog(defineShippedUiMessageCatalog<DesktopConver
         sendFailed: '追问失败，请稍后重试。',
         settlementFailed: '运行已结束，但消息加载失败。请重试或重新打开侧边对话。',
         respondFailed: '响应失败，请稍后重试。',
+        modelSwitchFailed: '模型切换失败，已恢复原来的模型，请重试。',
       },
     },
     health: {
@@ -816,6 +819,7 @@ const COPY = resolveUiMessageCatalog(defineShippedUiMessageCatalog<DesktopConver
         sendFailed: '追問失敗，請稍後重試。',
         settlementFailed: '執行已結束，但訊息載入失敗。請重試或重新開啟側邊對話。',
         respondFailed: '回應失敗，請稍後重試。',
+        modelSwitchFailed: '模型切換失敗，已還原原本的模型，請重試。',
       },
     },
     health: {
@@ -1073,6 +1077,7 @@ const COPY = resolveUiMessageCatalog(defineShippedUiMessageCatalog<DesktopConver
         sendFailed: 'The companion request failed. Please try again.',
         settlementFailed: 'The run ended, but its messages could not be loaded. Retry or reopen the side chat.',
         respondFailed: 'The response failed. Please try again.',
+        modelSwitchFailed: 'Could not change the model. The previous model is still selected; try again.',
       },
     },
     health: {
diff --git a/apps/desktop/src/renderer/features/workbar/ports.ts b/apps/desktop/src/renderer/features/workbar/ports.ts
index 1c5aa70..94fe866 100644
--- a/apps/desktop/src/renderer/features/workbar/ports.ts
+++ b/apps/desktop/src/renderer/features/workbar/ports.ts
@@ -266,6 +266,15 @@ export interface SideChatSessionPort {
     sessionId: string,
     mode: PermissionMode,
   ): Promise<SessionSummary>;
+  /**
+   * Writes the companion Session's own model. Scoped by `sessionId` so a Side
+   * Conversation can diverge from the source Session it forked from; the
+   * source Session is never touched by this call.
+   */
+  setModel(
+    sessionId: string,
+    target: { llmConnectionId: string; llmConnectionSlug: string; model: string },
+  ): Promise<SessionSummary>;
   respondToSandboxBoundary(
     sessionId: string,
     response: SandboxBoundaryResponse,
diff --git a/apps/desktop/src/renderer/features/workbar/testing.ts b/apps/desktop/src/renderer/features/workbar/testing.ts
index a6fe3f7..ea0cdac 100644
--- a/apps/desktop/src/renderer/features/workbar/testing.ts
+++ b/apps/desktop/src/renderer/features/workbar/testing.ts
@@ -174,6 +174,9 @@ export function createFakeWorkbarServices(
       setPermissionMode: async () => {
         throw new Error('Fake sideChat.setPermissionMode is not configured');
       },
+      setModel: async () => {
+        throw new Error('Fake sideChat.setModel is not configured');
+      },
       respondToSandboxBoundary: async () => undefined,
       respondToClientCapability: async () => undefined,
       respondToUserQuestion: async () => undefined,
diff --git a/apps/desktop/src/renderer/features/workbar/tools/side-chat/quote-companion-panel.tsx b/apps/desktop/src/renderer/features/workbar/tools/side-chat/quote-companion-panel.tsx
index 0a4b8e8..d537169 100644
--- a/apps/desktop/src/renderer/features/workbar/tools/side-chat/quote-companion-panel.tsx
+++ b/apps/desktop/src/renderer/features/workbar/tools/side-chat/quote-companion-panel.tsx
@@ -62,7 +62,9 @@ import { useWorkbarServices } from '../../services-context.js';
  * `ChatView` transcript (markdown, tool activity, token streaming) and the real
  * `Composer` — bound to a read-only companion fork of the main session (see
  * useQuoteCompanion). The fork KNOWS the main conversation's context and inherits
- * its model (shown read-only — no independent picker). It explains and explores;
+ * its model; once the fork exists, the normal Composer picker can switch the
+ * temporary Session's own model without touching the source Session. It explains
+ * and explores;
  * writes/shell are blocked, and web/custom tools prompt here. Selecting more text
  * in the main transcript adds another quote chip to THIS thread.
  */
@@ -226,8 +228,9 @@ export function QuoteCompanionPanel(props: {
     companion.modelReady,
   ]);

-  // The companion inherits the source model and does not switch it; look up a
-  // friendly label from the shared choice list purely for a read-only display.
+  // Before the fork commits the model is inherited and read-only; once the
+  // companion Session exists the normal picker edits that Session only. The
+  // source Session is never referenced by the write, so it cannot change here.
   const activeModel = companion.activeModel;
   const activeModelLabel =
     (activeModel
@@ -383,9 +386,23 @@ export function QuoteCompanionPanel(props: {
                   });
                 }
               }}
-              // No activeSession / onModelChange → the model shows as a read-only chip
-              // (the companion has no independent picker; it inherits the source model).
+              // Once the fork commits, the same Composer model entry the main
+              // conversation uses edits THIS temporary Session. Before that
+              // there is no Session to write to, so the model stays a
+              // read-only inherited label (`modelLabel`) rather than a picker
+              // whose write would have nowhere to go.
+              activeSession={companion.companionSession}
+              modelChoices={companion.companionSession ? [...props.modelChoices] : undefined}
+              activeModelConnectionId={companion.activeModel?.llmConnectionId}
+              activeModelConnectionSlug={companion.activeModel?.llmConnectionSlug}
+              activeModel={companion.activeModel?.model}
+              activeModelLabel={activeModelLabel}
               modelLabel={activeModelLabel}
+              onModelChange={companion.companionSession
+                ? (target) => {
+                    void companion.setModel(target);
+                  }
+                : undefined}
               permissionMode={companion.permissionMode}
               permissionModeDisabledReason={
                 companion.streaming ? copy.permissionStreaming : undefined
diff --git a/apps/desktop/src/renderer/features/workbar/tools/side-chat/use-quote-companion.ts b/apps/desktop/src/renderer/features/workbar/tools/side-chat/use-quote-companion.ts
index 6c0417b..131ddf8 100644
--- a/apps/desktop/src/renderer/features/workbar/tools/side-chat/use-quote-companion.ts
+++ b/apps/desktop/src/renderer/features/workbar/tools/side-chat/use-quote-companion.ts
@@ -89,7 +89,25 @@ import {
 } from './quote-companion-panel-state.js';
 import type { CompanionForkVisibilityEvent } from './quote-companion-visibility.js';

-type QuoteCompanionSettingValues = { permissionMode: PermissionMode };
+type CompanionModelTarget = {
+  llmConnectionId: string;
+  llmConnectionSlug: string;
+  model: string;
+};
+
+type QuoteCompanionSettingValues = {
+  permissionMode: PermissionMode;
+  modelConfiguration: CompanionModelTarget;
+};
+
+function equalCompanionModelTarget(
+  left: CompanionModelTarget,
+  right: CompanionModelTarget,
+): boolean {
+  return left.llmConnectionId === right.llmConnectionId &&
+    left.llmConnectionSlug === right.llmConnectionSlug &&
+    left.model === right.model;
+}

 type PendingAdmission = {
   messageId: string;
@@ -200,8 +218,10 @@ export interface UseQuoteCompanionResult {
   permissionMode: PermissionMode | undefined;
   /** A localized, retryable error (fork setup, run error, or a rejected send). */
   error: string | null;
-  /** The model the companion inherited from the source (shown read-only). */
-  activeModel: { llmConnectionSlug: string; model: string } | undefined;
+  /** The model the companion inherits from the source, or its own picked model. */
+  activeModel:
+    | { llmConnectionId?: string; llmConnectionSlug: string; model: string }
+    | undefined;
   /** Pending sandbox-boundary / question / form prompt raised by the companion's run. */
   activeSandboxBoundary: SandboxBoundaryRequestEvent | undefined;
   activeClientCapability: ClientCapabilityRequestEvent | undefined;
@@ -236,6 +256,12 @@ export interface UseQuoteCompanionResult {
     expectedQueueRevision: number,
   ) => Promise<void>;
   setPermissionMode: (mode: PermissionMode) => Promise<boolean>;
+  /**
+   * Switches only this Side Conversation's model. False while a Turn is
+   * running, before the fork exists, or when the Host rejects the write; the
+   * previous model and the source Session stay unchanged in every such case.
+   */
+  setModel: (target: CompanionModelTarget) => Promise<boolean>;
   stop: () => Promise<void>;
   respondToSandboxBoundary: (response: SandboxBoundaryResponse) => Promise<void>;
   respondToClientCapability: (response: ClientCapabilityResponse) => Promise<void>;
@@ -270,6 +296,8 @@ function attachmentBlockedMessage(code: AttachmentIngestBlockedCode, locale: UiL
  * Companion for the quote side panel. On the first question it FORKS the main
  * session (`branchFromTurn` from the latest SETTLED turn) into a child that
  * carries the whole main conversation as context and inherits its model / cwd.
+ * After the fork commits, the Composer's model picker writes the companion
+ * Session's own model (session-id scoped; the source keeps its selection).
  * The fork inherits the source permission profile and exposes the normal
  * permission control for later changes.
  * Follow-ups stream through the SAME live-turn reducer the main shell uses, and
@@ -410,7 +438,7 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
     revision: () => permissionCatalogRevisionRef.current.getState(),
     subscribeChanged: permissionCatalogRevisionRef.current.subscribe,
   };
-  const permissionModeIntent = useSessionSettingIntent<QuoteCompanionSettingValues>({
+  const settingIntent = useSessionSettingIntent<QuoteCompanionSettingValues>({
     catalog: permissionCatalogRef.current,
     refreshCatalog: async () => {
       const sessionId = companionIdRef.current;
@@ -437,14 +465,44 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
           if (mountedRef.current) setError(copyRef.current.errors.respondFailed);
         },
       },
+      modelConfiguration: {
+        isEqual: equalCompanionModelTarget,
+        // The Host write is Session-id scoped, so the source Session cannot be
+        // mutated here. The returned summary is the authority: a write that
+        // "succeeds" but leaves the companion on another model is a failure,
+        // and the intent overlays revert to the last committed selection.
+        write: async (sessionId, target) => {
+          const next = await sideChat.setModel(sessionId, target);
+          if (mountedRef.current && companionIdRef.current === sessionId) {
+            companionRef.current = next;
+            setCompanion(next);
+          }
+          return equalCompanionModelTarget(
+            {
+              llmConnectionId: next.llmConnectionId ?? '',
+              llmConnectionSlug: next.llmConnectionSlug,
+              model: next.model,
+            },
+            target,
+          );
+        },
+        onWriteError: () => {
+          if (mountedRef.current) setError(copyRef.current.errors.modelSwitchFailed);
+        },
+      },
     },
   });
   const requestPermissionMode = useCallback(
     (sessionId: string, mode: PermissionMode) =>
-      permissionModeIntent.request('permissionMode', sessionId, mode),
-    [permissionModeIntent.request],
+      settingIntent.request('permissionMode', sessionId, mode),
+    [settingIntent.request],
   );
-  const clearPermissionModeIntent = permissionModeIntent.clear;
+  const requestModel = useCallback(
+    (sessionId: string, target: CompanionModelTarget) =>
+      settingIntent.request('modelConfiguration', sessionId, target),
+    [settingIntent.request],
+  );
+  const clearPermissionModeIntent = settingIntent.clear;

   const setPendingAdmission = useCallback((admission: PendingAdmission | null) => {
     pendingAdmissionRef.current = admission;
@@ -1678,6 +1736,19 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
     [requestPermissionMode, turnInFlight],
   );

+  const setModel = useCallback(
+    (target: CompanionModelTarget): Promise<boolean> => {
+      const id = companionIdRef.current;
+      // Same active-Turn admission rule as an ordinary Session's model picker:
+      // refuse before any optimistic write so the UI and Session cannot be
+      // half-updated. A disposed/fork-less panel has nothing to write to.
+      if (!id || turnInFlight) return Promise.resolve(false);
+      setError(null);
+      return requestModel(id, target);
+    },
+    [requestModel, turnInFlight],
+  );
+
   const respondToSandboxBoundary = useCallback(
     async (response: SandboxBoundaryResponse): Promise<void> => {
       const id = companionIdRef.current;
@@ -1742,14 +1813,28 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
   const transientMessages = queuedEntryDraft
     ? withQueuedSteeringTransients(pendingUserMessages, messageQueue, { ...queuedEntryDraft, locale: localeRef.current })
     : pendingUserMessages;
-  // Inherited model (read-only): the fork's once created, else the source's.
-  const activeModel = companion
-    ? { llmConnectionSlug: companion.llmConnectionSlug, model: companion.model }
-    : sourceSession
-      ? { llmConnectionSlug: sourceSession.llmConnectionSlug, model: sourceSession.model }
-      : undefined;
+  // The committed fork's own selection when one was picked, else the model it
+  // inherited from the source. The overlay keeps a pending pick visible while
+  // the Host write is in flight and reverts it when the write fails.
+  const companionModelOverlay = companion?.id
+    ? settingIntent.overlayByChannel.modelConfiguration[companion.id]
+    : undefined;
+  const activeModel = companionModelOverlay ??
+    (companion
+      ? {
+          llmConnectionId: companion.llmConnectionId,
+          llmConnectionSlug: companion.llmConnectionSlug,
+          model: companion.model,
+        }
+      : sourceSession
+        ? {
+            llmConnectionId: sourceSession.llmConnectionId,
+            llmConnectionSlug: sourceSession.llmConnectionSlug,
+            model: sourceSession.model,
+          }
+        : undefined);
   const companionPermissionOverlay = companion?.id
-    ? permissionModeIntent.overlayByChannel.permissionMode[companion.id]
+    ? settingIntent.overlayByChannel.permissionMode[companion.id]
     : undefined;
   // A staged mode (chosen before the fork, not yet applied) outranks the fork's
   // inherited mode so a fail-closed first send still shows the user's choice.
@@ -1798,6 +1883,7 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
     deleteQueuedEntry,
     reorderQueuedEntries,
     setPermissionMode,
+    setModel,
     stop,
     respondToSandboxBoundary,
     respondToClientCapability,
diff --git a/apps/desktop/src/renderer/platform/desktop/create-workbar-services.ts b/apps/desktop/src/renderer/platform/desktop/create-workbar-services.ts
index 84580ca..0ee0ae4 100644
--- a/apps/desktop/src/renderer/platform/desktop/create-workbar-services.ts
+++ b/apps/desktop/src/renderer/platform/desktop/create-workbar-services.ts
@@ -211,6 +211,14 @@ export function createDesktopWorkbarServices(
         bridge.sessions.reorderQueueEntries(sessionId, entryIds, revision),
       setPermissionMode: async (sessionId, mode) =>
         expectSessionUpdate(await bridge.sessions.setPermissionMode(sessionId, mode)),
+      // A model pick is a model-only change: clear the thinking level exactly
+      // like the main conversation's `setSessionModel`, so the companion never
+      // keeps a variant the newly selected model does not offer.
+      setModel: async (sessionId, target) =>
+        expectSessionUpdate(await bridge.sessions.setModelConfiguration(sessionId, {
+          ...target,
+          thinkingLevel: null,
+        })),
       respondToSandboxBoundary: (sessionId, response) =>
         bridge.sessions.respondToSandboxBoundary(sessionId, response),
       respondToClientCapability: (sessionId, response) =>
diff --git a/apps/desktop/stories/session-workbar.stories.tsx b/apps/desktop/stories/session-workbar.stories.tsx
index 3119bcc..da14c1f 100644
--- a/apps/desktop/stories/session-workbar.stories.tsx
+++ b/apps/desktop/stories/session-workbar.stories.tsx
@@ -22,6 +22,7 @@ import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
 import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
 import type { ArtifactRecord } from '@maka/core/artifacts';
 import type { BrowserState } from '@maka/core/browser';
+import type { ChatModelChoice } from '@maka/core/chat-model-choice';
 import type { SessionEvent } from '@maka/core/events';
 import type { GitReviewReadResult, GitReviewSnapshot } from '@maka/core/git-review';
 import type { SessionSummary, StoredMessage } from '@maka/core/session';
@@ -119,6 +120,17 @@ const SIDE_CHAT_SESSION: SessionSummary = {
   id: 'session-workbar-side-chat',
   name: '侧边对话',
 };
+// The catalog the real Host would offer while `SIDE_CHAT_SESSION` is selected.
+// Without it, the committed side chat would show a picker with no selectable
+// model — a state the app cannot reach (the source model is itself a choice).
+const SIDE_CHAT_MODEL_CHOICES: ChatModelChoice[] = [
+  { connectionId: 'anthropic-main', connectionSlug: 'anthropic-main', connectionName: 'Anthropic',
+    providerType: 'anthropic', providerLabel: 'Anthropic', model: 'claude-sonnet-4-5',
+    label: 'Claude Sonnet 4.5', isDefault: true, thinkingLevels: [] },
+  { connectionId: 'anthropic-main', connectionSlug: 'anthropic-main', connectionName: 'Anthropic',
+    providerType: 'anthropic', providerLabel: 'Anthropic', model: 'claude-haiku-4-5',
+    label: 'Claude Haiku 4.5', isDefault: false, thinkingLevels: [] },
+];
 const TERMINAL_REF = 'shell-run:storybook-terminal';
 const SIDE_CHAT_PANEL_ID = 'storybook-side-chat';

@@ -903,6 +915,11 @@ function bridge(options: {
 } = {}): Decorator {
   const browserState = options.browserState ?? EMPTY_BROWSER_STATE;
   let recentPendingReads = options.recentPendingReads ?? 0;
+  // The fake Host keeps the companion's committed model, so a successful model
+  // pick survives the catalog refresh the setting intent performs instead of
+  // bouncing back to the stale constant — that bounce would be a story-only
+  // state the real Host never produces.
+  let sideChatSession = { ...SIDE_CHAT_SESSION };
   const services = createFakeWorkbarServices({
     popupMenu: options.popupMenu ?? (async () => null),
     artifacts: {
@@ -995,7 +1012,7 @@ function bridge(options: {
       subscribeState: unsubscribe,
     },
     sideChat: {
-      listSessions: async () => [TOOL_PICKER_SOURCE_SESSION, SIDE_CHAT_SESSION],
+      listSessions: async () => [TOOL_PICKER_SOURCE_SESSION, sideChatSession],
       listTurns: async () => [
         {
           turnId: 'source-turn',
@@ -1032,10 +1049,14 @@ function bridge(options: {
       retractQueueEntry: async () => undefined,
       promoteQueueEntry: async () => undefined,
       reorderQueueEntries: async () => undefined,
-      setPermissionMode: async (_sessionId, mode) => ({
-        ...SIDE_CHAT_SESSION,
-        permissionMode: mode,
-      }),
+      setPermissionMode: async (_sessionId, mode) => {
+        sideChatSession = { ...sideChatSession, permissionMode: mode };
+        return sideChatSession;
+      },
+      setModel: async (_sessionId, target) => {
+        sideChatSession = { ...sideChatSession, ...target };
+        return sideChatSession;
+      },
       respondToSandboxBoundary: async () => undefined,
       respondToClientCapability: async () => undefined,
       respondToUserQuestion: async () => undefined,
@@ -1182,6 +1203,7 @@ function Workbar(props: {
           }}
           confirmBypass={async () => true}
           quotes={quotes}
+          modelChoices={SIDE_CHAT_MODEL_CHOICES}
           sourceSession={
             props.sourceSession ??
             (props.tab === 'side-chat' ? TOOL_PICKER_SOURCE_SESSION : undefined)
```

### 交付边界

- 执行起止：认领 2026-10-25T07:37:54Z；本轮实现与验证 07:56Z–08:20Z，单次搭建／运行在任务上限两小时内。
- 工作流阶段未提交、未推送、未开上游 PR／评论、未部署；实施席自查后由父执行端提交并推送指定结果分支（最终 SHA 见交接消息）。
- 未新增目录、编号专题、证明台账或通用页面改写；未触碰 A／B 试点与原有浏览器／服务拒绝。
- 真实模型通道：父会话和三个 workflow 子会话的实际 `message.model` 均为 `deepseek-flash`（`deepseek-v4.1-flash[1m]` 为 harness 别名，不作为独立后端身份）；请求里单独标注的别名不构成独立模型或独立审查证据。原生父会话自审是作者检查，不是本次独立审查；本次 needs_changes 来自既有只读独立审查者。
- 未调用 Storybook MCP，也没有模型响应可作为组件资料效果证据。

### 实施席自查（父会话，2026-10-25）

- 复核消费者：`apache/maka` 仍为 Apache-2.0；固定 SHA `222a06f` 仍是远端 `main`；#4495 open、无 assignee／milestone、2 条评论；#4499 closed unmerged（+296/−27、12 文件、CHANGES_REQUESTED）；相邻 #4540 open／assigned、#4543 open（+1493/−36），#4540 正文明确与 #4495 正交。
- 复核实测版本：`storybook` 10.6.2、`@storybook/react-vite` 10.6.0；`@storybook/addon-mcp`／`@storybook/core`／a11y／vitest 不在安装树。GHSA-f2ph-cmg5-wxc8 的 patched floor 为 10.6.2（另有 9.1.21、8.6.19、11.0.0-alpha.6），安装树不在受影响范围。
- 复核补丁：内联补丁与 `evidence/our-stripped.patch` 字节一致；在固定 SHA 工作区 `git apply -R --check` 通过，`git diff --check` 干净；7 文件 +174/−24 与记录一致。
- 复核验证：`node --test packages/ui/dist/__tests__/composer-model-picker-recovery.test.js` 21/21 通过；`build-storybook` 三次后台运行均 exit 0；typecheck／checker 日志 exit 0；基线 fixture 在干净 base 上复现失败（raw transcript），归因已按断言原文修正。
- 修正：`status` 改为 `review_ready`；删除未支持的“Windows 路径”归因；补充相邻 open PR #4543 与维护者缓存疑虑；`docs/13` 的 `[本仓工程]` 改为已定义的 `[经验：实测]`，并把“新增 story”改为“补现有 story fixture”。
- 未完成（初始审查时；修订 1 已补直接测试与 4 个目标 play，见下节）：Electron／真实桌面应用、完整浏览器应用流程、a11y、e2e、Storybook MCP／docs toolset 未运行；无 Storybook MCP 工具响应元数据；上游是否接收未定。


## 修订 1（独立审阅 needs_changes，2026-10-25）

**状态：实现候选；实施席自查已复核本修订 delta，直接测试与目标 play 已实际执行通过；仍不升级为采用。** 独立只读审阅（不是原生父会话自审）给出 `needs_changes`；修订 1 修复 F1/F2，并在实施席自查阶段修正新增测试/故事的可执行缺陷后实际运行：**82/82 受影响测试、4/4 目标 Storybook play 通过，三个受影响 typecheck 通过**。未调用 Storybook MCP，组件资料是否有增量仍是**未知**；Electron／桌面应用、a11y、e2e 未运行。此前公开文本中的“正确补丁／源码＋测试已足够／没有可证明增量”属于过早结论，已在上文更正。修订后的最终补丁为 **9 文件 +1177/−45**（相对固定 base `222a06f`）：原 attempt-1 的 7 文件 +174/−24 保留，修订 delta 再改 5 文件（2 个测试文件 + panel／hook／stories 三个生产或故事文件）并加 2 个 panel import 后缀。

### 独立审阅指出的缺陷

- **F1（恢复不可达）**：`QuoteCompanionPanel` 把 `disabled={!companion.modelReady}` 传给 `Composer`，`Composer` 会用它一并禁用模型 picker；而 `modelReady = sourceModelReady && companionModelReady`。结果：已提交 companion 的继承模型失效时，用户无法从 picker 选一个可用模型恢复；源模型失效时，即使 companion 自己有有效模型也不能发送。`ensureFork` 还先检查源模型、后检查已有 fork。
- **F2（写入/发送乱序）**：`onModelChange` 用 `void companion.setModel(...)` 丢弃 Promise，picker/Composer 的 pending 立即结束；hook 的 `send` 也没等待 `useSessionSettingIntent` 的设置写入结算。延迟写入时可能在旧模型上开始 Turn，失败写入也没有阻止发送。
- **F3（测试/故事缺口）**：新增的 `setModel` 路由没有直接测试；原有 21 项只是通用 Composer picker 回归；故事只改了 fake fixture，没有 fork picker／恢复／错误／运行中的可执行 case。
- **F4（公开表述过度）**：把“源码＋原生测试”称为已足够/正确补丁、把“未尝试 Storybook 运行入口”写成授权不足，都没有证据；原始任务只保留实际具体拒绝。父会话与三个 workflow 子会话实际都是 deepseek-flash；原生父自审是作者检查，不等于独立审查。

### 修订实现（复用现有契约，最小扩展）

1. **F1：拆开发送就绪与 picker 就绪。**
   - `modelReady` 现在只表示“能否发送”：companion 已提交时用 companion 自己的精确模型；无 companion／空 fork 时才要求源模型可用（空 fork 可被重新 fork）。这样源模型失效不再阻断有效的独立 companion。
   - 新增 `modelPickerReady = companion !== undefined`：只要 fork 已提交，就存在可写 Session，picker 保持可用；模型不可用时由 `modelReady` 阻止发送，而不是禁用整个 Composer。
   - `QuoteCompanionPanel` 用 `sendBlocked={!modelReady}` 取代 `disabled={!modelReady}`，picker 的 `activeSession`／`modelChoices`／`onModelChange` 只在 `modelPickerReady` 时注入。
   - `ensureFork` 先返回“已有且模型精确匹配”的 fork，再检查源模型；已有 companion 的有效模型不再被源模型遮蔽。
2. **F2：写入承诺进入发送结算。**
   - `onModelChange` 改为返回被 `await` 的 Promise：`ComposerModelPicker` 的 pending 覆盖整个 Host 写入，写入期间 Composer 的 Send 保持 blocked。
   - `send` 在提交时（已有 companion）或 fork 提交后立即 `beginSettlement(sessionId)`，复用主 Composer 的 `#4695` 结算契约；在 `performCompanionTurn` 前等待 `settled()`，失败则撤销 optimistic bubble、保留草稿并返回 false，绝不启动旧模型。
   - 新增直接测试覆盖（**已执行**）：延迟写入时 Host `send` 在写入提交前不被调用；提交后 Turn 在**新**模型上启动；写入失败时 `send` 不调用、active model 不变、错误可重试；运行中 `setModel` 直接拒绝且不写入。
3. **F3：直接测试与可执行故事。**
   - `quote-companion-retry.test.ts`：新增 companion 自有模型/源模型失效、延迟写入结算、失败写入、运行中拒绝四类 hook 级用例。
   - 新增 `quote-companion-model-picker.test.ts`：真实 `QuoteCompanionPanel` + 真实 `Composer`，覆盖恢复 picker 可用、失败写入保留草稿、运行中 picker 禁用。
   - `session-workbar.stories.tsx`：修正真实 Host 会提供的 `llmConnectionId`，新增 `SideChatModelPicker`、`SideChatModelRecovery`、`SideChatModelWriteError`、`SideChatRunningPickerLocked` 四个带 `play` 的现有工作栏故事；恢复故事通过既有 Workbar 状态模拟 Host catalog 刷新，未复制产品逻辑。
4. **F4：表述纠正。** 上文已改写“正确补丁/已足够/没有增量”和“未尝试＝授权不足”。两个受影响文件共 82 项测试（含新增直接用例）与 4 个目标 play 已实际执行通过；但 Storybook MCP 仍未调用，组件资料是否有增量仍是**未知**；不能从补上的 story 文本或已运行的 play 推断组件资料收益。

### 本修订与实施席自查实际执行

- 实施席自查先复现了修订 1 交付时的失败：`build:main` 后直接跑两个新测试 → **80 tests / 76 pass / 4 fail**；其中 panel 测试整文件因 renderer 无扩展名导入无法加载，retry 三个新用例硬编码 `model-a` 与 fixture `test-model` 不一致。原始失败保留在 `evidence/verify-direct-tests.log`。
- 实施席自查修正（只改本次 delta 范围）：
  - panel 源文件两处无扩展名相对导入补 `.js`（`./use-quote-companion.js`、`../../../../scroll-motion-policy.js`），使 `tsconfig.main` 的 Node ESM 测试入口可解析；无行为变化。
  - retry 三个新用例显式使用 `model-a` fixture；失败写入用例改断言“失败草稿不在 transient 文本中”，不再依赖 fake Host 不会产生的 reconcile。
  - panel 测试补 linkedom 的 `contentEditable` → `contenteditable` attribute seam（与 `packages/ui` 现有 Composer 测试同一做法）并等待编辑器渲染。
  - 四个 story 的 play：去掉浏览器 bundle 不提供的 `react.act`，改为直接 dispatch + `waitFor`；删除对 Send 按钮 `aria-busy` 的错误断言（运行中 Send 被 Stop 取代，picker lock 才是本故事的可观察契约）。
- 修正后实际运行：
  - `npm --workspace @maka/desktop run build:main` → exit 0。
  - `node --test --test-force-exit dist/main/__tests__/quote-companion-model-picker.test.js dist/main/__tests__/quote-companion-retry.test.js` → **82/82 pass，0 fail**。
  - `npx tsc -p apps/desktop/tsconfig.main.json --noEmit`、`tsconfig.renderer.json`、`tsconfig.storybook.json` → 均 exit 0。
  - 静态 Storybook 重建后，用**已安装的 Chrome**（`playwright` `channel: 'chrome'`，未安装新浏览器）只跑四个目标 story：`side-chat-model-picker`、`side-chat-model-recovery`、`side-chat-model-write-error`、`side-chat-running-picker-locked` → **4/4 pass**。日志：`evidence/verify-side-chat-plays.log` 与 `.json`。
  - 可证伪性：在固定 base + preserved attempt-1 补丁的临时 worktree 中放入修正后的测试（仅为测试入口补同样的两处 `.js` 后缀，其余保持 attempt-1）→ **82 tests / 77 pass / 5 fail**，恰好是 F1/F2 的两个 Panel 用例与三个 hook 用例；日志 `evidence/verify-revision1-falsify-root.log`。临时 worktree 与 junction 已移除。
- 范围限制：以上直接测试与 play 使用现有 fake WorkbarServices／story fixture，不是真实 Maka backend、真实模型调用或 Electron 桌面流程。
- 仍未运行：Electron／真实桌面应用、完整浏览器应用流程、a11y、e2e、Storybook MCP／docs toolset；没有 Storybook MCP 工具响应元数据；执行模型字段单独记录。任务范围内的临时既有 Storybook static + 已装 Chrome 入口已使用；这不是“无授权”结论。上游是否接收未定。

### 修订补丁（在 attempt-1 之上，apply / revert）

完整最终状态 = **上文 attempt-1 补丁** + **下方 revision-1 delta（零上下文形式）**。在固定 base `222a06f` 的独占检出中：

```sh
git apply attempt-1.patch          # 上文 "### 还原" 中的旧补丁，7 文件
git apply --unidiff-zero revision-1-delta-final-u0.patch   # 下方零上下文补丁，5 文件
```

回滚：

```sh
git apply -R --unidiff-zero revision-1-delta-final-u0.patch
git apply -R attempt-1.patch
# 或：git checkout -- . && rm apps/desktop/src/main/__tests__/quote-companion-model-picker.test.ts
```

```diff
diff --git a/apps/desktop/src/main/__tests__/quote-companion-model-picker.test.ts b/apps/desktop/src/main/__tests__/quote-companion-model-picker.test.ts
new file mode 100644
index 0000000..8cfd3e6
--- /dev/null
+++ b/apps/desktop/src/main/__tests__/quote-companion-model-picker.test.ts
@@ -0,0 +1,486 @@
+/*
+ * Licensed to the Apache Software Foundation (ASF) under one
+ * or more contributor license agreements.  See the NOTICE file
+ * distributed with this work for additional information
+ * regarding copyright ownership.  The ASF licenses this file
+ * to you under the Apache License, Version 2.0 (the
+ * "License"); you may not use this file except in compliance
+ * with the License.  You may obtain a copy of the License at
+ *
+ *     http://www.apache.org/licenses/LICENSE-2.0
+ *
+ * Unless required by applicable law or agreed to in writing,
+ * software distributed under the License is distributed on an
+ * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
+ * KIND, either express or implied.  See the License for the
+ * specific language governing permissions and limitations
+ * under the License.
+ */
+
+/**
+ * The actual QuoteCompanionPanel entry: real Panel, real Composer and the real
+ * useQuoteCompanion model route. These cases pin the two independent states a
+ * committed companion exposes — send readiness (its own model) and picker
+ * readiness (a Session exists to write) — and the write-before-send ordering.
+ */
+
+import assert from 'node:assert/strict';
+import { afterEach, test } from 'node:test';
+import { act, createElement, useState, type ReactElement } from 'react';
+import { createRoot, type Root } from 'react-dom/client';
+import { parseHTML } from 'linkedom';
+import { LocaleProvider, ToastProvider } from '@maka/ui';
+import type { ChatModelChoice } from '@maka/core/chat-model-choice';
+import type { SessionSummary } from '@maka/core/session';
+import {
+  createFakeWorkbarServices,
+  WorkbarServicesProvider,
+  type WorkbarServices,
+} from '../../renderer/features/workbar/testing.js';
+import { QuoteCompanionPanel } from '../../renderer/features/workbar/tools/side-chat/quote-companion-panel.js';
+
+const GLOBAL_KEYS = [
+  'CSS',
+  'Element',
+  'HTMLElement',
+  'IS_REACT_ACT_ENVIRONMENT',
+  'IntersectionObserver',
+  'MutationObserver',
+  'Node',
+  'ResizeObserver',
+  'cancelAnimationFrame',
+  'document',
+  'getComputedStyle',
+  'matchMedia',
+  'requestAnimationFrame',
+  'window',
+] as const;
+
+interface PanelDom {
+  document: Document;
+  window: Window & typeof globalThis;
+  container: HTMLElement;
+  render(element: ReactElement): Promise<void>;
+  cleanup(): Promise<void>;
+}
+
+let mounted: PanelDom | undefined;
+
+/**
+ * LinkeDOM client with the geometry and observer seams the real Panel's
+ * transcript and Composer read. Copied from the UI test seam rather than
+ * mocked per component, so the production composition stays under test.
+ */
+function installPanelDom(): PanelDom {
+  const originals = new Map<PropertyKey, PropertyDescriptor | undefined>(
+    GLOBAL_KEYS.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]),
+  );
+  const { document, window } = parseHTML('<html><body><div id="root"></div></body></html>');
+  const elementSetAttribute = window.Element.prototype.setAttribute;
+  window.Element.prototype.setAttribute = function normalized(name: string, value: string) {
+    return elementSetAttribute.call(this, name === 'contentEditable' ? 'contenteditable' : name, value);
+  };
+  const prototype = window.HTMLElement.prototype;
+  const prototypeOriginals = new Map<PropertyKey, PropertyDescriptor | undefined>(
+    ['offsetParent', 'scrollTop', 'scrollHeight', 'clientHeight', 'getBoundingClientRect'].map(
+      (key) => [key, Object.getOwnPropertyDescriptor(prototype, key)],
+    ),
+  );
+  const scrollTops = new WeakMap<HTMLElement, number>();
+  Object.defineProperties(prototype, {
+    offsetParent: { configurable: true, get(this: HTMLElement) { return this.parentElement; } },
+    scrollTop: {
+      configurable: true,
+      get(this: HTMLElement) { return scrollTops.get(this) ?? 0; },
+      set(this: HTMLElement, value: number) { scrollTops.set(this, Math.max(0, value)); },
+    },
+    scrollHeight: { configurable: true, get: () => 0 },
+    clientHeight: { configurable: true, get: () => 0 },
+    getBoundingClientRect: {
+      configurable: true,
+      value(this: HTMLElement) {
+        return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0 };
+      },
+    },
+  });
+  class MeasuringResizeObserver {
+    constructor(private readonly callback: ResizeObserverCallback) {}
+    observe(target: Element): void {
+      queueMicrotask(() => {
+        const height = target.hasAttribute('data-chat-scroll-container') ? 100_000 : 100;
+        this.callback(
+          [{ target, contentRect: { height, width: 800 } } as unknown as ResizeObserverEntry],
+          this as unknown as ResizeObserver,
+        );
+      });
+    }
+    unobserve(): void {}
+    disconnect(): void {}
+  }
+  class InertObserver {
+    observe(): void {}
+    unobserve(): void {}
+    disconnect(): void {}
+    takeRecords(): [] { return []; }
+  }
+  Object.assign(window, {
+    ResizeObserver: MeasuringResizeObserver,
+    cancelAnimationFrame: () => undefined,
+    requestAnimationFrame: () => 0,
+  });
+  Object.assign(globalThis, {
+    CSS: { escape: String, supports: () => false },
+    Element: window.Element,
+    HTMLElement: window.HTMLElement,
+    IS_REACT_ACT_ENVIRONMENT: true,
+    IntersectionObserver: InertObserver,
+    MutationObserver: InertObserver,
+    Node: window.Node,
+    ResizeObserver: MeasuringResizeObserver,
+    cancelAnimationFrame: () => undefined,
+    document,
+    getComputedStyle: () => ({ overflowY: 'visible' }),
+    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
+    requestAnimationFrame: () => 0,
+    window,
+  });
+  const container = document.querySelector<HTMLElement>('#root')!;
+  const root = createRoot(container);
+  const dom: PanelDom = {
+    document,
+    window: window as unknown as Window & typeof globalThis,
+    container,
+    async render(element) {
+      await act(async () => { root.render(element); });
+      await act(async () => {});
+    },
+    async cleanup() {
+      await act(async () => { root.unmount(); });
+      window.Element.prototype.setAttribute = elementSetAttribute;
+      for (const [key, descriptor] of prototypeOriginals) {
+        if (descriptor) Object.defineProperty(prototype, key, descriptor);
+        else delete (prototype as unknown as Record<PropertyKey, unknown>)[key];
+      }
+      for (const [key, descriptor] of originals) {
+        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
+        else delete (globalThis as unknown as Record<PropertyKey, unknown>)[key];
+      }
+    },
+  };
+  mounted = dom;
+  return dom;
+}
+
+async function waitUntil(check: () => boolean, message: string, timeoutMs = 3000): Promise<void> {
+  const deadline = Date.now() + timeoutMs;
+  while (!check()) {
+    if (Date.now() > deadline) throw new Error(message);
+    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
+  }
+}
+
+function session(id: string, overrides: Partial<SessionSummary> = {}): SessionSummary {
+  return {
+    id,
+    name: id,
+    isFlagged: false,
+    isArchived: false,
+    labels: [],
+    hasUnread: false,
+    status: 'active',
+    backend: 'ai-sdk',
+    llmConnectionId: 'connection-1',
+    llmConnectionSlug: 'connection-1',
+    connectionLocked: false,
+    model: 'model-a',
+    permissionMode: 'ask',
+    ...overrides,
+  };
+}
+
+function choice(model: 'model-a' | 'model-b' | 'model-c'): ChatModelChoice {
+  const label = { 'model-a': 'Model A', 'model-b': 'Model B', 'model-c': 'Model C' }[model];
+  return {
+    connectionId: 'connection-1',
+    connectionSlug: 'connection-1',
+    connectionName: 'Connection One',
+    providerType: 'anthropic',
+    providerLabel: 'Anthropic',
+    model,
+    label,
+    isDefault: model === 'model-a',
+    thinkingLevels: [],
+  };
+}
+
+interface Harness {
+  dom: PanelDom;
+  source: SessionSummary;
+  host: { current: SessionSummary };
+  sends: Array<{ sessionId: string; model: string }>;
+  writes: Array<{ sessionId: string; target: { llmConnectionId: string; llmConnectionSlug: string; model: string } }>;
+  setChoices(next: readonly ChatModelChoice[]): Promise<void>;
+  rerender(choices: readonly ChatModelChoice[]): Promise<void>;
+}
+
+let choicesSetter: ((next: readonly ChatModelChoice[]) => void) | undefined;
+
+function HarnessPanel(props: {
+  services: WorkbarServices;
+  source: SessionSummary;
+  initialChoices: readonly ChatModelChoice[];
+  initialPrompt?: string;
+}) {
+  const [choices, setChoices] = useState(props.initialChoices);
+  choicesSetter = setChoices;
+  return createElement(QuoteCompanionPanel, {
+    panelId: 'panel-model-picker',
+    active: true,
+    quotes: [],
+    sourceSession: props.source,
+    modelChoices: choices,
+    confirmBypass: async () => true,
+    onQuotesConsumed: () => undefined,
+    ...(props.initialPrompt ? { initialPrompt: props.initialPrompt } : {}),
+  });
+}
+
+function providers(services: WorkbarServices, panel: ReactElement): ReactElement {
+  return createElement(
+    WorkbarServicesProvider,
+    { services },
+    createElement(
+      LocaleProvider,
+      { locale: 'en', children: createElement(ToastProvider, { children: panel }) },
+    ),
+  );
+}
+
+async function mountHarness(options: {
+  choices?: readonly ChatModelChoice[];
+  initialPrompt?: string;
+  setModel?: (
+    sessionId: string,
+    target: { llmConnectionId: string; llmConnectionSlug: string; model: string },
+  ) => Promise<SessionSummary>;
+  send?: WorkbarServices['sideChat']['send'];
+} = {}): Promise<Harness> {
+  const dom = installPanelDom();
+  const source = session('source-session');
+  const host = { current: session('companion-session') };
+  const sends: Harness['sends'] = [];
+  const writes: Harness['writes'] = [];
+  const base = createFakeWorkbarServices();
+  const services: WorkbarServices = {
+    ...base,
+    sideChat: {
+      ...base.sideChat,
+      listSessions: async () => [source, host.current],
+      listTurns: async () => [{ turnId: 'source-turn', status: 'completed' }],
+      branchFromTurn: async () => ({ ok: true as const, session: host.current }),
+      readSettledMessages: async () => ({ messages: [], settled: true }),
+      send: options.send ?? (async (sessionId) => {
+        sends.push({ sessionId, model: host.current.model });
+        return { ok: true as const, turnId: `turn-${sends.length}` };
+      }),
+      setModel: async (sessionId, target) => {
+        writes.push({ sessionId, target });
+        if (options.setModel) return options.setModel(sessionId, target);
+        host.current = { ...host.current, ...target };
+        return host.current;
+      },
+    },
+  };
+  const initialChoices = options.choices ?? [choice('model-a'), choice('model-b')];
+  await dom.render(providers(services, createElement(HarnessPanel, {
+    services,
+    source,
+    initialChoices,
+    initialPrompt: options.initialPrompt,
+  })));
+  return {
+    dom,
+    source,
+    host,
+    sends,
+    writes,
+    async setChoices(next) {
+      assert.ok(choicesSetter);
+      await act(async () => { choicesSetter!(next); });
+    },
+    async rerender(next) {
+      await dom.render(providers(services, createElement(HarnessPanel, {
+        services,
+        source,
+        initialChoices: next,
+        initialPrompt: options.initialPrompt,
+      })));
+    },
+  };
+}
+
+function editor(dom: PanelDom): HTMLElement {
+  const found = dom.document.querySelector<HTMLElement>('[contenteditable="true"]');
+  assert.ok(found, 'composer editor is missing');
+  return found;
+}
+
+function trigger(dom: PanelDom): HTMLElement | null {
+  return dom.document.querySelector<HTMLElement>('.maka-model-switcher-trigger button');
+}
+
+function sendButton(dom: PanelDom): HTMLElement {
+  const found = dom.document.querySelector<HTMLElement>('button[aria-label="Send"]');
+  assert.ok(found, 'Send button is missing');
+  return found;
+}
+
+async function typeDraft(dom: PanelDom, text: string): Promise<void> {
+  await waitUntil(
+    () => dom.document.querySelector('[contenteditable="true"]') !== null,
+    'composer editor did not render',
+  );
+  const input = editor(dom);
+  await act(async () => {
+    input.textContent = text;
+    input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
+    await Promise.resolve();
+  });
+}
+
+async function submit(dom: PanelDom): Promise<void> {
+  const form = dom.document.querySelector('form');
+  assert.ok(form, 'composer form is missing');
+  await act(async () => {
+    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
+    await Promise.resolve();
+  });
+}
+
+async function chooseOption(dom: PanelDom, label: string): Promise<void> {
+  const picker = trigger(dom);
+  assert.ok(picker, 'model picker is missing');
+  await act(async () => {
+    picker.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
+    await Promise.resolve();
+  });
+  await waitUntil(
+    () => [...dom.document.querySelectorAll('[role="option"]')].some(
+      (option) => option.textContent?.includes(label),
+    ),
+    `model option ${label} did not open`,
+  );
+  const option = [...dom.document.querySelectorAll('[role="option"]')].find(
+    (candidate) => candidate.textContent?.includes(label),
+  );
+  assert.ok(option, `model option ${label} is missing`);
+  await act(async () => {
+    option.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
+    await Promise.resolve();
+  });
+}
+
+async function commitCompanion(harness: Harness): Promise<void> {
+  await typeDraft(harness.dom, 'prepare the side conversation');
+  await submit(harness.dom);
+  await waitUntil(() => trigger(harness.dom) !== null, 'fork did not commit its picker');
+  await waitUntil(() => harness.sends.length === 1, 'the fork-creating send did not reach the Host');
+}
+
+afterEach(async () => {
+  await mounted?.cleanup();
+  mounted = undefined;
+  choicesSetter = undefined;
+});
+
+test('the real panel keeps the picker usable when an inherited model is unavailable and recovers send readiness', async () => {
+  const harness = await mountHarness();
+  await commitCompanion(harness);
+  // The fork was created before any pick, and it sent on the inherited model.
+  assert.deepEqual(harness.sends, [{ sessionId: 'companion-session', model: 'model-a' }]);
+
+  // The Host catalog now offers only Model B: neither the source (Model A) nor
+  // the committed companion (Model A) can run, but the picker must remain a
+  // write path. A non-empty draft makes the disabled Send attributable to the
+  // model, not to an empty composer.
+  await harness.setChoices([choice('model-b')]);
+  await typeDraft(harness.dom, 'recover and send');
+  await waitUntil(
+    () => sendButton(harness.dom).getAttribute('aria-disabled') === 'true',
+    'Send stayed enabled while the companion model was unavailable',
+  );
+  const picker = trigger(harness.dom);
+  assert.ok(picker);
+  assert.notEqual(picker.getAttribute('aria-disabled'), 'true', 'the recovery picker was disabled');
+
+  await chooseOption(harness.dom, 'Model B');
+  await waitUntil(
+    () => harness.host.current.model === 'model-b',
+    'the Host did not commit the recovered model',
+  );
+  await waitUntil(
+    () => sendButton(harness.dom).getAttribute('aria-disabled') !== 'true',
+    'Send did not recover after a valid model was committed',
+  );
+  assert.deepEqual(harness.writes, [{
+    sessionId: 'companion-session',
+    target: {
+      llmConnectionId: 'connection-1',
+      llmConnectionSlug: 'connection-1',
+      model: 'model-b',
+    },
+  }]);
+  assert.equal(harness.source.model, 'model-a', 'the source Session must never be written');
+
+  await submit(harness.dom);
+  await waitUntil(
+    () => harness.sends.at(-1)?.model === 'model-b',
+    'the recovered send did not run on the new model',
+  );
+});
+
+test('a failing model write blocks the send while pending, keeps the draft, and never runs the old model', async () => {
+  let rejectWrite!: (error: Error) => void;
+  const write = new Promise<SessionSummary>((_resolve, reject) => {
+    rejectWrite = reject;
+  });
+  const harness = await mountHarness({ setModel: () => write });
+  await commitCompanion(harness);
+  assert.equal(harness.sends.length, 1);
+
+  await typeDraft(harness.dom, 'keep this draft');
+  assert.notEqual(sendButton(harness.dom).getAttribute('aria-disabled'), 'true');
+  // Start a model write that stays pending: the Composer must keep Send blocked
+  // for the whole Host write, not just the optimistic frame.
+  await chooseOption(harness.dom, 'Model B');
+  await waitUntil(
+    () => sendButton(harness.dom).getAttribute('aria-disabled') === 'true',
+    'Send was not blocked while the model write was pending',
+  );
+  await act(async () => {
+    rejectWrite(new Error('model write failed'));
+    await Promise.resolve();
+  });
+  await waitUntil(
+    () => (harness.dom.document.querySelector('[role="alert"]')?.textContent ?? '').includes('Could not change the model'),
+    'the model-switch failure was not surfaced',
+  );
+  // The previous model stays selected and the draft is still there; no turn was
+  // started under either model.
+  assert.equal(harness.host.current.model, 'model-a');
+  assert.match(editor(harness.dom).textContent ?? '', /keep this draft/);
+  assert.equal(harness.sends.length, 1, 'a failed model write must not start a turn');
+  assert.notEqual(sendButton(harness.dom).getAttribute('aria-disabled'), 'true');
+});
+
+test('the picker is disabled while the companion Turn is running', async () => {
+  const harness = await mountHarness({
+    initialPrompt: 'run while the picker is visible',
+    send: () => new Promise<never>(() => undefined),
+  });
+  await waitUntil(() => trigger(harness.dom) !== null, 'fork did not commit its picker');
+  await waitUntil(
+    () => trigger(harness.dom)?.getAttribute('aria-disabled') === 'true',
+    'the model picker stayed enabled during a running Turn',
+  );
+});
diff --git a/apps/desktop/src/main/__tests__/quote-companion-retry.test.ts b/apps/desktop/src/main/__tests__/quote-companion-retry.test.ts
index be14c0b..69afd54 100644
--- a/apps/desktop/src/main/__tests__/quote-companion-retry.test.ts
+++ b/apps/desktop/src/main/__tests__/quote-companion-retry.test.ts
@@ -235,0 +236 @@ async function renderOwnershipProbe(
+    onProjection?: (companion: ReturnType<typeof useQuoteCompanion>) => void;
@@ -369,0 +371,2 @@ function ownershipProbeTree(
+  modelChoices: readonly ChatModelChoice[] = [choiceFor(sourceSession)],
+  onProjection?: (companion: ReturnType<typeof useQuoteCompanion>) => void,
@@ -374,0 +378 @@ function ownershipProbeTree(
+      onProjection,
@@ -376 +380 @@ function ownershipProbeTree(
-      modelChoices: [choiceFor(sourceSession)],
+      modelChoices,
@@ -384,0 +389,2 @@ async function rerenderOwnershipSource(
+  modelChoices: readonly ChatModelChoice[] = [choiceFor(sourceSession)],
+  onProjection?: (companion: ReturnType<typeof useQuoteCompanion>) => void,
@@ -387 +393,3 @@ async function rerenderOwnershipSource(
-    rendered.root.render(ownershipProbeTree(rendered.services, sourceSession, onSend));
+    rendered.root.render(
+      ownershipProbeTree(rendered.services, sourceSession, onSend, modelChoices, onProjection),
+    );
@@ -1193,0 +1202,241 @@ test('source model readiness requires the exact Connection id, slug, and model',
+test('a committed companion sends on its own model after the source model disappears, and the picker recovers it', async () => {
+  const source = session('source-session', { model: 'model-a' });
+  const fork = session('side-conversation', { model: 'model-a' });
+  const choiceA = choiceFor(source);
+  const modelB = session('side-conversation', { model: 'model-b' });
+  const choiceB = choiceFor(modelB);
+  let host = fork;
+  const sendTargets: Array<{ sessionId: string; model: string }> = [];
+  const writes: Array<{ sessionId: string; model: string }> = [];
+  let projection!: ReturnType<typeof useQuoteCompanion>;
+  const rendered = await renderOwnershipProbe(
+    {
+      listTurns: async () => [settledTurn('settled-turn')],
+      branchFromTurn: async () => ({ ok: true as const, session: fork }),
+      listSessions: async () => [source, host],
+      send: async (sessionId) => {
+        sendTargets.push({ sessionId, model: host.model });
+        return { ok: true as const, turnId: `turn-${sendTargets.length}` };
+      },
+      setModel: async (sessionId, target) => {
+        writes.push({ sessionId, model: target.model });
+        host = { ...fork, ...target };
+        return host;
+      },
+    },
+    {
+      sourceSession: source,
+      modelChoices: [choiceA, choiceB],
+      onProjection: (value) => { projection = value; },
+    },
+  );
+  await act(async () => {
+    assert.equal(await rendered.send('seed the companion'), true);
+  });
+  const probe = rendered.container.firstElementChild;
+  assert.ok(probe);
+  assert.equal(probe.getAttribute('data-model-ready'), 'true');
+  assert.equal(probe.getAttribute('data-model-picker-ready'), 'true');
+
+  // The provider catalog drops Model A. Both the source and the fork inherited
+  // it, so sending is blocked — but a model write still has a target.
+  await rerenderOwnershipSource(rendered, source, () => undefined, [choiceB], (value) => {
+    projection = value;
+  });
+  assert.equal(probe.getAttribute('data-model-ready'), 'false');
+  assert.equal(probe.getAttribute('data-model-picker-ready'), 'true');
+  assert.equal(probe.getAttribute('data-active-model'), 'model-a');
+
+  await act(async () => {
+    assert.equal(await projection.setModel({
+      llmConnectionId: choiceB.connectionId,
+      llmConnectionSlug: choiceB.connectionSlug,
+      model: choiceB.model,
+    }), true);
+  });
+  assert.deepEqual(writes, [{ sessionId: 'side-conversation', model: 'model-b' }]);
+  assert.equal(probe.getAttribute('data-model-ready'), 'true');
+  assert.equal(probe.getAttribute('data-active-model'), 'model-b');
+  // The source Session is untouched; the fork now runs on its own recovery.
+  assert.equal(source.model, 'model-a');
+
+  await act(async () => {
+    assert.equal(await rendered.send('after recovery'), true);
+  });
+  assert.deepEqual(sendTargets, [
+    { sessionId: 'side-conversation', model: 'model-a' },
+    { sessionId: 'side-conversation', model: 'model-b' },
+  ]);
+});
+
+test('a delayed companion model write settles before the send, and the turn runs on the new model', async () => {
+  const source = session('source-session', { model: 'model-a' });
+  const fork = session('side-conversation', { model: 'model-a' });
+  const choiceA = choiceFor(source);
+  const modelB = session('side-conversation', { model: 'model-b' });
+  const choiceB = choiceFor(modelB);
+  const write = deferred<SessionSummary>();
+  let writtenTarget: { llmConnectionId: string; llmConnectionSlug: string; model: string } | undefined;
+  const sendTargets: string[] = [];
+  let projection!: ReturnType<typeof useQuoteCompanion>;
+  const rendered = await renderOwnershipProbe(
+    {
+      listTurns: async () => [settledTurn('settled-turn')],
+      branchFromTurn: async () => ({ ok: true as const, session: fork }),
+      listSessions: async () => [source, { ...fork, ...(writtenTarget ?? {}) }],
+      send: async (sessionId) => {
+        sendTargets.push(`${sessionId}:${writtenTarget?.model ?? fork.model}`);
+        return { ok: true as const, turnId: `turn-${sendTargets.length}` };
+      },
+      setModel: async (_sessionId, target) => {
+        writtenTarget = target;
+        return write.promise;
+      },
+    },
+    {
+      sourceSession: source,
+      modelChoices: [choiceA, choiceB],
+      onProjection: (value) => { projection = value; },
+    },
+  );
+  await act(async () => {
+    assert.equal(await rendered.send('seed the companion'), true);
+  });
+  assert.deepEqual(sendTargets, ['side-conversation:model-a']);
+
+  let writeResult!: Promise<boolean>;
+  let sendResult!: Promise<boolean>;
+  await act(async () => {
+    writeResult = projection.setModel({
+      llmConnectionId: choiceB.connectionId,
+      llmConnectionSlug: choiceB.connectionSlug,
+      model: choiceB.model,
+    });
+    sendResult = rendered.send('send only after the pick commits');
+    await Promise.resolve();
+    await Promise.resolve();
+  });
+  // The write is still in flight, so the Host has not been asked to start a
+  // turn — the send waits for the settlement instead of running the old model.
+  assert.deepEqual(sendTargets, ['side-conversation:model-a']);
+
+  await act(async () => {
+    write.resolve({ ...fork, ...writtenTarget! });
+    assert.equal(await writeResult, true);
+    assert.equal(await sendResult, true);
+  });
+  assert.deepEqual(sendTargets, [
+    'side-conversation:model-a',
+    'side-conversation:model-b',
+  ]);
+});
+
+test('a failed model write keeps the draft and never starts the old model', async () => {
+  const source = session('source-session', { model: 'model-a' });
+  const fork = session('side-conversation', { model: 'model-a' });
+  const choiceA = choiceFor(source);
+  const choiceB = choiceFor(session('side-conversation', { model: 'model-b' }));
+  const write = deferred<SessionSummary>();
+  const sendTargets: string[] = [];
+  let projection!: ReturnType<typeof useQuoteCompanion>;
+  const rendered = await renderOwnershipProbe(
+    {
+      listTurns: async () => [settledTurn('settled-turn')],
+      branchFromTurn: async () => ({ ok: true as const, session: fork }),
+      listSessions: async () => [source, fork],
+      send: async (sessionId) => {
+        sendTargets.push(`${sessionId}:${fork.model}`);
+        return { ok: true as const, turnId: `turn-${sendTargets.length}` };
+      },
+      setModel: async () => write.promise,
+    },
+    {
+      sourceSession: source,
+      modelChoices: [choiceA, choiceB],
+      onProjection: (value) => { projection = value; },
+    },
+  );
+  await act(async () => {
+    assert.equal(await rendered.send('seed the companion'), true);
+  });
+  const probe = rendered.container.firstElementChild;
+  assert.ok(probe);
+  assert.deepEqual(sendTargets, ['side-conversation:model-a']);
+
+  let writeResult!: Promise<boolean>;
+  let sendResult!: Promise<boolean>;
+  await act(async () => {
+    writeResult = projection.setModel({
+      llmConnectionId: choiceB.connectionId,
+      llmConnectionSlug: choiceB.connectionSlug,
+      model: choiceB.model,
+    });
+    // The submit arrives while the model write is still in flight. The hook
+    // must wait for it, then abort rather than run Model A.
+    sendResult = rendered.send('keep this draft');
+    await Promise.resolve();
+    await Promise.resolve();
+  });
+  assert.deepEqual(sendTargets, ['side-conversation:model-a']);
+
+  await act(async () => {
+    write.reject(new Error('model write failed'));
+    assert.equal(await writeResult, false);
+    assert.equal(await sendResult, false);
+  });
+  assert.deepEqual(sendTargets, ['side-conversation:model-a']);
+  // The failed draft's optimistic bubble is dropped. A prior successful seed
+  // may still be unsettled in this fake Host, so assert on the failed text
+  // rather than on the total transient count.
+  assert.doesNotMatch(probe.getAttribute('data-transient-texts') ?? '', /keep this draft/);
+  assert.equal(probe.getAttribute('data-active-model'), 'model-a');
+  assert.match(probe.getAttribute('data-error') ?? '', /Could not change the model/);
+});
+
+test('setModel refuses while a companion Turn is running', async () => {
+  const source = session('source-session');
+  const fork = session('side-conversation');
+  const choiceB = choiceFor(session('side-conversation', { model: 'model-b' }));
+  const pendingSend = deferred<{ ok: true; turnId: string }>();
+  let writes = 0;
+  let projection!: ReturnType<typeof useQuoteCompanion>;
+  const rendered = await renderOwnershipProbe(
+    {
+      listTurns: async () => [settledTurn('settled-turn')],
+      branchFromTurn: async () => ({ ok: true as const, session: fork }),
+      listSessions: async () => [source, fork],
+      send: async () => pendingSend.promise,
+      setModel: async () => {
+        writes += 1;
+        return { ...fork, ...{ llmConnectionId: choiceB.connectionId, llmConnectionSlug: choiceB.connectionSlug, model: choiceB.model } };
+      },
+    },
+    {
+      sourceSession: source,
+      modelChoices: [choiceFor(source), choiceB],
+      onProjection: (value) => { projection = value; },
+    },
+  );
+  let sendResult!: Promise<boolean>;
+  await act(async () => {
+    sendResult = rendered.send('run while the picker is locked');
+    await Promise.resolve();
+  });
+  await waitUntil(
+    () => rendered.container.firstElementChild?.getAttribute('data-streaming') === 'true',
+    () => 'the companion never reported a running Turn',
+  );
+  await act(async () => {
+    assert.equal(await projection.setModel({
+      llmConnectionId: choiceB.connectionId,
+      llmConnectionSlug: choiceB.connectionSlug,
+      model: choiceB.model,
+    }), false);
+  });
+  assert.equal(writes, 0, 'a running Turn must never start a model write');
+  await act(async () => {
+    pendingSend.resolve({ ok: true, turnId: 'running-turn' });
+    assert.equal(await sendResult, true);
+  });
+});
+
@@ -3616,0 +3866,2 @@ function QuoteCompanionOwnershipProbe(props: {
+    'data-model-picker-ready': String(companion.modelPickerReady),
+    'data-active-model': companion.activeModel?.model ?? '',
diff --git a/apps/desktop/src/renderer/features/workbar/tools/side-chat/quote-companion-panel.tsx b/apps/desktop/src/renderer/features/workbar/tools/side-chat/quote-companion-panel.tsx
index d537169..05ee13d 100644
--- a/apps/desktop/src/renderer/features/workbar/tools/side-chat/quote-companion-panel.tsx
+++ b/apps/desktop/src/renderer/features/workbar/tools/side-chat/quote-companion-panel.tsx
@@ -38 +38 @@ import { generalizedErrorMessageForLocale } from '@maka/core/redaction';
-import { useQuoteCompanion } from './use-quote-companion';
+import { useQuoteCompanion } from './use-quote-companion.js';
@@ -56 +56 @@ import type { CompanionForkVisibilityEvent } from './quote-companion-visibility'
-import { readScrollMotionBehavior } from '../../../../scroll-motion-policy';
+import { readScrollMotionBehavior } from '../../../../scroll-motion-policy.js';
@@ -65,3 +65,3 @@ import { useWorkbarServices } from '../../services-context.js';
- * its model; once the fork exists, the normal Composer picker can switch the
- * temporary Session's own model without touching the source Session. It explains
- * and explores;
+ * its model until the user picks another; once the fork exists, the normal
+ * Composer picker writes only the temporary Session and never the source. It
+ * explains and explores;
@@ -366 +366,6 @@ export function QuoteCompanionPanel(props: {
-              disabled={!companion.modelReady}
+              // Send readiness and picker readiness are different states: a
+              // companion whose current model became unavailable cannot send,
+              // but its picker must stay usable so the user can pick a model
+              // that can. `sendBlocked` gates only the send; the picker stays
+              // available until the panel has no Session to write to.
+              sendBlocked={!companion.modelReady}
@@ -395 +400 @@ export function QuoteCompanionPanel(props: {
-              modelChoices={companion.companionSession ? [...props.modelChoices] : undefined}
+              modelChoices={companion.modelPickerReady ? [...props.modelChoices] : undefined}
@@ -401,3 +406,6 @@ export function QuoteCompanionPanel(props: {
-              onModelChange={companion.companionSession
-                ? (target) => {
-                    void companion.setModel(target);
+              // Return the promise: ComposerModelPicker keeps its pending state
+              // (and therefore the Composer's send block) until this Host write
+              // settles, instead of treating the optimistic overlay as done.
+              onModelChange={companion.modelPickerReady
+                ? async (target) => {
+                    await companion.setModel(target);
diff --git a/apps/desktop/src/renderer/features/workbar/tools/side-chat/use-quote-companion.ts b/apps/desktop/src/renderer/features/workbar/tools/side-chat/use-quote-companion.ts
index 131ddf8..33deb23 100644
--- a/apps/desktop/src/renderer/features/workbar/tools/side-chat/use-quote-companion.ts
+++ b/apps/desktop/src/renderer/features/workbar/tools/side-chat/use-quote-companion.ts
@@ -216 +216,5 @@ export interface UseQuoteCompanionResult {
-  /** Whether the source and any committed companion can execute their exact model. */
+  /**
+   * Whether a send can start: a committed companion uses its own model, and a
+   * conversation without content also needs a ready source model because its
+   * next send must fork from it.
+   */
@@ -217,0 +222,6 @@ export interface UseQuoteCompanionResult {
+  /**
+   * Whether a model write has a target: true once the fork is committed.
+   * Independent of `modelReady`, so a companion whose current model became
+   * unavailable can still open the picker and recover.
+   */
+  modelPickerReady: boolean;
@@ -505,0 +516,4 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+  // #4695's contract: a turn starts under the settings it read, so a setting
+  // write that is in flight at submit — or requested while the send prepares —
+  // must settle before the Host admits the turn. `beginSettlement` is stable.
+  const beginSettingSettlement = settingIntent.beginSettlement;
@@ -1026,0 +1041,7 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+      // A committed companion runs on its OWN model. Check it before the
+      // source: once the user has picked a valid model here, a stale source
+      // selection must not turn the next send into a fork-setup failure.
+      const existing = companionRef.current;
+      if (existing && sessionHasExactModelChoice(existing, modelChoicesRef.current)) {
+        return Promise.resolve({ status: 'ready', session: existing });
+      }
@@ -1034,4 +1054,0 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
-      const existing = companionRef.current;
-      if (existing && sessionHasExactModelChoice(existing, modelChoicesRef.current)) {
-        return Promise.resolve({ status: 'ready', session: existing });
-      }
@@ -1152,5 +1169,7 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
-  // A committed side conversation with its own content is blocked when its
-  // inherited model is no longer available (the read-only model can't be sent
-  // to). An EMPTY fork (e.g. a first send that failed after commit) must not
-  // wedge the composer: the next send discards it and re-forks from the current
-  // source model, so treat it as ready regardless of its stale inherited model.
+  // Send readiness, deliberately separate from picker readiness. A committed
+  // companion runs on its OWN model, so its send must not depend on the
+  // source's selection; that source only matters while the next send still has
+  // to create (or replace an empty) fork. An EMPTY fork whose inherited model
+  // is stale is replaceable from a ready source, so it must not wedge the
+  // composer; a fork WITH content is not replaceable and stays blocked until
+  // the user picks a valid model in the picker (which stays enabled).
@@ -1158,3 +1177,2 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
-    companion === undefined ||
-    !hasContent ||
-    sessionHasExactModelChoice(companion, modelChoices);
+    companion !== undefined && sessionHasExactModelChoice(companion, modelChoices);
+  const modelReady = companionModelReady || (!hasContent && sourceModelReady);
@@ -1276,0 +1295,12 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+      // #4695: capture this companion's setting writes at submit. A model pick
+      // already in flight, or requested while the send prepares, must commit
+      // (or fail) before the Host admits the turn — otherwise the run could
+      // start under the model the user just replaced.
+      let settlementSessionId = companionIdRef.current;
+      let settlement = settlementSessionId
+        ? beginSettingSettlement(settlementSessionId)
+        : undefined;
+      const releaseSettlement = () => {
+        settlement?.release();
+        settlement = undefined;
+      };
@@ -1322,0 +1353 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+        releaseSettlement();
@@ -1325,0 +1357,8 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+      // A first send only learns its Session id here, after the fork commits.
+      // A replaced empty fork is a different Session, so its old observer must
+      // not gate this send.
+      if (settlementSessionId !== fork.session.id) {
+        releaseSettlement();
+        settlementSessionId = fork.session.id;
+        settlement = beginSettingSettlement(settlementSessionId);
+      }
@@ -1343,0 +1383 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+          releaseSettlement();
@@ -1348,0 +1389 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+          releaseSettlement();
@@ -1362,0 +1404 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+        releaseSettlement();
@@ -1366,0 +1409,8 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+        releaseSettlement();
+        abandonOptimisticSend();
+        return false;
+      }
+      // A model/permission write that failed while this send prepared keeps the
+      // draft and must not start a turn on the model the user replaced.
+      if (!settlement || !(await settlement.settled())) {
+        releaseSettlement();
@@ -1369,0 +1420 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+      releaseSettlement();
@@ -1485,0 +1537 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
+      beginSettingSettlement,
@@ -1867 +1919,2 @@ export function useQuoteCompanion(input: UseQuoteCompanionInput): UseQuoteCompan
-    modelReady: sourceModelReady && companionModelReady,
+    modelReady,
+    modelPickerReady: companion !== undefined,
diff --git a/apps/desktop/stories/session-workbar.stories.tsx b/apps/desktop/stories/session-workbar.stories.tsx
index da14c1f..fa2e90b 100644
--- a/apps/desktop/stories/session-workbar.stories.tsx
+++ b/apps/desktop/stories/session-workbar.stories.tsx
@@ -20 +20 @@
-import { useState, type CSSProperties } from 'react';
+import { useEffect, useState, type CSSProperties } from 'react';
@@ -112,0 +113,4 @@ const TOOL_PICKER_SOURCE_SESSION: SessionSummary = {
+  // The real Host always projects the selected connection's id alongside the
+  // slug; without it the source model can never be an exact catalog choice and
+  // the side chat could never fork.
+  llmConnectionId: 'anthropic-main',
@@ -133,0 +138,7 @@ const SIDE_CHAT_MODEL_CHOICES: ChatModelChoice[] = [
+// A later Host catalog with neither model the source nor the fork inherited.
+// The recovery story swaps to it after the fork commits.
+const SIDE_CHAT_OPUS_CHOICE: ChatModelChoice = {
+  connectionId: 'anthropic-main', connectionSlug: 'anthropic-main', connectionName: 'Anthropic',
+  providerType: 'anthropic', providerLabel: 'Anthropic', model: 'claude-opus-4-5',
+  label: 'Claude Opus 4.5', isDefault: true, thinkingLevels: [],
+};
@@ -914,0 +926,11 @@ function bridge(options: {
+  /** Make the side chat's model write reject, so it shows the retryable failure. */
+  sideChatModelWriteFails?: boolean;
+  /** Hold the side chat's send open, so its Turn is observably running. */
+  sideChatSendPending?: boolean;
+  /** Receives the committed model each time a side-chat send reaches the Host. */
+  onSideChatSend?: (session: SessionSummary) => void;
+  /** Receives each side-chat model write with the Session it targets. */
+  onSideChatModelWrite?: (
+    sessionId: string,
+    target: { llmConnectionId: string; llmConnectionSlug: string; model: string },
+  ) => void;
@@ -1043 +1065,5 @@ function bridge(options: {
-      send: async () => ({ ok: true, turnId: 'story-side-chat-turn' }),
+      send: async () => {
+        if (options.sideChatSendPending) return new Promise<never>(() => undefined);
+        options.onSideChatSend?.(sideChatSession);
+        return { ok: true, turnId: 'story-side-chat-turn' };
+      },
@@ -1056,0 +1083 @@ function bridge(options: {
+        if (options.sideChatModelWriteFails) throw new Error('story side-chat model write failed');
@@ -1057,0 +1085 @@ function bridge(options: {
+        options.onSideChatModelWrite?.(_sessionId, target);
@@ -1101,0 +1130,2 @@ function Workbar(props: {
+  /** The catalog the Host currently offers; defaults to the side chat's own. */
+  modelChoices?: readonly ChatModelChoice[];
@@ -1206 +1236 @@ function Workbar(props: {
-          modelChoices={SIDE_CHAT_MODEL_CHOICES}
+          modelChoices={props.modelChoices ?? SIDE_CHAT_MODEL_CHOICES}
@@ -2484,0 +2515,154 @@ export const SideChatAtColumnFloor: Story = {
+function sideChatCompanion(canvasElement: HTMLElement): Promise<HTMLElement> {
+  return waitFor(() => {
+    const companion = canvasElement.querySelector<HTMLElement>('.maka-quote-companion');
+    if (!companion?.querySelector('.maka-composer-astryx')) {
+      throw new Error('side chat companion is missing');
+    }
+    return companion;
+  });
+}
+
+function sideChatEditor(companion: HTMLElement): HTMLElement {
+  const editor = companion.querySelector<HTMLElement>('[contenteditable="true"]');
+  if (!editor) throw new Error('side chat editor is missing');
+  return editor;
+}
+
+function sideChatModelTrigger(companion: HTMLElement): HTMLElement | null {
+  return companion.querySelector<HTMLElement>('.maka-model-switcher-trigger button');
+}
+
+/** The Host catalog is reachable state, not a story control: this replaces the
+ *  snapshot the same way a provider refresh does, leaving Workbar, the Panel and
+ *  the Composer untouched. */
+const SIDE_CHAT_CATALOG_EVENT = 'storybook:side-chat-model-catalog';
+
+function SideChatCatalogHarness(props: { initial: readonly ChatModelChoice[] }) {
+  const [choices, setChoices] = useState(props.initial);
+  useEffect(() => {
+    const swap = (event: Event) => {
+      setChoices((event as CustomEvent<readonly ChatModelChoice[]>).detail);
+    };
+    window.addEventListener(SIDE_CHAT_CATALOG_EVENT, swap);
+    return () => window.removeEventListener(SIDE_CHAT_CATALOG_EVENT, swap);
+  }, []);
+  return <Workbar tab="side-chat" modelChoices={choices} />;
+}
+
+// Real path: 侧边对话 → first send commits the fork → the Composer's normal
+// model entry writes only that temporary Session. This is the executable state
+// the earlier fixture-only change never reached.
+export const SideChatModelPicker: Story = {
+  decorators: [bridge()],
+  render: () => <Workbar tab="side-chat" />,
+  play: async ({ canvasElement }) => {
+    const page = within(canvasElement.ownerDocument.body);
+    const companion = await sideChatCompanion(canvasElement);
+    const editor = sideChatEditor(companion);
+    await userEvent.type(editor, 'Which model should explain this?{Enter}');
+    await waitFor(() => {
+      const trigger = sideChatModelTrigger(companion);
+      if (!trigger) throw new Error('side chat model picker is missing');
+      expect(trigger).not.toHaveAttribute('aria-disabled', 'true');
+    });
+    const trigger = sideChatModelTrigger(companion)!;
+    expect(trigger).toHaveTextContent('Claude Sonnet 4.5');
+    await userEvent.click(trigger);
+    await userEvent.click(await page.findByRole('option', { name: /Claude Haiku 4\.5/ }));
+    await waitFor(() => expect(sideChatModelTrigger(companion)).toHaveTextContent('Claude Haiku 4.5'));
+  },
+};
+
+// Real path: the provider catalog refreshes after the fork committed and drops
+// both the source model and the fork's inherited model. Sending is blocked, but
+// the picker stays available to recover onto a model the Host now offers.
+const recoverySends: SessionSummary[] = [];
+export const SideChatModelRecovery: Story = {
+  decorators: [bridge({ onSideChatSend: (session) => recoverySends.push(session) })],
+  render: () => <SideChatCatalogHarness initial={SIDE_CHAT_MODEL_CHOICES} />,
+  play: async ({ canvasElement }) => {
+    recoverySends.length = 0;
+    const page = within(canvasElement.ownerDocument.body);
+    const companion = await sideChatCompanion(canvasElement);
+    const editor = sideChatEditor(companion);
+    await userEvent.type(editor, 'First answer{Enter}');
+    await waitFor(() => {
+      const trigger = sideChatModelTrigger(companion);
+      if (!trigger) throw new Error('side chat model picker is missing');
+      expect(trigger).not.toHaveAttribute('aria-disabled', 'true');
+    });
+    // Diverge the fork from the source before the catalog refresh.
+    await userEvent.click(sideChatModelTrigger(companion)!);
+    await userEvent.click(await page.findByRole('option', { name: /Claude Haiku 4\.5/ }));
+    await waitFor(() => expect(sideChatModelTrigger(companion)).toHaveTextContent('Claude Haiku 4.5'));
+
+    // A non-empty draft makes the disabled Send below attributable to the
+    // unavailable model, not to an empty composer.
+    await userEvent.type(editor, 'Hold this draft');
+    window.dispatchEvent(new CustomEvent(SIDE_CHAT_CATALOG_EVENT, { detail: [SIDE_CHAT_OPUS_CHOICE] }));
+    const send = () => within(companion).getByRole('button', { name: '发送' });
+    await waitFor(() => expect(send()).toHaveAttribute('aria-disabled', 'true'));
+    // Recovery stays reachable while send is blocked.
+    await waitFor(() =>
+      expect(sideChatModelTrigger(companion)).not.toHaveAttribute('aria-disabled', 'true'));
+    await userEvent.click(sideChatModelTrigger(companion)!);
+    await userEvent.click(await page.findByRole('option', { name: /Claude Opus 4\.5/ }));
+    await waitFor(() => expect(sideChatModelTrigger(companion)).toHaveTextContent('Claude Opus 4.5'));
+    await waitFor(() => expect(send()).not.toHaveAttribute('aria-disabled', 'true'));
+
+    await userEvent.type(editor, 'Second answer on the new model{Enter}');
+    await waitFor(() => expect(recoverySends.at(-1)?.model).toBe('claude-opus-4-5'));
+  },
+};
+
+// Real path: the Host rejects the companion model write. The error is retryable,
+// the previous model stays selected, and the draft is not sent under it.
+const modelWriteErrorSends: SessionSummary[] = [];
+export const SideChatModelWriteError: Story = {
+  decorators: [bridge({
+    sideChatModelWriteFails: true,
+    onSideChatSend: (session) => modelWriteErrorSends.push(session),
+  })],
+  render: () => <Workbar tab="side-chat" />,
+  play: async ({ canvasElement }) => {
+    modelWriteErrorSends.length = 0;
+    const page = within(canvasElement.ownerDocument.body);
+    const companion = await sideChatCompanion(canvasElement);
+    const editor = sideChatEditor(companion);
+    await userEvent.type(editor, 'Create the fork{Enter}');
+    await waitFor(() => {
+      const trigger = sideChatModelTrigger(companion);
+      if (!trigger) throw new Error('side chat model picker is missing');
+      expect(trigger).not.toHaveAttribute('aria-disabled', 'true');
+    });
+    await userEvent.type(editor, 'Keep this draft');
+    await userEvent.click(sideChatModelTrigger(companion)!);
+    await userEvent.click(await page.findByRole('option', { name: /Claude Haiku 4\.5/ }));
+    await waitFor(() =>
+      expect(companion.textContent ?? '').toMatch(/模型切换失败|Could not change the model/));
+    expect(sideChatModelTrigger(companion)).toHaveTextContent('Claude Sonnet 4.5');
+    expect(editor).toHaveTextContent('Keep this draft');
+    // Only the fork-creating send reached the Host; the draft was never sent
+    // under the model whose replacement failed.
+    expect(modelWriteErrorSends).toHaveLength(1);
+  },
+};
+
+// Real path: a companion Turn is running. Model and thinking controls lock
+// while the in-flight send owns the slot.
+export const SideChatRunningPickerLocked: Story = {
+  decorators: [bridge({ sideChatSendPending: true })],
+  render: () => <Workbar tab="side-chat" />,
+  play: async ({ canvasElement }) => {
+    const companion = await sideChatCompanion(canvasElement);
+    await userEvent.type(sideChatEditor(companion), 'Keep running{Enter}');
+    await waitFor(() => {
+      const trigger = sideChatModelTrigger(companion);
+      if (!trigger) throw new Error('side chat model picker is missing');
+      expect(trigger).toHaveAttribute('aria-disabled', 'true');
+    });
+    // The pending admission keeps the model picker locked until this Turn
+    // settles; the picker assertion above is the observable contract here.
+  },
+};
+
```

本地执行端复核中：初次“实施席自查”与原生父调用中的修订自查均属于作者检查；独立审查给出的 F1/F2 及交付表述问题保留。修订调用实际起止为 2026-10-25T08:55:10.187Z—09:44:49.247Z（UTC），父调用 assistant 字段为 `deepseek-flash`。同一独立审查者仅复核当前修订差量，最终结论另记；不把自查更名为独立通过。

## 原调用与独立审查后续（2026-10-25）

原生 Workflow 实际起止 2026-10-25T07:39:30.684Z—08:34:48.635Z（UTC），正常退出；父调用与三个阶段 assistant 模型字段为 `deepseek-flash`，请求别名不作后端证明。实施席已发布候选到 `relay/a-storybook-adoption-001` 的 `7ffc56b2dc68cedeb6c887aa20e0f15f8f9ef794`；其中“根审查”为作者侧自查，本地执行端尚未接收为交付，状态保持 `running`。

本地执行端新上下文独立只读审查发现两项实际缺陷：模型失效会连恢复选择器一起禁用；模型写入 Promise 被丢弃，下一条消息可能在新模型提交前发送。既有 21 项通用 picker 测试未覆盖新增 companion 路径；当前只有实现候选，不能声称正确功能交付或证明故事层无增量。已沿原会话定向修这两条生产路径及对应可执行消费者，不重跑来源、基础联通或整条调查。

运行边界也已核清：初次分派自行加了全面浏览器／服务禁令，本任务没有 apache/maka 专属入口被拒的回执，实际属于未尝试。后续按原任务范围复用独占工作区现有 Storybook 合成状态入口；保留各项具体拒绝，不访问真实账号／数据、不添持久设施或新权限。原始失败、旧补丁与审查发现保留；结果分支旧候选不得据此当作已验收版本，修订后再回固定提交及实际消费者结果。

## 本地执行端最终独立差量复核

同一新上下文独立只读审查者复核当前修订、原始命令／结果、直接 hook／Panel 消费者与四个 story play，结论通过：原 F1 恢复 picker 不可达、F2 写入／发送乱序已关闭，公开的正确性与授权边界表述也已修正，未发现新的可执行缺陷。不重跑来源、通用测试或整条审查流程。

82 项是两个受影响文件中包含既有用例的套件，并非 82 项新增测试；旧候选加相同修正测试为 77 通过／5 失败，最终为 82 通过／0 失败。四个目标 play 经既有 smokeStory 等待 storyFinished、收集 play／浏览器错误后通过，覆盖假 WorkbarServices 与真实 Panel／Composer／hook 的界面交互；不等于真实后端或 Electron 完成。旧失败、测试／play 初始错误及其定向修正原记录均保留。

交接物为固定 base 上的 9 文件完整候选差量：按上文先应用 attempt-1，再应用零上下文 revision-1 delta，可逆序撤销；独立复核确认两段与保存材料及实际 diff 一致。没有向上游提交、发布或部署；Storybook MCP／docs toolset 未调用，组件资料的因果增量未知，真实 backend／Electron、完整应用、完整 a11y／e2e 与上游接收仍待验。本任务以 `review_ready` 交 dot-A 接收这一候选及具体未知，未标为整体产品完成或 MCP 已采用。
