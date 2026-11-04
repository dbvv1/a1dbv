# B-PIPE-ICON-BATCH-READER-20261104 首次读者记录

## 做到哪一步

只按 `2d.md` 的 `icon-family-rebuild` 节做“双主题图标二改”。完成了：

1. 按页面的固定 commit 取 `MOBA-Like@b489ed38592dc184fffe2ab9b3b186441c7dc9bb` 的 `asset-pipeline/icons` 到独立临时副本，核到六类图标、36 个运行文件（12 SVG＋24 PNG）；`preview.png` 不在该 commit 的树里。
2. 记录既有 36 文件的 SHA-256 清单与聚合哈希，确认临时副本与 commit 逐字节一致。
3. 按任务把 `recipe.json` 的 `dark.accent` 从 `#70E6E1` 改成 bright 现有的 `#086E85`，`validate()` 通过；用导出器自己的 `themed()` 做静态复核：原配方复现 12/12 已入库 SVG，改后 bright 6/6 不变、dark 6/6 变化，`self-shield` 的 MIT 通知保留。
4. 执行 `test_export.py`：15 项中 3 项通过、12 项因缺 `cairosvg` 报错，exit 1。
5. 三个目标场景各跑了一次真实 CLI；缺源与首次无旧批另用显式标注的 stub 渲染器补了控制流复核。

**未完成**：六类图标的 32／48px PNG 与 `preview.png` 没有重出；“36 个运行图逐字节一致”只核到 SVG 部分；缺源失败在真实环境中被依赖缺失提前挡住。

## 产物在哪

- 正式记录：`docs/collaboration/local-jobs/artifacts/B-PIPE-ICON-BATCH-READER-20261104/result.md`
- 本记录：`reader-tests/B-PIPE-ICON-BATCH-READER-20261104-u1.md`
- 本卡临时证据（不提交）：
  - `scratch/moba-icons-attempt1/`：固定 commit 的临时副本、`baseline.sha256`、`test-baseline.log`、`partial/themed-report.json`、`partial/svg/{bright,dark}/`
  - `scratch/moba-icons-attempt1/scenarioA/`：改后配方、旧批前后哈希、CLI 输出
  - `scratch/moba-icons-missing-source/`：删掉 `source/self-shield.svg` 的副本与两类失败记录
  - `scratch/stub/cairosvg.py`：只用于控制流复核的占位渲染器，不是可用图标产物

## 卡点

### 1. 页面哪一句

> “在同级临时目录完成六种图标的亮／暗 SVG、32／48px PNG 和预览，再替换输出”

**缺什么**：`CairoSVG 2.8.2`、系统 Cairo（`cairocffi`／`cffi` 也没有），本机没有任何可用的 SVG 光栅化器（无 `rsvg-convert`、Inkscape、ImageMagick），pip 缓存里也没有 `cairosvg`。按约束不安装软件，所以 PNG 与预览无法生成。

**做错过什么**：第一次跑“缺源”场景时，`--recipe` 指到了临时目录里一个不存在的配方文件，得到 exit 2 和 `export failed: ... recipe ... No such file`，这是**配方缺失**，不是缺源。后来把配方正确复制进临时目录并重新改色，得到 exit 2 和 `export failed: ... source/self-shield.svg`，才是目标场景。

### 2. 页面哪一句

> “既有 36 个运行文件与预览的完整产物清单”

**缺什么**：固定 commit 的 `exported/` 只有 36 个运行文件；`preview.png` 被 `.gitignore` 忽略，必须成功导出后才存在。既没有入库预览可看，也没有 CairoSVG 能生成，所以“既有预览”无法核对；只能从测试断言知道期望尺寸是 960×400。

### 3. 页面哪一句

> “源图与配方未改，重建的 36 个运行图仍逐字节一致”

**缺什么**：没有 CairoSVG 就无法比较 PNG 字节。本次只核到 12 个 SVG 的逐字节一致，PNG 部分保持未验。

### 4. 页面哪一句

> “缺源、解析、渲染或预览失败保留旧批”

**缺什么**：真实导出器的 `render()` 第一行就是 `import cairosvg`，在任何源文件被读取之前就失败。因此真实环境里“缺源失败”总是先变成 `ModuleNotFoundError`（exit 1），页面对应的缺失源分支走不到。只有用 stub 渲染器补控制流时，才观察到删除 `self-shield.svg` 后 exit 2、旧批 36 文件哈希不变、无 lock／backup／stage。

### 5. 页面哪一句

> “把 recipe 中深色主题重点色改为现有浅色主题的重点色”

**缺什么**：节内没有列出六类图标名、配方键名、颜色值，也没有说“最后一个源”是哪一件。必须去读 `export.py` 的 `NAMES` 和 `recipe.json` 才知道 `self-shield` 是最后一项、bright 的重点色是 `#086E85`。这对有源码权限的读者可解，但页面本身不自足。

### 6. 页面哪一句

