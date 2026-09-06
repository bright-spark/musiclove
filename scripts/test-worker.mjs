/**
 * Spins up wrangler dev briefly, asserts OG-proxy behavior, then exits.
 * Usage: pnpm run test:worker
 * Env: TEST_WORKER_PORT (default 8787)
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.TEST_WORKER_PORT || 8787);
const base = `http://127.0.0.1:${port}`;

const CRAWLER_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function mergeStreams(proc) {
  let log = '';
  const append = (chunk) => {
    log += chunk.toString();
    if (log.length > 20000) log = log.slice(-15000);
  };
  proc.stdout?.on('data', append);
  proc.stderr?.on('data', append);
  return () => log;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function waitForDev(getLog, timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const log = getLog();
    if (log.includes('Ready on') || log.includes('Ready at')) {
      await sleep(400);
      return;
    }
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 1500);
      const res = await fetch(`${base}/`, {
        method: 'GET',
        headers: { 'user-agent': BROWSER_UA },
        redirect: 'manual',
        signal: ac.signal,
      });
      clearTimeout(t);
      if (res.status > 0 && res.status < 600) return;
    } catch {
      /* still starting */
    }
    await sleep(400);
  }
  throw new Error(`wrangler dev did not become ready within ${timeoutMs}ms. Last log:\n${getLog().slice(-4000)}`);
}

function shutdown(proc) {
  if (!proc.pid) return;
  try {
    proc.kill('SIGTERM');
  } catch {
    /* ignore */
  }
}

