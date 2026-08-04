import { test, expect } from '@playwright/test';

test.use({
    ignoreHTTPSErrors: true
});

test('TC-19 — Agregar un dominio disponible al carrito sin iniciar sesión', async ({ page }) => {
    await page.goto('https://gt.nic.gt/');
    await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill('salco14');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.getByRole('button', { name: 'add_shopping_cart Reservar' }).first().click();

    await page.goto('https://gt.nic.gt/');
    await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill('salquito14');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.getByRole('button', { name: 'add_shopping_cart Reservar' }).first().click();
    
    await page.getByRole('link', { name: 'Carrito' }).click();

    // [Paso 1] Registrar contenido de localStorage
    const localCartBefore = await page.evaluate(() => localStorage.getItem('domain-cart'));
    expect(localCartBefore).toBeTruthy();
    expect(JSON.parse(localCartBefore || '[]').length).toBeGreaterThan(0);

    // [Paso 2 y 3] Recargar página
    await page.reload();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('2'); 
    
    const localCartAfterReload = await page.evaluate(() => localStorage.getItem('domain-cart'));
    expect(localCartAfterReload).toBe(localCartBefore);

    // [Paso 4] Cerrar pestaña y abrir nueva
    const context = page.context();
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('https://gt.nic.gt/');

    // [Paso 5 y 6] Verificar en nueva pestaña
    await newPage.getByRole('link', { name: 'Carrito' }).click();
    await expect(newPage.locator('#cart-badge-desktop')).toHaveText('2');
    const localCartNewPage = await newPage.evaluate(() => localStorage.getItem('domain-cart'));
    expect(localCartNewPage).toBe(localCartBefore);
});

test('TC-20 — Persistencia del carrito al recargar y reabrir la página', async ({ page }) => {
    await page.goto('https://gt.nic.gt/');
    await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill('salco14.com');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.getByRole('button', { name: 'add_shopping_cart Reservar' }).first().click();
    
    await page.goto('https://gt.nic.gt/');
    await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill('salquito14.edu.gt');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.getByRole('button', { name: 'add_shopping_cart Reservar' }).first().click();
    
    await page.getByRole('link', { name: 'Carrito' }).click();

    const localCartBefore = await page.evaluate(() => localStorage.getItem('domain-cart'));

    await page.reload();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('2');

    const context = page.context();
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('https://gt.nic.gt/');

    await newPage.getByRole('link', { name: 'Carrito' }).click();
    await expect(newPage.locator('#cart-badge-desktop')).toHaveText('2');
    const localCartNewPage = await newPage.evaluate(() => localStorage.getItem('domain-cart'));
    expect(localCartNewPage).toBe(localCartBefore);
});

test('TC-21 — Eliminar un dominio del carrito y sincronización con localStorage', async ({ page }) => {
    await page.goto('https://gt.nic.gt/');
    await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill('salco14');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.getByRole('button', { name: 'add_shopping_cart Reservar' }).first().click();

    await page.goto('https://gt.nic.gt/');
    await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill('uvg');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.getByRole('button', { name: 'add_shopping_cart Reservar' }).first().click();
    
    await page.getByRole('link', { name: 'Carrito' }).click();
    
    // [Paso 2 y 3] Eliminar el primer dominio
    await page.getByRole('button', { name: 'delete Eliminar' }).first().click();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('1');

    // [Paso 4] Leer localStorage, convertir JSON y mapear dominios
    const cartStorage = await page.evaluate(() => localStorage.getItem('domain-cart'));
    const cart = JSON.parse(cartStorage || '[]');
    const dominiosGuardados = cart.map((item: any) => item.domain);

    expect(dominiosGuardados.some((d: string) => d.includes('salco14'))).toBeFalsy();
    expect(dominiosGuardados.some((d: string) => d.includes('uvg'))).toBeTruthy();

    // [Paso 5 y 6] Eliminar el dominio restante
    await page.getByRole('button', { name: 'delete Eliminar' }).click();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('0');

    // [Paso 7] Recargar y confirmar
    await page.reload();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('0');
});