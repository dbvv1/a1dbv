# OpenSpec MDX：让规格直接进入组件消费者

2026-10-25（UTC+8）。🧪 本仓原生编码 Agent 实施的限定扩展，不是上游发行版或模型优劣对照。

**已有 MDX 组件消费者的团队，可以把当前规格保留为一份可编译的源文件，连续二改后仍交给原消费者。** 只有文字约定时继续用原生 Markdown；本扩展不要求普通 OpenSpec 用户迁移。

## 需求与选择

[OpenSpec #2115](https://github.com/Fission-AI/OpenSpec/issues/2115)的使用者已经用 HTML、Gherkin、MDX 写规格，希望可配置格式。先读其[现成 workaround](https://github.com/intent-driven-dev/intent-driven-template#experimental-spec-as-source)，发现 Gherkin 提取器、执行器与报告已有实现，因此没有再造一套 Gherkin 适配器。[社区：真实需求；一手：现成实现源码]

本轮选择其中明确的一段：MDX 文件沿用 OpenSpec 的 Markdown requirement／delta 标记，作为当前规格直接交给 MDX 消费端。固定上游 [6d04a1b](https://github.com/Fission-AI/OpenSpec/tree/6d04a1b58dedc95729d34e4f223d9d483aae210a)；源码 package version 为 1.15.0，不能据此声称本补丁已进入该发行版。没有向上游发布 PR，也没有完成该 issue 的通用 HTML／Gherkin／自定义格式诉求。[一手：固定源码；经验：范围选择]

| 条件 | 推荐起点 | 取舍 |
|---|---|---|
| 需求主要是文字约定，原工作流已满足 | 原生 `spec.md`，不加依赖 | 最轻；本轮修订后仍验证其默认路径 |
| 团队已有可执行 Gherkin 规格 | 先评估现成 spec-as-source 提取／执行路线 | 本轮读过源码，未重跑该路线；不因 MDX 需求重造它 |
| 已有 MDX 组件展示或程序消费，想保持一份规格源 | 试用本补丁的 `specFormat: mdx` | 新增 MDX 依赖与限定语法；须自行维护未上游接收的补丁 |

相较手工另拷一份 MDX，扩展让发现、指令、验证、归档和当前规格路径一致；没有测得团队周期或维护成本的净收益。[经验：条件推荐]若只是偶尔展示一页文字，额外维护不值得。

## 实际实施与接收

采用的方法是“先明确下游产物，再并行实现独立部分，最后由真实消费者接收”，不是先堆流程。实现者读取现有配置、规格合并、引用和命令路径；复用 OpenSpec 原有 delta parser，并用官方 MDX AST 分离模块源码，不让 CLI 执行规格里的 JavaScript。配置／指令与运行路径分开修改，消费端按独立需求编写，不把 `archive` 成功当最终结果。[经验：本轮实际采用]

第一次交付：新增运费阈值 50 与三工作日送达两项要求。MDX 导入本地 React `PolicyCard`，导出市场元数据并在组件中使用。第二次交付：只把阈值改到 75，保留送达要求与模块内容。两轮都由实际 OpenSpec CLI 发现、生成 instructions、严格验证、归档，再由 `@mdx-js/mdx` 编译、动态加载模块并用 React DOM server 渲染。[经验：实际工具／模块执行]

消费者核到阈值变化、导入组件和导出元数据真实执行，未改要求逐字保留。额外只检查直接失败路径：非法 MDX 和相反格式文件冲突均须拒绝，规格／变更文件不被部分修改。原生 Markdown 在修订后的 CLI 也通过；这不是未改上游与候选的独立运行对照。[经验：实际消费者检查]

独审发现了两个跨路径遗漏：list/view 尚在读取未分离的 MDX 模块，以及生成 Skill 仍指导读写 `spec.md`。它们说明完成条件应覆盖真正接手者，而不只覆盖新 API。已修正共享读取与生成指导，结果与固定产物见下方接收记录。[经验：独审与修订]

执行者是本轮实际可用的原生编码 Agent；平台没有提供可核模型 ID，记未知，不借客户端名推断模型。用户提供方向，没有逐行改实现；负责人 Agent 选择范围和消费者要求，并参与问题分流。没有调用本地中转或把结果计入 P79；独立消费者与代码审查不等于独立模型 A/B。[经验：执行归属]

## 最短采用与限制

应用固定补丁后，在项目 `openspec/config.yaml` 增加 `specFormat: mdx`；缺省仍为 Markdown。自定义 schema 的 specs 输出应与 `specs/**/spec.mdx` 一致，实际输出路径以 CLI instructions 为准。保留原有 `## ADDED/MODIFIED/REMOVED Requirements`、`### Requirement`、`#### Scenario` 语法。[一手：本轮实现；经验：用法]

模块 import/export 会保留；后续 delta 不提供模块时沿用旧模块，显式提供时整段替换，不自动推断符号合并。使用稳定的包导入或项目 import map；归档不会搬移资源或重写相对 import，`./component.js` 在两个目录可指向不同文件。[一手：模块机制；经验：采用条件]

支持的是顶层 Markdown 标记加 MDX 模块／需求内 JSX，不是任意 MDX 语法都能混入现有 delta grammar。嵌在 JSX／表达式中的标题形文本会拒绝，以免被误作变更标记。HTML、Gherkin、自定义标记和跨格式自动转换不在本轮范围。[一手：本轮实现边界]

MDX 可含 JavaScript；消费端只编译运行自己信任的规格。CLI 的语法解析不执行它，但下方消费脚本会编译、导入本地自写夹具。实际验收是组件执行与静态渲染，不含浏览器交互、视觉质量、生产店铺或所有客户端 Skill 的运行验证。[经验：实测范围]

## 可重放产物

产物：[源码／测试／原生 pnpm lock 补丁](openspec-mdx.patch)、[消费脚本](openspec-mdx-consumer.mjs)、[消费依赖](openspec-mdx.package.json)与[锁文件](openspec-mdx.package-lock.json)、[结果摘要](openspec-mdx-results.json)、[许可](openspec-mdx-LICENSE)。补丁 SHA-256：`4792c712df4df52fc6c4a6856e2806a6a348c1a035cf02abedd17c6f76782ec5`。[经验：固定交付]

需要 Git、Node >=20.19.0、npm 与官方 npm registry 网络。下例在两个新临时目录运行，不覆盖原项目；依赖安装联网，CLI telemetry 关闭。先将 `A1DBV` 设为本知识库的绝对路径；命令只创建副本，不提交、推送或清理旧目录。

```sh
export OPENSPEC_TELEMETRY=0 DO_NOT_TRACK=1
SOURCE=$(mktemp -d)
git clone https://github.com/Fission-AI/OpenSpec.git "$SOURCE"
git -C "$SOURCE" checkout --detach 6d04a1b58dedc95729d34e4f223d9d483aae210a
git -C "$SOURCE" apply --check "$A1DBV/experiments/openspec-mdx.patch"
git -C "$SOURCE" apply "$A1DBV/experiments/openspec-mdx.patch"
(cd "$SOURCE" && npx --yes pnpm@10.34.5 install --frozen-lockfile --ignore-scripts && npx --yes pnpm@10.34.5 build)

CONSUMER=$(mktemp -d)
cp "$A1DBV/experiments/openspec-mdx-consumer.mjs" "$CONSUMER/acceptance.mjs"
cp "$A1DBV/experiments/openspec-mdx.package.json" "$CONSUMER/package.json"
cp "$A1DBV/experiments/openspec-mdx.package-lock.json" "$CONSUMER/package-lock.json"
(cd "$CONSUMER" && npm ci --ignore-scripts && node acceptance.mjs "$SOURCE/bin/openspec.js")
```

脚本另外创建新结果目录，输出两轮当前规格和静态 HTML、摘要、CLI 回执；可加 `--output-parent 结果父目录`。它使用自己安装的依赖并保留旧结果，不修改调用者的项目。依赖准确版本为 MDX 3.1.1、React／React DOM 19.3.1；各依赖许可证保留在安装包中，不分发 node_modules。[经验：可移植消费入口]

OpenSpec 补丁保留其 MIT 许可及原作者署名；消费脚本为本轮新写代码，另附 MIT 许可。官方依赖的许可见 [MDX](https://github.com/mdx-js/mdx/blob/main/license)／[React](https://github.com/facebook/react/blob/main/LICENSE)，锁文件含依赖完整性信息。[一手：许可]

## 接收记录

最终固定补丁在全新上游副本中干净应用，以 pnpm 10.34.5 执行 frozen-lockfile 安装和显式构建通过；相关配置／命令／归档／验证／生成指导回归通过（11个相关测试文件，564项通过），两轮下游消费及上述直接失败路径也在这个锁定环境重跑通过。检查集合有重叠，不相加成成果数量。消费者的店铺要求是自写夹具，用来接收真实 OpenSpec 扩展，不是实际生产店铺。[经验：验证范围]

原上游源码解包 SHA-256 为 `c0e92aece6c77e457a83f259836074778dac2db6051872ba5b9cf52aaca2fa87`；固定提交及补丁内容比一次目录名更重要。独立审查核过固定源码、补丁重放、真实消费者与最终读者入口；修正其发现的跨路径遗漏后，复核受影响部分。精确检查与最终接收回执在同次交付提交说明中保留。[经验：重放身份]

## 来源

- [OpenSpec 使用者的原始需求](https://github.com/Fission-AI/OpenSpec/issues/2115)与[固定上游实现](https://github.com/Fission-AI/OpenSpec/tree/6d04a1b58dedc95729d34e4f223d9d483aae210a)。
- [官方 MDX 编译器](https://mdxjs.com/packages/mdx/)和[组件／import 用法](https://mdxjs.com/docs/using-mdx/)。
- 完整 SDD 的采用／退出比较沿用[07 的既有来源与选择](../docs/07-workflows.md#openspec让下一位接手当前约定而不只是旧计划)，不把本补丁当成整套流程胜出的证据。
