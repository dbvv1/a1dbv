主线：三，兼四
改变的建议：数据迁移先保受支持工具与写入权威；换托管先保应用消费者，再判断是否要换框架实现。[研究]
新证据：2026-10-20保P22原纸面包，P23固定shop源码与两轮合成输入，核Shopify无文章回调、有限寿命路线与Vinext实际包；均未运行应用或模型。

# 开发条件：数据与框架迁移

[维护总览](2026-10-12-development-maintenance.md)；本页保留两轮继承包、工具／运行边界和退回条件。

### P22：有数据应用的两轮迁移

**✅ 保既有受支持迁移器；小应用能全体停写且迁移／验收落在批准窗口内，先短停写，否则桥接。** 工具轴与停写轴分开。Agent交映射／路径／判据，人定语义与权限。以下新增状态、数据与版本代号是两轮继承纸面设计，非生产验证。[研究；2026-10-20核]

#### 固定源码、读写闭包与执行门

基线是[官方Express应用](https://github.com/prisma/prisma-examples/tree/51b3202cae5418b54314a2bb53f70b27c6558573/orm/express)：Prisma CLI/client/PG adapter声明7.0.0，只作旧源码样本。根`.gitignore`忽略lockfiles及orm迁移目录，固定树无该应用lock／migration.sql；config目录名不证明历史。未安装，无真实库／账本。[一手：固定树]

`src/index.ts`闭包与新责任：[一手／研究]

| 旧路径 | 继承责任 |
|---|---|
| POST /signup、POST /post | 嵌套／关联建帖都显式Draft |
| PUT /publish/:id | 非原子／非幂等toggle改明确转移，禁绕审核／定时 |
| PUT /post/:id/views、DELETE /post/:id | 保计数／删除，禁覆盖／复活；整行改DTO |
| GET /feed | 保公开集合、作者、搜索、分页／updatedAt排序 |
| GET /user/:id/drafts | 全部非公开项，区分InReview／Scheduled |
| GET /post/:id、GET /users | 详情无过滤，仅按内部编辑API设计；users不含posts，保留 |
| seed、管理／导入脚本、旧客户端 | seed清Posts／Users禁迁移；Studio／Console等旁路待核 |

[现成测试](https://github.com/prisma/prisma-examples/blob/51b3202cae5418b54314a2bb53f70b27c6558573/tests/fixtures.ts)只建空库、安装、generate／db push／seed，无express构建、路由、存量／恢复断言；CI非冻结安装。根[LICENSE](https://github.com/prisma/prisma-examples/blob/51b3202cae5418b54314a2bb53f70b27c6558573/LICENSE)Apache-2.0与package MIT声明有差异；不复制代码。[一手]

**基线门**：核实际schema、账本、发行物、PG版本与写者；有历史先恢复核对，确认无管理历史才按[官方baseline](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/baselining)准备相符历史，在另获准副本验空库／存量差异；旧库仅核对后记账，不重建。纸面假定单PG主库、无未知旁路且能阻断旧进程／连接／job重启，均待部署方核实。[一手／研究]

#### 第一轮：布尔发布→审核状态

合成T0＝2026-10-20 09:00Z，User10/20存在；时间同日：[研究：输入]

| id | title/content | authorId | published | viewCount | createdAt/updatedAt |
|---|---|---|---|---|---|
| 101 | A/正文A | 10 | true | 9 | 08:00/08:30 |
| 102 | B/null | 10 | false | 0 | 08:05/08:35 |
| 103 | C/正文C | null | false | 4 | 08:10/08:40 |
| 104 | D/正文D | 20 | true | 2 | 08:15/08:45 |

人定true→Published、false→Draft；旧公开保祖父条款，不伪造审核。A1允许Draft→InReview→Published、InReview→Draft、Published→Draft，非法／不存在返回conflict／not-found不写。账本主体＋requestId唯一，同输入重放结果、异输入拒绝；CAS与成功结果同事务提交。**鉴权／账本／version均待实现。**[研究]

短停写：停全体写者并排空；已审可事务化DDL与显式事务内增字段／映射／验收，失败撤销。Prisma7不自动合并独立TS回填与schema事务；核新版后恢复写入，收缩可延后。超窗口则撤回。[研究]

需要并存时，按以下权威顺序交接，不能省略C1a：[研究：部署设计]

1. 保published，加可空status（null＝未接管）及stateVersion=0。旧版W0与C1并存时，C1按published读，创建／发布原子双写Draft/Published并增version，计数不增；status仅影子，审核关。
2. W0退出／请求排空／旁路隔离后，回填全部不一致影子，非仅null。按观察id＋published＋version条件写status，并发改变则重读。批提交后才前移checkpoint；一致行不改，删除不重建。只写status，禁ORM自动updatedAt及旧时间覆盖并发更新。
3. 无null／矛盾且逐字段验收通过，部署C1a：status权威，按A1转移、同事务增version；published仅Published投影。查询／DTO切换，但审核仍关，仅Draft/Published。
4. **真正开放门**：排空全部C1进程、请求、连接以及步骤2回填；撤销调度并禁止旧版本／job重新获得写入资格。短暂停写核清单与一致性，切写入准入代际，仅放C1a/A1。回填的阶段／代际检查与更新必须在同一受保护事务；已进入者须结束或撤销后才开审核。不能只在job启动时看开关，CAS也挡不住C1取得新version后把false解释成Draft。
5. 门通过才开InReview，旧回填永久退出；旧读／整行响应／投影依赖全退出且回退包理解状态后才删published。

**判据**（分支各从指定起点）：[研究：纸面断言]

- S1无并发映射后feed={101,104}、user10非公开={102}；101/104 Published、102/103 Draft。非状态字段逐值不变，null仍null；总数不代替内容／排序验收。
- S2独立于S1：signup新增105须Draft/false。S3：C1写102 Draft/false后W0只写true，W0退出后的协调须得Published/true。S4：回填读103=false,v0后C1写Published/true,v1，旧条件必须失败并重读，不得回写Draft。
- S5从S1：102提审→InReview/false；同requestId重放同结果，旧version异请求conflict。S6接S5：审核发布102、撤回104、101计数+1、删103；终点feed={101,102}、存活={101,102,104}、101.viewCount=10。102/104更新时间随业务变化；**第二轮继承此终点，不还原T0**。
- S7坏候选：全表默认Draft丢公开集合、按false重跑把InReview降草稿、自动updatedAt洗牌、重放toggle反向切换，任一阻止切读／收缩。S8中断：只有数据库确认rollback才称仍T0；结果不明先对账，批模式保已提交批、不前移失败批。
- S9权威负例：C1残留时开放审核必须被门拒绝；完成交接后102进入InReview，旧C1连接／重启须在写前被拒，不能复原Draft或绕审核发布。一次CAS碰巧失败不证明门成立。
- S10迟到回填：102已InReview，旧代际job按false写Draft须拒且状态不变；若job已在受保护事务内，开放门等待其结束／撤销，不能同时开放审核。

#### 第二轮：继承S6，增加定时发布

T1＝同日10:00Z；S6上另创建106/107并提审InReview。A2加Scheduled／可空UTC publishAt，继承账本／version。人定审核可立即／定时发布；设置时间≤数据库now拒绝；取消→Draft且审核失效，重排须重审。许晚不许早，延迟上限／权限待人定。仅Scheduled时间非空；feed仅Published，不凭到期直接公开，不伪造历史发布时间。[研究]

先扩字段／枚举，保旧值；PG原生enum新增值须提交后才能使用（[PG18限制](https://www.postgresql.org/docs/18/sql-altertype.html#SQL-ALTERTYPE-NOTES)，实际版本待核）。C2先理解Scheduled、取消／重调及全部消费者，功能关；A1及旧回填全退出后才启A2和worker。审批原子写InReview→Scheduled、未来时间、version+1；worker仅凭id＋Scheduled＋观察version＋publishAt＋数据库now≥publishAt条件发布、清时间、增version。重复者匹配0重读；投影若尚在须同事务维护。候选扫描不是发布权，worker不能自作审核。[一手／研究]

| 判据 | 唯一结果／分叉 |
|---|---|
| Q1 | 批准106于11:00、107于12:00；feed仍{101,102}。104草稿直接定时conflict |
| Q2接Q1 | 10:59:59.999不得发106；11:00及以后首worker提交，重复匹配0；feed={101,102,106} |
| Q3接Q2 | 11:30取消107成功→Draft、时间null、version增；12:00旧worker匹配0。主轨终点101/102/106公开，104/107草稿，103已删，101.viewCount=10 |
| Q4分叉 | 从Q3的11:30取消提交后、12:00观测前分叉；11:40重提审并定13:00；旧12:00 job须匹配0，13:00新任务才可发；只验id＋Scheduled会提前发 |
| Q5从Q2分叉 | 106提交后丢响应，重试不二次转移；如新增通知须另补事务outbox及消费者幂等，本包无外部exactly-once承诺 |
| Q6从Q1分叉 | 调度故障至11:05才恢复，106在提交前仍Scheduled；按到期状态扫描补发，不能只靠内存timer；5分钟是否可接受由人定 |
| Q7从Q1独立分叉 | **不执行Q3**；12:00及以后107到期，worker先提交后旧version取消只能conflict，保持Published，须明确撤回；不保证取消胜，不许早发 |

分叉不叠加；保非状态数据，计数／删除差异按事件解释。只清无消费者兼容层，核未来计划／失败job／回退包，不凑收缩。[研究]

**文件与退出**：schema加状态／版本／时间，migration.sql接真实历史，index.ts覆盖闭包／DTO／转移；回填、账本、worker及断言待实现，seed禁升级，lock／Client另获准构建。审核前投影一致可排空退兼容读但保新数据；InReview后false逆映射不唯一，Scheduled后A1未必可读。停问题写入、保状态前进修复；停worker不撤计划，备份恢复须另批期间新写／删除／已公开行为处理。[研究]

#### 当前工具契约：不混入另一套执行权限

[Prisma支持页](https://www.prisma.io/docs/orm/release-status)仍列8RC，7维护18个月**从8正式GA起算**；另核受支持7.x与lock。[v7教程](https://www.prisma.io/docs/guides/v7/database/data-migration)为SQL＋独立TS回填、false→Unknown；[通用8教程](https://www.prisma.io/docs/guides/database/data-migration)改contract/dataTransform，其事务承诺不适用7，Agent提示不授执行权。[一手／研究]

create-only接触开发／shadow库；deploy应用，resolve仅记账。10月19日[7.10.1发行](https://github.com/prisma/orm/releases/tag/7.10.1)含[shadow防护](https://github.com/prisma/prisma-engines/commit/4c4662e4219f3ab90712e0ba4d243b7e0f4665df)仅限定diff路径URL比较，非别名／代理物理同库证明；[测试](https://github.com/prisma/prisma-engines/commit/7a245d5c51c7256c8d95491a5be5776cb094429f)只验拒绝与precious_data表存在，非业务完整；diff非无副作用，主／shadow身份与恢复须另核。[一手／研究；未运行]

Supabase非默认替代：[CLI v2.121.0](https://github.com/supabase/cli/releases/tag/v2.121.0)固定pg-delta alpha.59；[引擎](https://supabase.com/docs/guides/local-development/diff-engines)区分live/shadow diff与schemas/history sync。[声明式入口](https://supabase.com/docs/guides/local-development/declarative-database-schemas)generate不建baseline、diff不捕DML，no-apply生成／apply应用；[固定AI提示](https://github.com/supabase/supabase/blob/1ddb9ac787cbdf8bdeb41fffe6b300951289c34e/examples/prompts/declarative-database-schema.md)默认即应用，须收窄权限。[branching](https://supabase.com/docs/guides/local-development/overview)逐迁移包事务、不尊重transaction=false，db push成功不证明分段可部署。[一手]

#### 真实维护链：先封新写入，再重排与收尾

GitLab两链独立，非AI成果。!120213 setter补到期日、!120239回填NULL后仍有[表单旁路](https://gitlab.com/gitlab-org/gitlab/-/issues/413289)。[固定修订](https://gitlab.com/gitlab-org/gitlab/-/tree/91b7733a5b939580e680bc71af525e3c6c55b733)（!121370）改创建服务默认／模型校验，数据库validate:false约束先阻新违规，历史验证另做。[!123002重排](https://gitlab.com/gitlab-org/gitlab/-/blob/d822f89e26e6282563c0a66054ca86a78225627b/db/post_migrate/20230608071301_requeue_cleanup_personal_access_tokens_with_nil_expires_at.rb)先删旧job再排，旧排队up/down变no-op；down不恢复NULL。排队spec仅验参数，首次三行job测试不含中断／并发；作者历史生产NULL归零回执非本轮验证。[一手／研究]

半年后[!139178 finalize](https://gitlab.com/gitlab-org/gitlab/-/blob/637cee025f4acad008d72c9fbdf553e9e4e0e5d0/db/post_migrate/20231207221119_finalize_cleanup_personal_access_tokens_with_nil_expires_at.rb)按job/table/column/args收尾并保required stop。**完成≠finalize≠可收缩**；未核最终validate／全部自托管执行。[一手／研究]

!89865→[!93546修复](https://gitlab.com/gitlab-org/gitlab/-/blob/7fd599fdc3446970c2dd92e8f93d502bd3a4704a/ee/lib/ee/gitlab/background_migration/backfill_project_statistics_container_repository_size.rb)撤仅size=0过滤：零值取API，旧非零保留但仍清根cache、按root_ancestor排聚合。主表已非零仍验派生消费者，非一律重算。spec仅mock调用数、不验根聚合结果，部分负断言在perform后，不当可靠历史调用断言。已核16.1重排树`4961ad113f`、15.3派生修复树`b189ba0705`包含对应文件，非最早修复版。反例：[小表路径](https://docs.gitlab.com/development/database/not_null_constraints/)无需后台迁移，不照搬队列。[一手／研究]

**证据终点**：短停写少跨版本责任，桥接多部署／协调／排空／接管；升8RC或换平台增加API／历史／CI维护，缺必要收益故不选。计算、等待、人审、修补、接管、维护无时长／净收益估值。已交源码／历史链／连续纸面包；依赖解析、真实baseline、SQL／锁／并发／恢复、部署及Agent效果未测。[研究]

### P23：Next应用迁出后仍值得保留吗

**✅ 博客刷新／长文先保原Next及部署；明确迁出Vercel且选Node，才自托管Next。** Workers硬约束先评估OpenNext；⛔ Vinext1.2.1非本应用无损默认。Agent保两轮内容／消费者，人定平台、旧内容窗口及补丁责任。[研究；2026-10-20核]

**以下是可重建纸面包，未安装／运行应用或模型、连接商店、部署。**[研究]

#### 固定应用与路线选择

固定MIT应用[vercel/shop@f4c2d467](https://github.com/vercel/shop/tree/f4c2d467e02abd2c859aedf4b709ec93552e7049)。版本：Next16.4.0、React19.3.0、pnpm12.8.2、Node24。`next.config.ts`开启cacheComponents、partialPrefetching、React Compiler及Tailwind Turbopack loader。[一手]

**16.4.0只作历史基线，不推荐原样上线。** [10月14日安全公告](https://nextjs.org/blog/nextjs-security-update-october-14-2026)列16.4.1为该轮修复版，先单列共同安全升级／lock再比迁移，未升级不计收益。MIT不授权店铺内容。[一手／研究]

| 选择 | 采用成本与未过门 | 退回责任 |
|---|---|---|
| 明确选Node才自托管Next | 保next build/start；承接代理流式、后台排空、共享缓存／tag协调。须选`cacheHandlers.remote`，单数ISR `cacheHandler`不能替代 | 保原配置／产物、缓存隔离与切流方案；未验双部署 |
| 👀 Workers硬约束先OpenNext1.20.12 | 保Next构建，加adapter／Wrangler及缓存绑定；预览用workerd。支持Next16.4，已注册default／remote到composable handler；本应用partialPrefetch／持久化／tag传播未验 | 撤平台绑定、重建Next产物；缓存格式与外部源不能视为可直接搬回 |
| 🧪 有明确Vite需求才试Vinext1.2.1 | Vite重实现RSC/SSR/client。React peer ^19.3.1，原19.3.0不满足；optional peers按功能定。Turbopack CSS／Compiler需替代，Cache Components/PPR有缺口 | 恢复Next配置／lock／构建，撤专有shim；保R1业务补丁和S2内容，隔离旧缓存 |

来源：[Next自托管](https://nextjs.org/docs/app/guides/self-hosting)、[cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)（未配default/remote为内存LRU）；[OpenNext1.20.12发行](https://github.com/opennextjs/opennextjs-cloudflare/releases/tag/%40opennextjs%2Fcloudflare%401.20.12)、[固定handler注册](https://github.com/opennextjs/opennextjs-cloudflare/blob/%40opennextjs%2Fcloudflare%401.20.12/packages/cloudflare/src/cli/build/patches/plugins/next-server.ts)；[Vinext固定README](https://github.com/cloudflare/vinext/blob/359b4fba55fa3d9f745d4ddf26692591384b2518/README.md)及[1.2.1 package](https://github.com/cloudflare/vinext/blob/6554076e6e864926324069e0910fcfc33b28ee07/packages/vinext/package.json)。无本应用费用／工时／性能比较。[一手／研究]


#### 消费者闭包与两轮文件差异

以下路径相对固定shop树；R1可应用替换与响应接线见下节，运行仍未执行。[一手：源码；研究：改动设计]

- R1只改blog／seo的四个remote缓存作用域，精确替换见下节；调用路由无use cache。
- `app/api/webhooks/shopify/route.ts`的产品／集合／metaobjects分支与HMAC保持不动，不能补虚构文章事件。
- `app/blogs/[blogHandle]/[articleHandle]/page.tsx`的metadata和正文读同详情，缺记录notFound；构建可退placeholder，不能据此算验过文章。`components/blog/article-page.tsx`／`components/ui/prose.tsx`为服务端正文，R2默认无必改业务代码，只更新同篇内容并加验收。
- `lib/shopify/operations/blogs/server.ts`默认50条、PUBLISHED_AT倒序；`lib/shopify/fragments/blogs/index.ts`仅摘要／240字fallback，不传全文。`lib/shopify/operations/sitemap/server.ts`ARTICLE按UPDATED_AT、250项游标扫描，但取publishedAt映射updatedAt再输出lastmod。**编辑A不改变lastmod。** 页数来自独立sitemap.pagesCount，不能拿本地除法替代。

保购物车／搜索／proxy.ts及关闭的可选模块；无现成测试，下面的接线规格仍待实现。[一手／研究]

#### 可由Git重建的输入与精确预期

全为合成输入，非Shopify快照。域为`https://shop.example.test`，locale=en-US、country=US、language=EN，日期断言固定UTC。所有记录同blogHandle=`guides`、blogTitle=`Fixture Guides`、image=null、无author。body对应contentHtml，列表仅摘要shape；sourceRevision/sourceUpdatedAt仅测试账本字段。[研究]

定义记录R(h,t,p,b)：handle=h、title=t、publishedAt=sourceUpdatedAt=p、body=b、excerpt=t+` excerpt`、seo.title=t+` | Fixture Shop`、seo.description=t+` summary`、sourceRevision=1，加上述公共字段。全部字符串UTF-8，无额外换行。[研究]

- F001…F248：h=`archive-001`…`archive-248`，t=`Archive 001`…；p为2026-01-01T00:00:00Z加编号分钟（至04:08:00Z，ISO秒精度）；b=`<p>Archive record 001.</p>`等。
- A1=R(`care-guide`,`Care guide v1`,`2026-01-02T00:00:00Z`,`<h2>Care</h2><p>Wash cold.</p>`)。
- C=R(`retired-guide`,`Retired guide`,`2026-01-03T00:00:00Z`,`<p>Retired instructions.</p>`)。
- A2继承A1，仅title=`Care guide v2`、sourceRevision=2、sourceUpdatedAt=`2026-10-20T10:00:00Z`、body=`<h2>Care</h2><p>Wash cold. Air dry.</p>`、excerpt=`Cold wash and air dry.`、SEO=`Care guide v2 | Fixture Shop`／`Wash cold and air dry.`。
- B=R(`size-guide`,`Size guide`,`2026-10-20T10:01:00Z`,`<h2 id="measure">Size</h2><p>Measure before choosing.</p>`)。
- A3继承A2，仅title=`Care guide v3`、sourceRevision=3、sourceUpdatedAt=`2026-10-20T11:00:00Z`、excerpt=`Long-form care guide; cold wash, air dry.`、SEO=`Care guide v3 | Fixture Shop`／`A detailed care guide. Wash cold and air dry.`；body按下式生成。

```python
body = '<h2 id="care">Care guide v3</h2>'+''.join(f'<p data-section="{i:05}">第{i:05}节：冷水清洗，阴凉晾干。Café naïve — 日本語と絵文字 🧵🧼。Read <a href="/blogs/guides/size-guide#measure">size advice</a>; do not tumble dry.</p>' for i in range(1,8193))+'<h2 id="end">End</h2><p>完整结束。END-08192</p>'
```

原body为1,679,444 UTF-8字节，SHA-256=`1df175722789cacbed2f17d84258a4f00445b9c3b0226a06dea881c27b8d66c0`，含两个h2、8193个p。SSR实体序列化可不同，验规范化DOM节点／属性／文本，不要求整页或SSR字节等于原contentHtml。[研究：静态计算]

| 状态／逻辑源变更 | 权威内容源 | 50项列表顺序 | ARTICLE sitemap页（按sourceUpdatedAt升序）／独立count |
|---|---|---|---|
| S0先暖读 | F001…F248+A1+C，250条 | C,A,F248…F201 | p1=F001…F248,A,C；count=1 |
| R1 e1，10:00 update → S1a | 仅A1→A2 | C,A,F248…F201 | p1=F001…F248,C,A；count=1 |
| e2，10:01 create → S1b | 加B，251条 | B,C,A,F248…F202 | p1=F001…F248,C,A；p2=B；count=2 |
| e3，10:02 delete → S1 | 删C，250条 | B,A,F248…F201 | p1=F001…F248,A,B；count=1 |
| R2 e4，11:00 update → S2 | 从S1仅A2→A3 | B,A,F248…F201 | p1=F001…F248,B,A；count=1 |

每阶段详情／h1／metadata／excerpt取该状态记录，B保measure锚点。S1起C正文不可见，出现not-found UI及noindex。固定详情在Suspense内等待数据后notFound；[官方说明](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)未开流为404、已开流可200，须分别记录基线状态，不把200误判复活；硬需HTTP404是尚未满足的设计。每个sitemap URL=域+`/blogs/guides/`+handle，lastmod=该记录publishedAt；A一直1月2日，B一直10:01，Fn和C也不漂移。p2只在S1b含B，其余阶段items为空；取第二页必须从第一页endCursor续取。BLOG固定mock：guides／Fixture Guides，SEO=`Fixture Guides | Fixture Shop`／`Synthetic guides.`，resource.updatedAt=`2026-01-01T00:00:00Z`，count=1；各阶段分片只含域+`/blogs/guides`及该lastmod（非ARTICLE分支直接取updatedAt）。其余类型count=0、policies空；index仅S1b为static,blogs-1,articles-1,articles-2，其余少articles-2。**count序列1→1→2→1→1是独立mock响应，不证明真实API计数与游标一致。**[研究]

#### R1：没有文章回调，就按真实缓存寿命刷新

**不补articles/blogs回调。** Shopify2026-10[订阅枚举](https://shopify.dev/docs/api/admin-graphql/latest/enums/WebhookSubscriptionTopic)与[完整topic列表](https://shopify.dev/docs/api/webhooks/latest)均无这类事件。A/B/C仅源变更，不是待注册回调；⛔ 不承诺15秒或即时下架。[一手／研究]

✅ 普通博客可容忍延迟时，max换有限cacheLife。测试起点minutes：stale=300、revalidate=60、expire=3600秒，人定最终值；这是请求驱动SWR，不是定时任务或编辑后的SLA。[研究]

[官方cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)规定客户端stale、revalidate后请求触发后台刷新、expire后请求等待新值，expire>revalidate。expire<5分钟或stale<5分钟会影响预渲染／壳资格，不能改seconds或关缓存冒充同质量。[一手]

10:00等是源时间，非测试排程。变更前暖HTML／RSC／metadata／列表／count／分片，记各自生成点；各过revalidate后请求、等后台完成，再读全体终态后续下一阶段。S1b须暖p2。另测无请求跨expire后首请求阻塞取新值；软导航／预取另过客户端stale，不能假定会发请求。[研究：待实现的测试时序]

源故障不得写空正文／空成功列表；恢复后须收敛，再续行。重复读取不增B，不改publishedAt；只缩详情寿命却让列表/count/p2留max判失败。S1终态按上述not-found语义且集合不含C，无固定删除秒数；并发旧再生复写、浏览器已有页与CDN仍须另验。**要求严格下架截止的应用不接受此默认**：需要已有受控发布通知或另行撤回方案；本基线没有，不能偷偷新建来算完成。[研究]

[Next #97457](https://github.com/vercel/next.js/issues/97457)报16.3.0／16.3.1／16.3.1-canary.21用expire:0后丢内容壳；[作者纠正](https://github.com/vercel/next.js/issues/97457#issuecomment-5317277426)确认max误入expire:0，真正max保壳。它只约束未来即时失效试验，不推断16.4仍有／已修，也不混入当前SWR主轨。[社区／研究]

两轮均比未删文章首壳、H1／首正文位置和时间；原有内容壳不得永久退化，原本骨架先到不误报回归。另测即时方案时才核实际max/expire:0，未知mode拒绝；不以最终DOM正确、revalidatePath或保壳为删除可靠性的证明。[研究]

#### R1源码补丁与合成响应接线（2026-10-21公开准备）

**🧪 先交四处可应用替换，不改业务查询。** 以下针对固定SHA的[blog缓存](https://github.com/vercel/shop/blob/f4c2d467e02abd2c859aedf4b709ec93552e7049/lib/blog/server.ts)及[seo缓存](https://github.com/vercel/shop/blob/f4c2d467e02abd2c859aedf4b709ec93552e7049/lib/seo/server.ts)；本轮重新读取原始文件，与前轮副本逐字一致。摘录依据[MIT许可](https://github.com/vercel/shop/blob/f4c2d467e02abd2c859aedf4b709ec93552e7049/LICENSE)，Copyright (c) 2025 Vercel, Inc.。补丁未运行。[一手／研究]

- `lib/blog/server.ts`：仅在getBlog、getBlogArticle中，把各自唯一的`cacheLife("max");`替换成：

```ts
  cacheLife({ stale: 300, revalidate: 60, expire: 3600 });
```

- `lib/seo/server.ts`：仅在getShopifySitemapPagesCount、getShopifySitemapPage中，把各自唯一的`cacheLife("max");`替换成同一段：

```ts
  if (type === "ARTICLE" || type === "BLOG") {
    cacheLife({ stale: 300, revalidate: 60, expire: 3600 });
  } else {
    cacheLife("max");
  }
```

每文件两个旧调用；数量不同先核版本，不全仓替换。每条执行路径只调用一次cacheLife；`use cache: remote`、函数参数（含limit／locale／type／page）、原cacheTag及资源追加标签、fetch调用、返回值全部不变。不加外层缓存或合并count/page key；PRODUCT／COLLECTION／PAGE仍max。新旧部署隔离缓存；不靠清缓存验R1。[研究]

**接线选在`storefront.request`，不伪造getBlog等已转换结果。** [blogs operation](https://github.com/vercel/shop/blob/f4c2d467e02abd2c859aedf4b709ec93552e7049/lib/shopify/operations/blogs/server.ts)与[sitemap operation](https://github.com/vercel/shop/blob/f4c2d467e02abd2c859aedf4b709ec93552e7049/lib/shopify/operations/sitemap/server.ts)保留；测试替身按GraphQL operation名及options.variables分派，成功统一返回`{ data: 下表对象, errors: undefined }`。测试状态唯一持有S0，逐次应用e1…e4，不按URL另建数据副本；sourceRevision/sourceUpdatedAt不写进GraphQL节点。每个operation取一次快照，阶段收敛后再改源；独立请求非原子。[研究：接线规格，未实施运行]

定义G为上述BLOG的`{handle,title,seo}`。对记录r，摘要N(r)只含`{handle,title,publishedAt,excerpt,image:null,authorV2:null,content:r.excerpt}`；本夹具excerpt始终非null，因此content这个明确合成的短文本不会命中fallback，也不验证真实截断。详情D(r)=N(r)加`{contentHtml:r.body,seo:r.seo}`。经过[transformArticle](https://github.com/vercel/shop/blob/f4c2d467e02abd2c859aedf4b709ec93552e7049/lib/shopify/transforms/blogs/index.ts)的body／excerpt／SEO映射，列表不能携带contentHtml或详情seo。[一手／研究]

| operation／请求约束 | data响应与断言 |
|---|---|
| getBlog，handle=guides，first由调用传入（其他handle回blog:null） | `{blog:{...G,articles:{nodes}}}`；nodes按publishedAt降序取first个N(r)。正常列表first=50；generateStaticParams另用first=1，S0取C、S1b起取B |
| getBlogArticle，blogHandle=guides、articleHandle | `{blog:{...G,articleByHandle:D(r)}}`；S1起查C必须为`articleByHandle:null`，不存在的blog回`{blog:null}`，不是200错误对象或空正文 |
| getSitemapPagesCount，type | `{sitemap:{pagesCount:{count}}}`；ARTICLE逐状态为1/1/2/1/1，BLOG=1，其余=0，显式固定而非从items长度计算 |
| getArticleSitemapPage，first=250，after | `{articles:{nodes,pageInfo:{endCursor,hasNextPage}}}`；按sourceUpdatedAt升序，节点仅`{blog:{handle:"guides"},handle,publishedAt}`。after=null取前250；S1b首段endCursor=`p23:250`且hasNextPage=true，续此cursor只返B并置hasNextPage=false；其余阶段首段hasNextPage=false。endCursor用该段最后位置`p23:N`，空段null；拒未知cursor |
| getSitemapPage，type=BLOG、page=1 | `{sitemap:{resources:{items:[{handle:"guides",updatedAt:"2026-01-01T00:00:00Z"}]}}}`；其余页／类型items=[]。ARTICLE不得走此operation |

ARTICLE调用第2页会先以after=null重读第1页；仅S1b再以`p23:250`读取第2段，其余状态由原operation直接返回items=[]。显式访问旧`/sitemap/articles-2.xml`时是空urlset，不是404；索引移除链接不等于旧分片已刷新。记录operation、variables、状态和返回节点数，不能把p2直返B的mock当游标验证。locale在blog调用options中核US/EN；真实Hydrogen的locale变量注入仍另验。[研究]

**两层测试各守不同门。** 策略单测spy cacheLife/cacheTag并stub storefront.request，逐一调用上述四个缓存函数，核分钟配置／其他类型max、原参数透传、articles/blogs及具体资源标签不丢，列表body值为undefined（不要求没有该键）、详情body为正文、C为undefined；这是配置／转换断言，不证明Next缓存。连续消费者测试则保真实Next cacheLife与remote handler，只在同一请求接缝注入状态替身；依次读`/blogs/guides`、A/B/C详情（B仅存在后）、`/sitemap.xml`、`/sitemap/articles-1.xml`、旧p2及`/sitemap/blogs-1.xml`，同时验metadata、HTML、软导航／预取RSC。上述各key分别暖读并跨自身寿命；构建limit=1预热不能代替列表limit=50。S1b→S1必须见count 2→1、p2非空→空、列表移C且保B，S2继承而不重新初始化模块／缓存。[研究]

故障替身返回`{data:null,errors:[{message:"fixture unavailable",extensions:{code:"INTERNAL_SERVER_ERROR"}}]}`，核原assertStorefrontOk抛错、不得写空成功结果；恢复同阶段再收敛。未识别operation须显式失败，不回通用空data，更不能漏到真实商店。布局的其他请求需补各自真实shape的测试响应，当前表仅闭合博客／sitemap数据通路，不是可直接启动的全站mock。[研究]

**运行前门仍未闭合。** 先在独立候选副本把package.json的Next16.4.0升级到该轮修复版16.4.1（运行时再核后续公告），获准安装后由pnpm12.8.2／Node24解析并生成真实pnpm-lock.yaml，审依赖差异；三路线从同一安全基线分叉。此处没有生成lock、增设测试依赖或执行build/typecheck；这些命令会调用Next，不能包装成静态验证。还须实现上述替身与测试入口、补全站mock、真实API/count契合、缓存后端及退回实测。[研究]

#### R2：继承S1，不为命中补丁改应用

A3仅扩同篇正文，B仍在、C仍删、Fn逐字段不变；不重seed或清全缓存掩盖继承失败。HTML初访、软导航RSC和预取后导航均保全文、末尾标记、Unicode及链接；收敛前可A2，不可复活A1/C。列表仍50项摘要，sitemap仍用原publishedAt。原正文在server，不能为凑大client props把全文搬入客户端，也不强加目录功能。[研究]

实际记录Flight行类型、分块、内联payload和首可用内容，才决定下面3717是否命中。长HTML不自动等于巨大client-props行；不触发就明确记不触发，仍验应用正确性与人定性能预算。真实图片／设备／无障碍及源API上限不由本合成无图长文证明。[研究]

#### Agent补丁维护链：实际包到消费者还有一道门

三报告是不同消费者，未公开完整应用／lock，不拼成shop历史。Agent须核实际包与失败路径、保后续修订，再选携补丁／等发行／退原实现。[研究]

| 维护链 | 已核发行边界 | 删除本地补丁前必须证明 |
|---|---|---|
| [3717](https://github.com/cloudflare/vinext/pull/3717)：Claude Code参与的大Flight普通行优化，初版逐块UTF-8解码使非ASCII退base64膨胀，后补残尾处理 | 最终UTF-8修订6444ff5d；实际npm1.2.0／1.2.1均含utf8CompleteEnd、inPlainRow及入口接线；1.2.0是本轮最低已核包 | 普通行原字节／分块保留；HL跨块仍改写；同chunk普通行结束后仍处理hint；日文／emoji跨字节不膨胀。仅携初版patch不够；作者速度不外推shop |
| [4001](https://github.com/cloudflare/vinext/pull/4001)：真实pnpm dev预打包的两份headers shim共享状态却各用Symbol，workspace fixture漏测 | 1.2.0仍旧Symbol；1.2.1实际dist已Symbol.for。生产bundle单实例，不能称生产双模块缺陷 | 固定lock及node_modules安装拓扑，分dev/prebundle、prod、workspace验证Server Action／draftMode；仓库fixture绿不能替代安装态 |
| [4004](https://github.com/cloudflare/vinext/pull/4004)：独立生产locale应用自1.0.1携补丁，后台再生漏rootParams，首屏SSR正常仍失败 | 合并05231262晚于1.2.1；实际1.2.0／1.2.1后台上下文创建与调用均缺参数，最低已发行修复版未确认 | STALE→后台→新内容仍保locale；先核目标包该调用链，再核消费者。不能仅看到别处rootParams或升级1.2.1就撤补丁 |

包证据为[官方npm1.2.0](https://registry.npmjs.org/vinext/1.2.0)／[1.2.1](https://registry.npmjs.org/vinext/1.2.1)tarball只读核SHA-512与SHA-1吻合registry，静态检查dist及入口；未安装／跑测试／验证provenance。包内有代码不等于固定消费者行为通过。[一手／研究]

携补丁须锁patch／lock并管后续回归；等发行只延后迁移；无人接管或语义不保就保／退Next。shop单locale无root-params，4004非其已知bug。[研究]

仍缺合法内容、真实API/count契合、共同安全lock、安装／后端和退回实测。退回保S2与R1，只撤平台差异；原路线责任不可接受且替代路线保住上述门，才撤保Next默认。[研究]
