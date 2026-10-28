# Qwen / Goose：环境重置后的候选恢复样例（🧪 试用）

**这份小包保存两份未发布候选的差量与四个复现文件；环境重置后，只要固定上游基线仍可取得，就能重建相同源码树。** 它沿用 [opensrc 补丁](../opensrc-ref-integrity/README.md)的分发形式，不包含上游完整源码、Git 历史、依赖、工具链或构建结果，**不是完整离线备份，也不单独满足运行细则 §3.1 的完整源码保全要求**。

| 候选 | 保存的变化 | 固定输入与原候选 |
|---|---|---|
| Qwen Code [#15741](https://github.com/QwenLM/qwen-code/issues/15741) | MCP 工具发现失败时保留真实原因，避免被空服务器提示覆盖；含回归测试和说明 | 基线 `127c2ab9048839c64b806e58e6d7329cbb2d9a8a`；原本地提交 `609941748680555ce2af949ce8085345997de0d5` |
| Goose [#13158](https://github.com/aaif-goose/goose/issues/13158) | LiteLLM 在格式化前补全未指定的视觉能力，保留已指定布尔值；含 HTTP 回归测试 | 基线 `8a16788137c8af25f9d6d17ee87bbedb53ea9325`；原本地提交 `af0a78595ad5c2917c667f21e4bbb04710451fcf` |

`change.patch` 是对应基线到原候选的完整文本差量，未重新编辑。Qwen 的 `repro/` 三个文件原在忽略目录 `.qwen/scripts/`；Goose 的 `litellm_vision_baseline.rs` 是原始失败复现，原在 `.local-tools/`。它们不属于候选 Git 树，单独校验、恢复。`manifest.json` 记录基线树、候选树、变更文件 blob / SHA-256 与包内文件 SHA-256；`SHA256SUMS` 也覆盖 README 和 manifest。

## 恢复源码（不安装依赖、不运行上游测试）

需要 Git、Bash、Python 3、`sha256sum` 和能取得固定上游提交的网络；恢复会下载完整基线，应给 checkout 预留足够磁盘，不能按本包大小估算。在 a1dbv 根目录执行；`candidate-recovery` 必须不存在，避免覆盖现有工作。若上游不再提供该 SHA，就停止：本包没有替代基线，不能改用最新分支冒充恢复。

```bash
set -eu
artifact="$PWD/experiments/candidate-reset-recovery"
recovery="$PWD/candidate-recovery"
(cd "$artifact" && sha256sum --check SHA256SUMS)
test ! -e "$recovery"
mkdir "$recovery"
while read -r name upstream base base_tree candidate_tree; do
  target="$recovery/$name"
  git init -q --object-format=sha1 "$target"
  git -C "$target" fetch --depth=1 "$upstream" "$base"
  git -C "$target" checkout -q --detach FETCH_HEAD
  test "$(git -C "$target" rev-parse HEAD)" = "$base"
  test "$(git -C "$target" rev-parse 'HEAD^{tree}')" = "$base_tree"
  git -C "$target" apply --check "$artifact/$name/change.patch"
  git -C "$target" apply --index "$artifact/$name/change.patch"
  test "$(git -C "$target" write-tree)" = "$candidate_tree"
  git -C "$target" diff --cached --check
done <<'SOURCES'
qwen https://github.com/QwenLM/qwen-code.git 127c2ab9048839c64b806e58e6d7329cbb2d9a8a 2eaeb6415be4f8ab539637382b054409dcc1c268 07bc1f417f595fcb283731aeb747433435bc57b6
goose https://github.com/aaif-goose/goose.git 8a16788137c8af25f9d6d17ee87bbedb53ea9325 0e79564333c5c37152ee9e75f6bdbc6d0e282576 19853ad78cbc42dd9d90f37f7e813079ae46a3ec
SOURCES
mkdir -p "$recovery/qwen/.qwen/scripts" "$recovery/goose/.local-tools"
cp "$artifact"/qwen/repro/* "$recovery/qwen/.qwen/scripts/"
cp "$artifact/goose/litellm_vision_baseline.rs" "$recovery/goose/.local-tools/"
python3 - "$artifact" "$recovery" <<'PY'
import hashlib
import json
from pathlib import Path
import sys

artifact, recovery = map(Path, sys.argv[1:])
manifest = json.loads((artifact / 'manifest.json').read_text())
for case in manifest['cases']:
    for item in case['changed_files']:
        data = (recovery / case['name'] / item['path']).read_bytes()
        if len(data) != item['bytes'] or hashlib.sha256(data).hexdigest() != item['sha256']:
            raise SystemExit('Hash mismatch: ' + item['path'])
for item in manifest['payloads']:
    if 'restore_to' in item:
        data = (recovery / item['restore_to']).read_bytes()
        if len(data) != item['bytes'] or hashlib.sha256(data).hexdigest() != item['sha256']:
            raise SystemExit('Hash mismatch: ' + item['path'])
print('Both candidate trees and all four reproduction files match.')
PY
```

成功后，两个仓库的 `HEAD` 仍是上游基线，候选差量已暂存；`git write-tree` 对应 manifest 的 `candidate_tree`。恢复的是源码内容，不是原候选 commit 对象（时间、作者等提交元数据未归档）。四个复现文件由包内副本恢复，不靠忽略目录碰巧残留。

## 继续复现的入口

**下面是后续可执行入口，不是本次重新测试的结果。** 先按固定源码的 `AGENTS.md` / `CONTRIBUTING.md` 安装锁定依赖；不要把依赖安装失败或未完成构建当测试通过。Qwen 基线要求 Node ≥22、pnpm 11.24.0；Goose 的 `rust-toolchain.toml` 固定 Rust 1.99.0，另需其原生构建依赖。

Qwen 在恢复目录、已完成正常 core 构建后执行。两个探针分别导入源码与编译产物，通过本地 stdio 合成服务器观察 duplicate / empty / unique；输出诊断不等于完整 CLI 验收：

```bash
cd "$recovery/qwen"
mkdir -p .recovery-home .recovery-runtime
for probe in reproduce-duplicate-mcp.ts reproduce-duplicate-mcp-compiled.ts; do
  HOME="$PWD/.recovery-home" QWEN_RUNTIME_DIR="$PWD/.recovery-runtime" \
    QWEN_DEBUG_LOG_FILE=1 node --import tsx ".qwen/scripts/$probe"
done
```

Goose 的候选回归入口是 `cargo test -p goose --test litellm_vision --locked -- --nocapture`（在恢复的 Goose 根目录运行，设置 `GOOSE_DISABLE_KEYRING=1`）。若要复现原始红测，另建基线 worktree，不覆盖候选测试：

```bash
git -C "$recovery/goose" worktree add --detach "$recovery/goose-baseline" \
  8a16788137c8af25f9d6d17ee87bbedb53ea9325
cp "$artifact/goose/litellm_vision_baseline.rs" \
  "$recovery/goose-baseline/crates/goose/tests/litellm_vision.rs"
cd "$recovery/goose-baseline"
GOOSE_DISABLE_KEYRING=1 cargo test -p goose --test litellm_vision --locked -- --nocapture
```

原基线记录为 7 个控制通过、JSON / SSE 两个别名视觉用例按预期失败；该命令预期非零，不是恢复错误。这里的 `local-test-key`、内嵌 1×1 PNG 和 MCP 工具名均为合成夹具，不含真实凭据或用户内容。

## 已核验与未完成

- 2026-10-28 08:28:19–08:28:56 UTC，从远端 [a1dbv `9e15026`](https://github.com/dbvv1/a1dbv/commit/9e15026e28fb16396e8c0005b1a61ba8000f9a2b) 取回此包，在同一云电脑的新目录、独立 Git 对象库中实际恢复，耗时 36.445 秒。10 项包内校验通过；两个完整候选树、五个变更文件 blob 和四个复现文件均一致。原候选 commit、工作区依赖和生成文件不是恢复输入；这不是独立机器或实际重置后的验收。
- 归档性质更正：`9e15026` 提交说明把四个复现文件统称为 ignored；实际仅 Qwen 的三个文件原被 Git 忽略，Goose 的基线复现文件原为 untracked（未跟踪、未被忽略）。四个文件的包内内容与恢复位置不变。
- 本次只打包、核内容和恢复性，**没有重跑 Qwen / Goose 产品测试、发 PR 或完成上游工作**。历史候选验证不因归档而升级：Qwen 完整 preflight 仍未通过（core tsc 状态 137）；Goose 仍须核上游 Ready 门槛，未做真实 LiteLLM / 完整工作区验收。
- 恢复仍依赖上游基线可取得、此包已另存到持久位置；仅在临时电脑里生成本目录或 commit 不能抵御该电脑丢失。依赖、工具链与运行环境另行恢复，离线完整备份仍缺。

来源：固定基线 [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code/tree/127c2ab9048839c64b806e58e6d7329cbb2d9a8a)、[aaif-goose/goose](https://github.com/aaif-goose/goose/tree/8a16788137c8af25f9d6d17ee87bbedb53ea9325)及原本地候选；源码与恢复核实：2026-10-28。issue 链接只标识来源，不表示重新核查了当前状态。

## 许可与修改通知

- Qwen 上游版权：Copyright 2025 Google LLC；Copyright 2025 Qwen。完整原许可：[qwen/LICENSE.upstream](qwen/LICENSE.upstream)。两个 TypeScript 源文件已有 Google / Apache-2.0 头，应用补丁后保留不变。
- Goose 上游版权：Copyright 2024 Block, Inc.。完整原许可：[goose/LICENSE.upstream](goose/LICENSE.upstream)。
- 上游代码、这里的候选修改及四个复现文件均按 **Apache-2.0** 分发。上述 LICENSE 文件与各自固定基线的 `LICENSE` 字节一致；该范围没有额外适用的上游 NOTICE。
- 修改通知（2026-10-28）：Qwen 修改 `docs/users/features/mcp.md`、`packages/core/src/tools/mcp-client.test.ts`、`packages/core/src/tools/mcp-client.ts`，并新增三个本地 MCP 探针；Goose 修改 `crates/goose/src/providers/litellm.rs`，新增 `crates/goose/tests/litellm_vision.rs` 及独立的基线复现文件。改动目的见上表，非上游发布或背书。
