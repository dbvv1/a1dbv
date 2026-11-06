# B-PIPE-ICON-LF-20261106 · 修图标导出的跨平台换行
id: B-PIPE-ICON-LF-20261106
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64
result_branch: relay/b-pipe-icon-lf-20261106

工作线：制作链。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
关闭已交回读者实测的实际缺陷：Windows Path.write_text 把 SVG 写成 CRLF，破坏同源重导出字节身份；本卡不重跑原读者，也不改图形。

## 按哪个 Skill／规格
按 game-content-production §4；先读 B-PIPE-ICON-BATCH-READER-20261104 的结果dcba386与 asset-pipeline/icons/{export.py,test_export.py,README.md}。这是原读者识别的独立修复，不是装备靴轮廓返工。
1. 在原导出器所有文本输出明确 UTF-8/LF，至少覆盖12 SVG；保留源、配方、主题、许可通知和实际渲染调用，禁止另写SVG导出器。
2. 先加可在当前OS运行的Windows换行反例：用真实TextIOWrapper newline参数模拟默认写入规则，原写法能产生CRLF，新显式LF输出与源themed().encode('utf-8')逐字节相同。不得只mock write_text后声称实际文件字节通过。
3. 两主题原始SVG输出相对固定消费者字节一致；修改dark accent后只dark六件改变，bright六件与盾许可完整保留。
4. 真实CairoSVG可用才跑原15项与完整PNG/preview导出；缺Cairo的事实沿原卡保留，不安装。可单独做不需Cairo的源文本回归，但不能stub出PNG来称渲染通过。
5. 不改 models/.blend、equipment-icons、quiet材料、recipe、入库PNG或音频；不重生成产品资源。

## 写入范围
仅 asset-pipeline/icons/{export.py,test_export.py,README.md}；新增纯文本换行测试允许单独 test_export_text.py，既有36运行图与源文件只读。

## 怎样算做成
原反例→显式LF修复的实际字节证据与非作者复核；可用原测试全部通过，缺渲染依赖逐项未运行。文档声明跨平台文本与PNG版本依赖的区别，不把字节修复计画质。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果
- 规格已定，待接收端在确认同单元无活跃调用且有空槽后认领；本次未发起模型、桌面或产品运行。
