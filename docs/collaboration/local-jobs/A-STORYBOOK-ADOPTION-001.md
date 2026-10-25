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

**状态：`review_ready`（工程交付；真实交互与故事层未验，不升级为采用）。** 只写本任务与 `docs/13-frontier-radar.md` 的 Storybook 候选入口；未向 apache/maka 推送、开 PR／评论或部署。应用改动留在独占私有临时工作区，未写入公开仓库。

### 消费者核实（固定只读基线）

- 仓库 [apache/maka](https://github.com/apache/maka)，Apache-2.0；固定 SHA `222a06fe316f12df3129eff1c16ab3bfaf85c479`，2026-10-25 核对远端 `main` 仍指向该 SHA。
- 需求 [issue #4495](https://github.com/apache/maka/issues/4495) 仍 open：无 assignee、无 milestone，标签 `enhancement`／`stale`，2 条评论；stale bot 提示约 2026-11-01 关闭。正文的验收条目与当前代码一致：`QuoteCompanionPanel` 未传 `activeSession`／`onModelChange`，模型为只读。
- **已有在制实现**：[PR #4499](https://github.com/apache/maka/pull/4499)（+296/−27，12 文件）于 2026-09-01 提交、2026-10-09 因 stale 关闭且未合并；维护者 Astro-Han 给出 CHANGES_REQUESTED，原话要求先讨论“是否会实现这个功能”并补 before/after 对比；没有针对 #4495 的后续 open PR。维护者在 #4495 下另提出缓存命中疑虑；相邻 [#4540](https://github.com/apache/maka/issues/4540)（open，assigned）把该问题单列为 fork 前缀缓存 bug，[#4543](https://github.com/apache/maka/pull/4543)（open，+1493/−36）修复它，正文明确“不改 #4495”，故独立模型选择仍开放。需求真实但上游是否接收未定，本轮不替上游决定。
- 现有 Storybook 与安全：`storybook` 实际解析 **10.6.2**、`@storybook/react-vite` **10.6.0**；未安装 `@storybook/addon-mcp`、`@storybook/core`、`addon-a11y`、`addon-vitest`。10.6.2 是 GHSA-f2ph-cmg5-wxc8 的修补下限，安装树不在已知受影响范围。
- 没有调用 Storybook MCP，也没有新增持久 MCP、凭据、付费服务或浏览器权限。

### 实现（固定 base，私有工作区）

在固定 SHA 的独占检出中完成 Side Conversation 独立模型选择：7 个文件，+174/−24。复用现有能力，不新增依赖或设施。

- `SideChatSessionPort.setModel(sessionId, target)` 接入既有 `bridge.sessions.setModelConfiguration`，写入时把 `thinkingLevel` 清空，与主对话换模型的语义一致。
- `useQuoteCompanion` 新增 `modelConfiguration` 设置通道，沿用 `useSessionSettingIntent` 的乐观 overlay、失败回退与重试；`setModel` 在 Turn 运行中或 fork 未提交时直接拒绝，写前不做部分更新。
- `QuoteCompanionPanel` 只在 companion fork 提交后传入 `activeSession`／`modelChoices`／`onModelChange`；fork 前仍是继承模型的只读标签，避免出现“写不到任何 Session”的假 picker。
- 写入只使用 companion `sessionId`，源 Session 从不参与；刷新失败时 overlay 回退到已提交模型并显示可重试错误，不关闭或重建 fork。
- 与旧 PR 的差异：未带无关的 model-metadata workflow／scripts；未线程 provider brand mark（入口与可选模型相同，仅装饰差异）；未新增整套工具链。

验收对应：① fork 提交后出现主对话同款 picker；② 只改 companion 且显示随之更新；③ 消息／引用／附件／草稿不与写入耦合；④ 运行中拒绝且无部分更新；⑤ 失败回退后可重试；⑥ 关闭与清理路径未改。

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

未运行：Storybook dev server、play 函数、Electron／桌面应用、真实浏览器、a11y 与 e2e。因此“picker 实际出现、运行中禁用、失败重试”的界面行为**未做真实体验验证**，只做了类型、既有测试、静态构建与源码路径核对。没有模型或 MCP 的工具响应元数据可报。

### 故事／组件资料层的判断

直接读 `Composer` 的 props 契约、`setSessionExecutor`／`setModelConfiguration` 端口和既有 21 项模型选择测试，已足够完成本次接线；组件 manifest、`docs-show` 或新增 play **没有改变任何一个实现判断**。阅读现有 `SideChat` story 只发现：fork 在首次发送后才存在，现有 story 到不了新 picker 状态；因此同步补了 fake 的 `setModel` 与写后状态（否则 story 类型不一致、刷新后会回到旧模型），但没有把未运行的 play 当作验收。

**结论（决定门槛）**：该消费者上“源码＋原生测试”已产生正确补丁，故事／组件资料层没有可证明的增量；本次不升级为采用，不给 04／09／15／23 或 TASKS 增加路线入口。保留 issue #4495、固定 SHA 与上面的私有补丁，待具备既有浏览器／Storybook 运行授权时再验证交互与 before/after。

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
- 工作流阶段未提交、未推送、未开上游 PR／评论、未部署；根审查后由父执行端提交并推送指定结果分支（最终 SHA 见交接消息）。
- 未新增目录、编号专题、证明台账或通用页面改写；未触碰 A／B 试点与原有浏览器／服务拒绝。
- 真实模型通道：本会话运行于 `deepseek-v4.1-flash[1m]`（harness 别名，不作为独立后端身份）；没有调用 Storybook MCP，也没有模型响应可作为组件资料效果证据。

### 根审查（父会话，2026-10-25）

- 复核消费者：`apache/maka` 仍为 Apache-2.0；固定 SHA `222a06f` 仍是远端 `main`；#4495 open、无 assignee／milestone、2 条评论；#4499 closed unmerged（+296/−27、12 文件、CHANGES_REQUESTED）；相邻 #4540 open／assigned、#4543 open（+1493/−36），#4540 正文明确与 #4495 正交。
- 复核实测版本：`storybook` 10.6.2、`@storybook/react-vite` 10.6.0；`@storybook/addon-mcp`／`@storybook/core`／a11y／vitest 不在安装树。GHSA-f2ph-cmg5-wxc8 的 patched floor 为 10.6.2（另有 9.1.21、8.6.19、11.0.0-alpha.6），安装树不在受影响范围。
- 复核补丁：内联补丁与 `evidence/our-stripped.patch` 字节一致；在固定 SHA 工作区 `git apply -R --check` 通过，`git diff --check` 干净；7 文件 +174/−24 与记录一致。
- 复核验证：`node --test packages/ui/dist/__tests__/composer-model-picker-recovery.test.js` 21/21 通过；`build-storybook` 三次后台运行均 exit 0；typecheck／checker 日志 exit 0；基线 fixture 在干净 base 上复现失败（raw transcript），归因已按断言原文修正。
- 修正：`status` 改为 `review_ready`；删除未支持的“Windows 路径”归因；补充相邻 open PR #4543 与维护者缓存疑虑；`docs/13` 的 `[本仓工程]` 改为已定义的 `[经验：实测]`，并把“新增 story”改为“补现有 story fixture”。
- 未完成：真实 Storybook dev server／play／Electron／浏览器／a11y／e2e 未运行；新增 `setModel` 路径没有新增直接单测（仅类型、既有 21 项测试、静态构建与源码核对）；无模型／MCP 工具响应元数据；上游是否接收未定。
