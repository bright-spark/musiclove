/// <reference path="./worker-modules.d.ts" />

import indexHtmlSource from './index-html-embed.txt';
import { FRAME_SRC_CSP, LLMS_TXT, ROBOTS_TXT, SITEMAP_XML, rootLandingHtml } from './landing-html';

interface MusicloveEnv {
  ASSETS: Fetcher;
}

function textResponse(body: string | null, contentType: string, cacheControl: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': contentType,
      'cache-control': cacheControl,
    },
  });
}

const CRAWLER_USER_AGENT_PATTERN =
  /bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|pinterest|embedly|quora link preview|outbrain|vkshare|skypeuripreview|ia_archiver/i;
const STATIC_ASSET_PATH_PATTERN =
  /^\/(?:assets|css|font-awesome|icons|js|pages|screenshots|img|fonts)\//i;
const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{2,8}$/i;

/** Remember that the visitor prefers `/app` after they land there. */
const PREFER_APP_COOKIE = 'tr_prefer_app';
const PREFER_APP_MAX_AGE_SEC = 400 * 24 * 60 * 60;

function isStaticAssetPath(pathname: string): boolean {
  return STATIC_ASSET_PATH_PATTERN.test(pathname) || FILE_EXTENSION_PATTERN.test(pathname);
}

function isCrawlerUserAgent(userAgent: string): boolean {
  return CRAWLER_USER_AGENT_PATTERN.test(userAgent);
}

function isCrawlerRequest(request: Request): boolean {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  return (
    request.method === 'GET' &&
    !isStaticAssetPath(url.pathname) &&
    isCrawlerUserAgent(userAgent)
  );
}

function isAppPagePath(pathname: string): boolean {
  return pathname === '/app' || pathname === '/app/';
}

function isResetPath(pathname: string): boolean {
  return pathname === '/reset' || pathname === '/reset/';
}

function isRootDocumentPath(pathname: string): boolean {
  return pathname === '/' || pathname === '/index.html';
}

function hasPreferAppCookie(request: Request): boolean {
  const cookie = request.headers.get('cookie') || '';
  return new RegExp(`(?:^|;\\s*)${PREFER_APP_COOKIE}=1(?:;|$)`).test(cookie);
}

function cookieDomainAttrs(request: Request): { secure: string; domain: string; isProdTheradio: boolean } {
  const url = new URL(request.url);
  const host = url.hostname;
  const isProdTheradio = host === 'theradio.fm' || /\.theradio\.fm$/i.test(host);
  return {
    secure: url.protocol === 'https:' ? '; Secure' : '',
    domain: isProdTheradio ? '; Domain=.theradio.fm' : '',
    isProdTheradio,
  };
}

function preferAppSetCookieHeader(request: Request): string {
  const { secure, domain } = cookieDomainAttrs(request);
  return `${PREFER_APP_COOKIE}=1; Path=/; Max-Age=${PREFER_APP_MAX_AGE_SEC}; SameSite=Lax${domain}${secure}`;
}

/** Clear prefer-app so `/` serves the landing page again. */
function preferAppClearCookieHeaders(request: Request): string[] {
  const { secure, isProdTheradio } = cookieDomainAttrs(request);
  const headers = [`${PREFER_APP_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`];
  // Also clear the Domain=.theradio.fm variant used in production.
  if (isProdTheradio) {
    headers.push(
      `${PREFER_APP_COOKIE}=; Path=/; Max-Age=0; Domain=.theradio.fm; SameSite=Lax${secure}`,
    );
  }
  return headers;
}

/**
 * Pretty URLs for repo-root HTML: `/rain` and `/rain/` serve `rain.html` from static assets.
 * Single path segment, no dots (paths like `/pages/foo` stay on normal asset routing).
 */
function getPrettyRootHtmlSlug(pathname: string): string | null {
  const m = pathname.match(/^\/([^/.]+)\/?$/);
  if (!m) return null;
  const slug = m[1];
  if (!slug || slug === 'app' || slug === 'reset') return null;
  return slug;
}

