# Wizard 自己读回正确，应用读取却变了

**🧪 Matt Pocock 的 wizard 原模板将公开占位值 `a'b` 写成 shell 拼接语法；向导当前变量和再次按 Enter 保留的值都正确，Bun、Node dotenv 的实际读值却不同。** 手工双引号文件最初能被三个消费者正确读取，再经原向导读回并写入后又失配。成功提示和自身回读没有发现这次下游解析差异。

问题来自真实使用者的 [#1345](https://github.com/mattpocock/skills/issues/1345)，不是另造配置业务。公开输入只有报告中的 `a'b`，另加正常值 `ab` 和该值的手工双引号机制对照；没有使用真实密码、token 或私人项目。

## 原函数与消费者的实际结果

本轮固定于 `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`，模板与报告所述 `a496f55` 的文件字节完全相同。只加载原文件 `STAGES` 前的逐字前缀，实际调用 `write_env`、`_existing`、`ask_secret`；没有修改库函数，也没有执行完整示例的浏览器或 GitHub 写操作。

使用 Bun **1.4.4**（revision `38afee6c8`）、Node **24.22.1**、dotenv **18.0.9**、Bash **5.2.37**。每个消费者都在独立进程读取对应目录的 `.env`：Bun 的自动加载、dotenv 的 `config()` 和 Node 的 `--env-file`，没有模拟解析器。表内结果统一采用 JSON 字符串表示，双反斜杠表示实际一个反斜杠。

| 文件来源／阶段 | 向导内值或再次保留值 | Bun | dotenv | Node 原生 |
|---|---|---|---|---|
| 原模板写入 `ab`，重写前后 | `"ab"` | `"ab"` | `"ab"` | `"ab"` |
| 原模板写入 `a'b`，重写前后 | `"a'b"` | `"a"` | `"a'\\''b"` | `"a"` |
| 手工双引号文件，重写前 | `"a'b"`（下一轮读回） | `"a'b"` | `"a'b"` | `"a'b"` |
| 同一对照经原向导读回、再写入后 | `"a'b"` | `"a"` | `"a'\\''b"` | `"a"` |

“再运行”是在新 Bash 进程调用原 `ask_secret`，以换行输入选择保留已有值，再调用原 `write_env`，不是完整交互式向导验收。三种条件共 **18 次消费者读取**，加版本、语法和函数调用共 **29 条命令，均 exit 0**；错误读值也成功退出。所有临时 `.env` 的最终模式为 0600，没有将其作为 shell 脚本 `source`／`eval`。

手工双引号条件只证明 `a'b` 这一个值的解析机制，**不是任意美元符号、反斜杠或换行的通用修复**。再次写入会重新产生失配，所以本记录没有把手工改文件推荐为持久修法。

## 可核验记录与范围

[results.json](results.json) 保留原 29 条命令的完整参数、工作目录、标准输入／输出、错误输出和退出码，以及三条件的写前／写后文件、向导值、消费者值、模式和源码哈希。公开投影仅将执行目录与 Node 路径替换为占位符，附原结果 SHA-256；包的版本、官方 npm 地址和 integrity 来自原安装锁文件。没有复制完整上游库或发布新的运行脚本。

执行为隔离 Linux 云工作区，子进程使用白名单环境，不继承测试键、Node 注入参数或用户 HOME。官方 npm 包仅安装到工作区，关闭安装脚本后直接运行 Bun 官方平台二进制。最初 npm 查询因默认缓存目录不存在失败，指定工作区缓存后完成准备；表内 29 条不是全部安装准备记录。报告未给 Bun 版本，本轮没有重建报告者完整 Claude 环境。

核实时上游 main 仍为上述提交，#1345 仍 open／ready-for-agent；已有 [#1265](https://github.com/mattpocock/skills/pull/1265) 处理另一个 Bash 3.2 回读问题，未作为本轮修法。维护者已给出 triage brief，贡献规范只允许 collaborators 提 PR；没有重复投稿或执行修复 PR。

本记录只接收原函数与真实配置解析器的云端证据：未运行完整向导、真实认证、模型、macOS Bash 3.2、Windows或第二名本机读者；不增加操作指南、安装默认或答案页验收。

**依据与核实**：[使用者报告及维护者说明](https://github.com/mattpocock/skills/issues/1345)、[固定模板](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/wizard/template.sh)、[原 Skill 边界](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/wizard/SKILL.md)、[贡献规范](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/CONTRIBUTING.md)、[Bun 环境变量](https://bun.sh/docs/runtime/environment-variables)、[dotenv 原仓库](https://github.com/motdotla/dotenv)，以及本仓原函数和消费者实跑。实跑／核实 **2026-10-31 UTC**；独立只读审查不算产品重跑或本机 reader。
