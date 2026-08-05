import { test, expect } from '@playwright/test';
import { dismissTestPageNotice } from './helpers/test-page-notice';

test('TC-06 - Manejo de un rango de fechas invalido', async ({ page }) => {
  await page.goto('https://gt.nic.gt/estadisticas', { waitUntil: 'domcontentloaded' });
  await dismissTestPageNotice(page);
  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  const dates = page.locator('input[type="date"]');
  const submit = page.getByRole('button', { name: /Consultar/i });
  const tableValues = async () =>
    (await table.locator('th, td').allTextContents()).map((value) => value.trim());
  const originalTable = await tableValues();

  await dates.nth(0).fill('2025-12-31');
  await dates.nth(1).fill('2024-01-01');
  await submit.click();

  // El portal ignora el rango invertido. Se comprueba que no navegue, no falle
  // y no altere las estadisticas mostradas.
  await expect(dates.nth(0)).toHaveValue('2025-12-31');
  await expect(dates.nth(1)).toHaveValue('2024-01-01');
  await expect.poll(tableValues).toEqual(originalTable);

  await dates.nth(0).fill('2030-01-01');
  await dates.nth(1).fill('2030-12-31');
  await submit.click();

  // El rango futuro tampoco tiene datos propios; la pagina conserva el ultimo
  // conjunto disponible y debe permanecer operativa.
  await expect(dates.nth(0)).toHaveValue('2030-01-01');
  await expect(dates.nth(1)).toHaveValue('2030-12-31');
  await expect.poll(tableValues).toEqual(originalTable);
  await expect(page.getByRole('heading', { name: /Estad.sticas de Dominios \.GT/ })).toBeVisible();
});
