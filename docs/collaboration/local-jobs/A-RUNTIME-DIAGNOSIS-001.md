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

**实际模型／客户端**：父调用与三个 Workflow 阶段的 assistant `message.model` 均为 `deepseek-flash`；请求别名 `deepseek-v4.1-flash[1m]` 不推断独立后端；Claude Code 原生 Workflow，单次实现；独立只读复核由父级在本次调用后执行，本任务不声称自审独立。

### 可接手命令（修订：完整 Windows PowerShell 入口）

下列是交接代码，不代表本次又运行七个消费者。先在自己的临时目录执行初始化，在同一 PowerShell 中把后面的四段 Python 分别保存到注明位置，再执行场景函数。只用已有获准的 ffmpeg 与 Python，依赖装进本次 venv；无 ffmpeg 时记缺入口，不自行安装服务或改安全设置。根目录、每个场景都必须是新的，旧证据不覆盖。原实测曾重建同一 big 目录，旧 big 的各次持久化快照未全保留；以下按运行名分目录，避免后续交接再丢快照。

```powershell
$ErrorActionPreference = 'Stop'
# Windows PowerShell；从你自己的临时工作目录执行，根目录必须尚不存在。
$runtimeRoot = Join-Path (Get-Location).Path 'beets-runtime-owned'
if (Test-Path -LiteralPath $runtimeRoot) { throw 'Use a new task-owned root; do not overwrite prior evidence.' }
New-Item -ItemType Directory -Path $runtimeRoot | Out-Null
foreach ($part in @('home','appdata','localappdata','beetsdir','xdg/config','xdg/data','tmp','scripts','diag','scenarios','runs')) {
    New-Item -ItemType Directory -Path (Join-Path $runtimeRoot $part) | Out-Null
}
$env:HOME = Join-Path $runtimeRoot 'home'
$env:USERPROFILE = $env:HOME
$env:APPDATA = Join-Path $runtimeRoot 'appdata'
$env:LOCALAPPDATA = Join-Path $runtimeRoot 'localappdata'
$env:BEETSDIR = Join-Path $runtimeRoot 'beetsdir'
$env:XDG_CONFIG_HOME = Join-Path $runtimeRoot 'xdg/config'
$env:XDG_DATA_HOME = Join-Path $runtimeRoot 'xdg/data'
$env:TMP = Join-Path $runtimeRoot 'tmp'
$env:TEMP = $env:TMP
$env:PYTHONNOUSERSITE = '1'
$env:PYTHONUTF8 = '1'
$env:PIP_CONFIG_FILE = 'NUL'
Get-Command ffmpeg -ErrorAction Stop | Select-Object Name,Source
# 使用当前获准的 Python；原记录为 3.13.5，不自行安装另一个版本。
python --version
$appRoot = Join-Path $runtimeRoot 'beets'
git clone --filter=blob:none --no-checkout https://github.com/beetbox/beets.git $appRoot
if ($LASTEXITCODE -ne 0) { throw 'clone failed' }
git -C $appRoot checkout --detach d7397566b00dd7ca01c604c3329decce59f060a2
if ($LASTEXITCODE -ne 0) { throw 'checkout failed' }
git -C $appRoot fetch origin pull/7112/head:pr7112
if ($LASTEXITCODE -ne 0) { throw 'fetch failed' }
# 后续 checkout 固定对象，PR 已变化时也不悄悄换版本。
python -m venv (Join-Path $runtimeRoot 'venv')
if ($LASTEXITCODE -ne 0) { throw 'venv failed' }
$py = Join-Path $runtimeRoot 'venv/Scripts/python.exe'
& $py -m pip install -e $appRoot
if ($LASTEXITCODE -ne 0) { throw 'project-local install failed' }
```

保存为 `$runtimeRoot/scripts/build_lib.py`（原实用脚本，包含完整参数解析；只对命令指定的任务自有 DB／副本操作）：

