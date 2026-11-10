# B-FPS-NATIVE-SCENE-CONSUMER-20261110 · 原生动作进入既有场景
id: B-FPS-NATIVE-SCENE-CONSUMER-20261110
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 100d104e98ac41d364374bdc4907b9dd6a8a787b
result_branch: relay/b-fps-native-scene-consumer-20261110

工作线：三个案例，F3动作消费者。采用者dot-B；不是新的公开旁置入口。只补已存在的蒙皮/快照候选到真实View的缺口，不再复制一份View。

## Skill、目标与范围
按 a1dbv domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §4–5、assets/animation.md 原生动作快照段及游戏细则§7模块编码单元。固定接口为 src/render/scene.ts 的现有 View；它服务原1v1，不是离线5v5。可改该文件、新增 src/render/kaykit-scene.ts、tests/kaykit-scene.test.ts、tools/check-kaykit-scene.ts 与 docs/native-scene-candidate.md。不得改client/路由、sim、默认开关、已有蒙皮/动作模块、离线训练View、资产或package。独立于固定源接触诊断卡，不写相同文件。

## 做法已定
1. View构造器新增第四个可选参数 `skinnedLoader?: (signal: AbortSignal) => Promise<KayKitSources | null>`，来源必须含固定Knight原生clips。未传不加载、不注册、不改变原content-set行为；不增加URL参数。复用既有KayKitSkinnedCharacter、KayKitCharacterSlot和syncKayKitNativeAction，不新建动画播放器或改源。
2. 只在活局、非玩家敌方、存活、步枪、无移动/蹲/交互且原生动作成功采样时用新实例显示；所有其他状态沿原contentActor/旧mesh，同一帧只能出现一种身体，不允许隐藏旧角色后下一帧才发现新姿态失败。旧reload接口不变。缺失/歧义clip或采样异常当帧恢复旧角色，info记录错误，不持续重复异常。
3. 每actor独立骨架；真实scene挂载容器按toThree(actor.position)与actorFacing(yaw)，不变更模拟位置/命中盒。不凭自动缩放假定角色视觉高度与命中盒匹配：沿固定源原单位，在native-aim-two-hand归一时间1（固定Knight的稳定瞄准末帧；0是举枪起点，不用于配套尺寸）、容器单位矩阵时，报告完整蒙皮世界AABB的min/max、总高度及与现有站姿头部碰撞顶1.84m的差；本轮不依据尺寸差自动拒收、不自定容差、不缩放资源。此差是供dot-B选定真实视觉比例的未验项，不等于命中盒匹配。枪/弹匣接触及人物朝向需后续画面验收，不声称完整动画完成。
4. 加载期间与失败保持旧显示；dispose abort，晚到结果不挂载；来源资源由调用者持有直到View销毁，实例释放不得dispose共享几何/材质/纹理。actor删除/换队/重开清理实例。原contentActor存在时也遵守显隐优先级，不留ghost。
5. 以既有View的实际render调用验证接线，不用另一个复制View或只测helper冒充。WebGL不可用时可隔离renderer构造，但真实Three Scene、实际View render/旧角色逻辑和骨架须执行；明确该证据仍是CPU，不能替代浏览器。

## 交回与验收
全量npm test、npm run build退出；新增加载失败/晚到、实例移除、支持↔不支持状态、采样失败当帧回退、重复dispose及默认不加载测试。真实固定GLB按tools/check-kaykit-consumer.ts的SHA256取既有样本，不重新下载未知来源；缺样本保全结果不假skip。结果只推本卡分支，交明确变更路径、默认/关闭未变证据与未验清单。
不得启动浏览器/新拍摄、使用桌面或部署；原未知拍摄槽仍未知。dot-B接收后并回同一个100d104e候选（发布前再核其最新后继），再走浏览器/完整smoke/同机位/盲评，不增加现有分数或0/77覆盖。开工核同题写者/调用；未知不重启。

## 当前决定

固定源诊断在Knight中未识别出步枪/独立弹匣，Med_CombatRanged无网格；handslot不是枪械。暂停此卡的场景接线，不把无枪骑士与持枪射击语义一起上屏。枪械来源先复用本仓RX24（见B-FPS-RX24-WEAPON-ONLY-20261110），恢复须完成武器独立导出，dot-B定配套挂点/尺寸和同框验收目标，再改规格；本卡不派执行、不占ready配额。保留已有骨架/快照CPU成果，不删除原包或其他候选。

武器独立导出已接收 `841386e0f584b0989106c369831f0ba3efcbe17e`（1958三角、121224字节），几何前置已消除；仍不能把support-palm-contact当主手骨挂点。剩余由dot-B确定主手/枪轴、尺寸与三动作同框验收目标后重新定型，不据静态几何接受解禁View。
