/**
 * Single source of truth for site-wide settings.
 *
 * TODO(launch): `url` and `email` are deliberate placeholders on the reserved
 * `.example` domain. Replace them with the real domain and inbox before
 * deploying; the build prints a warning until you do.
 */
export const SITE = {
  name: 'Siya Labs',
  url: 'https://www.siyalabs.example',
  email: 'hello@siyalabs.example',
  tagline: 'Intelligent software, built with intention.',
  description:
    'Siya Labs builds AI automation, AI business assistants, cybersecurity software, AI-powered testing, and custom software, engineered to be reliable and secure.',
  locale: 'en_US',
} as const;

export const usesPlaceholders = SITE.url.includes('.example') || SITE.email.includes('.example');

export const NAV = [
  { label: 'Services', href: '/services/' },
  { label: 'About', href: '/about/' },
] as const;

/** Absolute URL for a site path, e.g. abs('/about/'). */
export const abs = (path: string) => new URL(path, SITE.url).toString();
