# Nx 实际重构评审：项目受影响，不代表同名任务全部运行

🧪 **已用 Nx 的仓库，让 Agent 交付两份清单：受影响项目，以及实际运行的任务／缺少的验收。** 项目图的直接反查用来找第一层消费者；完整下游查 affected，再检查目标名称与 inputs，不能把命令退出 0 当成所有下游已验证。非 Nx 项目不为此迁移构建系统。

## 真实任务与结果

复核 Capture Workbench [PR #291](https://github.com/gx-capture/capture-workbench/pull/291) 的 UI 目录重构。固定合并提交 `1491f2dfae042ae772bafc64b21f1e6b3cc90add`，第一父提交 `f4604361739db3f28e0e3a5a482ed836ba9fa604`；实际差量 38 文件，涉及 UI、根配置、架构文档与 tools 基线。PR 作者自报多种测试通过及 Agent 参与，本次只独立验证下述选择与类型检查，不认证其整套测试计划。

安装项目指定 pnpm 12.8.2、冻结锁文件，Node 24.22.1，Nx 24.0.3，TypeScript 6.0.3。使用公开 npm 包、MIT 项目源码与项目 allowBuilds 配置；缓存、包存储、HOME/XDG 目录均隔离，不调用 Nx Cloud、桌面、模型、发布或生产服务。

- 图有 10 个项目。对 `capture-angular` 做官方 Skill 的直接反查只得到 `capture-workbench`；递归反向边还包含 `capture-workbench-desktop`、`capture-workbench-e2e`。后两者对 app 的边来自项目的 `implicitDependencies`，不能仅查源码 import。
- 完整历史差量的 `nx show projects --affected` 退出 0，返回 **7 个项目**，还包含源根、tools 和 runtime，不是只有 UI 的三个下游。
- `nx affected -t typecheck --skip-nx-cache --parallel=1` 退出 **0**，实际仅运行 **3 个任务**：`capture-angular:typecheck`、`capture-tools:typecheck`、`capture-workbench:typecheck`。逐任务状态均 0、cache-miss，见 `result.json` 与各自输出。
- desktop 没有 `typecheck`，其目标叫 `typecheck-scripts`；e2e 和源根也没有同名目标。runtime 有 `typecheck`，但本次未被选中。Nx 24.0.3 默认按任务 inputs 选择，项目级受影响清单不能直接推导任务执行集合。这里不把未选中的 runtime 任务判为漏检，也没运行它来制造额外结论。

**这次可采用的决定**：该重构的 UI、app、tools 类型检查通过；desktop 脚本、浏览器 e2e、构建和打包仍不能从这次绿灯得到结论。先用 resolved target 配置补出真正需要的验收，按环境和任务范围另行执行，不机械给每个项目添同名任务，也不统一忽略未运行项。未测其他 Nx 版本、动态缺边、Agent 节省时间或当前最强工具比较。

## 可复制操作

在临时目录克隆固定源码，使用项目版本的 pnpm 安装冻结依赖：

```sh
git clone https://github.com/gx-capture/capture-workbench.git capture-workbench
cd capture-workbench
git checkout 1491f2dfae042ae772bafc64b21f1e6b3cc90add
# 使用 pnpm 12.8.2；已有安装时不重复安装。
pnpm install --frozen-lockfile
export NX_DAEMON=false NX_NO_CLOUD=true NX_INTERACTIVE=false CI=true
pnpm nx graph --print > graph.json
jq '.graph.dependencies | to_entries[] | select(.value[].target == "capture-angular") | .key' graph.json
pnpm nx show projects --affected --base=f4604361739db3f28e0e3a5a482ed836ba9fa604 --head=1491f2dfae042ae772bafc64b21f1e6b3cc90add --json
pnpm nx show project capture-workbench-desktop --json
pnpm nx affected -t typecheck --base=f4604361739db3f28e0e3a5a482ed836ba9fa604 --head=1491f2dfae042ae772bafc64b21f1e6b3cc90add --skip-nx-cache --parallel=1
```

本次沙箱不允许插件 worker 的 Unix socket；Nx 自身报告回退到主进程，并警告需要隔离的插件可能异常。图、配置与任务仍成功返回；保留完整脱敏 stderr，不将本次结果外推为插件隔离模式通过。未修改安全设置或照日志建议扩大权限。初次包管理缓存目录不可写，改用工作区 HOME/XDG 与 store 后安装成功；未改变项目源码／锁文件。`result.json` 的原锁哈希可核对来源，保留的命令与任务状态来自实际 run.json，不是预测执行集合。

## 来源与边界

- [固定官方 nx-workspace Skill](https://github.com/nrwl/nx-ai-agents-config/blob/525ce266e22ec54e006d630d3b560658e8c3001c/skills/nx-workspace/SKILL.md)提供直接依赖反查、affected 与 resolved target 查询；本次没有安装或运行 configure-ai-agents，不验证配置覆盖问题。
- [Nx 24.0.3 affected 任务选择源码](https://github.com/nrwl/nx/blob/24.0.3/packages/nx/src/project-graph/affected/affected-tasks.ts)、[affected 命令分支](https://github.com/nrwl/nx/blob/24.0.3/packages/nx/src/command-line/affected/affected.ts)：默认任务粒度，`NX_LEGACY_AFFECTED`／`affected.legacy` 可改变语义；本次均未开启 legacy。
- [真实仓库 Agent 指南](https://github.com/gx-capture/capture-workbench/blob/1491f2dfae042ae772bafc64b21f1e6b3cc90add/AGENTS.md)、[desktop 配置](https://github.com/gx-capture/capture-workbench/blob/1491f2dfae042ae772bafc64b21f1e6b3cc90add/apps/capture-workbench-desktop/project.json)、[runtime 配置](https://github.com/gx-capture/capture-workbench/blob/1491f2dfae042ae772bafc64b21f1e6b3cc90add/packages/capture-runtime/project.json)。项目采用和体验证据来自该公开 PR 作者，不是跨团队效果测评。

核实与独立真实执行：2026-11-05。接续已有 Nx 下游发现候选，不新增全仓门禁或工具测试系列。
