/**
 * Captures the live hero Earth (the real Three.js scene, real textures)
 * as a transparent square PNG. Needs the dev or preview server running.
 *
 * Browser: Playwright's Chromium (`bunx playwright-core install chromium`)
 * or any Chrome via CHROME_PATH. WebGL runs on SwiftShader, so it works
 * headless without a GPU.
 */
import { chromium } from 'playwright-core';

export const DEFAULT_URL = process.env.SITE_URL ?? 'http://localhost:5173/';

export async function launchBrowser() {
  return chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
    ],
  });
}

/**
 * Renders the Earth box at `size`×`size` CSS px (DPR 1). Reduced motion
 * holds the opening pose (no spin, no intro scale), so every capture is
 * the exact frame the site shows before it starts turning.
 */
export async function captureEarth(browser, { url = DEFAULT_URL, size = 1600 } = {}) {
  const context = await browser.newContext({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content: `
      html, body, .app { background: transparent !important; }
      .hero, main, footer, .skip-link { visibility: hidden !important; }
      .earth {
        transform: none !important;
        width: ${size}px !important;
        height: ${size}px !important;
        opacity: 1 !important;
      }
      .earth__intro { animation: none !important; }
      .earth__poster { display: none !important; }
    `,
  });
  await page.waitForSelector('.earth__canvas.is-live canvas', { timeout: 60_000 });
  // Let the resize land and a few frames draw at the forced size.
  await page.waitForFunction(
    (expected) => document.querySelector('.earth__canvas canvas')?.width === expected,
    size,
  );
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let frames = 0;
        const tick = () => (++frames >= 6 ? resolve() : requestAnimationFrame(tick));
        requestAnimationFrame(tick);
      }),
  );
  const png = await page.locator('.earth').screenshot({ omitBackground: true });
  await context.close();
  return png;
}

/** Re-encodes a PNG to WebP in the browser (no native image deps). */
export async function toWebp(browser, png, { width, quality = 0.86 }) {
  const page = await browser.newPage();
  const dataUrl = await page.evaluate(
    async ({ src, width, quality }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round((img.height / img.width) * width);
      const g = canvas.getContext('2d');
      g.imageSmoothingQuality = 'high';
      g.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', quality);
    },
    { src: `data:image/png;base64,${png.toString('base64')}`, width, quality },
  );
  await page.close();
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}
