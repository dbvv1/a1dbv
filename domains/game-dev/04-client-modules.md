# 客户端核心模块：让操作有回应，让体验连续

> 编辑更新：2026-10-17（UTC+8）；资料核实时间及版本见 [WP10](../../docs/research/2026-10-14-game-wp10-client-modules.md)。单人程序、无人工美术／音频修补；Unity 主线、Unreal 对照。资产导入见 [01](01-engine-integration.md)，资源供给见 [03](03-generative-ai-in-games.md)。本轮仅资料编辑，未运行引擎。

## 30 秒结论：先把核心动作做舒服

| 眼前问题 | 先做什么 | 何时加能力 |
|---|---|---|
| 还不能完整玩 | 一套目标设备，原生输入、UI、物理和窄存档 | 原生机制出现明确缺口后再加库 |
| 移动、跳跃、攻击能运行但不好玩 | 精修一次完整操作的响应、节奏和结果辨识 | 按缺口增加容错、接触处理和演出 |
| 切场景后残留对象或声音 | 明确所有者、请求代次和退出收尾 | 有分组驻留或分发需求再加资源层 |
| 存档可读但进度错误 | 稳定 ID、迁移与旧档回归 | 承诺跨版本恢复时补相应迁移 |
| 首次技能卡，或持续战斗掉帧 | 分开定位首用准备、模拟、透明覆盖和呈现节奏 | 只为已确认热点加预热、池或 GPU 路线 |
| 要支持更多平台／语言 | 先补该目标的完整操作、恢复与构建验收 | 有实际需求再扩工具链 |

**[研究] ✅ 默认先借引擎，把一个高频动作做得可控、清楚、值得反复玩。** 动作游戏先打通响应→反馈→稳定帧间隔，节奏游戏优先音画时序；人决定手感，AI 补实现和检查。

## 1. 单人项目先借引擎，再补确实缺少的一层

**[研究] ✅ 先定设备、帧率／分辨率、内存、保存失败与菜单策略。** 联网仅按玩法引入，暂缓预建 ECS／跨引擎框架。

### 先做完整动作：响应、反馈和顺滑分别解决什么

| 缺口 | 先做什么；何时撤回 |
|---|---|
| 短按没响应 | Unity 低延迟输入先用 Dynamic Update，物理消费保存值，离散按下只消费一次；需要容错再加有期限缓冲／离地宽限，过期攻击或自动跳就收窄 |
| 转身迟滞、姿态弹跳 | 调 Animator 转场、Exit Time、打断与步态；接触缺口才加 IK，混合冲淡命中或打断抹掉承诺就撤回 |
| 命中不清楚 | 从已确认结果驱动受击、短特效和声音，再加顿帧／震动；群攻遮挡或疲劳先减强度与并发 |
| 回合演出拖沓 | 缩普通反馈，再给可选快速播放；沿原完成条件推进，保留重要结果辨识 |
| 移动抖／首次停顿 | 姿态不连续查模拟／呈现，长帧查加载／分配／绘制；Interpolate 落后一个物理步，Extrapolate 可能越界再纠正 |

