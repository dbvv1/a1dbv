---
name: ue-run-tests
description: 在命令行运行 Unreal 自动化测试（Automation Spec / Automation Test）并汇总失败用例。改完逻辑代码后、修 bug 验证时、用户要求跑测试时使用。
allowed-tools: Bash(.claude/skills/ue-run-tests/scripts/run_tests.sh*) Read
argument-hint: "[测试过滤，如 MyGame.Combat]"
---

# 运行 Unreal 自动化测试

```bash
.claude/skills/ue-run-tests/scripts/run_tests.sh $ARGUMENTS
```

- 参数是测试过滤条件（默认为项目名），写法同 Epic 文档：
  - `MyGame.Combat`：运行这个前缀下的所有测试；
  - `MyGame.Combat.Damage+MyGame.Inventory`：运行多个；
  - `Group:Smoke`：按分组运行。
- 改了 C++ 之后先用 `ue-build` 编译通过，否则会跑旧代码或启动失败。

## 处理结果

- 退出码：0 全部通过；1 有失败（stdout 中有失败用例和错误信息）；2 环境问题（没有生成报告、没有匹配的测试、找不到引擎）。
- 没有匹配的测试：用脚本提示的 `Automation List` 查看真实的测试名，再调整过滤条件。
- **不要修改测试来让它通过**，除非测试本身写错了，并且要向用户说明理由。
- 修完后重新运行，直到全部通过；报告结果时附上汇总那一行作为证据。

## 写新测试时

- 优先用 Automation Spec（`BEGIN_DEFINE_SPEC` / `END_DEFINE_SPEC`），测试名以项目名开头（如 `MyGame.Combat.Damage`），方便过滤。
- 游戏规则尽量写成不依赖 World 的纯 C++，这样测试不需要加载关卡，又快又稳。
- 需要 World 的流程用 Functional Test，并加入 `Group:` 分组，方便在 CI 里分批运行。
