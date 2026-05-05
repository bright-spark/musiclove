/**
 * Vercel Edge Function: OG Proxy
 * 
 * Proxies crawler requests to play.theradio.fm
 * Unlike Cloudflare Workers, Vercel Edge Functions may not be blocked
 * 
 * Routes:
 *   /api/og-proxy?url=<encoded-url> - Proxy a specific URL
 *   (when called as middleware) - Auto-proxy based on user-agent
 */

const CRAWLER_USER_AGENT_PATTERN = /bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|pinterest|embedly|quora link preview|outbrain|vkshare|skypeuripreview|ia_archiver/i;
const STATIC_ASSET_PATH_PATTERN = /^\/(?:assets|css|font-awesome|icons|js|pages|screenshots)\//i;
const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{2,8}$/i;

function isStaticAssetPath(pathname) {
  return STATIC_ASSET_PATH_PATTERN.test(pathname) || FILE_EXTENSION_PATTERN.test(pathname);
}

function isCrawlerRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  return request.method === 'GET' && !isStaticAssetPath(url.pathname) && CRAWLER_USER_AGENT_PATTERN.test(userAgent);
}

function buildProxyRequest(request) {
  const incomingUrl = new URL(request.url);
  const proxyUrl = new URL(incomingUrl.pathname + incomingUrl.search, 'https://play.theradio.fm');

  const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  const headers = new Headers({
    'accept': request.headers.get('accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'accept-language': request.headers.get('accept-language') || 'en-US,en;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'user-agent': userAgent,
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
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

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    // Check if this is a direct API call with url param
    const url = new URL(request.url);
    const proxyUrl = url.searchParams.get('url');

    if (proxyUrl) {
      // Direct proxy request
      const targetResponse = await fetch(proxyUrl, {
        headers: {
          'user-agent': request.headers.get('user-agent') || 'Vercel Edge Function',
        },
      });

      return new Response(targetResponse.body, {
        status: targetResponse.status,
        statusText: targetResponse.statusText,
        headers: {
          'content-type': targetResponse.headers.get('content-type') || 'text/html',
          'x-vercel-proxy': 'true',
        },
      });
    }

    // Check if this is a crawler request that should be proxied
    if (!isCrawlerRequest(request)) {
      // Return info about the endpoint
      return new Response(
        JSON.stringify({
          message: 'OG Proxy Endpoint',
          usage: 'Use ?url=<encoded-url> to proxy a specific URL',
          crawlerDetected: false,
        }),
        {
          headers: { 'content-type': 'application/json' },
        }
      );
    }

    // Proxy to play.theradio.fm
    const proxyRequest = buildProxyRequest(request);
    const proxyResponse = await fetch(proxyRequest);

    const headers = new Headers(proxyResponse.headers);
    headers.set('cache-control', 'public, max-age=300, s-maxage=300');
    headers.set('x-vercel-og-proxy', 'play.theradio.fm');

    return new Response(proxyResponse.body, {
      status: proxyResponse.status,
      statusText: proxyResponse.statusText,
      headers,
    });

  } catch (error) {
    console.error('[vercel-og-proxy] Error:', error.message);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 502,
        headers: {
          'content-type': 'application/json',
          'x-vercel-proxy-error': error.message,
        },
      }
    );
  }
}
