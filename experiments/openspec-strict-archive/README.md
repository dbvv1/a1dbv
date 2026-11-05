# OpenSpec 归档前：用已有 strict 阻断被忽略的需求

**OpenSpec 1.16.0 已有可用的 `validate --strict`，不必为未知需求节先写按 warning 文案匹配的 guard。** 对真实用户 #2195 的混合 delta，普通验证与归档都退出 0，但未知节中的需求没有进入当前 spec；严格验证退出 1，可用条件执行阻止归档。原 delta 仍完整保存在 archive，不是原文不可恢复地丢失。

只在项目接受“所有 warning 都须处理后才能归档”时选这条路径。strict 会阻断全部 warning，不是只针对未知节；它也不判断业务语义、实现或测试是否正确。保留既有格式和人工接收，不把未知节自动改成 ADDED／REMOVED。

## 直接可用的命令

在已安装对应版本、任务及代码验收完成后，把 `probe` 替换为已确认的 change ID：

```bash
openspec validate probe --type change --strict --no-interactive &&
  openspec archive probe --yes
```

必须保留 `&&`：验证失败时不运行归档。`--yes` 仍可越过未完成任务提醒，不能替代任务验收；验证后输入若又发生变化，应重新验证。这不是原子事务，也不会自动约束 Agent 的 `/opsx:archive` Skill 或其他直接归档调用。

## 实测而非新模式提案

固定 npm 发布包 `@fission-ai/openspec@1.16.0`、Node 24.22.1、Python 3.12.14，使用 #2195 的原始 Markdown。没有初始化真实工程、运行模型或业务代码。

- **普通路径**：`validate --all --json` 退出 0，报告 `valid:true` 和两个 WARNING；随后 archive 退出 0，只将已识别的需求写入主 spec。archive 中的 delta 与输入逐字节相同。
- **同一输入＋strict 条件链**：退出 1，所有项目文件 SHA256 前后不变，active delta 保留，没有生成主 spec。
- **合法输入控制**：只包含原有 ADDED 部分，条件链退出 0，主 spec 包含该需求，active change 被归档。此控制仅证明链条能放行合法输入，**不是建议删除未知需求来修复原任务**。

没有修改上游或本仓长期规则；不把该局部接收证据升级为通用默认。第二个真实同类任务与未读材料的本机读者尚未验证。

## 复跑

本目录的 package／lock 固定 npm 官方包及依赖；OpenSpec 为 MIT。复制本目录到一个临时目录，再在副本执行：

```bash
npm ci --ignore-scripts --no-audit --no-fund
python3 replay.py node_modules/@fission-ai/openspec/bin/openspec.js
```

脚本检查版本，为每次运行创建新临时项目，关闭遥测并隔离 HOME／XDG 配置；不主动联网。npm 安装需要联网。标准输出是可与 [result.json](result.json) 比较的结果，标准错误给出保留的命令、退出码和输出证据目录。无参数／CLI 不存在时拒绝运行；不要使用 Python `-O`。未运行完整 OpenSpec 源码测试、其他版本、原生 Windows或真实模型工作流。

**依据**：[用户 #2195 的原输入与请求](https://github.com/Fission-AI/OpenSpec/issues/2195)；[官方固定 validator](https://github.com/Fission-AI/OpenSpec/blob/3e4d5f0769e2857c8eb54f149cbf5e4f703fa04c/src/core/validation/validator.ts) 的 `createReport` 以 errors 与 warnings 同为零判严格通过，[CLI strict 入口](https://github.com/Fission-AI/OpenSpec/blob/3e4d5f0769e2857c8eb54f149cbf5e4f703fa04c/src/cli/index.ts)。同时核过实际安装包的 `dist/core/validation/validator.js`，但不宣称整份 npm 包等同该主干快照。核实与实跑：2026-11-05。
