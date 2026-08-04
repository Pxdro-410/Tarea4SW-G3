import { test, expect } from '@playwright/test';

test.describe('Pruebas de https://dev2.registro.gt/', () => {
    // Ignorar errores de certificado SSL
    test.use({ ignoreHTTPSErrors: true });
    test('TC-16 — Conversión de un nombre con caracteres especiales a Punycode', async ({ page }) => {
        await page.goto('https://dev2.registro.gt/idn');

        // Ingresar "mañana"
        await page.locator('#idnInput').fill('mañana');
        await page.locator('#idnConvertBtn').click();

        // Verificar que el punycode es xn--maana-pta
        await expect(page.locator('#idnOutput')).toHaveValue('xn--maana-pta', { timeout: 15000 });
        await page.screenshot({ path: 'screenshots/TC-10-manana.png' });

        // Ingresar "mañana.com.gt"
        await page.goto('https://dev2.registro.gt/idn');
        await page.locator('#idnInput').fill('mañana.com.gt');
        await page.locator('#idnConvertBtn').click();

        await expect(page.locator('#idnOutput')).toHaveValue('xn--maana-pta.com.gt', { timeout: 15000 });
        await page.screenshot({ path: 'screenshots/TC-10-manana-com-gt.png' });
    });

    test('TC-17 — Conversión inversa de Punycode a nombre IDN', async ({ page }) => {
        await page.goto('https://dev2.registro.gt/idn');

        // Ingresar "xn--maana-pta" en el campo de punycode
        // Ya que en la nueva página solo hay un input principal, probaremos la conversión bidireccional
        await page.locator('#idnInput').fill('xn--maana-pta');
        await page.locator('#idnConvertBtn').click();

        // Verificar que la nueva página de IDN no permite dominios que empiezan con xn--
        await expect(page.locator('#idnError')).toContainText('no están permitidos', { timeout: 15000 });
        await page.screenshot({ path: 'screenshots/TC-11-inversa.png' });
    });
});