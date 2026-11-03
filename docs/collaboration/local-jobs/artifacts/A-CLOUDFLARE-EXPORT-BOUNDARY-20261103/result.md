# A-CLOUDFLARE-EXPORT-BOUNDARY-20261103 · 结果

观察时间：2026-11-03。对象：`scripts/export_ai_config.py`、`scripts/export-ai-config.sh`、`tests/test_config_export.py`，基线 `cfb9240ac56e56c84e72706d1a5cda5e0b29637b`。方法：按固定 SHA 的 Cloudflare security-audit Skill **guidance 模式**只读源码；第 1 单元给出结论，第 2 单元由非作者补做独立源码反读；两单元均未导入目标模块、未运行 CLI／unittest／fixture／目标脚本。本文件是有限问答与方法交接，不是六阶段完整审计报告。

## 结论与选目录建议

**四项承诺在 POSIX 路径语义、且运行期间相关目录只有你一个写者时成立；Windows junction 是单独的范围缺口（见第 2 项）。脚本只检查路径类型、链接和存在性，不检查目录所有者或 ACL（源码无 `getuid`／`st_uid`／`getgid`），也不保证检查与打开之间路径没被替换。未发现已确认的跨信任边界缺陷（0 confirmed）。**

| 用途 | 建议位置 | 谁必须拥有／可写 | 关联承诺 | 什么会破坏前提 |
|---|---|---|---|---|
| 源目录及每一级祖先 | 自己的工作配置目录，物理路径 | 只有你和受信任的同用户进程可写条目 | 1、2、3 | 组／所有人可写的共享目录；含 symlink／junction 的路径；他人可替换文件条目；经挂载点／绑定挂载／目录硬链接与输出物理同树 |
| 暂存父目录 | `$HOME` 下自建 0700 目录里再 `mktemp -d` | 只有你；本地盘 | 2、3、4 | 非 sticky 的共享可写目录；同步盘；CI 共享工作区（仓库内暂存会被脚本拒绝） |
| 暂存目录树 | 脚本创建的新目录（0700） | 从审阅到 `promote` 期间只有你写 | 2、3 | 同步客户端、另一个 agent／脚本、手动 `chmod` 或移动 |
| 输出父目录 | 仓库 `ai-config/` 或本地私有目录 | 只有你可写条目；不是链接 | 2、4 | 同步盘；overlay／网络盘；他人可写目录；经挂载点／绑定挂载／目录硬链接与源物理同树 |
| 输出目录 | 每次新名字，绝不复用 | 脚本独占创建 | 4 | 已存在路径、旧快照路径 |

最常见的误区是只看目标文件权限。路径替换来自**目录写权限**：谁能写某一级父目录，谁就能在该级替换条目或换掉链接；只对文件本身有写权限的人只能改该文件的字节。两者对四项承诺的破坏方式不同，表中按此区分。

结论分级，便于判断证据力度：

- **源码足以裁定的已有控制**：输出名字集合完全来自参数、不枚举源目录；每个文件单次读入后哈希、扫描并写出同一份内存字节；目标已存在时独占 `mkdir` 失败；暂存内容或文件集合变化被哈希与集合检查拒绝。
- **被既有控制阻断的失效**：并发创建同名输出→失败而非覆盖；审阅后改文件或加文件→提升失败；POSIX 静态符号链接→拒绝。
- **缺运行证据的候选**：检查与打开之间的替换、Windows junction、输出父目录被替换、网络／同步盘语义。均记 needs_validation，无 severity。

落到操作的五条：

