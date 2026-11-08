# A-UPSTREAM-CATTRS-DELTA-READER-20261108 · u1 读者记录

任务：只照 `docs/decisions/upstream-contributions.md@3f445adee874b68045fe718576ef2678782c2828` 全文，为 cattrs 的 Decimal 需求 #761 决定本仓已有五后端候选现在应怎样推进。以下只写过程与卡点；决定与证据见 `docs/collaboration/local-jobs/artifacts/A-UPSTREAM-CATTRS-DELTA-READER-20261108/result.md`。

## 做到哪一步／产物在哪

- 读完页面全文和固定候选材料：`decimal-preconf.patch`、`test_decimal_preconf.py`、`patched-sha256.json`、`requirements.lock`、`pytest.ini`、`LICENSE`，以及 `evidence/replay-report.json`、`evidence/baseline-encoding.txt`、`evidence/baseline-roundtrips.txt`。
- 核当前贡献入口：cattrs 没有 `AGENTS.md`，也没有 PR 模板；等价入口为 `CONTRIBUTING.md`、`.github/AI_POLICY.md`、`.github/ISSUE_TEMPLATE.md`，并由 `README.md`、`pyproject.toml`、`Justfile`、`HISTORY.md`、`docs/preconf.md` 补充。固定于 `e9239b7082206f18e3cec873b11451aff35beb9c`。
- 核 issue／PR 状态：#761 open、无 label、2 条评论；只有 #764（head `8c04cdb5`）与 #822（head `2e883761`）引用它，均 open／unmerged、mergeable=false／dirty。维护者在 #764 要求把改动扩到 ujson／orjson／msgspec。
- 核当前 `main` 与发布：五个 preconf 源码和最新发布 `v26.2.1` 都没有 Decimal；候选补丁的 pre-image blob 与当前 `main` 的 json／pyyaml／ujson／orjson／`docs/preconf.md` 一致，msgspec 的 hunk 上下文仍在（静态核对，未 apply）。
- 核候选与当前 `main` 的距离：`compare/bde101a...e9239b7` 只差 6 个提交，源码面是 `converters.py`（文档字符串）与 `msgspec.py`（deque／`adapted_fields`）。
- 产物：决定、证据、页外帮助、卡点与未运行范围写入上述 `result.md`；本文件记录照页执行的过程。
- 没有运行测试、没有应用补丁、没有创建／评论 issue 或 PR、没有安装依赖。

## 每个卡点：页面对应句 → 缺什么 → 做错过什么

1. 页面第一步模板：“先只读当前贡献规则、AGENTS、PR／issue 模板及其要求续读的规则；常见文件不存在时，从 README／文档导航找等价入口，记录实际文件、提交和日期。”
   - cattrs 没有 `AGENTS.md` 和 PR 模板。我按页面要求改走 `CONTRIBUTING.md`、`.github/AI_POLICY.md`、`.github/ISSUE_TEMPLATE.md` 与 `README.md`，并记录了固定提交。这里不是阻塞，但必须写清“实际入口不存在、用了等价入口”，不能默认项目有这些文件。
2. 页面：“对照当前目标分支的差分与源码，按输入、输出和兼容契约判断旧补丁是否已被覆盖；”
   - 只能公开只读核对。我确认当前 `main` 没有 Decimal、候选的 hunk 上下文仍在，但任务禁止“应用补丁”，所以“能否干净应用”只是静态文本结论，不是运行结论。
3. 页面：“规则沉默或访问失败的事项保留未知，不补成‘允许’。”
   - #764 的 `Run linters` 失败日志要管理员权限（403），具体是哪个 ruff 规则 unknown；我保留为未知，没有写成“代码质量不行”。
4. 页面：“关联 PR 尚未合并时，先协调重叠和剩余差量，不把提案当成已修复或排他占用。”
   - 协调动作需要本人到 GitHub 评论或改 PR。本卡禁止创建／评论，cattrs AI policy 也禁止 LLM 生成的 review comment，所以这个动作只能由人做，不能由 agent 代发。
5. 页面：“若下一步可实施，列出受当前变动影响、需要补跑的检查；投稿按已有授权另行执行。”
   - 本卡禁止运行项目／测试。我列出了 `just lint`、`just test`／`just cov`、Python 3.10–3.15＋pypy3.10 矩阵、`just docs` 和重点路径，但没有执行，不能声称候选在 current `main` 通过。