[一手／研究] 原生契约与不同游戏机制见 [动作研究](../../docs/research/2026-10-14-game-wp10-client-modules.md#体验质量深化响应与顺滑让同一个动作值得反复玩)。顿帧明确冻结对象、输入过期时钟与叠加上限；承担反应窗口时作为玩法规则。保留参数基线，由人对照完整动作，软件时间戳只用于定位链路。

**[研究] 卡边角先查碰撞表达，需容错才做有界纠偏。** 误改路线、越障或推入危险就撤回；Celeste 带刺边缘限制与 Factorio 安全检查见 [空间容错](../../docs/research/2026-10-14-game-wp10-client-modules.md#空间容错补研动作已开始却卡在边角)。

**[研究] 转向发黏先分输入平滑、限幅和插值。** Barony 有关插值有效、关限速并保留插值才有效的不同反馈；玩法本需转身承诺时保留限幅，见 [转向取舍](../../docs/research/2026-10-14-game-wp10-client-modules.md#转向补研先分限幅与平滑再决定是否撤回插值)。

**[研究] 插值成为热点后才按所有视口／尺度筛选，保留仿真与必要屏外取样。** 难追踪或入屏突跳就扩大范围／撤回；OpenRCT2 无该改动性能测量，VVVVVV 有屏外取样反例，见 [插值预算](../../docs/research/2026-10-14-game-wp10-client-modules.md#插值预算按观察尺度缩小呈现不停止仿真)。相机见 [05](05-gameplay-architecture.md#8-相机先让玩家看懂并控得住再增加镜头语言)。

### 刚移动就查询：先确认物理状态已更新

**[研究] ✅ 查询仍像旧位置，先查写入顺序。** Unity 6.3 内置 **3D** 直接改 Transform 后，批量修改结束、依赖查询之前才调用 Physics.SyncTransforms；它不推进模拟，也不使 MovePosition 立即完成。已弃用的全局 auto-sync 不作修复配方。[一手]

UE 当帧物理结果用 TG_PostPhysics，对象更新依赖用 tick prerequisite。来源见 [物理查询](../../docs/research/2026-10-14-game-wp10-client-modules.md#物理查询补研刚改位置不等于物理查询已看到新位置)；Unity 范围不含 2D。[一手／研究]

### 呈现节奏：动作已执行，画面仍不顺

**[研究] ✅ 用原生同步建立基线，同时看实际帧间隔和操作响应。** 平均 FPS 正常仍可能不均；降排队后掉帧、顺滑却发黏就撤回。

- Unity 6.3 桌面先比较 VSync；非零 VSync 忽略 targetFrameRate，软件限帧可能微卡顿 [一手]
- Android 用已集成的 pacing：Unity Optimized Frame Pacing、UE 5.2 起默认 Swappy [一手]
- UE 热点指向 game／render／RHI 排队才试 low-latency syncing，缩 pipeline 会减少长帧余量 [一手／研究]

**[研究] 基础响应达标后才评估帧生成，分开记录应用帧与呈现帧。** AMD UE 插件 4.1.1 Slate Redraw 重复 NativeTick，UI Extraction 避免双 tick 却可能损伤半透明 UI；HUD 失真或业务副作用无法修好就撤回。Unity 所核上采样入口不证明同样的帧生成能力。[一手] 来源、反例与版本见 [呈现研究](../../docs/research/2026-10-14-game-wp10-client-modules.md#呈现节奏补研平均-fps-与实际看到的动作不是同一个承诺)，目标设备收益仍待测。

### 运动中的清晰度：关键提示不能只在截图里看得清

**[研究] ✅ 拖影先核矢量与实际 AA／上采样路径，再调画质。** Unity 6.3 URP 对象矢量支持 opaque／alpha-clipped，透明烟雾不适用；跟随角色也可能需 Per Object Motion。[一手]

关键边界先用足够大的稳定形状；输入正确仍拖影才比较减少历史或 SMAA／FXAA，闪烁／模糊更坏就退回。STP 隐式启用 TAA，须连同 render scale／Upscaling Filter 核对，调试绿色未必是错误矢量。来源与反例见 [运动可读性](../../docs/research/2026-10-14-game-wp10-client-modules.md#运动可读性补研关键提示不能靠历史积累补成另一个位置)。[一手／研究]

### 信号取舍：减掉演出后，仍看得懂下一步

**[研究] ✅ 先保决定下一步的信号。** 动作游戏先保危险方向、时点、范围与命中，回合策略可展示目标和行动变化；信息挤不下先缩规则组合，而非继续加图标。

关键颜色／声音另有可用表达，先删遮挡预告的装饰。呈现设置遵守当前状态，减伤等辅助规则按自身承诺验收。新增敌人后比较默认、静音、减粒子与自定义配色；辨识变差就撤回演出。Into the Breach 设计约束及 Dead Cells 显隐／轮廓反例见 [信号取舍](../../docs/research/2026-10-14-game-wp10-client-modules.md#信号取舍补研呈现设置保住玩法信息辅助规则另有承诺)。[一手／研究]

### 像素风慢速移动：先分清画面网格与模拟运动

**[研究] ✅ 先找取整层，再调插值。** 严格像素网格与慢速连续运动需要取舍；连续旋转／缩放确需时试提高呈现分辨率或过滤，边界变糊／轮廓不稳就撤回。

Unity 6.3 URP 内置 Pixel Perfect，先统一 PPU、分辨率与缩放；Pixel Snapping 不改 Transform。仅平滑最终画布未必平滑内部物体，Cinemachine 混合也可能失去像素对齐。[一手] 原生契约、Slow Rush 反例与拾取回归见 [像素网格](../../docs/research/2026-10-14-game-wp10-client-modules.md#像素网格补研低速步进不是物理插值失效)，不作为 UE 配方。

## 2. 十一个模块的最低交付线

下表为 **[研究]** 选择，契约见各节；风险项不代表 AI 实测出错率。

| 模块 | 原生起点与最低交付 | 何时增加能力；关键撤回条件 |
|---|---|---|
| 渲染与性能 | Unity URP／UE 原生渲染与 scalability，固定设备、帧时间与内存 | 需求与设备支持才加重管线，超预算先定位／缩内容；换色／受损先用[材质参数](assets/materials.md#同资产换色或受损先分共享预设与对象参数) |
| 资源与内存 | 小常驻内容直接引用；指定释放者，拒绝旧结果 | 分组驻留／分发才用 Addressables／Asset Manager；所有权不清先修生命周期 |
| 动画 | Unity Animator／Clip／Blend Tree；UE Animation Blueprint／Montage，位移归属、打断、复位明确 | 接触缺口才加 IK／Playables，基础问题先修资产；换装备后核[范围与屏外更新](assets/animation.md#换动作后消失或突跳先分包围范围与屏外更新) |
| 物理与碰撞 | Unity 原生 2D 或 3D／UE Chaos，明确碰撞层与幂等命中结算 | 具体漏碰／稳定性问题才用 CCD／substep；防穿透破坏反弹／推动规则则撤回配置 |
| 输入 | Unity 已发布兼容 Input System／UE Enhanced Input，逻辑动作、改键、失焦与断连恢复 | 复杂菜单路由再评估共享层；重复输入先修权限，避免堆 debounce |
| UI | 保留稳定 uGUI／UE UMG；新布局密集菜单可试 UI Toolkit | 重复菜单逻辑才抽共享层／试 CommonUI，焦点或返回失效就撤回 |
| 音频 | Unity AudioSource／AudioMixer／DSP 调度，UE Audio／MetaSounds；分组音量、并发和暂停政策 | 交互音乐／制作成本值得才试 FMOD，集成抵消收益则保留原生 |
| 存档 | 显式 DTO、已有序列化器、小型迁移函数；UE SaveGame 槽位，保留旧档与失败反馈 | 字典／树迁移再加兼容序列化库；叙事才评估 ink。恢复进度错误时先修内容迁移 |
| 本地化 | Unity Localization 表与伪本地化／UE FText，稳定 key、变量、复数及字体 fallback | 按目标语言增加塑形与编辑支持；关键文字不可读／不可操作就暂缓该语言 |
| 平台发布 | Unity Build Profiles／UE build、cook、stage、package，干净目标机能启动和恢复 | 重复构建才做 CI；Play／Cook 成功不代验目标构建 |
| 编辑器扩展 | Unity AssetPostprocessor／Inspector／UI Toolkit；UE Editor Python／Utilities，批处理可预览、幂等、可撤回 | 重复操作才写工具，引用不稳或重复执行有差异就先修 |

**[研究] 音频先按症状修原生配置：** 确认声迟到查提交／首用／输出，再改一个缓冲设置；爆音、断续就退回。密集漏声先分重触发、同组限额和全局声部；保护旧起音可能拒绝新警告，priority 不绕过组限额。播放却听不清先减装饰并改混音。

持续声先定范围、淡化与续播／重启，短音丢弃政策不直接复用；Unity maxDistance 未必归零，UE 静音续播可能占 voice。切镜失衡先选听点位置、朝向、速度，缩范围藏危险或重播误报就撤回。相反的缓冲维护选择、并发和听点反例见 [WP10 音频](../../docs/research/2026-10-14-game-wp10-client-modules.md#音频并发补研保住起音不等于保住每次提示)及[响应](../../docs/research/2026-10-14-game-wp10-client-modules.md#声音响应补研低延迟与连续播放分别验收)；音乐切换见[音频页](assets/audio.md#音乐循环和状态切换先于完整成曲)。[一手／研究]

### 墙门后的声音：先选可听规则，再选遮挡

**[研究] ✅ 直达／被挡先用低通和音量；能经开门听见则复用房间连接。** Unity 用目标 AudioSource／Mixer 的低通，必要时 Linecast；Listener 滤波影响所有到达声音。UE 先用 Attenuation Occlusion，simple collision 误挡才比较 complex。[一手]

门边跳变、开门仍闷或关键起音丢失时查几何／过渡，必要时撤回；复杂传播需求明确再加方案。Homebody 分区与 Barotrauma 近似通路各有用途，证据／许可见 [墙门遮挡](../../docs/research/2026-10-14-game-wp10-client-modules.md#墙门遮挡补比直达被挡不等于通路消失)。[研究]

### 高速碰撞：先分运动与错误，再选检测方式

**[研究] ✅ 按漏碰／误接触选原生路径。** Unity 6.3 内置 **3D** 线性物体在 Speculative 失败时比较 Continuous（静态对象）／Continuous Dynamic（动态刚体）；旋转不能靠线性 sweep 补齐。Speculative 包含角运动，却可能误判细分表面而弹起，也可能漏碰。[一手]

UE Chaos CCD 与 ProjectileMovement 扫掠／轨迹细分分开选，开启物理后由物理接管；substep 不替代检测算法，重复回调按攻击 ID 去重。破坏既定反弹／推动就撤回配置，见 [高速碰撞](../../docs/research/2026-10-14-game-wp10-client-modules.md#高速碰撞补研线性旋转与误接触)的版本反例。[一手／研究]

### 3D 角色运动：先选想要的控制，再选碰撞求解方式

**[研究] ✅ Unity GameObject 普通直立角色先用 CharacterController；已有好用 Rigidbody 路线保留。** 重量感可来自加减速和步态，只有冲量／质量交互是玩法才优先动态响应。

| 需求 | 路线与关键责任 |
|---|---|
| 常规坡阶、利落起停 | CharacterController；Move 不提供重力／自动推刚体，isGrounded 来自最近一次 Move |
| 自然力学交互 | 力驱动 Rigidbody；若总要清除物理响应才能保落点，改显式运动政策 |
| 接触与可预测速度折中 | 速度驱动 Rigidbody；统一移动、重力、平台和击退，防覆盖外力 |
| 持续贴地、旋转平台、离台动量 | 先比较现成 motor；缺口未减少或二改扩散则退回 |

ECM2 为有条件商业候选，KCC 需自担兼容维护；按实际包核 API／许可。Unity Character Controller 1.4.5 是 ECS 包，不是 GameObject 即插升级。[一手／研究]

平台跟随、离台、挤压分别定规则，接触点速度计角速度。root motion 交唯一运动控制者经碰撞约束，用实际运动校准步态；接触先验下坡、上坡、旋转平台和受击恢复。契约、反例及成本见 [运动比较](../../docs/research/2026-10-14-game-wp10-client-modules.md#3d-运动补研控制精度接触连续性与物理重量的取舍)。[研究]

#### Unreal：先扩展 CharacterMovement，不搬 Unity 的 motor 调度

**[研究] ✅ 常规胶囊角色先用 ACharacter＋CMC，特殊动作才局部扩展。** 原生已组织重力、模式、平台与更新；沿 movement base 配离台速度，避免双算。动画 root motion／临时 Root Motion Sources 交 Movement Component，技能负责取消／恢复；单次突进不要求 GAS。[一手／研究]

**[一手／研究] 👀 核实至 2026-10-14，UE 5.8 Mover 仍 Experimental。** 灵活形体、模块化运动或物理回滚确需时才承担迁移；输入须汇入模拟步命令。来源与样例边界见 [UE 对照](../../docs/research/2026-10-14-game-wp10-client-modules.md#5-unreal-对照同样的动作不同的引擎责任)。

## 3. 先验收五条跨模块边界

[研究] 按症状选读；新增内容后的检查均为后续验证设计。

### 场景切换：取消等待不等于取消工作

**[研究] ✅ 设加载所有者与请求代次，旧代结果只收尾。** 保留已有异步路线；Addressables 使用结果期间保留句柄，失败也清理，先处理预取消再创建 handle。[一手]

UniTask 固定适配器默认不在取消时 release，预取消在接管前返回；#649 池复用串线尚无确认修复。高频取消可先用原生完成通知或保留底层等待，由存活所有者收尾；业务 guard 不能保证库内结果身份正确。[一手／研究]

activateOnLoad=false 阻塞异步队列，须单独安排激活；UE-207209 也记录交叉取消仍执行完成回调，目标修复版不等于已修。版本与替代路线见 [取消研究](../../docs/research/2026-10-14-game-wp10-client-modules.md#1-unitask新增自动释放为何仍不能等同完整取消)。

### 资源释放：所有权、驻留、总内存分别看

**[研究] ✅ 按寿命划所有者，只为热点加池／缓存。** 归还时取消、解绑并复位；handle 复制不是新所有权。Addressables 引用归零未必立即释放物理内存，共用 bundle 会影响卸载。[一手]

UE LoadPrimaryAssets 保持到显式卸载，不要求保留返回句柄；PreloadPrimaryAssets 须保留活动句柄，普通 Unload／ChangeBundleState 不影响它。共享菜单由共同所有者协调，无新增工作时返回空句柄仍可完成。[一手／研究]

同时看持有数、实际驻留与峰值，缓存高水位不直接判泄漏。契约见 [所有权对照](../../docs/research/2026-10-14-game-wp10-client-modules.md#资源所有权补比load-与-preload-不能共用退出政策)。

### 旧档升级：版本可读之外还要进度正确

**[研究] ✅ 用稳定内容 ID、schemaVersion／contentVersion 和逐版本迁移，先截一致快照，失败保留唯一原档。** 旧档经过两次内容修改后断言剧情位置、选项、库存和奖励；加载成功不等于玩家进度正确。

ink 恢复剧情位置可能抛错，也可能近似恢复并警告；要捕获 warning 并决定迁移或回退章节。它只适合叙事状态，不代替世界／库存保存。源码反证见 [ink 旧档](../../docs/research/2026-10-14-game-wp10-client-modules.md#3-ink存档格式兼容不等于剧情修改兼容)。[一手／研究]

### 存档复用：借序列化与存储能力，自己决定哪些进度能恢复

**[研究] ✅ 续玩与回到早先选择分开承诺。** 长局先借房间／回合一致边界保存；永久死亡也能续玩，边界太远仍迫使等待就调整。

Unity 保留 DTO＋JsonUtility，字典／树迁移才加兼容 Newtonsoft；UE 保留 SaveGame。Easy Save 的 CreateBackup 会覆盖旧备份，Mindustry 列表只查 metadata：恢复须完整读取与内容校验，失败不回写默认新游戏。[一手／研究]

**[研究] 卡顿先分捕获、序列化和写入。** Unity 后台 JsonUtility 的 DTO 不得并发访问／修改；UE 异步保存仍在 game thread 序列化。保存退出要等本次目标状态的结果，失败保留恢复选择。改关卡时连存储地址与附属进度迁移，来源及断电待测范围见 [存档复用](../../docs/research/2026-10-14-game-wp10-client-modules.md#存档复用补比序列化落盘与玩家恢复分开选)。[一手]

### 模拟输入：保留轻推幅度，再调死区与响应

**[研究] ✅ 保留摇杆幅度，先核原生处理链。** Unity stick 默认有死区，重复 processor 会叠加；勿套键盘 DigitalNormalized。UE 分别核 mapping 与 action modifiers。[一手]

有缺口才调曲线／死区，过大损失微调、过小暴露漂移；换手柄后核回中、低幅、满幅与斜向。SuperTuxKart 降敏反例见 [模拟输入](../../docs/research/2026-10-14-game-wp10-client-modules.md#模拟输入补研轻推幅度与处理链不能丢)。[研究]

### 输入与暂停：先定动作权限，再切输入

**[研究] ✅ 先定模拟与动作权限，再禁用对应输入。** Unity Disable 同步触发 canceled，权限先更新并允许重入，系统取消不能当松手发射；战术暂停可保留下令，世界继续的菜单只转交本地权限。[一手／研究]

持续移动立即恢复还是等回中按动作定；失效缓冲／蓄力清理，已提交命令另处理。UI 不自动挡 gameplay 点击，timeScale 与音频暂停是不同时间域。反例见 [输入交接](../../docs/research/2026-10-14-game-wp10-client-modules.md#输入交接补比消费按下不等于等待松键)。[一手／研究]

反馈短脉冲设时限，旧命中不补播；换设备／退出本局时取消所属玩家旧工作，旧设备仍可达则发送停止。Unity 1.20.1 PauseHaptics 保留速度且不挡后续写入，Reset 清除；UE 用目标 PlayerController 的 Tag／循环／Play While Paused。先修持续写入者，勿停其他玩家，见 [反馈](../../docs/research/2026-10-14-game-wp10-client-modules.md#手柄反馈补研结束暂停与设备交接分开核)。[一手／研究]

### 本地多人：设备归谁，菜单由谁操作

**[研究] ✅ 承诺多人后才按实例接输入和菜单，共享菜单先定谁操作。** Unity 读取 PlayerInput 实例 actions；Gamepad.current 不是玩家身份。独立 uGUI 配各自 UI module／MultiplayerEventSystem，playerRoot 不隔离任意脚本。[一手]

UE 对应 LocalPlayer subsystem 后另核 owning player、用户焦点和视口；AddToPlayerScreen 只管显示。二人同时导航／开关菜单影响错对象时修归属，不再复制 Canvas；见 [多人契约](../../docs/research/2026-10-14-game-wp10-client-modules.md#本地多人补研设备配对与-ui-目标范围分开核)。[一手／研究]

### 设备预算：量最坏场景，不抄通用面数

**[研究] ✅ 从最低设备、分辨率、帧率和加载体验分配预算。** 60 fps 约 16.67 ms，是整帧间隔，CPU／GPU／等待不可简单混加。

Unity 目标设备 Profiler／Frame Debugger、UE Insights 测冷启动、首次技能、峰值战斗与关卡往返，记录帧时间分布、尖峰、驻留／峰值内存、音频、加载及包体；跨关卡重叠与解压缓冲计入。开发构建定位、发布构建复核，持续负载不稳就降档，呈现按[前文](#呈现节奏动作已执行画面仍不顺)。[一手／研究]

### 密集粒子：先找预算花在哪里，再选 CPU 或 GPU

**[研究] ✅ 先分实例／更新与透明覆盖，缩无贡献尾部、大烟片和装饰并发。** Factorio 全透明粒子仍绘制的反例说明少更新不等于少绘制，池也不免活跃成本。

Unity 小型反馈保留 Particle System，大规模呈现才试 VFX Graph；核管线／compute／SSBO，17.3 不支持 OpenGL ES。UE 先用 Niagara Effect Type 缩质量档，GPU 模拟仍有 System／Emitter CPU 开销。[一手／研究]

画质裁剪只影响可省演出；火花改成可点燃碎片后规则留玩法层。性能／内存恶化或提示不完整就退回，来源与迁移成本见 [粒子预算](../../docs/research/2026-10-14-game-wp10-client-modules.md#粒子预算补研模拟规模与透明覆盖不能互相代替)。[研究]

### 首次技能：准备到能回应，而不只是加载完成

**[研究] ✅ 准备下一场遭遇必需的动作／提示。** 分开定位加载、初始化、上传和首绘；未就绪先用明确转场或已准备的等价反馈。

| 热点 | 窄方案与边界 |
|---|---|
| PSO／shader | Unity 6.3 实验性 GraphicsStateCollection 按平台／API 分组采集预热；旧 WarmUp 在 DX12／Vulkan／Metal 不保证完整 PSO |
| 激活／加载末尾 | 分批初始化，integration 与上传分别调；backgroundLoadingPriority 只在 Player 生效，提高可能打断操作 |
| 创建／GC | 先减分配，再实际创建 ObjectPool 实例并设耗尽政策；defaultCapacity 只预留存储，maxSize 不限借出并发 |

UE PSO Precaching 延迟 proxy／默认材质可能使关键预警缺失；先准备必要组件，覆盖遗漏才补 bundled PSO。[一手／研究]

新材质／keyword／画质档补采，用严格变体匹配找缺包；比较冷首发、再发、重启和切档。首发未改善、等待／内存超预算就撤回扩大预热／池，来源与版本反例见 [首发研究](../../docs/research/2026-10-14-game-wp10-client-modules.md#首发帧时间补研从资源已加载到动作可见)。[研究]

### 菜单也是控制的一部分

**[研究] ✅ 有效焦点、当前层处理确认／返回、关闭回原项或后备项，是菜单基线。** 改键保留取消，提示对应绑定，路径失效先修原生。

Unity UI vs Game Input 可借选择恢复，但设备推断不支持混用；提示变化不自动清焦点／退出。uGUI 防背景点击丢选择，Toolkit 重启 UIDocument 后重建焦点；第二个菜单重复逻辑才抽共享层，UE CommonUI 仍需合理 UMG 导航。[一手／研究]

多暂停原因并存时关一层只撤自己的原因；沿 Session 管持有者／加载权限。Celeste 回归与 Thrive 补丁限制见 [菜单研究](../../docs/research/2026-10-14-game-wp10-client-modules.md#菜单补研跨暂停改键与设备切换保住控制)。新增设置页后用真实改键、换设备及返回验收。[研究]

### 动态 UI 变贵：先找谁使它反复重建

**[研究] ✅ 先修重复写入，再分重建与绘制热点。** 确为动态牵连静态区才拆 uGUI Canvas，代价是独立 batching；UI Toolkit 纯视觉移动用 translate／DynamicTransform，真实重排仍走布局。UE 先核 Invalidation，全局启用后局部 Box 不叠加；draw-call 仍紧张才试 Retainer。[一手／研究]

CPU 改善不足，或 GPU、内存、反馈延迟变差就撤回；加数值／动画后核显隐、焦点与点击。CanvasScaler 重复写入反例、版本已修边界见 [动态 UI](../../docs/research/2026-10-14-game-wp10-client-modules.md#动态-ui-补研重建边界不等于停止绘制)。

### 显示正确但拾取偏移：先核位置来自哪里

**[研究] ✅ 先核空间、原点、单位与目标相机／面板，普通按钮沿原生事件。** Unity Toolkit position 已是 panel 坐标、localPosition 属接收元素；uGUI 用对应 RectTransform／事件相机，平面命中未必在矩形内。UE Local to Viewport 的 Pixel／Viewport Position 用途不同。[一手]

额外缩放、裁剪、重显示纹理才补映射；改窗口／小地图后核中心、边缘与区外，原生控件仍偏移先查版本。契约见 [拾取坐标](../../docs/research/2026-10-14-game-wp10-client-modules.md#拾取坐标补研显示变换不能靠-dpi-猜回去)。[研究]

### 新语言也会改变旧内容的显示

**[研究] ✅ 新语言和旧存档名字一起核字库，子集／预填充随内容更新。** 改键样例硬编码也接本地化表；Unity ATG 仅在已有 Toolkit 路线按内存／首次字形目标评估。[一手／研究]

可重译报告存消息身份与类型参数，历史数量留当时值；玩家原文保留，仅有译文不能可靠反推 key。Unity Arguments 不序列化，读档重建；UE FText 转 FString 丢 text history。[一手] 字体与旧报告反例见 [本地化研究](../../docs/research/2026-10-14-game-wp10-client-modules.md#本地化补研新语言与旧名字一起维护)。

### 新语言可读之后，还要能编辑和操作

**[研究] ✅ 分别验字库、塑形、布局和编辑。** Toolkit 6.3 基础 RTL 不足以换行／塑形，复杂文本评估 ATG；稳定 uGUI／TMP 有缺口才试 RTLTMPro。UE 保留 UMG 塑形／方向与 composite font，Kerning Only 不适合阿拉伯语等复杂文本。[一手]

混合名字／数字后核断行、删除与返回；ATG 逻辑光标未必视觉向左。长文先用分页／滚动／详情，手柄须能读完并返回，地图不一概镜像。[一手／研究]

新字体更难读可撤回默认，保住 fallback；仍不可读／不可操作就暂缓语言。Stardew Valley 字体回退及输入差异见 [显示编辑](../../docs/research/2026-10-14-game-wp10-client-modules.md#6-新增语言的显示编辑和布局不能互相代验)与[长文](../../docs/research/2026-10-14-game-wp10-client-modules.md#7-完整长文可达性与字体默认值的撤回)。[研究]

### 对白拖沓：补全文字、推进语音与退出会话分开

**[研究] ✅ 先分补全文字、结束句子、退出会话，沿已有组件配置。** Yarn 的文字／语音信号不同，退出不撤销已发出的玩法命令。[一手]

Firewatch 保护特定关键会话，inkle 短气泡通常自动继续；按内容选择打断、保护／补述和重入。Yarn 3.2.8 开启 endLineWhenVoiceoverComplete 后缺配音也可能结束句子，须有阅读回退。加语言／分支后核事实与选项，阅读不及或信息丢失则撤回相关推进／打断范围；见 [对白研究](../../docs/research/2026-10-14-game-wp10-client-modules.md#对白补研显示完成不等于剧情交付)。[一手／研究]

## 4. 借用的授权边界与升级条件

**[研究] ✅ 收益覆盖集成、授权、升级和二改成本，才扩大依赖。** 接触动画变化先按[对位与兼容范围](assets/animation.md#交互目标二改先对位再判断是否仍是同一个动作)决定复用。

- Unity／包按各自条款；UniTask、ink 为 MIT，Input System 为 Unity Companion License；Addressables-Sample 所核树缺 LICENSE，先作机制参考 [一手／研究]
- Lyra 所核渠道为 UE-Only、Allows usage with AI: No；读公开文档可以，整包交 Agent／复制资源须核逐文件许可 [一手／研究]
- FMOD 免费档与商业条件另核，原生够用不为音质排名引入 [研究]
- Toolkit 6.3 已有 world-space／custom shader／RTL，旧表不能否定；AnimationClip／Timeline 与 Prefab 仍影响迁移 [一手／研究]

来源见 [许可账](../../docs/research/2026-10-14-game-wp10-client-modules.md#6-许可维护与采用边界)。按[跨模块矩阵](../../docs/research/2026-10-14-game-wp10-client-modules.md#7-后续真实验证矩阵)检查取消、重入、旧档与设备；工具另验幂等／撤回，构建另验 AOT／裁剪、路径、资源和权限。[研究]

[研究] 人负责动作、视听与翻译质量；最低设备与二改仍待实测。