1. 对源目录、暂存父目录、输出父目录逐级查看权限（POSIX 用 `ls -ld`，Windows 看 ACL）；任何一级组／其他人可写就换位置。
2. 用 `os.path.samefile`（或 `Path.resolve()` 后比较）复核源目录与输出父目录不是同一物理位置，并逐级检查挂载点、绑定挂载、目录硬链接（Windows reparse 点见第 4 条）。`overlaps()`（`export_ai_config.py:50-51`）只做词法比较，不能替代这步。
3. 暂存父目录用 `$HOME` 下自建的 0700 目录再 `mktemp -d`；输出每次用没出现过的新名字。
4. Windows 上逐级确认没有 junction／reparse 点：Python 3.12+ 可用 `Path.is_junction()` 查 junction，但它只识别 junction、不覆盖其他非符号链接 reparse 点；要覆盖全部用 `fsutil reparsepoint query`（或 PowerShell `Get-Item` 看 Attributes）；Python 3.11 直接用 fsutil。
5. 从审阅到 `promote` 之间不跑同步客户端，不让其他 agent／脚本写暂存；审阅完整内容后才记录哈希。

## 四项承诺各自的前提

数据流：`stage` 由 `--source TOOL=DIR`、`--include TOOL/REL`、`--output DIR` 三个参数驱动（`export_ai_config.py:235-238`），无环境变量或默认目录；按清单逐个读入内存，检测后写入输出父目录下的临时目录，校验通过才独占创建输出并改名（165-191）。`promote` 由 `--stage DIR`、`--output DIR`、`--reviewed SHA256` 驱动（239-242），重读清单、逐文件重算哈希和重新扫描后写入新目录（194-229）。**文件来源是命令行参数；目录所有者与可修改者由 OS 权限决定，脚本从不读取或校验。**

四项指 `ai-config/README.md` 第 13、14、18、17 行的承诺。以下"目录控制"都指运行期间的写权限，不是文件属主名。

### 1. 显式文件清单（未列出的嵌套文件永远不复制）

- 源码控制：`allowed()`（`export_ai_config.py:65-76`）只接受白名单相对名；`stage` 只遍历 `args.include`（176-186），从不枚举源目录；`promote` 只读清单键（206-216）并比对暂存目录文件集合（217-226）。因此**输出名字集合完全来自参数**，目录里多出的文件不会被顺带复制。
- 目录控制前提：源根及其每一级祖先、清单文件本身，只有你（或你信任的同用户进程）可写。脚本不验证属主与 ACL；它只验证路径不是链接、是普通文件。
- 并发前提：每个文件只读一次进内存（79-91），随后扫描的是同一份字节（139），所以**读完之后的修改不影响本次快照**。读取之前或读取当中的替换会改变导出的字节，但不会增加清单外的名字。
- 失效后果：低信任写者只能在已列名的路径上替换内容；剩余防线是敏感信息检测和人工逐文件审阅，不是"清单"本身。这也是 README 第 5、21 行要求的操作边界。

### 2. 不跟随符号链接

- 源码控制：`path_checked()`（41-47）对传入路径及其所有祖先逐级 `is_symlink()`；它被用于源根（172）、每个清单文件（80）、输出（55）、暂存根（195）、暂存文件（210）和 `os.walk` 的每一项（220）。
- 目录控制前提：检查与真正使用之间不是原子操作。`path_checked()` 的 `is_symlink()` 才是 lstat；`read_text()` 里的 `is_file()`／`stat()` 是跟随链接的 stat，`read_bytes()` 也按路径重新解析（80-87）；`mkdtemp(dir=output.parent)`（144）、`output.mkdir()`（154）、`child.rename(...)`（156-157）都在检查之后按路径操作。源码没有 `openat`／`O_NOFOLLOW`／目录描述符／`fstat` 复核。因此**任何一级祖先目录都不得被其他写者替换**，否则检查和实际打开可能指向不同位置。
- 使用前提：必须传物理路径。合法的 symlink 家目录或临时目录会被拒绝（README 第 55 行的 `pwd -P` 说明）；这不是缺陷，是可见的使用约束。
- Windows 范围缺口：在 Python 3.13.5 上实测标准库对 junction 的行为是 `Path.is_symlink()` 为 `False`、`Path.is_junction()` 为 `True`、`is_dir()` 为 `True`；`path_checked()` 只看 `is_symlink`，所以**junction 及其祖先会被静默跟随**；`os.walk(source, followlinks=False)`（218）按 `os.path.islink()` 决定是否下降，junction 不算 `islink`，集合比对也会进入 junction 目录。`pwd -P` 针对 POSIX 符号链接，不能替代 junction 检查。该缺口未在真实导出路径上运行验证，且缺少低信任方可写祖先目录这一条件，只作范围限制，不作漏洞结论。
- 失效后果：读写可能落在与检查时不同的路径；输出仍由独占 `mkdir` 创建，不会覆盖已有目录，但可能建在你未预期的父目录里。

