# B-CASE-GPU-BASELINE-001 · 三个案例改前真 GPU 基线
id: B-CASE-GPU-BASELINE-001
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 43e3f191fa25c64bb79a5f80bc8d86a15b2cfd8f
result_branch: relay/b-case-gpu-baseline-001

## 目标
在同一 RTX 5070／有窗口 Chromium 上，按固定版本和命名机位，取得三个案例第一轮灯光修改前的可重复基线。三个固定候选已推送并完成源码／CPU独审。现有 FPS／MOBA GPU 观察交回或明确释放图形会话后，由 B 核实并改 ready；本卡不抢占在途实例。

## 按哪个 Skill
按 game-quality-pass §1、各固定版本 docs/capture.md 和游戏细则§7，严格串行 FPS → Star-Rush → MOBA。各自独立 worktree，不动用户正常开发目录；不改游戏实现。
- FPS：febed02656bbfb54d21717673e3b99df29a085fa；全部命名机位，seed=1、t=10、repeat=2，headed/require-gpu/check-live；再 gameplay、advance-fire、t=3、frames=240、repeat=2。
- Star-Rush：b37046eaa4e06d6797139a96d0fd3db667a90de2；coast-chase／coast-full-bend 用各自默认 seed/t，academy-depth 默认；每机位 repeat；另 coast-chase t=24、frames=180、headful；用实际浏览器 GPU 诊断生成匹配 renderer 的硬件证据，不手填猜测。
- MOBA：c3b6f237f10cfbaafb9f783bedf169a8aec89538；先构建 vite.capture.config.ts；gameplay／spawn／first-tower／spawn-to-tower，1280×720、seed=1、t=10、input=march、repeat=2，headed/require-gpu/check-live；再 gameplay 同参数 frames=120、repeat=2。
只用当前机器实际 RTX 5070 的硬件加速输出，保 renderer 原串；软件或未知不改名 gpu。出现浏览器限制按实际错误回报，不改安全参数。

## 写入范围
仅 a1dbv docs/collaboration/local-jobs/artifacts/B-CASE-GPU-BASELINE-001/ 的本作 PNG、精简元数据和结果说明；原日志、商业参照图、带用户路径的 GPU 诊断保本机。公开元数据只留源码／bundle／图片哈希、相机、seed/t/input、原 renderer、像素一致与实际步骤结果。无原路径、账户资料或生产地址；不改案例源码、默认分支、网站和其他任务。

## 怎样算做成
每机位独立两拍像素和状态一致；帧序列无缺帧、旧帧或覆盖，确为对应固定构建。正常入口实际启动，退出拍摄后实际操作仍可用。独审核图片与元数据，公扫后推原 relay 回 review_ready；失败保准确阶段与现有产物，不以测试／零帧／脚本输入证明驾驶或射击手感。本单元只交改前基线，不编造尚未制作的改后图或宣称品质达标。
