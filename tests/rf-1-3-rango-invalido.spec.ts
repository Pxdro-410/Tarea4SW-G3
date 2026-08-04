import { test, expect } from '@playwright/test';

test('TC-06 - Manejo de un rango de fechas invalido', async ({ page }) => {
  await page.goto('https://gt.nic.gt/estadisticas', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('table')).toBeVisible();

  const dates = page.locator('input[type="date"]');
  const submit = page.getByRole('button', { name: /Consultar/i });

  await dates.nth(0).fill('2025-12-31');
  await dates.nth(1).fill('2024-01-01');
  await submit.click();
  await page.waitForTimeout(1_000);

  // Esta expectativa representa el comportamiento requerido. Si no hay validacion,
  // queda registrado como fallo real del sistema.
  await expect.soft(
    page.getByText(/fecha.*inv\u00e1lida|rango.*inv\u00e1lido/i),
  ).toBeVisible();

  await dates.nth(0).fill('2030-01-01');
  await dates.nth(1).fill('2030-12-31');
  await submit.click();
  await page.waitForTimeout(1_000);

  // Para un rango sin datos se espera un estado vacio controlado, no datos historicos.
  await expect.soft(page.getByText(/sin resultados|sin datos/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Estad.sticas de Dominios \.GT/ })).toBeVisible();
});
