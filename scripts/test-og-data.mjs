const targetUrl = process.argv[2] || 'https://theradio.fm/';
const userAgent = process.argv[3] || 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

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

    if (name && /^(og:|twitter:)/i.test(name)) {
      tags.push({ name, content: attributes.content || '' });
    }
  });

  return tags;
}

const response = await fetch(targetUrl, {
  headers: {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'user-agent': userAgent,
  },
  redirect: 'follow',
});

const contentType = response.headers.get('content-type') || '';
const html = await response.text();
const tags = extractMetaTags(html);

console.log('URL:', targetUrl);
console.log('Final URL:', response.url);
console.log('Status:', `${response.status} ${response.statusText}`);
console.log('Content-Type:', contentType);
console.log('x-og-proxy:', response.headers.get('x-og-proxy') || '(missing)');
console.log('x-og-proxy-error:', response.headers.get('x-og-proxy-error') || '(none)');
console.log('x-redirect-history:', response.headers.get('x-redirect-history') || '(none)');
console.log('cache-control:', response.headers.get('cache-control') || '(missing)');
console.log('--- Response Body (first 500 chars) ---');
console.log(html.slice(0, 500));
console.log('--- OG/Twitter Meta Tags ---');

if (tags.length === 0) {
  console.log('(none found)');
} else {
  tags.forEach(({ name, content }) => {
    console.log(`${name}: ${content}`);
  });
}
