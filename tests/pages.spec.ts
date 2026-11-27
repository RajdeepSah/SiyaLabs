import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { SITE } from '../src/config/site';

for (const route of ROUTES) {
  test(`page integrity: ${route}`, async ({ page }) => {
    const problems: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') problems.push(msg.text());
    });
    page.on('pageerror', (err) => problems.push(err.message));

    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Siya Labs/);

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0).toBeGreaterThan(50);
    expect(description?.length ?? 0).toBeLessThanOrEqual(160);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(new URL(route, SITE.url).toString());
    expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(/\/og\/.+\.png$/);

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const graph = JSON.parse(jsonLd ?? '{}')['@graph'] as { '@type': string }[];
    expect(graph.map((n) => n['@type'])).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'Person']));

    // Meta CSP is emitted on every page.
    expect(await page.locator('meta[http-equiv="content-security-policy"]').count()).toBe(1);

    // Every image has alt text; no horizontal overflow.
    expect(await page.locator('img:not([alt])').count()).toBe(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    expect(problems, problems.join('\n')).toEqual([]);
  });
}

test('404 page returns 404 and is noindex', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText(/gone missing/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('internal links resolve', async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const links = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')!));
    links.forEach((l) => hrefs.add(l.split('#')[0] || '/'));
  }
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test('sitemap, robots and social cards are served', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Sitemap:');
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).not.toContain('/contact/thanks');
  for (const og of ['home', 'about', 'services/ai-automation']) {
    const res = await request.get(`/og/${og}.png`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  }
});
