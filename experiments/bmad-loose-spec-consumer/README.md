# BMAD loose specs：消除文件冲突还不等于完成迁移

**多个 loose spec 共用伴随文件名时，先保留原件，暂缓直接采用受测 `--fold-specs`。** 只把伴随文件改名可以消除冲突，却仍把两份历史合进同一 topic 的日志；把故事文件移进各自子目录，又会让现有 tickets 消费者看不到它们。本轮没有发布新的布局或修复。

## 从现有未完成项接续

这是[此前 #3142 实测](../bmad-migration-receipt/README.md)明确留下的另一个问题 [#3143](https://github.com/bmad-code-org/BMAD-METHOD/issues/3143)。本次另取官方 dev `7687d077f8457bb34a23a6bfa2cc797c0f23b16f`，不接管旧树、不叠加旧补丁；issue仍开放、无指派和评论。查了全部18个开放PR及最近100个关闭PR，覆盖该issue提出前后，没有发现同题修复；不是全历史穷尽检索。

按原报告创建 pay、ship 两个 spec，各带 `DESIGN.md`、自己的 `.memlog.md` 与不同历史，再运行真实迁移 CLI：

| 操作 | 实际结果 |
|---|---|
| 原样首次 fold | exit 0，pay成功，ship因同名DESIGN冲突留在原位置；JSON有1个problem |
| 只把ship伴随文件及其声明改名，再fold | exit 0，ship成功，problems为空；两份历史却都写入`topic: pay`的共享日志 |
| 两个平铺story交给真实tickets status | exit 0，列出两个故事 |
| 复制相同项目，仅把每个story文件移入各自同名子目录 | exit 0，列出零个故事；文件仍在，没有被删除 |

最后一组是对一种候选布局的隔离探针，**不是原产品主动把故事移走，也不是已实现的迁移补丁**。对照保持相同`_bmad-output/backlog`目录结构、元数据、文件内容及其他文件，只改变story文件位置。它说明“给每个故事建目录”不能未经消费者适配就采用；不否定保留平铺story、单独隔离伴随文件等其他设计，这些方案尚未实现或验收。

当前源码的`load_folder`只扫描该层`*.md`，和[票据树契约](https://github.com/bmad-code-org/BMAD-METHOD/blob/7687d077f8457bb34a23a6bfa2cc797c0f23b16f/tools/ticket-tree-rules.md)中backlog叶文件直接放本层一致。修复须同时定下日志归属、伴随文件路径及生产消费者读取方式，不能为了局部迁移变绿擅改共享布局。

## 可复跑入口

```sh
git clone --branch dev https://github.com/bmad-code-org/BMAD-METHOD.git source
git -C source checkout --detach 7687d077f8457bb34a23a6bfa2cc797c0f23b16f
python replay.py --source source --work replay-output
```

Python 3.11+、Git即可；`work`必须不存在且在源码树外。脚本核固定提交与skills已跟踪内容未改，只在新的合成输出树运行原迁移和tickets CLI；每次子命令限时30秒。断言两个错误与平铺正对照，输出 [results.json](results.json)。本轮 Python 3.12.14／Linux 实跑；没有安装Skill、调用模型、处理真实工作记录或改上游源码。

没有跑完整BMAD测试、Windows/macOS、所有迁移模式、`find/mark/move`或完整开发流程。原 #3142 隐藏文件丢失问题仍在受测源码中，本例没有带隐藏伴随文件，不能以此覆盖其保全限制。该预览版行为不外推到稳定v6.12。

[贡献规范](https://github.com/bmad-code-org/BMAD-METHOD/blob/7687d077f8457bb34a23a6bfa2cc797c0f23b16f/CONTRIBUTING.md)要求面向dev、AI辅助需重度人工审阅、较大布局变更先与维护者确认；本次没有外发评论或PR，不将自动复核当作该人审要求已满足。来源还包括[固定迁移实现](https://github.com/bmad-code-org/BMAD-METHOD/blob/7687d077f8457bb34a23a6bfa2cc797c0f23b16f/skills/bmad/scripts/migrate_v6.py)、[固定tickets消费者](https://github.com/bmad-code-org/BMAD-METHOD/blob/7687d077f8457bb34a23a6bfa2cc797c0f23b16f/skills/bmad-agent-po/scripts/tickets.py)。核实与实跑：2026-11-05 UTC。
