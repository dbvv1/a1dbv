# B-FPS-RX24-WEAPON-ONLY-20261110 · 复用现有RX24而非再找枪
id: B-FPS-RX24-WEAPON-ONLY-20261110
owner: dot-B
kind: build
status: ready
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 9a5e7d814895bf20b0583c2f65c3de588a708790
result_branch: relay/b-fps-rx24-weapon-only-20261110

工作线：AI全流程制作，F3实际武器缺口；采用者dot-B。不增加另一角色或枪型，不开新运行时旁置。本卡给既有Knight原生动作准备已拥有的枪几何，不能因此报动作接触通过。

## Skill、固定输入与输出
按 a1dbv domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §3–4、assets/animation.md 先核物件段。输入仅 assets/content-set/fp-arms-rx24.glb（188088字节，SHA256 e672d06e30262f2575076f759645aa3d82d6734f0c26ef280a2a36870549b9e1）及原包许可说明；这是既有source b198df6，不下载新包、不付费、不重新生成枪。
只写 asset-pipeline/kaykit-rx24/{extract.ts,README.md,weapon-only.glb,manifest.json} 与 tests/kaykit-rx24.test.ts；不改src/旧资产/package/View/模拟/其他卡文件。格式glTF2 GLB，沿原材质/顶点色，无贴图无需伪造KTX2、UV或LOD。三件保留源几何共1958三角形，导出面数不得超过此数，不减面、不重塑、不任意缩放。

## 规格
1. 先按实际GLB校验唯一节点rx24-root、rifle-static、rifle-magazine、rifle-bolt、muzzle、grip，记录父链与world matrix。特别保留并核对`grip.extras.role = support-palm-contact`，这是支撑手接触点，不是主手握把或通用骨挂点；将此角色逐字写入manifest，不用于擅定右手挂接。不得仅按前缀遍历留下玩家手臂：明确排除support-hand/trigger-hand及其子网格；若手臂/枪械面混在无法安全分离的同mesh里则失败交回，不凭颜色删面。
2. 输出只有枪体、独立弹匣、枪栓和原muzzle/grip挂点。用原根坐标系；拆掉父节点时烘焙或保留完整父变换一次，顶点的根坐标及材质值误差≤1e-6，不把第一人称camera restMount当世界/骨挂点。不得把它直接贴到Knight或自造双手IK。
3. manifest记原hash、每节点源名/源矩阵/输出矩阵、三角数、材质数、byte数、完整bbox与grip/muzzle位置；glTF声明米但实际人体匹配未验。源文件与许可保持逐字不变，输出README引用原许可。
4. 脚本接受显式源/目标参数，错误hash、缺节点/重复节点、无法分离和缺输入必须非零退出且不覆盖已有有效产物；临时文件成功核验后替换。两次重建输出hash一致。用真实GLTFLoader重新读输出核数量/矩阵/顶点/独立弹匣及无手部网格。

## 验收
相关测试、typecheck、源/输出公开扫描及确定性检查退出0；记录实际命令。独立审查根空间顶点与挂点至少各一项。只推本卡分支。此卡不占原未知拍摄槽、不运行浏览器；阵容图、与Knight真实握持/装卸/穿插及风格匹配留后续同机位验收，不计覆盖或品质。dot-B先决定挂接合同再解除native-scene卡阻塞；本卡ready不等于正在执行。
