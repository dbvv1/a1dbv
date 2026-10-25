# B-MOBA-ASSET-PREFLIGHT-001 · CC0 角色制作链预检

id: B-MOBA-ASSET-PREFLIGHT-001
owner: dot-B
status: running
accept: auto
target_repo: dbvv1/MOBA-Like
base_ref: main@46f5ce4ba25184dd88dbb268e58e5f9aebb9e696
result_branch: dot-b/tmp/20261026-moba-asset-preflight

云端 Codex 直接执行；接收端不重复认领。协调基线 a1dbv `90813ab9df227fb1995eaf381ff34e3e94b36462`（改写后 main），不合入旧历史。

仅独占 `asset-pipeline/`：比较官方 CC0 小包，实际解析角色、材质、骨架和动作，交可复现脚本及保骨架动作的二改。模拟原调用 B-MOBA-SIMULATION-001 的根配置、src、tests、tools 均不触碰；FPS 不开工。

完成非作者新上下文独审、适用检查、公开扫描和新增身份检查，仅快进推独立分支。accept: auto 表示常规验收意向，本项不授权接收端更新任何默认分支；最终接收及知识回流由根代理协调。
