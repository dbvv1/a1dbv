# B-MOBA-ASSET-PREFLIGHT-001 · CC0 角色制作链预检

id: B-MOBA-ASSET-PREFLIGHT-001
owner: dot-B
status: accepted
accept: auto
target_repo: dbvv1/MOBA-Like
base_ref: main@46f5ce4ba25184dd88dbb268e58e5f9aebb9e696
result_branch: dot-b/tmp/20261026-moba-asset-preflight

云端 Codex 直接执行；接收端不重复认领。协调基线 a1dbv `90813ab9df227fb1995eaf381ff34e3e94b36462`（改写后 main），不合入旧历史。

仅独占 `asset-pipeline/`：比较官方 CC0 小包，实际解析角色、材质、骨架和动作，交可复现脚本及保骨架动作的二改。模拟原调用 B-MOBA-SIMULATION-001 的根配置、src、tests、tools 均不触碰；FPS 不开工。

当前结果：预检及原创战斗占位资源已完成并按限定范围验收，MOBA main／result_branch 固定 [`c66f250`](https://github.com/dbvv1/MOBA-Like/commit/c66f250f817b1ad7357088cba12f6ad30c83b8c8)。15 骨骼、idle／walk／attack、双色＋单／双鳍、刀刃加长二改；源码／Blend／GLB、实际 Blender 预览及独审均通过。最小重现：`sh asset-pipeline/placeholder/run.sh`，需 Blender 4.3.2＋POSIX shell；本云轮收口，由根代理云电脑接续，不另开批次或重复认领。第三方源仍缺，被拒取回保持停止；未做最终美术、动画体验或游戏集成验收。

更新授权：有效非作者独审、适用检查及公开／身份检查通过后，已完成独占内容可自行串行快进发布默认分支，根代理事后抽查；原仅分支交付限制撤回。此更新未解除实际 HTTP 拒绝，当前不以文稿代替资产验收。

消费者接入：已接收 [固定 `99f3426`](https://github.com/dbvv1/MOBA-Like/tree/99f342621c09bec28da3945e8ed412e076100d59/asset-pipeline/validation) 的 GLTF 规范及 Three CPU 检查；三份原 GLB error 0、warning 25／26／25，整根变换正例与 mesh-only 反例均符合预期，5 项测试通过、0 skip。浏览器／GPU 和游戏仍未验，第三方取回停止条件不变。
