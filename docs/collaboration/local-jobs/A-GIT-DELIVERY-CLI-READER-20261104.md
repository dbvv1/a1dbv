# A-GIT-DELIVERY-CLI-READER-20261104 · 用失败检查修复交付清单输出
id: A-GIT-DELIVERY-CLI-READER-20261104
owner: dot-A
status: accepted
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: a5f003360aa8491de9038e54e0f5478f357e3d60
result_branch: relay/a-git-delivery-cli-reader-20261104
page: docs/decisions/planning-and-tests.md@a5f003360aa8491de9038e54e0f5478f357e3d60

## 目标
读者面对本仓真实缺陷，判断该直接修复、先补测试，还是需要新的Plan／Spec，并完成可用交付：Git对象备料CLI在非UTF-8输出环境下处理合法Unicode路径，也要返回完整可解析清单，不丢路径、SHA或mode。
已有公开契约templates/generic/git-object-delivery.md支持UTF-8路径、仅读固定Git对象、不发布；scripts/prepare_git_delivery.py会输出该JSON。现有test_prepare_git_delivery.py中的中文路径只验函数结果与内存序列化，未覆盖这处直接CLI输出。
负责人在固定base脚本上用临时合成Git仓、相邻两个提交及新增“测试-🧪.txt”，直调--base、--head、--full：PYTHONIOENCODING=utf-8得exit 0及有效JSON；gbk／ascii均exit 1、stdout空、UnicodeEncodeError。这是云端Python环境复现，非原生Windows结果；不提供修法或现成新测试给读者。

## 按什么做
先由原接收端核最新main／负责人分支、同题卡与实际写者；本卡原调用或两个目标文件写者未确认退出时不领取重做，不碰旧worktree。当前已核队列没有这两个目标文件的执行卡；PUBLIC-SCAN-CLI仅改check_public.py及其测试，互不接管。无同域冲突后按现行领取协议先发布running，再开独立worktree。
使用reader-test原生Workflow和此前未读过该页／旧reader产物的新上下文。接收端将上方固定page全文附入实际模型任务正文，记录解析SHA与原始UTF-8字节SHA-256；不得只给链接、摘要或任务卡。固定全文指纹为2ae68c08b10ac743bda3e5273d325e68020cad61c22ae1b570b9f4da7cd2d6c1。
若无法取得固定全文或附入回执，先报输入缺口，不拿main最新版或作者摘要替换、不追认独立reader。全文附入不等于模型已理解；由读者结果记录实际采用位置。
读者只以该页作为方法指南；可读AGENTS、CLAUDE、目标实现及现有测试、上段公开契约和该页直接引用的原资料，记录必要页外帮助。不读本仓旧reader结果、负责人解题笔记、其他编码修复产物；不复制PUBLIC-SCAN卡的解法。
先写自己的路线选择与原因，再按页完成真实修复，不要求机械使用所有Plan／Spec／TDD环节。客户端与实际后端、可见环境分开记录，不用固定角色链或模型自报代替验收。
仅用现有Python标准库与Git，不安装／更新本机软件，不启动额外模型、浏览器或服务，不改账号、权限、全局配置、依赖或接收器。Git fixture仅在本任务临时目录，使用合成文本及noreply身份；不读个人配置、不操作真实远端、不执行模板中的发布步骤。

## 写入范围
仅scripts/prepare_git_delivery.py、tests/test_prepare_git_delivery.py，以及reader-tests/A-GIT-DELIVERY-CLI-READER-20261104-u1.md；模型不改任务卡，接收端只另写本卡状态与当前结果。
不改附入页面、地图、模板、其他脚本／测试、旧任务／产物、工作树规则或依赖；范围外缺口记录后停止依赖动作，独立可验部分照常。读者只记录页面卡点，不顺手修页或另建框架。
模型不commit／push；原接收端完成扫描与检查后仅推result_branch并回review_ready或blocked，不用accept:auto、不合main、不投稿或部署。

