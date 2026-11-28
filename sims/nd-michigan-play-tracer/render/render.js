// Captures the sim frame by frame at 60 fps and encodes ../play.mp4 with ffmpeg.
// Usage: node render/render.js [seconds=10] [fps=60]
// Needs `playwright` resolvable (preinstalled in the Claude cloud sandbox).
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');
const D = __dirname;
const SECS = parseFloat(process.argv[2] || '10');
const FPS = parseInt(process.argv[3] || '60', 10);
const N = Math.round(SECS * FPS);
const OUT = path.join(D, '..', 'play.mp4');
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(D, '..', 'index.html') + '?capture=1');
  await page.waitForFunction('window.__ready', null, { timeout: 300000 });
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', OUT], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let i = 0; i < N; i++) {
    await page.evaluate(t => window.__render(t), i / FPS);
    ff.stdin.write(await page.screenshot({ type: 'jpeg', quality: 94 }));
    if (i % 50 === 0) console.log('frame', i, '/', N);
  }
  ff.stdin.end();
  ff.on('close', () => { console.log('wrote', OUT); browser.close(); });
})();
