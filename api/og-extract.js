/**
 * Vercel Edge Function: OG Data Extractor
 * 
 * Fetches current OG/Twitter meta tags from play.theradio.fm
 * Returns them as JSON or HTML meta tags
 * 
 * Usage:
 *   GET /api/og-extract - Returns HTML meta tags
 *   GET /api/og-extract?format=json - Returns JSON
 *   GET /api/og-extract?format=shell - Returns shell-ready block
 */

const TARGET_URL = 'https://play.theradio.fm/';
const CRAWLER_USER_AGENT = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractMetaTags(html) {
  const tags = [];
  const metaTagPattern = /<meta\s+[^>]*>/gi;
  const attributePattern = /([a-zA-Z_:.-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;
  const matches = html.match(metaTagPattern) || [];

  matches.forEach((tag) => {
    const attributes = {};
    let attributeMatch;

    while ((attributeMatch = attributePattern.exec(tag)) !== null) {
      const key = attributeMatch[1].toLowerCase();
      const rawValue = attributeMatch[2];
      const value = rawValue.replace(/^['"]|['"]$/g, '');
      attributes[key] = decodeHtml(value);
    }

    const name = attributes.property || attributes.name;
    const content = attributes.content;

    if (name && content && /^(og:|twitter:)/i.test(name)) {
      tags.push({ name, content, type: attributes.property ? 'property' : 'name' });
    }
  });

  return tags;
}

function formatAsHtml(tags) {
  return tags
    .map(({ name, content, type }) => {
      const safeContent = content
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<meta ${type}="${name}" content="${safeContent}" />`;
    })
    .join('\n');
}

function formatAsShellInject(tags) {
  const metaBlock = formatAsHtml(tags);
  return `<!-- OG Meta Tags from play.theradio.fm - Updated ${new Date().toISOString()} -->\n${metaBlock}`;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'html';

  try {
    const response = await fetch(TARGET_URL, {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'user-agent': CRAWLER_USER_AGENT,
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `HTTP ${response.status} ${response.statusText}` }),
        { 
          status: 502,
          headers: { 'content-type': 'application/json' }
        }
      );
    }

    const html = await response.text();
    const tags = extractMetaTags(html);

    if (tags.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No OG/Twitter meta tags found' }),
        { 
          status: 404,
          headers: { 'content-type': 'application/json' }
        }
      );
    }

    let output;
    let contentType;

    switch (format) {
      case 'json':
        output = JSON.stringify({ 
          updated: new Date().toISOString(),
          source: TARGET_URL,
          tags 
        }, null, 2);
        contentType = 'application/json';
        break;
      case 'shell':
        output = formatAsShellInject(tags);
        contentType = 'text/html';
        break;
      case 'html':
      default:
        output = formatAsHtml(tags);
        contentType = 'text/html';
        break;
    }

    return new Response(output, {
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=60, s-maxage=60',
        'x-og-source': 'play.theradio.fm',
        'x-og-tags-count': String(tags.length),
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'content-type': 'application/json' }
      }
    );
  }
}
