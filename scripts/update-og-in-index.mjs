#!/usr/bin/env node
/**
 * Update OG Meta Tags in index.html
 * 
 * Fetches current OG data from play.theradio.fm and updates
 * the meta tags in index.html to match.
 * 
 * Usage:
 *   node scripts/update-og-in-index.mjs
 *   node scripts/update-og-in-index.mjs --dry-run  (preview changes)
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const TARGET_URL = 'https://play.theradio.fm/';
const INDEX_PATH = './index.html';
const CRAWLER_USER_AGENT = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

const DRY_RUN = process.argv.includes('--dry-run');

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

function formatMetaTags(tags) {
  return tags
    .map(({ name, content, type }) => {
      const safeContent = content
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `  <meta ${type}="${name}" content="${safeContent}" />`;
    })
    .join('\n');
}

async function fetchOgData() {
  console.log(`Fetching OG data from ${TARGET_URL}...`);
  
  const response = await fetch(TARGET_URL, {
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'user-agent': CRAWLER_USER_AGENT,
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const tags = extractMetaTags(html);

  if (tags.length === 0) {
    throw new Error('No OG/Twitter meta tags found');
  }

  console.log(`Found ${tags.length} OG/Twitter meta tags`);
  return tags;
}

async function updateIndexHtml(tags) {
  if (!existsSync(INDEX_PATH)) {
    throw new Error(`index.html not found at ${INDEX_PATH}`);
  }

  let content = await readFile(INDEX_PATH, 'utf-8');

  const newMetaBlock = `<!-- Auto-generated OG Meta Tags from play.theradio.fm - Updated: ${new Date().toISOString()} -->\n${formatMetaTags(tags)}\n  <!-- End OG Meta Tags -->`;

  // Pattern to match existing OG meta tags block
  const ogBlockPattern = /<!--\s*(?:Auto-generated\s+)?OG Meta Tags.*?-->\s*.*?\s*<!--\s*End OG Meta Tags\s*-->/is;
  
  // Pattern to match individual og: and twitter: meta tags anywhere in head
  const individualOgPattern = /\s*<meta\s+(?:property|name)="(?:og:|twitter:)[^"]+"\s+content="[^"]*"\s*\/?>\s*/gi;

  if (ogBlockPattern.test(content)) {
    // Replace existing block
    content = content.replace(ogBlockPattern, newMetaBlock);
    console.log('Replaced existing OG meta tags block');
  } else {
    // Remove any individual OG tags scattered in head
    content = content.replace(individualOgPattern, '');
    
    // Insert after <head> tag
    const headPattern = /(<head[^>]*>\s*)/i;
    if (headPattern.test(content)) {
      content = content.replace(headPattern, `$1\n  ${newMetaBlock}\n`);
      console.log('Inserted new OG meta tags block after <head>');
    } else {
      throw new Error('Could not find <head> tag in index.html');
    }
  }

  if (DRY_RUN) {
    console.log('\n--- Preview of changes ---');
    console.log(newMetaBlock);
    console.log('\n(Dry run - no changes written)');
  } else {
    await writeFile(INDEX_PATH, content, 'utf-8');
    console.log(`Updated ${INDEX_PATH} successfully`);
  }
}

async function main() {
  try {
    const tags = await fetchOgData();
    await updateIndexHtml(tags);
    
    console.log('\nOG meta tags summary:');
    tags.forEach(({ name, content }) => {
      const truncated = content.length > 60 ? content.slice(0, 60) + '...' : content;
      console.log(`  ${name}: ${truncated}`);
    });
    
    if (!DRY_RUN) {
      console.log('\nNext steps:');
      console.log('  1. Review the changes in index.html');
      console.log('  2. Deploy to your hosting (Cloudflare Pages or Vercel)');
      console.log('  3. Test with: npm run test:og');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
