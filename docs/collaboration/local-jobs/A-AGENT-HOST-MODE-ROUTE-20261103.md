# A-AGENT-HOST-MODE-ROUTE-20261103 · Agent shell 独有失败先查被测 CLI 模式
id: A-AGENT-HOST-MODE-ROUTE-20261103
owner: dot-A
status: running
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6570693e880bf629b1fbb511f98080b99575455d
result_branch: relay/a-agent-host-mode-route-20261103

## 目标
补 17 排错页的真实分支：同一 clean main 在 coding agent shell 的确认提示测试失败、普通 CI 却绿时，怎样先核宿主标识是否让被测 CLI 换模式，避免无效 bisect 或修改业务逻辑。只提炼已核真实故障的诊断路线，不声称本仓当前正受此缺陷影响。
现页 17 §1／§2.8 只给一般“查验证环境”；15 的 Vitest 实例处理复用 worker 的跨测试残留，不是程序启动前外部宿主标识改变模式。两者不重复；本卡不扩成全环境诊断或新测试框架。

## 按哪个 Skill 与规格做
读最新 AGENTS、CLAUDE、TASKS、手册§7、operations§2.2 与 local-jobs README；fetch main／负责人分支，核本原子题与写域。按 write-task-guide 从该真实症状给最小第一步、分支、失败保全与不适用条件，不编第二个故障。
固定本仓输入为 base_ref 的 docs/17-troubleshooting.md §1／§2.8 与 docs/15-task-playbooks.md 的 vitest-reused-worker-env 段；原实例／历史日期保持。只给 17 一处症状行与 §2.8 最小增补稿，15 仅作去重对照，不两页复制同一长段。
真实来源：https://github.com/grafana/gcx/pull/1079 ，修复固定435c1d682c8d414118d69423cb560f878543f57a。作者报告 agent shell 下 clean main 同失败、CI 绿、曾浪费 bisect，钉测试模式后原四包通过；准确标作者自报，非本轮复跑或节时测量。人工 APPROVED：https://github.com/grafana/gcx/pull/1079#pullrequestreview-4866849123 ，不当独立效果复验。
当前机制固定 grafana/gcx@dd4856a65158a65b0be0c988b83a3f57f610f975：mise.toml L33–50、internal/agent/agent.go L68–95、internal/agent/agent_test.go L110–138；必要时只读同 SHA internal/providers/confirm.go L19–46 和 scripts/generate-cli-reference.sh L23–30。不安装、不执行 gcx、Go／mise、测试、生成脚本或目标示例。
逐固定原文区分：两个叶子任务钉 GCX_AGENT_MODE=false，父任务 depends 不传播 env 是该仓／该任务说明，不泛化所有 runner；模式 init 缓存，测试清检测输入后通过已有 ResetForTesting 重读，不能建议中途删一个键就保证恢复。当前检测名单与8月历史五项不同，引用唯一清单，不复制过时名单。
给可供未来读者执行的短路线：先固定同一基线、命令与失败阶段；确认目标源码确实读取哪些非秘密行为标识；只对照相关键的存在／受控合成值，不导出全环境；区分测试预期人工交互与真实 agent 拒绝分支；固定模式须在隔离无真实副作用的测试启动前或项目已有 reset 入口内。
保双向验收：目标人工确认测试不受宿主污染，同时 agent 模式应拒绝的破坏性操作仍拒绝；修后回原消费者与反向控制，不以 CI 绿或文稿审过代替。生成参考的配置来源可作为同机制补充，不扩采遥测／session 信息。
不在用户 shell 全局关闭 agent 模式，不建议加 --force／GCX_AUTO_APPROVE 求绿，不删安全断言、不关闭沙箱。若目标不读取宿主标识、测试已隔离，或故障实际是依赖／网络／资源／OS，明确退出本分支，沿现有入口定位，不凭相似症状断言根因。
只读公开官方源码、指定 PR／评审与固定本仓文件；不读用户环境变量、配置、凭据、私人会话或日志，不启动模型、上游软件或联网服务，不修改运行环境、权限、接收器或长期规则。

## 写入范围
只写 docs/collaboration/local-jobs/artifacts/A-AGENT-HOST-MODE-ROUTE-20261103/proposal.md；接收端只另更新本卡状态和当前结果。
先交 17 对应位置可采用的最小候选，再给原句→固定源码／作者反馈→新增分支与失败保全；引用按未来正文落点核路径。来源、作者报告、源码可推行为、本轮未运行分列，不复制完整 PR 或原始日志。
不改 17／15／13／研究页、地图、模板、源码、测试、其他卡、旧产物或 TASKS；旧页面写者退出未知仍隔离，不能借 artifact 建可启用替代页。后续正文采用另核具体归属。

## 怎样算做成
非作者逐固定来源核三问：①同基线只在 agent shell 失败，第一步怎样区分模式差异与业务回归？②如何隔离人工测试而保 agent 拒绝契约？③缓存初始化／叶子任务环境使哪种“删键／父任务设值”修法不可靠？答案能从短稿直接找到，且不要求读取整个用户环境或运行真实破坏性命令。
核没有把已有上游修复当新待修代码、人工批准当独立复跑、操作建议当本仓实测或自然读者通过。不存在该模式差异的项目能明确不采用；当前正文默认、原日期与 Vitest 机制不被覆盖。
本单元只交有据操作稿，不新实验、不升级地图／评级；完成即回 review_ready。按手册§7做非作者来源／实际diff审查、check_repo、check_public、diff空白与身份检查，只推 result_branch，不用accept:auto、不合main。
通常45–75分钟，最多两小时；由原接收端按共享最多4并行调度，不另起调用。遇同题在制、原写者未知或明确拒绝停对应动作并记录具体缺项，不换入口／身份。
