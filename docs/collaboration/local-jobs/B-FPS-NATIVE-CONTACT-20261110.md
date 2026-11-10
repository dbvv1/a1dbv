# B-FPS-NATIVE-CONTACT-20261110 · 固定源枪手与弹匣接触事实
id: B-FPS-NATIVE-CONTACT-20261110
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 9a5e7d814895bf20b0583c2f65c3de588a708790
result_branch: relay/b-fps-native-contact-20261110

工作线：AI全链路制作，F3剩余接触缺口；采用者dot-B。已知同骨架有aim/fire/reload，不再广搜或重复动作库存。需要回答是否有真实枪/弹匣和可用挂点，不能把骨骼矩阵正确当手握枪正确。

## Skill与固定输入
按 a1dbv domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §3–5、assets/animation.md。输入沿 tools/check-kaykit-consumer.ts：Knight SHA256 60428e3abc09ba83e595d256e3af8c5c976b46cdae599f0802fc82b4a3445168，Med_CombatRanged SHA256 08de5a5fd14dcc7c404b14f7c6ff962f8959503bf70bc00cbf258dbd0187c48d。只用已取得样本；缺失或hash错明确失败，不找镜像、不新增下载或第三方工具。

## 写入范围与方法
只新增 tools/check-kaykit-contact.ts、tests/kaykit-contact.test.ts、asset-pipeline/kaykit-contact/{README.md,result.json}。不改src、package、源模型、场景或另一张native-scene卡文件。
1. 解析真实GLB的node/mesh/skin/animation。列出手骨、候选持枪挂点、武器/弹匣节点实际名字、父子关系、几何与材质引用；名字相似不足以断言物件用途。确认缺少独立武器或弹匣时明确写无可测接触几何，不填0距离。
2. 在原生2H_Ranged_Aiming/Shoot/Reload每clip归一时间0、.25、.5、.75、1更新完整祖先world矩阵；保存左右手位置及真实可识别武器/弹匣节点的位置。若对应几何可识别，报告手骨点到其世界AABB的距离，标注这不是掌面接触/穿插判断；没有几何则用null+reason。不得依据距离直接给“通过/握持正确”。
3. 同一源两遍运行JSON一致；全结果须带原hash、clip名/duration、采样time、单位来自源或unknown。负例覆盖缺样本/hash错误/找不到clip或关键节点；不能用空列表成功。
4. 结论限定为三选一：现成节点足够可进入场景视觉验收；缺独立物件需选择配套物件；证据不足待实际姿态图。写清下一动作与所缺物件，不新做IK、不重定向、不发明接触数据。

## 完成标准
独立检查读取真实result并对一个样本复算；相关测试和typecheck退出0，公开扫描；回本分支，不合默认/不部署。此卡无GPU/截图/盲评，不能提高内容覆盖。后续与同机位人物图一起由dot-B决定采用，不因CPU成功宣称整套角色动作完成。

## 当前接收

固定输入实际15姿态采样两遍一致，专项3项及typecheck退出0；完整节点/mesh/skin/clip库存已交回。Knight只识别到剑盾等15个网格节点，运动包无网格；未识别出步枪或独立弹匣，contact距离为null而非0。采用固定源事实和复跑工具，不接受为画面/握持验收。来源确认后再推进场景接线；现有CPU动作成果保留，不换默认。非作者对真实源左手位置独立复算最大误差0、完整诊断JSON逐字一致。产物：[2e6559f9](https://github.com/dbvv1/FPS-Like/commit/2e6559f9d8f4bfcd1e9f6c34f8d3c386128bd69f)，已并回同一蒙皮候选；默认与网站不动。下一步复用原RX24独立枪/弹匣，见武器分离卡，不新增来源广搜。
