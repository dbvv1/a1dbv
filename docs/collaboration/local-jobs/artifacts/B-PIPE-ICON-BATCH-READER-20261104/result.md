# B-PIPE-ICON-BATCH-READER-20261104 结果

状态：**阻塞（缺 CairoSVG／系统 Cairo）**。已核清固定消费者与既有产物，取得配方改动、既有 36 文件清单、失败时旧批保持等可核结果；完整 PNG／预览重出与“36 个运行图逐字节一致”未验证，不声称照做成功。

## 结论

- 固定消费者 `MOBA-Like@b489ed38592dc184fffe2ab9b3b186441c7dc9bb` 与页面描述一致：`asset-pipeline/icons` 有六个顶层源、导出 36 个运行文件（12 SVG＋24 PNG），但没有入库的 `preview.png`。
- 正常二改在配方层通过：把 dark 的 `accent` 改成 bright 的 `#086E85` 后 `validate()` 通过；用导出器自己的 `themed()` 逐件生成，12 个 bright/dark SVG 中 bright 6/6 不变、dark 6/6 变化，原配方能逐字节复现已入库的 12 个 SVG。但 `export.py` 在 `render()` 内 `import cairosvg` 时失败，未生成 PNG 与预览。
- 缺源失败与首次无旧批失败在真实环境都被同一个 `ModuleNotFoundError` 提前挡住，走不到缺源分支。另用**显式标注的 stub 渲染器**只复核控制流：缺 `self-shield.svg` 时 exit 2，旧批 36 文件哈希不变，无 lock／backup／临时目录；首次导出失败不留最终目录。stub 输出不是可用的图标 PNG，不当作重出结果。
- `test_export.py`：15 项中 3 项通过（参数校验、CLI 坏输入、盾源身份／通知），12 项因缺 `cairosvg` 报错，exit 1。

## 环境与源

- 固定消费者按 commit 取，`git archive` 到本卡临时目录；本地默认分支仍停在旧四图标导出器，不能用工作区文件代替该 commit。
- Python 3.13.5；`Pillow 12.3.0` 可用；`cairosvg`、`cairocffi`、`cffi` 均未安装；系统无可加载的 Cairo DLL（`ctypes.util.find_library('cairo')` 返回空）；无 `rsvg-convert`、Inkscape、ImageMagick；pip 缓存中未找到 `cairosvg`。
- 未安装任何软件／模型，未访问网络、模型网关或凭据，未使用 GPU、GUI、浏览器或桌面操作。`gen3d`／`glbprep` 与本 2D 任务无关，未使用。

## 既有 36 个运行文件清单

聚合哈希（对按路径排序的 `sha256` 清单文件再取 `sha256`）：`8efcb6680f0ad1a65fb99d325020fc76653124e39773a9b26df45f39fb792a47`。下表为每文件 SHA-256 前 16 位；完整 64 位见临时目录 `scratch/moba-icons-attempt1/baseline.sha256`。

### bright

| icon | `.svg` | `-32.png` | `-48.png` |
|---|---|---|---|
| `targeted` | `c6e887057222426f` | `eb475cb2736c9b09` | `525b11cf84231cd7` |
| `displacement` | `41a365d6621c4e7d` | `852a2ba3803288b9` | `eb145d404fe304ad` |
| `persistent-effect` | `4db08a203e349090` | `953cabe78fbced2e` | `83bfacc01920431a` |
| `control` | `bf243432b2226065` | `fcc4d6c655935fe5` | `9d3798958e1430eb` |
| `directional-projectile` | `3891dace9eeecfff` | `6b9117e309f04432` | `9c71e39d306ce143` |
| `self-shield` | `7c99b4d0031b7512` | `9352a5beecbc426b` | `bdd4185fe47736c0` |

### dark

| icon | `.svg` | `-32.png` | `-48.png` |
|---|---|---|---|
| `targeted` | `d2f59548cd095c07` | `5b338bd2a6dcd1b0` | `ad10107aa62cc8b6` |
| `displacement` | `3299a65524d0159f` | `419ddd97dd9138e1` | `e4ac32997cd42802` |
| `persistent-effect` | `d90b7c1a461185ee` | `f3440a2d2ec970d4` | `58e7c6bf66839817` |
| `control` | `175d70649687f5cc` | `ea6c20489e3c543d` | `c5290c962168c4f2` |
| `directional-projectile` | `245757c4fc9f6fd2` | `800fd7828515af67` | `a544486d56b6d4f5` |
| `self-shield` | `1030ffd733276bb0` | `56834a7e432c17f3` | `6afee48172ff7460` |

`preview.png` 不在固定 commit 的树里（`.gitignore` 忽略，需成功导出后生成；测试期望尺寸 960×400）。

## 配方改动

