# 公开路径漏检：真实输入回归

id: A-PUBLIC-PATH-REGRESSION-001
owner: dot-A
status: accepted
accept: auto
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 16186164dc08ba9821841d317d8e3903d3c44914

## 已交回

[采用记录](../../../experiments/scratch-path-scan-adoption.md)：旧发布卡的具体云实例路径漏检已用原输入复现并补窄规则；普通工作区／占位符／相对路径保留。只改检查器、对应测试与本记录，不扩秘密扫描或改历史档案。

Hypothesis 临时校准未发现额外反例，最终保留原生 unittest，不引入常驻依赖。原输入从退出 0／零命中变为退出 1／一个命中，15 项原生回归通过。

## 接收

完整 offline 19 阶段通过，非作者代码／方法审查及 fresh 读者检查通过；原超时与同代码重跑事实见采用记录。root 串行整合发布，采用取舍交任务路线 owner 接收。
