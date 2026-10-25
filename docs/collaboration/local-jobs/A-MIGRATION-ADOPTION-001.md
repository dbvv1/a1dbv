# A-MIGRATION-ADOPTION-001 · 用现成迁移器与 Agent 交付真实应用升级

id: A-MIGRATION-ADOPTION-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 1111379adfff03dbcd65040af57a30e1b5479bf9
result_branch: relay/a-migration-adoption-001

## 目标与增量

面向开发者的完整目标是：把已有应用升级到当前受支持依赖／API，保住实际功能并留下可继续修改的结果。沿 P81／P90、TASKS 当前重点，选择并采用「维护者迁移器承担重复变换＋Agent 理解语义例外＋应用消费者验收」组合，不再只跑规则夹具。与自由逐处改写、类型／框架迁移器及暂不升级比较，给有根据的条件选择；不是正式模型方法 A/B。

起点是本仓已运行过的 Pinia Colada 0.21→1.0 ast-grep 规则及其负例修订：[现有证据](../../research/2026-10-22-frontier-trials.md#ast-grep先验规则再批量定位)、[15 迁移入口](../../15-task-playbooks.md#5-大规模迁移与升级)。既有夹具结果直接复用，不把它再跑一遍当新采用。Pinia Colada 是优先线索，不是必须得到正结果的指定工具；先核最新官方迁移说明、实现与真实使用者需求，旧问题可能已修。

## 同一任务内调查、选择并实施

1. 在该生态找到确有旧 API／依赖且升级有实际用途的公开应用与具体消费者。读其需求、依赖、已有实现及当前分支／PR；历史 assignee 不能单独证明活跃，在制实现优先复用，不重复覆盖。不要人为降级、植入故障、改造合成 demo 或为工具强造案例。
2. 固定应用与迁移器源码、许可、真实功能及可执行验收。若应用已迁完、现有方案已满足、无真实采用缺口或必要入口受限，保留具体负结果；不扩大成跨生态随机修库。若当前官方规则已修，直接用新版，不复活旧补丁。
3. 条件成立即在同一任务完成整项授权内升级，不只交调查后等下一单。先让实际模型读取所选项目知识和现有约束；重复变换复用现成规则，语义例外交模型处理，必要时保持原依赖并解释。记录最初缺什么证据／操作能力、采用组合改变了哪些判断或实现、关键人工介入、实际产物与消费者结果。
4. 验收必须回真实应用：实际依赖解析、相关类型／构建／测试与功能消费者，比较迁移前必要行为；按真实变化验证重复执行／遗漏调用，不另造通用边界矩阵。UI 若是必要结果而真实浏览器不可用，工程部分可交，明确未完成体验及恢复条件，不冒称成品；不绕过既有浏览器拒绝。

## 写入与交付

- 公开仓库写入仅本任务与 `docs/15-task-playbooks.md` §5。不新建目录、编号专题、流程台账，不改其他章节或共享 TASKS；应用工作在自己的临时工作区，不推第三方仓库、PR／评论或部署。
- 真实应用补丁可直接嵌入本任务已有文件，给固定 base、应用方式与回滚方式；过大则先回报可接收产物形式，别上传整仓或丢掉关键代码。正文写可采用路线、相对可信替代的选择、实际改变与起点，不堆运行记录；没找到真实需求时只回本任务，不向正文制造新发现。
- 使用既有已配置正常原生 Workflow；实际模型从本次响应元数据记录，别名与后端证明分开。一次有效全新上下文独审，修订仅复验受影响范围；未改的规则实验、来源与检查不重跑。
- 只用公开资料和现有授权工作区；不读私人会话、账号用量、公司代码、秘密，不改变凭据／全局设置，不付费、下载大模型、运行引擎或新建会话。原特定拒绝不因一般授权解除；受阻只停相关环节。
- 发布前核最新 main 和目标文件并发变化，按手册 §7 跑适用检查、公开扫描、实际新增提交身份与空白检查。仅结果分支发布；回写固定 SHA、真实执行起止、模型／客户端、结果与未完成项，状态 review_ready，由 dot-A 接收串行合入。

认领：dot 本地协作；2026-10-25T05:54:14.926543+00:00。来源 main 固定 `87d948d`；迁移采用与首页改写无文件重叠，先发布认领后执行既有正常原生 Workflow。复用旧规则夹具结果，限定本任务范围与现有权限；仅推指定结果分支。

负责人续接提示（2026-10-25 06:56 UTC）：公开记录目前仅有 05:54 认领，实际调查／实施进度未知，不据此推定离线或权限阻塞。下次自然回传时请在原任务补已选消费者或具体负结果、实际调用状态与下一步；已有调用继续接收，不因本提示重启、重复广搜或增加实验。独立 09 接收路线文稿已派发，不占用本任务的 15 写入面。

自然进度回传（2026-10-25）：原生 Workflow 调查与采用阶段已返回，当前在同一次调用的交付检查，未重启。已选公开应用 `felinics/Memoh@21b44d1087c43a83bde1fcce1d43a457220d45c1`，采用阶段交回 colada 0.21.2→1.4.8 的四文件依赖／锁文件差量与前后检查输出；官方迁移规则在应用中为零命中，不造语义例外。完整应用检查仍有失败，归因与产品未验范围留最终独立审查核对，当前不宣称整项升级验收完成。下一步接收原交付检查，独立审查实际补丁、失败归因和消费者证据，再回传固定成果。

## 交付记录（adoption 阶段）

**状态：review_ready。** 应用固定 base `21b44d1087c43a83bde1fcce1d43a457220d45c1`（felinics/Memoh，AGPL-3.0）。原生 Workflow 自 2026-10-25T13:55+08:00 起，至 15:16+08:00 完成；采用阶段执行 2026-10-25T14:31–15:01+08:00。模型（assistant 消息元数据）：`deepseek-flash`；请求别名为 `deepseek-v4.1-flash[1m]`；客户端为 Claude Code 原生 Workflow 的 adoption 子代理。后端没有可核查证明，不据此推断，也不是正式模型方法 A/B。

发布前核对：origin/main 已推进到 `fde9056`，除本任务认领与负责人续接提示外，另含一条并发“自然进度回传”；两者均原样保留，其“交付检查进行中／未宣称完成”的状态由本交付记录更新。`docs/15-task-playbooks.md` 无并发改动。结果分支 HEAD `78fcf2c` 是 main 的祖先，提交／推送与整合由父会话负责；本阶段未提交。

### 选择与实际改变

采用「维护者规则作覆盖检查＋包管理器／上游类型承担重复变换＋Agent 判定语义例外＋真实应用类型／构建与已有消费者单测（含替身）」；本次交工程部分，应用功能验收仍未完成。无目标调用时逐处改写没有收益；现有生成定义和页面类型检查已通过，重生成没有已证明的收益。若部署要求先取得真实浏览器与正常业务链验收，保留原依赖仍是适用选择；工程可解析不等于产品已可升级，不能据此强推上线。

- 迁移器与许可：Pinia Colada 官方 0.21→1.0 codemod（MIT，规则 blob `4042f70ceb69bb515d53e306e7d084bf33c2abff`，2026-10-25 与上游 main 一致）、`@ast-grep/cli 0.51.0`（MIT）。实际依赖解析与锁定由仓库声明的 `pnpm 10.27.0` 完成。
- 版本：`@pinia/colada 0.21.2 → 1.4.8`（MIT；新增传递依赖 `nostics 1.3.0`，MIT）。pinia 保持 `3.0.4`，vue `3.5.44`，满足 1.4.8 的 peer；`vue-router 5.2.0` 的 peer 也满足，无需连带升 pinia 4。
- 起点与缺口：两个 app 均声明 `^0.21.2`，lockfile 解析 `0.21.2`；`packages/sdk` peer 为 `>=0.21.0`，其 149 个生成的 `defineQueryOptions` 与 7 个 `useQuery(getBotsQuery())` 消费点共用该类型。维护者在 #870 记录的 `defineQueryOptions → useQuery` 推断断裂是待验缺口。
- 规则结果：复用既有夹具结论，未重跑重放脚本；只把同一规则用于真实应用扫描。对 apps 与 packages 运行当前官方规则，命中 **0**；源码扫描 111 个引用／模拟 `@pinia/colada` 的源码文件（92 个直接导入）、128 处 `useQuery/useQueryState` 全为单参，**0** 处 two-arg。故 codemod 只作“应无命中”的覆盖检查，没有为工具制造目标调用。
- 实际改变：4 个文件、0 源码改动。`apps/web` 与 `apps/desktop` 升 `^1.4.8`；`packages/sdk` peer 收紧为 `>=1.0.0`，使 app 与 SDK 生成定义只解析一份 1.4.8；lockfile 仅替换 colada 条目、更新 vue-router 的 peer 快照并加入 `nostics@1.3.0`，保留原有 libc 元数据。
- 语义例外：0 处；人工介入：0 处，未手改任何源码或生成定义。1.0 的唯一 breaking change 是移除 two-arg 形式；1.4.8 下 #870 所述推断断裂未复现，149 个定义与 7 个消费者无需显式泛型、重生成或薄适配。未使用 `@hey-api/openapi-ts 0.99.0` 重生成（那会引入 Go／swagger 工具链且无类型收益）。

### 验收（固定应用 SHA；Node 22.23.2；pnpm 10.27.0）

| 检查 | 迁移前 0.21.2 | 迁移后 1.4.8 |
|---|---|---|
| `pnpm --filter @memohai/sdk typecheck` | 0 错误 | 0 错误 |
| `pnpm --filter @memohai/web typecheck` | 0 错误 | 0 错误 |
| `pnpm --filter @memohai/desktop typecheck` | 0 错误 | 0 错误 |
| `pnpm --filter @memohai/web build` | 通过 | 通过 |
| `pnpm test --run --project web` | 2414 项，8 失败／6 文件 | 2414 项，9 失败／7 文件 |
| 8 个既有消费者单测文件（含替身） | 未单跑 | 50 项全通过，范围见下 |
| `pnpm lint` | 0 错误／20 警告 | 0 错误／20 警告 |

`model-list-row` 的 15s 超时在初次迁移前后集合中多出，但在 0.21.2 基线单跑及全量复跑同样出现（9 失败／7 文件）。当前未观察到升级独有的失败集合，加载根因和升级影响仍未坐实；60s 单跑仍受测试内显式 15000ms 限制，不能据此解释原因。其余失败与基线同集合（sessionStorage／localStorage、`file:///logo.svg`、vue-i18n mock、图标契约、链接默认行为）。重复执行 `pnpm install --frozen-lockfile` 无 lockfile 变化；官方规则在最终树复扫仍为 0 命中。

八文件50项中，六文件 mock 了 Colada；缓存测试使用假 QueryCache／$onAction，覆盖真实序列化函数与部分应用保存逻辑；hooks 使用真实 Colada＋假 API。它们未验证七处页面消费者的真实请求、缓存跨升级恢复或正常导航链。基线 SDK typecheck 的 tail 管道退出码不独立证明成功，原短输出无诊断；采用后由 pipefail 保留明确成功状态。

### 未完成与限制

- **真实 UI／运行时未验证**：没有浏览器、服务、数据库授权，保留既有拒绝。Memoh 的 `AGENTS.md` 要求 `mise run dev` 后浏览器操作与截图，本单只交工程部分，不声称成品。恢复条件：获准浏览器入口＋可运行后端（Postgres、Qdrant 等）后启动开发环境，验证 bot 列表／选择与查询缓存跨刷新恢复。
- 运行环境用系统 Node 22.23.2，未安装仓库 `mise.toml` 固定的 Node 24.22.1；hosted CI 未复跑。
- 未重生成 SDK，未跑 Go 后端与 Electron 打包；未推第三方仓库、PR、评论或部署。
- Workflow 内父调用的自查覆盖补丁、依赖解析与检查记录；之后本地执行端取得一次新上下文独立只读审查，未发现四文件补丁的确定代码缺陷，提出失败归因、替身单测范围与暂缓条件三项表述问题，已据原证据修订，不重跑测试。工程部分与真实 UI／运行时验收仍分开。
- 公开写入仅本任务与 `docs/15-task-playbooks.md` §5；以下补丁只含依赖声明与锁文件，不含 Memoh 源码，完整 diff 留在私有工作区；下方嵌入补丁的 SHA-256 为 `fd94f2c7c093f92708109a4ea740c321a62c273779d5a4cd7b689c8bfa8308ca`（空上下文行按空行排版，`git apply --check --cached` 已验证）。

### 应用方式与回滚

固定 base `21b44d1087c43a83bde1fcce1d43a457220d45c1`；需 pnpm 10.27.0（pnpm 11 不读 package.json 的 `pnpm.overrides`，会拒绝该 frozen lockfile）。

```sh
git clone https://github.com/felinics/Memoh.git Memoh
git -C Memoh checkout 21b44d1087c43a83bde1fcce1d43a457220d45c1
git -C Memoh submodule update --init packages/ui
git -C Memoh apply memoh-colada-1.4.8.patch
cd Memoh && pnpm install --frozen-lockfile
```

回滚：

```sh
git -C Memoh apply -R memoh-colada-1.4.8.patch
# 或 git -C Memoh checkout -- apps/desktop/package.json apps/web/package.json packages/sdk/package.json pnpm-lock.yaml
cd Memoh && pnpm install --frozen-lockfile
```

补丁：

```diff
diff --git a/apps/desktop/package.json b/apps/desktop/package.json
index 3f587ac..98e761e 100644
--- a/apps/desktop/package.json
+++ b/apps/desktop/package.json
@@ -46,7 +46,7 @@
     "@memohai/icon": "workspace:*",
     "@memohai/sdk": "workspace:*",
     "@memohai/web": "workspace:*",
-    "@pinia/colada": "^0.21.2",
+    "@pinia/colada": "^1.4.8",
     "@tailwindcss/vite": "^4.3.3",
     "@types/node": "^25.9.5",
     "@vee-validate/zod": "^4.15.1",
diff --git a/apps/web/package.json b/apps/web/package.json
index 0709176..256ce7b 100644
--- a/apps/web/package.json
+++ b/apps/web/package.json
@@ -35,7 +35,7 @@
     "@lisse/vue": "^0.4.0",
     "@memohai/icon": "workspace:*",
     "@memohai/sdk": "workspace:*",
-    "@pinia/colada": "^0.21.2",
+    "@pinia/colada": "^1.4.8",
     "@shikijs/transformers": "^4.0.1",
     "@tailwindcss/vite": "^4.3.3",
     "@tanstack/vue-table": "^8.21.3",
diff --git a/packages/sdk/package.json b/packages/sdk/package.json
index b7444ca..c038e43 100644
--- a/packages/sdk/package.json
+++ b/packages/sdk/package.json
@@ -18,7 +18,7 @@
   },
   "packageManager": "pnpm@10.27.0",
   "peerDependencies": {
-    "@pinia/colada": ">=0.21.0"
+    "@pinia/colada": ">=1.0.0"
   },
   "peerDependenciesMeta": {
     "@pinia/colada": {
diff --git a/pnpm-lock.yaml b/pnpm-lock.yaml
index 39731e1..fbebff8 100644
--- a/pnpm-lock.yaml
+++ b/pnpm-lock.yaml
@@ -132,8 +132,8 @@ importers:
         specifier: workspace:*
         version: link:../web
       '@pinia/colada':
-        specifier: ^0.21.2
-        version: 0.21.2(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))
+        specifier: ^1.4.8
+        version: 1.4.8(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))
       '@tailwindcss/vite':
         specifier: ^4.3.3
         version: 4.3.3(vite@8.1.6(@types/node@25.9.5)(esbuild@0.27.2)(jiti@2.7.0)(tsx@4.21.0)(yaml@2.9.0))
@@ -208,7 +208,7 @@ importers:
         version: 11.4.8(vue@3.5.44(typescript@6.0.3))
       vue-router:
         specifier: ^5.2.0
-        version: 5.2.0(@pinia/colada@0.21.2(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3)))(@vue/compiler-sfc@3.5.44)(esbuild@0.27.2)(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(rolldown@1.2.15)(vite@8.1.6(@types/node@25.9.5)(esbuild@0.27.2)(jiti@2.7.0)(tsx@4.21.0)(yaml@2.9.0))(vue@3.5.44(typescript@6.0.3))
+        version: 5.2.0(@pinia/colada@1.4.8(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3)))(@vue/compiler-sfc@3.5.44)(esbuild@0.27.2)(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(rolldown@1.2.15)(vite@8.1.6(@types/node@25.9.5)(esbuild@0.27.2)(jiti@2.7.0)(tsx@4.21.0)(yaml@2.9.0))(vue@3.5.44(typescript@6.0.3))
       vue-tsc:
         specifier: ^3.3.8
         version: 3.3.8(typescript@6.0.3)
@@ -240,8 +240,8 @@ importers:
         specifier: workspace:*
         version: link:../../packages/sdk
       '@pinia/colada':
-        specifier: ^0.21.2
-        version: 0.21.2(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))
+        specifier: ^1.4.8
+        version: 1.4.8(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))
       '@shikijs/transformers':
         specifier: ^4.0.1
         version: 4.0.1
@@ -346,7 +346,7 @@ importers:
         version: 11.4.8(vue@3.5.44(typescript@6.0.3))
       vue-router:
         specifier: ^5.2.0
-        version: 5.2.0(@pinia/colada@0.21.2(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3)))(@vue/compiler-sfc@3.5.44)(esbuild@0.27.2)(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(rolldown@1.2.15)(vite@8.1.6(@types/node@25.9.5)(esbuild@0.27.2)(jiti@2.7.0)(tsx@4.21.0)(yaml@2.9.0))(vue@3.5.44(typescript@6.0.3))
+        version: 5.2.0(@pinia/colada@1.4.8(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3)))(@vue/compiler-sfc@3.5.44)(esbuild@0.27.2)(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(rolldown@1.2.15)(vite@8.1.6(@types/node@25.9.5)(esbuild@0.27.2)(jiti@2.7.0)(tsx@4.21.0)(yaml@2.9.0))(vue@3.5.44(typescript@6.0.3))
       zod:
         specifier: ^4.3.5
         version: 4.3.6
@@ -426,8 +426,8 @@ importers:
   packages/sdk:
     dependencies:
       '@pinia/colada':
-        specifier: '>=0.21.0'
-        version: 0.21.2(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))
+        specifier: '>=1.0.0'
+        version: 1.4.8(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))

   packages/ui:
     dependencies:
@@ -1616,10 +1616,10 @@ packages:
     resolution: {integrity: sha512-ODOov0sGMJMf3jPonOkgGqPknTsu+DdQ7kD++gz8aI+aFMOMHFbWAA2taqXXVTdP+OTOQR/znGvSpmkeI0WTYQ==}
     engines: {node: '>=14.18.0'}

-  '@pinia/colada@0.21.2':
-    resolution: {integrity: sha512-k2epk1jed5cTmNA7l00UtsFRyqw9HfyU6WO4cV0BMUT3sSE4CMLCilprbLAL5h2bxD76WSiglciI/6o+Uh7Vzw==}
+  '@pinia/colada@1.4.8':
+    resolution: {integrity: sha512-WkfCM0Z2GF2zW0uzaMWfRs5OcIViMMou6zTeZ8gtvaJfdPDsmDWVgx4la+BzWWQuvBiDuH4Bm9R8/T50EpmgBQ==}
     peerDependencies:
-      pinia: ^2.2.6 || ^3.0.0
+      pinia: ^2.2.6 || ^3.0.0 || ^4.0.2
       vue: ^3.5.44

   '@polka/url@1.0.0-next.29':
@@ -4411,6 +4411,9 @@ packages:
   nostics@1.2.0:
     resolution: {integrity: sha512-FGqEfhQjrvo1lL8KFifdTQiNwwQHJxC1jtYE1Rc54qF/jxONUNL+kC9gS1krX8Q65PgrQ5fCqH/I4NhWBvdSqg==}

+  nostics@1.3.0:
+    resolution: {integrity: sha512-wzRsrJwNlFbqIRQt8aCeL2WE8USip/uuvGSOZV1D02CxX8ABTMbw8IywKjH7yWHETMXbWJI4OBpihg9rmz2Vyg==}
+
   npm-normalize-package-bin@4.0.0:
     resolution: {integrity: sha512-TZKxPvItzai9kN9H/TkmCtx/ZN/hvr3vUycjlfmH0ootY9yFBzNOpiXAdIn1Iteqsvk4lQn6B5PTrt+n6h8k/w==}
     engines: {node: ^18.17.0 || >=20.5.0}
@@ -6766,8 +6769,9 @@ snapshots:
       tslib: 2.8.1
       webcrypto-core: 1.9.2

-  '@pinia/colada@0.21.2(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))':
+  '@pinia/colada@1.4.8(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))':
     dependencies:
+      nostics: 1.3.0
       pinia: 3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3))
       vue: 3.5.44(typescript@6.0.3)

@@ -9725,6 +9729,8 @@ snapshots:

   nostics@1.2.0: {}

+  nostics@1.3.0: {}
+
   npm-normalize-package-bin@4.0.0: {}

   npm-run-all2@8.0.4:
@@ -10794,7 +10800,7 @@ snapshots:
       - '@vue/composition-api'
       - typescript

-  vue-router@5.2.0(@pinia/colada@0.21.2(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3)))(@vue/compiler-sfc@3.5.44)(esbuild@0.27.2)(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(rolldown@1.2.15)(vite@8.1.6(@types/node@25.9.5)(esbuild@0.27.2)(jiti@2.7.0)(tsx@4.21.0)(yaml@2.9.0))(vue@3.5.44(typescript@6.0.3)):
+  vue-router@5.2.0(@pinia/colada@1.4.8(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3)))(@vue/compiler-sfc@3.5.44)(esbuild@0.27.2)(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(rolldown@1.2.15)(vite@8.1.6(@types/node@25.9.5)(esbuild@0.27.2)(jiti@2.7.0)(tsx@4.21.0)(yaml@2.9.0))(vue@3.5.44(typescript@6.0.3)):
     dependencies:
       '@babel/generator': 8.0.0
       '@vue-macros/common': 3.1.4(vue@3.5.44(typescript@6.0.3))
@@ -10816,7 +10822,7 @@ snapshots:
       vue: 3.5.44(typescript@6.0.3)
       yaml: 2.9.0
     optionalDependencies:
-      '@pinia/colada': 0.21.2(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))
+      '@pinia/colada': 1.4.8(pinia@3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3)))(vue@3.5.44(typescript@6.0.3))
       '@vue/compiler-sfc': 3.5.44
       pinia: 3.0.4(typescript@6.0.3)(vue@3.5.44(typescript@6.0.3))
       vite: 8.1.6(@types/node@25.9.5)(esbuild@0.27.2)(jiti@2.7.0)(tsx@4.21.0)(yaml@2.9.0)
```

### 本地执行端最终复核

实际原生调用 2026-10-25T05:55:33.884Z—07:23:11.639Z（UTC）正常退出；父调用与三个 Workflow 阶段响应字段均为 `deepseek-flash`，请求别名不作后端证明。一次新上下文独立审查未发现四文件补丁的确定代码缺陷；两项验收表述及暂缓比较问题已修正并仅复核对应 delta，原问题关闭。真实应用功能、浏览器体验与缓存跨升级恢复仍未验，本次只交可应用工程差量。原始失败、全量未通过与替身单测范围均保留，未再重跑。
