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

  const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  const headers = new Headers({
    'accept': request.headers.get('accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
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

async function fetchWithRedirects(request, maxRedirects = 5) {
  let currentRequest = request;
  let redirectCount = 0;
  const redirectHistory = [];

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

export default {
  async fetch(request, env, ctx) {
    try {
      if (!isCrawlerRequest(request)) {
        return fetch(request);
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
      console.error('[og-proxy] Error:', error.message);

      return new Response(`OG Proxy Error: ${error.message}`, {
        status: 502,
        headers: {
          'content-type': 'text/plain',
          'x-og-proxy-error': error.message,
        },
      });
    }
  },
};
