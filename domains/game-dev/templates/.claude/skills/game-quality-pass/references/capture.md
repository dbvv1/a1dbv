# 网页拍摄模式与截图脚本

## 游戏侧契约

拍摄模式只换时钟和相机、不改玩法；正常游玩路径不受影响。

| 参数 | 作用 |
|---|---|
| `shot=<机位名>` | 进入拍摄模式：停掉 rAF 主循环，改用虚拟时钟，相机摆到命名机位 |
| `seed=<n>`、`t=<秒>` | 按种子开局，以固定 dt（如 1/60 秒）反复调用主循环的更新函数，推进到第 t 秒；可选 `input=<名>` 回放输入脚本 |
| `frames=<n>` | 录像：从 t 起每推进一个 dt 渲染一帧，共 n 帧，每帧等脚本取走 |

- 主循环里凡是读 `performance.now()`、`Date.now()` 或 rAF 时间戳的地方都改成读同一个时钟对象；拍摄模式把它换成虚拟时钟。已有固定步长模拟层的作品直接按 tick 推进。输入脚本由游戏自己回放，拍摄端不模拟键鼠。
- 截图前额外渲染 8–16 帧预热，让 TAA、自适应曝光和阴影收敛。
- 渲染完置 `window.__shot = { ready: true, t, renderer, build }`：`renderer` 是 `WEBGL_debug_renderer_info` 的原始字符串（扩展不可用时为空串），`build` 是源码提交或 bundle 文件名。录像时每帧递增 `frame`，脚本截完调 `window.__shotNext()`。
- 机位表放在作品代码里（位置、朝向、视场角、分辨率），名字和 `docs/quality.md` 一致。

## 脚本起点（Playwright，headless：无可见窗口、不模拟键鼠）

```js
import { chromium } from 'playwright'; // ≥1.49：channel 'chromium' 才是可用 GPU 的新版 headless
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// node capture.mjs <页面地址> <输出根目录> <机位1,机位2,...>
const [base, outRoot, shotList = 'default'] = process.argv.slice(2);

// 只有认得出硬件厂商的才算 gpu；空串和隐私泛称记 unknown
const classify = (r) =>
  /swiftshader|llvmpipe|softpipe|software|basic render/i.test(r) ? 'software'
  : /nvidia|geforce|radeon|amd|intel|apple|adreno|mali/i.test(r) ? 'gpu'
  : 'unknown';

// 一轮一个独占目录，所有机位写进同一目录；已存在就报错，不混入旧帧
const runDir = join(outRoot, new Date().toISOString().replace(/[:.]/g, '-'));
mkdirSync(runDir, { recursive: false });

const browser = await chromium.launch({ channel: 'chromium', args: ['--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const shots = [];
for (const shot of shotList.split(',')) {
  const url = new URL(base);
  Object.entries({ shot, seed: '1', t: '10' }).forEach(([k, v]) => url.searchParams.set(k, v));
  await page.goto(url.href);
  await page.waitForFunction(() => window.__shot?.ready, null, { timeout: 120_000 });
  const { renderer, build, t } = await page.evaluate(() => window.__shot);
  const cls = classify(renderer);
  await page.screenshot({ path: join(runDir, `${shot}.png`) });
  shots.push({ shot, url: url.href, t, build, renderer, class: cls });
}
writeFileSync(join(runDir, 'manifest.json'), JSON.stringify(shots, null, 2));
await browser.close();
```

- 对比只用 manifest 里同一 `class` 的结果。`outRoot` 要先存在。
- 只有软件渲染的环境加 `--use-angle=swiftshader`（新版 Chromium 可能还要 `--enable-unsafe-swiftshader`）；画质档固定、关闭按帧率降级后，静帧可用于迭代和盲评，口径见 SKILL §1。
- 录像：循环“等 `frame` 递增 → `screenshot` → `__shotNext()`”写进同一个运行目录，再 `ffmpeg -framerate 60 -i %05d.png -c:v libx264 -pix_fmt yuv420p out.mp4`。
- 拍摄模式由虚拟时钟推进，不依赖帧率，也不需要窗口在前台。

**依据**：[Playwright 浏览器文档](https://playwright.dev/docs/browsers)（`channel: 'chromium'` 的新 headless）；[RenderScreenshot](https://renderscreenshot.com/glossary/webgl-headless) 与 [Dave Snider](https://davesnider.com/gputests) 对 headless WebGL／GPU 的实测；[MDN：WEBGL_debug_renderer_info](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info)（扩展可能因隐私设置不可用）；2026-10-27 在 Windows＋RTX 5070 上实测新版 headless 取得 NVIDIA 渲染器、旧 headless shell 只得到 SwiftShader。核实 2026-10-27。
