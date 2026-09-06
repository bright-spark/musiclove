const CANONICAL = 'https://theradio.fm/';
const ICON_512 = 'https://theradio.fm/icons/apple-touch-icon-512x512.png';

export const SITE_TITLE =
  'Free Live Radio, Playlists, Podcasts & Music Videos | theradio.fm';

export const SITE_DESCRIPTION =
  'Listen to live radio, browse stations worldwide, play podcasts, and watch music videos on theradio.fm. Free streaming, no login required.';

/** Allowed iframe embed hosts for landing + app shell (meta CSP and response headers). */
export const FRAME_SRC_CSP =
  "frame-src 'self' https://www.theradio.fm https://theradio.fm https://theradio.fm/pages/privacy https://play.theradio.fm https://browser.theradio.fm https://podcasts.theradio.fm https://tubeflix.theradio.fm https://theradiofm.webradiosite.com https://f0eb2b1419dc4d1fbb4702185aa6a46a.elf.site";

export const ROBOTS_TXT = `User-agent: *
Allow: /
Allow: /app
Allow: /llms.txt
Allow: /pages/privacy
Allow: /pages/cover
Allow: /icons/
Allow: /screenshots/
Disallow: /db/
Disallow: /font-awesome/
Disallow: /fonts/
Disallow: /js/
Disallow: /css/

Sitemap: https://theradio.fm/sitemap.xml
`;

export const LLMS_TXT = `# theradio.fm

> Free live radio, world stations, podcasts, and music videos in the browser — no login, no subscription.

theradio.fm (also known as Music Love / the radio) is a free streaming web app and PWA. Listen to the theradio.fm live station, browse internet radio by country, play podcasts, and watch curated music videos on TubeFlix. Contact: studio@theradio.fm

## Primary

- [Home](https://theradio.fm/): Landing page with overview, install options, and embedded app player
- [App](https://theradio.fm/app): Full tabbed theradio.fm progressive web app
- [Live radio](https://play.theradio.fm/): Live theradio.fm stream player with now-playing track art
- [World stations](https://browser.theradio.fm/): Browse and tune internet radio stations by country
- [Podcasts](https://podcasts.theradio.fm/): Find and play podcasts
- [TubeFlix](https://tubeflix.theradio.fm/): Free music videos in a Netflix-style interface

## Docs

- [Privacy policy](https://theradio.fm/pages/privacy): How theradio.fm collects and uses information (GDPR-oriented)
- [Sitemap](https://theradio.fm/sitemap.xml): Canonical URL list for crawlers
- [Robots](https://theradio.fm/robots.txt): Crawler allow and disallow rules

## Optional

- [Cover](https://theradio.fm/pages/cover/): Brand cover / about page
- [Frontpage](https://theradio.fm/pages/frontpage): Embedded Music Love journal
- [Android app](https://play.google.com/store/apps/details?id=fm.theradio.play): theradio.fm on Google Play
- [Reset prefer-app](https://theradio.fm/reset): Clear the prefer-app cookie and return to the landing page
`;

export const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://theradio.fm/</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://theradio.fm/app</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://theradio.fm/pages/privacy</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;

