# A-SKILL-PACKAGE-ENTRY-20261030 · 修通现有 TanStack 包内 Skill 的复制入口
id: A-SKILL-PACKAGE-ENTRY-20261030
owner: dot-A
status: running
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 8f01eeee1f931cfd48390658906a42cc5148e084
result_branch: relay/a-skill-package-entry-20261030

## 目标
让读者从本仓根目录找到实际消费包，按已安装版本读到窄 Skill，再走既有测试／构建入口；解决实验 README 缺工作目录、直接 cat 顶层传递依赖与决策页解析入口不一致的问题，不新造包装工具。
沿已接收 TanStack 真实产物补入口，不重新实现功能、跑浏览器验收或开展模型收益对照。

## 按哪个 Skill 与规格做
先读最新 AGENTS、CLAUDE、手册 §7、operations §2.2／§3、local-jobs README 与 TASKS；按 write-task-guide 的可复制入口要求，保留已有正文推荐和实验事实。
固定输入为 base_ref 的 docs/decisions/skills-and-plugins.md 与 experiments/tanstack-url-state/README.md、package.json、package-lock.json；既有源码和测试只作核验，不修改。先核 main、负责人分支和本机在途，同页已有活跃写者就报告，不覆盖。
把两页入口统一为：明确消费目录 → 确认安装版本 → 从实际消费包解析传递依赖并只读配方 → 沿原测试／构建验收。实验 README 从本仓根开始，决策页则明确从读者自己应用的消费目录开始，不能混为同一个目录。
优先沿现有 Node createRequire／包解析写法，不假设 npm hoist 布局，不新增源码工具、安装器、全局配置或框架。区分缺依赖、已安装包未附该 Skill、读到正文；不把 exit 0、发现列表或读取成功说成自动加载或模型遵守。
阅读入口自身不隐式下载／安装／执行配方；保留实验原本明确的首次安装步骤与网络前提。Intent 只是可选的已安装 CLI 路线，不让 npm exec 在缺包时隐式下载；缺失时用原生只读入口或明确回退。
使用现有 Node 和依赖核可复制命令；如实包可用就核路径、版本与 Skill，缺失则明确该分支未验，不安装软件或依赖。可在任务临时目录构造明确合成包布局核正常／缺失分支，不冒充真实包或 pnpm 实测；临时 fixture 不提交。
保留原功能、历史测试／浏览器结论与日期；不声称新的真实产品采用、自动激活、效率收益或模型对照。旧四 reader／四 wide 不重排；本卡不改旧 Skill 通用模板，不重做 TanStack 功能任务。
不读私人会话、凭据、账号用量或用户配置，不调用 ListAgents、不另起模型实验，原生 build 非作者审查照常；不改接收端、权限或沙箱，不触碰 Hook 拒绝目标及 Supabase 待批上传内容。

## 写入范围
模型仅改 docs/decisions/skills-and-plugins.md、experiments/tanstack-url-state/README.md，并写 docs/collaboration/local-jobs/artifacts/A-SKILL-PACKAGE-ENTRY-20261030/result.md 的简短差量、命令检查和未验分支。
不改依赖／lockfile、实现、测试、模板、地图、运行配置、其他卡或产物、TASKS／inbox；接收端只另回写本卡状态与当前结果。
适用检查通过后仅推指定 result_branch，回 review_ready；不用 accept: auto、不合 main、不部署，由 dot 最终验收。

## 怎样算做成
非作者核两页命令、工作目录和真实依赖声明：从仓根可找到实验，从自己的消费包可定位所装配方；缺输入能明确辨认且不触发下载。对照已有功能合同，不以入口通了冒充自动激活或新浏览器通过。
实际运行适用命令与正常／缺失分支检查；合成和真实结果分列。跑 check_repo.py、check_public.py、git diff --check 和提交身份检查；不改实验实现时不重跑无关完整实验／浏览器套件。
单元 60–90 分钟，含核验、非作者审查和修正；最多 2 小时。到时交实际产物及具体缺口，停止无新信息重复调用，不改超时配置；退出未知沿原协议先核原调用，不另建重试卡。
负责人入队前核 A 自身实际活跃少于 2 且共享有空余；原接收端按共享最多 4 并行调度，ready／running 标签与真正派发分开报告，不另起调度器抢槽。

## 当前结果
待原接收端领取；交回两处一致的只读配方与运行入口，保留历史采用范围和实际未验分支。
