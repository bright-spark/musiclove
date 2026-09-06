# Contributing to musiclove

Thank you for your interest in improving **musiclove** — the open-source project behind [theradio.fm](https://theradio.fm).

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

* Report bugs and suggest features via [GitHub Issues](https://github.com/bright-spark/musiclove/issues)
* Improve documentation, accessibility, or SEO copy
* Fix bugs or polish the PWA / landing experience
* Share feedback on streaming UX (desktop and mobile)

We welcome thoughtful, focused contributions. Large redesigns or new third-party embeds should be discussed in an issue first.

## Development setup

**Requirements:** Node.js 24+, [pnpm](https://pnpm.io) 10+

```bash
git clone https://github.com/bright-spark/musiclove.git
cd musiclove
pnpm install
pnpm start          # static local server
# or
pnpm run build      # compile Worker embeds + deploy-static
pnpm exec wrangler dev
```

Useful scripts:

| Script | Purpose |
|--------|---------|
| `pnpm start` | Local static preview |
| `pnpm run build` | Build Worker + sync static assets |
| `pnpm run test:worker` | Smoke-test Worker routing |
| `pnpm run deploy:cloudflare` | Deploy to Cloudflare (maintainers) |

## Pull request guidelines

1. **Branch** from the default branch with a clear name (`fix/…`, `docs/…`, `feat/…`).
2. **Scope** — keep PRs focused; avoid unrelated refactors.
3. **Test** — run `pnpm run test:worker` when changing Worker or landing behavior.
4. **Describe** — explain *why*, how to verify, and any screenshots for UI changes.
5. **Respect content** — do not add scraped media, DRM circumvention, or private credentials.
6. **License** — contributions are accepted under the project [MIT License](LICENSE).

## Code style

* Match existing patterns in the files you touch.
* Prefer small, readable changes over drive-by rewrites.
* Do not commit secrets (`.env`, API keys, tokens).
* For landing HTML served by the Worker, edit `src/landing-html.ts` (not only a static copy).

## Issue etiquette

* Search existing issues before opening a new one.
* Include OS/browser, URL, and steps to reproduce for bugs.
* Be kind — musiclove is a personal project maintained with care.

## Questions

* Community / product: see [SUPPORT.md](SUPPORT.md)
* Security: see [SECURITY.md](SECURITY.md)
* Conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · **studio@theradio.fm**
