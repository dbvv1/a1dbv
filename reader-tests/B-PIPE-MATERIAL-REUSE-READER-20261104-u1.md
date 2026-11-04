# 新读者记录 · B-PIPE-MATERIAL-REUSE-READER-20261104 · u1

角色：第一次读该页的读者。只按任务给出的页面全文（`domains/game-dev/assets/materials.md@463b4b9a` 的 `quiet-material-family` 节）与任务点名的 MOBA 消费者操作；未读 a1dbv 的其他文档，未搜同主题教程。

## 做到哪一步

全流程做到 CPU 对象与测试层，四路都实际跑过，未停在纸面推演：

1. 在隔离副本 `tmp/B-PIPE-MATERIAL-REUSE-READER-20261104/` 取出 `MOBA-Like@b489ed3`，原仓与页面文件只读。
2. 基线跑了 `tests/client/quiet-family.test.ts` 与 `quiet-buildings.test.ts`，10 项通过。
3. 依据页面“复用三张 WebP、六建筑受保护石材区”和任务要求，新增一个单实例绑定文件 `src/render/quiet-building-instance.ts`：把 `tower-teal` 的第二个摆放实例接到 `QuietTextures.wall`，复用 `prepareQuietStone`／`bindQuietStone` 与 `loadQuietFamily` 的释放入口，不新建纹理、不改第一实例。
4. 新增 `tests/client/quiet-building-instance.test.ts`，实际执行正常加载、第二张失败、注册中途异常、销毁后迟到完成四路；三份 quiet 测试合计 14 项通过。
5. `tsc -p tsconfig.web.json` 通过；全量 CPU 套件 572 项，571 通过、1 项无关音频测试失败。
6. 报告产物：`docs/collaboration/local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/result.md`。最小变更片段（两个新增文件）随报告交回。工作目录内未提交、未推送、未切分支。

四路的结论：正常加载时两个实例共用同一个 `wall` 纹理对象，第二实例移除后第一实例的材质与 uniform 不变；第二张纹理失败时 family 返回 `undefined`，第一实例保持 baseline；注册中途异常时新实例释放 1 个 material＋2 个 geometry 并恢复原引用，第一实例不受影响；销毁后迟到的纹理被释放一次且不绑定。最终退出时每张纹理与每个克隆资源都只释放一次。

## 卡点

### 1. “MOBA 的 quiet 旁置复用三张 WebP、六建筑受保护石材区与五个标准件”（quiet 节首句）

- 缺什么：没有实现入口。页面没说 `loadQuietFamily`／`applyQuietBuildings`／`prepareQuietStone` 在哪、谁拥有纹理、单实例怎么解绑。相邻的灯光节、地面节都直接链 `src/render/*.ts` 的固定实现，quiet 节只链验收文档。
- 实际处理：任务文本给了 `src/render/quiet-family.ts`，再从该文件 import 关系找到 `quiet-buildings.ts`、`quiet-stone.ts` 和现有测试；按源码推断所有权。
- 做错过的：一开始以为可以用 `applyQuietBuildings` 的聚合 `dispose()` 做“移除第二个实例”。读源码后发现它一次绑定六建筑、只返回一个总释放，没有单资产句柄；只能新增增量函数。这不是页面文字能直接推出的。

### 2. “新候选替换旧单元而非继续叠加”

- 缺什么：这句在讲 `stylized-diffuse` 公开入口退休、“一个候选替换旧候选”；但任务要“加一个新的第二建筑实例”，字面就是“继续叠加”。页面没有区分“材质候选不能叠加”和“同一候选内可增加摆放实例”。
- 实际处理：按“候选入口不叠加、实例可以增加”理解，并在报告里记为假设。
- 做错过的：没有；这是读法冲突，不是操作错误。

### 3. “接收重点包括失败后的资源归属……五标准件若在缺少动作 clip 等后半构造时失败，已分配的路肩几何、材质和克隆骨架仍须释放”

- 缺什么：只覆盖五标准件，不覆盖六建筑的实例移除，也不覆盖“新增实例被移除时仍存活的第一实例不得失去纹理”。更关键的是，现有 `applyQuietBuildings` 的 API 根本不支持单实例移除，页面也没有说该不该为此新增接口。
- 实际处理：新增单实例绑定函数，复刻原函数的“克隆 geometry／material＋逆序恢复”模式；用 `dispose()` 幂等标志保证重复调用只释放一次。
- 做错过的：最初把“第一实例”理解成“先注册的那个新实例”，准备用批量注册模拟；读源码后才确定任务里的“第一实例”更自然地指已有的生产实例，于是测试改为“生产六建筑做第一实例、额外摆放做第二实例”。

