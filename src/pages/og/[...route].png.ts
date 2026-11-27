/**
 * Build-time social cards (1200×630 PNG) for every page, rendered with
 * satori (layout + text → SVG) and resvg (SVG → PNG). Static output only.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { services } from '../../data/services';
import { SITE } from '../../config/site';
import logo from '../../components/brand/logo.json';
import mark from '../../components/brand/mark.json';

type Card = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

const cards: Record<string, Card> = {
  home: {
    eyebrow: 'Applied AI · Cybersecurity · Software',
    title: 'Intelligent software, built with intention.',
  },
  services: { eyebrow: 'Services', title: 'What we build', subtitle: 'Five disciplines, delivered by one team.' },
  about: { eyebrow: 'About', title: 'We build technology that earns its place.' },
  contact: { eyebrow: 'Contact', title: 'Let’s build something intentional.' },
  privacy: { eyebrow: 'Legal', title: 'Privacy policy' },
  ...Object.fromEntries(
    services.map((s) => [
      `services/${s.slug}`,
      { eyebrow: `Service ${s.number}`, title: s.name, subtitle: s.short } satisfies Card,
    ]),
  ),
};

export const getStaticPaths = (() =>
  Object.entries(cards).map(([route, card]) => ({ params: { route }, props: card }))) satisfies GetStaticPaths;

const PINE = '#173631';
const IVORY = '#F7F3EA';
const MUTED = '#48605A';
const TERRACOTTA = '#A74934';

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 700; style: 'normal' }[]> | undefined;
const loadFonts = () =>
  (fontsPromise ??= Promise.all([
    ['Sora', 'sora/files/sora-latin-700-normal.woff', 700],
    ['Inter', 'inter/files/inter-latin-400-normal.woff', 400],
    ['Inter', 'inter/files/inter-latin-500-normal.woff', 500],
  ].map(async ([name, file, weight]) => ({
    name: name as string,
    data: await fs.readFile(path.join(process.cwd(), 'node_modules/@fontsource', file as string)),
    weight: weight as 400 | 500 | 700,
    style: 'normal' as const,
  }))));

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

const logoSvg = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logo.viewBox.join(' ')}" fill="${PINE}"><path d="${logo.mark.upper}"/><path d="${logo.mark.lower}"/><path d="${logo.wordmark}"/></svg>`,
);

// Construction drawing echoing the hero (circles fitted to the mark + 48° axis).
const decoSvg = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <g fill="none" stroke="${PINE}" stroke-width="1.1">
    <line x1="0" y1="84.8" x2="400" y2="84.8" stroke-opacity=".22"/>
    <line x1="0" y1="315.2" x2="400" y2="315.2" stroke-opacity=".22"/>
    <line x1="90.95" y1="0" x2="90.95" y2="400" stroke-opacity=".22"/>
    <line x1="309.05" y1="0" x2="309.05" y2="400" stroke-opacity=".22"/>
    <circle cx="180.65" cy="178.5" r="92.7" stroke-opacity=".3"/>
    <circle cx="232.25" cy="234.7" r="79" stroke-opacity=".3"/>
    <circle cx="200" cy="200" r="176" stroke-opacity=".3" stroke-dasharray="0.1 7" stroke-linecap="round" stroke-width="1.6"/>
  </g>
  <line x1="18.3" y1="400" x2="381.7" y2="0" stroke="${TERRACOTTA}" stroke-opacity=".6" stroke-width="1.1"/>
  <g transform="translate(90.95 84.8)" fill="${PINE}"><path d="${mark.paths.upper}"/><path d="${mark.paths.lower}"/></g>
  <circle cx="318.32" cy="69.72" r="5.5" fill="${TERRACOTTA}"/>
</svg>`);

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export const GET: APIRoute = async ({ props }) => {
  const card = props as Card;
  const fonts = await loadFonts();
  const titleSize = card.title.length > 34 ? 66 : 76;

  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'relative',
      backgroundColor: IVORY,
      fontFamily: 'Inter',
      color: PINE,
    },
    [
      h('img', { position: 'absolute', right: -70, top: 35, width: 560, height: 560 }, undefined, {
        src: decoSvg,
        width: 560,
        height: 560,
      }),
      h(
        'div',
        { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', width: 760 },
        [
          h('img', { width: 196, height: 48 }, undefined, { src: logoSvg, width: 196, height: 48 }),
          h('div', { display: 'flex', flexDirection: 'column' }, [
            h('div', { display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 500, letterSpacing: 2.6, textTransform: 'uppercase', color: MUTED }, [
              h('div', { width: 18, height: 2, backgroundColor: TERRACOTTA, marginRight: 16, transform: 'rotate(-48deg)' }),
              card.eyebrow,
            ]),
            h(
              'div',
              { marginTop: 22, fontFamily: 'Sora', fontWeight: 700, fontSize: titleSize, lineHeight: 1.04, letterSpacing: -titleSize * 0.035 },
              card.title,
            ),
            card.subtitle
              ? h('div', { marginTop: 22, fontSize: 28, lineHeight: 1.4, color: MUTED }, card.subtitle)
              : h('div', { display: 'none' }),
          ]),
          h('div', { display: 'flex', fontSize: 20, fontWeight: 500, color: MUTED }, new URL(SITE.url).hostname.replace(/^www\./, '')),
        ],
      ),
    ],
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
