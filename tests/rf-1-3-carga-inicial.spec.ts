import { test, expect } from '@playwright/test';

test('TC-04 - Carga por defecto de la sección Estadísticas', async ({ page }) => {
  const response = await page.goto('https://gt.nic.gt/estadisticas', {
    waitUntil: 'domcontentloaded',
  });

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Estadísticas de Dominios .GT' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByRole('cell', { name: '.com.gt', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: '.edu.gt', exact: true })).toBeVisible();

  const total = page.getByText('TOTAL DE DOMINIOS').locator('..');
  await expect(total).toContainText(/[0-9]/);
  expect(await page.locator('canvas').count()).toBeGreaterThan(0);

  // Se detiene en las gráficas para que se aprecien en el video.
  await page.getByText('Distribución por Sufijo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2_000);

  // Luego muestra el desglose con los subdominios y sus valores.
  await page.getByRole('table').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2_000);

  // Finalmente recorre toda la sección hasta el pie de página.
  await page.evaluate(async () => {
    const step = 500;
    for (let position = 0; position < document.body.scrollHeight; position += step) {
      window.scrollTo(0, position);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

});
