# uv 升降级：锁文件没变包，也可能失去无 manifest 安装能力

**🧪 团队混用 uv 版本，先核 `uv.lock` 的 revision 与真实安装入口；已经采用只复制锁文件的依赖层时，不只看包版本有没有变化。** 本次按迁移路线实际准备 Spec Kit 开发环境，复现 [uv #22911](https://github.com/astral-sh/uv/issues/22911) 的 revision 降级；同时证明普通 `sync --frozen` 并非必然失败。

## 真实任务与结果

消费者是 Spec Kit 固定源码 `ec9a6f3b94c0aa856f77e550785a1ddde1993de1`（`specify-cli 1.3.1.dev0`），以它原有 pyproject 解析真实依赖，不是合成空项目。Linux x86_64、Python 3.12.14，官方 PyPI uv 0.12.10／0.13.7。先生成并保存 [revision 5 锁文件](baseline.lock)，共 52 个包身份；消费者安装后实际执行 `specify init --integration codex --non-interactive --ignore-agent-tools --script sh`，检查生成规格模板和 Codex Skills。

[复跑脚本](reproduce.py)的 [逐步结果](results.json)记录了以下路径：

| 实际操作 | 结果 |
|---|---|
| 0.12.10 普通 `lock` 读取新锁 | 退出 0，字节未变；不能概括为旧版每次都会降级 |
| 0.12.10 `lock --upgrade-package typer==0.27.3` | 退出 0，revision 5 → 3；52 个包的 name/version/source 全部一致 |
| 0.13.7 在有 pyproject 的真实 checkout 中 `sync --frozen` | 退出 0，正常安装；revision 3 本身不等于环境不可用 |
| 只复制 revision 5 锁文件、没有 pyproject，`sync --frozen --no-install-project --no-dev` | 退出 0，依赖安装成功 |
| 同一层只换成真实降级后的 revision 3 锁文件 | 退出 2，明确要求 revision 5 或更新；锁文件字节未被失败动作修改 |
| 0.13.7 普通 `lock` | 退出 0，但仍保留 revision 3，未恢复上述层 |
| pyproject 增加 `tool.uv.required-version = ">=0.13.7"` 后旧版重新解析 | 退出 2，版本不匹配；锁文件保持字节不变 |
| 0.13.7 重新解析同一固定 typer 版本 | 退出 0，恢复 revision 5，锁文件与最初逐字节一致；无 manifest 依赖层恢复安装 |
| 另建干净环境完整同步并实际 `specify init` | 退出 0，生成模板和 Skills；不是只跑 help |

旧版首次离线重新解析因自己的缓存缺失失败，不能算目标复现。补齐官方包源元数据后，整个固定复跑成功使用 `--offline`；复跑脚本没有把任意非零当成目标失败，而是分别检查退出码、诊断文本、锁文件字节和消费者文件。

## 如何处理这个具体问题

1. **先确认是不是无 pyproject 的锁文件发现路径。** uv 0.13.7 的这条路径是实验能力；本次没有修改正式项目去依赖它，也没有实际运行 Docker，只用独立目录复现依赖层所需的文件布局。项目保留 pyproject 的普通 frozen 路径是成功对照。
2. **在保留项目配置的团队入口约束实际用过的 uv 版本。** `required-version` 会让不满足版本的 CLI 先报错。这里 `>=0.13.7` 是本次验证值，不是证明它为最低支持版；也没有验证所有更高版本。无 pyproject 的构建层读不到这一项目约束，仍须单独固定所用 CLI。
3. **恢复时核结果，不只执行报错建议。** 在这个固定例子，现代 uv 的普通 `lock` 没有改格式；重新解析固定 `typer==0.27.3` 后才恢复，而且字节对照证实无额外变化。不要把该包名抄到别的项目，或对实际依赖升级的锁文件盲目回滚；先保全新旧文件，核项目元数据与依赖差量，选择恢复已核好的锁文件或受控重新解析，再跑真实安装入口。

固定源码解释了这个窄条件：uv 0.13.7 在父目录发现 lock 而没有 pyproject 时，要求锁文件携带 revision 5 的组元数据；有 manifest 会先退出这条发现分支。不是“所有 frozen 都要求 revision 5”，也不是 package 版本变化导致本次失败。issue 中未经源码验证的社区推测不作为实现依据。

## 在隔离目录复跑

先从官方仓库取得上述 Spec Kit commit，并按该项目开发约定准备依赖。另行安装官方发布的 uv 0.12.10、0.13.7；不要覆盖系统 uv。脚本需要 Git、Python 3.11+，消费者本轮使用 Python 3.12.14。把下列变量设为实际路径，WORK 必须不存在：

```sh
python reproduce.py --source "$SPEC_KIT_CLONE" \
  --old-uv "$UV_0_12_10" --new-uv "$UV_0_13_7" \
  --python "$PYTHON" --cache "$CACHE" --work "$WORK"
# 两个 uv 版本都已缓存所需依赖后，可加 --offline 重跑。
```

脚本复制固定提交到独立 clone，不修改输入 checkout，日志只写 WORK。它使用仓库现有构建脚本安装真实包；先按所在环境授权执行。网络解析结果可能随时间变化，固定版本与字节断言失败应调查，不通过更新 fixture 求绿。本目录只保存公开锁文件、脚本和去路径结果，不保存依赖、环境或原始运行日志。

**边界**：没有调用模型、加载真实 Codex 客户端或完成第二位未读本机读者；不提升地图评级，不声称 Windows 原报告或原生 macOS 已复现，不证明所有依赖／workspace 布局。此项是特定版本的消费者实试，不是修复 uv，也没有向上游投稿。

依据：[用户原报告 #22911](https://github.com/astral-sh/uv/issues/22911)、[uv 0.13.7 frozen discovery 实现](https://github.com/astral-sh/uv/blob/316c827e058c16b71d5c507a20729c2995a7bcce/crates/uv-lock-operations/src/lockfile.rs#L23-L78)、[同版本 required-version 契约](https://github.com/astral-sh/uv/blob/316c827e058c16b71d5c507a20729c2995a7bcce/uv.schema.json)、[Spec Kit 固定 pyproject](https://github.com/github/spec-kit/blob/ec9a6f3b94c0aa856f77e550785a1ddde1993de1/pyproject.toml)。核实及 Linux 实跑：2026-11-05。
