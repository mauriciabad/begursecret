import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/en/explore')

  await expect(page).toHaveTitle(/Explore/)
})

test('place link works', async ({ page }) => {
  await page.goto('/en/explore')

  await page.getByRole('link', { name: 'Sa Riera' }).click()

  await expect(page.getByRole('heading', { name: 'Sa Riera' })).toBeVisible()
})
