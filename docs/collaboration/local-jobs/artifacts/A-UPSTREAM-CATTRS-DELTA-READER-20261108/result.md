# A-UPSTREAM-CATTRS-DELTA-READER-20261108 结果

观察时间：2026-11-08 UTC。只读公开 GitHub 与所附页面；未运行测试、未应用补丁、未创建或评论 issue／PR。

## 决定

**下一步：以现有五后端候选为实现基线继续推进，但先不要新开第三条 PR。** 先把候选重放到当前 `main`（`e9239b7`），补上仓库必需的 `HISTORY.md` 条目、把测试并入 `tests/test_preconf.py`，跑受影响验证；然后由本人在项目入口（#761／#822／#764）与维护者协调，决定是把 ujson／orjson／msgspec 的剩余差量补进 #822（或 #764），还是在其落地后补一条不重叠的跟进 PR。当前 `main` 和最新发布 `v26.2.1` 都没有 Decimal 支持，因此既不能收起候选，也不能把任一 open PR 当成已修复或排他占用。

理由：

- 维护者在 #764 明确说这是“good change”，并要求扩到 ujson、orjson、msgspec，且“有些可能已经做对，就让它默认处理”。现有候选正好是五后端：json／ujson／orjson／pyyaml 注册双向 hook，msgspec 只注册 structure hook、保留原生 unstructure，比两条在途 PR 更贴合该要求。
- #764（2026-06-26 创建，base `f47bbe0`，dirty；CI 中仅 `Run linters` 失败，其余 Python 矩阵与覆盖率通过）和 #822（2026-11-03 创建，base `e9239b7`，dirty，0 个 check run）都只改 json＋pyyaml，且都 open／unmerged、`mergeable=false`。两者都必须先 rebase：#822 的测试片段仍能对上当前 `tests/test_preconf.py`，但它的 `HISTORY.md` 片段与当前 `NEXT` 顶部新增条目冲突；#764 的测试片段按旧文件尾部定位，已对不上当前文件。
- 当前 `main` 的 `src/cattrs/preconf/{json,pyyaml,ujson,orjson}.py` 与候选补丁的 pre-image blob 一致；`msgspec.py` 在候选基线之后变了（deque 修复与 `adapted_fields`），但候选 hunk 的上下文仍在。以上只是静态文本核对，未 apply，不能当作“可干净应用”的运行结论。
- 候选相对 `bde101a` 只落后 6 个提交：`converters.py` 是 `cache_result` 文档字符串修正，`msgspec.py` 是 deque／`adapted_fields` 修正，另 `HISTORY.md`、`tests/preconf/test_msgspec_cpython.py`、`uv.lock`。没有证据表明 Decimal 行为被上游覆盖，但旧 3.12.14 结果只对应 `bde101a`，不能直接搬作当前 `main` 的结果。

仍缺的证据／决定：

1. 协调对象由人决定：#822 较新且带 `HISTORY.md` 条目，但 0 CI、无维护者回复；#764 有维护者明确反馈但已陈旧、测试补丁冲突、lint 失败。PR 元数据不能替代这个决定。
2. 候选只在 Python 3.12.14、cattrs `bde101a` 上验证；需在 CI 矩阵的 Python 3.10–3.15 与 pypy3.10 上重跑，覆盖率按仓库要求 100%。
3. #764 的 lint 失败具体规则 unknown：Actions 日志需管理员权限（返回 403）。rebase 后必须以 `just lint` 复核，不能沿用“测试过了”。
4. pyyaml 数值输入存在行为差：#822 用 `Decimal(v)`（YAML 把数字解析成 float 后再转 Decimal，可能带二进制尾差），候选与 #764 用 `Decimal(str(v))`。需决定并让测试固化；字符串往返两者一致。
5. 候选测试是独立 `test_decimal_preconf.py`，未并入仓库测试布局；还缺 `HISTORY.md` 的 `NEXT` 条目（CONTRIBUTING 第 5 条要求）。
6. 准入：cattrs 接受 bugfix PR、允许 AI 辅助，但要求由能解释并承担每一行的人署名提交、去掉 LLM co-author，不允许无人监督的 agent 提交，也不允许 LLM 生成的 review comment。没有 CLA／DCO／vouch 个人步骤。

需要补跑的检查（受本次变动影响，本卡未执行）：

- `just lint`：`ruff check src/ tests/ bench` 与 `ruff format --check src tests docs/conf.py`。
- `just test`／`just cov`，并在 CI 的 Python 3.10–3.15、pypy3.10 矩阵上跑；覆盖率 100%。
- `just docs`：`docs/preconf.md` 有改动，需过 Sphinx doctest／构建。
- 重点路径：五个 preconf 的 `dumps`／`loads` 精确往返；msgspec 原生 unstructure／dumps hook 在 #803／#819 之后的缓存行为；pyyaml 对 float 输入采用 `Decimal(str(v))` 的契约；plain `Converter` 行为不变。

## 证据