### 4. “不复制纹理”

- 缺什么：没有可判定标准。材质 `clone()` 不会复制纹理对象，但仍会复制贴图引用；页面无法回答“共享材质引用”“共享纹理对象”“禁止材质克隆”三者哪一个才算不复制。
- 实际处理：按最严格且可测的口径——不新建 `THREE.Texture`，第二实例的 `material.map` 与第一实例同源材质是同一对象，`quietWall` uniform 与 `family.wall` 是同一对象。
- 做错过的：无。

### 5. “第二张失败、注册中途异常、销毁后迟到完成”三路

- 缺什么：页面没有这组测试矩阵，也没有故障注入点、加载次数、释放所有者的验收口径。页面只给“任一失败保原表面”“取消也不能再启动一轮默认资产请求”等原则；“注册中途异常”和“销毁后迟到完成”在 quiet 节没有对应句子。
- 实际处理：按任务要求自定四路。第二张失败指三张 WebP 的第二张（forest）加载抛错；注册中途异常用“第二个石材网格的源材质 `clone()` 抛错”模拟后半构造失败；销毁后迟到完成用 `AbortController`＋手动 resolve 纹理模拟。
- 做错过的：写注册中途异常测试前，先假设把 `catapult_turret_green` 改名成受保护 body 会因石材三角形为 0 而在 coverage 校验处提前抛错。实际查了 `prepareQuietStone` 的 coverage（384 个 stone triangles），它不会提前失败，于是改用材质 `clone()` 抛错，才能真正走到“已绑定第一个网格、第二个网格失败”的半途状态。

### 6. “550 项测试、构建、关闭开关的同输入回放通过”

- 缺什么：没有写对应的 commit。本树 b489ed3 去掉本轮新增 4 项后是 568 项，且本环境 1 项无关音频测试 `audio-skill` 失败；页面数字来自其链接的 `0811894` 验收节。
- 实际处理：不把 550 当本树可复现事实；报告分别写本轮 14 项 quiet 测试、全量 572/571 与本树基线数。
- 做错过的：第一次跑全量看到 1 失败，先怀疑是新模块影响；确认失败测试只导入音频模块、未导入新增文件后，判为与本改动无关，但没有继续追根因。

## 页面之外还去翻了什么

- MOBA-Like b489ed3 的 `src/render/quiet-family.ts`、`quiet-buildings.ts`、`quiet-stone.ts`、`battle-assets.ts`、`battlefield.ts`；两份现有 quiet 测试；`asset-pipeline/quiet-family/README.md` 与 `source/stone-regions.json`。用途：找入口、所有权、受保护区域、实例化方式；页面本身不给这些。
- 页面 quiet 节直接链接的 MOBA `docs/side-release-acceptance.md`（`0811894` 的 quiet 节）：核对 550 项、五标准件失败清理、默认回退的原始表述。该文档也没有单实例移除接口。
- `reader-tests/` 中一份既有记录：只借鉴报告格式，未取同主题结论。
- 环境检查：`node --version`、目标仓 `package-lock.json`、同机其他 MOBA worktree 的 `node_modules` 版本；借用 three 0.186.1／vitest 3.2.4，与锁文件一致。未安装软件、未联网下载资产。
- 未看：a1dbv 其他文档、同主题其他教程、页面链接的官方引擎文档（本轮不需要）。

## 核对

本轮为读者自记，未另请非作者复核。页面本身把 WebGL 材质、同机位盲评与硬件成本列为待验；本记录同样不声称这些通过。

### 非作者复核（2026-11-05）

复核依据：本卡 job.md、页面 `quiet-material-family` 节（463b4b9a）、MOBA-Like b489ed3 的 `git archive` 与隔离副本。以下全部为本轮实跑，不采信自报。

**可复现项**

- 隔离副本与 `git archive b489ed3` 逐文件比对：除新增的 `src/render/quiet-building-instance.ts`、`tests/client/quiet-building-instance.test.ts`，以及测试生成的 `outputs/` 与软链 `node_modules` 外无差异。原 MOBA clone 与本工作树都无源码改动，页面与任务文件未改。
- 三个 quiet 测试文件：**14 项通过**，与自报一致。
- `tsc -p tsconfig.web.json`：退出 0。
- 全量：**88 文件／572 项，571 通过**；唯一失败 `tests/client/audio-skill.test.ts` 可复现。排除新增测试文件后 **87 文件／568 项，567 通过**，同一失败。自报的 572/571/1 与 568 基线成立；页面“550 项”确系 `0811894` 验收文档数字，不是 b489ed3。
- 产物中未出现本机绝对路径或内网地址；未提交、未推送、未切分支。