## 怎样算做成
先新增直接调用生产CLI的回归，用原固定脚本确认目标行为失败，再用同一输入验证候选通过；不从单纯函数序列化通过推定CLI通过。
正常输入覆盖纯ASCII与中文加emoji路径；在utf-8／gbk／ascii三个PYTHONIOENCODING下，stdout按bytes捕获并按明确编码契约解码、解析，均exit 0，路径、完整tree／blob SHA、mode、changes和--full条目与原生Git对象枚举一致，stderr无traceback。
测试helper不得在传入gbk／ascii后又强制子进程UTF-8或通过mock绕开真实stdout。JSON转义策略可改变，但解析后的对象语义保持；不要求保留空白排版或直接显示中文。
保留无参数、不存在ref、错误对象类型等既有用法失败exit 2及无半份JSON；有Unicode的失败诊断也不能让编码异常掩盖原错误。非UTF-8路径仍按既有合同拒绝，原生平台不能创建该fixture时如实记未验，不强行伪装通过。
保留二进制内容不解码、删除／重命名表示、符号链接只读目标文本、mode、gitlink及known-ref的原测试；remote_presence_checked仍为false，不改Git只读行为、不把清单直接当API请求体。
实跑python3 -m unittest discover -s tests -p test_prepare_git_delivery.py -v，另跑check_repo、check_public、git diff --check及实际提交身份检查。POSIX可用时按手册跑完整offline，缺bash／jq时写清未运行，不以定向通过冒充全门禁；不为本卡安装依赖。
非读者核diff、新测试旧失败／新通过及原始CLI输出，复跑关键消费者；分别判断任务结果和页面是否指导正确路线，不能以页面问答代替实际修复验证。
reader记录附入页SHA／指纹、采用步骤、首遍路线、实际命令／退出码／结果与必要页外帮助；分别记页面卡点、环境限制、读者误解，无卡点写无。保留首轮失败，不用返工抹成一次成功，不升级地图或声称模型／方法收益已证。
单元约60–90分钟、最多两小时；达到目标并交回证据即结束，不扩查其他脚本。缺依赖、固定页输入、写者退出证据或所需权限时标blocked并给具体恢复条件；原调用／工具／登记进程结果未知时先核原调用，不启动替代reader或重复任务。只清理本轮明确归属临时资源，不清他人目录或终止未知进程。

## 原回传结果（历史，后续接收见下）

- reader-test 一轮结束：实测复现 gbk/ascii 下 exit 1、stdout 空、UnicodeEncodeError；将 scripts/prepare_git_delivery.py 的 JSON 输出改为 ensure_ascii=True 后同输入 utf-8/gbk/ascii 全部 rc 0 且可解析，entries 的 path/tree/blob SHA/mode/size 与 changes 同 native git ls-tree 独立枚举一致；新增 3 个 CLI 级回归并确认先红后绿，模块 15 例中 12 过、3 例为本机既有 fixture 限制（symlink、chmod mode、非 UTF-8 文件名）。taskDone=true，pageStuck=[]；check_repo、check_public、git diff --check 均 exit 0，check_offline 因缺 POSIX /bin/bash 与 jq 未运行。openIssues：记录中提交身份来源误写为仓库本地（实为全局 ~/.gitconfig）；Unicode 诊断测试未断言原错误原因仍在；native_entries 与生产实现共用 ls-tree 解析方式、独立性有限；Unicode 用例用 by_path 汇合未断言条目数与重复路径。
- 产物：[9a5ba4b](https://github.com/dbvv1/a1dbv/commit/9a5ba4bca22220171bb6b48b6efc3bd6870ddad6)，分支 `relay/a-git-delivery-cli-reader-20261104`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人接收本轮 reader-test 并决定是否提交；如需继续增强，处理 4 个未关闭点（测试断言强度与记录表述），按规则不自动重读。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 当前结果

- **已接收并合入 main**：采用已审修订 [2b9cd3c](https://github.com/dbvv1/a1dbv/commit/2b9cd3c)，实际合入 [c485ecb4](https://github.com/dbvv1/a1dbv/commit/c485ecb42e5b1d96670db17757136d5e9a7eddd6)。2026-11-05 逐字核对 main 的实现、测试及 reader 记录三份 blob，均与采用版本一致。
- 四项回传欠项已在负责人接收中处理：更正身份来源且不保留个人配置值；失败诊断核原错误；期望条目改用显式夹具及独立 Git 对象查询；核总数、唯一键和完整对象身份。另锁定三种编码的 ASCII 输出契约，详情见 [reader 记录](../../../reader-tests/A-GIT-DELIVERY-CLI-READER-20261104-u1.md#负责人固定成果接收2026-11-04)。
- 非读者复核通过，新增回归在旧实现上确因目标行为失败；已审候选模块 16/16、合入树完整 offline 20/20 与公开／提交扫描通过。2026-11-05 本轮另跑模块 16/16、check_repo、公开扫描与空白检查通过。原 Windows 三项 fixture 限制与首轮失败不被 POSIX 通过覆盖。
- 按负责人接收合同标 accepted；接受的是该次实际修复与记录，不改页面／地图评级，不声称模型收益或整条方法已验证。未重派原读者，旧调用／登记范围外写者状态仍独立核实。
