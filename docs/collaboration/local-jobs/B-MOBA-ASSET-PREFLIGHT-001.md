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

当前结果：官方候选与 CC0 页面可读，优先小样为 Quaternius Animated Knight；云端取 Quaternius 全集页及 Kenney Protagonists 页均 HTTP 403／curl 22，已停止，未绕过。没有源文件、解析或二改结果，Blender 4.3.2 可用。候选与阻塞记录已到产品 main／result_branch [`cb20c6e`](https://github.com/dbvv1/MOBA-Like/commit/cb20c6e9c9088d83f4498dec81fb28b0146a6b4e) 的 `asset-pipeline/`；非作者新上下文独审仅接收此记录，公开／身份／JSON／空白检查通过；待新的相关访问证据后续原任务，不重复认领。

更新授权：有效非作者独审、适用检查及公开／身份检查通过后，已完成独占内容可自行串行快进发布默认分支，根代理事后抽查；原仅分支交付限制撤回。此更新未解除实际 HTTP 拒绝，当前不以文稿代替资产验收。
