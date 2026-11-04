# A-GIT-DELIVERY-CLI-READER-20261104 · 用失败检查修复交付清单输出
id: A-GIT-DELIVERY-CLI-READER-20261104
owner: dot-A
status: running
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

## 当前结果
待领取。已有缺陷复现只作真实任务输入；尚无新读者、修复或原生Windows验收。
