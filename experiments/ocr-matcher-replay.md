# OCR目录否定修复：只验证匹配函数

核实时间：2026-10-23。🧪 适合研究gitignore边界与重放修复，不是可部署的patched CLI。

**重开目录不等于重开文件，子文件否定也不能越过仍被排除的父目录。** [补丁](ocr-directory-negation.patch)按每一级祖先目录及最终文件分别执行last-match-wins；保留provider硬排除，不改变清单排除理由。[源码／研究]

[重放提取器](replay_ocr_matcher.py)核对[固定上游375f64c](https://github.com/alibaba/open-code-review/tree/375f64cd6f67a48a135da83cfcf59c52669a09cb)的HEAD与输入文件字节，在新目录应用补丁并精确抽取函数和既有测试。公开版本实跑：原版58/64通过、六项新断言失败；修复版64/64通过，包含46项原有断言与18项真实Git oracle案例，使用真实doublestar v4.10.0及race检测。[本仓隔离源码实跑]

这是带显式Provider适配壳的函数测试，不是上游完整包或CLI验收；此前完整SDK编译被signal killed阻断，本轮未重试，也未向上游提交。非Git的scan／file_find WalkDir仍把目录交给文件接口：规则`*`、`!*/`、`!*.go`下，可能在`src`处提前SkipDir；该消费者未实跑／未修复，不宣称Git全规范兼容。[源码边界／实跑范围]

## 重放

前置：Python3、Git、Go1.26.9+及支持race的C工具链；Go缓存中已有doublestar v4.10.0。先核`go version`。脚本不下载依赖，不改输入checkout；每条Git命令默认限时30秒，输出目录必须不存在且位于checkout之外。运行失败后不要把残留输出当成成功结果。[入口约定]

设置`OCR_SOURCE`为固定上游checkout，`MATCHER_OUT`为新输出目录；从知识库根目录运行：

```sh
python3 experiments/test_replay_ocr_matcher.py
python3 experiments/replay_ocr_matcher.py "$OCR_SOURCE" "$MATCHER_OUT"
export GOTOOLCHAIN=local GOPROXY=off GOSUMDB=off GOFLAGS=-p=1 GOMAXPROCS=1
(cd "$MATCHER_OUT/red" && go test -v -race -count=1 -timeout=90s ./...)
# 预期退出1：恰好六项新oracle断言失败，原有46项全部通过。
(cd "$MATCHER_OUT/green" && go test -v -race -count=1 -timeout=90s ./...)
# 预期退出0：64项叶子用例通过；编译失败／超时不算预期红灯。
```

`go test -timeout`限制测试运行，不限制编译时间；必要时使用宿主提供的整条命令超时。各目录`provenance.json`保留固定提交、原源码／补丁／提取片段hash与适配壳说明；原始日志留在本地，无需发布。[入口约定]

源码与原有测试来自Alibaba OpenCodeReview，保留其贡献者署名，按[Apache-2.0](ocr-matcher-LICENSE)提供；补丁是本仓提出的修改，尚未经上游接收。[一手／来源]
