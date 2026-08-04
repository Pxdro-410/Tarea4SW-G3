import { test, expect } from '@playwright/test';

const baseUrl = 'https://gt.nic.gt';

const nosotrosPages = [
  { href: '/us', evidence: '¿Quiénes somos?' },
  { href: '/ourhistory', evidence: 'Los Orígenes de la Conectividad' },
  { href: 'https://news.registro.gt/', evidence: /Noticias|News/i, external: true },
];

test('TC-03 - Navegación por las páginas de la sección Nosotros', async ({ page }) => {
  test.setTimeout(60_000);

  for (const item of nosotrosPages) {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /Nosotros/i }).first().click();

    const link = page.locator(`a[href="${item.href}"]:visible`).first();
    await expect(link).toBeVisible();
    const expectedUrl = new URL(item.href, baseUrl);

    // El blog abre una pestaña nueva. Se valida ese enlace y se abre su destino
    // en la misma pestaña para conservar un único video para todo el TC-03.
    if (item.external) {
      await expect(link).toHaveAttribute('target', '_blank');
      await page.goto(item.href, { waitUntil: 'domcontentloaded' });
    } else {
      await link.click();
      await page.waitForLoadState('domcontentloaded');
    }

    const actualUrl = new URL(page.url());
    expect(actualUrl.origin).toBe(expectedUrl.origin);
    if (!item.external) {
      expect(actualUrl.pathname.replace(/\/$/, '') || '/').toBe(
        expectedUrl.pathname.replace(/\/$/, '') || '/',
      );
    }
    await expect(page.locator('body')).toContainText(item.evidence);
    await page.waitForTimeout(1_000);
  }
});