> “实测与实现：[MOBA 图标导出器与恢复入口](https://github.com/dbvv1/MOBA-Like/blob/b489ed38.../asset-pipeline/icons/README.md#整批重导出)”

**缺什么**：安装与运行命令（建 venv、`pip install -r requirements.txt`、`python export.py`）只在被链的 MOBA README，`icon-family-rebuild` 节没有给。只读该节的读者不知道要先装 CairoSVG 和系统 Cairo，也不会预判到这里会阻塞。

**另一个环境坑**：页面固定的是 `b489ed38`，本地默认分支还停在四图标、无批量替换逻辑的旧导出器。若直接拿工作区的 `asset-pipeline/icons` 做，会得到与页面描述不同的代码；必须按页面链接取那个 commit。

## 页面之外还翻了什么

- 固定 commit 的 `asset-pipeline/icons/README.md`：确认“整批重导出”的目录顺序、锁／备份命名、`new batch committed` 的含义，以及依赖与运行命令。
- `export.py`、`test_export.py`、`recipe.json`：确认六类名称、配方字段、暂存／回滚顺序、测试断言与期望尺寸。
- `source/self-shield.svg` 与 `source/tabler/{LICENSE.txt,provenance.json,shield.svg}`：确认盾源和 MIT 通知随 SVG 保留。
- Git 历史与分支关系：确认 `b489ed38` 是本地 HEAD 的后代、本地默认分支不含该批量导出器。
- 本机环境：Python／Pillow 版本、`cairosvg`／`cairocffi`／`cffi` 是否存在、Cairo DLL、SVG 光栅化器、pip 缓存。
- 未读 a1dbv 的其他文档，未打开页面里的 `3d.md#asset-family-rebuild`；未使用 gen3d／glbprep（本任务无 3D 资产）。

## 核对

**结论：读者记录基本属实，但按本卡验收未做成。** 固定 commit 的 36 个运行文件清单、12 个 SVG 的配方复现、测试 3/15 通过、缺依赖 exit 1、stub 缺源 exit 2 与旧批保持，我都独立复跑并核对一致；缺 PNG／预览与两个真实失败场景，原因是本机没有 CairoSVG／系统 Cairo 且任务禁止安装，页面该节又没有写运行前提，不能算读者编造。另发现一处读者没报的平台级字节差异，见下。

### 我实际跑的

- 从 `b489ed38` 取 `asset-pipeline/icons`：`exported/` 恰好 36 个文件（12 SVG＋24 PNG），无 `preview.png`；`.gitignore` 忽略它。36 个 SHA-256 与读者 baseline 逐条一致，清单聚合 `8efcb6680f0ad1a65fb99d325020fc76653124e39773a9b26df45f39fb792a47`。
- 原配方 `themed()` 生成的 12 个 SVG 与入库 SVG 的**解码文本**一致；把 `variants.dark.accent` 改为 `#086E85` 后 `validate()` 通过，bright 6 个内容不变、dark 6 个内容变化，`#70E6E1` 消失、`#086E85` 出现，`stroke-width="4.5"`、viewBox 与 self-shield 的 MIT 通知保留。
- `python test_export.py -v`：Ran 15 tests，3 ok，12 errors，exit 1；12 个 error 都停在 `render()` 的 `import cairosvg`。
- 真实 CLI 新建输出：exit 1，目标目录不存在，无 lock／stage；stub 缺 `source/self-shield.svg`：exit 2，旧批 36 文件哈希前后不变，无 lock／backup／stage；stub 首次失败：exit 2，无最终目录。
- 环境：Python 3.13.5、Pillow 12.3.0；`cairosvg`、`cairocffi`、`cffi` 缺失，`find_library('cairo')` 为空；无 rsvg-convert／Inkscape／ImageMagick；pip 缓存无 cairosvg。
- 上游 `refs/heads/main` 就是 `b489ed38`；本地克隆 main 是 `4822f31` 的四图标旧导出器。读者把“本地默认分支落后”写成“固定 commit 不在默认分支”，容易让页负责人误判。

### 卡点定性

1. 缺 CairoSVG／系统 Cairo、节内未写前提：page。真正阻塞是本机缺依赖且任务禁止安装；被链的 MOBA README 已写 Python 3.11+／系统 Cairo／requirements。
2. 无既有 `preview.png`、只能从测试断言知道 960×400：page。预览是导出后才生成、被 Git 忽略，固定 commit 无法核。
3. PNG／预览逐字节一致未验：page。同一依赖缺口。
4. 真实缺源分支被 `import cairosvg` 提前挡住：page。页面无法在无渲染器时观察该分支；导出器逻辑与 stub 结果一致。
5. 节内没有六类名、配方键、颜色、“最后一个源”：page。读 `export.py`／`recipe.json` 可解，页面不自足。
6. 安装／运行命令只在被链 README：page，节内不自足；但“固定 commit 不在本地默认分支”不是页面问题，上游 main 就是 `b489ed38`。
7. 首次把 `--recipe` 指向不存在的配方、误判为缺源：model。读者自己的操作失误，已自行纠正。

### 读者没意识到的

- **Windows 换行让“逐字节一致”不成立。** `export.py` 用 `Path.write_text` 写 SVG，Windows 文本模式把 LF 写成 CRLF。读者留下的 `partial/svg/{bright,dark}/*.svg` 全部是 CRLF（如 bright/targeted 397 字节，入库 391 字节），所以“12/12 逐字节一致”只在 `read_text()` 解码字符串层成立。我用同一个 stub 做完整成功导出（不换源、原配方）后，12 个 SVG 与入库文件 0/12 字节相同，差异全部是 CRLF；`test_export.py` 的 `read_bytes()` 断言在 Windows 装好 CairoSVG 后仍会在这 12 个 SVG 上失败。页面“重建的 36 个运行图仍逐字节一致”在 Windows 上不成立。
- 上游 main 就是 `b489ed38`，本地默认分支落后只是本机克隆状态；把两者混成“固定 commit 不在默认分支”会误导页面维护者。
- `result.md` 的 36 文件表只给 16 位哈希，完整 64 位在 `scratch/`（工作目录外、不提交）；只靠交付物无法复核“完整产物清单”和旧批哈希。
- 卡点 2 引的“既有 36 个运行文件与预览的完整产物清单”是任务验收的措辞，不是页面原文；页面没有承诺固定 commit 里有既有预览，这个归因不准确。