```python
"""Build an isolated beets library from public whitenoise fixtures.

Only copies owned fixture files into the task scratch directory.  Missing
entries are created by moving the owned copy into a holding directory after
the library row has been stored, leaving a stale database path.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path

from beets.library import Item, Library

FIXTURES = ["whitenoise.mp3", "whitenoise.flac", "whitenoise.opus"]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--fixtures", required=True)
    ap.add_argument("--db", required=True)
    ap.add_argument("--lib", required=True)
    ap.add_argument("--holding", required=True)
    ap.add_argument("--count", type=int, default=7)
    ap.add_argument("--missing", type=int, default=0)
    ap.add_argument("--missing-step", type=int, default=0,
                    help="if >0, mark every Nth item missing instead of the first N")
    args = ap.parse_args()

    fixture_dir = Path(args.fixtures)
    lib_dir = Path(args.lib)
    holding = Path(args.holding)
    db_path = Path(args.db)
    lib_dir.mkdir(parents=True, exist_ok=True)
    holding.mkdir(parents=True, exist_ok=True)
    if db_path.exists():
        db_path.unlink()

    lib = Library(str(db_path))
    manifest = {"db": str(db_path), "lib": str(lib_dir), "items": [],
                "missing": []}
    missing_idx = set()
    if args.missing_step:
        missing_idx = {i for i in range(args.count) if i % args.missing_step == 0}
    else:
        missing_idx = set(range(min(args.missing, args.count)))

    for i in range(args.count):
        src = fixture_dir / FIXTURES[i % len(FIXTURES)]
        ext = src.suffix
        dest = lib_dir / f"fixture-{i:04d}{ext}"
        shutil.copy2(src, dest)
        item = Item.from_path(str(dest))
        item.title = f"Fixture Track {i:04d}"
        item.album = f"Fixture Album {i // 5:04d}"
        item.albumartist = "Fixture Artist"
        item.artist = "Fixture Artist"
        item.track = (i % 5) + 1
        item.add(lib)
        entry = {"index": i, "id": item.id, "path": str(dest),
                 "title": item.title}
        if i in missing_idx:
            moved = holding / dest.name
            os.replace(dest, moved)
            entry["moved_to"] = str(moved)
            manifest["missing"].append(entry)
        manifest["items"].append(entry)

    out = Path(args.db).with_suffix(".manifest.json")
    out.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps({"items": len(manifest["items"]),
                      "missing": len(manifest["missing"]),
                      "manifest": str(out)}, indent=2))


if __name__ == "__main__":
    main()
```

保存为 `$runtimeRoot/scripts/run_beet.py`（真实 CLI、显式隔离、结果保存；超时只回收自己创建的 PID 子树）：

