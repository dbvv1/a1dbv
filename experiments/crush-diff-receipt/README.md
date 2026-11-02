# Crush：编辑摘要显示“0 删行”，仍要回到实际差异验收

**🧪 接收 Agent 的多文件修改时，用实际前后文件与项目消费者验收，不用工具回执里的增删总数决定是否审查。** Crush 的既有候选修正了本次三种特殊行的漏计；两版的文件修改、错误后续改和持久历史本来就都成功，不能把计数修复宣传成代码写入或恢复能力提升。

## 接收的真实输入

已有 [#4215](https://github.com/charmbracelet/crush/pull/4215)报告：统一 diff 内删除 `--` 开头的行会显示为 `---`，增加 `++i` 会显示为 `+++i`。原计数器把这些正文误当成文件头；候选只在首个 `@@` hunk 之前忽略头部，diff 本身和编辑逻辑不变。

项目观察时约 2.89 万 Star，但固定版许可为 **FSL-1.1-MIT，MIT Future License**，不是当前无条件 MIT。此次只在独立云目录作合成内部研究，公开自己的结果，不分发上游源码或二进制；选作商业产品组件要另外核用途限制。未另写重复修复或对外投稿。

## 两版走完同一个工具消费任务

固定基线 `d391cee20d1942794aec5ea6faff07170444211f`，既有候选 `49aad8b7748c2bdfae1459897a7d7ed15fe6249e`。非实现者编译 wrapper，直接调用原 `NewViewTool`、`NewEditTool`、`NewWriteTool`、`NewMultiEditTool` 与 `fantasy.AgentTool.Run`；连接真实 SQLite、history 和 filetracker，没有替身，也不直接调用 diff helper。

先用原 View 读三个合成文件，再修改并核回执与落盘内容：

| 实际操作 | 独立前后行差（增／删） | 基线回执 | 候选回执 |
|---|---:|---:|---:|
| Edit 删除 SQL 的 `--` 注释 | 0／1 | 0／0，漏计 | 0／1 |
| Write 去掉 YAML 首行 `---` | 0／1 | 0／0，漏计 | 0／1 |
| MultiEdit 把 JavaScript 的 `i += 0` 改为行首 `++i` | 1／1 | 0／1，漏计 | 1／1 |
| 错误调用后再把 `++i` 改成 `i += 2` | 1／1 | 1／1 | 1／1 |

独立计数使用 Python `difflib.ndiff` 对照完整前后文件，不复用产品的 unified diff 计数器。表中是**每次操作**的差量，不是会话最终净差量；恢复或反向修改会抵消，不能相加冒充 session 文件摘要。

两版均完成以下验收：

- 真正的 Node 子进程加载修改后模块，先读回 `1`，后续普通修改后读回 `2`。
- 独立 SQLite 执行实际 SQL 文件得到 `42`；PyYAML 解析实际配置得到 `value: 42`。
- 中间插入一次不存在旧文本的 edit，收到真实错误，文件及完整历史记录均不变；随后正常修改成功。
- 产品显式关闭数据库并退出后，另一 Python 进程只读重开 SQLite：`integrity_check=ok`，3 条读记录、10 个历史版本，包含原始／中间／最终内容。原逻辑保存的重复初始版本保留，不把“10”当成十次有效修改。

这条消费说明**文件正确和摘要准确要分开核**。代码能运行，不会自动证明回执完整；回执数字修对，也没有新增业务功能或恢复保证。

## 权限与未覆盖范围

使用原 Normal 权限服务、空 allowedTools，每次实际请求先匹配本次合成 session、call ID、工具和精确文件路径，再调用一次 `Grant`；每臂 4 次，没有持久授权。请求的 action／修改前后内容在运行后独立核对，8 份均对应原输入与实际文件；不把这个事后核查写成授权前的内容检查。Normal 也不是操作系统路径沙箱。

运行环境只给自有 HOME、配置和临时目录，无凭据、真实会话或账号；nil LSP 是原工具显式支持的分支。未运行完整 CLI／TUI、模型、LSP、Hook 或会话净 diff 界面。PR 描述提到的原生 rewind 路径在固定树中已不存在；本次只验普通关闭后持久化，**未验原生回退、恢复或崩溃恢复**。现有工具默认与读者状态不变。

## 检查、保全与可用程度

Linux amd64、官方 Go 1.27.3、Node 24.22.1、PyYAML 6.0.3；按项目配置关闭 CGO、使用 greenteagc。两版完整 CLI 构建及 wrapper 构建通过；候选 diff 的 4 个原案例通过，diff 与 tools 包 `go vet` 通过。基线 diff 包是 **0 测试**，本地全仓测试未运行。

首次依赖下载因试验白名单漏传平台既有代理变量，直接 DNS 不可达；原失败保留，恢复继承既有传输配置后完成，没有权限拒绝或更换代理。产品运行不带这些联网配置，消费者未重跑。

固定候选 head 的 2 个 check 成功，但 build／lint／security 三个工作流均为 `action_required`，提交状态仍 pending。不能写成托管功能检查通过或已合入。两臂真实工具消费分别于 UTC 11:56:35.687–35.796、11:56:38.412–38.504 完成；独立产物验收于 11:57:27 完成。

原输入、回执、权限请求、数据库、源码对象和恢复校验已保全在云端，未公开上传；可重建的依赖缓存与二进制未装入归档。公开投影与精确哈希见 [results.json](results.json)。

**依据与核实**：[既有问题与修复 #4215](https://github.com/charmbracelet/crush/pull/4215)、[固定候选计数器](https://github.com/charmbracelet/crush/blob/49aad8b7748c2bdfae1459897a7d7ed15fe6249e/internal/diff/diff.go)、[原 Edit 入口](https://github.com/charmbracelet/crush/blob/d391cee20d1942794aec5ea6faff07170444211f/internal/agent/tools/edit.go)、[现行许可](https://github.com/charmbracelet/crush/blob/d391cee20d1942794aec5ea6faff07170444211f/LICENSE.md)，核实 2026-11-02。报告来源是下游 fork 的实际反馈；上述双版本消费者只支持本次摘要选择，不是工具整体或模型收益比较。
