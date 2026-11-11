# 共享指令更新后，还能恢复首次原文吗？

**🧪 已用 Ruler 分发指令的项目，先在独立副本连跑“生成 → 修改共享源 → 再生成 → 恢复”。** 根目录和子目录的备份设置要分别核，不能只检查生成命令退出成功。本实验接收现有修复，并验证下一次真实文件更新；没有使用生成器的项目不必为此引入新工具。

## 问题与可复用修复

Ruler 0.3.46 的固定 main `5e551e60952fb1c81c6c5ad6f5fe8b7a412bda87` 在嵌套模式下，把根目录备份设置用于所有目录。根目录关闭、子目录开启时，子目录原文仍被覆盖且没有恢复副本；反向配置则产生本来禁用的备份。

现有 PR #808 将优先级改为：**显式 CLI 覆盖 → 该目录解析后的配置 → 默认开启**。本实验直接接收这个实现，没有另写同功能版本。随后从真实文件回读发现，规则输出的 `.bak.ruler-generated` 来源标记没有进入忽略清单，而不存在的 `.bak` 却被提前登记。本地增量复用已有 `trackVerifiedBackupArtifacts`，在实际写入后收集已经验证的备份和标记。

[组合补丁](combined.patch)只改四个上游文件：实现两处、备份回归测试和已有 e2e fixture。备份格式、可信来源规则、目录发现、代理选择与 revert 实现保持原契约。当前 main 后续的 Zod 4.6.7 依赖修复及 Codex 子代理处理也保留。PR 仍是开放草稿，本补丁未获上游接收。

**依据**：[公开自动排查工单 #775](https://github.com/intellectronica/ruler/issues/775)含 autopilot 标记，不当作真实用户反馈；[PR #808](https://github.com/intellectronica/ruler/pull/808)，head `dabfdd65755ec8d6ca113bb357e35709d1907056`、原 base `3c0520f36234ba646c0d612bd363d010b2beab20`，作者 hiyouwhatsapp；[固定 main](https://github.com/intellectronica/ruler/tree/5e551e60952fb1c81c6c5ad6f5fe8b7a412bda87)。补丁含上游 MIT 代码，完整版权与许可随 [LICENSE.upstream](LICENSE.upstream) 保留。核实 2026-11-11。

## 在一次性目录复跑

需要 Git、Node 24、npm、Python 3 和官方 npm 依赖下载。实际环境为 Linux、Node 24.22.1、npm 11.9.0。先取得本目录三个文件 `combined.patch`、`lifecycle.py`、`LICENSE.upstream`，把 `ARTIFACTS` 改为它们的绝对路径；`RUN` 必须是尚不存在的新目录。

```sh
set -eu
ARTIFACTS="$(pwd)/experiments/ruler-nested-backups"
RUN="$PWD/ruler-replay"
mkdir "$RUN"
git clone https://github.com/intellectronica/ruler.git "$RUN/source"
git -C "$RUN/source" checkout --detach 5e551e60952fb1c81c6c5ad6f5fe8b7a412bda87
git -C "$RUN/source" apply --check "$ARTIFACTS/combined.patch"
git -C "$RUN/source" apply "$ARTIFACTS/combined.patch"
mkdir -p "$RUN/home" "$RUN/tmp" "$RUN/npm-cache"
export HOME="$RUN/home" XDG_CONFIG_HOME="$RUN/home/.config"
export TMPDIR="$RUN/tmp" npm_config_cache="$RUN/npm-cache"
cd "$RUN/source"
npm ci
npm run check:package-lock
npm run format:check
npm run lint
npm test -- --runInBand
npm run build
npm audit --omit=dev --audit-level=moderate
npm pack --dry-run
python3 "$ARTIFACTS/lifecycle.py" "$RUN/source/dist/cli/index.js" "$RUN/cli-results"
```

脚本只在新建输出目录内创建合成项目，使用隔离 HOME/XDG/TMPDIR，显式选择 Claude 与 AGENTS 输出；apply 关闭 MCP、skills、subagents，并使用 `--local-only`。它运行真实构建后的 CLI，不调用模型客户端。已有输出目录会拒绝复用，避免覆盖上一次证据；每条 CLI 命令限时 30 秒，结果在 `cli-results/results.json`，各场景保留实际文件快照和退出码。

## 实际验收结果

| 路径 | 实际结果 |
|---|---|
| 固定 main，原 PR 回归测试 | 16 通过、2 失败，复现根与子目录设置冲突 |
| 原 PR 单独应用 | 原 18 项通过；两轮更新与恢复正确，但实际来源标记仍漏进忽略清单 |
| 为必要增量先加断言 | 4 项失败，定位真实备份及来源标记收集，不用全局 `*.bak` 掩盖 |
| 增量首轮完整套件 | 1345 通过、1 失败：旧 e2e 未创建原文件，却要求存在备份忽略项 |
| 最终四文件补丁 | 163 套件 / 1346 测试通过；旧 e2e 补真实原文，保留原断言并增加备份字节与标记断言 |
| 原生其余门禁 | 安装、lock、format、lint、build、生产依赖 audit、pack dry-run 均退出 0；audit 0 漏洞 |
| 本目录可执行脚本 | 最终 build 后九场景通过，包括两轮更新、恢复首次原文、CLI 覆盖、单目录、缺省配置、无原文件及无标记旧备份 |
| 独立消费者 | 在干净副本应用同一补丁、独立 build，自写 CLI 消费者通过，并用 Git 实际核忽略、核 apply/revert dry-run 不改文件 |

最终覆盖率为 statements 94.45%、branches 85.41%、functions 97.20%、lines 94.58%。完整套件与失败前态都实际运行；独立消费者没有冒充再次运行完整套件。公开补丁只规范化空白上下文行，新增与删除代码未改变。

## 恢复时必须分清的结果

- **开启备份**：连续生成后 `.bak` 仍须是首次原文，`.bak.ruler-generated` 是工具认可的来源标记；原生 revert 后逐字回读原文。仅有文件或 `.gitignore` 条目不是恢复成功。
- **关闭备份**：revert 可以删除生成文件，不能重新造出被覆盖的原文。需要恢复时，先另备 Git 等已验证的副本。
- **已有无标记 `.bak`**：工具应拒绝把它当成可信备份，保留文件及未生成的原文，不应自行伪造标记。
- **没有旧目标**：首次生成不应凭空产生备份或备份忽略路径。选定代理执行 revert 后，已有托管忽略块按原设计保留。
- 本地配置缺少 `[backup]` 的场景验证的是该 `--local-only` 加载路径的默认开启，不能推广为所有全局、自定义配置的继承规则。

这为[团队配置维护](../../docs/18-team-adoption.md)提供局部机制证据。上游嵌套模式仍标实验性；真实团队接收和后续维护、模型是否遵循生成指令、生产部署、Node 20/22、本机外部库消费者均未验收，不据此把 18 的整条路线改为通过。
