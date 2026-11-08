# A-UPSTREAM-RICH-GATE-READER-20261108 读者结论

- 日期：2026-11-08
- 页面：`docs/decisions/upstream-contributions.md@0c91ee9a`（16522 字节，SHA256 `11a3ab3e6fc758d006fb35b22f9b2cf9ca1d27de55919d47136d1de97ee4acf1`）
- 方式：只读静态核对。未安装依赖、未应用补丁、未运行 Rich 或测试、未创建 issue／PR／评论、未修改产品。
- 附页核对：任务所附页面与仓库页面文件逐字节一致（同 16522 字节、同 SHA256），独立性按未读旧读者答案处理。
- 隔离：未读本仓 Rich 实验 README、历史处置、其他任务结果或旧读者答案，未读私人会话、配置、凭据与用量日志。

## 现在可做的下一步

**暂不投稿，也不再造第四份同题实现；等维护者在 #4246 对已提出的 `amount == 0` 早退方案明确批准后，再由一名符合 Rich 规则、能在该 issue 发言并愿意承担后续的人协调唯一提交。现有候选保持原样，不重写核心实现。**

具体动作只有两步：

1. 把候选挂起，盯 #4246 是否出现 @willmcgugan 对方案的明确答复；在此之前不创建 PR、不再追加同题评论、不新写实现。
2. 若维护者批准，先由一名贡献者与另外几条同题提案协调，确定唯一提交者；现有候选可作为实现与回归测试来源，但它的核心修复与已有提议相同，不能作为另开 PR 的理由。

依据（截至 2026-11-07T15:25:56Z，issue 最后一次更新）：

- Rich `AI_POLICY.md`（main `3a109ccd`）要求 AI 生成 PR 必须“link to a issue or discussion where a solution has been approved by a maintainer (@willmcgugan)”；`.github/pull_request_template.md` 同一条件写为“only if @willmcgugan has responded on an issue or discussion”。`CONTRIBUTING.md` 虽允许清晰 bugfix 直接提 PR，但 AI 使用受上述政策约束。
- #4246 仍为 open、仅 `Needs triage`，无维护者评论或批准；willmcgugan 只有被 mention 与 subscribe 事件（2026-11-04、2026-11-07），没有发言。
- 三条公开评论已经提出同一方案：sunxiuguo（2026-11-01）、Sudhakar7J（2026-11-04）、quietkernel-stack（2026-11-07），均为 `right_crop` 中 `if amount == 0: return` 的早退，并等待维护者确认。

## 与已有提议及候选的关系

- **不是“已被上游覆盖”，而是“与现有提案重复且缺维护者批准”。** 当前 main 的 `rich/text.py`（`right_crop`，1169–1183 行）仍是 `max_offset = len(self.plain) - amount`、`self.plain[:-amount]`、`self._length -= amount`，没有零值 guard；`remove_suffix("")` 仍经 `self.right_crop(0)` 进入同一路径。没有发现关联 PR、已合实现或已修复发行版。这是核心库公共方法上的通用 bugfix，不是项目当前不收的新 feature，PR 模板的 feature 限制不构成拒绝理由。
- **候选的核心实现与三条评论相同。** `candidate.patch` 的核心就是 `right_crop` 中两行早退；`verification.json` 声明的 patch SHA256 `0ec7c0c9…` 与实际取到的原字节一致。候选的增量只有测试：参数化覆盖空串／`abc`／`界🙂`、`crop`／`suffix` 两条路径、spans、`cell_len`、后续 `append`／`join` 与 Console 输出；这些可在批准后作为测试补充，不构成新实现。
- **候选基线 `9d8f9a3` 是当前 main 的祖先**（merge-base 即该提交，main 领先 10 个提交）。`rich/text.py` 的 base→main 差分为 487 行，主要是 typing 现代化／Python 3.15／uv 工具链调整；差分中没有触及 `right_crop` 或 `remove_suffix` 的文本块，因此静态判断函数行为未变，但这不等于当前版本已运行验证。
- **提案既不等于已修复，也不等于排他占用。** 三条评论都只是提案；没有 PR 可协调，也没有人获得维护者批准。

## 仍缺的证据／决定及负责主体

| 缺什么 | 负责主体 | 当前状态 |
|---|---|---|
| 维护者对方案（`amount == 0` 早退，或改为 clamp 等）的明确批准 | @willmcgugan（维护者） | 缺；issue 无维护者回复 |
| 唯一提交者与重叠协调（三条同题评论之间） | 符合 Rich 规则、能在 issue 发言的贡献者 | 未定；无 PR，只读任务不能代发评论 |
| AI 披露：实际 agent 名称与参与程度 | 提交者 | 缺；候选材料没有记录所用工具，`verification.json` 未写 agent |
| 当前 main 上的测试与工具链结果 | 提交者／上游 CI | 未运行；候选只有 2026-11-05、Linux、Python 3.12.14、旧 Poetry／pytest 记录 |
| 补丁与测试在 current main 的可应用性 | 提交者 | 未验证；`tests/test_text.py` 在 base→main 间有格式与 typing 改动，插入行号已偏移 |
| `CHANGELOG.md` 的 Unreleased Fixed 条目、首次贡献的 `CONTRIBUTORS.md` | 提交者 | 缺；当前 Unreleased 只有 Changed 三项 |
| 是否存在其他 discussion 中的批准 | 维护者／提交者 | 未发现 #4246 链接或讨论批准；未穷尽，保留 unknown |

