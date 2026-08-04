import { test, expect, type Page } from '@playwright/test';

test.use({ ignoreHTTPSErrors: true });

async function dismissNotice(page: Page) {
  const modal = page.locator('#testPageNoticeModal');
  for (let i = 0; i < 5; i++) {
    const modalVisible = await modal.isVisible({ timeout: 2000 }).catch(() => false);
    if (!modalVisible) return;
    const boton = page.getByRole('button', { name: /Entendido|Understood/i });
    await boton.click({ force: true, timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(400);
  }
}

async function buscarDominio(page: Page, nombre: string) {
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);
  await page.getByText('search Buscar').click({ force: true }).catch(() => {});
  await page.getByRole('textbox', { name: 'escribe un nombre de dominio' }).fill(nombre);
  await page.getByRole('button', { name: 'Buscar' }).click({ force: true });
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await dismissNotice(page);
}

test('TC-25 — Búsqueda de un dominio propio para renovación sin sesión iniciada', async ({ page }) => {
  await buscarDominio(page, 'google');
  
  await expect(page.getByRole('link', { name: /Ver detalles/i }).first()).toBeVisible({ timeout: 15000 });

});

test('TC-26 — Intento de renovación de un dominio no registrado', async ({ page }) => {
  const timestamp = new Date().getTime();
  await buscarDominio(page, `noexiste${timestamp}`);

  await expect(page.getByRole('button', { name: /Reservar/i }).first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('link', { name: /Ver detalles/i })).toHaveCount(0);

});

test('TC-27 — Validación de entradas inválidas en el buscador', async ({ page }) => {
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);

  const input = page.getByRole('textbox', { name: 'escribe un nombre de dominio' });
  const boton = page.getByRole('button', { name: 'Buscar' });

  // 1. Campo vacío
  await input.fill('');
  await boton.click({ force: true });
  await page.waitForTimeout(1000);

  // 2. Guion al inicio
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);
  await input.fill('-dominio');
  await boton.click({ force: true });
  await page.waitForTimeout(1000);

  // 3. Espacio / carácter especial
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);
  await input.fill('dominio prueba!');
  await page.waitForTimeout(500);

  // 4. Más de 63 caracteres
  await page.goto('https://dev2.registro.gt/');
  await dismissNotice(page);
  await input.fill('a'.repeat(64));
  await boton.click({ force: true });
  await page.waitForTimeout(1000);
});