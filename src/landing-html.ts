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
  <url>
    <loc>https://play.theradio.fm/</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://browser.theradio.fm/</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://podcasts.theradio.fm/</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tubeflix.theradio.fm/</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': 'https://theradio.fm/#organization' },
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
        '@id': 'https://theradio.fm/#app',
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
              text: 'Yes. Live radio, station browsing, podcasts, and music videos are free. No subscription and no login required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need an account to listen?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Open theradio.fm and press play. You can listen live, tune world stations, play podcasts, or watch videos without creating an account.',
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
    .actions a {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 12px 16px;
      border-radius: 12px;
      background: var(--panel);
      border: 1px solid var(--line);
      text-decoration: none;
      font-weight: 700;
      text-align: center;
    }
    .actions a.primary {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .actions a.primary:hover { background: var(--accent-press); }
    .offers { padding: 8px 0 28px; }
    .offers h2, .listen h2, .faq h2 {
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
    .listen { padding: 0 0 28px; }
    .player {
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
      background: #000;
      min-height: 70vh;
    }
    .player iframe {
      display: block;
      width: 100%;
      height: 70vh;
      min-height: 560px;
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
    footer.site a {
      display: inline-flex;
      align-items: center;
      min-height: 48px;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    @media (min-width: 720px) {
      .actions { grid-template-columns: repeat(4, 1fr); }
      .cards { grid-template-columns: 1fr 1fr; }
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
        <a href="https://play.theradio.fm/">Live radio</a>
        <a href="https://browser.theradio.fm/">World stations</a>
        <a href="https://podcasts.theradio.fm/">Podcasts</a>
        <a href="https://tubeflix.theradio.fm/">Music videos</a>
      </nav>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading">Listen to live radio, playlists, podcasts and music videos</h1>
        <p class="lead">Tune in to theradio.fm live, browse thousands of stations from every country, play podcasts, or watch music videos on TubeFlix. Free streaming in your browser — no account and no paywall.</p>
        <ul class="actions">
          <li><a class="primary" href="#listen">Listen live</a></li>
          <li><a href="https://browser.theradio.fm/">Browse stations</a></li>
          <li><a href="https://podcasts.theradio.fm/">Play podcasts</a></li>
          <li><a href="https://tubeflix.theradio.fm/">Watch music videos</a></li>
        </ul>
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

      <section class="listen" id="listen" aria-labelledby="listen-heading">
        <h2 id="listen-heading">On air and in the journal</h2>
        <div class="player">
          <iframe
            src="https://theradiofm.webradiosite.com/"
            title="theradio.fm live radio and stories"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            loading="eager"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
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
          <p>Use <a href="https://theradio.fm/app">the theradio.fm app</a> for the tabbed player, or jump straight to <a href="https://play.theradio.fm/">live radio</a>, <a href="https://browser.theradio.fm/">world stations</a>, <a href="https://podcasts.theradio.fm/">podcasts</a>, or <a href="https://tubeflix.theradio.fm/">music videos</a>.</p>
        </details>
      </section>
    </main>

    <footer class="site">
      <nav aria-label="Footer">
        <a href="${CANONICAL}">Home</a>
        <a href="https://theradio.fm/app">Open the app</a>
        <a href="https://play.theradio.fm/">Live radio</a>
        <a href="https://browser.theradio.fm/">World stations</a>
        <a href="https://podcasts.theradio.fm/">Podcasts</a>
        <a href="https://tubeflix.theradio.fm/">Music videos</a>
        <a href="https://theradio.fm/pages/privacy">Privacy policy</a>
      </nav>
      <p>theradio.fm offers free live radio, playlists, podcasts and music videos. No login required.</p>
    </footer>
  </div>
</body>
</html>
`;
}
