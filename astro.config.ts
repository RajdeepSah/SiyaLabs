import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { SITE, usesPlaceholders } from './src/config/site';

if (usesPlaceholders) {
  console.warn(
    '\n\x1b[33m[siya-labs] src/config/site.ts still uses the placeholder domain/email ' +
      `(${SITE.url}, ${SITE.email}). Replace them before launch.\x1b[0m\n`,
  );
}

const fontFile = (pkg: string, file: string) => `@fontsource/${pkg}/files/${file}`;

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  // No code blocks on this site; Shiki's inline styles would conflict with the CSP.
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/contact/thanks'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Sora',
      cssVariable: '--font-sora',
      fallbacks: ['sans-serif'],
      options: {
        variants: [{ src: [fontFile('sora', 'sora-latin-700-normal.woff2')], weight: 700, style: 'normal' }],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          { src: [fontFile('inter', 'inter-latin-400-normal.woff2')], weight: 400, style: 'normal' },
          { src: [fontFile('inter', 'inter-latin-500-normal.woff2')], weight: 500, style: 'normal' },
        ],
      },
    },
  ],
  security: {
    // Emits a hashed <meta http-equiv="content-security-policy"> on every page.
    // Header-only directives (frame-ancestors, HSTS…) live in public/_headers and vercel.json.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://api.web3forms.com",
        "form-action 'self' https://api.web3forms.com",
        "base-uri 'self'",
        "object-src 'none'",
      ],
    },
  },
});
