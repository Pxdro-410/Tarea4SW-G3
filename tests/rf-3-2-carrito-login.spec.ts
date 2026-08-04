import { test, expect } from '@playwright/test';

test.use({
    ignoreHTTPSErrors: true
});

test('test-tc22', async ({ page }) => {
    await page.goto('https://dev2.registro.gt/');
    await page.getByText('No volver a mostrar este').click();
    await page.getByRole('button', { name: 'Entendido' }).click();
    await page.getByRole('link', { name: 'Carrito' }).click();
    await page.getByText('shopping_cart Tu carrito est').click();
    await page.getByRole('link', { name: 'Buscar un dominio' }).click();
});

// test-tc-23 realizado de forma manual por el inicio de sesión

// test-tc-24 realizado de forma manual por el inicio de sesión