```python
"""Run the real `beet replaygain` CLI against an owned fixture library.

Isolates HOME/BEETSDIR/etc. under the task scratch tree, records wall time,
exit status, stdout/stderr, optional faulthandler dumps, and on timeout only
kills the process tree started by this script.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path


def isolated_env(runtime: Path, diag: bool) -> dict[str, str]:
    env = {
        "HOME": str(runtime / "home"),
        "USERPROFILE": str(runtime / "home"),
        "APPDATA": str(runtime / "appdata"),
        "LOCALAPPDATA": str(runtime / "localappdata"),
        "BEETSDIR": str(runtime / "beetsdir"),
        "XDG_CONFIG_HOME": str(runtime / "xdg" / "config"),
        "XDG_DATA_HOME": str(runtime / "xdg" / "data"),
        "TMP": str(runtime / "tmp"),
        "TEMP": str(runtime / "tmp"),
        "PYTHONNOUSERSITE": "1",
        "PYTHONUTF8": "1",
        "PIP_CONFIG_FILE": os.devnull,
        "PYTHONIOENCODING": "utf-8",
        "PATH": os.environ.get("PATH", ""),
    }
    if diag:
        env["PYTHONPATH"] = str(runtime / "diag")
        env["BEETS_DIAG_DUMP_SECONDS"] = str(args.diag_seconds)
    return env


def child_snapshot(pid: int) -> str:
    cmd = (
        "Get-CimInstance Win32_Process -Filter "
        f"'ParentProcessId={pid}' | Select-Object ProcessId,ParentProcessId,"
        "Name,CommandLine | ConvertTo-Json -Depth 3"
    )
    try:
        p = subprocess.run(
            ["powershell", "-NoProfile", "-Command", cmd],
            capture_output=True, text=True, timeout=30,
        )
        return p.stdout.strip() or "<no child processes>"
    except Exception as exc:  # noqa: BLE001
        return f"<snapshot failed: {exc}>"


def main() -> None:
    global args
    ap = argparse.ArgumentParser()
    ap.add_argument("--runtime", required=True)
    ap.add_argument("--name", required=True)
    ap.add_argument("--config", required=True)
    ap.add_argument("--db", required=True)
    ap.add_argument("--lib", required=True)
    ap.add_argument("--threads", type=int, required=True)
    ap.add_argument("--timeout", type=float, default=180)
    ap.add_argument("--diag-seconds", type=int, default=0)
    ap.add_argument("--write-tags", action="store_true")
    ap.add_argument("--verbose", type=int, default=1)
    args = ap.parse_args()

    runtime = Path(args.runtime)
    python = runtime / "venv" / "Scripts" / "python.exe"
    outdir = runtime / "runs" / args.name
    outdir.mkdir(parents=True, exist_ok=True)
    stdout_path = outdir / "stdout.txt"
    stderr_path = outdir / "stderr.txt"

    cmd = [str(python), "-m", "beets", "-c", args.config, "-l", args.db,
           "-d", args.lib, "-" + "v" * args.verbose, "replaygain",
           "--threads", str(args.threads)]
    if args.write_tags:
        cmd.append("-w")

    env = isolated_env(runtime, args.diag_seconds > 0)
    started = time.time()
    timed_out = False
    children = ""
    with open(stdout_path, "wb") as out, open(stderr_path, "wb") as err:
        proc = subprocess.Popen(cmd, stdout=out, stderr=err, env=env,
                                cwd=str(runtime))
        try:
            rc = proc.wait(timeout=args.timeout)
        except subprocess.TimeoutExpired:
            timed_out = True
            children = child_snapshot(proc.pid)
            (outdir / "children.txt").write_text(children, encoding="utf-8")
            subprocess.run(
                ["taskkill", "/PID", str(proc.pid), "/T", "/F"],
                capture_output=True, text=True,
            )
            try:
                rc = proc.wait(timeout=30)
            except subprocess.TimeoutExpired:
                rc = None
    duration = time.time() - started

    stderr_text = stderr_path.read_text(encoding="utf-8", errors="replace")
    stdout_text = stdout_path.read_text(encoding="utf-8", errors="replace")
    result = {
        "name": args.name,
        "cmd": cmd,
        "threads": args.threads,
        "timeout_s": args.timeout,
        "timed_out": timed_out,
        "returncode": rc,
        "duration_s": round(duration, 3),
        "stdout_bytes": len(stdout_text.encode("utf-8")),
        "stderr_bytes": len(stderr_text.encode("utf-8")),
        "ffmpeg_status_lines": re.findall(
            r"ffmpeg exited with status \d+", stdout_text + stderr_text
        ),
        "analyzing_line": next(
            (ln for ln in stdout_text.splitlines() + stderr_text.splitlines()
             if "Analyzing" in ln), None
        ),
        "traceback_dumps": (stdout_text + stderr_text).count(
            "Thread 0x"
        ) + (stdout_text + stderr_text).count("Current thread 0x"),
        "children_snapshot": children,
        "stderr_tail": stderr_text.splitlines()[-15:],
        "stdout_tail": stdout_text.splitlines()[-15:],
        "stdout_path": str(stdout_path),
        "stderr_path": str(stderr_path),
    }
    (outdir / "result.json").write_text(
        json.dumps(result, indent=2), encoding="utf-8"
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
```

保存为 `$runtimeRoot/scripts/check_lib.py`（DB 与有效／holding 文件标签回读；检查缺失条目为 NULL，Opus 使用 R128 字段）：

