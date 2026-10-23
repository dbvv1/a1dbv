# MultiIndex 名称碰撞：沿已合入修复补上遗漏输入域

核实／实测：2026-10-23。当前 xarray 固定 fbc4cf19b919ce23fd0f7d419e9c141f046788a9。

## 增量

真实实践者的单索引修复已经被上游接受，但不能由此推断其 MultiIndex 契约也被覆盖。本例直接从接口文档的支持域追到遗漏：单个 index.name 不包含 MultiIndex 的所有 index.names。数据不只是报错，而会静默占掉同名坐标。修复复用现有 get_temp_dimname，以全部层名为占用集合，不引入新命名框架。

属性生成器围绕真实风险生成不同数量前导下划线的候选名，显式 @example 固定连续碰撞。它不是用任意 st.text() 等待极低概率命中，也不是过滤掉合法但失败的用户名称。验证以原始 Series 和原始每一层坐标为 oracle，不比较两个可能同错的转换结果。只在完整笛卡尔积域主张精确往返，不误把文档允许的缺失组合补 NaN 判为 bug。

## 来源与归属

- 原案例 https://github.com/pydata/xarray/issues/11574 ，2026-09-07。作者报告 Claude Opus 4.8 协助定位／生成复现。
- 原修复 https://github.com/pydata/xarray/pull/11575 ，2026-09-11 合入 7819876ea740b774e62f49ac554a69706dbe83ff。作者明确手写修复。它只处理单索引，不能冒称本次发现或当前模型收益。
- 本次固定源 https://github.com/pydata/xarray/tree/fbc4cf19b919ce23fd0f7d419e9c141f046788a9 ，Apache-2.0，许可证随包保存。本次 patch 是本地新增，未提交上游、未获维护者接收。
- 人工应用官方 Hypothesis 命令的契约核对、独立预期与固定反例流程：https://github.com/HypothesisWorks/hypothesis/blob/3fc38f1d6a6b1752bf5fad61d44ee79d31d35406/.claude/commands/hypothesis.md 。该源为 MPL-2.0；重放包不需要复制或执行该命令。本次不是原生 Skill 自动加载或有／无 Skill 模型对照。
- dgutson/pbt-migrate 仅源码调查，未安装、未执行，不作为已验证推荐。

## 运行

Python 3.12+，git；在隔离环境按 requirements.txt 装官方 PyPI 依赖。运行同目录 replay.py --check-only 可先检前提，再运行 replay.py。入口不安装依赖，会从官方仓库下载固定源码、核补丁 SHA-256、保留新临时目录和全部 red/green 证据，不修改原 checkout、不发布。

测试依赖的精确版本在 requirements.txt。主要环境为 Python 3.12.14、pandas 3.1.0、numpy 2.5.4、Hypothesis 6.170.8、pytest 9.1.1、sparse 0.19.2。

## 结果

- 独立消费者：修改前 21 failed / 7 passed；修改后 28 passed。
- 上游 from_series / to_series 定向测试：20 passed，无跳过。
- 原单索引属性和新增 MultiIndex 属性：2 passed。
- 修改文件 Ruff 检查和格式检查通过；git diff --check 通过。
- 自包含 fresh checkout 重放通过。正常前提通过；缺失输入、错误依赖版本拒绝，失败没有伪装为成功。
- 原测试配置含缺失的 mypy 插件参数，因此定向执行明确覆盖 addopts，并关闭第三方插件自动加载。pytest 仍报告缺失 asyncio 插件配置 warning。不是完整 pixi 环境、全库测试、mypy 或 CI 通过。
- 覆盖原 Series.name 为 None、普通名称、临时名、fallback；保留普通单索引，覆盖全部层名及重复候选碰撞。无浏览器、账户、线上数据或付费模型调用。

## 交付文件

fix.patch、test_collision.py、replay.py、test_replay.py、requirements.txt、xarray-LICENSE.txt。原始日志另存，不应把本机绝对路径直接发布到公开仓库。

## 最终复核与剩余限制

独立复核者通过 192 项 dense/sparse 名称不变性检查及 22 项定向测试，生产补丁无阻塞项。重放入口已补校验补丁哈希、清除外来 pytest 选项、检查定向数量／无 skip、保留 timeout 部分输出；这些最终改动已独立静读复核。

最终同一入口已完整 fresh-checkout 重放成功，补丁和依赖未变：修改前 21 失败／7 通过，修改后 28 通过，上游相关测试 20 通过、属性测试 2 通过。运行时特意设置错误的外来 PYTEST_ADDOPTS，验证隔离生效。此前因默认临时分区空间耗尽失败，后使用 TMPDIR 指定容量足够的任务目录恢复，不改变脚本、不删除他人文件，不把存储故障算成代码失败。

新增 test_replay.py 提供六项可复制入口回归：正常前提、缺失输入、错误依赖、补丁哈希不符、模拟 timeout 留存部分输出、模拟子进程失败留存错误；六项全部通过。执行方式为同一依赖环境中 python test_replay.py。临时空间紧张时可按系统通常做法设置 TMPDIR，入口会保留新运行目录以便查看证据。

仍非全库 CI、完整 pixi 环境、类型检查或上游接收。原始日志含执行机器路径，公开交付只收经过整理的摘要，不直接搬运日志。

## 补丁序列化兼容修正

公开仓库会把新补丁文件中的单空格上下文行视为空白错误。仅将四个空白上下文行由单空格规范为空行，未削弱检查或改全局属性。git apply --check 和实际 apply 均成功，应用后的三个文件与此前独立复核版本逐字节相同。

原补丁 SHA-256：76d1d49e5cc72a2c674157d8b17ec9ed34be0e5bb2f15e1d7f1241508f92b278。规范化补丁 SHA-256：942f024884deb567e49ef563fce76a92fe0401f638da31f6cf25f03045777533。重放常量同步更新；最终规范化版本再次完整重放通过，结果仍为修改前 21 失败／7 通过、消费者 28 通过、上游 20 通过、属性 2 通过，六项入口回归通过。
