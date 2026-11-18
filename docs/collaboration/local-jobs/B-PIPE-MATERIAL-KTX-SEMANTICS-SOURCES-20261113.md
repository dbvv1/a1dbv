# B-PIPE-MATERIAL-KTX-SEMANTICS-SOURCES-20261113 · 同族材质贴图归一来源
id: B-PIPE-MATERIAL-KTX-SEMANTICS-SOURCES-20261113
owner: dot-B
kind: explore
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6dedee31abc6bf77694dd02a23f3f9833084f2f5
result_branch: relay/b-pipe-material-ktx-semantics-sources-20261113

## 目标与规格
制作链；按 game-content-production §3 和既有 materials 资产页。为现有 MOBA 材质族找一套可直接归一的合法地面／墙面贴图来源，不改场景、不做贴图渲染。旧材料复用读者卡、角色 CC0 预检和现有 quiet 场景不复做。
- 固定消费者 dbvv1/MOBA-Like@79bdb57439d2ca3e49c6560271d4a598999f5ac5 的 src/render/quiet-family.ts，先核实际引用和缺口，不用颜色二改替代来源。
- 核对 KhronosGroup/glTF@f93f8afd4dff9252a4191e3e0538d4efe0e181b4 的 extensions/2.0/Khronos/KHR_texture_basisu/README.md，以及 KhronosGroup/KTX-Software@f024f29e83e486460f8eed82bf57458ba92c4528 的 tools/ktx/command_create.cpp。
- 从 Poly Haven 和 ambientCG 官方资产页择 2–3 个同风格候选，不取文件；目标为低反光旧石、土与草的过渡，不引入商业游戏资产。逐条核原始许可、预览和可用通道。

## 范围与完成
只写 docs/collaboration/local-jobs/artifacts/B-PIPE-MATERIAL-KTX-SEMANTICS-SOURCES-20261113/result.md。每条给资产页、许可原文、静态预览 URL、通道／尺寸，注明缺通道与不匹配理由；给拟归一色彩空间、法线方向与格式，不把建议命令写成已跑。不下载、不登录、不改产品、不拍图，许可证或来源不清即淘汰，留下原因。

## 当前结果

- 已完成来源调研并写入 result.md：主选 Poly Haven Stone Wall 05 / Brown Mud Dry / Grass Ground（均 CC0，含 Diffuse、nor_gl、nor_dx、arm、Rough、AO、Displacement，1K–8K/16K），ambientCG Ground 037 为唯一跨来源对照；已核 quiet-family.ts 仅加载三张 albedo WebP、统一 SRGBColorSpace、无 normal/roughness/ARM 槽与 KTX2Loader；归一建议为 albedo sRGB/BT709、数据槽线性/UNSPECIFIED、nor_gl（OpenGL +Y）、KTX2 颜色 ETC1S/数据 UASTC，全部标注未运行。openIssues：Ground 037 是否含 NormalGL 未知（API zipContent 为空），采用前须核 ZIP；KTX-Software 构建、ktx create、贴图下载、渲染与浏览器验收均未运行。
- 产物：[88b7eb2](https://github.com/dbvv1/a1dbv/commit/88b7eb2d8bc443270844a32261c4f49a71be198e)，分支 `relay/b-pipe-material-ktx-semantics-sources-20261113`。
- 检查：check_public（文件与新提交身份）、check_repo 本单元无新增错误；基线 6dedee31 已有问题：docs\collaboration\nonstar-return-intake-20261106.md:24: missing link target: local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/quiet-reader-production-proof.test.ts（保留告警，交负责人接收）；独立审查通过。
- 下一步：负责人接收并提交 result.md；若评审要求必须跨库替换 Grass Ground，先核 ambientCG Ground 037 ZIP 的 NormalGL/NormalDX，否则维持 Poly Haven 三件套。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
