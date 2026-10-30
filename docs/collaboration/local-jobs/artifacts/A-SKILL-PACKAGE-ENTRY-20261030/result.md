# A-SKILL-PACKAGE-ENTRY-20261030 · 单元 1 结果

## 差量

- `experiments/tanstack-url-state/README.md`：在“立即运行”补上从本仓根进入 `experiments/tanstack-url-state` 的工作目录；把“先看版本 → `cat node_modules/@tanstack/router-core/...`”改为 `npm ls` 加 Node `createRequire` 解析，从 `@tanstack/react-router` 自身位置找 `@tanstack/router-core`，不再假设顶层 hoist；按退出码区分缺 Router／缺 router-core／包内无 Skill／读到正文；Intent 改为可选且带 `--no` 与未安装回退；补回按原测试／构建验收。修正复核：入口改为先按“立即运行”执行 `npm ci`；Intent 已安装守卫改用 `import.meta.resolve`，不再经过该包未导出的 `./package.json`；`--no` 的说明改为未安装时不调用 `npm exec`；pnpm 布局改为实测描述。
- `docs/decisions/skills-and-plugins.md`：明确命令在读者自己的应用消费目录运行，不是本仓实验目录；补版本确认、同一份解析脚本、退出码分支、只读与“读取成功不等于自动加载”，验收改用应用原有测试／构建命令。修正复核：pnpm 的版本确认改为 `pnpm list --depth Infinity`（或 `pnpm why @tanstack/router-core`），因为默认 `pnpm list` 只列直接依赖；补记已在 pnpm 11.21.0 真实布局实测。
- 未改依赖、lockfile、源码、测试或模板；两页使用同一段解析脚本，仅工作目录说明不同。

## 真实包核验

- 从公开 npm registry 取 `@tanstack/react-router@1.170.46` 与 `@tanstack/router-core@1.171.39` 的发布 tarball（未安装进工作树）：前者 `dependencies["@tanstack/router-core"]` 为 `1.171.39`；后者含 `skills/router-core/search-params/SKILL.md`，元数据 `library_version` 仍为 `1.171.15`。
- 用这两份真实包文件在仓外临时目录拼成非 hoist 布局（router-core 嵌在 react-router 下），运行文档中的解析脚本：退出码 0，输出 `@tanstack/react-router 1.170.46`、`@tanstack/router-core 1.171.39` 及 skill 正文。
- 修正复核在另一个仓外临时目录用实验的 `package.json`／`package-lock.json` 真实执行 `npm ci`（136 包）：三个包分别为 `@tanstack/react-router@1.170.46`、`@tanstack/router-core@1.171.39`、`@tanstack/intent@0.5.6`；文档中的解析脚本退出 0，读到 9174 字符（9210 字节）的 Skill，`library_version` 仍为 `1.171.15`。
- pnpm 11.21.0 临时项目安装 `@tanstack/react-router@1.170.46` 后：同一 Node 解析脚本退出 0，解析到 `@tanstack/router-core@1.171.39` 并读到 Skill；`pnpm list @tanstack/react-router @tanstack/router-core` 与裸 `pnpm list` 只显示直接依赖 `@tanstack/react-router`；`pnpm list --depth Infinity @tanstack/react-router @tanstack/router-core` 与 `pnpm why @tanstack/router-core` 均显示 `1.171.39`；`npm ls` 在该 pnpm 布局也显示两者。

## 合成布局分支

在仓外临时目录用固定假包验证，不冒充真实 npm／pnpm 安装：

| 布局／状态 | 结果 |
|---|---|
| 非 hoist（router-core 嵌在 react-router 内） | exit 0，打印版本与正文 |
| hoist（两者同为顶层依赖） | exit 0，打印版本与正文 |
| 已装 router-core 但包内无 `search-params/SKILL.md` | exit 4，提示改读对应版本指南或源码 |
| 已装 react-router，解析不到 router-core | exit 3，提示核对版本与依赖声明 |
| 应用目录缺 react-router | exit 2，提示先安装，入口不下载 |

## Intent 分支

- 真实安装（`npm ci` 136 包，`node_modules/.bin/intent` 存在）核出缺陷：`@tanstack/intent@0.5.6` 的 `package.json` `exports` 只有 `.` 与 `./core`，旧守卫 `require.resolve('@tanstack/intent/package.json')` 抛 `ERR_PACKAGE_PATH_NOT_EXPORTED`、退出 1，已安装也永远走 else。
- 新守卫 `node --input-type=module -e "import.meta.resolve('@tanstack/intent')"` 在已装目录退出 0，在无该包目录退出 1。完整 if 块实测：已装目录进入 if，`intent list --json` 列出 13 个 Skill（其中 `router-core/search-params` 1 条，顶层 2 个包），`intent load ...` 返回 `source: local`、`version: 1.171.39`；缺包目录进入 else 并打印回退，未调用 `npm exec`。
- `--no` 机制：npm 10.9.8 把 `npm exec --no` 解析为 `exec --no-yes`；在无该包目录仍先 `GET https://registry.npmjs.org/intent`（200），再以退出码 1 失败，且未生成 `node_modules`。因此页面不再把“不下载”归因于 `--no`，改为“未安装时不调用 `npm exec`”。
- 页面保留 10-23～24 的原 list／load 实测叙述；本轮在真实安装布局复现了同一结果。

## 同页并行

- `dot-a/skills-round-20261029` 的 `017a3363`（另一卡 `A-SKILL-TEMPLATE-READER-20261029`，`review_ready`）大幅重构了同一决策页，并把 Cargo／TanStack 例子移往证据页；该草稿不在 main，也未进入本卡固定输入。本单元按 `base_ref` 的原页改，没有合并或覆盖该草稿；两者合并顺序由负责人处理。

## 检查

- `python3 scripts/check_repo.py`：exit 0，576 个文件，无错误。
- `python3 scripts/check_public.py`：exit 0，1004 个文件，无命中。
- `git diff --check`：exit 0。
- 提交身份检查：当前 git 配置的提交邮箱为公司域名，不符合公开仓库要求；本单元未提交，提交时须由接收端改用白名单中的机器身份（不在产物中复述该地址）。
- 修正复核在仓外临时目录真实执行 `npm ci`（136 包）与 pnpm 11.21.0 安装，验证完即弃；未写入工作树，未提交。工作树仍无 `node_modules`。
- 未运行实验的 `npm test`／`npm run build`：本轮只改入口文档，未改实现、测试或依赖。
- 未重跑真实浏览器验收；沿用页面原有 10-23／24 结论与日期。

## 未验分支

- 真实 `npm ci` 布局只核了入口脚本、Intent CLI 与版本，未在该布局重跑 `npm test`／`npm run build`；只有入口与 Skill 读取证据。
- pnpm 只实测列表命令与 Node 解析；README 的 Intent 分支是 npm 实验布局，pnpm 下的 Intent CLI 未单独实测。
- 读取成功仅表示正文进入终端，不表示 agent 自动加载、模型遵守或收益提升。
