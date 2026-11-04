# 读者实测记录：B-PIPE-MODEL-BATCH-READER-20261104（u1）

- 读者身份：第一次读这页，只按页面与任务卡做，不参考同主题其他教程。
- 所照页面：`domains/game-dev/assets/3d.md`（base_ref `463b4b9a95a8e6eadb98b730d8aa373a05dcbec0`）中的 `asset-family-rebuild` 节，即“成套重导出先全部生成，再替换作品中的资源目录”及其后两段。
- 任务卡：`runs/B-PIPE-MODEL-BATCH-READER-20261104/u1-a0-2026-11-04T180129307Z/job.md` 的“环境标准件二改照做”。
- 固定消费者：FPS-Like `36fde4bb6a2e8f9652528fdea648d0a90190db79` 的 `assets/environment/standards-v1/`。
- 一句话结论：二改、末件失败保旧批、首次失败不发布、重跑一致性都在本机跑通；页面要求的 Blender 4.3.2 逐字节复现因本机没有该版本而只做到“结构相同、二进制块相同、差一个版本字符串”。

## 1. 做到哪一步

1. 从固定提交取出 `assets/environment/standards-v1` 到独立临时副本，未改 FPS 原仓，也未改本仓的页面或其他文档。
2. 基线重建两次（未改任何输入）：三份 GLB 两次逐字节相同。与仓库已提交的 GLB 比较，文件大小、三角面、顶点数、包围盒、节点名、材质与扩展全部相同，二进制 chunk 也逐字节相同；差异只在 JSON 的 `asset.generator`：已提交为 `Khronos glTF Blender I/O v4.3.47`，本机为 `v5.2.41`。因此本机无法复现“与既有产物逐字节相同”，但能证明几何与导出结构一致。
3. 按任务把 `style.json` 的 `palette.plaster` 从 `#d8d5c5` 改成同文件 `trim` 的 `#c2c6bd`，只改这一行，`revision` 仍为 `draft-01`，其他配方字段未动。
4. 改色后重建：墙、掩体 GLB 改变，灯 GLB 与基线逐字节相同。顶点色计数核对：墙的 plaster 线性色顶点 424→0、trim 596→842；掩体 plaster 120→0、trim 308→404；灯杆色和灯头色各 112→112 不变。这对应页面“墙、掩体一起更新，灯不变”。
5. 故障注入：
   - 第一件（墙）导出前抛错：exit 1，`models` 整目录与注入前快照逐字节相同，无 `.models.build-*` 残留。
   - 第二件（掩体）导出前抛错：同上。
   - 末件（灯）导出前抛错：墙、掩体 GLB 已真实写入 staging 后灯才失败；exit 1，`models` 仍与注入前逐字节相同，无残留。这是任务卡要求的“末件构建失败，核原采用批是否保持”，比页面的“第二件失败”更严格。
6. 首次失败不发布：在尚不存在的输出目录 `fresh` 上注入第一件失败，`fresh` 未创建，无 `.fresh.build-*`。
7. 缺少 `style.json` 输入时重建：exit 1，旧批逐字节不变，无残留。
8. 恢复脚本后重跑：三份 GLB 与改色成功批逐字节相同，`keep.txt` 等未知普通文件保留；`manifest.json` 除 `blend` 的 bytes/sha 外相同；`.blend` 每次保存字节不同（本机 5.2.3 下，见卡点 5）。
9. 配套测试：`test_asset_batch.py` 12/12 通过；`test_build_integration.py` 因本机没有 `blender` 可执行文件，在 `assertIsNotNone(blender)` 处失败，整支真实 Blender 集成测试未跑。
10. 范围：只做 CPU 与文件处理；没有启动游戏、浏览器、渲染或 GPU，没有把 CPU 结果写成游戏画面采用。没有提交、推送或切换分支，也没有改任务文件或页面文件；没有安装软件、使用凭据或付费服务；证据均来自公开 FPS-Like 固定提交。

