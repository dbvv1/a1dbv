# B-THREE-CASE-QUALITY-CAPTURE-20261029 · 十机位固定基线
id: B-THREE-CASE-QUALITY-CAPTURE-20261029
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: d70fd59b59231d7eb7a0dce07d58580c7f9fcb09
result_branch: relay/b-three-case-quality-capture-20261029

## 目标
单个GPU任务串行取得三例10命名机位、每机位两次真实GPU原图和可追溯manifest，供dot制作目标图与双盲。通过只表示拍摄和收尾通过，不表示品质达标，不使用历史图补当前缺图。

## 按哪个规格
按game-taskbook§7、game-quality-pass，以及[受检工具包](../../../experiments/quality-capture-batch/README.md)；先核SHA256SUMS.json，再复制到私有执行目录。执行一次 `python run-batch.py private-receiver-config.json`；只用既有离线依赖、原成功full Chromium实际收据与固定文件，不造收据、不改安全flag、不先试默认shell。
首次launch前，原接收端核[B-SR-RACE-REVIEW-SMOKE-20261029](B-SR-RACE-REVIEW-SMOKE-20261029.md)的42f8404原调用真实结束、自有browser/preview退出链齐全；再fresh核[B-FPS-ART-OBSERVER-CAPTURE-20261029](B-FPS-ART-OBSERVER-CAPTURE-20261029.md)的723d910无活动调用/自有browserpreview资源，并确认无其他GPU任务。旧723已由当前abc三机位取代，不要求旧8图，但cancelled不是退出证明。
Git状态不是空闲证据；任一链未知则本卡blocked，保留准确缺项，等原任务安全恢复，不打断、不重派、不抢占、不清旧锁。全批MOBA→FPS→Star串行，失败停止后例，不另起配置重试。新批只复用既有依赖；真缺时回具体package/version/path与原错误，不把源码清单项数当实机缺包、不安装补齐。
固定源与tree（完整参数和源文件摘要见工具包batch-draft.json）：
- dbvv1/MOBA-Like：8ade2d1012370692de31f3883a85338171dbcab3；tree0726ec1cd61176d4dc1e9d5335485e8c801e9fdc。
- dbvv1/FPS-Like：abc139f6e2ba2b95b2fc0bc50c351aa3bd1d4be6；tree30e133c9ead1cf2fbae31828c5dd447f0174410c；当前5v5/art qualityCapture，非旧1v1。
- dbvv1/Star-Rush-Reborn：f1da86c551ee3ff8541912974823dca07a9509ad；tree31b1140dfa634f3263143b09af880bab74f69e40。
MOBA四机位gameplay/spawn/first-tower/spawn-to-tower：seed1,march,t10,baseline；FPS三机位gameplay/courtyard-gap/cross-lane：固定120ticks/t2；Star coast-chase/coast-full-bend：seed73121,road-tour,t28，academy-depth：seed95276,road-tour,t14。全部1280×720/DPR1，静帧frame0，每机位重复2次；禁止外部状态注入、键鼠与可见GUI。

## 写入范围
本卡只在a1dbv上述结果分支写 `experiments/quality-capture-batch/results/<runId>/manifest.json` 和三例真实结果链接，脱敏后提交；不改TASKS、队列schema或已有quality记分卡。
作为同一任务的明确结果映射，三授权案例各自从上述固定源建立 `relay/b-three-case-quality-capture-20261029` 结果分支，仅新增 `docs/quality/capture/<runId>/` 的PNG、逐帧元数据与脱敏manifest；不改runtime、默认分支、玩法、资产或网站。已有同名结果分支先核归属与runId，不覆盖或重跑。
私有执行目录保留完整日志／原成功收据／真实路径；公开结果删除私人路径、WebSocket地址、nonce、完整argv，不改renderer、状态或失败事实。保留原件SHA与公开件SHA对应，逐帧PNG不可重绘。发布由既有接收端按原流程公扫、noreply提交、快进结果分支；不得让模型自创推送通道。

## 怎样算做成
10机位各2张，source/tree与本次fresh构建、输入/状态/图像摘要、同机位重复比较、原始gpu分类齐全；Star含真实独立GPU证据匹配。原生renderer/software/unknown不得改名；任一非gpu或不一致即失败。
每个子Node真实exit、BrowserServer主进程exit0/null、自有preview closed/refused、精确owner租约释放均有回执；unknown不能写通过。批次总manifest逐例记录passed/failed/not_run、源tree、runId、结果commit与产物hash，总卡通过不能覆盖单例失败。
可回传失败前已完成的部分结果，但保留failed/not_run和恢复条件，后例不执行；不能复用同目录或另起重试。只有完整20张与全部证据通过才标review_ready；图片仍交dot作目标图和双盲，当前任务不作视觉提升或手感验收。

## 当前结果

- 修复了唯一阻塞 check_repo 的链接缺失（把 origin/main 已发布的同任务卡原样落地，blob 3a13927b，check_repo 554 文件 0 错误），审查无未关闭问题；但本批拍摄仍未开跑——B-SR 42f8404 原调用仍存活、GPU 被 Unity/nshm 占用、私有配置与成功收据缺失、FPS abc139f6 本机缺失，硬前置未过，未生成任何实图、manifest 或虚假通过记录。
- 产物：[3e32746](https://github.com/dbvv1/a1dbv/commit/3e327461dce9bdc5e10e17e5c5eb77bdf87cd243)，分支 `relay/b-three-case-quality-capture-20261029`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：待 SR 原调用真实结束且自有退出链齐全、无其他 GPU 任务、补齐 private-receiver-config.json/成功收据并让 FPS 固定提交 abc139f6 可见后，在原目录重试本单元拍摄
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
