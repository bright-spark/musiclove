/**
 * Copies repo index.html into a .txt file so the Worker can import it as a
 * string via Wrangler's text module bundling (served at /app).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'index.html');
const dest = join(root, 'src/index-html-embed.txt');

writeFileSync(dest, readFileSync(src, 'utf8'), 'utf8');
console.log('sync-worker-embeds:', dest);
