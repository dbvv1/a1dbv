# B-FPS-COMPLETE-ACTION-SOURCE-20261110 · 完整动作供给先补缺口
id: B-FPS-COMPLETE-ACTION-SOURCE-20261110
owner: dot-B
kind: explore
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: e142c074b06236d65ec1383f9677678ef3f0c0af
result_branch: relay/b-fps-complete-action-source-20261110

工作线：AI 全链路制作。对应三案批次计划 F3；产品采用者 dot-B，候选最多2组，不新增泛工具榜。

## 目标
FPS 已有独立蒙皮实例和两类 reload 坐标合同，但完整持枪 idle/移动/开火/换弹以及枪手弹匣接触仍欠。先从既有锁定包核完整供给；不要再做另一套消费者或拿两个 reload 宣称整套动作完成。

## 风格与标准件图像输入
风格沿 FPS 固定 `61572353accd159b5f8effaa3212e35d3224cc67` 的 `docs/brief.md`：风格化战术射击，简化场景、清楚角色轮廓和材质明暗分层，枪/手/弹匣关系可读；不把商业参照资产带入公开产物。
现有本作标准件图定位为同一提交的 `docs/quality/smoke/B-FPS-ART-STANDARDS-SMOKE-20261029/9a5c02fc6b51-eDgeRr/screenshots/art-standards/art-deployment-1.png`；原实现源 `9a5c02fc6b51c852d567cc0d4d28bf388fc41f4b`，对应 `docs/quality.md` 和同目录 manifest。该图是环境标准件初始部署机位，菜单遮挡，不是完整角色/动作标准图，不代表当前5v5品质。
新角色/完整动作的已验同机位标准图仍缺：本卡可核来源、许可与动作覆盖，不凭该环境图批准风格匹配或产品采用。须附候选官方预览并明确视觉待验，最终选择由 dot-B 待真实角色同框图后作出；不另派拍摄、也不生成假游戏截图。

## Skill 与范围
按 domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §3、assets/animation.md 实用段和游戏细则§7内容来源候选。
1. 只读 FPS-Like 78a892c6cf057ddb63b4fc21daafdd7e4313453a 的 asset-pipeline/character-action-sources 原包/manifest/许可与 2e770621a6764bae43d68c1e4f33d28105dd0cf0 的 docs/skinned-character-consumer.md；先列真实 clip、父节点、完整动作覆盖和武器接触参照，不复制来源清单中的自述当GLB事实。
2. 第一候选只限既有 KayKit 作者官方同系列原包与许可页面，核是否包含同骨架持枪 idle、移动、开火和至少一种完整 reload；缺哪项写明。不新登录、付费或请求商业资产。
3. 若第一候选确缺内容，最多补1组 Quaternius 官方免费同风格带完整动作包；附官方来源/逐件许可原文、预览图链接、实际可下载性、动作与单位/朝向/骨架差异。禁止从镜像或第三方重包绕403；失败停止该来源。
4. 输出每组四动作映射表：确有/缺失/未核，枪/弹匣是否有独立节点与接触动作、三角面和材质预算可核值、必要转换及拒绝条件。预览图是来源展示，不是假游戏截图；未看过/未听过如实标注。
5. 给出一个完整供给选择或明确无可采用候选，附针对现有 FPS 接线所缺的最小产物。没有完整供给就建议保原角色，不以新建IK控制器遮掩缺动作。

## 写入与完成
只写 experiments/fps-complete-action-sources-20261110/selection.md 与可公开来源预览；不复制大原包，不改知识正文、原探针、FPS View/消费者、任务或默认分支。规格必须可让 dot-B 决定保留/换供给；非作者核原文、许可和每项实际clip证据，来源不足可交真实否定结果。
公开扫描后仅推本结果分支回 review_ready，不自动合入、不部署、不计覆盖/品质。旧 cancelled 动画任务不恢复，同题旧调用只读、不重派；本单元仅来源缺口，不重复既有父轨道/生命周期验证或广搜。
当前 ready 仅表示规格可执行，未声称运行或产能。
