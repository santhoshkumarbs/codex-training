import { expect, test } from '@playwright/test';

test.describe('registration flow', () => {
  test('creates a new account through the full flow', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Email address').fill('morgan@example.com');
    await page.getByLabel(/Username/i).fill('northern_light');
    await page
      .getByPlaceholder('Create a strong password')
      .fill('Sup3r$ecurePass');
    await page.getByLabel('Confirm password').fill('Sup3r$ecurePass');

    await expect(page.getByText('Username is available.')).toBeVisible();

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByLabel('First name')).toBeVisible();
    await page.getByLabel('First name').fill('Morgan');
    await page.getByLabel('Last name').fill('Lee');
    await page.getByLabel('Phone number').fill('+14155550123');
    await page.getByLabel('Country').selectOption('US');
    await page
      .getByRole('checkbox', {
        name: /Keep me updated with product insights/i,
      })
      .check();

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(
      page.getByText('Confirm the details before account creation.'),
    ).toBeVisible();

    await page
      .getByRole('checkbox', {
        name: /I accept the terms and understand how my data is handled/i,
      })
      .check();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(
      page.getByRole('heading', { name: /Welcome aboard, Morgan Lee/i }),
    ).toBeVisible();
  });

  test('restores persisted draft values without restoring passwords', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByLabel('Email address').fill('draft@example.com');
    await page.getByLabel(/Username/i).fill('draft_keeper');
    await page
      .getByPlaceholder('Create a strong password')
      .fill('Sup3r$ecurePass');
    await page.waitForTimeout(700);

    await page.reload();

    await expect(page.getByLabel('Email address')).toHaveValue(
      'draft@example.com',
    );
    await expect(page.getByLabel(/Username/i)).toHaveValue('draft_keeper');
    await expect(
      page.getByPlaceholder('Create a strong password'),
    ).toHaveValue('');
  });
});
