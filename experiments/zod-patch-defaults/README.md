# Zod PATCH：复用字段校验，不复用创建默认值

**更新接口的“未提交字段保持原值”，不能仅靠带默认值的创建 schema 加 `.partial()`。** Zod 4.6.7 会为缺少的可选字段填默认值；`.exactPartial()` 也不解决本例。新写或调整平面 JSON 更新接口时，可共享无默认值的字段校验，再分别定义 Create 与 Patch，不引入通用解包器。

直接可用的窄例见 [settings.mjs](settings.mjs)：

```js
const Fields = z.object({ theme: z.string(), fontSize: z.number() });
const Create = Fields.extend({
  theme: Fields.shape.theme.default('light'),
  fontSize: Fields.shape.fontSize.default(14),
});
const Patch = Fields.partial();
```

这份例子采用原报告的字段类型，不替项目决定主题枚举或字号范围。实际接入要保留原有字段约束、对象未知键策略与业务校验；不要从已有复杂 schema 随意抽 shape 后重建对象，丢掉跨字段 refinement。创建所需默认值仅在 Create 添加，更新路径验的是“省略字段没有出现在输出里”。

## 实跑：解析成功仍可能改错字段

官方 npm `zod@4.6.7`、Node 24.22.1，使用 [#6719](https://github.com/colinhacks/zod/issues/6719) 的 Settings 与输入 `{fontSize:16}`：

- 原 `Settings.partial()` 解析出 `{theme:'light',fontSize:16}`；`.exactPartial()` 相同。
- 本仓增加一个明确的**内存更新示例**：已有 `{theme:'dark',fontSize:14}` 与解析输出浅合并，theme 被重置为 light。未连接数据库，不当成报告者生产事故的独立复现。
- 使用无默认 Fields 的 Patch，只解析出 `{fontSize:16}`；同样合并后 theme 保留 dark。
- Create 解析空对象仍给出 light／14；Patch 解析空对象仍是空对象；错误类型 `{fontSize:'16'}` 被拒绝。
- 对这个平面旧 schema，逐字段调用 `removeDefault()` 再 `.partial()` 也得到正确输出。少数已知默认字段可沿此局部修复，不必重构全部定义。

[社区的 Optional／Default 递归 helper](https://github.com/colinhacks/zod/issues/6719#issuecomment-6610557402)并不覆盖所有包装器。本轮按同样运行时分支、以原生 Object.fromEntries 代替 lodash，验证[后续用户的 nullable 反例](https://github.com/colinhacks/zod/issues/6719#issuecomment-6623869514)：`z.string().default('x').nullable()` 在只输入 `{b:1}` 时仍补出 `a:'x'`。这里只实跑 nullable，不把其他评论例子当成已验证，也没有制作新的递归剥离工具。

## 适用边界

这不是 Zod 待修 bug；[官方 v4 迁移说明](https://github.com/colinhacks/zod/blob/93b7a62a64bc62561590e81f4fed4cbdca507692/packages/docs/content/v4/changelog.mdx#defaults-applied-within-optional-fields)明确改为在 optional 内应用默认值。只需要完整创建对象时保留默认；已有独立 Patch schema 无需为本例改动。

本例只处理平面、稀疏 JSON 更新：未验嵌套合并、显式 undefined、null 删除约定、数组操作、转换管道、数据库更新策略或跨字段规则；它不是完整 JSON Merge Patch 实现。`.partial()` 是浅层可选化，JavaScript 对象中的显式 undefined 也不等同 JSON 缺省键。实际接口按自己的契约补回归，不把“解析未报错”作为持久化正确的证明。

## 复跑

复制本目录到临时目录，在副本执行：

```sh
npm ci --ignore-scripts --no-audit --no-fund
node replay.mjs
```

package／lock 固定官方 Zod 4.6.7（MIT，无额外运行依赖）；runner 核版本、断言上述正常／错误输入及结果，输出应与 [result.json](result.json) 一致。安装需要联网；运行本身不访问网络，不写真实业务状态。缺依赖或断言失败直接非零退出。未执行 TypeScript 类型检查、完整 Zod 源码测试、真实框架端点或模型生成任务。

**来源**：[原功能请求 #6719](https://github.com/colinhacks/zod/issues/6719)、[实际项目反馈](https://github.com/colinhacks/zod/issues/6719#issuecomment-6603279906)、[更早的 API 使用者 #6627](https://github.com/colinhacks/zod/issues/6627)与其 `removeDefault` 回复；官方[固定 classic 方法](https://github.com/colinhacks/zod/blob/93b7a62a64bc62561590e81f4fed4cbdca507692/packages/zod/src/v4/classic/schemas.ts)及上述迁移说明。源码主干与实际发布包分别核读，不宣称整个构建相同。无上游修改或投稿，不升默认。核实与实跑：2026-11-05。
