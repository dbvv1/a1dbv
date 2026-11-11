# BMAD：迁移后还要让下一项工作读得回来

**🧪 迁移 v7 预览版的旧 spec 时，先备份完整输出树，再在副本验证下面的组合候选。** 它保留隐藏稿、临时文件和工作目录，分开各故事的日志及同名附件，并补上迁移后继续写日志的入口。
**票据与计划保持平铺；日志和附件各归同名目录。** 迁移成功后仍要从当前 tickets／memlog CLI 读写一次，不能只看退出码。
**这不是稳定 v6.12 的通用升级器，也不修复已经混在一起的历史。** 受测范围是固定 v7 preview 源码；下方历史结果保留原版本和边界。

## 当前组合候选：迁移后还要接着工作

基线为官方 dev `3cf35b6dc97fb8d7e319287a680a9197a8e1036a`，迁移脚本已移到 `skills/core-tools/bmad/scripts/`。原实现仍有 [#3142](https://github.com/bmad-code-org/BMAD-METHOD/issues/3142) 的隐藏／临时文件丢失和 [#3143](https://github.com/bmad-code-org/BMAD-METHOD/issues/3143) 的共享日志、同名附件冲突。旧的两项修复没有组合验收；本次[七文件补丁](combined.patch)把迁移代码、回归和直接使用说明放在一起，不叠加下面的旧补丁。

### 先在新的源码副本应用

需要 Git、uv、Python 3.11+；本次实跑为 Linux／Python 3.11.18。从本目录开始，补丁留在源码树之外；不要应用到已有脏树或其他执行者正在修改的目录。

```sh
PATCH="$PWD/combined.patch"
git clone --branch dev https://github.com/bmad-code-org/BMAD-METHOD.git source
git -C source checkout --detach 3cf35b6dc97fb8d7e319287a680a9197a8e1036a
git -C source apply --check "$PATCH"
git -C source apply "$PATCH"
cd source
export UV_CACHE_DIR="$PWD/.uv-cache" UV_PYTHON_INSTALL_DIR="$PWD/.uv-python"
uv sync --frozen
uv run --frozen python -B -m pytest tools/tests/test_migrate_v6.py
```

原 guided migration 要求备份完整输出树；直接 `--fold-specs` 不会替你备份，`--clean` 的 `_bmad` 备份也不包含输出树。先复制自己的 `_bmad-output` 到迁移范围之外，在副本上按项目迁移说明执行，再对照文件清单、内容与 JSON 的 `problems`、`unresolved`。不要把 `problems` 非空且 exit 0 当成功。

### 下一轮从票据找到自己的日志

组合候选保持如下布局，当前 tickets 的发现、状态、计划路径和身份不变：

```text
backlog/
  story-pay.md
  story-pay-plan.md
  story-pay/
    .memlog.md
    DESIGN.md
  story-ship.md
  story-ship/
    .memlog.md
    DESIGN.md
```

**恢复时先用 `tickets.py find` 找到 `story_file`，去掉末尾 `.md`，得到该 backlog 票据的 SPEC workspace。** 用原有 `memlog.py append --workspace <该目录>` 写入并读回；容器仍用自己的容器目录。`find` 的 `folder=backlog` 不是个体故事的日志地址，不能把它直接代入旧的“ticket folder”。缺少个体日志时按修订后的 SPEC 说明初始化自己的日志，既有共享 `backlog/.memlog.md` 留原样，不猜分给任一故事。

这个差别来自真实后续调用：只合两个代码补丁时，两份历史已经隔离，但按旧说明追加的两个命令都退出 0，却再次写入共享 backlog 日志。最终候选同步了 SPEC、ticket、workflow、票据树规则及迁移说明，后续消费者须从 `find` 返回值取得位置，而不依赖上一次迁移报告还在上下文里。

### 接收范围

实跑使用公开问题同形的合成输入，不是真实用户存档。非作者用独立冻结输入验证正常组合、同名附件、隐藏／临时文件、票据发现与计划读写、独立日志追加、重复迁移和写入前冲突；最终说明由另一执行者完整读取，再从真实 `find.story_file` 接续日志。完整 `tools/quality.py` 入口通过，包括 Python 检查、验证器、测试以及文档 lint、格式、构建、侧栏和测试；独立消费者结果不冒充其全仓检查。

含脚本声明的可选 tiktoken 0.14.0 时，完整 pytest 为 **1252 passed、200 subtests、0 skipped**，未改项目锁文件。要复跑完整项目门禁，另按 CONTRIBUTING 准备 docs-site 依赖并运行 `uv run --frozen tools/quality.py`；受限环境用本次工作区的 `XDG_CONFIG_HOME`，可设 `ASTRO_TELEMETRY_DISABLED=1` 关闭本进程遥测，不改 home 权限。

**失败后先检查实际树，不直接重跑。** 源或目标 `.memlog.md` 是目录、悬空链接时，候选在写入前列出问题；可读但只读的普通日志仍可能在追加时失败，此时票据、附件或日志位置已经改变。独立实跑中，直接再跑还会重复增加 Requirements。它不是事务恢复器，不保证所有运行时失败都保持原树。

**适用边界**：迁移存储、引用与明确日志地址已验证，不等于 LLM 驱动的完整 SPEC／v6→v7 流程通过；没有 Windows、真实存档或线上验收。补丁按现有 [MIT 许可](LICENSE)提供。没有向上游投稿；这份七文件改动仍需按对方规则取得维护者范围确认与贡献者的人审，不以本仓自动检查代替。

**依据**：上述两条真实问题、[固定迁移源码](https://github.com/bmad-code-org/BMAD-METHOD/blob/3cf35b6dc97fb8d7e319287a680a9197a8e1036a/skills/core-tools/bmad/scripts/migrate_v6.py)、[当前票据契约](https://github.com/bmad-code-org/BMAD-METHOD/blob/3cf35b6dc97fb8d7e319287a680a9197a8e1036a/tools/ticket-tree-rules.md)及[贡献规则](https://github.com/bmad-code-org/BMAD-METHOD/blob/3cf35b6dc97fb8d7e319287a680a9197a8e1036a/CONTRIBUTING.md)。定向核实与真实 CLI 实跑：2026-11-11；原始输入均为合成，不推荐据此批量迁移真实数据。

## 历史：11-02 的隐藏文件保全

## 从真实未完成需求开始

BMAD-METHOD 是约 5.49 万 Star 的结构化 AI 开发项目，源码为 MIT，另有商标说明。公开 #3142 报告 `fold_spec` 跳过点文件／目录和 `.tmp`，随后递归删除 spec 文件夹，正常退出且报告没有列出损失。用户要求把剩余项移动过去，或明确停止并保留原件。

本次固定当前 main 与 dev，确认这段脚本相同；在 dev 的独立副本做最小修复：移动除 spec 主文件和 `.memlog.md` 之外的所有条目，沿用写入前的目标同名检查；结尾只删除空目录。没有改 ticket 格式、链接算法或其他迁移模式。原先断言丢弃 `.DS_Store` 的测试改成冲突时完整树不变，而不是删掉旧断言来凑通过。

## 验收到下一位实际消费者，而不是停在文件移动

非作者先读项目规则和原需求，再独立构造一份当前 `tickets/` 布局的商店 initiative：2 条 entry、既有支付计划、第二条计划、R1、CAP-1 spec、两份 memlog、隐藏 Markdown、`.working` 下 HTML／深层二进制、无效 UTF-8 的 `.tmp`、普通 notes、archive 和邻接 initiative。迁移前保存完整源副本及逐文件哈希；两版本接收同样输入。

```text
完整源备份 → 实际 fold CLI → 逐文件去向／内容核对
→ 生产 tickets status / next / find
→ mark in-progress → find / status 再读
→ 再次 fold、冲突与缺输入对照
```

| 真正观察的结果 | 原版 dev | 本地候选 |
|---|---|---|
| 隐藏稿、HTML、深层二进制、tmp | 4 个源文件丢失，但 exit 0／`problems=[]` | 全部保留；HTML／二进制／tmp 字节相同 |
| 原 17 个文件的去向 | 缺上述 4 件，完整原件仍在本次备份 | 全部有目标或明确合并转换；不是“17 件都原样复制” |
| Markdown 与需求 | 原可见路径仍转换 | 旧 R1 保留，CAP-1→R2；隐藏稿及普通 notes 的 spec 链接正确改指 initiative |
| memlog 与邻接对象 | 未以其成功替代文件保全 | 旧日志→spec 日志→fold 事件按序；archive、邻接 initiative、第二计划不变 |
| 后续生产消费者 | 未作为候选通过证据 | status／next／find 读到同一 entry；mark 后只既有 `ticket: 1` 计划状态改变，读回身份、路径及 R2 一致 |
| 重复迁移 | 不用重跑去“恢复”已丢源文件 | 第二次 `folded=[]`／`problems=[]`，全树哈希不变 |
| 隐藏或 tmp 同名冲突 | 原筛选会漏掉这些项 | 具名 `problems`，整树不变，**退出码仍为 0** |
| 缺少 store | — | exit 1，保留错误输出 |

`mark in-progress` 是合成计划的状态读写验证，不表示软件任务已经完成。所有失败只发生在自有夹具；消费者未读取真实项目或私人会话。

## 读者真正要保留的选择

**先保全输出树，再迁移；接收时同时读 JSON 和下一位工具的输入。** 上游 guided migration 本就要求完整源备份，但直接 `--fold-specs` 不会替你备份；`--clean` 对 `_bmad` 的备份也不是输出树备份。只看到退出 0 或新 ticket 存在，无法发现本次内容损失。

冲突预检失败可以保持全树原样，运行到末尾才失败则不同。本地候选的 `rmdir` 会保留晚到／遗漏文件并报错，但前面的 ticket 改写、memlog 合并、部分移动乃至 spec 主文件删除可能已发生；它不是事务或自动恢复工具。单测用局部 move 故障注入核这个停点，未验证真实并发／进程中断。

保留内容会把同名隐藏元数据变成明确冲突，不会替读者合并或丢掉 `.DS_Store`。多个 loose specs 共用 backlog memlog／伴随件冲突是另一问题 #3143，11-02 的上述候选未修；11-08 的[独立修复](#loose-story-reader)另列，不把两者当作已合并或全量升级方案。

## 检查、失败与保全

| 检查 | 实际结果 |
|---|---|
| 原迁移 unittest | 29 通过 |
| 新回归配原生产代码 | 2 failures、1 error，先复现再修 |
| 候选迁移 unittest | 32 通过；两文件 Ruff lint／format 及空白检查通过 |
| 完整 Python suite，原 dev／候选 | 1063／1066 通过；**两版同样 7 个 renderer 子例失败、1 跳过**；各 167 个子测试通过 |
| 候选静态验证 | 文件引用、Skill、manifest 三入口通过 |
| 非作者 | 源码／回归范围审通过；独立生产 CLI 消费限定通过 |

完整套件按原默认并行入口运行，没有缩成定向绿灯。失败来自 `uv run --no-cache` 在显式离线环境找不到脚本所需 Jinja2，虽开发环境中已装好；跳过是没有可选 tiktoken。未为通过这些路径临时联网，也没有修改 renderer。上游固定 dev 头的 5 个 checks 成功，不涵盖本地候选；本地补丁无 hosted CI、Windows 或 docs-site aggregate 验收。未加载 Skill／Hook、调用模型或安装到用户机。

依赖准备初次因环境没有项目默认 Python 3.11 停止，明确选用满足 `>=3.11` 的现有 Python 3.12.14 后，按 frozen lock 在独立环境安装了开发依赖。消费者的补充校验器一度把成功 `status` 的可选 `problems` 当作必有字段；原错误保留，只修 accessor，未改生产源码或夹具。源码、完整输入、原失败、候选及 Git bundle 已离线归档并回读校验；原归档未审核为可公开上传。

**依据**：官方 [项目与预览说明](https://github.com/bmad-code-org/BMAD-METHOD/tree/bd70c643a7ec85d1ec2e88076b3fbdd8e4517f41)、[迁移脚本](https://github.com/bmad-code-org/BMAD-METHOD/blob/499008ea97c53436e7c7fa598a4a25e7bb869e07/skills/bmad/scripts/migrate_v6.py)、[完整备份与迁移契约](https://github.com/bmad-code-org/BMAD-METHOD/blob/499008ea97c53436e7c7fa598a4a25e7bb869e07/skills/bmod-method/migration-1.toml)、[真实使用者 #3142](https://github.com/bmad-code-org/BMAD-METHOD/issues/3142)与相邻未解决的 [#3143](https://github.com/bmad-code-org/BMAD-METHOD/issues/3143)，加本仓隔离真实消费。核实 2026-11-02；定向覆盖，不据 Star 或一次试验推荐整套方法。固定版本与结果见 [results.json](results.json)，长程页仍为 🟡。

<a id="loose-story-reader"></a>
## 11-08：不同故事的日志与附件各有归属

**🧪 只解决 #3143 的新迁移：保留平铺的 `backlog/story-<slug>.md`，把日志与附件放进同名 `backlog/story-<slug>/`。** 现有附件目录会明确拒绝，不合并旧历史；已经混在一起的日志不能凭这份补丁自动拆回。

新上下文读者按 [Agent 选择页](../../docs/01-agents/README.md)保留现有云端入口，在固定 dev `a867e1604b365d48ea03cbd109da1066ba0c84bc` 上通过原 CLI 复现：第二个 `DESIGN.md` 冲突，改名后日志又混入第一个 topic。[两文件补丁](loose-stories.patch)分开附件目标和 ticket 的相对引用基准；原嵌套 initiative 的位置不变。

**从本目录复制到新的源码副本后验证，不应用到已有脏树。** 需要 Git、uv 和 Python 3.11+；本次 Linux／Python 3.11.17。依赖准备使用官方仓库及项目冻结锁文件，缓存可放当前工作区。

```sh
PATCH="$PWD/loose-stories.patch"
git clone --branch dev https://github.com/bmad-code-org/BMAD-METHOD.git source
git -C source checkout a867e1604b365d48ea03cbd109da1066ba0c84bc
git -C source apply "$PATCH"
cd source
export UV_CACHE_DIR="$PWD/.uv-cache" UV_PYTHON_INSTALL_DIR="$PWD/.uv-python"
uv sync --frozen
uv run --frozen python -B -m pytest -n 0 tools/tests/test_migrate_v6.py
```

31 项迁移测试通过；两个新回归配原生产代码均失败。非读者在另一份源码与三个不同故事上另跑真实 CLI：同名附件全迁入，原 backlog 的 ID／日志保留，来源与链接正确；`tickets.py status/find` 找回四个故事（含原有一项），`mark` 后 `find` 读回正确计划。以迁移报告返回的 memlog 所在目录作为 workspace，用 `memlog.py append` 追加，各自日志互不污染；重复迁移不改树，目录冲突保全整树，缺输入退出 1。

读者全量 Python 检查为 **1186 tests＋198 subtests 通过，无 skip**，项目完整 `tools/quality.py` 也通过，包括代码／文档检查、验证器和文档站构建。初次失败源于默认缓存／Astro 配置目录不可写和可选 tiktoken 缺失；改用工作区缓存与配置目录、在隔离 venv 安装该可选依赖后重跑，未改项目锁文件。以上是本地检查，不是 hosted CI。

**这是迁移存储与引用修复，不是完整工作流升级。** 没运行 LLM 驱动的 SPEC 流程；旧 prose 的 `<ticket folder>` 是否能让后续 Agent 自动找到新日志目录仍待验，本次消费者使用报告中的 memlog 位置。也不包含上文 #3142 的隐藏文件保全、旧混合日志修复、Windows 或线上验收；没有提交上游。派生补丁按 [原 MIT 许可](LICENSE)提供，许可中引用的[贡献者](https://github.com/bmad-code-org/BMAD-METHOD/blob/a867e1604b365d48ea03cbd109da1066ba0c84bc/CONTRIBUTORS.md)与[商标说明](https://github.com/bmad-code-org/BMAD-METHOD/blob/a867e1604b365d48ea03cbd109da1066ba0c84bc/TRADEMARK.md)保留上游入口。

**依据**：[#3143 原需求](https://github.com/bmad-code-org/BMAD-METHOD/issues/3143)、[固定 dev 源码](https://github.com/bmad-code-org/BMAD-METHOD/blob/a867e1604b365d48ea03cbd109da1066ba0c84bc/skills/bmad/scripts/migrate_v6.py)及本次真实 CLI、原生测试与独立消费；2026-11-08 核实。原问题仍 open，定点 PR 搜索未找到对应修复，不等于不存在未公开的实现。
