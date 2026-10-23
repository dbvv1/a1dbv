# fd：直接输出文件类型、字节数和路径

核实：2026-10-23。这是官方固定源码上的**本地功能补丁**，不是已发布或已获维护者接收的功能。

`fd --print0 --format $'{%y}\t{%s}\t{}'` 保留 fd 的搜索／ignore 行为，直接输出类型、大小、路径，供下游程序消费。GNU `find -printf` 能满足选集需求时仍是更简单的默认；已有 `fd -X stat` 也可用，但需要外部 stat。这里没有测性能，不声称更快或普遍优于现成工具。

## 来源与范围

- [真实用户需求 #2131](https://github.com/sharkdp/fd/issues/2131)：grimnight 用 find 的类型、大小、路径字段处理文件，希望在 fd 中完成。
- [rusker86 的原型 PR #2138](https://github.com/sharkdp/fd/pull/2138)，读取时 open／未合入，固定 head `e9e7a79799f829e7b91b4d0bb0d31a6473d7ae49`。本补丁借用其 `{%y}`／`{%s}` 语法并归属作者，未执行该 fork。
- [官方源码固定点](https://github.com/sharkdp/fd/commit/e3eead9da73fb6bcc41f692304e3c8f968a3ceb1)：`e3eead9da73fb6bcc41f692304e3c8f968a3ceb1`，MIT OR Apache-2.0，许可证随包保留。
- 只增加输出用的类型与大小占位符，复用 `{}` 路径；没有新表头、日期、版本号、反斜杠转义机制、测试跳过或上游投稿。

## 明确语义

- `{%y}` 输出 `file`／`dir`／`symlink`／`other`，不是 find 的单字母类型。
- `{%s}` 是文件系统 metadata 长度；目录不是递归容量，链接默认描述链接自身。
- `--follow` 使用 fd 现有 walker／filter 语义：解析成功的链接描述目标；由既有 walker 按 NotFound 恢复的断链描述链接自身。不保证后来变坏的链接、权限错误或循环也能恢复。
- 缺少必要 metadata 时失败，不伪造 0；之前完整记录可能已经输出。现有过滤器可能缓存 metadata，不是原子快照。
- 路径／常量／转义后的占位符不新增 metadata 查询。`--exec` 与 `--exec-batch` 保持旧解析语法。
- 使用真实 tab 分隔类型、大小、末尾路径，配合 `--print0`；消费者先按 NUL 分记录，再只切前两个 tab，保留路径里的 tab 和换行。普通 TSV 行不安全。现有非 UTF-8 文件名有损转换不在保证范围。

## 实测结果

- 原版：13 条样例记录保留字面 `{%y}`／`{%s}`，确认功能缺失。
- 补丁版：默认 13 条、follow 14 条，与独立 Python 文件系统 metadata 比对通过。涵盖空／非空文件、目录、文件／目录链接、断链、FIFO，以及空格、tab、换行、反斜杠、花括号文件名；base-directory 和自定义路径分隔符通过。
- 另有 3 个单占位符／重复及混合占位符 CLI 用例通过。
- 14 个旧 CLI 用例原版／补丁版结果一致，包括 exec／batch、隐式追加路径、字面 metadata 占位符、反斜杠、metadata 样式可执行文件名与旧路径语法。
- 单元测试 167 通过；集成测试 118 通过、1 失败、0 跳过。失败 `test_respect_ignore_files` 用原版二进制同样复现：测试假设 fixture 没有 Git 祖先，但运行环境祖先存在 `.git` 标记。没有改测试或祖先目录掩盖失败，因此**不是全套通过**。
- `cargo fmt --check`、`git diff --check` 通过。脚本缺参数、缺可执行文件、错误 mode、错误二进制及 Python `-O` 等 9 个负例检查通过；子进程有 15 秒时限。
- 构建使用官方 Rust 1.90.0、`--locked --no-default-features`。默认 jemalloc／completion 构建、Windows、性能和模型收益对照未运行。该构建存在原版也有的两条 unused-import warning。

## 复跑

需要 Linux/POSIX、Git、Python 3、Rust ≥1.90 和 rustfmt；脚本用 symlink／FIFO，不是 Windows 验收。从仓库阅读本页时，先把整个案例包复制到现有 Git 工作树之外，再复跑，避免祖先 Git 标记影响上游测试。

以下从本包所在目录运行；新建 `run`，不要覆盖已有工作。

```bash
(
set -eu
if [ -e run ]; then
  echo 'run already exists; choose a fresh directory rather than overwrite it' >&2
  exit 2
fi
mkdir -p run/tmp
export TMPDIR="$PWD/run/tmp"
export CARGO_HOME="$PWD/run/cargo"
export CARGO_TARGET_DIR="$PWD/run/target"
git clone https://github.com/sharkdp/fd.git run/source
cd run/source
git checkout --detach e3eead9da73fb6bcc41f692304e3c8f968a3ceb1
cargo build --locked --no-default-features
cp "$CARGO_TARGET_DIR/debug/fd" ../fd-baseline
python3 ../../acceptance.py ../fd-baseline baseline
git apply --check ../../feature.patch
git apply ../../feature.patch
cargo build --locked --no-default-features
cp "$CARGO_TARGET_DIR/debug/fd" ../fd-patched
python3 ../../acceptance.py ../fd-patched patched
python3 ../../regression.py ../fd-baseline ../fd-patched
cargo fmt --check
git diff --check
cargo test --locked --no-default-features
)
```

脚本自动在自身旁边创建 `tmp` 并保留样例，不删除用户文件。成功只输出验收结果，不输出本机路径；遇到失败退出非零。不要用 `python -O` 跳过断言。

## 可借用的 AI coding 做法

先追共享 formatter 的两个消费者：输出链和 exec 链，再决定新语法在哪个入口生效。否则新增 token 会连带改变 exec 的隐式路径追加与批量分组。独立审查还发现 metadata 失败必须发生在 hyperlink 前缀写出之前；补丁先完成可失败的格式生成，再写输出，并加入无半条记录／无半截 hyperlink 回归。这次不需要额外包装一个泛化 Skill。