### 3. 人工审阅后精确提升

- 三段绑定，强度不同：
  1. **源→暂存**：没有哈希；只靠源目录权限和你执行的 `stage` 命令。审阅标识不证明字节来自你预期的源文件。
  2. **暂存→审阅标识**：`stage` 写出 `canonical(manifest)` 并打印其 SHA-256（188-191）；`promote` 重算并比对（199-201），逐文件比对哈希（210-213），`settings.json` 重建后必须等于自身（214-215），文件集合必须恰好等于清单加清单文件（217-226），最后重新扫描（227）。
  3. **审阅字节→输出**：输出写的是内存里已比对过的字节（206-216、228 进入 142-162），**不会二次读盘**；每次读取之后的修改无法改变本次输出。
- 目录控制前提：暂存目录树在"审阅完成到 `promote` 执行"之间只有你写。内容或文件集合变化会被哈希／集合检查发现；若有人同时改内容和清单，只有你重新暂存并采用新打印的哈希才会命中，这需要你可见的重新操作。
- 关键限制：脚本无法证明"人真的看过"。任何人都能在能运行 CLI 的地方重算暂存清单的哈希并传给 `--reviewed`；真正的权限是"谁能运行 `promote`"。这是同一 principal 的授权问题，按 Skill 第 140 行和反模式第 5 条不算跨边界缺陷；它说明"人工审阅"是流程控制，不是技术控制。
- 边界细节：集合检查用 `os.walk`（218），默认不报告遍历错误；多出的空目录不算进文件集合，也不会被提升（`write_snapshot` 只迭代清单文件）。暂存由脚本建为 0700，这些情形需要同用户或 root 先改权限才会出现。

### 4. 不覆盖旧快照

- 源码控制：`destination()`（54-62）要求目标尚不存在且父目录存在；`write_snapshot()` 先在父目录建临时目录（144），校验完成后以 `output.mkdir(mode=0o700)` 独占创建（154），再把临时目录的子项改名进去（156-157）。`mkdir` 的独占语义使并发创建者只能失败，不能合并或覆盖；失败时 `rmtree(output)`（158-160）只作用于本次 `mkdir` 创建的路径，不枚举或删除其他路径，最后清理临时目录（161-162）。源码没有任何删除旧快照或其他路径的逻辑。
- 目录控制前提：输出父目录必须由你控制，且没有其他进程在 `mkdir` 与 `rename` 之间重命名或删除新目录。若父目录非 sticky 且他人可写，对方可抢占目标名（导致失败，安全），或在 `mkdir` 之后换掉输出目录这一级：换成普通目录时，若失败清理被触发，`rmtree(output)`（159）会删除这个替换目录；换成符号链接（Windows 上含 junction／mount-point reparse）时，`child.rename()`（156-157）仍会跟随链接把子项写进链接目标，后果按是否进入失败清理区分——改名循环全部成功时不会调用 `rmtree(output)`，`stage`／`promote` 照常报告成功，快照被静默写进链接目标（输出路径仍是该链接，这是更危险的情形）；只有改名循环因故抛错进入 `except`（158-160）时，`rmtree(output)` 才拒绝链接并抛 `OSError`，且不回滚。只有让改名和清理都解析到另一棵物理树才需要祖先目录被替换。临时目录同理。
- 文件系统前提：依赖原子的独占 `mkdir` 与 `rename` 语义。本地 POSIX／NTFS 满足；网络盘、overlay、云同步目录可能不满足或有延迟可见性。
- 旧快照：脚本从不枚举或删除旧快照，删除与发布在脚本之外；同步客户端在脚本之外改名／删除时，同样不受这条保护。选新路径并保留旧目录即可。

## 采用的 guidance 条款与实际作用

