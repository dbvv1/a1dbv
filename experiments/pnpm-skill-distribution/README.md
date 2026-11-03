# pnpm Agent Skills：审批、链接与失败后的实际状态

**🧪 已有 pnpm 项目确需把同一份 Skill 随包分发到多个客户端目录时，可考虑原生分发；只手工读取一个 Skill，不为此引入包管理链。** 2026-11-03 在云端 Linux x64/glibc 用官方 pnpm 12.11.0，实际完成离线安装、审批、两目录链接、换来源、撤回、冲突和缺目录恢复。消费者是临时合成包，正文来自本仓固定模板；没有启动客户端或模型，不算模板真实任务采用或收益验证。

候选来自 [Skill/MCP 广扫的部分产物 9f905b0](https://github.com/dbvv1/a1dbv/blob/9f905b0166278975f9831e7d142b9ca4cae423c5/docs/collaboration/local-jobs/artifacts/A-SKILL-MCP-WIDE-20261029/sources.md)。该广扫超时且终审未完，本次只独立核并试此分发机制，不表示整卡或其他候选通过。

## 这次改变了什么判断

- **安装成功不等于 Skill 已启用。** 未审批时安装退出 0，但两处都没有链接；按来源身份批准后，已有 `.claude/skills` 和 `.agents/skills` 得到同一正文的链接，旁边的手工内容未变。
- **审批失败不等于没有改变状态。** 已有手工同名目录、没有目标目录，两次批准均退出 1，但 `permissions` 已写入 `skills: true`。修好目标路径后再次安装即可链接，不会重新要求批准。处理失败要分别核批准状态、链接状态与实际加载，不能只看退出码。
- **不覆盖手工目录，可以改投影目标恢复。** 本次保留冲突目录，显式指定 `.agents/skills` 后，离线 frozen 安装恢复了正确正文；没有删除、替换原入口。
- **本地 tarball 的批准绑定来源。** 从 v1 tarball 改为另一路径的 v2 tarball 后，旧批准未沿用，两处旧链接被移除；批准新来源后才出现 v2。拒绝新来源又移除了两处链接。此结果不证明 registry 包每次升级都要重批。

可省的是两处手工复制与内容对齐，以及为这次包分发另写链接／撤回脚本。没有测人工耗时、模型效果或跨平台净收益。a1dbv 现有文档仓不因此改成 pnpm 项目，也不改现有模板。

## 固定输入与实际执行

- 目标材料：[`dbvv1/a1dbv@cf1bacf6`](https://github.com/dbvv1/a1dbv/blob/cf1bacf6daaab1211231bd4cb4a59351aaabfff9/templates/generic/.claude/skills/task-decisions/SKILL.md)，仅按字节复制，不加载其指令。正文 SHA-256 为 `c11c13e9d5890e2c44bf147fbc195996f069561f2ff093a924720c6bbb813d1f`。
- 工具：官方 npm 包 [`pnpm@12.11.0`](https://registry.npmjs.org/pnpm/12.11.0) 声明的 [`@pnpm/exe.linux-x64@12.11.0`](https://registry.npmjs.org/@pnpm%2fexe.linux-x64/12.11.0)，两份归档均按 registry 的 SHA-512 校验。只解包并直接运行后者的原生二进制，没有执行前者的 preinstall/postinstall，也没有安装全局 shim。
- 工具二进制 SHA-256：`79957904276d2e00848c6ce8c875c472b465c6bdc6454a65469162b9b85f1dde`。没有把 main 开发版当作 12.11.0。
- 环境：全新临时 HOME、XDG、store、cache；子进程只接收脚本列明的环境变量。包没有脚本或其他依赖；安装使用 `--offline --ignore-scripts --ignore-pnpmfile`，不发布包、不用账号／凭据、不改用户全局设置。
- 两份本地包只含 package.json 与 Skill 正文；v2 仅增加一条标明合成版本的 HTML 注释。源模板、旧 Skill 写者及其工作树不在写入范围。

## 结果与反例

完整命令、退出状态、stdout/stderr、项目批准配置、正文和锁文件哈希见 [receipt.json](receipt.json)。公开输出仅把临时绝对路径替换为 `<TRIAL_ROOT>`，二进制路径替换为 `pnpm`；其余保留。

| 检查 | 实际结果 |
|---|---|
| 未批准，安装本地包 | 退出 0；提示等待批准；两处无 Skill 链接 |
| 按实际待批来源批准 | 退出 0；两处真实符号链接，正文哈希与固定源一致；各写入 `pnpm-*` gitignore 规则 |
| frozen 重跑 | 退出 0；锁文件哈希和正文不变 |
| 换到另一 v2 tarball 来源 | 退出 0；重新等待批准，两处旧链接均移除 |
| 批准 v2，再显式拒绝 | 新正文链接出现，然后两处都撤回；拒绝已批准包还写入 `build: false`，不能只检查 skills 字段 |
| 手工同名目录冲突 | 退出 1，`ERR_PNPM_AGENT_SKILL_PATH_OCCUPIED`；手工正文不变，但 `skills: true` 已落盘 |
| 没有可投影目录 | 退出 1，`ERR_PNPM_NO_AGENT_SKILLS_DIR`；没有自动创建这两种客户端目录，但 `skills: true` 已落盘 |
| 两种失败改用显式 `.agents/skills` 后恢复 | frozen 离线安装退出 0，正文哈希正确；冲突的手工目录仍保留 |

首轮分步调查使用 gzip tarball，上述路径成立。整理公开复现脚本时，第一版错误地生成未压缩 `.tar`，pnpm 报 `Failed to decode gzip: Corrupt data`；随后改用确定性 gzip `.tgz`。该失败的原始命令、输出和脚本哈希保留在 receipt 的 `preliminary_public_harness_attempt`，不把复现夹具错误算成产品缺陷。最终公开脚本实际重跑 13 个 pnpm 命令，其中两次预期错误退出，全部分发断言成立；不是 13 个独立采用任务。

独立审查又发现旧脚本用 `exists()` 判断移除会漏掉悬空符号链接，以及复核示例的固定临时文件可能被重定向覆盖。修订版按 `lexists()` 判断路径占位，并在两个目标目录分别构造悬空链接，确认它们不能算已移除；随后重跑全部分发步骤。原候选与两项修订记录见 receipt 的 `review_revision`，此前 gzip 失败历史仍保留。

## 怎样复核

先在独立临时目录取得上述官方发行，校验归档完整性；不要执行未经检查的安装脚本。脚本不会替你下载或安装 pnpm，且拒绝二进制或 Skill 哈希不匹配的输入。需要 Python 3 标准库与 Linux x64/glibc，输出目录必须不存在。

```bash
(
  set -euC
  scratch="$(mktemp -d "${TMPDIR:-/tmp}/a1dbv-pnpm-skill.XXXXXXXX")"
  git show cf1bacf6daaab1211231bd4cb4a59351aaabfff9:templates/generic/.claude/skills/task-decisions/SKILL.md > "$scratch/task-decisions-fixed.md"
  python3 experiments/pnpm-skill-distribution/trial.py \
    --pnpm /path/to/verified/pnpm \
    --source-skill "$scratch/task-decisions-fixed.md" \
    --output "$scratch/run"
  printf 'Artifacts: %s\n' "$scratch"
)
```

示例用 `mktemp -d` 新建独立目录，并启用 `noclobber`，不向固定临时文件重定向。脚本保留临时包和配置，不自动清理、不覆盖已有输出。输出目录含有 Skill 的字节副本，但没有客户端或模型读取调用。若版本、平台或来源变了，应记录新的试验，不能沿用本次通过。

## 一手说明与未验证范围

- [pnpm Agent Skills](https://pnpm.io/agent-skills)：v12.11.0 起支持，默认只使用已有目录及当前 Agent 可识别目录，不是无条件创建所有客户端目录；也不覆盖 global install、dlx、deploy。官方说明 registry 包批准覆盖后续版本，git／tarball 按具体来源批准，仅 git 另可按仓库批准；本次只实测不同本地 tarball 来源。
- [pnpm permissions](https://pnpm.io/cli/permissions)：批准会先记录决定，再执行允许的构建与 Skill 链接；按名称批准不在待批列表中的包会决定全部能力。实际使用先核包请求什么，本次无脚本，不能据此给第三方包整体放行。
- [构建设置与 skills.dirs](https://pnpm.io/settings/build)：`ignoreScripts` 不阻止 pnpmfile，故本次另禁 pnpmfile；明确目录会创建缺失目录，空列表关闭分发。本次没有验证空列表分支。

未验证：Claude Code／Codex 等是否发现、加载并使用这些链接，模型结果、Windows/macOS、多版本 monorepo、registry 升级批准、dev/prod 筛选以及大规模维护成本。锁文件和批准记录也不证明 Skill 内容安全，不替代安装前审阅或宿主权限。

## 候选交付检查

公开复现脚本的实际回执哈希与提交文件一致；check_repo、check_public、Python 语法与 diff 空白检查通过。首次全离线检查因隔离克隆缺少旧 absorption 的固定 Git 对象 `009fd0a54a012ea3a506eea75f260f43ecc13595` 出现 72 个初始化错误；只从原仓补取该公开对象，未改测试，再跑 20 阶段全部通过、无空套件或跳过。该门禁不验证模型、原生客户端或 hosted CI。候选仍待非作者审阅与负责人发布。
