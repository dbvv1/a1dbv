# 存档采用：恢复可操作的对象，而不只读回 JSON

**🧪 小型进度保显式字段；确需整场景快照时，再比较现成 SaveKit。** 本例用真正 Godot 消费者比较两条已有路线：官方 JSON demo 恢复玩家与敌人，SaveKit 原 demo 恢复对象、资源、移除状态和文本。第二次修改把新局默认值 0→1，检查老玩家的 0 不被改成 1；不自建存档框架。

## 直接运行

需要 Linux x86_64、Python 3.11+、Git、官方 Godot 4.7.2（`4.7.2.stable.official.ed1daf0bf`）。引擎下载与摘要沿 [原生作者实验](../godot-scene-authoring/README.md)。固定现成源码：

```bash
git clone https://github.com/fernforestgames/godot-savekit.git /path/to/savekit
git -C /path/to/savekit checkout 9ca2dabdfd24712a2ad60b76d0a04e5a981b6e4a
python3 run.py \
  --godot /path/to/Godot_v4.7.2-stable_linux.x86_64 \
  --savekit-source /path/to/savekit \
  --work-dir /path/to/external-workspace/evidence
python3 -m unittest discover -s . -v
```

源码必须是该提交且无 tracked 差量；程序只复制跟踪文件，不改传入仓库。SaveKit 的 GitHub 自动 archive 受 `.gitattributes export-ignore` 影响，只含 addon，没有 demo，所以不能拿该 ZIP 当完整项目。运行复制完整 demo／插件与许可，不带可选 GUT 测试／CI；没有运行上游整套测试的声明。

官方样例从固定 release `4.7-6ad6167` 的 `loading_serialization.zip` 下载，46,396 bytes，SHA-256 `7411444c576b9b0d1cb44fb5eea8d8c88f912497f4448778357ca3e69caf6f3e`；已有文件可传 `--official-archive /path/to/loading_serialization.zip`。两项目各自真实 `--import`，随后每一步由新原生进程从项目主场景启动。HOME/XDG/TMPDIR 和合成存档只在指定工作目录的新 `run-*` 内（建议放在知识库外的磁盘 workspace，保留上游说明与运行证据，不占 `/tmp`）。

SaveKit 运行副本把已有 SaveManager autoload 显式指向原 `res://addons/savekit/save_manager.gd`；不启动可选编辑器插件，避免把首次导入的 UID 推断和运行时存档混为一谈。原插件实现保持逐文件摘要不变；不以更换 serializer 或假 provider 使检查通过。

## 读者能实际采用什么

| 原消费者 | 运行与接收 |
|---|---|
| 官方 `serialization` JSON 路线 | 通过原保存按钮保存玩家位置、63 点血量和剩余 2 个敌人；新进程按原加载按钮恢复，真实血条为 63，原玩家仍能接受移动动作 |
| SaveKit 场景／资源路线 | 调用原红框交互回调两次，调整位置、输入笔记、移除蓝框；原 SaveManager 写盘。新进程恢复红框计数 2／位置、绿框 0、笔记与蓝框缺席；红框再点变 3，重新加载原档又回 2，而非再执行一次点击 |
| 内容二改 | `BoxData.click_count` 新局默认 0→1：新局绿框为 1，旧档应仍为 0。未迁移时加载返回 OK，但真实绿框与标签都是 1，消费者明确失败 |
| 项目接入修正 | 仅在 demo 的 `BoxData` 上沿原 `load_from_dict` 补唯一旧版本的缺值含义，再用 `save_to_dict` 显式写活状态。旧档恢复绿框 0／新局仍 1；继续保存中红 3、绿 0 都有明确记录。原档摘要不变 |

这里驱动的是既有按钮信号／对象交互回调和原输入动作，不是 OS 鼠标验收。字段由原 UI／场景消费，序列化和恢复由官方实现执行；没有 Python 重建游戏状态。

## 二改为何需要项目逻辑

SaveKit 默认省略与脚本默认值相同的字段。原档绿框的 `click_count` 因为等于 0 而不存在，红框的 2 则存在。仅改新局默认值后，载入原档自然留下新的 1：格式有效和加载返回 OK 都不能代替进度正确。

本例只有一个已知旧内容版本，缺该字段表示旧 0。项目适配器先给资源设这个旧默认，再让原 deserializer 应用已存字段；以后保存总是通过原 serializer 的 `encode_var` 写 `click_count`。**这不是多版本迁移器**：正式项目继续沿 [04 的 schema／content 迁移](../../domains/game-dev/04-client-modules.md#保存续玩与升级旧档)决定缺值、改名和新对象政策，不能把所有缺值都补 0，也不能拿 SaveKit JSON 的格式 `version` 代替游戏内容版本。

实作中曾把裸 GDScript `int 0` 插进编码字典，原 `JSON.to_native` 拒绝，证明这里是编码层而非普通业务 DTO；修正没有修改 codec。原导入类型错误、未迁移失败和修正结果分别保留，接收不允许无关错误冒充预期反例。

## 实际范围

本轮完整原生链通过，4 项纯文件／进程协议测试通过；缺引擎退出 2，不 skip。读取了最终原档与续存：前者绿框字段缺省，后者明确写 0；插件核心与原档均未改。

这是自有合成存档的原生场景恢复与一个内容版本迁移，不是已发布游戏采用、目标平台断电耐久、恶意存档安全审计、云同步或视觉／真人操作验证。SaveKit 载入会删除未出现在快照里的 `saveable` 节点，节点路径仍参与定位；持续添加世界内容或重排场景时必须另定政策，不能因本例通过自动升级为通用默认。

许可：SaveKit 固定源码与官方 demo 按原 MIT 通知保留；SaveKit demo 的 Roboto Mono 带 SIL OFL 通知。代码从原仓获取，不把同名付费 SaveKit 当本项目。官方说明、固定实现与社区比较见 [WP10](../../docs/research/2026-10-14-game-wp10-client-modules.md#native-save-consumer)，核实与运行 2026-10-26。
