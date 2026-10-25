# A-MIGRATION-ADOPTION-001 · 接收 Memoh 升级的真实业务

id: A-MIGRATION-ADOPTION-001
owner: dot-A
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 98e7a5987223474ad008140e0dd8ea86a1458dd6
product_ref: 21b44d1087c43a83bde1fcce1d43a457220d45c1
result_branch: relay/a-migration-adoption-001

## 已接收与当前目标

四文件 Colada 0.21.2→1.4.8 工程差量已接收，类型检查／web构建和有效独审复用，全量失败保留；生产依赖默认不变。按10-26默认授权继续普通临时 PostgreSQL＋pgvector、合成管理员／bot 的实际API和数据接收，不再等待旧初始化询问。

## 应用方式与回滚

[完整固定补丁、应用／回滚命令及原始验证](https://github.com/dbvv1/a1dbv/blob/98e7a5987223474ad008140e0dd8ea86a1458dd6/docs/collaboration/local-jobs/A-MIGRATION-ADOPTION-001.md#应用方式与回滚)。产品基线见上；源码与补丁已在独占云工作区恢复并核一致，过程留Git历史与提交说明。

## 当前执行与阻塞

dot 直接执行的后端接收已结束：Go编译、前后frozen安装通过；普通PostgreSQL18＋pgvector／pgcrypto完成169项clean迁移；合成admin登录、bot异步写入／读取／改名与独立SQL持久化核验通过。升级后Vite→真实API代理200；这些不是Colada页面运行证据。

浏览器Chromium启动的singleton IPC socket被平台EPERM拒绝；异步workspace provision访问Unix endpoint也被拒，两bot最终failed，各attempt=1。未重试这些动作，不算完整bot／聊天通过。所有服务已于2026-10-25 19:09 UTC停止，新增证据与恢复保护已独立复核。

真实页面及同profile／origin／会话的旧缓存hydrate-before-refetch仍未验，生产默认不变。恢复需正常受支持的浏览器与非特权运行时能力；不重登录清缓存、不伪造缓存、不改变安全设置或重跑被拒操作。后端成果进入原采用范围，过程日志留执行记录。
