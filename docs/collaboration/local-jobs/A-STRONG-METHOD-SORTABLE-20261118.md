# A-STRONG-METHOD-SORTABLE-20261118 · fallback 数组成对试验
id: A-STRONG-METHOD-SORTABLE-20261118
owner: dot-A
status: blocked
kind: build
executor: strong
target_repo: dbvv1/a1dbv
base_ref: a39fd988c8f13d7b641b204714e3a314378798b7
result_branch: relay/a-strong-method-sortable-20261118

## 要什么
同一强模型比较三段短任务与现行推荐，修复 Sortable #2456；由方向会话本机启动，不交默认弱模型三审链。
固定 SortableJS/Sortable 1.15.6 / 63ecb31937d19fcb30aa924e82ee8a769ef34492；headless 真实浏览器缺陷已复现，但正式执行门槛未过。

## 先解除阻塞，不先跑模型
云端已完成[源码到页面产物的构建预检](../../../experiments/strong-short-task-20261117/ui-replacement/BUILD-PREFLIGHT-20261119.md)：提供精确命令与锁定版本；仍需 Windows/实际 runner 确认，不解除下列阻塞。
按[接收与隔离门槛](../../../experiments/strong-short-task-20261117/ui-replacement/results/RECEIPT.md)逐项回传有效隔离配置、合成读边界探测、真 GPU 截图/看图与固定复现证据。
视觉预检不另造工具：若 [11-17 的 `shot.mjs` 路径](../demo-trial-20261117.md#L5-L18)能在当前隔离中复用，沿用截图与看图通路，不照搬游戏脚本。从实际跑固定拖拽页的同一浏览器实例带回有效 renderer、相关硬件加速状态、截图及模型基于图像的观察；显卡清单、帧率、截图或 GPU 进程单独都不够（[SwiftShader 可在 GPU 进程里软件渲染](https://chromium.googlesource.com/chromium/src/+/main/content/browser/gpu/fallback.md#swiftshader)）。
仅使用已有获准环境，不自行改用户安全设置；若做不到，保持 blocked。独立目录/新会话/事后没发现越界均不能替代实际读隔离。
完成 RUN-ENV.txt 实值冻结、两臂提示与页面哈希；dot-A 核收后才改 ready，本卡 blocked 状态禁止启动两臂。

## 解除阻塞后的明确输入
只发 `experiments/strong-short-task-20261117/ui-replacement/inputs/fallback-array/short.txt` 或 `current.txt` 全文、同一 RUN-ENV.txt。
分别置于独立目标检出，附相同 `preflight.html`；不提供 a1dbv、另一臂、历史预检驱动/日志、旧补丁、issue 评论或上游解法。
GPT-6.1 sol / Codex CLI / xhigh，短任务→现行，每臂至交付或两小时；同工具权限/依赖/项目指令，允许同样的真实反馈和长回合，不插入步骤审批。
记录真实模型身份；不可用则 blocked，不换模型。原调用未终态不得重启。不重派原 Excalidraw/Click。

## 验收与交回
首要：三轮 start/sort/end 中原始 alpha/bravo/charlie 各一次、顺序符合实际列表；保留正常排序、非 fallback、事件语义、取消拖动后项目完整。
查相关回归测试、项目适用检查、控制台和维护性；首交原样保存，非作者标签隐藏先判质量再看方法/成本，失败不静默重跑。
依原协议分账墙钟/token/缓存/实际费用或未知，设置、隔离、人工、评审、返工另计；不能把预检无计费当作模型成本。
只写 `experiments/strong-short-task-20261117/results/sortable/` 与本卡当前结果，含冻结环境/输入哈希、隔离证据、首交补丁、运行证据、盲评与计量。
验证与公开扫描后快进推 result_branch，回写 review_ready；dot-A 接收，不自动合 main。不向上游发布、不部署、不改账号/凭据。

## 当前结果
blocked：实际可读隔离未证实，GPU/图像查看通路未核，RUN-ENV 实值未冻结。仅 bug 预检已 accepted；没有启动任何模型。
