# 首次可见绘制的编译边界：源码行、消费者路径与最小预热接口

**结论：把“材质已加载”“程序已链接”“纹理已上传”“首帧已提交”拆成四个验收项；有 `KHR_parallel_shader_compile` 时，`compileAsync` 的 resolve 才算第二项，无扩展时它只等 10ms 就 resolve，并没有等 link。** 给 MOBA 当前 quiet 入口的最小接口是 `prepareFirstVisibleFrame(options?: {signal?: AbortSignal}): Promise<WarmupReport>`，挂在 `createWorld` 返回的 `world` 上，在首次 `world.sync(...)` 之后、`client.ts` 第一次 `world.draw(0,1)` 之前、且仅当 `rendered.backend === 'three-webgl2'` 时调用；abort 以 resolve + `cancelled: true` 结束，不是 reject。报告分开返回 `scope`（变体签名）、`parallelShaderCompile`、`programs.link`、programs、textures、post、shadow 与 cancelled，不以一个布尔值冒充“首帧可用”，也不把 `programs.after` 当链接成功证据。固定源码为 three.js `acf77e4`（0.187.0）与 Babylon.js `fb6daf3`；消费者为 MOBA-Like `79bdb574`。本轮只读源码与公开页面，未运行浏览器/GPU，未做性能测量；下文所有“首帧可用”都是源码推断或待执行断言，不是运行结论。

## 1. 版本与证据范围

- three.js 固定提交 `acf77e4c7ea413a0a9638baacef3d78e254b2cac` 的 `package.json` 版本为 **0.187.0**；消费者 `package.json` 锁 **three 0.186.1**。本次把 r186 标签的 `WebGLRenderer.js` 第 1396–1573 行与固定提交第 1400–1577 行逐字 diff，内容一致（仅行号偏移 4），因此下列 `compile`/`compileAsync` 结论可直接落到消费者版本。`WebGLProgram.js` 与 `WebGLPrograms.js` 的关键符号相同（只核了 `onFirstUse`/`isReady` 与 cache key 参数处，未逐字 diff 整文件），行号不同（r186 的 `onFirstUse` 在 863、`isReady` 在 997；`outputColorSpace` 在 213、`fog` 在 315、灯数在 341–342、`toneMapping` 在 366、`customProgramCacheKey` 在 386）。r187 标签（2026-10-30）引入的 WebGPU `compileAsync` 并发缺陷（issue #35315）及其在 r187 之后 dev 上的重写（PR #35359，2026-11-05 合入，包含在固定提交 `acf77e4` 树）属于 WebGPU 路径，不属于本次 WebGLRenderer 范围；r187 的 `renderers/common/Renderer.js` 在 `_finishPreCompile`（r187 L1332-L1345，L1334 读共享的 `this._precompilationState`）仍读共享状态，固定提交 `acf77e4` 才改成每调用 `_getPrecompilationState()`，并由 `_finishPreCompile`（L1337-L1355）恢复 previous 状态。
- Babylon.js 固定提交 `fb6daf341d1c67c548bf435e45c2efdb1dc33812` 的 monorepo 根 `package.json` 只写 `@babylonjs/root` 1.0.0，无法从中解析产品版本；下文只按该树 `packages/dev/core/src/Materials/material.pure.ts` 的行号引用，不推断发布版本。
- 消费者固定提交 `79bdb57439d2ca3e49c6560271d4a598999f5ac5`。本单元用 `git show` 读了 `src/render/playable-world.ts`、`world.ts`、`quiet-family.ts`、`quiet-buildings.ts`、`lighting-style.ts`、`effects.ts`、`health.ts`、`control-state.ts`、`tower-reach.ts`、`impact.ts`、`canvas-world.ts`、`client.ts`、`src/capture/session.ts` 与 `package.json`；没有改任何文件。three.js 侧另取 r186 标签与 npm `three@0.186.1` 的 `WebGLShadowMap.js`/`WebGLProgram.js`/`WebGLPrograms.js` 核对归一行号。
- 官方文档只作措辞对照：three.js 官方 `WebGLRenderer` 文档源文件（固定提交）与 Babylon.js 官方文档 `How Babylon.js Materials Work`（固定文档提交 `42bc541`）。其余候选的“已核”状态沿用本轮清单的取法标注；本单元只对上面列出的源码与消费者路径重新逐行核对。
- 任务点名的 three.js 1505–1580 落在固定提交 `compileAsync` 的 1519–1577（r186 标签为 1515–1573）；为读触发范围，本次连 `compile`/`prepareMaterial` 一起核到 1362–1577。任务点名的 Babylon 1863–1955 跨了两个方法：`forceCompilation` 主体是 1863–1935，1937–1942 是 `forceCompilationAsync` 的 JSDoc，1943–1957 才是 `forceCompilationAsync`（1956–1957 只是 Promise/方法收尾）；下文按固定提交行号引用。

## 2. 两个参考实现：触发范围、完成信号、失败/取消

### 2.1 three.js `acf77e4`：`compile` / `compileAsync`

