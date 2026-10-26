# A-MIGRATION-ADOPTION-001 · 接收 Memoh 升级的真实业务

id: A-MIGRATION-ADOPTION-001
owner: dot-A
status: cancelled
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 98e7a5987223474ad008140e0dd8ea86a1458dd6
product_ref: 21b44d1087c43a83bde1fcce1d43a457220d45c1
result_branch: relay/a-migration-adoption-001

## 已接收与当前目标

四文件 Colada 0.21.2→1.4.8 工程差量已接收，类型检查／web构建和有效独审复用，全量失败保留；生产依赖默认不变。按2026-10-26用户方向及[当前长期提示词](../prompts/dot-a.md)，方法采用结论回流15，剩余完整产品验收取消，不再等待旧初始化或运行时恢复。

## 应用方式与回滚

[完整固定补丁、应用／回滚命令及原始验证](https://github.com/dbvv1/a1dbv/blob/98e7a5987223474ad008140e0dd8ea86a1458dd6/docs/collaboration/local-jobs/A-MIGRATION-ADOPTION-001.md#应用方式与回滚)。产品基线见上；源码与补丁已在独占云工作区恢复并核一致，过程留Git历史与提交说明。

## 已完成与未验范围

dot 直接执行的后端接收已结束：Go编译、前后frozen安装通过；普通PostgreSQL18＋pgvector／pgcrypto完成169项clean迁移；合成admin登录、bot异步写入／读取／改名与独立SQL持久化核验通过。升级后Vite→真实API代理200；这些不是Colada页面运行证据。

浏览器Chromium启动的singleton IPC socket被平台EPERM拒绝；异步workspace provision访问Unix endpoint也被拒，两bot最终failed，各attempt=1。未重试这些动作，不算完整bot／聊天通过。所有服务已于2026-10-25 19:09 UTC停止，新增证据与恢复保护已独立复核。

真实页面及同profile／origin／会话的旧缓存hydrate-before-refetch仍未验，生产默认不变。本任务不继续恢复浏览器或运行时，也不重登录清缓存、不伪造缓存、不改变安全设置或重跑被拒操作。后端成果进入原采用范围，过程日志留执行记录。

2026-10-25 20:16:40–20:18:09 UTC只读核实：原生桌面仅补浏览器入口；当前后端无条件启动workspace reconciler，未找到官方隔离开关，offline配置仅限依赖目录维护；合法浏览器会话／旧缓存也不存在。fail-fast保护保留，未恢复旧服务／DB、未注入token或重试Unix动作；failed bot列表不等于可用workspace／chat。产品无变、原独审复用；此后用户取消完整产品验收，不再等待支持能力或合法会话来恢复本任务。上游政策所需实证仍不足，不据部分验证声称可发布升级。
