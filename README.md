# The better and improved red version of Music Love filled with mo͞ozik & l o v e [theradio.fm](https://theradio.fm) is a simple PWA stream browser.

## theradio.fm is a structured PWA browser mainly serving streaming content from my YouTube Channel: [mo͞ozik @theradiostream](https://www.youtube.com/@theradiostream)

### About
theradio.fm is mobile first and easy to use. It runs on all desktop and mobile devices. Sometimes allowed to deliver South African live radio, or the latest YouTube music videos and YouTube radio. Pivoting on Twitter and some other social media which is used for simple promotion and reach.

Inspired by my love for music, radio and people! Dedicated to my dad who never stopped supporting me or my research.

### Community & docs

| Document | Purpose |
|----------|---------|
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Expected behavior in the community |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to develop and submit changes |
| [SECURITY.md](SECURITY.md) | How to report vulnerabilities |
| [SUPPORT.md](SUPPORT.md) | Help, contact, and content takedowns |
| [LICENSE](LICENSE) | MIT License |

### Tooling
[Framework7](https://framework7.io) and [Thorium Builder](https://thoriumbuilder.com) used for framework, scaffolding and design. Github for source control, automation and static hosting.  Not to mention stacks of trial and error including extreme determination! 

### Summary:
In essence the theradio.fm is pre configured to aggregate existing open streaming media in a structured browser enhancing the StreamBrowser user experience.

### Legal:
Thanking all external media sources and services, whom each remain the rightful owners of their own individual content and copyright. The content is merely aggregated and the user directed to the url when they use the StreamBrowser of theradio.fm and the sources are never owned or modified at all.

### Content:
Only open social media or public facing websites are browsed or aggregated in the StreamBrowser of theradio.fm. No attempts are made to decrypt or bypass any digital rights management at all.  The sources are freely available online and the StreamBrowser of theradio.fm only contains links to these. In some cases for example the Rebrandly Link Gallery in the StreamBrowser of theradio.fm publicly available url links are used to navigate the user to the resources outside the StreamBrowser by piping up the site that is linked to the dashboard.  The users are simply redirected to the respective websites or content by the StreamBrowser of theradio.fm. They are then in turn navigated back to the origin, which in this case is the StreamBrowser of theradio.fm.  All efforts are made to present this seamlessly within the StreamBrowser of theradio.fm to the user. All efforts are made to enhance and perfect the StreamBrowser of theradio.fm and the user's in-app experience.  The content is not copied, modified, filtered or altered at all. The StreamBrowser of theradio.fn acts just like any modern browser like Google Chrome or Apple Safari except the destinations can't be determined by the user, yet they can still navigate to the destination included in the structure of the StreamBrowser of theradio.fm as they choose giving them a typical app like experience instead of a simple browser.

### Design & Architecture:

Hosting:      Namecheap, Cloudflare, Vercel
DevOps:       Github, Netlify, Cloudflare, Vercel
Social:       Twitter, Facebook, Instagram, Whatsapp, Gooogle, Apple, Microsoft
Images:       Pintrest, Canva, Adobe Express
Audio/Video:  Shazam, YouTube, Selected South African and Namibian Radio Stations

### Deploy to Vercel

Thanks to Vercel for their support of open-source software.

Production for [theradio.fm](https://theradio.fm) is primarily on Cloudflare Workers. Vercel is a supported static hosting path for the PWA shell and assets (see `vercel.json`).

**Requirements:** Node.js 24+, [pnpm](https://pnpm.io) 10+, and a [Vercel](https://vercel.com) account.

```bash
git clone https://github.com/bright-spark/musiclove.git
cd musiclove
pnpm install

# First time: log in, then link this repo to your Vercel project
npx vercel login
npx vercel link

# Preview deployment
pnpm run deploy:vercel:preview
# or: npx vercel

# Production deployment
pnpm run deploy:vercel
# or: npx vercel --prod
```

Notes:

* Deploy **from this `musiclove` directory** — do not link another repo (for example `play`) to the musiclove Vercel project.
* The build runs `pnpm run build`, which compiles TypeScript, syncs Worker embeds, copies `index.html` → `app.html`, and generates `landing.html`. On Vercel, `landing.html` is copied over `index.html` so `/` is the marketing landing and `/app` is the Framework7 shell.
* Edge Middleware (`middleware.js`) sets the prefer-app cookie on `/app`, redirects `/` → `/app` when that cookie is present, and clears it on `/reset` (same behavior as the Cloudflare Worker).
* Cookie-based `/` → `/app` redirects and the first-party landing also run on Cloudflare Workers (`src/index.ts`) when traffic is proxied there.

### Takedowns
Any takedown requests will always be considered, and should be addressed to: studio@theradio.fm — see [SUPPORT.md](SUPPORT.md) for the preferred format. You may also first make direct contact with Martin Myburgh on [+27847801119](tel:+27847801119).
