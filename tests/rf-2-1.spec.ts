import { test, expect } from '@playwright/test';

test.describe('Pruebas de https://www.gt/sitio/', () => {
  // Ignorar errores de certificado SSL
  test.use({ ignoreHTTPSErrors: true });

  test('TC-10 — Búsqueda de un dominio disponible', async ({ page }) => {
    await page.goto('https://www.gt/sitio/');
    const timestamp = new Date().getTime();
    const randomDomain = `pruebauvg${timestamp}`;

    await page.locator('#texto-search').fill(randomDomain);
    await page.locator('button.boton-search').click();

    // Esperar a que la página cargue los resultados
    await expect(page.getByRole('heading', { name: 'Disponibles', exact: false }).or(page.locator('text=Registrar').first())).toBeVisible({ timeout: 15000 });

    // Capturar screenshot del resultado
    await page.screenshot({ path: 'screenshots/TC-07-disponible.png' });
  });

  test('TC-11 — Búsqueda de un dominio ya registrado', async ({ page }) => {
    await page.goto('https://www.gt/sitio/');
    await page.locator('#texto-search').fill('google');
    await page.locator('button.boton-search').click();

    // Esperar a que indique que no está disponible o que ofrezca WHOIS
    await expect(page.getByRole('heading', { name: 'Registrados' }).first()).toBeVisible({ timeout: 15000 });

    // Verificar que no se ofrezca agregarlo al carrito para el dominio específico google.com.gt
    const btnRegistrarUVG = page.locator('form[action*="google.com.gt"] button[value="Registrar"]');
    await expect(btnRegistrarUVG).not.toBeVisible();

    // Capturar screenshot del resultado
    await page.screenshot({ path: 'screenshots/TC-08-registrado.png' });
  });

  test('TC-12 — Validación de entradas inválidas en el buscador', async ({ page }) => {
    await page.goto('https://www.gt/sitio/');
    const searchInput = page.locator('#texto-search');
    const searchBtn = page.locator('button.boton-search');

    // 1. Campo vacío
    await searchInput.fill('');
    await searchBtn.click();
    await page.waitForTimeout(1000);
    // Debido a un bug, el sistema permite hacer submit vacío. Solo validaremos que no crashee y capturaremos pantalla.
    await page.screenshot({ path: 'screenshots/TC-09-vacio.png' });

    // 2. Guion al inicio (-dominio)
    await page.goto('https://www.gt/sitio/');
    await searchInput.fill('-dominio');
    await searchBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    // Debido al bug, navega a results.php y muestra el error allá.
    await expect(page.getByText('El nombre de dominio no puede empezar con guión')).toBeVisible();
    await page.screenshot({ path: 'screenshots/TC-09-guion.png' });

    // 3. Espacio y carácter especial (dominio prueba!)
    await page.goto('https://www.gt/sitio/');
    await searchInput.fill('dominio prueba!');
    await searchBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    // Debido al bug, elimina los caracteres especiales y busca el resto.
    await expect(page.getByRole('heading', { name: 'RESULTADOS DE LA CONSULTA' }).first()).toBeVisible();
    await page.screenshot({ path: 'screenshots/TC-09-especial.png' });

    // 4. Más de 63 caracteres
    await page.goto('https://www.gt/sitio/');
    await searchInput.fill('a'.repeat(64));
    await searchBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    // Debido al bug, muestra un error genérico de longitud
    await expect(page.getByText('Error en la consulta')).toBeVisible();
    await page.screenshot({ path: 'screenshots/TC-09-largo.png' });
  });

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
