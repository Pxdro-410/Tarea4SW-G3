import { test, expect } from '@playwright/test';

test.describe('Pruebas de https://dev2.registro.gt/', () => {
  // Ignorar errores de certificado SSL
  test.use({ ignoreHTTPSErrors: true });

  test('TC-10 — Búsqueda de un dominio disponible', async ({ page }) => {
    await page.goto('https://dev2.registro.gt/');
    const timestamp = new Date().getTime();
    const randomDomain = `pruebauvg${timestamp}`;

    await page.locator('#heroSearchInput').fill(randomDomain);
    await page.locator('#heroSearchForm button[type="submit"]').click();

    // Esperar a que la página cargue los resultados
    await expect(page.locator('h2:has-text("Disponibles para registro")').first()).toBeVisible({ timeout: 15000 });

    // Capturar screenshot del resultado
    await page.screenshot({ path: 'screenshots/TC-07-disponible.png' });
  });

  test('TC-11 — Búsqueda de un dominio ya registrado', async ({ page }) => {
    await page.goto('https://dev2.registro.gt/');
    await page.locator('#heroSearchInput').fill('google');
    await page.locator('#heroSearchForm button[type="submit"]').click();

    // Esperar a que indique que no está disponible o que ofrezca WHOIS
    await expect(page.locator('h2:has-text("Dominios Registrados")').first()).toBeVisible({ timeout: 15000 });

    // Verificar que no se ofrezca agregarlo al carrito para el dominio específico uvg.edu.gt
    const btnRegistrarUVG = page.locator('button[data-domain="uvg.edu.gt"]');
    await expect(btnRegistrarUVG).not.toBeVisible();

    // Capturar screenshot del resultado
    await page.screenshot({ path: 'screenshots/TC-08-registrado.png' });
  });

  test('TC-12 — Validación de entradas inválidas en el buscador', async ({ page }) => {
    await page.goto('https://dev2.registro.gt/');
    const searchInput = page.locator('#heroSearchInput');
    const searchBtn = page.locator('#heroSearchForm button[type="submit"]');

    // 1. Campo vacío
    await searchInput.fill('');
    await searchBtn.click();
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(/.*results/);
    await page.screenshot({ path: 'screenshots/TC-09-vacio.png' });

    // 2. Guion al inicio (-dominio)
    await page.goto('https://dev2.registro.gt/');
    await searchInput.fill('-dominio');
    await searchBtn.click();
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(/.*results/);
    await page.screenshot({ path: 'screenshots/TC-09-guion.png' });

    // 3. Espacio y carácter especial (dominio prueba!)
    await page.goto('https://dev2.registro.gt/');
    await searchInput.fill('dominio prueba!');
    //await searchBtn.click();
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(/.*results/);
    await page.screenshot({ path: 'screenshots/TC-09-especial.png' });

    // 4. Más de 63 caracteres
    await page.goto('https://dev2.registro.gt/');
    await searchInput.fill('a'.repeat(64));
    await searchBtn.click();
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(/.*results/);
    await page.screenshot({ path: 'screenshots/TC-09-largo.png' });
  });

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
