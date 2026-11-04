# B-PIPE-MATERIAL-REUSE-READER-20261104 · result

状态：reader-test 已实际执行到 CPU 对象与测试层，未提交、未推送、未切换分支、未修改任务文件与原页。

- 页面：`domains/game-dev/assets/materials.md@463b4b9a95a8e6eadb98b730d8aa373a05dcbec0`，只读 `quiet-material-family` 节。
- 消费者：`MOBA-Like@b489ed38592dc184fffe2ab9b3b186441c7dc9bb`，从只读 clone 用 `git archive` 取树，未改原仓。
- 隔离副本：`tmp/B-PIPE-MATERIAL-REUSE-READER-20261104/`（工作目录内、已被 `.gitignore` 的 `tmp/` 覆盖）。
- 最小产物：本文件；可复跑输入为副本内新增的 `src/render/quiet-building-instance.ts` 与 `tests/client/quiet-building-instance.test.ts`，片段见文末。

## 做到哪一步

1. 在隔离副本复核页面所指消费者：`src/render/quiet-family.ts`、`quiet-buildings.ts`、`quiet-stone.ts` 与 `tests/client/quiet-*.test.ts`。基线（改动前）`quiet-family`＋`quiet-buildings` 两个测试文件 10 项通过。
2. 二改只做增量：新增 `src/render/quiet-building-instance.ts`，把 `tower-teal` 的一个新摆放实例接到 `QuietTextures.wall`，复用 `prepareQuietStone`／`bindQuietStone` 与 `loadQuietFamily` 返回的释放入口；没有改任何现有生产文件，也没有复制纹理。
3. 新增 `tests/client/quiet-building-instance.test.ts`，按任务要求的四路执行。三份 quiet 相关测试合计 **14 项通过**。
4. `tsc -p tsconfig.web.json` 通过。
5. 全量 CPU 套件：**88 文件 / 572 项，571 通过、1 失败**；失败为 `tests/client/audio-skill.test.ts`（音频调色板回退），未导入本次新增模块，与本改动无关。去掉本次新增 4 项后，b489ed3 本树为 568 项、567 通过、1 失败。页面“550 项测试”对应其链接的 `0811894` 验收记录，不是本树数字；本轮没有把 550 当作可复现事实。
6. 未做也不声称：浏览器、WebGL／GPU、shader 编译、真实 WebP 解码、同机位图、盲评、硬件预算。

## 四路结果

| 路径 | 实际加载调用 | 释放所有者与次数 | 回退结果 | 模拟依赖与真实 CPU 边界 |
|---|---|---|---|---|
| 正常加载 | `loadQuietFamily` 调 loader 3 次（earth／forest／wall）；第二实例注册 0 次纹理加载 | 3 张纹理由 family 的 `dispose` 持有，最终各释放 1 次；第一实例与第二实例各自持有自己的 geometry／material 克隆，第二实例移除时释放 1 个 geometry＋1 个 material 各 1 次，wall 0 次 | 无回退；两实例共用同一 `wall` 纹理对象 | 纹理为注入的内存 `THREE.Texture`；六个建筑 GLB 与 `tower-teal` GLB 由 CPU `GLTFLoader` 实际解析；未走网络、未解码 WebP |
| 第二张失败 | loader 2 次：earth 成功，forest 抛错 | 已取得的 1 张由 `loadQuietFamily` 的 catch 释放 1 次；family 返回 `undefined` | 玩家保留原 forest 默认表面：第一实例的 geometry／material 引用与 baseline 完全一致 | loader 在第二张直接抛错，没有构造真实网络／解码错误对象；这验证的是原子安装与析构，不是浏览器错误分类 |
| 注册中途异常 | 该路 0 次纹理加载 | `prepareQuietStone` 生成 2 个 geometry 克隆；第二网格转换时 1 个 material 克隆已生成后抛错；新实例的 catch 释放 1 个 material＋2 个 geometry 各 1 次，并恢复两个网格的原 geometry／material | 新实例整体撤销；仍存活的第一实例 0 变化并继续使用 quiet；family 的 3 张纹理 0 释放 | 把第二石材网格的源材质换成 `clone()` 抛错的替身，模拟“后半构造失败”；页面没有给出故障注入点，这是本轮自定接缝 |
| 销毁后迟到完成 | loader 1 次（第一张 pending）；abort／销毁后 resolve | 迟到纹理由 `loadQuietFamily` 的 catch 释放 1 次；forest／wall 不再请求（0 次）；family 返回 `undefined` | 无实例绑定；第一实例保持 baseline；销毁后没有复活 | `AbortController`＋手动 resolve 内存纹理；未模拟真实 `TextureLoader` 的图片解码与浏览器缓存 |

