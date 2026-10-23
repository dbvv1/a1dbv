# OpenCodeReview：无模型准备与Git清单对账

规则准备交给CLI，评审仍由现有Agent做。本例只验证文件／规则输入，不证明实际审查质量、token或费用收益。

## 固定输入

本次在Linux x86_64实跑，需要现有POSIX shell、Git、Python 3、mktemp、GNU sha256sum，工具路径为/usr/bin:/bin；不自动下载安装。已有[官方v1.13.3 Linux amd64二进制](https://github.com/alibaba/open-code-review/releases/tag/v1.13.3)，源码提交为375f64cd6f67a48a135da83cfcf59c52669a09cb。

二进制SHA-256：843be0e56fdff0a5ca6f86c5866f942d6a372dff1c0ca19e7893d72495abf45c。复现脚本执行前强制校验；这不是独立源码可复现构建验证。

## 先复现一个静默漏项

```sh
sh experiments/opencode_review_reproduce.sh /absolute/path/to/opencodereview-linux-amd64
```

脚本先以env -i重启，再创建空HOME和临时合成Git仓；不改现有项目、不推送、不调用模型或host Agent。产物保留在打印的ROOT目录供检查，复核后可自行删除，不要提交二进制或原始日志。

预期：Git变化有.gitignore和src/a.go，而preview仅列.gitignore。脚本退出0表示复现过程完成，不表示清单完整。

## 对账已有preview

```sh
python3 experiments/opencode_review_coverage.py REPO BASE_SHA HEAD_SHA PREVIEW_JSON
```

提供完整固定SHA，以及同仓执行下列命令所得JSON；这些准备命令不调用OCR模型：

```sh
ocr delegate preview --format json --from BASE_SHA --to HEAD_SHA
ocr delegate rule --format json --from BASE_SHA --to HEAD_SHA src/a.go src/b.go
```

helper以最小Git环境及NUL分隔路径，对同一merge-base范围检查路径、refs与计数。rename取新路径，delete取旧路径；已测空格、中文换行、rename/delete，copy尚未单独实测。非法UTF-8、解析失败或未知结构均非零退出。

退出0只表示这份清单与指定Git范围对得上，不证明代码已审、状态字段与Git一致、排除理由合理或规则有效；只信任从目标仓产生的preview。重要的显式排除文件仍需另行安排。缺项则把原始Git差异交回既有评审，不修改项目gitignore来迁就工具。

## 清单一致后，再核过滤意图

固定 v1.13.3 的反向复测：`.gitignore` 写 `src/` 与 `!src/a.go`，先强制跟踪该文件再修改。Git 的父目录仍被忽略，OCR 却将文件列为可审；上面的清单 helper 仍退出0，因为它检查的是原始 Git 差异完整性，不是 ignore 规则。

若任务明确沿 gitignore 筛文件，在同一版本的仓库检查：

```sh
git check-ignore --no-index -- src/a.go
```

退出0是被忽略，1是不被忽略，其他退出码不是通过。`--no-index` 让已跟踪文件也接受规则判定；这不改变 Git diff 对已跟踪文件的处理，也不替你决定应不应该审。对照 `/*/` 与 `!/src/` 则允许该文件，原版 OCR 反而漏项。不要改项目规则迁就工具；当前没有已验证修复版。[本仓工具实跑，2026-10-23]

## 实际回归

- 原五场景：普通Go、目录否定、JSON＋Markdown、真空diff、共用Go规则；只有目录否定对账失败。
- 空格／中文换行／rename／delete四项，对账通过；错refs、各类计数、重复路径、缺字段、坏JSON、错误mode等均非零。
- 污染调用者GIT_DIR／WORK_TREE／CONFIG变量后，复现仍只写新临时仓；错二进制hash被拒。

[完整机制、采用证据与结果](../docs/research/2026-10-22-frontier-trials.md#ocr-delegation-trial)。未运行模型、PR评审或CI，也没有网络层零外连证明。
