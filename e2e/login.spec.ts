import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('renders login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByText('Log in to your account')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('Your password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible()
  })

  test('has link to signup page', async ({ page }) => {
    await page.goto('/login')
    const signupLink = page.getByRole('link', { name: 'Sign up' })
    await expect(signupLink).toBeVisible()
    await signupLink.click()
    await expect(page).toHaveURL('/signup')
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('you@example.com').fill('fake@invalid.com')
    await page.getByPlaceholder('Your password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Log In' }).click()

    // Should show an error message (exact text depends on Supabase response)
    await expect(page.locator('.bg-red-50')).toBeVisible({ timeout: 10000 })
  })

  test('email field requires valid format', async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.getByPlaceholder('you@example.com')
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('required', '')
  })

  test('password field is masked', async ({ page }) => {
    await page.goto('/login')
    const passwordInput = page.getByPlaceholder('Your password')
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
