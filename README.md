# Siya Labs website

The company website for Siya Labs. It is a static Astro 6 site, styled with Tailwind CSS v4.

- **Fast.** Lighthouse scores 100 in every category on mobile. Most pages ship about 1.3 KB of gzipped JavaScript.
- **Accessible.** Automated axe checks against WCAG 2.2 AA report no violations.
- **Secure.** A strict, hash-based Content Security Policy is emitted on every page. There are no third-party scripts.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
npm run check      # TypeScript + Astro diagnostics
```

Requires Node 22.12 or newer.

## Before launch

1. **Domain and email.** Replace the placeholders in `src/config/site.ts`:
   - `url` (currently `https://www.siyalabs.example`)
   - `email` (currently `hello@siyalabs.example`)

   The build prints a warning until you do. Canonical URLs, the sitemap, robots.txt, social cards and structured data all update from this one file.
2. **Contact form.** Create a free access key at [web3forms.com](https://web3forms.com). Set it as `PUBLIC_WEB3FORMS_KEY` in your host's environment variables, or in `.env` locally (see `.env.example`). Without a key, the form falls back to opening the visitor's email app, so it never fails silently.
3. **Review the copy.**
   - The privacy policy (`src/pages/privacy.astro`) is a plain-language template. Have it reviewed if needed.
   - The "what happens next" steps live in `src/data/company.ts`.
   - Founder details live in `src/data/founder.ts`.
4. **After deploying,** submit `https://<your-domain>/sitemap-index.xml` in Google Search Console.

## Editing content

All copy lives in typed data files, so you can change wording without touching components.

| File | What it controls |
| --- | --- |
| `src/config/site.ts` | Name, domain, email, tagline, meta description, navigation |
| `src/data/services.ts` | All five services: names, summaries, capabilities, approach, applications, SEO text. Feeds the home page, `/services`, each service page, the footer, the menu and structured data. |
| `src/data/company.ts` | Principles, process, mission and vision, differentiators, contact next steps |
| `src/data/founder.ts` | Founder bio, background, expertise and links. These are verified facts from rajdeep.officialework.com; keep it that way. |

Pages are in `src/pages/`. Service pages are generated from `src/pages/services/[slug].astro`.

## Project structure

```
src/
  config/site.ts            site-wide settings (single source of truth)
  data/                     all copy
  layouts/BaseLayout.astro  <head>, SEO, fonts, header/footer
  components/
    brand/                  Mark + Logo (vector, traced from the brand sheet)
    graphics/               HeroMark + one animated diagram per service
    home/ about/ contact/   page sections
    layout/ seo/ ui/        header, menu, footer, SEO, buttons, etc.
  pages/                    routes, incl. og/[...route].png.ts (social cards) and robots.txt.ts
  scripts/                  site.ts (~1.3 KB gz) and contact-form.ts
  styles/global.css         brand tokens, type scale, motion rules
public/
  brand/                    downloadable logo files (SVG + PNG)
  favicon.*, icons, site.webmanifest
  _headers, ../vercel.json  security + caching headers
scripts/                    one-off brand/portrait pipelines (outputs are committed)
design/                     source artwork (brand sheet, original portrait)
tests/                      Playwright + axe tests
```

## Brand system

- **Colors.** Pine `#173631`, Ivory `#F7F3EA`, Terracotta `#A74934`, defined as tokens in `src/styles/global.css`.
  - Every text and background pairing meets WCAG AA.
  - Never put terracotta text on pine (2.27:1). Use `terracotta-soft` (`#E08F77`) on dark backgrounds.
- **Type.**
  - Sora 700 for the wordmark and headings.
  - Inter 400 for body text.
  - Inter 500 for buttons and labels.
  - Fonts are self-hosted through Astro's Fonts API, with metric-matched fallbacks so text doesn't shift as fonts load.
- **Logo.** The S mark is a vector traced from `design/siya-labs-brand-reference.png` (99.2% overlap with the original). The wordmark is Sora Bold converted to outlines and spaced to match the reference.
  - Regenerate the vectors with `npm run brand:trace` and `npm run brand:build`.
  - Logo files for everyday use are in `public/brand/`.
- **Graphics.** Every illustration is built from the logo's own geometry: circular arcs, the shared 48° axis of its cuts, and the S-curve. Each one uses a single terracotta accent.
  - Animations run only while visible.
  - They respect `prefers-reduced-motion`.
  - Without JavaScript they show a finished, static frame.
- **Portrait.** The warm monochrome treatment comes from `scripts/build-portrait.mjs`. For the original colors, pass `tone="natural"` to `FounderPortrait`.

## Testing

```bash
npm run build && npm test     # Playwright: integrity, links, axe (WCAG 2.2 AA), interactions, no-JS
npm run lighthouse            # Lighthouse CI: perf ≥ 95, a11y/best-practices/SEO = 100
PW_WEBKIT=1 npm test          # also run Safari's engine (one-time: sudo npx playwright install-deps webkit)
```

The Chromium tests use your installed Google Chrome, so no browser download is needed.

## Deployment

The site is fully static. On any host, use build command `npm run build`, publish directory `dist`, and Node 22.

- **Netlify / Cloudflare Pages.** `public/_headers` sets HSTS, `frame-ancestors`, nosniff, Referrer-Policy and Permissions-Policy, plus long-lived caching for hashed assets.
- **Vercel.** `vercel.json` sets the same headers.

The script and style CSP is emitted per page by Astro as a hashed `<meta>` tag. That is configured with `security.csp` in `astro.config.ts`; if you add a third-party service, allow it there.

## Upgrading to Astro 7

The project uses Astro 6 because this machine runs Node 22.22.1, and Astro 7 needs Node 22.23.4 or newer. After updating Node, run `npx @astrojs/upgrade`. Two Astro 7 changes affect this site:

- **Rust compiler.** The compiler is now stricter about unclosed tags. The markup here is already valid.
- **Whitespace.** `compressHTML` now defaults to `'jsx'`, which removes whitespace between inline elements. The hero headline already uses an explicit `&#32;` space, so it is safe.
