# Audit Wave Register

## 当前波次

| 波次 | 目的 | 状态 | 汇总 |
|---|---|---|---|
| Wave 1 | 五个领域现状基线审计 | 3 份保留、2 份按修订 Brief 重新审计 | synthesis/WAVE-1-SYNTHESIS.md |

## Wave 1 审计席位

| ID | 领域 | Brief | 报告 | 状态 | Commit |
|---|---|---|---|---|---|
| W1-AI | AI Coding 前沿与 M6 | briefs/AI-CODING.md | reports/WAVE-1-AI-CODING.md | 已完成，待综合 | 原审计分支 |
| W1-GAME | 游戏知识与 AI 制作链 | briefs/GAME-KNOWLEDGE.md | reports/WAVE-1-GAME-KNOWLEDGE.md | **范围修订，需按新 Brief 重新审计** | 原报告保留，不作为最终基线 |
| W1-FPS | FPS-Like | briefs/FPS.md | reports/WAVE-1-FPS.md | 已完成，待综合 | 原审计分支 |
| W1-MOBA | MOBA-Like | briefs/MOBA.md | reports/WAVE-1-MOBA.md | **目标/阶段修订，需按新 Brief 重新审计** | 原报告保留，不作为最终基线 |
| W1-STAR | Star-Rush-Reborn | briefs/STAR-RUSH.md | reports/WAVE-1-STAR-RUSH.md | 已完成，待综合 | 原审计分支 |

## 本轮修订说明

- 游戏知识：当前生产验证主线是 Web 快速开发和 AI 全链路制作；Unity/Unreal 是知识储备/未来扩展，不是当前原生引擎交付目标。
- MOBA-Like：产品定位是约 10 分钟单线 MOBA/大乱斗；当前阶段 A 是一段高质量核心战斗，阶段 B 才是离线单线 5v5（1 玩家 + 9 机器人），阶段 C 才是海克斯式增强和内容扩展。
- 原报告保留作为历史审计记录；GPT 02、GPT 04 必须按更新后的 Brief 和强化版 AUDIT-PROTOCOL 重新审计，提交新的 revision 报告，不覆盖旧报告。
- 新报告建议路径：`reports/WAVE-1-GAME-KNOWLEDGE-REV2.md`、`reports/WAVE-1-MOBA-REV2.md`。

## 完成定义

报告已保存或明确交回；记录审计时 main SHA 和证据；未验证事项明确标记；任务候选与 TASKS/inbox 去重。未被领域负责人接受的建议仍是候选。

## 波次关闭

五份最终报告完成后整合到 synthesis。Claude 核心处理方向/规则争议，Dot-A/B 分别决定领域内容建议。只有被接受的建议才进入现有 TASKS/local-jobs。
