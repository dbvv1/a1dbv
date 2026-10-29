# B-SR-RACE-REVIEW-SMOKE-20261029 · 分段复盘旁置功能验收
id: B-SR-RACE-REVIEW-SMOKE-20261029
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 42f8404c07f3ebc3d1fd575dd16ead440231e917
result_branch: relay/b-sr-race-review-smoke-20261029

## 目标
验固定远端 42f8404c07f3ebc3d1fd575dd16ead440231e917、tree 5386d5c6d5b6b0a60c6128c38542315c8e9a91d5 的分段复盘旁置候选，游戏内容基线 c4e6dd1accc98bec2b428da211d8dd86ee4c781a 保持不变。玩家通过 ?raceReview=1 查看每段成绩、同一份赛前最佳差值及未完赛已完成段；默认／legacy 功能不退化。这是功能 smoke，不是画面优劣或驾驶手感验收；不合 master、不部署。

## 按哪个 Skill／规格
按细则§7、game-quality-pass 与固定源码 tests/backlog-smoke.mjs、tests/race-review-smoke.mjs。排队／认领不代表可运行；启动前须取得原 B-MOBA-COMMAND-ENVELOPE-SMOKE-20261029 本次全量只读核验的实际记录，证明原调用及额外观察／fullsmoke调用均settled、按精确PID＋创建时点／父链核全部自有Node／浏览器／动态preview监听及已归属两head当前不存在，串行槽空闲；启动当时再fresh复核。历史三观察及两head退出码保持unknown、第三renderer unknown、额外重跑及删产物不合规，不要求补不存在的历史码，也不将来源自拟书面豁免当授权。任何当前事实未知即blocked、不启动；不凭Git／标签／锁／超时认定退出，不清锁、不杀未知进程、不重派活跃单元、不重跑MOBA或并发浏览器。真实满足才继续本Star原调用，其实际结束／退出后才可接FPS。
在独立 worktree 固定 HEAD/tree/clean；复用已验158项CPU、独审及本轮17项runner定向检查，不重复全套。仅现有 Node.js 24、Python3、Playwright依赖和已装 Chromium；缺依赖最多 npm ci --offline（外部超时600秒），不可满足则 blocked，不联网安装或下载浏览器。按当前固定源码 npm run build（外部超时300秒），记录完整 dist/ 与 worker/index.js 每文件hash，tracked文件dirty必须空。
本轮只选择一次已存在 Chromium 可执行文件，必要时设 STAR_RUSH_SMOKE_CHROMIUM。保 headless 与 sandbox，两个runner初始args均为空、忽略unsafe默认flag；STAR_RUSH_SMOKE_CLOUD_NO_SANDBOX必须不设。不可见窗口／桌面／系统键鼠；页面smoke仅原Playwright输入。软件renderer也可验功能，保原始身份并分类，不因软件、失败或超时换浏览器／renderer重跑。
本轮唯一目录 outputs/race-review-smoke/<固定SHA>-<唯一run-id>/，先跑 node tests/backlog-smoke.mjs <本轮目录>/backlog（外部超时600秒），关闭并核实该browser/preview自有链退出后，再跑 node tests/race-review-smoke.mjs <本轮目录>/review（外部超时1200秒）。两子目录由runner创建，不预建、不覆盖。首条失败或清理不明就停止后续，保原报告和日志，不盲重试。
backlog覆盖默认、road、legacy、Rapier与旧capture入口；focused覆盖正常默认回归、academy通过现有菜单两次自动驾驶完赛、赛前最佳差值、自然AI截止的部分DNF、重试／回主页、小屏滚动。禁止注入模拟状态、时钟、存档或结果；不能用CPU／capture结果替代正常页面流程。纯读DOM/localStorage/raw WebGL可按原runner执行，断言不削弱。

## 写入范围
源码／素材／锁文件／runner只读；允许现有构建流程的dist输出、缓存及本轮独占输出目录。只在result_branch新增 docs/quality/smoke/B-SR-RACE-REVIEW-SMOKE-20261029/<run-id>/ 下的脱敏manifest、两个原报告、截图、hash和真实退出回执；原始日志留本地。
公开副本去除私人路径、用户名、完整argv、wsEndpoint、nonce、凭据及内部对话；标明脱敏。保完整renderer/vendor/version/unmaskedRenderer/unmaskedVendor原字符串，分别判gpu/software/unknown。不得裁掉失败报告或以成功轮覆盖失败轮；没有桌面截图。

## 怎样算做成
两脚本passed且无错误、预期流程断言全部通过；manifest包含固定HEAD/tree/clean、完整构建hash和全部公开产物hash，前后source与产物不变。保默认／legacy隔离和真实复盘数据证据，不把只有页面打开称验收通过。
每条原调用分别保 Node、外层 wrapper 实际开始/结束/退出码，DEBUG=pw:browser原日志在本地；回所属browser PID实际退出、预览端口拒绝连接及自有父链退出事实。首脚本清理完成后才能起第二脚本；最终核本轮自有链消失，没测写未知，不能以Git状态替代。任何失败/超时保独占目录manifest与原报告，只关确定本轮归属资源，不扩大清理。未试玩听感、GPU画面优劣、驾驶手感与其他赛道浏览器全流程仍待验。

## 当前结果

- 本单元未起 smoke：前序 MOBA 遗留的三次 bot snapshot 调用缺浏览器退出回执、两个 head.exe 退出时刻与码未知且其中一个父链未核实，MOBA 窄返工仍在途、串行槽空闲无法证实，故按卡写 blocked 报告（审查无开放问题）。恢复条件：接收端书面接受这些缺失退出/父链事实或取得真实回执，待 MOBA 返工结束并核实串行槽空闲后，用新 run-id 先跑 backlog 再跑 review。
- 产物：[4407db6](https://github.com/dbvv1/Star-Rush-Reborn/commit/4407db657d6bc1c245c2b4e608399ea8b9c37086)，分支 `relay/b-sr-race-review-smoke-20261029`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：接收端处理上述 release condition 后，以新 run-id 重跑本单元：先 node tests/backlog-smoke.mjs <run-dir>/backlog，确认浏览器/预览链退出后再跑 node tests/race-review-smoke.mjs <run-dir>/review
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