| 条款 | 用途 |
|---|---|
| `SKILL.md:10-17` guidance 模式 | 只做有限问答，不建六阶段、不写 ledger／findings；本文件只是交接。 |
| `SKILL.md:33-40` Universal execution safety | 本机没有 OS 强制断网、只读目标、scratch 写域和资源上限，按第 40 行不执行目标代码，只把缺失能力记为限制；不用环境变量或 timeout 冒充沙箱。 |
| `SKILL.md:42` | 不探测外部服务；只用合成事实。 |
| `SKILL.md:140` Require a boundary and result | 把"存在 TOCTOU"与"junction 不被识别"挡在 confirmed 之外：没有低信任 principal、具体资源和可观察结果，不升级为漏洞。 |
| `SKILL.md:144` bounded local evidence | 本地执行不可用，本次只到源码路径与平台事实。 |
| `SKILL.md:148` respect source visibility | ACL、同步客户端、junction 是否存在等仓库外事实，记 needs_validation 而不是假设。 |
| `SKILL.md:152` | needs_validation 不配 severity；likelihood／impact 不高于已展示结果。 |
| `SKILL.md:183-192` 反模式 | 第 2、5 条挡住"缺少额外防御"和"同 principal 自损"；第 9 条挡住给待验项标严重度。 |
| `SKILL.md:68-80` 写隔离提升流程 | 提供"按路径检查"与"目录描述符 + no-follow + fstat + link count + 大小复核"的对照词汇，用来精确描述并发前提。它是该 Skill 对自己 scratch 产物的要求，不是本导出器的契约，未据此判缺陷。 |
| `ATTACK-CLASSES.md:50,54` | 把重点归到 path traversal via symlinks 与 TOCTOU 两类，避免扩散成全仓审计。 |
| `VALIDATION-AND-REPORTING.md:5,87` | 明确 needs_validation 不是低置信漏洞；独立验证需另一个未参与的作者。第 1 单元未执行；第 2 单元完成源码级独立反读（非 Phase 3 verifier、无 sandbox）。 |

未采用：六阶段流程、coverage ledger、预算闸门、severity 锚点、hunter／verifier wave、`findings.json` 与报告产物；本次没有 confirmed 记录，也不需要这些结构。

## 固定行号证据

- 目标源码：`scripts/export_ai_config.py:41-47`（符号链接检查）、`54-62`（目标目录）、`65-76`（白名单）、`79-91`（读文件）、`108-121`（settings 白名单）、`124-130`（检测）、`133-139`（总校验）、`142-162`（写出与清理）、`165-191`（stage）、`194-229`（promote）、`232-257`（CLI 与错误出口）；`scripts/export-ai-config.sh:3-8`（缺 Python 时失败）。
- 导出指南：`ai-config/README.md:11-21`（契约与单写者边界）、`55`（物理路径）、`57-72`（审阅与旧快照）。
- 既有测试：`tests/test_config_export.py:51-65`（合法流程）、`67-94`（敏感内容与不回显）、`96-148`（大小与 settings）、`157-179`（缺失源、旧目标、重复提升）、`181-208`（静态符号链接、Git 内暂存）、`210-241`（穿越、二进制、暂存篡改）、`243-259`（缺依赖与缺参数）。这些是**阅读到的基线，本次未运行**，不计为本次通过。
- 平台事实：在临时目录用标准库创建 junction 后，Python 3.13.5 返回 `is_symlink=False`、`is_junction=True`、`is_dir=True`。这只是标准库行为核对，不是目标代码执行。
- 三个目标文件在 `cfb9240a` 与只读参考副本中的 blob 哈希一致（`daaa0c6b…`、`37bda6a2…`、`2a4cf45e…`），确认基线无漂移。
- 官方正文按固定 SHA 取回：`SKILL.md`（192 行）、`RECONNAISSANCE.md`（156 行）、`ATTACK-CLASSES.md`（130 行）、`VALIDATION-AND-REPORTING.md`（186 行），2026-11-03 读取。入口：`https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/SKILL.md`。

## 独立反证（第 2 单元补做，2026-11-03）

