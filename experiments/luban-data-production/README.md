# 配置源 → Luban → 真实生成消费者

这是配置生产链实验，不是游戏或引擎模拟。使用官方 Luban 5.1.0 生成 TypeScript 类型／加载器与 JSON，再用真实 TypeScript 编译器和 Node 加载两张表、解析跨表引用。用途与接入判断见 [玩法架构 §4](../../domains/game-dev/05-gameplay-architecture.md#4-数据驱动定义实例存档分开)。

## 复现

准备 Python 3.11+、Node、.NET 8 和官方生成器。本仓不下载或分发生成器二进制；从 [官方 examples](https://github.com/focus-creative-games/luban_examples/tree/c52e273f1f50a263e9257dddb35c8e222d9777b8/Tools/Luban) 取得完整 `Tools/Luban` 目录，不只取 DLL。该目录的生成器版本必须为 `5.1.0+df34215d2e22035073d1af83d44e3ac0744dc3b3`；来源和源码为 MIT，遵守其许可。也可按[官方安装说明](https://www.datable.cn/docs/guide/install)取得相同版本。

在本目录运行：

```bash
npm ci --ignore-scripts
export DOTNET=dotnet
export LUBAN_DLL="$(pwd)/../../tools/luban/Luban.dll" # 改为已准备的实际位置
python3 verify.py
```

示例 `tools/luban` 不是已附带目录。依赖安装与生成所需空间放普通工作磁盘，不在 RAM-backed 临时目录解压大型 SDK。测试自身只在本目录 `.work/` 建隔离输出，结束清理；不启动服务，不访问引擎或用户工程。缺生成器、错误版本、缺 Node／编译器均失败，不跳过。

## 看什么、改哪里

| 文件 | 职责 |
|---|---|
| `source/Defines/schema.xml` | 字段、稳定 ID、范围、`skillId` 引用约束 |
| `source/Data/*.json` | 唯一作者数据：两种敌人与两种技能 |
| `source/luban.conf` | 输入目录、生成目标与 Tables 名称 |
| `consumer.ts` | 使用真正生成的 `Tables`／`skillId_ref`，创建独立血量实例 |
| `verify.py` | 正常生成、字段／引用二改、失败与重复生成回归 |
| `nlog.xml` | 普通日志写 stdout，保留 stderr 给生成器结构化结果 |

只改 schema 和作者数据，不手改生成代码。消费者的血量减 10 仅证明定义与实例分开，不实现伤害系统；`armor` 只验证新字段可编译读取，不声称护甲公式已接入。

## 已观察结果

2026-10-26，.NET SDK 8.0.427／runtime 8.0.33、Node 24.22.1、TypeScript 5.9.3、上述固定 Luban：**3 个测试通过，含 5 类非法源数据子用例**。

- 基线：`scout`，maxHp 80，实例受损后 70，引用技能 `hit`／damage 10。
- 二改：稳定 ID 不变，改显示名、maxHp 100，增加 armor 6，改引用 `heavy`／damage 25；新消费者编译加载成功，实例受损后 90；旧生成数据仍可重新加载为基线。这不是同一活会话热更测试。
- 缺引用、范围越界、重复 ID、缺必填字段、缺输入文件均被真实生成器报告失败；旧已接受数据保持不变。
- 同一源数据重复生成的 JSON 字节相同；未断言所有生成代码跨平台确定性。

**关键发现：`--strict` 的引用／范围校验失败仍可能写出 JSON。** 本实验先生成到独立目录，检查非零退出码和 stderr 的 JSON `ok`，只将成功结果交给消费者；不能用“文件存在”判成功。`generated_validated` 拷贝仅示范验收门槛，不是原子部署／崩溃恢复实现。实际项目应成套接纳代码与数据，编译、消费者检查通过后再替换旧版本。

未运行 Unity、UE 或现有游戏；此结果支持工具／加载契约，不证明资产引用正确、平衡好玩或原生接入完成。
