# B-MOBA-HERO-CLIP-CONSUMER-20261106 · 核死亡源进入真实动画器
id: B-MOBA-HERO-CLIP-CONSUMER-20261106
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64
result_branch: relay/b-moba-hero-clip-consumer-20261106

工作线：MOBA。本卡测试与文档已接收；原调用终态未核，不据 accepted 推断本机空闲。

## 目标
已接收 Veyra death-contact 源候选后，先验证真实 Three.js 动画消费者能否保留其接触修正，避免只读 GLB 元数据便声称进入游戏。

## 按哪个 Skill／规格
按 game-content-production §3–4；固定 asset-pipeline/veyra-death-contact、src/render/battle-assets.ts、asset-pipeline/presentation/{motion,adapter}.js、tests/client/hero-source.test.ts、原 heroes/veyra-release 及实际 Three 依赖。原源候选已在 7e1986f；不重生成、不上传 .blend。
1. 先读生产 clip 选择、播放倍率、Root/mesh 变换、死亡冻结和 disposal，记录实际函数/调用；新测试直接调用生产 createMotion/createPresentation 与 sample/inspect/dispose，沿 hero-source.test.ts 的入口，不复制另一套动画器。
2. 只在测试夹具替换为已接收两阵营 GLB；用 GLTFLoader＋AnimationMixer CPU 采样原死亡 clip 的 0/25/50/75/100% 和实际最后一帧，核世界空间足部最低点与源包 check_contact 的坐标口径，解释 Root 变换差异。
3. 检查 idle/walk/attack/hurt 的 clip 身份、时长与非死亡姿态相对原包保持；骨骼、NORMAL、权重与 runtime-fallback 分别记录，不把 fallback 混成可编辑源导出。
4. 实例 A 死亡、实例 B 继续移动、销毁 A 后再建 C，确认克隆骨骼/动作状态不互串。只驱动 CPU mixer，不创建 renderer/AudioContext/canvas/浏览器。
5. 如生产接口无法在不改源代码下调用，交出最窄需导出的函数与证据，保留阻塞，不新写替身宣称生产通过。

## 写入范围
仅新增 tests/client/veyra-contact-consumer.test.ts 与 docs/verification/veyra-contact-consumer.md；原运行资源、源模型、渲染代码与默认选择只读。

## 怎样算做成
真实现行消费者的 CPU 采样与实例隔离证据；明确哪些仅源包检查、哪些真实消费、哪些因接口不可达未验。画面、死亡接地观感、换默认和配套出图仍待 dot 判断。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果

- Build 单元完成：新增消费者测试以已接收两阵营 GLB 为夹具，直接调用生产 createMotion/createPresentation 的 sample/inspect/dispose，验证死亡接触修正（31 个 Root key 最大误差 8.7e-8 m；61 个源采样点世界空间 body/foot 最低点与 check_contact 口径一致）、idle/walk/attack/hurt 保真（15 骨世界矩阵差 <1e-9）及 A/B/C 实例隔离（B 最终姿态与参考差 <1e-9，dispose 后源几何/材质计数为 0）；生产接口无需改源码。实测：新测试 5/5 通过；npm test 572/573 通过，唯一失败为既有无关 tests/client/audio-skill.test.ts（单跑同样失败）；npm run build exit 0；check_contact reproduce 与 tolerance 0.005 均通过，源包 unittest 32 tests OK。未运行：npm run sim、browser-smoke/GPU/音频（无相关改动或合同禁止）。openIssues：无审查遗留；默认采用/换默认、画面与死亡接地观感、heroes recipe 端口、配套出图未做，待 dot-B 判断。
- 产物：[43af65e](https://github.com/dbvv1/MOBA-Like/commit/43af65e88598bad3ca9f9effea35902cf7bd07f8)，分支 `relay/b-moba-hero-clip-consumer-20261106`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：待负责人决定是否按 README Adoption 纳入默认（写入范围外）并安排画面/死亡接地观感的人工验收；本单元无阻塞。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 11-09 负责人接收决定

接收测试与文档到产品 main [6750585](https://github.com/dbvv1/MOBA-Like/commit/6750585)，不切默认／部署。独审修正材质分类优先级并补反例，非死亡轨补时间／插值比较，收窄网格精度结论。当前 main 基线上 89 文件／580 项、双构建、源包 reproduce／0.005 容差与 Python32 通过；旧 audio-skill 失败本次未复现。已回流[实际动画器接触验收](../../../domains/game-dev/assets/animation.md#death-contact-consumer)。

旧源准备已接入 [c907194](https://github.com/dbvv1/MOBA-Like/commit/c907194)：原提交五文件独立摘要、离线提取和消费前核验，快照仅本地；默认与固定源两路 Python39、产品580、内容包7、构建及接触检查通过，独审通过。真实默认采用仍待配方／pin 更新与画面门槛；未跑浏览器／GPU／音频／Blender。原调用退出与 Star 槽 unknown 不变，不重派或清锁。

候选源包配方已接入 [829a5f5](https://github.com/dbvv1/MOBA-Like/commit/829a5f5)：四处 Python 消费入口默认读离线固定快照，候选／fallback manifest 同步原源路径；缺快照不回退、不自动取回。Python42、产品580、双构建、接触检查及独立目录 fallback 重建通过，摘要保持；非作者复核通过。真实 Three 消费测试仍需迁移旧源对照基线，heroes 配方端口、运行采用与画面门槛仍待；本次不改运行资源、不重导 Blender、不占拍摄槽。
