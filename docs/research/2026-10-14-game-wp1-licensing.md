主线：二／四；G1 资产选型与交付约束
改变的建议：游戏03在质量与价格比较前分开核对代码、权重、输出及渠道门槛，后续WP只推荐已登记的具体版本
新证据：2026-10-14重新读取官方许可、模型卡及服务/平台条款；没有运行生成模型或引擎

# WP1：授权与商用门槛

核实时间：2026-10-14（UTC+8）。仅调查；不接受协议、不代表读者签约，不替代具体发行地区的法律审查。正文总表见[03](../../domains/game-dev/03-generative-ai-in-games.md)。正文与证据已整合；内部独立复核完成，待任务书指定评审。

## 口径与更新条件

代码许可不能自动授予模型权重或训练素材的权利；商用许可不保证输出有可主张的著作权、不侵权或能通过商店审核。地域分别记录服务可用地区与模型/Output用途限制；营收还须辨明是个人、企业、关联实体或具体游戏。**[研究：阅读与选型口径]**

总表按精确版本与服务计划核对。新版本、许可更新、换提供商、跨营收门槛、换发行市场或把离线资产改成运行时生成时，先更新本记录再进入对应WP推荐；未查清条目只作调查候选。质量／性价比档次由各资产WP决定，本表不作效果排名。**[经验：采用门槛]**

## 现成资源和编排工具

