# B-MOBA-ASSET-PREFLIGHT-001 · CC0 角色制作链预检

id: B-MOBA-ASSET-PREFLIGHT-001
owner: dot-B
status: blocked
accept: auto
target_repo: dbvv1/MOBA-Like
base_ref: main@46f5ce4ba25184dd88dbb268e58e5f9aebb9e696
result_branch: dot-b/tmp/20261026-moba-asset-preflight

云端 Codex 直接执行；接收端不重复认领。协调基线 a1dbv `90813ab9df227fb1995eaf381ff34e3e94b36462`（改写后 main），不合入旧历史。

仅独占 `asset-pipeline/`：比较官方 CC0 小包，实际解析角色、材质、骨架和动作，交可复现脚本及保骨架动作的二改。模拟原调用 B-MOBA-SIMULATION-001 的根配置、src、tests、tools 均不触碰；FPS 不开工。

当前结果：合成夹具的 Blender 4.3.2 实际解析、GLB 首版／配色二改、保结构与重导入检查已跑通；第三方角色仍缺。独立 KayKit 官方仓库 API 取回也 HTTP 403／curl 22，与原两个被拒入口一起停止，不走镜像。合成结果已快进到 MOBA main／result_branch [`8d929af`](https://github.com/dbvv1/MOBA-Like/commit/8d929af0d11f0dc5884309455dc69e07c0a6349e)，非作者独审与适用／公开／身份检查通过。保留原任务待新访问证据，不重复认领；合成夹具不代表角色品质。

更新授权：有效非作者独审、适用检查及公开／身份检查通过后，已完成独占内容可自行串行快进发布默认分支，根代理事后抽查；原仅分支交付限制撤回。此更新未解除实际 HTTP 拒绝，当前不以文稿代替资产验收。
