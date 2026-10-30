import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('home page renders the site name', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('client access page shows the gallery form', async ({ page }) => {
    await page.goto('http://localhost:3000/clientes')
    await expect(page.locator('input[name="code"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('unknown gallery returns 404', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/g/no-existe')
    expect(response?.status()).toBe(404)
  })
})
