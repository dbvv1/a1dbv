# B-STAR-LOCAL-PLAYLIST-20261121 · 本地歌单从播放失败恢复

id: B-STAR-LOCAL-PLAYLIST-20261121
owner: dot-B
kind: build
executor: strong
status: blocked
target_repo: dbvv1/Star-Rush-Reborn
base_ref: 056bfb71254b75bdbffac823173fa465695600d1
result_branch: relay/b-star-local-playlist-20261121

## 要什么

用游戏自己的歌单面板确认：正常音频能开始，坏文件可换歌，浏览器阻止开始时按钮明确给一次「播放音乐」重试。只补浏览器证据，不改混音、曲目、游戏逻辑、入口或部署。

## 几点事实

- 从源码分别重建[前版和候选](https://github.com/dbvv1/Star-Rush-Reborn/compare/77888a9f1b235c7e4d6ef06350e87be543a74c9c...056bfb71254b75bdbffac823173fa465695600d1)，使用普通 `/road/` 的歌单入口。旧版在受控媒体对象中拒播后按帧重试，候选回归 4/4；两者均缺真实浏览器文件解码及播放证据。不要复用已提交的 bundle。
- 文件用自造 PCM 短 WAV 和同格式名的坏文件。不读用户歌单、不上传、不接外部音乐服务。原生解码／媒体状态与按钮文本都要核，不能用替换 `Audio` 对象的结果当浏览器解码。自然无拒播样本就只记候选路径未验，不改浏览器权限、不绕过用户手势；没有授权的操作入口就留给人工。
- 由方向会话择时安排一次本机验证，不进入自动 ready、不预占共享槽、不替代优先的 [Auto 整局](B-STAR-AUTO-PACING-20261120.md)。只用获准的 headless 入口；不开可见窗口、不操作桌面、不模拟键鼠，不启动、清理或恢复别的任务。

## 交付

两版并列记录实际 bundle 摘要、Chromium／renderer、普通入口、可观察到的原生起播或错误（如浏览器媒体诊断可用）、提示及按钮文本、选下一首后的状态、控制台错误和真实退出。JS `play()` 尝试次数沿离线回归；普通浏览器取不到时记未测，不加监听钩子。候选的 `new Audio()` 不在 DOM 中；Chromium 的[暂停态拒播](https://github.com/chromium/chromium/blob/156.0.8078.79/third_party/blink/renderer/core/html/media/html_media_element.cc#L3161-L3195)早于原生 [`kPlay` 日志](https://github.com/chromium/chromium/blob/156.0.8078.79/third_party/blink/renderer/platform/media/web_media_player_impl.cc#L1007-L1042)，零条日志不等于零次重试。原生媒体流状态不等于听过；明确试听未验。只交短验证记录，不宣称整局、画面品质或上线。

## 当前结果

候选已构建，离线回归与公开扫描通过；本卡未执行。方向会话确认现有本机运行条件和操作授权后接续。
