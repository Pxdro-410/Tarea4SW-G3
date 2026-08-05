import { test, expect } from '@playwright/test';
import { dismissTestPageNotice } from './helpers/test-page-notice';

test('TC-18  —  Manejo de entradas ASCII puras y entradas inválidas', async ({ page }) => {
  await page.goto('https://gt.nic.gt/idn/');
  await dismissTestPageNotice(page);

  const input = page.getByRole('textbox', { name: 'Nombre de dominio (Español)' });
  const output = page.locator('#idnOutput');
  const error = page.locator('#idnError');
  const convert = page.getByRole('button', { name: /CONVERTIR/i });
  const clear = page.getByRole('button', { name: /Limpiar campos/i });

  await input.fill('ejemplo');
  await convert.click();
  await expect(output).toHaveValue('ejemplo');
  await expect(error).toBeHidden();

  await clear.click();
  await expect(input).toHaveValue('');
  await expect(output).toHaveValue('');

  await convert.click();
  await expect(error).toHaveText(/no puede estar vac.o/i);
  await expect(output).toHaveValue('');

  // "n--" no es el prefijo reservado "xn--" y es una entrada ASCII valida.
  await input.fill('n--esto-no-es-punycode-valido');
  await convert.click();
  await expect(output).toHaveValue('n--esto-no-es-punycode-valido');
  await expect(error).toBeHidden();

  await input.fill('xn--esto-no-es-punycode-valido');
  await convert.click();
  await expect(error).toHaveText(/comienzan con "xn--" no est.n permitidos/i);
  await expect(output).toHaveValue('');
});
