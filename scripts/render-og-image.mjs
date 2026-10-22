#!/usr/bin/env node
/**
 * 1200×630 Open Graph card: the hero's night Earth (captured from the live
 * scene) cropped on the right, name and title on the left.
 *
 *   bun run dev        # in another terminal
 *   bun run assets:og  # → public/og-image.png
 */
import { writeFile } from 'node:fs/promises';
import { captureEarth, DEFAULT_URL, launchBrowser } from './lib/captureEarth.mjs';

const url = process.argv[2] ?? DEFAULT_URL;
const WIDTH = 1200;
const HEIGHT = 630;
/** Earth box (sphere ≈ 79% of it), centered off the right edge. */
const EARTH_BOX = 920;
const EARTH_CENTER = { x: 1030, y: 320 };

const browser = await launchBrowser();
try {
  const earth = await captureEarth(browser, { url, size: 1600 });
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html>
<html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; position: relative;
    font-family: Inter, system-ui, sans-serif; color: #f2ebe0;
    background: radial-gradient(110% 90% at 78% 50%, #090b12 0%, #05060a 62%);
    -webkit-font-smoothing: antialiased;
  }
  img {
    position: absolute;
    width: ${EARTH_BOX}px; height: ${EARTH_BOX}px;
    left: ${EARTH_CENTER.x - EARTH_BOX / 2}px; top: ${EARTH_CENTER.y - EARTH_BOX / 2}px;
  }
  .copy { position: absolute; left: 80px; top: 0; bottom: 0; display: flex;
    flex-direction: column; justify-content: center; gap: 28px; }
  h1 { font-size: 78px; font-weight: 600; letter-spacing: -0.055em; line-height: 0.9; white-space: nowrap; }
  p { font-size: 34px; font-weight: 400; letter-spacing: -0.01em; }
  .micro { position: absolute; left: 80px; bottom: 56px; font-size: 15px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: #8b93a7; }
</style></head>
<body>
  <img src="data:image/png;base64,${earth.toString('base64')}" alt="">
  <div class="copy"><h1>Gabriel Andrade</h1><p>Senior Full Stack Engineer</p></div>
  <span class="micro">andradegabriel.com</span>
</body></html>`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await document.querySelector('img').decode();
  });
  const png = await page.screenshot({ type: 'png' });
  await writeFile('public/og-image.png', png);
  console.log(`public/og-image.png  ${png.length.toLocaleString()} B`);
} finally {
  await browser.close();
}
