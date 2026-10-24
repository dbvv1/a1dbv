主线：二／三／四
改变的建议：已有流程改组先保旧身份、值与动作契约，分验状态、邀请与PDF；不把单项绿灯当完整闭包。[研究／本仓运行]
核实时间：保留2026-10-20静态取证及2026-10-21实际应用子集、恢复补证与验证边界；模型对照仍未运行。本次仅分册，不新增技术结论或运行结果。

# 开发条件：既有流程改组与连续验收

[反馈与验证总览](2026-10-12-development-feedback.md)；[开发条件总览](2026-10-12-development-conditions.md)。本页保留P25的采用／撤回条件、连续状态账本、运行入口与原证据日期。

### P25：代填角色到并行审批组

**✅ 已有Documenso保旧完成／已填步骤，只扩未填未签尾部原生组。** Agent先交旧身份、值和动作契约，人决定哪些阶段等齐；他人代填的inserted也锁收件人。[研究：采用判断]

**⛔ 必须移动已填／已完成人、将null链或AES/QES变并行，就撤回原生重编组。** 人定保旧流程或另设计迁移，清字段重建不算继承。[研究]

核实：2026-10-20。取证链：Assistant引入#1588[最终树332e065][p25-r1] → 分组#3319[最终树573c928][p25-r2]。原取证为固定源码／测试；2026-10-21补实际应用子集，结果见下，未运行模型对照。[一手：源码；研究：范围]

#### 真实主轨改变的选择（2026-10-21）

**✅ 改组后读回该收件人的预期新顺序，同时核旧身份与字段，不把“新增更新审计”当成功条件。** 固定Documenso内，同一S1经局部改106到S2，再继续审批、签署与封存已实际跑完；这是应用状态继承，不是两轮Agent代码修改或跨版本升级。[本仓运行]

**原审计预期被否定。** 原设计要求106改组新增更新审计，实测S1/S2均为同一21条。`update-envelope-recipients.ts:193–211`仅在diff非空时写RECIPIENT_UPDATED，而`utils/document-audit-logs.ts:94–149`不比较signingOrder，只比较auth、email、role、name；应修正本研究判据，不称已证上游违约。[一手／本仓运行]

**若业务必须记录每次顺序变更，当前原生路线仍不满足这个要求。** 不能把改测试预期当作补齐审计；应先补足这条变更记录，或保留现有流程。[研究：撤回条件]

执行脚本只断言旧audit IDs保留，漏了“必须新增”的原谓词，因此1个Playwright绿灯不是预注册全部通过。没有执行前脚本hash；“最初即如此、未事后放宽”仅为作者声明，不补造历史。[研究：证据限制]

**最高水平仍未知，本次只把可行子集变成运行证据。** 沿用审计[C13任务打法](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c13--任务打法)的近期参照：OpenAI 2026-10-14维护案例与Willison 2026原型实践，重在真实路径、既有产物和选择比较；本次尚未比较领先维护路线。效果评估另按[C15](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c15--agent-评估)的代表任务、重复trial和结果校准，不能从确定性夹具推导模型收益。[研究；前沿比较：仅候选，差距1]

| 实际运行 | 结果与限度 |
|---|---|
| 固定573c928、Node24.19/npm11.19.1、Postgres15.19 | 85个上游纯逻辑测试通过，另建真实测试DB及本地SMTP sink；无真实收件人或互联网发信 |
| 一次生成S1，主轨不restore/reseed | 7人、5字段、1签名、21审计；S2仅原106改组。后续独审重算保存recipient全列（token为指纹）与Field全列，只有106 order不同；Envelope/Meta无完整前后快照 |
| 主轨105先完→106末完 | 105完成后107邀请job仍0；106完成才为1。最终7人、5个inserted字段、3签名、43审计及COMPLETED |
| 同一S1 dump恢复新库，另跑106→105 | 原ID/token指纹/字段/旧审计核对后，反序也等末人完成才邀107；恢复命令为执行者回执，独审未重跑DB操作 |
| PDF与后续只读补证 | 三页、五字段可见；下载body含PDF头且hash=DB成品=冻结PDF，completedAt非空。pdfsig独审重跑为Signature Valid、issuer unknown，并保留NSS警告；固定位置有文字重叠，布局和身份信任不算通过 |
| 邮件捕获 | 每人至少一封含原token链接；2–3封总数混有完成通知，不能当邀请次数。逐角色邀请文案与审计actor未验 |

主轨18.0秒、反序25.9秒、后续下载20.5秒各1测试，分别记账，不合成成功率。并发/重复完成、whole-set遗漏锁定ID、中断恢复、签署UI及模型对照仍未验。[本仓运行／研究]

#### 独立恢复补证：完整状态与行动邀请

