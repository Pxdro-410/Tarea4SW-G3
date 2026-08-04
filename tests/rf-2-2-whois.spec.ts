import { test, expect } from '@playwright/test';

test.use({
    ignoreHTTPSErrors: true
});

test('test-tc13', async ({ page }) => {
    await page.goto('https://www.gt/sitio/');
    await page.getByRole('textbox', { name: 'Escriba un Nombre de Dominio' }).click();
    await page.getByRole('textbox', { name: 'Escriba un Nombre de Dominio' }).fill('uvg.edu.gt');
    await page.getByRole('button', { name: ' Buscar' }).click();
    await page.getByRole('link', { name: 'uvg.edu.gt.' }).dblclick();
    await page.getByText('Información del Nombre de Dominio uvg.edu.gt. ACTIVO Expiración: 2027-Aug-14 00').click();
});

test.use({
    ignoreHTTPSErrors: true
});

test('test-tc14', async ({ page }) => {
    await page.goto('https://www.gt/sitio/');
    await page.getByRole('textbox', { name: 'Escriba un Nombre de Dominio' }).click();
    await page.getByRole('textbox', { name: 'Escriba un Nombre de Dominio' }).fill('uvg.edu.gt');
    await page.getByRole('button', { name: ' Buscar' }).click();
    await page.getByRole('link', { name: 'uvg.edu.gt.' }).dblclick();
    await page.getByText('Información del Nombre de Dominio uvg.edu.gt. ACTIVO Expiración: 2027-Aug-14 00').click();
});


test.use({
    ignoreHTTPSErrors: true
});

test('test-tc15', async ({ page }) => {
    await page.goto('https://www.gt/sitio/');
    await page.getByRole('textbox', { name: 'Escriba un Nombre de Dominio' }).click();
    await page.getByRole('textbox', { name: 'Escriba un Nombre de Dominio' }).fill('falsonombre.com.edu.gt');
    await page.getByRole('button', { name: ' Buscar' }).click();
    await page.getByRole('link', { name: 'falsonombre.com.gt.' }).click();
    await page.getByRole('textbox', { name: '  * Organización Titular :' }).click();
});