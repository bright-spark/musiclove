#!/usr/bin/env node
/**
 * OG Data Extractor for play.theradio.fm
 * 
 * This script fetches the current OG/Twitter meta tags from play.theradio.fm
 * and outputs them in a format ready to paste into theradio.fm/index.html
 * 
 * Usage:
 *   node scripts/extract-og-data.mjs
 *   node scripts/extract-og-data.mjs --json
 *   node scripts/extract-og-data.mjs --shell
 */

const TARGET_URL = 'https://play.theradio.fm/';
const CRAWLER_USER_AGENT = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

const OUTPUT_FORMAT = process.argv.includes('--json') ? 'json' 
                    : process.argv.includes('--shell') ? 'shell'
                    : 'html';

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
      return `    <meta ${type}="${name}" content="${safeContent}" />`;
    })
    .join('\n');
}

function formatAsShellInject(tags) {
  // Format for injecting into the shell's index.html head section
  const metaBlock = formatAsHtml(tags);
  return `<!-- OG Meta Tags from play.theradio.fm - Updated ${new Date().toISOString()} -->
${metaBlock}`;
}

async function main() {
  console.error(`Fetching OG data from ${TARGET_URL}...`);

  try {
    const response = await fetch(TARGET_URL, {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'user-agent': CRAWLER_USER_AGENT,
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`Error: HTTP ${response.status} ${response.statusText}`);
      process.exit(1);
    }

    const html = await response.text();
    const tags = extractMetaTags(html);

    if (tags.length === 0) {
      console.error('No OG/Twitter meta tags found');
      process.exit(1);
    }

    console.error(`Found ${tags.length} OG/Twitter meta tags\n`);

    switch (OUTPUT_FORMAT) {
      case 'json':
        console.log(JSON.stringify(tags, null, 2));
        break;
      case 'shell':
        console.log(formatAsShellInject(tags));
        break;
      case 'html':
      default:
        console.log(formatAsHtml(tags));
        break;
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
