# A-MODEL-EFFORT-READER-20261029 · 真实配置兼容修复
id: A-MODEL-EFFORT-READER-20261029
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 90de4948d79a4fca8c7238dd2487b599f458c903
result_branch: relay/a-model-effort-reader-20261029
page: docs/decisions/model-roles.md@dot-a/model-effort-reader-dispatch-20261029

## 目标与输入

由未读过模型页、作者自测或其他 reader 结果的新上下文，照所附页面完成 [jrnl #1908](https://github.com/jrnl-org/jrnl/issues/1908)：现代版本的 JSON 风格 YAML 配置不再误触发 1.x 升级提示，同时正确识别真正旧版，保留无 version 配置的原回退行为。这是未修复的真实 issue，不是模型对照或旧题重跑。

先读页面，再自行选择可用配置和实施路径。只读所附模型页、页内原始来源、该 issue 及[维护者验收](https://github.com/jrnl-org/jrnl/issues/1908#issuecomment-2308525868)、目标项目的贡献规范、源码与测试；不读 a1dbv 的其他任务记录、读者结果或作者解法。

沿当前已配置、允许处理公开代码的执行入口；不要为实验额外启动 Codex、换账号、改全局模型配置或开收费服务。实际模型 ID 与 effort 从本次可见信息确认，不把 Claude 客户端名当后端；不可核就记未知，不要求试遍页中模型。

## 独占写入与安全

目标仓只改 `jrnl/upgrade.py`、确有必要的 `jrnl/config.py`、相关 `tests/**`，以及 `docs/reader-tests/A-MODEL-EFFORT-READER-20261029.md`。不改依赖声明、其他功能或模型页；不触碰现有 DayOne 分支，不向上游推送、发 PR 或评论，不合入默认分支。

按项目 `CLAUDE.md` 使用测试 fixture／tmp_path；不得接触真实配置、journal、密钥环或账号用量。若必须独立复现，导入 jrnl 前隔离 HOME、XDG 配置／数据／缓存目录，并显式指定合成配置路径。仅官方或知名仓库的依赖装入任务隔离环境；遇平台拒绝保留错误，不换入口绕过。

## 验收与回传

1. 重放 issue 的真实 CLI 触发路径，新增回归在原生产代码失败、修后通过；覆盖现代 version、真正旧版、无 version 和原有非 JSON 配置，保留已有错误处理。
2. 按项目原检查运行相关 unit／BDD 与 lint，再尝试原测试入口；记录准确命令、版本、退出码、通过／失败／未运行范围，失败要区分原有问题与本补丁引入，不能以缩小范围宣称全套通过。
3. 另由非读者按原目标复核 diff、实际输出、回归有效性和漏项；修复后的行为可接收不等于模型选择优于其他档位。

结果文档写原目标、实际采用／拒绝的页面建议、具体卡点与页外帮助、验收证据、纠正轮次，以及实现／审查／返工的实际模型、effort、等待和费用边界。没有可核单任务账单或完整计时就分别写未知，不编 token 或费用；页面是否可独立照做与代码是否通过分开判断。

原日志留任务仓外至接收结束，回传只含脱敏摘要，不提交私人路径、会话或用量日志。仅由接收端按既有流程公开扫描并推本任务结果分支，回 `review_ready`，不用 `accept: auto`；若输入或权限不足，回 `blocked` 和精确恢复条件。共享最多四并行、无 GPU，单元通常 60–90 分钟、最多两小时，不重复派发。

## 当前结果
已准备排队，尚无领取或执行证据；页面分支核对为 `a666f3fc0507affa26dfbe50da767eb28ad4137a`。接收端领取时记录实际页面提交；若与上列核对值不同，先回输入卡点、不静默换版。按共享最多四任务、最多一 GPU 调度，本任务不用 GPU；同题旧调用未明先核状态，不重复执行。
