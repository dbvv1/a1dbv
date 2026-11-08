# 沿用现有 Agent，修复真实 CLI 的无值配置崩溃

**🧪 现有入口能读源码、运行 Git 和完成项目检查，就先用它交付，不为一次 CLI 修复更换 Agent。** 本次沿 [01 选型页](../../docs/01-agents/README.md)复验已有的 [git-filter-repo #739](https://github.com/newren/git-filter-repo/issues/739)：合法的无值配置使真实命令崩溃；两行解析修改后，目录过滤成功，项目原生检查通过。

## 改动与真实结果

固定上游 [`d7b75aca`](https://github.com/newren/git-filter-repo/tree/d7b75aca907380f608892cc289e616f195427b99)，在独立临时仓库加入 `[filter "lfs"]` 下的无值 `required`。原 `git-filter-repo --force --path keep/` 报 `ValueError`，新增回归在原实现上也失败；[候选补丁](candidate.patch)保留 Git 输出的 NUL 分隔，用一次 `partition` 取得键和值，修后实际过滤只留下 `keep/file`。

- 回归检查真实 Git 输出中的无值、显式空值、首尾空格、多行值、重复键、缺失键与空配置；重复键仍由最后一项覆盖。
- 坏配置仍报 fatal，在非仓库中执行仍失败，缺少 `--path` 参数仍退出 2；独立复验没有放宽失败路径。
- 无值与显式空值在此接口里都返回 `b''`。这解决解析崩溃，不把所有无值键规范化成 Git 布尔真值；现有布尔消费者的解释没有改动。

源码只有两行修改，测试沿上游 `t9391-filter-repo-lib-usage.sh` 增加一项真实消费者回归，没有新检查框架。原生检查结果与环境见下方最终验收。

## 复跑入口

只在新的可丢弃 checkout 与合成 Git 仓库中运行，不在用户项目上做历史过滤。准备 Git、Python 3、Bash、`coverage3`、GNU `time`、`rsync` 和 `unix2dos`，并隔离 HOME 与 Git 全局配置。下面从本仓根目录开始：

```bash
(
set -eu
patch_file="$PWD/experiments/git-filter-repo-config/candidate.patch"
scratch="$(mktemp -d)"
mkdir "$scratch/home"
export HOME="$scratch/home" GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL=/dev/null
git clone https://github.com/newren/git-filter-repo.git "$scratch/upstream"
cd "$scratch/upstream"
git checkout --detach d7b75aca907380f608892cc289e616f195427b99
git apply --unidiff-zero "$patch_file"
git diff --check
python3 -m py_compile git-filter-repo
(cd t && bash t9391-filter-repo-lib-usage.sh -v)
make test
)
```

补丁以零上下文保存，须固定上述基线并保留 `--unidiff-zero`。要核原失败，在另一份同基线 checkout 先只应用测试文件差量，再运行同一 `t9391`；应看到新增项的 `ValueError`，不是任意非零退出。随后应用生产文件差量再验成功。依赖缺失先按当前授权准备，不改项目断言或用替身凑绿。

## 最终验收与范围

2026-11-08，Linux、Git 2.52.0、Python 3.12.14。缺少的工具来自官方 Debian 包与 PyPI，只准备在独立工作区；版本为 coverage 7.17.2、rsync 3.4.1、dos2unix 7.5.2、libpopt 1.19、GNU time 1.9。最初 `make test` 因缺 `time` 未启动测试，准备后才重新执行。

最终 `make test` 退出 0：五套分别通过 51、15、19、20、29 项，共 134 项，无失败或 skip。`git-filter-repo` 生产脚本的语句覆盖率为 100%（2,584 条、零遗漏）；包含 contrib 与测试辅助代码的合计为 99%（2,938 条、遗漏 19 条），不混成全仓 100%。最终源码与补丁一致；Python 编译、空白检查及上述失败路径均通过。

补丁 SHA-256：`36bf4afb8a9ba427e87267b9c13a4cf426442f09db8af6c0a86c4f170527bf09`。

非作者独立核对补丁，并在另一份隔离副本重现原失败、修后 CLI 和配置边界。选型页全文已披露 #739 作者示例，因此本次支持该例的独立实做和检查补齐，不算另一道未知任务的盲读验收。没有比较模型或客户端、验证 Windows／macOS、运行用户项目或向上游投稿；选型页与地图保持 🟡。

输入页面为 a1dbv `bcba32c2` 的完整 01 页，SHA-256 `65572ce6cbc9d78424a4a241455a7bc827fed6a3b210d4b0454246058719a4b4`。依据为上游 issue、固定源码、贡献与测试入口，以及本轮实际命令结果；未更换客户端、模型或 harness，未推断未知的后端配置。
