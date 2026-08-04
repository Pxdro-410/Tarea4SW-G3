import { test, expect } from '@playwright/test';

test.use({
    ignoreHTTPSErrors: true
});

test('test-tc04', async ({ page }) => {
    await page.goto('https://www.gt/sitio/');
    await page.getByRole('link', { name: 'Nosotros' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Noticias' }).click();
    const page1 = await page1Promise;
});

// tc-05 realizado manualmente

test.use({
    ignoreHTTPSErrors: true
});

test('test-tc06', async ({ page }) => {
    await page.goto('https://news.registro.gt/');
    await page.goto('https://news.registro.gt/2026/06/23/del-legado-del-ing-luis-furlan-al-desarrollo-de-la-infraestructura-digital-de-guatemala/#more-1175');
});