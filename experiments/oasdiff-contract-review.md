# 把 OpenAPI 变化变成 Agent 可定位的审查输入

核实与本地执行：2026-10-24（UTC+8）。仅 Linux x86_64 CLI、公开文件、无模型、无运行服务。

## 结论

🧪 维护公开 OpenAPI、又缺少版本兼容反馈时，可让 Agent 先运行 `oasdiff breaking 已发布.yaml 本次.yaml --fail-on ERR --format json`，把 rule id、HTTP operation、字段和源码行号交给下一步判断，而不是再问一次模型“有没有破坏兼容”。本次真实案例也说明：红诊断不是修复指令，不能让 Agent 自动删掉新校验来保绿。

## 固定真实案例

InvenTree [PR #13023](https://github.com/inventree/InvenTree/pull/13023) “[bug] Handle length limitation for notes fields”，2026-10-17 合并，merge SHA `a5895adcac3c24ce3efad6b380b0a11e2bf4c21c`。作者说明：stock actions 的 notes 未在 API/serializer 层校验长度，超长值造成低层 DB 错误。PR 将 API 558 升为 559。

[固定 stock/models.py](https://github.com/inventree/InvenTree/blob/a5895adcac3c24ce3efad6b380b0a11e2bf4c21c/src/backend/InvenTree/stock/models.py) 把原有数据库字段 max_length=512 提为 NOTES_MAX_LENGTH 常量；[serializers.py](https://github.com/inventree/InvenTree/blob/a5895adcac3c24ce3efad6b380b0a11e2bf4c21c/src/backend/InvenTree/stock/serializers.py) 使用它增加请求校验；[test_api.py](https://github.com/inventree/InvenTree/blob/a5895adcac3c24ce3efad6b380b0a11e2bf4c21c/src/backend/InvenTree/stock/test_api.py) 新增超长 notes 返回 400 与字段错误的测试。这里阅读了测试定义，没有执行 InvenTree 测试，也没有验证历史运行行为。

发布 schema 来自官方 inventree/schema，固定仓库 SHA `9f0a80b55786d6f85f439f3f7d585f799ff09f46` 下 export/558/api.yaml 和 export/559/api.yaml。使用完整发布文件，不手造字段、不裁剪成合成接口。

## 可复制入口

先从 [官方 v1.34.0 release](https://github.com/oasdiff/oasdiff/releases/tag/v1.34.0) 下载对应平台二进制，并核对 checksums.txt。本次 Linux x86_64 tar.gz SHA256：`7c88e09fd500b231af2819eb21f6fdfc7bcdfe2741d2c1937c59e7b72c8a575a`；实际 `./oasdiff --version` 输出 `oasdiff version 1.34.0`。下列命令需要curl、sha256sum、jq，假定空白实验目录中已有核验过的可执行文件；不把下载产物加入知识库。

```sh
set -eu
SCHEMA=9f0a80b55786d6f85f439f3f7d585f799ff09f46
curl -fL "https://raw.githubusercontent.com/inventree/schema/$SCHEMA/export/558/api.yaml" -o 558.yaml
curl -fL "https://raw.githubusercontent.com/inventree/schema/$SCHEMA/export/559/api.yaml" -o 559.yaml
printf '%s  %s\n' \
  7d93e53dab25a16e8b306fe275c45d5c68127ea64ef4a1f062036903b64e4fb4 558.yaml \
  192b64e1c0e50eca93473906ac6410914f21548f20369c31ed04bd7cc4bb5110 559.yaml | sha256sum -c -
status=0
./oasdiff breaking 558.yaml 559.yaml --fail-on ERR --format json > breaking.json 2> breaking.stderr || status=$?
test "$status" -eq 1
test ! -s breaking.stderr
jq -e 'any(.[]; .id == "request-property-max-length-set" and .operationId == "stock_add_create" and .path == "/api/stock/add/")' breaking.json
# 预期有真实诊断；不能只凭 exit 1 把下载、解析或运行错误算成检测成功。
```

实际输出包含：

```json
{
  "id": "request-property-max-length-set",
  "text": "the `notes` request property's maxLength was set to `512` (media type: application/json)",
  "level": 3,
  "operation": "POST",
  "operationId": "stock_add_create",
  "path": "/api/stock/add/",
  "revisionSource": {"file": "559.yaml", "line": 43665, "column": 11}
}
```

这是完整 JSON 中一条真实诊断的字段摘录。完整结果有 66 条同规则诊断，涉及多个字段、端点及三种媒体类型，不等于 66 个独立缺陷。本地同文件校准 `./oasdiff breaking 559.yaml 559.yaml --fail-on ERR --format json` 得 exit 0、`[]`。两个调用 stderr 均为空。没有扩其他场景矩阵。

文件校验：
- 558.yaml SHA256 `7d93e53dab25a16e8b306fe275c45d5c68127ea64ef4a1f062036903b64e4fb4`
- 559.yaml SHA256 `192b64e1c0e50eca93473906ac6410914f21548f20369c31ed04bd7cc4bb5110`

## 一个有意义的选择

把 JSON 和 PR 原因一起给 Agent：

> 比较基线是已发布契约，不是仅 HEAD~1。先列影响的旧请求与定位，再检查变更意图及提供方约束。若是意外收紧，恢复兼容；若是有意补齐约束，保留合理验证并交付版本/迁移说明和需要负责人接受的兼容性变化。不要通过删校验、改基线或整体降级规则偷偷保绿。实现和消费者验收另保留，不以 schema 诊断代替。

本例契约原先允许的输入集合确实被收紧，但数据库此前已经有限制；“旧声明允许超长”不等于“旧服务曾成功支持超长”。因此 oasdiff 诊断成立，合并修复也可能合理，二者不矛盾。只在确定项目对旧客户端的承诺后决定兼容策略，不从工具输出直接推断产品决定。

## 来源与证据边界

- 官方：[v1.34.0 BREAKING-CHANGES.md](https://github.com/oasdiff/oasdiff/blob/v1.34.0/docs/BREAKING-CHANGES.md)，说明 breaking/changelog、ERR/WARN、fail-on 等；实际版本和诊断本地复核。
- 维护者真实反馈及固定 OSS 修复：上述 InvenTree PR 原文、合并状态、固定实现和测试定义；不是独立社区共识。
- 本地实测：完整发布声明 558→559 exit 1，559→559 exit 0；原始输出保留。
- 未证明：运行时真实失败与修复后成功、已部署消费者兼容、AI/模型收益、跨项目最佳工具排名。
- CLI 未使用 `--open` 或托管审查。官方说明 `--open` 会上传比较供分享，不应把它无意加入本地审查入口。
