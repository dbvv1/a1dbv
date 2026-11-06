# B-PIPE-AUDIO-AUDITION-PACK-20261106 · 汇成两案候选试听批次
id: B-PIPE-AUDIO-AUDITION-PACK-20261106
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bbb068cbdc97617856763414ace1d9d828b9c9d9
result_branch: relay/b-pipe-audio-audition-pack-20261106

工作线：制作链。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
把已接收但未听的MOBA与FPS八段提示源准备成一次可审的试听批次，减少用户寻找文件的工作；不重制声音或接入游戏。

## 按哪个 Skill／规格
按 game-content-production §5；固定MOBA-Like@0b3d85d47b184ac48450e0a9d039fd3e0143c273 的 asset-pipeline/ui-event-audio/ 与 FPS-Like@ecb53c7464e4ccb8daba4353b94fc5bc9b8ef94a 的 asset-pipeline/match-cues/；只取原八WAV、recipe、manifest与许可。
1. 在本卡artifact目录生成 manifest.json 和 audition.html：标签固定 purchase-ok、purchase-denied、level-up、respawn-ready、weapon-switch、menu-confirm、round-win、round-loss，每项显示源commit/相对路径/完整SHA-256/时长/采样率/PCM位深/许可。
2. 只复制已许可八WAV原字节，保原许可与署名；不做增益归一、混音、合成、转码、重采样或把不同案音色排成盲评分。HTML只用本地相对audio controls，禁止自动播放/远程脚本/网络请求。
3. 给一页判断项：四声语义能否分、是否尖锐疲劳、相同设备音量下是否差距过大。明确尚无真实交战叠播录音，遮敌枪声/事件同步不能从单片判断。
4. Python标准库wave核格式/首末采样与manifest，不开声卡/GUI/浏览器，不安装，不引入Star素材。
5. 原八文件若已存在同目的公开批次，复用并只补缺元数据；别重复生成一批同名声音。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/B-PIPE-AUDIO-AUDITION-PACK-20261106/ 的八原WAV、许可、manifest、HTML、README及验证脚本/测试；原两案例与声音源只读。

## 怎样算做成
八原字节及元数据可复核，HTML无自动播放和外部依赖，缺文件/错误格式明确失败；非作者核源与许可，不声称已听/已混音/已采用。用户择时试听，产品仍不自动接线。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果
- 规格已定，待接收端在确认同单元无活跃调用且有空槽后认领；本次未发起模型、桌面或产品运行。
