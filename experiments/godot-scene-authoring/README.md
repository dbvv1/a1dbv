# Godot：把场景／资源二改交给真实消费者

**🧪 已有 Godot 项目先用匹配版本的官方 CLI＋原生保存接口；先跑导入，再把二改交给新进程中的原场景。** 本例借官方完整小游戏，不重写玩法，也不要求 MCP。读者可以把“改移动速度、刷怪节奏和碰撞资源”换成自己的窄任务，复用项目已有 GUT／GdUnit4 时无需再搬本探针。

## 直接运行

依赖：Python 3.11+、Linux x86_64 官方 **Godot 4.7.2 标准编辑器**，不是 export template／Mono 包。下载引擎后先核摘要；已有其他版本的工程维持自身版本，本例固定版本只为复现。

```bash
python3 run.py --godot /path/to/Godot_v4.7.2-stable_linux.x86_64
python3 -m unittest discover -s . -v
```

第一条下载约 1.8 MB 的固定官方 demo；已有 ZIP 可加 `--archive /path/to/2d_dodge_the_creeps.zip`，仍检查 SHA-256。命令从本目录执行。每次输出独立 `.work/run-*`，保原日志、工程副本、许可证与隔离 HOME/XDG/TMPDIR；不清理已有工程，不修改全局配置。缺引擎／输入、版本不符、超时、引擎错误或断言失败均不能通过。

| 固定输入 | 下载／身份 |
|---|---|
| 官方引擎 | [4.7.2-stable Linux x86_64](https://github.com/godotengine/godot-builds/releases/tag/4.7.2-stable)，实际版本 `4.7.2.stable.official.ed1daf0bf`；ZIP SHA-256 `cadd3204e728a35d3f13adb7fd0d7902636b79f6b95c40c265eb73b6c35329e4` |
| 官方完整游戏 | [demo release 4.7-6ad6167](https://github.com/godotengine/godot-demo-projects/releases/tag/4.7-6ad6167) 的 `2d_dodge_the_creeps.zip`；SHA-256 `cebca9d95eccd4fafa2b9c3892fd75be527c25044e6e78f91fe92b76ece29052` |

编辑器导入会使用临时本机 LSP／DAP：固定源码默认绑定 `127.0.0.1`，本例每次新建隔离配置，导入进程退出后才启动消费者。不需要额外服务、认证或更改系统网络设置。

## 作者到消费者：不是只测保存文件

```mermaid
flowchart LR
  A[官方源场景与资产] --> B[真实 --import]
  B --> C[原版完整回合]
  C --> D[复制 Shape 资源并保存]
  D --> E[保实例覆盖并 pack 新场景]
  E --> F[新进程加载与原生输入/定时器/碰撞]
  F --> G[原版再开仍不变]
```

- `prepare.py`：核固定归档并保所有原文件／许可。
- `author_variant.gd`：以 `GEN_EDIT_STATE_MAIN` 实例化场景，显式允许目标 Player 实例的子节点覆盖；复制胶囊资源，保存 `.tres` 后加载并接回，最后保存 `variant.tscn`。原 `main.tscn`／`player.tscn` 不改。
- `consume_scene.gd`：直接加载官方游戏脚本／场景。由原 HUD 按钮信号开始，真实 `Input.action_press` 驱动原 `_process`；原 Timer 生成官方 Mob、增加分数，原 PhysicsServer 的 Area2D 接触触发死亡，再等官方 HUD 协程返回开始按钮并重开。
- `run.py`：每一阶段都是新的官方引擎进程；除退出码外还拒绝 `ERROR:`／`CHECK_FAILED:`，核外置 shape 引用，保原始失败输出。

### 实测二改

固定 `--fixed-fps 60`、相同种子与观察帧序列；下表数值是该脚本条件下的原生结果，不是平衡建议。

| 消费行为 | 原版／原版重开 | 二改 |
|---|---:|---:|
| 速度（像素／游戏秒） | 400 | 240 |
| 连续向右输入 12 帧的位移 | 80 px | 48 px |
| MobTimer 间隔 | 0.5 s | 0.25 s |
| 同一观察段由原定时器生成的敌人 | 2 | 5 |
| 胶囊半径／高度 | 27／68 | 14／40 |
| 与固定测试敌人横向相隔 72 px | 碰撞死亡 | 不碰撞；移到重叠后仍正常死亡 |
| 死亡后重开 | 玩家恢复、分数归零、旧敌人清空 | 同左 |

`timer_spawned` 在加入受控碰撞敌人之前取值，不把测试生成的敌人计入。正常资源还核玩家各动画帧纹理、音乐／死亡音频及 HUD 字体非空。操作系统按键／鼠标点击、视觉布局、GPU 粒子、真实音频输出、导出平台与手感不在本次 headless 范围；这是真实 Godot 原生资源／SceneTree／2D 物理验证，不是本仓三款案例或 Unity 的验证。

## 两个会改变采用方式的失败

1. **未导入也能“玩完并退出 0”。** 首版只断言行为时，官方游戏已移动 80 px、刷怪、死亡／重开，但缺失 `.godot/imported` 导致纹理、音频、字体报错；进程仍为 0。最终回归先对干净副本做解析（成功），再实际消费（明确失败），之后才 `--import` 并重验。不能把 `--check-only` 或退出码当资源接收。
2. **内存改了不等于嵌套实例保存了。** 首次普通 `instantiate()` 后直接 `pack()`，速度／间隔保存了，但 Player 子节点的 shape 覆盖丢失，重开还报重复信号连接。最终用编辑构建的编辑态实例化与指定实例可编辑，真实新进程确认 shape 与碰撞都变了；只保存独立 `.tres` 还不够，须把该资源加载并接回场景引用。此窄做法不承诺任意复杂继承场景都能直接重打包。

正常探针停止两个 AudioStreamPlayer 后给 Dummy mixer 100 ms 墙钟清理时间再释放场景；它与加速游戏帧不同，不能据此声称听到了音频或测得混音性能。未导入、缺参数、缺场景、缺外置 shape 的错误各留独立日志；归档的正常、错误摘要、缺输入和路径越界另有 4 项单测。

## 许可与来源

Godot 与 demo 通用代码为 MIT；demo README 单列：Kenney 图片 CC0、HorrorPen 的 **House In a Forest Loop** 为 CC-BY 3.0、Xolonium 字体为 SIL OFL 1.1（保留字体名条件）。归档保原 README、LICENSE 与字体许可，复制到作品时继续保相应通知／署名；不能把全部素材称为 MIT。

官方 [CLI](https://docs.godotengine.org/en/4.7/tutorials/editor/command_line_tutorial.html)、[PackedScene](https://docs.godotengine.org/en/4.7/classes/class_packedscene.html)、[资源保存](https://docs.godotengine.org/en/4.7/classes/class_resourcesaver.html)；固定 [demo 源码／素材说明](https://github.com/godotengine/godot-demo-projects/tree/4.7-6ad6167/2d/dodge_the_creeps)、[LSP 默认配置](https://github.com/godotengine/godot/blob/4.7.2-stable/editor/settings/editor_settings.cpp)、[DAP 绑定](https://github.com/godotengine/godot/blob/4.7.2-stable/editor/debugger/debug_adapter/debug_adapter_server.cpp)。选型与真实开发者反证见 [WP9 §16](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#godot-native-authoring)。2026-10-26 核实并实跑。