## 2. 产物在哪

- 记录：本文件。
- 证据目录：`reader-tests/B-PIPE-MODEL-BATCH-READER-20261104-u1-evidence/`
  - `style.json`：只改 `palette.plaster` 的配方。
  - `models/wall-center-dogleg.glb`、`models/low-cover-site.glb`、`models/lamp-existing.glb`、`models/manifest.json`：改色后完整三件 GLB 与清单。`.blend` 可编辑源由 manifest 记录（本次 133081 bytes、sha256 `ae2111db...`），未放入证据目录，因为它在 5.2.3 下每次保存字节不同，不宜当稳定产物。
  - `verification.json`：三组哈希、结构对照、顶点色计数、故障与测试结果、页面与源码差异。
  - `test-asset-batch.txt`：12 项文件系统回归的原始输出。
  - `test-build-integration.txt`：真实 Blender 集成测试的阻塞说明。
- 临时副本：`reader-tests/.b-pipe-model-batch-reader-work/`（已删除，不随记录提交）；从固定提交重新取出 `standards-v1/` 后，可用下面命令复跑。
- 说明：任务卡写的写范围是 `docs/collaboration/local-jobs/artifacts/B-PIPE-MODEL-BATCH-READER-20261104/result.md` 加最小复现输入；本次是读者实测，按外层要求只写本记录与证据目录，没有写 `result.md`，也没有提交或推送。

复跑命令（在临时副本的 `standards-v1/` 下）：

```text
# 本机没有 blender 可执行文件，只能用预装 bpy 模块时：
python tools/build.py
python tools/build.py -- --output fresh
# 页面/README 的正式入口（有 Blender 4.3.2 时）：
blender --background --factory-startup --disable-autoexec --python-exit-code 1 --python tools/build.py
```

## 3. 页面判据逐条核对

| 页面说法 | 实测结果 | 判定 |
|---|---|---|
| “先在同级临时目录完成三份 GLB、可编辑源与清单，再替换整批” | staging 目录与 `models` 同父级；三份 GLB、`.blend`、`manifest.json` 齐全后才替换；测试夹具 `models/keep.txt` 保留 | 成立 |
| “普通发布失败恢复旧目录” | `test_asset_batch` 的 rename 失败用例通过；真实导出失败时目标目录未被触碰 | 成立（真实导出失败）；rename 失败为 mocked |
| “未知普通文件保留” | 改色成功批保留测试夹具 `keep.txt`；故障批不触碰旧目录 | 成立 |
| “改灰泥色后墙、掩体一起更新，灯不变” | 墙/掩体 GLB 改变；灯 GLB 逐字节相同；顶点色计数对应 | 成立 |
| “第二件失败和缺少风格输入时，旧整批摘要均不变” | 第二件、第一件、末件失败与缺 `style.json` 均 exit 1、整目录逐字节不变 | 成立 |
| “12 项文件系统回归” | `test_asset_batch.py` 12/12 通过 | 成立 |
| “含导出取消、目录替换失败和恢复失败” | 12 项中覆盖 CANCELLED、rename 失败、rollback 失败、清理失败、锁、符号链接、危险目标 | 成立（文件系统层，mocked） |
| “三份 GLB 与既有产物逐字节相同” | 本机只有 bpy 5.2.3，不能复现；结构、大小、二进制 chunk 相同，仅 generator 字符串不同 | 部分成立/版本受限 |
| “真实 Blender 复跑命令” | 无 `blender` 可执行文件，集成测试在入口失败 | 阻塞 |
| “进程被强杀或断电时不承诺跨目录原子性” | 未做真实 SIGKILL/断电；只核了残留锁/备份拒绝与测试覆盖 | 未验 |

## 4. 卡点

### 卡点 1：本机没有页面要求的 Blender 4.3.2

