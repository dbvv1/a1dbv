# 已有模拟结果与录制输入

按 A 原任务的实际接收请求，从 B 首版修订已有产物原样取回；没有重新跑批或生成样例。绑定与缺失记录见 [manifest.json](manifest.json)。

- [200 局](v2-200-seed1.json)：内容 v2，seed 1–200，199 终局、1 超时。
- [500 局](v2-500-seed1.json)：内容 v2，seed 1–500，499 终局、1 超时。
- [高对低 100 局](v2-high-vs-low-100-seed1.json)：内容 v2，seed 1–100，超时仍留分母。
- [正常整局录制](v2-seed1-complete-replay.json)：内容 v2、seed1，含完整命令流和终局哈希；由固定版本的 `replayMatch` 消费，不能仅对照录制头哈希。

原 Workflow 的 UTC 起止保留在 manifest；这些原文件未分别保存每条命令的 UTC／退出码，复现命令只由已存 options 推出，不冒称原始 shell 记录。独立审查确实重放了三个超时例，但只保存工具 stdout，没有序列化超时 replay JSON，本目录不补造。GC 修复前的旧终局哈希与当前哈希不兼容，实际选择见 [B 原任务](../../B-MOBA-SIMULATION-001.md)。

范围是首版无画面模拟及接收证据；模拟后续已交 dot-B 云端单元独占。