- Kenney Generic Items：官方包 License.txt 的 CC0 声明允许商用、修改和分发，不强制署名；保留[官方来源](https://kenney.nl/assets/generic-items)及[CC0原文](https://creativecommons.org/publicdomain/zero/1.0/legalcode)。本轮资料包有官方ZIP与许可核对，CC0不一并清除商标、肖像等第三方权利。**[一手；研究：范围]**
- Game-icons：固定[82d9488许可](https://github.com/game-icons/icons/blob/82d948812bfe3f269ef8f731dcdb07b08160edc4/license.txt)按作者区分，所查Lorc/Delapouite资产为CC BY 3.0；须保留相应作者、来源、许可及改造说明，不能把全库视为CC0。图标声明不自动扩展成辅助shell脚本的软件许可。**[一手；经验：复制边界]**
- Material Maker固定[174f15e/LICENSE.md](https://github.com/RodZill4/material-maker/blob/174f15edece663bf10f78588840873fa2fd17bc7/LICENSE.md)、Effekseer固定[82b3708/LICENSE](https://github.com/effekseer/Effekseer/blob/82b37081a302b9f9eff0bf14dc6c845fca8c3c54/LICENSE)均为MIT主许可，分发软件须保留通知；外部节点、贴图、例子和第三方库不能只靠主许可放行。两者无生成模型权重层；输出仍依输入素材权利核对。**[一手：固定许可；研究：边界]**
- ComfyUI固定[8010b48/LICENSE](https://github.com/Comfy-Org/ComfyUI/blob/8010b48d2c1be986613f8e8c761527d205bd756f/LICENSE)为GPL-3.0，商业使用本身不被禁止，分发/修改有相应义务；工作流、节点与checkpoint分别查，安装编排器没有统一取得所有权重及输出许可。**[一手；经验：采用门槛]**

## 图像与视频：精确版本、服务入口和输出分开

本节均核查于2026-10-14（UTC+8）。**[一手]** 表示已读取官方文本；**[研究]** 判断仅为商用候选准入，不是版权独占、无侵权、质量或法律保证。“无门槛”仅指已读许可没有特设营收／地域限制，不豁免适用法律；本地模型结论不覆盖同品牌云服务、额外LoRA、编码器或第三方节点。

| 精确方案 | 代码层：修改／分发 | 权重层：商业运行 | 输出层：商业使用／修改／发行 | 地域、营收、订阅与采用判断 |
|---|---|---|---|---|
| OpenAI API `gpt-image-2-2026-04-21` | 封闭服务，不授模型代码再分发权 | 未开放自托管权重；API使用权 | 服务协议§4.1在双方之间、法律允许范围内将输出归客户；输入权利由客户负责，输出可能不唯一 | 无所见营收门槛；服务只能在支持地区访问／提供，不能等同离线资产发行禁区；不以ChatGPT订阅作API输出归属条件。**可作商用候选，须地域核查**。[一手／研究：O1–O3] |
| ChatGPT图像功能（消费端，不冒称固定API snapshot） | 封闭服务 | 无开放权重授权 | 消费条款Content部分将输出归用户；不得侵权、不得把AI输出冒称人为生成 | 未见免费／付费输出归属差别；生成时记录套餐、实际功能和居住地区适用条款。**可作商用候选**。[一手／研究：O4] |
| Sora／Sora 2历史服务 | 封闭服务 | 无已核开放权重许可 | 旧资产应核生成时账户与条款；停服不自动等于旧输出权利失效 | Web/App于2026-04-26停止，API停止日期2026-09-24已过。**不作新生产默认**。[一手／研究：O5] |
| Qwen-Image-2512 | 固定Qwen-Image代码Apache-2.0，允许商用修改分发，保留许可／通知／改动标记 | 官方checkpoint卡Apache-2.0 | 未见单独输出转让或独占保证，也未见输出非商用条款；不能写成“输出也按Apache开源” | 无许可内地域／营收门槛，本地无订阅条件。**可作商用候选**。[一手／研究：Q0、Q1] |
| Qwen-Image-Edit-2511 | 同一固定代码Apache-2.0 | 此版本官方卡License Agreement明确Apache-2.0 | 同上；图片编辑尤其须持有参考图、人物与角色相关权利 | 同上；额外下载的社区LoRA另核。**可作商用候选**。[一手／研究：Q0、Q2] |
| Qwen-Image-Layered | 独立Layered固定代码Apache-2.0 | 此版本官方卡明确Apache-2.0 | 分层不会清除原图权利；无单独输出专属权利承诺 | 无许可内地域／营收门槛，本地无订阅条件。**可作商用候选**。[一手／研究：Q3、Q4] |
| FLUX.2-klein-4B | 固定flux2推理代码Apache-2.0 | 此checkpoint的LICENSE为Apache-2.0，可商业修改分发 | 未见单独输出归属条款；没有图片非商用门槛，仍须清除输入及第三方权利 | 无许可内地域／营收门槛，无须另买商业自托管许可。**可作商用候选**。[一手／研究：B0、B1] |
| FLUX.2-klein-base-4B | 同上 | Base具体checkpoint的LICENSE为Apache-2.0 | 同上；训练素材、外部适配器另核 | 同上；不能外推到9B Base。**可作商用候选**。[一手／研究：B0、B2] |
| FLUX.2-klein-9B | 独立发布的推理代码Apache-2.0不被权重许可撤回 | FLUX Non-Commercial License v2.1，仅非商用／非生产修改及附条件分发；商业需另许可 | §2(d)不主张输出所有权并允许商业用途，但受协议限制；禁用输出训练竞争模型，须过滤或审阅及依法标识 | worldwide非商业授权，不存在小团队低营收自动商业免费豁免。**须条件核查，免费自托管不作默认**。[一手／研究：B0、B3、B5] |
| FLUX.2-dev | 独立推理代码Apache-2.0 | 本次HF许可证正文为v2.1，免费仅非商用／非生产 | 输出商业用途条款不能倒推模型商业生产获准，§4另有广泛用途限制 | 付费自托管须核模型、席位、用量、域名／客户及生成时有效许可；终止需停用删除模型和衍生物，旧输出存续按所签合同核查。**须条件核查**。[一手／研究：B0、B4–B6] |
| Adobe Firefly Image Model 5（Adobe自有模型） | 封闭服务，不授模型代码修改分发权 | 无开放权重许可 | 输出属于用户Content；FAQ允许商业项目，beta除产品另禁；不能删输出水印／Content Credentials，禁用于AI/ML训练改进 | FAQ明确China、Russia、Belarus不可用，另有制裁地区；无所见营收门槛。普通输出商用不等于指定套餐的IP赔偿保障。**须地域及生成时功能条件核查**。[一手／研究：A1–A4] |
| Wan2.2-TI2V-5B | 固定Wan2.2代码Apache-2.0，可商用修改分发 | 此模型卡Apache-2.0 | 官方不主张生成内容权利；合规输出可商业生产、修改、发行，无非侵权保证 | 无许可内地域／营收门槛，本地无订阅条件。**可作商用候选**。[一手／研究：W0、W1] |
| Wan2.2-T2V-A14B | 同一固定代码Apache-2.0 | 此模型卡Apache-2.0 | 此卡另核有生成内容不主张权利声明 | 同上。**可作商用候选**。[一手／研究：W0、W2] |
| Wan2.2-I2V-A14B | 同一固定代码Apache-2.0 | 此模型卡Apache-2.0 | 同上；图生视频不豁免参考图授权 | 同上。**可作商用候选**。[一手／研究：W0、W3] |
| LTX-2.5（2026-08-11后、LICENSE-2_x覆盖版本） | Community License定义包含代码，附条件修改／再分发，不是MIT | 同一社区许可；合并共同控制关联实体后，年营收**至少US$10M**的生产使用须付费协议 | §5不主张输出权利，但仍受协议约束；须保留已嵌入溯源／标识功能 | worldwide但受制裁出口限制；低于门槛可按社区协议商业生产，转给达门槛实体的衍生权重／LoRA须对方取得所需许可。**须条件核查**。[一手／研究：L1、L2] |
| Runway Gen-4.5（自有服务，离线生成导出） | 封闭服务，不授模型代码再分发改造权 | 普通订阅不等于自托管权重许可 | Terms§4.4不主张输入／输出所有权、不限制合规商业使用；成片分享无需署名，修改和游戏发行仍须第三方清权 | Gen-4.5当前需Standard及以上，是访问门槛；无所见输出权利付费切分或营收门槛，受制裁出口控制，完整可用地区名单未核实。**可作商用候选**。[一手／研究：R1–R3] |

**两项影响游戏管线的边界 [一手／研究]**：Adobe赔偿保障只适用于指定套餐／功能／导出条件，修改、与其他素材组合等有排除，不应宣传为游戏成品无风险；Firefly里的Non-Adobe模型另按第三方条款。[A2] Runway一般条款允许输入／输出用于训练，不宜默认上传未发布保密资产；若把API功能开放给玩家，另有“Powered by Runway”、链接和终端协议义务，不能用离线成片无需署名的帮助页覆盖它。[R1、R2]

### 视觉／视频来源定位

- **O1**：[GPT Image 2官方模型页](https://developers.openai.com/api/docs/models/gpt-image-2)，Snapshots列`gpt-image-2-2026-04-21`，不将模型宣传当游戏质量证据。
- **O2–O3**：[OpenAI Services Agreement](https://openai.com/policies/services-agreement/)（2026-01-01生效），§4输出、§9服务IP、§11.3终止前已产生权利、§16.11–12地域；[API支持地区](https://help.openai.com/en/articles/5347006-openai-api-supported-countries-and-territories)。
- **O4**：[非欧洲消费条款](https://openai.com/policies/row-terms-of-use/)（2026-01-01）；[欧洲条款](https://openai.com/policies/terms-of-use/)本次显示2026-01-16更新，按居住地适用。两份均含输出归属、非唯一性及不得冒称人工作品。
- **O5**：[Sora停止说明](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)。API停止句仍用将来时，但相对本次日期已过去，不能据此认定仍在售。
- **Q0、Q4**：[Qwen-Image固定LICENSE](https://github.com/QwenLM/Qwen-Image/blob/6b5e1f5cec987d404be5ac6657db3b9aacb56a89/LICENSE)、[Layered固定LICENSE](https://github.com/QwenLM/Qwen-Image-Layered/blob/54c4fe47e76d745775e03fc66ee38457280ed9ea/LICENSE)：Apache-2.0，核对§2、§4、§7。
- **Q1**：[Image-2512官方卡](https://huggingface.co/Qwen/Qwen-Image-2512)，公开API核得revision `25468b98e3276ca6700de15c6628e51b7de54a26`。
- **Q2**：[Edit-2511官方卡](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)，revision `6f3ccc0b56e431dc6a0c2b2039706d7d26f22cb9`。
- **Q3**：[Layered官方卡](https://huggingface.co/Qwen/Qwen-Image-Layered)，revision `8f0ca708dfff6ba1dd5f2d85d78f8c108a040bcf`。三者权重结论来自官方模型卡；公开文件列表未列独立LICENSE，不假称读取了随权重附带许可。
- **B0**：[flux2固定LICENSE](https://github.com/black-forest-labs/flux2/blob/50fe5162777813d869182b139e83b10743caef15/LICENSE.md)及[固定README](https://github.com/black-forest-labs/flux2/blob/50fe5162777813d869182b139e83b10743caef15/README.md)，分别记录代码及型号授权。
- **B1–B2**：[klein-4B许可证](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/main/LICENSE.md)（revision `e7b7dc27f91deacad38e78976d1f2b499d76a294`）；[base-4B固定许可证](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-4B/blob/a3b4f4849157f664bdbc776fd7453c2783562f4d/LICENSE.md)。
- **B3**：[klein-9B许可证](https://huggingface.co/black-forest-labs/FLUX.2-klein-9B/blob/main/LICENSE.md)，v2.1；revision `92196c8e11f7b6cf2b7493e037d8c5345c559216`。§1(c)、§2、§3、§4分开核查。
- **B4**：[FLUX.2-dev许可证](https://huggingface.co/black-forest-labs/FLUX.2-dev/blob/main/LICENSE.md)，本次正文v2.1；revision `26afe3a78bb242c0a8bb181dcc8937bb16e5c66c`。[网站法律总页](https://bfl.ai/legal/non-commercial-license-terms)仍显示2025-11-25 v2.0，不代替checkpoint所附版本；未接受gated仓库访问条件。
- **B5–B6**：[商业许可说明](https://help.bfl.ai/articles/9272590838-self-serve-dev-license-overview-pricing)（2026-06-12）；[自托管商业条款](https://bfl.ai/legal/self-hosted-commercial-license-terms)（2026-08-04），EU另有适用条款；核§5持续付费／移除、§6用量报告、§7终止删除。
- **A1、A4**：[Firefly FAQ](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html)核商业用途与地区；[官方当前计划页面](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/current-firefly-promotions.html)列Image Model 5，仅用于型号存在性，未登录核账户实际beta标识。
- **A2–A3**：[2026-04-23生成AI特别条款PDF](https://www.adobe.com/cc-shared/assets/pdf/legal/servicetou/adobe-generative-ai-product-specific-terms-en-us-20260423.pdf)核§1、§3、§7、§8；[General Terms](https://www.adobe.com/legal/terms.html)核§4.2及§12。未见普通输出权利要求持续订阅，不承诺退订后赔偿保障继续。
- **W0**：[Wan2.2固定LICENSE.txt](https://github.com/Wan-Video/Wan2.2/blob/1ea34ff48f87168174e12956e200b1d908b1c5ff/LICENSE.txt)，Apache-2.0，注意实际文件名含`.txt`。
- **W1**：[TI2V-5B官方卡](https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B)，revision `921dbaf3f1674a56f47e83fb80a34bac8a8f203e`；License Agreement分别说明模型及输出。
- **W2**：[T2V-A14B官方卡](https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B)，revision `c8c270b13ee05bfa474194ac9fb07a5868a97cea`；同样逐项核查。
- **W3**：[I2V-A14B官方卡](https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B)，revision `206a9ee1b7bfaaf8f7e4d81335650533490646a3`；同上，不外推到Wan2.6／3.0或托管服务。
- **L1**：[LTX固定LICENSE-2_x](https://github.com/Lightricks/LTX-2/blob/be6d6d0a69d11a0a399c462ed92606692e5f8697/LICENSE-2_x)，2026-08-11；§1.6合并实体、§1.9版本范围、§2.1门槛、§3分发、§5输出、§6标识、§7制裁。
- **L2**：[LTX-2.5官方卡](https://huggingface.co/Lightricks/LTX-2.5)，revision `49b093a39c19169a8a81721dcc541e07e945232f`。卡片“Over $10M”不能覆盖法律文本“at least”边界。依赖含Gemma 4编码器，部署前另核；未点击分享联系信息／接收营销的访问确认。
- **R1–R3**：[Runway Terms](https://runway.com/terms-ofuse)（2026-09-15）核§1、§2.5、§4.4、§18.12；[商用帮助页](https://help.runwayml.com/hc/en-us/articles/21668707517587-Can-I-use-the-content-I-made-in-Runway-for-commercial-purposes)；[Gen-4.5使用条件](https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5)。

**当前性与未核实边界 [一手／研究]**：已存在[FLUX 3 Image官方页面](https://bfl.ai/models/flux-3-image)，指向商业权重洽谈，因此不把FLUX.2宣称为品牌最新型号，也不把未审合同视为开放许可。未核Qwen-Image 2.0／3.0开放权重、全部第三方依赖或任何具体资产权利；后续选新版本、托管商或适配器时必须补行。没有真实游戏生产、质量或成本实测。

## 3D、绑定与动作：主模型许可不是整条管线许可

核实时间：2026-10-14，UTC+8。[一手] 以下读取官方许可证、模型卡或服务条款；[研究] 评级只决定是否进入后续质量评估，不证明可直接发布、不侵权或输出具有可执行版权。商业托管与本地推理分别核查。

| 方案及核查范围 | 代码 / 权重 | 输出、商用与发行门槛 | 采用判断 |
|---|---|---|---|
| **TRELLIS.2 / TRELLIS.2-4B** | [一手] 固定代码及官方模型均 MIT；见 [代码许可](https://github.com/microsoft/TRELLIS.2/blob/75fbf0183001ed9876c8dbb35de6b68552ee08bd/LICENSE)、[官方权重卡](https://huggingface.co/microsoft/TRELLIS.2-4B) | 主模型许可未见额外输出非商业、地域或营收限制；但推荐本地安装含仅研究/评估非商业使用的 NVIDIA 依赖，不能按“全 MIT”进入商业生产。详见下文，不能反推所有 TRELLIS 输出都禁商用 | [研究] 👀 主模型候选；⛔ 推荐依赖组合不直接作为商用生产默认 |
| **Hunyuan3D-2.1** | [一手] 代码、权重均为 Tencent Hunyuan 3D 2.1 Community；[固定 LICENSE](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/82920d643c0dc2f7bfd7255f45f62d386edfe60c/LICENSE) §1 明确范围 | §6(d)腾讯不主张输出权利，但 §5(c)仍禁止在 EU、UK、韩国使用/分发/展示 Output。§4是版本发行日上一日历月全产品/服务合计 MAU >100万须另授权，**不是营收门槛**；§5(b)限制用输出改进其他 AI | [研究] ⛔ 不默认全球商用；境内生成不能自动绕过输出地域限制 |
| **SkinTokens / TokenRig** | [一手] [固定代码 MIT](https://github.com/VAST-AI-Research/SkinTokens/blob/273b691d35989d71cd17ff2895fdc735097b92d1/LICENSE)；[固定官方模型卡](https://huggingface.co/VAST-AI/SkinTokens/blob/79736cad0fd84de384d5eede659b4ebd24effe33/README.md) 将 `grpo_1400.ckpt`、`skin_vae_2_10_32768/last.ckpt` 标为 MIT | 未见独立输出非商用、营收/地域门槛；输入 mesh、纹理及第三方依赖仍须授权。模型卡列 ArticulationXL、VRoid Hub、ModelsResource 等训练来源，不等于全部训练资产都 MIT | [研究] 👀 指定双 checkpoint 可进入商用评估；不能泛化任意微调或输入角色 |
| **HY-Motion-1.0 / Lite** | [一手] [固定代码 License.txt](https://github.com/Tencent-Hunyuan/HY-Motion-1.0/blob/4e426f5a1021cbcf7f375458c37b840ee7225229/License.txt)、[官方权重 LICENSE.txt](https://huggingface.co/tencent/HY-Motion-1.0/blob/main/LICENSE.txt) 均为 Tencent 社区许可 | §5(c)将 EU、UK、韩国地域排除延伸到输出；§4同样是发行日上一月合计 MAU >100万另授权。输出不归腾讯不取消地域约束；人体模型等依赖另核 | [研究] ⛔ 不默认全球商用 |
| **GVHMR** | [一手] [固定 LICENSE](https://github.com/zju3dv/GVHMR/blob/ee960bb6e2ea2d381aa97f08e9b71ef320b624b1/LICENSE)仅教育、研究、非营利，修改须开源且禁商用；未核得独立 checkpoint 完整商用授权 | 商业使用软件本身已不在现有许可内，不能以“只导出动作、不分发代码”放行；checkpoint、SMPL等人体模型、输入视频另核。无“小收入即商业豁免” | [研究] ⛔ 不默认；作者商用联系渠道不等于已获许可 |
| **Meshy 服务** | [一手] 专有服务；无本地权重授权，插件/SDK不能替代服务合同 | [当前条款](https://www.meshy.ai/terms-of-use) §3.2：免费输出 CC BY 4.0，可商用并履行署名等条件；付费输出在法律允许范围内归客户。§3.3：公开到 Community 的3D输出为 CC0，其他社区内容为 CC BY-NC 4.0。未见一般营收阈值 | [研究] 👀 有条件商用；需区分私有生成、社区3D与参考图 |
| **Tripo 服务** | [一手] 专有代码/模型，§5.1未授本地权重；[当前条款](https://www.tripo3d.ai/terms) | §5.2.1免费用户 Input/Output 权利由平台保留；§5.2.2付费用户可商业使用/分发。官方[商用指南](https://www.tripo3d.ai/help/privacy-policy/how-to-use-tripo-models-commercially)明确免费不授商用。未见一般营收门槛；本轮未核清旧免费资产追溯、退订后持续权利 | [研究] 👀 付费有条件；免费及追溯情形不默认 |
| **Rodin / Hyper3D** | [一手] 专有服务，无本地权重授权；[当前条款](https://hyper3d.ai/legal/terms) | §5(b)对 Rodin 输出不限制用途，但受全协议、法律与第三方条款约束；[当前计划](https://hyper3d.ai/pricing?lang=en)区分免费预览/旧模型导出与付费广泛导出。未见一般营收门槛；未核清追溯/终止细节 | [研究] 👀 具体计划和合法导出有条件；勿套用 ChatAvatar 的另购商业许可 |

### TRELLIS 的关键反证：MIT 主体与非商业依赖同时存在

- [一手] 固定 [README](https://github.com/microsoft/TRELLIS.2/blob/75fbf0183001ed9876c8dbb35de6b68552ee08bd/README.md) 明确模型/代码 MIT，同时声明 nvdiffrast、nvdiffrec 独立许可；推荐完整安装命令显式启用两者。
- [一手] 固定 [setup.sh](https://github.com/microsoft/TRELLIS.2/blob/75fbf0183001ed9876c8dbb35de6b68552ee08bd/setup.sh) 的两个安装 flag 初值 false、可以不选；实际路径是 `NVlabs/nvdiffrast` **v0.4.0** 和 `JeffreyXiang/nvdiffrec` **renderutils** 分支，不是笼统的最新 NVlabs main。
- [一手] 已读 [nvdiffrast v0.4.0 许可 §3.3](https://github.com/NVlabs/nvdiffrast/blob/v0.4.0/LICENSE.txt)及[实际 nvdiffrec fork 分支许可 §3.3](https://github.com/JeffreyXiang/nvdiffrec/blob/renderutils/LICENSE.txt)：用户仅限非商业研究/评估，NVIDIA及关联方享商业例外。只有前者标题含“1-Way Commercial”，后者为“NVIDIA Source Code License for nvdiffrec”。该分支还须在采用时固定 SHA。
- [研究] 门槛是**使用受限软件进行商业生产**，不能不经分析就称生成网格是该软件的衍生作品、给所有输出附上非商用限制。删除安装 flag 也不证明推理/渲染/导出路径已脱离依赖；替换、移除或取得商业授权后，仍须验证实际路径。托管服务按其合同和授权链另核。

### 3D / 动作其余边界

- [一手] Hunyuan3D/HY-Motion 的 AUP 第12项还要求公开机器生成内容显著标识；模型分发时另有许可证、修改标记及 Notice 义务。不能仅摘“不主张输出权利”。
- [一手] SkinTokens [固定下载脚本](https://github.com/VAST-AI-Research/SkinTokens/blob/273b691d35989d71cd17ff2895fdc735097b92d1/download.py)取该项目两个 checkpoint；Qwen3-0.6B只取配置并排除 bin/safetensors，不应虚构“必须额外下载Qwen完整权重”。
- [一手] Meshy [2026-08-27 商用说明](https://help.meshy.ai/zh-CN/articles/16102098-can-i-use-meshy-assets-commercially)按生成时套餐确定权利，降级保留付费时期资产权利；未见免费旧资产自动变成私有无署名的保证。
- [研究] Rodin 与 ChatAvatar 必须分开：同一条款 §5(a)对 ChatAvatar 规定免费非商业、另购许可与账户存续等条件；不能把这些条件混入 Rodin，也不能将 Rodin 一句宽泛表述推广到平台全部产品。

## 音频：具体产品、下载与生成时间决定授权

| 方案及核查范围 | 代码 / 权重 | 输出、地域/规模、下载及订阅门槛 | 采用判断 |
|---|---|---|---|
| **ElevenLabs TTS / Sound Effects，非 Beta** | [一手] 专有服务；不授基础权重，用户 voice model 不等于基础模型所有权 | [2026-10-09 一般条款](https://elevenlabs.io/terms-of-use) §1(c)免费非商业、付费可商业，§4(c)用户保留输出权利；仍须输入声音/文本授权及相关附加条款。本轮详读非EEA版，EEA/瑞士/英国居民适用另版，不能把合同版本误写成地域禁售 | [研究] 👀 付费有条件；免费、Beta不默认商用 |
| **Eleven Music** | [一手] 专有服务，无权重授权；[2026-10-09 Music Terms](https://elevenlabs.io/music-terms)为特别条款 | 免费不可下载；普通计划只支持符合定义的 Indie Game，Studio Game须 Enterprise Music。单游戏累计净收入<50万美元且开发/发行实体上一财年全部游戏净收入<100万美元，含关联方；超限有60天升级窗口。§1.5升级覆盖账户已有输出，退订/降级保留按生成计划的条件 | [研究] 👀 有条件，必须与TTS/SFX分行；不能品牌级“付费都可商用” |
| **Suno** | [一手] 专有代码与权重，无本地授权；[2026-09-03 生效条款](https://suno.com/terms) | Pro/Premier权利转让仍受商业条款限制；商业利用必须取得该档允许、官方批准渠道的 **Download**。免费/Basic个人非商业；**当前一般条款定义的平台 Remix 即使付费且可下载仍限个人非商业**（另行提供方案除外，不泛化为所有自行改编）。录音/抓流取得副本不算许可下载；合法Download商用权在退订/降级/额度变动后存续 | [研究] 👀 有条件；不能只核订阅，还须核Download与Remix状态 |
| **Udio 当前过渡服务** | [一手] 专有服务，无本地权重授权 | [当前ToS入口](https://www.udio.com/terms-of-service)可达但本轮未提取正文；[2026-02-17 官方变化说明](https://help.udio.com/en/articles/12683565-changes-associated-with-the-universal-music-group-umg-partnership)仍明确音频/视频/stems下载关闭。付费额度不是商业导出权证明；当前地域、计划商用、追溯等不能据旧条款补推 | [研究] ⛔ 不默认游戏资产来源；须当前合同与正式导出同时核清 |
| **jsfxr 本地/免费** | [一手] [固定 Unlicense](https://github.com/chr15m/jsfxr/blob/b7b6aa27d62f8f356db267276bf54b451555c49d/UNLICENSE)；参数化合成，无模型权重 | [官方 Free/Pro 对照](https://sfxr.me/)明确两档均可不限商业使用、免费可导出WAV。无订阅依赖，无营收/地域上限见于该许可；第三方音效包另核 | [研究] 👀 商用候选，作为短电子音基线；不是全部Foley替代品 |
| **TangoFlux** | [一手] [当前 LICENSE.md](https://github.com/declare-lab/TangoFlux/blob/main/LICENSE.md)声明模型为非商业研究用途，同时受 Stability Community、WavCaps及原数据集条件约束；不能概括为MIT | 未见已清除全链限制的商业输出授权；单独注册Stability或取得其商业许可，不等于清除WavCaps学术限制及其他数据集义务。无可靠“小收入即可商用”结论 | [研究] ⛔ 不默认商用；固定候选SHA页面本轮提取失败，保留证据级别边界 |
| **ACE-Step 1.5 官方 turbo 包** | [一手] [代码固定MIT](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/LICENSE)；[ACE-Step/Ace-Step1.5 权重卡](https://huggingface.co/ACE-Step/Ace-Step1.5)亦MIT | 官方卡明确生成音乐可商业使用；无订阅、地域/营收门槛见于MIT。其训练数据合规说法是作者声明，不是本轮数据审计；翻唱输入、社区微调/LoRA另核 | [研究] 👀 指定官方包商用候选，不保证独占性或不侵权 |
| **Qwen3-TTS-12Hz-1.7B-CustomVoice + Tokenizer-12Hz** | [一手] [固定代码 Apache-2.0](https://github.com/QwenLM/Qwen3-TTS/blob/022e286b98fbec7e1e916cb940cdf532cd9f488e/LICENSE)；[固定CustomVoice卡](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice/blob/0c0e3051f131929182e2c023b9537f8b1c68adfe/README.md)及[Tokenizer卡](https://huggingface.co/Qwen/Qwen3-TTS-Tokenizer-12Hz)均Apache-2.0 | 未见独立输出非商业、营收/地域门槛；分发代码/权重须履行许可/NOTICE等义务。此许可证不授真人声音/肖像权，也不替所有“Qwen3”或第三方克隆checkpoint清权 | [研究] 👀 指定组合商用候选，音色和剧本单独核查 |

### 音频反证与待核事项

- [一手] ElevenLabs [官方发布权利帮助](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform)说明付费期间生成内容商用权持续，免费前后生成不追溯，Beta不供商业/生产。**不能将此一般帮助的不追溯规则覆盖新 Music §1.5**。
- [一手] Eleven Music Exhibit A 另限 Starter/Creator/Pro 仅个人，Scale实体<10人、Business实体<50人；Indie收入按扣除平台/分发费及退款等的净额计，单游戏含各版本和DLC，实体口径含关联方。不是“独立开发者自称indie即可”。
- [一手] Music §4.7 对超门槛未在60天内升级者另有存量例外：窗口结束前已分发的游戏副本内嵌输出可继续随那些副本使用和分发；不能误推必须撤回所有已售副本，也不能据此放行后续新发行。
- [研究] Music免费栏虽有宽泛Media Rights文字，仍明确禁止下载，不能推荐成可直接导出游戏音乐。升级后旧输出再降级的复杂存续情形宜取得书面确认；音乐素材库再分发与成品游戏同步使用也须分别看授权。
- [一手] Suno旧[追溯帮助](https://help.suno.com/en/articles/2425729)说明免费旧歌不自动获得商业权，个别歌曲可能获特别许可；它不能代替新版Download/Remix条款。具体月下载额度在账户计划页，本轮未登录，不编造数值。
- [一手] Udio [官方WMG说明](https://help.udio.com/en/articles/12874375-udio-warner-music-group-wmg-partnership)称仍受2025-10-29过渡ToS约束、允许网址分享；网址分享与可下载入游戏是两件事。[研究] 停止导出证据足以暂缓新资产管线，不足以认定历史合法下载曲的权利已被撤销。
- [一手] TangoFlux固定候选为 `164420faa2b3f8a28bb013ccde7006422a616fc7`，其网页/raw本轮多次提取失败，实际核读的是官方main许可证。[研究] 不能将作者的UK非商业研究例外说明当全球商用授权。

### 对后续资产 WP 的采用约束

[研究] 资产记录至少保留模型/checkpoint、输入权利、生成时间与套餐、合法下载证明、当日条款、地域及规模触发条件。Suno还须记录是否Remix；Eleven Music须持续监控Indie门槛；TRELLIS须记录实际依赖路径。公开源码或商用输出授权均不能单独证明整个管线合规。

[研究] 本轮未运行模型/引擎、未安装或下载权重、未购买或接受协议。仍需解决：Udio当前ToS正文；Tripo/Rodin的追溯/终止细节；TRELLIS受限依赖的合法替代与可运行验证；GVHMR的独立checkpoint、人体模型许可。对这些缺口保持条件，不把未知改写成许可已拒绝或已授予。


## WP2追加：近期图像型号与原生瓦片基线

2026-10-14（UTC+8）按WP2实际候选补齐；旧版行保留，不把系列名当统一许可。**[一手／研究]**

| 对象 | 代码 | 权重 | 输出与采用门槛 |
|---|---|---|---|
| GPT Image 2.5 Sunburst/Flare，2026-09-08 snapshot | 专有API | 不授自托管 | [当前服务合同](https://openai.com/policies/services-agreement/)在双方之间、依法规定客户输出归属；具体[Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst)/[Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare)为现行接口。地区/账户、输入权利与输出审查仍需满足；不保证独占或不侵权，不以ChatGPT订阅代API合同 |
| Google `gemini-nano-banana-2.1` Developer API | 专有；示例Apache不授模型代码 | 不开放 | [API特别条款](https://ai.google.dev/gemini-api/terms)面向专业/商业，Google不主张输出所有权，非独占。按[可用地区](https://ai.google.dev/gemini-api/docs/available-regions)访问；输出用于离线游戏不等于向玩家提供API，后者另有地区/年龄/EEA等付费条件 |
| FLUX3 Image API | 专有服务 | 商业权重另洽，不是免费开放 | [Developer Terms](https://bfl.ai/legal/developer-terms-of-service)及[API条款](https://bfl.ai/legal/flux-api-service-terms)允许合规商业输出，内容凭证/输入权利义务保留；本轮读非EU版，EU合同另核。默认合同可用于模型改进，保密资产不直接上传；不外推自托管 |
| Qwen-Image-2.1指定Git/HF版 | Qwen Research | 同研究许可 | [固定代码许可](https://github.com/QwenLM/Qwen-Image-2.1/blob/bb8e2172e08c6720652a4a23ad1c406e5b6ed1ee/LICENSE)与[固定权重许可](https://huggingface.co/Qwen/Qwen-Image-2.1/raw/d26bb61231c349cf6b7896fa83353113880e1ba3/LICENSE)限制商业生产、须另许，无小收入自动豁免；不以只交付PNG规避，不进入免费商用默认 |
| Unity Tilemap Extras4.1.2（Unity6000.0） | 官方包LICENSE外链UCL；第三方另含MIT通知 | 无 | [官方包](https://download.packages.unity.com/com.unity.2d.tilemap.extras/-/com.unity.2d.tilemap.extras-4.1.2.tgz)和当前[UCL1.4](https://unity.com/legal/licenses/unity-companion-license)需有效Unity Engine License，保留通知；用户内容与Work派生分开，素材独立授权。仅建议Unity内匹配官方包功能，不复制旧Git代码或跨引擎清权 |

Google未付费服务通常会将输入/输出用于改进并可人工审查；EEA/瑞士/英国另有例外。有active billing项目等条件时AI Studio即使免费也按Paid数据规则；Paid不用于改进但保留有限安全日志，不能写成零留存。地区清单未列中国大陆/香港，中文界面不代表所在地可用；不通过改地区或代理绕过。**[一手：现行条款；研究：数据和访问边界]**

Tilemap包与旧仓库的许可证没有内嵌v1.4，所链官网当前为1.4，不能据此追认历史版本；实际包通知与旧SHA不同，详见[WP2固定证据](2026-10-14-game-wp2-2d-assets.md#1-第二次修改为什么优先改结构)。这些行只放行有条件的调查/使用路径，不证明资产质量。

## WP3追加：现成3D资产与处理工具

核实2026-10-14 UTC+8。以下[一手]许可与[研究]采用范围配套[WP3](2026-10-14-game-wp3-3d-assets.md)，不将质量建议扩大到全站资源。

- [Kenney Nature Kit](https://kenney.nl/assets/nature-kit)：指定资产CC0，无生成权重；保留具体下载包许可，不能只引用另一包Generic Items。
- [Quaternius Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html)：指定包CC0商业可用；免费Standard和完整Source/引擎交付不是同一获取范围，额外动作逐项核。付费获取不改变页面所声明的CC0资产权利。
- [Poly Haven许可](https://polyhaven.com/license)：模型/纹理/HDRI资产CC0，网站文案、商标与展示渲染不包括在内。[API页](https://polyhaven.com/our-api)2026-07-18更新为含商用免费，使用其服务的产品有来源标示等条件；下载后资产权利与持续API接入义务分开，不将页面读取扩大为任意抓取授权。
- 处理库主许可分别核对：[meshoptimizer b233043](https://github.com/zeux/meshoptimizer/blob/b2330430776a95a1545f03fc7bf16927f8cadc59/LICENSE.md)、[xatlas f700c7](https://github.com/jpcy/xatlas/blob/f700c7790aaa030e794b52ba7791a05c085faf0c/LICENSE)、[CoACD 131010c](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/LICENSE)均MIT，无模型权重；分发保留通知，输入网格和第三方依赖另核。
- [Infinigen a0d1a0d](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/LICENSE)：主BSD-3-Clause，明确标注部分CC0；不由根许可包办外部素材/包。本轮仅借配方，不部署完整导出器。
- Meshy7.1/T2、TripoP1/P2、Rodin2.5仍按上文对应服务合同和实际生成/导出计划；型号更新不自动更改旧免费资产权利。
- 暂缓商业默认：LATO.2主代码/官方权重卡虽MIT，默认安装引入nvdiffrast0.4.0受非商业研究条款限制；TaoFlowForge根Apache2不证明ModelScope权重和DINOv3依赖已清权；Marble完整合同本轮未核清。固定来源在WP3研究，三者不得借主许可进入无条件商用推荐。

## 发布渠道不能被生成许可替代

- [Steam Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)当前重点是随游戏交付、由玩家消费的AI内容（美术、音频、叙事、本地化等），不以一般开发效率工具使用为重点；区分预生成与运行时生成，后者另需说明防止非法内容的措施。披露不豁免侵权或其他内容规则。这里没有访问开发者后台、提交问卷或验证某款游戏已获准。**[一手：2026-10-14官方原文]**
- [Unity Asset Store Guidelines §1.6](https://assetstore.unity.com/publishing/submission-guidelines)针对资产销售提交：功能资产含AI辅助生成时须说明工具、生成内容与增加的价值；生成式营销素材规则有例外，不能概括为任何AI图片都同样披露。合规生成也可能因质量、侵权或缺乏差异化被拒。此规则不是普通Unity游戏发布的统一许可。**[一手]**
- [Fab许可摘要](https://www.fab.com/eula)允许把Standard License资产整合进商业项目，禁止单独再分发资产；支持兼容工具而非仅Unreal。页面明确摘要不具约束力，具体购买须复核完整EULA、取得时档位与商品许可；CC-BY条目按另一许可处理。本轮不据摘要复制商品素材入本公开仓库。**[一手：官方摘要；研究：未取得完整购买契约]**
- Godot引擎贡献与Asset Store规则沿[既有独立核查](2026-10-13-godot-contribution-policy.md)，不能用生成服务允许商用推导接收渠道必须接受。**[一手：已有来源记录]**

## 验证范围

只读官方文本、固定源码许可与公开模型卡。未安装、下载权重、调用付费服务、测试模型/引擎或核查读者账户合同；后续推荐新增方案时先补许可行，不把未核实写成允许。

本轮实际检查：`python3 scripts/check_offline.py` 14阶段及 `git diff --check` 通过；内部独立复核交叉读取 Suno/Eleven Music 原条款并修正独占/侵权保证措辞、存量副本例外与平台Remix范围。正式云端评审未取得；hosted CI 必须另按发布SHA核对。
