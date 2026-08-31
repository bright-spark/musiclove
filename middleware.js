/**
 * Vercel Edge Middleware
 * 
 * Intercepts requests and proxies crawler/OG requests to play.theradio.fm
 * This runs on Vercel's edge network before hitting the static files
 */

import { NextResponse } from 'next/server';

const CRAWLER_USER_AGENT_PATTERN = /bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|pinterest|embedly|quora link preview|outbrain|vkshare|skypeuripreview|ia_archiver/i;
const STATIC_ASSET_PATH_PATTERN = /^\/(?:assets|css|font-awesome|icons|js|pages|screenshots|api)\//i;
const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{2,8}$/i;

function isStaticAssetPath(pathname) {
  return STATIC_ASSET_PATH_PATTERN.test(pathname) || FILE_EXTENSION_PATTERN.test(pathname);
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  // Homepage is first-party landing copy — do not replace it with the player OG proxy.
  const isRoot = url.pathname === '/' || url.pathname === '/index.html';
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
