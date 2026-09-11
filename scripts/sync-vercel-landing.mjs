/**
 * Writes landing.html plus root SEO text files from src/landing-html.ts.
 * Usage: node scripts/sync-vercel-landing.mjs
 */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const landingTs = pathToFileURL(join(root, 'src/landing-html.ts')).href;
const landingOut = join(root, 'landing.html');
const llmsOut = join(root, 'llms.txt');
const robotsOut = join(root, 'robots.txt');

const source = `
import { writeFileSync } from 'node:fs';
import { LLMS_TXT, ROBOTS_TXT, rootLandingHtml } from ${JSON.stringify(landingTs)};
const html = rootLandingHtml('https://theradio.fm');
writeFileSync(${JSON.stringify(landingOut)}, html);
writeFileSync(${JSON.stringify(llmsOut)}, LLMS_TXT);
writeFileSync(${JSON.stringify(robotsOut)}, ROBOTS_TXT);
console.log('sync-vercel-landing:', ${JSON.stringify(landingOut)});
console.log('sync-vercel-landing:', ${JSON.stringify(llmsOut)});
console.log('sync-vercel-landing:', ${JSON.stringify(robotsOut)});
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