6. 页面：“**做到这里应能选出一个具体动作**：继续实现、补验证、请本人处理准入、按项目入口讨论，或收起已被上游覆盖的补丁。”
   - 我选“补验证＋按项目入口协调后再由本人投稿”：current `main` 未覆盖，两条 PR 未合并，候选还缺 `HISTORY.md` 条目和仓库测试布局；不新开第三条重复 PR。
7. 页面：“项目要求本人写的材料，就由本人写。”
   - cattrs AI policy 要求 human ownership、去掉 LLM co-author、能解释并承担每一行；投稿主体必须是本人，不是 agent。这一条决定了“现在可做”只到准备和协调，不含代投。

## 页面之外还翻了什么

- GitHub 公开 API：issue #761 的正文／评论／timeline；PR #764／#822 的 metadata、changed files／patch、comments／reviews、commit status／check-runs、head repo；`compare/bde101a...e9239b7`；latest release；`761 type:pr` 去重搜索。
- cattrs 仓库：`CONTRIBUTING.md`、`.github/AI_POLICY.md`、`.github/ISSUE_TEMPLATE.md`、`.github/SECURITY.md`、`README.md`、`pyproject.toml`、`Justfile`、`HISTORY.md`、`docs/preconf.md`、`.github/workflows/{main,codspeed,pypi-package,zizmor}.yml`、当前 `main` 的五个 preconf 源码、`tests/test_preconf.py` 的头部／尾部／锚点、`tests/preconf/` 列表、`v26.2.1` 的 json／pyyaml／msgspec。
- 页内其他项目规则（Codex／Goose／Serena／Ghostty／Linux）只在页面正文读到，没有另取；cattrs 的规则另从仓库现行文件核对。
- 未读：`experiments/cattrs-decimal/README.md`、a1dbv 历史处置、研究记录、其他任务结果、旧读者答案、私人会话与凭据。
- 做错的一处：列 `evidence/` 目录时顺带读了 `evidence/input-guards.json`，它不在任务列出的固定候选输入内。内容只涉及 CLI 参数守卫，没有影响判断，但属于超范围读取，记录在此。

## 核对

核对者未参与本次读者任务；以下按任务文件在工作目录独立复核，不以读者自报作为通过证据。

### 实测与可核事实

- 附页字节：`input.txt` 第 47–123 行与固定页 `docs/decisions/upstream-contributions.md@3f445adee874b68045fe718576ef2678782c2828` 逐行一致，仅多一行 `<!-- END EXACT PAGE -->`；worktree 的 HEAD 页面与该固定提交无 diff。附页材料成立。
- GitHub 公开 API 与固定 raw/blob（核对 2026-11-08）：
  - #761 open、无 label、2 条评论；搜索 `761` 仅命中 #764、#822 两个 PR。
  - #764 head `8c04cdb5`，base 分支当前 tip `f47bbe0`，open／unmerged、`mergeable=false`／dirty；13 个 check run 中仅 `Run linters` 失败，Python 3.10–3.14、pypy3.10、coverage、zizmor、package 均 success；Tinche 2026-06-28 评论 id `4826035821` 与读者引用一致。
  - #822 head `2e883761`，其父提交为 `bde101a`（落后 main 6 个提交），base 分支 tip `e9239b7`，open／unmerged、`mergeable=false`／dirty、0 个 check run（另有 readthedocs commit status success）、无评论。
  - 当前 main `e9239b7`；最新发布 v26.2.1（2026-09-26）。五个 preconf 源码与 `docs/preconf.md` 在 main 和 v26.2.1 都不含 Decimal。
  - 候选 patch 的 pre-image blob 与当前 main 相同：json `4a55659`、pyyaml `9d8f76e`、ujson `2ba5682`、orjson `27b0bc4`、`docs/preconf.md` `022426a`；msgspec 当前 `9f0a25b`（不等于 patch 的 `0623fda`），但三处 hunk 上下文仍在。
  - `compare/bde101a...e9239b7` ahead_by=6；改动文件为 `HISTORY.md`、`converters.py`（`cache_result` 文档串）、`msgspec.py`（deque 与 `adapted_fields`）、`tests/preconf/test_msgspec_cpython.py`、`uv.lock`。
  - 贡献规则：无 `AGENTS.md`、无 PR 模板；`CONTRIBUTING.md`、`.github/AI_POLICY.md`、`.github/ISSUE_TEMPLATE.md` 存在。CI 矩阵 3.10–3.15＋pypy3.10、`coverage report --fail-under=100`、`just lint` 的两条 ruff 命令均与读者所列一致。AI policy 的 human ownership、去 LLM co-author、禁无监督 agent、禁 LLM review comment、无 CLA 成立；未发现 DCO／vouch 步骤。
  - `replay-report.json`：source `bde101a5`、Python 3.12.14、baseline 12 passed／104 failed、patched 116、upstream 73。
