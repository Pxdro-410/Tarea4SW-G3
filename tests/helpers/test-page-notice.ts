import type { Page } from '@playwright/test';

/**
 * El portal de pruebas muestra un aviso unos instantes despues de cargar.
 * Aceptarlo desde la interfaz evita que intercepte acciones posteriores. La
 * casilla hace que la preferencia se conserve en las navegaciones y pestañas
 * nuevas del mismo contexto.
 */
export async function dismissTestPageNotice(page: Page) {
  const wasDismissed = await page.evaluate(
    () => localStorage.getItem('test_page_modal_dismissed') === 'true',
  );
  if (wasDismissed) return;

  const modal = page.locator('#testPageNoticeModal');
  const appeared = await modal
    .waitFor({ state: 'visible', timeout: 3_000 })
    .then(() => true)
    .catch(() => false);
  if (!appeared) return;

  await modal.getByRole('checkbox', { name: /No volver a mostrar/i }).check();
  await modal.getByRole('button', { name: /Entendido/i }).click();
  await modal.waitFor({ state: 'hidden' });
}