async function main() {
  const proc = spawn(
    'pnpm',
    ['exec', 'wrangler', 'dev', `--port=${String(port)}`, '--ip', '127.0.0.1'],
    {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
      detached: false,
    },
  );

  const getLog = mergeStreams(proc);

  proc.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  let exitDuringRun = null;
  proc.on('exit', (code, signal) => {
    exitDuringRun = { code, signal };
  });

  try {
    await waitForDev(getLog);

    const crawlRes = await fetch(`${base}/`, {
      method: 'GET',
      headers: { 'user-agent': CRAWLER_UA },
      redirect: 'follow',
    });

    if (crawlRes.status !== 200) {
      throw new Error(`crawler GET /: expected status 200, got ${crawlRes.status}`);
    }

    const crawlBody = await crawlRes.text();
    if (!crawlBody.includes('<h1') || !crawlBody.includes('Listen to live radio')) {
      throw new Error('crawler GET /: expected visible landing H1 about the offer');
    }
    if (!crawlBody.includes('Free Live Radio, Playlists, Podcasts')) {
      throw new Error('crawler GET /: expected offer title');
    }
    if (crawlRes.headers.get('x-og-proxy')) {
      throw new Error('crawler GET /: homepage should serve first-party landing, not OG proxy');
    }

    const cc = crawlRes.headers.get('cache-control') || '';
    if (!/\bmax-age=120\b/.test(cc) || !/\bs-maxage=300\b/.test(cc)) {
      throw new Error(`crawler GET /: unexpected cache-control: ${cc}`);
    }

    const headRes = await fetch(`${base}/`, {
      method: 'HEAD',
      headers: { 'user-agent': CRAWLER_UA },
      redirect: 'manual',
    });

    if (headRes.headers.get('x-og-proxy')) {
      throw new Error('HEAD with crawler UA should not use OG proxy branch (GET-only); got x-og-proxy');
    }

    const browserRoot = await fetch(`${base}/`, {
      method: 'GET',
      headers: { 'user-agent': BROWSER_UA },
      redirect: 'manual',
    });
    if (browserRoot.status !== 200) {
      throw new Error(`browser GET /: expected 200, got ${browserRoot.status}`);
    }
    const rootCt = browserRoot.headers.get('content-type') || '';
    if (!rootCt.includes('text/html')) {
      throw new Error(`browser GET /: expected html content-type, got ${rootCt}`);
    }
    const rootBody = await browserRoot.text();
    if (!rootBody.includes('https://theradiofm.webradiosite.com')) {
      throw new Error('browser GET /: expected iframe embed URL for webradiosite');
    }
    if (!/<iframe[\s\S]*?<\/iframe>/i.test(rootBody)) {
      throw new Error('browser GET /: expected an iframe in landing');
    }
    if (!rootBody.includes('<h1') || !rootBody.includes('Listen to live radio')) {
      throw new Error('browser GET /: expected visible landing H1');
    }
    if (!rootBody.includes('<title>Free Live Radio, Playlists, Podcasts')) {
      throw new Error('browser GET /: expected offer title');
    }

    const robotsRes = await fetch(`${base}/robots.txt`, {
      method: 'GET',
      headers: { 'user-agent': BROWSER_UA },
    });
    const robotsBody = await robotsRes.text();
    if (robotsRes.status !== 200 || !robotsBody.includes('Sitemap: https://theradio.fm/sitemap.xml')) {
      throw new Error('GET /robots.txt: expected sitemap directive');
    }

    const sitemapRes = await fetch(`${base}/sitemap.xml`, {
      method: 'GET',
      headers: { 'user-agent': BROWSER_UA },
    });
    const sitemapBody = await sitemapRes.text();
    if (sitemapRes.status !== 200 || !sitemapBody.includes('https://theradio.fm/</loc>')) {
      throw new Error('GET /sitemap.xml: expected homepage URL');
    }
    if (/play\.theradio\.fm|browser\.theradio\.fm|podcasts\.theradio\.fm|tubeflix\.theradio\.fm/.test(sitemapBody)) {
      throw new Error('GET /sitemap.xml: must only list theradio.fm URLs');
    }
    if (!rootBody.includes('How to start listening') || !rootBody.includes('min-height: 640px')) {
      throw new Error('browser GET /: expected how-to copy and 640px iframe');
    }

    const appRes = await fetch(`${base}/app`, {
      method: 'GET',
      headers: { 'user-agent': BROWSER_UA },
    });
    if (appRes.status !== 200) {
      throw new Error(`GET /app: expected 200, got ${appRes.status}`);
    }
    const appCt = appRes.headers.get('content-type') || '';
    if (!appCt.includes('text/html')) {
      throw new Error(`GET /app: expected html content-type, got ${appCt}`);
    }
    const appSetCookie = appRes.headers.get('set-cookie') || '';
    if (!/tr_prefer_app=1/.test(appSetCookie)) {
      throw new Error(`GET /app: expected tr_prefer_app cookie, got ${appSetCookie || '(none)'}`);
    }
    const appBody = await appRes.text();
    if (!appBody.includes('<title>Free Live Radio, Playlists, Podcasts')) {
      throw new Error('GET /app: body missing offer title from index.html');
    }
    if (!appBody.includes('<base href=')) {
      throw new Error('GET /app: expected injected <base> for Framework7 asset resolution');
    }

    const preferRoot = await fetch(`${base}/`, {
      method: 'GET',
      headers: { 'user-agent': BROWSER_UA, cookie: 'tr_prefer_app=1' },
      redirect: 'manual',
    });
    if (preferRoot.status !== 302) {
      throw new Error(`browser GET / with prefer-app cookie: expected 302, got ${preferRoot.status}`);
    }
    const preferLoc = preferRoot.headers.get('location') || '';
    if (!preferLoc.endsWith('/app') && preferLoc !== '/app') {
      throw new Error(`browser GET / with prefer-app cookie: expected Location /app, got ${preferLoc}`);
    }

    const crawlerPrefer = await fetch(`${base}/`, {
      method: 'GET',
      headers: { 'user-agent': CRAWLER_UA, cookie: 'tr_prefer_app=1' },
      redirect: 'manual',
    });
    if (crawlerPrefer.status !== 200) {
      throw new Error(`crawler GET / with prefer-app cookie: expected 200 landing, got ${crawlerPrefer.status}`);
    }

    const resetRes = await fetch(`${base}/reset`, {
      method: 'GET',
      headers: { 'user-agent': BROWSER_UA, cookie: 'tr_prefer_app=1' },
      redirect: 'manual',
    });
    if (resetRes.status !== 302) {
      throw new Error(`GET /reset: expected 302, got ${resetRes.status}`);
    }
    const resetLoc = resetRes.headers.get('location') || '';
    const resetPath = new URL(resetLoc, base).pathname;
    if (resetPath !== '/') {
      throw new Error(`GET /reset: expected Location /, got ${resetLoc}`);
    }
    const resetCookies = resetRes.headers.getSetCookie
      ? resetRes.headers.getSetCookie()
      : [resetRes.headers.get('set-cookie')].filter(Boolean);
    if (!resetCookies.some((c) => /tr_prefer_app=/.test(c) && /Max-Age=0/i.test(c))) {
      throw new Error(`GET /reset: expected Set-Cookie clearing tr_prefer_app, got ${JSON.stringify(resetCookies)}`);
    }

    const rainRes = await fetch(`${base}/rain`, {
      method: 'GET',
      headers: { 'user-agent': BROWSER_UA },
      redirect: 'manual',
    });
    if (rainRes.status !== 200) {
      throw new Error(`GET /rain: expected 200 (pretty URL → rain.html), got ${rainRes.status}`);
    }
    const rainCt = rainRes.headers.get('content-type') || '';
    if (!rainCt.includes('text/html')) {
      throw new Error(`GET /rain: expected html content-type, got ${rainCt}`);
    }
    const rainBody = await rainRes.text();
    if (!rainBody.includes('Red Matrix Radio Phone')) {
      throw new Error('GET /rain: body missing expected rain.html title');
    }

    const mRes = await fetch(`${base}/m`, {
      method: 'GET',
      headers: { 'user-agent': BROWSER_UA },
      redirect: 'manual',
    });
    if (mRes.status !== 200) {
      throw new Error(`GET /m: expected 200 (pretty URL → m.html), got ${mRes.status}`);
    }
    const mBody = await mRes.text();
    if (!mBody.includes('Music Love Quest')) {
      throw new Error('GET /m: body missing expected m.html marker');
    }

    console.log('test-worker: ok');
    console.log(`  crawler GET / -> ${crawlRes.status} (first-party landing)`);
    console.log(`  crawler HEAD / -> ${headRes.status} (no x-og-proxy from worker)`);
    console.log(`  browser GET / -> ${browserRoot.status}, content-type: ${rootCt}`);
    console.log(`  browser GET /robots.txt -> ${robotsRes.status}`);
    console.log(`  browser GET /sitemap.xml -> ${sitemapRes.status}`);
    console.log(`  browser GET /app -> ${appRes.status}, set-cookie tr_prefer_app`);
    console.log(`  browser GET / + cookie -> ${preferRoot.status} -> ${preferLoc}`);
    console.log(`  crawler GET / + cookie -> ${crawlerPrefer.status} (no redirect)`);
    console.log(`  browser GET /reset -> ${resetRes.status} -> ${resetLoc} (clear prefer-app)`);
    console.log(`  browser GET /rain -> ${rainRes.status}, content-type: ${rainCt}`);
    console.log(`  browser GET /m -> ${mRes.status}`);
  } finally {
    shutdown(proc);
    await sleep(600);
    try {
      proc.kill('SIGKILL');
    } catch {
      /* ignore */
    }
    await sleep(200);
    if (exitDuringRun && exitDuringRun.code !== null && exitDuringRun.code !== 0 && exitDuringRun.signal !== 'SIGKILL') {
      console.warn('wrangler exit:', exitDuringRun);
    }
  }
}

main().catch((err) => {
  console.error('test-worker:', err.message);
  process.exit(1);
});
