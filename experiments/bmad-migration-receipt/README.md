# BMAD：迁移后还要让下一项工作读得回来

**⛔ 现有 pre-release spec 带隐藏稿、`.working/` 或 `.tmp` 时，暂缓直接用受测版本的 `--fold-specs`：它退出 0、`problems=[]`，仍会静默删掉这些文件。**
**🧪 本地两文件候选在同一输入上保全了内容，并让生产 tickets CLI 继续读取、选择任务、更新既有计划再读回；仅接受 #3142 范围。**
**本次测的是 v7 preview alpha 的 `6.13.0-next`，不是稳定 v6.12，也不是整套 v6→v7 或模型开发流程。**

## 从真实未完成需求开始

BMAD-METHOD 是约 5.49 万 Star 的结构化 AI 开发项目，源码为 MIT，另有商标说明。公开 #3142 报告 `fold_spec` 跳过点文件／目录和 `.tmp`，随后递归删除 spec 文件夹，正常退出且报告没有列出损失。用户要求把剩余项移动过去，或明确停止并保留原件。

本次固定当前 main 与 dev，确认这段脚本相同；在 dev 的独立副本做最小修复：移动除 spec 主文件和 `.memlog.md` 之外的所有条目，沿用写入前的目标同名检查；结尾只删除空目录。没有改 ticket 格式、链接算法或其他迁移模式。原先断言丢弃 `.DS_Store` 的测试改成冲突时完整树不变，而不是删掉旧断言来凑通过。

## 验收到下一位实际消费者，而不是停在文件移动

非作者先读项目规则和原需求，再独立构造一份当前 `tickets/` 布局的商店 initiative：2 条 entry、既有支付计划、第二条计划、R1、CAP-1 spec、两份 memlog、隐藏 Markdown、`.working` 下 HTML／深层二进制、无效 UTF-8 的 `.tmp`、普通 notes、archive 和邻接 initiative。迁移前保存完整源副本及逐文件哈希；两版本接收同样输入。

```text
完整源备份 → 实际 fold CLI → 逐文件去向／内容核对
→ 生产 tickets status / next / find
→ mark in-progress → find / status 再读
→ 再次 fold、冲突与缺输入对照
```

| 真正观察的结果 | 原版 dev | 本地候选 |
|---|---|---|
| 隐藏稿、HTML、深层二进制、tmp | 4 个源文件丢失，但 exit 0／`problems=[]` | 全部保留；HTML／二进制／tmp 字节相同 |
| 原 17 个文件的去向 | 缺上述 4 件，完整原件仍在本次备份 | 全部有目标或明确合并转换；不是“17 件都原样复制” |
| Markdown 与需求 | 原可见路径仍转换 | 旧 R1 保留，CAP-1→R2；隐藏稿及普通 notes 的 spec 链接正确改指 initiative |
| memlog 与邻接对象 | 未以其成功替代文件保全 | 旧日志→spec 日志→fold 事件按序；archive、邻接 initiative、第二计划不变 |
| 后续生产消费者 | 未作为候选通过证据 | status／next／find 读到同一 entry；mark 后只既有 `ticket: 1` 计划状态改变，读回身份、路径及 R2 一致 |
| 重复迁移 | 不用重跑去“恢复”已丢源文件 | 第二次 `folded=[]`／`problems=[]`，全树哈希不变 |
| 隐藏或 tmp 同名冲突 | 原筛选会漏掉这些项 | 具名 `problems`，整树不变，**退出码仍为 0** |
| 缺少 store | — | exit 1，保留错误输出 |

`mark in-progress` 是合成计划的状态读写验证，不表示软件任务已经完成。所有失败只发生在自有夹具；消费者未读取真实项目或私人会话。

## 读者真正要保留的选择

**先保全输出树，再迁移；接收时同时读 JSON 和下一位工具的输入。** 上游 guided migration 本就要求完整源备份，但直接 `--fold-specs` 不会替你备份；`--clean` 对 `_bmad` 的备份也不是输出树备份。只看到退出 0 或新 ticket 存在，无法发现本次内容损失。

冲突预检失败可以保持全树原样，运行到末尾才失败则不同。本地候选的 `rmdir` 会保留晚到／遗漏文件并报错，但前面的 ticket 改写、memlog 合并、部分移动乃至 spec 主文件删除可能已发生；它不是事务或自动恢复工具。单测用局部 move 故障注入核这个停点，未验证真实并发／进程中断。

保留内容会把同名隐藏元数据变成明确冲突，不会替读者合并或丢掉 `.DS_Store`。多个 loose specs 共用 backlog memlog／伴随件冲突是另一开放问题 #3143，本次未修；不把这份候选作为全量升级方案。当前公开的是选择与实证，未发布上游补丁、安装指南或新默认。

## 检查、失败与保全

| 检查 | 实际结果 |
|---|---|
| 原迁移 unittest | 29 通过 |
| 新回归配原生产代码 | 2 failures、1 error，先复现再修 |
| 候选迁移 unittest | 32 通过；两文件 Ruff lint／format 及空白检查通过 |
| 完整 Python suite，原 dev／候选 | 1063／1066 通过；**两版同样 7 个 renderer 子例失败、1 跳过**；各 167 个子测试通过 |
| 候选静态验证 | 文件引用、Skill、manifest 三入口通过 |
| 非作者 | 源码／回归范围审通过；独立生产 CLI 消费限定通过 |

完整套件按原默认并行入口运行，没有缩成定向绿灯。失败来自 `uv run --no-cache` 在显式离线环境找不到脚本所需 Jinja2，虽开发环境中已装好；跳过是没有可选 tiktoken。未为通过这些路径临时联网，也没有修改 renderer。上游固定 dev 头的 5 个 checks 成功，不涵盖本地候选；本地补丁无 hosted CI、Windows 或 docs-site aggregate 验收。未加载 Skill／Hook、调用模型或安装到用户机。

依赖准备初次因环境没有项目默认 Python 3.11 停止，明确选用满足 `>=3.11` 的现有 Python 3.12.14 后，按 frozen lock 在独立环境安装了开发依赖。消费者的补充校验器一度把成功 `status` 的可选 `problems` 当作必有字段；原错误保留，只修 accessor，未改生产源码或夹具。源码、完整输入、原失败、候选及 Git bundle 已离线归档并回读校验；原归档未审核为可公开上传。

**依据**：官方 [项目与预览说明](https://github.com/bmad-code-org/BMAD-METHOD/tree/bd70c643a7ec85d1ec2e88076b3fbdd8e4517f41)、[迁移脚本](https://github.com/bmad-code-org/BMAD-METHOD/blob/499008ea97c53436e7c7fa598a4a25e7bb869e07/skills/bmad/scripts/migrate_v6.py)、[完整备份与迁移契约](https://github.com/bmad-code-org/BMAD-METHOD/blob/499008ea97c53436e7c7fa598a4a25e7bb869e07/skills/bmod-method/migration-1.toml)、[真实使用者 #3142](https://github.com/bmad-code-org/BMAD-METHOD/issues/3142)与相邻未解决的 [#3143](https://github.com/bmad-code-org/BMAD-METHOD/issues/3143)，加本仓隔离真实消费。核实 2026-11-02；定向覆盖，不据 Star 或一次试验推荐整套方法。固定版本与结果见 [results.json](results.json)，长程页仍为 🟡。
