# 静态指令检查：先看它在你的仓库报什么

**⛔ 暂不把 agents-md-lint 0.1.0 加入本仓默认 CI。** 本次实际检查根 AGENTS.md／CLAUDE.md 的 26 个引用，4 条报警全部是合法示例误报，没有发现新的失效入口。
可借用的是小样本验收：只选真实生效的指令文件，核每条报警和实际检查数量，再决定是否长期使用。不要为消报警改正确说明或放宽阈值。

## 这次真正跑了什么

固定工具 `9f852cf5b970cd9f283a61ef4ae6308cb4aeb047`（MIT、Python ≥3.11、零运行依赖），在隔离环境安装；消费方为 a1dbv `01375e508f3b4a5fb5564aa9c6bf91a83f606302`。只选根两份指令，不扫描供别人复制的模板。Linux／Python 3.12.14，工具自带 48 项测试通过。

| 输入 | 工具结果 | 人工核对 |
|---|---|---|
| 根 AGENTS.md | 6 引用，0 报警，exit 0 | 未发现失效引用；不代表该文件全部内容已覆盖 |
| 根 CLAUDE.md | 20 引用，4 报警，exit 1 | 一项内嵌 `<领域>` 占位目录、三项没有协议头的公开 API 示例，被当作本仓路径 |
| 明确不存在的文件名（合成缺输入探针） | 没有报告数据，stderr 提示未找到指令文件，但 exit 0 | 仅看退出码会把“没有检查”错当通过 |

既有 `check_repo.py` 检查 582 文件、0 错误。两者对象不同：现有脚本查 Markdown 链接，候选另查反引号路径与 shell fence 的可执行程序；本次没有发现候选补出的真实缺陷。原始发现值、退出码及人工分类见 [results.json](results.json)；仅将绝对路径归一化，未修改待检指令。

## 在自己的真实任务里先试两份

前提：Python ≥3.11、Git、`uv`，首次安装需要网络；uv 缓存与工具目录必须可写。从待检查仓库根目录运行。下面会下载固定公开源码并构建到 uv 的隔离环境，不执行指令文件里的命令；只检查你实际维护且存在的文件，没有 CLAUDE.md 就跳过第二条。

```sh
uv tool run --from 'agents-md-lint @ git+https://github.com/openintelligence-labs/agents-md-lint.git@9f852cf5b970cd9f283a61ef4ae6308cb4aeb047' agents-md-lint check AGENTS.md
uv tool run --from 'agents-md-lint @ git+https://github.com/openintelligence-labs/agents-md-lint.git@9f852cf5b970cd9f283a61ef4ae6308cb4aeb047' agents-md-lint check CLAUDE.md
```

先核输出确实对应目标文件且检查了引用，再把报警分为真实失效、缺依赖、合法示例和解析误判。只有发现现有检查漏掉的真实问题、修后重验有效，才考虑让它进入本项目门禁；本仓这轮不满足。要留机器可读结果，加 `--json`，但缺输入时仍可能没有 JSON，不能只依赖 exit 0。

**命令能解析不等于能运行。** 该版本只看 shell fence 每行首个命令的可执行程序，后续管道、参数和执行结果不在检查范围；正常路径与首词检查也不能证明 Agent 启动加载或遵守。已有项目检查和真实命令试跑继续保留。

## 来源与复现边界

[工具固定源码与安装说明](https://github.com/openintelligence-labs/agents-md-lint/tree/9f852cf5b970cd9f283a61ef4ae6308cb4aeb047)、[缺输入返回 0](https://github.com/openintelligence-labs/agents-md-lint/blob/9f852cf5b970cd9f283a61ef4ae6308cb4aeb047/src/agents_md_lint/cli.py#L50-L55)、[路径提取](https://github.com/openintelligence-labs/agents-md-lint/blob/9f852cf5b970cd9f283a61ef4ae6308cb4aeb047/src/agents_md_lint/refs.py#L38-L117)、[实际消费文件](https://github.com/dbvv1/a1dbv/blob/01375e508f3b4a5fb5564aa9c6bf91a83f606302/CLAUDE.md)。核实与试用 2026-10-31；未调用模型、未测效率收益，也未评价整个候选目录。
