# B-AI-GAME-CHARACTER-REVISION-20261104 · 成套角色动作二改实例
id: B-AI-GAME-CHARACTER-REVISION-20261104
owner: dot-B
kind: explore
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-ai-game-character-revision-20261104

工作线：AI 做游戏实例。部分源码机制已接收；原实例门槛与整包独立审查未完成，不重派来源收集。

## 目标
为 成套角色精度、固定骨架动作及二改。 找 2–3 个有实际游戏和作者制作过程的新作品，供 dot 后续完整试玩和选择。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/ai-made-games-scout/SKILL.md` §1。来源范围：近两年 itch.io 动作／格斗 devlog、作者 GitHub 动画脚本与完整演示、r/aigamedev／r/gamedev 作者流程帖，并覆盖 B站或 TapTap 原作者渠道。
核同角色 idle／移动／攻击三类动作的来源，改装备或接触时刻怎样保骨架与旧动作，是否依赖人工刷权重／逐帧修补。只有角色转盘、绑定工具或模型广告不收。
先对照游戏首页与 `docs/research/2026-10-23-game-worth-trying.md`、旧 B-AI-GAME-SUPPLY-SOURCES 的完整产物排重。以下仅能作对照，不计新候选：Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R’lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso；pxl 也不算新游戏。若跨新卡重复，把它归最贴合的一张，其他卡只留转交链接。
每项需可玩链接或完整连续实机、作者原始制作过程、作者公开静态截图原链接、版本与发布日期、AI／人工分工、成本与许可未知项。只取已公开静态资料，不启动游戏或抓取游戏画面；已知拦截不绕过，可标摘要线索。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/B-AI-GAME-CHARACTER-REVISION-20261104/sources.md`；不改游戏首页、研究正文、inbox、其他卡或规则。

## 怎样算做成
交最有用的制作机制、上述证据及一个可在现案例验证的二改问题。非作者核链接和作者身份、完整实机可达性，候选不足就给实际覆盖与排除原因，不凑数；本机不评水平、不写已玩或品质通过。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 部分接收：原稿 [addc54f](https://github.com/dbvv1/a1dbv/commit/addc54f31e18ae938fd41e83073ab94d7e9d5a30) 的 World of ClaudeCraft 固定体型补库、覆盖顺序与接触时序差异，经一手源码核查后进入[动画页](../../../domains/game-dev/assets/animation.md#character-clip-library-revision)；[窄来源记录](artifacts/B-AI-GAME-CHARACTER-REVISION-20261104/sources.md)保留原稿入口与未验范围。
- 不接整包：原清单的可玩性、作者身份与 2–3 项新实例门槛未独立完成，原整包最终审查未完成。已纠正把 hand-keyed 推成人工工时的说法，并补作者明示的 WoW 参照及媒体许可边界；不复用其模型／动作，不作游戏品质推荐或提高案例评分。
- 检查：本次按正文范围重跑文档、公开文件／提交身份与差异检查，结果写提交说明；原回交的通过自报不替代本轮核查。
- 恢复条件：沿原稿补齐选定作品的实际可玩或完整实机、作者原文和许可；再接剩余实例结论。不重复广搜、不重跑原单元、不新增拍摄。
- 执行证据：原卡仅证明超时前成稿已回交；这里的静态核查不证明原调用／外层进程已退出，未知仍保留。
