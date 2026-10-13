# oMLX：AI 归属的一行修复合入后，维护者补全真实输入探针；后续严格模板兼容性未闭环

## 结论及采用边界

可作为“接收者确实在合并后继续修改”的案例。这里的第二次修改有独立 commit 和维护者自己的明确说明，涉及运行逻辑、能力缓存键和回归测试，不只是审批或 CI。不能写成“合并后出了事故，维护者补救成功”：探针缺口在合并前已被贡献方明示；合并后的修改是在补全这个已知边界。后来其他模型仍出现类似症状，且另一个 issue 提供了严格模板与安全 fallback 不兼容的具体解释，但没有最终恢复确认。

核实时间：2026-10-13（UTC+8）。**[一手：公开 issue、PR、固定提交与测试源码；社区：评论中的运行报告；研究：采用判断]** 初稿为来源阅读；同日云端增补[第 7 节](#7-云端独立执行相同测试与实际渲染路径)的原函数／测试类局部执行，未运行模型、完整服务或真实缓存。

## 1. 原始贡献、AI 归属与已知 caveat

2026-08-02，ivibes 在 [issue #2483](https://github.com/jundot/omlx/issues/2483) 报告：Claude Code 在工具结果之后插入 system 提醒，oMLX 把它们集中到开头，导致原本可追加的会话前缀发生变化。

[本地复测及归属声明](https://github.com/jundot/omlx/issues/2483#issuecomment-5160009467)给出一行补丁，允许 placement classifier 的 predecessor 为 user 或 tool。该 AI 署名评论报告在 KAT 模板上重启服务器后，缓存复用随会话增长，并附实时流量指标。

同一评论明确把调查、补丁和该评论归属于运行在 Claude Code 中的 Claude（Opus 5）。它也**在合并前**指出：现有能力探针只检查 system-after-user；允许 tool predecessor 后，探针并未真的验证 system-after-tool。对前驱角色敏感的模板可能因此获得错误的支持判断。故“未被测试的输入”不是维护者合并后才首次发现。

归属限度：这是作者披露，不是独立模型执行审计。可以说“AI 归属的一行修复随后被合入”；不能说 PR 的全部制作或后续维护者 commit 都由 AI 完成。无人工工时、提示轮次、总维护成本或对照生产率数据。

## 2. 合入的一行修复

- PR：[q-p 的 #2753](https://github.com/jundot/omlx/pull/2753)，jundot 于 2026-08-17 合入
- 固定 commit：[d5637c5428f7c2b3bcd0d87a3dcb42d24663c123](https://github.com/jundot/omlx/commit/d5637c5428f7c2b3bcd0d87a3dcb42d24663c123)
- 仅改 omlx/api/utils.py，一行增加、一行删除：`prev_role != "user"` 改为 `prev_role not in ("user", "tool")`
- 这与 ivibes 评论中披露的补丁相同；未找到 q-p 本人制作 PR 的模型过程，不能替其推断

## 3. 真正的 post-merge 第二次修改

[jundot 的 PR 评论](https://github.com/jundot/omlx/pull/2753#issuecomment-5317553327)明确表示，合并后在 main 补上真实 tool predecessor 的能力探针及 between/tail 回归覆盖。

独立 commit：[bddc9f883cca1065b6c887713b55fbe6f920ec17](https://github.com/jundot/omlx/commit/bddc9f883cca1065b6c887713b55fbe6f920ec17)，标题为 `fix: validate tool-adjacent mid-system templates (#2483)`，author/committer 均为 jundot，提交时间为 2026-08-18 00:13:55（UTC+8），其声明发表于 00:16:49。

### 源码核对：补的不是“再跑一遍同样测试”

该 diff 同时修改 omlx/api/utils.py 与 tests/test_api_utils.py：

1. classifier 从只返回 tail/between，改为返回 `(preceding_role, placement)`；使真实输入的前驱角色传到能力探针
2. 探针新增 `preceding_role` 参数；tool 情况构建 user → assistant(tool_calls) → tool(tool_call_id 匹配) → system，而非把原先的 user 探针结果当作通用能力
3. 检查 system 标记是否出现在相应的 predecessor 标记之后；between 还检查其后 assistant 标记
4. 将 `preceding_role` 纳入能力缓存键，避免同一模板“user 后支持”结果被用于“tool 后”
5. 新增 valid tool-history 测试替身，要求 tool 有相匹配的 assistant tool_call；新增只允许 user 后 system 的模板替身
6. 新增 between、tail、拒绝后 fallback，以及 user/tool 探针缓存隔离测试

between/tail 回归明确断言消息保持原位，缓存隔离测试区分 user/tool 的能力结果；不能把所有测试压缩为“只验证可渲染”。探针自身验证模板渲染位置，不证明模型层面的指令语义，也未测端到端缓存命中或性能。

## 4. 后来的真实输入：另一类兼容性边界

后续时间线：

- 2026-08-21，[JJOne123 报告 Ornith 上仍有相似缓存症状](https://github.com/jundot/omlx/issues/2483#issuecomment-5370629460)
- 2026-08-22，[q-p 要求查看前缀变化的真实 prompt 序列](https://github.com/jundot/omlx/issues/2483#issuecomment-5378896918)，以分辨同因或不同因
- 2026-08-29，[q-p 报告 Qwen 3.8 上再现相似症状](https://github.com/jundot/omlx/issues/2483#issuecomment-5465098630)
- 2026-08-30，q-p 新开 [#3316](https://github.com/jundot/omlx/issues/3316)，给出真实请求中的 role 序列；这里的解释比“缓存又坏了”更具体

#3316 的配置使用要求 system 位于开头的严格模板。真实序列中有 tool → system → assistant，无法把 system 提醒并到相邻的安全 user 文本。因此，即使 classifier 已接受 tool，且探针已经正确识别模板不支持，程序仍会落入前置合并 fallback，失去这一部分的前缀复用收益。

### 第二个边界与第一个漏项必须分开

- 第一项是**能力探针输入不匹配**：只测 user，却允许 tool。维护者的 post-merge commit 确实修了它
- 第二项是**模板真实不支持，且安全降级没有可用目标**：准确拒绝不代表仍能保持缓存。不能把它写成“第二次修复未生效”或“同一个 bug 回归”

[固定源码](https://github.com/jundot/omlx/blob/bddc9f883cca1065b6c887713b55fbe6f920ec17/omlx/api/utils.py)中 `_downgrade_mid_system_to_user_notes` 明确只把 unsupported system 放入相邻安全 user 文本，并刻意拒绝有风险的 tool-call 边界和多模态内容。tool → system → assistant 的两侧都不是可写入的安全 user，因此返回 None；`unsupported_fallback` 再调用 `strict_fallback`，后者执行 `_consolidate_system_messages`。

尤其值得注明：post-merge 新增的 `test_falls_back_when_template_rejects_system_after_tool` 已断言 system 被移到开头，并让严格测试模板能继续渲染。该测试检验的是拒绝后的合法 fallback，不是每种模板仍能保持前缀缓存。后来报告的性能代价可以与这个测试同时成立，不能把绿灯解释成所有输入的缓存目标都满足。

没有源码证据把 Ornith 报告也归为同一机制；仅将其保留为相似症状。#3316 的源码解释与固定版本路径相符，但没有拿到报告者当时的完整运行环境重现。

## 5. 后续用户修改与未闭环

q-p 随后在 [#3316 评论](https://github.com/jundot/omlx/issues/3316#issuecomment-5477417097)建议在 chat template 层处理，并附完整自定义模板，让非首条 system/developer 在原位渲染；其明确说明仅轻度测试。

可以记录为实际给出了后续修改方案，不能当作已验证部署、上游合入或用户确认恢复。#3316 虽为 closed/completed，但只有该一条评论，没有确认重测成功，关闭状态不足以补齐这一证据缺口。

## 6. 对采用建议的影响

修复扩大可接受输入时，同步更新能力探针、缓存键和回归覆盖，并在已有 PR 说明里写清实际模板与 fallback 的代价。对性能与兼容性修复，核对断言是否覆盖用户目标：正确拒绝并合法降级，可能仍牺牲原本追求的缓存复用。合并后相似症状先对照真实请求，不自动归为同一回归。

此案不支持增加通用交接模板，也不能证明 Claude 独立完成 PR、维护者在事故后才发现未知缺口，或所有模型已恢复。报告中的使用结果属于评论自述；没有人工工时、成本收益或完整运行环境，不从日历等待推算接管成本。


## 7. 云端独立执行：相同测试与实际渲染路径

2026-10-13，审计仓库 `b9fddfb94a16940baff54f737fc2ffd7c48cc8ce` 时，重新取得上面两版源码，执行同一份修订后测试类。环境为 Python 3.12；不安装 MLX、模型或上游完整依赖。**[经验：本仓库确定性执行]**

### 结果与解释

| 固定实现 | 同一测试类的 22 个方法 | 解释 |
|---|---|---|
| 一行修复 `d5637c5` | 20 通过、1 断言失败、1 执行错误 | `test_falls_back_when_template_rejects_system_after_tool` 是行为断言失败；`test_probe_cache_key_distinguishes_preceding_role` 因旧接口没有 `preceding_role` 参数而报 TypeError，不能计成第二个行为缺陷 |
| 维护者修订 `bddc9f8` | 22 通过 | 在所抽取函数和测试替身范围内，断言均满足；不是整份上游测试套件通过 |

再用两版都具有的 `prepare_system_messages_for_template` 接口，给出完整的 assistant tool-call／tool-result 配对，在 tool 后追加 system；分别位于末尾（tail）或后面还有 assistant（between）。合成输入统一含 leading system，调用 `user_note_safe` 策略。8 次结果：

| 上游测试替身 | 一行修复：tail / between | 维护者修订：tail / between |
|---|---|---|
| `ToolHistoryTokenizer`：检查工具调用配对、允许中间 system | 两次均保持消息原位且可渲染 | 两次均保持消息原位且可渲染 |
| `UserOnlyMidSystemTokenizer`：中间 system 只能跟在 user 后 | 两次均原位保留，实际渲染均抛 ValueError | 两次均把 system 合并到开头，实际渲染均成功 |

这个矩阵绕开了新参数不兼容的问题，复现了旧能力探针给出过宽支持判断的实际后果。也说明“支持 tool 的两个新增用例通过”本身不能证明维护者修订有增量——它们在一行版本已通过；增量在区分哪些模板不能这样处理。

最后只在修订后，比较同一输入 `H` 与 `H + system提醒` 的渲染结果。支持 tool 的替身保持原文本为前缀；user-only 替身将 `Runtime tip` 合入最前面的 `Root`，原文本不再是新文本的前缀。两次均可渲染。**这一观察直接支持“合法降级和前缀保留可以分离”，不是缓存命中率、计费或性能测量。** 不把字符串变化换算为 token 损失，也不把此替身等同于 #3316 的真实 Qwen 模板。

### 执行范围为什么有限

通过 AST 原样提取 20 个相关函数、所需常量与修订后的整个 `TestPrepareSystemMessagesForTemplate` 类，函数体和上游断言均未改写；只给命名空间提供 `typing.Any`。每个测试／矩阵案例重新建立命名空间，测试内部的缓存仍保留，因而隔离用例确实比较同一缓存内的 user/tool 两种探针。没有导入模块的其余代码、pytest fixture 或服务入口；这不能排除应用装配、真实 Jinja 模板、tokenization、模型语义或缓存实现中的其他问题。

运行前核对源码 SHA256，并拒绝 `python -O`，避免上游 assert 被优化删除。结果写为 [54 行原始 JSONL](data/omlx-probe-20261013.jsonl)：44 次测试、8 次共有接口渲染、2 次追加前缀比较，不是 54 个独立上游测试。文件 SHA256：`88016cf3e3523eaaf9394f05399a38c9bccde5faf3743bd2c482975e6d416ae2`。

### 完整复现程序

将以下固定文件下载到同一临时目录，按表中本地文件名保存；程序本身不联网。源码的完整 SHA256 在程序中硬编码校验。将下方程序保存为 `reproduce.py`，用 `python3 reproduce.py SOURCE_DIRECTORY > results.jsonl` 运行；stdout 是逐次 JSON，stderr 是测试分类汇总。只使用 Python 标准库，不要求在本仓库安装第三方依赖。

| 本地文件名 | 固定来源 |
|---|---|
| `omlx-before-utils.txt` | [d5637c5 / omlx/api/utils.py](https://raw.githubusercontent.com/jundot/omlx/d5637c5428f7c2b3bcd0d87a3dcb42d24663c123/omlx/api/utils.py) |
| `omlx-after-utils.txt` | [bddc9f8 / omlx/api/utils.py](https://raw.githubusercontent.com/jundot/omlx/bddc9f883cca1065b6c887713b55fbe6f920ec17/omlx/api/utils.py) |
| `omlx-after-tests.txt` | [bddc9f8 / tests/test_api_utils.py](https://raw.githubusercontent.com/jundot/omlx/bddc9f883cca1065b6c887713b55fbe6f920ec17/tests/test_api_utils.py) |

```python
import ast
import collections
import copy
import hashlib
import json
from pathlib import Path
import sys
from typing import Any

if not __debug__:
  raise SystemExit("Run without -O: upstream tests use assert")
if len(sys.argv) != 2:
  raise SystemExit("Usage: python3 reproduce.py SOURCE_DIRECTORY")
root = Path(sys.argv[1])
hashes = {
  "omlx-before-utils.txt": "1238bd9cc534fa94b1a45dfcfc083d090911cceb8a087fca8ea886847cf3ae46",
  "omlx-after-utils.txt": "f3f0b15b88d8900177cc21520b8598f8ac9b740439b244d39aa968f7cc8da201",
  "omlx-after-tests.txt": "d443a985308813b98b6156700a18375378994221d38f1ac66b2b44048624066c",
}
trees = {}
for name, expected in hashes.items():
  data = (root / name).read_bytes()
  if hashlib.sha256(data).hexdigest() != expected:
    raise SystemExit(f"Source hash mismatch: {name}")
  trees[name] = ast.parse(data.decode("utf-8"))
names = set("""
_extract_text_from_content_list _freeze_template_value
_mid_system_probe_cache_key _apply_mid_system_probe_template
chat_template_preserves_mid_system _system_content_as_text _is_system_role
_merge_consecutive_system_messages _mid_system_placement_kinds
has_nonleading_system_message _is_text_only_content_list
_is_safe_user_note_target _message_has_tool_calls _format_system_note
_merge_note_text _rewrite_user_content_with_note
_downgrade_mid_system_to_user_notes prepare_system_messages_for_template
_consolidate_system_messages _merge_consecutive_roles
""".split())
test_class = next(n for n in trees["omlx-after-tests.txt"].body
                  if isinstance(n, ast.ClassDef)
                  and n.name == "TestPrepareSystemMessagesForTemplate")
methods = [n.name for n in test_class.body
           if isinstance(n, ast.FunctionDef) and n.name.startswith("test_")]
if len(methods) != 22:
  raise SystemExit(f"Unexpected test count: {len(methods)}")

def load(version):
  nodes = []
  found = set()
  for node in trees[f"omlx-{version}-utils.txt"].body:
    if isinstance(node, ast.FunctionDef) and node.name in names:
      nodes.append(node)
      found.add(node.name)
    elif isinstance(node, (ast.Assign, ast.AnnAssign)):
      targets = node.targets if isinstance(node, ast.Assign) else [node.target]
      if any(isinstance(t, ast.Name) and
             (t.id.startswith("_MID_SYSTEM_") or t.id in
              {"_MERGEABLE_ROLES", "_PRESERVE_BOUNDARY_KEY"}) for t in targets):
        nodes.append(node)
  if found != names:
    raise RuntimeError(f"Missing functions: {names - found}")
  namespace = {"Any": Any}
  exec(compile(ast.Module(body=nodes + [test_class], type_ignores=[]),
               f"extracted-{version}", "exec"), namespace)
  return namespace, namespace[test_class.name]()

def emit(**row):
  print(json.dumps(row, ensure_ascii=False, sort_keys=True))

for version in ("before", "after"):
  counts = collections.Counter()
  for name in methods:
    namespace, case = load(version)
    status, detail = "pass", ""
    try:
      getattr(case, name)()
    except AssertionError as error:
      status, detail = "assertion_failure", str(error)
    except Exception as error:
      status, detail = "error", f"{type(error).__name__}: {error}"
    counts[status] += 1
    emit(kind="upstream_test", version=version, test=name,
         result=status, detail=detail)
  print(version, dict(counts), file=sys.stderr)

history = [
  {"role": "system", "content": "Root"},
  {"role": "user", "content": "Use the lookup tool"},
  {"role": "assistant", "content": "", "tool_calls": [
    {"id": "call_1", "function": {"name": "lookup", "arguments": {}}}]},
  {"role": "tool", "tool_call_id": "call_1", "content": "result"},
]
reminder = {"role": "system", "content": "Runtime tip"}
for version in ("before", "after"):
  for tokenizer_name in ("ToolHistoryTokenizer", "UserOnlyMidSystemTokenizer"):
    for placement in ("tail", "between"):
      namespace, case = load(version)
      tokenizer = getattr(case, tokenizer_name)()
      messages = copy.deepcopy(history + [reminder] +
                   ([{"role": "assistant", "content": "Done"}]
                    if placement == "between" else []))
      result = namespace["prepare_system_messages_for_template"](
        messages, tokenizer, unsupported_mid_system_policy="user_note_safe")
      status, detail = "pass", ""
      try:
        tokenizer.apply_chat_template(result)
      except Exception as error:
        status, detail = "error", f"{type(error).__name__}: {error}"
      emit(kind="render_matrix", version=version, tokenizer=tokenizer_name,
           placement=placement, unchanged=result == messages,
           roles=[m["role"] for m in result], render=status, detail=detail)

for tokenizer_name in ("ToolHistoryTokenizer", "UserOnlyMidSystemTokenizer"):
  namespace, case = load("after")
  tokenizer = getattr(case, tokenizer_name)()
  rendered = []
  for messages in (history, history + [reminder]):
    result = namespace["prepare_system_messages_for_template"](
      copy.deepcopy(messages), tokenizer,
      unsupported_mid_system_policy="user_note_safe")
    rendered.append(tokenizer.apply_chat_template(result))
  emit(kind="append_prefix", version="after", tokenizer=tokenizer_name,
       before=rendered[0], after=rendered[1],
       keeps_rendered_text_prefix=rendered[1].startswith(rendered[0]))
```