**局部改组继续采用，但验收不能只看旧ID与邮件里出现token。** 本次从原S1恢复到独立测试DB，只发106顺序更新。完整六表36行477个标量单元只有该order由5变4，其余476项相同，包括Envelope.updatedAt与21条完整审计；没有将新支线快照倒填旧主轨。**[本仓运行，2026-10-21]**

六表是目标envelope关联的Envelope、DocumentMeta、Recipient、Field、Signature、DocumentAuditLog，不是全库。Prisma全标量字段与SQL列清单逐一匹配；ApiToken不在这六表内，额外只读核对发现lastUsedAt变化，首次“凭据整行相同”断言失败已保留，凭据值未导出。**[本仓运行／研究：范围]**

**邀请判据也要有反例。** 初版“正文含token”会接受没有正确行动链接的邮件，空收件人集合和多余未知标题邀请也能误过，独审拒收后重写窄判据。针对固定七人／角色，从HTML行动href与纯文本CTA检查可信origin、精确`/sign/<原token>`路径，以及EMAIL_SENT角色／类型；未知形式不能默认为非邀请。新版只认已核七封行动邀请，subject按角色动作后缀而非整标题逐字相等，不据此排除一切其他形式重复。**[研究：判据返工，离线补验]**

这次更新测试24.6秒／整段29.4秒，1测试通过；没有新seed、新凭据或发信。恢复没有逐命令独立退出码，“恢复成功”来自set-e整段0与后续状态的推断；当前独立DB身份、运行前脚本hash及公开副本字节对应补强可追溯性，不构成不可篡改历史证明。原新审计谓词仍未成立，模型收益、并发／恢复、UI和互联网送达仍未验证。**[本仓运行／研究]**

#### 可Git接手的最小运行件

[应用补丁](../../scripts/research/p25_runtime.patch)只向固定上游添加原执行spec/config及测试SMTP sink；[脱敏结果清单](../../scripts/research/p25_runtime_result.json)保版本、hash、失败尝试与实际边界。原PDF未在仓库分发，凭清单中的SHA256指认已独审字节，不提供虚构下载地址。[本仓运行]

**包装未重新运行应用。** 相对实际执行版仅将输出根改为`P25_ARTIFACT_DIR`、pg_dump改从PATH寻找、sink依赖改从该根的node_modules加载。以下命令是复现入口；应用补丁的应用检查、TS语法和仓库离线验证另记，不追认新runtime通过。[研究]

先在独立工作目录检出上述SHA，设`APP`为该公开副本、`RUN`为新的空私有输出目录；目标已存在则停止，不覆盖。使用清洁任务HOME及`env -i`启动shell，只传APP/RUN/PATCH/PATH，禁止继承真实数据库、SMTP或秘密变量；不读取既有`.env`/`.env.local`或用户home。

仅从固定上游公开`.env.example`制作`$RUN/test.env`，应用和测试共用：Postgres `127.0.0.1:55425`、主库`p25`及合成角色`p25`，`NEXT_PRIVATE_DATABASE_URL`/`NEXT_PRIVATE_DIRECT_DATABASE_URL`均为`postgresql://p25@127.0.0.1:55425/p25`，`NEXT_PUBLIC_WEBAPP_URL`/`NEXT_PRIVATE_INTERNAL_WEBAPP_URL`均`http://127.0.0.1:3250`；`PORT=3250`、`NODE_ENV=development`、`NEXT_PUBLIC_UPLOAD_TRANSPORT=database`、`NEXT_PRIVATE_JOBS_PROVIDER=local`、`DOCUMENSO_DISABLE_TELEMETRY=true`。SMTP指向`127.0.0.1:25250`、无用户名、secure=false、ignoreTLS=true，仅本sink；配置公开的`apps/remix/example/cert.p12`，不新生成或使用真实证书。

Postgres工具进PATH；必须在RUN下新建私有PGDATA（0700）并initdb，已有目录或55425端口被占即停止，不复用既有集群。仅启动此新集群，监听127.0.0.1且禁用Unix socket；在其中显式新建合成角色p25与空库p25，任一目标已存在或创建失败即停止，随后启用pgcrypto/pg_trgm。

认证/加密采用上游公开测试占位，绝不接生产秘密。[研究：隔离前提]

