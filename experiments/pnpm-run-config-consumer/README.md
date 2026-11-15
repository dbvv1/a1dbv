# pnpm 跨版本运行脚本：旧配置与锁文件保护

**迁移 pnpm 后先核配置是否仍被读取，不能用测试脚本退出 0 判断依赖约束保留。** 本例用公开 #16278 的旧配置形态，实跑发布 CLI：10.12.1 生成的锁包含 `overrides`；12.6.0 执行 `run test` 后删除它，12.18.0 则拒绝隐式安装、保留原锁。后者是上游已有修复，不是本仓补丁。

这里的依赖是合成 `file:` 包，`uuid` override 并未作用于已安装依赖。对照证明配置记录丢失与保锁，不证明实际降级、漏洞利用或完整用户项目的影响。

## 复跑

需要 Node 24 和分别安装的 pnpm 10.12.1、12.6.0、12.18.0。CLI 包从官方 npm registry 获取；不把不同版本装进同一个目录。随后传入对应入口：

```sh
python3 probe.py --old <10.12.1的pnpm.cjs> --before <12.6.0的pnpm.mjs> --after <12.18.0的pnpm.mjs>
```

探针验证版本、以本地包离线创建原锁，再复制两个独立项目运行真实 `pnpm run test`。断言包括退出状态、测试是否运行、override 是否保留及完整锁字节是否不变；任一不符就失败。命令最长 90 秒，缺参数退出 2。输出 `results.json` 记录本轮结果，不含机器路径。

## 采用边界与未完成项

迁移方向是把原 `pnpm.overrides` 等设置移到 `pnpm-workspace.yaml`，用与 CI 一致的版本显式安装，再跑 frozen install 与实际消费者。本轮没有完成这段迁移验收：12.18.0 显式安装报 `ERR_PNPM_STORE_DIR_OPEN_OPERATION_LOCK` / `Read-only file system (os error 30)`；指定临时 store 与 XDG 目录后仍相同，停止该入口，未更改宿主权限。其后的 `run test` 曾在安装失败警告后执行并输出 `123`，这不算安装成功。

未运行真实服务、用户项目、Windows、生命周期脚本或并发安装；没有降低 release-age / trustLockfile / build 审批策略，未在仓库配置中采用新默认。

## 来源

- [用户报告 #16278](https://github.com/pnpm/pnpm/issues/16278)，公开描述旧配置不再读取与隐式安装改锁。
- [上游部分修复 #16282](https://github.com/pnpm/pnpm/pull/16282)，维护者说明其保护隐式安装，不解决终端退出或 build placeholder 的其他问题。
- [配置文档](https://pnpm.io/settings)。

核实与 Linux 实跑：2026-11-15。此为定向补验，非完整生态广扫；官方实现、真实报告已核，其他社区未新增覆盖。
