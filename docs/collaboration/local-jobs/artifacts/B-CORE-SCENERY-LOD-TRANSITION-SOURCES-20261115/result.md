# 路肩标准件跨观察距离 LOD 切换：候选来源清单与渠道覆盖

<a id="toc-conclusion"></a>
## 结论

- **默认先不加 LOD**：无可见反例、无 draw call／FPS 成本证据，或加 LOD 后 FPS 反降，就保持无 LOD（169、197、345）。
- **要加就按 chunk／整批选层**：沿用 geometry＋shadow＋opacity 批次键，不改 batch key，不做逐实例 opacity 淡变；回差带取 10%–15%（4、5、7、15）。
- **第一步先找可见反例**：用 `race.js` 的 265 m 硬边界与 `render-three.js` 的 125–460 m 雾，在快速回看路径看路肩轮廓是否跳变或读错路沿（4、6、11）。
- **找到反例再上过渡**：先做硬切＋滞回，不先做淡变（1、2、3、12、14）。
- **确有收益才做淡变**：优先远层单卡或整批过渡；逐实例 opacity 会拆批并转透明材质（4、7、14）。
- **平台前置**：Godot Mobile／Compatibility 没有 visibility-range 淡变；Unity GRD 不支持 animated crossfade、静态合批恒选 LOD0；UE dithered 过渡是逐材质开关（13、17、19、28）。
- **范围**：本清单只做来源采集与链接核对，未运行引擎或游戏；效果结论均来自原文，见[覆盖缺口与未读范围](#toc-gaps)。

> 整理日期：2026-11-18（UTC）。范围：Star-Rush-Reborn 一簇装饰性、非碰撞路肩件在远近切换时保主轮廓、不做近阈来回闪、不能读错实际道路边沿；区分硬切带滞回、淡变双绘与静态批次相容性。本清单汇总 6 路独立来源扫描，只收已记录链接状态与内容核对范围的候选；正文未读／仅摘要／仅 URL 的条目在条目内或附录标注。未新增未核实链接，未运行任何引擎、游戏或浏览器，未取得帧耗、截图或分数。

## 目录

- [结论](#toc-conclusion)
- [决定与筛选标准](#toc-criteria)
- [渠道覆盖表](#toc-coverage)
- [排序方法](#toc-ranking)
- [候选清单（417 项）](#toc-list)
- [最先看的 12 组为什么最值得深挖](#toc-deepdive)
- [按结论槽位选读](#toc-index)
- [覆盖缺口与未读范围](#toc-gaps)
- [附录：读不到的渠道](#toc-appendix)

**最先看 12 组（清单第 1–14 位）：three.js `LOD.update` 的滞回公式、它的阈值回摆原始 issue、Star-Rush 三个真实消费者文件，以及 InstancedMesh/BatchedMesh 的批次限制；再读 Godot 的实现与 Unity／UE 的淡变双绘条件。** 这 12 组同时回答“距离从哪量、回摆门槛怎么设、淡变多画什么、哪些平台没有淡变”。其余候选按直接性递减排列，中文二手摘要与替代路线放在后段。

<a id="toc-criteria"></a>
## 决定与筛选标准

本任务不是“找一个最好的 LOD 方案”，而是判断这批非碰撞装饰件在当前 chunk／InstancedMesh 批次下值不值得加过渡层。排序按以下六条，逐条优先：

1. **直接服务 Star 路肩件**：对象是非碰撞、不承载玩法、不能读错路沿的装饰件；地形、角色、Nanite 级大网格只作旁证。

2. **给出行级证据**：距离选点、往返门槛、哪种淡变有额外绘制、哪种平台或管线不支持，至少命中一项。

3. **服从现有批次接口**：能说明 InstancedMesh、合并几何、BatchedMesh 或 chunk 批次下哪些做法不用拆批、哪些必然拆批。

4. **提供快速回看＋雾遮远层的反例**：雾只能遮“远”，不能替代切换处理；要能找到回看时边界暴露的证据。

5. **支持“保持无 LOD”的停止条件**：无可见反例、无成本证据时可以先不加。

6. **来源层级**：官方源码／官方文档／维护者合并记录 > 一手实测与作者复盘 > 普通用户论坛报告 > 教程摘要或二手转述。

<a id="toc-coverage"></a>
## 渠道覆盖表

下表按最终清单的 417 项归类；同一候选只计一次，计数单位是“候选条目”而不是页面数，数字按每条候选末尾的来源标签统计。收集阶段的原始候选总数未随本批输入给出，链接核对丢弃数记为 unknown。

| 来源类别 | 实际看了什么、怎么取 | 进入候选（项） | 读不到／限制 |
|---|---|---:|---|
| 引擎与库源码 | three.js 固定 SHA `0af9729`（REVISION 180 / 0.180.0）的 `LOD.js`、`InstancedMesh.js`、`webgl_batch_lod_bvh` 与 `webgl_lod` 示例；Godot 固定 SHA `876b290` 的 `renderer_scene_cull.cpp`、`visual_instance_3d.cpp`；Unity URP `LODCrossFade.hlsl`、`Common.hlsl`、Boat Attack 子图；Babylon `scene.pure.ts`；glTF／MSFT_lod 规范；另读 Star-Rush-Reborn 的 `scenery.js`／`render-three.js`／`race.js` 三个消费者文件。raw.githubusercontent.com 与 GitHub `/blob/` 页面逐行读，部分用 `git clone --depth 1` 核文件存在。 | 29 | GitHub REST API 多次触发未认证 60 次/小时限流（同 IP），改用 HTML 与 raw 文件；少数仓库树/评论可能漏读。 |
| 官方文档 | three.js 文档与示例、Godot `visibility_ranges`／`mesh_lod`／`GeometryInstance3D`、Unity 6.3–6.7 的 LOD Group／Mesh LOD／GPU Resident Drawer／URP Asset、Unreal HLOD／Nanite／Skeletal Mesh LODs／Material Properties、Babylon LOD、Cocos 3.8、Khronos MSFT_lod。curl 取 HTML 后转纯文本核原句。 | 67 | `dev.epicgames.com` 的 Dithered LOD Transition 等页由 JS 渲染，只返回目录；`docs.unrealengine.com` 旧域 403；Unity 部分旧 URL 301/404；`threejs.org/docs` 动态页直接 GET 404，改读仓库源码。 |
| 维护者 issue／PR／官方 tracker | GitHub `mrdoob/three.js`、`godotengine/godot`、`godotengine/godot-proposals`、`BabylonJS/Babylon.js` 的 issue／PR 正文与评论；Unity Issue Tracker、Unreal Issue Tracker 的公开条目。REST 限流后改 WebFetch／HTML。 | 50 | Unreal `UE-295919`、`UE-296133`、`UE-221257` 等详情页 403，只能从论坛转述取结论；Unity tracker 只暴露标题，版本／状态／复现步骤读不到；Godot PR #48847 的内嵌 JSON 结构不同，正文与评论未解析。 |
| 第三方仓库与工具源码 | 按 GitHub 搜索、topic 页、awesome 列表与插件市场追到的 three.js／Godot／Unity 插件、impostor 工具、虚拟几何与 LOD 管理器仓库；读 README 与关键源码，并用 `commits.atom` 核最近更新。 | 64 | 部分仓库是 0 星新仓或只有 README；`xraxra/IMP` 404；GitHub 代码搜索需登录，按代码反查引用不完整。 |
| 引擎社区论坛原帖 | Discourse JSON：`discourse.threejs.org`、`discussions.unity.com`、`forums.unrealengine.com`、`forum.godotengine.org`、`forum.babylonjs.com`、`forum.playcanvas.com`、`forum.cocos.org` 的 `/t/<id>.json` 与 `/search.json`；取首帖与回复的 cooked 文本及出站链接。Unity 需浏览器 UA 与 `Accept: application/json`，裸 curl 会 403。 | 122 | Unity Discussions 的 `/search.json` 与 HTML 搜索多次 403「Crawler is not allowed」，只能逐帖读已知主题；部分查询未完成。论坛回复中被移除的 `[Content removed]` 链接无法还原。 |
| 独立开发者实测、博客与问答 | HN Algolia API（`items/<id>` 读评论树）、StackExchange API（含 `filter=withbody`）、dev.to API、个人博客直读（Simon Schreibt、Adrian Courrèges、Catlike Coding、Digital Garden、xmohe、星光咖啡馆等）。 | 30 | `news.ycombinator.com` 条目 HTML 的 TLS 握手失败，评论改走 Algolia；`pheelicks.com`、`bgolus.medium.com`、`shaderbits.com` 正文读不到；Reddit 全域名 TLS 失败。 |
| 中文社区 | 掘金搜索 API 与文章页、B 站搜索／view／reply API、CSDN 搜索 API 与正文、博客园、搜狗微信、知乎引用链。逐词轮换“LOD 闪烁／切换／跳变／滞回／淡入淡出／合批／实例化／远景／行道树”。 | 29 | CSDN 多篇 521 或“订阅专栏”截断，仅标题／摘要；掘金后段 2492 字节挑战页；公众号原文被 antispider／captcha 拦，只有标题与摘要；知乎 API 需登录、专栏 403；少数派搜索 0 条；NGA／3DM 403 或空正文。 |
| 资产、插件、Skill 与 awesome 市场 | Unity Asset Store 的 sitemap 全量索引后 grep LOD／impostor／crossfade，再开商品页；Godot Asset Library `api/asset?filter=LOD`；Fab 搜索；npm registry 搜索；godotengine/awesome-godot 等列表与 Skill 市场目录树。 | 6 | Asset Store 搜索页与评论区由客户端渲染，只能读内嵌 JSON-LD 的少量评论；部分商品页 404 或描述被截断；Fab 只读到标题／JSON-LD 摘要；awesome 列表里 LOD 条目很少。 |
| 论文与技术报告 | Hoppe 的 progressive mesh／geomorph／view-dependent LOD 项目页、CDLOD 论文 PDF（下载后用 pypdf 核标题作者）、SIGGRAPH Nanite／NanoMesh、Wyman & McGuire hashed alpha、UCSC 非平面 impostor 论文、NVIDIA GPU Gems 与 GDC 材料。 | 12 | SIGGRAPH 2021 Nanite 演讲链接 TLS 失败；GDC 2018 PDF 与部分 NVIDIA 材料 403；UCSC 论文只读首页摘要。 |
| 其他官方／厂商博客 | Cesium 官方博客与 3D Tiles API、Bevy 作者的 virtual geometry 文章、assetsforthreejs 的 London terrace 指南等。 | 8 | elopezr 被域名安全校验拦截（正文未读）；assetsforthreejs 的 benchmarks 页同样被拦；couchlearn 只作转引。 |

上表按每条候选末尾的来源标签统计：`discourse.threejs.org` 原帖一律计入“引擎社区论坛原帖”，不再计入“官方文档”；两类合计仍为 189 项（官方文档 67 含第 47 项“仅 URL”1 条，论坛 122 含 discourse 原帖 29 条）。

六路收集角度与实际取法（对应上表的来源）：

- **官方团队与高质量项目**：读固定 commit 源码、官方文档与示例、维护者 PR 讨论、官方 demo 仓库，以及作者逐帧分析。

- **头部覆盖**：GitHub `/search/repositories`（stars 与 updated 双排序）、topic 页、awesome 列表、插件与 Skill 市场；逐项对照 a1dbv 文档，LOD 只作为资产生产出现（`domains/game-dev/assets/3d.md` 的视距／屏幕误差、`docs/research/2026-10-14-game-wp3-3d-assets.md`），没有 LODGroup／CrossFade／visibility range／impostor／实例化 LOD 条目；任务文件自身引用的 three.js 与 Godot 源码不计重复。

- **英文从业者与技术社区**：HN Algolia、StackExchange、dev.to、个人博客与 GDC 材料；正反都读，未把搜索摘要当证据。

- **中文社区**：掘金／知乎／少数派／B 站／公众号／即刻，兼扫 CSDN／博客园；能读正文的读正文，读不到的标“仅摘要”。

- **真实使用中的问题与反馈**：引擎仓库 issue／PR、官方论坛、插件市场评价与普通用户抱怨；对候选逐个 GET 检查链接状态与可读范围，正文未读项在条目内标注。

- **近 3 个月新东西**（2026-08-18～2026-11-18）：HN `search_by_date`、GitHub `created/pushed` 排序、three.js 与 Godot 的新 PR／issue、官方文档更新、arXiv；负结果是没找到新的滞回实现，Godot 4.8 beta 与 Godot PR 没有 LOD fade 变化。

<a id="toc-ranking"></a>
## 排序方法

清单先放 60 项核心直证，顺序为：three.js 的滞回公式与原始讨论 → Star-Rush 三个消费者文件 → InstancedMesh／BatchedMesh 的批次边界 → 官方示例里的雾 → Godot 的硬切滞回与平台限制 → 中文里最贴近本题的两篇 → Unity／UE 的淡变双绘与平台条件 → 快速回看＋雾的反例 → 距离选点的坑 → 多实例／MultiMesh 的整批限制。第 61 位起按同一评分排序：官方源码与文档优先，其次维护者记录与一手实测，再是普通论坛报告，最后是教程摘要、二手转述与外围工具；连续 LOD／Nanite／impostor 等替代路线整体后置，避免把“换技术栈”误当成“给路肩件加过渡”。

<a id="toc-list"></a>
## 候选清单（417 项，按优先级排序）

### 第 1–60 位：核心直证与首批官方文档

1. **[three.js LOD.update：zoom、距离阈与 visible 滞回](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/src/objects/LOD.js#L245-L292)** — 官方实现按 `distance = 相机距离 / camera.zoom` 选层，且仅当某层已可见时才把该层阈值乘以 `(1 - hysteresis)`，给出可直接照搬的硬切滞回公式。 〔源码〕
2. **[three.js issue #14565: LOD 加滞回的请求](https://github.com/mrdoob/three.js/issues/14565)** — donmccurdy 给出直接的 d-ε→d+ε→d-ε 例：50 m 升到 LOD2 后，要退到 55 m 才回 LOD3；讨论还区分了阈值抖动与‘任何位置都不该来回切两次’，是往返门槛的原始依据。 〔issue/PR〕
3. **[three.js PR：LOD 增加 hysteresis 选项](https://github.com/mrdoob/three.js/pull/14566)** — 维护者合并的 `LOD.hysteresis`（默认 0，进入 r147），讨论与提交记录说明它就是为避免 LOD 边界闪烁而加。 〔issue/PR〕
4. **[Star-Rush-Reborn render-three.js（批次键、opacity 与雾）](https://github.com/dbvv1/Star-Rush-Reborn/blob/2f10cf9b0b8b5a83fcc28968113fdd4b0702af18/render-three.js#L34-L36)** — 批次按 geometry+shadow+opacity 分组、每组一个 InstancedMesh（第 34 行）；逐实例 opacity 会拆批并转透明材质（`depthWrite=false`，第 36 行）；[雾为 125–460 m](https://github.com/dbvv1/Star-Rush-Reborn/blob/2f10cf9b0b8b5a83fcc28968113fdd4b0702af18/render-three.js#L13)。这是‘淡变破坏现有批次键’的代码证据。 〔消费者源码〕
5. **[Star-Rush-Reborn scenery.js（真实消费者）](https://github.com/dbvv1/Star-Rush-Reborn/blob/2f10cf9b0b8b5a83fcc28968113fdd4b0702af18/scenery.js#L79-L80)** — 装饰路肩件按 40 m chunk 生成（第 79–80 行），每个 key 经 [`scenicMesh` 缓存与合并](https://github.com/dbvv1/Star-Rush-Reborn/blob/2f10cf9b0b8b5a83fcc28968113fdd4b0702af18/scenery.js#L4)，无任何距离 LOD/淡变；改动必须围绕 chunk/批次而非单件，符合任务要求核对象所有权。 〔消费者源码〕
6. **[Star-Rush-Reborn race.js（可见性带）](https://github.com/dbvv1/Star-Rush-Reborn/blob/2f10cf9b0b8b5a83fcc28968113fdd4b0702af18/race.js#L63-L107)** — circuit 预建全部 chunk（第 63 行），渲染时只跳过与玩家相差 >265 m 的 chunk，阴影只在 <90 m（第 107 行）；这是硬可见性带而非 LOD。回看 125–265 m 的 chunk 只被雾部分覆盖，<125 m 完全无雾，可构造快速回看的反例。 〔消费者源码〕
7. **[three.js InstancedMesh 源码：单 geometry + count](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/src/objects/InstancedMesh.js#L37-L85)** — 官方实现中一个 InstancedMesh 只有一个 geometry 和 `count`（绘制前 N 个实例），没有逐实例几何/LOD 槽；现有 InstancedMesh 批次要切 LOD 只能拆批或改用 BatchedMesh。 〔源码〕
8. **[three.js 官方示例 webgl_batch_lod_bvh：批次内逐实例 LOD](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/webgl_batch_lod_bvh.html#L120-L145)** — 官方示例在 BatchedMesh 上做逐实例 LOD：每个几何 5 级，`addGeometryLOD` 阈值 50/100/125/200，并带 `useLOD` 开关，展示静态批次里切 LOD 的现状做法。 〔源码〕
9. **[@three.ez/batched-mesh-extensions README：共享顶点数组约束](https://github.com/agargaro/batched-mesh-extensions)** — 上面官方示例所依赖的扩展明确“目前只能添加共享同一顶点数组的 LOD”，直接说明批次内换 LOD 的几何/索引限制。 〔仓库/工具〕
10. **[three.js PR：BatchedMesh 内置 LOD 被关闭](https://github.com/mrdoob/three.js/pull/32369)** — 维护者以“用例太专门、需先与 webgl_batch_lod_bvh 做性能对比”为由关闭核心内置 BatchedMesh LOD，说明官方不打算内建该能力。 〔issue/PR〕
11. **[three.js 官方示例 webgl_lod：距离档 + 雾](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/webgl_lod.html#L45-L90)** — 官方示例用 50/300/1000/2000/8000 的世界距离档，`addLevel` 不传 hysteresis，只靠 `THREE.Fog(0x000000, 1, 15000)` 遮住远层，正是“快速回看靠雾遮远层”的反例素材。 〔源码〕
12. **[Godot 源码：_visibility_range_check 的滞回实现](https://github.com/godotengine/godot/blob/876b290332ec6f2e6d173d08162a02aa7e6ca46d/servers/rendering/renderer_scene_cull.cpp#L2759-L2827)** — 硬切滞回由当前 viewport 状态翻转 begin/end offset 实现，可据此写出 `d-ε → d+ε → d-ε` 的回摆判定示例。 〔源码〕
13. **[Godot 源码：淡变仅 Forward+ 的构建期警告](https://github.com/godotengine/godot/blob/876b290332ec6f2e6d173d08162a02aa7e6ca46d/scene/3d/visual_instance_3d.cpp#L516-L536)** — 源码在构建期警告 visibility range transparency fade 仅在 Forward+ 可用，Mobile/Compatibility 没有该淡变。 〔源码〕
14. **[Godot 官方文档：Visibility ranges](https://docs.godotengine.org/en/latest/tutorials/3d/visibility_ranges.html)** — 官方定义 begin/end margin 在 Disabled 模式下就是滞回、在 Self/Dependencies 模式下变成 alpha 淡变，并注明只支持 alpha 淡变、建议用材质 distance fade 抖动替代但有排序问题。 〔官方文档〕
15. **[LOD 与视锥体裁剪：大规模场景管理策略（Three.js 3D 渲染技术专题，xmohe）](https://xmohe.com/techie/special/threejs-3d/07-lod-frustum-culling)** — 最贴近本题的中文 Three.js 文章：明确说内置 LOD 不带迟滞，给出 10%–15% 回差带（降级按 100%、升级回到 85%–90%）、交叉淡化 0.1–0.2 s 期间同时画两份几何体，并指出实例化把整批压成一个包围球、与逐对象 LOD/剔除天生对立，BatchedMesh 只保留逐子包围盒但不解决精度分级。 〔实测/博客〕
16. **[Level of Detail \| 星光咖啡馆](https://starlightcafe.cn/2023/05/28/RenderingAcceleration/lod/)** — 同篇 LOD 综述的可读中文版：离散硬切会产生突跃；Blend 在短时间内同时渲染两个 LOD，开销大于单层、违背 LOD 初衷；Alpha LOD 只保留一个实例渐隐；另有滞回专节，并明确本文不做平台/显存分析。 〔实测/博客〕
17. **[Unity Mesh LOD introduction：Static batching 永远用 LOD0](https://docs.unity.com/en-us/engine/6000.6/manual/analysis/graphics-performance-profiling/lod/mesh-lod/mesh-lod-introduction)** — 明确 Static batching 不支持 Mesh LOD 选择、永远画 LOD0；cross-fade 只在开 GPU Resident Drawer 时可用且不支持自定义过渡区，是静态批次路肩件的关键限制。 〔官方文档〕
18. **[Unity Mesh LOD：Introduction](https://docs.unity.com/en-us/engine/current/manual/analysis/graphics-performance-profiling/lod/mesh-lod/mesh-lod-introduction)** — 官方列出 Mesh LOD 的硬限制：静态批处理/粒子/VFX 恒用 LOD0，cross-fade 仅 GPU Resident Drawer，Skinned 不生成有效档，instanced draw 必须 forceMeshLod。 〔官方文档〕
19. **[Unity GPU Resident Drawer：Animated cross-fading 不支持](https://docs.unity.com/en-us/engine/6000.6/manual/analysis/graphics-performance-profiling/in-urp/reduce-draw-calls-urp/reduce-rendering-work-on-cpu/gpu-resident-drawer)** — 该 BRG/GPU instancing 路径不支持 animated cross-fading，会回退为静态距离 cross-fade，并列出 Forward+/材质/探针等批次条件，回答“批次内做平滑 LOD”能走多远。 〔官方文档〕
20. **[Unity issue UUM-91634：GRD 下 Animated Cross-fading 失效](https://issuetracker.unity3d.com/issues/animated-cross-fade-on-lodgroups-doesnt-work-with-gpu-resident-drawer)** — 官方 issue 确认 Animated Cross-fading 在 GPU Resident Drawer 下不生效，决定“静态批次 + 动画淡变”不能同时成立。 〔issue/PR〕
21. **[Unity Issue Tracker: LOD Group CrossFade Animate Cross-fading 在 GRD 下不淡（#15625）](https://issuetracker.unity3d.com/issues/the-lod-group-crossfade-animate-cross-fading-feature-does-not-fade-when-the-gpu-resident-drawer-is-enabled)** — 这是论坛镜像帖 1727938 对应的原始 issue，记录 GRD 开启后 Animated Cross Fade 完全不工作的官方结论。 〔issue/PR〕
22. **[Unity GPU Resident Drawer（URP）](https://docs.unity.com/en-us/engine/current/manual/analysis/graphics-performance-profiling/in-urp/reduce-draw-calls-urp/reduce-rendering-work-on-cpu/gpu-resident-drawer)** — 官方确认 GRD 不支持 LOD Group 动画 crossfade，会退回静态距离 crossfade；GRD 本身不支持 OpenGL ES/VisionOS，决定哪些平台不能指望淡变。 〔官方文档〕
23. **[Unity Discussions：Mesh LOD crossfade 只在 GRD 路径可用](https://discussions.unity.com/t/1732452)** — Unity 员工确认 Mesh LOD 的 crossfade 依赖 GRD，而 GRD 不支持 SkinnedMeshRenderer，因此骨骼网格只能硬切。 〔论坛原帖〕
24. **[Unity LOD Group 组件参考：Fade Mode 与屏幕尺寸阈](https://docs.unity.com/en-us/engine/current/manual/analysis/graphics-performance-profiling/lod/lod-group/class-lodgroup)** — 官方组件参考给出 None/Cross Fade/SpeedTree 三种 Fade Mode、`Transition (% Screen Size)` 屏幕尺寸阈与 `Fade Transition Width` 的语义。 〔官方文档〕
25. **[Unity 官方步骤：让 LOD Group 过渡平滑](https://docs.unity.com/en-us/engine/current/manual/analysis/graphics-performance-profiling/lod/lod-group/lod-transitions-lod-group)** — 官方说明 Cross Fade 时同时渲染当前与下一 LOD，用 `unity_LODFade`/`LOD_FADE_CROSSFADE` 混合，并可选择阈前过渡宽度或阈后单次时长（`crossFadeAnimationDuration`）。 〔官方文档〕
26. **[Unity 官方总览：Introduction to LOD](https://docs.unity.com/en-us/engine/current/manual/analysis/graphics-performance-profiling/lod/level-of-detail)** — 官方一句“默认一次只显示一个 LOD、切换明显且突然；cross-fading 同时渲染两层并混合”，可直接作为双绘成本证据。 〔官方文档〕
27. **[Unity 官方手册：LOD Group component reference](https://docs.unity3d.com/6000.0/Documentation/Manual/class-LODGroup.html)** — 官方承认 cross-fade 会同时渲染当前级和下一级，实际用屏幕空间 dithering 或透明度实现；阈值按屏幕高度占比而非距离，并有按时间与按宽度两种过渡区。 〔官方文档〕
28. **[UE 官方材质属性：Dithered LOD Transition](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-properties)** — 官方材质属性表写明 Dithered LOD Transition 是"该材质渲染的网格是否支持抖动 LOD 过渡"的逐材质开关，说明抖动淡变不是无条件全局能力。 〔官方文档〕
29. **[Unreal Dithered LOD Transition 官方文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-dithered-lod-transitions-in-unreal-engine)** — 给定 HISM 帖说 cluster culling 依赖该材质开关，官方页给出抖动淡变的设置入口（正文由 JS 渲染，仅核到 URL 可访问）。 〔官方文档〕
30. **[Unreal Forums: Dithered LOD 同时渲染两套 LOD 的机制](https://forums.unrealengine.com/t/2709319)** — 官方/社区解释 dithered 过渡会同时渲染两套 LOD，共用同一屏幕空间抖动阈值，fade-in 那份取反，靠 TAA 累积成半透明；PCG 大块网格想淡出只能走 alpha test，作者认为不对。 〔论坛原帖〕
31. **[Unreal Forums：正确按距离淡出网格 / Dithered LOD 双绘制](https://forums.unrealengine.com/t/is-there-a-proper-way-to-fade-out-meshes-with-distance/2709319)** — Epic 支持回复：Dithered LOD Transition 期间引擎同时渲染两个 LOD，用屏幕空间 dither 阈值交叉；PCG 块消失要用 Instance Start/End Cull Distance 加 dither，而非只靠雾。 〔论坛原帖〕
32. **[Unreal Forums: Dithered LOD 要求所有材质槽都开启](https://forums.unrealengine.com/t/2340365)** — 静态网格多材质时，只要任一（甚至未使用的）材质槽没开 Dithered LOD Transition，整个过渡就失效；这是很容易漏掉的资产配置陷阱。 〔论坛原帖〕
33. **[Unreal Forums: Dithered LOD 不考虑 FOV](https://forums.unrealengine.com/t/2601486)** — 只改 FOV 不触发抖动，FOV+移动同时发生时切换很突兀，官方立案 UE-295919；历史修法是让 LODDistanceFactor 与投影矩阵进 temporal 状态。 〔论坛原帖〕
34. **[Unreal Forums：Dithered LOD 不考虑 FOV](https://forums.unrealengine.com/t/report-issue-where-dithering-lod-transition-does-not-consider-fov/2601486)** — dithered LOD 不随 FOV 变化触发，且 FOV 与相机移动同时改 LOD 时切换很别扭；屏幕尺寸选点必须把视场/投影矩阵算进去。 〔论坛原帖〕
35. **[Babylon.js 官方 LOD 文档：只有距离/屏幕覆盖率](https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD)** — Babylon 官方 LOD 只提供距离或屏幕覆盖率阈值与 `useLODScreenCoverage`，没有淡变或滞回参数，是“不做淡变”的成熟引擎对照。 〔官方文档〕
36. **[Khronos glTF MSFT_lod 扩展：阈值提示而非淡变规范](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/MSFT_lod/README.md)** — 该厂商扩展只定义 `ids` LOD 链和 `MSFT_screencoverage` 阈值提示，不规定淡变或滞回，说明阈值可放在屏幕覆盖率而非世界距离。 〔源码〕
37. **[GTA V Graphics Study Part 1：alpha stippling 做 LOD 过渡](https://www.adriancourreges.com/blog/2015/11/02/gta-v-graphics-study/)** — 逐帧分析记录 GTA V 用 alpha stippling 抖动让不透明网格在 LOD 过渡时显得半透明，并在后处理中平滑抖动伪影，展示 dither 的真实代价。 〔实测/博客〕
38. **[GTA V Graphics Study Part 2：LOD 流送与 pop-in](https://www.adriancourreges.com/blog/2015/11/02/gta-v-graphics-study-part-2/)** — 作者分析记录远处 LOD/资产流送仍会 pop-in，以及飞行时主动降低 LOD 的选项，说明运动状态会改变选层而不只取决于距离。 〔实测/博客〕
39. **[Simon Schreibt：刺客信条 3 的 LOD Blending](https://simonschreibt.de/gat/assassins-creed-3-lod-blending/)** — 硬切最便宜（同一时刻只画一个 LOD）；平滑 alpha 要让新旧两个物体同时画至少整个混合期，且与雾冲突——新 LOD 可能不带雾、变不透明时突然‘跳进’雾里；AC3 改用 alpha-test 噪声溶解。 〔实测/博客〕
40. **[Unity Discussions: 雾能遮 LOD popping 但不提性能](https://discussions.unity.com/t/888565)** — Unity 员工回复：雾本身不提性能，但能遮住低 draw distance 和 LOD popping；这是“用雾遮远层”做法的直接依据，也说明它只是视觉遮挡。 〔论坛原帖〕
41. **[Unreal Forums: 低/中画质档雾消失，靠雾遮 pop 的体验坏掉](https://forums.unrealengine.com/t/2651715)** — 低/中画质档雾直接消失，依赖雾来“hide render popping”的体验全坏；正是“快速回看加雾遮远层”的反例：雾可被画质/平台关掉，不能当 LOD 契约。 〔论坛原帖〕
42. **[HN：LOD 提高 draw distance 却又被雾遮回去](https://news.ycombinator.com/item?id=7372479)** — 质疑：LOD 本为提高 draw distance，却又用雾把距离遮回去，等于抵消 LOD 收益；是对‘用雾盖住远层’的直接反例。 〔实测/博客〕
43. **[HN：雾应保留用于平滑远景淡出（反方）](https://news.ycombinator.com/item?id=7374293)** — 反方：雾应保留，用来让远景平滑淡出而不是突然消失，且是廉价空间深度线索；两方对照说明雾只能遮‘远’，不能替代切换处理。 〔实测/博客〕
44. **[HN：LOD popping 与顶点 morph](https://news.ycombinator.com/item?id=7372406)** — 动态 LOD 的 popping 是常态；把顶点在短时间内从低模位置 morph 到高模位置，人眼更难察觉；还提醒错误的启发式（Nyquist）会选错距离。 〔实测/博客〕
45. **[three.js PR #18557：LOD 计入 camera.zoom](https://github.com/mrdoob/three.js/pull/18557)** — 现在 LOD.update 里 distance / camera.zoom 的来源；说明不补偿 zoom 时拉近镜头仍会选到低模，是把距离阈和镜头参数混在一起的坑。 〔issue/PR〕
46. **[three.js PR #35560：LOD 距离改测包围球表面](https://github.com/mrdoob/three.js/pull/35560)** — 2026-11-17 合并到 dev、目标 r188；把 MeshletDrawingPipeline 的 LOD 误差距离从包围球中心改为 max(0.01, centerDistance - radius)，修复大网格/相机在球内时过早选粗 LOD，正对“路肩件枢轴离可见几何很远”的距离选点问题。 〔issue/PR〕
47. **[three.js 官方文档 LOD](https://threejs.org/docs/#api/en/objects/LOD)** — 文档页已改版 404，语义改由固定 SHA 源码（第 1 项）核对；官方 API 把 hysteresis 作为 LOD 的公开属性，说明阈值回摆的默认值和参数位置。 〔官方文档·仅 URL〕
48. **[three.js 论坛：LOD + Instancing](https://discourse.threejs.org/t/lod-instancing/20524)** — 一个 InstancedMesh 单 draw 不能逐实例换几何；要按 LOD 分多个 InstancedMesh 并自写逐块剔除，评论给出按 chunk 检查从 4.5 ms/帧降到 1.3 ms/帧。 〔论坛原帖〕
49. **[three.js Discourse：LOD + Instancing](https://discourse.threejs.org/t/20524)** — 讨论 InstancedMesh 不能按实例改三角形范围，只能按 LOD 拆成多个批次或分块，并用 Babylon.js 的 InstancedMesh 原生 per-instance LOD 作对照，直接说明静态批次方案的约束。 〔论坛原帖〕
50. **[Godot proposal #10669: MultiMesh 的逐实例剔除与 LOD](https://github.com/godotengine/godot-proposals/issues/10669)** — MultiMeshInstance3D 的 LOD 是整批一起切，作者原话‘lod only happens on all instances at same time’；要逐实例需拆 MeshInstance/RenderingServer 或按 LOD 拆 draw，自定义 AABB 只能整批提速。 〔issue/PR〕
51. **[Godot 论坛：MultiMeshInstance3D 的 LOD 行为](https://forum.godotengine.org/t/how-to-enable-lod-scaling-on-multimeshinstance3d-instanced-from-gdscript-and-assigned-plant-res-mesh-from-gdscript/112036)** — 维护者确认 MultiMeshInstance3D 被当作一个 model、所有实例同时换级，说明批量实例无法逐件滞回。 〔论坛原帖〕
52. **[Godot issue #76436：MultiMesh 的 LOD 随相机角度变化](https://github.com/godotengine/godot/issues/76436)** — 记录 MultiMesh 沿相机 Z 轴取 AABB 支撑点导致同距离换视角就跳级的真实案例，并说明整批实例只能共用一个 LOD。 〔issue/PR〕
53. **[Godot #102799 MultiMeshInstance3D fade 不按 AABB](https://github.com/godotengine/godot/issues/102799)** — MultiMesh 的 fade 用节点 origin 而非 AABB，节点离实例远时整片消失但阴影还在，挡住 Terrain3D 的实例 LOD 淡变；4.6 由 #113486 修。 〔issue/PR〕
54. **[three.js 论坛：LOD Editor + InstancedMesh2 阈值](https://discourse.threejs.org/t/lod-editor-meshoptimizer-simplification-lod-thresholds-and-instancedmesh2/97131)** — 用屏幕空间误差（默认 0.8 px）而非固定米距切档，并指出距离/屏幕尺寸阈值在 FOV 或实例缩放变化时要重调；保留 InstancedMesh2 批次，是批次内阈值的最小接口参考。 〔论坛原帖〕
55. **[three.js 论坛：LOD Editor（meshoptimizer + InstancedMesh2）](https://discourse.threejs.org/t/97131)** — 把 simplify-geometry 的阈值编辑器与 InstancedMesh2 放在同一工作流，补“每实例 LOD 阈值怎么调”的操作入口。 〔论坛原帖〕
56. **[three.js 论坛：LOD switching and pivots](https://discourse.threejs.org/t/lod-switching-and-pivots/16426)** — THREE.LOD 用对象世界原点而非包围盒中心算距离，pivot 远离网格的 glTF 会在错误距离切换；维护者建议先把网格居中，是‘距离选点’的具体坑。 〔论坛原帖〕
57. **[three.js 论坛：LOD 阈值到底从哪里量？](https://discourse.threejs.org/t/where-is-threshold-measured-from-in-lod/81339)** — 回复确认 three.js LOD 只用 LOD 对象的世界原点、完全忽略 bounding box，正是长条路肩件或偏心 pivot 会误判切换距离的根因。 〔论坛原帖〕
58. **[Godot issue #55366: fade 开启但 margin=0 仍瞬切](https://github.com/godotengine/godot/issues/55366)** — margin 本身就是滞回；fade 开启但 margin=0 时网格仍瞬间淡入淡出，最终加了编辑器警告。给出‘有淡变必须有死区’的直接实现约束。 〔issue/PR〕
59. **[Godot issue #6375: Add LoD hysteresis](https://github.com/godotengine/godot/issues/6375)** — 滞回请求原文给出‘10 单位出现、13 单位才消失’的 d-ε→d+ε→d-ε 数值例；并指出分屏/VR 多相机让全局滞回难做。Godot 4 最终用 visibility range margins 实现。 〔issue/PR〕
60. **[Godot PR #48847: visibility range and dependencies](https://github.com/godotengine/godot/pull/48847)** — visibility_range_begin/end 加 begin/end margin，margin 即滞回；visibility_parent 支持近细远粗的 HLOD。是 Godot 官方实现层的社区可读说明。 〔issue/PR〕

### 第 61–140 位：官方文档、实现细节与批次约束为主

61. **[three.js webgl_batch_lod_bvh 示例](https://threejs.org/examples/webgl_batch_lod_bvh.html)** — 官方示例；BatchedMesh 装 10 个几何、50 万实例，每个几何 5 级 LOD（4 级由 meshoptimizer 生成），按屏幕高度 8%/4%/3.3%/2% 硬切，BVH 加速视锥剔除与拾取；是最接近“现有批次接口 + 多级 LOD”的现成代码，但无滞回/淡变。 〔官方文档〕
62. **[Godot GeometryInstance3D 类参考：margin 与渲染方法限制](https://docs.godotengine.org/en/stable/classes/class_geometryinstance3d.html)** — 类参考说明 margin 在 Disabled 下是滞回距离、在淡变下是过渡距离，且 Mobile/Compatibility 下淡变退化为“无滞回的 Disabled”。 〔官方文档〕
63. **[Unity Mesh LOD 介绍（6.3–6.7）](https://docs.unity.com/en-us/engine/6000.7/manual/analysis/graphics-performance-profiling/lod/mesh-lod/mesh-lod-introduction)** — 官方文档（2026-11 更新）；明确 static batching 永远选 LOD0、cross-fade 需开 GPU Resident Drawer、Mesh LOD 不支持自定义过渡区；6.5 文档还把 Entities Graphics/GPU instancing 列为不支持，6.6/6.7 已移出——直接回答“静态批次/实例化相容性”的版本差异。 〔官方文档〕
64. **[Unity 文档：GPU Resident Drawer](https://docs.unity3d.com/6000.0/Documentation/Manual/urp/gpu-resident-drawer.html)** — 官方启用条件与兼容特性入口，用于核对 GPU 实例化、LOD crossfade 与批次组合时哪些会回退到非 GRD 路径。 〔官方文档〕
65. **[Godot 官方教程：Visibility ranges (HLOD)](https://docs.godotengine.org/en/stable/tutorials/3d/visibility_ranges.html)** — 官方教程把 Fade Mode 分为 Disabled（用滞回、瞬时切换、性能最好）与 Self/Dependencies（alpha 淡变、强制透明渲染），并给出用多材质做 dither 的具体做法与噪点代价。 〔官方文档〕
66. **[Unity LODGroup.crossFadeAnimationDuration](https://docs.unity.com/en-us/engine/6000.6/script-reference/unityengine/lodgroup/crossfadeanimationduration)** — Animate Cross-fading 的单一过渡时长入口（0 或负值会抛异常），控制阈值后的 fade 持续时间，而不是阈值附近的距离滞回。 〔官方文档〕
67. **[three.js 论坛：A forest of octahedral impostors](https://discourse.threejs.org/t/a-forest-of-octahedral-impostors/85735)** — 200k 树用 BatchedMesh + meshoptimizer LOD（15–100 m）再接 100 m 外八面体 impostor；Usnul 明确说淡变时同时画两个 LOD，‘有一段时间比只画高模更差’，多数引擎不做。 〔论坛原帖〕
68. **[Babylon.js glTF loader 的 MSFT_lod 实现](https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/loaders/src/glTF/2.0/Extensions/MSFT_lod.ts)** — 官方实现按 MSFT_lod 逐级渐进加载，说明该扩展只给 LOD 列表与阈值提示，不含 crossfade 或 hysteresis。 〔源码〕
69. **[Unity 官方文档：SRP Batcher 不兼容列表](https://docs.unity3d.com/6000.0/Documentation/Manual/SRPBatcher-Incompatible.html)** — 列出与 SRP Batcher 不兼容的路径（含 GPU instancing），用来判断 crossfade/实例化与静态批次能否共存。 〔官方文档〕
70. **[PlayCanvas OptiPixel：instancer 选择文档](https://github.com/AlexAPPi/playcanvas-opti-pixel/blob/main/docs/instancing/choosing-instancer.md)** — addLOD(..., hysteresis) 显式滞回加 lodFadeTime 时间型淡变，并区分 Basic/Simple/Hierarchical instancer 的批次与剔除能力。 〔源码〕
71. **[Godot 官方 demo：Visibility Ranges (HLOD)](https://github.com/godotengine/godot-demo-projects/blob/master/3d/visibility_ranges/README.md)** — 官方 demo 给出 20/150/450/1900 距离与 5/50/100 过渡带，明确 hysteresis 更快但更跳，末段靠场景雾让 1900 的淡出不易察觉。 〔源码〕
72. **[three.js 官方示例 webgl_batch_lod_bvh](https://threejs.org/examples/webgl_batch_lod_bvh)** — 维护者在 #32369 中指向的官方替代路径：BatchedMesh LOD 配合 three-mesh-bvh 放在 addon 示例里，说明批次加 LOD 不应进核心。 〔官方文档〕
73. **[UE 官方文档：Skeletal Mesh LODs 的 LOD Hysteresis](https://dev.epicgames.com/documentation/en-us/unreal-engine/skeletal-mesh-lods-in-unreal-engine)** — 官方定义 LOD Hysteresis 只用于避免跨阈值闪烁，且只在"复杂→简单"方向生效，解释回摆门槛应是非对称带而不是对称双阈。 〔官方文档〕
74. **[Unreal Skeletal Mesh LODs（LOD Hysteresis 定义）](https://dev.epicgames.com/documentation/unreal-engine/skeletal-mesh-lods-in-unreal-engine?lang=en-US)** — 官方定义 LOD Hysteresis：只在 complex→simple 生效，值越大滞后越明显；同时给出 LOD 表与屏幕尺寸语义。 〔官方文档〕
75. **[Unity 官方文档：CullingGroup API](https://docs.unity.com/en-us/engine/current/manual/cameras/occlusion-culling/culling-group-api/api)** — 可自选距离带并收 band 变化回调（含只支持包围球、单参考点），但文档没有内建滞回/进出边距，自定义距离选级需自己补回摆门槛。 〔官方文档〕
76. **[Unity 2D billboards for low LOD meshes](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/graphics-performance-profiling/lod/2d-images-lod/applying-2d-billboards-low-lod-meshes)** — 远层用预渲染 billboard 作为 LOD；官方 transitions 页又说明到 billboard 的过渡会回退到 cross-fade（SpeedTree 顶点插值不适用），对应“远层用公告板/雾遮切换”的路线。 〔官方文档〕
77. **[Godot 官方教程：Mesh LOD 与 MultiMesh/粒子](https://docs.godotengine.org/en/stable/tutorials/3d/mesh_lod.html)** — 官方明确 MultiMesh 的所有实例同一时刻共用同一 LOD，且不能逐实例做视锥/遮挡剔除，是“静态批次与逐对象 LOD 不相容”的直接证据。 〔官方文档〕
78. **[drawcall-ai/lod（@drawcall/lod）](https://github.com/drawcall-ai/lod)** — three.js 按屏幕尺寸在简化网格/烘焙网格/impostor 间 dithered 切换，支持实例化；只支持 WebGPURenderer，正好是 Star-Rush WebGL2 批次接口的反例约束。 〔仓库/工具〕
79. **[pmndrs/drei Detailed.tsx](https://github.com/pmndrs/drei/blob/master/src/core/Detailed.tsx)** — R3F 的声明式 LOD 组件，hysteresis 默认 0、每帧 update；说明 three.js 的往返阈需要逐级显式给，不是默认行为。 〔源码〕
80. **[three.js 论坛：100K Procedural Rocks](https://discourse.threejs.org/t/100k-procedural-rocks-brutally-optimized/89578)** — 10 万块程序化岩石用实例化一次画完、无 LOD；是小装饰件‘批次替代 LOD’的实践样本，但帖内只反馈 30 fps 锁定，没有距离切换成本。 〔论坛原帖〕
81. **[Unity Mesh LOD 平滑过渡](https://docs.unity.com/en-us/engine/6000.7/manual/analysis/graphics-performance-profiling/lod/mesh-lod/lod-transitions-mesh-lod)** — 官方 6.7 文档；要平滑须开 LOD cross-fading，并依赖 URP 的 LOD Cross Fade 与 GPU Resident Drawer；是“淡变有额外条件/成本”的平台侧证据。 〔官方文档〕
82. **[three.js 论坛：BatchedMesh LOD（作者说明共享顶点数组限制）](https://discourse.threejs.org/t/batchedmesh-lod/82449)** — 作者自述当前只支持共享顶点数组的 LOD、索引区预留方式与后续支持不同顶点的计划，并演示运行时用 meshoptimizer 生成各级几何。 〔论坛原帖〕
83. **[three.js 论坛：More robust three-mesh-bvh and batchedmesh integration](https://discourse.threejs.org/t/more-robust-three-mesh-bvh-and-batchedmesh-integration/96951)** — gkjohnson 解释 TLAS/BLAS 分工并给出 ObjectBVH 覆盖 BatchedMesh 实例的路径，补足批次 LOD 的剔除与拾取。 〔论坛原帖〕
84. **[Unity 文档：Mesh LOD 的平滑过渡](https://docs.unity.com/en-us/engine/6000.6/manual/analysis/graphics-performance-profiling/lod/mesh-lod/lod-transitions-mesh-lod)** — 官方明确 Mesh LOD 的 cross-fade 依赖 GPU Resident Drawer，绑定骨骼网格不能淡变，是平台/渲染路径限制的一手来源。 〔官方文档〕
85. **[Unreal World Partition HLOD 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition---hierarchical-level-of-detail-in-unreal-engine)** — 官方 HLOD 把远处场景合并为实例化代理，正好对应“整簇装饰件在远距离换成一个合并/卡片代表”的做法。 〔官方文档〕
86. **[Unity GPU Resident Drawer 文档](https://docs.unity.com/en-us/engine/6000.7/manual/analysis/graphics-performance-profiling/in-urp/reduce-draw-calls-urp/reduce-rendering-work-on-cpu/gpu-resident-drawer)** — 官方说明 Mesh LOD 的 cross-fade 依赖 GPU Resident Drawer，解释淡变有额外绘制路径与前置条件。 〔官方文档〕
87. **[Unity Mesh LOD：平滑过渡](https://docs.unity.com/en-us/engine/current/manual/analysis/graphics-performance-profiling/lod/mesh-lod/lod-transitions-mesh-lod)** — 平滑 Mesh LOD 只有一条官方路径：开 GPU Resident Drawer 并在 URP Asset 开 LOD Cross Fade，且不支持自定义过渡区。 〔官方文档〕
88. **[Babylon Scene.customLODSelector（源码）](https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/scene.pure.ts)** — 官方允许每个 mesh 用回调替换默认距离选档（源码 _renderForCamera 内调用），是实现自定义滞回/预算策略的官方钩子。 〔源码〕
89. **[three.js 论坛：Procedural Instanced Forest（统一网格 + 逐树剔除）](https://discourse.threejs.org/t/procedural-instanced-forest-high-performance-real-trees/88610)** — 与 Eternal Ride 同作者的实例化森林，用统一网格加逐树 CPU 剔除做到 2 个 draw call，是“不做 LOD 靠批次与剔除”的实测对照。 〔论坛原帖〕
90. **[Unity：Make LOD transitions smooth in Mesh LOD](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/graphics-performance-profiling/lod/mesh-lod/lod-transitions-mesh-lod)** — Mesh LOD 的平滑过渡前提是启用 GPU Resident Drawer 再开 URP LOD Cross Fade，说明新 LOD 路径与批处理绑定。 〔官方文档〕
91. **[Unity Discussions: SRP Batcher 与 GPU instancing 互斥下的 LOD crossfade](https://discussions.unity.com/t/1609659)** — Quest 3 上大量同款带 crossfade LOD 的 props 想兼得 GPU instancing；回复说 SRP Batcher 与自动 instancing 互斥，只能手动 DrawMeshInstanced/BRG 或 GRD，批次接口与淡变难两全。 〔论坛原帖〕
92. **[Microsoft glTF-Toolkit](https://github.com/microsoft/glTF-Toolkit)** — 把多个 glTF 文件合并成使用 MSFT_lod 的单一资产，属资产侧 LOD 打包；不提供运行时 fade 或滞回。 〔仓库/工具〕
93. **[Unity Issue Tracker: 动态加载对象后 LOD Group Cross Fade 失效（#6079）](https://issuetracker.unity.com/issues/6079)** — 补上“运行时实例化/Addressables 加载”这一触发条件，说明 crossfade 失效不只在 GRD 下发生。 〔issue/PR〕
94. **[Unreal Forums：LOD 变化怎样平滑？](https://forums.unrealengine.com/t/how-to-make-lod-change-smooth-blending/415688)** — 用户反馈 dither 只缓解，极慢靠近仍很难看；同帖称 Unity 的 LOD crossfade 开箱更好、PUBG 也有明显 popping。可作‘硬切+滞回未必够’的反证。 〔论坛原帖〕
95. **[Godot issue #125161: End Margin 对 HLOD 父级不适用](https://github.com/godotengine/godot/issues/125161)** — HLOD 父级用 end margin 做滞回时，子模型在淡出段反而重新出现；无技术回复，只有额外空父级 workaround，说明滞回与 HLOD/批次所有权会互相干扰。 〔issue/PR〕
96. **[Godot forum: visibility_parent + Sprite3D 做 HLOD](https://forum.godotengine.org/t/144691)** — visibility_parent + Sprite3D 的实操：设 margin/Fade Mode 能过渡，但 Sprite3D 不吃这种淡出；社区建议用 visibility ranges 替代自写 impostor 脚本。 〔论坛原帖〕
97. **[Godot PR #53778：3.x 逐相机 LOD 滞回](https://github.com/godotengine/godot/pull/53778)** — 实现细节很具体：bitset 硬编码 32 相机、阴影不遵守 LOD 的 TODO，后被 #85437 取代并关闭。 〔issue/PR〕
98. **[Unity URP Asset：LOD Cross Fade Dithering Type](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.0/manual/universalrp-asset.html)** — URP 的 LOD Cross Fade 提供 Bayer / Blue Noise / 2x2 Stencil 三种抖动，关闭后构建会剥离变体，给出“哪种淡变有额外绘制与变体成本”的官方口径。 〔官方文档〕
99. **[DolphinIQ/LODInstancedViewSystem](https://github.com/DolphinIQ/LODInstancedViewSystem)** — 每个 LOD 建一个 InstancedMesh，用例明写树/路灯；直接对应 Star-Rush 的实例批次，说明硬切可分层、淡变则双批。 〔仓库/工具〕
100. **[Unity 6000.3 LOD Group 参考](https://docs.unity3d.com/6000.3/Documentation/Manual/class-LODGroup.html)** — LOD Group 参考：Fade Mode 的 None/Cross Fade/Speed Tree 与 Fade Transition Width，确认 Cross Fade 在当前级与下一级之间过渡。 〔官方文档〕
101. **[Unity 6000.3 Make LOD transitions smooth](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/graphics-performance-profiling/lod/lod-group/lod-transitions-lod-group)** — URP 资产要显式开 LOD Cross Fade；shader 通过 unity_LODFade/LOD_FADE_CROSSFADE 自定混合，说明“支持”是管线+材质共同条件。 〔官方文档〕
102. **[three.js forum: Grassworks 的 LOD pop-in 修复](https://discourse.threejs.org/t/94175)** — 商业草地系统作者试过多种 LOD 过渡都不满意，先退回即时切换，1.1.0 才用“对应几何＋空间抖动”解决；说明通用淡变在密集小物件上很难直接套。 〔论坛原帖〕
103. **[Unity LOD Group 平滑过渡](https://docs.unity.com/en-us/engine/6000.7/manual/analysis/graphics-performance-profiling/lod/lod-group/lod-transitions-lod-group)** — 官方 6.7 文档；LOD Group 的 cross-fade 会同时渲染当前与下一级 LOD 再混合，直接证明该淡变在过渡带有额外绘制。 〔官方文档〕
104. **[Unity LOD 总览](https://docs.unity.com/en-us/engine/6000.7/manual/analysis/graphics-performance-profiling/lod/level-of-detail)** — 官方 6.7 总览；默认一次只显示一级、切换“noticeable and abrupt”，开 cross-fade 才同时渲染两级——给硬切/淡变对照的官方基线。 〔官方文档〕
105. **[three.js 论坛：Alpha test VS alpha hash（LOD fade 讨论）](https://discourse.threejs.org/t/alpha-test-vs-alpha-hash/44493)** — 社区明确把 alphaHash 用于 LOD 过渡（不透明队列、无需排序、切换不闪烁），并对比 alphaToCoverage、transparent 与 transmission。 〔论坛原帖〕
106. **[Godot BaseMaterial3D：Distance Fade 的 Object Dither](https://docs.godotengine.org/en/stable/classes/class_basematerial3d.html)** — Object Dither 按固定图案丢像素做距离淡出，不开透明、避免排序且部分硬件比 Pixel Alpha 更快，是 visibility range 之外可用的 dither fade 入口。 〔官方文档〕
107. **[Unity shader 变量 unity_LODFade](https://docs.unity.com/en-us/engine/6000.6/manual/materials-and-shaders/shaders/reference/sl-unity-shader-variables#unity_LODFade)** — Cross Fade 把 float4 LOD fade 值交给 shader，自定义材质要自己用两套 LOD 数据消费它，说明跨淡是双绘而非单网格几何渐变。 〔官方文档〕
108. **[Unreal HLOD 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/hierarchical-level-of-detail-in-unreal-engine)** — HLOD 用远处代理网格合并多个 Actor 以降 draw call，页面不承诺淡变，说明官方方案本身可能以代理替换/硬切为主。 〔官方文档〕
109. **[Unity 文档：LOD Group 的平滑过渡](https://docs.unity.com/en-us/engine/6000.6/manual/analysis/graphics-performance-profiling/lod/lod-group/lod-transitions-lod-group)** — 说明 Fade Transition Width 按各 LOD 区间百分比、Animated Cross-fading 改用单一 crossFadeAnimationDuration，以及 SpeedTree 与 billboard 不能顶点插值的例外。 〔官方文档〕
110. **[Unity CullingGroup API 文档](https://docs.unity3d.com/Manual/CullingGroupAPI.html)** — 自定义 LOD 选级的官方入口；论坛回复同时指出自己实现会丢掉 LODGroup 的 dithering 混合，是“自定义距离计算”的代价说明。 〔官方文档〕
111. **[Godot 官方文档：StandardMaterial3D 的 Distance Fade](https://docs.godotengine.org/en/latest/tutorials/3d/standard_material_3d.html)** — 列出 Pixel Alpha、Pixel Dither、Object Dither 三种远距淡出及代价：alpha 混合更贵、会引发透明排序并禁用投影，是“淡变双绘”限制的一手说明。 〔官方文档〕
112. **[three.js Discourse：A forest of octahedral impostors](https://discourse.threejs.org/t/85735)** — 远景树用八面体 impostor 替换时，作者明确说不需要 crossfade/dithering，只要替换时 impostor 屏幕尺寸不大于烘焙分辨率，pop 来自角度分辨率不足；给"远层直接硬切"的反例。 〔论坛原帖〕
113. **[Unity 6.3 官方文档：Mesh LOD](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/graphics-performance-profiling/lod/mesh-lod)** — 6.2→6.3 后 crossfade 停摆的开关就在 MeshLOD 设置里，这份文档用于把 MeshLOD 与 LODGroup 的 Fade Mode 分开核对。 〔官方文档〕
114. **[Epic 官方教程：Smooth apparition of instances with dithering](https://dev.epicgames.com/community/learning/tutorials/oLqa/unreal-engine-smooth-apparition-of-instances-with-dithering)** — 官方教程给出用 DitherTemporalAA/距离阈值让实例整体淡出出现，帖 2709319 用它说明 dithered LOD 是两套 LOD 同绘的机制。 〔官方文档〕
115. **[Unity LOD Group 组件参考](https://docs.unity.com/en-us/engine/6000.7/manual/analysis/graphics-performance-profiling/lod/lod-group/class-lodgroup)** — 集中列出 Fade Mode、Animate Cross-fading、Fade Transition Width 等参数，是给定 Unity 过渡页背后的完整参数契约。 〔官方文档〕
116. **[Unity unity_LODFade / LOD_FADE_CROSSFADE 着色器变量](https://docs.unity.com/en-us/engine/6000.7/manual/materials-and-shaders/shaders/reference/sl-unity-shader-variables)** — 说明 crossfade 混合因子如何进入 shader，自定义材质或静态批次时要核的接口。 〔官方文档〕
117. **[Cocos Creator 3.8 LOD 手册](https://docs.cocos.com/creator/3.8/manual/en/editor/rendering/lod.html)** — 正式版只按 Screen Ratio 切级、没有淡变参数，补 3.7 公测帖之后的稳定行为与限制。 〔官方文档〕
118. **[Unity 6000.0 手册：LOD Group 的淡变模式与 Fade Transition Width](https://docs.unity.com/en-us/engine/6000.0/manual/analysis/graphics-performance-profiling/simplifying-distant-meshes-with-level-of-detail-lod/class-lodgroup)** — 官方补上 Cross Fade 双档同绘、最后一档只淡出、位置阈值 Fade Transition Width 以及 SpeedTree 顶点插值四种行为，可与给定 6.3–6.7 页面对照。 〔官方文档〕
119. **[Unity URP Asset 官方参考：LOD Cross Fade 的三种抖动类型](https://docs.unity3d.com/6000.2/Documentation/Manual/urp/universalrp-asset.html)** — 官方列出 Bayer Matrix、Blue Noise、2x2 Stencil 三种抖动及关闭后剥离 shader 变体，是选择淡变图案和评估变体成本的直接依据。 〔官方文档〕
120. **[three.js 论坛：Hashed alpha testing（远处植被保留细节）](https://discourse.threejs.org/t/hashed-alpha-testing/86294)** — 给出 hashed alpha 让远处树叶不因 mipmap 消失的对照实测，同时指出必须有强 TAA 才稳定，支持“淡变仅适合短暂/远距”的判断。 〔论坛原帖〕
121. **[Unity URP Asset：LOD Cross Fade Dithering Type](https://docs.unity.com/en-us/engine/6000.6/manual/render-pipelines/universal-render-pipeline/urp-reference/universalrp-asset)** — 抖动图案可选 Bayer/Blue Noise/2x2 Stencil，且关闭 cross fade 后剥离全部变体，直接关系视觉图案与构建成本。 〔官方文档〕
122. **[Unity LOD Group 组件参考：Fade Transition Width](https://docs.unity.com/en-us/engine/6000.6/manual/analysis/graphics-performance-profiling/lod/lod-group/class-lodgroup)** — Fade Transition Width 仅在关闭 Animate Cross-fading 时可逐级设置，否则所有级共用一个 transition time，是过渡带宽度与回摆行为的设置入口。 〔官方文档〕
123. **[Unity：LODGroup.crossFadeAnimationDuration](https://docs.unity.com/en-us/engine/6000.7/script-reference/unityengine/lodgroup/crossfadeanimationduration)** — 统一过渡时长的 API 条目，文档指出相机/物体静止时这种过渡更显眼，适合作为硬切与淡变的参数依据。 〔官方文档〕
124. **[Unity：Introduction to level of detail](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/graphics-performance-profiling/lod/level-of-detail)** — 官方成本陈述：cross-fade 期间同时绘制当前与下一级 LOD；并列出 Mesh LOD 与 LOD Group 的取舍。 〔官方文档〕
125. **[Unity URP Asset：LOD Cross Fade 开关](https://docs.unity.com/en-us/engine/6000.3/manual/render-pipelines/universal-render-pipeline/urp-reference/universalrp-asset)** — URP 的 LOD Cross Fade 开关所在页，是核对某平台/管线是否支持淡变的入口。 〔官方文档〕
126. **[Unity Discussions：URP + GPU instancing + LOD crossfade](https://discussions.unity.com/t/urp-shader-graphs-with-gpu-instancing-and-lod-crossfade-possible/1609659)** — Quest 3 上想同时用 SRP batcher、GPU instancing 与 crossfade LOD；回复指出 SRP batcher 与自动 GPU instancing 互斥，需手写 instancing/BRG 并做 A/B 实测。 〔论坛原帖〕
127. **[Unity Discussions：动态实例化 prefab 时 LODGroup crossfade 不生效](https://discussions.unity.com/t/lod-group-cross-fade-effect-is-not-working-when-the-gameobject-is-loaded-dynamically-6079/1726017)** — Addressables/动态实例化 prefab 时 LODGroup crossfade 不生效（#6079）；批次与加载路径会改变淡变可用性，不能只在编辑器静态场景里验。 〔论坛原帖〕
128. **[Godot issue #76774: 移动/兼容渲染器不支持透明度与淡变](https://github.com/godotengine/godot/issues/76774)** — Forward Mobile 与 Compatibility 渲染器完全不支持 GeometryInstance3D 透明度/距离淡变，行为等同 Disabled；仅 Forward+ 可用，是平台不支持淡变的直接证据。 〔issue/PR〕
129. **[Godot Forum：MultiMesh 的 LOD 缩放](https://forum.godotengine.org/t/how-to-enable-lod-scaling-on-multimeshinstance3d-instanced-from-gdscript-and-assigned-plant-res-in-mesh-from-gdscript/112036)** — 社区确认 MultiMeshInstance3D 被当作一个模型，所有实例同一时刻换 LOD；无法逐株淡变，与 three.js InstancedMesh 的限制一致。 〔论坛原帖〕
130. **[Unreal Forums: 实例化 foliage 影子先淡出、mesh 后 cull](https://forums.unrealengine.com/t/1804532)** — 实例化 foliage 的影子先淡出、mesh 后 cull，影子又短暂回来；主 pass 与 shadow pass 的 cull/fade 不一致。 〔论坛原帖〕
131. **[PlayCanvas forum: HierarchicalInstancer 增加 LOD 级间 CrossFade](https://forum.playcanvas.com/t/42206/15)** — OptiPixel 的 HierarchicalInstancer 增加 LOD 级间 CrossFade，shader 里用噪声/平滑过渡；展示在实例化批次里也能做淡变，但属于 addon 而非引擎核心。 〔论坛原帖〕
132. **[Godot issue #91671：Fade Self 在 Depth Pre-Pass 丢阴影](https://github.com/godotengine/godot/issues/91671)** — Forward+ 下 Fade Self 加 Depth Pre-Pass 材质会完全丢阴影，说明淡变会改变透明/深度路径并影响投影，路肩件若有投影需另验。 〔issue/PR〕
133. **[Unity Discussions：实例化模型 crossfade 只淡出旧档、新档 pop](https://discussions.unity.com/t/1496826)** — 同一项目单对象 LODGroup 正常、实例化树模型却只淡出旧档后直接换新档，是“实例化/批次不相容”的现场反例。 〔论坛原帖〕
134. **[Unreal Forums：静态网格 dithered LOD 正常但实例化 foliage 仍 pop](https://forums.unrealengine.com/t/441687)** — 提供“材质已开 dithered LOD Transition、单对象正常、实例化 foliage 仍硬切”的反例，说明材质开关不保证实例路径生效。 〔论坛原帖〕
135. **[dev.to：Lullwood 用 chunked InstancedMesh 画 5,200 棵树](https://dev.to/lullwoodgamer/lullwood-how-many-trees-can-threejs-render-5200-with-chunked-instancedmesh-42n2)** — 5,200 棵树拆 64 个 chunk、每 chunk 自带 InstancedMesh，靠视锥剔除；卸载带用‘超过 3 chunk 才 dispose’的滞回避免边界重建，全程无 LOD，是 chunk 批次 + 滞回停止条件的实例。 〔实测/博客〕
136. **[godot-lod TIPS.md：淡变需要同时画两级](https://github.com/godot-extended-libraries/godot-lod/blob/master/TIPS.md)** — 明确说该 add-on 不能做 LOD 间淡变，因为那需要同时显示两个 LOD 级别；建议用 Object Dither 做距离淡出，是“淡变双绘”成本的直接证据。 〔源码〕
137. **[Unity Graphics：Common.hlsl 的 LODDitheringTransition 与 Bayer 实现](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.core/ShaderLibrary/Common.hlsl)** — 官方源码里可核对 LODDitheringTransition、fadeMaskSeed 与默认 Bayer 图案的生成方式（旧 ScriptableRenderPipeline 路径已 404）。 〔源码〕
138. **[Boat Attack 示例：DitherCrossfade shader subgraph](https://github.com/Unity-Technologies/BoatAttack/blob/master/Assets/Shaders/UtilityGraphs/DitherCrossfade.shadersubgraph)** — 已用 git 树核对存在的 URP 抖动淡变 subgraph，可直接对照 unity_LODFade 的节点接法。 〔源码〕
139. **[Unity URP 源码：LODCrossFade.hlsl](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/ShaderLibrary/LODCrossFade.hlsl)** — 可直接读的抖动裁剪实现：用 positionCS 采样 `_DitheringTexture`，再与 `unity_LODFade.x` 做 CopySign 后 clip，说明淡变实际是屏幕空间抖动而非透明混合。 〔源码〕
140. **[Unity 官方文档：GPU Resident Drawer 的对象兼容条件](https://docs.unity.com/en-us/engine/6000.0/manual/analysis/graphics-performance-profiling/in-urp/reduce-draw-calls-urp/reduce-rendering-work-on-cpu/make-object-compatible-gpu-rendering)** — 官方列出 GRD 兼容条件（DOTS instancing、禁用 MaterialPropertyBlock 等），可用来核查装饰件是否真的进了批次而非静默回退。 〔官方文档〕

### 第 141–240 位：维护者记录、论坛报告与实测为主

141. **[haikais4e21/kam-exp-godot-lod-switcher](https://github.com/haikais4e21/kam-exp-godot-lod-switcher)** — Godot 4.7 最小示例：target_distance ± hysteresis 的 d±ε 区间；但 current_lod 是全局变量、按绝对区间选级，示例本身不能直接当逐级回摆实现。 〔仓库/工具〕
142. **[Babylon Forum：thin instances 与 LOD](https://forum.babylonjs.com/t/thin-instances-with-lod-levels/23872)** — thin instances 只是矩阵、单 draw，明确不支持 LOD；要 LOD 必须回到普通实例或分批，是跨引擎的批次限制旁证。 〔论坛原帖〕
143. **[Unity Discussions: GPU Instancer Pro 只支持根节点单个 LODGroup](https://discussions.unity.com/t/1488733/567)** — GPU Instancer Pro 作者确认 Prefab Manager 只支持 prefab 根节点单个 LODGroup，多个或子节点 LODGroup 不支持；批量实例化工具与 LODGroup 结构强耦合。 〔论坛原帖〕
144. **[Unreal Forums：SkeletalMesh LODHysteresis 与 LODBias 交互 bug](https://forums.unrealengine.com/t/skeletalmesh-lod-hysteresis-is-incorrectly-evaluated-when-lodbias-is-non-zero/2853512)** — 报告给出 Screen Size 0.35、LODHysteresis 0.05，并指出非零 LODBias 下按渲染 LOD 与资产 LOD 混算会把死区改掉；2026-11 的新证据，直接说明阈值、滞回与偏置三者耦合。 〔论坛原帖〕
145. **[Godot issue #88854: Visibility Range Fade 与 Alpha Clip/Hash 冲突](https://github.com/godotengine/godot/issues/88854)** — Alpha Clip/Hash 材质的 visibility range fade 不工作，低模直接 pop、裁剪边缘溶解；维护者称 GeometryInstance3D 透明度不改材质透明模式。淡变只在部分材质路径成立。 〔issue/PR〕
146. **[Godot issue #79471: 可见性用原点、淡变用 AABB](https://github.com/godotengine/godot/issues/79471)** — visibility range 的可见性判定用实例原点、淡变用 AABB 中心，偏移网格会随视角 pop；4.6 改为 AABB 中心。距离选点必须与淡变同源。 〔issue/PR〕
147. **[Godot proposal #5240 dithering blend between visibility range LODs](https://github.com/godotengine/godot-proposals/issues/5240)** — 提案指出 visibility range 的 alpha fade 在过渡时“两套相邻 LOD 必须同时渲染”，想用抖动替代；维护者提出 Self/Dependencies Alpha 与 Dither 五种模式，至今未实现，只能多材质手搭。 〔issue/PR〕
148. **[Godot #114500 4.6 beta 材质 distance fade origin 仍不对](https://github.com/godotengine/godot/issues/114500)** — material distance fade 仍按节点 origin，visibility range 已改 AABB，两者叠加做 LOD 抖动不可靠；用户只能改 origin/自定义 AABB。 〔issue/PR〕
149. **[Godot #58513 Light3D/decal fade 随相机旋转不稳](https://github.com/godotengine/godot/issues/58513)** — Light3D/decal 的 distance fade 用视平面深度，转相机就会让物体进出阈值、闪；GeometryInstance3D 用真实距离不受影响；已由 #71709 修。 〔issue/PR〕
150. **[Godot #59538 淡变期间低模把影子投到高模](https://github.com/godotengine/godot/issues/59538)** — visibility range 淡变期间两套 LOD 都在投影，低模会把影子投到高模上；单一 shadow map 无法按物件排除，说明淡变的额外绘制会带影子副作用。 〔issue/PR〕
151. **[Unreal Forums: SkeletalMesh LOD hysteresis 在非零 LODBias 下失效](https://forums.unrealengine.com/t/2853512)** — UE 的 LODHysteresis 在非零 LODBias 下按 bias 后的 LOD 比较、与资产 LOD 表错位，死区被破坏；说明滞回必须和 bias/缩放入口一起验。 〔论坛原帖〕
152. **[Godot PR #50297：重新实现 dithered alpha](https://github.com/godotengine/godot/pull/50297)** — proposal #5240 依赖的引擎侧 dithered alpha 改动，可核对抖动透明在 Godot 渲染管线里的真实可用范围。 〔issue/PR〕
153. **[Godot proposal #692：3D LOD 总体设计](https://github.com/godotengine/godot-proposals/issues/692)** — 把层级 LOD、跨淡变/抖动、逐视口 LOD bias、多相机难题和 Zylann 的“动画淡出而非纯距离”替代方案放在一处，是可见距离系统的设计源头。 〔issue/PR〕
154. **[QianMo《Real-Time Rendering 3rd》读书笔记：LOD](https://github.com/QianMo/Game-Programmer-Study-Notes/blob/master/Content/%E3%80%8AReal-Time%20Rendering%203rd%E3%80%8B%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0/Content/BlogPost11/README.md)** — RTR 3rd 第 19.9 节的中文笔记，完整给出 Discrete/Blend/Alpha/CLOD/Geomorph 分类，并画出 hysteresis 的非对称距离带（r 增大用上一行阈值、r 减小用下一行阈值）。 〔源码〕
155. **[Godot PR #113486 visibility fade 改用 AABB center](https://github.com/godotengine/godot/pull/113486)** — 已合并的实际修复把 visibility fade 从对象原点改为 AABB 中心，是 #102799/#79471 的落地补丁，可直接核对分界行为。 〔issue/PR〕
156. **[Godot #55367 高 transparency 不关闭阴影投射](https://github.com/godotengine/godot/issues/55367)** — 高透明度仍按实体网格投影，说明淡变期间影子不会随可见度一起退场，对应 #59538 低模影子投到高模的问题（open）。 〔issue/PR〕
157. **[Godot PR #54222：distance fade 与 per-instance transparency 实现](https://github.com/godotengine/godot/pull/54222)** — 说明 Self/Dependencies 距离淡变通过 ALPHA 混合而非裁剪实现，是双绘与排序成本的来源。 〔issue/PR〕
158. **[agargaro/instanced-mesh（three.ez InstancedMesh2）](https://github.com/agargaro/instanced-mesh)** — three.js 的 InstancedMesh2：逐实例可见性/视锥裁剪/排序；Star-Rush 可在其上做逐实例 LOD 选择，但库本身不含 LOD。 〔仓库/工具〕
159. **[Sogrey/Kiloframe](https://github.com/Sogrey/Kiloframe)** — 同一 1000 模型场景对比 Mesh/InstancedMesh/几何合并/LOD+剔除的中文演示，可作为“加 LOD 是否值”的实测入口（新仓、0 星）。 〔仓库/工具〕
160. **[three.js 论坛：LOD 之间 blended look 的做法](https://discourse.threejs.org/t/how-can-i-achieve-a-blended-look-between-lods/30901)** — 地形 LOD 有缝隙且靠近时明显 popping；回复指向 Mugen87 的 blend-between-LODs jsfiddle，说明混合是社区常用补法而非核心功能。 〔论坛原帖〕
161. **[three.js 论坛：Eternal Ride 无 LOD、无接缝地形](https://discourse.threejs.org/t/eternal-ride-infinite-terrain-in-threejs-with-no-lod-no-seams/91868)** — 用单一连续网格、顶点密度即 LOD，无 chunk、无接缝、无 popping；作为‘连续 LOD/不做离散切换’的反向路线，支持先不引入离散 LOD。 〔论坛原帖〕
162. **[three.js forum: How can I achieve a blended look between LOD's?](https://discourse.threejs.org/t/30901)** — 地形 LOD 近看出现缝隙并明显 pop；回答用 Mugen87 的 LOD 混合 fiddle，说明混合可做但需自建，不是 LOD 自带。 〔论坛原帖〕
163. **[three.js forum: Eternal Ride 无 LOD 无限地形](https://discourse.threejs.org/t/91868)** — 无限地形项目用单车跟随的连续顶点密度替代分块 LOD，声称无 seams/pop；给出不引入离散 LOD 的另一条路。 〔论坛原帖〕
164. **[three.js PR #35191：Meshlet/VisibilityBuffer 绘制管线](https://github.com/mrdoob/three.js/pull/35191)** — 2026-10-29 随 r187 合并；GPU 驱动 64 三角形簇、1–1.5 px 屏幕误差 LOD，支持 LOD、InstancedMesh、静态 BundleGroup、阴影，仅 WebGPU（WebGL 回退普通管线）；实例场景 230→3 ms、Sponza 反而 0.60→0.73 ms，是当前 three.js 官方“批次+LOD”最新基线。 〔issue/PR〕
165. **[three.ez/simplify-geometry](https://github.com/agargaro/simplify-geometry)** — MIT，2026-11-12 更新（20★）；对 three.js BufferGeometry 封装 meshoptimizer，按 error/ratio 一次生成多级 LOD，保留属性并保护接缝，供 LOD Editor 与 InstancedMesh2 使用；新且可直接生成距离/误差阈值素材。 〔仓库/工具〕
166. **[Modular London terraces：sockets、assembly、meshopt LOD](https://discourse.threejs.org/t/modular-london-terraces-in-three-js-sockets-assembly-files-and-meshopt-lods/94887)** — 2026-10-01 作者帖；每栋房由独立 GLB 部件（墙、窗、门、烟囱等）经命名 socket 组装，每件有 high/medium/low 三级并带 EXT_meshopt_compression，还公布各级三角形数；与“路肩标准件”最接近的模块化 LOD 实践，但资产为商业包。 〔论坛原帖〕
167. **[Eternal Ride: Infinite Terrain with No LOD](https://discourse.threejs.org/t/eternal-ride-infinite-terrain-in-three-js-with-no-lod-no-seams/91868)** — 2026-05-28（超出 3 个月窗口，但对“保持无 LOD”直接有用）；用随相机移动的单一扇形网格按顶点密度当 LOD，做到无分块、无接缝、无 popping；说明程序化连续地形可以完全绕开 LOD，但不是离散路肩件的方案。 〔论坛原帖〕
168. **[three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)** — 官方 batch LOD 示例用它给 BatchedMesh 建 BLAS/TLAS 与视锥剔除；批次内 LOD 选层之外还必须补的加速层。 〔仓库/工具〕
169. **[three.js 论坛：When is LOD actually beneficial（反例/成本）](https://discourse.threejs.org/t/when-is-it-actually-beneficial-to-use-lod-in-three-js-for-performance/87697)** — 实测讨论指出 THREE.LOD 不减少 draw call，且每对象每帧测距和换层有开销，动态唯一几何可能越用越慢，可作为“无可见收益就保持无 LOD”的停止条件。 〔论坛原帖〕
170. **[agargaro/octahedral-impostor](https://github.com/agargaro/octahedral-impostor)** — 从 20 万棵树的森林 demo 提取的 three.js 八面体 impostor 库，串起 BatchedMesh LOD、InstancedMesh2 LOD 和末级 impostor 的完整远近链。 〔仓库/工具〕
171. **[Strange-tech/100kTrees](https://github.com/Strange-tech/100kTrees)** — 10 万棵树的自定义 LOD 加 InstancedMesh 实现，作者明确指出原生 three.js 的 LOD 与实例化不能直接组合，是批次/实例化边界的实测反例。 〔仓库/工具〕
172. **[Unity QualitySettings.lodBias](https://docs.unity3d.com/ScriptReference/QualitySettings-lodBias.html)** — 官方按质量档调整 LOD 距离的开关，Quest 2“切换太近”的帖子就是靠它加 FOV 逻辑解决，对应设备预算对阈值的缩放。 〔官方文档〕
173. **[Unreal Impostor Baker 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/impostor-baker-plugin-in-unreal-engine)** — Epic 官方插件把网格烘成 impostor 作为末级 LOD，是远层不画真网格、整簇换一张卡的官方路径。 〔官方文档〕
174. **[2Retr0/GodotGrass](https://github.com/2Retr0/GodotGrass)** — Godot MultiMesh 草渲染基线，没有逐实例 LOD，可作为“保持无 LOD 也能达标”的成本对照。 〔仓库/工具〕
175. **[ellioman/Indirect-Rendering-With-Compute-Shaders](https://github.com/ellioman/Indirect-Rendering-With-Compute-Shaders)** — Milk 实例化器的上游，用 compute shader 做剔除与间接绘制并在 GPU 侧组织 LOD，是实例化批次里选层的参考实现。 〔仓库/工具〕
176. **[Milk-Drinker01/Milk_Instancer_HDRP](https://github.com/Milk-Drinker01/Milk_Instancer_HDRP)** — Milk 实例化器的 HDRP 分支，最多 3 级 LOD 加逐实例遮挡/视锥剔除，给 Unity 侧“批次内换层”一个可读实现。 〔仓库/工具〕
177. **[Unity 2D images for LOD](https://docs.unity.com/en-us/engine/6000.7/manual/analysis/graphics-performance-profiling/lod/2d-images-lod)** — 官方 billboard/2D impostor LOD 路线，是“远景换静态面片”而非继续减面的替代方案。 〔官方文档〕
178. **[Babylon Scene.customLODSelector API](https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene#customLODSelector)** — 给定 shadow RTT 帖里的 workaround 实际接口，可在选择器内同时处理距离、fps 与 isVisible。 〔官方文档〕
179. **[three.js 论坛：100K Procedural Rocks](https://discourse.threejs.org/t/89578)** — 4 级 LOD（marching cubes→icosahedron/box impostor）+ 阈值调到最小 pop 但近看仍可见切换，32 draw calls，和目标路肩件的形状/预算高度同构。 〔论坛原帖〕
180. **[Asharena 集成 batching/LOD/culling 设计](https://github.com/Glidias/Asharena/wiki/Game-3D-rendering-generation-systems)** — 给定 PlayCanvas BatchManager 帖作者自己的 batching+LOD+culling 集成设计，补 BatchManager 动态增删/固定 buffer 的摩擦。 〔仓库/工具〕
181. **[Unreal Significance Manager](https://dev.epicgames.com/documentation/en-us/unreal-engine/significance-manager-in-unreal-engine)** — 官方按预算/上下文给对象分级（可关粒子、降 AI 频率），与几何距离 LOD 解耦；nashnie 插件即此框架的扩展。 〔官方文档〕
182. **[Unity 官方文档：QualitySettings.lodBias](https://docs.unity.com/en-us/engine/current/script-reference/unityengine/qualitysettings/lodbias)** — 全局缩放所有 LODGroup 的过渡阈值（最小 0.1），并明确只影响 LODGroup、不影响 Mesh LOD；设备与编辑器切换距离不同时常先查这里。 〔官方文档〕
183. **[three.js 论坛：varying number of meshes per LOD（一级多件的 Group 方案）](https://discourse.threejs.org/t/varying-number-of-meshes-per-lod/79877)** — 确认一个 LOD 级可放 Group 容纳多个 mesh，解决“一级多件”同时仍保持单级硬切。 〔论坛原帖〕
184. **[Unity：Troubleshooting Mesh LOD visual artifacts](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/graphics-performance-profiling/lod/mesh-lod/mesh-lod-troubleshooting)** — 自动 LOD 会丢高曲率细节、子网格和法线；官方给出的停止条件是 Limit LODs 或对该网格回退 LOD Group。 〔官方文档〕
185. **[Unity：Mesh LOD runtime quality](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/graphics-performance-profiling/lod/mesh-lod/mesh-lod-quality)** — Mesh LOD Threshold 与 per-object LOD Selection Bias 的选级参数，可与距离/屏幕占比阈值方案逐项对照。 〔官方文档〕
186. **[Unreal 官方：Creating and Using LODs](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-and-using-lods-in-unreal-engine)** — 官方按屏幕占比而非世界距离选级，说明大小不同的实例切换点不同，且碰撞固定使用所选 LOD。 〔官方文档〕
187. **[Unity Discussions：LOD 与 static batching 的兼容性](https://discussions.unity.com/t/question-about-the-compatibility-of-lods-and-static-batching/744858)** — bgolus 说明 static batching 仍保留每个 MeshRenderer、可由 LODGroup 单独开关，LOD 按包围盒屏幕覆盖率选档；代价是内存，不是 LOD 失效。纠正‘静态批次必与 LOD 冲突’。 〔论坛原帖〕
188. **[Unity Discussions：GRD 与 animated LOD crossfade](https://discussions.unity.com/t/lod-animate-cross-fading-with-gpu-resident-drawer/1688878)** — Unity 工作人员回复：GPU Resident Drawer 不支持 animated crossfade，使用它的 LODGroup 会被排除出 GRD；关闭 animated、改用 screen-size crossfade 才能留在批次路径。 〔论坛原帖〕
189. **[Unity Discussions：GPU Resident Drawer 与 animated crossfade（社区解释）](https://discussions.unity.com/t/gpu-resident-drawer-and-animated-lod-crossfade/1567779)** — BRG/GRD 在插值期间要频繁改 GPU buffer，所以普通 crossfade 可用、animated 不行；这是批次与淡变冲突的实现层解释。 〔论坛原帖〕
190. **[Unity Discussions：SkinnedMeshRenderer 能否 crossfade](https://discussions.unity.com/t/is-it-possible-to-make-lod-cross-fade-work-on-skinned-mesh-renderers/1732452)** — 官方回复：Mesh LOD 的 crossfade 只在 GRD 路径支持，SkinnedMeshRenderer 不在 GRD，故始终瞬切；支持范围按渲染路径与批次路径划分。 〔论坛原帖〕
191. **[Unity Discussions：2,583 株植物 3 个 draw call 的批处理日志](https://discussions.unity.com/t/cornucopia-raw-dev-log-1-gpu-instancing-or-how-2-583-plants-became-3-draw-calls/1715462)** — 独立开发者把 2,583 株植物压到 3 个 draw call；评论区分 batching（合并网格）与 instancing（同一网格多实例），对应现有批次接口的两种取舍。 〔论坛原帖〕
192. **[Unity Discussions: GPU Resident Drawer 下 LOD 瞬切](https://discussions.unity.com/t/1561993)** — GPU Resident Drawer 下 LOD 直接瞬切、pop 明显；Unity 回复 cross-fade 可用但 animated cross-fade 不支持，Fantasy Kingdom 示例误开。 〔论坛原帖〕
193. **[Unity Discussions: Animated crossfade 与 GRD 不兼容](https://discussions.unity.com/t/1688878)** — 官方确认 animated crossfade 与 GRD 不兼容，6.4 的修法是让用它的 LODGroup 退出 GRD、走普通路径；screen-size crossfade 才能在 GRD 下工作，批次收益与淡变二选一。 〔论坛原帖〕
194. **[Unity Discussions: SpriteRenderer 没有 LOD crossfade](https://discussions.unity.com/t/1643472)** — 2D 项目 4000 个 Sprite 想按正交 zoom 切换，LODGroup 只能硬 cull；官方说 2D renderer 不支持 LODGroup，社区建议自写 shader/instancing，说明 sprite/billboard 远层没有现成淡变。 〔论坛原帖〕
195. **[Unity Discussions: LOD 与 static batching 的兼容性](https://discussions.unity.com/t/744858)** — 长答：LODGroup 与 static batching 可共存，同材质的不同 LOD 甚至可能批到同一大 mesh，renderer 仍能被 LOD 单独开关，但性能没有统一答案，要按场景实测。 〔论坛原帖〕
196. **[Unity Discussions: Terrain 树带 LODGroup 时 static batching 为 0](https://discussions.unity.com/t/944581)** — Terrain 上画的树带 LODGroup 时 static batching 为 0，去掉 LODGroup 才恢复批处理；直接暴露地形批次与 LOD 的冲突。 〔论坛原帖〕
197. **[Unity Discussions: 加 4 级 LOD 后 FPS 反降](https://discussions.unity.com/t/928625)** — 同一草地加 4 级 LOD 后 FPS 从约 230 降到约 170，SetPass/batches 反而增加；说明 LOD 不是天然省，缺成本证据时不应为它加层。 〔论坛原帖〕
198. **[Unity Discussions: issue #15625 GRD 下 animated crossfade 不淡](https://discussions.unity.com/t/1727938)** — Unity issue #15625 的讨论帖：GRD 下 LODGroup animated crossfade 不淡，被从 bug 改成 feature request，用户抗议功能无提示就坏；批次兼容性的官方定性争议。 〔论坛原帖〕
199. **[Babylon forum: 实例化网格不能作为 LOD mesh](https://forum.babylonjs.com/t/22162)** — 实例化网格不能作为 LOD mesh，LOD 只按主 mesh 距离判断，所有实例共享几何；Unity terrain 树导出的实例 LOD 因此失败。 〔论坛原帖〕
200. **[PlayCanvas forum: BatchManager 与动态 LOD 合批的摩擦](https://forum.playcanvas.com/t/7860)** — PlayCanvas 的 BatchManager 不能动态增删批内元素并保持固定 buffer，作者自建 fixed buffer 才能做可 spawn/unspawn 的 LOD/合批；批次接口与 LOD 的摩擦。 〔论坛原帖〕
201. **[Babylon 论坛：LODs and Create Instance](https://forum.babylonjs.com/t/lods-and-create-instance/2385)** — 22162 引用的旧帖，确认实例是否继承源网格 LOD 的语义，是实例化批次能否复用 LOD 的前置问题。 〔论坛原帖〕
202. **[Unity issue tracker #15625：GRD 下 Animate Cross-fading 不淡](https://issuetracker.unity.com/issues/15625)** — 给定讨论帖对应的原始公开 issue，记录 GRD 开启后 LODGroup 的时间型 crossfade 完全不淡。 〔issue/PR〕
203. **[Babylon Forum：thin instances 无法逐实例 LOD](https://forum.babylonjs.com/t/23872)** — 说明 thin instances 因单次 draw call 不能逐实例选档，只能按 LOD 拆 buffer 搬实例，点明大批量装饰件的硬限制。 〔论坛原帖〕
204. **[Unity Discussions：Mesh LOD 2025 长贴里的官方限制清单](https://discussions.unity.com/t/1620503)** — Unity 官方在贴内确认 Mesh LOD crossfade 依赖 GRD、没有 LOD 切换回调、树等断开几何生成质量差且暂不支持 impostor 末档。 〔论坛原帖〕
205. **[three.js forum: Virtually Geometric 连续虚拟几何](https://discourse.threejs.org/t/28420)** — 连续虚拟几何 LOD 原型：同材质合一批、按屏幕三角形大小简化，代价是 GPU 内存；作为离散 LOD/淡变之外的替代。 〔论坛原帖〕
206. **[Godot 官方 demo：Occlusion Culling and Mesh LOD](https://github.com/godotengine/godot-demo-projects/tree/master/3d/occlusion_culling_mesh_lod)** — 官方把自动 Mesh LOD 与遮挡剔除放在同一 demo 对比，并提示遮挡剔除是 CPU 密集、室外场景收益有限，可作远层隐藏的对照。 〔源码〕
207. **[Boat Attack 示例：LodTweaker.cs](https://github.com/Unity-Technologies/BoatAttack/blob/master/Assets/Scripts/Camera/LODTweaker.cs)** — 官方 demo 在每个相机回调里改全局 QualitySettings.lodBias（反射相机 0.5、主相机 3），说明 lodBias 是全局副作用而非按对象设置。 〔源码〕
208. **[Eternal Ride 源码（极坐标扇面无 LOD 无限地形）](https://github.com/red-reddington/web-demos/blob/aa388e0b87b5339d3d50d5deb7ec1c38c881b5cf/eternal-ride/index.html)** — 用随相机移动的极坐标扇面让近密远疏，天然没有 chunk 边界和切换 pop，是“保持无 LOD”停止条件的可运行反例。 〔源码〕
209. **[keijiro/CrossFadingLod](https://github.com/keijiro/CrossFadingLod)** — Unity LOD Group 的 Cross Fade 自定义 shader 示例，README 同时给 blend 与 dither 两种 GIF；直接展示淡变时两级重叠绘制与 shader 前提，a1dbv 未覆盖。 〔仓库/工具〕
210. **[keijiro/UrpCrossfadingTest](https://github.com/keijiro/UrpCrossfadingTest)** — URP 的 LOD crossfading 测试工程，用来核管线侧开关与逐级淡变行为，可与 Built-in 材质约束对照。 〔仓库/工具〕
211. **[BaraShiro/DitheredCrossfadeNatureShaders](https://github.com/BaraShiro/DitheredCrossfadeNatureShaders)** — Unity 内置 Nature/Tree Creator shader 的替代件，专门补 dithered crossfade；说明树/植被默认材质不能直接吃 LOD Group 的抖动淡变。 〔仓库/工具〕
212. **[godot-extended-libraries/godot-lod](https://github.com/godot-extended-libraries/godot-lod)** — Godot 3.x 的 247 星 LOD 插件（awesome-godot 收录）：逐节点距离属性切换网格，只有灯光平滑淡出，未做网格淡变；可对照 Godot 4 visibility ranges。 〔仓库/工具〕
213. **[kerosinkleber/vegetation-rendering-research](https://github.com/kerosinkleber/vegetation-rendering-research)** — 2026-11 的植被渲染研究汇编（带置信度与 Godot 4 节）：明确 dithered/temporal LOD crossfade 没有成本实测，直接支撑“无成本证据就保持无 LOD”的停止条件。 〔仓库/工具〕
214. **[gaopengbin/cesium-lod-transitions](https://github.com/gaopengbin/cesium-lod-transitions)** — CesiumJS 的 LOD 过渡插件：影像瓦片 cross-fade、父子地形网格交接，默认 800ms，并自述非通用无缝；可借“淡变重叠+交接”语义与限制写法。 〔仓库/工具〕
215. **[J0ze/QEM-Mesh-Simplifier-DitheredLOD-Renderer](https://github.com/J0ze/QEM-Mesh-Simplifier-DitheredLOD-Renderer)** — QEM 简化 + 4x4 Bayer 抖动 LOD 的渲染器，展示 dithered fade、6 级 LOD 与 z-fighting 处理，属抖动派实现参照。 〔仓库/工具〕
216. **[Godot issue #69877: 4.0 beta 的 visibility fade 回归](https://github.com/godotengine/godot/issues/69877)** — beta1→beta2 的 visibility fade 回归，实为 mobile 渲染器本来没有该功能、项目设置从 clustered 切到了 mobile；再次确认平台范围而非配置错误。 〔issue/PR〕
217. **[HN：GTA V 的 crossfade 与远景雾](https://news.ycombinator.com/item?id=47429129)** — GTA V 远景物件先低模，约 100 m 处用约 0.5 秒 crossfade 换高模、再加轻雾；玩家移动时不易察觉。给淡变时长量级，明确不是通用常量。 〔实测/博客〕
218. **[Unreal Forums: HISM cluster culling 依赖 Dithered LOD 材质](https://forums.unrealengine.com/t/1758147)** — HISM 的 cluster distance culling 要求材质开 Dithered LOD Transition 才工作；实例化批次把 LOD 淡变和材质开关绑在一起。 〔论坛原帖〕
219. **[PlayCanvas 运行时 LOD 脚本](https://github.com/5hyuns/playcanvas-runtime-lod)** — 用 meshoptimizer 生成 0.5/0.25/0.1/0.05 保留率的多级索引缓冲、按 10/25/50/100 距离切换，但完全没有淡变，可作为“硬切+多级”基线。 〔仓库/工具〕
220. **[PlayCanvas OptiPixel](https://github.com/AlexAPPi/playcanvas-opti-pixel)** — 给定 PlayCanvas 帖 #15 的 HierarchicalInstancer LOD CrossFade 就在此库，README 还列出 LOD fade helpers、BVH、HZB，可核级间淡变与实例批次的成本。 〔仓库/工具〕
221. **[Unity Discussions：自定义 LOD 距离计算（VR 边界闪烁）](https://discussions.unity.com/t/how-to-approach-a-custom-lod-distance-calculation/943616)** — VR 里总有一个物体卡在 LOD 边界，头前后移一英寸就闪；自定义 LODGroup 还会丢掉 dither 混合。是近距离/快速视角变化的直接反例。 〔论坛原帖〕
222. **[Unity Discussions：HDRP ShaderGraph crossfade 失效](https://discussions.unity.com/t/bug-cross-fade-is-broken-in-hdrp-shadergraph-shaders/1711907)** — HDRP ShaderGraph 的 crossfade 在 6.3.x 失效：未请求 positionRWS 导致每像素 fade hash 相同、整批全过或全裁；URP 与 HDRP/Lit 正常。说明淡变实现按管线分叉。 〔论坛原帖〕
223. **[Unreal Forums：Dithered LOD 切换时闪烁（官方复现）](https://forums.unrealengine.com/t/when-dithered-lod-switches-a-flicker-occurs/2604963)** — 官方复现的 dithered LOD 切换闪烁 bug，附 Test 工程与 Screen Size 1/0.25/0.1；即使正确启用也可能在阈值附近闪，说明淡变不保证无可见切换。 〔论坛原帖〕
224. **[Unreal Forums：UE 5.3 Dithered LOD Transition 失效](https://forums.unrealengine.com/t/ue-5-3-dithered-lod-transition-issues/1778945)** — SpeedTree 与普通网格在 5.3 起 dithered 过渡失效；后续定位到多材质槽中任一未开 Dithered LOD Transition 就整体失败，且只在 foliage instance 出现。 〔论坛原帖〕
225. **[Unreal Forums：多材质导致 Dithered LOD 失效](https://forums.unrealengine.com/t/dithered-lod-transition-issue-when-using-multiple-materials/2340365)** — 所有材质槽（包括未使用的槽）都必须开启 Dithered LOD Transition，否则整网格淡变失败；淡变是整网格契约，不是单个材质开关。 〔论坛原帖〕
226. **[Unreal Forums：HISM + LOD dithering + WPO 网格消失](https://forums.unrealengine.com/t/meshes-in-a-hism-can-disappear-when-a-material-uses-lod-dithering-and-wpo/2841864)** — HISM 实例批次里材质用 LOD dithering + WPO 会让网格消失，5.6 修复；批次与淡变组合的真实缺陷，说明实例批次不是透明地支持逐件淡变。 〔论坛原帖〕
227. **[Stack Overflow：three.js LOD 切换与 drawRange](https://stackoverflow.com/questions/36613604/3d-rendering-performance-pipeline-for-level-of-detail-lod-meshes-in-threejs)** — 把三档索引拼进同一 BufferGeometry，用 setDrawRange 切换，只上传一次 GPU、避免切档时上传卡顿；是批次内硬切的最低成本实现，兼容现有 InstancedMesh 思路。 〔实测/博客〕
228. **[Godot #81995 LOD selection implementation is wrong](https://github.com/godotengine/godot/issues/81995)** — LOD 选择用 AABB 支撑点欧氏距离且符号判断失效，长 AABB 靠近相机也会选中错层并 pop；4.4 由 #92290 修。 〔issue/PR〕
229. **[Godot proposal #13779 可选 AABB center/nearest/origin 测距](https://github.com/godotengine/godot-proposals/issues/13779)** — 2km 地块在角落时按 AABB 中心仍算远；不同 LOD 的 AABB 中心不同还会出现“两层都不显示或都显示”，现只能 visibility_parent/自定义 AABB。 〔issue/PR〕
230. **[Unity Discussions: VR 里在 LOD 边界前后挪动一英寸就闪](https://discussions.unity.com/t/943616)** — VR 用户在 LOD 边界上前后挪一英寸就反复闪；他想改成按 playspace 原点或只在传送时更新，回复说自写 CullingGroup 会丢掉 dither 混合。 〔论坛原帖〕
231. **[Unity Discussions: LOD Crossfade 升级 Unity 6 后闪烁](https://discussions.unity.com/t/948519)** — 树木 LOD crossfade 从 2021 升到 Unity 6 后每次切换都闪，关掉 crossfade 正常；一年后仍有人复现，无官方修复。 〔论坛原帖〕
232. **[Unity Discussions: 6.2→6.3 后 LOD crossfade 停摆](https://discussions.unity.com/t/1706288)** — 6.2→6.3 后所有 LOD crossfade 停摆，MeshLOD 总开关影响 LODGroup，且 shader 不即时刷新，需切 HDRP volume/重启编辑器；版本升级时淡变路径易坏。 〔论坛原帖〕
233. **[Unity Discussions: HDRP ShaderGraph crossfade 同一 hash 导致全过/全 clip](https://discussions.unity.com/t/1711907)** — HDRP ShaderGraph 的 crossfade 因每个像素拿到同一 hash，过渡时整片通过或整片被 clip，出现本应透明的像素；用户给出 SurfaceSubTarget 强制 positionRWS 的修法。 〔论坛原帖〕
234. **[Unity Discussions: HDRP ShaderGraph crossfade 影子淡、主 pass 硬切](https://discussions.unity.com/t/1645414)** — HDRP Lit ShaderGraph 开 Support LOD CrossFade 后，shadow caster 在淡、主 pass 却硬切；BenCloward 确认是 bug 要求报 case。 〔论坛原帖〕
235. **[Unity Discussions: Bayer 抖动图案与蓝噪声](https://discussions.unity.com/t/706936)** — 抖动 crossfade 的图案质量：Bayer 网格近看明显，有人称用于遮挡物淡出时“disgusting”；蓝噪声只需换查找纹理、性能无差，说明 dither 也有可见代价。 〔论坛原帖〕
236. **[Unity Discussions: issue #6079 动态加载物件 crossfade 不生效](https://discussions.unity.com/t/1726017)** — Unity issue #6079：动态加载的 GameObject（含 Addressables prefab）LODGroup crossfade 不生效；淡变依赖 renderer 注册/加载时机，不是所有运行时批次路径都支持。 〔论坛原帖〕
237. **[Unreal Forums: Dithered LOD 切换仍闪烁](https://forums.unrealengine.com/t/2604963)** — Screen Size 1/0.25/0.1 的立方体前后移动仍会闪，官方复现并立案（UE-296133），用户只能改 SceneVisibility.cpp 打补丁；最新版仍存在。 〔论坛原帖〕
238. **[Unreal Forums: SpeedTree 的 Dithered LOD 在 5.3 起失效](https://forums.unrealengine.com/t/1778945)** — SpeedTree 的 dithered LOD 在 5.2 正常、5.3 起在所有 mesh 上失效；后来定位到多材质中有一个没开 dithered，且只影响 foliage instance，说明版本/材质路径交叉。 〔论坛原帖〕
239. **[Babylon forum: 没有 LOD crossfade，建议加级并拉开距离](https://forum.babylonjs.com/t/22703)** — 官方回复没有 LOD crossfade，建议加更多 LOD 级并拉开距离来减少 pop；低预算替代淡变的直接建议。 〔论坛原帖〕
240. **[Babylon forum: GPU 混合 LOD 的成本](https://forum.babylonjs.com/t/30708)** — GPU 混合 LOD 的方案里所有 LOD 数据仍要上传并逐像素 discard，作者认为 CPU 切 LOD 更快；alpha blending 更贵且失去深度写入，说明淡变的额外成本。 〔论坛原帖〕

### 第 241–320 位：更多论坛实测、工具与替代实现

241. **[three-nanite](https://github.com/apekshik/three-nanite)** — MIT，2026-11-15 仍在更新；用 clusterlod.h 做 GLB→簇 LOD，经 three.js BatchedMesh 绘制；README 明列只支持静态不透明刚体、无 geomorphing（1–2 px 不可见，阈值高会显跳变）、1.9M 三角形约 67 MB、集成 GPU 约 8 ms/百万三角形、Firefox 无 WEBGL_multi_draw 会退化成数千 draw call——是“小道具不值得上虚拟几何”的反证。 〔仓库/工具〕
242. **[three.js PR #24271：Material.alphaHash（opaque pass 哈希抖动）](https://github.com/mrdoob/three.js/pull/24271)** — 用哈希覆盖率替代 alpha blending、把网格留在 opaque 队列并写深度，明确把“LOD 切换不闪烁”列为首要用途，代价是噪点；r154 合入。 〔issue/PR〕
243. **[Godot #68243 manual LOD 时 Visibility Range 行为不一致](https://github.com/godotengine/godot/issues/68243)** — 相邻 LOD 的 AABB 中心不一致时，模型在切换区间会整段消失，是 d-ε→d+ε→d-ε 回摆时“两边都不显示”的直接反例（仍 open）。 〔issue/PR〕
244. **[Godot PR #92290 用 AABB 表面最近距离计算 Mesh LOD](https://github.com/godotengine/godot/pull/92290)** — clayjohn 已合并的实现把自动 Mesh LOD 的测距改为相机到 AABB 表面最近点，可作为“最近点而非中心”的源码参照。 〔issue/PR〕
245. **[Godot #78664 Directional Shadow Pancake 破坏自动 LOD](https://github.com/godotengine/godot/issues/78664)** — #81995 评论区所指的“某个 PR 弄坏阴影 LOD 逻辑”就是这份回归报告，可用来核对阴影 LOD 与主视图 LOD 的不同步（closed）。 〔issue/PR〕
246. **[Unity Discussions: LOD CrossFade Shader in URP](https://discussions.unity.com/t/lod-crossfade-shader-in-urp/804022)** — URP 默认着色器不含 crossfade，帖中给出用 unity_LODFade.x 加抖动的自定义 shader 接法，并指向 Boat Attack 示例。 〔论坛原帖〕
247. **[Unity Discussions: Unable to Crossfade SpriteRenderers using LODGroup](https://discussions.unity.com/t/unable-to-crossfade-spriterenderers-using-lodgroup/832301)** — SpriteRenderer 收不到 unity_LODFade，说明 2D/公告板 LOD 不能依赖内置 crossfade，只能自写 shader 或换 MeshRenderer。 〔论坛原帖〕
248. **[Unreal Issue Tracker: UE-295919 dithered LOD 不考虑 FOV](https://issues.unrealengine.com/issue/UE-295919)** — Unreal 论坛 2601486 指向的公开 issue 号，记录改 FOV 时不触发抖动过渡的缺陷（页面 403，标题/结论取自帖内）。 〔issue/PR〕
249. **[Unreal Issue Tracker: UE-296133 dithered LOD 切换闪烁](https://issues.unrealengine.com/issue/UE-296133)** — Unreal 论坛 2604963 指向的公开 issue 号，记录 dithered LOD 切换时的闪烁可用 lod.TemporalLag 复现（页面 403，标题/结论取自帖内）。 〔issue/PR〕
250. **[Unity 讨论：Unity 6 升级后 LOD crossfade 闪烁](https://discussions.unity.com/t/lod-crossfade-is-flickering-after-unity-6-upgrade/948519)** — HDRP 项目从 2021.3 升到 Unity 6 后树 LOD 淡变闪烁，关掉 crossfade 即消失，是淡变路径的回归反例。 〔论坛原帖〕
251. **[Babylon PR #13170（正交相机 screen coverage 修复）](https://github.com/BabylonJS/Babylon.js/pull/13170)** — 修正正交相机下 screen coverage LOD 的单位错误；给定帖的修复提交，说明屏幕覆盖率阈值在非透视投影下会失效。 〔issue/PR〕
252. **[Babylon PR #9320（RTT/shadow LOD 支持）](https://github.com/BabylonJS/Babylon.js/pull/9320)** — 把 LOD 选择接进 RTT/shadow/depth，新增 customAllowRendering；给定“阴影不吃 LOD”问题的根修。 〔issue/PR〕
253. **[Babylon PR #9096（LOD mesh + 实例阴影修复）](https://github.com/BabylonJS/Babylon.js/pull/9096)** — 修 LOD mesh + 实例的阴影错误与 draw call 过多，是 #9320 之前的阴影 LOD 补丁。 〔issue/PR〕
254. **[Babylon PR #9298（depth renderer LOD）](https://github.com/BabylonJS/Babylon.js/pull/9298)** — 给 depth renderer 补 LOD 选择，解释 shadow/depth pass 与主相机选级不同步的根因。 〔issue/PR〕
255. **[UE Issue UE-221257：HISM + LOD dithering + WPO 网格消失](https://issues.unrealengine.com/issue/UE-221257)** — 2841864 转述的 issue 条目；issue 页 403，仅标题/摘要（正文未读，据论坛转述），说明批处理实例、dither 与顶点动画组合会出现整批消失。 〔issue/PR·仅标题/摘要〕
256. **[Godot PR #61880：用 interleaved gradient noise 做 alpha hashing](https://github.com/godotengine/godot/pull/61880)** — proposal #5240 同时引用，提供与 alpha clip/hash 材质兼容的抖动方案。 〔issue/PR〕
257. **[Unreal 论坛：How do I enable Dithered Lod Transitions](https://forums.unrealengine.com/t/how-do-i-enable-dithered-lod-transitions/437587)** — 社区实操反馈：只适合 foliage/透明卡片，自定义 UV 的 LOD 会出现“黑胡椒”状噪点，还记录材质设置不生效需在干净工程复现的坑。 〔论坛原帖〕
258. **[Unreal Forums：移动端 dithered LOD 的 masked 渲染代价](https://forums.unrealengine.com/t/69077)** — 解释 dither 走 masked 路径会关闭移动 GPU 的排序/遮挡硬件，并给出 `foliage.ditheredLOD 0` 的全局关闭取舍。 〔论坛原帖〕
259. **[Unity Discussions：自定义树影 shader 在运行时丢失 LOD_FADE_CROSSFADE](https://discussions.unity.com/t/1556771)** — Scene 视图阴影正常、Play/build 里 `LOD_FADE_CROSSFADE` 未启用导致阴影硬切，属于“编辑器通过不等于运行时通过”的反例。 〔论坛原帖〕
260. **[Babylon Forum：用 onLODLevelSelection/customLODSelector 手动淡变](https://forum.babylonjs.com/t/8569)** — 引擎作者给出监听 LOD 切换并自行改 alpha 的接法，是无内建 crossfade 时实现手动淡变的可行入口。 〔论坛原帖〕
261. **[Unreal Forums：HISM 的 dithered LOD 使屏幕占比阈值随实例缩放漂移](https://forums.unrealengine.com/t/458668)** — 报告 HISM 开启 dithered LOD 后阈值随实例 scale 变化，并提到 VR 下双眼过渡不一致/不适，直接关系阈值选点与设备适用性。 〔论坛原帖〕
262. **[Godot PR #68673：alpha hash 改回对象空间](https://github.com/godotengine/godot/pull/68673)** — 把 alpha hash 从屏幕空间改回对象空间以消除相机移动条纹，说明屏幕空间 IGN 为什么会在移动时闪。 〔issue/PR〕
263. **[Godot PR #40364：Alpha Hash 与 Alpha-to-Coverage 的实现取舍](https://github.com/godotengine/godot/pull/40364)** — 同时实现 alpha hashing 与 A2C/A2O，记录 hash 主要面向 TAA、A2C 不夹 alpha 会留光晕等限制。 〔issue/PR〕
264. **[Unreal 论坛：LOD dithering 是否支持 Stationary/Movable](https://forums.unrealengine.com/t/support-lod-dithering-on-stationary-or-movable/1599997)** — LOD dithering 只对特定 mobility 生效（UE-43880），动态路肩件直接套用会失效。 〔论坛原帖〕
265. **[从“突越”到平滑：详解 LOD 切换的四种策略（Discrete/Blend/Alpha/Geomorph）及在 OSG/UE4 中的实现对比（CSDN）](https://blog.csdn.net/weixin_30300225/article/details/98524884)** — 四种切换策略对照：离散、Blend、Alpha、Geomorph；明确建议“采用基于滞后的切换策略，避免边界抖动”，并指出 Blend 同时渲染两个模型带来的 GPU 负担，可直接支撑硬切带滞回与淡变双绘的区分。 〔中文社区〕
266. **[LOD（多级细节）技术全解析：从游戏引擎到大厂实践（CSDN）](https://blog.csdn.net/qq_33060405/article/details/158757640)** — 订阅截断，仅见摘要和开头：覆盖距离/屏幕占比/视锥裁剪，并把 Popping 的 Fade、Geomorphing、Hysteresis 三种方案并列；可作中文综述入口，正文数值未读到。 〔中文社区·仅摘要/标题〕
267. **[LOD 的概念 - lydstory（博客园）](https://www.cnblogs.com/hshy/p/19129046)** — 中文社区对 LOD 的简明定义：只比较硬切（可能闪烁）与 Cross Fade/Morphing（更自然），没有阈值间距、滞回或双绘成本——正好说明常见教程的缺口。 〔中文社区〕
268. **[【Three.js】知识梳理十四：LOD（Level of Detail）技术（掘金）](https://juejin.cn/post/7369443728963715082)** — 更基础的 Three.js LOD 教程：只讲距离阈值与 update，不讨论闪烁、滞回或双绘，作为“多数中文教程覆盖到哪”的对照样本。 〔中文社区〕
269. **[Cesium3DTileset API：maximumScreenSpaceError / skipLevelOfDetail](https://cesium.com/learn/cesiumjs/ref-doc/Cesium3DTileset.html)** — 瓦片 LOD 用单侧屏幕空间误差阈值 refine，文档没有给出显式滞回带，且 skipLevelOfDetail 允许父子同绘，可作为大规模分块选级的对照。 〔其他〕
270. **[three.js #35564 MeshletDrawingPipeline dithered LOD transitions](https://github.com/mrdoob/three.js/pull/35564)** — 过渡簇单独一次 dither-masked draw，阴影 pass 跳过过渡；开启后 M2 上 60→47 FPS，直接说明淡变多一次绘制且阴影可能硬切。 〔issue/PR〕
271. **[Unity 论坛 Impostors 支持帖](https://discussions.unity.com/t/released-impostors-runtime-optimization/761446)** — 真实用户反馈移动端额外 RenderTexture 内存、动画对象不支持、需写 Z-Buffer、快速飞行相机效果差，补商店页看不到的坑。 〔论坛原帖〕
272. **[three.js 论坛：Blend Geometry in between LOD](https://discourse.threejs.org/t/blend-geometry-in-between-lod/87453)** — 提问者要消 pop 但不想把大网格画两遍；回复给出虚拟几何/连续 LOD 与离散 LOD 的取舍，Usnul 称 9/10 场景离散 LOD 足够且接近零额外开销。 〔论坛原帖〕
273. **[HN：AAA 仍难消 LOD popping](https://news.ycombinator.com/item?id=47082497)** — 从业者评论：AAA 至今仍有刺眼的 LOD popping，难以忽略且难解；说明单靠一个阈值/淡变不保证消失，支持先验可见反例再加层。 〔实测/博客〕
274. **[Three.js 工程向：LOD 距离分级、抖动治理与显存权衡（CSDN）](https://blog.csdn.net/qq_42560681/article/details/160344275)** — 直接给 Three.js 的抖动治理结论：“可通过扩大分级间距或加入滞后阈值减少闪烁”，并提醒 LOD 不替代视锥剔除、每级都占显存；没有展开淡变与合批冲突。 〔中文社区〕
275. **[three.js forum: Blend Geometry in between LOD](https://discourse.threejs.org/t/87453)** — 用户明确要“不把大网格画两遍”地消除 LOD 跳变；回复给出虚拟几何/顶点变形/连续 LOD 等路线，并有人指出做好的离散 LOD 几乎看不出 pop，虚拟几何对多数物件过度。 〔论坛原帖〕
276. **[threejs-nanites（Nanite Forest）](https://github.com/VictorZakharov/threejs-nanites)** — MIT，2026-11-07；three.js WebGPU 的 1M 树/1.5M 灌木 demo，按簇 1 px 误差选 LOD，远处树换成 4 个仰角的烘焙 impostor 并用抖动交叉淡变，WebGPU 专用、WebGL2 回退去掉遮挡与软光栅——给出“网格→impostor+抖动”的完整新样例。 〔仓库/工具〕
277. **[Unreal Nanite 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine)** — Nanite 用 cluster 层级连续选细节、相邻 cluster 无裂缝且没有 authored LOD，是“不要在阈值间来回切”的另一条最高水平路线。 〔官方文档〕
278. **[StackOverflow：three.js object dynamic change with LOD animation](https://stackoverflow.com/questions/52437083/three-js-object-dynamic-change-with-lod-animation)** — Mugen87 明确 THREE.LOD 不做混合，给出在阈值附近同时渲染两级并 alpha 混合的自定义 LOD 写法，并点明双绘更贵。 〔实测/博客〕
279. **[GPU Instancer Pro wiki：Known Limitations](https://wiki.gurbu.com/index.php?title=GPU_Instancer_Pro:FAQ#What_are_the_Known_Limitations.3F)** — 作者自己列出的 LODGroup/实例化使用边界，可核实“根节点只能挂一个 LODGroup”这类约束的来源。 〔实测/博客〕
280. **[Unreal Nanite Virtualized Geometry](https://dev.epicgames.com/documentation/unreal-engine/nanite-virtualized-geometry-in-unreal-engine?lang=en-US)** — Nanite 用虚拟化 cluster 层级替代离散 LOD，是不做传统 LOD 的上限路线；文档说明其与 LOD/流送的边界。 〔官方文档〕
281. **[three.js 论坛：Virtually Geometric（连续 LOD/虚拟几何）](https://discourse.threejs.org/t/virtually-geometric/28420)** — 87453 的回复直接把它当作“虚拟几何”替代方案，作者用 GPU 实时简化到像素级并声称无 popping，代表完全绕开离散 LOD 的路线。 〔论坛原帖〕
282. **[three.js 论坛：WebGPU 虚拟几何的实机反例](https://discourse.threejs.org/t/three-js-webgpu-virtual-geometry-system/89924)** — 同帖回复报告 4090 风扇狂转、笔电和手机直接崩溃，说明虚拟几何的功耗与稳定性成本对小型路肩件很可能不划算。 〔论坛原帖〕
283. **[richardmonette/three-impostor](https://github.com/richardmonette/three-impostor)** — three.js WebGPU 的 box/octahedral impostor，逐像素写深度；可作为远景单卡层，但不负责距离切换。 〔仓库/工具〕
284. **[threeforged/threeforged](https://github.com/threeforged/threeforged)** — three.js CLI 同时提供 LOD 生成、静态合并与 instancing 优化，直接触及“静态批次 vs LOD”的取舍。 〔仓库/工具〕
285. **[R3X-G1L6AME5H/Godot-LOD-Manager](https://github.com/R3X-G1L6AME5H/Godot-LOD-Manager)** — Godot 3 时代（Spatial 节点）的递归 LOD/区块管理器，README 明说要管理“每一个 prop”，接近路肩件批次的接口形态。 〔仓库/工具〕
286. **[puchik/godot-importance-lod](https://github.com/puchik/godot-importance-lod)** — Godot 4 的 C++ LOD 扩展：按连续 Importance 值离散切节点并发信号，提供距离/屏幕误差之外的选择维度。 〔仓库/工具〕
287. **[hdrsniped/octahedral-impostor-lod-godot](https://github.com/hdrsniped/octahedral-impostor-lod-godot)** — Godot 4.7 octahedral impostor，README 明说面向“普通 LOD 撑不住的快速移动竞速游戏”，用 visibility ranges 切真网格与卡片。 〔仓库/工具〕
288. **[wojtekpil/Godot-Octahedral-Impostors](https://github.com/wojtekpil/Godot-Octahedral-Impostors)** — Godot 社区最高星的 octahedral impostor（314 星，2021）：单平面多角度、1400 棵树全用 impostor 的示例，远景单卡化参照。 〔仓库/工具〕
289. **[EdShel/LodTransitions](https://github.com/EdShel/LodTransitions)** — Monogame/DirectX 下对比多种 LOD 过渡技术的小工程，0 星且无成熟文档，但题目正好是过渡方案横向对照。 〔仓库/工具〕
290. **[nashnie/SignificanceManager](https://github.com/nashnie/SignificanceManager)** — Unity 的 Significance 框架：按重要性调 LOD/AI tick/特效，不是纯距离阈；可作为批量道具的预算式选择参考。 〔仓库/工具〕
291. **[Milk-Drinker01/Milk_Instancer01](https://github.com/Milk-Drinker01/Milk_Instancer01)** — Unity 间接 GPU instancing + 遮挡/视锥裁剪 + LOD 的开源实现（139 星），对照 Unity 侧批量+LOD 的接法。 〔仓库/工具〕
292. **[SmartImposter](https://github.com/SamG-Coder/SmartImposter)** — MIT（代码），2026-11-17；RTX 森林渲染器用视差八面体 impostor：真网格 <44 m、两种表示 44–56 m、纯 impostor >56 m，网格与 impostor 共用随机数做逐像素 dissolve；52 个变体 atlas 2.05 GB（未压 10.1 GB），RTX 5080 1440p 8.0 ms DLSS-RR——给出明确过渡带与显存成本，但仅高端 RT。 〔仓库/工具〕
293. **[jessehhydee/level-of-detail：THREE.LOD 成本对比](https://github.com/jessehhydee/level-of-detail)** — 对比 THREE.LOD 与自写懒加载方案，指出 THREE.LOD 会等所有档加载完、且不释放不可见档（加载约 3 倍、常驻内存），是现成 LOD 的直接代价。 〔仓库/工具〕
294. **[zeux/meshoptimizer](https://github.com/zeux/meshoptimizer)** — Godot 自动 LOD 和三个 three.js LOD 工具共同的简化器与误差度量来源，是核对“每级减多少面”的底层依据。 〔仓库/工具〕
295. **[puchik/godot-extras](https://github.com/puchik/godot-extras)** — Importance LOD 的前身 Godot 3 multi-lod 实现，可对照它从节点替换到 Godot 4 连续 Importance 值的演进。 〔仓库/工具〕
296. **[Unity AutoLOD](https://github.com/Unity-Technologies/AutoLOD)** — Unity 官方实验的自动 LOD 生成加 SceneLOD 分层方案，是“导入即生成多级/整场景 HLOD”的现成参照（实验性、无正式支持）。 〔仓库/工具〕
297. **[Whinarn/UnityMeshSimplifier](https://github.com/Whinarn/UnityMeshSimplifier)** — AutoLOD 默认使用的 QEM 网格简化器，可替换，是 Unity 侧生成 LOD 网格的基线实现。 〔仓库/工具〕
298. **[dreadpon/godot_spatial_gardener](https://github.com/dreadpon/godot_spatial_gardener)** — Godot 植被散布插件，proposal #10669 建议在其上加逐实例 LOD，是路肩装饰件按区域批量管理的现成骨架。 〔仓库/工具〕
299. **[pettett/multires](https://github.com/pettett/multires)** — 多分辨率网格渲染，README 明确比较 DAG traverse 等簇选择算法并附 dissertation，适合核 cut 选择策略。 〔仓库/工具〕
300. **[xraxra/IMP](https://github.com/xraxra/IMP)** — 免费 Unity impostor 工具，被上述文章/帖子引用，作为 Amplify 之外的对照实现。 〔仓库/工具〕
301. **[Hoppe Mesh-processing-library](https://github.com/hhoppe/Mesh-processing-library)** — PM/geomorph 的可读参考实现与 demo，能核对论文到运行时代码的差距。 〔仓库/工具〕
302. **[Unity Discussions：Quest 2 中 LOD 切换太近](https://discussions.unity.com/t/lod-transition-happens-too-close-to-player-in-quest-2/1572245)** — 构建到 Quest 2 后 LOD 比编辑器近很多，回复指向 QualitySettings.lodBias 与按 FOV/屏幕占比而非米制距离；说明距离选点会随画质档和视场变化。 〔论坛原帖〕
303. **[Unreal Forums：远景树的 impostor/单三角形 LOD](https://forums.unrealengine.com/t/trees-for-far-far-away/795892)** — 远景树用 billboard/impostor 或单三角形 LOD，可删掉其余 LOD；但前提是不能拉近或用瞄准镜，否则露馅，适合装饰性非碰撞路肩件的远端档。 〔论坛原帖〕
304. **[Babylon Forum：实例网格作为 LOD 网格](https://forum.babylonjs.com/t/instanced-meshes-as-lod-meshes/22162)** — 实例不能作为 LOD 目标，LOD 只按主网格距离选档；评论指出同一批实例只能共享一个 LOD 判定，不能逐实例换档。 〔论坛原帖〕
305. **[PlayCanvas 论坛：运行时 meshoptimizer LOD 脚本](https://forum.playcanvas.com/t/made-some-runtime-lod-scripts-for-playcanvas-auto-mesh-simplification-no-build-step/42694)** — 运行时自动减面并按相机距离换 index buffer；作者明确‘共享同一 render asset 的实体会共享同一 LOD 档’，正是批次共用资产的限制。 〔论坛原帖〕
306. **[Godot forum: foliage visibility range 靠近世界原点缩小](https://forum.godotengine.org/t/111478)** — 实际项目里 foliage 的 visibility range 越靠近世界原点越小，透明物件还会被错误遮挡；调 sorting offset 能绕过但作者认为不可接受。 〔论坛原帖〕
307. **[Unity Discussions: Quest 2 的 LOD 切换比编辑器近得多](https://discussions.unity.com/t/1572245)** — Quest 2 构建里 LOD 切换比编辑器近得多、pop 明显；原因是低画质档 LODBias 与 FOV 不同，改 LODBias/图形设置后解决。 〔论坛原帖〕
308. **[Unity Discussions: URP demo 树木闪烁与 LOD 值](https://discussions.unity.com/t/884617)** — URP demo 的树随相机移动严重闪烁，改 LOD 值后解决，回复判断是 LOD bias；LOD 阈值/bias 是常见闪烁源。 〔论坛原帖〕
309. **[Unity Discussions: 请求 shadows-only LOD 层](https://discussions.unity.com/t/1558879)** — 请求为 LOD 增加 shadows-only 层：影子通常占 GPU 大头，低模影子可单独渲染；帖中同时吐槽 LOD Group 编辑 UX 十年未改、做零 pop 很费劲。 〔论坛原帖〕
310. **[Unity Discussions: 用低 draw distance 让物件整体 pop in](https://discussions.unity.com/t/1701508)** — 想在低 draw distance 让整物件 pop in；回答是 LOD Group 最后一级会被 cull，或自己按距离开关 renderer，说明硬切/无 LOD 也是可选策略。 〔论坛原帖〕
311. **[Unity Discussions: Impostors 资产的 MinAngle 与 LODGroup 依赖](https://discussions.unity.com/t/761446/47)** — 第三方 Impostors 资产里 MinAngleToStopLookAtCamera<70 时 impostor 不显示，用户怀疑 Mali 浮点；每个原始物件还必须挂 LODGroup 负责 cull，远层替代仍依赖 LOD 结构。 〔论坛原帖〕
312. **[Unreal Forums: 背景灯光像距离 LOD 一样 pop](https://forums.unrealengine.com/t/1973200)** — 渲染输出里背景灯光像距离 LOD 一样 pop，说明不透明/自发光 pass 也可能出现类似阈值的突变，不能只盯几何 LOD。 〔论坛原帖〕
313. **[Unreal Forums: 单个 LOD 的静态网格阴影仍随距离 pop](https://forums.unrealengine.com/t/768965)** — 单个 LOD 的静态网格，阴影覆盖仍随相机远近变化并 pop；问题不在几何 LOD，而在阴影 pass 的距离/级联设置。 〔论坛原帖〕
314. **[Unreal Forums: 5.3 静态网格与影子在特定距离一起 pop](https://forums.unrealengine.com/t/1822554)** — 5.3 中静态网格和影子在特定距离一起 pop in，用户找不到可解设置；提供“影子与网格不同步”的现场例。 〔论坛原帖〕
315. **[Unreal Forums: 5.8 VirtualHeightfieldMesh 地形 LOD 轻微移动就跳级](https://forums.unrealengine.com/t/2737099)** — 5.8 VirtualHeightfieldMesh 地形在极小相机移动下整块跳到另一细节级，看起来像不稳定；是虚拟纹理反馈编码改动的引擎 bug，不是内容/LOD 调参。 〔论坛原帖〕
316. **[Unreal Forums: 如何彻底关掉 LOD、只留最高模](https://forums.unrealengine.com/t/664034)** — 用户想彻底关 LOD、只留最高模；说明高配/近景场景存在“保持无 LOD”的真实需求，而不是所有项目都该加层。 〔论坛原帖〕
317. **[Babylon forum: screen coverage LOD 与正交相机](https://forum.babylonjs.com/t/35130)** — screen coverage LOD 在正交相机下消失、透视下平移半个屏幕也不改级；官方承认正交单位错误并给 PR，说明屏幕占比阈值的相机/视口依赖。 〔论坛原帖〕
318. **[Babylon forum: LOD 不作用于 shadow RTT](https://forum.babylonjs.com/t/15325)** — LOD 不作用于 shadow RTT：网格按相机距离隐藏后影子还在；官方修 RTT LOD，用户用 customLODSelector+isVisible 绕过，暴露主/影 pass 不一致。 〔论坛原帖〕
319. **[Cocos 中文论坛: 3.7 LOD 公测与原生平台检测异常](https://forum.cocos.org/t/144284)** — 按屏幕占比切级；原生平台给胶囊加 Collider/Rigidbody 后 LOD 检测异常，官方记 P1 计划 3.7.2 修，说明不同平台/物理组件会改变 LOD 行为。 〔论坛原帖〕
320. **[meshoptimizer clusterlod.h](https://github.com/zeux/meshoptimizer/blob/master/demo/clusterlod.h)** — 单头文件 cluster LOD 参考实现（分区、简化、误差合并），是 Godot 自动 LOD 与 @three.ez/simplify-geometry 的底层，也支撑连续 LOD。 〔源码〕

### 第 321–417 位：中文社区、替代路线与外围工具

321. **[Unity Discussions: LODGroup in VR（LODBias 的 FOV 换算）](https://discussions.unity.com/t/lodgroup-in-vr/654767)** — Unity 工程师给出 LODBias 随 FOV 的换算公式 tan(FOV2/2)/tan(FOV1/2)，直接解释 Quest 上切换距离比编辑器近得多的原因。 〔论坛原帖〕
322. **[Babylon 论坛：instances + LOD 阴影](https://forum.babylonjs.com/t/how-to-cast-shadows-of-instances-with-level-of-detail/13829)** — 把 #9096/#9298/#9320 串成完整时间线，并记录 isVisible/setEnabled/customAllowRendering 的踩坑与 CSM 成本。 〔论坛原帖〕
323. **[needle-tools three.js meshlet creation sample](https://github.com/needle-tools/three.js/tree/feature/meshlet-creation-sample)** — #33605 评论里给出的 meshlet 构建样例，补“cluster LOD 怎么生成”的实践入口。 〔源码〕
324. **[meshoptimizer nanite.cpp demo](https://github.com/zeux/meshoptimizer/blob/master/demo/nanite.cpp)** — 给出 DAG cut/簇误差选择的可读实现，jms55 的 Bevy 文章把它作为 LOD 选择参考。 〔源码〕
325. **[three.js 官方 MeshletDrawingPipeline（r187）](https://github.com/mrdoob/three.js/blob/r187/examples/jsm/pipelines/MeshletDrawingPipeline.js)** — 同一研究对照的官方 WebGPU meshlet 管线，包含对象 LOD 选择与 meshlet 剔除，可核官方对连续 LOD 的当前支持边界。 〔源码〕
326. **[Babylon 论坛：正交相机 screen-coverage LOD 异常](https://forum.babylonjs.com/t/unexpected-behaviour-with-screen-coverage-lods-and-orthographic-camera/35130)** — 正交相机下屏幕覆盖 LOD 会消失/错级，临时改用 distance LOD 可恢复，说明选级指标依赖投影。 〔论坛原帖〕
327. **[移动端 LOD 稳定性：切换抖动、滞回与性能收益如何验证（CSDN）](https://blog.csdn.net/m0_59437018/article/details/169934527)** — 方法清单而非项目实测：用屏幕空间尺寸替代距离触发、上下阈值滞回、最短驻留时间，切换成本按 CPU/GPU/IO/内存分账，并用轮廓差异、关键部件保留和六项回归指标验收。 〔中文社区〕
328. **[Three.js LOD（Level of Detail）（掘金）](https://juejin.cn/post/7508968574704779299)** — 典型 Three.js LOD 教程：addLevel 距离、手动/自动 update、changeLevel 里用 Tween 补淡入淡出，建议避免频繁切换但没有给出滞回实现；可作社区通行做法的样本。 〔中文社区〕
329. **[couchlearn：Fading between LODs in Unreal Engine 4](https://couchlearn.com/fading-between-lods-in-unreal-engine-4/)** — Godot proposal #5240 引用它作为 Unreal 抖动 LOD 淡变的效果参照，含材质开启 Dithered LOD Transition 的步骤，可看双绘的实际表现。 〔其他〕
330. **[Catlike Coding：Unity 自定义 SRP 的 LOD 与反射](https://catlikecoding.com/unity/tutorials/custom-srp/lod-and-reflections/)** — 给出 Unity LODGroup cross-fade 的完整实现：LOD_FADE_CROSSFADE 变体、surface 与 shadow 共用 ClipLOD、IG 噪声抖动，并实测抖动阴影发噪、阈值附近闪烁。 〔实测/博客〕
331. **[Digital Garden：three.js 植被距离 LOD 与 impostor 实测](https://digitalgarden.si/blog/threejs-webgpu-vegetation-lod/)** — 1,600 棵树在 45/90 单位处硬切换，距离 LOD 把三角从 103 万降到 19 万却增加 draw call，且明确未做 dithered transition，三者成本关系可直接对照静态路肩件。 〔实测/博客〕
332. **[JSFiddle f2Lommf5/14585：阈值附近双级混合的可运行实现](https://jsfiddle.net/f2Lommf5/14585/)** — 上述 StackOverflow 回答对应的可运行 blend LOD 实现（threshold 控制过渡宽度），可作为双绘淡变的最小参考或反例。 〔实测/博客〕
333. **[Blue noise crossfade/dither 实现（ChrisPeWebb/bitbucket）](https://bitbucket.org/ChrisPeWebb/bluenoisedither/src/master/src/)** — 完整的蓝噪声 dither crossfade 代码，作者实测与 Bayer 无性能差且近看网格更弱，是替换默认抖动图案的现成参照。 〔实测/博客〕
334. **[Cesium 博客：Cesium for Unreal 的抖动 LOD 过渡](https://cesium.com/blog/2022/10/20/smoother-lod-transitions-in-cesium-for-unreal/)** — 完整描述 UE 侧做法：屏幕空间噪声 + 两个 LOD 互补阈值、都写深度当遮挡体；同时给出双绘、每帧 uniform、0.5 秒默认时长和依赖 TAA 的代价。 〔其他〕
335. **[tw0catsgames：改造 Unity LOD crossfade 抖动来溶解 billboard](https://www.tw0catsgames.com/update/2023/12/28/perfecting-unitys_billboard_shader_for_2d_characters_03.html)** — 给出把 LOD crossfade 的 dither 阈值改由材质 `_Color.a` 驱动的可运行改法，可在不换 LODGroup 的前提下做手动淡变。 〔实测/博客〕
336. **[Unreal Forums：VR 草地淡出与 screen-door 伪影](https://forums.unrealengine.com/t/how-do-you-fade-foliage-out-when-culling-in-the-distance/14364)** — PerInstanceFadeAmount/DitherTemporalAA 能消 cluster popping，但低分辨率/VR 下 screen-door 与立体感发毛；淡变有可见代价，不只是多画一点。 〔论坛原帖〕
337. **[Unreal Forums: Nanite foliage 设 culling 后仍 pop](https://forums.unrealengine.com/t/1742387)** — Nanite foliage 在设置 culling 后仍 pop in/out，用户想要 fade；Nanite 没消除远层切换问题。 〔论坛原帖〕
338. **[three.js PR #33605（Nanite-style 光栅化）](https://github.com/mrdoob/three.js/pull/33605)** — 给定 #35191 的前置 Nanite-style 光栅化 PR，说明 Meshlet/VisibilityBuffer 管线的来源与 1px LOD 误差基线。 〔issue/PR〕
339. **[UCSC《Crowd Rendering with Non-Planar 3D Impostors》](http://users.soe.ucsc.edu/~davis/papers/yee_masters_project_paper.pdf)** — 36613604 同时引用的论文，比较几何简化、2D impostor 与 NP3D impostor 的 popping 和纹理内存权衡，直接支持“远端用 impostor 而非淡变”。 〔论文/报告〕
340. **[Wyman & McGuire 2017：Hashed Alpha Testing（DOI）](https://doi.org/10.1145/3023368.3023370)** — three.js alphaHash 与 Godot 抖动淡变所依据的哈希透明原始论文，解释噪声随采样累积的特性，是判断“抖动淡变是否够干净”的方法基础。 〔论文/报告〕
341. **[Wyman 2017 Hashed Alpha Testing 论文页](https://casual-effects.com/research/Wyman2017Hashed/index.html)** — alpha hash 的原始方法，解释必须按对象空间哈希才能在相机移动时保持稳定，是评估 hashed/dithered 淡变的基础依据。 〔论文/报告〕
342. **[Hoppe：Smooth view-dependent LOD control（terrain）](https://hhoppe.com/proj/svdlod/)** — 用 cascaded geomorphs 在相邻 LOD 间做时间平滑，是不双绘的距离切换替代。 〔论文/报告〕
343. **[nickpaustian/theia](https://github.com/nickpaustian/theia)** — three.js WebGL2 的 cluster-hierarchy LOD：按屏幕误差连续裁切、无离散切换；代表“不做离散 LOD”的另一极（面向单块高密度网格）。 〔仓库/工具〕
344. **[GameDev SE：现代游戏中的 LOD](https://gamedev.stackexchange.com/questions/2752/lod-in-modern-games)** — 从业者答：离散 LOD 仍最常用，连续 LOD 工具成本高、优势不明确；举例 Supreme Commander 远距换 2D 图、Wind Waker 岛屿轮廓与 pop，是离散/连续取舍的社区共识。 〔实测/博客〕
345. **[GameDev SE：什么时候该做 LOD](https://gamedev.stackexchange.com/questions/138720/when-to-use-lod-and-when-not-to)** — 小室内道具/不易远看的 clutter 不必做 LOD，可直接移除；只有确有收益才做。是‘保持无 LOD’停止条件的直接依据（无可见反例、无成本证据就不加）。 〔实测/博客〕
346. **[GameDev SE：用组 LOD 替代逐件 LOD](https://gamedev.stackexchange.com/questions/60898/level-of-detail-load-on-demand-for-crowds-replace-groups-of-objects-instead-of)** — 把一组物体替换成一个简化 blob，而不是逐个减面；对应按 chunk/批次做 LOD 的思路，适合大量同族装饰件的批次接口。 〔实测/博客〕
347. **[HN：接缝处顶点 morph 与 T-junction](https://news.ycombinator.com/item?id=7372194)** — 接缝处把高 LOD 顶点 morph 到低 LOD 平面可减少 snapping；Trigger Rally 用额外顶点避免 T-junction，是保主轮廓的接缝做法。 〔实测/博客〕
348. **[HN：大开放地图的 pop-in 来自 draw distance](https://news.ycombinator.com/item?id=35988766)** — 大开放地图里 pop-in 源于 draw distance，接近时逐级 step-up，PS5 级硬件也存在；对应快速移动/回看时新区域进入视野的可见性。 〔实测/博客〕
349. **[Unity 渲染优化：静态与动态合批技术详解（CSDN）](https://blog.csdn.net/weixin_29009501/article/details/169105591)** — 讲静态合批把合并后的网格视为单个渲染单元、只有完全相同材质才能合批；正文没有展开 LOD 冲突，但足以说明逐件 LOD/剔除与静态批次在所有权上的矛盾。 〔中文社区〕
350. **[当 3DGIS 遇上性能优化：Cesium 实例化绘制在智慧城市中的实战陷阱（CSDN）](https://blog.csdn.net/weixin_29231027/article/details/157622260)** — 仅摘要：明确点出“LOD 与实例化的调度冲突”，可对照 Three.js 的 InstancedMesh/BatchedMesh，检查合批后逐对象距离分级为何失效。 〔中文社区·仅摘要/标题〕
351. **[从渲染 3 万棵树掌握游戏性能优化：Draw Call、GPU Instancing 与 LOD 实战（CSDN）](https://blog.csdn.net/weixin_33428613/article/details/164409428)** — 仅摘要：以 3 万棵树为例讲 Profiler/Frame Debugger 基线、GPU Instancing 合批与 LOD；对应路肩树/灌木这类大量重复装饰件的批次与逐件精度组合。 〔中文社区·仅摘要/标题〕
352. **[Godot 地形渲染优化：LOD 技术原理与三步实现方案详解（CSDN）](https://blog.csdn.net/weixin_29021291/article/details/163489060)** — 仅摘要：用 MultiMeshInstance3D 加 VisibilityRange 做手动距离裁切与平滑过渡，补 Godot 可见距离/visibility range 的中文实践。 〔中文社区·仅摘要/标题〕
353. **[Godot 草地渲染优化：实例化与 LOD 技术实战指南（CSDN）](https://blog.csdn.net/weixin_28675661/article/details/162823482)** — 仅摘要：MultiMeshInstance3D 合批 + 按距离切 LOD + 分块管理，和路肩草/灌木“批次相容性 vs 逐件分级”的问题直接相关。 〔中文社区·仅摘要/标题〕
354. **[Web3D 项目性能优化总结（掘金）](https://juejin.cn/post/7220354212736450616)** — Web3D 性能总结：按距离隐藏远处小物体、材质 LOD 往往够用而不必做 Mesh LOD、合批前提是渲染数据一致；支持“先不加 LOD、先做材质分级与剔除”的最小建议和停止条件。 〔中文社区〕
355. **[【ThreeJS】InstancedMesh 实战：从 20000 个 Mesh 到 1 个 Draw Call（掘金）](https://juejin.cn/post/7601075423002984484)** — 实例化合批的实战标题与摘要明确，可用来评估一旦压成 1 个 Draw Call，逐件距离切换/剔除还能不能保留；正文被站点挑战页挡住，只读到摘要。 〔中文社区·仅摘要/标题〕
356. **[Projected sphere screen size（StackOverflow）](https://stackoverflow.com/questions/21648630/radius-of-projected-sphere-in-screen-space)** — 给出把包围球半径换算成屏幕像素的公式，是“按屏幕误差而非距离切级”的最小数学依据。 〔实测/博客〕
357. **[Filip Strugar：Continuous Distance-Dependent LOD (CDLOD) 论文](https://www.aggrobird.com/files/cdlod_latest.pdf)** — 四叉树规则网格 + 全场景统一 LOD 函数 + 顶点 morph 的完整连续距离 LOD 方案，是离散阈值+滞回之外的对照实现（PDF 共 15 页，已下载核对标题/作者）。 〔论文/报告〕
358. **[@drawcall/lod 自带 SKILL.md](https://github.com/drawcall-ai/lod/blob/main/packages/lod/skills/lod/SKILL.md)** — 同包的 LOD Skill：一级在较粗级上淡入（重叠绘制）、level 内不能再放 three LOD 或非 ImpostorMesh 的 InstancedMesh；是 Skill 市场里最贴近本任务的文件。 〔源码〕
359. **[Unity-Technologies/com.unity.virtualmesh](https://github.com/Unity-Technologies/com.unity.virtualmesh)** — Unity 官方虚拟几何参考代码（CEDEC 2024，明确非生产级）：静态物体在 GPU 端选 LOD/裁剪；用于核“静态批次是否值得上交 GPU”。 〔仓库/工具〕
360. **[【Unity3D】LOD Group 多细节层次（CrossFade 淡出淡入效果）（CSDN）](https://blog.csdn.net/qq_39574690/article/details/144896857)** — 仅摘要：指出不透明 Shader 勾选 Cross Fade 没有渐隐效果、需要改 Shader 才生效；是“哪种淡变真正有多余绘制、有哪些配置门槛”的具体中文案例。 〔中文社区·仅摘要/标题〕
361. **[Unity Shader Dither 实战：消除色带与 LOD 淡入淡出（CSDN）](https://blog.csdn.net/weixin_29682503/article/details/167229032)** — 仅摘要：把 Dither 抖动用于 LOD 淡入淡出、色带消除和移动端低精度帧缓冲；补充 Cross Fade 之外的另一类淡变实现及其适用平台。 〔中文社区·仅摘要/标题〕
362. **[meshoptimizer v1.3](https://github.com/zeux/meshoptimizer/releases/tag/v1.3)** — 2026-09-25 发布；新增 meshopt_SimplifyErrorClamped 让属性感知的 LOD 选择不再过度保守，clusterlod.h 增加 simplify_dilate_borders 并默认启用误差钳制，直接影响自动生成 LOD 的阈值与轮廓保持。 〔源码〕
363. **[Build a London terrace in three.js（配套指南）](https://assetsforthreejs.com/guides/build-a-london-terrace-in-three-js/)** — 配套实操指南；一栋房 38 个放置件来自 19 个部件模型，三级 LOD 由 loadAssembly({level}) 手动按整栋选择而非逐件距离自动切换，四栋 medium 房产生 368 个 mesh——给出“按装配体手动定级、避免逐件跳变”的现成做法（商业资产，帖中称 three 0.186 测过）。 〔其他〕
364. **[Godotite](https://github.com/Arkaein/godotite)** — MIT v0.9.0，2026-10-19；Godot 4.5+ 的 Nanite 风格簇 LOD，按像素误差选无裂缝 cut，带 crack 校验和 draw call 预算；但每个可见簇是独立 RenderingServer 实例，对大量小道具会推高 draw call，适合大型静态网格而非路肩散件。 〔仓库/工具〕
365. **[Software occlusion culling in Block Game](https://enikofox.com/posts/software-rendered-occlusion-culling-in-block-game/)** — 2026-01 文章（HN 2026-09 再热）；CPU 256×128 深度缓冲遮挡剔除约 4 ms，剔除视锥后 50%+ 的块，近处小块/远处大块分层；证明弱设备上“先剔除”可能比加 LOD 更便宜，是对照项而非 LOD 方案。 〔实测/博客〕
366. **[ShaderBits: Octahedral Impostors](https://shaderbits.com/blog/octahedral-impostors)** — Godot 两个八面体 impostor 实现共同引用的原始技术文；正文由脚本渲染，仅标题/摘要（正文未读），提到烘焙视图网格、深度/法线写入与半球映射，是远层替代真网格的上游线索。 〔其他·仅标题/摘要〕
367. **[three-virtual-geometry：WebGPU 虚拟几何体](https://github.com/elad12390/three-virtual-geometry)** — 同样按簇选 LOD，却宣称“无可见 LOD 切换”，可对照 three-nanite 的瞬时切换说明 crack-free cut 与过渡效果的差别。 〔仓库/工具〕
368. **[AIFanatic/three-nanite](https://github.com/AIFanatic/three-nanite)** — HN 217 分的 three.js Nanite 实现（METIS+meshoptimizer DAG），与给定 apekshik/three-nanite 是不同仓库；HN 评论直接批评它缺视锥剔除。 〔仓库/工具〕
369. **[NVIDIA nv_cluster_lod_builder](https://github.com/nvpro-samples/nv_cluster_lod_builder)** — NVIDIA 的连续 LOD 簇构建库（已归档），README 把后续维护明确指向 meshoptimizer clusterlod.h 和 vk_lod_clusters。 〔仓库/工具〕
370. **[NVIDIA vk_lod_clusters](https://github.com/nvpro-samples/vk_lod_clusters)** — NVIDIA 连续 LOD 的 Vulkan 参考渲染器（RTX Mega Geometry + 流式上传），可核簇选择与 streaming 的实现边界。 〔仓库/工具〕
371. **[Scthe/nanite-webgpu](https://github.com/Scthe/nanite-webgpu)** — 浏览器 WebGPU 的 Nanite 实现，demo 参数直接有 impostors_threshold，是“远景 impostor + 近景 cluster LOD”的现成对照。 〔仓库/工具〕
372. **[rhodium.js：three.js 的高层虚拟几何系统](https://github.com/Spiri0/rhodium.js)** — 89924 帖中给出的可运行实现，用 WebGPU 做连续几何 LOD，可作为“虚拟几何替代离散 LOD”的代码对照。 〔仓库/工具〕
373. **[Simon Schreibt：Game Art Tricks 目录](https://simonschreibt.de/game-art-tricks/)** — AC3 LOD Blending 一文所属的技法索引，可继续追同站的 LOD、透明与 impostor 相关条目。 〔实测/博客〕
374. **[Bevy discussion #14998：meshlet 简化瓶颈](https://github.com/bevyengine/bevy/discussions/14998)** — 对 Nanite 式 meshlet 简化瓶颈的批评讨论，提供连续 LOD 不一定省成本的反方证据。 〔仓库/工具〕
375. **[meshoptimizer discussion #750：Nanite-style DAG](https://github.com/zeux/meshoptimizer/discussions/750)** — Nanite 式 DAG 聚类与简化的设计讨论，含替代切分/简化路线。 〔仓库/工具〕
376. **[SimNanite](https://github.com/ShawnTSH1229/SimNanite)** — 另一套 Nanite 风格软件光栅 + 集群 LOD 实现，可和 three-nanite/nanite-webgpu 对照。 〔仓库/工具〕
377. **[MegaLOD-Prefaber（Unity Asset Store）](https://assetstore.unity.com/packages/tools/utilities/megalod-prefaber-all-in-one-lod-prefab-builder-402520)** — Asset Store 的 LODGroup 批处理工具：生成逐级材质与 cross-fade/distance dissolve；商品页明说 dithered LOD cross-fade 需 URP/HDRP shader，Built-in Standard 不支持。 〔市场/列表〕
378. **[Unity 性能优化实战：Fog 与 LOD 协同策略详解（CSDN）](https://blog.csdn.net/weixin_30254435/article/details/98793245)** — 仅摘要：主张用雾的距离欺骗掩盖 LOD 切换 Pop、提升帧率；正好可作为“快速回看时雾是否还遮得住远层”的反例测试对象，而不是直接采纳其结论。 〔中文社区·仅摘要/标题〕
379. **[GPU Gems 2 第 2 章：GPU-Based Geometry Clipmaps](https://developer.nvidia.com/gpugems/gpugems2/part-i-geometric-complexity/chapter-2-terrain-rendering-using-gpu-based-geometry)** — 给出可照抄的顶点形变公式 z=zf+α(zc−zf)、只在每级外缘过渡带混合以及 T-junction 修补，比“blend/alpha”更接近连续无跳变。 〔论文/报告〕
380. **[NVIDIA GDC 2017：Hashed Alpha Testing](https://developer.download.nvidia.com/assets/gameworks/downloads/regular/GDC17/RealTimeRenderingAdvances_HashedAlphaTesting_GDC2017_FINAL.pdf)** — 抖动/alpha hash 的原始技术材料，解释屏幕空间哈希在运动中的不稳定、TAA 累积与 alpha-to-coverage 的取舍。 〔论文/报告〕
381. **[Godot 论坛：Data Aligned CLOD（分块 CLOD + visibility fading）](https://forum.godotengine.org/t/data-aligned-clod/140289)** — 可跑的分块 CLOD addon，记录裙边移除、顶点数与帧率变化，是分块 LOD 接缝与成本的实际参考。 〔论坛原帖〕
382. **[Unreal 论坛：Nanite 性能不及 overdraw 优化的 LOD（实测合集）](https://forums.unrealengine.com/t/nanite-performance-is-not-better-than-overdraw-focused-lods-test-results-epics-documentation-is-dangering-optimization/1263218)** — 大规模实测反例表明 Nanite 并非总比 overdraw 优化的 LOD 快，支持“没有成本证据就不升级技术”的停止条件。 〔论坛原帖〕
383. **[Unity LOD 失效原因与 URP/HDRP/Built-in 全管线解决方案（CSDN）](https://blog.csdn.net/weixin_30294295/article/details/98904676)** — 仅摘要：按 URP、HDRP、Built-in 三条管线拆 LOD Group 失效原因，涉及 Camera 裁剪、Renderer 提交和 Screen Relative 模式；可作为“哪种平台/管线不支持或行为不同”的线索。 〔中文社区·仅摘要/标题〕
384. **[jms55：Bevy 0.15 virtual geometry](https://jms55.github.io/posts/2024-11-14-virtual-geometry-bevy-0-15)** — 以 1px 投影误差选 DAG cut、明确“没有 crossfade，靠相邻级误差<1px 使切换不可见”，是目标阈值/淡变取舍的关键反例。 〔其他〕
385. **[Hugues Hoppe：Progressive meshes](https://hhoppe.com/proj/pm/)** — geomorph/顶点形变的原始论文来源，用记录下来的边坍缩序列在两极间插值，是区分"顶点形变"与 alpha/dither 双绘的权威依据。 〔论文/报告〕
386. **[Amplify Impostors（Unity Asset Store）](https://assetstore.unity.com/packages/tools/utilities/amplify-impostors-119877)** — Asset Store 头部 impostor 工具，列 Dithered LOD Cross-Fade 且 LODGroup 兼容；现成远景替代层入口。 〔市场/列表〕
387. **[MeshLODGenerator（Godot Asset Library 3140）](https://godotengine.org/asset-library/asset/3140)** — Godot 4 市场的 LOD 生成插件（CC-BY-4.0）：只产出各级网格，不含切换/淡变，说明市场头部仍以生产工具为主。 〔市场/列表〕
388. **[Billboard LOD / Impostor LOD generator（Fab）](https://www.fab.com/listings/3b539ad9-8570-49a3-9dbb-780a92dfba41)** — UE/Fab 市场的 Billboard/Impostor LOD 生成器；页面只讲生成，未见过渡/淡变说明，反映市场头部仍是生产件。 〔市场/列表〕
389. **[WebGPU 性能优化：Three.js 千万级点云调度与渲染实践（掘金）](https://juejin.cn/post/7704645330591055882)** — 仅标题与摘要：相机驱动 LOD、视锥裁剪与预算调度的近期工程案例，可看大规模逐对象分级如何与批次/显存权衡。 〔中文社区·仅摘要/标题〕
390. **[【欧卡/美卡】远景全方位提升！模型 LOD & 绘制距离改善（B站）](https://www.bilibili.com/video/BV1Jz4B6LEcr)** — 欧卡/美卡远景 LOD 与绘制距离 MOD 实测，评论有 3060 laptop 可用等反馈；是道路场景路肩装饰远景切换的直接玩家样本。 〔中文社区·视频/评论〕
391. **[\[Godot森林\] SSILVB 测试，更好的 LOD 过渡和优化（B站）](https://www.bilibili.com/video/BV1gBCZBREuW)** — Godot 森林场景的 LOD 过渡演示；评论提到按文档测过 HLOD 可见范围，可看过渡效果与 Godot 侧限制。 〔中文社区·视频/评论〕
392. **[相信后人智慧——LOD-fixes 解决红色沙漠 lod 和 pop-in 问题（B站）](https://www.bilibili.com/video/BV1srhN6BE1j)** — LOD-fixes 修 pop-in 的案例；热评直说原版 LOD 太近、“地上植被边走边长”，是远方物件突然出现的直接负面样本。 〔中文社区·视频/评论〕
393. **[这游戏的 LOD 也太低了吧（B站）](https://www.bilibili.com/video/BV1dLNJ6aE2t)** — 玩家实拍低 LOD 观感，说明远景轮廓/细节跳变会被直接看见；可作为“远近切换保主轮廓、不能读错道路边沿”的反面参照。 〔中文社区·视频/评论〕
394. **[【FF14】远景闪烁？树木抖动？- Reshade 游戏通用抗锯齿教学（B站）](https://www.bilibili.com/video/BV16T411n7Yf)** — 用 Reshade 抗锯齿处理远景闪烁/树木抖动，提醒并非所有远处闪烁都是 LOD 切换；先分抗锯齿/TAA 与 LOD，避免误判。 〔中文社区·视频/评论〕
395. **[PUBG 窗户栏杆 铁丝网 栅栏 电线 锯齿闪烁（B站）](https://www.bilibili.com/video/BV1AC4y1E7XA)** — 细杆、铁丝网、栅栏在移动时锯齿闪烁的玩家报告；对应路肩细件在远近切换时的可读性风险，以及“不能读错实际道路边沿”。 〔中文社区·视频/评论〕
396. **[简单对比 Mesh Shading 传统 LOD 和无级 LOD（B站）](https://www.bilibili.com/video/BV1bq7VzjEpE)** — 传统离散 LOD 与无级/连续 LOD 的对比演示，可用来判断硬切是否必须、连续方案代价多大。 〔中文社区·视频/评论〕
397. **[UE5 场景优化教程：LOD 的原理和设置步骤（B站）](https://www.bilibili.com/video/BV1yc411R7KE)** — UE5 地编 LOD 原理与设置教程，覆盖距离/屏幕占比和层级配置，作为中文社区通行做法的样本。 〔中文社区·视频/评论〕
398. **[LOD 过渡闪烁如何优化？（CSDN 问答）](https://ask.csdn.net/questions/9090924)** — 直接问“LOD 过渡闪烁如何优化”的社区问答；链接当前 521，仅有标题与摘要，可作为真实提问样本。 〔中文社区·仅摘要/标题〕
399. **[【Unity 优化篇】Unity3D 场景常用优化策略：遮挡剔除、层消隐距离技术和 LOD 多层次细节（CSDN）](https://blog.csdn.net/zhangay1998/article/details/123869619)** — 仅摘要：同时讲遮挡剔除、层消隐距离和 LOD；层消隐距离按层整体裁远，可能比逐件 LOD 更能保持静态批次，是“保持无 LOD”的最小替代线索。 〔中文社区·仅摘要/标题〕
400. **[NanoMesh：Seamless rendering on mobile（SIGGRAPH 2024）](https://advances.realtimerendering.com/s2024/content/Cao-NanoMesh/AdavanceRealtimeRendering_NanoMesh0810.pdf)** — 移动端 Nanite 风格无缝渲染的官方 talk，直接对应设备预算与远层简化。 〔论文/报告〕
401. **[dev.to：密集浏览器 prop 的 cluster LOD 三检查](https://dev.to/alicia_lu/three-checks-before-using-cluster-lod-on-a-dense-browser-prop-2227)** — 2026-11 的浏览器 cluster-LOD 实测：30 万三角预算不是硬上限；禁用 multi_draw 时单块岩石 107 次调用；仅桌面静态岩石，手机/植被未测。低热度、AI 辅助，作反例线索。 〔实测/博客〕
402. **[Digital Garden：three.js meshlet/cluster LOD 实测（dev.to 文章的原始完整版）](https://digitalgarden.si/blog/threejs-meshlets-cluster-lod/)** — 给出官方 MeshletDrawingPipeline、three-nanite、手动距离 LOD、单视角卡片四路同场景数据，并指出 300k 三角预算实际选到 300,500、过渡与透明完全未测。 〔实测/博客〕
403. **[jms55：Bevy 0.14 virtual geometry](https://jms55.github.io/posts/2024-06-09-virtual-geometry-bevy-0-14)** — 给出 self/parent error sphere 与两阶段遮挡剔除，可核“阈值附近状态”的实现细节。 〔其他〕
404. **[PavelBoytchev CLOD CodePen](https://codepen.io/boytchev/full/qEqVxrr)** — Eternal Ride 回帖给出的连续 LOD（近处分形噪声、远处只留主 Perlin + Fermat 螺旋极坐标分布）可运行替代，直接对应“不做离散 LOD”的停止条件。 〔实测/博客〕
405. **[elopezr：A Macro View of Nanite](https://www.elopezr.com/a-macro-view-of-nanite)** — WebFetch 被域名安全校验拦截，仅标题/摘要（正文未读）；从标题与摘要看是拆 Nanite 的 cluster 层级与 LOD 选择，便于判断是否值得引入。 〔其他·仅标题/摘要〕
406. **[godotengine/awesome-godot](https://github.com/godotengine/awesome-godot)** — Godot 官方 awesome 列表；LOD 仅收录 Calinou/godot-lod（Godot 3），没有过渡/淡变条目，说明该渠道没有更多可挖的头部项。 〔仓库/工具〕
407. **[Nanite SIGGRAPH 2021 主讲（Karis）](https://advances.realtimerendering.com/s2021/Karis_Nanite_SIGGRAPH_Advances_2021_final.pdf)** — Theia 明确以它为 cluster-hierarchy 连续 LOD 的实现依据；讲解虚拟几何如何避开离散 LOD 档位与切换。 〔论文/报告〕
408. **[Hoppe：View-dependent refinement of progressive meshes](https://hhoppe.com/proj/vdrpm/)** — 视点相关的增量细化/粗化，说明连续 LOD 的选择粒度可细到单顶点。 〔论文/报告〕
409. **[Hoppe：Efficient implementation of progressive meshes](https://hhoppe.com/proj/efficientpm/)** — 把 PM 结构映射到 GPU 顶点缓冲，连接 geomorph 理论与实际绘制路径。 〔论文/报告〕
410. **[Octahedral Impostor LOD（Godot Asset Library 5528）](https://godotengine.org/asset-library/asset/5528)** — 同一插件的 Asset Library 上架页：自动切换走内置 visibility ranges、零运行时脚本；也是 Godot 市场 LOD 搜索的头部结果。 〔市场/列表〕
411. **[Unity Asset Store: Impostors - Runtime Optimization 的用户评论](https://assetstore.unity.com/packages/tools/utilities/impostors-runtime-optimization-188562)** — 市场页 JSON-LD 评论里，移动端用户称 impostor 在已有 LOD 之上再提 60% FPS 且无明显画质损失（2019 年评论）；可作远层 billboard 的市场信号，但评论没有给切换距离或轮廓误差。 〔市场/列表〕
412. **[gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills)** — 9.3k 星的 gamedev agent-skill 市场（79 skills/12 引擎）；按 godot/unity/web-engines 目录逐个查过，无 LOD/过渡 Skill，说明 Skill 市场头部尚空。 〔仓库/工具〕
413. **[scottstts/Threejs-Awesome-Graphics-Agent-Skills](https://github.com/scottstts/Threejs-Awesome-Graphics-Agent-Skills)** — 1k 星的 three.js agent-skill 市场（24 个技能，含程序化植被/几何）；没有 LOD 技能，最接近的植被/几何技能也不处理距离切换。 〔仓库/工具〕
414. **[BeamNG.Earth](https://github.com/TecnaGamer/BeamNG.Earth)** — 2026 新建、2.3k★；1:1 地球流送 mod，按距离切换 LOD 并保留地球曲率，beta 在 BeamNG 0.40.4 实测；是“距离 LOD 流送”的大规模新样例，但尺度与散件完全不同，不能直接套。 〔仓库/工具〕
415. **[blender-skills](https://github.com/EL4CTEO/blender-skills)** — MIT，2.1k★，2026-08-18 后新建；把 Blender 5.2 LTS+/5.3 的建模、UV、PBR、烘焙、绑定、动画、游戏优化与导出流程做成 28 个 Agent Skills，含 headless 测试和多 agent 安装脚本；对“单人+AI 程序化产资产”最直接的新工具。 〔仓库/工具〕
416. **[meshify](https://github.com/lxie-leo/meshify)** — MIT，2026-09-18；面向 Claude Code/Cursor/Codex 等 agent 的 3D 优化 CLI，simplify/lod/segment/convert 等 8 个命令，每次运行写结构化 meshify.report/v1 与语义退出码；把 LOD 生成接进 agent 可核对的流水线。 〔仓库/工具〕
417. **[ts23d](https://github.com/developerz-ai/ts23d)** — 2026-11-18 仍更新（2★，早期）；让 agent 写 TypeScript DSL 直接编译成含 LOD、命名挂点的 game-ready glTF，零运行时依赖，已有模型级三档 LOD 示例；是“AI 生成资产自带 LOD”的新路线，成熟度低。 〔仓库/工具〕

<a id="toc-deepdive"></a>
## 最先看的 12 组为什么最值得深挖

| 清单序号 | 候选 | 先核什么、为什么它排在这里 |
|---:|---|---|
| 1 | three.js `LOD.update` 源码 | 这是唯一一份能直接照抄的实现：`distance = 相机距离 / camera.zoom`，且只有“该层当前已可见”时才把阈值乘以 `(1 - hysteresis)`。它同时给出距离选点、zoom 补偿和回摆门槛三件事，必须先核 245–292 行。 |
| 2 | three.js issue #14565 | 维护者 donmccurdy 给出 50 m 升到 LOD2、要退到 55 m 才回 LOD3 的 d-ε→d+ε→d-ε 数值例，并区分“阈值抖动”和“任何位置都不该来回切两次”。这是回摆门槛示例的原始出处。 |
| 3 | three.js PR #14566 | hysteresis 是合并进 r147 的官方选项，默认 0、需要显式给；讨论说明它就是为了消 LOD 边界闪烁。核它避免把“官方默认有滞回”写错。 |
| 4 | Star-Rush `render-three.js` | 真实批次键是 geometry＋shadow＋opacity；逐实例 opacity 会拆批并转透明材质（`depthWrite=false`），雾是 125–460 m（第 13、34–36 行）。任何“淡变”方案都必须先过这道批次键。 |
| 5 | Star-Rush `scenery.js` | 路肩装饰件按 40 m chunk 生成、每个 key 合并几何，没有任何距离 LOD（第 4、79–80 行）。对象所有权在 chunk 级，LOD 只能按 chunk／批次设计，不能按单件设计。 |
| 6 | Star-Rush `race.js` | circuit 预建全部 chunk，渲染时只跳过与玩家相差 >265 m 的 chunk，阴影只在 <90 m（第 63、107 行）；125–265 m 只被雾部分覆盖，<125 m 完全无雾。快速回看可构造“硬边界暴露”的反例，是“雾遮远层”最直接的本地反证。 |
| 7 | three.js `InstancedMesh` 源码 | 一个 InstancedMesh 只有一个 geometry 和 count，没有逐实例几何／LOD 槽。现有批次要切 LOD 只能拆批或改 BatchedMesh；这是最小建议的硬约束。 |
| 8–10 | `webgl_batch_lod_bvh` 示例＋`batched-mesh-extensions`＋PR #32369 | 官方批次 LOD 的现状与边界：示例在 BatchedMesh 上做 5 级逐实例 LOD；扩展明确“目前只能添加共享同一顶点数组的 LOD”；核心 PR 被以“用例太专门”为由关闭。三者合起来回答“现有批次接口能服从到什么程度”。 |
| 11 | 官方 `webgl_lod` 示例 | 50/300/1000/2000/8000 世界距离、`addLevel` 不传 hysteresis，只靠 `Fog(0x000000, 1, 15000)` 遮远层。它既是官方示例，也是“雾遮远层”的反例素材：示例本身没有解决切换。 |
| 12 | Godot `_visibility_range_check` 源码 | 硬切滞回由当前 viewport 状态翻转 begin/end offset 实现，可直接改写成 `d-ε → d+ε → d-ε` 的回摆判定；与 three.js 的乘性公式不同，可做交叉核对。 |
| 13 | Godot `visual_instance_3d.cpp` 警告 | 构建期就警告 visibility range transparency fade 只在 Forward+ 可用；Mobile／Compatibility 没有该淡变。这是“哪种平台不支持”的行级证据。 |
| 14 | Godot `visibility_ranges` 文档与 GeometryInstance3D 参考 | `margin` 在 Disabled 模式是滞回距离、在 Self/Dependencies 模式是淡变过渡带；淡变会强制透明、有排序与双绘代价。配合官方 demo 的 20/150/450/1900 与 5/50/100 过渡带，可给出数值示例。 |

紧随其后的同类证据：Unity 的 Mesh LOD 文档明确“静态合批永远选 LOD0”，GPU Resident Drawer 不支持 animated cross-fade，LOD Group 的 cross-fade 会同时渲染当前与下一级；Unreal 的 Dithered LOD 是逐材质开关、过渡期间同时渲染两套 LOD，且多材质槽任一未开就整体失效。它们分别补上“静态批次相容性”“淡变双绘”“平台／配置门槛”三块。

<a id="toc-index"></a>
## 按结论槽位选读

后续写作需要落四类结论时，先读对应候选；下表只做索引，不代替读正文。

| 要回答的问题 | 先读（清单序号） | 需要核到的证据 |
|---|---|---|
| 距离从哪里量 | 1、45、46、53、56、57 | 世界原点 vs 包围球中心 vs 包围球表面；zoom／FOV／lodBias 是否进入选点 |
| 往返门槛怎么设 | 1、2、3、12、58、59、151 | 乘性 `(1-hysteresis)`、offset 翻转、margin=0 仍瞬切、非零 LODBias 下死区失效 |
| 哪种淡变有额外绘制 | 4、7、14、17、18、24、25、28、30 | 同时渲染两级、透明材质拆批、dither 图案、阴影 pass、shader 变体成本 |
| 哪种平台／管线不支持 | 13、17、19–23、32、33 | Godot Mobile／Compatibility、Unity GRD／静态合批、UE 材质槽与 FOV |
| 快速回看＋雾遮远层反例 | 4、6、11、38、39、40、41 | 265 m 硬边界、125–460 m 雾、低画质档雾消失、雾只遮远不替代切换 |
| 可服从现有批次接口的最小建议 | 4、5、6、7、8、9、10、48、51、52、53 | 不改 batch key；按 chunk／整批选层；要淡变则单独一档或只用远层单卡 |
| 保持无 LOD 的停止条件 | 42、89、135、161、167、169、197、344、345、346 | 无可见反例、无成本证据；加 LOD 后 draw call／FPS 反降的实测 |

其中 **d-ε→d+ε→d-ε 的数值例**见第 2 项（50 m 升到 LOD2、退到 55 m 才回 LOD3）与第 12 项（Godot 的 begin/end offset 翻转实现）；**快速回看＋雾遮远层的反例**见第 6 项（125–265 m 只被雾部分覆盖、<125 m 无雾）与第 11 项（官方 `webgl_lod` 只用 `Fog(1, 15000)` 遮远层）。第 29 项只核到 URL、第 47 项文档页已 404，二者已在表中移除，只作入口而不作结论证据；第 29 项只作 UE 官方入口，其机制／平台限制以第 28、30–34 项（以及第 218、258、264 项）为准。选读表「哪种平台／管线不支持」一行以第 13、17、19–23、32、33 项为准。首屏结论是基于这些条目的工作建议，最终采用仍要由后续单元读正文和实测确认。

<a id="toc-gaps"></a>
## 覆盖缺口与未读范围

- 本单元只做来源采集与链接核对，未运行 three.js／Godot／Unity／Unreal，未取得帧耗、截图、分数或实机录像；所有“效果”结论仍是作者、论坛或官方文档原文，不是本仓实测。

- Unreal 官方 Dithered LOD Transition、LOD Settings 等页正文由 JS 渲染，只核到 URL 可访问；UE 的机制描述主要来自论坛原帖与维护者回复。

- Unity issue tracker 的 #15625、#6079、UUM-91634 只读到标题；版本、状态与复现步骤靠 Unity Discussions 交叉确认。

- 中文 CSDN／掘金多篇只读到标题与搜索摘要，已在条目上标“仅摘要”；其中两篇 CSDN 正文由“墨衍 AI 创作全网分发”生成、无外链，不作为可追引用。

- 公众号三条（SquareDuble、西山居技术、CIM 可视化研发中心）只拿到标题与摘要，原文链接被 antispider／captcha 拦住，未列入候选，只留作待查线索。

- Reddit、Lobsters、V2EX、知乎、YouTube／GDC 视频、Wayback 在本机不可达；GitHub REST API 多次限流，检索面可能不完整。

- 417 项是链接核对后的清单；收集阶段原始候选总数与链接核对丢弃数未随本批输入给出，记为 unknown。

<a id="toc-appendix"></a>
## 附录：读不到的渠道（148 条，按原因归类）

下表是收集阶段记录的不可达条目，按主因归类；同一原因可能横跨两类，计数只表示本组条目数。原始记录保留在每组的条目里，未改写成“没有内容”。同一条目可能在一次抓取不可达、另一次抓取进入候选；下面各组里“故未列为候选”只指该次抓取，不否定条目本身的其他记录或候选资格。

| 原因类别 | 条数 | 代表性渠道与原因 |
|---|---:|---|
| Epic／Unreal 官方文档与 issue tracker | 23 | `dev.epicgames.com` Cloudflare challenge／JS 空壳；`docs.unrealengine.com` 403；`issues.unrealengine.com` 的 UE-295919、UE-296133、UE-221257 403。 |
| GitHub API 限流、Trending 与部分仓库页 | 18 | 未认证 60 次/小时额度耗尽；Trending 静态 HTML 不含仓库列表；GitHub 代码搜索需登录；`xraxra/IMP` 404。 |
| Unity 官方文档、issue tracker 与 Discussions | 16 | `discussions.unity.com` 的 `search.json` 与 HTML 搜索 403「Crawler is not allowed」；`issuetracker.unity3d.com` 旧链重定向到 not-found；tracker 正文只渲染标题。 |
| Reddit | 4 | `www.reddit.com`／`old.reddit.com`／`api.reddit.com` 的 schannel TLS handshake 失败，WebFetch 拒绝，Arctic Shift Timeout。 |
| Lobsters、V2EX、知乎、即刻、NGA、3DM、少数派、公众号 | 12 | Lobsters 被 Anubis proof-of-work 拦；V2EX API 000；知乎 ZERR_NOT_LOGIN／403；NGA 301 后 403；3DM 正文为空；少数派搜索 0 条；公众号原文 antispider／captcha。 |
| 通用搜索引擎与抓取代理 | 14 | WebSearch 只回显或返回伪调用；DuckDuckGo／Google／Brave／Startpage TLS 失败；Bing 302 到 cn.bing.com 后结果跑偏；Mojeek captcha；Yandex 验证页；grep.app Vercel checkpoint；r.jina.ai TLS 失败。 |
| Wayback Machine / archive.org | 8 | WebFetch 明确拒绝，curl 000；CDX 连接失败；无法恢复 pheelicks 与 n00body 的已下线原文。 |
| YouTube、B 站、GDC 视频与字幕 | 9 | YouTube TLS 握手失败、oEmbed 为空；B 站视频页 412（需 cookie／风控），只经搜索与 view/reply API 确认标题与评论；GDC PDF 403；未逐帧观看任何视频。 |
| CSDN、掘金、博客园等中文站点 | 3 | CSDN 多篇 521 或“订阅专栏”截断；掘金多篇 2492 字节挑战页；只能保留标题与摘要。 |
| Godot 官方 issue/PR/文档/论坛 | 1 | Godot PR #48847 页面内嵌 JSON 结构不同，正文与评论未解析；godotdevelopers.org 论坛只返回站点空壳。 |
| Cocos／PlayCanvas／Cesium／Babylon 官方 | 4 | Cocos LODGroup API 只有标题；PlayCanvas 官方 LOD 手册 404；Babylon typedoc 截断；Cocos 中文搜索“闪烁／跳变”为 0。 |
| 个人博客与技术文章原站 | 12 | `shaderbits.com` 正文由脚本渲染；`pheelicks.com` 404；`bgolus.medium.com` 连接失败；`tulrich.com` 被域名安全校验拦截；`elopezr.com` 与 `assetsforthreejs.com` 同样被拦。 |
| 资产市场、Polycount、StackOverflow、ShaderToy 等 | 13 | Asset Store 搜索页与评论区客户端渲染；Fab 只读 JSON-LD；Polycount 搜索 403；StackOverflow 52437083／21648630 Cloudflare 403；ShaderToy 403；Bitbucket 只返回外壳。 |
| 其他（文档改版、站点下线、客户端渲染等） | 11 | 文档改版 SPA 404、站点下线、客户端渲染或 `[Content removed]` 等，详见下方原始记录。 |

### Epic／Unreal 官方文档与 issue tracker（23 条）

1. dev.epicgames.com（Unreal 官方文档与 community API）：Cloudflare challenge，curl/WebFetch 均 403 或只返回 JS 空壳，无法读到 Dithered LOD Transition 正文
2. docs.unrealengine.com 旧版文档域名：403
3. Epic/Unreal 官方文档页：正文由 JS 渲染，未取到可引用的 Dithered LOD Transitions 原文，故未列入候选。
4. Unreal Issue Tracker：UE-295919、UE-296133 返回 403，WebFetch 与 curl 均不可读，只能读论坛转述和帖内链接
5. unrealengine.com/blog：403 Forbidden，未能核 Unreal 5.9 是否发布。
6. dev.epicgames.com：Material Properties 等页面是 Angular 壳，只返回 “Table of Contents”，Unreal 材质属性页正文无法读取；只有 HLOD/Nanite 页能通过 WebFetch 取到正文。
7. dev.epicgames.com “level-of-detail-in-unreal-engine” 总览页：WebFetch 只返回目录，未能核对 LOD Hysteresis/screen-size 设置正文。
8. issues.unrealengine.com/issue/UE-295919 — HTTP 403（WebFetch 与 curl 均被拒）；只能从 Unreal 论坛帖正文读到该链接，无法核对条目内容
9. issues.unrealengine.com/issue/UE-221257 — HTTP 403（HISM+WPO 抖动消失帖引用的公开追踪条目）
10. docs.unrealengine.com/en-us/Engine/Animation/Persona/MeshDetails — HTTP 403；three.js #14565 用它说明滞回只作用于 complex→simple
11. issues.unrealengine.com 的 UE-295919、UE-296133：curl 和 WebFetch 均返回 403，无法读取正文；标题与结论只能取自 Unreal 论坛 2601486、2604963 帖内的引用描述。
12. dev.epicgames.com 的 Unreal 文档正文 — 页面 200 但 WebFetch/curl 只返回 JS 壳与目录，未能读到 Dithered LOD / LOD 文档正文，仅确认 URL 可访问。
13. issues.unrealengine.com/issue/UE-221257：403 Forbidden，只能从论坛帖转述知道 5.6 修复。
14. issues.unrealengine.com 的 UE-296133、UE-295919、UE-221257 详情页：WebFetch 与 urllib 均返回 403，只能从论坛转述取得摘要。
15. dev.epicgames.com 的 UE 官方文档与 API 页（Material Properties、AllowDitheredLODTransition、LOD 页）经 WebFetch 只返回 “Table of Contents”，正文由 JS 渲染，无法引用 Dithered LOD Transition 的官方描述。
16. docs.unrealengine.com 旧版文档返回 HTTP 403。
17. issues.unrealengine.com 的 UE-296133、UE-295919：HTTP 403；issue 号与内容改从对应 Unreal Forum 帖核对。
18. docs.unrealengine.com/en-us/Engine/Animation/Persona/MeshDetails：HTTP 403。
19. dev.epicgames.com 官方文档页：只返回 Table of Contents（JS 渲染）；Epic 社区教程只返回标题，正文读不到。
20. issues.unrealengine.com（UE 公共 issue tracker）：WebFetch 返回 403，UE-43880 与 UE-221257 的原始状态无法核对，只能引用论坛转述。
21. dev.epicgames.com 的 level-of-detail 与 HLOD 页面：只返回目录或高层概述，没有过渡、dither 或 hysteresis 正文，无法作为淡变依据。
22. Unreal Issue Tracker UE-296133 及 tracker 搜索：Cloudflare 403；UE-295919 仅首次抓取成功。
23. Epic 文档 using-dithered-lod-transitions 与 static-mesh-lod-settings：正文仅返回 'Table of Contents'，JS 渲染不可读；UE 的 LOD Hysteresis 字段说明未能从官方页核实。

### GitHub API 限流、Trending 与部分仓库页（18 条）

1. GitHub REST API：达到未认证限流（（出口地址已隐去）），PR 正文改用网页读取
2. GitHub Trending（/trending?since=daily|weekly 及语言页）：返回的静态 HTML 不含仓库列表，无法读取趋势榜。
3. GitHub REST API：中途未认证 60 次/小时限额耗尽，后续仓库树与部分检索改用 github.com HTML 与 raw.githubusercontent.com。
4. GitHub REST API 未认证 60 次/小时：多次 403 rate limit，部分 issue/PR 搜索与评论改用 WebFetch 页面阅读，可能少读若干回复。
5. GitHub REST API：core 配额用尽后返回 403 rate limit exceeded，后续 issue/PR 正文改走 WebFetch/HTML，部分评论、星标和跨仓库代码搜索没取到。
6. GitHub 代码搜索/仓库搜索 HTML：需要 JS 或登录，未登录只返回空壳，无法按代码反查全部引用。
7. GitHub REST API：匿名请求触发 429/rate limit（（出口地址已隐去）），大量 repo 元数据改用 raw README 与 HTML 页面读取。
8. xraxra/IMP：被 wojtekpil 和 three.js 森林帖引用的 Unity 八面体 impostor 实现，链接返回 404（仓库已不可达）。
9. GitHub REST API 中途触发未认证限流（（出口地址已隐去）），后续改用 raw.githubusercontent.com 与 github.com HTML；搜索类结果可能不完整，但已读到的 PR/issue 内容未缺。
10. GitHub REST API：匿名配额 60/h 被同 IP 用尽（remaining 0，约 50 分钟后重置），后半程改用 github.com HTML 和 raw.githubusercontent.com 核对，未造成内容缺口。
11. 旧链接 github.com/Unity-Technologies/ScriptableRenderPipeline/blob/master/com.unity.render-pipelines.core/ShaderLibrary/Common.hlsl 已 404（仓库迁到 Unity-Technologies/Graphics），候选改用新仓库同路径并已核对 LODDitheringTransition 源码。
12. github.com/EpicGames/UnrealEngine/pull/14992 — 404，需 Epic 组织登录，无法读 PR 正文与关联 issue（给定 UE 5.8 VHM 帖的唯一外链）。
13. GitHub REST API — 未认证限额在数次请求后耗尽（（出口地址已隐去）），改用 raw README/HTML；部分 issues 页 WebFetch 报 Socket closed。
14. GitHub REST API：本机无 gh，未认证请求返回 403 rate limit（IP （出口地址已隐去）），改用 GitHub HTML 页面与 raw.githubusercontent.com。
15. xraxra/IMP（85735 引用的 Unity impostor 工具）：GitHub 返回 404，仓库已不可达。
16. GitHub REST API 未认证额度用尽（api.github.com 返回 rate limit exceeded），只能改读 github.com HTML 页。
17. DuckDuckGo / Bing 的 curl 通道：TLS 握手失败或空响应，通用搜索引擎不可用；改用各站 Discourse JSON 与 GitHub API。
18. xraxra/IMP：GitHub 返回 404（仓库不存在或已迁移），未读到 README 与实现。

### Unity 官方文档、issue tracker 与 Discussions（16 条）

1. Unity Discussions：部分查询 403 Forbidden（限流/反爬），已换浏览器 UA 并间隔重试，仍有数条查询未完成；未把失败当作无内容。
2. Unity Issue Tracker：issuetracker.unity3d.com 旧链接重定向到 issuetracker.unity.com/not-found，无法核对 #15625/#6079 原始页，只能读 discussions 自动生成的讨论帖
3. Unity Discussions HTML 搜索：403“Crawler is not allowed”；JSON search 需 X-Requested-With 头才能读
4. discussions.unity.com：403 “Crawler is not allowed”，Unity 论坛原帖读不到。
5. discussions.unity.com：search.json 返回 403 “Crawler is not allowed!”，Unity 社区帖未读。
6. discussions.unity.com：curl 被 “Crawler is not allowed!” 拦截，只能用 WebFetch 逐帖读，无法批量取 JSON。
7. docs.unity3d.com/.../mesh-lod-troubleshooting — 给定 Mesh LOD 页指向的该 URL 返回 404，无法核 troubleshooting 正文。
8. Unity Issue Tracker 详情正文：页面是 JS 空壳，redirect API 只返回标题，没有版本、状态、描述或 workaround。
9. discussions.unity.com 的 search.json 返回 “Crawler is not allowed”，无法枚举 Unity 论坛帖子，只能逐条读取已知主题页。
10. issuetracker.unity3d.com 的 issue 页只渲染标题（UUM-91634 等），redirect API 也无正文，问题状态只能从 Unity Discussions 帖中交叉确认。
11. Unity 文档部分旧 URL（6000.0 class-LODGroup、SL-UnityShaderVariables、2d-images-lod）：301/404；改用重定向后的 6000.0 手册页、URP Asset 页和 URP shader 源码。
12. Unity issue tracker 页面只暴露标题，版本、状态与复现步骤读不到。
13. discussions.unity.com 的 .json 直连 curl 返回 403；改用 WebFetch topic 页（含 search.json）。
14. discussions.unity.com（Unity 官方社区）：/search.json 所有查询均返回 HTTP 403，网页搜索页只返回“This is not the content you are looking for”，未能读取任何 Unity 社区帖。
15. Unity DrawCallBatching（静态合批）页：可读，但全文没有 LOD 相关陈述，未能取得“静态合批只用 LOD0”的官方原文，故未列为候选。
16. Unity Issue Tracker #15625、#6079：Next.js 客户端渲染，HTML 仅标题/元数据，无正文与关联 issue。

### Reddit（4 条）

1. Reddit search.json：返回非 JSON（被拦）
2. Reddit：www.reddit.com 与 old.reddit.com 直连 schannel TLS handshake 失败，WebFetch 拒绝；Arctic Shift 搜索接口持续 Timeout，未取得原帖或评论。
3. Reddit（old.reddit.com / api.reddit.com）：TLS handshake 失败，无法打开 r/gamedev 等搜索
4. reddit.com、old.reddit.com、api.reddit.com：curl 返回 HTTP 000，WebFetch 报“unable to fetch from www.reddit.com”，r/gamedev、r/threejs 的新帖无法读。

### Lobsters、V2EX、知乎、即刻、NGA、3DM、少数派、公众号（12 条）

1. Lobsters 搜索：search.html 与 search.json 均被 Anubis proof-of-work 反爬拦成 challenge；只能读 /rss、/hottest.json、/t/graphics.json，当前页无 LOD 主题，未取得搜索原帖。
2. 微信公众号原文：搜狗微信能索引到 SquareDuble《LOD 什么时候该切? Three.js 远近细节的三个对比》（摘要：切换跳变多因两层网格轮廓差异过大，而非切换函数写错）、西山居技术《LOD 技术在 Unity 手游项目中的应用》（摘要：分析 LOD Group 不适合手游的四点原因）、CIM 可视化研发中心《UE 实战：基于 LOD 的 CIM/数字孪生场景性能优化》（摘要：相邻 LOD 切换距离至少拉开相机高度的 20%）等标题和摘要，但 weixin.sogou.com/link 返回 antispider，mp.weixin.qq.com 返回 wappoc_appmsgcaptcha/参数错误，未能取得原始 mp.weixin.qq.com 链接；三条只能作为待查线索，未列入候选。
3. 知乎：搜索 API 返回 ZERR_NOT_LOGIN，专栏页直连 403 Forbidden；只能通过星光咖啡馆的引用确认 p/403881113 等文章存在，正文未直接读到。
4. 少数派：站内搜索 API 用 keyword=LOD、细节层次 均返回 0 条，未发现与本题相关的实战文章。
5. 即刻：没有公开搜索接口，网页端也未取到可检索内容。
6. NGA：原帖 301 到 bbs.nga.cn 后 403 Forbidden（“移动时远处电线杆和铁丝网等较细的东西闪烁严重”），无法读回复。
7. 3DMGAME：LOD 闪烁修复帖正文为空（疑似登录/反爬），无法确认修复方法。
8. 知乎 API：403 需登录，无法检索中文问答
9. lobste.rs：返回 Anubis 反爬页（“Making sure you're not a bot”/Access Denied），无法搜索。
10. v2ex.com：API HTTP 000，站点同样被人机验证拦截，无法检索。
11. zhihu.com：搜索页 HTTP 403 Forbidden，无法读中文问答。
12. 知乎：zhuanlan.zhihu.com/p/403881113 与 zhuanlan.zhihu.com/p/1918621136578650455 均返回 HTTP 403（需登录/反爬），正文及其引用链接未能读取。

### 通用搜索引擎与抓取代理（14 条）

1. WebSearch 工具：多次返回空结果或伪造的工具调用文本，不能作为检索渠道
2. DuckDuckGo HTML/Lite、Bing（含 cn.bing）、Mojeek、Brave、grep.app：curl 空响应、403、验证码或连接被关
3. 通用网页搜索：WebSearch 工具只回显查询参数、无结果；DuckDuckGo HTML 返回 000；Bing 搜索页无有机结果链接，未能作为发现渠道使用。
4. 通用搜索引擎：Google、DuckDuckGo、Brave、Startpage TLS handshake 失败；Mojeek 返回 Captcha；Ecosia 返回 Firewall；Yandex 仅返回 14 KB 验证页；Bing 302 到 cn.bing.com 后只给中文 BIM/LOD 百科结果，故主要靠站点 API 与站内搜索。
5. 搜索引擎：Google curl 返回 000 不可达；Baidu 结果页为空；DuckDuckGo html 端点 socket closed；Bing CN 对中文技术查询大量给出无关结果（BIM 的 LOD、搜狗输入法等），无法作为主检索。
6. 通用搜索引擎：Bing 被重定向到 cn.bing.com 且结果与查询无关，DuckDuckGo/Brave/Mojeek 因 TLS 或 captcha 失败；内置 WebSearch 返回的是无实时结果的生成式回答，未采信
7. Bing/Google/Brave/DuckDuckGo HTML：Bing 302、Google/Brave/DDG HTTP 000；WebSearch 工具仅返回 example.com 占位或未解析的工具调用，没有可用实时搜索结果。
8. WebSearch 工具：多次只返回回显/无实时结果；DuckDuckGo、Google、Brave、Bing 直连 curl 均为 000 或返回无关结果，无法用搜索引擎做 site: 反查。
9. WebSearch 工具：本环境调用只回显伪造的工具调用或空结果，拿不到可用 SERP；改用给定链接追踪与同单元缓存的检索记录。
10. DuckDuckGo HTML / Bing：curl 访问 DuckDuckGo 报 schannel TLS handshake failed，Bing 结果页为 JS 渲染且无可解析链接，未作为检索渠道。
11. DuckDuckGo HTML 搜索与 r.jina.ai 代理在本机 TLS 握手失败；grep.app API 被 Vercel Security Checkpoint 拦截。
12. WebSearch 工具：本会话多次调用只返回伪工具调用/固定答案（其中一次明确说没有 live web-search），未作为发现渠道。
13. DuckDuckGo（html/lite）：curl TLS handshake 失败，WebFetch lite 返回 Socket closed。
14. Bing（cn.bing.com）：多次 site: 查询只返回通用 LOD/BIM 页面，未能作为有效发现渠道。

### Wayback Machine / archive.org（8 条）

1. web.archive.org：WebFetch 明确拒绝，curl 返回 000
2. pheelicks.com/rendering-large-terrains/：HTTP 404；Wayback/CDX 连接失败，原文不可读；只读到 HN 讨论串对它的引述与评论。
3. Wayback Machine（archive.org/wayback、web.archive.org/cdx）：空响应或 TLS handshake 失败，无法恢复已删除的 pheelicks 原文。
4. web.archive.org：n00body《Stippled Alpha》存档用 curl 连接失败（000）、WebFetch 拒绝抓取；原 squarespace 站点早已下线，正文未读，只保留 GTA V 研究里的引用与描述。
5. garagegames.com/community/forums/viewthread/90667 — curl TLS 握手失败、WebFetch 报 Socket is closed；archive.org 也不可达（Simon Schreibt 文中 alpha8 淡变与雾问题的来源）
6. polycount.com/forum/showthread.php?t=115889 — HTTP 403；archive.org 不可达（Simon Schreibt 文中链接的讨论帖）
7. godotdevelopers.org/forum/discussion/comment/17817 — 只返回站点空壳，Wayback API 无快照；Godot #6375 所称的原始论坛讨论已读不到
8. web.archive.org — WebFetch 明确拒绝抓取，无法用快照恢复上述论坛页

### YouTube、B 站、GDC 视频与字幕（9 条）

1. YouTube / GDC 视频与字幕：TLS handshake 失败，未取得任何演讲视频、字幕或讲稿。
2. B站页面：curl 直接取视频页返回 412（需 cookie/风控），候选链接经搜索 API 与 view/reply API 确认 bvid、标题和评论存在。
3. YouTube 等视频证据：未逐帧观看，只读帖内文字描述
4. GDC 2018 “Between Tech and Art” PDF 与 StackOverflow 52437083：返回 403（反爬），只保留了论坛里的引用上下文。
5. YouTube：watch 页 curl 连接失败（000），oEmbed 返回空；Billy Khan/idTech8 访谈和 SSILVB 视频只能依赖 B 站与论坛转述，未直接核实画面内容。
6. GDC 幻灯片：twvideo01.ubm-us.net/o1/vault/gdc2018/presentations/gilbert_sanders_between_tech_and.pdf 返回 403，Far Cry 5 植被 LOD 的原始 slides 未读（GDC Vault 同场次页面需会员且检索到的 play id 对应另一场 Terrain Rendering）。
7. YouTube 的“No more popping! LOD crossfading with Unity”（zWxoBz1Pav8）等视频：oEmbed 和页面在 SSL 层报 UNEXPECTED_EOF，未读，未列为候选。
8. GDC 2018 的 gilbert_sanders_between_tech_and.pdf（20524 引用）：UBM 原始域名 302 后 S3 仍 403，标题、作者与内容无法核实。
9. YouTube Billy Khan 访谈：无字幕抓取渠道，未读内容。

### CSDN、掘金、博客园等中文站点（3 条）

1. CSDN：多篇文章触发 521 安全验证，158757640 在 LOD 分级表处被“订阅专栏”截断，98793245、157622260、167229032、98904676、163489060、162823482、123869619 等只读到标题与搜索摘要；候选理由已标注“仅摘要”。
2. 掘金文章页后段：多数返回 2492 字节挑战页（“Please wait...”），7601075423002984484 与 7704645330591055882 仅确认标题/摘要，正文未读到。
3. CSDN 反爬：m0_59437018/article/details/169934527、qq_42560681/article/details/160344275、qq_33060405/article/details/158757640、weixin_30294295/article/details/98904676、weixin_39574690/article/details/144896857、ask.csdn.net/questions/9090924 返回 HTTP 521；仅 weixin_30300225/98524884 与 weixin_30254435/98793245 可读，后两篇为 AI 生成且无外部引用。

### Godot 官方 issue/PR/文档/论坛（1 条）

1. Godot PR #48847 页面：内嵌 JSON 结构不同，未能解析出正文与评论。

### Cocos／PlayCanvas／Cesium／Babylon 官方（4 条）

1. Cocos 中文关键词“LOD 闪烁/跳变”搜索结果为 0，改“LOD 切换/模型”才命中；不是渠道不可达，但覆盖面有限
2. doc.babylonjs.com typedoc 的 customLODSelector 页：内容截断只剩标题，改读 Babylon.js scene.pure.ts 源码确认。
3. PlayCanvas 官方 LOD 文档：/user-manual/graphics/advanced/lod/ 与 /user-manual/graphics/lod/ 均 404，未找到可读的 LOD 手册页。
4. Cocos Creator LODGroup API：仅 'Cocos Creator API' 标题，无正文。

### 个人博客与技术文章原站（12 条）

1. shaderbits.com/blog/octahedral-impostors/：正文由脚本渲染，curl 只得到标题与标签，无文章正文；仅 HN 讨论转述其做法。
2. bgolus.medium.com/rendering-a-sphere-on-a-quad-13c92025570c：连接失败（curl 000），只能看到论坛引用文字。
3. pheelicks.com/rendering-large-terrains/ — HTTP 404；HN 故事 7371802 的原文（其评论区在候选组内），原文已失效
4. ShaderBits：https://shaderbits.com/blog/octahedral-impostors 返回 200 但正文由脚本渲染，只拿到标题与 meta 描述，具体实现细节未核。
5. www.elopezr.com/a-macro-view-of-nanite — WebFetch 被域名安全校验拦截，未读正文，故未列为候选。
6. assetsforthreejs.com/benchmarks/ — 同样被域名安全校验拦截，未拿到三角形/帧耗基准。
7. shaderbits.com/blog/octahedral-impostors：只返回页面元数据/标签，读不到正文，故未列为候选。
8. polycount.com/forum/showthread.php?t=115889（Simon Schreibt 评论区外链）：403，无法读原帖。
9. pheelicks.com/rendering-large-terrains（HN 7372406 等评论的母帖链接）：http 与 https 均 404，文章已下线。
10. bgolus 的 Rendering a sphere on a quad（Medium）：直连超时，未能核验，故未列入候选。
11. tulrich.com（Thatcher Ulrich 的 Chunked LOD 原文）被 WebFetch 安全校验拦截，域名无法验证，未能读到正文。
12. bgolus Medium 'Rendering a Sphere on a Quad'：schannel TLS handshake 失败，链接来自 three.js 论坛但原文未读。

### 资产市场、Polycount、StackOverflow、ShaderToy 等（13 条）

1. Unity Asset Store 搜索页（Next.js）：结果由客户端加载，静态 HTML 无产品条目，改用 sitemap 全量索引与商品页直连。
2. Fab 商品页：正文为客户端渲染，只从 HTML 读到标题/JSON-LD 摘要，未核完整描述。
3. Polycount：搜索页 403，无法检索
4. Unity Asset Store 评论区：正文由 JS 异步加载，只能读页面内嵌 JSON-LD 的少量 top reviews
5. assetstore.unity.com：MegaLOD-Prefaber 与 Amplify Impostors 的描述/技术细节为空或被截断，未取得 fade、批处理或替代品说明。
6. Unity Asset Store 的 GPU Instancer Pro、Nature Renderer、Flora 页面：本网络返回 404（Foliage Renderer 为 200），未能核对其特性页原文。
7. shadertoy.com/view/MdGfDz：curl 返回 403（Cloudflare），未能读取；仅在 Unity 706936 帖中被引用为蓝噪声 crossfade 演示。
8. assetstore.unity.com 的 Impostors 评论/Q&A — WebFetch 内容在评论区前截断，45 条评论未读到，只能改读其官方支持帖。
9. SIGGRAPH 2021 Nanite 演讲链接（s2021.siggraph.org）TLS 握手失败，未采用。
10. www.shadertoy.com/view/MdGfDz：HTTP 403。
11. Bitbucket ChrisPeWebb/bluenoisedither：页面只返回 “Bitbucket”，无法核源码。
12. StackOverflow 52437083 与 21648630：Cloudflare 403，未读到答案与评论。
13. Bitbucket blue noise 源码目录：页面只返回 'Bitbucket' 外壳，无文件列表与引用。

### 其他（文档改版、站点下线、客户端渲染等）（11 条）

1. threejs.org/docs 的动态页：直接 GET 404（SPA），改用仓库 docs 文件与源码
2. Gamasutra 的 Level of Detail Quick Tutorial：301 到 gamedeveloper.com 博客索引，原 URL 正文已不存在，未取得教程内容。
3. gamedev.net 主题页：Cloudflare“Just a moment...”挑战，只有搜索页可读，正文读不到
4. blender.org/download/releases/5-3：Cloudflare 403（Just a moment）；只从 HN 标题确认 2026-11-10 发布，未读官方正文。
5. starsigndev.itch.io/virtual3d（HN 2026-10-23 的 Nanite-like “Flux” LOD）：WebFetch “Socket is closed”，未重试，故未核其真实能力、价格或平台支持。
6. 80.lv 搜索：404；gamedeveloper.com 搜索仅有 2021/2023 旧文，无近 3 个月 LOD 文章。
7. Unreal 论坛回复中的多个 “[Content removed]” 链接（含公开 issue tracker 的 dithered LOD flicker 条目）被论坛移除，无法还原原始 URL。
8. Unreal 官方 Using Dithered LOD Transitions、LOD Settings in the Static Mesh Editor、Level of Detail 页面：HTTP 200 但正文只渲染出 Table of Contents 空壳（客户端渲染或已并入其他页），读不到设置与限制；改用 Unreal 论坛帖与 Skeletal Mesh LODs 文档。
9. threejs.org/docs/api/en/objects/LOD.html：404（文档改版），改读仓库内 LOD.js 源码。
10. news.ycombinator.com 条目 HTML：schannel/urllib 均 TLS handshake 失败；评论正文改用 Algolia API 取得，未读到网页版折叠与投票上下文。
11. threejs.org 的 LOD 文档页 WebFetch 只拿到导航索引，具体 hysteresis 语义以 job 中已固定的 LOD.js 源码为准。