**结论：9 个问题都能由源码作答，未推翻"0 confirmed、无 severity"，未发现应提升为 confirmed 的新候选；新增一条无 severity 的 needs_validation 线索（`overlaps()` 词法比较），并据此在选目录操作中加入源与输出同物理位置复核。下文列出 4 处与第 1 单元不同的表述；来源链接另按审查意见改为版本锁定地址。**

执行者未参与第 1 单元的结论撰写；只读三个目标文件、`ai-config/README.md` 和固定 SHA 的 Skill 正文，未导入目标模块、未运行 CLI／unittest／fixture／目标脚本。为定位问题清单先读了本文件，因此不是对结论的完全盲读：每题先按源码独立作答，再与第 1 单元结论对照。这是 guidance 模式的源码反读，不是 Skill 六阶段的 Phase 3 verifier，也没有 sandbox、ledger、schema 或 retained artifacts。

### 9 个问题的独立作答

1. **没有做到"每个被打开、创建或改名的路径都在使用前于同一路径字符串上重新检查"。** `path_checked` 的调用点是输出（`export_ai_config.py:55`）、`read_text` 入口（80）、源根（172）、暂存根（195）、暂存清单中的每个文件（210）和 `os.walk` 的每个条目（220）。例外：
   - `read_text` 在 80 检查后，81 的 `is_file()`／`stat()` 与 85 的 `read_bytes()` 都按路径重新解析，没有目录描述符、`openat`、`O_NOFOLLOW` 或 `fstat` 复核。
   - `tempfile.mkdtemp(dir=output.parent)`（144）只在 `destination()` 中检查过 `output.parent` 是目录（56），创建时不再检查；`output.mkdir()`（154）和 `child.rename()`（156-157）同样按路径操作。
   - 临时目录内的 `target.parent.mkdir()`／`write_bytes()`／`chmod()`（148-152）没有再调 `path_checked`；这些名字来自 `allowed()` 过滤后的清单（65-76，拒绝绝对路径、`..`、隐藏组件和反斜杠），词法上仍在临时目录内。
   - `outside_git` 的 `.git` 探测（59）没有经过 `path_checked`，其中 `(p / ".git/HEAD").exists()` 会跟随链接；它只用于拒绝暂存位置，不是写目标。
