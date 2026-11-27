import { defineConfig, devices } from '@playwright/test';

/**
 * Tests run against the production build (`npm run build` first, or use
 * `npm run test:full`). Chromium tests use the locally installed Google Chrome
 * (channel: 'chrome'). WebKit is opt-in (PW_WEBKIT=1) because it needs extra
 * system libraries: run `sudo npx playwright install-deps webkit` once.
 */
const PORT = 4322;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chrome-desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'chrome-mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
    ...(process.env.PW_WEBKIT === '1' ? [{ name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } }] : []),
  ],
  webServer: {
    command: `npx astro preview --port ${PORT} --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
