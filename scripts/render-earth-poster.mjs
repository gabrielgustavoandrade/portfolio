#!/usr/bin/env node
/**
 * Static poster for the hero Earth, shown until the code-split Three.js
 * scene is ready. Same camera and framing as the canvas box, so the
 * cross-fade is seamless.
 *
 *   bun run dev            # in another terminal
 *   bun run assets:poster  # → public/earth/poster-{800,1600}.webp
 */
import { writeFile } from 'node:fs/promises';
import { captureEarth, DEFAULT_URL, launchBrowser, toWebp } from './lib/captureEarth.mjs';

const url = process.argv[2] ?? DEFAULT_URL;
const browser = await launchBrowser();
try {
  const png = await captureEarth(browser, { url, size: 1600 });
  for (const width of [1600, 800]) {
    const webp = await toWebp(browser, png, { width });
    const out = `public/earth/poster-${width}.webp`;
    await writeFile(out, webp);
    console.log(`${out}  ${webp.length.toLocaleString()} B`);
  }
} finally {
  await browser.close();
}
