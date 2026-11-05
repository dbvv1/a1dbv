# B-MOBA-EQUIPMENT-ICONS-20261104 · 补三件装备图标源
id: B-MOBA-EQUIPMENT-ICONS-20261104
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: b489ed38592dc184fffe2ab9b3b186441c7dc9bb
result_branch: relay/b-moba-equipment-icons-20261104

工作线：MOBA-Like。原结果已交回，本轮只记录独立复核与窄返工条件，不重派原单元。

## 目标
给已有三件装备补可二改的同族图标源，解决完整内容清单仍只有装备文字的缺口；本单元不接 HUD。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §2–4 与 `domains/game-dev/assets/2d.md`。固定 `src/content/catalog.ts` 的 sunsteel_blade／warden_plate／wayfarer_boots 三个 ID；仅绘剑、胸甲、靴三种原创轮廓，不借商业图标。复用 `asset-pipeline/icons/recipe.json` 的亮／暗主题和 64×64 viewBox、边缘留白，32／48px 输出；三形只靠轮廓即可区分，不依赖文字或颜色。
在本卡目录建自有源／配方／导出器；可调用已装的原渲染依赖，不改原六个技能图标／导出器。做一次统一描边 4→4.5 的二改，源几何身份、物品 ID、价格和属性保持。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `asset-pipeline/equipment-icons/`（源 SVG、配方、导出图、测试、README）；不改 src/ui、catalog、旧 icons、quality.md 或运行构建。

## 怎样算做成
三件×两主题×32/48px 及 SVG，确定性重建与缺源／非法参数拒收测试；输出实际像素尺寸、透明边缘和许可来源，非作者看实际小尺寸图指出混淆风险。PNG 渲染依赖不足则保留 SVG 与缺项，不称整套完成；HUD 同框与玩家识别尚待案例接入。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 原结果 [ed105e5](https://github.com/dbvv1/MOBA-Like/commit/ed105e5ea44e555ad8e1377880a8e916ce3ec2d1) 与原分支保留；本轮未接 HUD、未合 main、未部署。源与导出合同可用，不等于无文字识别通过。
- 11-05 非作者将三装备与六类既有技能图标的两主题原始32px图并排实看：胸甲双肩/领口/腰线与单尖底self-shield可区分；靴的短方鞋头与竖筒仍易读成瓶/容器。确认后者为真实返工条件，不以三件彼此不同替代“能读成靴”。这不是玩家识别率或HUD实测。
- 云端 Node 24.22.1 原测试实际 exit0、9/9 通过、无skip；两次导出与已提交运行图字节一致，缺源保旧批/首次失败无输出通过；源副本检查前后干净。未运行浏览器/声音设备。
- 原本机调用的最新进程/工具结清本轮未取得，不能从结果分支静止或状态标签推定。当前保持 review_ready，仅记录返工条件，不自动重启/重排旧调用；沿原入口补齐事实后再由负责人改 revision_requested。

## 修改要求（核清原调用后沿原卡续接）

1. 仅窄修 source/wayfarer-boots.svg 的轮廓：显出沿地面向前的鞋头、脚背折线与后跟，使32px时不像直筒瓶/容器。保留64×64 viewBox、原主题、4→4.5描边配方及透明留白，不添加文字或依赖颜色区分；不改剑/胸甲几何、item ID、价格/属性。
2. 只经原export.mjs完整重出两主题32/48px和preview，不在PNG上人工补画；剑/甲运行文件应逐字节不变。原9项及针对靴几何保留/边缘的回归通过。
3. 非作者实际看新旧靴与剑/甲及六技能图标的32px同框，分别报告靴的语义和轮廓混淆；仍像容器即返工，不以作者自报或测试代替。HUD与真实玩家识别仍留后续接线。
4. 写入限原equipment-icons目录，按原Workflow/公开扫描交回原result_branch；不重做其他源，不接产品HUD、不改main、不部署。
