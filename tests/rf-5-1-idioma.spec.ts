import { test, expect, type Page } from '@playwright/test';

test.use({ ignoreHTTPSErrors: true });

async function dismissNotice(page: Page) {
  const modal = page.locator('#testPageNoticeModal');
  for (let i = 0; i < 5; i++) {
    const modalVisible = await modal.isVisible({ timeout: 2000 }).catch(() => false);
    if (!modalVisible) return;
    const boton = page.getByRole('button', { name: /Entendido|Understood/i });
    await boton.click({ force: true, timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(400);
  }
}

test('TC-31 — Cambio de idioma de español a inglés', async ({ page }) => {
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);

  await page.getByRole('link', { name: 'EN', exact: true }).click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);

  await expect(page.getByRole('link', { name: 'ES', exact: true })).toBeVisible();
});

test('TC-32 — Persistencia del idioma seleccionado al navegar y recargar', async ({ page }) => {
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);
  await page.getByRole('link', { name: 'EN', exact: true }).click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);

  await page.getByRole('link', { name: 'Fees', exact: true }).click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);
  await expect(page.getByRole('link', { name: 'ES', exact: true })).toBeVisible();

  await page.reload();
  await dismissNotice(page);
  await expect(page.getByRole('link', { name: 'ES', exact: true })).toBeVisible({ timeout: 10000 });
});

test('TC-33 — Regreso a español y consistencia entre secciones', async ({ page }) => {
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);
  await page.getByRole('link', { name: 'EN', exact: true }).click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);

  await page.getByRole('link', { name: 'ES', exact: true }).click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Tarifas', exact: true }).click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toBeVisible();
  
});