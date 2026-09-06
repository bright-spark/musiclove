const CANONICAL = 'https://theradio.fm/';
const ICON_512 = 'https://theradio.fm/icons/apple-touch-icon-512x512.png';

export const SITE_TITLE =
  'Free Live Radio, Playlists, Podcasts & Music Videos | theradio.fm';

export const SITE_DESCRIPTION =
  'Listen to live radio, browse stations worldwide, play podcasts, and watch music videos on theradio.fm. Free streaming, no login required.';

export const ROBOTS_TXT = `User-agent: *
Allow: /
Allow: /app
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
        alternateName: ['the radio', 'the radio fm', 'theradio'],
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
        numberOfItems: 4,
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
  <link rel="canonical" href="${CANONICAL}" />
  <link rel="sitemap" type="application/xml" href="https://theradio.fm/sitemap.xml" />
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
      --panel: #121212;
      --text: #f4f4f5;
      --muted: #a1a1aa;
      --line: #27272a;
      --accent: #e11d48;
      --accent-press: #be123c;
    }
    * { box-sizing: border-box; }
    html { background: var(--bg); color: var(--text); }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      background: var(--bg);
      color: var(--text);
    }
    a { color: inherit; }
    img { border: 0; }
    .skip {
      position: absolute;
      left: 12px;
      top: -48px;
      z-index: 20;
      padding: 12px 16px;
      background: #fff;
      color: #111;
      font-weight: 700;
      text-decoration: none;
      border-radius: 8px;
    }
    .skip:focus { top: 12px; }
    .wrap { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
    header.site {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 0 8px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-weight: 800;
      letter-spacing: -0.03em;
      min-height: 48px;
    }
    .brand img { width: 40px; height: 40px; border-radius: 999px; }
    nav.primary { display: flex; flex-wrap: wrap; gap: 8px; }
    nav.primary a {
      display: inline-flex;
      align-items: center;
      min-height: 48px;
      padding: 0 12px;
      color: var(--muted);
      text-decoration: none;
      font-weight: 600;
    }
    nav.primary a:hover { color: var(--text); }
    .hero { padding: 20px 0 28px; }
    .hero .kicker {
      margin: 0 0 10px;
      color: #fda4af;
      font-size: 0.8125rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .hero h1 {
      margin: 0 0 14px;
      font-size: clamp(1.85rem, 5vw, 3rem);
      line-height: 1.12;
      letter-spacing: -0.04em;
      max-width: 18ch;
      text-wrap: balance;
    }
    .hero .lead {
      margin: 0 0 22px;
      max-width: 42rem;
      color: var(--muted);
      font-size: 1.125rem;
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
    .actions a,
    .actions button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 48px;
      padding: 12px 16px;
      border-radius: 12px;
      background: var(--panel);
      border: 1px solid var(--line);
      color: var(--text);
      text-decoration: none;
      font: inherit;
      font-weight: 700;
      text-align: center;
      cursor: pointer;
    }
    .actions a.primary {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .actions a.primary:hover { background: var(--accent-press); }
    .actions button:hover { color: #fda4af; border-color: #fda4af; }
    .actions button[hidden] { display: none; }
    .install-hint {
      display: none;
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 0.95rem;
    }
    .install-hint.is-visible { display: block; }
    nav.primary button {
      display: inline-flex;
      align-items: center;
      min-height: 48px;
      padding: 0 12px;
      border: 0;
      background: transparent;
      color: var(--muted);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    nav.primary button:hover { color: var(--text); }
    nav.primary button[hidden] { display: none; }
    .offers { padding: 8px 0 28px; }
    .offers h2, .listen h2, .faq h2, .how h2 {
      margin: 0 0 14px;
      font-size: 1.25rem;
      letter-spacing: -0.03em;
    }
    .cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .cards article {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px;
    }
    .cards h3 { margin: 0 0 6px; font-size: 1.05rem; }
    .cards h3 a { text-decoration: none; }
    .cards h3 a:hover { color: #fda4af; }
    .cards p { margin: 0; color: var(--muted); }
    .how { padding: 0 0 28px; }
    .how ol {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
      counter-reset: step;
    }
    .how li {
      counter-increment: step;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px 16px 16px 56px;
      position: relative;
      color: var(--muted);
    }
    .how li::before {
      content: counter(step);
      position: absolute;
      left: 16px;
      top: 16px;
      width: 28px;
      height: 28px;
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
    .listen { padding: 0 0 28px; }
    .player {
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
      background: #000;
      min-height: calc(77vh + 30px);
    }
    .player iframe {
      display: block;
      width: 100%;
      height: calc(77vh + 30px);
      min-height: 640px;
      border: 0;
    }
    .faq { padding: 0 0 36px; }
    .faq details {
      border-top: 1px solid var(--line);
      padding: 12px 0;
    }
    .faq summary {
      cursor: pointer;
      font-weight: 700;
      min-height: 48px;
      display: flex;
      align-items: center;
    }
    .faq p { margin: 0 0 8px; color: var(--muted); }
    footer.site {
      border-top: 1px solid var(--line);
      padding: 20px 0 32px;
      color: var(--muted);
    }
    footer.site nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 16px;
      margin-bottom: 10px;
    }
    footer.site a,
    footer.site button {
      display: inline-flex;
      align-items: center;
      min-height: 48px;
      text-decoration: underline;
      text-underline-offset: 3px;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
      padding: 0;
    }
    @media (min-width: 720px) {
      .actions { grid-template-columns: repeat(4, 1fr); }
      .cards { grid-template-columns: 1fr 1fr; }
      .how ol { grid-template-columns: repeat(3, 1fr); }
    }
  </style>
</head>
<body>
  <a class="skip" href="#listen">Skip to live radio</a>
  <div class="wrap">
    <header class="site">
      <a class="brand" href="${CANONICAL}">
        <img src="${icon512}" width="40" height="40" alt="theradio.fm logo" />
        <span>theradio.fm</span>
      </a>
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
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-heading">
        <p class="kicker">Free internet radio &amp; music</p>
        <h1 id="hero-heading">Listen to live radio, playlists, podcasts and music videos</h1>
        <p class="lead">Tune in to theradio.fm live, browse thousands of internet radio stations from every country, play podcasts, or watch music videos on TubeFlix. Free streaming in your browser — no account and no paywall.</p>
        <ul class="actions">
          <li><a class="primary" href="#listen">Listen live</a></li>
          <li><a href="https://theradio.fm/app">App mode</a></li>
          <li><a href="https://theradio.fm/pages/frontpage">Blog</a></li>
          <li><a href="https://browser.theradio.fm/">Browse stations</a></li>
          <li><a href="https://podcasts.theradio.fm/">Play podcasts</a></li>
          <li><a href="https://tubeflix.theradio.fm/">Watch music videos</a></li>
          <li><a href="https://play.google.com/store/apps/details?id=fm.theradio.play">Android app</a></li>
          <li><button type="button" class="pwa-install" data-pwa-install>Install</button></li>
        </ul>
        <p class="install-hint" data-pwa-install-hint role="status" aria-live="polite"></p>
      </section>

      <section class="offers" aria-labelledby="offers-heading">
        <h2 id="offers-heading">What you can do on theradio.fm</h2>
        <div class="cards">
          <article>
            <h3><a href="https://play.theradio.fm/">Listen to live internet radio</a></h3>
            <p>Press play on theradio.fm live. See the current track, artwork, and stay with the stream — no app install required.</p>
          </article>
          <article>
            <h3><a href="https://browser.theradio.fm/">Browse radio stations worldwide</a></h3>
            <p>Explore live stations by country and genre. Tune in instantly from a worldwide radio browser.</p>
          </article>
          <article>
            <h3><a href="https://podcasts.theradio.fm/">Play and follow podcasts</a></h3>
            <p>Pick a show, play the latest episode, and keep listening in a focused podcast player.</p>
          </article>
          <article>
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
            src="https://theradiofm.webradiosite.com"
            title="theradio.fm live radio and stories"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone; fullscreen"
            allowfullscreen></iframe>
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
