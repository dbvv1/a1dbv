主线：三／四
改变的建议：连续修改保留同一应用身份与逐人状态；生成服务交可区分原因的故障证据，不把用户提示当根因。[研究]
核实时间：各节保留原日期；P27保资料与离线判据，P49另保2026-10-24 Payment／flagd局部实试及边界。本次仅分册，不新增技术结论或运行结果。

# 开发条件：有状态应用续改与故障诊断

[维护与迁移总览](2026-10-12-development-maintenance.md)；[开发条件总览](2026-10-12-development-conditions.md)。本页续接维护记录，不新增编号专题；“连续修改深项目提议”保留历史标题，P49的实际接收与未验证范围见其原记录。

## 连续修改深项目提议（2026-10-20）

**以下保留2026-10-20纸面提议的历史范围；P22／P23后续状态见各自迁移分册。** P23后来已补focused production局部接收，不能继续把该项概括为全未运行，也不表示完整站点通过。两项归主线三／四，改变15§5的Agent迁移选择；标题保留旧锚点，预算不作验收条件。[研究：历史提议与后续范围分列]

### P22：有数据应用的两轮迁移

[阅读本节](2026-10-12-development-migrations.md#p22有数据应用的两轮迁移)

#### 固定源码、读写闭包与执行门

[阅读本节](2026-10-12-development-migrations.md#固定源码读写闭包与执行门)

#### 第一轮：布尔发布→审核状态

[阅读本节](2026-10-12-development-migrations.md#第一轮布尔发布审核状态)

#### 第二轮：继承S6，增加定时发布

[阅读本节](2026-10-12-development-migrations.md#第二轮继承s6增加定时发布)

#### 当前工具契约：不混入另一套执行权限

[阅读本节](2026-10-12-development-migrations.md#当前工具契约不混入另一套执行权限)

#### 真实维护链：先封新写入，再重排与收尾

[阅读本节](2026-10-12-development-migrations.md#真实维护链先封新写入再重排与收尾)

### P23：Next应用迁出后仍值得保留吗

[阅读本节](2026-10-12-development-migrations.md#p23next应用迁出后仍值得保留吗)

### P27：发送中改稿与在途恢复

**当前交付具体合成账本输入与源码反例；实际两轮运行账本尚缺。** [研究]

需求来自listmonk [#2014](https://github.com/knadh/listmonk/issues/2014)，经[#2264](https://github.com/knadh/listmonk/pull/2264)补编辑入口；[#3022](https://github.com/knadh/listmonk/issues/3022)用户自报重启漏发／疑似重复，非已复现因果。[PR2974](https://github.com/knadh/listmonk/pull/2974)生产成功自报被维护者因破坏性问题拒绝，不能据吞吐表采用。源码AGPL-3，仅分析，不复制应用。[一手／社区；2026-10-20核]

**完整验收**：R1交逐文件闭包及C1的V1→V2账本，分未开始／在途／确认／失败／unknown，保至少八条具名判据；R2继承同一快照，交故障分支差异账本／判定器及三路线成本／header接入，逐人比版本／哈希／attempt／结果，不称exactly-once。具体入口、停止边界与坏候选见下文，人定旧稿补发。两轮产物齐全才算资料验收，仅通用重试卡则撤项。DB／邮件／模型未运行，需实测才能决定则未完成；真实外发未获授权，不取真实名单。[研究：验收与边界]

#### 固定链与两轮继承（2026-10-20）

**版本分开。** [#2264原树→最终树](https://github.com/knadh/listmonk/compare/e8fd12bddf032fe7863af427bcf9e59b82dffb1c...0e49a4bb7d415fc0085d8f068334cb653c55b439)修改Vue编辑／Start／Unschedule、API/core参数和SQL：scheduled清send_at才回draft；旧API已允许paused，PR补UI。正式[6.2.0固定树](https://github.com/knadh/listmonk/tree/ef0a75872463f10a4848af6c547d1c057405453a)仍Vue，SQL仍fetch时推进游标。开发[a729修复](https://github.com/knadh/listmonk/commit/a729a4a6d635dabb75fa0ec53df25eec2e6f2285)与本次HEAD [88031f3](https://github.com/knadh/listmonk/tree/88031f3e082648bc3f95f285df74b7b38710b54d)已SSR；后者保检查点机制，新增totalSent统计；均非正式版。[一手：固定源码]

**逐文件闭包。** 下列路径／行号均相对上述固定88031f3树。[一手]

1. SSR编辑器（`static/admin/assets/js/views/campaign.js:128–342`）接`campaign.html`／`partials/campaign-form.html`原id及完整正文／模板／headers／lists／media／send_at。Start先保存再改status；Unschedule保留日期，立即发送须另清。路由（`cmd/handlers.go:207–223`）分manage/send，status另查名单管理范围；测试发送走manage。
2. API更新（`cmd/campaigns.go:503–581`）读原Campaign再bind，拒绝running／cancelled／finished正文。SQL（`queries/campaigns.sql:370–435`）保身份／started_at／sent／游标，替换名单／附件。省lists失败，带lists但省media删附件；status写DB后StopCampaign，不等清空。
3. store（`cmd/manager_store.go:38–66`）→选活动／名单SQL（`queries/campaigns.sql:178–237`）：选running／到期scheduled，排除活跃pipe；恢复重读模板／media／合法名单／max ID，受众非冻结，退订／blocklist优先。
4. pipe（`internal/manager/pipe.go`）编译模板／载附件，批ID先入pending，再由message.render（`internal/manager/message.go`）逐人渲染入队。旧消息持有V1对象／字节；cleanup等wg耗尽、刷检查点并移除pipe，新扫描才载V2。
5. worker（`internal/manager/manager.go:494–578`）先查stopped再sleep／Push，无第二次检查：暂停非drain／撤回。成功加sent，渲染失败及未停止的Push错误也completeSub。checkpoint卡在最小pending之前；高ID已接受仍可能重扫，重复范围不限单次扫描周期。
6. email.Push（`internal/messenger/email/email.go:132–226`）同步调用[固定smtppool v2.2.1](https://github.com/knadh/smtppool/blob/v2.2.1/pool.go)的Send。DATA Close丢回包可error却已接受；此路径不自动重试，其他阶段可能重试，故分应用／transport attempt。随机Message-ID非幂等键。postback（`internal/messenger/postback/postback.go`）的200只证明该HTTP调用层成功。

**当前API反例须留下。** core状态switch（`internal/core/campaigns.go:249–302`）拒绝draft→paused／cancelled等，但漏default／finished：finished到SQL，未知值由enum失败报错；读查与写入非条件更新。running若有send_at，SQL存scheduled而响应写running，须GET核验。未做HTTP复现。[一手／研究]

#### C1：R1账本直接进入R2

C1及人身份不变；别名并非数值ID：S10=10、S20=20、S60=30、S70=40、S80=50、S30=60、S40=70、S50=80。V1/V2含正文／主题／模板／altbody／headers／附件；app attempt从newMessage构造／渲染起计，transport按SMTP实际尝试另计；保摘要／证据。[研究]

**受控调度预注册，未运行。** BatchSize=7、Concurrency≥2、MessageRate>0、MaxSendErrors=0；生产者排入60后、70迭代的stopped检查前设屏障，80尚未fetch。一个worker在20通过停止检查后阻塞；另一个已处理10／30／40／50，在取60前阻塞；其余worker停在取队列前。主链pause→解除屏障并drain→edit V2→resume；cancel从暂停前切面K独立终止分叉，绝不接恢复。各分支继承明确的输入与事件前缀，不把不同故障都说成来自同一份DB快照。[研究]

| 原人／具名判据 | R1暂停与改稿边界 | R2安全预览／故障判定，非原生发送保证 |
|---|---|---|
| S10/10；`V1_ACCEPTED_KEEP、ACCEPT_BEFORE_FLUSH` | a1/V1明确accepted；不因改稿补V2 | 接受未flush即崩溃：既有外部确认仍保accepted；无该证据的恢复进程仅知unknown，转出须外部证据；两视角须合并，不因sent=0归未发 |
| S20/20；`UNKNOWN_KEEP、STOP_BOUNDARY` | a1/V1已越过worker检查、尚未Push，transport=0 | 解除屏障才开始Push；仅过停止检查不是unknown。提交结果不可确认才记unknown V1；cancel分叉亦可能继续该Push，但不接恢复 |
| S30/60；`PENDING_KEEP、PAYLOAD_VERSION` | a1/V1已渲染排队，未过停止检查 | 停止后跳过旧Push、保pending；旧pipe清空后才能a2/V2，不能遗留V1附件／header或漏人 |
| S40/70；`PENDING_KEEP、PROCESSED_NOT_SENT` | fetched/pending，尚未构造 | 停止后仍待处理；恢复a1/V2若渲染失败，记failed且processed、sent不加，不伪造accepted |
| S50/80；`PROCESSED_NOT_SENT` | 从未fetch | 恢复前若退订则suppressed；仍合资格才a1/V2，保原集合与当前候选差异，不偷偷扩大受众 |
| S60/30；`UNKNOWN_KEEP` | a1/V1 Push结果不明 | SMTP接受后DATA回包丢失：即使原生completeSub仍unknown；不默认重试V2或标成功 |
| S70/40；`DB_UNKNOWN、PROCESSED_NOT_SENT` | a1/V1有明确拒绝证据 | processed仅本pipe不重试；重启若游标受20阻塞仍重选40，越过40且持久才跳过。如批准a2/V2，DB未知时保双attempt、先读回不盲加sent |
| S80/50；`V1_ACCEPTED_KEEP、LOW_ID_BARRIER` | 高ID a1/V1已accepted，S20未完成 | checkpoint≤19；崩溃可重扫50。保其接受证据，不因改稿补V2，不能以max成功50跳过20 |

**先固定三面切面K，再形成已排空切面D。** K取pause前上述屏障；下表是待构造的合成输入，不是已捕获运行记录。[研究]

| K的面 | 明确输入与证据来源 |
|---|---|
| DB持久面 | C1的id／UUID／started_at、V1及模板／名单／附件关系、八人id／UUID与订阅关系。若冻结首次扫描后的计数flush，则拟定sent=0、last_subscriber_id=0、max_subscriber_id=80、status=running；须读回实际值，不能由worker计数猜DB |
| 易失执行面 | lastFetched=70、pending={20,60,70}、checkpoint=19、p.sent=2；60/a1/V1在队列，20在Push前，生产者在70检查前。用屏障记录；DB没有Go指针／队列／waitgroup，重启不能声称还原这些对象 |
| 独立sender面 | 10、50的a1/V1已接受证据；30的a1/V1提交未知；40明确拒绝；每次实际payload。测试sender与应用审计分开保留，不能用应用sent代收件证明 |

DB准备须保`subscribers/lists/subscriber_lists/templates/campaign_lists/media/campaign_media`及序列；附件blob另保，media行无附件内容。固定Tracking、UnsubURL、UnsubHeader、messenger／SMTP头及batch/concurrency/rate。原表没有逐人attempt账本；该账本由后置R1补丁新增，不把本节JSON导入当已完成应用改造。[一手：同固定树`schema.sql:97–195`；研究：输入设计]

**账本先保存事件，再生成差异视图。** 行列为`event_id,parent_event,branch,cut,campaign_id/uuid,subscriber_id/uuid,app_attempt,transport_attempt,payload_ref/hash,stage,app_observation,external_evidence_ref,durable_write/readback_ref,provenance`。准备行标`synthetic_expected`；只有实际捕获的事件才标`runtime_observed`，缺证据用空值，不伪造日志地址。[研究]

| 合成事件／父切面 | 新增事实与D的差异 |
|---|---|
| E01／K：pause | 请求paused并置stopped，旧attempt全保；请求响应不能代DB读回 |
| E02／E01：20继续Push | 从dispatch-authorized进入dispatching，新增t1；DATA提交后丢最终回包才成为unknown。仅在Push前被杀不能伪造SMTP在途 |
| E03／E01：排空旧队列 | 60/a1/V1在停止检查被跳过，transport=0，状态skipped-before-Push；70退出且尚无app attempt |
| E04／E02+E03：cleanup成功 | 在此前无flush且上述结果成立的分支，拟读回sent=2、last_subscriber_id=19、status=paused；失败分支不得套成功值 |
| E05／E04：edit V2→D | 保C1身份／started_at及全部V1事件，当前内容改V2；10/50 accepted、20/30 unknown、40 rejected、60 skipped、70无attempt、80 unfetched。退订80须另加事件，不让它凭空消失 |
| E06／D：原生resume | 若80另已退订，SQL候选仍为{20,30,40,50,60,70}；保实际重选与重复记录。D不是完成R1，还需捕获本轮发送结果再供R2消费 |

**原生重选是反例，不能被安全预期覆盖。** 固定SQL只按游标／max ID／订阅与blocklist筛选，没有逐人accepted／unknown过滤。游标19时，30的未知和50的已接受不会阻止它们再次Push V2。R1只增审计、不改发送策略，就必须忠实记录此结果；上表“不自动补发accepted／unknown”是R2只读恢复预览的目标，不是原生R1已具有的行为。接受未flush崩溃从K或另一个明确切点分叉，不能从cleanup已成功的D伪造该故障。[一手：`queries/campaigns.sql:329–354`、`internal/manager/pipe.go:112–131,220–255`、`manager.go:505–575`；研究：两轮责任]

**固定合成payload，而不假造SMTP邮件。** 下列一行JSON按UTF-8、无末尾换行保存，收件人60是数值ID（别名S30）。共225字节，SHA-256为`5bd4be21aa0011f4d986475ac373181f271d8ed9a470539474bb92913691fce1`：[研究：纯字节计算]

```json
{"altbody":"V1\n","attachment":{"content_hex":"76310a","name":"note.txt","type":"text/plain"},"body":"<p>V1</p>\n","from":"sender@example.invalid","headers":{"X-P27-Version":"V1"},"subject":"C1 V1","to":"s60@example.invalid"}
```

V2把全部`V1`改`V2`、`76310a`改`76320a`，仍225字节，SHA-256=`0c06ba5dad2fd1218680445eb9ea3f6813688f76e873486937bf60370b0bd1f2`。其余人只替换地址后逐人重算，不共用hash。实际运行另采源输入、渲染payload（完整有序头值及附件字节）、SMTP wire三类hash；随机Message-ID／Date／MIME边界使wire不能用合成hash代替，语义相同与逐字相同分判。[研究]

**四项独立差异判定。** R2接收实际R1产物后才执行；下述为完整oracle，后面的离线检查器仅覆盖记录一致性子集，不计现场通过：[研究]

- 身份与前缀：R2输入指纹等于所接R1输出，逐项保C1及八人id／UUID／started_at、原attempt主键与证据摘要；增加活动行、丢旧attempt或重seed均失败。
- unknown守恒：逐attempt核`U_before − resolved_by_new_evidence = U_after`；a2 accepted不解决a1 unknown，每次解疑须有同活动／人／payload／attempt的新证据。
- 预览无外发：R2预览前后sender调用日志不变；accepted与unknown不生成自动发送动作。原生sourcebranch的重复必须保作反例，不能混计为安全策略通过。
- 版本连续：60旧a1/V1与hash不被覆盖，新构造为a2/V2；70首次构造为a1/V2，若渲染失败则transport=0。每次实际Push连接唯一已渲染attempt，不以总数代集合。

**窄记录检查器：把可离线判断的部分先执行。** [check-p27-ledger.py](../../scripts/research/check-p27-ledger.py)只读两份独立JSON，精确字段见脚本docstring；[合成回归](../../tests/test_p27_ledger.py)提供可复用输入形状。调用如下，不启动listmonk、数据库或发送端：[经验：本仓实现]

```bash
python3 scripts/research/check-p27-ledger.py BASELINE.json CANDIDATE.json
python3 -m unittest discover -s tests -p 'test_p27_ledger.py' -v
```

baseline为R1的source记录，candidate为R2 preview；保八人和活动身份、旧attempt／hash／事件前缀。unknown可继续保留，只有追加同attempt／hash的新证据引用才可解疑；a2接受不能解决a1未知。预览不得新增实际attempt或sender调用，计划仅放actions，accepted／unknown不能自动send。原生重复可以留在baseline历史，不能借source分支冒充安全preview。60／70连续性检查针对已有R1记录，不要求预览虚构发送。[经验：记录判据]

退出0只表示给定记录满足该子集，1表示不满足，2表示输入无效或超出支持范围。当前每app attempt仅支持0／1次transport，多transport明确拒绝，不判真实恢复成败。evidence_ref仅关联与防复用，不打开、不核独立真实性；哈希只是输入声明，不读取payload字节，合成测试使用占位hash。两份输入一起伪造仍可能通过；runtime_observed也未被认证。脚本不验证真实订阅资格、DB／易失切面是否完整、实际payload／SMTP结果，不能替代四项oracle的现场证据或P27整体验收。[经验：实现边界]

Push与落盘非原子；扫描（`internal/manager/manager.go:592–620`）取checkpoint、Swap增量再写DB，失败不塞回以防重复加数，也可能低报。DB错误分已提交／未提交，读回再决策；GREATEST只防游标倒退。[一手；研究：R2判定]

**具名判据均未运行。** 上表保留原判据名及逐人预期；另核以下共同项。比较(C1,人,版本,attempt,结果)，不以总数替代集合。[研究]

- `ID_KEEP`：两轮id／UUID／started_at不变，活动仍一行；克隆全量重发退回。
- `UNSCHEDULE`：撤排期保C1，日期需另清；GET核running请求与存储scheduled差异。
- `ROLE_AND_STATE`：仅manage不得启动／恢复正式活动；非法状态直调API，finished／未知值列现存缺口，测试发送另验权限。

现有生命周期E2E（`tests/specs/campaigns.spec.js:538–591`）有附件／生命周期检查，无逐人版本／乱序／崩溃判据；本次未运行。[一手／研究]

#### 同场景取舍与交付边界

| 路线 | 本场景何时够用 | 增加的责任／撤回条件 |
|---|---|---|
| 原生C1继续 | 未开始编辑，或接受原生失败／重选政策、不需精确逐人版本审计 | 核部署版本，不直接切nightly；需证明谁收过V1或不能承担重复则撤回“够用” |
| Resend窗口幂等 | 已选该供应商，同一请求24小时内重试 | 逐人稳定键、版本／payload、过期／冲突与切换管理；超窗或换稿不能沿用旧保护，换V2键也不能代替补发决定 |
| durable ledger／outbox | 跨窗口保C1／人／版本历史并对账，愿承担维护 | 迁移、唯一约束、intent／lease、payload保留、attempt／provider证据、隐私删除与恢复演练；本地事务和SMTP仍不原子，unknown仍需处理 |

[官方Resend契约](https://resend.com/docs/dashboard/emails/idempotency-keys)支持HTTP键及SMTP `Resend-Idempotency-Key`、保存24小时。当前源码的HeaderTpls→message.render→worker→email.Headers通用链可传逐人键，但没有专用生命周期：全活动静态同键、每次随机键、同键改payload都是坏候选。postback把Campaign.Headers放JSON而非该HTTP请求头，不能靠换URL声称接入。源码可达不是供应商集成通过。[一手／研究]

**模型对照已后置，尚未启用。** 后续安排见[现有验证模板](../../templates/long-task/README.md#relay-pilot-plan)；本节C1两轮拟行为验收保留，仍未运行。[研究：范围]


## P49：生成服务的故障证据

核实：2026-10-21（UTC+8）。主线四；改变[15§2](../15-task-playbooks.md#接管生成服务先交能区分原因的证据)：生成 Agent 先交原因判别链，复用现有遥测，缺语义再补；18只保入口。新证据是同版付款故障传播中“主动注入→付款拒绝”语义失真。[一手／研究]

### 当前最高水平卡

- **问题**：生成服务不仅能跑，失败后能否让接收者继续诊断？
- **近期上限参照**：Tao 等，[2026-07-07论文v1](https://arxiv.org/html/2607.05785v1)分开源码诊断语义与运行故障信号；FSR衡量特定日志证据，不是根因定位正确率，样本为Copilot SDK上的GPT-5.5、Opus 4.8与Gemini 3.5 Flash，不代表2026-10所有工具。[研究]
- **发布消费侧**：Cursor／Rustam Lalkaka，[2026-09-23 Rollouts](https://cursor.com/blog/rollouts-and-security-reviewer)按diff制定监测计划、识别插桩缺口，发布后比基线并按配置通知／暂停／提出撤回。它消费遥测，不替生成者补齐故障语义；属于厂商自述，非本仓复测。[一手]
- **主流未知；可行层**：没有同题代表性采样。下述OpenTelemetry官方样例证明手工span、RPC自动插桩及日志可形成判别链，不是Agent生成结果。
- **本仓默认**：低投入可行层，先复用已有信号；生成Agent追语义与传播，观察Agent消费与比较，人核业务分类和操作权限。未比较同条件方案，整体最高水平未知。[研究]

### 固定源码与三路判别（静态证据）

固定 open-telemetry/opentelemetry-demo 的 `ba1757b3f197916640fff4f7c549b99e54835ab8`，文件头 Apache-2.0。下表保留10-21源码／测试预期与推导；10-24已补[Payment与flagd两路实试](../../experiments/p49_payment_rpc.md)，完整demo、Cypress、模型及错误目标路径仍未运行。下表整条传播链不因局部实试而全部通过。[一手／研究／本仓局部实试]

共用有效合成订单与正常前置服务；三路 `(paymentFailure, paymentUnreachable)` 为 `(0,false)`、`(1,false)`、`(0,true)`；留当次评估值，不以配置存在代触发。两个开关同时开会先走错误目标，不能作独立对照。[开关配置][p49-flags]、[付款实现][p49-charge]、[checkout实现][p49-checkout]。[一手]

| 路径 | 源头及预期信号 | 传播与能排除的原因 |
|---|---|---|
| 正常 | checkout的prepared之后调用Charge；Payment记录Transaction complete、成功计数加1并返回transactionId；checkout记charged及payment went through，后续才shipped／order placed | 同请求charged支持Charge返回成功，不证明真实银行卡扣款。demo的synthetic_request仍返回ID并计数但charged=false；order placed也不证明邮件成功，清购物车错误被忽略。[付款][p49-charge]／[checkout][p49-checkout] |
| 主动报错 | paymentFailure=1在读取／验证卡信息前抛普通Error，固定message含Payment request failed、Invalid token；charge记录exception、ERROR及error.type=Error；handler记warn并callback(err)，不到成功计数或返回ID | chargeCard加could not charge the card，PlaceOrder再包Internal与failed to charge card；同trace的源头异常与特定message支持注入、排除该次到达Payment前已连接失败；执行顺序排除卡验证触发。Invalid token只是注入文案，不证明外部认证失败。[付款][p49-charge]／[handler][p49-handler]／[checkout][p49-checkout] |
| 错目标 | paymentUnreachable=true临时将客户端指向badAddress:50051，再发Charge；目标确不可达时应有底层连接／解析失败。checkout仍可有prepared及RecordError，不走charged | 沿同两层包装到外层Internal。请求评估值、实际目标与传输错误合起来支持错目标，不证明Payment实例宕机。未见Payment服务端span只是辅助线索，不能排除采样／导出／查询缺失；具体码、DNS和耗时依环境。[checkout][p49-checkout] |

`RecordError`记录chargeCard错误；RPC自动插桩也影响span状态。`charge`用startSpan而非startActiveSpan，handler当前RPC span与它不能混作一个；日志关联须核实际span_id。[一手：同版checkout／charge／handler]

### 反例：用户提示不是故障分类

[API][p49-api]以`failed to charge card:`为前缀，且嵌套详情不含`code = Unavailable`／`code = Internal`时，返回422／PAYMENT_FAILED并记Checkout payment declined；其余返回500。**同版[Cypress源码][p49-test]把100%注入的预期设为422**，足以否定“422就是真实卡组织拒付”的读法，但不是测试已通过。普通Error具体wire code未在依赖内部复核；错目标若返回其他底层状态，仍按该字符串分支判断，500不是跨环境定理。[一手／研究]

浏览器[Request封装][p49-request]遇非2xx只抛Error(data.error或状态文字)，不把JSON code／HTTP status保为结构化字段。Agent须回查API与源头证据，业务提示可统一，维护接口保留原因和来源。[一手／研究]

### 最小诊断交付包与接收条件

给生成Agent的五项交付要求，非已运行完成的包。[研究：设计]

1. **身份与输入**：SHA、构建／启动方式、配置来源、单一合成请求的关联键／时间窗及当次flag值。静态默认与运行评估分列。
2. **三路判别表**：源头、最早可判别信号、包装边界、对外错误、可排除项／未知项；明确哪些是源码预期，哪些有实际观察。
3. **实际取证入口**：接收者能用的服务名、trace_id、时间窗与权限。该版基础[Collector][p49-collector]的trace／log去debug；Jaeger等来自[observability附加配置][p49-observability]，不能默认界面已启用。
4. **语义保真**：先复用exception、底层状态和目标证据；仅剩Internal／422且无法分因时，才补低敏来源／原因／依赖目标字段。保持emitRawPii关闭，不为诊断收集真实卡号／CVV；trace管线脱敏不能推成所有日志已脱敏。[配置][p49-flags]／[Collector][p49-collector]
5. **验收与撤回**：先核发出→采样→导出→Collector→后端保留／查询链，再用缺迹辅助判断。正常付款不包办邮件等全部副作用；证据不可访问或相关性未核时保留“原因未定”，撤回自动根因承诺。实际发布须另验接收者可取得证据，不能凭本静态表授权付款重试、重启或回滚。

**10-24真实接收**：现有Payment服务、官方flagd v0.16.0与锁文件依赖跑通正常／100%注入。外置OpenFeature after hook只记录实际flag值与当前RPC身份；真实flagd span、charge异常、handler日志及客户端回执在同trace上对应。注入确实早于卡验证，客户端为gRPC UNKNOWN；服务端OTel ERROR的数值虽同为2，不能作wire code使用。正常合成请求返回ID且charged=false，非真实资金操作。[本仓实试]

**当前验证边界**：只接收Payment→flagd及console遥测，不含Checkout／frontend映射、错误目标、Collector／Jaeger查询或模型诊断收益。应用源码未改，只按官方说明准备proto／依赖，另加只读flag观察器；参数化入口及固定日志核验见[重放说明](../../experiments/p49_payment_rpc.md)。下列链接仍是整链的固定源码定位，不是完整应用运行回执。

[p49-flags]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/flagd/demo.flagd.json
[p49-charge]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/payment/charge.js#L27-L115
[p49-handler]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/payment/index.js#L12-L31
[p49-checkout]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/checkout/main.go
[p49-api]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/frontend/pages/api/checkout.ts#L14-L47
[p49-test]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/frontend/cypress/e2e/CheckoutPaymentFailure.cy.ts#L58-L70
[p49-request]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/frontend/utils/Request.ts#L27-L42
[p49-collector]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/otel-collector/otelcol-config.yml#L208-L273
[p49-observability]: https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/otel-collector/otelcol-config-observability.yml#L64-L72
