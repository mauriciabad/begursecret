import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/en')

  await expect(page).toHaveTitle(/Begur/)
})

test('launch app link', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('link', { name: 'Launch App' }).click()

  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible()
})