## 方案获准、准入、合入、发行与运行结果的区分

| 维度 | 现状（2026-11-08 静态核对） |
|---|---|
| 方案获准 | 否。三条同题提案 + 候选都未获维护者批准 |
| 作者准入 | AI 生成 PR 须维护者先在 issue／discussion 批准方案并披露 agent；这三个入口未见 CLA／DCO／vouch，也未见必须由本人亲自写的条款；提交者身份与账号权限未定 |
| 已合代码 | 否。main `3a109ccd` 的 `right_crop` 仍无 guard；搜索 `4246`／`right_crop`／`remove_suffix` 未发现相关 PR 或合并 |
| 发布版 | Rich 15.0.0（2026-04-12 发布）的 `rich/text.py` 与候选基线同为 blob `7e087a4e…`，静态判断含此问题；`pyproject.toml` 的 15.1.0 尚未发布；无已修复发行版 |
| 旧运行结果 | 仅对应候选 `9d8f9a3`、Linux、Python 3.12.14、Poetry 1.3.1／pytest 7.4.4；不能搬作当前 main 或 15.1.0 的结果 |
| 本次静态核对 | 页面附页字节、issue 全量公开正文与讨论、当前 main／v15.0.0／候选基线的源码与差分、贡献规则与模板、发布与 CI 元数据 |

## 若继续实施，受当前变化影响的检查

- 适配 current main：`tests/test_text.py` 已被 typing／格式改动，候选测试的插入行号与文件哈希都需重核；不要直接套旧补丁。
- 按当前工具链重跑：`uv sync --locked`、`make format-check`（black 26）、`make typecheck`（mypy strict）、`uv run pytest … tests/`；候选的 Poetry／pytest 7.4.4 环境已过时。
- 走上游 CI 矩阵（`.github/workflows/pythonpackage.yml`）：Windows／Ubuntu／macOS × Python 3.10–3.15，排除 Windows 3.13；本地 Linux／3.12.14 不能代表矩阵。
- 回归重点：`right_crop(0)` 与 `remove_suffix("")` 保持文本、长度、spans、`cell_len` 与后续 append／join 一致；正数、非匹配后缀、负数和超长 amount 的既有行为不变；`remove_suffix("")` 之外的两个内部调用点 `rstrip_end`、`set_length` 不会传入 0，需在改动后复核。
- 提交前补 `CHANGELOG.md` Unreleased Fixed 与首次贡献的 `CONTRIBUTORS.md`，按 PR 模板勾选并写 AI 披露、链接 #4246；提交前再查 issue／PR 状态，避免与同题提案重复。
- 当前未做：补丁应用检查、任何测试运行、跨平台／版本验证、提交或评论。

## 原文入口

- Rich `AI_POLICY.md`：https://github.com/Textualize/rich/blob/3a109ccdffe5b2d0e30684a304fbd388e99ce57b/AI_POLICY.md
- Rich `CONTRIBUTING.md`：https://github.com/Textualize/rich/blob/3a109ccdffe5b2d0e30684a304fbd388e99ce57b/CONTRIBUTING.md
- Rich PR 模板：https://github.com/Textualize/rich/blob/3a109ccdffe5b2d0e30684a304fbd388e99ce57b/.github/pull_request_template.md
- Rich CI：https://github.com/Textualize/rich/blob/3a109ccdffe5b2d0e30684a304fbd388e99ce57b/.github/workflows/pythonpackage.yml
- #4246 正文与讨论：https://github.com/Textualize/rich/issues/4246
- 当前 `rich/text.py`：https://github.com/Textualize/rich/blob/3a109ccdffe5b2d0e30684a304fbd388e99ce57b/rich/text.py
- 15.0.0 的 `rich/text.py`：https://github.com/Textualize/rich/blob/v15.0.0/rich/text.py
- 候选 patch：https://github.com/dbvv1/a1dbv/blob/fde4fda1e37c1cf42e5a62b0d8040a64f5c280d6/experiments/rich-zero-crop-candidate/candidate.patch

## 页外核读与未运行范围

页外实际核读：Rich 的 CONTRIBUTING、AI_POLICY、PR 模板、bug report 模板、三条 workflow、Makefile、pyproject.toml、.python-version、CHANGELOG、`rich/text.py`（main／候选基线／v15.0.0 三份）、`tests/test_text.py`（main／基线）、文档 `text.rst` 与 `reference.rst`；GitHub API 的 issue 正文／comments／events／timeline、搜索 `4246`／`right_crop`／`remove_suffix`、repo 元数据、branches、latest release、tags、`compare 9d8f9a3...main`；以及本题允许的候选 `candidate.patch`、`verification.json`、`LICENSE` 原字节。

未运行／未知：任何 Rich 测试、补丁应用或运行环境；GitHub Discussions 的穷尽检索（无相关结果，但不据此断言不存在）；全仓 `right_crop` 调用点扫描（full tree API 返回 504，只核了 `rich/text.py` 内调用点）；提交者身份与 AI 工具名称。