```sh
# 先在清洁任务shell中加载刚从公开样例生成的专用配置，不使用既有环境
# shell入口：env -i HOME="$RUN/home" PATH="$PATH" APP="$APP" RUN="$RUN" PATCH="$PATCH" bash --noprofile --norc
set -eu
set -a; . "$RUN/test.env"; set +a
# 在公开副本根应用补丁；PATCH是本仓p25_runtime.patch的路径
cd "$APP"
git apply --check "$PATCH"
git apply "$PATCH"
npm ci --ignore-scripts
PATH="$APP/node_modules/.bin:$PATH" npm run prisma:generate
# 安装上游已声明的skia预编译件；须获准下载官方依赖
(cd node_modules/@documenso/skia-canvas && node lib/prebuild.mjs download)
npm run translate:compile
npm run prisma:migrate-deploy
npm install --prefix "$RUN" --ignore-scripts --no-audit --no-fund smtp-server@3.17.0
export P25_ARTIFACT_DIR="$RUN"
mkdir -p "$RUN/mail-capture" "$RUN/reverse-mail-capture" "$RUN/public-supplement"
# 在同一可连通的执行环境并行保持sink、app；端口只绑定loopback
(cd "$RUN" && node "$APP/packages/app-tests/p25-smtp.cjs") &
(cd "$APP/apps/remix" && ../../node_modules/.bin/react-router dev --host 127.0.0.1) &
# 此处先等待本次app的loopback HTTP响应及本次sink的SMTP 220 greeting，最长120秒。
# 两者均就绪才手动继续下面命令；超时/进程退出立即停止，不执行测试或重新seed。
(cd "$APP/packages/app-tests" && NODE_OPTIONS='--import tsx' ../../node_modules/.bin/playwright test -c p25-runtime.config.ts)
# 主轨成功后，在仍指向p25的同一app上运行后续下载核验
(cd "$APP/packages/app-tests" && NODE_OPTIONS='--import tsx' ../../node_modules/.bin/playwright test -c p25-download-followup.config.ts)
```

主轨自动生成私有context、envelope映射和S1.dump，后两测试不依赖执行者留下的私有文件。若主轨失败先读回已有状态，禁止直接重跑seed。反序先停主轨app/sink，保留主库；只允许`createdb -h 127.0.0.1 -p 55425 -U p25 p25_reverse && pg_restore --exit-on-error --no-owner --dbname=postgresql://p25@127.0.0.1:55425/p25_reverse "$RUN/S1.dump"`，新库创建失败立即停止，绝不向已有库restore或drop覆盖。仅将app/test两个数据库URL都切到新库，换`p25-smtp-reverse.cjs`及`p25-reverse.config.ts`，其余启动方式与120秒就绪门槛不变；使用同一RUN但独立空反序收件箱。结束停止自己的服务。DB、dump、context、邮件和raw app日志可能含测试凭据，全部留在隔离输出目录，不能提交。[研究：复现顺序]

补证运行件：同一补丁另含`p25-stateverify.spec.ts`与单worker配置。先停止主轨app，保主库；仅从原`S1.dump`恢复到一个**不存在的新测试DB**，创建失败即停，绝不向已有库restore。app/test的数据库URL均明确指向该新库，P25_ARTIFACT_DIR仍指向原主轨产物；正常启动并通过同一就绪门后，执行`(cd "$APP/packages/app-tests" && NODE_OPTIONS='--import tsx' ../../node_modules/.bin/playwright test -c p25-stateverify.config.ts)`。它复用原身份，不调用seed或生成凭据；路径参数化包装未再次运行应用，不能宣称此包装字节已实测。**[研究：复现顺序]**

[邮件校验器](../../scripts/research/p25_mail_check.py)与[状态矩阵](../../scripts/research/p25_state_matrix.py)可用`--synthetic-only`直接跑37个合成正反例，无私有输入；仓库4项回归另验两个CLI缺输入失败。邮件只适用本次固定七人角色／模板，不是通用邮件分类器。矩阵真实输入CLI锁原六表／477格和原矩阵hash，只能重验本次历史输入；新副本的随机ID／token不同，应由新运行生成独立证据，不能换掉旧参考hash后冒称重现。它按严格JSON序列化表示比较，修正Python `True == 1`的假相等；不是通用JSON语义等价检查。**[本仓离线；研究：复用边界]**

#### 先保角色和阶段，再谈分组