补充：每个实例与 family 的 `dispose()` 均重复调用两次，释放计数仍为 1，说明幂等。正常加载路径中第二实例的 `material.map` 与第一实例同源材质是同一对象，`onBeforeCompile` 注入的 `quietWall` uniform 值也是同一个 `family.wall`，没有新建纹理。

## 按页面回答三问

- **为何不是每楼一纹理：** 同一 family 的三张 WebP 是共享源，六个建筑都只取各自受保护石材区，纹理由 world／family 统一持有。每楼一份会把同一石材的下载与驻留按楼数翻倍，也会破坏同族采样一致性；页面在预算节用单张 4096² RGBA8 约 64 MiB（含 mip 约 85.33 MiB）说明纹理驻留要按容量算，且“同族材质已有可复用源时……不为接线重生成资源”。MOBA 的 quiet README 记录三张运行时纹理合计约 18.87 MB base、约 25.15 MB 含 mip，这组数字是共享一份的量级，不是每楼一份。
- **何时可释放：** 只有场景／world 所有者退出、且没有其他消费者仍引用时才由 family 统一释放一次；单个建筑实例移除只解绑它自己的 geometry／material 克隆，不释放共享纹理。纹理加载失败或销毁后迟到完成时，已取得的纹理由加载入口立即释放，不能等下一次场景启动。页面的“失败后资源归属”给了原则，但没有写单实例移除的生命周期；这里按源码的 `dispose` 幂等契约执行。
- **失败后玩家保留什么：** 保留原 forest 默认渲染与原物体的 geometry／material 引用；quiet family 不会以部分纹理、部分建筑的形式装上。注册中途失败时已改的对象按逆序恢复，仍存活的第一实例不失去纹理，玩家侧继续可玩。

## 第一处照做卡点与其它卡点

**第一处：quiet 节首句只给结论，没有给实现入口。** 原句（`materials.md` quiet 节）：“MOBA 的 quiet 旁置复用三张 WebP、六建筑受保护石材区与五个标准件，以 `materials=quiet-family-v1` 选择”。缺的是：`loadQuietFamily`／`applyQuietBuildings`／`prepareQuietStone` 的文件与函数名、调用顺序、纹理所有权和单实例释放接口都没有出现在本节；紧邻的其它节普遍直接链到 `src/render/*.ts` 的固定实现，quiet 节只链到验收文档。第一次读到“三张 WebP、六建筑、五个标准件”无法判断该改哪一层，只能先在 MOBA 仓检索 `quiet-family-v1`。（任务文本另行给了 `src/render/quiet-family.ts` 这个文件名，才少走一步；页面本身没有。）

其余卡点：