```python
"""Dump DB replaygain columns and on-disk tags for the owned fixture library."""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
from pathlib import Path

import mediafile


def tag_value(mf, name):
    try:
        return getattr(mf, name)
    except Exception as exc:  # noqa: BLE001 - report, do not crash the audit
        return f"<error: {type(exc).__name__}: {exc}>"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True)
    ap.add_argument("--lib", required=True)
    ap.add_argument("--holding", required=True)
    args = ap.parse_args()
    lib_dir = Path(args.lib)
    holding = Path(args.holding)

    con = sqlite3.connect(args.db)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "select id, path, title, rg_track_gain, rg_track_peak, "
        "rg_album_gain, rg_album_peak, r128_track_gain, r128_album_gain "
        "from items order by id"
    ).fetchall()

    out = []
    for row in rows:
        p = Path(os.fsdecode(row["path"]))
        if not p.is_absolute():
            p = lib_dir / p
        rec = {"id": row["id"], "title": row["title"], "path": str(p),
               "exists": p.exists(),
               "db_rg_track_gain": row["rg_track_gain"],
               "db_rg_track_peak": row["rg_track_peak"],
               "db_rg_album_gain": row["rg_album_gain"],
               "db_rg_album_peak": row["rg_album_peak"],
               "db_r128_track_gain": row["r128_track_gain"],
               "db_r128_album_gain": row["r128_album_gain"]}
        if p.exists():
            mf = mediafile.MediaFile(str(p))
            rec["tags"] = {
                "rg_track_gain": tag_value(mf, "rg_track_gain"),
                "rg_track_peak": tag_value(mf, "rg_track_peak"),
                "rg_album_gain": tag_value(mf, "rg_album_gain"),
                "rg_album_peak": tag_value(mf, "rg_album_peak"),
                "r128_track_gain": tag_value(mf, "r128_track_gain"),
                "r128_album_gain": tag_value(mf, "r128_album_gain"),
            }
        else:
            rec["tags"] = None
            held = holding / p.name
            rec["holding_exists"] = held.exists()
            if held.exists():
                mf = mediafile.MediaFile(str(held))
                rec["holding_tags"] = {
                    "rg_track_gain": tag_value(mf, "rg_track_gain"),
                    "rg_track_peak": tag_value(mf, "rg_track_peak"),
                    "rg_album_gain": tag_value(mf, "rg_album_gain"),
                    "rg_album_peak": tag_value(mf, "rg_album_peak"),
                    "r128_track_gain": tag_value(mf, "r128_track_gain"),
                    "r128_album_gain": tag_value(mf, "r128_album_gain"),
                }
        out.append(rec)
    con.close()
    print(json.dumps(out, indent=2, default=str))


if __name__ == "__main__":
    main()
```

保存为 `$runtimeRoot/diag/sitecustomize.py`（只有指定 `-DiagSeconds 10` 的本次子进程开启栈转储）：

```python
import faulthandler
import os
seconds = int(os.environ.get("BEETS_DIAG_DUMP_SECONDS", "0") or 0)
if seconds:
    faulthandler.dump_traceback_later(seconds, repeat=True)
```

最后执行以下函数和七条命令，生成真实配置并传完整参数；不再使用 `...`。同库重复执行默认会跳过已有 gain，本入口不复用场景；若另行复用必须理解 `--force` 与标签副作用。

