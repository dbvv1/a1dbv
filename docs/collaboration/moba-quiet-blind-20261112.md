# MOBA quiet 同机位非作者盲选

2026-11-12：两位未参与制作的新上下文审查者均偏好 quiet，四机位均不判更差。仅静态视觉门槛通过；default 完整 smoke 中断、quiet 完整 smoke 未运行，帧耗对比与重开／输入／保存恢复链仍缺，不能换默认。网站 v22、覆盖 0/89 不变。

## 原件与匿名映射

原件固定在 [aabc47be](https://github.com/dbvv1/MOBA-Like/tree/aabc47be6c806d66d2278dc808f6750ee2bee5c0/docs/quality/capture/B-MOBA-QUIET-PAIR-20261112)，运行源码 da56173cb338。采用 r1 原 PNG，未编辑图像；r2 重复与配对状态核对沿原接收记录。1280×720、DPR1、SwiftShader 软件档。

盲审时只给“俯视 MOBA”、A/B 八张原图、相同数字对应同机位同状态，不给源码、提交说明、版本身份或另一人的结论。第一位按 A/B，第二位按 B/A 检查；两人均实际看完八张。收齐独立意见后揭示 A=quiet、B=default。没有参照图，因此不是对标升档评审。

| 编号 | 机位 | A 原路径 | B 原路径 |
|---|---|---|---|
| 1 | spawn | quiet-pair/run-da56173cb338-march-rp0har/spawn-r1/00000.png | default-pair/run-da56173cb338-march-XwL7J0/spawn-r1/00000.png |
| 2 | spawn-to-tower | quiet-pair/run-da56173cb338-march-rp0har/spawn-to-tower-r1/00000.png | default-pair/run-da56173cb338-march-XwL7J0/spawn-to-tower-r1/00000.png |
| 3 | first-tower | quiet-pair/run-da56173cb338-march-rp0har/first-tower-r1/00000.png | default-pair/run-da56173cb338-march-XwL7J0/first-tower-r1/00000.png |
| 4 | gameplay | quiet-pair/run-da56173cb338-march-rp0har/gameplay-r1/00000.png | default-pair/run-da56173cb338-march-XwL7J0/gameplay-r1/00000.png |

## 两份独立意见

**审查一：整体 A，小幅胜出；逐机位 A/A/A/A。** A 的土路更自然融入草地，B 在基地左侧和塔脚扩宽处呈硬切多边形贴片；A 偏暖、柔和，建筑与地面较融洽。B 地表更锐、更细，A 大块绿褐纹有模糊感。两版白圈、血条、塔轮廓均可辨，A 没有明显单位识别损失；远景单位小，不能确认战斗辨识度。

**审查二：整体 A；逐机位 A/A/A/A，机位2优势较小。** A 的路沿连续，石墙亮面及基地、塔身更容易与地面分层；B 路面像剪贴、建筑正面偏暗。A 重复斑块及涂抹感仍突出，不宜继续软化道路到难判断边界。两版绿色同色系、远景单位过小，主要靠血条和白圈识别；缺密集团战帧，不能验证团战可读性。

共同的下一处差距是整场景地面重复与建筑／植被／角色分层，不再细拆路沿卡。两位均未评价声音、操作体验或性能；未做320像素缩图核验。本次已有内容的同机位盲选不依赖新增内容的320像素标准件门槛。

## 采用边界与下一步

保留 quiet 作为换默认对象，不再重复这轮静态盲选。先按原失败证据修 full-match 的时间戳与已知选择器／弹窗问题，取得 default 与 quiet 两路完整 smoke、连续帧耗和清理回执；性能无明显劣化才合入默认并更新网站。当前 Star 重派仅见19:21:40领取，结果分支仍旧5257d5c；不能占其拍摄槽或用认领冒充执行。
