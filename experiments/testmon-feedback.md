# 让 Agent 用已有测试取得增量反馈

**🧪 pytest-testmon 可以直接运行已有 unittest，并在代码改动后选择关联测试；目标文件已经明确且测试很快时，直接跑该文件更简单。** 本例重放本仓真实历史修订，不新增缺陷、不修改正式检查器或 CI。[本仓局部实试，2026-10-24 UTC+8]

## 实际得到什么

固定 `4ceae6b6bedd0e9144bd4cc7d9892ef4fc003ae1` 的两份检查器及两份原测试，先建全绿映射。测试保持不变，仅换回该提交之前的 `check_public.py`：原有平台提交身份回归失败；testmon从18项中选11项，也抓到同一失败，排除另一个检查器的6项和1项其他测试。恢复修订后，所选11项通过。这里的18／11按测试方法计，unittest的subTest另计。[实试]

这教给Agent的是“先已有映射，再由实际依赖找受影响测试”，不是“看到绿灯就跳过最终验收”。本例直接跑已知目标文件只有12项；没有证据证明引入映射维护能降低这类小任务的总投入。[实试／经验]

## 最短重放

需要本仓含上述历史的Git副本、POSIX shell、Git、Python 3.12，以及仓库外虚拟环境。先在该环境从PyPI安装已测 `pytest-testmon==2.2.0 pytest==9.0.2 coverage==7.10.7`；以下在本仓根目录运行，将 `py` 改为该环境Python的绝对路径。命令只写新临时副本；其中测试会在自己的临时目录创建Git提交，使用假数据，不联网。

```sh
set -eu
repo=$(git rev-parse --show-toplevel)
py=/path/to/venv/bin/python
test -x "$py"
fixed=4ceae6b6bedd0e9144bd4cc7d9892ef4fc003ae1
trial=$(mktemp -d)
mkdir -p "$trial/case/scripts" "$trial/case/tests" "$trial/home" "$trial/hooks"
for file in scripts/check_public.py scripts/check_repo.py tests/test_check_public.py tests/test_check_repo.py; do
  git -C "$repo" show "$fixed:$file" > "$trial/case/$file"
done
cd "$trial/case"
pt() {
  env -i PATH="$(dirname "$py"):/usr/bin:/bin" HOME="$trial/home" LC_ALL=C.UTF-8 \
    PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL=/dev/null \
    GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=core.hooksPath GIT_CONFIG_VALUE_0="$trial/hooks" \
    GIT_CONFIG_KEY_1=commit.gpgSign GIT_CONFIG_VALUE_1=false \
    "$py" -m pytest -vv "$@" tests/test_check_public.py tests/test_check_repo.py
}
pt
pt -p testmon.pytest_testmon --testmon
cp .testmondata "$trial/green.testmondata"
git -C "$repo" show "$fixed^:scripts/check_public.py" > scripts/check_public.py
# 先确认真实旧版会失败；不能把运行错误当成回归失败，须核输出中的测试名。
if pt; then echo 'Expected historical regression was not observed'; exit 1; else test "$?" -eq 1; fi
cp "$trial/green.testmondata" .testmondata
if pt -p testmon.pytest_testmon --testmon; then echo 'Regression was missed'; exit 1; else test "$?" -eq 1; fi
git -C "$repo" show "$fixed:scripts/check_public.py" > scripts/check_public.py
pt -p testmon.pytest_testmon --testmon
printf 'Retained isolated replay: %s\n' "$trial"
```

旧版两次都应是 `test_agent_platform_noreply_is_exact_match` 失败；增量日志应列它为selected，并显示无关 `RepoCheckTests` 未运行。首次必须建立**全绿**映射：testmon会重跑上次失败项，从失败版本开始不能单独证明依赖选择。[实试；[官方用法](https://www.testmon.org/)]

在真实项目里，给Agent已有的 `python -m pytest --testmon` 反馈入口即可，不必新增Skill或文件路由表；记录哪些测试实际运行，交付仍走项目约定的验收。目标明确则先直接 `python -m pytest tests/test_target.py`，不为省几个测试引入插件。[经验]

## 采用边界

- **同时要外层 coverage 报告时，核实际执行记录，再决定怎样组合采集器。** 新发现的 [#270 修复与复用](testmon-outer-coverage/README.md)在真实子进程里恢复了被 testmon 暂停的外层测量：原本执行过却漏记的五行重新出现，正常选测与失败退出码保留。补丁待上游提交，按入口列出的固定环境复验；这是后续真实维护，不重跑上面的历史选测题。
- 映射来自已执行的Python代码，静态文件、外部服务及子进程消费者不能只靠这张图判断；相关变化按项目规则显式补验。已有[原生选测与扩大范围](../docs/15-task-playbooks.md#6-补测试)继续适用。[一手／经验]
- [Polylogue的实际采用](https://github.com/Sinity/polylogue/issues/1059)支持让Agent使用原生选择器，而[remote-store的暂缓报告](https://github.com/haalfi/remote-store/blob/45132599a2818fe1e02eb15c9e2016bada5a0103/sdd/research/research-bk-403-testmon-poc.md)说明收益依改动类型变化。后者沿用[此前已核记录](../docs/research/2026-10-12-development-feedback.md#新增选测能力先比较改动类型与完整运行成本)，本轮网页未重读成功；不移植两方耗时到本仓。[社区／研究]
- 当前[PyPI版本](https://pypi.org/project/pytest-testmon/2.2.0/)发布于2025-12，不冒充刚发布的前沿工具。这里只补真实操作入口，未跑模型、生产项目、完整仓库离线套件或hosted CI，不宣称Agent效率提升。[一手／实试范围]

探索回执：复用既有官方／使用方／源码对照，重核当前包版本并实际重放已知历史改动；这是已有选题的操作缺口，不扩新工具排名或边界测试系列。
