// Renders every route to static HTML after the client and SSR builds.
// The pages are static content, so they ship as HTML + CSS only (no client JS).
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { routes, pathOf, render } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const template = (await readFile(path.join(dist, 'index.html'), 'utf8'))
  .replace(/\s*<script type="module"[^>]*><\/script>/g, '')
  .replace(/\s*<link rel="modulepreload"[^>]*>/g, '');

for (const route of routes) {
  const { html, head, lang, dir } = render(route);
  const page = template
    .replace('<html lang="en" dir="ltr">', `<html lang="${lang}" dir="${dir}">`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html);
  const file = path.join(dist, pathOf(route), 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, page);
  console.log(`prerendered /${pathOf(route)}`);
}

const assets = path.join(dist, 'assets');
for (const name of await readdir(assets)) {
  if (name.endsWith('.js')) await rm(path.join(assets, name));
}
await rm(ssrDir, { recursive: true, force: true });
