# Vue 项目中用 Serena 从接口找到实现类

**遇到 `find_implementations` 的 `Unhandled method textDocument/implementation (-32601)`，先核实际语言服务器路由。** [真实问题 #2218](https://github.com/oraios/serena/issues/2218)中，Vue adapter 把请求交给不支持它的 Vue LS；[本补丁](fix.patch)按已有 definition／rename 路径委派给 companion TypeScript server，并声明相应能力。已有 IDE／TS 服务能完成查询时，继续原入口即可。

## 已审候选与恢复条件

- 上游基线：[773a77e19f0da348f505640c33a8b4e1d7817dc2](https://github.com/oraios/serena/commit/773a77e19f0da348f505640c33a8b4e1d7817dc2)。补丁 5 文件、55 行新增，其中生产改动 12 行；没有改依赖或 hover。
- 补丁 SHA-256：`3a803ea2a23f783bbbe802c5d3a1be3eb48143d9e8d0730ba11d8a69cd31ca26`。可在该固定基线应用 `fix.patch` 后复跑下方检查。
- 本地候选提交：`195392e55503f44804995028de325c1506d7b446`，尚未在上游或 fork 发布；公开可恢复产物是本目录补丁。
- 独立新上下文审查通过。等待可写 fork；发表前重查上游是否已有修复，保留每项目最多一个开放 PR。[CLA](https://github.com/oraios/serena/blob/773a77e19f0da348f505640c33a8b4e1d7817dc2/CLA.md)须贡献者本人审阅决定，尚未代为接受。

## 真实验证

Linux、Python 3.13.5；Vue language-server／typescript-plugin 3.1.5、TypeScript 5.9.3、typescript-language-server 5.1.3。使用隔离 HOME 与 Serena 配置目录，关闭 usage reporting。

| 检查 | 实际结果 |
|---|---|
| 最终两项新测试＋原 adapter | 两项均以真实 LS 的 `-32601` 失败 |
| 修后 Vue suite＋Serena 工具层 | 43 passed，83 deselected；默认调用准确返回唯一 `Square` |
| 项目 format、src／test type-check、空白检查 | 通过 |

在已应用补丁并按上游安装开发依赖的 Serena 根目录运行：

```sh
TEST_HOME=$(mktemp -d)
SERENA_USAGE_REPORTING=false SERENA_HOME="$TEST_HOME" HOME="$TEST_HOME" \
  uv run --no-sync poe test test/solidlsp/vue test/serena/test_serena_agent.py -m vue -q
uv run --no-sync poe format
uv run --no-sync poe type-check
git diff --check
```

验证的是 Vue 项目里的 TypeScript 接口及默认工具调用；其他语言／平台、`.vue` 组件实现语义及真实 MCP 客户端未验。独立的 `include_info`／hover 问题未扩修。

## 来源与许可

[贡献规范](https://github.com/oraios/serena/blob/773a77e19f0da348f505640c33a8b4e1d7817dc2/CONTRIBUTING.md)允许经实际测试／认真审查的小型 AI 辅助修复。补丁保留上游组件许可，新增 SolidLSP 测试与夹具有 MIT SPDX；[Serena／SolidLSP 原许可](https://github.com/oraios/serena/blob/773a77e19f0da348f505640c33a8b4e1d7817dc2/LICENSE)继续适用。核实与运行：2026-10-27。
