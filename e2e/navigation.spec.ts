import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('Find Trades link navigates to search page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Find Trades' }).click()
    await expect(page).toHaveURL('/search')
    await expect(page.getByText('Find Tradespeople')).toBeVisible()
  })

  test('Log In link navigates to login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Log In' }).click()
    await expect(page).toHaveURL('/login')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('Sign Up link navigates to signup page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign Up' }).first().click()
    await expect(page).toHaveURL('/signup')
    await expect(page.getByText('Create your account')).toBeVisible()
  })

  test('logo navigates back to homepage', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: 'IslandFix' }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('unauthenticated user accessing dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