- 页面哪一句：“Blender 4.3.2 实跑两次重建，三份 GLB 与既有产物逐字节相同。”
- 缺什么：本机 `command -v blender` 为空；标准安装目录也没有 `blender.exe`。只有预装 `bpy` Python 模块，版本 `5.2.3 LTS`（glTF I/O `v5.2.41`）。页面和 README 都按 4.3.2 写，未说明无 CLI 时可用 bpy 模块。
- 做错/绕行：先用系统 Python 直接跑 `build.py` 会缺 `bpy`；随后在环境工具目录找到 `bpyenv`，用它跑 `python tools/build.py`。第一次对比时把“5.2.3 重建”与“已提交 4.3.2 GLB”直接按 SHA 比较，得到全不相等，容易被误读为脚本改坏；进一步拆 JSON/二进制 chunk 后才确认：二进制块完全相同，只差 `asset.generator`。
- 影响：页面“逐字节相同”这一条在本机无法确认；能确认的是同版本内可复现、跨版本仅版本字符串不同。其余行为判据不受影响。

### 卡点 2：页面/README 的命令没有可执行入口

- 页面哪一句：`asset-family-rebuild` 节给出的复跑入口是链接到 README 的“Rebuild without leaving a mixed asset family”，README 的命令以 `blender --background ...` 开头。
- 缺什么：本机没有 `blender` 可执行文件，照抄命令直接 `command not found`。页面没有写无 CLI 时如何调用 `bpy` 模块，也没有写 `--output` 参数必须放在 `--` 之后。
- 做错/绕行：改为 `python tools/build.py`（默认输出 `models`）和 `python tools/build.py -- --output fresh`；`-- --help` 可看参数。未创建假的 `blender` shim，避免把 5.2.3 冒充 4.3.2。
- 影响：新读者如果没有 Blender CLI，会在第一步停住；这是文档缺口，不是脚本缺陷。

### 卡点 3：页面说“已采用”，源码说“未采用”

- 页面哪一句：“FPS 已采用的墙、掩体、灯共用一份 Blender 配方”“本次修的是已采用资源的制作可靠性”。
- 缺什么/不一致：同一提交的 `contract.json` 写 `status: engineering-draft-not-adopted`；`models/manifest.json` 三件都写 `"adopted": false`；README 写 “first integration candidate”“Default/v13 clients do not consume these assets”“no visual acceptance yet”。
- 做错/绕行：没有把页面“已采用”当作事实；按源码记录为“候选/旁置入口、未采用”。也没有运行游戏去证明画面变化。
- 影响：页面这处措辞会让人高估完成度；与任务卡“不把 CPU 成功写成游戏画面采用”的边界冲突。建议页面改成“候选批次/旁置入口”，或补一句采用状态。

### 卡点 4：页面只写“第二件失败”，任务卡要求“末件失败”

- 页面哪一句：“原脚本逐件覆盖，换色后在第二件注入失败，会留下新墙配旧掩体”“第二件失败和缺少风格输入时，旧整批摘要均不变”。
- 缺什么：页面与自带集成测试的故障缝都在第二件（`low-cover-site`）；任务卡要求末件（灯）失败。页面没有说明末件失败是否也保旧批。
- 做错/绕行：沿用测试里的正则故障缝，把条件从 `low-cover-site` 换成 `lamp-existing`，并在 `stats=mesh_stats(objs)` 之后、导出之前抛错，确保墙和掩体已经真实写入 staging。另外补测第一件、第二件和 `fresh` 空输出。
- 影响：末件失败同样保旧批；页面可把“第二件”改成“任一件/末件”或补一句“末件失败也保旧批”。

### 卡点 5：GLB 确定，但整批不是逐字节确定

