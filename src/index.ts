/// <reference path="./worker-modules.d.ts" />

import indexHtmlSource from './index-html-embed.txt';

interface MusicloveEnv {
  ASSETS: Fetcher;
}

const THERADIOFM_WEBRADIO = 'https://theradiofm.webradiosite.com';

const ROOT_EMBED_SHELL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>theradio.fm</title>
  <style>
    html, body { margin: 0; height: 100%; overflow: hidden; background: #000; }
    iframe { display: block; width: 100%; height: 100%; border: 0; }
  </style>
</head>
<body>
  <iframe
    src="${THERADIOFM_WEBRADIO}/"
    title="theradio.fm"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    loading="eager"
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>
</body>
</html>
`;

const CRAWLER_USER_AGENT_PATTERN =
  /bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|pinterest|embedly|quora link preview|outbrain|vkshare|skypeuripreview|ia_archiver/i;
const STATIC_ASSET_PATH_PATTERN =
  /^\/(?:assets|css|font-awesome|icons|js|pages|screenshots|img|fonts)\//i;
const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{2,8}$/i;

function isStaticAssetPath(pathname: string): boolean {
  return STATIC_ASSET_PATH_PATTERN.test(pathname) || FILE_EXTENSION_PATTERN.test(pathname);
}

function isCrawlerRequest(request: Request): boolean {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  return (
    request.method === 'GET' &&
    !isStaticAssetPath(url.pathname) &&
    CRAWLER_USER_AGENT_PATTERN.test(userAgent)
  );
}

function isAppPagePath(pathname: string): boolean {
  return pathname === '/app' || pathname === '/app/';
}

function isRootDocumentPath(pathname: string): boolean {
  return pathname === '/' || pathname === '/index.html';
}

function buildProxyRequest(request: Request): Request {
  const incomingUrl = new URL(request.url);
  const proxyUrl = new URL(incomingUrl.pathname + incomingUrl.search, 'https://play.theradio.fm');

  const userAgent =
    request.headers.get('user-agent') ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  const headers = new Headers({
    accept:
      request.headers.get('accept') ||
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'accept-language': request.headers.get('accept-language') || 'en-US,en;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'user-agent': userAgent,
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
  });

  return new Request(proxyUrl.toString(), {
    method: 'GET',
    headers,
    redirect: 'follow',
  });
}

async function fetchWithRedirects(
  request: Request,
  maxRedirects = 5,
): Promise<{ response: Response; redirectHistory: string[] }> {
  let currentRequest = request;
  let redirectCount = 0;
  const redirectHistory: string[] = [];

  while (redirectCount < maxRedirects) {
    const response = await fetch(currentRequest, { redirect: 'manual' });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      redirectHistory.push(`${response.status} -> ${location}`);

      if (!location) {
        throw new Error(`Redirect ${response.status} without Location header`);
      }

      currentRequest = new Request(location, {
        method: 'GET',
        headers: currentRequest.headers,
      });
      redirectCount++;
    } else {
      return { response, redirectHistory };
    }
  }

  throw new Error(`Too many redirects: ${redirectHistory.join(', ')}`);
}

/** Repo-root `index.html` (Framework7 shell) for `/app`, with `<base>` so `css/`, `js/`, `pages/` resolve from this origin. */
function framework7AppShellHtml(request: Request): string {
  if (/\b<base\b/i.test(indexHtmlSource)) {
    return indexHtmlSource;
  }
  const origin = new URL(request.url).origin;
  return indexHtmlSource.replace(/<head([^>]*)>/i, `<head$1>\n  <base href="${origin}/" />`);
}

export default {
  async fetch(request: Request, env: MusicloveEnv): Promise<Response> {
    try {
      const url = new URL(request.url);

      if (isAppPagePath(url.pathname)) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          return new Response('Method Not Allowed', { status: 405 });
        }
        const body = request.method === 'HEAD' ? null : framework7AppShellHtml(request);
        return new Response(body, {
          status: 200,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'public, max-age=300, s-maxage=600',
          },
        });
      }

      if (!isCrawlerRequest(request)) {
        if (request.method === 'GET' && isRootDocumentPath(url.pathname)) {
          return new Response(ROOT_EMBED_SHELL_HTML, {
            status: 200,
            headers: {
              'content-type': 'text/html; charset=utf-8',
              'cache-control': 'public, max-age=120, s-maxage=300',
              // Allow embedding the webradiosite origin inside our iframe (browser enforces child frame policy).
              'content-security-policy': 'frame-src https://theradiofm.webradiosite.com',
            },
          });
        }
        return env.ASSETS.fetch(request);
      }

      const proxyRequest = buildProxyRequest(request);
      const { response: proxyResponse, redirectHistory } = await fetchWithRedirects(proxyRequest);

      const headers = new Headers(proxyResponse.headers);
      headers.set('cache-control', 'public, max-age=300, s-maxage=300');
      headers.set('x-og-proxy', 'play.theradio.fm');

      if (redirectHistory.length > 0) {
        headers.set('x-redirect-history', redirectHistory.join('; '));
      }

      const body = proxyResponse.body;

      return new Response(body, {
        status: proxyResponse.status,
        statusText: proxyResponse.statusText,
        headers,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('[og-proxy] Error:', message);

      return new Response(`OG Proxy Error: ${message}`, {
        status: 502,
        headers: {
          'content-type': 'text/plain',
          'x-og-proxy-error': message,
        },
      });
    }
  },
};