**卡点判断**

1. quiet 节首句缺实现入口与所有权说明：**page**。该节只链验收文档，相邻节都直链 `src/render/*.ts`。任务文本另给了 `quiet-family.ts`，所以不是完全阻塞，但页面确实缺入口。
2. “新候选替换旧单元而非继续叠加”与“新增第二实例”的冲突：**page**。原句主语是材质候选入口，可读成只约束候选；但页面没有一句区分“候选不叠加、摆放实例可增加”，读者把假设记录下来是合理处理。
3. 失败归属只覆盖五标准件、没有六建筑单实例解绑与第一实例存活的契约：**page**。现有 `applyQuietBuildings` 只返回聚合 `dispose()`，页面与验收文档都没给单实例所有权、解绑顺序或新增接口的边界。
4. “不复制纹理”无判定口径：**page**（quiet 节内）。同页前文“材质复制通常仍会共享纹理引用”已给定义，问题是 quiet 节没有链到它；读者按“不新建 Texture、wall uniform 同对象”收窄口径是可测的合理选择。
5. 四路矩阵与故障注入点不在页面：**page**（页面只给原则）。矩阵与断言来自任务要求；“改名受保护网格会让石材三角形为 0”的初始假设是读者自己的试错，已自行纠正，不计为页面缺陷。
6. 550 项未写对应 commit：**page**（版本前提缺失）。页面已把 `0811894` 链接放在同句，读者“目标树不可复现”的判断正确，属于表达可改进而非阻塞。

**读者未意识到的问题（missed）**

1. 真实消费端的第二实例是 `battlefield.ts` 对 `model.scene.clone(true)` 的克隆，且 `world.ts` 先在资产上执行 `applyQuietBuildings` 再创建 battlefield。把 `applyQuietBuildingInstance` 接到这类已绑定 quiet 的克隆上会二次注入：本轮实测 vertexShader 的 `attribute float quietStoneMask;` 与 `varying float vQuietStone;` 各出现 2 次、fragment 的 `uniform sampler2D quietWall;` 出现 2 次，`customProgramCacheKey` 变成 `...|quiet-stone-v1|quiet-stone-v1`；GLSL 重复全局声明会使 quiet shader 编译失败。测试用 `loadModel('tower-teal')` 重新解析出的未绑定模板绕开了这条真实路径，所以“接到实际消费者”只在自造接缝上成立。
2. “第二张失败”和“销毁后迟到完成”两路都没有先执行 `applyQuietBuildings`，测试里不存在第一实例；`snapshot(assets)` 只证明六个原模型未被改。报告写的“第一实例保持 baseline／原 material 引用”在这两路没有实际对象，也没有覆盖“已接好的第一实例遇到第二张失败仍可用”。
3. 正常加载路断言 `secondMaterial.map === sourceMaterial.map`，其中 `sourceMaterial` 是模板自己的材质，clone 后必然相等；没有断言与第一实例的 map。本轮实测两实例的 albedo map 是不同 `THREE.Texture` 对象（两次 GLB parse 各建纹理）。真正共享的是注入的 `family.wall`（uniform 已验证），“不复制纹理”的跨实例证据只在 wall 上成立，报告“与第一实例同源材质是同一对象”表述过强。
4. 页面与验收文档要求的“普通页提示后恢复默认／显式恢复提示”没有进入读者对“失败后玩家保留什么”的回答，也未验；四路只到资源层。
5. 未跑页面同句的“构建”（`tsconfig.build.json`／完整 build）与关闭开关的同输入回放，只跑了 web typecheck；这两项也没有列进“未验”。

**结论**

自报的测试与类型检查数字、四路执行都可复现，六个卡点的记录基本成立。但第 1 条 missed 使“在真实消费者上把新的第二建筑实例接到已有 quiet 共享纹理”这一核心验收只在重新解析的模板上成立：接到消费者实际 clone 路径会重复绑定 quietStone。据此按任务验收判 **未真正做成**（四路证据本身可采信，问题在改动不可按声称的方式用于消费者）。

