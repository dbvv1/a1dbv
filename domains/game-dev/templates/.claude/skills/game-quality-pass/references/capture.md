# 网页拍摄模式与截图脚本

## 游戏侧契约

拍摄模式只换时钟和相机、不改玩法；正常游玩路径不受影响。

| 参数 | 作用 |
|---|---|
| `shot=<机位名>` | 进入拍摄模式：停掉 rAF 主循环，改用虚拟时钟，相机摆到命名机位 |
| `seed=<n>`、`t=<秒>` | 按种子开局，以固定 dt（如 1/60 秒）反复调用主循环的更新函数，推进到第 t 秒；可选 `input=<名>` 回放输入脚本 |
| `frames=<n>` | 录像：从 t 起每推进一个 dt 渲染一帧，共 n 帧，每帧等脚本取走 |

- 主循环里凡是读 `performance.now()`、`Date.now()` 或 rAF 时间戳的地方都改成读同一个时钟对象；拍摄模式把它换成虚拟时钟。已有固定步长模拟层的作品直接按 tick 推进。
- 截图前额外渲染 8–16 帧预热，让 TAA、自适应曝光和阴影收敛。
- 渲染完置 `window.__shot = { ready: true, t, renderer }`，`renderer` 取自 `WEBGL_debug_renderer_info`；录像时每帧递增 `frame`，脚本截完调 `window.__shotNext()`。
- 机位表放在作品代码里（位置、朝向、视场角、分辨率），名字和 `docs/quality.md` 一致。

## 脚本起点（Playwright）

```js
import { chromium } from 'playwright';

const [base, out, shot = 'default'] = process.argv.slice(2);
const url = new URL(base);
Object.entries({ shot, seed: '1', t: '10' }).forEach(([k, v]) => url.searchParams.set(k, v));

const browser = await chromium.launch({
  channel: 'chromium',            // 新版 headless，可用 GPU；要有窗口时加 headless: false
  args: [
    '--ignore-gpu-blocklist',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
  ],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await page.goto(url.href);
await page.waitForFunction(() => window.__shot?.ready, null, { timeout: 120_000 });
const renderer = await page.evaluate(() => window.__shot.renderer);
await page.screenshot({ path: `${out}/${shot}-${/SwiftShader/i.test(renderer) ? 'sw' : 'gpu'}.png` });
await browser.close();
```

- 对比只用同类结果，定稿用 `gpu`。只有软件渲染的环境加 `--use-angle=swiftshader`；能出图但慢，适合查构图和回归，不适合定光照和材质。
- 录像：循环“等 `frame` 递增 → `screenshot` → `__shotNext()`”，再 `ffmpeg -framerate 60 -i %05d.png -c:v libx264 -pix_fmt yuv420p out.mp4`。
- 窗口在后台或被遮挡时 Chromium 会节流 rAF；拍摄模式由虚拟时钟推进，不受影响。

**依据**：[Playwright 浏览器文档](https://playwright.dev/docs/browsers)（`channel: 'chromium'` 的新 headless）；[RenderScreenshot](https://renderscreenshot.com/glossary/webgl-headless) 与 [Dave Snider](https://davesnider.com/gputests) 对 headless WebGL／GPU 的实测；2026-10-27 在桌面应用内置浏览器中观察到窗口不在前台时 rAF 2 秒仅 3 帧（渲染器为真 GPU）。核实 2026-10-27。