| 维度 | 源码事实 | 链接 |
|---|---|---|
| 触发范围（材质） | `compile(scene, camera, targetScene)` 用 `scene.traverse` 遍历传入对象下的所有 Mesh/Points/Line/Sprite，数组材质逐个 `prepareMaterial`。`traverse` 不检查 `visible`，所以传入场景里隐藏的对象也会被编译；但**没有挂到该对象树上的材质**（例如只创建了材质、还没建 Mesh 的 VFX）不会被看到。 | [WebGLRenderer.js L1464](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L1464)、[L1400-L1503](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L1400-L1503) |
| 触发范围（单材质变体） | 透明、`side === DoubleSide` 且 `forceSinglePass === false` 的材质会临时切成 BackSide、FrontSide 各编译一次，再恢复 DoubleSide；这是 three.js 自己在单个材质内展开两个变体。 | [prepareMaterial L1362-L1386](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L1362-L1386) |
| 触发范围（灯光/环境） | 灯只从 `targetScene.traverseVisible` 与（当 `scene !== targetScene` 时）`scene.traverseVisible` 收集，且必须命中 `camera.layers`；官方文档明确要求调用前先把 target scene 的 lighting/environment 配置好。 | [L1412-L1444](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L1412-L1444)、[官方文档源 L197-L201](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/docs/pages/WebGLRenderer.html.md#L197-L201) |
| 触发范围（阴影/pass/纹理） | `compile` 只在 `_nodesHandler` 非空时（调用过 `setNodesHandler` 的 node 材质兼容路径）调用 `shadowMap.render`；普通 WebGLRenderer 的 `_nodesHandler` 为 null，阴影深度变体不在 `compile` 内。它不执行 `renderer.render`、不调用 `initTexture`，后处理 composer/pass 也不在遍历范围。 | [L1456-L1458](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L1456-L1458)、[initTexture L3629-L3649](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L3629-L3649) |
| 完成信号 | `compileAsync` 先同步调用 `compile`，再轮询每个材质的 `materialProperties.currentProgram`：`program === undefined` 或 `program.isReady()` 就从集合删除，集合空时 resolve。无 `KHR_parallel_shader_compile` 时先等 10ms，之后每 10ms 查一次；此时 `isReady()` 因 `programReady` 初值为 true 立即返回 true，所以 10ms 后即 resolve，并未等待 link。有扩展时立即查 `COMPLETION_STATUS_KHR`。**Promise 只有 resolve，没有 reject。** | [L1519-L1577](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L1519-L1577) |
| `isReady` 语义 | 只用 `COMPLETION_STATUS_KHR` 查询编译/链接是否完成；没有扩展时 `programReady` 初值为 `true`，即“立即 ready，首次使用可能 stall”。它不检查链接成功与否。 | [WebGLProgram.js L954-L964](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/webgl/WebGLProgram.js#L954-L964) |
| 失败语义 | 链接错误在 `onFirstUse` 里才检查：首次取 uniform/attribute 时读 `getProgramInfoLog`/`LINK_STATUS`，走 `renderer.debug.onShaderError` 或默认 console 报错。因此 `compileAsync` resolve 不代表 shader 编译成功，失败可能延后到首帧。 | [onFirstUse L822-L929](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/webgl/WebGLProgram.js#L822-L929) |
| 取消语义 | 没有 `AbortSignal`、没有 cancel handle。调用方只能忽略 Promise；轮询仍会继续。销毁材质不是可靠取消：历史上 `currentProgram` 失效会让 Promise 永久 pending（r186 已跳过失效材质，PR #34378）。并发调用同样不安全：`compileAsync` 轮询的是共享的 `materialProperties.currentProgram`，另一次 compile 或渲染可能在 link 完成前替换它，使 Promise 提前 resolve（PR #35378）；因此预热接口不应并发调用 `compileAsync`，并应按调用跟踪自己收集的 program 集合。r187 的 WebGPU 共享 `_precompilationState` 竞态（issue #35315，r187 之后的 PR #35359 才改为每调用独立状态）与 issue #35352 的 bind group 生命周期是另一条 WebGPU 问题，不改变 WebGLRenderer 的取消语义。 | [PR #34378](https://github.com/mrdoob/three.js/pull/34378)、[PR #35378](https://github.com/mrdoob/three.js/pull/35378)、[issue #35315](https://github.com/mrdoob/three.js/issues/35315)（WebGPU）、[issue #35352](https://github.com/mrdoob/three.js/issues/35352)（WebGPU） |
| 首帧可用 | 即使 Promise resolve，首次 `render` 仍可能发生：`onFirstUse` 的 info log/uniform 反射、纹理上传、阴影深度材质、后处理 pass 首次编译。`compile` 只在 `_nodesHandler` 非空时调 `shadowMap.render`，普通 WebGLRenderer 的阴影深度变体不在 compile 内；PR #34239 正是要求 compile 只准备 shadow map 而不实际渲染。官方文档只说“可不因 shader 编译做不必要的停顿”，没有承诺零首帧工作。 | [官方文档源 L219-L239](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/docs/pages/WebGLRenderer.html.md#L219-L239)、[issue #22696](https://github.com/mrdoob/three.js/issues/22696)、[Discourse 64940](https://discourse.threejs.org/t/noticeable-hiccup-freeze-when-not-visible-object-gets-visible-for-the-first-time/64940)、[PR #34239](https://github.com/mrdoob/three.js/pull/34239) |

**三个容易读错的点。** 一是 `compile` 覆盖的是“传入对象树里已挂载的材质”，不是“项目里已创建的所有材质”；二是 `compileAsync` 的完成条件是 `currentProgram.isReady()`，不是“首帧不新建 program”；三是透明 DoubleSide 材质会在一次调用里展开两个 `side` 变体，不能把“材质数”当“program 数”。

### 2.2 Babylon.js `fb6daf3`：`forceCompilation` / `forceCompilationAsync`

| 维度 | 源码事实 | 链接 |
|---|---|---|
| 触发范围 | `forceCompilation(mesh, onCompiled, options, onError)` 必须传 mesh；内部构造临时 `SubMesh` 并调用 `isReadyForSubMesh(mesh, tempSubMesh, useInstances)`，只准备这一个 mesh/subMesh 对应的材质变体。`options` 只有 `clipPlane` 和 `useInstances` 两项；defines 来自调用时的 scene、mesh 与 material 状态，必须在调用前配置好。 | [material.pure.ts L1863-L1905](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1863-L1905)、[IMaterialCompilationOptions L62-L72](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L62-L72) |
| 完成信号 | 当 `isReadyForSubMesh` 返回 true 时算完成；否则每 16ms 重试。`_storeEffectOnSubMeshes` 为 false 时退回 `isReady()` 轮询。基类 `isReady()` 直接返回 true（L1368-L1370），实际语义由具体材质子类的 override 决定。 | [L1890-L1927](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1890-L1927)、[isReady L1368-L1370](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1368-L1370)、[isReadyForSubMesh L1380-L1391](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1380-L1391) |
| 失败语义 | 只有 `tempSubMesh.effect.getCompilationError()` 存在且 `allFallbacksProcessed()` 为真时才记 `lastError`，随后调用 `onError`，并且仍会调用 `onCompiled`。非 submesh 路径没有错误回调，只轮询 `isReady`。`forceCompilationAsync` 在 `onError` 时 reject。 | [L1899-L1917](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1899-L1917)、[L1943-L1957](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1943-L1957) |
| 取消语义 | 没有 `AbortSignal`、没有返回取消句柄。`checkReady` 在 scene 或 engine 不存在时直接 return，`forceCompilationAsync` 的 Promise 不会 settle；`allowShaderHotSwapping` 只在完成分支恢复，未完成时保持 false。 | [L1876-L1882](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1876-L1882)、[L1907-L1917](https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1907-L1917) |
| 纹理/首帧 | 官方文档说：默认情况下，材质必须等 effect 编译完且**所有纹理加载完**才能渲染 mesh；因此 `isReadyForSubMesh` 的完成布尔通常把纹理就绪也包含在内（具体由材质子类决定）。这和 three.js 的 shader-only `compile` 不同。文档同时说明编译在主线程同步发生、改材质属性会重新编译。 | [How Babylon.js Materials Work L17-L48](https://github.com/BabylonJS/documentation/blob/42bc5413c9fb1d90650afecdc49124f9bb32c0da/content/features/featuresDeepDive/materials/advanced/work.md#L17-L48) |

**和 three.js 的关键差异。** Babylon 的预热单位是“某个 mesh 的某个材质变体”，完成信号是材质就绪布尔（通常包含纹理），失败可通过 `onError`/Promise reject 暴露；three.js 的预热单位是“传入对象树里的材质集合”：有 `KHR_parallel_shader_compile` 时完成信号才是 `COMPLETION_STATUS_KHR` 报告的链接完成，无扩展时 `compileAsync` 只等 10ms 就 resolve、并不等待 link，失败和纹理都留到首帧。两者都没有取消 API；Babylon 在 scene/engine 消失时会让等待悬空，three.js 则在材质销毁时把该项当作 ready。

## 3. 材质变体遗漏、纹理上传、首帧可用不是一回事

| 层次 | three.js 证据 | Babylon.js 证据 | MOBA quiet 入口现状 |
|---|---|---|---|
| 材质变体遗漏 | program cache key 含 `outputColorSpace`、`fog`/`fogExp2`、`numDirLights`/`numPointLights`/`numHemiLights`、`numDirLightShadows`、`shadowMapType`、`toneMapping`、`customProgramCacheKey` 等；换雾、换灯组、换有效阴影类型（PCF↔VSM；PCFSoft 已被归一化）、换输出色彩空间或改 `onBeforeCompile` 键都会生成新 program。`compile` 只覆盖传入对象树里已挂载的材质。 | `forceCompilation` 只针对传入 mesh 的 subMesh 变体；`clipPlane`/`useInstances` 是两个可选维度；同一材质被不同 defines 的 mesh 共用时，需要对每个 mesh 分别调用。 | quiet 地面/建筑各追加 `\|quiet-ground-v1`、`\|quiet-stone-v1` 键；`setContentStandards(true)` 又追加 `\|source-standard-offset-v1`。baseline 虽设 `PCFSoftShadowMap`，但 r186 起 `WebGLShadowMap.render` 会在主线渲染前把它归一为 `PCFShadowMap`，`shadowMapTypeDefines` 只映射 PCF/VSM，PCFSoft 落到 `SHADOWMAP_TYPE_BASIC`；正常绘制时 baseline 与 forest 实际同为 PCF，不是两个 program 变体。若在首次 shadow 渲染前 `compile`，baseline 会先预热 BASIC、首帧再补 PCF（`compile` 不写 `materialProperties.__version`，首帧 `setProgram` 会重算）。effects 的 lancet/zone 材质在构造时创建但 Mesh 事件时才挂；health 的材质在工厂创建时预建（`health.ts` L7-L9），Mesh 在 `sync` 中创建并挂到 scene（L25），sync 后的 `compile(scene)` 已覆盖，不需要显式清单；tower-reach 只有 `backingMaterial` 预建，每环材质首次 sync 才建；controls 的 `SpriteMaterial` 构造时创建、stun 时才挂；impact 在首次事件里同时 new 材质与 Mesh。 |
| 纹理上传 | `compile`/`compileAsync` 不调用 `initTexture`；纹理在首次 bind/上传时才进入 GPU。`initTexture` 是独立入口，官方文档说它用于避免首次 render 的解码与上传卡顿。 | 官方文档把“effect 编译完 + 所有纹理加载完”作为可渲染前提；因此 `forceCompilation` 的就绪信号通常已覆盖纹理，但这也意味着它等待的时间可能比纯 shader 链接长。 | `loadQuietFamily` 用 `TextureLoader.loadAsync` 只完成解码/加载；quiet road/forest/wall、terrain、status icon 和 battle 纹理都没有在首次 `draw` 前显式上传。 |
| 首帧可用 | `compileAsync` resolve 只表示 `currentProgram.isReady()`；首次 render 仍做 `onFirstUse` 的 info log/uniform 反射、纹理上传、阴影深度变体与后处理 pass 首次编译。 | `isReadyForSubMesh` 更接近“材质可渲染”，但它只覆盖传入 mesh；场景级 `isReady` 是另一套轮询，不能推出“所有可见对象都准备好”。 | `renderScene` 用 `renderer.info.render.frame` 前进且 context 未丢失来置 `frameSubmitted`；源码注释明确说这是提交证据，不是 shader/pixel 验证。`client.ts` 第一次 `world.draw(0,1)` 之前没有任何 `compile`/`compileAsync`/`initTexture`。 |

## 4. 消费者 MOBA-Like@79bdb574 的实际调用路径

**入口。** `createPlayableWorld` 先检查 `AbortSignal`，优先 `factories.webgl`（`createWorld`）；webgl 失败后用默认 `?lighting=forest-light-v1` 再试一次，再失败才回退 Canvas2D。见 [playable-world.ts L9-L19](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/playable-world.ts#L9-L19)。现有代码在 `createPlayableWorld` 返回后先创建 HUD/controls，随后在 [client.ts L126](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/client.ts#L126) 执行 `world.sync(snapshot,playerId); world.draw(0,1);`，这是实际的首次可见绘制；之后的循环在 [client.ts L145](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/client.ts#L145)。预热接口的插入点不是 L126 之前的某一行，而是 L126 这一行内部：该行把 `world.sync(snapshot,playerId);world.draw(0,1);world.setLocked(...)` 三条调用写在同一行，插入位置是其中 `world.sync(...)` 与 `world.draw(0,1)` 之间，实现时需要把该行拆开并在 `boot` 的 async 调用链中 `await prepareFirstVisibleFrame(...)`。放在 L126 之前等于放在 `world.sync` 之前，会漏掉首次 sync 挂载的 Mesh；它也不是现有产品已经有的调用。

**场景配置。** `createWorld` 在 [world.ts L37-L44](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/world.ts#L37-L44) 设置 `shadowMap.enabled`、`PCFSoftShadowMap`（forest 改为 `PCFShadowMap`）、`ACESFilmicToneMapping`、场景雾 `new THREE.Fog('#304c49',75,160)`、45° 相机、`addEnvironmentLighting` 和一个 `castShadow` 的 DirectionalLight。纹理、presentation、battlefield、effects/health/tower-reach/impact/targeting 在 [world.ts L45-L58](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/world.ts#L45-L58) 装载/创建。`renderScene` 在 [world.ts L63-L70](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/world.ts#L63-L70) 选择 `post.render()` 或 `renderer.render(scene,camera)`，并只用 `renderer.info.render.frame` 与 context 状态判定提交。

**没有预热。** 对该固定树的 `src` 做 `git grep`，没有 `compile(`、`compileAsync`、`initTexture`、`WarmUp` 或 `prewarm` 调用（测试里的 `compile()` 是测试辅助的 `onBeforeCompile` 调用，不是渲染器预热）。`capture/session.ts` 的 `warmup` 阶段只是重复调用 `consumer.renderOnly()` 提交帧；[session.ts L44-L52](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/capture/session.ts#L44-L52) 的 `renderOnly` 不推进模拟，也不是编译完成信号。

**quiet 入口的变体。** `quiet-family.ts` 的 `bindQuietGround` 在 [L48-L61](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/quiet-family.ts#L48-L61) 给地面材质注入 `quietRoad`/`quietForest` uniform，并把 `customProgramCacheKey` 改成原键加 `|quiet-ground-v1`；`quiet-buildings.ts` 在 [L7-L29](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/quiet-buildings.ts#L7-L29) 给建筑注入 `quietWall` 并追加 `|quiet-stone-v1`。`lighting-style.ts` 在 [L26-L37](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/lighting-style.ts#L26-L37) 定义 baseline 与 forest 的灯组/阴影/曝光差异；`world.ts` 在 [L38-L39](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/world.ts#L38-L39) 把 `shadowMap.type` 在 PCFSoft 与 PCF 之间切换。`shadowMapType` 虽进入 three.js program cache key，但 r186 标签（npm 0.186.1 同段）起 `PCFSoftShadowMap` 已被移除，[WebGLShadowMap.render L99-L103](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/webgl/WebGLShadowMap.js#L99-L103) 会在首次 shadow 渲染前把它静默改成 `PCFShadowMap`；[WebGLProgram.shadowMapTypeDefines L335-L342](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/webgl/WebGLProgram.js#L335-L342) 只映射 PCF/VSM，PCFSoft 落到 `SHADOWMAP_TYPE_BASIC`（r186 的该段在 L347-L354）。`compile` 只调 `getProgram`，不写 `materialProperties.__version`；首帧 `setProgram` 命中版本不等分支才写入并重算（[L2556-L2559](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L2556-L2559)）。所以两个 lighting 正常绘制时实际同为 PCF，不是两个变体。若在首次 shadow 渲染前 `compile`，baseline 会预热 BASIC、首帧再补 PCF；预热前应先把 `renderer.shadowMap.type` 归一为 `PCFShadowMap`（或先做一次带阴影提交）再 `compile`。

**启动时看不到的材质。** 要区分“构造时预建材质”和“事件时才创建材质”：

- `effects.ts` 在 [L51-L55](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/effects.ts#L51-L55)（lancet body/trail/core）与 [L66-L70](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/effects.ts#L66-L70)（projectile/zone fill/outline）预建材质，但对应 Mesh 要到第一次弹道/区域事件才创建（[L96 起](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/effects.ts#L96)的 `new THREE.Group()`/`new THREE.Mesh(...)`）；`compile(scene)` 只覆盖已挂载的那部分。
- `health.ts` 的血条材质在 [L7-L9](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/health.ts#L7-L9)，Mesh 在 `sync` 的 [L25](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/health.ts#L25) 里创建并 `scene.add`；prepare 放在首次 `world.sync` 之后时，`compile(scene)` 已覆盖它们，不需要单独的显式清单。
- `tower-reach.ts` 只有 `backingMaterial` 在构造时预建（[L32](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/tower-reach.ts#L32)）；每环的可见材质在 `sync` 的 [L38](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/tower-reach.ts#L38) 里随 Mesh 一起 new，首次进入射程才出现。
- `control-state.ts` 的 `SpriteMaterial` 在构造时创建（[L5](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/control-state.ts#L5)），Sprite 在英雄 stun 时才挂上（[L13](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/control-state.ts#L13)）；首次 sync 后若无人被 stun，`compile(scene)` 看不到它。
- `impact.ts` 在 `createImpacts` 里不创建任何材质；`MeshBasicMaterial` 与 Mesh 都在首次 `heroDamaged`/`basicAttackHit`/`basicAttack` 事件分支里同时 new（[L37-L38](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/impact.ts#L37-L38)、[L46-L47](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/impact.ts#L46-L47)），启动清单无法枚举。

因此显式清单只能列 effects 的未挂载材质、tower-reach 的 backing（每环材质需接口预创建同参数占位或标为未覆盖）、controls 的 SpriteMaterial；health 由 sync 后的 `compile(scene)` 覆盖，impact 标为首次事件未覆盖（除非改工厂预建材质，超出本单元）。`content-standards.ts` 的 `|source-standard-offset-v1` 变体在 `setContentStandards(true)` 时才加入。

**首次 sync 会补挂 Mesh。** `client.ts` L126 先调用 `world.sync(snapshot,playerId)`：`health.sync` 会为初始快照里每个有 anchor 的实体创建血条 Mesh，`effects.sync` 会为已有弹道/区域创建 Mesh，`reach.sync` 会为射程内塔建环，`controls.sync` 会在英雄 stun 时建 Sprite；这些都在 `world.draw(0,1)` 之前发生。`impact.sync` 只在快照里有新命中事件时才 new 材质和 Mesh，初始快照通常没有。因此预热必须放在 `world.sync(...)` 之后、`world.draw(0,1)` 之前；放在 `createWorld` 返回后立刻做，会连初始血条都覆盖不到。

## 5. 给 quiet 入口的最小可证伪预热接口

### 5.1 接口形状

```ts
type WarmupReport = {
  cancelled: boolean;
  backend: 'three-webgl2';
  scope: {
    lighting: string;
    materials: string;
    fog: 'Fog' | 'FogExp2' | 'none';
    shadowMapType: 'PCF' | 'VSM' | 'none';
    toneMapping: string;
    outputColorSpace: string;
    mountedObjects: number;
    explicitVariants: string[];
  };
  parallelShaderCompile: boolean;
  programs: { before: number; after: number; link: 'confirmed' | 'unconfirmed' | 'unverified' };
  textures: { before: number; after: number };
  post: 'warmed' | 'not-required' | 'skipped';
  shadow: 'warmed' | 'not-required' | 'skipped';
  failures: string[];
};

// 挂在 createWorld 返回的 three.js world 对象上；Canvas2D world 不实现。
// 幂等；不改变正常绘制路径；abort 以 resolve + cancelled:true 结束。
prepareFirstVisibleFrame(options?: {signal?: AbortSignal}): Promise<WarmupReport>;
```

调用点只有一处：`rendered=await createPlayableWorld(...)` 之后，`rendered.world` 首次 `world.sync(snapshot,playerId)` 之后、`world.draw(0,1)` 之前，并且只在 `rendered.backend === 'three-webgl2'`（或方法存在）时调用；Canvas2D 回退的 world 只有 `sync`/`draw`，跳过并把 backend 记进报告。必须放在初始 sync 之后，因为 `world.sync` 才会把 health/effects/reach/control 等首帧可见的 Mesh 挂进场景；放在 sync 之前会漏掉这批对象。失败或取消不阻止后续同步绘制；现有 `createWorld` 的同步首帧仍是无条件兜底。abort 只表示调用方不再等待，已经发出的 `compileAsync` 仍会跑完，报告以 `cancelled:true` resolve，不是 reject。

### 5.2 内部只做四件事

1. **已挂载材质**：先把 `renderer.shadowMap.type` 归一为 `PCFShadowMap`（baseline 的 `PCFSoftShadowMap` 在 compile 时会被当成 `SHADOWMAP_TYPE_BASIC`，与首帧实际用的 PCF 不同；也可先做一次带阴影提交让 `WebGLShadowMap.render` 完成归一），再 `await renderer.compileAsync(scene, camera, scene)`。有 `KHR_parallel_shader_compile` 时 await 返回表示 `COMPLETION_STATUS_KHR` 已报链接完成；无扩展时它 10ms 后即 resolve、并未等 link（§5.3）。需要同步返回或环境只有同步路径时退回 `renderer.compile(scene, camera, scene)`，并把 `programs.link` 记 `unconfirmed`/`unverified`。灯光、雾、toneMapping 已在 `world.ts` L37–L44 配置好，满足官方文档“先配置 target scene”的前提。`compileAsync` 不返回材质集合，报告用 `renderer.info.programs.length`；不要用材质数冒充 program 数（透明 DoubleSide 会展开两个变体）。若保留 PCFSoft 到首帧，首帧会补出 PCF，报告要如实记录。
2. **未挂载变体**：用一个隐藏的临时对象（每个待预热材质挂一个 1×1 占位 Mesh）调用 `await renderer.compileAsync(tempObject, camera, scene)`（同步路径退回 `renderer.compile(tempObject, camera, scene)`），把真实场景作为 `targetScene`，从而用真实灯组/雾状态生成 program。这一用法正是 `compile` 第三参数存在的目的。显式清单的来源按第 4 节限定：effects 的未挂载材质、tower-reach 的 `backingMaterial`（初始 sync 已建的 ring 材质由 `compile(scene)` 覆盖；之后新进入射程的 ring 材质需预创建同参数占位或标未覆盖）、controls 的 `SpriteMaterial`；health 已由 sync 后的 `compile(scene)` 覆盖；impact 没有启动期材质可列。当前 `effects.ts`、`control-state.ts`、`tower-reach.ts`、`impact.ts` 的工厂只返回 `sync`/`draw`/`dispose` 等（effects 还返回 root/reset/inspect），都不暴露材质；effects 与 controls 需要让工厂返回只读 `warmupMaterials`（或由 `world.ts` 在构造时收集），tower-reach 只需暴露 backing，impact 没有启动期材质可暴露，health 不需要额外清单。
3. **纹理**：对已加载的纹理显式调用 `renderer.initTexture`，至少覆盖 quiet 的 road/forest/wall、terrain、status icon、battle 纹理与 effects 的 DataTexture。`initTexture` 在固定源码 L3629-L3649；它与 `compile`/`compileAsync` 无关，必须单独做。
4. **阴影与后处理**：在 1×1 的离屏 `WebGLRenderTarget` 上提交一次真实场景渲染（shadowMap 开启），覆盖 shadow depth 变体；把第 2 步的占位对象也临时加进这次渲染的对象树（或对每个临时 program 调一次 `getUniforms`/`getAttributes`），否则 `onShaderError` 只会在 `onFirstUse` 触发，临时变体的链接失败收集不到。forest 的 `post.render()` 需要把 OutputPass 的 `renderToScreen` 临时关掉或使用离屏 composer 目标，覆盖 SSAO/grade/Output 的首次编译。全部 `compileAsync` await 完成并做完这次离屏渲染后再记录 `programs.after` / `textures.after`：早于阴影提交读取会漏掉深度/blur program，早于 await resolve 读取会把尚未完成链接的 program 当成已预热。若需要 GPU 完成而不是仅提交，可对该 1×1 target 调 `readRenderTargetPixels`；这一步会 stall，是否值得由目标版本实测决定，源码不能替它下结论。

**实现风险。** 用临时对象预热未挂载材质时，占位 Mesh 必须复现真实对象的 defines（骨架、morph、instancing、顶点属性、几何 UV 等），否则 program key 仍会不同；无法复现的变体应显式列出并标为未覆盖。`initTexture` 只能对 `image` 已加载的纹理调用，未完成的 `TextureLoader` 要先 await，否则可能上传空纹理。1×1 离屏渲染仍执行一次真实 draw，只是不呈现到屏幕，不能当作零成本；它是否触发与首帧相同的 CPU 侧工作需实测。

### 5.3 完成、失败与取消

- **完成**：有 `KHR_parallel_shader_compile` 时，`compileAsync` 的 resolve 才表示 `currentProgram.isReady()` 为真（链接完成）；没有扩展时 `programReady` 初值就是 true，`compileAsync` 在 10ms 后即 resolve，并没有等待 link。报告用 `parallelShaderCompile` 和 `programs.link` 区分：有扩展且全部 ready 记 `confirmed`（只表示 `COMPLETION_STATUS_KHR` 报告完成，不表示链接成功），无扩展记 `unconfirmed`，只要有一个显式变体未经过真实渲染/getUniforms 就记 `unverified`；`programs.after` 只是 program 数，不是链接成功证据。resolve 后仍要继续做 `initTexture`、阴影/后处理提交。报告里的 `programs`/`textures` 来自 `renderer.info.programs.length` 与 `renderer.info.memory.textures`；`render.calls` 不放进预热报告，因为它要等第一次 draw 后才有值，由调用方在 draw 前后自行读取。这些计数都是公开可观测的，不引入私有字段。
- **失败**：`renderer.debug.onShaderError` 只在 `onFirstUse`（首次 `getUniforms`/`getAttributes`，[WebGLProgram.js L822、L926/L943](https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/webgl/WebGLProgram.js#L822)）触发，`compile`/`compileAsync` 不触发；仅安装 handler 不会收集编译期错误。要让临时变体也经过 link 检查，需把占位对象纳入一次离屏渲染，或对每个 program 强制一次 `getUniforms`/`getAttributes`（这会阻塞，等价于同步确认）；做不到的变体标 `link:'unverified'` 并写入 `failures`。`compileAsync` 本身不会 reject，不能把 resolve 当成功。`failures` 同时记录未加载的纹理、无法复现 defines 的变体与离屏渲染异常，不把“跳过”静默算成“已预热”。Babylon 的 `onError` 语义可作对照，但 three.js 侧只能观察到 `onFirstUse` 的错误。
- **取消**：`AbortSignal` 只在每个 await 边界检查；abort 以 resolve + `cancelled:true` 结束，不是 reject。取消后不再提交离屏渲染、不 dispose 共享材质/纹理、不清理 program cache；对已经发出的 `compileAsync` 只忽略其结果，不声称它被取消。这样避免 three.js 没有 cancel API 带来的悬空等待，也避免 Babylon `forceCompilation` 在 scene 消失后 Promise 永不 settle 的问题。
- **边界**：报告必须带 `scope`（lighting、materials、fog 类型、shadowMapType、toneMapping、outputColorSpace、已挂载对象数、显式变体清单），只对这份签名有效。它不是全局 ready 布尔；换雾、换灯、换有效阴影类型（PCF↔VSM）、加新对象、加后处理参数，都必须重新报告或明确标记为未覆盖。`PCFSoftShadowMap` 不是有效变体：r186 起它会被归一为 PCF。

## 6. 可在消费者未来验证的正例与反例

以下都是**待执行断言**，本轮没有运行浏览器/GPU，不能当通过项。

### 6.1 正例：quiet + forest 冷启动，首帧不新增 program

**前置。** 用 promoted entry 的默认组合 `?lighting=forest-light-v1&materials=quiet-family-v1`（`entry-lighting.ts` 会给未显式指定的入口补这两个默认值），清空浏览器磁盘缓存或使用全新 profile，确保是冷启动。先按第 5 节实现 `prepareFirstVisibleFrame`，然后在 `client.ts` L126 的 `world.sync(snapshot,playerId)` 之后、`world.draw(0,1)` 之前调用它。

**断言。**
1. 在覆盖清单完整且 baseline 已按 §5.2 归一 `shadowMap.type` 的前提下，`programs.after > 0`，且 `programs.after` 等于第一次 `world.draw(0,1)` 后的 `renderer.info.programs.length`，也等于紧接着第二次 `world.draw` 后的值。关键是比较“prepare 完成时”与“第一次 draw 后”，只看第一次和第二次 draw 之间不变会漏掉首帧新增。若浏览器没有 `KHR_parallel_shader_compile`，`programs.after` 相等只说明 program 数不再增长，不说明 link 已完成；测试要同时记录 `parallelShaderCompile` 与 `programs.link`。
2. `textures.after` 已包含 quiet 三张纹理、terrain、status icon 与 effects DataTexture 的上传；第一次 draw 后的 `renderer.info.memory.textures` 等于 `textures.after`，不再增长。
3. 第一次提交帧的 `renderer.info.render.calls` 等于第二次的 calls 且大于 0；这个比较只能说明最后一条 render 路径一致。若要检查“没有可见对象被跳过”，测试需临时关掉 `info.autoReset` 累加整帧 calls，或对比稳定态的同场景 calls。
4. forest 的 `post.render()` 首次执行不增加 program 数；`post: 'warmed'` 与实测一致。
5. 用 `lighting=baseline` 分别配 `materials=baseline` 与 `materials=quiet-family-v1` 各跑一次，覆盖 `lighting` 与 `materials` 两个查询维度中实际存在的组合；baseline 组合必须先按 §5.2 归一 `shadowMap.type`，否则首帧会补出 PCF，正例断言不成立。
6. 重复一次禁用 `prepareFirstVisibleFrame` 的对照：同一冷启动下 `programs.length` 会在首帧或首个技能帧增长。若对照不增长，说明测量被磁盘缓存污染，不能算正例通过。

**测量入口。** 现有 `captureState()` 已暴露 `render.calls`/`textures`，但没有 program 数；未来只需在 `captureState().render` 增加 `programs: renderer.info.programs.length`（测试可读，不改变渲染行为），或在 browser-smoke 里从 `world` 句柄读取同一个计数。不需要新增产品 UI。注意 forest 的 `post.render()` 内部会多次调用 `renderer.render`，而 `info.autoReset` 默认在每次 render 开头清零，所以 `render.calls` 只代表最后一次 pass 的 calls；若要比总 draw 数，测试应临时关掉 `info.autoReset` 并自行累加，不能把最后一次的值当整帧总数。

### 6.2 反例：预热后换雾/灯/阴影变体，下一次绘制仍首次编译

**最小复现（three.js 0.186.1，放在 consumer 的 browser-smoke 页面或独立 HTML 中运行；vitest 的 node 环境没有 WebGL）。** 建一个含 `MeshStandardMaterial` 的 Mesh、一个 HemisphereLight、一个 DirectionalLight 和 `scene.fog = new THREE.Fog(...)` 的场景；开启 `renderer.shadowMap.enabled = true`，给灯和 Mesh 设 `castShadow = true`。先 `renderer.compile(scene, camera)`，再**先做一次开启阴影的渲染作为基线**——用默认画布或同一个 1×1 离屏 target，后续两帧都用同一目标——让基线阴影类型下首帧才创建的深度材质（若基线用 VSM，还包括两张 blur 材质）program 建完；此时记录 `renderer.info.programs.length` 和这一次的 `renderer.info.render.calls`。随后在**不重新预热**的情况下做以下任一改动，再用同一目标调用一次 `renderer.render(scene, camera)`：

- `scene.fog = null`，或换成 `new THREE.FogExp2(...)`；
- `scene.add(new THREE.PointLight(...))`；
- `renderer.shadowMap.type = THREE.VSMShadowMap`（真正改变 sampler 的变体）。不要用 `PCFSoftShadowMap`：r186 起 `WebGLShadowMap.render` 会在首次 shadow 渲染前把它静默改成 `PCFShadowMap`，不会新增 program，也解释不了 baseline↔forest。

**断言。** 与基线相比，`renderer.info.programs.length` 至少增加 1，且新增发生在改动后的第一次 render。`renderer.info.render.calls` 只在不改变绘制对象数的两个臂上作辅助判据：换雾（`scene.fog = null` 或 `FogExp2`）与 `scene.add(new THREE.PointLight(...))`（该点光未开 `castShadow`）的 calls 应与基线相同。VSM 臂不能拿 calls 不变判断“没有多画对象”：`WebGLShadowMap.VSMPass` 对每个投射阴影的非点光源额外提交两张全屏 blur（固定提交 `WebGLShadowMap.js` L418、L427 的 `renderBufferDirect`；r186 同段为 L416、L425），固定提交 `WebGLRenderer.js` L1744 的 `info.reset()` 先于 L1750 `shadowMap.render`，这些 draw 会累加进 `render.calls`，所以 VSM 臂的 calls 预期比基线多 2（每个投射阴影的非点光源；前提是测试 Mesh 未设 `receiveShadow`，VSM 会把 `receiveShadow` 对象也画进 shadow map，见固定提交 L528，会再增加 depth draw），只能断言 program 增加，或显式注明这 2 次是 blur pass 而不是场景对象。行号按消费版本 0.186.1：`fog`/`fogExp2` 在 WebGLPrograms L315/L317（参数行）、`numPointLights` 在 L342（参数行；cache-key push L478）、`customProgramCacheKey` 在 L386（参数行；push L436）、`shadowMapType` 在 L364（参数行；push L489）。固定提交 `acf77e4` 对应 L324-L326、L351、L395/L445、L373/L501。这个反例证明：`prepare(A) → ready` 不能推出 `prepare(B) → ready`；接口报告的 `scope` 必须回显灯组/雾/阴影类型等变体签名，换变体后旧报告不能复用。

**消费者内的同类路径。** 如果预热只做 `compile(scene)`、没有把后续才挂载的材质放进显式清单：第一次弹道会挂上 `effects.ts` 的 lancet 材质（L96 起），第一次英雄 stun 会挂上 controls 的 Sprite（材质 L5 已在构造时创建），第一次进入塔射程会 new ring 材质（L38），第一次命中会同时 new impact 材质与 Mesh（L37/L46），第一次 `setContentStandards(true)` 会挂上带 `|source-standard-offset-v1` 键的材质；这些都不在启动时 `scene.traverse` 里（controls 的材质虽已创建但未挂载，tower-reach 的 ring 材质更是首次才 new）。因此“world 首帧不新增 program”不等于“第一次技能/第一次标准展示不新增 program”，两者的断言要分开写；第 5 节的显式变体清单就是为覆盖前者之外的情况而设，但清单本身也会漏，所以仍需这个反例。

## 7. 渠道覆盖表

下表把“本轮清单记录的取法”和“本单元逐行复核的源码/消费者路径”分开：除第 1 节点名的 three.js/Babylon 固定源码、MOBA 消费者路径与 Molstar 文档外，其余条目是清单记录，不是本单元重读。表格只用于说明覆盖面与缺口，不作为事实通过。

“保留项”指第 8 节清单里实际保留的条目数（同一主题可有多个独立链接）；“读不到”只列本轮清单明确记录的情况，不据此判断该渠道没有内容。

| 渠道 | 实际看了什么、怎么取 | 保留项 | 读不到及原因 |
|---|---|---|---|
| three.js 官方文档/源码 | `threejs.org` 文档、固定提交 `acf77e4` 的 `WebGLRenderer.js`/`WebGLProgram.js`/`WebGLPrograms.js`/`WebGLInfo.js`/`WebGLTextures.js` 与 `docs/pages/WebGLRenderer.html.md`；raw.githubusercontent.com 直取 | 16 | 旧路径 `/docs/api/en/renderers/WebGLRenderer.html` 404；hash 路由页只能拿导航壳，改用固定提交源码与 `docs/pages/*.md` |
| three.js Discourse | `discourse.threejs.org` 原帖与回复；部分用 `/t/<id>.json` 取正文 | 11 | 未遇到整站封锁；个别帖只读了首帖与维护者回复 |
| three.js GitHub issue/PR | `github.com` HTML 与 `.patch`、raw 文件；REST API 前几次成功后触发未认证限流 | 39 | REST 60 次/小时限流（共享出口 IP），后半段改 HTML；少量按“近期活跃度”排序的完整搜索结果可能缺失 |
| Babylon.js 官方文档/typedoc/源码 | `doc.babylonjs.com` 与 `github.com/BabylonJS/documentation` 的 work.md、固定提交 `material.pure.ts`；typedoc 页 | 5 | typedoc 多数页客户端渲染，只拿到标题/空壳；`howMaterialsWork` 直链 404，改用 GitHub 文档源 |
| Babylon.js 论坛 | `forum.babylonjs.com/t/<id>.json` 与 `/search.json` 取原帖/回复 | 8 | 未整站封锁；个别长帖只读了相关楼层 |
| Babylon.js GitHub | PR/issue HTML 与评论；API 限流后改 HTML | 8 | API 60 次/小时限流；PR #785 的合并状态页面/API 不稳定，按 master 合并提交 `169f66a` 处理 |
| Godot | 官方 `pipeline_compilations` 文档、issue/PR/proposal、RenderingServer 类文档 | 9 | `docs.godotengine.org/en/stable/tutorials/performance/shaders.html` 404，改用 pipeline_compilations 页 |
| Unity | `docs.unity.com` 与 `docs.unity3d.com` 新旧路径、Discussions、ShaderVariantCollection/Warmup/PSO trace 文档 | 11 | 旧域名多次 404；`forum.unity.com` 403/Cloudflare，改 `discussions.unity.com`；目标线程 465671 重定向后实际是另一个主题，未据此下结论 |
| Unreal | `dev.epicgames.com` 的 PSO precaching/cache/ASD 文档、FShaderPipelineCache API 页 | 8 | Epic 技术博客 `unrealengine.com` 403；`docs.unrealengine.com/5.0` 403；FShaderPipelineCache API 页只返回目录，无方法说明 |
| PlayCanvas | engine PR/issue、developer-site PR patch、官方 AGENTS.md、论坛 | 6 | `developer.playcanvas.com` 的 shader-precompilation 页与常见路径均 404（未发布分支），只读 PR #1341 描述/patch |
| Bevy/wgpu/原生管线 | Bevy `PipelineCache` API、PR/issue；wgpu PR/issue/docs.rs；Fossilize、dxvk-async | 4 | 未整站封锁；部分 docs.rs 版本页只核 API 签名 |
| WebGL/Khronos/MDN/WebGPU | `registry.khronos.org` 扩展文本、`developer.mozilla.org`、W3C WebGPU 规范、Khronos 邮件列表 | 11 | `www.khronos.org` 的部分页面被域名安全策略拦截；`registry.khronos.org` 可读 |
| Chromium/Mozilla 缺陷 | `issues.chromium.org`、`bugs.chromium.org`、Bugzilla | 4 | Chromium issue tracker 多页要求 Google 登录，只读搜索摘要；旧 Monorail 跳登录墙；Bugzilla 1536674 可读 |
| 英文社区/博客 | HN 用 `hn.algolia.com/api/v1/items/<id>`；Lobsters 用 `/s/<id>.json`；DEV/Habr/作者博客直读 | 25 | HN 原帖 `news.ycombinator.com` 直连 TLS 失败；Dolphin/Unreal blog/tympanus/phoronix/Eurogamer/moonside/medium 等 403 或域名校验失败；dev.to 评论 API 返回空 body |
| 中文社区 | 掘金、CSDN、博客园、少数派、plumephp、个人 bug log 正文；知乎/InfoQ/微信/B站/小红书/简书/V2EX 用搜索摘要与精确标题交叉核对 | 9 | 知乎 403/need_login；InfoQ 写作社区 JS 壳、API 451；微信“环境异常”；B站验证码/-352；小红书登录；简书登录；V2EX 无结果；腾讯云转载按“原始链接”要求未列 |
| awesome/技能/工具 | awesome-threejs/webgl/webgpu/babylonjs/game-engine-dev 的 README/仓库页；Claude/agent skill 仓库；Spector.js、drei、npm 包 | 6 | `mikbry/awesome-webgpu` raw README 在 main/master 均 404，只读仓库页与第三方索引；npmjs.com 403，`@vibegameengine/shader-warmup` 只读 Socket/Snyk/Bundlephobia/registry 元数据 |
| AI coding 工具（与本任务无关） | 清单中的 Copilot Fusion、OpenCode 2.0、DeepSeek Super-Agent、Antigravity、Ramp Inspect、CleanCode、Arvre、REA、UE MegaJam 等 | 0（排除） | 与“首次可见绘制的编译边界”无关，未纳入排序；不影响本任务结论 |
| 搜索引擎/API 可用性 | WebSearch 在本轮多个会话中 200/200 配额耗尽；GitHub API 未认证 60 次/小时；DuckDuckGo HTML 端点 SSL 失败；npm registry 元数据可读、npmjs 页面 403 | 0 | 后半程主要靠已知 URL、仓库页面内链、raw 文件与站点 API；没有用搜索摘要补造新链接 |

“保留项”按第 8 节表格行统计，一行可同时属于多个渠道，所以列合计大于去重后的 168 行；它不是独立链接数，也不是“该渠道本轮看过的全部页面数”。

**读不到的集中原因。** 中文平台多为登录墙/验证码/前端渲染（知乎、InfoQ 写作社区、微信、B站、小红书、简书）；npm 与部分厂商博客是 403；GitHub REST 与 Chromium issue tracker 是配额或登录限制；部分官方文档页已迁移或尚未发布（Unity 旧路径、Godot `shaders.html`、PlayCanvas 2.25 文档、Babylon `howMaterialsWork`）。这些缺项已在候选理由中标注“摘要”或“未读正文”，没有把摘要当原文。

## 8. 按任务标准排序的候选清单

排序标准：P0 直接决定接口契约（固定源码、消费者路径、官方措辞、失败/取消的一手实现）；P1 直接补变体/完成/纹理/失败语义；P2 跨引擎/平台对照；P3 背景、工具与社区证据。每项保留原始链接；理由沿用本轮候选清单并压缩，证据状态标为“源码/原页/PR 页/摘要”。本单元只对 P0 中标注为源码与消费者路径的条目逐行复核，其余按清单取法引用。

### P0 直接决定接口契约（32 项）

| 候选 | 链接 | 理由 | 证据 |
|---|---|---|---|
| three.js `WebGLRenderer.js` compile/compileAsync | https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/WebGLRenderer.js#L1400-L1577 | 一手实现：`scene.traverse` 收集材质、`program.isReady()` 轮询、10ms 间隔、Promise 只 resolve；触发范围与完成信号的源码行。 | 源码 |
| three.js `WebGLProgram.js` onFirstUse/isReady | https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/webgl/WebGLProgram.js#L822-L964 | 一手实现：链接错误与 uniform 反射在首次使用才做；无扩展时 `isReady` 立即 true，支撑“链接完成不等于首帧可用”。 | 源码 |
| three.js `WebGLPrograms.js` program cache key | https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/src/renderers/webgl/WebGLPrograms.js#L217-L507 | 一手实现：`outputColorSpace`、`fog`/`fogExp2`、灯数、`shadowMapType`、`toneMapping`、`customProgramCacheKey` 都进入 key；换雾/灯/阴影类型仍首次编译的源码依据。 | 源码 |
| three.js 官方文档 `WebGLRenderer` | https://threejs.org/docs/pages/WebGLRenderer.html | 官方口径：compile 编译场景材质且要求目标场景灯光先配好；compileAsync 的 Promise 只在“可不因 shader 编译不必要停顿”时 resolve；initTexture 单独负责纹理上传。 | 原页 |
| three.js 文档源 `WebGLRenderer.html.md` | https://github.com/mrdoob/three.js/blob/acf77e4c7ea413a0a9638baacef3d78e254b2cac/docs/pages/WebGLRenderer.html.md#L197-L239 | 与渲染页同源的逐行文本，便于核对官方措辞的边界。 | 源码 |
| three.js PR #19752 | https://github.com/mrdoob/three.js/pull/19752 | compileAsync 的动机、`getProgramInfoLog` 阻塞实测、Promise 方案与被否替代方案的取舍。 | PR 页 |
| three.js issue #16321 | https://github.com/mrdoob/three.js/issues/16321 | 最初诉求：不要用会阻塞的 COMPILE_STATUS/LINK_STATUS 判定完成，要可轮询的完成信号；compileAsync 的历史起点。 | 原页 |
| three.js PR #16662 | https://github.com/mrdoob/three.js/pull/16662 | 被否的按材质 parallelCompile 方案，记录跨多帧出现、单 pass 失败、`getProgramParameter` 仍阻塞等边界，是预热接口的反例。 | PR 页 |
| three.js PR #34378 | https://github.com/mrdoob/three.js/pull/34378 | 轮询中材质被销毁会让内部定时器抛错、Promise 永不 resolve/reject；r186 的修复直接对应“取消/失败语义”。 | PR 页 |
| three.js issue #22696 | https://github.com/mrdoob/three.js/issues/22696 | 维护者明确 compile 只预编译 shader，不做 uniform 更新和纹理上传，也不做视锥剔除；触发范围与首帧可用分离的关键答复。 | 原页 |
| three.js Discourse 64940 | https://discourse.threejs.org/t/noticeable-hiccup-freeze-when-not-visible-object-gets-visible-for-the-first-time/64940 | donmccurdy 明确 compile 不上传几何、纹理按首次渲染上传；贴中有 initTexture 与临时 visible+render 的完整预热路径。 | 原页 |
| three.js Discourse 86191 | https://discourse.threejs.org/t/reduce-first-render-lag-renderer-compileasync-is-not-doing-anything/86191 | 社区排查：临时 visible/frustumCulled + renderAsync 才补齐首帧，说明完成信号不代表首帧可见。 | 原页 |
| three.js Discourse 89007 | https://discourse.threejs.org/t/webglrenderer-compile-async-and-possible-wrong-shader-cache-key/89007 | compileAsync 期间 program cache key 读取 renderer 全局 outputColorSpace，与参数里的计算值可能不一致；RenderTarget 下预热键与首绘键不同。 | 原页 |
| Babylon `material.pure.ts` forceCompilation | https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1863-L1957 | 一手实现：临时 SubMesh、按 mesh 调 isReadyForSubMesh、clipPlane/useInstances 选项、16ms 轮询、onError/onCompiled、无取消。 | 源码 |
| Babylon `material.pure.ts` isReadyForSubMesh | https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L1380-L1391 | 基类完成信号只是一个布尔，实际语义由材质插件/子类决定；`forceCompilation` 直接消费它。 | 源码 |
| Babylon `IMaterialCompilationOptions` | https://github.com/BabylonJS/Babylon.js/blob/fb6daf341d1c67c548bf435e45c2efdb1dc33812/packages/dev/core/src/Materials/material.pure.ts#L62-L72 | 预热选项只有 `clipPlane` 与 `useInstances`；变体覆盖范围的硬边界。 | 源码 |
| Babylon 官方文档 `How Babylon.js Materials Work` | https://github.com/BabylonJS/documentation/blob/42bc5413c9fb1d90650afecdc49124f9bb32c0da/content/features/featuresDeepDive/materials/advanced/work.md#L17-L48 | 官方：effect 首次使用在主线程同步编译；默认材质要等 effect 编译完且所有纹理加载完才能渲染；改属性会重新编译。 | 源码 |
| Babylon 论坛 54789 | https://forum.babylonjs.com/t/force-shader-compilation/54789 | 维护者 bghgary 明确：forceCompilation 不同步；mesh 必须同 defines；clip plane/instances 要传 options；onCompiled 只在渲染用到材质时触发。 | 原页 |
| Babylon PR #19090 | https://github.com/BabylonJS/Babylon.js/pull/19090 | WebGPU 异步 pipeline 创建：默认关闭、未就绪 mesh 先跳过、scene.isReady 为 false、失败回退同步创建；完成/失败语义的一手代码。 | PR 页 |
| Babylon 论坛 64471 | https://forum.babylonjs.com/t/webgpu-creating-render-pipelines-asynchronously-so-a-new-material-does-not-stall-the-frame-that-first-draws-it/64471 | 含实测（108–129ms→31–45ms）、预热 texture state 0 与阴影 state 1 不匹配、跨 pass 首帧例外、失败回退；变体遗漏的核心一手帖。 | 原页 |
| Babylon PR #18255 | https://github.com/BabylonJS/Babylon.js/pull/18255 | 聚光灯投影/IES 纹理未加载时材质已 isReady，导致 executeWhenReady 提前触发；修复把 gate 放在 `_prepareEffect` 前。 | PR 页 |
| Babylon PR #19057 | https://github.com/BabylonJS/Babylon.js/pull/19057 | 官方修复：onAfterShaderCompilation 在真实 link 成功前触发；改为成功后通知并补 failure/disposal/nested 测试。 | PR 页 |
| Molstar `pipeline-readiness` | https://github.com/molstar/molstar/blob/3e4c9b428bbad63f6719e007d5468bd69260eebf/.v6/plans/gl/pipeline-readiness.md#L128-L173 | 真实引擎的“prepare 不绘制”设计：props 变化时 hold 帧、`Canvas3D.prepare` 只准备 pass、debug 报告 prepare 漏掉的 pipeline；最接近本任务接口的工程文档。 | 源码 |
| Molstar `program-switch-frames` | https://github.com/molstar/molstar/blob/dabbf29f952880a034a9637e28c9844e3ae73d9f/.v6/plans/gl/program-switch-frames.md#L26-L37 | 实测对比：首次开光照 WebGPU 出现约 150–250ms 近空帧、WebGL 冻结约 800ms；首帧可用与等待策略的直接证据。 | 源码 |
| Zubin Khavarian：three.js Shader Stutter at First Draw | https://zubin.dev/blog/shader-stutter-first-draw/ | 复盘 compile 覆盖场景材质与隐藏对象，但不覆盖 color-space 变体、shadow depth、per-event 材质；给出 `renderer.info.programs` 监测与 fresh profile 测试法。 | 原页 |
| guibai.dev：compileAsync 之外的首帧卡顿 | https://guibai.dev/a/7702110021828624394/en/ | 系统拆解 compileAsync 之外的 CPU 地形、纹理上传、反射/阴影多路径、alpha cutout 深度变体；给出 preparing 状态与取消检查。 | 原页 |
| MOBA `playable-world.ts` | https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/playable-world.ts#L9-L19 | 消费者入口：AbortSignal、webgl 优先、默认 lighting 重试、Canvas2D 回退；预热接口必须接在这条路径之后。 | 源码 |
| MOBA `world.ts` | https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/world.ts#L27-L98 | 消费者场景配置与首帧提交：雾、灯、阴影、toneMapping、quiet 纹理、post、`frameSubmitted`；没有预热调用。 | 源码 |
| MOBA `client.ts` | https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/client.ts#L74-L126 | 实际首次可见绘制在 L126 的 `world.draw(0,1)`；预热接口的唯一插入点。 | 源码 |
| MOBA `effects.ts` | https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/effects.ts#L44-L70 | 材质在启动时创建、Mesh 在首个弹道/区域事件才挂上；启动 `compile(scene)` 覆盖不到，首次技能仍会编译。 | 源码 |
| MOBA quiet 变体（`quiet-family.ts` / `quiet-buildings.ts` / `lighting-style.ts`） | https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/quiet-family.ts#L48-L61 | 三个 `customProgramCacheKey` 追加键；baseline 的 `PCFSoftShadowMap` 会被 r186 归一为 PCF，与 forest 实际同为 PCF，不构成两个变体；预热前需先归一 `shadowMap.type`。变体遗漏在消费者里的具体来源。 | 源码 |
| MOBA `capture/session.ts` | https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/capture/session.ts#L44-L52 | `warmup` 只是重复 `renderOnly()` 提交帧，不是编译完成信号；可作为反例说明“提交 ≠ 可用”。 | 源码 |

### P1 变体、完成、纹理与失败语义（56 项）

| 候选 | 链接 | 理由 | 证据 |
|---|---|---|---|
| three.js PR #26966 | https://github.com/mrdoob/three.js/pull/26966 | 不传 targetScene 会漏环境/灯光定义并在首次 render 重编译；触发条件的直接实现。 | PR 页 |
| three.js PR #26964 | https://github.com/mrdoob/three.js/pull/26964 | 全局异步编译方案因首帧黑屏、PMREMGenerator 需另走路径被关闭；“把完成信号做成全局开关”的失败语义。 | PR 页 |
| three.js issue #33665 / PR #33668 | [issue #33665](https://github.com/mrdoob/three.js/issues/33665)、[PR #33668](https://github.com/mrdoob/three.js/pull/33668) | compileAsync 可能使用陈旧视锥/投影状态；修复在 `_projectObject()` 前对齐相机状态。 | 原页 |
| three.js PR #32530 / issue #32523 | [issue #32523](https://github.com/mrdoob/three.js/issues/32523)、[PR #32530](https://github.com/mrdoob/three.js/pull/32530) | compileAsync 未把 targetScene 的 fogNode/Scene.fog 纳入编译，同一材质进入带雾场景首帧再编一次；雾变体的可复现实证。 | 原页 |
| three.js PR #35091 / #35092 | [PR #35091](https://github.com/mrdoob/three.js/pull/35091)、[PR #35092](https://github.com/mrdoob/three.js/pull/35092) | 逐条列出预编译漏掉 shadow 变体的原因（shadow update 被跳过、状态提前恢复、未用 render-object function）；被关闭的两个方案。 | PR 页 |
| three.js issue #35315 / PR #35319 / #35359 | [issue #35315](https://github.com/mrdoob/three.js/issues/35315)、[PR #35319](https://github.com/mrdoob/three.js/pull/35319)、[PR #35359](https://github.com/mrdoob/three.js/pull/35359) | WebGPU 路径：并发 compileAsync 共享 `_precompilationState`，一个调用清空后另一个抛 TypeError；r187 标签引入该回归，r187 之后的 #35359 才在 dev 上改为每调用 `_getPrecompilationState()`（包含在固定提交），不适用于 WebGLRenderer。 | 原页 |
| three.js issue #35327 | https://github.com/mrdoob/three.js/issues/35327 | PassNode.compileAsync 跨 await 保持 render target 绑定，动画循环在此期间渲染会触发 WebGPU texture usage 校验错误；预热副作用。 | 原页 |
| three.js issue #35352 | https://github.com/mrdoob/three.js/issues/35352 | （WebGPU）在飞时 dispose 会破坏共享 bind group，从未初始化的渲染对象减计数；只适用于 WebGPU 渲染器，不能作为 WebGLRenderer 取消语义的证据。 | 原页 |
| three.js PR #35378 | https://github.com/mrdoob/three.js/pull/35378 | compileAsync 等待可变的 `material.currentProgram`，共享材质/另一次 compile/DoubleSide 正反面都可能替换它；Promise 可能提前 resolve。 | PR 页 |
| three.js issue #35388 | https://github.com/mrdoob/three.js/issues/35388 | node build 以完整 attachment state 为键，同一材质画到仅 sample count 不同的 target 会构建两次；按材质计数不能覆盖 render target 变体。 | 原页 |
| three.js issue #34681 / PR #35014 / #35168 | [issue #34681](https://github.com/mrdoob/three.js/issues/34681)、[PR #35014](https://github.com/mrdoob/three.js/pull/35014)、[PR #35168](https://github.com/mrdoob/three.js/pull/35168) | PassNode 预热与实际首渲染的 call depth/render context 不一致，导致首次 render 仍为每个对象重建 node；预热成功但首帧仍编译的反例。 | 原页 |
| three.js PR #32984 / #33784 / #34816 | [PR #32984](https://github.com/mrdoob/three.js/pull/32984)、[PR #33784](https://github.com/mrdoob/three.js/pull/33784)、[PR #34816](https://github.com/mrdoob/three.js/pull/34816) | WebGPURenderer 的 compileAsync 真正非阻塞、修正退化为同步、并发调度与让出预算；说明“Promise 解析”与“首帧可画”是两个信号。 | PR 页 |
| three.js PR #31501 | https://github.com/mrdoob/three.js/pull/31501 | 后处理/离屏 pass 需在 MRT 配置后单独预热，renderer.compileAsync 不覆盖 pass。 | PR 页 |
| three.js issue #27701 / PR #25092 / #25679 | [issue #27701](https://github.com/mrdoob/three.js/issues/27701)、[PR #25092](https://github.com/mrdoob/three.js/pull/25092)、[PR #25679](https://github.com/mrdoob/three.js/pull/25679) | compile/compileAsync 不检查也不拒绝编译错误，错误只在首次使用才触发；无程序化失败信号。 | 原页 |
| three.js issue #20304 / #30847 | [issue #20304](https://github.com/mrdoob/three.js/issues/20304)、[issue #30847](https://github.com/mrdoob/three.js/issues/30847) | 切换 `light.visible` 改变有效灯数，灯数在 program hash 内，所有受影响材质重编；作者实测约 100ms/program、切换灯组约 1.5s。 | 原页 |
| three.js issue #9384 | https://github.com/mrdoob/three.js/issues/9384 | 首次渲染后再加 fog 不会重编 shader，证明 fog 属于编译期变体；预热后再换雾会得到不同/错误 program。 | 原页 |
| three.js PR #34505 / #34507 | [issue #34505](https://github.com/mrdoob/three.js/issues/34505)、[PR #34507](https://github.com/mrdoob/three.js/pull/34507) | compileAsync 忽略 clipping 变体：预热后 2 个 program、真正 render 后 3 个；修复让 compile 遵循 clipping 状态。 | 原页 |
| three.js PR #34104 / #35016 | [PR #34104](https://github.com/mrdoob/three.js/pull/34104)、[PR #35016](https://github.com/mrdoob/three.js/pull/35016) | 异步编译期间材质外观参数可能被外部修改；双面透明材质的前后脸若都按 DoubleSide 预热会生成错误变体。 | PR 页 |
| three.js PR #34239 | https://github.com/mrdoob/three.js/pull/34239 | 提议让 compile 只分配 shadow map/depth texture 而不实际渲染；说明当前 compile 用 `shadowMap.render()` 取资源，阴影路径边界未覆盖。 | PR 页 |
| three.js issue #25133 / PR #27649 | [issue #25133](https://github.com/mrdoob/three.js/issues/25133)、[PR #27649](https://github.com/mrdoob/three.js/pull/27649) | 8192² 纹理初始上传约 1 秒、可能占 200MB 以上；纹理上传本身就能单独构成首帧长任务。 | 原页 |
| three.js PR #17697 / #29947 | [PR #17697](https://github.com/mrdoob/three.js/pull/17697)、[PR #29947](https://github.com/mrdoob/three.js/pull/29947) | `initTexture` 作为纹理上传独立入口的官方实现；把“材质编译”与“纹理上传”分开。 | PR 页 |
| three.js PR #28285 | https://github.com/mrdoob/three.js/pull/28285 | `initRenderTarget` 是 render target 首次分配的显式预热入口，可与材质/纹理预热分开评估。 | PR 页 |
| three.js issue #31220 | https://github.com/mrdoob/three.js/issues/31220 | 在 MRT 配置前调用 compileAsync 会破坏 renderer；预热触发点顺序会改变结果。 | 原页 |
| three.js issue #32524 | https://github.com/mrdoob/three.js/issues/32524 | 骨骼 buffer 名字取自 node.id 导致 cache key 变化，切换相机造成无谓重编译；“相同材质生成不同 shader”的漏缓存。 | 原页 |
| three.js issue #33685 | https://github.com/mrdoob/three.js/issues/33685 | 1000 个独立 node material 首帧约 15 秒；材质图唯一性比 draw call 更决定首帧，共用图+uniform 才能被预热覆盖。 | 原页 |
| three.js issue #34434 | https://github.com/mrdoob/three.js/issues/34434 | `getNodeType` 未 memoize 导致指数级递归，1.2 万节点图产生 1.68 亿次调用；构建期算法会伪装成“编译卡顿”。 | 原页 |
| three.js PR #32546 | https://github.com/mrdoob/three.js/pull/32546 | 把 callDepth 并入 render context key，是 #34681 的根因提交。 | PR 页 |
| three.js Discourse 56572 | https://discourse.threejs.org/t/reducing-shader-compile-time-on-scene-initialization/56572 | 维护者 donmccurdy 讨论 program 按 key 共享、材质常量决定变体、KHR 支持“必要但不充分”，并给实测与材质简化建议。 | 原页 |
| three.js Discourse 77616 | https://discourse.threejs.org/t/cameras-render-layer-how-to-warmup-to-avoid-first-time-lag/77616 | 改相机 render layer 首次出现一次性卡顿；shader 按需在 Mesh 首次渲染时编译并阻塞 render。 | 原页 |
| three.js Discourse 95930 / 95932 | https://discourse.threejs.org/t/rirris-a-rainy-night-convenience-store-as-a-portfolio/95930 | 真实项目：约 140KB raymarch shader 首帧阻塞 2.7 秒；输出色彩空间/色调映射属于 program，必须绑定 pass 实际写入的 target 才 warm 对变体。 | 原页 |
| three.js Discourse 10436 / 76539 | https://discourse.threejs.org/t/how-to-improve-texture-first-render-performance/10436 | 贴图首次进入视野单帧最多约 1 秒、累计约 5 秒；改图集后消失，说明纹理上传与材质编译是两类成本。 | 原页 |
| three.js Discourse 88368 | https://discourse.threejs.org/t/webgl2renderingcontext-getprogramparameter-freezes-app/88368 | 首次 `getProgramParameter` 冻结约 1.5 秒，Firefox 上 compileAsync 不同步、UI 同时卡死；完成信号的浏览器差异。 | 原页 |
| three.js Discourse 41069 / 48761 / 43711 | [41069](https://discourse.threejs.org/t/getprograminfolog-performance-issue/41069)、[48761](https://discourse.threejs.org/t/how-to-determine-if-a-material-has-failed-to-compile/48761)、[43711](https://discourse.threejs.org/t/defines-vs-customprogramcachekey/43711) | 读 program info log 会强制等待编译完成；失败只能用 `diagnostics.runnable`/`onShaderError` 间接判断；`customProgramCacheKey` 不区分条件会漏编。 | 原页 |
| three.js Discourse 4324 / 45617 / 60073 | [4324](https://discourse.threejs.org/t/tips-to-pre-compile-shaders-before-theyre-needed/4324)、[45617](https://discourse.threejs.org/t/any-way-to-do-webglrenderer-compile-while-scene-is-running/45617)、[60073](https://discourse.threejs.org/t/compile-multiple-scenes-with-different-cameras-for-performance-reasons/60073) | 早期 compile 预热实践：compile 只备 shader，bufferData/纹理上传仍造成首帧卡顿；运行中预热与多相机/多场景的覆盖问题。 | 原页 |
| three.js Discourse 2325 | https://discourse.threejs.org/t/large-lag-when-an-object-appears-in-the-view/2325 | Mugen87 的边界：compile() 只对场景图内材质有效，动态加载对象仍会在首见时编译。 | 原页 |
| three.js PR #19745 | https://github.com/mrdoob/three.js/pull/19745 | 把 attribute/uniform 查询推迟到首次使用；compileAsync 完成后首次取元数据仍可能同步等待。 | PR 页 |
| three.js PR #27098 | https://github.com/mrdoob/three.js/pull/27098 | WebGPURenderer 第一版 compileAsync，说明 NodeMaterial 的编译边界与 WebGL program 轮询不同。 | PR 页 |
| three.js PR #16610 / #16269 | [PR #16610](https://github.com/mrdoob/three.js/pull/16610)、[PR #16269](https://github.com/mrdoob/three.js/pull/16269) | 解释同步 `getProgramParameter` 错误检查为何会强制等待编译结果；允许关闭错误检查。 | PR 页 |
| three.js PR #18690 / #17822 | [PR #18690](https://github.com/mrdoob/three.js/pull/18690)、[issue #17822](https://github.com/mrdoob/three.js/issues/17822) | `initTexture` 的 cubemap 扩展与“按材质逐个按需编译”的诉求；划出上传纹理与编译材质的分界。 | PR 页 |
| three.js issue #30560 / #31674 / PR #32551 / #34070 | [issue #30560](https://github.com/mrdoob/three.js/issues/30560)、[issue #31674](https://github.com/mrdoob/three.js/issues/31674)、[PR #32551](https://github.com/mrdoob/three.js/pull/32551)、[PR #34070](https://github.com/mrdoob/three.js/pull/34070) | 区分逐对象 UBO 绑定开销与 shader 编译；NodeBuilderState 预构建/离线预编译路线；compute 编译的独立 awaitable 步骤。 | 原页 |
| react-three-fiber #3434 / #3435 | https://github.com/pmndrs/react-three-fiber/issues/3434 | R3F 实际项目报告 `getProgramInfoLog` 造成约 3.5s（最坏约 5s）冻结；同步读取编译日志会破坏异步编译。 | 原页 |
| react-three-fiber #3073 / discussion #821 | [issue #3073](https://github.com/pmndrs/react-three-fiber/issues/3073)、[discussion #821](https://github.com/pmndrs/react-three-fiber/discussions/821) | three.js v158 加入 compileAsync 后的 R3F 设计讨论：M1 上仍阻塞数帧（74.6ms），缺少可靠的异步完成信号。 | 原页 |
| three-gpu-pathtracer #889 / #893 | [issue #889](https://github.com/gkjohnson/three-gpu-pathtracer/issues/889)、[PR #893](https://github.com/gkjohnson/three-gpu-pathtracer/pull/893) | 冷 shader 缓存下最长帧 1.46–4.2 秒；过早编译会因 pool 尺寸未定生成不同 WGSL、反而打不中缓存。 | 原页 |
| webknossos #9869 / drawcall-ai 锁版本 | [webknossos #9869](https://github.com/scalableminds/webknossos/pull/9869)、[drawcall-ai 锁版本](https://github.com/drawcall-ai/lod/commit/a69e97f2d81caf159801998aca48e4fb6977898c) | 下游真实接入 compileAsync 的调用时机；另一个下游用锁 three 0.186 规避 r187 并发崩溃，说明 API 稳定性影响接入。 | PR 页 |
| Babylon PR #19004 / #19115 / #19130 | [PR #19004](https://github.com/BabylonJS/Babylon.js/pull/19004)、[PR #19115](https://github.com/BabylonJS/Babylon.js/pull/19115)、[issue #19130](https://github.com/BabylonJS/Babylon.js/issues/19130) | 上下文丢失重建时跳过仍在加载的 effect；异步 rejection 走 onError；重编译不释放被替换的 effect 的资源所有权。 | PR 页 |
| Babylon issue #18783 / #19007 / #19061 | [issue #18783](https://github.com/BabylonJS/Babylon.js/issues/18783)、[issue #19007](https://github.com/BabylonJS/Babylon.js/issues/19007)、[issue #19061](https://github.com/BabylonJS/Babylon.js/issues/19061) | pipeline cache 命中时 isReady 立即为 true 但仍在编译；context lost 期间完成编译会永久丢 sampler；whenReadyAsync 固定 100ms 轮询。 | 原页 |
| Babylon 论坛 12473 / 29128 / 46585 | [12473](https://forum.babylonjs.com/t/is-there-any-way-to-really-determine-that-everything-is-ready/12473)、[29128](https://forum.babylonjs.com/t/how-to-detect-when-scene-is-ready-and-all-shaders-have-finished-compiling/29128)、[46585](https://forum.babylonjs.com/t/how-to-know-when-the-scene-is-truly-ready/46585) | executeWhenReady 早于 effect 重建；用户要“全部 shader 编译完”的完成信号，答复是 whenReadyAsync；加载完成 ≠ 首帧完整。 | 原页 |
| Babylon 论坛 32619 / 56735 / 47805 | [32619](https://forum.babylonjs.com/t/how-to-preload-mesh-materials-so-that-there-isn-t-stutter-when-a-model-enters-the-camera-view/32619)、[56735](https://forum.babylonjs.com/t/rtt-with-shader-material-not-rendered-on-first-frame/56735)、[47805](https://forum.babylonjs.com/t/understanding-how-to-render-glb-files-without-delay/47805) | loader.compileMaterials 等待编译仍卡；根 mesh disabled 时 readiness 检查不测试其材质；GLB 首见冻结，把编译前移只是转移卡顿。 | 原页 |
| Babylon 论坛 46350 / 48733 / 52465 | [46350](https://forum.babylonjs.com/t/large-scene-models-will-stuck-and-stopped-when-fog-is-turned-on/46350)、[48733](https://forum.babylonjs.com/t/scene-flickering-when-turning-off-light/48733)、[52465](https://forum.babylonjs.com/t/dynamically-adding-lights-to-the-scene-causes-meshes-to-flicker-when-using-parallel-shader-compilation/52465) | 首次开雾冻结约 2 秒、所有材质重编译；关灯重编译无法保留旧 shader、出现一帧闪烁；动态加灯 + 并行编译导致网格闪烁。 | 原页 |
| Babylon 论坛 41213 / 28504 | [41213](https://forum.babylonjs.com/t/babylonjs-takes-longer-to-render-the-first-frame-on-mobile-compared-to-threejs/41213)、[28504](https://forum.babylonjs.com/t/loading-time-performance-regression/28504) | 移动端首帧慢含 UBO/驱动侧编译；Babylon 8.5s vs three.js 2s，官方承认差异来自“等全部 shader 编译”的策略选择。 | 原页 |
| Babylon 论坛 63620 / 64298 / 56507 | [63620](https://forum.babylonjs.com/t/dramatic-increase-in-webgpu-startup-time-whenready/63620)、[64298](https://forum.babylonjs.com/t/webgpu-cpu-cost-per-draw-call-in-9-29-9-30-and-which-small-prs-would-you-welcome/64298)、[56507](https://forum.babylonjs.com/t/waiting-for-a-material-to-be-completely-ready/56507) | WebGPU 启动变慢源于 NodeMaterial 仍走 GLSL→WGSL 转译；64298 是异步 pipeline 的前置约束清单；材质就绪不属于 scene.whenReadyAsync，需按 mesh 调 forceCompilationAsync。 | 原页 |
| Babylon 论坛 59713 / 63078 / 6626 / 26790 | [59713](https://forum.babylonjs.com/t/intermittent-parallel-shader-compilation-hang-and-postprocessmanager-null-error-in-babylon-js-with-react/59713)、[63078](https://forum.babylonjs.com/t/gl-max-vertex-uniform-buffers/63078)、[6626](https://forum.babylonjs.com/t/adding-destroying-point-lights-maybe-it-shall-be-in-bugs-section/6626)、[26790](https://forum.babylonjs.com/t/dynamic-enable-of-point-light/26790) | 并行编译偶发挂起不 resolve；灯数组合决定编译能否成功；删灯无法复用旧 effect 必然闪一帧；灯池 + intensity=0 + maxSimultaneousLights 的规避方案。 | 原页 |
| Babylon PR #18220 / #18596 / #18830 | [PR #18220](https://github.com/BabylonJS/Babylon.js/pull/18220)、[PR #18596](https://github.com/BabylonJS/Babylon.js/pull/18596)、[PR #18830](https://github.com/BabylonJS/Babylon.js/pull/18830) | createRenderPipelineAsync 预热 API 与拒绝运行时替换；morph influencer 数量变化触发动画中重编译；跨材质实例共享 shader loading 状态。 | PR 页 |
| Babylon PR #18755 / #18812 / #15863 / #15910 | [PR #18755](https://github.com/BabylonJS/Babylon.js/pull/18755)、[PR #18812](https://github.com/BabylonJS/Babylon.js/pull/18812)、[PR #15863](https://github.com/BabylonJS/Babylon.js/pull/15863)、[PR #15910](https://github.com/BabylonJS/Babylon.js/pull/15910) | 同 tick 重建 mesh 的一帧闪白；ShaderLoader 抽象被否的理由；DrawWrapper.dispose 释放 effect 的回归源；材质切换的延迟释放保护。 | PR 页 |
| Babylon typedoc Material / Effect / Scene | [Material](https://doc.babylonjs.com/typedoc/classes/_babylonjs_core.Material)、[Effect](https://doc.babylonjs.com/typedoc/classes/_babylonjs_core.Effect)、[Scene](https://doc.babylonjs.com/typedoc/classes/_babylonjs_core.Scene) | 公开 API 契约：isReady/isReadyForSubMesh/forceCompilation/forceCompilationAsync；Effect 的 whenCompiledAsync/onCompileObservable；Scene.whenReadyAsync 与材质编译完成不等价。 | 原页 |
| Babylon-Lite PR #785 / 文档 53 / commit cb50d34 | [PR #785](https://github.com/BabylonJS/Babylon-Lite/pull/785)、[文档 53](https://github.com/BabylonJS/Babylon-Lite/blob/master/docs/lite/architecture/53-async-shader-pipeline-compilation.md)、[commit cb50d34](https://github.com/BabylonJS/Babylon-Lite/commit/cb50d34cbffa331d7478a520499fd28876802cb7) | 最贴近“完成信号 + 取消语义”的新实现：waitForEffect(engine,effect,{signal})、isEffectReady、getEffectCompilationError；AbortSignal 取消只停等待、不销毁共享 effect。 | PR 页 |

### P2 跨引擎/平台对照（53 项）

| 候选 | 链接 | 理由 | 证据 |
|---|---|---|---|
| three.js PR #33924（WebGPU） | https://github.com/mrdoob/three.js/pull/33924 | WebGPU 渲染器的官方修复与语义声明：预编译只热身资源、不做真实渲染，并对齐 compileAsync 的非阻塞保证；不是 WebGLRenderer 的证据。 | PR 页 |
| three.js issue #35086（WebGPU） | https://github.com/mrdoob/three.js/issues/35086 | 自 #33924 起 WebGPU compileAsync 不再渲染 shadow map，shadow pass 的 pipeline 完全没编译；预热过的场景首个带阴影帧仍同步创建 pipeline。WebGLRenderer 的对应边界见 `compile` 只在 `_nodesHandler` 非空时调用 `shadowMap.render`。 | 原页 |
| Godot `pipeline_compilations` 文档 | https://docs.godotengine.org/en/stable/tutorials/performance/pipeline_compilations.html | 官方把 shader 编译与 pipeline 编译分开，列出加载期预编译触发、Surface/Draw 等 monitor 与 Compatibility 不覆盖；“编译边界”概念划分最完整。 | 原页 |
| Godot 4.7 同页 | https://docs.godotengine.org/en/4.7/tutorials/performance/pipeline_compilations.html | 明确 WebGL/Compatibility 没有 ubershader 和 pipeline 预编译，只能在加载时把材质/粒子放进视锥显示至少一帧；跨引擎的 WebGL 边界证据。 | 原页 |
| Godot proposal #12119 | https://github.com/godotengine/godot-proposals/issues/12119 | Compatibility(OpenGL/WebGL) 无 ubershader/预编译，提案要求 Precompile 开关与 `shader_force_compile(RID)`；正对应 Web 路径缺口。 | 原页 |
| Godot proposal #4754 | https://github.com/godotengine/godot-proposals/issues/4754 | 提出录制/回放 shader depot，后被异步编译 PR #90400 取代；保留 capture/replay 设计。 | 原页 |
| Godot PR #90400 | https://github.com/godotengine/godot/pull/90400 | Godot 的异步实时 shader 编译实现，是该提案认定问题已解决的依据。 | PR 页 |
| Godot PR #102552 + docs PR #11206 | [PR #102552](https://github.com/godotengine/godot/pull/102552)、[docs PR #11206](https://github.com/godotengine/godot-docs/pull/11206) | 把驱动格式 shader 编译移到导出期，D3D12 项目从分钟级降到约 2 秒，并明确不能替代 pipeline 预编译；文档落地含 Web 不支持。 | PR 页 |
| Godot issue #61233 | https://github.com/godotengine/godot/issues/61233 | 4.4 之前玩家侧编译卡顿的证据，是 ubershader 方案的动因。 | 原页 |
| Godot PR #105864 / #53411 / #109401 | [PR #105864](https://github.com/godotengine/godot/pull/105864)、[PR #53411](https://github.com/godotengine/godot/pull/53411)、[PR #109401](https://github.com/godotengine/godot/pull/109401) | GLES3 用 KHR 扩展预加载（约 700ms rAF 降到 0）；ubershader + 异步编译；Forward+ Material/SDF ubershader 覆盖。 | PR 页 |
| Godot RenderingServer 监视器 | https://docs.godotengine.org/en/stable/classes/class_renderingserver.html | MESH/SURFACE/DRAW/SPECIALIZATION 四类计数把“哪一步在编译”变成可观测项，适合设计正反例指标。 | 原页 |
| Godot 预编译设计稿（reduz gist） | https://gist.github.com/reduz/97634e58f4700793d32a5591b5f4fcee | 加载期预编译 fallback pipeline、miss 时先画 fallback 再后台编译 specialization 的状态机与 key 设计。 | 原页 |
| Unity Prewarm shaders | https://docs.unity.com/en-us/engine/6000.0/manual/materials-and-shaders/shaders/shader-troubleshooting/shader-reduce-stalling/shader-prevent-stutter/shader-pso-trace-warming/shader-prewarm | GraphicsStateCollection.WarmUp/WarmUpProgressively、JobHandle 控制同步/异步、Profiler marker 验证；Unity 侧完成信号与渐进语义。 | 原页 |
| Unity Fixing hitches or stalls | https://docs.unity3d.com/6000.0/Documentation/Manual/shader-reduce-stalling.html | 串联 SVC、PSO trace/warm、异步编译入口，判断 Unity 消费者实际可用的预热边界。 | 原页 |
| Unity ShaderVariantCollection | https://docs.unity3d.com/cn/current/Manual/shader-variant-collections.html | 记录实际使用变体、防止构建剥离、WarmUp/WarmUpProgressively；Unity 侧“变体遗漏”的权威入口。 | 原页 |
| Unity Shader.WarmupAllShaders | https://docs.unity3d.com/6000.4/Documentation/ScriptReference/Shader.WarmupAllShaders.html | 官方限制：DX12/Vulkan/Metal 上 vertex layout 或 render target 与预热数据不同仍可能卡；“预热清单不匹配”的官方证据。 | 原页 |
| Unity Other methods to warm up shaders | https://docs.unity.com/en-us/engine/6000.0/manual/materials-and-shaders/shaders/shader-troubleshooting/shader-reduce-stalling/shader-prevent-stutter/shader-prewarm-other | 官方明说 SVC/WarmupAllShaders 在 Vulkan/DX12/Metal 上会因缺失图形状态生成错误 PSO、不推荐使用；旧预热 API 的完成信号不能当现代管线可用。 | 原页 |
| Unity PSO tracing / GraphicsStateCollection | https://docs.unity.com/en-us/engine/6000.0/manual/materials-and-shaders/shaders/shader-troubleshooting/shader-reduce-stalling/shader-prevent-stutter/shader-pso-trace-warming/shader-pso-trace | BeginTrace/EndTrace 录制实际 draw 的 graphics state，WarmUp/WarmUpProgressively 预热，isWarmedUp/completedWarmupCount 轮询；比 SVC 更贴近实际 PSO。 | 原页 |
| Unity Discussions 465671 / 951031 | [465671](https://discussions.unity.com/threads/shader-compile-frame-hitches-even-with-shader-warmupallshaders.465671/)、[951031](https://discussions.unity.com/t/prevent-shader-compilation-stutters-with-pso-tracing-in-unity-6/951031) | 真实项目同时用 WarmupAllShaders 和 SVC 仍有 40ms+ 首次编译；关键字运行时变化、变体集合漏采；官方解释 PSO tracing 工作流。 | 原页 |
| Unity 中国 AsyncShaderWarmup / 微信小游戏文档 | [Unity 中国 AsyncShaderWarmup](https://docs.unity.cn/cn/tuanjiemanual/1.2/Manual/WeixinAsyncShaderWarmup.html)、[微信小游戏文档](https://developers.weixin.qq.com/minigame/dev/guide/game-engine/unity-webgl-transform/Design/AsyncShaderWarmup.html) | WarmUpAsync 返回 AsyncOperation、progress/completed、KHR 轮询、无取消 API；渲染早于完成会退回同步；WebGL 端预热能力并非普遍可用。 | 原页 |
| UWA：SVC 与 WarmupAllShaders 的取舍 | https://blog.uwa4d.com/archives/TechSharing_61.html | SVC 只热指定关键字，WarmupAllShaders 热全部导致过长预热；变体清单范围取舍的从业者说明。 | 原页 |
| Unreal PSO Precaching | https://dev.epicgames.com/documentation/en-us/unreal-engine/pso-precaching-for-unreal-engine | PostLoad 起收集所有 mesh pass，`NumPrecompilesRemaining` 作为 loading screen 完成信号，stat/validation 可查遗漏与 too late。 | 原页 |
| Unreal Optimizing Rendering with PSO Caches | https://dev.epicgames.com/documentation/en-us/unreal-engine/optimizing-rendering-with-pso-caches-in-unreal-engine | PSO cache 生成、bundled cache 与启动模式；运行时新建 PSO 可达 100ms+、缓存随驱动/补丁失效。 | 原页 |
| Unreal Manually Creating Bundled PSO Caches | https://dev.epicgames.com/documentation/en-us/unreal-engine/manually-creating-bundled-pso-caches-in-unreal-engine | 录制、打包、启动加载与 `NumPrecompilesRemaining()` 等待、miss 分类；示范“资源加载完成”与“PSO 编译完成”分离。 | 原页 |
| Unreal Advanced Shader Delivery | https://dev.epicgames.com/documentation/unreal-engine/generating-a-state-object-database-for-advanced-shader-delivery | ASDTool 从 cooked 构建生成 SODB，商店按 GPU/驱动下发 PSDB；仅 D3D12 SM6、不含光追 PSO，且不替代 PSO precaching。 | 原页 |
| Unreal FShaderPipelineCache API | https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/RenderCore/FShaderPipelineCache | `NumPrecompilesRemaining`/`ResumeBatching`/`StartupMode` 等加载屏等待入口；页面只返回目录，方法说明未逐字读到。 | 摘要 |
| Epic 官方技术博客（shader stuttering） | https://www.unrealengine.com/en-US/tech-blog/game-engines-and-shader-stuttering-unreal-engines-solution-to-the-problem | Epic 把 bundled PSO cache 与 5.2 的 predictive PSO precaching 分成两条路线，并承认 global shaders 仍无法按资产预编译；原页 403，仅据 80.lv 与摘要。 | 摘要 |
| 80.lv：Epic 谈 UE5 shader stuttering | https://80.lv/articles/epic-games-devs-on-solutions-to-unreal-engine-5-shader-stuttering-issues | PSO 预缓存会编译约 5 倍于实际使用的超集，但 global shaders、运行时动态材质和画质切换仍会漏；支撑“预热集合必然有遗漏”。 | 原页 |
| StraySpark UE5 PSO Precaching Playbook | https://www.strayspark.studio/blog/ue5-shader-stutter-pso-precaching-playbook | 实操清单：开启 r.PSOPrecaching、走遍武器/VFX/材质/光照状态采 cache、测试前清驱动缓存、用 stat GPU/RHI 把运行时 PSO 编译警告压到零。 | 原页 |
| PlayCanvas PR #9997 | https://github.com/playcanvas/engine/pull/9997 | `app.precompile()` 默认覆盖相机层全部 mesh（含屏外），返回 PrecompileStats 并发 progress 事件；WebGPU 走 createRenderPipelineAsync 限并发、WebGL 走 KHR 轮询加 1px warm-up draw。 | PR 页 |
| PlayCanvas PR #9999 / developer-site PR #1341 | [PR #9999](https://github.com/playcanvas/engine/pull/9999)、[developer-site PR #1341](https://github.com/playcanvas/developer-site/pull/1341) | 把 CameraFrame post-effect 纳入 precompile；官方使用边界文档：loading screen 等 precompile 完成、post-effect 仍首用编译。 | PR 页 |
| PlayCanvas PR #6076 / #5914 / #1855 / #1374 | [PR #6076](https://github.com/playcanvas/engine/pull/6076)、[PR #5914](https://github.com/playcanvas/engine/pull/5914)、[PR #1855](https://github.com/playcanvas/engine/pull/1855)、[PR #1374](https://github.com/playcanvas/engine/pull/1374) | 编译后立即 link WebGL shader、按材质/相机跳过未就绪 mesh；Safari 4.0s→2.8s；更早的按材质异步变体尝试；引入但未使用的 KHR 扩展。 | PR 页 |
| PlayCanvas #6085 / #5689 / #1474 / #4774 / #9477 | [issue #6085](https://github.com/playcanvas/engine/issues/6085)、[issue #5689](https://github.com/playcanvas/engine/issues/5689)、[issue #1474](https://github.com/playcanvas/engine/issues/1474)、[issue #4774](https://github.com/playcanvas/engine/issues/4774)、[PR #9477](https://github.com/playcanvas/engine/pull/9477) | shader 选项哈希/缓存与“无公开可用 precompile”的现状；启动预编译诉求；KHR 落地（80%/55%/62% 冻结下降）；旧 precompile 失效与删除。 | 原页 |
| PlayCanvas 论坛 41907 / 39634 / 5451 | [41907](https://forum.playcanvas.com/t/loading-issues-despite-preloading-assets/41907)、[39634](https://forum.playcanvas.com/t/optimization-tips-wanted-when-enabling-models/39634)、[5451](https://forum.playcanvas.com/t/first-time-enable-object/5451) | 预加载资产不等于预编译 shader，材质首次出现在屏幕才编译；首帧全部 enable 再 disable；“预热后首次进入视野仍有一次 hitch”。 | 原页 |
| Bevy PipelineCache API / PR #10812 | https://dev-docs.bevy.org/bevy_render/render_resource/pipeline_cache/struct.PipelineCache.html | Queued/Creating/Ok/Err 状态机、get_*_state、block_on_* 可查询接口；异步 pipeline 编译与每帧限流。 | 原页 |
| Bevy issue #20756 / #8224 / #11846 / PR #11758 | [issue #20756](https://github.com/bevyengine/bevy/issues/20756)、[issue #8224](https://github.com/bevyengine/bevy/issues/8224)、[issue #11846](https://github.com/bevyengine/bevy/issues/11846)、[PR #11758](https://github.com/bevyengine/bevy/pull/11758) | shader 资产未进 render world 时 pipeline 无法编译、首帧黑屏；并行编译需求；允许关闭异步创建；异步改造后 MSAA 路径未检查 pipeline 结果的回归。 | 原页 |
| wgpu #3794 / #9052 / #8524 / #8330 / PR #10438 / #8217 / #9080 | [issue #3794](https://github.com/gfx-rs/wgpu/issues/3794)、[issue #9052](https://github.com/gfx-rs/wgpu/issues/9052)、[issue #8524](https://github.com/gfx-rs/wgpu/issues/8524)、[issue #8330](https://github.com/gfx-rs/wgpu/issues/8330)、[PR #10438](https://github.com/gfx-rs/wgpu/pull/10438)、[PR #8217](https://github.com/gfx-rs/wgpu/pull/8217)、[PR #9080](https://github.com/gfx-rs/wgpu/pull/9080) | createRenderPipelineAsync 的上游依赖；预编译 shader 与去 naga 化；GLSL passthrough；Metal passthrough 限制；task_executor 异步创建；预编译宏与 wgpu-shaders 拆分。 | 原页 |
| Fossilize / dxvk-async / Vello #455 | [Fossilize](https://github.com/ValveSoftware/Fossilize)、[dxvk-async](https://github.com/Sporif/dxvk-async)、[Vello #455](https://github.com/linebender/vello/pull/455) | Vulkan pipeline 捕获/回放，把 VkPipelineCache 预热移到离线或启动阶段；dxvk-async 把管线编译搬到 worker；Vello 复用并行 shader 初始化。 | 原页 |
| MDN WebGL best practices | https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices | 规范级用法：先批量 compile/link，再用 `COMPLETION_STATUS_KHR` 非阻塞轮询；`COMPILE_STATUS`/`LINK_STATUS`、`getProgramInfoLog`、uniform 查询都可能阻塞并破坏并行。 | 原页 |
| Khronos `KHR_parallel_shader_compile`（OpenGL registry） | https://registry.khronos.org/OpenGL/extensions/KHR/KHR_parallel_shader_compile.txt | 完成信号的能力边界：`COMPLETION_STATUS_KHR` 只报编译/链接是否完成，不保证并行，也不定义等待行为。 | 原页 |
| Khronos WebGL 扩展原文 | https://registry.khronos.org/webgl/extensions/KHR_parallel_shader_compile/ | WebGL 扩展的非阻塞轮询语义；three.js/PlayCanvas 的完成信号都依赖它。 | 原页 |
| MDN `KHR_parallel_shader_compile` | https://developer.mozilla.org/en-US/docs/Web/API/KHR_parallel_shader_compile | 轮询写法、limited availability、与阻塞式 `COMPILE_STATUS`/`LINK_STATUS` 的差异；对应 three.js 无扩展时“立即 ready”的回退。 | 原页 |
| Khronos 邮件列表 msg00034 | https://www.khronos.org/webgl/public-mailing-list/public_webgl/1904/msg00034.php | link 完成前对 program 的 uniform 反射查询和 draw 都会 stall，`useProgram` 通常不会；应只用 `COMPLETION_STATUS_KHR` 并把 program 操作推迟到非 pending 之后。 | 原页 |
| Khronos 邮件列表 msg00025 | https://khronos.org/webgl/public-mailing-list/public_webgl/1905/msg00025.php | 该扩展只让编译/link 并行；`COMPILE_STATUS`/`LINK_STATUS`、`getUniformLocation`/`getUniformBlockIndex`、`useProgram` 和 draw 仍会 stall；还记录 D3D11 下按 vertex attributes 重编译和 dummy VAO 对策。 | 原页 |
| Khronos 邮件列表 msg00042 | https://www.khronos.org/webgl/public-mailing-list/public_webgl/1904/msg00042.php | 扩展早期查询本身仍可能耗时约 15ms；实践结论是先批量 compile 再 link、link 仍可能等编译。 | 原页 |
| Khronos WebGL PR #2855 | https://github.com/KhronosGroup/WebGL/pull/2855 | 晋级社区批准的讨论：扩展只改善加载卡顿、link 总耗时不变，Firefox/Chrome 非 Windows 实现有差异。 | PR 页 |
| MDN `GPUDevice.createRenderPipelineAsync` | https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipelineAsync | 规范级契约：Promise 只在 pipeline“可无额外延迟使用”时 resolve，失败 reject `GPUPipelineError(internal/validation)`；WebGPU 完成/失败语义样本。 | 原页 |
| W3C WebGPU 规范 | https://www.w3.org/TR/webgpu/ | `createRenderPipelineAsync` 与 GPU pipeline cache 的规范定义；核对“编译完成/可用/可持久化”三层语义。 | 原页 |
| gpuweb discussion #2085 | https://github.com/gpuweb/gpuweb/discussions/2085 | Promise 解析后当帧仍不可用；sync/async 双路径可能重复工作；shader module 没有同步创建路径；WebGPU 侧“完成≠首帧可用”的规范级讨论。 | 原页 |
| Chromium issue 576324631 | https://issues.chromium.org/issues/576324631 | 大管线条目超过约 768KiB 时磁盘缓存静默拒绝，导致每次访问重新编译；预热产物不能只按一次运行设计。 | 摘要（登录墙） |
| Chromium issue 578117964 / 578879217 | [578117964](https://issues.chromium.org/issues/578117964)、[578879217](https://issues.chromium.org/issues/578879217) | Dawn/DXC 冷建约 1MB WGSL compute pipeline 各需 17–21 秒；WebGPU 内存 shader cache 沿用 6MiB，120 条管线约 10.6MiB 时重载与首次一样慢。 | 摘要（登录墙） |
| Chromium issue 576311156 | https://issues.chromium.org/issues/576311156 | WebGPU 磁盘缓存每 profile 约 14–20MB，大应用管线跨会话被逐出后仍需重编；磁盘缓存命中不能当“已编译”的保证。 | 摘要（登录墙） |
| Bugzilla 1536674 | https://bugzilla.mozilla.org/show_bug.cgi?id=1536674 | Firefox 实现 `KHR_parallel_shader_compile` 的 bug 与 Worker 暴露争议，解释同一扩展在浏览器间行为不一致。 | 原页 |

### P3 背景、工具与社区证据（27 项）

| 候选 | 链接 | 理由 | 证据 |
|---|---|---|---|
| Hacker News 45496406（WebGPU 编译 WGSL） | https://news.ycombinator.com/item?id=45496406 | 评论指出 SPIR-V/IR 仍需 GPU driver 编译，所谓预编译并不消除 stutter；CoD 在关卡加载期尽量编译但无法预知全部 permutation。 | 原页（Algolia） |
| Hacker News 40379833（Dolphin ubershaders） | https://news.ycombinator.com/item?id=40379833 | ubershader 一次编译覆盖多 variant、把优化版放后台编译的路线；与逐变体预热形成替代方案。 | 原页（Algolia） |
| Hacker News 47614638（Nvidia 预编译） | https://news.ycombinator.com/item?id=47614638 | 驱动/平台级空闲预编译（Nvidia Auto Shader Compiler、Microsoft ASD）的社区反应；预编译仍需匹配硬件/驱动。 | 原页（Algolia） |
| Lobsters 0ici79 / ts2kgb | [0ici79](https://lobste.rs/s/0ici79/layers_all_way_down_untold_story_shader)、[ts2kgb](https://lobste.rs/s/ts2kgb/building_directx_shader_compiler_better) | 编译管线分层与跨平台变体限制；用 Zig 做离线静态预编译 shader 以避免运行时等待，与 WebGL 只能运行时编译对照。 | 原页（JSON） |
| GDC 2026 Advanced Shader Delivery | https://gdcvault.com/play/1036022/ | 商店分发按 GPU 预编译的 shader 数据库（SODB→PSDB），用状态对象集合和缓存命中率统计减少首启与游戏内 stutter。 | 原页 |
| Dolphin Emulator ubershaders 博文 | https://dolphin-emu.org/blog/2017/07/30/ubershaders/ | 经典替代路线：ubershader 覆盖未预编译变体，避免首帧编译停顿，代价是常驻更复杂的 shader；原站 403，仅据摘要/HN。 | 摘要 |
| Wavedash Shader stutter | https://docs.wavedash.com/tutorials/shader-stutter | 平台文档：浏览器 shader cache 不保证持久、需按冷启动设计，给出 Unity/Godot 预热与清缓存测试方法。 | 原页 |
| Habr 1095150 + 实现仓库 | https://habr.com/en/articles/1095150/ | 改灯光数量使 program cache 失效、冻结约 9 秒；ANGLE/D3D11 同步反射每 program 160–340ms；固定 12 灯池后 8989ms→0，并按每帧约 170ms 分摊。 | 原页 |
| DEV：三篇首帧测量 | https://dev.to/fur-gaming/unity-webgl-safari-hang-the-first-draw-shader-stall-43f2 | Unity WebGL Safari 首绘 3.1s、`webglPrepareUniformLocationsBeforeFirstDraw`、194 个 program 与 Chrome/Safari 约 25 倍差异。 | 原页 |
| DEV：PageSpeed 长任务 | https://dev.to/gronskideveloper/why-your-threejs-scene-gets-a-bad-pagespeed-score-and-it-is-not-javascript-gpj | 14 个 program 全在首帧编译，656ms 长任务、TBT 约 700ms；预热后首帧几毫秒；Lighthouse 用 SwiftShader、磁盘缓存会让本地测量失真。 | 原页 |
| DEV：2.9M 三角形 / checkShaderErrors | https://dev.to/balwinder_singh_dev/rendering-a-29-million-triangle-human-body-in-the-browser-without-freezing-the-page-1j7g | profile 指向 `getProgramInfoLog`，关闭 checkShaderErrors 后总阻塞约 13.6s→4s、最长冻结 7.3s→1.5s；错误检查破坏并行完成信号。 | 原页 |
| DEV：GLB 首帧范围 | https://dev.to/alicia_lu/threejs-glb-loading-cache-decode-and-the-first-gpu-frame-51kf | 首次与缓存后首帧 14.7–144.9ms，缓存会掩盖编译/上传成本；测量需清缓存、区分冷热启动。 | 原页 |
| 3d-asset LOD 实测 / 灯光重编译 | [LOD 实测](https://3d-asset.com/guides/threejs-lod-without-stutter/)、[灯光重编译](https://3d-asset.com/guides/threejs-shader-recompilation-light-count/) | 336 车实测把冷启动 280–310ms 压到 48–73ms（compileAsync）、33–90ms（+initTexture）、36–63ms（+预热帧）；逐项列出会改变 cache key 的灯光/雾/阴影因素。 | 原页 |
| 掘金 compileAsync 复盘 | https://juejin.cn/post/7702110021828624394 | 中文复盘：compileAsync 后仍有地形 CPU、纹理上传、离屏 color-space、alpha-test 阴影 depth 等缺口；提出带 cancelled 回调的 prepareTextures 接口。 | 原页 |
| 知乎回答 497114680 / 308346610 | https://www.zhihu.com/question/497114680/answer/2103799397758912311 | 冷启动约 100 个 program、139–140 张纹理，Windows/ANGLE 首帧 15–22 秒；按 render target/灯光/雾分组预热、initTexture 逐张上传、关视锥剔除分批预渲染，阻塞 2.95s→0.79s。 | 摘要 |
| 知乎专栏 WebGL 并行编译 + 回答 308346610（雾/灯光变体） | [专栏 p/1899249822113969314](https://zhuanlan.zhihu.com/p/1899249822113969314)、[回答 308346610](https://www.zhihu.com/question/308346610/answer/2090817768937485946) | 解释 KHR 扩展提高编译线程数、`COMPLETION_STATUS_KHR` 非阻塞查询，以及“未就绪先跳过渲染会让物体闪烁一次”的副作用；另一条从 WebGLProgram 参数拼接说明雾/灯光/render target 进入 cache key。 | 摘要 |
| 知乎 Babylon 编译流程 + 回答 315103318（WebGPU 调用深度） | [专栏 p/23032841657](https://zhuanlan.zhihu.com/p/23032841657)、[回答 315103318](https://www.zhihu.com/question/315103318/answer/2103441751642064382) | `ShaderStore → ShaderProcessor.Process → Effect`；`_prepareEffect` 用 vertex+fragment+fullDefines 作 key 查 `_compiledEffects`；WebGPU compileAsync 调用深度问题的现场记录。 | 摘要 |
| 掘金/CSDN/博客园：cache key 与加载阶段 | [掘金 getProgramCacheKey](https://juejin.cn/post/7662339239138033705)、[CSDN 编译机制](https://blog.csdn.net/m0_55049655/article/details/161413314)、[博客园 加载阶段](https://www.cnblogs.com/smileZAZ/p/23629922) | 按 `材质+场景+物体 → getParameters() → getProgramCacheKey() → acquireProgram()` 讲复用；加载阶段拆分与“进度条不等于 GPU 准备完成”。 | 原页 |
| plumephp：Shader 变体管理 | https://plumephp.com/client-shader-variant-management/ | 首次放技能卡、特效资源不大的排查切口：法线/溶解/阴影/边缘光/雾效/顶点色开关指数级放大变体；主张按真实战斗路径选择性预热。 | 原页 |
| 中文 bug log：ShaderMaterial._effect 为 null | https://eghrhegpe.github.io/MikuMikuAR/buglog/2026-07-20-GroundMesh-ShaderMaterial-effect-null-crash.html | 共享 ShaderMaterial 被 mesh.dispose() 级联销毁后，下一帧 isReady() 空指针崩溃；失败/取消语义与 isReady 前置条件。 | 原页 |
| CSDN/InfoQ 的首帧拆解 | [CSDN](https://blog.csdn.net/qq_26483133/article/details/169465411)、[InfoQ compileAsync](https://xie.infoq.cn/article/71ad8e0b04724b25c5b5ab71f) | 与掘金同作者/同项目的 CSDN 版本，补充五阶段拆分、8ms 软预算、最大 616ms 长任务；InfoQ 文本解释 compileAsync 只轮询 program ready、不减少 program 数，SwiftShader 8 轮对照显示总耗时不一定下降。两站是交叉发布，不是独立案例。 | 原页/摘要 |
| awesome-threejs / awesome-webgl / awesome-webgpu | [awesome-threejs](https://github.com/AxiomeCG/awesome-threejs)、[awesome-webgl](https://github.com/sjfricke/awesome-webgl)、[awesome-webgpu](https://github.com/mikbry/awesome-webgpu) | 头部索引的 Shaders 章节只有编辑器/学习资源，没有 compileAsync/首帧预热条目；说明该主题在 awesome 层存在空白。 | 原页 |
| awesome-babylonjs / awesome-game-engine-dev | [awesome-babylonjs](https://github.com/Symbitic/awesome-babylonjs)、[awesome-game-engine-dev](https://github.com/stevinz/awesome-game-engine-dev) | Babylon 与跨引擎索引有 shader/材质示例，但没有 forceCompilation/readiness 专项条目；作为补漏入口。 | 原页 |
| gamedev-skills / threejs-skills / webgpu-claude-skill | [gamedev-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills)、[threejs-skills](https://github.com/CloudAI-X/threejs-skills)、[webgpu-claude-skill](https://github.com/dgreenheck/webgpu-claude-skill) | Skill 市场头部：79 个 skill + 引擎路由，覆盖 three.js r187、shader 与 performance-optimization，但 README 明确没有首帧 warmup；正好是本次任务的增量缺口。 | 原页 |
| iart-ai / shader-cache-optimization-agent-skill | [webgl-animation-skills](https://github.com/iart-ai/webgl-animation-skills)、[shader-cache-optimization-agent-skill](https://github.com/dungnotnull/shader-cache-optimization-agent-skill) | WebGL/three.js skill 集合含 shader-glsl、R3F、GPU 资源释放，但不涉及编译边界；`dungnotnull` 的 shader cache 专项仅 5 star、未验证，作低置信度线索。 | 原页 |
| Spector.js / Myaku | [Spector.js](https://github.com/BabylonJS/Spector.js)、[Myaku](https://debuff.jp/myaku/) | 帧捕获工具能拿到 draw call、shader 源码和 GL 状态，自带 MCP server；用于验证“哪些 program 实际编译/绑定”。 | 原页 |
| @vibegameengine/shader-warmup / drei Preload | [@vibegameengine/shader-warmup](https://www.npmjs.com/package/@vibegameengine/shader-warmup)、[drei Preload](https://github.com/pmndrs/drei) | R3F/three.js 的 warmup 库：注册资源、微缩不可见渲染强制编译、mount→compile→unmount 后报告 ready；drei Preload 用 gl.compile + CubeCamera 补纹理上传。 | 摘要 |

## 9. 前几项为什么最值得深挖

1. **`WebGLRenderer.js` 的 `compile`/`compileAsync` 是唯一的“触发范围 + 完成信号”一手定义。** 它把 `scene.traverse`、`targetScene` 灯光收集、透明 DoubleSide 展开、`currentProgram.isReady()` 轮询和 10ms 重试写在同一段代码里；接口报告里的 `programs` 字段如果不按这段代码解释，就会把“材质数”“program 数”“首帧数”混成一个数。
2. **`WebGLProgram.js` 的 `onFirstUse`/`isReady` 解释了为什么 resolve 不等于首帧可用。** link 完成只说明 GPU 侧编译/链接结束；info log 读取、uniform/attribute 反射、纹理上传、阴影深度与 pass 首次编译都可能在首帧才发生。这个区分直接决定报告是否要拆成四项。
3. **`WebGLPrograms.js` 的 cache key 是反例的源码依据。** `fog`/`fogExp2`、灯数、`shadowMapType`、`outputColorSpace`、`customProgramCacheKey` 都在 key 里；换雾/灯、换有效阴影类型（PCF↔VSM）、换 render target、换 quiet/content-standards 键都会生成新 program（PCFSoft→PCF 不是有效变体，r186 起会被归一）。没有这张参数表，“仍然首次编译”就只能靠现象猜。
4. **Babylon 的 `forceCompilation` 提供了另一种完成语义与失败语义。** 它按 mesh 准备变体、16ms 轮询、有 `onError`/Promise reject，但没有取消；scene 消失时等待会悬空。把两者并排，才能看出 three.js 接口应补的是“纹理/阴影/pass 的显式分段 + 自己的取消令牌”，而不是再造一个全局 ready 开关。
5. **Molstar 的 `pipeline-readiness` / `program-switch-frames` 是最接近本任务接口的工程先例。** 它已经实现“prepare 不绘制”、按 signature 收集变体、hold 帧直到 ready，并诚实记录了 WebGL WBOIT 首次 impostor 绘制仍冻结 694ms、ANGLE 会按 draw 的 render target layout 再建 shader。这比任何博客都更直接地说明“预热到什么程度才算首帧可用”。
6. **MOBA 的 `client.ts:126` + `world.ts` + `effects.ts` 是最终会证伪接口的路径。** 首次 `world.draw(0,1)` 之前没有任何预热；effects 的材质先建、Mesh 事件后才挂，health 的材质在工厂创建时预建、Mesh 在 `sync` 时才挂（`health.ts` L7-L9、L25），tower 只有 backing 预建，impact 事件时同时 new 材质与 Mesh，启动时 `compile(scene)` 覆盖不到后几类；quiet/content-standards 的 `customProgramCacheKey` 又增加了变体。正例和反例必须在这几条真实路径上写断言，而不是只测 three.js 的最小场景。

## 10. 未验项与边界

- **没有运行证据。** 本轮只读源码与公开页面；没有开浏览器、没有 GPU、没有安装依赖、没有联系上游。正例/反例的通过与否、任何毫秒数、任何“首帧不编译”的结论都要等目标仓的 browser-smoke 或独立页面实测。
- **three.js 版本差。** 固定源码是 0.187.0，消费者是 0.186.1；本次只对 `WebGLRenderer.js` 的 compile/compileAsync 区域做了逐字 diff，`WebGLProgram.js`/`WebGLPrograms.js` 只核了语义与行号映射，未对整文件逐字 diff。WebGPU 路径在 r187 引入的并发缺陷（#35315）与 r187 之后的修复（#35359）不属于消费者的 WebGLRenderer。
- **Canvas2D 回退没有预热接口。** `createPlayableWorld` 可能返回 `backend:'canvas2d'` 的 world（`canvas-world.ts` 只有 `sync`/`draw` 等），无条件调用 `prepareFirstVisibleFrame` 会在回退路径抛 TypeError；调用方必须先判 backend 或方法存在。
- **Babylon 完成信号依赖子类。** `material.pure.ts` 的基类 `isReady()` 返回 true、`isReadyForSubMesh` 只发插件事件；具体材质（PBR 等）才决定是否包含纹理/灯光/阴影状态。官方文档说默认材质要等 effect 和纹理都就绪，但这不是基类源码能单独证明的，已按文档与源码分开标注。
- **消费者没有暴露 scene/renderer。** 正例的 program/texture 计数需要在 `captureState()` 增加一个只读 `programs` 字段，或在 browser-smoke 里通过测试句柄读取；反例的换雾/换灯需要测试侧能拿到 scene，当前公共返回对象没有该入口。这是接口设计要补的最小测试缝，不是现有产品行为。
- **“首帧可用”只定义到提交层。** 断言用 `renderer.info.render.calls`、`programs.length`、`memory.textures` 与 `render.frame`，能证明“没有新增编译/上传/跳过对象”，不能证明像素正确、GPU 队列已完成或视觉无闪烁。若需要 GPU 完成语义，只能在 1×1 离屏 target 上 `readRenderTargetPixels` 或加 fence，本轮未验证其代价。
- **候选清单的边界。** 第 8 节来自本轮已收集清单；本单元只对 P0 中标为“源码”的固定文件、消费者路径和 Molstar 文档逐行复核，其余条目按清单的取法引用，未逐条重读。清单中与本任务无关的 AI coding 工具未纳入排序；读不到的渠道已在第 7 节集中说明，不用摘要冒充原文。
