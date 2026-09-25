import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:8094',
    viewport: { width: 1440, height: 1000 },
    headless: true,
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: ['--no-sandbox'],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
