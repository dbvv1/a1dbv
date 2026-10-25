# A-RUNTIME-DIAGNOSIS-001 · 从真实命令挂起到可接收的应用修复

id: A-RUNTIME-DIAGNOSIS-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 8b12e5ae04ea27bb81206d2cf8aaffbe40791a5e
result_branch: relay/a-runtime-diagnosis-001

## 目标

补完整应用的运行时诊断路线：真实 CLI、数据库状态、子进程和并发收尾串在一起时，让 Agent 先取得决定性运行证据，区分已有修复与独立问题，再交可复查的消费者结果。不是为 debugger 造异常、通用库边界修补系列或正式方法 A/B。

自然需求为 [beets #6963](https://github.com/beetbox/beets/issues/6963)：库记录仍在、文件缺失时，`beet replaygain` 的 FFmpeg 后端报错后挂起；原报告为 macOS 15／Python 3.14.7／beets 2.13.1。当前 master 固定 `d7397566b00dd7ca01c604c3329decce59f060a2`（2026-10-25 10:26 UTC）。不要先假定当前执行端一定复现或旧版本结论适用于当前版本。

**先接已有成果，不能重复修复**：[PR #7112](https://github.com/beetbox/beets/pull/7112) 今日新建、调查时仍 open/unmerged，head `bbeb7ebc6c8b89aed641ceec32ce320bd08fe96e`；它修 #5449 的 ExceptionWatcher 忙等，可能影响 #6963。开工重核 PR 和消费者当前状态，先比较实际失败路径是否相同；这只是产品版本诊断，不是模型方法对照。

## 同一任务的实施顺序

1. 读固定源码、MIT 许可、现有开发命令与 `test/plugins/test_replaygain.py` 中真实 FFmpeg CLI 测试（如 `TestReplayGainFfmpegNoiseCli`）。沿已有公开 fixture、临时 SQLite 与配置起步，不读取用户音乐库、HOME 配置、账号或私有文件。
2. 在独占临时工作区建立正常消费基线，再按 issue 的真实状态复现：把 fixture 的一份音频移到临时保留位置，留下失效库记录；不删除用户数据、不下载外部音乐、不调用在线识别服务。记录正常及缺文件情形的退出状态、stderr、剩余工作线程／子进程和有效文件的数据库／标签结果。
3. 挂起出现时再取定向线程栈或跟踪，定位停在 FFmpeg、任务回调还是收尾；源码与现有日志足够就不用加 debugger。结合原有线程模式和可用的串行模式判断；仅对当前启动的进程设置超时和回收，不终止其他作业。运行环境与原报告不同要明示。
4. 固定 #7112 后核同一消费者。它已解决就直接接收现成修复／给条件采用结论，不另造补丁；当前环境未复现就交具体负结果。只有仍有独立、自然复现的问题才继续最小修复、对应回归与真实 CLI 接收，不重做他人在制路径。
5. 修复必须保正常音乐处理与持久化结果，并把实际故障路径失败→通过或“未复现／上游已覆盖”交回。无需上游 PR／评论；不要把单个环境的通过声称为全平台已解决。

## 交付与边界

- 按既有已配置正常原生 Workflow，实际模型从响应字段取；复用一次有效独审，返修只验受影响路径。把证据交给实际编码 Agent 决定下一步，不用静态猜测冒充 runtime 采用。
- 只改本任务与 `docs/15-task-playbooks.md` §2 对应的诊断路线，不碰 04 试点、13 或共享 TASKS；有实质结果才改正文。正文写选择、起点与实际改变，完整补丁／命令和恢复条件放本任务。无增量就仅回本任务，不重复造案例。
- 临时运行只用当前执行端已获准的公开软件与现有工作区，非付费；不创建账号、凭据或持久访问，不改安全设置、不部署，不扩大既有具体拒绝。缺入口先区分未尝试、实际能力不足与真实拒绝，不能把其他任务限制直接泛化。
- 单次搭建／运行最多两小时，保留成功产物及具体缺失输入后停依赖步骤，不扩展为探针矩阵。输出只保必要摘要和可接手完整差量，不上传整仓、个人路径或原始私有日志。
- 仅推结果分支；核最新 main，执行适用文档／相关行为检查、公开文件／实际新增提交身份与空白扫描；回固定 SHA、实际起止与未完成项，状态 `review_ready`，由 dot-A 接收。

认领：dot 本地协作；2026-10-25T10:33Z。来源 main 固定 `5a63d88`；先核现有 #7112 与消费者状态，再沿原生 Workflow 复现／条件采用。仅临时 fixture、独占 SQLite 与显式配置；不读真实音乐库／HOME，不重测联通或制造额外故障，仅推指定分支。

## 运行时结果（2026-10-25）

**状态**：`review_ready`。单主机、单次实现；未提交上游、未发 PR／评论。实际起止：认领 2026-10-25T10:33Z；本次运行时工作约 10:35Z–10:56Z（UTC+8 18:35–18:56），搭建与全部运行合计约 20 分钟，低于单次 2h 上限。

**环境与原报告差异**：Windows 11 Enterprise 10.0.26200／Python 3.13.5／beets master `d7397566`（2.14.1，MIT）／ffmpeg 9.0.2-full_build（libavfilter 12.1.102，`ebur128`）。原报告为 macOS 15／Python 3.14.7／beets 2.13.1。原报告默认 threads（CPU 数）与 `auto: yes`；实测用 `threads: 4` 与 `auto: no`（`auto` 只影响导入时自动分析，手动 `beet replaygain` 路径不变）。

**实际消费结果**（公开 fixture 副本、任务独占 SQLite、显式 config；未读用户音乐库／HOME）：

| 场景 | 版本 | threads | 退出码 | 实际耗时 | 结果 |
|---|---|---:|---:|---:|---|
| 3 条有效（基线） | master | 4 | 0 | 8.699s | 3/3 落库（2 RG + 1 R128），DB 与文件标签一致 |
| 5 有效 + 2 缺文件 | master | 4 | 0 | 11.462s | 2 次 `ffmpeg exited with status 4294967294`；5/5 有效落库；2 条缺失 DB 保持 NULL，保留副本标签未变 |
| 5 有效 + 2 缺文件 | master | 0 | 0 | 2.415s | 相同错误与落库结果 |
| 5 有效 + 2 缺文件 | PR #7112 `bbeb7ebc` | 4 | 0 | 2.001s | 相同错误与落库结果 |
| 116 有效 + 4 缺文件 | master | 4 | 0 | 110.609s | 116 done／4 errors |
| 116 有效 + 4 缺文件 | master | 0 | 0 | 15.912s | 116 done／4 errors |
| 116 有效 + 4 缺文件 | PR #7112 `bbeb7ebc` | 4 | 0 | 6.560s | 116 done／4 errors |

所有运行在时限内自行结束，**未复现原报告的无限挂起**。Windows 的 ffmpeg 失败返回 `4294967294`（32 位无符号的 -2），原报告 macOS 为 `254`；两者都走非零退出的 `ReplayGainError` 路径。Opus 条目使用 R128 字段，RG 列为空属正常。

**决定性栈**：master 的 threaded 缺文件运行在 10s 时由 stdlib `faulthandler` 取到线程栈：`ExceptionWatcher.run` 停在 `beetsplug/replaygain.py:1251` 的 `get_nowait()`；主线程停在 `close_pool → pool.join`。缺文件错误只进 `_apply` 的 `error_callback` 记录，不经 watcher 队列；#7112 仅把忙等改为 `get(timeout=0.1)`。116 条时 threaded／串行／PR 为 110.6s／15.9s／6.6s，说明同一路径存在随规模放大的线程饥饿退化，与“大库看起来挂起”一致，但不是本机观测到的无限挂起。

**判定**：`upstream-covered (conditional)`。采用 PR #7112 的现有产品改动，不另写重复补丁。条件与限制：PR 仍 open/unmerged（2026-10-25T10:17Z 核验，head `bbeb7ebc` 未变，mergeable clean）；仅 Windows／Python 3.13 单主机；原报告 macOS／Python 3.14 环境未测；#6963 要求的“检测／跳过缺失文件或建议 `beet update`”未被 #7112 实现，仍是未完成项。

**实际模型／客户端**：响应模型字段 `deepseek-v4.1-flash[1m]`（按 harness 响应字段；不以别名推断后端）；Claude Code 原生 Workflow，单次实现；独立只读复核由父级在本次调用后执行，本任务不声称自审独立。

### 可接手命令

以下 `<R>` 指任务私有证据目录；公开仓不含私有路径和原始日志。

```bash
# 源码与私有 venv（Windows 示例；不安装到全局／用户目录）
R=<task-private>/runtime
git clone --filter=blob:none --no-checkout https://github.com/beetbox/beets.git "$R/beets"
git -C "$R/beets" checkout --detach d7397566b00dd7ca01c604c3329decce59f060a2
python -m venv "$R/venv"
"$R/venv/Scripts/python.exe" -m pip install -e "$R/beets"

# 隔离（Windows 必须设 BEETSDIR；Confuse 的 <APP>DIR 覆盖 HOME）
export HOME="$R/home" USERPROFILE="$R/home" APPDATA="$R/appdata" LOCALAPPDATA="$R/localappdata"
export BEETSDIR="$R/beetsdir" XDG_CONFIG_HOME="$R/xdg/config" XDG_DATA_HOME="$R/xdg/data"
export TMP="$R/tmp" TEMP="$R/tmp" PYTHONNOUSERSITE=1
```

显式 `config.yaml`：

```yaml
directory: <R>/scenario/lib
library: <R>/scenario/library.db
plugins: [replaygain]
import:
  write: yes
replaygain:
  auto: no
  backend: ffmpeg
  threads: 4
```

建库与缺文件状态（只用公开 fixture 的副本）：

```python
from pathlib import Path
import shutil, os
from beets.library import Item, Library

lib = Library(str(db_path))
for i, src in enumerate(fixtures):            # test/rsrc/whitenoise.*
    dest = lib_dir / f"fixture-{i:04d}{src.suffix}"
    shutil.copy2(src, dest)                   # 只复制公开 fixture
    item = Item.from_path(str(dest))
    item.title, item.album = f"Fixture Track {i:04d}", f"Fixture Album {i // 5:04d}"
    item.albumartist = item.artist = "Fixture Artist"
    item.add(lib)
    if i in missing_idx:
        os.replace(dest, holding / dest.name) # 只移动本次副本，保留失效 DB 记录
```

运行与取证：

```bash
PY="$R/venv/Scripts/python.exe"; CFG="$R/scenario/config.yaml"; DB="$R/scenario/library.db"; LIB="$R/scenario/lib"

# 正常基线（3 条有效）
"$PY" -m beets -c "$CFG" -l "$DB" -d "$LIB" -v replaygain --threads 4 -w

# 缺文件 threaded / 串行对照
"$PY" -m beets -c "$CFG" -l "$DB" -d "$LIB" -v replaygain --threads 4
"$PY" -m beets -c "$CFG" -l "$DB" -d "$LIB" -v replaygain --threads 0

# 挂起时取线程栈（stdlib，不新增 debugger）
cat > "$R/diag/sitecustomize.py" <<'PY'
import faulthandler, os
s = int(os.environ.get("BEETS_DIAG_DUMP_SECONDS", "0") or 0)
if s: faulthandler.dump_traceback_later(s, repeat=True)
PY
PYTHONPATH="$R/diag" BEETS_DIAG_DUMP_SECONDS=10 "$PY" -m beets ... 2> stderr.txt
```

超时只用私有 Python `Popen` 包装并 `taskkill /PID <own-pid> /T /F`；不按镜像名、端口或全局实例清理。DB／标签验收：`beet list -f '$path|$rg_track_gain|$rg_track_peak|$r128_track_gain'`，并用 `mediafile.MediaFile` 读有效文件与 holding 副本；缺文件条目的 DB 值必须保持 NULL、holding 标签不得被改。

### 采用的上游补丁与回滚

PR #7112 base `d7397566`、head `bbeb7ebc`；产品改动只有 `beetsplug/replaygain.py`。下面为可读摘录（统一 diff 的空白上下文行在 Markdown 中显示为空行）；精确应用以 `git fetch` 固定 head 为准：

```diff
@@ -1245,16 +1245,19 @@ class ExceptionWatcher(Thread):
         self._stopevent = Event()
         Thread.__init__(self)

+    # Seconds to block waiting for an exception before re-checking
+    # `_stopevent`. Polling with `get_nowait()` would busy-loop and hold the
+    # GIL, starving the main and worker threads.
+    poll_interval = 0.1
+
     def run(self) -> None:
         while not self._stopevent.is_set():
             try:
-                exc = self._queue.get_nowait()
-                self._callback()
-                raise exc
+                exc = self._queue.get(timeout=self.poll_interval)
             except queue.Empty:
-                # No exceptions yet, loop back to check
-                #  whether `_stopevent` is set
-                pass
+                continue
+            self._callback()
+            raise exc
```

应用／回滚（不推送、不改上游）：`git -C "$R/beets" fetch origin pull/7112/head:pr7112 && git -C "$R/beets" checkout --detach bbeb7ebc`；回滚 `git -C "$R/beets" checkout --detach d7397566`。PR 另含两个 watcher 回归测试与一条 ``:bug:`5449` `` changelog；本任务未复制补丁，也未改其测试。

### 清理与未完成项

- 所有子进程正常退出；退出后按本次任务路径过滤，无 ffmpeg／python 残留（只读快照）。缺文件副本保留在任务私有 `holding/`，未删除用户数据或下载音乐。
- 未完成：原报告 macOS 15／Python 3.14.7 未复测；未观测到无限挂起；#7112 未合入；#6963 的跳过缺失文件／提示 `beet update` 未实现。
- 原始 stderr、线程栈、SQLite、fixture 与运行脚本只留任务私有目录，不入公开仓。
