# B-CORE-YARN-CHOICE-HANDOFF-20261106 · 确定异步对白选择交接
id: B-CORE-YARN-CHOICE-HANDOFF-20261106
owner: dot-B
kind: explore
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bbb068cbdc97617856763414ace1d9d828b9c9d9
result_branch: relay/b-core-yarn-choice-handoff-20261106

工作线：核心模块。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
补已有 Yarn 真VM同步选项之后明确未验的异步点击交接，给 Unity 接入者可落地的接口和测试输入，不再重复 lineID 与 Option.ID 常识。

## 按哪个 Skill／规格
按 game-module-from-case §2，固定两源：YarnSpinnerTool/YarnSpinner@5b3a4ff2d24e4f727e3f90fee5d8ce637474c305 的 Dialogue/VirtualMachine；YarnSpinnerTool/YarnSpinner-Unity@bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d 的 DialogueRunner、OptionsPresenter、OptionItem。先读 experiments/yarn-localization-production/README.md 的真实11组结果与未验项。
1. 只对照选项组呈现→语言切换/重排→一次点击→VM消费→下一组：谁拥有本组选项、等待状态/取消入口、按钮与可用性检查。固定源码行引用，不用最新版补不存在API。
2. 精确回答旧组延迟点击、新组复用同数值ID、关闭对白后回调、双击、翻译异步晚到、没有可用项六场景。区分框架现成保证与项目必须保的generation/cancellation契约。
3. 给最小接口草案及六个可执行输入/期望；优先沿官方Presenter与CancellationToken，不另造VM或复制框架。
4. 只读公开源码与已入库实验；不运行Unity/.NET、不安装包、不把读码当原生验证。源码/许可不可得写未知，不补想象结论。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/B-CORE-YARN-CHOICE-HANDOFF-20261106/sources.md；模块正文、现有实验、引擎工程只读。

## 怎样算做成
六场景责任表、真实调用顺序、固定行链接与下一接入的精确断言；非作者逐条核源码。只接接口依据，不提高模块成熟度。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果
- 规格已定，待接收端在确认同单元无活跃调用且有空槽后认领；本次未发起模型、桌面或产品运行。