2. **可被替换的是路径上的目录项，不只是文件。** 每次检查与对应打开／`mkdir`／`rename` 之间（80→81-85、55→144/154、154→157、195→199/210/218-223），任一祖先目录的写者都能换掉该级条目，后续系统调用会落到替换后的位置。只对文件本身有写权限的写者改不了路径指向。利用它需要"目标条目的父目录可写 + 赢得竞态"；本次没有运行证据，也没有确认的低信任写者。
3. **没有枚举源目录，也没有复制清单外的名字。** `stage` 只遍历 `args.include`（176-186），不 `listdir`、不 `os.walk` 源目录；`promote` 的 `os.walk`（218）只用于比对暂存目录的现有条目，写出的 `files` 来自清单键（207-216）；`write_snapshot` 只迭代 `files`（146）。清单本身是额外生成的 `export-manifest.json`。能同时改清单并给出匹配 `--reviewed` 的写者已经能决定提升内容，且名字仍受 `allowed()` 限制，属于同 principal 授权。
4. **两阶段都对内存字节做哈希，写出的是同一份字节。** `stage` 在 85 读一次，88 解码，186 重新编码；188 的清单哈希和 149 的写出都用这份值，中间不再读源。`promote` 在 210 读一次暂存文件，211 编码，212 比对哈希，216 保存，149 写出同一对象。UTF-8 解码会拒绝非法序列，合法输入的 encode 与原始字节一致；`settings.json` 在 184-185 先被 `filter_settings` 替换，哈希和写出的都是过滤后的构造结果。
5. **能，`--reviewed` 只是清单文件的 SHA-256。** `stage` 打印 `digest(canonical(manifest))`（188-191），`promote` 把读到的清单字节哈希后与参数比较（199-200）；任何能读暂存目录的人都能用 `sha256sum export-manifest.json` 算出同一个值，不必看任何被导出文件。操作者能观察到的差别只是"有没有人实际记录并传入这个值"，没有技术证据。这与第 1 单元结论一致：同 principal 的流程控制，不构成跨边界缺陷（`SKILL.md:140,187`）。
6. **没有删除或替换旧快照的代码。** `rmtree(output)`（159）只针对本次 `mkdir` 刚创建（154）的目录，`rmtree(temporary)`（162）只针对本次 `mkdtemp` 创建的目录；`destination()`（56）在目标已存在时直接失败，脚本不枚举、不改名、不删除旧快照。需要修正第 1 单元第 66 行的范围，而不是把后果缩到祖先目录：`shutil.rmtree` 会拒绝最终组件为符号链接（Windows 上含 junction／mount-point reparse）的路径；但若最终组件被换成另一个真实目录，失败清理被触发时 `rmtree(output)` 仍会递归删除该替换目录（标准库实测：rename 掉新建目录、同名位置建真实目录后 rmtree 删除了它）。若最终组件被换成链接，`child.rename()`（156-157）仍会跟随链接把子项写进链接目标，后果按是否进入失败清理区分：改名全部成功时不会调用 `rmtree(output)`，命令照常报告成功，快照被静默写进链接目标、输出路径仍是链接（标准库实测：symlink 与 junction 两种替换均无异常，目标目录收到文件）；只有改名循环抛错进入 `except`（158-160）时，`rmtree(output)` 才拒绝链接并抛 `OSError`，且不回滚。因此原第 66 行"后续改名落到别处，失败清理也可能删到替换目录"成立，只需按此区分补充链接／重解析点这一例外。
7. **`path_checked` 只认 `Path.is_symlink()`，junction 和其他非符号链接的 reparse 点会通过。** `export_ai_config.py:41-47` 只调用 `is_symlink()`；CPython 文档把 `is_junction()`（3.12 起）和 `is_symlink()` 定义为不同检查，`os.path.islink()` 也只对符号链接返回真。因此 Windows junction 在 44-46 的循环里不被拒绝，41-47 之后的路径操作会跟随它。另外 `os.walk(source, followlinks=False)`（218）按 `os.path.islink()` 决定是否下降，junction 不是 islink，所以集合检查也会进入 junction 目录。此结论由源码加 CPython 文档推出；修正时在 Python 3.13.5 重跑 junction 探针，结果与第 1 单元记录一致（`is_symlink=False`、`is_junction=True`、`is_dir=True`），并实测 `shutil.rmtree` 对 junction 抛 `OSError`、`rename` 会跟随它写入链接目标。
8. **不能观察到暂存树的每个条目。** `os.walk`（218）默认 `onerror=None`，遇到不可读目录时静默跳过；循环只把普通文件加进 `actual`（221-222），目录本身不加入，所以多出的空目录和不可读目录里的文件都不可见。能看到的条目中，非普通文件且非目录会在 224 失败，符号链接在 220 的 `path_checked` 失败。影响限于"集合完全相等"这一断言：写出的仍只有清单文件（146），额外文件不会被提升；空目录和不可读目录也不会被复制。
9. **`destination()`／`overlaps()` 只做词法比较，隐含"路径字符串相同即同一物理位置"。** `overlaps()`（50-51）只比较 `==` 和 `parents`，不 `resolve()`、不比较 `st_dev`／`st_ino`；`destination()`（56）用 `exists()`／`is_dir()` 交给 OS，`outside_git`（58-61）也只沿词法祖先找 `.git`。因此：
   - Windows 的 `WindowsPath` 比较不区分大小写，POSIX 的 `PosixPath` 区分；大小写变体在 Windows 会被 `overlaps` 捕获，在大小写不敏感的 POSIX 挂载上不会。
   - junction、挂载点、绑定挂载或目录硬链接可以让源与输出物理同树而词法不同，`overlaps` 不报；把暂存目录经 junction 放进 Git 工作树也可能绕过 58-61 的 `.git` 探测。
   - `allowed()` 按 POSIX 名字校验：拒绝 `\`、控制字符、`.`／`..` 和隐藏组件（66-70），但不拒绝 `:` 和 Windows 设备名；在这些名字由操作者给出的前提下，不构成跨边界问题。

### 与第 1 单元结论的差异（变更记录）

第 1 单元正文已按下列结果直接改写，主文为准；这里只记改动：

| 位置 | 改了什么 |
|---|---|
| 第 1 单元第 48 行 | 明确 `is_symlink()` 才是 lstat，`is_file()`／`stat()` 是跟随链接的 stat；检查与读取非原子、按路径重新解析的结论不变 |
| 第 1 单元第 50 行、未验证表 | 补记 218 行 `os.walk(followlinks=False)` 对 junction 也会下降 |
| 第 1 单元第 66 行 | 按替换类型与是否进入失败清理区分：最终组件被换成普通目录时，失败清理中的 `rmtree` 会删除该替换目录；被换成符号链接／junction 时改名仍会跟随链接写入链接目标，改名全部成功则不调用 `rmtree`、命令报告成功但快照静默写进链接目标，只有改名抛错进入 `except` 时 `rmtree` 才拒绝链接并抛 `OSError` 且不回滚；改名和清理都落到另一棵物理树才需要祖先目录被替换。原"删到替换目录"结论保留 |
| 原问题 9（原第 109 行） | `overlaps()` 只做词法比较，junction／挂载／硬链接与大小写差异见上；新增待验线索，无 severity |

**一致项：** 第 1 单元给出的源码行号区间逐段核对无误；三个目标文件的 blob 哈希（`daaa0c6b…`、`37bda6a2…`、`2a4cf45e…`）与只读参考副本一致；四项承诺的前提、被既有控制阻断的失效和 needs_validation 分类均与源码相符。未发现应改判为 confirmed 的项目。

**新增待验项：** `overlaps()` 只做词法比较（`50-51`、`58-61`），可能被 junction／挂载点／绑定挂载／目录硬链接绕过；缺失事实与核对方式已补进下面未验证项表的最后一行，并落到选目录操作第 2 条的同物理位置复核。

### 方法与限度

第 2 单元新增读取：三个目标文件全文（约 528 行）、`ai-config/README.md` 相关节、固定 SHA 的 `SKILL.md`、`ATTACK-CLASSES.md:50,54`、`VALIDATION-AND-REPORTING.md:5,87`；另核对 CPython `pathlib`／`os.path`／`shutil` 文档中 `is_junction` 与 `is_symlink` 的区别、`rmtree` 对符号链接的拒绝。未执行目标代码，未跑 unittest；修正时重跑了标准库 junction／`rmtree`／`rename` 行为探针（见第 6、7 题）。反读覆盖 9 个问题与 4 处表述核对，没有可量化的节省；主要收益是把第 1 单元的 9 个问题转为源码答案，并补出 `overlaps()` 的词法比较盲点。

来源（2026-11-03 读取，三个文档链接复核返回 200）：CPython 3.13 文档 `https://docs.python.org/3.13/library/pathlib.html`、`https://docs.python.org/3.13/library/os.path.html`、`https://docs.python.org/3.13/library/shutil.html`，以及 `os.walk` 实现 `https://github.com/python/cpython/blob/3.13/Lib/os.py`。