async function tryPrettyRootHtmlResponse(
  request: Request,
  env: MusicloveEnv,
  pathname: string,
): Promise<Response | null> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;

  const slug = getPrettyRootHtmlSlug(pathname);
  if (!slug) return null;

  const assetUrl = new URL(request.url);
  assetUrl.pathname = `/${slug}.html`;
  const assetRequest = new Request(assetUrl.toString(), request);
  const assetResponse = await env.ASSETS.fetch(assetRequest);

  if (assetResponse.status === 200) {
    return assetResponse;
  }
  return null;
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

/** Repo-root `index.html` (Framework7 shell) for `/app`, with `<base>` so `css/`, `js/`, `pages/` resolve from origin root (not `/app/...`). */
function framework7AppShellHtml(request: Request): string {
  const origin = new URL(request.url).origin;
  const baseTag = `<base href="${origin}/" />`;
  if (/\b<base\b/i.test(indexHtmlSource)) {
    return indexHtmlSource.replace(/<base\b[^>]*>/i, baseTag);
  }
  return indexHtmlSource.replace(/<head([^>]*)>/i, `<head$1>\n  ${baseTag}`);
}

export default {
  async fetch(request: Request, env: MusicloveEnv): Promise<Response> {
    try {
      const url = new URL(request.url);

      if (url.pathname === '/robots.txt' && (request.method === 'GET' || request.method === 'HEAD')) {
        return textResponse(
          request.method === 'HEAD' ? null : ROBOTS_TXT,
          'text/plain; charset=utf-8',
          'public, max-age=3600, s-maxage=86400',
        );
      }

      if (url.pathname === '/llms.txt' && (request.method === 'GET' || request.method === 'HEAD')) {
        return textResponse(
          request.method === 'HEAD' ? null : LLMS_TXT,
          'text/plain; charset=utf-8',
          'public, max-age=3600, s-maxage=86400',
        );
      }

      if (url.pathname === '/sitemap.xml' && (request.method === 'GET' || request.method === 'HEAD')) {
        return textResponse(
          request.method === 'HEAD' ? null : SITEMAP_XML,
          'application/xml; charset=utf-8',
          'public, max-age=3600, s-maxage=86400',
        );
      }

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
            'set-cookie': preferAppSetCookieHeader(request),
          },
        });
      }

      // Clear prefer-app cookie and send the visitor back to the landing page.
      if (isResetPath(url.pathname)) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          return new Response('Method Not Allowed', { status: 405 });
        }
        const headers = new Headers({
          location: '/',
          'cache-control': 'private, no-store',
        });
        for (const cookie of preferAppClearCookieHeaders(request)) {
          headers.append('set-cookie', cookie);
        }
        return new Response(null, { status: 302, headers });
      }

      const prettyHtml = await tryPrettyRootHtmlResponse(request, env, url.pathname);
      if (prettyHtml) {
        return prettyHtml;
      }

      // Humans and crawlers both get the first-party landing on `/` so Lighthouse
      // and Google see a visible H1, offer title, and crawlable copy.
      // Returning visitors who already opened `/app` are sent straight back there.
      if ((request.method === 'GET' || request.method === 'HEAD') && isRootDocumentPath(url.pathname)) {
        const userAgent = request.headers.get('user-agent') || '';
        if (!isCrawlerUserAgent(userAgent) && hasPreferAppCookie(request)) {
          const appUrl = new URL('/app', url.origin);
          return new Response(null, {
            status: 302,
            headers: {
              location: appUrl.pathname,
              'cache-control': 'private, no-store',
            },
          });
        }

        return new Response(request.method === 'HEAD' ? null : rootLandingHtml(url.origin), {
          status: 200,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'public, max-age=120, s-maxage=300',
            vary: 'Cookie',
            'content-security-policy': FRAME_SRC_CSP,
          },
        });
      }

      if (!isCrawlerRequest(request)) {
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
