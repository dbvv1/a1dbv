# B-PIPE-MATERIAL-KTX-SEMANTICS-SOURCES-20261113 · 同族材质贴图归一来源
id: B-PIPE-MATERIAL-KTX-SEMANTICS-SOURCES-20261113
owner: dot-B
kind: explore
status: accepted
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

- **接收范围：来源／通道调研，不是现行森林默认的整套可替换材质。** 保留[原始调研](https://github.com/dbvv1/a1dbv/blob/88b7eb2d8bc443270844a32261c4f49a71be198e/docs/collaboration/local-jobs/artifacts/B-PIPE-MATERIAL-KTX-SEMANTICS-SOURCES-20261113/result.md)。按现行已发布源 fa3076f 重核，Stone Wall 05 可进入兵营／基地既有石面 albedo 对照；新塔附饰不消费该图。Brown Mud Dry、Grass Ground 留来源储备：森林主路用生成石板，旧土／草图只作很弱的色调扰动。
- 接收后的试用条件及限制写入[材质页](../../../domains/game-dev/assets/materials.md#quiet-material-family)。未下载或替换贴图、未渲染或转码；独立法线、粗糙度、ARM、KTX2 不进本单元。