1. **“新候选替换旧单元而非继续叠加”与“新的第二建筑实例”字面冲突。** 页面这句在讲 `stylized-diffuse` 公开入口退休、一个候选替换旧候选；但“再加一个建筑实例”读起来正是“继续叠加”。缺一句区分“材质候选不能叠加”和“同一候选内可以增加摆放实例”。本轮按后者理解，并把它记成假设。
2. **“接收重点包括失败后的资源归属”只覆盖五标准件，不覆盖六建筑的实例移除。** 原句讲“五标准件若在缺少动作 clip 等后半构造时失败，已分配的路肩几何、材质和克隆骨架仍须释放”。任务要求的“新增实例被移除时第一实例不得失去纹理”没有任何页面文字；`applyQuietBuildings` 只返回一个聚合 `dispose()`，本身也不支持单资产解绑。缺的是每实例的所有权边界与解绑顺序。本轮新增了单实例绑定函数，属于页面之外的自定实现。
3. **“不复制纹理”没有可判定的定义。** 材质 `clone()` 仍共享 `map` 与纹理对象；只说“不复制”无法判断是通过共享材质、共享纹理引用，还是禁止任何材质克隆。本轮按“不新建 `THREE.Texture`、`map` 与 `quietWall` uniform 指向同一对象”执行。
4. **“第二张失败／注册中途异常／销毁后迟到完成”不是页面给出的测试矩阵。** 页面只写“任一失败保原表面”“取消也不能再启动一轮默认资产请求”等原则，没有列这四路，也没有给故障注入点、加载次数与释放所有者的验收口径。四路的具体断言来自任务要求与本轮自定。
5. **“550 项测试”与目标树不一致。** 页面数字来自其链接的 `0811894` 验收节；本树 b489ed3 全量为 568 项（去掉本轮新增 4 项），且本环境有 1 项无关音频测试失败。页面若要求读者用目标树复核该数字，应写清 commit。

## 最小变更片段

只新增两个文件，未修改现有生产文件。

