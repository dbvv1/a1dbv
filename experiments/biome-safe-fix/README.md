# Biome 的 safe-fix 成功退出，真实消费者却不能启动

**🧪 Biome 2.6.4 的 `useArrowFunction` 自动改写成功退出，却让 cubing.js 的原生导入测试和公共 4×4 scramble API 都报 `not a constructor`。** 保留该项目后来采用的一行 suppression 后，这两个入口恢复成功。这是一份真实消费者的对照记录，不是完整修复或新的默认配置。

问题来自 [Biome #12372](https://github.com/biomejs/biome/issues/12372)：报告者指向 cubing.js 的完整 GWT 生成 solver。本轮固定该提交，没有摘录成两行夹具。**原项目配置排除了这个 vendor 目录；本轮在隔离副本中用独立配置显式指定目标文件，不代表项目默认 lint 会破坏它。**

## 六次实际消费者结果

三个副本基于同一提交、使用相同依赖。两个变换组均运行官方 npm 包的 `lint --write --only=complexity/useArrowFunction`，没有 `--unsafe`；formatter 与 assist 关闭，完整参数和独立配置在 [results.json](results.json)。

| 条件 | Biome CLI | 原项目 Node 导入测试 | 公共 `randomScrambleForEvent("444")` |
|---|---|---|---|
| 原文件 | 未改写 | exit 0；25 个导入入口及原有 222 worker／WASM 检查完成 | exit 0；45 步非空、可解析输出 |
| 直接应用规则 | exit 0；4 处变换 | exit 1；`seedTable[id] is not a constructor` | exit 1；相同构造错误 |
| 保留当前项目那条 suppression，再应用规则 | exit 0；3 处变换 | exit 0；同 25 入口及 222 检查完成 | exit 0；42 步非空、可解析输出 |

原生入口为项目自己的 `node script/test/src-cubing/import-all.ts`；三个副本的测试文件 SHA-256 相同，未改测试求绿。另一个入口从原源码导入公共 scramble API 与 `Alg`，实际走原 worker 链；只断言输出非空及重新解析后的文本往返相同，调用脚本全文保存在 JSON 中。45／42 是两个随机样本的步数，不是质量或性能对比；导入顺序也会随机变化，失败前打印的入口数不是覆盖率。

失败路径是 `defineSeed` 把普通函数存进 `seedTable`，`newSeed` 随后通过 `new` 调用。规则把这个匿名构造器转为箭头函数，后者不能被构造。保护组只把当前上游已有的单行 suppression 放到相同历史基线，并未移植当前主干的其他变化。**它仍保留另一个 `setClassLiteral` 函数及两个排序回调的改写；两条消费者成功，不证明这些改写全面安全。**

## 版本与证据

| 对象 | 实际范围 |
|---|---|
| cubing.js 输入 | `559907da3f67ac4e516767c475ee7d7612e7ef57`，完整原项目与原 solver |
| Biome | 官方 npm `@biomejs/biome` **2.6.4**；没有构建主干或候选 PR |
| suppression 来源 | cubing.js `5133dc49698e9911466cebb8bb1826c73fd4e5ba` 的目标行；不是本轮新修补 |
| 执行环境 | Linux x86_64、Node **24.22.1** 原生 TypeScript 支持 |
| 实际依赖 | `@cubing/lazy-promise` 0.1.3、`@cubing/comlink-everywhere` 0.1.3、`random-uint-below` 3.3.0、`three` 0.170.0、`path-class` 0.16.0；版本及 integrity 与输入项目 `bun.lock` 匹配 |

`results.json` 保留最终六次消费者的命令、UTC 时间、退出码、完整 stdout／stderr、solver 与测试文件哈希，以及两次 lint 的输出、配置和依赖信息。发布时只把执行环境绝对路径换为占位符，附原始消费者记录 SHA-256；环境元数据省略无关的 npm 签名等字段。没有重新分发完整第三方 vendor 源码。

两次 lint 都有 `recommended` 字段弃用提示，记录中保留。最初缺 `path-class` 的启动失败，以及 `node --input-type=module -e` 被 worker 继承导致的包装错误，属于准备／试验入口问题，不算产品缺陷；修正后才重新运行表中六场。表中不是第一次尝试就全部成功的记录。

截至核实日，官网仍将此规则标为 safe fix；已有 [PR #12729](https://github.com/biomejs/biome/pull/12729) 未合入，前一份 [#12383](https://github.com/biomejs/biome/pull/12383) 已关闭且未合入。本轮没有执行候选实现，不用 PR 的小例子推断真实 solver 已修好，也不重复开发上游补丁。

本轮未验证完整解算正确性、随机分布、浏览器、全项目测试或模型效果；这份实测不补齐任何答案页的本机新读者验收。它给既有“清 lint 保留调用契约”的判断补上了一个实际跑过、可定位的反例。

**依据与核实**：[使用者原报告](https://github.com/biomejs/biome/issues/12372)、[固定 solver](https://github.com/cubing/cubing.js/blob/559907da3f67ac4e516767c475ee7d7612e7ef57/src/cubing/vendor/mit/cs0x7f/cstimer/src/js/scramble/444-solver.ts#L46)、[原项目排除配置](https://github.com/cubing/cubing.js/blob/559907da3f67ac4e516767c475ee7d7612e7ef57/biome.jsonc)、[原生导入测试](https://github.com/cubing/cubing.js/blob/559907da3f67ac4e516767c475ee7d7612e7ef57/script/test/src-cubing/import-all.ts)、[项目已有 suppression](https://github.com/cubing/cubing.js/blob/5133dc49698e9911466cebb8bb1826c73fd4e5ba/src/cubing/vendor/mit/cs0x7f/cstimer/src/js/scramble/444-solver.ts#L49)、[官方规则](https://biomejs.dev/linter/rules/use-arrow-function/javascript/)。使用者原文、官方说明、源码与本仓 CLI／消费者实跑于 **2026-10-31 UTC** 核实；数据公开投影经独立只读审查，不称为独立重新运行。
