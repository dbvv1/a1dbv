# Skills PR #2750：暂不采用基于锁年龄的自动接管

实际决定：为已发现的同项目 Skills 并行安装丢锁项问题，评估是否可用上游修复候选替代串行安装。当前保留串行：候选常规并发测试通过，但仍会接管一个活着且未结束写入的进程。

- 上游问题：https://github.com/vercel-labs/skills/issues/2745
- 已有修复：https://github.com/vercel-labs/skills/pull/2750
- 精确候选：`deb98002a4c17ba6042aaf720218bba13c47861b`
- 比对时 upstream main：`b716f9dc2ba36b6aa8f0080615e5a3a6caeac63b`
- 2026-11-14 核验；Linux、Node 24.22.1、pnpm 11.25.0；只安装冻结锁定依赖，未跑 prepare 脚本。

## 结果

| 检查 | 结果 |
|---|---|
| 原 PR 四个相关测试文件 | 79 passed，4 files passed |
| 两次顺序 `addSkillToLocalLock` | exit 0，`alpha`、`beta` 均保留 |
| 活跃写者暂停后恢复的故障注入 | 两个写者均 success，但最终只剩 `alpha`，完整性断言 exit 1 |

`active-writer.mjs` 使用两个真实 Node 子进程和候选的真实 `addSkillToLocalLock`。alpha 取得锁并读取旧快照后，测试拦住 `readFile` 的返回；真实等待 31 秒，检查 alpha 仍存活，再让 beta 写入。候选以锁文件 mtime 超 30 秒为由删除锁，beta 写入成功；alpha 恢复后覆盖 beta。记录持锁时间 31,210ms。

这是可控的调度／I/O 暂停反例，不是自然安装频率测试，没有执行真实模型。它证明当前 stale-lock 分支不能以时间判定旧写者结束，不说明普通安装经常超过 30 秒。没有改上游代码，没有重复创建 PR，没有将本结果冒充读者验收或提高地图评级。

## 重跑

准备上述 SHA 的 upstream 仓库，按其 packageManager 安装冻结依赖，然后在证据目录运行：

```sh
node serial-control.mjs /path/to/skills
node active-writer.mjs /path/to/skills
```

第二项正常复现的表现就是最后完整性断言失败。只操作新建临时项目，不使用全局 Skill 安装或个人配置。原 PR 的普通验证命令：

```sh
node node_modules/vitest/vitest.mjs run tests/local-lock.test.ts tests/add-lock-write-failure.test.ts tests/invalid-local-lock.test.ts tests/api.test.ts
```

现有锁互斥与原子替换能改善普通并发，但不能自动证明异常恢复安全。采用前仍需所有者／租约方案、过期锁竞争与恢复回归；本轮不自行重复实现已有 PR，不建议直接升级到该未合并分支。

## 非作者复跑

另一执行者核对上述候选的 `src/local-lock.ts` 与远端 blob `994362aca06d6922ca674d0088e1396f1185b3a0` 一致，在隔离目录独立复跑本脚本。真实暂停 31,218ms，alpha 仍存活；beta、alpha 都 success，beta 写后为 `[beta]`，alpha 恢复后为 `[alpha]`，完整性断言 exit 1。审查确认仅在取得旧快照后注入暂停，未替换被测互斥或写入函数。

该复跑支持此恢复分支的反例；未验证原生 Windows，也不外推全部并发场景。实验分支保全，未合 main；当时未改的基线已有 TASKS 超 10 KB 的 `check_repo.py` 失败，本实验不修改该任务表或绕过门禁。
