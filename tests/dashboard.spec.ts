import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

async function login(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Plotëso të dhënat demo' }).click();
  await page.getByRole('button', { name: 'Hyr në MarketOne' }).click();
  await expect(
    page.getByRole('article', { name: 'Domate të freskëta', exact: true }),
  ).toBeVisible();
}

async function screenshot(page: Page, name: string) {
  await mkdir('docs/screenshots', { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: false });
}

test('login validation, password visibility and session', async ({ page }) => {
  await page.goto('/');
  await screenshot(page, 'login-desktop');
  await page.getByLabel('Adresa e email-it').fill('wrong@example.com');
  await page.getByLabel('Fjalëkalimi', { exact: true }).fill('wrong');
  await page.getByRole('button', { name: 'Shfaq fjalëkalimin' }).click();
  await expect(page.getByLabel('Fjalëkalimi', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hyr në MarketOne' }).click();
  await expect(page.getByRole('alert')).toContainText('nuk është i saktë');
  await page.getByRole('button', { name: 'Plotëso të dhënat demo' }).click();
  await page.getByRole('button', { name: 'Hyr në MarketOne' }).click();
  await expect(page.getByRole('article')).toHaveCount(18);
  await page.reload();
  await expect(page.getByRole('article')).toHaveCount(18);
});

test('catalog search, categories, stock filters, ordering and no results', async ({ page }) => {
  await login(page);
  await screenshot(page, 'dashboard-desktop');
  await page.getByRole('searchbox').fill('qumesht');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article')).toHaveAccessibleName('Qumësht i freskët');
  await page.getByRole('searchbox').fill('nuk-ekziston');
  await expect(page.getByText('Nuk gjetëm produkte.')).toBeVisible();
  await page.getByRole('button', { name: 'Shfaq të gjitha produktet' }).click();
  await page.getByRole('button', { name: 'Furrë', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(2);
  await page.getByRole('button', { name: 'Të gjitha', exact: true }).click();
  await page.locator('.stock-filter').click();
  await expect(page.getByRole('article')).toHaveCount(16);
  await page.getByLabel('Rendit produktet').selectOption('price-asc');
  await expect(page.getByRole('article').first()).toHaveAccessibleName('Kruasan me gjalpë');
  await page.getByRole('button', { name: 'Paraqitje me listë' }).click();
  await expect(page.locator('.product-grid')).toHaveClass(/list-view/);
});

test('stock cap, exact totals, refresh persistence, removal and clear confirmation', async ({
  page,
}) => {
  await login(page);
  await expect(
    page.getByRole('button', { name: 'Shto Mollë të kuqe në porosi', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Shto Avokado Hass në porosi', exact: true }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Shto edhe një Avokado Hass', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Shto edhe një Avokado Hass', exact: true }),
  ).toBeDisabled();
  await expect(page.getByTestId('cart-total')).toContainText(/6[,.]40/);
  await page.getByRole('button', { name: 'Shto Qumësht i freskët në porosi', exact: true }).click();
  await expect(page.getByTestId('cart-total')).toContainText(/7[,.]85/);
  await page.reload();
  await expect(page.getByTestId('cart-total')).toContainText(/7[,.]85/);
  await page.getByRole('button', { name: 'Hiq Avokado Hass nga porosia' }).click();
  await expect(page.getByTestId('cart-total')).toContainText(/1[,.]45/);
  await page.getByRole('button', { name: 'Zbraz porosinë', exact: true }).click();
  await page.getByRole('button', { name: 'Mbaje porosinë' }).click();
  await expect(page.getByTestId('cart-total')).toContainText(/1[,.]45/);
  await page.getByRole('button', { name: 'Zbraz porosinë', exact: true }).click();
  await page.getByRole('button', { name: 'Po, zbraz porosinë' }).click();
  await expect(page.getByTestId('cart-total')).toContainText(/0[,.]00/);
  await expect(page.getByRole('button', { name: 'Rishiko porosinë' })).toBeDisabled();
});

test('review, simulated confirmation and receipt download', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await login(page);
  for (const name of ['Domate të freskëta', 'Avokado Hass', 'Bukë artizanale']) {
    await page.getByRole('button', { name: `Shto ${name} në porosi`, exact: true }).click();
  }
  await screenshot(page, 'dashboard-order');
  await page.getByRole('button', { name: 'Rishiko porosinë' }).click();
  await expect(page.getByRole('dialog')).toContainText(/5[,.]70/);
  await page.getByRole('button', { name: 'Konfirmo porosinë demo' }).click();
  await expect(page.getByRole('dialog', { name: 'Porosia u përgatit' })).toBeVisible();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Shkarko përmbledhjen' }).click();
  expect((await downloadEvent).suggestedFilename()).toMatch(/^MO-.*\.txt$/);
  await page.getByRole('button', { name: 'Vazhdo te produktet' }).click();
  await expect(page.getByTestId('cart-total')).toContainText(/0[,.]00/);
  expect(errors).toEqual([]);
});

test('loading, error with retry, empty state and dialog keyboard behavior', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Version demo', exact: true }).click();
  await page.getByRole('button', { name: /Ngarkim i ngadaltë/ }).click();
  await expect(page.locator('[aria-busy="true"]')).toBeVisible();
  await page.getByRole('button', { name: 'Kthehu te katalogu' }).click();
  await expect(page.getByRole('article')).toHaveCount(18);
  await page.getByRole('button', { name: 'Version demo', exact: true }).click();
  await page.getByRole('button', { name: /Gabim në ngarkim/ }).click();
  await expect(page.getByRole('alert')).toContainText('Nuk mundëm');
  await page.getByRole('button', { name: 'Provo përsëri' }).click();
  await expect(page.getByRole('article')).toHaveCount(18);
  await page.getByRole('button', { name: 'Version demo', exact: true }).click();
  await page.getByRole('button', { name: /Katalog bosh/ }).click();
  await expect(page.getByText('Katalogu është ende bosh.')).toBeVisible();
  await page.getByRole('button', { name: 'Rifresko katalogun' }).click();
  await expect(page.getByRole('article')).toHaveCount(18);
  await page.getByRole('button', { name: 'Version demo', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Version demo', exact: true })).toBeFocused();
});

test('real network failures recover and malformed data is caught', async ({ page }) => {
  await page.route('**/data/products.json', (route) =>
    route.fulfill({ status: 500, body: 'unavailable' }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Plotëso të dhënat demo' }).click();
  await page.getByRole('button', { name: 'Hyr në MarketOne' }).click();
  await expect(page.getByRole('alert')).toContainText('nuk është i disponueshëm');
  await page.unroute('**/data/products.json');
  await page.getByRole('button', { name: 'Provo përsëri' }).click();
  await expect(page.getByRole('article')).toHaveCount(18);
  await page.route('**/data/products.json', (route) =>
    route.fulfill({ json: [{ priceCents: -1 }] }),
  );
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('paplota');
});

test('mobile order and responsive layouts stay inside viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await screenshot(page, 'login-mobile');
  await login(page);
  await screenshot(page, 'dashboard-mobile');
  await page
    .getByRole('button', { name: 'Shto Domate të freskëta në porosi', exact: true })
    .click();
  await page.locator('.mobile-cart-trigger').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByTestId('cart-total')).toContainText(/1[,.]90/);
  await screenshot(page, 'order-mobile');
  await page.keyboard.press('Escape');
  for (const width of [320, 375, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.getByRole('button', { name: 'Paraqitje me listë' }).click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.getByRole('button', { name: 'Paraqitje me karta' }).click();
  }
});

test('logout clears session and cart', async ({ page }) => {
  await login(page);
  await page
    .getByRole('button', { name: 'Shto Domate të freskëta në porosi', exact: true })
    .click();
  await page.getByRole('button', { name: 'Dil nga llogaria', exact: true }).first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Dil nga llogaria' }).click();
  await expect(page.getByRole('button', { name: 'Hyr në MarketOne' })).toBeVisible();
  await login(page);
  await expect(page.getByTestId('cart-total')).toContainText(/0[,.]00/);
});

test('accessibility on login, desktop catalog and mobile order dialog', async ({ page }) => {
  await page.goto('/');
  const loginResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(loginResults.violations).toEqual([]);
  await login(page);
  const dashboardResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(dashboardResults.violations).toEqual([]);
  await page.setViewportSize({ width: 1024, height: 900 });
  const tabletResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(tabletResults.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole('button', { name: 'Shto Domate të freskëta në porosi', exact: true })
    .click();
  await page.locator('.mobile-cart-trigger').click();
  const mobileResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(mobileResults.violations).toEqual([]);
});

test('switching demo scenarios preserves the current order', async ({ page }) => {
  await login(page);
  await page
    .getByRole('button', { name: 'Shto Domate të freskëta në porosi', exact: true })
    .click();
  await page.getByRole('button', { name: 'Version demo', exact: true }).click();
  await page.getByRole('button', { name: /Katalog bosh/ }).click();
  await expect(page.getByText('Katalogu është ende bosh.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Rishiko porosinë' })).toBeDisabled();
  await page.getByRole('button', { name: 'Kthehu te katalogu' }).click();
  await expect(page.getByRole('article')).toHaveCount(18);
  await expect(page.getByTestId('cart-total')).toContainText(/1[,.]90/);
  await expect(page.getByRole('button', { name: 'Rishiko porosinë' })).toBeEnabled();
});