- 页面哪一句：“三份 GLB 与既有产物逐字节相同”“复验先看保留了什么，再看生成了多少。”
- 缺什么：页面只承诺 GLB；没有说明 `.blend` 和 `manifest.json` 是否稳定。本机 5.2.3 下两次未改重建的 GLB 相同，但 `.blend` 从 133255 bytes 变为 133266 bytes；两次改色重建从 133065 变为 133117；`manifest.json` 的差异只在 `blend.bytes` 和 `blend.sha256`。另外 `build.py` 用 `Path.write_text` 写 manifest，Windows 下产出 CRLF（192 个 CR），已提交 manifest 是 LF（0 个 CR、187 个 LF）。
- 做错/绕行：第一次做故障对比时，拿故障后的 `models` 去和更早的 `batch-edit` 快照比，因 `.blend`/manifest 的非确定性得到“unchanged False”，一度误以为故障改了旧批；改为在每次故障前先做一份“紧邻的成功批”快照，再逐字节比较，才得到正确的“全部不变”。这个问题本身也说明：不能拿整目录摘要判断故障，除非先固定 `.blend` 的非确定性。另外，第一次改 `style.json` 时用 `Path.write_text` 写回，Windows 下把整个文件的换行改成了 CRLF，`diff` 显示全文件变化；随后从字节副本恢复，改用 `write_bytes` 只替换目标子串，保持 LF 和其余字节不变。
- 影响：任务卡的“第二次重跑一致性”应限定为“三份 GLB 一致”；若要求整批一致，需要先处理 `.blend` 保存差异和 manifest 的平台换行。页面只写 GLB，口径是对的，但读者容易把“批”理解成整目录。

### 卡点 6：已提交 manifest 的 inputs 与当前脚本不一致

- 页面哪一句：“可编辑源与清单”“先在同级临时目录完成三份 GLB、可编辑源与清单”。
- 缺什么：已提交 `models/manifest.json` 的 `inputs` 记录 `tools/build.py` 哈希 `3219449f...`，而同一提交实际的 `tools/build.py` 是 `6eb9180b...`；该 manifest 也没有列 `tools/asset_batch.py`。重建一次后，manifest 才更新为当前 `build.py` 哈希并补上 `asset_batch.py`。
- 做错/绕行：先把 manifest 当“当前配方清单”去校验，发现 `inputs` 对不上；读 README 后确认它写的是“original authoring inputs”，即上一版作者输入，不是当前脚本。记录为“元数据口径”，没有改脚本。
- 影响：新读者若在重建前用 manifest 校验“清单是否描述当前配方”，会误判为脚本被改；建议页面/README 明确“已提交 manifest 记录的是产出时的作者输入，重建后会刷新”。

## 5. 页面之外还去翻了什么

- FPS-Like 固定提交的 `assets/environment/standards-v1/README.md`（页面直接链接的复跑入口）。
- 同目录的 `tools/build.py`、`tools/asset_batch.py`、`tools/test_asset_batch.py`、`tools/test_build_integration.py`、`style.json`、`contract.json`、`models/manifest.json`。
- 该提交的 commit message 与 diff（确认它改的是发布流程，不是 GLB，以及“12 项回归”的口径）。
- 本机 `bpy.app.version_string`、`bpy.app.binary_path`、`bpy.app.background`，用来确认只有模块、没有 CLI。
- FPS-Like 本地只读 clone 的 `git log`/`git show`，只用于取固定提交与文件，没有改 clone。
- 任务卡与页面之外，没有读 a1dbv 的其他文档，没有搜同主题教程，没有开浏览器。

关于 `gen3d`/`glbprep`：本次没有调用。这个任务是页面指定的“既有 Blender 配方重建”，不是用模型网关生成或预处理新资产；任务卡明确允许使用已安装 Blender。只看了两条命令的 `--help` 作为环境核对，没有访问模型网关、没有读取或输出其地址与凭据。

## 6. 未验项与下一步