`variants.dark.accent` 由 `#70E6E1` 改为 bright 现有的 `#086E85`；`ink`、`stroke_width=4.5`、`preview_background` 及其余字段不变。临时副本路径：`scratch/moba-icons-attempt1/scenarioA/recipe-dark-accent.json`。

## 三个场景

| 场景 | 环境 | exit | 结果 | 旧批 |
|---|---|---|---|---|
| 正常二改（改 dark accent，输出到已有批） | 真实依赖 | 1 | `ModuleNotFoundError: No module named 'cairosvg'`；未生成 PNG／预览 | 36 文件哈希前后一致（清单聚合 `7a53fff77e415712d498b970797fcea401bcdde761157b5860bc50c1d92ef04f`），无 lock／backup／stage |
| 最后一项 `self-shield.svg` 缺失 | 真实依赖 | 1 | 同样卡在 `import cairosvg`，未走到缺源分支 | 36 文件哈希不变 |
| 首次导出、无旧批 | 真实依赖 | 1 | 失败后最终输出目录不存在 | 不适用 |
| 最后一项 `self-shield.svg` 缺失（仅控制流） | stub 渲染器 | 2 | `export failed: ... source/self-shield.svg` | 36 文件哈希前后一致（聚合 `96e61c13b975c65758dc09b2af63596cfe7f067fb9904775aa84cb1fe8bebb2a`），无 lock／backup／stage |
| 首次导出、无旧批（仅控制流） | stub 渲染器 | 2 | 同上；最终输出目录不存在，无 lock／backup／stage | 不适用 |

控制流 stub 位于 `scratch/stub/cairosvg.py`，只返回 Pillow 生成的占位 PNG；它只验证导出器的暂存／替换／回滚顺序，不代表真实渲染，也没有进入任何最终输出。

## 静态可核项（不依赖 CairoSVG）

用 `export.validate()` 与 `export.themed()` 对固定 commit 的源逐件执行：

- 原配方复现：12/12 个已入库 SVG 与 `themed()` 输出逐字节一致。
- 改后：bright 6/6 不变；dark 6/6 变化，dark 中不再含旧重点色 `#70E6E1`，全部含 `#086E85`，`stroke-width="4.5"` 保留，viewBox 仍为 `0 0 64 64`。
- `self-shield` 的 MIT 通知在 bright/dark 输出中都保留。

证据：`scratch/moba-icons-attempt1/partial/themed-report.json` 与 `scratch/moba-icons-attempt1/partial/svg/{bright,dark}/`（12 个 SVG，仅中间产物）。

## 测试

`python test_export.py -v`：Ran 15 tests，`FAILED (errors=12)`，exit 1。通过的三项是 `test_invalid_parameters`、`test_cli_missing_and_bad_input`、`test_upstream_shield_identity_and_runtime_notice`；其余全部在 `export.export()` 的 `import cairosvg` 处报错。日志：`scratch/moba-icons-attempt1/test-baseline.log`。

## 页面／操作缺口

1. `icon-family-rebuild` 节只写“在同级临时目录完成六种图标的亮／暗 SVG、32／48px PNG 和预览”，没有写运行前提（Python 3.11+、系统 Cairo、CairoSVG 2.8.2、Pillow 12.0.0）和安装命令；这些只出现在被链到的 MOBA README。本机缺 `CairoSVG` 与系统 Cairo，按约束不安装，完整重出无法执行。
2. 页面说“既有 36 个运行文件与预览”，固定 commit 只有 36 个运行文件，`preview.png` 被 Git 忽略，不能从既有产物核对预览。
3. 页面说“重建的 36 个运行图仍逐字节一致”，PNG 与预览的逐字节一致无法在缺渲染器时验证；本次只核到 12 个 SVG。
4. 页面说“缺源、解析、渲染或预览失败保留旧批”，但真实导出器在读取任何源之前先 `import cairosvg`，缺源场景被依赖缺失掩盖，无法直接观察页面对应的失败分支。
5. 节内没有列出六类图标的名称、重点色值或“最后一个源”是哪一件；需读 `export.py` 的 `NAMES` 与 `recipe.json` 才能确定 `self-shield` 和 `#086E85`。
6. 固定 commit 不在本地默认分支上；直接使用工作区 `asset-pipeline/icons` 会得到四图标、无批量替换逻辑的旧导出器，必须按页面链接取 `b489ed38`。

## 未验项

- 六类图标的 32／48px PNG、`preview.png`（960×400）实际生成与两主题并排预览。
- “36 个运行图逐字节一致”的 PNG 部分。
- 真实 CairoSVG 下的渲染失败、预览失败、目录重命名失败、回滚失败、`new batch committed` 与断电／强杀恢复。
- 实际 HUD 接入、玩家识别率与无障碍。

## 下一步

提供可用的 CairoSVG 2.8.2＋系统 Cairo（或在镜像内预装）后，按同两只场景重跑 `export.py`；先核 36 个运行图哈希与预览，再核缺源失败时旧批是否原字节保持。
