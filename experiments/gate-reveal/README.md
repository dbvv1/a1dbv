# 开门揭示：可编辑镜头到真实媒体消费者

先把游戏交互与演出分开：合法触发立即提交门已解锁，实时 A 镜显示当前角色，固定 B 镜播放原创影片，实时 C 镜交还控制。正常播完与任意段跳过都能用方向键走过同一扇门；B 的 `ended` 只进入 C，不是全局出口。

## 重建与运行

已使用 Blender 4.3.2（Cycles CPU）、FFmpeg 7.1.5、Python 3.12、Node 24。需要这些工具在 `PATH`；无需模型、GPU、第三方素材或 npm 依赖。从仓库根目录：

```sh
python3 experiments/gate-reveal/build.py
node --test experiments/gate-reveal/test.mjs
python3 experiments/gate-reveal/test_source.py
node experiments/gate-reveal/server.mjs
```

在已有浏览器打开终端实际打印的 loopback 地址。用方向键／WASD移动，机关附近按 E 或点击 Activate gate；可暂停、跳过、重开。服务只暴露预览所需的五个路径，Ctrl+C 关闭。页面与服务须在同一可访问环境；不要为连接临时页面改安全设置或监听公网。

`generated/` 保存 `gate-reveal.blend`、场景配方、108 张 PNG 和 9 秒静音 H.264 `gate.mp4`（480×270、12 fps、yuv420p）。源码与配方可重新生成模型、材质、门动画、镜头和灯光；影片是派生物。目录已存在时命令拒绝覆盖，手改 `.blend` 不会被脚本悄悄清掉。输出不入 Git，读者在本地重建。

- `scene.json`：离线 B 镜参数。复制配方后传 `--recipe scene-edited.json --output generated-edited` 重渲；只取作者源用 `--source-only`。直接在 `.blend` 改镜头时，用 Blender 自身渲染，别把从配方重建误作读取手改文件。
- `author.py`：原创可编辑几何与门／相机关键帧，保存后重新打开验证。为兼容没有 OpenImageDenoise 的构建，此窄例用 24 samples、无降噪。
- `controller.mjs`：世界状态、段级推进与输入归属。A/C 用本例展示时钟，B 字幕读原生 `currentTime`；暂停同时停展示推进和媒体，浏览器失焦／隐藏先暂停。它不模拟视频解码。
- `app.mjs`：Canvas 2D 玩法消费者与真正的 `<video>`。每次 B 使用新媒体元素；跳过／重开释放元素与源，迟到 promise／回调不能接管新播放。播放失败仍经 C 回到已解锁世界。

## 第二次需求修改

页面 Version 选第二版，实时武器长度从 0.75 改成 1.05，C 的文字更长，停留从 5 秒延至 6.5 秒；A 仍 4 秒，B 仍同一个 9 秒文件。没有演员的 B 无须因装备变化重渲，也没有把全片或声音拉慢。此版是更长字幕，不含旁白或口型验证。

若需求真的改变 B 机位，再改 `scene.json` 的 `cameraEnd` 并重建 B；源测试实际检查了机位二改后网格、材质引用和门关键帧保持，不能据此推断任意生成器的窗外画面也会保持。

## 实际验收与边界

2026-10-26：完整 108 帧 CPU 渲染、`.blend` 保存重开、FFmpeg 编码和真实浏览器消费已执行。Node 的控制合同／HTTP 测试使用受控媒体夹具；Python 测试另实际启动 Blender、FFmpeg 和 ffprobe，检查源二改、解码、缺输入、错误配方和旧输出保护。真实浏览器检查与具体结果见 [WP7 同例](../../docs/research/2026-10-14-game-wp7-video.md#十三完整制作链源镜头与成片各自交付什么)。

这是可修改灰盒演出，不是 Unity／Unreal 游戏采用、GPU 性能或最终美术质量证明；静音影片不承担音画同步／听感结论。交付到项目时保留源，另按实际设备决定分辨率、解码／内存预算和声轨，已有引擎仍优先沿原 Timeline／Sequencer 模块接线。

许可：本目录代码 MIT（沿仓库 LICENSE）；本例原创几何、材质、动作、镜头与派生图片／影片以 CC0-1.0 提供。不含第三方美术输入。Blender／FFmpeg 自身许可与目标发行的编码要求需按所用构建分别核定。
