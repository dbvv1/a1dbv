# 模型与 effort 离线查看器

**先下载本目录的 [index.html](index.html)，用浏览器打开即可使用。** 单文件、自包含，无需安装依赖；筛选、排序、逐行／散点切换与 CSV 导出都可离线，打开外部来源链接才需联网。

这是 **2026-10-27 02:45 UTC 的静态快照**：8 款模型、42 种 effort 配置，不自动刷新。AA 综合 Index v4.3.2 与 Terminal-Bench 4（TB4）来自第三方 Artificial Analysis；本仓只提供数据查看器，尚未在本仓任务上调用这些模型做评测。

## 怎么比较

- 默认显示各模型的 max；选“全部 effort”查看 42 条，再按模型／effort 筛选。
- “综合 · AA Index”配综合加权 API 估算费用／题；“编码 · TB4 pass@1”配 TB4 API 估算费用／题。Index 不是百分比，两套费用的分母不同。
- AA 费用由输入、缓存命中／写入、reasoning 与答案 token 按其观察时定价估算，非实扣账单；不含主机、沙箱、人审或总工程费用。
- Fable／Opus／Sonnet 的 DF 为 Default Fallback 配置；逐题是否转交未知。发布日期不是测试运行日期，精确运行时间与 API 快照 ID 未公开。

## 官方价格与来源

页面单价表保留 [OpenAI 官方定价](https://developers.openai.com/api/docs/pricing)与 [Anthropic 官方定价](https://platform.claude.com/docs/en/about-claude/pricing)：Standard API、美元／百万 token、所列上下文范围；缓存列为命中／读取，不含写入。GPT 超过 272k 的倍率、Haiku 100k 分档及 Batch／其他服务层级／额外工具费的排除范围均在页内保留。使用时应重新核对官方当前价格。

每条记录链接到原 AA 模型配置页；口径见 [AA Intelligence Index／TB4 方法](https://artificialanalysis.ai/methodology/intelligence-benchmarking)与 [AA 费用方法](https://artificialanalysis.ai/methodology)。这里只保留比较所需事实与数值，原来源和观察时间随 CSV 导出保留。

## 维护者回归

将 `index.html` 与 [verify.html](verify.html) 放在同一目录，通过正常本地 HTTP 同源打开 `verify.html`；例如仅在该目录运行 `python3 -m http.server 8765 --bind 127.0.0.1`，再打开 `http://127.0.0.1:8765/verify.html`，结束后在终端按 Ctrl+C。查看器本身仍可离线打开；测试页不能用 `file://`。

测试页用浏览器原生 DOM 沿 select 的 change 事件切换，验证 SVG 真正移除 `hidden`、computed display 与非零边界框；覆盖重复切换、Index／TB4、全部 42 条、零分记录、空态恢复与数据不变。看到 `PASS` 才算该浏览器通过；它是此页面的窄回归，不加入整仓通用门禁。
