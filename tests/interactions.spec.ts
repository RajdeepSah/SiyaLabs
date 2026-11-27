import { test, expect } from '@playwright/test';

test('mobile menu is keyboard accessible', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const toggle = page.locator('[data-menu-open]');
  await toggle.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('dialog[data-mobile-nav]');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  // Focus is inside the dialog.
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('header gains a background after scrolling', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('[data-header]');
  await expect(header).not.toHaveAttribute('data-scrolled', '');
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
  await expect(header).toHaveAttribute('data-scrolled', '');
});

test('services index preview follows hover', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop only');
  await page.goto('/');
  const rows = page.locator('[data-service-row]');
  await rows.nth(2).scrollIntoViewIfNeeded();
  await rows.nth(2).hover();
  await expect(page.locator('[data-service-slide]').nth(2)).toHaveAttribute('data-active', '');
  await expect(rows.nth(2)).toHaveAttribute('data-active', '');
});

test('contact form validates and submits', async ({ page }) => {
  await page.goto('/contact/');
  const form = page.locator('[data-contact-form]');
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.locator('#cf-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#cf-email-error')).toHaveText(/valid email/);
  await expect(page.locator('#cf-name')).toBeFocused();

  // Simulate a configured Web3Forms key and mock the API.
  await page.evaluate(() => {
    const f = document.querySelector<HTMLFormElement>('[data-contact-form]')!;
    f.dataset.endpoint = 'https://api.web3forms.com/submit';
    const key = document.createElement('input');
    key.type = 'hidden';
    key.name = 'access_key';
    key.value = 'test-key';
    f.append(key);
  });
  let payload: Record<string, string> = {};
  await page.route('https://api.web3forms.com/submit', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });

  await page.fill('#cf-name', 'Ada Lovelace');
  await page.fill('#cf-email', 'ada@example.com');
  await form.getByLabel('AI Automation').check();
  await form.getByLabel('AI Software Testing').check();
  await page.fill('#cf-message', 'We would like to automate our invoice processing workflow.');
  await page.getByRole('button', { name: /send message/i }).click();

  await expect(page.locator('[data-success]')).toBeVisible();
  await expect(form).toBeHidden();
  expect(payload).toMatchObject({
    access_key: 'test-key',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    interests: 'AI Automation, AI Software Testing',
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('all content is visible and graphics are static', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    const hidden = await page.$$eval('[data-reveal]', (els) =>
      els.filter((el) => getComputedStyle(el).opacity !== '1').length,
    );
    expect(hidden).toBe(0);
    const animated = await page.$$eval('.gfx *', (els) =>
      els.filter((el) => getComputedStyle(el).animationName !== 'none').length,
    );
    expect(animated).toBe(0);
  });
});
