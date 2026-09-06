/**
 * LEGACY — not used by Vercel or Cloudflare production.
 * Kept for reference only. Prefer src/index.ts (Cloudflare Worker) for routing,
 * OG proxy, prefer-app cookie, and /reset. Root middleware.js was removed because
 * Vercel auto-detected it and failed deploy (imports next/server without Next.js).
 *
 * Original: Vercel Edge Middleware that proxied crawler/OG requests to play.theradio.fm
 */

import { NextResponse } from 'next/server';

const CRAWLER_USER_AGENT_PATTERN = /bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|pinterest|embedly|quora link preview|outbrain|vkshare|skypeuripreview|ia_archiver/i;
const STATIC_ASSET_PATH_PATTERN = /^\/(?:assets|css|font-awesome|icons|js|pages|screenshots|api)\//i;
const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{2,8}$/i;
const PREFER_APP_COOKIE = 'tr_prefer_app';
const PREFER_APP_MAX_AGE_SEC = 400 * 24 * 60 * 60;

function isStaticAssetPath(pathname) {
  return STATIC_ASSET_PATH_PATTERN.test(pathname) || FILE_EXTENSION_PATTERN.test(pathname);
}

function hasPreferAppCookie(request) {
  const cookie = request.headers.get('cookie') || '';
  return new RegExp(`(?:^|;\\s*)${PREFER_APP_COOKIE}=1(?:;|$)`).test(cookie);
}

function preferAppSetCookie(request) {
  const url = new URL(request.url);
  const host = url.hostname;
  const isProdTheradio = host === 'theradio.fm' || /\.theradio\.fm$/i.test(host);
  const domain = isProdTheradio ? '; Domain=.theradio.fm' : '';
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return `${PREFER_APP_COOKIE}=1; Path=/; Max-Age=${PREFER_APP_MAX_AGE_SEC}; SameSite=Lax${domain}${secure}`;
}

function preferAppClearCookies(request) {
  const url = new URL(request.url);
  const host = url.hostname;
  const isProdTheradio = host === 'theradio.fm' || /\.theradio\.fm$/i.test(host);
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  const cookies = [`${PREFER_APP_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`];
  if (isProdTheradio) {
    cookies.push(`${PREFER_APP_COOKIE}=; Path=/; Max-Age=0; Domain=.theradio.fm; SameSite=Lax${secure}`);
  }
  return cookies;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const isRoot = url.pathname === '/' || url.pathname === '/index.html';
  const isApp = url.pathname === '/app' || url.pathname === '/app/';
  const isReset = url.pathname === '/reset' || url.pathname === '/reset/';

  // Clear prefer-app and return to the landing page.
  if (isReset && (request.method === 'GET' || request.method === 'HEAD')) {
    const redirect = NextResponse.redirect(new URL('/', url.origin), 302);
    redirect.headers.set('cache-control', 'private, no-store');
    for (const cookie of preferAppClearCookies(request)) {
      redirect.headers.append('set-cookie', cookie);
    }
    return redirect;
  }

  // Remember /app visits, then send returning humans there from `/`.
  if (isApp && (request.method === 'GET' || request.method === 'HEAD')) {
    const response = NextResponse.next();
    response.headers.set('set-cookie', preferAppSetCookie(request));
    return response;
  }

  if (
    isRoot &&
    (request.method === 'GET' || request.method === 'HEAD') &&
    !CRAWLER_USER_AGENT_PATTERN.test(userAgent) &&
    hasPreferAppCookie(request)
  ) {
    const redirect = NextResponse.redirect(new URL('/app', url.origin), 302);
    redirect.headers.set('cache-control', 'private, no-store');
    return redirect;
  }

  // Homepage is first-party landing copy — do not replace it with the player OG proxy.
  if (isRoot || isStaticAssetPath(url.pathname) || !CRAWLER_USER_AGENT_PATTERN.test(userAgent)) {
    return NextResponse.next();
  }

  // Only handle GET requests for HTML content
  if (request.method !== 'GET') {
    return NextResponse.next();
  }

  try {
    // Build proxy request to play.theradio.fm
    const proxyUrl = new URL(url.pathname + url.search, 'https://play.theradio.fm');

    const proxyHeaders = new Headers({
      'accept': request.headers.get('accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': request.headers.get('accept-language') || 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'user-agent': userAgent,
    });

    const proxyResponse = await fetch(proxyUrl.toString(), {
      method: 'GET',
      headers: proxyHeaders,
      redirect: 'follow',
    });

    if (!proxyResponse.ok) {
      // If proxy fails, continue to static files
      console.error(`[middleware] Proxy failed: ${proxyResponse.status} ${proxyResponse.statusText}`);
      return NextResponse.next();
    }

    // Create response with proxied content
    const response = new NextResponse(proxyResponse.body, {
      status: proxyResponse.status,
      statusText: proxyResponse.statusText,
      headers: {
        'content-type': proxyResponse.headers.get('content-type') || 'text/html',
        'cache-control': 'public, max-age=300, s-maxage=300',
        'x-vercel-og-proxy': 'play.theradio.fm',
      },
    });

    return response;

  } catch (error) {
    console.error('[middleware] Error:', error.message);
    // On error, continue to static files
    return NextResponse.next();
  }
}