- **当前贡献入口**：cattrs 没有 `AGENTS.md`，也没有 PR 模板；等价入口是 `CONTRIBUTING.md`、`.github/AI_POLICY.md`、`.github/ISSUE_TEMPLATE.md`，并由 `README.md`、`pyproject.toml`、`Justfile`、`HISTORY.md`、`docs/preconf.md` 补充。固定于 `e9239b7082206f18e3cec873b11451aff35beb9c`。来源：[CONTRIBUTING.md](https://github.com/python-attrs/cattrs/blob/e9239b7082206f18e3cec873b11451aff35beb9c/CONTRIBUTING.md)、[AI_POLICY.md](https://github.com/python-attrs/cattrs/blob/e9239b7082206f18e3cec873b11451aff35beb9c/.github/AI_POLICY.md)、[ISSUE_TEMPLATE.md](https://github.com/python-attrs/cattrs/blob/e9239b7082206f18e3cec873b11451aff35beb9c/.github/ISSUE_TEMPLATE.md)。核对 2026-11-08。
- **准入、AI 与投稿主体**：项目接受 bug／feature 贡献；要求 PR 带测试、更新文档、加 `HISTORY.md`、覆盖所有支持的 Python 版本；AI 辅助允许，但提交者须拥有版权、理解并承担全部改动，LLM 不能出现在 `Co-authored-by`，禁止无人监督的 agent 流程和 LLM 生成的 review comment；无 CLA／DCO／vouch。来源同上及 [Justfile](https://github.com/python-attrs/cattrs/blob/e9239b7082206f18e3cec873b11451aff35beb9c/Justfile)、[pyproject.toml](https://github.com/python-attrs/cattrs/blob/e9239b7082206f18e3cec873b11451aff35beb9c/pyproject.toml)。核对 2026-11-08。
- **需求与在途提案**：#761 open、无 label、2 条评论；仅 #764 与 #822 引用它，均 open／unmerged、`mergeable=false`／dirty。#764 head `8c04cdb5`，维护者评论见 [issuecomment-4826035821](https://github.com/python-attrs/cattrs/pull/764#issuecomment-4826035821)（2026-06-28）。#822 head `2e883761`，无评论、0 check run。来源：[#761](https://github.com/python-attrs/cattrs/issues/761)、[#764](https://github.com/python-attrs/cattrs/pull/764)、[#822](https://github.com/python-attrs/cattrs/pull/822)。核对 2026-11-08。
- **当前源码与发布**：`main`（`e9239b7`）的五个 preconf 源码都没有 `Decimal`／`decimal`；最新发布 `v26.2.1`（2026-09-26）也没有。候选补丁的 pre-image blob 与当前 `main` 的 json／pyyaml／ujson／orjson／`docs/preconf.md` 一致，msgspec 的 hunk 上下文仍在。来源：[json.py@main](https://github.com/python-attrs/cattrs/blob/e9239b7082206f18e3cec873b11451aff35beb9c/src/cattrs/preconf/json.py)、[v26.2.1](https://github.com/python-attrs/cattrs/releases/tag/v26.2.1)、[候选补丁](../../../../../experiments/cattrs-decimal/decimal-preconf.patch)。核对 2026-11-08。
- **候选旧证据**：`evidence/replay-report.json` 记录 `source_commit=bde101a5`、Python 3.12.14，baseline 12 passed／104 failed，patched 116 passed，upstream 73 passed；`baseline-encoding.txt`／`baseline-roundtrips.txt` 给出五个后端的失败形态。这些只对应旧基线与旧版本。来源：[replay-report.json](../../../../../experiments/cattrs-decimal/evidence/replay-report.json)、[baseline-encoding.txt](../../../../../experiments/cattrs-decimal/evidence/baseline-encoding.txt)、[baseline-roundtrips.txt](../../../../../experiments/cattrs-decimal/evidence/baseline-roundtrips.txt)。核对 2026-11-08。

## 页外帮助

- GitHub 公开 API 的 PR `files`／patch 直接给出两条提案的差量、测试与 `HISTORY.md` 改动位置，可据此分开查文本冲突与行为冲突。
- `compare/bde101a...e9239b7` 显示候选基线只落后 6 个提交，把需重验的源码缩到 `converters.py` 与 `msgspec.py`，避免把“当前 main 变了”泛化成全仓重验。
- `pyproject.toml`、`Justfile`、`.github/workflows/main.yml` 给出实际检查入口和 Python 矩阵（3.10–3.15、pypy3.10）、100% 覆盖率门槛。

## 实际卡点

- #764 的 `Run linters` 失败日志需管理员权限（403），具体规则 unknown；没有把空信息补成结论。
- 本卡禁止运行项目／测试与 apply 补丁，候选在 current `main` 的实际通过情况 unknown，只保留静态文本核对。
- 与在途 PR 的协调、以及向项目入口发言，需要本人执行；cattrs AI policy 也不允许 agent 无人监督投稿或发 LLM review comment。
- 候选缺少 `HISTORY.md` 条目与仓库测试布局，这两项必须在投稿前补齐。

## 未运行范围

未安装依赖；未运行 `just lint`／`just test`／`just cov`／`just docs`；未应用候选补丁；未创建、重开或评论 issue／PR；未 fork、未签协议、未申请 CI、未改账号权限；未运行浏览器或额外模型；未读取 cattrs 实验 README、a1dbv 历史处置／研究记录、其他任务结果或旧读者答案。
