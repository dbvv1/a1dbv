# B-FPS-ARTIFACT-PROVENANCE-20261105 · 核标准件产物来源一致性
id: B-FPS-ARTIFACT-PROVENANCE-20261105
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8
result_branch: relay/b-fps-artifact-provenance-20261105

类别：游戏细则 §7 的模块编码单元，接口与检查已定；沿既有本机接收器排队。

## 目标
读者实测暴露旧 models/manifest.json 的输入清单落后于现行作者脚本。提供可直接运行的只读校验，区分“当前输出字节完整”和“清单记录的输入与当前字节一致”，避免拿旧清单证明当前二改可复现。
这是 [模型批次读者卡](B-PIPE-MODEL-BATCH-READER-20261104.md) 的独立工程后续，不重跑首次盲读，不改读者记录。当前 build.py 的 SOURCE_FILES 已含 asset_batch.py，本卡不再次补已存在的列表。

## 按哪个 Skill／规格
按 a1dbv domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md §3–4，固定源 assets/environment/standards-v1/{contract.json,style.json,models/manifest.json,tools/build.py,tools/asset_batch.py}；以实际文件字节为准。
1. 新增 tools/verify_manifest.py，仅Python标准库；CLI --root <standards-v1> --manifest <root内manifest> --json。无参数时用作者目录及 models/manifest.json。stdout 为单个UTF-8/LF JSON；通过 exit0，来源过时/内容不符 exit1，非法CLI/不可读或结构错误 exit2；stderr 简短说明，不输出绝对路径。
2. 把检查分为 artifactIntegrity 与 sourceCurrency，各给 passed/findings；overall 只有两项都过才真。不把“旧来源不等于当前”解释成旧资产必然损坏，不声称校验能证明历史工具确实执行。
3. 输入集合固定为 tools/build.py、tools/asset_batch.py、contract.json、style.json；每个必须有唯一完整SHA-256，按本root原字节复算。漏项、多余项、重复项、hash不符精确报告；原模型清单应真实呈现当前缺helper及旧build哈希，不重写历史值。
4. 三GLB ID取 contract.json 的 pieces[].id，路径固定映射 models/<id>.glb，再核 manifest.assets[].file 与该映射一致及文件存在、字节数和完整SHA-256；同时核 manifest.blend 的文件字节数/hash，不解析、执行、重存或上传 .blend。若原清单有历史版字段，明确支持的schema与字段，不能静默忽略。只读扫描实际所指文件，不把三角面/蒙皮/画面或许可当已验证。
5. 所有被读取的manifest文件路径必须为root内相对路径，不允许绝对路径、..、符号链接逃逸或远程URL；先验证再读，不读root外文件。报告只含root相对路径、字段名、预期/实测hash及原因，不含本机身份。
6. 临时合成夹具覆盖完整通过、漏helper、源hash变化、输出字节变化/缺文件、重复ID/path、非法hash/JSON/越界路径与只读不改输入。包含实际历史manifest的只读回归，明确期望 stale，而不是改旧清单来让测试变绿。
7. 仅CPU/文件处理，不需要Blender、Cairo或渲染器，不重建资产、不安装本机依赖、不开GUI/浏览器/GPU/音频。先核同题现有卡/分支/实际写者，有原调用只检查不重派；未知仅隔离该动作。

## 写入范围
仅新增 assets/environment/standards-v1/tools/verify_manifest.py、test_verify_manifest.py，并在该作者目录 README.md 增加用法/状态含义。不改 build.py、asset_batch.py、contract/style、models、运行assets、游戏src、锁文件、原读者报告或 .blend。

## 怎样算做成
真实旧包检查如实非零且分清输出完整/来源过时；合成当前包通过并覆盖直接失败路径。新测试、原 test_asset_batch 通过，公开文件/提交身份与diff检查通过；无需为了该只读工具运行Blender或GPU。
保留原内容/模型字节哈希；不将陈旧manifest修成当前、不宣称重新构建或素材已采用。按原Workflow独立审查后，只推结果分支回 review_ready；不合main、不部署。

## 当前结果

- 新增只读标准库工具 verify_manifest.py 与 27 项 CPU 测试，README 增加用法与状态含义。实测 test_verify_manifest 27 项、原 test_asset_batch 12 项全通过；真实历史 manifest 返回 exit 1，artifactIntegrity 通过而 sourceCurrency 如实报缺 tools/asset_batch.py 与 tools/build.py hash 过时，区分了输出字节完整与输入清单过时；未改模型/manifest/.blend，未运行 Blender 集成测试与无关 npm test。openIssues 为空。
- 产物：[2a789cc](https://github.com/dbvv1/FPS-Like/commit/2a789cca282b7a1713249650a4259e47ffa6bf4e)，分支 `relay/b-fps-artifact-provenance-20261105`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：负责人接收并合入结果分支；无本单元遗留缺口，无需重跑模型。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