```powershell
function Invoke-ReplayCase {
    param([string]$Name, [string]$Ref, [int]$Count, [int]$Missing,
          [int]$MissingStep, [int]$Threads, [int]$TimeoutSeconds,
          [switch]$WriteTags, [int]$DiagSeconds = 0)
    git -C $appRoot checkout --detach $Ref
    if ($LASTEXITCODE -ne 0) { throw 'fixed source object unavailable' }
    $scenario = Join-Path $runtimeRoot ('scenarios/' + $Name)
    if (Test-Path -LiteralPath $scenario) { throw 'Use a fresh scenario name; preserve old evidence.' }
    New-Item -ItemType Directory -Path $scenario | Out-Null
    $dbFile = Join-Path $scenario 'library.db'
    $libDir = Join-Path $scenario 'lib'
    $holdingDir = Join-Path $scenario 'holding'
    $cfgFile = Join-Path $scenario 'config.yaml'
    $libYaml = $libDir.Replace('\','/')
    $dbYaml = $dbFile.Replace('\','/')
    @("directory: '$libYaml'", "library: '$dbYaml'", 'plugins: [replaygain]',
      'import:', '  write: yes', 'replaygain:', '  auto: no',
      '  backend: ffmpeg', "  threads: $Threads") | Set-Content -LiteralPath $cfgFile -Encoding UTF8
    $buildArgs = @((Join-Path $runtimeRoot 'scripts/build_lib.py'),
      '--fixtures', (Join-Path $appRoot 'test/rsrc'), '--db', $dbFile,
      '--lib', $libDir, '--holding', $holdingDir, '--count', "$Count")
    if ($MissingStep -gt 0) { $buildArgs += @('--missing-step', "$MissingStep") }
    else { $buildArgs += @('--missing', "$Missing") }
    & $py @buildArgs
    if ($LASTEXITCODE -ne 0) { throw 'fixture library setup failed' }
    $runArgs = @((Join-Path $runtimeRoot 'scripts/run_beet.py'),
      '--runtime', $runtimeRoot, '--name', $Name, '--config', $cfgFile,
      '--db', $dbFile, '--lib', $libDir, '--threads', "$Threads",
      '--timeout', "$TimeoutSeconds", '--diag-seconds', "$DiagSeconds")
    if ($WriteTags) { $runArgs += '--write-tags' }
    & $py @runArgs
    if ($LASTEXITCODE -ne 0) { throw 'runner failed; retain its output' }
    $resultFile = Join-Path $runtimeRoot ('runs/' + $Name + '/result.json')
    $result = Get-Content -LiteralPath $resultFile -Raw | ConvertFrom-Json
    & $py (Join-Path $runtimeRoot 'scripts/check_lib.py') --db $dbFile --lib $libDir --holding $holdingDir |
      Set-Content -LiteralPath (Join-Path $runtimeRoot ('runs/' + $Name + '/check.json')) -Encoding UTF8
    if ($LASTEXITCODE -ne 0) { throw 'DB/tag readback failed' }
    if ($result.timed_out -or $result.returncode -ne 0) { throw 'consumer failed; retain result/stderr/children for diagnosis' }
}
$masterSha = 'd7397566b00dd7ca01c604c3329decce59f060a2'
$prSha = 'bbeb7ebc6c8b89aed641ceec32ce320bd08fe96e'
Invoke-ReplayCase -Name 'base-master' -Ref $masterSha -Count 3 -Missing 0 -Threads 4 -TimeoutSeconds 180 -WriteTags
Invoke-ReplayCase -Name 'missing-master-threaded4' -Ref $masterSha -Count 7 -Missing 2 -Threads 4 -TimeoutSeconds 150 -WriteTags -DiagSeconds 10
Invoke-ReplayCase -Name 'missing-master-serial0' -Ref $masterSha -Count 7 -Missing 2 -Threads 0 -TimeoutSeconds 150 -WriteTags
Invoke-ReplayCase -Name 'missing-pr7112-threaded4' -Ref $prSha -Count 7 -Missing 2 -Threads 4 -TimeoutSeconds 150 -WriteTags
# 原大场景实际缺失位置为 0/30/60/90；大场景没有 -w，不冒称写标签已验。
Invoke-ReplayCase -Name 'big120-master-threaded4' -Ref $masterSha -Count 120 -MissingStep 30 -Threads 4 -TimeoutSeconds 480
Invoke-ReplayCase -Name 'big120-master-serial0' -Ref $masterSha -Count 120 -MissingStep 30 -Threads 0 -TimeoutSeconds 300
Invoke-ReplayCase -Name 'big120-pr7112-threaded4' -Ref $prSha -Count 120 -MissingStep 30 -Threads 4 -TimeoutSeconds 300
# 仅在自己的检出中恢复版本，不影响系统或其他任务。
git -C $appRoot checkout --detach $masterSha
```

