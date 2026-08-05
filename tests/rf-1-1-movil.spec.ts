import { test, expect } from '@playwright/test';
import { dismissTestPageNotice } from './helpers/test-page-notice';

test.use({ viewport: { width: 375, height: 667 } });

test('TC-02 - Visualización de la información principal en viewport móvil', async ({ page }) => {
  await page.goto('https://gt.nic.gt/', { waitUntil: 'domcontentloaded' });
  await dismissTestPageNotice(page);

  await expect(page.getByText('Registra tu dominio .gt hoy mismo.')).toBeVisible();
  await expect(page.getByPlaceholder('escribe un nombre de dominio')).toBeVisible();

  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);

  const menuButton = page.getByRole('button', { name: /open main menu/i });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(page.locator('a[href="/procedures"]:visible')).toBeVisible();
  await page.getByRole('button', { name: /Enlaces de Interés/i }).last().click();
  await expect(page.locator('a[href="/estadisticas"]:visible')).toBeVisible();

});
