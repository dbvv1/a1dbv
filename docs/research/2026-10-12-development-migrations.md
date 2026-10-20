主线：三，兼四
改变的建议：数据迁移先保受支持工具与写入权威；换托管先保应用消费者，再判断是否要换框架实现。[研究]
新证据：2026-10-20从维护记录按主题拆出P22／P23，原核实日期与证据等级保留；拆分不代表新实测。P22已交纸面包，P23仍在执行，未运行应用或模型。

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

**拟改变：换托管不自动等于换框架实现。** 固定一个公开Next应用，比较保Next、自托管／OpenNext与Vinext；Agent盘点消费者拓扑、缓存及补丁责任，人定兼容范围和退回成本。这不是P11的旧页跨发布或既有Next三臂Skill对照。[研究：提议]

[Vinext固定README](https://github.com/cloudflare/vinext/blob/359b4fba55fa3d9f745d4ddf26692591384b2518/README.md)有迁移入口、可选Skill、兼容缺口与替代路线。[#4004](https://github.com/cloudflare/vinext/pull/4004)和[#3717](https://github.com/cloudflare/vinext/pull/3717)标Claude Code参与、消费者携带补丁：前者补后台再生成的上下文，后者修大内容行处理；[#4001](https://github.com/cloudflare/vinext/pull/4001)补真实pnpm消费者与workspace测试不同的模块拓扑。已核合并／diff／测试定义，作者测量不是本轮运行；不同消费者不能拼成同应用连续历史，合并也不证明指定发行包包含。[一手／社区，2026-10-20核；研究]

**完整产物**：先固定应用、依赖、安装与托管基线，交后台刷新和大内容页两轮继承修改包；必须有实际文件／依赖／行为差异、消费者断言、补丁接管、最低已知修复版、删除本地补丁条件及退回差异。比较继续携带补丁、等稳定发行、退回原实现的质量与维护职责；Agent提出候选，人决定支持面。至少一条Agent参与的消费者失败／修订链要改变采用判断，不能只多写“测缓存”。[研究：验收设计]

建议归15，必要同步18；固定证据留本分册，不新建专题。找不到可核主应用或只能交通用提醒则撤项；原生／模型／迁移效果与资料设计分列。公开维护者修改记录不冒充明确退回，未知包版本／净工时不猜。[研究]

**本轮负结果**：无障碍、性能、叙事／存档和同步初筛与既有材料重叠。持久执行的[Restate #770](https://github.com/restatedev/sdk-typescript/pull/770)关闭未合并及后续读取／deadline提案，不足以判既有应用应加引擎，未核明确拒绝原因；[Showboat #14](https://github.com/simonw/showboat/issues/14)只支持演示采集与验收分开。两者不立深项目，不据此否定工具；不为水位补同义题。[一手／研究：有界负结果]
