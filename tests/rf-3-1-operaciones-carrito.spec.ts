import { test, expect } from '@playwright/test';
import { dismissTestPageNotice } from './helpers/test-page-notice';

function uniqueDomain(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function addDomainToCart(page: import('@playwright/test').Page, domain: string) {
    await page.goto('https://gt.nic.gt/', { waitUntil: 'domcontentloaded' });
    await dismissTestPageNotice(page);
    await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill(domain);
    await page.getByRole('button', { name: 'Buscar' }).click();

    const reserve = page.getByRole('button', { name: /Reservar/i }).first();
    await expect(reserve).toBeVisible({ timeout: 15_000 });
    await reserve.click();
}

async function storedCart(page: import('@playwright/test').Page) {
    const value = await page.evaluate(() => localStorage.getItem('domain-cart'));
    return { value, items: JSON.parse(value || '[]') as Array<{ domain: string }> };
}

async function openCart(page: import('@playwright/test').Page) {
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            await page.goto('https://gt.nic.gt/cart/', { waitUntil: 'domcontentloaded' });
            break;
        } catch (error) {
            const isTransientNavigationAbort =
                error instanceof Error &&
                (error.message.includes('NS_BINDING_ABORTED') ||
                    error.message.includes('net::ERR_ABORTED'));
            if (!isTransientNavigationAbort || attempt === 1) throw error;
        }
    }
    await expect(page).toHaveURL(/\/cart\/?$/);
}

test('TC-19 — Agregar un dominio disponible al carrito sin iniciar sesión', async ({ page }) => {
    const firstDomain = uniqueDomain('tc19-a');
    const secondDomain = uniqueDomain('tc19-b');
    await addDomainToCart(page, firstDomain);
    await addDomainToCart(page, secondDomain);
    
    await openCart(page);

    // [Paso 1] Registrar contenido de localStorage
    const cartBefore = await storedCart(page);
    expect(cartBefore.value).toBeTruthy();
    expect(cartBefore.items).toHaveLength(2);
    expect(cartBefore.items.map((item) => item.domain).join(' ')).toContain(firstDomain);
    expect(cartBefore.items.map((item) => item.domain).join(' ')).toContain(secondDomain);

    // [Paso 2 y 3] Recargar página
    await page.reload();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('2'); 
    
    const cartAfterReload = await storedCart(page);
    expect(cartAfterReload.value).toBe(cartBefore.value);

    // [Paso 4] Cerrar pestaña y abrir nueva
    const context = page.context();
    await page.close();
    const newPage = await context.newPage();

    // [Paso 5 y 6] Verificar en nueva pestaña
    await openCart(newPage);
    await expect(newPage.locator('#cart-badge-desktop')).toHaveText('2');
    const cartNewPage = await storedCart(newPage);
    expect(cartNewPage.value).toBe(cartBefore.value);
});

test('TC-20 — Persistencia del carrito al recargar y reabrir la página', async ({ page }) => {
    await addDomainToCart(page, uniqueDomain('tc20-a'));
    await addDomainToCart(page, uniqueDomain('tc20-b'));
    
    await openCart(page);

    const cartBefore = await storedCart(page);
    expect(cartBefore.items).toHaveLength(2);

    await page.reload();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('2');

    const context = page.context();
    await page.close();
    const newPage = await context.newPage();

    await openCart(newPage);
    await expect(newPage.locator('#cart-badge-desktop')).toHaveText('2');
    const cartNewPage = await storedCart(newPage);
    expect(cartNewPage.value).toBe(cartBefore.value);
});

test('TC-21 — Eliminar un dominio del carrito y sincronización con localStorage', async ({ page }) => {
    await addDomainToCart(page, uniqueDomain('tc21-a'));
    await addDomainToCart(page, uniqueDomain('tc21-b'));
    
    await openCart(page);
    const cartBefore = await storedCart(page);
    expect(cartBefore.items).toHaveLength(2);
    
    // [Paso 2 y 3] Eliminar el primer dominio
    await page.getByRole('button', { name: 'delete Eliminar' }).first().click();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('1');

    // [Paso 4] Confirmar que localStorage refleja exactamente una eliminacion.
    const cartAfterDelete = await storedCart(page);
    expect(cartAfterDelete.items).toHaveLength(1);
    expect(cartBefore.items.map((item) => item.domain)).toContain(cartAfterDelete.items[0].domain);

    // [Paso 5 y 6] Eliminar el dominio restante
    await page.getByRole('button', { name: 'delete Eliminar' }).click();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('0');
    await expect.poll(async () => (await storedCart(page)).items.length).toBe(0);

    // [Paso 7] Recargar y confirmar
    await page.reload();
    await expect(page.locator('#cart-badge-desktop')).toHaveText('0');
});