每次结果与 stderr 在 `runs/<运行名>/`，其 SQLite、manifest 与 holding 在 `scenarios/<运行名>/`。`check.json` 是回读，不以进程退出码替代持久化验收；正常／小缺文件的三组原检查证明 RG／R128 与标签相符，大场景只按各次 stderr 计数与现存最终 DB 陈述，不把已重建的旧 DB 倒推为分别验过。七次原运行均自行退出、未触发 timeout；超时回收代码尚未实测，不声称覆盖脱离子树的进程。

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

应用／回滚（沿用上方 PowerShell 的 `$appRoot`、固定 SHA；不推送、不改上游）：上方函数已经切换并验证两个版本，若另行切换，只在自己的检出执行：

```powershell
git -C $appRoot checkout --detach $prSha
if ($LASTEXITCODE -ne 0) { throw 'fixed PR object unavailable; do not substitute another head' }
# 恢复本任务基线
git -C $appRoot checkout --detach $masterSha
if ($LASTEXITCODE -ne 0) { throw 'baseline restore failed' }
```
PR 另含两个 watcher 回归测试与一条 ``:bug:`5449` `` changelog；本任务未复制补丁，也未改其测试。

### 清理与未完成项

- 所有子进程正常退出；退出后按本次任务路径过滤，无 ffmpeg／python 残留（只读快照）。缺文件副本保留在任务私有 `holding/`，未删除用户数据或下载音乐。
- 未完成：原报告 macOS 15／Python 3.14.7 未复测；未观测到无限挂起；#7112 未合入；#6963 的跳过缺失文件／提示 `beet update` 未实现。
- 原始 stderr、线程栈、SQLite、fixture 与运行脚本只留任务私有目录，不入公开仓。

本地执行端接收原调用：2026-10-25T10:35:49.495Z—11:05:56.931Z（UTC），正常退出。实施席曾提前将 `20a9fb8` 推至指定结果分支；该提交只保留为初稿，不代表父级独立验收。可接手命令的后续修订与独立只读审查完成后再追加提交，不改写旧历史、不重跑联通或已通过运行。

独立审查修订：原命令片段缺参数入口／场景变量／配置生成／diag 目录及运行包装，且大场景缺失位置不忠实，已以原实用脚本及完整 PowerShell 调用补齐；原初稿与原运行不覆盖，仅复核交接差量，不重复应用运行。

## 本地执行端独立复核与最终范围

独立只读审查核对七份真实 CLI 结果、stderr、SQLite／标签、线程栈与固定上游差异，认可“本机未复现无限挂起、可条件采用现有 #7112”的结论；没有新增产品补丁。发现的交接缺陷是公开命令不完整及大场景缺失位置不忠实，已按原脚本和实际输入修正。定向复查确认主入口完整，余下旧 Bash 应用／回滚命令也按其指明改为同一 PowerShell 变量与版本检查；只做文档和语法复核，未重复消费者运行。

正常退出后的任务进程无残留有原记录支持，超时回收未触发、脱离子树清理未验；旧大场景库被重建，不能倒推每次库快照均存在。原报告平台、无限挂起和缺文件 UX 仍待验／未实现。工作结论只限当前运行与条件采用，不标为原平台修复已验收；原始失败、早期发布稿与后续修订均保留。

最终回传：结果分支 `relay/a-runtime-diagnosis-001`，固定提交 [`18a346ab84c56074620977d70f3374499102085d`](https://github.com/dbvv1/a1dbv/commit/18a346ab84c56074620977d70f3374499102085d)，包含对早期 `20a9fb8` 的追加修订而非改写历史。文档 374 文件、公开内容与实际新增提交身份 635 文件、空白检查通过；四个 Python 代码块与全体 PowerShell 命令通过语法检查，未重复应用运行。main 仅回传原任务，15 §2 路线由 dot-A 接收，状态 `review_ready`；结论限本机未复现／现有 PR 条件采用，未标原平台与 UX 完成。
