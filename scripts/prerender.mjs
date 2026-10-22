/**
 * Renders the homepage to static HTML per language after `vite build`:
 * EN at dist/index.html, pt-BR at dist/pt-BR/index.html.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
for (const marker of [
  '<!--app-head-->',
  '<!--app-html-->',
  '<html lang="en">',
]) {
  if (!template.includes(marker)) {
    throw new Error(`prerender: ${marker} missing from dist/index.html`);
  }
}

const { render, PRERENDER_LANGS } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

for (const lang of PRERENDER_LANGS) {
  const { html, head, htmlLang, path: urlPath } = render(lang);
  if (!html.includes('<h1')) {
    throw new Error(`prerender: no <h1> in the ${lang} render`);
  }
  const page = template
    .replace('<html lang="en">', `<html lang="${htmlLang}">`)
    .replace('<!--app-head-->', () => head)
    .replace('<!--app-html-->', () => html);
  const outDir = path.join(dist, urlPath);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), page);
  console.log(`prerendered ${urlPath} (${htmlLang}, ${page.length} bytes)`);
}

await rm(ssrDir, { recursive: true, force: true });
