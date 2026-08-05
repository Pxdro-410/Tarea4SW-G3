import { test, expect, type Page } from '@playwright/test';
import { dismissTestPageNotice } from './helpers/test-page-notice';

test.use({ ignoreHTTPSErrors: true });

async function changeLanguage(page: Page, language: 'EN' | 'ES') {
  const expectedPath = language === 'EN' ? /^\/en\/?$/ : /^\/?$/;
  const expectedDocumentLanguage = language.toLowerCase();

  await Promise.all([
    page.waitForURL((url) => expectedPath.test(url.pathname), { timeout: 10_000 }),
    page.getByRole('link', { name: language, exact: true }).click(),
  ]);

  await expect(page.locator('html')).toHaveAttribute('lang', expectedDocumentLanguage);
}

test('TC-31 — Cambio de idioma de español a inglés', async ({ page }) => {
  await page.goto('https://dev2.registro.gt/');
  await dismissTestPageNotice(page);

  await changeLanguage(page, 'EN');

  await expect(page.getByRole('link', { name: 'ES', exact: true })).toBeVisible();
});

test('TC-32 — Persistencia del idioma seleccionado al navegar y recargar', async ({ page }) => {
  await page.goto('https://dev2.registro.gt/');
  await dismissTestPageNotice(page);
  await changeLanguage(page, 'EN');

  await page.getByRole('link', { name: 'Fees', exact: true }).click();
  await expect(page.getByRole('link', { name: 'ES', exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('link', { name: 'ES', exact: true })).toBeVisible({ timeout: 10000 });
});

test('TC-33 — Regreso a español y consistencia entre secciones', async ({ page }) => {
  await page.goto('https://dev2.registro.gt/');
  await dismissTestPageNotice(page);
  await changeLanguage(page, 'EN');

  await changeLanguage(page, 'ES');
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Tarifas', exact: true }).click();
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toBeVisible();
  
});
