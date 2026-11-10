# B-STAR-SHOULDER-PALETTE-20261110 · 海岸路肩同族颜色消费
id: B-STAR-SHOULDER-PALETTE-20261110
owner: dot-B
kind: build
status: ready
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 7fc22e86bc2796f997bfb2b78c86fb00461fae08
result_branch: relay/b-star-shoulder-palette-20261110

工作线：三个案例，S1剩余沙砾路肩；采用者dot-B。只接现有coast开关，不增加第四旁置。规格ready不是正在执行。

## 目标与Skill
按 a1dbv domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §3–5 及 game-quality-pass §2；让现有海岸路肩与已接地表/暖灰墙面同族，保道路、路缘与标线可读。既有生成目标B仅设计参照，不当真实截图。允许的工作不依赖拍摄槽；本单元不出图、不打开浏览器、不操作桌面。

## 固定范围与方案
1. 只改 race.js::chunkMesh 内已有 roadDriving && raceMode==='circuit' && activeTrackId==='coast-reborn' 且 coastalSpaceEnabled() 的 s∈[300,710] 路肩颜色，另新增 coast-shoulder-client.js、tests/coast-shoulder-palette.test.mjs；build.mjs仅接新helper，coastal-space.js仅加disable回退调用。不得改形状、法线、索引、路宽、高度、碰撞、模拟、随机源、地形与其他源文件。
2. 用原绘制语句语义识别表面，不从最终RGB猜分类：横向7.65–11的地面底层及8.6–11的上表面为肩面，11处竖直面为肩壁。肩面色 '#c4b99f'，肩壁 '#a59f89'；均沿原Collector颜色转换一次。公路7内沥青、7–7.65路缘、所有标线、护栏、反光件、11–28平台保持逐字原色。
3. 不加UV、图片、噪声、单三角随机色、灯光/AO或新依赖，不把顶点色称贴图。保持原机械重复与岸坡造型判断留给整层盲评；若实际目标图不支持该配色，交候选供dot-B选择，不能自行换默认。
4. 默认/off、legacy、其他赛道、endless与范围外chunk的完整源几何/颜色输出hash不变；开启时仅指定RGB通道变化，位置/法线/材质标量/索引字节相同。边界300/710以原4m段起点s判定，不切分几何；测试说明端部覆盖。
5. 必须同时处理已缓存chunk的回退，不能只改新建chunk：新helper以mesh为键保存改色前的完整sourceData快照，disableCoastalSpace时调用mesh.dispose()失效旧GPU几何缓存后mesh.update(original)，保留原node/indices；清掉注册表。仅按已有Mesh/Three消费者接口，不改renderer。用真实Collector/chunkMesh测试开关关闭、提前失败、至少两chunk已创建后晚失败、重复disable与重新开启；CPU核原字节和dispose调用，GPU待后续。不得用重开游戏/清存档替代回退。

## 交回
全套相关单测、构建及六路600tick关闭开关hash；记录命令退出。相关真实浏览器/完整smoke/同机位前后图和双非作者盲评由dot-B在原槽核清后做，本任务未跑不得计分/覆盖或部署。
公开扫描并只推本结果分支。开工先核原同题写者/调用，无实际退出则不重复启动；race.js在本单元单写者，其他代理可做不重叠目录。完成接收后dot-B统一原候选分支。
