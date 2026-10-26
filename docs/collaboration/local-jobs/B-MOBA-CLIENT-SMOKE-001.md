# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: revision_requested
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 083183c245c2e8f4bd3dbbfa7e3d7c75a0357b3b
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

让玩家在已有 Veyra／Morrow 中选择下一局英雄，用真实技能操作并重开。候选 `b/moba-hero-selection` 固定上述 SHA、tree `0ef3b0c27add970c4f14268b8cdd701650481c1f`；只改客户端选择／启动、玩家说明和测试，不改模拟、数值、素材源或依赖。

## 修改要求

原 `641cf16` 已真实 ci／smoke 退出 0、HUD 图 decode 64×64 和旧断言通过，正式接入 [main 912c04c](https://github.com/dbvv1/MOBA-Like/commit/912c04ccb36b3c3b06cd7fcfba5b5a2341b8a81e)，树与受检树相同。旧 48 等接受保留。本次为同任务下一完整玩法修改，不重测旧提交、不新开任务；先核本修订是否已领取，在途则接续。

在固定新候选执行 `npm ci`、`npm run smoke`；现有脚本保全部旧断言，新增真实 DOM 选择 Morrow（当前局仍 Veyra）→ Restart → Morrow Q/W/E/R → 同选重开恢复资源／冷却 → 改回 Veyra／新局推进／单一 canvas。W 是立即自身护盾，其余目标行为沿现有 controls。作者已实跑 142 root tests、29 presentation tests、CLI／Web 构建及公开扫描；浏览器新链尚未实跑，不能用这些替代。

同时按原 Workflow 做一次非作者读者检查：选择何时生效、重开保／改选择、Morrow 自身 W 与方向／地面技能是否可照界面操作，读取本次七文件差量即可；不要重复研究整仓，不加证明门。不得改源码／依赖／断言；失败报具体阶段并交原 owner，不自行修实现。仅回固定 SHA、命令退出、通过／具体失败和读者发现，不补录额外字段。

在既有获授权接收环境使用 Node >=22.12.0；如缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码与具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器。截图／原始日志留本地 ignored，不上传私人路径或图片；不改产品 main 或部署。硬件与手感仍人工另验。

## 当前结果

- 旧 `641cf16`：已接受并正式采用；此前 ci／smoke 0、真实图标 decode、全部旧动作／场景／输入断言和独立审查通过，源未改。
- 新 `083183c`：待本修订真实浏览器与非作者读者结果；未宣称已领取或通过。
