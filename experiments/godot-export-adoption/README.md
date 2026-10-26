# Godot：从编辑器通过到真正的应用包消费者

**🧪 先用官方导出 preset 交完整应用包，再从没有项目目录的交付副本启动；不是拿 Editor 加载 PCK 代替发布程序。** 本例复用[上一单元](../godot-scene-authoring/README.md)固定的官方小游戏与二改脚本，只补原生导出这一层。已有 CI 可继续调用相同官方 CLI；本例不创建云发布、商店账号或补丁平台。

## 运行与依赖

Linux x86_64、Python 3.11+、官方 Godot 4.7.2 编辑器，以及同版本 `linux_debug.x86_64`／`linux_release.x86_64` 模板。模板来自 [官方 4.7.2 release](https://github.com/godotengine/godot-builds/releases/tag/4.7.2-stable) 的 `Godot_v4.7.2-stable_export_templates.tpz`：约 1.28 GB，SHA-256 `f298490b8d44d934be425a5a65a51bf15f422428b229a06a6e11d9ffea248011`。先校验，再仅解压 `templates/linux_debug.x86_64`、`templates/linux_release.x86_64`；不必解压全部平台。编辑器与 demo 摘要沿上一单元。

```bash
python3 run.py \
  --godot /path/to/Godot_v4.7.2-stable_linux.x86_64 \
  --templates-dir /path/to/templates
python3 -m unittest discover -s . -v
```

已有官方 demo ZIP 可加 `--archive /path/to/2d_dodge_the_creeps.zip`，否则只下载约 1.8 MB 的 demo。模板不自动下载，程序校验两个模板的固定摘要，缺少或错版直接失败。运行会生成新的 `.work/run-*`，保原日志、工程、两种配置的包与交付副本；缺产物、错误日志、子进程失败或超时均中止，不拿旧包填空。HOME/XDG/TMPDIR 隔离在该工作目录，导入只使用官方本机临时编辑器服务。

## 实际制作链

1. 原四份官方玩法脚本与原场景不改。增加项目侧 `DeliveryProbe`：正常启动时读取 `stage_title.txt`，把本关标题交给原 HUD；只有显式用户参数 `smoke …` 才执行回归。它是本例的窄接线，不是通用发布框架。
2. 先用编辑器验证源工程的标题、移动、刷怪、碰撞、死亡与重开。
3. 原生 `--export-release`／`--export-debug` 生成 **可执行文件＋PCK**。`export_presets.cfg` 明确选同版本模板、目标架构和资源过滤。
4. 只复制本次 exe、PCK 与原素材许可说明到独立交付目录，另建玩家 HOME／缓存，从该包的正常入口运行。回归核 `OS.has_feature("editor") == false`，同时辨别 debug／release，不使用 `--script` 覆盖入口。
5. v2 复用上一单元原生作者脚本，选择新变体作为主场景，把速度 400→240，标题改为 Night shift、应用版本 1.0.0→1.1.0；构建新发布包，再从 v1 旧包重开。原脚本／场景与旧 exe／PCK 的字节摘要必须不变。

正常运行不自动试玩。探针用动作输入和既有按钮信号驱动原游戏；运行模式与应用版本来自真正的发布程序。没有改造官方模板的 path override 设置，也不把 `--export-pack` 当可玩应用。

## 已观察到的采用差距

- **导出退出 0 仍不代表必要内容齐。** 最初 preset 使用 `all_resources`，不设过滤：源工程的标题可用，真正的 release 包中 `.txt` 缺失，原 HUD 得到空标题；合成的 `unreleased/bonus_level.json` 却被打进去。包能启动、玩法可走完，仍被消费者断言拒收。
- **JSON 与普通文本分开看。** 当前 Godot 把 JSON 当资源；不能照旧说明把所有 JSON 当默认遗漏的非资源。对此例显式包含 `*.txt`、排除 `unreleased/*` 后，发布包正确消费标题且不包含未发布关卡数据。自己的项目应按真实必要内容选择规则，不把这两个模式盲抄到全部项目。
- **编辑器探针命令不等于发布程序能力。** 官方 4.7 CLI 将 `--script`／`--main-pack` 列为 extended；本次官方 release 程序的实际 `--help` 也不提供这些路径覆盖入口。沿正常主场景＋项目已许可的测试入口验证，不为套用旧探针重新构建放开模板。
- **开发包与发布包分别运行。** 本地已实际生成并消费两者，debug feature 分别为 true／false；不因为开发包正常就替发布包盖章。最终 v2 与旧包保持检查由 `run.py` 完整入口执行。

完整入口已通过：源工程→错误过滤包拒收→v1 release→v1 debug→v2 release→旧 v1 再开。v1 实际报告 `Training shift / 1.0.0 / 80 px`，v2 为 `Night shift / 1.1.0 / 48 px`，旧 v1 再开仍为前者；原四脚本／原场景以及旧 exe／PCK 的摘要保持不变。4 项文件交付／许可／过滤单测另行通过。

探针用显式条件与非零退出报告失败，不依赖发布构建会忽略的 GDScript `assert`。原始导出错误、消费者输出与改后结果分别落盘；一次成功导出不会抹去前次失败。

## 接回自己的工程

已有固定 preset／CI 时把“复制本次完整包→正常入口→关键回合／资源”加到原流程，复用现有测试框架；不要把本例 autoload 当所有作品都应随包发布的诊断组件。实际发行还须按目标环境验输入、GPU 画面、音频、存档及升级路径；本例是 Linux headless 原生应用与内容消费，不是商店发布或其他平台通过。

本地副本保 demo MIT、音乐 CC-BY、图片 CC0、字体 OFL 的原通知；正式发行还需按所用引擎／插件／素材提供对应版权与许可信息，可用官方 `Engine.get_license_text()`、`get_license_info()`、`get_copyright_info()` 整理 Godot 及第三方组件说明，不把一次技术验证当完整发行许可审查。

来源：官方 [导出项目](https://docs.godotengine.org/en/4.7/tutorials/export/exporting_projects.html)、[Linux 导出](https://docs.godotengine.org/en/4.7/tutorials/export/exporting_for_linux.html)、[CLI](https://docs.godotengine.org/en/4.7/tutorials/editor/command_line_tutorial.html)、[JSON 资源实现](https://github.com/godotengine/godot/pull/65295)、[修正旧 JSON 提示](https://github.com/godotengine/godot/pull/119555)、[Engine 许可信息接口](https://docs.godotengine.org/en/4.7/classes/class_engine.html)。2026-10-26 定向核实与本地阶段实跑；完整取舍见 [WP10 原生发布包消费者](../../docs/research/2026-10-14-game-wp10-client-modules.md#native-release-consumer)。
