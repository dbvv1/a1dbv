# B-FPS-PREVIEW-CLEANUP-001 · 取消后收回 FPS 自有预览进程
id: B-FPS-PREVIEW-CLEANUP-001
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 4a3f610b4670522d54de9d0ba80278dbb5a9a615
result_branch: relay/b-fps-preview-cleanup-001

## 目标
由既有 local-jobs 接收端独立后台收尾：重新核实并结束 B-FPS-SHOT-QUALITY-001 原预览链的残留，不恢复游戏验证、不升级原只读诊断。源报告在 2026-10-27 14:30 UTC 记录两条 11:57:11–11:57:23 UTC 启动的链，共 11 个进程；vite PID 12652／55064 分别监听 4173／4174。这只是定位线索，不是当前归属或清理通过证明。

## 按哪个规格
按 [operations§2.2](../operations.md#22-本地模型协作)、[入口的安全取消约定](README.md)与[固定源报告](https://github.com/dbvv1/a1dbv/blob/1ff1630ebe60107768d1886e099ef8563df9a696/docs/collaboration/local-jobs/artifacts/B-GPU-JOB-STATUS-001/status.md)执行；源报告审查未通过，遗漏及未来行为表述不作为授权或验收依据。
- 先用原任务登记的 PID、启动 UTC、父子关联及任务归属逐一重核，防 PID 复用；仅结束仍存在且可证明属于上述两链的进程，优先用既有回收入口。不得按 node／bash／cmd 名称批量终止，也不得扩大到关联未证实的进程树。归属、权限或安全终止方式不明就跳过并报告，不扩权、不请别端绕过。
- 全程后台，不打开浏览器／GUI、不控制键鼠、不重启预览或游戏取证；不关闭 Edge、其他浏览器、用户工作终端或其他任务。11:33:20 UTC 起的未知归属 Edge 保持不动，四张 cancelled 游戏卡与原只读诊断保持原状。
- 原工作树、未提交改动及所有 ignored 素材、截图、录像原样保留；不 reset／clean、不重建原工作树、不删任何文件。只读必要非敏感执行元数据，不读模型会话正文、配置秘密或用户私人文件，不回传完整命令行、用户路径及原始日志。

## 写入范围
仅 `docs/collaboration/local-jobs/artifacts/B-FPS-PREVIEW-CLEANUP-001/status.md`，接收端另回写本卡结果；不改接收端脚本、计划任务、原四卡、原诊断或其他文件。

## 怎样算做成
按实际处理 UTC 分列已退出、仍存活、未知／跳过的对象及必要归属依据；用进程与端口所属信息复核两条原链退出、4173／4174 由这些 PID 持有的监听消失，不通过浏览器或 HTTP 访问。端口若已归别人只报告，不停止。说明原产物保留情况、未明 Edge 未触碰；有缺口就精确报部分完成或 blocked，不声称整台电脑资源已清空。结果推固定分支并回 `review_ready`，通过公开扫描及适用文档检查后交负责人审查。

## 当前结果

- 按 PID、启动 UTC 与父子链逐一复核后终止 B-FPS-SHOT-QUALITY-001 的两条预览链，11 个进程全部退出，4173/4174 回环监听消失且未被接管，原工作树与 ignored 素材未动，openIssues 为空；本单为 build 型，无 reader-test 的 taskDone/pageStuck 项。
- 产物：[a972bb5](https://github.com/dbvv1/a1dbv/commit/a972bb5f828a5e0af0c48b36714d41ca509185c0)，分支 `relay/b-fps-preview-cleanup-001`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：接收端回写本卡结果并推送固定分支 relay/b-fps-preview-cleanup-001，转 review_ready 交负责人审查。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
