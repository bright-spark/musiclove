# Security Policy

## Supported versions

Security fixes are applied to the **latest deployed** musiclove / [theradio.fm](https://theradio.fm) release on the default branch. Older tags or forks are not actively patched.

| Version | Supported |
|---------|-----------|
| Latest `main` / production deploy | Yes |
| Older releases / forks | No |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report privately to:

**studio@theradio.fm**

Include:

* A clear description of the issue
* Steps to reproduce or a proof of concept (where safe)
* Affected URLs, browsers, or Worker paths if known
* Your preferred contact method for follow-up

You should receive an acknowledgement within a few days. We will investigate and, where appropriate, ship a fix and credit reporters who wish to be named.

## Scope

In scope examples:

* Cross-site scripting (XSS) in first-party pages or Worker-served HTML
* Open redirects that abuse theradio.fm trust
* Service worker cache poisoning or session/cookie misuse on theradio.fm
* Exposure of secrets or privileged Cloudflare/GitHub configuration via the repo

Out of scope examples:

* Issues solely in third-party embeds (YouTube, radio stream hosts, analytics vendors)
* Denial of service against public CDNs or upstream stream providers
* Social engineering of end users
* Reports that require breaking DRM or accessing non-public media

## Safe harbor

We will not pursue legal action against researchers who:

* Act in good faith and avoid privacy violations, data destruction, or service disruption
* Do not exploit the issue beyond what is needed to demonstrate it
* Report findings promptly and keep them confidential until a fix is available

## Related

* [Code of Conduct](CODE_OF_CONDUCT.md)
* [Support & takedowns](SUPPORT.md)
* Privacy policy: https://theradio.fm/pages/privacy
