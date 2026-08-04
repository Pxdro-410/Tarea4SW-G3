import { test, expect } from '@playwright/test';

test.describe('Pruebas de https://www.gt/sitio/', () => {
    // Ignorar errores de certificado SSL
    test.use({ ignoreHTTPSErrors: true });
    test('TC-16 — Conversión de un nombre con caracteres especiales a Punycode', async ({ page }) => {
        await page.goto('https://www.gt/sitio/idn.php');

        // Ingresar "mañana"
        await page.locator('#idn').fill('mañana');
        // Hay dos formularios, buscamos el botón del primer formulario (IDN -> Punycode)
        await page.locator('button[name="operacion"][value="CONVERTIR"]').first().click();

        // Verificar que el punycode es xn--maana-pta
        await expect(page.getByText('xn--maana-pta').first()).toBeVisible({ timeout: 15000 });
        await page.screenshot({ path: 'screenshots/TC-10-manana.png' });

        // Ingresar "mañana.com.gt"
        await page.goto('https://www.gt/sitio/idn.php');
        await page.locator('#idn').fill('mañana.com.gt');
        await page.locator('button[name="operacion"][value="CONVERTIR"]').first().click();

        await expect(page.getByText('xn--maana-pta').first()).toBeVisible({ timeout: 15000 });
        await page.screenshot({ path: 'screenshots/TC-10-manana-com-gt.png' });
    });

    test('TC-17 — Conversión inversa de Punycode a nombre IDN', async ({ page }) => {
        await page.goto('https://www.gt/sitio/idn.php');

        // Ingresar "xn--maana-pta" en el campo de punycode
        await page.locator('#puny').fill('xn--maana-pta');
        // Hacemos click en el botón del SEGUNDO formulario (Punycode -> IDN)
        await page.locator('button[name="operacion"][value="CONVERTIR"]').last().click();

        // Verificar que el IDN es mañana
        await expect(page.getByText('mañana').first()).toBeVisible({ timeout: 15000 });
        await page.screenshot({ path: 'screenshots/TC-11-inversa.png' });
    });
});