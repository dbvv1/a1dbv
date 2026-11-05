# TypedDict 父配置串用：验各分支的实际输出

**Pydantic 2.14.3 中，同一无配置子 `TypedDict` 出现在不同父配置下时，不要只看验证是否成功；核每个分支实际保留、丢弃和拒绝的字段。** 本例让同一批公开合成记录经过 `allow`、`ignore`、`forbid` 策略，复现字段声明顺序改变结果；不同身份、各自显式配置的子类型在所测两种顺序下保持各自策略。它是具体输入验证消费者，不是完整应用、授权边界或通用安全修复。

## 实际结果

`replay.py` 调用真实 `TypeAdapter.validate_python` 与 `validate_json`，没有替换验证器。输入子记录为 `{'name': 'abcd', 'extra': 1}`：

| 组合 | 两种输入模式的实际结果 |
|---|---|
| 共享 Item，allow 在前、ignore 在后 | 两边都保留 extra，ignore 未按预期丢弃 |
| 同一共享关系，ignore 在前 | 两边都丢弃 extra，allow 未按预期保留 |
| 共享 Item，allow 在前、forbid 在后 | 两边都接受 extra，forbid 未按预期拒绝 |
| 同一共享关系，forbid 在前 | 两边都拒绝 extra，包括本应允许的分支 |
| 分别构建三个父类型的适配器 | allow 保留、ignore 丢弃、forbid 拒绝 |
| 子类型各自声明配置且使用不同类型身份 | 两种字段顺序均按各自策略处理；forbid 只报告自己的分支 |

执行退出 0 表示上述 **22 个已知行为用例**及 **16 个正常／错误类型对照**符合预期，不表示原共享模型满足业务契约。每条共享模型结果都保留在 `results.json`。正常对照仍接受合法记录，错误类型仍产生 `string_type`；未用删除输入字段、全局忽略错误或跳过验证让结果变绿。输入使用独立拷贝，并核验证没有修改调用方的数据。

## 复跑与采用

在仓库根目录创建独立环境（示例使用 Python 3.12）：

```bash
python3.12 -m venv /tmp/pydantic-config-consumer
/tmp/pydantic-config-consumer/bin/python -m pip install -r experiments/pydantic-config-consumer/requirements.txt
/tmp/pydantic-config-consumer/bin/python experiments/pydantic-config-consumer/replay.py
```

使用已有环境管理器也可以，但不要把本例依赖装进业务环境。输出含实际 Python／Pydantic／core 版本；不同 Python 补丁版本可能使这几个元数据字段不同，行为断言仍须通过。

在确需不同策略的业务分支中，参考 `AllowedItem`、`IgnoredItem`、`ForbiddenItem`：定义不同子类型并明确各自配置，再接父模型。仅给同一共享 Item 加一个统一配置，不能表达三种相反策略；调整父字段顺序也不是修复。若分支本来就独立接收，分别构建父适配器是本例另一个通过的对照，不能据此拆掉业务要求的整体验证。

## 范围与来源

2026-11-05 在 Linux／Python 3.12.14、Pydantic 2.14.3／core 2.50.4 实跑。Python 3.12 使用 `typing_extensions.TypedDict`，不照抄原报告的 Python 3.13 `typing.TypedDict`。未跑 macOS、Windows、整个上游套件、递归泛型或其他配置组合；未实现上游缓存修补，未测性能。子类型方案仅对本例策略及输入得到验证，不保证所有嵌套配置问题均消失。答案页第二读者条件未补，不升级评级。

- [使用者原报告 #14230](https://github.com/pydantic/pydantic/issues/14230)：原报告 2.11.4，2026-11-05 核仍 open。本例补测正式 2.14.3 及 forbid 分支，不把旧版报告直接当当前结果。
- [2.14.3 官方配置传播契约](https://github.com/pydantic/pydantic/blob/v2.14.3/docs/concepts/config.md#configuration-propagation)：无自身配置的 TypedDict 继承父配置，有自身配置则形成相应边界。
- [已合 #13891](https://github.com/pydantic/pydantic/pull/13891)修的是 JSON Schema 配置传播，不据“已合”宣称本次共享验证问题解决。
- [同作者缓存复用讨论 #14231](https://github.com/pydantic/pydantic/issues/14231)与已关闭尝试 [#14217](https://github.com/pydantic/pydantic/pull/14217)、[#14222](https://github.com/pydantic/pydantic/pull/14222)、[#14229](https://github.com/pydantic/pydantic/pull/14229)已查重；没有新建重复 PR 或评论。
