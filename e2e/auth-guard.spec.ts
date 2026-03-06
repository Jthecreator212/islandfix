import { test, expect } from '@playwright/test'

test.describe('Auth Guard (Protected Routes)', () => {
  test('redirects /dashboard to /login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirects /dashboard/booking/fake-id to /login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/booking/fake-id')
    await expect(page).toHaveURL(/\/login/)
  })

  test('public pages are accessible without auth', async ({ page }) => {
    // Homepage
    await page.goto('/')
    await expect(page.getByText('Find Trusted Trades')).toBeVisible()

    // Search
    await page.goto('/search')
    await expect(page.getByText('Find Tradespeople')).toBeVisible()

    // Login
    await page.goto('/login')
    await expect(page.getByText('Welcome back')).toBeVisible()

    // Signup
    await page.goto('/signup')
    await expect(page.getByText('Create your account')).toBeVisible()
  })
})
