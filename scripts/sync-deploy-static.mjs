/**
 * Populates deploy-static/ with only the files the browser loads for / and /app.
 * Used as Workers Static Assets directory (avoids watching the whole repo in wrangler dev).
 */
import { cpSync, mkdirSync, rmSync, existsSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dest = join(root, 'deploy-static');

if (existsSync(dest)) {
  rmSync(dest, { recursive: true });
}
mkdirSync(dest, { recursive: true });

const dirs = ['css', 'js', 'font-awesome', 'icons', 'splashscreens', 'pages', 'img', 'fonts'];
for (const d of dirs) {
  const src = join(root, d);
  if (existsSync(src)) {
    cpSync(src, join(dest, d), { recursive: true });
  }
}

const rootFiles = [
  'manifest.json',
  'favicon.ico',
  'sw.js',
  'service-worker.js',
  'offline.html',
  'OneSignalSDKWorker.js',
  'robots.txt',
  'llms.txt',
  'sitemap.xml',
];
for (const f of rootFiles) {
  const src = join(root, f);
  if (existsSync(src)) {
    copyFileSync(src, join(dest, f));
  }
}

// Repo-root *.html (e.g. m.html, rain.html) for Worker pretty URLs `/m`, `/rain` → `*.html`.
for (const name of readdirSync(root)) {
  if (!name.endsWith('.html') || name === 'index.html') continue;
  const src = join(root, name);
  if (existsSync(src) && statSync(src).isFile()) {
    copyFileSync(src, join(dest, name));
  }
}

const wellKnown = join(root, '.well-known');
if (existsSync(wellKnown)) {
  cpSync(wellKnown, join(dest, '.well-known'), { recursive: true });
}

console.log('sync-deploy-static:', dest);
