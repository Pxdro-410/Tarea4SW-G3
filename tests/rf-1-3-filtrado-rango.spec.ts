import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://gt.nic.gt/');
    await page.getByRole('link', { name: 'Estadísticas' }).click();
    await page.getByRole('button', { name: 'analytics Consultar' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'download Exportar CSV' }).click();
    const download = await downloadPromise;
    await page.getByRole('textbox').first().fill('2025-01-01');
    await page.getByRole('textbox').nth(1).fill('2025-12-31');
    await page.getByRole('button', { name: 'analytics Consultar' }).click();
    const download1Promise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'download Exportar CSV' }).click();
    const download1 = await download1Promise;
});