function jsonLdScript(): string {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://theradio.fm/#website',
        url: CANONICAL,
        name: 'theradio.fm',
        alternateName: ['the radio', 'the radio fm', 'theradio', 'theradio.fm'],
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': 'https://theradio.fm/#organization' },
        potentialAction: {
          '@type': 'ListenAction',
          target: 'https://theradio.fm/#listen',
          name: 'Listen to live radio',
        },
      },
      {
        '@type': ['Organization', 'RadioStation'],
        '@id': 'https://theradio.fm/#organization',
        name: 'theradio.fm',
        url: CANONICAL,
        logo: {
          '@type': 'ImageObject',
          url: ICON_512,
          width: 512,
          height: 512,
        },
        image: ICON_512,
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://theradio.fm/app',
        name: 'theradio.fm',
        url: CANONICAL,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: SITE_DESCRIPTION,
      },
      {
        '@type': 'WebPage',
        '@id': 'https://theradio.fm/#webpage',
        url: CANONICAL,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        isPartOf: { '@id': 'https://theradio.fm/#website' },
        about: { '@id': 'https://theradio.fm/#organization' },
        inLanguage: 'en',
        primaryImageOfPage: ICON_512,
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://theradio.fm/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What can I do on theradio.fm?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can listen to theradio.fm live, browse thousands of internet radio stations by country, play podcasts, and watch music videos on TubeFlix. Everything is free and works in the browser.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is theradio.fm free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes 100% free. Live radio, station browsing, podcasts, and music videos are free. No subscription and no login required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need an account to listen?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No account needed at all. Open theradio.fm and press play. You can listen live, tune world stations, play podcasts, or watch videos without creating an account.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where do I listen live or watch videos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Listen live at play.theradio.fm, browse world stations at browser.theradio.fm, play podcasts at podcasts.theradio.fm, and watch music videos at tubeflix.theradio.fm. The full app is also at theradio.fm/app.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does theradio.fm work on phones and tablets?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. theradio.fm is a free web app. Open it in any modern browser on phone, tablet, or desktop. No app store download is required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is theradio.fm safe to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes 100% safe. theradio.fm is a free web app. No ads, no tracking, no cookies, no data collection. Just pure radio and videos.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is theradio.fm ad-free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes 100% ad-free. theradio.fm is a free web app. No ads, no tracking, no cookies, no data collection. Just pure radio and videos.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I listen to radio stations from other countries?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes from all countries. The world stations browser at browser.theradio.fm lists live internet radio by country and genre so you can tune in instantly.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is there a mobile app?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes there is a mobile app. The theradio.fm app is available for download on the Google Play Store. No ads, no tracking, no cookies, no data collection. Just pure radio and videos.',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://theradio.fm/#breadcrumbs',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: CANONICAL,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://theradio.fm/#offers',
        name: 'What you can do on theradio.fm',
        numberOfItems: 5,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 0,
            name: 'Switch to theradio.fm app mode',
            url: 'https://theradio.fm/app',
          },
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Listen to the unique theradio.fm station live',
            url: 'https://play.theradio.fm/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Browse thousands of radio stations worldwide',
            url: 'https://browser.theradio.fm/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Play and follow all of your favorite podcasts',
            url: 'https://podcasts.theradio.fm/',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Watch any of your quality-checked free music videos in true Netflix style',
            url: 'https://tubeflix.theradio.fm/',
          },
        ],
      },
    ],
  };

  return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
}

