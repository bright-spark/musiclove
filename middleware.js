/**
 * Vercel Edge Middleware — prefer-app cookie + /reset (parity with Cloudflare Worker).
 * Uses @vercel/edge (not next/server) so it works on this static project.
 */
import { next } from '@vercel/edge';

const CRAWLER_USER_AGENT_PATTERN =
  /bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|pinterest|embedly|quora link preview|outbrain|vkshare|skypeuripreview|ia_archiver/i;
const PREFER_APP_COOKIE = 'tr_prefer_app';
const PREFER_APP_MAX_AGE_SEC = 400 * 24 * 60 * 60;

export const config = {
  matcher: ['/', '/index.html', '/app', '/app/', '/reset', '/reset/'],
};

function isCrawlerUserAgent(userAgent) {
  return CRAWLER_USER_AGENT_PATTERN.test(userAgent || '');
}

function hasPreferAppCookie(request) {
  const cookie = request.headers.get('cookie') || '';
  return new RegExp(`(?:^|;\\s*)${PREFER_APP_COOKIE}=1(?:;|$)`).test(cookie);
}

function cookieSecureAndDomain(url) {
  const host = url.hostname;
  const isProdTheradio = host === 'theradio.fm' || /\.theradio\.fm$/i.test(host);
  return {
    secure: url.protocol === 'https:' ? '; Secure' : '',
    domain: isProdTheradio ? '; Domain=.theradio.fm' : '',
    isProdTheradio,
  };
}

function preferAppSetCookie(request) {
  const url = new URL(request.url);
  const { secure, domain } = cookieSecureAndDomain(url);
  return `${PREFER_APP_COOKIE}=1; Path=/; Max-Age=${PREFER_APP_MAX_AGE_SEC}; SameSite=Lax${domain}${secure}`;
}

function preferAppClearCookies(request) {
  const url = new URL(request.url);
  const { secure, isProdTheradio } = cookieSecureAndDomain(url);
  const cookies = [`${PREFER_APP_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`];
  if (isProdTheradio) {
    cookies.push(
      `${PREFER_APP_COOKIE}=; Path=/; Max-Age=0; Domain=.theradio.fm; SameSite=Lax${secure}`,
    );
  }
  return cookies;
}

export default function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  const isGetLike = method === 'GET' || method === 'HEAD';
  const isRoot = path === '/' || path === '/index.html';
  const isApp = path === '/app' || path === '/app/';
  const isReset = path === '/reset' || path === '/reset/';

  if (isReset && isGetLike) {
    const headers = new Headers({
      location: '/',
      'cache-control': 'private, no-store',
    });
    for (const cookie of preferAppClearCookies(request)) {
      headers.append('set-cookie', cookie);
    }
    return new Response(null, { status: 302, headers });
  }

  if (isApp && isGetLike) {
    const response = next();
    response.headers.set('set-cookie', preferAppSetCookie(request));
    response.headers.set('cache-control', 'public, max-age=300, s-maxage=600');
    return response;
  }

  if (
    isRoot &&
    isGetLike &&
    !isCrawlerUserAgent(request.headers.get('user-agent')) &&
    hasPreferAppCookie(request)
  ) {
    return new Response(null, {
      status: 302,
      headers: {
        location: '/app',
        'cache-control': 'private, no-store',
      },
    });
  }

  if (isRoot && isGetLike) {
    const response = next();
    response.headers.set('vary', 'Cookie');
    response.headers.set('cache-control', 'public, max-age=120, s-maxage=300');
    response.headers.set(
      'content-security-policy',
      "frame-src 'self' https://www.theradio.fm https://theradio.fm https://theradio.fm/pages/privacy https://play.theradio.fm https://browser.theradio.fm https://podcasts.theradio.fm https://tubeflix.theradio.fm https://theradiofm.webradiosite.com https://f0eb2b1419dc4d1fbb4702185aa6a46a.elf.site",
    );
    return response;
  }

  return next();
}
