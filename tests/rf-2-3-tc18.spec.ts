import { test, expect } from '@playwright/test';

test('TC-18  —  Manejo de entradas ASCII puras y entradas inválidas', async ({ page }) => {
    await page.goto('https://gt.nic.gt/idn/');
    await page.getByRole('textbox', { name: 'Nombre de dominio (Español)' }).click();
    await page.getByRole('textbox', { name: 'Nombre de dominio (Español)' }).fill('ejemplo');
    await page.getByRole('button', { name: 'CONVERTIR sync' }).click();
    await page.getByRole('button', { name: 'Limpiar campos' }).click();
    await page.getByRole('button', { name: 'CONVERTIR sync' }).click();
    await page.getByRole('button', { name: 'Limpiar campos' }).click();
    await page.getByRole('textbox', { name: 'Nombre de dominio (Español)' }).click();
    await page.getByRole('textbox', { name: 'Nombre de dominio (Español)' }).fill('n--esto-no-es-punycode-valido');
    await page.getByRole('button', { name: 'CONVERTIR sync' }).click();
    await page.getByRole('button', { name: 'Limpiar campos' }).click();
    await page.getByRole('textbox', { name: 'Nombre de dominio (Español)' }).click();
    await page.getByRole('textbox', { name: 'Nombre de dominio (Español)' }).fill('xn--esto-no-es-punycode-valido');
    await page.getByRole('button', { name: 'CONVERTIR sync' }).click();
});