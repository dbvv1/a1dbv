# Rulesync 共享权限生成：花括号会收掉无关 allow

读者任务：团队向多个 Agent 分发相同权限时，检查生成是否仍保留原本需要的窄命令，而不是把 exit 0 当配置等价。

2026-11-14 实跑 npm `rulesync@43.8.2`，Node 24.22.1，隔离 HOME 和项目目录；仅执行生成器，未加载输出为本会话权限，未执行配置中的命令，未调用模型或客户端。源项目 MIT。

## 实际结果

`probe.py` 用七组输入分别生成 Claude Code 与 Factory Droid 配置。七次均 exit 0。

| bash 限制 | Factory git status allow | Claude git status allow |
|---|---|---|
| `rm -rf build` ask | 保留 | 保留 |
| `rm -rf ${OUT}` ask | 保留 | 保留 |
| `rm -rf ${OUT}` deny | 保留 | 保留 |
| `rm -rf build` deny | 保留 | 保留 |
| `rm -rf {build,dist}` ask | **未写入，整个 Factory 文件未生成** | 保留 |
| 同一花括号 ask，已有仅含该 allow 的 Factory 文件 | **原文件改写为 `{}`** | 保留 |
| 分成 `rm -rf build` 与 `rm -rf dist` 两条 ask | 保留 | 保留 |

Factory 的生成器会警告因其他限制而丢弃 git status 的 allow，见 `withheld-warning.txt`。Claude 输出保留 ask 与 allow。这验证的是输出差异，不证明任一客户端实际会如何匹配或询问。

有限、已知目录可将生成源的花括号集合展开为具体条目并再次检查输出；不要为了恢复自动批准删除限制或把权限放宽。动态变量不可凭猜测展开。Factory 没有生成显式 ask，仍依靠客户端自身默认，必须另验客户端有效配置与行为。

## 复跑

在独立工作目录从 npm 安装固定版本（不要把生成结果放入正在工作的 Agent 配置目录），然后：

```sh
python3 probe.py <rulesync安装目录>/dist/cli/index.js > results.json
```

脚本每次新建临时项目；既有文件用例先写入仅含 `commandAllowlist: ["git status"]` 的合成 Factory 文件。断言新目录的 Factory 文件确实缺席、既有文件变成空对象，以及七次退出成功、Factory 的上述 allow 差异，以及 Claude 七份输出均保留该 allow。独审指出初版只断言空 allow、未区分文件缺席；本版新增两种文件状态的明确断言并复跑通过。各目标配置会留在临时项目供读回。输入使用合成目录与普通命令文本。

## 版本边界

真实用户 [#3842](https://github.com/dyoshikawa/rulesync/issues/3842) 描述最新源码对任何 `{` 都扩大重叠判断。固定 main [`dd5d8dfbffb263e58926e8d1a88b15db1eb19cd2`](https://github.com/dyoshikawa/rulesync/blob/dd5d8dfbffb263e58926e8d1a88b15db1eb19cd2/src/features/permissions/shell-command-categories.ts) 已是该逻辑，但 npm 43.8.2 bundle 仍只扩大含逗号的花括号。这解释了稳定包的 `${OUT}` 用例未复现，不把源码行为冒充已发布行为。

本次 main 的 tsx CLI 在建立 IPC 管道时遇到 `listen EPERM`，未进入生成，停止该入口。没有改系统权限或用另一个入口重跑被拒步骤。main 的变量行为仅静态确认，未实际验收。

来源是原始 issue、固定源码及实际 npm CLI；这是定向消费者验证，未完成广泛生态/社区选型。未修改答案页状态、默认或模板；还欠独立读者及真实客户端验收。
