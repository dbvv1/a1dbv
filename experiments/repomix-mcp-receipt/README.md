# 接收测试迁移：另外走真实 stdio 文件链

**🧪 接回大量模块 mock 改成依赖注入的 PR 时，保留项目测试，再从默认生产入口完成一次真实消费者任务。** 本轮接收 Repomix 维护者已有的 [#1988](https://github.com/yamadashy/repomix/pull/1988)：两版实际 stdio 打包、读搜、错误后恢复和退出行为在本例中一致；本云完整测试仍有 1 项失败，因此只接收这条文件链的行为保留证据。

这项迁移按项目已有 `deps` 约定改了 24 个文件，其中 10 个生产文件增加可选末尾参数，默认仍取真实实现。package、锁文件和协议 schema 未改；它是**测试替身迁移，不是 MCP SDK／协议升级**。基线为 `fe02ab76…`，候选为 `0415873b…`，没有另写或外发上游补丁。

## 从这个接收单元复用什么

沿[长程路线](../../docs/decisions/long-tasks.md#交出去什么收到后核什么)先固定产物，再验两个不同层次：

1. **核原差量与项目门禁。** 读默认调用链、依赖和变更后的断言；运行项目的 build、完整 test、lint。替身从模块 mock 搬到 `deps` 后，仍可把文件系统、CLI 或扫描器替换掉；单元测试负责的契约与真实装配分开核。
2. **让真实客户端调用真实进程。** 本例使用官方客户端 2.4.0，分别启动两版未注入依赖的 `node bin/repomix.cjs --mcp`，在同一连接里做 `pack_codebase → outputId → read_repomix_output → grep_repomix_output`。registry 在进程内，不能为每个工具另起进程再要求旧 ID 可用。
3. **比较实际文件与恢复行为。** 核包内确切路径和全文、读搜结果、源文件 hash；给未知 ID／缺路径后，再读原有效 ID。软件自身 sandbox 模式用自建根外 sentinel 做拒绝对照；普通模式核 attach 后文件变化是否仍触发重新扫描。只用本任务可公开的合成输入，不指向用户资料或真实凭据。
4. **接收终态，保留失败。** 结束客户端 stdin 后记录服务端退出码与信号。成功 pack 的临时输出要供后续 read／grep 使用，其存在不能直接判为清理失败；中途取消的清理需另一份真实证据。本轮只核正常 EOF 退出，没有用强杀替代。

这是已执行接收方法的提取，不要求其他项目安装 Repomix、替换测试框架或统一使用 DI。工具清单／schema 相同只验声明；具体任务仍须另验返回内容和保存不变量。

## 两版消费者实际做成了什么

非作者在独立目录写驱动，分别运行普通与 sandbox 模式。三份公开文本输入通过过滤只打包 JavaScript 与 Markdown 两份；负责人另外核驱动、协议输出和实际文件。

| 检查 | 本次实际观察 |
|---|---|
| 工具与 schema | 每种模式下，两版完整 tools 条目一致；普通 6 个工具，sandbox 5 个 |
| pack → read → grep | 两个精确路径和全文一致，ALPHA／BETA 各匹配一次；排除文件未入包 |
| 错误后恢复 | 未知 ID、缺路径返回工具错误，原有效 ID 在同一连接仍可读取 |
| sandbox 原生读取边界 | 真实目录／文件读取正确；自建 `../sentinel.txt` 被拒，无内容或具体工作区路径泄露；未注册 remote、attach、generate-skill |
| attach 后重新扫描 | 先读干净文件，再将其改为合成已知 token 形状；修正输入后，read 和 grep 都拒绝，未回显该串 |
| 文件与进程 | 三份源文件 hash 均保持；首轮和修正轮共 8 个服务端进程收到正常 EOF 后 exit 0，无信号或超时 |

**第一次扫描对照失败在输入形状。** JSON 序列化把换行写成字面 `\n`，合成 token 前紧邻字母 `n`，不满足已安装检测器的字母边界；两版都没有报错。改为空格分隔后才命中。原失败、原驱动和响应保留，产品源码未改；这也说明已知格式扫描会受文本形状影响，不能当完整保密保证。修正轮已在要求仅补受影响路径的消息到达前跑完，确实重复了四条连接；没有把重复次数当收益。

八次握手实际协商 **2025-11-25** 协议。最新协议时代、远端 fetch、Skill 生成／安装、中途取消、并发、symlink 变体、其他输出格式与原生客户端／其他 OS 消费者均未验。Linux、Node 24.22.1；两版独立构建，共用字节一致锁文件对应的依赖。

## 本地失败与候选 CI 分开报告

- 两版 build 通过；候选 lint（Biome、oxlint、TypeScript、secretlint）exit 0，无自动修正，保留既有 `no-new-array` warning。
- 候选完整套件：**1982 passed / 1 failed，158 文件**。未改基线只复核对应文件：**10 passed / 1 failed**，不是基线全套。
- 同一失败要求“仓库之外不继承父 `.gitignore`”。宿主祖先存在只读 `.git` 标记目录，Git 不认它是仓库，锁定 globby 的路径查找却按目录存在判根；对 globby 而言，夹具已被视作仓库内路径。未改宿主目录、删断言或扣掉失败后称全绿。
- 精确候选 `0415873b…` 的 GitHub 检查已全量回读：**52 success、2 skipped**，其中[核心 CI](https://github.com/yamadashy/repomix/actions/runs/41324552248)为 success；跳过项为 `claude` 与 `Memory Test (Full Analysis)`。PR 仍 open。托管结果不会把本云失败改成通过，也不是本轮独立执行了其 OS 矩阵。

[results.json](results.json) 给固定源码／锁身份、公共输入、每次实际工具参数与 UTC 时间、响应判定和摘要、文件 hash、进程终态、首次失败与 CI 列表。它是精选投影：绝对目录已归一，原假 key 不公开；完整源码、驱动和原始日志保全在本轮云端证据包。非作者源码审查与真实消费者、负责人文件读回均已完成；本仓默认和答案页新读者状态保持不变。

**依据与核实**：[维护者 PR](https://github.com/yamadashy/repomix/pull/1988)、固定版 [AGENTS 的依赖注入约定](https://github.com/yamadashy/repomix/blob/0415873b28abade93c4f18a7b785ab9b0f1b9d27/AGENTS.md#dependencies-and-testing)、[默认服务器装配](https://github.com/yamadashy/repomix/blob/0415873b28abade93c4f18a7b785ab9b0f1b9d27/src/mcp/mcpServer.ts)、上述精确 head CI 与本轮 Linux 实跑；核实 **2026-11-02 UTC**。