## 未验证项（needs_validation，无 severity）

| 线索 | 源码依据 | 缺失事实 | 安全的核对方式 |
|---|---|---|---|
| Windows junction／reparse 被当作普通目录跟随 | `export_ai_config.py:41-47`；平台标准库行为 | 所选路径祖先是否含 junction，以及是否有低信任方可创建／替换它 | 对每一级祖先查 reparse 标记（Python 3.12+ 可用 `Path.is_junction()`，但它只认 junction；覆盖全部 reparse 点用 `fsutil reparsepoint query` 或 PowerShell `Get-Item` 看 Attributes；Python 3.11 直接用 fsutil）；换物理路径重跑 `stage` 并比对快照 |
| 检查与打开之间的 TOCTOU | `79-91`、`144`、`154`、`156-157`、`210` | 是否存在可写祖先目录的低信任写者、能赢得竞态，且结果内容通过检测与人工审阅 | 审计每级目录的属主／ACL；在独占私有目录重跑；对比源与快照字节 |
| 输出父目录被替换 | `142-162` | 父目录是否非 sticky 且他人可写，是否有并发改名者 | 审计父目录权限；改用仅自己可写的本地目录 |
| 源→暂存没有哈希绑定 | `176-189` | `stage` 前源是否被他人改过，且审阅是否漏看 | 保持源单写者；记录 `stage` 时刻的源文件哈希并与快照比对 |
| 网络盘／overlay／同步盘语义 | `142-162` | 独占 `mkdir`、`rename`、ACL 可见性是否符合假设 | 只用本地盘；在目标文件系统上做一次合成目录的创建／改名核对 |
| `os.walk` 遍历错误不报告，集合检查只比较文件 | `217-226` | 暂存树是否有不可读的多余目录（不会被提升） | 保持暂存 0700 且单写者；审阅时列一次完整目录树 |
| `overlaps()` 只做词法比较 | `50-51`、`58-61` | 路径上是否有 junction／挂载点／绑定挂载／目录硬链接，且能由非操作者创建 | 用 `Path.resolve()`／`os.path.samefile` 复核；逐级查挂载与 reparse 标记 |