/** First-party landing for `/` — visible H1, offer title, crawlable copy, live embed. */
export function rootLandingHtml(origin: string): string {
  const icon192 = `${origin}/icons/apple-touch-icon-192x192.png`;
  const icon512 = `${origin}/icons/apple-touch-icon-512x512.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${SITE_TITLE}</title>
  <meta name="description" content="${SITE_DESCRIPTION}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow" />
  <meta name="keywords" content="free live radio, internet radio, online radio stations, podcasts, music videos, TubeFlix, playlists, theradio.fm" />
  <meta name="author" content="Martin Myburgh" />
  <meta name="theme-color" content="#0a0a0a" />
  <meta name="application-name" content="theradio.fm" />
  <meta name="color-scheme" content="dark" />
  <meta http-equiv="Content-Security-Policy" content="${FRAME_SRC_CSP}" />
  <link rel="canonical" href="${CANONICAL}" />
  <link rel="sitemap" type="application/xml" href="https://theradio.fm/sitemap.xml" />
  <link rel="describedby" href="https://theradio.fm/llms.txt" type="text/plain" title="llms.txt" />
  <link rel="preconnect" href="https://f0eb2b1419dc4d1fbb4702185aa6a46a.elf.site" />
  <link rel="dns-prefetch" href="https://f0eb2b1419dc4d1fbb4702185aa6a46a.elf.site" />
  <link rel="preconnect" href="https://theradiofm.webradiosite.com" />
  <link rel="dns-prefetch" href="https://theradiofm.webradiosite.com" />
  <link rel="manifest" href="${origin}/manifest.json" />
  <link rel="icon" href="${origin}/favicon.ico" />
  <link rel="icon" type="image/png" sizes="192x192" href="${icon192}" />
  <link rel="icon" type="image/png" sizes="512x512" href="${icon512}" />
  <link rel="apple-touch-icon" sizes="180x180" href="${origin}/icons/apple-touch-icon-180x180.png" />
  <link rel="apple-touch-icon" href="${origin}/icons/apple-touch-icon.png" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content="theradio.fm" />
  <meta property="og:url" content="${CANONICAL}" />
  <meta property="og:title" content="${SITE_TITLE}" />
  <meta property="og:description" content="${SITE_DESCRIPTION}" />
  <meta property="og:image" content="${ICON_512}" />
  <meta property="og:image:secure_url" content="${ICON_512}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta property="og:image:alt" content="theradio.fm — free live radio, podcasts and music videos" />
  <meta property="og:updated_time" content="2026-08-31T00:00:00Z" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${SITE_TITLE}" />
  <meta name="twitter:description" content="${SITE_DESCRIPTION}" />
  <meta name="twitter:image" content="${ICON_512}" />
  <meta name="twitter:image:alt" content="theradio.fm — free live radio, podcasts and music videos" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="theradio.fm" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="mobile-web-app-capable" content="yes" />
  ${jsonLdScript()}
  <style>
    :root {
      --bg: #0a0a0a;
      --panel: #141414;
      --panel-hover: #1a1a1a;
      --text: #f4f4f5;
      --muted: #a1a1aa;
      --line: #27272a;
      --line-strong: #3f3f46;
      --accent: #e11d48;
      --accent-press: #be123c;
      --accent-soft: #fda4af;
      --header-h: 64px;
      --ease: cubic-bezier(0.22, 1, 0.36, 1);
    }
    * { box-sizing: border-box; }
    html {
      background: var(--bg);
      color: var(--text);
      -webkit-text-size-adjust: 100%;
      overflow-x: clip;
      scroll-behavior: smooth;
      scroll-padding-top: calc(var(--header-h) + 12px);
    }
    body {
      margin: 0;
      min-height: 100dvh;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 16px;
      line-height: 1.55;
      background: var(--bg);
      color: var(--text);
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }
    body.nav-open { overflow: hidden; }
    body::before {
      content: "";
      position: fixed;
      inset: -20vh auto auto -30vw;
      width: min(90vw, 640px);
      height: min(70vh, 520px);
      background: radial-gradient(closest-side, rgb(225 29 72 / 0.2), transparent 72%);
      pointer-events: none;
      z-index: 0;
    }
    a { color: inherit; }
    img { border: 0; display: block; }
    :focus { outline: none; }
    :focus-visible {
      outline: 2px solid var(--accent-soft);
      outline-offset: 3px;
    }
    ::selection { background: var(--accent); color: #fff; }
    .skip {
      position: absolute;
      left: max(12px, env(safe-area-inset-left));
      top: -48px;
      z-index: 80;
      padding: 12px 16px;
      background: #fff;
      color: #111;
      font-weight: 700;
      text-decoration: none;
      border-radius: 8px;
    }
    .skip:focus { top: max(12px, env(safe-area-inset-top)); }
    .wrap {
      width: min(1120px, 100%);
      margin: 0 auto;
      padding-left: max(16px, env(safe-area-inset-left));
      padding-right: max(16px, env(safe-area-inset-right));
      position: relative;
      z-index: 1;
    }
    header.site {
      position: sticky;
      top: 0;
      z-index: 50;
      min-height: var(--header-h);
      padding-top: env(safe-area-inset-top);
      background: var(--bg);
      border-bottom: 1px solid rgb(39 39 42 / 0.7);
    }
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: var(--header-h);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-weight: 800;
      letter-spacing: -0.03em;
      min-height: 48px;
      position: relative;
      z-index: 60;
    }
    .brand img { width: 40px; height: 40px; border-radius: 999px; }
    .menu-toggle {
      position: relative;
      z-index: 60;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      margin-right: -8px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      color: var(--text);
      cursor: pointer;
    }
    .menu-toggle:hover { background: rgb(255 255 255 / 0.05); }
    .menu-toggle-box {
      position: relative;
      display: block;
      width: 20px;
      height: 14px;
    }
    .menu-toggle-box span {
      position: absolute;
      left: 0;
      display: block;
      width: 20px;
      height: 2px;
      border-radius: 999px;
      background: currentColor;
      transition: transform 0.28s var(--ease), top 0.28s var(--ease), opacity 0.2s ease;
    }
    .menu-toggle-box span:nth-child(1) { top: 0; }
    .menu-toggle-box span:nth-child(2) { top: 6px; }
    .menu-toggle-box span:nth-child(3) { top: 12px; }
    body.nav-open .menu-toggle-box span:nth-child(1) {
      top: 6px;
      transform: rotate(45deg);
    }
    body.nav-open .menu-toggle-box span:nth-child(2) { opacity: 0; }
    body.nav-open .menu-toggle-box span:nth-child(3) {
      top: 6px;
      transform: rotate(-45deg);
    }
    .nav-layer {
      position: fixed;
      inset: 0;
      z-index: 40;
      display: flex;
      flex-direction: column;
      padding: calc(var(--header-h) + env(safe-area-inset-top) + 12px) max(16px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
      background: rgb(8 8 8 / 0.96);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-8px);
      transition: opacity 0.28s var(--ease), transform 0.28s var(--ease), visibility 0.28s;
    }
    body.nav-open .nav-layer {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: none;
    }
    nav.primary {
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-width: 36rem;
    }
    nav.primary a,
    nav.primary button {
      display: flex;
      align-items: center;
      min-height: 52px;
      padding: 0 4px;
      border: 0;
      border-bottom: 1px solid var(--line);
      background: transparent;
      color: var(--text);
      text-decoration: none;
      font: inherit;
      font-size: 1.375rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      text-align: left;
      cursor: pointer;
    }
    nav.primary a:hover,
    nav.primary button:hover { color: var(--accent-soft); }
    nav.primary button[hidden] { display: none; }
    .hero { padding: 28px 0 36px; }
    .hero .kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 14px;
      color: var(--accent-soft);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--accent);
      box-shadow: 0 0 0 0 rgb(225 29 72 / 0.65);
      animation: live-pulse 2s ease-out infinite;
    }
    @keyframes live-pulse {
      0% { box-shadow: 0 0 0 0 rgb(225 29 72 / 0.65); }
      70% { box-shadow: 0 0 0 10px rgb(225 29 72 / 0); }
      100% { box-shadow: 0 0 0 0 rgb(225 29 72 / 0); }
    }
    .hero h1 {
      margin: 0 0 16px;
      font-size: clamp(2.05rem, 9.2vw, 4.15rem);
      line-height: 1.08;
      letter-spacing: -0.045em;
      max-width: 18ch;
      text-wrap: balance;
    }
    .hero .lead {
      margin: 0 0 24px;
      max-width: 40rem;
      color: var(--muted);
      font-size: 1.0625rem;
      text-wrap: pretty;
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .actions > :first-child,
    .actions > :last-child { grid-column: 1 / -1; }
    .actions a,
    .actions button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 48px;
      padding: 12px 16px;
      border-radius: 14px;
      background: var(--panel);
      border: 1px solid var(--line);
      color: var(--text);
      text-decoration: none;
      font: inherit;
      font-weight: 700;
      text-align: center;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s var(--ease);
    }
    .actions a.primary {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
      box-shadow: 0 10px 28px rgb(225 29 72 / 0.22);
    }
    .actions a.primary:hover { background: var(--accent-press); }
    .actions a:hover { border-color: var(--line-strong); }
    .actions button:hover { color: var(--accent-soft); border-color: var(--accent-soft); }
    .actions button[hidden] { display: none; }
    .install-hint {
      display: none;
      margin: 14px 0 0;
      color: var(--muted);
      font-size: 0.95rem;
    }
    .install-hint.is-visible { display: block; }
    .offers, .how, .listen { padding: 0 0 40px; }
    .offers h2, .listen h2, .faq h2, .how h2 {
      margin: 0 0 16px;
      font-size: clamp(1.2rem, 3vw, 1.55rem);
      letter-spacing: -0.035em;
    }
    .cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .cards article {
      position: relative;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 20px;
      transition: border-color 0.2s ease, background 0.2s ease, transform 0.25s var(--ease);
    }
    .cards .card-kicker {
      margin: 0 0 8px;
      color: var(--accent-soft);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .cards h3 { margin: 0 0 8px; font-size: 1.08rem; letter-spacing: -0.02em; }
    .cards h3 a { text-decoration: none; }
    .cards h3 a::after {
      content: "";
      position: absolute;
      inset: 0;
    }
    .cards p { margin: 0; color: var(--muted); padding-right: 28px; }
    .cards article::after {
      content: "→";
      position: absolute;
      top: 20px;
      right: 18px;
      color: var(--muted);
      font-size: 1.1rem;
      transition: color 0.2s ease, transform 0.2s var(--ease);
    }
    .how ol {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin: 0;
      padding: 0;
      list-style: none;
      counter-reset: step;
    }
    .how li {
      counter-increment: step;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px 18px 18px 60px;
      position: relative;
      color: var(--muted);
    }
    .how li::before {
      content: counter(step);
      position: absolute;
      left: 16px;
      top: 18px;
      width: 30px;
      height: 30px;
      border-radius: 999px;
      background: var(--accent);
      color: #fff;
      font-weight: 800;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .how strong { color: var(--text); }
    .player {
      border: 1px solid var(--line);
      border-radius: 18px;
      overflow: hidden;
      background: #000;
    }
    .player iframe {
      display: block;
      width: 100%;
      height: min(68dvh, 640px);
      min-height: 380px;
      border: 0;
    }
    .faq { padding: 0 0 48px; }
    .faq details {
      border-top: 1px solid var(--line);
      padding: 4px 0;
    }
    .faq details:last-of-type { border-bottom: 1px solid var(--line); }
    .faq summary {
      cursor: pointer;
      font-weight: 700;
      min-height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      list-style: none;
      letter-spacing: -0.02em;
    }
    .faq summary::-webkit-details-marker { display: none; }
    .faq summary::after {
      content: "";
      width: 10px;
      height: 10px;
      flex-shrink: 0;
      border-right: 2px solid var(--muted);
      border-bottom: 2px solid var(--muted);
      transform: rotate(45deg);
      transition: transform 0.22s var(--ease);
    }
    .faq details[open] summary::after {
      transform: rotate(225deg);
      margin-top: 6px;
    }
    .faq p { margin: 0 0 14px; color: var(--muted); max-width: 42rem; }
    footer.site {
      border-top: 1px solid var(--line);
      padding: 24px 0 max(36px, env(safe-area-inset-bottom));
      color: var(--muted);
    }
    footer.site nav {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
      margin-bottom: 12px;
    }
    footer.site a,
    footer.site button {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      text-decoration: underline;
      text-underline-offset: 3px;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
      padding: 0;
    }
    footer.site p { margin: 0; max-width: 40rem; }
    @media (hover: hover) and (pointer: fine) {
      .cards article:hover {
        border-color: var(--line-strong);
        background: var(--panel-hover);
        transform: translateY(-2px);
      }
      .cards article:hover::after {
        color: var(--accent-soft);
        transform: translateX(3px);
      }
      .cards h3 a:hover { color: var(--accent-soft); }
      .actions a:hover { transform: translateY(-1px); }
    }
    @media (min-width: 640px) {
      .hero { padding: 40px 0 48px; }
      .hero .lead { font-size: 1.125rem; }
      .actions { grid-template-columns: repeat(3, 1fr); }
      .actions > :first-child,
      .actions > :last-child { grid-column: auto; }
    }
    @media (min-width: 720px) {
      .cards { grid-template-columns: 1fr 1fr; }
      .how ol { grid-template-columns: repeat(3, 1fr); }
      .player iframe {
        height: min(80.85vh + 31.5px, 860px);
        min-height: 640px;
      }
    }
    @media (min-width: 1024px) {
      .hero { padding: 56px 0 64px; }
    }
    @media (min-width: 1180px) {
      .menu-toggle { display: none; }
      nav.primary .pwa-install { display: none; }
      .nav-layer {
        position: static;
        inset: auto;
        z-index: auto;
        display: block;
        padding: 0;
        background: none;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: none;
      }
      nav.primary {
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        max-width: none;
        gap: 0;
      }
      nav.primary a,
      nav.primary button {
        min-height: 44px;
        padding: 0 9px;
        border-bottom: 0;
        font-size: 0.8125rem;
        font-weight: 650;
        letter-spacing: -0.01em;
        color: var(--muted);
        white-space: nowrap;
      }
      .actions { grid-template-columns: minmax(150px, 1.2fr) repeat(5, minmax(0, 1fr)); }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .nav-layer { transform: none; }
    }
    @media (prefers-reduced-transparency: reduce) {
      header.site,
      .nav-layer { background: var(--bg); }
    }
  </style>
</head>
<body>
  <a class="skip" href="#listen">Skip to live radio</a>
  <header class="site">
    <div class="wrap header-bar">
      <a class="brand" href="${CANONICAL}">
        <img src="${icon512}" width="40" height="40" alt="theradio.fm logo" />
        <span>theradio.fm</span>
      </a>
      <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
        <span class="menu-toggle-box" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
      </button>
      <div class="nav-layer" id="primary-nav">
        <nav class="primary" aria-label="theradio.fm apps">
          <a href="https://theradio.fm/app">App mode</a>
          <a href="https://theradio.fm/pages/frontpage">Blog</a>
          <a href="https://play.theradio.fm/">Live radio</a>
          <a href="https://browser.theradio.fm/">World stations</a>
          <a href="https://podcasts.theradio.fm/">Podcasts</a>
          <a href="https://tubeflix.theradio.fm/">Music videos</a>
          <a href="https://theradio.fm/pages/privacy">Privacy policy</a>
          <a href="https://play.google.com/store/apps/details?id=fm.theradio.play">Android app</a>
          <button type="button" class="pwa-install" data-pwa-install>Install</button>
        </nav>
      </div>
    </div>
  </header>
  <div class="wrap">
    <main>
      <section class="hero" aria-labelledby="hero-heading">
        <p class="kicker"><span class="live-dot" aria-hidden="true"></span> Free internet radio &amp; music</p>
        <h1 id="hero-heading">Listen to live radio, playlists, podcasts and music videos</h1>
        <p class="lead">Tune in to theradio.fm live, browse thousands of internet radio stations from every country, play podcasts, or watch music videos on TubeFlix. Free streaming in your browser — no account and no paywall.</p>
        <ul class="actions">
          <li><a class="primary" href="#listen">Listen live</a></li>
          <li><a href="https://theradio.fm/app">App mode</a></li>
          <li><a href="https://theradio.fm/pages/frontpage">Blog</a></li>
          <li><a href="https://browser.theradio.fm/">Browse stations</a></li>
          <li><a href="https://podcasts.theradio.fm/">Play podcasts</a></li>
          <li><a href="https://tubeflix.theradio.fm/">Music videos</a></li>
        </ul>
        <p class="install-hint" data-pwa-install-hint role="status" aria-live="polite"></p>
      </section>

      <section class="offers" aria-labelledby="offers-heading">
        <h2 id="offers-heading">What you can do on theradio.fm</h2>
        <div class="cards">
          <article>
            <p class="card-kicker">Live</p>
            <h3><a href="https://play.theradio.fm/">Listen to live internet radio</a></h3>
            <p>Press play on theradio.fm live. See the current track, artwork, and stay with the stream — no app install required.</p>
          </article>
          <article>
            <p class="card-kicker">Worldwide</p>
            <h3><a href="https://browser.theradio.fm/">Browse radio stations worldwide</a></h3>
            <p>Explore live stations by country and genre. Tune in instantly from a worldwide radio browser.</p>
          </article>
          <article>
            <p class="card-kicker">Shows</p>
            <h3><a href="https://podcasts.theradio.fm/">Play and follow podcasts</a></h3>
            <p>Pick a show, play the latest episode, and keep listening in a focused podcast player.</p>
          </article>
          <article>
            <p class="card-kicker">Video</p>
            <h3><a href="https://tubeflix.theradio.fm/">Watch free music videos</a></h3>
            <p>Search, browse genres, and play music videos full screen on TubeFlix — built for watching, not the feed.</p>
          </article>
        </div>
      </section>

      <section class="how" aria-labelledby="how-heading">
        <h2 id="how-heading">How to start listening</h2>
        <ol>
          <li><strong>Choose what to play.</strong> Live radio, world stations, podcasts, or TubeFlix music videos — pick one from the links above.</li>
          <li><strong>Press play in your browser.</strong> Streams and videos start on the page. You do not need an app store download.</li>
          <li><strong>Stay for free.</strong> No login, no subscription, and no paywall. Open theradio.fm whenever you want to listen or watch.</li>
        </ol>
      </section>

      <section class="listen" id="listen" aria-labelledby="listen-heading">
        <h2 id="listen-heading">On air and in the journal</h2>
        <div class="player">
          <iframe name="theradio-fm-player"
            src="https://theradio.fm/app"
            title="theradio.fm app"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone; fullscreen; web-share"
            allowfullscreen
            loading="eager"></iframe>
        </div>
      </section>

      <section class="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently asked questions</h2>
        <details open>
          <summary>What can I do on theradio.fm?</summary>
          <p>Listen to theradio.fm live, browse internet radio stations by country, play podcasts, and watch music videos. Open any of the apps above or use the full app at <a href="https://theradio.fm/app">theradio.fm/app</a>.</p>
        </details>
        <details>
          <summary>Is theradio.fm free to use?</summary>
          <p>Yes. Live radio, world stations, podcasts, and TubeFlix music videos are free. There is no subscription.</p>
        </details>
        <details>
          <summary>Do I need to create an account?</summary>
          <p>No login is required. Start listening or watching as soon as the page loads.</p>
        </details>
        <details>
          <summary>How do I open the full theradio.fm app?</summary>
          <p>Use <a href="https://theradio.fm/app">theradio.fm</a> app mode for the tabbed player, or jump straight to <a href="https://play.theradio.fm/">live radio</a>, <a href="https://browser.theradio.fm/">world stations</a>, <a href="https://podcasts.theradio.fm/">podcasts</a>, or <a href="https://tubeflix.theradio.fm/">music videos</a>.</p>
        </details>
        <details>
          <summary>Does theradio.fm work on phones and tablets?</summary>
          <p>Yes. Open theradio.fm in any modern browser on a phone, tablet, or desktop. It is a free web app — no app store install is required.</p>
        </details>
        <details>
          <summary>Can I listen to radio stations from other countries?</summary>
          <p>Yes. Use the <a href="https://browser.theradio.fm/">world stations browser</a> to find live internet radio by country and genre, then tap a station to tune in.</p>
        </details>
      </section>
    </main>

    <footer class="site">
      <nav aria-label="Footer">
        <a href="${CANONICAL}">Home</a>
        <a href="https://theradio.fm/app">App mode</a>
        <a href="https://theradio.fm/pages/frontpage">Blog</a>
        <a href="https://play.theradio.fm/">Live radio</a>
        <a href="https://browser.theradio.fm/">World stations</a>
        <a href="https://podcasts.theradio.fm/">Podcasts</a>
        <a href="https://tubeflix.theradio.fm/">Music videos</a>
        <a href="https://play.google.com/store/apps/details?id=fm.theradio.play">Android app</a>
        <button type="button" class="pwa-install" data-pwa-install>Install</button>
      </nav>
      <p>theradio.fm offers free live radio, playlists, podcasts and music videos. No login required.</p>
    </footer>
  </div>
  <script>
    (function () {
      var header = document.querySelector('header.site');
      var toggle = document.querySelector('.menu-toggle');
      var panel = document.getElementById('primary-nav');
      if (!header || !toggle || !panel) return;

      var mq = window.matchMedia('(min-width: 1180px)');
      var lastFocus = null;

      function isOpen() {
        return header.classList.contains('is-open');
      }

      function setOpen(open, options) {
        var restore = !options || options.restore !== false;
        header.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (mq.matches) panel.removeAttribute('inert');
        else panel.toggleAttribute('inert', !open);
        if (open) {
          lastFocus = document.activeElement;
          var first = panel.querySelector('a, button');
          if (first) first.focus();
        } else if (restore && lastFocus && typeof lastFocus.focus === 'function') {
          lastFocus.focus();
        }
      }

      toggle.addEventListener('click', function () {
        setOpen(!isOpen());
      });

      panel.addEventListener('click', function (event) {
        if (event.target.closest('a')) setOpen(false, { restore: false });
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && isOpen() && !mq.matches) {
          setOpen(false);
          return;
        }
        if (event.key !== 'Tab' || !isOpen() || mq.matches) return;
        var focusables = [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll('a, button')));
        var index = focusables.indexOf(document.activeElement);
        if (event.shiftKey && index <= 0) {
          event.preventDefault();
          focusables[focusables.length - 1].focus();
        } else if (!event.shiftKey && index === focusables.length - 1) {
          event.preventDefault();
          focusables[0].focus();
        }
      });

      function syncDesktop() {
        if (mq.matches && isOpen()) setOpen(false, { restore: false });
        if (mq.matches) panel.removeAttribute('inert');
        else if (!isOpen()) panel.setAttribute('inert', '');
      }
      syncDesktop();
      if (mq.addEventListener) mq.addEventListener('change', syncDesktop);
      else mq.addListener(syncDesktop);
    })();
  </script>
  <script>
    (function () {
      var APP_URL = ${JSON.stringify(`${origin}/app`)};

      // Client fallback if a stale SW served landing HTML despite prefer-app cookie.
      if (/(?:^|;\\s*)tr_prefer_app=1(?:;|$)/.test(document.cookie || '')) {
        location.replace(APP_URL);
        return;
      }

      var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-pwa-install]'));
      var hint = document.querySelector('[data-pwa-install-hint]');
      var deferredPrompt = null;
      var installed =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

      function setHint(text) {
        if (!hint) return;
        hint.textContent = text || '';
        hint.classList.toggle('is-visible', Boolean(text));
      }

      function openApp() {
        window.location.assign(APP_URL);
      }

      function setLabels(label) {
        buttons.forEach(function (btn) {
          btn.textContent = label;
          btn.setAttribute('aria-label', label === 'Open app' ? 'Open theradio.fm app' : 'Install theradio.fm app');
        });
      }

      if (installed) {
        setLabels('Open app');
      }

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(function (reg) {
          if (reg && typeof reg.update === 'function') reg.update();
        }).catch(function () {});
      }

      window.addEventListener('beforeinstallprompt', function (event) {
        event.preventDefault();
        deferredPrompt = event;
        if (!installed) setLabels('Install');
        setHint('');
      });

      window.addEventListener('appinstalled', function () {
        deferredPrompt = null;
        installed = true;
        setLabels('Open app');
        setHint('');
        openApp();
      });

      buttons.forEach(function (btn) {
        btn.addEventListener('click', async function () {
          if (installed) {
            openApp();
            return;
          }

          if (deferredPrompt) {
            deferredPrompt.prompt();
            var choice = await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (choice && choice.outcome === 'accepted') {
              installed = true;
              setLabels('Open app');
              openApp();
            }
            return;
          }

          var isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
          if (isIos) {
            setHint('On iPhone or iPad: tap Share, then Add to Home Screen.');
            return;
          }

          openApp();
        });
      });
    })();
  </script>
</body>
</html>
`;
}
