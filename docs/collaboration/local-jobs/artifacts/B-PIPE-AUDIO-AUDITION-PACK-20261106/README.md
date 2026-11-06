# 汇成两案候选试听批次

把 MOBA-Like 与 FPS-Like 两案已接收、尚未试听的八段提示源收进一个目录，供一次集中逐段试听。八段 WAV 按源 commit 原字节复制；没有重制、增益归一、混音、合成、转码、重采样，也没有接入游戏。

## 来源

| 来源 | 固定 commit | 目录 | 标签 |
|---|---|---|---|
| [MOBA-Like](https://github.com/dbvv1/MOBA-Like) | `0b3d85d47b184ac48450e0a9d039fd3e0143c273` | `asset-pipeline/ui-event-audio/` | purchase-ok、purchase-denied、level-up、respawn-ready |
| [FPS-Like](https://github.com/dbvv1/FPS-Like) | `ecb53c7464e4ccb8daba4353b94fc5bc9b8ef94a` | `asset-pipeline/match-cues/` | weapon-switch、menu-confirm、round-win、round-loss |

两案源声音均按 CC0-1.0 释出。逐项来源、完整 SHA-256、时长、采样率、PCM 位深与许可见 [manifest.json](manifest.json)；署名与许可声明见 [LICENSE.txt](LICENSE.txt)。源 recipe 与源 manifest 未复制进本包，其 SHA-256 记在 `manifest.json` 的 `sourceBatches`，用于核对固定源状态。

## 文件

```text
audio/moba-like/{purchase-ok,purchase-denied,level-up,respawn-ready}.wav
audio/fps-like/{weapon-switch,menu-confirm,round-win,round-loss}.wav
audition.html    本地试听页，只用相对路径 audio controls
manifest.json    八项元数据、来源与核验记录
LICENSE.txt      来源署名与 CC0-1.0 声明
verify_audition_pack.py   离线核验脚本
test_audition_pack.py     核验脚本的回归测试
```

## 试听

先下载／检出完整目录，保留 `audio/` 相对结构及 a1dbv 根 MIT 许可，再用浏览器打开本地 [audition.html](audition.html)。GitHub 文件页只显示源码，不是托管试听页。页面按两案分组列出八段，每段一个本地 `audio` 控件，需分别手动点击。页面没有自动播放、脚本、远程资源或网络请求；播放与否由使用者点击决定。本单元没有打开浏览器或音频设备，也没有试听任何一段。

带标签的逐段试听步骤（页面已显示语义标签，不构成语义识别盲测）：

1. 先不展开卡片里的“听后对照”，按 MOBA 四段、FPS 四段的顺序逐段播放。
2. 每听完一段，先记下与标签含义的匹配感、两声区别和听感，不要展开描述。
3. 八段全部写完后，再展开每段的“听后对照（源描述，非试听结果）”，与源配方描述核对；这些对照文字来自源端，不是试听结论。
4. 全程保持同一台设备、同一个系统音量，再回答下面的判断项。

## 判断项

按同一台设备、同一个系统音量听完八段，再回答：

1. **四声语义能否分。** MOBA 四段能否分清购买成功、购买失败、升级、复活就绪；FPS 四段能否分清切枪、菜单确认、回合胜、回合负。比较成功／失败与胜／负这类成对音的轮廓差异；本页标签可见，不能据此报告无提示识别率。
2. **是否尖锐或疲劳。** 起音是否刺耳、短音是否发尖；切枪与购买失败连续触发是否烦躁；升级三音是否拖；胜负与复活尾音是否过长。
3. **相同设备音量下是否差距过大。** 两案文件峰值本来就不同：MOBA 四段约 −9.10 dBFS，FPS 四段约 −12.00 dBFS，相差约 2.9 dB。本批次按规格不做归一，请判断这个文件层差距在试听中是否明显，以及案内各段差异是否可接受。文件峰值不等于感知响度。

**不能从这八段单片判断：**

- 没有真实交战叠播录音，无法判断枪声、技能音与战斗音乐同时播放时提示是否被遮住。
- 无法判断事件同步、漏播或重播；这些必须接入后验证。
- 无法判断混音层级、优先级、声像与空间化；八段都是单声道原始文件。
- 不提供响度归一或盲评分，也不把两案音色排成好坏名次。

## 核验

只用 Python 标准库；不打开声卡、GUI、浏览器或网络。

```sh
python3 verify_audition_pack.py
python3 -m unittest -v test_audition_pack.py
```

核验脚本检查：

- 八段标签各出现一次，顺序固定，没有多余 WAV。
- 每个文件存在，字节数与完整 SHA-256 与 `manifest.json` 一致。
- 每个文件是 RIFF/WAVE、48 kHz、单声道、PCM16，帧数与时长一致。
- 每段首末 PCM 采样为 0，采样峰值与峰值 dBFS 与 manifest 一致。
- `audition.html` 恰好八个 `audio` 控件，只引用存在的本地相对 WAV；没有 autoplay、script、远程 URL、CSS `url()` 或其他外部依赖。
- 每段源描述都在默认收起的“听后对照”里，且判断项排在卡片之前，便于先记感受再看源描述；标签始终可见，不保证盲测。
- `README.md` 与 `LICENSE.txt` 存在，许可与两案 commit 记录完整。

缺文件、非 WAV、采样率／声道数错误、manifest 哈希不符、HTML 自动播放或外部引用都会以非零退出码明确失败。回归测试逐项覆盖这些失败路径。

## 范围与状态

- 已做：固定源 commit 取八段原字节、生成元数据与试听页、离线格式／首末采样／哈希核验。
- 未做：试听、响度归一、混音、叠播遮挡、事件同步、设备播放、游戏接线与采用决定。
- 本目录只新增试听材料，不改两案源码、运行音频、HUD 或模拟。
- 开工时未在 `docs/collaboration/local-jobs/artifacts/` 发现同目的公开批次；八段只复制一次，没有再次生成同名声音。
