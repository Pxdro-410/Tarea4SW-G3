import { test, expect } from '@playwright/test';

test('TC-01 - Carga de los bloques principales de la landing', async ({ page }) => {
  const response = await page.goto('https://gt.nic.gt/', { waitUntil: 'domcontentloaded' });

  expect(response?.status()).toBe(200);
  await expect(page.getByText('Registra tu dominio .gt hoy mismo.')).toBeVisible();
  await expect(page.getByPlaceholder('escribe un nombre de dominio')).toBeEnabled();
  await expect(page.getByText('Beneficios de Dominios .GT')).toBeVisible();

  // El desplazamiento gradual queda visible en el video de Playwright.
  await page.evaluate(async () => {
    const step = 650;
    for (let position = 0; position < document.body.scrollHeight; position += step) {
      window.scrollTo(0, position);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  await expect(page.getByText('Administrador del Dominio Superior .gt.')).toBeVisible();

});
