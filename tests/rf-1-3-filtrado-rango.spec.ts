import { test, expect } from '@playwright/test';
import { dismissTestPageNotice } from './helpers/test-page-notice';

test('TC-08  —  Filtrado por un rango de fechas válido ', async ({ page }) => {
  await page.goto('https://gt.nic.gt/estadisticas', { waitUntil: 'domcontentloaded' });
  await dismissTestPageNotice(page);

  const dates = page.locator('input[type="date"]');
  const table = page.getByRole('table');
  await expect(dates).toHaveCount(2);
  await expect(table).toBeVisible();

  await dates.nth(0).fill('2025-01-01');
  await dates.nth(1).fill('2025-12-31');
  await page.getByRole('button', { name: /Consultar/i }).click();

  await expect(dates.nth(0)).toHaveValue('2025-01-01');
  await expect(dates.nth(1)).toHaveValue('2025-12-31');
  await expect(table.getByRole('row')).toHaveCount(10);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Exportar CSV/i }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  expect(await download.failure()).toBeNull();
});