```diff
diff --git a/src/render/quiet-building-instance.ts b/src/render/quiet-building-instance.ts
new file mode 100644
index 00000000..227d33da
--- /dev/null
+++ b/src/render/quiet-building-instance.ts
@@ -0,0 +1,50 @@
+import * as THREE from 'three';
+import type {QuietTextures} from './quiet-family.js';
+import {prepareQuietStone,type QuietStoneCoverage} from './quiet-stone.js';
+import {bindQuietStone} from './quiet-buildings.js';
+
+/** A single additional placement of an already-covered building body. The
+ * family owns the wall texture; this binding only owns its geometry/material
+ * clones and unbinds without touching textures or the first instance. */
+export interface QuietBuildingInstance {
+  coverage: QuietStoneCoverage[];
+  dispose(): void;
+}
+
+export function applyQuietBuildingInstance(root: THREE.Object3D, assetId: string, textures: QuietTextures): QuietBuildingInstance {
+  const prepared = prepareQuietStone(root, assetId);
+  const releases: Array<() => void> = [];
+  const materials: THREE.Material[] = [];
+  let disposed = false;
+  try {
+    if (!prepared.meshes.length || !prepared.coverage.length || prepared.coverage.some(c => c.stoneTriangles === 0)) throw new Error(`Missing explicit stone coverage ${assetId}`);
+    for (const mesh of prepared.meshes) {
+      const source = mesh.material;
+      const convert = (original: THREE.Material) => {
+        const material = original.clone();
+        materials.push(material);
+        material.onBeforeCompile = original.onBeforeCompile;
+        material.customProgramCacheKey = original.customProgramCacheKey;
+        bindQuietStone(material, textures.wall);
+        return material;
+      };
+      mesh.material = Array.isArray(source) ? source.map(convert) : convert(source);
+      releases.push(() => { mesh.material = source; });
+    }
+  } catch (error) {
+    for (const release of releases.reverse()) release();
+    for (const material of materials) material.dispose();
+    prepared.dispose();
+    throw error;
+  }
+  return {
+    coverage: prepared.coverage,
+    dispose() {
+      if (disposed) return;
+      disposed = true;
+      for (const release of releases.reverse()) release();
+      for (const material of materials) material.dispose();
+      prepared.dispose();
+    },
+  };
+}
diff --git a/tests/client/quiet-building-instance.test.ts b/tests/client/quiet-building-instance.test.ts
new file mode 100644
index 00000000..ec59ae57
--- /dev/null
+++ b/tests/client/quiet-building-instance.test.ts
@@ -0,0 +1,103 @@
+import {describe,it,expect,vi} from 'vitest';
+import {readFile} from 'node:fs/promises';
+import * as THREE from 'three';
+import {GLTFLoader,type GLTF} from 'three/addons/loaders/GLTFLoader.js';
+import {applyQuietBuildings} from '../../src/render/quiet-buildings.js';
+import {loadQuietFamily,type QuietTextures} from '../../src/render/quiet-family.js';
+import {applyQuietBuildingInstance} from '../../src/render/quiet-building-instance.js';
+import type {BattleAssets} from '../../src/render/battle-assets.js';
+
+const ids=['tower-teal','tower-rust','barracks-teal','barracks-rust','base-teal','base-rust'];
+async function loadModel(id:string):Promise<GLTF>{
+  const loader=new GLTFLoader().register(()=>({name:'CPU_embedded_texture_identity',loadTexture:async()=>new THREE.Texture()}));
+  const bytes=await readFile(new URL(`../../asset-pipeline/battle/exported/${id}.glb`,import.meta.url));
+  return loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
+}
+async function load():Promise<BattleAssets>{
+  const models:Record<string,GLTF>={};
+  for(const id of ids)models[id]=await loadModel(id);
+  return {models,dispose(){}};
+}
+function snapshot(assets:BattleAssets){const result=new Map<THREE.Mesh,{geometry:THREE.BufferGeometry;material:THREE.Material|THREE.Material[]}>();for(const model of Object.values(assets.models))model.scene.traverse(o=>{if(o instanceof THREE.Mesh)result.set(o,{geometry:o.geometry,material:o.material});});return result;}
+function quietMesh(root:THREE.Object3D):THREE.Mesh{let found:THREE.Mesh|undefined;root.traverse(o=>{if(o instanceof THREE.Mesh&&o.name==='building_tower_catapult_green'&&!found)found=o;});if(!found)throw new Error('quiet mesh missing');return found;}
+function compile(material:THREE.Material){const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'#include <map_fragment>'};material.onBeforeCompile(shader as unknown as THREE.WebGLProgramParametersWithUniforms,{} as THREE.WebGLRenderer);return shader;}
+
+describe('second quiet building instance',()=>{
+  it('shares the existing wall texture with the first instance and unbinds without releasing it',async()=>{
+    const assets=await load(),input=[new THREE.Texture(),new THREE.Texture(),new THREE.Texture()];
+    const disposed=input.map(t=>{const fn=vi.fn();t.addEventListener('dispose',fn);return fn;});
+    let n=0;const family=await loadQuietFamily('quiet-family-v1',async()=>input[n++]!);
+    expect(family).toBeDefined();
+    const first=applyQuietBuildings(assets,family!);
+    const firstMesh=quietMesh(assets.models['tower-teal']!.scene),firstMaterial=firstMesh.material as THREE.MeshStandardMaterial;
+
+    const template=await loadModel('tower-teal'),root=template.scene.clone(true);root.position.set(12,0,0);root.updateWorldMatrix(true,true);
+    const sourceMesh=quietMesh(root),sourceGeometry=sourceMesh.geometry,sourceMaterial=sourceMesh.material;
+    const second=applyQuietBuildingInstance(root,'tower-teal',family!);
+    expect(second.coverage).toHaveLength(1);expect(second.coverage[0]!.assetId).toBe('tower-teal');
+    const secondMesh=quietMesh(root),secondMaterial=secondMesh.material as THREE.MeshStandardMaterial;
+    expect(secondMaterial).not.toBe(firstMaterial);
+    expect(secondMaterial.map).toBe(sourceMaterial instanceof THREE.Material?sourceMaterial.map:undefined);
+    expect(compile(secondMaterial).uniforms['quietWall']!.value).toBe(family!.wall);
+    expect(firstMesh.material).toBe(firstMaterial);
+    expect(compile(firstMaterial).uniforms['quietWall']!.value).toBe(family!.wall);
+
+    const cloneGeometryDispose=vi.fn(),cloneMaterialDispose=vi.fn();
+    secondMesh.geometry.addEventListener('dispose',cloneGeometryDispose);secondMaterial.addEventListener('dispose',cloneMaterialDispose);
+    second.dispose();second.dispose();
+    expect(disposed[2]).not.toHaveBeenCalled();
+    expect(secondMesh.geometry).toBe(sourceGeometry);expect(secondMesh.material).toBe(sourceMaterial);
+    expect(cloneGeometryDispose).toHaveBeenCalledTimes(1);expect(cloneMaterialDispose).toHaveBeenCalledTimes(1);
+    expect(firstMesh.material).toBe(firstMaterial);expect(compile(firstMaterial).uniforms['quietWall']!.value).toBe(family!.wall);
+
+    first.dispose();family!.dispose();family!.dispose();
+    disposed.forEach(fn=>expect(fn).toHaveBeenCalledTimes(1));
+  });
+
+  it('loads no partial family when the second texture fails and keeps the first instance on its original materials',async()=>{
+    const assets=await load(),before=snapshot(assets);
+    const disposed:ReturnType<typeof vi.fn>[]=[];let n=0;
+    const family=await loadQuietFamily('quiet-family-v1',async()=>{if(n++===1)throw Error('forest unavailable');const t=new THREE.Texture(),fn=vi.fn();t.addEventListener('dispose',fn);disposed.push(fn);return t;});
+    expect(family).toBeUndefined();expect(disposed).toHaveLength(1);expect(disposed[0]).toHaveBeenCalledTimes(1);
+    for(const [mesh,s] of before){expect(mesh.geometry).toBe(s.geometry);expect(mesh.material).toBe(s.material);}
+  });
+
+  it('rolls a half-registered second instance back to its own source and leaves the first instance untouched',async()=>{
+    const assets=await load(),input=[new THREE.Texture(),new THREE.Texture(),new THREE.Texture()];
+    const disposed=input.map(t=>{const fn=vi.fn();t.addEventListener('dispose',fn);return fn;});
+    let n=0;const family=await loadQuietFamily('quiet-family-v1',async()=>input[n++]!);
+    const first=applyQuietBuildings(assets,family!);
+    const firstMesh=quietMesh(assets.models['tower-teal']!.scene),firstMaterial=firstMesh.material,firstGeometry=firstMesh.geometry;
+
+    const template=await loadModel('tower-teal'),root=template.scene.clone(true);root.updateWorldMatrix(true,true);
+    const building=quietMesh(root),turret=root.getObjectByName('catapult_turret_green') as THREE.Mesh;
+    turret.name='building_tower_catapult_green';
+    const originalBuildingGeometry=building.geometry,originalBuildingMaterial=building.material;
+    const originalTurretGeometry=turret.geometry;
+    const refusingMaterial={name:'hexagons_medieval',clone(){throw Error('mid-registration');}};
+    turret.material=refusingMaterial as unknown as THREE.Material;
+
+    const materials=vi.spyOn(THREE.Material.prototype,'dispose'),geometries=vi.spyOn(THREE.BufferGeometry.prototype,'dispose');
+    try{
+      expect(()=>applyQuietBuildingInstance(root,'tower-teal',family!)).toThrow('mid-registration');
+      expect(materials).toHaveBeenCalledTimes(1);expect(geometries).toHaveBeenCalledTimes(2);
+    }finally{materials.mockRestore();geometries.mockRestore();}
+    expect(building.geometry).toBe(originalBuildingGeometry);expect(building.material).toBe(originalBuildingMaterial);
+    expect(turret.geometry).toBe(originalTurretGeometry);expect(turret.material).toBe(refusingMaterial);
+    expect(firstMesh.material).toBe(firstMaterial);expect(firstMesh.geometry).toBe(firstGeometry);
+    disposed.forEach(fn=>expect(fn).not.toHaveBeenCalled());
+    first.dispose();family!.dispose();disposed.forEach(fn=>expect(fn).toHaveBeenCalledTimes(1));
+  });
+
+  it('disposes a texture that arrives after destroy and never binds a second instance',async()=>{
+    const assets=await load(),before=snapshot(assets);
+    const abort=new AbortController(),late=new THREE.Texture(),lateDispose=vi.fn();late.addEventListener('dispose',lateDispose);
+    let resolve!:(value:THREE.Texture)=>void;const loadSpy=vi.fn(()=>new Promise<THREE.Texture>(r=>resolve=r));
+    let destroyed=false;
+    const pending=(async()=>{const family=await loadQuietFamily('quiet-family-v1',loadSpy,abort.signal);if(destroyed||abort.signal.aborted){family?.dispose();return undefined;}const template=await loadModel('tower-teal');return applyQuietBuildingInstance(template.scene.clone(true),'tower-teal',family!);})();
+    abort.abort();destroyed=true;resolve(late);
+    expect(await pending).toBeUndefined();
+    expect(loadSpy).toHaveBeenCalledTimes(1);expect(lateDispose).toHaveBeenCalledTimes(1);
+    for(const [mesh,s] of before){expect(mesh.geometry).toBe(s.geometry);expect(mesh.material).toBe(s.material);}
+  });
+});
```

