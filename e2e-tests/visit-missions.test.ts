import { Page, expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/en/missions')

  await expect(page).toHaveTitle(/Missions/)
})

test.skip('missions + login', async ({ page }) => {
  const PLACE_ID = 57
  const PLACE_NAME = 'Can Pella i Forgas'
  const CATEGORY_NAME_PLURAL = 'Defense Towers'

  await page.goto('/en/missions')

  await expect(
    page
      .getByRole('button', { name: CATEGORY_NAME_PLURAL })
      .getByRole('progressbar')
  ).toHaveAttribute('aria-valuenow', '0')

  await page.getByRole('button', { name: CATEGORY_NAME_PLURAL }).focus()
  await page.getByRole('button', { name: CATEGORY_NAME_PLURAL }).press('Enter')
  await expect(
    page
      .getByRole('button', { name: PLACE_NAME })
      .getByLabel('Not visited', { exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: PLACE_NAME }).click()

  await page.getByRole('button', { name: 'Validate visit' }).click()

  await expect(page.getByText('Login required')).toBeVisible()

  await page.getByRole('link', { name: 'Login' }).click()
  await fillLoginForm(page)
  await page.getByRole('navigation').getByLabel('Missions').click()

  await expect(
    page
      .getByRole('button', { name: CATEGORY_NAME_PLURAL })
      .getByRole('progressbar')
  ).toHaveAttribute('aria-valuenow', '0')

  await page.getByRole('button', { name: CATEGORY_NAME_PLURAL }).focus()
  await page.getByRole('button', { name: CATEGORY_NAME_PLURAL }).press('Enter')
  await expect(
    page
      .getByRole('button', { name: PLACE_NAME })
      .getByLabel('Not visited', { exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: PLACE_NAME }).click()
  await expect(page.getByRole('banner').getByText(PLACE_NAME)).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'View full place info' })
  ).toHaveAttribute('href', `/en/explore/places/${PLACE_ID}`)

  await page.getByRole('button', { name: 'Validate visit' }).click()
  await expect(
    page.getByRole('banner').getByText('Validate visit')
  ).toBeVisible()
  await page.getByRole('button', { name: 'Validate visit' }).click()
  await expect(page.getByRole('alert').getByText('Error')).toBeVisible()
  await page
    .getByRole('button', { name: 'Continue without validating' })
    .click()

  await expect(
    page.getByRole('banner').getByText('Validate visit')
  ).not.toBeVisible()

  await expect(
    page
      .getByRole('button', { name: CATEGORY_NAME_PLURAL })
      .getByRole('progressbar')
  ).not.toHaveAttribute('aria-valuenow', '0')

  await expect(
    page.getByRole('button', { name: CATEGORY_NAME_PLURAL })
  ).toHaveAttribute('aria-expanded', 'true')
  await expect(
    page
      .getByRole('button', { name: PLACE_NAME })
      .getByLabel('Visited', { exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: PLACE_NAME }).click()
  await page.getByRole('button', { name: 'Validate visit' }).click()

  await expect(
    page.getByRole('button', { name: 'Continue without validating' })
  ).not.toBeVisible()
})

async function fillLoginForm(
  page: Page,
  email = 'test@example.com',
  password = 'Test123456'
) {
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Send' }).click()
}