**角色不等于阶段。** 维护者在[#2973][p25-intent]保留`Signer₁ → Assistant → Signer₂`；旧界面提醒有他人字段未填后仍可继续。SIGNATURE代签与完成条件见下表。[一手：维护者意图、源码]

**代填只取严格后续。** 同数值order（含0）可成组，Assistant不得代填peer；数字Assistant可填后续数字／null，null Assistant仅可填更大ID的null人。同null按ID逐人处理；AES/QES历史重复order按ID顺签，新显式重复拒绝。[一手：`recipient-queries.ts`、`recipient-groups.ts`]

**读、写、撤填分别核权限。** V2 `sign-envelope-field.ts`拒readOnly并查actor／target过期；legacy `sign-field-with-token.ts`对readOnly非自动类型验默认值一致，NAME/INITIALS/EMAIL/DATE豁免。legacy remove无独立readOnly／SIGNATURE拒绝；legacy两路只查actor过期。[一手]

**FREE_SIGNATURE另核入口。** 官方字段契约（`apps/docs/content/docs/developers/api/fields.mdx`）不建议新集成使用；V2写schema（`packages/trpc/server/envelope-router/sign-envelope-field.types.ts`）排除它，legacy service（`packages/lib/server-only/field/sign-field-with-token.ts`）仍有签名对象分支，读过滤也仅排SIGNATURE。以上均为静态差异，端到端可达性未验，不称当前漏洞。[一手：固定源码／文档]

本节Documenso路径均相对[573c928][p25-r2]；旧树无V2 envelope入口。当前写order须整数≥0，响应schema仍容忍旧数据。[一手]

| 入口／固定源路径 | 旧规则→最终继承；非法输入预期 |
|---|---|
| `packages/api/v1/schema.ts`；最终 `envelope-recipients/create-envelope-recipients.types.ts` | 旧role枚举／order nullish无Assistant阶段refinement；create/update及meta切PARALLEL分别核，旧[#3291][p25-api]非当前复现 |
| `packages/lib/utils/recipient-queries.ts` → `get-fields-for-token.ts`、`get-recipients-for-assistant.ts` | 旧gte→本人＋严格后续；跨envelope、目标SIGNED拒代理。peer／null／expired／readOnly边界见上 |
| `sign-field-with-token.ts`／`remove-signed-field-with-token.ts`／`sign-envelope-field.ts` | V1/V2 sign拒代他人写SIGNATURE；remove及FREE_SIGNATURE限制见上。读清单不等于可写／完成 |
| `create-document-from-template.ts`／`create-document-from-direct-template.ts`；签署页／RecipientProvider | 模板创建新实例可换ID并映射fields；活动文档不可重seed。token持有人与target分开，返回他人对象时token隐藏 |
| `send-document.ts` → `complete-document-with-token.ts` | 首发取活动步骤全体；完成先验本人的必填字段，只完成本人；全体SIGNED或CC才触发seal。Assistant不必填完所有他人字段 |

服务文件相对`packages/lib/server-only/`对应目录。[一手]

#### 一份旧状态，只走一次S1→S2

以下保留原分组固定树设计；本轮只执行上表子集，非跨版本升级脚本。E1取SES／SEQUENTIAL／PENDING、completedAt空；R101–107／T101–107映射原recipient ID／token，不公开真实token。默认NOT_SIGNED／NOT_SENT、signedAt／sentAt空；例外：101为SIGNED、signedAt=Q1、SENT、sentAt=N1；102当前活动且SENT、sentAt=N2，Q1≤N2（以调用先后为准，毫秒可同值）。假设身份有效未过期、无额外认证阻塞。[研究：设计参数]

字段均required=true、readOnly=false、无预设default；下表为全集，102／105／106无字段。SIG201是Signature行别名，不是Field列；关联用Signature.fieldId／recipientId。[研究：输入]

| 字段→owner／类型 | S1的inserted／值／signatureId |
|---|---|
| F201→101／SIGNATURE | true／customText为空，typedSignature见下／关联SIG201 |
| F203→103／TEXT | true／approved budget draft／空 |
| F204→104／SIGNATURE | false／空／空 |
| F205→104／TEXT | true／customer alias／空 |
| F207→107／SIGNATURE | false／空／空 |

既有完成／代填审计集合为101完成事件A201、102代填F203／F205的A301／A302；既有签署请求任务集合J401只有101／102，无seal任务。原预期“部分更新只增106更新审计”已被本轮否定：order-only不增审计，也不增邀请；后续每人完成仅增本人完成审计，签署请求按103→104→{105,106}→107各新增一次，最后才新增seal任务。其他通知种类另列账，不混入该集合。[研究：消费者预期]

**公开输入准备包（本轮主轨已采用，其余验收仍按下述范围）**。默认复用上游API fixture生成一次S1，再快照分支；不手写SIGNED／审计冒充履历。以下路径均固定在[573c928][p25-r2]。[研究：执行设计]

1. **PDF已定位。** `assets/example.pdf`，39,842 bytes，SHA-256=`658baa2b54b318d0617fbba42a1ba7185b45e3b066538466a40f5502f6019f52`；原准备时用pdfinfo静态读取：1页、PDF 1.4、未加密、无表单／JavaScript。`packages/app-tests/e2e/fixtures/api-seeds.ts`实际默认读取此件。根LICENSE为AGPLv3，assets下未发现单独LICENSE；仅引用fixture，不把许可推为合同效力或签署授权。上传前核hash，上传后另记规范化PDF的hash，二者不要求相等。[一手：文件、许可、静态元数据]
2. **环境／身份先齐。** 上游`package.json`要求Node≥24、npm≥11.17；`.env.example`、`docker/development/compose.yml`给Postgres 15、SMTP测试收件箱Inbucket及上传／jobs配置。选`NEXT_PUBLIC_UPLOAD_TRANSPORT=database`、`NEXT_PRIVATE_JOBS_PROVIDER=local`；应用与fixture共用数据库、webapp URL及认证／加密配置；安装、迁移、启动及fixture创建测试API token等准备须由后续启用范围明确覆盖；本文不授权凭据操作。用`apiCreateTestContext()`仅一次，复用返回的user/team/token；其`seedUser()`建已验证owner、组织／成员关系与team，`createApiToken()`建team Bearer凭证。凭证只留执行环境，不能写公开回执；不能把test fixture默认邮箱当真实收件人，通知只进测试SMTP。核组织额度、邮件开关和`globalAccessAuth/globalActionAuth`、各人`accessAuth/actionAuth`为空；meta设`envelopeExpirationPeriod:{disabled:true}`、`reminderSettings:{sendAfter:{disabled:true},repeatEvery:{disabled:true}}`，恢复分支另配。本轨直接DOCUMENT；模板分支仅S1前生成一次并保映射。[一手：api-seeds、seed/users；研究：配置选择]
3. **一次建草稿并分发。** `apiSeedPendingDocument(request,{context,meta:{signingOrder:'SEQUENTIAL',typedSignatureEnabled:true,envelopeExpirationPeriod:{disabled:true},reminderSettings:{sendAfter:{disabled:true},repeatEvery:{disabled:true}}},recipients,fieldsPerRecipient})`，recipients按下文七人／角色／order，使用七个不同的测试身份。必须显式传七槽fieldsPerRecipient：`[[F201],[],[F203],[F204,F205],[],[],[F207]]`，否则helper会给APPROVER也自动加SIGNATURE。每字段page=1、positionX=10、width=25、height=5，五个positionY依次10/25/40/55/70；fieldMeta分别`{type:'signature'或'text',required:true,readOnly:false}`，不填text默认值。helper依次调用`envelope/create`（multipart payload+PDF）→`recipient/create-many`→`field/create-many`→`envelope/distribute`，再GET。create路由规范化PDF并建internalVersion=2；SES须读回确认。按唯一测试email、字段owner/type及位置映射真实E/R/F ID和secondaryId，不硬塞101等数据库主键；token从distributeResult取，绑定同一实例。[一手：api-seeds、create-envelope及相关schema；研究：具体参数]
4. **生成SIG201及旧履历。** 复用`assistant-signing-groups.spec.ts`的tRPC封装：POST `/api/trpc/envelope.field.sign`，JSON为`{json:{token:T101,fieldId:F201,fieldValue:{type:'SIGNATURE',value:'P25 Signer 101'}}}`。这是SES typed signature，不是AES/QES证书；`typedSignatureEnabled`必须真。读取Signature：id记SIG201、fieldId=F201、recipientId=R101、typedSignature等于该合成姓名、signatureImageAsBase64=null；Field.inserted=true且customText=''。随后按`signing-group-advancement.spec.ts`调用`completeDocumentWithToken({token:T101,id:{type:'envelopeId',id:E1}})`，不用数字documentId冒充字符串envelopeId。读回101完成、102激活；再以T102对F203、F205各调上述V2入口，fieldValue改为TEXT及表中值，102不完成。由服务产生Q1/N1/N2、完成及PREFILLED审计，勿直接写时间或伪造A201/A301/A302。V1对照可用`field.signFieldWithToken`的value/isBase64=false，但不能把两入口累计到同一基准履历。[一手：上述测试、sign-envelope-field、schema；研究：组合成S1；本轮主轨已执行]
5. **冻结完整S1，而非API导出充作备份。** 停止写入并等待／停止job执行，在无在途副作用时用Postgres逻辑备份（例如获准后`pg_dump --format=custom --file=S1.dump`，连接从获准的目标测试环境注入）保存整库及序列，再用`pg_restore --exit-on-error --no-owner --dbname=目标空库 S1.dump`恢复；本轮实际生成dump并恢复独立反序库；原fixture不提供现成S1 dump。整库dump及认证／加密材料只留目标测试环境，不回传或提交公开仓库；回传仅脱敏字段核对、摘要与检查结果。相同运行配置／加密材料在执行环境另保；database上传要核DocumentData.type确为BYTES或BYTES_64，若为S3_PATH还必须保data/initialData所指对象，单库不完整。local队列须连BackgroundJobTask缓存一起恢复；收件箱消息与已发外部副作用不会随DB回滚，分支另记消息基线并禁外发。[一手：schema、local provider；研究：快照方案]

**S1接收清单与消费者。** 快照至少核Envelope（含internalVersion、signatureLevel、user/team、documentMetaId）、DocumentMeta、EnvelopeItem→DocumentData的当前／初始PDF、七Recipient全列、五Field全列与SIG201、全部DocumentAuditLog、BackgroundJob及BackgroundJobTask；整库保组织权限／额度、ApiToken及关系。API GET只是核对视图，不能恢复这些后台状态。主轨基线邀请job按`jobId='send.signing.requested.email'`、payload.recipientId筛选：101／102各1，其余0；其他job／审计保全但分账。将签名／代填／完成审计按type+actor+field secondaryId／recipientId映射，不假定只有三个审计。各反例从同一S1 dump恢复并核ID/token/字段值/PDF hash后，各自执行对应坏候选；合法主轨只改106，S1→S2不恢复、不重seed。继续签署时另外验签署页显示、最终PDF五字段、审计证书、seal job以及Inbucket逐recipient消息内容／链接；SMTP接收不等互联网送达。封存还需独立测试签名证书：见`SIGNING.md`；原记录误以为CI仅声明路径；实测在固定树找到被CI及docker/testing使用的公开`apps/remix/example/cert.p12`并完成签署。逐角色邮件、并发及其他未覆盖项仍不能据准备包判通过。[一手：schema、上述测试、CI；研究：验收与剩余项]

S1的ID／角色／order：101/Signer/0、102/Assistant/1、103/Approver/2、104/Signer/3、105/Approver/4、106/Approver/5、107/Signer/6。S2只改106的order为4，余者全部保留；107等105／106均完成。[研究：唯一预期]

**字段也会锁步骤。** `canRecipientBeModified` 对非CC的SIGNED或任一inserted字段拒改；编辑器 `getLastLockedStepIndex` 另锁整个前缀。本轨101–104不动；最后锁步为null则顺序冻结。[一手：源码]

**主轨只部分更新106。** `POST /api/v2-beta/envelope/recipient/update-many`，body=`{envelopeId:E1实际ID,data:[{id:R106实际ID,signingOrder:4}]}`。已静态核：认证／team可见→SES PENDING可变→completedAt空→逐人可改→事务更新；S2仅提交order 5→4；原“对应updated audit变化”预期已撤回，本轮没有新增审计或邀请任务。[一手：源码；研究：预期]

**✅ 本轨只提交106的局部更新，不让Agent用whole-set重建名单。** `set-document-recipients.ts` 会把仍可修改的R102置NOT_SENT；代填103／104不锁R102自身。`update-envelope-recipients.ts`也重设提交者的通知／签署状态，所以主轨只提交原NOT_SENT／NOT_SIGNED的106。[一手：静态差异]

**遗漏已锁ID和修改已锁ID不是同一道检查。** 固定树的whole-set只对保留在请求中的人调用`canRecipientBeModified`；遗漏者进入独立删除事务，未调用该保护。会话认证与team可见性仍生效；限定有权编辑E1、SES／PENDING／completedAt空，遗漏101或已填的103／104走此删除路径；schema把关联Field／Signature设为级联删除。正常单删`deleteEnvelopeRecipient`则先拒已签／有inserted字段者。编辑器删除按钮也有锁，但请求schema没有“须保留全部锁定ID”的校验，不能把UI保护当服务端全集保护。[一手：同[固定树][p25-r2]，`packages/lib/server-only/recipient/set-document-recipients.ts:118–140,257–283`、`delete-envelope-recipient.ts:89–94`；`packages/trpc/server/envelope-router/set-envelope-recipients{,.types}.ts`；`packages/prisma/schema.prisma:690–723`。源码推演，未复现数据库删除，不称当前线上漏洞]

**whole-set报错也不等于整次未保存。** upsert事务先提交，删除与删除审计另开事务，移除邮件任务在两者之后。第二段失败不能回滚首段已提交的106改组；邮件任务失败也不能据报错还原已删数据。Agent遇未知响应先读回原ID、字段和审计，人确认残留状态后再处置，不重试全量重建。[一手：同service:144–318；研究：失败分支推演，未注入故障]

补充待执行反例：从同一S1分别遗漏101、103或104的whole-set，验收应要求拒绝且旧recipient／Field／Signature不变；与正常单删对照，不能只测修改保留行。另在106更新提交后令删除段失败，检查已发生的局部变化；这不是新的模型实验，也不计上述坏候选已被成功拦截。[研究：验收设计]

动作：R102/T102完成自身；R103/T103批准并沿用F203；R104填F204后以T104完成。105／106均激活，首人完成时107仍NOT_SENT、签署请求任务0，另一人不重复获邀；末人完成才通知107，正反序都验。107填F207并完成才可seal。独立分支合组103／104须拒且旧状态不变。[研究：待执行]

#### 连续账本的阶段断言（原验收，执行范围见上）

复用上述组推进测试的`expectSigningRequestJobCount`与Prisma读回、Assistant测试的tRPC封装，不新建框架。S1仅建一次；S2局部更新后继续同一实例。新增检查点如下。[研究]

- **更新后**：七recipient的ID/token/role、五Field的ID/secondaryId/owner/位置、旧SIG201及旧审计行保留；除106的order外，原状态和值保持。邀请job累计向量按101–107为`[1,1,0,0,0,0,0]`。
- **继续完成**：102后向量为`[1,1,1,0,0,0,0]`，103后为`[1,1,1,1,0,0,0]`，104填F204并完成后为`[1,1,1,1,1,1,0]`。105/106首人完成不变，末人完成才全1；每次完成类审计仅增本人一条，保F203/F205文字与SIG201。正反序另用恢复分支，不冒充连续两轮。[研究：待执行预期]
- **通知**：job、EMAIL_SENT、测试SMTP分账。审计按recipientId及角色emailType过滤：102为ASSISTING_REQUEST，103/105/106为APPROVE_REQUEST，其余为SIGNING_REQUEST（固定树`packages/lib/constants/recipient-roles.ts:124–129`）。[邀请handler][p25-invite-ledger]在本轨有效测试邮箱的发送分支后重写sentAt，且只查询PENDING文档；S1冻结前及每步完成前先等本步邀请并核收件人、角色、原token链接。验sentAt非空，不要求等于激活瞬间；审计不代替捕获邮件，SMTP不证明互联网送达。[一手；研究：消费顺序]
- **封存后**：107填F207并完成才允许seal；实际封存后验COMPLETED、completedAt及DOCUMENT_COMPLETED审计。[seal handler][p25-seal-ledger]保EnvelopeItem.id，但改指新DocumentData，传入旧initialData；`create-document-data.ts:16–24`保存`initialData || data`。initialData是编码内容或存储定位字符串，不是hash；本轨database配置不变时比较解码后的初始字节hash，签后data另记hash。验五字段内容及已启用的证书/审计页，不要求最终PDF与S1同hash。[一手；研究]

复用[部分签署下载测试][p25-download-ledger]：同item的pending下载在完成后变400/ENVELOPE_COMPLETED，signed下载200且为PDF。该测试只核PDF头、pending页数等，不证明旧文字、签名图像或密码学签名有效。坏候选：要求最终hash不变会错拒合法封存；只验SIGNED、job=1及PDF头会放过漏邀或丢字。本轮执行与后续补证见上；未覆盖的actor、逐角色邮件及异常分支不能计通过。[一手／研究]

[p25-invite-ledger]: https://github.com/documenso/documenso/blob/573c928a0e647efc8c41e3e12909c918c2104430/packages/lib/jobs/definitions/emails/send-signing-email.handler.ts#L43-L278
[p25-seal-ledger]: https://github.com/documenso/documenso/blob/573c928a0e647efc8c41e3e12909c918c2104430/packages/lib/jobs/definitions/internal/seal-document.handler.ts#L292-L510
[p25-download-ledger]: https://github.com/documenso/documenso/blob/573c928a0e647efc8c41e3e12909c918c2104430/packages/app-tests/e2e/api/v2/partial-signed-pdf-download.spec.ts#L119-L200

#### 已读断言，哪些还不能算通过

| 固定树具名测试 | 原文断言与缺口 |
|---|---|
| `assistant-signing-groups`／`assistant-null-order` | peer写／删拒绝且值保留，读排peer与他人SIGNATURE字段；null按ID正反例。各例独立seed，未验S1继承 |
| `envelope-recipient-locked-steps`／`envelope-recipient-id-stability` | 已签组禁拖／拆、打开编辑器order不变；多次autosave保ID/token。锁步fixtures无fields，未直接验代填inserted锁；稳定性未验回执丢失 |
| `grouped-next-recipient-dictation` | 当前peer未完或下一组多人不改身份；最后成员面对后续单人可改，检查updated audit和SENT |
| `signing-group-advancement` | 用后台job表断言首组各1任务、中途不放后组、最后成员才推进；是串行服务调用，非实际邮件投递 |

表中测试均未运行；旧#1588 stepper无ASSISTANT用例，不构成代填闭包证据。[一手：测试原文]

**响应未知先读回；原生组不能把通知恢复交给完成接口重试。** 单人CAS保SIGNED与完成审计，ALREADY_SIGNED不重放后续副作用。组推进先写107的SENT，再用Promise.allSettled建邀请，未传业务去重id；105／106各完成后都再查组状态的交错可各建一任务。local每次新建job且任务缓存含jobId；BullMQ／Inngest仅透传可选id，换队列不补此调用的去重。[一手：[固定树][p25-r2]；`packages/lib/server-only/document/complete-document-with-token.ts:318–546`、`packages/lib/jobs/client/{local,bullmq,inngest}.ts`；研究：可行交错，未复现]

**SENT或job成功均不是已邀／送达证明。** 邀请handler不以SENT挡重；组织限额断言异常被catch后直接return，发生在sendMail、提醒调度和EMAIL_SENT审计之前。local／BullMQ将正常返回记COMPLETED，不能等待失败重试补发。[一手：[邀请handler](https://github.com/documenso/documenso/blob/573c928a0e647efc8c41e3e12909c918c2104430/packages/lib/jobs/definitions/emails/send-signing-email.handler.ts#L188-L257)；provider同上。发送调用成功仍不等外部送达]

| 同一E1分支 | 原生能力与人须确认的选择 |
|---|---|
| 完成提交后响应丢失／推进前中断 | 读原ID与审计，分别查通知／seal；缺项未确认，不reset已签人 |
| autosave成功但回执未知 | 先对账原ID及关联，不在未知新ID下whole-set删建 |
| 107置SENT但未建job，或邀请限额检查return | SENT不能跳过对账；107原nextReminderAt=null时不会被到期提醒扫描选中 |
| 同人重复／并发；105／106并发均推进 | 每人应仅一次完成审计；单人CAS不保107只邀一次；串行组测试不能证明去重，不能接受重复时撤回原生足够的假设 |
| 全部签完而未seal | 已配置并运行的seal sweep可有限补偿；每15分钟选最近动作年龄≥15分钟且<6小时的合资格PENDING文档，最多100项，不保证15分钟完成 |
| 已超seal窗口／仍有中间未签人 | 该sweep不补此缺口；人工处置，不重签或改时间伪造可恢复 |

**不是没有原生恢复入口，而是入口有条件和副作用。** 首次send只邀当前步骤，不预排未来107；邀请handler正常尾部才设nextReminderAt。提醒扫描只挑已到期者，不能兜底上述null；主动改reminderSettings可重算SENT人的提醒，故不外推为永久不可恢复。[一手：同固定树`send-document.ts:151–157,342–359`、`internal/send-signing-reminders-sweep.handler.ts:11–28`及`update-envelope.ts:357–359`；路径分别位于server-only/document、jobs/definitions、server-only/envelope]

人对账后可用envelope/redistribute定向补原未签ID，但按配置续有效期并重启提醒周期，这些变更可先于邮件禁用／限额拒绝，不能当透明重试。Agent应区分任务、邮件与PDF证据，人决定补发对象与容错；若必须自动可靠推进且不能接受漏邀／重复，不以原生分组或换队列代替可靠推进改造。[一手：[补发](https://github.com/documenso/documenso/blob/573c928a0e647efc8c41e3e12909c918c2104430/packages/lib/server-only/document/resend-document.ts#L122-L200)、[封存扫描](https://github.com/documenso/documenso/blob/573c928a0e647efc8c41e3e12909c918c2104430/packages/lib/jobs/definitions/internal/seal-document-sweep.handler.ts#L24-L99)；研究：采用边界]

固定树`packages/app-tests/e2e/api/v2/`下的`redistribute-send-status.spec.ts`与`organisation-rate-limits.spec.ts`验NOT_SENT→SENT和同步限额，不等同异步邀请丢弃链；本轮检索test/spec未找到上述并发／中断／seal时窗闭包，非断言不存在间接覆盖。全部为2026-10-20静态核查，未运行应用、邮件或模型。[一手／研究]

#### 现成替代与本次实际改变

**👀 新流程可评估DocuSeal，活动文档不作等价迁移。** [API][p25-docuseal-api]有同order分组、preserved顺序通知、random同时通知；固定树 `8f8f69f` 的完成job等当前组非viewer完成再通知后组。[一手]

顺序强制另受[授权入口](https://github.com/docusealco/docuseal/blob/8f8f69f0bc6ac2e59746cd6efac54a852289bec3/lib/submitters/authorized_for_form.rb)的with_order及模板／账号配置约束。其缺省order按数组位置，values／completed不等Assistant授权；迁移须接管ID、字段、链接、审计及产物。[一手：固定源码；研究：取舍]

两项目核心AGPLv3；Documenso EE另有商业许可，DocuSeal[附加条款][p25-license]要求UI署名；实际复用另核路径与部署义务。[一手]

可退回角色前置、吞0、null并组、清inserted和重seed坏候选。已跑连续继承主轨与恢复反序，完整跨入口闭包仍未通过；同模型／输入的“先契约再改”对照未运行，不计优化收益或完整实验完成。实际权限、并发或恢复决定取舍时仍待验证。[研究：范围]

[p25-r1]: https://github.com/documenso/documenso/tree/332e0657e00b49cb8a32ac43c397c2e4b66f5035
[p25-r2]: https://github.com/documenso/documenso/tree/573c928a0e647efc8c41e3e12909c918c2104430
[p25-intent]: https://github.com/documenso/documenso/issues/2973
[p25-api]: https://github.com/documenso/documenso/issues/3291
[p25-docuseal-api]: https://www.docuseal.com/docs/api#create-a-submission
[p25-license]: https://github.com/docusealco/docuseal/blob/8f8f69f0bc6ac2e59746cd6efac54a852289bec3/LICENSE_ADDITIONAL_TERMS