## 检查与未验

- 已运行：3 个 quiet 测试文件 14 项通过；`tsc -p tsconfig.web.json` 退出 0；全量 CPU 套件 572 项（571 通过、1 项无关音频失败）。
- 已核：新增实例的 `material.map` 与第一实例同源材质共享同一纹理对象；`quietWall` uniform 与 `family.wall` 同一对象；第二实例移除不触发 wall 的 dispose；family／实例 `dispose` 各重复调用两次仍只释放一次。
- 未验：真实 shader 编译与 WebGL 呈现、真实 WebP 下载／解码、浏览器回退提示、GPU／驻留内存、同机位画面对照与非作者盲评、目标设备帧时间。页面本身也把这些列为待验，本轮没有用 CPU 测试替代。
- 未改原生产文件；隔离副本内现有文件与归档逐字一致（只新增两个文件）。
- 下一步（交回原页与消费者负责人）：先在允许 GPU／浏览器的目标环境编译 shader 并做同机位对照；若接受“单实例绑定”这个增量接口，再决定是并入 `quiet-buildings.ts` 还是保持独立文件，并补一个真实 GLB 的失败注入，而不是测试替身材质。

## 页面之外还翻了什么

- MOBA-Like 目标 commit 的 `src/render/quiet-family.ts`、`quiet-buildings.ts`、`quiet-stone.ts`、`src/render/battle-assets.ts`、`src/render/battlefield.ts`、`tests/client/quiet-family.test.ts`、`tests/client/quiet-buildings.test.ts`、`asset-pipeline/quiet-family/README.md`、`stone-regions.json`：用于确认入口、所有权、受保护区域与实例化方式。
- 页面在 quiet 节直接链接的 MOBA `docs/side-release-acceptance.md`（`0811894` 的“quiet 材质已有候选重放”节）：核对了 550 项测试、五标准件失败清理和默认回退的原始表述；该文档仍没有单实例移除接口。
- `reader-tests/` 中一份既有记录：只借鉴报告格式，未取同主题结论。
- 环境：借用同机其他 MOBA worktree 的 `node_modules`（three 0.186.1、vitest 3.2.4，与目标锁文件一致）；未安装新软件、未联网下载模型或资产。
- 未看：a1dbv 其他文档、同主题其他教程、页面链接的官方引擎文档（本轮不需要）。
