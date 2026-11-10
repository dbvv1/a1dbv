# B-FPS-RX24-ANCHOR-CONTRACT-20261110 · 区分主掌、常态支撑与抓匣
id: B-FPS-RX24-ANCHOR-CONTRACT-20261110
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 100d104e98ac41d364374bdc4907b9dd6a8a787b
result_branch: relay/b-fps-rx24-anchor-contract-20261110

工作线：AI全流程制作/F3。采用者dot-B，下一消费者为既有Knight挂接候选；不新增枪、角色、旁置或拍摄。任务是把既有枪的三种接触语义做成可直接消费的数据，不能将骨槽代掌心。

## Skill、固定输入与范围
按 domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §3–4、assets/animation.md 与游戏细则§7「内容取得与归一」。
固定RX24原GLB：assets/content-set/fp-arms-rx24.glb，SHA256 e672d06e30262f2575076f759645aa3d82d6734f0c26ef280a2a36870549b9e1；现有weapon-only.glb SHA256 66a2872ed6a1ecb269e80ee7a3c5166fc7d4ebb82318b7b696e3222bfe54087a。
沿该提交src/render/rifle.ts、weapon.ts实际weaponParts('rifle')消费，不另下载。许可沿assets/content-set/LICENSE.txt。
只新增asset-pipeline/kaykit-rx24/anchors.ts、anchors.json、tests/kaykit-rx24-anchors.test.ts；补该目录README一段消费者命令。extract.ts、原manifest、两GLB、src、View、Knight诊断及模拟均只读，不与未知蒙皮掌面单元并写。

## 已定做法
1. 根空间/米制原样保留。三角色分别为primary-palm-center、idle-support-palm-center、reload-magazine-palm-target。不得把现有grip改名或修改其support-palm-contact extras；新数据解释它是抓匣目标，不是常态前护木握持点。
2. 主掌从真实weaponParts的trigger-palm取[.036,-.099,-.19]；常态支撑从support-palm最终值取[-.033,-.044,-.446]，必须包含hands()的y+.025处理；抓匣目标为support.position+gripOffset=[-.03443,-.175014,-.345572]。禁止重复手录一套脱离源值的常量实现；将期待值作为固定输入断言。
3. 用真实GLTFLoader读取固定源，核trigger-hand/support-hand根空间原点与两掌中心对应；用原GLB的grip根空间位置核抓匣目标，若原编码精度有差，报告两值/误差，不偷偷平均或强改源。两掌中心每轴误差阈值1e-5m；仅grip因既有4位小数编码每轴允许5e-5m，固定源实值[-.0344,-.175,-.3456]，不得用此上界放宽其他点；超出失败交回。
4. 输出schema1、固定hash、root='rx24-root'、units='metres'、三语义点、两掌距离、主掌到抓匣距离、muzzle射出轴向及来源依据。muzzle轴只能依据源局部枪轴/几何；未验证的掌面法线/旋转、Knight骨绑定、可接受接触容差保持null，不从一组三维点编造完整frame。
5. build函数返回JSON，CLI仅向stdout打印，接收端重定向到anchors.json；失败不写目标。相同输入两次输出逐字一致。不得有时间戳、本机路径、修改源或隐式下载。

## 验收与恢复
新增测试核三语义不同、y偏移只应用一次、源码与真实GLB一致、错误hash/缺输入/重复或缺挂点非零退出、两次确定性；全量npm test及npm run build退出0，公开扫描与diff审查通过。非作者独立复算至少一个根空间点，不只读作者JSON。
交回文件、commit、真实退出与未验清单。当前不做GPU/浏览器/握持视觉/完整换弹，不改分数或0/77覆盖；只有dot-B接收后可供挂接合同消费。
开工先核本id、同输出写者、已有分支与产物，活跃/unknown则只读进展，不重复启动；任何拒绝不绕过。只快进推结果分支，不自动合默认、部署或申请额外凭据。
