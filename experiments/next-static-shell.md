# 让框架反馈决定改法：标题先出，实时库存后到

**让Agent读懂错误提供的几条改法，再按需求选择，而不是只追求构建变绿。** 官方040合成任务要求商品标题立即可用、库存保持实时；原页面先await库存，再返回标题。Next16.4.3的实际生产构建先完成编译／TypeScript，再因 `/product` 的运行时数据在Suspense之外而exit1。把库存读取移入异步子组件、外包有意义的Suspense fallback后，同一命令exit0，路由标记Partial Prerender。[本仓实试：2026-10-24 UTC+8]

错误列出stream／cache／block三路，但本题不能缓存实时库存，也不能用`instant=false`接受阻塞页面。保留原`connection()`和随机库存，标题留在同步部分；[本次单文件补丁](next-static-shell.patch)正是这个选择，不是增加大流程或新Agent框架。原任务：[固定官方PROMPT](https://github.com/vercel/next.js/blob/8b583887cee277dd7036bcfdfeafbd1d6e37fc59/evals/evals/agent-040-instant/PROMPT.md)。[一手／本仓实试]

## 复制入口

前提：Node24.19.0、npm11.9.0（本次实际组合），Git、curl；公开npm依赖下载需要网络。以下从a1dbv根目录执行，只在新建的相邻工作目录运行。版本与完整传递依赖保留在本页同名前缀的package／lock文件；其中浏览器测试依赖来自原试验环境，下面不调用它们。

```sh
set -eu
REPO="$(pwd)"
WORK="$(mktemp -d "$REPO/../next-shell.XXXXXX")"
mkdir -p "$WORK/app/product" "$WORK/lib" "$WORK/tmp"
BASE=https://raw.githubusercontent.com/vercel/next.js/8b583887cee277dd7036bcfdfeafbd1d6e37fc59
for file in app/layout.tsx app/page.tsx app/product/page.tsx lib/data.ts next.config.ts; do
  curl --fail --location "$BASE/evals/evals/agent-040-instant/$file" -o "$WORK/$file"
done
curl --fail --location "$BASE/license.md" -o "$WORK/LICENSE"
cp "$REPO/experiments/next-static-shell.package.json" "$WORK/package.json"
cp "$REPO/experiments/next-static-shell.package-lock.json" "$WORK/package-lock.json"
cp "$REPO/experiments/next-static-shell.tsconfig.json" "$WORK/tsconfig.json"
cd "$WORK"
export TMPDIR="$WORK/tmp" npm_config_cache="$WORK/npm-cache" NEXT_TELEMETRY_DISABLED=1
npm ci --ignore-scripts
set +e
npm run build > original-build.log 2>&1
before=$?
set -e
test "$before" -eq 1
grep -F 'Next.js encountered uncached or runtime data' original-build.log
grep -F '/product' original-build.log
# 先读完整失败输出；基础设施失败不算本题RED。
git apply --check "$REPO/experiments/next-static-shell.patch"
git apply "$REPO/experiments/next-static-shell.patch"
npm run build > fixed-build.log 2>&1
grep -F 'Partial Prerender' fixed-build.log
```

不要运行官方`EVAL.ts`来代替上述免费构建接收：它接的是模型语义判分，本次没有调用。首次构建自动扩充了辅助tsconfig的Next类型include，随后两轮沿用；这里保存该辅助配置，不把它说成五份官方应用文件之一。原始／修后构建均有非致命partialPrefetching提示，未为清警告修改配置。[本仓运行／重放说明]

## 结果怎样解释

- **已验**：真实框架拒绝原render结构；单文件修订后生产预渲染通过；`lib/data.ts`、首页、layout和Next配置未改，未缓存库存、关闭Cache Components或加入instant opt-out。
- **未验**：软导航DOM时序、`instant()`锁内／释放后的浏览器行为、延迟提升、真实用户生产效果、模型对照与反复差分稳定性。此前headless浏览器启动因socket权限失败，没有重试该路径；不将构建通过改称浏览器通过。
- **Agent与人分工**：Agent运行实际框架检查、读取原始错误并提出最小改法；人核对“实时库存”和“标题不等待”仍是要求，而不是在三条技术上允许的路线中任选一条变绿。[本仓运行／经验]

原版页面SHA256：`ad28bf5dd9774fbd4e3657076c9c0249828ffa2f30f4750b7e1f92aed50a2155`；原数据函数SHA256：`bc05d11ddb522c46db4f9b8ceb978cc962fdc745788c22f0bb1311fc3bed3d3f`。本次不是生产用户缺陷案例；只把官方既有合成任务作为框架反馈入口的消费者，没有自行注入缺陷。

## 上游许可

补丁基于上述固定官方Next.js示例，遵循其MIT许可：

The MIT License (MIT)

Copyright (c) 2025 Vercel, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