- 读者未运行、未 apply：工作区除 `result.md` 与本记录外无改动，无 `.pytest_cache`／`__pycache__`／`.pyc`；现状与自述一致（只读命令是否为零无法从产物证明）。
- 隔离：读者上下文是否为新会话属接收端调用元数据，本次无法从工作目录独立证实，记为 unknown；未读取 worker／私有日志。
- #764 的 `Run linters` 日志需管理员权限（403），具体规则 unknown；读者保留未知，没有写成代码质量结论，正确。

### 8 条卡点逐条判断

| # | 判断 | 说明 |
|---|---|---|
| 1 | 页面已覆盖，读者正确（非缺陷） | 页面已写“常见文件不存在时…找等价入口”；读者据此用 CONTRIBUTING／AI_POLICY／ISSUE_TEMPLATE 并记录提交与日期。 |
| 2 | page（低） | 页面可明确“能否干净应用、是否在当前 main 通过”属运行结论；读者保留 unknown 的处理正确。 |
| 3 | 页面已覆盖，外部权限（非缺陷） | 403 来自 Actions 日志权限，页面“访问失败保留未知”已覆盖；读者处理正确。 |
| 4 | page | 页面要求“先协调”，但未写协调评论可能受项目 AI 政策与本卡禁评论限制；读者把动作交回本人，正确。 |
| 5 | 页面已覆盖，读者正确（非缺陷） | 页面已把补跑检查与投稿分开（“列出…需要补跑的检查；投稿按已有授权另行执行”）；读者未运行、只列清单，正确。 |
| 6 | 页面已覆盖，读者正确（非缺陷） | 页面要求选出一个具体动作，读者已选“补验证＋本人协调后投稿”。 |
| 7 | 页面已覆盖，读者正确（非缺陷） | 页面已写“项目要求本人写的材料，就由本人写”；读者照此排除代投。 |
| 8 | model | 列 `evidence/` 时多读 `input-guards.json`，超出固定输入；读者已自报，内容不影响判断。 |

### 遗漏（读者未意识到的错误）

1. **并入测试会撞 PyPy 可选依赖。** 候选 `test_decimal_preconf.py` 顶部无条件 `from msgspec import to_builtins`，`BACKENDS` 含 `msgspec`／`orjson`；仓库 `tests/test_preconf.py` 用 `NO_MSGSPEC`／`NO_ORJSON` 在 PyPy 跳过，`pyproject.toml` 里 msgspec／orjson 仅 CPython 安装，而 CI 矩阵含 pypy3.10。直接“并入 `tests/test_preconf.py`”会在 PyPy collection 失败；读者未指出需加 skip 保护或拆分后端测试。
2. **#822 的 base 表述会误导。** 读者写“base `e9239b7`”，但 #822 head 的父提交是 `bde101a`（落后 main 6 个提交），这才是“必须先 rebase”的依据；只写 API 的 base 分支 tip 会让人以为它已基于当前 main。
3. **CONTRIBUTING 的 README 条目未核。** 第 3 条要求把新功能加到 “README.rst” 的列表，但仓库只有 `README.md`，Features 是分节说明；读者只写“更新文档”，未记录该规则指向的文件不存在、是否需要 README 变更。
4. **pyyaml 行为并非“待固化”。** 候选 `test_decimal_preconf.py` 已用 `Decimal(str(incoming)) if backend == "pyyaml" else Decimal(incoming)` 固定了选择；真正待决定的是保留候选的 pyyaml 特例还是采用 #822 的统一 `Decimal(v)`，读者把“固化”与“取舍”混在一起。
5. **顺序与页面字面相反。** 页面写未合 PR 时“先协调重叠和剩余差量”，读者的下一步却是先重放／补验证再协调；本地重放不占用上游，但可能先投入后才知道 #822／#764 的剩余差量。

### 结论

`taskDone`: 是。读者给出了有据的下一步（继续五后端候选、不新开第三条 PR、先补 HISTORY／测试并补验、由本人协调后投稿），正确区分了未合 PR、当前 main、发布版与旧测试，未把静态对照写成运行结论，也未越权投稿或运行。主要缺口是并入测试时的 PyPy／可选依赖保护、#822 merge-base 的证据表述、README 规则与 pyyaml 取舍的细节，以及协调与重放的先后；页面值得补“只读卡里哪些结论只能是静态／协调评论的主体与 AI 政策”一句。