- 未验：Blender 4.3.2 下“与已提交 GLB 逐字节相同”。需要一台有 4.3.2 的机器，或在允许安装的环境里补跑；本记录不把 5.2.3 的结果写成 4.3.2 通过。
- 未验：真实 SIGKILL/断电下的跨目录原子性；只跑了 12 项文件系统测试里的锁/备份拒绝路径。
- 未验：真实 OS 级 rename 失败/回滚失败；`test_asset_batch` 用 mock 覆盖。
- 未验：游戏运行画面、帧时间、GPU、视觉采用；没有游戏、浏览器或渲染。
- 下一步建议：页面补“无 Blender CLI 时用 bpy 模块”的入口与版本差异说明；把“已采用”改成与 contract/manifest 一致的“候选/旁置”；把“第二件失败”扩成“任一件/末件失败”；明确 `.blend` 与 manifest 的非确定性，避免读者拿整批摘要做故障判据；修 manifest 的平台换行或在文档里说明。

## 核对

非作者复核，2026-11-05。结论：读者记录里的二改、末件失败保旧批、首次失败不发布、同版本重跑一致都能在独立副本里复现；Blender 4.3.2 下的“与既有产物逐字节相同”仍无法确认，不能算通过。读者对页面与源码的实质判断成立；下面只记复核结果、卡点归因和读者没写到的点。

### 复核方法

从固定提交取出 `assets/environment/standards-v1` 到独立临时副本，用接收端预装的 bpy 5.2.3（glTF I/O v5.2.41）跑 `tools/build.py`，再用证据目录的 `style.json` 重跑，并按集成测试的正则故障缝分别注入第一件、第二件、末件失败。未改页面、FPS 原仓或任务文件，未提交、推送或切换分支。

### 复核结果

- 基线重建两次：三份 GLB 两次逐字节相同；与已提交 GLB 比，大小 76776／36492／10336 相同，BIN chunk 逐字节相同，JSON 只差 `asset.generator`（v4.3.47→v5.2.41）。与读者的版本受限结论一致。
- 改色重建：证据 `style.json` 只把 `palette.plaster` 从 `#d8d5c5` 换成 `trim` 的 `#c2c6bd`，LF 与其余字节未变；重建得到墙 `4351a54b…`、掩体 `9fda245f…`、灯 `6191e41a…`，与证据 GLB 完全一致。三角面 1596／680／120、包围盒、材质、粗糙度与节点结构未变；灯 GLB 与基线逐字节相同。COLOR_0 复算：墙 plaster 424→0、trim 596→842，掩体 120→0、308→404，灯 112／112 不变，与读者记录逐项一致。
- 故障注入：第一件、第二件、末件失败均 exit 1，`models` 整目录逐字节不变，无 `.models.build-*` 残留。末件探针确认墙、掩体 GLB 已写入 staging 后灯才抛错，即读者的“末件失败也保旧批”成立。
- 首次失败：尚不存在的 `fresh` 输出注入第一件失败后目录未创建，无 `.fresh.build-*`。删 `style.json`：exit 1，旧批不变。成功批保留 `keep.txt`。
- 元数据：已提交 manifest 的 `inputs` 仍是 `build.py 3219449f…`（实际 6eb9180b…）且未列 `asset_batch.py`；重建后补上。重建 manifest 在 Windows 下 CRLF（192 个 CR），已提交 LF（0 CR／187 LF）；两次改色重建的 manifest 只在 `blend.bytes`／`blend.sha256` 不同，`.blend` 两次保存字节不同（本机 133340→133246）。
- 测试：`test_asset_batch.py` 12/12 通过；`test_build_integration.py` 在 `assertIsNotNone(blender)` 处失败，未跑真实 Blender 集成测试。
- 源码状态：`contract.json` 为 `engineering-draft-not-adopted`，manifest 三件 `adopted:false`，README 写 first integration candidate／default/v13 clients do not consume／no visual acceptance yet。
- 流程口径：任务卡写的 `docs/collaboration/local-jobs/artifacts/<id>/result.md` 未产出；读者按外层要求写在本记录与证据目录，已自述，不影响技术结论。

