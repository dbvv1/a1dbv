# 网页拍摄模式与截图脚本

## 拍摄规范

- 拍摄模式：注入虚拟时钟，按种子开局，用固定 dt 反复调用主循环推进到指定时刻，摆到命名机位，渲染几帧预热（让 TAA、自适应曝光、阴影收敛）后截一帧。拍摄不依赖帧率和真实时间，软件渲染慢也能出图。主循环直接吃真实 dt 的作品同样适用，只要 dt 从虚拟时钟取。网页契约和脚本见下文；Unity 用 `Time.captureFramerate` 固定每帧时间，Unreal 用固定帧率启动参数（`-benchmark -fps=60`）或 Movie Render Queue，Godot 用 `--fixed-fps` 配合 `--write-movie`。
- 每个作品固定 3–4 个命名机位，对应参照里最有代表性的画面：正常游玩视角至少一个，另加一个“最大差距”视角。机位从参照图量出来（主角占屏高、地平线位置、视场角），不凭感觉摆。
- 手感看录像（即“操控证据”，测法见 [feel.md](feel.md) §5）：游戏内回放同一段输入脚本，按固定 dt 逐帧渲染成序列，ffmpeg 合成 60 fps。数“输入到第一处可见反馈”的帧数、反馈幅度和持续时间，与参照录像的同一动作逐帧对照。声音同段录下，听反馈是否和画面同帧到达。
- 每轮拍摄写进新建的独占目录，记下源码版本、机位、输入和渲染器原始字符串；渲染器分为 gpu／software／unknown，只有认得出硬件厂商的才算 gpu。固定画质档、关闭按帧率自动降级，manifest 记 `MAX_SAMPLES`、各向异性上限、纹理格式和实际画质档。云端软件图（如 SwiftShader）可用于迭代、目标图、盲评及[Skill §4](../SKILL.md#4-同机位对比非作者判定)的默认版本验收；发现硬件画面有可见差异时针对性复核。画面拍摄在 dot 云端做，不占本机，不因没有硬件 GPU 停止验收。
- **看图回路要快**：改一处到看到同机位前后图，一轮应在几分钟内。超过约半小时就先修回路：在自己的开发环境用 headless 浏览器软件渲染就地出图，拍摄做成一条可重复执行的命令，不把日常看图变成要排队、等独占 GPU 的任务。

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
- 软件渲染参数按环境已有授权启用；固定画质、关闭按帧率降级后，软件渲染图（本机或云端）可用于迭代、盲评和默认版本验收，完整 smoke 与同机位对比要求见 [SKILL §4](../SKILL.md#4-同机位对比非作者判定)。
- 录像：循环“等 `frame` 递增 → `screenshot` → `__shotNext()`”写进同一个运行目录，再 `ffmpeg -framerate 60 -i %05d.png -c:v libx264 -pix_fmt yuv420p out.mp4`。
- 拍摄模式由虚拟时钟推进，不依赖帧率，也不需要窗口在前台。

**依据**：[Playwright 浏览器文档](https://playwright.dev/docs/browsers)（`channel: 'chromium'` 的新 headless）；[RenderScreenshot](https://renderscreenshot.com/glossary/webgl-headless) 与 [Dave Snider](https://davesnider.com/gputests) 对 headless WebGL／GPU 的实测；[MDN：WEBGL_debug_renderer_info](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info)（扩展可能因隐私设置不可用）；2026-10-27 在 Windows＋RTX 5070 上实测新版 headless 取得 NVIDIA 渲染器、旧 headless shell 只得到 SwiftShader。核实 2026-10-27。
