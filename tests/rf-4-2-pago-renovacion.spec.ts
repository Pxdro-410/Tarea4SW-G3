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

test('TC-28 — Acceso al flujo de pago de renovación sin iniciar sesión', async ({ page }) => {
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);
  await page.getByText('search Buscar').click({ force: true }).catch(() => {});
  await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill('google');
  await page.getByRole('button', { name: 'Buscar' }).click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);

  await page.getByRole('link', { name: /Ver detalles.../i }).first().click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);

  await expect(page).not.toHaveURL(/login/i);

  await page.screenshot({ path: 'screenshots/TC-28-detalles-dominio.png' });
});