### 卡点归因

| 卡点 | cause | 说明 |
|---|---|---|
| 1 Blender 4.3.2 不可用、只做到结构相同 | page | 页面只写“4.3.2 逐字节相同”，没写该结论依赖 glTF I/O 版本，也没写无 CLI 时可用 bpy 模块。环境缺 CLI 是事实，但页面补一句“同版本内一致、跨版本仅 `asset.generator` 不同”就能避免读者把 SHA 全不相等误读成脚本坏了。 |
| 2 README 的 `blender …` 入口不可执行 | page | 页面链接的 README 假定 `blender` 在 PATH，只给了 `-- --help` 示例；无 CLI 的 bpy 模块入口和 `--output` 必须在 `--` 之后都没写。读者绕行正确。另：读者引用的命令把仓库根相对路径写成了 `tools/build.py`，不影响结论但引用不精确。 |
| 3 页面“已采用”与源码“未采用”冲突 | page | 页面与 `contract.json`／manifest／README 冲突；读者判断正确。页面自身在“减面、UV、LOD与碰撞”节和“何时不照搬”段也写的是候选／旁置，这一层读者没引用。 |
| 4 页面只写第二件失败，任务要末件 | page | 末件失败同样保旧批（已复核）。页面应把“第二件”改成“任一件／末件”，或直接写“任一件导出失败都不发布混批”。 |
| 5 GLB 确定但整批不逐字节确定 | page | 页面“三份 GLB”口径本身正确，但“整批摘要”措辞容易让读者把 `.blend`／manifest 也算进去；`.blend` 每次保存不同、manifest 在 Windows 为 CRLF 都没写。读者最初拿更早快照比出 `unchanged False` 是自己的方法错误，已自行纠正。 |
| 6 已提交 manifest 的 inputs 与当前脚本不一致 | page | 这是作者时元数据；README 已解释 original authoring inputs，页面没提。读者先校验后读 README 才弄清，建议页面补一句“已提交清单记录产出时输入，重建会刷新”。 |
| 7 未做真实 SIGKILL／断电 | model | 页面已明确“不承诺跨目录原子性”，不是页面缺陷；读者只跑了锁／备份拒绝与 mock 的 rename／rollback，属测试深度不足。真实 kill 在临时副本可做，但并非页面承诺的必验项。 |

### 读者没意识到的错误

1. **页面自相矛盾未指出，仓库里更直接的证据也没引用。** 同一页“减面、UV、LOD与碰撞”节写“已证实的是源与消费者的 CPU 接线，不是画面采用……未作为网站美术采用”，“何时不照搬”段写“旁置入口……默认入口不启用这些开关”，与 `asset-family-rebuild` 节的“已采用”直接冲突。仓库另有 `docs/art-standards-validation.md` 写“Opt-in candidate”“prepared but not run in a browser”“no model has been accepted”，`docs/quality/environment-candidate.md` 写“not visually accepted”；读者只对照 README／contract／manifest，没引用页面自身这两处和这两份文档，补上后“页面高估完成度”的结论更硬。
2. **“缺少风格输入”并不检验批次隔离。** `build.py` 在模块顶层读 `style.json`，早于 `output_batch` 进入；缺文件时锁和 staging 都没建立，所以“旧整批不变”是平凡成立。读者把它与“第二件失败”并列记为“成立”，没有指出它没走发布／回滚路径，不能当作保旧批的证据。
3. **复跑命令不自足。** 记录 §2 的 `python tools/build.py` 在系统 Python 下会 `ModuleNotFoundError: No module named 'bpy'`；实际要用接收端预装的 bpyenv 解释器，但记录只在卡点 1 提过“找到 bpyenv”，命令块没写清用哪个解释器，第三人照抄仍会卡住。
