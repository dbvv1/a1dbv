# 在官方 Router 示例里，把筛选变成可分享的页面状态

核实时间：2026-10-23。🧪 试用：给已经使用 TanStack Router 的项目，按当前安装包加载窄领域 Skill，再用真实应用的导航验收它。无需为两个字段再装 Zod，也无需启用整套 agent hooks。[本轮实测／研究]

本产物在官方 React basic 示例上新增 Posts 标题筛选、A→Z／Z→A 排序、清空与返回结果；不是上游缺陷修复或真实客户委托。读者可直接运行，也可把 `posts-search.ts` 和父路由的 search 配置迁入现有项目。

## 立即运行

需要 Node.js 24（本轮 24.19.0）和 npm。所有依赖与 lockfile 已固定；首次安装需访问公开 npm registry。

```sh
npm ci
npm test
npm run build
npm run dev
```

打开 Vite 输出的本地地址，进入 Posts：输入标题片段，选择 Title order，按 Apply；打开任意结果后，地址仍带筛选与排序，Back to results 保留状态。Clear filters 删除默认参数。复制详情地址，在新标签页打开也应恢复筛选状态。生产示例沿用上游 JSONPlaceholder 请求，因此手动运行需要网络；自动测试使用独立手写数据，不依赖该服务。

Apply 提交一次历史记录，不为每个按键生成记录；尚未提交的输入只是表单草稿。筛选不区分英文大小写，忽略首尾空白；排序固定英文 locale，标题相同时按 ID 打破平局。浏览器后退恢复的是已应用状态。

## 真正可借用的三处选择

1. **共享状态放在父路由。** `/posts` 的 `validateSearch` 将不可信 URL 值收窄为可用值，子详情继承相同 schema。组件从 `Route.useSearch()` 读取，不另建一份 React 状态当真源。
2. **保留与清空要一起设计。** `retainSearchParams(['q', 'sort'])` 让详情链接保留筛选；`stripSearchParams({ q: '', sort: 'asc' })` 让默认 URL 简短。Clear 必须显式给默认值，不能假定空对象会覆盖 retain。测试同时走详情、返回、清空、后退与前进。
3. **先分清本地展示与取数依赖。** 这里筛选的是已加载的前十条帖子，没有把所有 search 塞进 `loaderDeps`。服务器筛选／分页若依赖字段，才把实际取数需要的字段加进去。

原来的 Home、Pathless Layout、根 not-found 和 Non-existent Post 演示保留。假帖子单独放在结果列表外，不混入过滤数量。原 `posts.ts` 未修改。为了让 URL 重建可验，路由声明移入 `router.tsx`，`main.tsx` 只负责挂载；测试使用同一份路由和组件。

## 窄 Skill 的复制入口

本轮 `@tanstack/react-router@1.170.46` 精确依赖 `@tanstack/router-core@1.171.39`。Intent 是可选开发依赖，不是运行时功能所需。

```sh
# 先看安装版本，再读取实际安装包里的领域知识
npm ls @tanstack/react-router @tanstack/router-core @tanstack/intent
cat node_modules/@tanstack/router-core/skills/router-core/search-params/SKILL.md

# 本包固定 Intent 0.5.6；只发现，再加载返回的精确标识
npm exec -- intent list --json
npm exec -- intent load '@tanstack/router-core#router-core/search-params' --json
```

本轮 list 确实发现了传递依赖 router-core，load 返回该本地包的 Skill（source: local；path: node_modules/@tanstack/router-core/skills/router-core/search-params/SKILL.md；version: 1.171.39）。这是手动 CLI 加载并阅读，不是原生 agent 自动激活验证。它的文件内容与固定上游提交一致，但 `library_version` 仍写 `1.171.15`。因此“随包交付”解决定位，不保证文档每项都已按该版本校正；最终仍对照当前源码与消费端测试。不要把发现列表全部当可信指令，也不要仅为加载这个 Skill 安装 hooks／全局配置。[本轮实测／一手源码]

交给 coding agent 的短任务可以是：

> 在现有 Posts 页实现可分享的标题筛选和升降序。先核对已安装 Router 版本，只读该包 search-params Skill 与相关源码。沿用现有路由和 loader，不新增 schema 库。用 URL 作为已应用状态；验详情／返回／清空／历史后退前进／新 Router 从 URL 重建，以及非法参数和空结果。报告实际返工与未验范围，不比较未实测的模型收益。

## 实测与返工

- `npm test`：7 项真实 Router + React DOM 消费流程通过。jsdom 环境、memory history、受控 fetch；生产 loader 和 redaxios 照常执行，未伪造 Router／组件。覆盖详情与返回、清空后后退前进、复制详情 URL 的新 Router 重建、错误类型／非法排序、空结果与重复 Apply、筛选中换序和输入清空、原有导航／错误演示。
- `npm run build`：Vite 构建与严格 TypeScript 检查通过。
- 首次用了 `toSorted`，类型检查发现上游 lib 仍是 ES2022；改为 `.filter(...).sort(...)`，排序的本来就是新数组，不改原 loader 数据，也无需升级上游编译目标。测试中误用了 `getByRole` 不支持的 `exact` 选项，类型检查后删除。
- 初始程序化验收使用jsdom／memory history；后续真实Chrome与HTTP补验见下，两种证据分别保留。未做移动端、性能、安全或线上部署验收。未做模型有无 Skill 对照，因此不声称提高成功率、节省 token 或减少返工。

## 真实浏览器补验

2026-10-23 23:03（UTC+8），重新构建同一份已交付源码，以普通Vite预览在真实Chrome运行，保留原JSONPlaceholder请求，没有替换API或数据。`dolorem`＋降序得到3/10；详情、复制URL到新标签及刷新均保留条件和正文，浏览器前进／后退、返回结果、清空、空结果及非法参数默认也已实际操作通过。[本轮真实客户端；[逐项记录与源文件哈希](browser-acceptance.json)]

![真实Chrome：dolorem筛选与降序保留三条结果，打开第9条详情后条件仍在](../../docs/img/2026-10-23-tanstack-url-state.png)

截图是实际页面，不是生成示意；只支持这个桌面浏览器与窄功能范围，不是跨设备体验或部署接收。

## 来源与许可

- [官方 basic 示例与源码](https://github.com/TanStack/router/tree/6b9fe6d29552270836c511bc9b343d73541f4424/examples/react/basic)，固定提交 `6b9fe6d29552270836c511bc9b343d73541f4424`。[一手]
- [包内 search-params Skill](https://github.com/TanStack/router/blob/6b9fe6d29552270836c511bc9b343d73541f4424/packages/router-core/skills/router-core/search-params/SKILL.md)、[官方 search params 指南](https://github.com/TanStack/router/blob/6b9fe6d29552270836c511bc9b343d73541f4424/docs/router/guide/search-params.md)及实际安装包 `src/searchMiddleware.ts`。[一手]
- [Intent 0.5 官方介绍](https://tanstack.com/blog/intent-0.5-skills-you-can-maintain)：按包维护、发现和加载领域知识。[一手；背景，不能证明模型收益]
- [开发者讨论：Router、Query 与过滤状态保留](https://www.reddit.com/r/reactjs/comments/1to7tcj/tanstack_router_and_query/)。[社区；需求参照，不代表此示例是对该作者的交付]

上游 MIT 许可证完整保留于 LICENSE；依赖沿各自许可证。探索回执：本轮定向续接既有官方／实践者调研，实际读固定示例、Skill、官方指南与已安装 middleware 源码，并运行 Intent 与应用测试；未另做全渠道前沿横评。
