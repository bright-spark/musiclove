const CRAWLER_USER_AGENT_PATTERN = /bot|crawler|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|pinterest|embedly|quora link preview|outbrain|vkshare|skypeuripreview|ia_archiver/i;

function isCrawlerRequest(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';

  return request.method === 'GET' && accept.includes('text/html') && CRAWLER_USER_AGENT_PATTERN.test(userAgent);
}

function buildProxyRequest(request) {
  const incomingUrl = new URL(request.url);
  const proxyUrl = new URL(incomingUrl.pathname + incomingUrl.search, 'https://play.theradio.fm');
  const headers = new Headers(request.headers);

  headers.set('host', 'play.theradio.fm');
  headers.set('x-forwarded-host', incomingUrl.host);
  headers.set('x-original-url', incomingUrl.toString());

  return new Request(proxyUrl.toString(), {
    method: 'GET',
    headers,
    redirect: 'follow',
  });
}

export default {
  async fetch(request, env, ctx) {
    if (!isCrawlerRequest(request)) {
      return fetch(request);
    }

    const response = await fetch(buildProxyRequest(request));
    const headers = new Headers(response.headers);

    headers.set('cache-control', 'public, max-age=300, s-maxage=300');
    headers.set('x-og-proxy', 'play.theradio.fm');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
