/**
 * Writes landing.html from src/landing-html.ts for Vercel static hosting.
 * Usage: node scripts/sync-vercel-landing.mjs
 */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const landingTs = pathToFileURL(join(root, 'src/landing-html.ts')).href;
const outPath = join(root, 'landing.html');

const source = `
import { writeFileSync } from 'node:fs';
import { rootLandingHtml } from ${JSON.stringify(landingTs)};
const html = rootLandingHtml('https://theradio.fm');
writeFileSync(${JSON.stringify(outPath)}, html);
console.log('sync-vercel-landing:', ${JSON.stringify(outPath)});
`;

const result = spawnSync(
  process.execPath,
  ['--experimental-strip-types', '--input-type=module', '-e', source],
  { cwd: root, encoding: 'utf8' },
);

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
