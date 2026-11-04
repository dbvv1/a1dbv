# B-MOBA-EQUIPMENT-ICONS-20261104 · 补三件装备图标源
id: B-MOBA-EQUIPMENT-ICONS-20261104
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: b489ed38592dc184fffe2ab9b3b186441c7dc9bb
result_branch: relay/b-moba-equipment-icons-20261104

工作线：MOBA-Like。本卡为独立排队单元，尚未认领。

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
