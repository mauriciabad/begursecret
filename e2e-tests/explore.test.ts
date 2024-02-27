import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/en/explore')

  await expect(page).toHaveTitle(/Explore/)
})

test.skip('place link works', async ({ page }) => {
  await page.goto('/en/explore')

  const link = page.getByRole('link', { name: 'Sa Riera Beach' })
  await link.scrollIntoViewIfNeeded()
  await link.click()

  await expect(
    page.getByRole('heading', { name: 'Sa Riera Beach' })
  ).toBeVisible()
})
