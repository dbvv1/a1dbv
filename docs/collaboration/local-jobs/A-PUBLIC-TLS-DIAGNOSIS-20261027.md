# A-PUBLIC-TLS-DIAGNOSIS-20261027 · 公开网页 TLS 分层只读诊断
id: A-PUBLIC-TLS-DIAGNOSIS-20261027
owner: dot-A
status: review_ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bc17d1d2b9983b7e255d03fc7c16ce5fdcf2d68c
result_branch: relay/a-public-tls-diagnosis-20261027

## 目标
给出已有本机失败发生在哪一层、能否定根因及下一步最小解决动作；不是恢复网络设置或继续搜帖。
已知历史：本机 curl exit 35、Python unexpected EOF、Chrome connection closed，未见 HTTP 响应；云端可读不能证明本机已修复。

## 按哪个 Skill 或规格做
1. 读最新 main 的 `AGENTS.md`、`CLAUDE.md`、`docs/collaboration/operations.md` §2.2／§3 与本目录 README，按 `build` 原生 Workflow 实施和独立审查；审查不重复联网。
2. 复用 A-COMMUNITY-PRACTICE-SCAN-20261027 已有公开失败摘要；先标已有证据和缺口，只为补缺失分层证据运行一次诊断，不重做同条件取页失败。
3. 仅用既有 curl、Python 等；Python 仅作有界进程包装／摘要过滤，不新增直连路径。无需安装、升级或调用新服务。
4. HTTPS 目标仅 `https://linux.do/latest`、`https://www.v2ex.com/go/programmer` 与公开对照 `https://github.com/`；不扩展域名、端口、IP 或登录入口，不跟随重定向。
5. 保持既有获准网络路径与正常证书校验；匿名请求，不加载个人 curl 配置、Cookie、会话或认证头，不读取／输出代理配置。现有路径若要求额外凭据则停止，不新增或导出凭据。
6. 每目标最多一次有新增分层证据的请求，单次硬超时 20 秒、整体诊断最多 5 分钟；无自动重试，已有同等证据的目标跳过。只清理本任务启动的超时子进程。
7. 请求丢弃正文与响应头；在内存中仅提取工具／TLS 库版本、UTC 时间、目标公共域名、退出码、DNS／连接／TLS 耗时、证书校验结果、HTTP 状态及脱敏错误类别。禁用 verbose／trace／抓包，原始 stderr 不落盘、不回显。
8. curl 6 支持 DNS 解析失败分类；7 支持连接失败；35 仅支持 TLS 握手失败；60 等须结合校验错误判证书问题。28 结合阶段计时，无法定位就写超时层未知；经代理时连接计时不证明已直达源站。
9. 收到 HTTP 响应才判 HTTP 层；403／429 等与握手失败分开，3xx 仅记重定向未追踪；状态 000 不算服务器响应。GitHub 成功仅说明该对照路径可用，不证明站点或所有网络正常。
10. 不将 EOF／断连推定为墙、代理、服务端或证书问题；证书信息仅保留校验错误类别，不输出完整证书、内部签发者或网络地址。根因不足写“未知”与能区分候选的最小新增证据。
11. WebFetch 的安全域名校验拒绝不重试；遇任何明确安全／权限拦截停止相应目标，不换工具、身份、代理、VPN、IP 或协议绕过，也不关闭 TLS 校验。
12. 不改 DNS／代理／VPN／证书信任／TLS 校验／安全软件；不读私人会话、账号用量、环境变量或公司网络信息，不输出用户名、本机路径、代理凭据和内部地址。
13. 解决建议须依证据分层：DNS／TCP／网络策略由用户或网络管理员处理，证书问题保留校验并建议检查时间／官方信任链，HTTP 拒绝按站点正常流程；均不代改、不盲目推荐关闭安全措施。

## 写入范围
模型唯一产物：`docs/collaboration/local-jobs/artifacts/A-PUBLIC-TLS-DIAGNOSIS-20261027/diagnosis.md`；先写可用结论和最小解决动作，再列脱敏证据表、未知与缺失证据，不写原始日志。
接收端只另更新本任务状态／当前结果，提交与公开扫描由脚本做；不改接收端、正文、TASKS 或任何网络配置。
仅推指定 relay 分支，回 `review_ready`，不设 `accept: auto`、不合入 main；模型本身不提交或推送。

## 怎样算做成
读者能区分 DNS、连接、TLS、证书与 HTTP 层，且结论强度匹配证据；无根因也交有用的已排除项和最小待证，不安排监控或重复探测。
按固定 Workflow 独立审查，运行适用 `check_repo`、`check_public` 与空白检查；推送前人工复核唯一产物不含私人数据。
受阻写明具体 action、target、reason、status 和恢复条件，区分未运行、失败、通过；回传固定提交与产物链接，不把领取或云端成功写成修复。

## 当前结果

- 已完成公开网页 TLS 分层只读诊断：DNS 与 TCP 建连成功，TLS 握手在约 5.0 秒时未完成、无证书校验结果和 HTTP 响应，同机到 github.com 的对照返回 200，根因记为未知；建议由网络管理员按 2026-10-27 10:31 UTC 时间窗核对网关侧握手记录，不要关闭 TLS 校验或改网络配置。审查三视角通过，openIssues 为 0。
- 产物：[da69756](https://github.com/dbvv1/a1dbv/commit/da69756dbbcedbae90aa9b8c48172d8e29914559)，分支 `relay/a-public-tls-diagnosis-20261027`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：本任务无剩余工作单元，交由接收端提交与更新任务状态。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
