# B-MOBA-HERO-CLIP-CONSUMER-20261106 · 核死亡源进入真实动画器
id: B-MOBA-HERO-CLIP-CONSUMER-20261106
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64
result_branch: relay/b-moba-hero-clip-consumer-20261106

工作线：MOBA。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

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
- 规格已定，待接收端在确认同单元无活跃调用且有空槽后认领；本次未发起模型、桌面或产品运行。