以上均无 severity；缺少上述任一事实时，结论只到"源码足以说明的已有控制"。

## 方法收益、成本与不适用

- 最大作用：`SKILL.md:140` 的候选门槛把"TOCTOU 存在"留在前提失配层面，避免把"缺少额外防御"写成漏洞；第 33-40 行给出了不运行目标的明确依据；第 152 行让 junction 与共享目录两项保持无 severity 的待验状态。`68-80` 的提升流程提供了描述并发前提的精确术语，但没有被强加为本导出器的契约。
- 顺序偏差：本次先读了三个目标文件，随后才取回固定 SHA 的 Skill 正文；边界问题来自任务卡的四项承诺，不是从源码反推。条款仍约束了候选门槛、执行与待验分类，但不满足"先写条款再读目标"的原始顺序，记录在此。
- 成本：官方四份文档共 664 行，按主题读取相关章节（`SKILL.md` 全文）；目标源码与测试 528 行全文；指南按相关小节读取；加标准库 junction／`rmtree`／`rename` 行为核对和三次 blob 哈希比对。没有净收益的量化证据；不编造节省时间或提升比例。
- 独立反证收益：第 2 单元把 9 个问题逐个落到源码答案，确认 0 confirmed 与四项承诺前提，并补出 `overlaps()` 的词法比较盲点；成本是重读三个目标文件与固定 SHA 的 Skill 正文相关节，没有可量化的净收益。
- 不适用：需要动态复现、ACL／文件系统实测或低信任写者的场景，guidance 模式只能给前提和待验项；六阶段、ledger、预算、severity 锚点与报告 schema 在本次没有对象。零 confirmed 是有效完成，不另造修复或延伸审计。

## 范围、基线与未做

- 两个单元都只读上述三个目标文件与 `ai-config/README.md`；第 2 单元另复核固定 SHA 的 Skill 正文与 CPython 文档。两单元均未导入目标模块、未运行 CLI、unittest、fixture 或目标脚本；未提交、未推送。
- 第 2 单元改后重跑 `python3 scripts/check_repo.py`（725 个文件，0 错误）、`python3 scripts/check_public.py`（1189 个文件，0 命中）和 `git diff --check`（通过）；第 1 单元已运行同一组检查。未运行 `check_offline.py`：其基础测试会执行本单元明确禁止运行的导出器测试；这不等于仓库完整离线检查通过。
- 未复用旧 VERIFY 广扫，也未重做 A-JSON-SYNTAX-READER 已接收的格式补丁；仓内未发现本任务 id 的在途写者或既有产物目录，故第 1 单元从零建立结果文件，第 2 单元只在其上补充独立反读。
- 两单元都只写本文件；接收端另回写任务状态与结果。不声称运行型安全验证、不声称完整六阶段审计。
- 产物不含本机绝对路径、凭据或内网地址。
