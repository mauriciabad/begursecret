import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/en')

  await expect(page).toHaveTitle(/Begur/)
})

test('lunch app link', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('link', { name: 'Lunch App' }).click()

  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible()
})
